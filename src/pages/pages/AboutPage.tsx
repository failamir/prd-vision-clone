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

      {/* Hero Section - Apple Style Clean */}
      <section className="relative py-20 bg-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white -z-10" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <FadeIn direction="up">
            <h1 className="text-5xl font-bold text-gray-900 mb-6 tracking-tight">About Us</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Building the future of maritime recruitment with integrity, professionalism, and excellence since 2000.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Team Photos Grid - Premium Cards */}
          <div className="mb-32">
            <FadeIn direction="up" delay={200}>
              <h2 className="text-4xl font-bold text-center text-gray-900 mb-16 tracking-tight">Our Team & Activities</h2>
            </FadeIn>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamPhotos.map((photo, index) => (
                <FadeIn key={index} delay={index * 50} direction="up">
                  <div className="group relative overflow-hidden rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 aspect-[500/350] cursor-pointer">
                    <img
                      src={photo.image}
                      alt={photo.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 object-[center_60%]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                      <p className="text-white font-semibold text-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        {photo.title}
                      </p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>

          {/* Special Highlights - Large Feature Cards */}
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              <FadeIn direction="left" delay={200}>
                <div className="group relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 aspect-video">
                  <img
                    src={crewImg}
                    alt="Crew Fred Olsen"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 object-[center_40%]"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500" />
                  <div className="absolute bottom-0 left-0 p-8">
                    <h3 className="text-2xl font-bold text-white drop-shadow-md">Crew Fred Olsen</h3>
                  </div>
                </div>
              </FadeIn>

              <FadeIn direction="right" delay={200}>
                <div className="group relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 aspect-video">
                  <img
                    src={shipVisit2Img}
                    alt="Ship Visit - Norwegian Jewel"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 object-[center_60%]"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500" />
                  <div className="absolute bottom-0 left-0 p-8">
                    <h3 className="text-2xl font-bold text-white drop-shadow-md">Ship Visit - Norwegian Jewel</h3>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>

          {/* Our History - Clean Typography Block */}
          <FadeIn direction="up" delay={400}>
            <div className="max-w-4xl mx-auto bg-gray-50/50 backdrop-blur-xl rounded-[2.5rem] p-10 md:p-16 border border-white/50 shadow-xl">
              <h2 className="text-4xl font-bold text-gray-900 mb-10 tracking-tight text-center">Our History</h2>
              <div className="space-y-8 text-xl text-gray-600 leading-relaxed font-light">
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
      </section>
      <Footer />
    </div >
  );
};

export default AboutPage;