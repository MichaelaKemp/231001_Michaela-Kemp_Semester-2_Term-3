const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');

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

// Multer setup for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Directory where files will be stored
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Rename the file with a timestamp to avoid conflicts
  }
});

const upload = multer({ storage: storage });

// Submit assignment route
app.post('/api/submit', upload.single('file'), (req, res) => {
  const { studentId, assignmentId } = req.body;
  const filePath = req.file.path;

  // First, remove the assignment from the assignments table
  const removeAssignmentQuery = `DELETE FROM assignments WHERE id = ?`;

  db.query(removeAssignmentQuery, [assignmentId], (err, results) => {
    if (err) {
      console.error('Error removing assignment:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    // Then, add the submission to the submissions table
    const addSubmissionQuery = `
      INSERT INTO submissions (assignment_id, student_id, submission_date, grade, feedback, file)
      VALUES (?, ?, NOW(), '', '', ?)
    `;

    db.query(addSubmissionQuery, [assignmentId, studentId, filePath], (err, submissionResults) => {
      if (err) {
        console.error('Error adding submission:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      res.json({ success: true, message: 'Assignment submitted successfully' });
    });
  });
});

// Add a new assignment
app.post('/api/assignments', (req, res) => {
  const { title, description, due_date, class_id } = req.body;
  
  const addAssignmentQuery = `
    INSERT INTO assignments (title, description, due_date, class_id, created_at, is_submitted)
    VALUES (?, ?, ?, ?, NOW(), 0)
  `;
  
  db.query(addAssignmentQuery, [title, description, due_date, class_id], (err, results) => {
    if (err) {
      console.error('Error adding assignment:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json({ success: true, message: 'Assignment added successfully', assignmentId: results.insertId });
  });
});

// Edit an assignment
app.put('/api/assignments/:id', (req, res) => {
  const assignmentId = req.params.id;
  const { title, description, due_date } = req.body;

  const updateAssignmentQuery = `
    UPDATE assignments
    SET title = ?, description = ?, due_date = ?
    WHERE id = ?
  `;

  db.query(updateAssignmentQuery, [title, description, due_date, assignmentId], (err, results) => {
    if (err) {
      console.error('Error updating assignment:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json({ success: true, message: 'Assignment updated successfully' });
  });
});

// Delete an assignment
app.delete('/api/assignments/:id', (req, res) => {
  const assignmentId = req.params.id;

  const deleteAssignmentQuery = `DELETE FROM assignments WHERE id = ?`;

  db.query(deleteAssignmentQuery, [assignmentId], (err, results) => {
    if (err) {
      console.error('Error deleting assignment:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json({ success: true, message: 'Assignment deleted successfully' });
  });
});

// Update grade and feedback for a submission
app.put('/api/submissions/:id', (req, res) => {
  const submissionId = req.params.id;
  const { grade, feedback } = req.body;

  const updateSubmissionQuery = `
    UPDATE submissions
    SET grade = ?, feedback = ?
    WHERE id = ?
  `;

  db.query(updateSubmissionQuery, [grade, feedback, submissionId], (err, results) => {
    if (err) {
      console.error('Error updating submission:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json({ success: true, message: 'Submission updated successfully' });
  });
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

    const classQuery = `
      SELECT 
        c.id AS class_id, 
        c.class_name, 
        u.first_name, 
        u.last_name, 
        c.start_time, 
        c.end_time
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
app.get('/api/assignments/:studentId', (req, res) => {
  const userId = req.params.studentId;

  // First, get the corresponding student ID from the user ID
  const getStudentIdQuery = `
    SELECT id FROM students WHERE user_id = ?
  `;

  db.query(getStudentIdQuery, [userId], (err, studentResults) => {
    if (err) {
      console.error('Error fetching student ID:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (studentResults.length === 0) {
      console.log('No student found for this user ID.');
      return res.status(404).json({ error: 'Student not found' });
    }

    const studentId = studentResults[0].id;
    const currentDate = new Date();

    console.log(`Fetching assignments for student ID: ${studentId}`);
    console.log(`Current Date: ${currentDate}`);

    // Fetch both upcoming/overdue assignments and past (submitted) assignments
    const assignmentQuery = `
      SELECT a.id, a.title, a.description, a.due_date, c.class_name, IFNULL(s.id, 0) AS submitted
      FROM assignments a
      JOIN classes c ON a.class_id = c.id
      JOIN enrollments e ON e.class_id = c.id
      LEFT JOIN submissions s ON a.id = s.assignment_id AND s.student_id = ?
      WHERE e.student_id = ?
      ORDER BY a.due_date ASC
    `;

    db.query(assignmentQuery, [studentId, studentId], (err, results) => {
      if (err) {
        console.error('Error fetching assignments:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      const overdue = [];
      const comingUp = [];
      const past = [];

      results.forEach(assignment => {
        const dueDate = new Date(assignment.due_date);
        const dueDateWithoutTime = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
        const currentDateWithoutTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

        if (assignment.submitted) {
          // If the assignment has been submitted, add it to the "Past" section
          past.push(assignment);
        } else {
          if (dueDateWithoutTime < currentDateWithoutTime) {
            overdue.push(assignment);
          } else if (dueDateWithoutTime > currentDateWithoutTime) {
            comingUp.push(assignment);
          }
        }
      });

      res.json({
        overdue,
        comingUp,
        past
      });
    });
  });
});

// Fetch grades for a student
app.get('/api/grades/:studentId', (req, res) => {
  const userId = req.params.studentId;

  // Get the student ID from the user ID
  const getStudentIdQuery = `
    SELECT id FROM students WHERE user_id = ?
  `;

  db.query(getStudentIdQuery, [userId], (err, studentResults) => {
    if (err) {
      console.error('Error fetching student ID:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (studentResults.length === 0) {
      console.log('No student found for this user ID.');
      return res.status(404).json({ error: 'Student not found' });
    }

    const studentId = studentResults[0].id;

    // Fetch grades and feedback for all submitted assignments
    const gradesQuery = `
      SELECT c.class_name AS subject, a.title AS assignment_name, s.grade, s.feedback
      FROM submissions s
      JOIN assignments a ON s.assignment_id = a.id
      JOIN classes c ON a.class_id = c.id
      WHERE s.student_id = ?
      ORDER BY c.class_name ASC, a.title ASC
    `;

    db.query(gradesQuery, [studentId], (err, results) => {
      if (err) {
        console.error('Error fetching grades:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      res.json(results);
    });
  });
});

// Fetch teacher's class information, students, assignments, and submissions
app.get('/api/teacher/class/:userId', (req, res) => {
  const userId = req.params.userId;

  // First, find the teacher's record using user_id
  const teacherQuery = `
      SELECT t.id AS teacher_id FROM teachers t WHERE t.user_id = ?
  `;

  db.query(teacherQuery, [userId], (err, teacherResults) => {
    if (err) {
      console.error('Error fetching teacher data:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (teacherResults.length === 0) {
      console.log('No teacher found for this user.');
      return res.status(404).json({ error: 'Teacher not found for this user' });
    }

    const teacherId = teacherResults[0].teacher_id;

    // Now fetch the class information using the teacher_id
    const classQuery = `
        SELECT c.id AS class_id, c.class_name, c.start_time, c.end_time, t.subject
        FROM classes c
        JOIN teachers t ON c.teacher_id = t.id
        WHERE c.teacher_id = ?
    `;

    db.query(classQuery, [teacherId], (err, classResults) => {
      if (err) {
        console.error('Error fetching class data:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      if (classResults.length === 0) {
        console.log('No class found for this teacher.');
        return res.status(404).json({ error: 'Class not found for this teacher' });
      }

      const classId = classResults[0].class_id;

      // Fetch the students enrolled in this class
      const studentsQuery = `
          SELECT s.id AS student_id, u.first_name, u.last_name
          FROM enrollments e
          JOIN students s ON e.student_id = s.id
          JOIN users u ON s.user_id = u.id
          WHERE e.class_id = ?
      `;

      db.query(studentsQuery, [classId], (err, studentResults) => {
        if (err) {
          console.error('Error fetching students:', err);
          return res.status(500).json({ error: 'Internal server error' });
        }

        // Fetch assignments for this class
        const assignmentsQuery = `
            SELECT DISTINCT a.id AS assignment_id, a.title, a.description, a.due_date
            FROM assignments a
            WHERE a.class_id = ?
        `;

        db.query(assignmentsQuery, [classId], (err, assignmentResults) => {
          if (err) {
            console.error('Error fetching assignments:', err);
            return res.status(500).json({ error: 'Internal server error' });
          }

          // Fetch submissions for this class
          const submissionsQuery = `
              SELECT s.id AS submission_id, s.assignment_id, s.student_id, s.submission_date, 
                     s.grade, s.feedback, s.file, a.title AS assignment_title,
                     CONCAT(u.first_name, ' ', u.last_name) AS student_name
              FROM submissions s
              JOIN assignments a ON s.assignment_id = a.id
              JOIN students st ON s.student_id = st.id
              JOIN users u ON st.user_id = u.id
              WHERE a.class_id = ?
          `;

          db.query(submissionsQuery, [classId], (err, submissionResults) => {
            if (err) {
              console.error('Error fetching submissions:', err);
              return res.status(500).json({ error: 'Internal server error' });
            }

            res.json({
              classInfo: classResults[0],
              students: studentResults,
              assignments: assignmentResults,
              submissions: submissionResults,
            });
          });
        });
      });
    });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});