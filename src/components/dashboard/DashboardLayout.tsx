import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  FileText,
  Briefcase,
  Bookmark,
  Calendar,
  Plane,
  Mail,
  MessageSquare,
  Key,
  LogOut,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useDatabase } from "@/contexts/DatabaseContext";

interface DashboardLayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: "Dashboard", href: "/candidate/dashboard", icon: LayoutDashboard },
  { name: "My Profile", href: "/candidate/profile", icon: User },
  { name: "CV & Form Letter", href: "/candidate/cvs", icon: Briefcase },
  { name: "Applications", href: "/candidate/applications", icon: FileText },
  { name: "Saved Jobs", href: "/candidate/saved-jobs", icon: Bookmark },
  { name: "Interview Schedule", href: "/candidate/interview-schedule", icon: Calendar },
  { name: "Departure Schedule", href: "/candidate/departure-schedule", icon: Plane },
  { name: "Messages", href: "/candidate/messages", icon: Mail },
  { name: "Testimoni", href: "/candidate/testimonials", icon: MessageSquare },
  { name: "Change password", href: "/candidate/change-password", icon: Key },
];

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { supabase } = useDatabase();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out successfully",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Error logging out",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-card border-r border-border transition-transform duration-300 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-border">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-ocean-light to-ocean-blue rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">CWT</span>
              </div>
              <div>
                <div className="font-bold text-foreground">Cipta Wira Tirta</div>
                <div className="text-xs text-muted-foreground">Candidate Dashboard</div>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-muted"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-border">
            <Button
              variant="ghost"
              className="w-full justify-start text-foreground hover:text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-background border-b border-border">
          <div className="flex items-center justify-between px-4 py-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="w-6 h-6" />
            </Button>
            <div className="flex-1 lg:flex-none">
              <h1 className="text-xl font-bold text-foreground">Candidate Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/jobs">
                <Button variant="outline" size="sm">
                  Browse Jobs
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};
