-- Create table for storing OTP codes
CREATE TABLE public.email_otp_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  otp_code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.email_otp_codes ENABLE ROW LEVEL SECURITY;

-- Allow public insert (for sending OTP)
CREATE POLICY "Allow public insert for OTP"
ON public.email_otp_codes
FOR INSERT
WITH CHECK (true);

-- Allow public select (for verifying OTP)
CREATE POLICY "Allow public select for OTP"
ON public.email_otp_codes
FOR SELECT
USING (true);

-- Allow public update (for marking as verified)
CREATE POLICY "Allow public update for OTP"
ON public.email_otp_codes
FOR UPDATE
USING (true);

-- Allow public delete (for cleanup)
CREATE POLICY "Allow public delete for OTP"
ON public.email_otp_codes
FOR DELETE
USING (true);

-- Add index for faster lookups
CREATE INDEX idx_email_otp_codes_email ON public.email_otp_codes(email);
CREATE INDEX idx_email_otp_codes_expires_at ON public.email_otp_codes(expires_at);