"use client";

interface SalesCard {
  rank: string;
  branch: string;
  amountBig: string;   // e.g. "184"
  amountSmall: string; // e.g. "5,600"
  date: string;        // e.g. "26년 5월"
}

export default function DailySales() {
  const salesData: SalesCard[] = [
    { rank: "TOP 01", branch: "경기A점", amountBig: "184", amountSmall: "5,600", date: "26년 5월" },
    { rank: "TOP 02", branch: "서울B점", amountBig: "172", amountSmall: "3,120", date: "26년 5월" },
    { rank: "TOP 03", branch: "경기C점", amountBig: "165", amountSmall: "9,400", date: "26년 5월" },
    { rank: "TOP 04", branch: "인천D점", amountBig: "159", amountSmall: "8,300", date: "26년 4월" },
    { rank: "TOP 05", branch: "경기E점", amountBig: "155", amountSmall: "5,180", date: "26년 5월" },
    { rank: "TOP 06", branch: "서울F점", amountBig: "148", amountSmall: "9,560", date: "26년 4월" },
    { rank: "TOP 07", branch: "충청G점", amountBig: "145", amountSmall: "2,900", date: "26년 5월" },
    { rank: "TOP 08", branch: "경기H점", amountBig: "140", amountSmall: "7,800", date: "26년 5월" },
    { rank: "TOP 09", branch: "부산I점", amountBig: "139", amountSmall: "4,010", date: "26년 4월" },
    { rank: "TOP 10", branch: "서울J점", amountBig: "138", amountSmall: "5,200", date: "26년 5월" },
    { rank: "TOP 11", branch: "전라K점", amountBig: "135", amountSmall: "0,400", date: "26년 4월" },
    { rank: "TOP 12", branch: "경기L점", amountBig: "132", amountSmall: "4,070", date: "26년 5월" },
    { rank: "TOP 13", branch: "강원M점", amountBig: "129", amountSmall: "8,500", date: "26년 5월" },
    { rank: "TOP 14", branch: "서울N점", amountBig: "127", amountSmall: "3,200", date: "26년 4월" },
    { rank: "TOP 15", branch: "경기O점", amountBig: "125", amountSmall: "9,100", date: "26년 5월" },
    { rank: "TOP 16", branch: "영남P점", amountBig: "123", amountSmall: "4,600", date: "26년 5월" },
    { rank: "TOP 17", branch: "인천Q점", amountBig: "121", amountSmall: "8,800", date: "26년 4월" },
    { rank: "TOP 18", branch: "서울R점", amountBig: "120", amountSmall: "5,200", date: "26년 5월" },
    { rank: "TOP 19", branch: "경기S점", amountBig: "118", amountSmall: "9,400", date: "26년 5월" },
    { rank: "TOP 20", branch: "충청T점", amountBig: "116", amountSmall: "3,100", date: "26년 4월" },
  ];

  // The yellow shop logo icon from the user
  const yellowStoreLogoUrl = "https://res.cloudinary.com/dfkntvpmv/image/upload/f_auto,q_auto/v1783344485/ChatGPT_Image_2026%EB%85%84_7%EC%9B%94_6%EC%9D%BC_%EC%98%A4%ED%9B%84_10_27_55_yzj34l.png";

  return (
    <section className="relative pt-12 pb-16 sm:pt-36 sm:pb-36 bg-[#0F3587] dark:bg-[#0a255c] overflow-hidden transition-colors duration-300">
      {/* Top Wavy transition from GrowthSection (Yellow) */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none z-10 -translate-y-[1px] rotate-180">
        <svg viewBox="0 0 1200 100" preserveAspectRatio="none" className="relative block w-full h-[24px] sm:h-[40px] lg:h-[55px]">
          <path
            d="M 0 50 Q 25 10, 50 50 Q 75 90, 100 50 Q 125 10, 150 50 Q 175 90, 200 50 Q 225 10, 250 50 Q 275 90, 300 50 Q 325 10, 350 50 Q 375 90, 400 50 Q 425 10, 450 50 Q 475 90, 500 50 Q 525 10, 550 50 Q 575 90, 600 50 Q 625 10, 650 50 Q 675 90, 700 50 Q 725 10, 750 50 Q 775 90, 800 50 Q 825 10, 850 50 Q 875 90, 900 50 Q 925 10, 950 50 Q 975 90, 1000 50 Q 1025 10, 1050 50 Q 1075 90, 1100 50 Q 1125 10, 1150 50 Q 1175 90, 1200 50 L 1200 100 L 0 100 Z"
            fill="#ffb800"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-16">
        
        {/* Section Header with adjusted line-height and line breaks */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <span className="text-xs font-black uppercase tracking-widest text-amber-300 bg-white/10 px-3.5 py-1.5 rounded-full">
            Sales Performance
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-[1.3] sm:leading-[1.4]">
            격이 다른 일 평균 매출을 자랑하는
            <br />
            <span className="text-amber-400 inline-block pt-2">120겹파이</span>
          </h2>
          <p className="text-sm sm:text-base text-blue-100/90 font-bold max-w-2xl mx-auto leading-relaxed">
            가맹점들의 실제 일평균 매출 현황입니다.
            <br />
            객단가 높은 디저트 시너지로 압도적인 매출을 이끌어 냅니다.
          </p>
        </div>

        {/* Frank-style Responsive Cards Grid - Adjusted to 5 columns (lg:grid-cols-5) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-6 pt-4 sm:pt-8">
          {salesData.map((data, index) => (
            <div
              key={index}
              className="relative bg-white dark:bg-[#162e65] rounded-[24px] sm:rounded-[28px] shadow-lg p-3.5 sm:p-6 border border-slate-200/20 dark:border-white/10 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between aspect-[1/1] min-h-[160px] sm:min-h-[210px] overflow-hidden"
            >
              {/* TOP Badge (Asymmetric Gray Corner Badge) */}
              <div className="absolute top-0 right-0 bg-slate-400 dark:bg-slate-700 text-white text-[9px] sm:text-xs font-black px-2.5 py-1.5 rounded-bl-[16px] sm:rounded-bl-[20px] tracking-wide select-none">
                {data.rank}
              </div>

              {/* Branch Title Area */}
              <div className="text-left pt-2">
                <h3 className="text-sm sm:text-lg font-bold text-slate-400 dark:text-blue-300/70">
                  {data.branch}
                </h3>
              </div>

              {/* Sales Figure Area - Dynamically formatted with 5-column scale hierarchy */}
              <div className="text-left py-1 sm:py-2 select-none">
                <span className="text-neutral-900 dark:text-white font-black tracking-tight leading-none flex flex-wrap items-baseline">
                  {/* Huge core digit */}
                  <span className="text-lg min-[360px]:text-xl min-[400px]:text-2xl sm:text-3xl lg:text-[34px] font-black">{data.amountBig}</span>
                  {/* Smaller units */}
                  <span className="text-xs sm:text-lg font-black ml-0.5">만</span>
                  <span className="text-[10px] min-[360px]:text-xs sm:text-base lg:text-lg font-black ml-0.5 text-neutral-800 dark:text-slate-200">{data.amountSmall}</span>
                  <span className="text-[9px] sm:text-sm font-bold ml-0.5 text-neutral-500 dark:text-slate-400">원</span>
                </span>
              </div>

              {/* Bottom Layout: Right-aligned Yellow Store Icon & Center-aligned Date under it */}
              <div className="flex justify-end items-end pt-1">
                <div className="flex flex-col items-center space-y-0.5">
                  {/* Optimized Yellow Store Icon size for 5 columns */}
                  <img
                    src={yellowStoreLogoUrl}
                    alt="120pie yellow store"
                    className="w-9 h-9 sm:w-14 sm:h-14 object-contain select-none pointer-events-none drop-shadow-sm"
                  />
                  {/* Date label centered under the store icon */}
                  <span className="text-[8px] sm:text-xs font-bold text-slate-400 dark:text-blue-300/50">
                    {data.date}
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Bottom Wavy transition to SetMenuStrategy (Yellow) */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10 translate-y-[2px]">
        <svg viewBox="0 0 1200 100" preserveAspectRatio="none" className="relative block w-full h-[24px] sm:h-[40px] lg:h-[55px]">
          <path
            d="M 0 50 Q 25 10, 50 50 Q 75 90, 100 50 Q 125 10, 150 50 Q 175 90, 200 50 Q 225 10, 250 50 Q 275 90, 300 50 Q 325 10, 350 50 Q 375 90, 400 50 Q 425 10, 450 50 Q 475 90, 500 50 Q 525 10, 550 50 Q 575 90, 600 50 Q 625 10, 650 50 Q 675 90, 700 50 Q 725 10, 750 50 Q 775 90, 800 50 Q 825 10, 850 50 Q 875 90, 900 50 Q 925 10, 950 50 Q 975 90, 1000 50 Q 1025 10, 1050 50 Q 1075 90, 1100 50 Q 1125 10, 1150 50 Q 1175 90, 1200 50 L 1200 100 L 0 100 Z"
            fill="#FFB800"
          />
        </svg>
      </div>
    </section>
  );
}
