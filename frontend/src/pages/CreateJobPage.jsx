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

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm">
        <Link to="/company/dashboard" className="text-indigo-600">
          ← Kembali ke Dashboard
        </Link>

        <h1 className="mt-6 text-3xl font-bold text-slate-900">
          Tambah Lowongan
        </h1>

        <p className="mt-2 text-slate-600">
          Isi data lowongan. Jangan kosong semua, ini bukan formulir niat baik.
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
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="5"
            className="w-full px-4 py-3 border rounded-xl"
            placeholder="Deskripsi pekerjaan"
          />

          <textarea
            name="requirements"
            value={form.requirements}
            onChange={handleChange}
            rows="5"
            className="w-full px-4 py-3 border rounded-xl"
            placeholder="Persyaratan"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-indigo-600 text-white font-medium disabled:bg-indigo-300"
          >
            {loading ? 'Menyimpan...' : 'Simpan Lowongan'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default CreateJobPage