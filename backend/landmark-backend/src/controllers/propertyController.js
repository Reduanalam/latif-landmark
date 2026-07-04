const Property = require('../models/Property');

// GET /api/properties  (public)
exports.getProperties = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status && status !== 'All') filter.status = status;

    const properties = await Property.find(filter).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, count: properties.length, data: properties });
  } catch (err) {
    next(err);
  }
};

// GET /api/properties/:id  (public)
exports.getProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ success: false, message: 'Property not found.' });
    res.json({ success: true, data: property });
  } catch (err) {
    next(err);
  }
};

// POST /api/admin/properties  (protected)
exports.createProperty = async (req, res, next) => {
  try {
    const property = await Property.create(req.body);
    res.status(201).json({ success: true, data: property });
  } catch (err) {
    next(err);
  }
};

// PUT /api/admin/properties/:id  (protected)
exports.updateProperty = async (req, res, next) => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!property) return res.status(404).json({ success: false, message: 'Property not found.' });
    res.json({ success: true, data: property });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/admin/properties/:id  (protected)
exports.deleteProperty = async (req, res, next) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) return res.status(404).json({ success: false, message: 'Property not found.' });
    res.json({ success: true, message: 'Property deleted.' });
  } catch (err) {
    next(err);
  }
};
