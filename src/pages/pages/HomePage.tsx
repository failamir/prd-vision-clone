import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Ship, X, MapPin, Calendar, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AuthModal from '../auth/AuthModal';
import { useAuth } from '../../contexts/AuthContext';
import type { Job } from '../../App';

interface UrgentJobsModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobs: Job[];
  onJobSelect: (job: Job) => void;
}

const UrgentJobsModal: React.FC<UrgentJobsModalProps> = ({ isOpen, onClose, jobs, onJobSelect }) => {
  if (!isOpen) return null;

  const urgentJobs = jobs.filter(job => job.urgent);

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
            {urgentJobs.map((job) => (
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
                    <span onClick={() => {
                      onJobSelect(job);
                      onClose();
                    }}>Apply Now - Urgent!</span>
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
const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUrgentJobsModal, setShowUrgentJobsModal] = useState(false);

  // Sample urgent jobs data
  const urgentJobs: Job[] = [
    {
      id: '1',
      title: 'Mermaid Man and Barnacle Boy',
      department: 'deck',
      company: 'Norwegian Cruise Line',
      location: 'International Waters',
      urgent: true,
      datePosted: '25/06/2023',
      expirationDate: '01/01/2030',
      experience: 'Fresh',
      gender: 'male',
      requirements: [
        'Valid certificates as per STCW 2010',
        'Min 1 Year Experience in the same position',
        'Good English communication',
        'Fully vaccination C-19'
      ]
    },
    {
      id: '3',
      title: 'Hotel Manager',
      department: 'hotel',
      company: 'Fred Olsen Cruise Lines',
      location: 'Caribbean Route',
      urgent: true,
      datePosted: '22/06/2023',
      expirationDate: '30/11/2023',
      experience: '3+ Years',
      gender: 'any',
      requirements: [
        'Hotel management degree',
        'Cruise ship experience preferred',
        'Fluent in English',
        'Leadership skills'
      ]
    }
  ];

  const heroSlides = [
    {
      id: 1,
      image: '/CWT1.png',
      title: 'Your Dream Jobs Are Waiting',
      subtitle: 'Professional Maritime Recruitment Services'
    },
    {
      id: 2,
      image: '/CWT2.png',
      title: 'Excellence in Maritime Services',
      subtitle: 'Connecting Talent with Opportunity'
    },
    {
      id: 3,
      image: '/CWT3.png',
      title: 'Global Maritime Solutions',
      subtitle: 'Your Trusted Partner at Sea'
    }
  ];

  const partners = [
    { name: 'Partner 1', logo: '/logo-partner-1.png' },
    { name: 'Partner 2', logo: '/logo-partner-2.png' },
    { name: 'Partner 3', logo: '/logo-partner-3.png' },
    { name: 'Partner 4', logo: '/logo-partner-4.png' },
    { name: 'Partner 5', logo: '/logo-partner-5.png' },
    { name: 'Partner 6', logo: '/logo-partner-6.png' },
    { name: 'Partner 7', logo: '/logo-partner-1-11.png' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  // Show urgent jobs modal after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowUrgentJobsModal(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const handleFindJobs = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
    } else {
      navigate('/job-listing');
    }
  };
  return (
    <div className="min-h-screen">
      {/* Hero Section with Slider */}
      <section className="relative h-screen overflow-hidden">
        <div className="relative h-full">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div
                className="h-full bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
              </div>
            </div>
          ))}
          
          {/* Hero Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white px-4">
              <h1 className="text-5xl md:text-6xl font-bold mb-4">
                {heroSlides[currentSlide].title}
              </h1>
              <p className="text-xl md:text-2xl mb-8">
                {heroSlides[currentSlide].subtitle}
              </p>
              <div className="space-x-4">
                <button 
                  onClick={handleFindJobs}
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Find Jobs
                </button>
                <button 
                  onClick={() => navigate('/recruitment-procedure')}
                  className="bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                >
                  Recruitment Procedure
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Slide Indicators */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
                }`}
              />
            ))}
          </div>
        </div>
        
        {/* Partners Section with Auto Scroll */}
        <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-100 py-6 overflow-hidden">
          <div className="relative">
            <div className="flex animate-scroll">
              {/* First set of partners */}
              {partners.map((partner, index) => (
                <div key={`first-${index}`} className="flex-shrink-0 mx-8">
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="h-28 object-contain opacity-70 hover:opacity-100 transition-opacity"
                  />
                </div>
              ))}
              {/* Duplicate set for seamless loop */}
              {partners.map((partner, index) => (
                <div key={`second-${index}`} className="flex-shrink-0 mx-8">
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="h-24 object-contain opacity-70 hover:opacity-100 transition-opacity"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-8">Your Dream Jobs Are Waiting</h2>
          <div className="space-x-4">
            <button 
              onClick={handleFindJobs}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Find Jobs
            </button>
            <button 
              onClick={() => navigate('/recruitment-procedure')}
              className="bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
            >
              Recruitment Procedure
            </button>
          </div>
        </div>
      </section>


      
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
      
      <UrgentJobsModal
        isOpen={showUrgentJobsModal}
        onClose={() => setShowUrgentJobsModal(false)}
        jobs={urgentJobs}
        onJobSelect={(job) => navigate('/jobs')}
      />
    </div>
  );
};

export default HomePage;