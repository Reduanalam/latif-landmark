// src/components/Contact.jsx
import { useState } from 'react';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaInstagram, FaLinkedin, FaWhatsapp, FaPaperPlane } from 'react-icons/fa';
import { api } from '../api';
import './Contact.css';

const initialForm = { name: '', phone: '', email: '', message: '', plot: '' };

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name || !form.phone) return;
    setLoading(true);
    setError(null);
    try {
      await api.post('/inquiries', form);
      setSubmitted(true);
      setTimeout(() => { setForm(initialForm); setSubmitted(false); }, 4000);
    } catch (err) {
      setError(err.message || 'Failed to send inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section contact" id="contact">
      <div className="container">
        <div className="contact__header">
          <p className="section-label">Get In Touch</p>
          <h2 className="section-title">Contact & Inquiry</h2>
          <p className="section-subtitle">
            Interested in a plot? Fill the form below and our team will reach out within 24 hours.
          </p>
        </div>

        <div className="contact__grid">
          {/* Info Panel */}
          <div className="contact__info">
            <h3 className="contact__info-title">Latif Landmark Ltd.</h3>
            <p className="contact__tagline">Mark Your Space</p>

            <div className="contact__info-items">
              <div className="contact__info-item">
                <FaPhoneAlt className="contact__icon" />
                <div>
                  <span className="contact__info-label">Phone / WhatsApp</span>
                  <a href="tel:01711760509" className="contact__info-val">01568540290</a>
                </div>
              </div>
              <div className="contact__info-item">
                <FaEnvelope className="contact__icon" />
                <div>
                  <span className="contact__info-label">Email</span>
                  <a href="mailto:info.latiflandmark@gmail.com" className="contact__info-val">info.latiflandmark@gmail.com</a>
                </div>
              </div>
              <div className="contact__info-item">
                <FaMapMarkerAlt className="contact__icon" />
                <div>
                  <span className="contact__info-label">Plot Locations</span>
                  <span className="contact__info-val">Noikahon, Araihazar, Narayanganj</span>
                  <span className="contact__info-val">H-777-778, Block-N, Bashundhara R/A, Dhaka</span>
                </div>
              </div>
              <div className="contact__info-item">
                <FaMapMarkerAlt className="contact__icon" />
                <div>
                  <span className="contact__info-label">Office Address</span>
                  <span className="contact__info-val">1/1/D/1 North Jatrabari, Bibir Bagicha, Dhaka</span>
                </div>
              </div>
            </div>

            <div className="contact__social">
              <a href="https://www.facebook.com/profile.php?id=61588266028239" target="_blank" rel="noreferrer" className="contact__social-link contact__social-link--fb">
                <FaFacebook /> Facebook
              </a>
              <a href="https://www.instagram.com/latiflandmark?igsh=MXBvZTltN2d1dzFmZQ%3D%3D" target="_blank" rel="noreferrer" className="contact__social-link contact__social-link--ig">
                <FaInstagram /> Instagram
              </a>
              <a href="https://www.linkedin.com/feed/" target="_blank" rel="noreferrer" className="contact__social-link contact__social-link--li">
                <FaLinkedin /> LinkedIn
              </a>
              <a href="https://wa.me/8801568540290" target="_blank" rel="noreferrer" className="contact__social-link contact__social-link--wa">
                <FaWhatsapp /> WhatsApp
              </a>
            </div>
          </div>

          {/* Form */}
          <div className="contact__form-wrap">
            {submitted ? (
              <div className="contact__success">
                <div className="contact__success-icon">✓</div>
                <h3>Inquiry Sent!</h3>
                <p>Thank you! Our team will contact you within 24 hours.</p>
              </div>
            ) : (
              <form className="contact__form" onSubmit={handleSubmit}>
                <h3 className="contact__form-title">Send an Inquiry</h3>
                <div className="contact__form-row">
                  <div className="contact__field">
                    <label>Full Name *</label>
                    <input name="name" value={form.name} onChange={handleChange} placeholder="Your name" required />
                  </div>
                  <div className="contact__field">
                    <label>Phone Number *</label>
                    <input name="phone" value={form.phone} onChange={handleChange} placeholder="01XXXXXXXXX" required />
                  </div>
                </div>
                <div className="contact__field">
                  <label>Email Address</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com" />
                </div>
                <div className="contact__field">
                  <label>Interested Plot / Location</label>
                  <select name="plot" value={form.plot} onChange={handleChange}>
                    <option value="">Select a plot or location</option>
                    <option>Noikahon, Araihazar, Narayanganj</option>
                    <option>Bashundhara R/A, Dhaka</option>
                    <option>North Jatrabari, Dhaka</option>
                    <option>Any available plot</option>
                  </select>
                </div>
                <div className="contact__field">
                  <label>Message</label>
                  <textarea name="message" value={form.message} onChange={handleChange} placeholder="Write your inquiry, budget, or requirements..." rows={4} />
                </div>
                {error && (
                  <p style={{ color: "red", marginBottom: "0.5rem", fontSize: "0.9rem" }}>{error}</p>
                )}
                <button type="submit" className="btn-primary contact__submit" disabled={loading}>
                  <FaPaperPlane /> {loading ? "Sending…" : "Send Inquiry"}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Google Map Embed */}
        {/* <div className="contact__map">
          <h3 className="contact__map-title">Find Us on Map</h3>
          <div className="contact__map-frame">
            <iframe
              title="Latif Landmark Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3650.8921780252445!2d90.6519!3d23.8041!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b7d6a2a71a71%3A0x1!2sAraihazar%2C%20Narayanganj!5e0!3m2!1sen!2sbd!4v1709000000000!5m2!1sen!2sbd"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div> */}
      </div>
    </section>
  );
}
