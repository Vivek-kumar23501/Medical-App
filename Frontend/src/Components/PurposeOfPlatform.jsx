import React from "react";
import { motion } from "framer-motion";
import { HeartPulse, Users, MessageCircle, ShieldCheck } from "lucide-react";

const purposes = [
  {
    icon: <HeartPulse size={26} />,
    title: "Promote Preventive Healthcare",
    text: "Helping people understand symptoms early and avoid serious diseases through awareness."
  },
  {
    icon: <Users size={26} />,
    title: "Serve Rural & Semi-Urban Communities",
    text: "Delivering essential health knowledge in local languages without requiring internet access."
  },
  {
    icon: <MessageCircle size={26} />,
    title: "AI 24/7 Chatbot Support",
    text: "Providing instant responses for common health questions, precautions, and vaccination schedules."
  },
  {
    icon: <ShieldCheck size={26} />,
    title: "Trusted & Verified Health Data",
    text: "Connected with government health databases for real-time outbreak alerts & reliable guidance."
  },
];

const PurposeOfPlatform = () => {
  return (
    <div className="bg-[#e0f7fa] py-16">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

        {/* Left Text Side */}
        <motion.div
          initial={{ opacity: 0, x: -80 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-[#004d40]"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 font-['Roboto Slab']">
            Purpose of the Platform
          </h2>

          <p className="text-lg mb-6 leading-relaxed">
            Our platform is designed to build a healthier future by making preventive healthcare
            knowledge easily accessible for every citizen—no matter where they live.
          </p>

          <ul className="space-y-4">
            {purposes.map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                viewport={{ once: true }}
                className="flex items-start gap-3 bg-[#00acc1]/15 p-3 rounded-lg hover:bg-[#00acc1]/25 transition-all"
              >
                <span className="text-[#00796b] mt-1">{item.icon}</span>
                <span>
                  <strong className="block text-lg">{item.title}</strong>
                  <span className="text-[15px]">{item.text}</span>
                </span>
              </motion.li>
            ))}
          </ul>

          <motion.div
            initial={{ scale: 0.8 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mt-6 bg-gradient-to-r from-[#00acc1] to-[#00796b] text-white py-3 px-5 inline-block rounded-lg shadow-lg font-semibold"
          >
            🌿 A step towards a healthier, informed community
          </motion.div>
        </motion.div>

        {/* Right Image Section */}
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <img
            src="/Solution.png"
            alt="Healthcare Awareness Image"
            className="rounded-2xl shadow-2xl hover:scale-[1.03] transition-all duration-500"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default PurposeOfPlatform;
