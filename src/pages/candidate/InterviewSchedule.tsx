import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, Video, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InterviewSchedule {
  id: string;
  interview_by: string;
  interview_date: string;
  job_title: string;
  meeting_link?: string;
}

export default function InterviewSchedule() {
  const [schedules, setSchedules] = useState<InterviewSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchInterviewSchedules();
  }, []);

  const fetchInterviewSchedules = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from("candidate_profiles")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!profile) return;

      const { data: applications, error } = await supabase
        .from("job_applications")
        .select(`
          id,
          interview_by,
          interview_date,
          jobs (
            title
          )
        `)
        .eq("candidate_id", profile.id)
        .not("interview_date", "is", null)
        .order("interview_date", { ascending: true });

      if (error) throw error;

      const formattedSchedules = applications?.map((app: any) => ({
        id: app.id,
        interview_by: app.interview_by || "TBA",
        interview_date: app.interview_date,
        job_title: app.jobs?.title || "Position",
        meeting_link: "https://meet.google.com/tzu-xubq-fnn" // Default link
      })) || [];

      setSchedules(formattedSchedules);
    } catch (error: any) {
      toast({
        title: "Error loading interview schedules",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Interview Schedule</h1>
          <p className="text-muted-foreground mt-2">
            View your upcoming interview appointments
          </p>
        </div>

        {loading ? (
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">Loading schedules...</p>
            </CardContent>
          </Card>
        ) : schedules.length === 0 ? (
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">No interview schedules yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {schedules.map((schedule) => (
              <Card key={schedule.id}>
                <CardHeader>
                  <CardTitle className="text-xl">{schedule.job_title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start space-x-3">
                        <User className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Interview By</p>
                          <p className="font-medium">{schedule.interview_by}</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <Calendar className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Interview Date</p>
                          <p className="font-medium">{formatDate(schedule.interview_date)}</p>
                        </div>
                      </div>
                    </div>
                    {schedule.meeting_link && (
                      <div className="flex items-start space-x-3">
                        <Video className="w-5 h-5 text-primary mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground">Link Meeting</p>
                          <a 
                            href={schedule.meeting_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline font-medium"
                          >
                            {schedule.meeting_link}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
