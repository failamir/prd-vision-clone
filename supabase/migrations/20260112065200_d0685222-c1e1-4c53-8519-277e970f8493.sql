-- Add RLS policy for staff to view candidate education records
CREATE POLICY "Staff can view candidate education"
  ON public.candidate_education
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role IN ('admin', 'superadmin', 'staff', 'manajer', 'manager', 'hrd', 'direktur', 'pic', 'interviewer', 'interviewer_principal')
    )
  );