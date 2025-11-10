import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const Profile = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    phone: "",
    date_of_birth: "",
    gender: "",
    address: "",
    city: "",
    country: "",
    professional_title: "",
    bio: "",
    website: "",
    expected_salary_min: "",
    expected_salary_max: "",
    linkedin_url: "",
    facebook_url: "",
    twitter_url: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("candidate_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) throw error;

      if (data) {
        setProfile({
          full_name: data.full_name || "",
          email: data.email || "",
          phone: data.phone || "",
          date_of_birth: data.date_of_birth || "",
          gender: data.gender || "",
          address: data.address || "",
          city: data.city || "",
          country: data.country || "",
          professional_title: data.professional_title || "",
          bio: data.bio || "",
          website: data.website || "",
          expected_salary_min: data.expected_salary_min?.toString() || "",
          expected_salary_max: data.expected_salary_max?.toString() || "",
          linkedin_url: data.linkedin_url || "",
          facebook_url: data.facebook_url || "",
          twitter_url: data.twitter_url || "",
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast({
        title: "Error loading profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("candidate_profiles")
        .update({
          full_name: profile.full_name,
          phone: profile.phone,
          date_of_birth: profile.date_of_birth || null,
          gender: profile.gender,
          address: profile.address,
          city: profile.city,
          country: profile.country,
          professional_title: profile.professional_title,
          bio: profile.bio,
          website: profile.website,
          expected_salary_min: profile.expected_salary_min ? parseInt(profile.expected_salary_min) : null,
          expected_salary_max: profile.expected_salary_max ? parseInt(profile.expected_salary_max) : null,
          linkedin_url: profile.linkedin_url,
          facebook_url: profile.facebook_url,
          twitter_url: profile.twitter_url,
        })
        .eq("user_id", user.id);

      if (error) throw error;

      toast({
        title: "Profile updated successfully",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error updating profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-foreground mb-2">My Profile</h2>
          <p className="text-muted-foreground">Manage your personal and professional information</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-foreground mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name *</Label>
                <Input
                  id="full_name"
                  value={profile.full_name}
                  onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input id="email" type="email" value={profile.email} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date_of_birth">Date of Birth</Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  value={profile.date_of_birth}
                  onChange={(e) => setProfile({ ...profile, date_of_birth: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Input
                  id="gender"
                  value={profile.gender}
                  onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={profile.city}
                  onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={profile.address}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={profile.country}
                  onChange={(e) => setProfile({ ...profile, country: e.target.value })}
                />
              </div>
            </div>
          </Card>

          {/* Professional Information */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-foreground mb-4">Professional Information</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="professional_title">Professional Title</Label>
                <Input
                  id="professional_title"
                  placeholder="e.g. Senior Deck Officer"
                  value={profile.professional_title}
                  onChange={(e) => setProfile({ ...profile, professional_title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio / About Me</Label>
                <Textarea
                  id="bio"
                  rows={4}
                  placeholder="Tell us about your experience and career goals..."
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website / Portfolio</Label>
                <Input
                  id="website"
                  type="url"
                  placeholder="https://"
                  value={profile.website}
                  onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expected_salary_min">Expected Salary (Min USD)</Label>
                  <Input
                    id="expected_salary_min"
                    type="number"
                    placeholder="2000"
                    value={profile.expected_salary_min}
                    onChange={(e) => setProfile({ ...profile, expected_salary_min: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expected_salary_max">Expected Salary (Max USD)</Label>
                  <Input
                    id="expected_salary_max"
                    type="number"
                    placeholder="5000"
                    value={profile.expected_salary_max}
                    onChange={(e) => setProfile({ ...profile, expected_salary_max: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Social Media */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-foreground mb-4">Social Media</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                <Input
                  id="linkedin_url"
                  type="url"
                  placeholder="https://linkedin.com/in/yourprofile"
                  value={profile.linkedin_url}
                  onChange={(e) => setProfile({ ...profile, linkedin_url: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="facebook_url">Facebook URL</Label>
                <Input
                  id="facebook_url"
                  type="url"
                  placeholder="https://facebook.com/yourprofile"
                  value={profile.facebook_url}
                  onChange={(e) => setProfile({ ...profile, facebook_url: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitter_url">Twitter URL</Label>
                <Input
                  id="twitter_url"
                  type="url"
                  placeholder="https://twitter.com/yourprofile"
                  value={profile.twitter_url}
                  onChange={(e) => setProfile({ ...profile, twitter_url: e.target.value })}
                />
              </div>
            </div>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={fetchProfile}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
