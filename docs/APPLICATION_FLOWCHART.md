# Application Flowchart

## Overview
Aplikasi ini adalah sistem rekrutmen kru kapal pesiar (Manning Services) yang menghubungkan kandidat dengan perusahaan pelayaran.

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                         │
├─────────────────────────────────────────────────────────────────┤
│  Public Pages    │   Candidate Portal   │    Admin Portal       │
│  - Home          │   - Dashboard        │    - Dashboard        │
│  - Jobs          │   - Profile          │    - Users            │
│  - About         │   - Applications     │    - Jobs             │
│  - Contact       │   - Messages         │    - Applications     │
│  - Services      │   - Interview        │    - Interviews       │
│  - Login/Signup  │   - Departures       │    - Departures       │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SUPABASE BACKEND                              │
├─────────────────────────────────────────────────────────────────┤
│  Authentication  │   Database (PostgreSQL)  │   Edge Functions  │
│  - Email/Pass    │   - Users & Roles        │   - create-user   │
│  - Session Mgmt  │   - Candidates           │   - create-pic    │
│                  │   - Jobs & Applications  │                   │
│                  │   - Messages             │                   │
└─────────────────────────────────────────────────────────────────┘
```

## Main User Flows

### 1. Candidate Registration Flow

```
┌─────────┐     ┌──────────┐     ┌───────────────┐     ┌──────────────┐
│  Start  │────▶│ Register │────▶│ Create Profile│────▶│   Complete   │
└─────────┘     │   Form   │     │  (Auto-created)│     │   Profile    │
                └──────────┘     └───────────────┘     └──────────────┘
                                                              │
                     ┌────────────────────────────────────────┘
                     ▼
┌─────────────┐     ┌──────────────┐     ┌────────────────┐
│ Add Documents│────▶│ Add Experience│────▶│ Add Certificates│
└─────────────┘     └──────────────┘     └────────────────┘
                                                  │
                     ┌────────────────────────────┘
                     ▼
              ┌──────────────┐
              │ Profile Ready│
              │  to Apply    │
              └──────────────┘
```

### 2. Job Application Flow

```
┌─────────┐     ┌───────────┐     ┌─────────────┐     ┌────────────┐
│ Browse  │────▶│ View Job  │────▶│   Apply     │────▶│ Application│
│  Jobs   │     │  Details  │     │  (with CV)  │     │  Submitted │
└─────────┘     └───────────┘     └─────────────┘     └────────────┘
                     │                                       │
                     ▼                                       ▼
              ┌───────────┐                          ┌─────────────┐
              │ Save Job  │                          │   Wait for  │
              │ (optional)│                          │   Review    │
              └───────────┘                          └─────────────┘
```

### 3. Application Review Flow (Admin)

```
┌──────────────┐     ┌─────────────┐     ┌───────────────┐
│  View New    │────▶│  Review     │────▶│  Schedule     │
│ Applications │     │  Details    │     │  Interview    │
└──────────────┘     └─────────────┘     └───────────────┘
                                                │
                     ┌──────────────────────────┘
                     ▼
┌───────────────┐     ┌─────────────────┐     ┌────────────────┐
│   Conduct     │────▶│  Update Status  │────▶│   Schedule     │
│  Interview    │     │  (Pass/Fail)    │     │   Departure    │
└───────────────┘     └─────────────────┘     └────────────────┘
```

### 4. Authentication Flow

```
┌─────────┐     ┌─────────┐     ┌─────────────┐     ┌──────────────┐
│  Login  │────▶│  Auth   │────▶│  Get User   │────▶│   Redirect   │
│  Page   │     │ Supabase│     │   Roles     │     │  by Role     │
└─────────┘     └─────────┘     └─────────────┘     └──────────────┘
                                                           │
                     ┌─────────────────────────────────────┤
                     │                                     │
                     ▼                                     ▼
              ┌──────────────┐                    ┌────────────────┐
              │   Candidate  │                    │     Admin      │
              │   Dashboard  │                    │   Dashboard    │
              └──────────────┘                    └────────────────┘
```

### 5. Message Flow

```
┌──────────────┐     ┌─────────────┐     ┌───────────────┐
│  Compose     │────▶│   Send to   │────▶│  Recipient    │
│   Message    │     │   Database  │     │  Notification │
└──────────────┘     └─────────────┘     └───────────────┘
                                                │
                     ┌──────────────────────────┘
                     ▼
              ┌──────────────┐     ┌─────────────┐
              │    Reply     │────▶│   Thread    │
              │   Message    │     │  Updated    │
              └──────────────┘     └─────────────┘
```

## Role-Based Access

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER ROLES                               │
├────────────┬────────────┬────────────┬─────────────┬────────────┤
│ Superadmin │   Admin    │    HRD     │   Manager   │    PIC     │
│ (Full)     │ (Full)     │ (HR Tasks) │ (Oversight) │ (Regional) │
├────────────┼────────────┼────────────┼─────────────┼────────────┤
│ Direktur   │   Staff    │Interviewer │ Int.Principal│ Candidate │
│ (Executive)│ (Basic)    │ (Interview)│ (Senior Int.)│ (Applicant)│
└────────────┴────────────┴────────────┴─────────────┴────────────┘
```
