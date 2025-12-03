import React, { useState, useEffect, useCallback } from "react";

// Medical slides content
const slidesData = [
  {
    id: 1,
    title: 'MedPulse – Your Smart Digital Health Companion',
    subtitle: 'Empowering communities with preventive healthcare knowledge and tips.',
    image: '/crousal.jpg',
  },
  {
    id: 2,
    title: 'Book Appointments with Top Specialists',
    subtitle: 'Easily find doctors and schedule consultations anytime, anywhere.',
    image: '/crousal.jpg',
  },
  {
    id: 3,
    title: 'Track Your Health Progress',
    subtitle: 'Receive personalized health reminders, medication alerts, and wellness tips.',
    image: '/crousal.jpg',
  },
];

const HeroSection = ({ interval = 5000 }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const totalSlides = slidesData.length;

  const goToNextSlide = useCallback(() => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % totalSlides);
  }, [totalSlides]);

  const goToPrevSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + totalSlides) % totalSlides);
  };

  useEffect(() => {
    if (interval > 0) {
      const sliderInterval = setInterval(() => {
        goToNextSlide();
      }, interval);
      return () => clearInterval(sliderInterval);
    }
  }, [goToNextSlide, interval]);

  return (
    <div className="relative w-full overflow-hidden mt-0 md:mt-20 sm:h-[80vh] h-[600px]">
      {/* Slider track */}
      <div
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {slidesData.map((slide) => (
          <div
            key={slide.id}
            className="flex-none w-full relative flex items-center justify-center h-full bg-[#e0f7fa] py-16"
          >
            {/* Optional image */}
            <img
              src={slide.image}
              alt={slide.title}
              className="absolute w-full h-full object-cover opacity-60"
            />
            {/* Content */}
            <div className="relative z-10 text-center px-5">
              <h1 className="text-gray-800 text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">{slide.title}</h1>
              <p className="text-gray-700 text-lg md:text-xl font-medium drop-shadow-md">{slide.subtitle}</p>
              <button style={{
                width:"220px"
              }} className="mt-6 px-6 py-3   bg-gradient-to-r from-teal-900 to-cyan-500 text-white font-semibold rounded-lg uppercase transition duration-300 hover:from-teal-800 hover:to-cyan-600">
 <b>  Get Started </b>
</button>

            </div>
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      <button
        onClick={goToPrevSlide}
        className="absolute top-1/2 left-5 -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-md hover:bg-opacity-75 z-20"
      >
        &#10094;
      </button>
      <button
        onClick={goToNextSlide}
        className="absolute top-1/2 right-5 -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-md hover:bg-opacity-75 z-20"
      >
        &#10095;
      </button>
    </div>
  );
};

export default HeroSection;
