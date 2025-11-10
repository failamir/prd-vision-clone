import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Briefcase, DollarSign, Clock, Filter, Loader2, Bookmark } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  created_at: string;
  is_urgent: boolean;
}

const Jobs = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchJobs();
    fetchSavedJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast({
        title: "Error loading jobs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedJobs = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from("candidate_profiles")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!profile) return;

      const { data, error } = await supabase
        .from("saved_jobs")
        .select("job_id")
        .eq("candidate_id", profile.id);

      if (error) throw error;
      setSavedJobs(new Set(data?.map(item => item.job_id) || []));
    } catch (error) {
      console.error("Error fetching saved jobs:", error);
    }
  };

  const handleSaveJob = async (jobId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Login required",
          description: "Please login to save jobs",
          variant: "destructive",
        });
        return;
      }

      const { data: profile } = await supabase
        .from("candidate_profiles")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!profile) {
        toast({
          title: "Profile not found",
          variant: "destructive",
        });
        return;
      }

      if (savedJobs.has(jobId)) {
        // Unsave job
        const { error } = await supabase
          .from("saved_jobs")
          .delete()
          .eq("candidate_id", profile.id)
          .eq("job_id", jobId);

        if (error) throw error;

        setSavedJobs(prev => {
          const newSet = new Set(prev);
          newSet.delete(jobId);
          return newSet;
        });

        toast({
          title: "Job removed from saved",
        });
      } else {
        // Save job
        const { error } = await supabase
          .from("saved_jobs")
          .insert({ candidate_id: profile.id, job_id: jobId });

        if (error) throw error;

        setSavedJobs(prev => new Set([...prev, jobId]));

        toast({
          title: "Job saved successfully",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = searchQuery === "" || 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company_name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLocation = locationFilter === "" || locationFilter === "all" ||
      job.location.toLowerCase().includes(locationFilter.toLowerCase());
    
    const matchesType = typeFilter === "" || typeFilter === "all" ||
      job.job_type.toLowerCase() === typeFilter.toLowerCase();

    return matchesSearch && matchesLocation && matchesType;
  });

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
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Header */}
      <section className="pt-24 pb-12 bg-gradient-to-r from-ocean-deep to-ocean-blue text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your Dream Job</h1>
          <p className="text-xl text-blue-100">
            Explore maritime job opportunities worldwide
          </p>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="py-8 bg-background border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  placeholder="Job title, keywords, or company"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="international">International Waters</SelectItem>
                <SelectItem value="asia">Asia Pacific</SelectItem>
                <SelectItem value="europe">Europe</SelectItem>
                <SelectItem value="indonesia">Indonesia</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="fulltime">Full-time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="temporary">Temporary</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section className="py-12 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <p className="text-muted-foreground">{filteredJobs.length} jobs found</p>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredJobs.length === 0 ? (
            <Card className="p-12 text-center">
              <Briefcase className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No jobs found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search filters
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {filteredJobs.map((job) => (
                <Card key={job.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-ocean-light to-ocean-blue rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0">
                          {job.company_name.substring(0, 2)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-xl font-bold text-foreground mb-1">{job.title}</h3>
                              <p className="text-muted-foreground">{job.company_name}</p>
                            </div>
                            {job.is_urgent && (
                              <Badge className="bg-gold text-ocean-deep hover:bg-gold/90">Urgent</Badge>
                            )}
                          </div>
                          {job.department && (
                            <p className="text-sm text-secondary font-medium mb-3">{job.department}</p>
                          )}

                          <div className="flex flex-wrap gap-4 mb-4">
                            <div className="flex items-center text-sm text-muted-foreground">
                              <MapPin className="w-4 h-4 mr-2" />
                              {job.location}
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Briefcase className="w-4 h-4 mr-2" />
                              {job.job_type}
                            </div>
                            <div className="flex items-center text-sm text-foreground font-medium">
                              <DollarSign className="w-4 h-4 mr-1" />
                              {formatSalary(job.salary_min, job.salary_max, job.salary_currency)}
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock className="w-4 h-4 mr-2" />
                              {getTimeAgo(job.created_at)}
                            </div>
                          </div>

                          <div className="flex gap-3">
                            <Link to={`/jobs/${job.id}`} className="flex-1 sm:flex-none">
                              <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90">
                                View Details
                              </Button>
                            </Link>
                            <Button 
                              variant={savedJobs.has(job.id) ? "default" : "outline"}
                              onClick={() => handleSaveJob(job.id)}
                            >
                              <Bookmark className={`w-4 h-4 mr-2 ${savedJobs.has(job.id) ? 'fill-current' : ''}`} />
                              {savedJobs.has(job.id) ? 'Saved' : 'Save'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Jobs;
