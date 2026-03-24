-- Create storage bucket for database backups
INSERT INTO storage.buckets (id, name, public)
VALUES ('database-backups', 'database-backups', false)
ON CONFLICT (id) DO NOTHING;

-- Allow admins to manage backup files
CREATE POLICY "Admins can manage backups"
ON storage.objects FOR ALL
TO authenticated
USING (
  bucket_id = 'database-backups' 
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
)
WITH CHECK (
  bucket_id = 'database-backups' 
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);