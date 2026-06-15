import express from "express";
import { authMiddleware, roleMiddleware } from "../middleware/authMiddleware.js";
import {
  getDashboardStats,
  getChartData,
  getDistributionStats,
  getAllUsers,
  getAllJobs,
  getAllApplications,
  getCompanyList,
  updateUser,
  deleteUser,
  updateJobAdmin,
  deleteJobAdmin,
  verifyCompany,
} from "../controllers/adminController.js";

const router = express.Router();

router.use(authMiddleware, roleMiddleware("admin"));

router.get("/stats", getDashboardStats);
router.get("/stats/chart", getChartData);
router.get("/stats/distribution", getDistributionStats);

router.get("/users", getAllUsers);
router.patch("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

router.get("/jobs", getAllJobs);
router.patch("/jobs/:id", updateJobAdmin);
router.delete("/jobs/:id", deleteJobAdmin);

router.get("/applications", getAllApplications);

router.get("/companies", getCompanyList);
router.patch("/companies/:id/verify", verifyCompany);

export default router;
