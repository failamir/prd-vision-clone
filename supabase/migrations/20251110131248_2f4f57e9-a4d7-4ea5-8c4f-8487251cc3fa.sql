-- Fix the function search path security issue
DROP FUNCTION IF EXISTS public.insert_admin_role(uuid);

CREATE OR REPLACE FUNCTION public.insert_admin_role(target_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Insert admin role, bypassing RLS
  INSERT INTO public.user_roles (user_id, role)
  VALUES (target_user_id, 'admin'::public.app_role)
  ON CONFLICT (user_id, role) DO NOTHING;
END;
$$;