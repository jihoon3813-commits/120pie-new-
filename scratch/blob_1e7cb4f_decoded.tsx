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
    title: "���� ī�� ���μ� ���� (A ����)",
    badge: "���μ� ���� ��",
    stats: "����� ���� 45�� �� ���",
    desc: "������ ���ܰ� ���� ���ַ� ��Ǵ� ���а� ���� ī�俴����, 120�� ���� ���� �� ��Ʈ �ֹ��� ���������� �þ ���ܰ��� ������ ���ÿ� ��ҽ��ϴ�.",
    points: [
      "���� Ŀ�� ��� �� ���� 100% �״�� Ȱ��",
      "����� ����Ʈ ���� �ֹ��� 68% ���",
      "���� 2�� ���� ��޾� ����Ʈ ī�װ��� ��ŷ ����"
    ]
  },
  {
    title: "1�� ���ں� �������� â�� (B ����)",
    badge: "���ں� �ű� â��",
    stats: "6���� ���� â�� ��� ȸ��",
    desc: "���� ���������� ġŲ���� ��ϴ� ������ �뵿 ������ �ο�Ƽ�� �����ϴ� ��, 1�� ��� ������ 120pie ����Ʈ ī�� �𵨷� ��ȯ�� �������� �޼��߽��ϴ�.",
    points: [
      "�ΰǺ� ����, ���� 1�� � ����ȭ �ý���",
      "������ ��� ���� ���� ���� �ݵ�ü�� ���� ����",
      "��ũŸ�� 3�� ������ ���̺� ȸ���� 3�� ����"
    ]
  },
  {
    title: "��� & ���� Ưȭ ���� (C ����)",
    badge: "���/���� Ưȭ ��",
    stats: "��Ʈ �ֹ� �ܰ� 2.2�� �� �޼�",
    desc: "���� �ְ� ���� ��ǿ� �����Ͽ� ��ް� ����ũ�ƿ� ���ַ� �����ϴ� �Ǽ��� �����Դϴ�. ��ü ���� �ֹ��� �йи� �� ���� ���� ������ �ſ� �����ϴ�.",
    points: [
      "�п���, ����� ��ü ���� �ֹ� ����� 15ȸ ����",
      "��Ű¡ ������ ����ȭ�� ������ ����ũ�ƿ� ���� ����",
      "����ǹ��� ���� ��ŷ ������ ������ ��� ���� Ȯ��"
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
    storeType: "���μ� ����",
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
      alert("���԰� ����ó�� �Է��� �ּ���.");
      return;
    }

    setIsSubmitting(true);
    try {
      await addInquiry({
        name: formData.name,
        phone: formData.phone,
        storeType: formData.storeType,
        existingStoreName: formData.existingStoreName || "",
        message: formData.message || "â�� �ȳ� �������� ���� ��� ��û",
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
            <Link className="flex items-center group shrink-0" href={backUrl} aria-label="120pie Ȩ���� �̵�">
              <img
                src={logoUrl}
                alt="120pie & coffee"
                className="h-5 sm:h-7 lg:h-8 w-auto object-contain group-hover:scale-102 transition-all duration-200"
              />
            </Link>
          </div>

          <nav className={`hidden lg:flex items-center gap-2.5 xl:gap-4 text-[10px] xl:text-[13px] font-bold shrink-0 ${navLinkTextClass}`}>
            <Link href={`${backUrl}#menu`} className="hover:text-amber-400 transition-colors">�޴� īŻ�α�</Link>
            <Link href={`/stores?theme=${theme}`} className="hover:text-amber-400 transition-colors">������ ��Ȳ</Link>
            <Link href={`/costs?theme=${theme}`} className="hover:text-amber-400 transition-colors">���μ� �ȳ�</Link>
            <Link href={`/franchise?theme=${theme}`} className={`hover:scale-105 transition-transform shrink-0 ${
              isPink 
                ? "text-rose-500 hover:text-rose-600 font-extrabold" 
                : "text-[#ffd500] hover:text-[#e6bd00] font-extrabold"
            }`}>
              â�� �ȳ�
            </Link>
            <Link href={`${backUrl}#faq`} className="hover:text-amber-400 transition-colors">FAQ</Link>
          </nav>

          <div className="flex items-center gap-2.5">
            <div className={`flex items-center rounded-full border p-0.5 text-[10px] font-black ${switcherWrapperClass}`}>
              <a
                onClick={() => handleThemeChange("yellow")}
                className={`rounded-full px-2.5 py-1 transition-colors cursor-pointer select-none focus:outline-none focus:ring-0 outline-none ${switcherBtnYellowClass}`}
              >
                ����
              </a>
              <a
                onClick={() => handleThemeChange("pink")}
                className={`rounded-full px-2.5 py-1 transition-colors cursor-pointer select-none focus:outline-none focus:ring-0 outline-none ${switcherBtnBlackClass}`}
              >
                ����
              </a>
            </div>
            <Link className={`hidden sm:inline-flex items-center justify-center px-4 py-2.5 rounded-lg border text-xs font-bold focus:outline-none focus:ring-0 outline-none ${portalBtnClass}`} href="/portal" target="_blank" rel="noopener noreferrer">
              ��������
            </Link>
            <a href="#inquiry-form-section" className={`pink-primary-button hidden sm:inline-flex items-center justify-center px-5 py-2.5 rounded-lg text-xs sm:text-sm font-black hover:scale-[1.02] transition-all border-0 cursor-pointer ${
              isPink 
                ? "bg-rose-500 hover:bg-rose-600 text-white shadow-[0_4px_16px_rgba(244,63,94,0.2)]" 
                : "bg-amber-400 hover:bg-amber-300 text-neutral-950 shadow-[0_4px_16px_rgba(251,191,36,0.2)]"
            }`}>
              ��� ��û <ArrowRight size={14} className="ml-1.5 shrink-0" />
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
                �޴� īŻ�α�
              </Link>
              <Link href={`/stores?theme=${theme}`} onClick={() => setMobileNavOpen(false)} className={`rounded-xl px-4 py-3 transition-colors ${mobileNavLinkClass}`}>
                ������ ��Ȳ
              </Link>
              <Link href={`/costs?theme=${theme}`} onClick={() => setMobileNavOpen(false)} className={`rounded-xl px-4 py-3 transition-colors ${mobileNavLinkClass}`}>
                ���μ� �ȳ�
              </Link>
              <Link href={`/franchise?theme=${theme}`} onClick={() => setMobileNavOpen(false)} className={`rounded-xl px-4 py-3 transition-colors font-extrabold ${
                isPink 
                  ? "text-rose-500 bg-rose-500/10 border border-rose-500/20" 
                  : "text-[#ffd500] bg-[#ffd500]/10 border border-[#ffd500]/20"
              }`}>
                â�� �ȳ�
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
              ��� ��û <ArrowRight size={15} className="ml-1.5" />
            </a>
          </nav>
        )}
      </header>

      {/* Main Content (16 Slides as Sections) */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-24 sm:space-y-36">
        
        {/* SECTION 1. ǥ�� (Cover) */}
        <section className={`rounded-3xl p-6 sm:p-12 md:p-16 ${cardBg} flex flex-col justify-between min-h-[500px] relative overflow-hidden`}>
          {/* Accent decoration */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-[#ffd500]/10 to-transparent rounded-bl-full pointer-events-none"></div>
          
          <div className="flex items-center justify-between border-b border-neutral-200/20 pb-6 mb-6">
            <span className={`text-xs font-black tracking-widest ${isPink ? "text-neutral-450" : "text-[#0d233a]/80"}`}>120PIE & COFFEE</span>
            <span className="text-xs font-extrabold px-3 py-1 bg-amber-400 text-[#0d233a] border border-[#0d233a]/10 rounded-full shadow-sm">
              ���� â�� ����
            </span>
          </div>

          <div className="my-auto py-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6 text-left">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
                ���� ���忡<br />
                <span className={textHighlight}>����Ʈ ����</span>�� ���ϴ�<br />
                ���� Ȯ���� �ַ��
              </h1>
              <p className={`text-sm sm:text-base md:text-lg leading-relaxed ${textDesc}`}>
                40�� ������������ ��� 120�� ���̿� ����� �ӽ� ���ޱ���.<br />
                ���׸��� �δ� ���� ���ں� ���μ� �������� �������� �߰� ������ â���ϼ���.
              </p>
              
              <div className="flex flex-wrap gap-3 pt-2">
                <a 
                  href="/120pie_franchise_proposal.pdf" 
                  download="120pie_����â�����ȼ�.pdf"
                  className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-amber-400 text-[#0d233a] hover:bg-amber-300 font-extrabold text-sm transition-all shadow-md shadow-[#ffd500]/10"
                >
                  <Download size={16} className="mr-2" /> ���ȼ� PDF �ٿ�ε�
                </a>
                <a 
                  href="#inquiry-form-section" 
                  className={`inline-flex items-center justify-center px-5 py-3 rounded-xl border font-extrabold text-sm transition-all ${
                    isPink 
                      ? "border-neutral-700 bg-neutral-900 text-white hover:bg-neutral-800" 
                      : "border-[#e6dfc3] bg-white text-[#0d233a] hover:bg-[#fffdf4]"
                  }`}
                >
                  ���� â����� ����
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
                  <span className="text-xs font-bold text-white/95">��ǥ �޴�: 120�� �������� ��������</span>
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
                    �� <span className={textHighlight}>120�� ����</span>�� �����ؾ� �ұ��?
                  </h2>
                  <p className={`text-sm sm:text-base leading-relaxed ${textDesc}`}>
                    40�� ���� ������ ��� ������ ���� ���� 300ȣ�� ������ ���� ��ȭ�� ������ �Ŀ� �귣���Դϴ�.
                  </p>
                </div>

                {/* Growth Graph */}
                <div className={`p-5 rounded-2xl ${innerCardBg} space-y-4`}>
                  <h4 className={`text-xs sm:text-sm font-black text-center md:text-left flex items-center gap-1.5 ${textTitle}`}>
                    <TrendingUp size={16} className={isPink ? "text-rose-500" : "text-amber-500"} /> 3�� ���� ���� ���� ��ǥ (���� ��� ����)
                  </h4>
                  <div className="space-y-3 pt-2">
                    {[
                      { year: "1���� (��Ī��)", count: "10ȣ��", width: "w-[15%]", bg: "bg-slate-400" },
                      { year: "2���� (�����)", count: "70ȣ��", width: "w-[40%]", bg: isPink ? "bg-rose-500/70" : "bg-amber-400/70" },
                      { year: "3���� (����)", count: "300ȣ�� ����", width: "w-full", bg: isPink ? "bg-rose-500" : "bg-amber-400" }
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
                    <span className="text-xs font-bold text-white/95">40�� ���� ������ 120�� ���� ���� ���� ����</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: "���̹� �˻���", val: "�� 61,500ȸ+", desc: "Ű���� ���� �˻��� �е��� 1��", icon: <Search size={22} className={isPink ? "text-rose-500" : "text-amber-400"} /> },
                { title: "SNS �ؽ��±�", val: "���� 19.3����+", desc: "#120������ �ڹ��� �Լҹ� Ȯ��", icon: <Hash size={22} className={isPink ? "text-rose-500" : "text-amber-400"} /> },
                { title: "�귣�� ������", val: "���� ����Ʈ 1��", desc: "���� ��ȣ�� ���� ��� ����", icon: <Award size={22} className={isPink ? "text-rose-500" : "text-amber-400"} /> }
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
            <span>* ���� Ʈ���� �� ���� ���� ��༭ ���� ����</span>
            <span>Slide 02 / 16</span>
          </div>
        </section>

        {/* SECTION 3. 6WAY ���� ���� */}
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
                    �ٰ�ȭ�� <span className={textHighlight}>6WAY ���� ����</span>
                  </h2>
                  <p className={`text-sm sm:text-base leading-relaxed ${textDesc}`}>
                    ��ǰ� ������ ������� ��� ��ȿ�� ���� ������ �������ϴ�.
                  </p>
                </div>

                {/* Channels Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[
                    { title: "01. ���� �� Ȧ", desc: "Ŀ�ǿ� ��Ʈ ���� �ش�ȭ", icon: <Store size={16} className="text-amber-400" /> },
                    { title: "02. ���� (����ũ�ƿ�)", desc: "1�� ��, �йи� �� ���� ����", icon: <ShoppingBag size={16} className="text-amber-400" /> },
                    { title: "03. ��� (��������)", desc: "��޾� ����Ʈ ������ Ȯ��", icon: <Truck size={16} className="text-amber-400" /> },
                    { title: "04. B2B ���� ��ǰ", desc: "�ֺ� ���� ���� ���� ��ǰ", icon: <Layers size={16} className="text-amber-400" /> },
                    { title: "05. ��ü �ֹ� ��ġ", desc: "�б���ȸ�硤��ȣȸ �뷮 ����", icon: <Users size={16} className="text-amber-400" /> },
                    { title: "06. ��ü ���� �޴�", desc: "��������򷯽� ������ ���ξ�", icon: <Sparkles size={16} className="text-amber-400" /> }
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
                    <span className="text-xs font-bold text-white/95">���� �� ��� ������� ���̴� �귣�� ���� ��Ű¡ �ڽ�</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Time-of-day timeline */}
            <div className={`p-6 rounded-2xl ${innerCardBg} space-y-6`}>
              <h4 className={`text-sm font-bold text-center md:text-left flex items-center gap-2 ${textTitle}`}>
                <Clock size={16} className={isPink ? "text-rose-500" : "text-amber-500"} /> ���� ���� 24�ð� Ÿ�Ӷ��κ� ���� ����
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-left">
                {[
                  { time: "08:00 - 11:00", label: "��ħ �/��ٱ�", menu: "������ �� ����� & Ŀ��", icon: <Sun size={14} className="text-amber-400" /> },
                  { time: "11:30 - 14:00", label: "���� ���� ����Ʈ", menu: "120�� �������� & �Ƹ޸�ī��", icon: <Coffee size={14} className="text-amber-400" /> },
                  { time: "14:30 - 17:00", label: "���� ���� Ÿ��", menu: "������ �򷯽� & ��� ����", icon: <Sparkles size={14} className="text-amber-400" /> },
                  { time: "17:30 - 21:00", label: "���� ��� �� �߽�", menu: "������ �Ҵ����� �йи� ��", icon: <Moon size={14} className="text-amber-400" /> }
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
            <span>* ��� �Ǹ� ä�� ���� �� ������ ��� �ð��� ���� �м� ����</span>
            <span>Slide 03 / 16</span>
          </div>
        </section>

        {/* SECTION 4. ���� ���� �ý��� (���۷��̼�) */}
        <section className={`rounded-3xl p-6 sm:p-12 ${cardBg} relative`}>
          <div className="flex items-center justify-between border-b border-neutral-200/20 pb-4 mb-8">
            <span className="text-xs font-black tracking-widest text-[#ffd500]">04 / OPERATION SYSTEM</span>
            <span className="text-xs font-black text-slate-400">EASY COOKING PROCESS</span>
          </div>

          <div className="space-y-10">
            <div className="text-center md:text-left space-y-3">
              <h2 className="text-2xl sm:text-3xl font-black">
                ���� �ֹ��� ���� <span className={textHighlight}>�ذ��� ���� ȿ����</span>
              </h2>
              <p className={`text-sm sm:text-base leading-relaxed ${textDesc}`}>
                ���翡�� 100% ���� ������ �Ϻ� �ݵ�ü�� �����Ͽ� ���忡���� ���쿡 ���⸸ �ϸ� �ϼ��˴ϴ�.
              </p>
            </div>

            {/* Steps Flowchart */}
            <div className="relative">
              <div className={`hidden sm:block absolute top-1/2 left-4 right-4 h-0.5 ${isPink ? "bg-neutral-800/80" : "bg-[#e6dfc3]"} -translate-y-1/2 z-0`}></div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 text-center relative z-10">
                {[
                  { step: "STEP 01", title: "���� ����", desc: "���� �� 3ȸ �ż� �õ� ���� �����", icon: <Truck size={20} className="text-amber-400" /> },
                  { step: "STEP 02", title: "�õ� ����", desc: "�ص� ���� ���� ��� ���� ����", icon: <Warehouse size={20} className="text-amber-400" /> },
                  { step: "STEP 03", title: "3�� ����ŷ", desc: "����⿡ �ְ� Ÿ�̸� ���� �Ϸ�", icon: <ChefHat size={20} className="text-amber-400" /> },
                  { step: "STEP 04", title: "��� ����", desc: "�ٻ����� ����ִ� 120�� ���� �ϼ�", icon: <ShoppingBag size={20} className="text-amber-400" /> }
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
                  <Sliders size={20} className="text-amber-400" /> �ʼ��� �ֹ� Ưȭ ������
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-400 font-semibold">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 mt-0.5">?</span>
                    <span>1.5�� �ʼ��� �ֹ� ���������ε� ���� ��ġ �� ��� ���� ����</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 mt-0.5">?</span>
                    <span>���� ��� ����, ��Ʈ ���� �� ���ʿ��� ����� �����ü� ���ʿ�</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 mt-0.5">?</span>
                    <span>100% ���� ����ŷ ��� ������� ���� ����, ����, ���� �ּ�ȭ</span>
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
                  <span className="text-xs font-bold text-white/95">������ ���� �ֹ� ���� ���� �� ���׻� ���� ���</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center border-t border-neutral-200/20 pt-6 mt-8 text-[11px] sm:text-xs font-bold text-slate-500">
            <span>* ���� ���� ���� ���� �� ���� ���� ���μ��� ����</span>
            <span>Slide 04 / 16</span>
          </div>
        </section>

        {/* SECTION 5. ���� ���̾ƿ� (���� ����) */}
        <section className={`rounded-3xl p-6 sm:p-12 ${cardBg} relative`}>
          <div className="flex items-center justify-between border-b border-neutral-200/20 pb-4 mb-8">
            <span className="text-xs font-black tracking-widest text-[#ffd500]">05 / SPACE DESIGN</span>
            <span className="text-xs font-black text-slate-400">FLOOR LAYOUT PLANS</span>
          </div>

          <div className="space-y-10">
            <div className="text-center md:text-left space-y-3">
              <h2 className="text-2xl sm:text-3xl font-black">
                ����� ������ <span className={textHighlight}>���� ���� ����</span>
              </h2>
              <p className={`text-sm sm:text-base leading-relaxed ${textDesc}`}>
                ������ ��������� ������� 1�� �ٹ� ȿ���� �ش�ȭ�� �Ǽ��� ��ġ���Դϴ�.
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
                8���� ����Ʈ ���̾ƿ�
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
                10���� Ǯ��Ű�� ���̾ƿ�
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
                    ? "����ũ�ƿ� �� ��� ���� 1�� ī���� ����" 
                    : "���̺� Ȧ ����� ���� ����� ��� �����ϴ� ����"
                  }
                </h4>
                <p className={`text-xs sm:text-sm ${textDesc} font-semibold leading-relaxed`}>
                  {selectedPlanTab === "8py" 
                    ? "ī���� ���鿡 ���� �����̽��� ���� ��ġ�ϰ�, �޺��� ���� �ӽŰ� ���׻� �ӽ��� 1�� ������ ����ȭ�Ͽ� �� �ڸ����� �ֹ� ����, ����, ����, ���� ���ޱ��� �̵� �Ÿ� 1.5m �̳��� ������ �����߽��ϴ�." 
                    : "���̺� 3~4���� ���������� ��ȹ�ϸ鼭, ����ũ�ƿ� ��ο� ��� ��� �Ⱦ� ���� ���� �и����׽��ϴ�. �ֹ� ���ο��� �ʼ��� �򷯽� Ƣ��� �������� �߰��� Ȯ�� ������ �������� �����̴� �����Դϴ�."
                  }
                </p>
                <div className="grid grid-cols-2 gap-4 text-xs font-bold pt-2">
                  <div className={`p-3 rounded-lg border text-center ${isPink ? "bg-neutral-950/50 border-neutral-850" : "bg-amber-400/5 border-amber-200/40"}`}>
                    <span className={`${textDesc} block mb-1`}>�ʿ� �ֹ� ���</span>
                    <span className={`text-sm font-black ${textTitle}`}>{selectedPlanTab === "8py" ? "1.5�� ����" : "2.0�� ����"}</span>
                  </div>
                  <div className={`p-3 rounded-lg border text-center ${isPink ? "bg-neutral-950/50 border-neutral-850" : "bg-amber-400/5 border-amber-200/40"}`}>
                    <span className={`${textDesc} block mb-1`}>���� � �ο�</span>
                    <span className={`text-sm font-black ${textTitle}`}>{selectedPlanTab === "8py" ? "���� 1�� ����" : "1�� ~ 1.5��"}</span>
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
                    {selectedPlanTab === "8py" ? "8�� ���� ���� ���׸��� ���̾ƿ�" : "10�� ���� ���� �� ���Ϸ��� ���� ��ġ"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center border-t border-neutral-200/20 pt-6 mt-8 text-[11px] sm:text-xs font-bold text-slate-500">
            <span>* ���� ���� ���� ���׸��� ����� ��� ���� �� ���� ���� ����</span>
            <span>Slide 05 / 16</span>
          </div>
        </section>

        {/* SECTION 6. ���� ���׸��� */}
        /* SECTION 7. ������� */
        <section className={`rounded-3xl p-6 sm:p-12 ${cardBg} relative`}>
          <div className="flex items-center justify-between border-b border-neutral-200/20 pb-4 mb-8">
            <span className="text-xs font-black tracking-widest text-[#ffd500]">07 / SUCCESS CASES</span>
            <span className="text-xs font-black text-slate-400">REAL PARTNERSHIP RESULTS</span>
          </div>

          <div className="space-y-10">
            <div className="text-center md:text-left space-y-3">
              <h2 className="text-2xl sm:text-3xl font-black">
                �������ִ��� �����ϴ� <span className={textHighlight}>���� ���� �������</span>
              </h2>
              <p className={`text-sm sm:text-base leading-relaxed ${textDesc}`}>
                ���� ������ ������� 120pie�� ��ǰ���� ���յǾ� ������ ���� �ݵ��� �̷ﳽ ���ִԵ��� ������ �ı��Դϴ�.
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
                    <span className="text-xs font-bold text-white/95 mt-0.5">���� �ν��� ���� �� ����� ���� ȫ�� �ð� �þ�</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center border-t border-neutral-200/20 pt-6 mt-8 text-[11px] sm:text-xs font-bold text-slate-500">
            <span>* ������ POS ������ �� ��� �м� ���� �ڷ� ����</span>
            <span>Slide 07 / 16</span>
          </div>
        </section>

        {/* SECTION 8. �޴����� */}
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
                  źź�� �������<br />
                  <span className={textHighlight}>����ȭ�� �޴� ����</span>
                </h2>
                <p className={`text-xs sm:text-sm leading-relaxed ${textDesc} max-w-xl`}>
                  ��ǰ� �������� ���� �ó����� �� �� �ִ� ��ä�ο� ���̾�� ����Ʈ ���ξ��� ���߰� �ֽ��ϴ�.
                </p>
              </div>

              <div className="lg:col-span-5 space-y-3">
                {[
                  { title: "����Ʈ �پ缺", desc: "�������� Ʈ���带 �ݿ��� ��ä�ο� ���̾�� �޴�" },
                  { title: "�Ļ� ��� Ȯ��", desc: "����� ���̵� �޴��� �Ļ� ������� ����" },
                  { title: "������� ����", desc: "����Ʈ�� ��︮�� �پ��� ���� ���ξ� ����" }
                ].map((item, idx) => (
                  <div key={idx} className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all duration-300 ${isPink ? "bg-neutral-900/60 border border-neutral-800 text-white" : "bg-amber-400 text-neutral-900 shadow-sm shadow-amber-400/5"}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isPink ? "bg-rose-500/10 text-rose-500" : "bg-neutral-900 text-amber-400"}`}>
                      <Check size={14} strokeWidth={3} />
                    </div>
                    <div className="text-left">
                      <div className="text-xs sm:text-sm font-bla        {/* SECTION 9. ���� �޴����� */}
        <section className={`rounded-3xl p-6 sm:p-12 ${cardBg} relative`}>
          <div className="flex items-center justify-between border-b border-neutral-200/20 pb-4 mb-8">
            <span className="text-xs font-black tracking-widest text-[#ffd500]">09 / DETAILED MENU</span>
            <span className="text-xs font-black text-slate-400">FLAVOR PROFILES</span>
          </div>

          <div className="space-y-10">
            <div className="text-center md:text-left space-y-3">
              <h2 className="text-2xl sm:text-3xl font-black">
                ������ ���� ���� <span className={textHighlight}>���� �޴� ����</span>
              </h2>
              <p className={`text-sm sm:text-base leading-relaxed ${textDesc}`}>
                ī�װ����� ���� Ŭ���Ͽ� 120pie & coffee�� ��� ���� ��� �޴����� Ȯ���� ������.
              </p>
            </div>

            {/* Tabs Navigation */}
            <div className="flex flex-wrap justify-center gap-2 mb-8 select-none">
              {[
                { key: "pie", label: "120�� ���� �ø���", emoji: "?" },
                { key: "egg", label: "���� 120 �ø���", emoji: "?" },
                { key: "churros", label: "�򷯽� 120 �ø���", emoji: "?" },
                { key: "side", label: "������ & �ֵ���", emoji: "?" },
                { key: "drink", label: "Ŀ�� & ����", emoji: "?" }
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
                    "��ȣ�� ����", "����δ����� ����", "������Ʈ ����", "��ġ�� ����",
                    "���� ����", "�Ұ��� ����", "�Ҵ� ����", "ũ��ġ�� ����",
                    "���� ����", "��ġ�� ����", "Ŀ���͵� ����", "���纣�� ����"
                  ].map((name, idx) => (
                    <div key={idx} className="group flex flex-col items-center">
                      <div className={`w-full aspect-square rounded-2xl border-2 border-dashed ${isPink ? "border-neutral-800 bg-neutral-900/30 text-rose-500/20" : "border-amber-200/60 bg-amber-50/20 text-amber-500/30"} flex flex-col items-center justify-center relative group-hover:border-amber-400 transition-all duration-300`}>
                        <span className="text-2xl opacity-60">?</span>
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
                    "�������� �����", "������ �����", "Ŀ���͵� �����", "��ġ�� �����",
                    "������Ʈ �����", "���¥ �����", "��ũ�� �����", "�� �����"
                  ].map((name, idx) => (
                    <div key={idx} className="group flex flex-col items-center">
                      <div className={`w-full aspect-square rounded-2xl border-2 border-dashed ${isPink ? "border-neutral-800 bg-neutral-900/30 text-rose-500/20" : "border-amber-200/60 bg-amber-50/20 text-amber-500/30"} flex flex-col items-center justify-center relative group-hover:border-amber-400 transition-all duration-300`}>
                        <span className="text-2xl opacity-60">?</span>
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
                    "�������� �򷯽�", "���� �򷯽�", "������ �򷯽�", "���� �򷯽�"
                  ].map((name, idx) => (
                    <div key={idx} className="group flex flex-col items-center">
                      <div className={`w-full aspect-square rounded-2xl border-2 border-dashed ${isPink ? "border-neutral-800 bg-neutral-900/30 text-rose-500/20" : "border-amber-200/60 bg-amber-50/20 text-amber-500/30"} flex flex-col items-center justify-center relative group-hover:border-amber-400 transition-all duration-300`}>
                        <span className="text-2xl opacity-60">?</span>
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
                    "���� ������", "���� ������", "¥�� ������", "��ȭ�Ұ��� �ֵ���"
                  ].map((name, idx) => (
                    <div key={idx} className="group flex flex-col items-center">
                      <div className={`w-full aspect-square rounded-2xl border-2 border-dashed ${isPink ? "border-neutral-800 bg-neutral-900/30 text-rose-500/20" : "border-amber-200/60 bg-amber-50/20 text-amber-500/30"} flex flex-col items-center justify-center relative group-hover:border-amber-400 transition-all duration-300`}>
                        <span className="text-2xl opacity-60">?</span>
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
                    "�Ƹ޸�ī��", "ī���", "�ٴҶ��", "�ݵ���", "����", "�����", "������",
                    "���Ʈ������", "ĳ����Ƽ", "����Ŀ��Ƽ", "���۹�ƮƼ", "��ũƼ", "���̽�Ƽ", "���",
                    "��ũ����ũ", "���⽦��ũ", "����ũ����ũ", "���ڽ���ũ", "�����ֽ�", "�����ֽ�", "���纣���ֽ�"
                  ].map((name, idx) => (
                    <div key={idx} className="group flex flex-col items-center">
                      <div className={`w-full aspect-square rounded-2xl border-2 border-dashed ${isPink ? "border-neutral-800 bg-neutral-900/30 text-rose-500/20" : "border-amber-200/60 bg-amber-50/20 text-amber-500/30"} flex flex-col items-center justify-center relative group-hover:border-amber-400 transition-all duration-300`}>
                        <span className="text-2xl opacity-60">?</span>
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
            <span>* ���� �ñ״�ó ī�װ��� ��ü �޴� ���� ����Ʈ ����</span>
            <span>Slide 09 / 16</span>
          </div>
        </section>                  />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center border-t border-neutral-200/20 pt-6 mt-8 text-[11px] sm:text-xs font-bold text-slate-500">
            <span>* 120pie & coffee ��ü ��ǰ ���� ���� ǰ�� ����Ʈ ����</span>
            <span>Slide 08 / 16</span>
          </div>
        </section>


        {/* SECTION 9. ���� �޴����� */}
        <section className={`rounded-3xl p-6 sm:p-12 ${cardBg} relative`}>
          <div className="flex items-center justify-between border-b border-neutral-200/20 pb-4 mb-8">
            <span className="text-xs font-black tracking-widest text-[#ffd500]">09 / DETAILED MENU</span>
            <span className="text-xs font-black text-slate-400">FLAVOR PROFILES</span>
          </div>

          <div className="space-y-10">
            <div className="text-center md:text-left space-y-3">
              <h2 className="text-2xl sm:text-3xl font-black">
                ���� ��湮�� �θ��� <span className={textHighlight}>���� �ñ״�ó �޴�</span>
              </h2>
              <p className={`text-sm sm:text-base leading-relaxed ${textDesc}`}>
                �ż��� �ʸ��� Ư�� �ҽ��� ���� �� ä�� �� �� ����� ���� ���� ǳ�̸� �����մϴ�.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: "�������� ��������", type: "SWEET DESSERT", rating: "�ڡڡڡڡ� (4.9)", desc: "��� ������ ���� ������ ������ �ó��� ���� �ʸ��� Ư¡�� �ε��� 1�� �޴�", img: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779945185/120%EA%B2%B9%ED%8C%8C%EC%9D%B4_%EC%97%B0%EC%B6%9C1_ueicna.jpg" },
                { name: "��ȭ �Ұ�������", type: "SAVORY MEAL", rating: "�ڡڡڡڡ� (4.8)", desc: "����¬������ ���ұ��� ���� �Ұ��� ������ ���� �� ����� �Ļ� ��� ����", img: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779945185/120%EA%B2%B9%ED%8C%8C%EC%9D%B4_%EC%97%B0%EC%B6%9C4_r90tky.jpg" },
                { name: "�������� ����120", type: "DELI EGG BREAD", rating: "�ڡڡڡڡ� (4.9)", desc: "���� �Ұ��� ���׿� ģȯ�� ��Ȳ �������� ��°�� ���� �����̾� ������ �����", img: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779945603/A4_08297_2_kkxovy.jpg" },
                { name: "�������� �ó����򷯽�", type: "SPANISH CHURROS", rating: "�ڡڡڡڡ� (4.7)", desc: "�ֹ� ��� Ƣ��ų� ���� �ó��� ������ ����� ������ �ٻ��ϰ� �̱��� ����", img: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779759362/IMG_0015_6_3_au1ykg.jpg" }
              ].map((menu, idx) => (
                <div key={idx} className={`rounded-xl overflow-hidden ${innerCardBg} ${innerCardHover} border ${isPink ? "border-neutral-850" : "border-amber-200/40"} flex flex-col justify-between h-[380px]`}>
                  <div className="h-44 bg-neutral-950 overflow-hidden relative">
                    <img src={menu.img} alt={menu.name} className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="p-4 space-y-2 text-left flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center">
                        <span className={`text-[9px] font-black ${isPink ? "text-rose-450" : "text-amber-600"} block font-mono`}>{menu.type}</span>
                        <span className="text-[9px] font-black text-[#ffd500] font-mono">{menu.rating}</span>
                      </div>
                      <h4 className={`text-xs sm:text-sm font-black ${textTitle} mt-1`}>{menu.name}</h4>
                      <p className={`text-[11px] ${textDesc} leading-relaxed font-semibold mt-1.5`}>
                        {menu.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center border-t border-neutral-200/20 pt-6 mt-8 text-[11px] sm:text-xs font-bold text-slate-500">
            <span>* ���� �ñ״�ó 4�� �޴� ���� �ȳ�</span>
            <span>Slide 09 / 16</span>
          </div>
        </section>

        {/* SECTION 10. ���� �ùķ��̼� */}
        <section className={`rounded-3xl p-6 sm:p-12 ${cardBg} relative`}>
          <div className="flex items-center justify-between border-b border-neutral-200/20 pb-4 mb-8">
            <span className="text-xs font-black tracking-widest text-[#ffd500]">10 / PROFIT SIMULATION</span>
            <span className="text-xs font-black text-slate-400">FINANCIAL ROI INSIGHTS</span>
          </div>

          <div className="space-y-10">
            <div className="text-center md:text-left space-y-3">
              <h2 className="text-2xl sm:text-3xl font-black">
                ü������ <span className={textHighlight}>������ ���� �ùķ��̼�</span>
              </h2>
              <p className={`text-sm sm:text-base leading-relaxed ${textDesc}`}>
                ���� �������� ���� ���� �������� ���� �ʱ� ��� ȸ���� �����մϴ�. (�� ���� 3,000�� �� ����)
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch text-left">
              <div className={`lg:col-span-8 p-6 rounded-2xl border ${isPink ? "border-neutral-850" : "border-amber-200/40"} overflow-x-auto ${innerCardBg} ${innerCardHover}`}>
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className={`border-b ${isPink ? "border-neutral-805" : "border-amber-200/40"} ${isPink ? "text-rose-455" : "text-amber-600"}`}>
                      <th className="py-3 px-4 font-black">����</th>
                      <th className="py-3 px-4 font-black text-right">�ݾ�</th>
                      <th className="py-3 px-4 font-black text-right">����</th>
                      <th className="py-3 px-4 font-black">���</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { cat: "�� �����", price: "3,000�� ��", ratio: "100%", desc: "��� ������ �� �Ǹ� ���� ���� ����" },
                      { cat: "�������", price: "1,050�� ��", ratio: "35%", desc: "���� ����ǰ ���� �� ������ ���� �ܰ�" },
                      { cat: "������", price: "250�� ��", ratio: "8.3%", desc: "10���� ���� ��� ����" },
                      { cat: "�ΰǺ�", price: "180�� ��", ratio: "6.0%", desc: "���� 1�� + ��ƮŸ�� 1�� �" },
                      { cat: "������ �� ������", price: "120�� ��", ratio: "4.0%", desc: "����, ������ �� ��޾� ������ ��" }
                    ].map((row, idx) => (
                      <tr key={idx} className={`border-b ${isPink ? "border-neutral-805/50" : "border-amber-200/20"} ${textTitle} font-bold`}>
                        <td className="py-3 px-4 font-black">{row.cat}</td>
                        <td className="py-3 px-4 text-right">{row.price}</td>
                        <td className="py-3 px-4 text-right font-mono">{row.ratio}</td>
                        <td className={`py-3 px-4 text-[10px] ${textDesc}`}>{row.desc}</td>
                      </tr>
                    ))}
                    <tr className={`${isPink ? "bg-rose-500/10 text-rose-500" : "bg-amber-400/10 text-amber-600"} font-black`}>
                      <td className="py-4 px-4 rounded-l-xl">�� ������</td>
                      <td className="py-4 px-4 text-right">1,400�� ��</td>
                      <td className="py-4 px-4 text-right font-mono">46.7%</td>
                      <td className="py-4 px-4 rounded-r-xl text-[10px]">�ο�Ƽ 0% ���� �� ���� ���� ����</td>
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
                    <span className="text-[10px] font-bold text-white/95">Ŀ�� �Ǹ� ������ �ش�ȭ�ϴ� �ƶ��ī ���� �� ���� ���־�</span>
                  </div>
                </div>

                <div className={`p-5 rounded-2xl border ${isPink ? "border-rose-500/20 bg-rose-500/5 text-rose-455" : "border-amber-400/20 bg-amber-400/5 text-amber-600"} flex flex-col items-center justify-center text-center space-y-1.5`}>
                  <TrendingUp size={24} />
                  <span className="text-xs font-black">����Ʈ ���� �ְ� ���� ������</span>
                  <span className="text-base font-extrabold">�� ������ �� 1,400�� �� (46.7%)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center border-t border-neutral-200/20 pt-6 mt-8 text-[11px] sm:text-xs font-bold text-slate-500">
            <span>* ��� �ݾ��� ���� ���� �� ������ � ��Ŀ� ���� �ٸ� �� �ֽ��ϴ�.</span>
            <span>Slide 10 / 16</span>
          </div>
        </section>

        {/* SECTION 11. â���� A */}
        <section className={`rounded-3xl p-6 sm:p-12 ${cardBg} relative`}>
          <div className="flex items-center justify-between border-b border-neutral-200/20 pb-4 mb-8">
            <span className="text-xs font-black tracking-widest text-[#ffd500]">11 / FRANCHISE MODEL A</span>
            <span className="text-xs font-black text-slate-400">SHOP-IN-SHOP / DELIVERY</span>
          </div>

          <div className="my-auto py-2 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-5 space-y-4 text-left flex flex-col justify-between">
              <div>
                <span className={`text-xs font-black px-2.5 py-1 ${isPink ? "bg-rose-500/10 text-rose-455 border-rose-500/20" : "bg-amber-400/10 text-amber-600 border-amber-400/20"} border rounded-full`}>
                  �� A: ���μ� / ��� ������
                </span>
                <h2 className={`text-xl sm:text-2xl md:text-3xl font-black leading-tight ${textTitle} mt-3`}>
                  ���� ���� �״��,<br />
                  <span className={textHighlight}>440�� ��</span> ���ں� ��� ����
                </h2>
                <p className={`text-xs sm:text-sm leading-relaxed ${textDesc} mt-2`}>
                  ���� ī��, �ֵ���, �������� ���忡 ��� ���ð� ���ι� ��ü������ ����Ʈ �ǸŸ� �����ϴ� �ʰ��� ���̺긮�� ���� ���α׷��Դϴ�.
                </p>
              </div>
              
              <div className={`grid grid-cols-2 gap-3 text-xs font-bold ${textDesc}`}>
                {[
                  "���ͺ�/������ �İ� ȯ��",
                  "�ֹ� ���� ���� ���ʿ�",
                  "�ʵ� ���� 200�� ����",
                  "��� �÷��� ��� ����"
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
                  <span className="text-[10px] font-bold text-white/95">ī���� ���μ� ���� ���־� ������</span>
                </div>
              </div>
            </div>

            <div className={`lg:col-span-4 p-6 rounded-2xl text-left flex flex-col justify-between ${innerCardBgAccent} ${innerCardHover}`}>
              <span className={`text-[10px] font-black ${textDesc} uppercase tracking-wider block`}>MODEL A DETAILS</span>
              <div className={`space-y-3 border-b ${isPink ? "border-neutral-805" : "border-amber-200/35"} pb-4 my-3`}>
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className={textDesc}>���ͺ� (�ѽ� ����)</span>
                  <span className={`${textTitle} font-extrabold line-through`}>100�� ��</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className={textDesc}>��� ���� ���</span>
                  <span className={`${isPink ? "text-rose-455" : "text-amber-600"} font-extrabold text-sm`}>290�� ��</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className={textDesc}>�ʵ� ���� ����</span>
                  <span className={`${textTitle} font-extrabold`}>150�� ��</span>
                </div>
              </div>
              <div className="flex justify-between items-center font-black">
                <span className={`text-xs ${textTitle}`}>���� ���� �ݾ�</span>
                <span className={`text-base ${isPink ? "text-rose-500" : "text-amber-500"}`}>440�� ��</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center border-t border-neutral-200/20 pt-6 mt-8 text-[11px] sm:text-xs font-bold text-slate-500">
            <span>* 120pie & coffee ���μ� Ưȭ ��Ű�� ���̵� ����</span>
            <span>Slide 11 / 16</span>
          </div>
        </section>

        {/* SECTION 12. â���� B */}
        <section className={`rounded-3xl p-6 sm:p-12 ${cardBg} relative`}>
          <div className="flex items-center justify-between border-b border-neutral-200/20 pb-4 mb-8">
            <span className="text-xs font-black tracking-widest text-[#ffd500]">12 / FRANCHISE MODEL B</span>
            <span className="text-xs font-black text-slate-400">COMPACT TAKE-OUT CAFE</span>
          </div>

          <div className="my-auto py-2 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-5 space-y-4 text-left flex flex-col justify-between">
              <div>
                <span className={`text-xs font-black px-2.5 py-1 ${isPink ? "bg-rose-500/10 text-rose-455 border-rose-500/20" : "bg-amber-400/10 text-amber-600 border-amber-400/20"} border rounded-full`}>
                  �� B: 8~10�� ����Ʈ ����
                </span>
                <h2 className={`text-xl sm:text-2xl md:text-3xl font-black leading-tight ${textTitle} mt-3`}>
                  ����� Ȧ�� Ȳ�� ����,<br />
                  <span className={textHighlight}>1�� � ����ȭ</span> �Ǽ��� ī��
                </h2>
                <p className={`text-xs sm:text-sm leading-relaxed ${textDesc} mt-2`}>
                  8��~10���� ����Ʈ�� ���忡�� ����??? ���, ���̺� ������ �ش�ȭ�ϴ� ���� ���� ���α׷��Դϴ�.
                </p>
              </div>
              
              <div className={`grid grid-cols-2 gap-3 text-xs font-bold ${textDesc}`}>
                {[
                  "1�� � ���� ���� ��ġ",
                  "�ʼ��� �ֹ� Ưȭ ���̾ƿ�",
                  "�ƿ����� �ֹ� â�� ����",
                  "���� ���׸��� ���� ����"
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
                  <span className="text-[10px] font-bold text-white/95">����ũ�ƿ� �� ���� ���� �ڽ�</span>
                </div>
              </div>
            </div>

            <div className={`lg:col-span-4 p-6 rounded-2xl text-left flex flex-col justify-between ${innerCardBgAccent} ${innerCardHover}`}>
              <span className={`text-[10px] font-black ${textDesc} uppercase tracking-wider block`}>MODEL B BUDGET</span>
              <div className={`space-y-3 border-b ${isPink ? "border-neutral-805" : "border-amber-200/35"} pb-4 my-3`}>
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className={textDesc}>���� ����</span>
                  <span className={`${textTitle} font-extrabold`}>200�� ��</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className={textDesc}>���׸��� (10�� ����)</span>
                  <span className={`${textTitle} font-extrabold`}>1,500�� ��</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className={textDesc}>���� �� ��� ����</span>
                  <span className={`${textTitle} font-extrabold`}>800�� ��</span>
                </div>
              </div>
              <div className="flex justify-between items-center font-black">
                <span className={`text-xs ${textTitle}`}>���� â�� ���</span>
                <span className={`text-base ${isPink ? "text-rose-500" : "text-amber-500"}`}>2,500�� �� ��</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center border-t border-neutral-200/20 pt-6 mt-8 text-[11px] sm:text-xs font-bold text-slate-500">
            <span>* ���� �����Ḧ ������ ǥ�� â�� ���� ��� ����</span>
            <span>Slide 12 / 16</span>
          </div>
        </section>

        {/* SECTION 13. â���� C */}
        <section className={`rounded-3xl p-6 sm:p-12 ${cardBg} relative`}>
          <div className="flex items-center justify-between border-b border-neutral-200/20 pb-4 mb-8">
            <span className="text-xs font-black tracking-widest text-[#ffd500]">13 / FRANCHISE MODEL C</span>
            <span className="text-xs font-black text-slate-400">PREMIUM CAFE & BRUNCH</span>
          </div>

          <div className="my-auto py-2 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-5 space-y-4 text-left flex flex-col justify-between">
              <div>
                <span className={`text-xs font-black px-2.5 py-1 ${isPink ? "bg-rose-500/10 text-rose-455 border-rose-500/20" : "bg-amber-400/10 text-amber-600 border-amber-400/20"} border rounded-full`}>
                  �� C: 15�� �̻� �����̾� ī��
                </span>
                <h2 className={`text-xl sm:text-2xl md:text-3xl font-black leading-tight ${textTitle} mt-3`}>
                  �귱ġ ���ξ� ��ȭ,<br />
                  <span className={textHighlight}>���� ü�� �ð�</span>�� �ø��� �����̾���
                </h2>
                <p className={`text-xs sm:text-sm leading-relaxed ${textDesc} mt-2`}>
                  ���� Ȧ ���̺��� ���� ����Ʈ�Ӹ� �ƴ϶� ����, �귱ġ ������ ���� ������ �̲��� ������ �÷��׽� �����Դϴ�.
                </p>
              </div>
              
              <div className={`grid grid-cols-2 gap-3 text-xs font-bold ${textDesc}`}>
                {[
                  "�ܵ� ���̺� Ȧ �¼� Ȯ��",
                  "�÷����� ����Ʈ ��Ʈ ����",
                  "��ü ���̳� �� �ֺ� ���� ��ġ",
                  "���� ���帶ũȭ ������"
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
                  <span className="text-[10px] font-bold text-white/95">�����̾� ���õ� �ֹ� �� Ȧ ����</span>
                </div>
              </div>
            </div>

            <div className={`lg:col-span-4 p-6 rounded-2xl text-left flex flex-col justify-between ${innerCardBgAccent} ${innerCardHover}`}>
              <span className={`text-[10px] font-black ${textDesc} uppercase tracking-wider block`}>MODEL C BUDGET</span>
              <div className={`space-y-3 border-b ${isPink ? "border-neutral-805" : "border-amber-200/35"} pb-4 my-3`}>
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className={textDesc}>���� ��� �� ����</span>
                  <span className={`${textTitle} font-extrabold`}>300�� ��</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className={textDesc}>���׸��� (15�� ����)</span>
                  <span className={`${textTitle} font-extrabold`}>2,200�� ��</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className={textDesc}>��� ���� �� ����</span>
                  <span className={`${textTitle} font-extrabold`}>1,100�� ��</span>
                </div>
              </div>
              <div className="flex justify-between items-center font-black">
                <span className={`text-xs ${textTitle}`}>���� â�� ���</span>
                <span className={`text-base ${isPink ? "text-rose-500" : "text-amber-500"}`}>3,600�� �� ��</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center border-t border-neutral-200/20 pt-6 mt-8 text-[11px] sm:text-xs font-bold text-slate-500">
            <span>* 15���� ǥ�� �÷��׽� ���� ���� ���� ���̵� ����</span>
            <span>Slide 13 / 16</span>
          </div>
        </section>

        {/* SECTION 14. â������ */}
        <section className={`rounded-3xl p-6 sm:p-12 ${cardBg} relative`}>
          <div className="flex items-center justify-between border-b border-neutral-200/20 pb-4 mb-8">
            <span className="text-xs font-black tracking-widest text-[#ffd500]">14 / FRANCHISE PROCESS</span>
            <span className="text-xs font-black text-slate-400">7-STEP LAUNCH ROADMAP</span>
          </div>

          <div className="space-y-10">
            <div className="text-center md:text-left space-y-3">
              <h2 className="text-2xl sm:text-3xl font-black">
                ü������ <span className={textHighlight}>7�ܰ� ���� ���μ���</span>
              </h2>
              <p className={`text-sm sm:text-base leading-relaxed ${textDesc}`}>
                ��� ��û���� ���� �׷��� ���±��� ���� ���� �������� �����Ͽ� �ɾ��մϴ�.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
              <div className="lg:col-span-8 relative">
                {/* Connecting Line */}
                <div className={`absolute left-6 top-4 bottom-4 w-0.5 ${isPink ? "bg-neutral-805" : "bg-amber-200/50"} z-0`}></div>
                <div className="space-y-4 relative z-10">
                  {[
                    { step: "01", name: "��� ��û", desc: "���� ���� �� ��� ����", icon: <Info size={12} className={isPink ? "text-rose-500" : "text-amber-500"} /> },
                    { step: "02", name: "��� �м�", desc: "��� �� Ÿ�� �м�", icon: <Search size={12} className={isPink ? "text-rose-500" : "text-amber-500"} /> },
                    { step: "03", name: "���� ���", desc: "���� ���� �� ü��", icon: <FileText size={12} className={isPink ? "text-rose-500" : "text-amber-500"} /> },
                    { step: "04", name: "���� ����", desc: "1�� ���� ��ġ�� Ȯ��", icon: <Building2 size={12} className={isPink ? "text-rose-500" : "text-amber-500"} /> },
                    { step: "05", name: "��� ����", desc: "1:1 ������/���� ������", icon: <ChefHat size={12} className={isPink ? "text-rose-500" : "text-amber-500"} /> },
                    { step: "06", name: "���� ���㼳", desc: "���� ���� �׽�Ʈ", icon: <Sliders size={12} className={isPink ? "text-rose-500" : "text-amber-500"} /> },
                    { step: "07", name: "�׷��� ����", desc: "���� Ȱ��ȭ ������", icon: <Sparkles size={12} className={isPink ? "text-rose-500" : "text-amber-500"} /> }
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
                    <span className="text-xs font-bold text-white/95">���� �غ� ���� ���� ��Ű¡ �� POP ��Ʈ</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center border-t border-neutral-200/20 pt-6 mt-8 text-[11px] sm:text-xs font-bold text-slate-500">
            <span>* ������ ��� ���� �ҿ� �Ⱓ: ���μ� 7��, �ű�â�� 21��</span>
            <span>Slide 14 / 16</span>
          </div>
        </section>

        {/* SECTION 15. ���� ���� (WHY PARTNER WITH US) */}
        <section className={`rounded-3xl p-6 sm:p-12 ${cardBg} relative`}>
          <div className="flex items-center justify-between border-b border-neutral-200/20 pb-4 mb-8">
            <span className="text-xs font-black tracking-widest text-[#ffd500]">15 / FRANCHISE VALUE</span>
            <span className="text-xs font-black text-slate-400">PARTNER BENEFITS SUMMARY</span>
          </div>

          <div className="space-y-10">
            <div className="text-center md:text-left space-y-3">
              <h2 className="text-2xl sm:text-3xl font-black">
                ���ִԵ��� 120pie�� <span className={textHighlight}>������ �������� ����</span>
              </h2>
              <p className={`text-sm sm:text-base leading-relaxed ${textDesc}`}>
                ���� ���ͺ��� �������ִ��� ������ �ֿ켱���� �����ϴ� �귣�� ��å�Դϴ�.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
              <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { title: "�ο�Ƽ 0% ����", desc: "�ſ� �߻��ϴ� ���� ��� ���ͱ��̳� ���� �д�� ���� û�� ����", icon: <Percent size={16} /> },
                  { title: "���ͺ� ���� ȯ�� ���α׷�", desc: "���� ���� ��ȭ �Ǵ� ���� ���� �޼� �� ������ó�� ȯ��", icon: <Award size={16} /> },
                  { title: "100% ����ǰ ���� ����", desc: "����, ��� ���� ���� ����� �ϳ��� ���� ����Ŀ�� ����Ƽ ����", icon: <ChefHat size={16} /> },
                  { title: "������ ���� �޴� ȣȯ", desc: "���� �ӽ� �ܿ� ����� �ӽ� ���� �뿩�� �ܿ�ö �߰� ���� Ȯ��", icon: <Sparkles size={16} /> }
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
                    <span className="text-xs font-bold text-white/95">���� ���� ��� ����ȭ: ģȯ�� �������� ���� ���</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center border-t border-neutral-200/20 pt-6 mt-8 text-[11px] sm:text-xs font-bold text-slate-500">
            <span>* ���� �����ŷ�����ȸ ǥ�� ��� �� ���� ��� ���� �ؼ�</span>
            <span>Slide 15 / 16</span>
          </div>
        </section>

        {/* SECTION 16. �޸� (Back Cover) */}
        <section className={`rounded-3xl p-6 sm:p-12 md:p-16 ${cardBg} flex flex-col justify-between min-h-[460px] relative overflow-hidden text-center`}>
          <div className="absolute inset-0 bg-gradient-to-tr from-amber-400/5 to-transparent pointer-events-none"></div>

          <div className="flex items-center justify-between border-b border-neutral-200/20 pb-6 mb-6">
            <span className="text-xs font-black tracking-widest text-slate-500">16 / BACK COVER</span>
            <span className={`text-xs font-bold ${isPink ? "text-rose-500" : "text-amber-600"} font-mono`}>120PIE & COFFEE</span>
          </div>

          <div className="my-auto py-10 space-y-6 max-w-2xl mx-auto">
            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-black leading-tight ${textTitle}`}>
              �������� â���� ����,<br />
              <span className={textHighlight}>120pie & coffee</span>�� �Բ��մϴ�.
            </h2>
            <p className={`text-xs sm:text-sm md:text-base leading-relaxed ${textDesc}`}>
              ���� �������ִ��� ���� ������ ���� �����Ͽ� ���� ������� �ִ� ȿ���� �̾Ƴ��� ���̵带 ��ӵ帳�ϴ�. ���� �ϴ� ��� ��û ���� ����ó�� �����ּ���.
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-4">
              <button 
                type="button"
                onClick={handlePrintPage}
                className={`inline-flex items-center justify-center px-5 py-3 rounded-xl border font-extrabold text-sm cursor-pointer transition-all shadow-md ${isPink ? "bg-neutral-900 border-neutral-800 text-white hover:bg-neutral-800" : "bg-white border-amber-250/70 text-slate-700 hover:bg-amber-50/50"}`}
              >
                <FileText size={16} className={`mr-2 ${isPink ? "text-rose-500" : "text-amber-500"}`} /> ���� ���ȼ� PDF�� �μ�/����
              </button>
              <a 
                href="#inquiry-form-section"
                className={`inline-flex items-center justify-center px-6 py-3 rounded-xl font-extrabold text-sm transition-all shadow-md ${isPink ? "bg-rose-500 text-white hover:bg-rose-600 shadow-rose-500/10" : "bg-amber-400 text-neutral-900 hover:bg-amber-300 shadow-amber-400/10"}`}
              >
                ���� ��� ��û�� �ۼ��ϱ�
              </a>
            </div>
          </div>

          <div className="flex justify-between items-center border-t border-neutral-200/20 pt-6 mt-6 text-[11px] sm:text-xs font-bold text-slate-500">
            <span>? 2026 120pie & coffee Corp. All rights reserved.</span>
            <span>Slide 16 / 16</span>
          </div>
        </section>

        {/* BOTTOM INQUIRY FORM SECTION */}
        <section id="inquiry-form-section" className={`rounded-3xl p-6 sm:p-12 ${cardBg} border-2 ${isPink ? "border-rose-500/40" : "border-amber-400/40"} relative`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-400/10 to-transparent pointer-events-none rounded-tr-3xl"></div>
          
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center space-y-3">
              <span className={`text-[10px] font-black tracking-widest ${isPink ? "text-rose-500" : "text-amber-500"} uppercase block font-mono`}>B2B CONSULTATION</span>
              <h2 className={`text-2xl sm:text-3xl font-black ${textTitle}`}>�ǽð� ���� & ���μ� ���� ����</h2>
              <p className={`text-xs sm:text-sm leading-relaxed ${textDesc}`}>
                ��� ����� �Է��Ͻø�, �ֺ� ����� �м� �� 3D ���� ��ġ���� ���Ե� ���� ��� ����Ʈ�� ���� ������ �帳�ϴ�.
              </p>
            </div>

            {formSubmitted ? (
              <div className={`text-center p-8 ${innerCardBg} border ${isPink ? "border-neutral-805" : "border-amber-200/40"} rounded-2xl space-y-4`}>
                <div className="inline-flex w-12 h-12 bg-emerald-500/10 border border-emerald-500 text-emerald-500 rounded-full items-center justify-center">
                  <CheckCircle2 size={24} />
                </div>
                <div className="space-y-1">
                  <h4 className={`text-lg font-black ${textTitle}`}>���� �� ��� ���ǰ� �� �����Ǿ����ϴ�.</h4>
                  <p className={`text-xs sm:text-sm ${textDesc} font-semibold leading-relaxed`}>
                    �ۼ��� �ֽ� ����ó�� ��� ����Ʈ ���� �� ���� ��� ������ 24�ð� �� ���� ������ �帮�ڽ��ϴ�.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFormSubmitted(false);
                    setFormData({ name: "", phone: "", storeType: "���μ� ����", existingStoreName: "", message: "" });
                  }}
                  className={`text-xs sm:text-sm ${isPink ? "text-rose-500" : "text-amber-500"} font-bold hover:underline cursor-pointer bg-transparent border-0`}
                >
                  [ �߰� ��� ���� �ۼ��ϱ� ]
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2 text-left">
                    <label className={`text-xs font-extrabold ${textDesc} block`}>���� / �����</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="������ �Է��ϼ���"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className={`w-full ${inputBgClass} border rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none transition-colors`}
                    />
                  </div>
                  <div className="space-y-2 text-left">
                    <label className={`text-xs font-extrabold ${textDesc} block`}>����ó</label>
                    <input
                      type="tel"
                      name="phone"
                      maxLength={13}
                      placeholder="����ó�� �Է��ϼ���"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className={`w-full ${inputBgClass} border rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none transition-colors`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2 text-left">
                    <label className={`text-xs font-extrabold ${textDesc} block`}>â�� ���� ����</label>
                    <select
                      name="storeType"
                      value={formData.storeType}
                      onChange={handleInputChange}
                      className={`w-full ${inputBgClass} border rounded-xl px-3.5 py-3 text-xs sm:text-sm focus:outline-none transition-colors cursor-pointer font-bold`}
                    >
                      <option value="���μ� ����">���� ���� ���μ� ����</option>
                      <option value="�ű� ���ں� â��">���ں� ī�� �ű� â��</option>
                      <option value="�����̾� ����">�����̾� �귱ġ ���� â��</option>
                      <option value="���� ���� ����">Ÿ ���� ���� ����</option>
                    </select>
                  </div>
                  <div className="space-y-2 text-left">
                    <label className={`text-xs font-extrabold ${textDesc} block`}>���� ����� (����)</label>
                    <input
                      type="text"
                      name="existingStoreName"
                      placeholder="��: 120ī�� ������"
                      value={formData.existingStoreName}
                      onChange={handleInputChange}
                      className={`w-full ${inputBgClass} border rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none transition-colors`}
                    />
                  </div>
                </div>

                <div className="space-y-2 text-left">
                  <label className={`text-xs font-extrabold ${textDesc} block`}>��� ���� �� (����)</label>
                  <textarea
                    name="message"
                    rows={4}
                    placeholder="������ ����� ���� �ð���, ���� ���� �� �ñ��Ͻ� ������ ���ϰ� ����� �ּ���."
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
                    ��� �ȳ��� ���� ���ͺ����� �������� ���� �� ��� ������ �����մϴ�. (�ʼ�)
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full font-black text-sm sm:text-base py-4 rounded-xl hover:scale-[1.01] active:scale-[0.99] transition-all shadow-md border-0 cursor-pointer ${isPink ? "bg-rose-500 text-white hover:bg-rose-600 shadow-rose-500/15" : "bg-amber-400 text-neutral-900 hover:bg-amber-300 shadow-amber-400/15"}`}
                >
                  {isSubmitting ? "���� ��� ó�� ��..." : "VIP ���� â�� ��� ���� �Ϸ�"}
                </button>
              </form>
            )}
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-neutral-200/20 text-center text-xs font-semibold text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-4">
          <p>�����̰������غ� | ��ǥ�̻�: ȫ�浿 | ����Ư���� ������ ����� 120, 5��</p>
          <p>���͹���: 1566-0000 | �̸���: support@120pie.com | ����ڵ�Ϲ�ȣ: 000-00-00000</p>
          <p className="text-[10px] text-slate-650">? 2026 120pie & coffee Corp. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
