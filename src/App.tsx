import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DatabaseProvider } from "@/contexts/DatabaseContext";
import { UserProvider } from "@/contexts/UserContext";
import React, { Suspense } from "react";
import Index from "./pages/Index";

// Code Split route components
const Jobs = React.lazy(() => import("./pages/Jobs"));
const JobDetail = React.lazy(() => import("./pages/JobDetail"));
const Login = React.lazy(() => import("./pages/Login"));
const Register = React.lazy(() => import("./pages/Register"));
const CandidateDashboard = React.lazy(() => import("./pages/candidate/Dashboard"));
const CandidateProfile = React.lazy(() => import("./pages/candidate/Profile"));
const CandidateApplications = React.lazy(() => import("./pages/candidate/Applications"));
const CandidateSavedJobs = React.lazy(() => import("./pages/candidate/SavedJobs"));
const CandidateInterviewSchedule = React.lazy(() => import("./pages/candidate/InterviewSchedule"));
const CandidateDepartureSchedule = React.lazy(() => import("./pages/candidate/DepartureSchedule"));
const CandidateMessages = React.lazy(() => import("./pages/candidate/Messages"));
const CandidateTestimonials = React.lazy(() => import("./pages/candidate/Testimonials"));
const CandidateChangePassword = React.lazy(() => import("./pages/candidate/ChangePassword"));
const AdminDashboard = React.lazy(() => import("./pages/admin/Dashboard"));
const AdminUsers = React.lazy(() => import("./pages/admin/Users"));
const AdminJobs = React.lazy(() => import("./pages/admin/Jobs"));
const AdminApplications = React.lazy(() => import("./pages/admin/Applications"));
const AdminSetup = React.lazy(() => import("./pages/admin/Setup"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const RecruitmentProcedurePage = React.lazy(() => import("./pages/pages/RecruitmentProcedurePage"));
const AboutPage = React.lazy(() => import("./pages/pages/AboutPage"));
const ContactPage = React.lazy(() => import("./pages/pages/ContactPage"));
const SafetyPolicyPage = React.lazy(() => import("./pages/pages/SafetyPolicyPage"));
const ManningServicesPage = React.lazy(() => import("./pages/pages/ManningServicesPage"));
const InsurancePage = React.lazy(() => import("./pages/pages/InsurancePage"));
const AdminInterviews = React.lazy(() => import("./pages/admin/Interviews"));
const AdminDepartures = React.lazy(() => import("./pages/admin/Departures"));
const AdminMessages = React.lazy(() => import("./pages/admin/Messages"));
const AdminMessageCenter = React.lazy(() => import("./pages/admin/MessageCenter"));
const AdminTestimonials = React.lazy(() => import("./pages/admin/Testimonials"));
const AdminRolePermissions = React.lazy(() => import("./pages/admin/RolePermissions"));
const AdminContactSubmissions = React.lazy(() => import("./pages/admin/ContactSubmissions"));
const AdminEditProfile = React.lazy(() => import("./pages/admin/EditProfile"));
const TermsAndConditions = React.lazy(() => import("./pages/TermsAndConditions"));
const PrivacyPolicy = React.lazy(() => import("./pages/PrivacyPolicy"));
const HRDDashboard = React.lazy(() => import("./pages/hrd/Dashboard"));
const PICDashboard = React.lazy(() => import("./pages/pic/Dashboard"));

import ProtectedRoute from "./components/ProtectedRoute";
import { AdminRoute } from "./components/admin/AdminRoute";
import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <DatabaseProvider>
      <UserProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Suspense fallback={<div className="flex h-screen w-full items-center justify-center p-8 text-muted-foreground">Loading...</div>}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/safety" element={<SafetyPolicyPage />} />
                <Route path="/services" element={<ManningServicesPage />} />
                <Route path="/insurance" element={<InsurancePage />} />
                <Route path="/terms" element={<TermsAndConditions />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/manning-services" element={<ManningServicesPage />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/jobs/:id" element={<JobDetail />} />
                <Route path="/recruitment-procedure" element={<RecruitmentProcedurePage />} />
                <Route path="/redirect.php" element={<RecruitmentProcedurePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/candidate/dashboard" element={<ProtectedRoute><CandidateDashboard /></ProtectedRoute>} />
                <Route path="/candidate/profile" element={<ProtectedRoute><CandidateProfile /></ProtectedRoute>} />
                <Route path="/candidate/cvs" element={<Navigate to="/candidate/profile" replace />} />
                <Route path="/candidate/applications" element={<ProtectedRoute><CandidateApplications /></ProtectedRoute>} />
                <Route path="/candidate/saved-jobs" element={<ProtectedRoute><CandidateSavedJobs /></ProtectedRoute>} />
                <Route path="/candidate/interview-schedule" element={<ProtectedRoute><CandidateInterviewSchedule /></ProtectedRoute>} />
                <Route path="/candidate/departure-schedule" element={<ProtectedRoute><CandidateDepartureSchedule /></ProtectedRoute>} />
                <Route path="/candidate/messages" element={<ProtectedRoute><CandidateMessages /></ProtectedRoute>} />
                <Route path="/candidate/testimonials" element={<ProtectedRoute><CandidateTestimonials /></ProtectedRoute>} />
                <Route path="/candidate/change-password" element={<ProtectedRoute><CandidateChangePassword /></ProtectedRoute>} />

                {/* Admin Routes */}
                <Route path="/admin/setup" element={<AdminSetup />} />
                <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
                <Route path="/admin/jobs" element={<AdminRoute><AdminJobs /></AdminRoute>} />
                <Route path="/admin/applications" element={<AdminRoute><AdminApplications /></AdminRoute>} />
                <Route path="/admin/interviews" element={<AdminRoute><AdminInterviews /></AdminRoute>} />
                <Route path="/admin/departures" element={<AdminRoute><AdminDepartures /></AdminRoute>} />
                <Route path="/admin/messages" element={<AdminRoute><AdminMessages /></AdminRoute>} />
                <Route path="/admin/testimonials" element={<AdminRoute><AdminTestimonials /></AdminRoute>} />
                <Route path="/admin/role-permissions" element={<AdminRoute><AdminRolePermissions /></AdminRoute>} />
                <Route path="/admin/contact-submissions" element={<AdminRoute><AdminContactSubmissions /></AdminRoute>} />
                <Route path="/admin/message-center" element={<AdminRoute><AdminMessageCenter /></AdminRoute>} />
                <Route path="/admin/users/:userId/edit" element={<AdminRoute><AdminEditProfile /></AdminRoute>} />

                {/* Role-specific Dashboards */}
                <Route path="/hrd" element={<AdminRoute><HRDDashboard /></AdminRoute>} />
                <Route path="/pic" element={<AdminRoute><PICDashboard /></AdminRoute>} />

                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </UserProvider>
    </DatabaseProvider>
  </QueryClientProvider>
);

export default App;
