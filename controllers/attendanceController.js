// controllers/attendanceController.js
const Attendance = require('../models/Attendance');

// Clock In
exports.clockIn = async (req, res) => {
  try {
    const date = new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD'
    const userId = req.user._id;

    // Check if already clocked in today
    const existing = await Attendance.findOne({ user: userId, date });
    if (existing && existing.clockIn) {
      return res.status(400).json({ message: 'Already clocked in today' });
    }

    const record = await Attendance.create({
      user: userId,
      date,
      clockIn: new Date(),
    });

    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ message: 'Clock in failed', error: err.message });
  }
};

// Clock Out
exports.clockOut = async (req, res) => {
  try {
    const date = new Date().toISOString().split('T')[0];
    const userId = req.user._id;

    const record = await Attendance.findOne({ user: userId, date });
    if (!record) {
      return res.status(404).json({ message: 'No clock-in record found for today' });
    }
    if (record.clockOut) {
      return res.status(400).json({ message: 'Already clocked out today' });
    }

    record.clockOut = new Date();
    await record.save();

    res.status(200).json(record);
  } catch (err) {
    res.status(500).json({ message: 'Clock out failed', error: err.message });
  }
};

// Get logged-in user's attendance records
exports.getMyAttendance = async (req, res) => {
  try {
    const userId = req.user._id;
    const records = await Attendance.find({ user: userId }).sort({ date: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all attendance records (admin or full access)
exports.getAllAttendance = async (req, res) => {
  try {
    const records = await Attendance.find()
      .populate('user', 'name email') // populate user name and email
      .sort({ date: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
