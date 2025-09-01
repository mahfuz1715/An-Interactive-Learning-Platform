import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Comments from "./Comments";

function ClassPage() {
  const { id } = useParams(); // class ID
  const [classData, setClassData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [file, setFile] = useState(null); // file upload
  const [assignments, setAssignments] = useState([]); // assignments
  const [aTitle, setATitle] = useState("");
  const [aDesc, setADesc] = useState("");
  const [aDue, setADue] = useState("");
  const [aFile, setAFile] = useState(null);
  const [answerText, setAnswerText] = useState("");
  const [answerFile, setAnswerFile] = useState(null);

  // NEW STATES (kept from your code)
  const [submissions, setSubmissions] = useState({});
  const [loadingSubs, setLoadingSubs] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [submissionStatus, setSubmissionStatus] = useState({});

  // 🔹 UI-ONLY: navbar tabs
  const [activeTab, setActiveTab] = useState("null"); // "users" | "assignments" | "notifications"

  const user = JSON.parse(localStorage.getItem("user"));

  const tabs = user.role === "teacher"
    ? ["users", "assignments", "attendance"]   // teacher: Attendance tab
    : ["users", "assignments", "notifications"]; // student: Notifications tab

  // === Your original effects & handlers (unchanged functionality) ===
  useEffect(() => {
    axios
      .get(`http://localhost:5000/classes/${id}`)
      .then((res) => setClassData(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/classes/${id}/posts`)
      .then((res) => setPosts(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/classes/${id}/assignments`)
      .then((res) => setAssignments(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  useEffect(() => {
    if (user.role === "student") {
      axios
        .get(`http://localhost:5000/classes/${id}/notifications/${user._id}`)
        .then((res) => setNotifications(res.data))
        .catch((err) => console.error(err));
    }
  }, [id, user]);

  const handlePost = async () => {
    if (!newPost.trim()) return;
    try {
      const res = await axios.post(`http://localhost:5000/classes/${id}/posts`, {
        authorId: user._id,
        content: newPost,
      });
      setPosts([res.data.post, ...posts]);
      setNewPost("");
    } catch (err) {
      alert("Error creating post");
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await axios.delete(`http://localhost:5000/posts/${postId}`);
      setPosts(posts.filter((p) => p._id !== postId));
    } catch (err) {
      alert("Error deleting post");
    }
  };

  const handleSaveEdit = async (postId, content) => {
    try {
      const res = await axios.put(`http://localhost:5000/posts/${postId}`, { content });
      setPosts(posts.map((p) => (p._id === postId ? res.data.post : p)));
    } catch (err) {
      alert("Error updating post");
    }
  };

  const handleFileUpload = async () => {
    if (!file) return alert("Please select a file");
    const formData = new FormData();
    formData.append("file", file);
    try {
      await axios.post(`http://localhost:5000/classes/${id}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("File uploaded successfully!");
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.message || "Error uploading file");
    }
  };

  const handleCreateAssignment = async () => {
    if (!aTitle.trim()) return alert("Enter title");
    const fd = new FormData();
    fd.append("title", aTitle);
    if (aDesc) fd.append("description", aDesc);
    if (aDue) fd.append("dueDate", aDue);
    if (aFile) fd.append("file", aFile);

    try {
      await axios.post(`http://localhost:5000/classes/${id}/assignments`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Assignment created");
      const res = await axios.get(`http://localhost:5000/classes/${id}/assignments`);
      setAssignments(res.data);
      setATitle("");
      setADesc("");
      setADue("");
      setAFile(null);
    } catch (err) {
      alert("Error creating assignment");
    }
  };

  const handleSubmitWork = async (assignmentId) => {
    if (!answerText && !answerFile) return alert("Add text or a file");
    const fd = new FormData();
    fd.append("studentId", user._id);
    if (answerText) fd.append("answerText", answerText);
    if (answerFile) fd.append("file", answerFile);

    try {
      await axios.post(`http://localhost:5000/assignments/${assignmentId}/submit`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Submitted!");
      setAnswerText("");
      setAnswerFile(null);
    } catch (err) {
      alert("Error submitting assignment");
    }
  };

  const fetchSubmissions = async (assignmentId) => {
    setLoadingSubs(assignmentId);
    try {
      const res = await axios.get(
        `http://localhost:5000/assignments/${assignmentId}/submissions`
      );
      setSubmissions((prev) => ({ ...prev, [assignmentId]: res.data }));
    } catch (err) {
      console.error(err);
    }
    setLoadingSubs(null);
  };

  const handleGrade = async (submissionId, grade, feedback, assignmentId) => {
    try {
      await axios.put(`http://localhost:5000/submissions/${submissionId}/grade`, {
        grade,
        feedback,
      });
      alert("Graded!");
      fetchSubmissions(assignmentId);
    } catch (err) {
      alert("Error grading submission");
    }
  };

  useEffect(() => {
    if (user.role === "student") {
      assignments.forEach((a) => {
        axios
          .get(`http://localhost:5000/assignments/${a._id}/submission/${user._id}`)
          .then((res) => {
            setSubmissionStatus((prev) => ({ ...prev, [a._id]: res.data.status }));
          })
          .catch((err) => console.error(err));
      });
    }
  }, [assignments, user]);

  if (!classData) {
    return (
      <div style={styles.pageShell}>
        <div style={{ ...styles.centerFlex, minHeight: "60vh" }}>
          <div style={styles.spinner} />
        </div>
      </div>
    );
  }

  return (
    <div style={styles.pageShell}>
      {/* Decorative background */}
      <div style={styles.bgPattern} />

      <div style={styles.container}>
        {/* Top bar / title card */}
        <div style={styles.headerCard}>
          <div>
            <h1 style={styles.title}>{classData.name}</h1>
            <p style={styles.meta}><b>Subject:</b> {classData.subject} &nbsp;•&nbsp; <b>Section:</b> {classData.section}</p>
            <p style={styles.meta}><b>Description:</b> {classData.description || "—"}</p>
            <p style={styles.meta}><b>Class Code:</b> {classData.code}</p>
          </div>
          {user.role === "admin" && (
            <Link to="/admin" style={{ textDecoration: "none" }}>
              <button style={styles.pillBtn}>Admin Panel</button>
            </Link>
          )}
        </div>

        {/* Sticky tab nav */}
        <div style={styles.tabBarWrapper}>
          <div style={styles.tabBar}>
            {tabs.map((tab) => {
              // If Attendance then directly 
              if (tab === "attendance") {
                // শুধু লিঙ্ক, কোনো active স্টাইল নয়
                return (
                  <Link
                    key="attendance"
                    to={`/class/${id}/attendance`}
                    style={{ textDecoration: "none" }}
                  >
                    <button style={styles.tabBtn}>Attendance</button>
                  </Link>
                );
              }

              // Others tab are same as it is
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{ ...styles.tabBtn, ...(activeTab === tab ? styles.tabBtnActive : {}) }}
                >
                  {tab === "users" && "Users"}
                  {tab === "assignments" && "Assignments"}
                  {tab === "notifications" && "Notifications"}
                </button>
              );
            })}
          </div>
        </div>

        {/* TAB PANELS */}
        {activeTab === "users" && (
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Users</h2>
            <div style={styles.grid12}>
              {/* Teacher */}
              <div style={{ ...styles.card, background: "linear-gradient(180deg,#e0f2fe, #f8fbff)" }}>
                <h3 style={styles.cardTitle}>👨‍🏫 Teacher</h3>
                <p style={{ margin: 0, fontWeight: 700 }}>{classData.teacherId?.name}</p>
                <p style={{ marginTop: 6, color: "#4b5563" }}>{classData.teacherId?.email}</p>
              </div>

              {/* Students (name only as you requested) */}
              <div style={styles.card}>
                <h3 style={styles.cardTitle}>👩‍🎓 Students</h3>
                {classData.students.length === 0 ? (
                  <p style={styles.muted}>No students enrolled yet.</p>
                ) : (
                  <ul style={styles.listPlain}>
                    {classData.students.map((s) => (
                      <li key={s._id} style={styles.listRow}>
                        {s.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </section>
        )}

        {activeTab === "assignments" && (
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Assignments</h2>

            {user.role === "teacher" && (
              <div style={styles.card}>
                <h3 style={styles.cardTitle}>Create Assignment</h3>
                <div style={styles.formRow}>
                  <input
                    placeholder="Title"
                    value={aTitle}
                    onChange={(e) => setATitle(e.target.value)}
                    style={{ ...styles.input, width: "95%" }}
                  />
                </div>
                <div style={styles.formRow}>
                  <textarea
                    placeholder="Description (optional)"
                    value={aDesc}
                    onChange={(e) => setADesc(e.target.value)}
                    style={{ ...styles.input, minHeight: 90, width: "95%" }}
                  />
                </div>
                <div style={styles.formRow}>
                  <label style={styles.label}>Due Date (optional)</label>
                  <input
                    type="date"
                    value={aDue}
                    onChange={(e) => setADue(e.target.value)}
                    style={{ ...styles.input, width: "95%" }}
                  />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "1px", marginTop: 8 }}>
                  <input type="file" onChange={(e) => setAFile(e.target.files[0])} />
                  <button onClick={handleCreateAssignment} style={styles.primaryBtnSmall}>
                    Create
                  </button>
                </div>
              </div>
            )}

            {assignments.length === 0 ? (
              <p style={styles.muted}>No assignments yet.</p>
            ) : (
              assignments.map((a) => (
                <div key={a._id} style={styles.card}>
                  <h3 style={{ ...styles.cardTitle, marginBottom: 6 }}>{a.title}</h3>
                  {a.description && <p style={{ marginTop: 0 }}>{a.description}</p>}
                  {a.dueDate && (
                    <p style={styles.muted}><b>Due:</b> {new Date(a.dueDate).toLocaleDateString()}</p>
                  )}
                  {a.file && (
                    <p style={{ marginTop: 8 }}>
                      Attachment:{" "}
                      <a href={`http://localhost:5000${a.file}`} target="_blank" rel="noreferrer">
                        Download
                      </a>
                    </p>
                  )}

                  {/* Student submission */}
                  {user.role === "student" && (
                    <div style={{ marginTop: 12 }}>
                      <textarea
                        placeholder="Answer text (optional)"
                        value={answerText}
                        onChange={(e) => setAnswerText(e.target.value)}
                        style={{ ...styles.input, minHeight: 80 }}
                      />
                      <div style={styles.formRow}>
                        <input type="file" onChange={(e) => setAnswerFile(e.target.files[0])} />
                        <button onClick={() => handleSubmitWork(a._id)} style={styles.primaryBtnSmall}>
                          Submit
                        </button>
                      </div>

                      {/* Student status */}
                      <div style={{ marginTop: 6 }}>
                        {submissions[a._id]?.find((s) => s.studentId._id === user._id) ? (
                          (() => {
                            const sub = submissions[a._id].find((s) => s.studentId._id === user._id);
                            if (sub.grade) return <span>✅ Graded ({sub.grade})</span>;
                            return <span>✔ Submitted (waiting for grade)</span>;
                          })()
                        ) : (
                          user.role === "student" && (
                            <p style={styles.muted}>
                              {submissionStatus[a._id] === "pending" && "⏳ Pending (not submitted)"}
                              {submissionStatus[a._id]?.startsWith("submitted") && "✅ Submitted (waiting for grade)"}
                              {submissionStatus[a._id]?.startsWith("graded") && `🏆 ${submissionStatus[a._id]}`}
                            </p>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {/* Teacher submissions viewer */}
                  {user.role === "teacher" && (
                    <div style={{ marginTop: 12 }}>
                      <button onClick={() => fetchSubmissions(a._id)} style={styles.secondaryBtn}>
                        {loadingSubs === a._id ? "Loading..." : "View Submissions"}
                      </button>
                      {submissions[a._id] && submissions[a._id].length > 0 && (
                        <div style={{ marginTop: 10 }}>
                          {submissions[a._id].map((s) => (
                            <div key={s._id} style={styles.submissionRow}>
                              <p style={{ margin: 0 }}>
                                <b>{s.studentId.name}</b> ({s.studentId.email})
                              </p>
                              {s.answerText && <p style={{ margin: "6px 0" }}>Answer: {s.answerText}</p>}
                              {s.file && (
                                <p style={{ margin: "6px 0" }}>
                                  File:{" "}
                                  <a href={`http://localhost:5000${s.file}`} target="_blank" rel="noreferrer">
                                    Download
                                  </a>
                                </p>
                              )}
                              <p style={{ margin: "6px 0" }}>
                                Status: {s.grade ? `✅ Graded (${s.grade})` : "⏳ Submitted"}
                              </p>

                              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                <input
                                  placeholder="Grade"
                                  defaultValue={s.grade || ""}
                                  id={`grade-${s._id}`}
                                  style={{ ...styles.input, maxWidth: 120 }}
                                />
                                <input
                                  placeholder="Feedback"
                                  defaultValue={s.feedback || ""}
                                  id={`fb-${s._id}`}
                                  style={{ ...styles.input, flex: 1, minWidth: 180 }}
                                />
                                <button
                                  onClick={() =>
                                    handleGrade(
                                      s._id,
                                      document.getElementById(`grade-${s._id}`).value,
                                      document.getElementById(`fb-${s._id}`).value,
                                      a._id
                                    )
                                  }
                                  style={styles.primaryBtnSmall}
                                >
                                  Save Grade
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </section>
        )}

        {activeTab === "notifications" && (
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Notifications</h2>
            {user.role !== "student" ? (
              <p style={styles.muted}>Notifications are visible to students in this class.</p>
            ) : notifications.length === 0 ? (
              <p style={styles.muted}>No notifications yet.</p>
            ) : (
              <div style={styles.card}>
                <ul style={styles.listPlain}>
                  {notifications.map((n) => (
                    <li key={n._id} style={styles.listRow}>
                      <b>{new Date(n.createdAt).toLocaleString()}</b> — {n.message}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}

        {/* Classroom details (always shown after tab content) */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Class Materials</h2>
          {user.role === "teacher" && (
            <div style={{ ...styles.card, marginBottom: 14 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                <input type="file" onChange={(e) => setFile(e.target.files[0])} />
                <button onClick={handleFileUpload} style={styles.primaryBtnSmall}>Upload</button>
              </div>
            </div>
          )}

          <div style={styles.card}>
            {classData.materials?.length > 0 ? (
              <ul style={styles.listPlain}>
                {classData.materials.map((m, idx) => (
                  <li key={idx} style={styles.listRow}>
                    <a href={`http://localhost:5000${m.url}`} target="_blank" rel="noreferrer">
                      {m.originalName}
                    </a>
                    <span style={styles.muted}> &nbsp;• uploaded {new Date(m.uploadedAt).toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p style={styles.muted}>No materials uploaded yet.</p>
            )}
          </div>
        </section>

        {/* Announcements & Posts */}
        <section style={styles.section}>
          <div style={styles.sectionHeaderRow}>
            <h2 style={styles.sectionTitle}>Announcements & Posts</h2>

          </div>

          <div style={styles.card}>
            <textarea
              placeholder="Write an announcement..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              style={{ ...styles.input, minHeight: 90, width: "95%" }}
            />
            <button onClick={handlePost} style={{ ...styles.primaryBtn, marginTop: 10 }}>
              Post
            </button>
          </div>

          {posts.length === 0 ? (
            <p style={styles.muted}>No announcements yet.</p>
          ) : (
            posts.map((p) => (
              <div key={p._id} style={styles.postCard}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                  <p style={{ margin: 0 }}>
                    <b>{p.author.name}</b>{" "}
                    <span style={{ color: "#6b7280", fontSize: 12 }}>
                      ({p.author.role === "teacher" ? "👨‍🏫 Teacher" : "👩‍🎓 Student"})
                    </span>
                  </p>
                  <span style={{ color: "#6b7280", fontSize: 12 }}>
                    {new Date(p.createdAt).toLocaleString()}
                  </span>
                </div>

                {p.isEditing ? (
                  <>
                    <textarea
                      value={p.editContent}
                      onChange={(e) => {
                        const updated = posts.map((post) =>
                          post._id === p._id ? { ...post, editContent: e.target.value } : post
                        );
                        setPosts(updated);
                      }}
                      style={{ ...styles.input, minHeight: 80, marginTop: 8 }}
                    />
                    <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                      <button onClick={() => handleSaveEdit(p._id, p.editContent)} style={styles.primaryBtnSmall}>
                        Save
                      </button>
                      <button
                        onClick={() => {
                          const updated = posts.map((post) =>
                            post._id === p._id ? { ...post, isEditing: false } : post
                          );
                          setPosts(updated);
                        }}
                        style={styles.secondaryBtn}
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <p style={{ marginTop: 8 }}>{p.content}</p>
                )}

                {(user.role === "teacher" || user._id === p.author._id) && (
                  <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                    <button
                      onClick={() => {
                        const updated = posts.map((post) =>
                          post._id === p._id
                            ? { ...post, isEditing: true, editContent: p.content }
                            : post
                        );
                        setPosts(updated);
                      }}
                      style={styles.secondaryBtn}
                    >
                      ✏️ Edit
                    </button>
                    <button onClick={() => handleDelete(p._id)} style={styles.dangerBtn}>
                      🗑️ Delete
                    </button>
                  </div>
                )}

                {/* Comments */}
                <div style={{ marginTop: 12 }}>
                  <Comments postId={p._id} user={user} />
                </div>
              </div>
            ))
          )}
        </section>
      </div>
    </div>
  );
}

/* -------------------- Styles -------------------- */
const styles = {
  pageShell: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)",
    position: "relative",
  },
  bgPattern: {
    position: "absolute",
    inset: 0,
    backgroundImage:
      "radial-gradient(1200px 300px at 0% 0%, rgba(59,130,246,0.06), transparent 60%), radial-gradient(800px 300px at 100% 0%, rgba(16,185,129,0.05), transparent 60%)",
    pointerEvents: "none",
  },
  container: {
    width: "min(1100px, 92%)",
    margin: "0 auto",
    padding: "28px 0 80px",
    position: "relative",
    zIndex: 1,
  },
  headerCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
    background: "#ffffffaa",
    backdropFilter: "blur(6px)",
    border: "1px solid #e5e7eb",
    borderRadius: 16,
    padding: 20,
    boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
  },
  title: { margin: "0 0 4px 0", fontSize: 28 },
  meta: { margin: "4px 0", color: "#374151" },
  tabBarWrapper: { position: "sticky", top: 0, zIndex: 5, marginTop: 14 },
  tabBar: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: 9999,
    padding: 6,
    display: "inline-flex",
    gap: 6,
    boxShadow: "0 8px 30px rgba(0,0,0,0.04)",
  },
  tabBtn: {
    padding: "8px 16px",
    borderRadius: 9999,
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontWeight: 600,
  },
  tabBtnActive: {
    background: "linear-gradient(180deg,#3b82f6,#2563eb)",
    color: "#fff",
    boxShadow: "0 6px 16px rgba(37,99,235,0.35)",
  },
  section: { marginTop: 22 },
  sectionTitle: { margin: "0 0 12px 0", fontSize: 22 },
  sectionHeaderRow: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  grid12: { display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: 16 },
  card: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 14,
    padding: 16,
    boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
  },
  cardTitle: { margin: "0 0 10px 0", fontSize: 18 },
  submissionRow: {
    border: "1px solid #f1f5f9",
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    background: "#fbfdff",
  },
  listPlain: { listStyle: "none", padding: 0, margin: 0 },
  listRow: {
    padding: "8px 0",
    borderBottom: "1px dashed #e5e7eb",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #e5e7eb",
    outline: "none",
    background: "#fafafa",
  },
  label: { display: "block", fontWeight: 600, marginBottom: 6 },
  formRow: { marginTop: 10 },
  pillBtn: {
    padding: "10px 16px",
    borderRadius: 9999,
    border: "none",
    background: "linear-gradient(180deg,#10b981,#059669)",
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
  },
  primaryBtn: {
    padding: "10px 16px",
    borderRadius: 10,
    border: "none",
    background: "linear-gradient(180deg,#3b82f6,#2563eb)",
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
  },
  primaryBtnSmall: {
    padding: "8px 12px",
    borderRadius: 10,
    border: "none",
    background: "linear-gradient(180deg,#3b82f6,#2563eb)",
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
  },
  secondaryBtn: {
    padding: "8px 12px",
    borderRadius: 10,
    border: "1px solid #cbd5e1",
    background: "#ffffff",
    color: "#0f172a",
    fontWeight: 600,
    cursor: "pointer",
  },
  dangerBtn: {
    padding: "8px 12px",
    borderRadius: 10,
    border: "1px solid #fecaca",
    background: "#fef2f2",
    color: "#991b1b",
    fontWeight: 700,
    cursor: "pointer",
  },
  muted: { color: "#6b7280" },
  postCard: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 14,
    padding: 16,
    marginTop: 12,
    boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
  },
  centerFlex: { display: "flex", alignItems: "center", justifyContent: "center" },
  spinner: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    border: "4px solid #e5e7eb",
    borderTopColor: "#3b82f6",
    animation: "spin 1s linear infinite",
  },
};

// CSS keyframes (inline injection)
const styleTag = document.createElement("style");
styleTag.innerHTML = `
@keyframes spin { to { transform: rotate(360deg); } }
`;
if (typeof document !== "undefined" && !document.getElementById("classpage-keyframes")) {
  styleTag.id = "classpage-keyframes";
  document.head.appendChild(styleTag);
}

export default ClassPage;
