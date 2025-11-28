const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  uniqueUserId: { type: String, required: true, unique: true },
  name: { type: String, required: [true, "Name is required"], trim: true },
  email: { 
    type: String, 
    required: [true, "Email is required"], 
    unique: true, 
    lowercase: true, 
    validate: [validator.isEmail, "Invalid email format"] 
  },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["patient", "doctor", "admin"], default: "patient" },
  emailVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },

  // Optional user profile fields
  profilePicture: { type: String, default: "" },
  address: { type: String, default: "" },
  phone: { type: String, default: "" },
  bloodGroup: { type: String, default: "" },
  allergies: { type: String, default: "" },
  chronicDiseases: { type: String, default: "" },

  // OTP fields
  otpCode: { type: String },
  otpExpiry: { type: Date },
});

// Password hashing
userSchema.statics.hashPassword = async function(password) {
  return await bcrypt.hash(password, 10);
};

// Password check
userSchema.methods.checkPassword = async function(password) {
  return await bcrypt.compare(password, this.passwordHash);
};

// Generate OTP
userSchema.methods.generateOTP = function() {
  const otp = crypto.randomInt(100000, 999999).toString();
  this.otpCode = otp;
  this.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry
  return otp;
};

// Verify OTP
userSchema.methods.verifyOTP = function(otp) {
  if (!this.otpCode || !this.otpExpiry) {
    throw new Error("OTP not generated");
  }
  if (this.otpExpiry < new Date()) {
    throw new Error("OTP expired");
  }
  if (this.otpCode !== otp) {
    throw new Error("Invalid OTP");
  }
  this.emailVerified = true;
  this.otpCode = undefined;
  this.otpExpiry = undefined;
};

// Optional: control resend timing
userSchema.methods.canResendOTP = function() {
  if (!this.otpExpiry) return true;
  const now = new Date();
  const diff = (this.otpExpiry - now) / 1000; // seconds
  return diff < 0; // allow resend only after expiry
};

module.exports = mongoose.model("User", userSchema);
