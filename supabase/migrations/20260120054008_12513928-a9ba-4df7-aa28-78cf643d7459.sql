-- Create superadmin user using Supabase auth
-- Note: This creates the user in auth.users and triggers handle_new_user for candidate_profile

-- First, we'll use the admin signup endpoint via a different approach
-- Since we can't directly create auth users via SQL, we'll need to:
-- 1. The user will be created via the Supabase dashboard or API
-- 2. Then we assign the superadmin role

-- For now, let's check if the function assign_admin_role exists and create a helper
-- that can be used to assign superadmin role once the user exists

-- Create a function to assign superadmin role by email
CREATE OR REPLACE FUNCTION public.assign_superadmin_role(user_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
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

  -- Insert superadmin role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (target_user_id, 'superadmin')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  -- Also add admin role for full access
  INSERT INTO public.user_roles (user_id, role)
  VALUES (target_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN true;
END;
$$;