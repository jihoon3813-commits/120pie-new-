"use client";

export default function GrowthSection() {
  return (
    <div className="relative w-full z-10 bg-transparent">
      {/* 2. Overlapping Yellow Growth Section */}
      {/* -mt-24 pulls this section upwards, covering the bottom of the preceding store image */}
      <section className="relative z-10 -mt-24 sm:-mt-36 bg-[#ffb800] text-neutral-950 py-10 sm:py-24 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-12 items-center">
            
            {/* Left side texts - Enlarged significantly */}
            <div className="lg:col-span-5 space-y-4 sm:space-y-8 text-left">
              <span className="inline-block text-xs sm:text-sm font-black uppercase tracking-widest text-amber-950/80 bg-white/20 px-4 py-1.5 rounded-full">
                Rapid Growth
              </span>
              <h2 className="text-4xl sm:text-5xl lg:text-[56px] font-black tracking-tight leading-tight text-neutral-950">
                입소문으로 시작해
                <br />
                <span className="text-white drop-shadow-[0_3px_6px_rgba(0,0,0,0.18)]">200호점 돌파</span>
              </h2>
              <div className="pt-4 sm:pt-8 border-t border-amber-950/20 text-lg sm:text-[22px] font-extrabold text-amber-950/90 leading-relaxed whitespace-pre-line">
                <p>
                  커피와 함께 팔리는 디저트,
                  {"\n"}
                  포장과 배달까지 확장되는 메뉴 경쟁력으로
                  {"\n"}
                  120pie는 빠르게 성장하고 있습니다.
                </p>
              </div>
            </div>

            {/* Right side interactive SVG Growth Line Chart */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-[32px] shadow-xl border border-white/50 relative overflow-hidden">
              {/* Year/Store Label Graph */}
              <div className="relative aspect-[16/9] w-full">
                {/* SVG Graph wrapper */}
                <svg className="w-full h-full" viewBox="0 0 500 250">
                  {/* Grid Lines */}
                  <line x1="50" y1="200" x2="450" y2="200" stroke="#f0f0f0" strokeWidth="1" />
                  <line x1="50" y1="150" x2="450" y2="150" stroke="#f0f0f0" strokeWidth="1" />
                  <line x1="50" y1="100" x2="450" y2="100" stroke="#f0f0f0" strokeWidth="1" />
                  <line x1="50" y1="50" x2="450" y2="50" stroke="#f0f0f0" strokeWidth="1" />

                  {/* Y Axis Labels */}
                  <text x="35" y="203" fill="#b0b0b0" fontSize="10" fontWeight="bold" textAnchor="end">0</text>
                  <text x="35" y="153" fill="#b0b0b0" fontSize="10" fontWeight="bold" textAnchor="end">50</text>
                  <text x="35" y="103" fill="#b0b0b0" fontSize="10" fontWeight="bold" textAnchor="end">100</text>
                  <text x="35" y="53" fill="#b0b0b0" fontSize="10" fontWeight="bold" textAnchor="end">200</text>

                  {/* X Axis Labels */}
                  <text x="80" y="222" fill="#888" fontSize="11" fontWeight="bold" textAnchor="middle">2022</text>
                  <text x="170" y="222" fill="#888" fontSize="11" fontWeight="bold" textAnchor="middle">2023</text>
                  <text x="260" y="222" fill="#888" fontSize="11" fontWeight="bold" textAnchor="middle">2024</text>
                  <text x="350" y="222" fill="#888" fontSize="11" fontWeight="bold" textAnchor="middle">2025</text>
                  <text x="440" y="222" fill="#888" fontSize="11" fontWeight="bold" textAnchor="middle">2026</text>

                  {/* 꺾은선 (Growth Line - Infinite Loop Animation) */}
                  <path
                    d="M 80 195 L 170 180 L 260 148 L 350 95 L 440 50"
                    fill="none"
                    stroke="#ffb800"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray="500"
                    className="animate-draw-loop"
                  />

                  {/* Nodes & Data Labels */}
                  {/* node 1 (2022 - 1호점) */}
                  <g className="anim-node-1">
                    <circle cx="80" cy="195" r="5" fill="#ffb800" stroke="#fff" strokeWidth="2" />
                    <text x="80" y="180" fill="#222" fontSize="10" fontWeight="black" textAnchor="middle">1호점</text>
                    <rect x="62" y="200" width="36" height="12" rx="3" fill="#002d62" />
                    <text x="80" y="209" fill="#fff" fontSize="8" fontWeight="black" textAnchor="middle">START</text>
                  </g>

                  {/* node 2 (2023 - 32호점) */}
                  <g className="anim-node-2">
                    <circle cx="170" cy="180" r="5" fill="#ffb800" stroke="#fff" strokeWidth="2" />
                    <text x="170" y="165" fill="#222" fontSize="10" fontWeight="black" textAnchor="middle">32호점</text>
                  </g>

                  {/* node 3 (2024 - 105호점) */}
                  <g className="anim-node-3">
                    <circle cx="260" cy="148" r="5" fill="#ffb800" stroke="#fff" strokeWidth="2" />
                    <text x="260" y="133" fill="#222" fontSize="10" fontWeight="black" textAnchor="middle">105호점</text>
                  </g>

                  {/* node 4 (2025 - 180호점) */}
                  <g className="anim-node-4">
                    <circle cx="350" cy="95" r="5" fill="#ffb800" stroke="#fff" strokeWidth="2" />
                    <text x="350" y="80" fill="#222" fontSize="10" fontWeight="black" textAnchor="middle">180호점</text>
                  </g>

                  {/* node 5 (2026 - 200호점 돌파) */}
                  <g className="anim-node-5">
                    <circle cx="440" cy="50" r="8" fill="#ffb800" stroke="#fff" strokeWidth="3" />
                    {/* Glow pulsing effect on final node */}
                    <circle cx="440" cy="50" r="14" fill="none" stroke="#ffb800" strokeWidth="2" className="animate-ping opacity-60" />
                  </g>
                </svg>

                {/* Final Target Banner Overlay (200호점 돌파!) */}
                <div className="absolute top-[8%] right-[1%] bg-gradient-to-r from-amber-500 to-[#ffb800] text-neutral-950 font-black text-[10px] sm:text-xs px-2.5 py-1.5 rounded-lg shadow-md flex items-center gap-1 border border-white/20 anim-target-banner">
                  <span>200호점 돌파!</span>
                  <svg className="w-3.5 h-3.5 text-neutral-950 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Styled JSX for the infinite loop animation */}
      <style jsx>{`
        @keyframes loopDraw {
          0%, 5% {
            stroke-dashoffset: 500;
          }
          45%, 65% {
            stroke-dashoffset: 0;
          }
          95%, 100% {
            stroke-dashoffset: 500;
          }
        }
        .animate-draw-loop {
          animation: loopDraw 5s ease-in-out infinite;
        }

        /* Sync node animations using scale and opacity keyframes */
        @keyframes nodeFade1 {
          0%, 10% { opacity: 0; transform: scale(0.6); transform-origin: 80px 195px; }
          30%, 75% { opacity: 1; transform: scale(1); transform-origin: 80px 195px; }
          90%, 100% { opacity: 0; transform: scale(0.6); transform-origin: 80px 195px; }
        }
        @keyframes nodeFade2 {
          0%, 16% { opacity: 0; transform: scale(0.6); transform-origin: 170px 180px; }
          34%, 75% { opacity: 1; transform: scale(1); transform-origin: 170px 180px; }
          90%, 100% { opacity: 0; transform: scale(0.6); transform-origin: 170px 180px; }
        }
        @keyframes nodeFade3 {
          0%, 22% { opacity: 0; transform: scale(0.6); transform-origin: 260px 148px; }
          38%, 75% { opacity: 1; transform: scale(1); transform-origin: 260px 148px; }
          90%, 100% { opacity: 0; transform: scale(0.6); transform-origin: 260px 148px; }
        }
        @keyframes nodeFade4 {
          0%, 28% { opacity: 0; transform: scale(0.6); transform-origin: 350px 95px; }
          42%, 75% { opacity: 1; transform: scale(1); transform-origin: 350px 95px; }
          90%, 100% { opacity: 0; transform: scale(0.6); transform-origin: 350px 95px; }
        }
        @keyframes nodeFade5 {
          0%, 34% { opacity: 0; transform: scale(0.6); transform-origin: 440px 50px; }
          46%, 75% { opacity: 1; transform: scale(1); transform-origin: 440px 50px; }
          90%, 100% { opacity: 0; transform: scale(0.6); transform-origin: 440px 50px; }
        }
        @keyframes targetBanner {
          0%, 42% { opacity: 0; transform: translateY(8px); }
          50%, 75% { opacity: 1; transform: translateY(0); }
          90%, 100% { opacity: 0; transform: translateY(8px); }
        }

        .anim-node-1 { animation: nodeFade1 5s ease-in-out infinite; }
        .anim-node-2 { animation: nodeFade2 5s ease-in-out infinite; }
        .anim-node-3 { animation: nodeFade3 5s ease-in-out infinite; }
        .anim-node-4 { animation: nodeFade4 5s ease-in-out infinite; }
        .anim-node-5 { animation: nodeFade5 5s ease-in-out infinite; }
        .anim-target-banner { animation: targetBanner 5s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
