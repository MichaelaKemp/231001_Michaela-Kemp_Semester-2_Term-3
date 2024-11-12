import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import CentralLogo from '../logo/Central Logo.png';
import './StudentDashboard.css';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register the components explicitly
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StudentDashboard = () => {
  const { id } = useParams();
  const [subjects, setSubjects] = useState([]);
  const [attendance, setAttendance] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch data from backend API
        const [subjectsRes, attendanceRes, activityRes, announcementsRes, performanceRes] = await Promise.all([
          fetch(`http://localhost:3001/api/studenthome/${id}`),
          fetch(`http://localhost:3001/api/attendance/${id}`),
          fetch(`http://localhost:3001/api/activity/${id}`),
          fetch(`http://localhost:3001/api/announcements`),
          fetch(`http://localhost:3001/api/performance/${id}`),
        ]);

        const subjectsData = await subjectsRes.json();
        const attendanceData = await attendanceRes.json();
        const activityData = await activityRes.json();
        const announcementsData = await announcementsRes.json();
        const performanceData = await performanceRes.json();

        setSubjects(subjectsData.classes);
        setAttendance(attendanceData);
        setRecentActivity(activityData);
        setAnnouncements(announcementsData);
        setPerformanceData(performanceData);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [id]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  {performanceData.length > 0 && (
    <div className="performance-graph">
      <h2>Class Performance</h2>
      <Bar data={performanceChartData} />
    </div>
  )}  

  // Prepare data for the performance chart
  const performanceChartData = {
    labels: Array.isArray(performanceData) ? performanceData.map(item => item.class_name) : [],
    datasets: [
      {
        label: 'Average Grade',
        data: Array.isArray(performanceData) ? performanceData.map(item => item.average_grade) : [],
        backgroundColor: '#4ECDC4',
      },
    ],
  };  

  return (
    <div className="student-home-wrapper">
      <nav className="side-navbar">
        <div className="logo-container">
          <img src={CentralLogo} alt="School Logo" className="logo" />
        </div>
        <ul className="nav-links">
          <li><Link to={`/studentdashboard/${id}`} data-icon="🏠">Dashboard</Link></li>
          <li><Link to={`/studentclasses/${id}`} data-icon="📚">Classes</Link></li>
          <li><Link to={`/studentassignments/${id}`} data-icon="📝">Assignments</Link></li>
          <li><Link to={`/studentgrades/${id}`} data-icon="🏆">Grades</Link></li>
          <li>
            <button className="nav-links" data-icon="🔒" onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      </nav>

      <div className="dashboard-wrapper">
        <header className="dashboard-header">
          <h1>Welcome to Your Dashboard</h1>
        </header>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div className="info-cards">
              <div className="info-card">
                <h3>Total Classes</h3>
                <p>{subjects ? subjects.length : "N/A"}</p>
              </div>
              <div className="info-card">
                <h3>Upcoming Assignments</h3>
                <p>{recentActivity ? recentActivity.length : "N/A"}</p>
              </div>
              <div className="info-card">
                <h3>Average Grade</h3>
                <p>
                  {performanceData.length > 0
                    ? (performanceData.reduce((acc, curr) => acc + parseFloat(curr.average_grade), 0) / performanceData.length).toFixed(2) + "%"
                    : "N/A"}
                </p>
              </div>
              <div className="info-card">
                <h3>Attendance Rate</h3>
                <p>{attendance && attendance.attendance_rate ? `${attendance.attendance_rate}%` : "N/A"}</p>
              </div>
            </div>

            <div className="recent-activity">
              <h2>Recent Activity</h2>
              <ul>
                {recentActivity.map((activity, index) => (
                  <li key={index}>{activity.details}</li>
                ))}
              </ul>
            </div>

            <div className="announcements">
              <h2>Announcements</h2>
              <ul>
                {announcements.map((announcement, index) => (
                  <li key={index}>
                    <h3>{announcement.title}</h3>
                    <p>{announcement.content}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="performance-graph">
              <h2>Class Performance</h2>
              <Bar data={performanceChartData} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;