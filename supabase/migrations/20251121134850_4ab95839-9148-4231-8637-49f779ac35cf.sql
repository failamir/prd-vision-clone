-- Create permissions table
CREATE TABLE IF NOT EXISTS public.permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  category text,
  created_at timestamp with time zone DEFAULT now()
);

-- Create role_permissions junction table
CREATE TABLE IF NOT EXISTS public.role_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role app_role NOT NULL,
  permission_id uuid REFERENCES public.permissions(id) ON DELETE CASCADE NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(role, permission_id)
);

-- Enable RLS
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for permissions table
CREATE POLICY "Anyone can view permissions"
ON public.permissions
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can manage permissions"
ON public.permissions
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

-- RLS Policies for role_permissions table
CREATE POLICY "Anyone can view role permissions"
ON public.role_permissions
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can manage role permissions"
ON public.role_permissions
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Create function to check if a user has a specific permission
CREATE OR REPLACE FUNCTION public.has_permission(_user_id uuid, _permission_name text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.role_permissions rp ON ur.role = rp.role
    JOIN public.permissions p ON rp.permission_id = p.id
    WHERE ur.user_id = _user_id
      AND p.name = _permission_name
  )
$$;

-- Insert default permissions
INSERT INTO public.permissions (name, description, category) VALUES
  ('manage_users', 'Can manage user accounts', 'Users'),
  ('manage_roles', 'Can assign and remove roles', 'Users'),
  ('view_users', 'Can view user list', 'Users'),
  ('manage_jobs', 'Can create, edit, and delete jobs', 'Jobs'),
  ('view_jobs', 'Can view job listings', 'Jobs'),
  ('manage_applications', 'Can manage job applications', 'Applications'),
  ('view_applications', 'Can view job applications', 'Applications'),
  ('conduct_interviews', 'Can schedule and conduct interviews', 'Interviews'),
  ('view_interviews', 'Can view interview schedules', 'Interviews'),
  ('manage_departments', 'Can manage departments', 'Departments'),
  ('view_reports', 'Can view system reports', 'Reports'),
  ('manage_testimonials', 'Can approve and manage testimonials', 'Content'),
  ('send_messages', 'Can send messages to users', 'Messages'),
  ('view_messages', 'Can view messages', 'Messages')
ON CONFLICT (name) DO NOTHING;