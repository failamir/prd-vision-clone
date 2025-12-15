-- Add profile_step_unlocked column to control which step candidate can access
-- Default is 1, meaning only step 1 is accessible initially
-- Admin can update this to 2 or 3 to unlock step 2 or 3
ALTER TABLE public.candidate_profiles 
ADD COLUMN IF NOT EXISTS profile_step_unlocked integer NOT NULL DEFAULT 1;

-- Add comment to explain the column
COMMENT ON COLUMN public.candidate_profiles.profile_step_unlocked IS 'Controls which profile steps are unlocked for the candidate. 1=Personal Detail only, 2=Pre Screening unlocked, 3=Screening unlocked';