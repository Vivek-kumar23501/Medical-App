import React, { useState, useEffect, useCallback } from 'react';

// Slide data with normal src paths
const slidesData = [
  {
    id: 1,
    title: 'Experience the Future',
    subtitle: 'Cutting-edge technology at your fingertips.',
    image: '/Solution.png', // public folder image
  },
  {
    id: 2,
    title: 'Unmatched Performance',
    subtitle: 'Speed and efficiency you can rely on.',
    image: '/Performance.png', // public folder image
  },
  {
    id: 3,
    title: 'Designed for Creativity',
    subtitle: 'Empowering artists and innovators worldwide.',
    image: '/Creativity.png', // public folder image
  },
];

const HeroSliderTailwind = ({ interval = 5000 }) => {
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
      const sliderInterval = setInterval(goToNextSlide, interval);
      return () => clearInterval(sliderInterval);
    }
  }, [goToNextSlide, interval]);

  const renderDots = () =>
    slidesData.map((_, index) => (
      <span
        key={index}
        className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ${
          index === activeIndex ? 'bg-white scale-110' : 'bg-gray-400 opacity-60 hover:opacity-100'
        }`}
        onClick={() => setActiveIndex(index)}
        aria-label={`Go to slide ${index + 1}`}
      ></span>
    ));

  const currentSlide = slidesData[activeIndex];

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gray-900 flex items-center justify-center">
      {/* Slide Image using <img> tag */}
      <img
        src={currentSlide.image}
        alt={currentSlide.title}
        className="w-full h-full object-cover absolute inset-0"
      />

      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>

      {/* Text Content */}
      <div className="relative z-10 text-center text-white p-4 max-w-4xl">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">
          {currentSlide.title}
        </h1>
        <p className="text-xl md:text-2xl mb-8 font-light">{currentSlide.subtitle}</p>
        <button className="px-8 py-3 text-lg font-semibold text-white bg-indigo-600 rounded-full hover:bg-indigo-700 transition duration-300 shadow-xl">
          Discover Now
        </button>
      </div>

      {/* Navigation Arrows */}
      <button
        className="absolute top-1/2 left-4 md:left-8 transform -translate-y-1/2 p-3 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition duration-300 z-20 focus:outline-none"
        onClick={goToPrevSlide}
        aria-label="Previous Slide"
      >
        &#10094;
      </button>
      <button
        className="absolute top-1/2 right-4 md:right-8 transform -translate-y-1/2 p-3 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition duration-300 z-20 focus:outline-none"
        onClick={goToNextSlide}
        aria-label="Next Slide"
      >
        &#10095;
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        {renderDots()}
      </div>
    </div>
  );
};

export default HeroSliderTailwind;
