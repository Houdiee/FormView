import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Route } from 'react-router'
import { Routes } from 'react-router'
import LoginPage from './pages/LoginPage.tsx'
import SignupPage from './pages/SignupPage.tsx'
import EnrolmentFormPage from './pages/EnrolmentFormPage.tsx'
import HomePage from './pages/HomePage.tsx'
import AdminDashboardPage from './pages/AdminDashboardPage.tsx'
import AdminEnrolmentFormPage from './pages/AdminEnrolmentFormPage.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <HomePage/> }/>
        <Route path="/admin" element={ <AdminDashboardPage/> }/>
        <Route path="/admin/forms/enrolment" element={ <AdminEnrolmentFormPage/> }/>
        <Route path="/login" element={ <LoginPage/> }/>
        <Route path="/signup" element={ <SignupPage/> }/>
        <Route path="/forms/enrolment" element={ <EnrolmentFormPage/> }/>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)

export const API_BACKEND_URL = import.meta.env.VITE_API_URL;
