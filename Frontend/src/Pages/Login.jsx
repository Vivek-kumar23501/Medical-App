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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/dashboard");
  }, [navigate]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    if (error) setError("");
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.email.trim()) newErrors.email = "Email is required";
    if (!form.password.trim()) newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin();
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/auth/login", form);

      if (res.data.success) {
        const { accessToken, user } = res.data.data;

        localStorage.setItem("token", accessToken);
        localStorage.setItem("userId", user.id);
        localStorage.setItem("user", JSON.stringify(user));

        setSuccess("Login successful! Redirecting...");

        setTimeout(() => {
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
      const errorMessage =
        err.response?.data?.message || "Login failed. Invalid email or password";

      setError(errorMessage);

      if (err.response?.status === 401) {
        setForm((prev) => ({ ...prev, password: "" }));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="page-wrap">
        <div className="login-card">

          <div className="form-panel">
            <h2 style={{ fontWeight: "700", marginBottom: "25px", color: "#004d40", textAlign: "center" }}>
              Login to MedPulse
            </h2>

            {error && <Alert color="danger">{error}</Alert>}
            {success && <Alert color="success">{success}</Alert>}

            <Form onSubmit={handleSubmit}>
              <FormGroup style={{ marginBottom: "20px" }}>
                <Label>Email Address *</Label>
                <Input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  className="input-rounded"
                />
                {errors.email && <div className="text-danger">{errors.email}</div>}
              </FormGroup>

              <FormGroup style={{ marginBottom: "25px" }}>
                <Label>Password *</Label>
                <Input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  className="input-rounded"
                />
                {errors.password && <div className="text-danger">{errors.password}</div>}
              </FormGroup>

              <Button type="submit" className="btn-primary-custom" disabled={loading}>
                {loading ? <Spinner size="sm" /> : "Login"}
              </Button>

              <div className="links" style={{ marginTop: "20px" }}>
                <Link to="/forgot-password">Forgot Password?</Link>
              </div>
              <div className="links">
                Don’t have an account? <Link to="/signup">Sign up here</Link>
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
