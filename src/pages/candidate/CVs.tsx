import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, Download, Trash2, Star, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface CV {
  id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  is_default: boolean;
  created_at: string;
}

const CVs = () => {
  const { toast } = useToast();
  const [cvs, setCvs] = useState<CV[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [candidateId, setCandidateId] = useState<string>("");

  useEffect(() => {
    fetchCVs();
  }, []);

  const fetchCVs = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from("candidate_profiles")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!profile) return;
      setCandidateId(profile.id);

      const { data, error } = await supabase
        .from("candidate_cvs")
        .select("*")
        .eq("candidate_id", profile.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCvs(data || []);
    } catch (error) {
      console.error("Error fetching CVs:", error);
      toast({
        title: "Error loading CVs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF, DOC, or DOCX file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum file size is 5MB",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !candidateId) return;

      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from("cvs")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Save CV record to database
      const { error: dbError } = await supabase
        .from("candidate_cvs")
        .insert({
          candidate_id: candidateId,
          file_name: file.name,
          file_path: fileName,
          file_size: file.size,
          file_type: file.type,
          is_default: cvs.length === 0, // Set as default if it's the first CV
        });

      if (dbError) throw dbError;

      toast({
        title: "CV uploaded successfully",
      });

      setUploadDialogOpen(false);
      fetchCVs();
    } catch (error) {
      console.error("Error uploading CV:", error);
      toast({
        title: "Error uploading CV",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSetDefault = async (cvId: string) => {
    try {
      // Unset all default CVs
      await supabase
        .from("candidate_cvs")
        .update({ is_default: false })
        .eq("candidate_id", candidateId);

      // Set selected CV as default
      const { error } = await supabase
        .from("candidate_cvs")
        .update({ is_default: true })
        .eq("id", cvId);

      if (error) throw error;

      toast({
        title: "Default CV updated",
      });
      fetchCVs();
    } catch (error) {
      console.error("Error setting default CV:", error);
      toast({
        title: "Error updating default CV",
        variant: "destructive",
      });
    }
  };

  const handleDownload = async (cv: CV) => {
    try {
      const { data, error } = await supabase.storage
        .from("cvs")
        .download(cv.file_path);

      if (error) throw error;

      // Create download link
      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = cv.file_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading CV:", error);
      toast({
        title: "Error downloading CV",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (cv: CV) => {
    if (!confirm("Are you sure you want to delete this CV?")) return;

    try {
      // Delete file from storage
      await supabase.storage.from("cvs").remove([cv.file_path]);

      // Delete record from database
      const { error } = await supabase
        .from("candidate_cvs")
        .delete()
        .eq("id", cv.id);

      if (error) throw error;

      toast({
        title: "CV deleted successfully",
      });
      fetchCVs();
    } catch (error) {
      console.error("Error deleting CV:", error);
      toast({
        title: "Error deleting CV",
        variant: "destructive",
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">My CVs</h2>
            <p className="text-muted-foreground">Manage your CV/Resume documents</p>
          </div>
          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Upload className="w-4 h-4 mr-2" />
                Upload New CV
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload CV</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cv-file">Select File</Label>
                  <Input
                    id="cv-file"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    disabled={uploading}
                  />
                  <p className="text-xs text-muted-foreground">
                    Supported formats: PDF, DOC, DOCX (Max 5MB)
                  </p>
                </div>
                {uploading && (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {cvs.length === 0 ? (
          <Card className="p-12 text-center">
            <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No CVs uploaded</h3>
            <p className="text-muted-foreground mb-6">
              Upload your CV to start applying for jobs
            </p>
            <Button onClick={() => setUploadDialogOpen(true)}>
              <Upload className="w-4 h-4 mr-2" />
              Upload Your First CV
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {cvs.map((cv) => (
              <Card key={cv.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-foreground">{cv.file_name}</h3>
                        {cv.is_default && (
                          <Star className="w-4 h-4 fill-gold text-gold" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(cv.file_size)} • Uploaded{" "}
                        {new Date(cv.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!cv.is_default && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetDefault(cv.id)}
                      >
                        Set as Default
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDownload(cv)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(cv)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CVs;
