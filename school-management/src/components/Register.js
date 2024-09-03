import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Student');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [guardianName, setGuardianName] = useState('');
  const [guardianContact, setGuardianContact] = useState('');
  const [grade, setGrade] = useState('');
  const [subject, setSubject] = useState('');
  const [loading, setLoading] = useState(false); // Loading state
  const [errorMessage, setErrorMessage] = useState(''); // Error message state
  const navigate = useNavigate();

  const subjectsByGrade = {
    1: ['Languages', 'Mathematics', 'Life Skills'],
    2: ['Languages', 'Mathematics', 'Life Skills'],
    3: ['Languages', 'Mathematics', 'Life Skills'],
    4: ['English (Home Language)', 'Afrikaans (First Additional Language)', 'Mathematics', 'Natural Science and Technology', 'Social Sciences (History and Geography)', 'Life Skills'],
    5: ['English (Home Language)', 'Afrikaans (First Additional Language)', 'Mathematics', 'Natural Science and Technology', 'Social Sciences (History and Geography)', 'Life Skills'],
    6: ['English (Home Language)', 'Afrikaans (First Additional Language)', 'Mathematics', 'Natural Science and Technology', 'Social Sciences (History and Geography)', 'Life Skills'],
    7: ['English (Home Language)', 'Afrikaans or isiZulu (First Additional Language)', 'Mathematics', 'Economic and Management Sciences (EMS)', 'Natural Science', 'Social Sciences (History and Geography)', 'Life Orientation', 'Technology', 'Creative Arts (Music, Art, Drama)']
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !email || !password || !firstName || !lastName || !dateOfBirth || (role === 'Student' && (!guardianName || !guardianContact)) || (role !== 'Admin' && !grade) || (role === 'Teacher' && !subject)) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('http://localhost:3001/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
          role,
          first_name: firstName,
          last_name: lastName,
          date_of_birth: dateOfBirth,
          guardian_name: role === 'Student' ? guardianName : null,
          guardian_contact: role === 'Student' ? guardianContact : null,
          grade_level: grade,
          subject: role === 'Teacher' ? subject : null,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert('Registration successful');
        if (role === 'Teacher') {
          navigate(`/teacher-dashboard/${data.userId}`);
        } else {
          navigate(`/studenthome/${data.userId}`);
        }
      } else {
        setErrorMessage(data.message);
      }
    } catch (error) {
      console.error('Error during registration:', error);
      setErrorMessage('An error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Create an Account</h2>
        <form onSubmit={handleSubmit}>
          {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Display error messages */}
          <div className="input-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Email address</label>
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="Admin">Admin</option>
              <option value="Teacher">Teacher</option>
              <option value="Student">Student</option>
            </select>
          </div>

          <div className="inline-group">
            <div className="input-group input-half">
              <label>First Name</label>
              <input
                type="text"
                placeholder="Enter first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            <div className="input-group input-half">
              <label>Last Name</label>
              <input
                type="text"
                placeholder="Enter last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          <div className="input-group">
            <label>Date of Birth</label>
            <input
              type="date"
              placeholder="Enter date of birth"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
            />
          </div>

          {role === 'Student' && (
            <>
              <div className="input-group">
                <label>Guardian Name</label>
                <input
                  type="text"
                  placeholder="Enter guardian name"
                  value={guardianName}
                  onChange={(e) => setGuardianName(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label>Guardian Contact</label>
                <input
                  type="text"
                  placeholder="Enter guardian contact"
                  value={guardianContact}
                  onChange={(e) => setGuardianContact(e.target.value)}
                />
              </div>
            </>
          )}

          {(role === 'Student' || role === 'Teacher') && (
            <div className="input-group">
              <label>Grade Level</label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
              >
                <option value="">Select Grade</option>
                <option value="1">Grade 1</option>
                <option value="2">Grade 2</option>
                <option value="3">Grade 3</option>
                <option value="4">Grade 4</option>
                <option value="5">Grade 5</option>
                <option value="6">Grade 6</option>
                <option value="7">Grade 7</option>
              </select>
            </div>
          )}

          {role === 'Teacher' && grade && (
            <div className="input-group">
              <label>Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              >
                <option value="">Select Subject</option>
                {subjectsByGrade[grade].map((subj) => (
                  <option key={subj} value={subj}>{subj}</option>
                ))}
              </select>
            </div>
          )}

          <button type="submit" className="register-button" disabled={loading}>
            {loading ? 'Registering...' : 'Register'} {/* Display loading state */}
          </button>
        </form>
        <p className="login-link">
          Already have an account? <Link to="/login">Log in here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;