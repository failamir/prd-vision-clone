import { useEffect, useState, useRef } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, User, FileText, Trash2, Edit2, ExternalLink } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Profile = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const testFileInputRef = useRef<HTMLInputElement>(null);
  const [screeningTab, setScreeningTab] = useState("deck_experience");
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
  const [newDeck, setNewDeck] = useState({
    vessel_name_type: "",
    gt_loa: "",
    route: "",
    position: "",
    start_date: "",
    end_date: "",
    reason: "",
    job_description: "",
    file: null as File | null,
  });
  const [deckCertificates, setDeckCertificates] = useState<any[]>([]);
  const [loadingCertificate, setLoadingCertificate] = useState(false);
  const [uploadingCertificate, setUploadingCertificate] = useState(false);
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
  const [newTravel, setNewTravel] = useState({
    type_document: "",
    number: "",
    place_of_issuance: "",
    date_of_issuance: "",
    date_of_expiry: "",
    file: null as File | null,
  });
  const [nextOfKins, setNextOfKins] = useState<any[]>([]);
  const [newNextOfKin, setNewNextOfKin] = useState({
    name: "",
    relationship: "",
    place_of_birth: "",
    date_of_birth: "",
    signature: "",
  });
  const [educations, setEducations] = useState<any[]>([]);
  const [loadingEducation, setLoadingEducation] = useState(false);
  const [newEducation, setNewEducation] = useState({
    institution: "",
    start_date: "",
    end_date: "",
    degree: "",
  });
  const [references, setReferences] = useState<any[]>([]);
  const [newReference, setNewReference] = useState({
    previous_employer_name: "",
    recommendation_role: "",
    contact_details: "",
  });
  const [emergencyContacts, setEmergencyContacts] = useState<any[]>([]);
  const [loadingEmergencyContacts, setLoadingEmergencyContacts] = useState(false);
  const [newEmergencyContact, setNewEmergencyContact] = useState({
    name: "",
    relationship: "",
    contact_number: "",
    email: "",
  });
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
    if (candidateId && currentStep === 3 && screeningTab === "emergency_contact") {
      fetchEmergencyContacts();
    }
  }, [candidateId, currentStep, screeningTab]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

      toast({
        title: "Medical test saved successfully",
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

  const handleDeleteTest = async (testId: string, filePath: string | null) => {
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
        title: "Medical test deleted successfully",
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
    if (!newDeck.vessel_name_type || !newDeck.gt_loa || !newDeck.position || !newDeck.start_date || !newDeck.reason) {
      toast({ title: "Please fill required fields", variant: "destructive" });
      return;
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

  const handleAddReference = () => {
    if (!newReference.previous_employer_name || !newReference.recommendation_role || !newReference.contact_details) {
      toast({ title: "Please fill required fields", variant: "destructive" });
      return;
    }

    const nextId = references.length + 1;
    const newItem = {
      id: nextId,
      previous_employer_name: newReference.previous_employer_name,
      recommendation_role: newReference.recommendation_role,
      contact_details: newReference.contact_details,
    };

    setReferences([...references, newItem]);
    setNewReference({
      previous_employer_name: "",
      recommendation_role: "",
      contact_details: "",
    });
  };

  const handleDeleteReference = (id: number) => {
    setReferences(references.filter((ref) => ref.id !== id));
  };

  const handleAddTravel = async () => {
    if (!candidateId) return;
    if (!newTravel.type_document || !newTravel.number || !newTravel.place_of_issuance || !newTravel.date_of_issuance || !newTravel.date_of_expiry) {
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
          type_document: newTravel.type_document,
          number: newTravel.number,
          place_of_issuance: newTravel.place_of_issuance,
          date_of_issuance: newTravel.date_of_issuance || null,
          date_of_expiry: newTravel.date_of_expiry || null,
          file_path: filePath,
          file_name: fileName,
        });

      if (error) throw error;

      toast({ title: "Travel document added" });
      setNewTravel({
        type_document: "",
        number: "",
        place_of_issuance: "",
        date_of_issuance: "",
        date_of_expiry: "",
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

  const handleAddNextOfKin = () => {
    if (!newNextOfKin.name || !newNextOfKin.relationship) {
      toast({ title: "Please fill required fields", variant: "destructive" });
      return;
    }

    const newItem = {
      id: Date.now(),
      ...newNextOfKin,
    };

    setNextOfKins([newItem, ...nextOfKins]);
    setNewNextOfKin({
      name: "",
      relationship: "",
      place_of_birth: "",
      date_of_birth: "",
      signature: "",
    });
  };

  const handleDeleteNextOfKin = (id: number) => {
    setNextOfKins(nextOfKins.filter((item) => item.id !== id));
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
    if (!newEmergencyContact.name || !newEmergencyContact.relationship || !newEmergencyContact.contact_number) {
      toast({ title: "Please fill required fields", variant: "destructive" });
      return;
    }

    try {
      const { error } = await supabase
        .from("candidate_emergency_contacts" as any)
        .insert({
          candidate_id: candidateId,
          name: newEmergencyContact.name,
          relationship: newEmergencyContact.relationship,
          contact_number: newEmergencyContact.contact_number,
          email: newEmergencyContact.email || null,
        });

      if (error) throw error;

      toast({ title: "Emergency contact added" });
      setNewEmergencyContact({
        name: "",
        relationship: "",
        contact_number: "",
        email: "",
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
                  onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                  required
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
                <Select value={profile.gender} onValueChange={(value) => setProfile({ ...profile, gender: value })}>
                  <SelectTrigger>
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
                  onChange={(e) => setProfile({ ...profile, country: e.target.value })}
                  placeholder="e.g., Indonesia"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Contact No *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" value={profile.email} disabled />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  value={profile.address}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={profile.city}
                  onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="place_of_birth">Place of Birth *</Label>
                <Input
                  id="place_of_birth"
                  value={profile.place_of_birth}
                  onChange={(e) => setProfile({ ...profile, place_of_birth: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date_of_birth">Date Of Birth *</Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  value={profile.date_of_birth}
                  onChange={(e) => setProfile({ ...profile, date_of_birth: e.target.value })}
                />
              </div>
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
                  <div className="mb-6 border rounded-lg overflow-hidden">
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
                                <Button
                                  variant="link"
                                  size="sm"
                                  onClick={() => handleViewFile(test.file_path)}
                                  className="text-primary hover:underline inline-flex items-center gap-1 h-auto p-0"
                                >
                                  View File <ExternalLink className="w-3 h-3" />
                                </Button>
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
                                  onClick={() => handleDeleteTest(test.id, test.file_path)}
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
                    <Label htmlFor="test_name">Test Name</Label>
                    <Input
                      id="test_name"
                      value={newTest.test_name}
                      onChange={(e) => setNewTest({ ...newTest, test_name: e.target.value })}
                      placeholder="e.g., Marlin"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="score">Score</Label>
                    <Input
                      id="score"
                      type="number"
                      step="0.01"
                      value={newTest.score}
                      onChange={(e) => setNewTest({ ...newTest, score: e.target.value })}
                      placeholder="e.g., 99"
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
                    className="bg-destructive hover:bg-destructive/90"
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
                  Deck Experience
                </TabsTrigger>
                <TabsTrigger value="deck_certificate" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Deck Certificate
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
                  <>
                    {deckExperiences.length > 0 && (
                      <div className="mb-6 border rounded-lg overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>ID</TableHead>
                              <TableHead>Vessel Name / Type</TableHead>
                              <TableHead>GT / LOA</TableHead>
                              <TableHead>Vessel Route</TableHead>
                              <TableHead>Position</TableHead>
                              <TableHead>Approve</TableHead>
                              <TableHead>Start Date</TableHead>
                              <TableHead>End Date</TableHead>
                              <TableHead>Job</TableHead>
                              <TableHead className="w-[100px]"></TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {deckExperiences.map((row) => (
                              <TableRow key={row.id}>
                                <TableCell>{row.id}</TableCell>
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
                                <TableCell>
                                  <Button size="sm" variant="destructive" className="h-8 px-3" onClick={() => handleDeleteDeck(row.id, row.file_path)}>
                                    Delete
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}

                    <div className="grid grid-cols-1 gap-4">
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

                      <Button type="button" onClick={handleAddDeck} disabled={uploadingDeck}>
                        {uploadingDeck ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          "Add"
                        )}
                      </Button>
                    </div>
                  </>
                )}
              </TabsContent>

              <TabsContent value="deck_certificate" className="mt-6">
                {loadingCertificate ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : (
                  <>
                    {deckCertificates.length > 0 && (
                      <div className="mb-6 border rounded-lg overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>ID</TableHead>
                              <TableHead>Institution</TableHead>
                              <TableHead>Place</TableHead>
                              <TableHead>Cert. Number</TableHead>
                              <TableHead>Date Of Issue</TableHead>
                              <TableHead>File</TableHead>
                              <TableHead>Type Certificates</TableHead>
                              <TableHead className="w-[100px]"></TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {deckCertificates.map((row) => (
                              <TableRow key={row.id}>
                                <TableCell>{row.id}</TableCell>
                                <TableCell>{row.institution}</TableCell>
                                <TableCell>{row.place}</TableCell>
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
                                <TableCell className="max-w-[260px] truncate" title={row.type_certificate || ""}>
                                  {row.type_certificate || "-"}
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
                    )}

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
                        className="bg-destructive hover:bg-destructive/90"
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
                  </>
                )}
              </TabsContent>

              <TabsContent value="travel_document" className="mt-6">
                {loadingTravel ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : (
                  <>
                    {travelDocuments.length > 0 && (
                      <div className="mb-6 border rounded-lg overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>ID</TableHead>
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
                                <TableCell>{row.id}</TableCell>
                                <TableCell>{row.type_document}</TableCell>
                                <TableCell>{row.number}</TableCell>
                                <TableCell>{row.place_of_issuance}</TableCell>
                                <TableCell>
                                  {row.date_of_issuance
                                    ? new Date(row.date_of_issuance).toLocaleDateString()
                                    : "-"}
                                </TableCell>
                                <TableCell>
                                  {row.date_of_expiry
                                    ? new Date(row.date_of_expiry).toLocaleDateString()
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
                    )}

                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label>Type Of Document*</Label>
                        <Select
                          value={newTravel.type_document}
                          onValueChange={(v) => setNewTravel({ ...newTravel, type_document: v })}
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
                        <Label>Number*</Label>
                        <Input
                          value={newTravel.number}
                          onChange={(e) => setNewTravel({ ...newTravel, number: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Place Of Issuance*</Label>
                        <Input
                          value={newTravel.place_of_issuance}
                          onChange={(e) =>
                            setNewTravel({ ...newTravel, place_of_issuance: e.target.value })
                          }
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Date Of Issuance*</Label>
                          <Input
                            type="date"
                            value={newTravel.date_of_issuance}
                            onChange={(e) =>
                              setNewTravel({ ...newTravel, date_of_issuance: e.target.value })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Date Of Expiry*</Label>
                          <Input
                            type="date"
                            value={newTravel.date_of_expiry}
                            onChange={(e) =>
                              setNewTravel({ ...newTravel, date_of_expiry: e.target.value })
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
                        className="bg-destructive hover:bg-destructive/90"
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
                  </>
                )}
              </TabsContent>

              <TabsContent value="formal_education" className="mt-6">
                {loadingEducation ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : (
                  <>
                    {educations.length > 0 && (
                      <div className="mb-6 border rounded-lg overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>ID</TableHead>
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
                                <TableCell>{row.id}</TableCell>
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
                    )}

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

                      <Button type="button" onClick={handleAddEducation}>
                        Save
                      </Button>
                    </div>
                  </>
                )}
              </TabsContent>

              <TabsContent value="references" className="mt-6">
                {references.length > 0 && (
                  <div className="mb-6 border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Previous Employers Name</TableHead>
                          <TableHead>Address And Email / Contact Number</TableHead>
                          <TableHead>Recommendation</TableHead>
                          <TableHead className="w-[100px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {references.map((row) => (
                          <TableRow key={row.id}>
                            <TableCell>{row.id}</TableCell>
                            <TableCell>{row.previous_employer_name}</TableCell>
                            <TableCell className="max-w-[260px] whitespace-pre-line">
                              {row.contact_details}
                            </TableCell>
                            <TableCell>{row.recommendation_role}</TableCell>
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
                )}

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Previous Employers Name</Label>
                    <Input
                      value={newReference.previous_employer_name}
                      onChange={(e) =>
                        setNewReference({ ...newReference, previous_employer_name: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Recommendation/role</Label>
                    <Select
                      value={newReference.recommendation_role}
                      onValueChange={(v) => setNewReference({ ...newReference, recommendation_role: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Please select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Supervisor">Supervisor</SelectItem>
                        <SelectItem value="HR">HR</SelectItem>
                        <SelectItem value="Agency">Agency</SelectItem>
                        <SelectItem value="Owner">Owner</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Address And Email / Contact Number</Label>
                    <Textarea
                      value={newReference.contact_details}
                      onChange={(e) =>
                        setNewReference({ ...newReference, contact_details: e.target.value })
                      }
                      rows={4}
                    />
                  </div>

                  <Button
                    type="button"
                    onClick={handleAddReference}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    Save
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="next_of_kin" className="mt-6">
                {nextOfKins.length > 0 && (
                  <div className="mb-6 border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
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
                            <TableCell>{row.id}</TableCell>
                            <TableCell>{row.name}</TableCell>
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
                )}

                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label>Name*</Label>
                    <Input
                      value={newNextOfKin.name}
                      onChange={(e) => setNewNextOfKin({ ...newNextOfKin, name: e.target.value })}
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
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    Save
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="emergency_contact" className="mt-6">
                {loadingEmergencyContacts ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : (
                  <>
                    {emergencyContacts.length > 0 && (
                      <div className="mb-6 border rounded-lg overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>ID</TableHead>
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
                                <TableCell>{row.id}</TableCell>
                                <TableCell>{row.name}</TableCell>
                                <TableCell>{row.relationship}</TableCell>
                                <TableCell>{row.contact_number}</TableCell>
                                <TableCell>{row.email}</TableCell>
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
                    )}

                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label>Name*</Label>
                        <Input
                          value={newEmergencyContact.name}
                          onChange={(e) =>
                            setNewEmergencyContact({ ...newEmergencyContact, name: e.target.value })
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
                        <Label>Contact Number*</Label>
                        <Input
                          value={newEmergencyContact.contact_number}
                          onChange={(e) =>
                            setNewEmergencyContact({
                              ...newEmergencyContact,
                              contact_number: e.target.value,
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
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        Save
                      </Button>
                    </div>
                  </>
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
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-foreground mb-2">My Profile</h2>
          <p className="text-muted-foreground">Complete your profile in {totalSteps} easy steps</p>
        </div>

        {/* Step Tabs */}
        <div className="mb-6 flex gap-2">
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
            onClick={() => setCurrentStep(2)}
            className={currentStep === 2 ? "" : "bg-background"}
          >
            STEP 2 : Pre Screening
          </Button>
          <Button
            type="button"
            variant={currentStep === 3 ? "default" : "outline"}
            onClick={() => setCurrentStep(3)}
            className={currentStep === 3 ? "" : "bg-background"}
          >
            STEP 3 : Screening
          </Button>
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
            >
              Previous
            </Button>

            {currentStep < totalSteps ? (
              <Button
                type="button"
                onClick={() => setCurrentStep(Math.min(totalSteps, currentStep + 1))}
              >
                Next
              </Button>
            ) : (
              <Button type="submit" disabled={saving}>
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
    </DashboardLayout>
  );
};

export default Profile;
