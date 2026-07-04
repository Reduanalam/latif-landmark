const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    location: { type: String, trim: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    date: { type: String, trim: true }, // e.g. "January 2025"
    avatar: { type: String, trim: true }, // initials e.g. "MR"
    text: { type: String, required: true, trim: true },
    tag: { type: String, trim: true }, // e.g. "Araihazar Plot"
    visible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);
