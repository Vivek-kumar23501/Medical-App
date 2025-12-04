import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Bot, BookOpen, MessageCircle, AlertTriangle, Home, Syringe, UserCheck } from "lucide-react";

const LandingFeatures = () => {
  const features = [
   
    {
      icon: <Bot size={42} className="text-green-600" />,
      title: "Patient Queries",
      desc: "Ask AI-powered medical questions and receive instant guidance.",
      link: "/Medical-dashboard/patient-queries",
      btn: "Ask Queries"
    },
    {
      icon: <BookOpen size={42} className="text-purple-600" />,
      title: "Expert Blog",
      desc: "Read articles written by certified doctors and health specialists.",
      link: "/Medical-dashboard/create-blog",
      btn: "Read Blogs"
    },
    {
      icon: <Syringe size={42} className="text-red-600" />,
      title: "Vaccinations",
      desc: "Access vaccine schedules, availability updates, and health programs.",
      link: "/Medical-dashboard/AllOutbreak",
      btn: "Check Vaccines"
    },
    {
      icon: <MessageCircle size={42} className="text-blue-600" />,
      title: "Daily Check",
      desc: "Monitor daily health check-ins and patient reports.",
      link: "/Medical-dashboard/Dailycheak",
      btn: "Daily Check"
    },
    {
      icon: <AlertTriangle size={42} className="text-yellow-600" />,
      title: "Health Alerts",
      desc: "Track critical disease outbreaks and alerts across regions.",
      link: "/Medical-dashboard/AllOutbreak",
      btn: "View Alerts"
    },
    {
      icon: <UserCheck size={42} className="text-teal-600" />,
      title: "Profile",
      desc: "View and manage your profile, settings, and preferences.",
      link: "/Medical-dashboard/profile",
      btn: "Go to Profile"
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen pt-24">
      <section className="text-center px-6 py-10">
        <motion.h1
          className="text-4xl font-bold text-teal-700"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Welcome to MedPulse Healthcare Dashboard
        </motion.h1>

        <p className="mt-4 text-lg text-gray-700 max-w-3xl mx-auto">
          Click any feature below to explore patient management, blogs, vaccinations, and health alerts efficiently.
        </p>
      </section>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 px-6 pb-12">
        {features.map((item, i) => (
          <motion.div
            key={i}
            className="bg-white p-6 rounded-2xl shadow-md border hover:shadow-xl hover:-translate-y-1 transition"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <div className="mb-3">{item.icon}</div>
            <h3 className="font-bold text-xl mb-2">{item.title}</h3>
            <p className="text-gray-600 mb-4">{item.desc}</p>

            <Link
              to={item.link}
              className="inline-block px-5 py-2 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition"
            >
              {item.btn} →
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default LandingFeatures;
