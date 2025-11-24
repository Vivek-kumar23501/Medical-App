import React from "react";
import { Routes, Route } from "react-router-dom";

import LandingPage from "./Pages/LandingPage";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import ForgetPassword from "./Pages/ForgetPassword";
import UserDashboard from "./Pages/UserDashboard";

import ProtectedRoute from "./Components/ProtectedRoute";
import MedicalDashboard from "./Pages/MedicalDashboard";
import AdminDashboard from "./Pages/AdminDashboard";
import CreateHealthQuery from "./Components/CreateHealthQuery";
import CreateBlog from "./Pages/CreateBlog";
import Chatbot from "./Components/Chatbot";
import Vaccination from "./Pages/Vaccination";
import Profile from "./Components/Profile";
import ExpertQueryList from "./Pages/ExpertQueryList";
import MedicalBlogList from "./Pages/MedicalBlogList";

function App() {
  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", }}>
      <Routes>
        {/* ---------------- Public Pages ---------------- */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />

        {/* ---------------- User Dashboard ---------------- */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        >
          <Route path="chatbot" element={<Chatbot />} />
          <Route path="health-queires" element={<CreateHealthQuery />} />
          <Route path="vaccinations" element={<Vaccination />} />
          <Route path="profile" element={<Profile />} />
            <Route path="blog" element={<MedicalBlogList />} />
        </Route>

        {/* ---------------- Medical Dashboard ---------------- */}
        <Route
          path="/medical-dashboard/*"
          element={
            <ProtectedRoute>
              <MedicalDashboard />
            </ProtectedRoute>
          }
        >
          {/* Create Blog inside medical dashboard */}
          <Route path="create-blog" element={<CreateBlog />} />
          <Route path="patient-queries" element={<ExpertQueryList />} />
          <Route path="profile" element={<Profile />} />
        
        </Route>

        {/* ---------------- Admin Dashboard ---------------- */}
        <Route
          path="/admin-dashboard/*"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
