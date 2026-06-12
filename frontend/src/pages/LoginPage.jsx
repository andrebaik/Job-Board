import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Mail,
  Lock,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
  Briefcase,
  Search,
  Users,
  ShieldCheck,
} from "lucide-react";
import SoftAurora from "../components/SoftAurora";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const [stats, setStats] = useState({
    companies: 0,
    applicants: 0,
    filledJobs: 0,
  });

  const [statsLoading, setStatsLoading] = useState(true);

  const formatNumber = (value) => {
    return `${new Intl.NumberFormat("id-ID").format(value || 0)}+`;
  };

  useEffect(() => {
    let isMounted = true;

    const loadStats = async () => {
      try {
        const API_BASE =
          import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

        const response = await fetch(`${API_BASE}/stats/public`);

        if (!response.ok) {
          throw new Error("Gagal mengambil statistik");
        }

        const data = await response.json();

        if (isMounted) {
          setStats({
            companies: data.companies || 0,
            applicants: data.applicants || 0,
            filledJobs: data.filledJobs || 0,
          });
        }
      } catch (error) {
        console.error("Gagal mengambil stats:", error);
      } finally {
        if (isMounted) {
          setStatsLoading(false);
        }
      }
    };

    loadStats();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const user = await login(form.email, form.password);

      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (user.role === "pelamar") {
        navigate("/pelamar/dashboard");
      } else if (user.role === "perusahaan") {
        navigate("/company/dashboard");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Login gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* ── Left: Brand / Hero ── */}
      <div className="relative flex-1 flex flex-col justify-center px-8 py-12 lg:px-16 lg:py-0 overflow-hidden bg-slate-900">
        <SoftAurora
          speed={0.25}
          scale={1.0}
          brightness={0.45}
          color1="#6366f1"
          color2="#8b5cf6"
          noiseFrequency={1.8}
          noiseAmplitude={0.6}
          bandHeight={0.35}
          bandSpread={0.8}
          octaveDecay={0.12}
          layerOffset={0.4}
          colorSpeed={0.8}
        />

        <div className="relative z-10 max-w-lg">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-slate-900" />
            </div>
            <span className="text-white font-semibold text-lg tracking-tight">
              JobBoard
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
            Temukan Peluang
            <br />
            Karier Terbaikmu
          </h1>
          <p className="mt-4 text-slate-400 leading-relaxed text-base">
            Platform lowongan kerja terpercaya yang menghubungkan talenta
            terbaik dengan perusahaan-perusahaan terkemuka di Indonesia.
          </p>

          {/* Feature highlights */}
          <div className="mt-10 space-y-4">
            {[
              {
                icon: Search,
                text: "Ratusan lowongan dari berbagai industri",
              },
              {
                icon: Users,
                text: "Profil pelamar yang terkurasi dengan baik",
              },
              {
                icon: ShieldCheck,
                text: "Proses rekrutmen yang transparan & aman",
              },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-indigo-300" />
                </div>
                <span className="text-sm text-slate-300">{text}</span>
              </div>
            ))}
          </div>

          {/* Trust badges */}
          <div className="mt-12 flex items-center gap-8">
            {[
              {
                label: "Perusahaan",
                value: statsLoading ? "..." : formatNumber(stats.companies),
              },
              {
                label: "Pelamar Aktif",
                value: statsLoading ? "..." : formatNumber(stats.applicants),
              },
              {
                label: "Lowongan Terisi",
                value: statsLoading ? "..." : formatNumber(stats.filledJobs),
              },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-white font-bold text-lg">{value}</p>
                <p className="text-slate-500 text-xs mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right: Form ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-12 bg-white">
        <div className="w-full max-w-sm">
          {/* Heading */}
          <h2 className="text-2xl font-bold text-slate-900">Masuk</h2>
          <p className="text-slate-500 mt-1.5">
            Selamat datang kembali, silakan masuk ke akun Anda.
          </p>

          {/* Error */}
          {error && (
            <div className="mt-6 bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl text-sm flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Email
              </label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="nama@email.com"
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm outline-none transition-all duration-200 bg-slate-50 placeholder:text-slate-400 hover:border-slate-300 focus:bg-white focus:border-indigo-500 focus:ring-3 focus:ring-indigo-100"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Masukkan password"
                  autoComplete="current-password"
                  className="w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-lg text-sm outline-none transition-all duration-200 bg-slate-50 placeholder:text-slate-400 hover:border-slate-300 focus:bg-white focus:border-indigo-500 focus:ring-3 focus:ring-indigo-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 disabled:bg-slate-400 transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>

          {/* Register link */}
          <p className="mt-8 text-center text-sm text-slate-500">
            Belum punya akun?{" "}
            <Link
              to="/register"
              className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
            >
              Daftar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
