import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function SignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");
  const [role, setRole] = useState("student"); // keep student/teacher

  const onSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/signup", { name, email, password, role });
      alert("User registered successfully!");
      navigate("/");
    } catch {
      alert("Signup failed");
    }
  };

  return (
    <div className="auth-page"
      style={{
        backgroundImage: "url('/bg-classroom.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh"
      }}>
      <div className="auth-nav">
        <div className="brand">
          <span className="brand-badge">📚</span>
          Classroom
        </div>
      </div>

      <main className="auth-main">
        <div className="auth-card">
          <h1 className="auth-title">Signup</h1>
          <p className="auth-sub">Create your account</p>

          <form className="auth-form" onSubmit={onSignup}>
            <label>Name</label>
            <input className="input" value={name}
              onChange={(e) => setName(e.target.value)} required />

            <label>Email</label>
            <input className="input" type="email" value={email}
              onChange={(e) => setEmail(e.target.value)} required />

            <label>Password</label>
            <input className="input" type="password" value={password}
              onChange={(e) => setPass(e.target.value)} required />

            <label>Role</label>
            <select className="select" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>

            <button className="btn-primary" type="submit">Signup</button>
          </form>

          <p className="auth-footer">
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
