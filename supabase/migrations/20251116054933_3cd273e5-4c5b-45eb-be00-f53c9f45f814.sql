-- Create candidate_references table for professional references
CREATE TABLE IF NOT EXISTS public.candidate_references (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  candidate_id UUID NOT NULL,
  full_name TEXT NOT NULL,
  company TEXT,
  position TEXT,
  relationship TEXT,
  phone TEXT NOT NULL,
  email TEXT,
  address TEXT,
  city TEXT,
  country TEXT,
  years_known INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT candidate_references_candidate_id_fkey 
    FOREIGN KEY (candidate_id) 
    REFERENCES public.candidate_profiles(id) 
    ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE public.candidate_references ENABLE ROW LEVEL SECURITY;

-- RLS Policies for candidate_references
CREATE POLICY "Users can view their own references"
  ON public.candidate_references
  FOR SELECT
  USING (auth.uid() IN (
    SELECT user_id FROM public.candidate_profiles WHERE id = candidate_references.candidate_id
  ));

CREATE POLICY "Users can insert their own references"
  ON public.candidate_references
  FOR INSERT
  WITH CHECK (auth.uid() IN (
    SELECT user_id FROM public.candidate_profiles WHERE id = candidate_references.candidate_id
  ));

CREATE POLICY "Users can update their own references"
  ON public.candidate_references
  FOR UPDATE
  USING (auth.uid() IN (
    SELECT user_id FROM public.candidate_profiles WHERE id = candidate_references.candidate_id
  ));

CREATE POLICY "Users can delete their own references"
  ON public.candidate_references
  FOR DELETE
  USING (auth.uid() IN (
    SELECT user_id FROM public.candidate_profiles WHERE id = candidate_references.candidate_id
  ));

-- Add trigger for updated_at
CREATE TRIGGER update_candidate_references_updated_at
  BEFORE UPDATE ON public.candidate_references
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();