# Database Schema Documentation

## Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              USER & AUTH DOMAIN                                  │
└─────────────────────────────────────────────────────────────────────────────────┘

┌──────────────────┐         ┌──────────────────┐         ┌──────────────────┐
│   auth.users     │         │   user_roles     │         │   permissions    │
│ (Supabase Auth)  │────────▶│                  │◀────────│                  │
├──────────────────┤    1:M  ├──────────────────┤    M:M  ├──────────────────┤
│ id (PK)          │         │ id (PK)          │         │ id (PK)          │
│ email            │         │ user_id (FK)     │         │ name             │
│ password         │         │ role             │         │ description      │
│ created_at       │         │ created_at       │         │ category         │
└──────────────────┘         └──────────────────┘         └──────────────────┘
                                      │                           │
                                      │                           │
                                      ▼                           ▼
                             ┌──────────────────┐
                             │ role_permissions │
                             ├──────────────────┤
                             │ id (PK)          │
                             │ role             │
                             │ permission_id(FK)│
                             │ created_at       │
                             └──────────────────┘


┌─────────────────────────────────────────────────────────────────────────────────┐
│                            CANDIDATE DOMAIN                                      │
└─────────────────────────────────────────────────────────────────────────────────┘

                             ┌──────────────────────┐
                             │  candidate_profiles  │
                             ├──────────────────────┤
                             │ id (PK)              │
                             │ user_id (FK→auth)    │
                             │ full_name            │
                             │ email                │
                             │ phone                │
                             │ date_of_birth        │
                             │ gender               │
                             │ address, city        │
                             │ avatar_url           │
                             │ professional_title   │
                             │ bio                  │
                             │ ktp_number           │
                             │ height_cm, weight_kg │
                             │ covid_vaccinated     │
                             │ registration_city    │
                             │ profile_step_unlocked│
                             └──────────┬───────────┘
                                        │
         ┌──────────────────────────────┼──────────────────────────────┐
         │                              │                              │
         ▼                              ▼                              ▼
┌─────────────────┐         ┌──────────────────┐         ┌──────────────────┐
│  candidate_cvs  │         │candidate_certif. │         │ candidate_docs   │
├─────────────────┤         ├──────────────────┤         ├──────────────────┤
│ id (PK)         │         │ id (PK)          │         │ id (PK)          │
│ candidate_id(FK)│         │ candidate_id(FK) │         │ candidate_id(FK) │
│ file_name       │         │ type_certificate │         │ document_type    │
│ file_path       │         │ cert_number      │         │ file_name        │
│ file_size       │         │ date_of_issue    │         │ file_path        │
│ is_default      │         │ institution      │         │ expiry_date      │
│ created_at      │         │ file_path        │         │ created_at       │
└─────────────────┘         └──────────────────┘         └──────────────────┘
         │                              │                              │
         ▼                              ▼                              ▼
┌─────────────────┐         ┌──────────────────┐         ┌──────────────────┐
│candidate_educ.  │         │candidate_exper.  │         │candidate_travel  │
├─────────────────┤         ├──────────────────┤         ├──────────────────┤
│ id (PK)         │         │ id (PK)          │         │ id (PK)          │
│ candidate_id(FK)│         │ candidate_id(FK) │         │ candidate_id(FK) │
│ institution     │         │ position         │         │ document_type    │
│ degree          │         │ company          │         │ document_number  │
│ field_of_study  │         │ vessel_name_type │         │ issue_date       │
│ start_date      │         │ start_date       │         │ expiry_date      │
│ end_date        │         │ end_date         │         │ issuing_authority│
│ is_current      │         │ gt_loa, route    │         │ file_path        │
└─────────────────┘         └──────────────────┘         └──────────────────┘
         │                              │                              │
         ▼                              ▼                              ▼
┌─────────────────┐         ┌──────────────────┐         ┌──────────────────┐
│candidate_skills │         │candidate_medical │         │candidate_refs    │
├─────────────────┤         ├──────────────────┤         ├──────────────────┤
│ candidate_id(FK)│         │ id (PK)          │         │ id (PK)          │
│ skill_id (FK)   │         │ candidate_id(FK) │         │ candidate_id(FK) │
│ proficiency_lvl │         │ test_name        │         │ full_name        │
└─────────────────┘         │ score            │         │ relationship     │
                            │ file_path        │         │ phone, email     │
                            └──────────────────┘         │ company          │
                                                         └──────────────────┘
         │                              │
         ▼                              ▼
┌─────────────────┐         ┌──────────────────┐
│candidate_emerg. │         │candidate_nok     │
├─────────────────┤         ├──────────────────┤
│ id (PK)         │         │ id (PK)          │
│ candidate_id(FK)│         │ candidate_id(FK) │
│ full_name       │         │ full_name        │
│ relationship    │         │ relationship     │
│ phone           │         │ date_of_birth    │
│ is_primary      │         │ place_of_birth   │
└─────────────────┘         └──────────────────┘


┌─────────────────────────────────────────────────────────────────────────────────┐
│                               JOB DOMAIN                                         │
└─────────────────────────────────────────────────────────────────────────────────┘

┌──────────────────┐         ┌──────────────────┐         ┌──────────────────┐
│  job_categories  │         │      jobs        │         │  job_applications│
├──────────────────┤    1:M  ├──────────────────┤    1:M  ├──────────────────┤
│ id (PK)          │────────▶│ id (PK)          │────────▶│ id (PK)          │
│ name             │         │ category_id (FK) │         │ job_id (FK)      │
│ slug             │         │ employer_id      │         │ candidate_id(FK) │
│ description      │         │ title            │         │ cv_id (FK)       │
└──────────────────┘         │ company_name     │         │ status           │
                             │ description      │         │ cover_letter     │
                             │ location         │         │ applied_at       │
                             │ job_type         │         │ interview_date   │
                             │ salary_min/max   │         │ interview_by     │
                             │ requirements     │         │ interview_result │
                             │ is_active        │         │ approved_position│
                             │ is_featured      │         │ crew_code        │
                             │ expires_at       │         │ remarks          │
                             └──────────────────┘         └──────────────────┘
                                      │
                                      │
                                      ▼
                             ┌──────────────────┐
                             │    saved_jobs    │
                             ├──────────────────┤
                             │ candidate_id(FK) │ (Composite PK)
                             │ job_id (FK)      │
                             │ saved_at         │
                             └──────────────────┘


┌─────────────────────────────────────────────────────────────────────────────────┐
│                          COMMUNICATION DOMAIN                                    │
└─────────────────────────────────────────────────────────────────────────────────┘

┌──────────────────┐         ┌──────────────────┐         ┌──────────────────┐
│    messages      │         │contact_submissions│        │   testimonials   │
├──────────────────┤         ├──────────────────┤         ├──────────────────┤
│ id (PK)          │         │ id (PK)          │         │ id (PK)          │
│ sender_id        │         │ name             │         │ candidate_id(FK) │
│ receiver_id      │         │ email            │         │ testimonial      │
│ subject          │         │ subject          │         │ rating           │
│ message          │         │ message          │         │ is_approved      │
│ is_read          │         │ is_read          │         │ created_at       │
│ created_at       │         │ status           │         │ updated_at       │
│ updated_at       │         │ created_at       │         └──────────────────┘
└──────────────────┘         └──────────────────┘


┌─────────────────────────────────────────────────────────────────────────────────┐
│                            REFERENCE DOMAIN                                      │
└─────────────────────────────────────────────────────────────────────────────────┘

┌──────────────────┐
│     skills       │
├──────────────────┤
│ id (PK)          │
│ name             │
│ category         │
│ created_at       │
└──────────────────┘
```

## Roles Enum

```sql
CREATE TYPE app_role AS ENUM (
  'admin',
  'employer', 
  'candidate',
  'manajer',
  'staff',
  'interviewer',
  'interviewer_principal',
  'superadmin',
  'direktur',
  'pic',
  'manager',
  'hrd'
);
```

## Storage Buckets

| Bucket Name | Public | Purpose |
|-------------|--------|---------|
| cvs | No | Candidate CV files |
| avatars | Yes | Profile photos |
| candidate-documents | No | Certificates, travel docs, etc. |

## Key Relationships

1. **User → Candidate Profile**: 1:1 (auto-created on registration)
2. **Candidate → Documents**: 1:M (CVs, certificates, travel docs, etc.)
3. **Candidate → Experience**: 1:M (work history)
4. **Job → Applications**: 1:M
5. **Candidate → Applications**: 1:M
6. **User → Roles**: 1:M (users can have multiple roles)
7. **Role → Permissions**: M:M (through role_permissions)
