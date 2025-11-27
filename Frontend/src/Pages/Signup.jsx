import React, { useEffect, useState } from "react";
import { Form, FormGroup, Label, Input, Button, Alert, Spinner } from "reactstrap";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const Signup = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    otp: "",
    password: "",
    confirmPassword: "",
    role: "patient"
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ---------------- VALIDATION ---------------------
  const validateStep1 = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Name is required";

    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Invalid email format";

    if (!form.password || form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ---------------- FIELD CHANGE -------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e) => e.preventDefault();

  // ---------------- STEP 1: SIGNUP -----------------
  const handleSignup = async () => {
    if (!validateStep1()) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await axios.post("http://localhost:5000/auth/signup", {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role
      });

      if (res.data.success) {
        setSuccess(res.data.message || "OTP sent to your email!");
        setStep(2);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- STEP 2: VERIFY OTP -------------
  const verifyOTP = async () => {
    if (!form.otp.trim()) {
      setError("Please enter the OTP");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await axios.post("http://localhost:5000/auth/verify-otp", {
        email: form.email,
        otp: form.otp
      });

      if (res.data.success) {
        setSuccess("Email verified successfully!");
        localStorage.setItem("accessToken", res.data.data.accessToken);
        localStorage.setItem("user", JSON.stringify(res.data.data.user));
        setStep(3);
      }
    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- RESEND OTP ---------------------
  const resendOTP = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await axios.post("http://localhost:5000/auth/resend-otp", {
        email: form.email
      });

      if (res.data.success) {
        setSuccess("OTP resent successfully!");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- GO TO LOGIN --------------------
  const handleLoginRedirect = () => navigate("/login");

  return (
    <>
      <Navbar />

      <div className="page-wrap">
        <div className="split-card">

          {/* LEFT SIDE DESIGN PANEL */}
          <div className="service-card">
            <div
              className="service-image"
              style={{ backgroundImage: `url('/images/medpulse-signup.jpg')` }}
            />
            <h2>Join <span>MedPulse</span></h2>
            <p>Get AI-driven healthcare alerts & preventive tools.</p>
          </div>

          {/* RIGHT SIDE FORM */}
          <div className="form-panel">
            <h2>Create your MedPulse account</h2>

            {error && <Alert color="danger">{error}</Alert>}
            {success && <Alert color="success">{success}</Alert>}

            <Form onSubmit={handleSubmit}>

              {/* STEP 1 */}
              {step === 1 && (
                <>
                  <FormGroup>
                    <Label>Name *</Label>
                    <Input
                      className="input-rounded"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      invalid={!!errors.name}
                    />
                    {errors.name && <div className="text-danger">{errors.name}</div>}
                  </FormGroup>

                  <FormGroup>
                    <Label>Email *</Label>
                    <Input
                      className="input-rounded"
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      invalid={!!errors.email}
                    />
                    {errors.email && <div className="text-danger">{errors.email}</div>}
                  </FormGroup>

                  <FormGroup>
                    <Label>Password *</Label>
                    <Input
                      className="input-rounded"
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      invalid={!!errors.password}
                    />
                    {errors.password && <div className="text-danger">{errors.password}</div>}
                  </FormGroup>

                  <FormGroup>
                    <Label>Confirm Password *</Label>
                    <Input
                      className="input-rounded"
                      type="password"
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      invalid={!!errors.confirmPassword}
                    />
                    {errors.confirmPassword && (
                      <div className="text-danger">{errors.confirmPassword}</div>
                    )}
                  </FormGroup>

                  <Button className="btn-primary-custom" onClick={handleSignup} disabled={loading}>
                    {loading ? <Spinner size="sm" /> : "Create Account & Send OTP"}
                  </Button>
                </>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <>
                  <FormGroup>
                    <Label>Enter OTP *</Label>
                    <Input
                      className="input-rounded"
                      name="otp"
                      value={form.otp}
                      onChange={handleChange}
                      placeholder="6-digit OTP"
                    />
                  </FormGroup>

                  <Button className="btn-primary-custom" onClick={verifyOTP} disabled={loading}>
                    {loading ? <Spinner size="sm" /> : "Verify OTP"}
                  </Button>

                  <div className="otp-resend">
                    <button type="button" onClick={resendOTP} disabled={loading}>
                      {loading ? "Sending..." : "Resend OTP"}
                    </button>
                  </div>
                </>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <div className="success-step">
                  <div className="success-icon">✓</div>
                  <h3>Account Created Successfully!</h3>
                  <p>Your email has been verified. You can now continue.</p>

                  <Button className="btn-primary-custom" onClick={handleLoginRedirect}>
                    Continue to Dashboard
                  </Button>
                </div>
              )}
            </Form>

            {step !== 3 && (
              <div className="links-row">
                <div>Already have an account? <Link to="/login">Login</Link></div>
                <div>|</div>
                <div><Link to="/forgot-password">Forgot password?</Link></div>
              </div>
            )}

          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Signup;
