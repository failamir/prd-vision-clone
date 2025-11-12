import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const SafetyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      {/* Safety & Quality Policy Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Safety & Quality Policy</h2>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 mb-12">
              <span>Home</span>
              <span>/</span>
              <span>Safety & Quality Policy</span>
            </div>
          </div>

          <div className="max-w-4xl mx-auto text-gray-600 space-y-6 text-left">
            <p>
              It is in PT Cipta Wira Tirta's (CWT) set of policies to provide safe and high quality of manning services by having 
              safety management system and operating procedures.
            </p>
            <p>
              CWT requires an active commitment and accountability for QHSE from all employees, customers and contractors. 
              Line management has a leadership role in the communication, implementation and improvements in compliance 
              with QHSE standard policy.
            </p>
            <p className="font-semibold">CWT is committed to:</p>
            
            <div className="space-y-4 pl-4">
              <p>
                - Comply with mandatory rules and regulations in conducting day to day operation and take into account other 
                relevant practices as required by the ISM Code.
              </p>
              <p>
                - Protect, and strive for improvement of, the health, safety and security of our people at all times.
              </p>
              <p>
                - Zero non-conformance and HSE accidents.
              </p>
              <p>
                - Meet specified customer requirements and ensure continuous customer satisfaction.
              </p>
              <p>
                - Plan and prepare for emergency, crisis and business disruption.
              </p>
              <p>
                - Set Quality & HSE performance objectives, measure results, assess and continually improve processes, services 
                and product quality, through the use of an effective management system.
              </p>
              <p>
                - Learn from undesired events (accidents, near-accident, non-conformities and hazardous situations) through 
                analysis of possible causes and provide prevention system through improved compliance.
              </p>
              <p>
                - It is imperative that all employees have a sense of ownership towards clients vessels so that the objective of 
                having the right personnel at the right time and at the right place could be performed.
              </p>
            </div>

            <p className="mt-8">
              This policy directs all employees to recognize their role for the safety and quality of services. All employees are 
              reminded to take time out for safety to properly plan prior executing the operation and stop the job if the possible 
              undesired outcome of the operation is seen or in doubt.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default SafetyPolicyPage;