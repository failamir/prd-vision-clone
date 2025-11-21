import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Loader2,
  MapPin,
  Briefcase,
  DollarSign,
  Calendar,
  Eye,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Job {
  id: string;
  title: string;
  company_name: string;
  department: string | null;
  principal: string | null;
  location: string;
  job_type: string;
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string;
  is_active: boolean;
  is_featured: boolean;
  is_urgent: boolean;
  created_at: string;
  positions_available: number;
}

const AdminJobs = () => {
  const { toast } = useToast();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [saving, setSaving] = useState(false);

  const [formTitle, setFormTitle] = useState("");
  const [formCompany, setFormCompany] = useState("");
  const [formDepartment, setFormDepartment] = useState("");
  const [formPrincipal, setFormPrincipal] = useState("");
  const [formLocation, setFormLocation] = useState("");
  const [formJobType, setFormJobType] = useState("");
  const [formSalaryMin, setFormSalaryMin] = useState<string>("");
  const [formSalaryMax, setFormSalaryMax] = useState<string>("");
  const [formCurrency, setFormCurrency] = useState("USD");
  const [formPositions, setFormPositions] = useState<string>("1");
  const [formIsActive, setFormIsActive] = useState("true");
  const [formIsFeatured, setFormIsFeatured] = useState("false");
  const [formIsUrgent, setFormIsUrgent] = useState("false");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast({
        title: "Error loading jobs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const openCreateDialog = () => {
    setEditingJob(null);
    setFormTitle("");
    setFormCompany("");
    setFormDepartment("");
    setFormPrincipal("");
    setFormLocation("");
    setFormJobType("");
    setFormSalaryMin("");
    setFormSalaryMax("");
    setFormCurrency("USD");
    setFormPositions("1");
    setFormIsActive("true");
    setFormIsFeatured("false");
    setFormIsUrgent("false");
    setDialogOpen(true);
  };

  const openEditDialog = (job: Job) => {
    setEditingJob(job);
    setFormTitle(job.title || "");
    setFormCompany(job.company_name || "");
    setFormDepartment(job.department || "");
    setFormPrincipal(job.principal || "");
    setFormLocation(job.location || "");
    setFormJobType(job.job_type || "");
    setFormSalaryMin(job.salary_min != null ? String(job.salary_min) : "");
    setFormSalaryMax(job.salary_max != null ? String(job.salary_max) : "");
    setFormCurrency(job.salary_currency || "USD");
    setFormPositions(job.positions_available != null ? String(job.positions_available) : "1");
    setFormIsActive(job.is_active ? "true" : "false");
    setFormIsFeatured(job.is_featured ? "true" : "false");
    setFormIsUrgent(job.is_urgent ? "true" : "false");
    setDialogOpen(true);
  };

  const handleSaveJob = async () => {
    if (!formTitle || !formCompany || !formLocation || !formJobType) {
      toast({
        title: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: formTitle,
        company_name: formCompany,
        department: formDepartment || null,
        principal: formPrincipal || null,
        location: formLocation,
        job_type: formJobType,
        salary_min: formSalaryMin ? Number(formSalaryMin) : null,
        salary_max: formSalaryMax ? Number(formSalaryMax) : null,
        salary_currency: formCurrency,
        positions_available: formPositions ? Number(formPositions) : 1,
        is_active: formIsActive === "true",
        is_featured: formIsFeatured === "true",
        is_urgent: formIsUrgent === "true",
      };

      if (editingJob) {
        const { data, error } = await supabase
          .from("jobs")
          .update(payload as any)
          .eq("id", editingJob.id)
          .select()
          .single();

        if (error) throw error;

        setJobs((prev) => prev.map((j) => (j.id === editingJob.id ? (data as Job) : j)));
        toast({ title: "Job updated" });
      } else {
        const { data, error } = await supabase
          .from("jobs")
          .insert(payload as any)
          .select()
          .single();

        if (error) throw error;

        if (data) {
          setJobs((prev) => [data as Job, ...prev]);
        }
        toast({ title: "Job created" });
      }

      setDialogOpen(false);
    } catch (error: any) {
      console.error("Error saving job:", error);
      toast({
        title: "Error saving job",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const confirmDeleteJob = (job: Job) => {
    setJobToDelete(job);
    setDeleteDialogOpen(true);
  };

  const handleDeleteJob = async () => {
    if (!jobToDelete) return;

    setDeleting(true);
    try {
      const { error } = await supabase
        .from("jobs")
        .delete()
        .eq("id", jobToDelete.id);

      if (error) throw error;

      setJobs((prev) => prev.filter((job) => job.id !== jobToDelete.id));
      toast({ title: "Job deleted" });
      setDeleteDialogOpen(false);
      setJobToDelete(null);
    } catch (error: any) {
      console.error("Error deleting job:", error);
      toast({
        title: "Error deleting job",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  const formatSalary = (min: number | null, max: number | null, currency: string) => {
    if (!min && !max) return "Competitive";
    if (min && max) return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`;
    if (min) return `From ${currency} ${min.toLocaleString()}`;
    return `Up to ${currency} ${max?.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      searchQuery === "" ||
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company_name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLocation =
      locationFilter === "" ||
      locationFilter === "all" ||
      job.location.toLowerCase().includes(locationFilter.toLowerCase());

    const matchesType =
      typeFilter === "" ||
      typeFilter === "all" ||
      job.job_type.toLowerCase() === typeFilter.toLowerCase();

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && job.is_active) ||
      (statusFilter === "inactive" && !job.is_active);

    return matchesSearch && matchesLocation && matchesType && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedJobs = filteredJobs.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const goToPage = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Job Management</h1>
            <p className="text-muted-foreground mt-2">Manage all job listings</p>
          </div>
          <Button onClick={openCreateDialog} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Job
          </Button>
        </div>
        <Card className="space-y-4 p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="md:col-span-2">
              <Input
                placeholder="Search by title or company"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <Select
              value={locationFilter}
              onValueChange={(value) => {
                setLocationFilter(value);
                setPage(1);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="asia">Asia Pacific</SelectItem>
                <SelectItem value="europe">Europe</SelectItem>
                <SelectItem value="indonesia">Indonesia</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={typeFilter}
              onValueChange={(value) => {
                setTypeFilter(value);
                setPage(1);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="fulltime">Full-time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="temporary">Temporary</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm text-muted-foreground">
              {filteredJobs.length} jobs found
            </p>
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job Details</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Location & Type</TableHead>
                <TableHead>Salary</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Posted</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedJobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">{job.title}</p>
                      <div className="flex gap-2 mt-1">
                        {job.is_featured && (
                          <Badge className="bg-purple-100 text-purple-800">Featured</Badge>
                        )}
                        {job.is_urgent && (
                          <Badge className="bg-gold text-ocean-deep">Urgent</Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-foreground">{job.company_name}</p>
                    <p className="text-xs text-muted-foreground">
                      Positions: {job.positions_available}
                    </p>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="w-3 h-3 mr-1" />
                        {job.location}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Briefcase className="w-3 h-3 mr-1" />
                        {job.job_type}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <DollarSign className="w-3 h-3 mr-1" />
                      {formatSalary(job.salary_min, job.salary_max, job.salary_currency)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={job.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                      {job.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(job.created_at)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      <Link to={`/jobs/${job.id}`} target="_blank">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(job)}
                      >
                        <Pencil className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => confirmDeleteJob(job)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredJobs.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-muted-foreground">No jobs found</p>
            </div>
          )}

          {filteredJobs.length > 0 && (
            <div className="flex items-center justify-between pt-4 border-t mt-4">
              <p className="text-xs text-muted-foreground">
                Showing {(currentPage - 1) * pageSize + 1} -
                {" "}
                {Math.min(currentPage * pageSize, filteredJobs.length)} of {filteredJobs.length} jobs
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => goToPage(currentPage - 1)}
                >
                  Previous
                </Button>
                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => goToPage(currentPage + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </Card>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="bg-background">
            <DialogHeader>
              <DialogTitle>{editingJob ? "Edit Job" : "Create Job"}</DialogTitle>
              <DialogDescription>
                {editingJob ? "Update job details" : "Create a new job listing"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Title *</p>
                  <Input
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="Job title"
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Company *</p>
                  <Input
                    value={formCompany}
                    onChange={(e) => setFormCompany(e.target.value)}
                    placeholder="Company name"
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Location *</p>
                  <Input
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    placeholder="Location"
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Job Type *</p>
                  <Input
                    value={formJobType}
                    onChange={(e) => setFormJobType(e.target.value)}
                    placeholder="e.g. Full-time"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Department</p>
                  <Select value={formDepartment} onValueChange={setFormDepartment}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Hotel Department">Hotel Department</SelectItem>
                      <SelectItem value="Engine Department">Engine Department</SelectItem>
                      <SelectItem value="Deck Department">Deck Department</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Principal</p>
                  <Select value={formPrincipal} onValueChange={setFormPrincipal}>
                    <SelectTrigger>
                      <SelectValue placeholder="Principal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Norwegian Cruise Line">Norwegian Cruise Line</SelectItem>
                      <SelectItem value="NYK Shipmanagement">NYK Shipmanagement</SelectItem>
                      <SelectItem value="FredOlsen">FredOlsen</SelectItem>
                      <SelectItem value="SeaChef">SeaChef</SelectItem>
                      <SelectItem value="SeaQuest">SeaQuest</SelectItem>
                      <SelectItem value="Alpha Adriatic">Alpha Adriatic</SelectItem>
                      <SelectItem value="Pertamina International Shipping">Pertamina International Shipping</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Salary Min</p>
                  <Input
                    type="number"
                    value={formSalaryMin}
                    onChange={(e) => setFormSalaryMin(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Salary Max</p>
                  <Input
                    type="number"
                    value={formSalaryMax}
                    onChange={(e) => setFormSalaryMax(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Currency</p>
                  <Select value={formCurrency} onValueChange={setFormCurrency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="IDR">IDR</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Positions</p>
                  <Input
                    type="number"
                    min={1}
                    value={formPositions}
                    onChange={(e) => setFormPositions(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Status</p>
                  <Select value={formIsActive} onValueChange={setFormIsActive}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Active</SelectItem>
                      <SelectItem value="false">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Featured</p>
                  <Select value={formIsFeatured} onValueChange={setFormIsFeatured}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="false">No</SelectItem>
                      <SelectItem value="true">Yes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Urgent</p>
                  <Select value={formIsUrgent} onValueChange={setFormIsUrgent}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="false">No</SelectItem>
                      <SelectItem value="true">Yes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button onClick={handleSaveJob} disabled={saving}>
                  {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {editingJob ? "Save Changes" : "Create Job"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent className="bg-background">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Job</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this job? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteJob} disabled={deleting}>
                {deleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
};

export default AdminJobs;
