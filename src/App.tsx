import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Jobs from "./pages/Jobs";
import JobDetail from "./pages/JobDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CandidateDashboard from "./pages/candidate/Dashboard";
import CandidateProfile from "./pages/candidate/Profile";
import CandidateCVs from "./pages/candidate/CVs";
import CandidateApplications from "./pages/candidate/Applications";
import CandidateSavedJobs from "./pages/candidate/SavedJobs";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminJobs from "./pages/admin/Jobs";
import AdminApplications from "./pages/admin/Applications";
import AdminSetup from "./pages/admin/Setup";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import { AdminRoute } from "./components/admin/AdminRoute";
import AboutPage from "./pages/pages/AboutPage";
import ContactPage from "./pages/pages/ContactPage";
import SafetyPolicyPage from "./pages/pages/SafetyPolicyPage";
import ManningServicesPage from "./pages/pages/ManningServicesPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/safety" element={<SafetyPolicyPage />} />
          <Route path="/services" element={<ManningServicesPage />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/candidate/dashboard" element={<ProtectedRoute><CandidateDashboard /></ProtectedRoute>} />
          <Route path="/candidate/profile" element={<ProtectedRoute><CandidateProfile /></ProtectedRoute>} />
          <Route path="/candidate/cvs" element={<ProtectedRoute><CandidateCVs /></ProtectedRoute>} />
          <Route path="/candidate/applications" element={<ProtectedRoute><CandidateApplications /></ProtectedRoute>} />
          <Route path="/candidate/saved-jobs" element={<ProtectedRoute><CandidateSavedJobs /></ProtectedRoute>} />
          
          {/* Admin Routes */}
          <Route path="/admin/setup" element={<AdminSetup />} />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
          <Route path="/admin/jobs" element={<AdminRoute><AdminJobs /></AdminRoute>} />
          <Route path="/admin/applications" element={<AdminRoute><AdminApplications /></AdminRoute>} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
