import React from 'react';
import manningImg1 from '@/assets/Manning Services-1.jpg';
import manningImg2 from '@/assets/Manning Services-2.png';

const ManningServicesPage: React.FC = () => {
  return (
    <div className="bg-gray-50">
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
            <div className="max-w-4xl mx-auto flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
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
                Since its establishment in 2000, <span className="font-semibold text-gray-900">Cipta Wira Tirta</span> has built a strong and proven track record as a
                reliable, transparent, and professional Indonesian manning agency. We provide comprehensive manning services, ranging from selective
                recruitment and crew placement to crew administration and P&I–related matters.
              </p>
              <p>
                All operational processes are conducted in compliance with <span className="font-semibold text-gray-900">ISO 9001:2015</span> and the <span className="font-semibold text-gray-900">Maritime Labour Convention (MLC) 2006</span>, and are duly licensed under <span className="font-semibold text-gray-900">SIUKAK</span>, issued by the <span className="font-semibold text-gray-900">Directorate of Sea Transportation</span> of the Republic of Indonesia.
              </p>
            </div>
          </div>
        </div>
      </section>
      
    </div>
  );
};

export default ManningServicesPage;