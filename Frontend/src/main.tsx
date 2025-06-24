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
import AdminAllEnrolmentFormsPage from './pages/enrolment_form/AdminAllEnrolmentFormsPage.tsx'
import AdminEnrolmentFormPage from './pages/enrolment_form/AdminEnrolmentFormPage.tsx'
import ProtectedRoute from './ProtectedRoute.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <HomePage/> }/>
        <Route path="/login" element={ <LoginPage/> }/>
        <Route path="/signup" element={ <SignupPage/> }/>
        <Route path="/forms/enrolment" element={ <EnrolmentFormPage/> }/>

        <Route element={<ProtectedRoute/>}>
          <Route path="/admin" element={ <AdminDashboardPage/> }/>
          <Route path="/admin/forms/enrolments" element={ <AdminAllEnrolmentFormsPage/> }/>
          <Route path="/admin/forms/enrolments/:id" element={ <AdminEnrolmentFormPage/> }/>
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)

export const API_BACKEND_URL = import.meta.env.VITE_API_URL;
