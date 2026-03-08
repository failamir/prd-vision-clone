import React from 'react';

const SafetyPolicyPage: React.FC = () => {
  return (
    <div className="bg-white">
      {/* Safety & Quality Policy Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Safety & Quality Policy</h2>
            {/* <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 mb-12">
              <span>Home</span>
              <span>/</span>
              <span>Safety & Quality Policy</span>
            </div> */}
          </div>

          <div className="max-w-4xl mx-auto text-gray-600 space-y-6 text-left">
            <p>
              It is in PT Cipta Wira Tirta's (CWT) set of policies to provide safe and high quality of manning services by having safety management system and operating procedures.
            </p>
            <p>
              CWT requires an active commitment and accountability for QHSE from all employees, customers and contractors. Line management has a leadership role in the communication, implementation and improvements in compliance with QHSE standard policy.
            </p>
            <p className="font-bold text-gray-900">CWT is committed to:</p>

            <div className="space-y-4 pl-4">
              <ul className="list-disc space-y-4 pl-4 marker:text-gray-400">
                <li className="pl-2">
                  <span className="font-bold text-gray-900">Comply with mandatory rules and regulations</span> in conducting day-to-day operations and take into account other relevant practices as required by the <span className="font-bold text-gray-900">ISM Code</span>.
                </li>
                <li className="pl-2">
                  <span className="font-bold text-gray-900">Protect, and strive for continual improvement of, the health, safety, and security of our people</span> at all times.
                </li>
                <li className="pl-2">
                  <span className="font-bold text-gray-900">Zero non-conformance and HSE accidents.</span>
                </li>
                <li className="pl-2">
                  <span className="font-bold text-gray-900">Meet specified customer requirements</span> and ensure <span className="font-bold text-gray-900">continuous customer satisfaction</span>.
                </li>
                <li className="pl-2">
                  <span className="font-bold text-gray-900">Plan and prepare for emergencies, crises, and business disruptions.</span>
                </li>
                <li className="pl-2">
                  <span className="font-bold text-gray-900">Set Quality & HSE performance objectives</span>, measure results, assess, and <span className="font-bold text-gray-900">continually improve processes, services, and product quality</span> through the use of an effective management system.
                </li>
                <li className="pl-2">
                  <span className="font-bold text-gray-900">Learn from undesired events</span> (accidents, near-accidents, non-conformities, and hazardous situations) through analysis of possible causes and provide <span className="font-bold text-gray-900">preventive measures</span> through improved compliance.
                </li>
                <li className="pl-2">
                  <span className="font-bold text-gray-900">Ensure a sense of ownership towards clients' vessels</span>, enabling the placement of the <span className="font-bold text-gray-900">right personnel at the right time and at the right place</span>.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
    </div>
  );
};

export default SafetyPolicyPage;