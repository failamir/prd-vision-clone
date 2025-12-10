import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FadeIn } from "@/components/FadeIn";
import { Shield, Lock, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
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
                                    <Shield className="w-8 h-8 text-green-400" />
                                </div>
                                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">Privacy Policy</h1>
                                <p className="text-slate-400 text-lg max-w-2xl">
                                    We value your privacy and are committed to protecting your personal data.
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
                                        "Introduction",
                                        "Information We Collect",
                                        "How We Use Your Data",
                                        "Data Security",
                                        "Cookies",
                                        "Third-Party Links",
                                        "Children's Privacy",
                                        "Your Rights",
                                        "Changes to Policy",
                                        "Contact Us"
                                    ].map((item, index) => (
                                        <a
                                            key={index}
                                            href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                                            className="block px-3 py-2 text-slate-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors text-sm font-medium"
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

                                    <section id="introduction" className="scroll-mt-32 mb-12">
                                        <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600 text-sm font-bold">1</span>
                                            Introduction
                                        </h2>
                                        <p className="text-slate-600 leading-relaxed">
                                            PT. Cipta Wira Tirta is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
                                        </p>
                                    </section>

                                    <section id="information-we-collect" className="scroll-mt-32 mb-12">
                                        <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600 text-sm font-bold">2</span>
                                            Information We Collect
                                        </h2>
                                        <p className="text-slate-600 leading-relaxed mb-4">
                                            We may collect information about you in a variety of ways. The information we may collect on the Site includes:
                                        </p>
                                        <div className="grid md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                            <div>
                                                <h4 className="font-bold text-slate-900 mb-2">Personal Data</h4>
                                                <p className="text-sm text-slate-600">
                                                    Personally identifiable information, such as your name, shipping address, email address, and telephone number that you voluntarily give to us when you register with the Site.
                                                </p>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900 mb-2">Derivative Data</h4>
                                                <p className="text-sm text-slate-600">
                                                    Information our servers automatically collect when you access the Site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Site.
                                                </p>
                                            </div>
                                        </div>
                                    </section>

                                    <section id="how-we-use-your-data" className="scroll-mt-32 mb-12">
                                        <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600 text-sm font-bold">3</span>
                                            How We Use Your Data
                                        </h2>
                                        <p className="text-slate-600 leading-relaxed">
                                            Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:
                                        </p>
                                        <ul className="list-none space-y-3 mt-4 text-slate-600">
                                            {[
                                                "Create and manage your account.",
                                                "Directly communicate with you about job opportunities.",
                                                "Email you regarding your account or order.",
                                                "Fulfill and manage purchases, orders, payments, and other transactions.",
                                                "Generate a personal profile about you to make future visits to the Site more personalized.",
                                                "Monitor and analyze usage and trends to improve your experience."
                                            ].map((item, i) => (
                                                <li key={i} className="flex items-start gap-3">
                                                    <ChevronRight className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </section>

                                    <section id="data-security" className="scroll-mt-32 mb-12">
                                        <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600 text-sm font-bold">4</span>
                                            Data Security
                                        </h2>
                                        <div className="flex items-start gap-4 bg-green-50 p-6 rounded-2xl border border-green-100">
                                            <Lock className="w-6 h-6 text-green-600 shrink-0 mt-1" />
                                            <div>
                                                <p className="text-slate-700 leading-relaxed">
                                                    We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
                                                </p>
                                            </div>
                                        </div>
                                    </section>

                                    <section id="cookies" className="scroll-mt-32 mb-12">
                                        <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600 text-sm font-bold">5</span>
                                            Cookies
                                        </h2>
                                        <p className="text-slate-600 leading-relaxed">
                                            We may use cookies, web beacons, tracking pixels, and other tracking technologies on the Site to help customize the Site and improve your experience. When you access the Site, your personal information is not collected through the use of tracking technology.
                                        </p>
                                    </section>

                                    <section id="third-party-links" className="scroll-mt-32 mb-12">
                                        <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600 text-sm font-bold">6</span>
                                            Third-Party Links
                                        </h2>
                                        <p className="text-slate-600 leading-relaxed">
                                            The Site may contain links to third-party websites and applications of interest, including advertisements and external services. Once you have used these links to leave the Site, any information you provide to these third parties is not covered by this Privacy Policy, and we cannot guarantee the safety and privacy of your information.
                                        </p>
                                    </section>

                                    <section id="your-rights" className="scroll-mt-32 mb-12">
                                        <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600 text-sm font-bold">7</span>
                                            Your Rights
                                        </h2>
                                        <p className="text-slate-600 leading-relaxed">
                                            You have the right to request access to the personal data we hold about you, to request that we rectify or erase your personal data, and to object to the processing of your personal data.
                                        </p>
                                    </section>

                                    <section id="changes-to-policy" className="scroll-mt-32 mb-12">
                                        <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600 text-sm font-bold">8</span>
                                            Changes to This Policy
                                        </h2>
                                        <p className="text-slate-600 leading-relaxed">
                                            We may update this Privacy Policy from time to time in order to reflect, for example, changes to our practices or for other operational, legal, or regulatory reasons.
                                        </p>
                                    </section>

                                    <section id="contact-us" className="scroll-mt-32">
                                        <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600 text-sm font-bold">9</span>
                                            Contact Us
                                        </h2>
                                        <p className="text-slate-600 leading-relaxed mb-6">
                                            If you have questions or comments about this Privacy Policy, please contact us at:
                                        </p>
                                        <div className="bg-green-50 p-6 rounded-2xl border border-green-100">
                                            <h4 className="font-bold text-green-900 mb-2">PT. Cipta Wira Tirta</h4>
                                            <p className="text-green-800 mb-1">Email: privacy@ciptawiratirta.com</p>
                                            <p className="text-green-800">Phone: +62 21 1234 5678</p>
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

export default PrivacyPolicy;
