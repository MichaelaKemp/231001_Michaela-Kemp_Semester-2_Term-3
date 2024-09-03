import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import StudentHome from './components/StudentHome';
import ClassEnrollment from './components/ClassEnrollment';
import Assignments from './components/Assignments';
import Grades from './components/Grades';
import TeacherDashboard from './components/TeacherDashboard';
import ClassManagement from './components/ClassManagement';
import AssignmentManagement from './components/AssignmentManagement';
import Gradebook from './components/Gradebook';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/studenthome/:id" element={<StudentHome />} />
        <Route path="/classenrollment/:id" element={<ClassEnrollment />} />
        <Route path="/assignments/:id" element={<Assignments />} />
        <Route path="/grades/:id" element={<Grades />} />
        <Route path="/teacherdashboard/:id" element={<TeacherDashboard />} />
        <Route path="/class-management/:id" element={<ClassManagement />} /> {/* Route for ClassManagement */}
        <Route path="/assignment-management/:id" element={<AssignmentManagement />} /> {/* Route for AssignmentManagement */}
        <Route path="/gradebook/:id" element={<Gradebook />} /> {/* Route for Gradebook */}
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;