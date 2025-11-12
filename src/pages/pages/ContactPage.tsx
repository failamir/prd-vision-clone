import React, { useState } from 'react';
import { Mail, Phone, Monitor, Plus, Minus } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

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
      address: 'Jl. Raya Denpasar-Gilimanuk',
      details: 'Tabanan, Bali 82171'
    },
    {
      name: 'Yogyakarta',
      address: 'Jl. Malioboro No. 123',
      details: 'Yogyakarta 55213'
    },
    {
      name: 'Surabaya',
      address: 'Jl. Tunjungan No. 456',
      details: 'Surabaya 60261'
    },
    {
      name: 'Bandung',
      address: 'Jl. Asia Afrika No. 789',
      details: 'Bandung 40111'
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission here
  };

  const toggleOffice = (officeName: string) => {
    setExpandedOffice(expandedOffice === officeName ? null : officeName);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {/* Contact Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Contact</h2>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
              <span>Home</span>
              <span>/</span>
              <span>Contact</span>
            </div>
          </div>

          {/* Our Office Section */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Our Office</h3>
            
            <div className="space-y-4">
              {offices.map((office) => (
                <div key={office.name} className="bg-white rounded-lg shadow-sm border">
                  <button
                    onClick={() => toggleOffice(office.name)}
                    className="w-full flex items-center justify-between p-6 text-left"
                  >
                    <span className="text-lg font-medium text-gray-900">{office.name}</span>
                    {expandedOffice === office.name ? (
                      <Minus className="w-5 h-5 text-gray-500" />
                    ) : (
                      <Plus className="w-5 h-5 text-gray-500" />
                    )}
                  </button>
                  
                  {expandedOffice === office.name && (
                    <div className="px-6 pb-6">
                      <p className="text-gray-600 mb-2">{office.address}</p>
                      <p className="text-gray-600">{office.details}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Contact Methods */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Mail className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Email</h4>
              <p className="text-gray-600">info@maritime.com</p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Phone className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Phone</h4>
              <p className="text-gray-600">021-7297 8400</p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Monitor className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Social</h4>
              <div className="space-y-1">
                <p className="text-gray-600">Instagram</p>
                <p className="text-gray-600">Facebook</p>
                <p className="text-gray-600">LinkedIn</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Leave A Message</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your Name*"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Your Email*"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="Subject *"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={6}
                  placeholder="Write your message..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ContactPage;