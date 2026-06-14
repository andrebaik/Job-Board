import express from "express";

import {
  getMyPelamarProfile,
  updateMyPelamarProfile,
  updateProfilePicture,
  deleteProfilePicture,
  getMyCompanyProfile,
  updateMyCompanyProfile,
  updateCompanyLogo,
  deleteCompanyLogo,
  skipPelamarProfile,
  skipCompanyProfile,
} from "../controllers/profileController.js";

import { authMiddleware, roleMiddleware } from "../middleware/authMiddleware.js";
import { uploadProfilePhoto, uploadCompanyLogo } from "../config/upload.js";

const router = express.Router();

router.get("/pelamar/me", authMiddleware, roleMiddleware("pelamar"), getMyPelamarProfile);
router.put("/pelamar/me", authMiddleware, roleMiddleware("pelamar"), updateMyPelamarProfile);

router.put(
  "/pelamar/me/photo",
  authMiddleware,
  roleMiddleware("pelamar"),
  (req, res, next) => {
    uploadProfilePhoto(req, res, (err) => {
      if (err) {
        const message = err.code === "LIMIT_FILE_SIZE" ? "File terlalu besar. Maksimal 2MB." : err.message;
        return res.status(400).json({ status: "error", message });
      }
      next();
    });
  },
  updateProfilePicture
);

router.post(
  "/pelamar/me/skip",
  authMiddleware,
  roleMiddleware("pelamar"),
  skipPelamarProfile
);

router.delete(
  "/pelamar/me/photo",
  authMiddleware,
  roleMiddleware("pelamar"),
  deleteProfilePicture
);

router.get("/company/me", authMiddleware, roleMiddleware("perusahaan"), getMyCompanyProfile);
router.put("/company/me", authMiddleware, roleMiddleware("perusahaan"), updateMyCompanyProfile);

router.post(
  "/company/me/skip",
  authMiddleware,
  roleMiddleware("perusahaan"),
  skipCompanyProfile
);

router.put(
  "/company/me/logo",
  authMiddleware,
  roleMiddleware("perusahaan"),
  (req, res, next) => {
    uploadCompanyLogo(req, res, (err) => {
      if (err) {
        const message = err.code === "LIMIT_FILE_SIZE" ? "File terlalu besar. Maksimal 2MB." : err.message;
        return res.status(400).json({ status: "error", message });
      }
      next();
    });
  },
  updateCompanyLogo
);

router.delete(
  "/company/me/logo",
  authMiddleware,
  roleMiddleware("perusahaan"),
  deleteCompanyLogo
);

export default router;