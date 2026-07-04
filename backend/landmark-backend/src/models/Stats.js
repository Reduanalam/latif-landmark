const mongoose = require('mongoose');

const statsSchema = new mongoose.Schema(
  {
    totalArea: { type: String, default: '100 Decimal' },
    availablePlots: { type: Number, default: 0 },
    soldPlots: { type: Number, default: 0 },
    ongoingProjects: { type: Number, default: 0 },
    totalPlots: { type: Number, default: 0 },
    yearsOfExperience: { type: Number, default: 5 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Stats', statsSchema);
