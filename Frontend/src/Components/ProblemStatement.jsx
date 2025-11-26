import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Clock, HeartHandshake, ShieldCheck } from "lucide-react";

const problems = [
  { icon: <AlertTriangle size={26} />, text: "Lack of correct medical information" },
  { icon: <Clock size={26} />, text: "Late awareness about diseases & outbreaks" },
  { icon: <HeartHandshake size={26} />, text: "Limited access to doctors in rural areas" },
  { icon: <ShieldCheck size={26} />, text: "Confusion due to unreliable sources" },
];

const ProblemStatement = () => {
  return (
    <div className="bg-[#e0f7fa] py-16">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

        {/* Left Image */}
        <motion.div
          initial={{ opacity: 0, x: -80 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <img
            src="/ruler.jpg"
            alt="Rural Health Issues"
            className="rounded-2xl shadow-2xl hover:scale-[1.03] transition-all duration-500"
          />
        </motion.div>

        {/* Right Text Side */}
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-[#004d40]"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 font-['Roboto Slab']">
            Problem & Our Solution
          </h2>

          <p className="text-lg mb-6 leading-relaxed">
            Many rural and semi-urban communities struggle to access accurate healthcare information,
            which increases risk and delays treatment. Our platform bridges this gap.
          </p>

          <ul className="space-y-4">
            {problems.map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 text-lg font-medium bg-[#00acc1]/15 p-3 rounded-lg hover:bg-[#00acc1]/25 transition-all"
              >
                <span className="text-[#00796b]">{item.icon}</span>
                <span>{item.text}</span>
              </motion.li>
            ))}
          </ul>

          <motion.div
            initial={{ scale: 0.8 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mt-6 bg-gradient-to-r from-[#00acc1] to-[#00796b] text-white py-3 px-5 inline-block rounded-lg shadow-lg font-semibold"
          >
            ✨ Our platform provides real-time verified health guidance
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProblemStatement;
