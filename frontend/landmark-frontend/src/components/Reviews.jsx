// src/components/Reviews.jsx
import { useState, useEffect, useRef } from "react";
import { FaStar, FaQuoteLeft, FaChevronLeft, FaChevronRight, FaGoogle } from "react-icons/fa";
import { api } from "../api";
import "./Reviews.css";

function StarRating() {
  return (
    <div className="review-stars">
      {[...Array(5)].map((_, i) => <FaStar key={i} className="star-filled" />)}
    </div>
  );
}

const ReviewCard = ({ review }) => (
  <div className="review-card">
    <div className="review-card-header">
      <span className="review-tag">{review.tag}</span>
      <FaQuoteLeft className="quote-icon" />
    </div>
    <p className="review-text">{review.text}</p>
    <StarRating />
    <div className="review-footer">
      <div className="review-user">
        <div className="avatar">{review.avatar}</div>
        <div className="user-info">
          <strong className="user-name">{review.name}</strong>
          <span className="user-location">{review.location}</span>
          <span className="user-date">{review.date}</span>
        </div>
      </div>
      <div className="google-badge">
        <FaGoogle />
        <span>Verified</span>
      </div>
    </div>
  </div>
);

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [active, setActive] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const intervalRef = useRef(null);
  const cardsToShow = 3;

  useEffect(() => {
    api.get("/reviews")
      .then(res => setReviews(res.data))   // backend: { success, data: [...] }
      .catch(() => setReviews([]));
  }, []);

  const next = () => setActive(prev => (prev + 1) % Math.max(reviews.length, 1));
  const prev = () => setActive(prev => (prev - 1 + Math.max(reviews.length, 1)) % Math.max(reviews.length, 1));

  useEffect(() => {
    if (reviews.length === 0) return;
    intervalRef.current = setInterval(next, 5000);
    return () => clearInterval(intervalRef.current);
  }, [reviews]);

  const visibleReviews = [];
  for (let i = 0; i < cardsToShow; i++) {
    if (reviews.length > 0) visibleReviews.push(reviews[(active + i) % reviews.length]);
  }

  if (reviews.length === 0) return (
    <section className="reviews-section" id="reviews">
      <div className="reviews-header">
        <p className="section-label">Client Testimonials</p>
        <h2 className="section-title">What Our Clients Say About Us</h2>
      </div>
      <p style={{ textAlign: "center", color: "#888", padding: "2rem" }}>Loading reviews…</p>
    </section>
  );

  return (
    <section className="reviews-section" id="reviews">
      <div className="reviews-header">
        <p className="section-label">Client Testimonials</p>
        <h2 className="section-title">What Our Clients Say About Us</h2>
      </div>

      {!showAll && (
        <div className="reviews-slider">
          <button className="arrow left" onClick={prev}><FaChevronLeft /></button>
          <div className="reviews-grid">
            {visibleReviews.map((review, i) => <ReviewCard key={review._id || i} review={review} />)}
          </div>
          <button className="arrow right" onClick={next}><FaChevronRight /></button>
        </div>
      )}

      {showAll && (
        <div className="reviews-all-grid">
          {reviews.map((review, i) => <ReviewCard key={review._id || i} review={review} />)}
        </div>
      )}

      <div className="view-all-wrapper">
        <button onClick={() => setShowAll(!showAll)}>
          {showAll ? "Show Less" : "View All Reviews"}
        </button>
      </div>
    </section>
  );
}
