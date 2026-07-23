"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { optimizeCloudinaryUrl } from "@/app/utils/cloudinary";

const SLIDE_DATA = [
  {
    id: 1,
    bgImg: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784532213/ChatGPT_Image_2026%EB%85%84_7%EC%9B%94_20%EC%9D%BC_%EC%98%A4%ED%9B%84_04_23_09_pfhcbt.png",
    subTitle: "힐링 먹거리 공간! 좋은 재료, 편안하고 깨끗한 이미지",
    mainTitle: "감각적인 카페형 프리미엄 인테리어",
    desc: "전문점의 공간 활용도를 높인 카운터 일체화, 편안하고 모던한 느낌의 공간 그리고 건강을 먼저 생각하는 청결한 브랜드 이미지를 위한 화이트&골드 옐로 컬러를 사용하였습니다."
  },
  {
    id: 2,
    bgImg: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784532165/ChatGPT_Image_2026%EB%85%84_7%EC%9B%94_20%EC%9D%BC_%EC%98%A4%ED%9B%84_04_22_32_hbcsfy.png",
    subTitle: "안정적인 동선과 레이아웃! 효율적인 공간 분할 설계",
    mainTitle: "차별화된 트렌디한 공간 디자인",
    desc: "가구 배치와 부드러운 간접 조명을 활용하여 아늑함을 극대화하고, 1인 창업주분들도 손쉽게 동선을 유지할 수 있는 주방 테이크아웃 설계를 적용했습니다."
  },
  {
    id: 3,
    bgImg: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784532102/ChatGPT_Image_2026%EB%85%84_7%EC%9B%94_20%EC%9D%BC_%EC%98%A4%ED%9B%84_04_21_27_ipd6zv.png",
    subTitle: "고품격 베이커리 쇼케이스! 위생과 시각적 즐거움의 결합",
    mainTitle: "오감이 즐거운 오픈형 키친 레이아웃",
    desc: "엄선된 위생적인 스테인리스 마감재와 따뜻한 전구색 핀조명의 앙상블로 매장에 들어서는 순간 신선한 파이 향과 시각적인 자극을 동시에 제공합니다."
  },
  {
    id: 4,
    bgImg: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784532214/ChatGPT_Image_2026%EB%85%84_7%EC%9B%94_20%EC%9D%BC_%EC%98%A4%ED%9B%84_04_23_22_cmy4tk.png",
    subTitle: "네추럴 오드 우드 앤 크림! 온 가족이 머무는 안식처",
    mainTitle: "내추럴 빈티지 감성의 친환경 자재 마감",
    desc: "자연 친화적인 무늬목 패턴 소재와 친환경 수성 도장 마감 기법으로 장시간 앉아 대화를 나누어도 피로감 없이 안락하고 쾌적한 친환경 에코 홀을 지향합니다."
  }
];

const COLLAGE_IMAGES = [
  {
    id: 1, // 좌상 (1:1)
    url: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784531933/ChatGPT_Image_2026%EB%85%84_7%EC%9B%94_20%EC%9D%BC_%EC%98%A4%ED%9B%84_04_18_15_spjlr7.png"
  },
  {
    id: 2, // 좌하 (1:1)
    url: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784531729/ChatGPT_Image_2026%EB%85%84_7%EC%9B%94_20%EC%9D%BC_%EC%98%A4%ED%9B%84_03_50_21_1_i1143w.png"
  },
  {
    id: 3, // 중 (1:2 세로)
    url: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784531729/ChatGPT_Image_2026%EB%85%84_7%EC%9B%94_20%EC%9D%BC_%EC%98%A4%ED%9B%84_04_04_04_1_gcir9s.png"
  },
  {
    id: 4, // 우상 (2:1 가로)
    url: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784531731/ChatGPT_Image_2026%EB%85%84_7%EC%9B%94_20%EC%9D%BC_%EC%98%A4%ED%9B%84_04_06_57_rfpopj.png"
  },
  {
    id: 5, // 우하좌 (1:1)
    url: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784531729/ChatGPT_Image_2026%EB%85%84_7%EC%9B%94_20%EC%9D%BC_%EC%98%A4%ED%9B%84_03_50_44_1_twcqvq.png"
  },
  {
    id: 6, // 우하우 (1:1)
    url: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784531729/ChatGPT_Image_2026%EB%85%84_7%EC%9B%94_20%EC%9D%BC_%EC%98%A4%ED%9B%84_03_58_01_1_sfro7i.png"
  }
];

export default function InteriorConcept() {
  const [currentIdx, setCurrentIdx] = useState(0);

  // Auto slide effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % SLIDE_DATA.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrentIdx((prev) => (prev - 1 + SLIDE_DATA.length) % SLIDE_DATA.length);
  };

  const handleNext = () => {
    setCurrentIdx((prev) => (prev + 1) % SLIDE_DATA.length);
  };

  return (
    <section className="relative bg-white dark:bg-neutral-950 pt-0 pb-28 overflow-hidden">
      
      {/* 1. TOP WIDE SLIDER AREA */}
      <div className="w-full relative h-[550px] sm:h-[500px] lg:h-[520px] bg-neutral-900 overflow-hidden isolate" style={{ transform: "translateZ(0)" }}>
        
        {/* Top Wavy Overlay (renders preceding Instagram section background color #fafafa) */}
        <div className="absolute top-[-2px] left-0 w-full overflow-hidden leading-none z-30 pointer-events-none">
          <svg viewBox="0 0 1200 100" preserveAspectRatio="none" className="relative block w-full h-[24px] sm:h-[40px] lg:h-[55px] fill-[#fafafa] dark:fill-neutral-950">
            <path d="M 0 50 Q 25 10, 50 50 Q 75 90, 100 50 Q 125 10, 150 50 Q 175 90, 200 50 Q 225 10, 250 50 Q 275 90, 300 50 Q 325 10, 350 50 Q 375 90, 400 50 Q 425 10, 450 50 Q 475 90, 500 50 Q 525 10, 550 50 Q 575 90, 600 50 Q 625 10, 650 50 Q 675 90, 700 50 Q 725 10, 750 50 Q 775 90, 800 50 Q 825 10, 850 50 Q 875 90, 900 50 Q 925 10, 950 50 Q 975 90, 1000 50 Q 1025 10, 1050 50 Q 1075 90, 1100 50 Q 1125 10, 1150 50 Q 1175 90, 1200 50 L 1200 0 L 0 0 Z" />
          </svg>
        </div>

        {/* Background images */}
        {SLIDE_DATA.map((slide, idx) => {
          const isActive = idx === currentIdx;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out ${
                isActive ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
              }`}
              style={{ backgroundImage: `url('${optimizeCloudinaryUrl(slide.bgImg)}')` }}
            >
              {/* Dim layer */}
              <div className="absolute inset-0 bg-black/65" />
            </div>
          );
        })}

        {/* Content Overlay */}
        <div className="absolute inset-0 flex items-center pt-16 sm:pt-20">
          <div className="max-w-[1300px] mx-auto w-full px-6 grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            
            {/* Left side: Main Title & subtext */}
            <div className="space-y-3.5">
              <p className="text-[#fbc400] font-black text-xs sm:text-sm tracking-tight drop-shadow-sm">
                {SLIDE_DATA[currentIdx].subTitle}
              </p>
              <h2 className="text-white text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                {SLIDE_DATA[currentIdx].mainTitle.split(" ").map((word, i) => (
                  <span key={i} className={word.includes("인테리어") || word.includes("공간") ? "text-[#fbc400]" : ""}>
                    {word}{" "}
                  </span>
                ))}
              </h2>
            </div>

            {/* Right side: Detailed Description */}
            <div className="flex items-center">
              <p className="text-neutral-300 font-semibold text-xs sm:text-sm leading-relaxed max-w-lg">
                {SLIDE_DATA[currentIdx].desc}
              </p>
            </div>

          </div>
        </div>

      </div>

      {/* 2. THUMBNAIL SLIDER NAVIGATOR BAR */}
      <div className="bg-[#8dc63f] dark:bg-[#7cb62f] w-full h-[64px] flex items-center relative z-20 shadow-md">
        <div className="max-w-[1300px] mx-auto w-full px-4 flex justify-between items-center h-full">
          
          {/* Left Arrow Button */}
          <button 
            onClick={handlePrev} 
            className="p-1.5 hover:bg-black/10 rounded-full text-white transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6 stroke-[3]" />
          </button>

          {/* Thumbnail track wrapper */}
          <div className="flex-1 mx-4 flex gap-2 sm:gap-3 justify-center items-center overflow-hidden h-full py-2">
            {SLIDE_DATA.map((slide, idx) => {
              const isActive = idx === currentIdx;
              return (
                <button
                  key={slide.id}
                  onClick={() => setCurrentIdx(idx)}
                  className={`w-[60px] sm:w-[80px] md:w-[100px] h-full rounded overflow-hidden border-2 transition-all duration-300 relative shrink-0 ${
                    isActive ? "border-[#fbc400] scale-102 shadow-sm" : "border-transparent opacity-65 hover:opacity-100"
                  }`}
                >
                  <img
                    src={optimizeCloudinaryUrl(slide.bgImg)}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              );
            })}
          </div>

          {/* Right Arrow Button */}
          <button 
            onClick={handleNext} 
            className="p-1.5 hover:bg-black/10 rounded-full text-white transition-colors cursor-pointer"
          >
            <ChevronRight className="w-6 h-6 stroke-[3]" />
          </button>

        </div>
      </div>

      {/* 3. BOTTOM COLLAGE IMAGE GRID (1300px Max-Width) */}
      <div className="max-w-[1300px] mx-auto w-full px-4 mt-12 sm:mt-16">
        {/* MOBILE GRID (인테리어 2열, 간판 1열) */}
        <div className="grid grid-cols-2 gap-3 md:hidden">
          {/* 인테리어 사진 1 & 2 (2열) */}
          <div className="aspect-square overflow-hidden shadow-sm relative bg-neutral-900">
            <img
              src={optimizeCloudinaryUrl(COLLAGE_IMAGES[0].url)}
              alt="120겹파이 내부 인테리어 테이블"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="aspect-square overflow-hidden shadow-sm relative bg-neutral-900">
            <img
              src={optimizeCloudinaryUrl(COLLAGE_IMAGES[1].url)}
              alt="120겹파이 주방 쇼케이스 카운터"
              className="w-full h-full object-cover"
            />
          </div>

          {/* 건물 매장 정면 파사드 간판 (1열 - col-span-2) */}
          <div className="col-span-2 aspect-[4/3] overflow-hidden shadow-sm relative bg-neutral-900">
            <img
              src={optimizeCloudinaryUrl(COLLAGE_IMAGES[2].url)}
              alt="120겹파이 매장 정면 파사드 간판 전경"
              className="w-full h-full object-cover"
            />
          </div>

          {/* 돌출 채널 간판 (1열 - col-span-2) */}
          <div className="col-span-2 aspect-[2/1] overflow-hidden shadow-sm relative bg-neutral-900">
            <img
              src={optimizeCloudinaryUrl(COLLAGE_IMAGES[3].url)}
              alt="120겹파이 돌출 채널간판"
              className="w-full h-full object-cover"
            />
          </div>

          {/* 인테리어 사진 3 & 4 (2열) */}
          <div className="aspect-square overflow-hidden shadow-sm relative bg-neutral-900">
            <img
              src={optimizeCloudinaryUrl(COLLAGE_IMAGES[4].url)}
              alt="120겹파이 홀 안락한 손님 테이블존"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="aspect-square overflow-hidden shadow-sm relative bg-neutral-900">
            <img
              src={optimizeCloudinaryUrl(COLLAGE_IMAGES[5].url)}
              alt="120겹파이 모던 주방 및 퇴식대 전경"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* DESKTOP COLLAGE GRID (hidden md:flex) */}
        <div className="hidden md:flex flex-col md:flex-row gap-4 w-full items-stretch">
          
          {/* Column 1: Two vertically stacked square images */}
          <div className="w-full md:w-1/4 flex flex-col gap-4">
            <div className="w-full aspect-square rounded-none overflow-hidden isolate shadow-md relative bg-neutral-900 group" style={{ transform: "translateZ(0)" }}>
              <img
                src={optimizeCloudinaryUrl(COLLAGE_IMAGES[0].url)}
                alt="120겹파이 내부 인테리어 테이블"
                className="w-full h-full object-cover transition-transform duration-750 group-hover:scale-104"
              />
            </div>
            <div className="w-full aspect-square rounded-none overflow-hidden isolate shadow-md relative bg-neutral-900 group" style={{ transform: "translateZ(0)" }}>
              <img
                src={optimizeCloudinaryUrl(COLLAGE_IMAGES[1].url)}
                alt="120겹파이 주방 쇼케이스 카운터"
                className="w-full h-full object-cover transition-transform duration-750 group-hover:scale-104"
              />
            </div>
          </div>

          {/* Column 2: Long vertical entryway facade image (stretches to column 1 height) */}
          <div className="w-full md:w-1/4 flex">
            <div className="w-full h-full rounded-none overflow-hidden isolate shadow-md relative bg-neutral-900 group" style={{ transform: "translateZ(0)" }}>
              <img
                src={optimizeCloudinaryUrl(COLLAGE_IMAGES[2].url)}
                alt="120겹파이 매장 정면 파사드 간판 전경"
                className="w-full h-full object-cover transition-transform duration-750 group-hover:scale-104"
              />
            </div>
          </div>

          {/* Column 3 & 4 (Right half): Upper landscape + Lower split side-by-side square images */}
          <div className="w-full md:w-2/4 flex flex-col gap-4">

            {/* Upper: Long landscape bar sign (stretches dynamically) */}
            <div className="w-full aspect-[2/1] md:aspect-auto md:flex-1 min-h-[220px] rounded-none overflow-hidden isolate shadow-md relative bg-neutral-900 group" style={{ transform: "translateZ(0)" }}>
              <img
                src={optimizeCloudinaryUrl(COLLAGE_IMAGES[3].url)}
                alt="120겹파이 돌출 채널간판"
                className="w-full h-full object-cover transition-transform duration-750 group-hover:scale-104"
              />
            </div>

            {/* Lower: Twin square layouts */}
            <div className="flex gap-4 w-full">
              <div className="flex-1 aspect-square rounded-none overflow-hidden isolate shadow-md relative bg-neutral-900 group" style={{ transform: "translateZ(0)" }}>
                <img
                  src={optimizeCloudinaryUrl(COLLAGE_IMAGES[4].url)}
                  alt="120겹파이 홀 안락한 손님 테이블존"
                  className="w-full h-full object-cover transition-transform duration-750 group-hover:scale-104"
                />
              </div>
              <div className="flex-1 aspect-square rounded-none overflow-hidden isolate shadow-md relative bg-neutral-900 group" style={{ transform: "translateZ(0)" }}>
                <img
                  src={optimizeCloudinaryUrl(COLLAGE_IMAGES[5].url)}
                  alt="120겹파이 모던 주방 및 퇴식대 전경"
                  className="w-full h-full object-cover transition-transform duration-750 group-hover:scale-104"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
