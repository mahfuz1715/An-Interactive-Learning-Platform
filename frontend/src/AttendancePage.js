import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function AttendancePage() {
  const { id } = useParams(); // class id
  const [grid, setGrid] = useState(null);
  const [date, setDate] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:5000/classes/${id}/attendance-grid`)
      .then((res) => setGrid(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  const handleChange = (studentId, value) => {
    setGrid((prev) => ({
      ...prev,
      records: prev.records.map((rec) =>
        rec.studentId === studentId
          ? { ...rec, dates: { ...rec.dates, [date]: value } }
          : rec
      ),
    }));
  };

  const handleSave = async () => {
    try {
      const updates = grid.records.map((r) => ({
        studentId: r.studentId,
        status: r.dates[date] || "",
      }));

      await axios.put(`http://localhost:5000/classes/${id}/attendance-grid`, {
        date,
        updates,
      });

      alert("Attendance saved!");
    } catch (err) {
      alert("Error saving attendance");
    }
  };

  if (!grid) return <h3>Loading attendance...</h3>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>📊 Attendance</h2>

      <label>
        Select Date:{" "}
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </label>

      <table border="1" cellPadding="8" style={{ marginTop: "20px", width: "100%" }}>
        <thead>
          <tr>
            <th>Student</th>
            <th>Email</th>
            <th>Status ({date || "select date"})</th>
          </tr>
        </thead>
        <tbody>
          {grid.records.map((r) => (
            <tr key={r.studentId}>
              <td>{r.studentName}</td>
              <td>{r.studentEmail}</td>
              <td>
                <input
                  type="text"
                  placeholder=""
                  value={r.dates[date] || ""}
                  onChange={(e) => handleChange(r.studentId, e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={handleSave} style={{ marginTop: "20px" }}>
        Save Attendance
      </button>
    </div>
  );
}

export default AttendancePage;
