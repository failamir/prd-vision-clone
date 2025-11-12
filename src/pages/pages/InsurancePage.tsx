import React from 'react';
import { Ship } from 'lucide-react';

const InsurancePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Insurance Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Insurance</h2>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 mb-12">
              <span>Home</span>
              <span>/</span>
              <span>Insurance</span>
            </div>

            {/* Ship Icon */}
            <div className="flex justify-center mb-12">
              <div className="w-32 h-32 bg-red-600 rounded-lg flex items-center justify-center">
                <Ship className="w-16 h-16 text-white" />
              </div>
            </div>

            <h3 className="text-4xl font-bold text-red-600 mb-8">MARINE BENEFITS</h3>
            
            <div className="max-w-4xl mx-auto text-gray-600 text-lg leading-relaxed">
              <p>
                We are proud to be part of a company providing peace of mind for ship owners, seafarers and their families. 
                In co-operation with Marine Benefits AS of Norway, we provide seafarers and their dependants with social benefit 
                such as medical, disability and life insurance. All the work processes are in compliant with ISO 9001 and ISO 27001. 
                For more information, please visit the official website of Marine benefits.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InsurancePage;