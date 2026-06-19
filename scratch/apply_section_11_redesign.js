const fs = require('fs');

const filePath = 'd:/anti-gv/25. 120pie(new)_2/app/franchise2/Franchise2PageClient.tsx';
let code = fs.readFileSync(filePath, 'utf8');

// Find start index
const startComment = '        {/* SECTION 11. 창업모델 A */}';
const startIdx = code.indexOf(startComment);

// Find end index
const endComment = '        {/* SECTION 12. 창업모델 B */}';
const endIdx = code.indexOf(endComment);

if (startIdx !== -1 && endIdx !== -1) {
  // Let's get the code before and after
  const before = code.substring(0, startIdx);
  const after = code.substring(endIdx);
  
  // We can write the new Slide 11 code
  const slide11Code = `        {/* SECTION 11. 창업모델 A */}
        <section className={\`rounded-3xl p-6 sm:p-12 \${cardBg} relative\`}>
          <div className="flex items-center justify-between border-b border-neutral-200/20 pb-4 mb-8">
            <span className="text-xs font-black tracking-widest text-[#ffd500]">11 / FRANCHISE MODEL A</span>
            <span className="text-xs font-black text-slate-400">SHOP-IN-SHOP / PARTNERSHIP</span>
          </div>

          <div className="space-y-8 text-left">
            <div className="text-center md:text-left space-y-3">
              <span className={\`text-xs font-black px-2.5 py-1 \${isPink ? "bg-rose-500/10 text-rose-455 border-rose-500/20" : "bg-amber-400/10 text-amber-600 border-amber-400/20"} border rounded-full\`}>
                모델 A: 샵인샵 / 배달 전문형
              </span>
              <h2 className={\`text-2xl sm:text-3xl font-black \${textTitle} mt-2\`}>
                기존 매장 그대로, <span className={textHighlight}>최적의 샵인샵 결합 패키지</span>
              </h2>
              <p className={\`text-sm sm:text-base leading-relaxed \${textDesc}\`}>
                운영 중인 카페, 분식집 등의 설비를 그대로 보존하며 도입하는 샵인샵 전용 B2B 패키지입니다. (부가세 별도)
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "120겹파이 올인원",
                  price: "440만 원",
                  original: "550만 원",
                  desc: "120겹 파이 조리 전용 머신과 초도 자재 일체를 지원하는 기본 패키지",
                  points: ["전용 파이 머신 공급", "초도 재료 물량 지원", "홍보용 실외 배너 및 POP", "조리/오퍼레이션 교육"]
                },
                {
                  title: "에그120 프리미엄",
                  price: "330만 원",
                  original: "440만 원",
                  desc: "친환경 동물복지 계란빵 에그120 전용 머신과 초도 세팅 패키지",
                  points: ["전용 에그빵 머신 공급", "전용 반죽 배합 원료 지원", "홍보용 배너 및 포스터", "오프라인 현장 교육"]
                },
                {
                  title: "120 시리즈 결합형",
                  price: "690만 원",
                  original: "990만 원",
                  desc: "파이 머신과 에그빵 머신을 동시 도입하여 시너지 매출을 극대화하는 종합 패키지",
                  points: ["파이 & 에그빵 머신 일체", "본사 자체 물류 공급 연동", "외장 리뉴얼 간판 디자인", "매출 활성화 마케팅 지원"]
                }
              ].map((pkg, idx) => (
                <div key={idx} className={\`p-6 rounded-2xl \${innerCardBgAccent} \${innerCardHover} flex flex-col justify-between h-[340px] text-left relative\`}>
                  {idx === 2 && (
                    <div className="absolute -top-3 left-6 bg-[#ffd500] text-neutral-950 font-black text-[9px] px-2 py-0.5 rounded-full border border-neutral-950/25 uppercase tracking-wider">
                      RECOMMENDED
                    </div>
                  )}
                  <div>
                    <h4 className={\`text-base font-extrabold \${textTitle} mb-1\`}>{pkg.title}</h4>
                    <p className={\`text-[10px] \${textDesc} leading-normal mb-3\`}>{pkg.desc}</p>
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className={\`text-2xl font-black \${isPink ? "text-rose-500" : "text-amber-500"}\`}>{pkg.price}</span>
                      <span className={\`text-xs line-through \${textDesc}\`}>{pkg.original}</span>
                    </div>
                    <div className="w-full h-px bg-neutral-200/10 mb-4"></div>
                    <ul className="space-y-1.5">
                      {pkg.points.map((pt, pIdx) => (
                        <li key={pIdx} className="flex items-center gap-1.5 text-xs text-slate-450 font-semibold">
                          <CheckCircle2 size={12} className={isPink ? "text-rose-500" : "text-amber-500"} />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center border-t border-neutral-200/20 pt-6 mt-8 text-[11px] sm:text-xs font-bold text-slate-500">
            <span>* 120pie & coffee 샵인샵 특화 패키지 가이드 기준</span>
            <span>Slide 11 / 16</span>
          </div>
        </section>
        
`;
  
  fs.writeFileSync(filePath, before + slide11Code + after, 'utf8');
  console.log("Section 11 replaced successfully!");
} else {
  console.log("Error: could not find Slide 11 or Slide 12 comments!");
}
