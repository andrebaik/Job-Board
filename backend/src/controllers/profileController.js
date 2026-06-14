import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import db from "../config/db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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

    if (!phone) {
      return res.status(400).json({
        status: 'error',
        message: 'Nomor HP wajib diisi'
      })
    }

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
        cv_url = ?,
        profile_completed = TRUE
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

const deleteFile = (filePath) => {
  const full = path.join(__dirname, "../../public", filePath);
  if (fs.existsSync(full)) {
    fs.unlinkSync(full);
  }
};

export const updateProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: "error", message: "File foto tidak ditemukan" });
    }

    const photoPath = `/uploads/profiles/${req.file.filename}`;

    const [existing] = await db.query(
      "SELECT profile_picture FROM pelamar_profiles WHERE user_id = ?",
      [req.user.id]
    );

    if (existing.length > 0 && existing[0].profile_picture) {
      deleteFile(existing[0].profile_picture);
    }

    await db.query(
      "UPDATE pelamar_profiles SET profile_picture = ? WHERE user_id = ?",
      [photoPath, req.user.id]
    );

    return res.json({
      status: "success",
      message: "Foto profil berhasil diperbarui",
      data: { profile_picture: photoPath },
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Gagal memperbarui foto profil",
      error: error.message,
    });
  }
};

export const deleteProfilePicture = async (req, res) => {
  try {
    const [existing] = await db.query(
      "SELECT profile_picture FROM pelamar_profiles WHERE user_id = ?",
      [req.user.id]
    );

    if (existing.length > 0 && existing[0].profile_picture) {
      deleteFile(existing[0].profile_picture);
    }

    await db.query(
      "UPDATE pelamar_profiles SET profile_picture = NULL WHERE user_id = ?",
      [req.user.id]
    );

    return res.json({
      status: "success",
      message: "Foto profil berhasil dihapus",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Gagal menghapus foto profil",
      error: error.message,
    });
  }
};

export const updateCompanyLogo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: "error", message: "File logo tidak ditemukan" });
    }

    const logoPath = `/uploads/companies/${req.file.filename}`;

    const [existing] = await db.query(
      "SELECT logo FROM company_profiles WHERE user_id = ?",
      [req.user.id]
    );

    if (existing.length > 0 && existing[0].logo) {
      deleteFile(existing[0].logo);
    }

    await db.query(
      "UPDATE company_profiles SET logo = ? WHERE user_id = ?",
      [logoPath, req.user.id]
    );

    return res.json({
      status: "success",
      message: "Logo berhasil diperbarui",
      data: { logo: logoPath },
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Gagal memperbarui logo",
      error: error.message,
    });
  }
};

export const getMyCompanyProfile = async (req, res) => {
  try {
    const [profiles] = await db.query(
      `
      SELECT
        company_profiles.*,
        users.name,
        users.email
      FROM company_profiles
      JOIN users ON company_profiles.user_id = users.id
      WHERE company_profiles.user_id = ?
      `,
      [req.user.id]
    )

    if (profiles.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Profil perusahaan tidak ditemukan'
      })
    }

    return res.json({
      status: 'success',
      data: profiles[0]
    })
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Gagal mengambil profil perusahaan',
      error: error.message
    })
  }
}

export const updateMyCompanyProfile = async (req, res) => {
  try {
    const {
      company_name,
      industry,
      address,
      description,
      website,
    } = req.body || {}

    await db.query(
      `
      UPDATE company_profiles
      SET
        company_name = ?,
        industry = ?,
        address = ?,
        description = ?,
        website = ?,
        profile_completed = TRUE
      WHERE user_id = ?
      `,
      [
        company_name || null,
        industry || null,
        address || null,
        description || null,
        website || null,
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
      message: 'Gagal memperbarui profil perusahaan',
      error: error.message
    })
  }
}

export const deleteCompanyLogo = async (req, res) => {
  try {
    const [existing] = await db.query(
      "SELECT logo FROM company_profiles WHERE user_id = ?",
      [req.user.id]
    );

    if (existing.length > 0 && existing[0].logo) {
      deleteFile(existing[0].logo);
    }

    await db.query(
      "UPDATE company_profiles SET logo = NULL WHERE user_id = ?",
      [req.user.id]
    );

    return res.json({
      status: "success",
      message: "Logo berhasil dihapus",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Gagal menghapus logo",
      error: error.message,
    });
  }
};

export const skipPelamarProfile = async (req, res) => {
  return res.json({
    status: 'success',
    message: 'Profil dilewati untuk saat ini'
  });
};

export const skipCompanyProfile = async (req, res) => {
  return res.json({
    status: 'success',
    message: 'Profil dilewati untuk saat ini'
  });
};