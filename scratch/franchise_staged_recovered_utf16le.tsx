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
    title: "湲곗〈 移댄럹 ?듭씤???꾩엯 (A 留ㅼ옣)",
    badge: "?듭씤???깃났 紐⑤뜽",
    stats: "?쇳룊洹?留ㅼ텧 45留????곸듅",
    desc: "湲곗〈????④? ?뚮즺 ?꾩＜濡??댁쁺?섎뜕 ??숆? 媛쒖씤 移댄럹??쇰굹, 120寃??뚯씠 ?꾩엯 ???명듃 二쇰Ц????컻?곸쑝濡??섏뼱??媛앸떒媛? 留덉쭊???숈떆???≪븯?듬땲??",
    points: [
      "湲곗〈 而ㅽ뵾 湲곌린 諛??숈꽑 100% 洹몃?濡??쒖슜",
      "?뚮즺? ?붿????숇컲 二쇰Ц??68% 湲곕줉",
      "?꾩엯 2二?留뚯뿉 諛곕떖???붿???移댄뀒怨좊━ ??궧 吏꾩엯"
    ]
  },
  {
    title: "1???뚯옄蹂??낆쥌蹂寃?李쎌뾽 (B 留ㅼ옣)",
    badge: "?뚯옄蹂??좉퇋 李쎌뾽",
    stats: "6媛쒖썡 留뚯뿉 李쎌뾽 鍮꾩슜 ?뚯닔",
    desc: "湲곗〈 ?꾨옖李⑥씠利?移섑궓吏묒쓣 ?댁쁺?섎떎 怨쇰룄???몃룞 媛뺣룄? 濡쒖뿴?곕줈 怨좊??섎뜕 以? 1???댁쁺??媛?ν븳 120pie 肄ㅽ뙥??移댄럹 紐⑤뜽濡??꾪솚??怨좎닔?듭쓣 ?ъ꽦?덉뒿?덈떎.",
    points: [
      "?멸굔鍮??쒕줈, ?먯＜ 1???댁쁺 理쒖쟻???쒖뒪??,
      "蹂듭옟???щ즺 ?먯쭏 ?녿뒗 蹂몄궗 肄쒕뱶泥댁씤 ?앹? 怨듦툒",
      "?쇳겕???3遺?議곕━濡??뚯씠釉??뚯쟾??3諛?利앷?"
    ]
  },
  {
    title: "諛곕떖 & ?ъ옣 ?뱁솕 留ㅼ옣 (C 留ㅼ옣)",
    badge: "諛곕떖/?ъ옣 ?뱁솕 紐⑤뜽",
    stats: "?명듃 二쇰Ц ?④? 2.2留????ъ꽦",
    desc: "?뚰삎 二쇨굅 諛吏??곴텒???낆젏?섏뿬 諛곕떖怨??뚯씠?ъ븘???꾩＜濡?媛?숉븯???ㅼ냽??留ㅼ옣?낅땲?? ?⑥껜 媛꾩떇 二쇰Ц怨??⑤?由????ъ옣 怨좉컼 鍮꾩쨷??留ㅼ슦 ?믪뒿?덈떎.",
    points: [
      "?숈썝媛, ?대┛?댁쭛 ?⑥껜 媛꾩떇 二쇰Ц ?뷀룊洹?15???묒닔",
      "?⑦궎吏??붿옄??李⑤퀎?붾줈 ?좊Ъ???뚯씠?ъ븘???섏슂 寃ъ씤",
      "諛곕떖?섎?議?留쏆쭛 ??궧 ?곸쐞沅??좎?濡??곸떆 留ㅼ텧 ?뺣낫"
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
    storeType: "?듭씤???꾩엯",
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
      alert("?깊븿怨??곕씫泥섎? ?낅젰??二쇱꽭??");
      return;
    }

    setIsSubmitting(true);
    try {
      await addInquiry({
        name: formData.name,
        phone: formData.phone,
        storeType: formData.storeType,
        existingStoreName: formData.existingStoreName || "",
        message: formData.message || "李쎌뾽 ?덈궡 ?섏씠吏瑜??듯븳 ?곷떞 ?좎껌",
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
            <Link className="flex items-center group shrink-0" href={backUrl} aria-label="120pie ?덉쑝濡??대룞">
              <img
                src={logoUrl}
                alt="120pie & coffee"
                className="h-5 sm:h-7 lg:h-8 w-auto object-contain group-hover:scale-102 transition-all duration-200"
              />
            </Link>
          </div>

          <nav className={`hidden lg:flex items-center gap-2.5 xl:gap-4 text-[10px] xl:text-[13px] font-bold shrink-0 ${navLinkTextClass}`}>
            <Link href={`${backUrl}#menu`} className="hover:text-amber-400 transition-colors">硫붾돱 移댄깉濡쒓렇</Link>
            <Link href={`/stores?theme=${theme}`} className="hover:text-amber-400 transition-colors">媛留뱀젏 ?꾪솴</Link>
            <Link href={`/costs?theme=${theme}`} className="hover:text-amber-400 transition-colors">?듭씤???덈궡</Link>
            <Link href={`/franchise?theme=${theme}`} className={`hover:scale-105 transition-transform shrink-0 ${
              isPink 
                ? "text-rose-500 hover:text-rose-600 font-extrabold" 
                : "text-[#ffd500] hover:text-[#e6bd00] font-extrabold"
            }`}>
              李쎌뾽 ?덈궡
            </Link>
            <Link href={`${backUrl}#faq`} className="hover:text-amber-400 transition-colors">FAQ</Link>
          </nav>

          <div className="flex items-center gap-2.5">
            <div className={`flex items-center rounded-full border p-0.5 text-[10px] font-black ${switcherWrapperClass}`}>
              <a
                onClick={() => handleThemeChange("yellow")}
                className={`rounded-full px-2.5 py-1 transition-colors cursor-pointer select-none focus:outline-none focus:ring-0 outline-none ${switcherBtnYellowClass}`}
              >
                ?먮줈
              </a>
              <a
                onClick={() => handleThemeChange("pink")}
                className={`rounded-full px-2.5 py-1 transition-colors cursor-pointer select-none focus:outline-none focus:ring-0 outline-none ${switcherBtnBlackClass}`}
              >
                釉붾옓
              </a>
            </div>
            <Link className={`hidden sm:inline-flex items-center justify-center px-4 py-2.5 rounded-lg border text-xs font-bold focus:outline-none focus:ring-0 outline-none ${portalBtnClass}`} href="/portal" target="_blank" rel="noopener noreferrer">
              ?먯＜?꾩슜
            </Link>
            <a href="#inquiry-form-section" className={`pink-primary-button hidden sm:inline-flex items-center justify-center px-5 py-2.5 rounded-lg text-xs sm:text-sm font-black hover:scale-[1.02] transition-all border-0 cursor-pointer ${
              isPink 
                ? "bg-rose-500 hover:bg-rose-600 text-white shadow-[0_4px_16px_rgba(244,63,94,0.2)]" 
                : "bg-amber-400 hover:bg-amber-300 text-neutral-950 shadow-[0_4px_16px_rgba(251,191,36,0.2)]"
            }`}>
              ?곷떞 ?좎껌 <ArrowRight size={14} className="ml-1.5 shrink-0" />
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
                硫붾돱 移댄깉濡쒓렇
              </Link>
              <Link href={`/stores?theme=${theme}`} onClick={() => setMobileNavOpen(false)} className={`rounded-xl px-4 py-3 transition-colors ${mobileNavLinkClass}`}>
                媛留뱀젏 ?꾪솴
              </Link>
              <Link href={`/costs?theme=${theme}`} onClick={() => setMobileNavOpen(false)} className={`rounded-xl px-4 py-3 transition-colors ${mobileNavLinkClass}`}>
                ?듭씤???덈궡
              </Link>
              <Link href={`/franchise?theme=${theme}`} onClick={() => setMobileNavOpen(false)} className={`rounded-xl px-4 py-3 transition-colors font-extrabold ${
                isPink 
                  ? "text-rose-500 bg-rose-500/10 border border-rose-500/20" 
                  : "text-[#ffd500] bg-[#ffd500]/10 border border-[#ffd500]/20"
              }`}>
                李쎌뾽 ?덈궡
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
              ?곷떞 ?좎껌 <ArrowRight size={15} className="ml-1.5" />
            </a>
          </nav>
        )}
      </header>

      {/* Main Content (16 Slides as Sections) */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-24 sm:space-y-36">
        
        {/* SECTION 1. ?쒖? (Cover) */}
        <section className={`rounded-3xl p-6 sm:p-12 md:p-16 ${cardBg} flex flex-col justify-between min-h-[500px] relative overflow-hidden`}>
          {/* Accent decoration */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-[#ffd500]/10 to-transparent rounded-bl-full pointer-events-none"></div>
          
          <div className="flex items-center justify-between border-b border-neutral-200/20 pb-6 mb-6">
            <span className={`text-xs font-black tracking-widest ${isPink ? "text-neutral-450" : "text-[#0d233a]/80"}`}>120PIE & COFFEE</span>
            <span className="text-xs font-extrabold px-3 py-1 bg-amber-400 text-[#0d233a] border border-[#0d233a]/10 rounded-full shadow-sm">
              媛留?李쎌뾽 ?쒖븞
            </span>
          </div>

          <div className="my-auto py-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6 text-left">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
                吏湲?留ㅼ옣??br />
                <span className={textHighlight}>?붿???留ㅼ텧</span>???뷀븯??br />
                媛???뺤떎???붾（??              </h1>
              <p className={`text-sm sm:text-base md:text-lg leading-relaxed ${textDesc}`}>
                40???μ씤?뺤떊?쇰줈 鍮싳뼱??120寃??뚯씠? 怨꾨?鍮?癒몄떊 怨듦툒源뚯?.<br />
                ?명뀒由ъ뼱 遺???놁씠 ?뚯옄蹂??듭씤???꾩엯?쇰줈 ?덉젙?곸씤 異붽? 留ㅼ텧??李쎌텧?섏꽭??
              </p>
              
              <div className="flex flex-wrap gap-3 pt-2">
                <a 
                  href="/120pie_franchise_proposal.pdf" 
                  download="120pie_媛留뱀갹?낆젣?덉꽌.pdf"
                  className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-amber-400 text-[#0d233a] hover:bg-amber-300 font-extrabold text-sm transition-all shadow-md shadow-[#ffd500]/10"
                >
                  <Download size={16} className="mr-2" /> ?쒖븞??PDF ?ㅼ슫濡쒕뱶
                </a>
                <a 
                  href="#inquiry-form-section" 
                  className={`inline-flex items-center justify-center px-5 py-3 rounded-xl border font-extrabold text-sm transition-all ${
                    isPink 
                      ? "border-neutral-700 bg-neutral-900 text-white hover:bg-neutral-800" 
                      : "border-[#e6dfc3] bg-white text-[#0d233a] hover:bg-[#fffdf4]"
                  }`}
                >
                  臾대즺 李쎌뾽?곷떞 臾몄쓽
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
                  <span className="text-xs font-bold text-white/95">???硫붾돱: 120寃??ㅻ━吏???좏뵆?뚯씠</span>
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
                    ??<span className={textHighlight}>120寃??뚯씠</span>瑜??좏깮?댁빞 ?좉퉴??
                  </h2>
                  <p className={`text-sm sm:text-base leading-relaxed ${textDesc}`}>
                    40???쒓낵 ?μ씤??鍮꾨쾿 ?앹?? ?낃퀎 理쒖큹 300?몄젏 ?뚰뙆???깆옣 ?좏솕濡?寃利앸맂 ?뚯썙 釉뚮옖?쒖엯?덈떎.
                  </p>
                </div>

                {/* Growth Graph */}
                <div className={`p-5 rounded-2xl ${innerCardBg} space-y-4`}>
                  <h4 className={`text-xs sm:text-sm font-black text-center md:text-left flex items-center gap-1.5 ${textTitle}`}>
                    <TrendingUp size={16} className={isPink ? "text-rose-500" : "text-amber-500"} /> 3???곗냽 媛留??깆옣 吏??(?꾩쟻 怨꾩빟 湲곗?)
                  </h4>
                  <div className="space-y-3 pt-2">
                    {[
                      { year: "1?꾩감 (?곗묶湲?", count: "10?몄젏", width: "w-[15%]", bg: "bg-slate-400" },
                      { year: "2?꾩감 (?깆옣湲?", count: "70?몄젏", width: "w-[40%]", bg: isPink ? "bg-rose-500/70" : "bg-amber-400/70" },
                      { year: "3?꾩감 (?꾩옱)", count: "300?몄젏 ?뚰뙆", width: "w-full", bg: isPink ? "bg-rose-500" : "bg-amber-400" }
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
                    <span className="text-xs font-bold text-white/95">40???쒓낵 ?μ씤??120寃??뺣? ?꾩슦 ?깊삎 怨듭젙</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: "?ㅼ씠踰?寃?됰웾", val: "??61,500??", desc: "?ㅼ썙??荑쇰━ 寃?됰웾 ?뺣룄??1??, icon: <Search size={22} className={isPink ? "text-rose-500" : "text-amber-400"} /> },
                { title: "SNS ?댁떆?쒓렇", val: "?꾩쟻 19.3留뚭컻+", desc: "#120寃뱁뙆???먮컻???낆냼臾??뺤궛", icon: <Hash size={22} className={isPink ? "text-rose-500" : "text-amber-400"} /> },
                { title: "釉뚮옖???몄???, val: "?뚰삎 ?붿???1??, desc: "怨좉컼 ?좏샇??議곗궗 寃곌낵 寃利?, icon: <Award size={22} className={isPink ? "text-rose-500" : "text-amber-400"} /> }
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
            <span>* ?ы꽭 ?몃젋??諛?蹂몄궗 媛留?怨꾩빟??吏묎퀎 湲곗?</span>
            <span>Slide 02 / 16</span>
          </div>
        </section>

        {/* SECTION 3. 6WAY 留ㅼ텧 ?꾨왂 */}
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
                    ?ㅺ컖?붾맂 <span className={textHighlight}>6WAY 留ㅼ텧 ?꾨왂</span>
                  </h2>
                  <p className={`text-sm sm:text-base leading-relaxed ${textDesc}`}>
                    ?곴텒怨?怨꾩젅??愿怨꾩뾾???곸떆 怨좏슚???섏씡 援ъ“瑜?留뚮뱾?대깄?덈떎.
                  </p>
                </div>

                {/* Channels Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[
                    { title: "01. 留ㅼ옣 ???", desc: "而ㅽ뵾? ?명듃 留ㅼ텧 洹밸???, icon: <Store size={16} className="text-amber-400" /> },
                    { title: "02. ?ъ옣 (?뚯씠?ъ븘??", desc: "1???? ?⑤?由???媛꾪렪 ?좊룄", icon: <ShoppingBag size={16} className="text-amber-400" /> },
                    { title: "03. 諛곕떖 (?쒕━踰꾨━)", desc: "諛곕떖???붿????먯쑀???뺤옣", icon: <Truck size={16} className="text-amber-400" /> },
                    { title: "04. B2B ?앹? ?⑺뭹", desc: "二쇰? 留ㅼ옣 臾쇰웾 ?꾨ℓ ?⑺뭹", icon: <Layers size={16} className="text-amber-400" /> },
                    { title: "05. ?⑥껜 二쇰Ц ?좎튂", desc: "?숆탳쨌?뚯궗쨌?숉샇?????媛꾩떇", icon: <Users size={16} className="text-amber-400" /> },
                    { title: "06. ?먯껜 ?쒖쫵 硫붾돱", desc: "怨꾨?鍮돠룹툌?ъ뒪 怨꾩젅蹂??쇱씤??, icon: <Sparkles size={16} className="text-amber-400" /> }
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
                    <span className="text-xs font-bold text-white/95">?ъ옣 諛?諛곕떖 寃쎌웳?μ쓣 ?믪씠??釉뚮옖???꾩슜 ?⑦궎吏?諛뺤뒪</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Time-of-day timeline */}
            <div className={`p-6 rounded-2xl ${innerCardBg} space-y-6`}>
              <h4 className={`text-sm font-bold text-center md:text-left flex items-center gap-2 ${textTitle}`}>
                <Clock size={16} className={isPink ? "text-rose-500" : "text-amber-500"} /> 怨듬갚 ?녿뒗 24?쒓컙 ??꾨씪?몃퀎 理쒖쟻 ?섏슂
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-left">
                {[
                  { time: "08:00 - 11:00", label: "?꾩묠 ?깃탳/異쒓렐湲?, menu: "?곕걟??? 怨꾨?鍮?& 而ㅽ뵾", icon: <Sun size={14} className="text-amber-400" /> },
                  { time: "11:30 - 14:00", label: "?먯떖 ?앺썑 ?붿???, menu: "120寃??좏뵆?뚯씠 & ?꾨찓由ъ뭅??, icon: <Coffee size={14} className="text-amber-400" /> },
                  { time: "14:30 - 17:00", label: "?ㅽ썑 媛꾩떇 ???, menu: "?ㅻ젅??痢꾨윭??& ?대┛??媛꾩떇", icon: <Sparkles size={14} className="text-amber-400" /> },
                  { time: "17:30 - 21:00", label: "????닿렐 諛??쇱떇", menu: "留ㅼ숴??遺덈떗?뚯씠 ?⑤?由???, icon: <Moon size={14} className="text-amber-400" /> }
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
            <span>* ?곸떆 ?먮ℓ 梨꾨꼸 媛??諛?媛留뱀젏 ?됯퇏 ?쒓컙? 留ㅼ텧 遺꾩꽍 湲곗?</span>
            <span>Slide 03 / 16</span>
          </div>
        </section>

        {/* SECTION 4. 媛꾪렪 議곕━ ?쒖뒪??(?ㅽ띁?덉씠?? */}
        <section className={`rounded-3xl p-6 sm:p-12 ${cardBg} relative`}>
          <div className="flex items-center justify-between border-b border-neutral-200/20 pb-4 mb-8">
            <span className="text-xs font-black tracking-widest text-[#ffd500]">04 / OPERATION SYSTEM</span>
            <span className="text-xs font-black text-slate-400">EASY COOKING PROCESS</span>
          </div>

          <div className="space-y-10">
            <div className="text-center md:text-left space-y-3">
              <h2 className="text-2xl sm:text-3xl font-black">
                ?꾨Ц 二쇰갑???녿뒗 <span className={textHighlight}>洹밴컯??議곕━ ?⑥쑉??/span>
              </h2>
              <p className={`text-sm sm:text-base leading-relaxed ${textDesc}`}>
                蹂몄궗?먯꽌 100% 媛怨??앹?瑜??꾨꼍 肄쒕뱶泥댁씤 怨듦툒?섏뿬 留ㅼ옣?먯꽌???ㅻ툙??援쎄린留??섎㈃ ?꾩꽦?⑸땲??
              </p>
            </div>

            {/* Steps Flowchart */}
            <div className="relative">
              <div className={`hidden sm:block absolute top-1/2 left-4 right-4 h-0.5 ${isPink ? "bg-neutral-800/80" : "bg-[#e6dfc3]"} -translate-y-1/2 z-0`}></div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 text-center relative z-10">
                {[
                  { step: "STEP 01", title: "?앹? 怨듦툒", desc: "蹂몄궗 二?3???좎꽑 ?됰룞 臾쇰쪟 吏곷같??, icon: <Truck size={20} className="text-amber-400" /> },
                  { step: "STEP 02", title: "?됰룞 蹂닿?", desc: "?대룞 怨쇱젙 ?놁씠 利됱떆 蹂닿? 媛??, icon: <Warehouse size={20} className="text-amber-400" /> },
                  { step: "STEP 03", title: "3遺?踰좎씠??, desc: "?ㅻ툙湲곗뿉 ?ｊ퀬 ??대㉧ ?명똿 ?꾨즺", icon: <ChefHat size={20} className="text-amber-400" /> },
                  { step: "STEP 04", title: "利됱떆 ?쒓났", desc: "諛붿궘?⑥씠 ?댁븘?덈뒗 120寃??뚯씠 ?꾩꽦", icon: <ShoppingBag size={20} className="text-amber-400" /> }
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
                  <Sliders size={20} className="text-amber-400" /> 珥덉냼??二쇰갑 ?뱁솕 ?명봽??                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-400 font-semibold">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 mt-0.5">??/span>
                    <span>1.5??珥덉냼??二쇰갑 怨듦컙留뚯쑝濡쒕룄 ?숈꽑 諛곗튂 諛?湲곌린 援щ룞 媛??/span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 mt-0.5">??/span>
                    <span>媛??諛곌? ?ㅻ퉬, ?뺥듃 怨듭궗 ??遺덊븘?뷀븳 怨좊퉬??媛?ㅼ떆??遺덊븘??/span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 mt-0.5">??/span>
                    <span>100% ?꾧린 踰좎씠??湲곌린 ?ъ슜?쇰줈 議곕━ ?곌린, ?꾩깉, ?닿린 理쒖냼??/span>
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
                  <span className="text-xs font-bold text-white/95">媛留뱀젏 ?ㅼ젣 二쇰갑 議곕━ 怨듦컙 諛??먭렇鍮??쒖“ 紐⑥뒿</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center border-t border-neutral-200/20 pt-6 mt-8 text-[11px] sm:text-xs font-bold text-slate-500">
            <span>* 媛留?蹂몄궗 吏곸쁺 ?앹궛 諛?臾쇰쪟 怨듦툒 ?꾨줈?몄뒪 湲곗?</span>
            <span>Slide 04 / 16</span>
          </div>
        </section>

        {/* SECTION 5. ?꾨㈃ ?덉씠?꾩썐 (怨듦컙 ?ㅺ퀎) */}
        <section className={`rounded-3xl p-6 sm:p-12 ${cardBg} relative`}>
          <div className="flex items-center justify-between border-b border-neutral-200/20 pb-4 mb-8">
            <span className="text-xs font-black tracking-widest text-[#ffd500]">05 / SPACE DESIGN</span>
            <span className="text-xs font-black text-slate-400">FLOOR LAYOUT PLANS</span>
          </div>

          <div className="space-y-10">
            <div className="text-center md:text-left space-y-3">
              <h2 className="text-2xl sm:text-3xl font-black">
                ?됱닔蹂?留욎땄??<span className={textHighlight}>怨듦컙 ?꾨㈃ ?ㅺ퀎</span>
              </h2>
              <p className={`text-sm sm:text-base leading-relaxed ${textDesc}`}>
                ?숈꽑??鍮꾩빟?곸쑝濡??⑥텞?쒖폒 1??洹쇰Т ?⑥쑉??洹밸??뷀븳 ?ㅼ냽??諛곗튂?꾩엯?덈떎.
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
                8?됲삎 肄ㅽ뙥???덉씠?꾩썐
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
                10?됲삎 ??⑦궎吏 ?덉씠?꾩썐
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
                    ? "?뚯씠?ъ븘??諛?諛곕떖 ?꾩＜ 1??移댄럹???뺤꽍" 
                    : "?뚯씠釉?? 留ㅼ텧怨??ъ옣 諛곕떖??紐⑤몢 ?섏슜?섎뒗 援ъ꽦"
                  }
                </h4>
                <p className={`text-xs sm:text-sm ${textDesc} font-semibold leading-relaxed`}>
                  {selectedPlanTab === "8py" 
                    ? "移댁슫???뺣㈃???꾩슜 ?쇱??댁뒪瑜?諛李?諛곗튂?섍퀬, ?룸꼍???뚯씠 癒몄떊怨??먭렇鍮?癒몄떊??1??援ъ“濡?吏곷젹?뷀븯?????먮━?먯꽌 二쇰Ц ?묒닔, 議곕━, ?명똿, 怨좉컼 ?꾨떖源뚯? ?대룞 嫄곕━ 1.5m ?대궡濡??숈꽑???ㅺ퀎?덉뒿?덈떎." 
                    : "?뚯씠釉?3~4議곕? ?덉젙?곸쑝濡?援ы쉷?섎㈃?? ?뚯씠?ъ븘???듬줈? 諛곕떖 湲곗궗 ?쎌뾽 議댁쓣 ?낅┰ 遺꾨━?쒖섟?듬땲?? 二쇰갑 ?대??먮뒗 珥덉냼??痢꾨윭???源湲?怨듦컙源뚯? 異붽?濡??뺣낫 媛?ν븳 媛?숈꽦???뗫낫?대뒗 ?꾨㈃?낅땲??"
                  }
                </p>
                <div className="grid grid-cols-2 gap-4 text-xs font-bold pt-2">
                  <div className={`p-3 rounded-lg border text-center ${isPink ? "bg-neutral-950/50 border-neutral-850" : "bg-amber-400/5 border-amber-200/40"}`}>
                    <span className={`${textDesc} block mb-1`}>?꾩슂 二쇰갑 ?됱닔</span>
                    <span className={`text-sm font-black ${textTitle}`}>{selectedPlanTab === "8py" ? "1.5???댁쇅" : "2.0???댁쇅"}</span>
                  </div>
                  <div className={`p-3 rounded-lg border text-center ${isPink ? "bg-neutral-950/50 border-neutral-850" : "bg-amber-400/5 border-amber-200/40"}`}>
                    <span className={`${textDesc} block mb-1`}>沅뚯옣 ?댁쁺 ?몄썝</span>
                    <span className={`text-sm font-black ${textTitle}`}>{selectedPlanTab === "8py" ? "?먯＜ 1??媛?? : "1??~ 1.5??}</span>
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
                    {selectedPlanTab === "8py" ? "8??留ㅼ옣 ?대? ?명뀒由ъ뼱 ?덉씠?꾩썐" : "10??留ㅼ옣 ?꾧꼍 諛??꾩씪?쒕뱶 ?숈꽑 諛곗튂"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center border-t border-neutral-200/20 pt-6 mt-8 text-[11px] sm:text-xs font-bold text-slate-500">
            <span>* 媛留?媛쒖꽕 蹂몄궗 ?명뀒由ъ뼱 ?ъ뾽遺 湲곗닠 ?꾩븞 諛?怨듦컙 援ъ꽦 湲곗?</span>
            <span>Slide 05 / 16</span>
          </div>
        </section>

        {/* SECTION 6. ?대? ?명뀒由ъ뼱 */}
        /* SECTION 7. ?깃났?щ? */
        <section className={`rounded-3xl p-6 sm:p-12 ${cardBg} relative`}>
          <div className="flex items-center justify-between border-b border-neutral-200/20 pb-4 mb-8">
            <span className="text-xs font-black tracking-widest text-[#ffd500]">07 / SUCCESS CASES</span>
            <span className="text-xs font-black text-slate-400">REAL PARTNERSHIP RESULTS</span>
          </div>

          <div className="space-y-10">
            <div className="text-center md:text-left space-y-3">
              <h2 className="text-2xl sm:text-3xl font-black">
                媛留뱀젏二쇰떂??利앸챸?섎뒗 <span className={textHighlight}>?ㅼ젣 媛留??깃났?щ?</span>
              </h2>
              <p className={`text-sm sm:text-base leading-relaxed ${textDesc}`}>
                湲곗〈 留ㅼ옣???명봽?쇱? 120pie???쒗뭹?μ씠 寃고빀?섏뼱 洹뱀쟻??留ㅼ텧 諛섎벑???대쨪???먯＜?섎뱾???앹깮???꾧린?낅땲??
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
                    <span className="text-xs font-bold text-white/95 mt-0.5">留ㅼ텧 遺?ㅽ똿 ?꾨떒 諛?紐⑤컮??愿묎퀬 ?띾낫 ?쒓컖 ?쒖븞</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center border-t border-neutral-200/20 pt-6 mt-8 text-[11px] sm:text-xs font-bold text-slate-500">
            <span>* 媛留뱀젏 POS ?곗씠??諛??곴텒 遺꾩꽍 ?꾩궛 ?먮즺 湲곗?</span>
            <span>Slide 07 / 16</span>
          </div>
        </section>

        {/* SECTION 8. 硫붾돱援ъ꽦 */}
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
                  ?꾪깂??寃쎌웳?μ쓽<br />
                  <span className={textHighlight}>李⑤퀎?붾맂 硫붾돱 援ъ꽦</span>
                </h2>
                <p className={`text-xs sm:text-sm leading-relaxed ${textDesc} max-w-xl`}>
                  ?곴텒怨?怨좉컼痢듭뿉 留욎떠 ?쒕꼫吏瑜??????덈뒗 ?ㅼ콈濡쒖슫 ?덉씠?대뱶 ?붿????쇱씤?낆쓣 媛뽰텛怨??덉뒿?덈떎.
                </p>
              </div>

              <div className="lg:col-span-5 space-y-3">
                {[
                  { title: "?붿????ㅼ뼇??, desc: "怨꾩젅媛먭낵 ?몃젋?쒕? 諛섏쁺???ㅼ콈濡쒖슫 ?덉씠?대뱶 硫붾돱" },
                  { title: "?앹궗 ????뺤옣", desc: "?좊뱺???ъ씠??硫붾돱濡??앹궗 ?섏슂源뚯? ?≪닔" },
                  { title: "?뚮즺???沅곹빀", desc: "?붿??몄? ?댁슱由щ뒗 ?ㅼ뼇???뚮즺 ?쇱씤???쒓났" }
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
                  title: "120寃뱁뙆???쒕━利?,
                  points: [
                    "?щ┝移섏쫰 / 而ㅼ뒪?곕뱶",
                    "怨좉뎄留?/ 釉붾（踰좊━",
                    "?⑤컯移섏쫰 / 留앷퀬 / ?좏뵆",
                    "?묒엫?먰겕由?/ 吏곹솕遺덇퀬湲?/ 吏곹솕遺덈떗"
                  ],
                  img: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779945185/120%EA%B2%B9%ED%8C%8C%EC%9D%B4_%EC%97%B0%EC%B6%9C1_ueicna.jpg"
                },
                {
                  title: "?먭렇 120",
                  points: [
                    "?ㅻ━吏??/ 踰좎씠而?,
                    "肄섎쾭??/ 而ㅼ뒪?곕뱶",
                    "?듯뙠 / ?듬え吏?,
                    "濡쒖젣誘명듃 / ?덊겕由?
                  ],
                  img: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779945603/2026-05-28_13_49_08_j9unkq.png"
                },
                {
                  title: "痢꾨윭??120",
                  points: [
                    "?ㅻ━吏??/ ?덇?",
                    "?ㅻ젅??/ ?뱀감"
                  ],
                  img: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779759362/IMG_0015_6_3_au1ykg.jpg"
                },
                {
                  title: "?ъ씠??& ?뚮즺",
                  points: [
                    "援?Ъ / 濡쒖젣 / 吏쒖옣 ?〓낭??,
                    "吏곹솕 遺덇퀬湲??ル룄洹?,
                    "而ㅽ뵾 / ?먯씠??/ ?ㅻТ??/ 諭낆눥 ??
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
            <span>* 120pie & coffee ?꾩껜 ?곹뭹 媛留?怨듦툒 ?덈ぉ 由ъ뒪??湲곗?</span>
            <span>Slide 08 / 16</span>
          </div>
        </section>
        {/* SECTION 9. ?몃? 硫붾돱援ъ꽦 */}
        <section className={`rounded-3xl p-6 sm:p-12 ${cardBg} relative`}>
          <div className="flex items-center justify-between border-b border-neutral-200/20 pb-4 mb-8">
            <span className="text-xs font-black tracking-widest text-[#ffd500]">09 / DETAILED MENU</span>
            <span className="text-xs font-black text-slate-400">FLAVOR PROFILES</span>
          </div>

          <div className="space-y-10">
            <div className="text-center md:text-left space-y-3">
              <h2 className="text-2xl sm:text-3xl font-black">
                媛留뱀젏 ?꾩엯 媛??<span className={textHighlight}>?몃? 硫붾돱 援ъ꽦</span>
              </h2>
              <p className={`text-sm sm:text-base leading-relaxed ${textDesc}`}>
                移댄뀒怨좊━蹂???쓣 ?대┃?섏뿬 120pie & coffee??紐⑤뱺 ?몃? 異쒖떆 硫붾돱?ㅼ쓣 ?뺤씤??蹂댁꽭??
              </p>
            </div>

            {/* Tabs Navigation */}
            <div className="flex flex-wrap justify-center gap-2 mb-8 select-none">
              {[
                { key: "pie", label: "120寃??뚯씠 ?쒕━利?, emoji: "?쪖" },
                { key: "egg", label: "?먭렇 120 ?쒕━利?, emoji: "?쪡" },
                { key: "churros", label: "痢꾨윭??120 ?쒕━利?, emoji: "?ⅷ" },
                { key: "side", label: "?〓낭??& ?ル룄洹?, emoji: "?뙪" },
                { key: "drink", label: "而ㅽ뵾 & ?뚮즺", emoji: "?? }
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
                    "轅?몃뼞 ?뚯씠", "?섑럹濡쒕땲?쇱옄 ?뚯씠", "濡쒖젣誘명듃 ?뚯씠", "?μ튂利??뚯씠",
                    "?좏뵆 ?뚯씠", "遺덇퀬湲??뚯씠", "遺덈떗 ?뚯씠", "?щ┝移섏쫰 ?뚯씠",
                    "留앷퀬 ?뚯씠", "肄섏튂利??뚯씠", "而ㅼ뒪?곕뱶 ?뚯씠", "釉붾（踰좊━ ?뚯씠"
                  ].map((name, idx) => (
                    <div key={idx} className="group flex flex-col items-center">
                      <div className={`w-full aspect-square rounded-2xl border-2 border-dashed ${isPink ? "border-neutral-800 bg-neutral-900/30 text-rose-500/20" : "border-amber-200/60 bg-amber-50/20 text-amber-500/30"} flex flex-col items-center justify-center relative group-hover:border-amber-400 transition-all duration-300`}>
                        <span className="text-2xl opacity-60">?쪖</span>
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
                    "?ㅻ━吏??怨꾨?鍮?, "踰좎씠而?怨꾨?鍮?, "而ㅼ뒪?곕뱶 怨꾨?鍮?, "肄섏튂利?怨꾨?鍮?,
                    "濡쒖젣誘명듃 怨꾨?鍮?, "?듬え吏?怨꾨?鍮?, "?덊겕由?怨꾨?鍮?, "??怨꾨?鍮?
                  ].map((name, idx) => (
                    <div key={idx} className="group flex flex-col items-center">
                      <div className={`w-full aspect-square rounded-2xl border-2 border-dashed ${isPink ? "border-neutral-800 bg-neutral-900/30 text-rose-500/20" : "border-amber-200/60 bg-amber-50/20 text-amber-500/30"} flex flex-col items-center justify-center relative group-hover:border-amber-400 transition-all duration-300`}>
                        <span className="text-2xl opacity-60">?쪡</span>
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
                    "?ㅻ━吏??痢꾨윭??, "?덇? 痢꾨윭??, "?ㅻ젅??痢꾨윭??, "?뱀감 痢꾨윭??
                  ].map((name, idx) => (
                    <div key={idx} className="group flex flex-col items-center">
                      <div className={`w-full aspect-square rounded-2xl border-2 border-dashed ${isPink ? "border-neutral-800 bg-neutral-900/30 text-rose-500/20" : "border-amber-200/60 bg-amber-50/20 text-amber-500/30"} flex flex-col items-center justify-center relative group-hover:border-amber-400 transition-all duration-300`}>
                        <span className="text-2xl opacity-60">?ⅷ</span>
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
                    "援?Ъ ?〓낭??, "濡쒖젣 ?〓낭??, "吏쒖옣 ?〓낭??, "吏곹솕遺덇퀬湲??ル룄洹?
                  ].map((name, idx) => (
                    <div key={idx} className="group flex flex-col items-center">
                      <div className={`w-full aspect-square rounded-2xl border-2 border-dashed ${isPink ? "border-neutral-800 bg-neutral-900/30 text-rose-500/20" : "border-amber-200/60 bg-amber-50/20 text-amber-500/30"} flex flex-col items-center justify-center relative group-hover:border-amber-400 transition-all duration-300`}>
                        <span className="text-2xl opacity-60">?뙪</span>
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
                    "?꾨찓由ъ뭅??, "移댄럹?쇰뼹", "諛붾땺?쇰씪??, "肄쒕뱶釉뚮（", "?묐떦?쇰뼹", "?멸린?쇰뼹", "?뱀감?쇰뼹",
                    "?붽굅?몄뒪臾대뵒", "罹먮え留덉씪??, "?덈퉬?ㅼ빱?ㅽ떚", "?섑띁誘쇳듃??, "諛?ы떚", "?꾩씠?ㅽ떚", "諭낆눥",
                    "諛?ъ뎽?댄겕", "?멸린?먯씠??, "荑좎븻?ъ뎽?댄겕", "珥덉퐫?먯씠??, "?멸린二쇱뒪", "留앷퀬二쇱뒪", "釉붾（踰좊━二쇱뒪"
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
            <span>* 蹂몄궗 ?쒓렇?덉쿂 移댄뀒怨좊━ ?꾩껜 硫붾돱 援ъ꽦 由ъ뒪??湲곗?</span>
            <span>Slide 09 / 16</span>
          </div>
        </section>
        {/* SECTION 10. ?섏씡 ?쒕??덉씠??*/}
        <section className={`rounded-3xl p-6 sm:p-12 ${cardBg} relative`}>
          <div className="flex items-center justify-between border-b border-neutral-200/20 pb-4 mb-8">
            <span className="text-xs font-black tracking-widest text-[#ffd500]">10 / PROFIT SIMULATION</span>
            <span className="text-xs font-black text-slate-400">FINANCIAL ROI INSIGHTS</span>
          </div>

          <div className="space-y-10">
            <div className="text-center md:text-left space-y-3">
              <h2 className="text-2xl sm:text-3xl font-black">
                泥닿퀎?곸씤 <span className={textHighlight}>媛留뱀젏 ?섏씡 ?쒕??덉씠??/span>
              </h2>
              <p className={`text-sm sm:text-base leading-relaxed ${textDesc}`}>
                ?믪? 留덉쭊?④낵 臾댁긽 媛留?吏?먯쑝濡?鍮좊Ⅸ 珥덇린 鍮꾩슜 ?뚯닔媛 媛?ν빀?덈떎. (??留ㅼ텧 3,000留????덉떆)
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch text-left">
              <div className={`lg:col-span-8 p-6 rounded-2xl border ${isPink ? "border-neutral-850" : "border-amber-200/40"} overflow-x-auto ${innerCardBg} ${innerCardHover}`}>
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className={`border-b ${isPink ? "border-neutral-805" : "border-amber-200/40"} ${isPink ? "text-rose-455" : "text-amber-600"}`}>
                      <th className="py-3 px-4 font-black">援щ텇</th>
                      <th className="py-3 px-4 font-black text-right">湲덉븸</th>
                      <th className="py-3 px-4 font-black text-right">鍮꾩쑉</th>
                      <th className="py-3 px-4 font-black">鍮꾧퀬</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { cat: "??留ㅼ텧??, price: "3,000留???, ratio: "100%", desc: "?됯퇏 媛留뱀젏 ???먮ℓ 湲곗? 留ㅼ텧 ?덉떆" },
                      { cat: "?앹옄?щ퉬", price: "1,050留???, ratio: "35%", desc: "蹂몄궗 ?꾩젣???앹? 諛?遺?먯옱 怨듦툒 ?④?" },
                      { cat: "?꾩감猷?, price: "250留???, ratio: "8.3%", desc: "10?됲삎 留ㅼ옣 ?됯퇏 ?붿꽭" },
                      { cat: "?멸굔鍮?, price: "180留???, ratio: "6.0%", desc: "?먯＜ 1??+ ?뚰듃???1???댁쁺" },
                      { cat: "愿由щ퉬 諛??섏닔猷?, price: "120留???, ratio: "4.0%", desc: "?섎룄, 愿묒뿴鍮?諛?諛곕떖???섏닔猷??? }
                    ].map((row, idx) => (
                      <tr key={idx} className={`border-b ${isPink ? "border-neutral-805/50" : "border-amber-200/20"} ${textTitle} font-bold`}>
                        <td className="py-3 px-4 font-black">{row.cat}</td>
                        <td className="py-3 px-4 text-right">{row.price}</td>
                        <td className="py-3 px-4 text-right font-mono">{row.ratio}</td>
                        <td className={`py-3 px-4 text-[10px] ${textDesc}`}>{row.desc}</td>
                      </tr>
                    ))}
                    <tr className={`${isPink ? "bg-rose-500/10 text-rose-500" : "bg-amber-400/10 text-amber-600"} font-black`}>
                      <td className="py-4 px-4 rounded-l-xl">???쒖닔??/td>
                      <td className="py-4 px-4 text-right">1,400留???/td>
                      <td className="py-4 px-4 text-right font-mono">46.7%</td>
                      <td className="py-4 px-4 rounded-r-xl text-[10px]">濡쒖뿴??0% ?곸슜 諛??믪? 留덉쭊 蹂댁옣</td>
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
                    <span className="text-[10px] font-bold text-white/95">而ㅽ뵾 ?먮ℓ 留덉쭊??洹밸??뷀븯???꾨씪鍮꾩뭅 ?먮몢 諛?留ㅼ옣 鍮꾩＜??/span>
                  </div>
                </div>

                <div className={`p-5 rounded-2xl border ${isPink ? "border-rose-500/20 bg-rose-500/5 text-rose-455" : "border-amber-400/20 bg-amber-400/5 text-amber-600"} flex flex-col items-center justify-center text-center space-y-1.5`}>
                  <TrendingUp size={24} />
                  <span className="text-xs font-black">?붿????낃퀎 理쒓퀬 ?섏? 留덉쭊??/span>
                  <span className="text-base font-extrabold">???쒖닔????1,400留???(46.7%)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center border-t border-neutral-200/20 pt-6 mt-8 text-[11px] sm:text-xs font-bold text-slate-500">
            <span>* ?곴린 湲덉븸? ?먰룷 ?낆? 諛?媛留뱀젏 ?댁쁺 諛⑹떇???곕씪 ?ㅻ? ???덉뒿?덈떎.</span>
            <span>Slide 10 / 16</span>
          </div>
        </section>

        {/* SECTION 11. 李쎌뾽紐⑤뜽 A */}
        <section className={`rounded-3xl p-6 sm:p-12 ${cardBg} relative`}>
          <div className="flex items-center justify-between border-b border-neutral-200/20 pb-4 mb-8">
            <span className="text-xs font-black tracking-widest text-[#ffd500]">11 / FRANCHISE MODEL A</span>
            <span className="text-xs font-black text-slate-400">SHOP-IN-SHOP / DELIVERY</span>
          </div>

          <div className="my-auto py-2 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-5 space-y-4 text-left flex flex-col justify-between">
              <div>
                <span className={`text-xs font-black px-2.5 py-1 ${isPink ? "bg-rose-500/10 text-rose-455 border-rose-500/20" : "bg-amber-400/10 text-amber-600 border-amber-400/20"} border rounded-full`}>
                  紐⑤뜽 A: ?듭씤??/ 諛곕떖 ?꾨Ц??                </span>
                <h2 className={`text-xl sm:text-2xl md:text-3xl font-black leading-tight ${textTitle} mt-3`}>
                  湲곗〈 留ㅼ옣 洹몃?濡?<br />
                  <span className={textHighlight}>440留???/span> ?뚯옄蹂?利됱떆 寃고빀
                </h2>
                <p className={`text-xs sm:text-sm leading-relaxed ${textDesc} mt-2`}>
                  湲곗〈 移댄럹, ?ル룄洹? ?〓낭?댁쭛 留ㅼ옣??湲곌린 ?명똿怨??ъ씤臾?援먯껜留뚯쑝濡??붿????먮ℓ瑜??쒖옉?섎뒗 珥덇컙???섏씠釉뚮━??媛???꾨줈洹몃옩?낅땲??
                </p>
              </div>
              
              <div className={`grid grid-cols-2 gap-3 text-xs font-bold ${textDesc}`}>
                {[
                  "媛留밸퉬/援먯쑁鍮??뚭꺽 ?섍툒",
                  "二쇰갑 ?ㅻ퉬 怨듭궗 遺덊븘??,
                  "珥덈룄 ?앹? 200媛?吏??,
                  "諛곕떖 ?뚮옯??利됱떆 ?곕룞"
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
                  <span className="text-[10px] font-bold text-white/95">移댁슫???듭씤???꾩슜 鍮꾩＜???ъ뒪??/span>
                </div>
              </div>
            </div>

            <div className={`lg:col-span-4 p-6 rounded-2xl text-left flex flex-col justify-between ${innerCardBgAccent} ${innerCardHover}`}>
              <span className={`text-[10px] font-black ${textDesc} uppercase tracking-wider block`}>MODEL A DETAILS</span>
              <div className={`space-y-3 border-b ${isPink ? "border-neutral-805" : "border-amber-200/35"} pb-4 my-3`}>
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className={textDesc}>媛留밸퉬 (?쒖떆 ?쒗깮)</span>
                  <span className={`${textTitle} font-extrabold line-through`}>100留???/span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className={textDesc}>?λ퉬 怨듦툒 鍮꾩슜</span>
                  <span className={`${isPink ? "text-rose-455" : "text-amber-600"} font-extrabold text-sm`}>290留???/span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className={textDesc}>珥덈룄 ?먯옱 吏??/span>
                  <span className={`${textTitle} font-extrabold`}>150留???/span>
                </div>
              </div>
              <div className="flex justify-between items-center font-black">
                <span className={`text-xs ${textTitle}`}>理쒖쥌 ?꾩엯 湲덉븸</span>
                <span className={`text-base ${isPink ? "text-rose-500" : "text-amber-500"}`}>440留???/span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center border-t border-neutral-200/20 pt-6 mt-8 text-[11px] sm:text-xs font-bold text-slate-500">
            <span>* 120pie & coffee ?듭씤???뱁솕 ?⑦궎吏 媛?대뱶 湲곗?</span>
            <span>Slide 11 / 16</span>
          </div>
        </section>

        {/* SECTION 12. 李쎌뾽紐⑤뜽 B */}
        <section className={`rounded-3xl p-6 sm:p-12 ${cardBg} relative`}>
          <div className="flex items-center justify-between border-b border-neutral-200/20 pb-4 mb-8">
            <span className="text-xs font-black tracking-widest text-[#ffd500]">12 / FRANCHISE MODEL B</span>
            <span className="text-xs font-black text-slate-400">COMPACT TAKE-OUT CAFE</span>
          </div>

          <div className="my-auto py-2 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-5 space-y-4 text-left flex flex-col justify-between">
              <div>
                <span className={`text-xs font-black px-2.5 py-1 ${isPink ? "bg-rose-500/10 text-rose-455 border-rose-500/20" : "bg-amber-400/10 text-amber-600 border-amber-400/20"} border rounded-full`}>
                  紐⑤뜽 B: 8~10??而댄뙥??留ㅼ옣
                </span>
                <h2 className={`text-xl sm:text-2xl md:text-3xl font-black leading-tight ${textTitle} mt-3`}>
                  ?ъ옣怨?????⑷툑 鍮꾩쑉,<br />
                  <span className={textHighlight}>1???댁쁺 理쒖쟻??/span> ?ㅼ냽??移댄럹
                </h2>
                <p className={`text-xs sm:text-sm leading-relaxed ${textDesc} mt-2`}>
                  8??10?됱쓽 肄ㅽ뙥?명븳 留ㅼ옣?먯꽌 ?ъ옣仙곟른錫?諛곕떖, ?뚯씠釉?留ㅼ텧??洹밸??뷀븯???뺤꽍 媛留??꾨줈洹몃옩?낅땲??
                </p>
              </div>
              
              <div className={`grid grid-cols-2 gap-3 text-xs font-bold ${textDesc}`}>
                {[
                  "1???댁쁺 媛???숈꽑 諛곗튂",
                  "珥덉냼??二쇰갑 ?뱁솕 ?덉씠?꾩썐",
                  "?꾩썐?꾩뼱 二쇰Ц 李쎄뎄 ?ㅺ퀎",
                  "怨좉툒 ?명뀒由ъ뼱 留덇컧 吏??
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
                  <span className="text-[10px] font-bold text-white/95">?뚯씠?ъ븘??諛??좊Ъ ?곸옄 諛뺤뒪</span>
                </div>
              </div>
            </div>

            <div className={`lg:col-span-4 p-6 rounded-2xl text-left flex flex-col justify-between ${innerCardBgAccent} ${innerCardHover}`}>
              <span className={`text-[10px] font-black ${textDesc} uppercase tracking-wider block`}>MODEL B BUDGET</span>
              <div className={`space-y-3 border-b ${isPink ? "border-neutral-805" : "border-amber-200/35"} pb-4 my-3`}>
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className={textDesc}>媛留?怨꾩빟鍮?/span>
                  <span className={`${textTitle} font-extrabold`}>200留???/span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className={textDesc}>?명뀒由ъ뼱 (10??湲곗?)</span>
                  <span className={`${textTitle} font-extrabold`}>1,500留???/span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className={textDesc}>媛꾪뙋 諛?湲곌린 ?명똿</span>
                  <span className={`${textTitle} font-extrabold`}>800留???/span>
                </div>
              </div>
              <div className="flex justify-between items-center font-black">
                <span className={`text-xs ${textTitle}`}>?덉긽 李쎌뾽 鍮꾩슜</span>
                <span className={`text-base ${isPink ? "text-rose-500" : "text-amber-500"}`}>2,500留????</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center border-t border-neutral-200/20 pt-6 mt-8 text-[11px] sm:text-xs font-bold text-slate-500">
            <span>* ?먰룷 ?꾩감猷뚮? ?쒖쇅???쒖? 李쎌뾽 媛쒖꽕 鍮꾩슜 ?덉떆</span>
            <span>Slide 12 / 16</span>
          </div>
        </section>

        {/* SECTION 13. 李쎌뾽紐⑤뜽 C */}
        <section className={`rounded-3xl p-6 sm:p-12 ${cardBg} relative`}>
          <div className="flex items-center justify-between border-b border-neutral-200/20 pb-4 mb-8">
            <span className="text-xs font-black tracking-widest text-[#ffd500]">13 / FRANCHISE MODEL C</span>
            <span className="text-xs font-black text-slate-400">PREMIUM CAFE & BRUNCH</span>
          </div>

          <div className="my-auto py-2 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-5 space-y-4 text-left flex flex-col justify-between">
              <div>
                <span className={`text-xs font-black px-2.5 py-1 ${isPink ? "bg-rose-500/10 text-rose-455 border-rose-500/20" : "bg-amber-400/10 text-amber-600 border-amber-400/20"} border rounded-full`}>
                  紐⑤뜽 C: 15???댁긽 ?꾨━誘몄뾼 移댄럹
                </span>
                <h2 className={`text-xl sm:text-2xl md:text-3xl font-black leading-tight ${textTitle} mt-3`}>
                  釉뚮윴移??쇱씤??媛뺥솕,<br />
                  <span className={textHighlight}>怨좉컼 泥대쪟 ?쒓컙</span>???섎━???꾨━誘몄뾼??                </h2>
                <p className={`text-xs sm:text-sm leading-relaxed ${textDesc} mt-2`}>
                  ?볦? ? ?뚯씠釉붿쓣 ?듯빐 ?붿??몃퓧留??꾨땲???뚮즺, 釉뚮윴移?留ㅼ텧???숇컲 ?깆옣???대걚??怨좎닔???뚮옒洹몄떗 留ㅼ옣?낅땲??
                </p>
              </div>
              
              <div className={`grid grid-cols-2 gap-3 text-xs font-bold ${textDesc}`}>
                {[
                  "?⑤룆 ?뚯씠釉?? 醫뚯꽍 ?뺣낫",
                  "?뚮젅?댄똿 ?붿????명듃 怨듦툒",
                  "?⑥껜 ?몃???諛?二쇰? 怨좉컼 ?좎튂",
                  "留ㅼ옣 ?쒕뱶留덊겕???붿옄??
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
                  <span className="text-[10px] font-bold text-white/95">?꾨━誘몄뾼 ?몃젴??二쇰갑 諛?? 援ъ꽦</span>
                </div>
              </div>
            </div>

            <div className={`lg:col-span-4 p-6 rounded-2xl text-left flex flex-col justify-between ${innerCardBgAccent} ${innerCardHover}`}>
              <span className={`text-[10px] font-black ${textDesc} uppercase tracking-wider block`}>MODEL C BUDGET</span>
              <div className={`space-y-3 border-b ${isPink ? "border-neutral-805" : "border-amber-200/35"} pb-4 my-3`}>
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className={textDesc}>媛留?怨꾩빟 諛?援먯쑁</span>
                  <span className={`${textTitle} font-extrabold`}>300留???/span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className={textDesc}>?명뀒由ъ뼱 (15??湲곗?)</span>
                  <span className={`${textTitle} font-extrabold`}>2,200留???/span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className={textDesc}>湲곌린 ?ㅻ퉬 諛?吏묎린</span>
                  <span className={`${textTitle} font-extrabold`}>1,100留???/span>
                </div>
              </div>
              <div className="flex justify-between items-center font-black">
                <span className={`text-xs ${textTitle}`}>?덉긽 李쎌뾽 鍮꾩슜</span>
                <span className={`text-base ${isPink ? "text-rose-500" : "text-amber-500"}`}>3,600留????</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center border-t border-neutral-200/20 pt-6 mt-8 text-[11px] sm:text-xs font-bold text-slate-500">
            <span>* 15?됲삎 ?쒖? ?뚮옒洹몄떗 留ㅼ옣 媛쒖꽕 寃ъ쟻 媛?대뱶 湲곗?</span>
            <span>Slide 13 / 16</span>
          </div>
        </section>

        {/* SECTION 14. 李쎌뾽?덉감 */}
        <section className={`rounded-3xl p-6 sm:p-12 ${cardBg} relative`}>
          <div className="flex items-center justify-between border-b border-neutral-200/20 pb-4 mb-8">
            <span className="text-xs font-black tracking-widest text-[#ffd500]">14 / FRANCHISE PROCESS</span>
            <span className="text-xs font-black text-slate-400">7-STEP LAUNCH ROADMAP</span>
          </div>

          <div className="space-y-10">
            <div className="text-center md:text-left space-y-3">
              <h2 className="text-2xl sm:text-3xl font-black">
                泥닿퀎?곸씤 <span className={textHighlight}>7?④퀎 媛쒖젏 ?꾨줈?몄뒪</span>
              </h2>
              <p className={`text-sm sm:text-base leading-relaxed ${textDesc}`}>
                ?곷떞 ?좎껌遺??理쒖쥌 洹몃옖???ㅽ뵂源뚯? 蹂몄궗 媛쒖젏 ?꾨떞???諛李⑺븯??耳?댄빀?덈떎.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
              <div className="lg:col-span-8 relative">
                {/* Connecting Line */}
                <div className={`absolute left-6 top-4 bottom-4 w-0.5 ${isPink ? "bg-neutral-805" : "bg-amber-200/50"} z-0`}></div>
                <div className="space-y-4 relative z-10">
                  {[
                    { step: "01", name: "?곷떞 ?좎껌", desc: "?꾩엯 ?뺥깭 諛??됱닔 吏꾨떒", icon: <Info size={12} className={isPink ? "text-rose-500" : "text-amber-500"} /> },
                    { step: "02", name: "?곴텒 遺꾩꽍", desc: "諛곕떖 諛??源?遺꾩꽍", icon: <Search size={12} className={isPink ? "text-rose-500" : "text-amber-500"} /> },
                    { step: "03", name: "媛留?怨꾩빟", desc: "?몃? ?쒗깮 諛?泥닿껐", icon: <FileText size={12} className={isPink ? "text-rose-500" : "text-amber-500"} /> },
                    { step: "04", name: "?꾨㈃ ?ㅺ퀎", desc: "1???숈꽑 諛곗튂???뺤젙", icon: <Building2 size={12} className={isPink ? "text-rose-500" : "text-amber-500"} /> },
                    { step: "05", name: "湲곌린 援먯쑁", desc: "1:1 ?덉떆??議곕━ 留덉뒪??, icon: <ChefHat size={12} className={isPink ? "text-rose-500" : "text-amber-500"} /> },
                    { step: "06", name: "?ㅽ뵂 由ы뿀??, desc: "理쒖쥌 媛???뚯뒪??, icon: <Sliders size={12} className={isPink ? "text-rose-500" : "text-amber-500"} /> },
                    { step: "07", name: "洹몃옖???ㅽ뵂", desc: "留ㅼ텧 ?쒖꽦??留덉???, icon: <Sparkles size={12} className={isPink ? "text-rose-500" : "text-amber-500"} /> }
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
                    <span className="text-xs font-bold text-white/95">?ㅽ뵂 以鍮??꾩냽 吏???⑦궎吏?諛?POP ?명듃</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center border-t border-neutral-200/20 pt-6 mt-8 text-[11px] sm:text-xs font-bold text-slate-500">
            <span>* ?곷떞遺???됯퇏 媛쒖젏 ?뚯슂 湲곌컙: ?듭씤??7?? ?좉퇋李쎌뾽 21??/span>
            <span>Slide 14 / 16</span>
          </div>
        </section>

        {/* SECTION 15. ?꾩엯 ?댁쑀 (WHY PARTNER WITH US) */}
        <section className={`rounded-3xl p-6 sm:p-12 ${cardBg} relative`}>
          <div className="flex items-center justify-between border-b border-neutral-200/20 pb-4 mb-8">
            <span className="text-xs font-black tracking-widest text-[#ffd500]">15 / FRANCHISE VALUE</span>
            <span className="text-xs font-black text-slate-400">PARTNER BENEFITS SUMMARY</span>
          </div>

          <div className="space-y-10">
            <div className="text-center md:text-left space-y-3">
              <h2 className="text-2xl sm:text-3xl font-black">
                ?먯＜?섎뱾??120pie瑜?<span className={textHighlight}>?좏깮??寃곗젙?곸씤 ?댁쑀</span>
              </h2>
              <p className={`text-sm sm:text-base leading-relaxed ${textDesc}`}>
                蹂몄궗 ?섏씡蹂대떎 媛留뱀젏二쇰떂??留덉쭊??理쒖슦?좎쑝濡??앷컖?섎뒗 釉뚮옖???뺤콉?낅땲??
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
              <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { title: "濡쒖뿴??0% ?좎뼵", desc: "留ㅼ썡 諛쒖깮?섎뒗 留ㅼ텧 鍮꾨? 媛留밴툑?대굹 愿묎퀬 遺꾨떞湲??쇱젅 泥?뎄 ?놁쓬", icon: <Percent size={16} /> },
                  { title: "媛留밸퉬 ?꾩븸 ?섍툒 ?꾨줈洹몃옩", desc: "?쇱젙 臾쇰웾 ?뚰솕 ?먮뒗 留ㅼ텧 湲곗? ?ъ꽦 ??蹂댁쬆湲덉쿂???섏썝", icon: <Award size={16} /> },
                  { title: "100% ?꾩젣???앹? 怨듦툒", desc: "諛섏＝, ?щ즺 ?먯쭏 ?놁씠 ?ㅻ툙湲??섎굹濡??꾨Ц 踰좎씠而ㅻ━ ?꾨━??援ы쁽", icon: <ChefHat size={16} /> },
                  { title: "媛뺣젰???쒖쫵 硫붾돱 ?명솚", desc: "?뚯씠 癒몄떊 ?몄뿉 怨꾨?鍮?癒몄떊 臾댁긽 ??щ줈 寃⑥슱泥?異붽? 留ㅼ텧 ?뺣낫", icon: <Sparkles size={16} /> }
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
                    <span className="text-xs font-bold text-white/95">媛留?怨듦툒 ?щ즺 李⑤퀎?? 移쒗솚寃??숇Ъ蹂듭? ?몄쬆 怨꾨?</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center border-t border-neutral-200/20 pt-6 mt-8 text-[11px] sm:text-xs font-bold text-slate-500">
            <span>* 媛留?怨듭젙嫄곕옒?꾩썝???쒖? ?쎄? 諛?媛留?怨꾩빟 ?댁슜 以??/span>
            <span>Slide 15 / 16</span>
          </div>
        </section>

        {/* SECTION 16. ?룸㈃ (Back Cover) */}
        <section className={`rounded-3xl p-6 sm:p-12 md:p-16 ${cardBg} flex flex-col justify-between min-h-[460px] relative overflow-hidden text-center`}>
          <div className="absolute inset-0 bg-gradient-to-tr from-amber-400/5 to-transparent pointer-events-none"></div>

          <div className="flex items-center justify-between border-b border-neutral-200/20 pb-6 mb-6">
            <span className="text-xs font-black tracking-widest text-slate-500">16 / BACK COVER</span>
            <span className={`text-xs font-bold ${isPink ? "text-rose-500" : "text-amber-600"} font-mono`}>120PIE & COFFEE</span>
          </div>

          <div className="my-auto py-10 space-y-6 max-w-2xl mx-auto">
            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-black leading-tight ${textTitle}`}>
              ?깃났?곸씤 李쎌뾽???쒖옉,<br />
              <span className={textHighlight}>120pie & coffee</span>媛 ?④퍡?⑸땲??
            </h2>
            <p className={`text-xs sm:text-sm md:text-base leading-relaxed ${textDesc}`}>
              ?덈퉬 媛留뱀젏二쇰떂??湲곗〈 ?ш굔???곴레 議댁쨷?섏뿬 理쒖? 鍮꾩슜?쇰줈 理쒕? ?⑥쑉??戮묒븘?대뒗 媛?대뱶瑜??쎌냽?쒕┰?덈떎. 吏湲??섎떒 ?곷떞 ?좎껌 ?쇱뿉 ?곕씫泥섎? ?④꺼二쇱꽭??
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-4">
              <button 
                type="button"
                onClick={handlePrintPage}
                className={`inline-flex items-center justify-center px-5 py-3 rounded-xl border font-extrabold text-sm cursor-pointer transition-all shadow-md ${isPink ? "bg-neutral-900 border-neutral-800 text-white hover:bg-neutral-800" : "bg-white border-amber-250/70 text-slate-700 hover:bg-amber-50/50"}`}
              >
                <FileText size={16} className={`mr-2 ${isPink ? "text-rose-500" : "text-amber-500"}`} /> ?꾩옱 ?쒖븞??PDF濡??몄뇙/???              </button>
              <a 
                href="#inquiry-form-section"
                className={`inline-flex items-center justify-center px-6 py-3 rounded-xl font-extrabold text-sm transition-all shadow-md ${isPink ? "bg-rose-500 text-white hover:bg-rose-600 shadow-rose-500/10" : "bg-amber-400 text-neutral-900 hover:bg-amber-300 shadow-amber-400/10"}`}
              >
                媛留??곷떞 ?좎껌???묒꽦?섍린
              </a>
            </div>
          </div>

          <div className="flex justify-between items-center border-t border-neutral-200/20 pt-6 mt-6 text-[11px] sm:text-xs font-bold text-slate-500">
            <span>짤 2026 120pie & coffee Corp. All rights reserved.</span>
            <span>Slide 16 / 16</span>
          </div>
        </section>

        {/* BOTTOM INQUIRY FORM SECTION */}
        <section id="inquiry-form-section" className={`rounded-3xl p-6 sm:p-12 ${cardBg} border-2 ${isPink ? "border-rose-500/40" : "border-amber-400/40"} relative`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-400/10 to-transparent pointer-events-none rounded-tr-3xl"></div>
          
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center space-y-3">
              <span className={`text-[10px] font-black tracking-widest ${isPink ? "text-rose-500" : "text-amber-500"} uppercase block font-mono`}>B2B CONSULTATION</span>
              <h2 className={`text-2xl sm:text-3xl font-black ${textTitle}`}>?ㅼ떆媛?媛留?& ?듭씤???꾩엯 臾몄쓽</h2>
              <p className={`text-xs sm:text-sm leading-relaxed ${textDesc}`}>
                ?곷떞 ?묒떇???낅젰?섏떆硫? 二쇰? 寃쎌웳??遺꾩꽍 諛?3D ?숈꽑 諛곗튂?꾧? ?ы븿??媛쒕퀎 ?곴텒 由ы룷?몃? 臾댁긽 ?쒓났???쒕┰?덈떎.
              </p>
            </div>

            {formSubmitted ? (
              <div className={`text-center p-8 ${innerCardBg} border ${isPink ? "border-neutral-805" : "border-amber-200/40"} rounded-2xl space-y-4`}>
                <div className="inline-flex w-12 h-12 bg-emerald-500/10 border border-emerald-500 text-emerald-500 rounded-full items-center justify-center">
                  <CheckCircle2 size={24} />
                </div>
                <div className="space-y-1">
                  <h4 className={`text-lg font-black ${textTitle}`}>媛留?諛??곷떞 臾몄쓽媛 ???묒닔?섏뿀?듬땲??</h4>
                  <p className={`text-xs sm:text-sm ${textDesc} font-semibold leading-relaxed`}>
                    ?묒꽦??二쇱떊 ?곕씫泥섎줈 ?곴텒 由ы룷??寃?????꾨Ц ?대떦 ?ㅼ옣??24?쒓컙 ???좎꽑 ?곕씫???쒕━寃좎뒿?덈떎.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFormSubmitted(false);
                    setFormData({ name: "", phone: "", storeType: "?듭씤???꾩엯", existingStoreName: "", message: "" });
                  }}
                  className={`text-xs sm:text-sm ${isPink ? "text-rose-500" : "text-amber-500"} font-bold hover:underline cursor-pointer bg-transparent border-0`}
                >
                  [ 異붽? ?곷떞 臾몄쓽 ?묒꽦?섍린 ]
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2 text-left">
                    <label className={`text-xs font-extrabold ${textDesc} block`}>?깊븿 / ?대떦??/label>
                    <input
                      type="text"
                      name="name"
                      placeholder="?깊븿???낅젰?섏꽭??
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className={`w-full ${inputBgClass} border rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none transition-colors`}
                    />
                  </div>
                  <div className="space-y-2 text-left">
                    <label className={`text-xs font-extrabold ${textDesc} block`}>?곕씫泥?/label>
                    <input
                      type="tel"
                      name="phone"
                      maxLength={13}
                      placeholder="?곕씫泥섎? ?낅젰?섏꽭??
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className={`w-full ${inputBgClass} border rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none transition-colors`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2 text-left">
                    <label className={`text-xs font-extrabold ${textDesc} block`}>李쎌뾽 ?좏삎 ?좏깮</label>
                    <select
                      name="storeType"
                      value={formData.storeType}
                      onChange={handleInputChange}
                      className={`w-full ${inputBgClass} border rounded-xl px-3.5 py-3 text-xs sm:text-sm focus:outline-none transition-colors cursor-pointer font-bold`}
                    >
                      <option value="?듭씤???꾩엯">湲곗〈 留ㅼ옣 ?듭씤???꾩엯</option>
                      <option value="?좉퇋 ?뚯옄蹂?李쎌뾽">?뚯옄蹂?移댄럹 ?좉퇋 李쎌뾽</option>
                      <option value="?꾨━誘몄뾼 媛留?>?꾨━誘몄뾼 釉뚮윴移?留ㅼ옣 李쎌뾽</option>
                      <option value="?낆쥌 蹂寃?臾몄쓽">? ?낆쥌 蹂寃?媛??/option>
                    </select>
                  </div>
                  <div className="space-y-2 text-left">
                    <label className={`text-xs font-extrabold ${textDesc} block`}>湲곗〈 留ㅼ옣紐?(?좏깮)</label>
                    <input
                      type="text"
                      name="existingStoreName"
                      placeholder="?? 120移댄럹 媛뺣궓??
                      value={formData.existingStoreName}
                      onChange={handleInputChange}
                      className={`w-full ${inputBgClass} border rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none transition-colors`}
                    />
                  </div>
                </div>

                <div className="space-y-2 text-left">
                  <label className={`text-xs font-extrabold ${textDesc} block`}>?곷떞 臾몄쓽 ?곸꽭 (?좏깮)</label>
                  <textarea
                    name="message"
                    rows={4}
                    placeholder="留ㅼ옣???됱닔??媛???쒓컙?, ?꾧린 ?ㅻ퉬 ??沅곴툑?섏떊 ?댁슜???명븯寃?湲곗닠??二쇱꽭??"
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
                    ?곷떞 ?덈궡瑜??꾪븳 媛留밸낯?ъ쓽 媛쒖씤?뺣낫 ?섏쭛 諛??곷떞 ?곕씫???숈쓽?⑸땲?? (?꾩닔)
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full font-black text-sm sm:text-base py-4 rounded-xl hover:scale-[1.01] active:scale-[0.99] transition-all shadow-md border-0 cursor-pointer ${isPink ? "bg-rose-500 text-white hover:bg-rose-600 shadow-rose-500/15" : "bg-amber-400 text-neutral-900 hover:bg-amber-300 shadow-amber-400/15"}`}
                >
                  {isSubmitting ? "臾몄쓽 ?깅줉 泥섎━ 以?.." : "VIP 留욎땄 李쎌뾽 ?곷떞 ?묒닔 ?꾨즺"}
                </button>
              </form>
            )}
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-neutral-200/20 text-center text-xs font-semibold text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-4">
          <p>?쒖씪?닿났?먰봽?ㅻ퉬 | ??쒖씠?? ?띻만??| ?쒖슱?밸퀎??媛뺣궓援???궪濡?120, 5痢?/p>
          <p>媛留밸Ц?? 1566-0000 | ?대찓?? support@120pie.com | ?ъ뾽?먮벑濡앸쾲?? 000-00-00000</p>
          <p className="text-[10px] text-slate-650">짤 2026 120pie & coffee Corp. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
