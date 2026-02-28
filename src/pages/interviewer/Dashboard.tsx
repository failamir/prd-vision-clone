import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, Users, CheckCircle, Clock, FileText } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface Interview {
  id: string;
  interview_date: string;
  interview_result: string | null;
  candidate_profiles: {
    full_name: string;
  } | null;
  jobs: {
    title: string;
  } | null;
}

interface Stats {
  todayInterviews: number;
  pendingResults: number;
  completedInterviews: number;
  totalCandidates: number;
}

const InterviewerDashboard = () => {
  const [stats, setStats] = useState<Stats>({
    todayInterviews: 0,
    pendingResults: 0,
    completedInterviews: 0,
    totalCandidates: 0,
  });
  const [upcomingInterviews, setUpcomingInterviews] = useState<Interview[]>([]);

  useEffect(() => {
    fetchStats();
    fetchUpcomingInterviews();
  }, []);

  const fetchStats = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const [todayResult, pendingResult, completedResult, candidatesResult] = await Promise.all([
        supabase.from("job_applications")
          .select("id", { count: "exact", head: true })
          .eq("interview_date", today),
        supabase.from("job_applications")
          .select("id", { count: "exact", head: true })
          .not("interview_date", "is", null)
          .is("interview_result", null),
        supabase.from("job_applications")
          .select("id", { count: "exact", head: true })
          .not("interview_result", "is", null),
        supabase.from("job_applications")
          .select("id", { count: "exact", head: true })
          .not("interview_date", "is", null),
      ]);

      setStats({
        todayInterviews: todayResult.count || 0,
        pendingResults: pendingResult.count || 0,
        completedInterviews: completedResult.count || 0,
        totalCandidates: candidatesResult.count || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchUpcomingInterviews = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from("job_applications")
        .select(`
          id,
          interview_date,
          interview_result,
          candidate_profiles (full_name),
          jobs (title)
        `)
        .not("interview_date", "is", null)
        .gte("interview_date", today)
        .order("interview_date", { ascending: true })
        .limit(10);

      if (error) throw error;
      setUpcomingInterviews(data || []);
    } catch (error) {
      console.error("Error fetching upcoming interviews:", error);
    }
  };

  const statCards = [
    {
      title: "Interview Hari Ini",
      value: stats.todayInterviews,
      icon: Calendar,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Menunggu Hasil",
      value: stats.pendingResults,
      icon: Clock,
      color: "from-orange-500 to-orange-600",
    },
    {
      title: "Interview Selesai",
      value: stats.completedInterviews,
      icon: CheckCircle,
      color: "from-green-500 to-green-600",
    },
    {
      title: "Total Kandidat",
      value: stats.totalCandidates,
      icon: Users,
      color: "from-purple-500 to-purple-600",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard Interviewer</h1>
          <p className="text-muted-foreground mt-2">Kelola jadwal dan hasil interview</p>
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

        {/* Upcoming Interviews */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">Interview Mendatang</h2>
            <a 
              href="/admin/interviews" 
              className="text-sm text-primary hover:underline"
            >
              Lihat Semua
            </a>
          </div>
          
          {upcomingInterviews.length > 0 ? (
            <div className="space-y-4">
              {upcomingInterviews.map((interview) => (
                <div 
                  key={interview.id} 
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      interview.interview_result 
                        ? 'bg-primary/10 text-primary' 
                        : 'bg-secondary text-secondary-foreground'
                    }`}>
                      {interview.interview_result ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <Calendar className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">
                        {interview.candidate_profiles?.full_name || "Unknown"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {interview.jobs?.title || "No Position"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">
                      {interview.interview_date 
                        ? format(new Date(interview.interview_date), "dd MMM yyyy", { locale: id })
                        : "-"}
                    </p>
                    <p className={`text-sm ${
                      interview.interview_result 
                        ? 'text-primary' 
                        : 'text-accent-foreground'
                    }`}>
                      {interview.interview_result || "Belum ada hasil"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Tidak ada interview yang dijadwalkan</p>
            </div>
          )}
        </Card>

        {/* Quick Actions */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">Aksi Cepat</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/admin/interviews"
              className="p-4 rounded-lg border border-border hover:border-primary transition-colors"
            >
              <Calendar className="w-8 h-8 text-primary mb-2" />
              <h3 className="font-semibold text-foreground">Jadwal Interview</h3>
              <p className="text-sm text-muted-foreground">Lihat semua jadwal interview</p>
            </a>
            <a
              href="/admin/applications"
              className="p-4 rounded-lg border border-border hover:border-primary transition-colors"
            >
              <FileText className="w-8 h-8 text-primary mb-2" />
              <h3 className="font-semibold text-foreground">Aplikasi</h3>
              <p className="text-sm text-muted-foreground">Review aplikasi kandidat</p>
            </a>
            <a
              href="/admin/users"
              className="p-4 rounded-lg border border-border hover:border-primary transition-colors"
            >
              <Users className="w-8 h-8 text-primary mb-2" />
              <h3 className="font-semibold text-foreground">Data Kandidat</h3>
              <p className="text-sm text-muted-foreground">Lihat profil kandidat</p>
            </a>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default InterviewerDashboard;
