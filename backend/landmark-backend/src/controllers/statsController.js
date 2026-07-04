const Stats = require('../models/Stats');

// GET /api/stats  (public)
exports.getStats = async (req, res, next) => {
  try {
    let stats = await Stats.findOne();
    if (!stats) {
      // Return defaults if not seeded yet
      stats = {
        totalArea: '100 Decimal',
        availablePlots: 9,
        soldPlots: 3,
        ongoingProjects: 3,
        totalPlots: 12,
        yearsOfExperience: 5,
      };
    }
    res.json({ success: true, data: stats });
  } catch (err) {
    next(err);
  }
};

// PUT /api/admin/stats  (protected)
exports.updateStats = async (req, res, next) => {
  try {
    let stats = await Stats.findOne();
    if (!stats) {
      stats = await Stats.create(req.body);
    } else {
      Object.assign(stats, req.body);
      await stats.save();
    }
    res.json({ success: true, data: stats });
  } catch (err) {
    next(err);
  }
};
