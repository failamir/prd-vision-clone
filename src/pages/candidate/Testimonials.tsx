import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function Testimonials() {
  const [testimonial, setTestimonial] = useState("");
  const [rating, setRating] = useState(5);
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [candidateId, setCandidateId] = useState<string | null>(null);
  const [myTestimonials, setMyTestimonials] = useState<Array<{ id: string; testimonial: string; rating: number; is_approved: boolean; created_at: string }>>([]);

  useEffect(() => {
    const init = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: profile, error } = await supabase
          .from("candidate_profiles")
          .select("id")
          .eq("user_id", user.id)
          .single();
        if (error) throw error;
        if (!profile) return;
        setCandidateId(profile.id);
        await fetchMyTestimonials(profile.id);
      } catch (error: any) {
        toast({ title: "Failed to load testimonials", description: error.message, variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const fetchMyTestimonials = async (cid: string) => {
    const { data, error } = await supabase
      .from("testimonials")
      .select("id, testimonial, rating, is_approved, created_at")
      .eq("candidate_id", cid)
      .order("created_at", { ascending: false });
    if (error) throw error;
    setMyTestimonials(data || []);
  };

  const handleSubmit = async () => {
    if (!testimonial.trim()) {
      toast({ title: "Please write a testimonial", variant: "destructive" });
      return;
    }
    if (!candidateId) {
      toast({ title: "Complete your profile first", description: "We couldn't find your candidate profile.", variant: "destructive" });
      return;
    }

    try {
      setSubmitting(true);
      const { error } = await supabase.from("testimonials").insert({
        candidate_id: candidateId,
        rating,
        testimonial: testimonial.trim(),
      });
      if (error) throw error;
      toast({ title: "Thank you for your testimonial!", description: "Pending admin approval." });
      setTestimonial("");
      setRating(5);
      await fetchMyTestimonials(candidateId);
    } catch (error: any) {
      toast({ title: "Failed to submit", description: error.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Testimonials</h1>
          <p className="text-muted-foreground mt-2">
            Share your experience working with us
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5" />
              <span>Submit Your Testimonial</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Rate Your Experience
              </label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    onClick={() => setRating(value)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        value <= rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Your Testimonial
              </label>
              <Textarea
                placeholder="Share your experience working with Cipta Wira Tirta Services..."
                value={testimonial}
                onChange={(e) => setTestimonial(e.target.value)}
                rows={6}
                className="resize-none"
              />
            </div>

            <Button onClick={handleSubmit} className="w-full" disabled={submitting || loading}>
              {submitting ? "Submitting..." : "Submit Testimonial"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>My Testimonials</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-muted-foreground">Loading...</p>
            ) : myTestimonials.length === 0 ? (
              <p className="text-muted-foreground">You haven't submitted any testimonials yet.</p>
            ) : (
              <div className="space-y-4">
                {myTestimonials.map((t) => (
                  <div key={t.id} className="border rounded-md p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < t.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                        ))}
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${t.is_approved ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                        {t.is_approved ? "Approved" : "Pending"}
                      </span>
                    </div>
                    <p className="mt-2 text-sm whitespace-pre-wrap">{t.testimonial}</p>
                    <div className="text-xs text-muted-foreground mt-2">{new Date(t.created_at).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
