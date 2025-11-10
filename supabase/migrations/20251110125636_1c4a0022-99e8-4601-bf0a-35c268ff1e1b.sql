-- Fix the admin user issue by removing the manually created user
-- We'll create a proper admin user through the auth system instead

-- First, remove the incorrectly created admin user
DELETE FROM public.user_roles WHERE user_id = 'a0000000-0000-0000-0000-000000000001';
DELETE FROM public.candidate_profiles WHERE user_id = 'a0000000-0000-0000-0000-000000000001';
DELETE FROM auth.users WHERE id = 'a0000000-0000-0000-0000-000000000001';

-- Create a function to safely assign admin role to a user by email
CREATE OR REPLACE FUNCTION public.assign_admin_role(user_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_user_id uuid;
BEGIN
  -- Get user id from auth.users by email
  SELECT id INTO target_user_id
  FROM auth.users
  WHERE email = user_email;

  -- If user doesn't exist, return false
  IF target_user_id IS NULL THEN
    RETURN false;
  END IF;

  -- Insert admin role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (target_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN true;
END;
$$;

-- Add policies for role management (admins can manage roles)
CREATE POLICY "Admins can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
);

CREATE POLICY "Admins can delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
);