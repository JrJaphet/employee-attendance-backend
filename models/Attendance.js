const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  clockIn: { type: Date, required: true },
  clockOut: { type: Date },
});

module.exports = mongoose.model('Attendance', attendanceSchema);