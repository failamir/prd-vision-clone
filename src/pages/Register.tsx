import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, AlertCircle, Briefcase } from "lucide-react";
import logo from "@/assets/logo-dark.png";
import { EmailOTPVerification } from "@/components/auth/EmailOTPVerification";

type RegistrationStep = "form" | "otp" | "complete";

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get("job");
  const { toast } = useToast();
  const userType = "candidate"; // Fixed as candidate only
  
  const [step, setStep] = useState<RegistrationStep>("form");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+62");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sendingOTP, setSendingOTP] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  

  // Direct access is now allowed - no job parameter required

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        // If there's a pending job application, redirect to that job
        if (jobId) {
          navigate(`/jobs/${jobId}?apply=true`);
        } else {
          navigate("/candidate/dashboard");
        }
      }
    });
  }, [navigate, jobId]);

  const validateField = (field: string, value: string): string => {
    switch (field) {
      case 'firstName':
        if (!value.trim()) return 'First name is required';
        return '';
      case 'lastName':
        if (!value.trim()) return 'Last name is required';
        return '';
      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address';
        return '';
      case 'phone':
        if (!value.trim() || value === '+62') return 'Phone number is required';
        if (!/^\+62\d{9,13}$/.test(value.replace(/\s/g, ''))) return 'Please enter a valid Indonesian phone number';
        return '';
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 6) return 'Password must be at least 6 characters';
        return '';
      case 'confirmPassword':
        if (!value) return 'Please confirm your password';
        if (value !== password) return 'Passwords do not match';
        return '';
      default:
        return '';
    }
  };

  const handleInputChange = (field: string, value: string) => {
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }

    switch (field) {
      case 'firstName':
        setFirstName(value);
        break;
      case 'lastName':
        setLastName(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'phone':
        // Ensure +62 prefix is always present
        if (!value.startsWith('+62')) {
          value = '+62' + value.replace(/^\+?62?/, '');
        }
        setPhone(value);
        break;
      case 'password':
        setPassword(value);
        break;
      case 'confirmPassword':
        setConfirmPassword(value);
        break;
    }
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const newErrors: Record<string, string> = {};
    newErrors.firstName = validateField('firstName', firstName);
    newErrors.lastName = validateField('lastName', lastName);
    newErrors.email = validateField('email', email);
    newErrors.phone = validateField('phone', phone);
    newErrors.password = validateField('password', password);
    newErrors.confirmPassword = validateField('confirmPassword', confirmPassword);

    if (!agreedToTerms) {
      newErrors.terms = 'You must agree to the terms and conditions';
    }

    // Filter out empty errors
    const filteredErrors = Object.fromEntries(
      Object.entries(newErrors).filter(([_, v]) => v !== '')
    );

    if (Object.keys(filteredErrors).length > 0) {
      setErrors(filteredErrors);
      toast({
        title: "Validation Error",
        description: "Please check the form for errors",
        variant: "destructive",
      });
      return;
    }

    setSendingOTP(true);

    try {
      // Check if email already exists on active account
      const { data: existingEmail } = await supabase
        .from('candidate_profiles')
        .select('email, is_archived, full_name')
        .eq('email', email)
        .maybeSingle();

      if (existingEmail) {
        if (!existingEmail.is_archived) {
          setErrors({ email: 'This email is already registered. Please login instead.' });
          toast({
            title: "Email Sudah Terdaftar",
            description: `Email ini sudah digunakan oleh akun atas nama "${existingEmail.full_name}". Silakan login atau gunakan email lain.`,
            variant: "destructive",
          });
          setSendingOTP(false);
          return;
        } else {
          toast({
            title: "Akun Sebelumnya Ditemukan",
            description: "Email ini pernah terdaftar pada akun yang sudah dihapus/diarsipkan. Anda dapat melanjutkan pendaftaran baru.",
          });
        }
      }

      // Check if phone already exists on active account
      // Normalize: remove all non-digit chars except +
      const normalizedPhone = phone.replace(/[^+\d]/g, '');
      const { data: existingPhones } = await supabase
        .from('candidate_profiles')
        .select('phone, is_archived, full_name')
        .not('phone', 'is', null);

      // Compare normalized phone numbers to handle format differences
      const matchedPhone = (existingPhones || []).find(p => {
        const storedNormalized = (p.phone || '').replace(/[^+\d]/g, '');
        return storedNormalized === normalizedPhone;
      });

      if (matchedPhone) {
        if (!matchedPhone.is_archived) {
          setErrors({ phone: 'Nomor HP ini sudah terdaftar.' });
          toast({
            title: "Nomor HP Sudah Terdaftar",
            description: `Nomor ini sudah digunakan oleh akun atas nama "${matchedPhone.full_name}". Jika akun tersebut seharusnya sudah dihapus, hubungi admin untuk menghapus permanen.`,
            variant: "destructive",
          });
          setSendingOTP(false);
          return;
        } else {
          toast({
            title: "Akun Sebelumnya Ditemukan",
            description: "Nomor HP ini pernah terdaftar pada akun yang sudah dihapus/diarsipkan. Anda dapat melanjutkan pendaftaran baru.",
          });
        }
      }

      // Send OTP to email
      const { data, error } = await supabase.functions.invoke("send-otp", {
        body: { email, firstName },
      });

      if (error) throw error;

      if (data?.success) {
        toast({
          title: "Verification Code Sent",
          description: "Please check your email for the verification code.",
        });
        setStep("otp");
      } else {
        throw new Error(data?.error || "Failed to send verification code");
      }
    } catch (error: any) {
      console.error("Send OTP error:", error);
      toast({
        title: "Failed to Send Code",
        description: error.message || "Could not send verification code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSendingOTP(false);
    }
  };

  const handleOTPVerified = async () => {
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: `${firstName} ${lastName}`,
            user_type: userType,
            phone,
          },
        },
      });

      if (error) throw error;

      toast({
        title: "Registration successful!",
        description: jobId 
          ? "Your account has been created. Redirecting to apply..." 
          : "Your account has been created. Redirecting...",
      });

      // If there's a pending job application, redirect to that job with apply flag
      if (jobId) {
        navigate(`/jobs/${jobId}?apply=true`);
      } else {
        navigate("/candidate/dashboard");
      }
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "An error occurred during registration",
        variant: "destructive",
      });
      // Go back to form if registration fails
      setStep("form");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToForm = () => {
    setStep("form");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-ocean-deep via-ocean-blue to-ocean-light p-4">
      <Card className="w-full max-w-2xl p-8">
        {step === "form" && (
          <>
            <div className="text-center mb-8">
              <img src={logo} alt="Logo" width={264} height={264} className="mx-auto" />
              <br />
              <h1 className="text-3xl font-bold text-foreground mb-2">Create Your Account</h1>
              <p className="text-muted-foreground">Start your maritime career journey today</p>
            </div>

            <form className="space-y-6" onSubmit={handleSendOTP}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name <span className="text-red-500">*</span></Label>
                  <Input
                    id="firstName"
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className={errors.firstName ? 'border-red-500 focus-visible:ring-red-500' : ''}
                    aria-invalid={!!errors.firstName}
                    aria-describedby={errors.firstName ? 'firstName-error' : undefined}
                  />
                  {errors.firstName && (
                    <p id="firstName-error" className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name <span className="text-red-500">*</span></Label>
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className={errors.lastName ? 'border-red-500 focus-visible:ring-red-500' : ''}
                    aria-invalid={!!errors.lastName}
                    aria-describedby={errors.lastName ? 'lastName-error' : undefined}
                  />
                  {errors.lastName && (
                    <p id="lastName-error" className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
                {errors.email && (
                  <p id="email-error" className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number <span className="text-red-500">*</span></Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+62 8xx xxxx xxxx"
                  value={phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={errors.phone ? 'border-red-500 focus-visible:ring-red-500' : ''}
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? 'phone-error' : 'phone-note'}
                />
                <p id="phone-note" className="text-sm text-muted-foreground">
                  Note: Must be an active phone number
                </p>
                {errors.phone && (
                  <p id="phone-error" className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.phone}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password <span className="text-red-500">*</span></Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={errors.password ? 'border-red-500 focus-visible:ring-red-500' : ''}
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                />
                {errors.password && (
                  <p id="password-error" className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.password}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password <span className="text-red-500">*</span></Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className={errors.confirmPassword ? 'border-red-500 focus-visible:ring-red-500' : ''}
                  aria-invalid={!!errors.confirmPassword}
                  aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
                />
                {errors.confirmPassword && (
                  <p id="confirmPassword-error" className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => {
                      setAgreedToTerms(checked as boolean);
                      if (checked && errors.terms) {
                        setErrors((prev) => ({ ...prev, terms: '' }));
                      }
                    }}
                    className={errors.terms ? 'border-red-500' : ''}
                    aria-invalid={!!errors.terms}
                    aria-describedby={errors.terms ? 'terms-error' : undefined}
                  />
                  <label htmlFor="terms" className="text-sm text-foreground cursor-pointer leading-relaxed">
                    I agree to the{" "}
                    <Link to="/terms" className="text-primary hover:underline">
                      Terms & Conditions
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>
                    <span className="text-red-500"> *</span>
                  </label>
                </div>
                {errors.terms && (
                  <p id="terms-error" className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.terms}
                  </p>
                )}
              </div>

              <Button
                className="w-full bg-primary hover:bg-primary/90"
                size="lg"
                type="submit"
                disabled={sendingOTP}
              >
                {sendingOTP ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending Verification Code...
                  </>
                ) : (
                  "Continue"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-primary font-medium hover:underline">
                  Sign In
                </Link>
              </p>
            </div>
          </>
        )}

        {step === "otp" && (
          <>
            <div className="text-center mb-8">
              <img src={logo} alt="Logo" width={200} height={200} className="mx-auto" />
            </div>
            <EmailOTPVerification
              email={email}
              firstName={firstName}
              onVerified={handleOTPVerified}
              onBack={handleBackToForm}
            />
            {loading && (
              <div className="flex items-center justify-center mt-4 text-muted-foreground">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating your account...
              </div>
            )}
          </>
        )}
      </Card>

    </div>
  );
};

export default Register;
