import db from '../config/db.js'

const getApplicantProfileId = async (userId) => {
  const [rows] = await db.query(
    'SELECT id FROM pelamar_profiles WHERE user_id = ?',
    [userId]
  )

  if (rows.length === 0) {
    return null
  }

  return rows[0].id
}

const getCompanyProfileId = async (userId) => {
  const [rows] = await db.query(
    'SELECT id FROM company_profiles WHERE user_id = ?',
    [userId]
  )

  if (rows.length === 0) {
    return null
  }

  return rows[0].id
}

export const applyJob = async (req, res) => {
  try {
    const { jobId } = req.params
    const { cover_letter } = req.body

    const applicantId = await getApplicantProfileId(req.user.id)

    if (!applicantId) {
      return res.status(404).json({
        status: 'error',
        message: 'Profil pelamar tidak ditemukan'
      })
    }

    const [jobs] = await db.query(
      'SELECT id, status FROM jobs WHERE id = ?',
      [jobId]
    )

    if (jobs.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Lowongan tidak ditemukan'
      })
    }

    if (jobs[0].status !== 'open') {
      return res.status(400).json({
        status: 'error',
        message: 'Lowongan sudah ditutup'
      }) 
    }

    const [existing] = await db.query(
      'SELECT id FROM applications WHERE job_id = ? AND applicant_id = ?',
      [jobId, applicantId]
    )

    if (existing.length > 0) {
      return res.status(409).json({
        status: 'error',
        message: 'Kamu sudah melamar lowongan ini'
      })
    }

    const [result] = await db.query(
      `
      INSERT INTO applications
      (job_id, applicant_id, cover_letter, status)
      VALUES (?, ?, ?, ?)
      `,
      [jobId, applicantId, cover_letter || null, 'menunggu']
    )

    return res.status(201).json({
      status: 'success',
      message: 'Lamaran berhasil dikirim',
      data: {
        id: result.insertId
      }
    })
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Gagal mengirim lamaran',
      error: error.message
    })
  }
}

export const getMyApplications = async (req, res) => {
  try {
    const applicantId = await getApplicantProfileId(req.user.id)

    if (!applicantId) {
      return res.status(404).json({
        status: 'error',
        message: 'Profil pelamar tidak ditemukan'
      })
    }

    const [applications] = await db.query(
      `
      SELECT
        applications.id,
        applications.status,
        applications.cover_letter,
        applications.applied_at,
        applications.updated_at,

        jobs.id AS job_id,
        jobs.title,
        jobs.category,
        jobs.location,
        jobs.job_type,
        jobs.salary_min,
        jobs.salary_max,
        jobs.deadline,

        company_profiles.company_name,
        company_profiles.industry
      FROM applications
      JOIN jobs ON applications.job_id = jobs.id
      JOIN company_profiles ON jobs.company_id = company_profiles.id
      WHERE applications.applicant_id = ?
      ORDER BY applications.applied_at DESC
      `,
      [applicantId]
    )

    return res.json({
      status: 'success',
      data: applications
    })
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Gagal mengambil riwayat lamaran',
      error: error.message
    })
  }
}

export const getCompanyApplications = async (req, res) => {
  try {
    const companyId = await getCompanyProfileId(req.user.id)

    if (!companyId) {
      return res.status(404).json({
        status: 'error',
        message: 'Profil perusahaan tidak ditemukan'
      })
    }

    const [applications] = await db.query(
      `
      SELECT
        applications.id,
        applications.status,
        applications.cover_letter,
        applications.applied_at,
        applications.updated_at,

        jobs.id AS job_id,
        jobs.title AS job_title,

        pelamar_profiles.id AS applicant_profile_id,
        pelamar_profiles.full_name,
        pelamar_profiles.phone,
        pelamar_profiles.address,
        pelamar_profiles.education,
        pelamar_profiles.skills,
        pelamar_profiles.experience,
        pelamar_profiles.cv_url,

        users.name,
        users.email
      FROM applications
      JOIN jobs ON applications.job_id = jobs.id
      JOIN pelamar_profiles ON applications.applicant_id = pelamar_profiles.id
      JOIN users ON pelamar_profiles.user_id = users.id
      WHERE jobs.company_id = ?
      ORDER BY applications.applied_at DESC
      `,
      [companyId]
    )

    return res.json({
      status: 'success',
      data: applications
    })
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Gagal mengambil data pelamar',
      error: error.message
    })
  }
}

export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    const allowedStatuses = [
      'menunggu',
      'dilihat',
      'interview',
      'diterima',
      'ditolak'
    ]

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        status: 'error',
        message: 'Status lamaran tidak valid'
      })
    }

    const companyId = await getCompanyProfileId(req.user.id)

    if (!companyId) {
      return res.status(404).json({
        status: 'error',
        message: 'Profil perusahaan tidak ditemukan'
      })
    }

    const [applications] = await db.query(
      `
      SELECT applications.id
      FROM applications
      JOIN jobs ON applications.job_id = jobs.id
      WHERE applications.id = ? AND jobs.company_id = ?
      `,
      [id, companyId]
    )

    if (applications.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Lamaran tidak ditemukan atau bukan milik perusahaan ini'
      })
    }

    await db.query(
      'UPDATE applications SET status = ? WHERE id = ?',
      [status, id]
    )

    return res.json({
      status: 'success',
      message: 'Status lamaran berhasil diperbarui'
    })
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Gagal memperbarui status lamaran',
      error: error.message
    })
  }
}

export const getCompanyApplicationDetail = async (req, res) => {
  try {
    const { id } = req.params

    const companyId = await getCompanyProfileId(req.user.id)

    if (!companyId) {
      return res.status(404).json({
        status: 'error',
        message: 'Profil perusahaan tidak ditemukan'
      })
    }

    const [applications] = await db.query(
      `
      SELECT
        applications.id,
        applications.status,
        applications.cover_letter,
        applications.applied_at,
        applications.updated_at,

        jobs.id AS job_id,
        jobs.title AS job_title,
        jobs.category,
        jobs.location,
        jobs.job_type,
        jobs.salary_min,
        jobs.salary_max,
        jobs.description AS job_description,
        jobs.requirements,
        jobs.deadline,

        pelamar_profiles.id AS applicant_profile_id,
        pelamar_profiles.full_name,
        pelamar_profiles.phone,
        pelamar_profiles.address,
        pelamar_profiles.education,
        pelamar_profiles.skills,
        pelamar_profiles.experience,
        pelamar_profiles.cv_url,

        users.name,
        users.email
      FROM applications
      JOIN jobs ON applications.job_id = jobs.id
      JOIN pelamar_profiles ON applications.applicant_id = pelamar_profiles.id
      JOIN users ON pelamar_profiles.user_id = users.id
      WHERE applications.id = ? AND jobs.company_id = ?
      `,
      [id, companyId]
    )

    if (applications.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Lamaran tidak ditemukan atau bukan milik perusahaan ini'
      })
    }

    return res.json({
      status: 'success',
      data: applications[0]
    })
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Gagal mengambil detail pelamar',
      error: error.message
    })
  }
}