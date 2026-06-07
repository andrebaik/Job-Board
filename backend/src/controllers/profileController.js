import db from '../config/db.js'

export const getMyPelamarProfile = async (req, res) => {
  try {
    const [profiles] = await db.query(
      `
      SELECT
        pelamar_profiles.*,
        users.name,
        users.email
      FROM pelamar_profiles
      JOIN users ON pelamar_profiles.user_id = users.id
      WHERE pelamar_profiles.user_id = ?
      `,
      [req.user.id]
    )

    if (profiles.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Profil pelamar tidak ditemukan'
      })
    }

    return res.json({
      status: 'success',
      data: profiles[0]
    })
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Gagal mengambil profil pelamar',
      error: error.message
    })
  }
}

export const updateMyPelamarProfile = async (req, res) => {
  try {
    const {
      full_name,
      phone,
      address,
      education,
      skills,
      experience,
      cv_url
    } = req.body || {}

    await db.query(
      `
      UPDATE pelamar_profiles
      SET
        full_name = ?,
        phone = ?,
        address = ?,
        education = ?,
        skills = ?,
        experience = ?,
        cv_url = ?
      WHERE user_id = ?
      `,
      [
        full_name || null,
        phone || null,
        address || null,
        education || null,
        skills || null,
        experience || null,
        cv_url || null,
        req.user.id
      ]
    )

    return res.json({
      status: 'success',
      message: 'Profil berhasil diperbarui'
    })
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Gagal memperbarui profil',
      error: error.message
    })
  }
}