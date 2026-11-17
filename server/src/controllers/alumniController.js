const AlumniProfile = require('../models/AlumniProfile');
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // prevents regex injection

// GET /api/alumni?q=&company=&year=&department=&page=&limit=
exports.getAlumni = async (req, res, next) => {
  try {
    const { q, company, year, department, page = 1, limit = 12 } = req.query;
    const filter = {};
    if (q) filter.$text = { $search: q };
    if (company) filter.currentCompany = new RegExp(`^${escapeRegex(company)}$`, 'i');
    if (department) filter.department = new RegExp(`^${escapeRegex(department)}$`, 'i');
    if (year) filter.graduationYear = Number(year);

    const skip = (Number(page) - 1) * Number(limit);
    const query = AlumniProfile.find(filter, q ? { score: { $meta: 'textScore' } } : {});
    const [alumni, total] = await Promise.all([
      query.populate('user', 'name')
        .sort(q ? { score: { $meta: 'textScore' } } : { graduationYear: -1 })
        .skip(skip).limit(Number(limit)).lean(),
      AlumniProfile.countDocuments(filter),
    ]);
    res.json({ alumni, total, pages: Math.max(1, Math.ceil(total / limit)), page: Number(page) });
  } catch (e) { next(e); }
};

// GET /api/alumni/filters
exports.getFilterOptions = async (req, res, next) => {
  try {
    const [companies, years, departments] = await Promise.all([
      AlumniProfile.distinct('currentCompany'), AlumniProfile.distinct('graduationYear'), AlumniProfile.distinct('department'),
    ]);
    res.json({ companies: companies.sort(), years: years.sort((a, b) => b - a), departments: departments.sort() });
  } catch (e) { next(e); }
};

// GET /api/alumni/me
exports.getMyProfile = async (req, res, next) => {
  try { res.json(await AlumniProfile.findOne({ user: req.user._id }).lean()); } catch (e) { next(e); }
};

// POST /api/alumni/profile  (create or update)
exports.upsertProfile = async (req, res, next) => {
  try {
    const { graduationYear, department, currentCompany, jobTitle, skills, linkedinUrl, bio } = req.body;
    const profile = await AlumniProfile.findOneAndUpdate(
      { user: req.user._id },
      { user: req.user._id, fullName: req.user.name, graduationYear, department, currentCompany, jobTitle, skills, linkedinUrl, bio },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );
    res.json(profile);
  } catch (e) { next(e); }
};
