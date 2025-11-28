import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { PhoneCall, Siren, Baby, Hospital, Mic, MapPin } from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const scenarios = [
  {
    icon: <PhoneCall size={30} />,
    title: "Emergency Fever Case at Night",
    description:
      "The chatbot provides immediate first-aid steps and nearest hospital details when medical help is not available.",
    img: "/images/fever.jpg",
  },
  {
    icon: <Siren size={30} />,
    title: "Sudden Outbreak in Village",
    description:
      "AI detects rising cases and sends preventive measures & alerts via SMS/WhatsApp to protect the community.",
    img: "/images/outbreak.jpg",
  },
  {
    icon: <Baby size={30} />,
    title: "Pregnancy & Mother Care",
    description:
      "Reminder messages for vaccination, nutrition, checkups and danger signs in mother’s own language.",
    img: "/images/mother.jpg",
  },
  {
    icon: <Hospital size={30} />,
    title: "Health Camp & Blood Donation",
    description:
      "Village members receive automatic notifications for free health camps or blood donation drives.",
    img: "/images/healthcamp.jpg",
  },
  {
    icon: <Mic size={30} />,
    title: "Voice-Based Support",
    description:
      "People can speak queries in their local language and receive clear, verified answers without typing.",
    img: "/images/voice.jpg",
  },
  {
    icon: <MapPin size={30} />,
    title: "Nearest Healthcare Help",
    description:
      "AI guides users to government hospitals, PHC/CHC, ASHA workers and emergency helplines based on location.",
    img: "/images/nearest.jpg",
  },
];

const ImpactScenarios = () => {
  const location = useLocation();
  const hideNavbarFooter = location.pathname === "/"; // hide on landing page

  useEffect(() => {
    const cards = document.querySelectorAll(".scenario-card");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("animate-card");
        });
      },
      { threshold: 0.2 }
    );
    cards.forEach((card) => observer.observe(card));
  }, []);

  return (
    <>
      {!hideNavbarFooter && <Navbar />}

      <style>
        {`
          .scenario-card {
            transform: translateY(60px);
            opacity: 0;
            transition: all 0.7s ease;
          }
          .animate-card {
            transform: translateY(0);
            opacity: 1;
          }
          .scenario-image {
            transition: all 0.5s ease;
          }
        `}
      </style>

      <div className="bg-[#e0f7fa] py-16">
        <div className="max-w-7xl mx-auto px-5">
          <h2 className="text-center text-3xl md:text-4xl font-bold text-[#004d40] mb-12 font-['Roboto Slab']">
            Real-Life Scenarios We Solve
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {scenarios.map((scenario, index) => (
              <div
                key={index}
                className="scenario-card relative p-6 rounded-xl min-h-[250px] flex flex-col justify-center text-center cursor-pointer
                  shadow-lg bg-[#00acc1]/15 hover:bg-[#00acc1]/25 transition-all
                  hover:-translate-y-2 hover:shadow-2xl overflow-hidden"
              >
                <div
                  className="scenario-image absolute inset-0 bg-cover bg-center opacity-20 blur-sm hover:opacity-30 hover:blur-[1px]"
                  style={{ backgroundImage: `url(${scenario.img})` }}
                ></div>

                <div className="relative z-10">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-[#00796b]/10 hover:bg-[#00796b]/20 transition-all">
                    <span className="text-[#00796b]">{scenario.icon}</span>
                  </div>

                  <h3 className="text-xl font-bold text-[#004d40] mb-2">{scenario.title}</h3>
                  <p className="text-[#004d40] text-sm leading-5">{scenario.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {!hideNavbarFooter && <Footer />}
    </>
  );
};

export default ImpactScenarios;
