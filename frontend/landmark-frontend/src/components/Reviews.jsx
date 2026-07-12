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

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', location: '', rating: 5, text: '', tag: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState(null);
  const [submitErr, setSubmitErr] = useState(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitMsg(null);
    setSubmitErr(null);
    try {
      const res = await api.post('/reviews', form);
      setSubmitMsg(res.message || 'Thank you! Your review will appear after approval.');
      setForm({ name: '', location: '', rating: 5, text: '', tag: '' });
    } catch (err) {
      setSubmitErr(err.message || 'Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // NOTE: this JSX is inlined directly below (not a separate nested component function).
  // Defining it as a nested function component would cause React to remount the form
  // on every keystroke, kicking inputs out of focus after each character/word.
  const reviewFormJsx = (
    <div className="review-form-wrapper">
      <h3 className="review-form-title">Share Your Experience</h3>
      {submitMsg ? (
        <div className="review-form-success">✓ {submitMsg}</div>
      ) : (
        <form onSubmit={handleSubmit} className="review-form">
          {submitErr && <div className="review-form-error">{submitErr}</div>}
          <div className="review-form-row">
            <input
              type="text" placeholder="Your Name *" required
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            />
            <input
              type="text" placeholder="Location (e.g. Dhaka)"
              value={form.location}
              onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
            />
          </div>
          <input
            type="text" placeholder="Which property/plot? (optional)"
            value={form.tag}
            onChange={e => setForm(f => ({ ...f, tag: e.target.value }))}
          />
          <div className="review-form-rating">
            <span>Your Rating:</span>
            {[1, 2, 3, 4, 5].map(n => (
              <FaStar
                key={n}
                className={n <= form.rating ? "star-filled" : "star-empty"}
                onClick={() => setForm(f => ({ ...f, rating: n }))}
                style={{ cursor: 'pointer' }}
              />
            ))}
          </div>
          <textarea
            placeholder="Write your review *" required rows={4}
            value={form.text}
            onChange={e => setForm(f => ({ ...f, text: e.target.value }))}
          />
          <button type="submit" disabled={submitting} className="review-form-submit">
            {submitting ? 'Submitting…' : 'Submit Review'}
          </button>
        </form>
      )}
    </div>
  );

  if (reviews.length === 0) return (
    <section className="reviews-section" id="reviews">
      <div className="reviews-header">
        <p className="section-label">Client Testimonials</p>
        <h2 className="section-title">What Our Clients Say About Us</h2>
      </div>
      <p style={{ textAlign: "center", color: "#888", padding: "2rem" }}>Loading reviews…</p>

      <div className="view-all-wrapper">
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Hide Review Form" : "Write a Review"}
        </button>
      </div>
      {showForm && reviewFormJsx}
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
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Hide Review Form" : "Write a Review"}
        </button>
      </div>

      {showForm && reviewFormJsx}
    </section>
  );
}