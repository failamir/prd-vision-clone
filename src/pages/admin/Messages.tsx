import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DBMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  subject: string | null;
  message: string | null;
  is_read: boolean | null;
  created_at: string;
}

export default function AdminMessages() {
  const { toast } = useToast();
  const [rows, setRows] = useState<DBMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => { fetchRows(); }, []);

  const fetchRows = async () => {
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setRows((data as any) || []);
    } catch (e: any) {
      toast({ title: "Failed to load messages", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const markRead = async (id: string, is_read: boolean) => {
    try {
      const { error } = await supabase.from("messages").update({ is_read }).eq("id", id);
      if (error) throw error;
      setRows(prev => prev.map(r => r.id === id ? { ...r, is_read } : r));
    } catch (e: any) {
      toast({ title: "Failed to update", description: e.message, variant: "destructive" });
    }
  };

  const del = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    try {
      const { error } = await supabase.from("messages").delete().eq("id", id);
      if (error) throw error;
      setRows(prev => prev.filter(r => r.id !== id));
      toast({ title: "Message deleted" });
    } catch (e: any) {
      toast({ title: "Failed to delete", description: e.message, variant: "destructive" });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Messages</h1>
          <p className="text-muted-foreground mt-2">Kelola pesan dari/ke kandidat</p>
        </div>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span className="text-sm">All messages</span>
            </div>
            <Input placeholder="Search subject or text..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-72" />
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-40 text-muted-foreground"><Loader2 className="w-5 h-5 animate-spin mr-2"/>Loading...</div>
          ) : (
            <div className="overflow-x-auto border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Sender</TableHead>
                    <TableHead>Receiver</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead className="w-44">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows
                    .filter(r =>
                      (r.subject || "").toLowerCase().includes(search.toLowerCase()) ||
                      (r.message || "").toLowerCase().includes(search.toLowerCase())
                    )
                    .map(r => (
                      <TableRow key={r.id}>
                        <TableCell>{new Date(r.created_at).toLocaleString()}</TableCell>
                        <TableCell className="font-mono text-xs">{r.sender_id}</TableCell>
                        <TableCell className="font-mono text-xs">{r.receiver_id}</TableCell>
                        <TableCell>{r.subject || "-"}</TableCell>
                        <TableCell className="max-w-[420px] truncate" title={r.message || undefined}>{r.message || "-"}</TableCell>
                        <TableCell className="space-x-2">
                          <Button size="sm" variant={r.is_read ? "secondary" : "default"} onClick={() => markRead(r.id, !r.is_read)}>
                            {r.is_read ? "Mark Unread" : "Mark Read"}
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => del(r.id)}>Delete</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>
      </div>
    </AdminLayout>
  );
}
