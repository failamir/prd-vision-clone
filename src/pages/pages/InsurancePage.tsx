import React from 'react';
import { FadeIn } from '@/components/FadeIn';
import bgNewCrop from '@/assets/bg-new-crop.png';
import { Shield, Heart, Anchor } from 'lucide-react';

const InsurancePage: React.FC = () => {
  return (
    <div className="bg-white">

      {/* Hero Section */}
      <section className="relative py-24 bg-gray-50 overflow-hidden">
        <div className="absolute inset-0 bg-grid-gray-200 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <FadeIn direction="up">
            <h1 className="text-5xl font-bold text-gray-900 mb-6 tracking-tight">Insurance & Benefits</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Providing peace of mind for ship owners, seafarers, and their families through comprehensive protection.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
            <FadeIn direction="right" className="order-2 lg:order-1">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-100 rounded-full blur-3xl opacity-30 animate-pulse" />
                <img
                  src={bgNewCrop}
                  alt="Marine Benefits"
                  className="relative w-full max-w-md mx-auto drop-shadow-2xl hover:scale-105 transition-transform duration-500 rounded-2xl"
                />
              </div>
            </FadeIn>

            <FadeIn direction="left" delay={200} className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Partnering with Marine Benefits AS</h2>
              <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                <p>
                  We are proud to be part of a company providing peace of mind for ship owners, seafarers and their families.
                </p>
                <p>
                  In co-operation with <span className="font-semibold text-blue-600">Marine Benefits AS of Norway</span>, we provide seafarers and their dependants with social benefit
                  such as medical, disability and life insurance.
                </p>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <Shield className="w-8 h-8 text-blue-600 flex-shrink-0" />
                  <p className="text-sm font-medium text-gray-700">
                    All work processes are compliant with <span className="font-bold">ISO 9001</span> and <span className="font-bold">ISO 27001</span> standards.
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FadeIn direction="up" delay={300}>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-200 hover:-translate-y-1 transition-all duration-300 group h-full">
                <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                  <Heart className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Medical Insurance</h3>
                <p className="text-gray-600 leading-relaxed">Comprehensive medical coverage for seafarers and their families, ensuring health and well-being.</p>
              </div>
            </FadeIn>

            <FadeIn direction="up" delay={400}>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-200 hover:-translate-y-1 transition-all duration-300 group h-full">
                <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                  <Shield className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Disability Protection</h3>
                <p className="text-gray-600 leading-relaxed">Financial security and support in case of disability, providing stability for the future.</p>
              </div>
            </FadeIn>

            <FadeIn direction="up" delay={500}>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-200 hover:-translate-y-1 transition-all duration-300 group h-full">
                <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                  <Anchor className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Life Insurance</h3>
                <p className="text-gray-600 leading-relaxed">Life insurance coverage to protect your loved ones and provide peace of mind while at sea.</p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
      
    </div>
  );
};

export default InsurancePage;