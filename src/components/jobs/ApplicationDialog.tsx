import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

const applicationSchema = z.object({
  cv_id: z.string().min(1, "Please select a CV"),
  cover_letter: z
    .string()
    .min(50, "Cover letter must be at least 50 characters")
    .max(2000, "Cover letter must be less than 2000 characters"),
});

type ApplicationFormValues = z.infer<typeof applicationSchema>;

interface CV {
  id: string;
  file_name: string;
  is_default: boolean;
}

interface ApplicationDialogProps {
  jobId: string;
  jobTitle: string;
  onSuccess?: () => void;
}

export const ApplicationDialog = ({ jobId, jobTitle, onSuccess }: ApplicationDialogProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [cvs, setCvs] = useState<CV[]>([]);
  const [loading, setLoading] = useState(false);
  const [candidateId, setCandidateId] = useState<string>("");
  const [hasApplied, setHasApplied] = useState(false);

  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      cv_id: "",
      cover_letter: "",
    },
  });

  useEffect(() => {
    if (open) {
      fetchCVs();
      checkIfAlreadyApplied();
    }
  }, [open]);

  const fetchCVs = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from("candidate_profiles")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!profile) {
        toast({
          title: "Profile not found",
          description: "Please complete your profile first",
          variant: "destructive",
        });
        return;
      }

      setCandidateId(profile.id);

      const { data, error } = await supabase
        .from("candidate_cvs")
        .select("id, file_name, is_default")
        .eq("candidate_id", profile.id)
        .order("is_default", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) throw error;

      setCvs(data || []);

      // Auto-select default CV if available
      const defaultCV = data?.find(cv => cv.is_default);
      if (defaultCV) {
        form.setValue("cv_id", defaultCV.id);
      }
    } catch (error) {
      console.error("Error fetching CVs:", error);
      toast({
        title: "Error loading CVs",
        variant: "destructive",
      });
    }
  };

  const checkIfAlreadyApplied = async () => {
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
        .from("job_applications")
        .select("id")
        .eq("candidate_id", profile.id)
        .eq("job_id", jobId)
        .maybeSingle();

      setHasApplied(!!data);
    } catch (error) {
      console.error("Error checking application status:", error);
    }
  };

  const onSubmit = async (values: ApplicationFormValues) => {
    setLoading(true);
    try {
      // Fetch candidate's registration_city to sync with office_registered
      const { data: profile } = await supabase
        .from("candidate_profiles")
        .select("registration_city")
        .eq("id", candidateId)
        .maybeSingle();

      const { error } = await supabase
        .from("job_applications")
        .insert({
          candidate_id: candidateId,
          job_id: jobId,
          cv_id: values.cv_id,
          cover_letter: values.cover_letter,
          status: "pending",
          office_registered: profile?.registration_city || null,
        });

      if (error) throw error;

      toast({
        title: "Application submitted successfully!",
        description: "The employer will review your application soon.",
      });

      setOpen(false);
      form.reset();
      onSuccess?.();
    } catch (error: any) {
      console.error("Error submitting application:", error);
      toast({
        title: "Error submitting application",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (hasApplied) {
    return (
      <Button disabled className="w-full">
        Already Applied
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-primary hover:bg-primary/90">Apply Now</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-background">
        <DialogHeader>
          <DialogTitle>Apply for {jobTitle}</DialogTitle>
          <DialogDescription>
            Submit your application with a CV and cover letter
          </DialogDescription>
        </DialogHeader>

        {cvs.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-muted-foreground mb-4">
              You need to upload a CV before applying
            </p>
            <Button onClick={() => window.location.href = "/candidate/cvs"}>
              Upload CV
            </Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="cv_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select CV *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Choose a CV to submit" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-background z-50">
                        {cvs.map((cv) => (
                          <SelectItem key={cv.id} value={cv.id}>
                            {cv.file_name} {cv.is_default ? "(Default)" : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cover_letter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cover Letter *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Explain why you're a great fit for this position..."
                        className="min-h-[200px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <p className="text-sm text-muted-foreground">
                      {field.value.length}/2000 characters
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="flex-1"
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};
