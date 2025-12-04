import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const ExpertNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("English");
  const [navbarTop, setNavbarTop] = useState(85); // default top

  const languages = [
    { code: "en", label: "English" },
    { code: "hi", label: "Hindi" },
    { code: "or", label: "Odia" },
    { code: "ur", label: "Urdu" },
    { code: "es", label: "Spanish" },
    { code: "fr", label: "French" },
    { code: "bn", label: "Bengali" },
    { code: "ta", label: "Tamil" },
    { code: "te", label: "Telugu" },
    { code: "other", label: "Other Languages" },
  ];

  // Load Google Translate Script
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);

    window.googleTranslateElementInit = () => {
      if (window.google && window.google.translate) {
        new window.google.translate.TranslateElement(
          { pageLanguage: "en", includedLanguages: "en,hi,or,ur,es,fr,bn,ta,te" },
          "google_translate_element"
        );
      }
    };

    // Detect Google Translate Banner and adjust margin
    const observer = new MutationObserver(() => {
      const gtFrame = document.querySelector(".goog-te-banner-frame.skiptranslate");
      if (gtFrame) {
        setNavbarTop(135); // +50px extra
      } else {
        setNavbarTop(85); // default
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  const translatePage = (langCode, label) => {
    setCurrentLang(label);
    const select = document.querySelector("select.goog-te-combo");
    if (select) {
      select.value = langCode;
      select.dispatchEvent(new Event("change"));
    }
    setLangOpen(false);
  };

  return (
    <>
      {/* TOP LOGO BAR */}
      <div className="fixed top-0 w-full bg-[#e0f7fa] border-b border-[#b2ebf2] z-50 py-2.5">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="flex justify-center md:justify-start items-center space-x-2">
            <img src="/who.jpeg" alt="WHO" className="h-[45px] md:h-[65px]" />
            <img src="Ayushman.png" alt="Ayushman Bharat" className="h-[45px] md:h-[65px]" />
            <img src="/minstry.png" alt="Ministry Health" className="h-[45px] md:h-[65px]" />
            <img src="/Sihlogo.png" alt="SIH" className="h-[45px] md:h-[65px]" />
          </div>

          {/* Language Selector */}
          <div className="flex justify-center md:justify-end mt-2 md:mt-0 relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center px-3 py-1 bg-white border border-[#b2ebf2] rounded-md shadow-sm hover:bg-[#b2ebf2] font-medium text-sm"
            >
              {currentLang}
              <svg
                className="w-4 h-4 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={langOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
                />
              </svg>
            </button>

            {langOpen && (
              <ul className="absolute right-0 mt-2 w-44 bg-white border border-[#b2ebf2] rounded-md shadow-lg z-50">
                {languages.map((lang, idx) => (
                  <li
                    key={idx}
                    className="px-4 py-2 hover:bg-[#b2ebf2] hover:text-[#00695c] cursor-pointer"
                    onClick={() => translatePage(lang.code, lang.label)}
                  >
                    {lang.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* MAIN NAVBAR */}
      <nav
        className="fixed w-full bg-white border-b-2 border-[#00acc1] shadow-sm z-40"
        style={{ top: `${navbarTop}px` }}
      >
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <Link
            to="/"
            className="flex items-center font-[Roboto_Slab] font-bold text-[#00695c] text-xl"
          >
            <img src="/MedPulse logo.jpg" alt="MedPulse Logo" className="h-10 mr-2" />
            MedPulse
          </Link>

          <div className="md:hidden">
            <button className="text-gray-700 focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>

          <div className={`flex-1 justify-center md:flex ${isOpen ? "block" : "hidden"} md:block`}>
            <ul className="flex flex-col md:flex-row md:space-x-4 items-center text-[#004d40] font-medium">
              <li><Link to="/" className="px-3 py-2 rounded-md hover:bg-[#00acc1] hover:text-white">Home</Link></li>
              <li><Link to="/purpose" className="px-3 py-2 rounded-md hover:bg-[#00acc1] hover:text-white">Purpose of Platform</Link></li>
              <li><Link to="/services" className="px-3 py-2 rounded-md hover:bg-[#00acc1] hover:text-white">Services</Link></li>
              <li><Link to="/how-it-works" className="px-3 py-2 rounded-md hover:bg-[#00acc1] hover:text-white">How It Works</Link></li>
              <li><Link to="/impact-stats" className="px-3 py-2 rounded-md hover:bg-[#00acc1] hover:text-white">Impact Stats</Link></li>
            </ul>
          </div>

          <Link
            to="/login"
            className="hidden md:inline-block bg-gradient-to-r from-[#00796b] to-[#00acc1] hover:from-[#004d40] hover:to-[#0097a7] text-white px-6 py-2 rounded-lg font-semibold"
          >
            Login
          </Link>
        </div>
      </nav>

      {/* SPACER FOR FIXED NAVBAR */}
      <div style={{ paddingTop: navbarTop + 60 }}></div>

      {/* HIDDEN GOOGLE TRANSLATE */}
      <div id="google_translate_element" className="hidden"></div>
    </>
  );
};

export default ExpertNavbar;
