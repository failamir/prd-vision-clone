-- Fix the DELETE policy that also has infinite recursion
DROP POLICY IF EXISTS "Admins can delete roles" ON public.user_roles;

CREATE POLICY "Admins can delete roles"
ON public.user_roles
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'::app_role));