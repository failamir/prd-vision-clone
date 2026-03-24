import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, Calendar, Shield, UserCog, Plus, Trash2, Edit3, Filter, Download, Upload, Archive, ArchiveRestore, KeyRound, Eye, Phone } from "lucide-react";

import { CreateUserDialog } from "@/components/admin/CreateUserDialog";
import * as XLSX from "xlsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";

interface User {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  created_at: string;
  roles: string[];
  is_archived: boolean;
  archived_at: string | null;
  registration_city: string | null;
}

const AdminUsers = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [archiveFilter, setArchiveFilter] = useState<string>("active");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editFullName, setEditFullName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [archiving, setArchiving] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [importing, setImporting] = useState(false);
  const [resettingPasswords, setResettingPasswords] = useState(false);
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPicUser, setIsPicUser] = useState(false);
  const [picCity, setPicCity] = useState<string | null>(null);
  const [deleteConfirmEmail, setDeleteConfirmEmail] = useState("");
  const [showPermanentDelete, setShowPermanentDelete] = useState(false);
  const [archiveAllDialogOpen, setArchiveAllDialogOpen] = useState(false);
  const [archivingAll, setArchivingAll] = useState(false);

  // Detect PIC role and auto-set city filter
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
    };
    detectPicRole();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [isPicUser, picCity]);

  const fetchUsers = async () => {
    try {
      let profilesQuery = supabase
        .from("candidate_profiles")
        .select("*")
        .order("created_at", { ascending: false });

      // PIC users only see candidates from their city
      if (isPicUser && picCity) {
        profilesQuery = profilesQuery.eq("registration_city", picCity);
      }

      const { data: profiles, error: profilesError } = await profilesQuery;

      if (profilesError) throw profilesError;

      // Fetch roles for each user
      const usersWithRoles = await Promise.all(
        (profiles || []).map(async (profile) => {
          const { data: roles } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", profile.user_id);

          return {
            id: profile.user_id,
            full_name: profile.full_name,
            email: profile.email,
            phone: profile.phone || null,
            created_at: profile.created_at,
            roles: roles?.map(r => r.role) || ["candidate"],
            is_archived: profile.is_archived || false,
            archived_at: profile.archived_at,
            registration_city: profile.registration_city || null,
          };
        })
      );

      setUsers(usersWithRoles);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error loading users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-destructive/10 text-destructive";
      case "employer":
        return "bg-primary/10 text-primary";
      default:
        return "bg-accent text-accent-foreground";
    }
  };


  const handleRoleUpdated = () => {
    fetchUsers();
  };

  const openCreateUserDialog = () => {
    setCreateDialogOpen(true);
  };

  const handleExport = () => {
    const exportData = filteredUsers.map((user) => ({
      "Full Name": user.full_name,
      "Email": user.email,
      "Roles": user.roles.join(", "),
      "Registered": formatDate(user.created_at),
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Users");
    XLSX.writeFile(wb, `users_export_${new Date().toISOString().split("T")[0]}.xlsx`);

    toast({ title: "Data berhasil diexport" });
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json<{
        "Full Name"?: string;
        "Email"?: string;
        "Password"?: string;
        "City"?: string;
        "Role"?: string;
      }>(worksheet);

      let successCount = 0;
      let errorCount = 0;

      for (const row of jsonData) {
        const fullName = row["Full Name"];
        const email = row["Email"];
        const password = row["Password"] || "defaultPassword123";
        const city = row["City"] || "";
        const role = row["Role"] || "candidate";

        if (!fullName || !email) {
          errorCount++;
          continue;
        }

        try {
          const response = await supabase.functions.invoke("create-user", {
            body: { email, password, fullName, city, role },
          });

          if (response.error) {
            console.error("Error creating user:", response.error);
            errorCount++;
          } else {
            successCount++;
          }
        } catch (err) {
          console.error("Error importing user:", err);
          errorCount++;
        }
      }

      toast({
        title: "Import selesai",
        description: `Berhasil: ${successCount}, Gagal: ${errorCount}`,
      });

      await fetchUsers();
    } catch (error) {
      console.error("Error reading file:", error);
      toast({
        title: "Gagal membaca file",
        variant: "destructive",
      });
    } finally {
      setImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const openEditUser = (user: User) => {
    setEditingUser(user);
    setEditFullName(user.full_name);
    setEditEmail(user.email);
    setEditPhone(user.phone || "");
    setEditDialogOpen(true);
  };

  const openDeleteUser = (user: User) => {
    setSelectedUser(user);
    setDeleteConfirmEmail("");
    setShowPermanentDelete(false);
    setDeleteDialogOpen(true);
  };

  const openArchiveUser = (user: User) => {
    setSelectedUser(user);
    setArchiveDialogOpen(true);
  };

  const handleArchiveUser = async () => {
    if (!selectedUser) return;

    setArchiving(true);
    try {
      const newArchivedState = !selectedUser.is_archived;
      const { error } = await supabase
        .from("candidate_profiles")
        .update({
          is_archived: newArchivedState,
          archived_at: newArchivedState ? new Date().toISOString() : null
        })
        .eq("user_id", selectedUser.id);

      if (error) throw error;

      toast({
        title: newArchivedState
          ? "User berhasil diarsipkan"
          : "User berhasil dipulihkan dari arsip"
      });
      setArchiveDialogOpen(false);
      setSelectedUser(null);
      await fetchUsers();
    } catch (error: any) {
      console.error("Error archiving user:", error);
      toast({
        title: "Gagal mengubah status arsip user",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setArchiving(false);
    }
  };

  const handleSaveUser = async () => {
    if (!editFullName || !editEmail) {
      toast({
        title: "Nama dan email wajib diisi",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      if (editingUser) {
        const { error } = await supabase
          .from("candidate_profiles")
          .update({ full_name: editFullName, email: editEmail, phone: editPhone || null })
          .eq("user_id", editingUser.id);

        if (error) throw error;

        toast({ title: "User berhasil diupdate" });
      } else {
        const { data: authData, error: authError } = await supabase.auth.getUser();
        if (authError || !authData.user) {
          throw authError || new Error("User auth tidak tersedia untuk create profile");
        }

        const { error } = await supabase.from("candidate_profiles").insert({
          user_id: authData.user.id,
          full_name: editFullName,
          email: editEmail,
        });

        if (error) throw error;

        toast({ title: "User baru berhasil dibuat" });
      }

      setEditDialogOpen(false);
      setEditingUser(null);
      await fetchUsers();
    } catch (error: any) {
      console.error("Error saving user:", error);
      toast({
        title: "Gagal menyimpan user",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteUser = async (permanent: boolean = false) => {
    if (!selectedUser) return;

    setDeleting(true);
    try {
      if (selectedUser.is_archived || permanent) {
        // Permanent delete
        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData.session) throw new Error("Anda harus login sebagai admin");

        const { data, error } = await supabase.functions.invoke("delete-user", {
          body: { user_id: selectedUser.id },
          headers: {
            Authorization: `Bearer ${sessionData.session.access_token}`,
          },
        });

        if (error) throw error;
        if (data?.error) throw new Error(data.error);

        toast({ title: "User dan akun auth berhasil dihapus permanen" });
      } else {
        // Archive
        const { error } = await supabase
          .from("candidate_profiles")
          .update({
            is_archived: true,
            archived_at: new Date().toISOString()
          })
          .eq("user_id", selectedUser.id);

        if (error) throw error;

        toast({ title: "User berhasil dipindahkan ke arsip" });
      }

      setDeleteDialogOpen(false);
      setSelectedUser(null);
      setShowPermanentDelete(false);
      await fetchUsers();
    } catch (error: any) {
      console.error("Error deleting user:", error);
      toast({
        title: "Gagal menghapus user",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleResetStaffPasswords = async () => {
    setResettingPasswords(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        throw new Error("Anda harus login sebagai admin");
      }

      const { data, error } = await supabase.functions.invoke("reset-staff-passwords", {
        headers: {
          Authorization: `Bearer ${sessionData.session.access_token}`,
        },
      });

      if (error) throw error;

      toast({
        title: "Password berhasil direset",
        description: data?.message || "Semua staff user password telah diubah",
      });
      setResetPasswordDialogOpen(false);
    } catch (error: any) {
      console.error("Error resetting passwords:", error);
      toast({
        title: "Gagal reset password",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setResettingPasswords(false);
    }
  };

  const handleArchiveAllCandidates = async () => {
    setArchivingAll(true);
    try {
      // Get all candidate user_ids
      const { data: candidateRoles, error: rolesErr } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "candidate");

      if (rolesErr) throw rolesErr;
      if (!candidateRoles || candidateRoles.length === 0) {
        toast({ title: "Tidak ada candidate", description: "Tidak ditemukan user dengan role candidate" });
        setArchiveAllDialogOpen(false);
        return;
      }

      const candidateUserIds = candidateRoles.map(r => r.user_id);
      
      // Archive in batches of 50
      let archivedCount = 0;
      for (let i = 0; i < candidateUserIds.length; i += 50) {
        const batch = candidateUserIds.slice(i, i + 50);
        const { error } = await supabase
          .from("candidate_profiles")
          .update({ is_archived: true, archived_at: new Date().toISOString() })
          .in("user_id", batch)
          .eq("is_archived", false);
        
        if (error) {
          console.error("Batch archive error:", error);
        } else {
          archivedCount += batch.length;
        }
      }

      toast({
        title: "Arsip berhasil",
        description: `${archivedCount} candidate telah diarsipkan`,
      });
      setArchiveAllDialogOpen(false);
      fetchUsers();
    } catch (error: any) {
      console.error("Archive all error:", error);
      toast({
        title: "Gagal mengarsipkan",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setArchivingAll(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const normalizedSearch = search.replace(/[^+\d]/g, '');
    const matchesSearch =
      user.full_name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      (user.phone && (
        user.phone.includes(search) ||
        (normalizedSearch.length >= 4 && user.phone.replace(/[^+\d]/g, '').includes(normalizedSearch))
      ));

    const matchesRole =
      roleFilter === "all" || user.roles.some((role) => role === roleFilter);

    const matchesArchive =
      archiveFilter === "all" ||
      (archiveFilter === "active" && !user.is_archived) ||
      (archiveFilter === "archived" && user.is_archived);

    return matchesSearch && matchesRole && matchesArchive;
  });

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + pageSize
  );

  if (loading) {
    return (
      <>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">User Management</h1>
            <p className="text-muted-foreground mt-2">Manage all registered users</p>
          </div>
          {isPicUser && picCity && (
            <Badge variant="outline">Wilayah: {picCity}</Badge>
          )}
          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImportFile}
              accept=".xlsx,.xls"
              className="hidden"
            />
            {!isPicUser && (
              <Button variant="outline" size="sm" onClick={handleImportClick} disabled={importing}>
                {importing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                Import
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            {!isPicUser && (
              <Button variant="outline" size="sm" onClick={openCreateUserDialog}>
                <Plus className="w-4 h-4 mr-2" />
                Add User
              </Button>
            )}
            {!isPicUser && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setResetPasswordDialogOpen(true)}
              >
                <KeyRound className="w-4 h-4 mr-2" />
                Reset Staff Passwords
              </Button>
            )}
            {!isPicUser && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setArchiveAllDialogOpen(true)}
              >
                <Archive className="w-4 h-4 mr-2" />
                Archive All Candidates
              </Button>
            )}
          </div>
        </div>

        <Card>
          <div className="flex flex-col gap-3 p-4 border-b border-border md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2 flex-1">
              <Input
                placeholder="Search by name, email, or phone"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="max-w-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Select
                value={roleFilter}
                onValueChange={(value) => {
                  setRoleFilter(value);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="superadmin">Superadmin</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="direktur">Direktur</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="manajer">Manajer</SelectItem>
                  <SelectItem value="hrd">HRD</SelectItem>
                  <SelectItem value="pic">PIC</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="interviewer">Interviewer</SelectItem>
                  <SelectItem value="interviewer_principal">Interviewer Principal</SelectItem>
                  <SelectItem value="employer">Employer</SelectItem>
                  <SelectItem value="candidate">Candidate</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Archive className="w-4 h-4 text-muted-foreground" />
              <Button
                type="button"
                variant={archiveFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setArchiveFilter("all");
                  setPage(1);
                }}
              >
                All
              </Button>
              <Button
                type="button"
                variant={archiveFilter === "active" ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setArchiveFilter("active");
                  setPage(1);
                }}
              >
                Active
              </Button>
              <Button
                type="button"
                variant={archiveFilter === "archived" ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setArchiveFilter("archived");
                  setPage(1);
                }}
              >
                Archived
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Show:</span>
              <Select
                value={pageSize.toString()}
                onValueChange={(value) => {
                  setPageSize(Number(value));
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Registered</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-ocean-light to-ocean-blue flex items-center justify-center text-white font-bold">
                        {user.full_name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{user.full_name}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-muted-foreground">
                      <Mail className="w-4 h-4 mr-2" />
                      {user.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {user.phone || '-'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {user.roles.map((role) => (
                        <Badge key={role} className={getRoleBadgeColor(role)}>
                          <Shield className="w-3 h-3 mr-1" />
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={user.is_archived ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"}>
                      {user.is_archived ? "Archived" : "Active"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 mr-2" />
                      {formatDate(user.created_at)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/admin/users/${user.id}/edit`)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Profile
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditUser(user)}
                      >
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      {user.is_archived && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-primary border-primary/20 hover:bg-primary/5"
                          onClick={() => openArchiveUser(user)}
                        >
                          <ArchiveRestore className="w-4 h-4 mr-2" />
                          Restore
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive border-destructive/20 hover:bg-destructive/5"
                        onClick={() => openDeleteUser(user)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredUsers.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-muted-foreground">No users found</p>
            </div>
          )}
          {filteredUsers.length > 0 && (
            <div className="py-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setPage((prev) => Math.max(1, prev - 1));
                      }}
                      aria-disabled={currentPage === 1}
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <span className="text-sm text-muted-foreground px-4">
                      Page {currentPage} of {totalPages}
                    </span>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setPage((prev) => Math.min(totalPages, prev + 1));
                      }}
                      aria-disabled={currentPage === totalPages}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </Card>


        <CreateUserDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          onUserCreated={fetchUsers}
        />

        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="bg-background max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingUser ? "Edit User" : "Add User"}</DialogTitle>
              <DialogDescription>
                {editingUser
                  ? "Update informasi, status, dan role user"
                  : "Tambahkan user baru ke sistem"}
              </DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="info">Informasi</TabsTrigger>
                <TabsTrigger value="roles" disabled={!editingUser}>Roles</TabsTrigger>
                <TabsTrigger value="status" disabled={!editingUser}>Status</TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    value={editFullName}
                    onChange={(e) => setEditFullName(e.target.value)}
                    placeholder="Nama lengkap"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    placeholder="email@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="+6281234567890"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setEditDialogOpen(false)}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSaveUser} disabled={saving}>
                    {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Save
                  </Button>
                </div>
              </TabsContent>

              {editingUser && (
                <TabsContent value="roles" className="space-y-4 pt-4">
                  <div>
                    <h3 className="text-sm font-medium text-foreground mb-3">Current Roles</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {editingUser.roles.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No roles assigned</p>
                      ) : (
                        editingUser.roles.map((role) => (
                          <Badge key={role} className={getRoleBadgeColor(role)}>
                            <Shield className="w-3 h-3 mr-1" />
                            {role}
                          </Badge>
                        ))
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    {["admin", "superadmin", "employer", "candidate", "manajer", "manager", "staff", "interviewer", "interviewer_principal", "hrd", "pic", "direktur"].map((role) => {
                      const hasRole = editingUser.roles.includes(role);
                      return (
                        <div
                          key={role}
                          className="flex items-center justify-between p-3 rounded-lg border border-border"
                        >
                          <Badge className={getRoleBadgeColor(role)}>{role}</Badge>
                          {hasRole ? (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-destructive"
                              onClick={async () => {
                                const { error } = await supabase
                                  .from("user_roles")
                                  .delete()
                                  .eq("user_id", editingUser.id)
                                  .eq("role", role as any);
                                if (error) {
                                  toast({ title: "Error", description: error.message, variant: "destructive" });
                                } else {
                                  toast({ title: `Role ${role} dihapus` });
                                  setEditingUser({ ...editingUser, roles: editingUser.roles.filter(r => r !== role) });
                                  await fetchUsers();
                                }
                              }}
                            >
                              Remove
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              onClick={async () => {
                                const { error } = await supabase
                                  .from("user_roles")
                                  .insert({ user_id: editingUser.id, role: role as any });
                                if (error) {
                                  toast({ title: "Error", description: error.message, variant: "destructive" });
                                } else {
                                  toast({ title: `Role ${role} ditambahkan` });
                                  setEditingUser({ ...editingUser, roles: [...editingUser.roles, role] });
                                  await fetchUsers();
                                }
                              }}
                            >
                              Assign
                            </Button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </TabsContent>
              )}

              {editingUser && (
                <TabsContent value="status" className="space-y-4 pt-4">
                  <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                    <div>
                      <p className="font-medium text-foreground">Status Arsip</p>
                      <p className="text-sm text-muted-foreground">
                        {editingUser.is_archived
                          ? "User ini sedang diarsipkan"
                          : "User ini aktif"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {editingUser.is_archived ? "Archived" : "Active"}
                      </span>
                      <Switch
                        checked={editingUser.is_archived}
                        onCheckedChange={async (checked) => {
                          const { error } = await supabase
                            .from("candidate_profiles")
                            .update({
                              is_archived: checked,
                              archived_at: checked ? new Date().toISOString() : null,
                            })
                            .eq("user_id", editingUser.id);
                          if (error) {
                            toast({ title: "Gagal mengubah status", description: error.message, variant: "destructive" });
                          } else {
                            toast({ title: checked ? "User diarsipkan" : "User dipulihkan dari arsip" });
                            setEditingUser({ ...editingUser, is_archived: checked, archived_at: checked ? new Date().toISOString() : null });
                            await fetchUsers();
                          }
                        }}
                      />
                    </div>
                  </div>
                  {editingUser.archived_at && (
                    <p className="text-xs text-muted-foreground">
                      Diarsipkan pada: {formatDate(editingUser.archived_at)}
                    </p>
                  )}
                </TabsContent>
              )}
            </Tabs>
          </DialogContent>
        </Dialog>

        <AlertDialog open={deleteDialogOpen} onOpenChange={(open) => { setDeleteDialogOpen(open); if (!open) { setDeleteConfirmEmail(""); setShowPermanentDelete(false); } }}>
          <AlertDialogContent className="bg-background">
            <AlertDialogHeader>
              <AlertDialogTitle>
                {selectedUser?.is_archived
                  ? "Hapus Permanen?"
                  : showPermanentDelete
                    ? "Hapus Permanen?"
                    : "Arsipkan User?"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {selectedUser?.is_archived || showPermanentDelete
                  ? "Tindakan ini akan menghapus profil, akun auth, dan semua data user tersebut SECARA PERMANEN. Aksi ini tidak dapat dibatalkan."
                  : "User akan dipindahkan ke arsip. Untuk menghapus permanen, hapus dari halaman Archived."
                }
              </AlertDialogDescription>
            </AlertDialogHeader>
            {(selectedUser?.is_archived || showPermanentDelete) && (
              <div className="space-y-2 py-2">
                <Label htmlFor="confirm-email" className="text-sm text-muted-foreground">
                  Ketik email <span className="font-semibold text-foreground">{selectedUser?.email}</span> untuk konfirmasi:
                </Label>
                <Input
                  id="confirm-email"
                  value={deleteConfirmEmail}
                  onChange={(e) => setDeleteConfirmEmail(e.target.value)}
                  placeholder="Ketik email user di sini"
                />
              </div>
            )}
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
              {!selectedUser?.is_archived && !showPermanentDelete && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setShowPermanentDelete(true)}
                >
                  Hapus Permanen
                </Button>
              )}
              <AlertDialogAction
                onClick={() => handleDeleteUser(selectedUser?.is_archived || showPermanentDelete)}
                disabled={deleting || ((selectedUser?.is_archived || showPermanentDelete) && deleteConfirmEmail !== selectedUser?.email)}
                className={(selectedUser?.is_archived || showPermanentDelete) ? "bg-destructive hover:bg-destructive/90" : ""}
              >
                {deleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {(selectedUser?.is_archived || showPermanentDelete) ? "Hapus Permanen" : "Arsipkan"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={archiveDialogOpen} onOpenChange={setArchiveDialogOpen}>
          <AlertDialogContent className="bg-background">
            <AlertDialogHeader>
              <AlertDialogTitle>
                {selectedUser?.is_archived ? "Pulihkan user dari arsip?" : "Arsipkan user?"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {selectedUser?.is_archived
                  ? "User akan dipulihkan dan dapat mengakses sistem kembali."
                  : "User yang diarsipkan tidak akan muncul di daftar aktif, tetapi datanya tetap tersimpan."
                }
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={archiving}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleArchiveUser} disabled={archiving}>
                {archiving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {selectedUser?.is_archived ? "Restore" : "Archive"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={resetPasswordDialogOpen} onOpenChange={setResetPasswordDialogOpen}>
          <AlertDialogContent className="bg-background">
            <AlertDialogHeader>
              <AlertDialogTitle>Reset Password Semua Staff?</AlertDialogTitle>
              <AlertDialogDescription>
                Semua user dengan role selain candidate akan password-nya direset ke "c1pt4w1r4".
                Tindakan ini tidak bisa dibatalkan.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={resettingPasswords}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleResetStaffPasswords} disabled={resettingPasswords}>
                {resettingPasswords && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Reset Passwords
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={archiveAllDialogOpen} onOpenChange={setArchiveAllDialogOpen}>
          <AlertDialogContent className="bg-background">
            <AlertDialogHeader>
              <AlertDialogTitle>Arsipkan Semua Candidate?</AlertDialogTitle>
              <AlertDialogDescription>
                Semua user dengan role candidate akan diarsipkan (is_archived = true). 
                Data tidak dihapus dan bisa di-restore kapan saja. Lanjutkan?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={archivingAll}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleArchiveAllCandidates} disabled={archivingAll}>
                {archivingAll && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Arsipkan Semua
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
};

export default AdminUsers;
