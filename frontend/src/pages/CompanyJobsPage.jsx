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
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-2xl shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Kelola Lowongan
            </h1>
            <p className="mt-2 text-slate-600">
              Kelola lowongan pekerjaan perusahaan Anda
            </p>
          </div>
          <Link
            to="/company/jobs/create"
            className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Tambah Lowongan
          </Link>
        </div>

        {loading && (
          <p className="mt-6 text-slate-500">Mengambil data lowongan...</p>
        )}

        {error && (
          <div className="mt-6 bg-red-50 text-red-600 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {!loading && !error && jobs.length === 0 && (
          <div className="mt-8 text-center py-12">
            <p className="text-slate-500 mb-4">Belum ada lowongan.</p>
            <Link
              to="/company/jobs/create"
              className="inline-block px-5 py-2 bg-indigo-600 text-white rounded-lg"
            >
              Buat Lowongan Pertama
            </Link>
          </div>
        )}

        {!loading && !error && jobs.length > 0 && (
          <div className="mt-6 space-y-4">
            {jobs.map((job) => (
              <div key={job.id} className="border rounded-xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900">
                    {job.title}
                  </h3>
                  <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-500">
                    <span>{job.category || 'Tidak ada kategori'}</span>
                    <span>{job.location}</span>
                    <span>{job.job_type}</span>
                    <span>
                      {job.salary_min || job.salary_max ? (
                        `Rp${job.salary_min || 0} - Rp${job.salary_max || 0}`
                      ) : (
                        'Gaji tidak ditampilkan'
                      )}
                    </span>
                    <span>Deadline: {job.deadline ? new Date(job.deadline).toLocaleDateString('id-ID') : '-'}</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        job.status === 'open'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {job.status === 'open' ? 'Dibuka' : 'Ditutup'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    to={`/company/jobs/${job.id}/edit`}
                    className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 text-sm"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(job.id)}
                    className="px-4 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 text-sm"
                  >
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