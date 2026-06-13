import { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../api/client";
import { motion } from "motion/react";
import GlareHover from "../components/GlareHover";
import {
  LayoutDashboard,
  Briefcase,
  PlusCircle,
  Users,
  LogOut,
  Clock,
  Send,
  CheckCircle,
  XCircle,
  Eye,
  ChevronLeft,
  User,
  FileText,
  ArrowRight,
} from "lucide-react";

const statusConfig = {
  menunggu: { label: "Menunggu", bg: "bg-amber-500/10", text: "text-amber-400", dot: "bg-amber-500" },
  dilihat: { label: "Dilihat", bg: "bg-blue-500/10", text: "text-blue-400", dot: "bg-blue-500" },
  interview: { label: "Interview", bg: "bg-violet-500/10", text: "text-violet-400", dot: "bg-violet-500" },
  diterima: { label: "Diterima", bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-500" },
  ditolak: { label: "Ditolak", bg: "bg-red-500/10", text: "text-red-400", dot: "bg-red-500" },
};

const statusFallback = { label: "Unknown", bg: "bg-zinc-500/10", text: "text-zinc-400", dot: "bg-zinc-500" };

const scrollTo = (id) => (e) => {
  e.preventDefault();
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
};

const Skeleton = () => (
  <div className="animate-pulse space-y-4">
    <div className="flex gap-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex-1 h-24 bg-zinc-800/50 rounded-2xl" />
      ))}
    </div>
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-20 bg-zinc-800/50 rounded-2xl" />
      ))}
    </div>
  </div>
);

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: null, action: "dashboard" },
  { label: "Kelola Lowongan", icon: Briefcase, href: "/company/jobs", action: "link" },
  { label: "Tambah Lowongan", icon: PlusCircle, href: "/company/jobs/create", action: "link" },
  { label: "Pelamar Masuk", icon: FileText, href: null, action: "scroll" },
];

function CompanyDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeNav, setActiveNav] = useState("dashboard");

  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const setSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setSize();

    let ps = [];
    let raf = 0;

    const make = () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      v: Math.random() * 0.25 + 0.05,
      o: Math.random() * 0.35 + 0.15,
    });

    const init = () => {
      ps = [];
      const count = Math.floor((canvas.width * canvas.height) / 9000);
      for (let i = 0; i < count; i++) ps.push(make());
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ps.forEach((p) => {
        p.y -= p.v;
        if (p.y < 0) {
          p.x = Math.random() * canvas.width;
          p.y = canvas.height + Math.random() * 40;
          p.v = Math.random() * 0.25 + 0.05;
          p.o = Math.random() * 0.35 + 0.15;
        }
        ctx.fillStyle = `rgba(250,250,250,${p.o})`;
        ctx.fillRect(p.x, p.y, 0.7, 2.2);
      });
      raf = requestAnimationFrame(draw);
    };

    const onResize = () => {
      setSize();
      init();
    };

    window.addEventListener("resize", onResize);
    init();
    raf = requestAnimationFrame(draw);
    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/applications/company");
      setApplications(response.data.data || []);
    } catch (error) {
      setError(error.response?.data?.message || "Gagal mengambil data pelamar");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (applicationId, status) => {
    try {
      await api.patch(`/applications/${applicationId}/status`, { status });
      loadApplications();
    } catch (error) {
      alert(error.response?.data?.message || "Gagal update status");
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const counts = {
    total: applications.length,
    menunggu: applications.filter((a) => a.status === "menunggu").length,
    interview: applications.filter((a) => a.status === "interview").length,
    diterima: applications.filter((a) => a.status === "diterima").length,
    ditolak: applications.filter((a) => a.status === "ditolak").length,
  };

  const statCards = [
    { label: "Total Pelamar", value: counts.total, icon: Users, color: "text-zinc-300" },
    { label: "Menunggu", value: counts.menunggu, icon: Clock, color: "text-amber-400" },
    { label: "Interview", value: counts.interview, icon: Send, color: "text-violet-400" },
    { label: "Diterima", value: counts.diterima, icon: CheckCircle, color: "text-emerald-400" },
    { label: "Ditolak", value: counts.ditolak, icon: XCircle, color: "text-red-400" },
  ];

  const actionButtons = [
    { label: "Dilihat", status: "dilihat", bg: "bg-blue-600 hover:bg-blue-700" },
    { label: "Interview", status: "interview", bg: "bg-violet-600 hover:bg-violet-700" },
    { label: "Diterima", status: "diterima", bg: "bg-emerald-600 hover:bg-emerald-700" },
    { label: "Ditolak", status: "ditolak", bg: "bg-red-600 hover:bg-red-700" },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 flex">
      <style>{`
        @keyframes sidebar-glow {
          0%, 100% { transform: translate(0%, 0%); }
          25% { transform: translate(30%, 20%); }
          50% { transform: translate(10%, 50%); }
          75% { transform: translate(40%, 10%); }
        }

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

      {/* ─────── Background ─────── */}
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

      {/* ─────── Sidebar ─────── */}
      <motion.aside
        className="fixed left-0 top-0 h-screen z-30 flex flex-col border-r border-zinc-800 bg-zinc-900/70 backdrop-blur-xl overflow-hidden"
        animate={{ width: sidebarOpen ? 280 : 72 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div
          className="absolute -top-40 -left-40 w-[400px] h-[400px] rounded-full opacity-[0.06] pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(255,255,255,0.4), transparent 60%)",
            animation: "sidebar-glow 8s ease-in-out infinite",
          }}
        />

        <div className="relative z-10 flex flex-col h-full p-4">
          {sidebarOpen ? (
            <Link to="/" className="flex items-center gap-3 mb-8">
              <img src="/Brekerja.png" alt="Work'in" className="w-7 h-7 object-contain shrink-0" />
              <span className="text-zinc-50 font-semibold text-base tracking-tight whitespace-nowrap">Work'in</span>
            </Link>
          ) : (
            <Link to="/" className="flex justify-center mb-8 mt-1">
              <img src="/Brekerja.png" alt="Work'in" className="w-7 h-7 object-contain" />
            </Link>
          )}

          {sidebarOpen ? (
            <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-4 mb-6">
              <div className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center">
                <User className="w-4 h-4 text-zinc-400" />
              </div>
              <p className="text-zinc-50 text-sm font-medium mt-2 truncate">{user?.name}</p>
              <span className="inline-block mt-1 text-[11px] font-medium text-zinc-300 bg-zinc-800 px-2 py-0.5 rounded-full">Perusahaan</span>
            </div>
          ) : (
            <div className="flex justify-center mb-6">
              <div className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center">
                <User className="w-4 h-4 text-zinc-400" />
              </div>
            </div>
          )}

          <nav className="flex-1 space-y-1">
            {navItems.map((item) => {
              const isActive = activeNav === item.action && item.action === "dashboard";
              const classes = `flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-zinc-800 border border-zinc-700 text-zinc-50"
                  : "text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800/50 hover:translate-x-[4px]"
              }`;

              const icon = <item.icon className={`w-4 h-4 shrink-0 ${isActive ? "text-zinc-50" : ""}`} />;

              if (item.href) {
                return (
                  <Link key={item.label} to={item.href} onClick={() => setActiveNav(item.action)} className={classes} title={sidebarOpen ? undefined : item.label}>
                    {icon}
                    {sidebarOpen && <span className="whitespace-nowrap">{item.label}</span>}
                  </Link>
                );
              }

              if (item.action === "scroll") {
                return (
                  <button key={item.label} onClick={scrollTo("pelamar")} className={classes} title={sidebarOpen ? undefined : item.label}>
                    {icon}
                    {sidebarOpen && <span className="whitespace-nowrap">{item.label}</span>}
                  </button>
                );
              }

              return (
                <button key={item.label} onClick={() => setActiveNav("dashboard")} className={`${classes} ${isActive ? "relative" : ""}`} title={sidebarOpen ? undefined : item.label}>
                  {isActive && sidebarOpen && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-zinc-50 rounded-full shadow-[0_0_6px_rgba(255,255,255,0.3)]" />
                  )}
                  {icon}
                  {sidebarOpen && <span className="whitespace-nowrap">{item.label}</span>}
                </button>
              );
            })}
          </nav>

          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-zinc-800/50 hover:translate-x-[4px] transition-all duration-200 cursor-pointer mt-4" title={sidebarOpen ? undefined : "Logout"}>
            <LogOut className="w-4 h-4 shrink-0" />
            {sidebarOpen && <span className="whitespace-nowrap">Logout</span>}
          </button>

          <button onClick={() => setSidebarOpen((v) => !v)} className="flex items-center justify-center w-full mt-2 py-2 rounded-xl text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50 transition-all duration-200 cursor-pointer" title={sidebarOpen ? "Ciutkan sidebar" : "Perluas sidebar"}>
            <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${!sidebarOpen ? "rotate-180" : ""}`} />
          </button>
        </div>
      </motion.aside>

      {/* ─────── Main Content ─────── */}
      <motion.div
        className="flex-1 min-h-screen relative z-10"
        animate={{ marginLeft: sidebarOpen ? 280 : 72 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <main className="max-w-6xl mx-auto px-8 py-8">
          {/* Welcome Hero */}
          <motion.div
            className="bg-gradient-to-r from-zinc-700/20 to-transparent border border-zinc-800 rounded-2xl p-8"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            <h1 className="text-3xl font-bold text-zinc-50">Selamat datang, {user?.name}</h1>
            <p className="text-zinc-400 mt-1">Kelola lamaran masuk dan lowongan perusahaan Anda.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <GlareHover
                as={Link}
                to="/company/jobs"
                width="auto"
                height="40px"
                background="rgba(255,255,255,0.1)"
                borderRadius="12px"
                borderColor="rgba(255,255,255,0.3)"
                glareColor="#ffffff"
                glareOpacity={0.4}
                glareAngle={-30}
                glareSize={200}
                transitionDuration={600}
                className="px-5 py-2.5 text-white text-sm font-medium rounded-xl hover:bg-white/20 transition-all active:scale-[0.97]"
              >
                <span className="inline-flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Kelola Lowongan
                  <ArrowRight className="w-4 h-4" />
                </span>
              </GlareHover>

              <GlareHover
                as={Link}
                to="/company/jobs/create"
                width="auto"
                height="40px"
                background="rgba(255,255,255,0.05)"
                borderRadius="12px"
                borderColor="rgba(255,255,255,0.15)"
                glareColor="#ffffff"
                glareOpacity={0.3}
                glareAngle={-30}
                glareSize={200}
                transitionDuration={600}
                className="px-5 py-2.5 text-zinc-300 text-sm font-medium rounded-xl hover:bg-white/10 transition-all border border-zinc-800"
              >
                <span className="inline-flex items-center gap-2">
                  <PlusCircle className="w-4 h-4" />
                  Tambah Lowongan
                </span>
              </GlareHover>
            </div>
          </motion.div>

          {/* Stat Cards */}
          {!loading && (
            <motion.div
              className="mt-8 grid grid-cols-5 gap-4"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 }}
            >
              {statCards.map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5 hover:bg-zinc-800/50 transition-colors">
                  <Icon className={`w-5 h-5 ${color}`} />
                  <p className="text-2xl font-bold text-zinc-50 mt-2">{value}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{label}</p>
                </div>
              ))}
            </motion.div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-6 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          {/* Pelamar Masuk */}
          <section id="pelamar" className="mt-8">
            <h2 className="text-lg font-semibold text-zinc-50">Pelamar Masuk</h2>

            {loading && <div className="mt-4"><Skeleton /></div>}

            {!loading && !error && applications.length === 0 && (
              <motion.div
                className="mt-4 bg-zinc-900/70 border border-zinc-800 rounded-2xl p-10 text-center"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.35 }}
              >
                <Users className="w-10 h-10 text-zinc-600 mx-auto" />
                <p className="text-zinc-400 mt-3 text-sm">Belum ada pelamar yang masuk.</p>
                <p className="text-zinc-500 text-xs mt-1">Tunggu hingga pelamar mengirim lamaran ke lowongan Anda.</p>
              </motion.div>
            )}

            {!loading && applications.length > 0 && (
              <motion.div
                className="mt-4 space-y-4"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.35 }}
              >
                {applications.map((item) => {
                  const cfg = statusConfig[item.status] || statusFallback;
                  return (
                    <div key={item.id} className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5 hover:bg-zinc-800/50 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="text-zinc-50 font-semibold text-base truncate">{item.full_name || item.name}</h3>
                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                              {cfg.label}
                            </div>
                          </div>
                          <p className="text-zinc-400 text-sm mt-1">{item.email}</p>
                          <p className="text-zinc-500 text-xs mt-0.5">Melamar: {item.job_title}</p>

                          {item.cover_letter && (
                            <div className="mt-3 bg-zinc-950/50 border border-zinc-800 rounded-xl p-3 text-sm text-zinc-400">
                              <p className="text-zinc-500 text-xs font-medium mb-1">Cover Letter:</p>
                              <p className="whitespace-pre-line">{item.cover_letter}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {actionButtons.map((btn) => (
                          <button
                            key={btn.status}
                            onClick={() => handleUpdateStatus(item.id, btn.status)}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium text-white transition-all active:scale-[0.97] ${btn.bg}`}
                          >
                            {btn.label}
                          </button>
                        ))}
                        <Link
                          to={`/company/applications/${item.id}`}
                          className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700 transition-all inline-flex items-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Detail
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            )}
          </section>
        </main>
      </motion.div>
    </div>
  );
}

export default CompanyDashboard;
