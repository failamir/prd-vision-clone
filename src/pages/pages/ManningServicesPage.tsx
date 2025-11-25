import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import manningImg1 from '@/assets/Manning Services-1.jpg';
import manningImg2 from '@/assets/Manning Services-2.png';

const ManningServicesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {/* Manning Services Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Manning Services</h2>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 mb-12">
              <span>Home</span>
              <span>/</span>
              <span>Manning Services</span>
            </div>

            {/* Manning Services Content */}
            <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
              <div className="lg:w-2/3 w-full">
                <img
                  src={manningImg1}
                  alt="Manning crew"
                  className="w-full rounded-lg shadow-lg object-cover"
                />
              </div>
              <div className="lg:w-1/3 w-full flex justify-center">
                <img
                  src={manningImg2}
                  alt="Manning certifications"
                  className="w-full max-w-xs rounded-lg shadow-lg object-contain"
                />
              </div>
            </div>

            <div className="max-w-4xl mx-auto text-gray-600 text-lg leading-relaxed mt-12 space-y-6 text-left">
              <p>
                Since the establishment of the company in the year of 2000, we have an excellent proven track record as a 
                reliable, honest and transparent manning agency. We provide wide range of manning services from selective 
                recruitment to P&I matters.
              </p>
              <p>
                All work processes are in compliance with ISO 9001 and MLC 2006.
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ManningServicesPage;