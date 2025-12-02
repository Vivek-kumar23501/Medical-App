"use client";
import React, { useState, useEffect } from "react";

const HeaderSlider = () => {
  const sliderData = [
    {
      id: 1,
      title: "Sustainably Crafted. Thoughtfully Delivered.",
      offer: "Eco-Friendly Corporate",
      desc: "Elevate your brand with sustainable corporate gifts that make a lasting impact.",
      buttonText1: "Shop Now",
      buttonText2: "Learn More",
      imgSrc: "/Ayushman.png",
    },
    {
      id: 2,
      title: "Inspire Young Minds.",
      offer: "School Merchandise",
      desc: "Create unity and pride with personalized school merchandise that sparks creativity.",
      buttonText1: "Design Now",
      buttonText2: "View All",
      imgSrc: "/crousal.jpg",
    },
    {
      id: 3,
      title: "Branded Goodies. Lasting Memories.",
      offer: "Team & Event Specials",
      desc: "Make your events memorable with custom-designed merchandise that tells your story.",
      buttonText1: "Get Started",
      buttonText2: "See Catalog",
      imgSrc: "/minstry.png",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderData.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleSlideChange = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="overflow-hidden relative w-full">
      {/* Slider Container */}
      <div
        className=" mt-10 mb-10  flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {sliderData.map((slide, index) => (
          <div
            key={slide.id}
            className="flex-none min-w-[calc(100%-80px)] mx-10 flex flex-col-reverse md:flex-row items-center justify-between bg-[#E6E9F2] py-8 md:px-14 px-5 mt-6 rounded-xl"
          >
            <div className="md:pl-8 mt-10 md:mt-0">
              <span className="inline-block px-4 py-1 bg-orange-100 text-orange-600 rounded-full text-sm font-medium">
                {slide.offer}
              </span>

              <h1 className="max-w-lg md:text-[42px] md:leading-[1.2] text-2xl font-bold text-gray-800 mt-4">
                {slide.title}
              </h1>

              <p className="max-w-md text-gray-600 mt-4 text-base md:text-lg font-light">
                {slide.desc}
              </p>

              <div className="flex items-center gap-4 mt-8">
                <button className="px-8 py-2.5 bg-orange-600 rounded-full text-white font-medium hover:bg-orange-700 transition-colors">
                  {slide.buttonText1}
                </button>

                <button className="group flex items-center gap-2 px-6 py-2.5 font-medium text-gray-700 hover:text-orange-600 transition-colors">
                  {slide.buttonText2}
                  <img
                    className="group-hover:translate-x-1 transition-transform w-4"
                    src="/MedPulse logo.jpg"
                    alt="arrow"
                  />
                </button>
              </div>
            </div>

            <div className="flex items-center flex-1 justify-center">
              <img
                className="md:w-72 w-48 object-contain"
                src={slide.imgSrc}
                alt={`Slide ${index + 1}`}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="flex items-center justify-center gap-2 mt-8">
        {sliderData.map((_, index) => (
          <div
            key={index}
            onClick={() => handleSlideChange(index)}
            className={`h-2.5 w-2.5 rounded-full cursor-pointer transition-all duration-300 ${
              currentSlide === index ? "bg-orange-600 scale-110" : "bg-gray-500/30"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default HeaderSlider;
