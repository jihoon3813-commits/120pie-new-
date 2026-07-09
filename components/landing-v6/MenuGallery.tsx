"use client";

import { useState } from "react";
import Link from "next/link";
import { MENU_DATA } from "@/app/constants/menu";
import { optimizeCloudinaryUrl } from "@/app/utils/cloudinary";

const categoryLabels: Record<string, { label: string; param: string }> = {
  "120겹파이": { label: "120겹 파이", param: "pie" },
  "에그120": { label: "에그120 계란빵", param: "egg" },
  "기타": { label: "츄러스 & 사이드", param: "side" },
  "coffee120": { label: "커피 & 음료", param: "coffee" },
  "스콘/머핀/쿠키": { label: "스콘 & 머핀 & 쿠키", param: "bakery" },
  "크로플/마카롱": { label: "크로플 & 마카롱", param: "croffle" },
};

export default function MenuGallery() {
  const categories = Object.keys(MENU_DATA);
  const [activeTab, setActiveTab] = useState<string>(categories[0] || "120겹파이");

  const currentCategory = MENU_DATA[activeTab];
  // Limit to 8 items on the landing page preview for performance and design neatness
  const previewItems = currentCategory?.items.slice(0, 8) || [];

  const getBadgeClasses = (badge: string) => {
    switch (badge) {
      case "ORIGINAL":
      case "대표":
        return "bg-emerald-500/10 border border-emerald-500/30 text-emerald-750";
      case "MEAT":
      case "인기":
        return "bg-rose-500/10 border border-rose-500/30 text-rose-700";
      case "PIZZA":
      case "추천":
        return "bg-amber-500/10 border border-amber-500/30 text-amber-800";
      case "NEW":
      case "신메뉴":
        return "bg-neutral-950 text-white font-black";
      default:
        return "bg-neutral-100 text-neutral-600 border border-neutral-200";
    }
  };

  const getTagClasses = (tag: string) => {
    if (tag === "HIT" || tag === "매콤달콤") {
      return "bg-rose-600 text-white";
    }
    if (tag === "추천") {
      return "bg-blue-600 text-white";
    }
    return "bg-emerald-600 text-white";
  };

  return (
    <section id="menu" className="py-10 sm:py-24 bg-[#FFB800] text-neutral-900 relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-16 space-y-4">
          <span className="text-xs font-black text-amber-950 uppercase tracking-widest bg-white/40 px-4 py-1.5 rounded-full inline-block">
            Signature Menu
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            120겹의 달콤하고 든든한 행복
          </h2>
          <p className="text-base sm:text-lg font-bold text-white/90 leading-relaxed max-w-xl mx-auto">
            디저트부터 한 끼 식사까지, 매일 매장에서 신선하게 구워내는 120pie의 다양한 대표 메뉴들을 만나보세요.
          </p>
        </div>

        {/* Tab Buttons Container (Supports horizontal scroll on mobile) */}
        <div className="flex justify-center mb-8 sm:mb-12">
          <div className="inline-flex p-1.5 bg-amber-950/15 rounded-2xl max-w-full overflow-x-auto scrollbar-none space-x-1 border border-amber-900/10">
            {categories.map((catId) => {
              const info = categoryLabels[catId] || { label: catId, param: catId };
              const isActive = activeTab === catId;
              return (
                <button
                  key={catId}
                  onClick={() => setActiveTab(catId)}
                  className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "bg-white text-neutral-950 shadow-sm font-extrabold"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  {info.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid Showcase - Adjusted to 2 columns on mobile */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-8">
          {previewItems.map((item, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-amber-200/40 hover:border-amber-400/60 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              {/* Product Image Container */}
              <div className={`relative aspect-square overflow-hidden bg-neutral-50 flex items-center justify-center p-3 sm:p-6 transition-all ${
                item.name.includes("컵팥빙수") ? "p-6 sm:p-10" : "p-3 sm:p-6"
              }`}>
                <img
                  src={optimizeCloudinaryUrl(item.img)}
                  alt={item.name}
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Badge Left */}
                {item.badge && (
                  <span className={`absolute top-2.5 left-2.5 px-1.5 py-0.5 rounded-md text-[8px] sm:text-[10px] font-black tracking-wide shadow-sm z-10 ${
                    getBadgeClasses(item.badge)
                  }`}>
                    {item.badge}
                  </span>
                )}

                {/* Tag Right */}
                {item.tag && (
                  <span className={`absolute top-2.5 right-2.5 px-1 py-0.5 rounded text-[7px] sm:text-[9px] font-black tracking-wider uppercase shadow-sm z-10 ${
                    getTagClasses(item.tag)
                  }`}>
                    {item.tag}
                  </span>
                )}
              </div>

              {/* Product Info */}
              <div className="p-3.5 sm:p-6 flex-1 flex flex-col justify-between space-y-1.5 text-left bg-white">
                <div className="space-y-1">
                  <h3 className="text-sm sm:text-lg font-bold text-neutral-955 group-hover:text-amber-600 transition-colors line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-neutral-600 leading-snug sm:leading-relaxed min-h-[2rem] sm:min-h-[3rem] line-clamp-2">
                    {item.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-16">
          <Link
            href={`/landing-v6/menu?tab=${categoryLabels[activeTab]?.param || "pie"}`}
            className="inline-flex items-center space-x-2 px-8 py-4 rounded-full text-sm font-bold text-white bg-neutral-950 hover:bg-neutral-900 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <span>{categoryLabels[activeTab]?.label || activeTab} 전체 메뉴 보러가기</span>
            <svg
              className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>

      </div>
    </section>
  );
}
