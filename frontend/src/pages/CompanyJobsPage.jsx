import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'

function CompanyJobsPage() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadJobs = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await api.get('/jobs/company/my-jobs')
      setJobs(response.data.data || [])
    } catch (error) {
      setError(error.response?.data?.message || 'Gagal mengambil lowongan perusahaan')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus lowongan ini?')) return
    try {
      await api.delete(`/jobs/${id}`)
      setJobs(jobs.filter((job) => job.id !== id))
    } catch (error) {
      alert(error.response?.data?.message || 'Gagal menghapus lowongan')
    }
  }

  useEffect(() => {
    loadJobs()
  }, [])

  return (
    <div className="min-h-screen bg-zinc-950 p-8">
      <div className="max-w-6xl mx-auto bg-zinc-900/70 border border-zinc-800 rounded-2xl p-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-zinc-50">Kelola Lowongan</h1>
            <p className="mt-2 text-zinc-400">Kelola lowongan pekerjaan perusahaan Anda</p>
          </div>
          <Link to="/company/jobs/create" className="px-5 py-2 rounded-xl bg-zinc-50 text-zinc-950 text-sm font-medium hover:bg-zinc-200 transition-all active:scale-[0.97]">
            Tambah Lowongan
          </Link>
        </div>

        {loading && <p className="mt-6 text-zinc-500">Mengambil data lowongan...</p>}

        {error && (
          <div className="mt-6 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm">{error}</div>
        )}

        {!loading && !error && jobs.length === 0 && (
          <div className="mt-8 text-center py-12">
            <p className="text-zinc-500 mb-4">Belum ada lowongan.</p>
            <Link to="/company/jobs/create" className="inline-block px-5 py-2 rounded-xl bg-zinc-50 text-zinc-950 text-sm font-medium hover:bg-zinc-200 transition-all">
              Buat Lowongan Pertama
            </Link>
          </div>
        )}

        {!loading && !error && jobs.length > 0 && (
          <div className="mt-6 space-y-4">
            {jobs.map((job) => (
              <div key={job.id} className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:bg-zinc-800/50 transition-colors">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-zinc-50">{job.title}</h3>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-zinc-500">
                    <span>{job.category || 'Tidak ada kategori'}</span>
                    <span>{job.location}</span>
                    <span>{job.job_type}</span>
                    <span>
                      {job.salary_min || job.salary_max
                        ? `Rp${job.salary_min || 0} - Rp${job.salary_max || 0}`
                        : 'Gaji tidak ditampilkan'}
                    </span>
                    <span>Deadline: {job.deadline ? new Date(job.deadline).toLocaleDateString('id-ID') : '-'}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      job.status === 'open'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-red-500/10 text-red-400'
                    }`}>
                      {job.status === 'open' ? 'Dibuka' : 'Ditutup'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link to={`/company/jobs/${job.id}/edit`} className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700 text-sm font-medium transition-all">
                    Edit
                  </Link>
                  <button onClick={() => handleDelete(job.id)} className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 text-sm font-medium transition-all">
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default CompanyJobsPage
