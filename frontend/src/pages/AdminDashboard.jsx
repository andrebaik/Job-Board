import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "motion/react";
import LogoutModal from "../components/LogoutModal";
import ConfirmModal from "../components/ConfirmModal";
import DataTable from "../components/DataTable";
import AdminCharts from "../components/charts/AdminCharts";
import PageBackground from "../components/ParticleBackground";
import { adminApi } from "../api/client";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  FileText,
  Building2,
  LogOut,
  ChevronLeft,
  Shield,
  CheckCircle,
  Search,
} from "lucide-react";

const statusConfig = {
  menunggu: { label: "Menunggu", bg: "bg-amber-500/10", text: "text-amber-400", dot: "bg-amber-500" },
  dilihat: { label: "Dilihat", bg: "bg-blue-500/10", text: "text-blue-400", dot: "bg-blue-500" },
  interview: { label: "Interview", bg: "bg-violet-500/10", text: "text-violet-400", dot: "bg-violet-500" },
  diterima: { label: "Diterima", bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-500" },
  ditolak: { label: "Ditolak", bg: "bg-red-500/10", text: "text-red-400", dot: "bg-red-500" },
};

const verificationStyles = {
  pending: { label: "Pending", bg: "bg-amber-500/10", text: "text-amber-400" },
  verified: { label: "Terverifikasi", bg: "bg-emerald-500/10", text: "text-emerald-400" },
  rejected: { label: "Ditolak", bg: "bg-red-500/10", text: "text-red-400" },
};

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, action: "dashboard" },
  { label: "Kelola User", icon: Users, action: "users" },
  { label: "Kelola Lowongan", icon: Briefcase, action: "jobs" },
  { label: "Kelola Lamaran", icon: FileText, action: "applications" },
  { label: "Perusahaan", icon: Building2, action: "companies" },
];

function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeNav, setActiveNav] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmData, setConfirmData] = useState(null);

  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const [pelamarUsers, setPelamarUsers] = useState([]);
  const [pelamarLoading, setPelamarLoading] = useState(false);
  const [pelamarPage, setPelamarPage] = useState(1);
  const [pelamarPagination, setPelamarPagination] = useState(null);
  const [pelamarSearch, setPelamarSearch] = useState("");

  const [perusahaanUsers, setPerusahaanUsers] = useState([]);
  const [perusahaanLoading, setPerusahaanLoading] = useState(false);
  const [perusahaanPage, setPerusahaanPage] = useState(1);
  const [perusahaanPagination, setPerusahaanPagination] = useState(null);
  const [perusahaanSearch, setPerusahaanSearch] = useState("");

  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [jobsPage, setJobsPage] = useState(1);
  const [jobsPagination, setJobsPagination] = useState(null);
  const [jobsSearch, setJobsSearch] = useState("");

  const [applications, setApplications] = useState([]);
  const [appsLoading, setAppsLoading] = useState(false);
  const [appsPage, setAppsPage] = useState(1);
  const [appsPagination, setAppsPagination] = useState(null);
  const [appsSearch, setAppsSearch] = useState("");

  const [companies, setCompanies] = useState([]);
  const [companiesLoading, setCompaniesLoading] = useState(false);
  const [companiesPage, setCompaniesPage] = useState(1);
  const [companiesPagination, setCompaniesPagination] = useState(null);
  const [companiesSearch, setCompaniesSearch] = useState("");

  const loadStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const res = await adminApi.getStats();
      setStats(res.data.data);
    } catch {
      // silent
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const loadPelamarUsers = useCallback(async (page = 1, q = "") => {
    try {
      setPelamarLoading(true);
      const res = await adminApi.getUsers({ page, limit: 10, q, role: "pelamar" });
      setPelamarUsers(res.data.data);
      setPelamarPagination(res.data.pagination);
    } catch {
      // silent
    } finally {
      setPelamarLoading(false);
    }
  }, []);

  const loadPerusahaanUsers = useCallback(async (page = 1, q = "") => {
    try {
      setPerusahaanLoading(true);
      const res = await adminApi.getUsers({ page, limit: 10, q, role: "perusahaan" });
      setPerusahaanUsers(res.data.data);
      setPerusahaanPagination(res.data.pagination);
    } catch {
      // silent
    } finally {
      setPerusahaanLoading(false);
    }
  }, []);

  const loadJobs = useCallback(async (page = 1, q = "") => {
    try {
      setJobsLoading(true);
      const res = await adminApi.getJobs({ page, limit: 10, q });
      setJobs(res.data.data);
      setJobsPagination(res.data.pagination);
    } catch {
      // silent
    } finally {
      setJobsLoading(false);
    }
  }, []);

  const loadApplications = useCallback(async (page = 1, q = "") => {
    try {
      setAppsLoading(true);
      const res = await adminApi.getApplications({ page, limit: 10, q });
      setApplications(res.data.data);
      setAppsPagination(res.data.pagination);
    } catch {
      // silent
    } finally {
      setAppsLoading(false);
    }
  }, []);

  const loadCompanies = useCallback(async (page = 1, q = "") => {
    try {
      setCompaniesLoading(true);
      const res = await adminApi.getCompanies({ page, limit: 10, q });
      setCompanies(res.data.data);
      setCompaniesPagination(res.data.pagination);
    } catch {
      // silent
    } finally {
      setCompaniesLoading(false);
    }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { loadStats(); }, [loadStats]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { if (activeNav === "users") { loadPelamarUsers(pelamarPage, pelamarSearch); loadPerusahaanUsers(perusahaanPage, perusahaanSearch); } }, [activeNav, pelamarPage, pelamarSearch, loadPelamarUsers, perusahaanPage, perusahaanSearch, loadPerusahaanUsers]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { if (activeNav === "jobs") loadJobs(jobsPage, jobsSearch); }, [activeNav, jobsPage, jobsSearch, loadJobs]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { if (activeNav === "applications") loadApplications(appsPage, appsSearch); }, [activeNav, appsPage, appsSearch, loadApplications]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { if (activeNav === "companies") loadCompanies(companiesPage, companiesSearch); }, [activeNav, companiesPage, companiesSearch, loadCompanies]);

  const handleLogout = () => setLogoutOpen(true);
  const confirmLogout = () => {
    logout();
    navigate("/login");
  };

  const handleTogglePelamar = async (userId, isActive) => {
    try {
      await adminApi.updateUser(userId, { is_active: !isActive });
      loadPelamarUsers(pelamarPage, pelamarSearch);
    } catch {
      // silent
    }
  };

  const handleTogglePerusahaan = async (userId, isActive) => {
    try {
      await adminApi.updateUser(userId, { is_active: !isActive });
      loadPerusahaanUsers(perusahaanPage, perusahaanSearch);
    } catch {
      // silent
    }
  };

  const handleDeletePelamar = (userId) => {
    setConfirmData({
      title: "Hapus Pelamar",
      message: "Yakin ingin menghapus pelamar ini? Tindakan ini tidak bisa dibatalkan.",
      variant: "danger",
      confirmText: "Ya, Hapus",
      onConfirm: async () => {
        try {
          await adminApi.deleteUser(userId);
          loadPelamarUsers(pelamarPage, pelamarSearch);
        } catch {
          // silent
        }
        setConfirmOpen(false);
      },
    });
    setConfirmOpen(true);
  };

  const handleDeletePerusahaan = (userId) => {
    setConfirmData({
      title: "Hapus Perusahaan",
      message: "Yakin ingin menghapus perusahaan ini? Tindakan ini tidak bisa dibatalkan.",
      variant: "danger",
      confirmText: "Ya, Hapus",
      onConfirm: async () => {
        try {
          await adminApi.deleteUser(userId);
          loadPerusahaanUsers(perusahaanPage, perusahaanSearch);
        } catch {
          // silent
        }
        setConfirmOpen(false);
      },
    });
    setConfirmOpen(true);
  };

  const handleDeleteJob = (jobId) => {
    setConfirmData({
      title: "Hapus Lowongan",
      message: "Yakin ingin menghapus lowongan ini?",
      variant: "danger",
      confirmText: "Ya, Hapus",
      onConfirm: async () => {
        try {
          await adminApi.deleteJob(jobId);
          loadJobs(jobsPage, jobsSearch);
        } catch {
          // silent
        }
        setConfirmOpen(false);
      },
    });
    setConfirmOpen(true);
  };

  const handleVerifyCompany = async (userId, status) => {
    try {
      await adminApi.verifyCompany(userId, status);
      loadCompanies(companiesPage, companiesSearch);
    } catch {
      // silent
    }
  };

  const statCards = stats
    ? [
        { label: "Total User", value: stats.totalUsers, icon: Users, color: "text-zinc-300" },
        { label: "Pelamar", value: stats.totalPelamar, icon: Search, color: "text-blue-400" },
        { label: "Perusahaan", value: stats.totalCompanies, icon: Building2, color: "text-amber-400" },
        { label: "Total Lowongan", value: stats.totalJobs, icon: Briefcase, color: "text-cyan-400" },
        { label: "Total Lamaran", value: stats.totalApplications, icon: FileText, color: "text-violet-400" },
        { label: "Diterima (30h)", value: stats.acceptedThisMonth, icon: CheckCircle, color: "text-emerald-400" },
      ]
    : [];

  const pelamarColumns = [
    { key: "#", label: "#", width: "60px", render: (_, i) => <span className="text-zinc-500">{i + 1}</span> },
    { key: "name", label: "Nama" },
    { key: "email", label: "Email" },
    {
      key: "is_active",
      label: "Status",
      render: (row) => (
        <button
          onClick={() => handleTogglePelamar(row.id, row.is_active)}
          className={`px-2.5 py-0.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
            row.is_active
              ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
              : "bg-red-500/10 text-red-400 hover:bg-red-500/20"
          }`}
        >
          {row.is_active ? "Aktif" : "Nonaktif"}
        </button>
      ),
    },
    {
      key: "created_at",
      label: "Dibuat",
      render: (row) => (
        <span className="text-zinc-500 text-xs">{new Date(row.created_at).toLocaleDateString("id-ID")}</span>
      ),
    },
    {
      key: "actions",
      label: "Aksi",
      width: "80px",
      render: (row) => (
        <button
          onClick={() => handleDeletePelamar(row.id)}
          className="text-red-400 hover:text-red-300 text-xs font-medium transition-all cursor-pointer"
        >
          Hapus
        </button>
      ),
    },
  ];

  const perusahaanColumns = [
    { key: "#", label: "#", width: "60px", render: (_, i) => <span className="text-zinc-500">{i + 1}</span> },
    { key: "name", label: "Nama" },
    { key: "email", label: "Email" },
    {
      key: "is_active",
      label: "Status",
      render: (row) => (
        <button
          onClick={() => handleTogglePerusahaan(row.id, row.is_active)}
          className={`px-2.5 py-0.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
            row.is_active
              ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
              : "bg-red-500/10 text-red-400 hover:bg-red-500/20"
          }`}
        >
          {row.is_active ? "Aktif" : "Nonaktif"}
        </button>
      ),
    },
    {
      key: "created_at",
      label: "Dibuat",
      render: (row) => (
        <span className="text-zinc-500 text-xs">{new Date(row.created_at).toLocaleDateString("id-ID")}</span>
      ),
    },
    {
      key: "actions",
      label: "Aksi",
      width: "80px",
      render: (row) => (
        <button
          onClick={() => handleDeletePerusahaan(row.id)}
          className="text-red-400 hover:text-red-300 text-xs font-medium transition-all cursor-pointer"
        >
          Hapus
        </button>
      ),
    },
  ];

  const jobColumns = [
    { key: "#", label: "#", width: "60px", render: (_, i) => <span className="text-zinc-500">{i + 1}</span> },
    { key: "title", label: "Judul" },
    { key: "company_name", label: "Perusahaan" },
    { key: "location", label: "Lokasi" },
    { key: "job_type", label: "Tipe" },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <span
          className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
            row.status === "open"
              ? "bg-emerald-500/10 text-emerald-400"
              : "bg-red-500/10 text-red-400"
          }`}
        >
          {row.status === "open" ? "Dibuka" : "Ditutup"}
        </span>
      ),
    },
    {
      key: "created_at",
      label: "Dibuat",
      render: (row) => (
        <span className="text-zinc-500 text-xs">{new Date(row.created_at).toLocaleDateString("id-ID")}</span>
      ),
    },
    {
      key: "actions",
      label: "Aksi",
      width: "80px",
      render: (row) => (
        <button
          onClick={() => handleDeleteJob(row.id)}
          className="text-red-400 hover:text-red-300 text-xs font-medium transition-all cursor-pointer"
        >
          Hapus
        </button>
      ),
    },
  ];

  const appColumns = [
    { key: "#", label: "#", width: "60px", render: (_, i) => <span className="text-zinc-500">{i + 1}</span> },
    { key: "applicant_name", label: "Pelamar" },
    { key: "job_title", label: "Lowongan" },
    { key: "company_name", label: "Perusahaan" },
    {
      key: "status",
      label: "Status",
      render: (row) => {
        const cfg = statusConfig[row.status] || { label: row.status, bg: "bg-zinc-500/10", text: "text-zinc-400", dot: "bg-zinc-500" };
        return (
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            {cfg.label}
          </div>
        );
      },
    },
    {
      key: "applied_at",
      label: "Tanggal",
      render: (row) => (
        <span className="text-zinc-500 text-xs">{new Date(row.applied_at).toLocaleDateString("id-ID")}</span>
      ),
    },
  ];

  const companyColumns = [
    { key: "#", label: "#", width: "60px", render: (_, i) => <span className="text-zinc-500">{i + 1}</span> },
    { key: "company_name", label: "Perusahaan" },
    { key: "email", label: "Email" },
    { key: "industry", label: "Industri" },
    {
      key: "verification_status",
      label: "Verifikasi",
      render: (row) => {
        const s = verificationStyles[row.verification_status] || verificationStyles.pending;
        return (
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${s.bg} ${s.text}`}>
            {s.label}
          </span>
        );
      },
    },
    {
      key: "actions",
      label: "Aksi",
      width: "180px",
      render: (row) => (
        <div className="flex gap-1">
          {row.verification_status !== "verified" && (
            <button
              onClick={() => handleVerifyCompany(row.id, "verified")}
              className="px-2 py-1 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-all cursor-pointer"
            >
              Verifikasi
            </button>
          )}
          {row.verification_status !== "rejected" && (
            <button
              onClick={() => handleVerifyCompany(row.id, "rejected")}
              className="px-2 py-1 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all cursor-pointer"
            >
              Tolak
            </button>
          )}
          {row.verification_status !== "pending" && (
            <button
              onClick={() => handleVerifyCompany(row.id, "pending")}
              className="px-2 py-1 rounded-lg text-xs font-medium bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-all cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
      ),
    },
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
              <div className="w-9 h-9 rounded-full bg-violet-500/20 flex items-center justify-center">
                <Shield className="w-4 h-4 text-violet-400" />
              </div>
              <p className="text-zinc-50 text-sm font-medium mt-2 truncate">{user?.name}</p>
              <span className="inline-block mt-1 text-[11px] font-medium text-violet-300 bg-violet-500/10 px-2 py-0.5 rounded-full">
                Admin
              </span>
            </div>
          ) : (
            <div className="flex justify-center mb-6">
              <div className="w-9 h-9 rounded-full bg-violet-500/20 flex items-center justify-center">
                <Shield className="w-4 h-4 text-violet-400" />
              </div>
            </div>
          )}

          <nav className="flex-1 space-y-1">
            {navItems.map((item) => {
              const isActive = activeNav === item.action;
              const classes = `flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-zinc-800 border border-zinc-700 text-zinc-50"
                  : "text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800/50 hover:translate-x-[4px]"
              }`;

              return (
                <button
                  key={item.label}
                  onClick={() => setActiveNav(item.action)}
                  className={`${classes} ${isActive ? "relative" : ""}`}
                  title={sidebarOpen ? undefined : item.label}
                >
                  {isActive && sidebarOpen && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-zinc-50 rounded-full shadow-[0_0_6px_rgba(255,255,255,0.3)]" />
                  )}
                  <item.icon className={`w-4 h-4 shrink-0 ${isActive ? "text-zinc-50" : ""}`} />
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
          {activeNav === "dashboard" && (
            <>
              <motion.div
                className="bg-gradient-to-r from-zinc-700/20 to-transparent border border-zinc-800 rounded-2xl p-8"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
              >
                <h1 className="text-3xl font-bold text-zinc-50">Dashboard Admin</h1>
                <p className="text-zinc-400 mt-1">Kelola user, lowongan, lamaran, dan perusahaan di sini.</p>
              </motion.div>

              {statsLoading && (
                <div className="mt-8 grid grid-cols-3 md:grid-cols-6 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="h-24 bg-zinc-800/50 rounded-2xl animate-pulse" />
                  ))}
                </div>
              )}

              {!statsLoading && stats && (
                <motion.div
                  className="mt-8 grid grid-cols-3 md:grid-cols-6 gap-4"
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

              <div className="mt-8">
                <AdminCharts />
              </div>
            </>
          )}

          {activeNav === "users" && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-8">
                <h2 className="text-xl font-bold text-zinc-50 mb-1">Pelamar</h2>
                <p className="text-zinc-400 text-sm mb-6">Daftar user dengan role pelamar.</p>
                <DataTable
                  columns={pelamarColumns}
                  data={pelamarUsers}
                  loading={pelamarLoading}
                  pagination={pelamarPagination}
                  onSearch={(q) => { setPelamarSearch(q); setPelamarPage(1); }}
                  onPageChange={setPelamarPage}
                  searchPlaceholder="Cari pelamar..."
                />
              </div>
              <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-8">
                <h2 className="text-xl font-bold text-zinc-50 mb-1">Perusahaan</h2>
                <p className="text-zinc-400 text-sm mb-6">Daftar user dengan role perusahaan.</p>
                <DataTable
                  columns={perusahaanColumns}
                  data={perusahaanUsers}
                  loading={perusahaanLoading}
                  pagination={perusahaanPagination}
                  onSearch={(q) => { setPerusahaanSearch(q); setPerusahaanPage(1); }}
                  onPageChange={setPerusahaanPage}
                  searchPlaceholder="Cari perusahaan..."
                />
              </div>
            </motion.div>
          )}

          {activeNav === "jobs" && (
            <motion.div
              className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-8"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-2xl font-bold text-zinc-50 mb-2">Kelola Lowongan</h2>
              <p className="text-zinc-400 text-sm mb-6">Semua lowongan dari seluruh perusahaan.</p>
              <DataTable
                columns={jobColumns}
                data={jobs}
                loading={jobsLoading}
                pagination={jobsPagination}
                onSearch={(q) => { setJobsSearch(q); setJobsPage(1); }}
                onPageChange={setJobsPage}
              />
            </motion.div>
          )}

          {activeNav === "applications" && (
            <motion.div
              className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-8"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-2xl font-bold text-zinc-50 mb-2">Kelola Lamaran</h2>
              <p className="text-zinc-400 text-sm mb-6">Semua lamaran dari seluruh pelamar.</p>
              <DataTable
                columns={appColumns}
                data={applications}
                loading={appsLoading}
                pagination={appsPagination}
                onSearch={(q) => { setAppsSearch(q); setAppsPage(1); }}
                onPageChange={setAppsPage}
              />
            </motion.div>
          )}

          {activeNav === "companies" && (
            <motion.div
              className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-8"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-2xl font-bold text-zinc-50 mb-2">Perusahaan</h2>
              <p className="text-zinc-400 text-sm mb-6">Daftar perusahaan dan status verifikasi.</p>
              <DataTable
                columns={companyColumns}
                data={companies}
                loading={companiesLoading}
                pagination={companiesPagination}
                onSearch={(q) => { setCompaniesSearch(q); setCompaniesPage(1); }}
                onPageChange={setCompaniesPage}
              />
            </motion.div>
          )}
        </main>
      </motion.div>

      <LogoutModal
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        onConfirm={confirmLogout}
        userName={user?.name}
      />

      <ConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmData?.onConfirm || (() => {})}
        title={confirmData?.title || "Konfirmasi"}
        message={confirmData?.message || "Yakin ingin melanjutkan?"}
        confirmText={confirmData?.confirmText || "Ya"}
        variant={confirmData?.variant || "danger"}
      />
    </div>
  );
}

export default AdminDashboard;
