const Review = require('../models/Review');

// GET /api/reviews  (public)
exports.getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ visible: true }).sort({ createdAt: -1 });
    res.json({ success: true, count: reviews.length, data: reviews });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/reviews  (protected - includes hidden)
exports.getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json({ success: true, count: reviews.length, data: reviews });
  } catch (err) {
    next(err);
  }
};

// POST /api/admin/reviews  (protected)
exports.createReview = async (req, res, next) => {
  try {
    const review = await Review.create(req.body);
    res.status(201).json({ success: true, data: review });
  } catch (err) {
    next(err);
  }
};

// PUT /api/admin/reviews/:id  (protected)
exports.updateReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!review) return res.status(404).json({ success: false, message: 'Review not found.' });
    res.json({ success: true, data: review });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/admin/reviews/:id  (protected)
exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found.' });
    res.json({ success: true, message: 'Review deleted.' });
  } catch (err) {
    next(err);
  }
};
