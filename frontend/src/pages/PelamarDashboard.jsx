import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../api/client";
import { motion } from "motion/react";
import {
  LayoutDashboard,
  Search,
  User,
  FileText,
  LogOut,
  Briefcase,
  Clock,
  CheckCircle,
  XCircle,
  Send,
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
  { label: "Cari Lowongan", icon: Search, href: "/jobs", action: "link" },
  { label: "Edit Profil", icon: User, href: "/pelamar/profile", action: "link" },
  { label: "Riwayat Lamaran", icon: FileText, href: null, action: "scroll" },
];

function PelamarDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeNav, setActiveNav] = useState("dashboard");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const loadApplications = async () => {
    try {
      const response = await api.get("/applications/my-applications");
      setApplications(response.data.data || []);
    } catch (error) {
      console.log(error.response?.data?.message || "Gagal mengambil lamaran");
    } finally {
      setLoading(false);
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
    { label: "Total Lamaran", value: counts.total, icon: FileText, color: "text-indigo-400" },
    { label: "Menunggu", value: counts.menunggu, icon: Clock, color: "text-amber-400" },
    { label: "Interview", value: counts.interview, icon: Send, color: "text-violet-400" },
    { label: "Diterima", value: counts.diterima, icon: CheckCircle, color: "text-emerald-400" },
    { label: "Ditolak", value: counts.ditolak, icon: XCircle, color: "text-red-400" },
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
      `}</style>

      {/* ─────── Sidebar ─────── */}
      <motion.aside
        className="fixed left-0 top-0 h-screen w-[280px] z-30 flex flex-col border-r border-zinc-800 bg-zinc-900/70 backdrop-blur-xl overflow-hidden"
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {/* Animated glow */}
        <div
          className="absolute -top-40 -left-40 w-[400px] h-[400px] rounded-full opacity-[0.08] pointer-events-none"
          style={{
            background: "radial-gradient(circle, #6366f1, transparent 60%)",
            animation: "sidebar-glow 8s ease-in-out infinite",
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full p-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 mb-8">
            <img
              src="/Brekerja.png"
              alt="Work'in"
              className="w-7 h-7 object-contain"
            />
            <span className="text-zinc-50 font-semibold text-base tracking-tight">
              Work'in
            </span>
          </Link>

          {/* User profile */}
          <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-4 mb-6">
            <div className="w-9 h-9 rounded-full bg-indigo-500/20 flex items-center justify-center">
              <User className="w-4 h-4 text-indigo-400" />
            </div>
            <p className="text-zinc-50 text-sm font-medium mt-2 truncate">
              {user?.name}
            </p>
            <span className="inline-block mt-1 text-[11px] font-medium text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-full">
              Pelamar
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1">
            {navItems.map((item) => {
              const isActive = activeNav === item.action && item.action === "dashboard";
              const classes = `flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-indigo-500/15 border border-indigo-400/20 text-zinc-50"
                  : "text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800/50 hover:translate-x-[4px]"
              }`;

              if (item.href) {
                return (
                  <Link
                    key={item.label}
                    to={item.href}
                    onClick={() => setActiveNav(item.action)}
                    className={classes}
                  >
                    <item.icon className={`w-4 h-4 ${isActive ? "text-indigo-400" : ""}`} />
                    {item.label}
                  </Link>
                );
              }

              if (item.action === "scroll") {
                return (
                  <button
                    key={item.label}
                    onClick={scrollTo("riwayat")}
                    className={classes}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </button>
                );
              }

              return (
                <button
                  key={item.label}
                  onClick={() => setActiveNav("dashboard")}
                  className={`${classes} ${isActive ? "relative" : ""}`}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-indigo-400 rounded-full shadow-[0_0_6px_#6366f1]" />
                  )}
                  <item.icon className={`w-4 h-4 ${isActive ? "text-indigo-400" : ""}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-zinc-800/50 hover:translate-x-[4px] transition-all duration-200 cursor-pointer mt-4"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </motion.aside>

      {/* ─────── Main Content ─────── */}
      <div className="ml-[280px] flex-1 min-h-screen">
        <main className="max-w-6xl mx-auto px-8 py-8">
          {/* Welcome Hero */}
          <motion.div
            className="bg-gradient-to-r from-indigo-600/10 to-transparent border border-zinc-800 rounded-2xl p-8"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            <h1 className="text-3xl font-bold text-zinc-50">
              Selamat datang, {user?.name}
            </h1>
            <p className="text-zinc-400 mt-1">
              Kelola dan pantau semua lamaran kerja Anda di sini.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                to="/jobs"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-all active:scale-[0.97]"
              >
                <Briefcase className="w-4 h-4" />
                Cari Lowongan
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/pelamar/profile"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-800/50 text-zinc-50 text-sm font-medium rounded-xl hover:bg-zinc-700/50 transition-all border border-zinc-800"
              >
                <User className="w-4 h-4" />
                Edit Profil
              </Link>
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
                <div
                  key={label}
                  className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5 hover:bg-zinc-800/50 transition-colors"
                >
                  <Icon className={`w-5 h-5 ${color}`} />
                  <p className="text-2xl font-bold text-zinc-50 mt-2">{value}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{label}</p>
                </div>
              ))}
            </motion.div>
          )}

          {/* Riwayat Lamaran */}
          <section id="riwayat" className="mt-8">
            <h2 className="text-lg font-semibold text-zinc-50">Riwayat Lamaran</h2>

            {loading && <div className="mt-4"><Skeleton /></div>}

            {!loading && applications.length === 0 && (
              <motion.div
                className="mt-4 bg-zinc-900/70 border border-zinc-800 rounded-2xl p-10 text-center"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.35 }}
              >
                <FileText className="w-10 h-10 text-zinc-600 mx-auto" />
                <p className="text-zinc-400 mt-3 text-sm">
                  Belum ada lamaran terkirim.
                </p>
                <p className="text-zinc-500 text-xs mt-1">
                  Mulai cari lowongan dan kirim lamaran pertama Anda.
                </p>
                <Link
                  to="/jobs"
                  className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-all active:scale-[0.97]"
                >
                  <Briefcase className="w-4 h-4" />
                  Cari Lowongan
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            )}

            {!loading && applications.length > 0 && (
              <motion.div
                className="mt-4 space-y-3"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.35 }}
              >
                {applications.map((item) => {
                  const cfg = statusConfig[item.status] || statusFallback;
                  return (
                    <div
                      key={item.id}
                      className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5 hover:bg-zinc-800/50 transition-colors flex items-center justify-between gap-3"
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="text-zinc-50 font-semibold text-base truncate">
                          {item.title}
                        </h3>
                        <p className="text-zinc-400 text-sm mt-0.5">
                          {item.company_name}
                          {item.location && (
                            <>
                              <span className="text-zinc-700 mx-1.5">•</span>
                              {item.location}
                            </>
                          )}
                        </p>
                      </div>
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                        {cfg.label}
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

export default PelamarDashboard;
