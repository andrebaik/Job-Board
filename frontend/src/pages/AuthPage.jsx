import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Mail,
  Lock,
  User,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowLeft,
  Briefcase,
  Search,
  Users,
  ShieldCheck,
  CheckCircle,
} from "lucide-react";
import SoftAurora from "../components/SoftAurora";

function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();

  const isLogin = location.pathname === "/login";

  /* ── Login state ── */
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  /* ── Register state ── */
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    role: "pelamar",
    password: "",
  });
  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState("");
  const [registerLoading, setRegisterLoading] = useState(false);

  /* ── Global banner ── */
  const [globalSuccess, setGlobalSuccess] = useState("");

  /* ── Stats ── */
  const [stats, setStats] = useState({
    companies: 0,
    applicants: 0,
    filledJobs: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);

  const formatNumber = (value) =>
    `${new Intl.NumberFormat("id-ID").format(value || 0)}`;

  useEffect(() => {
    let isMounted = true;
    const loadStats = async () => {
      try {
        const API_BASE =
          import.meta.env.VITE_API_BASE || "http://localhost:5000/api";
        const response = await fetch(`${API_BASE}/stats/public`);
        if (!response.ok) throw new Error("Gagal mengambil statistik");
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
        if (isMounted) setStatsLoading(false);
      }
    };
    loadStats();
    return () => {
      isMounted = false;
    };
  }, []);

  /* ── Pick up success message ── */
  useEffect(() => {
    if (isLogin && location.state?.success) {
      setGlobalSuccess(location.state.success);
      window.history.replaceState({}, document.title);
    } else {
      setGlobalSuccess("");
    }
  }, [isLogin, location.state]);

  /* ── Login handlers ── */
  const handleLoginChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoginLoading(true);
      setLoginError("");
      const user = await login(loginForm.email, loginForm.password);
      if (user.role === "admin") navigate("/admin/dashboard");
      else if (user.role === "pelamar") navigate("/pelamar/dashboard");
      else if (user.role === "perusahaan") navigate("/company/dashboard");
    } catch (error) {
      setLoginError(error.response?.data?.message || "Login gagal");
    } finally {
      setLoginLoading(false);
    }
  };

  /* ── Register handlers ── */
  const handleRegisterChange = (e) => {
    setRegisterForm({ ...registerForm, [e.target.name]: e.target.value });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      setRegisterLoading(true);
      setRegisterError("");
      setRegisterSuccess("");
      await register(registerForm);
      setRegisterSuccess("Register berhasil. Silakan login.");
      setTimeout(() => {
        navigate("/login", {
          state: { success: "Register berhasil. Silakan login." },
        });
      }, 1200);
    } catch (error) {
      setRegisterError(error.response?.data?.message || "Register gagal");
    } finally {
      setRegisterLoading(false);
    }
  };

  /* ── Mode switch ── */
  const switchToLogin = () => {
    setLoginError("");
    navigate("/login");
  };

  const switchToRegister = () => {
    setRegisterError("");
    setRegisterSuccess("");
    navigate("/register");
  };

  /* ── Hero content ── */
  const heroContent = (
    <>
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="absolute -bottom-32 -left-16 w-80 h-80 rounded-full bg-violet-500/10 blur-3xl" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full border border-white/5" />

      <div className="relative z-10 max-w-lg">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
              <img src="/Brekerja.png" alt="Work'in" className="w-8 h-8 object-contain" />
            </div>
            <span className="text-white font-semibold text-lg tracking-tight">
              Work'in
            </span>
          </div>

          <h1 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
            Temukan Peluang
            <br />
            Karier Terbaikmu
          </h1>
          <p className="mt-4 text-slate-400 leading-relaxed text-base">
            Platform lowongan kerja terpercaya yang menghubungkan talenta terbaik
            dengan perusahaan-perusahaan terkemuka di Indonesia.
          </p>

          <div className="mt-10 space-y-4">
            {[
              { icon: Search, text: "Ratusan lowongan dari berbagai industri" },
            { icon: Users, text: "Profil pelamar yang terkurasi dengan baik" },
            { icon: ShieldCheck, text: "Proses rekrutmen yang transparan & aman" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-indigo-300" />
              </div>
              <span className="text-sm text-slate-300">{text}</span>
            </div>
          ))}
        </div>

        <div className="mt-12 flex items-center gap-8">
          {[
            { label: "Perusahaan", value: statsLoading ? "..." : formatNumber(stats.companies) },
            { label: "Pelamar Aktif", value: statsLoading ? "..." : formatNumber(stats.applicants) },
            { label: "Lowongan Terisi", value: statsLoading ? "..." : formatNumber(stats.filledJobs) },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-white font-bold text-lg">{value}</p>
              <p className="text-slate-500 text-xs mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  /* ── Condensed hero (mobile) ── */
  const condensedHero = (
    <>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center">
          <img src="/Brekerja.png" alt="Work'in" className="w-7 h-7 object-contain" />
        </div>
        <span className="text-white font-semibold text-base tracking-tight">
          Work'in
        </span>
      </div>
      <h1 className="text-2xl font-bold text-white leading-tight">
        Temukan Peluang Karier Terbaikmu
      </h1>
      <p className="mt-2 text-sm text-slate-400">
        Platform lowongan kerja terpercaya di Indonesia.
      </p>
    </>
  );

  /* ── Login form content ── */
  const loginContent = (
    <>
      <h2 className="text-2xl font-bold text-slate-900">Masuk</h2>
      <p className="text-slate-500 mt-1.5">
        Selamat datang kembali, silakan masuk ke akun Anda.
      </p>

      {globalSuccess && (
        <div className="mt-6 bg-emerald-50 border border-emerald-100 text-emerald-700 px-4 py-3 rounded-xl text-sm flex items-start gap-2.5">
          <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-emerald-500" />
          <span>{globalSuccess}</span>
        </div>
      )}

      {loginError && (
        <div className="mt-6 bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl text-sm flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
          <span>{loginError}</span>
        </div>
      )}

      <form onSubmit={handleLoginSubmit} className="mt-8 space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700">Email</label>
          <div className="relative mt-1.5">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="email"
              name="email"
              value={loginForm.email}
              onChange={handleLoginChange}
              placeholder="nama@email.com"
              autoComplete="email"
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm outline-none transition-all duration-200 bg-slate-50 placeholder:text-slate-400 hover:border-slate-300 focus:bg-white focus:border-indigo-500 focus:ring-3 focus:ring-indigo-100"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Password</label>
          <div className="relative mt-1.5">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={loginForm.password}
              onChange={handleLoginChange}
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
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loginLoading}
          className="w-full py-2.5 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 disabled:bg-slate-400 transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
        >
          {loginLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Memproses...
            </>
          ) : (
            "Login"
          )}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-slate-500">
        Belum punya akun?{" "}
        <button
          type="button"
          onClick={switchToRegister}
          className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors cursor-pointer"
        >
          Daftar
        </button>
      </p>
    </>
  );

  /* ── Register form content ── */
  const registerContent = (
    <>
      <h2 className="text-2xl font-bold text-slate-900">Daftar</h2>
      <p className="text-slate-500 mt-1.5">
        Buat akun baru untuk mulai melamar atau membuka lowongan.
      </p>

      {registerError && (
        <div className="mt-6 bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl text-sm flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
          <span>{registerError}</span>
        </div>
      )}

      {registerSuccess && (
        <div className="mt-6 bg-emerald-50 border border-emerald-100 text-emerald-700 px-4 py-3 rounded-xl text-sm flex items-start gap-2.5">
          <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-emerald-500" />
          <span>{registerSuccess}</span>
        </div>
      )}

      <form onSubmit={handleRegisterSubmit} className="mt-8 space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700">Nama</label>
          <div className="relative mt-1.5">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              name="name"
              value={registerForm.name}
              onChange={handleRegisterChange}
              placeholder="Nama lengkap"
              autoComplete="name"
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm outline-none transition-all duration-200 bg-slate-50 placeholder:text-slate-400 hover:border-slate-300 focus:bg-white focus:border-indigo-500 focus:ring-3 focus:ring-indigo-100"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Email</label>
          <div className="relative mt-1.5">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="email"
              name="email"
              value={registerForm.email}
              onChange={handleRegisterChange}
              placeholder="nama@email.com"
              autoComplete="email"
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm outline-none transition-all duration-200 bg-slate-50 placeholder:text-slate-400 hover:border-slate-300 focus:bg-white focus:border-indigo-500 focus:ring-3 focus:ring-indigo-100"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Role</label>
          <div className="relative mt-1.5">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <select
              name="role"
              value={registerForm.role}
              onChange={handleRegisterChange}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm outline-none transition-all duration-200 bg-slate-50 text-slate-700 hover:border-slate-300 focus:bg-white focus:border-indigo-500 focus:ring-3 focus:ring-indigo-100 appearance-none"
            >
              <option value="pelamar">Pelamar</option>
              <option value="perusahaan">Perusahaan</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Password</label>
          <div className="relative mt-1.5">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="password"
              name="password"
              value={registerForm.password}
              onChange={handleRegisterChange}
              placeholder="Buat password"
              autoComplete="new-password"
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm outline-none transition-all duration-200 bg-slate-50 placeholder:text-slate-400 hover:border-slate-300 focus:bg-white focus:border-indigo-500 focus:ring-3 focus:ring-indigo-100"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={registerLoading}
          className="w-full py-2.5 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 disabled:bg-slate-400 transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
        >
          {registerLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Memproses...
            </>
          ) : (
            "Daftar"
          )}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-slate-500">
        Sudah punya akun?{" "}
        <button
          type="button"
          onClick={switchToLogin}
          className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors cursor-pointer"
        >
          Masuk
        </button>
      </p>
    </>
  );

  /* ── Animation classes ── */
  const panelTransition = "transition-all duration-700 ease-in-out";

  const darkPos = isLogin
    ? "lg:translate-x-0"
    : "lg:translate-x-full";

  const whitePos = isLogin
    ? "lg:translate-x-0"
    : "lg:-translate-x-full";

  const mobileFormTransition =
    "transition-all duration-500 ease-in-out col-start-1 row-start-1";

  const mobileLoginClasses = isLogin
    ? "opacity-100 translate-x-0 pointer-events-auto"
    : "opacity-0 -translate-x-6 pointer-events-none";

  const mobileRegisterClasses = isLogin
    ? "opacity-0 translate-x-6 pointer-events-none"
    : "opacity-100 translate-x-0 pointer-events-auto";

  return (
    <div className="min-h-screen">
      {/* ═══════ Desktop: Panel swap ═══════ */}
      <div className="hidden lg:block relative h-screen overflow-hidden bg-slate-900">
        <div
          className={`absolute top-0 left-0 w-1/2 h-full z-10 ${panelTransition} ${darkPos}`}
        >
          <div className="relative h-full flex flex-col justify-center px-16 overflow-hidden bg-slate-900">
            <SoftAurora
              speed={0.55}
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
            {heroContent}
          </div>
        </div>

        <div
          className={`absolute top-0 left-1/2 w-1/2 h-full z-20 ${panelTransition} ${whitePos}`}
        >
          <div className="h-full flex items-center justify-center px-12 bg-white">
            <div className="w-full max-w-sm">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 transition-colors mb-6"
              >
                <ArrowLeft className="w-4 h-4" />
                Kembali ke Beranda
              </Link>
              {isLogin ? loginContent : registerContent}
            </div>
          </div>
        </div>
      </div>

      {/* ═══════ Mobile: Stacked ═══════ */}
      <div className="lg:hidden min-h-screen bg-white">
        <div className="relative bg-slate-900 px-6 pt-8 pb-10 overflow-hidden">
          <SoftAurora
            speed={0.25}
            scale={0.8}
            brightness={0.35}
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
          <div className="relative z-10">{condensedHero}</div>
        </div>

        <div className="px-6 py-8">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Beranda
          </Link>
          <div className="relative">
            <div className="grid grid-cols-1">
              <div className={`${mobileFormTransition} ${mobileLoginClasses}`}>
                {loginContent}
              </div>
              <div className={`${mobileFormTransition} ${mobileRegisterClasses}`}>
                {registerContent}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
