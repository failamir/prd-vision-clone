-- Complete Schema Setup for Secondary Database
-- Run this script on your secondary Supabase database (flbieqiieplhuebceewp)

-- 1. Create Enum Types
CREATE TYPE public.app_role AS ENUM ('admin', 'employer', 'candidate');

-- 2. Create Tables

-- User Roles Table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    role public.app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Skills Table
CREATE TABLE public.skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Job Categories Table
CREATE TABLE public.job_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Candidate Profiles Table
CREATE TABLE public.candidate_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    date_of_birth DATE,
    place_of_birth TEXT,
    gender TEXT,
    address TEXT,
    city TEXT,
    country TEXT,
    ktp_number TEXT,
    professional_title TEXT,
    bio TEXT,
    avatar_url TEXT,
    website TEXT,
    linkedin_url TEXT,
    facebook_url TEXT,
    twitter_url TEXT,
    height_cm NUMERIC,
    weight_kg NUMERIC,
    covid_vaccinated TEXT,
    expected_salary_min INTEGER,
    expected_salary_max INTEGER,
    salary_currency TEXT DEFAULT 'USD',
    how_found_us TEXT,
    referral_name TEXT,
    registration_city TEXT,
    is_profile_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Candidate CVs Table
CREATE TABLE public.candidate_cvs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_type TEXT,
    file_size INTEGER,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Candidate Certificates Table
CREATE TABLE public.candidate_certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL,
    type_certificate TEXT NOT NULL,
    cert_number TEXT,
    institution TEXT,
    place TEXT,
    date_of_issue DATE,
    file_name TEXT,
    file_path TEXT,
    file_type TEXT,
    file_size INTEGER,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Candidate Documents Table
CREATE TABLE public.candidate_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL,
    document_type TEXT NOT NULL,
    title TEXT,
    description TEXT,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_type TEXT,
    file_size INTEGER,
    issue_date DATE,
    expiry_date DATE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Candidate Education Table
CREATE TABLE public.candidate_education (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL,
    institution TEXT NOT NULL,
    degree TEXT NOT NULL,
    field_of_study TEXT,
    start_date DATE,
    end_date DATE,
    is_current BOOLEAN DEFAULT false,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Candidate Emergency Contacts Table
CREATE TABLE public.candidate_emergency_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL,
    full_name TEXT NOT NULL,
    relationship TEXT NOT NULL,
    phone TEXT NOT NULL,
    alternative_phone TEXT,
    email TEXT,
    address TEXT,
    city TEXT,
    country TEXT,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Candidate Experience Table
CREATE TABLE public.candidate_experience (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL,
    position TEXT NOT NULL,
    company TEXT,
    vessel_name_type TEXT,
    gt_loa TEXT,
    route TEXT,
    location TEXT,
    start_date DATE,
    end_date DATE,
    is_current BOOLEAN DEFAULT false,
    job_description TEXT,
    description TEXT,
    reason TEXT,
    file_name TEXT,
    file_path TEXT,
    file_type TEXT,
    file_size INTEGER,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Candidate Medical Tests Table
CREATE TABLE public.candidate_medical_tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL,
    test_name TEXT NOT NULL,
    score NUMERIC,
    file_name TEXT,
    file_path TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Candidate Next of Kin Table
CREATE TABLE public.candidate_next_of_kin (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL,
    full_name TEXT NOT NULL,
    relationship TEXT NOT NULL,
    date_of_birth DATE,
    place_of_birth TEXT,
    signature TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Candidate References Table
CREATE TABLE public.candidate_references (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    company TEXT,
    position TEXT,
    relationship TEXT,
    address TEXT,
    city TEXT,
    country TEXT,
    years_known INTEGER,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Candidate Skills Table
CREATE TABLE public.candidate_skills (
    candidate_id UUID NOT NULL,
    skill_id UUID NOT NULL,
    proficiency_level TEXT,
    PRIMARY KEY (candidate_id, skill_id)
);

-- Candidate Travel Documents Table
CREATE TABLE public.candidate_travel_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL,
    document_type TEXT NOT NULL,
    document_number TEXT,
    issuing_country TEXT,
    issuing_authority TEXT,
    issue_date DATE,
    expiry_date DATE,
    file_name TEXT,
    file_path TEXT,
    file_type TEXT,
    file_size INTEGER,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Jobs Table
CREATE TABLE public.jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employer_id UUID NOT NULL,
    category_id UUID,
    title TEXT NOT NULL,
    company_name TEXT NOT NULL,
    department TEXT,
    description TEXT NOT NULL,
    job_type TEXT NOT NULL,
    location TEXT NOT NULL,
    salary_min INTEGER,
    salary_max INTEGER,
    salary_currency TEXT DEFAULT 'USD',
    experience_level TEXT,
    education_level TEXT,
    positions_available INTEGER DEFAULT 1,
    requirements TEXT,
    responsibilities TEXT,
    benefits TEXT,
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    is_urgent BOOLEAN DEFAULT false,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Job Applications Table
CREATE TABLE public.job_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL,
    candidate_id UUID NOT NULL,
    cv_id UUID,
    cover_letter TEXT,
    status TEXT DEFAULT 'pending',
    notes TEXT,
    crew_code TEXT,
    office_registered TEXT,
    date_of_entry DATE,
    source TEXT,
    second_position TEXT,
    ship_experience TEXT,
    c1d_expiry_date DATE,
    previous_experience TEXT,
    education_background TEXT,
    contact_no TEXT,
    emergency_contact TEXT,
    photo_url TEXT,
    cv_url TEXT,
    letter_form_url TEXT,
    vaccin_covid_booster BOOLEAN DEFAULT false,
    bst_cc TEXT,
    suitable TEXT,
    interview_by TEXT,
    interview_date DATE,
    interview_result TEXT,
    interview_result_notes TEXT,
    approved_position TEXT,
    marlin_english_score TEXT,
    neha_ces_test TEXT,
    test_result TEXT,
    principal_interview_by TEXT,
    principal_interview_date DATE,
    principal_interview_result TEXT,
    approved_as TEXT,
    employment_offer TEXT,
    eo_acceptance TEXT,
    remarks TEXT,
    applied_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Saved Jobs Table
CREATE TABLE public.saved_jobs (
    candidate_id UUID NOT NULL,
    job_id UUID NOT NULL,
    saved_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    PRIMARY KEY (candidate_id, job_id)
);

-- Messages Table
CREATE TABLE public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID NOT NULL,
    receiver_id UUID NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Testimonials Table
CREATE TABLE public.testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL,
    testimonial TEXT NOT NULL,
    rating INTEGER NOT NULL,
    is_approved BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. Create Functions

-- Update timestamp function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Has role function (Security Definer)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Insert admin role function
CREATE OR REPLACE FUNCTION public.insert_admin_role(target_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (target_user_id, 'admin'::public.app_role)
  ON CONFLICT (user_id, role) DO NOTHING;
END;
$$;

-- Assign admin role function
CREATE OR REPLACE FUNCTION public.assign_admin_role(user_email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  target_user_id UUID;
BEGIN
  SELECT id INTO target_user_id
  FROM auth.users
  WHERE email = user_email;

  IF target_user_id IS NULL THEN
    RETURN false;
  END IF;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (target_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN true;
END;
$$;

-- Handle new user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.candidate_profiles (user_id, full_name, email)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.email),
    new.email
  );
  RETURN new;
END;
$$;

-- 4. Enable Row Level Security on all tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_cvs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_medical_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_next_of_kin ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_references ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_travel_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS Policies

-- User Roles Policies
CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'));
CREATE POLICY "Allow admin role insertion" ON public.user_roles FOR INSERT WITH CHECK ((NOT EXISTS (SELECT 1 FROM user_roles WHERE role = 'admin')) OR has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete roles" ON public.user_roles FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- Skills Policies
CREATE POLICY "Anyone can view skills" ON public.skills FOR SELECT USING (true);

-- Job Categories Policies
CREATE POLICY "Anyone can view categories" ON public.job_categories FOR SELECT USING (true);

-- Candidate Profiles Policies
CREATE POLICY "Users can view their own profile" ON public.candidate_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Public profiles are viewable by everyone" ON public.candidate_profiles FOR SELECT USING (is_profile_public = true);
CREATE POLICY "Users can update their own profile" ON public.candidate_profiles FOR UPDATE USING (auth.uid() = user_id);

-- Candidate CVs Policies
CREATE POLICY "Users can manage their own CV records" ON public.candidate_cvs FOR ALL USING (EXISTS (SELECT 1 FROM candidate_profiles WHERE candidate_profiles.id = candidate_cvs.candidate_id AND candidate_profiles.user_id = auth.uid()));

-- Candidate Certificates Policies
CREATE POLICY "Users can manage their own certificates" ON public.candidate_certificates FOR ALL USING (EXISTS (SELECT 1 FROM candidate_profiles WHERE candidate_profiles.id = candidate_certificates.candidate_id AND candidate_profiles.user_id = auth.uid()));

-- Candidate Documents Policies
CREATE POLICY "Users can manage their own documents" ON public.candidate_documents FOR ALL USING (EXISTS (SELECT 1 FROM candidate_profiles WHERE candidate_profiles.id = candidate_documents.candidate_id AND candidate_profiles.user_id = auth.uid()));

-- Candidate Education Policies
CREATE POLICY "Users can manage their own education" ON public.candidate_education FOR ALL USING (EXISTS (SELECT 1 FROM candidate_profiles WHERE candidate_profiles.id = candidate_education.candidate_id AND candidate_profiles.user_id = auth.uid()));

-- Candidate Emergency Contacts Policies
CREATE POLICY "Users can manage their own emergency contacts" ON public.candidate_emergency_contacts FOR ALL USING (EXISTS (SELECT 1 FROM candidate_profiles WHERE candidate_profiles.id = candidate_emergency_contacts.candidate_id AND candidate_profiles.user_id = auth.uid()));

-- Candidate Experience Policies
CREATE POLICY "Users can manage their own experience" ON public.candidate_experience FOR ALL USING (EXISTS (SELECT 1 FROM candidate_profiles WHERE candidate_profiles.id = candidate_experience.candidate_id AND candidate_profiles.user_id = auth.uid()));

-- Candidate Medical Tests Policies
CREATE POLICY "Users can manage their own medical tests" ON public.candidate_medical_tests FOR ALL USING (EXISTS (SELECT 1 FROM candidate_profiles WHERE candidate_profiles.id = candidate_medical_tests.candidate_id AND candidate_profiles.user_id = auth.uid()));

-- Candidate Next of Kin Policies
CREATE POLICY "Users can manage their own next of kin" ON public.candidate_next_of_kin FOR ALL USING (EXISTS (SELECT 1 FROM candidate_profiles cp WHERE cp.id = candidate_next_of_kin.candidate_id AND cp.user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM candidate_profiles cp WHERE cp.id = candidate_next_of_kin.candidate_id AND cp.user_id = auth.uid()));

-- Candidate References Policies
CREATE POLICY "Users can view their own references" ON public.candidate_references FOR SELECT USING (auth.uid() IN (SELECT candidate_profiles.user_id FROM candidate_profiles WHERE candidate_profiles.id = candidate_references.candidate_id));
CREATE POLICY "Users can insert their own references" ON public.candidate_references FOR INSERT WITH CHECK (auth.uid() IN (SELECT candidate_profiles.user_id FROM candidate_profiles WHERE candidate_profiles.id = candidate_references.candidate_id));
CREATE POLICY "Users can update their own references" ON public.candidate_references FOR UPDATE USING (auth.uid() IN (SELECT candidate_profiles.user_id FROM candidate_profiles WHERE candidate_profiles.id = candidate_references.candidate_id));
CREATE POLICY "Users can delete their own references" ON public.candidate_references FOR DELETE USING (auth.uid() IN (SELECT candidate_profiles.user_id FROM candidate_profiles WHERE candidate_profiles.id = candidate_references.candidate_id));

-- Candidate Skills Policies
CREATE POLICY "Users can manage their own skills" ON public.candidate_skills FOR ALL USING (EXISTS (SELECT 1 FROM candidate_profiles WHERE candidate_profiles.id = candidate_skills.candidate_id AND candidate_profiles.user_id = auth.uid()));

-- Candidate Travel Documents Policies
CREATE POLICY "Users can manage their own travel documents" ON public.candidate_travel_documents FOR ALL USING (EXISTS (SELECT 1 FROM candidate_profiles WHERE candidate_profiles.id = candidate_travel_documents.candidate_id AND candidate_profiles.user_id = auth.uid()));

-- Jobs Policies
CREATE POLICY "Anyone can view active jobs" ON public.jobs FOR SELECT USING (is_active = true AND (expires_at IS NULL OR expires_at > now()));
CREATE POLICY "Employers can manage their own jobs" ON public.jobs FOR ALL USING (auth.uid() = employer_id);

-- Job Applications Policies
CREATE POLICY "Candidates can view their own applications" ON public.job_applications FOR SELECT USING (EXISTS (SELECT 1 FROM candidate_profiles WHERE candidate_profiles.id = job_applications.candidate_id AND candidate_profiles.user_id = auth.uid()));
CREATE POLICY "Candidates can create applications" ON public.job_applications FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM candidate_profiles WHERE candidate_profiles.id = job_applications.candidate_id AND candidate_profiles.user_id = auth.uid()));
CREATE POLICY "Candidates can update their own applications" ON public.job_applications FOR UPDATE USING (EXISTS (SELECT 1 FROM candidate_profiles WHERE candidate_profiles.id = job_applications.candidate_id AND candidate_profiles.user_id = auth.uid()));
CREATE POLICY "Employers can view applications for their jobs" ON public.job_applications FOR SELECT USING (EXISTS (SELECT 1 FROM jobs WHERE jobs.id = job_applications.job_id AND jobs.employer_id = auth.uid()));
CREATE POLICY "Admins can manage all applications" ON public.job_applications FOR ALL USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- Saved Jobs Policies
CREATE POLICY "Users can manage their own saved jobs" ON public.saved_jobs FOR ALL USING (EXISTS (SELECT 1 FROM candidate_profiles WHERE candidate_profiles.id = saved_jobs.candidate_id AND candidate_profiles.user_id = auth.uid()));

-- Messages Policies
CREATE POLICY "Users can view messages sent to them" ON public.messages FOR SELECT USING (auth.uid() = receiver_id OR auth.uid() = sender_id);
CREATE POLICY "Users can send messages" ON public.messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Users can update messages they received" ON public.messages FOR UPDATE USING (auth.uid() = receiver_id);
CREATE POLICY "Admins can view all messages" ON public.messages FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can send messages" ON public.messages FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));

-- Testimonials Policies
CREATE POLICY "Users can view approved testimonials" ON public.testimonials FOR SELECT USING (is_approved = true);
CREATE POLICY "Users can view their own testimonials" ON public.testimonials FOR SELECT USING (EXISTS (SELECT 1 FROM candidate_profiles WHERE candidate_profiles.id = testimonials.candidate_id AND candidate_profiles.user_id = auth.uid()));
CREATE POLICY "Users can insert their own testimonials" ON public.testimonials FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM candidate_profiles WHERE candidate_profiles.id = testimonials.candidate_id AND candidate_profiles.user_id = auth.uid()));
CREATE POLICY "Admins can manage all testimonials" ON public.testimonials FOR ALL USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- 6. Create Foreign Key Constraints (add after data is loaded to avoid constraint violations)
-- Run these separately AFTER you've duplicated the data

-- ALTER TABLE public.candidate_cvs ADD CONSTRAINT candidate_cvs_candidate_id_fkey FOREIGN KEY (candidate_id) REFERENCES public.candidate_profiles(id);
-- ALTER TABLE public.candidate_certificates ADD CONSTRAINT candidate_certificates_candidate_id_fkey FOREIGN KEY (candidate_id) REFERENCES public.candidate_profiles(id);
-- ALTER TABLE public.candidate_documents ADD CONSTRAINT candidate_documents_candidate_id_fkey FOREIGN KEY (candidate_id) REFERENCES public.candidate_profiles(id);
-- ALTER TABLE public.candidate_education ADD CONSTRAINT candidate_education_candidate_id_fkey FOREIGN KEY (candidate_id) REFERENCES public.candidate_profiles(id);
-- ALTER TABLE public.candidate_emergency_contacts ADD CONSTRAINT candidate_emergency_contacts_candidate_id_fkey FOREIGN KEY (candidate_id) REFERENCES public.candidate_profiles(id);
-- ALTER TABLE public.candidate_experience ADD CONSTRAINT candidate_experience_candidate_id_fkey FOREIGN KEY (candidate_id) REFERENCES public.candidate_profiles(id);
-- ALTER TABLE public.candidate_medical_tests ADD CONSTRAINT candidate_medical_tests_candidate_id_fkey FOREIGN KEY (candidate_id) REFERENCES public.candidate_profiles(id);
-- ALTER TABLE public.candidate_next_of_kin ADD CONSTRAINT candidate_next_of_kin_candidate_id_fkey FOREIGN KEY (candidate_id) REFERENCES public.candidate_profiles(id);
-- ALTER TABLE public.candidate_references ADD CONSTRAINT candidate_references_candidate_id_fkey FOREIGN KEY (candidate_id) REFERENCES public.candidate_profiles(id);
-- ALTER TABLE public.candidate_skills ADD CONSTRAINT candidate_skills_candidate_id_fkey FOREIGN KEY (candidate_id) REFERENCES public.candidate_profiles(id);
-- ALTER TABLE public.candidate_skills ADD CONSTRAINT candidate_skills_skill_id_fkey FOREIGN KEY (skill_id) REFERENCES public.skills(id);
-- ALTER TABLE public.candidate_travel_documents ADD CONSTRAINT candidate_travel_documents_candidate_id_fkey FOREIGN KEY (candidate_id) REFERENCES public.candidate_profiles(id);
-- ALTER TABLE public.jobs ADD CONSTRAINT jobs_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.job_categories(id);
-- ALTER TABLE public.job_applications ADD CONSTRAINT job_applications_candidate_id_fkey FOREIGN KEY (candidate_id) REFERENCES public.candidate_profiles(id);
-- ALTER TABLE public.job_applications ADD CONSTRAINT job_applications_cv_id_fkey FOREIGN KEY (cv_id) REFERENCES public.candidate_cvs(id);
-- ALTER TABLE public.job_applications ADD CONSTRAINT job_applications_job_id_fkey FOREIGN KEY (job_id) REFERENCES public.jobs(id);
-- ALTER TABLE public.saved_jobs ADD CONSTRAINT saved_jobs_candidate_id_fkey FOREIGN KEY (candidate_id) REFERENCES public.candidate_profiles(id);
-- ALTER TABLE public.saved_jobs ADD CONSTRAINT saved_jobs_job_id_fkey FOREIGN KEY (job_id) REFERENCES public.jobs(id);
-- ALTER TABLE public.testimonials ADD CONSTRAINT testimonials_candidate_id_fkey FOREIGN KEY (candidate_id) REFERENCES public.candidate_profiles(id);
