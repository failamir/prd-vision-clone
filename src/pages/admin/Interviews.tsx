import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ApplicationRow {
  id: string;
  interview_by: string | null;
  interview_date: string | null;
  office_registered: string | null;
  candidate: { full_name: string } | null;
  job: { title: string } | null;
}

export default function AdminInterviews() {
  const { toast } = useToast();
  const [rows, setRows] = useState<ApplicationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<ApplicationRow | null>(null);
  const [interviewBy, setInterviewBy] = useState("");
  const [interviewDate, setInterviewDate] = useState("");
  const [isPicUser, setIsPicUser] = useState(false);
  const [picCity, setPicCity] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

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
      }
      // Fetch after role detection
      fetchRows(hasPicRole && !hasAdminRole ? (user.user_metadata?.city || null) : null);
    };
    detectPicRole();
  }, []);

  const fetchRows = async (cityFilter?: string | null) => {
    try {
      let query = supabase
        .from("job_applications")
        .select(`
          id,
          interview_by,
          interview_date,
          office_registered,
          candidate:candidate_profiles!job_applications_candidate_id_fkey(full_name),
          job:jobs(title)
        `)
        .order("interview_date", { ascending: true });

      const city = cityFilter !== undefined ? cityFilter : picCity;
      if (city) {
        query = query.eq("office_registered", city);
      }

      const { data, error } = await query;
      if (error) throw error;
      setRows((data as any) || []);
    } catch (e: any) {
      toast({ title: "Failed to load interviews", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (row: ApplicationRow) => {
    setActive(row);
    setInterviewBy(row.interview_by || "");
    setInterviewDate(row.interview_date ? row.interview_date.substring(0, 10) : "");
    setOpen(true);
  };

  const save = async () => {
    if (!active) return;
    try {
      const { error } = await supabase
        .from("job_applications")
        .update({ interview_by: interviewBy || null, interview_date: interviewDate || null })
        .eq("id", active.id);
      if (error) throw error;
      toast({ title: "Interview updated" });
      setOpen(false);
      setActive(null);
      await fetchRows();
    } catch (e: any) {
      toast({ title: "Failed to save", description: e.message, variant: "destructive" });
    }
  };

  const formatDate = (d?: string | null) => {
    if (!d) return "-";
    const dt = new Date(d);
    return dt.toLocaleString();
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Interview Schedule</h1>
            <p className="text-muted-foreground mt-2">Kelola jadwal interview kandidat</p>
          </div>
          {isPicUser && picCity && (
            <Badge variant="outline" className="self-start">Wilayah: {picCity}</Badge>
          )}
        </div>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <Input
              placeholder="Search by candidate or job..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64"
            />
          </div>
          <div className="overflow-x-auto border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Job</TableHead>
                  <TableHead>Interview By</TableHead>
                  <TableHead>Interview Date</TableHead>
                  <TableHead className="w-40">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows
                  .filter(r =>
                    (r.candidate?.full_name || "").toLowerCase().includes(search.toLowerCase()) ||
                    (r.job?.title || "").toLowerCase().includes(search.toLowerCase())
                  )
                  .slice((page - 1) * pageSize, page * pageSize)
                  .map((r) => (
                    <TableRow key={r.id}>
                      <TableCell>{r.candidate?.full_name || "-"}</TableCell>
                      <TableCell>{r.job?.title || "-"}</TableCell>
                      <TableCell>{r.interview_by || "-"}</TableCell>
                      <TableCell>{formatDate(r.interview_date)}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline" onClick={() => openEdit(r)}>Edit</Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {(() => {
            const filtered = rows.filter(r =>
              (r.candidate?.full_name || "").toLowerCase().includes(search.toLowerCase()) ||
              (r.job?.title || "").toLowerCase().includes(search.toLowerCase())
            );
            const totalCount = filtered.length;
            const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
            const currentPage = Math.min(page, totalPages);
            const startIndex = (currentPage - 1) * pageSize;
            const endIndex = Math.min(startIndex + pageSize, totalCount);

            if (totalCount === 0) return null;

            return (
              <div className="flex items-center justify-between mt-4 flex-wrap gap-2 pt-4 border-t">
                <div className="flex items-center gap-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {startIndex + 1} to {endIndex} of {totalCount} entries
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Per page:</span>
                    <Select
                      value={pageSize.toString()}
                      onValueChange={(v) => {
                        setPageSize(Number(v));
                        setPage(1);
                      }}
                    >
                      <SelectTrigger className="w-[70px] h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[5, 10, 20, 50].map((n) => (
                          <SelectItem key={n} value={String(n)}>
                            {n}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex gap-1 items-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    &lt;
                  </Button>
                  <span className="text-sm px-2">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    &gt;
                  </Button>
                </div>
              </div>
            );
          })()}
        </Card>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Interview</DialogTitle>
              <DialogDescription>
                {active ? `Edit interview for ${active.candidate?.full_name || "-"}` : ""}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Interview By</label>
                <Input value={interviewBy} onChange={(e) => setInterviewBy(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Interview Date</label>
                <Input type="date" value={interviewDate} onChange={(e) => setInterviewDate(e.target.value)} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={save}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
