const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');  // ← Fixed: Remove destructuring
const Attendance = require('../models/Attendance');
const User = require('../models/User');

// Clock in
router.post('/clock-in', auth, async (req, res) => {
  try {
    const attendance = new Attendance({
      userId: req.user.id,
      userName: req.user.name,
      clockIn: new Date(),
    });
    await attendance.save();
    res.status(201).json(attendance);
  } catch (error) {
    console.error('Clock-in error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Clock out
router.post('/clock-out', auth, async (req, res) => {
  try {
    const attendance = await Attendance.findOne({
      userId: req.user.id,
      clockOut: null,
    }).sort({ clockIn: -1 });
    if (!attendance) {
      return res.status(400).json({ message: 'No active clock-in found' });
    }
    attendance.clockOut = new Date();
    await attendance.save();
    res.status(200).json(attendance);
  } catch (error) {
    console.error('Clock-out error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's attendance
router.get('/my', auth, async (req, res) => {
  try {
    const attendance = await Attendance.find({ userId: req.user.id }).sort({ clockIn: -1 });
    res.status(200).json(attendance);
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all attendance (admin only)
router.get('/', auth, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }
  try {
    const attendance = await Attendance.find().sort({ clockIn: -1 });
    res.status(200).json(attendance);
  } catch (error) {
    console.error('Error fetching all attendance:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;