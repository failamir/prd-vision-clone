-- Create candidate_certificates table for deck certificates
CREATE TABLE public.candidate_certificates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  candidate_id UUID NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE,
  type_certificate TEXT NOT NULL,
  institution TEXT,
  place TEXT,
  cert_number TEXT,
  date_of_issue DATE,
  file_path TEXT,
  file_name TEXT,
  file_type TEXT,
  file_size INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.candidate_certificates ENABLE ROW LEVEL SECURITY;

-- Users can manage their own certificates
CREATE POLICY "Users can manage their own certificates"
ON public.candidate_certificates
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM candidate_profiles
    WHERE candidate_profiles.id = candidate_certificates.candidate_id
    AND candidate_profiles.user_id = auth.uid()
  )
);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_candidate_certificates_updated_at
BEFORE UPDATE ON public.candidate_certificates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();