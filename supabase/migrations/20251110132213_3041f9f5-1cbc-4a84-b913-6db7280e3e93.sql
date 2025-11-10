-- Add missing fields to candidate_profiles table
ALTER TABLE public.candidate_profiles
ADD COLUMN IF NOT EXISTS weight_kg numeric,
ADD COLUMN IF NOT EXISTS height_cm numeric,
ADD COLUMN IF NOT EXISTS ktp_number text,
ADD COLUMN IF NOT EXISTS place_of_birth text,
ADD COLUMN IF NOT EXISTS how_found_us text,
ADD COLUMN IF NOT EXISTS registration_city text,
ADD COLUMN IF NOT EXISTS referral_name text,
ADD COLUMN IF NOT EXISTS covid_vaccinated text;