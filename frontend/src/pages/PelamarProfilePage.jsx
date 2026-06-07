import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'

function PelamarProfilePage() {
  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    address: '',
    education: '',
    skills: '',
    experience: '',
    cv_url: '',
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const loadProfile = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await api.get('/profiles/pelamar/me')
      const data = response.data.data

      setForm({
        full_name: data.full_name || data.name || '',
        phone: data.phone || '',
        address: data.address || '',
        education: data.education || '',
        skills: data.skills || '',
        experience: data.experience || '',
        cv_url: data.cv_url || '',
      })
    } catch (error) {
      setError(error.response?.data?.message || 'Gagal mengambil profil')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setSaving(true)
      setError('')
      setSuccess('')

      await api.put('/profiles/pelamar/me', form)

      setSuccess('Profil berhasil disimpan.')
    } catch (error) {
      setError(error.response?.data?.message || 'Gagal menyimpan profil')
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    loadProfile()
  }, [])

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm">
        <Link to="/pelamar/dashboard" className="text-indigo-600">
          ← Kembali ke Dashboard
        </Link>

        <h1 className="mt-6 text-3xl font-bold text-slate-900">
          Edit Profil Pelamar
        </h1>

        <p className="mt-2 text-slate-600">
          Isi profil biar perusahaan bisa lihat data kamu. Jangan kosong semua, nanti dikira NPC.
        </p>

        {loading && (
          <p className="mt-6 text-slate-500">Mengambil data profil...</p>
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

        {!loading && (
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Nama Lengkap
              </label>
              <input
                type="text"
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                className="mt-2 w-full px-4 py-3 border rounded-xl outline-none"
                placeholder="Nama lengkap"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                No HP
              </label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="mt-2 w-full px-4 py-3 border rounded-xl outline-none"
                placeholder="081234567890"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Alamat
              </label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                rows="3"
                className="mt-2 w-full px-4 py-3 border rounded-xl outline-none"
                placeholder="Alamat lengkap"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Pendidikan
              </label>
              <input
                type="text"
                name="education"
                value={form.education}
                onChange={handleChange}
                className="mt-2 w-full px-4 py-3 border rounded-xl outline-none"
                placeholder="Contoh: S1 Teknik Informatika"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Skills
              </label>
              <textarea
                name="skills"
                value={form.skills}
                onChange={handleChange}
                rows="4"
                className="mt-2 w-full px-4 py-3 border rounded-xl outline-none"
                placeholder="Contoh: HTML, CSS, JavaScript, React"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Pengalaman
              </label>
              <textarea
                name="experience"
                value={form.experience}
                onChange={handleChange}
                rows="4"
                className="mt-2 w-full px-4 py-3 border rounded-xl outline-none"
                placeholder="Ceritakan pengalaman project / kerja / organisasi"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Link CV
              </label>
              <input
                type="text"
                name="cv_url"
                value={form.cv_url}
                onChange={handleChange}
                className="mt-2 w-full px-4 py-3 border rounded-xl outline-none"
                placeholder="https://example.com/cv.pdf"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 rounded-xl bg-indigo-600 text-white font-medium disabled:bg-indigo-300"
            >
              {saving ? 'Menyimpan...' : 'Simpan Profil'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default PelamarProfilePage