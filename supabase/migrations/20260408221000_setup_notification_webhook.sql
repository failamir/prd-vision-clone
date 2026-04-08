-- Enable pg_net extension for webhooks
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Function to trigger the notification email edge function
CREATE OR REPLACE FUNCTION public.trigger_notification_email()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Call the send-notification-email Edge Function
    -- Note: Replace '<project_id>' with your actual Supabase project ID in production
    -- For local development, this usually won't work unless you use localhost/docker bridge
    PERFORM net.http_post(
        url := 'https://inhzuywdomfccuxmwejb.supabase.co/functions/v1/send-notification-email',
        headers := jsonb_build_object(
            'Content-Type', 'application/json',
            'Authorization', 'Bearer ' || current_setting('request.headers', true)::jsonb->>'apikey'
        ),
        body := jsonb_build_object(
            'record', row_to_json(NEW)
        )
    );
    RETURN NEW;
END;
$$;

-- Trigger to call the function on every new notification
DROP TRIGGER IF EXISTS on_notification_created ON public.notifications;
CREATE TRIGGER on_notification_created
    AFTER INSERT ON public.notifications
    FOR EACH ROW
    EXECUTE FUNCTION public.trigger_notification_email();
