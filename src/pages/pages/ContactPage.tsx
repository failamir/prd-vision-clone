import React, { useState } from 'react';
import { Mail, Phone, Monitor, Plus, Minus, MapPin, Send, Loader2, AlertCircle } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { FadeIn } from '@/components/FadeIn';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ContactPage: React.FC = () => {
  const [expandedOffice, setExpandedOffice] = useState<string | null>('Jakarta');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const offices = [
    {
      name: 'Jakarta',
      address: 'Perkantoran Tanjung Mas Raya Blok B-1 No.17',
      details: 'Jl. Raya Lenteng Agung, Tanjung Barat Jakarta Selatan 12530'
    },
    {
      name: 'Bali',
      address: 'Jl. Tukad Badung XX No.8, Renon',
      details: 'Denpasar Selatan, Kota Denpasar, Bali 80224'
    },
    {
      name: 'Yogyakarta',
      address: 'Jl. Ring Road Utara No.5, Kembang, Maguwoharjo',
      details: 'Depok, Kabupaten Sleman, Daerah Istimewa Yogyakarta 55282'
    },
    {
      name: 'Surabaya',
      address: 'Jl. Banyu Urip No.129A, Banyu Urip',
      details: 'Sawahan, Surabaya, Jawa Timur 60254'
    },
    {
      name: 'Bandung',
      address: 'Jl. Taman Pramuka No.181, Cihapit',
      details: 'Bandung Weta, Kota Bandung, Jawa Barat 40114'
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const { toast } = useToast(); // Assuming useToast is available via hook
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (field: string, value: string): string => {
    switch (field) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        return '';
      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address';
        return '';
      case 'subject':
        if (!value.trim()) return 'Subject is required';
        return '';
      case 'message':
        if (!value.trim()) return 'Message is required';
        return '';
      default:
        return '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const newErrors: Record<string, string> = {};
    newErrors.name = validateField('name', formData.name);
    newErrors.email = validateField('email', formData.email);
    newErrors.subject = validateField('subject', formData.subject);
    newErrors.message = validateField('message', formData.message);

    // Filter out empty errors
    const filteredErrors = Object.fromEntries(
      Object.entries(newErrors).filter(([_, v]) => v !== '')
    );

    if (Object.keys(filteredErrors).length > 0) {
      setErrors(filteredErrors);
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await (supabase as any)
        .from('contact_submissions')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            subject: formData.subject,
            message: formData.message,
          }
        ]);

      if (error) throw error;

      toast({
        title: "Message Sent",
        description: "We've received your message and will get back to you shortly.",
      });

      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error: any) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleOffice = (officeName: string) => {
    setExpandedOffice(expandedOffice === officeName ? null : officeName);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 pb-10 bg-gray-50 overflow-hidden">
        <div className="absolute inset-0 bg-grid-gray-200 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <FadeIn direction="up">
            <h1 className="text-5xl font-bold text-gray-900 mb-6 tracking-tight">Get in Touch</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're here to help you with your maritime career journey. Reach out to us for any inquiries.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Contact Section */}
      <section className="pt-10 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-24">
            {/* Contact Methods */}
            <FadeIn direction="up" delay={100} className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-xl hover:border-blue-200 hover:-translate-y-1 transition-all duration-300 group">
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-600 group-hover:scale-110 transition-all duration-300">
                    <Mail className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 mb-2">Business Inquiries</h4>
                  <p className="text-slate-600">
                    <a href="mailto:Info@wiratirta.com" className="hover:text-blue-600">
                      Info@wiratirta.com
                    </a>
                  </p>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-xl hover:border-blue-200 hover:-translate-y-1 transition-all duration-300 group">
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-600 group-hover:scale-110 transition-all duration-300">
                    <Phone className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">Call Us</h4>
                  <p className="text-gray-600">021-7297 8400</p>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-xl hover:border-blue-200 hover:-translate-y-1 transition-all duration-300 group">
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-600 group-hover:scale-110 transition-all duration-300">
                    <Monitor className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 mb-2">Social Media</h4>
                  <div className="flex justify-center gap-4 text-slate-600">
                    <a
                      href="https://www.instagram.com/ciptawiratirta/?hl=en"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-600 cursor-pointer"
                    >
                      Instagram
                    </a>
                    <a
                      href="https://www.facebook.com/ciptawiratirta/?locale=id_ID"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-600 cursor-pointer"
                    >
                      Facebook
                    </a>
                    <a
                      href="https://www.linkedin.com/company/wira-manning-service/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-600 cursor-pointer"
                    >
                      LinkedIn
                    </a>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Our Office Section */}
            <FadeIn direction="right" delay={200}>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                  <MapPin className="w-6 h-6 text-blue-600" />
                  Our Offices
                </h3>

                <div className="space-y-4">
                  {offices.map((office) => (
                    <div
                      key={office.name}
                      className={`bg-white rounded-xl shadow-sm border transition-all duration-300 overflow-hidden ${expandedOffice === office.name
                        ? 'border-blue-500 ring-4 ring-blue-500/10 shadow-lg'
                        : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                        }`}
                    >
                      <button
                        onClick={() => toggleOffice(office.name)}
                        className="w-full flex items-center justify-between p-5 text-left"
                      >
                        <span className={`text-lg font-semibold transition-colors ${expandedOffice === office.name ? 'text-blue-600' : 'text-gray-900'
                          }`}>
                          {office.name}
                        </span>
                        {expandedOffice === office.name ? (
                          <Minus className="w-5 h-5 text-blue-600" />
                        ) : (
                          <Plus className="w-5 h-5 text-gray-400" />
                        )}
                      </button>

                      <div className={`transition-all duration-300 ease-in-out ${expandedOffice === office.name ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                        }`}>
                        <div className="px-5 pb-5 pt-0">
                          <p className="text-gray-600 mb-1 font-medium">{office.address}</p>
                          <p className="text-gray-500 text-sm">{office.details}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            {/* Contact Form */}
            <FadeIn direction="left" delay={400}>
              <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 md:p-10">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Send us a Message</h3>
                <p className="text-gray-500 mb-8">Fill out the form below and we'll get back to you shortly.</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Your Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your Name"
                        className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none ${errors.name ? 'border-red-500' : 'border-gray-200'}`}
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? 'name-error' : undefined}
                      />
                      {errors.name && (
                        <p id="name-error" className="mt-2 text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Your Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your-email@example.com"
                        className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none ${errors.email ? 'border-red-500' : 'border-gray-200'}`}
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? 'email-error' : undefined}
                      />
                      {errors.email && (
                        <p id="email-error" className="mt-2 text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="How can we help?"
                      className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none ${errors.subject ? 'border-red-500' : 'border-gray-200'}`}
                      aria-invalid={!!errors.subject}
                      aria-describedby={errors.subject ? 'subject-error' : undefined}
                    />
                    {errors.subject && (
                      <p id="subject-error" className="mt-2 text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.subject}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Your Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={5}
                      placeholder="Write your message here..."
                      className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none resize-none ${errors.message ? 'border-red-500' : 'border-gray-200'}`}
                      aria-invalid={!!errors.message}
                      aria-describedby={errors.message ? 'message-error' : undefined}
                    />
                    {errors.message && (
                      <p id="message-error" className="mt-2 text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition-all font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ContactPage;