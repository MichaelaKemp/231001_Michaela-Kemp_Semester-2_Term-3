import React from 'react';
import './AssignmentManagement.css';

const AssignmentManagement = ({ assignments = [], onDelete, onUpdate }) => (
  <div className="assignment-management">
    <h2>Assignments</h2>
    {assignments.length > 0 ? (
      assignments.map(assignment => (
        <div key={assignment.id} className="assignment">
          <h3>{assignment.title}</h3>
          <p><strong>Due Date:</strong> {new Date(assignment.due_date).toLocaleDateString()}</p>
          <p><strong>Description:</strong> {assignment.description}</p>
          <button onClick={() => onDelete(assignment.id)}>Delete</button>
          <button onClick={() => onUpdate(assignment.id, assignment)}>Update</button>
          <SubmissionList submissions={assignment.submissions || []} />
        </div>
      ))
    ) : (
      <p>No assignments available.</p>
    )}
  </div>
);

const SubmissionList = ({ submissions = [] }) => (
  <div className="submission-list">
    <h4>Submissions</h4>
    {submissions.length > 0 ? (
      <ul>
        {submissions.map(submission => (
          <li key={submission.id}>
            <strong>{submission.student_name}</strong> - Grade: {submission.grade}<br />
            <em>{submission.feedback}</em>
          </li>
        ))}
      </ul>
    ) : (
      <p>No submissions yet.</p>
    )}
  </div>
);

export default AssignmentManagement;