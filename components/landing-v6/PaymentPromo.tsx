"use client";

import { motion } from "framer-motion";
import { CreditCard, Percent, Info, CheckCircle2 } from "lucide-react";

interface PaymentPromoProps {
  bottomWaveColor?: string;
}

export default function PaymentPromo({ bottomWaveColor }: PaymentPromoProps) {
  const promoProducts = [
    {
      id: "shop-pie",
      name: "샵인샵 (120pie)",
      desc: "디저트 단일 라인업 추가 패키지",
      totalPrice: "480만원",
      monthlyPay: "100,000원",
      normalInterest: "20%",
      subsidy: "10%",
      finalInterest: "10%",
      benefits: [
        "120겹파이 베이커리 샵인샵 도입 최적화",
        "본사 이자 10% 다이렉트 지원 적용",
        "하루 약 3,300원으로 고효율 디저트 라인업 추가"
      ]
    },
    {
      id: "shop-egg",
      name: "샵인샵 (egg120)",
      desc: "계란빵 단일 라인업 추가 패키지",
      totalPrice: "360만원",
      monthlyPay: "75,000원",
      normalInterest: "20%",
      subsidy: "10%",
      finalInterest: "10%",
      benefits: [
        "egg120 프리미엄 쌀 계란빵 패키지",
        "본사 이자 10% 지원으로 이자 부담 반감",
        "월 7만 5천원으로 안정적인 시그니처 메뉴 확보"
      ]
    },
    {
      id: "shop-dual",
      name: "샵인샵 (pie & egg)",
      desc: "파이와 계란빵 듀얼 결합 패키지",
      totalPrice: "760만원",
      monthlyPay: "158,333원",
      normalInterest: "20%",
      subsidy: "10%",
      finalInterest: "10%",
      benefits: [
        "파이 + 계란빵 결합을 통한 매출 극대화",
        "본사 10% 이자 지원 동일 적용",
        "월 15만 원대 납입으로 두 가지 핫 브랜드를 동시에"
      ]
    },
    {
      id: "hybrid",
      name: "하이브리드 창업",
      desc: "기존 매장 활용 업종 전환 모델",
      totalPrice: "1,078만원",
      monthlyPay: "224,580원",
      normalInterest: "20%",
      subsidy: "10%",
      finalInterest: "10%",
      benefits: [
        "기존 집기 최대 활용, 최소 부품 도입 비용",
        "본사 이자 10% 특별 지원 프로그램 적용",
        "소자본 하이브리드 창업을 부담 없이 분납 실행"
      ]
    }
  ];

  return (
    <section id="payment-promo" className="relative bg-gradient-to-b from-[#F5F7FA] to-[#E4E8F0] dark:from-[#111625] dark:to-[#0B0E17] text-neutral-900 dark:text-neutral-100 pt-20 pb-12 sm:pt-28 sm:pb-16 overflow-hidden transition-colors duration-300">
      
      {/* Background visual decorative glows */}
      <div className="absolute -top-40 left-1/4 w-[500px] h-[500px] bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 right-1/4 w-[500px] h-[500px] bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        
        {/* Section Header: Side-by-side on desktop */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-10 lg:gap-16 mb-16">
          <div className="text-left max-w-2xl space-y-4 flex-1">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-full bg-[#0F3587]/10 dark:bg-blue-500/20 text-[#0F3587] dark:text-blue-300 border border-[#0F3587]/20 dark:border-blue-500/30 text-xs font-black uppercase tracking-widest"
            >
              <CreditCard className="w-3.5 h-3.5 text-[#0F3587] dark:text-amber-300" />
              <span>Shinhan Card Financial Support</span>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl sm:text-5xl font-black text-neutral-900 dark:text-white tracking-tight leading-tight"
            >
              신한카드 48개월 슬림할부 프로모션
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed"
            >
              신한카드로 창업 및 도입 비용 결제 시, 이자의 절반(10%)을 본사에서 지원하여<br className="hidden sm:inline" />
              무이자 수준의 실질 부담으로 48개월간 가볍게 나누어 납입할 수 있는 특별 결제 지원 상품입니다.
            </motion.p>
          </div>

          {/* Premium Floating Credit Card Visual representation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, rotateY: -10 }}
            whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, type: "spring", stiffness: 80 }}
            className="w-72 h-44 shrink-0 select-none perspective-[1000px] group"
          >
            <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-[#0F3587] to-[#0A2052] p-5 shadow-2xl transition-transform duration-500 transform-style-3d group-hover:rotate-y-12 group-hover:-rotate-x-6 group-hover:scale-105 border border-white/10 flex flex-col justify-between text-white text-left overflow-hidden">
              {/* Glossy Overlay Reflector */}
              <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000" />
              
              {/* Card Header: Brand logo details and chip */}
              <div className="flex justify-between items-start">
                <div className="font-sans font-black tracking-wide text-sm flex flex-col leading-none">
                  <span className="text-[#F5AC00]">SHINHAN</span>
                  <span className="text-white text-[9px] tracking-[0.15em] mt-0.5">CARD</span>
                </div>
                {/* Gold EMV Chip */}
                <div className="w-9 h-7 rounded bg-gradient-to-br from-amber-200 to-yellow-500 border border-amber-600/30 flex flex-col justify-between p-1.5">
                  <div className="h-[2px] bg-amber-800/20 rounded" />
                  <div className="h-[2px] bg-amber-800/20 rounded" />
                  <div className="h-[2px] bg-amber-800/20 rounded" />
                </div>
              </div>

              {/* Card Middle: Promotional installment detail */}
              <div className="space-y-0.5 mt-2">
                <span className="text-[9px] font-bold text-neutral-300 tracking-wider">SPECIAL FINANCIAL PROMOTION</span>
                <div className="text-lg font-black tracking-wider text-[#F5AC00] drop-shadow-md">
                  48개월 슬림할부
                </div>
              </div>

              {/* Card Footer: membership and card logo circle */}
              <div className="flex justify-between items-end mt-4">
                <span className="text-[9px] font-mono tracking-widest text-neutral-300">120PIE PARTNERSHIP</span>
                <div className="flex items-center gap-1">
                  <div className="w-5 h-5 rounded-full bg-[#F5AC00] opacity-90 flex items-center justify-center text-[7px] font-black text-[#0F3587]">
                    S
                  </div>
                  <span className="text-[8px] font-bold text-white tracking-widest">SH</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Promotion Details (1-Column Stack with Horizontal Card Layout) */}
        <div className="space-y-6 max-w-4xl mx-auto">
          {promoProducts.map((p, idx) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="bg-white dark:bg-neutral-800 border border-neutral-200/60 dark:border-neutral-700/60 hover:border-blue-500/30 dark:hover:border-blue-400/40 rounded-[2rem] p-6 sm:p-8 transition-all duration-300 shadow-md hover:shadow-xl shadow-neutral-200/50 dark:shadow-none"
            >
              <div className="flex flex-col lg:flex-row justify-between items-stretch gap-6 lg:gap-10">
                
                {/* Left Side: Info & Benefits */}
                <div className="flex-1 flex flex-col justify-between text-left space-y-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black tracking-wider px-2.5 py-0.5 rounded bg-blue-500/10 dark:bg-blue-500/20 text-[#0F3587] dark:text-blue-300">
                        신한48슬림할부 적용
                      </span>
                      <span className="text-[10px] font-black text-amber-600 dark:text-amber-300 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20">10% 본사 지원</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black mt-3.5 text-neutral-900 dark:text-white">
                      {p.name}
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 font-bold mt-1">{p.desc}</p>
                  </div>

                  {/* Features list */}
                  <ul className="space-y-3 pt-2">
                    {p.benefits.map((b, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-2.5 text-xs sm:text-[13px] text-neutral-600 dark:text-neutral-300 leading-relaxed font-semibold">
                        <CheckCircle2 className="w-4 h-4 text-[#0F3587] dark:text-blue-400 shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Right Side: Math breakdown & Price Tags (with adjusted margins and padding) */}
                <div className="w-full lg:w-[360px] shrink-0 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-neutral-200/80 dark:border-neutral-700/80 pt-8 lg:pt-2 lg:pl-12 text-left">
                  
                  {/* Math Interest Rate Box - Added extra margins and padding to breathe */}
                  <div className="space-y-4">
                    <div className="bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200/80 dark:border-neutral-700/80 rounded-2xl p-5 space-y-2.5 text-xs font-semibold text-neutral-600 dark:text-neutral-300 shadow-inner">
                      <div className="flex justify-between">
                        <span>정상 할부 이자율</span>
                        <span className="line-through text-neutral-400 dark:text-neutral-500">{p.normalInterest}</span>
                      </div>
                      <div className="flex justify-between text-rose-500 font-bold">
                        <span>본사 이자 지원율</span>
                        <span>-{p.subsidy}</span>
                      </div>
                      <div className="flex justify-between border-t border-neutral-200 dark:border-neutral-700 pt-3 text-neutral-900 dark:text-white font-extrabold">
                        <span className="flex items-center gap-1">
                          <Percent className="w-3.5 h-3.5 text-[#0F3587] dark:text-blue-400" /> 최종 고객 부담
                        </span>
                        <span className="text-[#0F3587] dark:text-blue-400 font-black text-xs sm:text-sm">{p.finalInterest}</span>
                      </div>
                    </div>
                  </div>

                  {/* Monthly Pricing Block - Padded beautifully */}
                  <div className="mt-8 space-y-1">
                    <div className="flex justify-between text-xs text-neutral-400 dark:text-neutral-500 font-bold">
                      <span>48개월 총 결제액</span>
                      <span className="text-neutral-500 dark:text-neutral-400">{p.totalPrice}</span>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs text-neutral-600 dark:text-neutral-400 font-bold">월 납입액</span>
                      <strong className="text-2xl sm:text-3xl font-black text-[#0F3587] dark:text-amber-400 tracking-tight">
                        {p.monthlyPay}
                      </strong>
                    </div>
                  </div>

                </div>

              </div>
            </motion.div>
          ))}
        </div>

        {/* Guidelines / Notices */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-4xl mx-auto mt-12 p-6 sm:p-7 rounded-3xl border border-neutral-200/80 dark:border-neutral-700/60 bg-white dark:bg-neutral-800 shadow-sm text-[11px] sm:text-xs text-neutral-600 dark:text-neutral-400 space-y-3.5 text-left"
        >
          <div className="flex items-center gap-1.5 text-neutral-900 dark:text-white font-black mb-1.5">
            <Info className="w-4 h-4 text-[#0F3587] dark:text-blue-400 shrink-0" />
            <span>신한카드 48개월 슬림할부 이용 유의사항</span>
          </div>
          <p className="flex items-start gap-1.5 font-semibold">
            <span className="text-[#0F3587] dark:text-blue-400 shrink-0">•</span>
            <span>본 할부 금융 상품은 신한카드 소지자라면 누구나 한도 범위 내에서 카드 종류에 무관하게 사용하실 수 있습니다.</span>
          </p>
          <p className="flex items-start gap-1.5 font-semibold">
            <span className="text-[#0F3587] dark:text-blue-400 shrink-0">•</span>
            <span>정상 할부 이자율 20% 중 본사에서 10%의 이자 비용을 직접 캐시백/보전하는 방식으로 실질 고객 부담 이율 10%를 완성한 파격적인 가맹점 상생 지원 프로모션입니다.</span>
          </p>
          <p className="flex items-start gap-1.5 font-semibold text-rose-600 dark:text-rose-400">
            <span className="text-rose-500 shrink-0">•</span>
            <span>신규가맹 계약을 통한 오프라인 표준 매장 신규 창업에는 본 슬림할부 프로모션이 적용되지 않으며, 샵인샵 및 하이브리드 창업 전환 시에만 제한적으로 특별 적용됩니다.</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
