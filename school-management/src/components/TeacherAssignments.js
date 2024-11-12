import React, { useState } from 'react';
import './TeacherAssignments.css';

const TeacherAssignments = ({ assignments = [], onDeleteAssignment, onEditAssignment, onAddAssignment, onGradeSubmission }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editAssignment, setEditAssignment] = useState(null);
  const [newAssignment, setNewAssignment] = useState({ title: '', description: '', due_date: '', class_id: '' });

  const handleAddAssignment = () => {
    onAddAssignment(newAssignment);
    setNewAssignment({ title: '', description: '', due_date: '', class_id: '' });
  };

  const handleEditClick = (assignment) => {
    setEditAssignment(assignment);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    onEditAssignment(editAssignment.id, editAssignment);  // Use the passed function
    setEditAssignment(null);
    setIsEditing(false);
  };

  return (
    <div className="assignment-management">
      <h2>Assignments</h2>
      
      {assignments.length > 0 ? (
        assignments.map(assignment => (
          <div key={assignment.id} className="assignment">
            {isEditing && editAssignment && editAssignment.id === assignment.id ? (
              <div>
                <input type="text" value={editAssignment.title} onChange={(e) => setEditAssignment({ ...editAssignment, title: e.target.value })} />
                <input type="text" value={editAssignment.description} onChange={(e) => setEditAssignment({ ...editAssignment, description: e.target.value })} />
                <input type="date" value={editAssignment.due_date} onChange={(e) => setEditAssignment({ ...editAssignment, due_date: e.target.value })} />
                <button onClick={handleSaveEdit}>Save</button>
              </div>
            ) : (
              <div>
                <h3>{assignment.title}</h3>
                <p><strong>Due Date:</strong> {new Date(assignment.due_date).toLocaleDateString()}</p>
                <button onClick={() => handleEditClick(assignment)}>Edit</button>
                <button onClick={() => onDeleteAssignment(assignment.id)}>Delete</button>
              </div>
            )}
          </div>
        ))
      ) : (
        <p>No assignments available.</p>
      )}

      <div className="add-assignment">
        <h3>Add New Assignment</h3>
        <input type="text" placeholder="Title" value={newAssignment.title} onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })} />
        <input type="text" placeholder="Description" value={newAssignment.description} onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })} />
        <input type="date" value={newAssignment.due_date} onChange={(e) => setNewAssignment({ ...newAssignment, due_date: e.target.value })} />
        <input type="text" placeholder="Class ID" value={newAssignment.class_id} onChange={(e) => setNewAssignment({ ...newAssignment, class_id: e.target.value })} />
        <button onClick={handleAddAssignment}>Add Assignment</button>
      </div>
    </div>
  );
};

export default TeacherAssignments;