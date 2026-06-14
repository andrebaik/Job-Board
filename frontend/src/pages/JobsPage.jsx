import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from "motion/react"
import { api } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { Search, X, MapPin, Briefcase, Clock, CalendarDays, Wallet, ChevronLeft } from "lucide-react"
import PageBackground from "../components/ParticleBackground"

const jobTypeOptions = ['Full Time', 'Part Time', 'Internship', 'Remote', 'Freelance']

function JobsPage() {
  const { user } = useAuth()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [searchQ, setSearchQ] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [filterJobType, setFilterJobType] = useState('')

  const categories = useMemo(() => {
    const set = new Set()
    jobs.forEach(j => { if (j.category) set.add(j.category) })
    return [...set].sort()
  }, [jobs])

  const loadJobs = async (q = '', category = '', jobType = '') => {
    try {
      setLoading(true)
      setError('')
      const params = {}
      if (q) params.q = q
      if (category) params.category = category
      if (jobType) params.job_type = jobType
      const response = await api.get('/jobs', { params })
      setJobs(response.data.data || [])
    } catch (error) {
      setError(error.response?.data?.message || 'Gagal mengambil lowongan')
    } finally {
      setLoading(false)
    }
  }

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { loadJobs(searchQ, filterCategory, filterJobType) }, [searchQ, filterCategory, filterJobType])

  const resetFilters = () => {
    setSearchQ('')
    setFilterCategory('')
    setFilterJobType('')
  }

  const hasFilters = searchQ || filterCategory || filterJobType

  return (
    <div className="min-h-screen bg-zinc-950">
      <PageBackground />

      <div className="relative z-10 p-8">
        <motion.div
          className="max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-zinc-50">Daftar Lowongan</h1>
            <Link to={user?.role === 'pelamar' ? '/pelamar/dashboard' : '/'} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-zinc-50 border border-zinc-700 transition-all active:scale-[0.97]">
              <ChevronLeft className="w-3.5 h-3.5" />
              Kembali
            </Link>
          </div>

          <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5 mb-6">
            <div className="flex flex-wrap gap-3 items-end">
              <div className="flex-1 min-w-[200px]">
                <label className="text-xs text-zinc-500 mb-1.5 block">Cari</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQ}
                    onChange={e => setSearchQ(e.target.value)}
                    placeholder="Judul atau perusahaan..."
                    className="w-full bg-zinc-950 border border-zinc-800 text-zinc-50 placeholder:text-zinc-600 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-zinc-600 transition-colors"
                  />
                </div>
              </div>

              <div className="w-[180px]">
                <label className="text-xs text-zinc-500 mb-1.5 block">Kategori</label>
                <select
                  value={filterCategory}
                  onChange={e => setFilterCategory(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 text-zinc-50 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-zinc-600 transition-colors cursor-pointer"
                >
                  <option value="">Semua</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="w-[180px]">
                <label className="text-xs text-zinc-500 mb-1.5 block">Tipe</label>
                <select
                  value={filterJobType}
                  onChange={e => setFilterJobType(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 text-zinc-50 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-zinc-600 transition-colors cursor-pointer"
                >
                  <option value="">Semua</option>
                  {jobTypeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              {hasFilters && (
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800 transition-all cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" /> Reset
                </button>
              )}
            </div>
          </div>

          <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-8">
            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="bg-zinc-800/30 rounded-2xl p-5 animate-pulse">
                    <div className="h-5 w-3/4 bg-zinc-700/50 rounded mb-3" />
                    <div className="h-4 w-1/2 bg-zinc-700/50 rounded mb-4" />
                    <div className="flex gap-2">
                      <div className="h-4 w-16 bg-zinc-700/50 rounded" />
                      <div className="h-4 w-16 bg-zinc-700/50 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {error && (
              <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm">{error}</motion.div>
            )}

            {!loading && !error && jobs.length === 0 && (
              <p className="text-zinc-500 text-center py-10">
                {hasFilters ? 'Tidak ada lowongan yang cocok dengan filter.' : 'Belum ada lowongan.'}
              </p>
            )}

            {!loading && jobs.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {jobs.map((job, i) => (
                  <motion.div
                    key={job.id}
                    className="group relative bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 hover:bg-zinc-800/60 hover:border-zinc-700 transition-all overflow-hidden"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.04 * i }}
                  >
                    <div className="absolute inset-y-4 left-0 w-0.5 bg-gradient-to-b from-zinc-600 to-zinc-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="flex flex-col h-full">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h2 className="text-lg font-semibold text-zinc-50 truncate group-hover:text-white transition-colors">
                            {job.title}
                          </h2>
                          <div className="flex items-center gap-1.5 mt-1.5 text-zinc-400">
                            <Briefcase className="w-3.5 h-3.5 shrink-0" />
                            <span className="text-sm truncate">{job.company_name || 'Perusahaan'}</span>
                          </div>
                        </div>
                        {job.category && (
                          <span className="shrink-0 px-2.5 py-1 rounded-full text-[11px] font-medium bg-zinc-800 text-zinc-300 border border-zinc-700">
                            {job.category}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3 text-xs text-zinc-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {job.job_type}
                        </span>
                        {job.salary_min && (
                          <span className="flex items-center gap-1 text-emerald-400">
                            <Wallet className="w-3 h-3" /> Rp {(+job.salary_min).toLocaleString('id-ID')}{job.salary_max ? ` - ${(+job.salary_max).toLocaleString('id-ID')}` : '+'}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-zinc-800">
                        {job.deadline && (
                          <span className="flex items-center gap-1 text-[11px] text-zinc-600">
                            <CalendarDays className="w-3 h-3" /> {new Date(job.deadline).toLocaleDateString('id-ID')}
                          </span>
                        )}
                        <Link
                          to={`/jobs/${job.id}`}
                          className="ml-auto px-3.5 py-1.5 bg-zinc-800 text-zinc-50 text-xs font-medium rounded-xl hover:bg-zinc-700 border border-zinc-700 transition-all active:scale-[0.97]"
                        >
                          Detail
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {!loading && jobs.length > 0 && (
            <p className="text-center text-xs text-zinc-600 mt-4">{jobs.length} lowongan ditemukan</p>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default JobsPage
