import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function JoinClass() {
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  // ✅ keep your own endpoint if different
  async function handleJoin(e) {
    e.preventDefault();
    if (!code.trim()) return;
    try {
      setBusy(true);
      await axios.post("http://localhost:5000/classes/join", {
        code,
        studentId: user._id,
      });
      alert("Successfully joined class!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Invalid or expired class code");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={ui.page}>
      <header style={ui.topbar}>
        <div style={ui.brand}>
          <span style={ui.brandBadge}>🔑</span>
          <span style={ui.brandText}>Join a Class</span>
        </div>
      </header>

      <main style={ui.canvas}>
        <section style={ui.card}>
          <p style={ui.lead}>Enter the class code shared by your teacher</p>

          <form onSubmit={handleJoin} style={ui.joinRow}>
            <input
              style={{ ...ui.input, flex: 1 }}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder=""
            />
            <button style={ui.primaryBtn} disabled={busy}>
              {busy ? "Joining…" : "Join Class"}
            </button>
          </form>

          <div style={ui.hint}>
            Tip: Codes are case-sensitive<b></b>.
          </div>
        </section>

        {/* Optional chalkboard doodle */}
        <div style={ui.illustration} aria-hidden>
          <div style={ui.board} />
          <div style={ui.chalk1} />
          <div style={ui.chalk2} />
        </div>
      </main>
    </div>
  );
}

const ui = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(1000px 500px at 15% -10%, rgba(99,102,241,.12), transparent 60%), radial-gradient(900px 450px at 120% 10%, rgba(34,211,238,.12), transparent 60%), linear-gradient(180deg, rgba(99,102,241,.05), rgba(0,0,0,0))",
    backgroundColor: "#f6f7fb",
  },
  topbar: {
    maxWidth: 900,
    margin: "0 auto",
    padding: "22px 20px",
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
    background: "linear-gradient(135deg,#8b5cf6,#22d3ee)",
    boxShadow: "0 6px 16px rgba(0,0,0,.15)",
  },
  brandText: { fontSize: 26, fontWeight: 800, color: "#111827" },

  canvas: {
    position: "relative",
    maxWidth: 900,
    margin: "0 auto",
    padding: "10px 20px 60px",
  },

  card: {
    position: "relative",
    zIndex: 1,
    background: "rgba(255,255,255,.9)",
    backdropFilter: "blur(10px)",
    border: "1px solid #e5e7eb",
    borderRadius: 22,
    padding: 22,
    boxShadow: "0 18px 44px rgba(0,0,0,.08)",
  },
  lead: { margin: "6px 0 16px", color: "#6b7280" },

  joinRow: {
    display: "grid",
    gridTemplateColumns: "1fr 160px",
    gap: 12,
  },

  input: {
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid #e5e7eb",
    background: "#f9fafb",
    color: "#111827",
    outline: "none",
  },
  primaryBtn: {
    padding: "12px 14px",
    borderRadius: 12,
    border: "none",
    cursor: "pointer",
    color: "white",
    fontWeight: 700,
    background: "linear-gradient(135deg,#8b5cf6,#22d3ee)",
    boxShadow: "0 10px 20px rgba(139,92,246,.25)",
  },
  hint: { marginTop: 10, fontSize: 13, color: "#6b7280" },

  illustration: {
    position: "absolute",
    right: -10,
    bottom: 20,
    width: 280,
    height: 170,
    opacity: 0.28,
    pointerEvents: "none",
  },
  board: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 240,
    height: 130,
    background: "#22543d",
    border: "10px solid #d1a56f",
    borderRadius: 10,
  },
  chalk1: {
    position: "absolute",
    right: 30,
    bottom: 18,
    width: 44,
    height: 10,
    background: "#f8fafc",
    borderRadius: 4,
    transform: "rotate(6deg)",
  },
  chalk2: {
    position: "absolute",
    right: 90,
    bottom: 18,
    width: 32,
    height: 10,
    background: "#f8fafc",
    borderRadius: 4,
    transform: "rotate(-8deg)",
  },
};
