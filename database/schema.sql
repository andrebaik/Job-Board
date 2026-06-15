CREATE DATABASE IF NOT EXISTS db_jobs;
USE db_jobs;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'pelamar', 'perusahaan') NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE pelamar_profiles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  full_name VARCHAR(100),
  phone VARCHAR(20),
  address TEXT,
  education VARCHAR(100),
  skills TEXT,
  experience TEXT,
  cv_url VARCHAR(255),
  profile_picture VARCHAR(255),
  profile_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE company_profiles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  company_name VARCHAR(150),
  industry VARCHAR(100),
  address TEXT,
  description TEXT,
  website VARCHAR(255),
  logo VARCHAR(255),
  profile_completed BOOLEAN DEFAULT FALSE,
  verification_status ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE jobs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  company_id INT NOT NULL,
  title VARCHAR(150) NOT NULL,
  category VARCHAR(100),
  location VARCHAR(100),
  job_type ENUM('Full Time', 'Part Time', 'Internship', 'Remote', 'Freelance') DEFAULT 'Full Time',
  salary_min INT,
  salary_max INT,
  description TEXT,
  requirements TEXT,
  deadline DATE,
  status ENUM('open', 'closed') DEFAULT 'open',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES company_profiles(id) ON DELETE CASCADE
);

CREATE TABLE applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  job_id INT NOT NULL,
  applicant_id INT NOT NULL,
  status ENUM('menunggu', 'dilihat', 'interview', 'diterima', 'ditolak') DEFAULT 'menunggu',
  cover_letter TEXT,
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
  FOREIGN KEY (applicant_id) REFERENCES pelamar_profiles(id) ON DELETE CASCADE,
  CONSTRAINT unique_application UNIQUE (job_id, applicant_id)
);