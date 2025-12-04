// // backend/routes/applicant.js
// const express = require('express');
// const router = express.Router();
// const Applicant = require('../models/Applicant');
// const VIP = require('../models/VIP');
// const { protect } = require('../middleware/auth');

// // 1. Public: Submit VIP Application
// router.post('/apply', async (req, res) => {
//   try {
//     const { firstName, lastName, email, phone, bio } = req.body;

//     // Validation
//     if (!firstName || !lastName || !email || !phone || !bio) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     if (firstName.trim().length < 2 || lastName.trim().length < 2) {
//       return res.status(400).json({ message: "First and last name must be at least 2 characters" });
//     }

//     if (bio.trim().length < 30) {
//       return res.status(400).json({ message: "Bio must be at least 30 characters" });
//     }

//     // Prevent duplicate applications
//     const existing = await Applicant.findOne({
//       $or: [{ email: email.toLowerCase() }, { phone: phone.trim() }]
//     });
//     if (existing) {
//       return res.status(400).json({ message: "You have already submitted an application" });
//     }

//     const applicant = new Applicant({
//       firstName: firstName.trim(),
//       lastName: lastName.trim(),
//       email: email.toLowerCase().trim(),
//       phone: phone.trim(),
//       bio: bio.trim()
//     });

//     await applicant.save();

//     res.status(201).json({
//       message: "VIP Application submitted successfully! We will review it soon.",
//       applicant
//     });
//   } catch (err) {
//     console.error("Application error:", err);
//     res.status(500).json({ message: "Server error. Please try again." });
//   }
// });

// // 2. Admin: Get all applicants
// router.get('/applications', protect, async (req, res) => {
//   try {
//     const applicants = await Applicant.find().sort({ appliedAt: -1 });
//     res.json(applicants);
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // 3. Admin: Approve → Add to VIP list as "First Last"
// router.post('/applications/:id/approve', protect, async (req, res) => {
//   try {
//     const applicant = await Applicant.findById(req.params.id);
//     if (!applicant) return res.status(404).json({ message: "Application not found" });

//     if (applicant.status !== 'pending') {
//       return res.status(400).json({ message: "Application already processed" });
//     }

//     const fullName = `${applicant.firstName} ${applicant.lastName}`;

//     // Check if already VIP
//     const existingVip = await VIP.findOne({
//       name: { $regex: `^${fullName}$`, $options: 'i' }
//     });
//     if (existingVip) {
//       return res.status(400).json({ message: `${fullName} is already a VIP` });
//     }

//     // Add to VIP list
//     const vip = new VIP({ name: fullName });
//     await vip.save();

//     // Update status
//     applicant.status = 'approved';
//     await applicant.save();

//     res.json({
//       message: "Approved! Added to VIP list",
//       vip: { name: fullName, _id: vip._id }
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // 4. Admin: Reject application
// router.post('/applications/:id/reject', protect, async (req, res) => {
//   try {
//     const applicant = await Applicant.findById(req.params.id);
//     if (!applicant) return res.status(404).json({ message: "Application not found" });

//     if (applicant.status !== 'pending') {
//       return res.status(400).json({ message: "Already processed" });
//     }

//     applicant.status = 'rejected';
//     await applicant.save();

//     res.json({ message: "Application rejected" });
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });
// module.exports = router;
// backend/routes/applicant.js
const express = require('express');
const router = express.Router();
const Applicant = require('../models/Applicant');
const VIP = require('../models/VIP');
const { protect } = require('../middleware/auth');
  const sendMailtrapMail = require("../utils/mailtrap")// ← ADD THIS LINE

// 1. Public: Submit VIP Application
router.post('/apply', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, bio } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !phone || !bio) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (firstName.trim().length < 2 || lastName.trim().length < 2) {
      return res.status(400).json({ message: "First and last name must be at least 2 characters" });
    }

    if (bio.trim().length < 30) {
      return res.status(400).json({ message: "Bio must be at least 30 characters" });
    }

    // Prevent duplicate applications
    const existing = await Applicant.findOne({
      $or: [{ email: email.toLowerCase().trim() }, { phone: phone.trim() }]
    });
    if (existing) {
      return res.status(400).json({ message: "You have already submitted an application" });
    }

    const applicant = new Applicant({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      bio: bio.trim()
    });

    await applicant.save();

    res.status(201).json({
      message: "VIP Application submitted successfully! We will review it soon.",
      applicant
    });
  } catch (err) {
    console.error("Application error:", err);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

// 2. Admin: Get all applicants
router.get('/applications', protect, async (req, res) => {
  try {
    const applicants = await Applicant.find().sort({ appliedAt: -1 });
    res.json(applicants);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// 3. Admin: Approve → Add to VIP list + Send Approval Email
router.post('/applications/:id/approve', protect, async (req, res) => {
  try {
    const applicant = await Applicant.findById(req.params.id);
    if (!applicant) return res.status(404).json({ message: "Application not found" });

    if (applicant.status !== 'pending') {
      return res.status(400).json({ message: "Application already processed" });
    }

    const fullName = `${applicant.firstName} ${applicant.lastName}`;

    // Check if already VIP
    const existingVip = await VIP.findOne({
      name: { $regex: `^${fullName}$`, $options: 'i' }
    });
    if (existingVip) {
      return res.status(400).json({ message: `${fullName} is already a VIP` });
    }

    // Add to VIP list
    const vip = new VIP({ name: fullName });
    await vip.save();

    // Update status
    applicant.status = 'approved';
    await applicant.save();

    // Send Approval Email
    await sendMailtrapMail(
      applicant.email,
      "Your VIP Application Has Been APPROVED! 🎉",
      `Dear ${applicant.firstName} ${applicant.lastName},

Congratulations! Your application for VIP access to Abuja Night of Glory 2025 has been APPROVED.

You are now officially on the VIP list.

Go to the site to get your VIP ticket and further instructions.

We look forward to welcoming you as our esteemed VIP guest at this grand event.

God bless you richly!

Night of Glory Team
Abuja 2025`
    );

    res.json({
      message: "Approved! Added to VIP list and approval email sent.",
      vip: { name: fullName, _id: vip._id }
    });
  } catch (err) {
    console.error("Approve error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 4. Admin: Reject application + Send Rejection Email
router.post('/applications/:id/reject', protect, async (req, res) => {
  try {
    const applicant = await Applicant.findById(req.params.id);
    if (!applicant) return res.status(404).json({ message: "Application not found" });

    if (applicant.status !== 'pending') {
      return res.status(400).json({ message: "Already processed" });
    }

    // Update status
    applicant.status = 'rejected';
    await applicant.save();

    // Send Rejection Email
    await sendMailtrapMail(
      applicant.email,
      "VIP Application Update",
      `Dear ${applicant.firstName} ${applicant.lastName},

Thank you for your interest in Abuja Night of Glory 2025.

After careful review, we regret to inform you that your VIP application was not approved at this time.

We appreciate your support and hope to see you at the event.

Blessings,

Night of Glory Team
Abuja 2025`
    );

    res.json({ message: "Application rejected and notification email sent." });
  } catch (err) {
    console.error("Reject error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;