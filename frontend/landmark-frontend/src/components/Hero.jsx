// src/components/Hero.jsx
import { FaMapMarkerAlt, FaArrowDown } from 'react-icons/fa';
import { stats } from '../data/properties';
import './Hero.css';

export default function Hero() {
  return (
    <section className="hero" id="home">
      {/* Background layers */}
      <div className="hero__bg">
        <div className="hero__bg-img" />
        <div className="hero__bg-overlay" />
        <div className="hero__bg-pattern" />
      </div>

      <div className="hero__content container">
        <div className="hero__text">
          <span className="hero__tag animate-fadeInUp">
            <FaMapMarkerAlt /> Araihazar <FaMapMarkerAlt /> Bashundhara  
          </span>
          <h1 className="hero__title animate-fadeInUp delay-1">
            Mark Your Space<br />
            <span className="hero__title-accent">Build Your Legacy</span>
          </h1>
          <p className="hero__subtitle animate-fadeInUp delay-2">
            Latif Landmark Ltd. offers premium residential and commercial plots across Bangladesh's most promising locations — trusted by hundreds of families.
          </p>
          <div className="hero__actions animate-fadeInUp delay-3">
            <a href="#properties" className="btn-primary">Explore Properties</a>
          </div>
        </div>
 
        
        {/* <div className="hero__stats animate-fadeInUp delay-4">
          <div className="hero__stat">
            <span className="hero__stat-number">{stats.availablePlots}+</span>
            <span className="hero__stat-label">Available Plots</span>
          </div>
          <div className="hero__stat-divider" />
          <div className="hero__stat">
            <span className="hero__stat-number">{stats.soldPlots}+</span>
            <span className="hero__stat-label">Sold Plots</span>
          </div>
          <div className="hero__stat-divider" />
          <div className="hero__stat">
            <span className="hero__stat-number">{stats.ongoingProjects}</span>
            <span className="hero__stat-label">Ongoing Projects</span>
          </div>
          <div className="hero__stat-divider" />
          <div className="hero__stat">
            <span className="hero__stat-number">{stats.yearsOfExperience}+</span>
            <span className="hero__stat-label">Years Experience</span>
          </div>
        </div> */}
      </div> 

      {/* Scroll indicator */}
      <a href="#properties" className="hero__scroll-indicator">
        <FaArrowDown />
      </a>
    </section>
  );
}
