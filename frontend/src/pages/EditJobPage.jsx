import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api } from '../api/client'

function EditJobPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    title: '',
    category: '',
    location: '',
    job_type: 'Full Time',
    salary_min: '',
    salary_max: '',
    description: '',
    requirements: '',
    deadline: '',
    status: 'open',
  })

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const loadJob = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/jobs/${id}`)
      const job = response.data.data

      setForm({
        title: job.title || '',
        category: job.category || '',
        location: job.location || '',
        job_type: job.job_type || 'Full Time',
        salary_min: job.salary_min || '',
        salary_max: job.salary_max || '',
        description: job.description || '',
        requirements: job.requirements || '',
        deadline: job.deadline ? job.deadline.split('T')[0] : '',
        status: job.status || 'open',
      })
    } catch (error) {
      setError(error.response?.data?.message || 'Gagal mengambil data lowongan')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setSubmitting(true)
      setError('')
      setSuccess('')

      await api.put(`/jobs/${id}`, {
        title: form.title,
        category: form.category,
        location: form.location,
        job_type: form.job_type,
        salary_min: form.salary_min || null,
        salary_max: form.salary_max || null,
        description: form.description,
        requirements: form.requirements,
        deadline: form.deadline,
        status: form.status,
      })

      setSuccess('Lowongan berhasil diperbarui.')
      setTimeout(() => {
        navigate('/company/jobs')
      }, 800)
    } catch (error) {
      setError(error.response?.data?.message || 'Gagal memperbarui lowongan')
    } finally {
      setSubmitting(false)
    }
  }

  useEffect(() => {
    loadJob()
  }, [id])

  const inputClass = "w-full bg-zinc-950 border border-zinc-800 text-zinc-50 placeholder:text-zinc-600 rounded-xl px-4 py-3 outline-none focus:border-zinc-600 transition-colors"
  const selectClass = "w-full bg-zinc-950 border border-zinc-800 text-zinc-50 rounded-xl px-4 py-3 outline-none focus:border-zinc-600 transition-colors appearance-none"

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 p-8">
        <div className="max-w-4xl mx-auto bg-zinc-900/70 border border-zinc-800 rounded-2xl p-8">
          <p className="text-zinc-500">Memuat data lowongan...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 p-8">
      <div className="max-w-4xl mx-auto bg-zinc-900/70 border border-zinc-800 rounded-2xl p-8">
        <Link to="/company/jobs" className="text-zinc-400 hover:text-zinc-50 transition-colors text-sm">← Kembali ke Daftar Lowongan</Link>

        <h1 className="mt-6 text-3xl font-bold text-zinc-50">Edit Lowongan</h1>
        <p className="mt-2 text-zinc-400">Perbarui data lowongan di bawah ini.</p>

        {error && (
          <div className="mt-6 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm">{error}</div>
        )}

        {success && (
          <div className="mt-6 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-xl text-sm">{success}</div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <input name="title" value={form.title} onChange={handleChange} className={inputClass} placeholder="Judul lowongan" required />
          <input name="category" value={form.category} onChange={handleChange} className={inputClass} placeholder="Kategori, contoh: IT" />
          <input name="location" value={form.location} onChange={handleChange} className={inputClass} placeholder="Lokasi" required />

          <select name="job_type" value={form.job_type} onChange={handleChange} className={selectClass}>
            <option value="Full Time">Full Time</option>
            <option value="Part Time">Part Time</option>
            <option value="Internship">Internship</option>
            <option value="Remote">Remote</option>
            <option value="Freelance">Freelance</option>
          </select>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="number" name="salary_min" value={form.salary_min} onChange={handleChange} className={inputClass} placeholder="Gaji minimum" />
            <input type="number" name="salary_max" value={form.salary_max} onChange={handleChange} className={inputClass} placeholder="Gaji maksimum" />
          </div>

          <input type="date" name="deadline" value={form.deadline} onChange={handleChange} className={inputClass} required />

          <select name="status" value={form.status} onChange={handleChange} className={selectClass}>
            <option value="open">Dibuka</option>
            <option value="closed">Ditutup</option>
          </select>

          <textarea name="description" value={form.description} onChange={handleChange} rows="5" className={inputClass} placeholder="Deskripsi pekerjaan" required />
          <textarea name="requirements" value={form.requirements} onChange={handleChange} rows="5" className={inputClass} placeholder="Persyaratan" required />

          <button type="submit" disabled={submitting} className="w-full py-3 rounded-xl bg-zinc-50 text-zinc-950 font-medium hover:bg-zinc-200 transition-all active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none">
            {submitting ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default EditJobPage
