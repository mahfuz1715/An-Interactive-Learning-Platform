// src/MyClasses.js
import React, { useEffect, useState } from "react";
import axios from "axios";

/**
 * Props:
 * - embedded?: boolean   // if used inside Dashboard
 * - onLoaded?: (classes) => void
 * - onCardClick?: (cls) => void
 */
export default function MyClasses({ embedded = false, onLoaded, onCardClick }) {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user] = useState(() => JSON.parse(localStorage.getItem("user")));

  // 🔁 If your route is different, change it here:
  // const API_URL = "http://localhost:5000/my-classes";

  useEffect(() => {
  if (!user) return;

  setLoading(true);
  axios
    .get(`http://localhost:5000/classes/for-user/${user._id}`)
    .then((res) => {
      setClasses(res.data || []);
      if (onLoaded) onLoaded(res.data || []);   // ✅ sidebar update
    })
    .catch(() => {
      setClasses([]);
      if (onLoaded) onLoaded([]);               // ✅ sidebar empty
    })
    .finally(() => setLoading(false));
}, [user, onLoaded]); // reload এও চলবে কিন্তু infinite loop হবে না

  // --- styles for polished cards ---
  const grid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: 16,
  };
  const card = {
    background: "rgba(255,255,255,.85)",
    border: "1px solid rgba(0,0,0,.06)",
    borderRadius: 18,
    boxShadow: "0 10px 25px rgba(0,0,0,.06)",
    overflow: "hidden",
    cursor: "pointer",
    transition: "transform .12s ease, box-shadow .12s ease",
  };
  const cardHover = (e, on) => {
    if (!e?.currentTarget) return;
    e.currentTarget.style.transform = on ? "translateY(-2px)" : "translateY(0)";
    e.currentTarget.style.boxShadow = on
      ? "0 18px 40px rgba(0,0,0,.10)"
      : "0 10px 25px rgba(0,0,0,.06)";
  };
  const banner = {
    height: 84,
    background:
      "linear-gradient(135deg, rgba(99,102,241,.9), rgba(34,211,238,.9)), url('/bg-classroom.jpg') center/cover",
  };
  const body = { padding: 14 };
  const title = { margin: 0, fontWeight: 800, fontSize: 20 };
  const meta = { marginTop: 6, fontSize: 13, color: "#6b7280", lineHeight: 1.4 };

  return (
    <div>
      {loading && <p style={{ color: "#6b7280" }}>Loading your classes…</p>}

      {!loading && !classes.length && (
        <div
          style={{
            padding: 16,
            border: "1px dashed rgba(0,0,0,.12)",
            borderRadius: 12,
            background: "rgba(255,255,255,.65)",
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: 4 }}>No classes yet</div>
          <div style={{ fontSize: 13, color: "#6b7280" }}>
            {`Use ${embedded ? (/* in dashboard */ "the top-right buttons") : "Create/Join"} to get started.`}
          </div>
        </div>
      )}

      {!loading && !!classes.length && (
        <div style={grid}>
          {classes.map((c) => (
            <div
              key={c._id}
              style={card}
              onMouseEnter={(e) => cardHover(e, true)}
              onMouseLeave={(e) => cardHover(e, false)}
              onClick={() => (onCardClick ? onCardClick(c) : null)}
              title={c?.subject || ""}
            >
              <div style={banner} />
              <div style={body}>
                <h3 style={title}>
                  {c?.name || "Untitled"} {c?.section ? `Section-${c.section}` : ""}
                </h3>
                <div style={meta}>
                  <div>
                    <b>Subject:</b> {c?.subject || "—"}
                  </div>
                  <div>
                    <b>Teacher:</b>{" "}
                    {c?.teacherId?.name ||
                      c?.teacherName ||
                      (c?.isTeacher ? "You" : "—")}
                  </div>
                  {c?.code && (
                    <div>
                      <b>Class Code:</b> {c.code}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
