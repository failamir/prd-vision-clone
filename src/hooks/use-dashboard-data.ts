import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { subMonths, startOfMonth, endOfMonth, format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import type {
    DashboardStats,
    RecentApplication,
    RecentCandidate,
    UpcomingDeparture,
    MonthlyTrend,
} from "@/types/dashboard";

interface UseDashboardDataOptions {
    officeFilter?: string;
    includeMonthlyTrends?: boolean;
    includeRecentCandidates?: boolean;
}

interface UseDashboardDataReturn {
    stats: DashboardStats;
    recentApplications: RecentApplication[];
    recentCandidates: RecentCandidate[];
    upcomingDepartures: UpcomingDeparture[];
    monthlyData: MonthlyTrend[];
    loading: boolean;
    refetch: () => Promise<void>;
}

const DEFAULT_STATS: DashboardStats = {
    totalCandidates: 0,
    totalJobs: 0,
    pendingApplications: 0,
    scheduledInterviews: 0,
    approvedApplications: 0,
    rejectedApplications: 0,
    upcomingDepartures: 0,
};

export const useDashboardData = (
    options: UseDashboardDataOptions = {}
): UseDashboardDataReturn => {
    const {
        officeFilter = "all",
        includeMonthlyTrends = false,
        includeRecentCandidates = false,
    } = options;

    const { toast } = useToast();
    const [stats, setStats] = useState<DashboardStats>(DEFAULT_STATS);
    const [recentApplications, setRecentApplications] = useState<RecentApplication[]>([]);
    const [recentCandidates, setRecentCandidates] = useState<RecentCandidate[]>([]);
    const [upcomingDepartures, setUpcomingDepartures] = useState<UpcomingDeparture[]>([]);
    const [monthlyData, setMonthlyData] = useState<MonthlyTrend[]>([]);
    const [loading, setLoading] = useState(true);

    const applyOfficeFilter = useCallback(
        <T extends { eq: (col: string, val: string) => T }>(
            query: T,
            column: string
        ): T => {
            if (officeFilter !== "all") {
                return query.eq(column, officeFilter);
            }
            return query;
        },
        [officeFilter]
    );

    const fetchStats = useCallback(async (): Promise<DashboardStats> => {
        // Fetch total candidates
        let candidatesQuery = supabase
            .from("candidate_profiles")
            .select("id", { count: "exact", head: true });
        if (officeFilter !== "all") {
            candidatesQuery = candidatesQuery.eq("registration_city", officeFilter);
        }
        const { count: candidatesCount } = await candidatesQuery;

        // Fetch total jobs
        const { count: jobsCount } = await supabase
            .from("jobs")
            .select("id", { count: "exact", head: true })
            .eq("is_active", true);

        // Fetch applications with status breakdown
        let applicationsQuery = supabase
            .from("job_applications")
            .select("id, status, interview_date, office_registered");
        if (officeFilter !== "all") {
            applicationsQuery = applicationsQuery.eq("office_registered", officeFilter);
        }
        const { data: applications } = await applicationsQuery;

        const pending = applications?.filter((a) => a.status === "pending").length || 0;
        const approved =
            applications?.filter(
                (a) => a.status === "approved" || a.status === "hired"
            ).length || 0;
        const rejected = applications?.filter((a) => a.status === "rejected").length || 0;
        const interviews = applications?.filter((a) => a.interview_date).length || 0;
        const departures = approved; // approved candidates are considered upcoming departures

        return {
            totalCandidates: candidatesCount || 0,
            totalJobs: jobsCount || 0,
            pendingApplications: pending,
            scheduledInterviews: interviews,
            approvedApplications: approved,
            rejectedApplications: rejected,
            upcomingDepartures: departures,
        };
    }, [officeFilter]);

    const fetchRecentApplications = useCallback(async (): Promise<RecentApplication[]> => {
        let query = supabase
            .from("job_applications")
            .select(
                `
        id,
        status,
        applied_at,
        office_registered,
        candidate_profiles (full_name),
        jobs (title, company_name)
      `
            )
            .order("applied_at", { ascending: false })
            .limit(5);

        if (officeFilter !== "all") {
            query = query.eq("office_registered", officeFilter);
        }

        const { data } = await query;

        return (data || []).map((app: any) => ({
            id: app.id,
            candidateName: app.candidate_profiles?.full_name || "Unknown",
            jobTitle: app.jobs?.title || "Unknown Position",
            companyName: app.jobs?.company_name || "",
            status: app.status || "pending",
            appliedAt: app.applied_at,
        }));
    }, [officeFilter]);

    const fetchRecentCandidates = useCallback(async (): Promise<RecentCandidate[]> => {
        let query = supabase
            .from("candidate_profiles")
            .select("id, full_name, registration_city, professional_title, created_at")
            .order("created_at", { ascending: false })
            .limit(5);

        if (officeFilter !== "all") {
            query = query.eq("registration_city", officeFilter);
        }

        const { data } = await query;

        return (data || []).map((c: any) => ({
            id: c.id,
            fullName: c.full_name,
            registrationCity: c.registration_city,
            professionalTitle: c.professional_title,
            createdAt: c.created_at,
        }));
    }, [officeFilter]);

    const fetchUpcomingDepartures = useCallback(async (): Promise<UpcomingDeparture[]> => {
        let query = supabase
            .from("job_applications")
            .select(
                `
        id,
        status,
        office_registered,
        candidate_profiles (full_name),
        jobs (title)
      `
            )
            .in("status", ["approved", "hired"])
            .limit(5);

        if (officeFilter !== "all") {
            query = query.eq("office_registered", officeFilter);
        }

        const { data } = await query;

        return (data || []).map((app: any) => ({
            id: app.id,
            candidateName: app.candidate_profiles?.full_name || "Unknown",
            jobTitle: app.jobs?.title || "Unknown Position",
            status: app.status,
        }));
    }, [officeFilter]);

    const fetchMonthlyTrends = useCallback(async (): Promise<MonthlyTrend[]> => {
        const months = [];
        for (let i = 5; i >= 0; i--) {
            const date = subMonths(new Date(), i);
            months.push({
                label: format(date, "MMM yyyy", { locale: idLocale }),
                start: startOfMonth(date).toISOString(),
                end: endOfMonth(date).toISOString(),
            });
        }

        const monthlyStats = await Promise.all(
            months.map(async (month) => {
                let candidatesQuery = supabase
                    .from("candidate_profiles")
                    .select("id", { count: "exact" })
                    .gte("created_at", month.start)
                    .lte("created_at", month.end);

                if (officeFilter !== "all") {
                    candidatesQuery = candidatesQuery.eq("registration_city", officeFilter);
                }

                const { count: candidateCount } = await candidatesQuery;

                let applicationsQuery = supabase
                    .from("job_applications")
                    .select("id, status")
                    .gte("applied_at", month.start)
                    .lte("applied_at", month.end);

                if (officeFilter !== "all") {
                    applicationsQuery = applicationsQuery.eq("office_registered", officeFilter);
                }

                const { data: applications } = await applicationsQuery;

                return {
                    month: month.label,
                    kandidat: candidateCount || 0,
                    aplikasi: applications?.length || 0,
                    approved: applications?.filter((a) => a.status === "approved").length || 0,
                    pending: applications?.filter((a) => a.status === "pending").length || 0,
                    interview: applications?.filter((a) => a.status === "interview").length || 0,
                };
            })
        );

        return monthlyStats;
    }, [officeFilter]);

    const refetch = useCallback(async () => {
        setLoading(true);
        try {
            const [
                statsResult,
                recentAppsResult,
                departuresResult,
                recentCandidatesResult,
                monthlyResult,
            ] = await Promise.all([
                fetchStats(),
                fetchRecentApplications(),
                fetchUpcomingDepartures(),
                includeRecentCandidates ? fetchRecentCandidates() : Promise.resolve([]),
                includeMonthlyTrends ? fetchMonthlyTrends() : Promise.resolve([]),
            ]);

            setStats(statsResult);
            setRecentApplications(recentAppsResult);
            setUpcomingDepartures(departuresResult);
            setRecentCandidates(recentCandidatesResult);
            setMonthlyData(monthlyResult);
        } catch (error: any) {
            console.error("Error fetching dashboard data:", error);
            toast({
                title: "Error",
                description: "Failed to load dashboard data",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    }, [
        fetchStats,
        fetchRecentApplications,
        fetchUpcomingDepartures,
        fetchRecentCandidates,
        fetchMonthlyTrends,
        includeRecentCandidates,
        includeMonthlyTrends,
        toast,
    ]);

    useEffect(() => {
        refetch();
    }, [refetch]);

    return {
        stats,
        recentApplications,
        recentCandidates,
        upcomingDepartures,
        monthlyData,
        loading,
        refetch,
    };
};
