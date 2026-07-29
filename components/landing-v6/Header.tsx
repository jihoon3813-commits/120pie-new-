"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useModalBackHandler } from "@/components/MobileBackManager";

interface HeaderProps {
  logoUrl?: string;
  onContactClick?: () => void;
}

export default function Header({
  logoUrl = "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784533894/Group_1_4_jl4rlr.png",
  onContactClick,
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useModalBackHandler("franchise-mobile-menu", isMobileMenuOpen, () => setIsMobileMenuOpen(false));

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isSubpage = pathname !== "/" && pathname !== "/landing-v6";

  const menuItems = [
    { label: "120메뉴", href: "/landing-v6/menu" },
    { label: "가맹점 현황", href: "/landing-v6/stores" },
    { label: "창업 안내", href: "/landing-v6/franchise" },
    { label: "FAQ", href: "/landing-v6/faq" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-3 backdrop-blur-md ${
        isScrolled
          ? "bg-white/90"
          : "bg-neutral-900/95"
      }`}
    >
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <img
                src={
                  isScrolled
                    ? "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784533894/Group_1_4_jl4rlr.png"
                    : "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784536582/Group_2_ma3j8j.png"
                }
                alt="120pie & coffee Logo"
                className="h-[22px] md:h-[26px] w-auto object-contain brightness-100 dark:invert-0"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`text-sm font-semibold transition-colors duration-200 ${
                  isScrolled
                    ? "text-neutral-700 hover:text-amber-500"
                    : "text-neutral-200 hover:text-amber-400"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Action & Mobile Navigation Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* 브랜드홈페이지 바로가기: Desktop only in header */}
            <Link
              href="/brand"
              className="hidden md:inline-block px-3.5 py-1.5 sm:px-4 sm:py-2 bg-[#fbc400] text-neutral-950 font-black text-xs rounded-full transition-all duration-300 shadow-xs hover:bg-amber-400 cursor-pointer whitespace-nowrap"
            >
              브랜드홈페이지 바로가기 &rarr;
            </Link>

            {/* 점주메뉴: Always visible on both mobile and desktop */}
            <Link
              href="/portal"
              className={`inline-block text-xs font-bold transition-colors duration-200 px-2.5 py-1.5 sm:px-3 sm:py-1.5 border rounded-full whitespace-nowrap ${
                isScrolled
                  ? "text-neutral-700 hover:text-neutral-950 border-neutral-300"
                  : "text-neutral-200 hover:text-white border-neutral-700"
              }`}
            >
              점주메뉴
            </Link>

            {/* Mobile Menu Button (더보기) */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              type="button"
              className={`md:hidden inline-flex items-center justify-center p-1.5 rounded-md focus:outline-none transition-colors ${
                isScrolled
                  ? "text-neutral-700 hover:text-amber-500"
                  : "text-neutral-200 hover:text-amber-400"
              }`}
              aria-label="더보기 메뉴 열기"
            >
              {isMobileMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-neutral-900/95 dark:bg-neutral-950/95 backdrop-blur-lg border-b border-neutral-800 dark:border-neutral-800">
          <div className="px-3 pt-3 pb-4 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-md text-base font-medium text-neutral-200 dark:text-neutral-200 hover:bg-neutral-800 dark:hover:bg-neutral-900 hover:text-amber-400"
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-3 pb-1 border-t border-neutral-800 dark:border-neutral-800 flex flex-col space-y-2.5 px-1">
              <Link
                href="/brand"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-center py-2.5 px-4 bg-[#fbc400] text-neutral-950 font-black text-sm rounded-lg hover:bg-amber-400 transition-colors flex items-center justify-between shadow-sm cursor-pointer"
              >
                <span>브랜드홈페이지 바로가기</span>
                <span>&rarr;</span>
              </Link>
              <Link
                href="/portal"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-center py-2 text-sm font-semibold text-neutral-300 dark:text-neutral-300 border border-neutral-700 dark:border-neutral-700 rounded-md hover:bg-neutral-800 transition-colors"
              >
                점주메뉴 (점주 전용 포털)
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
