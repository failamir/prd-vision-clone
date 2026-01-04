# Technical Specifications

## Technology Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | ^18.3.1 | UI Framework |
| TypeScript | - | Type Safety |
| Vite | - | Build Tool |
| Tailwind CSS | - | Styling |
| shadcn/ui | - | UI Components |
| React Router | ^6.30.1 | Routing |
| TanStack Query | ^5.83.0 | Data Fetching |
| React Hook Form | ^7.61.1 | Form Management |
| Zod | ^3.25.76 | Validation |
| Recharts | ^2.15.4 | Charts |
| Lucide React | ^0.462.0 | Icons |
| date-fns | ^3.6.0 | Date Utilities |
| xlsx | ^0.18.5 | Excel Export/Import |
| Framer Motion | - | Animations |

### Backend (Supabase/Lovable Cloud)
| Service | Purpose |
|---------|---------|
| PostgreSQL | Database |
| Supabase Auth | Authentication |
| Supabase Storage | File Storage |
| Edge Functions | Serverless Functions |
| Row Level Security | Data Protection |

## Project Structure

```
src/
├── assets/                 # Static assets (images, logos)
├── components/
│   ├── admin/             # Admin-specific components
│   │   ├── AdminLayout.tsx
│   │   ├── AdminRoute.tsx
│   │   ├── CreateUserDialog.tsx
│   │   ├── RoleManagementDialog.tsx
│   │   └── RolePermissionsDialog.tsx
│   ├── candidate/         # Candidate-specific components
│   │   └── ApplicationStatusDialog.tsx
│   ├── dashboard/         # Dashboard components
│   │   └── DashboardLayout.tsx
│   ├── jobs/              # Job-related components
│   │   └── ApplicationDialog.tsx
│   ├── messaging/         # Messaging components
│   │   └── MessageList.tsx
│   ├── ui/                # shadcn/ui components
│   ├── DatabaseToggle.tsx
│   ├── FadeIn.tsx
│   ├── Footer.tsx
│   ├── Navbar.tsx
│   ├── NavLink.tsx
│   ├── ProtectedRoute.tsx
│   ├── ScrollToTop.tsx
│   └── TestimonialsSection.tsx
├── contexts/
│   ├── DatabaseContext.tsx  # Database switching context
│   └── UserContext.tsx      # User authentication context
├── hooks/
│   ├── use-mobile.tsx
│   └── use-toast.ts
├── integrations/
│   └── supabase/
│       ├── client.ts       # Supabase client (auto-generated)
│       └── types.ts        # Database types (auto-generated)
├── lib/
│   └── utils.ts            # Utility functions
├── pages/
│   ├── admin/              # Admin pages
│   │   ├── Applications.tsx
│   │   ├── ContactSubmissions.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Departures.tsx
│   │   ├── Interviews.tsx
│   │   ├── Jobs.tsx
│   │   ├── MessageCenter.tsx
│   │   ├── Messages.tsx
│   │   ├── RolePermissions.tsx
│   │   ├── Setup.tsx
│   │   ├── Testimonials.tsx
│   │   └── Users.tsx
│   ├── candidate/          # Candidate pages
│   │   ├── Applications.tsx
│   │   ├── ChangePassword.tsx
│   │   ├── Dashboard.tsx
│   │   ├── DepartureSchedule.tsx
│   │   ├── InterviewSchedule.tsx
│   │   ├── Messages.tsx
│   │   ├── Profile.tsx
│   │   ├── SavedJobs.tsx
│   │   └── Testimonials.tsx
│   ├── pages/              # Public pages
│   │   ├── AboutPage.tsx
│   │   ├── ContactPage.tsx
│   │   ├── InsurancePage.tsx
│   │   ├── ManningServicesPage.tsx
│   │   ├── RecruitmentProcedurePage.tsx
│   │   └── SafetyPolicyPage.tsx
│   ├── Index.tsx           # Homepage
│   ├── Jobs.tsx            # Job listings
│   ├── JobDetail.tsx       # Job detail page
│   ├── Login.tsx           # Login page
│   ├── Register.tsx        # Registration page
│   ├── NotFound.tsx        # 404 page
│   ├── PrivacyPolicy.tsx
│   └── TermsAndConditions.tsx
├── App.tsx                 # Main app component
├── main.tsx               # Entry point
└── index.css              # Global styles

supabase/
└── functions/
    ├── create-user/        # Create user edge function
    │   └── index.ts
    └── create-pic-accounts/# Create PIC accounts edge function
        └── index.ts

docs/                       # Documentation
├── APPLICATION_FLOWCHART.md
├── DATA_FLOW_DIAGRAM.md
├── USER_STORIES.md
├── DATABASE_SCHEMA.md
└── TECHNICAL_SPECS.md
```

## Authentication Flow

```typescript
// Login Flow
1. User submits credentials
2. Supabase Auth validates
3. Session created and stored in localStorage
4. User roles fetched from user_roles table
5. Redirect based on role (admin → /admin, candidate → /dashboard)

// Protected Route Logic
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, roles } = useUser();
  if (!user) return <Navigate to="/login" />;
  if (!roles.some(r => allowedRoles.includes(r))) return <Navigate to="/" />;
  return children;
};
```

## Database Context (Multi-DB Support)

```typescript
// Supports switching between primary and secondary database
const DatabaseContext = {
  supabase: SupabaseClient,        // Current active client
  currentDatabase: 'primary' | 'secondary',
  switchDatabase: (type) => void,   // Switch database
  duplicateToSecondary: () => void  // Copy data to secondary
};
```

## API Patterns

### Data Fetching with TanStack Query
```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['jobs'],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('jobs')
      .select('*, job_categories(*)')
      .eq('is_active', true);
    if (error) throw error;
    return data;
  }
});
```

### Mutations
```typescript
const mutation = useMutation({
  mutationFn: async (newJob) => {
    const { data, error } = await supabase
      .from('jobs')
      .insert(newJob)
      .select();
    if (error) throw error;
    return data;
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['jobs'] });
    toast({ title: 'Job created successfully' });
  }
});
```

## Edge Functions

### create-user
Creates user accounts with assigned roles (admin-only).

```typescript
// POST /functions/v1/create-user
{
  email: string,
  password: string,
  full_name: string,
  city: string,
  role: AppRole
}
```

### create-pic-accounts
Bulk creates PIC (Person In Charge) accounts for regional offices.

## Security

### Row Level Security (RLS)
- All tables have RLS enabled
- Policies based on user roles and ownership
- Admin roles have broader access

### Role-Based Access Control (RBAC)
```sql
-- Check if user has permission
SELECT has_permission(user_id, 'manage_applications');

-- Check if user has role
SELECT has_role(user_id, 'admin');
```

## Performance Considerations

1. **Pagination**: All list views implement pagination
2. **Query Optimization**: Selective column fetching
3. **Caching**: TanStack Query cache management
4. **Lazy Loading**: Route-based code splitting
5. **Image Optimization**: Compressed assets in src/assets

## Environment Variables

```env
VITE_SUPABASE_PROJECT_ID    # Supabase project ID
VITE_SUPABASE_PUBLISHABLE_KEY  # Supabase anon key
VITE_SUPABASE_URL           # Supabase URL
```

## Deployment

- **Frontend**: Lovable automatic deployment
- **Backend**: Supabase/Lovable Cloud
- **Edge Functions**: Auto-deployed on code push
- **Database Migrations**: Via Supabase migration tool
