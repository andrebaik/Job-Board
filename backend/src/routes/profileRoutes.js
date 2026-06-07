import express from 'express'

import {
  getMyPelamarProfile,
  updateMyPelamarProfile
} from '../controllers/profileController.js'

import {
  authMiddleware,
  roleMiddleware
} from '../middleware/authMiddleware.js'

const router = express.Router()

router.get(
  '/pelamar/me',
  authMiddleware,
  roleMiddleware('pelamar'),
  getMyPelamarProfile
)

router.put(
  '/pelamar/me',
  authMiddleware,
  roleMiddleware('pelamar'),
  updateMyPelamarProfile
)

export default router