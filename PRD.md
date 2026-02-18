# Product Requirement Document (PRD) - PRD Vision Clone

## 1. Introduction
**Project Name:** PRD Vision Clone
**Overview:** A comprehensive Job Recruitment and Manning Agency Application Portal. The platform facilitates the connection between candidates and employers (manning agencies), managing the entire recruitment lifecycle from job posting to deployment (departure).
**Goal:** To provide a seamless, digital experience for candidates to apply for jobs and manage their profiles, while empowering administrators and HR staff to efficiently manage applications, interviews, and deployments.

## 2. Technology Stack
- **Frontend Framework:** React (Vite)
- **Language:** TypeScript
- **Styling:** Tailwind CSS, shadcn/ui
- **State Management:** React Context (UserProvider, DatabaseProvider), React Query (Tanstack Query)
- **Routing:** React Router DOM
- **Backend/Database:** Supabase (inferred from `supabase` folder and `DatabaseContext`)
- **Icons:** Lucide React
- **Form Handling:** React Hook Form + Zod
- **Utilities:** date-fns, xlsx

## 3. User Roles
The system supports multiple user roles with distinct permissions:
1.  **Guest:** Can view public pages, search jobs, register, and login.
2.  **Candidate:** Registered users seeking employment.
3.  **Admin:** System administrators with full control.
4.  **HRD (Human Resources Department):** Manages recruitment processes (likely subset of Admin).
5.  **PIC (Person In Charge):** Client or Department representatives (limited dashboard).
6.  **Interviewer:** (Implied by directory structure) Likely focused on interview management.
7.  **Manager:** (Implied by directory structure) Oversight role.
8.  **Staff:** (Implied by directory structure) General operational support.

## 4. Feature Requirements

### 4.1 Public Features
- **Landing Page:** Overview of services and latest jobs.
- **Content Pages:** About Us, Contact, Safety Policy, Manning Services, Insurance, Recruitment Procedure.
- **Job Board:**
    - List available job openings.
    - Filter/Search jobs.
    - View Job Details (requirements, description).
- **Authentication:**
    - Login (Email/Password).
    - Register (Candidate registration).

### 4.2 Candidate Features (Protected)
- **Dashboard:** Overview of application status, upcoming interviews, and notifications.
- **Profile Management:**
    - Create/Edit CV/Resume data.
    - Manage personal details, experience, certifications.
- **Job Applications:**
    - Track status of applied jobs (Applied, Screening, Interview, Offered, Rejected).
    - View application history.
- **Saved Jobs:** Bookmark jobs for later.
- **Interview Schedule:** View upcoming interview details (Date, Time, Link/Location).
- **Departure Schedule:** View deployment/departure details.
- **Messages:** Internal messaging system to communicate with Recruiters/Admin.
- **Account Settings:** Change password.

### 4.3 Admin Features (Protected)
- **Dashboard:** Key metrics (Total Candidates, Active Jobs, Pending Applications).
- **User Management:**
    - View list of all users.
    - Edit user profiles.
    - Manage roles and permissions (`RolePermissions`).
- **Job Management:**
    - Create, Edit, Delete Job Postings.
    - Manage job details/requirements.
- **Application Management:**
    - View all applications.
    - Update application status (Screening -> Interview -> Hired).
- **Interview Management:**
    - Schedule interviews.
    - Assign interviewers.
- **Departure Management:**
    - Manage departure dates and logistics for hired candidates.
- **Communication:**
    - **Message Center:** Central hub for all messages.
    - **Contact Submissions:** View inquiries from the public contact form.
- **Content Management:**
    - **Testimonials:** Manage candidate testimonials.
- **System Setup:** System configuration and settings.

### 4.4 HRD & PIC Features
- **HRD Dashboard:** Specialized view for HR processes (specifics TBD based on implementation).
- **PIC Dashboard:** Specialized view for client/dept representatives.

## 5. Information Architecture & Routing

### Public Routes
- `/` (Home)
- `/jobs`, `/jobs/:id`
- `/about`, `/contact`, `/safety`, `/services`, `/insurance`
- `/recruitment-procedure`
- `/login`, `/register`
- `/terms`, `/privacy`

### Candidate Routes (`/candidate/*`)
- `/dashboard`
- `/profile`
- `/applications`
- `/saved-jobs`
- `/interview-schedule`
- `/departure-schedule`
- `/messages`
- `/testimonials`
- `/change-password`

### Admin Routes (`/admin/*`)
- `/` (Dashboard)
- `/users`, `/users/:userId/edit`
- `/jobs`
- `/applications`
- `/interviews`
- `/departures`
- `/messages`, `/message-center`
- `/testimonials`
- `/role-permissions`
- `/contact-submissions`
- `/setup`

### Other Routes
- `/hrd` (Dashboard)
- `/pic` (Dashboard)

## 6. Proposed Improvements
Based on the analysis of the current codebase (`src/pages/admin`, `src/pages/hrd`, `src/pages/pic`), the following improvements are recommended to enhance maintainability, scalability, and code quality:

### 6.1 Architecture & Code Quality
-   **Refactor Dashboards:** `HRDDashboard` and `PICDashboard` share 90% of their logic and UI. Extract common components:
    -   `StatsCard`: For displaying individual metrics.
    -   `RecentActivityList`: For displaying lists of applications/candidates.
    -   `DashboardCharts`: Reusable Recharts components.
-   **Custom Hooks:** Create `useDashboardData(role, officeFilter)` to centralize Supabase queries. This removes complex data fetching logic from the UI components.
-   **Centralize Types:** Move interfaces like `DashboardStats`, `Application`, and `Candidate` to a dedicated `src/types` folder to ensure consistency across Admin, HRD, and PIC views.
-   **Dynamic Configuration:** The `offices` list is currently hardcoded in multiple files. Move this to a database table (`public.offices`) or a central configuration file/constant.

### 6.2 Feature Enhancements
-   **Admin Dashboard Upgrade:** The current `AdminDashboard` is simpler than the HRD/PIC versions. It should be upgraded to include the same rich visualizations (Charts, Trends) that are available in the specific role dashboards.
-   **Role-Based Access Control (RBAC):** Ensure that the `DatabaseProvider` and RLS (Row Level Security) policies strictly enforce data segregation so that a PIC from "Jakarta" *physically cannot* fetch data from "Surabaya", rather than just filtering it on the client side.
-   **Unified Layout:** Ensure that `AdminLayout` supports distinct sidebar navigation menus for different roles if they share the same layout wrapper.
