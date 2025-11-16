-- Create Next of Kin table to persist data
CREATE TABLE IF NOT EXISTS public.candidate_next_of_kin (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID NOT NULL REFERENCES public.candidate_profiles(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  relationship TEXT NOT NULL,
  place_of_birth TEXT,
  date_of_birth DATE,
  signature TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.candidate_next_of_kin ENABLE ROW LEVEL SECURITY;

-- RLS: Users can manage their own next of kin
CREATE POLICY "Users can manage their own next of kin"
ON public.candidate_next_of_kin
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.candidate_profiles cp
    WHERE cp.id = candidate_next_of_kin.candidate_id AND cp.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.candidate_profiles cp
    WHERE cp.id = candidate_next_of_kin.candidate_id AND cp.user_id = auth.uid()
  )
);

-- Trigger to maintain updated_at
CREATE TRIGGER update_candidate_next_of_kin_updated_at
  BEFORE UPDATE ON public.candidate_next_of_kin
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();