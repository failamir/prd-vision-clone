-- Fix for notification webhook error
-- This migration removes the problematic Authorization header and adds exception handling

CREATE OR REPLACE FUNCTION public.trigger_notification_email()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Call the send-notification-email Edge Function
    -- We removed the Authorization header casting that caused the syntax error
    -- And we wrapped it in a block to prevent failures from blocking updates
    BEGIN
        PERFORM net.http_post(
            url := 'https://inhzuywdomfccuxmwejb.supabase.co/functions/v1/send-notification-email',
            headers := '{"Content-Type": "application/json"}'::jsonb,
            body := jsonb_build_object(
                'record', row_to_json(NEW)
            ),
            timeout_milliseconds := 2000
        );
    EXCEPTION WHEN OTHERS THEN
        -- Log the error but don't fail the transaction
        RAISE WARNING 'Failed to trigger notification email: %', SQLERRM;
    END;
    
    RETURN NEW;
END;
$$;
