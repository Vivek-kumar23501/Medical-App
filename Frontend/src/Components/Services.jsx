import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Bell, MessageSquare, UserCheck, Globe, Smartphone, Mic } from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const services = [
  { icon: <MessageSquare size={30} />, title: "Disease Awareness Bot", description: "Get AI-based disease awareness info.", img: "/images/disease.jpg" },
  { icon: <UserCheck size={30} />, title: "Vaccination Assist", description: "Track vaccination schedules.", img: "/images/vaccine.jpg" },
  { icon: <Bell size={30} />, title: "Outbreak Alert", description: "Real-time outbreak alerts.", img: "/images/alert.jpg" },
  { icon: <Globe size={30} />, title: "Doctor Near Me", description: "Find nearby doctors easily.", img: "/images/doctor.jpg" },
  { icon: <Smartphone size={30} />, title: "WhatsApp Accessibility", description: "Access via WhatsApp.", img: "/images/whatsapp.jpg" },
  { icon: <Mic size={30} />, title: "Voice Assistance", description: "Voice-enabled guidance.", img: "/images/voice.jpg" },
];

const Services = () => {
  const location = useLocation();
  const hideNavbarFooter = location.pathname === "/"; // hide on landing page

  useEffect(() => {
    const cards = document.querySelectorAll(".service-card");
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
          .service-card {
            transform: translateY(60px);
            opacity: 0;
            transition: all 0.7s ease;
          }
          .animate-card {
            transform: translateY(0);
            opacity: 1;
          }
          .service-image {
            transition: all 0.5s ease;
          }
        `}
      </style>

      <div className="bg-[#e0f7fa] py-16">
        <div className="max-w-7xl mx-auto px-5">
          <h2 className="text-center text-3xl md:text-4xl font-bold text-[#004d40] mb-12 font-['Roboto Slab']">
            Our Services
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="service-card relative p-6 rounded-xl min-h-[250px] flex flex-col justify-center text-center cursor-pointer
                  shadow-lg bg-[#00acc1]/15 hover:bg-[#00acc1]/25 transition-all
                  hover:-translate-y-2 hover:shadow-2xl overflow-hidden"
              >
                <div
                  className="service-image absolute inset-0 bg-cover bg-center opacity-20 blur-sm hover:opacity-30 hover:blur-[1px]"
                  style={{ backgroundImage: `url(${service.img})` }}
                ></div>

                <div className="relative z-10">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-[#00796b]/10 hover:bg-[#00796b]/20 transition-all">
                    <span className="text-[#00796b]">{service.icon}</span>
                  </div>

                  <h3 className="text-xl font-bold text-[#004d40] mb-2">{service.title}</h3>

                  <p className="text-[#004d40] text-sm leading-5">
                    {service.description}
                  </p>
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

export default Services;
