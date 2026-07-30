"use client";

import { useState, useEffect } from "react";
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
  const [isScrolled, setIsScrolled] = useState(false);

  useModalBackHandler("brand-mobile-menu", mobileMenuOpen, () => setMobileMenuOpen(false));

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* BRAND GNB HEADER (FIXED TOP) */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-3 isolate ${
          isScrolled
            ? "bg-neutral-900/90 backdrop-blur-md border-b border-neutral-800/80 shadow-md"
            : "bg-white border-b border-neutral-200/80 shadow-xs"
        }`}
      >
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
          {/* Logo */}
          <Link href="/brand" title="브랜드 홈페이지 메인으로 이동" className="flex items-center gap-2 group shrink-0">
            <img
              src={optimizeCloudinaryUrl(
                isScrolled
                  ? "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784536582/Group_2_ma3j8j.png"
                  : "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784533894/Group_1_4_jl4rlr.png"
              )}
              alt="120pie 로고"
              className="h-[22px] md:h-[26px] w-auto object-contain transition-all duration-300 group-hover:scale-102"
            />
          </Link>

          {/* Navigation Links (Desktop) */}
          <nav className={`hidden md:flex items-center gap-8 lg:gap-10 font-medium text-[16px] transition-colors duration-300 ${
            isScrolled ? "text-neutral-200" : "text-neutral-700"
          }`}>
            <Link href="/brand/story" className={`transition-colors whitespace-nowrap ${isScrolled ? "hover:text-amber-400" : "hover:text-amber-600"}`}>
              브랜드 소개
            </Link>
            <Link href="/brand/menu" className={`transition-colors whitespace-nowrap ${isScrolled ? "hover:text-amber-400" : "hover:text-amber-600"}`}>
              메뉴 소개
            </Link>
            <Link href="/stores" className={`transition-colors whitespace-nowrap ${isScrolled ? "hover:text-amber-400" : "hover:text-amber-600"}`}>
              매장 찾기
            </Link>
            <Link href="/brand/franchise" className={`transition-colors whitespace-nowrap ${isScrolled ? "hover:text-amber-400" : "hover:text-amber-600"}`}>
              창업 안내
            </Link>
          </nav>

          {/* Right Header Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* 창업홈페이지 바로가기: Desktop only in header */}
            <Link
              href="/franchise"
              className={`hidden md:inline-flex px-3 py-1.5 sm:px-4 sm:py-2 font-black text-xs rounded-full transition-all duration-300 shadow-xs cursor-pointer whitespace-nowrap ${
                isScrolled
                  ? "bg-[#fbc400] text-neutral-950 hover:bg-amber-400"
                  : "bg-neutral-950 text-[#fbc400] hover:bg-black border border-neutral-800"
              }`}
            >
              창업홈페이지 바로가기 &rarr;
            </Link>

            {/* 점주메뉴: Always visible on both mobile and desktop */}
            <Link
              href="/portal"
              className={`inline-flex px-2.5 py-1.5 sm:px-4 sm:py-2 font-bold text-xs rounded-full transition-all border cursor-pointer whitespace-nowrap ${
                isScrolled
                  ? "bg-neutral-800/90 text-neutral-200 hover:text-white border-neutral-700 hover:border-neutral-500"
                  : "bg-white text-neutral-800 hover:text-neutral-950 border-neutral-200 hover:border-neutral-400"
              }`}
            >
              점주메뉴
            </Link>

            {/* Mobile Menu Button (더보기) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-1.5 transition-colors ${
                isScrolled ? "text-neutral-200 hover:text-amber-400" : "text-neutral-700 hover:text-amber-600"
              }`}
              aria-label="더보기 메뉴 열기"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Layout Spacer to preserve page flow for fixed header */}
      <div className="h-[53px] sm:h-[57px] w-full shrink-0" aria-hidden="true" />

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
