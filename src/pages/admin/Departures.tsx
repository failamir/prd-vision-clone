import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Row {
  id: string;
  date_of_entry: string | null;
  candidate: { full_name: string } | null;
  job: { title: string; location: string | null } | null;
}

export default function AdminDepartures() {
  const { toast } = useToast();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<Row | null>(null);
  const [date, setDate] = useState("");

  useEffect(() => {
    fetchRows();
  }, []);

  const fetchRows = async () => {
    try {
      const { data, error } = await supabase
        .from("job_applications")
        .select(`
          id,
          date_of_entry,
          candidate:candidate_profiles!job_applications_candidate_id_fkey(full_name),
          job:jobs(title, location)
        `)
        .eq("status", "accepted")
        .order("date_of_entry", { ascending: true });
      if (error) throw error;
      setRows((data as any) || []);
    } catch (e: any) {
      toast({ title: "Failed to load departures", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (row: Row) => {
    setActive(row);
    setDate(row.date_of_entry ? row.date_of_entry.substring(0, 10) : "");
    setOpen(true);
  };

  const save = async () => {
    if (!active) return;
    try {
      const { error } = await supabase
        .from("job_applications")
        .update({ date_of_entry: date || null })
        .eq("id", active.id);
      if (error) throw error;
      toast({ title: "Departure updated" });
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
    return dt.toLocaleDateString();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Departure Schedule</h1>
          <p className="text-muted-foreground mt-2">Kelola jadwal keberangkatan kandidat</p>
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
                  <TableHead>Location</TableHead>
                  <TableHead>Departure Date</TableHead>
                  <TableHead className="w-40">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows
                  .filter(r =>
                    (r.candidate?.full_name || "").toLowerCase().includes(search.toLowerCase()) ||
                    (r.job?.title || "").toLowerCase().includes(search.toLowerCase())
                  )
                  .map((r) => (
                    <TableRow key={r.id}>
                      <TableCell>{r.candidate?.full_name || "-"}</TableCell>
                      <TableCell>{r.job?.title || "-"}</TableCell>
                      <TableCell>{r.job?.location || "-"}</TableCell>
                      <TableCell>{formatDate(r.date_of_entry)}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline" onClick={() => openEdit(r)}>Edit</Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Departure</DialogTitle>
              <DialogDescription>
                {active ? `Edit departure for ${active.candidate?.full_name || "-"}` : ""}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Departure Date</label>
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={save}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
