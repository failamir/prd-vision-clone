import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  InputOTP, 
  InputOTPGroup, 
  InputOTPSlot, 
  InputOTPSeparator 
} from "@/components/ui/input-otp";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, RefreshCw, CheckCircle } from "lucide-react";

interface EmailOTPVerificationProps {
  email: string;
  firstName: string;
  onVerified: () => void;
  onBack: () => void;
}

export function EmailOTPVerification({ 
  email, 
  firstName, 
  onVerified, 
  onBack 
}: EmailOTPVerificationProps) {
  const { toast } = useToast();
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter the complete 6-digit verification code",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);

    try {
      const { data, error } = await supabase.functions.invoke("verify-otp", {
        body: { email, otp },
      });

      if (error) throw error;

      if (data?.success) {
        toast({
          title: "Email Verified!",
          description: "Your email has been verified successfully.",
        });
        onVerified();
      } else {
        throw new Error(data?.error || "Verification failed");
      }
    } catch (error: any) {
      console.error("OTP verification error:", error);
      toast({
        title: "Verification Failed",
        description: error.message || "Invalid verification code. Please try again.",
        variant: "destructive",
      });
      setOtp("");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    setIsResending(true);
    setCanResend(false);
    setCountdown(60);

    try {
      const { data, error } = await supabase.functions.invoke("send-otp", {
        body: { email, firstName },
      });

      if (error) throw error;

      if (data?.success) {
        toast({
          title: "Code Sent",
          description: "A new verification code has been sent to your email.",
        });
      } else {
        throw new Error(data?.error || "Failed to send code");
      }
    } catch (error: any) {
      console.error("Resend OTP error:", error);
      toast({
        title: "Failed to Send",
        description: error.message || "Could not send verification code. Please try again.",
        variant: "destructive",
      });
      setCanResend(true);
    } finally {
      setIsResending(false);
    }
  };

  // Auto-verify when OTP is complete
  useEffect(() => {
    if (otp.length === 6) {
      handleVerify();
    }
  }, [otp]);

  return (
    <div className="space-y-6 text-center">
      <div className="flex justify-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
          <Mail className="w-8 h-8 text-primary" />
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Verify Your Email</h2>
        <p className="text-muted-foreground">
          We've sent a 6-digit verification code to
        </p>
        <p className="font-medium text-foreground">{email}</p>
      </div>

      <div className="flex justify-center">
        <InputOTP 
          value={otp} 
          onChange={(value) => setOtp(value)} 
          maxLength={6}
          disabled={isVerifying}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>

      <Button
        onClick={handleVerify}
        disabled={otp.length !== 6 || isVerifying}
        className="w-full"
        size="lg"
      >
        {isVerifying ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Verifying...
          </>
        ) : (
          <>
            <CheckCircle className="w-4 h-4 mr-2" />
            Verify Email
          </>
        )}
      </Button>

      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Didn't receive the code?
        </p>
        <Button
          variant="ghost"
          onClick={handleResend}
          disabled={!canResend || isResending}
          className="text-primary"
        >
          {isResending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Sending...
            </>
          ) : canResend ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              Resend Code
            </>
          ) : (
            `Resend in ${countdown}s`
          )}
        </Button>
      </div>

      <Button
        variant="link"
        onClick={onBack}
        className="text-muted-foreground"
      >
        ← Back to registration
      </Button>
    </div>
  );
}
