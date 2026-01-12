-- Allow internal staff roles to view candidate experience records
-- (candidates already have an ALL policy scoped to their own profile)

CREATE POLICY "Staff can view candidate experience"
ON public.candidate_experience
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.role = ANY (
        ARRAY[
          'admin',
          'superadmin',
          'staff',
          'manajer',
          'manager',
          'hrd',
          'direktur',
          'pic',
          'interviewer',
          'interviewer_principal'
        ]::public.app_role[]
      )
  )
);