-- Add missing Deck Experience columns to candidate_experience
ALTER TABLE public.candidate_experience
  ADD COLUMN IF NOT EXISTS vessel_name_type TEXT,
  ADD COLUMN IF NOT EXISTS gt_loa TEXT,
  ADD COLUMN IF NOT EXISTS route TEXT,
  ADD COLUMN IF NOT EXISTS reason TEXT,
  ADD COLUMN IF NOT EXISTS job_description TEXT,
  ADD COLUMN IF NOT EXISTS file_name TEXT,
  ADD COLUMN IF NOT EXISTS file_path TEXT,
  ADD COLUMN IF NOT EXISTS file_type TEXT,
  ADD COLUMN IF NOT EXISTS file_size INTEGER;