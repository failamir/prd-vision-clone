-- Add comprehensive application tracking fields to job_applications table
ALTER TABLE public.job_applications ADD COLUMN IF NOT EXISTS crew_code TEXT;
ALTER TABLE public.job_applications ADD COLUMN IF NOT EXISTS office_registered TEXT;
ALTER TABLE public.job_applications ADD COLUMN IF NOT EXISTS date_of_entry DATE;
ALTER TABLE public.job_applications ADD COLUMN IF NOT EXISTS source TEXT;
ALTER TABLE public.job_applications ADD COLUMN IF NOT EXISTS second_position TEXT;
ALTER TABLE public.job_applications ADD COLUMN IF NOT EXISTS ship_experience TEXT;
ALTER TABLE public.job_applications ADD COLUMN IF NOT EXISTS c1d_expiry_date DATE;
ALTER TABLE public.job_applications ADD COLUMN IF NOT EXISTS previous_experience TEXT;
ALTER TABLE public.job_applications ADD COLUMN IF NOT EXISTS education_background TEXT;
ALTER TABLE public.job_applications ADD COLUMN IF NOT EXISTS contact_no TEXT;
ALTER TABLE public.job_applications ADD COLUMN IF NOT EXISTS emergency_contact TEXT;
ALTER TABLE public.job_applications ADD COLUMN IF NOT EXISTS photo_url TEXT;
ALTER TABLE public.job_applications ADD COLUMN IF NOT EXISTS cv_url TEXT;
ALTER TABLE public.job_applications ADD COLUMN IF NOT EXISTS letter_form_url TEXT;
ALTER TABLE public.job_applications ADD COLUMN IF NOT EXISTS vaccin_covid_booster BOOLEAN DEFAULT false;
ALTER TABLE public.job_applications ADD COLUMN IF NOT EXISTS bst_cc TEXT;
ALTER TABLE public.job_applications ADD COLUMN IF NOT EXISTS suitable TEXT;
ALTER TABLE public.job_applications ADD COLUMN IF NOT EXISTS interview_by TEXT;
ALTER TABLE public.job_applications ADD COLUMN IF NOT EXISTS interview_date DATE;
ALTER TABLE public.job_applications ADD COLUMN IF NOT EXISTS interview_result TEXT;
ALTER TABLE public.job_applications ADD COLUMN IF NOT EXISTS interview_result_notes TEXT;
ALTER TABLE public.job_applications ADD COLUMN IF NOT EXISTS approved_position TEXT;
ALTER TABLE public.job_applications ADD COLUMN IF NOT EXISTS marlin_english_score TEXT;
ALTER TABLE public.job_applications ADD COLUMN IF NOT EXISTS neha_ces_test TEXT;
ALTER TABLE public.job_applications ADD COLUMN IF NOT EXISTS test_result TEXT;
ALTER TABLE public.job_applications ADD COLUMN IF NOT EXISTS principal_interview_by TEXT;
ALTER TABLE public.job_applications ADD COLUMN IF NOT EXISTS principal_interview_date DATE;
ALTER TABLE public.job_applications ADD COLUMN IF NOT EXISTS principal_interview_result TEXT;
ALTER TABLE public.job_applications ADD COLUMN IF NOT EXISTS approved_as TEXT;
ALTER TABLE public.job_applications ADD COLUMN IF NOT EXISTS employment_offer TEXT;
ALTER TABLE public.job_applications ADD COLUMN IF NOT EXISTS eo_acceptance TEXT;
ALTER TABLE public.job_applications ADD COLUMN IF NOT EXISTS remarks TEXT;

-- Add RLS policy for admins to manage all applications
CREATE POLICY "Admins can manage all applications"
ON public.job_applications
FOR ALL
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));