"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Menu, X, ChevronDown, HelpCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FloatingAndInquiry from "@/app/components/FloatingAndInquiry";
import Footer from "@/app/components/Footer";

const logoUrlBlack = "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784076160/120%ED%8C%8C%EC%9D%B4_%EC%BB%A4%ED%94%BC_%EA%B8%88%EC%A0%95%EC%A0%90_%EC%B1%84%EB%84%90%EC%82%AC%EC%9D%B8_%EB%94%94%EC%9E%90%EC%9D%B8_250828_ovgxnz.png";

export default function FaqPageClient() {
  const [theme, setTheme] = useState<"pink" | "yellow">("yellow");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [inquiryForcedOpen, setInquiryForcedOpen] = useState(false);
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  // Initialize theme from URL params
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
      } catch (err) {
        console.error("Failed to initialize theme parameter", err);
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

  const isPink = theme === "pink";
  const isYellow = theme === "yellow";
  const logoUrl = isPink ? logoUrlBlack : "/logo_yellow_blue.png";
  const backUrl = isPink ? "/v3" : "/";

  // Theme Classes Map
  const pageBg = isPink ? "bg-[#0a0a0a] text-neutral-200" : "bg-[#fffdf4] text-[#0d233a]";
  const headerBg = isPink ? "bg-neutral-950/80 border-b border-neutral-900" : "bg-[#fffdf4]/80 border-b border-[#e6dfc3]";
  const mobileNavDrawerBg = isPink ? "bg-neutral-950 border-t border-neutral-900" : "bg-[#fffdf4] border-t border-[#e6dfc3]";
  const mobileNavLinkClass = isPink ? "bg-[#181114] border border-[#f2ccd7]/10 text-neutral-400 hover:text-white" : "bg-white border border-[#e6dfc3]/60 text-[#576575] hover:text-[#0d233a]";

  const faqs = [
    { q: "지금 운영 중인 카페에도 도입할 수 있나요?", a: "네. 기존 매장을 크게 바꾸지 않고, 파이 메뉴를 준비하고 판매할 수 있는 작은 공간과 운영 환경을 확인한 뒤 시작할 수 있습니다. 매장 구조에 맞는 도입 방식은 상담을 통해 함께 정리해드립니다." },
    { q: "파이 조리가 어렵지는 않나요?", a: "복잡한 반죽이나 제빵 과정은 필요하지 않습니다. 준비된 생지를 보관해두었다가 주문이 들어오면 정해진 방식으로 구워, 커피와 함께 바로 제공할 수 있습니다." },
    { q: "간판이나 인테리어를 바꿔야 하나요?", a: "필수는 아닙니다. 기존 상호와 매장 분위기를 유지한 채 메뉴부터 시작할 수 있습니다. 외부 브랜드 표기나 매장 변화는 판매 반응을 확인한 뒤 필요에 따라 선택하시면 됩니다." },
    { q: "120파이만 먼저 판매해볼 수 있나요?", a: "가능합니다. 대표 메뉴인 파이부터 시작해 손님 반응을 살펴본 뒤, 에그120이나 츄러스, 핫도그, 핫바, 떡볶이 같은 메뉴를 매장에 맞게 추가할 수 있습니다." },
    { q: "도입 전에 어떤 준비가 필요한가요?", a: "판매 공간, 냉동 보관과 조리가 가능한 환경, 예상 판매 메뉴를 먼저 확인합니다. 상담 시 현재 매장 사진이나 운영 상황을 바탕으로 필요한 준비 사항을 안내해드립니다." },
    { q: "나중에 120pie 매장으로 확장할 수도 있나요?", a: "네. 메뉴 도입 후 고객 반응과 운영 결과를 충분히 확인한 다음, 브랜드 표기 추가나 매장 전환 여부를 선택할 수 있습니다. 처음부터 큰 변화를 결정하실 필요는 없습니다." }
  ];

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
            <Link href={`/menu?theme=${theme}`} className="hover:text-amber-400 transition-colors">메뉴</Link>
            <Link href={`/stores?theme=${theme}`} className="hover:text-amber-400 transition-colors">가맹점 현황</Link>
            <Link href={`/costs?theme=${theme}`} className="hover:text-amber-400 transition-colors">비용 안내</Link>
            <Link href={`/franchise?theme=${theme}`} className="hover:text-amber-400 transition-colors">창업 안내</Link>
            <Link href={`/faq?theme=${theme}`} className={`hover:scale-105 transition-transform shrink-0 ${isPink ? "text-rose-500 font-extrabold" : "text-amber-500 font-extrabold"}`}>FAQ</Link>
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
              <Link href={`/menu?theme=${theme}`} onClick={() => setMobileNavOpen(false)} className={`rounded-xl px-4 py-3 transition-colors ${mobileNavLinkClass}`}>
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
              <Link href={`/faq?theme=${theme}`} onClick={() => setMobileNavOpen(false)} className={`col-span-2 rounded-xl px-4 py-3 transition-colors text-center font-extrabold ${isPink ? "bg-rose-500 text-white" : "bg-amber-400 text-neutral-950"}`}>
                FAQ
              </Link>
            </div>
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main className="pb-24">
        {/* FAQ Header Section */}
        <section className={`py-16 sm:py-24 border-b transition-colors duration-300 ${
          isPink ? "bg-gradient-to-b from-[#0f0a0c] via-[#0b0708] to-[#0a0a0a] border-neutral-900" : "bg-gradient-to-b from-[#fffdf2] via-[#fffaf0] to-[#fffdf4] border-[#e6dfc3]/40"
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto"
            >
              <Link
                href={backUrl}
                className={`inline-flex items-center gap-1.5 text-xs font-bold mb-6 transition-colors ${
                  isPink ? "text-neutral-400 hover:text-white" : "text-[#576575] hover:text-[#0d233a]"
                }`}
              >
                <ArrowLeft size={14} /> 메인으로 돌아가기
              </Link>
              
              <div className="flex justify-center mb-4">
                <div className={`p-3 rounded-2xl border ${
                  isPink ? "bg-neutral-900 border-[#f2ccd7]/10" : "bg-white border-[#e6dfc3]"
                }`}>
                  <HelpCircle size={32} className={isPink ? "text-rose-500" : "text-[#0d233a]"} />
                </div>
              </div>

              <h1 className={`text-3xl sm:text-5xl font-black tracking-tight mb-6 ${
                isPink ? "text-white" : "text-[#0d233a]"
              }`}>
                자주 묻는 질문
              </h1>
              
              <p className={`text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-medium ${
                isPink ? "text-neutral-400" : "text-[#576575]"
              }`}>
                120겹 파이 & 에그120 디저트 샵인샵 도입 및 매장 운영에 관해 가장 자주 여쭤보시는 질문들에 대한 답변입니다.
              </p>
            </motion.div>
          </div>
        </section>

        {/* FAQ Accordion List */}
        <section className="py-16 sm:py-24">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className={`rounded-2xl overflow-hidden border transition-all ${
                    isPink 
                      ? "bg-neutral-900 border-neutral-850 hover:border-amber-400/35"
                      : "bg-white border-[#e6dfc3] hover:border-[#0d233a]"
                  }`}
                >
                  <button
                    onClick={() => setOpenFaqIdx(openFaqIdx === i ? null : i)}
                    className={`w-full px-6 sm:px-8 py-5 text-left font-extrabold flex justify-between items-center transition-colors border-0 cursor-pointer ${
                      isPink 
                        ? "text-white hover:bg-neutral-850 bg-transparent" 
                        : "text-[#0d233a] hover:bg-[#fffdf2] bg-transparent"
                    }`}
                  >
                    <span className="text-sm sm:text-base pr-4 leading-tight">{faq.q}</span>
                    <ChevronDown size={18} className={`transition-transform duration-300 shrink-0 ${
                      isPink ? "text-rose-500" : "text-[#0d233a]"
                    } ${openFaqIdx === i ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {openFaqIdx === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className={`px-6 sm:px-8 py-5 pt-0 text-xs sm:text-sm font-medium leading-relaxed border-t ${
                          isPink 
                            ? "text-neutral-400 border-neutral-850 bg-neutral-955/40"
                            : "text-[#576575] border-[#e6dfc3]/40 bg-[#fffdf2]/55"
                        }`}>
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer theme={isPink ? "black" : "yellow"} />

      {/* Floating & Inquiry modal */}
      <FloatingAndInquiry
        forceOpenModal={inquiryForcedOpen}
        onModalClose={() => setInquiryForcedOpen(false)}
        isPink={isPink}
      />
    </div>
  );
}
