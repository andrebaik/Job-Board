import express from "express";
import path from "path";
import multer from "multer";
import { authMiddleware, roleMiddleware } from "../middleware/authMiddleware.js";

const backupUpload = multer({
  dest: path.join(process.cwd(), "backups"),
  fileFilter: (_req, file, cb) => {
    if (!file.originalname.endsWith(".sql")) {
      return cb(new Error("Hanya file .sql yang diizinkan"));
    }
    cb(null, true);
  },
  limits: { fileSize: 100 * 1024 * 1024 },
});
import {
  getDashboardStats,
  getChartData,
  getDistributionStats,
  getFunnelData,
  getAllUsers,
  getAllJobs,
  getAllApplications,
  getCompanyList,
  updateUser,
  deleteUser,
  updateJobAdmin,
  deleteJobAdmin,
  verifyCompany,
  createBackup,
  listBackups,
  downloadBackup,
  restoreBackup,
  deleteBackup,
} from "../controllers/adminController.js";

const router = express.Router();

router.use(authMiddleware, roleMiddleware("admin"));

router.get("/stats", getDashboardStats);
router.get("/stats/chart", getChartData);
router.get("/stats/distribution", getDistributionStats);
router.get("/stats/funnel", getFunnelData);

router.get("/users", getAllUsers);
router.patch("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

router.get("/jobs", getAllJobs);
router.patch("/jobs/:id", updateJobAdmin);
router.delete("/jobs/:id", deleteJobAdmin);

router.get("/applications", getAllApplications);

router.get("/companies", getCompanyList);
router.patch("/companies/:id/verify", verifyCompany);

router.post("/backup", createBackup);
router.get("/backups", listBackups);
router.get("/backups/:filename", downloadBackup);
router.post("/restore", backupUpload.single("backup"), restoreBackup);
router.delete("/backups/:filename", deleteBackup);

export default router;
