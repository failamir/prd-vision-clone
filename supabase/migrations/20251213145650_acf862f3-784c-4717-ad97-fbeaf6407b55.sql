-- Create candidate_form_letters table for storing form letter documents
CREATE TABLE public.candidate_form_letters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  candidate_id UUID NOT NULL REFERENCES public.candidate_profiles(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  file_type TEXT,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.candidate_form_letters ENABLE ROW LEVEL SECURITY;

-- Create policy for users to manage their own form letters
CREATE POLICY "Users can manage their own form letters" 
ON public.candidate_form_letters 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM candidate_profiles 
  WHERE candidate_profiles.id = candidate_form_letters.candidate_id 
  AND candidate_profiles.user_id = auth.uid()
));