const router = require('express').Router();
const { getProperties, getProperty } = require('../controllers/propertyController');
const { createInquiry } = require('../controllers/inquiryController');
const { getReviews } = require('../controllers/reviewController');
const { getStats } = require('../controllers/statsController');
const { getPlots, bookPlot } = require('../controllers/plotController');

// Properties (read-only public)
router.get('/properties', getProperties);
router.get('/properties/:id', getProperty);

// Contact form submission
router.post('/inquiries', createInquiry);

// Reviews (visible only)
router.get('/reviews', getReviews);

// Site stats
router.get('/stats', getStats);

// Plot map (public - status only, no personal data)
router.get('/plots', getPlots);
router.post('/plots/:plotId/book', bookPlot);

module.exports = router;
