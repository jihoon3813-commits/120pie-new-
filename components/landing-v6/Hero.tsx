"use client";

import { useState, useEffect } from "react";
import { motion, PanInfo } from "framer-motion";
import { optimizeCloudinaryUrl } from "@/app/utils/cloudinary";

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [width, setWidth] = useState(0);

  const desktopSlides = [
    "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784389829/ChatGPT_Image_2026%EB%85%84_7%EC%9B%94_19%EC%9D%BC_%EC%98%A4%EC%A0%84_12_35_16_1_lqzaue.png",
    "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784390648/ChatGPT_Image_2026%EB%85%84_7%EC%9B%94_19%EC%9D%BC_%EC%98%A4%EC%A0%84_01_00_36_1_zvi0sz.png"
  ];

  const mobileSlides = [
    "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784391594/ChatGPT_Image_2026%EB%85%84_7%EC%9B%94_19%EC%9D%BC_%EC%98%A4%EC%A0%84_12_49_23_1_3_ttym6e.png",
    "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784392071/ChatGPT_Image_2026%EB%85%84_7%EC%9B%94_19%EC%9D%BC_%EC%98%A4%EC%A0%84_12_49_00_1_3_igjpyk.png"
  ];

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % desktopSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [desktopSlides.length]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? desktopSlides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % desktopSlides.length);
  };

  const handleDragEnd = (info: PanInfo) => {
    const threshold = 50; // drag threshold in pixels
    if (info.offset.x < -threshold) {
      // Swipe left -> Next slide
      setCurrentSlide((prev) => Math.min(prev + 1, desktopSlides.length - 1));
    } else if (info.offset.x > threshold) {
      // Swipe right -> Prev slide
      setCurrentSlide((prev) => Math.max(prev - 1, 0));
    }
  };

  const slideWidth = width || 1920;

  return (
    <section className="relative w-full aspect-[9/16] sm:aspect-[1902/1000] overflow-hidden bg-neutral-900 pt-16 sm:pt-20 select-none">
      
      {/* 💻 Desktop Banner Slider Track */}
      <div className="hidden sm:block absolute top-20 bottom-0 left-0 right-0 z-0 overflow-hidden">
        <motion.div
          drag="x"
          dragConstraints={{
            left: -((desktopSlides.length - 1) * slideWidth),
            right: 0
          }}
          dragElastic={0.15}
          animate={{ x: -currentSlide * slideWidth }}
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
          onDragEnd={(e, info) => handleDragEnd(info)}
          className="flex absolute inset-y-0 left-0 h-full cursor-grab active:cursor-grabbing"
          style={{ width: `${desktopSlides.length * 100}%` }}
        >
          {desktopSlides.map((slide, idx) => (
            <div key={idx} className="h-full shrink-0 relative" style={{ width: `${slideWidth}px` }}>
              <img
                src={optimizeCloudinaryUrl(slide)}
                alt={`120pie premium desktop background banner ${idx + 1}`}
                className="w-full h-full object-cover object-center pointer-events-none"
              />
            </div>
          ))}
        </motion.div>
      </div>

      {/* 📱 Mobile Banner Slider Track */}
      <div className="block sm:hidden absolute top-16 bottom-0 left-0 right-0 z-0 overflow-hidden">
        <motion.div
          drag="x"
          dragConstraints={{
            left: -((mobileSlides.length - 1) * slideWidth),
            right: 0
          }}
          dragElastic={0.15}
          animate={{ x: -currentSlide * slideWidth }}
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
          onDragEnd={(e, info) => handleDragEnd(info)}
          className="flex absolute inset-y-0 left-0 h-full cursor-grab active:cursor-grabbing"
          style={{ width: `${mobileSlides.length * 100}%` }}
        >
          {mobileSlides.map((slide, idx) => (
            <div key={idx} className="h-full shrink-0 relative" style={{ width: `${slideWidth}px` }}>
              <img
                src={optimizeCloudinaryUrl(slide)}
                alt={`120pie premium mobile background banner ${idx + 1}`}
                className="w-full h-full object-cover object-top pointer-events-none"
              />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Subtle top gradient overlay to blend with GNB */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-neutral-950/20 to-transparent pointer-events-none z-10" />

      {/* 🧭 Navigation Arrows (Desktop Only) */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 rounded-full bg-black/25 hover:bg-black/50 text-white/75 hover:text-white backdrop-blur-sm transition-all duration-300 shadow-md group hidden md:block"
        aria-label="이전 배너"
      >
        <svg className="w-6 h-6 stroke-[2.5] transform group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>

      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 rounded-full bg-black/25 hover:bg-black/50 text-white/75 hover:text-white backdrop-blur-sm transition-all duration-300 shadow-md group hidden md:block"
        aria-label="다음 배너"
      >
        <svg className="w-6 h-6 stroke-[2.5] transform group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>

      {/* 🔘 Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2.5">
        {desktopSlides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              currentSlide === idx ? "w-8 bg-amber-400" : "w-2 bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`${idx + 1}번 배너로 이동`}
          />
        ))}
      </div>
      
    </section>
  );
}
