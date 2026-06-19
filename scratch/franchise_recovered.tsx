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
import { api } from "@/convex/_generated/api";

const logoUrlBlack = "https://res.cloudinary.com/dx7l09wwu/image/upload/v1780326442/logo_120pie_coffee_nu2_c7tiiy.png";

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
    title: "기존 카페 ?�인???�입 (A 매장)",
    badge: "?�인???�공 모델",
    stats: "?�평�?매출 45�????�승",
    desc: "기존???�?��? ?�료 ?�주�??�영?�던 ?�?��? 개인 카페?�?�나, 120�??�이 ?�입 ???�트 주문????��?�으�??�어??객단가?� 마진???�시???�았?�니??",
    points: [
      "기존 커피 기기 �??�선 100% 그�?�??�용",
      "?�료?� ?��????�반 주문??68% 기록",
      "?�입 2�?만에 배달???��???카테고리 ??�� 진입"
    ]
  },
  {
    title: "1???�자�??�종변�?창업 (B 매장)",
    badge: "?�자�??�규 창업",
    stats: "6개월 만에 창업 비용 ?�수",
    desc: "기존 ?�랜차이�?치킨집을 ?�영?�다 과도???�동 강도?� 로열?�로 고�??�던 �? 1???�영??가?�한 120pie 콤팩??카페 모델�??�환??고수?�을 ?�성?�습?�다.",
    points: [
      "?�건�??�로, ?�주 1???�영 최적???�스??,
      "복잡???�료 ?�질 ?�는 본사 콜드체인 ?��? 공급",
      "?�크?�??3�?조리�??�이�??�전??3�?증�?"
    ]
  },
  {
    title: "배달 & ?�장 ?�화 매장 (C 매장)",
    badge: "배달/?�장 ?�화 모델",
    stats: "?�트 주문 ?��? 2.2�????�성",
    desc: "?�형 주거 밀�??�권???�점?�여 배달�??�이?�아???�주�?가?�하???�속??매장?�니?? ?�체 간식 주문�??��?�????�장 고객 비중??매우 ?�습?�다.",
    points: [
      "?�원가, ?�린?�집 ?�체 간식 주문 ?�평�?15???�수",
      "?�키�??�자??차별?�로 ?�물???�이?�아???�요 견인",
      "배달?��?�?맛집 ??�� ?�위�??��?�??�시 매출 ?�보"
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
    storeType: "?�인???�입",
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
      alert("?�함�??�락처�? ?�력??주세??");
      return;
    }

    setIsSubmitting(true);
    try {
      await addInquiry({
        name: formData.name,
        phone: formData.phone,
        storeType: formData.storeType,
        existingStoreName: formData.existingStoreName || "",
        message: formData.message || "창업 ?�내 ?�이지�??�한 ?�담 ?�청",
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
            <Link className="flex items-center group shrink-0" href={backUrl} aria-label="120pie ?�으�??�동">
              <img
                src={logoUrl}
                alt="120pie & coffee"
                className="h-5 sm:h-7 lg:h-8 w-auto object-contain group-hover:scale-102 transition-all duration-200"
              />
            </Link>
          </div>

          <nav className={`hidden lg:flex items-center gap-2.5 xl:gap-4 text-[10px] xl:text-[13px] font-bold shrink-0 ${navLinkTextClass}`}>
            <Link href={`${backUrl}#menu`} className="hover:text-amber-400 transition-colors">메뉴 카탈로그</Link>
            <Link href={`/stores?theme=${theme}`} className="hover:text-amber-400 transition-colors">가맹점 ?�황</Link>
            <Link href={`/costs?theme=${theme}`} className="hover:text-amber-400 transition-colors">?�인???�내</Link>
            <Link href={`/franchise?theme=${theme}`} className={`hover:scale-105 transition-transform shrink-0 ${
              isPink 
                ? "text-rose-500 hover:text-rose-600 font-extrabold" 
                : "text-[#ffd500] hover:text-[#e6bd00] font-extrabold"
            }`}>
              창업 ?�내
            </Link>
            <Link href={`${backUrl}#faq`} className="hover:text-amber-400 transition-colors">FAQ</Link>
          </nav>

          <div className="flex items-center gap-2.5">
            <div className={`flex items-center rounded-full border p-0.5 text-[10px] font-black ${switcherWrapperClass}`}>
              <a
                onClick={() => handleThemeChange("yellow")}
                className={`rounded-full px-2.5 py-1 transition-colors cursor-pointer select-none focus:outline-none focus:ring-0 outline-none ${switcherBtnYellowClass}`}
              >
                ?�로
              </a>
              <a
                onClick={() => handleThemeChange("pink")}
                className={`rounded-full px-2.5 py-1 transition-colors cursor-pointer select-none focus:outline-none focus:ring-0 outline-none ${switcherBtnBlackClass}`}
              >
                블랙
              </a>
            </div>
            <Link className={`hidden sm:inline-flex items-center justify-center px-4 py-2.5 rounded-lg border text-xs font-bold focus:outline-none focus:ring-0 outline-none ${portalBtnClass}`} href="/portal" target="_blank" rel="noopener noreferrer">
              ?�주?�용
            </Link>
            <a href="#inquiry-form-section" className={`pink-primary-button hidden sm:inline-flex items-center justify-center px-5 py-2.5 rounded-lg text-xs sm:text-sm font-black hover:scale-[1.02] transition-all border-0 cursor-pointer ${
              isPink 
                ? "bg-rose-500 hover:bg-rose-600 text-white shadow-[0_4px_16px_rgba(244,63,94,0.2)]" 
                : "bg-amber-400 hover:bg-amber-300 text-neutral-950 shadow-[0_4px_16px_rgba(251,191,36,0.2)]"
            }`}>
              ?�담 ?�청 <ArrowRight size={14} className="ml-1.5 shrink-0" />
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
                메뉴 카탈로그
              </Link>
              <Link href={`/stores?theme=${theme}`} onClick={() => setMobileNavOpen(false)} className={`rounded-xl px-4 py-3 transition-colors ${mobileNavLinkClass}`}>
                가맹점 ?�황
              </Link>
              <Link href={`/costs?theme=${theme}`} onClick={() => setMobileNavOpen(false)} className={`rounded-xl px-4 py-3 transition-colors ${mobileNavLinkClass}`}>
                ?�인???�내
              </Link>
              <Link href={`/franchise?theme=${theme}`} onClick={() => setMobileNavOpen(false)} className={`rounded-xl px-4 py-3 transition-colors font-extrabold ${
                isPink 
                  ? "text-rose-500 bg-rose-500/10 border border-rose-500/20" 
                  : "text-[#ffd500] bg-[#ffd500]/10 border border-[#ffd500]/20"
              }`}>
                창업 ?�내
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
              ?�담 ?�청 <ArrowRight size={15} className="ml-1.5" />
            </a>
          </nav>
        )}
      </header>

      {/* Main Content (16 Slides as Sections) */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-24 sm:space-y-36">
        
        {/* SECTION 1. ?��? (Cover) */}
        <section className={`rounded-3xl p-6 sm:p-12 md:p-16 ${cardBg} flex flex-col justify-between min-h-[500px] relative overflow-hidden`}>
          {/* Accent decoration */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-[#ffd500]/10 to-transparent rounded-bl-full pointer-events-none"></div>
          
          <div className="flex items-center justify-between border-b border-neutral-200/20 pb-6 mb-6">
            <span className={`text-xs font-black tracking-widest ${isPink ? "text-neutral-450" : "text-[#0d233a]/80"}`}>120PIE & COFFEE</span>
            <span className="text-xs font-extrabold px-3 py-1 bg-amber-400 text-[#0d233a] border border-[#0d233a]/10 rounded-full shadow-sm">
              가�?창업 ?�안
            </span>
          </div>

          <div className="my-auto py-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6 text-left">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
                지�?매장??br />
                <span className={textHighlight}>?��???매출</span>???�하??br />
                가???�실???�루??              </h1>
              <p className={`text-sm sm:text-base md:text-lg leading-relaxed ${textDesc}`}>
                40???�인?�신?�로 빚어??120�??�이?� 계�?�?머신 공급까�?.<br />
                ?�테리어 부???�이 ?�자�??�인???�입?�로 ?�정?�인 추�? 매출??창출?�세??
              </p>
              
              <div className="flex flex-wrap gap-3 pt-2">
                <a 
                  href="/120pie_franchise_proposal.pdf" 
                  download="120pie_가맹창?�제?�서.pdf"
                  className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-amber-400 text-[#0d233a] hover:bg-amber-300 font-extrabold text-sm transition-all shadow-md shadow-[#ffd500]/10"
                >
                  <Download size={16} className="mr-2" /> ?�안??PDF ?�운로드
                </a>
                <a 
                  href="#inquiry-form-section" 
                  className={`inline-flex items-center justify-center px-5 py-3 rounded-xl border font-extrabold text-sm transition-all ${
                    isPink 
                      ? "border-neutral-700 bg-neutral-900 text-white hover:bg-neutral-800" 
                      : "border-[#e6dfc3] bg-white text-[#0d233a] hover:bg-[#fffdf4]"
                  }`}
                >
                  무료 창업?�담 문의
                </a>
              </div>
            </div>

            <div className="lg:col-span-5 relative group">
              <div className="relative rounded-2xl overflow-hidden border border-neutral-200/20 shadow-xl aspect-[4/3] bg-neutral-950">
                <img 
                  src="https://res.cloudinary.com/dx7l09wwu/image/upload/v1779945185/120%EA%B2%B9%ED%8C%8C%EC%9D%B4_%EC%97%B0%EC%B6%9C1_ueicna.jpg" 
                  alt="120pie signature dessert" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-transparent to-transparent flex items-end p-4">
                  <span className="text-xs font-bold text-white/95">?�??메뉴: 120�??�리지???�플?�이</span>
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
                    ??<span className={textHighlight}>120�??�이</span>�??�택?�야 ?�까??
                  </h2>
                  <p className={`text-sm sm:text-base leading-relaxed ${textDesc}`}>
                    40???�과 ?�인??비법 ?��??� ?�계 최초 300?�점 ?�파???�장 ?�화�?검증된 ?�워 브랜?�입?�다.
                  </p>
                </div>

                {/* Growth Graph */}
                <div className={`p-5 rounded-2xl ${innerCardBg} space-y-4`}>
                  <h4 className={`text-xs sm:text-sm font-black text-center md:text-left flex items-center gap-1.5 ${textTitle}`}>
                    <TrendingUp size={16} className={isPink ? "text-rose-500" : "text-amber-500"} /> 3???�속 가�??�장 지??(?�적 계약 기�?)
                  </h4>
                  <div className="space-y-3 pt-2">
                    {[
                      { year: "1?�차 (?�칭�?", count: "10?�점", width: "w-[15%]", bg: "bg-slate-400" },
                      { year: "2?�차 (?�장�?", count: "70?�점", width: "w-[40%]", bg: isPink ? "bg-rose-500/70" : "bg-amber-400/70" },
                      { year: "3?�차 (?�재)", count: "300?�점 ?�파", width: "w-full", bg: isPink ? "bg-rose-500" : "bg-amber-400" }
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
                    src="https://res.cloudinary.com/dx7l09wwu/image/upload/v1779945186/4b7d41db63592_wyo4r0.webp" 
                    alt="Artisan rolling pastry dough" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-transparent to-transparent flex items-end p-4">
                    <span className="text-xs font-bold text-white/95">40???�과 ?�인??120�??��? ?�우 ?�형 공정</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: "?�이�?검?�량", val: "??61,500??", desc: "?�워??쿼리 검?�량 ?�도??1??, icon: <Search size={22} className={isPink ? "text-rose-500" : "text-amber-400"} /> },
                { title: "SNS ?�시?�그", val: "?�적 19.3만개+", desc: "#120겹파???�발???�소�??�산", icon: <Hash size={22} className={isPink ? "text-rose-500" : "text-amber-400"} /> },
                { title: "브랜???��???, val: "?�형 ?��???1??, desc: "고객 ?�호??조사 결과 검�?, icon: <Award size={22} className={isPink ? "text-rose-500" : "text-amber-400"} /> }
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
            <span>* ?�털 ?�렌??�?본사 가�?계약??집계 기�?</span>
            <span>Slide 02 / 16</span>
          </div>
        </section>

        {/* SECTION 3. 6WAY 매출 ?�략 */}
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
                    ?�각?�된 <span className={textHighlight}>6WAY 매출 ?�략</span>
                  </h2>
                  <p className={`text-sm sm:text-base leading-relaxed ${textDesc}`}>
                    ?�권�?계절??관계없???�시 고효???�익 구조�?만들?�냅?�다.
                  </p>
                </div>

                {/* Channels Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[
                    { title: "01. 매장 ???�", desc: "커피?� ?�트 매출 극�???, icon: <Store size={16} className="text-amber-400" /> },
                    { title: "02. ?�장 (?�이?�아??", desc: "1???? ?��?�???간편 ?�도", icon: <ShoppingBag size={16} className="text-amber-400" /> },
                    { title: "03. 배달 (?�리버리)", desc: "배달???��????�유???�장", icon: <Truck size={16} className="text-amber-400" /> },
                    { title: "04. B2B ?��? ?�품", desc: "주�? 매장 물량 ?�매 ?�품", icon: <Layers size={16} className="text-amber-400" /> },
                    { title: "05. ?�체 주문 ?�치", desc: "?�교·?�사·?�호???�??간식", icon: <Users size={16} className="text-amber-400" /> },
                    { title: "06. ?�체 ?�즌 메뉴", desc: "계�?빵·츄?�스 계절�??�인??, icon: <Sparkles size={16} className="text-amber-400" /> }
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
                <div className="relative rounded-2xl overflow-hidden border border-neutral-200/20 shadow-xl aspect-[4/3] bg-neutral-950">
                  <img 
                    src="https://res.cloudinary.com/dx7l09wwu/image/upload/v1779945187/IMG_8185_jpquaf.jpg" 
                    alt="6WAY packaging box" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-transparent to-transparent flex items-end p-4">
                    <span className="text-xs font-bold text-white/95">?�장 �?배달 경쟁?�을 ?�이??브랜???�용 ?�키�?박스</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Time-of-day timeline */}
            <div className={`p-6 rounded-2xl ${innerCardBg} space-y-6`}>
              <h4 className={`text-sm font-bold text-center md:text-left flex items-center gap-2 ${textTitle}`}>
                <Clock size={16} className={isPink ? "text-rose-500" : "text-amber-500"} /> 공백 ?�는 24?�간 ?�?�라?�별 최적 ?�요
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-left">
                {[
                  { time: "08:00 - 11:00", label: "?�침 ?�교/출근�?, menu: "?�끈???� 계�?�?& 커피", icon: <Sun size={14} className="text-amber-400" /> },
                  { time: "11:30 - 14:00", label: "?�심 ?�후 ?��???, menu: "120�??�플?�이 & ?�메리카??, icon: <Coffee size={14} className="text-amber-400" /> },
                  { time: "14:30 - 17:00", label: "?�후 간식 ?�??, menu: "?�레??츄러??& ?�린??간식", icon: <Sparkles size={14} className="text-amber-400" /> },
                  { time: "17:30 - 21:00", label: "?�???�근 �??�식", menu: "매콤??불닭?�이 ?��?�???, icon: <Moon size={14} className="text-amber-400" /> }
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
            <span>* ?�시 ?�매 채널 가??�?가맹점 ?�균 ?�간?� 매출 분석 기�?</span>
            <span>Slide 03 / 16</span>
          </div>
        </section>

        {/* SECTION 4. 간편 조리 ?�스??(?�퍼?�이?? */}
        <section className={`rounded-3xl p-6 sm:p-12 ${cardBg} relative`}>
          <div className="flex items-center justify-between border-b border-neutral-200/20 pb-4 mb-8">
            <span className="text-xs font-black tracking-widest text-[#ffd500]">04 / OPERATION SYSTEM</span>
            <span className="text-xs font-black text-slate-400">EASY COOKING PROCESS</span>
          </div>

          <div className="space-y-10">
            <div className="text-center md:text-left space-y-3">
              <h2 className="text-2xl sm:text-3xl font-black">
                ?�문 주방???�는 <span className={textHighlight}>극강??조리 ?�율??/span>
              </h2>
              <p className={`text-sm sm:text-base leading-relaxed ${textDesc}`}>
                본사?�서 100% 가�??��?�??�벽 콜드체인 공급?�여 매장?�서???�븐??굽기�??�면 ?�성?�니??
              </p>
            </div>

            {/* Steps Flowchart */}
            <div className="relative">
              <div className={`hidden sm:block absolute top-1/2 left-4 right-4 h-0.5 ${isPink ? "bg-neutral-800/80" : "bg-[#e6dfc3]"} -translate-y-1/2 z-0`}></div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 text-center relative z-10">
                {[
                  { step: "STEP 01", title: "?��? 공급", desc: "본사 �?3???�선 ?�동 물류 직배??, icon: <Truck size={20} className="text-amber-400" /> },
                  { step: "STEP 02", title: "?�동 보�?", desc: "?�동 과정 ?�이 즉시 보�? 가??, icon: <Warehouse size={20} className="text-amber-400" /> },
                  { step: "STEP 03", title: "3�?베이??, desc: "?�븐기에 ?�고 ?�?�머 ?�팅 ?�료", icon: <ChefHat size={20} className="text-amber-400" /> },
                  { step: "STEP 04", title: "즉시 ?�공", desc: "바삭?�이 ?�아?�는 120�??�이 ?�성", icon: <ShoppingBag size={20} className="text-amber-400" /> }
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
                  <Sliders size={20} className="text-amber-400" /> 초소??주방 ?�화 ?�프??                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-400 font-semibold">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 mt-0.5">??/span>
                    <span>1.5??초소??주방 공간만으로도 ?�선 배치 �?기기 구동 가??/span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 mt-0.5">??/span>
                    <span>가??배�? ?�비, ?�트 공사 ??불필?�한 고비??가?�시??불필??/span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 mt-0.5">??/span>
                    <span>100% ?�기 베이??기기 ?�용?�로 조리 ?�기, ?�새, ?�기 최소??/span>
                  </li>
                </ul>
              </div>
              <div className="rounded-xl overflow-hidden aspect-[16/10] bg-neutral-900 border border-neutral-800 relative group">
                <img 
                  src="https://res.cloudinary.com/dx7l09wwu/image/upload/v1779945602/KakaoTalk_20250819_162905131_zkmre3.jpg" 
                  alt="Dough and baking process" 
                  className="w-full h-full object-cover opacity-80 group-hover:scale-102 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-transparent to-transparent flex items-end p-4">
                  <span className="text-xs font-bold text-white/95">가맹점 ?�제 주방 조리 공간 �??�그�??�조 모습</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center border-t border-neutral-200/20 pt-6 mt-8 text-[11px] sm:text-xs font-bold text-slate-500">
            <span>* 가�?본사 직영 ?�산 �?물류 공급 ?�로?�스 기�?</span>
            <span>Slide 04 / 16</span>
          </div>
        </section>

        {/* SECTION 5. ?�면 ?�이?�웃 (공간 ?�계) */}
        <section className={`rounded-3xl p-6 sm:p-12 ${cardBg} relative`}>
          <div className="flex items-center justify-between border-b border-neutral-200/20 pb-4 mb-8">
            <span className="text-xs font-black tracking-widest text-[#ffd500]">05 / SPACE DESIGN</span>
            <span className="text-xs font-black text-slate-400">FLOOR LAYOUT PLANS</span>
          </div>

          <div className="space-y-10">
            <div className="text-center md:text-left space-y-3">
              <h2 className="text-2xl sm:text-3xl font-black">
                ?�수�?맞춤??<span className={textHighlight}>공간 ?�면 ?�계</span>
              </h2>
              <p className={`text-sm sm:text-base leading-relaxed ${textDesc}`}>
                ?�선??비약?�으�??�축?�켜 1??근무 ?�율??극�??�한 ?�속??배치?�입?�다.
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
                8?�형 콤팩???�이?�웃
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
                10?�형 ?�?�키지 ?�이?�웃
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
                    ? "?�이?�아??�?배달 ?�주 1??카페???�석" 
                    : "?�이�??� 매출�??�장 배달??모두 ?�용?�는 구성"
                  }
                </h4>
                <p className={`text-xs sm:text-sm ${textDesc} font-semibold leading-relaxed`}>
                  {selectedPlanTab === "8py" 
                    ? "카운???�면???�용 ?��??�스�?밀�?배치?�고, ?�벽???�이 머신�??�그�?머신??1??구조�?직렬?�하?????�리?�서 주문 ?�수, 조리, ?�팅, 고객 ?�달까�? ?�동 거리 1.5m ?�내�??�선???�계?�습?�다." 
                    : "?�이�?3~4조�? ?�정?�으�?구획?�면?? ?�이?�아???�로?� 배달 기사 ?�업 존을 ?�립 분리?�켰?�니?? 주방 ?��??�는 초소??츄러???�김�?공간까�? 추�?�??�보 가?�한 가?�성???�보?�는 ?�면?�니??"
                  }
                </p>
                <div className="grid grid-cols-2 gap-4 text-xs font-bold pt-2">
                  <div className={`p-3 rounded-lg border text-center ${isPink ? "bg-neutral-950/50 border-neutral-850" : "bg-amber-400/5 border-amber-200/40"}`}>
                    <span className={`${textDesc} block mb-1`}>?�요 주방 ?�수</span>
                    <span className={`text-sm font-black ${textTitle}`}>{selectedPlanTab === "8py" ? "1.5???�외" : "2.0???�외"}</span>
                  </div>
                  <div className={`p-3 rounded-lg border text-center ${isPink ? "bg-neutral-950/50 border-neutral-850" : "bg-amber-400/5 border-amber-200/40"}`}>
                    <span className={`${textDesc} block mb-1`}>권장 ?�영 ?�원</span>
                    <span className={`text-sm font-black ${textTitle}`}>{selectedPlanTab === "8py" ? "?�주 1??가?? : "1??~ 1.5??}</span>
                  </div>
                </div>
              </div>
              <div className="md:col-span-5 rounded-xl overflow-hidden bg-neutral-955 aspect-square border border-neutral-850/20 relative group">
                <img 
                  src={selectedPlanTab === "8py" 
                    ? "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779945186/ChatGPT_Image_2026%EB%85%84_5%EC%9B%94_28%EC%9D%BC_%EC%98%A4%ED%9B%84_01_47_46_fyk4ns.png"
                    : "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779945604/ChatGPT_Image_2026%EB%85%84_5%EC%9B%94_28%EC%9D%BC_%EC%98%A4%ED%9B%84_02_00_48_qomspv.png"
                  } 
                  alt="Floor plan spatial layout" 
                  className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-550"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent flex flex-col justify-end p-4">
                  <span className="text-[10px] font-black text-amber-400 block uppercase tracking-wider">Interior Concept Mockup</span>
                  <span className="text-xs font-bold text-white/95 mt-0.5">
                    {selectedPlanTab === "8py" ? "8??매장 ?��? ?�테리어 ?�이?�웃" : "10??매장 ?�경 �??�일?�드 ?�선 배치"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center border-t border-neutral-200/20 pt-6 mt-8 text-[11px] sm:text-xs font-bold text-slate-500">
            <span>* 가�?개설 본사 ?�테리어 ?�업부 기술 ?�안 �?공간 구성 기�?</span>
            <span>Slide 05 / 16</span>
          </div>
        </section>

        {/* SECTION 6. ?��? ?�테리어 */}
        /* SECTION 7. ?�공?��? */
        <section className={`rounded-3xl p-6 sm:p-12 ${cardBg} relative`}>
          <div className="flex items-center justify-between border-b border-neutral-200/20 pb-4 mb-8">
            <span className="text-xs font-black tracking-widest text-[#ffd500]">07 / SUCCESS CASES</span>
            <span className="text-xs font-black text-slate-400">REAL PARTNERSHIP RESULTS</span>
          </div>

          <div className="space-y-10">
            <div className="text-center md:text-left space-y-3">
              <h2 className="text-2xl sm:text-3xl font-black">
                가맹점주님??증명?�는 <span className={textHighlight}>?�제 가�??�공?��?</span>
              </h2>
              <p className={`text-sm sm:text-base leading-relaxed ${textDesc}`}>
                기존 매장???�프?��? 120pie???�품?�이 결합?�어 극적??매출 반등???�뤄???�주?�들???�생???�기?�니??
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
                    src="https://res.cloudinary.com/dx7l09wwu/image/upload/v1779945185/2026-05-28_13_37_40_sbppa6.png" 
                    alt="Success advertising banner mockup" 
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent flex flex-col justify-end p-4">
                    <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider">Marketing Assets</span>
                    <span className="text-xs font-bold text-white/95 mt-0.5">매출 부?�팅 ?�단 �?모바??광고 ?�보 ?�각 ?�안</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center border-t border-neutral-200/20 pt-6 mt-8 text-[11px] sm:text-xs font-bold text-slate-500">
            <span>* 가맹점 POS ?�이??�??�권 분석 ?�산 ?�료 기�?</span>
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
                  ?�탄??경쟁?�의<br />
                  <span className={textHighlight}>차별?�된 메뉴 구성</span>
                </h2>
                <p className={`text-xs sm:text-sm leading-relaxed ${textDesc} max-w-xl`}>
                  ?�권�?고객층에 맞춰 ?�너지�??????�는 ?�채로운 ?�이?�드 ?��????�인?�을 갖추�??�습?�다.
                </p>
              </div>

              <div className="lg:col-span-5 space-y-3">
                {[
                  { title: "?��????�양??, desc: "계절감과 ?�렌?��? 반영???�채로운 ?�이?�드 메뉴" },
                  { title: "?�사 ?�???�장", desc: "?�든???�이??메뉴�??�사 ?�요까�? ?�수" },
                  { title: "?�료?�??궁합", desc: "?��??��? ?�울리는 ?�양???�료 ?�인???�공" }
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
                  title: "120겹파???�리�?,
                  points: [
                    "?�림치즈 / 커스?�드",
                    "고구�?/ 블루베리",
                    "?�박치즈 / 망고 / ?�플",
                    "?�임?�크�?/ 직화불고�?/ 직화불닭"
                  ],
                  img: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779945185/120%EA%B2%B9%ED%8C%8C%EC%9D%B4_%EC%97%B0%EC%B6%9C1_ueicna.jpg"
                },
                {
                  title: "?�그 120",
                  points: [
                    "?�리지??/ 베이�?,
                    "콘버??/ 커스?�드",
                    "?�팥 / ?�모�?,
                    "로제미트 / ?�크�?
                  ],
                  img: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779945603/2026-05-28_13_49_08_j9unkq.png"
                },
                {
                  title: "츄러??120",
                  points: [
                    "?�리지??/ ?��?",
                    "?�레??/ ?�차"
                  ],
                  img: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779759362/IMG_0015_6_3_au1ykg.jpg"
                },
                {
                  title: "?�이??& ?�료",
                  points: [
                    "�?�� / 로제 / 짜장 ?�볶??,
                    "직화 불고�??�도�?,
                    "커피 / ?�이??/ ?�무??/ 뱅쇼 ??
                  ],
                  img: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779762930/%EC%A7%81%ED%99%94%EB%B6%88%EA%B3%A0%EA%B8%B0_khx8qf.jpg"
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
            <span>* 120pie & coffee ?�체 ?�품 가�?공급 ?�목 리스??기�?</span>
            <span>Slide 08 / 16</span>
          </div>
        </section>
        {/* SECTION 9. ?��? 메뉴구성 */}
        <section className={`rounded-3xl p-6 sm:p-12 ${cardBg} relative`}>
          <div className="flex items-center justify-between border-b border-neutral-200/20 pb-4 mb-8">
            <span className="text-xs font-black tracking-widest text-[#ffd500]">09 / DETAILED MENU</span>
            <span className="text-xs font-black text-slate-400">FLAVOR PROFILES</span>
          </div>

          <div className="space-y-10">
            <div className="text-center md:text-left space-y-3">
              <h2 className="text-2xl sm:text-3xl font-black">
                가맹점 ?�입 가??<span className={textHighlight}>?��? 메뉴 구성</span>
              </h2>
              <p className={`text-sm sm:text-base leading-relaxed ${textDesc}`}>
                카테고리�???�� ?�릭?�여 120pie & coffee??모든 ?��? 출시 메뉴?�을 ?�인??보세??
              </p>
            </div>

            {/* Tabs Navigation */}
            <div className="flex flex-wrap justify-center gap-2 mb-8 select-none">
              {[
                { key: "pie", label: "120�??�이 ?�리�?, emoji: "?��" },
                { key: "egg", label: "?�그 120 ?�리�?, emoji: "?��" },
                { key: "churros", label: "츄러??120 ?�리�?, emoji: "?��" },
                { key: "side", label: "?�볶??& ?�도�?, emoji: "?��" },
                { key: "drink", label: "커피 & ?�료", emoji: "?? }
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
                    "꿀?�떡 ?�이", "?�페로니?�자 ?�이", "로제미트 ?�이", "?�치�??�이",
                    "?�플 ?�이", "불고�??�이", "불닭 ?�이", "?�림치즈 ?�이",
                    "망고 ?�이", "콘치�??�이", "커스?�드 ?�이", "블루베리 ?�이"
                  ].map((name, idx) => (
                    <div key={idx} className="group flex flex-col items-center">
                      <div className={`w-full aspect-square rounded-2xl border-2 border-dashed ${isPink ? "border-neutral-800 bg-neutral-900/30 text-rose-500/20" : "border-amber-200/60 bg-amber-50/20 text-amber-500/30"} flex flex-col items-center justify-center relative group-hover:border-amber-400 transition-all duration-300`}>
                        <span className="text-2xl opacity-60">?��</span>
                        <span className="text-[8px] font-black uppercase tracking-wider mt-1.5 opacity-50">IMAGE AREA</span>
                      </div>
                      <span className={`text-xs sm:text-sm font-black ${textTitle} text-center mt-2 px-1 block truncate w-full`}>{name}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeMenuTab === "egg" && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
                  {[
                    "?�리지??계�?�?, "베이�?계�?�?, "커스?�드 계�?�?, "콘치�?계�?�?,
                    "로제미트 계�?�?, "?�모�?계�?�?, "?�크�?계�?�?, "??계�?�?
                  ].map((name, idx) => (
                    <div key={idx} className="group flex flex-col items-center">
                      <div className={`w-full aspect-square rounded-2xl border-2 border-dashed ${isPink ? "border-neutral-800 bg-neutral-900/30 text-rose-500/20" : "border-amber-200/60 bg-amber-50/20 text-amber-500/30"} flex flex-col items-center justify-center relative group-hover:border-amber-400 transition-all duration-300`}>
                        <span className="text-2xl opacity-60">?��</span>
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
                    "?�리지??츄러??, "?��? 츄러??, "?�레??츄러??, "?�차 츄러??
                  ].map((name, idx) => (
                    <div key={idx} className="group flex flex-col items-center">
                      <div className={`w-full aspect-square rounded-2xl border-2 border-dashed ${isPink ? "border-neutral-800 bg-neutral-900/30 text-rose-500/20" : "border-amber-200/60 bg-amber-50/20 text-amber-500/30"} flex flex-col items-center justify-center relative group-hover:border-amber-400 transition-all duration-300`}>
                        <span className="text-2xl opacity-60">?��</span>
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
                    "�?�� ?�볶??, "로제 ?�볶??, "짜장 ?�볶??, "직화불고�??�도�?
                  ].map((name, idx) => (
                    <div key={idx} className="group flex flex-col items-center">
                      <div className={`w-full aspect-square rounded-2xl border-2 border-dashed ${isPink ? "border-neutral-800 bg-neutral-900/30 text-rose-500/20" : "border-amber-200/60 bg-amber-50/20 text-amber-500/30"} flex flex-col items-center justify-center relative group-hover:border-amber-400 transition-all duration-300`}>
                        <span className="text-2xl opacity-60">?��</span>
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
                    "?�메리카??, "카페?�떼", "바닐?�라??, "콜드브루", "?�당?�떼", "?�기?�떼", "?�차?�떼",
                    "?�거?�스무디", "캐모마일??, "?�비?�커?�티", "?�퍼민트??, "밀?�티", "?�이?�티", "뱅쇼",
                    "밀?�쉐?�크", "?�기?�이??, "쿠앤?�쉐?�크", "초코?�이??, "?�기주스", "망고주스", "블루베리주스"
                  ].map((name, idx) => (
                    <div key={idx} className="group flex flex-col items-center">
                      <div className={`w-full aspect-square rounded-2xl border-2 border-dashed ${isPink ? "border-neutral-800 bg-neutral-900/30 text-rose-500/20" : "border-amber-200/60 bg-amber-50/20 text-amber-500/30"} flex flex-col items-center justify-center relative group-hover:border-amber-400 transition-all duration-300`}>
                        <span className="text-2xl opacity-60">??/span>
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
            <span>* 본사 ?�그?�처 카테고리 ?�체 메뉴 구성 리스??기�?</span>
            <span>Slide 09 / 16</span>
          </div>
        </section>
        {/* SECTION 10. ?�익 ?��??�이??*/}
        <section className={`rounded-3xl p-6 sm:p-12 ${cardBg} relative`}>
          <div className="flex items-center justify-between border-b border-neutral-200/20 pb-4 mb-8">
            <span className="text-xs font-black tracking-widest text-[#ffd500]">10 / PROFIT SIMULATION</span>
            <span className="text-xs font-black text-slate-400">FINANCIAL ROI INSIGHTS</span>
          </div>

          <div className="space-y-10">
            <div className="text-center md:text-left space-y-3">
              <h2 className="text-2xl sm:text-3xl font-black">
                체계?�인 <span className={textHighlight}>가맹점 ?�익 ?��??�이??/span>
              </h2>
              <p className={`text-sm sm:text-base leading-relaxed ${textDesc}`}>
                ?��? 마진?�과 무상 가�?지?�으�?빠른 초기 비용 ?�수가 가?�합?�다. (??매출 3,000�????�시)
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
                      { cat: "??매출??, price: "3,000�???, ratio: "100%", desc: "?�균 가맹점 ???�매 기�? 매출 ?�시" },
                      { cat: "?�자?�비", price: "1,050�???, ratio: "35%", desc: "본사 ?�제???��? �?부?�재 공급 ?��?" },
                      { cat: "?�차�?, price: "250�???, ratio: "8.3%", desc: "10?�형 매장 ?�균 ?�세" },
                      { cat: "?�건�?, price: "180�???, ratio: "6.0%", desc: "?�주 1??+ ?�트?�??1???�영" },
                      { cat: "관리비 �??�수�?, price: "120�???, ratio: "4.0%", desc: "?�도, 광열�?�?배달???�수�??? }
                    ].map((row, idx) => (
                      <tr key={idx} className={`border-b ${isPink ? "border-neutral-805/50" : "border-amber-200/20"} ${textTitle} font-bold`}>
                        <td className="py-3 px-4 font-black">{row.cat}</td>
                        <td className="py-3 px-4 text-right">{row.price}</td>
                        <td className="py-3 px-4 text-right font-mono">{row.ratio}</td>
                        <td className={`py-3 px-4 text-[10px] ${textDesc}`}>{row.desc}</td>
                      </tr>
                    ))}
                    <tr className={`${isPink ? "bg-rose-500/10 text-rose-500" : "bg-amber-400/10 text-amber-600"} font-black`}>
                      <td className="py-4 px-4 rounded-l-xl">???�수??/td>
                      <td className="py-4 px-4 text-right">1,400�???/td>
                      <td className="py-4 px-4 text-right font-mono">46.7%</td>
                      <td className="py-4 px-4 rounded-r-xl text-[10px]">로열??0% ?�용 �??��? 마진 보장</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
                <div className="relative rounded-2xl overflow-hidden border border-neutral-200/20 shadow-xl aspect-[4/3] bg-neutral-950 w-full">
                  <img 
                    src="https://res.cloudinary.com/dx7l09wwu/image/upload/v1779945185/120%EA%B2%B9%ED%8C%8C%EC%9D%B4_%EC%97%B0%EC%B6%9C4_r90tky.jpg" 
                    alt="Arabica specialty coffee beans" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-transparent to-transparent flex items-end p-3">
                    <span className="text-[10px] font-bold text-white/95">커피 ?�매 마진??극�??�하???�라비카 ?�두 �?매장 비주??/span>
                  </div>
                </div>

                <div className={`p-5 rounded-2xl border ${isPink ? "border-rose-500/20 bg-rose-500/5 text-rose-455" : "border-amber-400/20 bg-amber-400/5 text-amber-600"} flex flex-col items-center justify-center text-center space-y-1.5`}>
                  <TrendingUp size={24} />
                  <span className="text-xs font-black">?��????�계 최고 ?��? 마진??/span>
                  <span className="text-base font-extrabold">???�수????1,400�???(46.7%)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center border-t border-neutral-200/20 pt-6 mt-8 text-[11px] sm:text-xs font-bold text-slate-500">
            <span>* ?�기 금액?� ?�포 ?��? �?가맹점 ?�영 방식???�라 ?��? ???�습?�다.</span>
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
                  모델 A: ?�인??/ 배달 ?�문??                </span>
                <h2 className={`text-xl sm:text-2xl md:text-3xl font-black leading-tight ${textTitle} mt-3`}>
                  기존 매장 그�?�?<br />
                  <span className={textHighlight}>440�???/span> ?�자�?즉시 결합
                </h2>
                <p className={`text-xs sm:text-sm leading-relaxed ${textDesc} mt-2`}>
                  기존 카페, ?�도�? ?�볶?�집 매장??기기 ?�팅�??�인�?교체만으�??��????�매�??�작?�는 초간???�이브리??가???�로그램?�니??
                </p>
              </div>
              
              <div className={`grid grid-cols-2 gap-3 text-xs font-bold ${textDesc}`}>
                {[
                  "가맹비/교육�??�격 ?�급",
                  "주방 ?�비 공사 불필??,
                  "초도 ?��? 200�?지??,
                  "배달 ?�랫??즉시 ?�동"
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
                  src="https://res.cloudinary.com/dx7l09wwu/image/upload/v1779945185/2026-05-28_13_41_46_xec3ws.png" 
                  alt="Model A Counter POP advertising" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-transparent to-transparent flex items-end p-3">
                  <span className="text-[10px] font-bold text-white/95">카운???�인???�용 비주???�스??/span>
                </div>
              </div>
            </div>

            <div className={`lg:col-span-4 p-6 rounded-2xl text-left flex flex-col justify-between ${innerCardBgAccent} ${innerCardHover}`}>
              <span className={`text-[10px] font-black ${textDesc} uppercase tracking-wider block`}>MODEL A DETAILS</span>
              <div className={`space-y-3 border-b ${isPink ? "border-neutral-805" : "border-amber-200/35"} pb-4 my-3`}>
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className={textDesc}>가맹비 (?�시 ?�택)</span>
                  <span className={`${textTitle} font-extrabold line-through`}>100�???/span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className={textDesc}>?�비 공급 비용</span>
                  <span className={`${isPink ? "text-rose-455" : "text-amber-600"} font-extrabold text-sm`}>290�???/span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className={textDesc}>초도 ?�재 지??/span>
                  <span className={`${textTitle} font-extrabold`}>150�???/span>
                </div>
              </div>
              <div className="flex justify-between items-center font-black">
                <span className={`text-xs ${textTitle}`}>최종 ?�입 금액</span>
                <span className={`text-base ${isPink ? "text-rose-500" : "text-amber-500"}`}>440�???/span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center border-t border-neutral-200/20 pt-6 mt-8 text-[11px] sm:text-xs font-bold text-slate-500">
            <span>* 120pie & coffee ?�인???�화 ?�키지 가?�드 기�?</span>
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
                  모델 B: 8~10??컴팩??매장
                </span>
                <h2 className={`text-xl sm:text-2xl md:text-3xl font-black leading-tight ${textTitle} mt-3`}>
                  ?�장�??�???�금 비율,<br />
                  <span className={textHighlight}>1???�영 최적??/span> ?�속??카페
                </h2>
                <p className={`text-xs sm:text-sm leading-relaxed ${textDesc} mt-2`}>
                  8??10?�의 콤팩?�한 매장?�서 ?�장แล�?배달, ?�이�?매출??극�??�하???�석 가�??�로그램?�니??
                </p>
              </div>
              
              <div className={`grid grid-cols-2 gap-3 text-xs font-bold ${textDesc}`}>
                {[
                  "1???�영 가???�선 배치",
                  "초소??주방 ?�화 ?�이?�웃",
                  "?�웃?�어 주문 창구 ?�계",
                  "고급 ?�테리어 마감 지??
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
                  src="https://res.cloudinary.com/dx7l09wwu/image/upload/v1779945187/IMG_8185_jpquaf.jpg" 
                  alt="Model B Packaging box design" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-550 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-transparent to-transparent flex items-end p-3">
                  <span className="text-[10px] font-bold text-white/95">?�이?�아??�??�물 ?�자 박스</span>
                </div>
              </div>
            </div>

            <div className={`lg:col-span-4 p-6 rounded-2xl text-left flex flex-col justify-between ${innerCardBgAccent} ${innerCardHover}`}>
              <span className={`text-[10px] font-black ${textDesc} uppercase tracking-wider block`}>MODEL B BUDGET</span>
              <div className={`space-y-3 border-b ${isPink ? "border-neutral-805" : "border-amber-200/35"} pb-4 my-3`}>
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className={textDesc}>가�?계약�?/span>
                  <span className={`${textTitle} font-extrabold`}>200�???/span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className={textDesc}>?�테리어 (10??기�?)</span>
                  <span className={`${textTitle} font-extrabold`}>1,500�???/span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className={textDesc}>간판 �?기기 ?�팅</span>
                  <span className={`${textTitle} font-extrabold`}>800�???/span>
                </div>
              </div>
              <div className="flex justify-between items-center font-black">
                <span className={`text-xs ${textTitle}`}>?�상 창업 비용</span>
                <span className={`text-base ${isPink ? "text-rose-500" : "text-amber-500"}`}>2,500�????�</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center border-t border-neutral-200/20 pt-6 mt-8 text-[11px] sm:text-xs font-bold text-slate-500">
            <span>* ?�포 ?�차료�? ?�외???��? 창업 개설 비용 ?�시</span>
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
                  모델 C: 15???�상 ?�리미엄 카페
                </span>
                <h2 className={`text-xl sm:text-2xl md:text-3xl font-black leading-tight ${textTitle} mt-3`}>
                  브런�??�인??강화,<br />
                  <span className={textHighlight}>고객 체류 ?�간</span>???�리???�리미엄??                </h2>
                <p className={`text-xs sm:text-sm leading-relaxed ${textDesc} mt-2`}>
                  ?��? ?� ?�이블을 ?�해 ?��??�뿐�??�니???�료, 브런�?매출???�반 ?�장???�끄??고수???�래그십 매장?�니??
                </p>
              </div>
              
              <div className={`grid grid-cols-2 gap-3 text-xs font-bold ${textDesc}`}>
                {[
                  "?�독 ?�이�??� 좌석 ?�보",
                  "?�레?�팅 ?��????�트 공급",
                  "?�체 ?��???�?주�? 고객 ?�치",
                  "매장 ?�드마크???�자??
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
                  src="https://res.cloudinary.com/dx7l09wwu/image/upload/v1779945186/ChatGPT_Image_2026%EB%85%84_5%EC%9B%94_28%EC%9D%BC_%EC%98%A4%ED%9B%84_01_47_46_fyk4ns.png" 
                  alt="Model C premium kitchen cafe interior mockup" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-transparent to-transparent flex items-end p-3">
                  <span className="text-[10px] font-bold text-white/95">?�리미엄 ?�련??주방 �??� 구성</span>
                </div>
              </div>
            </div>

            <div className={`lg:col-span-4 p-6 rounded-2xl text-left flex flex-col justify-between ${innerCardBgAccent} ${innerCardHover}`}>
              <span className={`text-[10px] font-black ${textDesc} uppercase tracking-wider block`}>MODEL C BUDGET</span>
              <div className={`space-y-3 border-b ${isPink ? "border-neutral-805" : "border-amber-200/35"} pb-4 my-3`}>
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className={textDesc}>가�?계약 �?교육</span>
                  <span className={`${textTitle} font-extrabold`}>300�???/span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className={textDesc}>?�테리어 (15??기�?)</span>
                  <span className={`${textTitle} font-extrabold`}>2,200�???/span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className={textDesc}>기기 ?�비 �?집기</span>
                  <span className={`${textTitle} font-extrabold`}>1,100�???/span>
                </div>
              </div>
              <div className="flex justify-between items-center font-black">
                <span className={`text-xs ${textTitle}`}>?�상 창업 비용</span>
                <span className={`text-base ${isPink ? "text-rose-500" : "text-amber-500"}`}>3,600�????�</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center border-t border-neutral-200/20 pt-6 mt-8 text-[11px] sm:text-xs font-bold text-slate-500">
            <span>* 15?�형 ?��? ?�래그십 매장 개설 견적 가?�드 기�?</span>
            <span>Slide 13 / 16</span>
          </div>
        </section>

        {/* SECTION 14. 창업?�차 */}
        <section className={`rounded-3xl p-6 sm:p-12 ${cardBg} relative`}>
          <div className="flex items-center justify-between border-b border-neutral-200/20 pb-4 mb-8">
            <span className="text-xs font-black tracking-widest text-[#ffd500]">14 / FRANCHISE PROCESS</span>
            <span className="text-xs font-black text-slate-400">7-STEP LAUNCH ROADMAP</span>
          </div>

          <div className="space-y-10">
            <div className="text-center md:text-left space-y-3">
              <h2 className="text-2xl sm:text-3xl font-black">
                체계?�인 <span className={textHighlight}>7?�계 개점 ?�로?�스</span>
              </h2>
              <p className={`text-sm sm:text-base leading-relaxed ${textDesc}`}>
                ?�담 ?�청부??최종 그랜???�픈까�? 본사 개점 ?�담?�??밀착하??케?�합?�다.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
              <div className="lg:col-span-8 relative">
                {/* Connecting Line */}
                <div className={`absolute left-6 top-4 bottom-4 w-0.5 ${isPink ? "bg-neutral-805" : "bg-amber-200/50"} z-0`}></div>
                <div className="space-y-4 relative z-10">
                  {[
                    { step: "01", name: "?�담 ?�청", desc: "?�입 ?�태 �??�수 진단", icon: <Info size={12} className={isPink ? "text-rose-500" : "text-amber-500"} /> },
                    { step: "02", name: "?�권 분석", desc: "배달 �??��?분석", icon: <Search size={12} className={isPink ? "text-rose-500" : "text-amber-500"} /> },
                    { step: "03", name: "가�?계약", desc: "?��? ?�택 �?체결", icon: <FileText size={12} className={isPink ? "text-rose-500" : "text-amber-500"} /> },
                    { step: "04", name: "?�면 ?�계", desc: "1???�선 배치???�정", icon: <Building2 size={12} className={isPink ? "text-rose-500" : "text-amber-500"} /> },
                    { step: "05", name: "기기 교육", desc: "1:1 ?�시??조리 마스??, icon: <ChefHat size={12} className={isPink ? "text-rose-500" : "text-amber-500"} /> },
                    { step: "06", name: "?�픈 리허??, desc: "최종 가???�스??, icon: <Sliders size={12} className={isPink ? "text-rose-500" : "text-amber-500"} /> },
                    { step: "07", name: "그랜???�픈", desc: "매출 ?�성??마�???, icon: <Sparkles size={12} className={isPink ? "text-rose-500" : "text-amber-500"} /> }
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
                    src="https://res.cloudinary.com/dx7l09wwu/image/upload/v1779945604/ChatGPT_Image_2026%EB%85%84_5%EC%9B%94_28%EC%9D%BC_%EC%98%A4%ED%9B%84_01_51_40_ahiniz.png" 
                    alt="Process marketing material" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-transparent to-transparent flex items-end p-4">
                    <span className="text-xs font-bold text-white/95">?�픈 준�??�속 지???�키�?�?POP ?�트</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center border-t border-neutral-200/20 pt-6 mt-8 text-[11px] sm:text-xs font-bold text-slate-500">
            <span>* ?�담부???�균 개점 ?�요 기간: ?�인??7?? ?�규창업 21??/span>
            <span>Slide 14 / 16</span>
          </div>
        </section>

        {/* SECTION 15. ?�입 ?�유 (WHY PARTNER WITH US) */}
        <section className={`rounded-3xl p-6 sm:p-12 ${cardBg} relative`}>
          <div className="flex items-center justify-between border-b border-neutral-200/20 pb-4 mb-8">
            <span className="text-xs font-black tracking-widest text-[#ffd500]">15 / FRANCHISE VALUE</span>
            <span className="text-xs font-black text-slate-400">PARTNER BENEFITS SUMMARY</span>
          </div>

          <div className="space-y-10">
            <div className="text-center md:text-left space-y-3">
              <h2 className="text-2xl sm:text-3xl font-black">
                ?�주?�들??120pie�?<span className={textHighlight}>?�택??결정?�인 ?�유</span>
              </h2>
              <p className={`text-sm sm:text-base leading-relaxed ${textDesc}`}>
                본사 ?�익보다 가맹점주님??마진??최우?�으�??�각?�는 브랜???�책?�니??
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
              <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { title: "로열??0% ?�언", desc: "매월 발생?�는 매출 비�? 가맹금?�나 광고 분담�??�절 �?�� ?�음", icon: <Percent size={16} /> },
                  { title: "가맹비 ?�액 ?�급 ?�로그램", desc: "?�정 물량 ?�화 ?�는 매출 기�? ?�성 ??보증금처???�원", icon: <Award size={16} /> },
                  { title: "100% ?�제???��? 공급", desc: "반죽, ?�료 ?�질 ?�이 ?�븐�??�나�??�문 베이커리 ?�리??구현", icon: <ChefHat size={16} /> },
                  { title: "강력???�즌 메뉴 ?�환", desc: "?�이 머신 ?�에 계�?�?머신 무상 ?�?�로 겨울�?추�? 매출 ?�보", icon: <Sparkles size={16} /> }
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
                    src="https://res.cloudinary.com/dx7l09wwu/image/upload/v1779945603/EGG120_%EB%8F%99%EB%AC%BC%EB%B3%B5%EC%A7%80_%ED%8C%9D%EC%97%85POPUP__240613_jqil66.jpg" 
                    alt="Egg120 animal welfare pop-up" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-transparent to-transparent flex items-end p-4">
                    <span className="text-xs font-bold text-white/95">가�?공급 ?�료 차별?? 친환�??�물복�? ?�증 계�?</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center border-t border-neutral-200/20 pt-6 mt-8 text-[11px] sm:text-xs font-bold text-slate-500">
            <span>* 가�?공정거래?�원???��? ?��? �?가�?계약 ?�용 준??/span>
            <span>Slide 15 / 16</span>
          </div>
        </section>

        {/* SECTION 16. ?�면 (Back Cover) */}
        <section className={`rounded-3xl p-6 sm:p-12 md:p-16 ${cardBg} flex flex-col justify-between min-h-[460px] relative overflow-hidden text-center`}>
          <div className="absolute inset-0 bg-gradient-to-tr from-amber-400/5 to-transparent pointer-events-none"></div>

          <div className="flex items-center justify-between border-b border-neutral-200/20 pb-6 mb-6">
            <span className="text-xs font-black tracking-widest text-slate-500">16 / BACK COVER</span>
            <span className={`text-xs font-bold ${isPink ? "text-rose-500" : "text-amber-600"} font-mono`}>120PIE & COFFEE</span>
          </div>

          <div className="my-auto py-10 space-y-6 max-w-2xl mx-auto">
            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-black leading-tight ${textTitle}`}>
              ?�공?�인 창업???�작,<br />
              <span className={textHighlight}>120pie & coffee</span>가 ?�께?�니??
            </h2>
            <p className={`text-xs sm:text-sm md:text-base leading-relaxed ${textDesc}`}>
              ?�비 가맹점주님??기존 ?�건???�극 존중?�여 최�? 비용?�로 최�? ?�율??뽑아?�는 가?�드�??�속?�립?�다. 지�??�단 ?�담 ?�청 ?�에 ?�락처�? ?�겨주세??
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-4">
              <button 
                type="button"
                onClick={handlePrintPage}
                className={`inline-flex items-center justify-center px-5 py-3 rounded-xl border font-extrabold text-sm cursor-pointer transition-all shadow-md ${isPink ? "bg-neutral-900 border-neutral-800 text-white hover:bg-neutral-800" : "bg-white border-amber-250/70 text-slate-700 hover:bg-amber-50/50"}`}
              >
                <FileText size={16} className={`mr-2 ${isPink ? "text-rose-500" : "text-amber-500"}`} /> ?�재 ?�안??PDF�??�쇄/?�??              </button>
              <a 
                href="#inquiry-form-section"
                className={`inline-flex items-center justify-center px-6 py-3 rounded-xl font-extrabold text-sm transition-all shadow-md ${isPink ? "bg-rose-500 text-white hover:bg-rose-600 shadow-rose-500/10" : "bg-amber-400 text-neutral-900 hover:bg-amber-300 shadow-amber-400/10"}`}
              >
                가�??�담 ?�청???�성?�기
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
              <h2 className={`text-2xl sm:text-3xl font-black ${textTitle}`}>?�시�?가�?& ?�인???�입 문의</h2>
              <p className={`text-xs sm:text-sm leading-relaxed ${textDesc}`}>
                ?�담 ?�식???�력?�시�? 주�? 경쟁??분석 �?3D ?�선 배치?��? ?�함??개별 ?�권 리포?��? 무상 ?�공???�립?�다.
              </p>
            </div>

            {formSubmitted ? (
              <div className={`text-center p-8 ${innerCardBg} border ${isPink ? "border-neutral-805" : "border-amber-200/40"} rounded-2xl space-y-4`}>
                <div className="inline-flex w-12 h-12 bg-emerald-500/10 border border-emerald-500 text-emerald-500 rounded-full items-center justify-center">
                  <CheckCircle2 size={24} />
                </div>
                <div className="space-y-1">
                  <h4 className={`text-lg font-black ${textTitle}`}>가�?�??�담 문의가 ???�수?�었?�니??</h4>
                  <p className={`text-xs sm:text-sm ${textDesc} font-semibold leading-relaxed`}>
                    ?�성??주신 ?�락처로 ?�권 리포??검?????�문 ?�당 ?�장??24?�간 ???�선 ?�락???�리겠습?�다.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFormSubmitted(false);
                    setFormData({ name: "", phone: "", storeType: "?�인???�입", existingStoreName: "", message: "" });
                  }}
                  className={`text-xs sm:text-sm ${isPink ? "text-rose-500" : "text-amber-500"} font-bold hover:underline cursor-pointer bg-transparent border-0`}
                >
                  [ 추�? ?�담 문의 ?�성?�기 ]
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2 text-left">
                    <label className={`text-xs font-extrabold ${textDesc} block`}>?�함 / ?�당??/label>
                    <input
                      type="text"
                      name="name"
                      placeholder="?�함???�력?�세??
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className={`w-full ${inputBgClass} border rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none transition-colors`}
                    />
                  </div>
                  <div className="space-y-2 text-left">
                    <label className={`text-xs font-extrabold ${textDesc} block`}>?�락�?/label>
                    <input
                      type="tel"
                      name="phone"
                      maxLength={13}
                      placeholder="?�락처�? ?�력?�세??
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className={`w-full ${inputBgClass} border rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none transition-colors`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2 text-left">
                    <label className={`text-xs font-extrabold ${textDesc} block`}>창업 ?�형 ?�택</label>
                    <select
                      name="storeType"
                      value={formData.storeType}
                      onChange={handleInputChange}
                      className={`w-full ${inputBgClass} border rounded-xl px-3.5 py-3 text-xs sm:text-sm focus:outline-none transition-colors cursor-pointer font-bold`}
                    >
                      <option value="?�인???�입">기존 매장 ?�인???�입</option>
                      <option value="?�규 ?�자�?창업">?�자�?카페 ?�규 창업</option>
                      <option value="?�리미엄 가�?>?�리미엄 브런�?매장 창업</option>
                      <option value="?�종 변�?문의">?� ?�종 변�?가??/option>
                    </select>
                  </div>
                  <div className="space-y-2 text-left">
                    <label className={`text-xs font-extrabold ${textDesc} block`}>기존 매장�?(?�택)</label>
                    <input
                      type="text"
                      name="existingStoreName"
                      placeholder="?? 120카페 강남??
                      value={formData.existingStoreName}
                      onChange={handleInputChange}
                      className={`w-full ${inputBgClass} border rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none transition-colors`}
                    />
                  </div>
                </div>

                <div className="space-y-2 text-left">
                  <label className={`text-xs font-extrabold ${textDesc} block`}>?�담 문의 ?�세 (?�택)</label>
                  <textarea
                    name="message"
                    rows={4}
                    placeholder="매장???�수??가???�간?�, ?�기 ?�비 ??궁금?�신 ?�용???�하�?기술??주세??"
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
                    ?�담 ?�내�??�한 가맹본?�의 개인?�보 ?�집 �??�담 ?�락???�의?�니?? (?�수)
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full font-black text-sm sm:text-base py-4 rounded-xl hover:scale-[1.01] active:scale-[0.99] transition-all shadow-md border-0 cursor-pointer ${isPink ? "bg-rose-500 text-white hover:bg-rose-600 shadow-rose-500/15" : "bg-amber-400 text-neutral-900 hover:bg-amber-300 shadow-amber-400/15"}`}
                >
                  {isSubmitting ? "문의 ?�록 처리 �?.." : "VIP 맞춤 창업 ?�담 ?�수 ?�료"}
                </button>
              </form>
            )}
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-neutral-200/20 text-center text-xs font-semibold text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-4">
          <p>?�일?�공?�프?�비 | ?�?�이?? ?�길??| ?�울?�별??강남�???���?120, 5�?/p>
          <p>가맹문?? 1566-0000 | ?�메?? support@120pie.com | ?�업?�등록번?? 000-00-00000</p>
          <p className="text-[10px] text-slate-650">© 2026 120pie & coffee Corp. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
