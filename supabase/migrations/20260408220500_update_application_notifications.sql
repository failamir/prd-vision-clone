-- Update notify_application_update function to handle more fields and notify Admins
CREATE OR REPLACE FUNCTION public.notify_application_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    _candidate_user_id UUID;
    _performer_user_id UUID := auth.uid();
    _job_title TEXT;
    _notification_type TEXT := 'info';
    _title TEXT := 'Application Updated';
    _message TEXT;
    _candidate_link TEXT := '/candidate/applications';
    _admin_link TEXT := '/admin/applications';
    _changes TEXT[] := ARRAY[]::TEXT[];
    _admin_user_id UUID;
BEGIN
    -- Get candidate's auth user_id
    SELECT cp.user_id INTO _candidate_user_id
    FROM public.candidate_profiles cp
    WHERE cp.id = NEW.candidate_id;

    -- Get job title
    SELECT j.title INTO _job_title
    FROM public.jobs j
    WHERE j.id = NEW.job_id;

    -- Detect changes and set notification type
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        _changes := _changes || ('Status: ' || NEW.status);
        _notification_type := 'status_change';
        IF NEW.status = 'interview' THEN
            _notification_type := 'interview';
        ELSIF NEW.status IN ('approved', 'hired', 'shortlisted') THEN
            _notification_type := 'success';
        ELSIF NEW.status = 'rejected' THEN
            _notification_type := 'error';
        END IF;
    END IF;

    IF OLD.remarks IS DISTINCT FROM NEW.remarks THEN
        _changes := _changes || ('Remarks: ' || NEW.remarks);
        IF _notification_type = 'info' THEN _notification_type := 'status_change'; END IF;
    END IF;

    IF OLD.interview_result IS DISTINCT FROM NEW.interview_result THEN
        _changes := _changes || ('Interview Result: ' || NEW.interview_result);
        _notification_type := 'interview';
    END IF;

    IF OLD.principal_interview_result IS DISTINCT FROM NEW.principal_interview_result THEN
        _changes := _changes || ('Principal Interview Result: ' || NEW.principal_interview_result);
        _notification_type := 'interview';
    END IF;

    IF OLD.approved_as IS DISTINCT FROM NEW.approved_as THEN
        _changes := _changes || ('Approved As: ' || NEW.approved_as);
        _notification_type := 'success';
    END IF;

    -- If no monitored fields changed, return
    IF array_length(_changes, 1) IS NULL THEN
        RETURN NEW;
    END IF;

    -- Base message
    _message := 'Application for "' || COALESCE(_job_title, 'Position') || '" updated: ' || array_to_string(_changes, ', ');

    -- 1. Insert notification for the CANDIDATE
    IF _candidate_user_id IS NOT NULL THEN
        INSERT INTO public.notifications (user_id, title, message, type, link, metadata)
        VALUES (
            _candidate_user_id,
            _title,
            'Your application for "' || COALESCE(_job_title, 'Position') || '" has been updated: ' || array_to_string(_changes, ', '),
            _notification_type,
            _candidate_link,
            jsonb_build_object(
                'application_id', NEW.id,
                'job_id', NEW.job_id,
                'changes', _changes,
                'role', 'candidate'
            )
        );
    END IF;

    -- 2. Insert notification for ADMINISTRATIVE USERS (Admins, Superadmins, PICs)
    -- We notify the performer (as a confirmation) and other relevant admins
    FOR _admin_user_id IN 
        SELECT DISTINCT user_id 
        FROM public.user_roles 
        WHERE role IN ('admin', 'superadmin', 'pic')
    LOOP
        -- Don't double-notify if admin is also the candidate (unlikely but possible)
        IF _admin_user_id IS DISTINCT FROM _candidate_user_id THEN
            INSERT INTO public.notifications (user_id, title, message, type, link, metadata)
            VALUES (
                _admin_user_id,
                _title,
                COALESCE((SELECT full_name FROM public.candidate_profiles WHERE id = NEW.candidate_id), 'A candidate') || 
                '''s application for "' || COALESCE(_job_title, 'Position') || '" was updated: ' || array_to_string(_changes, ', '),
                _notification_type,
                _admin_link,
                jsonb_build_object(
                    'application_id', NEW.id,
                    'job_id', NEW.job_id,
                    'changes', _changes,
                    'role', 'admin',
                    'performer_id', _performer_user_id
                )
            );
        END IF;
    END LOOP;

    RETURN NEW;
END;
$$;

-- Trigger remains the same
DROP TRIGGER IF EXISTS on_application_update ON public.job_applications;
CREATE TRIGGER on_application_update
    AFTER UPDATE ON public.job_applications
    FOR EACH ROW
    EXECUTE FUNCTION public.notify_application_update();
