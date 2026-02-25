import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Login from './Login';
import { supabase } from '@/integrations/supabase/client';

// Mock the Supabase client
vi.mock('@/integrations/supabase/client', () => ({
    supabase: {
        auth: {
            signInWithPassword: vi.fn(),
            getUser: vi.fn(),
            getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
        },
        from: vi.fn(() => ({
            select: vi.fn(() => ({
                eq: vi.fn(),
            })),
        })),
    },
}));

// Mock the toast hook
const mockToast = vi.fn();
vi.mock('@/hooks/use-toast', () => ({
    useToast: () => ({
        toast: mockToast,
    }),
}));

const renderLogin = () => {
    render(
        <BrowserRouter>
            <Login />
        </BrowserRouter>
    );
};

describe('Login Page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders login form elements', () => {
        renderLogin();

        expect(screen.getByText('Welcome Back')).toBeInTheDocument();
        expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('shows error toast on invalid credentials', async () => {
        // Setup the mock to reject
        const mockSignIn = supabase.auth.signInWithPassword as ReturnType<typeof vi.fn>;
        mockSignIn.mockResolvedValueOnce({
            data: { user: null, session: null },
            error: { message: 'Invalid login credentials' }
        });

        renderLogin();

        // Fill form
        fireEvent.change(screen.getByLabelText(/email address/i), {
            target: { value: 'wrong@example.com' },
        });
        fireEvent.change(screen.getByLabelText(/password/i), {
            target: { value: 'wrongpassword' },
        });

        // Submit form
        fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

        // Wait for the async logic and check if toast was called with error
        await waitFor(() => {
            expect(mockSignIn).toHaveBeenCalledWith({
                email: 'wrong@example.com',
                password: 'wrongpassword',
            });
            expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
                variant: 'destructive',
                title: 'Login failed',
            }));
        });
    });

    it('calls auth and redirects for admin user', async () => {
        // Setup the mock to succeed
        const mockSignIn = supabase.auth.signInWithPassword as ReturnType<typeof vi.fn>;
        const mockGetUser = supabase.auth.getUser as ReturnType<typeof vi.fn>;

        mockSignIn.mockResolvedValueOnce({
            data: { user: { id: 'some-user-id' } },
            error: null
        });

        // Setup the second call (getUser) inside redirectBasedOnRole
        mockGetUser.mockResolvedValueOnce({
            data: { user: { id: 'some-user-id' } },
            error: null
        });

        // Setup the role retrieve 
        (supabase.from as ReturnType<typeof vi.fn>).mockImplementationOnce(() => ({
            select: vi.fn(() => ({
                eq: vi.fn().mockResolvedValueOnce({ data: [{ role: 'admin' }], error: null }),
            })),
        }));

        renderLogin();

        // Fill form with admin user credentials that user provided
        fireEvent.change(screen.getByLabelText(/email address/i), {
            target: { value: 'admin@ciptawiratirta.com' },
        });
        fireEvent.change(screen.getByLabelText(/password/i), {
            target: { value: 'c1pt4w1r4' },
        });

        // Submit form
        fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

        // Expect loading state text on button
        expect(screen.getByRole('button', { name: /signing in\.\.\./i })).toBeInTheDocument();

        await waitFor(() => {
            expect(mockSignIn).toHaveBeenCalledWith({
                email: 'admin@ciptawiratirta.com',
                password: 'c1pt4w1r4',
            });
            expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
                title: 'Welcome back!',
            }));
        });
    });
});
