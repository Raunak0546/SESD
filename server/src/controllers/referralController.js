const ReferralRequest = require('../models/ReferralRequest');
const User = require('../models/User');

// POST /api/referrals  (student)
exports.createReferral = async (req, res, next) => {
  try {
    const { alumniId, jobId, message } = req.body;
    if (!(await User.findOne({ _id: alumniId, role: 'alumni' }))) return res.status(404).json({ message: 'Alumni not found' });
    res.status(201).json(await ReferralRequest.create({ student: req.user._id, alumni: alumniId, job: jobId || undefined, message }));
  } catch (e) { next(e); }
};

// GET /api/referrals/my-requests  (student)
exports.getMyRequests = async (req, res, next) => {
  try {
    res.json(await ReferralRequest.find({ student: req.user._id })
      .populate('alumni', 'name').populate('job', 'title company').sort({ createdAt: -1 }).lean());
  } catch (e) { next(e); }
};

// GET /api/referrals/received  (alumni inbox)
exports.getReceived = async (req, res, next) => {
  try {
    res.json(await ReferralRequest.find({ alumni: req.user._id })
      .populate('student', 'name email').populate('job', 'title').sort({ createdAt: -1 }).lean());
  } catch (e) { next(e); }
};

// PATCH /api/referrals/:id/status  (alumni, owner only)
exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['Accepted', 'Rejected'].includes(status)) return res.status(400).json({ message: 'Invalid status' });
    const r = await ReferralRequest.findOneAndUpdate({ _id: req.params.id, alumni: req.user._id }, { status }, { new: true });
    if (!r) return res.status(404).json({ message: 'Request not found' });
    res.json(r);
  } catch (e) { next(e); }
};
