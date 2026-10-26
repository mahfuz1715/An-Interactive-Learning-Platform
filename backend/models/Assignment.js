const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
  {
    classroomId: { type: mongoose.Schema.Types.ObjectId, ref: "Classroom", required: true, index: true },
    title: { type: String, required: true },
    description: String,
    dueDate: Date,              
    file: String,               
  },
  { timestamps: true }
);

module.exports = mongoose.model("Assignment", assignmentSchema);
