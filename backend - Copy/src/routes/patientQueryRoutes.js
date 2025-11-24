const express = require("express");
const PatientQuery = require("../models/PatientQuery");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/reports"); // ensure this folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// -------------------- SAVE PATIENT QUERY --------------------
router.post("/submit", upload.single("medicalReport"), async (req, res) => {
  try {
    const {
      fullName,
      email,
      mobile,
      age,
      gender,
      symptomsDuration,
      symptoms,
      medicalHistory,
    } = req.body;

    if (!fullName || !email || !mobile || !age || !gender || !symptomsDuration || !symptoms || !medicalHistory) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled!",
      });
    }

    const filePath = req.file
      ? path.join("uploads/reports", req.file.filename)
      : null;

    const newQuery = new PatientQuery({
      fullName,
      email,
      mobile,
      age,
      gender,
      symptomsDuration,
      symptoms,
      medicalHistory,
      medicalReport: filePath,
    });

    await newQuery.save();

    res.status(201).json({
      success: true,
      message: "Patient health query submitted successfully!",
    });
  } catch (error) {
    console.error("Error saving query:", error);
    res.status(500).json({
      success: false,
      message: "Server error! Please try again later.",
    });
  }
});

// -------------------- GET ALL QUERIES --------------------
router.get("/all", async (req, res) => {
  try {
    const queries = await PatientQuery.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      queries: queries || [],
    });
  } catch (error) {
    console.error("Error fetching queries:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

module.exports = router;
