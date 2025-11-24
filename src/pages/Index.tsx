import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, MapPin, Clock, Briefcase, X, Ship, Calendar } from "lucide-react";
import heroCruise1 from "@/assets/hero-cruise-1.jpg";
import heroCruise2 from "@/assets/hero-cruise-2.jpg";
import heroCruise3 from "@/assets/hero-cruise-3.jpg";
import TestimonialsSection from "@/components/TestimonialsSection";

const heroSlides = [
  {
    image: heroCruise1,
    title: "Creating Hero Of The Sea",
    subtitle: "Join the world's leading cruise lines and shipping companies",
  },
  {
    image: heroCruise2,
    title: "Your Maritime Career Starts Here",
    subtitle: "Professional recruitment services for seafarers worldwide",
  },
  {
    image: heroCruise3,
    title: "Sail Your Dreams",
    subtitle: "Connecting talented seafarers with premium opportunities",
  },
];

const urgentJobs = [
  {
    id: 1,
    title: "Waiters",
    company: "Norwegian Cruise Line",
    department: "hotel",
    location: "International Waters",
    type: "Full-time",
    salary: "$2,000 - $3,500",
    logo: "NCL",
    urgent: true,
    datePosted: "10/11/2024",
    expirationDate: "31/12/2024",
  },
  {
    id: 2,
    title: "Deck Officer",
    company: "SeaChef Maritime",
    department: "deck",
    location: "International Waters",
    type: "Full-time",
    salary: "$4,000 - $6,000",
    logo: "SC",
    urgent: true,
    datePosted: "09/11/2024",
    expirationDate: "30/12/2024",
  },
];

const partners = [
  {
    name: "Norwegian Cruise Line",
    href: "https://www.ncl.com/in/en/",
    logo: "https://ciptawiratirta.com/uploads/0000/1/2022/12/09/logo-partner-1.png",
    alt: "NCL",
  },
  {
    name: "NYK Ship Management",
    href: "http://www.nyksm.com.sg/",
    logo: "https://ciptawiratirta.com/uploads/0000/1/2022/12/09/logo-partner-2.png",
    alt: "NYKSM",
  },
  {
    name: "Fred Olsen Cruise Lines",
    href: "https://www.fredolsencruises.com/",
    logo: "https://ciptawiratirta.com/uploads/0000/1/2022/12/09/logo-partner-3.png",
    alt: "Fred Olsen Cruise Lines",
  },
  {
    name: "SeaChefs",
    href: "https://www.seachefs.com/",
    logo: "https://ciptawiratirta.com/uploads/0000/1/2022/12/09/logo-partner-4.png",
    alt: "SeaChefs",
  },
  {
    name: "SeaQuest Shipmanagement",
    href: "http://www.sqships.com/",
    logo: "https://ciptawiratirta.com/uploads/0000/1/2022/12/09/logo-partner-5.png",
    alt: "SeaQuest Shipmanagement",
  },
  {
    name: "Alpha Adriatic",
    href: "https://alphaadriatic.com/",
    logo: "https://ciptawiratirta.com/uploads/0000/1/2022/12/09/logo-partner-6.png",
    alt: "Alpha Adriatic",
  },
  {
    name: "Pertamina International Shipping",
    href: "https://www.pertamina-pis.com/",
    logo: "https://ciptawiratirta.com/uploads/0000/1/2024/04/24/logo-partner-1-11.png",
    alt: "Pertamina International Shipping",
  },
];

// Urgent Jobs Modal Component
const UrgentJobsModal = ({ isOpen, onClose, jobs, onJobSelect }: any) => {
  if (!isOpen) return null;

  const urgentJobsList = jobs.filter((job: any) => job.urgent);

  const getDepartmentColor = (department: string) => {
    switch (department) {
      case 'deck': return 'bg-blue-100 text-blue-800';
      case 'engine': return 'bg-red-100 text-red-800';
      case 'hotel': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-red-600">🚨 Urgent Job Opportunities</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-600 mb-6">These positions need to be filled immediately. Apply now!</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {urgentJobsList.map((job: any) => (
              <div
                key={job.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-red-200"
                onClick={() => {
                  onJobSelect(job);
                  onClose();
                }}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{job.title}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <Ship className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{job.company}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{job.location}</span>
                      </div>
                    </div>
                    <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full animate-pulse">
                      URGENT
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${getDepartmentColor(job.department)}`}>
                      {job.department.charAt(0).toUpperCase()}{job.department.slice(1)} Department
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Posted: {job.datePosted}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>Expires: {job.expirationDate}</span>
                    </div>
                  </div>

                  <button className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors font-semibold">
                    Apply Now - Urgent!
                  </button>
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
  const [partnerStartIndex, setPartnerStartIndex] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  // Show urgent jobs modal after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowUrgentJobsModal(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Auto-rotate partners logos
  useEffect(() => {
    const interval = setInterval(() => {
      setPartnerStartIndex((prev) => (prev + 1) % partners.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const extendedPartners = [...partners, ...partners];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Carousel */}
      <section className="relative h-[600px] mt-16 overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ${index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-ocean-deep/90 to-ocean-blue/70" />
            <div className="relative container mx-auto px-4 h-full flex items-center">
              <div className="max-w-2xl text-white">
                <h1 className="text-5xl md:text-6xl font-bold mb-4">{slide.title}</h1>
                <p className="text-xl md:text-2xl mb-8 text-blue-100">{slide.subtitle}</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/jobs">
                    <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-white">
                      Explore Jobs
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button size="lg" variant="outline" className="bg-white/10 border-white text-white hover:bg-white/20">
                      Join Now
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Carousel Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors backdrop-blur-sm"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors backdrop-blur-sm"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Carousel Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${index === currentSlide ? "bg-white" : "bg-white/50"
                }`}
            />
          ))}
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-foreground mb-8">Our Trusted Partners</h2>

          <div className="relative">
            <div className="overflow-hidden">
              <div className="flex items-center gap-12 py-4 justify-center">
                {extendedPartners
                  .slice(partnerStartIndex, partnerStartIndex + partners.length)
                  .map((partner, index) => (
                    <a
                      key={index}
                      href={partner.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center px-4 py-2 rounded-lg hover:shadow-sm transition-shadow flex-shrink-0"
                      title={partner.name}
                    >
                      <img
                        src={partner.logo}
                        alt={partner.alt}
                        className="w-auto object-contain"
                        style={{ height: "100px" }}
                        loading="lazy"
                      />
                    </a>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* CTA Section */}
      <section
        className="call-to-action-two"
        style={{
          backgroundImage: 'url(https://ciptawiratirta.com/uploads/demo/general/call-to-action-2.jpg)'
        }}
      >
        <div className="auto-container">
          <div className="sec-title light text-center">
            <h2>Your Dream Jobs Are Waiting</h2>
            <div className="text"></div>
          </div>

          <div className="btn-box">
            <a href="/job" className="theme-btn btn-style-three">Find Jobs</a>
            <a href="/redirect.php" className="theme-btn btn-style-two" style={{ padding: '18px 35px 15px 35px' }}>Recruitment Procedure</a>
          </div>
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
