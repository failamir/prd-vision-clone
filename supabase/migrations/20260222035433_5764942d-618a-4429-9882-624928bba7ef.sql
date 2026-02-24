CREATE POLICY "Superadmins can delete profiles"
ON public.candidate_profiles
FOR DELETE
USING (has_role(auth.uid(), 'superadmin'::app_role));