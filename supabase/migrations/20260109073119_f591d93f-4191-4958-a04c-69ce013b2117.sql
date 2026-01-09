-- Allow admins to view all candidate medical tests
CREATE POLICY "Admins can view all medical tests" 
ON public.candidate_medical_tests 
FOR SELECT 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));