export interface DashboardStats {
    totalCandidates: number;
    totalJobs: number;
    pendingApplications: number;
    scheduledInterviews: number;
    approvedApplications: number;
    rejectedApplications: number;
    upcomingDepartures: number;
}

export interface RecentApplication {
    id: string;
    candidateName: string;
    jobTitle: string;
    companyName?: string;
    status: string;
    appliedAt: string;
}

export interface RecentCandidate {
    id: string;
    fullName: string;
    registrationCity: string | null;
    professionalTitle: string | null;
    createdAt: string;
}

export interface UpcomingDeparture {
    id: string;
    candidateName: string;
    jobTitle: string;
    status: string;
}

export interface MonthlyTrend {
    month: string;
    kandidat: number;
    aplikasi: number;
    approved: number;
    pending: number;
    interview: number;
}

export interface OfficeOption {
    value: string;
    label: string;
}
