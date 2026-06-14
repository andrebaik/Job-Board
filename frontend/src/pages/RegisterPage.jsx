import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import GlareHover from "../components/GlareHover"
import PageBackground from "../components/ParticleBackground"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../components/ui/Card"
import { Input } from "../components/ui/Input"
import { Label } from "../components/ui/Label"
import { Button } from "../components/ui/Button"
import { Checkbox } from "../components/ui/Checkbox"
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  Users,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react"

function RegisterPage() {
  const navigate = useNavigate()
  const { register, login } = useAuth()

  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "pelamar",
    password: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError("")
      setSuccess("")
      await register(form)
      const userData = await login(form.email, form.password)
      setSuccess("Register berhasil")
      setTimeout(() => {
        if (userData.role === "admin") {
          navigate("/admin/dashboard")
        } else if (userData.role === "perusahaan") {
          navigate("/company/profile?fromRegister=true")
        } else {
          navigate("/pelamar/profile?fromRegister=true")
        }
      }, 800)
    } catch (error) {
      setError(error.response?.data?.message || "Register gagal")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="fixed inset-0 bg-zinc-950 text-zinc-50">
      <PageBackground />

      <style>{`
        .card-animate {
          opacity: 0;
          transform: translateY(20px);
          animation: fadeUp 0.8s cubic-bezier(.22,.61,.36,1) 0.4s forwards;
        }
        @keyframes fadeUp {
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <header className="absolute left-0 right-0 top-0 flex items-center justify-between px-6 py-4 border-b border-zinc-800/80">
        <Link to="/" className="flex items-center gap-2.5">
          <img
            src="/Brekerja.png"
            alt="Work'in"
            className="w-6 h-6 object-contain"
          />
          <span className="text-xs tracking-[0.14em] uppercase text-zinc-400 font-semibold">
            Work'in
          </span>
        </Link>
        <Button
          variant="outline"
          className="h-9 rounded-lg border-zinc-800 bg-zinc-900 text-zinc-50 hover:bg-zinc-900/80"
          asChild
        >
          <Link to="/login">
            <span className="mr-2">Masuk</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </header>

      <div className="h-full w-full grid place-items-center px-4">
        <Card className="card-animate w-full max-w-sm border-zinc-800 bg-zinc-900/70 backdrop-blur supports-[backdrop-filter]:bg-zinc-900/60">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Buat akun</CardTitle>
            <CardDescription className="text-zinc-400">
              Daftar dalam beberapa detik
            </CardDescription>
          </CardHeader>

          <CardContent className="grid gap-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-lg text-sm flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="grid gap-5">
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-zinc-300">
                  Nama
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Nama lengkap"
                    autoComplete="name"
                    className="pl-10 bg-zinc-950 border-zinc-800 text-zinc-50 placeholder:text-zinc-600"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email" className="text-zinc-300">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="nama@email.com"
                    autoComplete="email"
                    className="pl-10 bg-zinc-950 border-zinc-800 text-zinc-50 placeholder:text-zinc-600"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="role" className="text-zinc-300">
                  Role
                </Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
                  <select
                    id="role"
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-md border border-input bg-zinc-950 border-zinc-800 text-zinc-50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 pl-10 appearance-none"
                  >
                    <option value="pelamar" className="bg-zinc-950">Pelamar</option>
                    <option value="perusahaan" className="bg-zinc-950">Perusahaan</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password" className="text-zinc-300">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className="pl-10 pr-10 bg-zinc-950 border-zinc-800 text-zinc-50 placeholder:text-zinc-600"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md text-zinc-400 hover:text-zinc-200 cursor-pointer"
                    onClick={() => setShowPassword((v) => !v)}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="terms"
                  className="border-zinc-700 accent-zinc-50"
                />
                <Label htmlFor="terms" className="text-zinc-400 text-sm">
                  Saya setuju dengan Syarat & Ketentuan
                </Label>
              </div>

              <GlareHover
                as="button"
                type="submit"
                disabled={loading}
                width="100%"
                height="40px"
                background="rgba(255,255,255,0.1)"
                borderRadius="8px"
                borderColor="rgba(255,255,255,0.3)"
                glareColor="#ffffff"
                glareOpacity={0.4}
                glareAngle={-30}
                glareSize={200}
                transitionDuration={600}
                className="w-full h-10 rounded-lg text-white disabled:opacity-50 disabled:pointer-events-none inline-flex items-center justify-center gap-2 text-sm font-medium hover:bg-white/20"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  "Daftar"
                )}
              </GlareHover>
            </form>
          </CardContent>

          <CardFooter className="flex items-center justify-center text-sm text-zinc-400">
            Sudah punya akun?
            <Link
              to="/login"
              className="ml-1 text-zinc-200 hover:underline"
            >
              Masuk
            </Link>
          </CardFooter>
        </Card>
      </div>
    </section>
  )
}

export default RegisterPage
