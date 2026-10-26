const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    classroomId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Classroom", 
      required: true 
    },
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true   
    },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false } 
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
