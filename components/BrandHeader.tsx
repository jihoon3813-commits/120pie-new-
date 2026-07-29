"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronRight } from "lucide-react";
import { optimizeCloudinaryUrl } from "@/app/utils/cloudinary";
import MobileBottomInquiryBar from "@/components/MobileBottomInquiryBar";
import { useModalBackHandler } from "@/components/MobileBackManager";

interface BrandHeaderProps {
  onConsultClick?: () => void;
}

export default function BrandHeader({ onConsultClick }: BrandHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useModalBackHandler("brand-mobile-menu", mobileMenuOpen, () => setMobileMenuOpen(false));

  return (
    <>
      {/* BRAND GNB HEADER */}
      <header className="sticky top-0 z-50 transition-all duration-300 backdrop-blur-md bg-white/95 py-3 border-b border-neutral-100 shadow-sm isolate">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
          {/* Logo */}
          <Link href="/" title="게이트 페이지로 이동" className="flex items-center gap-2 group shrink-0">
            <img
              src={optimizeCloudinaryUrl(
                "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784533894/Group_1_4_jl4rlr.png"
              )}
              alt="120pie 로고"
              className="h-[22px] md:h-[26px] w-auto object-contain transition-transform duration-300 group-hover:scale-102"
            />
          </Link>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-10 font-medium text-[16px] text-neutral-700">
            <Link href="/brand/story" className="hover:text-amber-600 transition-colors whitespace-nowrap">
              브랜드 소개
            </Link>
            <Link href="/brand/menu" className="hover:text-amber-600 transition-colors whitespace-nowrap">
              메뉴 소개
            </Link>
            <Link href="/stores" className="hover:text-amber-600 transition-colors whitespace-nowrap">
              매장 찾기
            </Link>
            <Link href="/brand/franchise" className="hover:text-amber-600 transition-colors whitespace-nowrap">
              창업 안내
            </Link>
          </nav>

          {/* Right Header Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* 창업홈페이지 바로가기: Desktop only in header */}
            <Link
              href="/franchise"
              className="hidden md:inline-flex px-3 py-1.5 sm:px-4 sm:py-2 bg-neutral-950 text-[#fbc400] font-black text-xs rounded-full transition-all duration-300 shadow-xs hover:bg-black border border-neutral-800 cursor-pointer whitespace-nowrap"
            >
              창업홈페이지 바로가기 &rarr;
            </Link>

            {/* 점주메뉴: Always visible on both mobile and desktop */}
            <Link
              href="/portal"
              className="inline-flex px-2.5 py-1.5 sm:px-4 sm:py-2 bg-white text-neutral-800 hover:text-neutral-950 font-bold text-xs rounded-full transition-all border border-neutral-200 hover:border-neutral-400 cursor-pointer whitespace-nowrap"
            >
              점주메뉴
            </Link>

            {/* Mobile Menu Button (더보기) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 text-neutral-700 hover:text-amber-600 transition-colors"
              aria-label="더보기 메뉴 열기"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE NAVIGATION OVERLAY */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[57px] z-[9999] bg-white text-neutral-900 flex flex-col justify-between p-6 sm:p-8 md:hidden animate-fadeIn h-[calc(100vh-57px)] overflow-y-auto shadow-2xl border-t border-neutral-100">
          <nav className="flex flex-col space-y-1 font-bold text-lg text-neutral-900 text-left">
            <Link
              href="/brand/story"
              onClick={() => setMobileMenuOpen(false)}
              className="py-4 border-b border-neutral-100 hover:text-amber-600 transition-colors text-left flex items-center justify-between font-extrabold text-lg text-neutral-900"
            >
              <span>브랜드 소개</span>
              <ChevronRight size={18} className="text-neutral-400" />
            </Link>
            <Link
              href="/brand/menu"
              onClick={() => setMobileMenuOpen(false)}
              className="py-4 border-b border-neutral-100 hover:text-amber-600 transition-colors text-left flex items-center justify-between font-extrabold text-lg text-neutral-900"
            >
              <span>메뉴 소개</span>
              <ChevronRight size={18} className="text-neutral-400" />
            </Link>
            <Link
              href="/stores"
              onClick={() => setMobileMenuOpen(false)}
              className="py-4 border-b border-neutral-100 hover:text-amber-600 transition-colors text-left flex items-center justify-between font-extrabold text-lg text-neutral-900"
            >
              <span>매장 찾기</span>
              <ChevronRight size={18} className="text-neutral-400" />
            </Link>
            <Link
              href="/brand/franchise"
              onClick={() => setMobileMenuOpen(false)}
              className="py-4 border-b border-neutral-100 hover:text-amber-600 transition-colors text-left flex items-center justify-between font-extrabold text-lg text-neutral-900"
            >
              <span>창업 안내</span>
              <ChevronRight size={18} className="text-neutral-400" />
            </Link>
          </nav>

          <div className="pt-6 border-t border-neutral-100 flex flex-col gap-3">
            {/* 창업홈페이지 바로가기 inside mobile drawer */}
            <Link
              href="/franchise"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3.5 px-4 bg-neutral-950 text-[#fbc400] font-black text-center rounded-2xl text-sm flex items-center justify-between shadow-md hover:bg-black transition-colors"
            >
              <span>창업홈페이지 바로가기</span>
              <span>&rarr;</span>
            </Link>

            {onConsultClick && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onConsultClick();
                }}
                className="w-full py-3.5 bg-[#fbc400] hover:bg-[#e0a800] text-[#0D233A] font-extrabold text-center rounded-2xl text-sm transition-colors shadow-md block border-0 cursor-pointer"
              >
                창업 상담 문의하기
              </button>
            )}
          </div>
        </div>
      )}

      {/* MOBILE ALWAYS FIXED BOTTOM CONSULTATION BAR */}
      <MobileBottomInquiryBar onOpenConsultation={onConsultClick} />
    </>
  );
}
