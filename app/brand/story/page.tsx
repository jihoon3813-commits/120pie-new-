"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Menu, X, Play } from "lucide-react";
import { optimizeCloudinaryUrl } from "@/app/utils/cloudinary";
import CursorFollower from "@/components/CursorFollower";
import ConsultationForm from "@/components/ConsultationForm";
import QuickInquiryBar from "@/components/landing-v6/QuickInquiryBar";
import RightFloatingQuickBar from "@/components/RightFloatingQuickBar";
import RightSideInquiryBanner from "@/components/RightSideInquiryBanner";
import BrandHeader from "@/components/BrandHeader";
import Footer from "@/app/components/Footer";

export default function BrandStoryPage() {
  const [isConsulting, setIsConsulting] = useState(false);

  const SUB_MENU_TABS = [
    { id: "story", label: "120PIE & COFFEE", href: "/brand/story" },
    { id: "company", label: "기업소개", href: "/brand/company" },
    { id: "bi", label: "BI & 인테리어", href: "/brand/bi" },
  ];

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans selection:bg-[#FBC400] selection:text-neutral-950">
      {/* Dynamic Cursor Follower */}
      <CursorFollower />

      {/* HEADER / NAVIGATION BAR */}
      <BrandHeader onConsultClick={() => setIsConsulting(true)} />

      {/* SUB VISUAL HERO BANNER */}
      <section className="relative w-full bg-neutral-950 py-20 sm:py-28 text-white overflow-hidden text-left select-none">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-75 scale-105"
          style={{
            backgroundImage: `url('${optimizeCloudinaryUrl(
              "https://res.cloudinary.com/lyjyvy54/image/upload/v1784732847/ChatGPT_Image_2026%EB%85%84_6%EC%9B%94_9%EC%9D%BC_%EC%98%A4%ED%9B%84_09_02_58_1_qvxy5y.png"
            )}')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent z-10" />

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              브랜드
            </h1>
            <p className="text-xs sm:text-sm font-semibold tracking-widest text-[#FBC400] uppercase">
              Taste & Quality Made it 120PIE
            </p>
          </div>
          <p className="text-lg sm:text-2xl font-bold text-neutral-200">
            120겹의 맛, 일상에 특별함을 더하다
          </p>
        </div>
      </section>

      {/* SUB-PAGE SUB-MENU TABS BAR (Page Link Tabs - Single row 1-line on mobile) */}
      <div className="sticky top-[58px] z-30 bg-white border-b border-neutral-200 shadow-sm py-3 sm:py-4">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-1.5 sm:gap-3 flex-nowrap overflow-x-auto no-scrollbar whitespace-nowrap">
            {SUB_MENU_TABS.map((tab) => (
              <Link
                key={tab.id}
                href={tab.href}
                className={`px-3.5 py-2 sm:px-6 sm:py-2.5 rounded-full text-[12px] sm:text-sm font-black transition-all duration-300 border shrink-0 ${
                  tab.id === "story"
                    ? "bg-[#FBC400] text-neutral-950 border-[#FBC400] shadow-sm scale-102"
                    : "bg-neutral-100 text-neutral-600 border-neutral-200 hover:bg-neutral-200 hover:text-neutral-900"
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* 1. MAIN VIDEO PLAYER SECTION */}
      <section className="py-16 sm:py-24 bg-white text-center">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <h2 className="text-2xl sm:text-4xl font-black text-neutral-900 tracking-tight">
            정직함과 특별함이 깃든 120겹 파이 <span className="text-amber-600">120PIE!</span>
          </h2>

          {/* VIDEO CONTAINER PLAYER */}
          <div className="relative w-full aspect-video rounded-3xl overflow-hidden bg-neutral-900 border-4 border-[#FBC400] shadow-2xl flex items-center justify-center">
            <video
              src="https://github.com/jihoon3813-commits/imgs_cafe120/raw/refs/heads/main/KakaoTalk_20260724_095707302.mp4"
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
              controls
            />
          </div>

          {/* VIDEO REFRESH NOTICE (Compact 2 lines on mobile) */}
          <div className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-neutral-100 border border-neutral-200 rounded-2xl text-[10px] sm:text-xs text-neutral-700 font-semibold max-w-xl mx-auto text-center leading-snug">
            <span className="text-red-500 font-black shrink-0 text-[11px]">※</span>
            <p className="text-center text-[10px] sm:text-xs">
              동영상 재생에 어려움이 있으신 경우<br className="sm:hidden" />
              브라우저의 새로고침 키(F5)를 누르시면 동영상을 보실 수 있습니다.
            </p>
          </div>
        </div>
      </section>

      {/* 2. BLUE OCEAN ITEM & 3-CARD GRID (Yellow Theme Cards) */}
      <section className="py-16 sm:py-24 bg-[#FAF9F5] border-t border-neutral-200 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-2xl sm:text-4xl font-black text-neutral-900 leading-tight">
              익숙한 디저트 카페를 넘어,
              <br />
              차별화된 경쟁력을 갖춘 <span className="text-amber-600">‘블루오션 창업 브랜드’</span>입니다.
            </h2>
            <div className="space-y-3 text-xs sm:text-base text-neutral-600 font-medium leading-relaxed">
              <p>
                120PIE는 기존 저가 커피 시장의 출혈 경쟁에서 벗어나, 고부가가치 디저트를 주력으로 결합하여 
                사계절 내내 흔들림 없는 독보적인 매출 안정성을 자랑합니다.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {/* Card 1 (Yellow Box) */}
            <div className="bg-white rounded-3xl overflow-hidden border border-neutral-200/80 shadow-md flex flex-col group">
              <div className="h-64 sm:h-72 bg-neutral-900 relative overflow-hidden">
                <img
                  src={optimizeCloudinaryUrl(
                    "https://res.cloudinary.com/lyjyvy54/image/upload/v1784769078/ChatGPT_Image_2026%EB%85%84_7%EC%9B%94_12%EC%9D%BC_%EC%98%A4%ED%9B%84_06_08_04_1_zqvwn4.png"
                  )}
                  alt="120겹 파이 이미지"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="bg-[#FBC400] text-neutral-950 p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1">
                  <p className="text-xs text-neutral-900/80 font-extrabold">깊은 맛과 풍미가 일품인</p>
                  <h3 className="text-xl sm:text-2xl font-black text-neutral-950">120겹 수제 파이</h3>
                </div>
                <Link
                  href="/brand/menu"
                  className="inline-flex items-center text-xs font-black text-neutral-950 hover:underline gap-1"
                >
                  전체 메뉴 보기 &gt;
                </Link>
              </div>
            </div>

            {/* Card 2 (Yellow Box) */}
            <div className="bg-white rounded-3xl overflow-hidden border border-neutral-200/80 shadow-md flex flex-col group">
              <div className="h-64 sm:h-72 bg-neutral-900 relative overflow-hidden">
                <img
                  src={optimizeCloudinaryUrl(
                    "https://res.cloudinary.com/lyjyvy54/image/upload/v1784769095/ChatGPT_Image_2026%EB%85%84_7%EC%9B%94_20%EC%9D%BC_%EC%98%A4%ED%9B%84_04_06_57_rxj8k3.png"
                  )}
                  alt="120PIE 매장 파사드 이미지"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="bg-[#FBC400] text-neutral-950 p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="flex flex-wrap gap-1.5 text-[10px] font-black text-neutral-950">
                  <span className="px-2 py-0.5 bg-black/10 rounded-md">#홀매출</span>
                  <span className="px-2 py-0.5 bg-black/10 rounded-md">#테이크아웃</span>
                  <span className="px-2 py-0.5 bg-black/10 rounded-md">#배달</span>
                  <span className="px-2 py-0.5 bg-black/10 rounded-md">#높은수익률</span>
                  <span className="px-2 py-0.5 bg-black/10 rounded-md">#키오스크</span>
                  <span className="px-2 py-0.5 bg-black/10 rounded-md">#조리간소화</span>
                  <span className="px-2 py-0.5 bg-black/10 rounded-md">#고회전율</span>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-neutral-900/80 font-extrabold">차별화된 성공 창업 시스템</p>
                  <h3 className="text-xl sm:text-2xl font-black text-neutral-950">120PIE & COFFEE</h3>
                </div>
              </div>
            </div>

            {/* Card 3 (Yellow Box) */}
            <div className="bg-white rounded-3xl overflow-hidden border border-neutral-200/80 shadow-md flex flex-col group">
              <div className="h-64 sm:h-72 bg-neutral-900 relative overflow-hidden">
                <img
                  src={optimizeCloudinaryUrl(
                    "https://res.cloudinary.com/lyjyvy54/image/upload/v1784531905/ChatGPT_Image_2026%EB%85%84_7%EC%9B%94_20%EC%9D%BC_%EC%98%A4%ED%9B%84_03_50_21_1_ehld8g.png"
                  )}
                  alt="인테리어 컨셉 이미지"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="bg-[#FBC400] text-neutral-950 p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1">
                  <p className="text-xs text-neutral-900/80 font-extrabold">편안하고 깨끗한 이미지, 힐링 공간</p>
                  <h3 className="text-lg sm:text-xl font-black leading-snug text-neutral-950">
                    수제 느낌을 강조한 카페형 인테리어 컨셉
                  </h3>
                </div>
                <Link
                  href="/brand/bi"
                  className="inline-flex items-center text-xs font-black text-neutral-950 hover:underline gap-1"
                >
                  인테리어 더보기 &gt;
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. BRAND POWER NO.1 + STAGGERED Z-PATTERN */}
      <section className="py-16 sm:py-24 bg-neutral-950 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
              브랜드 파워<br className="sm:hidden" /> No.1! <span className="text-[#FBC400]">120PIE</span>
            </h2>
            <p className="text-sm sm:text-lg text-neutral-300 font-semibold">
              디저트 카페 시장점유율 1위! 1등의 이유는 확실합니다!
            </p>
          </div>

          <div className="space-y-16 sm:space-y-24 pt-8">
            {/* Block 1 (Center aligned & Number on top line for mobile) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 h-64 sm:h-80 rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-800 relative">
                <img
                  src={optimizeCloudinaryUrl(
                    "https://res.cloudinary.com/lyjyvy54/image/upload/v1784773255/ChatGPT_Image_2026%EB%85%84_7%EC%9B%94_23%EC%9D%BC_%EC%98%A4%EC%A0%84_11_19_35_1_cjxhld.png"
                  )}
                  alt="유행을 넘어 지속 가능한 경쟁력"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="lg:col-span-7 space-y-3 text-center lg:text-left">
                <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                  <span className="text-[#FBC400] block sm:inline mb-1 sm:mb-0">01.</span>
                  <span className="block sm:inline">
                    유행을 넘어<br className="sm:hidden" /> 지속 가능한 경쟁력
                  </span>
                </h3>
                <p className="text-xs sm:text-base text-neutral-300 font-medium leading-relaxed text-center lg:text-left">
                  성공 창업은 시장의 흐름을 읽는 것에서 시작됩니다.<br />
                  단순히 가격만 낮춘 브랜드는 쉽게 모방되고 빠르게 소비될 수 있습니다.<br className="hidden sm:inline" />
                  120PIE는 대중적인 디저트에 ‘120겹 수제 파이’라는 독창성을 더해, 트렌드와 지속 가능성을 모두 갖춘 차별화된 창업 모델을 제안합니다.
                </p>
              </div>
            </div>

            {/* Block 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-3 text-center lg:text-left order-2 lg:order-1">
                <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                  <span className="text-[#FBC400] block sm:inline mb-1 sm:mb-0">02.</span>
                  <span className="block sm:inline">
                    부담 없이 즐기는<br className="sm:hidden" /> 높은 상품 가치
                  </span>
                </h3>
                <p className="text-xs sm:text-base text-neutral-300 font-medium leading-relaxed text-center lg:text-left">
                  불황기에도 고객이 기꺼이 선택하는 합리적인 메뉴를 만듭니다.<br />
                  120PIE는 학생부터 직장인과 가족 고객까지 누구나 부담 없이 즐길 수 있는 가격대를 바탕으로, 중독성 있는 맛과 시선을 사로잡는 비주얼을 함께 갖췄습니다. 가격 이상의 만족을 제공해 자연스러운 재구매로 이어집니다.
                </p>
              </div>
              <div className="lg:col-span-5 h-64 sm:h-80 rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-800 relative order-1 lg:order-2">
                <img
                  src={optimizeCloudinaryUrl(
                    "https://res.cloudinary.com/lyjyvy54/image/upload/v1784773255/ChatGPT_Image_2026%EB%85%84_7%EC%9B%94_23%EC%9D%BC_%EC%98%A4%EC%A0%84_11_19_35_2_larhcp.png"
                  )}
                  alt="부담 없이 즐기는 높은 상품 가치"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Block 3 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 h-64 sm:h-80 rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-800 relative">
                <img
                  src={optimizeCloudinaryUrl(
                    "https://res.cloudinary.com/lyjyvy54/image/upload/v1784773254/ChatGPT_Image_2026%EB%85%84_7%EC%9B%94_23%EC%9D%BC_%EC%98%A4%EC%A0%84_11_12_23_3_owoiyx.png"
                  )}
                  alt="체계적인 시스템을 갖춘 가맹본사"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="lg:col-span-7 space-y-3 text-center lg:text-left">
                <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                  <span className="text-[#FBC400] block sm:inline mb-1 sm:mb-0">03.</span>
                  <span className="block sm:inline">
                    체계적인 시스템을<br className="sm:hidden" /> 갖춘 가맹본사
                  </span>
                </h3>
                <p className="text-xs sm:text-base text-neutral-300 font-medium leading-relaxed text-center lg:text-left">
                  좋은 아이템의 성공은 본사의 운영 역량이 완성합니다.<br />
                  ㈜120PIE는 약 150개 협력사와 분야별 전문 인력을 기반으로 상품 개발부터 생산·물류·교육·매장 운영까지 체계적인 가맹 지원 시스템을 구축했습니다. 축적된 경험과 안정적인 인프라로 가맹점의 시작과 성장을 함께합니다.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. SYSTEM COMPETITIVENESS & YELLOW BORDER BOX */}
      <section className="py-16 sm:py-24 bg-white text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="h-56 rounded-3xl overflow-hidden bg-neutral-100 border border-neutral-200">
              <img
                src={optimizeCloudinaryUrl(
                  "https://res.cloudinary.com/lyjyvy54/image/upload/v1784770503/ChatGPT_Image_2026%EB%85%84_7%EC%9B%94_23%EC%9D%BC_%EC%98%A4%EC%A0%84_10_34_47_1_lpahhw.png"
                )}
                alt="갤러리 이미지 1"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="h-56 rounded-3xl overflow-hidden bg-neutral-100 border border-neutral-200">
              <img
                src={optimizeCloudinaryUrl(
                  "https://res.cloudinary.com/lyjyvy54/image/upload/v1784770503/ChatGPT_Image_2026%EB%85%84_7%EC%9B%94_23%EC%9D%BC_%EC%98%A4%EC%A0%84_10_34_47_2_hiicbe.png"
                )}
                alt="갤러리 이미지 2"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="h-56 rounded-3xl overflow-hidden bg-neutral-100 border border-neutral-200">
              <img
                src={optimizeCloudinaryUrl(
                  "https://res.cloudinary.com/lyjyvy54/image/upload/v1784770501/ChatGPT_Image_2026%EB%85%84_7%EC%9B%94_23%EC%9D%BC_%EC%98%A4%EC%A0%84_10_34_48_3_o2ok5m.png"
                )}
                alt="갤러리 이미지 3"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="p-8 sm:p-12 border-4 border-[#FBC400] rounded-3xl bg-[#FAF9F5] space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3 text-center md:text-left">
                <h3 className="text-lg sm:text-xl font-black text-neutral-900 leading-tight">
                  <span className="text-amber-600 block md:inline mb-1 md:mb-0">01.</span>
                  <span className="block md:inline">
                    효율적인 매장 운영으로<br className="sm:hidden" /> 인건비 부담 완화
                  </span>
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 font-medium leading-relaxed">
                  120PIE는 간편한 조리 과정과 표준화된 운영 시스템을 통해 적은 인원으로도 효율적인 매장 운영이 가능합니다. 인건비 부담은 낮추고 매장 운영의 안정성은 높였습니다.
                </p>
              </div>

              <div className="space-y-3 text-center md:text-left">
                <h3 className="text-lg sm:text-xl font-black text-neutral-900 leading-tight">
                  <span className="text-amber-600 block md:inline mb-1 md:mb-0">02.</span>
                  <span className="block md:inline">
                    매출 성장을 돕는<br className="sm:hidden" /> 체계적인 홍보 지원
                  </span>
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 font-medium leading-relaxed">
                  120PIE는 브랜드 콘텐츠와 온·오프라인 광고를 통해 가맹점의 홍보 활동을 지원합니다. 본사의 운영 노하우와 마케팅 시스템으로 고객 유입과 지속적인 매출 성장을 돕습니다.
                </p>
              </div>

              <div className="space-y-3 text-center md:text-left">
                <h3 className="text-lg sm:text-xl font-black text-neutral-900 leading-tight">
                  <span className="text-amber-600 block md:inline mb-1 md:mb-0">03.</span>
                  <span className="block md:inline">
                    가맹점과 함께<br className="sm:hidden" /> 성장하는 상생 시스템
                  </span>
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 font-medium leading-relaxed">
                  120PIE는 체계적인 매장 관리와 지속적인 소통을 바탕으로 가맹점의 안정적인 운영을 지원합니다. 본사와 가맹점이 함께 성장하는 건강한 파트너십을 지향합니다.
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-neutral-300 text-center max-w-4xl mx-auto space-y-2">
              <p className="text-xs sm:text-sm text-neutral-700 font-bold leading-relaxed">
                120PIE는 차별화된 제품과 체계적인 운영 시스템을 바탕으로 성장해 온 디저트 브랜드입니다.
                <br className="hidden sm:inline" />
                단기적인 이익보다 고객에게 좋은 맛과 즐거운 경험을 제공하고, 가맹점과 오래 함께 성장하는 것을 가장 중요한 가치로 생각합니다.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* POPUP CONSULTATION MODAL */}
      {isConsulting && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn"
          onClick={() => setIsConsulting(false)}
        >
          <div
            className="w-full max-w-3xl bg-neutral-950 border border-[#FBC400]/30 rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] relative my-auto overflow-hidden text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-[#FBC400] to-amber-500" />

            <button
              onClick={() => setIsConsulting(false)}
              className="absolute top-5 right-5 sm:top-6 sm:right-6 p-2.5 text-neutral-400 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-full cursor-pointer transition-colors z-50"
            >
              <X size={20} />
            </button>

            <div className="mb-6 select-none space-y-1.5 pr-8">
              <span className="inline-block px-3 py-1 bg-[#FBC400]/10 border border-[#FBC400]/30 text-[#FBC400] text-[11px] font-black tracking-widest rounded-full uppercase">
                120PIE FRANCHISE CONSULTING
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                창업 상담 문의
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 font-semibold">
                기본 정보를 작성해 주시면 전문 컨설턴트가 1:1 맞춤 상담을 안내해 드립니다.
              </p>
            </div>

            <div className="max-h-[75vh] overflow-y-auto pr-1">
              <ConsultationForm onSuccessClose={() => setIsConsulting(false)} />
            </div>
          </div>
        </div>
      )}

      {/* QUICK INQUIRY BAR */}
      <QuickInquiryBar isFixed={true} />

      {/* FOOTER */}
      <Footer theme="yellow" />

      {/* Right Floating Quick Docking Bar */}
      <RightFloatingQuickBar onOpenConsultation={() => setIsConsulting(true)} />

      {/* Right Side Inquiry Banner (300px width) */}
      <RightSideInquiryBanner />
    </div>
  );
}
