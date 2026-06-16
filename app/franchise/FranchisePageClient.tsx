"use client";

import Link from "next/link";
import { 
  ArrowLeft, 
  ArrowRight, 
  Download, 
  CheckCircle2, 
  TrendingUp, 
  Clock, 
  Sun, 
  Coffee, 
  Moon, 
  Leaf, 
  ChefHat, 
  Store, 
  MapPin, 
  Sparkles, 
  Menu, 
  X, 
  Info,
  Check,
  Building2,
  FileText,
  Calculator,
  Search,
  Hash,
  Award,
  ShoppingBag,
  Truck,
  Layers,
  Users,
  Warehouse,
  Sliders,
  Percent
} from "lucide-react";
import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import FloatingAndInquiry from "@/app/components/FloatingAndInquiry";
import Footer from "@/app/components/Footer";
import { api } from "@/convex/_generated/api";

const logoUrlBlack = "https://res.cloudinary.com/dfarfqx7e/image/upload/v1781183166/120%ED%8C%8C%EC%9D%B4_%EC%BB%A4%ED%94%BC_%EA%B8%88%EC%A0%95%EC%A0%90_%EC%B1%84%EB%84%90%EC%82%AC%EC%9D%B8_%EB%94%94%EC%9E%90%EC%9D%B8_250828_cnfrik.png";

// Interface for Success Cases
interface SuccessCase {
  title: string;
  badge: string;
  stats: string;
  desc: string;
  points: string[];
}

const SUCCESS_CASES: SuccessCase[] = [
  {
    title: "기존 카페 샵인샵 도입 (A 매장)",
    badge: "샵인샵 성공 모델",
    stats: "일평균 매출 45만 원 상승",
    desc: "기존에 저단가 음료 위주로 운영되던 대학가 개인 카페였으나, 120겹 파이 도입 후 세트 주문이 폭발적으로 늘어나 객단가와 마진을 동시에 잡았습니다.",
    points: [
      "기존 커피 기기 및 동선 100% 그대로 활용",
      "음료와 디저트 동반 주문율 68% 기록",
      "도입 2주 만에 배달앱 디저트 카테고리 랭킹 진입"
    ]
  },
  {
    title: "1인 소자본 업종변경 창업 (B 매장)",
    badge: "소자본 신규 창업",
    stats: "6개월 만에 창업 비용 회수",
    desc: "기존 프랜차이즈 치킨집을 운영하다 과도한 노동 강도와 로열티로 고민하던 중, 1인 운영이 가능한 120pie 콤팩트 카페 모델로 전환해 고수익을 달성했습니다.",
    points: [
      "인건비 제로, 점주 1인 운영 최적화 시스템",
      "복잡한 재료 손질 없는 본사 콜드체인 생지 공급",
      "피크타임 3분 조리로 테이블 회전율 3배 증가"
    ]
  },
  {
    title: "배달 & 포장 특화 매장 (C 매장)",
    badge: "배달/포장 특화 모델",
    stats: "세트 주문 단가 2.2만 원 달성",
    desc: "소형 주거 밀집 상권에 입점하여 배달과 테이크아웃 위주로 가동하는 실속형 매장입니다. 단체 간식 주문과 패밀리 팩 포장 고객 비중이 매우 높습니다.",
    points: [
      "학원가, 어린이집 단체 간식 주문 월평균 15회 접수",
      "패키징 디자인 차별화로 선물용 테이크아웃 수요 견인",
      "배달의민족 맛집 랭킹 상위권 유지로 상시 매출 확보"
    ]
  }
];

export default function FranchisePageClient() {
  const [theme, setTheme] = useState<"pink" | "yellow">("yellow");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [selectedPlanTab, setSelectedPlanTab] = useState<"8py" | "10py">("8py");
  const [activeMenuTab, setActiveMenuTab] = useState<"pie" | "egg" | "churros" | "side" | "drink">("pie");
  
  // Inquiry Form States
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    storeType: "샵인샵 도입",
    existingStoreName: "",
    message: ""
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addInquiry = useMutation(api.inquiries.add);

  // Load theme dynamically from browser environment
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
      } catch (err) {
        console.error("Failed to initialize theme in useEffect", err);
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

  // Helper function to format phone number
  const formatPhoneNumber = (value: string) => {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, "");
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 8) {
      return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
    }
    return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 7)}-${phoneNumber.slice(7, 11)}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "phone" ? formatPhoneNumber(value) : value
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert("성함과 연락처를 입력해 주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      await addInquiry({
        name: formData.name,
        phone: formData.phone,
        storeType: formData.storeType,
        existingStoreName: formData.existingStoreName || "",
        message: formData.message || "창업 안내 페이지를 통한 상담 신청",
        regDate: new Date().toISOString().split("T")[0]
      });
      setFormSubmitted(true);
    } catch (err) {
      console.error("Failed to submit inquiry to Convex", err);
      // Fallback local storage
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("120_inquiries");
        const list = stored ? JSON.parse(stored) : [];
        const newInq = {
          id: "inq-" + Date.now(),
          ...formData,
          regDate: new Date().toISOString().split("T")[0]
        };
        localStorage.setItem("120_inquiries", JSON.stringify([...list, newInq]));
      }
      setFormSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Browser Print trigger for PDF save
  const handlePrintPage = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  // Dynamic Theme Tokens
  const isPink = theme === "pink";
  const isYellow = theme === "yellow";
  const logoUrl = isPink ? logoUrlBlack : "/logo_yellow_blue.png";
  const backUrl = isPink ? "/v3" : "/";

  // Theme Background & Header Tokens
  const pageBg = isPink ? "bg-[#0a0a0a] text-neutral-200" : "bg-[#fffdf4] text-[#0d233a]";
  const headerBg = isPink ? "bg-neutral-950/90 border-b border-neutral-900" : "bg-[#fffdf4]/90 border-b border-[#e6dfc3]";
  
  // Theme Typography Tokens
  const textTitle = isPink ? "text-white" : "text-[#0d233a]";
  const textDesc = isPink ? "text-neutral-400" : "text-[#576575]";
  const labelAccent = isPink ? "text-[#ffd500]" : "text-[#0d233a]";

  // Theme Card Tokens
  const cardBg = isPink 
    ? "bg-neutral-900/60 border border-neutral-800 shadow-md shadow-black/20" 
    : "bg-white border border-[#e6dfc3] shadow-md shadow-[#0d233a]/[0.02]";
  const innerCardBg = isPink 
    ? "bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 shadow-md shadow-black/20" 
    : "bg-gradient-to-br from-white via-[#fffdf5] to-[#fffcf0] border border-amber-200/60 shadow-[0_4px_16px_rgba(251,191,36,0.03)]";

  const innerCardBgAccent = isPink 
    ? "bg-gradient-to-br from-neutral-900 to-neutral-950 border border-t-4 border-neutral-800 border-t-rose-500 shadow-md shadow-black/20" 
    : "bg-gradient-to-br from-white via-[#fffdf5] to-[#fffcf0] border border-t-4 border-amber-200/60 border-t-amber-400 shadow-[0_4px_16px_rgba(251,191,36,0.03)]";

  const innerCardHover = isPink
    ? "hover:from-neutral-850 hover:to-neutral-900 hover:border-rose-500/30 hover:shadow-[0_8px_30px_rgba(244,63,94,0.06)] hover:scale-[1.03] transition-all duration-300"
    : "hover:from-white hover:to-[#fff9e6] hover:border-amber-400 hover:shadow-[0_8px_30px_rgba(251,191,36,0.12)] hover:scale-[1.03] transition-all duration-300";

  const inputBgClass = isPink 
    ? "bg-neutral-950/60 border-neutral-850 text-white focus:border-rose-500" 
    : "bg-white border-[#e6dfc3] text-[#0d233a] focus:border-amber-400";
  
  const textHighlight = isPink ? "text-[#ffd500]" : "text-amber-500";
  
  // Top Menu Navigation Class Helpers
  const navLinkTextClass = isPink
    ? "text-neutral-450 hover:text-rose-450"
    : "text-[#576575] hover:text-[#0d233a]";

  const switcherWrapperClass = isPink
    ? "border-[#f2ccd7]/20 bg-neutral-900/60"
    : "border-[#e6dfc3] bg-neutral-900/5";

  const switcherBtnYellowClass = isYellow
    ? "landing-theme-active bg-amber-400 text-neutral-950 font-extrabold shadow-sm"
    : "text-neutral-400 hover:text-white";

  const switcherBtnBlackClass = isPink
    ? "landing-theme-active bg-amber-400 text-neutral-950 font-extrabold shadow-sm"
    : "text-neutral-500 hover:text-[#0d233a]";

  const portalBtnClass = isYellow
    ? "border-[#e6dfc3] bg-white text-[#576575] hover:bg-[#fffcf0] hover:text-[#0d233a] transition-all"
    : "border-neutral-800 bg-neutral-900 text-neutral-350 hover:bg-neutral-800 hover:text-white transition-all";

  const mobileNavDrawerBgClass = isYellow
    ? "bg-[#fffdf2]/98 border-t border-[#e6dfc3]/60"
    : "bg-[#0f0a0c]/98 border-t border-[#f2ccd7]/15";

  const mobileNavLinkClass = isYellow
    ? "bg-white border border-[#e6dfc3]/60 text-[#576575] hover:text-[#0d233a] hover:bg-[#fffdf4]"
    : "bg-[#181114] border border-[#f2ccd7]/10 text-neutral-400 hover:text-rose-400";

  return (
    <div id={isPink ? "landing-v3" : "landing-v5"} className={`min-h-screen font-sans antialiased transition-colors duration-300 ${pageBg}`}>
      {/* Header */}
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

          <nav className={`hidden lg:flex items-center gap-2.5 xl:gap-4 text-[10px] xl:text-[13px] font-bold shrink-0 ${navLinkTextClass}`}>
            <Link href={`${backUrl}#menu`} className="hover:text-amber-400 transition-colors">메뉴</Link>
            <Link href={`/stores?theme=${theme}`} className="hover:text-amber-400 transition-colors">가맹점 현황</Link>
            <Link href={`/costs?theme=${theme}`} className="hover:text-amber-400 transition-colors">비용 안내</Link>
            <Link href={`/franchise?theme=${theme}`} className={`hover:scale-105 transition-transform shrink-0 ${
              isPink 
                ? "text-rose-500 hover:text-rose-600 font-extrabold" 
                : "text-[#ffd500] hover:text-[#e6bd00] font-extrabold"
            }`}>
              창업 안내
            </Link>
            <Link href={`${backUrl}#faq`} className="hover:text-amber-400 transition-colors">FAQ</Link>
          </nav>

          <div className="flex items-center gap-2.5">
            <div className={`flex items-center rounded-full border p-0.5 text-[10px] font-black ${switcherWrapperClass}`}>
              <a
                onClick={() => handleThemeChange("yellow")}
                className={`rounded-full px-2.5 py-1 transition-colors cursor-pointer select-none focus:outline-none focus:ring-0 outline-none ${switcherBtnYellowClass}`}
              >
                옐로
              </a>
              <a
                onClick={() => handleThemeChange("pink")}
                className={`rounded-full px-2.5 py-1 transition-colors cursor-pointer select-none focus:outline-none focus:ring-0 outline-none ${switcherBtnBlackClass}`}
              >
                블랙
              </a>
            </div>
            <Link className={`hidden sm:inline-flex items-center justify-center px-4 py-2.5 rounded-lg border text-xs font-bold focus:outline-none focus:ring-0 outline-none ${portalBtnClass}`} href="/portal" target="_blank" rel="noopener noreferrer">
              점주전용
            </Link>
            <a href="#inquiry-form-section" className={`pink-primary-button hidden sm:inline-flex items-center justify-center px-5 py-2.5 rounded-lg text-xs sm:text-sm font-black hover:scale-[1.02] transition-all border-0 cursor-pointer ${
              isPink 
                ? "bg-rose-500 hover:bg-rose-600 text-white shadow-[0_4px_16px_rgba(244,63,94,0.2)]" 
                : "bg-amber-400 hover:bg-amber-300 text-neutral-950 shadow-[0_4px_16px_rgba(251,191,36,0.2)]"
            }`}>
              상담 신청 <ArrowRight size={14} className="ml-1.5 shrink-0" />
            </a>
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
          <nav id="mobile-landing-nav" className={`lg:hidden border-t px-4 pb-5 pt-3.5 transition-all duration-300 ${mobileNavDrawerBgClass}`}>
            <div className="grid grid-cols-2 gap-2 text-sm font-bold">
              <Link href={`${backUrl}#menu`} onClick={() => setMobileNavOpen(false)} className={`rounded-xl px-4 py-3 transition-colors ${mobileNavLinkClass}`}>
                메뉴
              </Link>
              <Link href={`/stores?theme=${theme}`} onClick={() => setMobileNavOpen(false)} className={`rounded-xl px-4 py-3 transition-colors ${mobileNavLinkClass}`}>
                가맹점 현황
              </Link>
              <Link href={`/costs?theme=${theme}`} onClick={() => setMobileNavOpen(false)} className={`rounded-xl px-4 py-3 transition-colors ${mobileNavLinkClass}`}>
                비용 안내
              </Link>
              <Link href={`/franchise?theme=${theme}`} onClick={() => setMobileNavOpen(false)} className={`rounded-xl px-4 py-3 transition-colors font-extrabold ${
                isPink 
                  ? "text-rose-500 bg-rose-500/10 border border-rose-500/20" 
                  : "text-[#ffd500] bg-[#ffd500]/10 border border-[#ffd500]/20"
              }`}>
                창업 안내
              </Link>
              <Link href={`${backUrl}#faq`} onClick={() => setMobileNavOpen(false)} className={`col-span-2 rounded-xl px-4 py-3 transition-colors text-center ${mobileNavLinkClass}`}>
                FAQ
              </Link>
            </div>
            <a href="#inquiry-form-section" onClick={() => setMobileNavOpen(false)} className={`pink-primary-button mt-3 flex w-full items-center justify-center rounded-xl px-4 py-3.5 text-sm font-black border-0 cursor-pointer ${
              isPink 
                ? "bg-rose-500 text-white hover:bg-rose-600 shadow-[0_4px_16px_rgba(244,63,94,0.255)]" 
                : "bg-amber-400 text-neutral-950 hover:bg-amber-300 shadow-[0_4px_16px_rgba(251,191,36,0.255)]"
            }`}>
              상담 신청 <ArrowRight size={15} className="ml-1.5" />
            </a>
          </nav>
        )}
      </header>

      {/* Main Content (16 Slides as Sections) */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-24 sm:space-y-36">
        
        {/* SECTION 1. 표지 (Cover) */}
        <section className={`rounded-3xl p-6 sm:p-12 md:p-16 ${cardBg} flex flex-col justify-between min-h-[500px] relative overflow-hidden`}>
          {/* Accent decoration */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-[#ffd500]/10 to-transparent rounded-bl-full pointer-events-none"></div>
          
          <div className="flex items-center justify-between border-b border-neutral-200/20 pb-6 mb-6">
            <span className={`text-xs font-black tracking-widest ${isPink ? "text-neutral-450" : "text-[#0d233a]/80"}`}>120PIE & COFFEE</span>
            <span className="text-xs font-extrabold px-3 py-1 bg-amber-400 text-[#0d233a] border border-[#0d233a]/10 rounded-full shadow-sm">
              가맹 창업 제안
            </span>
          </div>

          <div className="my-auto py-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6 text-left">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
                지금 매장에<br />
                <span className={textHighlight}>디저트 매출</span>을 더하는<br />
                가장 확실한 솔루션
              </h1>
              <p className={`text-sm sm:text-base md:text-lg leading-relaxed ${textDesc}`}>
                40년 장인정신으로 빚어낸 120겹 파이와 계란빵 머신 공급까지.<br />
                인테리어 부담 없이 소자본 샵인샵 도입으로 안정적인 추가 매출을 창출하세요.
              </p>
              
              <div className="flex flex-wrap gap-3 pt-2">
                <a 
                  href="/120pie_franchise_proposal.pdf" 
                  download="120pie_가맹창업제안서.pdf"
                  className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-amber-400 text-[#0d233a] hover:bg-amber-300 font-extrabold text-sm transition-all shadow-md shadow-[#ffd500]/10"
                >
                  <Download size={16} className="mr-2" /> 제안서 PDF 다운로드
                </a>
                <a 
                  href="#inquiry-form-section" 
                  className={`inline-flex items-center justify-center px-5 py-3 rounded-xl border font-extrabold text-sm transition-all ${
                    isPink 
                      ? "border-neutral-700 bg-neutral-900 text-white hover:bg-neutral-800" 
                      : "border-[#e6dfc3] bg-white text-[#0d233a] hover:bg-[#fffdf4]"
                  }`}
                >
                  무료 창업상담 문의
                </a>
              </div>
            </div>

            <div className="lg:col-span-5 relative group">
              <div className="relative rounded-2xl overflow-hidden border border-neutral-200/20 shadow-xl aspect-[4/3] bg-neutral-950">
                <img 
                  src="https://res.cloudinary.com/dfarfqx7e/image/upload/v1781185662/%EB%A9%94%EB%89%B4_%ED%94%8C%EB%A0%88%EC%9D%B4%ED%8C%85_%EC%98%88%EC%81%9C_%EC%B9%B4%ED%8E%98_202605271150_qfswzm_nxk2mq.jpg" 
                  alt="120pie signature dessert" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-transparent to-transparent flex items-end p-4">
                  <span className="text-xs font-bold text-white/95">대표 메뉴: 120겹 오리지널 애플파이</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between border-t border-neutral-200/20 pt-6 mt-6 text-[11px] sm:text-xs font-bold text-slate-500 gap-2">
            <span>* 120pie & coffee B2B Partnership Program</span>
            <span>Slide 01 / 16</span>
          </div>
        </section>

        {/* SECTION 2. WHY 120pie */}
        <section className={`rounded-3xl p-6 sm:p-12 ${cardBg} relative`}>
          <div className="flex items-center justify-between border-b border-neutral-200/20 pb-4 mb-8">
            <span className="text-xs font-black tracking-widest text-[#ffd500]">02 / BRAND POWER</span>
            <span className="text-xs font-black text-slate-400">WHY 120PIE?</span>
          </div>

          <div className="space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-6 text-left">
                <div className="space-y-3">
                  <h2 className="text-2xl sm:text-3xl font-black">
                    왜 <span className={textHighlight}>120겹 파이</span>를 선택해야 할까요?
                  </h2>
                  <p className={`text-sm sm:text-base leading-relaxed ${textDesc}`}>
                    40년 제과 장인의 비법 생지와 업계 최초 300호점 돌파의 성장 신화로 검증된 파워 브랜드입니다.
                  </p>
                </div>

                {/* Growth Graph */}
                <div className={`p-5 rounded-2xl ${innerCardBg} space-y-4`}>
                  <h4 className={`text-xs sm:text-sm font-black text-center md:text-left flex items-center gap-1.5 ${textTitle}`}>
                    <TrendingUp size={16} className={isPink ? "text-rose-500" : "text-amber-500"} /> 3년 연속 가맹 성장 지표 (누적 계약 기준)
                  </h4>
                  <div className="space-y-3 pt-2">
                    {[
                      { year: "1년차 (런칭기)", count: "10호점", width: "w-[15%]", bg: "bg-slate-400" },
                      { year: "2년차 (성장기)", count: "70호점", width: "w-[40%]", bg: isPink ? "bg-rose-500/70" : "bg-amber-400/70" },
                      { year: "3년차 (현재)", count: "300호점 돌파", width: "w-full", bg: isPink ? "bg-rose-500" : "bg-amber-400" }
                    ].map((row, idx) => (
                      <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs font-bold">
                        <span className={`w-28 ${textDesc}`}>{row.year}</span>
                        <div className="flex-1 h-8 bg-neutral-950/40 rounded-lg overflow-hidden flex items-center">
                          <div className={`h-full ${row.width} ${row.bg} flex items-center px-3 transition-all duration-1000`}>
                            <span className="text-[#0d233a] font-extrabold text-[10px] sm:text-xs">{row.count}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 relative group">
                <div className="relative rounded-2xl overflow-hidden border border-neutral-200/20 shadow-xl aspect-[4/3] bg-neutral-950">
                  <img 
                    src="https://res.cloudinary.com/dfarfqx7e/image/upload/v1781590329/120%EA%B2%B9%ED%8C%8C%EC%9D%B4_%EC%97%B0%EC%B6%9C3_ibhumn.jpg" 
                    alt="Artisan rolling pastry dough" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-transparent to-transparent flex items-end p-4">
                    <span className="text-xs font-bold text-white/95">40년 제과 장인의 120겹 정밀 도우 성형 공정</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: "네이버 검색량", val: "월 61,500회+", desc: "키워드 쿼리 검색량 압도적 1위", icon: <Search size={22} className={isPink ? "text-rose-500" : "text-amber-400"} /> },
                { title: "SNS 해시태그", val: "누적 19.3만개+", desc: "#120겹파이 자발적 입소문 확산", icon: <Hash size={22} className={isPink ? "text-rose-500" : "text-amber-400"} /> },
                { title: "브랜드 인지도", val: "소형 디저트 1위", desc: "고객 선호도 조사 결과 검증", icon: <Award size={22} className={isPink ? "text-rose-500" : "text-amber-400"} /> }
              ].map((item, idx) => (
                <div key={idx} className={`p-6 rounded-2xl ${innerCardBgAccent} ${innerCardHover} flex flex-col justify-between text-left h-40 relative group`}>
                  <div className="flex justify-between items-start">
                    <span className={`text-xs font-bold ${textDesc}`}>{item.title}</span>
                    <div className={`p-2 rounded-xl ${isPink ? "bg-rose-500/10" : "bg-amber-400/10"}`}>
                      {item.icon}
                    </div>
                  </div>
                  <span className={`text-3xl font-black ${textHighlight} my-2`}>{item.val}</span>
                  <span className={`text-[11px] font-semibold ${textDesc} leading-none`}>{item.desc}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center border-t border-neutral-200/20 pt-6 mt-8 text-[11px] sm:text-xs font-bold text-slate-500">
            <span>* 포털 트렌드 및 본사 가맹 계약서 집계 기준</span>
            <span>Slide 02 / 16</span>
          </div>
        </section>

        {/* SECTION 3. 6WAY 매출 전략 */}
        <section className={`rounded-3xl p-6 sm:p-12 ${cardBg} relative`}>
          <div className="flex items-center justify-between border-b border-neutral-200/20 pb-4 mb-8">
            <span className="text-xs font-black tracking-widest text-[#ffd500]">03 / SALES STRATEGY</span>
            <span className="text-xs font-black text-slate-400">6WAY MULTI-CHANNEL</span>
          </div>

          <div className="space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-6 text-left">
                <div className="space-y-3">
                  <h2 className="text-2xl sm:text-3xl font-black">
                    다각화된 <span className={textHighlight}>6WAY 매출 전략</span>
                  </h2>
                  <p className={`text-sm sm:text-base leading-relaxed ${textDesc}`}>
                    상권과 계절에 관계없이 상시 고효율 수익 구조를 만들어냅니다.
                  </p>
                </div>

                {/* Channels Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[
                    { title: "01. 매장 내 홀", desc: "커피와 세트 매출 극대화", icon: <Store size={16} className="text-amber-400" /> },
                    { title: "02. 포장 (테이크아웃)", desc: "1인 팩, 패밀리 팩 간편 유도", icon: <ShoppingBag size={16} className="text-amber-400" /> },
                    { title: "03. 배달 (딜리버리)", desc: "배달앱 디저트 점유율 확장", icon: <Truck size={16} className="text-amber-400" /> },
                    { title: "04. B2B 생지 납품", desc: "주변 매장 물량 도매 납품", icon: <Layers size={16} className="text-amber-400" /> },
                    { title: "05. 단체 주문 유치", desc: "학교·회사·동호회 대량 간식", icon: <Users size={16} className="text-amber-400" /> },
                    { title: "06. 자체 시즌 메뉴", desc: "계란빵·츄러스 계절별 라인업", icon: <Sparkles size={16} className="text-amber-400" /> }
                  ].map((channel, idx) => (
                    <div key={idx} className={`p-4 rounded-xl ${innerCardBgAccent} ${innerCardHover} flex flex-col justify-between h-28`}>
                      <div className="flex justify-between items-center">
                        <span className={`text-[10px] font-black ${textDesc} uppercase`}>Channel {idx + 1}</span>
                        {channel.icon}
                      </div>
                      <div>
                        <h4 className={`text-xs sm:text-sm font-extrabold ${textTitle} mb-1.5`}>{channel.title.substring(4)}</h4>
                        <p className={`text-[10px] ${textDesc} font-semibold leading-normal`}>{channel.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5 relative group">
                <div className="relative rounded-2xl overflow-hidden border border-neutral-200/20 shadow-xl aspect-square bg-neutral-950">
                  <img 
                    src="https://res.cloudinary.com/dfarfqx7e/image/upload/v1781590223/ChatGPT_Image_2026%EB%85%84_6%EC%9B%94_9%EC%9D%BC_%EC%98%A4%ED%9B%84_01_24_05_etbfvd.png" 
                    alt="6WAY packaging box" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-transparent to-transparent flex items-end p-4">
                    <span className="text-xs font-bold text-white/95">포장 및 배달 경쟁력을 높이는 브랜드 전용 패키징 박스</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Time-of-day timeline */}
            <div className={`p-6 rounded-2xl ${innerCardBg} space-y-6`}>
              <h4 className={`text-sm font-bold text-center md:text-left flex items-center gap-2 ${textTitle}`}>
                <Clock size={16} className={isPink ? "text-rose-500" : "text-amber-500"} /> 공백 없는 24시간 타임라인별 최적 수요
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-left">
                {[
                  { time: "08:00 - 11:00", label: "아침 등교/출근길", menu: "따끈한 쌀 계란빵 & 커피", icon: <Sun size={14} className="text-amber-400" /> },
                  { time: "11:30 - 14:00", label: "점심 식후 디저트", menu: "120겹 애플파이 & 아메리카노", icon: <Coffee size={14} className="text-amber-400" /> },
                  { time: "14:30 - 17:00", label: "오후 간식 타임", menu: "오레오 츄러스 & 어린이 간식", icon: <Sparkles size={14} className="text-amber-400" /> },
                  { time: "17:30 - 21:00", label: "저녁 퇴근 및 야식", menu: "매콤한 불닭파이 패밀리 팩", icon: <Moon size={14} className="text-amber-400" /> }
                ].map((t, idx) => (
                  <div key={idx} className={`p-4 ${innerCardBgAccent} ${innerCardHover} rounded-xl text-left relative overflow-hidden`}>
                    <div className="absolute top-3 right-3 opacity-20">
                      {t.icon}
                    </div>
                    <span className={`text-[10px] font-black ${textHighlight} block mb-1`}>{t.time}</span>
                    <h5 className={`text-xs font-black ${textTitle}`}>{t.label}</h5>
                    <p className={`text-[11px] ${textDesc} mt-1 font-semibold`}>{t.menu}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center border-t border-neutral-200/20 pt-6 mt-8 text-[11px] sm:text-xs font-bold text-slate-500">
            <span>* 상시 판매 채널 가동 및 가맹점 평균 시간대 매출 분석 기준</span>
            <span>Slide 03 / 16</span>
          </div>
        </section>

        {/* SECTION 4. 간편 조리 시스템 (오퍼레이션) */}
        <section className={`rounded-3xl p-6 sm:p-12 ${cardBg} relative`}>
          <div className="flex items-center justify-between border-b border-neutral-200/20 pb-4 mb-8">
            <span className="text-xs font-black tracking-widest text-[#ffd500]">04 / OPERATION SYSTEM</span>
            <span className="text-xs font-black text-slate-400">EASY COOKING PROCESS</span>
          </div>

          <div className="space-y-10">
            <div className="text-center md:text-left space-y-3">
              <h2 className="text-2xl sm:text-3xl font-black">
                전문 주방장 없는 <span className={textHighlight}>극강의 조리 효율성</span>
              </h2>
              <p className={`text-sm sm:text-base leading-relaxed ${textDesc}`}>
                본사에서 100% 가공 생지를 완벽 콜드체인 공급하여 매장에서는 오븐에 굽기만 하면 완성됩니다.
              </p>
            </div>

            {/* Steps Flowchart */}
            <div className="relative">
              <div className={`hidden sm:block absolute top-1/2 left-4 right-4 h-0.5 ${isPink ? "bg-neutral-800/80" : "bg-[#e6dfc3]"} -translate-y-1/2 z-0`}></div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 text-center relative z-10">
                {[
                  { step: "STEP 01", title: "생지 공급", desc: "본사 주 3회 신선 냉동 물류 직배송", icon: <Truck size={20} className="text-amber-400" /> },
                  { step: "STEP 02", title: "냉동 보관", desc: "해동 과정 없이 즉시 보관 가능", icon: <Warehouse size={20} className="text-amber-400" /> },
                  { step: "STEP 03", title: "3분 베이킹", desc: "오븐기에 넣고 타이머 세팅 완료", icon: <ChefHat size={20} className="text-amber-400" /> },
                  { step: "STEP 04", title: "즉시 제공", desc: "바삭함이 살아있는 120겹 파이 완성", icon: <ShoppingBag size={20} className="text-amber-400" /> }
                ].map((row, idx) => (
                  <div key={idx} className={`p-5 rounded-xl ${innerCardBgAccent} ${innerCardHover} flex flex-col justify-between h-40 text-left`}>
                    <div className="flex justify-between items-center">
                      <span className={`text-[10px] font-black ${textDesc}`}>{row.step}</span>
                      {row.icon}
                    </div>
                    <div>
                      <h4 className={`text-sm font-black my-1 ${textTitle}`}>{row.title}</h4>
                      <p className={`text-[11px] ${textDesc} font-semibold leading-relaxed`}>{row.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center text-left">
              <div className="space-y-4">
                <h4 className="text-lg font-black flex items-center gap-2">
                  <Sliders size={20} className="text-amber-400" /> 초소형 주방 특화 인프라
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-400 font-semibold">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 mt-0.5">✓</span>
                    <span>1.5평 초소형 주방 공간만으로도 동선 배치 및 기기 구동 가능</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 mt-0.5">✓</span>
                    <span>가스 배관 설비, 덕트 공사 등 불필요한 고비용 가스시설 불필요</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 mt-0.5">✓</span>
                    <span>100% 전기 베이킹 기기 사용으로 조리 연기, 냄새, 열기 최소화</span>
                  </li>
                </ul>
              </div>
              <div className="rounded-xl overflow-hidden aspect-[16/10] bg-neutral-900 border border-neutral-800 relative group">
                <img 
                  src="https://res.cloudinary.com/dfarfqx7e/image/upload/v1781590218/ChatGPT_Image_2026%EB%85%84_6%EC%9B%94_9%EC%9D%BC_%EC%98%A4%ED%9B%84_05_04_59_upd43s.png" 
                  alt="Dough and baking process" 
                  className="w-full h-full object-cover opacity-80 group-hover:scale-102 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-transparent to-transparent flex items-end p-4">
                  <span className="text-xs font-bold text-white/95">가맹점 실제 주방 조리 공간 및 에그빵 제조 모습</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center border-t border-neutral-200/20 pt-6 mt-8 text-[11px] sm:text-xs font-bold text-slate-500">
            <span>* 가맹 본사 직영 생산 및 물류 공급 프로세스 기준</span>
            <span>Slide 04 / 16</span>
          </div>
        </section>

        {/* SECTION 5. 도면 레이아웃 (공간 설계) */}
        <section className={`rounded-3xl p-6 sm:p-12 ${cardBg} relative`}>
          <div className="flex items-center justify-between border-b border-neutral-200/20 pb-4 mb-8">
            <span className="text-xs font-black tracking-widest text-[#ffd500]">05 / SPACE DESIGN</span>
            <span className="text-xs font-black text-slate-400">FLOOR LAYOUT PLANS</span>
          </div>

          <div className="space-y-10">
            <div className="text-center md:text-left space-y-3">
              <h2 className="text-2xl sm:text-3xl font-black">
                평수별 맞춤형 <span className={textHighlight}>공간 도면 설계</span>
              </h2>
              <p className={`text-sm sm:text-base leading-relaxed ${textDesc}`}>
                동선을 비약적으로 단축시켜 1인 근무 효율을 극대화한 실속형 배치도입니다.
              </p>
            </div>

            {/* Tabs */}
            <div className="flex justify-center md:justify-start gap-3">
              <button 
                type="button" 
                onClick={() => setSelectedPlanTab("8py")}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm cursor-pointer transition-all border ${
                  selectedPlanTab === "8py" 
                    ? "bg-amber-400 text-[#0d233a] border-amber-400 font-black shadow-md" 
                    : "bg-neutral-900 border-neutral-800 text-slate-400 hover:text-white"
                }`}
              >
                8평형 콤팩트 레이아웃
              </button>
              <button 
                type="button" 
                onClick={() => setSelectedPlanTab("10py")}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm cursor-pointer transition-all border ${
                  selectedPlanTab === "10py" 
                    ? "bg-amber-400 text-[#0d233a] border-amber-400 font-black shadow-md" 
                    : "bg-neutral-900 border-neutral-800 text-slate-400 hover:text-white"
                }`}
              >
                10평형 풀패키지 레이아웃
              </button>
            </div>

            {/* Tab content */}
            <div className={`p-6 sm:p-8 rounded-2xl ${innerCardBg} grid grid-cols-1 md:grid-cols-12 gap-8 items-center text-left`}>
              <div className="md:col-span-7 space-y-4">
                <span className="text-[10px] font-black tracking-widest text-[#ffd500] uppercase block">
                  {selectedPlanTab === "8py" ? "8 Pyeong Model" : "10 Pyeong Model"}
                </span>
                <h4 className={`text-lg font-black ${textTitle}`}>
                  {selectedPlanTab === "8py" 
                    ? "테이크아웃 및 배달 위주 1인 카페의 정석" 
                    : "테이블 홀 매출과 포장 배달을 모두 수용하는 구성"
                  }
                </h4>
                <p className={`text-xs sm:text-sm ${textDesc} font-semibold leading-relaxed`}>
                  {selectedPlanTab === "8py" 
                    ? "카운터 정면에 전용 쇼케이스를 밀착 배치하고, 뒷벽에 파이 머신과 에그빵 머신을 1자 구조로 직렬화하여 한 자리에서 주문 접수, 조리, 세팅, 고객 전달까지 이동 거리 1.5m 이내로 동선을 설계했습니다." 
                    : "테이블 3~4조를 안정적으로 구획하면서, 테이크아웃 통로와 배달 기사 픽업 존을 독립 분리시켰습니다. 주방 내부에는 초소형 츄러스 튀김기 공간까지 추가로 확보 가능한 가동성이 돋보이는 도면입니다."
                  }
                </p>
                <div className="grid grid-cols-2 gap-4 text-xs font-bold pt-2">
                  <div className={`p-3 rounded-lg border text-center ${isPink ? "bg-neutral-950/50 border-neutral-850" : "bg-amber-400/5 border-amber-200/40"}`}>
                    <span className={`${textDesc} block mb-1`}>필요 주방 평수</span>
                    <span className={`text-sm font-black ${textTitle}`}>{selectedPlanTab === "8py" ? "1.5평 내외" : "2.0평 내외"}</span>
                  </div>
                  <div className={`p-3 rounded-lg border text-center ${isPink ? "bg-neutral-950/50 border-neutral-850" : "bg-amber-400/5 border-amber-200/40"}`}>
                    <span className={`${textDesc} block mb-1`}>권장 운영 인원</span>
                    <span className={`text-sm font-black ${textTitle}`}>{selectedPlanTab === "8py" ? "점주 1인 가동" : "1인 ~ 1.5인"}</span>
                  </div>
                </div>
              </div>
              <div className="md:col-span-5 rounded-xl overflow-hidden bg-neutral-955 aspect-square border border-neutral-850/20 relative group">
                <img 
                  src={selectedPlanTab === "8py" 
                    ? "https://res.cloudinary.com/dfarfqx7e/image/upload/v1781590217/edited-photo_68_t9lc94.png"
                    : "https://res.cloudinary.com/dfarfqx7e/image/upload/v1781590217/edited-photo_67_uqjalx.png"
                  } 
                  alt="Floor plan spatial layout" 
                  className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-550"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent flex flex-col justify-end p-4">
                  <span className="text-[10px] font-black text-amber-400 block uppercase tracking-wider">Interior Concept Mockup</span>
                  <span className="text-xs font-bold text-white/95 mt-0.5">
                    {selectedPlanTab === "8py" ? "8평 매장 내부 인테리어 레이아웃" : "10평 매장 전경 및 아일랜드 동선 배치"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center border-t border-neutral-200/20 pt-6 mt-8 text-[11px] sm:text-xs font-bold text-slate-500">
            <span>* 가맹 개설 본사 인테리어 사업부 기술 도안 및 공간 구성 기준</span>
            <span>Slide 05 / 16</span>
          </div>
        </section>

        {/* SECTION 6. 내부 인테리어 */}
        /* SECTION 7. 성공사례 */
        <section className={`rounded-3xl p-6 sm:p-12 ${cardBg} relative`}>
          <div className="flex items-center justify-between border-b border-neutral-200/20 pb-4 mb-8">
            <span className="text-xs font-black tracking-widest text-[#ffd500]">07 / SUCCESS CASES</span>
            <span className="text-xs font-black text-slate-400">REAL PARTNERSHIP RESULTS</span>
          </div>

          <div className="space-y-10">
            <div className="text-center md:text-left space-y-3">
              <h2 className="text-2xl sm:text-3xl font-black">
                가맹점주님이 증명하는 <span className={textHighlight}>실제 가맹 성공사례</span>
              </h2>
              <p className={`text-sm sm:text-base leading-relaxed ${textDesc}`}>
                기존 매장의 인프라와 120pie의 제품력이 결합되어 극적인 매출 반등을 이뤄낸 점주님들의 생생한 후기입니다.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch text-left">
              <div className="lg:col-span-7 space-y-4">
                {SUCCESS_CASES.map((item, idx) => (
                  <div key={idx} className={`p-5 rounded-2xl ${innerCardBgAccent} ${innerCardHover} flex flex-col justify-between text-left`}>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className={`text-[9.5px] font-black px-2.5 py-1 bg-amber-400/10 ${isPink ? "text-rose-455" : "text-amber-600"} border ${isPink ? "border-rose-500/20" : "border-amber-400/20"} rounded-full inline-block`}>
                          {item.badge}
                        </span>
                        <span className={`text-xs font-bold ${textDesc}`}>Case 0{idx + 1}</span>
                      </div>
                      <h4 className={`text-sm font-black ${textTitle} leading-snug`}>{item.title}</h4>
                      <span className={`text-sm font-extrabold ${isPink ? "text-rose-500" : "text-amber-500"} block pb-1`}>
                        {item.stats}
                      </span>
                      <p className={`text-[11px] ${textDesc} font-semibold leading-relaxed`}>
                        {item.desc}
                      </p>
                    </div>
                    <ul className={`grid grid-cols-1 gap-1 border-t ${isPink ? "border-neutral-850" : "border-amber-200/30"} pt-3 mt-3 text-[10px] ${textDesc} font-bold`}>
                      {item.points.map((pt, pIdx) => (
                        <li key={pIdx} className="flex items-center gap-1.5">
                          <CheckCircle2 size={10} className={isPink ? "text-rose-500" : "text-amber-500"} />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="lg:col-span-5 relative group flex flex-col justify-center">
                <div className="relative rounded-2xl overflow-hidden border border-neutral-200/20 shadow-xl aspect-[4/5] bg-neutral-950 w-full h-full min-h-[350px]">
                  <img 
                    src="https://res.cloudinary.com/dfarfqx7e/image/upload/v1781590221/ChatGPT_Image_2026%EB%85%84_6%EC%9B%94_9%EC%9D%BC_%EC%98%A4%ED%9B%84_05_24_39_a38n7c.png" 
                    alt="Success advertising banner mockup" 
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent flex flex-col justify-end p-4">
                    <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider">Marketing Assets</span>
                    <span className="text-xs font-bold text-white/95 mt-0.5">매출 부스팅 전단 및 모바일 광고 홍보 시각 시안</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center border-t border-neutral-200/20 pt-6 mt-8 text-[11px] sm:text-xs font-bold text-slate-500">
            <span>* 가맹점 POS 데이터 및 상권 분석 전산 자료 기준</span>
            <span>Slide 07 / 16</span>
          </div>
        </section>

        {/* SECTION 8. 메뉴구성 */}
        <section className={`rounded-3xl p-6 sm:p-12 ${cardBg} relative`}>
          <div className="flex items-center justify-between border-b border-neutral-200/20 pb-4 mb-8">
            <span className="text-xs font-black tracking-widest text-[#ffd500]">08 / MENU PORTFOLIO</span>
            <span className="text-xs font-black text-slate-400">STRUCTURE</span>
          </div>

          <div className="space-y-10">
            {/* Top Row: Title & Badges */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
              <div className="lg:col-span-7 space-y-4 text-center md:text-left">
                <h2 className={`text-2xl sm:text-3xl md:text-4xl font-black leading-tight ${textTitle}`}>
                  탄탄한 경쟁력의<br />
                  <span className={textHighlight}>차별화된 메뉴 구성</span>
                </h2>
                <p className={`text-xs sm:text-sm leading-relaxed ${textDesc} max-w-xl`}>
                  상권과 고객층에 맞춰 시너지를 낼 수 있는 다채로운 레이어드 디저트 라인업을 갖추고 있습니다.
                </p>
              </div>

              <div className="lg:col-span-5 space-y-3">
                {[
                  { title: "디저트 다양성", desc: "계절감과 트렌드를 반영한 다채로운 레이어드 메뉴" },
                  { title: "식사 대용 확장", desc: "든든한 사이드 메뉴로 식사 수요까지 흡수" },
                  { title: "음료와의 궁합", desc: "디저트와 어울리는 다양한 음료 라인업 제공" }
                ].map((item, idx) => (
                  <div key={idx} className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all duration-300 ${isPink ? "bg-neutral-900/60 border border-neutral-800 text-white" : "bg-amber-400 text-neutral-900 shadow-sm shadow-amber-400/5"}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isPink ? "bg-rose-500/10 text-rose-500" : "bg-neutral-900 text-amber-400"}`}>
                      <Check size={14} strokeWidth={3} />
                    </div>
                    <div className="text-left">
                      <div className="text-xs sm:text-sm font-black leading-none">{item.title}</div>
                      <div className={`text-[10px] ${isPink ? "text-neutral-400" : "text-neutral-600"} font-bold mt-1.5`}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Row: 2x2 Grid of Menu Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              {[
                {
                  title: "120겹파이 시리즈",
                  points: [
                    "크림치즈 / 커스터드",
                    "고구마 / 블루베리",
                    "함박치즈 / 망고 / 애플",
                    "흑임자크림 / 직화불고기 / 직화불닭"
                  ],
                  img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1781183595/120%EA%B2%B9%ED%8C%8C%EC%9D%B4_%ED%81%AC%EB%A6%BC%EC%B9%98%EC%A6%88_%EC%95%A0%ED%94%8C_%EB%B8%94%EB%A3%A8%EB%B2%A0%EB%A6%AC_%EC%97%B0%EC%B6%9C_bzyzzs.jpg"
                },
                {
                  title: "에그 120",
                  points: [
                    "오리지널 / 베이컨",
                    "콘버터 / 커스터드",
                    "통팥 / 통모짜",
                    "로제미트 / 슈크림"
                  ],
                  img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1781184083/120egg_45_dqgrir.jpg"
                },
                {
                  title: "츄러스 120",
                  points: [
                    "오리지널 / 슈가",
                    "오레오 / 녹차"
                  ],
                  img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1781184099/IMG_0015_6_3_bxmolh.jpg"
                },
                {
                  title: "사이드 & 음료",
                  points: [
                    "국물 / 로제 / 짜장 떡볶이",
                    "직화 불고기 핫도그",
                    "커피 / 에이드 / 스무디 / 뱅쇼 등"
                  ],
                  img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1781590222/ChatGPT_Image_2026%EB%85%84_6%EC%9B%94_9%EC%9D%BC_%EC%98%A4%ED%9B%84_05_36_29_dgybn5.png"
                }
              ].map((card, idx) => (
                <div key={idx} className={`p-6 rounded-2xl ${innerCardBgAccent} ${innerCardHover} border ${isPink ? "border-neutral-850" : "border-amber-200/60"} flex flex-col justify-between h-[450px] group`}>
                  <div>
                    <div className="flex items-center gap-2 border-b border-neutral-200/10 pb-3 mb-3">
                      <CheckCircle2 size={16} className={isPink ? "text-rose-500" : "text-amber-500"} />
                      <h4 className={`text-sm sm:text-base font-black ${textTitle}`}>{card.title}</h4>
                    </div>
                    <ul className={`space-y-1.5 text-xs ${textDesc} font-semibold pl-1`}>
                      {card.points.map((pt, ptIdx) => (
                        <li key={ptIdx} className="flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 ${isPink ? "bg-rose-500" : "bg-amber-400"} rounded-full shrink-0`}></span>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-4 rounded-xl overflow-hidden border border-neutral-250/10 aspect-[16/9] bg-neutral-950 relative">
                    <img 
                      src={card.img} 
                      alt={card.title} 
                      className="w-full h-full object-cover opacity-90 group-hover:scale-[1.03] transition-transform duration-500" 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center border-t border-neutral-200/20 pt-6 mt-8 text-[11px] sm:text-xs font-bold text-slate-500">
            <span>* 120pie & coffee 전체 상품 가맹 공급 품목 리스트 기준</span>
            <span>Slide 08 / 16</span>
          </div>
        </section>
        {/* SECTION 9. 세부 메뉴구성 */}
        <section className={`rounded-3xl p-6 sm:p-12 ${cardBg} relative`}>
          <div className="flex items-center justify-between border-b border-neutral-200/20 pb-4 mb-8">
            <span className="text-xs font-black tracking-widest text-[#ffd500]">09 / DETAILED MENU</span>
            <span className="text-xs font-black text-slate-400">FLAVOR PROFILES</span>
          </div>

          <div className="space-y-10">
            <div className="text-center md:text-left space-y-3">
              <h2 className="text-2xl sm:text-3xl font-black">
                가맹점 도입 가능 <span className={textHighlight}>세부 메뉴 구성</span>
              </h2>
              <p className={`text-sm sm:text-base leading-relaxed ${textDesc}`}>
                카테고리별 탭을 클릭하여 120pie & coffee의 모든 세부 출시 메뉴들을 확인해 보세요.
              </p>
            </div>

            {/* Tabs Navigation */}
            <div className="flex flex-wrap justify-center gap-2 mb-8 select-none">
              {[
                { key: "pie", label: "120겹 파이 시리즈", emoji: "🥐" },
                { key: "egg", label: "에그 120 시리즈", emoji: "🥚" },
                { key: "churros", label: "츄러스 120 시리즈", emoji: "🥨" },
                { key: "side", label: "떡볶이 & 핫도그", emoji: "🌭" },
                { key: "drink", label: "커피 & 음료", emoji: "☕" }
              ].map((tab) => {
                const isActive = activeMenuTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveMenuTab(tab.key as any)}
                    className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all duration-200 cursor-pointer border ${
                      isActive
                        ? isPink
                          ? "bg-rose-500 border-rose-500 text-white shadow-md shadow-rose-500/10"
                          : "bg-amber-400 border-amber-400 text-neutral-900 shadow-md shadow-amber-400/10"
                        : isPink
                          ? "bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:text-white"
                          : "bg-white border-amber-200/50 text-[#576575] hover:text-[#0d233a] hover:bg-[#fffcf0]"
                    }`}
                  >
                    <span>{tab.emoji}</span>
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Grid Contents */}
            <div>
              {activeMenuTab === "pie" && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
                  {[
                    { name: "꿀호떡 파이", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1781184848/%EA%BF%80%ED%98%B8%EB%96%A1%ED%8C%8C%EC%9D%B4_%EB%88%84%EB%81%BC__260131_dmpfos.jpg" },
                    { name: "페페로니피자 파이", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1781184808/%ED%8E%98%ED%8E%98%EB%A1%9C%EB%8B%88%ED%94%BC%EC%9E%90%ED%8C%8C%EC%9D%B4_%EB%88%84%EB%81%BC__260131_izlrfv.jpg" },
                    { name: "로제미트 파이", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1781184221/%EB%A1%9C%EC%A0%9C%EB%AF%B8%ED%8A%B8%ED%8C%8C%EC%9D%B4_%EB%88%84%EB%81%BC__260131_s3svi2.jpg" },
                    { name: "팥치즈 파이", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1781184738/%ED%8C%A5%EC%B9%98%EC%A6%88%ED%8C%8C%EC%9D%B4_%EB%88%84%EB%81%BC__260131_cvme5l.jpg" },
                    { name: "애플 파이", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1781184723/%EC%95%A0%ED%94%8C%ED%8C%8C%EC%9D%B4_%EB%88%84%EB%81%BC__260131_kxykcu.jpg" },
                    { name: "불고기 파이", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1781184700/%EB%B6%88%EA%B3%A0%EA%B8%B0%ED%8C%8C%EC%9D%B4_%EB%88%84%EB%81%BC__260131_ss1t8y.jpg" },
                    { name: "불닭 파이", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1781184882/%EB%B6%88%EB%8B%AD%ED%8C%8C%EC%9D%B4_%EB%88%84%EB%81%BC__260131_eaiujx.jpg" },
                    { name: "크림치즈 파이", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1781184763/%ED%81%AC%EB%A6%BC%EC%B9%98%EC%A6%88%ED%8C%8C%EC%9D%B4_%EB%88%84%EB%81%BC__260131_nvzwvc.jpg" },
                    { name: "망고 파이", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1781184783/%EB%A7%9D%EA%B3%A0%ED%8C%8C%EC%9D%B4_%EB%88%84%EB%81%BC__260131_yynprf.jpg" },
                    { name: "콘치즈 파이", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1781184643/%EC%BD%98%EC%B9%98%EC%A6%88%ED%8C%8C%EC%9D%B4_%EB%88%84%EB%81%BC__260131_lio2tj.jpg" },
                    { name: "커스터드 파이", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1781184658/%EC%BB%A4%EC%8A%A4%ED%84%B0%EB%93%9C%ED%8C%8C%EC%9D%B4_%EB%88%84%EB%81%BC__260131_dule6z.jpg" },
                    { name: "블루베리 파이", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1781184610/%EB%B8%94%EB%A3%A8%EB%B2%A0%EB%A6%AC%ED%8C%8C%EC%9D%B4_%EB%88%84%EB%81%BC__260131_zfmatx.jpg" }
                  ].map((item, idx) => (
                    <div key={idx} className="group flex flex-col items-center">
                      <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden border border-neutral-200/20 shadow-md bg-neutral-950 relative group-hover:border-amber-400 transition-all duration-300">
                        <img 
                          src={item.img} 
                          alt={item.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-95"
                        />
                      </div>
                      <span className={`text-xs sm:text-sm font-black ${textTitle} text-center mt-2 px-1 block truncate w-full`}>{item.name}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeMenuTab === "egg" && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
                  {[
                    "오리지널 계란빵", "베이컨 계란빵", "커스터드 계란빵", "콘치즈 계란빵",
                    "로제미트 계란빵", "통모짜 계란빵", "슈크림 계란빵", "팥 계란빵"
                  ].map((name, idx) => (
                    <div key={idx} className="group flex flex-col items-center">
                      <div className={`w-full aspect-[4/3] rounded-2xl border-2 border-dashed ${isPink ? "border-neutral-800 bg-neutral-900/30 text-rose-500/20" : "border-amber-200/60 bg-amber-50/20 text-amber-500/30"} flex flex-col items-center justify-center relative group-hover:border-amber-400 transition-all duration-300`}>
                        <span className="text-2xl opacity-60">🥚</span>
                        <span className="text-[8px] font-black uppercase tracking-wider mt-1.5 opacity-50">IMAGE AREA</span>
                      </div>
                      <span className={`text-xs sm:text-sm font-black ${textTitle} text-center mt-2 px-1 block truncate w-full`}>{name}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeMenuTab === "churros" && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-2xl mx-auto">
                  {[
                    "오리지널 츄러스", "슈가 츄러스", "오레오 츄러스", "녹차 츄러스"
                  ].map((name, idx) => (
                    <div key={idx} className="group flex flex-col items-center">
                      <div className={`w-full aspect-[4/3] rounded-2xl border-2 border-dashed ${isPink ? "border-neutral-800 bg-neutral-900/30 text-rose-500/20" : "border-amber-200/60 bg-amber-50/20 text-amber-500/30"} flex flex-col items-center justify-center relative group-hover:border-amber-400 transition-all duration-300`}>
                        <span className="text-2xl opacity-60">🥨</span>
                        <span className="text-[8px] font-black uppercase tracking-wider mt-1.5 opacity-50">IMAGE AREA</span>
                      </div>
                      <span className={`text-xs sm:text-sm font-black ${textTitle} text-center mt-2 px-1 block truncate w-full`}>{name}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeMenuTab === "side" && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-2xl mx-auto">
                  {[
                    "국물 떡볶이", "로제 떡볶이", "짜장 떡볶이", "직화불고기 핫도그"
                  ].map((name, idx) => (
                    <div key={idx} className="group flex flex-col items-center">
                      <div className={`w-full aspect-[4/3] rounded-2xl border-2 border-dashed ${isPink ? "border-neutral-800 bg-neutral-900/30 text-rose-500/20" : "border-amber-200/60 bg-amber-50/20 text-amber-500/30"} flex flex-col items-center justify-center relative group-hover:border-amber-400 transition-all duration-300`}>
                        <span className="text-2xl opacity-60">🌭</span>
                        <span className="text-[8px] font-black uppercase tracking-wider mt-1.5 opacity-50">IMAGE AREA</span>
                      </div>
                      <span className={`text-xs sm:text-sm font-black ${textTitle} text-center mt-2 px-1 block truncate w-full`}>{name}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeMenuTab === "drink" && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 sm:gap-6">
                  {[
                    "아메리카노", "카페라떼", "바닐라라떼", "콜드브루", "흑당라떼", "딸기라떼", "녹차라떼",
                    "요거트스무디", "캐모마일티", "히비스커스티", "페퍼민트티", "밀크티", "아이스티", "뱅쇼",
                    "밀크쉐이크", "딸기쉐이크", "쿠앤크쉐이크", "초코쉐이크", "딸기주스", "망고주스", "블루베리주스"
                  ].map((name, idx) => (
                    <div key={idx} className="group flex flex-col items-center">
                      <div className={`w-full aspect-[4/3] rounded-2xl border-2 border-dashed ${isPink ? "border-neutral-800 bg-neutral-900/30 text-rose-500/20" : "border-amber-200/60 bg-amber-50/20 text-amber-500/30"} flex flex-col items-center justify-center relative group-hover:border-amber-400 transition-all duration-300`}>
                        <span className="text-2xl opacity-60">☕</span>
                        <span className="text-[8px] font-black uppercase tracking-wider mt-1.5 opacity-50">IMAGE AREA</span>
                      </div>
                      <span className={`text-xs sm:text-sm font-black ${textTitle} text-center mt-2 px-1 block truncate w-full`}>{name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center border-t border-neutral-200/20 pt-6 mt-8 text-[11px] sm:text-xs font-bold text-slate-500">
            <span>* 본사 시그니처 카테고리 전체 메뉴 구성 리스트 기준</span>
            <span>Slide 09 / 16</span>
          </div>
        </section>
        {/* SECTION 10. 수익 시뮬레이션 */}
        <section className={`rounded-3xl p-6 sm:p-12 ${cardBg} relative`}>
          <div className="flex items-center justify-between border-b border-neutral-200/20 pb-4 mb-8">
            <span className="text-xs font-black tracking-widest text-[#ffd500]">10 / PROFIT SIMULATION</span>
            <span className="text-xs font-black text-slate-400">FINANCIAL ROI INSIGHTS</span>
          </div>

          <div className="space-y-10">
            <div className="text-center md:text-left space-y-3">
              <h2 className="text-2xl sm:text-3xl font-black">
                체계적인 <span className={textHighlight}>가맹점 수익 시뮬레이션</span>
              </h2>
              <p className={`text-sm sm:text-base leading-relaxed ${textDesc}`}>
                높은 마진율과 무상 가맹 지원으로 빠른 초기 비용 회수가 가능합니다. (월 매출 3,000만 원 예시)
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch text-left">
              <div className={`lg:col-span-8 p-6 rounded-2xl border ${isPink ? "border-neutral-850" : "border-amber-200/40"} overflow-x-auto ${innerCardBg} ${innerCardHover}`}>
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className={`border-b ${isPink ? "border-neutral-805" : "border-amber-200/40"} ${isPink ? "text-rose-455" : "text-amber-600"}`}>
                      <th className="py-3 px-4 font-black">구분</th>
                      <th className="py-3 px-4 font-black text-right">금액</th>
                      <th className="py-3 px-4 font-black text-right">비율</th>
                      <th className="py-3 px-4 font-black">비고</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { cat: "월 매출액", price: "3,000만 원", ratio: "100%", desc: "평균 가맹점 월 판매 기준 매출 예시" },
                      { cat: "식자재비", price: "1,050만 원", ratio: "35%", desc: "본사 완제품 생지 및 부자재 공급 단가" },
                      { cat: "임차료", price: "250만 원", ratio: "8.3%", desc: "10평형 매장 평균 월세" },
                      { cat: "인건비", price: "180만 원", ratio: "6.0%", desc: "점주 1인 + 파트타임 1인 운영" },
                      { cat: "관리비 및 수수료", price: "120만 원", ratio: "4.0%", desc: "수도, 광열비 및 배달앱 수수료 등" }
                    ].map((row, idx) => (
                      <tr key={idx} className={`border-b ${isPink ? "border-neutral-805/50" : "border-amber-200/20"} ${textTitle} font-bold`}>
                        <td className="py-3 px-4 font-black">{row.cat}</td>
                        <td className="py-3 px-4 text-right">{row.price}</td>
                        <td className="py-3 px-4 text-right font-mono">{row.ratio}</td>
                        <td className={`py-3 px-4 text-[10px] ${textDesc}`}>{row.desc}</td>
                      </tr>
                    ))}
                    <tr className={`${isPink ? "bg-rose-500/10 text-rose-500" : "bg-amber-400/10 text-amber-600"} font-black`}>
                      <td className="py-4 px-4 rounded-l-xl">월 순수익</td>
                      <td className="py-4 px-4 text-right">1,400만 원</td>
                      <td className="py-4 px-4 text-right font-mono">46.7%</td>
                      <td className="py-4 px-4 rounded-r-xl text-[10px]">로열티 0% 적용 및 높은 마진 보장</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
                <div className="relative rounded-2xl overflow-hidden border border-neutral-200/20 shadow-xl aspect-[4/3] bg-neutral-950 w-full">
                  <img 
                    src="https://res.cloudinary.com/dfarfqx7e/image/upload/v1781187164/120%EA%B2%B9%ED%8C%8C%EC%9D%B4_%EC%97%B0%EC%B6%9C4_r90tky_lqzsb6.jpg" 
                    alt="Arabica specialty coffee beans" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-transparent to-transparent flex items-end p-3">
                    <span className="text-[10px] font-bold text-white/95">커피 판매 마진을 극대화하는 아라비카 원두 및 매장 비주얼</span>
                  </div>
                </div>

                <div className={`p-5 rounded-2xl border ${isPink ? "border-rose-500/20 bg-rose-500/5 text-rose-455" : "border-amber-400/20 bg-amber-400/5 text-amber-600"} flex flex-col items-center justify-center text-center space-y-1.5`}>
                  <TrendingUp size={24} />
                  <span className="text-xs font-black">디저트 업계 최고 수준 마진율</span>
                  <span className="text-base font-extrabold">월 순수익 약 1,400만 원 (46.7%)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center border-t border-neutral-200/20 pt-6 mt-8 text-[11px] sm:text-xs font-bold text-slate-500">
            <span>* 상기 금액은 점포 입지 및 가맹점 운영 방식에 따라 다를 수 있습니다.</span>
            <span>Slide 10 / 16</span>
          </div>
        </section>

        {/* SECTION 11. 창업모델 A */}
        <section className={`rounded-3xl p-6 sm:p-12 ${cardBg} relative`}>
          <div className="flex items-center justify-between border-b border-neutral-200/20 pb-4 mb-8">
            <span className="text-xs font-black tracking-widest text-[#ffd500]">11 / FRANCHISE MODEL A</span>
            <span className="text-xs font-black text-slate-400">SHOP-IN-SHOP / DELIVERY</span>
          </div>

          <div className="my-auto py-2 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-5 space-y-4 text-left flex flex-col justify-between">
              <div>
                <span className={`text-xs font-black px-2.5 py-1 ${isPink ? "bg-rose-500/10 text-rose-455 border-rose-500/20" : "bg-amber-400/10 text-amber-600 border-amber-400/20"} border rounded-full`}>
                  모델 A: 샵인샵 / 배달 전문형
                </span>
                <h2 className={`text-xl sm:text-2xl md:text-3xl font-black leading-tight ${textTitle} mt-3`}>
                  기존 매장 그대로,<br />
                  <span className={textHighlight}>440만 원</span> 소자본 즉시 결합
                </h2>
                <p className={`text-xs sm:text-sm leading-relaxed ${textDesc} mt-2`}>
                  기존 카페, 핫도그, 떡볶이집 매장에 기기 세팅과 사인물 교체만으로 디저트 판매를 시작하는 초간편 하이브리드 가입 프로그램입니다.
                </p>
              </div>
              
              <div className={`grid grid-cols-2 gap-3 text-xs font-bold ${textDesc}`}>
                {[
                  "가맹비/교육비 파격 환급",
                  "주방 설비 공사 불필요",
                  "초도 생지 200개 지원",
                  "배달 플랫폼 즉시 연동"
                ].map((txt, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <CheckCircle2 size={12} className={isPink ? "text-rose-500" : "text-amber-500"} />
                    <span>{txt}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-3 relative group">
              <div className="relative rounded-2xl overflow-hidden border border-neutral-200/20 shadow-xl aspect-[4/5] bg-neutral-950 w-full h-full min-h-[220px]">
                <img 
                  src="https://res.cloudinary.com/dfarfqx7e/image/upload/v1781186407/2026-05-28_13_41_46_xec3ws_hrigku.png" 
                  alt="Model A Counter POP advertising" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-transparent to-transparent flex items-end p-3">
                  <span className="text-[10px] font-bold text-white/95">카운터 샵인샵 전용 비주얼 포스터</span>
                </div>
              </div>
            </div>

            <div className={`lg:col-span-4 p-6 rounded-2xl text-left flex flex-col justify-between ${innerCardBgAccent} ${innerCardHover}`}>
              <span className={`text-[10px] font-black ${textDesc} uppercase tracking-wider block`}>MODEL A DETAILS</span>
              <div className={`space-y-3 border-b ${isPink ? "border-neutral-805" : "border-amber-200/35"} pb-4 my-3`}>
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className={textDesc}>가맹비 (한시 혜택)</span>
                  <span className={`${textTitle} font-extrabold line-through`}>100만 원</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className={textDesc}>장비 공급 비용</span>
                  <span className={`${isPink ? "text-rose-455" : "text-amber-600"} font-extrabold text-sm`}>290만 원</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className={textDesc}>초도 자재 지원</span>
                  <span className={`${textTitle} font-extrabold`}>150만 원</span>
                </div>
              </div>
              <div className="flex justify-between items-center font-black">
                <span className={`text-xs ${textTitle}`}>최종 도입 금액</span>
                <span className={`text-base ${isPink ? "text-rose-500" : "text-amber-500"}`}>440만 원</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center border-t border-neutral-200/20 pt-6 mt-8 text-[11px] sm:text-xs font-bold text-slate-500">
            <span>* 120pie & coffee 샵인샵 특화 패키지 가이드 기준</span>
            <span>Slide 11 / 16</span>
          </div>
        </section>

        {/* SECTION 12. 창업모델 B */}
        <section className={`rounded-3xl p-6 sm:p-12 ${cardBg} relative`}>
          <div className="flex items-center justify-between border-b border-neutral-200/20 pb-4 mb-8">
            <span className="text-xs font-black tracking-widest text-[#ffd500]">12 / FRANCHISE MODEL B</span>
            <span className="text-xs font-black text-slate-400">COMPACT TAKE-OUT CAFE</span>
          </div>

          <div className="my-auto py-2 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-5 space-y-4 text-left flex flex-col justify-between">
              <div>
                <span className={`text-xs font-black px-2.5 py-1 ${isPink ? "bg-rose-500/10 text-rose-455 border-rose-500/20" : "bg-amber-400/10 text-amber-600 border-amber-400/20"} border rounded-full`}>
                  모델 B: 8~10평 컴팩트 매장
                </span>
                <h2 className={`text-xl sm:text-2xl md:text-3xl font-black leading-tight ${textTitle} mt-3`}>
                  포장과 홀의 황금 비율,<br />
                  <span className={textHighlight}>1인 운영 최적화</span> 실속형 카페
                </h2>
                <p className={`text-xs sm:text-sm leading-relaxed ${textDesc} mt-2`}>
                  8평~10평의 콤팩트한 매장에서 포장และ 배달, 테이블 매출을 극대화하는 정석 가맹 프로그램입니다.
                </p>
              </div>
              
              <div className={`grid grid-cols-2 gap-3 text-xs font-bold ${textDesc}`}>
                {[
                  "1인 운영 가능 동선 배치",
                  "초소형 주방 특화 레이아웃",
                  "아웃도어 주문 창구 설계",
                  "고급 인테리어 마감 지원"
                ].map((txt, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <CheckCircle2 size={12} className={isPink ? "text-rose-500" : "text-amber-500"} />
                    <span>{txt}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-3 relative group">
              <div className="relative rounded-2xl overflow-hidden border border-neutral-200/20 shadow-xl aspect-[4/5] bg-neutral-950 w-full h-full min-h-[220px]">
                <img 
                  src="https://res.cloudinary.com/dfarfqx7e/image/upload/v1781186403/IMG_8185_jpquaf_z9ikmf.jpg" 
                  alt="Model B Packaging box design" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-550 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-transparent to-transparent flex items-end p-3">
                  <span className="text-[10px] font-bold text-white/95">테이크아웃 및 선물 상자 박스</span>
                </div>
              </div>
            </div>

            <div className={`lg:col-span-4 p-6 rounded-2xl text-left flex flex-col justify-between ${innerCardBgAccent} ${innerCardHover}`}>
              <span className={`text-[10px] font-black ${textDesc} uppercase tracking-wider block`}>MODEL B BUDGET</span>
              <div className={`space-y-3 border-b ${isPink ? "border-neutral-805" : "border-amber-200/35"} pb-4 my-3`}>
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className={textDesc}>가맹 계약비</span>
                  <span className={`${textTitle} font-extrabold`}>200만 원</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className={textDesc}>인테리어 (10평 기준)</span>
                  <span className={`${textTitle} font-extrabold`}>1,500만 원</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className={textDesc}>간판 및 기기 세팅</span>
                  <span className={`${textTitle} font-extrabold`}>800만 원</span>
                </div>
              </div>
              <div className="flex justify-between items-center font-black">
                <span className={`text-xs ${textTitle}`}>예상 창업 비용</span>
                <span className={`text-base ${isPink ? "text-rose-500" : "text-amber-500"}`}>2,500만 원 대</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center border-t border-neutral-200/20 pt-6 mt-8 text-[11px] sm:text-xs font-bold text-slate-500">
            <span>* 점포 임차료를 제외한 표준 창업 개설 비용 예시</span>
            <span>Slide 12 / 16</span>
          </div>
        </section>

        {/* SECTION 13. 창업모델 C */}
        <section className={`rounded-3xl p-6 sm:p-12 ${cardBg} relative`}>
          <div className="flex items-center justify-between border-b border-neutral-200/20 pb-4 mb-8">
            <span className="text-xs font-black tracking-widest text-[#ffd500]">13 / FRANCHISE MODEL C</span>
            <span className="text-xs font-black text-slate-400">PREMIUM CAFE & BRUNCH</span>
          </div>

          <div className="my-auto py-2 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-5 space-y-4 text-left flex flex-col justify-between">
              <div>
                <span className={`text-xs font-black px-2.5 py-1 ${isPink ? "bg-rose-500/10 text-rose-455 border-rose-500/20" : "bg-amber-400/10 text-amber-600 border-amber-400/20"} border rounded-full`}>
                  모델 C: 15평 이상 프리미엄 카페
                </span>
                <h2 className={`text-xl sm:text-2xl md:text-3xl font-black leading-tight ${textTitle} mt-3`}>
                  브런치 라인업 강화,<br />
                  <span className={textHighlight}>고객 체류 시간</span>을 늘리는 프리미엄형
                </h2>
                <p className={`text-xs sm:text-sm leading-relaxed ${textDesc} mt-2`}>
                  넓은 홀 테이블을 통해 디저트뿐만 아니라 음료, 브런치 매출의 동반 성장을 이끄는 고수익 플래그십 매장입니다.
                </p>
              </div>
              
              <div className={`grid grid-cols-2 gap-3 text-xs font-bold ${textDesc}`}>
                {[
                  "단독 테이블 홀 좌석 확보",
                  "플레이팅 디저트 세트 공급",
                  "단체 세미나 및 주부 고객 유치",
                  "매장 랜드마크화 디자인"
                ].map((txt, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <CheckCircle2 size={12} className={isPink ? "text-rose-500" : "text-amber-500"} />
                    <span>{txt}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-3 relative group">
              <div className="relative rounded-2xl overflow-hidden border border-neutral-200/20 shadow-xl aspect-[4/5] bg-neutral-950 w-full h-full min-h-[220px]">
                <img 
                  src="https://res.cloudinary.com/dfarfqx7e/image/upload/v1781186418/ChatGPT_Image_2026%EB%85%84_5%EC%9B%94_28%EC%9D%BC_%EC%98%A4%ED%9B%84_01_47_46_fyk4ns_myousq.png" 
                  alt="Model C premium kitchen cafe interior mockup" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-transparent to-transparent flex items-end p-3">
                  <span className="text-[10px] font-bold text-white/95">프리미엄 세련된 주방 및 홀 구성</span>
                </div>
              </div>
            </div>

            <div className={`lg:col-span-4 p-6 rounded-2xl text-left flex flex-col justify-between ${innerCardBgAccent} ${innerCardHover}`}>
              <span className={`text-[10px] font-black ${textDesc} uppercase tracking-wider block`}>MODEL C BUDGET</span>
              <div className={`space-y-3 border-b ${isPink ? "border-neutral-805" : "border-amber-200/35"} pb-4 my-3`}>
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className={textDesc}>가맹 계약 및 교육</span>
                  <span className={`${textTitle} font-extrabold`}>300만 원</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className={textDesc}>인테리어 (15평 기준)</span>
                  <span className={`${textTitle} font-extrabold`}>2,200만 원</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className={textDesc}>기기 설비 및 집기</span>
                  <span className={`${textTitle} font-extrabold`}>1,100만 원</span>
                </div>
              </div>
              <div className="flex justify-between items-center font-black">
                <span className={`text-xs ${textTitle}`}>예상 창업 비용</span>
                <span className={`text-base ${isPink ? "text-rose-500" : "text-amber-500"}`}>3,600만 원 대</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center border-t border-neutral-200/20 pt-6 mt-8 text-[11px] sm:text-xs font-bold text-slate-500">
            <span>* 15평형 표준 플래그십 매장 개설 견적 가이드 기준</span>
            <span>Slide 13 / 16</span>
          </div>
        </section>

        {/* SECTION 14. 창업절차 */}
        <section className={`rounded-3xl p-6 sm:p-12 ${cardBg} relative`}>
          <div className="flex items-center justify-between border-b border-neutral-200/20 pb-4 mb-8">
            <span className="text-xs font-black tracking-widest text-[#ffd500]">14 / FRANCHISE PROCESS</span>
            <span className="text-xs font-black text-slate-400">7-STEP LAUNCH ROADMAP</span>
          </div>

          <div className="space-y-10">
            <div className="text-center md:text-left space-y-3">
              <h2 className="text-2xl sm:text-3xl font-black">
                체계적인 <span className={textHighlight}>7단계 개점 프로세스</span>
              </h2>
              <p className={`text-sm sm:text-base leading-relaxed ${textDesc}`}>
                상담 신청부터 최종 그랜드 오픈까지 본사 개점 전담팀이 밀착하여 케어합니다.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
              <div className="lg:col-span-8 relative">
                {/* Connecting Line */}
                <div className={`absolute left-6 top-4 bottom-4 w-0.5 ${isPink ? "bg-neutral-805" : "bg-amber-200/50"} z-0`}></div>
                <div className="space-y-4 relative z-10">
                  {[
                    { step: "01", name: "상담 신청", desc: "도입 형태 및 평수 진단", icon: <Info size={12} className={isPink ? "text-rose-500" : "text-amber-500"} /> },
                    { step: "02", name: "상권 분석", desc: "배달 및 타깃 분석", icon: <Search size={12} className={isPink ? "text-rose-500" : "text-amber-500"} /> },
                    { step: "03", name: "가맹 계약", desc: "세부 혜택 및 체결", icon: <FileText size={12} className={isPink ? "text-rose-500" : "text-amber-500"} /> },
                    { step: "04", name: "도면 설계", desc: "1인 동선 배치도 확정", icon: <Building2 size={12} className={isPink ? "text-rose-500" : "text-amber-500"} /> },
                    { step: "05", name: "기기 교육", desc: "1:1 레시피/조리 마스터", icon: <ChefHat size={12} className={isPink ? "text-rose-500" : "text-amber-500"} /> },
                    { step: "06", name: "오픈 리허설", desc: "최종 가동 테스트", icon: <Sliders size={12} className={isPink ? "text-rose-500" : "text-amber-500"} /> },
                    { step: "07", name: "그랜드 오픈", desc: "매출 활성화 마케팅", icon: <Sparkles size={12} className={isPink ? "text-rose-500" : "text-amber-500"} /> }
                  ].map((row, idx) => (
                    <div key={idx} className="flex items-center gap-4 hover:scale-[1.01] transition-transform duration-200">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black shrink-0 border transition-all duration-300 shadow-md ${isPink ? "bg-neutral-950 border-neutral-800 text-rose-500" : "bg-white border-amber-200/60 text-amber-600"}`}>
                        {row.step}
                      </div>
                      <div className={`flex-1 p-3.5 rounded-xl ${innerCardBg} ${innerCardHover} border ${isPink ? "border-neutral-850/60" : "border-amber-250/20"} flex items-center justify-between`}>
                        <div>
                          <h4 className={`text-xs sm:text-sm font-black ${textTitle}`}>{row.name}</h4>
                          <p className={`text-[10px] ${textDesc} leading-relaxed font-semibold mt-0.5`}>{row.desc}</p>
                        </div>
                        <div className={`p-1.5 rounded-lg ${isPink ? "bg-neutral-950/60" : "bg-amber-100/40"}`}>
                          {row.icon}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-4 relative group">
                <div className="relative rounded-2xl overflow-hidden border border-neutral-200/20 shadow-xl aspect-[4/6] bg-neutral-950 w-full h-full min-h-[350px]">
                  <img 
                    src="https://res.cloudinary.com/dfarfqx7e/image/upload/v1781186607/ChatGPT_Image_2026%EB%85%84_5%EC%9B%94_28%EC%9D%BC_%EC%98%A4%ED%9B%84_01_51_40_ahiniz_e6b27f.png" 
                    alt="Process marketing material" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-transparent to-transparent flex items-end p-4">
                    <span className="text-xs font-bold text-white/95">오픈 준비 전속 지원 패키징 및 POP 세트</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center border-t border-neutral-200/20 pt-6 mt-8 text-[11px] sm:text-xs font-bold text-slate-500">
            <span>* 상담부터 평균 개점 소요 기간: 샵인샵 7일, 신규창업 21일</span>
            <span>Slide 14 / 16</span>
          </div>
        </section>

        {/* SECTION 15. 도입 이유 (WHY PARTNER WITH US) */}
        <section className={`rounded-3xl p-6 sm:p-12 ${cardBg} relative`}>
          <div className="flex items-center justify-between border-b border-neutral-200/20 pb-4 mb-8">
            <span className="text-xs font-black tracking-widest text-[#ffd500]">15 / FRANCHISE VALUE</span>
            <span className="text-xs font-black text-slate-400">PARTNER BENEFITS SUMMARY</span>
          </div>

          <div className="space-y-10">
            <div className="text-center md:text-left space-y-3">
              <h2 className="text-2xl sm:text-3xl font-black">
                점주님들이 120pie를 <span className={textHighlight}>선택한 결정적인 이유</span>
              </h2>
              <p className={`text-sm sm:text-base leading-relaxed ${textDesc}`}>
                본사 수익보다 가맹점주님의 마진을 최우선으로 생각하는 브랜드 정책입니다.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
              <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { title: "로열티 0% 선언", desc: "매월 발생하는 매출 비례 가맹금이나 광고 분담금 일절 청구 없음", icon: <Percent size={16} /> },
                  { title: "가맹비 전액 환급 프로그램", desc: "일정 물량 소화 또는 매출 기준 달성 시 보증금처럼 환원", icon: <Award size={16} /> },
                  { title: "100% 완제품 생지 공급", desc: "반죽, 재료 손질 없이 오븐기 하나로 전문 베이커리 퀄리티 구현", icon: <ChefHat size={16} /> },
                  { title: "강력한 시즌 메뉴 호환", desc: "파이 머신 외에 계란빵 머신 무상 대여로 겨울철 추가 매출 확보", icon: <Sparkles size={16} /> }
                ].map((item, idx) => (
                  <div key={idx} className={`p-5 rounded-2xl ${innerCardBgAccent} border ${isPink ? "border-neutral-850" : "border-amber-250/20"} flex items-start gap-4 text-left h-[130px] ${innerCardHover}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isPink ? "bg-rose-500/10 text-rose-500" : "bg-amber-400/10 text-amber-600"}`}>
                      {item.icon}
                    </div>
                    <div>
                      <h4 className={`text-sm font-black ${textTitle}`}>{item.title}</h4>
                      <p className={`text-[11px] ${textDesc} leading-relaxed font-semibold mt-1`}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="lg:col-span-4 relative group">
                <div className="relative rounded-2xl overflow-hidden border border-neutral-200/20 shadow-xl aspect-[4/5] bg-neutral-950">
                  <img 
                    src="https://res.cloudinary.com/dfarfqx7e/image/upload/v1781186632/EGG120_%EB%8F%99%EB%AC%BC%EB%B3%B5%EC%A7%80_%ED%8C%9D%EC%97%85POPUP__240613_jqil66_dl8hjh.jpg" 
                    alt="Egg120 animal welfare pop-up" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-transparent to-transparent flex items-end p-4">
                    <span className="text-xs font-bold text-white/95">가맹 공급 재료 차별화: 친환경 동물복지 인증 계란</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center border-t border-neutral-200/20 pt-6 mt-8 text-[11px] sm:text-xs font-bold text-slate-500">
            <span>* 가맹 공정거래위원회 표준 약관 및 가맹 계약 내용 준수</span>
            <span>Slide 15 / 16</span>
          </div>
        </section>

        {/* SECTION 16. 뒷면 (Back Cover) */}
        <section className={`rounded-3xl p-6 sm:p-12 md:p-16 ${cardBg} flex flex-col justify-between min-h-[460px] relative overflow-hidden text-center`}>
          <div className="absolute inset-0 bg-gradient-to-tr from-amber-400/5 to-transparent pointer-events-none"></div>

          <div className="flex items-center justify-between border-b border-neutral-200/20 pb-6 mb-6">
            <span className="text-xs font-black tracking-widest text-slate-500">16 / BACK COVER</span>
            <span className={`text-xs font-bold ${isPink ? "text-rose-500" : "text-amber-600"} font-mono`}>120PIE & COFFEE</span>
          </div>

          <div className="my-auto py-10 space-y-6 max-w-2xl mx-auto">
            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-black leading-tight ${textTitle}`}>
              성공적인 창업의 시작,<br />
              <span className={textHighlight}>120pie & coffee</span>가 함께합니다.
            </h2>
            <p className={`text-xs sm:text-sm md:text-base leading-relaxed ${textDesc}`}>
              예비 가맹점주님의 기존 여건을 적극 존중하여 최저 비용으로 최대 효율을 뽑아내는 가이드를 약속드립니다. 지금 하단 상담 신청 폼에 연락처를 남겨주세요.
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-4">
              <button 
                type="button"
                onClick={handlePrintPage}
                className={`inline-flex items-center justify-center px-5 py-3 rounded-xl border font-extrabold text-sm cursor-pointer transition-all shadow-md ${isPink ? "bg-neutral-900 border-neutral-800 text-white hover:bg-neutral-800" : "bg-white border-amber-250/70 text-slate-700 hover:bg-amber-50/50"}`}
              >
                <FileText size={16} className={`mr-2 ${isPink ? "text-rose-500" : "text-amber-500"}`} /> 현재 제안서 PDF로 인쇄/저장
              </button>
              <a 
                href="#inquiry-form-section"
                className={`inline-flex items-center justify-center px-6 py-3 rounded-xl font-extrabold text-sm transition-all shadow-md ${isPink ? "bg-rose-500 text-white hover:bg-rose-600 shadow-rose-500/10" : "bg-amber-400 text-neutral-900 hover:bg-amber-300 shadow-amber-400/10"}`}
              >
                가맹 상담 신청서 작성하기
              </a>
            </div>
          </div>

          <div className="flex justify-between items-center border-t border-neutral-200/20 pt-6 mt-6 text-[11px] sm:text-xs font-bold text-slate-500">
            <span>© 2026 120pie & coffee Corp. All rights reserved.</span>
            <span>Slide 16 / 16</span>
          </div>
        </section>

        {/* BOTTOM INQUIRY FORM SECTION */}
        <section id="inquiry-form-section" className={`rounded-3xl p-6 sm:p-12 ${cardBg} border-2 ${isPink ? "border-rose-500/40" : "border-amber-400/40"} relative`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-400/10 to-transparent pointer-events-none rounded-tr-3xl"></div>
          
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center space-y-3">
              <span className={`text-[10px] font-black tracking-widest ${isPink ? "text-rose-500" : "text-amber-500"} uppercase block font-mono`}>B2B CONSULTATION</span>
              <h2 className={`text-2xl sm:text-3xl font-black ${textTitle}`}>실시간 가맹 & 샵인샵 도입 문의</h2>
              <p className={`text-xs sm:text-sm leading-relaxed ${textDesc}`}>
                상담 양식을 입력하시면, 주변 경쟁사 분석 및 3D 동선 배치도가 포함된 개별 상권 리포트를 무상 제공해 드립니다.
              </p>
            </div>

            {formSubmitted ? (
              <div className={`text-center p-8 ${innerCardBg} border ${isPink ? "border-neutral-805" : "border-amber-200/40"} rounded-2xl space-y-4`}>
                <div className="inline-flex w-12 h-12 bg-emerald-500/10 border border-emerald-500 text-emerald-500 rounded-full items-center justify-center">
                  <CheckCircle2 size={24} />
                </div>
                <div className="space-y-1">
                  <h4 className={`text-lg font-black ${textTitle}`}>가맹 및 상담 문의가 잘 접수되었습니다.</h4>
                  <p className={`text-xs sm:text-sm ${textDesc} font-semibold leading-relaxed`}>
                    작성해 주신 연락처로 상권 리포트 검토 후 전문 담당 실장이 24시간 내 유선 연락을 드리겠습니다.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFormSubmitted(false);
                    setFormData({ name: "", phone: "", storeType: "샵인샵 도입", existingStoreName: "", message: "" });
                  }}
                  className={`text-xs sm:text-sm ${isPink ? "text-rose-500" : "text-amber-500"} font-bold hover:underline cursor-pointer bg-transparent border-0`}
                >
                  [ 추가 상담 문의 작성하기 ]
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2 text-left">
                    <label className={`text-xs font-extrabold ${textDesc} block`}>성함 / 담당자</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="성함을 입력하세요"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className={`w-full ${inputBgClass} border rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none transition-colors`}
                    />
                  </div>
                  <div className="space-y-2 text-left">
                    <label className={`text-xs font-extrabold ${textDesc} block`}>연락처</label>
                    <input
                      type="tel"
                      name="phone"
                      maxLength={13}
                      placeholder="연락처를 입력하세요"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className={`w-full ${inputBgClass} border rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none transition-colors`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2 text-left">
                    <label className={`text-xs font-extrabold ${textDesc} block`}>창업 유형 선택</label>
                    <select
                      name="storeType"
                      value={formData.storeType}
                      onChange={handleInputChange}
                      className={`w-full ${inputBgClass} border rounded-xl px-3.5 py-3 text-xs sm:text-sm focus:outline-none transition-colors cursor-pointer font-bold`}
                    >
                      <option value="샵인샵 도입">기존 매장 샵인샵 도입</option>
                      <option value="신규 소자본 창업">소자본 카페 신규 창업</option>
                      <option value="프리미엄 가맹">프리미엄 브런치 매장 창업</option>
                      <option value="업종 변경 문의">타 업종 변경 가입</option>
                    </select>
                  </div>
                  <div className="space-y-2 text-left">
                    <label className={`text-xs font-extrabold ${textDesc} block`}>기존 매장명 (선택)</label>
                    <input
                      type="text"
                      name="existingStoreName"
                      placeholder="예: 120카페 강남점"
                      value={formData.existingStoreName}
                      onChange={handleInputChange}
                      className={`w-full ${inputBgClass} border rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none transition-colors`}
                    />
                  </div>
                </div>

                <div className="space-y-2 text-left">
                  <label className={`text-xs font-extrabold ${textDesc} block`}>상담 문의 상세 (선택)</label>
                  <textarea
                    name="message"
                    rows={4}
                    placeholder="매장의 평수나 가동 시간대, 전기 설비 등 궁금하신 내용을 편하게 기술해 주세요."
                    value={formData.message}
                    onChange={handleInputChange}
                    className={`w-full ${inputBgClass} border rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none transition-colors resize-none`}
                  />
                </div>

                <div className="flex items-start text-left gap-2 py-1 select-none">
                  <input
                    type="checkbox"
                    id="agreement"
                    required
                    defaultChecked
                    className={`mt-0.5 ${isPink ? "accent-rose-500" : "accent-amber-500"} w-4 h-4 rounded cursor-pointer`}
                  />
                  <label htmlFor="agreement" className={`text-[10px] sm:text-xs font-bold ${textDesc} cursor-pointer`}>
                    상담 안내를 위한 가맹본사의 개인정보 수집 및 상담 연락에 동의합니다. (필수)
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full font-black text-sm sm:text-base py-4 rounded-xl hover:scale-[1.01] active:scale-[0.99] transition-all shadow-md border-0 cursor-pointer ${isPink ? "bg-rose-500 text-white hover:bg-rose-600 shadow-rose-500/15" : "bg-amber-400 text-neutral-900 hover:bg-amber-300 shadow-amber-400/15"}`}
                >
                  {isSubmitting ? "문의 등록 처리 중..." : "VIP 맞춤 창업 상담 접수 완료"}
                </button>
              </form>
            )}
          </div>
        </section>

      </main>

      <FloatingAndInquiry isPink={isPink} />
      <Footer theme={isPink ? "black" : "yellow"} />
    </div>
  );
}
