"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { optimizeCloudinaryUrl } from "@/app/utils/cloudinary";
import CursorFollower from "@/components/CursorFollower";

const BRAND_BG_URL = optimizeCloudinaryUrl(
  "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784705753/ChatGPT_Image_2026%EB%85%84_7%EC%9B%94_22%EC%9D%BC_%EC%98%A4%ED%9B%84_04_35_21_1_vvaugb.png"
);

const FRANCHISE_BG_URL = optimizeCloudinaryUrl(
  "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784705760/ChatGPT_Image_2026%EB%85%84_7%EC%9B%94_22%EC%9D%BC_%EC%98%A4%ED%9B%84_04_35_22_2_mpdbps.png"
);

export default function GatePageClient() {
  const [, setHoveredPanel] = useState<"brand" | "franchise" | null>(null);

  return (
    <main className="h-[100dvh] w-full flex flex-col md:flex-row overflow-hidden bg-black font-sans select-none relative">
      {/* Dynamic Cursor Follower */}
      <CursorFollower />

      {/* BRAND HOME PANEL (TOP on mobile, LEFT on desktop) */}
      <Link
        href="/brand"
        onMouseEnter={() => setHoveredPanel("brand")}
        onMouseLeave={() => setHoveredPanel(null)}
        className="relative flex-1 group overflow-hidden h-[50dvh] md:h-full transition-all duration-700 ease-out block"
      >
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out transform scale-100 group-hover:scale-110"
          style={{ backgroundImage: `url('${BRAND_BG_URL}')` }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/30 group-hover:from-black/75 group-hover:via-black/40 transition-all duration-500" />

        {/* Content Container */}
        <div className="relative h-full flex flex-col justify-center items-start p-5 sm:p-8 md:p-14 lg:p-20 z-10 max-w-2xl text-left">
          <div className="space-y-2 sm:space-y-3 md:space-y-4">
            {/* Category */}
            <span className="text-xs sm:text-sm md:text-2xl font-extrabold text-white tracking-wider block drop-shadow-md uppercase">
              BRAND
            </span>

            {/* Brand Title (Yellow Logo Name) */}
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-black text-[#FFCC00] tracking-tight uppercase block drop-shadow-lg leading-tight">
              120PIE & COFFEE
            </h1>

            {/* Main Headline */}
            <h2 className="text-sm sm:text-lg md:text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
              120겹의 맛, 일상에 특별함을 더하다
            </h2>

            {/* Description */}
            <p className="text-xs sm:text-sm md:text-xl text-neutral-200 font-medium leading-relaxed drop-shadow">
              파이부터 커피·음료까지
              <br className="hidden sm:inline" />
              {" "}120PIE의 다양한 메뉴와 이야기를 만나보세요.
            </p>

            {/* Yellow Button */}
            <div className="pt-1 sm:pt-3">
              <span className="inline-flex items-center gap-2 sm:gap-3 px-5 py-2.5 sm:px-7 sm:py-3.5 bg-[#FFCC00] hover:bg-[#e6b800] text-black font-black text-xs sm:text-base md:text-xl rounded-full shadow-2xl transition-all duration-300 group-hover:bg-[#e6b800]">
                <span>브랜드 홈페이지</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </div>
          </div>
        </div>
      </Link>

      {/* FRANCHISE HOME PANEL (BOTTOM on mobile, RIGHT on desktop) */}
      <Link
        href="/franchise"
        onMouseEnter={() => setHoveredPanel("franchise")}
        onMouseLeave={() => setHoveredPanel(null)}
        className="relative flex-1 group overflow-hidden h-[50dvh] md:h-full transition-all duration-700 ease-out block border-t md:border-t-0 md:border-l border-white/20"
      >
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out transform scale-100 group-hover:scale-110"
          style={{ backgroundImage: `url('${FRANCHISE_BG_URL}')` }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/30 group-hover:from-black/75 group-hover:via-black/40 transition-all duration-500" />

        {/* Content Container */}
        <div className="relative h-full flex flex-col justify-center items-start p-5 sm:p-8 md:p-14 lg:p-20 z-10 max-w-2xl text-left">
          <div className="space-y-2 sm:space-y-3 md:space-y-4">
            {/* Category */}
            <span className="text-xs sm:text-sm md:text-2xl font-extrabold text-white tracking-wider block drop-shadow-md uppercase">
              FRANCHISE
            </span>

            {/* Brand Title (Yellow Logo Name) */}
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-black text-[#FFCC00] tracking-tight uppercase block drop-shadow-lg leading-tight">
              120PIE & COFFEE
            </h1>

            {/* Main Headline */}
            <h2 className="text-sm sm:text-lg md:text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
              작은 공간에서 시작하는 달콤한 성공
            </h2>

            {/* Description */}
            <p className="text-xs sm:text-sm md:text-xl text-neutral-200 font-medium leading-relaxed drop-shadow">
              검증된 메뉴와 간편한 운영 시스템,
              <br className="hidden sm:inline" />
              {" "}120PIE와 함께 성공 창업을 시작하세요.
            </p>

            {/* Yellow Button */}
            <div className="pt-1 sm:pt-3">
              <span className="inline-flex items-center gap-2 sm:gap-3 px-5 py-2.5 sm:px-7 sm:py-3.5 bg-[#FFCC00] hover:bg-[#e6b800] text-black font-black text-xs sm:text-base md:text-xl rounded-full shadow-2xl transition-all duration-300 group-hover:bg-[#e6b800]">
                <span>창업 홈페이지</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </main>
  );
}
