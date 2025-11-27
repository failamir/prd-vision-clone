-- Add RLS policy to allow admins to view all candidate profiles
CREATE POLICY "Admins can view all profiles"
ON candidate_profiles
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);