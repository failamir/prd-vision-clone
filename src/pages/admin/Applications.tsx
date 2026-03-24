import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import bmiReferenceImage from "@/assets/bmi-reference.png";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ChevronDown, ChevronUp, Download, Eye } from "lucide-react";
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
    profile_step_unlocked?: number;
    avatar_url?: string;
    covid_vaccinated?: string | null;
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
  // PIC city lock - auto-filter for PIC users
  const [isPicUser, setIsPicUser] = useState(false);
  const [picCity, setPicCity] = useState<string | null>(null);
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
  const [visaStatusFilter, setVisaStatusFilter] = useState("");
  const [bstCcStatusFilter, setBstCcStatusFilter] = useState("");
  const [principalInterviewResultFilter, setPrincipalInterviewResultFilter] = useState("");
  const [remarksDialogOpen, setRemarksDialogOpen] = useState(false);
  const [activeApplication, setActiveApplication] = useState<Application | null>(null);
  const [selectedRemark, setSelectedRemark] = useState("");
  const [referenceDialogOpen, setReferenceDialogOpen] = useState(false);
  const [referenceLoading, setReferenceLoading] = useState(false);
  const [latestReference, setLatestReference] = useState<any | null>(null);
  const [latestExperienceByCandidate, setLatestExperienceByCandidate] = useState<Record<string, any>>({});
  const [allExperiencesByCandidate, setAllExperiencesByCandidate] = useState<Record<string, any[]>>({});
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

  // Profile Step Unlock control
  const [profileStepDialogOpen, setProfileStepDialogOpen] = useState(false);
  const [profileStepValue, setProfileStepValue] = useState<number>(1);

  // Candidate View Dialog
  const [candidateViewDialogOpen, setCandidateViewDialogOpen] = useState(false);
  const [viewingCandidate, setViewingCandidate] = useState<Application | null>(null);
  const [candidateExperiences, setCandidateExperiences] = useState<any[]>([]);
  const [candidateEducation, setCandidateEducation] = useState<any[]>([]);
  const [candidateCertificates, setCandidateCertificates] = useState<any[]>([]);
  const [candidateTravelDocs, setCandidateTravelDocs] = useState<any[]>([]);
  const [candidateEmergencyContacts, setCandidateEmergencyContacts] = useState<any[]>([]);
  const [candidateNextOfKin, setCandidateNextOfKin] = useState<any[]>([]);
  const [candidateReferences, setCandidateReferences] = useState<any[]>([]);
  const [loadingCandidateData, setLoadingCandidateData] = useState(false);

  // Experience Modal
  const [experienceModalOpen, setExperienceModalOpen] = useState(false);
  const [experienceModalCandidate, setExperienceModalCandidate] = useState<Application | null>(null);
  const [experienceModalData, setExperienceModalData] = useState<any[]>([]);
  const [loadingExperience, setLoadingExperience] = useState(false);
  const [experienceFilter, setExperienceFilter] = useState<"ALL" | "HOTEL" | "SHIP">("ALL");

  // Emergency Contact Modal
  const [emergencyContactModalOpen, setEmergencyContactModalOpen] = useState(false);
  const [emergencyContactModalCandidate, setEmergencyContactModalCandidate] = useState<Application | null>(null);
  const [emergencyContactModalData, setEmergencyContactModalData] = useState<any[]>([]);
  const [loadingEmergencyContact, setLoadingEmergencyContact] = useState(false);
  const [latestEmergencyContactByCandidate, setLatestEmergencyContactByCandidate] = useState<Record<string, any>>({});

  // Education Modal
  const [educationModalOpen, setEducationModalOpen] = useState(false);
  const [educationModalCandidate, setEducationModalCandidate] = useState<Application | null>(null);
  const [educationModalData, setEducationModalData] = useState<any[]>([]);
  const [loadingEducation, setLoadingEducation] = useState(false);

  // Visa Documents Modal
  const [visaModalOpen, setVisaModalOpen] = useState(false);
  const [visaModalCandidate, setVisaModalCandidate] = useState<Application | null>(null);
  const [visaModalData, setVisaModalData] = useState<any[]>([]);
  const [loadingVisa, setLoadingVisa] = useState(false);
  const [visaDocsByCandidate, setVisaDocsByCandidate] = useState<Record<string, any[]>>({});
  const [bstCcByCandidate, setBstCcByCandidate] = useState<Record<string, { label: string; certs: { type: string; file_path: string | null }[] }>>({});

  // BST/CC Modal state
  const [bstCcModalOpen, setBstCcModalOpen] = useState(false);
  const [bstCcModalCandidate, setBstCcModalCandidate] = useState<Application | null>(null);

  // Next of Kin Modal state
  const [nextOfKinModalOpen, setNextOfKinModalOpen] = useState(false);
  const [nextOfKinModalCandidate, setNextOfKinModalCandidate] = useState<Application | null>(null);
  const [nextOfKinModalData, setNextOfKinModalData] = useState<any[]>([]);
  const [loadingNextOfKin, setLoadingNextOfKin] = useState(false);
  const [latestNextOfKinByCandidate, setLatestNextOfKinByCandidate] = useState<Record<string, any>>({});

  // References Modal state
  const [referencesModalOpen, setReferencesModalOpen] = useState(false);
  const [referencesModalCandidate, setReferencesModalCandidate] = useState<Application | null>(null);
  const [referencesModalData, setReferencesModalData] = useState<any[]>([]);
  const [loadingReferences, setLoadingReferences] = useState(false);
  const [latestReferenceByCandidate, setLatestReferenceByCandidate] = useState<Record<string, any>>({});

  // CV and Form Letter by candidate
  const [cvByCandidate, setCvByCandidate] = useState<Record<string, string | null>>({});
  const [formLetterByCandidate, setFormLetterByCandidate] = useState<Record<string, string | null>>({});

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [totalCount, setTotalCount] = useState(0);

  // Helpers: filters and utilities
  const clearFilters = () => {
    setSearchQuery("");
    setStartDate("");
    setEndDate("");
    setPrincipal("");
    setDepartment("");
    setPosition("");
    // Don't clear office filter for PIC users
    if (!isPicUser) {
      setOffice("");
    }
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
    setVisaStatusFilter("");
    setBstCcStatusFilter("");
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
      if (!(target === "yes" ? ["yes", "y", "approved", "approve"].includes(s) : ["no", "n", "rejected", "reject"].includes(s))) return false;
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

    // Visa status filter
    if (visaStatusFilter && app.candidate_id) {
      const visaDocs = visaDocsByCandidate[app.candidate_id] || [];
      if (visaStatusFilter === "No Visa") {
        if (visaDocs.length > 0) return false;
      } else {
        if (visaDocs.length === 0) return false;
        const now = new Date();
        const sixMonthsFromNow = new Date();
        sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);

        const hasStatus = visaDocs.some((doc: any) => {
          if (!doc.expiry_date) return false;
          const expiry = new Date(doc.expiry_date);
          if (visaStatusFilter === "Expired") return expiry < now;
          if (visaStatusFilter === "Expiring Soon") return expiry >= now && expiry <= sixMonthsFromNow;
          if (visaStatusFilter === "Valid") return expiry > sixMonthsFromNow;
          return false;
        });
        if (!hasStatus) return false;
      }
    }

    // BST/CC status filter
    if (bstCcStatusFilter && app.candidate_id) {
      const bstCcData = bstCcByCandidate[app.candidate_id];
      const certs = bstCcData?.certs || [];
      if (bstCcStatusFilter === "No Certificates") {
        if (certs.length > 0) return false;
      } else if (bstCcStatusFilter === "Has BST") {
        const hasBst = certs.some((c: any) => c.type.toUpperCase().includes("BST"));
        if (!hasBst) return false;
      } else if (bstCcStatusFilter === "Has CC") {
        const hasCc = certs.some((c: any) => {
          const t = c.type.toUpperCase();
          return t.includes("CC") || t.includes("CCM") || t.includes("COC");
        });
        if (!hasCc) return false;
      }
    }

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
    const step = (app.candidate as any)?.profile_step_unlocked || 1;
    setProfileStepValue(step);
    setSelectedRemark(`Step ${step}`);
    setRemarksDialogOpen(true);
  };

  const openCandidateViewDialog = async (app: Application) => {
    setViewingCandidate(app);
    setCandidateViewDialogOpen(true);
    setLoadingCandidateData(true);

    const candidateId = app.candidate_id;
    if (!candidateId) {
      setLoadingCandidateData(false);
      return;
    }

    try {
      // Fetch all candidate related data in parallel
      const [expRes, eduRes, certRes, travelRes, emergencyRes, nokRes, refRes] = await Promise.all([
        supabase.from("candidate_experience").select("*").eq("candidate_id", candidateId).order("start_date", { ascending: false }),
        supabase.from("candidate_education").select("*").eq("candidate_id", candidateId).order("start_date", { ascending: false }),
        supabase.from("candidate_certificates").select("*").eq("candidate_id", candidateId).order("date_of_issue", { ascending: false }),
        supabase.from("candidate_travel_documents").select("*").eq("candidate_id", candidateId).order("expiry_date", { ascending: false }),
        supabase.from("candidate_emergency_contacts").select("*").eq("candidate_id", candidateId),
        supabase.from("candidate_next_of_kin").select("*").eq("candidate_id", candidateId),
        supabase.from("candidate_references").select("*").eq("candidate_id", candidateId),
      ]);

      setCandidateExperiences(expRes.data || []);
      setCandidateEducation(eduRes.data || []);
      setCandidateCertificates(certRes.data || []);
      setCandidateTravelDocs(travelRes.data || []);
      setCandidateEmergencyContacts(emergencyRes.data || []);
      setCandidateNextOfKin(nokRes.data || []);
      setCandidateReferences(refRes.data || []);
    } catch (error) {
      toast({ title: "Error loading candidate data", variant: "destructive" });
    } finally {
      setLoadingCandidateData(false);
    }
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

    const remarkValue = `Step ${profileStepValue}`;

    try {
      // Update remarks in job_applications
      const { error } = await supabase
        .from("job_applications")
        .update({ remarks: remarkValue })
        .eq("id", activeApplication.id);

      if (error) throw error;

      // Update profile_step_unlocked in candidate_profiles
      if (activeApplication.candidate_id) {
        const { error: profileError } = await supabase
          .from("candidate_profiles")
          .update({ profile_step_unlocked: profileStepValue } as any)
          .eq("id", activeApplication.candidate_id);

        if (profileError) throw profileError;
      }

      // Update local state
      setApplications((prev) =>
        prev.map((a) =>
          a.id === activeApplication.id
            ? {
              ...a,
              remarks: remarkValue,
              candidate: { ...a.candidate, profile_step_unlocked: profileStepValue }
            }
            : a
        )
      );

      toast({ title: "Remarks updated" });
      setRemarksDialogOpen(false);
      setActiveApplication(null);
    } catch (error) {
      toast({ title: "Error updating", variant: "destructive" });
    }
  };

  // Detect PIC role and auto-set office filter to their city
  useEffect(() => {
    const detectPicRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);

      const hasPicRole = roles?.some(r => r.role === 'pic');
      const hasAdminRole = roles?.some(r => ['admin', 'superadmin'].includes(r.role));

      if (hasPicRole && !hasAdminRole) {
        const city = user.user_metadata?.city || null;
        setIsPicUser(true);
        setPicCity(city);
        if (city) {
          setOffice(city);
        }
      }
    };
    detectPicRole();
  }, []);

  useEffect(() => {
    fetchApplications(currentPage, itemsPerPage);
  }, [currentPage, itemsPerPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    startDate,
    endDate,
    principal,
    department,
    position,
    office,
    ageMin,
    ageMax,
    gender,
    nehaScore,
    marlinScoreMin,
    marlinScoreMax,
    infoSource,
    educationBackground,
    suitableFilter,
    shipExperience,
    interviewResultFilter,
    interviewByFilter,
    interviewDateMin,
    interviewDateMax,
    stwc2010,
    approvedAsFilter,
    approvedPositionFilter,
    principalInterviewByFilter,
    principalInterviewDateMin,
    principalInterviewDateMax,
    principalInterviewResultFilter,
  ]);

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
          const match = code.match(/CC-(\d+)/);
          return match ? parseInt(match[1]) : 0;
        });

      let nextNumber = existingCodes.length > 0 ? Math.max(...existingCodes) + 1 : 1;

      // Generate crew codes for applications without them
      for (const app of appsWithoutCodes) {
        const crewCode = `CC-${String(nextNumber).padStart(7, '0')}`;

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
    } catch (error) {
      console.error("Error generating crew codes:", error);
      toast({
        title: "Error generating crew codes",
        variant: "destructive",
      });
    }
  };

  const fetchApplications = async (page?: number, pageSize?: number) => {
    try {
      const p = page ?? currentPage;
      const ps = pageSize ?? itemsPerPage;
      setLoading(true);
      const from = (p - 1) * ps;
      const to = from + ps - 1;

      // Get total count
      const { count, error: countError } = await supabase
        .from("job_applications")
        .select("*", { count: "exact", head: true });
      if (countError) throw countError;
      setTotalCount(count || 0);

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
            how_found_us,
            profile_step_unlocked,
            avatar_url,
            covid_vaccinated
          ),
          job:jobs(title, company_name, department)
        `)
        .order("applied_at", { ascending: false })
        .range(from, to);

      if (error) throw error;
      const apps = (data as any) || [];
      const candidateIds = apps.map((d: any) => d.candidate_id).filter(Boolean);

      if (candidateIds.length > 0) {
        const uniqueCandidateIds = Array.from(new Set(candidateIds)) as string[];

        // Run ALL sub-queries in parallel instead of sequentially
        const [travelDocsResult, medicalResult, bstCcResult, expResult, eduResult, emergResult, nokResult, refResult, docsResult] = await Promise.all([
          // Travel documents
          supabase
            .from("candidate_travel_documents" as any)
            .select("candidate_id, expiry_date, document_type")
            .in("candidate_id", uniqueCandidateIds)
            .order("expiry_date", { ascending: false }),
          // Medical tests
          supabase
            .from("candidate_medical_tests" as any)
            .select("id, candidate_id, test_name, score, file_path, file_name, created_at")
            .in("candidate_id", uniqueCandidateIds)
            .order("created_at", { ascending: false }),
          // Certificates (BST/CC)
          supabase
            .from("candidate_certificates")
            .select("candidate_id, type_certificate, file_path")
            .in("candidate_id", uniqueCandidateIds),
          // Experiences
          supabase
            .from("candidate_experience" as any)
            .select("candidate_id, company, position, vessel_name_type, start_date, end_date, is_current, created_at, experience_type")
            .in("candidate_id", uniqueCandidateIds)
            .order("created_at", { ascending: false }),
          // Education
          supabase
            .from("candidate_education" as any)
            .select("candidate_id, institution, degree, start_date, end_date, created_at")
            .in("candidate_id", uniqueCandidateIds)
            .order("created_at", { ascending: false }),
          // Emergency contacts
          supabase
            .from("candidate_emergency_contacts")
            .select("candidate_id, full_name, relationship, phone, email, created_at")
            .in("candidate_id", uniqueCandidateIds)
            .order("created_at", { ascending: false }),
          // Next of kin
          supabase
            .from("candidate_next_of_kin")
            .select("candidate_id, full_name, relationship, date_of_birth, place_of_birth, created_at")
            .in("candidate_id", uniqueCandidateIds)
            .order("created_at", { ascending: false }),
          // References
          supabase
            .from("candidate_references")
            .select("candidate_id, full_name, relationship, company, position, phone, email, created_at")
            .in("candidate_id", uniqueCandidateIds)
            .order("created_at", { ascending: false }),
          // CVs and Form Letters
          Promise.all([
            supabase
              .from("candidate_cvs")
              .select("candidate_id, file_path, is_default")
              .in("candidate_id", uniqueCandidateIds)
              .eq("is_default", true),
            supabase
              .from("candidate_form_letters")
              .select("candidate_id, file_path, is_default")
              .in("candidate_id", uniqueCandidateIds)
              .eq("is_default", true),
          ]),
        ]);

        // Process travel documents
        const travelDocs = travelDocsResult.data || [];
        const latestVisaByCandidate: Record<string, string | null> = {};
        const allVisasByCandidate: Record<string, any[]> = {};
        travelDocs.forEach((row: any) => {
          const docType = (row.document_type || "").toUpperCase();
          if (docType.includes("C1D") || docType.includes("VISA")) {
            if (latestVisaByCandidate[row.candidate_id] === undefined) {
              latestVisaByCandidate[row.candidate_id] = row.expiry_date;
            }
            if (!allVisasByCandidate[row.candidate_id]) {
              allVisasByCandidate[row.candidate_id] = [];
            }
            allVisasByCandidate[row.candidate_id].push(row);
          }
        });
        setVisaDocsByCandidate(allVisasByCandidate);

        const merged = apps.map((a: any) => ({
          ...a,
          c1d_expiry_date: latestVisaByCandidate[a.candidate_id] ?? a.c1d_expiry_date ?? null,
        }));
        setApplications(merged);

        // Process medical tests inline
        const medicalMap: Record<string, Record<string, any>> = {};
        (medicalResult.data || []).forEach((row: any) => {
          const cid = row.candidate_id;
          const rawName = (row.test_name || "").toString();
          if (!cid || !rawName) return;
          const normalized = rawName.toUpperCase().replace(/\s+/g, "");
          let key: "Marlins" | "NEHA" | "CES" | null = null;
          if (normalized.includes("MARLIN")) key = "Marlins";
          else if (normalized.includes("NEHA")) key = "NEHA";
          else if (normalized.includes("CES")) key = "CES";
          if (!key) return;
          if (!medicalMap[cid]) medicalMap[cid] = {};
          if (!medicalMap[cid][key]) medicalMap[cid][key] = row;
        });
        setMedicalTestsByCandidate(medicalMap);

        // Process BST/CC certificates inline
        processBstCcData(bstCcResult.data || []);

        // Process experiences
        const latestExpMap: Record<string, any> = {};
        const allExpMap: Record<string, any[]> = {};
        (expResult.data || []).forEach((row: any) => {
          if (!latestExpMap[row.candidate_id]) latestExpMap[row.candidate_id] = row;
          if (!allExpMap[row.candidate_id]) allExpMap[row.candidate_id] = [];
          allExpMap[row.candidate_id].push(row);
        });
        setLatestExperienceByCandidate(latestExpMap);
        setAllExperiencesByCandidate(allExpMap);

        // Process education
        const eduMap: Record<string, any> = {};
        (eduResult.data || []).forEach((row: any) => {
          if (!eduMap[row.candidate_id]) eduMap[row.candidate_id] = row;
        });
        setLatestEducationByCandidate(eduMap);

        // Process emergency contacts
        const emergMap: Record<string, any> = {};
        (emergResult.data || []).forEach((row: any) => {
          if (!emergMap[row.candidate_id]) emergMap[row.candidate_id] = row;
        });
        setLatestEmergencyContactByCandidate(emergMap);

        // Process next of kin
        const nokMap: Record<string, any> = {};
        (nokResult.data || []).forEach((row: any) => {
          if (!nokMap[row.candidate_id]) nokMap[row.candidate_id] = row;
        });
        setLatestNextOfKinByCandidate(nokMap);

        // Process references
        const refMap: Record<string, any> = {};
        (refResult.data || []).forEach((row: any) => {
          if (!refMap[row.candidate_id]) refMap[row.candidate_id] = row;
        });
        setLatestReferenceByCandidate(refMap);

        // Process CVs and Form Letters
        const [cvResult, flResult] = docsResult;
        const cvMap: Record<string, string | null> = {};
        (cvResult.data || []).forEach((row: any) => {
          if (row.candidate_id && row.file_path) cvMap[row.candidate_id] = row.file_path;
        });
        setCvByCandidate(cvMap);

        const flMap: Record<string, string | null> = {};
        (flResult.data || []).forEach((row: any) => {
          if (row.candidate_id && row.file_path) flMap[row.candidate_id] = row.file_path;
        });
        setFormLetterByCandidate(flMap);
      } else {
        setApplications(apps);
      }

      // Generate crew codes only for apps missing them (don't re-fetch)
      const appsWithoutCodes = apps.filter((app: any) => !app.crew_code);
      if (appsWithoutCodes.length > 0) {
        await generateCrewCodes();
      }
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

  const processBstCcData = (data: any[]) => {
    const map: Record<string, { label: string; certs: { type: string; file_path: string | null }[] }> = {};
    data.forEach((row: any) => {
      const cid = row.candidate_id;
      const certType = (row.type_certificate || "").toUpperCase();
      const hasBst = certType.includes("BST") || certType.includes("BASIC SAFETY");
      const hasCc = certType.includes("CCM") || certType.includes("COC") || certType.includes("CC");
      if (hasBst || hasCc) {
        if (!map[cid]) map[cid] = { label: "", certs: [] };
        const certAbbrev = hasBst ? "BST" : (certType.includes("CCM") ? "CCM" : certType.includes("COC") ? "COC" : "CC");
        if (!map[cid].label.includes(certAbbrev)) {
          map[cid].label = map[cid].label ? `${map[cid].label}, ${certAbbrev}` : certAbbrev;
        }
        map[cid].certs.push({ type: row.type_certificate, file_path: row.file_path });
      }
    });
    setBstCcByCandidate(map);
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
      const latestMap: Record<string, any> = {};
      const allMap: Record<string, any[]> = {};
      (data || []).forEach((row: any) => {
        // Latest experience per candidate
        if (!latestMap[row.candidate_id]) {
          latestMap[row.candidate_id] = row;
        }
        // All experiences per candidate
        if (!allMap[row.candidate_id]) {
          allMap[row.candidate_id] = [];
        }
        allMap[row.candidate_id].push(row);
      });
      setLatestExperienceByCandidate(latestMap);
      setAllExperiencesByCandidate(allMap);
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

  const fetchLatestEmergencyContacts = async (candidateIds: string[]) => {
    if (!candidateIds || candidateIds.length === 0) return;
    try {
      const { data, error } = await supabase
        .from("candidate_emergency_contacts")
        .select("candidate_id, full_name, relationship, phone, email, created_at")
        .in("candidate_id", candidateIds)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const map: Record<string, any> = {};
      (data || []).forEach((row: any) => {
        if (!map[row.candidate_id]) {
          map[row.candidate_id] = row;
        }
      });
      setLatestEmergencyContactByCandidate(map);
    } catch (e) { }
  };

  const fetchLatestNextOfKin = async (candidateIds: string[]) => {
    if (!candidateIds || candidateIds.length === 0) return;
    try {
      const { data, error } = await supabase
        .from("candidate_next_of_kin")
        .select("candidate_id, full_name, relationship, date_of_birth, place_of_birth, created_at")
        .in("candidate_id", candidateIds)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const map: Record<string, any> = {};
      (data || []).forEach((row: any) => {
        if (!map[row.candidate_id]) {
          map[row.candidate_id] = row;
        }
      });
      setLatestNextOfKinByCandidate(map);
    } catch (e) { }
  };

  const fetchLatestReferences = async (candidateIds: string[]) => {
    if (!candidateIds || candidateIds.length === 0) return;
    try {
      const { data, error } = await supabase
        .from("candidate_references")
        .select("candidate_id, full_name, relationship, company, position, phone, email, created_at")
        .in("candidate_id", candidateIds)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const map: Record<string, any> = {};
      (data || []).forEach((row: any) => {
        if (!map[row.candidate_id]) {
          map[row.candidate_id] = row;
        }
      });
      setLatestReferenceByCandidate(map);
    } catch (e) { }
  };

  const fetchCandidateDocuments = async (candidateIds: string[]) => {
    if (!candidateIds || candidateIds.length === 0) return;
    try {
      // Fetch CVs
      const { data: cvData, error: cvError } = await supabase
        .from("candidate_cvs")
        .select("candidate_id, file_path, is_default")
        .in("candidate_id", candidateIds)
        .eq("is_default", true);

      if (cvError) throw cvError;

      const cvMap: Record<string, string | null> = {};
      (cvData || []).forEach((row: any) => {
        if (row.candidate_id && row.file_path) {
          cvMap[row.candidate_id] = row.file_path;
        }
      });
      setCvByCandidate(cvMap);

      // Fetch Form Letters
      const { data: flData, error: flError } = await supabase
        .from("candidate_form_letters")
        .select("candidate_id, file_path, is_default")
        .in("candidate_id", candidateIds)
        .eq("is_default", true);

      if (flError) throw flError;

      const flMap: Record<string, string | null> = {};
      (flData || []).forEach((row: any) => {
        if (row.candidate_id && row.file_path) {
          flMap[row.candidate_id] = row.file_path;
        }
      });
      setFormLetterByCandidate(flMap);
    } catch (e) {
      console.error("Error fetching candidate documents:", e);
    }
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

  const fetchBstCcCertificates = async (candidateIds: string[]) => {
    if (!candidateIds || candidateIds.length === 0) return;
    try {
      const { data, error } = await supabase
        .from("candidate_certificates")
        .select("candidate_id, type_certificate, file_path")
        .in("candidate_id", candidateIds);

      if (error) throw error;

      const map: Record<string, { label: string; certs: { type: string; file_path: string | null }[] }> = {};
      (data || []).forEach((row: any) => {
        const cid = row.candidate_id;
        const certType = (row.type_certificate || "").toUpperCase();

        // Check if certificate contains BST or CC (like CCM, COC)
        const hasBst = certType.includes("BST") || certType.includes("BASIC SAFETY");
        const hasCc = certType.includes("CCM") || certType.includes("COC") || certType.includes("CC");

        if (hasBst || hasCc) {
          if (!map[cid]) {
            map[cid] = { label: "", certs: [] };
          }
          // Build a comma-separated list of BST/CC certificates
          const certAbbrev = hasBst ? "BST" : (certType.includes("CCM") ? "CCM" : certType.includes("COC") ? "COC" : "CC");
          if (!map[cid].label.includes(certAbbrev)) {
            map[cid].label = map[cid].label ? `${map[cid].label}, ${certAbbrev}` : certAbbrev;
          }
          map[cid].certs.push({ type: row.type_certificate || certAbbrev, file_path: row.file_path });
        }
      });

      setBstCcByCandidate(map);
    } catch { }
  };

  const getBstCcDisplay = (candidateId?: string) => {
    if (!candidateId) return null;
    const entry = bstCcByCandidate[candidateId];
    return entry ? entry.label : null;
  };

  const openBstCcModal = (app: Application) => {
    setBstCcModalCandidate(app);
    setBstCcModalOpen(true);
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

  const getLatestExperienceText = (candidateId?: string, jobDepartment?: string, fallback?: string) => {
    if (!candidateId) return fallback || "-";
    const allExps = allExperiencesByCandidate[candidateId];
    if (!allExps || allExps.length === 0) return fallback || "-";

    // Filter experiences based on job department
    const department = (jobDepartment || "").toLowerCase();
    const isHotelDepartment = department.includes("hotel");
    const targetType = isHotelDepartment ? "hotel" : "ship";
    const filteredExps = allExps.filter((exp: any) => {
      const expType = (exp.experience_type || "Hotel").toLowerCase();
      return expType === targetType;
    });

    if (filteredExps.length === 0) return fallback || "-";
    const exp = filteredExps[0]; // Latest experience of this type

    const parts = [exp.position, exp.company || exp.vessel_name_type].filter(Boolean).join(" @ ");
    const start = exp.start_date ? formatDate(exp.start_date) : "";
    const end = exp.is_current ? "Present" : (exp.end_date ? formatDate(exp.end_date) : "");
    const period = (start || end) ? ` (${[start, end].filter(Boolean).join(" - ")})` : "";
    return `${parts}${period}`;
  };

  const getShipExperienceFlag = (candidateId?: string, jobDepartment?: string) => {
    if (!candidateId) return "-";
    const allExps = allExperiencesByCandidate[candidateId];
    if (!allExps || allExps.length === 0) return "N";

    // Check if candidate has any experience matching the job department
    const department = (jobDepartment || "").toLowerCase();
    const isHotelDepartment = department.includes("hotel");
    const targetType = isHotelDepartment ? "hotel" : "ship";

    const hasMatchingExperience = allExps.some((exp: any) => {
      const expType = (exp.experience_type || "Hotel").toLowerCase();
      return expType === targetType;
    });

    return hasMatchingExperience ? "Y" : "N";
  };

  const openExperienceModal = async (app: Application) => {
    setExperienceModalCandidate(app);
    const candidateId = app.candidate_id;
    setExperienceModalOpen(true);
    setLoadingExperience(true);
    setExperienceFilter("ALL");

    // Always fetch fresh data when opening modal
    if (candidateId) {
      try {
        const { data, error } = await supabase
          .from("candidate_experience")
          .select("*")
          .eq("candidate_id", candidateId)
          .order("start_date", { ascending: false }); // Changed to start_date for better ordering

        if (!error && data) {
          setExperienceModalData(data);
          // Also update the cache
          setAllExperiencesByCandidate(prev => ({
            ...prev,
            [candidateId]: data
          }));
        } else {
          setExperienceModalData([]);
        }
      } catch (e) {
        console.error("Error fetching experience", e);
        setExperienceModalData([]);
      } finally {
        setLoadingExperience(false);
      }
    } else {
      setExperienceModalData([]);
      setLoadingExperience(false);
    }
  };

  const openEmergencyContactModal = async (app: Application) => {
    setEmergencyContactModalCandidate(app);
    const candidateId = app.candidate_id;
    setEmergencyContactModalOpen(true);
    setLoadingEmergencyContact(true);

    if (candidateId) {
      try {
        const { data, error } = await supabase
          .from("candidate_emergency_contacts")
          .select("*")
          .eq("candidate_id", candidateId)
          .order("created_at", { ascending: false });

        if (!error && data) {
          setEmergencyContactModalData(data);
          // Also update the cache
          if (data.length > 0) {
            setLatestEmergencyContactByCandidate(prev => ({
              ...prev,
              [candidateId]: data[0]
            }));
          }
        } else {
          setEmergencyContactModalData([]);
        }
      } catch (e) {
        console.error("Error fetching emergency contacts", e);
        setEmergencyContactModalData([]);
      } finally {
        setLoadingEmergencyContact(false);
      }
    } else {
      setEmergencyContactModalData([]);
      setLoadingEmergencyContact(false);
    }
  };

  const getLatestEmergencyContactName = (candidateId?: string) => {
    if (!candidateId) return null;
    const contact = latestEmergencyContactByCandidate[candidateId];
    return contact ? contact.full_name : null;
  };

  // Next of Kin modal functions
  const openNextOfKinModal = async (app: Application) => {
    setNextOfKinModalCandidate(app);
    const candidateId = app.candidate_id;
    setNextOfKinModalOpen(true);
    setLoadingNextOfKin(true);

    if (candidateId) {
      try {
        const { data, error } = await supabase
          .from("candidate_next_of_kin")
          .select("*")
          .eq("candidate_id", candidateId)
          .order("created_at", { ascending: false });

        if (!error && data) {
          setNextOfKinModalData(data);
        } else {
          setNextOfKinModalData([]);
        }
      } catch (e) {
        console.error("Error fetching next of kin", e);
        setNextOfKinModalData([]);
      } finally {
        setLoadingNextOfKin(false);
      }
    } else {
      setNextOfKinModalData([]);
      setLoadingNextOfKin(false);
    }
  };

  const getLatestNextOfKinName = (candidateId?: string) => {
    if (!candidateId) return null;
    const nok = latestNextOfKinByCandidate[candidateId];
    return nok ? nok.full_name : null;
  };

  // References modal functions
  const openReferencesModal = async (app: Application) => {
    setReferencesModalCandidate(app);
    const candidateId = app.candidate_id;
    setReferencesModalOpen(true);
    setLoadingReferences(true);

    if (candidateId) {
      try {
        const { data, error } = await supabase
          .from("candidate_references")
          .select("*")
          .eq("candidate_id", candidateId)
          .order("created_at", { ascending: false });

        if (!error && data) {
          setReferencesModalData(data);
        } else {
          setReferencesModalData([]);
        }
      } catch (e) {
        console.error("Error fetching references", e);
        setReferencesModalData([]);
      } finally {
        setLoadingReferences(false);
      }
    } else {
      setReferencesModalData([]);
      setLoadingReferences(false);
    }
  };

  const getLatestReferenceName = (candidateId?: string) => {
    if (!candidateId) return null;
    const ref = latestReferenceByCandidate[candidateId];
    return ref ? ref.full_name : null;
  };

  const getLatestEducationInstitution = (candidateId?: string) => {
    if (!candidateId) return null;
    const edu = latestEducationByCandidate[candidateId];
    return edu ? edu.institution : null;
  };

  const openEducationModal = async (app: Application) => {
    setEducationModalCandidate(app);
    const candidateId = app.candidate_id;
    setEducationModalOpen(true);
    setLoadingEducation(true);

    if (candidateId) {
      try {
        const { data, error } = await supabase
          .from("candidate_education")
          .select("*")
          .eq("candidate_id", candidateId)
          .order("created_at", { ascending: false });

        if (!error && data) {
          setEducationModalData(data);
        } else {
          setEducationModalData([]);
        }
      } catch (e) {
        console.error("Error fetching education", e);
        setEducationModalData([]);
      } finally {
        setLoadingEducation(false);
      }
    } else {
      setEducationModalData([]);
      setLoadingEducation(false);
    }
  };

  const openVisaModal = async (app: Application) => {
    setVisaModalCandidate(app);
    const candidateId = app.candidate_id;
    setVisaModalOpen(true);
    setLoadingVisa(true);

    if (candidateId) {
      try {
        const { data, error } = await supabase
          .from("candidate_travel_documents")
          .select("*")
          .eq("candidate_id", candidateId)
          .order("expiry_date", { ascending: false });

        if (!error && data) {
          // Filter to only visa documents
          const visaDocs = data.filter((doc: any) => {
            const docType = (doc.document_type || "").toUpperCase();
            return docType.includes("C1D") || docType.includes("VISA");
          });
          setVisaModalData(visaDocs);
        } else {
          setVisaModalData([]);
        }
      } catch (e) {
        console.error("Error fetching visa documents", e);
        setVisaModalData([]);
      } finally {
        setLoadingVisa(false);
      }
    } else {
      setVisaModalData([]);
      setLoadingVisa(false);
    }
  };

  const getVisaCount = (candidateId?: string) => {
    if (!candidateId) return 0;
    return (visaDocsByCandidate[candidateId] || []).length;
  };

  const getLatestVisaType = (candidateId?: string) => {
    if (!candidateId) return null;
    const visas = visaDocsByCandidate[candidateId];
    if (!visas || visas.length === 0) return null;
    return visas[0].document_type;
  };

  const getVisaExpiryStatus = (expiryDate: string | null): 'none' | 'expired' | 'expiring' | 'valid' => {
    if (!expiryDate) return 'none';
    const today = new Date();
    const expiry = new Date(expiryDate);
    const sixMonthsFromNow = new Date();
    sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);

    if (expiry < today) return 'expired';
    if (expiry <= sixMonthsFromNow) return 'expiring';
    return 'valid';
  };

  const getVisaButtonClass = (status: 'none' | 'expired' | 'expiring' | 'valid') => {
    switch (status) {
      case 'expired':
        return 'border-destructive text-destructive bg-destructive/10';
      case 'expiring':
        return 'border-destructive/50 text-destructive bg-destructive/5';
      case 'valid':
        return 'border-primary/50 text-primary bg-primary/5';
      default:
        return '';
    }
  };

  const getExperienceCount = (candidateId?: string, jobDepartment?: string) => {
    if (!candidateId) return { total: 0, relevant: 0 };
    const allExps = allExperiencesByCandidate[candidateId] || [];
    const department = (jobDepartment || "").toLowerCase();
    const isHotelDepartment = department.includes("hotel");
    const targetType = isHotelDepartment ? "hotel" : "ship";
    const relevantExps = allExps.filter((exp: any) => {
      const expType = (exp.experience_type || "Hotel").toLowerCase();
      return expType === targetType;
    });
    return { total: allExps.length, relevant: relevantExps.length };
  };

  const getExperienceCountByType = (candidateId?: string, type?: 'ship' | 'hotel') => {
    if (!candidateId) return 0;
    const allExps = allExperiencesByCandidate[candidateId] || [];
    if (!type) return allExps.length;
    return allExps.filter((exp: any) => {
      const expType = (exp.experience_type || "Hotel").toLowerCase();
      return expType === type;
    }).length;
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
      // When setting suitable to "Yes", also update remarks to "Step 2" and unlock step 2
      const updateData: any = { suitable: suitableChoice };

      if (suitableChoice === "Yes") {
        const currentStep = (activeApp.candidate as any)?.profile_step_unlocked || 1;
        // Only update if current step is less than 2
        if (currentStep < 2) {
          updateData.remarks = "Step 2";
        }
      }

      const { error } = await supabase
        .from("job_applications")
        .update(updateData)
        .eq("id", activeApp.id);
      if (error) throw error;

      // If suitable is "Yes" and step was less than 2, also update candidate profile
      if (suitableChoice === "Yes" && activeApp.candidate_id) {
        const currentStep = (activeApp.candidate as any)?.profile_step_unlocked || 1;
        if (currentStep < 2) {
          await supabase
            .from("candidate_profiles")
            .update({ profile_step_unlocked: 2 } as any)
            .eq("id", activeApp.candidate_id);
        }
      }

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

  const getExportData = () => {
    const dash = (v: any) => (v === undefined || v === null || v === "" ? "-" : v);

    const headers = [
      "Remarks/Record",
      "Crew Code",
      "First Name",
      "Last Name",
      "Office Registered",
      "Registration City (Candidate)",
      "Date of Entry",
      "Source",
      "How Found Us (Candidate)",
      "Position",
      "Department",
      "Second Position",
      "Gender",
      "DOB",
      "Age",
      "Weight/Height",
      "Ship Experience",
      "Visa Expiry Date",
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
        dash(app.remarks || app.status),
        dash(app.crew_code),
        dash(firstName),
        dash(lastName),
        dash(app.office_registered),
        dash(app.candidate?.registration_city),
        dash(app.date_of_entry ? formatDate(app.date_of_entry) : "-"),
        dash(app.source),
        dash(app.candidate?.how_found_us),
        dash(app.job?.title),
        dash(app.job?.department),
        dash(app.second_position),
        dash(app.candidate?.gender),
        dash(app.candidate?.date_of_birth ? formatDate(app.candidate.date_of_birth) : "-"),
        dash(app.candidate?.date_of_birth ? calculateAge(app.candidate.date_of_birth) : "-"),
        dash(app.candidate?.weight_kg && app.candidate?.height_cm ? `${app.candidate.weight_kg} / ${app.candidate.height_cm}` : "-"),
        dash(getShipExperienceFlag(app.candidate_id, app.job?.department)),
        dash(app.c1d_expiry_date ? formatDate(app.c1d_expiry_date) : "-"),
        dash(`${getExperienceCount(app.candidate_id, app.job?.department).relevant}/${getExperienceCount(app.candidate_id, app.job?.department).total}`),
        dash(getLatestEducationText(app.candidate_id, app.education_background)),
        dash(app.contact_no || app.candidate?.phone),
        dash(app.candidate?.email),
        dash(app.emergency_contact),
        dash(app.candidate?.avatar_url || app.photo_url),
        dash(app.cv_url),
        dash(app.letter_form_url),
        dash(app.vaccin_covid_booster ? "Yes" : "-"),
        dash(app.bst_cc),
        dash(app.suitable),
        dash(app.interview_by),
        dash(app.interview_date ? formatDate(app.interview_date) : "-"),
        dash(app.interview_result),
        dash(app.interview_result_notes),
        dash(app.approved_position),
        dash(app.marlin_english_score),
        dash(app.neha_ces_test),
        dash(app.test_result),
        dash(app.principal_interview_by),
        dash(app.principal_interview_date ? formatDate(app.principal_interview_date) : "-"),
        dash(app.principal_interview_result),
        dash(app.approved_as),
        dash(app.status),
        dash(app.employment_offer),
        dash(app.eo_acceptance),
        dash(app.applied_at ? formatDate(app.applied_at) : "-"),
        dash(app.job?.company_name),
      ];
    });

    return { headers, rows };
  };

  const exportToCSV = () => {
    const { headers, rows } = getExportData();
    const safe = (v: any) => {
      // CSV escape (wrap in quotes and double any quotes inside)
      return `"${String(v).replace(/"/g, '""')}"`;
    };

    const csv = [headers.map(safe).join(","), ...rows.map((row) => row.map(safe).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sgp-applications.csv";
    a.click();
  };

  const exportToExcel = () => {
    const { headers, rows } = getExportData();
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Applications");
    XLSX.writeFile(workbook, "sgp-applications.xlsx");
  };

  const getTestRow = (app: Application, type: "CES" | "NEHA" | "Marlins") => {
    if (!app.candidate_id) return null;
    const byCandidate = medicalTestsByCandidate[app.candidate_id];
    if (!byCandidate) return null;
    return byCandidate[type] || null;
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
      toast({
        title: "Error downloading file",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const renderTestDownloadButton = (app: Application, type: "CES" | "NEHA" | "Marlins") => {
    const row = getTestRow(app, type);
    if (row?.file_path) {
      return (
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 ml-1"
          onClick={(e) => {
            e.stopPropagation();
            handleDownloadFile(row.file_path, row.file_name || `${type}.pdf`);
          }}
          title="Download"
        >
          <Download className="w-3 h-3" />
        </Button>
      );
    }
    return null;
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

  // Profile Step Unlock functions
  const openProfileStepDialog = (app: Application) => {
    setActiveApp(app);
    setProfileStepValue((app.candidate as any)?.profile_step_unlocked || 1);
    setProfileStepDialogOpen(true);
  };

  const saveProfileStep = async () => {
    if (!activeApp) return;
    try {
      const { error } = await supabase
        .from("candidate_profiles")
        .update({ profile_step_unlocked: profileStepValue } as any)
        .eq("id", activeApp.candidate_id);

      if (error) throw error;

      // Update local state
      setApplications((prev) =>
        prev.map((a) =>
          a.id === activeApp.id
            ? { ...a, candidate: { ...a.candidate, profile_step_unlocked: profileStepValue } }
            : a
        )
      );

      toast({ title: `Profile step unlocked set to Step ${profileStepValue}` });
      setProfileStepDialogOpen(false);
      setActiveApp(null);
    } catch (e: any) {
      toast({ title: "Failed to update profile step", description: e.message, variant: "destructive" });
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
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>

        {/* Search & filters skeleton */}
        <Card className="p-4">
          <div className="flex flex-wrap gap-3 mb-4">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-40" />
          </div>

          {/* Table skeleton */}
          <div className="overflow-x-auto border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <TableHead key={i}>
                      <Skeleton className="h-4 w-20" />
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 10 }).map((_, rowIdx) => (
                  <TableRow key={rowIdx}>
                    {Array.from({ length: 8 }).map((_, colIdx) => (
                      <TableCell key={colIdx}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination skeleton */}
          <div className="flex items-center justify-between mt-4">
            <Skeleton className="h-4 w-48" />
            <div className="flex gap-2">
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-10" />
              <Skeleton className="h-9 w-20" />
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Dialog open={remarksDialogOpen} onOpenChange={setRemarksDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Remarks</DialogTitle>
            <DialogDescription>
              {activeApplication
                ? `Update remarks untuk ${activeApplication.candidate.full_name}`
                : "Select a step for this application."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Remarks</label>
              <Select
                value={String(profileStepValue)}
                onValueChange={(v) => {
                  const step = Number(v);
                  setProfileStepValue(step);
                  setSelectedRemark(`Step ${step}`);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select step" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Step 1</SelectItem>
                  <SelectItem value="2">Step 2</SelectItem>
                  <SelectItem value="3">Step 3</SelectItem>
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

      {/* Profile Step Dialog */}
      <Dialog open={profileStepDialogOpen} onOpenChange={setProfileStepDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Profile Step Access</DialogTitle>
            <DialogDescription>
              {activeApp ? `Set profile step access untuk ${activeApp.candidate.full_name}` : "Pilih step yang dibuka."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Unlock Step</label>
              <Select value={profileStepValue.toString()} onValueChange={(v) => setProfileStepValue(parseInt(v))}>
                <SelectTrigger>
                  <SelectValue placeholder="- Select Step -" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Step 1 : Personal Detail Only</SelectItem>
                  <SelectItem value="2">Step 2 : Pre Screening Unlocked</SelectItem>
                  <SelectItem value="3">Step 3 : Screening Unlocked</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setProfileStepDialogOpen(false);
                setActiveApp(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={saveProfileStep}>Save</Button>
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

      {/* Candidate View Dialog */}
      <Dialog open={candidateViewDialogOpen} onOpenChange={setCandidateViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              <div className="flex items-center gap-3">
                {viewingCandidate?.candidate?.avatar_url && (
                  <img
                    src={viewingCandidate.candidate.avatar_url}
                    alt="Photo"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                )}
                <div>
                  <div className="text-lg">{viewingCandidate?.candidate?.full_name || "-"}</div>
                  <div className="text-sm font-normal text-muted-foreground">{viewingCandidate?.candidate?.email}</div>
                </div>
              </div>
            </DialogTitle>
            <DialogDescription>
              Application for: {viewingCandidate?.job?.title} at {viewingCandidate?.job?.company_name}
            </DialogDescription>
          </DialogHeader>

          {loadingCandidateData ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-sm font-semibold mb-2 text-primary">Personal Information</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                  <div><span className="text-muted-foreground">Phone:</span> {viewingCandidate?.candidate?.phone || "-"}</div>
                  <div><span className="text-muted-foreground">Gender:</span> {viewingCandidate?.candidate?.gender || "-"}</div>
                  <div><span className="text-muted-foreground">DOB:</span> {formatDate(viewingCandidate?.candidate?.date_of_birth)}</div>
                  <div><span className="text-muted-foreground">Height:</span> {viewingCandidate?.candidate?.height_cm ? `${viewingCandidate.candidate.height_cm} cm` : "-"}</div>
                  <div><span className="text-muted-foreground">Weight:</span> {viewingCandidate?.candidate?.weight_kg ? `${viewingCandidate.candidate.weight_kg} kg` : "-"}</div>
                  <div><span className="text-muted-foreground">Office:</span> {viewingCandidate?.candidate?.registration_city || "-"}</div>
                  <div><span className="text-muted-foreground">Step:</span> Step {(viewingCandidate?.candidate as any)?.profile_step_unlocked || 1}</div>
                  <div><span className="text-muted-foreground">Status:</span> {viewingCandidate?.remarks || viewingCandidate?.status || "-"}</div>
                  <div><span className="text-muted-foreground">Crew Code:</span> {viewingCandidate?.crew_code || "-"}</div>
                </div>
              </div>

              {/* Application Details */}
              <div>
                <h3 className="text-sm font-semibold mb-2 text-primary">Application Details</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                  <div><span className="text-muted-foreground">Position:</span> {viewingCandidate?.job?.title || "-"}</div>
                  <div><span className="text-muted-foreground">Department:</span> {viewingCandidate?.job?.department || "-"}</div>
                  <div><span className="text-muted-foreground">Company:</span> {viewingCandidate?.job?.company_name || "-"}</div>
                  <div><span className="text-muted-foreground">Applied:</span> {formatDate(viewingCandidate?.applied_at || viewingCandidate?.date_of_entry)}</div>
                  <div><span className="text-muted-foreground">Suitable:</span> {viewingCandidate?.suitable || "-"}</div>
                  <div><span className="text-muted-foreground">Interview Result:</span> {viewingCandidate?.interview_result || "-"}</div>
                </div>
              </div>

              {/* Ship Experience */}
              {(() => {
                const shipExperiences = candidateExperiences.filter(exp =>
                  (exp.experience_type || '').toLowerCase() === 'ship'
                );

                return (
                  <div>
                    <h3 className="text-sm font-semibold mb-2 text-primary">
                      Ship Experience ({shipExperiences.length})
                      <span className="font-normal text-muted-foreground ml-2">
                        ({candidateExperiences.length} total)
                      </span>
                    </h3>
                    {shipExperiences.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        No ship experience records
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {shipExperiences.slice(0, 3).map((exp, idx) => (
                          <div key={idx} className="border rounded p-2 text-sm">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{exp.position}</span>
                              <Badge variant="outline" className="text-xs">Ship</Badge>
                            </div>
                            <div className="text-muted-foreground">{exp.vessel_name_type || exp.company || "-"}</div>
                            <div className="text-xs text-muted-foreground">
                              {exp.start_date ? formatDate(exp.start_date) : ""} - {exp.end_date ? formatDate(exp.end_date) : "Present"}
                            </div>
                          </div>
                        ))}
                        {shipExperiences.length > 3 && (
                          <p className="text-xs text-muted-foreground">+{shipExperiences.length - 3} more experiences</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Hotel Experience */}
              {(() => {
                const hotelExperiences = candidateExperiences.filter(exp =>
                  (exp.experience_type || 'Hotel').toLowerCase() === 'hotel'
                );

                return (
                  <div>
                    <h3 className="text-sm font-semibold mb-2 text-primary">
                      Hotel Experience ({hotelExperiences.length})
                    </h3>
                    {hotelExperiences.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        No hotel experience records
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {hotelExperiences.slice(0, 3).map((exp, idx) => (
                          <div key={idx} className="border rounded p-2 text-sm">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{exp.position}</span>
                              <Badge variant="outline" className="text-xs">Hotel</Badge>
                            </div>
                            <div className="text-muted-foreground">{exp.vessel_name_type || exp.company || "-"}</div>
                            <div className="text-xs text-muted-foreground">
                              {exp.start_date ? formatDate(exp.start_date) : ""} - {exp.end_date ? formatDate(exp.end_date) : "Present"}
                            </div>
                          </div>
                        ))}
                        {hotelExperiences.length > 3 && (
                          <p className="text-xs text-muted-foreground">+{hotelExperiences.length - 3} more experiences</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Education */}
              <div>
                <h3 className="text-sm font-semibold mb-2 text-primary">Education ({candidateEducation.length})</h3>
                {candidateEducation.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No education records</p>
                ) : (
                  <div className="space-y-2">
                    {candidateEducation.slice(0, 3).map((edu, idx) => (
                      <div key={idx} className="border rounded p-2 text-sm">
                        <div className="font-medium">{edu.degree}</div>
                        <div className="text-muted-foreground">{edu.institution}</div>
                        <div className="text-xs text-muted-foreground">{edu.field_of_study || ""}</div>
                      </div>
                    ))}
                    {candidateEducation.length > 3 && (
                      <p className="text-xs text-muted-foreground">+{candidateEducation.length - 3} more education records</p>
                    )}
                  </div>
                )}
              </div>

              {/* Certificates */}
              <div>
                <h3 className="text-sm font-semibold mb-2 text-primary">Certificates ({candidateCertificates.length})</h3>
                {candidateCertificates.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No certificates</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {candidateCertificates.map((cert, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {cert.type_certificate}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Travel Documents */}
              <div>
                <h3 className="text-sm font-semibold mb-2 text-primary">Travel Documents ({candidateTravelDocs.length})</h3>
                {candidateTravelDocs.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No travel documents</p>
                ) : (
                  <div className="space-y-2">
                    {candidateTravelDocs.map((doc, idx) => (
                      <div key={idx} className="border rounded p-2 text-sm flex justify-between">
                        <div>
                          <div className="font-medium">{doc.document_type}</div>
                          <div className="text-xs text-muted-foreground">No: {doc.document_number || "-"}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-muted-foreground">Expires: {formatDate(doc.expiry_date)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Emergency Contacts & Next of Kin */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-semibold mb-2 text-primary">Emergency Contacts ({candidateEmergencyContacts.length})</h3>
                  {candidateEmergencyContacts.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No emergency contacts</p>
                  ) : (
                    <div className="space-y-2">
                      {candidateEmergencyContacts.map((contact, idx) => (
                        <div key={idx} className="border rounded p-2 text-sm">
                          <div className="font-medium">{contact.full_name}</div>
                          <div className="text-muted-foreground">{contact.relationship}</div>
                          <div className="text-xs text-muted-foreground">{contact.phone}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-semibold mb-2 text-primary">Next of Kin ({candidateNextOfKin.length})</h3>
                  {candidateNextOfKin.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No next of kin</p>
                  ) : (
                    <div className="space-y-2">
                      {candidateNextOfKin.map((nok, idx) => (
                        <div key={idx} className="border rounded p-2 text-sm">
                          <div className="font-medium">{nok.full_name}</div>
                          <div className="text-muted-foreground">{nok.relationship}</div>
                          <div className="text-xs text-muted-foreground">DOB: {formatDate(nok.date_of_birth)}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* References */}
              <div>
                <h3 className="text-sm font-semibold mb-2 text-primary">References ({candidateReferences.length})</h3>
                {candidateReferences.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No references</p>
                ) : (
                  <div className="space-y-2">
                    {candidateReferences.map((ref, idx) => (
                      <div key={idx} className="border rounded p-2 text-sm">
                        <div className="font-medium">{ref.full_name}</div>
                        <div className="text-muted-foreground">{ref.company} - {ref.position}</div>
                        <div className="text-xs text-muted-foreground">{ref.phone}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" onClick={() => setCandidateViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={referenceDialogOpen} onOpenChange={setReferenceDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>BMI Reference Chart</DialogTitle>
            <DialogDescription>
              Body Mass Index (BMI) Classification
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center">
            <img
              src={bmiReferenceImage}
              alt="BMI Reference Chart"
              className="max-w-full h-auto rounded-lg border"
            />
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
              <div className="flex items-center gap-2">
                <Button onClick={exportToExcel} size="sm" variant="secondary">Export to Excel</Button>
                <Button onClick={exportToCSV} size="sm" variant="outline">Export to CSV</Button>
              </div>
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
                  <label className="text-sm font-medium mb-2 block">Office {isPicUser && picCity ? `(${picCity})` : ""}</label>
                  <Input placeholder="Select Office" value={office} onChange={(e) => !isPicUser && setOffice(e.target.value)} disabled={isPicUser} />
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
                  <label className="text-sm font-medium mb-2 block">Visa Status</label>
                  <Select value={visaStatusFilter} onValueChange={setVisaStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="- Select -" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Valid">Valid</SelectItem>
                      <SelectItem value="Expiring Soon">Expiring Soon</SelectItem>
                      <SelectItem value="Expired">Expired</SelectItem>
                      <SelectItem value="No Visa">No Visa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">BST/CC Status</label>
                  <Select value={bstCcStatusFilter} onValueChange={setBstCcStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="- Select -" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Has BST">Has BST</SelectItem>
                      <SelectItem value="Has CC">Has CC</SelectItem>
                      <SelectItem value="No Certificates">No Certificates</SelectItem>
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
                <div className="flex items-end justify-end gap-2">
                  <Button variant="secondary" onClick={clearFilters} className="w-full">Clear</Button>
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
              <Button onClick={handleSelectAll} size="sm" variant="default">
                Select all
              </Button>
              <Button onClick={handleDeselectAll} size="sm" variant="secondary">
                Deselect All
              </Button>
              <Button onClick={handleSetInterview} size="sm" variant="outline">
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
          <div className="table-responsive overflow-x-auto border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px] min-w-[60px] sticky left-0 z-20 bg-background">
                    <Checkbox
                      checked={selectedIds.size === applications.length && applications.length > 0}
                      onCheckedChange={(checked) => checked ? handleSelectAll() : handleDeselectAll()}
                    />
                  </TableHead>
                  <TableHead className="min-w-[180px] sticky left-[60px] z-20 bg-background">Remarks/Record</TableHead>
                  <TableHead className="min-w-[150px] sticky left-[240px] z-20 bg-background">Crew Code</TableHead>
                  <TableHead className="min-w-[80px] sticky left-[390px] z-20 bg-background">Photo</TableHead>
                  <TableHead className="min-w-[120px] sticky left-[470px] z-20 bg-background">First Name</TableHead>
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
                  <TableHead className="min-w-[110px]">Has Exp</TableHead>
                  <TableHead className="min-w-[150px]">Ship Experience</TableHead>
                  <TableHead className="min-w-[150px]">Hotel Experience</TableHead>
                  <TableHead className="min-w-[130px]">Visa Expiry Date</TableHead>
                  <TableHead className="min-w-[160px]">Education Background</TableHead>
                  <TableHead className="min-w-[120px]">Contact No</TableHead>
                  <TableHead className="min-w-[180px]">Email</TableHead>
                  <TableHead className="min-w-[150px]">Emergency Contact</TableHead>
                  <TableHead className="min-w-[130px]">Next of Kin</TableHead>
                  <TableHead className="min-w-[130px]">References</TableHead>
                  <TableHead className="min-w-[80px]">CV</TableHead>
                  {/* <TableHead className="min-w-[140px]">
                    <div className="flex items-center gap-1">
                      <span>Form Letter</span>
                      <a
                        href="/templates/Form_Letter_Template.docx"
                        download="Form_Letter_Template.docx"
                        className="inline-flex items-center justify-center h-6 w-6 rounded hover:bg-muted"
                        title="Download Template"
                      >
                        <Download className="h-3 w-3" />
                      </a>
                    </div>
                  </TableHead> */}
                  <TableHead className="min-w-[140px]">Vaccin Covid Booster</TableHead>
                  <TableHead className="min-w-[80px]">BST/CC</TableHead>
                  <TableHead className="min-w-[100px]">Suitable</TableHead>
                  <TableHead className="min-w-[120px]">Interview By</TableHead>
                  <TableHead className="min-w-[130px]">Interview Date</TableHead>
                  <TableHead className="min-w-[130px]">Interview Result</TableHead>
                  <TableHead className="min-w-[170px]">Interview Result Notes</TableHead>
                  <TableHead className="min-w-[140px]">Approved Position</TableHead>
                  <TableHead className="min-w-[160px]">Marlin / English Score</TableHead>
                  <TableHead className="min-w-[120px]">Neha Test</TableHead>
                  <TableHead className="min-w-[110px]">CES Test</TableHead>
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
                {applications.filter(passesFilters).map((app) => (
                  <TableRow key={app.id}>
                    <TableCell className="w-[60px] min-w-[60px] sticky left-0 z-10 bg-background">
                      <Checkbox
                        checked={selectedIds.has(app.id)}
                        onCheckedChange={() => handleToggleSelect(app.id)}
                      />
                    </TableCell>
                    <TableCell className="sticky left-[60px] z-10 bg-background">
                      <div className="flex flex-col gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs gap-1"
                          onClick={() => openCandidateViewDialog(app)}
                        >
                          <Eye className="w-3 h-3" />
                          View
                        </Button>
                        <Button
                          variant="link"
                          size="sm"
                          className="h-auto p-0 text-xs"
                          onClick={() => openRemarksDialog(app)}
                        >
                          Update
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="sticky left-[240px] z-10 bg-background">{app.crew_code || "-"}</TableCell>
                    <TableCell className="sticky left-[390px] z-10 bg-background">
                      {app.candidate?.avatar_url || app.photo_url ? (
                        <img
                          src={app.candidate?.avatar_url || app.photo_url}
                          alt="Photo"
                          className="w-10 h-10 rounded object-cover"
                        />
                      ) : "-"}
                    </TableCell>
                    <TableCell className="font-medium sticky left-[470px] z-10 bg-background">{app.candidate.full_name.split(" ")[0]}</TableCell>
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
                    <TableCell>
                      <Badge variant={getShipExperienceFlag(app.candidate_id, app.job?.department) === "Y" ? "default" : "secondary"}>
                        {getShipExperienceFlag(app.candidate_id, app.job?.department)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setExperienceFilter('SHIP');
                          openExperienceModal(app);
                        }}
                        className="text-xs"
                      >
                        View ({getExperienceCountByType(app.candidate_id, 'ship')}/{getExperienceCount(app.candidate_id).total})
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setExperienceFilter('HOTEL');
                          openExperienceModal(app);
                        }}
                        className="text-xs"
                      >
                        View ({getExperienceCountByType(app.candidate_id, 'hotel')}/{getExperienceCount(app.candidate_id).total})
                      </Button>
                    </TableCell>
                    <TableCell>
                      {getVisaCount(app.candidate_id) > 0 ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openVisaModal(app)}
                          className={`text-xs ${getVisaButtonClass(getVisaExpiryStatus(app.c1d_expiry_date))}`}
                        >
                          {formatDate(app.c1d_expiry_date)} ({getVisaCount(app.candidate_id)})
                        </Button>
                      ) : (
                        <span className="text-muted-foreground">{formatDate(app.c1d_expiry_date)}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {getLatestEducationInstitution(app.candidate_id) ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEducationModal(app)}
                          className="text-xs"
                        >
                          {getLatestEducationInstitution(app.candidate_id)}
                        </Button>
                      ) : (app.education_background || "-")}
                    </TableCell>
                    <TableCell>{app.candidate.phone || app.contact_no || "-"}</TableCell>
                    <TableCell>{app.candidate.email}</TableCell>
                    <TableCell>
                      {getLatestEmergencyContactName(app.candidate_id) ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEmergencyContactModal(app)}
                          className="text-xs"
                        >
                          {getLatestEmergencyContactName(app.candidate_id)}
                        </Button>
                      ) : "-"}
                    </TableCell>
                    <TableCell>
                      {getLatestNextOfKinName(app.candidate_id) ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openNextOfKinModal(app)}
                          className="text-xs"
                        >
                          {getLatestNextOfKinName(app.candidate_id)}
                        </Button>
                      ) : "-"}
                    </TableCell>
                    <TableCell>
                      {getLatestReferenceName(app.candidate_id) ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openReferencesModal(app)}
                          className="text-xs"
                        >
                          {getLatestReferenceName(app.candidate_id)}
                        </Button>
                      ) : "-"}
                    </TableCell>
                    <TableCell>
                      {(() => {
                        const cvPath = app.cv_url || cvByCandidate[app.candidate_id || ""];
                        if (cvPath) {
                          return (
                            <a
                              href={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/cvs/${cvPath}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline text-sm"
                            >
                              View CV
                            </a>
                          );
                        }
                        return "-";
                      })()}
                    </TableCell>
                    {/* <TableCell>
                      {(() => {
                        const flPath = app.letter_form_url || formLetterByCandidate[app.candidate_id || ""];
                        if (flPath) {
                          return (
                            <a
                              href={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/candidate-documents/${flPath}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline text-sm"
                            >
                              View Form
                            </a>
                          );
                        }
                        return "-";
                      })()}
                    </TableCell> */}
                    <TableCell>
                      {app.candidate?.covid_vaccinated
                        ? (app.candidate.covid_vaccinated.toLowerCase().includes("booster")
                          ? "Yes"
                          : app.candidate.covid_vaccinated)
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {getBstCcDisplay(app.candidate_id) ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openBstCcModal(app)}
                          className="text-xs"
                        >
                          {getBstCcDisplay(app.candidate_id)}
                        </Button>
                      ) : (app.bst_cc || "-")}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span>
                          {(() => {
                            // Show "Yes" if profile_step_unlocked >= 2, else show the suitable value
                            const step = (app.candidate as any)?.profile_step_unlocked || 1;
                            if (step >= 2) return "Yes";
                            return app.suitable || "-";
                          })()}
                        </span>
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
                        <div className="flex items-center">
                          <span>{getTestScoreText(app, "Marlins")}</span>
                          {renderTestDownloadButton(app, "Marlins")}
                        </div>
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
                        <div className="flex items-center">
                          <span>{getTestScoreText(app, "NEHA")}</span>
                          {renderTestDownloadButton(app, "NEHA")}
                        </div>
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
                        <div className="flex items-center">
                          <span>{getTestScoreText(app, "CES")}</span>
                          {renderTestDownloadButton(app, "CES")}
                        </div>
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
          {(() => {
            const totalPages = Math.ceil(totalCount / itemsPerPage);
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = Math.min(startIndex + itemsPerPage, totalCount);

            if (totalCount === 0) return null;

            return (
              <div className="flex items-center justify-between mt-4 flex-wrap gap-2">
                <div className="flex items-center gap-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {startIndex + 1} to {endIndex} of {totalCount} entries
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Per page:</span>
                    <Select value={String(itemsPerPage)} onValueChange={(v) => { setItemsPerPage(Number(v)); setCurrentPage(1); }}>
                      <SelectTrigger className="w-[70px] h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[10, 20, 50, 100].map(n => (
                          <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    &lt;
                  </Button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </Button>
                      );
                    } else if (page === currentPage - 2 || page === currentPage + 2) {
                      return <span key={page} className="px-2">...</span>;
                    }
                    return null;
                  })}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    &gt;
                  </Button>
                </div>
              </div>
            );
          })()}
        </Card>

        {/* Experience Modal */}
        <Dialog open={experienceModalOpen} onOpenChange={setExperienceModalOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Experience - {experienceModalCandidate?.candidate?.full_name}
              </DialogTitle>
              <DialogDescription>
                Applied for: {experienceModalCandidate?.job?.title} ({experienceModalCandidate?.job?.department})
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {loadingExperience ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : experienceModalData.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No experience records</p>
              ) : (
                <>
                  {/* Filter badges */}
                  <div className="flex flex-col gap-4">
                    <div className="flex gap-2">
                      <Button
                        variant={experienceFilter === 'ALL' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setExperienceFilter('ALL')}
                      >
                        All
                      </Button>
                      <Button
                        variant={experienceFilter === 'HOTEL' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setExperienceFilter('HOTEL')}
                      >
                        Hotel
                      </Button>
                      <Button
                        variant={experienceFilter === 'SHIP' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setExperienceFilter('SHIP')}
                      >
                        Ship
                      </Button>
                    </div>

                    <div className="flex gap-2 flex-wrap text-sm text-muted-foreground">
                      <span>Summary:</span>
                      <span className="font-medium">
                        Hotel: {experienceModalData.filter(e => (e.experience_type || 'Hotel').toLowerCase() === 'hotel').length}
                      </span>
                      <span className="font-medium">
                        Ship: {experienceModalData.filter(e => (e.experience_type || 'Hotel').toLowerCase() === 'ship').length}
                      </span>
                    </div>
                  </div>

                  {/* Experience list */}
                  <div className="space-y-3">
                    {experienceModalData
                      .filter(exp => {
                        if (experienceFilter === 'ALL') return true;
                        const type = (exp.experience_type || 'Hotel').toUpperCase();
                        return type === experienceFilter; // HOTEL or SHIP
                      })
                      .map((exp, idx) => (
                        <div key={idx} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold">{exp.position}</span>
                            <Badge variant={(exp.experience_type || 'Hotel').toLowerCase() === 'hotel' ? 'default' : 'secondary'}>
                              {exp.experience_type || 'Hotel'}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <div>
                              <span className="font-medium">Company/Vessel:</span> {exp.company || exp.vessel_name_type || '-'}
                            </div>
                            <div>
                              <span className="font-medium">Period:</span> {exp.start_date ? formatDate(exp.start_date) : '-'} - {exp.is_current ? 'Present' : (exp.end_date ? formatDate(exp.end_date) : '-')}
                            </div>
                            {exp.gt_loa && (
                              <div>
                                <span className="font-medium">GT/LOA:</span> {exp.gt_loa}
                              </div>
                            )}
                            {exp.reason && (
                              <div>
                                <span className="font-medium">Reason:</span> {exp.reason}
                              </div>
                            )}
                            {exp.job_description && (
                              <div>
                                <span className="font-medium">Job Description:</span> {exp.job_description}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setExperienceModalOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Emergency Contact Modal */}
        <Dialog open={emergencyContactModalOpen} onOpenChange={setEmergencyContactModalOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Emergency Contacts - {emergencyContactModalCandidate?.candidate?.full_name}
              </DialogTitle>
              <DialogDescription>
                Applied for: {emergencyContactModalCandidate?.job?.title} ({emergencyContactModalCandidate?.job?.department})
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {loadingEmergencyContact ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : emergencyContactModalData.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No emergency contact records</p>
              ) : (
                <div className="space-y-3">
                  {emergencyContactModalData.map((contact, idx) => (
                    <div key={idx} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">{contact.full_name}</span>
                        {contact.is_primary && (
                          <Badge variant="default">Primary</Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div>
                          <span className="font-medium">Relationship:</span> {contact.relationship || '-'}
                        </div>
                        <div>
                          <span className="font-medium">Phone:</span> {contact.phone || '-'}
                        </div>
                        {contact.alternative_phone && (
                          <div>
                            <span className="font-medium">Alternative Phone:</span> {contact.alternative_phone}
                          </div>
                        )}
                        {contact.email && (
                          <div>
                            <span className="font-medium">Email:</span> {contact.email}
                          </div>
                        )}
                        {contact.address && (
                          <div>
                            <span className="font-medium">Address:</span> {contact.address}
                          </div>
                        )}
                        {(contact.city || contact.country) && (
                          <div>
                            <span className="font-medium">Location:</span> {[contact.city, contact.country].filter(Boolean).join(', ')}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEmergencyContactModalOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Education Modal */}
        <Dialog open={educationModalOpen} onOpenChange={setEducationModalOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Education - {educationModalCandidate?.candidate?.full_name}
              </DialogTitle>
              <DialogDescription>
                Applied for: {educationModalCandidate?.job?.title} ({educationModalCandidate?.job?.department})
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {loadingEducation ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : educationModalData.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No education records</p>
              ) : (
                <div className="space-y-3">
                  {educationModalData.map((edu, idx) => (
                    <div key={idx} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">{edu.institution}</span>
                        {edu.is_current && (
                          <Badge variant="default">Current</Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div>
                          <span className="font-medium">Degree:</span> {edu.degree || '-'}
                        </div>
                        {edu.field_of_study && (
                          <div>
                            <span className="font-medium">Field of Study:</span> {edu.field_of_study}
                          </div>
                        )}
                        <div>
                          <span className="font-medium">Period:</span> {edu.start_date ? formatDate(edu.start_date) : '-'} - {edu.end_date ? formatDate(edu.end_date) : 'Present'}
                        </div>
                        {edu.description && (
                          <div>
                            <span className="font-medium">Description:</span> {edu.description}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEducationModalOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Visa Documents Modal */}
        <Dialog open={visaModalOpen} onOpenChange={setVisaModalOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Visa Documents - {visaModalCandidate?.candidate?.full_name}
              </DialogTitle>
              <DialogDescription>
                Applied for: {visaModalCandidate?.job?.title} ({visaModalCandidate?.job?.department})
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {loadingVisa ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : visaModalData.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No visa documents found</p>
              ) : (
                <div className="space-y-3">
                  {visaModalData.map((visa, idx) => {
                    // Determine visa status: expired, expiring (within 6 months), or valid
                    const now = new Date();
                    const expiryDate = visa.expiry_date ? new Date(visa.expiry_date) : null;
                    const sixMonthsFromNow = new Date(now.getTime() + 6 * 30 * 24 * 60 * 60 * 1000);

                    let status: 'expired' | 'expiring' | 'valid' = 'valid';
                    if (expiryDate && expiryDate < now) {
                      status = 'expired';
                    } else if (expiryDate && expiryDate < sixMonthsFromNow) {
                      status = 'expiring';
                    }

                    const borderClass = status === 'expired'
                      ? 'border-destructive bg-destructive/5'
                      : status === 'expiring'
                        ? 'border-destructive/50 bg-destructive/5'
                        : '';

                    return (
                      <div key={idx} className={`border rounded-lg p-4 ${borderClass}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold">{visa.document_type}</span>
                          {status === 'expired' ? (
                            <Badge variant="destructive">Expired</Badge>
                          ) : status === 'expiring' ? (
                            <Badge className="bg-destructive/10 text-destructive border-destructive/30">Expiring Soon</Badge>
                          ) : (
                            <Badge className="bg-primary/10 text-primary border-primary/30">Valid</Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div>
                            <span className="font-medium">Document Number:</span> {visa.document_number || '-'}
                          </div>
                          <div>
                            <span className="font-medium">Issue Date:</span> {visa.issue_date ? formatDate(visa.issue_date) : '-'}
                          </div>
                          <div>
                            <span className="font-medium">Expiry Date:</span> {visa.expiry_date ? formatDate(visa.expiry_date) : '-'}
                          </div>
                          {visa.issuing_authority && (
                            <div>
                              <span className="font-medium">Issuing Authority:</span> {visa.issuing_authority}
                            </div>
                          )}
                          {visa.issuing_country && (
                            <div>
                              <span className="font-medium">Country:</span> {visa.issuing_country}
                            </div>
                          )}
                          {visa.file_path && (
                            <div className="pt-2">
                              <a
                                href={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/candidate-documents/${visa.file_path}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline text-sm font-medium"
                              >
                                View Document
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setVisaModalOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* BST/CC Certificates Modal */}
        <Dialog open={bstCcModalOpen} onOpenChange={setBstCcModalOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                BST/CC Certificates - {bstCcModalCandidate?.candidate?.full_name}
              </DialogTitle>
              <DialogDescription>
                Applied for: {bstCcModalCandidate?.job?.title} ({bstCcModalCandidate?.job?.department})
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {(() => {
                const candidateId = bstCcModalCandidate?.candidate_id;
                const entry = candidateId ? bstCcByCandidate[candidateId] : null;

                if (!entry || entry.certs.length === 0) {
                  return <p className="text-muted-foreground text-center py-4">No BST/CC certificates found</p>;
                }

                return (
                  <div className="space-y-3">
                    {entry.certs.map((cert, idx) => (
                      <div key={idx} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">{cert.type}</span>
                          {cert.file_path ? (
                            <a
                              href={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/candidate-documents/${cert.file_path}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline text-sm font-medium"
                            >
                              View Document
                            </a>
                          ) : (
                            <span className="text-muted-foreground text-sm">No file</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setBstCcModalOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Next of Kin Modal */}
        <Dialog open={nextOfKinModalOpen} onOpenChange={setNextOfKinModalOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Next of Kin - {nextOfKinModalCandidate?.candidate?.full_name}
              </DialogTitle>
              <DialogDescription>
                Applied for: {nextOfKinModalCandidate?.job?.title} ({nextOfKinModalCandidate?.job?.department})
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {loadingNextOfKin ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : nextOfKinModalData.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No next of kin records</p>
              ) : (
                <div className="space-y-3">
                  {nextOfKinModalData.map((nok, idx) => (
                    <div key={idx} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">{nok.full_name}</span>
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div>
                          <span className="font-medium">Relationship:</span> {nok.relationship || '-'}
                        </div>
                        {nok.date_of_birth && (
                          <div>
                            <span className="font-medium">Date of Birth:</span> {formatDate(nok.date_of_birth)}
                          </div>
                        )}
                        {nok.place_of_birth && (
                          <div>
                            <span className="font-medium">Place of Birth:</span> {nok.place_of_birth}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setNextOfKinModalOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* References Modal */}
        <Dialog open={referencesModalOpen} onOpenChange={setReferencesModalOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                References - {referencesModalCandidate?.candidate?.full_name}
              </DialogTitle>
              <DialogDescription>
                Applied for: {referencesModalCandidate?.job?.title} ({referencesModalCandidate?.job?.department})
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {loadingReferences ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : referencesModalData.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No reference records</p>
              ) : (
                <div className="space-y-3">
                  {referencesModalData.map((ref, idx) => (
                    <div key={idx} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">{ref.full_name}</span>
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        {ref.relationship && (
                          <div>
                            <span className="font-medium">Relationship:</span> {ref.relationship}
                          </div>
                        )}
                        {ref.company && (
                          <div>
                            <span className="font-medium">Company:</span> {ref.company}
                          </div>
                        )}
                        {ref.position && (
                          <div>
                            <span className="font-medium">Position:</span> {ref.position}
                          </div>
                        )}
                        {ref.phone && (
                          <div>
                            <span className="font-medium">Phone:</span> {ref.phone}
                          </div>
                        )}
                        {ref.email && (
                          <div>
                            <span className="font-medium">Email:</span> {ref.email}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setReferencesModalOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};


export default AdminApplications;
