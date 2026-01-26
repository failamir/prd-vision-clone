import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  FileText, 
  MapPin, 
  Calendar, 
  Ship,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Building,
  BarChart3
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend, Line, LineChart } from "recharts";

const PICDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [selectedOffice, setSelectedOffice] = useState<string>("all");
  const [stats, setStats] = useState({
    totalCandidates: 0,
    pendingApplications: 0,
    scheduledInterviews: 0,
    approvedCandidates: 0,
    upcomingDepartures: 0,
    activeJobs: 0
  });
  const [recentCandidates, setRecentCandidates] = useState<any[]>([]);
  const [recentApplications, setRecentApplications] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);

  const offices = [
    { value: "all", label: "Semua Kantor" },
    { value: "Jakarta", label: "Jakarta" },
    { value: "Surabaya", label: "Surabaya" },
    { value: "Bandung", label: "Bandung" },
    { value: "Yogyakarta", label: "Yogyakarta" },
    { value: "Bali", label: "Bali" }
  ];

  useEffect(() => {
    fetchDashboardData();
    fetchMonthlyTrends();
  }, [selectedOffice]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Build query for candidates based on office filter
      let candidatesQuery = supabase
        .from("candidate_profiles")
        .select("*", { count: "exact" });
      
      if (selectedOffice !== "all") {
        candidatesQuery = candidatesQuery.eq("registration_city", selectedOffice);
      }
      
      const { count: candidateCount } = await candidatesQuery;

      // Get applications with office filter
      let applicationsQuery = supabase
        .from("job_applications")
        .select(`
          *,
          candidate:candidate_profiles!job_applications_candidate_id_fkey(full_name, registration_city),
          job:jobs!job_applications_job_id_fkey(title, company_name)
        `)
        .order("applied_at", { ascending: false });

      if (selectedOffice !== "all") {
        applicationsQuery = applicationsQuery.eq("office_registered", selectedOffice);
      }

      const { data: applications } = await applicationsQuery;

      // Calculate statistics
      const pendingApps = applications?.filter(app => app.status === "pending").length || 0;
      const scheduledInterviews = applications?.filter(app => app.interview_date).length || 0;
      const approvedApps = applications?.filter(app => app.status === "approved").length || 0;

      // Get active jobs count
      const { count: jobsCount } = await supabase
        .from("jobs")
        .select("*", { count: "exact" })
        .eq("is_active", true);

      // Get recent candidates
      let recentCandidatesQuery = supabase
        .from("candidate_profiles")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      if (selectedOffice !== "all") {
        recentCandidatesQuery = recentCandidatesQuery.eq("registration_city", selectedOffice);
      }

      const { data: candidatesData } = await recentCandidatesQuery;

      setStats({
        totalCandidates: candidateCount || 0,
        pendingApplications: pendingApps,
        scheduledInterviews: scheduledInterviews,
        approvedCandidates: approvedApps,
        upcomingDepartures: applications?.filter(app => app.status === "approved").length || 0,
        activeJobs: jobsCount || 0
      });

      setRecentCandidates(candidatesData || []);
      setRecentApplications(applications?.slice(0, 5) || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMonthlyTrends = async () => {
    try {
      // Get data for the last 6 months
      const months = [];
      for (let i = 5; i >= 0; i--) {
        const date = subMonths(new Date(), i);
        const monthStart = startOfMonth(date);
        const monthEnd = endOfMonth(date);
        months.push({
          label: format(date, "MMM yyyy", { locale: idLocale }),
          start: monthStart.toISOString(),
          end: monthEnd.toISOString()
        });
      }

      const monthlyStats = await Promise.all(
        months.map(async (month) => {
          // Get candidates registered this month
          let candidatesQuery = supabase
            .from("candidate_profiles")
            .select("id", { count: "exact" })
            .gte("created_at", month.start)
            .lte("created_at", month.end);

          if (selectedOffice !== "all") {
            candidatesQuery = candidatesQuery.eq("registration_city", selectedOffice);
          }

          const { count: candidateCount } = await candidatesQuery;

          // Get applications this month
          let applicationsQuery = supabase
            .from("job_applications")
            .select("id, status")
            .gte("applied_at", month.start)
            .lte("applied_at", month.end);

          if (selectedOffice !== "all") {
            applicationsQuery = applicationsQuery.eq("office_registered", selectedOffice);
          }

          const { data: applications } = await applicationsQuery;

          const approved = applications?.filter(a => a.status === "approved").length || 0;
          const pending = applications?.filter(a => a.status === "pending").length || 0;
          const interview = applications?.filter(a => a.status === "interview").length || 0;

          return {
            month: month.label,
            kandidat: candidateCount || 0,
            aplikasi: applications?.length || 0,
            approved: approved,
            pending: pending,
            interview: interview
          };
        })
      );

      setMonthlyData(monthlyStats);
    } catch (error) {
      console.error("Error fetching monthly trends:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
      pending: { variant: "secondary", label: "Pending" },
      reviewing: { variant: "outline", label: "Reviewing" },
      interview: { variant: "default", label: "Interview" },
      approved: { variant: "default", label: "Approved" },
      rejected: { variant: "destructive", label: "Rejected" }
    };
    const config = statusConfig[status] || { variant: "secondary" as const, label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">PIC Dashboard</h1>
            <p className="text-muted-foreground">
              Kelola kandidat dan operasional wilayah Anda
            </p>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <Select value={selectedOffice} onValueChange={setSelectedOffice}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Pilih Kantor" />
              </SelectTrigger>
              <SelectContent>
                {offices.map((office) => (
                  <SelectItem key={office.value} value={office.value}>
                    {office.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Kandidat</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCandidates}</div>
              <p className="text-xs text-muted-foreground">
                {selectedOffice === "all" ? "Semua wilayah" : selectedOffice}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingApplications}</div>
              <p className="text-xs text-muted-foreground">Menunggu review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Interview</CardTitle>
              <Calendar className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.scheduledInterviews}</div>
              <p className="text-xs text-muted-foreground">Dijadwalkan</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.approvedCandidates}</div>
              <p className="text-xs text-muted-foreground">Diterima</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Departures</CardTitle>
              <Ship className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.upcomingDepartures}</div>
              <p className="text-xs text-muted-foreground">Siap berangkat</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Lowongan Aktif</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeJobs}</div>
              <p className="text-xs text-muted-foreground">Posisi tersedia</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button 
            variant="outline" 
            className="h-auto py-4 flex flex-col items-center gap-2"
            onClick={() => navigate("/admin/applications")}
          >
            <FileText className="h-5 w-5" />
            <span>Kelola Aplikasi</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-auto py-4 flex flex-col items-center gap-2"
            onClick={() => navigate("/admin/interviews")}
          >
            <Calendar className="h-5 w-5" />
            <span>Jadwal Interview</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-auto py-4 flex flex-col items-center gap-2"
            onClick={() => navigate("/admin/departures")}
          >
            <Ship className="h-5 w-5" />
            <span>Departures</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-auto py-4 flex flex-col items-center gap-2"
            onClick={() => navigate("/admin/message-center")}
          >
            <Building className="h-5 w-5" />
            <span>Message Center</span>
          </Button>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Candidates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Kandidat Terbaru
              </CardTitle>
              <CardDescription>
                Kandidat yang baru mendaftar di wilayah Anda
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-4 text-muted-foreground">Loading...</div>
              ) : recentCandidates.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  Tidak ada kandidat baru
                </div>
              ) : (
                <div className="space-y-4">
                  {recentCandidates.map((candidate) => (
                    <div key={candidate.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                      <div>
                        <p className="font-medium">{candidate.full_name}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{candidate.registration_city || "Tidak diketahui"}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">
                          {candidate.professional_title || "-"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(candidate.created_at), "dd MMM yyyy")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Applications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Aplikasi Terbaru
              </CardTitle>
              <CardDescription>
                Aplikasi yang masuk dari wilayah Anda
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-4 text-muted-foreground">Loading...</div>
              ) : recentApplications.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  Tidak ada aplikasi baru
                </div>
              ) : (
                <div className="space-y-4">
                  {recentApplications.map((app) => (
                    <div key={app.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                      <div>
                        <p className="font-medium">{app.candidate?.full_name || "Unknown"}</p>
                        <p className="text-sm text-muted-foreground">
                          {app.job?.title} - {app.job?.company_name}
                        </p>
                      </div>
                      <div className="text-right space-y-1">
                        {getStatusBadge(app.status)}
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(app.applied_at), "dd MMM yyyy")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Monthly Performance Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recruitment Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Tren Rekrutmen Bulanan
              </CardTitle>
              <CardDescription>
                Kandidat baru dan aplikasi per bulan {selectedOffice !== "all" ? `- ${selectedOffice}` : ""}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="month" 
                    className="text-xs"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    className="text-xs"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }}
                  />
                  <Legend />
                  <Bar dataKey="kandidat" name="Kandidat Baru" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="aplikasi" name="Total Aplikasi" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Application Status Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Tren Status Aplikasi
              </CardTitle>
              <CardDescription>
                Performa persetujuan aplikasi per bulan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="month" 
                    className="text-xs"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    className="text-xs"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="approved" 
                    name="Approved" 
                    stroke="#22c55e" 
                    strokeWidth={2}
                    dot={{ fill: '#22c55e' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="interview" 
                    name="Interview" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="pending" 
                    name="Pending" 
                    stroke="#eab308" 
                    strokeWidth={2}
                    dot={{ fill: '#eab308' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Office Performance Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Ringkasan Performa Wilayah
            </CardTitle>
            <CardDescription>
              Statistik kandidat berdasarkan kantor registrasi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {offices.filter(o => o.value !== "all").map((office) => (
                <div 
                  key={office.value}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    selectedOffice === office.value ? "bg-primary/10 border-primary" : "hover:bg-muted"
                  }`}
                  onClick={() => setSelectedOffice(office.value)}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{office.label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Klik untuk filter
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default PICDashboard;
