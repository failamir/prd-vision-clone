import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Register from './Register';
import { supabase } from '@/integrations/supabase/client';

// Mock the Supabase client
vi.mock('@/integrations/supabase/client', () => ({
    supabase: {
        auth: {
            getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
            signUp: vi.fn(),
        },
        from: vi.fn(() => ({
            select: vi.fn(() => ({
                eq: vi.fn(() => ({
                    maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null })
                })),
            })),
        })),
        functions: {
            invoke: vi.fn(),
        }
    },
}));

// Mock the toast hook
const mockToast = vi.fn();
vi.mock('@/hooks/use-toast', () => ({
    useToast: () => ({
        toast: mockToast,
    }),
}));

const renderRegister = () => {
    render(
        <BrowserRouter>
            <Register />
        </BrowserRouter>
    );
};

describe('Register Page', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        // Default URL to have ?job parameter to avoid dialog showing for basic testing
        Object.defineProperty(window, 'location', {
            value: {
                search: '?job=123',
                origin: 'http://localhost'
            },
            writable: true,
        });
    });

    it('renders registration form elements correctly', () => {
        Object.defineProperty(window, 'location', { value: { search: '?job=123' } });
        renderRegister();

        expect(screen.getByText('Create Your Account')).toBeInTheDocument();
        expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/^password \*/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument();
    });

    it('validates empty form submissions and shows errors', async () => {
        Object.defineProperty(window, 'location', { value: { search: '?job=123' } });
        renderRegister();

        // Click continue without filling
        fireEvent.click(screen.getByRole('button', { name: /continue/i }));

        await waitFor(() => {
            // Expect validation error blocks to show up
            expect(screen.getByText('First name is required')).toBeInTheDocument();
            expect(screen.getByText('Last name is required')).toBeInTheDocument();
            expect(screen.getByText('Email is required')).toBeInTheDocument();
            expect(screen.getByText('Password is required')).toBeInTheDocument();
            expect(screen.getByText('You must agree to the terms and conditions')).toBeInTheDocument();
        });
    });

    it('sends OTP on valid form submission', async () => {
        Object.defineProperty(window, 'location', { value: { search: '?job=123' } });

        // Simulate API success
        const mockInvoke = supabase.functions.invoke as ReturnType<typeof vi.fn>;
        mockInvoke.mockResolvedValueOnce({
            data: { success: true }
        });

        renderRegister();

        // Fill the inputs with valid values
        fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'John' } });
        fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Doe' } });
        fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'john@example.com' } });
        fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: '+628123456789' } });
        fireEvent.change(screen.getByLabelText(/^password \*/i), { target: { value: 'password123' } });
        fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password123' } });

        // Check agreed to terms
        fireEvent.click(screen.getByRole('checkbox', { name: /i agree to the/i }));

        // Click Continue
        fireEvent.click(screen.getByRole('button', { name: /continue/i }));

        // Let the validation and async logic complete
        await waitFor(() => {
            expect(mockInvoke).toHaveBeenCalledWith('send-otp', expect.objectContaining({
                body: { email: 'john@example.com', firstName: 'John' }
            }));

            expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
                title: 'Verification Code Sent',
            }));
        });
    });
});
