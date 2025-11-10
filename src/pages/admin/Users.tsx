import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, Calendar, Shield, UserCog } from "lucide-react";
import { RoleManagementDialog } from "@/components/admin/RoleManagementDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
        </div>

        <Card>
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
              {users.map((user) => (
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
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleManageRoles(user)}
                    >
                      <UserCog className="w-4 h-4 mr-2" />
                      Manage Roles
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {users.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-muted-foreground">No users found</p>
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
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
