const slidesData = [
  {
    id: 1,
    type: "cover",
    title: "SISTEM PORTAL\nLOWONGAN KERJA",
    subtitle: "SAFEGUARDING YOUR BUSINESS AND CUSTOMERS",
  },
  {
    id: 2,
    type: "team",
    title: "ANGGOTA KELOMPOK 5",
    members: [
      { number: "01", name: "Rezha Achmad Muharam" },
      { number: "02", name: "Mochamad Vicryandre Nurdin" },
      { number: "03", name: "Agni Kirani" },
      { number: "04", name: "Rovi Aulia" },
      { number: "05", name: "Ainun Naza Apriliani" },
    ],
  },
  {
    id: 3,
    type: "bullets",
    title: "LATAR BELAKANG",
    bullets: [
      "Proses rekrutmen mulai beralih dari sistem konvensional ke sistem digital",
      "Pencari kerja sering kesulitan memperoleh informasi lowongan yang sesuai",
      "Perusahaan juga mengalami kesulitan menemukan kandidat yang tepat",
      "Diperlukan sistem portal lowongan kerja berbasis web yang mampu menghubungkan perusahaan dan pencari kerja",
      "Basis data menjadi komponen utama dalam mengelola seluruh sistem informasi secara terintegrasi",
    ],
  },
  {
    id: 4,
    type: "numbered-cards",
    title: "TUJUAN PROYEK",
    items: [
      { number: "01", text: "Merancang basis data portal lowongan kerja berbasis web" },
      { number: "02", text: "Mengimplementasikan database menggunakan MySQL" },
      { number: "03", text: "Penerapan konsep ERD" },
      { number: "04", text: "Menguji fungsi database agar berjalan sesuai kebutuhan sistem" },
    ],
  },
  {
    id: 5,
    type: "scope",
    title: "RUANG LINGKUP",
    sections: [
      {
        label: "PERANGKAT LUNAK",
        items: ["Laragon", "MySQL", "Visual Studio Code", "ReactJS", "Tailwind CSS", "Microsoft Word"],
      },
      {
        label: "PERANGKAT KERAS",
        items: ["Laptop Intel Core i5", "RAM 8 GB", "SSD 512 GB"],
      },
      {
        label: "FITUR SISTEM",
        items: ["Registrasi Pelamar", "Registrasi Perusahaan", "Login", "Kelola Profil", "Kelola Lowongan", "Cari Lowongan", "Kirim Lamaran", "Kelola Status Lamaran"],
      },
    ],
  },
  {
    id: 6,
    type: "bullets",
    title: "LANDASAN TEORI",
    bullets: [
      "Database Management System (MySQL)",
      "Entity Relationship Diagram (ERD)",
      "Basis Data",
      "SQL (Structured Query Language)",
      "Website",
      "Portal Lowongan Kerja",
    ],
  },
  {
    id: 7,
    type: "numbered-list",
    title: "METODOLOGI",
    steps: [
      "Analisis kebutuhan",
      "Data dasar Perancangan",
      "Implementasi basis data",
      "Pengujian dan evaluasi",
      "Dokumentasi",
    ],
    footer: "Setiap tahap dilakukan secara berurutan untuk menghasilkan database yang sesuai dengan kebutuhan sistem",
  },
  {
    id: 8,
    type: "image",
    title: "ENTITY RELATIONSHIP DIAGRAM",
    image: "/erd.png",
  },
  {
    id: 9,
    type: "database",
    title: "STRUKTUR DATABASE",
    tables: [
      { name: "PENGGUNA", desc: "Data akun pengguna (admin, pelamar, perusahaan)" },
      { name: "PROFIL PELAMAR", desc: "Profil pencari kerja" },
      { name: "PROFIL PERUSAHAAN", desc: "Profil perusahaan" },
      { name: "PEKERJAAN", desc: "Informasi lowongan pekerjaan" },
      { name: "APLIKASI", desc: "Lamaran yang dikirim pelamar" },
    ],
    note: "ERD — Entity Relationship Diagram",
  },
  {
    id: 10,
    type: "bullets",
    title: "IMPLEMENTASI DAN PENGUJIAN",
    bullets: [
      "Menyisipkan (INSERT)",
      "Memilih (SELECT)",
      "Memperbarui (UPDATE)",
      "Menghapus (DELETE)",
      "Bergabung (JOIN)",
      "Kunci Utama (Primary Key)",
      "Kunci Asing (Foreign Key)",
      "Data Integritas",
    ],
  },
  {
    id: 11,
    type: "conclusion",
    title: "KESIMPULAN",
    points: [
      "Database Portal Lowongan Kerja berhasil dirancang dan diimplementasikan",
      "Sistem memiliki lima tabel utama yang saling terhubung menggunakan kunci primer dan kunci asing",
      "Database mampu mendukung proses pengelolaan data pengguna, perusahaan, lowongan, dan lamaran",
      "Proyek meningkatkan kemampuan analisis, perancangan, implementasi, serta pengujian data dasar",
    ],
    closing: "THANK YOU",
  },
];

export default slidesData;
