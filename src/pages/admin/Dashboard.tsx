import { Card } from "@/components/ui/card";
import { Users, Briefcase, FileText, TrendingUp } from "lucide-react";
import { Loader2 } from "lucide-react";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import DatabaseBackup from "@/components/admin/DatabaseBackup";
import DatabaseImport from "@/components/admin/DatabaseImport";

const AdminDashboard = () => {
  const { stats, loading } = useDashboardData();

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalCandidates,
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
      value: stats.pendingApplications + stats.approvedApplications + stats.rejectedApplications,
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

  if (loading) {
    return (
      <>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </>
    );
  }

  return (
    <>
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

        {/* Quick Actions */}
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

        {/* Database Backup & Import */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DatabaseBackup />
          <DatabaseImport />
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
