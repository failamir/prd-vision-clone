
-- Allow PIC, HRD, and other staff roles to view job applications
CREATE POLICY "Staff can view all applications"
ON public.job_applications
FOR SELECT
USING (
  has_role(auth.uid(), 'superadmin'::app_role) OR
  has_role(auth.uid(), 'staff'::app_role) OR
  has_role(auth.uid(), 'manager'::app_role) OR
  has_role(auth.uid(), 'hrd'::app_role) OR
  has_role(auth.uid(), 'direktur'::app_role) OR
  has_role(auth.uid(), 'pic'::app_role) OR
  has_role(auth.uid(), 'interviewer'::app_role) OR
  has_role(auth.uid(), 'interviewer_principal'::app_role)
);
