import { Link, useParams } from 'react-router-dom'

function JobDetailPage() {
  const { id } = useParams()

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow">
        <Link to="/jobs" className="text-indigo-600">
          ← Kembali
        </Link>

        <p className="mt-5 text-sm text-slate-500">
          ID Lowongan: {id}
        </p>

        <h1 className="mt-3 text-3xl font-bold text-slate-900">
          Frontend Developer
        </h1>

        <p className="mt-3 text-slate-600">
          Detail lowongan kerja akan ditampilkan di sini.
        </p>

        <button className="mt-6 px-5 py-2 bg-indigo-600 text-white rounded-lg">
          Lamar Sekarang
        </button>
      </div>
    </div>
  )
}

export default JobDetailPage