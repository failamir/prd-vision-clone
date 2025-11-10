import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Users, Briefcase, FileText, TrendingUp } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

interface Stats {
  totalUsers: number;
  totalJobs: number;
  totalApplications: number;
  pendingApplications: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalJobs: 0,
    totalApplications: 0,
    pendingApplications: 0,
  });
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    fetchStats();
    fetchChartData();
  }, []);

  const fetchStats = async () => {
    try {
      const [usersResult, jobsResult, applicationsResult, pendingResult] = await Promise.all([
        supabase.from("candidate_profiles").select("id", { count: "exact", head: true }),
        supabase.from("jobs").select("id", { count: "exact", head: true }),
        supabase.from("job_applications").select("id", { count: "exact", head: true }),
        supabase.from("job_applications").select("id", { count: "exact", head: true }).eq("status", "pending"),
      ]);

      setStats({
        totalUsers: usersResult.count || 0,
        totalJobs: jobsResult.count || 0,
        totalApplications: applicationsResult.count || 0,
        pendingApplications: pendingResult.count || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchChartData = async () => {
    try {
      const { data: applications } = await supabase
        .from("job_applications")
        .select("status")
        .order("status");

      if (applications) {
        const statusCounts = applications.reduce((acc: any, app) => {
          acc[app.status] = (acc[app.status] || 0) + 1;
          return acc;
        }, {});

        const chartData = Object.entries(statusCounts).map(([status, count]) => ({
          status: status.charAt(0).toUpperCase() + status.slice(1),
          count,
        }));

        setChartData(chartData);
      }
    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
  };

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Total Jobs",
      value: stats.totalJobs,
      icon: Briefcase,
      color: "from-green-500 to-green-600",
    },
    {
      title: "Total Applications",
      value: stats.totalApplications,
      icon: FileText,
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Pending Applications",
      value: stats.pendingApplications,
      icon: TrendingUp,
      color: "from-orange-500 to-orange-600",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-2">Overview of your platform statistics</p>
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

        {/* Chart */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-foreground mb-6">Applications by Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="status" className="text-sm" />
              <YAxis className="text-sm" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px"
                }}
              />
              <Bar dataKey="count" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Recent Activity */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/admin/users"
              className="p-4 rounded-lg border border-border hover:border-primary transition-colors"
            >
              <Users className="w-8 h-8 text-primary mb-2" />
              <h3 className="font-semibold text-foreground">Manage Users</h3>
              <p className="text-sm text-muted-foreground">View and manage user accounts</p>
            </a>
            <a
              href="/admin/jobs"
              className="p-4 rounded-lg border border-border hover:border-primary transition-colors"
            >
              <Briefcase className="w-8 h-8 text-primary mb-2" />
              <h3 className="font-semibold text-foreground">Manage Jobs</h3>
              <p className="text-sm text-muted-foreground">Edit and moderate job listings</p>
            </a>
            <a
              href="/admin/applications"
              className="p-4 rounded-lg border border-border hover:border-primary transition-colors"
            >
              <FileText className="w-8 h-8 text-primary mb-2" />
              <h3 className="font-semibold text-foreground">View Applications</h3>
              <p className="text-sm text-muted-foreground">Monitor all job applications</p>
            </a>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
