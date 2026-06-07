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

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm">
        <Link to="/company/dashboard" className="text-indigo-600">
          ← Kembali ke Dashboard
        </Link>

        {loading && (
          <p className="mt-6 text-slate-500">Mengambil detail pelamar...</p>
        )}

        {error && (
          <div className="mt-6 bg-red-50 text-red-600 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {!loading && data && (
          <>
            <div className="mt-6">
              <p className="text-sm font-medium text-indigo-600">
                Profil Pelamar
              </p>

              <h1 className="mt-2 text-3xl font-bold text-slate-900">
                {data.full_name || data.name}
              </h1>

              <p className="mt-2 text-slate-600">
                {data.email}
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-xl p-4">
                <p className="text-sm text-slate-500">Telepon</p>
                <p className="mt-1 font-medium text-slate-900">
                  {data.phone || '-'}
                </p>
              </div>

              <div className="border rounded-xl p-4">
                <p className="text-sm text-slate-500">Pendidikan</p>
                <p className="mt-1 font-medium text-slate-900">
                  {data.education || '-'}
                </p>
              </div>

              <div className="border rounded-xl p-4 md:col-span-2">
                <p className="text-sm text-slate-500">Alamat</p>
                <p className="mt-1 text-slate-900">
                  {data.address || '-'}
                </p>
              </div>

              <div className="border rounded-xl p-4 md:col-span-2">
                <p className="text-sm text-slate-500">Skills</p>
                <p className="mt-1 text-slate-900 whitespace-pre-line">
                  {data.skills || '-'}
                </p>
              </div>

              <div className="border rounded-xl p-4 md:col-span-2">
                <p className="text-sm text-slate-500">Pengalaman</p>
                <p className="mt-1 text-slate-900 whitespace-pre-line">
                  {data.experience || '-'}
                </p>
              </div>

              <div className="border rounded-xl p-4 md:col-span-2">
                <p className="text-sm text-slate-500">CV</p>

                {data.cv_url ? (
                  <a
                    href={data.cv_url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-block text-indigo-600 font-medium"
                  >
                    Buka CV
                  </a>
                ) : (
                  <p className="mt-1 text-slate-900">-</p>
                )}
              </div>
            </div>

            <div className="mt-8 border rounded-xl p-5 bg-slate-50">
              <h2 className="text-xl font-bold text-slate-900">
                Detail Lamaran
              </h2>

              <p className="mt-3 text-slate-700">
                Melamar posisi: <b>{data.job_title}</b>
              </p>

              <p className="mt-1 text-slate-700">
                Status: <b>{data.status}</b>
              </p>

              <p className="mt-1 text-slate-700">
                Tanggal Lamar:{' '}
                {data.applied_at
                  ? new Date(data.applied_at).toLocaleDateString('id-ID')
                  : '-'}
              </p>

              <div className="mt-4">
                <p className="font-semibold text-slate-900">
                  Cover Letter
                </p>

                <p className="mt-2 text-slate-700 whitespace-pre-line">
                  {data.cover_letter || '-'}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ApplicantDetailPage