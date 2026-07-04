const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['Available', 'Sold', 'Reserved'],
      default: 'Available',
    },
    description: { type: String, trim: true },
    images: [{ type: String }], // Array of image URLs
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 }, // for custom sort order
  },
  { timestamps: true }
);

module.exports = mongoose.model('Property', propertySchema);
