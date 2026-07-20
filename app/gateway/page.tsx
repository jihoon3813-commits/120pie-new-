"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { optimizeCloudinaryUrl } from "@/app/utils/cloudinary";

export default function GatewayPage() {
  const brandBg = optimizeCloudinaryUrl(
    "https://res.cloudinary.com/dfarfqx7e/image/upload/f_auto,q_auto/v1781184019/120%EA%B2%B9%ED%8C%8C%EC%9D%B4_%ED%81%AC%EB%A6%BC%EC%B9%98%EC%A6%88_%EC%97%B0%EC%B6%9C_ebuddm.jpg"
  );
  const franchiseBg = optimizeCloudinaryUrl(
    "https://res.cloudinary.com/dfkntvpmv/image/upload/f_auto,q_auto/v1783478568/Gemini_Generated_Image_qqo5j2qqo5j2qqo5_n9umlz.jpg"
  );

  return (
    <main className="min-h-screen w-full flex flex-col md:flex-row overflow-hidden bg-neutral-950 font-sans selection:bg-[#8dc63f] selection:text-white">
      {/* BRAND HOME LINK PANEL (LEFT) */}
      <div className="relative flex-1 group overflow-hidden h-[50vh] md:h-screen transition-all duration-700 ease-out">
        {/* Background Image with Hover Scale */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out scale-100 group-hover:scale-105"
          style={{ backgroundImage: `url('${brandBg}')` }}
        />
        {/* Dim overlay */}
        <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors duration-500" />

        {/* Content Wrapper */}
        <div className="relative h-full flex flex-col justify-between p-8 sm:p-12 md:p-16 z-10">
          {/* Logo / Header */}
          <div className="flex items-center gap-2">
            <span className="text-white text-xs font-black tracking-widest uppercase px-3 py-1 bg-white/10 rounded-full backdrop-blur-sm">
              Premium Bakery
            </span>
          </div>

          {/* Texts & Button */}
          <div className="space-y-6 max-w-md">
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">Brand</span>
                <span className="text-4xl sm:text-5xl font-black text-[#8dc63f] uppercase tracking-tight">120PIE</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                120겹파이 브랜드
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-neutral-300 font-semibold leading-relaxed">
              시그니처 페이스트리 파이부터 고품격 음료, 전국 매장 및 최신 브랜드 이벤트를 지금 바로 만나보세요!
            </p>
            <Link
              href="/brand"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#8dc63f] hover:bg-[#7cb432] text-white font-bold text-xs sm:text-sm rounded-full transition-all duration-300 shadow-lg hover:scale-105 active:scale-95 group/btn"
            >
              <span>브랜드 홈페이지</span>
              <ArrowRight size={16} className="transition-transform duration-300 group-hover/btn:translate-x-1" />
            </Link>
          </div>

          {/* Bottom tag */}
          <div className="text-[10px] text-neutral-400 font-bold tracking-widest uppercase">
            © 120PIE Corp. All rights reserved.
          </div>
        </div>
      </div>

      {/* FRANCHISE HOME LINK PANEL (RIGHT) */}
      <div className="relative flex-1 group overflow-hidden h-[50vh] md:h-screen border-t md:border-t-0 md:border-l border-white/10 transition-all duration-700 ease-out">
        {/* Background Image with Hover Scale */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out scale-100 group-hover:scale-105"
          style={{ backgroundImage: `url('${franchiseBg}')` }}
        />
        {/* Dim overlay */}
        <div className="absolute inset-0 bg-black/60 group-hover:bg-black/50 transition-colors duration-500" />

        {/* Content Wrapper */}
        <div className="relative h-full flex flex-col justify-between p-8 sm:p-12 md:p-16 z-10">
          {/* Logo / Header */}
          <div className="flex items-center gap-2">
            <span className="text-white text-xs font-black tracking-widest uppercase px-3 py-1 bg-white/10 rounded-full backdrop-blur-sm">
              Business Opportunities
            </span>
          </div>

          {/* Texts & Button */}
          <div className="space-y-6 max-w-md">
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">Franchise</span>
                <span className="text-4xl sm:text-5xl font-black text-[#8dc63f] uppercase tracking-tight">120PIE</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                120겹파이 창업안내
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-neutral-300 font-semibold leading-relaxed">
              압도적인 매출 시너지와 트렌디한 간편 조리 시스템! 점주님들의 성공 노하우와 창업 세부 가이드를 제공합니다.
            </p>
            <Link
              href="/franchise"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#8dc63f] hover:bg-[#7cb432] text-white font-bold text-xs sm:text-sm rounded-full transition-all duration-300 shadow-lg hover:scale-105 active:scale-95 group/btn"
            >
              <span>창업 홈페이지</span>
              <ArrowRight size={16} className="transition-transform duration-300 group-hover/btn:translate-x-1" />
            </Link>
          </div>

          {/* Bottom tag */}
          <div className="text-[10px] text-neutral-400 font-bold tracking-widest uppercase">
            Start Your Success Story
          </div>
        </div>
      </div>
    </main>
  );
}
