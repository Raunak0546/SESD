const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  company: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  applyLink: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});
schema.index({ createdAt: -1 });
schema.index({ postedBy: 1 });
schema.index({ title: 'text', company: 'text' });

module.exports = mongoose.model('JobPosting', schema);
