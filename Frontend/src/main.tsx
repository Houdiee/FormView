import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Route } from 'react-router'
import { Routes } from 'react-router'
import LoginPage from './pages/LoginPage.tsx'
import SignupPage from './pages/SignupPage.tsx'
import EnrolmentFormPage from './pages/EnrolmentFormPage.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/forms/enrolmentform" element={ <EnrolmentFormPage/> }/>
        <Route path="/login" element={ <LoginPage/> }/>
        <Route path="/signup" element={ <SignupPage/> }/>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)

export const API_BACKEND_URL = import.meta.env.VITE_API_URL;
