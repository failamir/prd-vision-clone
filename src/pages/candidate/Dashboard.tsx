import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Briefcase, FileText, Bookmark, TrendingUp, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { toast } = useToast();
  const [stats, setStats] = useState({
    applications: 0,
    cvs: 0,
    savedJobs: 0,
    profileCompletion: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get candidate profile
      const { data: profile } = await supabase
        .from("candidate_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (!profile) return;

      // Get applications count
      const { count: applicationsCount } = await supabase
        .from("job_applications")
        .select("*", { count: "exact", head: true })
        .eq("candidate_id", profile.id);

      // Get CVs count
      const { count: cvsCount } = await supabase
        .from("candidate_cvs")
        .select("*", { count: "exact", head: true })
        .eq("candidate_id", profile.id);

      // Get saved jobs count
      const { count: savedJobsCount } = await supabase
        .from("saved_jobs")
        .select("*", { count: "exact", head: true })
        .eq("candidate_id", profile.id);

      // Calculate profile completion
      const fields = [
        profile.full_name,
        profile.phone,
        profile.city,
        profile.professional_title,
        profile.bio,
      ];
      const completedFields = fields.filter((field) => field).length;
      const completion = Math.round((completedFields / fields.length) * 100);

      setStats({
        applications: applicationsCount || 0,
        cvs: cvsCount || 0,
        savedJobs: savedJobsCount || 0,
        profileCompletion: completion,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast({
        title: "Error loading dashboard",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Welcome Back!</h2>
          <p className="text-muted-foreground">Here's your job search activity overview</p>
        </div>

        {/* Profile Completion Alert */}
        {stats.profileCompletion < 100 && (
          <Card className="p-4 bg-accent/50 border-accent">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-accent-foreground mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">
                  Complete Your Profile ({stats.profileCompletion}%)
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  A complete profile increases your chances of getting hired
                </p>
                <Link to="/candidate/profile">
                  <Button size="sm" variant="default">
                    Complete Profile
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-primary" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-1">{stats.applications}</h3>
            <p className="text-sm text-muted-foreground">Job Applications</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-secondary" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-1">{stats.cvs}</h3>
            <p className="text-sm text-muted-foreground">CVs Uploaded</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center">
                <Bookmark className="w-6 h-6 text-gold" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-1">{stats.savedJobs}</h3>
            <p className="text-sm text-muted-foreground">Saved Jobs</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-ocean-light/10 rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold text-ocean-light">{stats.profileCompletion}%</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-1">Profile</h3>
            <p className="text-sm text-muted-foreground">Completion Rate</p>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-2">Browse Jobs</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Explore thousands of job opportunities
            </p>
            <Link to="/jobs">
              <Button className="w-full">Search Jobs</Button>
            </Link>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-2">Update CV</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Keep your resume up to date
            </p>
            <Link to="/candidate/cvs">
              <Button className="w-full" variant="secondary">
                Manage CVs
              </Button>
            </Link>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-2">Track Applications</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Monitor your application status
            </p>
            <Link to="/candidate/applications">
              <Button className="w-full" variant="outline">
                View Applications
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
