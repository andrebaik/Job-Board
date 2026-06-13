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
    <div className="min-h-screen bg-zinc-950 p-8">
      <div className="max-w-5xl mx-auto bg-zinc-900/70 border border-zinc-800 rounded-2xl p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-zinc-50">Daftar Lowongan</h1>
          <Link to="/" className="text-zinc-400 hover:text-zinc-50 transition-colors text-sm">← Beranda</Link>
        </div>

        {loading && <p className="text-zinc-500">Mengambil data lowongan...</p>}

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm">{error}</div>
        )}

        {!loading && !error && jobs.length === 0 && (
          <p className="text-zinc-500 text-center py-10">Belum ada lowongan.</p>
        )}

        {!loading && jobs.length > 0 && (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job.id} className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5 hover:bg-zinc-800/50 transition-colors">
                <h2 className="text-xl font-semibold text-zinc-50">{job.title}</h2>
                <p className="text-zinc-400 mt-1">{job.company_name || 'Perusahaan'}</p>
                <p className="text-sm text-zinc-500 mt-1">{job.location} • {job.job_type}</p>
                <Link to={`/jobs/${job.id}`} className="inline-block mt-4 px-4 py-2 bg-zinc-800 text-zinc-50 text-sm font-medium rounded-xl hover:bg-zinc-700 border border-zinc-700 transition-all active:scale-[0.97]">
                  Lihat Detail
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default JobsPage
