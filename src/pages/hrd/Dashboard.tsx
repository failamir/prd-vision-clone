import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Users,
  Calendar,
  Plane,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  UserCheck,
  MapPin,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { OFFICES } from "@/lib/constants";

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

export default function HRDDashboard() {
  const navigate = useNavigate();
  const [selectedOffice, setSelectedOffice] = useState<string>("all");

  const {
    stats,
    recentApplications,
    upcomingDepartures,
    loading,
  } = useDashboardData({
    officeFilter: selectedOffice,
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
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
                {OFFICES.map((office) => (
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
    </>
  );
}
