  1 # ERD Job-Board (Sesuai Schema Project)
  2
  3 Berikut ERD yang mengikuti `database/schema.sql` pada project ini.
  erDiagram
      USERS {
          INT id PK
          VARCHAR name
          VARCHAR email UK
          VARCHAR password
          ENUM role "admin|pelamar|perusahaan"
          BOOLEAN is_active
          TIMESTAMP created_at
          TIMESTAMP updated_at
      }

      PELAMAR_PROFILES {
          INT id PK
          INT user_id FK
          VARCHAR full_name
          VARCHAR phone
          TEXT address
          VARCHAR education
          TEXT skills
          TEXT experience
          VARCHAR cv_url
          VARCHAR profile_picture
          BOOLEAN profile_completed
          TIMESTAMP created_at
          TIMESTAMP updated_at
      }

      COMPANY_PROFILES {
          INT id PK
          INT user_id FK
          VARCHAR company_name
          VARCHAR industry
          TEXT address
          TEXT description
          VARCHAR website
          VARCHAR logo
          BOOLEAN profile_completed
          ENUM verification_status "pending|verified|rejected"
          TIMESTAMP created_at
          TIMESTAMP updated_at
      }

      JOBS {
          INT id PK
          INT company_id FK
          VARCHAR title
          VARCHAR category
          VARCHAR location
          ENUM job_type "Full Time|Part Time|Internship|Remote|Freelance"
          INT salary_min
          INT salary_max
          TEXT description
          TEXT requirements
          DATE deadline
          ENUM status "open|closed"
          TIMESTAMP created_at
          TIMESTAMP updated_at
      }

      APPLICATIONS {
          INT id PK
          INT job_id FK
          INT applicant_id FK
          ENUM status "menunggu|dilihat|interview|diterima|ditolak"
          TEXT cover_letter
          TIMESTAMP applied_at
          TIMESTAMP updated_at
      }

      USERS ||--o{ PELAMAR_PROFILES : "FK user_id -> users.id"
      USERS ||--o{ COMPANY_PROFILES : "FK user_id -> users.id"
      COMPANY_PROFILES ||--o{ JOBS : "FK company_id -> company_profiles.id"
      JOBS ||--o{ APPLICATIONS : "FK job_id -> jobs.id"
      PELAMAR_PROFILES ||--o{ APPLICATIONS : "FK applicant_id -> pelamar_profiles.id"

  1
  2 ## Constraint Penting
  3 - `users.email` UNIQUE
  4 - `applications` memiliki UNIQUE (`job_id`, `applicant_id`) agar pelamar tidak bisa apply lowongan yang sama lebih dari sekali.