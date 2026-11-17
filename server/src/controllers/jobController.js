const JobPosting = require('../models/JobPosting');

// POST /api/jobs
exports.createJob = async (req, res, next) => {
  try {
    const { title, company, description, applyLink } = req.body;
    res.status(201).json(await JobPosting.create({ title, company, description, applyLink, postedBy: req.user._id }));
  } catch (e) { next(e); }
};

// GET /api/jobs
exports.getJobs = async (req, res, next) => {
  try {
    res.json(await JobPosting.find({ isActive: true }).populate('postedBy', 'name').sort({ createdAt: -1 }).lean());
  } catch (e) { next(e); }
};
