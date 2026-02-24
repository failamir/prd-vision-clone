import { ReactNode } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { NotificationBell } from "@/components/NotificationBell";
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
  MessageSquare,
  Key,
  Mail,
  User as UserIcon,
  ChevronDown
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  const { user, profile } = useUser();
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [userRoles, setUserRoles] = useState<string[]>([]);

  // Fetch user roles
  useEffect(() => {
    const fetchRoles = async () => {
      if (!user) return;
      const { data } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);
      if (data) {
        setUserRoles(data.map(r => r.role));
      }
    };
    fetchRoles();
  }, [user]);

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

  const navigationGroups = [
    {
      title: "Main",
      items: [
        { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { name: "Users", href: "/admin/users", icon: Users },
      ]
    },
    {
      title: "Recruitment",
      items: [
        { name: "Jobs", href: "/admin/jobs", icon: Briefcase },
        { name: "Applications", href: "/admin/applications", icon: FileText },
        { name: "Interview Schedule", href: "/admin/interviews", icon: Calendar },
        { name: "Departure Schedule", href: "/admin/departures", icon: Plane },
      ]
    },
    {
      title: "Communication",
      items: [
        { name: "Message Center", href: "/admin/message-center", icon: MessageSquare },
        { name: "Contact Submissions", href: "/admin/contact-submissions", icon: Mail },
        { name: "Testimonials", href: "/admin/testimonials", icon: MessageSquare },
      ]
    },
    {
      title: "Settings",
      items: [
        { name: "Role Permissions", href: "/admin/role-permissions", icon: Key },
      ]
    }
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
        className={`fixed top-0 left-0 z-40 h-screen w-64 bg-background border-r transition-transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
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

          <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
            {navigationGroups.map((group) => (
              <div key={group.title} className="space-y-2">
                <h3 className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {group.title}
                </h3>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors ${isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          }`}
                      >
                        <item.icon className="w-5 h-5 flex-shrink-0" />
                        <span className="font-medium">{item.name}</span>
                        {item.href === "/admin/message-center" && unreadCount > 0 && (
                          <span className="ml-auto min-w-5 h-5 px-1.5 rounded-full bg-red-500 text-white text-xs font-semibold flex items-center justify-center">
                            {unreadCount}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          <div className="p-4 border-t space-y-2">
            <DatabaseToggle />
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="w-full justify-start"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:ml-64 min-h-screen">
        {/* Top Navbar */}
        <header className="sticky top-0 z-20 bg-background border-b">
          <div className="flex items-center justify-between px-4 lg:px-8 h-14">
            {/* Left side - spacer for mobile menu button */}
            <div className="lg:hidden w-10" />

            {/* Right side - User info */}
            <div className="ml-auto flex items-center gap-2">
              <NotificationBell />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 h-auto py-1.5 px-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profile?.avatar_url} alt={profile?.full_name || user?.email} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {profile?.full_name
                          ? profile.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
                          : user?.email?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden sm:flex flex-col items-start text-left">
                      <span className="text-sm font-medium leading-none">
                        {profile?.full_name || user?.email?.split('@')[0] || 'User'}
                      </span>
                      <span className="text-xs text-muted-foreground leading-tight mt-0.5">
                        {userRoles.length > 0
                          ? userRoles.map(r => r.charAt(0).toUpperCase() + r.slice(1)).join(', ')
                          : 'No role'}
                      </span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground hidden sm:block" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{profile?.full_name || 'User'}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-xs text-muted-foreground" disabled>
                    <UserIcon className="h-4 w-4 mr-2" />
                    {userRoles.length > 0
                      ? userRoles.map(r => r.charAt(0).toUpperCase() + r.slice(1)).join(', ')
                      : 'No assigned role'}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

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
