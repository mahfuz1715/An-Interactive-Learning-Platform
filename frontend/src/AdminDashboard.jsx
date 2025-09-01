import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [stats, setStats] = useState({ userCount: 0, classCount: 0, assignmentCount: 0, submissionCount: 0 });

  useEffect(() => {
    axios.get("http://localhost:5000/admin/users").then(res => setUsers(res.data));
    axios.get("http://localhost:5000/admin/classes").then(res => setClasses(res.data));
    axios.get("http://localhost:5000/admin/stats").then(res => setStats(res.data));
  }, []);

  const changeRole = async (id, role) => {
    await axios.put(`http://localhost:5000/admin/users/${id}/role`, { role });
    setUsers(prev => prev.map(u => (u._id === id ? { ...u, role } : u)));
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    await axios.delete(`http://localhost:5000/admin/users/${id}`);
    setUsers(prev => prev.filter(u => u._id !== id));
  };

  // ✅ Proper logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");   // redirect to login page
  };

  const wrapStyle = {
    minHeight: "100vh",
    padding: "24px",
    color: "#111827",
    // ✅ Background from public/ (no bundler resolution needed)
    backgroundImage: `linear-gradient(rgba(0,0,0,.35), rgba(0,0,0,.35)), url(${process.env.PUBLIC_URL}/bg-admin.jpg)`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
  };

  const glass = {
    background: "rgba(255,255,255,0.9)",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
    borderRadius: "16px",
  };

  const sectionTitle = { color: "white", textShadow: "0 1px 2px rgba(0,0,0,.5)" };

  return (
    <div style={wrapStyle}>
      {/* Header */}
      <div style={{ ...glass, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", marginBottom: 24, background: "rgba(0,0,0,0.45)", color: "white" }}>
        <h1 style={{ margin: 0, fontSize: 32, fontWeight: 800 }}>⚙️ Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          style={{ background: "#bac6ddff", color: "black", border: "none", padding: "10px 14px", borderRadius: 10, cursor: "pointer" }}
        >
          🚪 Logout
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 24 }}>
        {[
          { title: "Users", count: stats.userCount, icon: "👥" },
          { title: "Classes", count: stats.classCount, icon: "📚" },
          { title: "Assignments", count: stats.assignmentCount, icon: "📝" },
          { title: "Submissions", count: stats.submissionCount, icon: "📤" },
        ].map((item, i) => (
          <div key={i} style={{ ...glass, padding: 18, textAlign: "center" }}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>{item.icon} {item.title}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#4f46e5" }}>{item.count}</div>
          </div>
        ))}
      </div>

      {/* Manage Users */}
      <h2 style={{ ...sectionTitle, fontSize: 24, margin: "8px 0 12px" }}>👥 Manage Users</h2>
      <div style={{ overflowX: "auto", marginBottom: 24 }}>
        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, ...glass }}>
          <thead>
            <tr style={{ background: "rgba(79,70,229,.1)" }}>
              <th style={{ textAlign: "left", padding: "12px 14px" }}>Name</th>
              <th style={{ textAlign: "left", padding: "12px 14px" }}>Email</th>
              <th style={{ textAlign: "left", padding: "12px 14px" }}>Role</th>
              <th style={{ textAlign: "center", padding: "12px 14px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id} style={{ borderTop: "1px solid rgba(0,0,0,.06)" }}>
                <td style={{ padding: "10px 14px" }}>{u.name}</td>
                <td style={{ padding: "10px 14px" }}>{u.email}</td>
                <td style={{ padding: "10px 14px" }}>
                  <select
                    value={u.role}
                    onChange={e => changeRole(u._id, e.target.value)}
                    style={{ padding: "6px 8px", borderRadius: 8 }}
                  >
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td style={{ padding: "10px 14px", textAlign: "center" }}>
                  <button
                    onClick={() => deleteUser(u._id)}
                    style={{ background: "#44dbefff", color: "white", border: "none", padding: "8px 10px", borderRadius: 8, cursor: "pointer" }}
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Manage Classes */}
      <h2 style={{ ...sectionTitle, fontSize: 24, margin: "8px 0 12px" }}>📚 Manage Classes</h2>
      <div style={{ display: "grid", gap: 16 }}>
        {classes.map(c => (
          <div key={c._id} style={{ ...glass, padding: 18 }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#4338ca" }}>
              {c.name} ({c.subject})
            </div>
            <div style={{ fontSize: 13, color: "#475569", margin: "6px 0 10px" }}>
              Teacher: {c.teacherId?.name} ({c.teacherId?.email})
            </div>
            <ul style={{ marginLeft: 18 }}>
              {c.students.map(s => (
                <li key={s._id}>{s.name} ({s.email})</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
