-- Drop the problematic policy that causes infinite recursion
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;

-- Create a new SELECT policy that uses the security definer function
CREATE POLICY "Users can view roles"
ON public.user_roles
FOR SELECT
USING (
  -- Users can see their own roles
  auth.uid() = user_id
  OR
  -- OR users who are admins can see all roles (using security definer function)
  public.has_role(auth.uid(), 'admin'::app_role)
);