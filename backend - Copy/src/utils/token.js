const jwt = require("jsonwebtoken");
const RefreshToken = require("../models/RefreshToken");
const crypto = require("crypto");

class TokenManager {
  // -------------------------
  // Generate Access Token
  // -------------------------
  static generateAccessToken(payload) {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
  }

  // -------------------------
  // Verify Access Token
  // -------------------------
  static verifyAccessToken(token) {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  }

  // -------------------------
  // Generate Refresh Token
  // -------------------------
  static generateRefreshToken(payload) {
    const jti = crypto.randomUUID();
    const token = jwt.sign({ ...payload, jti }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
    return { token, jti };
  }

  // -------------------------
  // Store Refresh Token
  // -------------------------
  static async storeRefreshToken(userId, jti) {
    return await RefreshToken.create({
      jti,
      userId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });
  }

  // -------------------------
  // Verify Refresh Token
  // -------------------------
  static async verifyRefreshToken(token) {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const storedToken = await RefreshToken.findOne({ jti: decoded.jti });
    if (!storedToken) throw new Error("Refresh token not found or revoked");
    return decoded;
  }

  // -------------------------
  // Revoke Refresh Token
  // -------------------------
  static async revokeRefreshToken(jti) {
    await RefreshToken.findOneAndDelete({ jti });
  }
}

module.exports = TokenManager;
