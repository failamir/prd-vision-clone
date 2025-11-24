import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import RPImage from '@/assets/RP.png';

const RecruitmentProcedurePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Page Title */}
      <section className="page-title mt-16">
        <div className="auto-container">
          <div className="title-outer py-10 text-center">
            <h1 className="text-3xl md:text-4xl font-bold">Recruitment Procedure</h1>
            <ul className="page-breadcrumb flex items-center justify-center gap-2 text-sm text-gray-600 mt-2">
              <li><Link to="/">Home</Link></li>
              <li>/</li>
              <li>Recruitment Procedure</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Content */}
      <div>
        <div className="auto-container">
          <div className="bravo-text text-box text-center py-10">
            <p className="mt-20 text-gray-800">Follow the requirement flow below</p>
            <div className="flex justify-center mt-6">
              <img
                src={RPImage}
                alt="Recruitment Procedure Flow"
                className="w-full max-w-3xl h-auto"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Call To Action */}
      <section className="call-to-action my-24">
        <div className="auto-container">
          <div className="outer-box">
            <div className="content-column text-center">
              <div className="sec-title">
                <h2>Let's Find Your Dream Job</h2>
                <div className="text"></div>
                <Link to="/" className="theme-btn btn-style-one inline-block mt-4">
                  <span className="btn-title">Back</span>
                </Link>
              </div>
            </div>
            <div className="image-column" />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default RecruitmentProcedurePage;