import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

const Register = () => {
  const [userType, setUserType] = useState("candidate");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-ocean-deep via-ocean-blue to-ocean-light p-4">
      <Card className="w-full max-w-2xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-ocean-light to-ocean-blue rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">CW</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Create Your Account</h1>
          <p className="text-muted-foreground">Start your maritime career journey today</p>
        </div>

        <form className="space-y-6">
          <div>
            <Label className="mb-3 block">I want to register as:</Label>
            <RadioGroup value={userType} onValueChange={setUserType} className="grid grid-cols-2 gap-4">
              <div>
                <RadioGroupItem value="candidate" id="candidate" className="peer sr-only" />
                <Label
                  htmlFor="candidate"
                  className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-card p-4 hover:bg-accent cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                >
                  <span className="text-4xl mb-2">👤</span>
                  <span className="font-semibold">Job Seeker</span>
                  <span className="text-xs text-muted-foreground text-center mt-1">
                    Find and apply for jobs
                  </span>
                </Label>
              </div>
              <div>
                <RadioGroupItem value="employer" id="employer" className="peer sr-only" />
                <Label
                  htmlFor="employer"
                  className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-card p-4 hover:bg-accent cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                >
                  <span className="text-4xl mb-2">🏢</span>
                  <span className="font-semibold">Employer</span>
                  <span className="text-xs text-muted-foreground text-center mt-1">
                    Post jobs and hire talent
                  </span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" placeholder="John" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" placeholder="Doe" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" placeholder="your@email.com" />
          </div>

          {userType === "employer" && (
            <div className="space-y-2">
              <Label htmlFor="company">Company Name</Label>
              <Input id="company" placeholder="Your Company Name" />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" type="tel" placeholder="+62 xxx xxxx xxxx" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="Create a strong password" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input id="confirmPassword" type="password" placeholder="Confirm your password" />
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox id="terms" />
            <label htmlFor="terms" className="text-sm text-foreground cursor-pointer leading-relaxed">
              I agree to the{" "}
              <Link to="/terms" className="text-secondary hover:underline">
                Terms & Conditions
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-secondary hover:underline">
                Privacy Policy
              </Link>
            </label>
          </div>

          <Button className="w-full bg-primary hover:bg-primary/90" size="lg">
            Create Account
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-secondary font-medium hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Register;
