-- Add RLS policy for staff/admin to view candidate travel documents
CREATE POLICY "Staff can view candidate travel documents"
ON public.candidate_travel_documents
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