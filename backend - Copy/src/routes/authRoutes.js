const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const multer = require("multer");
const { authenticateToken } = require("../middleware/auth");
const { loginLimiter, refreshLimiter } = require("../middleware/rateLimit");
const authController = require("../controllers/authController");

const router = express.Router();

// Middleware
router.use(cookieParser());

// ==============================
// AUTH & OTP ROUTES
// ==============================
router.post("/signup", loginLimiter, authController.signup);
router.post("/login", loginLimiter, authController.login);

router.post("/verify-otp", loginLimiter, authController.verifyOTP);
router.post("/resend-otp", loginLimiter, authController.resendOTP);

// ==============================
// REFRESH TOKEN (no auth required)
// ==============================
router.post("/refresh", refreshLimiter, authController.refreshToken);

// ==============================
// LOGOUT (protected route)
// ==============================
router.post("/logout", authenticateToken, authController.logout);

// ==============================
// PROFILE ROUTES (protected)
// ==============================

// Setup multer storage for profile picture
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/profilePictures"); // make sure this folder exists
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${req.user.userId}-${Date.now()}${ext}`);
  },
});
const upload = multer({ storage });

// GET current logged-in user
router.get("/me", authenticateToken, authController.getCurrentUser);

// UPDATE logged-in user profile with optional profile picture
router.put("/me", authenticateToken, upload.single("profilePicture"), authController.updateProfile);

// ==============================
// PASSWORD RECOVERY ROUTES
// ==============================
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

module.exports = router;
