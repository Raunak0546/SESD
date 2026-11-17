const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  alumni: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'JobPosting' },
  message: { type: String, required: true, maxlength: 1000 },
  status: { type: String, enum: ['Pending', 'Accepted', 'Rejected'], default: 'Pending' },
}, { timestamps: true });

schema.index({ student: 1, createdAt: -1 });
schema.index({ alumni: 1, status: 1 });
// no duplicate pending request for the same student -> alumni -> job
schema.index({ student: 1, alumni: 1, job: 1 }, { unique: true, partialFilterExpression: { status: 'Pending' } });

module.exports = mongoose.model('ReferralRequest', schema);
