// backend/routes/admin.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const VIP = require('../models/VIP');
const { protect } = require('../middleware/auth');

// Register Admin (run once)
router.post('/register', async (req, res) => {
  const { fullname, email, password } = req.body;

  try {
    const existing = await Admin.findOne({ email });
    if (existing) return res.status(400).json({ message: "Admin already exists" });

    const admin = new Admin({ fullname, email, password });
    await admin.save();

    res.status(201).json({ message: "Admin created successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({
      token,
      admin: { name: admin.name, email: admin.email }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get all VIPs
router.get('/vips', protect, async (req, res) => {
  try {
    const vips = await VIP.find().sort({ name: 1 });
    res.json(vips);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Add VIP (only name required)
router.post('/vips', protect, async (req, res) => {
  const { name } = req.body;
  try {
    if (!name || name.trim().length < 3) {
      return res.status(400).json({ message: "Valid name is required" });
    }

    const existing = await VIP.findOne({ 
      name: { $regex: `^${name.trim()}$`, $options: 'i' } 
    });
    if (existing) {
      return res.status(400).json({ message: "This name is already in the VIP list" });
    }

    const vip = new VIP({ name: name.trim() });
    await vip.save();
    res.status(201).json({ message: "VIP added", vip });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete VIP
router.delete('/vips/:id', protect, async (req, res) => {
  try {
    const vip = await VIP.findById(req.params.id);
    if (!vip) return res.status(404).json({ message: "VIP not found" });

    await VIP.findByIdAndDelete(req.params.id);
    res.json({ message: "VIP removed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;