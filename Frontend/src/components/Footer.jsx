import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, ArrowUp } from "lucide-react";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="footer">
      {/* Top Orange Line */}
      <div className="footer-top-line"></div>

      <div className="footer-container">
        {/* About */}
        <div className="footer-column footer-about">
          <div className="footer-logo">
            <div className="logo-img">
              <img
                src="/logoa.png"
                alt="Bhartiy Lokvani Party"
                className="footer-logo-icon"
              />
            </div>

            <div>
              <h2>भारतीय लोकवाणी पार्टी</h2>
              <span>Bhartiya Lokvani Party</span>
            </div>
          </div>

          <p>
            जनता की आवाज़, जनता के साथ। भारतीय लोकवाणी पार्टी लोकतांत्रिक
            मूल्यों, पारदर्शिता और जनभागीदारी के प्रति प्रतिबद्ध है।
          </p>

          <div className="footer-social">
            <a href="#" aria-label="Facebook">
              <FaFacebook size={19} />
            </a>

            <a href="#" aria-label="Instagram">
              <FaInstagram size={19} />
            </a>

            <a href="#" aria-label="Twitter">
              <FaTwitter size={19} />
            </a>

            <a href="#" aria-label="YouTube">
              <FaYoutube size={19} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-column">
          <h3>Quick Links</h3>

          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>

            <li>
              <Link to="/about">About Us</Link>
            </li>

            <li>
              <Link to="/leaders">Our Leaders</Link>
            </li>

            <li>
              <Link to="/newslist">News & Updates</Link>
            </li>

            <li>
              <Link to="/events">Events</Link>
            </li>
          </ul>
        </div>

        {/* Important Links */}
        <div className="footer-column">
          <h3>Important Links</h3>

          <ul>
            <li>
              <Link to="/gallery">Photo Gallery</Link>
            </li>

            <li>
              <Link to="/videos">Video Gallery</Link>
            </li>

            <li>
              <Link to="/join-us">Join Us</Link>
            </li>

            <li>
              <Link to="/contact">Contact Us</Link>
            </li>
            <li>
              <Link to="/donation">Donation</Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-column footer-contact">
          <h3>Contact Us</h3>

          <div className="contact-item">
            <MapPin size={20} />
            <span>Plot NO.6, A Block, Amity Green Colony, Hasemau Post- Laulai, Lucknow, Uttar Pradesh </span>
          </div>

          <div className="contact-item">
            <Phone size={20} />
            <span>+91 94544 13825, 6388662058, 9044621361</span>
          </div>

          <div className="contact-item">
            <Mail size={20} />
            <span>bhartiyalokwaniparti@gmail.com</span>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <p>
            © {new Date().getFullYear()} Bhartiya Lokvani Party. All Rights
            Reserved.
          </p>

          <p>Designed & Developed by Prince Vishwakarma</p>

          <button
            className="back-to-top"
            onClick={scrollToTop}
            aria-label="Back to top"
          >
            <ArrowUp size={20} />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
