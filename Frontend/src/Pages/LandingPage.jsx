import React from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import HeroSection from "../Components/HeroSection";
import Services from "../Components/Services";

const LandingPage = () => {
  return (
    <div
      style={{
        fontFamily: "'Poppins', sans-serif",
        backgroundColor: "#f2f7ff",
        minHeight: "100vh",
      }}
    >
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      {/* Services Section */}
      <Services />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
