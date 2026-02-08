import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Loader2,
  ArrowLeft,
  Save,
  User,
  Briefcase,
  FileText,
  GraduationCap,
  Shield,
  Phone,
  MapPin,
  Calendar,
  Download,
  ExternalLink,
  Anchor,
  Award,
  Plane,
  Users,
  AlertTriangle,
  Heart,
} from "lucide-react";

const AdminEditProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [candidateId, setCandidateId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("personal");

  // Profile data
  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    phone: "",
    date_of_birth: "",
    gender: "",
    address: "",
    city: "",
    country: "",
    professional_title: "",
    bio: "",
    website: "",
    expected_salary_min: "",
    expected_salary_max: "",
    salary_currency: "USD",
    linkedin_url: "",
    facebook_url: "",
    twitter_url: "",
    weight_kg: "",
    height_cm: "",
    ktp_number: "",
    place_of_birth: "",
    how_found_us: "",
    registration_city: "",
    referral_name: "",
    covid_vaccinated: "",
    avatar_url: "",
    profile_step_unlocked: 1,
    is_archived: false,
  });

  // Related data
  const [experiences, setExperiences] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [travelDocuments, setTravelDocuments] = useState<any[]>([]);
  const [education, setEducation] = useState<any[]>([]);
  const [emergencyContacts, setEmergencyContacts] = useState<any[]>([]);
  const [nextOfKins, setNextOfKins] = useState<any[]>([]);
  const [references, setReferences] = useState<any[]>([]);
  const [medicalTests, setMedicalTests] = useState<any[]>([]);
  const [cvs, setCvs] = useState<any[]>([]);
  const [formLetters, setFormLetters] = useState<any[]>([]);
  const [userRoles, setUserRoles] = useState<string[]>([]);

  useEffect(() => {
    if (userId) {
      fetchProfile();
      fetchUserRoles();
    }
  }, [userId]);

  useEffect(() => {
    if (candidateId) {
      fetchAllRelatedData();
    }
  }, [candidateId]);

  const fetchUserRoles = async () => {
    if (!userId) return;
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);
    if (data) {
      setUserRoles(data.map((r) => r.role));
    }
  };

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("candidate_profiles")
        .select("*")
        .eq("user_id", userId!)
        .single();

      if (error) throw error;

      if (data) {
        setCandidateId(data.id);
        setProfile({
          full_name: data.full_name || "",
          email: data.email || "",
          phone: data.phone || "",
          date_of_birth: data.date_of_birth || "",
          gender: data.gender || "",
          address: data.address || "",
          city: data.city || "",
          country: data.country || "",
          professional_title: data.professional_title || "",
          bio: data.bio || "",
          website: data.website || "",
          expected_salary_min: data.expected_salary_min?.toString() || "",
          expected_salary_max: data.expected_salary_max?.toString() || "",
          salary_currency: data.salary_currency || "USD",
          linkedin_url: data.linkedin_url || "",
          facebook_url: data.facebook_url || "",
          twitter_url: data.twitter_url || "",
          weight_kg: data.weight_kg?.toString() || "",
          height_cm: data.height_cm?.toString() || "",
          ktp_number: data.ktp_number || "",
          place_of_birth: data.place_of_birth || "",
          how_found_us: data.how_found_us || "",
          registration_city: data.registration_city || "",
          referral_name: data.referral_name || "",
          covid_vaccinated: data.covid_vaccinated || "",
          avatar_url: data.avatar_url || "",
          profile_step_unlocked: data.profile_step_unlocked || 1,
          is_archived: data.is_archived || false,
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast({ title: "Gagal memuat profil", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const fetchAllRelatedData = async () => {
    if (!candidateId) return;

    const [
      expRes,
      certRes,
      travelRes,
      eduRes,
      emergRes,
      nokRes,
      refRes,
      medRes,
      cvRes,
      flRes,
    ] = await Promise.all([
      supabase.from("candidate_experience").select("*").eq("candidate_id", candidateId).order("start_date", { ascending: false }),
      supabase.from("candidate_certificates").select("*").eq("candidate_id", candidateId).order("created_at", { ascending: false }),
      supabase.from("candidate_travel_documents").select("*").eq("candidate_id", candidateId).order("created_at", { ascending: false }),
      supabase.from("candidate_education").select("*").eq("candidate_id", candidateId).order("start_date", { ascending: false }),
      supabase.from("candidate_emergency_contacts").select("*").eq("candidate_id", candidateId),
      supabase.from("candidate_next_of_kin").select("*").eq("candidate_id", candidateId),
      supabase.from("candidate_references").select("*").eq("candidate_id", candidateId),
      supabase.from("candidate_medical_tests").select("*").eq("candidate_id", candidateId),
      supabase.from("candidate_cvs").select("*").eq("candidate_id", candidateId).order("created_at", { ascending: false }),
      supabase.from("candidate_form_letters").select("*").eq("candidate_id", candidateId).order("created_at", { ascending: false }),
    ]);

    setExperiences(expRes.data || []);
    setCertificates(certRes.data || []);
    setTravelDocuments(travelRes.data || []);
    setEducation(eduRes.data || []);
    setEmergencyContacts(emergRes.data || []);
    setNextOfKins(nokRes.data || []);
    setReferences(refRes.data || []);
    setMedicalTests(medRes.data || []);
    setCvs(cvRes.data || []);
    setFormLetters(flRes.data || []);
  };

  const handleSave = async () => {
    if (!userId) return;
    setSaving(true);

    try {
      const { error } = await supabase
        .from("candidate_profiles")
        .update({
          full_name: profile.full_name,
          email: profile.email,
          phone: profile.phone,
          date_of_birth: profile.date_of_birth || null,
          gender: profile.gender,
          address: profile.address,
          city: profile.city,
          country: profile.country,
          professional_title: profile.professional_title,
          bio: profile.bio,
          website: profile.website,
          expected_salary_min: profile.expected_salary_min ? parseInt(profile.expected_salary_min) : null,
          expected_salary_max: profile.expected_salary_max ? parseInt(profile.expected_salary_max) : null,
          salary_currency: profile.salary_currency,
          linkedin_url: profile.linkedin_url,
          facebook_url: profile.facebook_url,
          twitter_url: profile.twitter_url,
          weight_kg: profile.weight_kg ? parseFloat(profile.weight_kg) : null,
          height_cm: profile.height_cm ? parseFloat(profile.height_cm) : null,
          ktp_number: profile.ktp_number,
          place_of_birth: profile.place_of_birth,
          how_found_us: profile.how_found_us,
          registration_city: profile.registration_city,
          referral_name: profile.referral_name,
          covid_vaccinated: profile.covid_vaccinated,
          profile_step_unlocked: profile.profile_step_unlocked,
          is_archived: profile.is_archived,
        })
        .eq("user_id", userId);

      if (error) throw error;

      toast({ title: "Profil berhasil disimpan" });
    } catch (error: any) {
      console.error("Error saving profile:", error);
      toast({ title: "Gagal menyimpan profil", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getFileUrl = (filePath: string | null, bucket: string = "candidate-documents") => {
    if (!filePath) return null;
    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return data.publicUrl;
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
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => navigate("/admin/users")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Edit Profil Kandidat</h1>
              <p className="text-muted-foreground">{profile.full_name} — {profile.email}</p>
            </div>
          </div>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Simpan
          </Button>
        </div>

        {/* Profile summary card */}
        <Card className="p-6">
          <div className="flex items-start gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile.avatar_url} alt={profile.full_name} />
              <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                {profile.full_name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold">{profile.full_name}</h2>
                <Badge className={profile.is_archived ? "bg-gray-100 text-gray-800" : "bg-green-100 text-green-800"}>
                  {profile.is_archived ? "Archived" : "Active"}
                </Badge>
                <Badge variant="outline">Step {profile.profile_step_unlocked} Unlocked</Badge>
              </div>
              <p className="text-muted-foreground">{profile.professional_title || "No title"}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{profile.phone || "-"}</span>
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{profile.city || "-"}, {profile.country || "-"}</span>
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{profile.date_of_birth || "-"}</span>
              </div>
              <div className="flex gap-2 mt-1">
                {userRoles.map((role) => (
                  <Badge key={role} variant="secondary">
                    <Shield className="w-3 h-3 mr-1" />
                    {role}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-6 w-full">
            <TabsTrigger value="personal" className="flex items-center gap-1">
              <User className="w-4 h-4" /> Personal
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-1">
              <FileText className="w-4 h-4" /> Dokumen
            </TabsTrigger>
            <TabsTrigger value="experience" className="flex items-center gap-1">
              <Briefcase className="w-4 h-4" /> Pengalaman
            </TabsTrigger>
            <TabsTrigger value="education" className="flex items-center gap-1">
              <GraduationCap className="w-4 h-4" /> Pendidikan
            </TabsTrigger>
            <TabsTrigger value="medical" className="flex items-center gap-1">
              <Heart className="w-4 h-4" /> Medical
            </TabsTrigger>
            <TabsTrigger value="contacts" className="flex items-center gap-1">
              <Users className="w-4 h-4" /> Kontak
            </TabsTrigger>
          </TabsList>

          {/* Personal Info Tab */}
          <TabsContent value="personal" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Informasi Pribadi</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Nama Lengkap</Label>
                  <Input value={profile.full_name} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Telepon</Label>
                  <Input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Tanggal Lahir</Label>
                  <Input type="date" value={profile.date_of_birth} onChange={(e) => setProfile({ ...profile, date_of_birth: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Tempat Lahir</Label>
                  <Input value={profile.place_of_birth} onChange={(e) => setProfile({ ...profile, place_of_birth: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Jenis Kelamin</Label>
                  <Select value={profile.gender} onValueChange={(val) => setProfile({ ...profile, gender: val })}>
                    <SelectTrigger><SelectValue placeholder="Pilih" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Laki-laki</SelectItem>
                      <SelectItem value="female">Perempuan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>No. KTP</Label>
                  <Input value={profile.ktp_number} onChange={(e) => setProfile({ ...profile, ktp_number: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Berat (kg)</Label>
                  <Input type="number" value={profile.weight_kg} onChange={(e) => setProfile({ ...profile, weight_kg: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Tinggi (cm)</Label>
                  <Input type="number" value={profile.height_cm} onChange={(e) => setProfile({ ...profile, height_cm: e.target.value })} />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Alamat</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2 md:col-span-2 lg:col-span-3">
                  <Label>Alamat Lengkap</Label>
                  <Textarea value={profile.address} onChange={(e) => setProfile({ ...profile, address: e.target.value })} rows={2} />
                </div>
                <div className="space-y-2">
                  <Label>Kota</Label>
                  <Input value={profile.city} onChange={(e) => setProfile({ ...profile, city: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Negara</Label>
                  <Input value={profile.country} onChange={(e) => setProfile({ ...profile, country: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Kota Registrasi</Label>
                  <Input value={profile.registration_city} onChange={(e) => setProfile({ ...profile, registration_city: e.target.value })} />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Profesional & Lainnya</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Jabatan Profesional</Label>
                  <Input value={profile.professional_title} onChange={(e) => setProfile({ ...profile, professional_title: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Vaksin COVID</Label>
                  <Select value={profile.covid_vaccinated} onValueChange={(val) => setProfile({ ...profile, covid_vaccinated: val })}>
                    <SelectTrigger><SelectValue placeholder="Pilih" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Ya</SelectItem>
                      <SelectItem value="no">Tidak</SelectItem>
                      <SelectItem value="booster">Booster</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Cara Menemukan Kami</Label>
                  <Input value={profile.how_found_us} onChange={(e) => setProfile({ ...profile, how_found_us: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Nama Referral</Label>
                  <Input value={profile.referral_name} onChange={(e) => setProfile({ ...profile, referral_name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Website</Label>
                  <Input value={profile.website} onChange={(e) => setProfile({ ...profile, website: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>LinkedIn</Label>
                  <Input value={profile.linkedin_url} onChange={(e) => setProfile({ ...profile, linkedin_url: e.target.value })} />
                </div>
                <div className="space-y-2 md:col-span-2 lg:col-span-3">
                  <Label>Bio</Label>
                  <Textarea value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} rows={3} />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Pengaturan Admin</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Profile Step Unlocked</Label>
                  <Select
                    value={profile.profile_step_unlocked.toString()}
                    onValueChange={(val) => setProfile({ ...profile, profile_step_unlocked: parseInt(val) })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Step 1 - Personal Details</SelectItem>
                      <SelectItem value="2">Step 2 - Pre-Screening</SelectItem>
                      <SelectItem value="3">Step 3 - Screening</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status Arsip</Label>
                  <Select
                    value={profile.is_archived ? "true" : "false"}
                    onValueChange={(val) => setProfile({ ...profile, is_archived: val === "true" })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="false">Active</SelectItem>
                      <SelectItem value="true">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" /> CV ({cvs.length})
              </h3>
              {cvs.length === 0 ? (
                <p className="text-muted-foreground text-sm">Belum ada CV yang diupload.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>File</TableHead>
                      <TableHead>Ukuran</TableHead>
                      <TableHead>Default</TableHead>
                      <TableHead>Tanggal Upload</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cvs.map((cv) => (
                      <TableRow key={cv.id}>
                        <TableCell className="font-medium">{cv.file_name}</TableCell>
                        <TableCell>{cv.file_size ? `${(cv.file_size / 1024).toFixed(1)} KB` : "-"}</TableCell>
                        <TableCell>{cv.is_default ? <Badge>Default</Badge> : "-"}</TableCell>
                        <TableCell>{formatDate(cv.created_at)}</TableCell>
                        <TableCell>
                          {cv.file_path && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={getFileUrl(cv.file_path) || "#"} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-3 h-3 mr-1" /> Lihat
                              </a>
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" /> Form Letter ({formLetters.length})
              </h3>
              {formLetters.length === 0 ? (
                <p className="text-muted-foreground text-sm">Belum ada form letter.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>File</TableHead>
                      <TableHead>Ukuran</TableHead>
                      <TableHead>Tanggal Upload</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {formLetters.map((fl) => (
                      <TableRow key={fl.id}>
                        <TableCell className="font-medium">{fl.file_name}</TableCell>
                        <TableCell>{fl.file_size ? `${(fl.file_size / 1024).toFixed(1)} KB` : "-"}</TableCell>
                        <TableCell>{formatDate(fl.created_at)}</TableCell>
                        <TableCell>
                          {fl.file_path && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={getFileUrl(fl.file_path) || "#"} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-3 h-3 mr-1" /> Lihat
                              </a>
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Plane className="w-5 h-5" /> Travel Documents ({travelDocuments.length})
              </h3>
              {travelDocuments.length === 0 ? (
                <p className="text-muted-foreground text-sm">Belum ada travel document.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tipe</TableHead>
                      <TableHead>No. Dokumen</TableHead>
                      <TableHead>Penerbit</TableHead>
                      <TableHead>Tgl Terbit</TableHead>
                      <TableHead>Tgl Kadaluarsa</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {travelDocuments.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell className="font-medium">{doc.document_type}</TableCell>
                        <TableCell>{doc.document_number || "-"}</TableCell>
                        <TableCell>{doc.issuing_authority || "-"}</TableCell>
                        <TableCell>{formatDate(doc.issue_date)}</TableCell>
                        <TableCell>{formatDate(doc.expiry_date)}</TableCell>
                        <TableCell>
                          {doc.file_path && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={getFileUrl(doc.file_path) || "#"} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-3 h-3 mr-1" /> Lihat
                              </a>
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Award className="w-5 h-5" /> Sertifikat ({certificates.length})
              </h3>
              {certificates.length === 0 ? (
                <p className="text-muted-foreground text-sm">Belum ada sertifikat.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tipe</TableHead>
                      <TableHead>Institusi</TableHead>
                      <TableHead>No. Sertifikat</TableHead>
                      <TableHead>Tgl Terbit</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {certificates.map((cert) => (
                      <TableRow key={cert.id}>
                        <TableCell className="font-medium">{cert.type_certificate}</TableCell>
                        <TableCell>{cert.institution || "-"}</TableCell>
                        <TableCell>{cert.cert_number || "-"}</TableCell>
                        <TableCell>{formatDate(cert.date_of_issue)}</TableCell>
                        <TableCell>
                          {cert.file_path && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={getFileUrl(cert.file_path) || "#"} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-3 h-3 mr-1" /> Lihat
                              </a>
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </Card>
          </TabsContent>

          {/* Experience Tab */}
          <TabsContent value="experience" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Anchor className="w-5 h-5" /> Pengalaman Kerja ({experiences.length})
              </h3>
              {experiences.length === 0 ? (
                <p className="text-muted-foreground text-sm">Belum ada pengalaman.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tipe</TableHead>
                      <TableHead>Posisi</TableHead>
                      <TableHead>Vessel / Perusahaan</TableHead>
                      <TableHead>Periode</TableHead>
                      <TableHead>Rute</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {experiences.map((exp) => (
                      <TableRow key={exp.id}>
                        <TableCell>
                          <Badge variant="outline">{exp.experience_type || "Hotel"}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">{exp.position}</TableCell>
                        <TableCell>{exp.vessel_name_type || exp.company || "-"}</TableCell>
                        <TableCell>
                          {formatDate(exp.start_date)} — {exp.is_current ? "Sekarang" : formatDate(exp.end_date)}
                        </TableCell>
                        <TableCell>{exp.route || "-"}</TableCell>
                        <TableCell>
                          {exp.file_path && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={getFileUrl(exp.file_path) || "#"} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-3 h-3 mr-1" /> Lihat
                              </a>
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </Card>
          </TabsContent>

          {/* Education Tab */}
          <TabsContent value="education" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <GraduationCap className="w-5 h-5" /> Pendidikan Formal ({education.length})
              </h3>
              {education.length === 0 ? (
                <p className="text-muted-foreground text-sm">Belum ada data pendidikan.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Institusi</TableHead>
                      <TableHead>Gelar</TableHead>
                      <TableHead>Jurusan</TableHead>
                      <TableHead>Periode</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {education.map((edu) => (
                      <TableRow key={edu.id}>
                        <TableCell className="font-medium">{edu.institution}</TableCell>
                        <TableCell>{edu.degree}</TableCell>
                        <TableCell>{edu.field_of_study || "-"}</TableCell>
                        <TableCell>
                          {formatDate(edu.start_date)} — {edu.is_current ? "Sekarang" : formatDate(edu.end_date)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" /> Referensi ({references.length})
              </h3>
              {references.length === 0 ? (
                <p className="text-muted-foreground text-sm">Belum ada referensi.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama</TableHead>
                      <TableHead>Perusahaan</TableHead>
                      <TableHead>Jabatan</TableHead>
                      <TableHead>Telepon</TableHead>
                      <TableHead>Email</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {references.map((ref) => (
                      <TableRow key={ref.id}>
                        <TableCell className="font-medium">{ref.full_name}</TableCell>
                        <TableCell>{ref.company || "-"}</TableCell>
                        <TableCell>{ref.position || "-"}</TableCell>
                        <TableCell>{ref.phone}</TableCell>
                        <TableCell>{ref.email || "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </Card>
          </TabsContent>

          {/* Medical Tab */}
          <TabsContent value="medical" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5" /> Tes Medical ({medicalTests.length})
              </h3>
              {medicalTests.length === 0 ? (
                <p className="text-muted-foreground text-sm">Belum ada data tes medical.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama Tes</TableHead>
                      <TableHead>Skor</TableHead>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {medicalTests.map((test) => (
                      <TableRow key={test.id}>
                        <TableCell className="font-medium">{test.test_name}</TableCell>
                        <TableCell>{test.score ?? "-"}</TableCell>
                        <TableCell>{formatDate(test.created_at)}</TableCell>
                        <TableCell>
                          {test.file_path && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={getFileUrl(test.file_path) || "#"} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-3 h-3 mr-1" /> Lihat
                              </a>
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </Card>
          </TabsContent>

          {/* Contacts Tab */}
          <TabsContent value="contacts" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" /> Emergency Contacts ({emergencyContacts.length})
              </h3>
              {emergencyContacts.length === 0 ? (
                <p className="text-muted-foreground text-sm">Belum ada kontak darurat.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama</TableHead>
                      <TableHead>Hubungan</TableHead>
                      <TableHead>Telepon</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Alamat</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {emergencyContacts.map((ec) => (
                      <TableRow key={ec.id}>
                        <TableCell className="font-medium">{ec.full_name}</TableCell>
                        <TableCell>{ec.relationship}</TableCell>
                        <TableCell>{ec.phone}</TableCell>
                        <TableCell>{ec.email || "-"}</TableCell>
                        <TableCell>{[ec.address, ec.city, ec.country].filter(Boolean).join(", ") || "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" /> Next of Kin ({nextOfKins.length})
              </h3>
              {nextOfKins.length === 0 ? (
                <p className="text-muted-foreground text-sm">Belum ada data next of kin.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama</TableHead>
                      <TableHead>Hubungan</TableHead>
                      <TableHead>Tempat Lahir</TableHead>
                      <TableHead>Tanggal Lahir</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {nextOfKins.map((nok) => (
                      <TableRow key={nok.id}>
                        <TableCell className="font-medium">{nok.full_name}</TableCell>
                        <TableCell>{nok.relationship}</TableCell>
                        <TableCell>{nok.place_of_birth || "-"}</TableCell>
                        <TableCell>{formatDate(nok.date_of_birth)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminEditProfile;
