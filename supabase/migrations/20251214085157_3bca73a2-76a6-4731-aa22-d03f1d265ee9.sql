-- Add new roles to app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'superadmin';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'direktur';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'pic';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'manager';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'interviewer';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'hrd';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'staff';