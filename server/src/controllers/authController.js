const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { issueOtp, checkOtp, canResend } = require('../utils/otp');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;
const PW_REGISTER = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
const mask = (e) => e.replace(/^(.).*(@.*)$/, '$1***$2');
const session = (u) => ({ token: generateToken(u), user: { id: u._id, name: u.name, email: u.email, role: u.role } });

// POST /api/auth/register  -> creates the account, then emails a verification code
exports.register = async (req, res, next) => {
  try {
    const { name, password, role } = req.body;
    const email = (req.body.email || '').trim().toLowerCase();
    if (!name || name.trim().length < 2) return res.status(400).json({ message: 'Enter your full name' });
    if (!EMAIL_RE.test(email)) return res.status(400).json({ message: 'Enter a valid email address' });
    if (!PW_REGISTER.test(password || '')) return res.status(400).json({ message: 'Password needs 8+ characters with a letter and a number' });
    if (!['student', 'alumni'].includes(role)) return res.status(400).json({ message: 'Role must be student or alumni' }); // never admin
    if (await User.findOne({ email })) return res.status(409).json({ message: 'Email already registered' });
    const user = await User.create({ name: name.trim(), email, password, role });
    await issueOtp(user);
    res.status(201).json({ otpRequired: true, email: mask(email) });
  } catch (e) { next(e); }
};

// POST /api/auth/login  -> checks email + password, then emails a one-time code (no token yet)
exports.login = async (req, res, next) => {
  try {
    const email = (req.body.email || '').trim().toLowerCase();
    if (!EMAIL_RE.test(email)) return res.status(400).json({ message: 'Enter a valid email address' });
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(req.body.password || ''))) return res.status(401).json({ message: 'Invalid credentials' });
    await issueOtp(user);
    res.json({ otpRequired: true, email: mask(email) });
  } catch (e) { next(e); }
};

// POST /api/auth/verify-otp  -> correct code returns the JWT
exports.verifyOtp = async (req, res, next) => {
  try {
    const email = (req.body.email || '').trim().toLowerCase();
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid code' });
    const r = await checkOtp(user, String(req.body.otp || '').trim());
    if (r === 'ok') return res.json(session(user));
    const msg = { wrong: 'Incorrect code', expired: 'Code expired. Please request a new one.', locked: 'Too many wrong attempts. Please log in again.' }[r];
    res.status(400).json({ message: msg });
  } catch (e) { next(e); }
};

// POST /api/auth/resend-otp
exports.resendOtp = async (req, res, next) => {
  try {
    const email = (req.body.email || '').trim().toLowerCase();
    const user = await User.findOne({ email });
    if (user) {
      if (!(await canResend(user))) return res.status(429).json({ message: 'Please wait 30 seconds before requesting another code' });
      await issueOtp(user);
    }
    res.json({ message: 'If the account exists, a new code has been sent' }); // same answer either way (no email enumeration)
  } catch (e) { next(e); }
};
