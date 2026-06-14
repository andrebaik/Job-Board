import { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "motion/react";
import { api } from "../api/client";
import PageBackground from "../components/ParticleBackground";
import UnsavedModal from "../components/UnsavedModal";
import { ChevronLeft, Building2, Globe, FileText, Loader2, Camera, Trash2 } from "lucide-react";

const IMG_BASE = import.meta.env.VITE_API_BASE_URL.replace("/api", "");

function CompanyProfilePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fromRegister = searchParams.get("fromRegister") === "true";

  const [form, setForm] = useState({
    company_name: "",
    industry: "",
    address: "",
    description: "",
    website: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showExitModal, setShowExitModal] = useState(false);
  const [pendingNav, setPendingNav] = useState(null);
  const [initialForm, setInitialForm] = useState(null);
  const isDirty = initialForm && JSON.stringify(form) !== JSON.stringify(initialForm);

  const [logo, setLogo] = useState(null);
  const [logoUploading, setLogoUploading] = useState(false);
  const fileRef = useRef(null);
  const [verificationStatus, setVerificationStatus] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/profiles/company/me");
      const data = response.data.data;
      const loaded = {
        company_name: data.company_name || data.name || "",
        industry: data.industry || "",
        address: data.address || "",
        description: data.description || "",
        website: data.website || "",
      };
      setForm(loaded);
      setInitialForm(loaded);
      setVerificationStatus(data.verification_status || "");
      if (data.logo) {
        setLogo(IMG_BASE + data.logo);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Gagal mengambil profil");
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    await api.put("/profiles/company/me", form);
    setInitialForm({ ...form });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError("");
      setSuccess("");
      await saveProfile();
      setSuccess("Profil berhasil disimpan.");
      if (fromRegister) {
        setTimeout(() => navigate("/company/dashboard"), 600);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Gagal menyimpan profil");
    } finally {
      setSaving(false);
    }
  };

  const handleExit = (path) => {
    if (isDirty) {
      setPendingNav(path);
      setShowExitModal(true);
    } else {
      navigate(path);
    }
  };

  const handleSaveAndExit = async () => {
    try {
      setSaving(true);
      await saveProfile();
      navigate(pendingNav);
    } catch (error) {
      setError(error.response?.data?.message || "Gagal menyimpan profil");
      setShowExitModal(false);
      setPendingNav(null);
    } finally {
      setSaving(false);
    }
  };

  const handleDiscardAndExit = () => {
    setShowExitModal(false);
    navigate(pendingNav);
  };

  const handleCloseExitModal = () => {
    setShowExitModal(false);
    setPendingNav(null);
  };

  const handleSkip = async () => {
    try {
      setSaving(true);
      await api.post("/profiles/company/me/skip");
      navigate("/company/dashboard");
    } catch (error) {
      setError(error.response?.data?.message || "Gagal");
    } finally {
      setSaving(false);
    }
  };

  const handleLogoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      setError("Format file tidak didukung. Gunakan JPG, PNG, atau WebP.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("File terlalu besar. Maksimal 2MB.");
      return;
    }

    setError("");
    setSuccess("");

    const preview = URL.createObjectURL(file);
    setLogo(preview);

    uploadLogo(file);
  };

  const uploadLogo = async (file) => {
    try {
      setLogoUploading(true);
      const fd = new FormData();
      fd.append("logo", file);
      const res = await api.put("/profiles/company/me/logo", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setLogo(IMG_BASE + res.data.data.logo);
      setSuccess("Logo berhasil diperbarui.");
    } catch (error) {
      const msg = error.response?.data?.message || "Gagal mengupload logo";
      setError(msg);
      loadProfile();
    } finally {
      setLogoUploading(false);
    }
  };

  const handleDeleteLogo = async () => {
    try {
      setLogoUploading(true);
      setError("");
      setSuccess("");
      await api.delete("/profiles/company/me/logo");
      setLogo(null);
      setSuccess("Logo berhasil dihapus.");
    } catch (error) {
      setError(error.response?.data?.message || "Gagal menghapus logo");
    } finally {
      setLogoUploading(false);
    }
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { loadProfile(); }, []);

  useEffect(() => {
    if (!isDirty) return;
    const handler = (e) => { e.preventDefault(); e.returnValue = ""; };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  const inputClass =
    "w-full bg-zinc-950 border border-zinc-800 text-zinc-50 placeholder:text-zinc-600 rounded-xl px-4 py-3 text-sm outline-none focus:border-zinc-600 transition-colors";
  const labelClass = "block text-xs font-medium text-zinc-400 mb-1.5";

  return (
    <div className="min-h-screen bg-zinc-950">
      <PageBackground />

      <div className="relative z-10 p-6">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-zinc-50">Profil Perusahaan</h1>
            <button
              type="button"
              onClick={() => handleExit("/company/dashboard")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-zinc-50 border border-zinc-700 transition-all active:scale-[0.97]"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Dashboard
            </button>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm mb-6"
            >
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-xl text-sm mb-6"
            >
              {success}
            </motion.div>
          )}

          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 text-zinc-500 animate-spin" />
            </div>
          )}

          {!loading && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-8 h-8 rounded-xl bg-zinc-800 flex items-center justify-center">
                    <Camera className="w-4 h-4 text-zinc-300" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-zinc-50">Logo Perusahaan</h2>
                    <p className="text-[11px] text-zinc-500">JPG, PNG, atau WebP. Maksimal 2MB.</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="relative group shrink-0">
                    <div
                      onClick={() => fileRef.current?.click()}
                      className="w-20 h-20 rounded-2xl bg-zinc-800 border-2 border-dashed border-zinc-700 flex items-center justify-center overflow-hidden cursor-pointer hover:border-zinc-500 transition-colors"
                    >
                      {logo ? (
                        <img src={logo} alt="Logo perusahaan" className="w-full h-full object-contain p-2" />
                      ) : (
                        <Building2 className="w-8 h-8 text-zinc-500" />
                      )}
                    </div>
                    {logoUploading && (
                      <div className="absolute inset-0 rounded-2xl bg-zinc-950/70 flex items-center justify-center">
                        <Loader2 className="w-5 h-5 text-zinc-400 animate-spin" />
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center cursor-pointer hover:bg-zinc-700 transition-colors" onClick={() => fileRef.current?.click()}>
                      <Camera className="w-3 h-3 text-zinc-400" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      disabled={logoUploading}
                      className="px-4 py-2 rounded-xl text-xs font-medium bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700 transition-all disabled:opacity-50 cursor-pointer"
                    >
                      {logo ? "Ganti Logo" : "Upload Logo"}
                    </button>
                    {logo && (
                      <button
                        type="button"
                        onClick={handleDeleteLogo}
                        disabled={logoUploading}
                        className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-red-400 hover:bg-red-500/10 border border-zinc-800 hover:border-red-500/20 transition-all disabled:opacity-50 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" /> Hapus
                      </button>
                    )}
                  </div>
                  <input
                    ref={fileRef}
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp"
                    className="hidden"
                    onChange={handleLogoSelect}
                  />
                </div>
              </div>

              {verificationStatus && (
                <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                      <FileText className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <h2 className="text-sm font-semibold text-zinc-50">Verifikasi</h2>
                    </div>
                  </div>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    verificationStatus === "verified"
                      ? "bg-emerald-500/10 text-emerald-400"
                      : verificationStatus === "rejected"
                      ? "bg-red-500/10 text-red-400"
                      : "bg-amber-500/10 text-amber-400"
                  }`}>
                    {verificationStatus === "verified" ? "Terverifikasi" : verificationStatus === "rejected" ? "Ditolak" : "Menunggu"}
                  </span>
                </div>
              )}

              <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-zinc-50">Informasi Perusahaan</h2>
                    <p className="text-[11px] text-zinc-500">Data dasar perusahaan</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Nama Perusahaan</label>
                    <input type="text" name="company_name" value={form.company_name} onChange={handleChange} className={inputClass} placeholder="Nama perusahaan" />
                  </div>
                  <div>
                    <label className={labelClass}>Industri</label>
                    <input type="text" name="industry" value={form.industry} onChange={handleChange} className={inputClass} placeholder="Teknologi, Keuangan, dll" />
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-8 h-8 rounded-xl bg-violet-500/10 flex items-center justify-center">
                    <Globe className="w-4 h-4 text-violet-400" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-zinc-50">Kontak & Lokasi</h2>
                    <p className="text-[11px] text-zinc-500">Website dan alamat</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Website</label>
                    <input type="text" name="website" value={form.website} onChange={handleChange} className={inputClass} placeholder="https://example.com" />
                  </div>
                  <div>
                    <label className={labelClass}>Alamat</label>
                    <input type="text" name="address" value={form.address} onChange={handleChange} className={inputClass} placeholder="Jl. Contoh No. 123" />
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-zinc-50">Deskripsi</h2>
                    <p className="text-[11px] text-zinc-500">Tentang perusahaan</p>
                  </div>
                </div>
                <textarea name="description" value={form.description} onChange={handleChange} rows="5" className={inputClass} placeholder="Ceritakan tentang perusahaan Anda..." />
              </div>

              <div className="border-t border-zinc-800 pt-4 flex items-center justify-between">
                <Link
                  to="/change-password"
                  className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  Ganti Password
                </Link>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3.5 rounded-2xl bg-zinc-50 text-zinc-950 font-semibold text-sm hover:bg-zinc-200 transition-all active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {saving ? "Menyimpan..." : "Simpan Profil"}
                </button>
                {fromRegister && (
                  <button
                    type="button"
                    onClick={handleSkip}
                    disabled={saving}
                    className="px-6 py-3.5 rounded-2xl bg-zinc-800 text-zinc-300 font-semibold text-sm hover:bg-zinc-700 transition-all active:scale-[0.97] disabled:opacity-50 border border-zinc-700"
                  >
                    Lakukan Nanti
                  </button>
                )}
              </div>
            </form>
          )}
        </motion.div>
      </div>

      <UnsavedModal
        open={showExitModal}
        onClose={handleCloseExitModal}
        onSave={handleSaveAndExit}
        onDiscard={handleDiscardAndExit}
      />
    </div>
  );
}

export default CompanyProfilePage;
