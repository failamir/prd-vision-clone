-- Create unique index that allows NULL values (partial index)
CREATE UNIQUE INDEX candidate_profiles_phone_unique ON public.candidate_profiles (phone) WHERE phone IS NOT NULL;