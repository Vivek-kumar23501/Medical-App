const jwt = require("jsonwebtoken");
const RefreshToken = require("../models/RefreshToken");
const crypto = require("crypto");

class TokenManager {
  // -------------------------
  // Generate Access Token
  // -------------------------
  static generateAccessToken(payload) {
    return jwt.sign(
      payload,
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
  }

  // -------------------------
  // Generate Refresh Token
  // -------------------------
  static generateRefreshToken(payload) {
    const jti = crypto.randomUUID();

    const token = jwt.sign(
      { ...payload, jti },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    return { token, jti };
  }

  // ---------------------------------
  // STORE REFRESH TOKEN (FIXED)
  // ---------------------------------
  static async storeRefreshToken(userId, jti) {
    return await RefreshToken.create({
      jti,
      userId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    });
  }

  // ---------------------------------
  // VERIFY REFRESH TOKEN
  // ---------------------------------
  static async verifyRefreshToken(token) {
    const decoded = jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET
    );

    const storedToken = await RefreshToken.findOne({ jti: decoded.jti });

    if (!storedToken) {
      throw new Error("Refresh token not found or revoked");
    }

    return decoded;
  }

  // ---------------------------------
  // REVOKE REFRESH TOKEN
  // ---------------------------------
  static async revokeRefreshToken(jti) {
    await RefreshToken.findOneAndDelete({ jti });
  }
}

module.exports = TokenManager;
