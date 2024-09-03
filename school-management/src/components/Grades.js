import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import CentralLogo from '../logo/Central Logo.png';
import './Grades.css'; // Ensure you have this CSS file for styling

const Grades = () => {
  const { id } = useParams(); // Assuming `id` is the student ID from the route
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate(); // Initialize useNavigate for navigation

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/grades/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setGrades(data);
      } catch (err) {
        console.error('Error fetching grades:', err.message);
        setErrorMessage('Failed to load grades. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchGrades();
  }, [id]);

  const handleLogout = () => {
    // Perform any logout logic here (e.g., clear authentication tokens, etc.)
    localStorage.removeItem('authToken'); // Example: Clear auth token
    navigate('/login'); // Redirect to the login page
  };

  return (
    <div className="grades-wrapper">
      <nav className="side-navbar">
        <div className="logo-container">
            <img src={CentralLogo} alt="School Logo" className="logo" />
        </div>
        <ul className="nav-links">
          <li><Link to={`/studenthome/${id}`}>Dashboard</Link></li>
          <li><a href={`/classenrollment/${id}`}>Classes</a></li>
          <li><Link to={`/assignments/${id}`}>Assignments</Link></li>
          <li>
            <button className="nav-links" onClick={handleLogout}>
              Logout
            </button>
          </li>
        </ul>
      </nav>

      <div className="dashboard-wrapper">
        <header className="dashboard-header">
          <h1>Grades</h1>
        </header>

        <div className="grades-content">
          {loading ? (
            <p>Loading...</p>
          ) : errorMessage ? (
            <p className="error-message">{errorMessage}</p>
          ) : (
            <section className="grades-section">
              <h2>Your Grades</h2>
              {grades.length > 0 ? (
                <ul>
                  {grades.map((grade, index) => (
                   <li key={index} style={{ cursor: 'pointer' }}>
                        <strong>{grade.subject}</strong> - {grade.assignment_name}<br />
                        <strong>Grade:</strong> {grade.grade} <br />
                        <strong>Feedback:</strong> {grade.feedback}
                    </li>   
                  ))}
                </ul>
              ) : (
                <p>No grades available.</p>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default Grades;