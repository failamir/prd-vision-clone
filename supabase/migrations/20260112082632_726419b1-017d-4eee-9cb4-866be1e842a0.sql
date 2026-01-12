-- Add RLS policy for staff/admin to view candidate certificates
CREATE POLICY "Staff can view candidate certificates"
ON public.candidate_certificates
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'superadmin'::app_role) OR
  public.has_role(auth.uid(), 'admin'::app_role) OR
  public.has_role(auth.uid(), 'staff'::app_role) OR
  public.has_role(auth.uid(), 'manager'::app_role) OR
  public.has_role(auth.uid(), 'hrd'::app_role) OR
  public.has_role(auth.uid(), 'direktur'::app_role) OR
  public.has_role(auth.uid(), 'pic'::app_role) OR
  public.has_role(auth.uid(), 'interviewer'::app_role)
);