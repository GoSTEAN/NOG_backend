// backend/models/Admin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: [true, "Admin full name is required"],
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: 6
  }
}, { timestamps: true });

// Auto-hash password
adminSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

adminSchema.methods.comparePassword = async function (pass) {
  return bcrypt.compare(pass, this.password);
};

module.exports = mongoose.model('Admin', adminSchema);