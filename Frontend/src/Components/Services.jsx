import React, { useEffect } from "react";
import {
  Bell,
  MessageSquare,
  UserCheck,
  Globe,
  Smartphone,
  Mic,
} from "lucide-react";

const services = [
  { icon: <MessageSquare size={30} />, title: "Disease Awareness Bot", description: "Get AI-based disease awareness info.", img: "/images/disease.jpg" },
  { icon: <UserCheck size={30} />, title: "Vaccination Assist", description: "Track vaccination schedules.", img: "/images/vaccine.jpg" },
  { icon: <Bell size={30} />, title: "Outbreak Alert", description: "Real-time outbreak alerts.", img: "/images/alert.jpg" },
  { icon: <Globe size={30} />, title: "Doctor Near Me", description: "Find nearby doctors easily.", img: "/images/doctor.jpg" },
  { icon: <Smartphone size={30} />, title: "WhatsApp Accessibility", description: "Access via WhatsApp.", img: "/images/whatsapp.jpg" },
  { icon: <Mic size={30} />, title: "Voice Assistance", description: "Voice-enabled guidance.", img: "/images/voice.jpg" },
];

const Services = () => {
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
      {/* Tailwind animation overrides */}
      <style>
        {`
          .service-card {
            transform: translateY(50px);
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

      <div className="bg-[#e0f7fa] py-16 md:py-20 min-h-screen">
        <div className="max-w-7xl mx-auto px-5">
          <h2 className="text-center text-3xl md:text-4xl font-bold text-[#00695c] mb-12 font-['Roboto Slab']">
            Our Services
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="service-card relative p-6 rounded-xl min-h-[250px] flex flex-col justify-center text-center text-white cursor-pointer
                  shadow-lg transition-all duration-500
                  bg-gradient-to-br from-[#00acc1] to-[#00796b] overflow-hidden
                  hover:-translate-y-2 hover:scale-[1.03] hover:shadow-2xl"
              >
                {/* Sliding Background Image */}
                <div
                  className="service-image absolute left-[-120%] top-0 w-[120%] h-full opacity-20
                    bg-cover bg-center rounded-xl group-hover:left-0 group-hover:opacity-30"
                  style={{ backgroundImage: `url(${service.img})` }}
                ></div>

                <div className="relative z-10">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-white/20 hover:bg-white/30 hover:scale-110 transition-all">
                    {service.icon}
                  </div>

                  <h3 className="text-xl font-bold mb-2">{service.title}</h3>

                  <p className="text-sm text-[#e0f7fa] leading-5">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  );
};

export default Services;
