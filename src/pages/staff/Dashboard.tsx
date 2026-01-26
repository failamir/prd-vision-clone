import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Users, Briefcase, FileText, Calendar } from "lucide-react";

interface Stats {
  totalCandidates: number;
  activeJobs: number;
  pendingApplications: number;
  scheduledInterviews: number;
}

const StaffDashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalCandidates: 0,
    activeJobs: 0,
    pendingApplications: 0,
    scheduledInterviews: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [candidatesResult, jobsResult, pendingResult, interviewsResult] = await Promise.all([
        supabase.from("candidate_profiles").select("id", { count: "exact", head: true }),
        supabase.from("jobs").select("id", { count: "exact", head: true }).eq("is_active", true),
        supabase.from("job_applications").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("job_applications").select("id", { count: "exact", head: true }).not("interview_date", "is", null),
      ]);

      setStats({
        totalCandidates: candidatesResult.count || 0,
        activeJobs: jobsResult.count || 0,
        pendingApplications: pendingResult.count || 0,
        scheduledInterviews: interviewsResult.count || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const statCards = [
    {
      title: "Total Kandidat",
      value: stats.totalCandidates,
      icon: Users,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Lowongan Aktif",
      value: stats.activeJobs,
      icon: Briefcase,
      color: "from-green-500 to-green-600",
    },
    {
      title: "Aplikasi Pending",
      value: stats.pendingApplications,
      icon: FileText,
      color: "from-orange-500 to-orange-600",
    },
    {
      title: "Interview Terjadwal",
      value: stats.scheduledInterviews,
      icon: Calendar,
      color: "from-purple-500 to-purple-600",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard Staff</h1>
          <p className="text-muted-foreground mt-2">Selamat datang di panel staff</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat) => (
            <Card key={stat.title} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold text-foreground mt-2">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">Aksi Cepat</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/admin/applications"
              className="p-4 rounded-lg border border-border hover:border-primary transition-colors"
            >
              <FileText className="w-8 h-8 text-primary mb-2" />
              <h3 className="font-semibold text-foreground">Lihat Aplikasi</h3>
              <p className="text-sm text-muted-foreground">Review aplikasi kandidat</p>
            </a>
            <a
              href="/admin/users"
              className="p-4 rounded-lg border border-border hover:border-primary transition-colors"
            >
              <Users className="w-8 h-8 text-primary mb-2" />
              <h3 className="font-semibold text-foreground">Data Kandidat</h3>
              <p className="text-sm text-muted-foreground">Kelola data kandidat</p>
            </a>
            <a
              href="/admin/messages"
              className="p-4 rounded-lg border border-border hover:border-primary transition-colors"
            >
              <Calendar className="w-8 h-8 text-primary mb-2" />
              <h3 className="font-semibold text-foreground">Pesan</h3>
              <p className="text-sm text-muted-foreground">Lihat dan balas pesan</p>
            </a>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default StaffDashboard;
