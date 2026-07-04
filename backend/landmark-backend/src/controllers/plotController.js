const Plot = require('../models/Plot');

// ── PUBLIC ─────────────────────────────────────────────────────────────────

// GET /api/plots  — returns all plots (status + basic info, no personal data)
exports.getPlots = async (req, res, next) => {
  try {
    const plots = await Plot.find().sort({ block: 1, zone: 1, num: 1 }).select('-name -phone -email -note -adminNote');
    res.json({ success: true, data: plots });
  } catch (err) { next(err); }
};

// POST /api/plots/:plotId/book  — visitor submits a booking request
exports.bookPlot = async (req, res, next) => {
  try {
    const plot = await Plot.findOne({ plotId: req.params.plotId });
    if (!plot) return res.status(404).json({ success: false, message: 'Plot not found.' });
    if (plot.status !== 'available')
      return res.status(400).json({ success: false, message: 'Plot is not available.' });

    const { name, phone, email, note } = req.body;
    if (!name || !phone)
      return res.status(400).json({ success: false, message: 'Name and phone are required.' });

    plot.status = 'pending';
    plot.name   = name;
    plot.phone  = phone;
    plot.email  = email || '';
    plot.note   = note  || '';
    await plot.save();

    res.json({ success: true, message: 'Booking request submitted. Admin will review shortly.' });
  } catch (err) { next(err); }
};

// ── ADMIN ──────────────────────────────────────────────────────────────────

// GET /api/admin/plots  — all plots with full booking info
exports.adminGetPlots = async (req, res, next) => {
  try {
    const { block, zone, status } = req.query;
    const filter = {};
    if (block)  filter.block  = block;
    if (zone)   filter.zone   = zone;
    if (status) filter.status = status;
    const plots = await Plot.find(filter).sort({ block: 1, zone: 1, num: 1 });
    res.json({ success: true, data: plots });
  } catch (err) { next(err); }
};

// PUT /api/admin/plots/:plotId/approve  — approve pending → booked
exports.approvePlot = async (req, res, next) => {
  try {
    const plot = await Plot.findOne({ plotId: req.params.plotId });
    if (!plot) return res.status(404).json({ success: false, message: 'Plot not found.' });
    if (plot.status !== 'pending')
      return res.status(400).json({ success: false, message: 'Plot is not in pending state.' });
    plot.status = 'booked';
    if (req.body.adminNote) plot.adminNote = req.body.adminNote;
    await plot.save();
    res.json({ success: true, message: 'Plot approved and marked as booked.', data: plot });
  } catch (err) { next(err); }
};

// PUT /api/admin/plots/:plotId/reject  — reject pending → available
exports.rejectPlot = async (req, res, next) => {
  try {
    const plot = await Plot.findOne({ plotId: req.params.plotId });
    if (!plot) return res.status(404).json({ success: false, message: 'Plot not found.' });
    plot.status    = 'available';
    plot.name      = '';
    plot.phone     = '';
    plot.email     = '';
    plot.note      = '';
    plot.adminNote = req.body.adminNote || '';
    await plot.save();
    res.json({ success: true, message: 'Plot request rejected. Plot is now available.', data: plot });
  } catch (err) { next(err); }
};

// PUT /api/admin/plots/:plotId/release  — release booked → available
exports.releasePlot = async (req, res, next) => {
  try {
    const plot = await Plot.findOne({ plotId: req.params.plotId });
    if (!plot) return res.status(404).json({ success: false, message: 'Plot not found.' });
    plot.status    = 'available';
    plot.name      = '';
    plot.phone     = '';
    plot.email     = '';
    plot.note      = '';
    plot.adminNote = '';
    await plot.save();
    res.json({ success: true, message: 'Plot released back to available.', data: plot });
  } catch (err) { next(err); }
};

// PUT /api/admin/plots/:plotId  — manual update by admin
exports.updatePlot = async (req, res, next) => {
  try {
    const plot = await Plot.findOneAndUpdate(
      { plotId: req.params.plotId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!plot) return res.status(404).json({ success: false, message: 'Plot not found.' });
    res.json({ success: true, data: plot });
  } catch (err) { next(err); }
};

// POST /api/admin/plots/reset  — reset ALL plots to available
exports.resetAllPlots = async (req, res, next) => {
  try {
    await Plot.updateMany({}, { status: 'available', name: '', phone: '', email: '', note: '', adminNote: '' });
    res.json({ success: true, message: 'All plots reset to available.' });
  } catch (err) { next(err); }
};

// GET /api/admin/plots/stats  — summary counts
exports.plotStats = async (req, res, next) => {
  try {
    const [total, available, pending, booked] = await Promise.all([
      Plot.countDocuments(),
      Plot.countDocuments({ status: 'available' }),
      Plot.countDocuments({ status: 'pending' }),
      Plot.countDocuments({ status: 'booked' }),
    ]);
    res.json({ success: true, data: { total, available, pending, booked } });
  } catch (err) { next(err); }
};
