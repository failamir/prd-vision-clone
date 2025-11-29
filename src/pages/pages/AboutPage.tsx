import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { FadeIn } from '@/components/FadeIn';
import jakartaImg from '@/assets/jakarta.png';
import jogjaImg from '@/assets/jogja.png';
import surabayaImg from '@/assets/surabaya.png';
import baliImg from '@/assets/bali.png';
import bandungImg from '@/assets/bandung.png';
import familyGatheringImg from '@/assets/family-gathering.png';
import shipVisit1Img from '@/assets/ship-visit-1.png';
import badmintonImg from '@/assets/badminton.png';
import crewImg from '@/assets/crew.png';
import shipVisit2Img from '@/assets/ship-visit-2.png';

const AboutPage: React.FC = () => {
  const teamPhotos = [
    { title: 'Jakarta Team', image: jakartaImg },
    { title: 'Yogyakarta Team', image: jogjaImg },
    { title: 'Surabaya Team', image: surabayaImg },
    { title: 'Bali Team', image: baliImg },
    { title: 'Bandung Team', image: bandungImg },
    { title: 'Family Gathering to Bogor', image: familyGatheringImg },
    { title: 'Ship Visit - Norwegian Jewel', image: shipVisit1Img },
    { title: 'Kegiatan Badminton', image: badmintonImg }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-24 bg-gray-50 overflow-hidden">
        <div className="absolute inset-0 bg-grid-gray-200 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <FadeIn direction="up">
            <h1 className="text-5xl font-bold text-gray-900 mb-6 tracking-tight">About Us</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Building the future of maritime recruitment with integrity, professionalism, and excellence since 2000.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Team Photos Grid */}
          <div className="mb-24">
            <FadeIn direction="up" delay={200}>
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Team & Activities</h2>
            </FadeIn>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamPhotos.map((photo, index) => (
                <FadeIn key={index} delay={index * 100} direction="up">
                  <div className="group cursor-pointer">
                    <div className="relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-500 aspect-[4/3]">
                      <div className="absolute inset-0 bg-gray-900/0 group-hover:bg-gray-900/10 transition-colors duration-300 z-10" />
                      <img
                        src={photo.image}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 text-center mt-4 group-hover:text-blue-600 transition-colors">
                      {photo.title}
                    </h3>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>

          {/* Special Highlights */}
          <div className="mb-24">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
              <FadeIn direction="left" delay={200}>
                <div className="group text-center">
                  <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 aspect-video">
                    <img
                      src={crewImg}
                      alt="Crew Fred Olsen"
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mt-6">Crew Fred Olsen</h3>
                </div>
              </FadeIn>

              <FadeIn direction="right" delay={200}>
                <div className="group text-center">
                  <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 aspect-video">
                    <img
                      src={shipVisit2Img}
                      alt="Ship Visit - Norwegian Jewel"
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mt-6">Ship Visit - Norwegian Jewel</h3>
                </div>
              </FadeIn>
            </div>
          </div>

          {/* About Text */}
          <FadeIn direction="up" delay={400}>
            <div className="max-w-4xl mx-auto bg-gray-50 rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Our History</h2>
              <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                <p>
                  The company is established in May 2000 as a representative office for <span className="font-semibold text-gray-900">Wilhelmsen Ship Management</span> formerly
                  known as Barber International. Initially, the company served for a cruise line company based in Miami, USA.
                  The company has grown rapidly not only to serve cruise line companies but for other types of vessels including FPSO.
                </p>
                <p>
                  In the year 2008, Wilhelmsen Ship Management made significant changes. The cruise ship crewing management
                  was not part of their future plans. <span className="font-semibold text-gray-900">Cipta Wira Tirta</span> continues to serve the existing clients with similar quality of
                  services.
                </p>
                <p>
                  Our reputation and commitment in providing quality crew management services, fair and professional recruitment
                  of seafarers, excellent relationship with authorities and regulators have made the company matured into a
                  reputable manning agent and have added more values for Indonesian seafarers in the international seafarer world.
                  The operations of PT. Cipta Wira Tirta is in Compliance with <span className="font-semibold text-gray-900">ISO 9001 : 2015</span>, <span className="font-semibold text-gray-900">MLC 2006</span> for SRPS and SIUJPAK.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section >
      <Footer />
    </div >
  );
};

export default AboutPage;