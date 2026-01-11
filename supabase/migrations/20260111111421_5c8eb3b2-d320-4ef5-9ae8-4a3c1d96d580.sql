-- Add experience_type column to candidate_experience table
ALTER TABLE public.candidate_experience 
ADD COLUMN experience_type text DEFAULT 'Hotel';

-- Add comment to describe the column
COMMENT ON COLUMN public.candidate_experience.experience_type IS 'Type of experience: Hotel or Ship';