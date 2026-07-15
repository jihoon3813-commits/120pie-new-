"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface HeaderProps {
  logoUrl?: string;
  onContactClick?: () => void;
}

export default function Header({
  logoUrl = "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784076160/120%ED%8C%8C%EC%9D%B4_%EC%BB%A4%ED%94%BC_%EA%B8%88%EC%A0%95%EC%A0%90_%EC%B1%84%EB%84%90%EC%82%AC%EC%9D%B8_%EB%94%94%EC%9E%90%EC%9D%B8_250828_ovgxnz.png",
  onContactClick,
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isSubpage
          ? "bg-[#FFFDF4] dark:bg-neutral-950 border-b border-neutral-200/50 dark:border-neutral-800/50 shadow-sm py-3"
          : isScrolled
            ? "bg-[#FFFDF4] dark:bg-neutral-950 border-b border-neutral-200/50 dark:border-neutral-800/50 shadow-sm py-3"
            : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <img
                src={logoUrl}
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
                className="text-sm font-semibold text-neutral-700 hover:text-amber-500 dark:text-neutral-300 dark:hover:text-amber-400 transition-colors duration-200"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/portal"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-neutral-600 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white transition-colors duration-200 px-3 py-1.5 border border-neutral-300 dark:border-neutral-700 rounded-md"
            >
              점주 전용
            </Link>
            <button
              onClick={onContactClick}
              className="text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 transition-all duration-200 px-4 py-2 rounded-md shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              창업 문의
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-neutral-700 dark:text-neutral-300 hover:text-amber-500 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">메뉴 열기</span>
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
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/95 dark:bg-neutral-950/95 backdrop-blur-lg border-b border-neutral-200 dark:border-neutral-800">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-md text-base font-medium text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-900 hover:text-amber-500"
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4 pb-2 border-t border-neutral-200 dark:border-neutral-800 flex flex-col space-y-2 px-3">
              <Link
                href="/portal"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-center py-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-700 rounded-md"
              >
                점주 전용
              </Link>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (onContactClick) onContactClick();
                }}
                className="w-full text-center py-2 text-sm font-semibold text-white bg-amber-500 rounded-md"
              >
                창업 문의
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
