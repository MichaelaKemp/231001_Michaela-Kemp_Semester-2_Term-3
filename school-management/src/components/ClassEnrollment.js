import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import moment from 'moment';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import CentralLogo from '../logo/Central Logo.png';
import './ClassEnrollment.css';

const localizer = momentLocalizer(moment);

const ClassEnrollment = () => {
  const { id } = useParams();
  const [events, setEvents] = useState([]);

  const navigate = useNavigate(); // Initialize useNavigate for navigation

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/studenthome/${id}`);
        const data = await response.json();

        const createWeekdayEvents = (classData) => {
          const events = [];
          const daysOfWeek = [1, 2, 3, 4, 5]; // Monday through Friday

          daysOfWeek.forEach((dayOffset) => {
            const startDate = moment().startOf('week').add(dayOffset, 'days').toDate();
            const endDate = moment(startDate).add(moment.duration(classData.end_time)).toDate();

            events.push({
              title: `${classData.class_name} - ${classData.first_name} ${classData.last_name}`,
              start: new Date(`${startDate.toISOString().split('T')[0]}T${classData.start_time}`), 
              end: new Date(`${startDate.toISOString().split('T')[0]}T${classData.end_time}`),
              allDay: false,
            });
          });

          return events;
        };

        const classEvents = data.classes.flatMap((classData) => createWeekdayEvents(classData));
        setEvents(classEvents);
      } catch (err) {
        console.error('Error fetching class data:', err);
      }
    };

    fetchClassData();
  }, [id]);

  const handleLogout = () => {
    // Perform any logout logic here (e.g., clear authentication tokens, etc.)
    localStorage.removeItem('authToken'); // Example: Clear auth token
    navigate('/login'); // Redirect to the login page
  };

  return (
    <div className="student-home-wrapper">
      <header className="dashboard-header">
        <h1>Student Class Schedule</h1>
      </header>

      <nav className="side-navbar">
        <div className="logo-container">
            <img src={CentralLogo} alt="School Logo" className="logo" />
        </div>
        <ul className="nav-links">
          <li><Link to={`/studenthome/${id}`}>Dashboard</Link></li>
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
        <div className="dashboard">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%', width: '100%' }}
            defaultView="week"
            views={['week']}
          />
        </div>
      </div>
    </div>
  );
};

export default ClassEnrollment;