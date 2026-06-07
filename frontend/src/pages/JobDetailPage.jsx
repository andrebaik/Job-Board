import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api/client'
import { useAuth } from '../context/AuthContext'

function JobDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()

  const [job, setJob] = useState(null)
  const [coverLetter, setCoverLetter] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const loadJob = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await api.get(`/jobs/${id}`)
      setJob(response.data.data)
    } catch (error) {
      setError(error.response?.data?.message || 'Gagal mengambil detail lowongan')
    } finally {
      setLoading(false)
    }
  }

  const handleApply = async (e) => {
    e.preventDefault()

    try {
      setSubmitLoading(true)
      setError('')
      setSuccess('')

      await api.post(`/applications/${id}`, {
        cover_letter: coverLetter,
      })

      setSuccess('Lamaran berhasil dikirim.')
      setCoverLetter('')
    } catch (error) {
      setError(error.response?.data?.message || 'Gagal mengirim lamaran')
    } finally {
      setSubmitLoading(false)
    }
  }

  useEffect(() => {
    loadJob()
  }, [id])

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow">
        <Link to="/jobs" className="text-indigo-600">
          ← Kembali
        </Link>

        {loading && (
          <p className="mt-6 text-slate-500">Mengambil detail lowongan...</p>
        )}

        {error && (
          <div className="mt-6 bg-red-50 text-red-600 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-6 bg-green-50 text-green-600 px-4 py-3 rounded-xl">
            {success}
          </div>
        )}

        {!loading && job && (
          <>
            <p className="mt-5 text-sm text-slate-500">
              {job.company_name} • {job.location}
            </p>

            <h1 className="mt-3 text-3xl font-bold text-slate-900">
              {job.title}
            </h1>

            <p className="mt-3 text-slate-600">
              Tipe: {job.job_type}
            </p>

            <p className="mt-2 text-slate-600">
              Gaji: Rp{job.salary_min || 0} - Rp{job.salary_max || 0}
            </p>

            <div className="mt-6">
              <h2 className="font-bold text-slate-900">Deskripsi</h2>
              <p className="mt-2 text-slate-600 whitespace-pre-line">
                {job.description}
              </p>
            </div>

            <div className="mt-6">
              <h2 className="font-bold text-slate-900">Persyaratan</h2>
              <p className="mt-2 text-slate-600 whitespace-pre-line">
                {job.requirements}
              </p>
            </div>

            {user?.role === 'pelamar' && (
              <form onSubmit={handleApply} className="mt-8">
                <label className="block text-sm font-medium text-slate-700">
                  Cover Letter
                </label>

                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows="5"
                  className="mt-2 w-full px-4 py-3 border rounded-xl outline-none"
                  placeholder="Tulis alasan kamu melamar..."
                />

                <button
                  type="submit"
                  disabled={submitLoading}
                  className="mt-4 px-5 py-2 bg-indigo-600 text-white rounded-lg disabled:bg-indigo-300"
                >
                  {submitLoading ? 'Mengirim...' : 'Lamar Sekarang'}
                </button>
              </form>
            )}

            {!user && (
              <Link
                to="/login"
                className="inline-block mt-8 px-5 py-2 bg-indigo-600 text-white rounded-lg"
              >
                Login untuk Melamar
              </Link>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default JobDetailPage