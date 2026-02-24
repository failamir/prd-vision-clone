import { useState } from "react";
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
  Building,
  BarChart3
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend, Line, LineChart } from "recharts";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { OFFICES } from "@/lib/constants";

const getStatusBadge = (status: string) => {
  const statusConfig: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
    pending: { variant: "secondary", label: "Pending" },
    reviewing: { variant: "outline", label: "Reviewing" },
    interview: { variant: "default", label: "Interview" },
    approved: { variant: "default", label: "Approved" },
    rejected: { variant: "destructive", label: "Rejected" },
  };
  const config = statusConfig[status] || { variant: "secondary" as const, label: status };
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

const PICDashboard = () => {
  const navigate = useNavigate();
  const [selectedOffice, setSelectedOffice] = useState<string>("all");

  const {
    stats,
    recentCandidates,
    recentApplications,
    monthlyData,
    loading,
  } = useDashboardData({
    officeFilter: selectedOffice,
    includeMonthlyTrends: true,
    includeRecentCandidates: true,
  });

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
                {OFFICES.map((office) => (
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
              <div className="text-2xl font-bold">{stats.approvedApplications}</div>
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
              <div className="text-2xl font-bold">{stats.totalJobs}</div>
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
                        <p className="font-medium">{candidate.fullName}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{candidate.registrationCity || "Tidak diketahui"}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">
                          {candidate.professionalTitle || "-"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(candidate.createdAt), "dd MMM yyyy")}
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
                        <p className="font-medium">{app.candidateName}</p>
                        <p className="text-sm text-muted-foreground">
                          {app.jobTitle}{app.companyName ? ` - ${app.companyName}` : ""}
                        </p>
                      </div>
                      <div className="text-right space-y-1">
                        {getStatusBadge(app.status)}
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(app.appliedAt), "dd MMM yyyy")}
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
              {OFFICES.filter(o => o.value !== "all").map((office) => (
                <div
                  key={office.value}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${selectedOffice === office.value ? "bg-primary/10 border-primary" : "hover:bg-muted"
                    }`}
                  onClick={() => setSelectedOffice(office.value)}
                  tabIndex={0}
                  role="button"
                  aria-label={`Filter by ${office.label}`}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedOffice(office.value); }}
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
