import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Applications from './Applications';
import { supabase } from '@/integrations/supabase/client';

// Mock the Supabase client
vi.mock('@/integrations/supabase/client', () => ({
    supabase: {
        auth: {
            getUser: vi.fn(),
        },
        from: vi.fn(),
    },
}));

// Mock the DashboardLayout so it renders children normally
vi.mock('@/components/dashboard/DashboardLayout', () => ({
    DashboardLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

// Mock the ApplicationStatusDialog to prevent nested rendering issues
vi.mock('@/components/candidate/ApplicationStatusDialog', () => ({
    ApplicationStatusDialog: () => <div data-testid="status-dialog" />
}));

const mockToast = vi.fn();
vi.mock('@/hooks/use-toast', () => ({
    useToast: () => ({
        toast: mockToast,
    }),
}));

const renderApplications = () => {
    render(
        <BrowserRouter>
            <Applications />
        </BrowserRouter>
    );
};

describe('Candidate Applications Page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders loading state initially', () => {
        (supabase.auth.getUser as ReturnType<typeof vi.fn>).mockImplementation(
            () => new Promise(() => { }) // pending promise keeps it loading
        );

        renderApplications();
        // The loader icon uses the lucide-react Loader2 component, which doesn't have a role by default.
        // We can check if the main layout is loading by checking if the main text is missing.
        expect(screen.queryByText('My Applications')).not.toBeInTheDocument();
    });

    it('renders empty state when no applications found', async () => {
        // 1. Mock getUser
        (supabase.auth.getUser as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
            data: { user: { id: 'test-user-id' } },
        });

        const mockSelectApplications = vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
                order: vi.fn().mockResolvedValue({
                    data: [], // Empty array
                    error: null,
                }),
            }),
        });

        const mockSelectProfile = vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
                maybeSingle: vi.fn().mockResolvedValue({
                    data: { id: 'test-profile-id' },
                    error: null,
                }),
            }),
        });

        // 2. Mock from() logic
        (supabase.from as ReturnType<typeof vi.fn>).mockImplementation((table: string) => {
            if (table === 'candidate_profiles') {
                return { select: mockSelectProfile };
            }
            if (table === 'job_applications') {
                return { select: mockSelectApplications };
            }
            return { select: vi.fn() };
        });

        renderApplications();

        await waitFor(() => {
            expect(screen.getByText('My Applications')).toBeInTheDocument();
            expect(screen.getByText('No applications yet')).toBeInTheDocument();
            expect(screen.getByText('Start applying to jobs to see your applications here')).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /browse jobs/i })).toBeInTheDocument();
        });
    });

    it('renders list of applications correctly', async () => {
        // 1. Mock getUser
        (supabase.auth.getUser as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
            data: { user: { id: 'test-user-id' } },
        });

        const mockApplications = [
            {
                id: 'app-1',
                status: 'pending',
                cover_letter: 'I am a great fit for this role.',
                applied_at: '2025-10-15T10:00:00Z',
                job: {
                    id: 'job-1',
                    title: 'Software Engineer',
                    company_name: 'Tech Corp',
                    location: 'Jakarta',
                    job_type: 'Full-time'
                }
            }
        ];

        const mockSelectApplications = vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
                order: vi.fn().mockResolvedValue({
                    data: mockApplications,
                    error: null,
                }),
            }),
        });

        const mockSelectProfile = vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
                maybeSingle: vi.fn().mockResolvedValue({
                    data: { id: 'test-profile-id' },
                    error: null,
                }),
            }),
        });

        // 2. Mock from() logic
        (supabase.from as ReturnType<typeof vi.fn>).mockImplementation((table: string) => {
            if (table === 'candidate_profiles') {
                return { select: mockSelectProfile };
            }
            if (table === 'job_applications') {
                return { select: mockSelectApplications };
            }
            return { select: vi.fn() };
        });

        renderApplications();

        await waitFor(() => {
            expect(screen.getByText('My Applications')).toBeInTheDocument();

            // Verify job details are rendered
            expect(screen.getByText('Software Engineer')).toBeInTheDocument();
            expect(screen.getByText('Tech Corp')).toBeInTheDocument();
            expect(screen.getByText('Full-time')).toBeInTheDocument();
            expect(screen.getByText('Pending')).toBeInTheDocument(); // Title-cased from 'pending'

            // Verify Cover Letter renders
            expect(screen.getByText('I am a great fit for this role.')).toBeInTheDocument();
        });
    });
});
