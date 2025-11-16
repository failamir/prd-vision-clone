import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plane, MapPin, Calendar } from "lucide-react";

interface DepartureSchedule {
  id: string;
  job_title: string;
  departure_date: string;
  location: string;
  vessel_name?: string;
}

export default function DepartureSchedule() {
  const [schedules, setSchedules] = useState<DepartureSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchDepartureSchedules();
  }, []);

  const fetchDepartureSchedules = async () => {
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
          date_of_entry,
          jobs (
            title,
            location
          )
        `)
        .eq("candidate_id", profile.id)
        .eq("status", "accepted")
        .not("date_of_entry", "is", null)
        .order("date_of_entry", { ascending: true });

      if (error) throw error;

      const formattedSchedules = applications?.map((app: any) => ({
        id: app.id,
        job_title: app.jobs?.title || "Position",
        departure_date: app.date_of_entry,
        location: app.jobs?.location || "TBA",
        vessel_name: app.jobs?.title
      })) || [];

      setSchedules(formattedSchedules);
    } catch (error: any) {
      toast({
        title: "Error loading departure schedules",
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
          <h1 className="text-3xl font-bold text-foreground">Departure Schedule</h1>
          <p className="text-muted-foreground mt-2">
            View your upcoming departure dates and assignments
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
              <p className="text-center text-muted-foreground">No departure schedules yet</p>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start space-x-3">
                      <Calendar className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Departure Date</p>
                        <p className="font-medium">{formatDate(schedule.departure_date)}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Location</p>
                        <p className="font-medium">{schedule.location}</p>
                      </div>
                    </div>
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
