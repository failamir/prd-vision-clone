import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ChevronDown, ChevronUp } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Application {
  id: string;
  status: string;
  remarks: string;
  crew_code: string;
  office_registered: string;
  date_of_entry: string;
  source: string;
  second_position: string;
  ship_experience: string;
  c1d_expiry_date: string;
  previous_experience: string;
  education_background: string;
  contact_no: string;
  emergency_contact: string;
  photo_url: string;
  cv_url: string;
  letter_form_url: string;
  vaccin_covid_booster: boolean;
  bst_cc: string;
  suitable: string;
  interview_by: string;
  interview_date: string;
  interview_result: string;
  interview_result_notes: string;
  approved_position: string;
  marlin_english_score: string;
  neha_ces_test: string;
  test_result: string;
  principal_interview_by: string;
  principal_interview_date: string;
  principal_interview_result: string;
  approved_as: string;
  employment_offer: string;
  eo_acceptance: string;
  applied_at: string;
  candidate_id?: string;
  candidate: {
    // user_id optional, not used for storage path but kept for potential future use
    user_id?: string;
    full_name: string;
    email: string;
    phone?: string;
    date_of_birth: string;
    gender: string;
    height_cm: number;
    weight_kg: number;
    registration_city?: string | null;
    how_found_us?: string | null;
  };
  job: {
    title: string;
    company_name: string;
    department: string;
  };
}

interface JobOption {
  id: string;
  title: string;
  company_name: string;
  department: string;
}

const AdminApplications = () => {
  const { toast } = useToast();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  // Advanced filters
  const [principal, setPrincipal] = useState("");
  const [department, setDepartment] = useState("");
  const [position, setPosition] = useState("");
  const [office, setOffice] = useState("");
  const [ageMin, setAgeMin] = useState("");
  const [ageMax, setAgeMax] = useState("");
  const [gender, setGender] = useState("");
  const [nehaScore, setNehaScore] = useState("");
  const [marlinScoreMin, setMarlinScoreMin] = useState("");
  const [marlinScoreMax, setMarlinScoreMax] = useState("");
  const [infoSource, setInfoSource] = useState("");
  const [educationBackground, setEducationBackground] = useState("");
  const [suitableFilter, setSuitableFilter] = useState(""); // Yes/No
  const [shipExperience, setShipExperience] = useState("");
  const [interviewResultFilter, setInterviewResultFilter] = useState("");
  const [interviewByFilter, setInterviewByFilter] = useState("");
  const [interviewDateMin, setInterviewDateMin] = useState("");
  const [interviewDateMax, setInterviewDateMax] = useState("");
  const [stwc2010, setStwc2010] = useState(""); // Yes/No
  const [approvedAsFilter, setApprovedAsFilter] = useState("");
  const [approvedPositionFilter, setApprovedPositionFilter] = useState("");
  const [principalInterviewByFilter, setPrincipalInterviewByFilter] = useState("");
  const [principalInterviewDateMin, setPrincipalInterviewDateMin] = useState("");
  const [principalInterviewDateMax, setPrincipalInterviewDateMax] = useState("");
  const [principalInterviewResultFilter, setPrincipalInterviewResultFilter] = useState("");
  const [remarksDialogOpen, setRemarksDialogOpen] = useState(false);
  const [activeApplication, setActiveApplication] = useState<Application | null>(null);
  const [selectedRemark, setSelectedRemark] = useState("");
  const [referenceDialogOpen, setReferenceDialogOpen] = useState(false);
  const [referenceLoading, setReferenceLoading] = useState(false);
  const [latestReference, setLatestReference] = useState<any | null>(null);
  const [latestExperienceByCandidate, setLatestExperienceByCandidate] = useState<Record<string, any>>({});
  const [latestEducationByCandidate, setLatestEducationByCandidate] = useState<Record<string, any>>({});
  const [experienceDialogOpen, setExperienceDialogOpen] = useState(false);
  const [activeExperience, setActiveExperience] = useState<any | null>(null);

  const [approvedPositionDialogOpen, setApprovedPositionDialogOpen] = useState(false);
  const [approvedPositionJobs, setApprovedPositionJobs] = useState<JobOption[]>([]);
  const [selectedApprovedJobId, setSelectedApprovedJobId] = useState<string>("");

  const [approvedAsDialogOpen, setApprovedAsDialogOpen] = useState(false);
  const [approvedAsJobs, setApprovedAsJobs] = useState<JobOption[]>([]);
  const [selectedApprovedAsJobId, setSelectedApprovedAsJobId] = useState<string>("");

  const [suitableDialogOpen, setSuitableDialogOpen] = useState(false);
  const [interviewerDialogOpen, setInterviewerDialogOpen] = useState(false);
  const [interviewDateDialogOpen, setInterviewDateDialogOpen] = useState(false);
  const [interviewResultDialogOpen, setInterviewResultDialogOpen] = useState(false);
  const [interviewNotesDialogOpen, setInterviewNotesDialogOpen] = useState(false);

  const [principalInterviewerDialogOpen, setPrincipalInterviewerDialogOpen] = useState(false);
  const [principalInterviewDateDialogOpen, setPrincipalInterviewDateDialogOpen] = useState(false);
  const [principalInterviewResultDialogOpen, setPrincipalInterviewResultDialogOpen] = useState(false);

  const [activeApp, setActiveApp] = useState<Application | null>(null);
  const [suitableChoice, setSuitableChoice] = useState<"Yes" | "No" | "">("");
  const [interviewerOptions, setInterviewerOptions] = useState<{ user_id: string; full_name: string }[]>([]);
  const [selectedInterviewer, setSelectedInterviewer] = useState("");
  const [interviewDateValue, setInterviewDateValue] = useState("");
  const [interviewResultValue, setInterviewResultValue] = useState<
    "Approved" | "Not Approved" | "Reclassed" | "Review" | ""
  >("");
  const [interviewNotesValue, setInterviewNotesValue] = useState("");

  const [principalInterviewerOptions, setPrincipalInterviewerOptions] = useState<
    { user_id: string; full_name: string }[]
  >([]);
  const [selectedPrincipalInterviewer, setSelectedPrincipalInterviewer] = useState("");
  const [principalInterviewDateValue, setPrincipalInterviewDateValue] = useState("");
  const [principalInterviewResultValue, setPrincipalInterviewResultValue] = useState<
    "Approved" | "Not Approved" | "Reclassed" | "Review" | ""
  >("");

  const [medicalTestsByCandidate, setMedicalTestsByCandidate] = useState<
    Record<string, Record<string, any>>
  >({});
  const [testDialogOpen, setTestDialogOpen] = useState(false);
  const [testType, setTestType] = useState<"CES" | "NEHA" | "Marlins" | "">("");
  const [testScore, setTestScore] = useState("");
  const [testFile, setTestFile] = useState<File | null>(null);
  const [savingTest, setSavingTest] = useState(false);

  const [notesDialogOpen, setNotesDialogOpen] = useState(false);
  const [notesValue, setNotesValue] = useState("");
  const [employmentOfferDialogOpen, setEmploymentOfferDialogOpen] = useState(false);
  const [employmentOfferValue, setEmploymentOfferValue] = useState<"Received" | "Not Received" | "">("");
  const [eoAcceptanceDialogOpen, setEoAcceptanceDialogOpen] = useState(false);
  const [eoAcceptanceValue, setEoAcceptanceValue] = useState<"Yes" | "No" | "">("");

  // Helpers: filters and utilities
  const clearFilters = () => {
    setSearchQuery("");
    setStartDate("");
    setEndDate("");
    setPrincipal("");
    setDepartment("");
    setPosition("");
    setOffice("");
    setAgeMin("");
    setAgeMax("");
    setGender("");
    setNehaScore("");
    setMarlinScoreMin("");
    setMarlinScoreMax("");
    setInfoSource("");
    setEducationBackground("");
    setSuitableFilter("");
    setShipExperience("");
    setInterviewResultFilter("");
    setInterviewByFilter("");
    setInterviewDateMin("");
    setInterviewDateMax("");
    setStwc2010("");
    setApprovedAsFilter("");
    setApprovedPositionFilter("");
    setPrincipalInterviewByFilter("");
    setPrincipalInterviewDateMin("");
    setPrincipalInterviewDateMax("");
    setPrincipalInterviewResultFilter("");
  };

  const withinDateRange = (value: string | null | undefined, min?: string, max?: string) => {
    if (!value) return true;
    const d = new Date(value);
    if (min) {
      const dMin = new Date(min);
      if (d < dMin) return false;
    }
    if (max) {
      const dMax = new Date(max);
      if (d > dMax) return false;
    }
    return true;
  };

  const numOrNull = (v: string | number | null | undefined) => {
    if (v === null || v === undefined) return null;
    const n = typeof v === 'number' ? v : parseFloat(String(v).replace(/[^0-9.\-]/g, ''));
    return isNaN(n) ? null : n;
  };

  const matchesText = (val: any, q: string) => {
    if (!q) return true;
    return (val ?? "").toString().toLowerCase().includes(q.toLowerCase());
  };

  const passesFilters = (app: Application) => {
    // Global search
    const searchPass = !searchQuery ||
      app.candidate.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.candidate.email.toLowerCase().includes(searchQuery.toLowerCase());
    if (!searchPass) return false;

    // Applied date range (use applied_at if present, else date_of_entry)
    const appliedDate = app.applied_at || app.date_of_entry;
    if (!withinDateRange(appliedDate, startDate || undefined, endDate || undefined)) return false;

    // Principal, Department, Position, Office
    if (!matchesText(app.job.company_name, principal)) return false;
    if (!matchesText(app.job.department, department)) return false;
    if (!matchesText(app.job.title, position)) return false;
    if (!matchesText(app.office_registered, office)) return false;

    // Age range
    const age = Number(calculateAge(app.candidate.date_of_birth));
    if (ageMin && age < Number(ageMin)) return false;
    if (ageMax && age > Number(ageMax)) return false;

    // Gender
    if (gender && app.candidate.gender.toLowerCase() !== gender.toLowerCase()) return false;

    // Marlin English score min/max
    const marlin = numOrNull(app.marlin_english_score);
    if (marlinScoreMin && (marlin === null || marlin < Number(marlinScoreMin))) return false;
    if (marlinScoreMax && (marlin === null || marlin > Number(marlinScoreMax))) return false;

    // NEHA score (minimum if provided)
    const neha = numOrNull(app.neha_ces_test);
    if (nehaScore && (neha === null || neha < Number(nehaScore))) return false;

    // Information Source
    if (!matchesText(app.source, infoSource)) return false;

    // Education Background
    if (!matchesText(app.education_background, educationBackground)) return false;

    // Suitable (Yes/No exact when selected)
    if (suitableFilter) {
      const s = (app.suitable || "").toString().toLowerCase();
      const target = suitableFilter.toLowerCase();
      if (!(target === "yes" ? ["yes","y","approved","approve"].includes(s) : ["no","n","rejected","reject"].includes(s))) return false;
    }

    // Ship Experience
    if (!matchesText(app.ship_experience, shipExperience)) return false;

    // Interview filters
    if (!matchesText(app.interview_by, interviewByFilter)) return false;
    if (!withinDateRange(app.interview_date, interviewDateMin || undefined, interviewDateMax || undefined)) return false;
    if (interviewResultFilter && (app.interview_result || "").toLowerCase() !== interviewResultFilter.toLowerCase()) return false;

    // STWC 2010 (approximate using bst_cc contains 'STWC')
    if (stwc2010) {
      const has = (app.bst_cc || "").toString().toUpperCase().includes("STWC");
      if (stwc2010 === 'Yes' && !has) return false;
      if (stwc2010 === 'No' && has) return false;
    }

    // Approved filters
    if (!matchesText(app.approved_as, approvedAsFilter)) return false;
    if (!matchesText(app.approved_position, approvedPositionFilter)) return false;

    // Principal interview filters
    if (!matchesText(app.principal_interview_by, principalInterviewByFilter)) return false;
    if (!withinDateRange(app.principal_interview_date, principalInterviewDateMin || undefined, principalInterviewDateMax || undefined)) return false;
    if (principalInterviewResultFilter && (app.principal_interview_result || "").toLowerCase() !== principalInterviewResultFilter.toLowerCase()) return false;

    return true;
  };

  const remarkOptions = [
    "step3:screening",
    "step2:pre-screening",
    "profile completion",
    "Interview",
    "approved",
  ];

  const openRemarksDialog = (app: Application) => {
    setActiveApplication(app);
    setSelectedRemark(app.remarks || app.status || "");
    setRemarksDialogOpen(true);
  };

  const fetchLatestReference = async (candidateId: string) => {
    setReferenceLoading(true);
    try {
      const { data, error } = await supabase
        .from("candidate_references")
        .select("*")
        .eq("candidate_id", candidateId)
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) throw error;
      setLatestReference(data?.[0] || null);
    } catch (error) {
      toast({ title: "Error loading reference", variant: "destructive" });
    } finally {
      setReferenceLoading(false);
    }
  };

  const fetchPrincipalInterviewers = async () => {
    try {
      const { data: roles, error } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "interviewer_principal");
      if (error) throw error;
      const uniqueIds = Array.from(new Set(((roles || []) as any[]).map((r: any) => r.user_id)));
      if (uniqueIds.length === 0) {
        setPrincipalInterviewerOptions([]);
        return [] as { user_id: string; full_name: string }[];
      }
      const { data: profiles, error: pErr } = await supabase
        .from("candidate_profiles")
        .select("user_id, full_name")
        .in("user_id", uniqueIds);
      if (pErr) throw pErr;
      const dedup = Array.from(
        new Map(((profiles as any) || []).map((p: any) => [p.user_id, p])).values()
      ) as { user_id: string; full_name: string }[];
      setPrincipalInterviewerOptions(dedup);
      return dedup;
    } catch {
      setPrincipalInterviewerOptions([]);
      return [] as { user_id: string; full_name: string }[];
    }
  };

  const openPrincipalInterviewerDialog = async (app: Application) => {
    setActiveApp(app);
    setPrincipalInterviewerDialogOpen(true);
    const opts = await fetchPrincipalInterviewers();
    if (app.principal_interview_by) {
      const found = (opts || principalInterviewerOptions).find(
        (o) => o.full_name === app.principal_interview_by
      );
      setSelectedPrincipalInterviewer(found?.user_id || "");
    } else {
      setSelectedPrincipalInterviewer("");
    }
  };

  const savePrincipalInterviewer = async () => {
    if (!activeApp) return;
    try {
      if (!selectedPrincipalInterviewer) {
        toast({ title: "Pilih principal interviewer dulu", variant: "destructive" });
        return;
      }
      let name =
        principalInterviewerOptions.find((o) => o.user_id === selectedPrincipalInterviewer)
          ?.full_name || null;
      if (!name && selectedPrincipalInterviewer) {
        const { data: prof } = await supabase
          .from("candidate_profiles")
          .select("full_name")
          .eq("user_id", selectedPrincipalInterviewer)
          .maybeSingle();
        name = (prof as any)?.full_name || null;
      }
      const toStore = name ?? (selectedPrincipalInterviewer || null);
      const { data, error } = await supabase
        .from("job_applications")
        .update({ principal_interview_by: toStore })
        .eq("id", activeApp.id)
        .select("id, principal_interview_by")
        .maybeSingle();
      if (error) throw error;
      if (!data) {
        toast({ title: "Tidak ada data diupdate", variant: "destructive" });
        return;
      }
      setApplications((prev) =>
        prev.map((a) =>
          a.id === activeApp.id ? { ...a, principal_interview_by: toStore as any } : a
        )
      );
      toast({ title: "Principal Interview By updated" });
      setPrincipalInterviewerDialogOpen(false);
      setActiveApp(null);
      await fetchApplications();
    } catch (e: any) {
      toast({ title: "Failed to update", description: e.message, variant: "destructive" });
    }
  };

  const openApprovedAsDialog = async (app: Application) => {
    setActiveApp(app);
    setApprovedAsDialogOpen(true);
    setApprovedAsJobs([]);
    setSelectedApprovedAsJobId("");

    if (!app.job?.department) return;

    try {
      const { data, error } = await supabase
        .from("jobs")
        .select("id, title, company_name, department")
        .eq("department", app.job.department);

      if (error) throw error;
      setApprovedAsJobs((data as any) || []);
    } catch (e: any) {
      toast({ title: "Error loading jobs", description: e.message, variant: "destructive" });
    }
  };

  const saveApprovedAs = async () => {
    if (!activeApp || !selectedApprovedAsJobId) return;

    const job = approvedAsJobs.find((j) => j.id === selectedApprovedJobId);
    if (!job) return;

    try {
      const { error } = await supabase
        .from("job_applications")
        .update({ approved_as: job.title })
        .eq("id", activeApp.id);

      if (error) throw error;

      setApplications((prev) =>
        prev.map((a) => (a.id === activeApp.id ? { ...a, approved_as: job.title } : a))
      );

      toast({ title: "Approved As updated" });
      setApprovedAsDialogOpen(false);
      setActiveApp(null);
      setSelectedApprovedAsJobId("");
    } catch (e: any) {
      toast({ title: "Failed to update", description: e.message, variant: "destructive" });
    }
  };

  const openPrincipalInterviewDateDialog = (app: Application) => {
    setActiveApp(app);
    setPrincipalInterviewDateValue(
      app.principal_interview_date ? app.principal_interview_date.substring(0, 10) : ""
    );
    setPrincipalInterviewDateDialogOpen(true);
  };

  const savePrincipalInterviewDate = async () => {
    if (!activeApp) return;
    try {
      const { error } = await supabase
        .from("job_applications")
        .update({ principal_interview_date: principalInterviewDateValue || null })
        .eq("id", activeApp.id);
      if (error) throw error;
      toast({ title: "Principal Interview Date updated" });
      setPrincipalInterviewDateDialogOpen(false);
      setActiveApp(null);
      fetchApplications();
    } catch (e: any) {
      toast({ title: "Failed to update", description: e.message, variant: "destructive" });
    }
  };

  const openPrincipalInterviewResultDialog = (app: Application) => {
    setActiveApp(app);
    const raw = (app.principal_interview_result || "") as string;
    let mapped: "Approved" | "Not Approved" | "Reclassed" | "Review" | "" = "";
    const lower = raw.toLowerCase();
    if (["approved", "approve", "pass"].includes(lower)) mapped = "Approved";
    else if (["not approved", "notapprove", "not pass", "fail"].includes(lower))
      mapped = "Not Approved";
    else if (lower === "reclassed") mapped = "Reclassed";
    else if (lower === "review") mapped = "Review";
    setPrincipalInterviewResultValue(mapped || (raw as any) || "");
    setPrincipalInterviewResultDialogOpen(true);
  };

  const savePrincipalInterviewResult = async () => {
    if (!activeApp || !principalInterviewResultValue) return;
    try {
      const { error } = await supabase
        .from("job_applications")
        .update({ principal_interview_result: principalInterviewResultValue })
        .eq("id", activeApp.id);
      if (error) throw error;
      toast({ title: "Principal Interview Result updated" });
      setPrincipalInterviewResultDialogOpen(false);
      setActiveApp(null);
      fetchApplications();
    } catch (e: any) {
      toast({ title: "Failed to update", description: e.message, variant: "destructive" });
    }
  };

  const openReferenceDialog = (app: Application) => {
    setActiveApplication(app);
    setLatestReference(null);
    setReferenceDialogOpen(true);
    if (app.candidate_id) {
      fetchLatestReference(app.candidate_id);
    }
  };

  const handleSaveRemarks = async () => {
    if (!activeApplication) return;

    const value = selectedRemark.trim();
    if (!value) {
      toast({ title: "Remarks cannot be empty", variant: "destructive" });
      return;
    }

    try {
      const { error } = await supabase
        .from("job_applications")
        .update({ remarks: value })
        .eq("id", activeApplication.id);

      if (error) throw error;

      toast({ title: "Remarks updated" });
      setRemarksDialogOpen(false);
      setActiveApplication(null);
      fetchApplications();
    } catch (error) {
      toast({ title: "Error updating remarks", variant: "destructive" });
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const generateCrewCodes = async () => {
    try {
      // Get all applications ordered by applied_at
      const { data: allApps, error: fetchError } = await supabase
        .from("job_applications")
        .select("id, crew_code, applied_at")
        .order("applied_at", { ascending: true });

      if (fetchError) throw fetchError;

      const appsWithoutCodes = (allApps || []).filter((app: any) => !app.crew_code);
      
      if (appsWithoutCodes.length === 0) return;

      // Find the highest existing crew code number
      const existingCodes = (allApps || [])
        .map((app: any) => app.crew_code)
        .filter(Boolean)
        .map((code: string) => {
          const match = code.match(/SGP-(\d+)/);
          return match ? parseInt(match[1]) : 0;
        });

      let nextNumber = existingCodes.length > 0 ? Math.max(...existingCodes) + 1 : 1;

      // Generate crew codes for applications without them
      for (const app of appsWithoutCodes) {
        const crewCode = `SGP-${String(nextNumber).padStart(4, '0')}`;
        
        const { error: updateError } = await supabase
          .from("job_applications")
          .update({ crew_code: crewCode })
          .eq("id", app.id);

        if (updateError) {
          console.error(`Error updating crew code for application ${app.id}:`, updateError);
        }

        nextNumber++;
      }

      toast({
        title: "Crew codes generated",
        description: `Generated ${appsWithoutCodes.length} crew codes`,
      });

      // Refresh applications to show the new crew codes
      fetchApplications();
    } catch (error) {
      console.error("Error generating crew codes:", error);
      toast({
        title: "Error generating crew codes",
        variant: "destructive",
      });
    }
  };

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from("job_applications")
        .select(`
          *,
          candidate:candidate_profiles!job_applications_candidate_id_fkey(
            user_id,
            full_name, 
            email,
            phone,
            date_of_birth, 
            gender,
            height_cm,
            weight_kg,
            registration_city,
            how_found_us
          ),
          job:jobs(title, company_name, department)
        `)
        .order("applied_at", { ascending: false });

      if (error) throw error;
      const apps = (data as any) || [];
      const candidateIds = apps.map((d: any) => d.candidate_id).filter(Boolean);

      if (candidateIds.length > 0) {
        const uniqueCandidateIds = Array.from(new Set(candidateIds)) as string[];

        const { data: travelDocs, error: travelError } = await supabase
          .from("candidate_travel_documents" as any)
          .select("candidate_id, expiry_date, document_type")
          .in("candidate_id", uniqueCandidateIds)
          .ilike("document_type", "%C1D%")
          .order("expiry_date", { ascending: false });

        if (travelError) throw travelError;

        const latestVisaByCandidate: Record<string, string | null> = {};
        (travelDocs || []).forEach((row: any) => {
          if (latestVisaByCandidate[row.candidate_id] === undefined) {
            latestVisaByCandidate[row.candidate_id] = row.expiry_date;
          }
        });

        const merged = apps.map((a: any) => ({
          ...a,
          c1d_expiry_date: latestVisaByCandidate[a.candidate_id] ?? a.c1d_expiry_date ?? null,
        }));

        setApplications(merged);
        await fetchMedicalTests(uniqueCandidateIds);
      } else {
        setApplications(apps);
      }
      await fetchLatestExperiences(candidateIds as string[]);
      await fetchLatestEducations(candidateIds as string[]);
      
      // Generate crew codes for applications without them
      await generateCrewCodes();
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast({
        title: "Error loading applications",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchLatestExperiences = async (candidateIds: string[]) => {
    if (!candidateIds || candidateIds.length === 0) return;
    try {
      const { data, error } = await supabase
        .from("candidate_experience" as any)
        .select("candidate_id, company, position, vessel_name_type, start_date, end_date, is_current, created_at, experience_type")
        .in("candidate_id", candidateIds)
        .order("created_at", { ascending: false });

      if (error) throw error;
      const map: Record<string, any> = {};
      (data || []).forEach((row: any) => {
        if (!map[row.candidate_id]) {
          map[row.candidate_id] = row;
        }
      });
      setLatestExperienceByCandidate(map);
    } catch (e) { }
  };

  const fetchLatestEducations = async (candidateIds: string[]) => {
    if (!candidateIds || candidateIds.length === 0) return;
    try {
      const { data, error } = await supabase
        .from("candidate_education" as any)
        .select("candidate_id, institution, degree, start_date, end_date, created_at")
        .in("candidate_id", candidateIds)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const map: Record<string, any> = {};
      (data || []).forEach((row: any) => {
        if (!map[row.candidate_id]) {
          map[row.candidate_id] = row;
        }
      });
      setLatestEducationByCandidate(map);
    } catch (e) { }
  };

  const fetchMedicalTests = async (candidateIds: string[]) => {
    if (!candidateIds || candidateIds.length === 0) return;
    try {
      const { data, error } = await supabase
        .from("candidate_medical_tests" as any)
        .select("id, candidate_id, test_name, score, file_path, file_name, created_at")
        .in("candidate_id", candidateIds)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const map: Record<string, Record<string, any>> = {};
      (data || []).forEach((row: any) => {
        const cid = row.candidate_id;
        const rawName = (row.test_name || "").toString();
        if (!cid || !rawName) return;

        const normalized = rawName.toUpperCase().replace(/\s+/g, "");
        let key: "Marlins" | "NEHA" | "CES" | null = null;

        if (normalized.includes("MARLIN")) {
          key = "Marlins";
        } else if (normalized.includes("NEHA")) {
          key = "NEHA";
        } else if (normalized.includes("CES")) {
          key = "CES";
        }

        if (!key) return;

        if (!map[cid]) map[cid] = {};
        if (!map[cid][key]) {
          map[cid][key] = row;
        }
      });

      setMedicalTestsByCandidate(map);
    } catch { }
  };

  const openApprovedPositionDialog = async (app: Application) => {
    setActiveApp(app);
    setApprovedPositionDialogOpen(true);
    setApprovedPositionJobs([]);
    setSelectedApprovedJobId("");

    if (!app.job?.department) return;

    try {
      const { data, error } = await supabase
        .from("jobs")
        .select("id, title, company_name, department")
        .eq("department", app.job.department);

      if (error) throw error;
      setApprovedPositionJobs((data as any) || []);
    } catch (e: any) {
      toast({ title: "Error loading jobs", description: e.message, variant: "destructive" });
    }
  };

  const saveApprovedPosition = async () => {
    if (!activeApp || !selectedApprovedJobId) return;

    const job = approvedPositionJobs.find((j) => j.id === selectedApprovedJobId);
    if (!job) return;

    try {
      const { error } = await supabase
        .from("job_applications")
        .update({ approved_position: job.title })
        .eq("id", activeApp.id);

      if (error) throw error;

      setApplications((prev) =>
        prev.map((a) => (a.id === activeApp.id ? { ...a, approved_position: job.title } : a))
      );

      toast({ title: "Approved Position updated" });
      setApprovedPositionDialogOpen(false);
      setActiveApp(null);
      setSelectedApprovedJobId("");
    } catch (e: any) {
      toast({ title: "Failed to update", description: e.message, variant: "destructive" });
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getLatestExperienceText = (candidateId?: string, fallback?: string) => {
    if (!candidateId) return fallback || "-";
    const exp = latestExperienceByCandidate[candidateId];
    if (!exp) return fallback || "-";
    const parts = [exp.position, exp.company, exp.vessel_name_type].filter(Boolean).join(" / ");
    const start = exp.start_date ? formatDate(exp.start_date) : "";
    const end = exp.is_current ? "Present" : (exp.end_date ? formatDate(exp.end_date) : "");
    const period = (start || end) ? ` (${[start, end].filter(Boolean).join(" - ")})` : "";
    return `${parts}${period}`;
  };

  const getShipExperienceFlag = (candidateId?: string) => {
    if (!candidateId) return "-";
    const exp = latestExperienceByCandidate[candidateId];
    if (!exp) return "-";

    const rawType = (exp.experience_type || "").toString().toLowerCase();
    const rawPosition = (exp.position || "").toString().toLowerCase();
    const rawVessel = (exp.vessel_name_type || "").toString().toLowerCase();

    const isDeckOrEngine =
      rawType.includes("deck") ||
      rawType.includes("engine") ||
      rawPosition.includes("deck") ||
      rawPosition.includes("eng") ||
      rawVessel.includes("deck") ||
      rawVessel.includes("engine");

    const isHotelOrOther =
      rawType.includes("hotel") ||
      rawType.includes("other") ||
      rawPosition.includes("hotel") ||
      rawVessel.includes("hotel");

    if (isDeckOrEngine) return "Yes";
    if (isHotelOrOther) return "No";
    return "-";
  };

  const getLatestEducationText = (candidateId?: string, fallback?: string) => {
    if (!candidateId) return fallback || "-";
    const edu = latestEducationByCandidate[candidateId];
    if (!edu) return fallback || "-";
    const title = [edu.degree, edu.institution].filter(Boolean).join(" @ ");
    const start = edu.start_date ? formatDate(edu.start_date) : "";
    const end = edu.end_date ? formatDate(edu.end_date) : "";
    const period = (start || end) ? ` (${[start, end].filter(Boolean).join(" - ")})` : "";
    return `${title}${period}`;
  };

  const calculateAge = (dob: string) => {
    if (!dob) return "-";
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleSelectAll = () => {
    setSelectedIds(new Set(applications.map(app => app.id)));
  };

  const handleDeselectAll = () => {
    setSelectedIds(new Set());
  };

  const handleToggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    
    if (!confirm(`Delete ${selectedIds.size} selected application(s)?`)) return;

    try {
      const { error } = await supabase
        .from("job_applications")
        .delete()
        .in("id", Array.from(selectedIds));

      if (error) throw error;

      toast({ title: "Applications deleted successfully" });
      setSelectedIds(new Set());
      fetchApplications();
    } catch (error) {
      toast({ title: "Error deleting applications", variant: "destructive" });
    }
  };

  const handleSetInterview = async () => {
    if (selectedIds.size === 0) return;

    try {
      const { error } = await supabase
        .from("job_applications")
        .update({ status: "interview", remarks: "interview" })
        .in("id", Array.from(selectedIds));

      if (error) throw error;

      toast({ title: "Applications updated to interview status" });
      fetchApplications();
    } catch (error) {
      toast({ title: "Error updating applications", variant: "destructive" });
    }
  };

  // Handlers for column modals
  const openSuitableDialog = (app: Application) => {
    setActiveApp(app);
    const raw = (app.suitable || "").toString().toLowerCase();
    let mapped: "Yes" | "No" | "" = "";
    if (["yes", "y", "approved", "approve"].includes(raw)) mapped = "Yes";
    else if (["no", "n", "rejected", "reject"].includes(raw)) mapped = "No";
    setSuitableChoice(mapped || (app.suitable as any) || "");
    setSuitableDialogOpen(true);
  };

  const saveSuitable = async () => {
    if (!activeApp || !suitableChoice) return;
    try {
      const { error } = await supabase
        .from("job_applications")
        .update({ suitable: suitableChoice })
        .eq("id", activeApp.id);
      if (error) throw error;
      toast({ title: "Suitable updated" });
      setSuitableDialogOpen(false);
      setActiveApp(null);
      fetchApplications();
    } catch (e: any) {
      toast({ title: "Failed to update suitable", description: e.message, variant: "destructive" });
    }
  };

  const fetchInterviewers = async () => {
    try {
      const { data: roles, error } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "interviewer");
      if (error) throw error;
      const uniqueIds = Array.from(new Set(((roles || []) as any[]).map((r: any) => r.user_id)));
      if (uniqueIds.length === 0) {
        setInterviewerOptions([]);
        return [] as { user_id: string; full_name: string }[];
      }
      const { data: profiles, error: pErr } = await supabase
        .from("candidate_profiles")
        .select("user_id, full_name")
        .in("user_id", uniqueIds);
      if (pErr) throw pErr;
      const dedup = Array.from(
        new Map(((profiles as any) || []).map((p: any) => [p.user_id, p])).values()
      ) as { user_id: string; full_name: string }[];
      setInterviewerOptions(dedup);
      return dedup;
    } catch (e) {
      setInterviewerOptions([]);
      return [] as { user_id: string; full_name: string }[];
    }
  };

  const openInterviewerDialog = async (app: Application) => {
    setActiveApp(app);
    setInterviewerDialogOpen(true);
    const opts = await fetchInterviewers();
    if (app.interview_by) {
      const found = (opts || interviewerOptions).find((o) => o.full_name === app.interview_by);
      setSelectedInterviewer(found?.user_id || "");
    } else {
      setSelectedInterviewer("");
    }
  };

  const saveInterviewer = async () => {
    if (!activeApp) return;
    try {
      if (!selectedInterviewer) {
        toast({ title: "Pilih interviewer dulu", variant: "destructive" });
        return;
      }
      let name = interviewerOptions.find((o) => o.user_id === selectedInterviewer)?.full_name || null;
      if (!name && selectedInterviewer) {
        const { data: prof } = await supabase
          .from("candidate_profiles")
          .select("full_name")
          .eq("user_id", selectedInterviewer)
          .maybeSingle();
        name = (prof as any)?.full_name || null;
      }
      const toStore = name ?? (selectedInterviewer || null);
      const { data, error } = await supabase
        .from("job_applications")
        .update({ interview_by: toStore })
        .eq("id", activeApp.id)
        .select("id, interview_by")
        .maybeSingle();
      if (error) throw error;
      if (!data) {
        toast({ title: "Tidak ada data diupdate", variant: "destructive" });
        return;
      }
      // Optimistic UI update
      setApplications((prev) => prev.map((a) => a.id === activeApp.id ? { ...a, interview_by: toStore as any } : a));
      toast({ title: "Interview By updated" });
      setInterviewerDialogOpen(false);
      setActiveApp(null);
      await fetchApplications();
    } catch (e: any) {
      toast({ title: "Failed to update", description: e.message, variant: "destructive" });
    }
  };

  const openInterviewDateDialog = (app: Application) => {
    setActiveApp(app);
    setInterviewDateValue(app.interview_date ? app.interview_date.substring(0, 10) : "");
    setInterviewDateDialogOpen(true);
  };

  const saveInterviewDate = async () => {
    if (!activeApp) return;
    try {
      const { error } = await supabase
        .from("job_applications")
        .update({ interview_date: interviewDateValue || null })
        .eq("id", activeApp.id);
      if (error) throw error;
      toast({ title: "Interview Date updated" });
      setInterviewDateDialogOpen(false);
      setActiveApp(null);
      fetchApplications();
    } catch (e: any) {
      toast({ title: "Failed to update", description: e.message, variant: "destructive" });
    }
  };

  const openInterviewResultDialog = (app: Application) => {
    setActiveApp(app);
    // Normalisasi value lama kalau ada (misal: pass / not pass) ke salah satu dari 4 opsi baru bila perlu
    const raw = (app.interview_result || "") as string;
    let mapped: "Approved" | "Not Approved" | "Reclassed" | "Review" | "" = "";
    const lower = raw.toLowerCase();
    if (["approved", "approve", "pass"].includes(lower)) mapped = "Approved";
    else if (["not approved", "notapprove", "not pass", "fail"].includes(lower)) mapped = "Not Approved";
    else if (lower === "reclassed") mapped = "Reclassed";
    else if (lower === "review") mapped = "Review";
    setInterviewResultValue(mapped || (raw as any) || "");
    setInterviewResultDialogOpen(true);
  };

  const saveInterviewResult = async () => {
    if (!activeApp || !interviewResultValue) return;
    try {
      const { error } = await supabase
        .from("job_applications")
        .update({ interview_result: interviewResultValue })
        .eq("id", activeApp.id);
      if (error) throw error;
      toast({ title: "Interview Result updated" });
      setInterviewResultDialogOpen(false);
      setActiveApp(null);
      fetchApplications();
    } catch (e: any) {
      toast({ title: "Failed to update", description: e.message, variant: "destructive" });
    }
  };

  const openInterviewNotesDialog = (app: Application) => {
    setActiveApp(app);
    setInterviewNotesValue(app.interview_result_notes || "");
    setInterviewNotesDialogOpen(true);
  };

  const saveInterviewNotes = async () => {
    if (!activeApp) return;
    try {
      const { error } = await supabase
        .from("job_applications")
        .update({ interview_result_notes: interviewNotesValue || null })
        .eq("id", activeApp.id);
      if (error) throw error;
      toast({ title: "Notes updated" });
      setInterviewNotesDialogOpen(false);
      setActiveApp(null);
      fetchApplications();
    } catch (e: any) {
      toast({ title: "Failed to update", description: e.message, variant: "destructive" });
    }
  };

  const exportToExcel = () => {
    // Enhanced CSV export to include ALL fields with proper formatting and URLs for file fields
    const dash = (v: any) => (v === undefined || v === null || v === "" ? "-" : v);
    const safe = (v: any) => {
      const val = dash(v);
      // CSV escape (wrap in quotes and double any quotes inside)
      return `"${String(val).replace(/"/g, '""')}"`;
    };

    const headers = [
      "Remarks/Record",
      "Crew Code",
      "First Name",
      "Last Name",
      "Office Registered",
      "Date of Entry",
      "Source",
      "Position",
      "Department",
      "Second Position",
      "Gender",
      "DOB",
      "Age",
      "Weight/Height",
      "Ship Experience",
      "C1D Expiry Date",
      "Previous Experience",
      "Education Background",
      "Contact No",
      "Email",
      "Emergency Contact",
      "Photo URL",
      "CV URL",
      "Letter Form URL",
      "Vaccin Covid Booster",
      "BST/CC",
      "Suitable",
      "Interview By",
      "Interview Date",
      "Interview Result",
      "Interview Result Notes",
      "Approved Position",
      "Marlin / English Score",
      "Neha/CES Test",
      "Test Result",
      "Principal Interview By",
      "Principal Interview Date",
      "Principal Interview Result",
      "Approved As",
      "Notes",
      "Employment Offer",
      "EO Acceptance",
      "Applied At",
      "Company",
    ];

    const rows = applications.map((app) => {
      const firstName = app.candidate?.full_name ? app.candidate.full_name.split(" ")[0] : "";
      const lastName = app.candidate?.full_name ? app.candidate.full_name.split(" ").slice(1).join(" ") : "";

      return [
        safe(app.remarks || app.status),
        safe(app.crew_code),
        safe(firstName),
        safe(lastName),
        safe(app.office_registered),
        safe(app.date_of_entry ? formatDate(app.date_of_entry) : "-"),
        safe(app.source),
        safe(app.job?.title),
        safe(app.job?.department),
        safe(app.second_position),
        safe(app.candidate?.gender),
        safe(app.candidate?.date_of_birth ? formatDate(app.candidate.date_of_birth) : "-"),
        safe(app.candidate?.date_of_birth ? calculateAge(app.candidate.date_of_birth) : "-"),
        safe(app.candidate?.weight_kg && app.candidate?.height_cm ? `${app.candidate.weight_kg} / ${app.candidate.height_cm}` : "-"),
        safe(app.ship_experience),
        safe(app.c1d_expiry_date ? formatDate(app.c1d_expiry_date) : "-"),
        safe(app.previous_experience),
        safe(app.education_background),
        safe(app.contact_no),
        safe(app.candidate?.email),
        safe(app.emergency_contact),
        safe(app.photo_url),
        safe(app.cv_url),
        safe(app.letter_form_url),
        safe(app.vaccin_covid_booster ? "Yes" : "-"),
        safe(app.bst_cc),
        safe(app.suitable),
        safe(app.interview_by),
        safe(app.interview_date ? formatDate(app.interview_date) : "-"),
        safe(app.interview_result),
        safe(app.interview_result_notes),
        safe(app.approved_position),
        safe(app.marlin_english_score),
        safe(app.neha_ces_test),
        safe(app.test_result),
        safe(app.principal_interview_by),
        safe(app.principal_interview_date ? formatDate(app.principal_interview_date) : "-"),
        safe(app.principal_interview_result),
        safe(app.approved_as),
        safe(app.status),
        safe(app.employment_offer),
        safe(app.eo_acceptance),
        safe(app.applied_at ? formatDate(app.applied_at) : "-"),
        safe(app.job?.company_name),
      ];
    });

    const csv = [headers.map(safe).join(","), ...rows.map((row) => row.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sgp-applications.csv";
    a.click();
  };

  const getTestRow = (app: Application, type: "CES" | "NEHA" | "Marlins") => {
    if (!app.candidate_id) return null;
    const byCandidate = medicalTestsByCandidate[app.candidate_id];
    if (!byCandidate) return null;
    return byCandidate[type] || null;
  };

  const getTestScoreText = (app: Application, type: "CES" | "NEHA" | "Marlins", fallback?: string) => {
    const row = getTestRow(app, type);
    if (row && row.score != null) {
      return row.score.toString();
    }

    if (fallback) return fallback;

    switch (type) {
      case "Marlins":
        return app.marlin_english_score || "-";
      case "NEHA":
        return app.neha_ces_test || "-";
      case "CES":
        return app.test_result || "-";
      default:
        return "-";
    }
  };

  const handleTestFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;

    const maxSize = 8 * 1024 * 1024; // 8MB
    if (file.size > maxSize || file.type !== "application/pdf") {
      toast({ title: "Invalid file", description: "PDF max 8MB", variant: "destructive" });
      return;
    }

    setTestFile(file);
  };

  const openTestDialog = (app: Application, type: "CES" | "NEHA" | "Marlins") => {
    setActiveApp(app);
    setTestType(type);
    const existing = getTestRow(app, type);
    setTestScore(existing?.score != null ? existing.score.toString() : "");
    setTestFile(null);
    setTestDialogOpen(true);
  };

  const saveTest = async () => {
    if (!activeApp || !activeApp.candidate_id || !testType) return;

    const trimmedScore = testScore.trim();
    if (!trimmedScore) {
      toast({ title: "Score tidak boleh kosong", variant: "destructive" });
      return;
    }

    const numericScore = parseFloat(trimmedScore);
    if (Number.isNaN(numericScore)) {
      toast({ title: "Score harus berupa angka", variant: "destructive" });
      return;
    }

    setSavingTest(true);
    try {
      const existing = getTestRow(activeApp, testType);
      let filePath: string | null = existing?.file_path || null;
      let fileName: string | null = existing?.file_name || null;

      if (testFile) {
        const ext = testFile.name.split(".").pop();
        fileName = `${Date.now()}.${ext}`;
        filePath = `candidate-${activeApp.candidate_id}/medical-tests/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("candidate-documents")
          .upload(filePath, testFile);

        if (uploadError) throw uploadError;
      }

      if (existing) {
        const { error } = await supabase
          .from("candidate_medical_tests" as any)
          .update({
            score: numericScore,
            file_path: filePath,
            file_name: fileName,
          })
          .eq("id", existing.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("candidate_medical_tests" as any)
          .insert({
            candidate_id: activeApp.candidate_id,
            test_name: testType,
            score: numericScore,
            file_path: filePath,
            file_name: fileName,
          });

        if (error) throw error;
      }

      const updateFields: Record<string, any> = {};
      if (testType === "Marlins") {
        updateFields.marlin_english_score = trimmedScore;
      } else if (testType === "NEHA") {
        updateFields.neha_ces_test = trimmedScore;
      } else if (testType === "CES") {
        updateFields.test_result = trimmedScore;
      }

      if (Object.keys(updateFields).length > 0) {
        const { error: appError } = await supabase
          .from("job_applications")
          .update(updateFields)
          .eq("id", activeApp.id);

        if (appError) throw appError;
      }

      toast({ title: "Test updated" });
      setTestDialogOpen(false);
      setActiveApp(null);
      setTestType("");
      setTestScore("");
      setTestFile(null);
      await fetchApplications();
    } catch (e: any) {
      toast({ title: "Failed to update test", description: e.message, variant: "destructive" });
    } finally {
      setSavingTest(false);
    }
  };

  const openNotesDialog = (app: Application) => {
    setActiveApp(app);
    setNotesValue(app.status || "");
    setNotesDialogOpen(true);
  };

  const saveNotes = async () => {
    if (!activeApp) return;
    const value = notesValue.trim();
    if (!value) {
      toast({ title: "Notes tidak boleh kosong", variant: "destructive" });
      return;
    }

    try {
      const { error } = await supabase
        .from("job_applications")
        .update({ status: value })
        .eq("id", activeApp.id);

      if (error) throw error;

      setApplications((prev) =>
        prev.map((a) => (a.id === activeApp.id ? { ...a, status: value } : a))
      );

      toast({ title: "Notes updated" });
      setNotesDialogOpen(false);
      setActiveApp(null);
    } catch (e: any) {
      toast({ title: "Failed to update notes", description: e.message, variant: "destructive" });
    }
  };

  const openEmploymentOfferDialog = (app: Application) => {
    setActiveApp(app);
    const raw = (app.employment_offer || "") as string;
    const lower = raw.toLowerCase();
    let mapped: "Received" | "Not Received" | "" = "";
    if (["received"].includes(lower)) mapped = "Received";
    else if (["not received", "notreceived", "not_receive"].includes(lower)) mapped = "Not Received";
    setEmploymentOfferValue(mapped || (raw as any) || "");
    setEmploymentOfferDialogOpen(true);
  };

  const saveEmploymentOffer = async () => {
    if (!activeApp || !employmentOfferValue) return;

    try {
      const { error } = await supabase
        .from("job_applications")
        .update({ employment_offer: employmentOfferValue })
        .eq("id", activeApp.id);

      if (error) throw error;

      setApplications((prev) =>
        prev.map((a) => (a.id === activeApp.id ? { ...a, employment_offer: employmentOfferValue } : a))
      );

      toast({ title: "Employment Offer updated" });
      setEmploymentOfferDialogOpen(false);
      setActiveApp(null);
    } catch (e: any) {
      toast({ title: "Failed to update", description: e.message, variant: "destructive" });
    }
  };

  const openEoAcceptanceDialog = (app: Application) => {
    setActiveApp(app);
    const raw = (app.eo_acceptance || "") as string;
    const lower = raw.toLowerCase();
    let mapped: "Yes" | "No" | "" = "";
    if (["yes", "y"].includes(lower)) mapped = "Yes";
    else if (["no", "n"].includes(lower)) mapped = "No";
    setEoAcceptanceValue(mapped || (raw as any) || "");
    setEoAcceptanceDialogOpen(true);
  };

  const saveEoAcceptance = async () => {
    if (!activeApp || !eoAcceptanceValue) return;

    try {
      const { error } = await supabase
        .from("job_applications")
        .update({ eo_acceptance: eoAcceptanceValue })
        .eq("id", activeApp.id);

      if (error) throw error;

      setApplications((prev) =>
        prev.map((a) => (a.id === activeApp.id ? { ...a, eo_acceptance: eoAcceptanceValue } : a))
      );

      toast({ title: "EO Acceptance updated" });
      setEoAcceptanceDialogOpen(false);
      setActiveApp(null);
    } catch (e: any) {
      toast({ title: "Failed to update", description: e.message, variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Dialog open={remarksDialogOpen} onOpenChange={setRemarksDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Remarks / Status</DialogTitle>
            <DialogDescription>
              {activeApplication
                ? `Update status for ${activeApplication.candidate.full_name}`
                : "Select a status for this application."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Status / Remarks</label>
              <Select
                value={selectedRemark}
                onValueChange={setSelectedRemark}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {remarkOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setRemarksDialogOpen(false);
                setActiveApplication(null);
              }}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleSaveRemarks}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={experienceDialogOpen} onOpenChange={setExperienceDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Latest Experience</DialogTitle>
            <DialogDescription>
              {activeApplication
                ? `Latest experience for ${activeApplication.candidate.full_name}`
                : "Latest candidate experience."}
            </DialogDescription>
          </DialogHeader>
          {activeExperience ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <div><span className="font-medium">Company:</span> {activeExperience.company || "-"}</div>
              <div><span className="font-medium">Position:</span> {activeExperience.position || "-"}</div>
              <div><span className="font-medium">Vessel/Type:</span> {activeExperience.vessel_name_type || "-"}</div>
              <div><span className="font-medium">Experience Type:</span> {activeExperience.experience_type || "-"}</div>
              <div>
                <span className="font-medium">Period:</span>{" "}
                {activeExperience.start_date || activeExperience.end_date
                  ? `${formatDate(activeExperience.start_date)} - ${activeExperience.is_current ? "Present" : formatDate(activeExperience.end_date)}`
                  : "-"}
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No experience data.</p>
          )}
          <DialogFooter>
            <Button type="button" onClick={() => setExperienceDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Notes Dialog */}
      <Dialog open={notesDialogOpen} onOpenChange={setNotesDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Notes</DialogTitle>
            <DialogDescription>
              {activeApp ? `Isi catatan untuk ${activeApp.candidate.full_name}` : "Isi catatan."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Notes</label>
              <Textarea
                value={notesValue}
                onChange={(e) => setNotesValue(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setNotesDialogOpen(false);
                setActiveApp(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={saveNotes}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Employment Offer Dialog */}
      <Dialog open={employmentOfferDialogOpen} onOpenChange={setEmploymentOfferDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Employment Offer</DialogTitle>
            <DialogDescription>
              {activeApp ? `Set status Employment Offer untuk ${activeApp.candidate.full_name}` : "Pilih status EO."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Employment Offer</label>
              <Select
                value={employmentOfferValue}
                onValueChange={(v: any) => setEmploymentOfferValue(v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select EO" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Received">Received</SelectItem>
                  <SelectItem value="Not Received">Not Received</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEmploymentOfferDialogOpen(false);
                setActiveApp(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={saveEmploymentOffer} disabled={!employmentOfferValue}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* EO Acceptance Dialog */}
      <Dialog open={eoAcceptanceDialogOpen} onOpenChange={setEoAcceptanceDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>EO Acceptance</DialogTitle>
            <DialogDescription>
              {activeApp ? `Set EO Acceptance untuk ${activeApp.candidate.full_name}` : "Pilih EO Acceptance."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">EO Acceptance</label>
              <Select value={eoAcceptanceValue} onValueChange={(v: any) => setEoAcceptanceValue(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="- Please Select -" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEoAcceptanceDialogOpen(false);
                setActiveApp(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={saveEoAcceptance} disabled={!eoAcceptanceValue}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={approvedAsDialogOpen} onOpenChange={setApprovedAsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Choose Approved As</DialogTitle>
            <DialogDescription>
              {activeApp
                ? `Pilih posisi Approved As untuk department ${activeApp.job.department}`
                : "Pilih posisi untuk kolom Approved As."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {approvedAsJobs.length === 0 ? (
              <p className="text-sm text-muted-foreground">Tidak ada job lain untuk department ini.</p>
            ) : (
              <div className="max-h-64 overflow-y-auto border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10"></TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Company</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {approvedAsJobs.map((job) => (
                      <TableRow key={job.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedApprovedAsJobId === job.id}
                            onCheckedChange={() => setSelectedApprovedAsJobId(job.id)}
                          />
                        </TableCell>
                        <TableCell>{job.title}</TableCell>
                        <TableCell>{job.company_name}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setApprovedAsDialogOpen(false);
                setSelectedApprovedAsJobId("");
                setActiveApp(null);
              }}
            >
              Cancel
            </Button>
            <Button type="button" onClick={saveApprovedAs} disabled={!selectedApprovedAsJobId}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Principal Interview By Dialog */}
      <Dialog open={principalInterviewerDialogOpen} onOpenChange={setPrincipalInterviewerDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Principal Interview By</DialogTitle>
            <DialogDescription>
              {activeApp ? `Pilih principal interviewer untuk ${activeApp.candidate.full_name}` : ""}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Principal Interview By</label>
              <Select
                value={selectedPrincipalInterviewer}
                onValueChange={(v) => setSelectedPrincipalInterviewer(v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih principal interviewer" />
                </SelectTrigger>
                <SelectContent>
                  {principalInterviewerOptions.length === 0 ? (
                    <SelectItem disabled value="none">
                      Tidak ada user dengan role interviewer_principal
                    </SelectItem>
                  ) : (
                    principalInterviewerOptions.map((opt) => (
                      <SelectItem key={opt.user_id} value={opt.user_id}>
                        {opt.full_name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPrincipalInterviewerDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={savePrincipalInterviewer}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Principal Interview Date Dialog */}
      <Dialog
        open={principalInterviewDateDialogOpen}
        onOpenChange={setPrincipalInterviewDateDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Principal Interview Date</DialogTitle>
            <DialogDescription>
              {activeApp ? `Tentukan tanggal principal interview untuk ${activeApp.candidate.full_name}` : ""}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Date</label>
              <Input
                type="date"
                value={principalInterviewDateValue}
                onChange={(e) => setPrincipalInterviewDateValue(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPrincipalInterviewDateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={savePrincipalInterviewDate}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Principal Interview Result Dialog */}
      <Dialog
        open={principalInterviewResultDialogOpen}
        onOpenChange={setPrincipalInterviewResultDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Principal Interview Result</DialogTitle>
            <DialogDescription>
              {activeApp ? `Set hasil principal interview untuk ${activeApp.candidate.full_name}` : ""}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Result</label>
              <Select
                value={principalInterviewResultValue}
                onValueChange={(v: any) => setPrincipalInterviewResultValue(v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih hasil" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Not Approved">Not Approved</SelectItem>
                  <SelectItem value="Reclassed">Reclassed</SelectItem>
                  <SelectItem value="Review">Review</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPrincipalInterviewResultDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={savePrincipalInterviewResult}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Test Score Dialog (Marlins / NEHA / CES) */}
      <Dialog open={testDialogOpen} onOpenChange={setTestDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Test Score</DialogTitle>
            <DialogDescription>
              {activeApp
                ? `Update ${testType || "test"} untuk ${activeApp.candidate.full_name}`
                : "Isi nilai test dan upload file (opsional)."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Test Name</label>
              <Select
                value={testType}
                onValueChange={(v: any) => setTestType(v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih test" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Marlins">Marlins</SelectItem>
                  <SelectItem value="NEHA">NEHA</SelectItem>
                  <SelectItem value="CES">CES</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Score</label>
              <Input
                type="number"
                value={testScore}
                onChange={(e) => setTestScore(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">File (PDF, max 8MB)</label>
              <Input type="file" accept=".pdf" onChange={handleTestFileChange} />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setTestDialogOpen(false);
                setTestType("");
                setTestScore("");
                setTestFile(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={saveTest} disabled={savingTest}>
              {savingTest ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Suitable Dialog */}
      <Dialog open={suitableDialogOpen} onOpenChange={setSuitableDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Suitable</DialogTitle>
            <DialogDescription>
              {activeApp ? `Pilih keputusan untuk ${activeApp.candidate.full_name}` : ""}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Suitable</label>
              <Select value={suitableChoice} onValueChange={(v: any) => setSuitableChoice(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSuitableDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveSuitable}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Interviewer Dialog */}
      <Dialog open={interviewerDialogOpen} onOpenChange={setInterviewerDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pilih Interviewer</DialogTitle>
            <DialogDescription>
              {activeApp ? `Untuk kandidat ${activeApp.candidate.full_name}` : ""}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Interview By</label>
              <Select value={selectedInterviewer} onValueChange={(v) => setSelectedInterviewer(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih interviewer" />
                </SelectTrigger>
                <SelectContent>
                  {interviewerOptions.length === 0 ? (
                    <SelectItem disabled value="none">
                      Tidak ada user dengan role interviewer
                    </SelectItem>
                  ) : (
                    interviewerOptions.map((opt) => (
                      <SelectItem key={opt.user_id} value={opt.user_id}>
                        {opt.full_name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInterviewerDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveInterviewer}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Interview Date Dialog */}
      <Dialog open={interviewDateDialogOpen} onOpenChange={setInterviewDateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tentukan Tanggal Interview</DialogTitle>
            <DialogDescription>
              {activeApp ? `Untuk ${activeApp.candidate.full_name}` : ""}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Interview Date</label>
              <Input type="date" value={interviewDateValue} onChange={(e) => setInterviewDateValue(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInterviewDateDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveInterviewDate}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Interview Result Dialog */}
      <Dialog open={interviewResultDialogOpen} onOpenChange={setInterviewResultDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hasil Interview</DialogTitle>
            <DialogDescription>
              {activeApp ? `Untuk ${activeApp.candidate.full_name}` : ""}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Result</label>
              <Select value={interviewResultValue} onValueChange={(v: any) => setInterviewResultValue(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih hasil" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Not Approved">Not Approved</SelectItem>
                  <SelectItem value="Reclassed">Reclassed</SelectItem>
                  <SelectItem value="Review">Review</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInterviewResultDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveInterviewResult}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Interview Notes Dialog */}
      <Dialog open={interviewNotesDialogOpen} onOpenChange={setInterviewNotesDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Interview Result Notes</DialogTitle>
            <DialogDescription>
              {activeApp ? `Untuk ${activeApp.candidate.full_name}` : ""}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Notes</label>
              <Textarea value={interviewNotesValue} onChange={(e) => setInterviewNotesValue(e.target.value)} rows={4} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInterviewNotesDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveInterviewNotes}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={referenceDialogOpen} onOpenChange={setReferenceDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Candidate Reference</DialogTitle>
            <DialogDescription>
              Latest reference from candidate{activeApplication ? `: ${activeApplication.candidate.full_name}` : ""}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {referenceLoading ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : latestReference ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                <div><span className="font-medium">Full Name:</span> {latestReference.full_name}</div>
                <div><span className="font-medium">Company:</span> {latestReference.company || "-"}</div>
                <div><span className="font-medium">Position:</span> {latestReference.position || "-"}</div>
                <div><span className="font-medium">Phone:</span> {latestReference.phone}</div>
                <div><span className="font-medium">Email:</span> {latestReference.email || "-"}</div>
                <div><span className="font-medium">Relationship:</span> {latestReference.relationship || "-"}</div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No reference found.</p>
            )}
          </div>
          <DialogFooter>
            <Button type="button" onClick={() => setReferenceDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={approvedPositionDialogOpen} onOpenChange={setApprovedPositionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Choose Approved Position</DialogTitle>
            <DialogDescription>
              {activeApp
                ? `Pilih posisi untuk department ${activeApp.job.department}`
                : "Pilih posisi yang akan di-approve."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {approvedPositionJobs.length === 0 ? (
              <p className="text-sm text-muted-foreground">Tidak ada job lain untuk department ini.</p>
            ) : (
              <div className="max-h-64 overflow-y-auto border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10"></TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Company</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {approvedPositionJobs.map((job) => (
                      <TableRow key={job.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedApprovedJobId === job.id}
                            onCheckedChange={() => setSelectedApprovedJobId(job.id)}
                          />
                        </TableCell>
                        <TableCell>{job.title}</TableCell>
                        <TableCell>{job.company_name}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setApprovedPositionDialogOpen(false);
                setSelectedApprovedJobId("");
                setActiveApp(null);
              }}
            >
              Cancel
            </Button>
            <Button type="button" onClick={saveApprovedPosition} disabled={!selectedApprovedJobId}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="space-y-4">
        {/* Search Filter Section */}
        <Card className="p-4">
          <Collapsible open={filterOpen} onOpenChange={setFilterOpen}>
            <div className="flex items-center justify-between">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 p-0 hover:bg-transparent">
                  <h2 className="text-lg font-semibold">Search Filter</h2>
                  {filterOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </Button>
              </CollapsibleTrigger>
            </div>
            
            <CollapsibleContent className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Principal</label>
                  <Input placeholder="Select Principal" value={principal} onChange={(e) => setPrincipal(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Department</label>
                  <Input placeholder="Select Department" value={department} onChange={(e) => setDepartment(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Position</label>
                  <Input placeholder="Select Position" value={position} onChange={(e) => setPosition(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Office</label>
                  <Input placeholder="Select Office" value={office} onChange={(e) => setOffice(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Age Minimum</label>
                  <Input type="number" value={ageMin} onChange={(e) => setAgeMin(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Age Maximum</label>
                  <Input type="number" value={ageMax} onChange={(e) => setAgeMax(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Gender</label>
                  <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Neha Score</label>
                  <Input type="number" value={nehaScore} onChange={(e) => setNehaScore(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Marlin English Score Minimum</label>
                  <Input type="number" value={marlinScoreMin} onChange={(e) => setMarlinScoreMin(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Marlin English Score Maximum</label>
                  <Input type="number" value={marlinScoreMax} onChange={(e) => setMarlinScoreMax(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Information Source</label>
                  <Input placeholder="Select information_source" value={infoSource} onChange={(e) => setInfoSource(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Education Background</label>
                  <Input placeholder="Education Background" value={educationBackground} onChange={(e) => setEducationBackground(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Suitable</label>
                  <Select value={suitableFilter} onValueChange={setSuitableFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="- Select -" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Ship Experience</label>
                  <Input placeholder="Ship Experience" value={shipExperience} onChange={(e) => setShipExperience(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Interview Result</label>
                  <Select value={interviewResultFilter} onValueChange={setInterviewResultFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="- Select -" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Approved">Approved</SelectItem>
                      <SelectItem value="Not Approved">Not Approved</SelectItem>
                      <SelectItem value="Reclassed">Reclassed</SelectItem>
                      <SelectItem value="Review">Review</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Interview By</label>
                  <Input placeholder="Interview By" value={interviewByFilter} onChange={(e) => setInterviewByFilter(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Interview Date Minimum</label>
                  <Input type="date" value={interviewDateMin} onChange={(e) => setInterviewDateMin(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Interview Date Maximum</label>
                  <Input type="date" value={interviewDateMax} onChange={(e) => setInterviewDateMax(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">STWC 2010</label>
                  <Select value={stwc2010} onValueChange={setStwc2010}>
                    <SelectTrigger>
                      <SelectValue placeholder="- Select -" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Approved As</label>
                  <Input placeholder="Approved As" value={approvedAsFilter} onChange={(e) => setApprovedAsFilter(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Approved Position</label>
                  <Input placeholder="Approved Position" value={approvedPositionFilter} onChange={(e) => setApprovedPositionFilter(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Principal Interview By</label>
                  <Input placeholder="Principal Interview By" value={principalInterviewByFilter} onChange={(e) => setPrincipalInterviewByFilter(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Principal Interview Date Minimum</label>
                  <Input type="date" value={principalInterviewDateMin} onChange={(e) => setPrincipalInterviewDateMin(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Principal Interview Date Maximum</label>
                  <Input type="date" value={principalInterviewDateMax} onChange={(e) => setPrincipalInterviewDateMax(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Principal Interview Result</label>
                  <Select value={principalInterviewResultFilter} onValueChange={setPrincipalInterviewResultFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="- Select -" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Approved">Approved</SelectItem>
                      <SelectItem value="Not Approved">Not Approved</SelectItem>
                      <SelectItem value="Reclassed">Reclassed</SelectItem>
                      <SelectItem value="Review">Review</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Start Date</label>
                  <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">End Date</label>
                  <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
                <div className="flex items-end gap-2">
                  <Button onClick={exportToExcel} className="w-full bg-green-600 hover:bg-green-700">Export SGP to Excel</Button>
                </div>
                <div className="flex items-end justify-end gap-2">
                  <Button variant="secondary" onClick={clearFilters} className="w-full">Clear</Button>
                </div>
                <div className="flex items-end justify-end gap-2">
                  <Button className="w-full">Filter</Button>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Selection Gap Pool List */}
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Selection Gap Pool List</h2>
          
          {/* Action Buttons */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2">
              <Button onClick={handleSelectAll} size="sm" className="bg-blue-600 hover:bg-blue-700">
                Select all
              </Button>
              <Button onClick={handleDeselectAll} size="sm" variant="secondary">
                Deselect All
              </Button>
              <Button onClick={handleSetInterview} size="sm" className="bg-green-600 hover:bg-green-700">
                Set Interview
              </Button>
              <Button onClick={handleBulkDelete} size="sm" variant="destructive">
                Delete
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">Search:</span>
              <Input 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64"
              />
            </div>
          </div>

          {/* Scrollable Table */}
          <div className="overflow-x-auto border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox 
                      checked={selectedIds.size === applications.length && applications.length > 0}
                      onCheckedChange={(checked) => checked ? handleSelectAll() : handleDeselectAll()}
                    />
                  </TableHead>
                  <TableHead className="min-w-[150px]">Remarks/Record</TableHead>
                  <TableHead className="min-w-[150px]">Crew Code</TableHead>
                  <TableHead className="min-w-[120px]">First Name</TableHead>
                  <TableHead className="min-w-[120px]">Last Name</TableHead>
                  <TableHead className="min-w-[130px]">Office Registered</TableHead>
                  <TableHead className="min-w-[120px]">Date of Entry</TableHead>
                  <TableHead className="min-w-[100px]">Source</TableHead>
                  <TableHead className="min-w-[120px]">Position</TableHead>
                  <TableHead className="min-w-[120px]">Department</TableHead>
                  <TableHead className="min-w-[130px]">Second Position</TableHead>
                  <TableHead className="min-w-[80px]">Gender</TableHead>
                  <TableHead className="min-w-[100px]">DOB</TableHead>
                  <TableHead className="min-w-[60px]">Age</TableHead>
                  <TableHead className="min-w-[110px]">Weight/Height</TableHead>
                  <TableHead className="min-w-[100px]">Reference</TableHead>
                  <TableHead className="min-w-[110px]">Ship Experience</TableHead>
                  <TableHead className="min-w-[130px]">Experience</TableHead>
                  <TableHead className="min-w-[130px]">C1D Expiry Date</TableHead>
                  <TableHead className="min-w-[160px]">Education Background</TableHead>
                  <TableHead className="min-w-[120px]">Contact No</TableHead>
                  <TableHead className="min-w-[180px]">Email</TableHead>
                  <TableHead className="min-w-[150px]">Emergency Contact</TableHead>
                  <TableHead className="min-w-[80px]">Photo</TableHead>
                  <TableHead className="min-w-[80px]">CV</TableHead>
                  <TableHead className="min-w-[100px]">Form Letter</TableHead>
                  <TableHead className="min-w-[140px]">Vaccin Covid Booster</TableHead>
                  <TableHead className="min-w-[80px]">BST/CC</TableHead>
                  <TableHead className="min-w-[100px]">Suitable</TableHead>
                  <TableHead className="min-w-[120px]">Interview By</TableHead>
                  <TableHead className="min-w-[130px]">Interview Date</TableHead>
                  <TableHead className="min-w-[130px]">Interview Result</TableHead>
                  <TableHead className="min-w-[170px]">Interview Result Notes</TableHead>
                  <TableHead className="min-w-[140px]">Approved Position</TableHead>
                  <TableHead className="min-w-[160px]">Marlin / English Score</TableHead>
                  <TableHead className="min-w-[120px]">Neha/CES Test</TableHead>
                  <TableHead className="min-w-[110px]">File Result</TableHead>
                  <TableHead className="min-w-[170px]">Principal Interview By</TableHead>
                  <TableHead className="min-w-[180px]">Principal Interview Date</TableHead>
                  <TableHead className="min-w-[190px]">Principal Interview Result</TableHead>
                  <TableHead className="min-w-[120px]">Approved As</TableHead>
                  <TableHead className="min-w-[100px]">Notes</TableHead>
                  <TableHead className="min-w-[140px]">Employment Offer</TableHead>
                  <TableHead className="min-w-[130px]">EO Acceptance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications
                  .filter(passesFilters)
                  .map((app) => (
                    <TableRow key={app.id}>
                      <TableCell>
                        <Checkbox 
                          checked={selectedIds.has(app.id)}
                          onCheckedChange={() => handleToggleSelect(app.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Badge variant="secondary" className="text-xs">
                            {app.remarks || app.status}
                          </Badge>
                          <Button
                            variant="link"
                            size="sm"
                            className="h-auto p-0 text-xs"
                            onClick={() => openRemarksDialog(app)}
                          >
                            Update Remarks
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>{app.crew_code || "-"}</TableCell>
                      <TableCell className="font-medium">{app.candidate.full_name.split(" ")[0]}</TableCell>
                      <TableCell className="font-medium">{app.candidate.full_name.split(" ").slice(1).join(" ")}</TableCell>
                      <TableCell>{app.candidate.registration_city || app.office_registered || "-"}</TableCell>
                      <TableCell>{formatDate(app.applied_at || app.date_of_entry)}</TableCell>
                      <TableCell>{app.candidate.how_found_us || app.source || "-"}</TableCell>
                      <TableCell>{app.job.title}</TableCell>
                      <TableCell>{app.job.department || "-"}</TableCell>
                      <TableCell>{app.second_position || "-"}</TableCell>
                      <TableCell>{app.candidate.gender || "-"}</TableCell>
                      <TableCell>{formatDate(app.candidate.date_of_birth)}</TableCell>
                      <TableCell>{calculateAge(app.candidate.date_of_birth)}</TableCell>
                      <TableCell>
                        {app.candidate.weight_kg && app.candidate.height_cm 
                          ? `${app.candidate.weight_kg} / ${app.candidate.height_cm}` 
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" onClick={() => openReferenceDialog(app)}>View Reference</Button>
                      </TableCell>
                      <TableCell>{getShipExperienceFlag(app.candidate_id)}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className="line-clamp-2 max-w-[220px]">
                            {getLatestExperienceText(app.candidate_id, app.previous_experience)}
                          </span>
                          {latestExperienceByCandidate[app.candidate_id || ""] && (
                            <Button
                              variant="link"
                              size="sm"
                              className="h-auto p-0 text-xs"
                              onClick={() => openExperienceDialog(app.candidate_id)}
                            >
                              View
                            </Button>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(app.c1d_expiry_date)}</TableCell>
                      <TableCell>{getLatestEducationText(app.candidate_id, app.education_background)}</TableCell>
                      <TableCell>{app.candidate.phone || app.contact_no || "-"}</TableCell>
                      <TableCell>{app.candidate.email}</TableCell>
                      <TableCell>{app.emergency_contact || "-"}</TableCell>
                      <TableCell>
                        {app.photo_url ? (
                          <img src={app.photo_url} alt="Photo" className="w-10 h-10 rounded object-cover" />
                        ) : "-"}
                      </TableCell>
                      <TableCell>
                        {app.cv_url ? (
                          <Button variant="link" size="sm" className="h-auto p-0">View file</Button>
                        ) : "-"}
                      </TableCell>
                      <TableCell>
                        {app.letter_form_url ? (
                          <Button variant="link" size="sm" className="h-auto p-0">View file</Button>
                        ) : "-"}
                      </TableCell>
                      <TableCell>{app.vaccin_covid_booster ? "Yes" : "-"}</TableCell>
                      <TableCell>{app.bst_cc || "-"}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span>{app.suitable || "-"}</span>
                          <Button
                            variant="link"
                            size="sm"
                            className="h-auto p-0 text-xs"
                            onClick={() => openSuitableDialog(app)}
                          >
                            Update
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span>{app.interview_by || "-"}</span>
                          <Button
                            variant="link"
                            size="sm"
                            className="h-auto p-0 text-xs"
                            onClick={() => openInterviewerDialog(app)}
                          >
                            Update
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span>{app.interview_date ? formatDate(app.interview_date) : "-"}</span>
                          <Button
                            variant="link"
                            size="sm"
                            className="h-auto p-0 text-xs"
                            onClick={() => openInterviewDateDialog(app)}
                          >
                            Update
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span>{app.interview_result || "-"}</span>
                          <Button
                            variant="link"
                            size="sm"
                            className="h-auto p-0 text-xs"
                            onClick={() => openInterviewResultDialog(app)}
                          >
                            Update
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className="line-clamp-2 max-w-[200px]">{app.interview_result_notes || "-"}</span>
                          <Button
                            variant="link"
                            size="sm"
                            className="h-auto p-0 text-xs"
                            onClick={() => openInterviewNotesDialog(app)}
                          >
                            Update
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span>{app.approved_position || "-"}</span>
                          <Button
                            variant="link"
                            size="sm"
                            className="h-auto p-0 text-xs"
                            onClick={() => openApprovedPositionDialog(app)}
                          >
                            Update
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span>{getTestScoreText(app, "Marlins")}</span>
                          <Button
                            variant="link"
                            size="sm"
                            className="h-auto p-0 text-xs"
                            onClick={() => openTestDialog(app, "Marlins")}
                          >
                            Update
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span>{getTestScoreText(app, "NEHA")}</span>
                          <Button
                            variant="link"
                            size="sm"
                            className="h-auto p-0 text-xs"
                            onClick={() => openTestDialog(app, "NEHA")}
                          >
                            Update
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span>{getTestScoreText(app, "CES")}</span>
                          <Button
                            variant="link"
                            size="sm"
                            className="h-auto p-0 text-xs"
                            onClick={() => openTestDialog(app, "CES")}
                          >
                            Update
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span>{app.principal_interview_by || "-"}</span>
                          <Button
                            variant="link"
                            size="sm"
                            className="h-auto p-0 text-xs"
                            onClick={() => openPrincipalInterviewerDialog(app)}
                          >
                            Update
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span>
                            {app.principal_interview_date
                              ? formatDate(app.principal_interview_date)
                              : "-"}
                          </span>
                          <Button
                            variant="link"
                            size="sm"
                            className="h-auto p-0 text-xs"
                            onClick={() => openPrincipalInterviewDateDialog(app)}
                          >
                            Update
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span>{app.principal_interview_result || "-"}</span>
                          <Button
                            variant="link"
                            size="sm"
                            className="h-auto p-0 text-xs"
                            onClick={() => openPrincipalInterviewResultDialog(app)}
                          >
                            Update
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span>{app.approved_as || "-"}</span>
                          <Button
                            variant="link"
                            size="sm"
                            className="h-auto p-0 text-xs"
                            onClick={() => openApprovedAsDialog(app)}
                          >
                            Update
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span>{app.status || "-"}</span>
                          <Button
                            variant="link"
                            size="sm"
                            className="h-auto p-0 text-xs"
                            onClick={() => openNotesDialog(app)}
                          >
                            Update
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span>{app.employment_offer || "-"}</span>
                          <Button
                            variant="link"
                            size="sm"
                            className="h-auto p-0 text-xs"
                            onClick={() => openEmploymentOfferDialog(app)}
                          >
                            Update
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span>{app.eo_acceptance || "-"}</span>
                          <Button
                            variant="link"
                            size="sm"
                            className="h-auto p-0 text-xs"
                            onClick={() => openEoAcceptanceDialog(app)}
                          >
                            Update
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>

          {applications.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-muted-foreground">No applications found</p>
            </div>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Showing 1 to {applications.length} of {applications.length} entries
            </p>
            <div className="flex gap-1">
              <Button variant="outline" size="sm">&lt;</Button>
              <Button variant="default" size="sm">1</Button>
              <Button variant="outline" size="sm">2</Button>
              <Button variant="outline" size="sm">3</Button>
              <Button variant="outline" size="sm">...</Button>
              <Button variant="outline" size="sm">20</Button>
              <Button variant="outline" size="sm">&gt;</Button>
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminApplications;
