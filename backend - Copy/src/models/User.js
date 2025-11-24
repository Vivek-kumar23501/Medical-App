const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },

  // Mobile number field
  mobile: {
    type: String,
    required: [true, 'Mobile number is required'],
    validate: {
      validator: function(v) {
        return /^[\+]?[1-9][\d]{0,15}$/.test(v);
      },
      message: 'Please provide a valid mobile number'
    }
  },

  passwordHash: {
    type: String,
    required: function () {
      return !this.googleId;
    }
  },

  googleId: {
    type: String,
    sparse: true
  },

  picture: {
    type: String,
    validate: [validator.isURL, 'Please provide a valid URL']
  },

  role: {
    type: String,
    enum: ['patient', 'doctor', 'admin'],
    default: 'patient'
  },

  emailVerified: {
    type: Boolean,
    default: false
  },

  mobileVerified: {
    type: Boolean,
    default: false
  },

  // EMAIL OTP FIELDS
  otp: {
    code: String,
    expiresAt: Date
  },

  otpAttempts: {
    type: Number,
    default: 0
  },

  otpBlockedUntil: Date,

  // ⭐ NEW: FORGOT PASSWORD OTP FIELDS
  resetPasswordOTP: String,
  resetPasswordOTPExpires: Date,

  createdAt: {
    type: Date,
    default: Date.now
  }
});

// INDEXES
userSchema.index({ email: 1 });
userSchema.index({ googleId: 1 });
userSchema.index({ mobile: 1 });
userSchema.index({ 'otp.expiresAt': 1 });

// PASSWORD METHODS
userSchema.methods.checkPassword = async function (password) {
  return await bcrypt.compare(password, this.passwordHash);
};

userSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 12);
};

// ------------------ EMAIL VERIFICATION OTP ------------------ //

userSchema.methods.generateOTP = function () {
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  this.otp = { code: otpCode, expiresAt };
  this.otpAttempts = 0;
  this.otpBlockedUntil = null;

  return otpCode;
};

userSchema.methods.verifyOTP = function (enteredOTP) {
  if (this.otpBlockedUntil && this.otpBlockedUntil > new Date()) {
    throw new Error('Too many OTP attempts. Please try again later.');
  }

  if (!this.otp || !this.otp.code || !this.otp.expiresAt) {
    throw new Error('OTP not found or expired.');
  }

  if (this.otp.expiresAt < new Date()) {
    throw new Error('OTP has expired.');
  }

  if (this.otp.code !== enteredOTP) {
    this.otpAttempts += 1;

    if (this.otpAttempts >= 5) {
      this.otpBlockedUntil = new Date(Date.now() + 15 * 60 * 1000);
    }

    throw new Error('Invalid OTP code.');
  }

  this.emailVerified = true;
  this.otp = undefined;
  this.otpAttempts = 0;
  this.otpBlockedUntil = null;

  return true;
};

userSchema.methods.isOTPVerificationRequired = function () {
  return !this.emailVerified && !this.googleId;
};

userSchema.methods.canResendOTP = function () {
  return !this.otpBlockedUntil || this.otpBlockedUntil <= new Date();
};

userSchema.methods.getRemainingAttempts = function () {
  return Math.max(0, 5 - this.otpAttempts);
};


module.exports = mongoose.model('User', userSchema);
