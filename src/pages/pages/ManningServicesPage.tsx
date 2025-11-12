import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

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
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-1/2">
                <img
                  src="https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop"
                  alt="Manning Services"
                  className="rounded-lg shadow-lg"
                />
              </div>
              <div className="lg:w-1/2 flex justify-center">
                <div className="space-y-6">
                  <div className="bg-red-600 text-white p-4 rounded-lg">
                    <div className="text-sm font-semibold">MLC 2006</div>
                    <div className="text-xs">BUREAU VERITAS</div>
                    <div className="text-xs">Certification</div>
                    <div className="text-xs mt-2">Member of CRSO Federation</div>
                  </div>
                  <div className="bg-blue-600 text-white p-4 rounded-lg">
                    <div className="text-lg font-bold">RINA</div>
                    <div className="text-sm">CERTIFIED MANAGEMENT SYSTEM</div>
                    <div className="text-sm">ISO 9001</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="max-w-4xl mx-auto text-gray-600 text-lg leading-relaxed mt-12 space-y-6">
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