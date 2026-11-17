const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Authentication: who are you?
exports.protect = async (req, res, next) => {
  try {
    const h = req.headers.authorization;
    if (!h?.startsWith('Bearer ')) return res.status(401).json({ message: 'Not authorized' });
    const decoded = jwt.verify(h.split(' ')[1], process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    if (!req.user) return res.status(401).json({ message: 'User no longer exists' });
    next();
  } catch { res.status(401).json({ message: 'Invalid or expired token' }); }
};

// Authorization (RBAC): are you allowed?  usage: authorize('alumni','admin')
exports.authorize = (...roles) => (req, res, next) =>
  roles.includes(req.user.role) ? next()
    : res.status(403).json({ message: `Role '${req.user.role}' cannot access this route` });
