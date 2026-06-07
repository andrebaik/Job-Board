import express from 'express'

import {
  getAllJobs,
  getJobById,
  getCompanyJobs,
  createJob,
  updateJob,
  deleteJob
} from '../controllers/jobController.js'

import {
  authMiddleware,
  roleMiddleware
} from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', getAllJobs)

router.get(
  '/company/my-jobs',
  authMiddleware,
  roleMiddleware('perusahaan'),
  getCompanyJobs
)

router.get('/:id', getJobById)

router.post(
  '/',
  authMiddleware,
  roleMiddleware('perusahaan'),
  createJob
)

router.put(
  '/:id',
  authMiddleware,
  roleMiddleware('perusahaan'),
  updateJob
)

router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware('perusahaan'),
  deleteJob
)

export default router