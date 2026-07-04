// src/components/Footer.jsx
import { FaFacebook, FaInstagram, FaLinkedin, FaWhatsapp, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaHeart } from 'react-icons/fa';
import logo from '../assets/logo-icon.png';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="container footer__grid">
          {/* Brand */}
          <div className="footer__brand">
            {/* Logo + Brand */}
          <a href="#home" className="navbar__logo" onClick={() => setOpen(false)}>
            <img src={logo} alt="Latif Landmark Ltd." />
           <div className="navbar__brand-text">
                  <h2 className="navbar__brand-name">Latif Landmark Ltd</h2>
                 <p className="navbar__brand-tag">Mark Your Space</p>
            </div>
          </a>
            <p className="footer__brand-desc">
              Latif Landmark Ltd. — making land ownership simple, transparent, and rewarding across Bangladesh's most promising locations.
            </p>
            <div className="footer__social">
              <a href="https://www.facebook.com/profile.php?id=61588266028239" target="_blank" rel="noreferrer" aria-label="Facebook"><FaFacebook /></a>
              <a href="https://www.instagram.com/latiflandmark?igsh=MXBvZTltN2d1dzFmZQ%3D%3D" target="_blank" rel="noreferrer" aria-label="Instagram"><FaInstagram /></a>
              <a href="https://www.linkedin.com/feed/" target="_blank" rel="noreferrer" aria-label="LinkedIn"><FaLinkedin /></a>
              <a href="https://wa.me/8801568540290" target="_blank" rel="noreferrer" aria-label="WhatsApp"><FaWhatsapp /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer__col">
            <h4 className="footer__col-title">Quick Links</h4>
            <ul className="footer__links">
              <li><a href="#home">Home</a></li>
              <li><a href="#properties">Properties</a></li>
              <li><a href="#about">About Us</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>

          {/* Locations */}
          <div className="footer__col">
            <h4 className="footer__col-title">Plot Locations</h4>
            <ul className="footer__links">
              <li><FaMapMarkerAlt /> Noikahon, Araihazar, Narayanganj</li>
              <li><FaMapMarkerAlt /> H-777-778, Block-N, Bashundhara R/A, Dhaka</li>
              <h4 className="footer__col-title">Office Locations</h4>
              <li>1/1/D/1 North Jatrabari, Dhaka</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer__col">
            <h4 className="footer__col-title">Contact Info</h4>
            <ul className="footer__contact-list">
              <li><FaPhoneAlt /> <a href="tel:01711760509">01711-760508</a></li>
              <li><FaPhoneAlt /> <a href="tel:01711760509">01711760509</a></li>
              <li><FaPhoneAlt /> <a href="tel:01712823022">01712823022</a></li>
              <li><FaEnvelope /> <a href="mailto:info.latiflandmark@gmail.com">info.latiflandmark@gmail.com</a></li>
              <li><FaMapMarkerAlt /> Office: 1/1/D/1 North Jatrabari, Bibir Bagicha, Dhaka</li>
            </ul>
          </div>
        </div>
      </div>

  
    </footer>
  );
}
