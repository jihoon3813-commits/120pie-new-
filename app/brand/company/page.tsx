"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Menu, X, Building, MapPin } from "lucide-react";
import { optimizeCloudinaryUrl } from "@/app/utils/cloudinary";
import CursorFollower from "@/components/CursorFollower";
import ConsultationForm from "@/components/ConsultationForm";
import QuickInquiryBar from "@/components/landing-v6/QuickInquiryBar";
import RightFloatingQuickBar from "@/components/RightFloatingQuickBar";
import RightSideInquiryBanner from "@/components/RightSideInquiryBanner";

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
      <header className="sticky top-0 z-50 transition-all duration-300 backdrop-blur-md bg-white/95 py-3 border-b border-neutral-100 shadow-sm isolate">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
          {/* Logo */}
          <Link href="/" title="게이트 페이지로 이동" className="flex items-center gap-2 group shrink-0">
            <img
              src={optimizeCloudinaryUrl("https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784533894/Group_1_4_jl4rlr.png")}
              alt="120pie 로고"
              className="h-[22px] md:h-[26px] w-auto object-contain transition-transform duration-300 group-hover:scale-102"
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
            <Link href="/brand/franchise" className="hover:text-amber-600 transition-colors">
              창업 안내
            </Link>
          </nav>

          {/* Right Header Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link
              href="/franchise"
              className="px-3 py-1.5 sm:px-4 sm:py-2 bg-neutral-950 text-[#fbc400] font-black text-xs rounded-full transition-all duration-300 shadow-xs hover:bg-black border border-neutral-800 cursor-pointer whitespace-nowrap"
            >
              창업홈페이지 바로가기 &rarr;
            </Link>
            <Link
              href="/portal"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-block px-3 py-1.5 sm:px-4 sm:py-2 bg-white text-neutral-800 hover:text-neutral-950 font-bold text-xs rounded-full transition-all border border-neutral-200 hover:border-neutral-400 cursor-pointer whitespace-nowrap"
            >
              점주 전용
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 text-neutral-700 hover:text-amber-600 transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
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
            <Link href="/brand/franchise" className="py-2 border-b border-neutral-800 hover:text-[#fbc400] transition-colors text-left block">
              창업 안내
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
      <div className="sticky top-[58px] z-30 bg-white border-b border-neutral-200 shadow-sm py-3 sm:py-4">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-1.5 sm:gap-3 flex-nowrap overflow-x-auto no-scrollbar whitespace-nowrap">
            {SUB_MENU_TABS.map((tab) => (
              <Link
                key={tab.id}
                href={tab.href}
                className={`px-3.5 py-2 sm:px-6 sm:py-2.5 rounded-full text-[12px] sm:text-sm font-black transition-all duration-300 border shrink-0 ${
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

      {/* MAIN COMPANY INTRO CONTENT (3-STEP CONFIGURATION) */}
      <section className="py-16 sm:py-24 bg-[#FAF9F5] border-t border-neutral-200 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24">

          {/* STEP 01 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
            {/* Left Building/Product Image */}
            <div className="lg:col-span-5 h-72 sm:h-96 rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-200 shadow-xl relative group">
              <img
                src={optimizeCloudinaryUrl(
                  "https://res.cloudinary.com/lyjyvy54/image/upload/v1784775113/ChatGPT_Image_2026%EB%85%84_7%EC%9B%94_23%EC%9D%BC_%EC%98%A4%EC%A0%84_11_51_37_1_vlgoqr.png"
                )}
                alt="가족에게도 자신 있게 권할 수 있는 제품"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 text-white font-extrabold text-sm tracking-wider">
                01. SAFE & HONEST PRODUCT
              </div>
            </div>

            {/* Right Slogan & Text */}
            <div className="lg:col-span-7 space-y-5">
              <div className="space-y-2">
                <span className="text-xs font-black text-amber-600 tracking-widest uppercase block">
                  01. PRODUCT VALUE
                </span>
                <h2 className="text-2xl sm:text-4xl font-black text-neutral-900 leading-tight">
                  가족에게도 자신 있게 권할 수 있는 제품
                </h2>
              </div>
              <div className="space-y-3 text-xs sm:text-base text-neutral-600 font-medium leading-relaxed">
                <p className="font-extrabold text-neutral-800 text-sm sm:text-lg">
                  좋은 브랜드는 정직한 제품에서 시작됩니다.
                </p>
                <p>
                  ㈜120PIE F&B는 한국인의 입맛에 맞게 개발한 정통 120겹 파이와 다양한 디저트 제품을 자체 생산하여 가맹점에 안정적으로 공급합니다. 표준화된 제조 공정과 체계적인 가맹 시스템을 기반으로 매장마다 균일한 맛과 품질을 유지합니다.
                </p>
                <p>
                  원재료 선정부터 제조·포장·유통까지 전 과정을 철저하게 관리하고, 위생적인 생산 환경과 신선한 재료를 원칙으로 합니다. 고객이 안심하고 선택할 수 있는 제품을 통해 브랜드 가치와 가맹점의 신뢰를 함께 지켜갑니다.
                </p>
              </div>
            </div>
          </div>

          {/* STEP 02 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
            {/* Left Text */}
            <div className="lg:col-span-7 space-y-5 order-2 lg:order-1">
              <div className="space-y-2">
                <span className="text-xs font-black text-amber-600 tracking-widest uppercase block">
                  02. BUSINESS COMPETITIVENESS
                </span>
                <h2 className="text-2xl sm:text-4xl font-black text-neutral-900 leading-tight">
                  상품 자체가 경쟁력이 되는 창업
                </h2>
              </div>
              <div className="space-y-3 text-xs sm:text-base text-neutral-600 font-medium leading-relaxed">
                <p className="font-extrabold text-neutral-800 text-sm sm:text-lg">
                  성공적인 창업은 투자 대비 높은 사업 효율에서 시작됩니다.
                </p>
                <p>
                  120PIE의 차별화된 120겹과 먹음직스러운 비주얼은 고객의 시선을 끌고 자연스러운 입소문과 콘텐츠 확산을 유도합니다. 제품 자체가 강력한 마케팅 요소가 되어 가맹점의 홍보 부담을 줄이고 효율적인 매장 운영을 돕습니다.
                </p>
                <p>
                  엄선된 메뉴와 합리적인 가격 경쟁력을 바탕으로 오피스·주거·학원가·일반 상권 등 다양한 입지에 적용할 수 있습니다. 상권의 규모에만 의존하지 않고 제품력과 재구매를 통해 지속적인 성장을 만들어가는 창업 모델입니다.
                </p>
              </div>
            </div>

            {/* Right Food Visual */}
            <div className="lg:col-span-5 h-72 sm:h-96 rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-200 shadow-xl relative order-1 lg:order-2 group">
              <img
                src={optimizeCloudinaryUrl(
                  "https://res.cloudinary.com/lyjyvy54/image/upload/v1784775113/ChatGPT_Image_2026%EB%85%84_7%EC%9B%94_23%EC%9D%BC_%EC%98%A4%EC%A0%84_11_51_37_2_kjxr3b.png"
                )}
                alt="상품 자체가 경쟁력이 되는 창업"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 text-white font-extrabold text-sm tracking-wider">
                02. PRODUCT COMPETITIVENESS
              </div>
            </div>
          </div>

          {/* STEP 03 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
            {/* Left Factory Image */}
            <div className="lg:col-span-5 h-72 sm:h-96 rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-200 shadow-xl relative group">
              <img
                src={optimizeCloudinaryUrl(
                  "https://res.cloudinary.com/lyjyvy54/image/upload/v1784775114/ChatGPT_Image_2026%EB%85%84_7%EC%9B%94_23%EC%9D%BC_%EC%98%A4%EC%A0%84_11_51_37_3_pghpm2.png"
                )}
                alt="품질을 지키는 자체 생산·물류 시스템"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 text-white font-extrabold text-sm tracking-wider">
                03. DIRECT PRODUCTION & LOGISTICS
              </div>
            </div>

            {/* Right Slogan & Text */}
            <div className="lg:col-span-7 space-y-5">
              <div className="space-y-2">
                <span className="text-xs font-black text-amber-600 tracking-widest uppercase block">
                  03. SYSTEM & LOGISTICS
                </span>
                <h2 className="text-2xl sm:text-4xl font-black text-neutral-900 leading-tight">
                  품질을 지키는 자체 생산·물류 시스템
                </h2>
              </div>
              <div className="space-y-3 text-xs sm:text-base text-neutral-600 font-medium leading-relaxed">
                <p className="font-extrabold text-neutral-800 text-sm sm:text-lg">
                  제품의 완성도는 생산부터 배송까지 이어집니다.
                </p>
                <p>
                  ㈜120PIE F&B는 파이 시트와 베이커리 제품, 전용 소스 등을 본사에서 직접 생산하고 가맹점에 공급하는 자체 생산·물류 시스템을 운영합니다. 원재료 입고부터 제조·품질관리·보관·출고까지 전 과정을 체계적으로 관리하여 제품의 맛과 품질을 균일하게 유지합니다.
                </p>
                <p>
                  외부 생산업체에 의존하지 않는 안정적인 공급 체계를 바탕으로 유통 과정의 불필요한 비용과 변수를 줄였습니다. 전국 가맹점 어디에서나 120PIE 고유의 맛을 동일하게 제공할 수 있도록 신속하고 안정적인 물류 환경을 지원합니다.
                </p>
              </div>
            </div>
          </div>

          {/* 하단 브랜드 메시지 (Yellow Border Box) */}
          <div className="p-8 sm:p-12 border-4 border-[#FBC400] rounded-3xl bg-white shadow-xl text-center space-y-4">
            <span className="inline-block px-3.5 py-1 bg-[#FBC400]/20 text-amber-950 rounded-full text-xs font-black uppercase tracking-wider">
              120PIE BRAND PHILOSOPHY
            </span>
            <p className="text-base sm:text-xl font-bold text-neutral-900 leading-relaxed max-w-4xl mx-auto">
              120PIE는 차별화된 제품과 체계적인 운영 시스템을 바탕으로 성장해 온 디저트 브랜드입니다.
            </p>
            <p className="text-sm sm:text-base font-semibold text-neutral-600 leading-relaxed max-w-4xl mx-auto">
              단기적인 이익보다 고객에게 좋은 맛과 즐거운 경험을 제공하고, 가맹점과 오래 함께 성장하는 것을 가장 중요한 가치로 생각합니다.
            </p>
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

      {/* Right Floating Quick Docking Bar */}
      <RightFloatingQuickBar onOpenConsultation={() => setIsConsulting(true)} />

      {/* Right Side Inquiry Banner (300px width) */}
      <RightSideInquiryBanner />
    </div>
  );
}
