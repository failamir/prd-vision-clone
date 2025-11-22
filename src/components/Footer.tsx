export const Footer = () => {
  return (
    <footer className="main-footer style-six">
      <div className="auto-container">
        <div className="footer-menu">
          {/* Widgets Section */}
          <div className="widgets-section">
            <div className="row">
              <div className="foot-left">
                <div className="footer-column about-widget">
                  <div className="logo">
                    <a href="https://ciptawiratirta.com">
                      <img src="https://ciptawiratirta.com/uploads/0000/1/2022/06/30/logo-cowpy.png" alt="logo footer" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="foot-right">
                <div className="social-links">
                  <h3 className="mb-2 title-social-links" style={{ color: '#fefefe' }}>Follow Us</h3>
                  <div className="social-icon">
                    <a href="https://www.facebook.com/profile.php?id=100081115663579"><i className="fab fa-facebook-f" /></a>
                    <a href="https://www.instagram.com/wiramanningservice/?hl=id"><i className="fab fa-instagram" /></a>
                    <a href="https://www.linkedin.com/in/wira-manning-service-852398232"><i className="fab fa-linkedin" /></a>
                  </div>
                </div>

                <div className="head-office">
                  <div className="head-office-left">
                    <h3 className="mb-2">Offices</h3>
                  </div>
                  <div className="head-office-right">
                    <ul>
                      <li><a href="/page/faqs">Jakarta</a></li>
                      <li><a href="/page/faqs">Bali</a></li>
                      <li><a href="/page/faqs">Yogyakarta</a></li>
                      <li><a href="/page/faqs">Surabaya</a></li>
                      <li><a href="/page/faqs">Bandung</a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="footer-bottom">
        <div className="auto-container">
          <div className="copyright-text">
            <p>© 2022 <a href="https://kardusinfo.com">Kardusinfo Indonesia</a>. All Right Reserved.</p>
          </div>
        </div>
      </div>

      {/* Scroll To Top */}
      <div
        className="scroll-to-top scroll-to-target"
        data-target="html"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        role="button"
        aria-label="Scroll to top"
      >
        <span className="fa fa-angle-up" />
      </div>
    </footer>
  );
};
