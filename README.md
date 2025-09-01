A Web Appliaction for an Interactive Learning Platform


📌 Overview

This is a full-stack Classroom Management System inspired by Google Classroom.
It allows teachers, students, and admins to collaborate in a structured environment.
The system supports class creation, student enrollment, assignments, announcements, attendance tracking, and file sharing – all in a clean and modern UI.




🚀 Features

👨‍🏫 Teachers

Create and manage classes

Upload study materials

Create assignments with due dates and attachments

View and grade student submissions

Post announcements

Manage class attendance

👩‍🎓 Students

Join classes using a unique class code

Submit assignments (file/text)

View grades and feedback

Receive class notifications

Interact via posts and comments

🛡️ Admin

Access admin dashboard

Monitor total users, classes, and assignments

Manage application-level statistics

🔔 Common Features

Role-based authentication (student/teacher/admin)

Announcements and comment system

Notifications system for students

File upload/download (assignments & materials)



🖥️ Tech Stack (MERN)

Frontend: React.js, React Router, Axios, CSS

Backend: Node.js, Express.js

Database: MongoDB with Mongoose

Other: Multer (file upload), RESTful APIs, Role-based access




📂 Project Structure

frontend/

 ├── src/

 │    ├── components/      # Reusable components

 │    ├── pages/           # Dashboard, Login, JoinClass, CreateClass, ClassPage, etc.

 │    ├── styles.css       # Styling

 │    └── App.js           # Main routing

backend/

 ├── models/               # Mongoose schemas (User, Classroom, Assignment, etc.)

 ├── routes/               # API routes

 ├── server.js             # Express server

 └── middleware/           # File upload, auth, etc.



⚡ Installation & Setup

1️⃣ Clone the repository

git clone https://github.com/mahfuz1715/An-Interactive-Learning-Platform

cd classroom-app

2️⃣ Install dependencies

For backend:

cd backend
npm install

For frontend:

cd frontend
npm install

3️⃣ Setup environment variables

Create a .env file in backend with:

MONGO_URI=your_mongo_connection_string

PORT=5000

JWT_SECRET=your_secret_key

4️⃣ Run the project

Backend:

npm start

Frontend:

npm start



✅ Future Improvements

Real-time chat system (WebSockets)

Calendar integration for deadlines

Enhanced analytics dashboard




✨ Acknowledgement

This project was developed as part of Software Engineering coursework, aiming to replicate core features of Google Classroom with added custom innovations.
