const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Attendance = require('../models/Attendance');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Get all users (Admin only)
router.get('/users', auth, admin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all attendance records (Admin only)
router.get('/attendances', auth, admin, async (req, res) => {
  try {
    const records = await Attendance.find().populate('user', 'name email');
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a user (Admin only)
router.delete('/users/:id', auth, admin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});
// PUT /api/admin/users/:id/role
router.put('/users/:id/role', auth, admin, async (req, res) => {
  const { role } = req.body;
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.role = role;
    await user.save();
    res.json({ message: 'User role updated successfully', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
