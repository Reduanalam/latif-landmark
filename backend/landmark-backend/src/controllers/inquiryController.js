const Inquiry = require('../models/Inquiry');

// POST /api/inquiries  (public - contact form submission)
exports.createInquiry = async (req, res, next) => {
  try {
    const { name, phone, email, plot, message } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ success: false, message: 'Name and phone are required.' });
    }

    const inquiry = await Inquiry.create({ name, phone, email, plot, message });
    res.status(201).json({
      success: true,
      message: 'Inquiry submitted. Our team will contact you within 24 hours.',
      data: { id: inquiry._id },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/inquiries  (protected)
exports.getInquiries = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const total = await Inquiry.countDocuments(filter);
    const inquiries = await Inquiry.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: inquiries,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/inquiries/:id  (protected)
exports.getInquiry = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) return res.status(404).json({ success: false, message: 'Inquiry not found.' });
    res.json({ success: true, data: inquiry });
  } catch (err) {
    next(err);
  }
};

// PUT /api/admin/inquiries/:id  (protected - update status/notes)
exports.updateInquiry = async (req, res, next) => {
  try {
    const { status, notes } = req.body;
    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { status, notes },
      { new: true, runValidators: true }
    );
    if (!inquiry) return res.status(404).json({ success: false, message: 'Inquiry not found.' });
    res.json({ success: true, data: inquiry });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/admin/inquiries/:id  (protected)
exports.deleteInquiry = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
    if (!inquiry) return res.status(404).json({ success: false, message: 'Inquiry not found.' });
    res.json({ success: true, message: 'Inquiry deleted.' });
  } catch (err) {
    next(err);
  }
};
