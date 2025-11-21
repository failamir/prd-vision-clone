import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
    full_name: string;
    email: string;
    date_of_birth: string;
    gender: string;
    height_cm: number;
    weight_kg: number;
  };
  job: {
    title: string;
    company_name: string;
    department: string;
  };
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
  const [remarksDialogOpen, setRemarksDialogOpen] = useState(false);
  const [activeApplication, setActiveApplication] = useState<Application | null>(null);
  const [selectedRemark, setSelectedRemark] = useState("");
  const [referenceDialogOpen, setReferenceDialogOpen] = useState(false);
  const [referenceLoading, setReferenceLoading] = useState(false);
  const [latestReference, setLatestReference] = useState<any | null>(null);

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

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from("job_applications")
        .select(`
          *,
          candidate:candidate_profiles!job_applications_candidate_id_fkey(
            full_name, 
            email, 
            date_of_birth, 
            gender,
            height_cm,
            weight_kg
          ),
          job:jobs(title, company_name, department)
        `)
        .order("applied_at", { ascending: false });

      if (error) throw error;
      setApplications(data as any || []);
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

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Start Date:</label>
                  <Input 
                    type="date" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">End Date:</label>
                  <Input 
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
                <div className="flex items-end">
                  <Button 
                    onClick={exportToExcel}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    Export SGP to Excel
                  </Button>
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
                  <TableHead className="min-w-[100px]">Crew Code</TableHead>
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
                  <TableHead className="min-w-[130px]">Ship Experience</TableHead>
                  <TableHead className="min-w-[130px]">C1D Expiry Date</TableHead>
                  <TableHead className="min-w-[150px]">Previous Experience</TableHead>
                  <TableHead className="min-w-[160px]">Education Background</TableHead>
                  <TableHead className="min-w-[120px]">Contact No</TableHead>
                  <TableHead className="min-w-[180px]">Email</TableHead>
                  <TableHead className="min-w-[150px]">Emergency Contact</TableHead>
                  <TableHead className="min-w-[80px]">Photo</TableHead>
                  <TableHead className="min-w-[80px]">CV</TableHead>
                  <TableHead className="min-w-[100px]">Letter Form</TableHead>
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
                  <TableHead className="min-w-[110px]">Test Result</TableHead>
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
                  .filter(app => 
                    app.candidate.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    app.candidate.email.toLowerCase().includes(searchQuery.toLowerCase())
                  )
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
                      <TableCell>{app.office_registered || "-"}</TableCell>
                      <TableCell>{formatDate(app.date_of_entry)}</TableCell>
                      <TableCell>{app.source || "-"}</TableCell>
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
                      <TableCell>{app.ship_experience || "-"}</TableCell>
                      <TableCell>{formatDate(app.c1d_expiry_date)}</TableCell>
                      <TableCell>{app.previous_experience || "-"}</TableCell>
                      <TableCell>{app.education_background || "-"}</TableCell>
                      <TableCell>{app.contact_no || "-"}</TableCell>
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
                        {app.suitable || <Button variant="outline" size="sm">Update</Button>}
                      </TableCell>
                      <TableCell>
                        {app.interview_by || <Button variant="outline" size="sm">Update</Button>}
                      </TableCell>
                      <TableCell>
                        {app.interview_date ? formatDate(app.interview_date) : <Button variant="outline" size="sm">Update</Button>}
                      </TableCell>
                      <TableCell>
                        {app.interview_result || <Button variant="outline" size="sm">Update</Button>}
                      </TableCell>
                      <TableCell>
                        {app.interview_result_notes || <Button variant="outline" size="sm">Update</Button>}
                      </TableCell>
                      <TableCell>
                        {app.approved_position || <Button variant="outline" size="sm">Update</Button>}
                      </TableCell>
                      <TableCell>
                        {app.marlin_english_score || <Button variant="outline" size="sm">Update</Button>}
                      </TableCell>
                      <TableCell>
                        {app.neha_ces_test || <Button variant="outline" size="sm">Update</Button>}
                      </TableCell>
                      <TableCell>
                        {app.test_result || <Button variant="outline" size="sm">Update</Button>}
                      </TableCell>
                      <TableCell>
                        {app.principal_interview_by || <Button variant="outline" size="sm">Update</Button>}
                      </TableCell>
                      <TableCell>
                        {app.principal_interview_date ? formatDate(app.principal_interview_date) : <Button variant="outline" size="sm">Update</Button>}
                      </TableCell>
                      <TableCell>
                        {app.principal_interview_result || <Button variant="outline" size="sm">Update</Button>}
                      </TableCell>
                      <TableCell>
                        {app.approved_as || <Button variant="outline" size="sm">Update</Button>}
                      </TableCell>
                      <TableCell>
                        {app.status || <Button variant="outline" size="sm">Update</Button>}
                      </TableCell>
                      <TableCell>
                        {app.employment_offer || <Button variant="outline" size="sm">Update</Button>}
                      </TableCell>
                      <TableCell>
                        {app.eo_acceptance || <Button variant="outline" size="sm">Update</Button>}
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
