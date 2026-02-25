
-- ================================================
-- Fix overly permissive RLS on contact_submissions
-- ================================================

-- Drop existing permissive policies
DROP POLICY IF EXISTS "Allow authenticated select" ON public.contact_submissions;
DROP POLICY IF EXISTS "Allow authenticated update" ON public.contact_submissions;
DROP POLICY IF EXISTS "Allow authenticated delete" ON public.contact_submissions;

-- Restrict SELECT to admin/superadmin
CREATE POLICY "Admins can view contact submissions"
ON public.contact_submissions
FOR SELECT
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'superadmin'::app_role) OR
  has_role(auth.uid(), 'hrd'::app_role) OR
  has_role(auth.uid(), 'direktur'::app_role)
);

-- Restrict UPDATE to admin/superadmin
CREATE POLICY "Admins can update contact submissions"
ON public.contact_submissions
FOR UPDATE
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'superadmin'::app_role)
);

-- Restrict DELETE to admin/superadmin
CREATE POLICY "Admins can delete contact submissions"
ON public.contact_submissions
FOR DELETE
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'superadmin'::app_role)
);

-- ================================================
-- Fix overly permissive RLS on email_otp_codes
-- Edge functions use service_role_key (bypasses RLS)
-- so we can safely restrict client-side access
-- ================================================

DROP POLICY IF EXISTS "Allow public delete for OTP" ON public.email_otp_codes;
DROP POLICY IF EXISTS "Allow public insert for OTP" ON public.email_otp_codes;
DROP POLICY IF EXISTS "Allow public select for OTP" ON public.email_otp_codes;
DROP POLICY IF EXISTS "Allow public update for OTP" ON public.email_otp_codes;

-- No client-side access needed - all OTP operations go through edge functions with service_role_key
-- Only admins can view OTP records for debugging purposes
CREATE POLICY "Admins can view OTP codes"
ON public.email_otp_codes
FOR SELECT
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'superadmin'::app_role)
);
