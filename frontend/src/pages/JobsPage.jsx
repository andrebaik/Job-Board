import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'

function JobsPage() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadJobs = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await api.get('/jobs')
      setJobs(response.data.data || [])
    } catch (error) {
      setError(error.response?.data?.message || 'Gagal mengambil lowongan')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadJobs()
  }, [])

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow">
        <h1 className="text-3xl font-bold text-slate-900">
          Daftar Lowongan
        </h1>

        {loading && (
          <p className="mt-6 text-slate-500">Mengambil data lowongan...</p>
        )}

        {error && (
          <div className="mt-6 bg-red-50 text-red-600 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {!loading && !error && jobs.length === 0 && (
          <p className="mt-6 text-slate-500">
            Belum ada lowongan.
          </p>
        )}

        <div className="mt-6 space-y-4">
          {jobs.map((job) => (
            <div key={job.id} className="border rounded-xl p-5">
              <h2 className="text-xl font-semibold text-slate-900">
                {job.title}
              </h2>

              <p className="text-slate-600 mt-2">
                {job.company_name || 'Perusahaan'}
              </p>

              <p className="text-sm text-slate-500 mt-1">
                {job.location} • {job.job_type}
              </p>

              <Link
                to={`/jobs/${job.id}`}
                className="inline-block mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg"
              >
                Lihat Detail
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default JobsPage