import React, { useState, useEffect, useRef } from "react";
import { Search, Plus, User, Send, MessageCircle, Mic, Image, Menu } from "react-feather";

import ChatbotNavbar from "./ChatbotNavbar";
import ChatSidebar from "./ChatSidebar";   // <-- IMPORT THE SIDEBAR COMPONENT

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
    "General Health", "Symptoms Check", "Diet Plans", "Medicine Info", "Appointment Booking",
    "General Health", "Symptoms Check", "Diet Plans", "Medicine Info", "Appointment Booking"
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

      {/* NAVBAR */}
      <ChatbotNavbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      {/* Mobile Sidebar Toggle Button */}
      {isMobile && (
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="fixed top-[14vh] left-4 z-50 bg-[#00acc1] text-white p-3 rounded-full shadow-lg md:hidden"
        >
          <Menu size={22} />
        </button>
      )}

      {/* MAIN LAYOUT */}
      <div className="flex h-[90vh] mt-[10vh] transition-all bg-[#e0f7fa]">

        {/* SIDEBAR */}
        <ChatSidebar
          isSidebarOpen={isSidebarOpen}
          isMobile={isMobile}
          chatHistory={chatHistory}
        />

        {/* CHAT AREA */}
        <div
          style={{ margin:"10px 20px" }}
          className="flex-1 flex flex-col bg-white rounded-lg shadow-lg"
        >
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
                  className={`max-w-[80%] p-3 rounded-xl shadow mb-4 text-sm ${
                    msg.sender === "user"
                      ? "self-end bg-[#00acc1] text-white"
                      : "self-start bg-[#e0f7fa] text-[#00796b]"
                  }`}
                >
                  {msg.text}
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* INPUT AREA */}
          <div className="p-4 bg-white border-t-4 border-[#00acc1]">
            <div className="flex items-center">
              <button className="p-2 text-[#00acc1]"><Mic size={20} /></button>
              <button className="p-2 text-[#00acc1] mr-2"><Image size={20} /></button>

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
                className="ml-3 bg-gradient-to-br from-[#00acc1] to-[#00796b] text-white px-4 py-3 rounded-lg font-bold shadow"
              >
                <Send size={16} className="inline mr-1" /> Send
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* OVERLAY FOR MOBILE BACKDROP */}
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
