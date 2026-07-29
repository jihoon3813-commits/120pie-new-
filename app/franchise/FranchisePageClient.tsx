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
import { useMutation, useAction } from "convex/react";
import FloatingAndInquiry from "@/app/components/FloatingAndInquiry";
import Footer from "@/app/components/Footer";
import MobileBottomInquiryBar from "@/components/MobileBottomInquiryBar";
import RightFloatingQuickBar from "@/components/RightFloatingQuickBar";
import RightSideInquiryBanner from "@/components/RightSideInquiryBanner";
import { api } from "@/convex/_generated/api";
import { triggerConsultationSms } from "@/app/utils/sms";

const logoUrlBlack = "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784533894/Group_1_4_jl4rlr.png";

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
  const [activeMenuTab, setActiveMenuTab] = useState<"pie" | "egg" | "churros" | "side" | "drink" | "bakery" | "croffle">("pie");
  
  // Helper to optimize Cloudinary images (downscales large images to look crisp and clean)
  const getOptimizedImg = (url: string, width = 300) => {
    if (url && url.includes("res.cloudinary.com")) {
      if (url.includes("image/upload/w_")) return url;
      return url.replace("image/upload/", `image/upload/w_${width},q_auto,f_auto/`);
    }
    return url;
  };

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
  const sendSmsAction = useAction(api.aligo.sendSms);

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
      triggerConsultationSms(sendSmsAction, formData.name, formData.phone, formData.storeType);
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
      triggerConsultationSms(sendSmsAction, formData.name, formData.phone, formData.storeType);
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
            <Link href={`/menu?theme=${theme}`} className="hover:text-amber-400 transition-colors">메뉴</Link>
            <Link href={`/stores?theme=${theme}`} className="hover:text-amber-400 transition-colors">가맹점 현황</Link>
            <Link href={`/costs?theme=${theme}`} className="hover:text-amber-400 transition-colors">비용 안내</Link>
            <Link href={`/franchise?theme=${theme}`} className={`hover:scale-105 transition-transform shrink-0 ${
              isPink 
                ? "text-rose-500 hover:text-rose-600 font-extrabold" 
                : "text-[#ffd500] hover:text-[#e6bd00] font-extrabold"
            }`}>
              창업 안내
            </Link>
            <Link href={`/faq?theme=${theme}`} className="hover:text-amber-400 transition-colors">FAQ</Link>
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
            <Link className={`inline-flex items-center justify-center px-3 py-1.5 sm:px-4 sm:py-2.5 rounded-lg border text-xs font-bold focus:outline-none focus:ring-0 outline-none ${portalBtnClass}`} href="/portal" target="_blank" rel="noopener noreferrer">
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
              <Link href={`/menu?theme=${theme}`} onClick={() => setMobileNavOpen(false)} className={`rounded-xl px-4 py-3 transition-colors ${mobileNavLinkClass}`}>
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
              <Link href={`/faq?theme=${theme}`} onClick={() => setMobileNavOpen(false)} className={`col-span-2 rounded-xl px-4 py-3 transition-colors text-center ${mobileNavLinkClass}`}>
                FAQ
              </Link>
            </div>
            <div className="flex flex-col gap-2 mt-3 w-full">
              <Link
                href="/brand"
                onClick={() => setMobileNavOpen(false)}
                className="w-full flex items-center justify-between rounded-xl px-4 py-3 text-xs sm:text-sm font-black bg-[#fbc400] text-neutral-950 hover:bg-amber-400 transition-all shadow-sm"
              >
                <span>브랜드홈페이지 바로가기</span>
                <span>&rarr;</span>
              </Link>
              <div className="flex gap-2 w-full">
                <Link
                  href="/portal"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileNavOpen(false)}
                  className={`flex-1 flex items-center justify-center rounded-xl px-4 py-3 text-xs sm:text-sm font-black border transition-all focus:outline-none focus:ring-0 outline-none ${portalBtnClass}`}
                >
                  점주전용
                </Link>
                <a
                  href="#inquiry-form-section"
                  onClick={() => setMobileNavOpen(false)}
                  className={`pink-primary-button flex-1 flex items-center justify-center rounded-xl px-4 py-3 text-xs sm:text-sm font-black border-0 cursor-pointer ${
                    isPink 
                      ? "bg-rose-500 text-white hover:bg-rose-600 shadow-[0_4px_16px_rgba(244,63,94,0.255)]" 
                      : "bg-amber-400 text-neutral-950 hover:bg-amber-300 shadow-[0_4px_16px_rgba(251,191,36,0.255)]"
                  }`}
                >
                  상담 신청 <ArrowRight size={14} className="ml-1.5 shrink-0" />
                </a>
              </div>
            </div>
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
                  href="/메뉴추가_120pie-가맹-제안_막장있음_.pdf" 
                  download="메뉴추가_120pie-가맹-제안_막장있음_.pdf"
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
                  src="https://res.cloudinary.com/dfarfqx7e/image/upload/f_auto,q_auto/v1781185662/%EB%A9%94%EB%89%B4_%ED%94%8C%EB%A0%88%EC%9D%B4%ED%8C%85_%EC%98%88%EC%81%9C_%EC%B9%B4%ED%8E%98_202605271150_qfswzm_nxk2mq.jpg" 
                  alt="120pie signature dessert" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                />
                
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
                    src="https://res.cloudinary.com/dfarfqx7e/image/upload/f_auto,q_auto/v1781590329/120%EA%B2%B9%ED%8C%8C%EC%9D%B4_%EC%97%B0%EC%B6%9C3_ibhumn.jpg" 
                    alt="Artisan rolling pastry dough" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                  
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
                    src="https://res.cloudinary.com/dfarfqx7e/image/upload/f_auto,q_auto/v1781590223/ChatGPT_Image_2026%EB%85%84_6%EC%9B%94_9%EC%9D%BC_%EC%98%A4%ED%9B%84_01_24_05_etbfvd.png" 
                    alt="6WAY packaging box" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                  
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
                  src="https://res.cloudinary.com/dfarfqx7e/image/upload/f_auto,q_auto/v1781590218/ChatGPT_Image_2026%EB%85%84_6%EC%9B%94_9%EC%9D%BC_%EC%98%A4%ED%9B%84_05_04_59_upd43s.png" 
                  alt="Dough and baking process" 
                  className="w-full h-full object-cover opacity-80 group-hover:scale-102 transition-transform duration-300"
                />
                
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
                    ? "https://res.cloudinary.com/dfarfqx7e/image/upload/f_auto,q_auto/v1781590217/edited-photo_68_t9lc94.png"
                    : "https://res.cloudinary.com/dfarfqx7e/image/upload/f_auto,q_auto/v1781590217/edited-photo_67_uqjalx.png"
                  } 
                  alt="Floor plan spatial layout" 
                  className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-550"
                />
                
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
                    src="https://res.cloudinary.com/dfarfqx7e/image/upload/f_auto,q_auto/v1781590221/ChatGPT_Image_2026%EB%85%84_6%EC%9B%94_9%EC%9D%BC_%EC%98%A4%ED%9B%84_05_24_39_a38n7c.png" 
                    alt="Success advertising banner mockup" 
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500 opacity-90"
                  />
                  
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
                  img: "https://res.cloudinary.com/dfarfqx7e/image/upload/f_auto,q_auto/v1781183595/120%EA%B2%B9%ED%8C%8C%EC%9D%B4_%ED%81%AC%EB%A6%BC%EC%B9%98%EC%A6%88_%EC%95%A0%ED%94%8C_%EB%B8%94%EB%A3%A8%EB%B2%A0%EB%A6%AC_%EC%97%B0%EC%B6%9C_bzyzzs.jpg"
                },
                {
                  title: "에그 120",
                  points: [
                    "오리지널 / 베이컨",
                    "콘버터 / 커스터드",
                    "통팥 / 통모짜",
                    "로제미트 / 슈크림"
                  ],
                  img: "https://res.cloudinary.com/dfarfqx7e/image/upload/f_auto,q_auto/v1781184083/120egg_45_dqgrir.jpg"
                },
                {
                  title: "츄러스 120",
                  points: [
                    "오리지널 / 슈가",
                    "오레오 / 녹차"
                  ],
                  img: "https://res.cloudinary.com/dfarfqx7e/image/upload/f_auto,q_auto/v1781184099/IMG_0015_6_3_bxmolh.jpg"
                },
                {
                  title: "사이드 & 음료",
                  points: [
                    "국물 / 로제 / 짜장 떡볶이",
                    "직화 불고기 핫도그",
                    "커피 / 에이드 / 스무디 / 뱅쇼 등"
                  ],
                  img: "https://res.cloudinary.com/dfarfqx7e/image/upload/f_auto,q_auto/v1781590222/ChatGPT_Image_2026%EB%85%84_6%EC%9B%94_9%EC%9D%BC_%EC%98%A4%ED%9B%84_05_36_29_dgybn5.png"
                },
                {
                  title: "스콘 / 머핀 / 쿠키",
                  points: [
                    "플레인 / 초코칩 스콘",
                    "블루베리 / 초코 / 치즈 머핀",
                    "다크초코 / 마카다미아 / 캐슈넛 쿠키"
                  ],
                  img: "https://res.cloudinary.com/dfarfqx7e/image/upload/f_auto,q_auto/v1782370423/ChatGPT_Image_2026%EB%85%84_6%EC%9B%94_25%EC%9D%BC_%EC%98%A4%ED%9B%84_03_53_25_kf4inf.png"
                },
                {
                  title: "크로플 / 마카롱",
                  points: [
                    "딸기&크림 / 블루베리&크림 크로플",
                    "솔티드카라멜 / 초코렛폭탄 / 흑당 크로플",
                    "산딸기 / 블루베리 / 초코 마카롱"
                  ],
                  img: "https://res.cloudinary.com/dfarfqx7e/image/upload/f_auto,q_auto/v1782370423/ChatGPT_Image_2026%EB%85%84_6%EC%9B%94_25%EC%9D%BC_%EC%98%A4%ED%9B%84_03_53_21_qjja4b.png"
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
            <div className="grid grid-cols-3 gap-2 max-w-3xl mx-auto mb-8 select-none">
              {[
                { key: "pie", label: "120겹 파이 시리즈", emoji: "🥐" },
                { key: "egg", label: "에그 120 시리즈", emoji: "🥚" },
                { key: "churros", label: "츄러스 120 시리즈", emoji: "🥨" },
                { key: "side", label: "떡볶이 & 핫도그", emoji: "🌭" },
                { key: "drink", label: "커피 & 음료", emoji: "☕" },
                { key: "bakery", label: "스콘/머핀/쿠키", emoji: "🍪" },
                { key: "croffle", label: "크로플/마카롱", emoji: "🧇" }
              ].map((tab, idx) => {
                const isActive = activeMenuTab === tab.key;
                const isLast = idx === 6;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveMenuTab(tab.key as any)}
                    className={`flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all duration-200 cursor-pointer border ${
                      isLast ? "col-span-3" : ""
                    } ${
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
                    { name: "꿀호떡 파이", img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784076391/edited-photo_-_2026-07-06T123534.491_cumykv.png" },
                    { name: "페페로니피자 파이", img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784076393/edited-photo_-_2026-07-06T123914.344_ozvcjh.png" },
                    { name: "로제미트 파이", img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784076393/edited-photo_-_2026-07-06T123900.583_obxtij.png" },
                    { name: "팥치즈 파이", img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784076394/edited-photo_-_2026-07-06T123504.488_yxfdox.png" },
                    { name: "애플 파이", img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784076388/edited-photo_-_2026-07-06T123253.062_abg0wv.png" },
                    { name: "불고기 파이", img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784076392/edited-photo_-_2026-07-06T123817.688_nlgwuu.png" },
                    { name: "불닭 파이", img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784076392/edited-photo_-_2026-07-06T123838.548_emd6h0.png" },
                    { name: "크림치즈 파이", img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784076390/edited-photo_-_2026-07-06T123331.133_bltqyk.png" },
                    { name: "망고 파이", img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784076391/edited-photo_-_2026-07-06T123448.674_ik0brc.png" },
                    { name: "콘치즈 파이", img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784076390/edited-photo_-_2026-07-06T123519.769_mjtemz.png" },
                    { name: "커스터드 파이", img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784076389/edited-photo_-_2026-07-06T123308.924_oddurc.png" },
                    { name: "블루베리 파이", img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784076393/edited-photo_-_2026-07-06T123432.204_ood7n2.png" }
                  ].map((item, idx) => (
                    <div key={idx} className="group flex flex-col items-center">
                      <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden border border-neutral-200/20 shadow-md bg-neutral-950 relative group-hover:border-amber-400 transition-all duration-300">
                        <img 
                          src={getOptimizedImg(item.img, 300)} 
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
                    { name: "오리지널 계란빵", img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784076432/edited-photo_4_h8zxni.png" },
                    { name: "베이컨 계란빵", img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784076431/edited-photo_2_bkirhe.png" },
                    { name: "커스터드 계란빵", img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784076430/edited-photo_5_u4kkgc.png" },
                    { name: "콘치즈 계란빵", img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784076432/edited-photo_6_qfecvn.png" },
                    { name: "로제미트 계란빵", img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784076432/edited-photo_1_ahuft0.png" },
                    { name: "통모짜 계란빵", img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784076434/edited-photo_7_hbvwtv.png" },
                    { name: "슈크림 계란빵", img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784076430/edited-photo_3_z8z45f.png" },
                    { name: "팥 계란빵", img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784076432/edited-photo_8_nfukfo.png" }
                  ].map((item, idx) => (
                    <div key={idx} className="group flex flex-col items-center">
                      <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden border border-neutral-200/20 shadow-md bg-neutral-950 relative group-hover:border-amber-400 transition-all duration-300">
                        <img 
                          src={getOptimizedImg(item.img, 300)} 
                          alt={item.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-95"
                        />
                      </div>
                      <span className={`text-xs sm:text-sm font-black ${textTitle} text-center mt-2 px-1 block truncate w-full`}>{item.name}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeMenuTab === "churros" && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-2xl mx-auto">
                  {[
                    { name: "오리지널 츄러스", img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784076878/Image_1_ffcbk0.png" },
                    { name: "슈가 츄러스", img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784076877/edited-photo_12_1_dxpd1m.png" },
                    { name: "오레오 츄러스", img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784076877/edited-photo_11_1_bdmwxl.png" },
                    { name: "녹차 츄러스", img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784076878/edited-photo_10_1_gouikw.png" }
                  ].map((item, idx) => (
                    <div key={idx} className="group flex flex-col items-center">
                      <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden border border-neutral-200/20 shadow-md bg-neutral-950 relative group-hover:border-amber-400 transition-all duration-300">
                        <img 
                          src={getOptimizedImg(item.img, 350)} 
                          alt={item.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-95"
                        />
                      </div>
                      <span className={`text-xs sm:text-sm font-black ${textTitle} text-center mt-2 px-1 block truncate w-full`}>{item.name}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeMenuTab === "side" && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-2xl mx-auto">
                  {[
                    { name: "국물 떡볶이", img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784076483/%EA%B5%AD%EB%AC%BC1_h3s5ew.png" },
                    { name: "로제 떡볶이", img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784076483/%EB%A1%9C%EC%A0%9C1_kopbiv.png" },
                    { name: "짜장 떡볶이", img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784076485/%EC%A7%9C%EC%9E%A51_alc9og.png" },
                    { name: "직화불고기 핫도그", img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784078299/%EC%A7%81%ED%99%94%EB%B6%88%EA%B3%A0%EA%B8%B0_1_cuyrzn.png" }
                  ].map((item, idx) => (
                    <div key={idx} className="group flex flex-col items-center">
                      <div className={`w-full aspect-square rounded-2xl overflow-hidden border border-neutral-200/20 shadow-md ${isPink ? "bg-neutral-900" : "bg-[#fffdf4]"} relative group-hover:border-amber-400 transition-all duration-300`}>
                        <img 
                          src={getOptimizedImg(item.img, 350)} 
                          alt={item.name} 
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 opacity-95"
                        />
                      </div>
                      <span className={`text-xs sm:text-sm font-black ${textTitle} text-center mt-2 px-1 block truncate w-full`}>{item.name}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeMenuTab === "drink" && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 sm:gap-6">
                  {[
                    { name: "말차컵팥빙수", img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784077139/%EB%A7%90%EC%B0%A8%EC%BB%B5%ED%8C%A5%EB%B9%99%EC%88%98_abnxk6.png" },
                    { name: "인절미컵팥빙수", img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784077138/%EC%9D%B8%EC%A0%88%EB%AF%B8%EC%BB%B5%ED%8C%A5%EB%B9%99%EC%88%98_w4v7n6.png" },
                    { name: "아메리카노", img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784077112/%EC%95%84%EB%A9%94%EB%A6%AC%EC%B9%B4%EB%85%B8_uz1mfv.png" },
                    { name: "카페라떼", img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784077107/%EC%B9%B4%ED%8E%98%EB%9D%BC%EB%96%BC_gipg7l.png" },
                    { name: "카푸치노", img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784077126/%EC%B9%B4%ED%91%B8%EC%B9%98%EB%85%B82_l0iewp.png" },
                    { name: "바닐라라떼", img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784077097/%EB%B0%94%EB%8B%90%EB%9D%BC%EB%9D%BC%EB%96%BC_e98gec.png" },
                    { name: "카라멜마끼아또", img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784077122/%EC%B9%B4%EB%9D%BC%EB%A9%9C%EB%A7%88%EB%81%BC%EC%95%84%EB%98%902_tstwta.png" },
                    { name: "카페모카", img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784077129/%EC%B9%B4%ED%8E%98%EB%AA%A8%EC%B9%B42_uqfgvu.png" },
                    { name: "연유카페라떼", img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784077123/%EC%97%B0%EC%9C%A0%EC%B9%B4%ED%8E%98%EB%9D%BC%EB%96%BC2_yzssnv.png" },
                    { name: "콜드브루", img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784077114/%EC%BD%9C%EB%93%9C%EB%B8%8C%EB%A3%A8_iu0xqu.png" },
                    { name: "콜드브루라떼", img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784077109/%EC%BD%9C%EB%93%9C%EB%B8%8C%EB%A3%A8%EB%9D%BC%EB%96%BC2_dqzwrq.png" },
                    { name: "연유 콜드브루", img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784077103/%EC%97%B0%EC%9C%A0_%EC%BD%9C%EB%93%9C%EB%B8%8C%EB%A3%A82_lqzigs.png" },
                    { name: "흑당라떼", img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784077124/%ED%9D%91%EB%8B%B9%EB%9D%BC%EB%96%BC_raeafb.png" },
                    { name: "곡물라떼", img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784077116/%EA%B3%A1%EB%AC%BC%EB%9D%BC%EB%96%BC2_ctx6pm.png" },
                    { name: "고구마라떼", img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784077128/%EA%B3%A0%EA%B5%AC%EB%A7%88%EB%9D%BC%EB%96%BC2_kqwnxh.png" },
                    { name: "딸기라떼", img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784077110/%EB%94%B8%EA%B8%B0%EB%9D%BC%EB%96%BC_f1jkyz.png" },
                    { name: "토피넛라떼", img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784077127/%ED%86%A0%ED%94%BC%EB%84%9B%EB%9D%BC%EB%96%BC2_lhl3bi.png" },
                    { name: "녹차라떼", img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784077092/%EB%85%B9%EC%B0%A8%EB%9D%BC%EB%96%BC_spc7cv.png" },
                    { name: "달고나라떼", img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784077101/%EB%8B%AC%EA%B3%A0%EB%82%98%EB%9D%BC%EB%96%BC2_l6bzd2.png" },
                    { name: "피스타치오라떼", img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784077136/%ED%94%BC%EC%8A%A4%ED%83%80%EC%B9%98%EC%98%A4%EB%9D%BC%EB%96%BC2_y0rcqc.png" },
                    { name: "미숫가루", img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784077102/%EB%AF%B8%EC%88%AB%EA%B0%80%EB%A3%A82_zsrzcj.png" },
                    { name: "초당옥수수라떼", img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784077124/%EC%B4%88%EB%8B%B9%EC%98%A5%EC%88%98%EC%88%98%EB%9D%BC%EB%96%BC2_qmeb51.png" },
                    { name: "딸기 요거트스무디", img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784077095/%EB%94%B8%EA%B8%B0_%EC%9A%94%EA%B1%B0%ED%8A%B8%EC%8A%A4%EB%AC%B4%EB%94%942_c0he69.png" },
                    { name: "망고 요거트스무디", img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784077096/%EB%A7%9D%EA%B3%A0_%EC%9A%94%EA%B1%B0%ED%8A%B8%EC%8A%A4%EB%AC%B4%EB%94%942_xiu6fx.png" },
                    { name: "딸기망고블루베리 스무디", img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784077140/%EB%94%B8%EA%B8%B0%EB%A7%9D%EA%B3%A0%EB%B8%94%EB%A3%A8%EB%B2%A0%EB%A6%AC_%EC%8A%A4%EB%AC%B4%EB%94%94_xlhung.png" },
                    { name: "딸기바나나 스무디", img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784077133/%EB%94%B8%EA%B8%B0%EB%B0%94%EB%82%98%EB%82%98_%EC%8A%A4%EB%AC%B4%EB%94%94_bkyx7p.png" },
                    { name: "수박 스무디", img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784077137/%EC%88%98%EB%B0%95_%EC%8A%A4%EB%AC%B4%EB%94%94_vc9gur.png" },
                    { name: "복숭아 아이스티", img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784077111/%EB%B3%B5%EC%88%AD%EC%95%84_%EC%95%84%EC%9D%B4%EC%8A%A4%ED%8B%B02_yfnmap.png" },
                    { name: "자몽 에이드", img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784077106/%EC%9E%90%EB%AA%BD_%EC%97%90%EC%9D%B4%EB%93%9C2_wfzkdg.png" },
                    { name: "레몬 에이드", img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784077091/%EB%A0%88%EB%AA%AC_%EC%97%90%EC%9D%B4%EB%93%9C2_jm2xua.png" },
                    { name: "청포도 에이드", img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784077114/%EC%B2%AD%ED%8F%AC%EB%8F%84_%EC%97%90%EC%9D%B4%EB%93%9C2_x0livi.png" },
                    { name: "제주한라봉", img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784077099/%EC%A0%9C%EC%A3%BC%ED%95%9C%EB%9D%BC%EB%B4%89_%EC%97%90%EC%9D%B4%EB%93%9C2_jqzjcl.png" },
                    { name: "밀크 쉐이크", img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784077089/%EB%B0%80%ED%81%AC%EC%89%90%EC%9D%B4%ED%81%AC_yjlpeo.png" },
                    { name: "딸기 쉐이크", img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784077100/%EB%94%B8%EA%B8%B0%EC%89%90%EC%9D%B4%ED%81%AC_baw5hu.png" },
                    { name: "쿠앤크 쉐이크", img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784077108/%EC%BF%A0%EC%95%A4%ED%81%AC%EC%89%90%EC%9D%B4%ED%81%AC_o7bpnh.png" },
                    { name: "초코 쉐이크", img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784077121/%EC%B4%88%EC%BD%94%EC%89%90%EC%9D%B4%ED%81%AC_n9e6yp.png" },
                    { name: "커피 쉐이크", img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784077132/%EC%BB%A4%ED%94%BC_%EC%89%90%EC%9D%B4%ED%81%AC2_oivnlu.png" },
                    { name: "딸기 주스", img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784077118/%EB%94%B8%EA%B8%B0%EC%A3%BC%EC%8A%A4_azoqyh.png" },
                    { name: "망고 주스", img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784077091/%EB%A7%9D%EA%B3%A0%EC%A3%BC%EC%8A%A4_wpeqh7.png" },
                    { name: "블루베리 주스", img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784077104/%EB%B8%94%EB%A3%A8%EB%B2%A0%EB%A6%AC%EC%A3%BC%EC%8A%A4_fsx74o.png" },
                    { name: "애플망고 주스", img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784077098/%EC%95%A0%ED%94%8C%EB%A7%9D%EA%B3%A0_%EC%A3%BC%EC%8A%A42_azpifg.png" },
                    { name: "오렌지 주스", img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784077094/%EC%98%A4%EB%A0%8C%EC%A7%80_%EC%A3%BC%EC%8A%A42_b1uhap.png" }
                  ].map((item, idx) => (
                    <div key={idx} className="group flex flex-col items-center">
                      <div className={`w-full aspect-square rounded-2xl overflow-hidden border border-neutral-200/20 shadow-md ${isPink ? "bg-neutral-900" : "bg-[#fffdf4]"} relative group-hover:border-amber-400 transition-all duration-300 ${
                        item.name.includes("컵팥빙수") ? "p-3.5" : ""
                      }`}>
                        <img 
                          src={getOptimizedImg(item.img, 200)} 
                          alt={item.name} 
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 opacity-95"
                        />
                      </div>
                      <span className={`text-xs sm:text-sm font-black ${textTitle} text-center mt-2 px-1 block truncate w-full`}>{item.name}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeMenuTab === "bakery" && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                  {[
                    { name: "초코칩 스콘", img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784076947/%EC%B4%88%EC%BD%94%EC%B9%A9_%EC%8A%A4%EC%BD%98_soqab0.png" },
                    { name: "플레인 스콘", img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784076947/%ED%94%8C%EB%A0%88%EC%9D%B8_%EC%8A%A4%EC%BD%98_phx4ds.png" },
                    { name: "블루베리 머핀", img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784076954/%EB%B8%94%EB%A3%A8%EB%B2%A0%EB%A6%AC_%EB%A8%B8%ED%95%80_hdg6xq.png" },
                    { name: "초코 머핀", img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784076952/%EC%B4%88%EC%BD%94_%EB%A8%B8%ED%95%80_e98zv9.png" },
                    { name: "치즈 머핀", img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784076954/%EC%B9%98%EC%A6%88_%EB%A8%B8%ED%95%80_kc5rpi.png" },
                    { name: "다크초코쿠키", img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784076959/%EB%8B%A4%ED%81%AC%EC%B4%88%EC%BD%94%EC%BF%A0%ED%82%A4_hkkivz.png" },
                    { name: "마카다미아 초코쿠키", img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784076959/%EB%A7%88%EC%B9%B4%EB%8B%A4%EB%AF%B8%EC%95%84_%EC%B4%88%EC%BD%94%EC%BF%A0%ED%82%A4_zoakjs.png" },
                    { name: "캐슈넛쿠키", img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784076960/%EC%BA%90%EC%8A%88%EB%84%9B%EC%BF%A0%ED%82%A4_l4pgm2.png" }
                  ].map((item, idx) => (
                    <div key={idx} className="group flex flex-col items-center">
                      <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden border border-neutral-200/20 shadow-md bg-neutral-950 relative group-hover:border-amber-400 transition-all duration-300">
                        <img 
                          src={getOptimizedImg(item.img, 300)} 
                          alt={item.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-95"
                        />
                      </div>
                      <span className={`text-xs sm:text-sm font-black ${textTitle} text-center mt-2 px-1 block truncate w-full`}>{item.name}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeMenuTab === "croffle" && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                  {[
                    { name: "딸기&크림 크로플", img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784076968/%EB%94%B8%EA%B8%B0_%ED%81%AC%EB%A6%BC_%ED%81%AC%EB%A1%9C%ED%94%8C_tcfyeu.png" },
                    { name: "블루베리&크림 크로플", img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784076964/%EB%B8%94%EB%A3%A8%EB%B2%A0%EB%A6%AC_%ED%81%AC%EB%A6%BC_%ED%81%AC%EB%A1%9C%ED%94%8C_yrsjlu.png" },
                    { name: "솔티드카라멜 크로플", img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784076966/%EC%86%94%ED%8B%B0%EB%93%9C%EC%B9%B4%EB%9D%BC%EB%A9%9C_%ED%81%AC%EB%A1%9C%ED%94%8C_c1t6ju.png" },
                    { name: "초코렛폭탄 크로플", img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784076969/%EC%B4%88%EC%BD%94%EB%A0%9B%ED%8F%AD%ED%83%84_%ED%81%AC%EB%A1%9C%ED%94%8C_kzpebx.png" },
                    { name: "흑당 크로플", img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784076967/%ED%9D%91%EB%8B%B9_%ED%81%AC%EB%A1%9C%ED%94%8C_yxixn1.png" },
                    { name: "산딸기 마카롱", img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784076973/%EC%82%B0%EB%94%B8%EA%B8%B0_%EB%A7%88%EC%B9%B4%EB%A1%B1_gdoku8.png" },
                    { name: "블루베리 마카롱", img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784076971/%EB%B8%94%EB%A3%A8%EB%B2%A0%EB%A6%AC_%EB%A7%88%EC%B9%B4%EB%A1%B1_ewfsgz.png" },
                    { name: "초코 마카롱", img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784076972/%EC%B4%88%EC%BD%94_%EB%A7%88%EC%B9%B4%EB%A1%B1_io4kxu.png" }
                  ].map((item, idx) => (
                    <div key={idx} className="group flex flex-col items-center">
                      <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden border border-neutral-200/20 shadow-md bg-neutral-950 relative group-hover:border-amber-400 transition-all duration-300">
                        <img 
                          src={getOptimizedImg(item.img, 300)} 
                          alt={item.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-95"
                        />
                      </div>
                      <span className={`text-xs sm:text-sm font-black ${textTitle} text-center mt-2 px-1 block truncate w-full`}>{item.name}</span>
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
            {/* Header with Predictor Summary Box */}
            <div className="text-center md:text-left space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-extrabold text-amber-500 uppercase tracking-wider block">Financial Predict</span>
                <h2 className="text-2xl sm:text-3xl font-black">
                  검증된 <span className={textHighlight}>가맹점 수익 시뮬레이션</span>
                </h2>
              </div>
              
              <div className={`p-4 rounded-xl border max-w-xl text-center md:text-left ${
                isPink 
                  ? "bg-neutral-900/40 border-neutral-800" 
                  : "bg-amber-400/5 border-amber-300"
              }`}>
                <div className="text-base sm:text-lg font-bold">
                  월매출 <span className="underline">3,000만원</span> 기준, 가맹점주 순수익 <span className="text-rose-500 dark:text-rose-400 font-extrabold text-xl sm:text-2xl">1,050만원</span> 예상
                </div>
                <p className="text-xs text-slate-400 font-semibold mt-1">테이크아웃 전문점(7평~12평) 기준 예측 가이드</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch text-left">
              <div className={`lg:col-span-8 p-6 rounded-2xl border ${isPink ? "border-neutral-850" : "border-amber-200/40"} overflow-x-auto ${innerCardBg} ${innerCardHover}`}>
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className={`border-b ${isPink ? "border-neutral-805" : "border-amber-200/40"} ${isPink ? "text-rose-455" : "text-amber-600"}`}>
                      <th className="py-3 px-4 font-black">항목</th>
                      <th className="py-3 px-4 text-right font-black">금액(원)</th>
                      <th className="py-3 px-4 text-right font-black">비율(%)</th>
                      <th className="py-3 px-4 font-black">설명</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { cat: "월 총매출", price: "30,000,000원", ratio: "100%", desc: "테이크아웃 및 배달 포함 평균 매출" },
                      { cat: "재료비/부재료", price: "9,000,000원", ratio: "30%", desc: "원두, 일회용품, 원부자재 일체" },
                      { cat: "인건비", price: "6,000,000원", ratio: "20%", desc: "직원 및 파트 타이머 고용 비용" },
                      { cat: "기타 비용", price: "4,500,000원", ratio: "15%", desc: "매장 임대료 및 기본 관리비 등" }
                    ].map((row, idx) => (
                      <tr key={idx} className={`border-b ${isPink ? "border-neutral-805/50" : "border-amber-200/20"} ${textTitle} font-bold`}>
                        <td className="py-3 px-4 font-black">{row.cat}</td>
                        <td className="py-3 px-4 text-right">{row.price}</td>
                        <td className="py-3 px-4 text-right font-mono">{row.ratio}</td>
                        <td className={`py-3 px-4 text-[11px] ${textDesc} font-semibold`}>{row.desc}</td>
                      </tr>
                    ))}
                    <tr className={`${isPink ? "bg-rose-500/20 text-rose-400" : "bg-orange-500/10 text-orange-600"} font-black`}>
                      <td className="py-4 px-4 rounded-l-xl">가맹점주 순수익</td>
                      <td className="py-4 px-4 text-right text-sm sm:text-base">10,500,000원</td>
                      <td className="py-4 px-4 text-right font-mono">35%</td>
                      <td className="py-4 px-4 rounded-r-xl text-[11px]">매출 대비 높은 마진율 확보</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="lg:col-span-4 relative group">
                <div className="relative rounded-2xl overflow-hidden border border-neutral-200/20 shadow-xl aspect-[4/3] bg-neutral-950 w-full h-full">
                  <img 
                    src="https://res.cloudinary.com/dfarfqx7e/image/upload/f_auto,q_auto/v1781590218/ChatGPT_Image_2026%EB%85%84_6%EC%9B%94_9%EC%9D%BC_%EC%98%A4%ED%9B%84_05_44_25_dmwlfs.png" 
                    alt="Arabica specialty coffee beans" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Row: Pie Chart & Point Cards */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pt-6 border-t border-neutral-200/10 text-left">
              {/* Donut Pie Chart Container */}
              <div className="md:col-span-5 flex flex-col sm:flex-row items-center justify-center gap-6">
                <div className="relative w-32 h-32 shrink-0">
                  <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                    {/* Background Circle */}
                    <circle cx="18" cy="18" r="12.5" fill="transparent" stroke={isPink ? "#262626" : "#f3f4f6"} strokeWidth="5" pathLength={100}></circle>
                    {/* 30% 재료비 (grey) - offset 0 */}
                    <circle cx="18" cy="18" r="12.5" fill="transparent" stroke="#94a3b8" strokeWidth="5" strokeDasharray="30 70" strokeDashoffset="0" pathLength={100}></circle>
                    {/* 20% 인건비 (blue-grey) - offset -30 */}
                    <circle cx="18" cy="18" r="12.5" fill="transparent" stroke="#64748b" strokeWidth="5" strokeDasharray="20 80" strokeDashoffset="-30" pathLength={100}></circle>
                    {/* 15% 기타비용 (orange) - offset -50 */}
                    <circle cx="18" cy="18" r="12.5" fill="transparent" stroke="#f97316" strokeWidth="5" strokeDasharray="15 85" strokeDashoffset="-50" pathLength={100}></circle>
                    {/* 35% 순수익 (yellow) - offset -65 */}
                    <circle cx="18" cy="18" r="12.5" fill="transparent" stroke="#fbbf24" strokeWidth="5" strokeDasharray="35 65" strokeDashoffset="-65" pathLength={100}></circle>
                  </svg>
                  {/* Inside Center Text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-[10px] font-black text-slate-400 leading-none">순수익</span>
                    <span className={`text-sm font-black mt-0.5 ${isPink ? "text-rose-400" : "text-amber-500"}`}>35%</span>
                  </div>
                </div>
                
                {/* Chart Legends */}
                <div className="grid grid-cols-2 sm:grid-cols-1 gap-1.5 text-[11px] font-extrabold shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#fbbf24] shrink-0"></span>
                    <span>35% 순수익</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#94a3b8] shrink-0"></span>
                    <span>30% 재료비/부재료</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#64748b] shrink-0"></span>
                    <span>20% 인건비</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#f97316] shrink-0"></span>
                    <span>15% 기타 비용</span>
                  </div>
                </div>
              </div>

              {/* Point Cards */}
              <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Point Card 1 */}
                <div className={`p-4 rounded-xl border flex items-start gap-3.5 ${
                  isPink ? "bg-neutral-900/50 border-neutral-800" : "bg-white border-amber-100 shadow-sm"
                }`}>
                  <div className="w-9 h-9 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                    <span className="text-base">🎯</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-blue-500">핵심 포인트</h4>
                    <p className={`text-[11px] font-semibold mt-1 leading-normal ${textDesc}`}>작은 평수에서도 높은 수익률을 기대할 수 있는 구조</p>
                  </div>
                </div>

                {/* Point Card 2 */}
                <div className={`p-4 rounded-xl border flex items-start gap-3.5 ${
                  isPink ? "bg-neutral-900/50 border-neutral-800" : "bg-white border-amber-100 shadow-sm"
                }`}>
                  <div className="w-9 h-9 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                    <span className="text-base">📈</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-green-500">수익 구조</h4>
                    <p className={`text-[11px] font-semibold mt-1 leading-normal ${textDesc}`}>배달과 테이크아웃 결합 시 매출 안정성 강화</p>
                  </div>
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

          {/* Top Title, Subtitle, Wreath Badge, Hashtags */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10 pb-6 border-b border-neutral-200/10">
            <div className="text-left space-y-3">
              <span className={`text-xs font-black px-2.5 py-1 ${isPink ? "bg-rose-500/10 text-rose-455 border-rose-500/20" : "bg-amber-400/10 text-amber-600 border-amber-400/20"} border rounded-full`}>
                창업 모델 A
              </span>
              <h2 className={`text-2xl sm:text-3xl md:text-4xl font-black leading-tight ${textTitle}`}>
                샵인샵<span className="text-sm sm:text-base font-semibold text-slate-400 ml-1.5 font-mono">(shop in shop)</span><br />
                <span className={textHighlight}>매출 두배</span> 창업
              </h2>
              <div className="flex flex-wrap gap-2 pt-1">
                <span className={`text-[11px] font-extrabold px-2.5 py-1 rounded bg-[#ffd500]/10 text-[#ffd500] border border-[#ffd500]/20`}>
                  #거품 없는 도입 비용
                </span>
                <span className={`text-[11px] font-extrabold px-2.5 py-1 rounded bg-[#ffd500]/10 text-[#ffd500] border border-[#ffd500]/20`}>
                  #가맹비/교육비/로열티 3無
                </span>
              </div>
            </div>

            {/* Laurel Wreath Badge */}
            <div className="relative flex items-center justify-center w-36 h-32 shrink-0 mx-auto lg:mx-0">
              <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full text-amber-500/80">
                {/* Left Laurel Branch */}
                <path 
                  d="M 45,85 C 25,80 15,60 20,40 C 23,28 32,18 45,15" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.2" 
                  strokeLinecap="round"
                />
                {/* Left Leaves */}
                <path d="M 20,65 Q 12,62 17,55 Q 23,58 21,65 Z" fill="currentColor" />
                <path d="M 17,50 Q 8,46 14,40 Q 20,43 18,50 Z" fill="currentColor" />
                <path d="M 22,33 Q 15,25 23,21 Q 28,27 24,33 Z" fill="currentColor" />
                <path d="M 33,20 Q 28,10 36,8 Q 39,17 34,20 Z" fill="currentColor" />

                {/* Right Laurel Branch */}
                <path 
                  d="M 55,85 C 75,80 85,60 80,40 C 77,28 68,18 55,15" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.2" 
                  strokeLinecap="round"
                />
                {/* Right Leaves */}
                <path d="M 80,65 Q 88,62 83,55 Q 77,58 79,65 Z" fill="currentColor" />
                <path d="M 83,50 Q 92,46 86,40 Q 80,43 82,50 Z" fill="currentColor" />
                <path d="M 78,33 Q 85,25 77,21 Q 72,27 76,33 Z" fill="currentColor" />
                <path d="M 67,20 Q 72,10 64,8 Q 61,17 66,20 Z" fill="currentColor" />
              </svg>
              
              <div className="z-10 flex flex-col items-center text-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-amber-500 mb-0.5">
                  <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7z" />
                  <path d="M3 20h18" />
                </svg>
                <span className="text-[7px] text-amber-500 tracking-wider -mt-0.5 mb-0.5">★★★★★</span>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-3xl font-black text-rose-500 tracking-tight">330</span>
                  <span className="text-xs font-black text-rose-500">만원부터</span>
                </div>
                <span className="text-[9px] font-bold text-slate-450 -mt-0.5">VAT 별도</span>
              </div>
            </div>
          </div>

          {/* Vertical list of packages */}
          <div className="space-y-8 text-left">
            {/* Package 1: 120겹파이 올인원 패키지 */}
            <div className={`p-5 sm:p-7 rounded-2xl border ${isPink ? "border-neutral-805 bg-neutral-900/40" : "border-amber-200/50 bg-white"} shadow-sm`}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 pb-3 border-b border-neutral-200/10">
                <span className={`text-sm sm:text-base font-black px-3.5 py-1 ${isPink ? "bg-rose-500/10 text-rose-455" : "bg-orange-500/10 text-orange-600"} rounded-full`}>
                  120겹파이 올인원 패키지
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 font-bold line-through">5,500,000원</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg sm:text-xl font-black text-rose-500">4,400,000</span>
                    <span className="text-xs font-bold text-rose-500">원</span>
                    <span className="text-[10px] text-slate-400 font-bold ml-1">VAT별도</span>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded-xl border border-neutral-200/15 bg-neutral-950/5">
                <table className="w-full text-left border-collapse text-[11px] sm:text-xs min-w-[650px] lg:min-w-0">
                  <thead>
                    <tr className={`border-b ${isPink ? "border-neutral-805 bg-neutral-900/40 text-rose-455" : "border-amber-200/40 bg-amber-500/5 text-amber-600"} font-bold`}>
                      <th className="py-2.5 px-4 font-black w-[20%]">구분</th>
                      <th className="py-2.5 px-4 font-black w-[45%]">세부 내용</th>
                      <th className="py-2.5 px-4 font-black w-[35%]">비고</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { cat: "전용 베이킹 인프라", detail: "자체 금형 오리지널 파이 머신 1ea", note: "120겹 파이 결을 살리는 전용 베이킹 머신" },
                      { cat: "초도 원재료 패키지", detail: "시그니처 패스트리 생지 1box + 프리미엄 필링 9종 각 1kg", note: "파이 약 200개 분량 생지와 대표 맛 필링 초도 지원" },
                      { cat: "매장 홍보물 세트", detail: "공식 X배너 2종 + POP 5종 + 메뉴 홍보 포스터 8종", note: "매장 내외부 고객 시선을 끌기 위한 홍보물 구성" },
                      { cat: "판매 촉진 비주얼 세트", detail: "파이 모형 4종 + 배달 플랫폼용 실사 이미지", note: "오프라인 진열과 배달앱 등록에 활용 가능한 비주얼 자료" },
                      { cat: "운영 정착 지원", detail: "포장 부자재 세트 + 오븐 설치 및 1:1 조리 교육", note: "포장 운영, 장비 세팅, 현장 조리 교육까지 지원" }
                    ].map((row, idx) => (
                      <tr key={idx} className={`border-b last:border-0 ${isPink ? "border-neutral-805/50" : "border-amber-200/20"} ${textTitle} font-bold`}>
                        <td className={`py-3 px-4 ${isPink ? "text-rose-400/80" : "text-amber-700"} font-black`}>{row.cat}</td>
                        <td className="py-3 px-4 font-medium">{row.detail}</td>
                        <td className={`py-3 px-4 text-[10px] sm:text-[11px] ${textDesc} font-semibold`}>{row.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Package 2: 에그120 프리미엄 패키지 */}
            <div className={`p-5 sm:p-7 rounded-2xl border ${isPink ? "border-neutral-805 bg-neutral-900/40" : "border-amber-200/50 bg-white"} shadow-sm`}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 pb-3 border-b border-neutral-200/10">
                <span className={`text-sm sm:text-base font-black px-3.5 py-1 ${isPink ? "bg-rose-500/10 text-rose-455" : "bg-orange-500/10 text-orange-600"} rounded-full`}>
                  에그120 프리미엄 패키지
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 font-bold line-through">4,400,000원</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg sm:text-xl font-black text-rose-500">3,300,000</span>
                    <span className="text-xs font-bold text-rose-500">원</span>
                    <span className="text-[10px] text-slate-400 font-bold ml-1">VAT별도</span>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded-xl border border-neutral-200/15 bg-neutral-950/5">
                <table className="w-full text-left border-collapse text-[11px] sm:text-xs min-w-[650px] lg:min-w-0">
                  <thead>
                    <tr className={`border-b ${isPink ? "border-neutral-805 bg-neutral-900/40 text-rose-455" : "border-amber-200/40 bg-amber-500/5 text-amber-600"} font-bold`}>
                      <th className="py-2.5 px-4 font-black w-[20%]">구분</th>
                      <th className="py-2.5 px-4 font-black w-[45%]">세부 내용</th>
                      <th className="py-2.5 px-4 font-black w-[35%]">비고</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { cat: "전용 조리 인프라", detail: "에그120 계란빵 전용 머신 1대", note: "10구 동시 생산이 가능한 에그120 전용 기기" },
                      { cat: "초도 원재료 패키지", detail: "시그니처 전용 반죽 30kg + 토핑 식재료 4종 + 동물복지 유정란 120ea", note: "계란빵 약 720개 조리 가능한 반죽과 핵심 식재료 초도 지원" },
                      { cat: "매장 홍보물 세트", detail: "공식 X배너 1ea + 테이블/카운티 POP 1ea + 홍보 포스터 3종", note: "매장 내외부에서 egg120 메뉴를 노출하기 위한 홍보물 구성" },
                      { cat: "판매 촉진 비주얼 세트", detail: "계란빵 모형 4종 + 전용 미니 쇼케이스 + 동물복지 인증 매장 판넬", note: "카운터 진열, 신뢰도 강화, 주문 유도를 위한 시각 자료" },
                      { cat: "운영 정착 지원", detail: "배달 플랫폼 셋업 대행 + 포장/부재료 패키지 + 기기 설치 및 1:1 교육", note: "배달앱 등록, 포장 운영, 장비 설치, 현장 교육까지 지원" }
                    ].map((row, idx) => (
                      <tr key={idx} className={`border-b last:border-0 ${isPink ? "border-neutral-805/50" : "border-amber-200/20"} ${textTitle} font-bold`}>
                        <td className={`py-3 px-4 ${isPink ? "text-rose-400/80" : "text-amber-700"} font-black`}>{row.cat}</td>
                        <td className="py-3 px-4 font-medium">{row.detail}</td>
                        <td className={`py-3 px-4 text-[10px] sm:text-[11px] ${textDesc} font-semibold`}>{row.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Package 3: 120 시리즈 결합 패키지 */}
            <div className={`p-5 sm:p-7 rounded-2xl border ${isPink ? "border-neutral-805 bg-neutral-900/40" : "border-amber-200/50 bg-white"} shadow-sm`}>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-3">
                  <span className={`text-sm sm:text-base font-black px-3.5 py-1 ${isPink ? "bg-rose-500/10 text-rose-455" : "bg-orange-500/10 text-orange-600"} rounded-full inline-block`}>
                    120 시리즈 결합 패키지 (120겹 파이 + 에그120)
                  </span>
                  
                  {/* Two small product thumbnail images side by side */}
                  <div className="flex gap-4 pt-1 items-center">
                    <div className="flex -space-x-4">
                      <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-md bg-neutral-900 shrink-0">
                        <img 
                          src="https://res.cloudinary.com/dfarfqx7e/image/upload/w_100,q_auto,f_auto/v1781183595/120%EA%B2%B9%ED%8C%8C%EC%9D%B4_%ED%81%AC%EB%A6%BC%EC%B9%98%EC%A6%88_%EC%95%A0%ED%94%8C_%EB%B8%94%EB%A3%A8%EB%B2%A0%EB%A6%AC_%EC%97%B0%EC%B6%9C_bzyzzs.jpg" 
                          alt="120겹 파이" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-md bg-neutral-900 shrink-0">
                        <img 
                          src="https://res.cloudinary.com/dfarfqx7e/image/upload/w_100,q_auto,f_auto/v1781184083/120egg_45_dqgrir.jpg" 
                          alt="에그120 계란빵" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <span className={`text-xs ${textDesc} font-bold leading-normal`}>
                      120겹 파이와 에그120 계란빵 두 가지 시그니처 메뉴를<br className="hidden sm:inline" /> 하나의 매장에 완벽하게 결합
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end shrink-0 w-full md:w-auto border-t md:border-t-0 border-neutral-200/10 pt-3 md:pt-0">
                  <span className="text-xs text-slate-400 font-bold line-through">9,900,000원</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-xl sm:text-2xl font-black text-rose-500">6,900,000</span>
                    <span className="text-xs font-bold text-rose-500">원</span>
                    <span className="text-[11px] text-slate-400 font-bold ml-1.5">VAT별도</span>
                  </div>
                </div>
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
            <span className="text-xs font-black text-slate-400">HYBRID TAKE-OUT CAFE</span>
          </div>

          {/* Top Title, Subtitle, Wreath Badge, Hashtags */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8 pb-6 border-b border-neutral-200/10">
            <div className="text-left space-y-3">
              <span className={`text-xs font-black px-2.5 py-1 ${isPink ? "bg-rose-500/10 text-rose-455 border-rose-500/20" : "bg-amber-400/10 text-amber-600 border-amber-400/20"} border rounded-full`}>
                창업 모델 B
              </span>
              <h2 className={`text-2xl sm:text-3xl md:text-4xl font-black leading-tight ${textTitle}`}>
                소자본<br />
                <span className={textHighlight}>하이브리드</span> 창업
              </h2>
              <div className="flex flex-wrap gap-2 pt-1">
                <span className={`text-[11px] font-extrabold px-2.5 py-1 rounded bg-[#ffd500]/10 text-[#ffd500] border border-[#ffd500]/20`}>
                  #기존 카페 운영하시는 사장님
                </span>
                <span className={`text-[11px] font-extrabold px-2.5 py-1 rounded bg-[#ffd500]/10 text-[#ffd500] border border-[#ffd500]/20`}>
                  #업종 전환 최적화
                </span>
              </div>
            </div>

            {/* Laurel Wreath Badge */}
            <div className="relative flex items-center justify-center w-36 h-32 shrink-0 mx-auto lg:mx-0">
              <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full text-amber-500/80">
                {/* Left Laurel Branch */}
                <path 
                  d="M 45,85 C 25,80 15,60 20,40 C 23,28 32,18 45,15" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.2" 
                  strokeLinecap="round"
                />
                {/* Left Leaves */}
                <path d="M 20,65 Q 12,62 17,55 Q 23,58 21,65 Z" fill="currentColor" />
                <path d="M 17,50 Q 8,46 14,40 Q 20,43 18,50 Z" fill="currentColor" />
                <path d="M 22,33 Q 15,25 23,21 Q 28,27 24,33 Z" fill="currentColor" />
                <path d="M 33,20 Q 28,10 36,8 Q 39,17 34,20 Z" fill="currentColor" />

                {/* Right Laurel Branch */}
                <path 
                  d="M 55,85 C 75,80 85,60 80,40 C 77,28 68,18 55,15" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.2" 
                  strokeLinecap="round"
                />
                {/* Right Leaves */}
                <path d="M 80,65 Q 88,62 83,55 Q 77,58 79,65 Z" fill="currentColor" />
                <path d="M 83,50 Q 92,46 86,40 Q 80,43 82,50 Z" fill="currentColor" />
                <path d="M 78,33 Q 85,25 77,21 Q 72,27 76,33 Z" fill="currentColor" />
                <path d="M 67,20 Q 72,10 64,8 Q 61,17 66,20 Z" fill="currentColor" />
              </svg>
              
              <div className="z-10 flex flex-col items-center text-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-amber-500 mb-0.5">
                  <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7z" />
                  <path d="M3 20h18" />
                </svg>
                <span className="text-[7px] text-amber-500 tracking-wider -mt-0.5 mb-0.5">★★★★★</span>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-3xl font-black text-rose-500 tracking-tight">980</span>
                  <span className="text-xs font-black text-rose-500">만원</span>
                </div>
                <span className="text-[9px] font-bold text-slate-450 -mt-0.5">VAT 별도</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch text-left">
            {/* Left Info: 하이브리드 창업이란? */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
              <div className={`p-5 rounded-2xl border ${isPink ? "bg-neutral-900/30 border-rose-500/20" : "bg-amber-400/5 border-amber-300"} h-full flex flex-col justify-center`}>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs font-black px-2.5 py-1 rounded ${isPink ? "bg-rose-500/20 text-rose-455" : "bg-amber-400 text-neutral-900"} font-bold`}>
                    하이브리드 창업이란?
                  </span>
                </div>
                <ul className={`space-y-2.5 text-xs font-bold ${textDesc}`}>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5 shrink-0">✔</span>
                    <span>인테리어 장비의 부담을 없애고 간판과 사인물 교체만으로 창업</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5 shrink-0">✔</span>
                    <span>메뉴와 홍보를 중심으로 실질적인 매출 중점 관리</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5 shrink-0">✔</span>
                    <span>로열티 등 추가 비용 면제</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right: Pricing Table details */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div className={`p-5 sm:p-6 rounded-2xl border ${isPink ? "border-neutral-805 bg-neutral-900/40" : "border-amber-200/50 bg-white"} shadow-sm h-full`}>
                <div className="flex justify-between items-center mb-3">
                  <span className={`text-xs font-black ${isPink ? "text-rose-455" : "text-amber-600"} uppercase tracking-wider block`}>
                    10평대 창업비 <span className="text-[10px] text-slate-455 ml-1 font-mono">HYBRID START UP COST</span>
                  </span>
                  <span className="text-[10px] text-slate-450 font-bold">VAT별도</span>
                </div>

                <div className="overflow-x-auto rounded-xl border border-neutral-200/15 bg-neutral-950/5">
                  <table className="w-full text-left border-collapse text-[11px] sm:text-xs min-w-[500px] lg:min-w-0">
                    <thead>
                      <tr className={`border-b ${isPink ? "border-neutral-805 bg-neutral-900/40 text-rose-455" : "border-amber-200/40 bg-amber-500/5 text-amber-600"} font-bold`}>
                        <th className="py-2 px-3 font-black w-[18%]">구분</th>
                        <th className="py-2 px-3 font-black w-[50%]">세부 내용</th>
                        <th className="py-2 px-3 font-black text-right w-[17%]">금액</th>
                        <th className="py-2 px-3 font-black w-[15%]">비고</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { cat: "가맹비", detail: "120겹파이 브랜드에 대한 상권 내 독점 사용권, 교육 및 개점 지원 등", price: "100만원", note: "소멸성" },
                        { cat: "장비", detail: "파이 머신, 계란빵 머신 외", price: "150만원", note: "기본 품목 외 별도" },
                        { cat: "간판", detail: "전면 돌출 실사 어닝 외", price: "300만원", note: "현장 상황에 따라 상이함" },
                        { cat: "물품(초도)", detail: "식재료, 원부자재, 유니폼, 메뉴판, 배너, 현수막, 시트지 및 각종 홍보물", price: "300만원", note: "-" },
                        { cat: "홍보비", detail: "사전 이벤트, 스마트 플레이스 등록 세팅, 배민, 쿠팡잇츠, 요기요 등록 세팅, 인스타/당근 타깃 마케팅, 네이버 블로그 마케팅, 그랜드 오픈 현수막/배너", price: "130만원", note: "-" }
                      ].map((row, idx) => (
                        <tr key={idx} className={`border-b last:border-0 ${isPink ? "border-neutral-850/50" : "border-amber-200/20"} ${textTitle} font-bold`}>
                          <td className={`py-2 px-3 ${isPink ? "text-rose-400/80" : "text-amber-700"} font-black`}>{row.cat}</td>
                          <td className="py-2 px-3 font-medium text-[10.5px] leading-relaxed">{row.detail}</td>
                          <td className="py-2 px-3 text-right font-black text-rose-500 whitespace-nowrap">{row.price}</td>
                          <td className={`py-2 px-3 text-[10px] ${textDesc} font-semibold`}>{row.note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Bullet notes below */}
          <div className={`mt-6 p-4 rounded-xl border ${isPink ? "bg-neutral-950/40 border-neutral-850 text-slate-400" : "bg-amber-500/5 border-amber-200/30 text-slate-500"} text-[10.5px] sm:text-xs font-bold text-left space-y-1`}>
            <p className="flex items-start gap-1.5">
              <span>•</span>
              <span>점주가 직접 시공 가능 (단, 감리는 본사 진행)</span>
            </p>
            <p className="flex items-start gap-1.5">
              <span>•</span>
              <span>상기 비용은 본사 매뉴얼에 따른 창업 비용이며, 점포의 면적, 상권, 가맹점 형태에 따라 금액은 변동될 수 있습니다.</span>
            </p>
            <p className="flex items-start gap-1.5">
              <span>•</span>
              <span>인테리어 개별 시공 및 부분 시공이 가능하며 도면, 설계, 감리는 무료입니다.</span>
            </p>
          </div>

          {/* Bottom Storefront Image */}
          <div className="mt-8 rounded-2xl overflow-hidden border border-neutral-200/20 shadow-xl aspect-[21/9] sm:aspect-[32/10] bg-neutral-950 w-full relative group">
            <img 
              src="https://res.cloudinary.com/dfarfqx7e/image/upload/f_auto,q_auto/v1781590223/ChatGPT_Image_2026%EB%85%84_6%EC%9B%94_9%EC%9D%BC_%EC%98%A4%ED%9B%84_09_02_58_dhg5yy.png" 
              alt="120PIE COFFEE store storefront exterior" 
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700 opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end p-4">
              <span className="text-white text-xs sm:text-sm font-black drop-shadow">120PIE COFFEE 대표 가맹점 전경</span>
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

          {/* Top Title, Subtitle, Wreath Badge, Hashtags */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8 pb-6 border-b border-neutral-200/10">
            <div className="text-left space-y-3">
              <span className={`text-xs font-black px-2.5 py-1 ${isPink ? "bg-rose-500/10 text-rose-455 border-rose-500/20" : "bg-amber-400/10 text-amber-600 border-amber-400/20"} border rounded-full`}>
                창업 모델 C
              </span>
              <h2 className={`text-2xl sm:text-3xl md:text-4xl font-black leading-tight ${textTitle}`}>
                신규 가맹<br />
                <span className={textHighlight}>정식 창업</span>
              </h2>
              <div className="flex flex-wrap gap-2 pt-1">
                <span className={`text-[11px] font-extrabold px-2.5 py-1 rounded bg-[#ffd500]/10 text-[#ffd500] border border-[#ffd500]/20`}>
                  #신규 창업을 준비하는 예비 점주님
                </span>
                <span className={`text-[11px] font-extrabold px-2.5 py-1 rounded bg-[#ffd500]/10 text-[#ffd500] border border-[#ffd500]/20`}>
                  #홀&배달 동시 운영을 희망하는 점주님
                </span>
              </div>
            </div>

            {/* Laurel Wreath Badge */}
            <div className="relative flex items-center justify-center w-36 h-32 shrink-0 mx-auto lg:mx-0">
              <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full text-amber-500/80">
                {/* Left Laurel Branch */}
                <path 
                  d="M 45,85 C 25,80 15,60 20,40 C 23,28 32,18 45,15" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.2" 
                  strokeLinecap="round"
                />
                {/* Left Leaves */}
                <path d="M 20,65 Q 12,62 17,55 Q 23,58 21,65 Z" fill="currentColor" />
                <path d="M 17,50 Q 8,46 14,40 Q 20,43 18,50 Z" fill="currentColor" />
                <path d="M 22,33 Q 15,25 23,21 Q 28,27 24,33 Z" fill="currentColor" />
                <path d="M 33,20 Q 28,10 36,8 Q 39,17 34,20 Z" fill="currentColor" />

                {/* Right Laurel Branch */}
                <path 
                  d="M 55,85 C 75,80 85,60 80,40 C 77,28 68,18 55,15" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.2" 
                  strokeLinecap="round"
                />
                {/* Right Leaves */}
                <path d="M 80,65 Q 88,62 83,55 Q 77,58 79,65 Z" fill="currentColor" />
                <path d="M 83,50 Q 92,46 86,40 Q 80,43 82,50 Z" fill="currentColor" />
                <path d="M 78,33 Q 85,25 77,21 Q 72,27 76,33 Z" fill="currentColor" />
                <path d="M 67,20 Q 72,10 64,8 Q 61,17 66,20 Z" fill="currentColor" />
              </svg>
              
              <div className="z-10 flex flex-col items-center text-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-amber-500 mb-0.5">
                  <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7z" />
                  <path d="M3 20h18" />
                </svg>
                <span className="text-[7px] text-amber-500 tracking-wider -mt-0.5 mb-0.5">★★★★★</span>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-3xl font-black text-rose-500 tracking-tight">6,518</span>
                  <span className="text-xs font-black text-rose-500">만원</span>
                </div>
                <span className="text-[9px] font-bold text-slate-450 -mt-0.5">VAT 별도</span>
              </div>
            </div>
          </div>

          {/* Pricing Tables Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-left items-stretch">
            {/* Table 1: 기본 비용 */}
            <div className={`p-5 sm:p-6 rounded-2xl border ${isPink ? "border-neutral-805 bg-neutral-900/40" : "border-amber-200/50 bg-white"} shadow-sm flex flex-col justify-between`}>
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className={`text-xs font-black ${isPink ? "text-rose-455" : "text-amber-600"} uppercase tracking-wider block`}>
                    ■ 기본 비용 - 1,040만원
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold">VAT별도</span>
                </div>

                <div className="overflow-x-auto rounded-xl border border-neutral-200/15 bg-neutral-950/5">
                  <table className="w-full text-left border-collapse text-[11px] sm:text-xs min-w-[480px] lg:min-w-0">
                    <thead>
                      <tr className={`border-b ${isPink ? "border-neutral-805 bg-neutral-900/40 text-rose-455" : "border-amber-200/40 bg-amber-500/5 text-amber-600"} font-bold`}>
                        <th className="py-2 px-3 font-black w-[20%]">구분</th>
                        <th className="py-2 px-3 font-black w-[50%]">세부 내용</th>
                        <th className="py-2 px-3 font-black text-right w-[17%]">금액</th>
                        <th className="py-2 px-3 font-black w-[13%]">비고</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { cat: "가맹비", detail: "120겹파이 브랜드에 대한 상권 내 독점 사용권, 교육 및 개점 지원 등", price: "500만원", note: "소멸성" },
                        { cat: "초도 물품비", detail: "원부자재, 유니폼, 메뉴판, 배너, 현수막, 시트지 및 각종 홍보물", price: "440만원", note: "-" },
                        { cat: "계약 이행 보증금", detail: "보증금", price: "100만원", note: "만기 상환" },
                        { cat: "로열티", detail: "시즌 마케팅 각종 스팟성 홍보물", price: "11만원", note: "월납" }
                      ].map((row, idx) => (
                        <tr key={idx} className={`border-b last:border-0 ${isPink ? "border-neutral-850/50" : "border-amber-200/20"} ${textTitle} font-bold`}>
                          <td className={`py-2.5 px-3 ${isPink ? "text-rose-400/80" : "text-amber-700"} font-black`}>{row.cat}</td>
                          <td className="py-2.5 px-3 font-medium text-[10.5px] leading-relaxed">{row.detail}</td>
                          <td className="py-2.5 px-3 text-right font-black text-rose-500 whitespace-nowrap">{row.price}</td>
                          <td className={`py-2.5 px-3 text-[10px] ${textDesc} font-semibold`}>{row.note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Table 2: 기타 비용 */}
            <div className={`p-5 sm:p-6 rounded-2xl border ${isPink ? "border-neutral-805 bg-neutral-900/40" : "border-amber-200/50 bg-white"} shadow-sm flex flex-col justify-between`}>
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className={`text-xs font-black ${isPink ? "text-rose-455" : "text-amber-600"} uppercase tracking-wider block`}>
                    ■ 기타 비용 - 5,478만원
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold">VAT별도</span>
                </div>

                <div className="overflow-x-auto rounded-xl border border-neutral-200/15 bg-neutral-950/5">
                  <table className="w-full text-left border-collapse text-[11px] sm:text-xs min-w-[480px] lg:min-w-0">
                    <thead>
                      <tr className={`border-b ${isPink ? "border-neutral-805 bg-neutral-900/40 text-rose-455" : "border-amber-200/40 bg-amber-500/5 text-amber-600"} font-bold`}>
                        <th className="py-2 px-3 font-black w-[22%]">구분</th>
                        <th className="py-2 px-3 font-black w-[48%]">세부 내용</th>
                        <th className="py-2 px-3 font-black text-right w-[17%]">금액</th>
                        <th className="py-2 px-3 font-black w-[13%]">비고</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { cat: "인테리어 / 시설", detail: "목공, 전기, 도장, 조명, 타일, 미장, 설계 및 감리", price: "2,850만원", note: "평당 190만원" },
                        { cat: "주방 / 주방 집기류", detail: "싱크대, 디스펜서, 제빙기, 서랍식 냉장고, 커피머신", price: "2,200만원", note: "기본 품목 외 별도" },
                        { cat: "간판", detail: "전면 돌출 실사 등", price: "330만원", note: "현장 상황에 따라 상이함" },
                        { cat: "기타", detail: "키오스크, 포스 주방 관련, 의탁자", price: "440만원", note: "-" }
                      ].map((row, idx) => (
                        <tr key={idx} className={`border-b last:border-0 ${isPink ? "border-neutral-850/50" : "border-amber-200/20"} ${textTitle} font-bold`}>
                          <td className={`py-2.5 px-3 ${isPink ? "text-rose-400/80" : "text-amber-700"} font-black`}>{row.cat}</td>
                          <td className="py-2.5 px-3 font-medium text-[10.5px] leading-relaxed">{row.detail}</td>
                          <td className="py-2.5 px-3 text-right font-black text-rose-500 whitespace-nowrap">{row.price}</td>
                          <td className={`py-2.5 px-3 text-[10px] ${textDesc} font-semibold`}>{row.note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Bullet notes below */}
          <div className={`mt-6 p-4 rounded-xl border ${isPink ? "bg-neutral-950/40 border-neutral-850 text-slate-400" : "bg-amber-500/5 border-amber-200/30 text-slate-500"} text-[10.5px] sm:text-xs font-bold text-left space-y-1`}>
            <p className="flex items-start gap-1.5">
              <span>•</span>
              <span>점주가 직접 시공 가능 (단, 감리는 본사 진행)</span>
            </p>
            <p className="flex items-start gap-1.5">
              <span>•</span>
              <span>점포 투자 비용은 규모의 특성에 따라 달라질 수 있으며 부가세는 별도입니다.</span>
            </p>
            <p className="flex items-start gap-1.5">
              <span>•</span>
              <span>의탁자, 메뉴보드는 옵션입니다.</span>
            </p>
            <p className="flex items-start gap-1.5">
              <span>•</span>
              <span>간판 및 모든 조명은 효율성이 높은 LED 전구를 기본으로 채택, 사용합니다.</span>
            </p>
            <p className="flex items-start gap-1.5">
              <span>•</span>
              <span>철거, 전기 증설, 소방 경비 외 계약서에 명시된 별도 공사 내역, 간판, 가구, 아웃테리어는 현장 견적으로 별도입니다.</span>
            </p>
          </div>

          {/* Bottom Store Interior Mockup Image */}
          <div className="mt-8 rounded-2xl overflow-hidden border border-neutral-200/20 shadow-xl aspect-[21/9] sm:aspect-[32/10] bg-neutral-950 w-full relative group">
            <img 
              src="https://res.cloudinary.com/dfarfqx7e/image/upload/f_auto,q_auto/v1781590220/ChatGPT_Image_2026%EB%85%84_6%EC%9B%94_9%EC%9D%BC_%EC%98%A4%ED%9B%84_05_12_23_dqjfic.png" 
              alt="120PIE COFFEE store interior setup mockup" 
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700 opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end p-4">
              <span className="text-white text-xs sm:text-sm font-black drop-shadow">120PIE COFFEE 가맹점 내부 인프라</span>
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
            <span className="text-xs font-black text-slate-400">5-STEP LAUNCH ROADMAP</span>
          </div>

          <div className="space-y-10">
            {/* Top row: Left Title, Right Support points */}
            <div className="flex flex-col lg:flex-row justify-between items-stretch gap-6 text-left">
              {/* Left Title & Subtitle */}
              <div className="flex flex-col justify-center space-y-3 lg:w-[45%]">
                <span className="text-xs font-bold text-amber-500 tracking-wider uppercase font-mono">
                  Franchise Process
                </span>
                <h2 className={`text-3xl sm:text-4xl font-black leading-tight ${textTitle}`}>
                  체계적인 <br />
                  <span className={textHighlight}>창업 절차</span>
                </h2>
                <p className={`text-sm sm:text-base leading-relaxed ${textDesc} font-bold pt-1`}>
                  계약부터 오픈 이후 사후관리까지, 본사의 밀착 케어 시스템으로 안정적인 창업을 지원합니다.
                </p>
              </div>

              {/* Right Support Points Card */}
              <div className={`p-5 sm:p-6 rounded-2xl border ${isPink ? "bg-neutral-900/30 border-rose-500/20" : "bg-amber-400/5 border-amber-200/40"} lg:w-[50%] flex flex-col justify-center`}>
                <h3 className={`text-xs font-black tracking-wider ${isPink ? "text-rose-455" : "text-amber-600"} mb-4 text-center lg:text-left`}>
                  본사 지원 포인트
                </h3>
                <div className="grid grid-cols-2 gap-3.5">
                  {[
                    { label: "상권 분석", icon: <MapPin className="w-4 h-4 shrink-0" /> },
                    { label: "메뉴 교육", icon: <ChefHat className="w-4 h-4 shrink-0" /> },
                    { label: "오픈 세팅", icon: <Store className="w-4 h-4 shrink-0" /> },
                    { label: "사후 관리", icon: <Users className="w-4 h-4 shrink-0" /> }
                  ].map((item, idx) => (
                    <div 
                      key={idx} 
                      className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-sm justify-center font-black transition-all duration-300 hover:scale-[1.02] ${
                        isPink 
                          ? "bg-rose-500/10 hover:bg-rose-500/20 text-rose-200 border border-rose-500/20" 
                          : "bg-[#ffd500] hover:bg-[#ffe14d] text-neutral-900"
                      }`}
                    >
                      {item.icon}
                      <span className="text-xs sm:text-sm tracking-wide">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom row: Steps list on left, Photos stack on right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch text-left">
              {/* Left Column: Steps (01 to 05) */}
              <div className="lg:col-span-7 flex flex-col justify-between gap-4">
                {[
                  { num: "01", title: "창업 상담 및 매장 상황/상권 분석" },
                  { num: "02", title: "아이템 선정 및 맞춤형 가맹 계약" },
                  { num: "03", title: "본사 전문가의 메뉴 교육 및 파이 레시피 제공" },
                  { num: "04", title: "본사 패키지 세팅 및 매장 그랜드 오픈" },
                  { num: "05", title: "지속적인 신메뉴 개발 및 철저한 사후 매출 관리" }
                ].map((step, idx) => (
                  <div 
                    key={idx} 
                    className={`flex items-stretch rounded-2xl border transition-all duration-300 hover:scale-[1.01] overflow-hidden ${
                      isPink 
                        ? "bg-neutral-900/40 border-neutral-805/70 hover:border-rose-500/30" 
                        : "bg-[#fffdeb] border-amber-250/40 hover:border-amber-400"
                    }`}
                  >
                    {/* Step Number Badge */}
                    <div className={`w-14 flex items-center justify-center font-black shrink-0 text-white ${
                      isPink 
                        ? "bg-gradient-to-br from-rose-600 to-pink-500" 
                        : "bg-gradient-to-br from-[#ff6600] to-[#e64c00]"
                    }`}>
                      {step.num}
                    </div>
                    <div className="flex-1 py-3 px-5 flex items-center">
                      <h4 className={`text-xs sm:text-sm font-black leading-snug ${textTitle}`}>
                        {step.title}
                      </h4>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Column: 3 Photos Stack */}
              <div className="lg:col-span-5 flex flex-col justify-between gap-4">
                {[
                  { src: "https://res.cloudinary.com/dfarfqx7e/image/upload/f_auto,q_auto/v1781590221/ChatGPT_Image_2026%EB%85%84_6%EC%9B%94_9%EC%9D%BC_%EC%98%A4%ED%9B%84_09_44_02_dvfuq7.png", alt: "창업 상담 및 매장 상황 분석" },
                  { src: "https://res.cloudinary.com/dfarfqx7e/image/upload/f_auto,q_auto/v1781590220/ChatGPT_Image_2026%EB%85%84_6%EC%9B%94_9%EC%9D%BC_%EC%98%A4%ED%9B%84_09_25_41_psjtvg.png", alt: "본사 전문가의 메뉴 조리 교육" },
                  { src: "https://res.cloudinary.com/dfarfqx7e/image/upload/f_auto,q_auto/v1781590223/ChatGPT_Image_2026%EB%85%84_6%EC%9B%94_9%EC%9D%BC_%EC%98%A4%ED%9B%84_09_25_48_ab8bal.png", alt: "매장 매출 관리 및 사후 지원" }
                ].map((photo, idx) => (
                  <div 
                    key={idx} 
                    className="relative rounded-2xl overflow-hidden border border-neutral-200/10 shadow-lg aspect-[21/9] sm:aspect-[24/8] bg-neutral-950 w-full group flex-1 min-h-[100px]"
                  >
                    <img 
                      src={photo.src} 
                      alt={photo.alt} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent flex items-end p-3">
                      <span className="text-white text-[11px] sm:text-xs font-bold drop-shadow">
                        {photo.alt}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center border-t border-neutral-200/20 pt-6 mt-8 text-[11px] sm:text-xs font-bold text-slate-500">
            <span>* 가맹 형태 및 매장 여건에 따라 일정은 변동될 수 있습니다.</span>
            <span>Slide 14 / 16</span>
          </div>
        </section>

        {/* SECTION 15. 뒷면 (Back Cover) / CTA */}
        <section className={`rounded-3xl p-6 sm:p-12 md:p-16 ${cardBg} relative overflow-hidden`}>
          <div className="absolute inset-0 bg-gradient-to-tr from-amber-400/5 via-transparent to-transparent pointer-events-none"></div>

          <div className="flex items-center justify-between border-b border-neutral-200/20 pb-6 mb-8">
            <span className="text-xs font-black tracking-widest text-[#ffd500]">15 / BACK COVER</span>
            <span className={`text-xs font-bold ${isPink ? "text-rose-500" : "text-amber-600"} font-mono`}>120PIE & COFFEE</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left my-auto py-6">
            {/* Left persuasive details column */}
            <div className="lg:col-span-7 space-y-6">
              <h2 className={`text-3xl sm:text-4xl md:text-5xl font-black leading-tight ${textTitle}`}>
                성공적인 창업의 시작,<br />
                <span className={textHighlight}>120pie & coffee</span>가 확실한 해답입니다.
              </h2>
              
              <p className={`text-sm sm:text-base leading-relaxed ${textDesc} font-bold`}>
                창업은 무모한 모험이 아닌 철저히 계산된 비즈니스여야 합니다. 120pie만의 독자적인 베이킹 기술과 1인 운영 특화 시스템으로 리스크 없는 성공 가도를 함께 걷겠습니다. 망설이지 마시고 기회를 잡으세요.
              </p>

              {/* Value checklists */}
              <div className="space-y-3 pt-2">
                {[
                  { title: "초기 밀착 마케팅 케어", desc: "스마트플레이스 최적화, 타깃형 SNS 마케팅, 네이버 블로그 전폭 지원", icon: "🚀" },
                  { title: "동종 업계 최고 수준 마진율", desc: "원재료 직배송 콜드체인 공급망 혁신을 통한 점주 마진 극대화", icon: "📈" },
                  { title: "로열티 / 광고 분담금 / 재계약비 3無", desc: "가맹점의 성공이 본사의 성공이라는 철저한 상생 파트너십 구축", icon: "🤝" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="text-xl shrink-0 mt-0.5">{item.icon}</span>
                    <div>
                      <h4 className={`text-xs sm:text-sm font-black ${textTitle}`}>{item.title}</h4>
                      <p className={`text-[11px] sm:text-xs ${textDesc} font-semibold leading-relaxed mt-0.5`}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3 pt-6">
                <a 
                  href="/메뉴추가_120pie-가맹-제안_막장있음_.pdf" 
                  download="메뉴추가_120pie-가맹-제안_막장있음_.pdf"
                  className={`inline-flex items-center justify-center px-5 py-3 rounded-xl border font-extrabold text-sm cursor-pointer transition-all shadow-md ${isPink ? "bg-neutral-900 border-neutral-800 text-white hover:bg-neutral-800" : "bg-white border-amber-250/70 text-slate-755 hover:bg-amber-50/50"}`}
                >
                  <FileText size={16} className={`mr-2 ${isPink ? "text-rose-500" : "text-amber-500"}`} /> 제안서 PDF 저장/인쇄
                </a>
                <a 
                  href="#inquiry-form-section"
                  className={`inline-flex items-center justify-center px-6 py-3 rounded-xl font-extrabold text-sm transition-all shadow-md hover:scale-[1.02] cursor-pointer ${isPink ? "bg-rose-500 text-white hover:bg-rose-600 shadow-rose-500/10" : "bg-amber-400 text-neutral-900 hover:bg-amber-300 shadow-amber-400/10"}`}
                >
                  가맹 상담 신청서 작성하기
                </a>
              </div>
            </div>

            {/* Right large hero image column */}
            <div className="lg:col-span-5 relative group">
              <div className="relative rounded-3xl overflow-hidden border border-neutral-200/20 shadow-2xl aspect-[4/5] bg-neutral-950 w-full h-full min-h-[350px]">
                <img 
                  src="https://res.cloudinary.com/dfarfqx7e/image/upload/f_auto,q_auto/v1781590221/ChatGPT_Image_2026%EB%85%84_6%EC%9B%94_9%EC%9D%BC_%EC%98%A4%ED%9B%84_05_24_39_a38n7c.png" 
                  alt="120PIE COFFEE premium success storefront and menu" 
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 opacity-90"
                />
                
                {/* Floating Social Proof Badge */}
                <div className="absolute top-4 left-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl py-3 px-4 text-center">
                  <span className="text-[#ffd500] text-xs sm:text-sm font-black tracking-wide drop-shadow">
                    ★ 누적 가맹 및 샵인샵 도입 150호점 돌파 ★
                  </span>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6">
                  <span className="text-white text-xs font-bold opacity-80">120PIE & COFFEE 프리미엄 매장 전경</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center border-t border-neutral-200/20 pt-6 mt-8 text-[11px] sm:text-xs font-bold text-slate-500">
            <span>© 2026 120pie & coffee Corp. All rights reserved.</span>
            <span>Slide 15 / 15</span>
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
      <RightFloatingQuickBar />
      <RightSideInquiryBanner />
      <MobileBottomInquiryBar />
    </div>
  );
}
