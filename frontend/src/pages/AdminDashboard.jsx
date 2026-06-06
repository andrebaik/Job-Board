import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

function AdminDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">
          Dashboard Admin
        </h1>

        <p className="mt-2 text-slate-600">
          Selamat datang, {user?.name}
        </p>

        <button
          onClick={handleLogout}
          className="mt-6 px-5 py-2 rounded-lg bg-red-600 text-white"
        >
          Logout
        </button>
      </div>
    </div>
  )
}

export default AdminDashboard