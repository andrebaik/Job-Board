import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { motion } from "motion/react"
import { api } from "../api/client"
import { useAuth } from "../context/AuthContext"
import PageBackground from "../components/ParticleBackground"
import {
  ChevronLeft,
  MapPin,
  Briefcase,
  Wallet,
  CalendarDays,
  Building2,
  Globe,
  ExternalLink,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Sparkles,
  Dot,
} from "lucide-react"

const IMG_BASE = import.meta.env.VITE_API_BASE_URL.replace("/api", "")

const formatRupiah = (num) => {
  if (!num || num === 0) return null
  return new Intl.NumberFormat("id-ID").format(num)
}

const getDaysRemaining = (deadline) => {
  if (!deadline) return null
  const now = new Date()
  const end = new Date(deadline)
  end.setHours(23, 59, 59, 999)
  const diff = end - now
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

const formatDate = (dateStr) => {
  if (!dateStr) return ""
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

function JobDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()

  const [job, setJob] = useState(null)
  const [coverLetter, setCoverLetter] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const loadJob = async () => {
    try {
      setLoading(true)
      setError("")
      const response = await api.get(`/jobs/${id}`)
      setJob(response.data.data)
    } catch (error) {
      setError(error.response?.data?.message || "Gagal mengambil detail lowongan")
    } finally {
      setLoading(false)
    }
  }

  const handleApply = async (e) => {
    e.preventDefault()
    try {
      setSubmitLoading(true)
      setError("")
      setSuccess("")
      await api.post(`/applications/${id}`, {
        cover_letter: coverLetter,
      })
      setSuccess("Lamaran berhasil dikirim!")
      setCoverLetter("")
    } catch (error) {
      setError(error.response?.data?.message || "Gagal mengirim lamaran")
    } finally {
      setSubmitLoading(false)
    }
  }

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { loadJob() }, [id])

  const daysRemaining = getDaysRemaining(job?.deadline)
  const isUrgent = daysRemaining !== null && daysRemaining <= 7
  const isCritical = daysRemaining !== null && daysRemaining <= 3
  const isExpired = daysRemaining !== null && daysRemaining < 0
  const salaryRange =
    formatRupiah(job?.salary_min) && formatRupiah(job?.salary_max)
      ? `Rp${formatRupiah(job.salary_min)} — Rp${formatRupiah(job.salary_max)} / bulan`
      : formatRupiah(job?.salary_min)
        ? `Rp${formatRupiah(job.salary_min)} / bulan`
        : formatRupiah(job?.salary_max)
          ? `Rp${formatRupiah(job.salary_max)} / bulan`
          : "Negosiasi"

  const requirementList = (() => {
    if (!job?.requirements) return []
    return job.requirements
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0 && !l.match(/^[-•*]\s*/))
  })()

  return (
    <div className="min-h-screen bg-zinc-950">
      <PageBackground />

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-8 md:py-12">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-zinc-50 border border-zinc-700 transition-all active:scale-[0.97] mb-6"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Kembali
          </Link>

          {loading && (
            <div className="flex items-center justify-center py-32">
              <div className="flex flex-col items-center gap-4">
                <div className="w-8 h-8 border-2 border-zinc-700 border-t-zinc-300 rounded-full animate-spin" />
                <p className="text-sm text-zinc-500 font-mono">Memuat lowongan...</p>
              </div>
            </div>
          )}

          {!loading && error && (
            <div className="flex items-center justify-center py-24">
              <div className="flex flex-col items-center gap-4 max-w-sm text-center">
                <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-400" />
                </div>
                <p className="text-sm text-zinc-400">{error}</p>
                <button
                  onClick={loadJob}
                  className="px-4 py-2 rounded-xl text-xs font-medium bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700 transition-all active:scale-[0.97]"
                >
                  Coba Lagi
                </button>
              </div>
            </div>
          )}

          {!loading && success && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-xl text-sm flex items-center gap-2.5 mb-6"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{success}</span>
            </motion.div>
          )}

          {!loading && !error && job && (
            <div className="space-y-5">
              {/* Main Card */}
              <div className="bg-zinc-900/70 backdrop-blur-sm border border-zinc-800 rounded-2xl p-5 md:p-7 space-y-6">
                {/* Company Header */}
                <div className="flex items-start gap-4 pb-6 border-b border-zinc-800/60">
                  <div className="w-14 h-14 rounded-2xl bg-zinc-800 flex items-center justify-center shrink-0 overflow-hidden">
                    {job.logo ? (
                      <img src={IMG_BASE + job.logo} alt={job.company_name} className="w-full h-full object-cover" />
                    ) : (
                      <Building2 className="w-6 h-6 text-zinc-500" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-base font-semibold text-zinc-50 truncate">{job.company_name}</h2>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-xs text-zinc-500">{job.industry || "Perusahaan"}</span>
                      <Dot className="w-3 h-3 text-zinc-600" />
                      <div className="flex items-center gap-1 text-xs text-zinc-500">
                        <MapPin className="w-3 h-3" />
                        {job.location || "Indonesia"}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-zinc-800 text-zinc-300 text-[11px] font-medium border border-zinc-700/50">
                        <Briefcase className="w-3 h-3" />
                        {job.job_type}
                      </span>
                      {job.category && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-zinc-800 text-zinc-300 text-[11px] font-medium border border-zinc-700/50">
                          {job.category}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Salary & Deadline */}
                <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-800/50 rounded-xl px-4 py-3 border border-zinc-700/50">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-zinc-700/50 flex items-center justify-center">
                      <Wallet className="w-4 h-4 text-zinc-300" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono">Gaji</p>
                      <p className="text-sm font-mono text-zinc-50 font-medium">{salaryRange}</p>
                    </div>
                  </div>
                  {daysRemaining !== null && !isExpired && (
                    <div className={`flex items-center gap-2.5 ${isUrgent ? "px-3 py-2 rounded-lg bg-amber-500/10" : ""}`}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isCritical ? "bg-red-500/10" : isUrgent ? "bg-amber-500/10" : "bg-zinc-700/50"}`}>
                        <CalendarDays className={`w-4 h-4 ${isCritical ? "text-red-400" : isUrgent ? "text-amber-400" : "text-zinc-400"}`} />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono">Deadline</p>
                        <p className={`text-sm font-mono font-medium ${isCritical ? "text-red-400" : isUrgent ? "text-amber-400" : "text-zinc-50"}`}>
                          {formatDate(job.deadline)}
                          <span className="ml-2 text-[11px] opacity-80">({daysRemaining} hari lagi)</span>
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Job Title */}
                <div>
                  <h1 className="text-2xl md:text-3xl font-display font-bold text-zinc-50 leading-tight">
                    {job.title}
                  </h1>
                  <p className="mt-2 text-xs text-zinc-500 font-mono">
                    Diposting {formatDate(job.created_at)}
                  </p>
                </div>

                {/* Description */}
                {job.description && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded-lg bg-zinc-800 flex items-center justify-center">
                        <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
                      </div>
                      <h3 className="text-sm font-semibold text-zinc-50 uppercase tracking-wider">Deskripsi Pekerjaan</h3>
                    </div>
                    <div className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
                      {job.description}
                    </div>
                  </div>
                )}

                {/* Requirements */}
                {requirementList.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded-lg bg-zinc-800 flex items-center justify-center">
                        <CheckCircle2 className="w-3.5 h-3.5 text-zinc-400" />
                      </div>
                      <h3 className="text-sm font-semibold text-zinc-50 uppercase tracking-wider">Persyaratan</h3>
                    </div>
                    <ul className="space-y-2">
                      {requirementList.map((req, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-sm text-zinc-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-zinc-500/60 mt-2 shrink-0" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {job.requirements && requirementList.length === 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded-lg bg-zinc-800 flex items-center justify-center">
                        <CheckCircle2 className="w-3.5 h-3.5 text-zinc-400" />
                      </div>
                      <h3 className="text-sm font-semibold text-zinc-50 uppercase tracking-wider">Persyaratan</h3>
                    </div>
                    <div className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
                      {job.requirements}
                    </div>
                  </div>
                )}

                {/* About Company */}
                {(job.company_description || job.website || job.company_address) && (
                  <div className="pt-4 border-t border-zinc-800/60">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded-lg bg-zinc-800 flex items-center justify-center">
                        <Building2 className="w-3.5 h-3.5 text-zinc-400" />
                      </div>
                      <h3 className="text-sm font-semibold text-zinc-50 uppercase tracking-wider">Tentang Perusahaan</h3>
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center shrink-0 overflow-hidden">
                        {job.logo ? (
                          <img src={IMG_BASE + job.logo} alt={job.company_name} className="w-full h-full object-cover" />
                        ) : (
                          <Building2 className="w-5 h-5 text-zinc-500" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-zinc-50">{job.company_name}</p>
                        {job.industry && (
                          <p className="text-xs text-zinc-500">{job.industry}</p>
                        )}
                      </div>
                    </div>
                    {job.company_description && (
                      <p className="text-sm text-zinc-300 leading-relaxed">{job.company_description}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-4 mt-3">
                      {job.website && (
                        <a
                          href={job.website.startsWith("http") ? job.website : `https://${job.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
                        >
                          <Globe className="w-3.5 h-3.5" />
                          {job.website.replace(/^https?:\/\//, "")}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      {job.company_address && (
                        <span className="inline-flex items-center gap-1.5 text-xs text-zinc-400">
                          <MapPin className="w-3.5 h-3.5" />
                          {job.company_address}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Apply Form */}
              {user?.role === "pelamar" && (
                <form onSubmit={handleApply} className="bg-zinc-900/70 backdrop-blur-sm border border-zinc-800 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Send className="w-4 h-4 text-zinc-400" />
                    <h3 className="text-sm font-semibold text-zinc-50">Lamar Pekerjaan Ini</h3>
                  </div>
                  <textarea
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    rows="5"
                    className="w-full bg-zinc-950 border border-zinc-800 text-zinc-50 placeholder:text-zinc-600 rounded-xl px-4 py-3 text-sm outline-none focus:border-zinc-600 transition-colors resize-none"
                    placeholder="Tulis alasan kamu melamar..."
                  />
                  <p className="mt-2 text-[11px] text-zinc-500">Cover letter bersifat opsional</p>
                  <div className="flex items-center gap-3 mt-4">
                    <button
                      type="submit"
                      disabled={submitLoading}
                      className="flex-1 h-11 rounded-xl bg-zinc-50 text-zinc-950 font-semibold text-sm hover:bg-zinc-200 transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
                    >
                      {submitLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Mengirim...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Lamar Sekarang
                        </>
                      )}
                    </button>
                    <Link
                      to="/jobs"
                      className="h-11 px-5 rounded-xl bg-zinc-800 text-zinc-300 text-sm font-medium hover:bg-zinc-700 border border-zinc-700 transition-all active:scale-[0.97] flex items-center gap-1.5"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </form>
              )}

              {/* Guest CTA */}
              {!user && (
                <div className="bg-zinc-900/70 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6 text-center">
                  <Building2 className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
                  <p className="text-sm text-zinc-300 font-medium">Tertarik dengan lowongan ini?</p>
                  <p className="text-xs text-zinc-500 mt-1">Buat akun atau login untuk melamar</p>
                  <div className="flex items-center justify-center gap-3 mt-4">
                    <Link
                      to="/register"
                      className="px-5 py-2.5 rounded-xl bg-zinc-50 text-zinc-950 text-sm font-semibold hover:bg-zinc-200 transition-all active:scale-[0.98]"
                    >
                      Daftar
                    </Link>
                    <Link
                      to="/login"
                      className="px-5 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 text-sm font-medium hover:bg-zinc-700 border border-zinc-700 transition-all active:scale-[0.97]"
                    >
                      Masuk
                    </Link>
                  </div>
                </div>
              )}

              {/* Other user */}
              {user?.role !== "pelamar" && user && (
                <div className="bg-zinc-900/70 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6 text-center">
                  <CheckCircle2 className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
                  <p className="text-sm text-zinc-400">Halaman ini khusus untuk pelamar</p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default JobDetailPage
