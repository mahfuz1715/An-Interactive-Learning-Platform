import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import MyClasses from "./MyClasses";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = useMemo(() => JSON.parse(localStorage.getItem("user") || "{}"), []);
  const [teachingOpen, setTeachingOpen] = useState(true);
  const [enrolledOpen, setEnrolledOpen] = useState(true);
  const [classesForSidebar, setClassesForSidebar] = useState([]);

  const isTeacher = user?.role === "teacher";
  const isStudent = user?.role === "student";

  const handleClassesLoaded = useCallback((arr) => {
    setClassesForSidebar(arr);
  }, []);

  <MyClasses onLoaded={handleClassesLoaded} />

  useEffect(() => {
    if (!classesForSidebar?.length && Array.isArray(window.__lastClasses)) {
      setClassesForSidebar(window.__lastClasses);
    }
  }, [classesForSidebar?.length]); 

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const goToClass = (cls) => {
    if (!cls?._id) return;
    navigate(`/class/${cls._id}`);
  };

  const wrap = {
    minHeight: "100vh",
    background:
      "radial-gradient(900px 600px at 0% -10%, rgba(124,58,237,.10), transparent 60%), radial-gradient(1000px 600px at 120% 10%, rgba(34,211,238,.10), transparent 60%), linear-gradient(180deg, rgba(37,99,235,.04), rgba(0,0,0,0))",
    padding: 16,
  };
  const shell = {
    maxWidth: 1280,
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "260px 1fr 320px",
    gap: 16,
  };
  const glass = {
    background: "rgba(255,255,255,.78)",
    border: "1px solid rgba(0,0,0,.06)",
    borderRadius: 18,
    boxShadow: "0 10px 35px rgba(0,0,0,.08)",
  };
  const panel = { ...glass, padding: 16 };
  const topbar = {
    ...glass,
    gridColumn: "1 / -1",
    padding: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  };
  const brand = { display: "flex", alignItems: "center", gap: 10, fontWeight: 800, fontSize: 24 };
  const welcome = {
    margin: 0,
    fontWeight: 800,
    letterSpacing: ".2px",
  };
  const ghostBtn = {
    background: "transparent",
    border: "1px solid rgba(0,0,0,.12)",
    borderRadius: 12,
    padding: "8px 12px",
    cursor: "pointer",
  };
  const primaryBtn = {
    background: "linear-gradient(135deg,#6366f1,#22d3ee)",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    padding: "10px 14px",
    cursor: "pointer",
  };
  const iconBtn = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    ...primaryBtn,
  };
  const dangerBtn = {
    background: "#9e7cd8ff",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    padding: "10px 14px",
    cursor: "pointer",
  };
  const sectionTitle = { fontSize: 18, fontWeight: 800, margin: "6px 0 12px" };
  const list = { listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 6 };
  const listItem = {
    padding: "8px 10px",
    borderRadius: 10,
    cursor: "pointer",
    border: "1px solid rgba(0,0,0,.06)",
    background: "rgba(255,255,255,.6)",
  };

  return (
    <div style={wrap}>
      <div style={shell}>
        {/* Topbar */}
        <div style={topbar}>
          <div style={brand}>
            <span style={{ fontSize: 22 }}>📚</span>
            Classroom
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {isTeacher && (
              <button
                style={iconBtn}
                onClick={() => navigate("/create-class")}
                title="Create a new class"
              >
                <span>➕</span> Create Class
              </button>
            )}
            {isStudent && (
              <button
                style={iconBtn}
                onClick={() => navigate("/join-class")}
                title="Join a class"
              >
                <span>➕</span> Join Class
              </button>
            )}

            <button style={dangerBtn} onClick={handleLogout} title="Logout">
              🚪 Logout
            </button>
          </div>
        </div>

        <aside style={panel}>
          <p style={{ ...welcome, fontSize: 20 }}>
            Welcome <span style={{ color: "#4338ca" }}>{user?.name || "User"}</span>!
          </p>
          <p style={{ marginTop: 4, color: "#6b7280" }}>
            You are logged in as <b>{user?.role}</b>
          </p>

          {isTeacher && (
            <div style={{ marginTop: 18 }}>
              <button
                onClick={() => setTeachingOpen((v) => !v)}
                style={{ ...ghostBtn, width: "100%", display: "flex", justifyContent: "space-between" }}
              >
                <span>👩‍🏫 Teaching</span>
                <span>{teachingOpen ? "▾" : "▸"}</span>
              </button>
              {teachingOpen && (
                <div style={{ marginTop: 10 }}>
                  <p style={{ margin: 0, color: "#6b7280", fontSize: 13 }}>My Classes</p>
                  <ul style={list}>
                    {(classesForSidebar || [])
                      .filter((c) => c?.teacherId?._id?.toString() === user?._id)
                      .map((c) => (
                        <li key={c._id} style={listItem} onClick={() => goToClass(c)} title={c?.subject || ""}>
                          {c?.name || "Untitled"} {c?.section ? `— ${c.section}` : ""}
                        </li>
                      ))}
                    {!classesForSidebar?.length && (
                      <li style={{ color: "#6b7280", fontSize: 13 }}>No classes yet</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          )}

          {isStudent && (
            <div style={{ marginTop: 18 }}>
              <button
                onClick={() => setEnrolledOpen((v) => !v)}
                style={{ ...ghostBtn, width: "100%", display: "flex", justifyContent: "space-between" }}
              >
                <span>🎓 Enrolled</span>
                <span>{enrolledOpen ? "▾" : "▸"}</span>
              </button>
              {enrolledOpen && (
                <div style={{ marginTop: 10 }}>
                  <p style={{ margin: 0, color: "#6b7280", fontSize: 13 }}>My Classes</p>
                  <ul style={list}>
                    {(classesForSidebar || [])
                      .filter((c) => !c?.isTeacher && c?.students)
                      .map((c) => (
                        <li key={c._id} style={listItem} onClick={() => goToClass(c)} title={c?.subject || ""}>
                          {c?.name || "Untitled"} {c?.section ? `— ${c.section}` : ""}
                        </li>
                      ))}
                    {!classesForSidebar?.length && (
                      <li style={{ color: "#6b7280", fontSize: 13 }}>No classes yet</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          )}
        </aside>

        <main style={{ ...panel, padding: 0 }}>
          <div style={{ padding: "16px 16px 0 16px" }}>
            <h2 style={sectionTitle}>🗂️ My Classes</h2>
          </div>
          <div style={{ padding: 16 }}>
            <MyClasses
              embedded
              onLoaded={handleClassesLoaded}
              onCardClick={goToClass}
            />
          </div>
        </main>

        <aside style={panel}>
          <h3 style={sectionTitle}>🗓️ Upcoming</h3>
          <div
            style={{
              border: "1px dashed rgba(0,0,0,.12)",
              borderRadius: 12,
              padding: 14,
              background: "rgba(255,255,255,.6)",
            }}
          >
            <p style={{ margin: 0, color: "#6b7280" }}>🎉 You’re all caught up!</p>
          </div>

          {/* Example of a due item (keep/comment) */}
          {/* <div style={{marginTop:12, padding:12, borderRadius:12, background:"#fff", border:"1px solid rgba(0,0,0,.06)"}}>
              <div style={{fontWeight:700}}>OS Assignment 2</div>
              <div style={{fontSize:13, color:"#6b7280"}}>Due in 2 days — CSE325</div>
            </div> */}
        </aside>
      </div>
    </div>
  );
}
