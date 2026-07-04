const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    plot: { type: String, trim: true },
    message: { type: String, trim: true },
    status: {
      type: String,
      enum: ['new', 'contacted', 'closed'],
      default: 'new',
    },
    notes: { type: String, trim: true }, // internal admin notes
  },
  { timestamps: true }
);

module.exports = mongoose.model('Inquiry', inquirySchema);
