"use client";

import Link from "next/link";
import { ArrowLeft, Search, Filter, HelpCircle, ArrowRight, Menu, X, Sparkles, ShoppingBag, Utensils, Coffee } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FloatingAndInquiry from "@/app/components/FloatingAndInquiry";
import Footer from "@/app/components/Footer";
import { MENU_DATA, MenuItem, MenuCategory } from "@/app/constants/menu";
import { optimizeCloudinaryUrl } from "@/app/utils/cloudinary";

const logoUrlBlack = "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784076160/120%ED%8C%8C%EC%9D%B4_%EC%BB%A4%ED%94%BC_%EA%B8%88%EC%A0%95%EC%A0%90_%EC%B1%84%EB%84%90%EC%82%AC%EC%9D%B8_%EB%94%94%EC%9E%90%EC%9D%B8_250828_ovgxnz.png";
const logoUrlPink = "https://res.cloudinary.com/dx7l09wwu/image/upload/f_auto,q_auto/v1779846449/logo_120pie_coffee3_jzgtyi.png";

const getBadgeClasses = (badge: string, isPink: boolean) => {
  if (badge === "ORIGINAL") {
    return isPink 
      ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400" 
      : "bg-emerald-50 text-emerald-700 border border-emerald-250/65";
  }
  if (badge === "MEAT") {
    return isPink 
      ? "bg-rose-500/10 border border-rose-500/30 text-rose-400" 
      : "bg-rose-50 text-rose-700 border border-rose-250/65";
  }
  if (badge === "PIZZA") {
    return isPink 
      ? "bg-amber-500/10 border border-amber-500/30 text-amber-400" 
      : "bg-amber-50 text-amber-800 border border-amber-250/65";
  }
  if (badge === "NEW") {
    return isPink 
      ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400" 
      : "bg-emerald-600 text-white";
  }
  return isPink 
    ? "bg-rose-500 text-white" 
    : "bg-neutral-900 text-amber-400";
};

export default function MenuPageClient() {
  const [theme, setTheme] = useState<"pink" | "yellow">("yellow");
  const [activeTab, setActiveTab] = useState<string>("120겹파이");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [subFilter, setSubFilter] = useState<string>("all");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [inquiryForcedOpen, setInquiryForcedOpen] = useState(false);

  // Initialize theme and tab from URL params
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const params = new URLSearchParams(window.location.search);
        
        const urlTheme = params.get("theme");
        if (urlTheme === "pink") {
          setTheme("pink");
        } else {
          setTheme("yellow");
        }

        const urlTab = params.get("tab");
        if (urlTab === "pie") {
          setActiveTab("120겹파이");
        } else if (urlTab === "egg") {
          setActiveTab("에그120");
        } else if (urlTab === "side" || urlTab === "others" || urlTab === "etc") {
          setActiveTab("기타");
        } else if (urlTab === "coffee") {
          setActiveTab("coffee120");
        } else if (urlTab === "bakery" || urlTab === "scone") {
          setActiveTab("스콘/머핀/쿠키");
        } else if (urlTab === "croffle" || urlTab === "macaron") {
          setActiveTab("크로플/마카롱");
        }
      } catch (err) {
        console.error("Failed to initialize theme and tab parameters", err);
      }
    }
  }, []);

  const handleThemeChange = (newTheme: "pink" | "yellow") => {
    setTheme(newTheme);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("theme", newTheme);
      window.history.pushState(null, "", url.search);
    }
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setSubFilter("all"); // Reset filter when tab changes
    setSearchQuery("");  // Reset search when tab changes
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      let tabParam = "pie";
      if (tabId === "에그120") tabParam = "egg";
      else if (tabId === "기타") tabParam = "side";
      else if (tabId === "coffee120") tabParam = "coffee";
      else if (tabId === "스콘/머핀/쿠키") tabParam = "bakery";
      else if (tabId === "크로플/마카롱") tabParam = "croffle";
      url.searchParams.set("tab", tabParam);
      window.history.pushState(null, "", url.search);
    }
  };

  const isPink = theme === "pink";
  const isYellow = theme === "yellow";
  const logoUrl = isPink ? logoUrlBlack : "/logo_yellow_blue.png";
  const backUrl = isPink ? "/v3" : "/";

  // Theme Classes Map
  const pageBg = isPink ? "bg-[#0a0a0a] text-neutral-200" : "bg-[#fffdf4] text-[#0d233a]";
  const headerBg = isPink ? "bg-neutral-950/80 border-b border-neutral-900" : "bg-[#fffdf4]/80 border-b border-[#e6dfc3]";
  const mobileNavDrawerBg = isPink ? "bg-neutral-950 border-t border-neutral-900" : "bg-[#fffdf4] border-t border-[#e6dfc3]";
  const mobileNavLinkClass = isPink ? "bg-[#181114] border border-[#f2ccd7]/10 text-neutral-400 hover:text-white" : "bg-white border border-[#e6dfc3]/60 text-[#576575] hover:text-[#0d233a]";
  
  const tabWrapperClass = isPink ? "border-[#f2ccd7]/10 bg-neutral-900/50" : "border-[#e6dfc3] bg-[#0d233a]/5";
  const activeTabClass = isPink ? "bg-rose-500 text-white shadow-[0_4px_20px_rgba(244,63,94,0.3)]" : "bg-amber-400 text-neutral-950 font-black shadow-sm";
  const inactiveTabClass = isPink ? "text-neutral-450 hover:text-white" : "text-[#576575] hover:text-[#0d233a]";
  
  const cardClass = isPink ? "bg-[#140e11] border-[#f2ccd7]/10 hover:border-rose-500/40" : "bg-white border-[#e6dfc3] hover:border-amber-400 shadow-[0_4px_16px_rgba(13,35,58,0.03)]";
  const cardTitleClass = isPink ? "text-white" : "text-[#0d233a]";
  const cardDescClass = isPink ? "text-neutral-400" : "text-[#576575]";
  
  const inputClass = isPink ? "bg-[#140e11] border-neutral-800 focus:border-rose-500 text-white placeholder-neutral-600" : "bg-white border-[#e6dfc3] focus:border-amber-500 text-[#0d233a] placeholder-neutral-400";
  const tagClass = isPink ? "bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700" : "bg-white border-neutral-200 text-neutral-500 hover:text-neutral-900 hover:border-neutral-350";
  const activeTagClass = isPink ? "bg-rose-500/10 border-rose-500/60 text-rose-400 font-extrabold" : "bg-amber-400/10 border-amber-400 text-amber-800 font-extrabold";

  // Sub-filters lists
  const subFilters: Record<string, { label: string; id: string }[]> = {
    "120겹파이": [
      { label: "전체 메뉴", id: "all" },
      { label: "ORIGINAL", id: "original" },
      { label: "MEAT", id: "meat" },
      { label: "PIZZA", id: "pizza" }
    ],
    "에그120": [
      { label: "전체 메뉴", id: "all" },
      { label: "짭짤 & 고소", id: "savory" },
      { label: "달콤 & 디저트", id: "sweet" }
    ],
    "기타": [
      { label: "전체 메뉴", id: "all" },
      { label: "찹쌀 츄러스", id: "churros" },
      { label: "매콤 떡볶이", id: "tteokbokki" },
      { label: "핫도그", id: "hotdog" }
    ],
    "coffee120": [
      { label: "전체 메뉴", id: "all" },
      { label: "커피 & 콜드브루", id: "coffee" },
      { label: "라떼 (Non-Coffee)", id: "latte" },
      { label: "스무디 & 쉐이크", id: "smoothie" },
      { label: "에이드 & 주스", id: "juice" }
    ],
    "스콘/머핀/쿠키": [
      { label: "전체 메뉴", id: "all" },
      { label: "수제 스콘", id: "scone" },
      { label: "촉촉 머핀", id: "muffin" },
      { label: "바삭 쿠키", id: "cookie" }
    ],
    "크로플/마카롱": [
      { label: "전체 메뉴", id: "all" },
      { label: "크로플", id: "croffle" },
      { label: "마카롱", id: "macaron" }
    ]
  };

  // Filter items logic
  const currentCategory = MENU_DATA[activeTab];
  
  const getFilteredItems = (): MenuItem[] => {
    let items = currentCategory?.items || [];
    
    // Search filter
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      items = items.filter(item => 
        item.name.toLowerCase().includes(query) || 
        item.desc.toLowerCase().includes(query)
      );
    }
    
    // Sub-category filter
    if (subFilter !== "all") {
      if (activeTab === "120겹파이") {
        if (subFilter === "original") {
          items = items.filter(item => item.badge === "ORIGINAL");
        } else if (subFilter === "meat") {
          items = items.filter(item => item.badge === "MEAT");
        } else if (subFilter === "pizza") {
          items = items.filter(item => item.badge === "PIZZA");
        }
      } else if (activeTab === "에그120") {
        if (subFilter === "savory") {
          items = items.filter(item => ["오리지널 계란빵", "베이컨 계란빵", "통모짜 계란빵", "로제미트 계란빵"].includes(item.name));
        } else if (subFilter === "sweet") {
          items = items.filter(item => ["커스터드 계란빵", "콘버터 계란빵", "슈크림 계란빵", "팥 계란빵"].includes(item.name));
        }
      } else if (activeTab === "기타") {
        if (subFilter === "churros") {
          items = items.filter(item => item.name.includes("츄러스"));
        } else if (subFilter === "tteokbokki") {
          items = items.filter(item => item.name.includes("떡볶이"));
        } else if (subFilter === "hotdog") {
          items = items.filter(item => item.name.includes("핫도그"));
        }
      } else if (activeTab === "coffee120") {
        if (subFilter === "coffee") {
          items = items.filter(item => 
            ["아메리카노", "카페라떼", "카푸치노", "바닐라라떼", "카라멜마끼아또", "카페모카", "연유카페라떼", "콜드브루", "콜드브루라떼", "연유 콜드브루"].includes(item.name)
          );
        } else if (subFilter === "latte") {
          items = items.filter(item => 
            ["흑당라떼", "곡물라떼", "고구마라떼", "딸기라떼", "토피넛라떼", "녹차라떼", "달고나라떼", "피스타치오라떼", "미숫가루", "초당옥수수라떼"].includes(item.name)
          );
        } else if (subFilter === "smoothie") {
          items = items.filter(item => 
            item.name.includes("스무디") || item.name.includes("쉐이크") || item.name.includes("빙수")
          );
        } else if (subFilter === "juice") {
          items = items.filter(item => 
            item.name.includes("에이드") || item.name.includes("주스") || item.name === "복숭아 아이스티" || item.name === "제주한라봉"
          );
        }
      } else if (activeTab === "스콘/머핀/쿠키") {
        if (subFilter === "scone") {
          items = items.filter(item => item.name.includes("스콘"));
        } else if (subFilter === "muffin") {
          items = items.filter(item => item.name.includes("머핀"));
        } else if (subFilter === "cookie") {
          items = items.filter(item => item.name.includes("쿠키"));
        }
      } else if (activeTab === "크로플/마카롱") {
        if (subFilter === "croffle") {
          items = items.filter(item => item.name.includes("크로플"));
        } else if (subFilter === "macaron") {
          items = items.filter(item => item.name.includes("마카롱"));
        }
      }
    }
    
    return items;
  };

  const filteredItems = getFilteredItems();

  return (
    <div className={`min-h-screen font-sans antialiased transition-colors duration-300 ${pageBg}`}>
      {/* Sticky Header */}
      <header className={`sticky top-0 z-50 backdrop-blur-md transition-all duration-300 ${headerBg}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between min-h-[60px] sm:min-h-[80px] lg:min-h-[94px] gap-2.5 sm:gap-4">
          <div className="shrink-0 py-2">
            <Link className="flex items-center group shrink-0" href={backUrl} aria-label="120pie 홈으로 이동">
              <img
                src={logoUrl}
                alt="120pie & coffee"
                className="h-5 sm:h-7 lg:h-8 w-auto object-contain group-hover:scale-[1.02] transition-all duration-200"
              />
            </Link>
          </div>

          <nav className={`hidden lg:flex items-center justify-center gap-2.5 xl:gap-4 text-[10px] xl:text-[13px] font-bold shrink-0 ${isPink ? "text-neutral-450 hover:text-rose-450" : "text-[#576575] hover:text-[#0d233a]"}`}>
            <Link href={`/menu?theme=${theme}`} className={`hover:scale-105 transition-transform shrink-0 ${isPink ? "text-rose-500 font-extrabold" : "text-amber-500 font-extrabold"}`}>
              메뉴
            </Link>
            <Link href={`/stores?theme=${theme}`} className="hover:text-amber-400 transition-colors">가맹점 현황</Link>
            <Link href={`/costs?theme=${theme}`} className="hover:text-amber-400 transition-colors">비용 안내</Link>
            <Link href={`/franchise?theme=${theme}`} className="hover:text-amber-400 transition-colors">창업 안내</Link>
            <Link href={`/faq?theme=${theme}`} className="hover:text-amber-400 transition-colors">FAQ</Link>
          </nav>

          <div className="flex items-center gap-2.5">
            <div className={`flex items-center rounded-full border p-0.5 text-[10px] font-black ${isPink ? "border-[#f2ccd7]/20 bg-neutral-900/60" : "border-[#e6dfc3] bg-neutral-900/5"}`}>
              <button
                type="button"
                onClick={() => handleThemeChange("yellow")}
                className={`rounded-full px-2.5 py-1 transition-colors cursor-pointer border-0 ${
                  isYellow 
                    ? "landing-theme-active bg-amber-400 text-neutral-950 font-extrabold shadow-sm" 
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                옐로
              </button>
              <button
                type="button"
                onClick={() => handleThemeChange("pink")}
                className={`rounded-full px-2.5 py-1 transition-colors cursor-pointer border-0 ${
                  isPink 
                    ? "landing-theme-active bg-amber-400 text-neutral-950 font-extrabold shadow-sm" 
                    : "text-neutral-500 hover:text-[#0d233a]"
                }`}
              >
                블랙
              </button>
            </div>
            
            <Link className={`hidden sm:inline-flex items-center justify-center px-4 py-2.5 rounded-lg border text-xs font-bold ${isPink ? "border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-900/50" : "border-[#e6dfc3] text-[#576575] hover:text-[#0d233a] hover:bg-neutral-100"}`} href="/portal" target="_blank" rel="noopener noreferrer">
              점주전용
            </Link>
            
            <button 
              type="button" 
              onClick={() => setInquiryForcedOpen(true)} 
              className={`pink-primary-button hidden sm:inline-flex items-center justify-center px-5 py-2.5 rounded-lg text-xs sm:text-sm font-black hover:scale-[1.02] transition-all border-0 cursor-pointer ${
                isPink 
                  ? "bg-rose-500 hover:bg-rose-600 text-white shadow-[0_4px_16px_rgba(244,63,94,0.2)]" 
                  : "bg-amber-400 hover:bg-amber-300 text-neutral-950 shadow-[0_4px_16px_rgba(251,191,36,0.2)]"
              }`}
            >
              상담 신청 <ArrowRight size={14} className="ml-1.5 shrink-0" />
            </button>

            <button
              type="button"
              className={`pink-primary-button lg:hidden inline-flex items-center justify-center rounded-lg p-2.5 text-xs font-black border-0 cursor-pointer ${
                isPink ? "bg-rose-500 text-white hover:bg-rose-600" : "bg-amber-400 text-neutral-950 hover:bg-amber-300"
              }`}
              onClick={() => setMobileNavOpen(open => !open)}
            >
              {mobileNavOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {mobileNavOpen && (
          <nav id="mobile-landing-nav" className={`lg:hidden ${mobileNavDrawerBg} px-4 pb-5 pt-3.5 transition-all duration-300`}>
            <div className="grid grid-cols-2 gap-2 text-sm font-bold">
              <Link href={`/menu?theme=${theme}`} onClick={() => setMobileNavOpen(false)} className={`rounded-xl px-4 py-3 transition-colors text-center font-extrabold ${isPink ? "bg-rose-500 text-white" : "bg-amber-400 text-neutral-950"}`}>
                메뉴
              </Link>
              <Link href={`/stores?theme=${theme}`} onClick={() => setMobileNavOpen(false)} className={`rounded-xl px-4 py-3 transition-colors ${mobileNavLinkClass}`}>
                가맹점 현황
              </Link>
              <Link href={`/costs?theme=${theme}`} onClick={() => setMobileNavOpen(false)} className={`rounded-xl px-4 py-3 transition-colors ${mobileNavLinkClass}`}>
                비용 안내
              </Link>
              <Link href={`/franchise?theme=${theme}`} onClick={() => setMobileNavOpen(false)} className={`rounded-xl px-4 py-3 transition-colors ${mobileNavLinkClass}`}>
                창업 안내
              </Link>
              <Link href={`/faq?theme=${theme}`} onClick={() => setMobileNavOpen(false)} className={`col-span-2 rounded-xl px-4 py-3 transition-colors text-center ${mobileNavLinkClass}`}>
                FAQ
              </Link>
            </div>
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main className="pb-24">
        {/* Hero Banner Section */}
        <section className={`py-16 sm:py-24 border-b transition-colors duration-300 ${
          isPink ? "bg-gradient-to-b from-[#0f0a0c] via-[#0b0708] to-[#0a0a0a] border-neutral-900" : "bg-gradient-to-b from-[#fffdf2] via-[#fffaf0] to-[#fffdf4] border-[#e6dfc3]/40"
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-4 border ${
                isPink ? "bg-rose-500/10 border-rose-500/30 text-rose-400" : "bg-amber-400/10 border-amber-400/30 text-amber-700"
              }`}>
                <Sparkles size={12} /> MENU BRAND CATALOG
              </span>
              <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-6 leading-[1.15] ${
                isPink ? "text-white" : "text-[#0d233a]"
              }`}>
                커피와 어울리는<br className="sm:hidden" /> <span className={isPink ? "text-rose-400" : "text-[#ffd200] drop-shadow-sm"}>대표 디저트 라인업</span>
              </h1>
              <p className={`text-xs sm:text-base max-w-2xl mx-auto font-bold leading-relaxed ${
                isPink ? "text-neutral-400" : "text-[#576575]"
              }`}>
                120겹의 극강의 바삭함을 자랑하는 대표 파이부터 따뜻하고 친근한 계란빵, 사이드 메뉴까지.<br className="hidden sm:inline" /> 
                매장과 고객층에 꼭 맞는 감각적인 구성을 만나보세요.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Tab Selection Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
          <div className="flex flex-col items-center">
            {/* Category tabs */}
            <div className={`flex rounded-full border p-1 sm:p-1.5 w-full max-w-3xl justify-between relative ${tabWrapperClass}`}>
              {Object.keys(MENU_DATA).map((tabId) => {
                const isActive = activeTab === tabId;
                return (
                  <button
                    key={tabId}
                    type="button"
                    onClick={() => handleTabChange(tabId)}
                    className={`rounded-full py-2.5 sm:py-3.5 px-2 sm:px-4 flex-1 text-center text-[10px] sm:text-xs md:text-sm font-black transition-all relative border-0 cursor-pointer bg-transparent z-10 whitespace-nowrap ${
                      isActive ? activeTabClass : inactiveTabClass
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="activeTabBackground"
                        className={`absolute inset-0 rounded-full z-[-1] ${
                          isPink ? "bg-rose-500" : "bg-amber-400"
                        }`}
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="relative z-20 flex items-center justify-center gap-1 sm:gap-1.5">
                      {tabId === "120겹파이" && <ShoppingBag size={14} />}
                      {tabId === "에그120" && <Utensils size={14} />}
                      {tabId === "기타" && <Sparkles size={14} />}
                      {tabId === "coffee120" && <Coffee size={14} />}
                      {MENU_DATA[tabId].label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Filter and Search Bar */}
            <div className="w-full max-w-4xl mt-12 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
              {/* Sub filters */}
              <div className="flex flex-wrap gap-2 items-center">
                {subFilters[activeTab]?.map((filter) => {
                  const isActive = subFilter === filter.id;
                  return (
                    <button
                      key={filter.id}
                      type="button"
                      onClick={() => setSubFilter(filter.id)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        isActive ? activeTagClass : tagClass
                      }`}
                    >
                      {filter.label}
                    </button>
                  );
                })}
              </div>

              {/* Search input */}
              <div className="relative flex-1 md:max-w-xs min-h-[42px]">
                <Search size={16} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${
                  isPink ? "text-neutral-500" : "text-neutral-450"
                }`} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="메뉴 이름 또는 설명 검색..."
                  className={`w-full pl-10 pr-4 py-2.5 rounded-2xl border text-xs font-bold transition-all focus:outline-none focus:ring-1 ${
                    isPink 
                      ? `${inputClass} focus:ring-rose-500` 
                      : `${inputClass} focus:ring-amber-500`
                  }`}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 bg-transparent border-0 cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Selected Category Heading */}
            <div className="w-full max-w-4xl text-center md:text-left mt-14 mb-8">
              <span className={`text-[10px] sm:text-xs font-bold tracking-widest uppercase block mb-1.5 ${
                isPink ? "text-rose-500" : "text-amber-600"
              }`}>
                {activeTab} Selection
              </span>
              <h2 className={`text-2xl sm:text-3xl font-black mb-3 ${isPink ? "text-white" : "text-[#0d233a]"}`}>
                {currentCategory?.title}
              </h2>
              <p className={`text-xs sm:text-sm font-medium leading-relaxed max-w-2xl ${isPink ? "text-neutral-400" : "text-[#576575]"}`}>
                {currentCategory?.desc}
              </p>
            </div>

            {/* Grid Layout of Products */}
            <div className="w-full max-w-4xl">
              <AnimatePresence mode="wait">
                {filteredItems.length > 0 ? (
                  <motion.div
                    key={`${activeTab}-${subFilter}-${searchQuery}`}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8"
                  >
                    {filteredItems.map((item, idx) => (
                      <article
                        key={item.name}
                        className={`group rounded-2xl border overflow-hidden transition-all duration-300 flex flex-col ${cardClass}`}
                      >
                        <div className={`aspect-[4/3] w-full overflow-hidden relative bg-white transition-all ${
                          item.name.includes("컵팥빙수") ? "p-6 sm:p-8" : "p-3 sm:p-5"
                        }`}>
                          <img
                            src={optimizeCloudinaryUrl(item.img)}
                            alt={item.name}
                            className="w-full h-full transition-all duration-500 group-hover:scale-105 object-contain"
                          />
                          {item.badge && (
                            <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-black tracking-wide shadow-sm z-10 ${
                              getBadgeClasses(item.badge, isPink)
                            }`}>
                              {item.badge}
                            </span>
                          )}
                          {item.tag && (
                            <span className={`absolute top-3 right-3 px-1.5 py-0.5 rounded text-[9px] font-black tracking-wider uppercase shadow-sm z-10 !text-white ${
                              item.tag === "HIT" 
                                ? "bg-rose-600" 
                                : item.tag === "추천" 
                                  ? "bg-blue-600" 
                                  : "bg-emerald-600"
                            }`}>
                              {item.tag}
                            </span>
                          )}
                        </div>
                        
                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <div>
                            <h3 className={`text-base sm:text-lg font-black mb-1.5 flex items-center flex-wrap gap-1.5 ${cardTitleClass}`}>
                              <span>{item.name}</span>
                            </h3>
                            <p className={`text-xs font-semibold leading-relaxed ${cardDescClass}`}>
                              {item.desc}
                            </p>
                          </div>
                        </div>
                      </article>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`text-center py-16 px-4 rounded-3xl border border-dashed flex flex-col items-center justify-center ${
                      isPink ? "border-neutral-800 text-neutral-500" : "border-neutral-200 text-neutral-400"
                    }`}
                  >
                    <HelpCircle size={40} className="mb-4 text-neutral-450 animate-pulse" />
                    <h3 className="text-base font-black mb-1.5">검색 결과가 없습니다</h3>
                    <p className="text-xs font-semibold leading-relaxed">다른 검색어나 카테고리 탭을 선택해보세요.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Combo Section Banner */}
            <div className={`w-full max-w-4xl mt-24 rounded-3xl p-6 sm:p-10 border transition-all duration-300 relative overflow-hidden ${
              isPink 
                ? "bg-[#140e11] border-[#f2ccd7]/10" 
                : "bg-white border-[#e6dfc3] shadow-[0_4px_24px_rgba(0,0,0,0.02)]"
            }`}>
              <div className="absolute top-0 right-0 translate-x-1/4 -translate-y-1/4 w-40 h-40 rounded-full bg-amber-400/5 blur-3xl" />
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="text-center md:text-left">
                  <span className={`text-[10px] font-black tracking-widest uppercase mb-1.5 block ${
                    isPink ? "text-rose-500" : "text-amber-600"
                  }`}>
                    FRANCHISE PREFERENCE
                  </span>
                  <h3 className={`text-2xl font-black mb-3 ${isPink ? "text-white" : "text-[#0d233a]"}`}>
                    우리 매장 상권에 딱 맞는 메뉴 구성은?
                  </h3>
                  <p className={`text-xs sm:text-sm font-semibold leading-relaxed max-w-xl ${isPink ? "text-neutral-400" : "text-[#576575]"}`}>
                    주거단지, 오피스 상권, 학원가 등 입지에 맞춰 최상의 조합을 추천해 드립니다. 가맹비, 교육비, 세팅 과정까지 무료 상담으로 받아보세요.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setInquiryForcedOpen(true)}
                  className={`px-6 py-3.5 rounded-xl font-black text-xs sm:text-sm transition-all hover:scale-[1.02] active:scale-95 cursor-pointer border-0 ${
                    isPink 
                      ? "bg-rose-500 text-white shadow-[0_4px_16px_rgba(244,63,94,0.3)] hover:bg-rose-600" 
                      : "bg-amber-400 text-neutral-950 shadow-[0_4px_16px_rgba(251,191,36,0.3)] hover:bg-amber-300"
                  }`}
                >
                  상권 분석 및 맞춤상담 받기 <ArrowRight size={14} className="inline ml-1" />
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer theme={isPink ? "black" : "yellow"} />
      
      <FloatingAndInquiry
        forceOpenModal={inquiryForcedOpen}
        onModalClose={() => setInquiryForcedOpen(false)}
        isPink={isPink}
      />
    </div>
  );
}
