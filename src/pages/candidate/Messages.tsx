import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Inbox, Send, Mail, Loader2 } from "lucide-react";

interface DBMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

interface AdminUser {
  user_id: string;
}

export default function Messages() {
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("inbox");
  const [inbox, setInbox] = useState<DBMessage[]>([]);
  const [sent, setSent] = useState<DBMessage[]>([]);
  const [loadingInbox, setLoadingInbox] = useState<boolean>(true);
  const [loadingSent, setLoadingSent] = useState<boolean>(true);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<DBMessage | null>(null);
  const [sending, setSending] = useState<boolean>(false);

  const [composeReceiver, setComposeReceiver] = useState<string>("");
  const [composeSubject, setComposeSubject] = useState<string>("");
  const [composeBody, setComposeBody] = useState<string>("");

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);
      fetchInbox(user.id);
      fetchSent(user.id);
      fetchAdmins();
    };
    init();
  }, []);

  const fetchInbox = async (uid: string) => {
    try {
      setLoadingInbox(true);
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("receiver_id", uid)
        .order("created_at", { ascending: false });
      if (error) throw error;
      setInbox((data as DBMessage[]) || []);
    } catch (error: any) {
      toast({ title: "Failed to load inbox", description: error.message, variant: "destructive" });
    } finally {
      setLoadingInbox(false);
    }
  };

  const fetchSent = async (uid: string) => {
    try {
      setLoadingSent(true);
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("sender_id", uid)
        .order("created_at", { ascending: false });
      if (error) throw error;
      setSent((data as DBMessage[]) || []);
    } catch (error: any) {
      toast({ title: "Failed to load sent", description: error.message, variant: "destructive" });
    } finally {
      setLoadingSent(false);
    }
  };

  const fetchAdmins = async () => {
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "admin");
      if (error) throw error;
      console.log("Admin users found:", data);
      setAdmins((data as AdminUser[]) || []);
      if (data && data.length > 0) {
        setComposeReceiver(data[0].user_id);
      } else {
        console.warn("No admin users found in database");
      }
    } catch (error: any) {
      console.error("Error fetching admins:", error);
      toast({ title: "Failed to load admins", description: error.message, variant: "destructive" });
    }
  };

  const markAsRead = async (msg: DBMessage) => {
    if (msg.is_read) {
      setSelectedMessage(msg);
      return;
    }
    try {
      const { error } = await supabase
        .from("messages")
        .update({ is_read: true })
        .eq("id", msg.id);
      if (error) throw error;
      setInbox((prev) => prev.map((m) => (m.id === msg.id ? { ...m, is_read: true } : m)));
      setSelectedMessage({ ...msg, is_read: true });
    } catch (error: any) {
      toast({ title: "Failed to update message", description: error.message, variant: "destructive" });
    }
  };

  const handleSend = async () => {
    if (!userId) return;
    if (!composeReceiver || !composeSubject.trim() || !composeBody.trim()) {
      toast({ title: "Please complete all fields", variant: "destructive" });
      return;
    }
    try {
      setSending(true);
      const { error } = await supabase.from("messages").insert({
        sender_id: userId,
        receiver_id: composeReceiver,
        subject: composeSubject.trim(),
        message: composeBody.trim(),
      });
      if (error) throw error;
      toast({ title: "Message sent" });
      setComposeSubject("");
      setComposeBody("");
      fetchSent(userId);
      setActiveTab("sent");
    } catch (error: any) {
      toast({ title: "Failed to send message", description: error.message, variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  const replyTo = (msg: DBMessage) => {
    setComposeReceiver(msg.sender_id);
    setComposeSubject(msg.subject?.startsWith("Re:") ? msg.subject : `Re: ${msg.subject}`);
    setActiveTab("compose");
  };

  const shorten = (id: string) => `${id.slice(0, 6)}…${id.slice(-4)}`;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Messages</h1>
          <p className="text-muted-foreground mt-2">View, send, and manage your messages</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="inbox" className="flex items-center gap-2">
              <Inbox className="w-4 h-4" /> Inbox
            </TabsTrigger>
            <TabsTrigger value="sent" className="flex items-center gap-2">
              <Send className="w-4 h-4" /> Sent
            </TabsTrigger>
            <TabsTrigger value="compose" className="flex items-center gap-2">
              <Mail className="w-4 h-4" /> Compose
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inbox" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Inbox</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingInbox ? (
                  <div className="flex items-center justify-center py-8 text-muted-foreground">
                    <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading inbox...
                  </div>
                ) : inbox.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">No messages</div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      {inbox.map((msg) => (
                        <button
                          key={msg.id}
                          className={`w-full text-left border rounded-md p-3 hover:bg-accent ${msg.is_read ? "opacity-80" : "border-primary"
                            }`}
                          onClick={() => markAsRead(msg)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="font-medium truncate">
                              {msg.subject || "(No subject)"}
                            </div>
                            {!msg.is_read && (
                              <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary">New</span>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            From: {shorten(msg.sender_id)} • {new Date(msg.created_at).toLocaleString()}
                          </div>
                        </button>
                      ))}
                    </div>
                    <div className="border rounded-md p-4 min-h-[220px]">
                      {selectedMessage ? (
                        <div className="space-y-3">
                          <div className="font-semibold text-lg">{selectedMessage.subject}</div>
                          <div className="text-sm text-muted-foreground">
                            From: {shorten(selectedMessage.sender_id)} • To: {shorten(selectedMessage.receiver_id)}
                          </div>
                          <div className="whitespace-pre-wrap text-sm">{selectedMessage.message}</div>
                          <div className="pt-2">
                            <Button size="sm" onClick={() => replyTo(selectedMessage)}>Reply</Button>
                          </div>
                        </div>
                      ) : (
                        <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                          Select a message to read
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sent" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Sent</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingSent ? (
                  <div className="flex items-center justify-center py-8 text-muted-foreground">
                    <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading sent...
                  </div>
                ) : sent.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">No sent messages</div>
                ) : (
                  <div className="space-y-2">
                    {sent.map((msg) => (
                      <div key={msg.id} className="border rounded-md p-3">
                        <div className="flex items-center justify-between">
                          <div className="font-medium truncate">{msg.subject || "(No subject)"}</div>
                          <div className="text-xs text-muted-foreground">{new Date(msg.created_at).toLocaleString()}</div>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">To: {shorten(msg.receiver_id)}</div>
                        <div className="text-sm mt-2 line-clamp-3">{msg.message}</div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compose" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Compose Message</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-1">
                    <label className="text-sm font-medium mb-1 block">Send To</label>
                    <Select value={composeReceiver} onValueChange={setComposeReceiver}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select recipient" />
                      </SelectTrigger>
                      <SelectContent>
                        {admins.length === 0 ? (
                          <SelectItem value="no_admins" disabled>No admins available</SelectItem>
                        ) : (
                          admins.map((a) => (
                            <SelectItem key={a.user_id} value={a.user_id}>Admin ({shorten(a.user_id)})</SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium mb-1 block">Subject</label>
                    <Input
                      placeholder="Subject"
                      value={composeSubject}
                      onChange={(e) => setComposeSubject(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Message</label>
                  <Textarea
                    rows={8}
                    placeholder="Write your message..."
                    value={composeBody}
                    onChange={(e) => setComposeBody(e.target.value)}
                    className="resize-none"
                  />
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleSend} disabled={sending || !composeReceiver}>
                    {sending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                    Send Message
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
