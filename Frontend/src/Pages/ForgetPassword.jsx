import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const ForgetPassword = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const [step, setStep] = useState(1); // 1 = enter email, 2 = enter OTP + new password

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // -----------------------------
  // STEP 1 -> SEND RESET OTP
  // -----------------------------
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/auth/forgot-password", {
        email,
      });

      setMessage(res.data.message);
      setStep(2); // Move to OTP + Password screen

    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to send password reset OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // STEP 2 -> VERIFY OTP + RESET PASSWORD
  // -----------------------------
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/auth/reset-password", {
        email,
        otp,
        newPassword,
      });

      setMessage(res.data.message);

      // Reset UI after successful password reset
      setStep(1);
      setOtp("");
      setNewPassword("");

    } catch (error) {
      setMessage(
        error.response?.data?.message || "Password reset failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#f8fafc" }}
      >
        <div
          className={`bg-white shadow-lg rounded-lg p-8 w-full ${
            isMobile ? "mx-4" : "max-w-md"
          }`}
        >
          <h2 className="text-2xl font-bold text-center mb-6">
            {step === 1 ? "Forgot Password" : "Reset Password"}
          </h2>

          {message && (
            <p className="text-center mb-4 text-blue-600 font-medium">
              {message}
            </p>
          )}

          {step === 1 && (
            <form onSubmit={handleSendOTP}>
              <label className="block mb-2 font-semibold">Email</label>
              <input
                type="email"
                className="w-full p-3 border rounded mb-4"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleResetPassword}>
              <label className="block mb-2 font-semibold">OTP</label>
              <input
                type="text"
                className="w-full p-3 border rounded mb-4"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />

              <label className="block mb-2 font-semibold">New Password</label>
              <input
                type="password"
                className="w-full p-3 border rounded mb-4"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                disabled={loading}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>

              <button
                type="button"
                className="w-full bg-gray-500 text-white py-2 rounded mt-3 hover:bg-gray-600"
                onClick={() => setStep(1)}
              >
                Back
              </button>
            </form>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ForgetPassword;
