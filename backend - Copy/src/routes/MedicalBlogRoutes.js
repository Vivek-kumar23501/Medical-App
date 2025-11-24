const express = require("express");
const multer = require("multer");
const MedicalBlog = require("../models/MedicalBlog");
const path = require("path");

const router = express.Router();

// ---------------- MULTER STORAGE CONFIG ----------------
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/medicalBlogs");
  },
  filename: function (req, file, cb) {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9) + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// ---------------- CREATE MEDICAL BLOG ----------------
router.post(
  "/add-blog",
  upload.single("featuredImage"),
  async (req, res) => {
    try {
      const { title, shortDescription, mainCategory, subCategory } = req.body;

      if (!req.file) {
        return res.status(400).json({ message: "Featured image is required" });
      }

      const newBlog = new MedicalBlog({
        title,
        shortDescription,
        mainCategory,
        subCategory,
        featuredImage: req.file.filename,
        createdBy: req.user?._id || null,
      });

      await newBlog.save();

      res.status(201).json({
        message: "Blog uploaded successfully",
        blog: newBlog,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

// ---------------- GET ALL BLOGS ----------------
router.get("/all", async (req, res) => {
  try {
    const blogs = await MedicalBlog.find().sort({ createdAt: -1 });

    res.status(200).json({ success: true, blogs: blogs || [] });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ---------------- UPDATE BLOG ----------------
router.put("/edit/:id", upload.single("featuredImage"), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, shortDescription, mainCategory, subCategory } = req.body;

    const updatedData = { title, shortDescription, mainCategory, subCategory };

    if (req.file) {
      updatedData.featuredImage = req.file.filename;
    }

    const updatedBlog = await MedicalBlog.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!updatedBlog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      blog: updatedBlog,
    });
  } catch (error) {
    console.error("Error updating blog:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ---------------- DELETE BLOG ----------------
router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedBlog = await MedicalBlog.findByIdAndDelete(id);

    if (!deletedBlog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    res.status(200).json({ success: true, message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
