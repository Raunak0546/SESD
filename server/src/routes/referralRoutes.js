const router = require('express').Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const c = require('../controllers/referralController');
router.post('/', protect, authorize('student'), c.createReferral);
router.get('/my-requests', protect, authorize('student'), c.getMyRequests);
router.get('/received', protect, authorize('alumni'), c.getReceived);
router.patch('/:id/status', protect, authorize('alumni'), c.updateStatus);
module.exports = router;
