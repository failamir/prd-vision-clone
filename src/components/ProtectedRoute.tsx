import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import { Loader2 } from "lucide-react";
import { useDatabase } from "@/contexts/DatabaseContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const adminRoles = ['admin', 'superadmin', 'manajer', 'manager', 'staff', 'interviewer', 'interviewer_principal', 'direktur', 'pic', 'hrd'];

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdminUser, setIsAdminUser] = useState<boolean | null>(null);
  const { supabase } = useDatabase();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        if (!session?.user) {
          setLoading(false);
          setIsAdminUser(null);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  // Check user role when user changes
  useEffect(() => {
    const checkUserRole = async () => {
      if (!user) {
        setIsAdminUser(null);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id);

        if (error) {
          console.error("Error fetching user roles:", error);
          setIsAdminUser(false);
        } else {
          const userRole = data?.[0]?.role;
          setIsAdminUser(userRole ? adminRoles.includes(userRole) : false);
        }
      } catch (err) {
        console.error("Error checking user role:", err);
        setIsAdminUser(false);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      checkUserRole();
    }
  }, [user, supabase]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user has admin role, redirect to admin dashboard
  if (isAdminUser) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
