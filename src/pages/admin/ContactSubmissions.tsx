import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Loader2, Trash2, CheckCircle, XCircle } from "lucide-react";
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
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface ContactSubmission {
    id: string;
    created_at: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    status: string;
    is_read: boolean;
}

export default function ContactSubmissions() {
    const { toast } = useToast();
    const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const fetchSubmissions = async () => {
        try {
            const { data, error } = await (supabase as any)
                .from("contact_submissions")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setSubmissions(data || []);
        } catch (error: any) {
            toast({
                title: "Error",
                description: "Failed to fetch submissions: " + error.message,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this submission?")) return;

        try {
            const { error } = await (supabase as any)
                .from("contact_submissions")
                .delete()
                .eq("id", id);

            if (error) throw error;

            setSubmissions(submissions.filter((s) => s.id !== id));
            toast({ title: "Submission deleted" });
            if (selectedSubmission?.id === id) setSelectedSubmission(null);
        } catch (error: any) {
            toast({
                title: "Error",
                description: "Failed to delete submission: " + error.message,
                variant: "destructive",
            });
        }
    };

    const handleMarkAsRead = async (id: string, currentStatus: boolean) => {
        try {
            const { error } = await (supabase as any)
                .from("contact_submissions")
                .update({ is_read: !currentStatus })
                .eq("id", id);

            if (error) throw error;

            setSubmissions(
                submissions.map((s) =>
                    s.id === id ? { ...s, is_read: !currentStatus } : s
                )
            );
        } catch (error: any) {
            toast({
                title: "Error",
                description: "Failed to update status: " + error.message,
                variant: "destructive",
            });
        }
    };

    const filteredSubmissions = submissions.filter(
        (s) =>
            s.name.toLowerCase().includes(search.toLowerCase()) ||
            s.email.toLowerCase().includes(search.toLowerCase()) ||
            s.subject.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Contact Submissions</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage messages from the contact form
                    </p>
                </div>

                <Card className="p-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <span className="text-sm">All submissions</span>
                        </div>
                        <Input
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-72"
                        />
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center h-40 text-muted-foreground">
                            <Loader2 className="w-5 h-5 animate-spin mr-2" />
                            Loading...
                        </div>
                    ) : (
                        <div className="overflow-x-auto border rounded-lg">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Subject</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredSubmissions.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                                No submissions found
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredSubmissions.map((submission) => (
                                            <TableRow key={submission.id} className={submission.is_read ? "bg-muted/30" : "bg-white"}>
                                                <TableCell className="whitespace-nowrap">
                                                    {new Date(submission.created_at).toLocaleDateString()}
                                                    <div className="text-xs text-muted-foreground">
                                                        {new Date(submission.created_at).toLocaleTimeString()}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-medium">{submission.name}</div>
                                                    <div className="text-xs text-muted-foreground">{submission.email}</div>
                                                </TableCell>
                                                <TableCell className="max-w-xs truncate">
                                                    {submission.subject}
                                                </TableCell>
                                                <TableCell>
                                                    {submission.is_read ? (
                                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                            Read
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                            New
                                                        </span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right space-x-2">
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button variant="outline" size="sm" onClick={() => {
                                                                if (!submission.is_read) handleMarkAsRead(submission.id, false);
                                                            }}>
                                                                View
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent className="sm:max-w-[600px]">
                                                            <DialogHeader>
                                                                <DialogTitle>Message Details</DialogTitle>
                                                            </DialogHeader>
                                                            <div className="space-y-4 py-4">
                                                                <div className="grid grid-cols-4 gap-4">
                                                                    <div className="font-semibold text-right text-muted-foreground">From:</div>
                                                                    <div className="col-span-3">
                                                                        {submission.name} &lt;{submission.email}&gt;
                                                                    </div>
                                                                </div>
                                                                <div className="grid grid-cols-4 gap-4">
                                                                    <div className="font-semibold text-right text-muted-foreground">Subject:</div>
                                                                    <div className="col-span-3">{submission.subject}</div>
                                                                </div>
                                                                <div className="grid grid-cols-4 gap-4">
                                                                    <div className="font-semibold text-right text-muted-foreground">Date:</div>
                                                                    <div className="col-span-3">{new Date(submission.created_at).toLocaleString()}</div>
                                                                </div>
                                                                <div className="border-t pt-4 mt-4">
                                                                    <div className="font-semibold mb-2">Message:</div>
                                                                    <div className="bg-muted p-4 rounded-md whitespace-pre-wrap text-sm">
                                                                        {submission.message}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </DialogContent>
                                                    </Dialog>

                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleMarkAsRead(submission.id, submission.is_read)}
                                                        title={submission.is_read ? "Mark as unread" : "Mark as read"}
                                                    >
                                                        {submission.is_read ? (
                                                            <XCircle className="w-4 h-4 text-muted-foreground" />
                                                        ) : (
                                                            <CheckCircle className="w-4 h-4 text-blue-500" />
                                                        )}
                                                    </Button>

                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDelete(submission.id)}
                                                        className="text-destructive hover:text-destructive/90"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </Card>
            </div>
        </AdminLayout>
    );
}
