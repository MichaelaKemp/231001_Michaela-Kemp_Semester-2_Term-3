const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

// MySQL database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'micky', // Your MySQL username
  password: 'password', // Your MySQL password
  database: 'school_management',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database');
});

// Login route
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
  db.query(query, [email, password], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (results.length > 0) {
      res.json({ success: true, message: 'Login successful', user: results[0] });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  });
});

// Registration route with handling for students and teachers
app.post('/api/register', (req, res) => {
  const { username, email, password, role, first_name, last_name, date_of_birth, guardian_name, guardian_contact, grade_level } = req.body;

  const userQuery = 'INSERT INTO users (username, email, password, role, first_name, last_name, date_of_birth, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())';

  db.query(userQuery, [username, email, password, role, first_name, last_name, date_of_birth], (err, results) => {
    if (err) {
      console.error('Error executing user query:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    const userId = results.insertId;

    if (role.toLowerCase() === 'teacher') {
      // Insert into teachers table if the role is 'teacher'
      const teacherQuery = 'INSERT INTO teachers (user_id, subject, department, class, grade) VALUES (?, ?, ?, ?, ?)';
      const subject = `${first_name}'s Subject`;  // Example subject, you can modify this as needed
      const department = `${last_name}'s Department`;  // Example department, you can modify this as needed

      db.query(teacherQuery, [userId, subject, department, 'Some Class', grade_level], (err, teacherResults) => {
        if (err) {
          console.error('Error inserting into teachers table:', err);
          return res.status(500).json({ error: 'Internal server error' });
        }

        res.json({ success: true, message: 'Teacher registration successful', userId });
      });
    } else if (role.toLowerCase() === 'student') {
      // Insert into students table if the role is 'student'
      const studentQuery = 'INSERT INTO students (user_id, student_id, grade_level, guardian_name, guardian_contact) VALUES (?, ?, ?, ?, ?)';
      db.query(studentQuery, [userId, `S${userId}`, grade_level, guardian_name, guardian_contact], (err, studentResults) => {
        if (err) {
          console.error('Error inserting into students table:', err);
          return res.status(500).json({ error: 'Internal server error' });
        }

        const newStudentId = studentResults.insertId; // Use the correct student ID from the `students` table

        // Fetch all classes for the student's grade level
        const classQuery = `
          SELECT id AS class_id FROM classes WHERE grade = ?`;

        db.query(classQuery, [grade_level], (err, classes) => {
          if (err) {
            console.error('Error fetching classes for grade level:', err);
            return res.status(500).json({ error: 'Internal server error' });
          }

          if (classes.length > 0) {
            const enrollments = classes.map(c => [newStudentId, c.class_id]);

            const insertEnrollmentQuery = 'INSERT INTO enrollments (student_id, class_id) VALUES ?';
            db.query(insertEnrollmentQuery, [enrollments], (err, enrollmentResults) => {
              if (err) {
                console.error('Error enrolling student in classes:', err);
                return res.status(500).json({ error: 'Internal server error during enrollment.' });
              }

              res.json({ success: true, message: 'Student registration and enrollment successful', userId });
            });
          } else {
            res.status(400).json({ success: false, message: 'No classes found for the selected grade level' });
          }
        });
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid role provided' });
    }
  });
});

// Fetch student home data (classes and assignments)
app.get('/api/studenthome/:id', (req, res) => {
  const studentId = req.params.id;

  const studentQuery = `SELECT * FROM students WHERE user_id = ?`;
  db.query(studentQuery, [studentId], (err, studentResults) => {
    if (err) {
      console.error('Error fetching student data:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (studentResults.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const classQuery = `SELECT c.id AS class_id, c.class_name, u.first_name, u.last_name 
                        FROM classes c 
                        JOIN enrollments e ON e.class_id = c.id 
                        JOIN teachers t ON t.id = c.teacher_id 
                        JOIN users u ON t.user_id = u.id
                        WHERE e.student_id = ?`;

    db.query(classQuery, [studentResults[0].id], (err, classResults) => {
      if (err) {
        console.error('Error fetching classes:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      res.json({
        student: studentResults[0],
        classes: classResults,
      });
    });
  });
});

// Fetch assignments for a student
app.get('/api/assignments', (req, res) => {
  const assignmentQuery = 'SELECT * FROM assignments WHERE class_id = ?';
  db.query(assignmentQuery, [classId], (err, results) => {
    if (err) {
      console.error('Error fetching assignments:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json(results.length ? results : []); // Ensure an array is always returned
  });
});

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client', 'build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});