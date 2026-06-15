import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export const adminApi = {
  getStats: () => api.get("/admin/stats"),
  getChartData: (period = "30d") => api.get(`/admin/stats/chart?period=${period}`),
  getDistributionStats: () => api.get("/admin/stats/distribution"),
  getUsers: (params = {}) => api.get("/admin/users", { params }),
  updateUser: (id, data) => api.patch(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getJobs: (params = {}) => api.get("/admin/jobs", { params }),
  updateJob: (id, data) => api.patch(`/admin/jobs/${id}`, data),
  deleteJob: (id) => api.delete(`/admin/jobs/${id}`),
  getApplications: (params = {}) => api.get("/admin/applications", { params }),
  getCompanies: (params = {}) => api.get("/admin/companies", { params }),
  verifyCompany: (id, verification_status) => api.patch(`/admin/companies/${id}/verify`, { verification_status }),
};