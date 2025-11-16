import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, Calendar, Shield, UserCog, Plus, Trash2, Edit3, Filter } from "lucide-react";
import { RoleManagementDialog } from "@/components/admin/RoleManagementDialog";
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
  created_at: string;
  roles: string[];
}

const AdminUsers = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editFullName, setEditFullName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data: profiles, error: profilesError } = await supabase
        .from("candidate_profiles")
        .select("*")
        .order("created_at", { ascending: false });

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
            created_at: profile.created_at,
            roles: roles?.map(r => r.role) || ["candidate"],
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
        return "bg-red-100 text-red-800";
      case "employer":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-green-100 text-green-800";
    }
  };

  const handleManageRoles = (user: User) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  const handleRoleUpdated = () => {
    fetchUsers();
  };

  const openCreateUser = () => {
    setEditingUser(null);
    setEditFullName("");
    setEditEmail("");
    setEditDialogOpen(true);
  };

  const openEditUser = (user: User) => {
    setEditingUser(user);
    setEditFullName(user.full_name);
    setEditEmail(user.email);
    setEditDialogOpen(true);
  };

  const openDeleteUser = (user: User) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
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
          .update({ full_name: editFullName, email: editEmail })
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

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    setDeleting(true);
    try {
      await supabase.from("user_roles").delete().eq("user_id", selectedUser.id);

      const { error } = await supabase
        .from("candidate_profiles")
        .delete()
        .eq("user_id", selectedUser.id);

      if (error) throw error;

      toast({ title: "User berhasil dihapus" });
      setDeleteDialogOpen(false);
      setSelectedUser(null);
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

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.full_name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());

    const matchesRole =
      roleFilter === "all" || user.roles.some((role) => role === roleFilter);

    return matchesSearch && matchesRole;
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">User Management</h1>
            <p className="text-muted-foreground mt-2">Manage all registered users</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={openCreateUser}>
              <Plus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </div>
        </div>

        <Card>
          <div className="flex flex-col gap-3 p-4 border-b border-border md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2 flex-1">
              <Input
                placeholder="Search by name or email"
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
              <Button
                type="button"
                variant={roleFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setRoleFilter("all");
                  setPage(1);
                }}
              >
                All
              </Button>
              <Button
                type="button"
                variant={roleFilter === "admin" ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setRoleFilter("admin");
                  setPage(1);
                }}
              >
                Admin
              </Button>
              <Button
                type="button"
                variant={roleFilter === "employer" ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setRoleFilter("employer");
                  setPage(1);
                }}
              >
                Employer
              </Button>
              <Button
                type="button"
                variant={roleFilter === "candidate" ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setRoleFilter("candidate");
                  setPage(1);
                }}
              >
                Candidate
              </Button>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Roles</TableHead>
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
                        onClick={() => handleManageRoles(user)}
                      >
                        <UserCog className="w-4 h-4 mr-2" />
                        Manage Roles
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditUser(user)}
                      >
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-200 hover:bg-red-50"
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

        {selectedUser && (
          <RoleManagementDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            userId={selectedUser.id}
            userName={selectedUser.full_name}
            currentRoles={selectedUser.roles}
            onRoleUpdated={handleRoleUpdated}
          />
        )}

        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="bg-background">
            <DialogHeader>
              <DialogTitle>{editingUser ? "Edit User" : "Add User"}</DialogTitle>
              <DialogDescription>
                {editingUser
                  ? "Update informasi user yang sudah terdaftar"
                  : "Tambahkan user baru ke sistem"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
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
            </div>
          </DialogContent>
        </Dialog>

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent className="bg-background">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete user?</AlertDialogTitle>
              <AlertDialogDescription>
                Tindakan ini akan menghapus profil dan semua role user tersebut. Aksi ini tidak dapat dibatalkan.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteUser} disabled={deleting}>
                {deleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
