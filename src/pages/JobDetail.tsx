import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  Users,
  Calendar,
  CheckCircle2,
  Building2,
  Globe,
  Mail,
  Loader2,
  Bookmark,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ApplicationDialog } from "@/components/jobs/ApplicationDialog";

interface Job {
  id: string;
  title: string;
  company_name: string;
  department: string | null;
  location: string;
  job_type: string;
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string;
  description: string;
  responsibilities: string | null;
  requirements: string | null;
  benefits: string | null;
  positions_available: number;
  is_urgent: boolean;
  created_at: string;
  expires_at: string | null;
}

const JobDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [similarJobs, setSimilarJobs] = useState<Job[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
    if (id) {
      fetchJob();
      checkIfSaved();
      fetchSimilarJobs();
    }
  }, [id]);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setIsAuthenticated(!!user);
  };

  const fetchJob = async () => {
    try {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      if (!data) {
        navigate("/jobs");
        return;
      }
      setJob(data);
    } catch (error) {
      console.error("Error fetching job:", error);
      toast({
        title: "Error loading job",
        variant: "destructive",
      });
      navigate("/jobs");
    } finally {
      setLoading(false);
    }
  };

  const checkIfSaved = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from("candidate_profiles")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!profile) return;

      const { data } = await supabase
        .from("saved_jobs")
        .select("job_id")
        .eq("candidate_id", profile.id)
        .eq("job_id", id)
        .maybeSingle();

      setIsSaved(!!data);
    } catch (error) {
      console.error("Error checking saved status:", error);
    }
  };

  const fetchSimilarJobs = async () => {
    try {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .neq("id", id)
        .eq("is_active", true)
        .limit(2);

      if (error) throw error;
      setSimilarJobs(data || []);
    } catch (error) {
      console.error("Error fetching similar jobs:", error);
    }
  };

  const handleSaveJob = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("candidate_profiles")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!profile) {
        toast({
          title: "Profile not found",
          variant: "destructive",
        });
        return;
      }

      if (isSaved) {
        const { error } = await supabase
          .from("saved_jobs")
          .delete()
          .eq("candidate_id", profile.id)
          .eq("job_id", id);

        if (error) throw error;
        setIsSaved(false);
        toast({ title: "Job removed from saved" });
      } else {
        const { error } = await supabase
          .from("saved_jobs")
          .insert({ candidate_id: profile.id, job_id: id });

        if (error) throw error;
        setIsSaved(true);
        toast({ title: "Job saved successfully" });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const formatSalary = (min: number | null, max: number | null, currency: string) => {
    if (!min && !max) return "Competitive";
    if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    if (min) return `From $${min.toLocaleString()}`;
    return `Up to $${max?.toLocaleString()}`;
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const days = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    return `${Math.floor(days / 7)} weeks ago`;
  };

  const getDaysUntilExpiry = (expiresAt: string | null) => {
    if (!expiresAt) return "Open";
    const expiry = new Date(expiresAt);
    const now = new Date();
    const days = Math.floor((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (days < 0) return "Expired";
    if (days === 0) return "Today";
    if (days === 1) return "1 day";
    return `${days} days`;
  };

  const parseTextArray = (text: string | null): string[] => {
    if (!text) return [];
    return text.split('\n').filter(line => line.trim() !== '').map(line => line.replace(/^[•\-]\s*/, ''));
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!job) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="pt-24 pb-12 bg-gradient-to-r from-ocean-deep to-ocean-blue text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 mb-4">
            <Link to="/jobs" className="text-blue-200 hover:text-white transition-colors">
              Jobs
            </Link>
            <span className="text-blue-200">/</span>
            <span>Job Details</span>
          </div>
        </div>
      </div>

      <section className="py-12 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Card className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-ocean-light to-ocean-blue rounded-lg flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
                    {job.company_name.substring(0, 2)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h1 className="text-3xl font-bold text-foreground mb-2">{job.title}</h1>
                        <p className="text-lg text-muted-foreground">{job.company_name}</p>
                      </div>
                      {job.is_urgent && (
                        <Badge className="bg-gold text-ocean-deep hover:bg-gold/90">Urgent</Badge>
                      )}
                    </div>
                    {job.department && (
                      <p className="text-secondary font-medium">{job.department}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Briefcase className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">{job.job_type}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground font-medium">
                      {formatSalary(job.salary_min, job.salary_max, job.salary_currency)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">{job.positions_available} positions</span>
                  </div>
                </div>

                <Separator className="my-8" />

                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-4">Job Description</h2>
                    <p className="text-foreground leading-relaxed whitespace-pre-line">{job.description}</p>
                  </div>

                  {job.responsibilities && parseTextArray(job.responsibilities).length > 0 && (
                    <div>
                      <h2 className="text-2xl font-bold text-foreground mb-4">Responsibilities</h2>
                      <ul className="space-y-2">
                        {parseTextArray(job.responsibilities).map((item, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                            <span className="text-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {job.requirements && parseTextArray(job.requirements).length > 0 && (
                    <div>
                      <h2 className="text-2xl font-bold text-foreground mb-4">Requirements</h2>
                      <ul className="space-y-2">
                        {parseTextArray(job.requirements).map((item, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                            <span className="text-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {job.benefits && parseTextArray(job.benefits).length > 0 && (
                    <div>
                      <h2 className="text-2xl font-bold text-foreground mb-4">Benefits</h2>
                      <ul className="space-y-2">
                        {parseTextArray(job.benefits).map((item, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                            <span className="text-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Apply Card */}
              <Card className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-4">Apply for this position</h3>
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Posted: {getTimeAgo(job.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Expires in: {getDaysUntilExpiry(job.expires_at)}</span>
                  </div>
                </div>
                {isAuthenticated ? (
                  <div className="mb-3">
                    <ApplicationDialog 
                      jobId={job.id} 
                      jobTitle={job.title}
                      onSuccess={checkIfSaved}
                    />
                  </div>
                ) : (
                  <Link to="/login">
                    <Button className="w-full bg-primary hover:bg-primary/90 mb-3">Apply Now</Button>
                  </Link>
                )}
                <Button 
                  variant={isSaved ? "default" : "outline"}
                  className="w-full"
                  onClick={handleSaveJob}
                >
                  <Bookmark className={`w-4 h-4 mr-2 ${isSaved ? 'fill-current' : ''}`} />
                  {isSaved ? 'Saved' : 'Save Job'}
                </Button>
              </Card>

              {/* Company Info */}
              <Card className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-4">About Company</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Building2 className="w-4 h-4" />
                      <span>Company</span>
                    </div>
                    <p className="font-medium text-foreground">{job.company_name}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Globe className="w-4 h-4" />
                      <span>Industry</span>
                    </div>
                    <p className="font-medium text-foreground">Maritime & Shipping</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <MapPin className="w-4 h-4" />
                      <span>Location</span>
                    </div>
                    <p className="font-medium text-foreground">{job.location}</p>
                  </div>
                </div>
              </Card>

              {/* Similar Jobs */}
              {similarJobs.length > 0 && (
                <Card className="p-6">
                  <h3 className="text-xl font-bold text-foreground mb-4">Similar Jobs</h3>
                  <div className="space-y-4">
                    {similarJobs.map((similarJob) => (
                      <Link
                        key={similarJob.id}
                        to={`/jobs/${similarJob.id}`}
                        className="block p-3 rounded-lg hover:bg-muted transition-colors"
                      >
                        <h4 className="font-medium text-foreground mb-1">{similarJob.title}</h4>
                        <p className="text-sm text-muted-foreground">{similarJob.company_name}</p>
                        <p className="text-sm text-secondary font-medium mt-1">
                          {formatSalary(similarJob.salary_min, similarJob.salary_max, similarJob.salary_currency)}
                        </p>
                      </Link>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default JobDetail;
