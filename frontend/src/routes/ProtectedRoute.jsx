import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-600">Loading...</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />
    if (user.role === 'pelamar') return <Navigate to="/pelamar/dashboard" replace />
    if (user.role === 'perusahaan') return <Navigate to="/company/dashboard" replace />
  }

  return children
}

export default ProtectedRoute