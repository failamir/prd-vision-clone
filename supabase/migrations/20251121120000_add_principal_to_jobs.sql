-- Add principal column to jobs
ALTER TABLE public.jobs
ADD COLUMN IF NOT EXISTS principal TEXT;
