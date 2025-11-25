import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-ocean-light to-ocean-blue rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">CWT</span>
            </div>
            <div className="hidden sm:block">
              <div className="font-bold text-foreground">Cipta Wira Tirta</div>
              <div className="text-xs text-muted-foreground">PT. Cipta Wira Tirta</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/about" className="text-foreground hover:text-primary transition-colors">
              About Us
            </Link>
            <div className="relative group">
              <button className="text-foreground hover:text-primary transition-colors flex items-center space-x-1">
                <span>Our Services</span>
              </button>
              <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 absolute left-0 mt-3 w-48 bg-white dark:bg-background shadow-lg rounded-md border border-border py-2 transition-opacity">
                <Link
                  to="/insurance"
                  className="block px-4 py-2 text-sm text-foreground hover:bg-muted hover:text-primary"
                >
                  Insurance
                </Link>
                <Link
                  to="/manning-services"
                  className="block px-4 py-2 text-sm text-foreground hover:bg-muted hover:text-primary"
                >
                  Manning Services
                </Link>
              </div>
            </div>
            <Link to="/safety" className="text-foreground hover:text-primary transition-colors">
              Safety & Quality
            </Link>
            <Link to="/contact" className="text-foreground hover:text-primary transition-colors">
              Contact
            </Link>
            <Link to="/jobs" className="text-foreground hover:text-primary transition-colors font-medium">
              Jobs
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/login">
              <Button variant="ghost" className="text-foreground">
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button className="bg-secondary hover:bg-secondary/90">
                Register
              </Button>
            </Link>
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
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
