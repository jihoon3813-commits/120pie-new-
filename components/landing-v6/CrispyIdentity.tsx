"use client";

interface CrispyIdentityProps {
  backgroundImageUrl?: string;
}

export default function CrispyIdentity({
  backgroundImageUrl = "https://res.cloudinary.com/dfkntvpmv/image/upload/f_auto,q_auto/v1783394204/ChatGPT_Image_2026%EB%85%84_7%EC%9B%94_7%EC%9D%BC_%EC%98%A4%ED%9B%84_12_15_52_xe1s7j.png",
}: CrispyIdentityProps) {
  return (
    <section className="relative w-full h-[55vh] sm:h-[65vh] lg:h-[75vh] min-h-[400px] overflow-hidden bg-neutral-950 flex items-center">
      {/* Top Wavy transition from SetMenuStrategy (Yellow, with transparent bottom overlay) */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none z-10 -translate-y-[1px]">
        <svg viewBox="0 0 1200 100" preserveAspectRatio="none" className="relative block w-full h-[24px] sm:h-[40px] lg:h-[55px] text-[#FFB800]">
          <path
            d="M 0 50 Q 25 10, 50 50 Q 75 90, 100 50 Q 125 10, 150 50 Q 175 90, 200 50 Q 225 10, 250 50 Q 275 90, 300 50 Q 325 10, 350 50 Q 375 90, 400 50 Q 425 10, 450 50 Q 475 90, 500 50 Q 525 10, 550 50 Q 575 90, 600 50 Q 625 10, 650 50 Q 675 90, 700 50 Q 725 10, 750 50 Q 775 90, 800 50 Q 825 10, 850 50 Q 875 90, 900 50 Q 925 10, 950 50 Q 975 90, 1000 50 Q 1025 10, 1050 50 Q 1075 90, 1100 50 Q 1125 10, 1150 50 Q 1175 90, 1200 50 L 1200 0 L 0 0 Z"
            fill="currentColor"
          />
        </svg>
      </div>
      {/* Background Cover Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={backgroundImageUrl}
          alt="120pie crispy pastry backdrop"
          className="w-full h-full object-cover object-center"
        />
        {/* Soft shadow overlay on the left to guarantee white text readability */}
        <div className="absolute inset-y-0 left-0 w-full sm:w-[65%] md:w-[50%] bg-gradient-to-r from-neutral-950/60 via-neutral-950/20 to-transparent pointer-events-none" />
      </div>

      {/* Text Content Overlay on the Left Side - Enlarged Text Sizes */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Expanded max-width box to prevent excessive line wrapping */}
        <div className="max-w-xl sm:max-w-2xl lg:max-w-3xl text-left space-y-6 text-white drop-shadow-[0_3px_10px_rgba(0,0,0,0.55)]">
          <span className="inline-block text-xs sm:text-sm font-black text-amber-400 tracking-widest uppercase">
            Signature Texture
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-[60px] font-black tracking-tight leading-tight">
            120겹으로 완성한
            <br />
            바삭한 존재감
          </h2>
          <p className="text-lg sm:text-[22px] font-extrabold text-neutral-100 leading-relaxed whitespace-pre-line">
            겹겹이 쌓인 페이스트리와 풍성한 필링.
            {"\n"}
            보기만 해도 선택되는 디저트 메뉴입니다.
          </p>
        </div>
      </div>
    </section>
  );
}
