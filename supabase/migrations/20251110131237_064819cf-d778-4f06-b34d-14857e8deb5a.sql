-- Drop existing problematic policies
DROP POLICY IF EXISTS "Admins can insert roles" ON public.user_roles;

-- Create a security definer function to insert admin role (bypasses RLS)
CREATE OR REPLACE FUNCTION public.insert_admin_role(target_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert admin role, bypassing RLS
  INSERT INTO public.user_roles (user_id, role)
  VALUES (target_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
END;
$$;

-- Create new policy that allows insert only if no admins exist OR user is already admin
CREATE POLICY "Allow admin role insertion"
ON public.user_roles
FOR INSERT
WITH CHECK (
  -- Allow if no admins exist yet (first admin setup)
  NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin'::app_role)
  OR
  -- OR if the current user is already an admin
  public.has_role(auth.uid(), 'admin'::app_role)
);