-- Allow staff roles to delete job applications
CREATE POLICY "Staff can delete applications"
ON public.job_applications
FOR DELETE
USING (
  has_role(auth.uid(), 'superadmin'::app_role) OR
  has_role(auth.uid(), 'staff'::app_role) OR
  has_role(auth.uid(), 'manager'::app_role) OR
  has_role(auth.uid(), 'hrd'::app_role) OR
  has_role(auth.uid(), 'direktur'::app_role) OR
  has_role(auth.uid(), 'pic'::app_role)
);

-- Allow staff roles to update job applications
CREATE POLICY "Staff can update applications"
ON public.job_applications
FOR UPDATE
USING (
  has_role(auth.uid(), 'superadmin'::app_role) OR
  has_role(auth.uid(), 'staff'::app_role) OR
  has_role(auth.uid(), 'manager'::app_role) OR
  has_role(auth.uid(), 'hrd'::app_role) OR
  has_role(auth.uid(), 'direktur'::app_role) OR
  has_role(auth.uid(), 'pic'::app_role)
);