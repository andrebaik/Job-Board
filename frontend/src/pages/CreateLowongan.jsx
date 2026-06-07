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
        ...form,
        salary_min: form.salary_min || null,
        salary_max: form.salary_max || null,
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
    <div className="min-h-screen bg-slate-100 p-6 md:p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-sm">
        <Link to="/company/dashboard" className="text-indigo-600 font-medium">
          ← Kembali ke Dashboard
        </Link>

        <div className="mt-6">
          <p className="text-sm font-medium text-indigo-600">
            Perusahaan
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Tambah Lowongan
          </h1>

          <p className="mt-2 text-slate-500">
            Isi data lowongan dengan benar. Jangan asal tempel teks generik kayak brosur seminar crypto.
          </p>
        </div>

        {error && (
          <div className="mt-6 bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-6 bg-green-50 text-green-600 px-4 py-3 rounded-xl text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Judul Lowongan
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="mt-2 w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Contoh: Frontend Developer"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Kategori
              </label>
              <input
                type="text"
                name="category"
                value={form.category}
                onChange={handleChange}
                className="mt-2 w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Contoh: IT, Marketing, Finance"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Lokasi
              </label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                className="mt-2 w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Contoh: Bandung"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Tipe Pekerjaan
            </label>
            <select
              name="job_type"
              value={form.job_type}
              onChange={handleChange}
              className="mt-2 w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Full Time">Full Time</option>
              <option value="Part Time">Part Time</option>
              <option value="Internship">Internship</option>
              <option value="Freelance">Freelance</option>
              <option value="Remote">Remote</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Gaji Minimum
              </label>
              <input
                type="number"
                name="salary_min"
                value={form.salary_min}
                onChange={handleChange}
                className="mt-2 w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Contoh: 3000000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Gaji Maksimum
              </label>
              <input
                type="number"
                name="salary_max"
                value={form.salary_max}
                onChange={handleChange}
                className="mt-2 w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Contoh: 7000000"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Deadline
            </label>
            <input
              type="date"
              name="deadline"
              value={form.deadline}
              onChange={handleChange}
              className="mt-2 w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Deskripsi Pekerjaan
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="5"
              className="mt-2 w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Jelaskan pekerjaan yang ditawarkan"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Persyaratan
            </label>
            <textarea
              name="requirements"
              value={form.requirements}
              onChange={handleChange}
              rows="5"
              className="mt-2 w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Contoh: Menguasai React, memahami REST API, bisa kerja tim"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:bg-indigo-300"
          >
            {loading ? 'Menyimpan...' : 'Simpan Lowongan'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default CreateJobPage