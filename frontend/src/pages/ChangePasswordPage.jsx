import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import PageBackground from "../components/ParticleBackground";
import {
  ChevronLeft,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Shield,
} from "lucide-react";

const inputClass =
  "w-full bg-zinc-950 border border-zinc-800 text-zinc-50 placeholder:text-zinc-600 rounded-xl px-4 py-3 text-sm outline-none focus:border-zinc-600 transition-colors pl-10";
const labelClass = "block text-xs font-medium text-zinc-400 mb-1.5";

function PasswordField({ name, label, value, show, onChange, onToggle, placeholder }) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
        <input
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          className={inputClass}
          placeholder={placeholder}
          required
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}

function ChangePasswordPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [show, setShow] = useState({ current: false, new: false, confirm: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const dashboardPath = user?.role === "pelamar"
    ? "/pelamar/profile"
    : user?.role === "perusahaan"
      ? "/company/profile"
      : "/";

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleShow = (field) => {
    setShow({ ...show, [field]: !show[field] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.new_password !== form.confirm_password) {
      setError("Konfirmasi password tidak cocok");
      return;
    }
    if (form.new_password.length < 6) {
      setError("Password baru minimal 6 karakter");
      return;
    }
    try {
      setLoading(true);
      setError("");
      setSuccess("");
      await api.put("/auth/change-password", form);
      setSuccess("Password berhasil diubah!");
      setForm({ current_password: "", new_password: "", confirm_password: "" });
    } catch (error) {
      setError(error.response?.data?.message || "Gagal mengubah password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      <PageBackground />

      <div className="relative z-10 max-w-lg mx-auto px-4 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <button
            type="button"
            onClick={() => navigate(dashboardPath)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-zinc-50 border border-zinc-700 transition-all active:scale-[0.97] mb-6"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            {user?.role === "pelamar" ? "Profil" : "Profil Perusahaan"}
          </button>

          <div className="bg-zinc-900/70 backdrop-blur-sm border border-zinc-800 rounded-2xl p-5 md:p-7">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center">
                <Shield className="w-5 h-5 text-zinc-400" />
              </div>
              <div>
                <h1 className="text-xl font-display font-bold text-zinc-50 tracking-tight">Ganti Password</h1>
                <p className="text-xs text-zinc-500 mt-0.5">Perbarui password akun Anda</p>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-4 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm flex items-center gap-2.5"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-xl text-sm flex items-center gap-2.5"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{success}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <PasswordField
                name="current_password"
                label="Password Saat Ini"
                value={form.current_password}
                show={show.current}
                onChange={handleChange}
                onToggle={() => toggleShow("current")}
                placeholder="Masukkan password saat ini"
              />
              <PasswordField
                name="new_password"
                label="Password Baru"
                value={form.new_password}
                show={show.new}
                onChange={handleChange}
                onToggle={() => toggleShow("new")}
                placeholder="Minimal 6 karakter"
              />
              <PasswordField
                name="confirm_password"
                label="Konfirmasi Password Baru"
                value={form.confirm_password}
                show={show.confirm}
                onChange={handleChange}
                onToggle={() => toggleShow("confirm")}
                placeholder="Ulangi password baru"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-zinc-50 text-zinc-950 font-semibold text-sm hover:bg-zinc-200 transition-all active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 mt-6"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? "Menyimpan..." : "Simpan Password"}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default ChangePasswordPage;
