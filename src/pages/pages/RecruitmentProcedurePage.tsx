import React from 'react';
import { FileText } from 'lucide-react';

const RecruitmentProcedurePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Recruitment Procedure Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Recruitment Procedure</h2>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 mb-12">
              <span>Home</span>
              <span>/</span>
              <span>Recruitment Procedure</span>
            </div>

            {/* Document Icon */}
            <div className="flex justify-center mb-12">
              <div className="w-32 h-32 bg-blue-600 rounded-lg flex items-center justify-center">
                <FileText className="w-16 h-16 text-white" />
              </div>
            </div>

            <h3 className="text-2xl font-bold text-blue-600 mb-8">Follow the requirement flow below</h3>
            
            {/* Recruitment Procedure Image */}
            <div className="flex justify-center mb-8">
              <img
                src="/RP.png"
                alt="Recruitment Procedure Flow"
                className="max-w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RecruitmentProcedurePage;