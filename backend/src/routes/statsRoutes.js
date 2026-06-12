import express from "express";
import db from "../config/db.js";

const router = express.Router();

router.get("/public", async (req, res) => {
  try {
    const [[companies]] = await db.query(`
      SELECT COUNT(*) AS total
      FROM users
      WHERE role = 'perusahaan'
    `);

    const [[applicants]] = await db.query(`
      SELECT COUNT(*) AS total
      FROM users
      WHERE role = 'pelamar'
    `);

    const [[filledJobs]] = await db.query(`
      SELECT COUNT(DISTINCT job_id) AS total
      FROM applications
      WHERE status = 'diterima'
    `);

    res.json({
      companies: companies.total,
      applicants: applicants.total,
      filledJobs: filledJobs.total,
    });
  } catch (error) {
    console.error("Public stats error:", error);
    res.status(500).json({ message: "Gagal mengambil statistik" });
  }
});

export default router;