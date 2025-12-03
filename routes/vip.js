// backend/routes/vip.js
const express = require('express');
const router = express.Router();
const VIP = require('../models/VIP');

// Public VIP Search – ONLY by name (case-insensitive, partial match)
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        found: false,
        message: "Please enter at least 2 characters to search"
      });
    }

    const vip = await VIP.findOne({
      name: { $regex: query.trim(), $options: 'i' } // case-insensitive partial match
    });

    if (!vip) {
      return res.status(404).json({
        found: false,
        message: "Oops! You are not on the VIP list for Abuja Night of Glory 2025."
      });
    }

    res.json({
      found: true,
      vip: {
        _id: vip._id,
        name: vip.name,
        addedAt: vip.createdAt
      }
    });

  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

module.exports = router;