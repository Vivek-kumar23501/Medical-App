import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="bg-[#00796b] text-white py-10 font-[Poppins]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">

          {/* About Section */}
          <div>
            <img
              src="/MedPulse logo.jpg"
              alt="MedPulse Logo"
              className="h-14 mb-3"
            />
            <p className="text-sm leading-6 text-[#e0f2f1]">
              MedPulse is a multilingual AI chatbot designed to educate rural
              and semi-urban populations about preventive healthcare, disease
              symptoms, and vaccination schedules. Integrated with government
              health databases for real-time alerts.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-base font-semibold mb-4">Quick Links</h5>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-[#b2dfdb] hover:text-white">Home</Link></li>
              <li><Link to="/health-awareness" className="text-[#b2dfdb] hover:text-white">Health Awareness</Link></li>
              <li><Link to="/symptom-checker" className="text-[#b2dfdb] hover:text-white">Symptom Checker</Link></li>
              <li><Link to="/vaccinations" className="text-[#b2dfdb] hover:text-white">Vaccinations</Link></li>
              <li><Link to="/contact" className="text-[#b2dfdb] hover:text-white">Contact</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h5 className="text-base font-semibold mb-4">Resources</h5>
            <ul className="space-y-2 text-sm">
              <li><Link to="/govt-programs" className="text-[#b2dfdb] hover:text-white">Govt Health Programs</Link></li>
              <li><Link to="/dashboards" className="text-[#b2dfdb] hover:text-white">Govt Dashboards</Link></li>
              <li><Link to="/ai-assistant" className="text-[#b2dfdb] hover:text-white">AI Tools</Link></li>
              <li><Link to="/whatsapp-bot" className="text-[#b2dfdb] hover:text-white">WhatsApp Chatbot</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h5 className="text-base font-semibold mb-4">Contact</h5>
            <p className="text-sm text-[#e0f2f1]">Government of Odisha</p>
            <p className="text-sm text-[#e0f2f1]">Electronics & IT Department</p>
            <p className="text-sm text-[#e0f2f1]">Email: info@medpulse.gov.in</p>
            <p className="text-sm text-[#e0f2f1]">Phone: +91 12345 67890</p>
          </div>
        </div>

        {/* Footer bottom */}
        <div className="border-t border-[#004d40] mt-8 pt-4 text-center text-xs text-[#b2dfdb]">
          &copy; 2025-26 Smart India Hackathon. All rights reserved. | SIH Project: SIH25049
        </div>
      </div>
    </div>
  );
};

export default Footer;
