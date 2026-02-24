-- Create audit logs table
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name TEXT NOT NULL,
    record_id UUID,
    operation TEXT NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
    old_data JSONB,
    new_data JSONB,
    changed_by UUID REFERENCES auth.users(id),
    changed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs"
    ON public.audit_logs
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() 
            AND role = 'admin'
        )
    );

-- Audit logging function
CREATE OR REPLACE FUNCTION public.log_audit_event()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    _user_id UUID;
    _old_data JSONB;
    _new_data JSONB;
BEGIN
    -- Get current user ID if available
    _user_id := auth.uid();
    
    IF TG_OP = 'INSERT' THEN
        _old_data := null;
        _new_data := to_jsonb(NEW);
    ELSIF TG_OP = 'UPDATE' THEN
        _old_data := to_jsonb(OLD);
        _new_data := to_jsonb(NEW);
    ELSIF TG_OP = 'DELETE' THEN
        _old_data := to_jsonb(OLD);
        _new_data := null;
    END IF;

    INSERT INTO public.audit_logs (
        table_name,
        record_id,
        operation,
        old_data,
        new_data,
        changed_by
    )
    VALUES (
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        TG_OP,
        _old_data,
        _new_data,
        _user_id
    );

    RETURN COALESCE(NEW, OLD);
END;
$$;

-- Add triggers to key tables

-- Candidate Profiles
DROP TRIGGER IF EXISTS audit_candidate_profiles ON public.candidate_profiles;
CREATE TRIGGER audit_candidate_profiles
    AFTER INSERT OR UPDATE OR DELETE ON public.candidate_profiles
    FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();

-- Jobs
DROP TRIGGER IF EXISTS audit_jobs ON public.jobs;
CREATE TRIGGER audit_jobs
    AFTER INSERT OR UPDATE OR DELETE ON public.jobs
    FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();

-- Job Applications
DROP TRIGGER IF EXISTS audit_job_applications ON public.job_applications;
CREATE TRIGGER audit_job_applications
    AFTER INSERT OR UPDATE OR DELETE ON public.job_applications
    FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();

-- User Roles
DROP TRIGGER IF EXISTS audit_user_roles ON public.user_roles;
CREATE TRIGGER audit_user_roles
    AFTER INSERT OR UPDATE OR DELETE ON public.user_roles
    FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();
