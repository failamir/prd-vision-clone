import { useEffect, useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, User, FileText, Trash2, Edit2, ExternalLink, Download, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CV {
  id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  is_default: boolean;
  created_at: string;
}

interface FormLetter {
  id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  is_default: boolean;
  created_at: string;
}

const Profile = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [stepUnlocked, setStepUnlocked] = useState(1); // Controls which steps are accessible
  const totalSteps = 3;
  // CV & Form Letter state
  const [cvs, setCvs] = useState<CV[]>([]);
  const [formLetters, setFormLetters] = useState<FormLetter[]>([]);
  const [uploadingCV, setUploadingCV] = useState(false);
  const [uploadingFormLetter, setUploadingFormLetter] = useState(false);
  const [documentsTab, setDocumentsTab] = useState("cv");
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const testFileInputRef = useRef<HTMLInputElement>(null);
  const [screeningTab, setScreeningTab] = useState("deck_experience");
  const [department, setDepartment] = useState<string>("Deck Department"); // Default to Deck
  const [medicalTests, setMedicalTests] = useState<any[]>([]);
  const [loadingTests, setLoadingTests] = useState(false);
  const [newTest, setNewTest] = useState({
    test_name: "",
    score: "",
    file: null as File | null,
  });
  const [uploadingTest, setUploadingTest] = useState(false);
  const [candidateId, setCandidateId] = useState<string | null>(null);
  const [deckExperiences, setDeckExperiences] = useState<any[]>([]);
  const [loadingDeck, setLoadingDeck] = useState(false);
  const [uploadingDeck, setUploadingDeck] = useState(false);
  const [editingDeckId, setEditingDeckId] = useState<string | null>(null);
  const [newDeck, setNewDeck] = useState({
    vessel_name_type: "",
    gt_loa: "",
    route: "",
    position: "",
    start_date: "",
    end_date: "",
    reason: "",
    job_description: "",
    experience_type: "" as "Hotel" | "Ship" | "",
    file: null as File | null,
  });
  const [deckCertificates, setDeckCertificates] = useState<any[]>([]);
  const [loadingCertificate, setLoadingCertificate] = useState(false);
  const [uploadingCertificate, setUploadingCertificate] = useState(false);
  const [editingCertificateId, setEditingCertificateId] = useState<string | null>(null);
  const [newCertificate, setNewCertificate] = useState({
    type_certificate: "",
    institution: "",
    place: "",
    cert_number: "",
    date_of_issue: "",
    file: null as File | null,
  });
  const [travelDocuments, setTravelDocuments] = useState<any[]>([]);
  const [loadingTravel, setLoadingTravel] = useState(false);
  const [uploadingTravel, setUploadingTravel] = useState(false);
  const [editingTravelId, setEditingTravelId] = useState<string | null>(null);
  const [newTravel, setNewTravel] = useState({
    document_type: "",
    document_number: "",
    issuing_authority: "",
    issue_date: "",
    expiry_date: "",
    file: null as File | null,
  });
  const [nextOfKins, setNextOfKins] = useState<any[]>([]);
  const [editingNextOfKinId, setEditingNextOfKinId] = useState<string | null>(null);
  const [newNextOfKin, setNewNextOfKin] = useState({
    full_name: "",
    relationship: "",
    place_of_birth: "",
    date_of_birth: "",
    signature: "",
  });
  const [educations, setEducations] = useState<any[]>([]);
  const [loadingEducation, setLoadingEducation] = useState(false);
  const [editingEducationId, setEditingEducationId] = useState<string | null>(null);
  const [newEducation, setNewEducation] = useState({
    institution: "",
    start_date: "",
    end_date: "",
    degree: "",
  });
  const [references, setReferences] = useState<any[]>([]);
  const [editingReferenceId, setEditingReferenceId] = useState<string | null>(null);
  const [newReference, setNewReference] = useState({
    full_name: "",
    company: "",
    position: "",
    phone: "",
    email: "",
    relationship: "",
  });
  const [emergencyContacts, setEmergencyContacts] = useState<any[]>([]);
  const [loadingEmergencyContacts, setLoadingEmergencyContacts] = useState(false);
  const [editingEmergencyContactId, setEditingEmergencyContactId] = useState<string | null>(null);
  const [newEmergencyContact, setNewEmergencyContact] = useState({
    full_name: "",
    relationship: "",
    phone: "",
    email: "",
    address: "",
  });
  const [validationErrors, setValidationErrors] = useState<Set<string>>(new Set());
  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    phone: "",
    date_of_birth: "",
    gender: "",
    address: "",
    city: "",
    country: "",
    professional_title: "",
    bio: "",
    website: "",
    expected_salary_min: "",
    expected_salary_max: "",
    linkedin_url: "",
    facebook_url: "",
    twitter_url: "",
    weight_kg: "",
    height_cm: "",
    ktp_number: "",
    place_of_birth: "",
    how_found_us: "",
    registration_city: "",
    referral_name: "",
    covid_vaccinated: "",
    avatar_url: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (candidateId && currentStep === 2) {
      fetchMedicalTests();
    }
  }, [candidateId, currentStep]);

  useEffect(() => {
    if (candidateId && currentStep === 3 && screeningTab === "deck_experience") {
      fetchDeckExperiences();
    }
  }, [candidateId, currentStep, screeningTab]);

  useEffect(() => {
    if (candidateId && currentStep === 3 && screeningTab === "deck_certificate") {
      fetchDeckCertificates();
    }
  }, [candidateId, currentStep, screeningTab]);

  useEffect(() => {
    if (candidateId && currentStep === 3 && screeningTab === "travel_document") {
      fetchTravelDocuments();
    }
  }, [candidateId, currentStep, screeningTab]);

  useEffect(() => {
    if (candidateId && currentStep === 3 && screeningTab === "formal_education") {
      fetchEducation();
    }
  }, [candidateId, currentStep, screeningTab]);

  useEffect(() => {
    if (candidateId && currentStep === 3 && screeningTab === "references") {
      fetchReferences();
    }
  }, [candidateId, currentStep, screeningTab]);

  useEffect(() => {
    if (candidateId && currentStep === 3 && screeningTab === "next_of_kin") {
      fetchNextOfKin();
    }
  }, [candidateId, currentStep, screeningTab]);

  useEffect(() => {
    if (candidateId && currentStep === 3 && screeningTab === "emergency_contact") {
      fetchEmergencyContacts();
    }
  }, [candidateId, currentStep, screeningTab]);

  useEffect(() => {
    if (candidateId && currentStep === 1) {
      fetchCVs();
      fetchFormLetters();
    }
  }, [candidateId, currentStep]);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("candidate_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) throw error;

      if (data) {
        setCandidateId(data.id);
        // Set step unlocked from database (controlled by admin)
        setStepUnlocked((data as any).profile_step_unlocked || 1);
        setProfile({
          full_name: data.full_name || "",
          email: data.email || "",
          phone: data.phone || "",
          date_of_birth: data.date_of_birth || "",
          gender: data.gender || "",
          address: data.address || "",
          city: data.city || "",
          country: data.country || "",
          professional_title: data.professional_title || "",
          bio: data.bio || "",
          website: data.website || "",
          expected_salary_min: data.expected_salary_min?.toString() || "",
          expected_salary_max: data.expected_salary_max?.toString() || "",
          linkedin_url: data.linkedin_url || "",
          facebook_url: data.facebook_url || "",
          twitter_url: data.twitter_url || "",
          weight_kg: data.weight_kg?.toString() || "",
          height_cm: data.height_cm?.toString() || "",
          ktp_number: data.ktp_number || "",
          place_of_birth: data.place_of_birth || "",
          how_found_us: data.how_found_us || "",
          registration_city: data.registration_city || "",
          referral_name: data.referral_name || "",
          covid_vaccinated: data.covid_vaccinated || "",
          avatar_url: data.avatar_url || "",
        });
        setAvatarPreview(data.avatar_url || "");

        // Fetch candidate's job application to determine department
        const { data: applicationData } = await supabase
          .from("job_applications")
          .select("jobs(department)")
          .eq("candidate_id", data.id)
          .order("applied_at", { ascending: false })
          .limit(1)
          .single();

        if (applicationData?.jobs) {
          const jobDept = (applicationData.jobs as any).department;
          setDepartment(jobDept || "Deck Department");
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast({
        title: "Error loading profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddCertificate = async () => {
    if (!candidateId) return;
    if (!newCertificate.type_certificate || !newCertificate.institution || !newCertificate.cert_number || !newCertificate.date_of_issue) {
      toast({ title: "Please fill required fields", variant: "destructive" });
      return;
    }

    setUploadingCertificate(true);
    try {
      let filePath: string | null = null;
      let fileName: string | null = null;

      if (newCertificate.file) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const ext = newCertificate.file.name.split(".").pop();
        fileName = `${Date.now()}.${ext}`;
        filePath = `${user.id}/deck-certificates/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("candidate-documents")
          .upload(filePath, newCertificate.file);

        if (uploadError) throw uploadError;
      }

      const { error } = await supabase
        .from("candidate_certificates" as any)
        .insert({
          candidate_id: candidateId,
          type_certificate: newCertificate.type_certificate,
          institution: newCertificate.institution,
          place: newCertificate.place,
          cert_number: newCertificate.cert_number,
          date_of_issue: newCertificate.date_of_issue || null,
          file_path: filePath,
          file_name: fileName,
        });

      if (error) throw error;

      toast({ title: "Deck certificate added" });
      setNewCertificate({
        type_certificate: "",
        institution: "",
        place: "",
        cert_number: "",
        date_of_issue: "",
        file: null,
      });
      fetchDeckCertificates();
    } catch (error) {
      console.error("Error adding deck certificate:", error);
      toast({ title: "Error adding deck certificate", variant: "destructive" });
    } finally {
      setUploadingCertificate(false);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: "Please select an image under 5MB",
          variant: "destructive",
        });
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file",
          variant: "destructive",
        });
        return;
      }

      setUploading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (profile.avatar_url) {
        const oldPath = profile.avatar_url.split("/").pop();
        if (oldPath) {
          await supabase.storage
            .from("avatars")
            .remove([`${user.id}/${oldPath}`]);
        }
      }

      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from("candidate_profiles")
        .update({ avatar_url: publicUrl })
        .eq("user_id", user.id);

      if (updateError) throw updateError;

      setProfile({ ...profile, avatar_url: publicUrl });
      setAvatarPreview(publicUrl);

      toast({
        title: "Avatar updated successfully",
      });
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast({
        title: "Error uploading avatar",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const getStep1MissingFields = () => {
    const missing: string[] = [];
    const errorKeys = new Set<string>();

    const validGenders = new Set(["male", "female"]);
    const validRegistrationCities = new Set(["Jakarta", "Bandung", "Bali", "Surabaya", "Yogyakarta"]);
    const validVaccinationStatuses = new Set([
      "Not Vaccinated",
      "Partially Vaccinated",
      "Fully Vaccinated",
      "Fully Vaccinated with Booster",
    ]);
    const validHowFoundUs = new Set([
      "Online Search",
      "Social Media",
      "Referral",
      "Job Fair",
      "Company Website",
    ]);

    if (!profile.full_name?.trim()) { missing.push("Full Name"); errorKeys.add("full_name"); }
    if (!profile.phone?.trim()) { missing.push("Contact No"); errorKeys.add("phone"); }
    if (!profile.address?.trim()) { missing.push("Address"); errorKeys.add("address"); }
    if (!profile.city?.trim()) { missing.push("City"); errorKeys.add("city"); }
    if (!profile.country?.trim()) { missing.push("Nationality"); errorKeys.add("country"); }
    if (!profile.place_of_birth?.trim()) { missing.push("Place of Birth"); errorKeys.add("place_of_birth"); }
    if (!profile.date_of_birth) { missing.push("Date of Birth"); errorKeys.add("date_of_birth"); }

    if (!validGenders.has(profile.gender)) { missing.push("Gender"); errorKeys.add("gender"); }
    if (!validRegistrationCities.has(profile.registration_city)) { missing.push("Registration City"); errorKeys.add("registration_city"); }
    if (!validVaccinationStatuses.has(profile.covid_vaccinated)) { missing.push("COVID-19 Vaccination Status"); errorKeys.add("covid_vaccinated"); }
    if (!validHowFoundUs.has(profile.how_found_us)) { missing.push("How did you find us?"); errorKeys.add("how_found_us"); }

    if (profile.how_found_us === "Referral" && !profile.referral_name?.trim()) { missing.push("Referral Name"); errorKeys.add("referral_name"); }
    if (cvs.length === 0) { missing.push("CV / Resume"); errorKeys.add("cv"); }

    setValidationErrors(errorKeys);
    return missing;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (currentStep === 1) {
      const missingFields = getStep1MissingFields();
      if (missingFields.length > 0) {
        toast({
          title: "Please complete required fields",
          description: `Missing: ${missingFields.slice(0, 3).join(", ")}${missingFields.length > 3 ? ` +${missingFields.length - 3} more` : ""}`,
          variant: "destructive",
        });
        return;
      }
    }

    setSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("candidate_profiles")
        .update({
          full_name: profile.full_name,
          phone: profile.phone,
          date_of_birth: profile.date_of_birth || null,
          gender: profile.gender,
          address: profile.address,
          city: profile.city,
          country: profile.country,
          professional_title: profile.professional_title,
          bio: profile.bio,
          website: profile.website,
          expected_salary_min: profile.expected_salary_min ? parseInt(profile.expected_salary_min) : null,
          expected_salary_max: profile.expected_salary_max ? parseInt(profile.expected_salary_max) : null,
          linkedin_url: profile.linkedin_url,
          facebook_url: profile.facebook_url,
          twitter_url: profile.twitter_url,
          weight_kg: profile.weight_kg ? parseFloat(profile.weight_kg) : null,
          height_cm: profile.height_cm ? parseFloat(profile.height_cm) : null,
          ktp_number: profile.ktp_number,
          place_of_birth: profile.place_of_birth,
          how_found_us: profile.how_found_us,
          registration_city: profile.registration_city,
          referral_name: profile.referral_name,
          covid_vaccinated: profile.covid_vaccinated,
        })
        .eq("user_id", user.id);

      if (error) throw error;

      toast({
        title: "Profile updated successfully",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error updating profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const fetchMedicalTests = async () => {
    if (!candidateId) return;

    setLoadingTests(true);
    try {
      const { data, error } = await supabase
        .from("candidate_medical_tests" as any)
        .select("*")
        .eq("candidate_id", candidateId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMedicalTests(data || []);
    } catch (error) {
      console.error("Error fetching medical tests:", error);
      toast({
        title: "Error loading medical tests",
        variant: "destructive",
      });
    } finally {
      setLoadingTests(false);
    }
  };

  const handleTestFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 8 * 1024 * 1024; // 8MB
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Please select a PDF file under 8MB",
        variant: "destructive",
      });
      return;
    }

    if (file.type !== "application/pdf") {
      toast({
        title: "Invalid file type",
        description: "Please select a PDF file",
        variant: "destructive",
      });
      return;
    }

    setNewTest({ ...newTest, file });
  };

  const handleSaveTest = async () => {
    if (!candidateId || !newTest.test_name || !newTest.score) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setUploadingTest(true);
    try {
      let filePath = null;
      let fileName = null;

      if (newTest.file) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const fileExt = newTest.file.name.split(".").pop();
        fileName = `${Date.now()}.${fileExt}`;
        filePath = `${user.id}/medical-tests/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("candidate-documents")
          .upload(filePath, newTest.file);

        if (uploadError) throw uploadError;
      }

      const { error } = await supabase
        .from("candidate_medical_tests" as any)
        .insert({
          candidate_id: candidateId,
          test_name: newTest.test_name,
          score: parseFloat(newTest.score),
          file_path: filePath,
          file_name: fileName,
        });

      if (error) throw error;

      // Auto unlock Step 3 when Step 2 data is saved
      if (stepUnlocked < 3) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase
            .from("candidate_profiles")
            .update({ profile_step_unlocked: 3 })
            .eq("user_id", user.id);
          setStepUnlocked(3);
        }
      }

      toast({
        title: `${newTest.test_name} saved successfully`,
      });

      setNewTest({ test_name: "", score: "", file: null });
      if (testFileInputRef.current) {
        testFileInputRef.current.value = "";
      }
      fetchMedicalTests();
    } catch (error) {
      console.error("Error saving medical test:", error);
      toast({
        title: "Error saving medical test",
        variant: "destructive",
      });
    } finally {
      setUploadingTest(false);
    }
  };

  const handleDeleteTest = async (testId: string, filePath: string | null, testName: string) => {
    try {
      if (filePath) {
        await supabase.storage.from("candidate-documents").remove([filePath]);
      }

      const { error } = await supabase
        .from("candidate_medical_tests" as any)
        .delete()
        .eq("id", testId);

      if (error) throw error;

      toast({
        title: `${testName} deleted successfully`,
      });
      fetchMedicalTests();
    } catch (error) {
      console.error("Error deleting medical test:", error);
      toast({
        title: "Error deleting medical test",
        variant: "destructive",
      });
    }
  };

  const getFileUrl = (filePath: string) => {
    const { data } = supabase.storage.from("candidate-documents").getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleDownloadFile = async (filePath: string, fileName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from("candidate-documents")
        .download(filePath);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName || "document.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error("Error downloading file:", error);
      toast({
        title: "Error downloading file",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleViewFile = async (filePath: string) => {
    try {
      const { data, error } = await supabase.storage
        .from("candidate-documents")
        .createSignedUrl(filePath, 3600); // URL valid for 1 hour

      if (error) throw error;

      window.open(data.signedUrl, '_blank');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const fetchDeckExperiences = async () => {
    if (!candidateId) return;
    setLoadingDeck(true);
    try {
      const { data, error } = await supabase
        .from("candidate_experience" as any)
        .select("*")
        .eq("candidate_id", candidateId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setDeckExperiences(data || []);
    } catch (error) {
      console.error("Error fetching deck experiences:", error);
      toast({ title: "Error loading deck experience", variant: "destructive" });
    } finally {
      setLoadingDeck(false);
    }
  };

  const fetchDeckCertificates = async () => {
    if (!candidateId) return;
    setLoadingCertificate(true);
    try {
      const { data, error } = await supabase
        .from("candidate_certificates" as any)
        .select("*")
        .eq("candidate_id", candidateId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setDeckCertificates(data || []);
    } catch (error) {
      console.error("Error fetching deck certificates:", error);
      toast({ title: "Error loading deck certificates", variant: "destructive" });
    } finally {
      setLoadingCertificate(false);
    }
  };

  const fetchTravelDocuments = async () => {
    if (!candidateId) return;
    setLoadingTravel(true);
    try {
      const { data, error } = await supabase
        .from("candidate_travel_documents" as any)
        .select("*")
        .eq("candidate_id", candidateId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTravelDocuments(data || []);
    } catch (error) {
      console.error("Error fetching travel documents:", error);
      toast({ title: "Error loading travel documents", variant: "destructive" });
    } finally {
      setLoadingTravel(false);
    }
  };

  const fetchEducation = async () => {
    if (!candidateId) return;
    setLoadingEducation(true);
    try {
      const { data, error } = await supabase
        .from("candidate_education" as any)
        .select("*")
        .eq("candidate_id", candidateId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setEducations(data || []);
    } catch (error) {
      console.error("Error fetching education:", error);
      toast({ title: "Error loading education", variant: "destructive" });
    } finally {
      setLoadingEducation(false);
    }
  };

  const fetchEmergencyContacts = async () => {
    if (!candidateId) return;
    setLoadingEmergencyContacts(true);
    try {
      const { data, error } = await supabase
        .from("candidate_emergency_contacts" as any)
        .select("*")
        .eq("candidate_id", candidateId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setEmergencyContacts(data || []);
    } catch (error) {
      console.error("Error fetching emergency contacts:", error);
      toast({ title: "Error loading emergency contacts", variant: "destructive" });
    } finally {
      setLoadingEmergencyContacts(false);
    }
  };

  const handleDeckFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;
    const maxSize = 8 * 1024 * 1024; // 8MB
    if (file.size > maxSize || file.type !== "application/pdf") {
      toast({ title: "Invalid file", description: "PDF max 8MB", variant: "destructive" });
      return;
    }
    setNewDeck({ ...newDeck, file });
  };

  const handleCertificateFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;

    const maxSize = 8 * 1024 * 1024; // 8MB
    if (file.size > maxSize || file.type !== "application/pdf") {
      toast({ title: "Invalid file", description: "PDF max 8MB", variant: "destructive" });
      return;
    }

    setNewCertificate({ ...newCertificate, file });
  };

  const handleTravelFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;

    const maxSize = 8 * 1024 * 1024; // 8MB
    if (file.size > maxSize || file.type !== "application/pdf") {
      toast({ title: "Invalid file", description: "PDF max 8MB", variant: "destructive" });
      return;
    }

    setNewTravel({ ...newTravel, file });
  };

  const handleAddEducation = async () => {
    if (!candidateId) return;
    if (!newEducation.institution || !newEducation.start_date || !newEducation.end_date || !newEducation.degree) {
      toast({ title: "Please fill required fields", variant: "destructive" });
      return;
    }

    try {
      const { error } = await supabase
        .from("candidate_education" as any)
        .insert({
          candidate_id: candidateId,
          institution: newEducation.institution,
          start_date: newEducation.start_date || null,
          end_date: newEducation.end_date || null,
          degree: newEducation.degree,
        });

      if (error) throw error;

      toast({ title: "Education added" });
      setNewEducation({
        institution: "",
        start_date: "",
        end_date: "",
        degree: "",
      });
      fetchEducation();
    } catch (error) {
      console.error("Error adding education:", error);
      toast({ title: "Error adding education", variant: "destructive" });
    }
  };

  const handleAddDeck = async () => {
    if (!candidateId) return;

    // Different validation based on department
    if (department === "Hotel Department") {
      if (!newDeck.vessel_name_type || !newDeck.position || !newDeck.start_date || !newDeck.reason || !newDeck.job_description) {
        toast({ title: "Please fill required fields", variant: "destructive" });
        return;
      }
    } else {
      if (!newDeck.vessel_name_type || !newDeck.gt_loa || !newDeck.position || !newDeck.start_date || !newDeck.reason) {
        toast({ title: "Please fill required fields", variant: "destructive" });
        return;
      }
    }

    setUploadingDeck(true);
    try {
      let filePath: string | null = null;
      let fileName: string | null = null;
      if (newDeck.file) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const ext = newDeck.file.name.split(".").pop();
        fileName = `${Date.now()}.${ext}`;
        filePath = `${user.id}/deck-experiences/${fileName}`;
        const { error: uploadError } = await supabase.storage
          .from("candidate-documents")
          .upload(filePath, newDeck.file);
        if (uploadError) throw uploadError;
      }

      // Determine experience_type - use manual selection if provided, otherwise based on department
      const experienceType = newDeck.experience_type || (department === "Hotel" || department === "Hotel Department" ? "Hotel" : "Ship");

      const { error } = await supabase
        .from("candidate_experience" as any)
        .insert({
          candidate_id: candidateId,
          vessel_name_type: newDeck.vessel_name_type,
          gt_loa: newDeck.gt_loa,
          route: newDeck.route,
          position: newDeck.position,
          start_date: newDeck.start_date || null,
          end_date: newDeck.end_date || null,
          reason: newDeck.reason,
          job_description: newDeck.job_description,
          file_path: filePath,
          file_name: fileName,
          experience_type: experienceType,
        });
      if (error) throw error;

      toast({ title: "Deck experience added" });
      setNewDeck({
        vessel_name_type: "",
        gt_loa: "",
        route: "",
        position: "",
        start_date: "",
        end_date: "",
        reason: "",
        job_description: "",
        experience_type: "",
        file: null,
      });
      fetchDeckExperiences();
    } catch (error) {
      console.error("Error adding deck experience:", error);
      toast({ title: "Error adding deck experience", variant: "destructive" });
    } finally {
      setUploadingDeck(false);
    }
  };

  const handleDeleteDeck = async (id: string, file_path: string | null) => {
    try {
      if (file_path) {
        await supabase.storage.from("candidate-documents").remove([file_path]);
      }
      const { error } = await supabase
        .from("candidate_experience" as any)
        .delete()
        .eq("id", id);
      if (error) throw error;
      toast({ title: "Deck experience deleted" });
      fetchDeckExperiences();
    } catch (error) {
      console.error("Error deleting deck experience:", error);
      toast({ title: "Error deleting deck experience", variant: "destructive" });
    }
  };

  const handleDeleteCertificate = async (id: string, file_path: string | null) => {
    try {
      if (file_path) {
        await supabase.storage.from("candidate-documents").remove([file_path]);
      }

      const { error } = await supabase
        .from("candidate_certificates" as any)
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({ title: "Deck certificate deleted" });
      fetchDeckCertificates();
    } catch (error) {
      console.error("Error deleting deck certificate:", error);
      toast({ title: "Error deleting deck certificate", variant: "destructive" });
    }
  };

  // This function is replaced by the async version above at line ~850

  const handleDeleteReference = async (id: string) => {
    try {
      const { error } = await supabase
        .from("candidate_references")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setReferences(references.filter((ref) => ref.id !== id));
      toast({ title: "Reference deleted successfully" });
      fetchReferences();
    } catch (error: any) {
      toast({
        title: "Error deleting reference",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleAddReference = async () => {
    if (!candidateId) return;
    if (!newReference.full_name || !newReference.phone) {
      toast({ title: "Please fill required fields", variant: "destructive" });
      return;
    }

    try {
      const { data, error } = await supabase
        .from("candidate_references")
        .insert({
          candidate_id: candidateId,
          full_name: newReference.full_name,
          company: newReference.company || null,
          position: newReference.position || null,
          phone: newReference.phone,
          email: newReference.email || null,
          relationship: newReference.relationship || null,
        })
        .select()
        .single();

      if (error) throw error;

      setReferences([...references, data]);
      setNewReference({
        full_name: "",
        company: "",
        position: "",
        phone: "",
        email: "",
        relationship: "",
      });

      toast({ title: "Reference added successfully" });
      fetchReferences();
    } catch (error: any) {
      toast({
        title: "Error adding reference",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleAddTravel = async () => {
    if (!candidateId) return;
    if (!newTravel.document_type || !newTravel.document_number || !newTravel.issue_date || !newTravel.expiry_date) {
      toast({ title: "Please fill required fields", variant: "destructive" });
      return;
    }

    setUploadingTravel(true);
    try {
      let filePath: string | null = null;
      let fileName: string | null = null;

      if (newTravel.file) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const ext = newTravel.file.name.split(".").pop();
        fileName = `${Date.now()}.${ext}`;
        filePath = `${user.id}/travel-documents/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("candidate-documents")
          .upload(filePath, newTravel.file);

        if (uploadError) throw uploadError;
      }

      const { error } = await supabase
        .from("candidate_travel_documents" as any)
        .insert({
          candidate_id: candidateId,
          document_type: newTravel.document_type,
          document_number: newTravel.document_number || null,
          issuing_authority: newTravel.issuing_authority || null,
          issue_date: newTravel.issue_date || null,
          expiry_date: newTravel.expiry_date || null,
          file_path: filePath,
          file_name: fileName,
        });

      if (error) throw error;

      toast({ title: "Travel document added" });
      setNewTravel({
        document_type: "",
        document_number: "",
        issuing_authority: "",
        issue_date: "",
        expiry_date: "",
        file: null,
      });
      fetchTravelDocuments();
    } catch (error) {
      console.error("Error adding travel document:", error);
      toast({ title: "Error adding travel document", variant: "destructive" });
    } finally {
      setUploadingTravel(false);
    }
  };

  const handleDeleteTravel = async (id: string, file_path: string | null) => {
    try {
      if (file_path) {
        await supabase.storage.from("candidate-documents").remove([file_path]);
      }

      const { error } = await supabase
        .from("candidate_travel_documents" as any)
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({ title: "Travel document deleted" });
      fetchTravelDocuments();
    } catch (error) {
      console.error("Error deleting travel document:", error);
      toast({ title: "Error deleting travel document", variant: "destructive" });
    }
  };

  const handleAddNextOfKin = async () => {
    if (!candidateId) return;
    if (!newNextOfKin.full_name || !newNextOfKin.relationship) {
      toast({ title: "Please fill required fields", variant: "destructive" });
      return;
    }

    try {
      const { data, error } = await supabase
        .from("candidate_next_of_kin")
        .insert({
          candidate_id: candidateId,
          full_name: newNextOfKin.full_name,
          relationship: newNextOfKin.relationship,
          place_of_birth: newNextOfKin.place_of_birth || null,
          date_of_birth: newNextOfKin.date_of_birth || null,
          signature: newNextOfKin.signature || null,
        })
        .select()
        .single();

      if (error) throw error;

      setNextOfKins([data, ...nextOfKins]);
      setNewNextOfKin({
        full_name: "",
        relationship: "",
        place_of_birth: "",
        date_of_birth: "",
        signature: "",
      });
      toast({ title: "Next of kin added successfully" });
      fetchNextOfKin();
    } catch (error: any) {
      toast({ title: "Error adding next of kin", description: error.message, variant: "destructive" });
    }
  };

  const handleDeleteNextOfKin = async (id: string) => {
    try {
      const { error } = await supabase
        .from("candidate_next_of_kin")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setNextOfKins(nextOfKins.filter((item) => item.id !== id));
      toast({ title: "Next of kin deleted successfully" });
      fetchNextOfKin();
    } catch (error: any) {
      toast({
        title: "Error deleting next of kin",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const fetchReferences = async () => {
    if (!candidateId) return;
    try {
      const { data, error } = await supabase
        .from("candidate_references")
        .select("*")
        .eq("candidate_id", candidateId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReferences(data || []);
    } catch (error) {
      console.error("Error fetching references:", error);
      toast({ title: "Error loading references", variant: "destructive" });
    }
  };

  const fetchNextOfKin = async () => {
    if (!candidateId) return;
    try {
      const { data, error } = await supabase
        .from("candidate_next_of_kin")
        .select("*")
        .eq("candidate_id", candidateId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setNextOfKins(data || []);
    } catch (error) {
      console.error("Error fetching next of kin:", error);
      toast({ title: "Error loading next of kin", variant: "destructive" });
    }
  };

  const handleDeleteEducation = async (id: string) => {
    try {
      const { error } = await supabase
        .from("candidate_education" as any)
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({ title: "Education deleted" });
      fetchEducation();
    } catch (error) {
      console.error("Error deleting education:", error);
      toast({ title: "Error deleting education", variant: "destructive" });
    }
  };

  const handleAddEmergencyContact = async () => {
    if (!candidateId) return;
    if (!newEmergencyContact.full_name || !newEmergencyContact.relationship || !newEmergencyContact.phone) {
      toast({ title: "Please fill required fields", variant: "destructive" });
      return;
    }

    try {
      const { error } = await supabase
        .from("candidate_emergency_contacts" as any)
        .insert({
          candidate_id: candidateId,
          full_name: newEmergencyContact.full_name,
          relationship: newEmergencyContact.relationship,
          phone: newEmergencyContact.phone,
          email: newEmergencyContact.email || null,
          address: newEmergencyContact.address || null,
        });

      if (error) throw error;

      toast({ title: "Emergency contact added" });
      setNewEmergencyContact({
        full_name: "",
        relationship: "",
        phone: "",
        email: "",
        address: "",
      });
      fetchEmergencyContacts();
    } catch (error) {
      console.error("Error adding emergency contact:", error);
      toast({ title: "Error adding emergency contact", variant: "destructive" });
    }
  };

  const handleDeleteEmergencyContact = async (id: string) => {
    try {
      const { error } = await supabase
        .from("candidate_emergency_contacts" as any)
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({ title: "Emergency contact deleted" });
      fetchEmergencyContacts();
    } catch (error) {
      console.error("Error deleting emergency contact:", error);
      toast({ title: "Error deleting emergency contact", variant: "destructive" });
    }
  };
  // ============================
  // EDIT HANDLERS TO BE ADDED AFTER LINE 1258
  // ============================

  // Edit Handlers for Step 3
  const handleEditDeck = (row: any) => {
    setEditingDeckId(row.id);
    setNewDeck({
      vessel_name_type: row.vessel_name_type || "",
      gt_loa: row.gt_loa || "",
      route: row.route || "",
      position: row.position || "",
      start_date: row.start_date || "",
      end_date: row.end_date || "",
      reason: row.reason || "",
      job_description: row.job_description || "",
      experience_type: row.experience_type || "",
      file: null,
    });
  };

  const handleCancelDeckEdit = () => {
    setEditingDeckId(null);
    setNewDeck({
      vessel_name_type: "",
      gt_loa: "",
      route: "",
      position: "",
      start_date: "",
      end_date: "",
      reason: "",
      job_description: "",
      experience_type: "",
      file: null,
    });
  };

  const handleEditCertificate = (row: any) => {
    setEditingCertificateId(row.id);
    setNewCertificate({
      type_certificate: row.type_certificate || "",
      institution: row.institution || "",
      place: row.place || "",
      cert_number: row.cert_number || "",
      date_of_issue: row.date_of_issue || "",
      file: null,
    });
  };

  const handleCancelCertificateEdit = () => {
    setEditingCertificateId(null);
    setNewCertificate({
      type_certificate: "",
      institution: "",
      place: "",
      cert_number: "",
      date_of_issue: "",
      file: null,
    });
  };

  const handleEditTravel = (row: any) => {
    setEditingTravelId(row.id);
    setNewTravel({
      document_type: row.document_type || "",
      document_number: row.document_number || "",
      issuing_authority: row.issuing_authority || "",
      issue_date: row.issue_date || "",
      expiry_date: row.expiry_date || "",
      file: null,
    });
  };

  const handleCancelTravelEdit = () => {
    setEditingTravelId(null);
    setNewTravel({
      document_type: "",
      document_number: "",
      issuing_authority: "",
      issue_date: "",
      expiry_date: "",
      file: null,
    });
  };

  const handleEditEducation = (row: any) => {
    setEditingEducationId(row.id);
    setNewEducation({
      institution: row.institution || "",
      start_date: row.start_date || "",
      end_date: row.end_date || "",
      degree: row.degree || "",
    });
  };

  const handleCancelEducationEdit = () => {
    setEditingEducationId(null);
    setNewEducation({
      institution: "",
      start_date: "",
      end_date: "",
      degree: "",
    });
  };

  const handleEditReference = (row: any) => {
    setEditingReferenceId(row.id);
    setNewReference({
      full_name: row.full_name || "",
      company: row.company || "",
      position: row.position || "",
      phone: row.phone || "",
      email: row.email || "",
      relationship: row.relationship || "",
    });
  };

  const handleCancelReferenceEdit = () => {
    setEditingReferenceId(null);
    setNewReference({
      full_name: "",
      company: "",
      position: "",
      phone: "",
      email: "",
      relationship: "",
    });
  };

  const handleEditNextOfKin = (row: any) => {
    setEditingNextOfKinId(row.id);
    setNewNextOfKin({
      full_name: row.full_name || "",
      relationship: row.relationship || "",
      place_of_birth: row.place_of_birth || "",
      date_of_birth: row.date_of_birth || "",
      signature: row.signature || "",
    });
  };

  const handleCancelNextOfKinEdit = () => {
    setEditingNextOfKinId(null);
    setNewNextOfKin({
      full_name: "",
      relationship: "",
      place_of_birth: "",
      date_of_birth: "",
      signature: "",
    });
  };

  const handleEditEmergencyContact = (row: any) => {
    setEditingEmergencyContactId(row.id);
    setNewEmergencyContact({
      full_name: row.full_name || "",
      relationship: row.relationship || "",
      phone: row.phone || "",
      email: row.email || "",
      address: row.address || "",
    });
  };

  const handleCancelEmergencyContactEdit = () => {
    setEditingEmergencyContactId(null);
    setNewEmergencyContact({
      full_name: "",
      relationship: "",
      phone: "",
      email: "",
      address: "",
    });
  };

  // CV Functions
  const fetchCVs = async () => {
    if (!candidateId) return;
    try {
      const { data, error } = await supabase
        .from("candidate_cvs")
        .select("*")
        .eq("candidate_id", candidateId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCvs(data || []);
    } catch (error) {
      console.error("Error fetching CVs:", error);
      toast({ title: "Error loading CVs", variant: "destructive" });
    }
  };

  const handleCVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowedTypes.includes(file.type)) {
      toast({ title: "Invalid file type", description: "Please upload a PDF, DOC, or DOCX file", variant: "destructive" });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File too large", description: "Maximum file size is 5MB", variant: "destructive" });
      return;
    }

    setUploadingCV(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !candidateId) return;

      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage.from("cvs").upload(fileName, file);
      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase.from("candidate_cvs").insert({
        candidate_id: candidateId,
        file_name: file.name,
        file_path: fileName,
        file_size: file.size,
        file_type: file.type,
        is_default: cvs.length === 0,
      });

      if (dbError) throw dbError;
      toast({ title: "CV uploaded successfully" });
      fetchCVs();
    } catch (error) {
      console.error("Error uploading CV:", error);
      toast({ title: "Error uploading CV", variant: "destructive" });
    } finally {
      setUploadingCV(false);
      e.target.value = "";
    }
  };

  const handleSetDefaultCV = async (cvId: string) => {
    try {
      await supabase.from("candidate_cvs").update({ is_default: false }).eq("candidate_id", candidateId);
      const { error } = await supabase.from("candidate_cvs").update({ is_default: true }).eq("id", cvId);
      if (error) throw error;
      toast({ title: "Default CV updated" });
      fetchCVs();
    } catch (error) {
      console.error("Error setting default CV:", error);
      toast({ title: "Error updating default CV", variant: "destructive" });
    }
  };

  const handleDownloadCV = async (cv: CV) => {
    try {
      const { data, error } = await supabase.storage.from("cvs").download(cv.file_path);
      if (error) throw error;
      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = cv.file_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading CV:", error);
      toast({ title: "Error downloading CV", variant: "destructive" });
    }
  };

  const handleDeleteCV = async (cv: CV) => {
    if (!confirm("Are you sure you want to delete this CV?")) return;
    try {
      await supabase.storage.from("cvs").remove([cv.file_path]);
      const { error } = await supabase.from("candidate_cvs").delete().eq("id", cv.id);
      if (error) throw error;
      toast({ title: "CV deleted successfully" });
      fetchCVs();
    } catch (error) {
      console.error("Error deleting CV:", error);
      toast({ title: "Error deleting CV", variant: "destructive" });
    }
  };

  // Form Letter Functions
  const fetchFormLetters = async () => {
    if (!candidateId) return;
    try {
      const { data, error } = await supabase
        .from("candidate_form_letters" as any)
        .select("*")
        .eq("candidate_id", candidateId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setFormLetters((data as unknown as FormLetter[]) || []);
    } catch (error) {
      console.error("Error fetching form letters:", error);
      toast({ title: "Error loading form letters", variant: "destructive" });
    }
  };

  const handleFormLetterUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowedTypes.includes(file.type)) {
      toast({ title: "Invalid file type", description: "Please upload a PDF, DOC, or DOCX file", variant: "destructive" });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File too large", description: "Maximum file size is 5MB", variant: "destructive" });
      return;
    }

    setUploadingFormLetter(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !candidateId) return;

      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/form-letters/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage.from("candidate-documents").upload(fileName, file);
      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase.from("candidate_form_letters" as any).insert({
        candidate_id: candidateId,
        file_name: file.name,
        file_path: fileName,
        file_size: file.size,
        file_type: file.type,
        is_default: formLetters.length === 0,
      });

      if (dbError) throw dbError;
      toast({ title: "Form Letter uploaded successfully" });
      fetchFormLetters();
    } catch (error) {
      console.error("Error uploading form letter:", error);
      toast({ title: "Error uploading form letter", variant: "destructive" });
    } finally {
      setUploadingFormLetter(false);
      e.target.value = "";
    }
  };

  const handleSetDefaultFormLetter = async (id: string) => {
    try {
      await supabase.from("candidate_form_letters" as any).update({ is_default: false }).eq("candidate_id", candidateId);
      const { error } = await supabase.from("candidate_form_letters" as any).update({ is_default: true }).eq("id", id);
      if (error) throw error;
      toast({ title: "Default Form Letter updated" });
      fetchFormLetters();
    } catch (error) {
      console.error("Error setting default form letter:", error);
      toast({ title: "Error updating default form letter", variant: "destructive" });
    }
  };

  const handleDownloadFormLetter = async (fl: FormLetter) => {
    try {
      const { data, error } = await supabase.storage.from("candidate-documents").download(fl.file_path);
      if (error) throw error;
      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = fl.file_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading form letter:", error);
      toast({ title: "Error downloading form letter", variant: "destructive" });
    }
  };

  const handleDeleteFormLetter = async (fl: FormLetter) => {
    if (!confirm("Are you sure you want to delete this form letter?")) return;
    try {
      await supabase.storage.from("candidate-documents").remove([fl.file_path]);
      const { error } = await supabase.from("candidate_form_letters" as any).delete().eq("id", fl.id);
      if (error) throw error;
      toast({ title: "Form Letter deleted successfully" });
      fetchFormLetters();
    } catch (error) {
      console.error("Error deleting form letter:", error);
      toast({ title: "Error deleting form letter", variant: "destructive" });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const progressPercentage = (currentStep / totalSteps) * 100;

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-foreground mb-6">Personal Detail</h3>

            {/* Avatar Upload */}
            <div className="flex flex-col items-center gap-4 mb-6 pb-6 border-b">
              <Avatar className="w-32 h-32">
                <AvatarImage src={avatarPreview} alt={profile.full_name} />
                <AvatarFallback className="text-2xl">
                  <User className="w-16 h-16" />
                </AvatarFallback>
              </Avatar>
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                  id="avatar-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  disabled={uploading}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Photo
                    </>
                  )}
                </Button>
                <p className="text-sm text-muted-foreground mt-2 text-center">
                  Max 5MB, JPG/PNG
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name *</Label>
                <Input
                  id="full_name"
                  value={profile.full_name}
                  onChange={(e) => { setProfile({ ...profile, full_name: e.target.value }); setValidationErrors(prev => { const n = new Set(prev); n.delete("full_name"); return n; }); }}
                  required
                  className={validationErrors.has("full_name") ? "border-destructive ring-destructive" : ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ktp_number">KTP Number *</Label>
                <Input
                  id="ktp_number"
                  value={profile.ktp_number}
                  onChange={(e) => setProfile({ ...profile, ktp_number: e.target.value })}
                  placeholder="Indonesian ID Number"
                />
              </div>

              <div className="space-y-2">
                <Label>Weight and Height *</Label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <div className="flex">
                      <Input
                        type="number"
                        placeholder="Weight"
                        value={profile.weight_kg}
                        onChange={(e) => setProfile({ ...profile, weight_kg: e.target.value })}
                        className="rounded-r-none"
                      />
                      <span className="inline-flex items-center px-3 bg-muted border border-l-0 border-input rounded-r-md text-sm text-muted-foreground">
                        KG
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex">
                      <Input
                        type="number"
                        placeholder="Height"
                        value={profile.height_cm}
                        onChange={(e) => setProfile({ ...profile, height_cm: e.target.value })}
                        className="rounded-r-none"
                      />
                      <span className="inline-flex items-center px-3 bg-muted border border-l-0 border-input rounded-r-md text-sm text-muted-foreground">
                        CM
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender *</Label>
                <Select value={profile.gender} onValueChange={(value) => { setProfile({ ...profile, gender: value }); setValidationErrors(prev => { const n = new Set(prev); n.delete("gender"); return n; }); }}>
                  <SelectTrigger className={validationErrors.has("gender") ? "border-destructive ring-destructive" : ""}>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Nationality *</Label>
                <Input
                  id="country"
                  value={profile.country}
                  onChange={(e) => { setProfile({ ...profile, country: e.target.value }); setValidationErrors(prev => { const n = new Set(prev); n.delete("country"); return n; }); }}
                  placeholder="e.g., Indonesia"
                  className={validationErrors.has("country") ? "border-destructive ring-destructive" : ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Contact No *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => { setProfile({ ...profile, phone: e.target.value }); setValidationErrors(prev => { const n = new Set(prev); n.delete("phone"); return n; }); }}
                  className={validationErrors.has("phone") ? "border-destructive ring-destructive" : ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" value={profile.email} disabled />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  value={profile.address}
                  onChange={(e) => { setProfile({ ...profile, address: e.target.value }); setValidationErrors(prev => { const n = new Set(prev); n.delete("address"); return n; }); }}
                  className={validationErrors.has("address") ? "border-destructive ring-destructive" : ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={profile.city}
                  onChange={(e) => { setProfile({ ...profile, city: e.target.value }); setValidationErrors(prev => { const n = new Set(prev); n.delete("city"); return n; }); }}
                  className={validationErrors.has("city") ? "border-destructive ring-destructive" : ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="place_of_birth">Place of Birth *</Label>
                <Input
                  id="place_of_birth"
                  value={profile.place_of_birth}
                  onChange={(e) => { setProfile({ ...profile, place_of_birth: e.target.value }); setValidationErrors(prev => { const n = new Set(prev); n.delete("place_of_birth"); return n; }); }}
                  className={validationErrors.has("place_of_birth") ? "border-destructive ring-destructive" : ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date_of_birth">Date Of Birth *</Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  value={profile.date_of_birth}
                  onChange={(e) => { setProfile({ ...profile, date_of_birth: e.target.value }); setValidationErrors(prev => { const n = new Set(prev); n.delete("date_of_birth"); return n; }); }}
                  className={validationErrors.has("date_of_birth") ? "border-destructive ring-destructive" : ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="registration_city">In which city do you register? *</Label>
                <Select
                  value={profile.registration_city}
                  onValueChange={(value) => { setProfile({ ...profile, registration_city: value }); setValidationErrors(prev => { const n = new Set(prev); n.delete("registration_city"); return n; }); }}
                >
                  <SelectTrigger className={validationErrors.has("registration_city") ? "border-destructive ring-destructive" : ""}>
                    <SelectValue placeholder="Please select" />
                  </SelectTrigger>
                  <SelectContent className="bg-background z-50">
                    <SelectItem value="Jakarta">Jakarta</SelectItem>
                    <SelectItem value="Bandung">Bandung</SelectItem>
                    <SelectItem value="Bali">Bali</SelectItem>
                    <SelectItem value="Surabaya">Surabaya</SelectItem>
                    <SelectItem value="Yogyakarta">Yogyakarta</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="covid_vaccinated">COVID-19 Vaccination Status *</Label>
                <Select
                  value={profile.covid_vaccinated}
                  onValueChange={(value) => { setProfile({ ...profile, covid_vaccinated: value }); setValidationErrors(prev => { const n = new Set(prev); n.delete("covid_vaccinated"); return n; }); }}
                >
                  <SelectTrigger className={validationErrors.has("covid_vaccinated") ? "border-destructive ring-destructive" : ""}>
                    <SelectValue placeholder="Please select" />
                  </SelectTrigger>
                  <SelectContent className="bg-background z-50">
                    <SelectItem value="Not Vaccinated">Not Vaccinated</SelectItem>
                    <SelectItem value="Partially Vaccinated">Partially Vaccinated</SelectItem>
                    <SelectItem value="Fully Vaccinated">Fully Vaccinated</SelectItem>
                    <SelectItem value="Fully Vaccinated with Booster">Fully Vaccinated with Booster</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="how_found_us">How did you find us? *</Label>
                <Select
                  value={profile.how_found_us}
                  onValueChange={(value) => {
                    setProfile({ ...profile, how_found_us: value });
                    setValidationErrors(prev => { const n = new Set(prev); n.delete("how_found_us"); return n; });
                    if (value !== "Referral") {
                      setProfile(prev => ({ ...prev, referral_name: "" }));
                    }
                  }}
                >
                  <SelectTrigger className={validationErrors.has("how_found_us") ? "border-destructive ring-destructive" : ""}>
                    <SelectValue placeholder="Please select" />
                  </SelectTrigger>
                  <SelectContent className="bg-background z-50">
                    <SelectItem value="Online Search">Online Search</SelectItem>
                    <SelectItem value="Social Media">Social Media</SelectItem>
                    <SelectItem value="Referral">Referral</SelectItem>
                    <SelectItem value="Job Fair">Job Fair</SelectItem>
                    <SelectItem value="Company Website">Company Website</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {profile.how_found_us === "Referral" && (
                <div className="space-y-2">
                  <Label htmlFor="referral_name">Referral Name *</Label>
                  <Input
                    id="referral_name"
                    value={profile.referral_name}
                    onChange={(e) => { setProfile({ ...profile, referral_name: e.target.value }); setValidationErrors(prev => { const n = new Set(prev); n.delete("referral_name"); return n; }); }}
                    placeholder="Who referred you?"
                    className={validationErrors.has("referral_name") ? "border-destructive ring-destructive" : ""}
                  />
                </div>
              )}
            </div>

            {/* CV & Form Letter Section */}
            <div className={`mt-8 pt-6 border-t ${validationErrors.has("cv") ? "rounded-lg border-2 border-destructive p-4" : ""}`}>
              <h3 className="text-xl font-semibold text-foreground mb-6">CV / Resume <span className="text-destructive">*</span></h3>
              <Tabs value={documentsTab} onValueChange={setDocumentsTab}>
                <TabsList className="mb-6">
                  <TabsTrigger value="cv">CV / Resume <span className="text-destructive ml-1">*</span></TabsTrigger>
                  {/* <TabsTrigger value="form_letter">Form Letter <span className="text-destructive ml-1">*</span></TabsTrigger> */}
                </TabsList>

                <TabsContent value="cv">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-muted-foreground">Upload your CV/Resume documents (PDF, DOC, DOCX - Max 5MB)</p>
                      <div>
                        <Input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleCVUpload}
                          disabled={uploadingCV}
                          className="hidden"
                          id="cv-upload"
                        />
                        <label htmlFor="cv-upload">
                          <Button type="button" asChild disabled={uploadingCV}>
                            <span>
                              {uploadingCV ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                              Upload CV
                            </span>
                          </Button>
                        </label>
                      </div>
                    </div>

                    {cvs.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No CVs uploaded yet</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {cvs.map((cv) => (
                          <div key={cv.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center space-x-3">
                              <FileText className="w-8 h-8 text-primary" />
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{cv.file_name}</span>
                                  {cv.is_default && <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />}
                                </div>
                                <span className="text-sm text-muted-foreground">
                                  {formatFileSize(cv.file_size)} • {new Date(cv.created_at).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {!cv.is_default && (
                                <Button type="button" variant="outline" size="sm" onClick={() => handleSetDefaultCV(cv.id)}>
                                  Set Default
                                </Button>
                              )}
                              <Button type="button" variant="outline" size="icon" onClick={() => handleDownloadCV(cv)}>
                                <Download className="w-4 h-4" />
                              </Button>
                              <Button type="button" variant="outline" size="icon" onClick={() => handleDeleteCV(cv)}>
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* <TabsContent value="form_letter">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-muted-foreground">Upload your Form Letter documents (PDF, DOC, DOCX - Max 5MB)</p>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => window.open('/templates/Form_Letter_Template.docx', '_blank')}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download Template
                        </Button>
                        <Input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFormLetterUpload}
                          disabled={uploadingFormLetter}
                          className="hidden"
                          id="form-letter-upload"
                        />
                        <label htmlFor="form-letter-upload">
                          <Button type="button" asChild disabled={uploadingFormLetter}>
                            <span>
                              {uploadingFormLetter ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                              Upload Form Letter
                            </span>
                          </Button>
                        </label>
                      </div>
                    </div>

                    {formLetters.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No Form Letters uploaded yet</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {formLetters.map((fl) => (
                          <div key={fl.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center space-x-3">
                              <FileText className="w-8 h-8 text-primary" />
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{fl.file_name}</span>
                                  {fl.is_default && <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />}
                                </div>
                                <span className="text-sm text-muted-foreground">
                                  {formatFileSize(fl.file_size)} • {new Date(fl.created_at).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {!fl.is_default && (
                                <Button type="button" variant="outline" size="sm" onClick={() => handleSetDefaultFormLetter(fl.id)}>
                                  Set Default
                                </Button>
                              )}
                              <Button type="button" variant="outline" size="icon" onClick={() => handleDownloadFormLetter(fl)}>
                                <Download className="w-4 h-4" />
                              </Button>
                              <Button type="button" variant="outline" size="icon" onClick={() => handleDeleteFormLetter(fl)}>
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent> */}
              </Tabs>
            </div>
          </Card>
        );

      case 2:
        return (
          <Card className="p-6">
            <Alert className="mb-6 bg-orange-50 border-orange-200">
              <AlertDescription className="text-orange-900">
                If the test results are out, you must immediately upload the results here
              </AlertDescription>
            </Alert>

            <h3 className="text-lg font-semibold text-foreground mb-4">(Marlins/NEHA/CES)</h3>

            {loadingTests ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : (
              <>
                {medicalTests.length > 0 && (
                  <div className="table-responsive mb-6 border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Test Name</TableHead>
                          <TableHead>Score</TableHead>
                          <TableHead>File Result</TableHead>
                          <TableHead className="w-[100px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {medicalTests.map((test) => (
                          <TableRow key={test.id}>
                            <TableCell>{test.test_name}</TableCell>
                            <TableCell>{test.score}</TableCell>
                            <TableCell>
                              {test.file_path ? (
                                <div className="flex items-center gap-3">
                                  <Button
                                    variant="link"
                                    size="sm"
                                    onClick={() => handleViewFile(test.file_path)}
                                    className="text-primary hover:underline inline-flex items-center gap-1 h-auto p-0"
                                  >
                                    View File <ExternalLink className="w-3 h-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDownloadFile(test.file_path, test.file_name)}
                                    className="h-6 w-6 text-muted-foreground hover:text-primary"
                                    title="Download"
                                  >
                                    <Download className="w-4 h-4" />
                                  </Button>
                                </div>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="default"
                                  className="h-8 px-3"
                                >
                                  Edit
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  className="h-8 px-3"
                                  onClick={() => handleDeleteTest(test.id, test.file_path, test.test_name)}
                                >
                                  Delete
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="test_name">Test Name*</Label>
                    <Select
                      value={newTest.test_name}
                      onValueChange={(v) => setNewTest({ ...newTest, test_name: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select test" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Marlins">Marlins</SelectItem>
                        <SelectItem value="NEHA">NEHA</SelectItem>
                        <SelectItem value="CES">CES</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="score">Score*</Label>
                    <Input
                      id="score"
                      type="number"
                      step="0.01"
                      value={newTest.score}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val.length <= 3 && Number(val) <= 100) {
                          setNewTest({ ...newTest, score: val });
                        }
                      }}
                      placeholder="e.g., 99"
                      max={100}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="test_file">File Result*</Label>
                    <Input
                      ref={testFileInputRef}
                      id="test_file"
                      type="file"
                      accept=".pdf"
                      onChange={handleTestFileChange}
                    />
                    <p className="text-sm text-destructive">Filetype: Pdf, Max 8 MB</p>
                  </div>

                  <Button
                    type="button"
                    onClick={handleSaveTest}
                    disabled={uploadingTest}
                    variant="success"
                    className="rounded-full w-full"
                  >
                    {uploadingTest ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save"
                    )}
                  </Button>
                </div>
              </>
            )}
          </Card>
        );

      case 3:
        return (
          <Card className="p-6">
            <Tabs value={screeningTab} onValueChange={setScreeningTab}>
              <TabsList className="w-full justify-start h-auto flex-wrap gap-2 bg-transparent border-b rounded-none pb-2">
                <TabsTrigger value="deck_experience" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  {department === "Hotel Department" ? "Hotel Experience" : "Deck Experience"}
                </TabsTrigger>
                <TabsTrigger value="deck_certificate" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  {department === "Hotel Department" ? "Hotel Certificate" : "Deck Certificate"}
                </TabsTrigger>
                <TabsTrigger value="travel_document" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Travel Document
                </TabsTrigger>
                <TabsTrigger value="formal_education" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Formal Education Background
                </TabsTrigger>
                <TabsTrigger value="references" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  References
                </TabsTrigger>
                <TabsTrigger value="next_of_kin" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Next Of Kin
                </TabsTrigger>
                <TabsTrigger value="emergency_contact" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Emergency Contact Details
                </TabsTrigger>
              </TabsList>

              <TabsContent value="deck_experience" className="mt-6">
                {loadingDeck ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    <div className="xl:col-span-1 space-y-6 order-2 xl:order-1">
                      <div className="grid grid-cols-1 gap-4">
                        {/* Experience Type Dropdown - always visible */}
                        <div className="space-y-2">
                          <Label>Experience Type</Label>
                          <Select value={newDeck.experience_type} onValueChange={(v) => setNewDeck({ ...newDeck, experience_type: v as "Hotel" | "Ship" | "" })}>
                            <SelectTrigger>
                              <SelectValue placeholder={department === "Hotel Department" ? "Hotel (default)" : "Ship (default)"} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Hotel">Hotel</SelectItem>
                              <SelectItem value="Ship">Ship</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {department === "Hotel Department" ? (
                          <>
                            <div className="space-y-2">
                              <Label>Hotel Name*</Label>
                              <Input value={newDeck.vessel_name_type} onChange={(e) => setNewDeck({ ...newDeck, vessel_name_type: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                              <Label>Position*</Label>
                              <Input value={newDeck.position} onChange={(e) => setNewDeck({ ...newDeck, position: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Start Date*</Label>
                                <Input type="date" value={newDeck.start_date} onChange={(e) => setNewDeck({ ...newDeck, start_date: e.target.value })} />
                              </div>
                              <div className="space-y-2">
                                <Label>End Date</Label>
                                <Input type="date" value={newDeck.end_date} onChange={(e) => setNewDeck({ ...newDeck, end_date: e.target.value })} />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label>Reason*</Label>
                              <Select value={newDeck.reason} onValueChange={(v) => setNewDeck({ ...newDeck, reason: v })}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Please select" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Finished Contract">Finished Contract</SelectItem>
                                  <SelectItem value="Resign">Resign</SelectItem>
                                  <SelectItem value="Terminated">Terminated</SelectItem>
                                  <SelectItem value="Onboard">Onboard</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Job*</Label>
                              <Input value={newDeck.job_description} onChange={(e) => setNewDeck({ ...newDeck, job_description: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                              <Label>Description</Label>
                              <Textarea value={newDeck.route} onChange={(e) => setNewDeck({ ...newDeck, route: e.target.value })} />
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="space-y-2">
                              <Label>Vessel Name / Type*</Label>
                              <Input value={newDeck.vessel_name_type} onChange={(e) => setNewDeck({ ...newDeck, vessel_name_type: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                              <Label>GT / LOA (Length Over All)*</Label>
                              <Input value={newDeck.gt_loa} onChange={(e) => setNewDeck({ ...newDeck, gt_loa: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                              <Label>Vessel Route*</Label>
                              <Select value={newDeck.route} onValueChange={(v) => setNewDeck({ ...newDeck, route: v })}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Please select" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Foreign Going">Foreign Going</SelectItem>
                                  <SelectItem value="Domestic">Domestic</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Position*</Label>
                              <Input value={newDeck.position} onChange={(e) => setNewDeck({ ...newDeck, position: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Start Date*</Label>
                                <Input type="date" value={newDeck.start_date} onChange={(e) => setNewDeck({ ...newDeck, start_date: e.target.value })} />
                              </div>
                              <div className="space-y-2">
                                <Label>End Date</Label>
                                <Input type="date" value={newDeck.end_date} onChange={(e) => setNewDeck({ ...newDeck, end_date: e.target.value })} />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label>Reason for leaving or current status*</Label>
                              <Select value={newDeck.reason} onValueChange={(v) => setNewDeck({ ...newDeck, reason: v })}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Please select" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Finished Contract">Finished Contract</SelectItem>
                                  <SelectItem value="Resign">Resign</SelectItem>
                                  <SelectItem value="Terminated">Terminated</SelectItem>
                                  <SelectItem value="Onboard">Onboard</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Job Description (minimum 3)</Label>
                              <Textarea value={newDeck.job_description} onChange={(e) => setNewDeck({ ...newDeck, job_description: e.target.value })} />
                            </div>

                            <div className="space-y-2">
                              <Label>Approve</Label>
                              <Input type="file" accept=".pdf" onChange={handleDeckFileChange} />
                              <p className="text-sm text-muted-foreground">Filetype: Pdf, Max 8 MB</p>
                            </div>
                          </>
                        )}

                        <div className="flex gap-2">
                          {editingDeckId && (
                            <Button
                              type="button"
                              variant="outline"
                              onClick={handleCancelDeckEdit}
                            >
                              Cancel
                            </Button>
                          )}
                          <Button type="button" onClick={handleAddDeck} disabled={uploadingDeck} className="flex-1 rounded-full">
                            {uploadingDeck ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Saving...
                              </>
                            ) : editingDeckId ? (
                              "Update"
                            ) : (
                              "Add"
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="xl:col-span-2 order-1 xl:order-2">
                      {deckExperiences.length > 0 ? (
                        <div className="table-responsive border rounded-lg overflow-hidden">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                {department === "Hotel Department" ? (
                                  <>
                                    <TableHead>Hotel Name</TableHead>
                                    <TableHead>Position</TableHead>
                                    <TableHead>Start Date</TableHead>
                                    <TableHead>End Date</TableHead>
                                    <TableHead>Reason</TableHead>
                                    <TableHead>Job</TableHead>
                                    <TableHead>Description</TableHead>
                                  </>
                                ) : (
                                  <>
                                    <TableHead>Vessel Name / Type</TableHead>
                                    <TableHead>GT / LOA</TableHead>
                                    <TableHead>Vessel Route</TableHead>
                                    <TableHead>Position</TableHead>
                                    <TableHead>Approve</TableHead>
                                    <TableHead>Start Date</TableHead>
                                    <TableHead>End Date</TableHead>
                                    <TableHead>Job</TableHead>
                                  </>
                                )}
                                <TableHead className="w-[100px]"></TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {deckExperiences.map((row) => (
                                <TableRow key={row.id}>
                                  {department === "Hotel Department" ? (
                                    <>
                                      <TableCell>{row.vessel_name_type || "-"}</TableCell>
                                      <TableCell>{row.position}</TableCell>
                                      <TableCell>{row.start_date ? new Date(row.start_date).toLocaleDateString() : "-"}</TableCell>
                                      <TableCell>{row.end_date ? new Date(row.end_date).toLocaleDateString() : "-"}</TableCell>
                                      <TableCell>{row.reason}</TableCell>
                                      <TableCell className="max-w-[240px] truncate" title={row.job_description || ""}>
                                        {row.job_description || "-"}
                                      </TableCell>
                                      <TableCell className="max-w-[240px] truncate" title={row.route || ""}>
                                        {row.route || "-"}
                                      </TableCell>
                                    </>
                                  ) : (
                                    <>
                                      <TableCell>{row.vessel_name_type}</TableCell>
                                      <TableCell>{row.gt_loa}</TableCell>
                                      <TableCell>{row.route}</TableCell>
                                      <TableCell>{row.position}</TableCell>
                                      <TableCell>
                                        {row.file_path ? (
                                          <Button
                                            variant="link"
                                            size="sm"
                                            onClick={() => handleViewFile(row.file_path)}
                                            className="text-primary hover:underline inline-flex items-center gap-1 h-auto p-0"
                                          >
                                            View File <ExternalLink className="w-3 h-3" />
                                          </Button>
                                        ) : (
                                          <span className="text-muted-foreground">-</span>
                                        )}
                                      </TableCell>
                                      <TableCell>{row.start_date ? new Date(row.start_date).toLocaleDateString() : "-"}</TableCell>
                                      <TableCell>{row.end_date ? new Date(row.end_date).toLocaleDateString() : "-"}</TableCell>
                                      <TableCell className="max-w-[240px] truncate" title={row.job_description || ""}>
                                        {row.job_description || "-"}
                                      </TableCell>
                                    </>
                                  )}
                                  <TableCell>
                                    <div className="flex gap-2">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-8 px-3"
                                        onClick={() => handleEditDeck(row)}
                                      >
                                        Edit
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="destructive"
                                        className="h-8 px-3"
                                        onClick={() => handleDeleteDeck(row.id, row.file_path)}
                                      >
                                        Delete
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg text-muted-foreground bg-muted/30">
                          <p>No experiences added yet.</p>
                          <p className="text-sm">Fill out the form to add your experience.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="deck_certificate" className="mt-6">
                {loadingCertificate ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Form Card - Left Side */}
                    <div className="xl:col-span-1 space-y-6 order-2 xl:order-1">
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <Label>Type Certificates*</Label>
                          <Select
                            value={newCertificate.type_certificate}
                            onValueChange={(v) => setNewCertificate({ ...newCertificate, type_certificate: v })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Please select" />
                            </SelectTrigger>
                            <SelectContent>
                              {department === "Hotel Department" ? (
                                <>
                                  <SelectItem value="Basic Safety Training (BST)">Basic Safety Training (BST)</SelectItem>
                                  <SelectItem value="Crowd Management">Crowd Management</SelectItem>
                                  <SelectItem value="Crisis Management">Crisis Management</SelectItem>
                                  <SelectItem value="CID">CID</SelectItem>
                                  <SelectItem value="COC">COC</SelectItem>
                                  <SelectItem value="Rating Able">Rating Able</SelectItem>
                                  <SelectItem value="CCM">CCM</SelectItem>
                                  <SelectItem value="ETC.">ETC.</SelectItem>
                                </>
                              ) : (
                                <>
                                  <SelectItem value="BASIC SAFETY TRAINING (BST)">BASIC SAFETY TRAINING (BST)</SelectItem>
                                  <SelectItem value="ADVANCE FIRE FIGHTING (AFF)">ADVANCE FIRE FIGHTING (AFF)</SelectItem>
                                  <SelectItem value="MEDICAL FIRST AID (MFA)">MEDICAL FIRST AID (MFA)</SelectItem>
                                  <SelectItem value="PROFICIENCY IN SURVIVAL CRAFT AND RESCUE BOATS">PROFICIENCY IN SURVIVAL CRAFT AND RESCUE BOATS</SelectItem>
                                  <SelectItem value="CRISIS MANAGEMENT AND HUMAN BEHAVIOUR">CRISIS MANAGEMENT AND HUMAN BEHAVIOUR</SelectItem>
                                  <SelectItem value="CROWD MANAGEMENT">CROWD MANAGEMENT</SelectItem>
                                  <SelectItem value="SECURITY AWARENESS TRAINING">SECURITY AWARENESS TRAINING</SelectItem>
                                  <SelectItem value="SEAFARERS WITH DESIGNATED SECURITY DUTIES">SEAFARERS WITH DESIGNATED SECURITY DUTIES</SelectItem>
                                  <SelectItem value="RATING ABLE">RATING ABLE</SelectItem>
                                  <SelectItem value="RATING WATCHKEEPING">RATING WATCHKEEPING</SelectItem>
                                  <SelectItem value="COC">COC</SelectItem>
                                  <SelectItem value="ELECTRO TECHNICAL RATING">ELECTRO TECHNICAL RATING</SelectItem>
                                  <SelectItem value="ELECTRO TECHNICAL OFFICER">ELECTRO TECHNICAL OFFICER</SelectItem>
                                  <SelectItem value="SHIP SECURITY OFFICER">SHIP SECURITY OFFICER</SelectItem>
                                </>
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Institution*</Label>
                          <Input
                            value={newCertificate.institution}
                            onChange={(e) => setNewCertificate({ ...newCertificate, institution: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Place</Label>
                          <Input
                            value={newCertificate.place}
                            onChange={(e) => setNewCertificate({ ...newCertificate, place: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Cert. Number*</Label>
                          <Input
                            value={newCertificate.cert_number}
                            onChange={(e) => setNewCertificate({ ...newCertificate, cert_number: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Date Of Issue*</Label>
                          <Input
                            type="date"
                            value={newCertificate.date_of_issue}
                            onChange={(e) => setNewCertificate({ ...newCertificate, date_of_issue: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>File*</Label>
                          <Input type="file" accept=".pdf" onChange={handleCertificateFileChange} />
                          <p className="text-sm text-destructive">Filetype: Pdf, Max 8 MB</p>
                        </div>

                        <Button
                          type="button"
                          onClick={handleAddCertificate}
                          disabled={uploadingCertificate}
                          variant="success"
                          className="rounded-full w-full"
                        >
                          {uploadingCertificate ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            "Save"
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Data Card - Right Side */}
                    <div className="xl:col-span-2 order-1 xl:order-2">
                      {deckCertificates.length > 0 ? (
                        <div className="table-responsive border rounded-lg overflow-hidden">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Type</TableHead>
                                <TableHead>Institution</TableHead>
                                <TableHead>Cert. Number</TableHead>
                                <TableHead>Date Of Issue</TableHead>
                                <TableHead>File</TableHead>
                                <TableHead className="w-[100px]"></TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {deckCertificates.map((row) => (
                                <TableRow key={row.id}>
                                  <TableCell className="max-w-[160px] truncate" title={row.type_certificate || ""}>
                                    {row.type_certificate || "-"}
                                  </TableCell>
                                  <TableCell>{row.institution}</TableCell>
                                  <TableCell>{row.cert_number}</TableCell>
                                  <TableCell>
                                    {row.date_of_issue
                                      ? new Date(row.date_of_issue).toLocaleDateString()
                                      : "-"}
                                  </TableCell>
                                  <TableCell>
                                    {row.file_path ? (
                                      <Button
                                        variant="link"
                                        size="sm"
                                        onClick={() => handleViewFile(row.file_path)}
                                        className="text-primary hover:underline inline-flex items-center gap-1 h-auto p-0"
                                      >
                                        View File <ExternalLink className="w-3 h-3" />
                                      </Button>
                                    ) : (
                                      <span className="text-muted-foreground">-</span>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      className="h-8 px-3"
                                      onClick={() => handleDeleteCertificate(row.id, row.file_path)}
                                    >
                                      Delete
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg text-muted-foreground bg-muted/30">
                          <p>No certificates added yet.</p>
                          <p className="text-sm">Fill out the form to add your certificate.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="travel_document" className="mt-6">
                {loadingTravel ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Form Card - Left (smaller) */}
                    <div className="xl:col-span-1">
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <Label>Type Of Document*</Label>
                          <Select
                            value={newTravel.document_type}
                            onValueChange={(v) => setNewTravel({ ...newTravel, document_type: v })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Please select" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="PASSPORT">PASSPORT</SelectItem>
                              <SelectItem value="SEAMAN BOOK">SEAMAN BOOK</SelectItem>
                              <SelectItem value="VISA (US / LIBERIA / PANAMA )">VISA (US / LIBERIA / PANAMA )</SelectItem>
                              <SelectItem value="Vaccination YF">Vaccination YF</SelectItem>
                              <SelectItem value="Vaccination Covid19">Vaccination Covid19</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Document Number*</Label>
                          <Input
                            value={newTravel.document_number}
                            onChange={(e) => setNewTravel({ ...newTravel, document_number: e.target.value })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Issuing Authority</Label>
                          <Input
                            value={newTravel.issuing_authority}
                            onChange={(e) =>
                              setNewTravel({ ...newTravel, issuing_authority: e.target.value })
                            }
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Issue Date*</Label>
                            <Input
                              type="date"
                              value={newTravel.issue_date}
                              onChange={(e) =>
                                setNewTravel({ ...newTravel, issue_date: e.target.value })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Expiry Date*</Label>
                            <Input
                              type="date"
                              value={newTravel.expiry_date}
                              onChange={(e) =>
                                setNewTravel({ ...newTravel, expiry_date: e.target.value })
                              }
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>File*</Label>
                          <Input type="file" accept=".pdf" onChange={handleTravelFileChange} />
                          <p className="text-sm text-destructive">Filetype: Pdf, Max 8 MB</p>
                        </div>

                        <Button
                          type="button"
                          onClick={handleAddTravel}
                          disabled={uploadingTravel}
                          variant="success"
                          className="rounded-full w-full"
                        >
                          {uploadingTravel ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            "Save"
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Table Card - Right (larger) */}
                    <div className="xl:col-span-2">
                      {travelDocuments.length > 0 ? (
                        <div className="table-responsive border rounded-lg overflow-hidden">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Type Of Document</TableHead>
                                <TableHead>Number</TableHead>
                                <TableHead>Place Of Issuance</TableHead>
                                <TableHead>Date Of Issuance</TableHead>
                                <TableHead>Date Of Expiry</TableHead>
                                <TableHead>File</TableHead>
                                <TableHead className="w-[100px]"></TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {travelDocuments.map((row) => (
                                <TableRow key={row.id}>
                                  <TableCell>{row.document_type}</TableCell>
                                  <TableCell>{row.document_number}</TableCell>
                                  <TableCell>{row.issuing_authority}</TableCell>
                                  <TableCell>
                                    {row.issue_date
                                      ? new Date(row.issue_date).toLocaleDateString()
                                      : "-"}
                                  </TableCell>
                                  <TableCell>
                                    {row.expiry_date
                                      ? new Date(row.expiry_date).toLocaleDateString()
                                      : "-"}
                                  </TableCell>
                                  <TableCell>
                                    {row.file_path ? (
                                      <Button
                                        variant="link"
                                        size="sm"
                                        onClick={() => handleViewFile(row.file_path)}
                                        className="text-primary hover:underline inline-flex items-center gap-1 h-auto p-0"
                                      >
                                        View File <ExternalLink className="w-3 h-3" />
                                      </Button>
                                    ) : (
                                      <span className="text-muted-foreground">-</span>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      className="h-8 px-3"
                                      onClick={() => handleDeleteTravel(row.id, row.file_path)}
                                    >
                                      Delete
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg text-muted-foreground bg-muted/30 h-full">
                          <p>No travel documents added yet.</p>
                          <p className="text-sm">Fill out the form to add your travel document.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="formal_education" className="mt-6">
                {loadingEducation ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Form Card - Left (smaller) */}
                    <div className="xl:col-span-1">
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <Label>School Academy*</Label>
                          <Input
                            value={newEducation.institution}
                            onChange={(e) =>
                              setNewEducation({ ...newEducation, institution: e.target.value })
                            }
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>From Date*</Label>
                            <Input
                              type="date"
                              value={newEducation.start_date}
                              onChange={(e) =>
                                setNewEducation({ ...newEducation, start_date: e.target.value })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>To Date*</Label>
                            <Input
                              type="date"
                              value={newEducation.end_date}
                              onChange={(e) =>
                                setNewEducation({ ...newEducation, end_date: e.target.value })
                              }
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Qualification Attained*</Label>
                          <Input
                            value={newEducation.degree}
                            onChange={(e) =>
                              setNewEducation({ ...newEducation, degree: e.target.value })
                            }
                          />
                        </div>

                        <Button type="button" onClick={handleAddEducation} variant="success" className="rounded-full w-full">
                          Save
                        </Button>
                      </div>
                    </div>

                    {/* Table Card - Right (larger) */}
                    <div className="xl:col-span-2">
                      {educations.length > 0 ? (
                        <div className="table-responsive border rounded-lg overflow-hidden">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>School Academy</TableHead>
                                <TableHead>From Date</TableHead>
                                <TableHead>To Date</TableHead>
                                <TableHead>Qualification Attained</TableHead>
                                <TableHead className="w-[100px]"></TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {educations.map((row) => (
                                <TableRow key={row.id}>
                                  <TableCell>{row.institution}</TableCell>
                                  <TableCell>
                                    {row.start_date
                                      ? new Date(row.start_date).toLocaleDateString()
                                      : "-"}
                                  </TableCell>
                                  <TableCell>
                                    {row.end_date
                                      ? new Date(row.end_date).toLocaleDateString()
                                      : "-"}
                                  </TableCell>
                                  <TableCell>{row.degree}</TableCell>
                                  <TableCell>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      className="h-8 px-3"
                                      onClick={() => handleDeleteEducation(row.id)}
                                    >
                                      Delete
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg text-muted-foreground bg-muted/30 h-full">
                          <p>No education records added yet.</p>
                          <p className="text-sm">Fill out the form to add your education.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="references" className="mt-6">
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                  {/* Form Card - Left (smaller) */}
                  <div className="xl:col-span-1">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Full Name*</Label>
                        <Input
                          value={newReference.full_name}
                          onChange={(e) =>
                            setNewReference({ ...newReference, full_name: e.target.value })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Company</Label>
                        <Input
                          value={newReference.company}
                          onChange={(e) => setNewReference({ ...newReference, company: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Position</Label>
                        <Input
                          value={newReference.position}
                          onChange={(e) => setNewReference({ ...newReference, position: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Phone*</Label>
                        <Input
                          value={newReference.phone}
                          onChange={(e) =>
                            setNewReference({ ...newReference, phone: e.target.value })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                          type="email"
                          value={newReference.email}
                          onChange={(e) =>
                            setNewReference({ ...newReference, email: e.target.value })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Relationship</Label>
                        <Input
                          value={newReference.relationship}
                          onChange={(e) =>
                            setNewReference({ ...newReference, relationship: e.target.value })
                          }
                        />
                      </div>

                      <Button
                        type="button"
                        onClick={handleAddReference}
                        disabled={!newReference.full_name || !newReference.phone}
                        variant="success"
                        className="rounded-full w-full"
                      >
                        Save
                      </Button>
                    </div>
                  </div>

                  {/* Table Card - Right (larger) */}
                  <div className="xl:col-span-2">
                    {references.length > 0 ? (
                      <div className="table-responsive border rounded-lg overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Previous Employers Name</TableHead>
                              <TableHead>Company</TableHead>
                              <TableHead>Position</TableHead>
                              <TableHead>Contact Number</TableHead>
                              <TableHead>Email</TableHead>
                              <TableHead>Relationship</TableHead>
                              <TableHead className="w-[100px]"></TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {references.map((row) => (
                              <TableRow key={row.id}>
                                <TableCell>{row.full_name}</TableCell>
                                <TableCell>{row.company || "-"}</TableCell>
                                <TableCell>{row.position || "-"}</TableCell>
                                <TableCell>{row.phone}</TableCell>
                                <TableCell>{row.email || "-"}</TableCell>
                                <TableCell>{row.relationship || "-"}</TableCell>
                                <TableCell>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    className="h-8 px-3"
                                    type="button"
                                    onClick={() => handleDeleteReference(row.id)}
                                  >
                                    Delete
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg text-muted-foreground bg-muted/30 h-full">
                        <p>No references added yet.</p>
                        <p className="text-sm">Fill out the form to add your reference.</p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="next_of_kin" className="mt-6">
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                  {/* Form Card - Left (smaller) */}
                  <div className="xl:col-span-1">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label>Name*</Label>
                        <Input
                          value={newNextOfKin.full_name}
                          onChange={(e) => setNewNextOfKin({ ...newNextOfKin, full_name: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Relationship*</Label>
                        <Select
                          value={newNextOfKin.relationship}
                          onValueChange={(v) => setNewNextOfKin({ ...newNextOfKin, relationship: v })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Please select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Wife">Wife</SelectItem>
                            <SelectItem value="Husband">Husband</SelectItem>
                            <SelectItem value="Mother">Mother</SelectItem>
                            <SelectItem value="Father">Father</SelectItem>
                            <SelectItem value="Son">Son</SelectItem>
                            <SelectItem value="Daughter">Daughter</SelectItem>
                            <SelectItem value="Uncle">Uncle</SelectItem>
                            <SelectItem value="Aunty">Aunty</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Place Birth</Label>
                        <Input
                          value={newNextOfKin.place_of_birth}
                          onChange={(e) =>
                            setNewNextOfKin({ ...newNextOfKin, place_of_birth: e.target.value })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Date of Birth</Label>
                        <Input
                          type="date"
                          value={newNextOfKin.date_of_birth}
                          onChange={(e) =>
                            setNewNextOfKin({ ...newNextOfKin, date_of_birth: e.target.value })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Signature</Label>
                        <Input
                          value={newNextOfKin.signature}
                          onChange={(e) =>
                            setNewNextOfKin({ ...newNextOfKin, signature: e.target.value })
                          }
                        />
                      </div>

                      <Button
                        type="button"
                        onClick={handleAddNextOfKin}
                        variant="success"
                        className="rounded-full w-full"
                      >
                        Save
                      </Button>
                    </div>
                  </div>

                  {/* Table Card - Right (larger) */}
                  <div className="xl:col-span-2">
                    {nextOfKins.length > 0 ? (
                      <div className="table-responsive border rounded-lg overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>Relationship</TableHead>
                              <TableHead>Place Birth</TableHead>
                              <TableHead>Date of Birth</TableHead>
                              <TableHead>Signature</TableHead>
                              <TableHead className="w-[100px]"></TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {nextOfKins.map((row) => (
                              <TableRow key={row.id}>
                                <TableCell>{row.full_name}</TableCell>
                                <TableCell>{row.relationship}</TableCell>
                                <TableCell>{row.place_of_birth}</TableCell>
                                <TableCell>{row.date_of_birth}</TableCell>
                                <TableCell>{row.signature}</TableCell>
                                <TableCell>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    className="h-8 px-3"
                                    onClick={() => handleDeleteNextOfKin(row.id)}
                                  >
                                    Delete
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg text-muted-foreground bg-muted/30 h-full">
                        <p>No next of kin records added yet.</p>
                        <p className="text-sm">Fill out the form to add your next of kin.</p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="emergency_contact" className="mt-6">
                {loadingEmergencyContacts ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Form Card - Left (smaller) */}
                    <div className="xl:col-span-1">
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <Label>Full Name*</Label>
                          <Input
                            value={newEmergencyContact.full_name}
                            onChange={(e) =>
                              setNewEmergencyContact({ ...newEmergencyContact, full_name: e.target.value })
                            }
                            placeholder="Name of Wife/Husband/Mother/Father"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Relationship*</Label>
                          <Select
                            value={newEmergencyContact.relationship}
                            onValueChange={(v) =>
                              setNewEmergencyContact({ ...newEmergencyContact, relationship: v })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Please select" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Wife">Wife</SelectItem>
                              <SelectItem value="Husband">Husband</SelectItem>
                              <SelectItem value="Mother">Mother</SelectItem>
                              <SelectItem value="Father">Father</SelectItem>
                              <SelectItem value="Son">Son</SelectItem>
                              <SelectItem value="Daughter">Daughter</SelectItem>
                              <SelectItem value="Uncle">Uncle</SelectItem>
                              <SelectItem value="Aunty">Aunty</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Phone*</Label>
                          <Input
                            value={newEmergencyContact.phone}
                            onChange={(e) =>
                              setNewEmergencyContact({
                                ...newEmergencyContact,
                                phone: e.target.value,
                              })
                            }
                            placeholder="Phone Number +62 83"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>E Mail Address</Label>
                          <Input
                            type="email"
                            value={newEmergencyContact.email}
                            onChange={(e) =>
                              setNewEmergencyContact({ ...newEmergencyContact, email: e.target.value })
                            }
                            placeholder="Ignore if not there"
                          />
                        </div>

                        <Button
                          type="button"
                          onClick={handleAddEmergencyContact}
                          variant="success"
                          className="rounded-full w-full"
                        >
                          Save
                        </Button>
                      </div>
                    </div>

                    {/* Table Card - Right (larger) */}
                    <div className="xl:col-span-2">
                      {emergencyContacts.length > 0 ? (
                        <div className="table-responsive border rounded-lg overflow-hidden">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Relationship</TableHead>
                                <TableHead>Contact Number</TableHead>
                                <TableHead>E Mail Address</TableHead>
                                <TableHead className="w-[100px]"></TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {emergencyContacts.map((row) => (
                                <TableRow key={row.id}>
                                  <TableCell>{row.full_name}</TableCell>
                                  <TableCell>{row.relationship}</TableCell>
                                  <TableCell>{row.phone}</TableCell>
                                  <TableCell>{row.email || "-"}</TableCell>
                                  <TableCell>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      className="h-8 px-3"
                                      type="button"
                                      onClick={() => handleDeleteEmergencyContact(row.id)}
                                    >
                                      Delete
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg text-muted-foreground bg-muted/30 h-full">
                          <p>No emergency contacts added yet.</p>
                          <p className="text-sm">Fill out the form to add your emergency contact.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </Card>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </>
    );
  }

  const isSubmitting = saving || uploading || uploadingCV || uploadingFormLetter || uploadingTest || uploadingDeck || uploadingCertificate || uploadingTravel;

  return (
    <>
      {isSubmitting && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm pointer-events-auto">
          <div className="bg-background p-6 rounded-lg shadow-xl flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="font-medium text-lg">Processing...</p>
          </div>
        </div>
      )}
      <div className="max-w-8xl">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-foreground mb-2">My Profile</h2>
          <p className="text-muted-foreground">Complete your profile in {totalSteps} easy steps</p>
        </div>

        {/* Step Tabs */}
        {/* Step Tabs Desktop */}
        <div className="mb-6 hidden md:flex gap-2">
          <Button
            type="button"
            variant={currentStep === 1 ? "default" : "outline"}
            onClick={() => setCurrentStep(1)}
            className={currentStep === 1 ? "" : "bg-background"}
          >
            STEP 1 : Personal Detail
          </Button>
          <Button
            type="button"
            variant={currentStep === 2 ? "default" : "outline"}
            onClick={() => stepUnlocked >= 2 && setCurrentStep(2)}
            className={currentStep === 2 ? "" : "bg-background"}
            disabled={stepUnlocked < 2}
            title={stepUnlocked < 2 ? "Step ini belum dibuka oleh Admin" : ""}
          >
            STEP 2 : Pre Screening
          </Button>
          <Button
            type="button"
            variant={currentStep === 3 ? "default" : "outline"}
            onClick={() => stepUnlocked >= 3 && setCurrentStep(3)}
            className={currentStep === 3 ? "" : "bg-background"}
            disabled={stepUnlocked < 3}
            title={stepUnlocked < 3 ? "Step ini belum dibuka oleh Admin" : ""}
          >
            STEP 3 : Screening
          </Button>
        </div>

        {/* Step Tabs Mobile */}
        <div className="mb-6 block md:hidden">
          <Select
            value={currentStep.toString()}
            onValueChange={(value) => {
              const step = parseInt(value);
              if (step <= stepUnlocked) {
                setCurrentStep(step);
              }
            }}
          >
            <SelectTrigger className="w-full bg-background">
              <SelectValue placeholder="Select step" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">STEP 1 : Personal Detail</SelectItem>
              <SelectItem value="2" disabled={stepUnlocked < 2}>
                STEP 2 : Pre Screening {stepUnlocked < 2 ? "(Locked)" : ""}
              </SelectItem>
              <SelectItem value="3" disabled={stepUnlocked < 3}>
                STEP 3 : Screening {stepUnlocked < 3 ? "(Locked)" : ""}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="rounded-full"
            >
              Previous
            </Button>

            {currentStep < totalSteps && currentStep < stepUnlocked ? (
              <Button
                type="button"
                onClick={() => setCurrentStep(Math.min(stepUnlocked, currentStep + 1))}
                className="rounded-full"
              >
                Next
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={saving}
                className="rounded-full px-8"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Profile"
                )}
              </Button>
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default Profile;
