import React, { useEffect, useState } from "react";
import axios from "axios";

function ClassroomsPage() {
  const [classes, setClasses] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user) {
      axios.get(`http://localhost:5000/classes/for-user/${user._id}`)
        .then(res => setClasses(res.data))
        .catch(err => console.log(err));
    }
  }, [user]);

  return (
    <div style={{ textAlign: "center" }}>
      <h2>My Classrooms</h2>
      {classes.map(cls => (
        <div key={cls._id} style={{ border: "1px solid #ddd", margin: "10px", padding: "15px", borderRadius: "10px" }}>
          <img src={cls.logo} alt="class logo" style={{ width: "100px", borderRadius: "50%" }} />
          <h3>{cls.name} ({cls.section})</h3>
          <p>Subject: {cls.subject}</p>
          <p>Code: <b>{cls.code}</b></p>
          <p>Teacher: {cls.teacherId?.name}</p>
        </div>
      ))}
    </div>
  );
}

export default ClassroomsPage;
