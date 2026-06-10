import express from 'express'

import {
  authMiddleware,
  roleMiddleware
} from '../middleware/authMiddleware.js'

import {
  applyJob,
  getMyApplications,
  getCompanyApplications,
  getCompanyApplicationDetail,
  updateApplicationStatus
} from '../controllers/applicationController.js'

const router = express.Router()

router.get(
  '/my-applications',
  authMiddleware,
  roleMiddleware('pelamar'),
  getMyApplications
)

router.get(
  '/company',
  authMiddleware,
  roleMiddleware('perusahaan'),
  getCompanyApplications
)

router.get(
  '/company/:id',
  authMiddleware,
  roleMiddleware('perusahaan'),
  getCompanyApplicationDetail
)

router.post(
  '/:jobId',
  authMiddleware,
  roleMiddleware('pelamar'),
  applyJob
)

router.patch(
  '/:id/status',
  authMiddleware,
  roleMiddleware('perusahaan'),
  updateApplicationStatus
)

export default router