import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './StudentHome.css';

const StudentHome = () => {
  const { id } = useParams(); // Get the student ID from the URL
  const [student, setStudent] = useState(null);
  const [subjects, setSubjects] = useState([]);

  // Fetch student home data function
  const fetchStudentHomeData = async () => {
    console.log('Fetching data from:', `http://localhost:3001/api/studenthome/${id}`);
    try {
      const response = await fetch(`http://localhost:3001/api/studenthome/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setStudent(data.student);
      setSubjects(data.classes);
    } catch (err) {
      console.error('Error fetching student data:', err.message);
    }
  };

  // useEffect hook to fetch data when the component mounts or when the id changes
  useEffect(() => {
    fetchStudentHomeData();
  }, [id]);

  return (
    <div className="student-home-wrapper">
      <nav className="side-navbar">
        <div className="logo-container">
          {/* Replace with your logo */}
          <img src="/path/to/logo.png" alt="School Logo" className="logo" />
        </div>
        <ul className="nav-links">
          <li><a href="/classes">Classes</a></li>
          <li><a href="/assignments">Assignments</a></li>
          <li><a href="/grades">Grades</a></li>
          <li><a href="/messages">Messages</a></li>
          <li><a href="/logout">Logout</a></li>
        </ul>
      </nav>

      <div className="dashboard-wrapper">
        <header className="dashboard-header">
          <h1>Dashboard</h1>
        </header>

        <div className="dashboard">
          <div className="subjects-container">
            {subjects.length > 0 ? subjects.map(subject => (
              <div className="subject-card" key={subject.class_id}>
                <h3>{subject.class_name}</h3>
                <p>{subject.first_name} {subject.last_name}</p>
                <a href={`/subject/${subject.class_id}`} className="card-link">Go to {subject.class_name}</a>
              </div>
            )) : <p>No subjects available.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentHome;