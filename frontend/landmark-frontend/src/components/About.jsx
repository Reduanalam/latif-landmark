// src/components/About.jsx
import { FaCheckCircle, FaLeaf, FaHandshake, FaAward } from 'react-icons/fa';
import './About.css';

const values = [
  { icon: <FaLeaf />, title: 'Eco-Friendly', desc: 'Green spaces and sustainable development at the core of every project.' },
  { icon: <FaHandshake />, title: 'Trusted', desc: 'Transparent dealings and legal clarity on every plot sold.' },
  { icon: <FaAward />, title: 'Quality', desc: 'Only premium-grade plots with verified ownership and full utilities.' },
];

const highlights = [
  'RAJUK & Government approved lands',
  'Clear legal documentation & title deeds',
  'Wide road access & drainage',
  'Electricity, gas & water supply',
  'EMI & installment options available',
  'Post-sale customer support',
];

export default function About() {
  return (
    <section className="section about" id="about">
      <div className="container about__inner">
        <div className="about__img-col">
          <div className="about__img-main">
            <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=700&q=80" alt="Latif Landmark Office" />
          </div>
          <div className="about__img-badge">
            <span className="about__badge-number">5+</span>
            <span className="about__badge-text">Years of Trust</span>
          </div>
        </div>

        <div className="about__text-col">
          <p className="section-label">About Latif Landmark</p>
          <h2 className="section-title">Building Dreams,<br />One Plot at a Time</h2>
          <p className="about__para">
            Latif Landmark Ltd. is a premier real estate company in Bangladesh, founded with a vision to make land ownership accessible, transparent, and rewarding for every Bangladeshi family.
          </p>
          <p className="about__para">
            We operate across Araihazar in Narayanganj, Bashundhara Residential Area in Dhaka, and North Jatrabari — offering carefully selected residential plots, commercial land, and ready flats that match every budget and lifestyle.
          </p>

          <ul className="about__highlights">
            {highlights.map((h, i) => (
              <li key={i}><FaCheckCircle /> {h}</li>
            ))}
          </ul>

          <div className="about__values">
            {values.map((v, i) => (
              <div className="about__value-card" key={i}>
                <div className="about__value-icon">{v.icon}</div>
                <div>
                  <h4>{v.title}</h4>
                  <p>{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
