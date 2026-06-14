import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from "motion/react"
import { api } from '../api/client'
import PageBackground from "../components/ParticleBackground"

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

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { loadDetail() }, [id])

  const infoCardClass = "bg-zinc-900/70 border border-zinc-800 rounded-xl p-4"

  return (
    <div className="min-h-screen bg-zinc-950">
      <PageBackground />

      <div className="relative z-10 p-8">
        <motion.div
          className="max-w-4xl mx-auto bg-zinc-900/70 border border-zinc-800 rounded-2xl p-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link to="/company/dashboard" className="text-zinc-400 hover:text-zinc-50 transition-colors text-sm">← Kembali ke Dashboard</Link>

          {loading && <p className="mt-6 text-zinc-500">Mengambil detail pelamar...</p>}

          {error && (
            <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="mt-6 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm">{error}</motion.div>
          )}

          {!loading && data && (
            <>
              <motion.div className="mt-6" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
                <p className="text-sm font-medium text-zinc-500">Profil Pelamar</p>
                <h1 className="mt-2 text-3xl font-bold text-zinc-50">{data.full_name || data.name}</h1>
                <p className="mt-2 text-zinc-400">{data.email}</p>
              </motion.div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: "Telepon", value: data.phone || '-', span: false },
                  { label: "Pendidikan", value: data.education || '-', span: false },
                  { label: "Alamat", value: data.address || '-', span: true },
                  { label: "Skills", value: data.skills || '-', span: true },
                  { label: "Pengalaman", value: data.experience || '-', span: true },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    className={`${infoCardClass} ${item.span ? 'md:col-span-2' : ''}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 + 0.08 * i }}
                  >
                    <p className="text-sm text-zinc-500">{item.label}</p>
                    <p className={`mt-1 ${item.label === "Skills" || item.label === "Pengalaman" ? 'text-zinc-400 whitespace-pre-line' : 'font-medium text-zinc-50'}`}>{item.value}</p>
                  </motion.div>
                ))}

                <motion.div className={`${infoCardClass} md:col-span-2`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 + 0.08 * 5 }}>
                  <p className="text-sm text-zinc-500">CV</p>
                  {data.cv_url ? (
                    <a href={data.cv_url} target="_blank" rel="noreferrer" className="mt-1 inline-block text-zinc-300 hover:text-zinc-50 font-medium transition-colors">Buka CV</a>
                  ) : (
                    <p className="mt-1 text-zinc-400">-</p>
                  )}
                </motion.div>
              </div>

              <motion.div
                className="mt-8 bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
              >
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
              </motion.div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default ApplicantDetailPage
