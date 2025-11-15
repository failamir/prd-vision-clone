-- Make company nullable for deck experience entries
ALTER TABLE public.candidate_experience
  ALTER COLUMN company DROP NOT NULL;