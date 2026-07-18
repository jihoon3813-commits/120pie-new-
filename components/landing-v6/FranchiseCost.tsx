"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coins, CheckCircle, Info, Layers, RefreshCw, ShoppingBag, Sparkles } from "lucide-react";

type TabId = "shop120" | "shopegg120" | "shopegg" | "hybrid" | "franchise";

interface FranchiseCostProps {
  bottomWaveColor?: string;
}

export default function FranchiseCost({ bottomWaveColor }: FranchiseCostProps) {
  const [activeTab, setActiveTab] = useState<TabId>("shop120");

  // 1. 신규 가맹 창업 데이터
  const franchiseBasic = [
    { cat: "가맹비", detail: "상권 내 독점 사용권, 상표 사용권, 교육 및 개점 준비 지원", price: "500만원", note: "소멸성" },
    { cat: "초도 물품비", detail: "원부자재 초도 패키지, 유니폼, 메뉴판, 배너, 홍보물 일체", price: "440만원", note: "-" },
    { cat: "계약이행 보증금", detail: "가맹 계약 준수 및 이행을 위한 보증 자금", price: "100만원", note: "만기 상환" },
    { cat: "로열티", detail: "매월 고정 발생하는 가맹본부 상표권 및 시스템 이용료", price: "11만원", note: "월납" }
  ];

  const franchiseOther = [
    { cat: "인테리어 / 시설", detail: "목공, 전기, 도장, 조명, 타일, 미장, 설계 및 감리 (15평 기준)", price: "2,850만원", note: "평당 190만원" },
    { cat: "주방 / 주방 집기류", detail: "오븐기, 베이킹 머신, 싱크대, 디스펜서, 제빙기, 냉장고 등", price: "2,200만원", note: "기본 세팅 기준" },
    { cat: "간판 및 사인물", detail: "전면 LED 채널 간판, 돌출 간판, 내부 그래픽 사인 일체", price: "330만원", note: "현장 상황별 상이" },
    { cat: "기타 집기", detail: "키오스크 무인 결제기, 포스(POS), 주방 관련 소집기, 의탁자", price: "440만원", note: "-" }
  ];

  // 2. 하이브리드 창업 데이터
  const hybridCosts = [
    { cat: "가맹비", detail: "120겹파이 브랜드에 대한 상권 내 독점 사용권, 교육 및 개점 지원 등", price: "100만원", note: "소멸성" },
    { cat: "장비", detail: "파이 머신, 계란빵 머신 외 주요 조리 전용 인프라 장비", price: "150만원", note: "기본 품목 외 별도" },
    { cat: "간판", detail: "전면 돌출 실사 어닝 및 공식 브랜드 외부 사인 일체", price: "300만원", note: "현장 상황에 따라 상이" },
    { cat: "물품(초도)", detail: "식재료, 원부자재, 유니폼, 메뉴판, 배너, 현수막, 시트지 및 각종 홍보물", price: "300만원", note: "-" },
    { cat: "홍보비", detail: "사전 이벤트, 네이버 플레이스 등록, 배달플랫폼(배민/쿠팡/요기요) 세팅 대행, SNS 및 타깃 마케팅", price: "130만원", note: "-" }
  ];

  // 3. 샵인샵 120pie 데이터
  const shop120Costs = [
    { cat: "전용 베이킹 인프라", detail: "자체 금형 오리지널 파이 머신 1ea", note: "120겹 파이 결을 살리는 전용 베이킹 머신" },
    { cat: "초도 원재료 패키지", detail: "시그니처 패스트리 생지 1box + 프리미엄 필링 9종 각 1kg", note: "파이 약 200개 분량 생지와 대표 맛 필링 초도 지원" },
    { cat: "매장 홍보물 세트", detail: "공식 X배너 2종 + POP 5종 + 메뉴 홍보 포스터 8종", note: "매장 내외부 고객 시선을 끌기 위한 홍보물 구성" },
    { cat: "판매 촉진 비주얼 세트", detail: "파이 모형 4종 + 배달 플랫폼용 실사 이미지", note: "오프라인 진열과 배달앱 등록에 활용 가능한 비주얼 자료" },
    { cat: "운영 정착 지원", detail: "포장 부자재 세트 + 오븐 설치 및 1:1 조리 교육", note: "포장 운영, 장비 세팅, 현장 조리 교육까지 지원" }
  ];

  // 4. 샵인샵 pie & egg 데이터 (에그120 프리미엄 패키지)
  const shopeggCosts = [
    { cat: "전용 조리 인프라", detail: "에그120 계란빵 전용 머신 1대", note: "10구 동시 생산이 가능한 에그120 전용 기기" },
    { cat: "초도 원재료 패키지", detail: "시그니처 전용 반죽 30kg + 토핑 식재료 4종 + 동물복지 유정란 120ea", note: "계란빵 약 720개 조리 가능한 반죽과 핵심 식재료 초도 지원" },
    { cat: "매장 홍보물 세트", detail: "공식 X배너 1ea + 테이블/카운터 POP 1ea + 홍보 포스터 3종", note: "매장 내외부에서 egg120 메뉴를 노출하기 위한 홍보물 구성" },
    { cat: "판매 촉진 비주얼 세트", detail: "계란빵 모형 4종 + 전용 미니 쇼케이스 + 동물복지 인증 매장 판넬", note: "카운터 진열, 신뢰도 강화, 주문 유도를 위한 시각 자료" },
    { cat: "운영 정착 지원", detail: "배달 플랫폼 셋업 대행 + 포장/부자재 패키지 + 기기 설치 및 1:1 교육", note: "배달앱 등록, 포장 운영, 장비 설치, 현장 교육까지 지원" }
  ];

  const tabList = [
    { id: "shop120", label: "샵인샵 (120pie)", desc: "디저트 단일 라인업 추가 패키지" },
    { id: "shopegg120", label: "샵인샵 (egg120)", desc: "계란빵 단일 라인업 추가 패키지" },
    { id: "shopegg", label: "샵인샵 (pie & egg)", desc: "파이와 계란빵 듀얼 패키지" },
    { id: "hybrid", label: "하이브리드 창업", desc: "기존 매장 활용 업종 전환 모델" },
    { id: "franchise", label: "신규 가맹 창업", desc: "15평 기준 표준 가맹 개설 모델" }
  ];

  return (
    <section id="cost" className="relative bg-gradient-to-b from-[#0F3587] to-[#0A2052] dark:from-[#0a255c] dark:to-[#06173b] text-white pt-8 pb-10 sm:pt-36 sm:pb-36 overflow-hidden transition-colors duration-300">
      
      {/* Top Wavy transition from CustomerReviews (Light neutral-50) */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none z-10 -translate-y-[1px]">
        <svg viewBox="0 0 1200 100" preserveAspectRatio="none" className="relative block w-full h-[24px] sm:h-[40px] lg:h-[55px] text-neutral-50 dark:text-neutral-900 fill-current">
          <path d="M 0 50 Q 25 10, 50 50 Q 75 90, 100 50 Q 125 10, 150 50 Q 175 90, 200 50 Q 225 10, 250 50 Q 275 90, 300 50 Q 325 10, 350 50 Q 375 90, 400 50 Q 425 10, 450 50 Q 475 90, 500 50 Q 525 10, 550 50 Q 575 90, 600 50 Q 625 10, 650 50 Q 675 90, 700 50 Q 725 10, 750 50 Q 775 90, 800 50 Q 825 10, 850 50 Q 875 90, 900 50 Q 925 10, 950 50 Q 975 90, 1000 50 Q 1025 10, 1050 50 Q 1075 90, 1100 50 Q 1125 10, 1150 50 Q 1175 90, 1200 50 L 1200 0 L 0 0 Z" />
        </svg>
      </div>

      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-5 sm:mb-18 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-full bg-white/10 text-white border border-white/10 text-xs font-black uppercase tracking-widest"
          >
            <Coins className="w-3.5 h-3.5 text-amber-300" />
            <span>Franchise Startup Models</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.2]"
          >
            거품 없는 투명한 창업 비용
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl font-semibold text-white max-w-2xl mx-auto leading-relaxed"
          >
            본사 노하우를 바탕으로 예비 점주님의 매장 상태와 자본금 규모에 가장 이상적인 형태의 맞춤 창업 플랜을 투명하게 제시해 드립니다.
          </motion.p>
        </div>

        {/* 🌟 Tab Navigation (Grid on mobile, flex/grid on desktop to fit in 1 line) */}
        <div className="grid grid-cols-2 md:grid-cols-5 items-stretch justify-center gap-2 sm:gap-4 max-w-5xl mx-auto mb-5 sm:mb-20 w-full px-1 sm:px-0">
          {tabList.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabId)}
                className={`px-3 py-3 sm:px-4 sm:py-5 rounded-2xl text-left flex flex-col justify-center w-full border shrink-0 transition-all duration-300 ${
                  isActive
                    ? "bg-amber-400 border-amber-400 text-neutral-950 shadow-lg shadow-amber-400/30"
                    : "bg-[#0b1d44] border-white/10 hover:bg-[#122e6b] hover:border-white/20 text-white"
                }`}
              >
                <span className="text-xs sm:text-base md:text-[17px] font-black block">{tab.label}</span>
                <span className={`text-[9px] sm:text-xs md:text-xs font-bold block mt-1 leading-snug ${
                  isActive ? "text-neutral-850" : "text-white/60"
                }`}>
                  {tab.desc}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tab Contents Container */}
        <div className="relative min-h-[250px] sm:min-h-[400px]">
          <AnimatePresence mode="wait">
            
            {/* 1. 신규 가맹 창업 탭 */}
            {activeTab === "franchise" && (
              <motion.div
                key="franchise"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-12"
              >
                {/* Total Cost Highlight Card */}
                <div className="max-w-4xl mx-auto bg-gradient-to-br from-white via-neutral-50 to-neutral-100 border-2 border-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl text-neutral-900">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-[#0F3587] text-white rounded-2xl shadow-md">
                      <Coins className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                      <span className="text-sm font-black text-neutral-500 uppercase tracking-widest block">Standard Estimate</span>
                      <h3 className="text-xl sm:text-3xl font-black text-neutral-900 mt-0.5">표준 창업 개설 비용 합계 (15평 기준)</h3>
                    </div>
                  </div>
                  <div className="text-center sm:text-right shrink-0">
                    <span className="text-sm font-bold text-neutral-500 block">VAT 포함</span>
                    <div className="flex items-baseline justify-center sm:justify-end gap-1.5 mt-0.5">
                      <strong className="text-4xl sm:text-5xl md:text-6xl font-black text-rose-600 tracking-tight">6,518</strong>
                      <span className="text-2xl font-black text-neutral-900">만원</span>
                    </div>
                  </div>
                </div>

                {/* Tables Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto items-stretch">
                  {/* Table 1 */}
                  <div className="p-4 sm:p-8 rounded-[2rem] border-2 border-white bg-gradient-to-br from-white to-neutral-100 shadow-2xl flex flex-col justify-between text-neutral-900">
                    <div>
                      <div className="flex justify-between items-center mb-6">
                        <span className="text-base sm:text-xl md:text-2xl font-black text-[#0F3587] tracking-tight flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-[#0F3587]" /> 기본 비용 (1,040만원)
                        </span>
                        <span className="text-xs sm:text-sm text-neutral-500 font-bold">VAT 포함</span>
                      </div>
                      <div className="overflow-x-auto rounded-2xl border border-neutral-250 bg-white">
                        <table className="w-full text-left border-collapse border border-neutral-200 min-w-[420px] lg:min-w-0">
                          <thead>
                            <tr className="bg-neutral-100">
                              <th className="py-3 px-3 sm:py-4 sm:px-4 font-black w-[20%] text-xs sm:text-base md:text-lg !text-neutral-800 border border-neutral-200">구분</th>
                              <th className="py-3 px-3 sm:py-4 sm:px-4 font-black w-[50%] text-[11px] sm:text-base md:text-lg !text-neutral-800 border border-neutral-200">세부 내용</th>
                              <th className="py-3 px-3 sm:py-4 sm:px-4 font-black text-right w-[18%] text-xs sm:text-base md:text-lg !text-neutral-800 border border-neutral-200">금액</th>
                              <th className="py-3 px-3 sm:py-4 sm:px-4 font-black w-[12%] text-xs sm:text-base md:text-lg !text-neutral-800 border border-neutral-200">비고</th>
                            </tr>
                          </thead>
                          <tbody>
                            {franchiseBasic.map((row, idx) => (
                              <tr key={idx} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors font-semibold">
                                <td className="py-3 px-3 sm:py-4.5 sm:px-4 text-xs sm:text-base md:text-lg !text-neutral-900 font-black border border-neutral-200">{row.cat}</td>
                                <td className="py-3 px-3 sm:py-4.5 sm:px-4 text-[11px] sm:text-sm md:text-base !text-neutral-700 font-medium leading-relaxed border border-neutral-200">{row.detail}</td>
                                <td className="py-3 px-3 sm:py-4.5 sm:px-4 text-right text-xs sm:text-base md:text-lg font-black text-rose-600 whitespace-nowrap border border-neutral-200">{row.price}</td>
                                <td className="py-3 px-3 sm:py-4.5 sm:px-4 text-[10px] sm:text-xs md:text-base !text-neutral-500 font-medium border border-neutral-200">{row.note}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Table 2 */}
                  <div className="p-4 sm:p-8 rounded-[2rem] border-2 border-white bg-gradient-to-br from-white to-neutral-100 shadow-2xl flex flex-col justify-between text-neutral-900">
                    <div>
                      <div className="flex justify-between items-center mb-6">
                        <span className="text-base sm:text-xl md:text-2xl font-black text-[#0F3587] tracking-tight flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-[#0F3587]" /> 기타 비용 (5,478만원)
                        </span>
                        <span className="text-xs sm:text-sm text-neutral-500 font-bold">VAT 포함</span>
                      </div>
                      <div className="overflow-x-auto rounded-2xl border border-neutral-250 bg-white">
                        <table className="w-full text-left border-collapse border border-neutral-200 min-w-[420px] lg:min-w-0">
                          <thead>
                            <tr className="bg-neutral-100">
                              <th className="py-3 px-3 sm:py-4 sm:px-4 font-black w-[22%] text-xs sm:text-base md:text-lg !text-neutral-800 border border-neutral-200">구분</th>
                              <th className="py-3 px-3 sm:py-4 sm:px-4 font-black w-[48%] text-[11px] sm:text-base md:text-lg !text-neutral-800 border border-neutral-200">세부 내용</th>
                              <th className="py-3 px-3 sm:py-4 sm:px-4 font-black text-right w-[18%] text-xs sm:text-base md:text-lg !text-neutral-800 border border-neutral-200">금액</th>
                              <th className="py-3 px-3 sm:py-4 sm:px-4 font-black w-[12%] text-xs sm:text-base md:text-lg !text-neutral-800 border border-neutral-200">비고</th>
                            </tr>
                          </thead>
                          <tbody>
                            {franchiseOther.map((row, idx) => (
                              <tr key={idx} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors font-semibold">
                                <td className="py-3 px-3 sm:py-4.5 sm:px-4 text-xs sm:text-base md:text-lg !text-neutral-900 font-black border border-neutral-200">{row.cat}</td>
                                <td className="py-3 px-3 sm:py-4.5 sm:px-4 text-[11px] sm:text-sm md:text-base !text-neutral-700 font-medium leading-relaxed border border-neutral-200">{row.detail}</td>
                                <td className="py-3 px-3 sm:py-4.5 sm:px-4 text-right text-xs sm:text-base md:text-lg font-black text-rose-600 whitespace-nowrap border border-neutral-200">{row.price}</td>
                                <td className="py-3 px-3 sm:py-4.5 sm:px-4 text-[10px] sm:text-xs md:text-base !text-neutral-500 font-medium border border-neutral-200">{row.note}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 2. 하이브리드 창업 탭 */}
            {activeTab === "hybrid" && (
              <motion.div
                key="hybrid"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-12 max-w-6xl mx-auto"
              >
                {/* Total Cost Highlight Card */}
                <div className="max-w-4xl mx-auto bg-gradient-to-br from-white via-neutral-50 to-neutral-100 border-2 border-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl text-neutral-900">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-[#0F3587] text-white rounded-2xl shadow-md">
                      <RefreshCw className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                      <span className="text-sm font-black text-neutral-500 uppercase tracking-widest block">Hybrid Startup Model</span>
                      <h3 className="text-xl sm:text-3xl font-black text-neutral-900 mt-0.5">소자본 하이브리드 도입 비용 합계</h3>
                    </div>
                  </div>
                  <div className="text-center sm:text-right shrink-0">
                    <span className="text-sm font-bold text-neutral-500 block">VAT 포함</span>
                    <div className="flex items-baseline justify-center sm:justify-end gap-1.5 mt-0.5">
                      <strong className="text-4xl sm:text-5xl md:text-6xl font-black text-rose-600 tracking-tight">980</strong>
                      <span className="text-2xl font-black text-neutral-900">만원</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Left: 하이브리드 창업 소개 박스 */}
                  <div className="lg:col-span-4 p-6 sm:p-8 rounded-[2rem] border-2 border-amber-500/20 bg-gradient-to-br from-white to-neutral-100 text-neutral-900 shadow-2xl">
                    <span className="inline-block px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 text-[10px] font-black tracking-widest mb-4">
                      HYBRID CONCEPT
                    </span>
                    <h4 className="text-lg sm:text-2xl font-black text-neutral-900 mb-6">하이브리드 창업이란?</h4>
                    
                    <ul className="space-y-4 text-xs sm:text-sm md:text-base text-neutral-700 leading-relaxed">
                      <li className="flex items-start gap-2.5">
                        <span className="text-amber-500 font-bold mt-0.5">✓</span>
                        <span>인테리어와 주방 장비의 신설 부담을 완전히 없애고 간판과 사인물 교체만으로 경제적 창업</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="text-amber-500 font-bold mt-0.5">✓</span>
                        <span>기존 운영 매장의 기물을 최대로 살려 메뉴와 홍보를 중심으로 실질적인 매출 중점 관리</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="text-amber-500 font-bold mt-0.5">✓</span>
                        <span>불필요하게 매달 나가는 로열티 및 관리 수수료 등 추가 유지 비용 면제</span>
                      </li>
                    </ul>
                  </div>

                  {/* Right: 하이브리드 창업 표 */}
                  <div className="lg:col-span-8 p-4 sm:p-8 rounded-[2rem] border-2 border-white bg-gradient-to-br from-white to-neutral-100 shadow-2xl text-neutral-900">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-base sm:text-xl md:text-2xl font-black text-[#0F3587] tracking-tight flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-[#0F3587]" /> 하이브리드 개설 비용 명세
                      </span>
                      <span className="text-xs sm:text-sm text-neutral-500 font-bold">VAT 포함</span>
                    </div>

                    <div className="overflow-x-auto rounded-2xl border border-neutral-250 bg-white">
                      <table className="w-full text-left border-collapse border border-neutral-200 min-w-[420px] lg:min-w-0">
                        <thead>
                          <tr className="bg-neutral-100">
                            <th className="py-3 px-3 sm:py-4 sm:px-4 font-black w-[20%] text-xs sm:text-base md:text-lg !text-neutral-800 border border-neutral-200">구분</th>
                            <th className="py-3 px-3 sm:py-4 sm:px-4 font-black w-[50%] text-[11px] sm:text-base md:text-lg !text-neutral-800 border border-neutral-200">세부 내용</th>
                            <th className="py-3 px-3 sm:py-4 sm:px-4 font-black text-right w-[18%] text-xs sm:text-base md:text-lg !text-neutral-800 border border-neutral-200">금액</th>
                            <th className="py-3 px-3 sm:py-4 sm:px-4 font-black w-[12%] text-xs sm:text-base md:text-lg !text-neutral-800 border border-neutral-200">비고</th>
                          </tr>
                        </thead>
                        <tbody>
                          {hybridCosts.map((row, idx) => (
                            <tr key={idx} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors font-semibold">
                              <td className="py-3 px-3 sm:py-4.5 sm:px-4 text-xs sm:text-base md:text-lg !text-neutral-900 font-black border border-neutral-200">{row.cat}</td>
                              <td className="py-3 px-3 sm:py-4.5 sm:px-4 text-[11px] sm:text-sm md:text-base !text-neutral-700 font-medium leading-relaxed border border-neutral-200">{row.detail}</td>
                              <td className="py-3 px-3 sm:py-4.5 sm:px-4 text-right text-xs sm:text-base md:text-lg font-black text-rose-600 whitespace-nowrap border border-neutral-200">{row.price}</td>
                              <td className="py-3 px-3 sm:py-4.5 sm:px-4 text-[10px] sm:text-xs md:text-base !text-neutral-850 font-medium border border-neutral-200">{row.note}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 3. 샵인샵 (120pie) 탭 */}
            {activeTab === "shop120" && (
              <motion.div
                key="shop120"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-12 max-w-5xl mx-auto"
              >
                {/* Total Cost Highlight Card */}
                <div className="max-w-4xl mx-auto bg-gradient-to-br from-white via-neutral-50 to-neutral-100 border-2 border-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl text-neutral-900">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-[#0F3587] text-white rounded-2xl shadow-md">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                      <span className="text-sm font-black text-neutral-500 uppercase tracking-widest block">Shop-in-Shop Package</span>
                      <h3 className="text-xl sm:text-3xl font-black text-neutral-900 mt-0.5">120겹파이 올인원 패키지 도입 비용</h3>
                    </div>
                  </div>
                  <div className="text-center sm:text-right shrink-0">
                    <span className="text-sm font-bold text-neutral-400 block line-through mb-0.5">정가 5,500,000원</span>
                    <div className="flex items-baseline justify-center sm:justify-end gap-1.5">
                      <span className="text-sm font-bold text-neutral-500">도입 할인가</span>
                      <strong className="text-4xl sm:text-5xl md:text-6xl font-black text-rose-600 tracking-tight">440</strong>
                      <span className="text-2xl font-black text-neutral-900">만원</span>
                      <span className="text-xs text-neutral-500 ml-0.5">VAT 포함</span>
                    </div>
                  </div>
                </div>

                {/* Table */}
                <div className="p-4 sm:p-8 rounded-[2rem] border-2 border-white bg-gradient-to-br from-white to-neutral-100 shadow-2xl text-neutral-900">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-base sm:text-xl md:text-2xl font-black text-[#0F3587] tracking-tight flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-[#0F3587]" /> 120겹파이 올인원 패키지 상세 구성
                    </span>
                    <span className="text-xs sm:text-sm text-neutral-500 font-bold">도입가 440만원 (VAT 포함)</span>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-neutral-250 bg-white">
                    <table className="w-full text-left border-collapse border border-neutral-200 min-w-[420px] lg:min-w-0">
                      <thead>
                        <tr className="bg-neutral-100">
                          <th className="py-3 px-3 sm:py-4 sm:px-4 font-black w-[25%] text-xs sm:text-base md:text-lg !text-neutral-800 border border-neutral-200">구분</th>
                          <th className="py-3 px-3 sm:py-4 sm:px-4 font-black w-[40%] text-[11px] sm:text-base md:text-lg !text-neutral-800 border border-neutral-200">세부 내용</th>
                          <th className="py-3 px-3 sm:py-4 sm:px-4 font-black w-[35%] text-[11px] sm:text-base md:text-lg !text-neutral-800 border border-neutral-200">비고</th>
                        </tr>
                      </thead>
                      <tbody>
                        {shop120Costs.map((row, idx) => (
                          <tr key={idx} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors font-semibold">
                            <td className="py-3 px-3 sm:py-4.5 sm:px-4 text-xs sm:text-base md:text-lg font-black border border-neutral-200 !text-neutral-900">{row.cat}</td>
                            <td className="py-3 px-3 sm:py-4.5 sm:px-4 text-[11px] sm:text-sm md:text-base !text-neutral-700 font-medium leading-relaxed border border-neutral-200">{row.detail}</td>
                            <td className="py-3 px-3 sm:py-4.5 sm:px-4 text-[10px] sm:text-xs md:text-base !text-neutral-500 font-medium leading-relaxed border border-neutral-200">{row.note}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 3.5. 샵인샵 (egg120) 탭 */}
            {activeTab === "shopegg120" && (
              <motion.div
                key="shopegg120"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-12 max-w-5xl mx-auto"
              >
                {/* Total Cost Highlight Card */}
                <div className="max-w-4xl mx-auto bg-gradient-to-br from-white via-neutral-50 to-neutral-100 border-2 border-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl text-neutral-900">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-[#0F3587] text-white rounded-2xl shadow-md">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                      <span className="text-sm font-black text-neutral-500 uppercase tracking-widest block">Shop-in-Shop Package</span>
                      <h3 className="text-xl sm:text-3xl font-black text-neutral-900 mt-0.5">에그120 프리미엄 패키지 도입 비용</h3>
                    </div>
                  </div>
                  <div className="text-center sm:text-right shrink-0">
                    <span className="text-sm font-bold text-neutral-400 block line-through mb-0.5">정가 4,400,000원</span>
                    <div className="flex items-baseline justify-center sm:justify-end gap-1.5">
                      <span className="text-sm font-bold text-neutral-500">도입 할인가</span>
                      <strong className="text-4xl sm:text-5xl md:text-6xl font-black text-rose-600 tracking-tight">330</strong>
                      <span className="text-2xl font-black text-neutral-900">만원</span>
                      <span className="text-xs text-neutral-500 ml-0.5">VAT 포함</span>
                    </div>
                  </div>
                </div>

                {/* Table */}
                <div className="p-4 sm:p-8 rounded-[2rem] border-2 border-white bg-gradient-to-br from-white to-neutral-100 shadow-2xl text-neutral-900">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-base sm:text-xl md:text-2xl font-black text-[#0F3587] tracking-tight flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-[#0F3587]" /> 에그120 프리미엄 패키지 상세 구성
                    </span>
                    <span className="text-xs sm:text-sm text-neutral-500 font-bold">도입가 330만원 (VAT 포함)</span>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-neutral-250 bg-white">
                    <table className="w-full text-left border-collapse border border-neutral-200 min-w-[420px] lg:min-w-0">
                      <thead>
                        <tr className="bg-neutral-100">
                          <th className="py-3 px-3 sm:py-4 sm:px-4 font-black w-[25%] text-xs sm:text-base md:text-lg !text-neutral-800 border border-neutral-200">구분</th>
                          <th className="py-3 px-3 sm:py-4 sm:px-4 font-black w-[40%] text-[11px] sm:text-base md:text-lg !text-neutral-800 border border-neutral-200">세부 내용</th>
                          <th className="py-3 px-3 sm:py-4 sm:px-4 font-black w-[35%] text-[11px] sm:text-base md:text-lg !text-neutral-800 border border-neutral-200">비고</th>
                        </tr>
                      </thead>
                      <tbody>
                        {shopeggCosts.map((row, idx) => (
                          <tr key={idx} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors font-semibold">
                            <td className="py-3 px-3 sm:py-4.5 sm:px-4 text-xs sm:text-base md:text-lg font-black border border-neutral-200 !text-neutral-900">{row.cat}</td>
                            <td className="py-3 px-3 sm:py-4.5 sm:px-4 text-[11px] sm:text-sm md:text-base !text-neutral-700 font-medium leading-relaxed border border-neutral-200">{row.detail}</td>
                            <td className="py-3 px-3 sm:py-4.5 sm:px-4 text-[10px] sm:text-xs md:text-base !text-neutral-500 font-medium leading-relaxed border border-neutral-200">{row.note}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 4. 샵인샵 (pie & egg) 탭 */}
            {activeTab === "shopegg" && (
              <motion.div
                key="shopegg"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-12 max-w-6xl mx-auto"
              >
                {/* Total Cost Highlight Card */}
                <div className="max-w-4xl mx-auto bg-gradient-to-br from-white via-neutral-50 to-neutral-100 border-2 border-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl text-neutral-900">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-[#0F3587] text-white rounded-2xl shadow-md">
                      <Layers className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                      <span className="text-sm font-black text-neutral-500 uppercase tracking-widest block">Dual Brand Package</span>
                      <h3 className="text-xl sm:text-3xl font-black text-neutral-900 mt-0.5">120겹파이 & 에그120 패키지 결합 도입</h3>
                    </div>
                  </div>
                  <div className="text-center sm:text-right shrink-0">
                    <span className="text-sm font-bold text-neutral-450 block mb-0.5">파이 440만원 + 에그 330만원 결합 (결합 할인 적용)</span>
                    <div className="flex items-baseline justify-center sm:justify-end gap-1.5">
                      <span className="text-sm font-bold text-neutral-500">총 결합 도입가</span>
                      <strong className="text-4xl sm:text-5xl md:text-6xl font-black text-rose-600 tracking-tight">690</strong>
                      <span className="text-2xl font-black text-neutral-900">만원</span>
                      <span className="text-xs text-neutral-500 ml-0.5">VAT 포함</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                  {/* Table 1: 120겹파이 패키지 */}
                  <div className="p-4 sm:p-8 rounded-[2rem] border-2 border-white bg-gradient-to-br from-white to-neutral-100 shadow-2xl flex flex-col justify-between text-neutral-900">
                    <div>
                      <div className="flex justify-between items-center mb-6">
                        <span className="text-base sm:text-xl md:text-2xl font-black text-[#0F3587] tracking-tight flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-[#0F3587]" /> 120겹파이 올인원 패키지
                        </span>
                        <span className="text-xs sm:text-sm text-neutral-505 font-black">550만 ➔ 440만원</span>
                      </div>
                      <div className="overflow-x-auto rounded-2xl border border-neutral-250 bg-white">
                        <table className="w-full text-left border-collapse border border-neutral-200 min-w-[420px] lg:min-w-0">
                          <thead>
                            <tr className="bg-neutral-100">
                              <th className="py-3 px-3 font-black w-[28%] text-xs sm:text-base !text-neutral-800 border border-neutral-200">구분</th>
                              <th className="py-3 px-3 font-black w-[36%] text-[11px] sm:text-base !text-neutral-800 border border-neutral-200">세부 내용</th>
                              <th className="py-3 px-3 font-black w-[36%] text-[11px] sm:text-base !text-neutral-800 border border-neutral-200">비고</th>
                            </tr>
                          </thead>
                          <tbody>
                            {shop120Costs.map((row, idx) => (
                              <tr key={idx} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors font-semibold">
                                <td className="py-3 px-3 text-xs sm:text-base font-black leading-snug border border-neutral-200 !text-neutral-900">{row.cat}</td>
                                <td className="py-3 px-3 text-[11px] sm:text-sm md:text-base text-neutral-750 font-medium leading-relaxed border border-neutral-200">{row.detail}</td>
                                <td className="py-3 px-3 text-[10px] sm:text-xs md:text-base text-neutral-500 font-medium leading-relaxed border border-neutral-200">{row.note}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Table 2: 에그120 패키지 */}
                  <div className="p-4 sm:p-8 rounded-[2rem] border-2 border-white bg-gradient-to-br from-white to-neutral-100 shadow-2xl flex flex-col justify-between text-neutral-900">
                    <div>
                      <div className="flex justify-between items-center mb-6">
                        <span className="text-base sm:text-xl md:text-2xl font-black text-[#0F3587] tracking-tight flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-[#0F3587]" /> 에그120 프리미엄 패키지
                        </span>
                        <span className="text-xs sm:text-sm text-neutral-505 font-black">440만 ➔ 330만원</span>
                      </div>
                      <div className="overflow-x-auto rounded-2xl border border-neutral-250 bg-white">
                        <table className="w-full text-left border-collapse border border-neutral-200 min-w-[420px] lg:min-w-0">
                          <thead>
                            <tr className="bg-neutral-100">
                              <th className="py-3 px-3 font-black w-[28%] text-xs sm:text-base !text-neutral-800 border border-neutral-200">구분</th>
                              <th className="py-3 px-3 font-black w-[36%] text-[11px] sm:text-base !text-neutral-800 border border-neutral-200">세부 내용</th>
                              <th className="py-3 px-3 font-black w-[36%] text-[11px] sm:text-base !text-neutral-800 border border-neutral-200">비고</th>
                            </tr>
                          </thead>
                          <tbody>
                            {shopeggCosts.map((row, idx) => (
                              <tr key={idx} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors font-semibold">
                                <td className="py-3 px-3 text-xs sm:text-base font-black leading-snug border border-neutral-200 !text-neutral-900">{row.cat}</td>
                                <td className="py-3 px-3 text-[11px] sm:text-sm md:text-base text-neutral-750 font-medium leading-relaxed border border-neutral-200">{row.detail}</td>
                                <td className="py-3 px-3 text-[10px] sm:text-xs md:text-base text-neutral-500 font-medium leading-relaxed border border-neutral-200">{row.note}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Bottom Guidelines Notes */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-6xl mx-auto mt-12 p-5 sm:p-6 rounded-2xl border border-white/10 bg-white/5 text-[11px] sm:text-xs text-white/90 space-y-2.5 text-left"
        >
          <div className="flex items-center gap-1.5 text-white font-black mb-1.5">
            <Info className="w-4 h-4 text-amber-300" />
            <span>개설 유의사항 및 기본 조건</span>
          </div>
          <p className="flex items-start gap-1.5">
            <span className="text-amber-300 shrink-0">•</span>
            <span>신규 가맹 창업 비용은 15평 표준 매장을 기준으로 설계되었으며 점포의 실면적, 상권 입지 조건, 건물 노후화 등에 따라 공사 항목별 금액 변동이 있을 수 있습니다.</span>
          </p>
          <p className="flex items-start gap-1.5">
            <span className="text-amber-300 shrink-0">•</span>
            <span>인테리어 시공은 점주님께서 알고 계신 업체를 통하여 <strong>자체 직접 시공</strong>(개별 인테리어)이 가능하며, 이 경우 본사의 도면 설계 및 정밀 감리 비용이 별도로 발생합니다.</span>
          </p>
          <p className="flex items-start gap-1.5">
            <span className="text-amber-300 shrink-0">•</span>
            <span>별도 공사항목(외부 가스 관로 인입 및 계량기 신설, 주방 메인 급배수 배관설비 신설, 전기 증설 및 승압 공사, 냉난방 기기 도입, 철거 및 소방 인허가 등)은 임차 점포 조건에 따라 본사 별도 정산 또는 개인 시공을 필요로 합니다.</span>
          </p>
        </motion.div>

      </div>

      {/* Bottom Wavy transition to BrandStory (Light neutral-50) */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10 translate-y-[2px]">
        <svg viewBox="0 0 1200 100" preserveAspectRatio="none" className={`relative block w-full h-[24px] sm:h-[40px] lg:h-[55px] fill-current ${bottomWaveColor || "text-neutral-50 dark:text-neutral-900"}`}>
          <path d="M 0 50 Q 25 10, 50 50 Q 75 90, 100 50 Q 125 10, 150 50 Q 175 90, 200 50 Q 225 10, 250 50 Q 275 90, 300 50 Q 325 10, 350 50 Q 375 90, 400 50 Q 425 10, 450 50 Q 475 90, 500 50 Q 525 10, 550 50 Q 575 90, 600 50 Q 625 10, 650 50 Q 675 90, 700 50 Q 725 10, 750 50 Q 775 90, 800 50 Q 825 10, 850 50 Q 875 90, 900 50 Q 925 10, 950 50 Q 975 90, 1000 50 Q 1025 10, 1050 50 Q 1075 90, 1100 50 Q 1125 10, 1150 50 Q 1175 90, 1200 50 L 1200 100 L 0 100 Z" />
        </svg>
      </div>

    </section>
  );
}
