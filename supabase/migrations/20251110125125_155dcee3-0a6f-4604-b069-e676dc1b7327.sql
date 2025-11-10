-- Create admin user
-- Note: This uses a hardcoded UUID for the admin user
-- Password will be: r4h4s14 (hashed by Supabase)

-- Insert admin user into auth.users
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  role,
  aud
) VALUES (
  'a0000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000000',
  'admin@ciptawiratirta.com',
  crypt('r4h4s14', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Admin User"}',
  now(),
  now(),
  'authenticated',
  'authenticated'
);

-- Insert admin role
INSERT INTO public.user_roles (user_id, role)
VALUES ('a0000000-0000-0000-0000-000000000001', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- Create admin profile
INSERT INTO public.candidate_profiles (
  user_id,
  full_name,
  email
) VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'Admin User',
  'admin@ciptawiratirta.com'
)
ON CONFLICT (user_id) DO NOTHING;