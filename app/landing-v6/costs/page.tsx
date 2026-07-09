"use client";

import { useState } from "react";
import { CheckCircle2, Calculator, Info, Landmark, Percent, Settings, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import Header from "../../../components/landing-v6/Header";
import Footer from "../../../components/landing-v6/Footer";
import ContactForm from "../../../components/landing-v6/ContactForm";

interface ItemDetail {
  title: string;
  desc: string;
  qty?: string;
}

interface PackageInfo {
  id: string;
  name: string;
  sub: string;
  price: string;
  normalPrice: string;
  desc: string;
  items: ItemDetail[];
}

const PACKAGES: PackageInfo[] = [
  {
    id: "120pie",
    name: "120겹파이 올인원 패키지",
    sub: "시그니처 디저트 패키지",
    price: "4,400,000원",
    normalPrice: "5,500,000원",
    desc: "120겹의 극대화된 바삭함과 풍미를 선사하는 120겹파이를 매장에 즉시 도입하는 기기 및 브랜딩 올인원 세트입니다.",
    items: [
      { title: "자체 금형 오리지널 파이 머신", desc: "독자 설계 자체 금형 기술로 가장 극대화된 120겹의 파이 결을 살려내는 전용 베이킹 머신", qty: "1대" },
      { title: "시그니처 패스트리 생지", desc: "본사 콜드체인 물류망을 통해 신선하게 급송되는 120겹 레이어드 특제 생지", qty: "200개" },
      { title: "브랜드 패키지 & 마케팅 키트", desc: "고객의 소장 욕구를 자극하는 디자인 상자, 종이백 및 매장 홍보용 POP/포스터 세트", qty: "1식" }
    ]
  },
  {
    id: "egg120",
    name: "에그120 올인원 패키지",
    sub: "식사 대용 계란빵 패키지",
    price: "3,800,000원",
    normalPrice: "4,800,000원",
    desc: "직장인과 학생들의 입맛을 사로잡은 든든한 둥근 식사 대용 계란빵 에그120 도입을 위한 패키지입니다.",
    items: [
      { title: "에그120 전용 베이킹 머신", desc: "겉바속촉 최적의 온도로 계란빵을 빠르게 구워내 조리 완성도를 높이는 특화 기기", qty: "1대" },
      { title: "전용 반죽 배합 파우더 & 소스", desc: "본사 특제 레시피 가루 믹스 및 시그니처 시즈닝 소스", qty: "1식" },
      { title: "실물 인포 POP 및 메뉴보드 데코", desc: "메뉴판 부착용 그래픽 소스 및 카운터 거치용 하이라이트 인쇄물 세트", qty: "1식" }
    ]
  }
];

export default function CostsSubpage() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  
  // Calculator States
  const [shopType, setShopType] = useState<"shop-in-shop" | "new-store">("shop-in-shop");
  const [size, setSize] = useState<number>(10);
  const [pieMachineCount, setPieMachineCount] = useState<number>(1);
  const [eggMachineCount, setEggMachineCount] = useState<number>(1);

  const openContactModal = () => setIsContactModalOpen(true);
  const closeContactModal = () => setIsContactModalOpen(false);

  // 개설 비용 산출 로직
  const franchiseFee = 0; // 가맹비 면제 프로모션
  const educationFee = 0; // 교육비 면제 프로모션
  const deposit = 0; // 보증금 면제 프로모션

  const piePackagePrice = 4400000;
  const eggPackagePrice = 3800000;
  
  // 신규 창업(new-store)인 경우 추가 비용 추정
  const interiorPerPyung = shopType === "new-store" ? 1800000 : 0;
  const signAndExterior = shopType === "new-store" ? 5000000 : 0;
  const basicKitchenEquip = shopType === "new-store" ? 12000000 : 0;

  const totalEquipmentCost = (pieMachineCount * piePackagePrice) + (eggMachineCount * eggPackagePrice);
  const totalInteriorCost = (size * interiorPerPyung) + signAndExterior + basicKitchenEquip;
  
  const totalPrice = franchiseFee + educationFee + deposit + totalEquipmentCost + totalInteriorCost;

  return (
    <div className="min-h-screen bg-[#FFFDF4] dark:bg-[#0A0A0A] text-[#0D233A] dark:text-neutral-250 transition-colors duration-300 font-sans antialiased">
      <Header onContactClick={openContactModal} />

      {/* Hero Section */}
      <section className="pt-32 pb-12 bg-[#FFF5D1] dark:bg-[#15130F] text-center transition-colors">
        <div className="max-w-4xl mx-auto px-4">
          <span className="text-xs sm:text-sm font-extrabold text-amber-500 uppercase tracking-widest block mb-3">
            Franchise Costs
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-neutral-900 dark:text-amber-50 tracking-tight leading-none mb-4">
            개설 비용 안내
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 font-medium leading-relaxed max-w-xl mx-auto">
            합리적인 소자본 도입 패키지부터 맞춤형 신규 창업까지, 투명하고 상세한 비용을 안내해 드립니다.
          </p>
        </div>
      </section>

      {/* Packages Area */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white mb-2">
            기기 & 브랜딩 올인원 패키지
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-455 font-bold">
            기존 매장에 디저트 라인업을 즉시 추가할 수 있는 무결점 샵인샵 세트
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {PACKAGES.map((pkg) => (
            <div key={pkg.id} className="bg-white dark:bg-neutral-900 border border-[#e6dfc3]/40 dark:border-neutral-900/60 rounded-[2.5rem] p-8 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300">
              <div className="text-left">
                <span className="text-xs font-bold text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full">
                  {pkg.sub}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white mt-3 mb-2">
                  {pkg.name}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-450 font-medium leading-relaxed mb-6">
                  {pkg.desc}
                </p>

                <div className="space-y-4 mb-8">
                  <h4 className="text-xs font-black text-neutral-450 uppercase tracking-wider">패키지 구성 상세</h4>
                  <div className="space-y-3">
                    {pkg.items.map((item) => (
                      <div key={item.title} className="flex justify-between items-start gap-4 p-3 bg-[#FFFDF4]/50 dark:bg-neutral-950/40 rounded-xl border border-neutral-100 dark:border-neutral-850">
                        <div className="text-left">
                          <p className="text-xs sm:text-sm font-bold text-neutral-800 dark:text-neutral-200">{item.title}</p>
                          <p className="text-[11px] text-neutral-400 dark:text-neutral-500 font-medium leading-tight mt-0.5">{item.desc}</p>
                        </div>
                        <span className="text-xs font-black text-amber-600 dark:text-amber-400 shrink-0">{item.qty}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-neutral-100 dark:border-neutral-850 flex items-center justify-between">
                <div className="text-left">
                  <span className="text-[10px] text-neutral-400 line-through block leading-none mb-1">정상가 {pkg.normalPrice}</span>
                  <span className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white leading-none">할인가 {pkg.price}</span>
                </div>
                <button onClick={openContactModal} className="px-5 py-3 bg-amber-500 hover:bg-amber-600 text-neutral-950 text-xs font-black rounded-xl transition-all flex items-center gap-1">
                  도입 문의하기
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Calculator Area */}
      <section className="py-16 bg-[#FFF5D1]/30 dark:bg-[#12100C]/30 border-y border-[#e6dfc3]/40 dark:border-neutral-900 transition-colors">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white mb-2 flex items-center justify-center gap-2">
              <Calculator className="w-6 h-6 text-amber-500" />
              실시간 창업 비용 계산기
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-450 font-bold">
              매장 유형과 도입할 기기 수량을 선택해 예상 창업 견적을 확인해 보세요.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left Options panel */}
            <div className="lg:col-span-7 bg-white dark:bg-neutral-900 border border-[#e6dfc3]/40 dark:border-neutral-900/60 rounded-[2.5rem] p-6 sm:p-8 space-y-6 text-left shadow-sm">
              {/* Shop Type Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Landmark className="w-3.5 h-3.5 text-neutral-400" />
                  창업 형태 선택
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => { setShopType("shop-in-shop"); setSize(0); }}
                    className={`py-3.5 rounded-2xl border text-sm font-black transition-all ${
                      shopType === "shop-in-shop"
                        ? "bg-amber-500/10 border-amber-400 text-amber-800 dark:text-amber-400"
                        : "bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-850 text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                    }`}
                  >
                    샵인샵 기기 도입
                  </button>
                  <button
                    onClick={() => { setShopType("new-store"); setSize(10); }}
                    className={`py-3.5 rounded-2xl border text-sm font-black transition-all ${
                      shopType === "new-store"
                        ? "bg-amber-500/10 border-amber-400 text-amber-800 dark:text-amber-400"
                        : "bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-850 text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                    }`}
                  >
                    단독 매장 신규 창업
                  </button>
                </div>
              </div>

              {/* Pyung Size (Only for New Store) */}
              {shopType === "new-store" && (
                <div className="space-y-2.5">
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Percent className="w-3.5 h-3.5 text-neutral-400" />
                    매장 규모 (평수)
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min={5}
                      max={50}
                      value={size}
                      onChange={(e) => setSize(Number(e.target.value))}
                      className="w-full h-2 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                    <span className="text-base font-black text-neutral-900 dark:text-white shrink-0 min-w-[50px] text-right">
                      {size}평
                    </span>
                  </div>
                </div>
              )}

              {/* Device Count Selector */}
              <div className="space-y-4 pt-4 border-t border-neutral-100 dark:border-neutral-850">
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Settings className="w-3.5 h-3.5 text-neutral-400" />
                  도입 기기 패키지 수량
                </label>
                
                {/* Pie Package */}
                <div className="flex justify-between items-center gap-4 p-4 bg-[#FFFDF4]/50 dark:bg-neutral-950/40 rounded-2xl border border-neutral-100 dark:border-neutral-850">
                  <div className="text-left">
                    <p className="text-sm font-bold text-neutral-800 dark:text-neutral-200">120겹파이 올인원 패키지</p>
                    <p className="text-xs text-neutral-400 font-medium mt-0.5">4,400,000원 / 세트</p>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => setPieMachineCount(Math.max(0, pieMachineCount - 1))}
                      className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-850 flex items-center justify-center font-bold text-sm text-neutral-600 hover:bg-neutral-200 dark:hover:bg-neutral-800"
                    >
                      -
                    </button>
                    <span className="w-6 text-center text-sm font-black text-neutral-900 dark:text-white">{pieMachineCount}</span>
                    <button
                      onClick={() => setPieMachineCount(pieMachineCount + 1)}
                      className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-850 flex items-center justify-center font-bold text-sm text-neutral-600 hover:bg-neutral-200 dark:hover:bg-neutral-800"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Egg Package */}
                <div className="flex justify-between items-center gap-4 p-4 bg-[#FFFDF4]/50 dark:bg-neutral-950/40 rounded-2xl border border-neutral-100 dark:border-neutral-850">
                  <div className="text-left">
                    <p className="text-sm font-bold text-neutral-800 dark:text-neutral-200">에그120 올인원 패키지</p>
                    <p className="text-xs text-neutral-400 font-medium mt-0.5">3,800,000원 / 세트</p>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => setEggMachineCount(Math.max(0, eggMachineCount - 1))}
                      className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-850 flex items-center justify-center font-bold text-sm text-neutral-600 hover:bg-neutral-200 dark:hover:bg-neutral-800"
                    >
                      -
                    </button>
                    <span className="w-6 text-center text-sm font-black text-neutral-900 dark:text-white">{eggMachineCount}</span>
                    <button
                      onClick={() => setEggMachineCount(eggMachineCount + 1)}
                      className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-850 flex items-center justify-center font-bold text-sm text-neutral-600 hover:bg-neutral-200 dark:hover:bg-neutral-800"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Summary Panel */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#0F3587] to-[#0A2052] dark:from-[#08225e] dark:to-[#041133] rounded-[2.5rem] p-6 sm:p-8 text-white flex flex-col justify-between text-left shadow-xl relative overflow-hidden">
              <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="space-y-6 relative z-10">
                <h3 className="text-lg font-black tracking-tight border-b border-white/10 pb-4">
                  예상 개설 비용 견적 요약
                </h3>

                <div className="space-y-4 text-xs sm:text-sm">
                  {/* Promo Benefits */}
                  <div className="flex justify-between items-center text-amber-300 font-black">
                    <p className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      가맹비 & 교육비 프로모션 혜택
                    </p>
                    <p>0원 (전액 면제)</p>
                  </div>
                  
                  {/* Deposit Promo */}
                  <div className="flex justify-between items-center text-amber-300 font-black">
                    <p className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      가맹 계약 이행 보증금 혜택
                    </p>
                    <p>0원 (전액 면제)</p>
                  </div>

                  <div className="flex justify-between items-center pt-2.5 border-t border-white/10 text-white/70">
                    <p>도입 기기 패키지 ({pieMachineCount + eggMachineCount}세트)</p>
                    <p>{totalEquipmentCost.toLocaleString()}원</p>
                  </div>

                  {shopType === "new-store" && (
                    <>
                      <div className="flex justify-between items-center text-white/70">
                        <p>기본 인테리어 평당 ({size}평)</p>
                        <p>{(size * interiorPerPyung).toLocaleString()}원</p>
                      </div>
                      <div className="flex justify-between items-center text-white/70">
                        <p>간판/익스테리어 평당 및 주방 설비</p>
                        <p>{(signAndExterior + basicKitchenEquip).toLocaleString()}원</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 mt-8 relative z-10">
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <p className="text-xs text-white/60 font-bold leading-none mb-1.5">예상 총 창업 비용 (VAT 별도)</p>
                  </div>
                  <p className="text-2xl sm:text-3xl font-black text-amber-400 leading-none">
                    {totalPrice.toLocaleString()}원
                  </p>
                </div>
                <button
                  onClick={openContactModal}
                  className="w-full py-4 bg-amber-400 hover:bg-amber-300 active:scale-[0.99] text-neutral-950 font-black text-sm rounded-xl transition-all shadow-lg shadow-amber-400/10 text-center"
                >
                  상세 견적 무료 상담 신청하기
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Info notice */}
      <section className="py-12 max-w-3xl mx-auto px-4 text-left">
        <div className="bg-[#FFF5D1]/10 dark:bg-neutral-900 border border-[#e6dfc3]/30 dark:border-neutral-850 p-5 rounded-2xl flex gap-3 text-neutral-500 dark:text-neutral-400 text-xs sm:text-sm font-medium leading-relaxed">
          <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-neutral-800 dark:text-neutral-200 mb-1">견적 비용 유의사항</p>
            <p>· 상기 견적 비용은 현장 상황(철거, 전기 배선 승압, 가스 가설, 냉난방기 등 별도 공사 여부)에 따라 변동될 수 있습니다.</p>
            <p>· 본사의 가맹비, 교육비, 보증금 전액 면제 혜택은 본사 프로모션 기간 내 가계약 완료 건에 한하여 제공됩니다.</p>
            <p>· 기기 보증수리 기간은 설치일로부터 1년입니다.</p>
          </div>
        </div>
      </section>

      <Footer />
      <ContactForm isModal isOpen={isContactModalOpen} onClose={closeContactModal} />
    </div>
  );
}
