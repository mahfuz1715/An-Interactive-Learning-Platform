import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CreateClass() {
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [section, setSection] = useState("");
  const [description, setDescription] = useState("");
  const [logo, setLogo] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  // ✅ keep your own endpoint if different
  async function handleCreate(e) {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      setBusy(true);
      await axios.post("http://localhost:5000/classes/create", {
        name,
        subject,
        section,
        description,
        logo,
        teacherId: user._id,
      });
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Failed to create class");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={ui.page}>
      {/* Top bar */}
      <header style={ui.topbar}>
        <div style={ui.brand}>
          <span style={ui.brandBadge}>📚</span>
          <span style={ui.brandText}>Create a New Class</span>
        </div>
      </header>

      {/* Content canvas */}
      <main style={ui.canvas}>
        {/* Illustration (optional) */}
        <div style={ui.illustration} aria-hidden>
          <div style={ui.boardShadow} />
          <div style={ui.board} />
          <div style={ui.desk} />
        </div>

        {/* Glass card */}
        <form onSubmit={handleCreate} style={ui.card}>
          <p style={ui.lead}>Fill the details to set up your classroom</p>

          <div style={ui.row2}>
            <div style={ui.field}>
              <label style={ui.label}>Class Name</label>
              <input
                style={ui.input}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder=""
                required
              />
            </div>

            <div style={ui.field}>
              <label style={ui.label}>Subject</label>
              <input
                style={ui.input}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder=""
              />
            </div>
          </div>

          <div style={ui.row2}>
            <div style={ui.field}>
              <label style={ui.label}>Section</label>
              <input
                style={ui.input}
                value={section}
                onChange={(e) => setSection(e.target.value)}
                placeholder=""
              />
            </div>

            <div style={ui.field}>
              <label style={ui.label}>Logo URL (optional)</label>
              <input
                style={ui.input}
                value={logo}
                onChange={(e) => setLogo(e.target.value)}
                placeholder="https://…"
              />
            </div>
          </div>

          <div style={ui.field}>
            <label style={ui.label}>Description</label>
            <textarea
              rows={4}
              style={{ ...ui.input, resize: "vertical" }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short summary (optional)…"
            />
          </div>

          <button style={ui.primaryBtn} disabled={busy}>
            {busy ? "Creating…" : "Create Class"}
          </button>
        </form>
      </main>
    </div>
  );
}

/* ---------- inline styles (no CSS file changes needed) ---------- */
const ui = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(1200px 600px at 20% -10%, rgba(124,58,237,.14), transparent 60%), radial-gradient(1000px 500px at 120% 10%, rgba(34,211,238,.12), transparent 60%), linear-gradient(180deg, rgba(37,99,235,.06), rgba(0,0,0,0))",
    backgroundColor: "#f6f7fb",
  },
  topbar: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "22px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brand: { display: "flex", alignItems: "center", gap: 12 },
  brandBadge: {
    display: "inline-flex",
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    color: "white",
    background: "linear-gradient(135deg,#6366f1,#22d3ee)",
    boxShadow: "0 6px 16px rgba(0,0,0,.15)",
  },
  brandText: { fontSize: 26, fontWeight: 800, color: "#111827" },

  canvas: {
    position: "relative",
    maxWidth: 1200,
    margin: "0 auto",
    padding: "16px 20px 60px",
    display: "grid",
    gridTemplateColumns: "1fr",
  },

  illustration: {
    position: "absolute",
    left: 40,
    bottom: 40,
    width: 380,
    height: 220,
    pointerEvents: "none",
    opacity: 0.35,
  },
  boardShadow: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(60% 60% at 50% 50%, rgba(0,0,0,.25), transparent 65%)",
    filter: "blur(22px)",
  },
  board: {
    position: "absolute",
    top: 10,
    left: 10,
    width: 260,
    height: 120,
    background: "#2f855a",
    border: "10px solid #d1a56f",
    borderRadius: 10,
  },
  desk: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: 360,
    height: 60,
    background: "#e0b07e",
    borderRadius: 12,
    boxShadow: "inset 0 6px 0 rgba(0,0,0,.08)",
  },

  card: {
    zIndex: 1,
    width: "100%",
    background: "rgba(255,255,255,.86)",
    backdropFilter: "blur(10px)",
    border: "1px solid #e5e7eb",
    borderRadius: 22,
    padding: 24,
    boxShadow: "0 20px 50px rgba(0,0,0,.08)",
  },
  lead: { margin: "4px 0 18px", color: "#6b7280" },

  row2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
    marginBottom: 14,
  },
  field: { display: "grid", gap: 6 },
  label: { fontSize: 13, color: "#6b7280" },
  input: {
    width: "90%",
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid #e5e7eb",
    background: "#f9fafb",
    color: "#111827",
    outline: "none",
  },
  primaryBtn: {
    width: "100%",
    marginTop: 10,
    padding: "12px 14px",
    borderRadius: 12,
    border: "none",
    cursor: "pointer",
    color: "white",
    fontWeight: 700,
    background: "linear-gradient(135deg,#6366f1,#22d3ee)",
    boxShadow: "0 10px 20px rgba(99,102,241,.25)",
  },
};
