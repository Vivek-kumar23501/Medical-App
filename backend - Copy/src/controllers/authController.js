require('dotenv').config();
const User = require('../models/User');
const TokenManager = require('../utils/token');
const EmailService = require('../utils/emailService');
const { v4: uuidv4 } = require("uuid");
const fs = require('fs');
const path = require('path');

// Helper: get full URL for profile picture
const getProfilePictureURL = (filePath) => {
  if (!filePath) return null;
  const BASE_URL = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
  return `${BASE_URL}/${filePath.replace(/\\/g, '/')}`;
};

// ----------------- SIGNUP -----------------
exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Name, email, and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).json({ success: false, message: "User already exists with this email" });

    const passwordHash = await User.hashPassword(password);
    const namePrefix = name.split(" ")[0].toLowerCase();
    const shortUUID = uuidv4().split("-")[0];
    const uniqueUserId = `UID-${namePrefix}-${shortUUID}`;

    const user = new User({
      name,
      email,
      passwordHash,
      uniqueUserId,
      role: role || "patient",
      emailVerified: false
    });

    await user.save();

    const otpCode = user.generateOTP();
    await user.save();

    let emailResult = { success: false };
    try { emailResult = await EmailService.sendOTPEmail(email, otpCode, name); } 
    catch (err) { console.error("EmailService.sendOTPEmail error:", err); }

    return res.status(201).json({
      success: true,
      message: "User created successfully. OTP sent for email verification.",
      data: {
        userId: uniqueUserId,
        email: user.email,
        requiresVerification: true,
        emailSent: emailResult.success
      }
    });

  } catch (error) {
    console.error("Signup error:", error);
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: errors.join(", ") });
    }
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(409).json({ success: false, message: `User already exists with this ${field}` });
    }
    return res.status(500).json({ success: false, message: "Internal server error during signup" });
  }
};

// ----------------- LOGIN -----------------
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: "Email and password are required" });

    const user = await User.findOne({ email });
    if (!user || !(await user.checkPassword(password))) return res.status(401).json({ success: false, message: "Invalid email or password" });

    const accessToken = TokenManager.generateAccessToken({
      userId: user._id,
      role: user.role,
      emailVerified: user.emailVerified
    });

    const { token: refreshToken, jti } = TokenManager.generateRefreshToken({ userId: user._id, role: user.role });
    await TokenManager.storeRefreshToken(user._id, jti);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      picture: getProfilePictureURL(user.profilePicture),
      emailVerified: user.emailVerified
    };

    return res.json({
      success: true,
      message: "Login successful",
      data: {
        accessToken,
        user: userData
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Internal server error during login" });
  }
};

// ----------------- VERIFY OTP -----------------
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ success: false, message: "Email and OTP are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    await user.verifyOTP(otp);
    user.emailVerified = true;
    await user.save();

    try { await EmailService.sendWelcomeEmail(user.email, user.name); } 
    catch (err) { console.error('Failed to send welcome email:', err); }

    const accessToken = TokenManager.generateAccessToken({ userId: user._id, role: user.role, emailVerified: true });
    const { token: refreshToken, jti } = TokenManager.generateRefreshToken({ userId: user._id, role: user.role });
    await TokenManager.storeRefreshToken(user._id, jti);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
      picture: getProfilePictureURL(user.profilePicture),
      emailVerified: user.emailVerified
    };

    res.json({
      success: true,
      message: "Email verified successfully",
      data: {
        accessToken,
        user: userData
      }
    });

  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(400).json({ success: false, message: error.message || "OTP verification failed" });
  }
};

// ----------------- RESEND OTP -----------------
exports.resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    if (user.emailVerified) return res.status(400).json({ success: false, message: "Email already verified" });
    if (!user.canResendOTP()) return res.status(429).json({ success: false, message: "OTP resend blocked. Try later." });

    const otpCode = user.generateOTP();
    await user.save();

    let emailResult = { success: false };
    try { emailResult = await EmailService.sendOTPEmail(email, otpCode, user.name); } 
    catch (err) { console.error('Error sending OTP:', err); }

    res.json({ success: true, message: "OTP resent successfully", data: { emailSent: !!emailResult.success } });

  } catch (error) {
    console.error("Resend OTP error:", error);
    res.status(500).json({ success: false, message: "Failed to resend OTP" });
  }
};

// ----------------- REFRESH TOKEN -----------------
exports.refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) return res.status(401).json({ success: false, message: "Refresh token required" });

    const decoded = await TokenManager.verifyRefreshToken(refreshToken);
    await TokenManager.revokeRefreshToken(decoded.jti);

    const accessToken = TokenManager.generateAccessToken({ userId: decoded.userId, role: decoded.role });
    const { token: newRefreshToken, jti } = TokenManager.generateRefreshToken({ userId: decoded.userId, role: decoded.role });
    await TokenManager.storeRefreshToken(decoded.userId, jti);

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({ success: true, message: "Token refreshed", data: { accessToken } });

  } catch (error) {
    console.error("Refresh token error:", error);
    res.clearCookie("refreshToken");
    res.status(403).json({ success: false, message: "Invalid or expired refresh token" });
  }
};

// ----------------- LOGOUT -----------------
exports.logout = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (refreshToken) {
      try {
        const decoded = await TokenManager.verifyRefreshToken(refreshToken);
        await TokenManager.revokeRefreshToken(decoded.jti);
      } catch { /* ignore */ }
    }
    res.clearCookie("refreshToken");
    res.json({ success: true, message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ success: false, message: "Internal server error during logout" });
  }
};

// ----------------- FORGOT PASSWORD -----------------
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email is required" });

    const user = await User.findOne({ email });
    if (user) {
      const otp = user.generateOTP();
      await user.save();
      try { await EmailService.sendPasswordResetOTP(email, otp, user.name); } 
      catch (err) { console.error("Failed to send password reset OTP:", err); }
    }

    res.json({ success: true, message: "If the account exists, OTP has been sent to the email" });

  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ----------------- RESET PASSWORD -----------------
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) return res.status(400).json({ success: false, message: "Email, OTP and new password are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    try { await user.verifyOTP(otp); } 
    catch { return res.status(400).json({ success: false, message: "Invalid or expired OTP" }); }

    user.passwordHash = await User.hashPassword(newPassword);
    await user.save();

    res.json({ success: true, message: "Password reset successfully" });

  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ success: false, message: "Server error during password reset" });
  }
};

// ----------------- GET CURRENT USER -----------------
exports.getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).select("-passwordHash -__v");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const userData = {
      ...user.toObject(),
      profilePicture: getProfilePictureURL(user.profilePicture)
    };

    res.json({ success: true, data: userData });
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ----------------- UPDATE PROFILE -----------------
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, phone, address, bloodGroup, allergies, chronicDiseases } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Update fields
    user.name = name ?? user.name;
    user.phone = phone ?? user.phone;
    user.address = address ?? user.address;
    user.bloodGroup = bloodGroup ?? user.bloodGroup;
    user.allergies = allergies ?? user.allergies;
    user.chronicDiseases = chronicDiseases ?? user.chronicDiseases;

    // Handle profile picture upload
    if (req.file) {
      // Delete old profile picture if exists
      if (user.profilePicture && fs.existsSync(user.profilePicture)) {
        fs.unlinkSync(user.profilePicture);
      }
      user.profilePicture = req.file.path; // save new path
    }

    await user.save();

    const userData = {
      ...user.toObject(),
      profilePicture: getProfilePictureURL(user.profilePicture)
    };

    res.json({ success: true, message: "Profile updated successfully", data: userData });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ success: false, message: "Server error while updating profile" });
  }
};
