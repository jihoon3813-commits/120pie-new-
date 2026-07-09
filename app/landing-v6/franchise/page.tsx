"use client";

import { useState } from "react";
import { CheckCircle2, Award, Truck, Layers, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import Header from "../../../components/landing-v6/Header";
import Footer from "../../../components/landing-v6/Footer";
import ContactForm from "../../../components/landing-v6/ContactForm";

interface SuccessCase {
  title: string;
  badge: string;
  stats: string;
  desc: string;
  points: string[];
}

const SUCCESS_CASES: SuccessCase[] = [
  {
    title: "기존 카페 샵인샵 도입 (A 매장)",
    badge: "샵인샵 성공 모델",
    stats: "일평균 매출 45만 원 상승",
    desc: "기존에 저단가 음료 위주로 운영되던 대학가 개인 카페였으나, 120겹 파이 도입 후 세트 주문이 폭발적으로 늘어나 객단가와 마진을 동시에 잡았습니다.",
    points: ["주변 프랜차이즈 저가커피 공세 방어", "디저트 단품 포장 고객 증가", "원가율 30%대 실현"]
  },
  {
    title: "신규 단독 창업 (B 매장)",
    badge: "단독 창업 모델",
    stats: "오픈 첫 달 월 매출 3,200만 원 돌파",
    desc: "신도시 항아리 상권에 10평 규모로 창업하여 테이크아웃 및 배달 위주로 운영 중입니다. 단체 주문(유치원, 학원, 사무실) 수요가 탄탄해 높은 일매출을 꾸준히 기록하고 있습니다.",
    points: ["단일 품목 특화로 매장 운영 피로도 낮음", "간식/단체 단골 배달 주문 특화", "마진율 35% 이상 돌파"]
  }
];

const STEPS = [
  { step: "01", title: "가맹 상담 & 문의", desc: "전문 개설 컨설턴트와의 상담을 통해 희망 지역 및 도입 방식을 조율합니다." },
  { step: "02", title: "상권 조사 & 분석", desc: "본사 상권분석팀이 매장 후보지 또는 기존 매장의 독점 상권 영역을 엄밀히 실측합니다." },
  { step: "03", title: "가맹 계약 체결", desc: "상권 확정 후 본사 규정에 맞춰 정식 계약을 체결하고 독점 상권을 확보합니다." },
  { step: "04", title: "인테리어 & 기기 설비", desc: "단독 매장의 경우 맞춤 인테리어를 시공하며, 샵인샵은 전용 베이킹 머신을 즉시 입고합니다." },
  { step: "05", title: "기술 교육 & 본사 실습", desc: "35% 초보 점주님도 마스터할 수 있는 120겹 파이 오븐 조리 교육 및 매장 위생 교육을 진행합니다." },
  { step: "06", title: "그랜드 오픈", desc: "본사 마케팅팀의 단골 유치 오픈 프로모션 및 온·오프라인 홍보와 함께 매장을 정식 오픈합니다." }
];

export default function FranchiseSubpage() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [activeModel, setActiveModel] = useState<"A" | "B" | "C">("B");

  const openContactModal = () => setIsContactModalOpen(true);
  const closeContactModal = () => setIsContactModalOpen(false);

  return (
    <div className="min-h-screen bg-[#FFFDF4] dark:bg-[#0A0A0A] text-[#0D233A] dark:text-neutral-250 transition-colors duration-300 font-sans antialiased">
      <Header onContactClick={openContactModal} />

      {/* Hero Section */}
      <section className="pt-32 pb-12 bg-[#FFF5D1] dark:bg-[#15130F] text-center transition-colors">
        <div className="max-w-4xl mx-auto px-4">
          <span className="text-xs sm:text-sm font-extrabold text-amber-500 uppercase tracking-widest block mb-3">
            Franchise Guide
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-neutral-900 dark:text-amber-50 tracking-tight leading-none mb-4">
            창업 안내
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 font-medium leading-relaxed max-w-xl mx-auto">
            본사의 독보적인 조리 머신 기술과 완벽한 물류 콜드체인 지원으로, 초보자도 성공적인 디저트 카페를 일구어낼 수 있습니다.
          </p>
        </div>
      </section>

      {/* Brand Value Area */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1 */}
          <div className="bg-white dark:bg-neutral-900 border border-[#e6dfc3]/40 dark:border-neutral-900/60 rounded-[2rem] p-8 text-left shadow-sm hover:shadow-md transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 mb-6">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-neutral-900 dark:text-white mb-2">
              독보적인 120겹 베이킹 공정
            </h3>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-450 font-medium leading-relaxed">
              자체 금형 특화 전용 머신을 통해 해동 없이 15분 만에 겉은 바삭하고 속은 촉촉한 120겹 시그니처 파이를 간편하게 조리할 수 있습니다.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white dark:bg-neutral-900 border border-[#e6dfc3]/40 dark:border-neutral-900/60 rounded-[2rem] p-8 text-left shadow-sm hover:shadow-md transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 mb-6">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-neutral-900 dark:text-white mb-2">
              전국 일일 콜드체인 배송
            </h3>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-450 font-medium leading-relaxed">
              본사 특제 냉동 생지를 매일 신선하게 공급받아, 전문 제과사나 주방 인력 없이 1인 매장에서도 고품질 디저트를 일정하게 제공합니다.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white dark:bg-neutral-900 border border-[#e6dfc3]/40 dark:border-neutral-900/60 rounded-[2rem] p-8 text-left shadow-sm hover:shadow-md transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 mb-6">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-neutral-900 dark:text-white mb-2">
              강력한 1동 1점 상권 보호제
            </h3>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-450 font-medium leading-relaxed">
              동일 구역 내 무분별한 입점을 절대 금지하며, 확실한 반경 보호망 정책으로 각 점주님들의 고유 상권 매출을 끝까지 책임지고 지켜 드립니다.
            </p>
          </div>

        </div>
      </section>

      {/* Success Cases Area */}
      <section className="py-16 bg-[#FFF5D1]/30 dark:bg-[#12100C]/30 border-y border-[#e6dfc3]/40 dark:border-neutral-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white mb-2">
              도입 성공 사례
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-455 font-bold">
              이미 수많은 사장님들께서 120pie 도입을 통해 극적인 매출 전환을 이룩해 내셨습니다.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {SUCCESS_CASES.map((item) => (
              <div key={item.title} className="bg-white dark:bg-neutral-900 border border-neutral-250/30 dark:border-neutral-900 rounded-[2.5rem] p-6 sm:p-8 text-left shadow-sm hover:shadow-md transition-all duration-300">
                <span className="text-xs font-bold text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full">
                  {item.badge}
                </span>
                <h3 className="text-lg sm:text-xl font-black text-neutral-900 dark:text-white mt-4 mb-1">
                  {item.title}
                </h3>
                <p className="text-base font-black text-amber-600 dark:text-amber-400 mb-4">
                  {item.stats}
                </p>
                <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-medium leading-relaxed mb-6">
                  {item.desc}
                </p>
                <div className="space-y-2">
                  {item.points.map((pt) => (
                    <div key={pt} className="flex items-center gap-2 text-xs sm:text-sm font-bold text-neutral-700 dark:text-neutral-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      {pt}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Franchise Process Steps */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white mb-2">
            개설 및 창업 프로세스
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-455 font-bold">
            체계화된 가맹 절차에 따라 개설 오픈까지 안전하고 빠르게 가이드해 드립니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {STEPS.map((step) => (
            <div key={step.step} className="bg-white dark:bg-neutral-900 border border-[#e6dfc3]/40 dark:border-neutral-900/60 rounded-3xl p-6 text-left shadow-sm flex flex-col justify-between h-48">
              <div>
                <span className="text-3xl font-black text-amber-500/20 dark:text-amber-500/10 block mb-2 leading-none">
                  {step.step}
                </span>
                <h3 className="text-base font-black text-neutral-900 dark:text-white mb-1.5 leading-tight">
                  {step.title}
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-455 font-medium leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 창업 비용 및 모델 안내 */}
      <section className="py-16 bg-[#FFF5D1]/30 dark:bg-[#12100C]/30 border-y border-[#e6dfc3]/40 dark:border-neutral-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs sm:text-sm font-extrabold text-amber-500 uppercase tracking-widest block mb-2">
              Start-up Models & Costs
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white mb-2">
              창업 모델 및 개설 비용 안내
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-455 font-bold">
              점포 상황과 예산 규모에 맞춰 실속 있게 도입하실 수 있는 3가지 맞춤 창업 플랜을 제시합니다.
            </p>
          </div>

          {/* Model Selection Tabs */}
          <div className="flex justify-center space-x-2 md:space-x-4 mb-8">
            {[
              { id: "A", name: "모델 A (샵인샵 실속형)", desc: "기존 매장 활용" },
              { id: "B", name: "모델 B (하이브리드형)", desc: "10평대 매장" },
              { id: "C", name: "모델 C (단독 정식창업)", desc: "15평대 이상" }
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setActiveModel(m.id as "A" | "B" | "C")}
                className={`flex-1 max-w-[240px] px-3 py-4 rounded-2xl border text-center transition-all duration-300 ${
                  activeModel === m.id
                    ? "bg-amber-400 border-amber-500 text-neutral-950 shadow-md font-black"
                    : "bg-white dark:bg-neutral-900 border-[#e6dfc3]/50 dark:border-neutral-850 text-neutral-500 dark:text-neutral-450 font-bold hover:bg-neutral-50 dark:hover:bg-neutral-850"
                }`}
              >
                <span className="text-xs block mb-1 opacity-70">플랜 {m.id}</span>
                <span className="text-xs sm:text-sm block leading-tight">{m.name}</span>
              </button>
            ))}
          </div>

          {/* Detailed Cost Content */}
          <div className="bg-white dark:bg-neutral-900 border border-[#e6dfc3]/40 dark:border-neutral-900/60 rounded-[2.5rem] p-6 sm:p-8 max-w-4xl mx-auto shadow-sm">
            {activeModel === "A" && (
              <div className="space-y-6 text-left">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-neutral-100 dark:border-neutral-850 pb-4">
                  <div>
                    <span className="text-xs font-bold text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-full">
                      기존 카페/매장 내 메뉴 도입
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white mt-2">
                      모델 A: 샵인샵 실속형
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-neutral-400 block">개설 예상 비용</span>
                    <span className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400">
                      약 380만 ~ 440만원
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed font-medium">
                  기존에 운영 중이신 카페, 디저트점의 인테리어를 그대로 유지하면서, 120pie의 고부가가치 시그니처 메뉴 라인업만 스마트하게 얹어 매출 상승을 꾀하는 가장 리스크가 적은 도입 모델입니다.
                </p>

                <div className="overflow-x-auto rounded-2xl border border-neutral-100 dark:border-neutral-850">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm min-w-[500px]">
                    <thead>
                      <tr className="bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-100 dark:border-neutral-850 font-bold text-neutral-600 dark:text-neutral-400">
                        <th className="py-3 px-4 w-[20%]">구분</th>
                        <th className="py-3 px-4 w-[50%]">세부 도입 내역</th>
                        <th className="py-3 px-4 text-right w-[15%]">금액</th>
                        <th className="py-3 px-4 w-[15%]">비고</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 dark:divide-neutral-850 font-bold text-neutral-700 dark:text-neutral-300">
                      <tr>
                        <td className="py-3.5 px-4 text-amber-500">가맹비</td>
                        <td className="py-3.5 px-4 font-medium text-neutral-500 dark:text-neutral-450">독점 상권 사용 허가 및 브랜드 라이센스 권한</td>
                        <td className="py-3.5 px-4 text-right text-emerald-500">0원</td>
                        <td className="py-3.5 px-4 text-neutral-400 text-xs font-semibold">프로모션 면제</td>
                      </tr>
                      <tr>
                        <td className="py-3.5 px-4 text-amber-500">교육비</td>
                        <td className="py-3.5 px-4 font-medium text-neutral-500 dark:text-neutral-455">본사 오븐 조리 교육 및 위생 가이드 실습</td>
                        <td className="py-3.5 px-4 text-right text-emerald-500">0원</td>
                        <td className="py-3.5 px-4 text-neutral-400 text-xs font-semibold">프로모션 면제</td>
                      </tr>
                      <tr>
                        <td className="py-3.5 px-4 text-amber-500">보증금</td>
                        <td className="py-3.5 px-4 font-medium text-neutral-500 dark:text-neutral-455">가맹 거래에 따른 보증 성격 예치금</td>
                        <td className="py-3.5 px-4 text-right text-emerald-500">0원</td>
                        <td className="py-3.5 px-4 text-neutral-400 text-xs font-semibold">프로모션 면제</td>
                      </tr>
                      <tr>
                        <td className="py-3.5 px-4 text-amber-500">기기 패키지</td>
                        <td className="py-3.5 px-4 font-medium text-neutral-500 dark:text-neutral-455">120겹파이 조리 전용 특수 고성능 오븐 머신 셋업</td>
                        <td className="py-3.5 px-4 text-right text-amber-600 dark:text-amber-400">380만원</td>
                        <td className="py-3.5 px-4 text-neutral-400 text-xs font-semibold">필수 설비</td>
                      </tr>
                      <tr>
                        <td className="py-3.5 px-4 text-amber-500">초도물품</td>
                        <td className="py-3.5 px-4 font-medium text-neutral-500 dark:text-neutral-455">초도 냉동 생지 및 홍보용 배너/메뉴판 패키지</td>
                        <td className="py-3.5 px-4 text-right text-amber-600 dark:text-amber-400">100만원</td>
                        <td className="py-3.5 px-4 text-neutral-400 text-xs font-semibold">선택 품목</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-4 bg-amber-500/5 dark:bg-amber-500/10 rounded-2xl border border-amber-500/10 text-xs sm:text-sm font-semibold text-neutral-500 dark:text-neutral-405 space-y-1">
                  <p>• 샵인샵 도입의 경우, 기존 점포의 전기 용량 및 주방 공간 실측 결과에 따라 기기 대수가 추가로 조율될 수 있습니다.</p>
                  <p>• 가맹비, 교육비, 보증금 전액 면제 프로모션은 한정 수량 계약 건으로 조기 마감될 수 있습니다.</p>
                </div>
              </div>
            )}

            {activeModel === "B" && (
              <div className="space-y-6 text-left">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-neutral-100 dark:border-neutral-850 pb-4">
                  <div>
                    <span className="text-xs font-bold text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-full">
                      소형 매장 하이브리드 창업
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white mt-2">
                      모델 B: 하이브리드형 (10평 기준)
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-neutral-400 block">개설 특별 혜택가</span>
                    <span className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400">
                      980만원 <span className="text-xs text-neutral-400 font-bold ml-1"><s>(1,180만원)</s></span>
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-450 leading-relaxed font-medium">
                  10평대 규모의 아담한 실속 매장을 오픈하여 배달과 테이크아웃, 그리고 홀 간식 수요까지 동시에 섭렵할 수 있는 120pie의 주력 핵심 창업 모델입니다.
                </p>

                <div className="overflow-x-auto rounded-2xl border border-neutral-100 dark:border-neutral-850">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm min-w-[500px]">
                    <thead>
                      <tr className="bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-100 dark:border-neutral-850 font-bold text-neutral-600 dark:text-neutral-400">
                        <th className="py-3 px-4 w-[20%]">구분</th>
                        <th className="py-3 px-4 w-[50%]">세부 도입 내역</th>
                        <th className="py-3 px-4 text-right w-[15%]">금액</th>
                        <th className="py-3 px-4 w-[15%]">비고</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 dark:divide-neutral-850 font-bold text-neutral-700 dark:text-neutral-300">
                      <tr>
                        <td className="py-3.5 px-4 text-amber-500">가맹비</td>
                        <td className="py-3.5 px-4 font-medium text-neutral-500 dark:text-neutral-455">상권 보호 독점 사용권, 오픈 교육 및 가맹 개점 본사 지원</td>
                        <td className="py-3.5 px-4 text-right text-amber-600 dark:text-amber-400">100만원</td>
                        <td className="py-3.5 px-4 text-neutral-400 text-xs font-semibold">소멸성</td>
                      </tr>
                      <tr>
                        <td className="py-3.5 px-4 text-amber-500">장비</td>
                        <td className="py-3.5 px-4 font-medium text-neutral-500 dark:text-neutral-455">120겹파이 특수 오븐 머신 및 에그120 조리 전용 머신 등</td>
                        <td className="py-3.5 px-4 text-right text-amber-600 dark:text-amber-400">150만원</td>
                        <td className="py-3.5 px-4 text-neutral-400 text-xs font-semibold">기본 품목 외 별도</td>
                      </tr>
                      <tr>
                        <td className="py-3.5 px-4 text-amber-500">간판</td>
                        <td className="py-3.5 px-4 font-medium text-neutral-500 dark:text-neutral-455">전면 돌출 사인, 실사 선팅 및 차양 어닝 작업</td>
                        <td className="py-3.5 px-4 text-right text-amber-600 dark:text-amber-400">300만원</td>
                        <td className="py-3.5 px-4 text-neutral-400 text-xs font-semibold">현장 상황 조율</td>
                      </tr>
                      <tr>
                        <td className="py-3.5 px-4 text-amber-500">초도물품</td>
                        <td className="py-3.5 px-4 font-medium text-neutral-500 dark:text-neutral-455">원부자재 식재료, 유니폼, 메뉴판, 배너, 각종 오픈 시트지</td>
                        <td className="py-3.5 px-4 text-right text-amber-600 dark:text-amber-400">300만원</td>
                        <td className="py-3.5 px-4 text-neutral-400 text-xs font-semibold">-</td>
                      </tr>
                      <tr>
                        <td className="py-3.5 px-4 text-amber-500">홍보비</td>
                        <td className="py-3.5 px-4 font-medium text-neutral-500 dark:text-neutral-455">플레이스 세팅, 배달 플랫폼 등록 마케팅, 인스타/당근 지역 타깃 광고</td>
                        <td className="py-3.5 px-4 text-right text-amber-600 dark:text-amber-400">130만원</td>
                        <td className="py-3.5 px-4 text-neutral-400 text-xs font-semibold">오픈 패키지</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-4 bg-amber-500/5 dark:bg-amber-500/10 rounded-2xl border border-amber-500/10 text-xs sm:text-sm font-semibold text-neutral-500 dark:text-neutral-405 space-y-1">
                  <p>• 인테리어의 경우 점주 직접 시공이 가능하며(도면 제공 및 감리는 본사 대행), 인테리어 비용은 미포함된 개설 비용 예시입니다.</p>
                  <p>• 10평대 표준 가맹 개설의 견적이며 점포 특성에 따라 총비용은 상이할 수 있습니다.</p>
                </div>
              </div>
            )}

            {activeModel === "C" && (
              <div className="space-y-6 text-left">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-neutral-100 dark:border-neutral-850 pb-4">
                  <div>
                    <span className="text-xs font-bold text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-full">
                      프리미엄 정식 단독 창업
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white mt-2">
                      모델 C: 단독 정식 창업 (15평 기준)
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-neutral-400 block">본사 기본 개설가</span>
                    <span className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400">
                      1,040만원 <span className="text-xs text-neutral-400 font-bold ml-1">(인테리어/기타 별도)</span>
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-450 leading-relaxed font-medium">
                  15평 이상의 단독 플래그십 매장을 구성하여, 넓은 홀 브런치 고객 흡수와 높은 브랜드 노출 효과를 극대화한 본격적인 단독 디저트 카페 창업 모델입니다.
                </p>

                <div className="overflow-x-auto rounded-2xl border border-neutral-100 dark:border-neutral-850">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm min-w-[500px]">
                    <thead>
                      <tr className="bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-100 dark:border-neutral-850 font-bold text-neutral-600 dark:text-neutral-400">
                        <th className="py-3 px-4 w-[20%]">구분</th>
                        <th className="py-3 px-4 w-[50%]">세부 도입 내역</th>
                        <th className="py-3 px-4 text-right w-[15%]">금액</th>
                        <th className="py-3 px-4 w-[15%]">비고</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 dark:divide-neutral-850 font-bold text-neutral-700 dark:text-neutral-300">
                      <tr>
                        <td className="py-3.5 px-4 text-amber-500">가맹비</td>
                        <td className="py-3.5 px-4 font-medium text-neutral-500 dark:text-neutral-455">120pie 브랜드에 대한 상권 독점 사용권, 교육 및 개점 밀착 케어</td>
                        <td className="py-3.5 px-4 text-right text-amber-600 dark:text-amber-400">500만원</td>
                        <td className="py-3.5 px-4 text-neutral-400 text-xs font-semibold">소멸성</td>
                      </tr>
                      <tr>
                        <td className="py-3.5 px-4 text-amber-500">초도물품</td>
                        <td className="py-3.5 px-4 font-medium text-neutral-500 dark:text-neutral-455">가방 원부자재, 메뉴판, 대형 배너, 앞치마 및 각종 포장 박스 패키지</td>
                        <td className="py-3.5 px-4 text-right text-amber-600 dark:text-amber-400">440만원</td>
                        <td className="py-3.5 px-4 text-neutral-400 text-xs font-semibold">-</td>
                      </tr>
                      <tr>
                        <td className="py-3.5 px-4 text-amber-500">보증금</td>
                        <td className="py-3.5 px-4 font-medium text-neutral-500 dark:text-neutral-455">원활한 원자재 공급 및 가맹 거래 이행 예치금</td>
                        <td className="py-3.5 px-4 text-right text-amber-600 dark:text-amber-400">100만원</td>
                        <td className="py-3.5 px-4 text-neutral-400 text-xs font-semibold">해약 시 반환</td>
                      </tr>
                      <tr>
                        <td className="py-3.5 px-4 text-amber-500">로열티</td>
                        <td className="py-3.5 px-4 font-medium text-neutral-500 dark:text-neutral-455">매월 11만원 정액제 (매출 비례 수수료 없음)</td>
                        <td className="py-3.5 px-4 text-right text-amber-600 dark:text-amber-400">월 11만원</td>
                        <td className="py-3.5 px-4 text-neutral-400 text-xs font-semibold">매월 납부</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-4 bg-amber-500/5 dark:bg-amber-500/10 rounded-2xl border border-amber-500/10 text-xs sm:text-sm font-semibold text-neutral-500 dark:text-neutral-405 space-y-1">
                  <p>• 점주 직접 인테리어 진행이 가능하여 창업 단가를 크게 줄일 수 있습니다. (감리 및 도면 지원)</p>
                  <p>• 장비 설비(오븐 기기, 커피머신 패키지 등) 및 인테리어/간판 비용은 점포 실측 후 실비 정산 방식으로 산출됩니다.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="py-16 max-w-5xl mx-auto px-4">
        <div className="bg-gradient-to-r from-[#0F3587] to-[#0A2052] dark:from-[#08225e] dark:to-[#041133] rounded-[2.5rem] p-8 sm:p-12 text-white shadow-2xl text-center relative overflow-hidden">
          <div className="absolute right-0 top-0 w-80 h-80 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          <h2 className="text-xl sm:text-3xl font-black mb-4 relative z-10">
            지금, 점포 근방의 독점 상권 가능 여부를 확인해 보세요
          </h2>
          <p className="text-xs sm:text-sm text-white/80 font-medium leading-relaxed max-w-xl mx-auto mb-8 relative z-10">
            선점이 곧 독점권 확보입니다. 본사 상담 신청을 통해 해당 지역의 상권 계약 가능 상태를 실시간으로 빠르게 안내받으실 수 있습니다.
          </p>
          <button
            onClick={openContactModal}
            className="inline-flex items-center gap-2 px-8 py-4 bg-amber-400 text-neutral-950 font-black text-sm sm:text-base rounded-2xl hover:bg-amber-300 transition-colors shadow-lg shadow-amber-400/20 relative z-10"
          >
            무료 창업 컨설팅 및 상권 문의하기
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      <Footer />
      <ContactForm isModal isOpen={isContactModalOpen} onClose={closeContactModal} />
    </div>
  );
}
