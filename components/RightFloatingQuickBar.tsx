"use client";

import React from "react";
import { Phone, MessageCircle, ChevronUp } from "lucide-react";

interface RightFloatingQuickBarProps {
  onOpenConsultation?: () => void;
}

export default function RightFloatingQuickBar({
  onOpenConsultation,
}: RightFloatingQuickBarProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleConsultationClick = () => {
    if (onOpenConsultation) {
      onOpenConsultation();
    } else {
      const el = document.getElementById("inquiry");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      } else {
        window.location.href = "/brand/franchise#inquiry";
      }
    }
  };

  return (
    <div className="fixed right-2.5 bottom-20 sm:right-6 sm:bottom-24 z-[90] flex flex-col items-end select-none">
      {/* Main Floating Container */}
      <div className="bg-neutral-950/90 backdrop-blur-md opacity-95 hover:opacity-100 border border-neutral-800 text-white rounded-3xl p-2 sm:p-2.5 flex flex-col items-center gap-1.5 sm:gap-2 shadow-[0_15px_35px_rgba(0,0,0,0.5)] transition-all duration-300 w-15 sm:w-20">
        
        {/* Top Brand Logo Circular Emblem */}
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden flex items-center justify-center shadow-md my-0.5 shrink-0 border border-amber-400/40 bg-neutral-900">
          <img
            src="https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784785714/120%ED%8C%8C%EC%9D%B4_%EC%BB%A4%ED%94%BC_%EA%B8%88%EC%A0%95%EC%A0%90_%EC%B1%84%EB%84%90%EC%82%AC%EC%9D%B8_%EB%94%94%EC%9E%90%EC%9D%B8_250828_5_1_x8faxl.png"
            alt="120PIE 심볼 로고"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Item 1: 인스타 */}
        <a
          href="https://www.instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2 px-1 rounded-2xl bg-neutral-900/90 border border-neutral-800/80 hover:bg-[#FBC400] hover:text-neutral-950 hover:border-[#FBC400] transition-all duration-200 flex flex-col items-center justify-center text-center group text-neutral-200 cursor-pointer"
          title="공식 인스타그램"
        >
          <svg className="w-4 h-4 mb-1 text-[#FBC400] group-hover:text-neutral-950 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
          </svg>
          <span className="text-[9px] sm:text-[10px] font-extrabold leading-tight block">인스타</span>
        </a>

        {/* Item 2: 유튜브 */}
        <a
          href="https://www.youtube.com"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2 px-1 rounded-2xl bg-neutral-900/90 border border-neutral-800/80 hover:bg-[#FBC400] hover:text-neutral-950 hover:border-[#FBC400] transition-all duration-200 flex flex-col items-center justify-center text-center group text-neutral-200 cursor-pointer"
          title="공식 유튜브"
        >
          <svg className="w-4 h-4 mb-1 text-[#FBC400] group-hover:text-neutral-950 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
            <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
          </svg>
          <span className="text-[9px] sm:text-[10px] font-extrabold leading-tight block">유튜브</span>
        </a>

        {/* Item 3: 전화문의 */}
        <a
          href="tel:1899-5685"
          className="w-full py-2 px-1 rounded-2xl bg-neutral-900/90 border border-neutral-800/80 hover:bg-[#FBC400] hover:text-neutral-950 hover:border-[#FBC400] transition-all duration-200 flex flex-col items-center justify-center text-center group text-neutral-200 cursor-pointer"
          title="전화문의 (1899-5685)"
        >
          <Phone size={16} className="mb-1 text-[#FBC400] group-hover:text-neutral-950 transition-colors" />
          <span className="text-[9px] sm:text-[10px] font-extrabold leading-tight block">전화문의</span>
        </a>

        {/* Item 4: 카톡문의 */}
        <button
          type="button"
          onClick={() => {
            if (onOpenConsultation) onOpenConsultation();
            window.open("https://pf.kakao.com", "_blank");
          }}
          className="w-full py-2 px-1 rounded-2xl bg-neutral-900/90 border border-neutral-800/80 hover:bg-[#FBC400] hover:text-neutral-950 hover:border-[#FBC400] transition-all duration-200 flex flex-col items-center justify-center text-center group text-neutral-200 cursor-pointer"
          title="카톡 1:1 상담 문의"
        >
          <MessageCircle size={16} className="mb-1 text-[#FBC400] group-hover:text-neutral-950 transition-colors" />
          <span className="text-[9px] sm:text-[10px] font-extrabold leading-tight block">카톡문의</span>
        </button>

        {/* Item 5: TOP */}
        <button
          type="button"
          onClick={scrollToTop}
          className="w-full py-1.5 px-1 rounded-2xl bg-neutral-900/90 border border-neutral-800/80 hover:bg-[#FBC400] hover:text-neutral-950 hover:border-[#FBC400] transition-all duration-200 flex flex-col items-center justify-center text-center group text-neutral-200 cursor-pointer"
          title="맨 위로 이동"
        >
          <ChevronUp size={15} className="text-[#FBC400] group-hover:text-neutral-950 transition-colors" />
          <span className="text-[9px] sm:text-[10px] font-black leading-tight block">TOP</span>
        </button>

      </div>
    </div>
  );
}
