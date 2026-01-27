# Application Flow - Manning Services

## Overview

Aplikasi Manning Services adalah sistem rekrutmen kru kapal pesiar yang menghubungkan kandidat dengan perusahaan pelayaran. Dibangun dengan React + Vite + TypeScript dan menggunakan Lovable Cloud (Supabase) untuk backend.

---

## Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND                                    │
├─────────────────┬───────────────────┬───────────────────────────────────┤
│   Public Pages  │  Candidate Portal │         Admin Portal              │
│   - Home (/)    │  - Dashboard      │   - Dashboard (/admin)            │
│   - Jobs        │  - Profile        │   - Users, Jobs, Applications     │
│   - About       │  - Applications   │   - Interviews, Departures        │
│   - Contact     │  - Messages       │   - Messages, Testimonials        │
│   - Services    │  - Interview      │   - Role Permissions              │
│   - Login       │  - Departures     │   - Contact Submissions           │
│   - Register    │  - Testimonials   ├───────────────────────────────────┤
│                 │                   │   HRD Dashboard (/hrd)            │
│                 │                   │   - Candidate Management          │
│                 │                   │   - Departure Tracking            │
│                 │                   │   - Office Filter                 │
│                 │                   ├───────────────────────────────────┤
│                 │                   │   PIC Dashboard (/pic)            │
│                 │                   │   - Regional Operations           │
│                 │                   │   - Recruitment Charts            │
│                 │                   │   - City Filter                   │
└─────────────────┴───────────────────┴───────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         LOVABLE CLOUD (Backend)                          │
├─────────────────┬───────────────────┬───────────────────────────────────┤
│  Authentication │     Database      │         Edge Functions            │
│  - Email/Pass   │  - user_roles     │   - send-otp                      │
│  - OTP Verify   │  - candidate_*    │   - verify-otp                    │
│  - Session Mgmt │  - jobs           │   - create-user                   │
│                 │  - applications   │   - create-pic-accounts           │
│                 │  - messages       │   - reset-staff-passwords         │
│                 │  - testimonials   │   - get-all-users                 │
└─────────────────┴───────────────────┴───────────────────────────────────┘
```

---

## Alur Kandidat

### 1. Registrasi (OTP-Based)

```
┌──────────┐     ┌───────────┐     ┌───────────┐     ┌──────────────┐
│  Start   │────▶│  Form     │────▶│  Send OTP │────▶│  Verify OTP  │
│          │     │  Register │     │  (Email)  │     │  (6-digit)   │
└──────────┘     └───────────┘     └───────────┘     └──────────────┘
                                                            │
                      ┌─────────────────────────────────────┘
                      ▼
               ┌──────────────┐     ┌───────────────┐
               │  Create User │────▶│ Auto-create   │
               │  (Supabase)  │     │ Profile       │
               └──────────────┘     └───────────────┘
```

**Validasi Registrasi:**
- Email unik (tidak ada di database)
- Phone unik dengan format Indonesia (+62)
- OTP valid dan belum expired (10 menit)

### 2. Profile Completion (3 Steps)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          PROFILE STEPS                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────┐     ┌─────────────────┐     ┌──────────────────┐       │
│  │   STEP 1    │     │     STEP 2      │     │      STEP 3      │       │
│  │  Personal   │     │  Pre-Screening  │     │    Screening     │       │
│  │   & CV      │     │  Medical Tests  │     │   References     │       │
│  └──────┬──────┘     └────────┬────────┘     └────────┬─────────┘       │
│         │                     │                       │                  │
│  Default│              Unlocked by            Auto-unlocked             │
│  Access │              Admin when             after saving              │
│         │              "Suitable"             Step 2 data               │
│         ▼                     ▼                       ▼                  │
│  - Full Name          - Medical Tests         - Emergency Contacts      │
│  - Phone, DOB         - BMI Data              - Next of Kin             │
│  - Gender, Address    - Height/Weight         - References              │
│  - CV Upload (*)      - Vaccinations          - Additional Docs         │
│  - Form Letter (*)                                                      │
│                                                                          │
│  (*) = Required                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

**Step Unlock Logic:**
1. **Step 1 → Step 2**: Admin sets `suitable = 'Yes'` → auto-updates `profile_step_unlocked = 2`
2. **Step 2 → Step 3**: Kandidat saves Step 2 data → auto-updates `profile_step_unlocked = 3`

### 3. Job Application Flow

```
┌──────────┐     ┌───────────┐     ┌─────────────┐     ┌────────────────┐
│  Browse  │────▶│ View Job  │────▶│   Apply     │────▶│  Application   │
│   Jobs   │     │  Details  │     │  (Dialog)   │     │   Submitted    │
└──────────┘     └───────────┘     └─────────────┘     └────────────────┘
      │                │                                       │
      │                ▼                                       ▼
      │         ┌───────────┐                          ┌──────────────┐
      │         │ Save Job  │                          │   Status:    │
      │         │ (Wishlist)│                          │   Pending    │
      │         └───────────┘                          └──────────────┘
      │
      └─── Filter: Position, Location, Principal
```

**Minimal Requirements untuk Apply:**
- `full_name` (dari profil)
- `phone` (dari profil)
- Tidak wajib upload CV/Form Letter di awal (bisa dilengkapi kemudian)

---

## Alur Admin/Staff

### 1. Review Application

```
┌───────────────┐     ┌─────────────┐     ┌───────────────────────────┐
│  View New     │────▶│   Review    │────▶│  Update Status            │
│  Applications │     │   Details   │     │  - Suitable: Yes/No       │
└───────────────┘     └─────────────┘     │  - Remarks: Step 1/2/3    │
                            │             └───────────────────────────┘
                            ▼
                      ┌───────────┐
                      │ View Full │
                      │  Profile  │
                      │  (Modal)  │
                      └───────────┘
```

### 2. Interview Scheduling

```
┌───────────────┐     ┌─────────────────┐     ┌──────────────────────┐
│  Select       │────▶│  Set Interview  │────▶│  Update Result       │
│  Candidate    │     │  Date & By      │     │  - Pass/Fail         │
└───────────────┘     └─────────────────┘     │  - Notes             │
                                              └──────────────────────┘
                                                        │
                      ┌─────────────────────────────────┘
                      ▼
               ┌──────────────────────┐
               │  Principal Interview │
               │  (if applicable)     │
               └──────────────────────┘
```

### 3. Departure Management

```
┌───────────────┐     ┌─────────────────┐     ┌──────────────────────┐
│  Approved     │────▶│  Employment     │────▶│  Schedule            │
│  Candidates   │     │  Offer (EO)     │     │  Departure           │
└───────────────┘     └─────────────────┘     └──────────────────────┘
```

---

## Role-Based Access Control

### Roles Hierarchy

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           USER ROLES                                     │
├─────────────┬─────────────┬─────────────┬─────────────┬─────────────────┤
│ SUPERADMIN  │    ADMIN    │   DIREKTUR  │   MANAGER   │      HRD        │
│ (Full)      │ (Full)      │ (Executive) │ (Oversight) │  (HR Tasks)     │
├─────────────┼─────────────┼─────────────┼─────────────┼─────────────────┤
│     PIC     │    STAFF    │ INTERVIEWER │ INT_PRINCIPAL│   CANDIDATE    │
│ (Regional)  │  (Basic)    │ (Interview) │ (Senior Int.)│  (Applicant)   │
└─────────────┴─────────────┴─────────────┴─────────────┴─────────────────┘
```

### Login Redirect Logic

```typescript
// src/pages/Login.tsx
const redirectBasedOnRole = (role: string) => {
  if (role === 'candidate') {
    navigate("/candidate/dashboard");
  } else if (role === 'hrd') {
    navigate("/hrd");
  } else if (role === 'pic') {
    navigate("/pic");
  } else if (adminRoles.includes(role)) {
    navigate("/admin");
  }
};
```

### Protected Routes

| Route Pattern | Wrapper | Allowed Roles |
|--------------|---------|---------------|
| `/candidate/*` | `ProtectedRoute` | candidate (redirects admin to /admin) |
| `/admin/*` | `AdminRoute` | admin, superadmin, manager, staff, interviewer, etc. |
| `/hrd` | `AdminRoute` | hrd (+ all admin roles) |
| `/pic` | `AdminRoute` | pic (+ all admin roles) |

### Permissions per Role

| Permission | Superadmin | Admin | Direktur | Manager | HRD | PIC | Staff | Interviewer |
|------------|:----------:|:-----:|:--------:|:-------:|:---:|:---:|:-----:|:-----------:|
| view_applications | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| manage_applications | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | - |
| view_interviews | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| manage_interviews | ✓ | ✓ | ✓ | ✓ | ✓ | - | - | ✓ |
| view_users | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | - | - |
| manage_users | ✓ | ✓ | - | - | - | - | - | - |
| view_jobs | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| manage_jobs | ✓ | ✓ | ✓ | ✓ | - | - | - | - |
| view_departures | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | - |
| manage_departures | ✓ | ✓ | ✓ | ✓ | ✓ | - | - | - |
| view_reports | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | - | - |

---

## Database Schema (Core Tables)

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   auth.users     │     │   user_roles     │     │ candidate_profiles│
│ ─────────────────│     │ ─────────────────│     │ ─────────────────│
│ id (uuid)        │◄────│ user_id          │     │ id (uuid)        │
│ email            │     │ role (app_role)  │     │ user_id ─────────┼──┐
│                  │     │                  │     │ full_name        │  │
└──────────────────┘     └──────────────────┘     │ email, phone     │  │
                                                   │ profile_step_*   │  │
                                                   └──────────────────┘  │
                                                                         │
┌──────────────────┐     ┌──────────────────┐                           │
│      jobs        │     │ job_applications │                           │
│ ─────────────────│     │ ─────────────────│                           │
│ id (uuid)        │◄────│ job_id           │                           │
│ title, company   │     │ candidate_id ────┼───────────────────────────┘
│ department       │     │ status           │
│ principal        │     │ interview_date   │
│                  │     │ suitable         │
└──────────────────┘     │ remarks          │
                         └──────────────────┘
```

---

## Edge Functions

| Function | Tujuan |
|----------|--------|
| `send-otp` | Kirim kode OTP ke email (via Resend) |
| `verify-otp` | Verifikasi kode OTP |
| `create-user` | Buat user dengan role (Admin API) |
| `create-pic-accounts` | Batch create PIC accounts |
| `reset-staff-passwords` | Reset password staff ke default |
| `get-all-users` | Ambil semua users (Admin only) |

---

## Key Files

| File | Fungsi |
|------|--------|
| `src/App.tsx` | Route definitions |
| `src/pages/Login.tsx` | Login + role redirect |
| `src/components/ProtectedRoute.tsx` | Candidate route guard |
| `src/components/admin/AdminRoute.tsx` | Admin route guard |
| `src/pages/candidate/Profile.tsx` | 3-step profile form |
| `src/pages/admin/Applications.tsx` | Application management |
| `src/pages/hrd/Dashboard.tsx` | HRD dashboard |
| `src/pages/pic/Dashboard.tsx` | PIC dashboard |
| `src/contexts/UserContext.tsx` | User state management |
| `src/contexts/DatabaseContext.tsx` | Database client context |
