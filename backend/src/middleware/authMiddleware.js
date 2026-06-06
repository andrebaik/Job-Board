import jwt from 'jsonwebtoken'

export const authMiddleware = (req, res, next) => {
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