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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 p-8">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm">
          <p className="mt-6 text-slate-500">Memuat data lowongan...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm">
        <Link to="/company/jobs" className="text-indigo-600">
          ← Kembali ke Daftar Lowongan
        </Link>

        <h1 className="mt-6 text-3xl font-bold text-slate-900">
          Edit Lowongan
        </h1>

        <p className="mt-2 text-slate-600">
          Perbarui data lowongan di bawah ini.
        </p>

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

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-xl"
            placeholder="Judul lowongan"
            required
          />

          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-xl"
            placeholder="Kategori, contoh: IT"
          />

          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-xl"
            placeholder="Lokasi"
            required
          />

          <select
            name="job_type"
            value={form.job_type}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-xl"
          >
            <option value="Full Time">Full Time</option>
            <option value="Part Time">Part Time</option>
            <option value="Internship">Internship</option>
            <option value="Remote">Remote</option>
            <option value="Freelance">Freelance</option>
          </select>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="number"
              name="salary_min"
              value={form.salary_min}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-xl"
              placeholder="Gaji minimum"
            />

            <input
              type="number"
              name="salary_max"
              value={form.salary_max}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-xl"
              placeholder="Gaji maksimum"
            />
          </div>

          <input
            type="date"
            name="deadline"
            value={form.deadline}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-xl"
            required
          />

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-xl"
          >
            <option value="open">Dibuka</option>
            <option value="closed">Ditutup</option>
          </select>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="5"
            className="w-full px-4 py-3 border rounded-xl"
            placeholder="Deskripsi pekerjaan"
            required
          />

          <textarea
            name="requirements"
            value={form.requirements}
            onChange={handleChange}
            rows="5"
            className="w-full px-4 py-3 border rounded-xl"
            placeholder="Persyaratan"
            required
          />

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-indigo-600 text-white font-medium disabled:bg-indigo-300"
          >
            {submitting ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default EditJobPage