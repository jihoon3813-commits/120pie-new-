"use client";

import Link from "next/link";
import { ArrowLeft, ArrowUpRight, MapPin, Store, ExternalLink, Menu, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import FloatingAndInquiry from "@/app/components/FloatingAndInquiry";

const logoUrlBlack = "https://res.cloudinary.com/dfarfqx7e/image/upload/v1781183166/120%ED%8C%8C%EC%9D%B4_%EC%BB%A4%ED%94%BC_%EA%B8%88%EC%A0%95%EC%A0%90_%EC%B1%84%EB%84%90%EC%82%AC%EC%9D%B8_%EB%94%94%EC%9E%90%EC%9D%B8_250828_cnfrik.png";
const logoUrlPink = "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779846449/logo_120pie_coffee3_jzgtyi.png";

interface StoreInfo {
  id: string;
  name: string;
  owner: string;
  phone: string;
  status: "승인" | "대기" | "보류" | "중지" | "취소";
  roadAddress: string;
  detailAddress: string;
  regDate: string;
  adoptionMenu: string[];
}

const DEFAULT_STORES: StoreInfo[] = [
  {
    id: "owner",
    name: "강남역삼점",
    owner: "김지훈",
    phone: "010-3813-1200",
    status: "승인",
    roadAddress: "경기 군포시 엘에스로 143 (금정동, 1층 1001호)",
    detailAddress: "1층 1001호",
    regDate: "2026-05-01",
    adoptionMenu: ["120pie", "egg120", "츄러스120", "핫도그120", "120coffee"]
  },
  {
    id: "hongdae",
    name: "홍대입구점",
    owner: "이민우",
    phone: "010-4211-5678",
    status: "승인",
    roadAddress: "서울 마포구 양화로 160 (동교동)",
    detailAddress: "2층 201호",
    regDate: "2026-04-12",
    adoptionMenu: ["120pie", "egg120", "츄러스120"]
  },
  {
    id: "seomyeon",
    name: "부산서면점",
    owner: "박수진",
    phone: "010-5182-9012",
    status: "승인",
    roadAddress: "부산 부산진구 중앙대로 730 (부전동)",
    detailAddress: "1층",
    regDate: "2026-05-20",
    adoptionMenu: ["120pie", "120coffee"]
  }
];

const MENU_MAP: Record<string, { label: string; colorClass: string }> = {
  "120pie": { label: "120겹파이", colorClass: "bg-rose-500/10 text-rose-500 border border-rose-500/20" },
  "egg120": { label: "에그120", colorClass: "bg-amber-500/10 text-amber-600 border border-amber-500/20" },
  "츄러스120": { label: "츄러스120", colorClass: "bg-orange-500/10 text-orange-600 border border-orange-500/20" },
  "핫도그120": { label: "핫도그120", colorClass: "bg-red-500/10 text-red-600 border border-red-500/20" },
  "120coffee": { label: "120커피", colorClass: "bg-cyan-500/10 text-cyan-600 border border-cyan-500/20" }
};

const cleanStoreName = (name: string) => {
  return name
    .replace(/^120겹파이\s*/, "")
    .replace(/^120겹파이/, "")
    .replace(/^120pie\s*/, "")
    .replace(/^120pie/, "")
    .trim();
};

declare global {
  interface Window {
    kakao: any;
  }
}

function KakaoMap({ address, name }: { address: string; name: string; isPink?: boolean }) {
  const cleanAddr = address.split("(")[0].trim();
  return (
    <div className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden">
      <iframe
        src={`https://maps.google.com/maps?q=${encodeURIComponent(cleanAddr)}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
        className="w-full h-full border-0"
        allowFullScreen
        loading="lazy"
        title={`${name} 지도 위치`}
      />
    </div>
  );
}

export default function StoresPageClient() {
  const [stores, setStores] = useState<StoreInfo[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>("전체");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [selectedStoreId, setSelectedStoreId] = useState<string>("");
  const [theme, setTheme] = useState<"pink" | "yellow">("yellow");
  const [inquiryForcedOpen, setInquiryForcedOpen] = useState(false);

  // Load theme and stores dynamically from browser environment
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const params = new URLSearchParams(window.location.search);
        const urlTheme = params.get("theme");
        if (urlTheme === "pink") {
          setTheme("pink");
        } else {
          setTheme("yellow"); // Default to yellow
        }

        const stored = localStorage.getItem("120_stores");
        if (stored) {
          const parsed = JSON.parse(stored) as StoreInfo[];
          setStores(parsed);
        } else {
          localStorage.setItem("120_stores", JSON.stringify(DEFAULT_STORES));
          setStores(DEFAULT_STORES);
        }
      } catch (err) {
        console.error("Failed to initialize in useEffect", err);
        setStores(DEFAULT_STORES);
      }
    }
  }, []);

  // Update theme state and URL parameters smoothly on toggle click
  const handleThemeChange = (newTheme: "pink" | "yellow") => {
    setTheme(newTheme);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("theme", newTheme);
      window.history.pushState(null, "", url.search);
    }
  };

  // Dynamic Theme Token Classes Mapping
  const isPink = theme === "pink";
  const isYellow = theme === "yellow";
  const logoUrl = isPink ? logoUrlBlack : "/logo_yellow_blue.png";
  
  // Theme Background & Header Tokens
  const pageBg = isPink ? "bg-[#0a0a0a] text-neutral-200" : "bg-[#fffdf4] text-[#0d233a]";
  const headerBg = isPink ? "bg-neutral-950/80 border-b border-neutral-900" : "bg-[#fffdf4]/80 border-b border-[#e6dfc3]";
  
  // Theme Typography Tokens
  const textTitle = isPink ? "text-white" : "text-[#0d233a]";
  const textDesc = isPink ? "text-neutral-400" : "text-[#576575]";
  const labelAccent = isPink ? "text-amber-400 font-extrabold" : "text-[#0d233a] font-extrabold";
  
  // Theme Section and Container Tokens
  const sectionBg = isPink ? "bg-neutral-900 border border-neutral-850 shadow-md shadow-black/20" : "bg-white border border-[#e6dfc3] shadow-md shadow-[#0d233a]/[0.02]";
  const cardBg = isPink ? "bg-neutral-900 border border-neutral-850 shadow-md shadow-black/20" : "bg-white border border-[#e6dfc3] shadow-md shadow-[#0d233a]/[0.02]";
  const innerCardBg = isPink ? "bg-neutral-950 border border-neutral-850" : "bg-[#fff9e6] border border-[#ffd500]/20";
  const borderHighlight = isPink ? "border-neutral-850" : "border-[#ffd500]/20";
  
  // Theme Tab Control Tokens
  const tabsWrapperBg = isPink ? "bg-neutral-900 border border-neutral-850" : "bg-[#fff9e6] border border-[#ffd500]/15";
  const backBtnClass = isPink ? "bg-amber-400 text-neutral-950 hover:bg-amber-300 shadow-amber-400/10" : "bg-[#ffd500] text-[#0d233a] hover:bg-[#e6bd00] shadow-[#ffd500]/10";
  
  // Theme Table Row Tokens
  const rowSelectedBgClass = isPink ? "bg-neutral-950 hover:bg-neutral-950" : "bg-[#ffd500]/5 hover:bg-[#ffd500]/10";
  const rowBorder = isPink ? "border-neutral-850" : "border-[#e6dfc3]/80";
  const textStoreName = isPink ? "text-white" : "text-[#0d233a]";
  const textStoreAddr = isPink ? "text-neutral-400" : "text-[#576575]";
  const textStorePhone = isPink ? "text-neutral-450" : "text-[#0d233a]";
  const activeDotClass = isPink ? "bg-amber-400" : "bg-[#ffd500]";
  const backUrl = isPink ? "/v3" : "/";

  // Filter approved stores
  const approvedStores = stores.filter(s => s.status === "승인");

  // Determine regional categorization
  const getStoreRegion = (roadAddress: string): string => {
    if (roadAddress.includes("서울")) return "서울";
    if (roadAddress.includes("경기") || roadAddress.includes("인천")) return "경기/인천";
    if (roadAddress.includes("부산") || roadAddress.includes("경남") || roadAddress.includes("울산") || roadAddress.includes("경북")) return "부산/경남";
    return "기타 지역";
  };

  // Filter list by selected tab
  const filteredStores = approvedStores.filter(store => {
    if (selectedRegion === "전체") return true;
    return getStoreRegion(store.roadAddress) === selectedRegion;
  });

  // Default selection to first store of filtered list
  const activeStore = filteredStores.find(s => s.id === selectedStoreId) || filteredStores[0];

  useEffect(() => {
    if (activeStore && activeStore.id !== selectedStoreId) {
      setSelectedStoreId(activeStore.id);
    }
  }, [activeStore, selectedStoreId]);

  // Direct redirection links using pure road address ONLY
  const naverMapUrl = (address: string) => {
    const baseAddr = address.split("(")[0].trim();
    return `https://map.naver.com/v5/search/${encodeURIComponent(baseAddr)}`;
  };

  const kakaoMapUrl = (address: string) => {
    const baseAddr = address.split("(")[0].trim();
    return `https://map.kakao.com/?q=${encodeURIComponent(baseAddr)}`;
  };

  // Region stats counting helper
  const getRegionCount = (regionName: string) => {
    if (regionName === "전체") return approvedStores.length;
    return approvedStores.filter(s => getStoreRegion(s.roadAddress) === regionName).length;
  };

  const regions = ["전체", "서울", "경기/인천", "부산/경남", "기타 지역"];

  return (
    <div className={`min-h-screen font-sans antialiased transition-colors duration-300 ${pageBg}`}>
      {/* Dynamic Header */}
      <header className={`sticky top-0 z-50 backdrop-blur-md transition-all duration-300 ${headerBg}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between min-h-[60px] sm:min-h-[80px] lg:min-h-[94px] gap-2.5 sm:gap-4">
          <div className="shrink-0 py-2">
            <Link className="flex items-center group shrink-0" href={backUrl} aria-label="120pie 홈으로 이동">
              <img
                src={logoUrl}
                alt="120pie & coffee"
                className="h-5 sm:h-7 lg:h-8 w-auto object-contain group-hover:scale-102 transition-all duration-200"
              />
            </Link>
          </div>

          <nav className={`hidden lg:flex items-center justify-center gap-2.5 xl:gap-4 text-[10px] xl:text-[13px] font-bold shrink-0 ${isPink ? "text-neutral-400 hover:text-rose-400" : "text-[#576575] hover:text-[#0d233a]"}`}>
            <Link href={`${backUrl}#menu`} className="hover:text-amber-400 transition-colors">메뉴</Link>
            <Link href={`/stores?theme=${theme}`} className={`hover:scale-105 transition-transform shrink-0 ${
              isPink 
                ? "text-rose-500 hover:text-rose-600 font-extrabold" 
                : "text-[#ffd500] hover:text-[#e6bd00] font-extrabold"
            }`}>
              가맹점 현황
            </Link>
            <Link href={`/costs?theme=${theme}`} className="hover:text-amber-400 transition-colors">비용 안내</Link>
            <Link href={`/franchise?theme=${theme}`} className="hover:text-amber-400 transition-colors">창업 안내</Link>
            <Link href={`${backUrl}#faq`} className="hover:text-amber-400 transition-colors">FAQ</Link>
          </nav>

          <div className="flex items-center gap-2.5">
            <div className={`flex items-center rounded-full border p-0.5 text-[10px] font-black ${isPink ? "border-[#f2ccd7]/20 bg-neutral-900/60" : "border-[#e6dfc3] bg-neutral-900/5"}`}>
              <button
                type="button"
                onClick={() => handleThemeChange("yellow")}
                className={`rounded-full px-2.5 py-1 transition-colors cursor-pointer border-0 ${
                  isYellow 
                    ? "landing-theme-active bg-amber-400 text-neutral-950 font-extrabold shadow-sm" 
                    : isPink ? "text-neutral-400 hover:text-white" : "text-neutral-500 hover:text-[#0d233a]"
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
            <Link className={`hidden sm:inline-flex items-center justify-center px-4 py-2.5 rounded-lg border text-xs font-bold ${
              isYellow
                ? "border-[#e6dfc3] bg-white text-[#576575] hover:bg-[#fffcf0] hover:text-[#0d233a] transition-all"
                : "border-neutral-800 bg-neutral-900 text-neutral-350 hover:bg-neutral-800 hover:text-white transition-all"
            }`} href="/portal" target="_blank" rel="noopener noreferrer">
              점주전용
            </Link>
            <button
              type="button"
              className={`pink-primary-button lg:hidden inline-flex items-center justify-center rounded-lg p-2.5 text-xs font-black border-0 cursor-pointer ${
                isPink 
                  ? "bg-rose-500 text-white hover:bg-rose-600" 
                  : "bg-amber-400 text-neutral-950 hover:bg-amber-300"
              }`}
              aria-expanded={mobileNavOpen}
              aria-controls="mobile-landing-nav"
              onClick={() => setMobileNavOpen(open => !open)}
            >
              {mobileNavOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
        {mobileNavOpen && (
          <nav id="mobile-landing-nav" className={`lg:hidden border-t px-4 pb-5 pt-3.5 transition-all duration-300 ${isYellow ? "bg-[#fffdf2]/98 border-t border-[#e6dfc3]/60" : "bg-[#0f0a0c]/98 border-t border-[#f2ccd7]/15"}`}>
            <div className="grid grid-cols-2 gap-2 text-sm font-bold">
              <Link href={`${backUrl}#menu`} onClick={() => setMobileNavOpen(false)} className={`rounded-xl px-4 py-3 transition-colors ${isYellow ? "bg-white border border-[#e6dfc3]/60 text-[#576575]" : "bg-[#181114] border border-[#f2ccd7]/10 text-neutral-400"}`}>
                메뉴
              </Link>
              <Link href={`/stores?theme=${theme}`} onClick={() => setMobileNavOpen(false)} className={`rounded-xl px-4 py-3 transition-colors font-extrabold ${
                isPink 
                  ? "text-rose-500 bg-rose-500/10 border border-rose-500/20" 
                  : "text-[#ffd500] bg-[#ffd500]/10 border border-[#ffd500]/20"
              }`}>
                가맹점 현황
              </Link>
              <Link href={`/costs?theme=${theme}`} onClick={() => setMobileNavOpen(false)} className={`rounded-xl px-4 py-3 transition-colors ${isYellow ? "bg-white border border-[#e6dfc3]/60 text-[#576575]" : "bg-[#181114] border border-[#f2ccd7]/10 text-neutral-400"}`}>
                비용 안내
              </Link>
              <Link href={`/franchise?theme=${theme}`} onClick={() => setMobileNavOpen(false)} className={`rounded-xl px-4 py-3 transition-colors ${isYellow ? "bg-white border border-[#e6dfc3]/60 text-[#576575]" : "bg-[#181114] border border-[#f2ccd7]/10 text-neutral-400"}`}>
                창업 안내
              </Link>
              <Link href={`${backUrl}#faq`} onClick={() => setMobileNavOpen(false)} className={`col-span-2 rounded-xl px-4 py-3 transition-colors text-center ${isYellow ? "bg-white border border-[#e6dfc3]/60 text-[#576575]" : "bg-[#181114] border border-[#f2ccd7]/10 text-neutral-400"}`}>
                FAQ
              </Link>
            </div>
          </nav>
        )}
      </header>

      <main className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto">
          {/* Main Title Section */}
          <div className="max-w-2xl mb-12">
            <span className={`font-bold tracking-widest text-xs uppercase mb-3 block font-mono ${labelAccent}`}>FRANCHISE PARTNERS</span>
            <h1 className={`text-4xl sm:text-5xl font-black tracking-tight leading-tight mb-4 ${textTitle}`}>
              가까운 곳에서 만나는<br />120pie 매장 현황
            </h1>
            <p className={`text-sm sm:text-base font-medium leading-relaxed ${textDesc}`}>
              본사 어드민에서 관리하는 정식 가맹점 리스트입니다. 지역별 지점을 표로 확인하고 상세 위치를 실시간 지도로 조회할 수 있습니다.
            </p>
          </div>

          {/* Regional Selection Tabs */}
          <div className={`flex flex-wrap items-center gap-2 mb-8 p-1.5 rounded-2xl max-w-max transition-colors duration-300 ${tabsWrapperBg}`}>
            {regions.map(region => {
              const isActive = selectedRegion === region;
              const count = getRegionCount(region);
              return (
                <button
                  key={region}
                  type="button"
                  onClick={() => setSelectedRegion(region)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? isPink
                        ? "bg-rose-500 text-white shadow-lg shadow-rose-500/10"
                        : "bg-amber-400 text-neutral-950 shadow-lg shadow-amber-400/10"
                      : isPink
                        ? "text-neutral-600 hover:text-neutral-950 hover:bg-neutral-300/40"
                        : "text-neutral-400 hover:text-white hover:bg-neutral-800/60"
                  }`}
                >
                  {region} <span className={`text-[10px] ml-1 ${isActive ? isPink ? "text-white/85 font-black" : "text-neutral-950/85 font-black" : "text-neutral-500"}`}>{count}</span>
                </button>
              );
            })}
          </div>

          {/* Grid Layout: Left Table (표) & Right Map (지도) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
            
            {/* Left: Store List Table */}
            <section className={`w-full min-w-0 lg:col-span-7 rounded-3xl overflow-hidden transition-all duration-300 ${sectionBg}`} aria-label="가맹점 리스트">
              {filteredStores.length === 0 ? (
                <div className="py-20 flex flex-col items-center justify-center text-center px-6">
                  <Store size={48} className="text-neutral-400 mb-4 animate-pulse" />
                  <p className="text-sm font-bold text-neutral-500">해당 지역에 등록된 가맹점이 없습니다.</p>
                  <p className="text-xs text-neutral-400 mt-1">본사 어드민 가맹점관리에서 상태값을 &apos;승인&apos;으로 변경해주세요.</p>
                </div>
              ) : (
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left border-collapse min-w-[550px] table-fixed">
                    <thead>
                      <tr className={`border-b text-xs font-bold font-mono ${isPink ? "border-neutral-200 text-neutral-500" : "border-neutral-900 text-neutral-400"}`}>
                        <th className="px-6 py-4.5 w-[25%]">지점명</th>
                        <th className="px-6 py-4.5 w-[42%]">주소</th>
                        <th className="px-6 py-4.5 w-[18%]">연락처</th>
                        <th className="px-6 py-4.5 w-[15%]">도입 메뉴</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y text-sm ${isPink ? "divide-neutral-100" : "divide-neutral-900/80"}`}>
                      {filteredStores.map(store => {
                        const isSelected = activeStore && activeStore.id === store.id;
                        return (
                          <tr
                            key={store.id}
                            onClick={() => setSelectedStoreId(store.id)}
                            className={`group cursor-pointer transition-all ${
                              isSelected ? rowSelectedBgClass : isPink ? "hover:bg-neutral-50/50" : "hover:bg-neutral-900/50"
                            }`}
                          >
                            <td className="px-6 py-5 align-middle">
                              <div className="flex flex-col gap-1">
                                <span className={`text-[9px] font-black tracking-widest uppercase font-mono ${
                                  isPink ? "text-rose-500/80" : "text-amber-500/80"
                                }`}>
                                  120pie & coffee
                                </span>
                                <div className="flex items-center gap-1.5">
                                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 transition-all ${isSelected ? activeDotClass : "bg-neutral-450 group-hover:bg-neutral-500"}`} />
                                  <span className={`font-black text-xs sm:text-sm break-all leading-snug transition-colors ${isSelected ? isPink ? "text-rose-500" : "text-[#0d233a]" : textStoreName}`}>
                                    {cleanStoreName(store.name)}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-5 text-xs align-middle leading-relaxed whitespace-normal break-all">
                              <span className={`block font-semibold ${isPink ? "text-neutral-700" : "text-neutral-300"}`}>{store.roadAddress}</span>
                              {store.detailAddress && (
                                <span className="block text-[10px] text-neutral-400 mt-0.5">{store.detailAddress}</span>
                              )}
                            </td>
                            <td className={`px-6 py-5 text-xs font-mono font-bold align-middle whitespace-nowrap ${textStorePhone}`}>
                              {store.phone}
                            </td>
                            <td className="px-6 py-5 align-middle">
                              <div className="flex flex-wrap gap-1">
                                {store.adoptionMenu && store.adoptionMenu.slice(0, 2).map(menu => {
                                  const config = MENU_MAP[menu] || { label: menu, colorClass: isPink ? "bg-neutral-100 text-neutral-600 border border-neutral-200" : "bg-neutral-800 text-neutral-400 border border-neutral-700/60" };
                                  return (
                                    <span key={menu} className={`px-2 py-0.5 rounded text-[10px] font-black ${config.colorClass}`}>
                                      {config.label}
                                    </span>
                                  );
                                })}
                                {store.adoptionMenu && store.adoptionMenu.length > 2 && (
                                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border ${isPink ? "bg-neutral-105 text-neutral-400 border-neutral-200" : "bg-neutral-800 text-neutral-500 border-neutral-700/40"}`}>
                                    +{store.adoptionMenu.length - 2}
                                  </span>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            {/* Right: Map Detail Panel */}
            <aside className="w-full min-w-0 lg:col-span-5 lg:sticky lg:top-28">
              {activeStore ? (
                <div className={`rounded-3xl p-6 sm:p-8 transition-all duration-300 ${cardBg}`}>
                  {/* Selected Store Information */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg border transition-all ${
                      isPink 
                        ? "bg-rose-50 border-rose-100 text-rose-500" 
                        : "bg-neutral-900 border-neutral-800 text-amber-400"
                    }`}>
                      <Store size={18} />
                    </div>
                    <div>
                      <span className={`text-[10px] tracking-widest font-black uppercase font-mono ${labelAccent}`}>SELECTED BRANCH</span>
                      <h2 className={`text-lg font-black ${textTitle}`}>{activeStore.name}</h2>
                    </div>
                  </div>

                  {/* Dynamic Colorful Interactive Map */}
                  <div className={`relative rounded-2xl overflow-hidden aspect-[4/3] mb-6 shadow-md border ${
                    isPink ? "border-neutral-200 bg-neutral-100" : "border-neutral-800 bg-neutral-950"
                  }`}>
                    <KakaoMap
                      address={activeStore.roadAddress}
                      name={cleanStoreName(activeStore.name)}
                      isPink={isPink}
                    />
                  </div>

                  {/* Details Card */}
                  <div className={`rounded-2xl p-5 space-y-4 mb-6 transition-colors duration-300 ${innerCardBg}`}>
                    <div className="flex items-start gap-3">
                      <MapPin size={16} className={`shrink-0 mt-0.5 ${labelAccent}`} />
                      <div>
                        <span className={`block text-[10px] font-bold uppercase font-mono ${isPink ? "text-neutral-400" : "text-neutral-500"}`}>address</span>
                        <p className={`text-xs font-semibold leading-relaxed mt-1 ${isPink ? "text-neutral-800" : "text-neutral-200"}`}>
                          {activeStore.roadAddress} {activeStore.detailAddress}
                        </p>
                      </div>
                    </div>
                    <div className={`border-t pt-3 flex items-start gap-3 ${isPink ? "border-neutral-200/70" : "border-neutral-800/60"}`}>
                      <Store size={16} className={`shrink-0 mt-0.5 ${labelAccent}`} />
                      <div>
                        <span className={`block text-[10px] font-bold uppercase font-mono ${isPink ? "text-neutral-400" : "text-neutral-500"}`}>all introduced menus</span>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {activeStore.adoptionMenu && activeStore.adoptionMenu.map(menu => {
                            const config = MENU_MAP[menu] || { label: menu, colorClass: isPink ? "bg-neutral-100 text-neutral-600" : "bg-neutral-800 text-neutral-400" };
                            return (
                              <span key={menu} className={`px-2 py-0.5 rounded text-[10px] font-bold ${config.colorClass}`}>
                                {config.label}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Redirection Links using pure Road Address only */}
                  <div className="grid grid-cols-2 gap-3">
                    <a
                      href={naverMapUrl(activeStore.roadAddress)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 rounded-xl bg-[#03C75A] text-white px-4 py-3.5 text-xs font-black hover:bg-[#02b350] transition-colors shadow-lg shadow-[#03C75A]/10 cursor-pointer"
                    >
                      네이버 지도 <ExternalLink size={13} />
                    </a>
                    <a
                      href={kakaoMapUrl(activeStore.roadAddress)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 rounded-xl bg-[#FEE500] text-[#191919] px-4 py-3.5 text-xs font-black hover:bg-[#ebd300] transition-colors shadow-lg shadow-[#FEE500]/10 cursor-pointer"
                    >
                      카카오맵 <ExternalLink size={13} />
                    </a>
                  </div>
                  
                  <p className="mt-4 text-center text-[10px] font-medium text-neutral-500 leading-normal">
                    선택한 가맹점의 공식 도로명 주소 기준으로 위치 조회를 시작합니다.<br />
                    (주소 매칭의 무결성을 위해 가맹점명은 검색어에 가미하지 않습니다.)
                  </p>
                </div>
              ) : (
                <div className={`rounded-3xl border border-dashed p-12 text-center flex flex-col items-center justify-center ${
                  isPink ? "border-neutral-300" : "border-neutral-800"
                }`}>
                  <MapPin size={36} className="text-neutral-450 mb-3 animate-bounce" />
                  <p className="text-sm font-bold text-neutral-500">지도를 조회할 가맹점을 선택해주세요.</p>
                </div>
              )}
            </aside>
          </div>
          <FloatingAndInquiry
            forceOpenModal={inquiryForcedOpen}
            onModalClose={() => setInquiryForcedOpen(false)}
            isPink={isPink}
          />
        </div>
      </main>
    </div>
  );
}
