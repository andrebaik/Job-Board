import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import db from '../config/db.js'

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        status: 'error',
        message: 'Nama, email, password, dan role wajib diisi'
      })
    }

    const allowedRoles = ['pelamar', 'perusahaan']

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        status: 'error',
        message: 'Role tidak valid'
      })
    }

    const [existingUser] = await db.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    )

    if (existingUser.length > 0) {
      return res.status(409).json({
        status: 'error',
        message: 'Email sudah terdaftar'
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const [result] = await db.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role]
    )

    const userId = result.insertId

    if (role === 'pelamar') {
      await db.query(
        'INSERT INTO pelamar_profiles (user_id, full_name) VALUES (?, ?)',
        [userId, name]
      )
    }

    if (role === 'perusahaan') {
      await db.query(
        'INSERT INTO company_profiles (user_id, company_name) VALUES (?, ?)',
        [userId, name]
      )
    }

    return res.status(201).json({
      status: 'success',
      message: 'Register berhasil',
      data: {
        id: userId,
        name,
        email,
        role
      }
    })
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan server',
      error: error.message
    })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Email dan password wajib diisi'
      })
    }

    const [users] = await db.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    )

    if (users.length === 0) {
      return res.status(401).json({
        status: 'error',
        message: 'Email atau password salah'
      })
    }

    const user = users[0]

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'error',
        message: 'Email atau password salah'
      })
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1d'
      }
    )

    return res.json({
      status: 'success',
      message: 'Login berhasil',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan server',
      error: error.message
    })
  }
}

export const getMe = async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
      [req.user.id]
    )

    if (users.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'User tidak ditemukan'
      })
    }

    return res.json({
      status: 'success',
      user: users[0]
    })
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan server',
      error: error.message
    })
  }
}

export const changePassword = async (req, res) => {
  try {
    const { current_password, new_password, confirm_password } = req.body

    if (!current_password || !new_password || !confirm_password) {
      return res.status(400).json({
        status: 'error',
        message: 'Password saat ini, password baru, dan konfirmasi password wajib diisi'
      })
    }

    if (new_password.length < 6) {
      return res.status(400).json({
        status: 'error',
        message: 'Password baru minimal 6 karakter'
      })
    }

    if (new_password !== confirm_password) {
      return res.status(400).json({
        status: 'error',
        message: 'Konfirmasi password tidak cocok'
      })
    }

    const [users] = await db.query(
      'SELECT password FROM users WHERE id = ?',
      [req.user.id]
    )

    if (users.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'User tidak ditemukan'
      })
    }

    const isMatch = await bcrypt.compare(current_password, users[0].password)

    if (!isMatch) {
      return res.status(400).json({
        status: 'error',
        message: 'Password saat ini salah'
      })
    }

    const hashedPassword = await bcrypt.hash(new_password, 10)

    await db.query(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, req.user.id]
    )

    return res.json({
      status: 'success',
      message: 'Password berhasil diubah'
    })
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Gagal mengubah password',
      error: error.message
    })
  }
}