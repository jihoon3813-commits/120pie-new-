const fs = require('fs');

const filePath = 'd:/anti-gv/25. 120pie(new)_2/app/franchise2/Franchise2PageClient.tsx';
let code = fs.readFileSync(filePath, 'utf8');

// 1. Rename component
code = code.replace(
  'export default function FranchisePageClient() {',
  'export default function Franchise2PageClient() {'
);

// 2. Update Header Navigation Links
const targetHeaderNav = `<nav className={\`hidden lg:flex items-center gap-2.5 xl:gap-4 text-[10px] xl:text-[13px] font-bold shrink-0 \${navLinkTextClass}\`}>
            <Link href={\`\${backUrl}#menu\`} className="hover:text-amber-400 transition-colors">메뉴 카탈로그</Link>
            <Link href={\`/stores?theme=\${theme}\`} className="hover:text-amber-400 transition-colors">가맹점 현황</Link>
            <Link href={\`/costs?theme=\${theme}\`} className="hover:text-amber-400 transition-colors">샵인샵 안내</Link>
            <Link href={\`/franchise?theme=\${theme}\`} className={\`hover:scale-105 transition-transform shrink-0 \${
              isPink 
                ? "text-rose-500 hover:text-rose-600 font-extrabold" 
                : "text-[#ffd500] hover:text-[#e6bd00] font-extrabold"
            }\`}>
              창업 안내
            </Link>
            <Link href={\`\${backUrl}#faq\`} className="hover:text-amber-400 transition-colors">FAQ</Link>
          </nav>`;

const replacementHeaderNav = `<nav className={\`hidden lg:flex items-center gap-2.5 xl:gap-4 text-[10px] xl:text-[13px] font-bold shrink-0 \${navLinkTextClass}\`}>
            <Link href={\`\${backUrl}#menu\`} className="hover:text-amber-400 transition-colors">메뉴 카탈로그</Link>
            <Link href={\`/stores?theme=\${theme}\`} className="hover:text-amber-400 transition-colors">가맹점 현황</Link>
            <Link href={\`/costs?theme=\${theme}\`} className="hover:text-amber-400 transition-colors">샵인샵 안내</Link>
            <Link href={\`/franchise?theme=\${theme}\`} className="hover:text-amber-400 transition-colors">창업 안내</Link>
            <Link href={\`/franchise2?theme=\${theme}\`} className={\`hover:scale-105 transition-transform shrink-0 \${
              isPink 
                ? "text-rose-500 hover:text-rose-600 font-extrabold" 
                : "text-[#ffd500] hover:text-[#e6bd00] font-extrabold"
            }\`}>
              창업안내(2)
            </Link>
            <Link href={\`\${backUrl}#faq\`} className="hover:text-amber-400 transition-colors">FAQ</Link>
          </nav>`;

code = code.replace(targetHeaderNav, replacementHeaderNav);

// 3. Update Mobile Navigation Links
const targetMobileNav = `              <Link href={\`/franchise?theme=\${theme}\`} onClick={() => setMobileNavOpen(false)} className={\`rounded-xl px-4 py-3 transition-colors \${mobileNavLinkClass}\`}>
                창업 안내
              </Link>
              <Link href={\`\${backUrl}#faq\`} onClick={() => setMobileNavOpen(false)} className={\`col-span-2 rounded-xl px-4 py-3 transition-colors text-center \${mobileNavLinkClass}\`}>
                FAQ
              </Link>`;

const replacementMobileNav = `              <Link href={\`/franchise?theme=\${theme}\`} onClick={() => setMobileNavOpen(false)} className={\`rounded-xl px-4 py-3 transition-colors \${mobileNavLinkClass}\`}>
                창업 안내
              </Link>
              <Link href={\`/franchise2?theme=\${theme}\`} onClick={() => setMobileNavOpen(false)} className={\`rounded-xl px-4 py-3 transition-colors font-extrabold \${
                isPink 
                  ? "text-rose-500 bg-rose-500/10 border border-rose-500/20" 
                  : "text-[#ffd500] bg-[#ffd500]/10 border border-[#ffd500]/20"
              }\`}>
                창업안내(2)
              </Link>
              <Link href={\`\${backUrl}#faq\`} onClick={() => setMobileNavOpen(false)} className={\`col-span-2 rounded-xl px-4 py-3 transition-colors text-center \${mobileNavLinkClass}\`}>
                FAQ
              </Link>`;

code = code.replace(targetMobileNav, replacementMobileNav);

// 4. Update Slide 10: Profit Simulation Table & Net Profit Highlight
const targetTableRows = `                    {[
                      { cat: "월 매출액", price: "3,000만 원", ratio: "100%", desc: "평균 가맹점 월 판매 기준 매출 예시" },
                      { cat: "식자재비", price: "1,050만 원", ratio: "35%", desc: "본사 완제품 생지 및 부자재 공급 단가" },
                      { cat: "임차료", price: "250만 원", ratio: "8.3%", desc: "10평형 매장 평균 월세" },
                      { cat: "인건비", price: "180만 원", ratio: "6.0%", desc: "점주 1인 + 파트타임 1인 운영" },
                      { cat: "관리비 및 수수료", price: "120만 원", ratio: "4.0%", desc: "수도, 광열비 및 배달앱 수수료 등" }
                    ]`;

const replacementTableRows = `                    {[
                      { cat: "월 총매출액", price: "3,000만 원", ratio: "100%", desc: "테이크아웃 및 배달 포함 평균 매출 예시" },
                      { cat: "원부재료 원가", price: "900만 원", ratio: "30%", desc: "원두, 일회용품, 원부자재 일체 공급가" },
                      { cat: "인건비 책정", price: "600만 원", ratio: "20%", desc: "점주 운영 및 직원/파트타임 급여" },
                      { cat: "임대료 및 기타비용", price: "450만 원", ratio: "15%", desc: "매장 임대료, 관리비, 배달앱 수수료 등" }
                    ]`;

code = code.replace(targetTableRows, replacementTableRows);

code = code.replace(
  `<td className="py-4 px-4 text-right">1,400만 원</td>`,
  `<td className="py-4 px-4 text-right">1,050만 원</td>`
);

code = code.replace(
  `<td className="py-4 px-4 text-right font-mono">46.7%</td>`,
  `<td className="py-4 px-4 text-right font-mono">35%</td>`
);

code = code.replace(
  `<span className="text-base font-extrabold">월 순수익 약 1,400만 원 (46.7%)</span>`,
  `<span className="text-base font-extrabold">월 순수익 약 1,050만 원 (35%)</span>`
);

// 5. Update Slide 11: Model A Card/Layout Redesign
const targetSection11Start = `        {/* SECTION 11. 창업모델 A */}
        <section className={\`rounded-3xl p-6 sm:p-12 \${cardBg} relative\`}>`;

const targetSection11End = `          <div className="flex justify-between items-center border-t border-neutral-200/20 pt-6 mt-8 text-[11px] sm:text-xs font-bold text-slate-500">
            <span>* 120pie & coffee 샵인샵 특화 패키지 가이드 기준</span>
            <span>Slide 11 / 16</span>
          </div>
        </section>`;

// Let's replace the whole Slide 11 block
const startIdx = code.indexOf(targetSection11Start);
const endIdx = code.indexOf(targetSection11End) + targetSection11End.length;

if (startIdx !== -1 && endIdx !== -1) {
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
                운영 중인 카페, 분식집 등의 설비를 그대로 보존하며 도입하는 샵인샵 전용 비즈니스 모델입니다. (부가세 별도)
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
        </section>`;

  code = code.substring(0, startIdx) + slide11Code + code.substring(endIdx);
  console.log("Updated Slide 11 successfully!");
} else {
  console.error("Could not find Slide 11 start or end indexes!");
}

// 6. Update Slide 12: Model B Budget
code = code.replace(
  '모델 B: 8~10평 컴팩트 매장',
  '모델 B: 소자본 하이브리드 창업'
);

code = code.replace(
  `<span className={textHighlight}>1인 운영 최적화</span> 실속형 카페`,
  `인테리어 거품을 제거한, <span className={textHighlight}>실속 창업 솔루션 980만 원</span>`
);

const targetModelBDetails = `<div className={\`lg:col-span-4 p-6 rounded-2xl text-left flex flex-col justify-between \${innerCardBgAccent} \${innerCardHover}\`}>
              <span className={\`text-[10px] font-black \${textDesc} uppercase tracking-wider block\`}>MODEL B BUDGET</span>
              <div className={\`space-y-3 border-b \${isPink ? "border-neutral-805" : "border-amber-200/35"} pb-4 my-3\`}>
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className={textDesc}>가맹 계약비</span>
                  <span className={\`\${textTitle} font-extrabold\`}>200만 원</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className={textDesc}>인테리어 (10평 기준)</span>
                  <span className={\`\${textTitle} font-extrabold\`}>1,500만 원</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className={textDesc}>간판 및 기기 세팅</span>
                  <span className={\`\${textTitle} font-extrabold\`}>800만 원</span>
                </div>
              </div>
              <div className="flex justify-between items-center font-black">
                <span className={\`text-xs \${textTitle}\`}>예상 창업 비용</span>
                <span className={\`text-base \${isPink ? "text-rose-500" : "text-amber-500"}\`}>2,500만 원 대</span>
              </div>
            </div>`;

const replacementModelBDetails = `<div className={\`lg:col-span-4 p-6 rounded-2xl text-left flex flex-col justify-between \${innerCardBgAccent} \${innerCardHover}\`}>
              <span className={\`text-[10px] font-black \${textDesc} uppercase tracking-wider block\`}>MODEL B DETAILS</span>
              <div className={\`space-y-2.5 border-b \${isPink ? "border-neutral-805" : "border-amber-200/35"} pb-3 my-2.5\`}>
                {[
                  { label: "가맹 계약비", price: "100만 원" },
                  { label: "전용 장비 공급", price: "150만 원" },
                  { label: "전면 간판 및 내외장사인", price: "300만 원" },
                  { label: "초도 물품 & 부자재", price: "300만 원" },
                  { label: "본사 초밀착 홍보비", price: "130만 원" }
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs font-bold">
                    <span className={textDesc}>{item.label}</span>
                    <span className={\`\${textTitle} font-extrabold\`}>{item.price}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center font-black pt-1.5">
                <span className={\`text-xs \${textTitle}\`}>총 창업 비용</span>
                <span className={\`text-base \${isPink ? "text-rose-500" : "text-amber-500"}\`}>980만 원</span>
              </div>
            </div>`;

code = code.replace(targetModelBDetails, replacementModelBDetails);

// 7. Update Slide 13: Model C Budget
code = code.replace(
  '모델 C: 15평 이상 프리미엄 카페',
  '모델 C: 신규 가맹 정식 창업'
);

code = code.replace(
  `<span className={textHighlight}>고객 체류 시간</span>을 늘리는 프리미엄형`,
  `15평 기준 독보적 전경, <span className={textHighlight}>플래그십 카페 6,518만 원</span>`
);

const targetModelCDetails = `<div className={\`lg:col-span-4 p-6 rounded-2xl text-left flex flex-col justify-between \${innerCardBgAccent} \${innerCardHover}\`}>
              <span className={\`text-[10px] font-black \${textDesc} uppercase tracking-wider block\`}>MODEL C BUDGET</span>
              <div className={\`space-y-3 border-b \${isPink ? "border-neutral-805" : "border-amber-200/35"} pb-4 my-3\`}>
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className={textDesc}>가맹 계약 및 교육</span>
                  <span className={\`\${textTitle} font-extrabold\`}>300만 원</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className={textDesc}>인테리어 (15평 기준)</span>
                  <span className={\`\${textTitle} font-extrabold\`}>2,200만 원</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className={textDesc}>기기 설비 및 집기</span>
                  <span className={\`\${textTitle} font-extrabold\`}>1,100만 원</span>
                </div>
              </div>
              <div className="flex justify-between items-center font-black">
                <span className={\`text-xs \${textTitle}\`}>예상 창업 비용</span>
                <span className={\`text-base \${isPink ? "text-rose-500" : "text-amber-500"}\`}>3,600만 원 대</span>
              </div>
            </div>`;

const replacementModelCDetails = `<div className={\`lg:col-span-4 p-5 rounded-2xl text-left flex flex-col justify-between \${innerCardBgAccent} \${innerCardHover}\`}>
              <span className={\`text-[10px] font-black \${textDesc} uppercase tracking-wider block\`}>MODEL C DETAILS</span>
              <div className={\`space-y-2 border-b \${isPink ? "border-neutral-805" : "border-amber-200/35"} pb-2.5 my-2\`}>
                {[
                  { label: "가맹 계약 및 교육비", price: "500만 원" },
                  { label: "본사 초도 자재/물품", price: "440만 원" },
                  { label: "가맹 계약 이행 보증금", price: "100만 원" },
                  { label: "인테리어 (15평 기준)", price: "2,850만 원" },
                  { label: "주방 집기 및 핵심 장비", price: "2,200만 원" },
                  { label: "외부 간판 및 내외장사인", price: "330만 원" },
                  { label: "초도 집기 및 POS 시스템", price: "440만 원" }
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-[11px] font-bold">
                    <span className={textDesc}>{item.label}</span>
                    <span className={\`\${textTitle} font-extrabold\`}>{item.price}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center font-black pt-1">
                <span className={\`text-xs \${textTitle}\`}>총 창업 비용</span>
                <span className={\`text-base \${isPink ? "text-rose-500" : "text-amber-500"}\`}>6,518만 원</span>
              </div>
            </div>`;

code = code.replace(targetModelCDetails, replacementModelCDetails);

// 8. Update Slide 16: Info
const targetSlide16Text = `<p className={\`text-xs sm:text-sm md:text-base leading-relaxed \${textDesc}\`}>
              예비 가맹점주님의 기존 여건을 적극 존중하여 최저 비용으로 최대 효율을 뽑아내는 가이드를 약속드립니다. 지금 하단 상담 신청 폼에 연락처를 남겨주세요.
            </p>`;

const replacementSlide16Text = `<p className={\`text-xs sm:text-sm md:text-base leading-relaxed \${textDesc}\`}>
              예비 가맹점주님의 기존 여건을 적극 존중하여 최저 비용으로 최대 효율을 뽑아내는 가이드를 약속드립니다. 지금 하단 상담 신청 폼에 연락처를 남겨주세요.
            </p>
            
            <div className={\`p-5 rounded-2xl \${innerCardBg} border \${isPink ? "border-neutral-800" : "border-amber-200/40"} max-w-lg mx-auto text-left space-y-2.5 text-xs font-semibold \${textDesc} my-6\`}>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full"></span>
                <span><strong>대표 가맹 문의:</strong> 1566-3594</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full"></span>
                <span><strong>공식 웹사이트:</strong> www.120piecoffee.com</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full"></span>
                <span><strong>가맹 본사 정보:</strong> (주)고우웰라이프 | 대표: 이사근</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full"></span>
                <span><strong>주소:</strong> 경기도 의왕시 오봉산단1로 12, 에이스하이테크비전21, 203호</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full"></span>
                <span><strong>이메일:</strong> reconisg@naver.com</span>
              </div>
            </div>`;

code = code.replace(targetSlide16Text, replacementSlide16Text);

fs.writeFileSync(filePath, code, 'utf8');
console.log("Successfully wrote all updates to Franchise2PageClient.tsx!");
