// src/components/Navbar.jsx
import { useState, useEffect } from 'react';
import { FaBars, FaTimes, FaPhoneAlt } from 'react-icons/fa';
import logo from '../assets/logo-icon.png';
import './Navbar.css';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Properties', href: '#properties' },
  { label: 'Plot Booking', href: '#plot-booking' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'About Us', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''} ${open ? 'navbar--open' : ''}`}>
        <div className="navbar__inner container">

          {/* Logo + Brand */}
          <a href="#home" className="navbar__logo" onClick={() => setOpen(false)}>
            <img src={logo} alt="Latif Landmark Ltd." />
           <div className="navbar__brand-text">
                  <h1 className="navbar__brand-name">Latif Landmark Ltd</h1>
                  
</div>
          </a>

          {/* Desktop Links */}
          <ul className="navbar__links">
            {navLinks.map(l => (
              <li key={l.label}>
                <a href={l.href} className="navbar__link">{l.label}</a>
              </li>
            ))}
          </ul>

          {/* Desktop CTA */}
          <div className="navbar__actions">
            <a href="#contact" className="btn-primary navbar__cta">Book a Plot</a>
          </div>

          {/* Hamburger */}
          <button
            className="navbar__burger"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer — rendered OUTSIDE nav, full separate layer */}
      <div
        className={`mobile-drawer ${open ? 'mobile-drawer--open' : ''}`}
        aria-hidden={!open}
      >
        <div className="mobile-drawer__header">
          <img src={logo} alt="Latif Landmark" className="mobile-drawer__logo" />
          <div>
            <div className="mobile-drawer__brand">Latif Landmark Ltd</div>
            <div className="mobile-drawer__tag">Mark Your Space</div>
          </div>
        </div>

        <nav className="mobile-drawer__nav">
          {navLinks.map(l => (
            <a
              key={l.label}
              href={l.href}
              className="mobile-drawer__link"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="mobile-drawer__footer">
          <a
            href="#contact"
            className="btn-primary mobile-drawer__cta"
            onClick={() => setOpen(false)}
          >
            Book a Plot
          </a>
          <a href="tel:01568540290" className="mobile-drawer__phone">
            <FaPhoneAlt /> 01568540290
          </a>
        </div>
      </div>

      {/* Backdrop */}
      {open && (
        <div
          className="mobile-backdrop"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}