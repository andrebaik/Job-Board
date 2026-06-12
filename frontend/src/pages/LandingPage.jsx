import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Beams from '../components/Beams'
import TrueFocus from '../components/TrueFocus'

function LandingPage() {
  const [stats, setStats] = useState({
    companies: 0,
    applicants: 0,
    filledJobs: 0,
  })
  const [statsLoading, setStatsLoading] = useState(true)

  const formatNumber = (value) =>
    `${new Intl.NumberFormat('id-ID').format(value || 0)}`

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const base = import.meta.env.VITE_API_BASE_URL
        if (!base) { setStatsLoading(false); return }
        const res = await fetch(`${base}/stats/public`)
        if (!res.ok) throw new Error()
        const data = await res.json()
        if (mounted) {
          setStats({
            companies: data.companies || 0,
            applicants: data.applicants || 0,
            filledJobs: data.filledJobs || 0,
          })
        }
      } catch {
        // stats are decorative, fail silently
      } finally {
        if (mounted) setStatsLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  return (
    <div className="relative min-h-screen bg-[#030712] overflow-hidden">
      {/* ─── Beams background ─── */}
      <div className="absolute inset-0 pointer-events-none">
        <Beams
          beamWidth={2}
          beamHeight={18}
          beamNumber={14}
          lightColor="#6366f1"
          speed={1.5}
          noiseIntensity={1.2}
          scale={0.18}
          rotation={0}
        />
      </div>

      {/* ─── Dark overlay ─── */}
      <div className="absolute inset-0 bg-[#030712]/70 pointer-events-none" />

      {/* ─── Content ─── */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* ─────── Navbar ─────── */}
        <div className="pt-6 px-4">
          <nav className="max-w-[1100px] mx-auto bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl px-6 h-14 flex items-center justify-between">
            {/* Left: Logo + brand */}
            <Link to="/" className="flex items-center gap-2.5 shrink-0">
              <img
                src="/Brekerja.png"
                alt="Work'in"
                className="w-7 h-7 object-contain"
              />
              <span className="text-white font-semibold text-sm tracking-tight">
                Work'in
              </span>
            </Link>

            {/* Center: Nav links */}
            <div className="hidden md:flex items-center gap-8">
              <span className="text-sm text-slate-400 hover:text-white transition-colors cursor-default">
                Fitur
              </span>
              <span className="text-sm text-slate-400 hover:text-white transition-colors cursor-default">
                Tentang
              </span>
              <Link
                to="/jobs"
                className="text-sm text-slate-400 hover:text-white transition-colors"
              >
                Lowongan
              </Link>
            </div>

            {/* Right: CTAs */}
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm text-slate-400 hover:text-white transition-colors"
              >
                Masuk
              </Link>
              <Link
                to="/register"
                className="px-4 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-all active:scale-[0.97]"
              >
                Daftar
              </Link>
            </div>
          </nav>
        </div>

        {/* ─────── Hero ─────── */}
        <section className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="max-w-[800px] mx-auto text-center">
            {/* Badge */}
            

            {/* Headline */}
            <style>{`
              .hero-focus .focus-container {
                gap: 0.35em;
              }
              .hero-focus .focus-word {
                font-size: 2.25rem !important;
                font-weight: 700 !important;
                color: #fff !important;
              }
              @media (min-width: 640px) {
                .hero-focus .focus-word {
                  font-size: 3rem !important;
                }
              }
              @media (min-width: 768px) {
                .hero-focus .focus-word {
                  font-size: 3.75rem !important;
                }
              }
            `}</style>
            <div className="hero-focus leading-[1.1] tracking-tight">
              <TrueFocus
                sentence="Temukan peluang karier terbaikmu"
                blurAmount={4}
                borderColor="#6366f1"
                glowColor="rgba(99, 102, 241, 0.5)"
                animationDuration={0.6}
                pauseBetweenAnimations={1.5}
              />
            </div>

            {/* Description */}
            <p className="mt-5 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Platform lowongan kerja yang menghubungkan pelamar berbakat
              dengan perusahaan terbaik secara cepat, transparan, dan profesional.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-3 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-all active:scale-[0.97] text-center"
              >
                Mulai Sekarang
              </Link>
              <Link
                to="/jobs"
                className="w-full sm:w-auto px-8 py-3 bg-white/5 text-white text-sm font-medium rounded-xl hover:bg-white/10 transition-all border border-white/10 text-center"
              >
                Lihat Lowongan
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-14 flex items-center justify-center gap-6 sm:gap-10">
              {[
                { label: 'Perusahaan', value: stats.companies },
                { label: 'Pelamar Aktif', value: stats.applicants },
                { label: 'Lowongan Terisi', value: stats.filledJobs },
              ].map(({ label, value }, i) => (
                <div key={label} className="flex items-center gap-6 sm:gap-10">
                  <div>
                    <p className="text-white font-bold text-xl sm:text-2xl">
                      {statsLoading ? '...' : formatNumber(value)}+
                    </p>
                    <p className="text-slate-500 text-xs mt-0.5">{label}</p>
                  </div>
                  {i < 2 && (
                    <div className="w-px h-10 bg-white/10 hidden sm:block" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default LandingPage
