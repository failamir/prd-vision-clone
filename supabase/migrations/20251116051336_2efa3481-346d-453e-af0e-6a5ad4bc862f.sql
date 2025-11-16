-- Create candidate_travel_documents table
CREATE TABLE public.candidate_travel_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  candidate_id UUID NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL, -- 'passport', 'visa', 'seaman_book', etc.
  document_number TEXT,
  issue_date DATE,
  expiry_date DATE,
  issuing_country TEXT,
  issuing_authority TEXT,
  file_path TEXT,
  file_name TEXT,
  file_type TEXT,
  file_size INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create candidate_emergency_contacts table
CREATE TABLE public.candidate_emergency_contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  candidate_id UUID NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  relationship TEXT NOT NULL,
  phone TEXT NOT NULL,
  alternative_phone TEXT,
  email TEXT,
  address TEXT,
  city TEXT,
  country TEXT,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.candidate_travel_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_emergency_contacts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for candidate_travel_documents
CREATE POLICY "Users can manage their own travel documents"
  ON public.candidate_travel_documents
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM candidate_profiles
      WHERE candidate_profiles.id = candidate_travel_documents.candidate_id
      AND candidate_profiles.user_id = auth.uid()
    )
  );

-- RLS Policies for candidate_emergency_contacts
CREATE POLICY "Users can manage their own emergency contacts"
  ON public.candidate_emergency_contacts
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM candidate_profiles
      WHERE candidate_profiles.id = candidate_emergency_contacts.candidate_id
      AND candidate_profiles.user_id = auth.uid()
    )
  );

-- Create triggers for updated_at
CREATE TRIGGER update_candidate_travel_documents_updated_at
  BEFORE UPDATE ON public.candidate_travel_documents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_candidate_emergency_contacts_updated_at
  BEFORE UPDATE ON public.candidate_emergency_contacts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();