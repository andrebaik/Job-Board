import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../api/client";

function CompanyDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/applications/company");
      setApplications(response.data.data || []);
    } catch (error) {
      setError(error.response?.data?.message || "Gagal mengambil data pelamar");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (applicationId, status) => {
    try {
      await api.patch(`/applications/${applicationId}/status`, {
        status,
      });

      loadApplications();
    } catch (error) {
      alert(error.response?.data?.message || "Gagal update status");
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-2xl shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">
          Dashboard Perusahaan
        </h1>

        <p className="mt-2 text-slate-600">Selamat datang, {user?.name}</p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/company/jobs"
            className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Kelola Lowongan
          </Link>
          <Link
            to="/company/jobs/create"
            className="px-5 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-700"
          >
            Tambah Lowongan
          </Link>
          <button
            onClick={handleLogout}
            className="px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-bold text-slate-900">Pelamar Masuk</h2>

          {loading && (
            <p className="mt-4 text-slate-500">Mengambil data pelamar...</p>
          )}

          {error && (
            <div className="mt-4 bg-red-50 text-red-600 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          {!loading && !error && applications.length === 0 && (
            <p className="mt-4 text-slate-500">Belum ada pelamar yang masuk.</p>
          )}

          <div className="mt-4 space-y-4">
            {applications.map((item) => (
              <div key={item.id} className="border rounded-xl p-5">
                <Link
                  to={`/company/applications/${item.id}`}
                  className="inline-block mt-4 px-4 py-2 rounded-lg bg-indigo-600 text-white"
                >
                  Lihat Profil Pelamar
                </Link>
                <h3 className="text-lg font-semibold text-slate-900">
                  {item.full_name || item.name}
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  Email: {item.email}
                </p>

                <p className="text-sm text-slate-500">
                  Melamar: {item.job_title}
                </p>

                <p className="mt-2 text-sm">
                  Status sekarang: <b>{item.status}</b>
                </p>

                {item.cover_letter && (
                  <div className="mt-3 bg-slate-50 p-3 rounded-lg text-sm text-slate-700">
                    <b>Cover Letter:</b>
                    <p className="mt-1">{item.cover_letter}</p>
                  </div>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => handleUpdateStatus(item.id, "dilihat")}
                    className="px-3 py-2 rounded-lg bg-slate-200 text-slate-800"
                  >
                    Dilihat
                  </button>

                  <button
                    onClick={() => handleUpdateStatus(item.id, "interview")}
                    className="px-3 py-2 rounded-lg bg-blue-600 text-white"
                  >
                    Interview
                  </button>

                  <button
                    onClick={() => handleUpdateStatus(item.id, "diterima")}
                    className="px-3 py-2 rounded-lg bg-green-600 text-white"
                  >
                    Diterima
                  </button>

                  <button
                    onClick={() => handleUpdateStatus(item.id, "ditolak")}
                    className="px-3 py-2 rounded-lg bg-red-600 text-white"
                  >
                    Ditolak
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompanyDashboard;
