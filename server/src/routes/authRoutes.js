const router = require('express').Router();
const c = require('../controllers/authController');
router.post('/register', c.register);
router.post('/login', c.login);
router.post('/verify-otp', c.verifyOtp);
router.post('/resend-otp', c.resendOtp);
module.exports = router;
