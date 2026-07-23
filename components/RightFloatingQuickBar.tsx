"use client";

import React, { useState } from "react";
import { Phone, FileText, MessageSquare, Handshake, ChevronUp } from "lucide-react";

interface RightFloatingQuickBarProps {
  onOpenConsultation?: () => void;
}

export default function RightFloatingQuickBar({
  onOpenConsultation,
}: RightFloatingQuickBarProps) {
  const [isMinimized, setIsMinimized] = useState(false);

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
      {/* Main Floating Container (Semi-transparent & Positioned Above Bottom Bar) */}
      <div className="bg-neutral-950/85 backdrop-blur-md opacity-90 hover:opacity-100 border border-neutral-800/80 text-white rounded-3xl p-2 sm:p-2.5 flex flex-col items-center gap-1.5 sm:gap-2 shadow-[0_15px_35px_rgba(0,0,0,0.4)] transition-all duration-300 w-15 sm:w-20">
        
        {/* Top Brand Logo Circular Emblem */}
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden flex items-center justify-center shadow-md my-0.5 shrink-0 border border-amber-400/40 bg-neutral-900">
          <img
            src="https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784785714/120%ED%8C%8C%EC%9D%B4_%EC%BB%A4%ED%94%BC_%EA%B8%88%EC%A0%95%EC%A0%90_%EC%B1%84%EB%84%90%EC%82%AC%EC%9D%B8_%EB%94%94%EC%9E%90%EC%9D%B8_250828_5_1_x8faxl.png"
            alt="120PIE 심볼 로고"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Item 1: 창업문의 */}
        <a
          href="tel:1899-5685"
          className="w-full py-2 px-1 rounded-2xl bg-neutral-900/90 border border-neutral-800/80 hover:bg-[#FBC400] hover:text-neutral-950 hover:border-[#FBC400] transition-all duration-200 flex flex-col items-center justify-center text-center group decoration-none text-neutral-200 cursor-pointer"
          title="창업문의 전화걸기"
        >
          <Phone size={15} className="mb-1 text-[#FBC400] group-hover:text-neutral-950 transition-colors" />
          <span className="text-[9px] sm:text-[10px] font-extrabold leading-tight block">창업문의</span>
          <span className="text-[8px] sm:text-[9px] font-black text-neutral-400 group-hover:text-neutral-900 leading-tight block mt-0.5">
            1899-5685
          </span>
        </a>

        {/* Item 2: 고객상담 */}
        <a
          href="tel:1899-5003"
          className="w-full py-2 px-1 rounded-2xl bg-neutral-900/90 border border-neutral-800/80 hover:bg-[#FBC400] hover:text-neutral-950 hover:border-[#FBC400] transition-all duration-200 flex flex-col items-center justify-center text-center group decoration-none text-neutral-200 cursor-pointer"
          title="고객상담 전화걸기"
        >
          <Phone size={15} className="mb-1 text-[#FBC400] group-hover:text-neutral-950 transition-colors" />
          <span className="text-[9px] sm:text-[10px] font-extrabold leading-tight block">고객상담</span>
          <span className="text-[8px] sm:text-[9px] font-black text-neutral-400 group-hover:text-neutral-900 leading-tight block mt-0.5">
            1899-5003
          </span>
        </a>

        {/* Item 3: 창업상담 신청 */}
        <button
          type="button"
          onClick={handleConsultationClick}
          className="w-full py-2 px-1 rounded-2xl bg-neutral-900/90 border border-neutral-800/80 hover:bg-[#FBC400] hover:text-neutral-950 hover:border-[#FBC400] transition-all duration-200 flex flex-col items-center justify-center text-center group text-neutral-200 cursor-pointer"
          title="창업상담 신청하기"
        >
          <FileText size={15} className="mb-1 text-[#FBC400] group-hover:text-neutral-950 transition-colors" />
          <span className="text-[9px] sm:text-[10px] font-extrabold leading-tight block">창업상담</span>
          <span className="text-[8px] sm:text-[9px] font-semibold text-neutral-400 group-hover:text-neutral-900 leading-tight block mt-0.5">
            신청
          </span>
        </button>

        {/* Item 4: 모바일 상담 */}
        <button
          type="button"
          onClick={handleConsultationClick}
          className="w-full py-2 px-1 rounded-2xl bg-neutral-900/90 border border-neutral-800/80 hover:bg-[#FBC400] hover:text-neutral-950 hover:border-[#FBC400] transition-all duration-200 flex flex-col items-center justify-center text-center group text-neutral-200 cursor-pointer"
          title="모바일 상담"
        >
          <MessageSquare size={15} className="mb-1 text-[#FBC400] group-hover:text-neutral-950 transition-colors" />
          <span className="text-[9px] sm:text-[10px] font-extrabold leading-tight block">모바일</span>
          <span className="text-[8px] sm:text-[9px] font-semibold text-neutral-400 group-hover:text-neutral-900 leading-tight block mt-0.5">
            상담
          </span>
        </button>

        {/* Item 5: 제휴 및 제안 / TOP */}
        <button
          type="button"
          onClick={scrollToTop}
          className="w-full py-2 px-1 rounded-2xl bg-neutral-900/90 border border-neutral-800/80 hover:bg-[#FBC400] hover:text-neutral-950 hover:border-[#FBC400] transition-all duration-200 flex flex-col items-center justify-center text-center group text-neutral-200 cursor-pointer"
          title="맨 위로 이동"
        >
          <ChevronUp size={15} className="mb-0.5 text-[#FBC400] group-hover:text-neutral-950 transition-colors" />
          <span className="text-[9px] sm:text-[10px] font-extrabold leading-tight block">TOP</span>
        </button>

      </div>
    </div>
  );
}
