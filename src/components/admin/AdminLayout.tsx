import { ReactNode } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  FileText, 
  LogOut,
  Menu,
  X,
  Calendar,
  Plane,
  Mail,
  MessageSquare,
  Key
} from "lucide-react";
import { useEffect, useState } from "react";
import { DatabaseToggle } from "@/components/DatabaseToggle";
import { useUser } from "@/contexts/UserContext";

interface AdminLayoutProps {
  children: ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useUser();
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const fetchUnread = async () => {
    if (!user) return;
    const { count } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('receiver_id', user.id)
      .eq('is_read', false);
    setUnreadCount(count || 0);
  };

  useEffect(() => {
    fetchUnread();
    if (!user) return;
    const channel = supabase
      .channel('admin-unread')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `receiver_id=eq.${user.id}` }, fetchUnread)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'messages', filter: `receiver_id=eq.${user.id}` }, fetchUnread)
      .subscribe();
    return () => { channel.unsubscribe(); };
  }, [user]);

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Jobs", href: "/admin/jobs", icon: Briefcase },
    { name: "Applications", href: "/admin/applications", icon: FileText },
    { name: "Interview Schedule", href: "/admin/interviews", icon: Calendar },
    { name: "Departure Schedule", href: "/admin/departures", icon: Plane },
    { name: "Messages", href: "/admin/messages", icon: Mail },
    { name: "Message Center", href: "/admin/message-center", icon: MessageSquare },
    { name: "Testimonials", href: "/admin/testimonials", icon: MessageSquare },
    { name: "Role Permissions", href: "/admin/role-permissions", icon: Key },
  ];

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error signing out",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Signed out successfully",
      });
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-64 bg-background border-r transition-transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b">
            <Link to="/admin" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-ocean-light to-ocean-blue rounded-lg flex items-center justify-center text-white font-bold">
                A
              </div>
              <span className="text-xl font-bold text-foreground">Admin Panel</span>
            </Link>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Database Toggle (Admin only) */}
          <div className="p-4 border-t">
            <div className="flex items-center space-x-2">
              <Link to="/admin/message-center">
                <Button variant="outline" size="sm" className="relative">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Messages
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-red-500 text-white text-[10px] leading-4 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </Link>
              <DatabaseToggle />
              <Button variant="ghost" size="sm" onClick={handleLogout} className="ml-2">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:ml-64 min-h-screen">
        <div className="p-8">
          {children}
        </div>
      </main>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};
