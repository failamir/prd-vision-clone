import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo-dark.png";
import { useUser } from "@/contexts/UserContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LayoutDashboard, User, LogOut, ChevronDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, profile } = useUser();

  const isLoggedIn = !!user;

  const isActive = (path: string) => location.pathname === path;
  const isActiveParent = (paths: string[]) => paths.includes(location.pathname);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src={logo}
              alt="Cipta Wira Tirta Logo"
              className="h-10 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={cn(
                "text-foreground hover:text-primary transition-colors border-b-2 py-1",
                isActive("/") ? "border-primary text-primary" : "border-transparent"
              )}
            >
              Home
            </Link>
            <Link
              to="/about"
              className={cn(
                "text-foreground hover:text-primary transition-colors border-b-2 py-1",
                isActive("/about") ? "border-primary text-primary" : "border-transparent"
              )}
            >
              About Us
            </Link>
            <div className="relative group">
              <button
                className={cn(
                  "text-foreground hover:text-primary transition-colors flex items-center space-x-1 py-2 border-b-2",
                  isActiveParent(["/insurance", "/manning-services"]) ? "border-primary text-primary" : "border-transparent"
                )}
              >
                <span>Our Services</span>
              </button>
              <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 absolute left-0 top-full pt-2 transition-all duration-200">
                <div className="w-48 bg-white dark:bg-background shadow-lg rounded-md border border-border py-2">
                  <Link
                    to="/insurance"
                    className={cn(
                      "block px-4 py-2 text-sm hover:bg-muted hover:text-primary",
                      isActive("/insurance") ? "text-primary bg-muted font-medium" : "text-foreground"
                    )}
                  >
                    Insurance
                  </Link>
                  <Link
                    to="/manning-services"
                    className={cn(
                      "block px-4 py-2 text-sm hover:bg-muted hover:text-primary",
                      isActive("/manning-services") ? "text-primary bg-muted font-medium" : "text-foreground"
                    )}
                  >
                    Manning Services
                  </Link>
                </div>
              </div>
            </div>
            <Link
              to="/safety"
              className={cn(
                "text-foreground hover:text-primary transition-colors border-b-2 py-1",
                isActive("/safety") ? "border-primary text-primary" : "border-transparent"
              )}
            >
              Safety & Quality
            </Link>
            <Link
              to="/contact"
              className={cn(
                "text-foreground hover:text-primary transition-colors border-b-2 py-1",
                isActive("/contact") ? "border-primary text-primary" : "border-transparent"
              )}
            >
              Contact
            </Link>
            <Link
              to="/jobs"
              className={cn(
                "text-foreground hover:text-primary transition-colors font-medium border-b-2 py-1",
                isActive("/jobs") ? "border-primary text-primary" : "border-transparent"
              )}
            >
              Jobs
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <DropdownMenu open={profileMenuOpen} onOpenChange={setProfileMenuOpen}>
                <div
                  onMouseEnter={() => setProfileMenuOpen(true)}
                  onMouseLeave={() => setProfileMenuOpen(false)}
                  className="flex items-center"
                >
                  <DropdownMenuTrigger asChild>
                    <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity p-1 rounded-md">
                      <div className="text-right flex flex-col items-end">
                        <span className="text-sm font-medium leading-none">{profile?.full_name || user?.email?.split('@')[0]}</span>
                        <span className="text-[10px] text-muted-foreground mt-0.5">Candidate</span>
                      </div>
                      <Avatar className="h-8 w-8 border border-border">
                        <AvatarImage src={profile?.avatar_url || ""} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          {profile?.full_name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <ChevronDown className={cn("h-3 w-3 text-muted-foreground transition-transform duration-200", profileMenuOpen && "rotate-180")} />
                    </div>
                  </DropdownMenuTrigger>
                </div>
                <DropdownMenuContent
                  align="end"
                  className="w-56"
                  onMouseEnter={() => setProfileMenuOpen(true)}
                  onMouseLeave={() => setProfileMenuOpen(false)}
                >
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/candidate/dashboard" className="flex items-center cursor-pointer">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/candidate/profile" className="flex items-center cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>My Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => supabase.auth.signOut()}
                    className="text-destructive focus:text-destructive cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="text-foreground">
                    Login
                  </Button>
                </Link>
                {/* <Link to="/register">
                    <Button className="bg-secondary hover:bg-secondary/90">
                      Register
                    </Button>
                  </Link> */}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300",
            mobileMenuOpen ? "max-h-96 pb-4" : "max-h-0"
          )}
        >
          <div className="flex flex-col space-y-3 pt-3">
            <Link to="/" className="text-foreground hover:text-primary transition-colors py-2">
              Home
            </Link>
            <Link to="/about" className="text-foreground hover:text-primary transition-colors py-2">
              About Us
            </Link>
            <div className="pt-1">
              <div className="text-foreground font-medium py-1">Our Services</div>
              <div className="pl-4 flex flex-col space-y-1">
                <Link to="/insurance" className="text-sm text-foreground hover:text-primary transition-colors py-1">
                  Insurance
                </Link>
                <Link to="/manning-services" className="text-sm text-foreground hover:text-primary transition-colors py-1">
                  Manning Services
                </Link>
              </div>
            </div>
            <Link to="/safety" className="text-foreground hover:text-primary transition-colors py-2">
              Safety & Quality
            </Link>
            <Link to="/contact" className="text-foreground hover:text-primary transition-colors py-2">
              Contact
            </Link>
            <Link to="/jobs" className="text-foreground hover:text-primary transition-colors py-2 font-medium">
              Jobs
            </Link>
            <div className="flex flex-col space-y-2 pt-2">
              {isLoggedIn ? (
                <Link to="/candidate/dashboard">
                  <Button variant="outline" className="w-full">
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="outline" className="w-full">
                      Login
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button className="w-full bg-secondary">
                      Register
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
