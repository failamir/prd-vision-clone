import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Shield, UserCog } from "lucide-react";

interface RoleManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  userName: string;
  currentRoles: string[];
  onRoleUpdated: () => void;
}

export const RoleManagementDialog = ({
  open,
  onOpenChange,
  userId,
  userName,
  currentRoles,
  onRoleUpdated,
}: RoleManagementDialogProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    type: "add" | "remove";
    role: string;
  } | null>(null);

  const availableRoles = ["admin", "employer", "candidate", "manajer", "staff", "interviewer", "interviewer_principal"];

  const handleRoleAction = async (action: "add" | "remove", role: string) => {
    setPendingAction({ type: action, role });
    setShowConfirm(true);
  };

  const confirmRoleChange = async () => {
    if (!pendingAction) return;

    setLoading(true);
    try {
      if (pendingAction.type === "add") {
        const { error } = await supabase
          .from("user_roles")
          .insert({ 
            user_id: userId, 
            role: pendingAction.role as "admin" | "employer" | "candidate"
          });

        if (error) throw error;

        toast({
          title: "Role assigned",
          description: `${userName} has been assigned the ${pendingAction.role} role`,
        });
      } else {
        const { error } = await supabase
          .from("user_roles")
          .delete()
          .eq("user_id", userId)
          .eq("role", pendingAction.role as "admin" | "employer" | "candidate");

        if (error) throw error;

        toast({
          title: "Role removed",
          description: `${pendingAction.role} role has been removed from ${userName}`,
        });
      }

      onRoleUpdated();
      setShowConfirm(false);
      setPendingAction(null);
    } catch (error: any) {
      console.error("Error updating role:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-background">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCog className="w-5 h-5" />
              Manage Roles for {userName}
            </DialogTitle>
            <DialogDescription>
              Assign or remove roles for this user
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Current Roles */}
            <div>
              <h3 className="text-sm font-medium text-foreground mb-3">Current Roles</h3>
              <div className="flex flex-wrap gap-2">
                {currentRoles.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No roles assigned</p>
                ) : (
                  currentRoles.map((role) => (
                    <Badge key={role} className={getRoleBadgeColor(role)}>
                      <Shield className="w-3 h-3 mr-1" />
                      {role}
                    </Badge>
                  ))
                )}
              </div>
            </div>

            {/* Role Management */}
            <div>
              <h3 className="text-sm font-medium text-foreground mb-3">Available Roles</h3>
              <div className="space-y-2">
                {availableRoles.map((role) => {
                  const hasRole = currentRoles.includes(role);
                  return (
                    <div
                      key={role}
                      className="flex items-center justify-between p-3 rounded-lg border border-border"
                    >
                      <div className="flex items-center gap-3">
                        <Badge className={getRoleBadgeColor(role)}>
                          {role}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {role === "admin" && "Full system access"}
                          {role === "employer" && "Can post and manage jobs"}
                          {role === "candidate" && "Can apply to jobs"}
                          {role === "manajer" && "Can manage teams and operations"}
                          {role === "staff" && "Can access staff functions"}
                          {role === "interviewer" && "Can conduct interviews"}
                          {role === "interviewer_principal" && "Can conduct principal interviews"}
                        </span>
                      </div>
                      {hasRole ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRoleAction("remove", role)}
                          disabled={loading}
                        >
                          Remove
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleRoleAction("add", role)}
                          disabled={loading}
                        >
                          Assign
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent className="bg-background">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Role Change</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingAction?.type === "add"
                ? `Are you sure you want to assign the ${pendingAction.role} role to ${userName}? This will grant them additional permissions.`
                : `Are you sure you want to remove the ${pendingAction?.role} role from ${userName}? This will revoke their associated permissions.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRoleChange} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                "Confirm"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
