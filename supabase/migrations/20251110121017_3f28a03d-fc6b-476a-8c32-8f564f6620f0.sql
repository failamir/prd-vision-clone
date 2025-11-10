-- Create user roles enum
CREATE TYPE public.app_role AS ENUM ('admin', 'employer', 'candidate');

-- Create user roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Function to check user role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create candidate profiles table
CREATE TABLE public.candidate_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  date_of_birth DATE,
  gender TEXT,
  address TEXT,
  city TEXT,
  country TEXT,
  professional_title TEXT,
  bio TEXT,
  website TEXT,
  expected_salary_min INTEGER,
  expected_salary_max INTEGER,
  salary_currency TEXT DEFAULT 'USD',
  linkedin_url TEXT,
  facebook_url TEXT,
  twitter_url TEXT,
  avatar_url TEXT,
  is_profile_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.candidate_profiles ENABLE ROW LEVEL SECURITY;

-- Create profiles trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

-- Create trigger for new users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create education table
CREATE TABLE public.candidate_education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID REFERENCES public.candidate_profiles(id) ON DELETE CASCADE NOT NULL,
  institution TEXT NOT NULL,
  degree TEXT NOT NULL,
  field_of_study TEXT,
  start_date DATE,
  end_date DATE,
  is_current BOOLEAN DEFAULT false,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.candidate_education ENABLE ROW LEVEL SECURITY;

-- Create experience table
CREATE TABLE public.candidate_experience (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID REFERENCES public.candidate_profiles(id) ON DELETE CASCADE NOT NULL,
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  location TEXT,
  start_date DATE,
  end_date DATE,
  is_current BOOLEAN DEFAULT false,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.candidate_experience ENABLE ROW LEVEL SECURITY;

-- Create skills table
CREATE TABLE public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  category TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

-- Create candidate skills junction table
CREATE TABLE public.candidate_skills (
  candidate_id UUID REFERENCES public.candidate_profiles(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES public.skills(id) ON DELETE CASCADE,
  proficiency_level TEXT,
  PRIMARY KEY (candidate_id, skill_id)
);

ALTER TABLE public.candidate_skills ENABLE ROW LEVEL SECURITY;

-- Create CVs storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('cvs', 'cvs', false)
ON CONFLICT DO NOTHING;

-- Create CVs table
CREATE TABLE public.candidate_cvs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID REFERENCES public.candidate_profiles(id) ON DELETE CASCADE NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  file_type TEXT,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.candidate_cvs ENABLE ROW LEVEL SECURITY;

-- Create job categories table
CREATE TABLE public.job_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.job_categories ENABLE ROW LEVEL SECURITY;

-- Create jobs table
CREATE TABLE public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  company_name TEXT NOT NULL,
  department TEXT,
  description TEXT NOT NULL,
  requirements TEXT,
  responsibilities TEXT,
  benefits TEXT,
  category_id UUID REFERENCES public.job_categories(id),
  location TEXT NOT NULL,
  job_type TEXT NOT NULL,
  salary_min INTEGER,
  salary_max INTEGER,
  salary_currency TEXT DEFAULT 'USD',
  experience_level TEXT,
  education_level TEXT,
  positions_available INTEGER DEFAULT 1,
  is_urgent BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Create job applications table
CREATE TABLE public.job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE NOT NULL,
  candidate_id UUID REFERENCES public.candidate_profiles(id) ON DELETE CASCADE NOT NULL,
  cv_id UUID REFERENCES public.candidate_cvs(id),
  cover_letter TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'shortlisted', 'interview', 'offered', 'rejected', 'withdrawn')),
  notes TEXT,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (job_id, candidate_id)
);

ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- Create saved jobs table
CREATE TABLE public.saved_jobs (
  candidate_id UUID REFERENCES public.candidate_profiles(id) ON DELETE CASCADE,
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
  saved_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (candidate_id, job_id)
);

ALTER TABLE public.saved_jobs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for candidate_profiles
CREATE POLICY "Users can view their own profile"
  ON public.candidate_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.candidate_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Public profiles are viewable by everyone"
  ON public.candidate_profiles FOR SELECT
  USING (is_profile_public = true);

-- RLS Policies for education
CREATE POLICY "Users can manage their own education"
  ON public.candidate_education FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.candidate_profiles
      WHERE id = candidate_education.candidate_id
      AND user_id = auth.uid()
    )
  );

-- RLS Policies for experience
CREATE POLICY "Users can manage their own experience"
  ON public.candidate_experience FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.candidate_profiles
      WHERE id = candidate_experience.candidate_id
      AND user_id = auth.uid()
    )
  );

-- RLS Policies for skills
CREATE POLICY "Anyone can view skills"
  ON public.skills FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for candidate_skills
CREATE POLICY "Users can manage their own skills"
  ON public.candidate_skills FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.candidate_profiles
      WHERE id = candidate_skills.candidate_id
      AND user_id = auth.uid()
    )
  );

-- RLS Policies for CVs storage
CREATE POLICY "Users can upload their own CVs"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'cvs' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own CVs"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'cvs' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own CVs"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'cvs' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- RLS Policies for candidate_cvs table
CREATE POLICY "Users can manage their own CV records"
  ON public.candidate_cvs FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.candidate_profiles
      WHERE id = candidate_cvs.candidate_id
      AND user_id = auth.uid()
    )
  );

-- RLS Policies for job_categories
CREATE POLICY "Anyone can view categories"
  ON public.job_categories FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for jobs
CREATE POLICY "Anyone can view active jobs"
  ON public.jobs FOR SELECT
  USING (is_active = true AND (expires_at IS NULL OR expires_at > now()));

CREATE POLICY "Employers can manage their own jobs"
  ON public.jobs FOR ALL
  USING (auth.uid() = employer_id);

-- RLS Policies for job_applications
CREATE POLICY "Candidates can view their own applications"
  ON public.job_applications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.candidate_profiles
      WHERE id = job_applications.candidate_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Candidates can create applications"
  ON public.job_applications FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.candidate_profiles
      WHERE id = job_applications.candidate_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Candidates can update their own applications"
  ON public.job_applications FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.candidate_profiles
      WHERE id = job_applications.candidate_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Employers can view applications for their jobs"
  ON public.job_applications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.jobs
      WHERE id = job_applications.job_id
      AND employer_id = auth.uid()
    )
  );

-- RLS Policies for saved_jobs
CREATE POLICY "Users can manage their own saved jobs"
  ON public.saved_jobs FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.candidate_profiles
      WHERE id = saved_jobs.candidate_id
      AND user_id = auth.uid()
    )
  );

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

-- Add update triggers
CREATE TRIGGER update_candidate_profiles_updated_at
  BEFORE UPDATE ON public.candidate_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at
  BEFORE UPDATE ON public.jobs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_job_applications_updated_at
  BEFORE UPDATE ON public.job_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();