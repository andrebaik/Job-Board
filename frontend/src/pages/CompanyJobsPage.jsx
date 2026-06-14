import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { api } from "../api/client";
import PageBackground from "../components/ParticleBackground";
import ConfirmModal from "../components/ConfirmModal";
import {
  Briefcase,
  Plus,
  FileText,
  Edit3,
  Trash2,
  AlertCircle,
  MapPin,
  Clock,
  Wallet,
  CalendarDays,
  ChevronLeft,
  BarChart3,
  CheckCircle2,
  XCircle,
  Dot,
} from "lucide-react";

const formatRupiah = (num) => {
  if (!num || num === 0) return null;
  return new Intl.NumberFormat("id-ID").format(num);
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const getDaysRemaining = (deadline) => {
  if (!deadline) return null;
  const now = new Date();
  const end = new Date(deadline);
  end.setHours(23, 59, 59, 999);
  const diff = end - now;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, delay: 0.08 * i, ease: "easeOut" },
  }),
};

function CompanyJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/jobs/company/my-jobs");
      setJobs(response.data.data || []);
    } catch (error) {
      setError(error.response?.data?.message || "Gagal mengambil lowongan perusahaan");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/jobs/${deleteTarget.id}`);
      setJobs((prev) => prev.filter((j) => j.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (error) {
      alert(error.response?.data?.message || "Gagal menghapus lowongan");
      setDeleteTarget(null);
    }
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { loadJobs() }, []);

  const stats = useMemo(() => {
    const total = jobs.length;
    const open = jobs.filter((j) => j.status === "open").length;
    const closed = jobs.filter((j) => j.status === "closed").length;
    return { total, open, closed };
  }, [jobs]);

  const statItems = [
    { label: "Total", value: stats.total, icon: BarChart3, color: "text-zinc-50" },
    { label: "Dibuka", value: stats.open, icon: CheckCircle2, color: "text-emerald-400" },
    { label: "Ditutup", value: stats.closed, icon: XCircle, color: "text-red-400" },
  ];

  const renderSkeleton = () => (
    <div className="space-y-4 mt-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5 animate-pulse">
          <div className="h-5 w-48 bg-zinc-800 rounded-lg" />
          <div className="mt-3 h-4 w-72 bg-zinc-800 rounded-lg" />
          <div className="mt-2 h-4 w-56 bg-zinc-800 rounded-lg" />
        </div>
      ))}
    </div>
  );

  const renderEmpty = () => (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="text-center py-16"
    >
      <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center mx-auto mb-4">
        <FileText className="w-7 h-7 text-zinc-500" />
      </div>
      <p className="text-zinc-400 text-sm">Belum ada lowongan.</p>
      <p className="text-zinc-600 text-xs mt-1">Buat lowongan pertama untuk mulai merekrut</p>
      <Link
        to="/company/jobs/create"
        className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-xl bg-zinc-50 text-zinc-950 text-sm font-semibold hover:bg-zinc-200 transition-all active:scale-[0.97]"
      >
        <Plus className="w-4 h-4" />
        Buat Lowongan Pertama
      </Link>
    </motion.div>
  );

  const renderJobCard = (job, index) => {
    const daysRemaining = getDaysRemaining(job.deadline);
    const isUrgent = daysRemaining !== null && daysRemaining <= 7 && daysRemaining >= 0;
    const salary =
      formatRupiah(job.salary_min) && formatRupiah(job.salary_max)
        ? `Rp${formatRupiah(job.salary_min)} — Rp${formatRupiah(job.salary_max)}`
        : formatRupiah(job.salary_min)
          ? `Rp${formatRupiah(job.salary_min)}`
          : formatRupiah(job.salary_max)
            ? `Rp${formatRupiah(job.salary_max)}`
            : null;

    return (
      <motion.div
        key={job.id}
        custom={index}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        layout
        className="group bg-zinc-900/70 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-5 transition-all duration-200"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5">
              <h3 className="text-base font-semibold text-zinc-50 truncate">
                {job.title}
              </h3>
              <span
                className={`shrink-0 px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                  job.status === "open"
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-red-500/10 text-red-400"
                }`}
              >
                {job.status === "open" ? "Dibuka" : "Ditutup"}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs text-zinc-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {job.location || "Indonesia"}
              </span>
              <Dot className="w-3 h-3 text-zinc-700 shrink-0" />
              <span className="flex items-center gap-1">
                <Briefcase className="w-3 h-3" />
                {job.job_type}
              </span>
              {job.category && (
                <>
                  <Dot className="w-3 h-3 text-zinc-700 shrink-0" />
                  <span>{job.category}</span>
                </>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs">
              {salary && (
                <span className="flex items-center gap-1.5 text-zinc-400 font-mono">
                  <Wallet className="w-3 h-3 text-zinc-500" />
                  {salary}
                </span>
              )}
              {job.deadline && (
                <span
                  className={`flex items-center gap-1.5 font-mono ${
                    isUrgent ? "text-amber-400" : "text-zinc-500"
                  }`}
                >
                  <CalendarDays className="w-3 h-3" />
                  {formatDate(job.deadline)}
                  {daysRemaining !== null && daysRemaining >= 0 && (
                    <span className="text-[11px] opacity-80">
                      ({daysRemaining} hari)
                    </span>
                  )}
                </span>
              )}
              <span className="flex items-center gap-1.5 text-zinc-500 font-mono">
                <Clock className="w-3 h-3" />
                {formatDate(job.created_at)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 md:shrink-0">
            <Link
              to={`/company/jobs/${job.id}/edit`}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-zinc-50 border border-zinc-700 text-xs font-medium transition-all active:scale-[0.97]"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Edit
            </Link>
            <button
              onClick={() => setDeleteTarget(job)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 text-xs font-medium transition-all active:scale-[0.97]"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Hapus
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      <PageBackground />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            to="/company/dashboard"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-zinc-50 border border-zinc-700 transition-all active:scale-[0.97] mb-6"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Dashboard
          </Link>

          <div className="bg-zinc-900/70 backdrop-blur-sm border border-zinc-800 rounded-2xl p-5 md:p-7">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-display font-bold text-zinc-50 tracking-tight">Kelola Lowongan</h1>
                <p className="mt-1 text-sm text-zinc-500">Kelola lowongan pekerjaan perusahaan Anda</p>
              </div>
              <Link
                to="/company/jobs/create"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-50 text-zinc-950 text-sm font-semibold hover:bg-zinc-200 transition-all active:scale-[0.97] shrink-0"
              >
                <Plus className="w-4 h-4" />
                Tambah Lowongan
              </Link>
            </div>

            {/* Stats Bar */}
            {!loading && !error && jobs.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="flex items-center gap-4 mt-6 py-3 px-4 bg-zinc-800/40 rounded-xl border border-zinc-700/50"
              >
                {statItems.map((item, idx) => (
                  <div key={item.label} className="flex items-center gap-2">
                    {idx > 0 && <span className="w-px h-5 bg-zinc-700/50 hidden sm:block" />}
                    <div className="flex items-center gap-2 px-2">
                      <item.icon className={`w-4 h-4 ${item.color}`} />
                      <span className="text-xs text-zinc-500">{item.label}</span>
                      <span className={`text-sm font-semibold font-mono ${item.color}`}>
                        {item.value}
                      </span>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Error */}
            {!loading && error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm flex items-center gap-2.5"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span className="flex-1">{error}</span>
                <button
                  onClick={loadJobs}
                  className="px-3 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-xs font-medium border border-red-500/20 transition-all"
                >
                  Coba Lagi
                </button>
              </motion.div>
            )}

            {/* Loading */}
            {loading && renderSkeleton()}

            {/* Empty */}
            {!loading && !error && jobs.length === 0 && renderEmpty()}

            {/* Job List */}
            {!loading && !error && jobs.length > 0 && (
              <div className="mt-6 space-y-3">
                <AnimatePresence mode="popLayout">
                  {jobs.map((job, idx) => renderJobCard(job, idx))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Delete Confirmation */}
      <ConfirmModal
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Hapus Lowongan"
        message={`Yakin ingin menghapus lowongan "${deleteTarget?.title || ""}"?`}
        confirmText="Ya, Hapus"
        cancelText="Batal"
        variant="danger"
      />
    </div>
  );
}

export default CompanyJobsPage;
