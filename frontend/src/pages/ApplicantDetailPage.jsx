import { useEffect, useState, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from "motion/react"
import { api } from '../api/client'

function ApplicantDetailPage() {
  const { id } = useParams()

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    const setSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    setSize()

    let ps = []
    let raf = 0

    const make = () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      v: Math.random() * 0.25 + 0.05,
      o: Math.random() * 0.35 + 0.15,
    })

    const init = () => {
      ps = []
      const count = Math.floor((canvas.width * canvas.height) / 9000)
      for (let i = 0; i < count; i++) ps.push(make())
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ps.forEach((p) => {
        p.y -= p.v
        if (p.y < 0) {
          p.x = Math.random() * canvas.width
          p.y = canvas.height + Math.random() * 40
          p.v = Math.random() * 0.25 + 0.05
          p.o = Math.random() * 0.35 + 0.15
        }
        ctx.fillStyle = `rgba(250,250,250,${p.o})`
        ctx.fillRect(p.x, p.y, 0.7, 2.2)
      })
      raf = requestAnimationFrame(draw)
    }

    const onResize = () => {
      setSize()
      init()
    }

    window.addEventListener("resize", onResize)
    init()
    raf = requestAnimationFrame(draw)
    return () => {
      window.removeEventListener("resize", onResize)
      cancelAnimationFrame(raf)
    }
  }, [])

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
    <div className="min-h-screen bg-zinc-950">
      <style>{`
        .accent-lines{position:fixed;inset:0;pointer-events:none;opacity:.7;z-index:0}
        .hline,.vline{position:absolute;background:#27272a;will-change:transform,opacity}
        .hline{left:0;right:0;height:1px;transform:scaleX(0);transform-origin:50% 50%;animation:drawX .8s cubic-bezier(.22,.61,.36,1) forwards}
        .vline{top:0;bottom:0;width:1px;transform:scaleY(0);transform-origin:50% 0%;animation:drawY .9s cubic-bezier(.22,.61,.36,1) forwards}
        .hline:nth-child(1){top:18%;animation-delay:.12s}
        .hline:nth-child(2){top:50%;animation-delay:.22s}
        .hline:nth-child(3){top:82%;animation-delay:.32s}
        .vline:nth-child(4){left:22%;animation-delay:.42s}
        .vline:nth-child(5){left:50%;animation-delay:.54s}
        .vline:nth-child(6){left:78%;animation-delay:.66s}
        .hline::after,.vline::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(250,250,250,.24),transparent);opacity:0;animation:shimmer .9s ease-out forwards}
        .hline:nth-child(1)::after{animation-delay:.12s}
        .hline:nth-child(2)::after{animation-delay:.22s}
        .hline:nth-child(3)::after{animation-delay:.32s}
        .vline:nth-child(4)::after{animation-delay:.42s}
        .vline:nth-child(5)::after{animation-delay:.54s}
        .vline:nth-child(6)::after{animation-delay:.66s}
        @keyframes drawX{0%{transform:scaleX(0);opacity:0}60%{opacity:.95}100%{transform:scaleX(1);opacity:.7}}
        @keyframes drawY{0%{transform:scaleY(0);opacity:0}60%{opacity:.95}100%{transform:scaleY(1);opacity:.7}}
        @keyframes shimmer{0%{opacity:0}35%{opacity:.25}100%{opacity:0}}
      `}</style>

      <div className="fixed inset-0 z-0 pointer-events-none [background:radial-gradient(80%_60%_at_50%_30%,rgba(255,255,255,0.06),transparent_60%)]" />

      <div className="accent-lines">
        <div className="hline" />
        <div className="hline" />
        <div className="hline" />
        <div className="vline" />
        <div className="vline" />
        <div className="vline" />
      </div>

      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full z-[1] opacity-50 mix-blend-screen pointer-events-none"
      />

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
