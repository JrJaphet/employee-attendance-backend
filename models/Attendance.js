const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  clockIn: {
    type: Date,
  },
  clockOut: {
    type: Date,
  },
  date: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model('Attendance', attendanceSchema);
