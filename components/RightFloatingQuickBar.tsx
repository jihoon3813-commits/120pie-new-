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
    <div className="fixed right-3 sm:right-5 top-1/2 -translate-y-1/2 z-[90] flex flex-col items-end select-none">
      {/* Main Floating Container */}
      <div className="bg-neutral-950/95 backdrop-blur-md border border-neutral-800 text-white rounded-3xl p-2 sm:p-2.5 flex flex-col items-center gap-1.5 sm:gap-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-300 w-16 sm:w-20">
        
        {/* Top Brand Logo Circular Emblem */}
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#FBC400] flex items-center justify-center shadow-md my-0.5 shrink-0 border border-[#FBC400]/50">
          <span className="font-black text-[#0D233A] text-[10px] sm:text-xs tracking-tighter leading-tight text-center">
            120<br />PIE
          </span>
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
