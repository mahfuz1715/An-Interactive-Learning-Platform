import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function NotificationsPage() {
  const { id } = useParams(); // class id
  const [notifs, setNotifs] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/classes/${id}/notifications`)
      .then((res) => setNotifs(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>🔔 Notifications</h2>

      {notifs.length === 0 ? (
        <p>No notifications yet.</p>
      ) : (
        <ul>
          {notifs.map((n) => (
            <li key={n._id} style={{ marginBottom: "10px" }}>
              <b>{new Date(n.createdAt).toLocaleString()}</b> - {n.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default NotificationsPage;
