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
const ForgotPassword = React.lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = React.lazy(() => import("./pages/ResetPassword"));
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
import { DashboardLayout } from "./components/dashboard/DashboardLayout";
import { AdminLayout } from "./components/admin/AdminLayout";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 menit - data dianggap fresh
      gcTime: 30 * 60 * 1000, // 30 menit - cache disimpan di memory
      refetchOnWindowFocus: false, // tidak refetch saat tab aktif kembali
      retry: 1, // hanya retry 1x jika gagal
    },
  },
});

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
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                {/* Candidate Routes with Persistent Layout */}
                <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                  <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
                  <Route path="/candidate/profile" element={<CandidateProfile />} />
                  <Route path="/candidate/applications" element={<CandidateApplications />} />
                  <Route path="/candidate/saved-jobs" element={<CandidateSavedJobs />} />
                  <Route path="/candidate/interview-schedule" element={<CandidateInterviewSchedule />} />
                  <Route path="/candidate/departure-schedule" element={<CandidateDepartureSchedule />} />
                  <Route path="/candidate/messages" element={<CandidateMessages />} />
                  <Route path="/candidate/testimonials" element={<CandidateTestimonials />} />
                  <Route path="/candidate/change-password" element={<CandidateChangePassword />} />
                </Route>
                <Route path="/candidate/cvs" element={<Navigate to="/candidate/profile" replace />} />

                {/* Admin Routes with Persistent Layout */}
                <Route element={<AdminRoute><AdminLayout /></AdminRoute>}>
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/users" element={<AdminUsers />} />
                  <Route path="/admin/jobs" element={<AdminJobs />} />
                  <Route path="/admin/applications" element={<AdminApplications />} />
                  <Route path="/admin/interviews" element={<AdminInterviews />} />
                  <Route path="/admin/departures" element={<AdminDepartures />} />
                  <Route path="/admin/messages" element={<AdminMessages />} />
                  <Route path="/admin/testimonials" element={<AdminTestimonials />} />
                  <Route path="/admin/role-permissions" element={<AdminRolePermissions />} />
                  <Route path="/admin/contact-submissions" element={<AdminContactSubmissions />} />
                  <Route path="/admin/message-center" element={<AdminMessageCenter />} />
                  <Route path="/admin/users/:userId/edit" element={<AdminEditProfile />} />

                  {/* Role-specific Dashboards that also use AdminLayout */}
                  <Route path="/hrd" element={<HRDDashboard />} />
                  <Route path="/pic" element={<PICDashboard />} />
                </Route>

                <Route path="/admin/setup" element={<AdminSetup />} />

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
