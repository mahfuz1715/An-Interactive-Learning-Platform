const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
  {
    classroomId: { type: mongoose.Schema.Types.ObjectId, ref: "Classroom", required: true, index: true },
    title: { type: String, required: true },
    description: String,
    dueDate: Date,              // optional
    file: String,               // optional teacher attachment (e.g. /uploads/xxx.pdf)
  },
  { timestamps: true }
);

module.exports = mongoose.model("Assignment", assignmentSchema);
