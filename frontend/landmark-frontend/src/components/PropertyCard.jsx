// src/components/PropertyCard.jsx
import { useState } from 'react';
import { FaMapMarkerAlt, FaRulerCombined, FaEye } from 'react-icons/fa';
import ImageSlider from './ImageSlider';
import './PropertyCard.css';

export default function PropertyCard({ property, onClick }) {
  const { title, location, size, status, images = [], plotNo } = property;
  const isAvailable = status === 'Available';

  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="prop-card"
      onClick={() => onClick(property)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image Slider */}
      <div className="prop-card__img-wrap">
        <ImageSlider
          images={images}
          alt={title}
          height="210px"
          autoPlay={hovered}
        />

        <span
          className={`prop-card__badge ${
            isAvailable ? 'prop-card__badge--available' : 'prop-card__badge--sold'
          }`}
        >
          {status}
        </span>

        {plotNo && <span className="prop-card__plotno">{plotNo}</span>}
      </div>

      <div className="prop-card__body">
        <h3 className="prop-card__title">{title}</h3>

        <p className="prop-card__location">
          <FaMapMarkerAlt /> {location}
        </p>


        <button className="prop-card__btn">
          <FaEye /> View Details
        </button>
      </div>
    </div>
  );
}