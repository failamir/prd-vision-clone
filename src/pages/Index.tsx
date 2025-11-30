import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MapPin, Clock, Ship, Calendar, X, ArrowRight } from "lucide-react";
import heroCWT1 from "@/assets/CWT1.png";
import heroCWT2 from "@/assets/CWT2.png";
import heroCWT3 from "@/assets/CWT3.png";
import logoPartner1 from "@/assets/logo-partner-1.png";
import logoPartner2 from "@/assets/logo-partner-2.png";
import logoPartner3 from "@/assets/logo-partner-3.png";
import logoPartner4 from "@/assets/logo-partner-4.png";
import logoPartner5 from "@/assets/logo-partner-5.png";
import logoPartner6 from "@/assets/logo-partner-6.png";
import logoPartnerPis from "@/assets/logo-partner-1-11.png";
import ctaBackground from "@/assets/call-to-action.jpg";
import TestimonialsSection from "@/components/TestimonialsSection";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { FadeIn } from "@/components/FadeIn";

const heroSlides = [
  {
    image: heroCWT1,
    title: "Creating Hero Of The Sea",
    subtitle: "Join the world's leading cruise lines and shipping companies",
  },
  {
    image: heroCWT2,
    title: "Your Maritime Career Starts Here",
    subtitle: "Professional recruitment services for seafarers worldwide",
  },
  {
    image: heroCWT3,
    title: "Sail Your Dreams",
    subtitle: "Connecting talented seafarers with premium opportunities",
  },
];

const partners = [
  {
    name: "Norwegian Cruise Line",
    href: "https://www.ncl.com/in/en/",
    logo: logoPartner1,
    alt: "NCL",
  },
  {
    name: "NYK Ship Management",
    href: "http://www.nyksm.com.sg/",
    logo: logoPartner2,
    alt: "NYKSM",
  },
  {
    name: "Fred Olsen Cruise Lines",
    href: "https://www.fredolsencruises.com/",
    logo: logoPartner3,
    alt: "Fred Olsen Cruise Lines",
  },
  {
    name: "SeaChefs",
    href: "https://www.seachefs.com/",
    logo: logoPartner4,
    alt: "SeaChefs",
  },
  {
    name: "SeaQuest Shipmanagement",
    href: "http://www.sqships.com/",
    logo: logoPartner5,
    alt: "SeaQuest Shipmanagement",
  },
  {
    name: "Alpha Adriatic",
    href: "https://alphaadriatic.com/",
    logo: logoPartner6,
    alt: "Alpha Adriatic",
  },
  {
    name: "Pertamina International Shipping",
    href: "https://www.pertamina-pis.com/",
    logo: logoPartnerPis,
    alt: "Pertamina International Shipping",
  },
];

// Urgent Jobs Modal Component
const UrgentJobsModal = ({ isOpen, onClose, jobs, onJobSelect }: any) => {
  if (!isOpen) return null;

  const getDepartmentColor = (department: string) => {
    switch (department?.toLowerCase()) {
      case 'deck': return 'bg-blue-100 text-blue-800';
      case 'engine': return 'bg-red-100 text-red-800';
      case 'hotel': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <h2 className="text-2xl font-bold text-gray-900">Urgent Opportunities</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-600 mb-8 text-lg">We are looking for qualified candidates for immediate deployment. Apply now to secure your spot!</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs.map((job: any) => (
              <div
                key={job.id}
                className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100 hover:border-red-200 relative overflow-hidden"
                onClick={() => {
                  onJobSelect(job);
                  onClose();
                }}
              >
                <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                  URGENT
                </div>

                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">{job.title}</h3>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Ship className="w-4 h-4" />
                        <span className="text-sm font-medium">{job.company_name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{job.location}</span>
                      </div>
                    </div>
                  </div>

                  {job.department && (
                    <div className="mb-4">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getDepartmentColor(job.department)}`}>
                        {job.department} Department
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-50">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Clock className="w-3 h-3" />
                      <span>{format(new Date(job.created_at), 'MMM d, yyyy')}</span>
                    </div>
                    <span className="text-sm font-semibold text-red-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Apply Now <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Index = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showUrgentJobsModal, setShowUrgentJobsModal] = useState(false);
  const [urgentJobs, setUrgentJobs] = useState<any[]>([]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  // Auto-rotate hero slides every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  // Fetch urgent jobs from database
  useEffect(() => {
    const fetchUrgentJobs = async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('is_urgent', true)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(10);

      if (!error && data) {
        setUrgentJobs(data);
      }
    };
    fetchUrgentJobs();
  }, []);

  // Show urgent jobs modal after 3 seconds if there are urgent jobs
  useEffect(() => {
    if (urgentJobs.length > 0) {
      const timer = setTimeout(() => {
        setShowUrgentJobsModal(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [urgentJobs]);

  const extendedPartners = [...partners, ...partners];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Carousel */}
      <section className="relative h-[85vh] min-h-[600px] overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105"
              }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            />
            {/* Modern gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/60 to-transparent" />

            <div className="relative container mx-auto px-4 h-full flex items-center">
              <div className="max-w-3xl text-white pt-20">
                <FadeIn delay={200} direction="up">
                  <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight">
                    {slide.title}
                  </h1>
                </FadeIn>
                <FadeIn delay={400} direction="up">
                  <p className="text-xl md:text-2xl mb-10 text-gray-200 font-light max-w-2xl leading-relaxed">
                    {slide.subtitle}
                  </p>
                </FadeIn>
                <FadeIn delay={600} direction="up">
                  <div className="flex flex-col sm:flex-row gap-5">
                    <Link to="/jobs">
                      <Button size="lg" className="h-14 px-8 text-lg bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-lg shadow-blue-900/20 rounded-xl transition-all hover:scale-105">
                        Explore Opportunities
                      </Button>
                    </Link>
                    <Link to="/register">
                      <Button size="lg" variant="outline" className="h-14 px-8 text-lg bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white/20 rounded-xl transition-all hover:scale-105">
                        Join Talent Pool
                      </Button>
                    </Link>
                  </div>
                </FadeIn>
              </div>
            </div>
          </div>
        ))}

        {/* Modern Carousel Controls */}
        <div className="absolute bottom-12 right-12 flex gap-4 z-20">
          <button
            onClick={prevSlide}
            className="w-12 h-12 flex items-center justify-center rounded-full border border-white/30 text-white hover:bg-white hover:text-gray-900 transition-all backdrop-blur-sm"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="w-12 h-12 flex items-center justify-center rounded-full border border-white/30 text-white hover:bg-white hover:text-gray-900 transition-all backdrop-blur-sm"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-12 left-12 flex gap-3 z-20">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${index === currentSlide ? "w-8 bg-white" : "w-2 bg-white/40 hover:bg-white/60"
                }`}
            />
          ))}
        </div>
      </section>

      {/* Partners Section - Cleaner Look */}
      <section className="py-20 bg-[#f6f7f7]">
        <div className="container mx-auto px-4">
          <FadeIn direction="up">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Trusted by Industry Leaders</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">We partner with the world's most prestigious cruise lines and shipping companies to provide you with the best career opportunities.</p>
            </div>
          </FadeIn>

          <FadeIn delay={200} direction="up">
            <div className="relative overflow-hidden py-8">
              <div className="partners-marquee opacity-80 hover:opacity-100">
                {extendedPartners.map((partner, index) => (
                  <a
                    key={index}
                    href={partner.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group mx-12 inline-flex items-center justify-center transition-transform hover:scale-110 duration-300 flex-shrink-0"
                    title={partner.name}
                  >
                    <img
                      src={partner.logo}
                      alt={partner.alt}
                      className="h-32 w-auto object-contain opacity-100 transition-all duration-500"
                      loading="lazy"
                    />
                  </a>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Modern CTA Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={ctaBackground}
            alt="Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-blue-900/90 mix-blend-multiply" />
        </div>

        <div className="relative container mx-auto px-4 text-center">
          <FadeIn direction="up">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Start Your Journey?</h2>
            <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
              Join thousands of seafarers who have found their dream careers through Cipta Wira Tirta.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to="/jobs">
                <Button size="lg" className="h-14 px-10 text-lg bg-white text-blue-900 hover:bg-blue-50 font-bold rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all">
                  Find Your Dream Job
                </Button>
              </Link>
              <Link to="/recruitment-procedure">
                <Button size="lg" variant="outline" className="h-14 px-10 text-lg bg-transparent border-2 border-white/30 text-white hover:bg-white/10 hover:border-white rounded-xl transition-all">
                  Recruitment Process
                </Button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />

      {/* Urgent Jobs Modal */}
      <UrgentJobsModal
        isOpen={showUrgentJobsModal}
        onClose={() => setShowUrgentJobsModal(false)}
        jobs={urgentJobs}
        onJobSelect={(job: any) => navigate(`/jobs/${job.id}`)}
      />
    </div>
  );
};

export default Index;
