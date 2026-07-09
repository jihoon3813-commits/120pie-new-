"use client";

import { useEffect, useRef, useState } from "react";

export default function PieBrandConcept() {
  const imageUrl = "https://res.cloudinary.com/dfkntvpmv/image/upload/f_auto,q_auto/v1783341311/edited-photo_-_2026-07-06T213458.881_b7u44s.png";
  
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="pt-12 sm:pt-28 pb-0 bg-white dark:bg-neutral-950 transition-colors duration-300 relative z-0"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 sm:space-y-16">
        {/* Section Header */}
        <div className="space-y-4 sm:space-y-8 max-w-4xl mx-auto">
          {/* Eyebrow */}
          <span className={`inline-block text-xs font-bold text-amber-500 tracking-widest uppercase transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}>
            Core Philosophy
          </span>

          {/* Title */}
          <h2 className={`text-4xl sm:text-6xl font-black text-neutral-900 dark:text-white tracking-tight leading-tight transition-all duration-1000 delay-150 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}>
            PIE, NOT JUST DESSERT
          </h2>

          <div className={`h-1 w-20 bg-amber-500 mx-auto rounded-full transition-all duration-1000 delay-300 ${
            isVisible ? "scale-100 opacity-100" : "scale-0 opacity-0"
          }`} />

          {/* Sentences */}
          <div className="space-y-2 pt-2 sm:space-y-4 sm:pt-4">
            <p className={`text-lg sm:text-3xl font-extrabold text-neutral-800 dark:text-neutral-200 leading-normal transition-all duration-1000 delay-500 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}>
              디저트는 더 이상 사이드 메뉴가 아닙니다.
            </p>
            <p className={`text-lg sm:text-3xl font-extrabold text-neutral-800 dark:text-neutral-200 leading-normal transition-all duration-1000 delay-800 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}>
              120pie는 커피와 함께 팔리고, 포장되고, 배달되는
              {"\n"}
              새로운 매출형 디저트 브랜드입니다.
            </p>
          </div>
        </div>

        {/* Brand Concept Image - Borderless & Shadowless, positioned as the bottom anchor */}
        <div className={`w-full max-w-6xl mx-auto transition-all duration-1000 delay-1100 relative ${
          isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-12 scale-95"
        }`}>
          <img
            src={imageUrl}
            alt="120pie brand concept - pie, not just dessert"
            className="w-full h-auto object-cover block rounded-t-2xl sm:rounded-t-3xl"
          />
        </div>
      </div>
    </section>
  );
}
