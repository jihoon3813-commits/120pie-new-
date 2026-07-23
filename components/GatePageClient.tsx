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
    <main className="min-h-screen w-full flex flex-col md:flex-row overflow-hidden bg-black font-sans select-none relative">
      {/* Dynamic Cursor Follower (Pie icon follows next to standard mouse cursor) */}
      <CursorFollower />

      {/* BRAND HOME PANEL (LEFT) */}
      <Link
        href="/brand"
        onMouseEnter={() => setHoveredPanel("brand")}
        onMouseLeave={() => setHoveredPanel(null)}
        className="relative flex-1 group overflow-hidden h-[50vh] md:h-screen transition-all duration-700 ease-out block"
      >
        {/* Background Image with Hover Scale Effect ONLY on Image */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out transform scale-100 group-hover:scale-110"
          style={{ backgroundImage: `url('${BRAND_BG_URL}')` }}
        />
        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/20 group-hover:from-black/70 group-hover:via-black/35 transition-all duration-500" />

        {/* Content Container: Centered Vertically, Left-Aligned Horizontally */}
        <div className="relative h-full flex flex-col justify-center items-start p-8 sm:p-12 md:p-16 lg:p-20 z-10 max-w-2xl text-left">
          <div className="space-y-4">
            {/* Category */}
            <span className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-wider block drop-shadow-md uppercase">
              BRAND
            </span>

            {/* Brand Title (Yellow) */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-[#FFCC00] tracking-tight uppercase block drop-shadow-lg leading-tight">
              120PIE & COFFEE
            </h1>

            {/* Main Headline */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight drop-shadow-md">
              120겹의 맛, 일상에 특별함을 더하다
            </h2>

            {/* Description */}
            <p className="text-base sm:text-lg md:text-xl text-neutral-100 font-semibold leading-relaxed drop-shadow">
              파이부터 커피·음료까지
              <br />
              120PIE의 다양한 메뉴와 이야기를 만나보세요.
            </p>

            {/* Yellow Button */}
            <div className="pt-4">
              <span className="inline-flex items-center gap-3 px-8 py-4 bg-[#FFCC00] hover:bg-[#e6b800] text-black font-black text-base sm:text-lg md:text-xl rounded-full shadow-2xl transition-all duration-300 group-hover:bg-[#e6b800]">
                <span>브랜드 홈페이지</span>
                <ArrowRight className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </div>
          </div>
        </div>
      </Link>

      {/* FRANCHISE HOME PANEL (RIGHT) */}
      <Link
        href="/franchise"
        onMouseEnter={() => setHoveredPanel("franchise")}
        onMouseLeave={() => setHoveredPanel(null)}
        className="relative flex-1 group overflow-hidden h-[50vh] md:h-screen transition-all duration-700 ease-out block border-t md:border-t-0 md:border-l border-white/10"
      >
        {/* Background Image with Hover Scale Effect ONLY on Image */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out transform scale-100 group-hover:scale-110"
          style={{ backgroundImage: `url('${FRANCHISE_BG_URL}')` }}
        />
        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/20 group-hover:from-black/70 group-hover:via-black/35 transition-all duration-500" />

        {/* Content Container: Centered Vertically, Left-Aligned Horizontally */}
        <div className="relative h-full flex flex-col justify-center items-start p-8 sm:p-12 md:p-16 lg:p-20 z-10 max-w-2xl text-left">
          <div className="space-y-4">
            {/* Category */}
            <span className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-wider block drop-shadow-md uppercase">
              FRANCHISE
            </span>

            {/* Brand Title (Yellow) */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-[#FFCC00] tracking-tight uppercase block drop-shadow-lg leading-tight">
              120PIE & COFFEE
            </h1>

            {/* Main Headline */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight drop-shadow-md">
              작은 공간에서 시작하는 달콤한 성공
            </h2>

            {/* Description */}
            <p className="text-base sm:text-lg md:text-xl text-neutral-100 font-semibold leading-relaxed drop-shadow">
              검증된 메뉴와 간편한 운영 시스템,
              <br />
              120PIE와 함께 성공 창업을 시작하세요.
            </p>

            {/* Yellow Button */}
            <div className="pt-4">
              <span className="inline-flex items-center gap-3 px-8 py-4 bg-[#FFCC00] hover:bg-[#e6b800] text-black font-black text-base sm:text-lg md:text-xl rounded-full shadow-2xl transition-all duration-300 group-hover:bg-[#e6b800]">
                <span>창업 홈페이지</span>
                <ArrowRight className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </main>
  );
}
