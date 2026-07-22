"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ChevronRight, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MENU_DATA, MenuItem } from "@/app/constants/menu";
import { optimizeCloudinaryUrl } from "@/app/utils/cloudinary";
import CursorFollower from "@/components/CursorFollower";
import ConsultationForm from "@/components/ConsultationForm";
import QuickInquiryBar from "@/components/landing-v6/QuickInquiryBar";

const getBadgeClasses = (badge: string) => {
  if (badge === "ORIGINAL") {
    return "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30";
  }
  if (badge === "MEAT") {
    return "bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/30";
  }
  if (badge === "PIZZA") {
    return "bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/30";
  }
  if (badge === "NEW") {
    return "bg-[#FBC400] text-neutral-950 font-black";
  }
  return "bg-neutral-900 text-amber-400 dark:bg-neutral-800 dark:text-amber-300";
};

export default function BrandMenuPage() {
  const [activeTab, setActiveTab] = useState<string>("120겹파이");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [subFilter, setSubFilter] = useState<string>("all");
  const [isConsulting, setIsConsulting] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Tab change
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setSubFilter("all");
    setSearchQuery("");
  };

  // Sub filters mapping
  const subFilters: Record<string, { label: string; id: string }[]> = {
    "120겹파이": [
      { label: "전체 메뉴", id: "all" },
      { label: "ORIGINAL", id: "original" },
      { label: "MEAT", id: "meat" },
      { label: "PIZZA", id: "pizza" },
    ],
    "에그120": [
      { label: "전체 메뉴", id: "all" },
      { label: "짭짤 & 고소", id: "savory" },
      { label: "달콤 & 디저트", id: "sweet" },
    ],
    "기타": [
      { label: "전체 메뉴", id: "all" },
      { label: "찹쌀 츄러스", id: "churros" },
      { label: "매콤 떡볶이", id: "tteokbokki" },
      { label: "핫도그", id: "hotdog" },
    ],
    "coffee120": [
      { label: "전체 메뉴", id: "all" },
      { label: "커피 & 콜드브루", id: "coffee" },
      { label: "라떼 (Non-Coffee)", id: "latte" },
      { label: "스무디 & 쉐이크", id: "smoothie" },
      { label: "에이드 & 주스", id: "juice" },
    ],
    "스콘/머핀/쿠키": [
      { label: "전체 메뉴", id: "all" },
      { label: "수제 스콘", id: "scone" },
      { label: "촉촉 머핀", id: "muffin" },
      { label: "바삭 쿠키", id: "cookie" },
    ],
    "크로플/마카롱": [
      { label: "전체 메뉴", id: "all" },
      { label: "크로플", id: "croffle" },
      { label: "마카롱", id: "macaron" },
    ],
  };

  const currentCategory = MENU_DATA[activeTab];

  const getFilteredItems = (): MenuItem[] => {
    let items = currentCategory?.items || [];

    // Search filter
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.desc.toLowerCase().includes(query)
      );
    }

    // Sub-category filter
    if (subFilter !== "all") {
      if (activeTab === "120겹파이") {
        if (subFilter === "original") {
          items = items.filter((item) => item.badge === "ORIGINAL");
        } else if (subFilter === "meat") {
          items = items.filter((item) => item.badge === "MEAT");
        } else if (subFilter === "pizza") {
          items = items.filter((item) => item.badge === "PIZZA");
        }
      } else if (activeTab === "에그120") {
        if (subFilter === "savory") {
          items = items.filter((item) =>
            ["오리지널 계란빵", "베이컨 계란빵", "통모짜 계란빵", "로제미트 계란빵"].includes(item.name)
          );
        } else if (subFilter === "sweet") {
          items = items.filter((item) =>
            ["커스터드 계란빵", "콘버터 계란빵", "슈크림 계란빵", "팥 계란빵"].includes(item.name)
          );
        }
      } else if (activeTab === "기타") {
        if (subFilter === "churros") {
          items = items.filter((item) => item.name.includes("츄러스"));
        } else if (subFilter === "tteokbokki") {
          items = items.filter((item) => item.name.includes("떡볶이"));
        } else if (subFilter === "hotdog") {
          items = items.filter((item) => item.name.includes("핫도그"));
        }
      } else if (activeTab === "coffee120") {
        if (subFilter === "coffee") {
          items = items.filter((item) =>
            ["아메리카노", "카페 라떼", "바닐라 라떼", "콜드브루"].some((n) => item.name.includes(n))
          );
        } else if (subFilter === "latte") {
          items = items.filter(
            (item) => item.name.includes("라떼") && !["카페 라떼", "바닐라 라떼"].some((n) => item.name.includes(n))
          );
        } else if (subFilter === "smoothie") {
          items = items.filter((item) => item.name.includes("스무디") || item.name.includes("쉐이크"));
        } else if (subFilter === "juice") {
          items = items.filter((item) => item.name.includes("에이드") || item.name.includes("티") || item.name.includes("주스"));
        }
      } else if (activeTab === "스콘/머핀/쿠키") {
        if (subFilter === "scone") {
          items = items.filter((item) => item.name.includes("스콘"));
        } else if (subFilter === "muffin") {
          items = items.filter((item) => item.name.includes("머핀"));
        } else if (subFilter === "cookie") {
          items = items.filter((item) => item.name.includes("쿠키"));
        }
      } else if (activeTab === "크로플/마카롱") {
        if (subFilter === "croffle") {
          items = items.filter((item) => item.name.includes("크로플"));
        } else if (subFilter === "macaron") {
          items = items.filter((item) => item.name.includes("마카롱"));
        }
      }
    }
    return items;
  };

  const filteredItems = getFilteredItems();

  return (
    <div className="min-h-screen bg-[#FFFDF4] text-[#0D233A] transition-colors duration-300 font-sans antialiased selection:bg-[#FBC400] selection:text-neutral-950">
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
            <Link href="/brand/story" className="hover:text-amber-600 transition-colors">
              브랜드 소개
            </Link>
            <Link href="/brand/menu" className="text-amber-600 font-bold border-b-2 border-amber-500 pb-0.5">
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
            <Link href="/brand/story" className="py-2 border-b border-neutral-800 hover:text-[#fbc400] transition-colors text-left block">
              브랜드 소개
            </Link>
            <Link href="/brand/menu" className="py-2 border-b border-neutral-800 text-[#fbc400] font-bold text-left block">
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
              메뉴
            </h1>
            <p className="text-xs sm:text-sm font-semibold tracking-widest text-[#FBC400] uppercase">
              Taste &amp; Price Made it 120PIE
            </p>
            <div className="w-10 h-[3px] bg-[#78A739] mt-2 rounded-full" />
          </div>
          <p className="text-lg sm:text-2xl font-bold text-neutral-200 pt-1">
            주문과 동시에 직접 구워 더 솔직한 120파이 &amp; 커피
          </p>
        </div>
      </section>

      {/* SUB-PAGE SUB-MENU TABS BAR */}
      <div className="bg-white border-b border-neutral-200 shadow-sm py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
            <span className="px-6 py-2 sm:px-8 sm:py-2.5 rounded-full text-xs sm:text-sm font-black bg-[#78A739] text-white border border-[#78A739] shadow-sm">
              메뉴소개
            </span>
          </div>
        </div>
      </div>

      {/* STICKY TABS */}
      <section className="sticky top-[58px] z-30 bg-[#FFFDF4] border-b border-[#e6dfc3] py-4 transition-colors">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-2 overflow-x-auto pb-1 scrollbar-hide">
            {Object.keys(MENU_DATA).map((tabId) => (
              <button
                key={tabId}
                onClick={() => handleTabChange(tabId)}
                className={`px-5 py-2.5 rounded-full text-sm font-black whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  activeTab === tabId
                    ? "bg-[#FBC400] text-neutral-950 shadow-sm"
                    : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                {tabId}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* MAIN GRID & FILTERS */}
      <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4">
        {/* Search & Sub-filters */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10 pb-6 border-b border-[#e6dfc3]/50">
          {/* Sub Filters */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {subFilters[activeTab]?.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSubFilter(filter.id)}
                className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all duration-200 cursor-pointer ${
                  subFilter === filter.id
                    ? "bg-amber-500/15 border-amber-500 text-amber-700 font-extrabold"
                    : "bg-white border-neutral-200 text-neutral-500 hover:text-neutral-900"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="메뉴명 또는 키워드 검색"
              className="w-full bg-white border border-neutral-200 focus:border-[#FBC400] focus:outline-none rounded-2xl pl-10 pr-4 py-2.5 text-sm transition-all"
            />
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400" />
          </div>
        </div>

        {/* Menu Cards Grid */}
        <AnimatePresence mode="wait">
          {filteredItems.length > 0 ? (
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredItems.map((item, index) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  key={item.name}
                  className="bg-white rounded-[2rem] border border-[#e6dfc3]/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col group hover:shadow-lg hover:border-[#FBC400]/40 transition-all duration-300"
                >
                  <div
                    className={`aspect-[1.1] w-full overflow-hidden bg-white relative transition-all ${
                      item.name.includes("컵팥빙수") ? "p-6 sm:p-8" : "p-3 sm:p-5"
                    }`}
                  >
                    <img
                      src={optimizeCloudinaryUrl(item.img)}
                      alt={item.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 select-none pointer-events-none"
                    />
                    {item.badge && (
                      <span
                        className={`absolute top-4 left-4 px-2.5 py-1 text-[10px] font-black tracking-wide rounded-lg shadow-sm ${getBadgeClasses(
                          item.badge
                        )}`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <div className="p-6 text-left flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-black text-neutral-900 leading-tight mb-2">
                        {item.name}
                      </h3>
                      <p className="text-xs sm:text-sm font-medium text-neutral-500 leading-relaxed break-keep line-clamp-3">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24 text-neutral-400 font-bold"
            >
              검색 조건에 맞는 메뉴가 존재하지 않습니다.
            </motion.div>
          )}
        </AnimatePresence>
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
