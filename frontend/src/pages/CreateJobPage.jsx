import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from "motion/react"
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

          <motion.h1 className="mt-6 text-3xl font-bold text-zinc-50" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>Tambah Lowongan</motion.h1>
          <motion.p className="mt-2 text-zinc-400" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.15 }}>Isi data lowongan pekerjaan baru.</motion.p>

          {error && (
            <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="mt-6 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm">{error}</motion.div>
          )}

          {success && (
            <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="mt-6 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-xl text-sm">{success}</motion.div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
              <input name="title" value={form.title} onChange={handleChange} className={inputClass} placeholder="Judul lowongan" required />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.15 }}>
              <input name="category" value={form.category} onChange={handleChange} className={inputClass} placeholder="Kategori, contoh: IT" />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
              <input name="location" value={form.location} onChange={handleChange} className={inputClass} placeholder="Lokasi" required />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.25 }}>
              <select name="job_type" value={form.job_type} onChange={handleChange} className={selectClass}>
                <option value="Full Time">Full Time</option>
                <option value="Part Time">Part Time</option>
                <option value="Internship">Internship</option>
                <option value="Remote">Remote</option>
                <option value="Freelance">Freelance</option>
              </select>
            </motion.div>

            <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-4" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.3 }}>
              <input type="number" name="salary_min" value={form.salary_min} onChange={handleChange} className={inputClass} placeholder="Gaji minimum" />
              <input type="number" name="salary_max" value={form.salary_max} onChange={handleChange} className={inputClass} placeholder="Gaji maksimum" />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.35 }}>
              <input type="date" name="deadline" value={form.deadline} onChange={handleChange} className={inputClass} required />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.4 }}>
              <textarea name="description" value={form.description} onChange={handleChange} rows="5" className={inputClass} placeholder="Deskripsi pekerjaan" required />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.45 }}>
              <textarea name="requirements" value={form.requirements} onChange={handleChange} rows="5" className={inputClass} placeholder="Persyaratan" required />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.5 }}>
              <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-zinc-50 text-zinc-950 font-medium hover:bg-zinc-200 transition-all active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none">
                {loading ? 'Menyimpan...' : 'Simpan Lowongan'}
              </button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default CreateJobPage
