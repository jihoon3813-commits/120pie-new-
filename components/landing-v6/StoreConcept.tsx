"use client";

import { optimizeCloudinaryUrl } from "@/app/utils/cloudinary";

export default function StoreConcept() {
  return (
    <section className="relative bg-[#FFF5D1] dark:bg-[#1A1813] pt-24 pb-28 sm:pt-32 sm:pb-36 overflow-hidden text-neutral-900 transition-colors duration-300">
      
      {/* Top Wavy transition from OperationSystem (Transparent top overlay) */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none z-10 -translate-y-[1px]">
        <svg viewBox="0 0 1200 100" preserveAspectRatio="none" className="relative block w-full h-[24px] sm:h-[40px] lg:h-[55px]">
          <path
            d="M 0 50 Q 25 10, 50 50 Q 75 90, 100 50 Q 125 10, 150 50 Q 175 90, 200 50 Q 225 10, 250 50 Q 275 90, 300 50 Q 325 10, 350 50 Q 375 90, 400 50 Q 425 10, 450 50 Q 475 90, 500 50 Q 525 10, 550 50 Q 575 90, 600 50 Q 625 10, 650 50 Q 675 90, 700 50 Q 725 10, 750 50 Q 775 90, 800 50 Q 825 10, 850 50 Q 875 90, 900 50 Q 925 10, 950 50 Q 975 90, 1000 50 Q 1025 10, 1050 50 Q 1075 90, 1100 50 Q 1125 10, 1150 50 Q 1175 90, 1200 50 L 1200 100 L 0 100 Z"
            fill="currentColor"
            className="text-[#FFF5D1] dark:text-[#1A1813]"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        
        {/* Header Layout: Large text and Logo side-by-side on desktop */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12 text-left">
          <div className="space-y-2.5 max-w-3xl">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-[0.98] text-neutral-900 dark:text-amber-50">
              시선을 사로잡는
              <br />
              <span className="text-[#8C6239] dark:text-amber-400">머무르고 싶은 공간</span>
            </h2>
            <p className="text-base sm:text-lg font-bold text-neutral-800 dark:text-neutral-300 leading-tight whitespace-pre-line pt-1">
              작은 공간도 밀도 높은 브랜드 경험이 필요합니다.
              {"\n"}
              인테리어, 소품, 패키지까지 하나의 톤앤매너로 일관되게 전달됩니다.
            </p>
          </div>
          
          {/* Logo Brand Title */}
          <div className="flex flex-col items-start md:items-end border-l-2 md:border-l-0 md:border-r-2 border-neutral-950/10 dark:border-white/10 pl-4 md:pl-0 md:pr-4 py-1">
            <span className="text-lg sm:text-xl font-black tracking-tight text-[#8C6239] dark:text-amber-400">
              120pie & coffee
            </span>
            <span className="text-[10px] font-black uppercase tracking-wider text-neutral-700 dark:text-neutral-400">
              120 Layer Pie & Coffee
            </span>
          </div>
        </div>

        {/* 1. Large Main Storefront Image Slot */}
        <div className="relative w-full aspect-[2/1] sm:aspect-[2.39/1] bg-neutral-100 rounded-[32px] overflow-hidden shadow-md mb-8 select-none">
          <img
            src={optimizeCloudinaryUrl("https://res.cloudinary.com/dfkntvpmv/image/upload/f_auto,q_auto/v1783479933/ChatGPT_Image_2026%EB%85%84_7%EC%9B%94_8%EC%9D%BC_%EC%98%A4%ED%9B%84_12_05_25_blj0ay.png")}
            alt="120pie Coffee Storefront"
            className="w-full h-full object-cover pointer-events-none"
          />
        </div>

        {/* 2. 3 Columns of smaller cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div className="bg-white/75 dark:bg-neutral-900/75 rounded-[28px] p-5 border border-[#8C6239]/10 dark:border-amber-700/10 shadow-sm text-left flex flex-col justify-between hover:shadow-md transition-all duration-300">
            <div>
              <div className="aspect-[16/10] w-full bg-neutral-100 dark:bg-neutral-800 rounded-xl overflow-hidden mb-4 select-none">
                <img
                  src={optimizeCloudinaryUrl("https://res.cloudinary.com/dfkntvpmv/image/upload/f_auto,q_auto/v1783478502/ChatGPT_Image_2026%EB%85%84_6%EC%9B%94_11%EC%9D%BC_%EC%98%A4%EC%A0%84_11_15_03_6_tiqnqw.png")}
                  alt="감성을 담은 아늑한 인테리어"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg font-black text-neutral-955 dark:text-amber-50">
                감성을 담은 아늑한 인테리어
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-neutral-600 dark:text-neutral-400 mt-1">
                브랜드 아이덴티티가 깃든 편안하고 품격 있는 공간 분위기
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white/75 dark:bg-neutral-900/75 rounded-[28px] p-5 border border-[#8C6239]/10 dark:border-amber-700/10 shadow-sm text-left flex flex-col justify-between hover:shadow-md transition-all duration-300">
            <div>
              <div className="aspect-[16/10] w-full bg-neutral-100 dark:bg-neutral-800 rounded-xl overflow-hidden mb-4 select-none">
                <img
                  src={optimizeCloudinaryUrl("https://res.cloudinary.com/dfkntvpmv/image/upload/f_auto,q_auto/v1783478568/Gemini_Generated_Image_qqo5j2qqo5j2qqo5_n9umlz.jpg")}
                  alt="오감으로 즐기는 베이킹 쇼케이스"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg font-black text-neutral-955 dark:text-amber-50">
                오감으로 즐기는 베이킹 쇼케이스
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-neutral-600 dark:text-neutral-400 mt-1">
                매장에 들어서는 순간 퍼지는 고소한 향과 구워지는 시각적 즐거움
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white/75 dark:bg-neutral-900/75 rounded-[28px] p-5 border border-[#8C6239]/10 dark:border-amber-700/10 shadow-sm text-left flex flex-col justify-between hover:shadow-md transition-all duration-300">
            <div>
              <div className="aspect-[16/10] w-full bg-neutral-100 dark:bg-neutral-800 rounded-xl overflow-hidden mb-4 select-none">
                <img
                  src={optimizeCloudinaryUrl("https://res.cloudinary.com/dfkntvpmv/image/upload/f_auto,q_auto/v1783479315/ChatGPT_Image_2026%EB%85%84_7%EC%9B%94_8%EC%9D%BC_%EC%98%A4%EC%A0%84_11_55_08_qd2nni.png")}
                  alt="파이와 조화를 이루는 시그니처 음료"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg font-black text-neutral-955 dark:text-amber-50">
                파이와 조화를 이루는 시그니처 음료
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-neutral-600 dark:text-neutral-400 mt-1">
                엄선된 스페셜티 원두 커피와 자체 레시피로 만든 에이드의 완벽한 페어링
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* Bottom Wavy transition to BrandCompetitiveness (Brand Blue #0F3587) */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10 translate-y-[2px]">
        <svg viewBox="0 0 1200 100" preserveAspectRatio="none" className="relative block w-full h-[24px] sm:h-[40px] lg:h-[55px] text-[#0F3587] dark:text-[#0a255c]">
          <path
            d="M 0 50 Q 25 10, 50 50 Q 75 90, 100 50 Q 125 10, 150 50 Q 175 90, 200 50 Q 225 10, 250 50 Q 275 90, 300 50 Q 325 10, 350 50 Q 375 90, 400 50 Q 425 10, 450 50 Q 475 90, 500 50 Q 525 10, 550 50 Q 575 90, 600 50 Q 625 10, 650 50 Q 675 90, 700 50 Q 725 10, 750 50 Q 775 90, 800 50 Q 825 10, 850 50 Q 875 90, 900 50 Q 925 10, 950 50 Q 975 90, 1000 50 Q 1025 10, 1050 50 Q 1075 90, 1100 50 Q 1125 10, 1150 50 Q 1175 90, 1200 50 L 1200 100 L 0 100 Z"
            fill="currentColor"
          />
        </svg>
      </div>

    </section>
  );
}
