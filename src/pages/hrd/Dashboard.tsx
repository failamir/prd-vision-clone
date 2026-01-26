import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Loader2, 
  Users, 
  Briefcase, 
  Calendar, 
  Plane, 
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  TrendingUp,
  UserCheck,
  MapPin,
  Building
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DashboardStats {
  totalCandidates: number;
  pendingApplications: number;
  scheduledInterviews: number;
  upcomingDepartures: number;
  approvedApplications: number;
  rejectedApplications: number;
}

interface RecentApplication {
  id: string;
  candidateName: string;
  jobTitle: string;
  status: string;
  appliedAt: string;
}

interface UpcomingDeparture {
  id: string;
  candidateName: string;
  jobTitle: string;
  status: string;
}

const offices = [
  { value: "all", label: "Semua Kantor" },
  { value: "Jakarta", label: "Jakarta" },
  { value: "Surabaya", label: "Surabaya" },
  { value: "Bandung", label: "Bandung" },
  { value: "Yogyakarta", label: "Yogyakarta" },
  { value: "Bali", label: "Bali" }
];

export default function HRDDashboard() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [selectedOffice, setSelectedOffice] = useState<string>("all");
  const [stats, setStats] = useState<DashboardStats>({
    totalCandidates: 0,
    pendingApplications: 0,
    scheduledInterviews: 0,
    upcomingDepartures: 0,
    approvedApplications: 0,
    rejectedApplications: 0,
  });
  const [recentApplications, setRecentApplications] = useState<RecentApplication[]>([]);
  const [upcomingDepartures, setUpcomingDepartures] = useState<UpcomingDeparture[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, [selectedOffice]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch total candidates with office filter
      let candidatesQuery = supabase
        .from("candidate_profiles")
        .select("*", { count: "exact", head: true });
      
      if (selectedOffice !== "all") {
        candidatesQuery = candidatesQuery.eq("registration_city", selectedOffice);
      }
      
      const { count: candidatesCount } = await candidatesQuery;

      // Fetch applications with different statuses and office filter
      let applicationsQuery = supabase
        .from("job_applications")
        .select(`
          id,
          status,
          applied_at,
          office_registered,
          candidate_profiles (full_name, registration_city),
          jobs (title)
        `)
        .order("applied_at", { ascending: false });

      if (selectedOffice !== "all") {
        applicationsQuery = applicationsQuery.eq("office_registered", selectedOffice);
      }

      const { data: applications } = await applicationsQuery;

      const pendingCount = applications?.filter(a => a.status === "pending").length || 0;
      const approvedCount = applications?.filter(a => a.status === "approved" || a.status === "hired").length || 0;
      const rejectedCount = applications?.filter(a => a.status === "rejected").length || 0;

      // Get recent applications
      const recentApps: RecentApplication[] = (applications || []).slice(0, 5).map((app: any) => ({
        id: app.id,
        candidateName: app.candidate_profiles?.full_name || "Unknown",
        jobTitle: app.jobs?.title || "Unknown Position",
        status: app.status || "pending",
        appliedAt: app.applied_at,
      }));

      // Fetch applications with interview scheduled
      let interviewQuery = supabase
        .from("job_applications")
        .select("id, office_registered")
        .not("interview_date", "is", null);

      if (selectedOffice !== "all") {
        interviewQuery = interviewQuery.eq("office_registered", selectedOffice);
      }

      const { data: interviewApps } = await interviewQuery;

      // Fetch applications with departure info (approved/hired status)
      let departureQuery = supabase
        .from("job_applications")
        .select(`
          id,
          office_registered,
          candidate_profiles (full_name),
          jobs (title),
          status
        `)
        .in("status", ["approved", "hired"])
        .limit(5);

      if (selectedOffice !== "all") {
        departureQuery = departureQuery.eq("office_registered", selectedOffice);
      }

      const { data: departureApps } = await departureQuery;

      const departures: UpcomingDeparture[] = (departureApps || []).map((app: any) => ({
        id: app.id,
        candidateName: app.candidate_profiles?.full_name || "Unknown",
        jobTitle: app.jobs?.title || "Unknown Position",
        status: app.status,
      }));

      setStats({
        totalCandidates: candidatesCount || 0,
        pendingApplications: pendingCount,
        scheduledInterviews: interviewApps?.length || 0,
        upcomingDepartures: departures.length,
        approvedApplications: approvedCount,
        rejectedApplications: rejectedCount,
      });

      setRecentApplications(recentApps);
      setUpcomingDepartures(departures);
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
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case "approved":
      case "hired":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      case "interview":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200"><Calendar className="w-3 h-3 mr-1" />Interview</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">HRD Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Kelola kandidat, aplikasi, dan jadwal keberangkatan
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

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Kandidat</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCandidates}</div>
              <p className="text-xs text-muted-foreground">Terdaftar di sistem</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pendingApplications}</div>
              <p className="text-xs text-muted-foreground">Menunggu review</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Interview</CardTitle>
              <Calendar className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.scheduledInterviews}</div>
              <p className="text-xs text-muted-foreground">Dijadwalkan</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.approvedApplications}</div>
              <p className="text-xs text-muted-foreground">Diterima</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.rejectedApplications}</div>
              <p className="text-xs text-muted-foreground">Ditolak</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Departures</CardTitle>
              <Plane className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.upcomingDepartures}</div>
              <p className="text-xs text-muted-foreground">Siap berangkat</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-4">
          <Button 
            onClick={() => navigate("/admin/applications")} 
            className="h-auto py-4 flex flex-col items-center gap-2"
          >
            <FileText className="h-5 w-5" />
            <span>Kelola Aplikasi</span>
          </Button>
          <Button 
            onClick={() => navigate("/admin/interviews")} 
            variant="outline"
            className="h-auto py-4 flex flex-col items-center gap-2"
          >
            <Calendar className="h-5 w-5" />
            <span>Jadwal Interview</span>
          </Button>
          <Button 
            onClick={() => navigate("/admin/departures")} 
            variant="outline"
            className="h-auto py-4 flex flex-col items-center gap-2"
          >
            <Plane className="h-5 w-5" />
            <span>Jadwal Keberangkatan</span>
          </Button>
          <Button 
            onClick={() => navigate("/admin/message-center")} 
            variant="outline"
            className="h-auto py-4 flex flex-col items-center gap-2"
          >
            <Users className="h-5 w-5" />
            <span>Kirim Pesan</span>
          </Button>
        </div>

        {/* Content Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Applications */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Aplikasi Terbaru</CardTitle>
                  <CardDescription>5 aplikasi terakhir yang masuk</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate("/admin/applications")}>
                  Lihat Semua <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {recentApplications.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">Belum ada aplikasi</p>
              ) : (
                <div className="space-y-4">
                  {recentApplications.map((app) => (
                    <div key={app.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                      <div className="flex-1">
                        <p className="font-medium">{app.candidateName}</p>
                        <p className="text-sm text-muted-foreground">{app.jobTitle}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(app.appliedAt), "dd MMM yyyy")}
                        </p>
                      </div>
                      {getStatusBadge(app.status)}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Departures */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Kandidat Siap Berangkat</CardTitle>
                  <CardDescription>Kandidat yang sudah approved</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate("/admin/departures")}>
                  Lihat Semua <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {upcomingDepartures.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">Belum ada kandidat siap berangkat</p>
              ) : (
                <div className="space-y-4">
                  {upcomingDepartures.map((dep) => (
                    <div key={dep.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <UserCheck className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{dep.candidateName}</p>
                          <p className="text-sm text-muted-foreground">{dep.jobTitle}</p>
                        </div>
                      </div>
                      {getStatusBadge(dep.status)}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
