import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FadeIn } from "@/components/FadeIn";
import { ChevronRight, FileText } from "lucide-react";
import { Link } from "react-router-dom";

const TermsAndConditions = () => {
    const lastUpdated = "December 9, 2024";

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <main className="pt-24 pb-20">
                {/* Header */}
                <div className="bg-slate-900 text-white py-12 md:py-20 mb-12">
                    <div className="container mx-auto px-4">
                        <FadeIn direction="up">
                            <div className="flex flex-col items-center text-center">
                                <div className="bg-slate-800 p-3 rounded-xl mb-6">
                                    <FileText className="w-8 h-8 text-blue-400" />
                                </div>
                                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">Terms & Conditions</h1>
                                <p className="text-slate-400 text-lg max-w-2xl">
                                    Please read these terms carefully before using our services.
                                </p>
                            </div>
                        </FadeIn>
                    </div>
                </div>

                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row gap-12 max-w-7xl mx-auto">
                        {/* Sidebar Navigation - Sticky */}
                        <div className="lg:w-1/4 hidden lg:block">
                            <div className="sticky top-28 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                <h3 className="font-bold text-slate-900 mb-4 px-2">Table of Contents</h3>
                                <nav className="space-y-1">
                                    {[
                                        "Acceptance of Terms",
                                        "Services Description",
                                        "User Obligations",
                                        "Intellectual Property",
                                        "Privacy Policy",
                                        "Limitation of Liability",
                                        "Changes to Terms",
                                        "Governing Law",
                                        "Contact Us"
                                    ].map((item, index) => (
                                        <a
                                            key={index}
                                            href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                                            className="block px-3 py-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium"
                                        >
                                            {item}
                                        </a>
                                    ))}
                                </nav>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="lg:w-3/4">
                            <FadeIn delay={200}>
                                <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-100 prose prose-slate max-w-none">
                                    <p className="text-sm text-slate-500 mb-8 bg-slate-50 inline-block px-4 py-2 rounded-full font-medium">
                                        Last Updated: {lastUpdated}
                                    </p>

                                    <section id="acceptance-of-terms" className="scroll-mt-32 mb-12">
                                        <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-sm font-bold">1</span>
                                            Acceptance of Terms
                                        </h2>
                                        <p className="text-slate-600 leading-relaxed">
                                            By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services. Any participation in this service will constitute acceptance of this agreement. If you do not agree to abide by the above, please do not use this service.
                                        </p>
                                    </section>

                                    <section id="services-description" className="scroll-mt-32 mb-12">
                                        <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-sm font-bold">2</span>
                                            Services Description
                                        </h2>
                                        <p className="text-slate-600 leading-relaxed">
                                            PT. Cipta Wira Tirta provides maritime recruitment and manning services. We connect qualified seafarers with shipping companies and cruise lines. Our services include but are not limited to:
                                        </p>
                                        <ul className="list-none space-y-3 mt-4 text-slate-600">
                                            {[
                                                "Recruitment and placement of seafarers",
                                                "Document processing and verification",
                                                "Training and certification assistance",
                                                "Deployment coordination",
                                                "Crew management services"
                                            ].map((item, i) => (
                                                <li key={i} className="flex items-start gap-3">
                                                    <ChevronRight className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </section>

                                    <section id="user-obligations" className="scroll-mt-32 mb-12">
                                        <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-sm font-bold">3</span>
                                            User Obligations
                                        </h2>
                                        <p className="text-slate-600 leading-relaxed mb-4">
                                            As a user of our platform, you agree to:
                                        </p>
                                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-slate-600">
                                            <p className="mb-4">
                                                Provide accurate, current, and complete information about yourself as prompted by our registration forms.
                                            </p>
                                            <p className="mb-4">
                                                Maintain the security of your password and identification.
                                            </p>
                                            <p>
                                                Maintain and promptly update the registration data, and any other information you provide, to keep it accurate, current, and complete.
                                            </p>
                                        </div>
                                    </section>

                                    <section id="intellectual-property" className="scroll-mt-32 mb-12">
                                        <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-sm font-bold">4</span>
                                            Intellectual Property
                                        </h2>
                                        <p className="text-slate-600 leading-relaxed">
                                            All content included on this site, such as text, graphics, logos, button icons, images, audio clips, digital downloads, data compilations, and software, is the property of PT. Cipta Wira Tirta or its content suppliers and protected by international copyright laws.
                                        </p>
                                    </section>

                                    <section id="privacy-policy" className="scroll-mt-32 mb-12">
                                        <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-sm font-bold">5</span>
                                            Privacy Policy
                                        </h2>
                                        <p className="text-slate-600 leading-relaxed">
                                            Your use of the website is also governed by our Privacy Policy. Please review our <Link to="/privacy" className="text-blue-600 hover:underline font-medium">Privacy Policy</Link>, which also governs the Site and informs users of our data collection practices.
                                        </p>
                                    </section>

                                    <section id="limitation-of-liability" className="scroll-mt-32 mb-12">
                                        <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-sm font-bold">6</span>
                                            Limitation of Liability
                                        </h2>
                                        <p className="text-slate-600 leading-relaxed">
                                            PT. Cipta Wira Tirta shall not be liable for any direct, indirect, incidental, special, consequential or exemplary damages, including but not limited to, damages for loss of profits, goodwill, use, data or other intangible losses resulting from the use of or inability to use the service.
                                        </p>
                                    </section>

                                    <section id="changes-to-terms" className="scroll-mt-32 mb-12">
                                        <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-sm font-bold">7</span>
                                            Changes to Terms
                                        </h2>
                                        <p className="text-slate-600 leading-relaxed">
                                            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
                                        </p>
                                    </section>

                                    <section id="governing-law" className="scroll-mt-32 mb-12">
                                        <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-sm font-bold">8</span>
                                            Governing Law
                                        </h2>
                                        <p className="text-slate-600 leading-relaxed">
                                            These Terms shall be governed and construed in accordance with the laws of Indonesia, without regard to its conflict of law provisions.
                                        </p>
                                    </section>

                                    <section id="contact-us" className="scroll-mt-32">
                                        <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-sm font-bold">9</span>
                                            Contact Us
                                        </h2>
                                        <p className="text-slate-600 leading-relaxed mb-6">
                                            If you have any questions about these Terms, please contact us at:
                                        </p>
                                        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                                            <h4 className="font-bold text-blue-900 mb-2">PT. Cipta Wira Tirta</h4>
                                            <p className="text-blue-800 mb-1">Email: info@ciptawiratirta.com</p>
                                            <p className="text-blue-800">Phone: +62 21 1234 5678</p>
                                            <div className="mt-4 pt-4 border-t border-blue-200">
                                                <Link to="/contact" className="text-blue-600 font-semibold hover:text-blue-800 transition-colors inline-flex items-center gap-2">
                                                    Visit Contact Page <ChevronRight className="w-4 h-4" />
                                                </Link>
                                            </div>
                                        </div>
                                    </section>
                                </div>
                            </FadeIn>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default TermsAndConditions;
