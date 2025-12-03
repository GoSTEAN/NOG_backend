// backend/models/Applicant.js
const mongoose = require('mongoose');

const applicantSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, required: true, trim: true },
  bio: { type: String, required: true, trim: true, minlength: 30 },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  appliedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Applicant', applicantSchema);