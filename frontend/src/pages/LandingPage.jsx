import { Link } from 'react-router-dom'

function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow">
        <h1 className="text-3xl font-bold text-indigo-600">
          Work'in
        </h1>
        <p className="mt-3 text-slate-600">
          Portal lowongan kerja berbasis web.
        </p>

        <div className="mt-6 flex gap-3">
          <Link to="/login" className="px-4 py-2 bg-indigo-600 text-white rounded-lg">
            Login
          </Link>
          <Link to="/register" className="px-4 py-2 border rounded-lg">
            Register
          </Link>
          <Link to="/jobs" className="px-4 py-2 border rounded-lg">
            Lowongan
          </Link>
        </div>
      </div>
    </div>
  )
}

export default LandingPage