const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  fullName: { type: String, required: true }, // denormalised for text search
  graduationYear: { type: Number, required: true },
  department: { type: String, required: true, trim: true },
  currentCompany: { type: String, required: true, trim: true },
  jobTitle: { type: String, required: true, trim: true },
  skills: [{ type: String, trim: true }],
  linkedinUrl: { type: String, trim: true },
  bio: { type: String, maxlength: 500 },
}, { timestamps: true });

schema.index({ currentCompany: 1 });
schema.index({ department: 1, graduationYear: -1 });
schema.index({ skills: 1 });
schema.index(
  { fullName: 'text', currentCompany: 'text', jobTitle: 'text', skills: 'text' },
  { weights: { fullName: 5, currentCompany: 3, jobTitle: 2, skills: 1 } }
);

module.exports = mongoose.model('AlumniProfile', schema);
