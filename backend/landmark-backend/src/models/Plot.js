const mongoose = require('mongoose');

const plotSchema = new mongoose.Schema(
  {
    plotId: { type: String, required: true, unique: true }, // e.g. "A-N-1"
    block:  { type: String, required: true, enum: ['A', 'B', 'C'] },
    zone:   { type: String, required: true, enum: ['N', 'S'] },
    num:    { type: Number, required: true },
    size:   { type: String, default: '3 Katha' }, // '3 Katha' or '5 Katha'
    status: { type: String, enum: ['available', 'pending', 'booked'], default: 'available' },
    // Booking info
    name:   { type: String, default: '' },
    phone:  { type: String, default: '' },
    email:  { type: String, default: '' },
    note:   { type: String, default: '' },
    // Admin notes
    adminNote: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Plot', plotSchema);
