import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Star } from "lucide-react";

export default function Testimonials() {
  const [testimonial, setTestimonial] = useState("");
  const [rating, setRating] = useState(5);
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!testimonial.trim()) {
      toast({
        title: "Please write a testimonial",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Thank you for your testimonial!",
      description: "Your feedback has been submitted successfully.",
    });
    
    setTestimonial("");
    setRating(5);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Testimonials</h1>
          <p className="text-muted-foreground mt-2">
            Share your experience working with us
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5" />
              <span>Submit Your Testimonial</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Rate Your Experience
              </label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    onClick={() => setRating(value)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        value <= rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Your Testimonial
              </label>
              <Textarea
                placeholder="Share your experience working with Wira Manning Services..."
                value={testimonial}
                onChange={(e) => setTestimonial(e.target.value)}
                rows={6}
                className="resize-none"
              />
            </div>

            <Button onClick={handleSubmit} className="w-full">
              Submit Testimonial
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Why Your Testimonial Matters</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Your testimonial helps us improve our services and assists other candidates
              in making informed decisions about their career opportunities with Wira Manning Services.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
