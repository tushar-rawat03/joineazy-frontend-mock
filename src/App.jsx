import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import ProfessorDashboard from './pages/ProfessorDashboard'
import StudentDashboard from './pages/StudentDashboard'
import CoursePage from './pages/CoursePage'
import { useAuth } from './context/AuthContext'

export default function App(){
  const { user } = useAuth()
  return (
    <Routes>
      <Route path="/" element={<Navigate to={user ? (user.role==='professor' ? '/professor' : '/student') : '/login'} />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/professor" element={user && user.role==='professor' ? <ProfessorDashboard /> : <Navigate to="/login" />} />
      <Route path="/student" element={user && user.role==='student' ? <StudentDashboard /> : <Navigate to="/login" />} />
      <Route path="/course/:id" element={user ? <CoursePage /> : <Navigate to="/login" />} />
    </Routes>
  )
}
