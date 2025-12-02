import React, { useState, useEffect } from 'react';

const HeroSliderTailwind = ({ interval = 5000 }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const totalSlides = 3; // number of slides

  // Auto-play next slide
  useEffect(() => {
    const sliderInterval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % totalSlides);
    }, interval);
    return () => clearInterval(sliderInterval);
  }, [interval]);

  const goToNextSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % totalSlides);
  };

  const goToPrevSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + totalSlides) % totalSlides);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gray-900 flex items-center justify-center">

      {/* Slide 1 */}
      {activeIndex === 0 && (
        <div className="w-full h-full relative flex items-center justify-center">
          <img src="/Solution.png" alt="Experience the Future" className="w-full h-full object-cover absolute inset-0" />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div className="relative z-10 text-center text-white p-4 max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">
              Experience the Future
            </h1>
            <p className="text-xl md:text-2xl mb-8 font-light">
              Cutting-edge technology at your fingertips.
            </p>
            <button className="px-8 py-3 text-lg font-semibold text-white bg-indigo-600 rounded-full hover:bg-indigo-700 transition duration-300 shadow-xl">
              Discover Now
            </button>
          </div>
        </div>
      )}

      {/* Slide 2 */}
      {activeIndex === 1 && (
        <div className="w-full h-full relative flex items-center justify-center">
          <img src="/Performance.png" alt="Unmatched Performance" className="w-full h-full object-cover absolute inset-0" />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div className="relative z-10 text-center text-white p-4 max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">
              Unmatched Performance
            </h1>
            <p className="text-xl md:text-2xl mb-8 font-light">
              Speed and efficiency you can rely on.
            </p>
            <button className="px-8 py-3 text-lg font-semibold text-white bg-indigo-600 rounded-full hover:bg-indigo-700 transition duration-300 shadow-xl">
              Discover Now
            </button>
          </div>
        </div>
      )}

      {/* Slide 3 */}
      {activeIndex === 2 && (
        <div className="w-full h-full relative flex items-center justify-center">
          <img src="/Creativity.png" alt="Designed for Creativity" className="w-full h-full object-cover absolute inset-0" />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div className="relative z-10 text-center text-white p-4 max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">
              Designed for Creativity
            </h1>
            <p className="text-xl md:text-2xl mb-8 font-light">
              Empowering artists and innovators worldwide.
            </p>
            <button className="px-8 py-3 text-lg font-semibold text-white bg-indigo-600 rounded-full hover:bg-indigo-700 transition duration-300 shadow-xl">
              Discover Now
            </button>
          </div>
        </div>
      )}

      {/* Navigation Arrows */}
      <button
        className="absolute top-1/2 left-4 md:left-8 transform -translate-y-1/2 p-3 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition duration-300 z-20 focus:outline-none"
        onClick={goToPrevSlide}
      >
        &#10094;
      </button>
      <button
        className="absolute top-1/2 right-4 md:right-8 transform -translate-y-1/2 p-3 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition duration-300 z-20 focus:outline-none"
        onClick={goToNextSlide}
      >
        &#10095;
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        <span
          className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ${activeIndex === 0 ? 'bg-white scale-110' : 'bg-gray-400 opacity-60 hover:opacity-100'}`}
          onClick={() => setActiveIndex(0)}
        ></span>
        <span
          className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ${activeIndex === 1 ? 'bg-white scale-110' : 'bg-gray-400 opacity-60 hover:opacity-100'}`}
          onClick={() => setActiveIndex(1)}
        ></span>
        <span
          className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ${activeIndex === 2 ? 'bg-white scale-110' : 'bg-gray-400 opacity-60 hover:opacity-100'}`}
          onClick={() => setActiveIndex(2)}
        ></span>
      </div>
    </div>
  );
};

export default HeroSliderTailwind;
