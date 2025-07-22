// routes/attendanceRoutes.js

const express = require('express');
const {
  clockIn,
  clockOut,
  getMyAttendance,
  getAllAttendance,
} = require('../controllers/attendanceController');
const auth = require('../middlewares/authMiddleware');
// Optional: Uncomment this if you want admin-only access to some routes
// const { isAdmin } = require('../middlewares/roleMiddleware');

const router = express.Router();

// ✅ All routes below require authentication
router.use(auth);

// 👨‍💼 Clock in the current user
router.post('/clock-in', clockIn);

// 🕒 Clock out the current user
router.post('/clock-out', clockOut);

// 📅 Get current user's attendance records
router.get('/me', getMyAttendance);

// 🧾 Get all users' attendance records (admin-only — filter on frontend or add middleware)
// To restrict to admins only, uncomment this line below:
// router.get('/', isAdmin, getAllAttendance);
router.get('/', getAllAttendance);

module.exports = router;
