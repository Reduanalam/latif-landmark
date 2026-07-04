const Property = require('../models/Property');
const Inquiry = require('../models/Inquiry');
const Review = require('../models/Review');
const Plot = require('../models/Plot');

// GET /api/admin/dashboard  (protected)
exports.getDashboard = async (req, res, next) => {
  try {
    const [
      totalProperties,
      availableProperties,
      soldProperties,
      totalInquiries,
      newInquiries,
      contactedInquiries,
      totalReviews,
      recentInquiries,
      totalPlots,
      availablePlots,
      pendingPlots,
      bookedPlots,
      recentPendingPlots,
    ] = await Promise.all([
      Property.countDocuments(),
      Property.countDocuments({ status: 'Available' }),
      Property.countDocuments({ status: 'Sold' }),
      Inquiry.countDocuments(),
      Inquiry.countDocuments({ status: 'new' }),
      Inquiry.countDocuments({ status: 'contacted' }),
      Review.countDocuments({ visible: true }),
      Inquiry.find({ status: 'new' }).sort({ createdAt: -1 }).limit(5),
      Plot.countDocuments(),
      Plot.countDocuments({ status: 'available' }),
      Plot.countDocuments({ status: 'pending' }),
      Plot.countDocuments({ status: 'booked' }),
      Plot.find({ status: 'pending' }).sort({ createdAt: -1 }).limit(5),
    ]);

    res.json({
      success: true,
      data: {
        properties: { total: totalProperties, available: availableProperties, sold: soldProperties },
        inquiries: { total: totalInquiries, new: newInquiries, contacted: contactedInquiries },
        reviews: { total: totalReviews },
        recentInquiries,
        plots: { total: totalPlots, available: availablePlots, pending: pendingPlots, booked: bookedPlots },
        recentPendingPlots,
      },
    });
  } catch (err) {
    next(err);
  }
};
