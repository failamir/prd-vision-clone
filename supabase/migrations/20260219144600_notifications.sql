-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'info',  -- 'info', 'success', 'warning', 'error', 'status_change', 'interview', 'departure'
    is_read BOOLEAN NOT NULL DEFAULT false,
    link TEXT,  -- optional in-app link, e.g. '/candidate/applications'
    metadata JSONB DEFAULT '{}',  -- extra data (application_id, job_id, etc.)
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users can only view their own notifications
CREATE POLICY "Users can view own notifications"
    ON public.notifications
    FOR SELECT
    USING (auth.uid() = user_id);

-- Users can update (mark as read) their own notifications
CREATE POLICY "Users can update own notifications"
    ON public.notifications
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Users can delete their own notifications
CREATE POLICY "Users can delete own notifications"
    ON public.notifications
    FOR DELETE
    USING (auth.uid() = user_id);

-- System can insert notifications (via trigger with SECURITY DEFINER)
CREATE POLICY "System can insert notifications"
    ON public.notifications
    FOR INSERT
    WITH CHECK (true);

-- Index for fast lookups
CREATE INDEX idx_notifications_user_id_created ON public.notifications (user_id, created_at DESC);
CREATE INDEX idx_notifications_user_id_unread ON public.notifications (user_id, is_read) WHERE is_read = false;

-- Enable Supabase Realtime for notifications table
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- ──────────────────────────────────────────────
-- Trigger: auto-create notification on application status change
-- ──────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.notify_application_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    _candidate_user_id UUID;
    _job_title TEXT;
    _status_label TEXT;
    _notification_type TEXT;
    _title TEXT;
    _message TEXT;
    _link TEXT;
BEGIN
    -- Only fire on status changes
    IF OLD.status IS NOT DISTINCT FROM NEW.status THEN
        RETURN NEW;
    END IF;

    -- Get candidate's auth user_id
    SELECT cp.user_id INTO _candidate_user_id
    FROM public.candidate_profiles cp
    WHERE cp.id = NEW.candidate_id;

    -- Get job title
    SELECT j.title INTO _job_title
    FROM public.jobs j
    WHERE j.id = NEW.job_id;

    -- Map status to user-friendly labels
    CASE NEW.status
        WHEN 'pending' THEN
            _status_label := 'Pending Review';
            _notification_type := 'info';
        WHEN 'reviewed' THEN
            _status_label := 'Under Review';
            _notification_type := 'info';
        WHEN 'shortlisted' THEN
            _status_label := 'Shortlisted';
            _notification_type := 'success';
        WHEN 'interview' THEN
            _status_label := 'Interview Scheduled';
            _notification_type := 'interview';
        WHEN 'offered' THEN
            _status_label := 'Offer Extended';
            _notification_type := 'success';
        WHEN 'approved' THEN
            _status_label := 'Approved';
            _notification_type := 'success';
        WHEN 'hired' THEN
            _status_label := 'Hired';
            _notification_type := 'success';
        WHEN 'rejected' THEN
            _status_label := 'Not Selected';
            _notification_type := 'error';
        WHEN 'withdrawn' THEN
            _status_label := 'Withdrawn';
            _notification_type := 'warning';
        ELSE
            _status_label := NEW.status;
            _notification_type := 'info';
    END CASE;

    _title := 'Application Status Updated';
    _message := 'Your application for "' || COALESCE(_job_title, 'Unknown Position') || '" has been updated to: ' || _status_label;
    _link := '/candidate/applications';

    -- Insert notification for the candidate
    IF _candidate_user_id IS NOT NULL THEN
        INSERT INTO public.notifications (user_id, title, message, type, link, metadata)
        VALUES (
            _candidate_user_id,
            _title,
            _message,
            _notification_type,
            _link,
            jsonb_build_object(
                'application_id', NEW.id,
                'job_id', NEW.job_id,
                'old_status', OLD.status,
                'new_status', NEW.status
            )
        );
    END IF;

    RETURN NEW;
END;
$$;

-- Attach trigger to job_applications
DROP TRIGGER IF EXISTS on_application_status_change ON public.job_applications;
CREATE TRIGGER on_application_status_change
    AFTER UPDATE ON public.job_applications
    FOR EACH ROW
    EXECUTE FUNCTION public.notify_application_status_change();

-- ──────────────────────────────────────────────
-- Trigger: notify when interview is scheduled
-- ──────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.notify_interview_scheduled()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    _candidate_user_id UUID;
    _job_title TEXT;
    _formatted_date TEXT;
BEGIN
    -- Only fire when interview_date is newly set
    IF OLD.interview_date IS NOT NULL OR NEW.interview_date IS NULL THEN
        RETURN NEW;
    END IF;

    -- Get candidate user_id
    SELECT cp.user_id INTO _candidate_user_id
    FROM public.candidate_profiles cp
    WHERE cp.id = NEW.candidate_id;

    -- Get job title
    SELECT j.title INTO _job_title
    FROM public.jobs j
    WHERE j.id = NEW.job_id;

    _formatted_date := to_char(NEW.interview_date::date, 'DD Mon YYYY');

    IF _candidate_user_id IS NOT NULL THEN
        INSERT INTO public.notifications (user_id, title, message, type, link, metadata)
        VALUES (
            _candidate_user_id,
            'Interview Scheduled',
            'Your interview for "' || COALESCE(_job_title, 'Unknown Position') || '" has been scheduled for ' || _formatted_date || '.',
            'interview',
            '/candidate/interview-schedule',
            jsonb_build_object(
                'application_id', NEW.id,
                'job_id', NEW.job_id,
                'interview_date', NEW.interview_date
            )
        );
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_interview_scheduled ON public.job_applications;
CREATE TRIGGER on_interview_scheduled
    AFTER UPDATE ON public.job_applications
    FOR EACH ROW
    EXECUTE FUNCTION public.notify_interview_scheduled();
