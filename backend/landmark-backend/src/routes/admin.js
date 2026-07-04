const router = require('express').Router();
const { protect } = require('../middleware/auth');

const {
  createProperty,
  updateProperty,
  deleteProperty,
} = require('../controllers/propertyController');

const {
  getInquiries,
  getInquiry,
  updateInquiry,
  deleteInquiry,
} = require('../controllers/inquiryController');

const {
  getAllReviews,
  createReview,
  updateReview,
  deleteReview,
} = require('../controllers/reviewController');

const { updateStats } = require('../controllers/statsController');
const { getDashboard } = require('../controllers/dashboardController');
const {
  adminGetPlots,
  approvePlot,
  rejectPlot,
  releasePlot,
  updatePlot,
  resetAllPlots,
  plotStats,
} = require('../controllers/plotController');

// All admin routes require authentication
router.use(protect);

// Dashboard
router.get('/dashboard', getDashboard);

// Properties
router.post('/properties', createProperty);
router.put('/properties/:id', updateProperty);
router.delete('/properties/:id', deleteProperty);

// Inquiries
router.get('/inquiries', getInquiries);
router.get('/inquiries/:id', getInquiry);
router.put('/inquiries/:id', updateInquiry);
router.delete('/inquiries/:id', deleteInquiry);

// Reviews
router.get('/reviews', getAllReviews);
router.post('/reviews', createReview);
router.put('/reviews/:id', updateReview);
router.delete('/reviews/:id', deleteReview);

// Stats
router.put('/stats', updateStats);

// Plot Booking Management
router.get('/plots',                    adminGetPlots);
router.get('/plots/stats',              plotStats);
router.put('/plots/:plotId/approve',    approvePlot);
router.put('/plots/:plotId/reject',     rejectPlot);
router.put('/plots/:plotId/release',    releasePlot);
router.put('/plots/:plotId',            updatePlot);
router.post('/plots/reset',             resetAllPlots);

module.exports = router;
