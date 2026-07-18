"use client";

import { useState } from "react";
import { CheckCircle2, Award, Truck, Layers, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import Header from "../../../components/landing-v6/Header";
import Footer from "../../../components/landing-v6/Footer";
import ContactForm from "../../../components/landing-v6/ContactForm";
import FranchiseCost from "../../../components/landing-v6/FranchiseCost";
import PaymentPromo from "../../../components/landing-v6/PaymentPromo";

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

      {/* 창업 모델 및 개설 비용 안내 */}
      <FranchiseCost bottomWaveColor="text-[#F5F7FA] dark:text-[#111625]" />

      {/* 결제 지원 프로모션 안내 */}
      <PaymentPromo bottomWaveColor="text-[#FFFDF4] dark:text-[#0A0A0A]" />

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
