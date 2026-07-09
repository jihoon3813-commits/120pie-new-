"use client";

import { motion } from "framer-motion";
import { Star, MessageCircle, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { optimizeCloudinaryUrl } from "@/app/utils/cloudinary";
import { useRef, useState } from "react";

export default function CustomerReviews() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  const reviews = [
    {
      url: "https://res.cloudinary.com/dfkntvpmv/image/upload/v1783409120/ChatGPT_Image_2026%EB%85%84_7%EC%9B%94_7%EC%9D%BC_%EC%98%A4%ED%9B%84_04_04_09_1_vcnrvr.png",
      caption: "배달 플랫폼 및 SNS 실시간 극찬 리뷰",
      category: "Delivery & SNS",
      rating: 5.0,
      likes: 124,
    },
    {
      url: "https://res.cloudinary.com/dfkntvpmv/image/upload/v1783409119/ChatGPT_Image_2026%EB%85%84_7%EC%9B%94_7%EC%9D%BC_%EC%98%A4%ED%9B%84_04_04_09_2_xjuno3.png",
      caption: "방문객들이 직접 인증한 생생한 현장 후기",
      category: "Store Visit",
      rating: 4.9,
      likes: 98,
    },
  ];

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      // Adjust index calculation based on scroll offset and card widths
      const idx = Math.round(scrollLeft / clientWidth);
      if (idx !== activeIdx && idx >= 0 && idx < reviews.length) {
        setActiveIdx(idx);
      }
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.85;
      const targetScroll = direction === "left" 
        ? scrollLeft - scrollAmount 
        : scrollLeft + scrollAmount;

      scrollRef.current.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="relative bg-neutral-50 dark:bg-neutral-900 pt-28 pb-24 sm:pt-36 sm:pb-32 overflow-hidden transition-colors duration-300">
      
      {/* Top Wavy transition from MenuGallery (Brand Yellow #FFB800) */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none z-10 -translate-y-[1px]">
        <svg viewBox="0 0 1200 100" preserveAspectRatio="none" className="relative block w-full h-[24px] sm:h-[40px] lg:h-[55px] text-[#FFB800]">
          <path
            d="M 0 50 Q 25 10, 50 50 Q 75 90, 100 50 Q 125 10, 150 50 Q 175 90, 200 50 Q 225 10, 250 50 Q 275 90, 300 50 Q 325 10, 350 50 Q 375 90, 400 50 Q 425 10, 450 50 Q 475 90, 500 50 Q 525 10, 550 50 Q 575 90, 600 50 Q 625 10, 650 50 Q 675 90, 700 50 Q 725 10, 750 50 Q 775 90, 800 50 Q 825 10, 850 50 Q 875 90, 900 50 Q 925 10, 950 50 Q 975 90, 1000 50 Q 1025 10, 1050 50 Q 1075 90, 1100 50 Q 1125 10, 1150 50 Q 1175 90, 1200 50 L 1200 0 L 0 0 Z"
            fill="currentColor"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-black uppercase tracking-widest"
          >
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>Customer Feedback</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-neutral-900 dark:text-white tracking-tight leading-[1.2]"
          >
            맛과 퀄리티로 증명된 생생 리뷰
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm sm:text-base md:text-lg font-medium text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed"
          >
            기계처럼 찍어낸 가짜 리뷰가 아닌, 실제 매장을 방문하고 배달을 주문한 고객분들이 직접 손수 남겨주신 120% 솔직한 목소리입니다.
          </motion.p>
        </div>

        {/* Review Summary Chart / Dashboard Image (2x Larger) - Clickable to Open Lightbox */}
        <motion.div
          onClick={() => {
            setSelectedImage("https://res.cloudinary.com/dfkntvpmv/image/upload/v1783409527/ChatGPT_Image_2026%EB%85%84_7%EC%9B%94_7%EC%9D%BC_%EC%98%A4%ED%9B%84_04_31_57_q9sswu.png");
            setIsZoomed(false);
          }}
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="max-w-[680px] sm:max-w-[900px] lg:max-w-[1100px] mx-auto mb-16 rounded-[2rem] overflow-hidden shadow-lg hover:shadow-xl border border-neutral-200/50 dark:border-neutral-800 bg-white p-3 sm:p-4 transition-all duration-300 cursor-zoom-in"
        >
          <img
            src={optimizeCloudinaryUrl("https://res.cloudinary.com/dfkntvpmv/image/upload/v1783409527/ChatGPT_Image_2026%EB%85%84_7%EC%9B%94_7%EC%9D%BC_%EC%98%A4%ED%9B%84_04_31_57_q9sswu.png")}
            alt="Review Rating Summary Dashboard"
            className="w-full h-auto object-contain rounded-[1.5rem]"
            loading="lazy"
          />
        </motion.div>

        {/* Carousel Container Wrapper */}
        <div className="relative group/carousel max-w-6xl mx-auto">
          
          {/* Left Arrow Button */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-[-20px] lg:left-[-35px] top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 shadow-lg flex items-center justify-center text-neutral-800 dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-all hover:scale-105 active:scale-95 hidden sm:flex"
            aria-label="이전 리뷰 보기"
          >
            <ChevronLeft className="w-6 h-6" strokeWidth={2.5} />
          </button>

          {/* Right Arrow Button */}
          <button
            onClick={() => scroll("right")}
            className="absolute right-[-20px] lg:right-[-35px] top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 shadow-lg flex items-center justify-center text-neutral-800 dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-all hover:scale-105 active:scale-95 hidden sm:flex"
            aria-label="다음 리뷰 보기"
          >
            <ChevronRight className="w-6 h-6" strokeWidth={2.5} />
          </button>

          {/* Horizontal Scrollable Container */}
          <div 
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-6 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] px-2"
          >
            {reviews.map((review, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="w-[88vw] sm:w-[80vw] md:w-[700px] lg:w-[850px] xl:w-[1000px] flex-shrink-0 snap-center group bg-white dark:bg-neutral-950 border border-neutral-200/80 dark:border-neutral-800 rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col justify-between"
              >
                {/* Card Upper: Mock Window Frame */}
                <div className="bg-neutral-100/70 dark:bg-neutral-900/70 px-6 py-4 sm:px-8 sm:py-5 border-b border-neutral-200/60 dark:border-neutral-800/60 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-3.5 h-3.5 rounded-full bg-red-400" />
                    <div className="w-3.5 h-3.5 rounded-full bg-yellow-400" />
                    <div className="w-3.5 h-3.5 rounded-full bg-green-400" />
                  </div>
                  <span className="text-xs sm:text-sm font-black text-neutral-500 dark:text-neutral-400 tracking-wider">
                    {review.category}
                  </span>
                </div>

                {/* Card Image Content (Enlarged to full width) - Clickable to Open Lightbox */}
                <div className="p-4 sm:p-8 bg-white dark:bg-neutral-950 flex-1 flex items-center justify-center">
                  <div 
                    onClick={() => {
                      setSelectedImage(review.url);
                      setIsZoomed(false);
                    }}
                    className="overflow-hidden rounded-2xl border border-neutral-100 dark:border-neutral-900 bg-neutral-50 dark:bg-neutral-900 w-full relative cursor-zoom-in"
                  >
                    <img
                      src={optimizeCloudinaryUrl(review.url)}
                      alt={review.caption}
                      className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-[1.01]"
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* Card Footer: Metadata */}
                <div className="px-6 py-5 sm:px-8 sm:py-6 bg-neutral-50/50 dark:bg-neutral-900/30 border-t border-neutral-200/50 dark:border-neutral-800/30 flex items-center justify-between text-xs sm:text-base">
                  <div className="flex items-center space-x-2 text-neutral-800 dark:text-neutral-200 font-bold">
                    <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 fill-amber-500/10" />
                    <span>{review.caption}</span>
                  </div>
                  
                  <div className="flex items-center space-x-4 sm:space-x-6 text-neutral-500">
                    <div className="flex items-center space-x-1.5 text-amber-500 font-black">
                      <Star className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-current" />
                      <span>{review.rating.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center space-x-1.5 text-red-500 font-black">
                      <Heart className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-current" />
                      <span>{review.likes}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Indicator Dots */}
          <div className="flex justify-center space-x-2 mt-6">
            {reviews.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (scrollRef.current) {
                    const cardWidth = scrollRef.current.scrollWidth / reviews.length;
                    scrollRef.current.scrollTo({
                      left: cardWidth * idx,
                      behavior: "smooth",
                    });
                    setActiveIdx(idx);
                  }
                }}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  activeIdx === idx 
                    ? "bg-amber-500 w-8" 
                    : "bg-neutral-300 dark:bg-neutral-700 hover:bg-neutral-400"
                }`}
                aria-label={`${idx + 1}번째 리뷰 슬라이드 보기`}
              />
            ))}
          </div>

        </div>

      </div>

      {/* Image Lightbox Modal with Zoom Capability */}
      {selectedImage && (
        <div
          onClick={() => {
            setSelectedImage(null);
            setIsZoomed(false);
          }}
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 cursor-zoom-out animate-fade-in"
        >
          {/* Modal Container */}
          <div 
            className="relative max-w-full max-h-[90vh] flex flex-col items-center overflow-auto scrollbar-none rounded-2xl" 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => {
                setSelectedImage(null);
                setIsZoomed(false);
              }}
              className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white p-2.5 rounded-full transition-colors cursor-pointer z-50 border border-white/10"
              title="닫기"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Zoom Button */}
            <button
              onClick={() => setIsZoomed(!isZoomed)}
              className="absolute top-4 left-4 bg-black/60 hover:bg-black/80 text-white px-4 py-2 rounded-full transition-colors cursor-pointer z-50 border border-white/10 text-xs font-black flex items-center gap-1.5 shadow-md"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isZoomed ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                )}
              </svg>
              <span>{isZoomed ? "축소" : "확대"}</span>
            </button>

            {/* Zoomable Image Container */}
            <div className={`transition-all duration-300 ${
              isZoomed 
                ? "w-[180%] max-w-none cursor-zoom-out overflow-auto p-4 bg-black/40 rounded-xl" 
                : "max-w-full max-h-[80vh] object-contain cursor-zoom-in"
            }`}>
              <img
                src={selectedImage}
                alt="Fullscreen Review Detail"
                onClick={() => setIsZoomed(!isZoomed)}
                className="rounded-xl shadow-2xl w-full h-auto object-contain border border-white/10 select-none animate-zoom-in"
              />
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes zoomIn {
          from { transform: scale(0.95); }
          to { transform: scale(1); }
        }
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out forwards;
        }
        .animate-zoom-in {
          animation: zoomIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </section>
  );
}
