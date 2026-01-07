-- Add is_archived column to candidate_profiles table
ALTER TABLE public.candidate_profiles 
ADD COLUMN is_archived BOOLEAN NOT NULL DEFAULT false;

-- Add archived_at column to track when user was archived
ALTER TABLE public.candidate_profiles 
ADD COLUMN archived_at TIMESTAMP WITH TIME ZONE;

-- Create index for faster filtering
CREATE INDEX idx_candidate_profiles_is_archived ON public.candidate_profiles(is_archived);