# Dokumentasi Query Database

**Total: 84 query** — 60 SELECT, 6 INSERT, 15 UPDATE, 3 DELETE

Semua query menggunakan `pool.query()` (mysql2/promise) melalui koneksi pool yang dibuat di `backend/src/config/db.js`.

---

## Daftar Isi

1. [authController.js](#1-authcontrollerjs)
2. [jobController.js](#2-jobcontrollerjs)
3. [applicationController.js](#3-applicationcontrollerjs)
4. [profileController.js](#4-profilecontrollerjs)
5. [adminController.js](#5-admincontrollerjs)
6. [Middleware & Lainnya](#6-middleware--lainnya)

---

## 1. `authController.js`

File: `backend/src/controllers/authController.js` — 8 query

| # | SQL | Kegunaan |
|---|-----|----------|
| 1 | `SELECT id FROM users WHERE email = ?` | Cek apakah email sudah terdaftar saat registrasi |
| 2 | `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)` | Membuat akun pengguna baru |
| 3 | `INSERT INTO pelamar_profiles (user_id, full_name) VALUES (?, ?)` | Otomatis membuat profil pelamar saat registrasi (role = 'pelamar') |
| 4 | `INSERT INTO company_profiles (user_id, company_name) VALUES (?, ?)` | Otomatis membuat profil perusahaan saat registrasi (role = 'perusahaan') |
| 5 | `SELECT * FROM users WHERE email = ?` | Mencari user berdasarkan email saat login |
| 6 | `SELECT id, name, email, role, created_at FROM users WHERE id = ?` | Mengambil data user yang sedang login (endpoint `/auth/me`) |
| 7 | `SELECT password FROM users WHERE id = ?` | Mengambil password hash untuk verifikasi sebelum ganti password |
| 8 | `UPDATE users SET password = ? WHERE id = ?` | Memperbarui password setelah diverifikasi |

---

## 2. `jobController.js`

File: `backend/src/controllers/jobController.js` — 9 query

| # | SQL | Kegunaan |
|---|-----|----------|
| 1 | `SELECT id FROM company_profiles WHERE user_id = ?` | Helper: mengambil company_id dari user yang login |
| 2 | `SELECT jobs.id, jobs.title, jobs.category, jobs.location, jobs.job_type, jobs.salary_min, jobs.salary_max, jobs.description, jobs.requirements, jobs.deadline, jobs.status, jobs.created_at, company_profiles.company_name, company_profiles.industry FROM jobs JOIN company_profiles ON jobs.company_id = company_profiles.id ${where} ORDER BY jobs.created_at DESC` | Menampilkan semua lowongan yang aktif untuk publik (dengan filter opsional: q, category, location, job_type) |
| 3 | `SELECT jobs.*, company_profiles.company_name, company_profiles.industry, company_profiles.address AS company_address, company_profiles.description AS company_description, company_profiles.website, company_profiles.logo FROM jobs JOIN company_profiles ON jobs.company_id = company_profiles.id WHERE jobs.id = ?` | Mengambil detail satu lowongan lengkap dengan info perusahaan |
| 4 | `SELECT jobs.*, company_profiles.verification_status FROM jobs JOIN company_profiles ON jobs.company_id = company_profiles.id WHERE company_id = ? ORDER BY jobs.created_at DESC` | Mengambil semua lowongan milik perusahaan yang login (digunakan di CompanyDashboard) |
| 5 | `INSERT INTO jobs (company_id, title, category, location, job_type, salary_min, salary_max, description, requirements, deadline, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)` | Membuat lowongan kerja baru |
| 6 | `SELECT id FROM jobs WHERE id = ? AND company_id = ?` | Verifikasi bahwa lowongan milik perusahaan sebelum mengedit |
| 7 | `UPDATE jobs SET title = ?, category = ?, location = ?, job_type = ?, salary_min = ?, salary_max = ?, description = ?, requirements = ?, deadline = ?, status = ? WHERE id = ? AND company_id = ?` | Memperbarui data lowongan |
| 8 | `SELECT id FROM jobs WHERE id = ? AND company_id = ?` | Verifikasi bahwa lowongan milik perusahaan sebelum menghapus |
| 9 | `DELETE FROM jobs WHERE id = ? AND company_id = ?` | Menghapus lowongan |

---

## 3. `applicationController.js`

File: `backend/src/controllers/applicationController.js` — 10 query

| # | SQL | Kegunaan |
|---|-----|----------|
| 1 | `SELECT id FROM pelamar_profiles WHERE user_id = ?` | Helper: mengambil applicant_id dari user pelamar yang login |
| 2 | `SELECT id FROM company_profiles WHERE user_id = ?` | Helper: mengambil company_id dari user perusahaan yang login |
| 3 | `SELECT id, status FROM jobs WHERE id = ?` | Cek apakah lowongan ada dan statusnya sebelum melamar |
| 4 | `SELECT id FROM applications WHERE job_id = ? AND applicant_id = ?` | Cek apakah user sudah pernah melamar (mencegah duplikasi) |
| 5 | `INSERT INTO applications (job_id, applicant_id, cover_letter, status) VALUES (?, ?, ?, ?)` | Mengirim lamaran baru |
| 6 | `SELECT applications.id, applications.status, applications.cover_letter, applications.applied_at, applications.updated_at, jobs.id AS job_id, jobs.title, jobs.category, jobs.location, jobs.job_type, jobs.salary_min, jobs.salary_max, jobs.deadline, company_profiles.company_name, company_profiles.industry FROM applications JOIN jobs ON applications.job_id = jobs.id JOIN company_profiles ON jobs.company_id = company_profiles.id WHERE applications.applicant_id = ? ORDER BY applications.applied_at DESC` | Menampilkan semua lamaran pelamar (riwayat lamaran) |
| 7 | `SELECT applications.id, applications.status, applications.cover_letter, applications.applied_at, applications.updated_at, jobs.id AS job_id, jobs.title AS job_title, pelamar_profiles.id AS applicant_profile_id, pelamar_profiles.full_name, pelamar_profiles.phone, pelamar_profiles.address, pelamar_profiles.education, pelamar_profiles.skills, pelamar_profiles.experience, pelamar_profiles.cv_url, users.name, users.email FROM applications JOIN jobs ON applications.job_id = jobs.id JOIN pelamar_profiles ON applications.applicant_id = pelamar_profiles.id JOIN users ON pelamar_profiles.user_id = users.id WHERE jobs.company_id = ? ORDER BY applications.applied_at DESC` | Menampilkan semua lamaran masuk ke perusahaan |
| 8 | `SELECT applications.id FROM applications JOIN jobs ON applications.job_id = jobs.id WHERE applications.id = ? AND jobs.company_id = ?` | Verifikasi bahwa lamaran milik perusahaan sebelum update status |
| 9 | `UPDATE applications SET status = ? WHERE id = ?` | Memperbarui status lamaran (menunggu/dilihat/interview/diterima/ditolak) |
| 10 | `SELECT applications.id, applications.status, applications.cover_letter, applications.applied_at, applications.updated_at, jobs.id AS job_id, jobs.title AS job_title, jobs.category, jobs.location, jobs.job_type, jobs.salary_min, jobs.salary_max, jobs.description AS job_description, jobs.requirements, jobs.deadline, pelamar_profiles.id AS applicant_profile_id, pelamar_profiles.full_name, pelamar_profiles.phone, pelamar_profiles.address, pelamar_profiles.education, pelamar_profiles.skills, pelamar_profiles.experience, pelamar_profiles.cv_url, users.name, users.email FROM applications JOIN jobs ON applications.job_id = jobs.id JOIN pelamar_profiles ON applications.applicant_id = pelamar_profiles.id JOIN users ON pelamar_profiles.user_id = users.id WHERE applications.id = ? AND jobs.company_id = ?` | Mengambil detail satu lamaran untuk dilihat perusahaan |

---

## 4. `profileController.js`

File: `backend/src/controllers/profileController.js` — 12 query

| # | SQL | Kegunaan |
|---|-----|----------|
| 1 | `SELECT pelamar_profiles.*, users.name, users.email FROM pelamar_profiles JOIN users ON pelamar_profiles.user_id = users.id WHERE pelamar_profiles.user_id = ?` | Mengambil profil pelamar yang login |
| 2 | `UPDATE pelamar_profiles SET full_name = ?, phone = ?, address = ?, education = ?, skills = ?, experience = ?, cv_url = ?, profile_completed = TRUE WHERE user_id = ?` | Memperbarui data profil pelamar |
| 3 | `SELECT profile_picture FROM pelamar_profiles WHERE user_id = ?` | Mengambil path foto profil sebelum diganti |
| 4 | `UPDATE pelamar_profiles SET profile_picture = ? WHERE user_id = ?` | Memperbarui foto profil pelamar |
| 5 | `UPDATE pelamar_profiles SET profile_picture = NULL WHERE user_id = ?` | Menghapus foto profil pelamar |
| 6 | `SELECT logo FROM company_profiles WHERE user_id = ?` | Mengambil path logo sebelum diganti |
| 7 | `UPDATE company_profiles SET logo = ? WHERE user_id = ?` | Memperbarui logo perusahaan |
| 8 | `SELECT company_profiles.*, users.name, users.email FROM company_profiles JOIN users ON company_profiles.user_id = users.id WHERE company_profiles.user_id = ?` | Mengambil profil perusahaan yang login |
| 9 | `UPDATE company_profiles SET company_name = ?, industry = ?, address = ?, description = ?, website = ?, profile_completed = TRUE WHERE user_id = ?` | Memperbarui data profil perusahaan |
| 10 | `SELECT logo FROM company_profiles WHERE user_id = ?` | Mengambil path logo sebelum dihapus |
| 11 | `UPDATE company_profiles SET logo = NULL WHERE user_id = ?` | Menghapus logo perusahaan |

---

## 5. `adminController.js`

File: `backend/src/controllers/adminController.js` — 40 query (terbanyak)

### Dashboard

| # | SQL | Kegunaan |
|---|-----|----------|
| 1 | `SELECT COUNT(*) AS total FROM users` | Total seluruh pengguna |
| 2 | `SELECT COUNT(*) AS total FROM users WHERE role = 'admin'` | Jumlah admin |
| 3 | `SELECT COUNT(*) AS total FROM users WHERE role = 'perusahaan'` | Jumlah perusahaan |
| 4 | `SELECT COUNT(*) AS total FROM users WHERE role = 'pelamar'` | Jumlah pelamar |
| 5 | `SELECT COUNT(*) AS total FROM jobs` | Total lowongan |
| 6 | `SELECT COUNT(*) AS total FROM applications` | Total lamaran |
| 7 | `SELECT COUNT(*) AS total FROM applications WHERE status = 'diterima' AND applied_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)` | Lamaran diterima dalam 30 hari terakhir |

### Distribusi

| # | SQL | Kegunaan |
|---|-----|----------|
| 8-10 | `SELECT COUNT(*) AS total FROM users WHERE role = ?` | Jumlah per role (admin/pelamar/perusahaan) |
| 11 | `SELECT status, COUNT(*) AS total FROM applications WHERE 1=1 ${periodClause} GROUP BY status ORDER BY status` | Distribusi lamaran per status (dengan filter periode opsional) |
| 12 | `SELECT verification_status, COUNT(*) AS total FROM company_profiles WHERE 1=1 ${periodClause} GROUP BY verification_status ORDER BY verification_status` | Distribusi perusahaan per status verifikasi |
| 13 | `SELECT job_type, COUNT(*) AS total FROM jobs WHERE 1=1 ${periodClause} GROUP BY job_type ORDER BY job_type` | Distribusi lowongan per tipe |
| 14 | `SELECT category, COUNT(*) AS total FROM jobs WHERE 1=1 ${periodClause} GROUP BY category ORDER BY total DESC LIMIT 10` | 10 kategori lowongan terbanyak |

### Funnel

| # | SQL | Kegunaan |
|---|-----|----------|
| 15 | `SELECT COUNT(DISTINCT applicant_id) AS total FROM applications` | Total pelamar unik yang pernah melamar |
| 16 | `SELECT COUNT(*) AS total FROM applications` | Total seluruh lamaran masuk |
| 17 | `SELECT status, COUNT(*) AS total FROM applications GROUP BY status ORDER BY FIELD(status, 'menunggu', 'dilihat', 'interview', 'diterima', 'ditolak')` | Jumlah lamaran per status (urutan workflow) |

### Chart (Registrasi & Aktivitas Harian)

| # | SQL | Kegunaan |
|---|-----|----------|
| 18 | `SELECT DATE(created_at) AS date, COUNT(*) AS total FROM users WHERE role = 'perusahaan' AND created_at >= DATE_SUB(NOW(), INTERVAL ${interval}) GROUP BY DATE(created_at) ORDER BY date` | Chart registrasi perusahaan harian |
| 19 | `SELECT DATE(created_at) AS date, COUNT(*) AS total FROM users WHERE role = 'pelamar' AND created_at >= DATE_SUB(NOW(), INTERVAL ${interval}) GROUP BY DATE(created_at) ORDER BY date` | Chart registrasi pelamar harian |
| 20 | `SELECT DATE(updated_at) AS date, COUNT(*) AS total FROM applications WHERE status = 'diterima' AND updated_at >= DATE_SUB(NOW(), INTERVAL ${interval}) GROUP BY DATE(updated_at) ORDER BY date` | Chart lamaran diterima harian |
| 21 | `SELECT DATE(created_at) AS date, COUNT(*) AS total FROM jobs WHERE created_at >= DATE_SUB(NOW(), INTERVAL ${interval}) GROUP BY DATE(created_at) ORDER BY date` | Chart lowongan baru harian |

### Manajemen User

| # | SQL | Kegunaan |
|---|-----|----------|
| 22 | `SELECT u.id, u.name, u.email, u.role, u.is_active, u.created_at, u.updated_at FROM users u ${where} ORDER BY u.created_at DESC LIMIT ? OFFSET ?` | Daftar semua user dengan pagination + search/filter |
| 23 | `SELECT COUNT(*) AS total FROM users u ${where}` | Hitung total user untuk pagination |
| 30 | `SELECT id, role FROM users WHERE id = ?` | Cari user sebelum update role/status |
| 31 | `UPDATE users SET role = ? WHERE id = ?` | Update role user |
| 32 | `UPDATE users SET is_active = ? WHERE id = ?` | Aktifkan/nonaktifkan user |
| 33 | `SELECT id, role FROM users WHERE id = ?` | Cari user sebelum dihapus |
| 34 | `DELETE FROM users WHERE id = ?` | Hapus user |

### Manajemen Lowongan (Admin)

| # | SQL | Kegunaan |
|---|-----|----------|
| 24 | `SELECT j.id, j.title, j.category, j.location, j.job_type, j.status, j.created_at, cp.company_name, cp.industry, u.email AS company_email FROM jobs j JOIN company_profiles cp ON j.company_id = cp.id JOIN users u ON cp.user_id = u.id ${where} ORDER BY j.created_at DESC LIMIT ? OFFSET ?` | Daftar semua lowongan (admin view) dengan pagination |
| 25 | `SELECT COUNT(*) AS total FROM jobs j JOIN company_profiles cp ON j.company_id = cp.id JOIN users u ON cp.user_id = u.id ${where}` | Hitung total lowongan untuk pagination |
| 35 | `SELECT id FROM jobs WHERE id = ?` | Cari lowongan sebelum diupdate/dihapus admin |
| 36 | `UPDATE jobs SET title = ?, category = ?, location = ?, job_type = ?, salary_min = ?, salary_max = ?, description = ?, requirements = ?, deadline = ?, status = ? WHERE id = ?` | Update lowongan oleh admin (override) |
| 37 | `SELECT id FROM jobs WHERE id = ?` | Cari lowongan sebelum dihapus admin |
| 38 | `DELETE FROM jobs WHERE id = ?` | Hapus lowongan oleh admin |

### Manajemen Lamaran (Admin)

| # | SQL | Kegunaan |
|---|-----|----------|
| 26 | `SELECT a.id, a.status, a.cover_letter, a.applied_at, a.updated_at, u.name AS applicant_name, u.email AS applicant_email, j.title AS job_title, cp.company_name FROM applications a JOIN pelamar_profiles pp ON a.applicant_id = pp.id JOIN users u ON pp.user_id = u.id JOIN jobs j ON a.job_id = j.id JOIN company_profiles cp ON j.company_id = cp.id ${where} ORDER BY a.applied_at DESC LIMIT ? OFFSET ?` | Daftar semua lamaran (admin view) dengan pagination |
| 27 | `SELECT COUNT(*) AS total FROM applications a JOIN pelamar_profiles pp ON a.applicant_id = pp.id JOIN users u ON pp.user_id = u.id JOIN jobs j ON a.job_id = j.id ${where}` | Hitung total lamaran untuk pagination |

### Manajemen Perusahaan & Verifikasi

| # | SQL | Kegunaan |
|---|-----|----------|
| 28 | `SELECT u.id, u.name, u.email, u.is_active, u.created_at, cp.id AS profile_id, cp.company_name, cp.industry, cp.website, cp.address, cp.description, cp.verification_status FROM users u JOIN company_profiles cp ON u.id = cp.user_id WHERE u.role = 'perusahaan' ${where} ORDER BY u.created_at DESC LIMIT ? OFFSET ?` | Daftar perusahaan dengan search/filter + pagination |
| 29 | `SELECT COUNT(*) AS total FROM users u JOIN company_profiles cp ON u.id = cp.user_id ${where}` | Hitung total perusahaan untuk pagination |
| 39 | `SELECT cp.id FROM users u JOIN company_profiles cp ON u.id = cp.user_id WHERE u.id = ? AND u.role = 'perusahaan'` | Cek apakah user adalah perusahaan sebelum verifikasi |
| 40 | `UPDATE company_profiles SET verification_status = ? WHERE user_id = ?` | Update status verifikasi perusahaan (pending/verified/rejected) |

---

## 6. Middleware & Lainnya

### `middleware/authMiddleware.js`

File: `backend/src/middleware/authMiddleware.js` — 1 query

| SQL | Kegunaan |
|-----|----------|
| `SELECT is_active FROM users WHERE id = ?` | Mengecek apakah akun user masih aktif setiap kali ada request authenticated. Jika `is_active = 0`, request ditolak. |

### `routes/statsRoutes.js`

File: `backend/src/routes/statsRoutes.js` — 3 query

| SQL | Kegunaan |
|-----|----------|
| `SELECT COUNT(*) AS total FROM users WHERE role = 'perusahaan'` | Statistik publik: jumlah perusahaan terdaftar |
| `SELECT COUNT(*) AS total FROM users WHERE role = 'pelamar'` | Statistik publik: jumlah pelamar terdaftar |
| `SELECT COUNT(DISTINCT job_id) AS total FROM applications WHERE status = 'diterima'` | Statistik publik: jumlah lowongan yang sudah terisi |

### `server.js`

File: `backend/src/server.js` — 1 query

| SQL | Kegunaan |
|-----|----------|
| `SELECT 1 + 1 AS result` | Test koneksi database (endpoint `/api/db-test`) |

---

## Ringkasan per File

| File | Jumlah Query |
|------|-------------|
| `adminController.js` | 40 |
| `profileController.js` | 12 |
| `applicationController.js` | 10 |
| `jobController.js` | 9 |
| `authController.js` | 8 |
| `statsRoutes.js` | 3 |
| `middleware/authMiddleware.js` | 1 |
| `server.js` | 1 |

---

## Catatan Teknis

- **Library:** mysql2/promise — menggunakan `pool.query()` (bukan `pool.execute()`)
- **Pool:** dibuat di `backend/src/config/db.js` dengan konfigurasi dari `.env`
- **Parameter binding:** semua query menggunakan placeholder `?` untuk mencegah SQL injection
- **Format:** ES Modules (`"type": "module"` di package.json)
- **Pagination:** menggunakan `LIMIT ? OFFSET ?` dengan variabel `page` dan `limit`
