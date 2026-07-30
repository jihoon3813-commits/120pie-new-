"use client";

import React from "react";
import { Phone, Send, Sparkles } from "lucide-react";

interface MobileBottomInquiryBarProps {
  onOpenConsultation?: () => void;
  phoneNo?: string;
  buttonText?: string;
}

export default function MobileBottomInquiryBar({
  onOpenConsultation,
  phoneNo = "1566-3594",
  buttonText = "빠른 창업 상담 신청",
}: MobileBottomInquiryBarProps) {
  const handleConsultClick = () => {
    if (onOpenConsultation) {
      onOpenConsultation();
    } else {
      const target = document.querySelector("#consultation") || document.querySelector("#contact-form");
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-[95] bg-neutral-950/95 backdrop-blur-md px-3 py-2 sm:px-4 sm:py-2.5 border-t border-neutral-800 flex items-center justify-between gap-2 shadow-[0_-10px_30px_rgba(0,0,0,0.6)] select-none">
      {/* Left side: Quick Call Link */}
      <a
        href={`tel:${phoneNo.replace(/[^0-9]/g, "")}`}
        className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-neutral-900 border border-neutral-800 text-neutral-200 hover:text-white transition-colors shrink-0 text-xs font-bold"
      >
        <Phone size={14} className="text-[#fbc400] animate-pulse" />
        <span className="tabular-nums">{phoneNo}</span>
      </a>

      {/* Right side: Primary CTA Button */}
      <button
        type="button"
        onClick={handleConsultClick}
        className="flex-1 py-2.5 px-3 bg-[#fbc400] hover:bg-amber-400 text-neutral-950 font-black text-xs sm:text-sm rounded-md flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all border-0 cursor-pointer whitespace-nowrap"
      >
        <Sparkles size={14} className="fill-neutral-950 shrink-0" />
        <span>{buttonText}</span>
      </button>
    </div>
  );
}
