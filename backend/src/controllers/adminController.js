import db from "../config/db.js";

export const getDashboardStats = async (_req, res) => {
  try {
    const [[users]] = await db.query("SELECT COUNT(*) AS total FROM users");
    const [[admins]] = await db.query(
      "SELECT COUNT(*) AS total FROM users WHERE role = ?",
      ["admin"]
    );
    const [[companies]] = await db.query(
      "SELECT COUNT(*) AS total FROM users WHERE role = ?",
      ["perusahaan"]
    );
    const [[pelamar]] = await db.query(
      "SELECT COUNT(*) AS total FROM users WHERE role = ?",
      ["pelamar"]
    );
    const [[jobs]] = await db.query("SELECT COUNT(*) AS total FROM jobs");
    const [[applications]] = await db.query(
      "SELECT COUNT(*) AS total FROM applications"
    );

    const [[acceptedThisMonth]] = await db.query(
      `SELECT COUNT(*) AS total FROM applications
       WHERE status = ? AND applied_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)`,
      ["diterima"]
    );

    return res.json({
      status: "success",
      data: {
        totalUsers: users.total,
        totalAdmins: admins.total,
        totalCompanies: companies.total,
        totalPelamar: pelamar.total,
        totalJobs: jobs.total,
        totalApplications: applications.total,
        acceptedThisMonth: acceptedThisMonth.total,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Gagal mengambil statistik",
      error: error.message,
    });
  }
};

export const getDistributionStats = async (_req, res) => {
  try {
    const [[{ total: totalAdmin }]] = await db.query(
      "SELECT COUNT(*) AS total FROM users WHERE role = 'admin'"
    );
    const [[{ total: totalPelamar }]] = await db.query(
      "SELECT COUNT(*) AS total FROM users WHERE role = 'pelamar'"
    );
    const [[{ total: totalPerusahaan }]] = await db.query(
      "SELECT COUNT(*) AS total FROM users WHERE role = 'perusahaan'"
    );

    const [appStatusRows] = await db.query(
      "SELECT status, COUNT(*) AS total FROM applications GROUP BY status ORDER BY status"
    );

    const [verificationRows] = await db.query(
      "SELECT verification_status, COUNT(*) AS total FROM company_profiles GROUP BY verification_status ORDER BY verification_status"
    );

    const [jobTypeRows] = await db.query(
      "SELECT job_type, COUNT(*) AS total FROM jobs GROUP BY job_type ORDER BY job_type"
    );

    const [categoryRows] = await db.query(
      "SELECT category, COUNT(*) AS total FROM jobs GROUP BY category ORDER BY total DESC LIMIT 10"
    );

    return res.json({
      status: "success",
      data: {
        userRoles: [
          { label: "Pelamar", value: totalPelamar },
          { label: "Perusahaan", value: totalPerusahaan },
        ],
        applicationStatus: appStatusRows.map(r => ({ label: r.status, value: r.total })),
        companyVerification: verificationRows.map(r => ({ label: r.verification_status, value: r.total })),
        jobTypes: jobTypeRows.map(r => ({ label: r.job_type, value: r.total })),
        jobCategories: categoryRows.map(r => ({ label: r.category || "Lainnya", value: r.total })),
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Gagal mengambil data distribusi",
      error: error.message,
    });
  }
};

export const getChartData = async (req, res) => {
  try {
    const period = req.query.period || "30d";
    let interval;
    switch (period) {
      case "7d":
        interval = "7 DAY";
        break;
      case "90d":
        interval = "90 DAY";
        break;
      case "1y":
        interval = "365 DAY";
        break;
      default:
        interval = "30 DAY";
    }

    const [companyRows] = await db.query(
      `SELECT DATE(created_at) AS date, COUNT(*) AS total
       FROM users
       WHERE role = 'perusahaan' AND created_at >= DATE_SUB(NOW(), INTERVAL ${interval})
       GROUP BY DATE(created_at)
       ORDER BY date`
    );

    const [pelamarRows] = await db.query(
      `SELECT DATE(created_at) AS date, COUNT(*) AS total
       FROM users
       WHERE role = 'pelamar' AND created_at >= DATE_SUB(NOW(), INTERVAL ${interval})
       GROUP BY DATE(created_at)
       ORDER BY date`
    );

    const [acceptedRows] = await db.query(
      `SELECT DATE(updated_at) AS date, COUNT(*) AS total
       FROM applications
       WHERE status = 'diterima' AND updated_at >= DATE_SUB(NOW(), INTERVAL ${interval})
       GROUP BY DATE(updated_at)
       ORDER BY date`
    );

    const [jobRows] = await db.query(
      `SELECT DATE(created_at) AS date, COUNT(*) AS total
       FROM jobs
       WHERE created_at >= DATE_SUB(NOW(), INTERVAL ${interval})
       GROUP BY DATE(created_at)
       ORDER BY date`
    );

    const labels = [];
    const pelamarData = [];
    const companyData = [];
    const acceptedData = [];
    const jobData = [];

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(interval));

    const formatDate = (d) => d.toISOString().split("T")[0];
    const current = new Date(startDate);
    const end = new Date();
    end.setDate(end.getDate() + 1);

    const pelamarMap = {};
    const companyMap = {};
    const acceptedMap = {};
    const jobMap = {};

    for (const r of pelamarRows) pelamarMap[formatDate(new Date(r.date))] = parseInt(r.total);
    for (const r of companyRows) companyMap[formatDate(new Date(r.date))] = parseInt(r.total);
    for (const r of acceptedRows) acceptedMap[formatDate(new Date(r.date))] = parseInt(r.total);
    for (const r of jobRows) jobMap[formatDate(new Date(r.date))] = parseInt(r.total);

    while (current <= end) {
      const key = formatDate(current);
      labels.push(key);
      pelamarData.push(pelamarMap[key] || 0);
      companyData.push(companyMap[key] || 0);
      acceptedData.push(acceptedMap[key] || 0);
      jobData.push(jobMap[key] || 0);
      current.setDate(current.getDate() + 1);
    }

    return res.json({
      status: "success",
      data: {
        labels,
        datasets: [
          { label: "Pelamar Terdaftar", data: pelamarData },
          { label: "Perusahaan Terdaftar", data: companyData },
          { label: "Pelamar Diterima", data: acceptedData },
          { label: "Lowongan Dibuat", data: jobData },
        ],
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Gagal mengambil data chart",
      error: error.message,
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const { q, role, is_active, page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const conditions = [];
    const params = [];

    if (q) {
      conditions.push("(u.name LIKE ? OR u.email LIKE ?)");
      params.push(`%${q}%`, `%${q}%`);
    }
    if (role) {
      conditions.push("u.role = ?");
      params.push(role);
    }
    if (is_active !== undefined && is_active !== "") {
      conditions.push("u.is_active = ?");
      params.push(is_active === "true" ? 1 : 0);
    }

    const where = conditions.length > 0 ? "WHERE " + conditions.join(" AND ") : "";

    const [rows] = await db.query(
      `SELECT u.id, u.name, u.email, u.role, u.is_active, u.created_at, u.updated_at
       FROM users u ${where}
       ORDER BY u.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    const [[{ total }]] = await db.query(
      `SELECT COUNT(*) AS total FROM users u ${where}`,
      params
    );

    return res.json({
      status: "success",
      data: rows,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Gagal mengambil data user",
      error: error.message,
    });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const { q, status, page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const conditions = [];
    const params = [];

    if (q) {
      conditions.push("(j.title LIKE ? OR cp.company_name LIKE ?)");
      params.push(`%${q}%`, `%${q}%`);
    }
    if (status) {
      conditions.push("j.status = ?");
      params.push(status);
    }

    const where = conditions.length > 0 ? "WHERE " + conditions.join(" AND ") : "";

    const [rows] = await db.query(
      `SELECT j.id, j.title, j.category, j.location, j.job_type, j.status, j.created_at,
              cp.company_name, cp.industry, u.email AS company_email
       FROM jobs j
       JOIN company_profiles cp ON j.company_id = cp.id
       JOIN users u ON cp.user_id = u.id
       ${where}
       ORDER BY j.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    const [[{ total }]] = await db.query(
      `SELECT COUNT(*) AS total
       FROM jobs j
       JOIN company_profiles cp ON j.company_id = cp.id
       JOIN users u ON cp.user_id = u.id
       ${where}`,
      params
    );

    return res.json({
      status: "success",
      data: rows,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Gagal mengambil data lowongan",
      error: error.message,
    });
  }
};

export const getAllApplications = async (req, res) => {
  try {
    const { q, status, page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const conditions = [];
    const params = [];

    if (q) {
      conditions.push("(u.name LIKE ? OR u.email LIKE ? OR j.title LIKE ?)");
      params.push(`%${q}%`, `%${q}%`, `%${q}%`);
    }
    if (status) {
      conditions.push("a.status = ?");
      params.push(status);
    }

    const where = conditions.length > 0 ? "WHERE " + conditions.join(" AND ") : "";

    const [rows] = await db.query(
      `SELECT a.id, a.status, a.cover_letter, a.applied_at, a.updated_at,
              u.name AS applicant_name, u.email AS applicant_email,
              j.title AS job_title, cp.company_name
       FROM applications a
       JOIN pelamar_profiles pp ON a.applicant_id = pp.id
       JOIN users u ON pp.user_id = u.id
       JOIN jobs j ON a.job_id = j.id
       JOIN company_profiles cp ON j.company_id = cp.id
       ${where}
       ORDER BY a.applied_at DESC
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    const [[{ total }]] = await db.query(
      `SELECT COUNT(*) AS total
       FROM applications a
       JOIN pelamar_profiles pp ON a.applicant_id = pp.id
       JOIN users u ON pp.user_id = u.id
       JOIN jobs j ON a.job_id = j.id
       ${where}`,
      params
    );

    return res.json({
      status: "success",
      data: rows,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Gagal mengambil data lamaran",
      error: error.message,
    });
  }
};

export const getCompanyList = async (req, res) => {
  try {
    const { q, verification_status, page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const conditions = ["u.role = 'perusahaan'"];
    const params = [];

    if (q) {
      conditions.push("(cp.company_name LIKE ? OR u.email LIKE ?)");
      params.push(`%${q}%`, `%${q}%`);
    }
    if (verification_status) {
      conditions.push("cp.verification_status = ?");
      params.push(verification_status);
    }

    const where = "WHERE " + conditions.join(" AND ");

    const [rows] = await db.query(
      `SELECT u.id, u.name, u.email, u.is_active, u.created_at,
              cp.id AS profile_id, cp.company_name, cp.industry, cp.website, cp.address,
              cp.description, cp.verification_status
       FROM users u
       JOIN company_profiles cp ON u.id = cp.user_id
       ${where}
       ORDER BY u.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    const [[{ total }]] = await db.query(
      `SELECT COUNT(*) AS total
       FROM users u
       JOIN company_profiles cp ON u.id = cp.user_id
       ${where}`,
      params
    );

    return res.json({
      status: "success",
      data: rows,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Gagal mengambil data perusahaan",
      error: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, is_active } = req.body;

    const [existing] = await db.query("SELECT id, role FROM users WHERE id = ?", [id]);
    if (existing.length === 0) {
      return res.status(404).json({ status: "error", message: "User tidak ditemukan" });
    }

    if (existing[0].role === "admin") {
      return res.status(403).json({ status: "error", message: "Tidak bisa mengubah data admin" });
    }

    if (role !== undefined) {
      if (!["admin", "pelamar", "perusahaan"].includes(role)) {
        return res.status(400).json({ status: "error", message: "Role tidak valid" });
      }
      await db.query("UPDATE users SET role = ? WHERE id = ?", [role, id]);
    }

    if (is_active !== undefined) {
      await db.query("UPDATE users SET is_active = ? WHERE id = ?", [is_active ? 1 : 0, id]);
    }

    return res.json({ status: "success", message: "User berhasil diperbarui" });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Gagal memperbarui user",
      error: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await db.query("SELECT id, role FROM users WHERE id = ?", [id]);
    if (existing.length === 0) {
      return res.status(404).json({ status: "error", message: "User tidak ditemukan" });
    }

    if (existing[0].role === "admin") {
      return res.status(403).json({ status: "error", message: "Tidak bisa menghapus admin" });
    }

    await db.query("DELETE FROM users WHERE id = ?", [id]);

    return res.json({ status: "success", message: "User berhasil dihapus" });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Gagal menghapus user",
      error: error.message,
    });
  }
};

export const updateJobAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, location, job_type, salary_min, salary_max, description, requirements, deadline, status } = req.body;

    const [existing] = await db.query("SELECT id FROM jobs WHERE id = ?", [id]);
    if (existing.length === 0) {
      return res.status(404).json({ status: "error", message: "Lowongan tidak ditemukan" });
    }

    await db.query(
      `UPDATE jobs SET
        title = ?, category = ?, location = ?, job_type = ?,
        salary_min = ?, salary_max = ?, description = ?,
        requirements = ?, deadline = ?, status = ?
       WHERE id = ?`,
      [
        title, category || null, location, job_type || "Full Time",
        salary_min || null, salary_max || null, description,
        requirements, deadline, status || "open",
        id,
      ]
    );

    return res.json({ status: "success", message: "Lowongan berhasil diperbarui" });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Gagal memperbarui lowongan",
      error: error.message,
    });
  }
};

export const deleteJobAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await db.query("SELECT id FROM jobs WHERE id = ?", [id]);
    if (existing.length === 0) {
      return res.status(404).json({ status: "error", message: "Lowongan tidak ditemukan" });
    }

    await db.query("DELETE FROM jobs WHERE id = ?", [id]);
    return res.json({ status: "success", message: "Lowongan berhasil dihapus" });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Gagal menghapus lowongan",
      error: error.message,
    });
  }
};

export const verifyCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const { verification_status } = req.body;

    if (!["pending", "verified", "rejected"].includes(verification_status)) {
      return res.status(400).json({ status: "error", message: "Status verifikasi tidak valid" });
    }

    const [existing] = await db.query(
      "SELECT cp.id FROM users u JOIN company_profiles cp ON u.id = cp.user_id WHERE u.id = ? AND u.role = 'perusahaan'",
      [id]
    );
    if (existing.length === 0) {
      return res.status(404).json({ status: "error", message: "Perusahaan tidak ditemukan" });
    }

    await db.query("UPDATE company_profiles SET verification_status = ? WHERE user_id = ?", [verification_status, id]);

    return res.json({ status: "success", message: "Status verifikasi berhasil diperbarui" });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Gagal memperbarui status verifikasi",
      error: error.message,
    });
  }
};
