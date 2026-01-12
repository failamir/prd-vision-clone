-- Add RLS policy for staff to view candidate emergency contacts
CREATE POLICY "Staff can view candidate emergency contacts"
ON public.candidate_emergency_contacts
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role IN ('admin', 'superadmin', 'staff', 'manajer', 'manager', 'hrd', 'direktur', 'pic', 'interviewer', 'interviewer_principal')
  )
);