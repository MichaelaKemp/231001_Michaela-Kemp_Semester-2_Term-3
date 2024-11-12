import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import StudentDashboard from './components/StudentDashboard';
import StudentClasses from './components/StudentClasses';
import StudentAssignments from './components/StudentAssignments';
import StudentGrades from './components/StudentGrades';
import TeacherDashboard from './components/TeacherDashboard';
import TeacherClasses from './components/TeacherClasses';
import TeacherAssignments from './components/TeacherAssignments';
import TeacherGrades from './components/TeacherGrades';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/studentdashboard/:id" element={<StudentDashboard />} />
        <Route path="/studentclasses/:id" element={<StudentClasses />} />
        <Route path="/studentassignments/:id" element={<StudentAssignments />} />
        <Route path="/studentgrades/:id" element={<StudentGrades />} />
        <Route path="/teacherdashboard/:id" element={<TeacherDashboard />} />
        <Route path="/teacherclasses/:id" element={<TeacherClasses />} /> {/* Route for ClassManagement */}
        <Route path="/teacherassignments/:id" element={<TeacherAssignments />} /> {/* Route for AssignmentManagement */}
        <Route path="/teachergrades/:id" element={<TeacherGrades />} /> {/* Route for Gradebook */}
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;