import React from "react";
import { motion } from "framer-motion";
import { MessageCircle, Send, BrainCircuit, BellRing } from "lucide-react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const steps = [
  {
    icon: <Send size={30} />,
    title: "Step 1: Start Chat",
    desc: "Send a message on WhatsApp or SMS using a dedicated number to begin the conversation.",
  },
  {
    icon: <MessageCircle size={30} />,
    title: "Step 2: Ask Your Health Query",
    desc: "Type any question related to symptoms, disease awareness, first aid, or vaccination schedule.",
  },
  {
    icon: <BrainCircuit size={30} />,
    title: "Step 3: Get AI Response",
    desc: "Our multilingual AI chatbot instantly delivers easy-to-understand answers in your language.",
  },
  {
    icon: <BellRing size={30} />,
    title: "Step 4: Receive Alerts & Reminders",
    desc: "Get vaccination reminders, precautions, and real-time outbreak notifications from trusted sources.",
  }
];

const HowItWorks = () => {
  const location = useLocation();
  const hideNavbarFooter = location.pathname === "/"; // hide on landing page

  return (
    <>
      {!hideNavbarFooter && <Navbar />}

      <div className="bg-[#e0f7fa] py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: -40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-[#004d40] font-['Roboto Slab'] mb-10"
          >
            How It Works
          </motion.h2>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: i * 0.2 }}
                viewport={{ once: true }}
                className="bg-[#00acc1]/15 hover:bg-[#00acc1]/25 transition-all p-6 rounded-2xl shadow-md"
              >
                <div className="flex justify-center mb-4 text-[#00796b]">{step.icon}</div>
                <h3 className="text-xl font-semibold text-[#004d40] mb-2">{step.title}</h3>
                <p className="text-[#004d40] text-[15px] leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* CTA Box */}
          <motion.div
            initial={{ scale: 0.8 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.6 }}
            className="mt-10 bg-gradient-to-r from-[#00acc1] to-[#00796b] text-white py-3 px-6 inline-block rounded-lg shadow-lg text-lg font-semibold"
          >
            💬 Try a Demo — Experience Real-time AI Health Support
          </motion.div>
        </div>
      </div>

      {!hideNavbarFooter && <Footer />}
    </>
  );
};

export default HowItWorks;
