import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ClassManagement from './ClassManagement';
import AssignmentManagement from './AssignmentManagement';
import Gradebook from './Gradebook';
import './TeacherDashboard.css';

const TeacherDashboard = () => {
  const { id: teacherId } = useParams(); // Extract teacherId from URL params
  const [classInfo, setClassInfo] = useState(null);
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/teacher/class/${teacherId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setClassInfo(data.classInfo);
        setStudents(data.students);
        setAssignments(data.assignments);
        setSubmissions(data.submissions); // Add this line to set submissions
      } catch (err) {
        console.error('Error fetching teacher data:', err.message);
        setErrorMessage('Failed to load class data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherData();
  }, [teacherId]);

  const handleGradeSubmission = async (submissionId, updatedSubmission) => {
    try {
      const response = await fetch(`http://localhost:3001/api/submissions/${submissionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          grade: updatedSubmission.grade,
          feedback: updatedSubmission.feedback,
        }),
      });

      if (response.ok) {
        // Update the local state to reflect the updated submission
        setSubmissions((prevSubmissions) =>
          prevSubmissions.map((submission) =>
            submission.id === submissionId ? { ...submission, ...updatedSubmission } : submission
          )
        );
        alert('Submission updated successfully!');
      } else {
        alert('Failed to update submission.');
      }
    } catch (error) {
      console.error('Error updating submission:', error);
      alert('An error occurred while updating the submission.');
    }
  };

  // Define the onEditAssignment function
  const handleEditAssignment = async (assignmentId, updatedAssignment) => {
    try {
      const response = await fetch(`http://localhost:3001/api/assignments/${assignmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedAssignment),
      });

      if (response.ok) {
        // Update the local state to reflect the updated assignment
        setAssignments((prevAssignments) =>
          prevAssignments.map((assignment) =>
            assignment.id === assignmentId ? { ...assignment, ...updatedAssignment } : assignment
          )
        );
        alert('Assignment updated successfully!');
      } else {
        alert('Failed to update assignment.');
      }
    } catch (error) {
      console.error('Error updating assignment:', error);
      alert('An error occurred while updating the assignment.');
    }
  };

  // Define the onAddAssignment function
  const handleAddAssignment = async (newAssignment) => {
    if (!newAssignment.class_id) {
      alert('Please select a valid class before adding the assignment.');
      return;  // Prevent adding the assignment if class_id is missing
    }

    try {
      const response = await fetch(`http://localhost:3001/api/assignments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAssignment),
      });

      if (response.ok) {
        const addedAssignment = await response.json();
        // Update the local state to add the new assignment
        setAssignments((prevAssignments) => [...prevAssignments, { ...newAssignment, id: addedAssignment.assignmentId }]);
        alert('Assignment added successfully!');
      } else {
        alert('Failed to add assignment.');
      }
    } catch (error) {
      console.error('Error adding assignment:', error);
      alert('An error occurred while adding the assignment.');
    }
  };

  return (
    <div className="teacher-dashboard-wrapper">
      <header className="dashboard-header">
        <h1>Teacher Dashboard</h1>
      </header>

      {loading ? (
        <p>Loading...</p>
      ) : errorMessage ? (
        <p className="error-message">{errorMessage}</p>
      ) : (
        <div className="dashboard-content dashboard-grid">
          <div className="dashboard-section class-info">
            <h2>Class Information</h2>
            {classInfo ? (
              <div>
                <p><strong>Subject:</strong> {classInfo.subject}</p>
                <p><strong>Class:</strong> {classInfo.class_name}</p>
                <p><strong>Start Time:</strong> {classInfo.start_time}</p>
                <p><strong>End Time:</strong> {classInfo.end_time}</p>
              </div>
            ) : (
              <p>No class information available.</p>
            )}
          </div>
          <div className="dashboard-section submission-card">
            <Gradebook submissions={submissions} /> {/* Display submissions here */}
          </div>
          <div className="dashboard-section assignment-card">
            <AssignmentManagement
              assignments={assignments}
              onEditAssignment={handleEditAssignment}  // Pass the function here
              onAddAssignment={handleAddAssignment}  // Pass the onAddAssignment function here
              onGradeSubmission={handleGradeSubmission}
            />
          </div>
          <div className="dashboard-section student-list-section">
            <h2>Students</h2>
            <ul>
              {students.map(student => (
                <li key={student.id}>{student.first_name} {student.last_name}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;