# Project Timeline - PRD Vision Clone (12 Weeks)

Based on the [Product Requirement Document (PRD)](./PRD.md) and the current state of the codebase, the following 3-month (12-week) timeline outlines the development, testing, and deployment phases.

## Phase 1: Foundation & Core Users (Month 1)

**Goal:** Establish a solid backend, secure authentication, and robust profile management for all user roles.

### Week 1: Environment & Database Setup
-   [x] Finalize Supabase Database Schema (Users, Roles, Jobs, Applications).
-   [x] Configure Row Level Security (RLS) policies for strict data segregation.
-   [x] Setup Project Repository and CI/CD pipelines (if applicable).
-   [x] Implement Audit Logging triggers in Database.

### Week 2: Authentication & Role Management
-   [x] Implement Secure Login/Register with Email Verification.
-   [x] **Feature:** Role-Based Access Control (RBAC) middleware.
-   [x] **Feature:** `RolePermissions` module for Admin to manage access.
-   [x] **Feature:** Password Reset & "Change Password" functionality for all users.

### Week 3: Candidate Profile Management
-   [x] **Feature:** Candidate Dashboard (Basic View).
-   [x] **Feature:** Complete Profile Editing (Personal Data, Experience, Education).
-   [x] **Feature:** CV/Resume Upload & Parsing (if applicable).
-   [x] **Feature:** "Saved Jobs" functionality.

### Week 4: Admin User Management
-   [x] **Feature:** Admin Dashboard (Stats Overview).
-   [x] **Feature:** User List & Management (Create/Edit/Deactivate Users).
-   [x] **Refactor:** Implement `useDashboardData` hook for optimized data fetching.
-   [ ] **Refactor:** Standardize API/Supabase calls across Admin pages.

---

## Phase 2: Recruitment Core Operations (Month 2)

**Goal:** Enable the end-to-end recruitment flow, from job posting to application management.

### Week 5: Job Management System
-   [x] **Feature:** Job Posting (Create/Edit/Delete) with rich text descriptions.
-   [x] **Feature:** Job Search & Filters (Public View).
-   [x] **Feature:** Job Details Page (Public & Admin View).
-   [ ] **Improvement:** Implement "Offices" dynamic configuration.

### Week 6: Application Flow
-   [x] **Feature:** User Application Submission Process.
-   [x] **Feature:** Application Tracking System (ATS) status updates.
-   [x] **Feature:** Real-time Notifications for Status Changes (Email/In-App).

### Week 7: Role-Specific Dashboards (Refactoring & Implementation)
-   [ ] **Refactor:** Extract common components (`StatsCard`, `DashboardCharts`) from HRD/PIC dashboards.
-   [x] **Feature:** HRD Dashboard (Advanced Metrics & Recruitment Focus).
-   [x] **Feature:** PIC Dashboard (Office-specific Data & Operational Focus).

### Week 8: Interview Management
-   [x] **Feature:** Schedule Interview Interface for Admin/HRD.
-   [x] **Feature:** Candidate Interview Schedule View (Accept/Decline options).
-   [ ] **Feature:** Interviewer Feedback Form (if applicable).
-   [ ] Integration with Calendar (Google Calendar/Outlook - Optional/Bonus).

---

## Phase 3: Advanced Features & Launch (Month 3)

**Goal:** Complete the lifecycle with departures, communication tools, and rigorous testing for launch.

### Week 9: Departure & Logistics
-   [x] **Feature:** Departure Management Module (Dates, Flights, Documents).
-   [x] **Feature:** Candidate Departure Schedule View.
-   [ ] **Feature:** Digital Document Management for Departures.

### Week 10: Communication & Content
-   [x] **Feature:** Message Center (Internal Chat/Messaging System).
-   [x] **Feature:** Contact Submissions Box for Admin.
-   [x] **Feature:** Testimonials Management (Admin) & Display (Public).
-   [x] **Content:** Finalize static pages (About, Safety, Services).

### Week 11: Testing & Optimization
-   [ ] **Testing:** End-to-End (E2E) Testing of critical flows (Apply -> Hire).
-   [ ] **Testing:** Security Audit (RLS Policy check, Input Validation).
-   [ ] **Optimization:** Code splitting, Image optimization, Query performance tuning.
-   [ ] **Mobile Responsiveness:** Polish UI for mobile devices.

### Week 12: Deployment & Handover
-   [ ] **Deployment:** Staging Environment Release & User Acceptance Testing (UAT).
-   [ ] **Fixes:** Address UAT feedback and bugs.
-   [ ] **Deployment:** Production Release.
-   [ ] **Documentation:** User Manuals (Admin/HRD) & Technical Documentation.
-   [ ] **Handover:** Final Project Handover to Client.
