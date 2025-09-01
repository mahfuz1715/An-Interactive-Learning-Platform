// src/components/AdminGate.jsx
export default function AdminGate({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || user.role !== "admin") {
    return (
      <div style={{ padding: 24 }}>
        <h3>Forbidden</h3>
        <p>You don’t have access to this page.</p>
      </div>
    );
  }
  return children;
}
