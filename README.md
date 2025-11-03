# 🎓 Student Assignment Management System

A clean, responsive **Student Assignment Management Dashboard** built with **React + Tailwind CSS**.  
The app provides role-based functionality for **Students** and **Admins (Professors)** to manage and track assignment submissions efficiently.

---

## 🚀 Live Demo
https://student-assignment-management.netlify.app/ 
---

## 🧩 Tech Stack
| Category | Technology |
|-----------|-------------|
| **Frontend** | React (Vite) |
| **Styling** | Tailwind CSS |
| **State Management** | React Hooks + Context API |
| **Data Storage** | Browser LocalStorage (simulated backend) |

---

## 🧠 Overview

This project simulates a real-world assignment management portal with **role-based dashboards**:

- 👨‍🎓 **Student View**
  - View list of assigned tasks
  - Mark assignments as submitted via double-confirmation
  - Track submission progress

- 👩‍🏫 **Admin (Professor) View**
  - Create new assignments
  - Attach Google Drive links for external submissions
  - Track submission progress with progress bars
  - View which students have/haven’t submitted

Each user sees **only their own data** using mock authentication (via Context API).

---

## 🧭 Architecture Overview

src/
 ├── components/
 │    ├── Navbar.jsx
 │    ├── ProgressBar.jsx
 │    ├── ConfirmationModal.jsx
 │    └── AssignmentCard.jsx
 │
 ├── pages/
 │    ├── StudentDashboard.jsx
 │    ├── AdminDashboard.jsx
 │    └── AssignmentDetail.jsx
 │
 ├── hooks/
 │    └── useAssignments.js
 │
 ├── context/
 │    └── AuthContext.jsx
 │
 ├── utils/
 │    └── storage.js
 │
 ├── App.jsx
 └── main.jsx

**Data Flow:**
Admin creates assignment → Data saved to localStorage
Student views data → Confirms submission
Admin sees updated submission progress dynamically


---

## 🧰 Project Setup Instructions

### 🔧 Installation
```bash
# Clone this repository
git clone https://github.com/your-username/student-assignment-system.git

# Go to the project directory
cd student-assignment-system

# Install dependencies
npm install
