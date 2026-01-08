-- Update handle_new_user function to include phone from user metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.candidate_profiles (user_id, full_name, email, phone)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.email),
    new.email,
    new.raw_user_meta_data->>'phone'
  );
  
  -- Also insert candidate role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'candidate');
  
  RETURN new;
END;
$$;