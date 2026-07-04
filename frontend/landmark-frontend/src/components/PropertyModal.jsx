// src/components/PropertyModal.jsx
import { useEffect } from "react";
import {
  FaTimes,
  FaMapMarkerAlt,
  FaRulerCombined,
  FaWhatsapp
} from "react-icons/fa";

import ImageSlider from "./ImageSlider";
import "./PropertyModal.css";

export default function PropertyModal({ property, onClose }) {
  const {
    title,
    location,
    size,
    status,
    images = [],
    description,
    plotNo
  } = property;

  // Lock body scroll + ESC key
  useEffect(() => {
    document.body.style.overflow = "hidden";

    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  if (!images.length) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>

        {/* Close Button */}
        <button className="modal-close" onClick={onClose}>
          <FaTimes />
        </button>

        {/* Slider */}
        <div className="modal-slider-wrap">
          <ImageSlider images={images} alt={title} height="280px" />
          <span
            className={`modal-status-badge ${
              status === "Available" ? "badge-available" : "badge-sold"
            }`}
          >
            {status}
          </span>
        </div>

        {/* Content */}
        <div className="modal-body">
         

          <h2 className="modal-title">{title}</h2>

          <p className="modal-location">
            <FaMapMarkerAlt /> {location}
          </p>

          <div className="modal-meta">
            <div className="modal-meta-item">
             
            </div>
          </div>

          <p className="modal-desc">{description}</p>

          {/* WhatsApp Button */}
          <div className="modal-actions">
            <a
              href="https://wa.me/8801568540290"
              target="_blank"
              rel="noreferrer"
              className="modal-btn modal-btn-wa modal-btn-big"
            >
              <FaWhatsapp /> WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}