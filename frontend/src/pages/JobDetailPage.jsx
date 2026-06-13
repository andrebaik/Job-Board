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

  const inputClass = "w-full bg-zinc-950 border border-zinc-800 text-zinc-50 placeholder:text-zinc-600 rounded-xl px-4 py-3 outline-none focus:border-zinc-600 transition-colors"

  return (
    <div className="min-h-screen bg-zinc-950 p-8">
      <div className="max-w-4xl mx-auto bg-zinc-900/70 border border-zinc-800 rounded-2xl p-8">
        <Link to="/jobs" className="text-zinc-400 hover:text-zinc-50 transition-colors text-sm">← Kembali</Link>

        {loading && <p className="mt-6 text-zinc-500">Mengambil detail lowongan...</p>}

        {error && (
          <div className="mt-6 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm">{error}</div>
        )}

        {success && (
          <div className="mt-6 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-xl text-sm">{success}</div>
        )}

        {!loading && job && (
          <>
            <p className="mt-5 text-sm text-zinc-400">{job.company_name} • {job.location}</p>
            <h1 className="mt-3 text-3xl font-bold text-zinc-50">{job.title}</h1>
            <p className="mt-3 text-zinc-400">Tipe: {job.job_type}</p>
            <p className="mt-2 text-zinc-400">Gaji: Rp{job.salary_min || 0} - Rp{job.salary_max || 0}</p>

            <div className="mt-6">
              <h2 className="font-bold text-zinc-50">Deskripsi</h2>
              <p className="mt-2 text-zinc-400 whitespace-pre-line">{job.description}</p>
            </div>

            <div className="mt-6">
              <h2 className="font-bold text-zinc-50">Persyaratan</h2>
              <p className="mt-2 text-zinc-400 whitespace-pre-line">{job.requirements}</p>
            </div>

            {user?.role === 'pelamar' && (
              <form onSubmit={handleApply} className="mt-8">
                <label className="block text-sm font-medium text-zinc-300">Cover Letter</label>
                <textarea value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} rows="5" className={`mt-2 ${inputClass}`} placeholder="Tulis alasan kamu melamar..." />
                <button type="submit" disabled={submitLoading} className="mt-4 px-5 py-2.5 bg-zinc-50 text-zinc-950 text-sm font-medium rounded-xl hover:bg-zinc-200 transition-all active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none">
                  {submitLoading ? 'Mengirim...' : 'Lamar Sekarang'}
                </button>
              </form>
            )}

            {!user && (
              <Link to="/login" className="inline-block mt-8 px-5 py-2.5 bg-zinc-800 text-zinc-50 text-sm font-medium rounded-xl hover:bg-zinc-700 border border-zinc-700 transition-all">
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
