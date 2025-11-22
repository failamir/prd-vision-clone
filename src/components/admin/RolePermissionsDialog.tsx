import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface RolePermissionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: string;
  onPermissionsUpdated: () => void;
}

export const RolePermissionsDialog = ({
  open,
  onOpenChange,
  role,
  onPermissionsUpdated,
}: RolePermissionsDialogProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      fetchPermissions();
      fetchRolePermissions();
    }
  }, [open, role]);

  const fetchPermissions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("permissions")
        .select("*")
        .order("category", { ascending: true })
        .order("name", { ascending: true });

      if (error) throw error;
      setPermissions(data || []);
    } catch (error: any) {
      console.error("Error fetching permissions:", error);
      toast({
        title: "Error",
        description: "Failed to load permissions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRolePermissions = async () => {
    try {
      const { data, error } = await supabase
        .from("role_permissions")
        .select("permission_id")
        .eq("role", role as any);

      if (error) throw error;
      
      const permissionIds = new Set(data?.map(rp => rp.permission_id) || []);
      setSelectedPermissions(permissionIds);
    } catch (error: any) {
      console.error("Error fetching role permissions:", error);
    }
  };

  const handleTogglePermission = (permissionId: string) => {
    const newSelected = new Set(selectedPermissions);
    if (newSelected.has(permissionId)) {
      newSelected.delete(permissionId);
    } else {
      newSelected.add(permissionId);
    }
    setSelectedPermissions(newSelected);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Delete all existing permissions for this role
      const { error: deleteError } = await supabase
        .from("role_permissions")
        .delete()
        .eq("role", role as any);

      if (deleteError) throw deleteError;

      // Insert new permissions
      if (selectedPermissions.size > 0) {
        const insertData = Array.from(selectedPermissions).map(permissionId => ({
          role: role as any,
          permission_id: permissionId,
        }));

        const { error: insertError } = await supabase
          .from("role_permissions")
          .insert(insertData);

        if (insertError) throw insertError;
      }

      toast({
        title: "Success",
        description: `Permissions updated for ${role} role`,
      });

      onPermissionsUpdated();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error saving permissions:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // Group permissions by category
  const groupedPermissions = permissions.reduce((acc, permission) => {
    const category = permission.category || "Other";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "manajer":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "interviewer":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "staff":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "employer":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200";
      default:
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Manage Permissions
          </DialogTitle>
          <DialogDescription className="flex items-center gap-2">
            Configure permissions for{" "}
            <Badge className={getRoleBadgeColor(role)}>{role}</Badge>
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => (
              <div key={category} className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground border-b pb-2">
                  {category}
                </h3>
                <div className="space-y-2">
                  {categoryPermissions.map((permission) => (
                    <div
                      key={permission.id}
                      className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors"
                    >
                      <Checkbox
                        id={permission.id}
                        checked={selectedPermissions.has(permission.id)}
                        onCheckedChange={() => handleTogglePermission(permission.id)}
                      />
                      <label
                        htmlFor={permission.id}
                        className="flex-1 cursor-pointer space-y-1"
                      >
                        <div className="font-medium text-sm">{permission.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {permission.description}
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Permissions"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
