const mongoose = require("mongoose");

const attendanceGridSchema = new mongoose.Schema({
  classroomId: { type: mongoose.Schema.Types.ObjectId, ref: "Classroom", required: true },
  records: [
    {
      studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      studentName: String,
      studentEmail: String,
      dates: { type: Map, of: String } 
    }
  ]
});

module.exports = mongoose.model("AttendanceGrid", attendanceGridSchema);
