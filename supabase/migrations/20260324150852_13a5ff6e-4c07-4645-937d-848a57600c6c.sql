-- 1. Insert candidate role for users who have no roles
INSERT INTO public.user_roles (user_id, role)
SELECT au.id, 'candidate'::app_role
FROM auth.users au
LEFT JOIN public.user_roles ur ON au.id = ur.user_id
WHERE ur.id IS NULL
ON CONFLICT (user_id, role) DO NOTHING;

-- 2. Archive candidate_profiles for those users who just got candidate role assigned
UPDATE public.candidate_profiles
SET is_archived = true, archived_at = now()
WHERE user_id IN (
  SELECT ur.user_id
  FROM public.user_roles ur
  WHERE ur.role = 'candidate'
  AND ur.created_at > now() - interval '5 minutes'
)
AND is_archived = false;