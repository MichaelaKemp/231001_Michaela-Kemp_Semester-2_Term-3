import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import moment from 'moment';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import CentralLogo from '../logo/Central Logo.png';
import './StudentClasses.css';

const localizer = momentLocalizer(moment);
const classColors = ['#4ECDC4', '#FF6B6B', '#3498DB', '#F39C12', '#9B59B6'];

const StudentClasses = () => {
  const { id } = useParams();
  const [events, setEvents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/studenthome/${id}`);
        const data = await response.json();
        setSubjects(data.classes);

        const generateMonthlyEvents = (classData, index) => {
          const color = classColors[index % classColors.length];
          const monthStart = moment().startOf('month');
          const monthEnd = moment().endOf('month');
          const events = [];

          for (let day = monthStart; day.isBefore(monthEnd); day.add(1, 'days')) {
            const isWeekday = day.isoWeekday() <= 5;
            if (isWeekday) {
              events.push({
                title: classData.class_name,
                start: day.set('hour', 9).toDate(),
                end: day.set('hour', 10).toDate(),
                color,
                teacher: `${classData.first_name} ${classData.last_name}`,
                className: classData.class_name,
                time: '9:00 AM - 10:00 AM',
              });
            }
          }
          return events;
        };

        const classEvents = data.classes.flatMap((classData, index) => generateMonthlyEvents(classData, index));
        setEvents(classEvents);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, [id]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const eventStyleGetter = (event) => ({
    style: {
      backgroundColor: event.color,
      color: '#fff',
      borderRadius: '8px',
      padding: '5px',
    },
  });

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
  };

  const closeModal = () => {
    setSelectedEvent(null);
  };

  return (
    <div className="page-wrapper">
      <header className="dashboard-header">
        <h1>{moment().format('MMMM YYYY')}</h1>
      </header>

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

      <main className="main-content">
        <div className="calendar-container">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '80vh', width: '100%' }}
            defaultView="month"
            views={['month']}
            eventPropGetter={eventStyleGetter}
            onSelectEvent={handleSelectEvent}
          />
        </div>

        {selectedEvent && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <span className="close-button" onClick={closeModal}>&times;</span>
              <h3>Class Details</h3>
              <p><strong>Class:</strong> {selectedEvent.className}</p>
              <p><strong>Teacher:</strong> {selectedEvent.teacher}</p>
              <p><strong>Time:</strong> {selectedEvent.time}</p>
            </div>
          </div>
        )}

        <div className="legend-container">
          <h4>Class Legend</h4>
          <ul>
            {subjects.map((subject, index) => (
              <li key={index} style={{ color: classColors[index % classColors.length] }}>
                {subject.class_name}
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
};

export default StudentClasses;