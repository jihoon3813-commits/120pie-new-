"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Menu, X, Sparkles, Palette, Home, CheckCircle2 } from "lucide-react";
import { optimizeCloudinaryUrl } from "@/app/utils/cloudinary";
import CursorFollower from "@/components/CursorFollower";
import ConsultationForm from "@/components/ConsultationForm";
import QuickInquiryBar from "@/components/landing-v6/QuickInquiryBar";
import RightFloatingQuickBar from "@/components/RightFloatingQuickBar";
import RightSideInquiryBanner from "@/components/RightSideInquiryBanner";
import BrandHeader from "@/components/BrandHeader";
import Footer from "@/app/components/Footer";

export default function BiInteriorPage() {
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
              BI & 인테리어
            </h1>
            <p className="text-xs sm:text-sm font-semibold tracking-widest text-[#FBC400] uppercase">
              Brand Identity & Interior Space Design
            </p>
          </div>
          <p className="text-lg sm:text-2xl font-bold text-neutral-200">
            따뜻함과 세련됨이 교차하는 프리미엄 공간 디자인
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
                  tab.id === "bi"
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

      {/* MAIN BI & INTERIOR CONTENT */}
      <section className="py-16 sm:py-24 bg-[#FAF9F5] border-t border-neutral-200 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24">

          {/* BI BRAND IDENTITY SECTION (Image 1 & Image 2 Layout) */}
          <div className="space-y-12">
            
            {/* 1. TOP LARGE LOGO BOX */}
            <div className="bg-white p-8 sm:p-16 rounded-3xl border border-neutral-300 shadow-sm flex items-center justify-center min-h-[260px] sm:min-h-[320px]">
              <img
                src={optimizeCloudinaryUrl("https://res.cloudinary.com/lyjyvy54/image/upload/v1784642722/120%ED%8C%8C%EC%9D%B4_%EC%BB%A4%ED%94%BC_%EA%B8%88%EC%A0%95%EC%A0%90_%EC%B1%84%EB%84%90%EC%82%AC%EC%9D%B8_%EB%94%94%EC%9E%90%EC%9D%B8_250828_j3kejm.png")}
                alt="120PIE & COFFEE 공식 시그니처 로고"
                className="max-h-24 sm:max-h-32 w-auto object-contain"
              />
            </div>

            {/* 2. BASIC SYSTEM TEXT SECTION */}
            <div className="space-y-4 text-left">
              <div className="flex items-center gap-3">
                <div className="w-12 h-1 bg-[#FBC400] rounded-full" />
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-neutral-900 uppercase">
                  BASIC SYSTEM
                </h2>
              </div>
              <p className="text-sm sm:text-base text-neutral-700 font-medium leading-relaxed max-w-5xl">
                120PIE의 BI(brand identity)는 120겹의 정성이 깃든 수제 파이와 깊은 풍미의 로스팅 커피의 조화, 맛과 가격, 품질 등 모든 면에서 고집스럽게 더 솔직한 120PIE의 정신을 나타냅니다. 대한민국 No.1 디저트 카페 120PIE & COFFEE와 함께해 주세요!
              </p>
              <p className="text-[11px] sm:text-xs text-neutral-400 font-medium leading-normal">
                * BI(brand identity)는 브랜드의 개성, 핵심가치, 경쟁력 등을 문자, 도형, 색상 등을 사용하여 시각적으로 표현한 것입니다. 규정에 정해진대로 사용하며, 비율이나 색상을 임의로 바꿀 수 없습니다.
              </p>
            </div>

            {/* 3. LOGO VARIATIONS GRID & COLOR SYSTEM */}
            <div className="bg-neutral-100/80 p-6 sm:p-10 rounded-3xl border border-neutral-200/80 space-y-10">
              
              {/* 4 Logo Variations Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Variant 1: 기본형 */}
                <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm flex flex-col items-center justify-between min-h-[220px] text-center">
                  <div className="flex-1 flex items-center justify-center p-2">
                    <img
                      src={optimizeCloudinaryUrl("https://res.cloudinary.com/lyjyvy54/image/upload/v1784642722/120%ED%8C%8C%EC%9D%B4_%EC%BB%A4%ED%94%BC_%EA%B8%88%EC%A0%95%EC%A0%90_%EC%B1%84%EB%84%90%EC%82%AC%EC%9D%B8_%EB%94%94%EC%9E%90%EC%9D%B8_250828_j3kejm.png")}
                      alt="기본형 로고"
                      className="max-h-12 w-auto object-contain"
                    />
                  </div>
                  <div className="pt-3 border-t border-neutral-100 w-full space-y-0.5">
                    <h3 className="font-extrabold text-sm text-neutral-900">기본형</h3>
                    <p className="text-[10px] text-neutral-400 font-medium">상표등록번호 제 40-1770877호</p>
                  </div>
                </div>

                {/* Variant 2: 두줄 가로형 */}
                <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm flex flex-col items-center justify-between min-h-[220px] text-center">
                  <div className="flex-1 flex items-center justify-center p-2">
                    <img
                      src={optimizeCloudinaryUrl("https://res.cloudinary.com/lyjyvy54/image/upload/v1784730823/Group_1_6_cm1oeu.png")}
                      alt="두줄 가로형 로고"
                      className="max-h-14 w-auto object-contain"
                    />
                  </div>
                  <div className="pt-3 border-t border-neutral-100 w-full space-y-0.5">
                    <h3 className="font-extrabold text-sm text-neutral-900">두줄 가로형</h3>
                  </div>
                </div>

                {/* Variant 3: 심볼형 */}
                <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm flex flex-col items-center justify-between min-h-[220px] text-center">
                  <div className="flex-1 flex items-center justify-center p-2">
                    <img
                      src={optimizeCloudinaryUrl("https://res.cloudinary.com/lyjyvy54/image/upload/v1784730823/120%ED%8C%8C%EC%9D%B4_%EC%BB%A4%ED%94%BC_%EA%B8%88%EC%A0%95%EC%A0%90_%EC%B1%84%EB%84%90%EC%82%AC%EC%9D%B8_%EB%94%94%EC%9E%90%EC%9D%B8_250828_5_eadptv.png")}
                      alt="심볼형 심볼"
                      className="max-h-16 w-auto object-contain"
                    />
                  </div>
                  <div className="pt-3 border-t border-neutral-100 w-full space-y-0.5">
                    <h3 className="font-extrabold text-sm text-neutral-900">심볼형</h3>
                  </div>
                </div>

                {/* Variant 4: 두줄 심볼형 */}
                <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm flex flex-col items-center justify-between min-h-[220px] text-center">
                  <div className="flex-1 flex items-center justify-center p-2">
                    <img
                      src={optimizeCloudinaryUrl("https://res.cloudinary.com/lyjyvy54/image/upload/v1784730823/Group_2_2_atzhmu.png")}
                      alt="두줄 심볼형 로고"
                      className="max-h-16 w-auto object-contain"
                    />
                  </div>
                  <div className="pt-3 border-t border-neutral-100 w-full space-y-0.5">
                    <h3 className="font-extrabold text-sm text-neutral-900">두줄 심볼형</h3>
                  </div>
                </div>
              </div>

              {/* COLOR SYSTEM */}
              <div className="space-y-4 pt-4 border-t border-neutral-200">
                <h3 className="text-lg font-black text-neutral-900 uppercase tracking-tight text-left">
                  COLOR SYSTEM
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {/* Swatch 1 */}
                  <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm space-y-3">
                    <div className="h-20 rounded-xl bg-[#FBC400] shadow-inner" />
                    <div className="space-y-0.5 text-left text-xs">
                      <p className="font-extrabold text-neutral-900 text-sm">#fbc400</p>
                      <p className="text-neutral-500 font-medium text-[11px]">CMYK : C0 / M22 / Y100 / K0</p>
                    </div>
                  </div>

                  {/* Swatch 2 */}
                  <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm space-y-3">
                    <div className="h-20 rounded-xl bg-white border border-neutral-200 shadow-inner" />
                    <div className="space-y-0.5 text-left text-xs">
                      <p className="font-extrabold text-neutral-900 text-sm">#ffffff</p>
                      <p className="text-neutral-500 font-medium text-[11px]">CMYK : C0 / M0 / Y0 / K0</p>
                    </div>
                  </div>

                  {/* Swatch 3 */}
                  <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm space-y-3">
                    <div className="h-20 rounded-xl bg-[#0D233A] shadow-inner" />
                    <div className="space-y-0.5 text-left text-xs">
                      <p className="font-extrabold text-neutral-900 text-sm">#0d233a</p>
                      <p className="text-neutral-500 font-medium text-[11px]">CMYK : C90 / M75 / Y30 / K40</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* INTERIOR CONCEPT SECTION */}
          <div className="space-y-10 pt-8 border-t border-neutral-200">
            <div className="text-center space-y-2">
              <span className="text-xs font-black text-amber-600 tracking-widest uppercase block">
                INTERIOR SPACE CONCEPT
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-neutral-900 tracking-tight">
                수제 느낌을 강조한 카페형 인테리어
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 font-semibold">
                편안하고 깨끗한 이미지, 힐링 먹거리 공간을 제공하는 120PIE 인테리어
              </p>
            </div>

            {/* Interior Gallery Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-3xl overflow-hidden border border-neutral-200 shadow-md group">
                <div className="h-64 sm:h-72 bg-neutral-900 overflow-hidden relative">
                  <img
                    src={optimizeCloudinaryUrl(
                      "https://res.cloudinary.com/lyjyvy54/image/upload/v1784774102/ChatGPT_Image_2026%EB%85%84_7%EC%9B%94_20%EC%9D%BC_%EC%98%A4%ED%9B%84_04_18_15_zpyxn2.png"
                    )}
                    alt="카페 메인 홀 인테리어"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-6 space-y-2">
                  <h3 className="font-extrabold text-neutral-900 text-lg">메인 카페 홀 (Cafe Hall)</h3>
                  <p className="text-xs text-neutral-600 font-medium leading-relaxed">
                    따뜻한 원목 감성과 아늑한 조명으로 편안하게 디저트와 커피를 즐길 수 있는 공간 디자인
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-3xl overflow-hidden border border-neutral-200 shadow-md group">
                <div className="h-64 sm:h-72 bg-neutral-900 overflow-hidden relative">
                  <img
                    src={optimizeCloudinaryUrl(
                      "https://res.cloudinary.com/lyjyvy54/image/upload/v1784774149/ChatGPT_Image_2026%EB%85%84_7%EC%9B%94_21%EC%9D%BC_%EC%98%A4%ED%9B%84_02_11_53_t8xp5w.png"
                    )}
                    alt="스마트 키오스크 & 주문 픽업 존"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-6 space-y-2">
                  <h3 className="font-extrabold text-neutral-900 text-lg">키오스크 & 픽업 존 (Pickup Zone)</h3>
                  <p className="text-xs text-neutral-600 font-medium leading-relaxed">
                    동선 최소화 및 무인 키오스크 도입으로 테이크아웃 및 포장 고객의 동선 편의성을 극대화
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-3xl overflow-hidden border border-neutral-200 shadow-md group">
                <div className="h-64 sm:h-72 bg-neutral-900 overflow-hidden relative">
                  <img
                    src={optimizeCloudinaryUrl(
                      "https://res.cloudinary.com/lyjyvy54/image/upload/v1784774163/ChatGPT_Image_2026%EB%85%84_7%EC%9B%94_21%EC%9D%BC_%EC%98%A4%ED%9B%84_02_11_48_q8rcat.png"
                    )}
                    alt="오픈 베이킹 쇼케이스"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-6 space-y-2">
                  <h3 className="font-extrabold text-neutral-900 text-lg">오픈 베이킹 쇼케이스 (Baking Showcase)</h3>
                  <p className="text-xs text-neutral-600 font-medium leading-relaxed">
                    갓 구워낸 120겹 파이의 고소한 향과 시각적 즐거움을 소비자에게 직접 전달하는 매장 레이아웃
                  </p>
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
            className="w-full max-w-2xl bg-neutral-950 border border-[#FBC400]/30 rounded-lg sm:rounded-xl p-5 sm:p-7 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] relative my-auto overflow-hidden text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-[#FBC400] to-amber-500" />

            <button
              onClick={() => setIsConsulting(false)}
              className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-md cursor-pointer transition-colors z-50"
            >
              <X size={18} />
            </button>

            <div className="mb-4 select-none space-y-1 pr-8">
              <span className="inline-block px-2.5 py-0.5 bg-[#FBC400]/10 border border-[#FBC400]/30 text-[#FBC400] text-[10px] font-black tracking-widest rounded-md uppercase">
                120PIE FRANCHISE CONSULTING
              </span>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                빠른 창업 신청
              </h2>
              <p className="text-xs text-neutral-400 font-medium">
                성함과 연락처를 남겨주시면 1:1 담당 컨설턴트가 빠르게 안내해 드립니다.
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
