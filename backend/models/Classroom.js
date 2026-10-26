const mongoose = require("mongoose");
const { nanoid } = require("nanoid"); 

const classroomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    subject: String,
    section: String,
    description: String,
    logo: { type: String, default: "https://via.placeholder.com/150" }, 
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    code: {
      type: String,
      default: () => nanoid(6).toUpperCase(), 
      unique: true,
    },

    materials: [
      {
        originalName: String,
        url: String,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Classroom", classroomSchema);
