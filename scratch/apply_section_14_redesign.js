const fs = require('fs');
const filepath = "d:\\anti-gv\\25. 120pie(new)_2\\app\\franchise\\FranchisePageClient.tsx";
let content = fs.readFileSync(filepath, 'utf8');

// 1. Headphones 아이콘 임포트 추가
content = content.replace(
    '  Percent\r\n} from "lucide-react";',
    '  Percent,\r\n  Headphones\r\n} from "lucide-react";'
).replace(
    '  Percent\n} from "lucide-react";',
    '  Percent,\n  Headphones\n} from "lucide-react";'
);

// 2. SECTION 14 영역 치환
const startKeyword = "{/* SECTION 14. 창업절차 */}";
const endKeyword = "{/* SECTION 15. 도입 이유 (WHY PARTNER WITH US) */}";

const startIdx = content.indexOf(startKeyword);
const endIdx = content.indexOf(endKeyword);

if (startIdx === -1 || endIdx === -1) {
    console.error("Error: SECTION 14 or 15 keywords not found!");
    process.exit(1);
}

const replacementSection = `{/* SECTION 14. 창업절차 */}
        <section className={\`rounded-3xl p-6 sm:p-12 \${cardBg} relative\`}>
          <div className="flex items-center justify-between border-b border-neutral-200/20 pb-4 mb-8">
            <span className="text-xs font-black tracking-widest text-[#ffd500]">14 / FRANCHISE PROCESS</span>
            <span className="text-xs font-black text-slate-400">5-STEP LAUNCH ROADMAP</span>
          </div>

          <div className="space-y-10">
            {/* Top Grid: Title and Support Points */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              {/* Left Title */}
              <div className="text-center md:text-left space-y-3">
                <span className={\`text-xs font-black tracking-widest \${isPink ? "text-rose-450" : "text-amber-500"} uppercase block font-mono\`}>Franchise Process</span>
                <h2 className="text-3xl sm:text-4xl font-black">
                  체계적인 <span className={textHighlight}>창업 절차</span>
                </h2>
                <p className={\`text-sm sm:text-base leading-relaxed \${textDesc}\`}>
                  계약부터 오픈 이후 사후관리까지, 본사의 밀착 케어 시스템으로 안정적인 창업을 지원합니다.
                </p>
              </div>

              {/* Right Support Points Card */}
              <div className={\`p-6 rounded-3xl border \${isPink ? "bg-neutral-900/60 border-neutral-800 shadow-rose-950/5" : "bg-[#fffbf0] border-amber-200/50 shadow-amber-100/10"} shadow-lg text-left\`}>
                <h3 className={\`text-sm sm:text-base font-black text-center mb-5 \${textTitle}\`}>본사 지원 포인트</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { title: "상권 분석", icon: <MapPin size={20} className={isPink ? "text-rose-400" : "text-amber-600"} />, bgClass: isPink ? "bg-neutral-950 border border-neutral-850" : "bg-white border border-amber-200/50" },
                    { title: "메뉴 교육", icon: <ChefHat size={20} className={isPink ? "text-rose-400" : "text-amber-600"} />, bgClass: isPink ? "bg-neutral-950 border border-neutral-850" : "bg-white border border-amber-200/50" },
                    { title: "오픈 세팅", icon: <Store size={20} className={isPink ? "text-rose-400" : "text-amber-600"} />, bgClass: isPink ? "bg-neutral-950 border border-neutral-850" : "bg-white border border-amber-200/50" },
                    { title: "사후 관리", icon: <Headphones size={20} className={isPink ? "text-rose-400" : "text-amber-600"} />, bgClass: isPink ? "bg-neutral-950 border border-neutral-850" : "bg-white border border-amber-200/50" },
                  ].map((pt, idx) => (
                    <div key={idx} className={\`p-3.5 rounded-2xl \${pt.bgClass} flex flex-col items-center text-center justify-center gap-1.5 transition-transform hover:scale-[1.03] duration-300\`}>
                      <div className={\`p-2 rounded-xl \${isPink ? "bg-rose-500/10" : "bg-amber-100/50"} shadow-sm\`}>
                        {pt.icon}
                      </div>
                      <span className={\`text-xs sm:text-sm font-black \${textTitle}\`}>{pt.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Grid: 5-step cards and images */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-8">
              {/* Left Column (5 steps): 7 columns */}
              <div className="lg:col-span-7 space-y-5">
                {[
                  { step: "01", text: "창업 상담 및 매장 상황/상권 분석" },
                  { step: "02", text: "아이템 선정 및 맞춤형 가맹 계약" },
                  { step: "03", text: "본사 전문가의 메뉴 교육 및 파이 레시피 제공" },
                  { step: "04", text: "본사 패키지 세팅 및 매장 그랜드 오픈" },
                  { step: "05", text: "지속적인 신메뉴 개발 및 철저한 사후 매출 관리" }
                ].map((item, idx) => (
                  <div key={idx} className="relative pl-3 select-none">
                    {/* Ribbon folding shadow trick */}
                    <div className={\`absolute -left-1.5 top-[calc(50%+8px)] w-0 h-0 border-t-[5px] \${isPink ? "border-t-rose-950" : "border-t-amber-950"} border-l-[5px] border-l-transparent z-0\`}></div>
                    
                    {/* Step Card Body */}
                    <div className={\`p-4 pl-12 pr-6 rounded-2xl border \${isPink ? "bg-neutral-900/60 border-neutral-800 text-white" : "bg-gradient-to-r from-amber-400 to-amber-300 text-neutral-900 border-amber-400 shadow-md"} relative z-10 flex items-center justify-between text-left hover:scale-[1.01] transition-transform duration-200\`}>
                      {/* Ribbon Number Badge */}
                      <div className={\`w-10 h-10 flex items-center justify-center font-black rounded-r-xl rounded-l-md absolute -left-2 top-1/2 -translate-y-1/2 shadow-md \${isPink ? "bg-rose-600 text-white" : "bg-[#f05c40] text-white"}\`}>
                        {item.step}
                      </div>
                      <span className="text-xs sm:text-sm md:text-base font-black leading-snug">
                        {item.text}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Column (3 images): 5 columns */}
              <div className="lg:col-span-5 space-y-4">
                {[
                  {
                    url: "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&w=600&q=80",
                    cap: "창업 상담 및 세부 상권 컨설팅"
                  },
                  {
                    url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80",
                    cap: "본사 조리실 1:1 기기 및 레시피 집중 교육"
                  },
                  {
                    url: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=600&q=80",
                    cap: "오픈 이후 철저한 밀착 사후 관리"
                  }
                ].map((imgItem, idx) => (
                  <div key={idx} className="relative rounded-2xl overflow-hidden border border-neutral-200/20 shadow-lg aspect-[16/7] bg-neutral-950 group hover:scale-[1.02] transition-all duration-300">
                    <img 
                      src={imgItem.url} 
                      alt={imgItem.cap} 
                      className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/75 via-transparent to-transparent flex items-end p-3">
                      <span className="text-[10px] sm:text-xs font-bold text-white/95">{imgItem.cap}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center border-t border-neutral-200/20 pt-6 mt-8 text-[11px] sm:text-xs font-bold text-slate-500">
            <span>* 가맹 상담 완료 시 상세 개점 스케줄러를 무상 제공해 드립니다.</span>
            <span>Slide 14 / 16</span>
          </div>
        </section>
        
        `;

const newContent = content.substring(0, startIdx) + replacementSection + content.substring(endIdx);
fs.writeFileSync(filepath, newContent, 'utf8');
console.log("Section 14 redesigned successfully.");
