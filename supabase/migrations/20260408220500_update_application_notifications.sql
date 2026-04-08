-- Update notify_application_status_change function to handle more fields
CREATE OR REPLACE FUNCTION public.notify_application_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    _candidate_user_id UUID;
    _job_title TEXT;
    _notification_type TEXT := 'info';
    _title TEXT := 'Application Updated';
    _message TEXT;
    _link TEXT := '/candidate/applications';
    _changes TEXT[] := ARRAY[]::TEXT[];
BEGIN
    -- Get candidate's auth user_id
    SELECT cp.user_id INTO _candidate_user_id
    FROM public.candidate_profiles cp
    WHERE cp.id = NEW.candidate_id;

    -- Get job title
    SELECT j.title INTO _job_title
    FROM public.jobs j
    WHERE j.id = NEW.job_id;

    -- Detect changes
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        _changes := _changes || ('Status: ' || OLD.status || ' -> ' || NEW.status);
        _notification_type := CASE 
            WHEN NEW.status IN ('approved', 'hired', 'shortlisted') THEN 'success'
            WHEN NEW.status = 'rejected' THEN 'error'
            ELSE 'info'
        END;
    END IF;

    IF OLD.remarks IS DISTINCT FROM NEW.remarks THEN
        _changes := _changes || ('Remarks: ' || NEW.remarks);
    END IF;

    IF OLD.interview_result IS DISTINCT FROM NEW.interview_result THEN
        _changes := _changes || ('Interview Result: ' || NEW.interview_result);
    END IF;

    IF OLD.principal_interview_result IS DISTINCT FROM NEW.principal_interview_result THEN
        _changes := _changes || ('Principal Interview Result: ' || NEW.principal_interview_result);
    END IF;

    IF OLD.approved_as IS DISTINCT FROM NEW.approved_as THEN
        _changes := _changes || ('Approved As: ' || NEW.approved_as);
    END IF;

    IF OLD.employment_offer IS DISTINCT FROM NEW.employment_offer THEN
        _changes := _changes || ('Employment Offer: ' || NEW.employment_offer);
    END IF;

    -- If no monitored fields changed, return
    IF array_length(_changes, 1) IS NULL THEN
        RETURN NEW;
    END IF;

    _message := 'Your application for "' || COALESCE(_job_title, 'Unknown Position') || '" has been updated: ' || array_to_string(_changes, ', ');

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
                'changes', _changes
            )
        );
    END IF;

    RETURN NEW;
END;
$$;

-- Replace old trigger with the new one
DROP TRIGGER IF EXISTS on_application_status_change ON public.job_applications;
CREATE TRIGGER on_application_update
    AFTER UPDATE ON public.job_applications
    FOR EACH ROW
    EXECUTE FUNCTION public.notify_application_update();
