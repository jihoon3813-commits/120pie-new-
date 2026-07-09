"use client";

export default function OperationSystem() {
  const cards = [
    {
      title: "간편 조리",
      description: "굽고, 담고, 판매",
      image: "https://res.cloudinary.com/dfkntvpmv/image/upload/f_auto,q_auto/v1783426564/ChatGPT_Image_2026%EB%85%84_7%EC%9B%94_7%EC%9D%BC_%EC%98%A4%ED%9B%84_04_59_13_ascohy.png",
    },
    {
      title: "공간 효율",
      description: "작은 공간도 매출화",
      image: "https://res.cloudinary.com/dfkntvpmv/image/upload/f_auto,q_auto/v1783426596/ChatGPT_Image_2026%EB%85%84_7%EC%9B%94_7%EC%9D%BC_%EC%98%A4%ED%9B%84_09_16_24_slvtwq.png",
    },
    {
      title: "마케팅 지원",
      description: "노출부터 세팅까지",
      image: "https://res.cloudinary.com/dfkntvpmv/image/upload/f_auto,q_auto/v1783426564/ChatGPT_Image_2026%EB%85%84_7%EC%9B%94_7%EC%9D%BC_%EC%98%A4%ED%9B%84_04_54_55_3_uzwlyk.png",
    },
    {
      title: "매출 확장",
      description: "커피와 함께 객단가 상승",
      image: "https://res.cloudinary.com/dfkntvpmv/image/upload/f_auto,q_auto/v1783426564/ChatGPT_Image_2026%EB%85%84_7%EC%9B%94_7%EC%9D%BC_%EC%98%A4%ED%9B%84_05_07_43_yjzsze.png",
    },
  ];

  const pills = [
    {
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
        </svg>
      ),
      label: "체계적인 상권분석",
    },
    {
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      label: "슈퍼바이저 오픈 지원",
    },
    {
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      label: "네이버 플레이스 등록 지원",
    },
    {
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      label: "배달앱 세팅 및 매출 컨설팅",
    },
  ];

  return (
    <section className="relative bg-[#2BCD1F] pt-12 pb-16 sm:pt-32 sm:pb-36 overflow-hidden text-white">
      
      {/* Top Wavy transition from CrispyIdentity (Transparent top overlay) */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none z-10 -translate-y-[1px]">
        <svg viewBox="0 0 1200 100" preserveAspectRatio="none" className="relative block w-full h-[24px] sm:h-[40px] lg:h-[55px]">
          <path
            d="M 0 50 Q 25 10, 50 50 Q 75 90, 100 50 Q 125 10, 150 50 Q 175 90, 200 50 Q 225 10, 250 50 Q 275 90, 300 50 Q 325 10, 350 50 Q 375 90, 400 50 Q 425 10, 450 50 Q 475 90, 500 50 Q 525 10, 550 50 Q 575 90, 600 50 Q 625 10, 650 50 Q 675 90, 700 50 Q 725 10, 750 50 Q 775 90, 800 50 Q 825 10, 850 50 Q 875 90, 900 50 Q 925 10, 950 50 Q 975 90, 1000 50 Q 1025 10, 1050 50 Q 1075 90, 1100 50 Q 1125 10, 1150 50 Q 1175 90, 1200 50 L 1200 100 L 0 100 Z"
            fill="#2BCD1F"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        
        {/* Header Layout: Large text and Logo side-by-side on desktop, small text stacked tightly below title */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-8 sm:mb-16 text-left">
          <div className="space-y-2.5 max-w-3xl">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-[0.98] text-white">
              작게 시작해도
              <br />
              <span className="underline decoration-white decoration-4 underline-offset-8">브랜드처럼 운영</span>됩니다
            </h2>
            <p className="text-base sm:text-lg font-bold text-white/90 leading-tight whitespace-pre-line pt-1">
              상권분석부터 오픈 지원, 배달앱 세팅과 마케팅까지
              {"\n"}
              120pie는 제품 공급을 넘어 운영 시스템을 함께 제공합니다.
            </p>
          </div>
          
          {/* Logo Image Overlay aligned with the large text header */}
          <div className="flex-shrink-0 md:pt-1">
            <img
              src="https://res.cloudinary.com/dfkntvpmv/image/upload/f_auto,q_auto/v1783394400/edited-photo_-_2026-07-06T145123.041_eqxzak.png"
              alt="120pie & coffee Logo"
              className="h-32 sm:h-44 md:h-48 w-auto object-contain select-none pointer-events-none"
            />
          </div>
        </div>

        {/* 4 Columns of Cards with Actual Images */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, index) => (
            <div
              key={index}
              className="bg-white rounded-[32px] p-6 border border-emerald-500/10 shadow-lg flex flex-col items-stretch text-left hover:shadow-xl transition-all duration-300"
            >
              {/* Actual Image Element with Cloudinary optimization parameters */}
              <div className="aspect-[4/3] w-full bg-neutral-100 rounded-2xl overflow-hidden mb-5 select-none relative">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover select-none pointer-events-none"
                />
              </div>

              {/* Title & Description in Black */}
              <div className="space-y-1">
                <h3 className="text-xl font-extrabold text-neutral-900">
                  {card.title}
                </h3>
                <p className="text-sm font-semibold text-neutral-600">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Horizontal Pills Badge Grid */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-6 sm:mt-12">
          {pills.map((pill, idx) => (
            <div
              key={idx}
              className="bg-neutral-950/25 backdrop-blur-md px-5 py-3 rounded-full border border-white/15 flex items-center gap-2.5 shadow-sm"
            >
              <div className="p-1 bg-white/10 rounded-lg">
                {pill.icon}
              </div>
              <span className="text-sm sm:text-base font-black text-white">
                {pill.label}
              </span>
            </div>
          ))}
        </div>

      </div>

      {/* Bottom Wavy transition to StoreConcept (Soft Cream Yellow / Dark Amber) */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10 translate-y-[2px]">
        <svg viewBox="0 0 1200 100" preserveAspectRatio="none" className="relative block w-full h-[24px] sm:h-[40px] lg:h-[55px] text-[#FFF5D1] dark:text-[#1A1813]">
          <path
            d="M 0 50 Q 25 10, 50 50 Q 75 90, 100 50 Q 125 10, 150 50 Q 175 90, 200 50 Q 225 10, 250 50 Q 275 90, 300 50 Q 325 10, 350 50 Q 375 90, 400 50 Q 425 10, 450 50 Q 475 90, 500 50 Q 525 10, 550 50 Q 575 90, 600 50 Q 625 10, 650 50 Q 675 90, 700 50 Q 725 10, 750 50 Q 775 90, 800 50 Q 825 10, 850 50 Q 875 90, 900 50 Q 925 10, 950 50 Q 975 90, 1000 50 Q 1025 10, 1050 50 Q 1075 90, 1100 50 Q 1125 10, 1150 50 Q 1175 90, 1200 50 L 1200 100 L 0 100 Z"
            fill="currentColor"
          />
        </svg>
      </div>

    </section>
  );
}
