# School Administration App

This project is a web-based school administration application built using React for the frontend, MySQL for the database, and XAMPP for local server management.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Pages](#pages)
- [Demo Video](#demo-video)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features

- User authentication and authorization (Admin, Teacher, Student)
- Student dashboard with assignment submissions, grades, and class enrollment
- Teacher dashboard with class management, assignment creation, and grading
- Admin dashboard for user management and class management
- Notifications system for assignments and class announcements
- Integrated calendar for tracking important dates
- Support for managing multiple classes and enrollments

## Technologies Used

- **Frontend**: React.js
- **Backend**: Node.js, Express.js (located in `school-management-backend`)
- **Database**: MySQL
- **Server**: Apache (via XAMPP)
- **Others**: HTML, CSS, JavaScript

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/en/download/)
- [XAMPP](https://www.apachefriends.org/index.html)
- MySQL (included with XAMPP)

### Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/school-admin-app.git
   cd school-admin-app
   ```

2. **Install frontend dependencies:**
   ```bash
   cd school-management
   npm install
   ```

3. **Install backend dependencies:**
   ```bash
   cd ../school-management-backend
   npm install
   ```

4. **Set up XAMPP:**
   - Install and open XAMPP.
   - Start Apache and MySQL services.

5. **Configure MySQL:**
   - Access phpMyAdmin via `http://localhost/phpmyadmin/`.
   - Create a database named `school_admin_db`.
   - Import the provided SQL file (`school_admin_db.sql`) to set up the tables.

6. **Configure the backend API:**
   - Ensure the database connection details in `server.js` match your local setup.

## Database Setup

Your database should have the following tables:

- **users**: Stores user information (admins, teachers, students).
- **students**: Stores student-specific information.
- **teachers**: Stores teacher-specific information.
- **classes**: Manages classes available in the school.
- **enrollments**: Tracks which students are enrolled in which classes.
- **assignments**: Stores assignment details.
- **submissions**: Tracks student submissions for assignments.

### Sample SQL for Table Creation

Here's a basic SQL snippet to create the `users` table:

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'teacher', 'student') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Running the Application

### Start the Backend

```bash
cd school-management-backend
node server.js
```

This command will start the Express server for the backend API on port 3001.

### Start the Frontend

```bash
cd ../school-management
npm start
```

This command will start the React development server on port 3000. Open http://localhost:3000 to view the app in your browser.

## Project Structure

```
school-admin-app/
├── school-management/
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.css
│   │   │   ├── Login.js
│   │   │   ├── Register.css
│   │   │   ├── Register.js
│   │   │   ├── StudentHome.css
│   │   │   ├── StudentHome.js
│   │   │   ├── Assignments.css
│   │   │   ├── Assignments.js
│   │   │   ├── ClassEnrollment.css
│   │   │   ├── ClassEnrollment.js
│   │   │   ├── Grades.css
│   │   │   ├── Grades.js
│   │   │   ├── Profile.css
│   │   │   ├── Profile.js
│   │   │   ├── TeacherDashboard.css
│   │   │   ├── TeacherDashboard.js
│   │   │   ├── ClassManagement.css
│   │   │   ├── ClassManagement.js
│   │   │   ├── AssignmentManagement.css
│   │   │   ├── AssignmentManagement.js
│   │   │   ├── Gradebook.css
│   │   │   ├── Gradebook.js
│   │   │   ├── AdminDashboard.css
│   │   │   ├── AdminDashboard.js
│   │   │   ├── UserManagement.css
│   │   │   ├── UserManagement.js
│   │   │   ├── EnrollmentManagement.css
│   │   │   ├── EnrollmentManagement.js
│   ├── App.css
│   ├── App.js
│   ├── App.test.js
│   ├── index.css
│   ├── index.js
│   ├── logo.svg
│   ├── reportWebVitals.js
│   ├── setupTests.js
│   ├── .gitignore
│   ├── package-lock.json
│   ├── package.json
│   └── README.md
├── school-management-backend/
│   ├── node_modules/
│   ├── package-lock.json
│   ├── package.json
│   └── server.js
└── README.md
```

## Pages

### Frontend (React):

- **Login** (`Login.js`, `Login.css`): User authentication page.
- **Register** (`Register.js`, `Register.css`): User registration page.
- **StudentHome** (`StudentHome.js`, `StudentHome.css`): Student dashboard page showing enrolled classes, assignments, and grades.

### Backend (Express):

- **server.js**: Backend server handling API requests and database interactions.

### Pages for Students:

- **Assignments Page**:
  - View assignments.
  - Submit work (linked to `submissions` table).
  - View grades and feedback on submissions.
  
- **Class Enrollment**:
  - View and enroll in available classes (linked to `classes` and `enrollments` tables).
  
- **Grades**:
  - A page to view grades for all assignments across different classes.
  
- **Profile Page**:
  - Manage personal information and settings.

### Pages for Teachers:

- **Teacher Dashboard**:
  - Overview of classes they are teaching, assignments pending for grading, and recent student activity.
  
- **Class Management**:
  - Create and manage classes (linked to `classes` table).
  - View class rosters (linked to `students` and `enrollments` tables).
  
- **Assignment Management**:
  - Create, edit, and delete assignments (linked to `assignments` table).
  - View and grade student submissions (linked to `submissions` table).
  
- **Gradebook**:
  - Manage and enter grades for students (linked to `students` and `submissions` tables).

### Pages for Admins:

- **Admin Dashboard**:
  - Overview of user activity, total enrollments, and system statistics.
  
- **User Management**:
  - Add, edit, or remove users (linked to `users`, `students`, and `teachers` tables).
  - Assign roles to users.
  
- **Class Management**:
  - Oversee all classes, including the ability to add, edit, or remove classes.
  
- **Enrollment Management**:
  - Manage enrollments across all classes (linked to `enrollments` table).

## Demo Video

[Link to demo video here]

## Usage

1. **Sign up** as an admin, teacher, or student.
2. **Login** to access the appropriate dashboard based on your role.
3. **Admin** can manage users and classes.
4. **Teachers** can create classes, assignments, and grade student submissions.
5. **Students** can enroll in classes,

 submit assignments, and view grades.

## Contributing

Contributions are welcome! Please fork this repository, create a feature branch, and submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
