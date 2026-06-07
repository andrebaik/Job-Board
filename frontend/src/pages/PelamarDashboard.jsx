import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../api/client";

function PelamarDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const loadApplications = async () => {
    try {
      const response = await api.get("/applications/my-applications");
      setApplications(response.data.data || []);
    } catch (error) {
      console.log(error.response?.data?.message || "Gagal mengambil lamaran");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard Pelamar</h1>

        <p className="mt-2 text-slate-600">Selamat datang, {user?.name}</p>

        <div className="mt-6 flex gap-3">
          <Link
            to="/jobs"
            className="px-5 py-2 rounded-lg bg-indigo-600 text-white"
          >
            Cari Lowongan
          </Link>

          <Link
            to="/pelamar/profile"
            className="px-5 py-2 rounded-lg bg-slate-900 text-white"
          >
            Edit Profil
          </Link>
          
          <button
            onClick={handleLogout}
            className="px-5 py-2 rounded-lg bg-red-600 text-white"
          >
            Logout
          </button>

        </div>

        <div className="mt-8">
          <h2 className="text-xl font-bold text-slate-900">Riwayat Lamaran</h2>

          {loading && <p className="mt-4 text-slate-500">Mengambil data...</p>}

          {!loading && applications.length === 0 && (
            <p className="mt-4 text-slate-500">Belum ada lamaran.</p>
          )}

          <div className="mt-4 space-y-3">
            {applications.map((item) => (
              <div key={item.id} className="border rounded-xl p-4">
                <h3 className="font-semibold text-slate-900">{item.title}</h3>

                <p className="text-sm text-slate-500">
                  {item.company_name} • {item.location}
                </p>

                <p className="mt-2 text-sm">
                  Status: <b>{item.status}</b>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PelamarDashboard;
