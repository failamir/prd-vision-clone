-- Allow admins to update candidate profiles (for profile_step_unlocked)
CREATE POLICY "Admins can update all profiles" 
ON public.candidate_profiles 
FOR UPDATE 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));