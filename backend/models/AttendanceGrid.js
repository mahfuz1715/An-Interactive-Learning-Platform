const mongoose = require("mongoose");

const attendanceGridSchema = new mongoose.Schema({
  classroomId: { type: mongoose.Schema.Types.ObjectId, ref: "Classroom", required: true },
  // Map<studentId, { studentName, email, records: { date: status } }>
  records: [
    {
      studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      studentName: String,
      studentEmail: String,
      dates: { type: Map, of: String } // { "2025-09-07": "present", "2025-09-08": "absent" }
    }
  ]
});

module.exports = mongoose.model("AttendanceGrid", attendanceGridSchema);
