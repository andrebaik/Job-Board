import { BrowserRouter, Routes, Route } from 'react-router-dom'

import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import JobsPage from './pages/JobsPage'
import JobDetailPage from './pages/JobDetailPage'

import AdminDashboard from './pages/AdminDashboard'
import PelamarDashboard from './pages/PelamarDashboard'
import CompanyDashboard from './pages/CompanyDashboard'

import ProtectedRoute from './routes/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/jobs/:id" element={<JobDetailPage />} />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/pelamar/dashboard"
          element={
            <ProtectedRoute allowedRoles={['pelamar']}>
              <PelamarDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/company/dashboard"
          element={
            <ProtectedRoute allowedRoles={['perusahaan']}>
              <CompanyDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App