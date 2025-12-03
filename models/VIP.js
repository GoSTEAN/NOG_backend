// backend/models/VIP.js
const mongoose = require('mongoose');

const vipSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,    // prevent duplicates
    trim: true,
  },
}, { timestamps: true });

// Case-insensitive search on name
vipSchema.index({ name: 'text' });

module.exports = mongoose.model('VIP', vipSchema);