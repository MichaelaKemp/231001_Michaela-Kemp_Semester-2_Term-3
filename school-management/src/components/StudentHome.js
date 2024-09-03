import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'; // Make sure Link is imported here
import CentralLogo from '../logo/Central Logo.png';
import './StudentHome.css';

const StudentHome = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [errorMessage, setErrorMessage] = useState(''); // Error message state

  const navigate = useNavigate(); // Initialize useNavigate for navigation

  const fetchStudentHomeData = async () => {
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
      setErrorMessage('Failed to load student data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentHomeData();
  }, [id]);

  const handleRefresh = () => {
    setLoading(true);
    fetchStudentHomeData();
  };

  const handleLogout = () => {
    // Perform any logout logic here (e.g., clear authentication tokens, etc.)
    localStorage.removeItem('authToken'); // Example: Clear auth token
    navigate('/login'); // Redirect to the login page
  };

  return (
    <div className="student-home-wrapper">
      <nav className="side-navbar">
        <div className="logo-container">
        <img src={CentralLogo} alt="School Logo" className="logo" />
        </div>
        <ul className="nav-links">
          <li><Link to={`/classenrollment/${id}`}>Classes</Link></li>
          <li><Link to={`/assignments/${id}`}>Assignments</Link></li>
          <li><Link to={`/grades/${id}`}>Grades</Link></li>
          <li>
            <button className="nav-links" onClick={handleLogout}>
              Logout
            </button>
          </li>        
        </ul>
      </nav>

      <div className="dashboard-wrapper">
        <header className="dashboard-header">
          <h1>Dashboard</h1>
          <button onClick={handleRefresh} className="refresh-button">Refresh</button> {/* Refresh button */}
        </header>

        <div className="dashboard">
          {loading ? (
            <p>Loading...</p> /* Display loading message */
          ) : errorMessage ? (
            <p className="error-message">{errorMessage}</p> /* Display error message */
          ) : (
            <div className="subjects-container">
              {subjects.length > 0 ? subjects.map(subject => (
                <div className="subject-card" key={subject.class_id}>
                  <h3>{subject.class_name}</h3>
                  <p>{subject.first_name} {subject.last_name}</p>
                  <a href={`/subject/${subject.class_id}`} className="card-link">Go to {subject.class_name}</a>
                </div>
              )) : <p>No subjects available.</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentHome;