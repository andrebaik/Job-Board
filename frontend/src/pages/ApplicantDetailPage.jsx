import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api/client'

function ApplicantDetailPage() {
  const { id } = useParams()

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadDetail = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await api.get(`/applications/company/${id}`)
      setData(response.data.data)
    } catch (error) {
      setError(error.response?.data?.message || 'Gagal mengambil detail pelamar')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDetail()
  }, [id])

  const infoCardClass = "bg-zinc-900/70 border border-zinc-800 rounded-xl p-4"

  return (
    <div className="min-h-screen bg-zinc-950 p-8">
      <div className="max-w-4xl mx-auto bg-zinc-900/70 border border-zinc-800 rounded-2xl p-8">
        <Link to="/company/dashboard" className="text-zinc-400 hover:text-zinc-50 transition-colors text-sm">← Kembali ke Dashboard</Link>

        {loading && <p className="mt-6 text-zinc-500">Mengambil detail pelamar...</p>}

        {error && (
          <div className="mt-6 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm">{error}</div>
        )}

        {!loading && data && (
          <>
            <div className="mt-6">
              <p className="text-sm font-medium text-zinc-500">Profil Pelamar</p>
              <h1 className="mt-2 text-3xl font-bold text-zinc-50">{data.full_name || data.name}</h1>
              <p className="mt-2 text-zinc-400">{data.email}</p>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={infoCardClass}>
                <p className="text-sm text-zinc-500">Telepon</p>
                <p className="mt-1 font-medium text-zinc-50">{data.phone || '-'}</p>
              </div>

              <div className={infoCardClass}>
                <p className="text-sm text-zinc-500">Pendidikan</p>
                <p className="mt-1 font-medium text-zinc-50">{data.education || '-'}</p>
              </div>

              <div className={`${infoCardClass} md:col-span-2`}>
                <p className="text-sm text-zinc-500">Alamat</p>
                <p className="mt-1 text-zinc-50">{data.address || '-'}</p>
              </div>

              <div className={`${infoCardClass} md:col-span-2`}>
                <p className="text-sm text-zinc-500">Skills</p>
                <p className="mt-1 text-zinc-400 whitespace-pre-line">{data.skills || '-'}</p>
              </div>

              <div className={`${infoCardClass} md:col-span-2`}>
                <p className="text-sm text-zinc-500">Pengalaman</p>
                <p className="mt-1 text-zinc-400 whitespace-pre-line">{data.experience || '-'}</p>
              </div>

              <div className={`${infoCardClass} md:col-span-2`}>
                <p className="text-sm text-zinc-500">CV</p>
                {data.cv_url ? (
                  <a href={data.cv_url} target="_blank" rel="noreferrer" className="mt-1 inline-block text-zinc-300 hover:text-zinc-50 font-medium transition-colors">
                    Buka CV
                  </a>
                ) : (
                  <p className="mt-1 text-zinc-400">-</p>
                )}
              </div>
            </div>

            <div className="mt-8 bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5">
              <h2 className="text-xl font-bold text-zinc-50">Detail Lamaran</h2>
              <p className="mt-3 text-zinc-400">Melamar posisi: <span className="text-zinc-50 font-medium">{data.job_title}</span></p>
              <p className="mt-1 text-zinc-400">Status: <span className="text-zinc-50 font-medium">{data.status}</span></p>
              <p className="mt-1 text-zinc-400">Tanggal Lamar: <span className="text-zinc-50 font-medium">
                {data.applied_at ? new Date(data.applied_at).toLocaleDateString('id-ID') : '-'}
              </span></p>

              <div className="mt-4">
                <p className="font-semibold text-zinc-50">Cover Letter</p>
                <p className="mt-2 text-zinc-400 whitespace-pre-line">{data.cover_letter || '-'}</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ApplicantDetailPage
