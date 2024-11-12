import React from 'react';
import './TeacherGrades.css';

const TeacherGrades = ({ submissions = [] }) => (
  <div className="gradebook">
    <h2>Gradebook</h2>
    {submissions.length > 0 ? (
      submissions.map(submission => (
        <div key={submission.id} className="submission-grade">
          <h3>{submission.assignment_title}</h3>
          <p><strong>Student:</strong> {submission.student_name}</p> {/* Display student name */}
          <p><strong>Grade:</strong> {submission.grade ? submission.grade : 'Not graded yet'}</p>
          <p><strong>Feedback:</strong> {submission.feedback ? submission.feedback : 'No feedback yet'}</p>
          <hr />
        </div>
      ))
    ) : (
      <p>No submissions available.</p>
    )}
  </div>
);

export default TeacherGrades;