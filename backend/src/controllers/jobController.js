import db from '../config/db.js'

const getCompanyProfileId = async (userId) => {
  const [companies] = await db.query(
    'SELECT id FROM company_profiles WHERE user_id = ?',
    [userId]
  )

  if (companies.length === 0) {
    return null
  }

  return companies[0].id
}

export const getAllJobs = async (req, res) => {
  try {
    const { q, category, location, job_type } = req.query
    const conditions = ["jobs.status = 'open'"]
    const params = []

    if (q) {
      conditions.push('(jobs.title LIKE ? OR company_profiles.company_name LIKE ?)')
      params.push(`%${q}%`, `%${q}%`)
    }
    if (category) {
      conditions.push('jobs.category = ?')
      params.push(category)
    }
    if (location) {
      conditions.push('jobs.location LIKE ?')
      params.push(`%${location}%`)
    }
    if (job_type) {
      const types = job_type.split(',')
      const placeholders = types.map(() => '?').join(',')
      conditions.push(`jobs.job_type IN (${placeholders})`)
      params.push(...types)
    }

    const where = 'WHERE ' + conditions.join(' AND ')

    const [jobs] = await db.query(`
      SELECT 
        jobs.id,
        jobs.title,
        jobs.category,
        jobs.location,
        jobs.job_type,
        jobs.salary_min,
        jobs.salary_max,
        jobs.description,
        jobs.requirements,
        jobs.deadline,
        jobs.status,
        jobs.created_at,
        company_profiles.company_name,
        company_profiles.industry
      FROM jobs
      JOIN company_profiles ON jobs.company_id = company_profiles.id
      ${where}
      ORDER BY jobs.created_at DESC
    `, params)

    return res.json({
      status: 'success',
      data: jobs
    })
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Gagal mengambil data lowongan',
      error: error.message
    })
  }
}

export const getJobById = async (req, res) => {
  try {
    const { id } = req.params

    const [jobs] = await db.query(
      `
      SELECT 
        jobs.*,
        company_profiles.company_name,
        company_profiles.industry,
        company_profiles.address AS company_address,
        company_profiles.description AS company_description,
        company_profiles.website,
        company_profiles.logo
      FROM jobs
      JOIN company_profiles ON jobs.company_id = company_profiles.id
      WHERE jobs.id = ?
      `,
      [id]
    )

    if (jobs.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Lowongan tidak ditemukan'
      })
    }

    return res.json({
      status: 'success',
      data: jobs[0]
    })
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Gagal mengambil detail lowongan',
      error: error.message
    })
  }
}

export const getCompanyJobs = async (req, res) => {
  try {
    const companyId = await getCompanyProfileId(req.user.id)

    if (!companyId) {
      return res.status(404).json({
        status: 'error',
        message: 'Profil perusahaan tidak ditemukan'
      })
    }

    const [jobs] = await db.query(
      `
      SELECT *
      FROM jobs
      WHERE company_id = ?
      ORDER BY created_at DESC
      `,
      [companyId]
    )

    return res.json({
      status: 'success',
      data: jobs
    })
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Gagal mengambil lowongan perusahaan',
      error: error.message
    })
  }
}

export const createJob = async (req, res) => {
  try {
    const companyId = await getCompanyProfileId(req.user.id)

    if (!companyId) {
      return res.status(404).json({
        status: 'error',
        message: 'Profil perusahaan tidak ditemukan'
      })
    }

    const {
      title,
      category,
      location,
      job_type,
      salary_min,
      salary_max,
      description,
      requirements,
      deadline
    } = req.body

    if (!title || !location || !description || !requirements || !deadline) {
      return res.status(400).json({
        status: 'error',
        message: 'Judul, lokasi, deskripsi, persyaratan, dan deadline wajib diisi'
      })
    }

    const [result] = await db.query(
      `
      INSERT INTO jobs 
      (
        company_id,
        title,
        category,
        location,
        job_type,
        salary_min,
        salary_max,
        description,
        requirements,
        deadline,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        companyId,
        title,
        category || null,
        location,
        job_type || 'Full Time',
        salary_min || null,
        salary_max || null,
        description,
        requirements,
        deadline,
        'open'
      ]
    )

    return res.status(201).json({
      status: 'success',
      message: 'Lowongan berhasil dibuat',
      data: {
        id: result.insertId
      }
    })
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Gagal membuat lowongan',
      error: error.message
    })
  }
}

export const updateJob = async (req, res) => {
  try {
    const { id } = req.params
    const companyId = await getCompanyProfileId(req.user.id)

    if (!companyId) {
      return res.status(404).json({
        status: 'error',
        message: 'Profil perusahaan tidak ditemukan'
      })
    }

    const {
      title,
      category,
      location,
      job_type,
      salary_min,
      salary_max,
      description,
      requirements,
      deadline,
      status
    } = req.body

    const [existingJobs] = await db.query(
      'SELECT id FROM jobs WHERE id = ? AND company_id = ?',
      [id, companyId]
    )

    if (existingJobs.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Lowongan tidak ditemukan atau bukan milik perusahaan ini'
      })
    }

    await db.query(
      `
      UPDATE jobs
      SET
        title = ?,
        category = ?,
        location = ?,
        job_type = ?,
        salary_min = ?,
        salary_max = ?,
        description = ?,
        requirements = ?,
        deadline = ?,
        status = ?
      WHERE id = ? AND company_id = ?
      `,
      [
        title,
        category,
        location,
        job_type,
        salary_min,
        salary_max,
        description,
        requirements,
        deadline,
        status || 'open',
        id,
        companyId
      ]
    )

    return res.json({
      status: 'success',
      message: 'Lowongan berhasil diperbarui'
    })
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Gagal memperbarui lowongan',
      error: error.message
    })
  }
}

export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params
    const companyId = await getCompanyProfileId(req.user.id)

    if (!companyId) {
      return res.status(404).json({
        status: 'error',
        message: 'Profil perusahaan tidak ditemukan'
      })
    }

    const [existingJobs] = await db.query(
      'SELECT id FROM jobs WHERE id = ? AND company_id = ?',
      [id, companyId]
    )

    if (existingJobs.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Lowongan tidak ditemukan atau bukan milik perusahaan ini'
      })
    }

    await db.query(
      'DELETE FROM jobs WHERE id = ? AND company_id = ?',
      [id, companyId]
    )

    return res.json({
      status: 'success',
      message: 'Lowongan berhasil dihapus'
    })
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Gagal menghapus lowongan',
      error: error.message
    })
  }
}