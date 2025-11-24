const User = require('../models/User');
const TokenManager = require('../utils/token');
const GoogleAuth = require('../utils/googleAuth');
const EmailService = require('../utils/emailService');

// Signup Controller
exports.signup = async (req, res) => {
  try {
    const { name, email, mobile, password, role } = req.body;

    if (!name || !email || !mobile || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, mobile, and password are required'
      });
    }

    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return res.status(409).json({ success: false, message: 'User already exists with this email' });
    }

    const existingUserByMobile = await User.findOne({ mobile });
    if (existingUserByMobile) {
      return res.status(409).json({ success: false, message: 'User already exists with this mobile number' });
    }

    const passwordHash = await User.hashPassword(password);

    const user = new User({
      name,
      email,
      mobile,
      passwordHash,
      role: role || 'patient',
      emailVerified: false
    });

    await user.save();

    // Generate OTP and save on user
    const otpCode = user.generateOTP();
    await user.save();

    // Send OTP email (EmailService.sendOTPEmail should return an object { success: boolean, ... })
    let emailResult = { success: false };
    try {
      emailResult = await EmailService.sendOTPEmail(email, otpCode, name);
    } catch (err) {
      // Email send failed but we still created the user and generated OTP.
      console.error('EmailService.sendOTPEmail error:', err);
      emailResult = { success: false, message: err.message || 'Email send failed' };
    }

    res.status(201).json({
      success: true,
      message: 'User created successfully. OTP sent for email verification.',
      data: {
        userId: user._id,
        email: user.email,
        mobile: user.mobile,
        requiresVerification: true,
        emailSent: !!emailResult.success
      }
    });

  } catch (error) {
    console.error('Signup error:', error);

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ success: false, message: errors.join(', ') });
    }

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(409).json({ success: false, message: `User already exists with this ${field}` });
    }

    res.status(500).json({ success: false, message: 'Internal server error during signup' });
  }
};

// Login Controller
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.checkPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (user.isOTPVerificationRequired()) {
      // generate a fresh OTP and send for verification
      const otpCode = user.generateOTP();
      await user.save();

      try {
        await EmailService.sendOTPEmail(email, otpCode, user.name);
      } catch (err) {
        console.error('Failed to send OTP during login:', err);
      }

      return res.status(403).json({
        success: false,
        message: 'Email verification required',
        requiresVerification: true,
        data: { userId: user._id, email: user.email }
      });
    }

    const accessToken = TokenManager.generateAccessToken({
      userId: user._id,
      role: user.role,
      emailVerified: user.emailVerified
    });

    const { token: refreshToken, jti } = TokenManager.generateRefreshToken({ userId: user._id, role: user.role });
    await TokenManager.storeRefreshToken(user._id, jti);

    // set refresh token cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        accessToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          picture: user.picture,
          emailVerified: user.emailVerified
        }
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Internal server error during login' });
  }
};

// Google Login Controller
exports.googleAuth = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ success: false, message: 'Google ID token is required' });
    }

    const googleUser = await GoogleAuth.verifyIdToken(idToken);

    let user = await User.findOne({
      $or: [{ googleId: googleUser.googleId }, { email: googleUser.email }]
    });

    if (!user) {
      user = new User({
        name: googleUser.name,
        email: googleUser.email,
        googleId: googleUser.googleId,
        picture: googleUser.picture,
        emailVerified: googleUser.emailVerified
      });
      await user.save();
    } else if (!user.googleId) {
      user.googleId = googleUser.googleId;
      user.picture = googleUser.picture;
      user.emailVerified = googleUser.emailVerified;
      await user.save();
    }

    const accessToken = TokenManager.generateAccessToken({
      userId: user._id,
      role: user.role,
      emailVerified: user.emailVerified
    });

    const { token: refreshToken, jti } = TokenManager.generateRefreshToken({ userId: user._id, role: user.role });
    await TokenManager.storeRefreshToken(user._id, jti);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      success: true,
      message: 'Google authentication successful',
      data: {
        accessToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          picture: user.picture,
          emailVerified: user.emailVerified
        }
      }
    });

  } catch (error) {
    console.error('Google auth error:', error);
    res.status(401).json({ success: false, message: 'Google authentication failed' });
  }
};

// Verify OTP Controller
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP are required' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // this will throw if invalid/expired/blocked
    await user.verifyOTP(otp);
    await user.save();

    // send welcome email (best-effort)
    try {
      await EmailService.sendWelcomeEmail(user.email, user.name);
    } catch (err) {
      console.error('Failed to send welcome email:', err);
    }

    const accessToken = TokenManager.generateAccessToken({
      userId: user._id,
      role: user.role,
      emailVerified: true
    });

    const { token: refreshToken, jti } = TokenManager.generateRefreshToken({ userId: user._id, role: user.role });
    await TokenManager.storeRefreshToken(user._id, jti);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      success: true,
      message: 'Email verified successfully',
      data: {
        accessToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          mobile: user.mobile,
          role: user.role,
          picture: user.picture,
          emailVerified: user.emailVerified
        }
      }
    });

  } catch (error) {
    console.error('OTP verification error:', error);
    // If user.verifyOTP threw a custom Error, respond 400 with its message
    res.status(400).json({ success: false, message: error.message || 'OTP verification failed' });
  }
};

// Resend OTP Controller
exports.resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (user.emailVerified) {
      return res.status(400).json({ success: false, message: 'Email already verified' });
    }

    if (!user.canResendOTP()) {
      return res.status(429).json({ success: false, message: 'OTP resend blocked. Try later.' });
    }

    const otpCode = user.generateOTP();
    await user.save();

    let emailResult = { success: false };
    try {
      emailResult = await EmailService.sendOTPEmail(email, otpCode, user.name);
    } catch (err) {
      console.error('Error sending OTP on resend:', err);
      emailResult = { success: false, message: err.message || 'Failed to send email' };
    }

    res.json({
      success: true,
      message: 'OTP resent successfully',
      data: {
        emailSent: !!emailResult.success
      }
    });

  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ success: false, message: 'Failed to resend OTP' });
  }
};

// Refresh Token Controller
exports.refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) return res.status(401).json({ success: false, message: 'Refresh token required' });

    const decoded = await TokenManager.verifyRefreshToken(refreshToken);

    // revoke the old token jti
    await TokenManager.revokeRefreshToken(decoded.jti);

    const accessToken = TokenManager.generateAccessToken({
      userId: decoded.userId,
      role: decoded.role
    });

    const { token: newRefreshToken, jti } = TokenManager.generateRefreshToken({ userId: decoded.userId, role: decoded.role });
    await TokenManager.storeRefreshToken(decoded.userId, jti);

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: { accessToken }
    });

  } catch (error) {
    console.error('Refresh token error:', error);
    res.clearCookie('refreshToken');
    res.status(403).json({ success: false, message: 'Invalid or expired refresh token' });
  }
};

// Logout Controller
exports.logout = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (refreshToken) {
      try {
        const decoded = await TokenManager.verifyRefreshToken(refreshToken);
        await TokenManager.revokeRefreshToken(decoded.jti);
      } catch (err) {
        // ignore verify errors - still clear cookie
      }
    }

    res.clearCookie('refreshToken');

    res.json({ success: true, message: 'Logout successful' });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ success: false, message: 'Internal server error during logout' });
  }
};

// Profile Controller
exports.profile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-passwordHash');

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          picture: user.picture,
          createdAt: user.createdAt
        }
      }
    });

  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ success: false, message: 'Internal server error fetching profile' });
  }
};

// Forgot Password Controller
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // do not reveal user existence - respond success for security best practice
      return res.json({ success: true, message: 'If an account exists, a password reset OTP has been sent' });
    }

    const otp = user.generateOTP();
    await user.save();

    try {
      await EmailService.sendPasswordResetOTP(email, otp, user.name);
    } catch (err) {
      console.error('Failed to send password reset OTP:', err);
    }

    res.json({
      success: true,
      message: 'Password reset OTP sent successfully (if account exists)',
      data: { email }
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ success: false, message: 'Failed to send password reset OTP' });
  }
};

// Reset Password Controller
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ success: false, message: 'Email, OTP, and new password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // verify OTP (this will throw if invalid)
    await user.verifyOTP(otp);

    // set new password
    user.passwordHash = await User.hashPassword(newPassword);
    await user.save();

    res.json({
      success: true,
      message: 'Password reset successfully'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(400).json({ success: false, message: error.message || 'Password reset failed' });
  }
};
