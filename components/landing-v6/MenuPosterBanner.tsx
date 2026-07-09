"use client";

import { Sparkles } from "lucide-react";
import { optimizeCloudinaryUrl } from "@/app/utils/cloudinary";

const POSTER_IMAGES = [
  "https://res.cloudinary.com/dfkntvpmv/image/upload/f_auto,q_auto/v1783570620/ChatGPT_Image_2026%EB%85%84_6%EC%9B%94_30%EC%9D%BC_%EC%98%A4%ED%9B%84_05_58_55_wx2peg.png",
  "https://res.cloudinary.com/dfkntvpmv/image/upload/f_auto,q_auto/v1783570606/120_%EC%88%98%EB%B0%95%EC%A3%BC%EC%8A%A4_POP_A4_3_dow8re.png",
  "https://res.cloudinary.com/dfkntvpmv/image/upload/f_auto,q_auto/v1783570599/120%ED%8C%8C%EC%9D%B4-%ED%9D%91%EC%9E%84%EC%9E%90-%ED%8F%AC%EC%8A%A4%ED%84%B0__231007_r1kiww.jpg",
  "https://res.cloudinary.com/dfkntvpmv/image/upload/f_auto,q_auto/v1783570598/%EC%95%A0%ED%94%8C%ED%8C%8C%EC%9D%B4%EC%BB%A4%ED%94%BC%EC%84%B8%ED%8A%B8_yj3e42.jpg",
  "https://res.cloudinary.com/dfkntvpmv/image/upload/f_auto,q_auto/v1783570598/120%ED%8C%8C%EC%9D%B4_%ED%95%A8%EB%B0%95%EC%B9%98%EC%A6%88%ED%8C%8C%EC%9D%B4_Pop_Poster_vvkfbe.jpg",
  "https://res.cloudinary.com/dfkntvpmv/image/upload/f_auto,q_auto/v1783570598/120%ED%8C%8C%EC%9D%B4-%ED%81%AC%EB%A6%BC%EC%B9%98%EC%A6%88-%ED%8F%AC%EC%8A%A4%ED%84%B0__230925_wph2wa.jpg",
  "https://res.cloudinary.com/dfkntvpmv/image/upload/f_auto,q_auto/v1783570598/%EB%A7%A4%EC%9E%A5POP_2_%EC%A7%81%ED%99%94%EB%B6%88%EB%8B%AD_NONEWON_wxdczh.jpg",
  "https://res.cloudinary.com/dfkntvpmv/image/upload/f_auto,q_auto/v1783570598/%EB%A7%A4%EC%9E%A5POP_1_%EC%A7%81%ED%99%94%EB%B6%88%EA%B3%A0%EA%B8%B0_NONEWON_itkdqv.jpg",
  "https://res.cloudinary.com/dfkntvpmv/image/upload/f_auto,q_auto/v1783570598/%EB%A1%9C%EC%A0%9C%EB%AF%B8%ED%8A%B8%ED%8C%8C%EC%9D%B4%EC%84%B8%ED%8A%B8_glhjar.jpg",
];

export default function MenuPosterBanner() {
  // Double the images array for infinite marquee effect
  const rollingImages = [...POSTER_IMAGES, ...POSTER_IMAGES];

  return (
    <section className="bg-[#004e26] py-16 sm:py-24 overflow-hidden relative text-white border-b border-emerald-900/30">
      {/* Decorative Brand Icon and Background */}
      <div className="absolute top-8 left-8 opacity-20 pointer-events-none hidden md:block">
        <svg width="48" height="48" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="50" cy="50" r="40" strokeDasharray="5 5" />
          <path d="M50 30 L50 70 M30 50 L70 50" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12 sm:mb-16 relative z-10">
        <div className="inline-flex items-center justify-center mb-3">
          <Sparkles className="text-amber-400 w-5 h-5 animate-pulse" />
        </div>
        <span className="block text-xs sm:text-sm font-extrabold uppercase tracking-widest text-amber-300/90 mb-2 font-mono">
          Season Menu & New Menu
        </span>
        <h3 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4 leading-tight">
          시즌메뉴 & 신메뉴<br />출시만 하면 <span className="text-amber-300 relative inline-block mx-1">
            Hit!
            <svg className="absolute -bottom-1.5 left-0 w-full h-2 text-amber-300/80" viewBox="0 0 100 10" preserveAspectRatio="none">
              <path d="M0,5 Q50,10 100,5" stroke="currentColor" strokeWidth="3" fill="none" />
            </svg>
          </span>
        </h3>
        <p className="text-xs sm:text-sm font-bold text-white/80 max-w-xl mx-auto leading-relaxed mt-4">
          전문 R&D 시스템으로 시즌마다 트렌디한 신 메뉴 출시!
        </p>
      </div>

      <div className="relative w-full overflow-hidden">
        {/* Soft edge masking for premium look */}
        <div className="absolute inset-y-0 left-0 w-12 sm:w-32 bg-gradient-to-r from-[#004e26] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-12 sm:w-32 bg-gradient-to-l from-[#004e26] to-transparent z-10 pointer-events-none" />

        {/* Rolling track */}
        <div className="flex w-max animate-posterMarquee hover:[animation-play-state:paused] cursor-grab active:cursor-grabbing">
          {rollingImages.map((src, index) => (
            <div
              key={index}
              className="w-[165px] sm:w-[240px] px-2 sm:px-3 shrink-0"
            >
              <div className="aspect-[3/4] rounded-xl sm:rounded-2xl overflow-hidden shadow-lg border border-white/10 group relative transition-all duration-300 hover:shadow-xl hover:border-white/20">
                <img
                  src={optimizeCloudinaryUrl(src)}
                  alt={`Menu Poster ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Local marquee animation style */}
      <style jsx>{`
        @keyframes posterMarquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-posterMarquee {
          animation: posterMarquee 35s linear infinite;
        }
      `}</style>
    </section>
  );
}
