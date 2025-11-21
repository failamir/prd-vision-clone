import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Settings, Shield } from "lucide-react";
import { RolePermissionsDialog } from "@/components/admin/RolePermissionsDialog";

interface RolePermission {
  role: string;
  permissionCount: number;
  permissions: string[];
}

export default function RolePermissions() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([]);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const roles = ["admin", "employer", "candidate", "manajer", "staff", "interviewer", "interviewer_principal"];

  useEffect(() => {
    fetchRolePermissions();
  }, []);

  const fetchRolePermissions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("role_permissions")
        .select(`
          role,
          permissions (
            name,
            description
          )
        `);

      if (error) throw error;

      // Group by role
      const grouped = roles.map(role => {
        const roleData = data?.filter(rp => rp.role === role) || [];
        return {
          role,
          permissionCount: roleData.length,
          permissions: roleData.map(rp => (rp.permissions as any)?.name || ''),
        };
      });

      setRolePermissions(grouped);
    } catch (error: any) {
      console.error("Error fetching role permissions:", error);
      toast({
        title: "Error",
        description: "Failed to load role permissions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleManagePermissions = (role: string) => {
    setSelectedRole(role);
    setDialogOpen(true);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "manajer":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "interviewer":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "interviewer_principal":
        return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200";
      case "staff":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "employer":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200";
      default:
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    }
  };

  const getRoleDescription = (role: string) => {
    switch (role) {
      case "admin":
        return "Full system access and control";
      case "employer":
        return "Can post and manage jobs";
      case "candidate":
        return "Can apply to jobs and manage profile";
      case "manajer":
        return "Can manage teams and operations";
      case "staff":
        return "Can access staff functions";
      case "interviewer":
        return "Can conduct interviews and assessments";
      case "interviewer_principal":
        return "Can conduct principal interviews";
      default:
        return "";
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Role Permissions</h1>
            <p className="text-muted-foreground mt-2">
              Manage permissions for each role in the system
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rolePermissions.map((roleData) => (
              <Card key={roleData.role} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge className={getRoleBadgeColor(roleData.role)}>
                      <Shield className="w-3 h-3 mr-1" />
                      {roleData.role}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {roleData.permissionCount} permissions
                    </span>
                  </div>
                  <CardTitle className="text-lg mt-3">{roleData.role.charAt(0).toUpperCase() + roleData.role.slice(1)}</CardTitle>
                  <CardDescription>{getRoleDescription(roleData.role)}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm text-muted-foreground">
                      {roleData.permissionCount === 0 ? (
                        <p>No permissions assigned</p>
                      ) : (
                        <div className="space-y-1">
                          <p className="font-medium">Current Permissions:</p>
                          <ul className="list-disc list-inside space-y-1">
                            {roleData.permissions.slice(0, 3).map((permission, idx) => (
                              <li key={idx} className="text-xs">
                                {permission}
                              </li>
                            ))}
                            {roleData.permissions.length > 3 && (
                              <li className="text-xs italic">
                                +{roleData.permissions.length - 3} more...
                              </li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                    <Button
                      onClick={() => handleManagePermissions(roleData.role)}
                      className="w-full"
                      size="sm"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Manage Permissions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {selectedRole && (
        <RolePermissionsDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          role={selectedRole}
          onPermissionsUpdated={fetchRolePermissions}
        />
      )}
    </AdminLayout>
  );
}
