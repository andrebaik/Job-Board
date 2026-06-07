import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "pelamar",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      console.log("Data dikirim:", form);

      const result = await register(form);

      console.log("Response register:", result);

      setSuccess("Register berhasil. Silakan login.");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      setError(error.response?.data?.message || "Register gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold text-slate-900 text-center">
          Register
        </h1>

        <p className="text-center text-slate-500 mt-2">Buat akun baru</p>

        {error && (
          <div className="mt-5 bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-5 bg-green-50 text-green-600 px-4 py-3 rounded-xl text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Nama
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="mt-2 w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Nama lengkap"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="mt-2 w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="contoh@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Role
            </label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="mt-2 w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="pelamar">Pelamar</option>
              <option value="perusahaan">Perusahaan</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="mt-2 w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Buat password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:bg-indigo-300"
          >
            {loading ? "Memproses..." : "Register"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Sudah punya akun?{" "}
          <Link to="/login" className="text-indigo-600 font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
