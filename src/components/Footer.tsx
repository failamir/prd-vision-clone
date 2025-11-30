import { Facebook, Instagram, Linkedin, ChevronUp } from "lucide-react";

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8 relative">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <a href="https://ciptawiratirta.com" className="block">
              <img
                src="src/assets/logo.png"
                alt="Cipta Wira Tirta Logo"
                className="h-12 w-auto brightness-0 invert opacity-90 hover:opacity-100 transition-opacity"
              />
            </a>
          </div>

          {/* Right Side Content */}
          <div className="flex flex-col md:flex-row gap-12 md:gap-24 flex-grow justify-end">
            {/* Social Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Follow Us</h3>
              <div className="flex items-center gap-6">
                <a
                  href="https://www.facebook.com/profile.php?id=100081115663579"
                  className="text-gray-400 hover:text-white transition-colors transform hover:scale-110"
                  aria-label="Facebook"
                >
                  <Facebook className="w-6 h-6" />
                </a>
                <a
                  href="https://www.instagram.com/wiramanningservice/?hl=id"
                  className="text-gray-400 hover:text-white transition-colors transform hover:scale-110"
                  aria-label="Instagram"
                >
                  <Instagram className="w-6 h-6" />
                </a>
                <a
                  href="https://www.linkedin.com/in/wira-manning-service-852398232"
                  className="text-gray-400 hover:text-white transition-colors transform hover:scale-110"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-6 h-6" />
                </a>
              </div>
            </div>

            {/* Offices */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Offices</h3>
              <ul className="flex flex-wrap gap-3">
                {['Jakarta', 'Bali', 'Yogyakarta', 'Surabaya', 'Bandung'].map((city) => (
                  <li key={city}>
                    <a
                      href="/contact"
                      className="inline-block px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors"
                    >
                      {city}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 mt-8 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} <a href="https://ciptawiratirta.com" className="hover:text-white transition-colors">PT. Cipta Wira Tirta</a>. All Rights Reserved.</p>
        </div>
      </div>

      {/* Scroll To Top */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 p-3 bg-white text-slate-900 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 z-50 group"
        aria-label="Scroll to top"
      >
        <ChevronUp className="w-6 h-6 group-hover:text-blue-600 transition-colors" />
      </button>
    </footer>
  );
};
