import React from "react";
import { Container } from "reactstrap";

const HeroSection = () => {
  return (
    <>
      <style>
        {`
          .hero-section {
            position: relative;
            height: 500px;
            width: 100%;
            overflow: hidden;
            margin-top:20px;
          }
            @media (max-width: 767px) {
            .hero-section {
             margin-top:70px;
            }
          }

          .hero-section img {
            width: 100%;
            height: 100%;
            object-fit: cover; /* ensures full image fit */
            filter: brightness(0.7); /* optional slight darken for text readability */
          }

          .hero-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.3); /* semi-transparent black overlay */
          }

          .hero-content {
            position: absolute;
            top: 30%;
            left: 50%;
            transform: translateX(-50%);
            text-align: center;
            color: white;
          }

          .hero-content h1 {
            font-size: 3rem;
            font-weight: 700;
            margin-bottom: 15px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.7); /* make text stand out */
          }

          .hero-content p {
            font-size: 1.2rem;
            font-weight: 500;
            text-shadow: 1px 1px 3px rgba(0,0,0,0.7);
          }

          @media (max-width: 767px) {
            .hero-section {
              height: 350px;
            }
            .hero-content h1 {
              font-size: 2rem;
            }
            .hero-content p {
              font-size: 1rem;
            }
          }
        `}
      </style>

      <div className="hero-section">
        <img src="/crousal.jpg" alt="MedPulse Background" />
        <div className="hero-overlay"></div>
        <Container className="hero-content">
          <h1>MedPulse – Your Smart Digital Health Companion</h1>
          <p>Educating communities on preventive healthcare, symptoms, and vaccinations</p>
        </Container>
      </div>
    </>
  );
};

export default HeroSection;
