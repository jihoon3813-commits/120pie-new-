"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Menu, X, Building, MapPin } from "lucide-react";
import { optimizeCloudinaryUrl } from "@/app/utils/cloudinary";
import CursorFollower from "@/components/CursorFollower";
import ConsultationForm from "@/components/ConsultationForm";
import QuickInquiryBar from "@/components/landing-v6/QuickInquiryBar";

export default function CompanyIntroPage() {
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
          className="absolute inset-0 bg-cover bg-center opacity-60 scale-105"
          style={{
            backgroundImage: `url('${optimizeCloudinaryUrl(
              "https://res.cloudinary.com/lyjyvy54/image/upload/v1784732578/ChatGPT_Image_2026%EB%85%84_6%EC%9B%94_9%EC%9D%BC_%EC%98%A4%ED%9B%84_09_02_58_udtq5s.png"
            )}')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-transparent z-10" />

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              기업소개
            </h1>
            <p className="text-xs sm:text-sm font-semibold tracking-widest text-[#FBC400] uppercase">
              120PIE F&B Corp.
            </p>
          </div>
          <p className="text-lg sm:text-2xl font-bold text-neutral-200">
            대한민국 프랜차이즈 디저트를 이끄는 선두주자
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
                  tab.id === "company"
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

      {/* MAIN COMPANY INTRO CONTENT (Images 1, 2, 3) */}
      <section className="py-16 sm:py-24 bg-[#FAF9F5] border-t border-neutral-200 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24">

          {/* IMAGE 1-A: Corporate Manifesto Block (Left Building Image, Right Slogan) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
            {/* Left Building Exterior */}
            <div className="lg:col-span-5 h-72 sm:h-96 rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-200 shadow-xl relative group">
              <img
                src={optimizeCloudinaryUrl(
                  "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784705753/ChatGPT_Image_2026%EB%85%84_7%EC%9B%94_22%EC%9D%BC_%EC%98%A4%ED%9B%84_04_35_21_1_vvaugb.png"
                )}
                alt="120PIE F&B 신사옥 전경"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 text-white font-extrabold text-sm tracking-wider">
                120PIE F&B HQ BUILDING
              </div>
            </div>

            {/* Right Slogan & Text */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-black text-amber-600 tracking-widest uppercase block">
                  120PIE F&B Corp.
                </span>
                <h2 className="text-3xl sm:text-5xl font-black text-neutral-900 leading-tight">
                  내 가족이 먹지 못하는<br />음식은 팔지 않겠습니다.
                </h2>
              </div>
              <p className="text-sm sm:text-base text-neutral-600 font-medium leading-relaxed">
                (주)120PIE F&B는 우리의 입맛에 맞는 정통 120겹 수제 파이와 디저트 시트를 자체 생산 제조하여 가맹점에 공급하는 선진 프랜차이즈 시스템이 완비된 기업으로 대한민국 디저트 프랜차이즈 업계를 이끌고 있는 선두주자로 그 역할을 다 하고 있습니다.
              </p>
            </div>
          </div>

          {/* IMAGE 1-B: Teal/Dark Blue Factory Background Banner */}
          <div className="relative rounded-3xl overflow-hidden bg-teal-900 py-12 px-6 sm:px-14 text-white text-center shadow-xl">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-overlay"
              style={{
                backgroundImage: `url('${optimizeCloudinaryUrl(
                  "https://res.cloudinary.com/dfarfqx7e/image/upload/v1781184019/120%EA%B2%B9%ED%8C%8C%EC%9D%B4_%ED%81%AC%EB%A6%BC%EC%B9%98%EC%A6%88_%EC%97%B0%EC%B6%9C_ebuddm.jpg"
                )}')`,
              }}
            />
            <div className="relative z-10 max-w-4xl mx-auto space-y-3">
              <p className="text-base sm:text-xl font-bold leading-relaxed text-teal-50">
                소비자와의 약속을 위해 철저한 위생관리 및 계절별 신선한 재료만을 엄선하여 가맹본사에서 자체 생산 및 유통을 원칙으로 브랜드 보호 및 가맹점 관리를 우선으로 하는 프랜차이즈 가맹본사입니다.
              </p>
            </div>
          </div>

          {/* IMAGE 2: Value Proposition & Overlapping Card Block */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-4">
            {/* Left Food Visual */}
            <div className="lg:col-span-6 h-80 sm:h-[420px] rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-200 shadow-xl relative">
              <img
                src={optimizeCloudinaryUrl(
                  "https://res.cloudinary.com/dfarfqx7e/image/upload/v1781184019/120%EA%B2%B9%ED%8C%8C%EC%9D%B4_%ED%81%AC%EB%A6%BC%EC%B9%98%EC%A6%88_%EC%97%B0%EC%B6%9C_ebuddm.jpg"
                )}
                alt="120PIE 시그니처 메뉴 이미지"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-white text-xs font-bold">
                <div className="h-1 bg-[#78A739] w-28 rounded-full" />
                <span>03 / 03</span>
              </div>
            </div>

            {/* Right Overlapping White Card */}
            <div className="lg:col-span-6 bg-white p-8 sm:p-12 rounded-3xl border border-neutral-200/80 shadow-lg space-y-6 lg:-ml-12 lg:z-10">
              <h3 className="text-2xl sm:text-4xl font-black text-neutral-900 leading-tight">
                성공 창업은 가성비가<br />높아야 합니다
              </h3>
              <div className="space-y-4 text-xs sm:text-sm text-neutral-600 font-medium leading-relaxed">
                <p>
                  120PIE는 메뉴 그 자체가 홍보 마케팅입니다. 그러므로 별도의 비용을 들여서 홍보를 하지 않아도 됩니다. 120PIE만의 특화된 경쟁력으로 임대료가 저렴한 상권 등에서도 점주님의 성공 창업 실현을 도와드립니다.
                </p>
                <p>
                  특화되고 엄선된 메뉴로 미각과 시각 모두를 만족시켜 소비자에게 기억되는 브랜드입니다. 120PIE의 경쟁력은 오피스, 주거, 일반 상권에서도 대박 매출이 가능한 브랜드입니다.
                </p>
              </div>
            </div>
          </div>

          {/* IMAGE 3: Automation System Introduction */}
          <div className="space-y-10 pt-8 border-t border-neutral-200">
            {/* Top Intro (Left Text, Right Factory Image) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-4">
                <span className="text-xs font-black text-amber-600 tracking-widest uppercase block">
                  120PIE F&B Corp.
                </span>
                <h3 className="text-2xl sm:text-4xl font-black text-neutral-900 leading-tight">
                  (주)120PIE F&B 자동화 시스템 소개
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 font-medium leading-relaxed">
                  (주)120PIE F&B는 대대적인 자금을 투자하여 대지 2,000평, 건평 5,000평의 단일규모로는 국내 프랜차이즈 업계 최대 규모의 신사옥을 건립하였으며, 이를 통해 가맹점에 더욱 체계적이고 위생적인 양질의 물류를 지원하고 있습니다.
                </p>
              </div>

              <div className="lg:col-span-6 h-64 sm:h-80 rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-200 shadow-md">
                <img
                  src={optimizeCloudinaryUrl(
                    "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784705760/ChatGPT_Image_2026%EB%85%84_7%EC%9B%94_22%EC%9D%BC_%EC%98%A4%ED%9B%84_04_35_22_2_mpdbps.png"
                  )}
                  alt="자동화 시스템 라인"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Center Green Banner Box */}
            <div className="p-8 sm:p-10 bg-[#78A739] text-white rounded-3xl shadow-md text-center space-y-3">
              <p className="text-xs sm:text-base font-bold leading-relaxed max-w-4xl mx-auto">
                (주)120PIE F&B는 하루 생산량 총 100톤을 소화할 수 있는 규모와 가공장비를 도입하여, 업계 최초이자 유일하게 파이 시트뿐만 아니라 빵, 소스를 직접 생산하고 공급할 수 있는 최신 시설과 장비를 갖추고 있습니다.
              </p>
              <p className="text-xs sm:text-base font-bold leading-relaxed max-w-4xl mx-auto text-white/90">
                또한, 최첨단 본사 자체 물류센터 시스템을 통해 정통 120겹 파이 본연의 맛을 소비자들에게 100% 제공하고 있습니다.
              </p>
            </div>

            {/* Bottom 3-Card Automation Line Gallery */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
              <div className="rounded-3xl overflow-hidden border border-neutral-200 bg-white shadow-sm flex flex-col group">
                <div className="h-48 bg-neutral-900 overflow-hidden">
                  <img
                    src={optimizeCloudinaryUrl(
                      "https://res.cloudinary.com/dfarfqx7e/image/upload/v1781184019/120%EA%B2%B9%ED%8C%8C%EC%9D%B4_%ED%81%AC%EB%A6%BC%EC%B9%98%EC%A6%88_%EC%97%B0%EC%B6%9C_ebuddm.jpg"
                    )}
                    alt="자동 파이 시트 성형"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="py-3 px-4 bg-[#78A739] text-white font-extrabold text-xs text-center">
                  자동 파이 시트 성형
                </div>
              </div>

              <div className="rounded-3xl overflow-hidden border border-neutral-200 bg-white shadow-sm flex flex-col group">
                <div className="h-48 bg-neutral-900 overflow-hidden">
                  <img
                    src={optimizeCloudinaryUrl(
                      "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784705753/ChatGPT_Image_2026%EB%85%84_7%EC%9B%94_22%EC%9D%BC_%EC%98%A4%ED%9B%84_04_35_21_1_vvaugb.png"
                    )}
                    alt="자동 급냉 시스템"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="py-3 px-4 bg-[#78A739] text-white font-extrabold text-xs text-center">
                  자동 급냉 시스템
                </div>
              </div>

              <div className="rounded-3xl overflow-hidden border border-neutral-200 bg-white shadow-sm flex flex-col group">
                <div className="h-48 bg-neutral-900 overflow-hidden">
                  <img
                    src={optimizeCloudinaryUrl(
                      "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784705760/ChatGPT_Image_2026%EB%85%84_7%EC%9B%94_22%EC%9D%BC_%EC%98%A4%ED%9B%84_04_35_22_2_mpdbps.png"
                    )}
                    alt="자동 진공 포장"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="py-3 px-4 bg-[#78A739] text-white font-extrabold text-xs text-center">
                  자동 진공 포장
                </div>
              </div>
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
