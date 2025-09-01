import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");

  const onLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/login", { email, password });
      localStorage.setItem("user", JSON.stringify(res.data.user));
      if (res.data.user.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/dashboard");
    }
  } catch {
    alert("Invalid credentials");
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
          <h1 className="auth-title">Login</h1>

          <form className="auth-form" onSubmit={onLogin}>
            <label>Email</label>
            <input className="input" type="email" value={email}
              onChange={(e) => setEmail(e.target.value)} required />

            <label>Password</label>
            <input className="input" type="password" value={password}
              onChange={(e) => setPass(e.target.value)} required />

            <button className="btn-primary" type="submit">Login</button>
          </form>

          <p className="auth-footer">
            Don’t have an account? <Link to="/signup">Signup here</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
