import jwt from 'jsonwebtoken'
import db from '../config/db.js'

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({
      status: 'error',
      message: 'Token tidak ditemukan'
    })
  }

  const token = authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({
      status: 'error',
      message: 'Format token tidak valid'
    })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    try {
      const [users] = await db.query('SELECT is_active FROM users WHERE id = ?', [decoded.id])
      if (users.length === 0) {
        return res.status(401).json({ status: 'error', message: 'User tidak ditemukan' })
      }
      if (!users[0].is_active) {
        return res.status(403).json({ status: 'error', message: 'Akun telah dinonaktifkan' })
      }
    } catch {
      return res.status(500).json({ status: 'error', message: 'Gagal verifikasi akun' })
    }

    req.user = decoded

    next()
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: 'Token tidak valid atau sudah expired'
    })
  }
}

export const roleMiddleware = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'Akses ditolak'
      })
    }

    next()
  }
}