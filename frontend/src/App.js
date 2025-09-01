// import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";
import HomePage from "./HomePage";
import ClassroomsPage from "./ClassroomsPage";
import Dashboard from "./Dashboard";
import CreateClass from "./CreateClass";
import MyClasses from "./MyClasses";
import JoinClass from "./JoinClass";
import ClassPage from "./ClassPage";
import AttendancePage from "./AttendancePage";
import NotificationsPage from "./NotificationsPage";
import AdminDashboard from "./AdminDashboard";
import AdminGate from "./components/AdminGate";
import "./styles.css";

// Inside <Routes>:
<Route path="/classes" element={<ClassroomsPage />} />

function App() {
  

  return (
    <Router>

      

      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-class" element={<CreateClass />} /> {/* ✅ new */}
        <Route path="/my-classes" element={<MyClasses />} />
        <Route path="/join-class" element={<JoinClass />} />
        <Route path="/class/:id" element={<ClassPage />} />
        <Route path="/class/:id/attendance" element={<AttendancePage />} />
        <Route path="/class/:id/notifications" element={<NotificationsPage />} />
        <Route
          path="/admin"
          element={
            <AdminGate>
              <AdminDashboard />
            </AdminGate>
          }
        />
      </Routes>
      
    </Router>
  );
}

export default App;
