import { Link } from 'react-router-dom'

function JobsPage() {
  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow">
        <h1 className="text-3xl font-bold text-slate-900">
          Daftar Lowongan
        </h1>

        <div className="mt-6 border rounded-xl p-5">
          <h2 className="text-xl font-semibold">Frontend Developer</h2>
          <p className="text-slate-600 mt-2">PT Digital Nusantara</p>

          <Link
            to="/jobs/1"
            className="inline-block mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg"
          >
            Lihat Detail
          </Link>
        </div>
      </div>
    </div>
  )
}

export default JobsPage