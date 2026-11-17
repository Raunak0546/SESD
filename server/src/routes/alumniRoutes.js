const router = require('express').Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const c = require('../controllers/alumniController');
router.get('/', protect, c.getAlumni);
router.get('/filters', protect, c.getFilterOptions);
router.get('/me', protect, authorize('alumni'), c.getMyProfile);
router.post('/profile', protect, authorize('alumni'), c.upsertProfile);
module.exports = router;
