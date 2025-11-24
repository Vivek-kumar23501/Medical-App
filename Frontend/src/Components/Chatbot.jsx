import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Plus,
  User,
  Send,
  MessageCircle,
  Mic,
  Image,
  Menu,
} from "react-feather";

import UserDashboardNavbar from "./UserDashboardNavbar";
import ChatbotNavbar from "./ChatbotNavbar";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // Sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Detect Mobile Screen
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);

      // Desktop view = sidebar ALWAYS visible
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const chatHistory = [
    "General Health",
    "Symptoms Check",
    "Diet Plans",
    "Medicine Info",
    "Appointment Booking",
  ];

  const sendMessage = () => {
    if (!input.trim()) return;

    setMessages([...messages, { sender: "user", text: input }]);
    setInput("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Thanks for your message! This is a simulated response from MedPulse.",
        },
      ]);
    }, 800);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    inputRef.current?.focus();
  }, [messages]);

  return (
    <div className="fixed inset-0 bg-[#e0f7fa] overflow-hidden font-[Poppins]">

      {/* DESKTOP NAVBAR */}
      {!isMobile && <UserDashboardNavbar />}

      {/* MOBILE NAVBAR */}
      {isMobile && (
        <ChatbotNavbar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      )}

      {/* MOBILE MENU BUTTON */}
      {isMobile && (
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="fixed top-[14vh] left-4 z-50 bg-[#00acc1] text-white p-3 rounded-full shadow-lg md:hidden"
        >
          <Menu size={22} />
        </button>
      )}

      {/* MAIN CONTENT */}
      <div className="flex h-[80vh] mt-[23vh] transition-all">

        {/* SIDEBAR */}
        <div
          className={`
            fixed md:static left-0 z-40 h-full w-64 md:w-1/5
            transform duration-300
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
            ${isMobile ? "mt-[10h]" : ""}
          `}
          style={{ background: "linear-gradient(135deg, #00acc1, #00796b)" }}
        >
          <div className="flex flex-col h-full p-4">

            <button className="w-full bg-white text-blue-600 font-bold py-2 rounded-lg shadow mb-4 flex items-center justify-center">
              <Plus size={16} className="mr-2" /> New Chat
            </button>

            {/* Search */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={16} />
              <input
                type="text"
                placeholder="Search chat..."
                className="w-full bg-white/80 pl-10 py-2 rounded-lg text-sm outline-none"
              />
            </div>

            <h6 className="font-bold mb-2 text-[#e0f7fa]">Chat History</h6>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
              {chatHistory.map((item, i) => (
                <div
                  key={i}
                  className="bg-white/20 px-3 py-2 rounded-lg cursor-pointer text-sm hover:bg-white/30"
                >
                  {item}
                </div>
              ))}
            </div>

            {/* Desktop Profile */}
            <div className="hidden md:flex items-center mt-4 border-t border-white/40 pt-3">
              <img
                src="/Ayushman.png"
                alt="profile"
                className="w-12 h-12 rounded-full border-2 border-white"
              />
              <div className="ml-3">
                <p className="text-sm font-semibold">User Name</p>
                <p className="text-xs text-[#e0f7fa]">View Profile</p>
              </div>
            </div>
          </div>
        </div>

        {/* CHAT AREA */}
        <div className="flex-1 flex flex-col bg-[#e0f7fa]">
          <div className="flex-1 p-5 overflow-y-auto flex flex-col">
            {messages.length === 0 ? (
              <div className="text-center text-gray-600 mt-10">
                <MessageCircle size={48} className="mx-auto mb-4" />
                <h5 className="text-lg font-semibold">Welcome to MedPulse!</h5>
                <p>Start a conversation by typing a message...</p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`
                    max-w-[80%] p-3 rounded-xl shadow mb-4 text-sm
                    ${
                      msg.sender === "user"
                        ? "self-end bg-[#00acc1] text-white"
                        : "self-start bg-white text-[#00796b]"
                    }
                  `}
                >
                  {msg.text}
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t-4 border-[#00acc1]">
            <div className="flex items-center">
              <button className="p-2 text-[#00acc1]">
                <Mic size={20} />
              </button>

              <button className="p-2 text-[#00acc1] mr-2">
                <Image size={20} />
              </button>

              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask MedPulse anything..."
                className="flex-1 bg-[#e0f7fa] border border-[#00acc1] rounded-lg p-3 text-sm outline-none"
              />

              <button
                onClick={sendMessage}
                className="ml-3 bg-gradient-to-br from-[#00acc1] to-[#00796b] text-white px-4 py-3 rounded-lg font-bold shadow mr-[5%] md:mr-0"
              >
                <Send size={16} className="inline mr-1" /> Send
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE OVERLAY */}
      {isMobile && isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-20"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Chatbot;
