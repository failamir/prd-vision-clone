import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, StarHalf, StarOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Array<{
    id: string;
    candidate_name: string;
    testimonial: string;
    rating: number;
    created_at: string;
  }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        console.log('Fetching testimonials...');
        
        // First, let's check the structure of the testimonials table
        const { data: testData, error: testError } = await supabase
          .from('testimonials')
          .select('*')
          .limit(1);
          
        console.log('Testimonials table structure:', testData);
        
        // Then try to fetch with the relationship
        const { data, error } = await supabase
          .from("testimonials")
          .select(`
            id,
            testimonial,
            rating,
            created_at,
            candidate_id,
            candidate_profiles:candidate_profiles(
              full_name
            )
          `)
          .eq("is_approved", true)
          .order("created_at", { ascending: false })
          .limit(3);

        console.log('Fetched testimonials:', data);
        
        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }

        if (!data || data.length === 0) {
          console.log('No approved testimonials found');
          setTestimonials([]);
          return;
        }

        // Transform the data to include candidate names
        const formattedTestimonials = data.map((item: any) => {
          console.log('Processing testimonial:', item);
          return {
            id: item.id,
            candidate_name: item.candidate_profiles?.full_name || 'Anonymous',
            testimonial: item.testimonial,
            rating: item.rating,
            created_at: item.created_at
          };
        });

        console.log('Formatted testimonials:', formattedTestimonials);
        setTestimonials(formattedTestimonials);
      } catch (error) {
        console.error("Error in fetchTestimonials:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<StarHalf key={i} className="w-5 h-5 text-yellow-400 fill-current" />);
      } else {
        stars.push(<Star key={i} className="w-5 h-5 text-gray-300 fill-current" />);
      }
    }
    return stars;
  };

  if (loading) {
    return (
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">What Our Candidates Say</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Hear from those who have experienced our services
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="h-full flex flex-col">
                <CardHeader>
                  <div className="flex items-center space-x-2 mb-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-32 mb-2" />
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Skeleton key={star} className="h-5 w-5 mr-1" />
                        ))}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return null; // Don't show the section if there are no testimonials
  }

  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">What Our Candidates Say</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Hear from those who have experienced our services
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
              <CardContent className="flex-grow p-6 flex flex-col">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200 rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mr-4">
                    {testimonial.candidate_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{testimonial.candidate_name}</h4>
                    <div className="flex items-center">
                      {renderStars(testimonial.rating)}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 flex-grow italic">"{testimonial.testimonial}"</p>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-4 text-right">
                  {new Date(testimonial.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
