import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api/client'

function CreateJobPage() {
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
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError('')
      setSuccess('')

      await api.post('/jobs', {
        title: form.title,
        category: form.category,
        location: form.location,
        job_type: form.job_type,
        salary_min: form.salary_min || null,
        salary_max: form.salary_max || null,
        description: form.description,
        requirements: form.requirements,
        deadline: form.deadline,
      })

      setSuccess('Lowongan berhasil dibuat.')
      setTimeout(() => {
        navigate('/company/dashboard')
      }, 800)
    } catch (error) {
      setError(error.response?.data?.message || 'Gagal membuat lowongan')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full bg-zinc-950 border border-zinc-800 text-zinc-50 placeholder:text-zinc-600 rounded-xl px-4 py-3 outline-none focus:border-zinc-600 transition-colors"
  const selectClass = "w-full bg-zinc-950 border border-zinc-800 text-zinc-50 rounded-xl px-4 py-3 outline-none focus:border-zinc-600 transition-colors appearance-none"

  return (
    <div className="min-h-screen bg-zinc-950 p-8">
      <div className="max-w-4xl mx-auto bg-zinc-900/70 border border-zinc-800 rounded-2xl p-8">
        <Link to="/company/dashboard" className="text-zinc-400 hover:text-zinc-50 transition-colors text-sm">← Kembali ke Dashboard</Link>

        <h1 className="mt-6 text-3xl font-bold text-zinc-50">Tambah Lowongan</h1>
        <p className="mt-2 text-zinc-400">Isi data lowongan pekerjaan baru.</p>

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

          <textarea name="description" value={form.description} onChange={handleChange} rows="5" className={inputClass} placeholder="Deskripsi pekerjaan" required />

          <textarea name="requirements" value={form.requirements} onChange={handleChange} rows="5" className={inputClass} placeholder="Persyaratan" required />

          <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-zinc-50 text-zinc-950 font-medium hover:bg-zinc-200 transition-all active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none">
            {loading ? 'Menyimpan...' : 'Simpan Lowongan'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default CreateJobPage
