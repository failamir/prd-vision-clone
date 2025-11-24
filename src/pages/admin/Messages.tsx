import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Loader2, Send } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/contexts/UserContext";

interface DBMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  subject: string | null;
  message: string | null;
  is_read: boolean | null;
  created_at: string;
}

type ThreadMessage = {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  created_at: string;
};

// Generate a UUID in environments where crypto.randomUUID might not exist
const genUUID = (): string => {
  const c: any = (globalThis as any).crypto;
  if (c && typeof c.randomUUID === "function") {
    return c.randomUUID();
  }
  if (c && typeof c.getRandomValues === "function") {
    const buf = new Uint8Array(16);
    c.getRandomValues(buf);
    // RFC 4122 compliance: set version and variant bits
    buf[6] = (buf[6] & 0x0f) | 0x40;
    buf[8] = (buf[8] & 0x3f) | 0x80;
    const hex = Array.from(buf, (b) => b.toString(16).padStart(2, "0"));
    return (
      `${hex.slice(0, 4).join("")}-` +
      `${hex.slice(4, 6).join("")}-` +
      `${hex.slice(6, 8).join("")}-` +
      `${hex.slice(8, 10).join("")}-` +
      `${hex.slice(10, 16).join("")}`
    );
  }
  // Last-resort fallback: sufficiently unique for optimistic UI usage
  return `id-${Math.random().toString(36).slice(2)}-${Date.now().toString(36)}`;
};

export default function AdminMessages() {
  const { toast } = useToast();
  const { user } = useUser();
  const [rows, setRows] = useState<DBMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [replyOpen, setReplyOpen] = useState<Record<string, boolean>>({});
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [sending, setSending] = useState<Record<string, boolean>>({});
  const [threads, setThreads] = useState<Record<string, ThreadMessage[]>>({});
  const [threadLoading, setThreadLoading] = useState<Record<string, boolean>>({});

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

  const toggleReply = (id: string) => {
    setReplyOpen(prev => ({ ...prev, [id]: !prev[id] }));
    if (!replyOpen[id]) {
      const row = rows.find(r => r.id === id);
      if (row) loadThread(row);
    }
  };

  const loadThread = async (row: DBMessage) => {
    if (!user) return;
    setThreadLoading(prev => ({ ...prev, [row.id]: true }));
    const otherId = user.id === row.sender_id ? row.receiver_id : row.sender_id;
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("id,sender_id,receiver_id,message,created_at")
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${otherId}),and(sender_id.eq.${otherId},receiver_id.eq.${user.id})`)
        .order("created_at", { ascending: true });
      if (error) throw error;
      setThreads(prev => ({ ...prev, [row.id]: (data as any) || [] }));
      // Mark other's messages as read if present (supports either is_read or read_at schema)
      await supabase
        .from("messages")
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq("sender_id", otherId)
        .eq("receiver_id", user.id)
        .or("is_read.eq.false,read_at.is.null");
    } catch (e: any) {
      console.error(e);
    } finally {
      setThreadLoading(prev => ({ ...prev, [row.id]: false }));
    }
  };

  const sendReply = async (row: DBMessage) => {
    if (!user) {
      toast({ title: "Not authenticated", variant: "destructive" });
      return;
    }
    const text = replyText[row.id]?.trim();
    if (!text) {
      toast({ title: "Reply cannot be empty", variant: "destructive" });
      return;
    }
    try {
      setSending(prev => ({ ...prev, [row.id]: true }));
      // Determine recipient: reply to the other party
      const recipient_id = user.id === row.sender_id ? row.receiver_id : row.sender_id;
      const subject = row.subject ? `Re: ${row.subject}` : "";
      const { error } = await supabase.from("messages").insert({
        sender_id: user.id,
        receiver_id: recipient_id,
        subject,
        message: text,
        is_read: false,
      });
      if (error) throw error;
      toast({ title: "Reply sent" });
      setReplyText(prev => ({ ...prev, [row.id]: "" }));
      setReplyOpen(prev => ({ ...prev, [row.id]: false }));
      // Refresh list
      fetchRows();
      // Push to thread locally
      const newMsg: ThreadMessage = { id: genUUID(), sender_id: user.id, receiver_id: recipient_id, message: text, created_at: new Date().toISOString() };
      setThreads(prev => ({ ...prev, [row.id]: [...(prev[row.id] || []), newMsg] }));
    } catch (e: any) {
      toast({ title: "Failed to send reply", description: e.message, variant: "destructive" });
    } finally {
      setSending(prev => ({ ...prev, [row.id]: false }));
    }
  };

  // Realtime: listen for new incoming messages to the admin and append to any open threads
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("admin-messages-threads")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `receiver_id=eq.${user.id}` },
        (payload) => {
          const m = payload.new as any;
          // find any thread whose other party is the sender
          setThreads(prev => {
            const updated = { ...prev };
            Object.keys(updated).forEach(key => {
              const row = rows.find(r => r.id === key);
              const otherId = row ? (user.id === row.sender_id ? row.receiver_id : row.sender_id) : null;
              if (otherId && otherId === m.sender_id) {
                updated[key] = [...(updated[key] || []), { id: m.id, sender_id: m.sender_id, receiver_id: m.receiver_id, message: m.message ?? m.content, created_at: m.created_at }];
              }
            });
            return updated;
          });
        }
      )
      .subscribe();
    return () => { channel.unsubscribe(); };
  }, [user, rows]);

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
                    <TableHead className="w-60">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows
                    .filter(r =>
                      (r.subject || "").toLowerCase().includes(search.toLowerCase()) ||
                      (r.message || "").toLowerCase().includes(search.toLowerCase())
                    )
                    .map(r => (
                      <>
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
                            <Button size="sm" variant="outline" onClick={() => toggleReply(r.id)}>
                              Reply
                            </Button>
                            <a href={`/admin/message-center?selected=${encodeURIComponent((user?.id === r.sender_id ? r.receiver_id : r.sender_id) || '')}`}>
                              <Button size="sm" variant="secondary">Open Chat</Button>
                            </a>
                            <Button size="sm" variant="destructive" onClick={() => del(r.id)}>Delete</Button>
                          </TableCell>
                        </TableRow>
                        {replyOpen[r.id] && (
                          <TableRow>
                            <TableCell colSpan={6}>
                              <div className="p-3 bg-muted/30 rounded-md space-y-3">
                                <div className="text-sm font-medium">Conversation</div>
                                <div className="max-h-64 overflow-y-auto space-y-2">
                                  {threadLoading[r.id] ? (
                                    <div className="text-sm text-muted-foreground">Loading thread...</div>
                                  ) : (threads[r.id] || []).length === 0 ? (
                                    <div className="text-sm text-muted-foreground">No messages yet</div>
                                  ) : (
                                    (threads[r.id] || []).map((tm) => (
                                      <div key={tm.id} className={`flex ${tm.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[70%] px-3 py-2 rounded-lg text-sm ${tm.sender_id === user?.id ? 'bg-blue-500 text-white' : 'bg-white border'}`}>
                                          <div>{tm.message}</div>
                                          <div className={`text-[10px] mt-1 ${tm.sender_id === user?.id ? 'text-blue-100' : 'text-muted-foreground'}`}>{new Date(tm.created_at).toLocaleString()}</div>
                                        </div>
                                      </div>
                                    ))
                                  )}
                                </div>
                                <div className="text-sm text-muted-foreground">Reply to: <span className="font-mono text-xs">{user?.id === r.sender_id ? r.receiver_id : r.sender_id}</span></div>
                                <Textarea
                                  value={replyText[r.id] || ""}
                                  onChange={(e) => setReplyText(prev => ({ ...prev, [r.id]: e.target.value }))}
                                  placeholder="Type your reply..."
                                  className="min-h-[80px]"
                                />
                                <div className="flex items-center justify-end gap-2">
                                  <Button size="sm" variant="ghost" onClick={() => toggleReply(r.id)}>Cancel</Button>
                                  <Button size="sm" onClick={() => sendReply(r)} disabled={sending[r.id]}>
                                    {sending[r.id] ? <Loader2 className="w-4 h-4 mr-2 animate-spin"/> : <Send className="w-4 h-4 mr-2"/>}
                                    Send Reply
                                  </Button>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </>
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
