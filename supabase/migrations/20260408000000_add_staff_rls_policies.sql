
-- Helper function to check if a user has any administrative/staff role
CREATE OR REPLACE FUNCTION public.is_staff(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id 
    AND role::text IN (
      'admin', 'superadmin', 'pic', 'hrd', 'manager', 'manajer', 
      'direktur', 'staff', 'interviewer', 'interviewer_principal'
    )
  )
$$;

-- Table: candidate_medical_tests
-- Allow staff to manage all records (needed for "Update Test Score")
CREATE POLICY "Staff can manage all medical tests" 
ON public.candidate_medical_tests 
FOR ALL 
TO authenticated
USING (public.is_staff(auth.uid()))
WITH CHECK (public.is_staff(auth.uid()));

-- Table: job_applications
-- Allow staff to manage all applications
CREATE POLICY "Staff can manage all applications" 
ON public.job_applications 
FOR ALL 
TO authenticated
USING (public.is_staff(auth.uid()))
WITH CHECK (public.is_staff(auth.uid()));

-- Table: candidate_profiles
-- Allow staff to view all profiles and update them (needed for "Profile Step Access")
CREATE POLICY "Staff can view all profiles" 
ON public.candidate_profiles 
FOR SELECT 
TO authenticated
USING (public.is_staff(auth.uid()));

CREATE POLICY "Staff can update all profiles" 
ON public.candidate_profiles 
FOR UPDATE 
TO authenticated
USING (public.is_staff(auth.uid()))
WITH CHECK (public.is_staff(auth.uid()));

-- Table: candidate_documents
-- Allow staff to view and manage documents (needed for file downloads/uploads)
CREATE POLICY "Staff can manage all documents" 
ON public.candidate_documents 
FOR ALL 
TO authenticated
USING (public.is_staff(auth.uid()))
WITH CHECK (public.is_staff(auth.uid()));

-- Table: candidate_experience
-- Allow staff to view experience data for recruitment process
CREATE POLICY "Staff can view all experience" 
ON public.candidate_experience 
FOR SELECT 
TO authenticated
USING (public.is_staff(auth.uid()));

-- Table: candidate_education
-- Allow staff to view education data
CREATE POLICY "Staff can view all education" 
ON public.candidate_education 
FOR SELECT 
TO authenticated
USING (public.is_staff(auth.uid()));

-- Table: candidate_certificates
-- Allow staff to view certificates
CREATE POLICY "Staff can view all certificates" 
ON public.candidate_certificates 
FOR SELECT 
TO authenticated
USING (public.is_staff(auth.uid()));
