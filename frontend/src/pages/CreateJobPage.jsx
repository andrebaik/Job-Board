import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { api } from "../api/client";
import PageBackground from "../components/ParticleBackground";
import {
  ChevronLeft,
  Briefcase,
  Wallet,
  FileText,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

const inputClass =
  "w-full bg-zinc-950 border border-zinc-800 text-zinc-50 placeholder:text-zinc-600 rounded-xl px-4 py-3 text-sm outline-none focus:border-zinc-600 transition-colors";
const labelClass = "block text-xs font-medium text-zinc-400 mb-1.5";

const sectionVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, delay: 0.1 * i, ease: "easeOut" },
  }),
};

const jobTypes = ["Full Time", "Part Time", "Internship", "Remote", "Freelance"];

function SectionCard({ icon: Icon, title, description, index, children }) {
  return (
    <motion.div
      custom={index}
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5 md:p-6"
    >
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-8 h-8 rounded-xl bg-zinc-800 flex items-center justify-center">
          <Icon className="w-4 h-4 text-zinc-400" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-zinc-50">{title}</h2>
          {description && (
            <p className="text-[11px] text-zinc-500">{description}</p>
          )}
        </div>
      </div>
      {children}
    </motion.div>
  );
}

function CreateJobPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    category: "",
    location: "",
    job_type: "Full Time",
    salary_min: "",
    salary_max: "",
    description: "",
    requirements: "",
    deadline: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      await api.post("/jobs", {
        title: form.title,
        category: form.category || null,
        location: form.location,
        job_type: form.job_type,
        salary_min: form.salary_min || null,
        salary_max: form.salary_max || null,
        description: form.description,
        requirements: form.requirements,
        deadline: form.deadline,
      });

      setSuccess("Lowongan berhasil dibuat.");
      setTimeout(() => navigate("/company/dashboard"), 800);
    } catch (error) {
      setError(error.response?.data?.message || "Gagal membuat lowongan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      <PageBackground />

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-8 md:py-12">
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.05 }}
            >
              <h1 className="text-2xl font-display font-bold text-zinc-50 tracking-tight">Tambah Lowongan</h1>
              <p className="mt-1 text-sm text-zinc-500">Isi data lowongan pekerjaan baru.</p>
            </motion.div>

            {error && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className="mt-5 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm flex items-center gap-2.5"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className="mt-5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-xl text-sm flex items-center gap-2.5"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{success}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {/* Informasi Dasar */}
              <SectionCard icon={Briefcase} title="Informasi Dasar" description="Judul, kategori, lokasi, dan tipe pekerjaan" index={1}>
                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>Judul Lowongan</label>
                    <input name="title" value={form.title} onChange={handleChange} className={inputClass} placeholder="cth. Frontend Developer" required />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Kategori</label>
                      <input name="category" value={form.category} onChange={handleChange} className={inputClass} placeholder="cth. IT, Design" />
                    </div>
                    <div>
                      <label className={labelClass}>Lokasi</label>
                      <input name="location" value={form.location} onChange={handleChange} className={inputClass} placeholder="cth. Jakarta" required />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Tipe Pekerjaan</label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                        <select name="job_type" value={form.job_type} onChange={handleChange} className="w-full bg-zinc-950 border border-zinc-800 text-zinc-50 rounded-xl py-3 pl-10 pr-4 text-sm outline-none focus:border-zinc-600 transition-colors appearance-none">
                          {jobTypes.map((t) => (
                            <option key={t} value={t} className="bg-zinc-950">{t}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Deadline</label>
                      <input type="date" name="deadline" value={form.deadline} onChange={handleChange} className={inputClass} required />
                    </div>
                  </div>
                </div>
              </SectionCard>

              {/* Gaji */}
              <SectionCard icon={Wallet} title="Gaji" description="Kisaran gaji yang ditawarkan (opsional)" index={2}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Gaji Minimum</label>
                    <input type="number" name="salary_min" value={form.salary_min} onChange={handleChange} className={inputClass} placeholder="cth. 5000000" />
                  </div>
                  <div>
                    <label className={labelClass}>Gaji Maksimum</label>
                    <input type="number" name="salary_max" value={form.salary_max} onChange={handleChange} className={inputClass} placeholder="cth. 10000000" />
                  </div>
                </div>
              </SectionCard>

              {/* Deskripsi & Persyaratan */}
              <SectionCard icon={FileText} title="Deskripsi & Persyaratan" description="Informasi detail lowongan" index={3}>
                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>Deskripsi Pekerjaan</label>
                    <textarea name="description" value={form.description} onChange={handleChange} rows="5" className={inputClass} placeholder="Jelaskan tanggung jawab dan detail pekerjaan..." required />
                  </div>
                  <div>
                    <label className={labelClass}>Persyaratan</label>
                    <textarea name="requirements" value={form.requirements} onChange={handleChange} rows="5" className={inputClass} placeholder="Tulis persyaratan yang dibutuhkan..." required />
                  </div>
                </div>
              </SectionCard>

              {/* Submit */}
              <motion.div
                custom={4}
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                className="pt-2"
              >
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-zinc-50 text-zinc-950 font-semibold text-sm hover:bg-zinc-200 transition-all active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {loading ? "Menyimpan..." : "Simpan Lowongan"}
                </button>
              </motion.div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default CreateJobPage;
