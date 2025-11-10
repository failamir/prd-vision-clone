import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Bookmark, MapPin, Briefcase, DollarSign, Loader2, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

interface SavedJob {
  job_id: string;
  saved_at: string;
  job: {
    id: string;
    title: string;
    company_name: string;
    location: string;
    job_type: string;
    salary_min: number | null;
    salary_max: number | null;
    salary_currency: string;
    is_urgent: boolean;
  };
}

const SavedJobs = () => {
  const { toast } = useToast();
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [candidateId, setCandidateId] = useState<string>("");

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from("candidate_profiles")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!profile) return;
      setCandidateId(profile.id);

      const { data, error } = await supabase
        .from("saved_jobs")
        .select(`
          *,
          job:jobs(
            id,
            title,
            company_name,
            location,
            job_type,
            salary_min,
            salary_max,
            salary_currency,
            is_urgent
          )
        `)
        .eq("candidate_id", profile.id)
        .order("saved_at", { ascending: false });

      if (error) throw error;
      setSavedJobs(data as any || []);
    } catch (error) {
      console.error("Error fetching saved jobs:", error);
      toast({
        title: "Error loading saved jobs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async (jobId: string) => {
    try {
      const { error } = await supabase
        .from("saved_jobs")
        .delete()
        .eq("candidate_id", candidateId)
        .eq("job_id", jobId);

      if (error) throw error;

      toast({
        title: "Job removed from saved list",
      });
      fetchSavedJobs();
    } catch (error) {
      console.error("Error removing saved job:", error);
      toast({
        title: "Error removing job",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Saved Jobs</h2>
          <p className="text-muted-foreground">Jobs you've bookmarked for later</p>
        </div>

        {savedJobs.length === 0 ? (
          <Card className="p-12 text-center">
            <Bookmark className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No saved jobs</h3>
            <p className="text-muted-foreground mb-6">
              Save interesting jobs to easily find them later
            </p>
            <Link to="/jobs">
              <Button>Browse Jobs</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {savedJobs.map((savedJob) => (
              <Card key={savedJob.job_id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="w-12 h-12 bg-gradient-to-br from-ocean-light to-ocean-blue rounded-lg flex items-center justify-center flex-shrink-0 text-white font-bold">
                      {savedJob.job.company_name.substring(0, 2)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-lg font-semibold text-foreground">
                          {savedJob.job.title}
                        </h3>
                        {savedJob.job.is_urgent && (
                          <Badge className="bg-gold text-ocean-deep">Urgent</Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground mb-3">{savedJob.job.company_name}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {savedJob.job.location}
                        </span>
                        <span className="flex items-center">
                          <Briefcase className="w-4 h-4 mr-1" />
                          {savedJob.job.job_type}
                        </span>
                        {savedJob.job.salary_min && savedJob.job.salary_max && (
                          <span className="flex items-center font-medium text-foreground">
                            <DollarSign className="w-4 h-4 mr-1" />
                            {savedJob.job.salary_currency} {savedJob.job.salary_min.toLocaleString()} -{" "}
                            {savedJob.job.salary_max.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-3 mt-4">
                        <Link to={`/jobs/${savedJob.job.id}`}>
                          <Button size="sm">View Details</Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUnsave(savedJob.job_id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SavedJobs;
