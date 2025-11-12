import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const AboutPage: React.FC = () => {
  const teamPhotos = [
    { title: 'Jakarta Team', image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop' },
    { title: 'Yogyakarta Team', image: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop' },
    { title: 'Surabaya Team', image: 'https://images.pexels.com/photos/3184293/pexels-photo-3184293.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop' },
    { title: 'Bali Team', image: 'https://images.pexels.com/photos/3184294/pexels-photo-3184294.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop' },
    { title: 'Bandung Team', image: 'https://images.pexels.com/photos/3184295/pexels-photo-3184295.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop' },
    { title: 'Family Gathering to Bogor', image: 'https://images.pexels.com/photos/3184296/pexels-photo-3184296.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop' },
    { title: 'Ship Visit - Norwegian Jewel', image: 'https://images.pexels.com/photos/3184297/pexels-photo-3184297.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop' },
    { title: 'Kegiatan Badminton', image: 'https://images.pexels.com/photos/3184298/pexels-photo-3184298.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop' },
    { title: 'Crew Fred Olsen', image: 'https://images.pexels.com/photos/3184299/pexels-photo-3184299.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop' },
    { title: 'Ship Visit - Norwegian Jewel', image: 'https://images.pexels.com/photos/3184300/pexels-photo-3184300.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {/* About Us Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">About Us</h2>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
              <span>Home</span>
              <span>/</span>
              <span>About Us</span>
            </div>
          </div>

          {/* Team Photos Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {teamPhotos.map((photo, index) => (
              <div key={index} className="text-center">
                <div className="relative overflow-hidden rounded-lg mb-3">
                  <img
                    src={photo.image}
                    alt={photo.title}
                    className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-sm font-medium text-gray-900">{photo.title}</h3>
              </div>
            ))}
          </div>

          {/* Special centered items for Crew Fred Olsen and Ship Visit */}
          <div className="flex justify-center gap-6 mb-16">
            <div className="text-center">
              <div className="relative overflow-hidden rounded-lg mb-3">
                <img
                  src="https://images.pexels.com/photos/3184299/pexels-photo-3184299.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop"
                  alt="Crew Fred Olsen"
                  className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-sm font-medium text-gray-900">Crew Fred Olsen</h3>
            </div>
            <div className="text-center">
              <div className="relative overflow-hidden rounded-lg mb-3">
                <img
                  src="https://images.pexels.com/photos/3184300/pexels-photo-3184300.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop"
                  alt="Ship Visit - Norwegian Jewel"
                  className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-sm font-medium text-gray-900">Ship Visit - Norwegian Jewel</h3>
            </div>
          </div>

          {/* About Text */}
          <div className="max-w-4xl mx-auto text-gray-600 space-y-6">
            <p>
              The company is established in May 2000 as a representative office for Wilhelmsen Ship Management formerly 
              known as Barber International. Initially, the company served for a cruise line company based in Miami, USA. 
              The company has grown rapidly not only to serve cruise line companies but for other types of vessels including FPSO.
            </p>
            <p>
              In the year 2008, Wilhelmsen Ship Management made significant changes. The cruise ship crewing management 
              was not part of their future plans. Wira Manning Services continues to serve the existing clients with similar quality of 
              services.
            </p>
            <p>
              Our reputation and commitment in providing quality crew management services, fair and professional recruitment 
              of seafarers, excellent relationship with authorities and regulators have made the company matured into a 
              reputable manning agent and have added more values for Indonesian seafarers in the international seafarer world. 
              The operations of PT. Cipta Wira Tirta is in Compliance with ISO 9001 : 2015, MLC 2006 for SRPS and SIUJPAK.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default AboutPage;