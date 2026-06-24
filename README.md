<div align="center">

# Work'in
### Platform Pencarian Kerja & Manajemen Lowongan

*Repo: `Job-Board` — tiga peran, satu database, nol drama (sebagian besar waktu).*

[![Node.js](https://img.shields.io/badge/Node.js-20.19%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-5.x-000000?logo=express&logoColor=white)](https://expressjs.com)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

</div>

---

## Apa ini?

Work'in adalah aplikasi job board full-stack: tempat **pelamar** mencari dan melamar kerja, **perusahaan** memasang lowongan dan menyaring kandidat, serta **admin** mengawasi semuanya dari satu dashboard analitik. Bukan landing page kosong dengan tombol "Coming Soon" — alurnya benar-benar jalan dari ujung ke ujung: registrasi → lengkapi profil → lamar/posting lowongan → ubah status lamaran → terima atau tolak.

Backend-nya REST API polos di atas Express 5 dan MySQL murni (tanpa ORM — semua query SQL ditulis manual lewat `mysql2/promise`), sedangkan frontend-nya SPA React 19 dengan dashboard yang punya grafik (recharts), animasi (motion), bahkan latar 3D beam di landing page (react-three-fiber). Kombinasi yang jarang ditemui di proyek job board kebanyakan, yang biasanya berhenti di CRUD doang.

Proyek ini sengaja **tidak** memakai npm workspaces — `backend/` dan `frontend/` adalah dua aplikasi Node terpisah dengan `package.json`-nya sendiri-sendiri, jadi siap-siap buka dua terminal kalau mau jalanin keduanya bareng.

---

## Daftar Isi

- [Fitur](#fitur)
- [Tumpukan Teknologi](#tumpukan-teknologi)
- [Struktur Direktori](#struktur-direktori)
- [Skema Database](#skema-database)
- [Alur Autentikasi & Role](#alur-autentikasi--role)
- [Dokumentasi API](#dokumentasi-api)
- [Instalasi & Menjalankan Secara Lokal](#instalasi--menjalankan-secara-lokal)
- [Environment Variables](#environment-variables)
- [Detail yang Mungkin Tidak Kelihatan dari Luar](#detail-yang-mungkin-tidak-kelihatan-dari-luar)
- [Keterbatasan & Ide Pengembangan Lanjutan](#keterbatasan--ide-pengembangan-lanjutan)
- [Kontribusi](#kontribusi)
- [Lisensi](#lisensi)

---

## Fitur

### 🌐 Publik (tanpa login)
- Landing page dengan statistik live (`/api/stats/public`): jumlah perusahaan terdaftar, pelamar aktif, dan lowongan yang sudah terisi (dihitung dari lamaran berstatus `diterima`).
- Pencarian lowongan (`/jobs`) dengan filter judul/nama perusahaan, kategori, lokasi, dan multi-pilih tipe kerja (Full Time, Part Time, Internship, Remote, Freelance).
- Detail lowongan lengkap dengan profil perusahaan yang memasangnya.

### 🧑‍💼 Pelamar
- Registrasi mandiri dengan profil pelamar otomatis dibuat saat akun dibuat.
- Lengkapi profil: nomor HP, alamat, pendidikan, skill, pengalaman, dan **link CV** (bukan upload file — lihat catatan di bawah).
- Upload/hapus foto profil (JPG/PNG/WebP, maks. 2 MB).
- Lamar lowongan dengan cover letter opsional — sistem mencegah lamar dua kali ke lowongan yang sama, baik di level aplikasi maupun di level database (`UNIQUE(job_id, applicant_id)`).
- Dashboard riwayat lamaran dengan breakdown status: Menunggu → Dilihat → Interview → Diterima/Ditolak.
- Ganti password (dengan verifikasi password lama).

### 🏢 Perusahaan
- Registrasi mandiri dengan profil perusahaan otomatis dibuat saat akun dibuat.
- Lengkapi profil: nama, industri, alamat, deskripsi, website, dan logo.
- CRUD lowongan kerja lengkap: judul, kategori, lokasi, tipe kerja, rentang gaji, deskripsi, persyaratan, deadline, dan status (open/closed).
- Lihat semua pelamar yang masuk per lowongan, lengkap dengan detail profil dan cover letter.
- Ubah status lamaran kandidat (5 tahap, sama seperti yang dilihat pelamar).
- Dashboard ringkasan: total pelamar masuk dan breakdown per status.

### 🛡️ Admin
- Dashboard statistik global: total user, admin, perusahaan, pelamar, lowongan, total lamaran, dan jumlah diterima dalam 30 hari terakhir.
- Grafik tren harian (periode 7 hari/30 hari/90 hari/1 tahun) untuk 4 metrik sekaligus: pendaftaran pelamar, pendaftaran perusahaan, lamaran diterima, dan lowongan dibuat — termasuk hari-hari dengan nilai nol, jadi grafiknya tidak bolong.
- Distribusi data dalam beberapa pie/bar chart: rasio pelamar vs perusahaan, status lamaran, status verifikasi perusahaan, tipe pekerjaan, dan kategori pekerjaan ter-populer.
- **Funnel konversi**: dari total pelamar unik → total lamaran → tersebar ke 5 tahap status, jadi kelihatan di mana titik dropout-nya.
- Setiap grafik bisa diunduh sebagai PNG satu klik (pakai `html-to-image` + `file-saver`).
- Kelola user: cari, filter berdasarkan role/status aktif, paginasi, aktifkan/nonaktifkan akun, hapus akun — **kecuali akun admin lain**, yang sengaja diproteksi dari kedua aksi tersebut di level controller.
- Kelola lowongan: cari, filter status, paginasi, edit, hapus — lintas semua perusahaan.
- Kelola lamaran: lihat semua lamaran yang masuk di seluruh sistem dengan pencarian dan paginasi.
- Verifikasi perusahaan: ubah status `pending` → `verified`/`rejected`.

---

## Tumpukan Teknologi

### Backend (`backend/`)

| Pustaka | Versi | Peran |
|---|---|---|
| Express | ^5.2.1 | Web framework, sudah pakai Express 5 (bukan 4) |
| mysql2 | ^3.22.4 | Driver MySQL, dipakai lewat connection pool + `promise()` API, semua query parameterized |
| jsonwebtoken | ^9.0.3 | Autentikasi berbasis JWT, token berlaku 1 hari |
| bcrypt | ^6.0.0 | Hashing password (10 salt rounds) |
| multer | ^2.1.1 | Upload file (foto profil & logo perusahaan ke disk lokal) |
| cors, dotenv | terbaru | Konfigurasi dasar |
| nodemon | ^3.1.14 | Dev-only, auto-restart server |

Tidak ada ORM. Tidak ada query builder. Semua query SQL ditulis tangan di masing-masing controller — bisa dicek detilnya satu per satu di [`query.md`](./query.md), yang mendokumentasikan seluruh 84 query yang dipakai aplikasi ini.

### Frontend (`frontend/`)

| Pustaka | Versi | Peran |
|---|---|---|
| React | ^19.2.6 | UI library |
| Vite | ^8.0.12 | Dev server & bundler (butuh Node 20.19+/22.12+) |
| react-router-dom | ^7.17.0 | Routing SPA, termasuk route ter-proteksi berbasis role |
| Tailwind CSS | ^4.3.0 | Styling, via plugin `@tailwindcss/vite` |
| Radix UI + shadcn pattern | — | Primitive accessible (`Checkbox`, `Label`, `Slot`) di balik komponen `Button`/`Card`/`Input` custom |
| axios | ^1.17.0 | HTTP client, dengan interceptor yang otomatis menyisipkan JWT dari `localStorage` |
| recharts | ^3.8.1 | Semua grafik di dashboard admin (line, bar, area, pie, funnel) |
| three, @react-three/fiber, @react-three/drei | terbaru | Latar belakang animasi 3D "Beams" di landing page |
| motion | ^12.40.0 | Animasi modal dan transisi UI (penerus Framer Motion) |
| html-to-image + file-saver | terbaru | Export grafik admin jadi file PNG |
| lucide-react | ^1.17.0 | Ikon |

### Database
- **MySQL** — 5 tabel relasional (`users`, `pelamar_profiles`, `company_profiles`, `jobs`, `applications`), tanpa migration tool; skema dikelola lewat file SQL mentah.

---

## Struktur Direktori

```
Job-Board/
├── backend/
│   ├── public/uploads/          # File upload (profiles/, companies/) — disajikan statis lewat /uploads
│   └── src/
│       ├── config/              # Koneksi DB (pool mysql2) & konfigurasi multer
│       ├── controllers/         # Logika bisnis: auth, job, application, profile, admin
│       ├── middleware/          # authMiddleware (verifikasi JWT + cek is_active) & roleMiddleware
│       ├── routes/               # Definisi endpoint per modul
│       └── server.js            # Entry point Express
│
├── frontend/
│   └── src/
│       ├── api/client.js        # Instance axios + helper adminApi
│       ├── context/AuthContext.jsx
│       ├── routes/ProtectedRoute.jsx
│       ├── components/          # Modal, DataTable, charts/, ui/ (shadcn-style)
│       └── pages/               # 16 halaman: landing, auth, jobs, 3 dashboard role, dst.
│
├── database/
│   ├── schema.sql                # DDL lengkap, siap di-import
│   └── backup/backup_db_jobs.sql # Dump struktur (tanpa data dummy)
│
├── ERD.md                        # Diagram relasi entitas
├── query.md                      # Inventaris 84 query SQL yang dipakai di seluruh backend
└── package.json                  # Hanya berisi devDependency `shadcn` — bukan workspace root
```

---

## Skema Database

Lima tabel, relasi 1-ke-banyak berantai dari `users` sampai `applications`. Diagram lengkap ada di [`ERD.md`](./ERD.md); ringkasannya:

| Tabel | Inti | Catatan |
|---|---|---|
| `users` | Akun login (`role`: admin/pelamar/perusahaan) | `email` unik, ada flag `is_active` untuk soft-deactivate |
| `pelamar_profiles` | Data diri pelamar | 1:1 dengan `users`, dibuat otomatis saat registrasi |
| `company_profiles` | Data perusahaan | 1:1 dengan `users`, punya `verification_status` (pending/verified/rejected) |
| `jobs` | Lowongan kerja | Dimiliki satu `company_profiles`, status `open`/`closed` |
| `applications` | Lamaran | Menghubungkan `jobs` ↔ `pelamar_profiles`, status 5 tahap dalam Bahasa Indonesia |

Constraint yang paling berpengaruh ke logika aplikasi:

```sql
CONSTRAINT unique_application UNIQUE (job_id, applicant_id)
```

Ini bukan sekadar validasi di controller — duplikasi lamaran memang ditolak langsung oleh MySQL. Semua foreign key juga di-set `ON DELETE CASCADE`, jadi menghapus satu user otomatis membersihkan profil, lowongan (kalau perusahaan), dan lamaran terkait tanpa baris yatim piatu.

---

## Alur Autentikasi & Role

- Login mengembalikan JWT (`expiresIn: '1d'`) yang disimpan di `localStorage` frontend dan disisipkan otomatis ke setiap request lewat interceptor axios.
- `authMiddleware` tidak cuma verifikasi signature token — ia juga query ulang ke DB untuk memastikan `is_active` masih `true`. Artinya akun yang dinonaktifkan admin langsung kehilangan akses meski token-nya belum expired.
- `roleMiddleware('perusahaan')`, `roleMiddleware('pelamar')`, dkk. membatasi endpoint per role di level route, bukan dicek manual satu-satu di controller.
- **Penting untuk yang mau setup dari nol:** endpoint `POST /api/auth/register` cuma menerima `role` berupa `pelamar` atau `perusahaan` — **tidak ada jalur publik untuk membuat akun admin**. Untuk punya akun admin, kamu harus registrasi biasa lalu ubah kolom `role` jadi `'admin'` langsung lewat MySQL:

  ```sql
  UPDATE users SET role = 'admin' WHERE email = 'kamu@contoh.com';
  ```

---

## Dokumentasi API

Base URL default: `http://localhost:5000/api` (atur lewat `VITE_API_BASE_URL` di frontend).

#### Auth — `/auth`
| Method | Endpoint | Auth | Keterangan |
|---|---|---|---|
| POST | `/auth/register` | – | `role` hanya boleh `pelamar` atau `perusahaan` |
| POST | `/auth/login` | – | Mengembalikan JWT + data user |
| GET | `/auth/me` | ✅ | Profil user yang sedang login |
| PUT | `/auth/change-password` | ✅ | Wajib sertakan password lama |

#### Lowongan — `/jobs`
| Method | Endpoint | Auth | Keterangan |
|---|---|---|---|
| GET | `/jobs` | – | Publik, hanya status `open`. Filter: `q`, `category`, `location`, `job_type` (comma-separated) |
| GET | `/jobs/:id` | – | Detail + info perusahaan |
| GET | `/jobs/company/my-jobs` | ✅ perusahaan | Lowongan milik akun yang login |
| POST | `/jobs` | ✅ perusahaan | Buat lowongan baru |
| PUT | `/jobs/:id` | ✅ perusahaan | Wajib pemilik lowongan |
| DELETE | `/jobs/:id` | ✅ perusahaan | Wajib pemilik lowongan |

#### Lamaran — `/applications`
| Method | Endpoint | Auth | Keterangan |
|---|---|---|---|
| POST | `/applications/:jobId` | ✅ pelamar | Cek status lowongan & cegah lamar dobel |
| GET | `/applications/my-applications` | ✅ pelamar | Riwayat lamaran sendiri |
| GET | `/applications/company` | ✅ perusahaan | Semua lamaran masuk |
| GET | `/applications/company/:id` | ✅ perusahaan | Detail satu lamaran + profil pelamar |
| PATCH | `/applications/:id/status` | ✅ perusahaan | Status: `menunggu`/`dilihat`/`interview`/`diterima`/`ditolak` |

#### Profil — `/profiles`
| Method | Endpoint | Auth | Keterangan |
|---|---|---|---|
| GET / PUT | `/profiles/pelamar/me` | ✅ pelamar | Baca/ubah profil pelamar |
| PUT / DELETE | `/profiles/pelamar/me/photo` | ✅ pelamar | Upload (multer, ≤2 MB) / hapus foto |
| POST | `/profiles/pelamar/me/skip` | ✅ pelamar | Lewati pengisian profil |
| GET / PUT | `/profiles/company/me` | ✅ perusahaan | Baca/ubah profil perusahaan |
| PUT / DELETE | `/profiles/company/me/logo` | ✅ perusahaan | Upload / hapus logo |
| POST | `/profiles/company/me/skip` | ✅ perusahaan | Lewati pengisian profil |

#### Statistik Publik — `/stats`
| Method | Endpoint | Auth | Keterangan |
|---|---|---|---|
| GET | `/stats/public` | – | Total perusahaan, pelamar, lowongan terisi (untuk landing page) |

#### Admin — `/admin` *(semua butuh role `admin`)*
| Method | Endpoint | Keterangan |
|---|---|---|
| GET | `/admin/stats` | Ringkasan angka global |
| GET | `/admin/stats/chart?period=` | Tren harian 4 metrik (`7d`/`30d`/`90d`/`1y`) |
| GET | `/admin/stats/distribution?period=` | Data untuk pie/bar chart |
| GET | `/admin/stats/funnel` | Funnel konversi lamaran |
| GET | `/admin/users?q=&role=&is_active=&page=&limit=` | Daftar user, dengan paginasi |
| PATCH / DELETE | `/admin/users/:id` | Ubah role/status atau hapus — **diblokir untuk target ber-role admin** |
| GET | `/admin/jobs?q=&status=&page=&limit=` | Daftar semua lowongan |
| PATCH / DELETE | `/admin/jobs/:id` | Edit/hapus lowongan siapa pun |
| GET | `/admin/applications?q=&status=&page=&limit=` | Daftar semua lamaran |
| GET | `/admin/companies?q=&verification_status=&page=&limit=` | Daftar perusahaan |
| PATCH | `/admin/companies/:id/verify` | Ubah `verification_status` |

---

## Instalasi & Menjalankan Secara Lokal

### Prasyarat
- Node.js **20.19+** atau **22.12+** (Vite 8 menolak versi di bawah itu)
- MySQL 8.x (atau MariaDB yang kompatibel)
- npm

### 1. Clone & masuk ke folder

```bash
git clone https://github.com/andrebaik/Job-Board.git
cd Job-Board
```

### 2. Siapkan database

```bash
mysql -u root -p < database/schema.sql
```

Ini akan membuat database `db_jobs` beserta lima tabelnya. File `database/backup/backup_db_jobs.sql` tersedia juga sebagai cadangan struktur, tapi keduanya tidak menyertakan data dummy — semua tabel akan kosong setelah import.

### 3. Jalankan backend

```bash
cd backend
npm install
cp .env.example .env
```

Isi `.env` sesuai kredensial MySQL kamu (lihat tabel [Environment Variables](#environment-variables) di bawah), lalu:

```bash
npm run dev      # via nodemon, auto-restart
# atau
npm start        # mode biasa
```

Backend default jalan di `http://localhost:5000`. Cek cepat dengan `GET /api/health` atau `GET /api/db-test`.

### 4. Jalankan frontend

Buka terminal baru:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend default jalan di `http://localhost:5173` (port standar Vite).

### 5. Buat akun pertama

Daftar lewat `/register` sebagai `pelamar` atau `perusahaan` — atau, kalau ingin akses dashboard admin, daftar dulu lalu jalankan query `UPDATE users SET role = 'admin' WHERE email = '...'` seperti dijelaskan di bagian [Alur Autentikasi & Role](#alur-autentikasi--role).

---

## Environment Variables

### `backend/.env`

| Variabel | Contoh | Keterangan |
|---|---|---|
| `PORT` | `5000` | Port server Express |
| `DB_HOST` | `localhost` | Host MySQL |
| `DB_USER` | `root` | User MySQL |
| `DB_PASSWORD` | *(kosong)* | Password MySQL |
| `DB_NAME` | `db_jobs` | Nama database |
| `JWT_SECRET` | `your_jwt_secret` | **Wajib diganti** dengan string acak yang panjang sebelum dipakai serius |
| `FRONTEND_URL` | `http://localhost:5173` | Tersedia di env, meski saat ini CORS masih diset terbuka (`cors()` tanpa opsi) |

### `frontend/.env`

| Variabel | Contoh | Keterangan |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:5000/api` | Base URL yang dipakai axios & fetch ke statistik publik |

---

## Detail yang Mungkin Tidak Kelihatan dari Luar

Beberapa keputusan implementasi yang baru kelihatan kalau baca kodenya langsung, bukan dari nebak-nebak fitur dari UI:

- **CV bukan file upload.** Field `cv_url` di profil pelamar cuma input teks biasa untuk link (Google Drive, Dropbox, dsb). Hanya foto profil dan logo perusahaan yang benar-benar lewat `multer` ke disk lokal.
- **Pencegahan lamar ganda berlapis dua.** Dicek di controller (`SELECT` sebelum `INSERT`) *dan* dipaksa oleh constraint `UNIQUE` di database — jadi race condition pun tetap aman.
- **Soft-deactivate, bukan hard delete, buat user biasa.** Admin menonaktifkan akun lewat `is_active`, dan `authMiddleware` mengecek ulang flag ini di setiap request — bukan cuma saat login.
- **Admin tidak bisa "memakan" admin lain.** `updateUser` dan `deleteUser` di sisi admin menolak aksi kalau target-nya juga berrole `admin`, mencegah skenario satu admin nakal menghapus admin lain (atau dirinya sendiri secara tidak sengaja).
- **Endpoint publik vs endpoint admin punya filosofi beda.** `GET /jobs` (publik) mengembalikan semua hasil sekaligus tanpa paginasi — wajar untuk listing lowongan terbuka yang biasanya tidak akan meledak jumlahnya. Sebaliknya, semua endpoint admin (`/admin/users`, `/admin/jobs`, dst.) sudah dilengkapi `page`/`limit`/`totalPages` sejak awal, karena data di sana memang dirancang untuk berkembang.
- **Grafik tren mengisi tanggal kosong dengan nol.** `getChartData` membangun rentang tanggal penuh terlebih dahulu sebelum mengisi data asli, jadi grafik recharts tidak terlihat "patah" di hari tanpa aktivitas.
- **Tiga modal kustom, bukan `window.confirm()`.** `ConfirmModal` (untuk aksi destruktif), `LogoutModal`, dan `UnsavedModal` (peringatan saat keluar dari form yang belum disimpan) — dianimasikan dengan `motion`, bukan dialog browser bawaan.
- **Branding di UI berbeda dari nama repo.** Secara teknis nama repository ini `Job-Board`, tapi yang tampil di navbar, logo, dan teks "Tentang" aplikasi adalah **Work'in**.

---

## Keterbatasan & Ide Pengembangan Lanjutan

Supaya jujur dan tidak menjual proyek ini lebih dari kenyataannya — beberapa hal yang belum ada dan bisa jadi pekerjaan rumah selanjutnya:

- **Tidak ada automated test.** Tidak ada folder test, tidak ada script `test` di `package.json` mana pun. Semua verifikasi saat ini manual.
- **Belum ada file lisensi** di root repo. Tambahkan `LICENSE` (MIT/Apache-2.0/dst.) sesuai preferensi sebelum dipakai di luar konteks belajar/portofolio.
- **JWT tidak punya refresh token.** Token mati otomatis dalam 1 hari dan user harus login ulang — tidak ada mekanisme silent refresh.
- **CORS masih default-terbuka** (`app.use(cors())` tanpa whitelist origin), meski variabel `FRONTEND_URL` sudah disiapkan di `.env`. Cocok untuk development, perlu dikencangkan untuk produksi.
- **Tidak ada rate limiting** di endpoint auth (`/login`, `/register`), jadi rawan brute-force kalau di-deploy publik tanpa proteksi tambahan (reverse proxy, WAF, dsb.).
- **Tidak ada notifikasi email** sama sekali — perubahan status lamaran, verifikasi perusahaan, semuanya cuma terlihat kalau user login dan cek dashboard sendiri.
- **CV masih sebatas link**, belum ada upload file PDF/dokumen yang sesungguhnya seperti foto profil dan logo.
- **Tidak ada script orchestration** di root untuk menjalankan backend + frontend sekaligus (mis. lewat `concurrently`) — saat ini memang harus dua terminal.

---

## Kontribusi

Pull request, issue, atau sekadar masukan soal struktur kode sangat diterima. Kalau mau berkontribusi:

1. Fork repo ini.
2. Buat branch baru (`git checkout -b fitur/nama-fitur`).
3. Pastikan `npm run lint` di folder `frontend/` lolos sebelum commit.
4. Ajukan pull request dengan deskripsi yang jelas tentang apa yang diubah dan kenapa.

---

## Lisensi

Belum ada file lisensi resmi di repository ini. Sebelum digunakan di luar keperluan belajar atau portofolio pribadi, pertimbangkan untuk menambahkan lisensi open-source (misalnya MIT) agar jelas batasan penggunaannya bagi pihak lain.

---

<div align="center">

Dibuat dan dikembangkan oleh [**andrebaik**](https://github.com/andrebaik) — repo: [`Job-Board`](https://github.com/andrebaik/Job-Board)

</div>