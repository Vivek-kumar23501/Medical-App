import express from "express";
import cookieParser from "cookie-parser";
import {
  startSignup,
  verifySignupOTP,
  completeSignup,
  loginUser,
  forgotPassword,
  resetPassword,
  refreshToken,
  logout,
} from "../controllers/authController.js";

const router = express.Router();

// Enable cookie parsing for refresh token
router.use(cookieParser());

// ---------------- Signup ----------------
// Step 1 → Send OTP
router.post("/start", startSignup);

// Step 2 → Verify OTP
router.post("/verify-otp", verifySignupOTP);

// Step 3 → Complete Signup (Set Password)
router.post("/complete", completeSignup);

// ---------------- Login ----------------
router.post("/login", loginUser);

// ---------------- Refresh Token ----------------
router.get("/refresh-token", refreshToken);

// ---------------- Logout ----------------
router.post("/logout", logout);

// ---------------- Password Reset ----------------
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
