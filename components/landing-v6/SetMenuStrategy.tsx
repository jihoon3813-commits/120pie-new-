"use client";

import { useState } from "react";

interface SetMenuItem {
  title: string;
  description: string;
  image: string;
  badge?: string;
}

export default function SetMenuStrategy() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const strategyPoints = [
    {
      icon: (
        <svg className="w-6 h-6 text-[#081810]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3" />
          <circle cx="12" cy="13" r="2.5" stroke="currentColor" strokeWidth={2} />
          <path d="M10.5 11.5l3 3M13.5 11.5l-3 3" stroke="currentColor" strokeWidth={2} />
        </svg>
      ),
      title: "커피만으로\n차별화가 어려움",
      desc: "수많은 카페 사이에서 아메리카노 한 잔만으로는 독보적인 경쟁력을 확보하기 어렵습니다.",
    },
    {
      icon: (
        <svg className="w-6 h-6 text-[#081810]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      title: "디저트는\n객단가를 높이는 역할",
      desc: "음료 대비 2~3배 높은 프리미엄 디저트를 함께 판매하여 테이블당 매출 효율을 극대화합니다.",
    },
    {
      icon: (
        <svg className="w-6 h-6 text-[#081810]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2zM9 5h6" />
          <rect x="9" y="8" width="6" height="6" rx="0.5" stroke="currentColor" strokeWidth={1.5} />
        </svg>
      ),
      title: "보기 좋은 메뉴는\n배달앱에서도 강함",
      desc: "포장 용이성과 비주얼로 배달의민족, 쿠팡이츠 등 배달 플랫폼에서 높은 재주문율을 기록합니다.",
    },
    {
      icon: (
        <svg className="w-6 h-6 text-[#081810]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 12c0-4.97-4.03-9-9-9s-9 4.03-9 9m18 0a9 9 0 01-9 9m9-9H12v9m0-9L6 6" />
        </svg>
      ),
      title: "120pie는\n커피와 자연스럽게 결합됨",
      desc: "바삭한 페이스트리의 식감과 풍미가 120pie 스페셜티 커피 원두와 가장 완벽한 조화를 이룹니다.",
    },
  ];

  const setMenus: SetMenuItem[] = [
    {
      title: "애플파이 & 커피 세트",
      description: "달콤상콤한 수제 사과 필링이 가득 찬 시그니처 애플파이와 스페셜티 커피의 대표 조합",
      image: "https://res.cloudinary.com/dfkntvpmv/image/upload/f_auto,q_auto/v1783389698/ChatGPT_Image_2026%EB%85%84_7%EC%9B%94_7%EC%9D%BC_%EC%98%A4%EC%A0%84_11_00_01_2_hyoejq.png",
      badge: "대표 메뉴",
    },
    {
      title: "불고기파이 & 커피 세트",
      description: "짭조름하고 육즙 가득한 소불고기 토핑의 파이와 깔끔한 커피가 만나 든든한 한 끼 식사",
      image: "https://res.cloudinary.com/dfkntvpmv/image/upload/f_auto,q_auto/v1783389698/ChatGPT_Image_2026%EB%85%84_7%EC%9B%94_7%EC%9D%BC_%EC%98%A4%EC%A0%84_11_00_02_4_ghxfkj.png",
      badge: "든든 한끼",
    },
    {
      title: "페페로니 피자파이 & 커피 세트",
      description: "매콤짭짤한 페페로니와 치즈의 풍부한 하모니가 아메리카노와 완벽하게 어우러지는 세트",
      image: "https://res.cloudinary.com/dfkntvpmv/image/upload/f_auto,q_auto/v1783389698/ChatGPT_Image_2026%EB%85%84_7%EC%9B%94_7%EC%9D%BC_%EC%98%A4%EC%A0%84_11_00_02_3_vdgyqf.png",
      badge: "인기 세트",
    },
    {
      title: "감자베이컨 피자파이 & 커피 세트",
      description: "부드러운 감자 샐러드와 베이컨의 풍성한 식감에 향긋한 스페셜티 원두가 선사하는 미식",
      image: "https://res.cloudinary.com/dfkntvpmv/image/upload/f_auto,q_auto/v1783389698/ChatGPT_Image_2026%EB%85%84_7%EC%9B%94_7%EC%9D%BC_%EC%98%A4%EC%A0%84_11_00_01_1_d5qe4q.png",
      badge: "강력 추천",
    },
  ];

  return (
    <section className="py-10 sm:py-24 bg-[#FFB800] text-neutral-900 transition-colors duration-300 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-16 items-start">
          
          {/* Left Column: Market Strategy Analysis */}
          <div className="lg:col-span-5 space-y-4 sm:space-y-8 text-left">
            <div className="space-y-2 sm:space-y-4">
              <span className="inline-block text-xs sm:text-sm font-black uppercase tracking-widest text-amber-950 bg-white/30 px-4 py-1.5 rounded-full">
                Market Insight
              </span>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-[1.2] text-neutral-950">
                커피 시장은
                <br />
                이미 치열합니다
              </h2>
              <div className="h-1.5 w-16 bg-[#081810] rounded-full" />
              <p className="text-lg sm:text-xl font-bold text-neutral-800 leading-relaxed whitespace-pre-line pt-2">
                이제 필요한 건 한 잔을 더 파는 경쟁이 아니라
                <br />
                <span className="text-[#081810] font-black underline decoration-2 underline-offset-4">함께 팔리는 메뉴</span>를 만드는 전략입니다.
              </p>
            </div>

            {/* 2x2 Grid of 4 Key Point Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {strategyPoints.map((item, idx) => (
                <div 
                  key={idx}
                  className="bg-white/95 rounded-2xl p-5 border border-amber-200/50 shadow-sm space-y-3 hover:shadow-md transition-all duration-300"
                >
                  <div className="p-2.5 bg-amber-500/10 rounded-xl w-fit">
                    {item.icon}
                  </div>
                  <h3 className="text-base sm:text-lg font-black leading-snug text-neutral-950 whitespace-pre-line">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm font-bold text-neutral-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: 1x4 Large Set Menu Showcase List */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Right Sub Header */}
            <div className="text-left space-y-2 pb-2 border-b border-[#081810]/10">
              <span className="text-xs font-black uppercase tracking-widest text-[#081810]/70">
                120pie Signature Set Menu (1x4 Stack)
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-[#081810]">
                매출 상승을 견인하는 디저트 & 커피 세트
              </h3>
            </div>

            {/* 1x4 Vertical Cards Stack */}
            <div className="grid grid-cols-1 gap-5">
              {setMenus.map((menu, index) => (
                <div
                  key={index}
                  className="group bg-white rounded-3xl overflow-hidden hover:shadow-xl border border-amber-200/40 transition-all duration-300 flex flex-col sm:flex-row items-center p-4 sm:p-5 gap-5"
                >
                  {/* Left: Large Image Container with Zoom effect */}
                  <div className="relative w-full sm:w-52 aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-100 flex-shrink-0 shadow-inner">
                    <img
                      src={menu.image}
                      alt={menu.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {menu.badge && (
                      <span className="absolute top-3 left-3 bg-[#081810] text-white font-black text-[9px] sm:text-xs px-2.5 py-0.5 rounded-md shadow-sm">
                        {menu.badge}
                      </span>
                    )}
                  </div>

                  {/* Right: Text Content & View Large Button */}
                  <div className="flex-grow text-left space-y-3">
                    <div>
                      <h4 className="text-lg sm:text-xl font-bold text-neutral-950">
                        {menu.title}
                      </h4>
                      <p className="text-sm font-semibold text-neutral-600 leading-relaxed mt-1">
                        {menu.description}
                      </p>
                    </div>
                    {/* View Large Button */}
                    <button
                      onClick={() => setSelectedImage(menu.image)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#081810] text-white rounded-xl text-xs font-bold hover:bg-neutral-800 transition-colors shadow-sm cursor-pointer"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <span>크게보기</span>
                    </button>
                  </div>

                </div>
              ))}
            </div>

          </div>

        </div>

      </div>

      {/* Image Lightbox Modal */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 cursor-zoom-out animate-fade-in"
        >
          {/* Modal Container */}
          <div className="relative max-w-5xl max-h-[90vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-colors cursor-pointer"
              title="닫기"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Original Aspect Image */}
            <img
              src={selectedImage}
              alt="Set Menu Detail"
              className="rounded-3xl shadow-2xl max-w-full max-h-[80vh] object-contain border border-white/10 select-none animate-zoom-in"
            />
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
