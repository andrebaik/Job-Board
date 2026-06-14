import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../api/client";
import { motion } from "motion/react";
import GlareHover from "../components/GlareHover";
import LogoutModal from "../components/LogoutModal";
import PageBackground from "../components/ParticleBackground";
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
  ChevronLeft,
  MapPin,
  Building2,
  CalendarDays,
} from "lucide-react";

const statusConfig = {
  menunggu: { label: "Menunggu", bg: "bg-amber-500/10", text: "text-amber-400", dot: "bg-amber-500" },
  dilihat: { label: "Dilihat", bg: "bg-blue-500/10", text: "text-blue-400", dot: "bg-blue-500" },
  interview: { label: "Interview", bg: "bg-violet-500/10", text: "text-violet-400", dot: "bg-violet-500" },
  diterima: { label: "Diterima", bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-500" },
  ditolak: { label: "Ditolak", bg: "bg-red-500/10", text: "text-red-400", dot: "bg-red-500" },
};

const statusFallback = { label: "Unknown", bg: "bg-zinc-500/10", text: "text-zinc-400", dot: "bg-zinc-500" };

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: null, action: "dashboard" },
  { label: "Cari Lowongan", icon: Search, href: "/jobs", action: "link" },
  { label: "Edit Profil", icon: User, href: "/pelamar/profile", action: "link" },
  { label: "Riwayat Lamaran", icon: FileText, href: null, action: "scroll" },
];

const IMG_BASE = import.meta.env.VITE_API_BASE_URL.replace("/api", "");

function PelamarDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeNav, setActiveNav] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [profileName, setProfileName] = useState("");

  const handleLogout = () => setLogoutOpen(true);
  const confirmLogout = () => {
    logout();
    navigate("/login");
  };

  const loadProfile = async () => {
    try {
      const res = await api.get("/profiles/pelamar/me");
      const data = res.data.data;
      if (data?.profile_picture) {
        setProfilePicture(IMG_BASE + data.profile_picture);
      }
      if (data?.full_name) {
        setProfileName(data.full_name);
      }
    } catch {
      /* silent */
    }
  };

  const loadApplications = async () => {
    try {
      const response = await api.get("/applications/my-applications");
      setApplications(response.data.data || []);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { loadProfile(); loadApplications(); }, []);

  const counts = {
    total: applications.length,
    menunggu: applications.filter((a) => a.status === "menunggu").length,
    interview: applications.filter((a) => a.status === "interview").length,
    diterima: applications.filter((a) => a.status === "diterima").length,
    ditolak: applications.filter((a) => a.status === "ditolak").length,
  };

  const statCards = [
    { label: "Total Lamaran", value: counts.total, icon: FileText, color: "text-zinc-300" },
    { label: "Menunggu", value: counts.menunggu, icon: Clock, color: "text-amber-400" },
    { label: "Interview", value: counts.interview, icon: Send, color: "text-violet-400" },
    { label: "Diterima", value: counts.diterima, icon: CheckCircle, color: "text-emerald-400" },
    { label: "Ditolak", value: counts.ditolak, icon: XCircle, color: "text-red-400" },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 flex">
      <PageBackground />

      <motion.aside
        className="fixed left-0 top-0 h-screen z-30 flex flex-col border-r border-zinc-800 bg-zinc-900/70 backdrop-blur-xl overflow-hidden"
        animate={{ width: sidebarOpen ? 280 : 72 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div
          className="absolute -top-40 -left-40 w-[400px] h-[400px] rounded-full opacity-[0.06] pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(255,255,255,0.4), transparent 60%)",
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
              <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center overflow-hidden">
                {profilePicture ? (
                  <img src={profilePicture} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-sm font-bold text-zinc-400">{user?.name?.charAt(0)?.toUpperCase() || "U"}</span>
                )}
              </div>
              <p className="text-zinc-50 text-sm font-medium mt-2 truncate">{profileName || user?.name}</p>
              <span className="inline-block mt-1 text-[11px] font-medium text-zinc-300 bg-zinc-800 px-2 py-0.5 rounded-full">
                Pelamar
              </span>
            </div>
          ) : (
            <div className="flex justify-center mb-6">
              <div className="w-9 h-9 rounded-xl bg-zinc-800 flex items-center justify-center overflow-hidden">
                {profilePicture ? (
                  <img src={profilePicture} alt="" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-4 h-4 text-zinc-400" />
                )}
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
                  <button key={item.label} onClick={() => document.getElementById("riwayat")?.scrollIntoView({ behavior: "smooth" })} className={classes} title={sidebarOpen ? undefined : item.label}>
                    {icon}
                    {sidebarOpen && <span className="whitespace-nowrap">{item.label}</span>}
                  </button>
                );
              }
              return (
                <button key={item.label} onClick={() => setActiveNav("dashboard")} className={`${classes} ${isActive ? "relative" : ""}`} title={sidebarOpen ? undefined : item.label}>
                  {isActive && sidebarOpen && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-zinc-50 rounded-full shadow-[0_0_6px_rgba(255,255,255,0.3)]" />}
                  {icon}
                  {sidebarOpen && <span className="whitespace-nowrap">{item.label}</span>}
                </button>
              );
            })}
          </nav>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-zinc-800/50 hover:translate-x-[4px] transition-all duration-200 cursor-pointer mt-4"
            title={sidebarOpen ? undefined : "Logout"}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {sidebarOpen && <span className="whitespace-nowrap">Logout</span>}
          </button>

          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="flex items-center justify-center w-full mt-2 py-2 rounded-xl text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50 transition-all duration-200 cursor-pointer"
            title={sidebarOpen ? "Ciutkan sidebar" : "Perluas sidebar"}
          >
            <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${!sidebarOpen ? "rotate-180" : ""}`} />
          </button>
        </div>
      </motion.aside>

      <motion.div
        className="flex-1 min-h-screen relative z-10"
        animate={{ marginLeft: sidebarOpen ? 280 : 72 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <main className="max-w-6xl mx-auto px-8 py-8">
          <motion.div
            className="relative overflow-hidden bg-gradient-to-br from-zinc-800/40 via-zinc-900/70 to-zinc-950/90 border border-zinc-800 rounded-3xl p-8"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            <div className="absolute top-0 right-0 w-72 h-72 bg-zinc-50/[0.03] rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/[0.02] rounded-full blur-2xl translate-y-1/2 -translate-x-1/4" />

            <div className="relative flex items-start gap-6">
              <div className="hidden sm:flex w-16 h-16 rounded-2xl bg-gradient-to-br from-zinc-600 to-zinc-800 items-center justify-center shrink-0 shadow-lg overflow-hidden">
                {profilePicture ? (
                  <img src={profilePicture} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl font-bold text-zinc-100">
                    {(profileName || user?.name)?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-3xl font-bold text-zinc-50 tracking-tight">Selamat datang, {profileName || user?.name}</h1>
                </div>
                <p className="text-zinc-500 mt-1.5 text-sm">Kelola dan pantau semua lamaran kerja Anda di sini.</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <GlareHover
                    as={Link}
                    to="/jobs"
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
                      Cari Lowongan
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </GlareHover>

                  <GlareHover
                    as={Link}
                    to="/pelamar/profile"
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
                      <User className="w-4 h-4" />
                      Edit Profil
                    </span>
                  </GlareHover>
                </div>
              </div>
            </div>
          </motion.div>

          {!loading && (
            <motion.div
              className="mt-8 grid grid-cols-5 gap-4"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 }}
            >
              {statCards.map(({ label, value, icon: Icon, color }, idx) => {
                const gradientMap = {
                  "text-zinc-300": "from-zinc-600/20 to-transparent",
                  "text-amber-400": "from-amber-500/15 to-transparent",
                  "text-violet-400": "from-violet-500/15 to-transparent",
                  "text-emerald-400": "from-emerald-500/15 to-transparent",
                  "text-red-400": "from-red-500/15 to-transparent",
                };
                return (
                  <motion.div
                    key={label}
                    className="relative bg-zinc-900/70 border rounded-2xl p-5 hover:scale-[1.02] transition-all duration-300 overflow-hidden group"
                    style={{ borderColor: idx === 0 ? "#27272a" : undefined }}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.28 + 0.06 * idx }}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-b ${gradientMap[color] || "from-zinc-600/20 to-transparent"} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                    <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${idx === 0 ? "from-zinc-500 to-transparent" : color.replace("text-", "from-").replace("400", "500/80") + " to-transparent"}`} />
                    <div className="relative">
                      <Icon className={`w-5 h-5 ${color}`} />
                      <p className="text-2xl font-bold text-zinc-50 mt-3">{value}</p>
                      <p className="text-xs text-zinc-500 mt-0.5">{label}</p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          <section id="riwayat" className="mt-10">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                <FileText className="w-4 h-4 text-zinc-300" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-zinc-50">Riwayat Lamaran</h2>
                <p className="text-[11px] text-zinc-500">Semua lamaran yang telah kamu kirim</p>
              </div>
            </div>

            {loading && (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 bg-zinc-800/30 rounded-2xl animate-pulse" />
                ))}
              </div>
            )}

            {!loading && applications.length === 0 && (
              <motion.div
                className="bg-zinc-900/70 border border-zinc-800 rounded-3xl p-12 text-center"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.35 }}
              >
                <div className="w-14 h-14 rounded-2xl bg-zinc-800/50 border border-zinc-700/50 flex items-center justify-center mx-auto">
                  <Send className="w-6 h-6 text-zinc-500" />
                </div>
                <p className="text-zinc-400 mt-4 text-sm font-medium">Belum ada lamaran terkirim</p>
                <p className="text-zinc-600 text-xs mt-1">Mulai cari lowongan dan kirim lamaran pertama Anda.</p>
                <div className="mt-6 inline-block">
                  <GlareHover
                    as={Link}
                    to="/jobs"
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
                      Cari Lowongan
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </GlareHover>
                </div>
              </motion.div>
            )}

            {!loading && applications.length > 0 && (
              <div className="space-y-3">
                {applications.map((item, i) => {
                  const cfg = statusConfig[item.status] || statusFallback;
                  const initial = item.company_name?.charAt(0)?.toUpperCase() || "?";
                  return (
                    <motion.div
                      key={item.id}
                      className="group relative bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5 hover:bg-zinc-800/60 hover:border-zinc-700 transition-all overflow-hidden"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.04 * i }}
                    >
                      <div className={`absolute left-0 top-0 bottom-0 w-0.5 ${cfg.dot} opacity-30`} />
                      <div className="flex items-center gap-4">
                        <div className="hidden sm:flex w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 items-center justify-center shrink-0">
                          <span className="text-sm font-bold text-zinc-400">{initial}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <h3 className="text-zinc-50 font-semibold text-base truncate group-hover:text-white transition-colors">
                              {item.title}
                            </h3>
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium ${cfg.bg} ${cfg.text}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                              {cfg.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mt-1.5 text-xs text-zinc-500">
                            <span className="flex items-center gap-1">
                              <Building2 className="w-3 h-3" /> {item.company_name}
                            </span>
                            {item.location && (
                              <>
                                <span className="w-0.5 h-0.5 rounded-full bg-zinc-600" />
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" /> {item.location}
                                </span>
                              </>
                            )}
                            {item.applied_at && (
                              <>
                                <span className="w-0.5 h-0.5 rounded-full bg-zinc-600" />
                                <span className="flex items-center gap-1">
                                  <CalendarDays className="w-3 h-3" /> {new Date(item.applied_at).toLocaleDateString("id-ID")}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </section>
        </main>
      </motion.div>

      <LogoutModal
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        onConfirm={confirmLogout}
        userName={user?.name}
      />
    </div>
  );
}

export default PelamarDashboard;
