"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Menu, X, Play } from "lucide-react";
import { optimizeCloudinaryUrl } from "@/app/utils/cloudinary";
import CursorFollower from "@/components/CursorFollower";
import ConsultationForm from "@/components/ConsultationForm";
import QuickInquiryBar from "@/components/landing-v6/QuickInquiryBar";

export default function BrandStoryPage() {
  const [isConsulting, setIsConsulting] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      <header className="sticky top-0 z-50 transition-all duration-300 backdrop-blur-md bg-white/90 border-b border-neutral-200/60 py-3.5">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link href="/brand" className="flex items-center gap-2 group">
            <img
              src={optimizeCloudinaryUrl("https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784533894/Group_1_4_jl4rlr.png")}
              alt="120pie 로고"
              className="h-[24px] md:h-[28px] w-auto object-contain transition-transform duration-300 group-hover:scale-102"
            />
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-10 font-medium text-[16px] text-neutral-700">
            <Link href="/brand/story" className="text-amber-600 font-bold border-b-2 border-amber-500 pb-0.5">
              브랜드 소개
            </Link>
            <Link href="/brand/menu" className="hover:text-amber-600 transition-colors">
              메뉴 소개
            </Link>
            <Link href="/stores" className="hover:text-amber-600 transition-colors">
              매장 찾기
            </Link>
            <Link href="/brand#news" className="hover:text-amber-600 transition-colors">
              뉴스 & 이벤트
            </Link>
            <Link href="/franchise" className="text-amber-600 hover:text-amber-700 transition-colors flex items-center gap-0.5 font-medium">
              창업안내 <ChevronRight size={14} />
            </Link>
          </nav>

          {/* Quick Consultation CTA */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => setIsConsulting(true)}
              className="px-5 py-2.5 bg-[#fbc400] hover:bg-[#e0a800] text-[#0D233A] font-extrabold text-xs rounded-full transition-all duration-300 shadow-sm shadow-[#fbc400]/20 hover:scale-103 border-0 cursor-pointer"
            >
              창업 상담 문의
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-neutral-700 hover:text-amber-600 transition-colors"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* MOBILE NAVIGATION OVERLAY */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-16 z-40 bg-neutral-900/98 flex flex-col p-6 space-y-6 md:hidden animate-fadeIn">
          <nav className="flex flex-col space-y-4 font-medium text-lg text-neutral-200 text-left">
            <Link href="/brand/story" className="py-2 border-b border-neutral-800 text-[#fbc400] font-bold text-left block">
              브랜드 소개
            </Link>
            <Link href="/brand/menu" className="py-2 border-b border-neutral-800 hover:text-[#fbc400] transition-colors text-left block">
              메뉴 소개
            </Link>
            <Link href="/stores" className="py-2 border-b border-neutral-800 hover:text-[#fbc400] transition-colors text-left block">
              매장 찾기
            </Link>
            <Link href="/brand#news" className="py-2 border-b border-neutral-800 hover:text-[#fbc400] transition-colors text-left block">
              뉴스 & 이벤트
            </Link>
            <Link
              href="/franchise"
              className="py-2 border-b border-neutral-800 text-amber-500 hover:text-[#fbc400] transition-colors text-left flex items-center justify-between w-full font-medium"
            >
              <span>창업안내</span>
              <ChevronRight size={18} />
            </Link>
          </nav>
        </div>
      )}

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

      {/* SUB-PAGE SUB-MENU TABS BAR (Page Link Tabs) */}
      <div className="sticky top-[58px] z-30 bg-white border-b border-neutral-200 shadow-sm py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
            {SUB_MENU_TABS.map((tab) => (
              <Link
                key={tab.id}
                href={tab.href}
                className={`px-5 py-2 sm:px-6 sm:py-2.5 rounded-full text-xs sm:text-sm font-black transition-all duration-300 border ${
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

          {/* VIDEO CONTAINER PLACEHOLDER */}
          <div className="relative w-full aspect-video rounded-3xl overflow-hidden bg-neutral-900 border-4 border-[#FBC400] shadow-2xl group flex items-center justify-center">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-50 group-hover:scale-102 transition-transform duration-700"
              style={{
                backgroundImage: `url('${optimizeCloudinaryUrl(
                  "https://res.cloudinary.com/dfarfqx7e/image/upload/v1781184019/120%EA%B2%B9%ED%8C%8C%EC%9D%B4_%ED%81%AC%EB%A6%BC%EC%B9%98%EC%A6%88_%EC%97%B0%EC%B6%9C_ebuddm.jpg"
                )}')`,
              }}
            />
            <div className="absolute inset-0 bg-black/40" />

            <div className="relative z-10 flex flex-col items-center gap-3 text-white">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#FBC400] text-neutral-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform cursor-pointer">
                <Play size={32} className="ml-1 fill-neutral-950" />
              </div>
              <p className="text-sm sm:text-base font-extrabold tracking-tight">
                120PIE 공식 브랜드 스토리 영상
              </p>
              <span className="text-xs text-neutral-300 font-medium">
                (동영상 파일 추후 업데이트 예정)
              </span>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-100 border border-neutral-200 rounded-2xl text-xs sm:text-sm text-neutral-600 font-semibold max-w-2xl mx-auto">
            <span className="text-red-500 font-black">※</span>
            <span>동영상 재생에 어려움이 있으신 경우 브라우저의 새로고침 키(F5)를 누르시면 동영상을 보실 수 있습니다.</span>
          </div>
        </div>
      </section>

      {/* 2. BLUE OCEAN ITEM & 3-CARD GRID */}
      <section className="py-16 sm:py-24 bg-[#FAF9F5] border-t border-neutral-200 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-2xl sm:text-4xl font-black text-neutral-900 leading-tight">
              기존의 디저트, 카페 전문점과 확실하게 차별화한
              <br />
              <span className="text-amber-600">'블루오션 창업 아이템'</span>입니다.
            </h2>
            <div className="space-y-3 text-xs sm:text-base text-neutral-600 font-medium leading-relaxed">
              <p>
                모방불가, 비교불가 정통 120겹 수제 파이와 프리미엄 커피의 조화를 실현하기 위해
                <strong> (주)120PIE 가맹본사</strong>에서 오랜 기간 연구·개발하여 런칭한 자체 시그니처 브랜드입니다.
              </p>
              <p>
                그 밖에 <strong>자체 제조, 생산의 노하우</strong>로 맛의 경쟁력을 두어 가맹점 운영의 경쟁력을 더욱 극대화하였습니다.
                내 가족이 먹는 음식처럼 더 깨끗하고, 더 맛있는 120겹 파이를 제공하기 위하여 언제나 정성을 담아내겠습니다.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {/* Card 1 */}
            <div className="bg-white rounded-3xl overflow-hidden border border-neutral-200/80 shadow-md flex flex-col group">
              <div className="h-64 sm:h-72 bg-neutral-900 relative overflow-hidden">
                <img
                  src={optimizeCloudinaryUrl(
                    "https://res.cloudinary.com/dfarfqx7e/image/upload/v1781184019/120%EA%B2%B9%ED%8C%8C%EC%9D%B4_%ED%81%AC%EB%A6%BC%EC%B9%98%EC%A6%88_%EC%97%B0%EC%B6%9C_ebuddm.jpg"
                  )}
                  alt="120겹 파이 이미지"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="bg-[#78A739] text-white p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1">
                  <p className="text-xs text-white/80 font-bold">깊은 맛과 풍미가 일품인</p>
                  <h3 className="text-xl sm:text-2xl font-black">120겹 수제 파이</h3>
                </div>
                <Link
                  href="/brand/menu"
                  className="inline-flex items-center text-xs font-black text-white hover:underline gap-1"
                >
                  전체 메뉴 보기 &gt;
                </Link>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-3xl overflow-hidden border border-neutral-200/80 shadow-md flex flex-col group">
              <div className="h-64 sm:h-72 bg-neutral-900 relative overflow-hidden">
                <img
                  src={optimizeCloudinaryUrl(
                    "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784705753/ChatGPT_Image_2026%EB%85%84_7%EC%9B%94_22%EC%9D%BC_%EC%98%A4%ED%9B%84_04_35_21_1_vvaugb.png"
                  )}
                  alt="120PIE 매장 파사드 이미지"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="bg-[#78A739] text-white p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="flex flex-wrap gap-1.5 text-[10px] font-extrabold text-white/90">
                  <span className="px-2 py-0.5 bg-white/20 rounded-md">#홀매출</span>
                  <span className="px-2 py-0.5 bg-white/20 rounded-md">#테이크아웃</span>
                  <span className="px-2 py-0.5 bg-white/20 rounded-md">#배달</span>
                  <span className="px-2 py-0.5 bg-white/20 rounded-md">#높은수익률</span>
                  <span className="px-2 py-0.5 bg-white/20 rounded-md">#키오스크</span>
                  <span className="px-2 py-0.5 bg-white/20 rounded-md">#조리간소화</span>
                  <span className="px-2 py-0.5 bg-white/20 rounded-md">#고회전율</span>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-white/80 font-bold">차별화된 성공 창업 시스템</p>
                  <h3 className="text-xl sm:text-2xl font-black">120PIE & COFFEE</h3>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-3xl overflow-hidden border border-neutral-200/80 shadow-md flex flex-col group">
              <div className="h-64 sm:h-72 bg-neutral-900 relative overflow-hidden">
                <img
                  src={optimizeCloudinaryUrl(
                    "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784705760/ChatGPT_Image_2026%EB%85%84_7%EC%9B%94_22%EC%9D%BC_%EC%98%A4%ED%9B%84_04_35_22_2_mpdbps.png"
                  )}
                  alt="인테리어 컨셉 이미지"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="bg-[#78A739] text-white p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1">
                  <p className="text-xs text-white/80 font-bold">편안하고 깨끗한 이미지, 힐링 공간</p>
                  <h3 className="text-lg sm:text-xl font-black leading-snug">
                    수제 느낌을 강조한 카페형 인테리어 컨셉
                  </h3>
                </div>
                <Link
                  href="/brand/bi"
                  className="inline-flex items-center text-xs font-black text-white hover:underline gap-1"
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
              브랜드 파워 No.1! <span className="text-[#FBC400]">120PIE</span>
            </h2>
            <p className="text-sm sm:text-lg text-neutral-300 font-semibold">
              디저트 카페 시장점유율 1위! 1등의 이유는 확실합니다!
            </p>
          </div>

          <div className="space-y-16 sm:space-y-24 pt-8">
            {/* Block 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 h-64 sm:h-80 rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-800 relative">
                <img
                  src={optimizeCloudinaryUrl(
                    "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784705753/ChatGPT_Image_2026%EB%85%84_7%EC%9B%94_22%EC%9D%BC_%EC%98%A4%ED%9B%84_04_35_21_1_vvaugb.png"
                  )}
                  alt="트렌드 분석 이미지"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="lg:col-span-7 space-y-4 text-left">
                <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                  성공 창업의 첫째 조건은 <span className="text-[#FBC400]">정확한 트렌드 분석</span>
                </h3>
                <p className="text-sm sm:text-base text-neutral-300 font-medium leading-relaxed">
                  무조건 싸게 파는 저가형 브랜드는 단명하기 쉬운 아이템이므로 절대 조심해야 합니다.
                  나와 내 가족이 안심하고 먹지 못하는 아이템은 소비자에게 절대로 인정받을 수 없습니다.
                </p>
                <p className="text-sm sm:text-base text-neutral-300 font-medium leading-relaxed">
                  120PIE는 현 트렌드의 흐름을 정확하게 캐치하여 대중적인 것을 특화 시킨 차별화된 성공 창업 아이템입니다.
                </p>
              </div>
            </div>

            {/* Block 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4 text-left order-2 lg:order-1">
                <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                  주머니가 가벼운 불경기에 맞는 <span className="text-[#FBC400]">저렴한 메뉴 구성</span>
                </h3>
                <p className="text-sm sm:text-base text-neutral-300 font-medium leading-relaxed">
                  120PIE는 학생, 직장인, 다수의 서민층의 눈높이에 맞추어 가격은 더 저렴하면서 중독성 있는 맛과 비주얼로 고객만족도를 우선하였습니다.
                </p>
              </div>
              <div className="lg:col-span-5 h-64 sm:h-80 rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-800 relative order-1 lg:order-2">
                <img
                  src={optimizeCloudinaryUrl(
                    "https://res.cloudinary.com/dfarfqx7e/image/upload/v1781184019/120%EA%B2%B9%ED%8C%8C%EC%9D%B4_%ED%81%AC%EB%A6%BC%EC%B9%98%EC%A6%88_%EC%97%B0%EC%B6%9C_ebuddm.jpg"
                  )}
                  alt="메뉴 구성 이미지"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Block 3 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 h-64 sm:h-80 rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-800 relative">
                <img
                  src={optimizeCloudinaryUrl(
                    "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784705760/ChatGPT_Image_2026%EB%85%84_7%EC%9B%94_22%EC%9D%BC_%EC%98%A4%ED%9B%84_04_35_22_2_mpdbps.png"
                  )}
                  alt="가맹 본사 이미지"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="lg:col-span-7 space-y-4 text-left">
                <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                  검증된 프랜차이즈 <span className="text-[#FBC400]">가맹 본사 (주)120PIE</span>
                </h3>
                <p className="text-sm sm:text-base text-neutral-300 font-medium leading-relaxed">
                  아무리 좋은 아이템도 가맹본사의 운영 능력이나 프랜차이즈 인프라가 구축되지 않은 부실한 가맹본사는 브랜드 성공의 한계가 드러날 수밖에 없습니다.
                </p>
                <p className="text-sm sm:text-base text-neutral-300 font-medium leading-relaxed">
                  120PIE 가맹본사는 150여개의 협력사와 우수한 인재를 보유한 검증된 가맹본사입니다.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. SYSTEM COMPETITIVENESS & GREEN BORDER BOX */}
      <section className="py-16 sm:py-24 bg-white text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="h-56 rounded-3xl overflow-hidden bg-neutral-100 border border-neutral-200">
              <img
                src={optimizeCloudinaryUrl(
                  "https://res.cloudinary.com/dfarfqx7e/image/upload/v1781184019/120%EA%B2%B9%ED%8C%8C%EC%9D%B4_%ED%81%AC%EB%A6%BC%EC%B9%98%EC%A6%88_%EC%97%B0%EC%B6%9C_ebuddm.jpg"
                )}
                alt="갤러리 이미지 1"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="h-56 rounded-3xl overflow-hidden bg-neutral-100 border border-neutral-200">
              <img
                src={optimizeCloudinaryUrl(
                  "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784705753/ChatGPT_Image_2026%EB%85%84_7%EC%9B%94_22%EC%9D%BC_%EC%98%A4%ED%9B%84_04_35_21_1_vvaugb.png"
                )}
                alt="갤러리 이미지 2"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="h-56 rounded-3xl overflow-hidden bg-neutral-100 border border-neutral-200">
              <img
                src={optimizeCloudinaryUrl(
                  "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784705760/ChatGPT_Image_2026%EB%85%84_7%EC%9B%94_22%EC%9D%BC_%EC%98%A4%ED%9B%84_04_35_22_2_mpdbps.png"
                )}
                alt="갤러리 이미지 3"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="p-8 sm:p-12 border-4 border-[#78A739] rounded-3xl bg-[#FAF9F5] space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3">
                <h3 className="text-lg sm:text-xl font-black text-neutral-900 leading-tight">
                  전 가맹점에 철저한 본사 인력파견 도입으로 <span className="text-[#78A739]">인건비 절감</span>
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 font-medium leading-relaxed">
                  120PIE는 각 가맹점의 효율적 인력 운영 시스템으로 매장 인력 운영 효율을 우선하여 가맹점의 안정적 운영을 극대화시켰습니다.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg sm:text-xl font-black text-neutral-900 leading-tight">
                  아낌없는 가맹 본사의 <span className="text-[#78A739]">홍보 광고 지원과 최고의 시스템</span>
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 font-medium leading-relaxed">
                  120PIE 가맹 본사는 홍보 광고 지원과 본사 운영 시스템, 1일 10만명의 소비자 구매력을 이끌어가는 우수 기업입니다.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg sm:text-xl font-black text-neutral-900 leading-tight">
                  가맹점 우선의 <span className="text-[#78A739]">합리적인 가맹본사</span>
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 font-medium leading-relaxed">
                  120PIE 가맹본사는 전국 책임제 관리 시스템을 정착하여 가맹점과 소통하고 상생하는 선진 프랜차이즈 시스템으로 인정받고 있는 합리적인 가맹본사입니다.
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-neutral-300 text-center max-w-4xl mx-auto space-y-2">
              <p className="text-xs sm:text-sm text-neutral-700 font-bold leading-relaxed">
                120PIE 브랜드는 대한민국 대표 디저트 No.1의 명예와 자부심으로 런칭된 브랜드입니다.
                <br className="hidden sm:inline" />
                그러므로 돈을 벌기 위한 브랜드이기보다 소비자에게 더 좋은 문화와 건강, 그리고 더 안심할 수 있는 먹거리를 제공하는 것이 120PIE의 가치와 목표입니다.
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
      <footer className="bg-neutral-50 border-t border-[#e6dfc3]/40 py-12 sm:py-16 text-neutral-400">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-left">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-8 border-b border-neutral-200">
            <img
              src={optimizeCloudinaryUrl("https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784533894/Group_1_4_jl4rlr.png")}
              alt="120pie 로고"
              className="h-8 w-auto object-contain brightness-75 grayscale"
            />
            <div className="flex flex-wrap gap-4 text-xs font-bold text-neutral-400">
              <Link href="/brand/story" className="hover:text-neutral-600 transition-colors">회사소개</Link>
              <a href="#" className="hover:text-neutral-600 transition-colors">이용약관</a>
              <a href="#" className="hover:text-neutral-600 transition-colors">개인정보처리방침</a>
              <button onClick={() => setIsConsulting(true)} className="hover:text-neutral-600 transition-colors text-amber-600 font-extrabold bg-transparent border-0 cursor-pointer">가맹문의</button>
            </div>
          </div>

          <div className="space-y-2 text-xs font-semibold leading-relaxed">
            <p className="text-neutral-500 font-bold">(주) 120파이 프랜차이즈 본사</p>
            <p>대표자: 홍길동 | 사업자등록번호: 000-00-00000 | 통신판매업신고: 제2026-서울강남-0000호</p>
            <p>주소: 서울특별시 강남구 테헤란로 120 | 고객센터: 1566-3594 | 이메일: contact@120pie.com</p>
          </div>

          <div className="pt-4 border-t border-neutral-200/60 flex flex-col sm:flex-row justify-between items-center text-[11px] font-bold text-neutral-400 gap-2">
            <p>© 120PIE & COFFEE Corp. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
