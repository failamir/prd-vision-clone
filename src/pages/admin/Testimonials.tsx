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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Row {
  id: string;
  testimonial: string;
  rating: number;
  is_approved: boolean | null;
  created_at: string;
  candidate_id: string;
}

export default function AdminTestimonials() {
  const { toast } = useToast();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => { fetchRows(); }, []);

  const fetchRows = async () => {
    try {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setRows((data as any) || []);
    } catch (e: any) {
      toast({ title: "Failed to load testimonials", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const approve = async (id: string, is_approved: boolean) => {
    try {
      const { error } = await supabase
        .from("testimonials")
        .update({ is_approved })
        .eq("id", id);
      if (error) throw error;
      setRows(prev => prev.map(r => r.id === id ? { ...r, is_approved } : r));
    } catch (e: any) {
      toast({ title: "Failed to update", description: e.message, variant: "destructive" });
    }
  };

  const del = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return;
    try {
      const { error } = await supabase
        .from("testimonials")
        .delete()
        .eq("id", id);
      if (error) throw error;
      setRows(prev => prev.filter(r => r.id !== id));
      toast({ title: "Testimonial deleted" });
    } catch (e: any) {
      toast({ title: "Failed to delete", description: e.message, variant: "destructive" });
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Testimonials</h1>
          <p className="text-muted-foreground mt-2">Kelola testimoni kandidat</p>
        </div>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <Input
              placeholder="Search text..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-72"
            />
          </div>
          <div className="overflow-x-auto border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Candidate ID</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Testimonial</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-56">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows
                  .filter(r => (r.testimonial || "").toLowerCase().includes(search.toLowerCase()))
                  .slice((page - 1) * pageSize, page * pageSize)
                  .map(r => (
                    <TableRow key={r.id}>
                      <TableCell>{new Date(r.created_at).toLocaleString()}</TableCell>
                      <TableCell className="font-mono text-xs">{r.candidate_id}</TableCell>
                      <TableCell>{r.rating}</TableCell>
                      <TableCell className="max-w-[420px] truncate" title={r.testimonial}>{r.testimonial}</TableCell>
                      <TableCell>{r.is_approved ? "Approved" : "Pending"}</TableCell>
                      <TableCell className="space-x-2">
                        <Button size="sm" variant={r.is_approved ? "secondary" : "default"} onClick={() => approve(r.id, !r.is_approved)}>
                          {r.is_approved ? "Unapprove" : "Approve"}
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => del(r.id)}>Delete</Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>

        {/* Pagination */}
        {(() => {
          const filtered = rows.filter(r => (r.testimonial || "").toLowerCase().includes(search.toLowerCase()));
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
      </div>
    </>
  );
}
