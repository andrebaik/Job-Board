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

  const inputClass = "w-full bg-zinc-950 border border-zinc-800 text-zinc-50 placeholder:text-zinc-600 rounded-xl px-4 py-3 outline-none focus:border-zinc-600 transition-colors"

  return (
    <div className="min-h-screen bg-zinc-950 p-8">
      <div className="max-w-4xl mx-auto bg-zinc-900/70 border border-zinc-800 rounded-2xl p-8">
        <Link to="/pelamar/dashboard" className="text-zinc-400 hover:text-zinc-50 transition-colors text-sm">
          ← Kembali ke Dashboard
        </Link>

        <h1 className="mt-6 text-3xl font-bold text-zinc-50">Edit Profil Pelamar</h1>
        <p className="mt-2 text-zinc-400">Isi profil biar perusahaan bisa lihat data kamu.</p>

        {loading && <p className="mt-6 text-zinc-500">Mengambil data profil...</p>}

        {error && (
          <div className="mt-6 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-6 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-xl text-sm">
            {success}
          </div>
        )}

        {!loading && (
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="block text-sm font-medium text-zinc-300">Nama Lengkap</label>
              <input type="text" name="full_name" value={form.full_name} onChange={handleChange} className={`mt-2 ${inputClass}`} placeholder="Nama lengkap" />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300">No HP</label>
              <input type="text" name="phone" value={form.phone} onChange={handleChange} className={`mt-2 ${inputClass}`} placeholder="081234567890" />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300">Alamat</label>
              <textarea name="address" value={form.address} onChange={handleChange} rows="3" className={`mt-2 ${inputClass}`} placeholder="Alamat lengkap" />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300">Pendidikan</label>
              <input type="text" name="education" value={form.education} onChange={handleChange} className={`mt-2 ${inputClass}`} placeholder="Contoh: S1 Teknik Informatika" />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300">Skills</label>
              <textarea name="skills" value={form.skills} onChange={handleChange} rows="4" className={`mt-2 ${inputClass}`} placeholder="Contoh: HTML, CSS, JavaScript, React" />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300">Pengalaman</label>
              <textarea name="experience" value={form.experience} onChange={handleChange} rows="4" className={`mt-2 ${inputClass}`} placeholder="Ceritakan pengalaman project / kerja / organisasi" />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300">Link CV</label>
              <input type="text" name="cv_url" value={form.cv_url} onChange={handleChange} className={`mt-2 ${inputClass}`} placeholder="https://example.com/cv.pdf" />
            </div>

            <button type="submit" disabled={saving} className="w-full py-3 rounded-xl bg-zinc-50 text-zinc-950 font-medium hover:bg-zinc-200 transition-all active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none">
              {saving ? 'Menyimpan...' : 'Simpan Profil'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default PelamarProfilePage
