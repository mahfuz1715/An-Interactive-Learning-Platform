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
      required: true   // 👈 now every notification is tied to one student
    },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false } // optional, for marking read/unread
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
