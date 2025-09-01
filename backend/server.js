const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/classroom", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ MongoDB Error:", err));

// Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: { type: String, enum: ["student", "teacher", "admin"], default: "student" }
});

const User = mongoose.model("User", userSchema);

// Routes
app.post("/signup", async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.send({ message: "User registered successfully!" });
});

app.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email, password: req.body.password });
  if (user) res.send({ message: "Login successful!", user });
  else res.status(401).send({ message: "Invalid credentials" });
});

// Example tiny auth stub (replace with your real JWT later)
app.use((req, _res, next) => {
  // If you store logged-in user in header for now:
  const u = req.header("x-user-id");
  if (u) {
    User.findById(u).then(user => { req.user = user; next(); }).catch(()=>next());
  } else next();
});
const { requireAdmin } = require("./middlewares/authz");

// Import Classroom model
const Classroom = require("./models/Classroom");

// ✅ Create a classroom (teacher only)
app.post("/classes/create", async (req, res) => {
  try {
    const { name, subject, section, description, teacherId, logo } = req.body;

    const classroom = new Classroom({
      name,
      subject,
      section,
      description,
      teacherId,
      logo,
    });

    await classroom.save();
    res.send({ message: "Classroom created!", classroom });
  } catch (err) {
    res.status(500).send({ message: "Error creating classroom", error: err });
  }
});

// ✅ Join classroom (student uses class code)
app.post("/classes/join", async (req, res) => {
  try {
    const { code, studentId } = req.body;
    const classroom = await Classroom.findOne({ code });

    if (!classroom) return res.status(404).send({ message: "Class not found" });

    // Prevent duplicates
    if (!classroom.students.includes(studentId)) {
      classroom.students.push(studentId);
      await classroom.save();
    }

    res.send({ message: "Joined classroom!", classroom });
  } catch (err) {
    res.status(500).send({ message: "Error joining classroom", error: err });
  }
});

// ✅ Fetch classes for a user
app.get("/classes/for-user/:userId", async (req, res) => {
  const { userId } = req.params;
  const classes = await Classroom.find({
    $or: [{ teacherId: userId }, { students: userId }],
  }).populate("teacherId", "name email");
  res.send(classes);
});

// ✅ Get details of a single classroom by ID
app.get("/classes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const classroom = await Classroom.findById(id)
      .populate("teacherId", "name email")
      .populate("students", "name email");

    if (!classroom) return res.status(404).send({ message: "Class not found" });

    res.send(classroom);
  } catch (err) {
    res.status(500).send({ message: "Error fetching class details", error: err });
  }
});

const Post = require("./models/Post");



// ✅ Get all posts for a class
app.get("/classes/:id/posts", async (req, res) => {
  try {
    const { id } = req.params;
    const posts = await Post.find({ classroomId: id })
      .populate("author", "name email role")
      .sort({ createdAt: -1 });
    res.send(posts);
  } catch (err) {
    res.status(500).send({ message: "Error fetching posts", error: err });
  }
});

// ✅ Delete a post
app.delete("/posts/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    await Post.findByIdAndDelete(postId);
    res.send({ message: "Post deleted!" });
  } catch (err) {
    res.status(500).send({ message: "Error deleting post", error: err });
  }
});

// ✅ Edit a post
app.put("/posts/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const updated = await Post.findByIdAndUpdate(
      postId,
      { content },
      { new: true }
    );
    res.send({ message: "Post updated!", post: updated });
  } catch (err) {
    res.status(500).send({ message: "Error updating post", error: err });
  }
});

const Comment = require("./models/Comment");

// ✅ Add a comment to a post
app.post("/posts/:postId/comments", async (req, res) => {
  try {
    const { postId } = req.params;
    const { authorId, content } = req.body;

    const comment = new Comment({
      postId,
      author: authorId,
      content,
    });

    await comment.save();
    const populated = await comment.populate("author", "name email role");
    res.send({ message: "Comment added!", comment: populated });
  } catch (err) {
    res.status(500).send({ message: "Error adding comment", error: err });
  }
});

// ✅ Get all comments for a post
app.get("/posts/:postId/comments", async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await Comment.find({ postId })
      .populate("author", "name email role")
      .sort({ createdAt: 1 });
    res.send(comments);
  } catch (err) {
    res.status(500).send({ message: "Error fetching comments", error: err });
  }
});

// ✅ Update a comment's content
app.put("/comments/:commentId", async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;

    const updated = await Comment.findByIdAndUpdate(
      commentId,
      { content },
      { new: true }
    ).populate("author", "name email role");

    if (!updated) return res.status(404).send({ message: "Comment not found" });
    res.send({ message: "Comment updated!", comment: updated });
  } catch (err) {
    res.status(500).send({ message: "Error updating comment", error: err });
  }
});

// ✅ Delete a comment
app.delete("/comments/:commentId", async (req, res) => {
  try {
    const { commentId } = req.params;
    const deleted = await Comment.findByIdAndDelete(commentId);
    if (!deleted) return res.status(404).send({ message: "Comment not found" });
    res.send({ message: "Comment deleted!" });
  } catch (err) {
    res.status(500).send({ message: "Error deleting comment", error: err });
  }
});

const path = require("path");
const multer = require("multer");
const Assignment = require("./models/Assignment");
const Submission = require("./models/Submission");

// File storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // files will be saved inside backend/uploads
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // unique filename
  }
});
const upload = multer({ storage });

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));





// GET /classes/:id/assignments
app.get("/classes/:id/assignments", async (req, res) => {
  try {
    const assignments = await Assignment.find({ classroomId: req.params.id })
      .sort({ createdAt: -1 });
    res.send(assignments);
  } catch (err) {
    res.status(500).send({ message: "Error fetching assignments" });
  }
});

// POST /assignments/:id/submit
// body (multipart if file): { studentId, answerText? } + file?
app.post("/assignments/:id/submit", upload.single("file"), async (req, res) => {
  try {
    const { studentId, answerText } = req.body;
    const assignmentId = req.params.id;

    // upsert: if submission already exists for this student, update it
    const updated = await Submission.findOneAndUpdate(
      { assignmentId, studentId },
      {
        assignmentId,
        studentId,
        answerText,
        file: req.file ? `/uploads/${req.file.filename}` : undefined,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.send({ message: "Submission saved", submission: updated });
  } catch (err) {
    // likely unique index error when file-only update hits — but we use upsert above
    console.error(err);
    res.status(500).send({ message: "Error submitting assignment" });
  }
});

// GET /assignments/:id/submissions
app.get("/assignments/:id/submissions", async (req, res) => {
  try {
    const submissions = await Submission.find({ assignmentId:
      req.params.id })
      .populate("studentId", "name email")
      .sort({ createdAt: -1 });
      res.send(submissions);
      } catch (err) {
        res.status(500).send({ message: "Error fetching submissions" });
      } 
});

// ✅ Get a single student's submission for an assignment
app.get("/assignments/:id/submission/:studentId", async (req, res) => {
  try {
    const { id, studentId } = req.params;
    const submission = await Submission.findOne({
      assignmentId: id,
      studentId,
    }).populate("studentId", "name email");

    if (!submission) {
      return res.send({ status: "pending" });
    }

    res.send({
      status: submission.grade
        ? `graded (${submission.grade})`
        : "submitted (waiting for grade)",
      submission,
    });
  } catch (err) {
    res.status(500).send({ message: "Error fetching submission", error: err });
  }
});



const AttendanceGrid = require("./models/AttendanceGrid");

// ✅ Get attendance grid (teacher only)
app.get("/classes/:id/attendance-grid", async (req, res) => {
  try {
    let grid = await AttendanceGrid.findOne({ classroomId: req.params.id });
    if (!grid) {
      // init with student list
      const classroom = await Classroom.findById(req.params.id).populate("students", "name email");
      grid = new AttendanceGrid({
        classroomId: req.params.id,
        records: classroom.students.map(s => ({
          studentId: s._id,
          studentName: s.name,
          studentEmail: s.email,
          dates: {}
        }))
      });
      await grid.save();
    }
    res.send(grid);
  } catch (err) {
    res.status(500).send({ message: "Error fetching grid", error: err });
  }
});

// ✅ Update attendance for a specific date
app.put("/classes/:id/attendance-grid", async (req, res) => {
  try {
    const { date, updates } = req.body; 
    // updates = [ { studentId, status } ]
    let grid = await AttendanceGrid.findOne({ classroomId: req.params.id });
    if (!grid) return res.status(404).send({ message: "Grid not found" });

    updates.forEach(u => {
      const rec = grid.records.find(r => r.studentId.toString() === u.studentId);
      if (rec) {
        rec.dates.set(date, u.status); // status = "present"/"absent"/"✔"/"✘"
      }
    });

    await grid.save();
    res.send({ message: "Attendance updated", grid });
  } catch (err) {
    res.status(500).send({ message: "Error updating attendance", error: err });
  }
});

const Notification = require("./models/Notification");

// ✅ Teacher creates post (announcement)
app.post("/classes/:id/posts", async (req, res) => {
  try {
    const { id } = req.params;
    const { authorId, content } = req.body;

    const post = new Post({ classroomId: id, author: authorId, content });
    await post.save();

    // Create notification for students (prevent duplicates)
    const classroom = await Classroom.findById(id);
    for (const studentId of classroom.students) {
      const exists = await Notification.findOne({
        classroomId: id,
        userId: studentId,
        message: `New announcement: ${content}`
      });
      if (!exists) {
        const notif = new Notification({
          classroomId: id,
          userId: studentId,
          message: `New announcement: ${content}`,
        });
        await notif.save();
      }
    }

    res.send({ message: "Post created!", post });
  } catch (err) {
    res.status(500).send({ message: "Error creating post", error: err });
  }
});

// ✅ Teacher uploads materials
app.post("/classes/:id/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).send({ message: "No file uploaded" });

    const classroom = await Classroom.findById(req.params.id);
    if (!classroom) return res.status(404).send({ message: "Class not found" });

    // Duplicate check for files
    const alreadyExists = classroom.materials.some(
      (m) => m.originalName === req.file.originalname
    );
    if (alreadyExists) {
      return res.status(400).send({ message: "File already exists in the classroom" });
    }

    // Save file to classroom
    classroom.materials.push({
      originalName: req.file.originalname,
      url: `/uploads/${req.file.filename}`,
      uploadedAt: new Date(),
    });
    await classroom.save();

    // Create notifications for students (prevent duplicates)
    for (const studentId of classroom.students) {
      const exists = await Notification.findOne({
        classroomId: req.params.id,
        userId: studentId,
        message: `New material uploaded: ${req.file.originalname}`
      });
      if (!exists) {
        const notif = new Notification({
          classroomId: req.params.id,
          userId: studentId,
          message: `New material uploaded: ${req.file.originalname}`,
        });
        await notif.save();
      }
    }

    res.send({ message: "File uploaded successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error uploading file" });
  }
});

// ✅ Teacher creates assignment
app.post("/classes/:id/assignments", upload.single("file"), async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;
    const classroomId = req.params.id;

    const assignment = new Assignment({
      classroomId,
      title,
      description,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      file: req.file ? `/uploads/${req.file.filename}` : undefined,
    });

    await assignment.save();

    const classroom = await Classroom.findById(classroomId);
    for (const studentId of classroom.students) {
      const exists = await Notification.findOne({
        classroomId,
        userId: studentId,
        message: `New assignment created: ${title}`
      });
      if (!exists) {
        const notif = new Notification({
          classroomId,
          userId: studentId,
          message: `New assignment created: ${title}`,
        });
        await notif.save();
      }
    }

    res.send({ message: "Assignment created", assignment });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error creating assignment" });
  }
});

// ✅ Teacher grades submission
app.put("/submissions/:id/grade", async (req, res) => {
  try {
    const { grade, feedback } = req.body;

    const sub = await Submission.findByIdAndUpdate(
      req.params.id,
      { grade, feedback },
      { new: true }
    ).populate("studentId", "name email");

    if (!sub) return res.status(404).send({ message: "Submission not found" });

    // Find assignment for classroom reference
    const assignment = await Assignment.findById(sub.assignmentId);
    if (!assignment) return res.status(404).send({ message: "Assignment not found" });

    // Prevent duplicate notification
    const exists = await Notification.findOne({
      classroomId: assignment.classroomId,
      userId: sub.studentId._id,
      message: `Your submission has been graded: ${grade}`
    });
    if (!exists) {
      const notif = new Notification({
        classroomId: assignment.classroomId,
        userId: sub.studentId._id,
        message: `Your submission has been graded: ${grade}`,
      });
      await notif.save();
    }

    res.send({ message: "Graded", submission: sub });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error grading submission" });
  }
});

// Student sees only their own notifications
app.get("/classes/:id/notifications/:userId", async (req, res) => {
  try {
    const { id, userId } = req.params;
    const notifs = await Notification.find({ 
      classroomId: id, 
      userId 
    }).sort({ createdAt: -1 });
    res.send(notifs);
  } catch (err) {
    res.status(500).send({ message: "Error fetching notifications", error: err });
  }
});

// ===== Admin Routes =====

// Get all users
app.get("/admin/users", async (req, res) => {
  try {
    const users = await User.find({}, "name email role"); // return name, email, role only
    res.send(users);
  } catch (err) {
    res.status(500).send({ message: "Error fetching users" });
  }
});

// Update user role
app.put("/admin/users/:id/role", async (req, res) => {
  try {
    const { role } = req.body;
    const updated = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    res.send({ message: "Role updated", user: updated });
  } catch (err) {
    res.status(500).send({ message: "Error updating role" });
  }
});

// Delete user
app.delete("/admin/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.send({ message: "User deleted" });
  } catch (err) {
    res.status(500).send({ message: "Error deleting user" });
  }
});

// Get all classes
app.get("/admin/classes", async (req, res) => {
  try {
    const classes = await Classroom.find()
      .populate("teacherId", "name email")
      .populate("students", "name email");
    res.send(classes);
  } catch (err) {
    res.status(500).send({ message: "Error fetching classes" });
  }
});

// ===== Reports =====
app.get("/admin/stats", async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const classCount = await Classroom.countDocuments();
    const assignmentCount = await Assignment.countDocuments();
    const submissionCount = await Submission.countDocuments();

    res.send({ userCount, classCount, assignmentCount, submissionCount });
  } catch (err) {
    res.status(500).send({ message: "Error fetching stats" });
  }
});

// Start server
app.listen(5000, () => console.log("🚀 Server running on http://localhost:5000"));
