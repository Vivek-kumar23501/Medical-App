import React, { useEffect, useState } from "react";
import { Form, FormGroup, Label, Input, Button, Alert, Spinner } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const Login = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [requiresVerification, setRequiresVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  // Responsive check
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
    if (error) setError("");
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin();
  };

  // Handle login
  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError("");
    setRequiresVerification(false);

    try {
      const res = await axios.post("http://localhost:5000/auth/login", form);

      if (res.data.success) {
        const { accessToken, user } = res.data.data;

        // Save token, userId, and user info in localStorage
        localStorage.setItem("token", accessToken);
        localStorage.setItem("userId", user.id);
        localStorage.setItem("user", JSON.stringify(user));

        setSuccess("Login successful! Redirecting...");

        // Small delay to show success message
        setTimeout(() => {
          // Role-based redirection
          switch (user.role) {
            case "admin":
              navigate("/admin-dashboard");
              break;
            case "user":
            case "patient":
              navigate("/dashboard");
              break;
            default:
              navigate("/dashboard");
          }
        }, 1000);
      }
    } catch (err) {
      // Handle OTP verification required
      if (err.response?.status === 403 && err.response?.data?.requiresVerification) {
        setRequiresVerification(true);
        setVerificationEmail(form.email);
        setError("Email verification required. Please check your email for OTP.");
        return;
      }

      const errorMessage = err.response?.data?.message || "Login failed. Please check your credentials.";
      setError(errorMessage);
      
      // Clear password on invalid credentials
      if (err.response?.status === 401) {
        setForm(prev => ({ ...prev, password: "" }));
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP verification redirect
  const handleVerifyOTP = () => {
    navigate("/verify-email", { state: { email: verificationEmail } });
  };

  // Handle resend OTP
  const handleResendOTP = async () => {
    setLoading(true);
    setError("");
    
    try {
      const res = await axios.post("http://localhost:5000/auth/resend-otp", {
        email: verificationEmail,
      });
      
      if (res.data.success) {
        setSuccess("OTP resent successfully! Please check your email.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <style>{`
        * {
          font-family: 'Poppins', sans-serif;
        }

        .page-wrap {
          min-height: 100vh;
          background: #e0f7fa;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 50px 20px;
        }

        .login-card {
          width: 100%;
          max-width: 950px;
          background: #ffffff;
          border-radius: 16px;
          overflow: hidden;
          display: flex;
          flex-direction: row;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }

        .left-panel {
          flex: 1;
          background: linear-gradient(135deg, #00acc1, #00796b);
          padding: 40px;
          color: white;
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .service-image {
          position: absolute;
          left: -110%;
          top: 0;
          width: 120%;
          height: 100%;
          opacity: 0.12;
          background-size: cover;
          background-position: center;
          transition: 0.6s ease;
        }

        .left-panel:hover .service-image { 
          left: 0; 
          opacity: 0.25; 
        }

        .left-title { 
          font-size: 32px; 
          font-weight: 700; 
          margin-bottom: 10px; 
          position: relative;
          z-index: 2;
        }

        .left-sub { 
          font-size: 17px; 
          opacity: 0.95; 
          line-height: 1.6; 
          position: relative;
          z-index: 2;
        }

        .form-panel {
          flex: 1;
          padding: 50px 60px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .input-rounded {
          border-radius: 30px;
          padding: 12px 16px;
          border: 1px solid #cfeff0;
          font-size: 15px;
          font-weight: 500;
        }

        .btn-primary-custom {
          background: linear-gradient(90deg,#0b63b6,#2f8bff);
          border: none;
          border-radius: 28px;
          padding: 12px 35px;
          font-weight: 700;
          box-shadow: 0 8px 20px rgba(11,75,180,0.18);
          transition: all 0.3s ease;
          width: 100%;
        }

        .btn-primary-custom:hover:not(:disabled) {
          transform: scale(1.05);
          box-shadow: 0 12px 25px rgba(11,75,180,0.25);
        }

        .btn-primary-custom:disabled {
          opacity: 0.7;
          transform: none;
        }

        .btn-secondary-custom {
          background: linear-gradient(90deg, #28a745, #20c997);
          border: none;
          border-radius: 28px;
          padding: 12px 35px;
          font-weight: 600;
          margin-top: 10px;
          width: 100%;
          transition: all 0.3s ease;
        }

        .btn-outline-custom {
          background: transparent;
          border: 2px solid #0b63b6;
          color: #0b63b6;
          border-radius: 28px;
          padding: 10px 35px;
          font-weight: 600;
          margin-top: 10px;
          width: 100%;
          transition: all 0.3s ease;
        }

        .btn-outline-custom:hover:not(:disabled) {
          background: #0b63b6;
          color: white;
        }

        .verification-section {
          background: #f8f9fa;
          border-radius: 10px;
          padding: 20px;
          margin: 20px 0;
          text-align: center;
        }

        .verification-title {
          font-weight: 600;
          color: #856404;
          margin-bottom: 10px;
        }

        .verification-buttons {
          display: flex;
          gap: 10px;
          margin-top: 15px;
        }

        .links { 
          margin-top: 15px; 
          font-size: 14px; 
          font-weight: 600; 
          text-align: center;
        }

        .links a { 
          text-decoration: none; 
          color: #0b63b6; 
          font-weight: 700; 
        }

        .text-danger {
          color: #dc3545;
          font-size: 12px;
          margin-top: 4px;
          margin-left: 15px;
        }

        @media(max-width: 767px){
          .login-card{ 
            flex-direction: column; 
          }
          .left-panel{ 
            display: none; 
          }
          .form-panel{ 
            padding: 30px 25px; 
          }
          .verification-buttons {
            flex-direction: column;
          }
        }
      `}</style>

      <div className="page-wrap">
        <div className="login-card">

          {/* LEFT PANEL — HIDDEN ON MOBILE */}
          {!isMobile && (
            <div className="left-panel">
              <div
                className="service-image"
                style={{ backgroundImage: `url('/images/medpulse-login.jpg')` }}
              />
              <div className="left-title">Welcome Back!</div>
              <div className="left-sub">
                Access your dashboard securely with AI-powered healthcare support, 
                personalized alerts, and comprehensive medical guidance.
              </div>
            </div>
          )}

          {/* RIGHT LOGIN FORM */}
          <div className="form-panel">
            <h2 style={{ fontWeight: "700", marginBottom: "25px", color: "#004d40", textAlign: "center" }}>
              Login to MedPulse
            </h2>

            {error && <Alert color="danger" style={{ borderRadius: '10px' }}>{error}</Alert>}
            {success && <Alert color="success" style={{ borderRadius: '10px' }}>{success}</Alert>}

            {/* OTP Verification Required Section */}
            {requiresVerification && (
              <div className="verification-section">
                <div className="verification-title">
                  📧 Email Verification Required
                </div>
                <p style={{ fontSize: '14px', marginBottom: '0' }}>
                  We've sent an OTP to your email. Please verify your email to continue.
                </p>
                <div className="verification-buttons">
                  <Button
                    className="btn-secondary-custom"
                    onClick={handleVerifyOTP}
                    disabled={loading}
                  >
                    Verify OTP
                  </Button>
                  <Button
                    className="btn-outline-custom"
                    onClick={handleResendOTP}
                    disabled={loading}
                  >
                    {loading ? <Spinner size="sm" /> : "Resend OTP"}
                  </Button>
                </div>
              </div>
            )}

            <Form onSubmit={handleSubmit}>
              <FormGroup style={{ marginBottom: "20px" }}>
                <Label style={{ fontWeight: "600", fontSize: "14px" }}>Email Address *</Label>
                <Input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  className="input-rounded"
                  value={form.email}
                  onChange={handleChange}
                  invalid={!!errors.email}
                  required
                />
                {errors.email && <div className="text-danger">{errors.email}</div>}
              </FormGroup>

              <FormGroup style={{ marginBottom: "25px" }}>
                <Label style={{ fontWeight: "600", fontSize: "14px" }}>Password *</Label>
                <Input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  className="input-rounded"
                  value={form.password}
                  onChange={handleChange}
                  invalid={!!errors.password}
                  required
                />
                {errors.password && <div className="text-danger">{errors.password}</div>}
              </FormGroup>

              <div style={{ marginTop: "10px" }}>
                <Button
                  type="submit"
                  className="btn-primary-custom"
                  disabled={loading}
                >
                  {loading ? <Spinner size="sm" /> : "Login"}
                </Button>
              </div>

              <div style={{ marginTop: "25px", lineHeight: "1.8" }}>
                <div className="links">
                  <Link to="/forgot-password">Forgot Password?</Link>
                </div>
                <div className="links">
                  Don't have an account? <Link to="/signup">Sign up here</Link>
                </div>
              </div>
            </Form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;