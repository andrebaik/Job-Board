import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import JobsPage from "./pages/JobsPage";
import JobDetailPage from "./pages/JobDetailPage";
import CreateJobPage from "./pages/CreateJobPage";

import AdminDashboard from "./pages/AdminDashboard";
import PelamarDashboard from "./pages/PelamarDashboard";
import CompanyDashboard from "./pages/CompanyDashboard";
import CompanyJobsPage from "./pages/CompanyJobsPage";
import EditJobPage from "./pages/EditJobPage";
import ApplicantDetailPage from "./pages/ApplicantDetailPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import PelamarProfilePage from "./pages/PelamarProfilePage";
import CompanyProfilePage from "./pages/CompanyProfilePage";
import ChangePasswordPage from "./pages/ChangePasswordPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/jobs/:id" element={<JobDetailPage />} />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/pelamar/dashboard"
          element={
            <ProtectedRoute allowedRoles={["pelamar"]}>
              <PelamarDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/company/dashboard"
          element={
            <ProtectedRoute allowedRoles={["perusahaan"]}>
              <CompanyDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/company/applications/:id"
          element={
            <ProtectedRoute allowedRoles={["perusahaan"]}>
              <ApplicantDetailPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/pelamar/profile"
          element={
            <ProtectedRoute allowedRoles={["pelamar"]}>
              <PelamarProfilePage />
            </ProtectedRoute>
          }
        />

          <Route
            path="/company/profile"
            element={
              <ProtectedRoute allowedRoles={["perusahaan"]}>
                <CompanyProfilePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/change-password"
            element={
              <ProtectedRoute allowedRoles={["pelamar", "perusahaan"]}>
                <ChangePasswordPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/company/jobs/create"
            element={
              <ProtectedRoute allowedRoles={["perusahaan"]}>
                <CreateJobPage />
              </ProtectedRoute>
            }
          />
        <Route
          path="/company/jobs"
          element={
            <ProtectedRoute allowedRoles={["perusahaan"]}>
              <CompanyJobsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/company/jobs/:id/edit"
          element={
            <ProtectedRoute allowedRoles={["perusahaan"]}>
              <EditJobPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
