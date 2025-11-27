import React, { useState } from "react";
import axios from "axios";

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1=email, 2=otp, 3=new password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  // Step 1: Send OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await axios.post("http://localhost:5000/auth/forgot-password", { email });
      if (res.data.success) {
        setMessage("OTP sent to your email.");
        setStep(2);
      } else {
        setMessage(res.data.message);
      }
    } catch (err) {
      setMessage("Failed to send OTP");
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      // Temporary verify: OTP verification happens inside reset password request
      // Here only move to next step
      setStep(3);
    } catch (err) {
      setMessage("Invalid OTP");
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await axios.post("http://localhost:5000/auth/reset-password", {
        email,
        otp,
        newPassword,
      });

      if (res.data.success) {
        setMessage("Password reset successfully. Please login.");
      } else {
        setMessage(res.data.message);
      }
    } catch (err) {
      setMessage("Password reset failed");
    }
  };

  return (
    <div style={{ width: "350px", margin: "60px auto", textAlign: "center" }}>
      <h2>Forgot Password</h2>

      {/* STEP 1 - Email */}
      {step === 1 && (
        <form onSubmit={handleSendOTP}>
          <input
            type="email"
            placeholder="Enter Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />
          <button type="submit" style={styles.button}>Send OTP</button>
        </form>
      )}

      {/* STEP 2 - OTP */}
      {step === 2 && (
        <form onSubmit={handleVerifyOTP}>
          <p>OTP sent to <b>{email}</b></p>

          <input
            type="text"
            placeholder="Enter OTP"
            required
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            style={styles.input}
          />

          <button type="submit" style={styles.button}>Verify OTP</button>
        </form>
      )}

      {/* STEP 3 - New Password */}
      {step === 3 && (
        <form onSubmit={handleResetPassword}>
          <p>Enter your new password</p>

          <input
            type="password"
            placeholder="New Password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={styles.input}
          />

          <button type="submit" style={styles.button}>Reset Password</button>
        </form>
      )}

      {message && <p style={{ marginTop: "15px", color: "green" }}>{message}</p>}
    </div>
  );
};

const styles = {
  input: {
    width: "100%",
    padding: "12px",
    margin: "10px 0",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default ForgotPassword;
