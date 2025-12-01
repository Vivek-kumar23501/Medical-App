import express from "express";
import cookieParser from "cookie-parser";
import User from "../models/User.js"; // ✅ Import User model
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
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

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

// ---------------- User Profile ----------------
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "-passwordHash -otpCode -otpExpiry -__v"
    );

    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
// ---------------- Update User Profile ----------------
router.put("/profile", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const updateData = {};

    // Allowed fields to update
    const allowedFields = [
      "name",
      "phoneNumber",
      "address",
      "bloodGroup",
      "allergies",
      "chronicDiseases",
      "state",
      "district",
      "pincode",
      "language",
      "notificationPreference",
      "riskCategory",
      "profilePicture",
    ];

    // Only copy allowed fields from req.body
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updateData[field] = req.body[field];
    });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true, select: "-passwordHash -otpCode -otpExpiry -__v" }
    );

    if (!updatedUser)
      return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, message: "Profile updated successfully", data: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


export default router;
