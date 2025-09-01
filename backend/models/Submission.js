const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Assignment", required: true, index: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    answerText: String,     // optional text answer
    file: String,           // optional student file (/uploads/xxx.pdf)
    grade: String,          // optional (e.g. 9/10 or A+)
    feedback: String,       // optional (teacher comment)
  },
  { timestamps: true }
);

// 1 student should have at most one submission per assignment (soft rule)
submissionSchema.index({ assignmentId: 1, studentId: 1 }, { unique: true });

module.exports = mongoose.model("Submission", submissionSchema);
