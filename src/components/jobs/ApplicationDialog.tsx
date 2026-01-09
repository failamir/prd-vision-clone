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
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

const applicationSchema = z.object({
  cover_letter: z
    .string()
    .min(50, "Cover letter must be at least 50 characters")
    .max(2000, "Cover letter must be less than 2000 characters"),
});

type ApplicationFormValues = z.infer<typeof applicationSchema>;

interface CandidateProfile {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  date_of_birth: string | null;
  gender: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  registration_city: string | null;
  profile_step_unlocked: number;
}

interface ApplicationDialogProps {
  jobId: string;
  jobTitle: string;
  onSuccess?: () => void;
  autoOpen?: boolean;
  onAutoOpenTriggered?: () => void;
}

export const ApplicationDialog = ({ 
  jobId, 
  jobTitle, 
  onSuccess, 
  autoOpen = false,
  onAutoOpenTriggered 
}: ApplicationDialogProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingProfile, setCheckingProfile] = useState(true);
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [profileComplete, setProfileComplete] = useState(false);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [missingDocuments, setMissingDocuments] = useState<string[]>([]);

  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      cover_letter: "",
    },
  });

  // Check profile on mount if autoOpen is true
  useEffect(() => {
    if (autoOpen) {
      checkProfileAndApplication().then(() => {
        setOpen(true);
        onAutoOpenTriggered?.();
      });
    }
  }, [autoOpen]);

  // Check profile when dialog opens manually
  useEffect(() => {
    if (open && !autoOpen) {
      checkProfileAndApplication();
    }
  }, [open]);

  const checkProfileAndApplication = async () => {
    setCheckingProfile(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profileData } = await supabase
        .from("candidate_profiles")
        .select("id, full_name, email, phone, date_of_birth, gender, address, city, country, registration_city, profile_step_unlocked")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!profileData) {
        toast({
          title: "Profile not found",
          description: "Please complete your profile first",
          variant: "destructive",
        });
        return;
      }

      setProfile(profileData);

      // Check required fields for application
      const required: { field: keyof CandidateProfile; label: string }[] = [
        { field: "full_name", label: "Full Name" },
        { field: "phone", label: "Phone Number" },
        { field: "date_of_birth", label: "Date of Birth" },
        { field: "gender", label: "Gender" },
        { field: "address", label: "Address" },
        { field: "city", label: "City" },
        { field: "country", label: "Country" },
      ];

      const missing = required
        .filter(r => !profileData[r.field])
        .map(r => r.label);

      setMissingFields(missing);

      // Check for CV and Form Letter
      const { data: cvData } = await supabase
        .from("candidate_cvs")
        .select("id")
        .eq("candidate_id", profileData.id)
        .limit(1);

      const { data: formLetterData } = await supabase
        .from("candidate_form_letters" as any)
        .select("id")
        .eq("candidate_id", profileData.id)
        .limit(1);

      const missingDocs: string[] = [];
      if (!cvData || cvData.length === 0) {
        missingDocs.push("CV");
      }
      if (!formLetterData || (formLetterData as any[]).length === 0) {
        missingDocs.push("Form Letter");
      }
      setMissingDocuments(missingDocs);

      setProfileComplete(missing.length === 0 && missingDocs.length === 0);

      // Check if already applied
      const { data: existingApp } = await supabase
        .from("job_applications")
        .select("id")
        .eq("candidate_id", profileData.id)
        .eq("job_id", jobId)
        .maybeSingle();

      setHasApplied(!!existingApp);
    } catch (error) {
      console.error("Error checking profile:", error);
    } finally {
      setCheckingProfile(false);
    }
  };

  const getCandidateDocuments = async (candidateId: string) => {
    // Get default CV
    const { data: cvData } = await supabase
      .from("candidate_cvs")
      .select("file_path")
      .eq("candidate_id", candidateId)
      .eq("is_default", true)
      .maybeSingle();

    // Get default Form Letter
    const { data: formLetterData } = await supabase
      .from("candidate_form_letters" as any)
      .select("file_path")
      .eq("candidate_id", candidateId)
      .eq("is_default", true)
      .maybeSingle();

    return {
      cv_url: cvData?.file_path || null,
      letter_form_url: (formLetterData as any)?.file_path || null,
    };
  };

  const onSubmit = async (values: ApplicationFormValues) => {
    if (!profile) return;
    
    setLoading(true);
    try {
      // Check if already applied to this job
      const { data: existingApp, error: checkError } = await supabase
        .from("job_applications")
        .select("id, second_position")
        .eq("candidate_id", profile.id)
        .eq("job_id", jobId)
        .maybeSingle();

      if (checkError) throw checkError;

      // Get the job title for second_position
      const { data: jobData } = await supabase
        .from("jobs")
        .select("title")
        .eq("id", jobId)
        .single();

      if (existingApp) {
        // Update second_position instead of creating duplicate
        const { error: updateError } = await supabase
          .from("job_applications")
          .update({ 
            second_position: jobData?.title || existingApp.second_position,
            cover_letter: values.cover_letter,
            updated_at: new Date().toISOString()
          })
          .eq("id", existingApp.id);

        if (updateError) throw updateError;

        toast({
          title: "Application updated!",
          description: "Your second position preference has been recorded.",
        });
      } else {
        // New application
        const documents = await getCandidateDocuments(profile.id);

        const { error } = await supabase
          .from("job_applications")
          .insert({
            candidate_id: profile.id,
            job_id: jobId,
            cover_letter: values.cover_letter,
            status: "pending",
            office_registered: profile.registration_city || null,
            contact_no: profile.phone || null,
            cv_url: documents.cv_url,
            letter_form_url: documents.letter_form_url,
          });

        if (error) throw error;

        toast({
          title: "Application submitted successfully!",
          description: "The employer will review your application soon.",
        });
      }

      setOpen(false);
      form.reset();
      setHasApplied(true);
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

  // Allow re-applying to update second position
  // Removed the hasApplied block to allow updates

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-primary hover:bg-primary/90">Apply Now</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-background">
        <DialogHeader>
          <DialogTitle>Apply for {jobTitle}</DialogTitle>
          <DialogDescription>
            Submit your application for this position
          </DialogDescription>
        </DialogHeader>

        {checkingProfile ? (
          <div className="py-8 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : !profileComplete ? (
          <div className="py-6 space-y-4">
            <div className="flex items-start gap-3 p-4 bg-destructive/10 rounded-lg">
              <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
              <div>
                <h4 className="font-semibold text-destructive">Profile Incomplete</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Please complete your profile before applying. The following is missing:
                </p>
                {missingFields.length > 0 && (
                  <>
                    <p className="text-sm font-medium mt-2">Profile Information:</p>
                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                      {missingFields.map((field) => (
                        <li key={field}>{field}</li>
                      ))}
                    </ul>
                  </>
                )}
                {missingDocuments.length > 0 && (
                  <>
                    <p className="text-sm font-medium mt-2">Required Documents:</p>
                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                      {missingDocuments.map((doc) => (
                        <li key={doc}>{doc}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>
            <Link to="/candidate/profile">
              <Button className="w-full">Complete Profile</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-green-500/10 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-green-700">Profile Ready</h4>
                <p className="text-sm text-muted-foreground">
                  Your profile data will be used for this application.
                </p>
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
