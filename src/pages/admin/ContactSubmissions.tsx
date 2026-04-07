import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Loader2, Trash2, CheckCircle, XCircle, ChevronLeft, ChevronRight } from "lucide-react";
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
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);

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
        <>
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
                        <>
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
                                        filteredSubmissions
                                            .slice((page - 1) * pageSize, page * pageSize)
                                            .map((submission) => (
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

                        {/* Pagination */}
                        {(() => {
                            const totalCount = filteredSubmissions.length;
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
                        </>
                    )}
                </Card>
            </div>
        </>
    );
}
