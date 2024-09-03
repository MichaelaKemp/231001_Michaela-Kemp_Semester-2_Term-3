import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import CentralLogo from '../logo/Central Logo.png';
import './Assignments.css'; // Ensure you have this CSS file for styling

const Assignments = () => {
  const { id } = useParams(); // Assuming `id` is the student ID from the route
  const [overdue, setOverdue] = useState([]);
  const [comingUp, setComingUp] = useState([]);
  const [past, setPast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [file, setFile] = useState(null);

  const navigate = useNavigate(); // Initialize useNavigate for navigation

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/assignments/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setOverdue(data.overdue);
        setComingUp(data.comingUp);
        setPast(data.past);
      } catch (err) {
        console.error('Error fetching assignments:', err.message);
        setErrorMessage('Failed to load assignments. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [id]);

  const handleAssignmentClick = (assignment) => {
    setSelectedAssignment(selectedAssignment === assignment ? null : assignment);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (assignmentId) => {
    if (!file) {
      alert('Please select a file before submitting.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('studentId', id);
    formData.append('assignmentId', assignmentId);

    try {
      const response = await fetch(`http://localhost:3001/api/submit`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('Assignment submitted successfully!');
        setSelectedAssignment(null); // Close the expanded assignment
        setComingUp(comingUp.filter(assignment => assignment.id !== assignmentId));
        setPast([...past, { ...selectedAssignment, status: 'submitted' }]); // Move to "Past" assignments
      } else {
        alert('Failed to submit assignment. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting assignment:', err.message);
    }
  };

  const handleLogout = () => {
    // Perform any logout logic here (e.g., clear authentication tokens, etc.)
    localStorage.removeItem('authToken'); // Example: Clear auth token
    navigate('/login'); // Redirect to the login page
  };

  return (
    <div className="assignments-wrapper">
      <nav className="side-navbar">
        <div className="logo-container">
        <img src={CentralLogo} alt="School Logo" className="logo" />
        </div>
        <ul className="nav-links">
          <li><Link to={`/studenthome/${id}`}>Dashboard</Link></li>
          <li><a href={`/classenrollment/${id}`}>Classes</a></li>
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
          <h1>Assignments</h1>
        </header>

        <div className="assignments-content">
          {loading ? (
            <p>Loading...</p>
          ) : errorMessage ? (
            <p className="error-message">{errorMessage}</p>
          ) : (
            <>
              <section className="assignments-section">
                <h2>Overdue</h2>
                {overdue.length > 0 ? (
                  <ul>
                    {overdue.map(assignment => (
                      <li key={assignment.id} onClick={() => handleAssignmentClick(assignment)}>
                        <strong>{assignment.title}</strong> - Due: {new Date(assignment.due_date).toLocaleDateString()} - {assignment.class_name}
                        {selectedAssignment && selectedAssignment.id === assignment.id && (
                          <div className="assignment-details">
                            <p>{assignment.description}</p>
                            <input type="file" onChange={handleFileChange} />
                            <button onClick={() => handleSubmit(assignment.id)}>Submit</button>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No overdue assignments.</p>
                )}
              </section>

              <section className="assignments-section">
                <h2>Coming Up</h2>
                {comingUp.length > 0 ? (
                  <ul>
                    {comingUp.map(assignment => (
                      <li key={assignment.id} onClick={() => handleAssignmentClick(assignment)}>
                        <strong>{assignment.title}</strong> - Due: {new Date(assignment.due_date).toLocaleDateString()} - {assignment.class_name}
                        {selectedAssignment && selectedAssignment.id === assignment.id && (
                          <div className="assignment-details">
                            <p>{assignment.description}</p>
                            <input type="file" onChange={handleFileChange} />
                            <button onClick={() => handleSubmit(assignment.id)}>Submit</button>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No upcoming assignments.</p>
                )}
              </section>

              <section className="assignments-section">
                <h2>Past</h2>
                {past.length > 0 ? (
                  <ul>
                    {past.map(assignment => (
                      <li key={assignment.id} onClick={() => handleAssignmentClick(assignment)}>
                        <strong>{assignment.title}</strong> - {assignment.class_name} - Due: {new Date(assignment.due_date).toLocaleDateString()}
                        {selectedAssignment && selectedAssignment.id === assignment.id && (
                          <div className="assignment-details">
                            <p>{assignment.description}</p>
                            {/* Optionally include details about the submission, feedback, etc. */}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No past assignments.</p>
                )}
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Assignments;