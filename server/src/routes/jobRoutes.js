const router = require('express').Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { createJob, getJobs } = require('../controllers/jobController');
router.get('/', protect, getJobs);
router.post('/', protect, authorize('alumni'), createJob);
module.exports = router;
