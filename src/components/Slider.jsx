import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { getImageUrl } from "../utils/imageUtils";

const DEFAULT_SLIDES = [
  {
    id: 1,
    image: "/fwdimagesforsite 1/Alchimia 2.webp",
    title: "Starts with Samples",
    subtitle: "Everything here",
    btnText: "Shop Samples",
    link: "/Shop By Sample"
  },
  {
    id: 2,
    image: "/fwdimagesforsite 1/Etruria 6.webp",
    subtitle: "Imagination is",
    title: "The only Limitation",  
    btnText: "Shop Collections",
    link: "/Shop By Collections",
  },
  {
    id: 3,
    image: "/fwdimagesforsite 1/spazzio bimbo@3.webp",
    subtitle: "From detail",
    title: "to Big Surfaces",
    btnText: "Shop Formats",
    link: "/Shop By Formats",
  },
  {
    id: 4,
    image: "/fwdimagesforsite 1/Serpal Legna Nogel.webp",
    subtitle: "In Association",
    title: "with Design Fraternity",
    btnText: "Join Now",
    link: "/collection/brush"
  },
];

function Slider() {
  const [slides, setSlides] = useState(DEFAULT_SLIDES);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const nextSlide = () => setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/slides`);
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            setSlides(data);
          }
        }
      } catch (err) {
        console.error("Failed to load slides:", err);
      }
    };
    fetchSlides();
  }, []);

  useEffect(() => { 
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return ( 
    <div className="relative w-full h-[115vh] overflow-hidden rounded-none tracking-tight">
      {/* Slides Container */}
      <div
        className="flex transition-transform duration-700 ease-in-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div key={slide._id || slide.id} className="min-w-full relative h-full flex-shrink-0">
            <img
              src={getImageUrl(slide.image)}
              alt={slide.title}
              loading={index === 0 ? "eager" : "lazy"}
              {...(index === 0 ? { fetchPriority: "high" } : {})}
              className="w-full h-full object-cover block select-none"
            />
            {/* Overlay for text contrast - content positioned at the bottom right */}
            <div className="absolute top-0 left-0 w-full h-full flex items-end justify-end px-6 md:px-20 pb-20 md:pb-28">
              <div className="flex flex-col items-center gap-2 max-w-3xl text-white">
                <div className="flex flex-col items-center text-center">
                  <motion.h2
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    key={`t-${currentIndex}`}
                    className="text-[26px] font-medium text-white drop-shadow-md mb-0 leading-none text-center"
                  >
                    {slide.subtitle}
                  </motion.h2>
                  <motion.h1
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    key={`s-${currentIndex}`}
                    className="text-[40px] font-normal leading-none text-white drop-shadow-lg text-center mt-2"
                  >
                    {slide.title}
                  </motion.h1>
                </div>
                {slide.btnText && (
                  <div className="mt-[4px]">
                    <motion.button
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      key={`b-${currentIndex}`}
                      onClick={() => navigate(slide.link)}
                      className="h-[40px] px-6 flex items-center justify-center bg-[#00264B] text-white text-[15px] font-normal tracking-wide rounded-none hover:bg-white hover:text-[#00264B] transition-all border border-[#00264B] cursor-pointer shadow-lg whitespace-nowrap"
                    >
                      {slide.btnText}
                    </motion.button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {slides.length > 1 && (
        <>
          {/* Prev Button */}
          <button
            onClick={prevSlide}
            aria-label="Previous Slide"
            className="absolute top-1/2 left-4 md:left-6 -translate-y-1/2 bg-white/10 hover:bg-white/25 backdrop-blur-md text-white rounded-full p-2.5 md:p-3 border border-white/20 cursor-pointer z-20 transition-all duration-300 hover:scale-105 flex items-center justify-center select-none"
          >
            <HiChevronLeft className="text-xl md:text-2xl" />
          </button>

          {/* Next Button */}
          <button
            onClick={nextSlide}
            aria-label="Next Slide"
            className="absolute top-1/2 right-4 md:right-6 -translate-y-1/2 bg-white/10 hover:bg-white/25 backdrop-blur-md text-white rounded-full p-2.5 md:p-3 border border-white/20 cursor-pointer z-20 transition-all duration-300 hover:scale-105 flex items-center justify-center select-none"
          > 
            <HiChevronRight className="text-xl md:text-2xl" />
          </button>
        </>
      )}
    </div>
  );
}

export default Slider;