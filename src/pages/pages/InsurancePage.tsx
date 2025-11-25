import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import bgNewCrop from '@/assets/bg-new-crop.png';

const InsurancePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      {/* Insurance Section */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Insurance</h2>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 mb-12">
              <span>Home</span>
              <span>/</span>
              <span>Insurance</span>
            </div>

            {/* Ship Image */}
            <div className="flex justify-center mb-12">
              <img
                src={bgNewCrop}
                alt="Marine Benefits"
                className="w-40 h-40 object-contain"
              />
            </div>

            <h3 className="text-4xl font-bold text-red-600 mb-8">MARINE BENEFITS</h3>

            <div className="max-w-4xl mx-auto text-gray-600 text-lg leading-relaxed space-y-4">
              <p>
                We are proud to be part of a company providing peace of mind for ship owners, seafarers and their families.
              </p>
              <p>
                In co-operation with Marine Benefits AS of Norway, we provide seafarers and their dependants with social benefit
                such as medical, disability and life insurance. All the work processes are in compliant with ISO 9001 and ISO 27001.
              </p>
              <p>
                For more information, please visit the official website of Marine benefits.
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default InsurancePage;