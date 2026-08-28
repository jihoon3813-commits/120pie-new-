"use client";

import React, { useState, useEffect } from "react";
import { useMutation, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { triggerConsultationSms } from "@/app/utils/sms";
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  ArrowLeft, 
  CheckCircle2, 
  Info,
  Clock,
  Sun,
  Coffee,
  Moon,
  TrendingUp,
  TrendingDown,
  Camera,
  MapPin,
  Store,
  Leaf,
  ChefHat
} from "lucide-react";
import Link from "next/link";
import { Noto_Sans_KR } from "next/font/google";

const notoSansKr = Noto_Sans_KR({
  weight: ['400', '500', '700', '900'],
  subsets: ['latin'],
});

export default function ModernWebProposal() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    storeType: "기존 카페 샵인샵 도입",
    existingStoreName: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const addInquiryMutation = useMutation(api.inquiries.add);
  const sendSmsAction = useAction(api.aligo.sendEventSms);
  const totalSlides = 12;

  const formatPhoneNumber = (value: string) => {
    const raw = value.replace(/[^\d]/g, "");
    if (raw.length < 4) return raw;
    if (raw.length < 8) {
      return `${raw.slice(0, 3)}-${raw.slice(3)}`;
    }
    return `${raw.slice(0, 3)}-${raw.slice(3, 7)}-${raw.slice(7, 11)}`;
  };

  // Autoplay function
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
      }, 6500);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
        setIsPlaying(false);
      } else if (e.key === "ArrowLeft") {
        setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
        setIsPlaying(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
    setIsPlaying(false);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    setIsPlaying(false);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      alert("이름과 연락처를 입력해 주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      await addInquiryMutation({
        name: formData.name,
        phone: formData.phone,
        storeType: formData.storeType,
        existingStoreName: formData.existingStoreName || "없음",
        message: formData.message || "B2B 제안서 프리미엄 버전 페이지를 통한 상담 신청",
        regDate: new Date().toISOString().split("T")[0],
      });
      triggerConsultationSms(sendSmsAction, formData.name, formData.phone, formData.storeType);
      setSubmitSuccess(true);
    } catch (error) {
      console.error("Failed to submit inquiry:", error);
      alert("상담 신청 중 오류가 발생했습니다. 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const slideTitles = [
    "01. 성공 창업 제안 (Cover)",
    "02. 왜 120겹 파이인가? (Brand Story)",
    "03. 대시보드 매출 솔루션 (Solution)",
    "04. 상품 차별화 포인트 (Why 120pie)",
    "05. 다변화 메뉴 포트폴리오 (Menu Lineup)",
    "06. 샵인샵 도입 대상 설득 (Shop-in-Shop)",
    "07. 6WAY 매출 다각화 구조 (6Way Revenue)",
    "08. 안정된 물류 패키지 구성 (System Package)",
    "09. 소액 투자 하이브리드 가치 (Hybrid Creative)",
    "10. 창업 비용 및 수익 지표 (Investment & ROI)",
    "11. 개점 안착 밀착 지원 (System Support)",
    "12. 무료 상담 신청 (CTA)"
  ];

  // Helper Component: Laurel Wreath Ring
  const LaurelWreath = ({ children }: { children: React.ReactNode }) => (
    <div className="relative flex items-center justify-center w-16 h-16 shrink-0">
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full text-[#B39567]/60">
        {/* Left Laurel Branch */}
        <path 
          d="M 45,85 C 25,80 15,60 20,40 C 23,28 32,18 45,15" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5" 
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
          strokeWidth="2.5" 
          strokeLinecap="round"
        />
        {/* Right Leaves */}
        <path d="M 80,65 Q 88,62 83,55 Q 77,58 79,65 Z" fill="currentColor" />
        <path d="M 83,50 Q 92,46 86,40 Q 80,43 82,50 Z" fill="currentColor" />
        <path d="M 78,33 Q 85,25 77,21 Q 72,27 76,33 Z" fill="currentColor" />
        <path d="M 67,20 Q 72,10 64,8 Q 61,17 66,20 Z" fill="currentColor" />
      </svg>
      <div className="z-10 text-[#B39567]">
        {children}
      </div>
    </div>
  );

  // Helper Component: Wireframe Image Placeholder
  const WireframePlaceholder = ({ mainText, subText, aspectClass = "aspect-[16/10]" }: { mainText: string, subText: string, aspectClass?: string }) => (
    <div className={`relative border border-[#B39567]/25 bg-[#EAEAEA]/40 rounded-[4px] overflow-hidden flex flex-col items-center justify-center p-4 text-center ${aspectClass} shadow-inner`}>
      {/* Crossed Dotted Lines */}
      <svg className="absolute inset-0 w-full h-full text-slate-300 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <line x1="0" y1="0" x2="100%" y2="100%" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="100%" y1="0" x2="0" y2="100%" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
      </svg>
      
      {/* Camera Icon */}
      <div className="w-10 h-10 rounded-full bg-white/80 border border-[#B39567]/30 flex items-center justify-center mb-2 z-10 shadow-sm text-slate-500">
        <Camera size={18} />
      </div>
      
      <div className="z-10 space-y-1">
        <span className="block text-[11px] font-semibold text-slate-400 font-outfit uppercase tracking-wider">{mainText}</span>
        <div className="w-4 h-px bg-slate-300 mx-auto"></div>
        <p className="text-[12px] font-bold text-slate-500 leading-snug">{subText}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFFDF9] via-[#FAF3E0] to-[#F0E4C5] text-[#2C2520] flex flex-col font-sans select-none antialiased overflow-x-hidden relative">
      {/* Import Google Font Outfit and dynamic styling */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Nanum+Myeongjo:wght@400;700;800&family=Hahmlet:wght@300;400;600;700;900&display=swap');
        .font-outfit {
          font-family: 'Outfit', sans-serif;
        }
        .font-serif-kr {
          font-family: 'Hahmlet', 'Nanum Myeongjo', serif;
        }
        .premium-shadow {
          box-shadow: 0 10px 40px -10px rgba(44, 37, 32, 0.04), 0 1px 3px rgba(44, 37, 32, 0.02);
        }
      `}} />

      {/* Top Header */}
      <header className="w-full max-w-[1560px] mx-auto px-6 py-5 flex items-center justify-between z-10 border-b border-[#B39567]/30 shrink-0">
        <div className="flex items-center gap-4">
          <Link 
            href="/"
            className="flex items-center gap-2 text-sm font-semibold border border-[#B39567]/40 bg-white hover:bg-[#2C2520] hover:text-white px-4 py-2 rounded-[4px] transition-all duration-300 shadow-sm"
          >
            <ArrowLeft size={16} />
            <span>홈으로 가기</span>
          </Link>
          <div className="h-5 w-px bg-[#B39567]/30 hidden sm:block"></div>
          <span className="text-sm font-bold tracking-wider text-[#2C2520] uppercase hidden sm:block font-outfit">
            120PIE & COFFEE PROPOSAL
          </span>
        </div>

        {/* Slide Selector & Play controls */}
        <div className="flex items-center gap-3">
          <select
            value={currentSlide}
            onChange={(e) => {
              setCurrentSlide(Number(e.target.value));
              setIsPlaying(false);
            }}
            className="bg-white border border-[#B39567]/40 text-sm font-bold px-3 py-2 rounded-[4px] focus:outline-none cursor-pointer text-[#2C2520] shadow-sm hover:border-[#B39567]/85 transition-colors"
          >
            {slideTitles.map((title, idx) => (
              <option key={idx} value={idx}>
                {title}
              </option>
            ))}
          </select>

          <div className="flex items-center border border-[#B39567]/40 bg-white rounded-[4px] p-0.5 shadow-sm">
            <button 
              onClick={handlePrev} 
              className="p-1.5 hover:bg-[#F4EFE6] rounded-[2px] transition-colors text-[#2C2520]"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-xs font-bold px-3 text-[#2C2520] tabular-nums font-outfit">
              {String(currentSlide + 1).padStart(2, "0")} / {String(totalSlides).padStart(2, "0")}
            </span>
            <button 
              onClick={handleNext} 
              className="p-1.5 hover:bg-[#F4EFE6] rounded-[2px] transition-colors text-[#2C2520]"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`p-2 border border-[#B39567]/40 rounded-[4px] transition-all flex items-center justify-center shadow-sm ${
              isPlaying 
                ? "bg-[#B39567] text-white" 
                : "bg-white text-[#2C2520] hover:bg-[#F4EFE6]"
            }`}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>
        </div>
      </header>

      {/* Main Slide Deck Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8 z-10 max-w-[1600px] mx-auto w-full">
        <div className="w-full aspect-auto md:aspect-[16/9] bg-white/70 backdrop-blur-md border border-[#B39567]/25 rounded-[8px] shadow-[0_20px_50px_rgba(44, 37, 32, 0.06)] overflow-hidden relative flex flex-col justify-between transition-all duration-300">
          
          {/* 1PAGE. 표지 (Cover) - Styled according to the attached draft image */}
          {currentSlide === 0 && (
            <div className="absolute inset-0 p-8 sm:p-12 md:p-14 lg:p-16 flex flex-col justify-between bg-gradient-to-br from-[#FFFDF9] via-[#FDF5E2] to-[#FAF0CE] animate-fadeIn">
              
              {/* Top Ornaments & Small Title */}
              <div className="flex flex-col items-center text-center space-y-2 shrink-0">
                {/* Laurel sprig icon with two horizontal lines */}
                <div className="flex items-center gap-4 w-full justify-center">
                  <div className="w-20 lg:w-28 h-px bg-[#B39567]/40"></div>
                  <svg viewBox="0 0 100 100" className="w-6 h-6 text-[#B39567]">
                    <path d="M 50,90 C 38,85 30,70 32,55 C 33,48 38,42 45,40 C 42,32 46,24 50,15 C 54,24 58,32 55,40 C 62,42 67,48 68,55 C 70,70 62,85 50,90 Z" fill="none" stroke="currentColor" strokeWidth="2" />
                    <path d="M 50,15 C 47,25 43,30 50,40 C 57,30 53,25 50,15 Z" fill="currentColor" />
                    <path d="M 32,55 C 28,45 22,48 38,48" fill="none" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M 68,55 C 72,45 78,48 62,48" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                  <div className="w-20 lg:w-28 h-px bg-[#B39567]/40"></div>
                </div>
                <span className="text-xs sm:text-sm font-semibold text-[#B39567] tracking-[0.2em] font-serif-kr">
                  디저트 카페의 새로운 패러다임
                </span>
              </div>

              {/* Main Content Area */}
              <div className="my-auto py-4 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Left Text Column */}
                <div className="lg:col-span-7 space-y-6 text-left">
                  <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-[70px] font-black leading-[1.15] tracking-tight ${notoSansKr.className}`}>
                    <span className="text-[#2C2520] block mb-2">120겹 파이</span>
                    <span className="text-[#B39567] block">성공 창업 제안</span>
                  </h1>
                  
                  <div className="space-y-4">
                    <h3 className="text-xl sm:text-2xl font-bold text-[#2C2520] leading-snug">
                      예비 가맹점주를 위한<br />
                      맞춤형 창업 제안서
                    </h3>
                    <p className={`text-xs sm:text-sm md:text-base text-slate-500 font-medium leading-relaxed max-w-lg ${notoSansKr.className}`}>
                      40년 장인 정신으로 완성한 120겹 파이,<br />
                      검증된 상품력과 효율적인 운영 시스템으로<br />
                      안정적인 수익 모델을 제안합니다.
                    </p>
                  </div>
                </div>

                {/* Right Wireframe Placeholders Column */}
                <div className="lg:col-span-5 grid grid-cols-12 gap-3.5">
                  <div className="col-span-12">
                    <WireframePlaceholder 
                      mainText="메인 비주얼 이미지 영역" 
                      subText="120겹 파이 클로즈업" 
                      aspectClass="aspect-[16/9.5]"
                    />
                  </div>
                  <div className="col-span-6">
                    <WireframePlaceholder 
                      mainText="브랜드 무드 이미지 영역" 
                      subText="카페 전경 또는 디저트 진열" 
                      aspectClass="aspect-[4/3]"
                    />
                  </div>
                  <div className="col-span-6">
                    <WireframePlaceholder 
                      mainText="보조 이미지 영역" 
                      subText="고객이 파이를 즐기는 장면" 
                      aspectClass="aspect-[4/3]"
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Metrics Bar with Laurel Wreaths */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-[#B39567]/20 pt-5 shrink-0">
                {[
                  { 
                    title: "전국 300호점 돌파", 
                    desc: "검증된 브랜드 파워와\n지속적인 가맹 확장",
                    icon: <MapPin size={24} />
                  },
                  { 
                    title: "6WAY 매출 시스템", 
                    desc: "다채로운 수익 구조로\n안정적이고 높은 수익 실현",
                    icon: <TrendingUp size={24} />
                  },
                  { 
                    title: "소자본 숍인샵 가능", 
                    desc: "낮은 초기 투자 비용으로\n부담 없이 창업 가능",
                    icon: <Store size={24} />
                  }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 bg-white/60 p-2 border border-[#B39567]/10 rounded-[6px] shadow-sm">
                    {/* Laurel wreath around icon */}
                    <LaurelWreath>
                      {item.icon}
                    </LaurelWreath>
                    <div>
                      <div className="text-base sm:text-lg font-bold text-[#2C2520]">{item.title}</div>
                      <div className="text-xs text-slate-500 font-semibold leading-relaxed whitespace-pre-line">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2PAGE. 왜 120겹 파이인가? (Brand Story) */}
          {currentSlide === 1 && (
            <div className="absolute inset-0 p-8 sm:p-12 flex flex-col justify-between bg-gradient-to-br from-[#FFFDF6] via-[#FCF3D7] to-[#F6E6BB] animate-fadeIn">
               
               {/* Top Subtitle / Category */}
               <div className="flex items-center justify-between border-b border-[#EADFCE] pb-3 mb-6 shrink-0">
                  <div className="flex items-center gap-2">
                     <Leaf className="text-[#B39567]" size={18} />
                     <span className="text-xs font-bold tracking-[0.15em] text-[#B39567] font-serif-kr">01 Brand Story</span>
                  </div>
                  <span className="text-xs font-bold text-slate-400 font-outfit">BRAND POWER & VALUE</span>
               </div>

               {/* Title & Core Subtitle Description */}
               <div className="mb-6 shrink-0">
                  <h2 className={`text-3xl sm:text-[40px] font-black tracking-tight text-[#362C24] leading-tight mb-2 ${notoSansKr.className}`}>
                     왜 <span className="text-[#B39567]">120겹 파이</span>인가?
                  </h2>
                  <p className={`text-sm text-slate-500 font-semibold leading-relaxed ${notoSansKr.className}`}>
                     40년 장인 정신으로 완성한 독보적인 제품력과 런칭 3년 만에 300호점을 돌파한 강력한 브랜드 확장성을 제안합니다.
                  </p>
               </div>

               {/* Main Dashboard Grid (3 Columns) */}
               <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch flex-1 min-h-[350px]">
                  
                  {/* Left Column: Brand Identity & USP A, B + Image Card (4 columns span) */}
                  <div className="lg:col-span-4 bg-white border border-[#EADFCE] rounded-[6px] p-5 flex flex-col justify-between shadow-sm relative">
                     <div className="mb-3">
                        <span className="text-[#B39567] text-[10px] font-bold tracking-wider font-outfit uppercase">01 / BRAND VALUE</span>
                        <h3 className={`text-base font-bold text-[#362C24] ${notoSansKr.className}`}>독보적인 기술력과 성장성</h3>
                     </div>

                     <div className="space-y-3.5 flex-1 flex flex-col justify-center my-auto">
                        {/* A. 장인정신 */}
                        <div className="p-3.5 bg-[#FCFAF5] border border-[#EADFCE]/50 rounded-[4px] relative">
                           <div className="absolute top-3 right-3 bg-[#B39567] text-white text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-sm">A</div>
                           <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-full bg-[#B39567]/10 flex items-center justify-center text-[#B39567] shrink-0 mt-0.5">
                                 <ChefHat size={15} />
                              </div>
                              <div className="text-left">
                                 <h4 className={`text-[12px] font-bold text-[#362C24] leading-snug ${notoSansKr.className}`}>40년 장인 정신의 독보적인 기술</h4>
                                 <ul className="text-[9.5px] text-slate-500 font-medium leading-relaxed mt-1.5 space-y-0.5 list-disc pl-3">
                                    <li><strong>독보적 120겹 레이어:</strong> 바삭한 식감 극대화</li>
                                    <li><strong>체계적인 R&D 배합:</strong> 대중적인 최상의 풍미</li>
                                    <li><strong>초간편 생지 공급:</strong> 10분 내 매장 조리 완성</li>
                                 </ul>
                              </div>
                           </div>
                        </div>

                        {/* B. 가맹 성장 */}
                        <div className="p-3.5 bg-[#FCFAF5] border border-[#EADFCE]/50 rounded-[4px] relative">
                           <div className="absolute top-3 right-3 bg-[#B39567] text-white text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-sm">B</div>
                           <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-full bg-[#B39567]/10 flex items-center justify-center text-[#B39567] shrink-0 mt-0.5">
                                 <Store size={15} />
                              </div>
                              <div className="text-left">
                                 <h4 className={`text-[12px] font-bold text-[#362C24] leading-snug ${notoSansKr.className}`}>런칭 3년 만에 전국 300호점 돌파</h4>
                                 <ul className="text-[9.5px] text-slate-500 font-medium leading-relaxed mt-1.5 space-y-0.5 list-disc pl-3">
                                    <li><strong>업계 독보적 성장세:</strong> 최단기간 300호점 달성</li>
                                    <li><strong>입증된 시장 안정성:</strong> 가맹점 재계약률 우수</li>
                                    <li><strong>하이브리드 창업:</strong> 기존 카페 숍인샵 최적화</li>
                                 </ul>
                              </div>
                           </div>
                        </div>

                        {/* Brand Visual Image Card (Fills vertical whitespace) */}
                        <div className="h-[80px] shrink-0">
                           <WireframePlaceholder 
                              mainText="브랜드 핵심 이미지 영역" 
                              subText="120겹 레이어 크로아상/애플파이 실물 단면 컷" 
                              aspectClass="h-full p-2 text-center rounded-[4px]" 
                           />
                        </div>
                     </div>
                  </div>

                  {/* Center Column: Growth Indicator Chart (5 columns span) */}
                  <div className="lg:col-span-5 bg-white border border-[#EADFCE] rounded-[6px] p-5 flex flex-col justify-between shadow-sm relative">
                     <div className="flex justify-between items-start border-b border-[#EADFCE]/40 pb-3 mb-3 shrink-0">
                        <div>
                           <span className="text-[#B39567] text-[10px] font-bold tracking-wider font-outfit uppercase">02 / GROWTH CHART</span>
                           <h3 className={`text-base font-bold text-[#362C24] ${notoSansKr.className}`}>연도별 브랜드 가맹 성장 추이</h3>
                        </div>
                        <div className="bg-[#B39567]/5 border border-[#B39567]/25 rounded-[4px] p-2 max-w-[190px] text-left shrink-0">
                           <span className="text-[8px] font-bold text-[#B39567] uppercase block tracking-wider">Growth Insight</span>
                           <p className={`text-[10px] font-bold text-[#362C24] leading-normal mt-0.5 ${notoSansKr.className}`}>
                              연평균 성장률(CAGR) <span className="text-[#B39567] font-black">140%</span> 기록, 디저트 가맹 브랜드 선호도 1위 달성.
                           </p>
                        </div>
                     </div>

                     {/* SVG Growth Chart Container */}
                     <div className="relative w-full flex-1 flex flex-col justify-end mt-1">
                        {/* Background Grid Lines */}
                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20 pb-6">
                           <div className="w-full border-b border-dashed border-[#B39567]"></div>
                           <div className="w-full border-b border-dashed border-[#B39567]"></div>
                           <div className="w-full border-b border-dashed border-[#B39567]"></div>
                           <div className="w-full border-b border-dashed border-[#B39567]"></div>
                        </div>

                        {/* Line Area Chart */}
                        <div className="relative w-full flex-1 min-h-[220px] lg:min-h-[260px]">
                           <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                              <defs>
                                <linearGradient id="chartArea" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#B39567" stopOpacity="0.25" />
                                  <stop offset="100%" stopColor="#B39567" stopOpacity="0" />
                                </linearGradient>
                              </defs>
                              {/* Area Fill */}
                              <path d="M 10 98 C 35 88 65 48 90 2 L 90 100 L 10 100 Z" fill="url(#chartArea)" />
                              {/* Stroke Line */}
                              <path d="M 10 98 C 35 88 65 48 90 2" fill="none" stroke="#B39567" strokeWidth="3.5" strokeLinecap="round" style={{ filter: 'drop-shadow(0px 4px 6px rgba(179, 149, 103, 0.35))' }} />
                           </svg>

                           {/* Points & Labels */}
                           {/* Point 1: 10호점 */}
                           <div className="absolute flex flex-col items-center -translate-x-1/2" style={{ left: '10%', bottom: '2%' }}>
                              <span className="text-[9.5px] font-bold text-[#362C24] mb-1 whitespace-nowrap">10호점</span>
                              <div className="w-2.5 h-2.5 rounded-full bg-white border-[2.5px] border-[#B39567] shadow-md relative z-10"></div>
                           </div>

                           {/* Point 2: 70호점 */}
                           <div className="absolute flex flex-col items-center -translate-x-1/2" style={{ left: '36.6%', bottom: '12%' }}>
                              <span className="text-[9.5px] font-bold text-[#362C24] mb-1 whitespace-nowrap">70호점</span>
                              <div className="w-2.5 h-2.5 rounded-full bg-white border-[2.5px] border-[#B39567] shadow-md relative z-10"></div>
                           </div>

                           {/* Point 3: 150호점 */}
                           <div className="absolute flex flex-col items-center -translate-x-1/2" style={{ left: '63.3%', bottom: '52%' }}>
                              <span className="text-[9.5px] font-bold text-[#362C24] mb-1 whitespace-nowrap">150호점</span>
                              <div className="w-3 h-3 rounded-full bg-white border-[2.5px] border-[#B39567] shadow-md relative z-10"></div>
                           </div>

                           {/* Point 4: 300호점 (Highlight) */}
                           <div className="absolute flex flex-col items-center -translate-x-1/2" style={{ left: '90%', bottom: '98%' }}>
                              <div className="bg-gradient-to-r from-[#D4AF37] to-[#B39567] text-white text-[9px] font-black px-2.5 py-0.5 rounded-full mb-1 shadow-md whitespace-nowrap animate-bounce relative z-20">
                                 300호점
                              </div>
                              <div className="w-3.5 h-3.5 rounded-full bg-[#B39567] border-2 border-white shadow-lg relative z-10 ring-4 ring-[#B39567]/20 flex items-center justify-center">
                                 <span className="absolute w-5 h-5 rounded-full bg-[#B39567]/30 animate-ping"></span>
                              </div>
                           </div>
                        </div>

                        {/* X axis labels (Precisely aligned) */}
                        <div className="relative w-full h-[25px] border-t-2 border-[#EADFCE]/70 mt-3">
                           <span className="absolute -translate-x-1/2 pt-1 text-[9.5px] font-bold text-slate-500 whitespace-nowrap" style={{ left: '10%' }}>브랜드 런칭</span>
                           <span className="absolute -translate-x-1/2 pt-1 text-[9.5px] font-bold text-slate-500 whitespace-nowrap" style={{ left: '36.6%' }}>1년차</span>
                           <span className="absolute -translate-x-1/2 pt-1 text-[9.5px] font-bold text-slate-500 whitespace-nowrap" style={{ left: '63.3%' }}>2년차</span>
                           <span className="absolute -translate-x-1/2 pt-1 text-[9.5px] font-bold text-slate-500 whitespace-nowrap" style={{ left: '90%' }}>3년차</span>
                        </div>
                     </div>

                     <div className="text-center mt-3 text-[10px] text-[#B39567] font-bold bg-[#B39567]/8 py-1.5 rounded-md mx-2 tracking-wide">
                        지속적이고 가파른 가맹 확장세로 검증된 강력한 브랜드 파워
                     </div>
                  </div>

                  {/* Right Column: Public Interest & Visual (3 columns span) */}
                  <div className="lg:col-span-3 flex flex-col justify-between gap-4">
                     {/* Top Box: Image Wireframe */}
                     <div className="flex-1 min-h-[120px]">
                        <WireframePlaceholder 
                           mainText="장인 정신 조리 이미지" 
                           subText="결이 하나하나 살아있는 120겹 파이 단면 실사 연출 영역" 
                           aspectClass="h-full p-3 text-center rounded-[6px]" 
                        />
                     </div>

                     {/* Bottom Box: C. Public Interest Metrics */}
                     <div className="bg-[#FCFAF5] border border-[#EADFCE] rounded-[6px] p-4 flex flex-col justify-between shadow-sm relative h-[210px] shrink-0">
                        <div className="absolute top-0 right-0 w-8 h-8 pointer-events-none opacity-10 overflow-hidden">
                           <div className="absolute -top-1 -right-1 bg-[#B39567] text-white text-[8px] font-black w-6 h-6 flex items-center justify-center rounded-sm">C</div>
                        </div>

                        <h4 className={`text-[12px] font-bold text-[#362C24] border-b border-[#EADFCE] pb-1.5 mb-2 text-left ${notoSansKr.className}`}>압도적인 대중적 관심</h4>
                        
                        <div className="grid grid-cols-1 gap-2 flex-1 justify-center my-auto">
                           {[
                              { label: "네이버 검색량 월", val: "61,500회", desc: "키워드 쿼리 분석 기준" },
                              { label: "SNS 해시태그 누적", val: "19.3만 개", desc: "#120겹파이 누적 카운트" },
                              { label: "소형 디저트 카페 선호도", val: "업계 1위", desc: "자사 리서치 데이터 기준" }
                           ].map((m, idx) => (
                              <div key={idx} className="flex justify-between items-center text-left py-1">
                                 <div>
                                    <span className="text-[9px] font-bold text-slate-500 block leading-tight">{m.label}</span>
                                    <span className="text-[8px] text-slate-400 font-semibold block leading-tight mt-0.5">{m.desc}</span>
                                 </div>
                                 <div className="text-right shrink-0">
                                    <span className="text-[13px] font-black text-[#B39567] font-serif-kr block">{m.val}</span>
                                 </div>
                               </div>
                           ))}
                        </div>

                        <span className="text-[7.5px] text-slate-400 text-left mt-2 block">* 2024년 4월 자사 리서치 및 포털 빅데이터 기반</span>
                     </div>
                  </div>

               </div>
               
               {/* Footer Sub-Note */}
               <div className="mt-5 shrink-0 border-t border-[#EADFCE] pt-3 text-center flex items-center justify-between text-[11px] text-slate-500 font-semibold">
                  <span>* 120겹 파이 전국 가맹점 성장률 및 포털 트렌드 분석 기준</span>
                  <span className="text-[#B39567] font-bold">120PIE & COFFEE SYSTEM</span>
               </div>

            </div>
          )}

          {/* 3PAGE. 해결책 제시 (Solution / Market Strategy) */}
          {currentSlide === 2 && (
            <div className="absolute inset-0 p-8 sm:p-12 flex flex-col justify-between bg-gradient-to-br from-[#FFFDF6] via-[#FCF3D7] to-[#F6E6BB] animate-fadeIn">
               
               {/* Top Subtitle / Category */}
               <div className="flex items-center justify-between border-b border-[#EADFCE] pb-3 mb-6 shrink-0">
                  <div className="flex items-center gap-2">
                     <Leaf className="text-[#B39567]" size={18} />
                     <span className="text-xs font-bold tracking-[0.15em] text-[#B39567] font-serif-kr">02 Market Strategy</span>
                  </div>
                  <span className="text-xs font-bold text-slate-400 font-outfit">OMNI-CHANNEL SALES MODEL</span>
               </div>

               {/* Title & Core Subtitle Description */}
               <div className="mb-6 shrink-0">
                  <h2 className={`text-3xl sm:text-[40px] font-black tracking-tight text-[#362C24] leading-tight mb-2 ${notoSansKr.className}`}>
                     롱런할 수밖에 없는 <span className="text-[#B39567]">매출 전략</span>
                  </h2>
                  <p className={`text-sm text-slate-500 font-semibold leading-relaxed ${notoSansKr.className}`}>
                     120겹 파이는 단순 홀 영업을 넘어 6WAY 판매 채널 및 시공간을 초월하는 상시 수요 구조로 비수기 없는 안정적 수익을 창출합니다.
                  </p>
               </div>

               {/* Main Dashboard Grid (3 Columns) */}
               <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch flex-1 min-h-[350px]">
                  
                  {/* Left Column: 6WAY Channels (4 columns span) */}
                  <div className="lg:col-span-4 bg-white border border-[#EADFCE] rounded-[6px] p-5 flex flex-col justify-between shadow-sm relative">
                     <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none opacity-5 overflow-hidden">
                        <TrendingUp size={80} className="text-[#B39567] -translate-y-4 translate-x-4" />
                     </div>
                     
                     <div className="mb-4">
                        <span className="text-[#B39567] text-[10px] font-bold tracking-wider font-outfit uppercase">01 / Channels</span>
                        <h3 className={`text-base font-bold text-[#362C24] ${notoSansKr.className}`}>6WAY 다각화 매출 시스템</h3>
                     </div>

                     <div className="grid grid-cols-1 gap-2 flex-1 justify-center my-auto">
                        {[
                           { name: "매장 내 홀", desc: "고마진 음료 동반 세트 유도", icon: <Coffee size={14} /> },
                           { name: "테이크아웃", desc: "회전율 높은 소형 간식 패키지", icon: <Store size={14} /> },
                           { name: "배달 서비스", desc: "배달앱 연동 반경 3km 거점 확장", icon: <MapPin size={14} /> },
                           { name: "생지 납품", desc: "B2B 대용량 납품 및 간편 재고화", icon: <Leaf size={14} /> },
                           { name: "단체 주문", desc: "학교, 기업, 동호회 단체 간식", icon: <CheckCircle2 size={14} /> },
                           { name: "자체 시즌 메뉴", desc: "트렌드 반영 독점 신메뉴 출시", icon: <ChefHat size={14} /> }
                        ].map((ch, idx) => (
                           <div key={idx} className="flex items-center gap-3 p-2 bg-[#FCFAF5] border border-[#EADFCE]/40 rounded-[4px] hover:border-[#B39567]/50 transition-colors duration-200">
                              <div className="w-8 h-8 rounded-[4px] bg-[#B39567]/10 flex items-center justify-center text-[#B39567] shrink-0">
                                 {ch.icon}
                              </div>
                              <div className="text-left min-w-0">
                                 <h4 className={`text-[11.5px] font-bold text-[#362C24] leading-tight ${notoSansKr.className}`}>{ch.name}</h4>
                                 <p className="text-[9.5px] text-slate-500 font-semibold truncate leading-none mt-1">{ch.desc}</p>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>

                  {/* Center Column: Time & Season Timeline (5 columns span) */}
                  <div className="lg:col-span-5 bg-white border border-[#EADFCE] rounded-[6px] p-5 flex flex-col justify-between shadow-sm">
                     <div className="mb-3">
                        <span className="text-[#B39567] text-[10px] font-bold tracking-wider font-outfit uppercase">02 / Demand Timeline</span>
                        <h3 className={`text-base font-bold text-[#362C24] ${notoSansKr.className}`}>공백 없는 시공간 상시 수요</h3>
                     </div>

                     {/* 24 Hours Timeline (Top Part) */}
                     <div className="space-y-3.5 flex-1 flex flex-col justify-center border-b border-[#EADFCE]/50 pb-4">
                        <div className="flex items-center justify-between shrink-0">
                           <span className="text-[11.5px] font-bold text-[#362C24] flex items-center gap-1">
                              <Clock size={14} className="text-[#B39567]" /> 24H Daypart 타임라인
                           </span>
                           <span className="text-[9px] font-bold text-[#B39567] bg-[#B39567]/5 px-2 py-0.5 rounded-full">비수기 극복</span>
                        </div>

                        {/* Daypart Infographic Timeline Track */}
                        <div className="relative w-full py-3.5 px-2 bg-[#FCFAF5]/50 border border-[#EADFCE]/40 rounded-[6px] shadow-inner shrink-0">
                           {/* Timeline track line */}
                           <div className="absolute top-[28px] left-[10%] right-[10%] h-1 bg-[#EADFCE]">
                              {/* Active/filled progress bar */}
                              <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#B39567] to-[#D4AF37] w-full rounded-full"></div>
                           </div>
                           
                           {/* 4 Interactive timeline nodes */}
                           <div className="relative flex justify-between px-[8%]">
                              {[
                                 { time: "08:00", label: "아침 / 등교·출근길", icon: <Sun size={12} className="text-amber-500" /> },
                                 { time: "11:30", label: "점심 / 식후 디저트", icon: <Coffee size={12} className="text-[#B39567]" /> },
                                 { time: "14:30", label: "간식 / 오피스·단체", icon: <Store size={12} className="text-[#B39567]" /> },
                                 { time: "17:30", label: "저녁 / 퇴근길 야식", icon: <Moon size={12} className="text-indigo-400" /> }
                              ].map((node, index) => (
                                 <div key={index} className="flex flex-col items-center">
                                    <div className="w-7 h-7 rounded-full bg-white border-2 border-[#B39567] shadow-sm flex items-center justify-center relative z-10 ring-4 ring-white">
                                       {node.icon}
                                    </div>
                                    <span className="text-[9.5px] font-bold text-[#362C24] mt-1.5 leading-none">{node.label.split(" / ")[0]}</span>
                                    <span className="text-[8px] text-slate-400 font-bold font-outfit mt-0.5">{node.time}</span>
                                 </div>
                              ))}
                           </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 flex-1">
                           {[
                              { time: "08:00 - 11:00", label: "아침 / 등교·출근길", menu: "계란빵 등 식사 대용 메뉴" },
                              { time: "11:30 - 14:00", label: "점심 / 식후 디저트", menu: "시그니처 애플파이 & 커피" },
                              { time: "14:30 - 17:00", label: "간식 / 오피스·단체", menu: "대량 간식 포장 및 배달" },
                              { time: "17:30 - 21:00", label: "저녁 / 퇴근길 야식", menu: "패밀리 팩 홈 포장 수요" }
                           ].map((t, idx) => (
                              <div key={idx} className="p-2.5 bg-[#FCFAF5]/60 border border-[#EADFCE]/30 rounded-[4px] text-left flex flex-col justify-between hover:border-[#B39567]/30 transition-colors duration-200">
                                 <div className="flex justify-between items-center">
                                    <span className="text-[9px] font-bold text-[#B39567] font-outfit block mb-1">{t.time}</span>
                                    <span className="text-[8px] font-bold text-slate-400 uppercase">Step 0{idx+1}</span>
                                 </div>
                                 <h5 className={`text-[11px] font-bold text-[#362C24] leading-tight ${notoSansKr.className}`}>{t.label}</h5>
                                 <p className="text-[9.5px] text-slate-500 font-semibold mt-0.5 leading-none">{t.menu}</p>
                              </div>
                           ))}
                        </div>
                     </div>

                     {/* 4 Seasons Stable Demand (Bottom Part) */}
                     <div className="space-y-3 pt-4">
                        <div className="flex items-center justify-between">
                           <span className="text-[11.5px] font-bold text-[#362C24] flex items-center gap-1">
                              <Leaf size={14} className="text-[#B39567]" /> 4계절 에버그린 수요 안정화
                           </span>
                           <span className="text-[10px] font-black text-[#B39567]">상시 유지율 100%</span>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                           {[
                              { season: "봄 (Spring)", pct: "25%", theme: "화사한 봄딸기 파이" },
                              { season: "여름 (Summer)", pct: "25%", theme: "아이스 음료 + 디저트" },
                              { season: "가을 (Autumn)", pct: "25%", theme: "풍미 깊은 시나몬 파이" },
                              { season: "겨울 (Winter)", pct: "25%", theme: "따뜻한 베이커리 배달" }
                           ].map((s, idx) => (
                              <div key={idx} className="bg-[#FCFAF5] border border-[#EADFCE]/40 p-2 rounded-[4px] text-center flex flex-col justify-between">
                                 <span className="text-[9.5px] font-bold text-slate-500 block leading-tight">{s.season.split(" ")[0]}</span>
                                 <span className="text-[15px] font-black text-[#B39567] font-outfit my-1.5">{s.pct}</span>
                                 <span className="text-[8px] text-slate-400 font-semibold block leading-tight whitespace-nowrap">{s.theme.split(" ")[0]}</span>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>

                  {/* Right Column: Visual Core & Success Strategy (3 columns span) */}
                  <div className="lg:col-span-3 flex flex-col justify-between gap-4">
                     {/* Top Box: Sleek Wireframe Image */}
                     <div className="flex-1 min-h-[140px]">
                        <WireframePlaceholder 
                           mainText="옴니채널 비즈니스 실사" 
                           subText="매장 홀, 포장 고객, 배달 기사가 한 앵글에 담겨 6WAY 작동을 한눈에 보여주는 현장 컷" 
                           aspectClass="h-full p-4 text-center rounded-[6px]" 
                        />
                     </div>

                     {/* Bottom Box: Premium Core Message Card */}
                     <div className="bg-[#2C2520] text-[#F4EFE6] border border-[#B39567] rounded-[6px] p-5 flex flex-col justify-between text-center shadow-lg relative overflow-hidden h-[180px] shrink-0">
                        {/* Elegant background glow */}
                        <div className="absolute inset-0 bg-gradient-to-b from-[#B39567]/10 to-transparent pointer-events-none"></div>
                        
                        <div className="z-10 flex flex-col items-center">
                           <Leaf className="text-[#B39567] mb-2 animate-pulse" size={24} />
                           <h4 className={`text-[13px] font-black text-[#B39567] tracking-wider uppercase font-outfit mb-2`}>CORE BUSINESS STRATEGY</h4>
                        </div>
                        
                        <div className={`z-10 my-auto text-[11.5px] sm:text-[12.5px] font-bold text-white/90 leading-relaxed ${notoSansKr.className}`}>
                           “다양한 판매 채널과<br/>
                           시간·계절에 흔들리지 않는<br/>
                           수요 접점을 선점하는 것이<br/>
                           장기 안정 운영의 핵심입니다.”
                        </div>

                        <div className="w-8 h-px bg-[#B39567] mx-auto mt-2 z-10"></div>
                     </div>
                  </div>

               </div>
               
               {/* Footer Sub-Note */}
               <div className="mt-5 shrink-0 border-t border-[#EADFCE] pt-3 text-center flex items-center justify-between text-[11px] text-slate-500 font-semibold">
                  <span>* 120겹 파이 전국 가맹점 평균 데이터 및 마켓 옴니채널 지표 분석 기준</span>
                  <span className="text-[#B39567] font-bold">120PIE & COFFEE SYSTEM</span>
               </div>

            </div>
          )}
          {/* Placeholders for slides

          {/* Placeholders for slides 4-11 (Index 3 to 10) in Version 2 Premium Theme */}
          {currentSlide >= 3 && currentSlide <= 10 && currentSlide !== 9 && (
            <div className="absolute inset-0 p-8 sm:p-12 md:p-16 flex flex-col justify-between bg-gradient-to-br from-[#FFFDF9] via-[#FDF5E2] to-[#FAF0CE] animate-fadeIn">
              <div className="flex items-center justify-between border-b border-[#B39567]/20 pb-4">
                <span className="text-sm font-bold tracking-widest text-[#B39567] font-outfit">
                  {String(currentSlide + 1).padStart(2, "0")} / {slideTitles[currentSlide].split(" (")[1]?.replace(")", "") || "DETAIL"}
                </span>
                <span className="text-sm font-semibold px-3.5 py-1.5 bg-[#B39567]/10 text-[#B39567] rounded-[4px] border border-[#B39567]/25">
                  상세 설계 준비 중
                </span>
              </div>

              <div className="my-auto text-center space-y-6 max-w-3xl mx-auto">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#2C2520] leading-tight font-outfit">
                  {slideTitles[currentSlide]}
                </h2>
                <div className="w-16 h-0.5 bg-[#B39567] mx-auto"></div>
                <p className="text-base sm:text-lg lg:text-xl text-slate-600 font-medium leading-relaxed">
                  B2B 제안서 v2의 세련된 샴페인 골드 테마 디자인 템플릿 공간입니다.<br />
                  사장님의 기획에 따라 상세 데이터와 실물 도표, 인포그래픽이 정교하게 이식될 예정입니다.
                </p>
                <div className="inline-block px-4 py-2 bg-[#B39567]/5 text-[#B39567] text-xs sm:text-sm font-semibold rounded-[4px] border border-[#B39567]/10">
                  💡 하단 내비게이션 바 또는 키보드 방향키를 눌러 다른 슬라이드와 상담 양식을 검토할 수 있습니다.
                </div>
              </div>

              <div className="border-t border-[#B39567]/20 pt-4 text-center shrink-0">
                <p className="text-xs sm:text-sm font-bold text-slate-400 font-outfit tracking-widest">
                  120PIE & COFFEE B2B SYSTEM
                </p>
              </div>
            </div>
          )}

          {/* 10PAGE. 검증된 가맹점 수익 시뮬레이션 (Premium Theme) */}
          {currentSlide === 9 && (
            <div className="absolute inset-0 p-6 sm:p-10 md:p-12 lg:p-14 xl:p-16 flex flex-col justify-between bg-gradient-to-br from-[#FFFDF6] via-[#FCF3D7] to-[#F6E6BB] animate-fadeIn">
              {/* Top Subtitle / Category */}
              <div className="flex items-center justify-between border-b border-[#B39567]/30 pb-2.5 mb-2 shrink-0">
                <div className="flex items-center gap-2">
                  <Leaf className="text-[#B39567]" size={16} />
                  <span className="text-xs font-bold tracking-[0.15em] text-[#B39567] font-serif-kr">10 Financial Predict</span>
                </div>
                <span className="text-xs font-bold text-slate-400 font-outfit">REVENUE SIMULATION</span>
              </div>

              {/* Main Content Area */}
              <div className="my-auto py-2 flex-1 flex flex-col justify-center gap-3">
                {/* Top Row: Title, Highlight Card, and Barista Image */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center shrink-0">
                  {/* Left Column: Title and Highlight Box */}
                  <div className="md:col-span-7 space-y-3">
                    <h2 className={`text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-[#2C2520] leading-tight ${notoSansKr.className}`}>
                      검증된 가맹점 수익 시뮬레이션
                    </h2>
                    
                    <div className="border border-[#B39567]/45 bg-white/70 backdrop-blur-sm p-4 rounded-[6px] shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-[#B39567]"></div>
                      <div className={`text-xs sm:text-sm font-semibold text-[#2C2520]/80 pl-1 ${notoSansKr.className}`}>
                        월매출 3,000만원 기준,
                      </div>
                      <div className={`text-lg sm:text-xl md:text-2xl font-bold text-[#2C2520] mt-1 pl-1 ${notoSansKr.className}`}>
                        가맹점주 순수익 <span className="text-[#f05c40] font-black text-2xl sm:text-3xl">1,050만원</span> 예상
                      </div>
                      <div className="text-[10px] sm:text-xs text-slate-400 italic font-medium mt-1 pl-1">
                        테이크아웃 전문점(7평~12평) 기준 예측 가이드
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Premium Barista Image Container */}
                  <div className="md:col-span-5 h-[110px] sm:h-[135px] md:h-[150px] w-full rounded-[6px] overflow-hidden border border-[#B39567]/25 shadow-md relative bg-white">
                    <img 
                      src="/proposal_barista.png" 
                      alt="120pie & coffee 가맹점 이미지" 
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                </div>

                {/* Middle Row: Table */}
                <div className="w-full overflow-hidden border border-[#B39567]/25 rounded-[6px] shadow-sm shrink-0 bg-white/40">
                  <table className="w-full border-collapse text-left text-[10px] sm:text-xs md:text-sm">
                    <thead>
                      <tr className="bg-[#B39567] text-white">
                        <th className="py-2 px-3 sm:py-2.5 sm:px-4 font-black">항목</th>
                        <th className="py-2 px-3 sm:py-2.5 sm:px-4 font-black text-right">금액(원)</th>
                        <th className="py-2 px-3 sm:py-2.5 sm:px-4 font-black text-center">비율(%)</th>
                        <th className="py-2 px-3 sm:py-2.5 sm:px-4 font-black">설명</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y divide-[#B39567]/15 bg-white/70 font-semibold text-slate-700 ${notoSansKr.className}`}>
                      <tr className="hover:bg-[#FAF6EC]/50 transition-colors">
                        <td className="py-1.5 px-3 sm:py-2 sm:px-4 font-bold text-[#2C2520]">월 총매출</td>
                        <td className="py-1.5 px-3 sm:py-2 sm:px-4 text-right font-black text-[#2C2520]">30,000,000원</td>
                        <td className="py-1.5 px-3 sm:py-2 sm:px-4 text-center font-bold text-slate-500">100%</td>
                        <td className="py-1.5 px-3 sm:py-2 sm:px-4 text-slate-500 font-medium">테이크아웃 및 배달 포함 평균 매출</td>
                      </tr>
                      <tr className="hover:bg-[#FAF6EC]/50 transition-colors">
                        <td className="py-1.5 px-3 sm:py-2 sm:px-4 font-bold text-[#2C2520]">재료비/부재료</td>
                        <td className="py-1.5 px-3 sm:py-2 sm:px-4 text-right font-black text-[#2C2520]">9,000,000원</td>
                        <td className="py-1.5 px-3 sm:py-2 sm:px-4 text-center font-bold text-slate-500">30%</td>
                        <td className="py-1.5 px-3 sm:py-2 sm:px-4 text-slate-500 font-medium">원두, 일회용품, 원부자재 일체</td>
                      </tr>
                      <tr className="hover:bg-[#FAF6EC]/50 transition-colors">
                        <td className="py-1.5 px-3 sm:py-2 sm:px-4 font-bold text-[#2C2520]">인건비</td>
                        <td className="py-1.5 px-3 sm:py-2 sm:px-4 text-right font-black text-[#2C2520]">6,000,000원</td>
                        <td className="py-1.5 px-3 sm:py-2 sm:px-4 text-center font-bold text-slate-500">20%</td>
                        <td className="py-1.5 px-3 sm:py-2 sm:px-4 text-slate-500 font-medium">직원 및 파트 타이머 고용 비용</td>
                      </tr>
                      <tr className="hover:bg-[#FAF6EC]/50 transition-colors">
                        <td className="py-1.5 px-3 sm:py-2 sm:px-4 font-bold text-[#2C2520]">기타 비용</td>
                        <td className="py-1.5 px-3 sm:py-2 sm:px-4 text-right font-black text-[#2C2520]">4,500,000원</td>
                        <td className="py-1.5 px-3 sm:py-2 sm:px-4 text-center font-bold text-slate-500">15%</td>
                        <td className="py-1.5 px-3 sm:py-2 sm:px-4 text-slate-500 font-medium">매장 임대료 및 기본 관리비 등</td>
                      </tr>
                      <tr className="bg-[#f05c40] text-white">
                        <td className="py-1.5 px-3 sm:py-2 sm:px-4 font-black">가맹점주 순수익</td>
                        <td className="py-1.5 px-3 sm:py-2 sm:px-4 text-right font-black">10,500,000원</td>
                        <td className="py-1.5 px-3 sm:py-2 sm:px-4 text-center font-black">35%</td>
                        <td className="py-1.5 px-3 sm:py-2 sm:px-4 font-bold text-white/95">매출 대비 높은 마진율 확보</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Bottom Row: Donut Chart and Cards */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center flex-1 min-h-0">
                  {/* Left Column: Donut Chart */}
                  <div className="md:col-span-5 flex items-center justify-center relative py-2 bg-white/70 backdrop-blur-sm rounded-[6px] border border-[#B39567]/20 h-full min-h-[120px] sm:min-h-[140px] md:min-h-[150px]">
                    <div className="relative w-[110px] h-[110px] sm:w-[130px] sm:h-[130px] md:w-[140px] md:h-[140px]">
                      {/* SVG Donut Chart */}
                      <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                        {/* 35% Yellow (순수익) - offset 0, length = 66.0 */}
                        <circle cx="50" cy="50" r="30" fill="transparent" stroke="#B39567" strokeWidth="16" strokeDasharray="66.0 122.5" strokeDashoffset="0" />
                        {/* 15% Orange (기타 비용) - offset -66.0, length = 28.3 */}
                        <circle cx="50" cy="50" r="30" fill="transparent" stroke="#f2986f" strokeWidth="16" strokeDasharray="28.3 160.2" strokeDashoffset="-66.0" />
                        {/* 20% Slate-grey (인건비) - offset -94.3, length = 37.7 */}
                        <circle cx="50" cy="50" r="30" fill="transparent" stroke="#c4ccd4" strokeWidth="16" strokeDasharray="37.7 150.8" strokeDashoffset="-94.3" />
                        {/* 30% Grey (재료비 부재료) - offset -132.0, length = 56.5 */}
                        <circle cx="50" cy="50" r="30" fill="transparent" stroke="#b0b0b0" strokeWidth="16" strokeDasharray="56.5 132.0" strokeDashoffset="-132.0" />
                        {/* Inner Hole */}
                        <circle cx="50" cy="50" r="22" fill="white" />
                      </svg>
                      
                      {/* Donut Labels */}
                      {/* 35% 순수익 (Right) */}
                      <div className="absolute top-[28%] right-[8%] text-center leading-none">
                        <span className="text-[10px] sm:text-xs font-black text-slate-800 block font-outfit">35%</span>
                        <span className={`text-[8px] sm:text-[9px] font-bold text-slate-500 ${notoSansKr.className}`}>순수익</span>
                      </div>
                      {/* 15% 기타 비용 (Bottom Right) */}
                      <div className="absolute bottom-[20%] right-[16%] text-center leading-none">
                        <span className="text-[10px] sm:text-xs font-black text-slate-800 block font-outfit">15%</span>
                        <span className={`text-[8px] sm:text-[9px] font-bold text-slate-500 ${notoSansKr.className}`}>기타 비용</span>
                      </div>
                      {/* 20% 인건비 (Bottom Left) */}
                      <div className="absolute bottom-[22%] left-[16%] text-center leading-none">
                        <span className="text-[10px] sm:text-xs font-black text-slate-800 block font-outfit">20%</span>
                        <span className={`text-[8px] sm:text-[9px] font-bold text-slate-500 ${notoSansKr.className}`}>인건비</span>
                      </div>
                      {/* 30% 재료비 부재료 (Top Left) */}
                      <div className="absolute top-[26%] left-[10%] text-center leading-none">
                        <span className="text-[10px] sm:text-xs font-black text-slate-800 block font-outfit">30%</span>
                        <span className={`text-[8px] sm:text-[9px] font-bold text-slate-500 block leading-tight ${notoSansKr.className}`}>재료비</span>
                        <span className={`text-[8px] sm:text-[9px] font-bold text-slate-500 block leading-none ${notoSansKr.className}`}>부재료</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Two Cards */}
                  <div className={`md:col-span-7 flex flex-col gap-2 justify-between h-full min-h-[120px] sm:min-h-[140px] md:min-h-[150px] ${notoSansKr.className}`}>
                    {/* Card 1 */}
                    <div className="flex items-center gap-3 p-2.5 bg-white rounded-[6px] border border-[#B39567]/25 shadow-sm flex-1">
                      <div className="w-9 h-9 rounded-full bg-[#B39567]/10 text-[#B39567] flex items-center justify-center shrink-0">
                        {/* Target icon */}
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10" />
                          <circle cx="12" cy="12" r="6" />
                          <circle cx="12" cy="12" r="2" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <h4 className="text-xs sm:text-sm font-black text-[#2C2520] mb-0.5">핵심 포인트</h4>
                        <p className="text-[10px] sm:text-xs font-bold text-slate-500 leading-tight">작은 평수에서도 높은 수익률을 기대할 수 있는 구조</p>
                      </div>
                    </div>

                    {/* Card 2 */}
                    <div className="flex items-center gap-3 p-2.5 bg-white rounded-[6px] border border-[#B39567]/25 shadow-sm flex-1">
                      <div className="w-9 h-9 rounded-full bg-emerald-50 text-[#10b981] flex items-center justify-center shrink-0">
                        {/* Up-trend arrow and coins icon */}
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.281m5.94 2.28m-2.28 5.941" />
                          <circle cx="8" cy="19" r="2" />
                          <circle cx="16" cy="19" r="2" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <h4 className="text-xs sm:text-sm font-black text-[#2C2520] mb-0.5">수익 구조</h4>
                        <p className="text-[10px] sm:text-xs font-bold text-slate-500 leading-tight">배달과 테이크아웃 결합 시 매출 안정성 강화</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Footer Bar */}
              <div className="relative w-full mt-2 shrink-0">
                <div className="w-full h-px bg-[#B39567]/30 mb-2.5"></div>
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 font-serif-kr">
                  <span>120겹 파이 B2B 제안서</span>
                  <div className="flex items-center gap-2">
                    <span className="font-outfit text-xs">10</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 12PAGE. 무료 상담 신청 (CTA) (Index 11) */}
          {currentSlide === 11 && (
            <div className="absolute inset-0 p-8 sm:p-12 md:p-14 lg:p-16 flex flex-col justify-between bg-gradient-to-br from-[#FFFDF9] via-[#FDF5E2] to-[#FAF0CE] animate-fadeIn">
              <div className="flex items-center justify-between border-b-2 border-[#B39567]/20 pb-3 shrink-0">
                <span className="text-sm font-bold tracking-widest text-[#B39567] font-outfit">12 / CONSULTATION</span>
                <span className="text-sm font-bold text-slate-500 font-outfit">VIP INQUIRY</span>
              </div>

              <div className="my-auto py-2 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4 lg:space-y-6">
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-[#2C2520] leading-tight">
                    우리 매장에 어울리는<br />
                    전략적 도입 진단을 받아보세요.
                  </h2>
                  <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
                    매장의 전기 승압 상황, 동선 배치, 주요 고객 상권 빅데이터를 종합 분석하여 도입에 따른 손익 지표 시뮬레이션을 무상 전달해 드립니다.
                  </p>
                  
                  <div className="bg-white border border-[#B39567]/20 p-4 text-xs sm:text-sm font-semibold text-slate-500 rounded-[6px] space-y-2 shadow-sm">
                    <div className="text-[#B39567] font-bold">📌 VIP 무료 상담 제공 특전:</div>
                    <div className="pl-2.5 border-l-2 border-[#B39567]/30">현재 주방 평수에 조화되는 전용 기물 3D 설계도 제공</div>
                    <div className="pl-2.5 border-l-2 border-[#B39567]/30">980만 원 B2B 패키지의 투자 타당성 분석서</div>
                    <div className="pl-2.5 border-l-2 border-[#B39567]/30">주변 경쟁 매장 매출 비중 및 차별화 메뉴 컨설팅</div>
                  </div>
                </div>

                <div className="bg-white border border-[#B39567]/20 p-6 relative rounded-[6px] flex flex-col justify-center shadow-md">
                  {submitSuccess ? (
                    <div className="text-center py-6 space-y-4 animate-scaleUp">
                      <div className="inline-flex w-12 h-12 bg-emerald-50 border border-emerald-500 text-emerald-600 rounded-full items-center justify-center">
                        <CheckCircle2 size={24} />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-base font-bold text-[#2C2520]">가맹 상담 신청이 완료되었습니다.</h4>
                        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                          남겨주신 정보로 개별 상권 리포트를 작성하여<br />
                          전문 담당 실장이 신속하게 연락을 드리겠습니다.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setSubmitSuccess(false);
                          setFormData({ name: "", phone: "", storeType: "기존 카페 샵인샵 도입", existingStoreName: "", message: "" });
                        }}
                        className="text-xs sm:text-sm text-[#B39567] font-bold hover:underline"
                      >
                        [추가 가맹 상담서 접수하기]
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleFormSubmit} className="space-y-3.5">
                      <div className="grid grid-cols-2 gap-3.5">
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-500 block">성함 / 담당자</label>
                          <input
                            type="text"
                            placeholder="성함 입력"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            className="w-full bg-[#FAF8F5] border border-[#B39567]/30 rounded-[4px] px-3.5 py-2 text-xs sm:text-sm text-[#2C2520] placeholder-slate-400 focus:outline-none focus:border-[#B39567] transition-all"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-500 block">연락처</label>
                          <input
                            type="text"
                            placeholder="연락처 번호 입력"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: formatPhoneNumber(e.target.value) })}
                            required
                            className="w-full bg-[#FAF8F5] border border-[#B39567]/30 rounded-[4px] px-3.5 py-2 text-xs sm:text-sm text-[#2C2520] placeholder-slate-400 focus:outline-none focus:border-[#B39567] transition-all"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3.5">
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-500 block">원하는 신청 유형</label>
                          <select
                            value={formData.storeType}
                            onChange={(e) => setFormData({ ...formData, storeType: e.target.value })}
                            className="w-full bg-[#FAF8F5] border border-[#B39567]/30 rounded-[4px] px-2.5 py-2 text-xs sm:text-sm text-[#2C2520] focus:outline-none focus:border-[#B39567] cursor-pointer font-bold"
                          >
                            <option value="기존 카페 샵인샵 도입">기존 카페 샵인샵 도입</option>
                            <option value="소형 매장 신규 창업">소형 매장 신규 창업</option>
                            <option value="소자본 예비 창업">소자본 예비 창업</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-500 block">기존 매장 이름 (선택)</label>
                          <input
                            type="text"
                            placeholder="운영 매장 이름"
                            value={formData.existingStoreName}
                            onChange={(e) => setFormData({ ...formData, existingStoreName: e.target.value })}
                            className="w-full bg-[#FAF8F5] border border-[#B39567]/30 rounded-[4px] px-3.5 py-2 text-xs sm:text-sm text-[#2C2520] placeholder-slate-400 focus:outline-none focus:border-[#B39567] transition-all"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500 block">기타 요청 및 상담 희망내용</label>
                        <input
                          type="text"
                          placeholder="예: 예상 회수 기간, 오븐 배치 등"
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          className="w-full bg-[#FAF8F5] border border-[#B39567]/30 rounded-[4px] px-3.5 py-2 text-xs sm:text-sm text-[#2C2520] placeholder-slate-400 focus:outline-none focus:border-[#B39567] transition-all"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B39567] hover:from-[#C5A02E] hover:to-[#A38558] text-white font-bold text-xs sm:text-sm py-3 rounded-[4px] hover:scale-[1.01] active:scale-[0.99] transition-all shadow-sm"
                      >
                        {isSubmitting ? "접수 처리 중..." : "매장 맞춤 도입 모델 가맹 상담 신청하기"}
                      </button>
                    </form>
                  )}
                </div>
              </div>

              {/* Bottom Footer Bar with Thin Gold Line - Exactly like the bottom black bar with thin gold line */}
              <div className="relative w-full mt-auto pt-3 shrink-0">
                <div className="w-full h-px bg-[#B39567]/30 mb-3"></div>
                <div className="flex justify-between items-center bg-[#2C2520] text-[#FAF8F5] p-3 text-xs font-bold rounded-[3px] font-serif-kr">
                  <span>120겹 파이 가맹제안서</span>
                  <div className="flex items-center gap-3">
                    <div className="w-px h-3 bg-white/20"></div>
                    <span className="font-outfit text-sm font-bold">12</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Slide Navigation Controls */}
      <footer className="w-full max-w-[1560px] mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0 text-[#2C2520] z-10 border-t border-[#B39567]/25">
        <div className="text-xs font-semibold flex items-center gap-1.5 text-slate-500">
          <Info size={16} className="text-[#B39567]" />
          <span>키보드 방향키 <kbd className="bg-white px-1.5 py-0.5 rounded-[3px] border border-[#B39567]/30 font-bold mx-0.5">←</kbd> <kbd className="bg-white px-1.5 py-0.5 rounded-[3px] border border-slate-300 font-bold mx-0.5">→</kbd> 키를 통해서도 슬라이드 이동이 가능합니다.</span>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap justify-center">
          {Array.from({ length: totalSlides }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentSlide(idx);
                setIsPlaying(false);
              }}
              className={`w-2 h-2 transition-all duration-300 rounded-full ${
                currentSlide === idx ? "bg-[#B39567] w-6" : "bg-[#B39567]/30 hover:bg-[#B39567]/60"
              }`}
            ></button>
          ))}
        </div>
      </footer>
      
      {/* Absolute Bottom Black Footer Bar (For pages other than CTA Slide 12 to look clean) */}
      {currentSlide !== 11 && (
        <div className="w-full max-w-[1560px] mx-auto px-6 pb-4 shrink-0">
          <div className="w-full h-px bg-[#B39567]/30 mb-3"></div>
          <div className="flex justify-between items-center bg-[#2C2520] text-[#FAF8F5] p-3 text-xs font-bold rounded-[3px] font-serif-kr">
            <span>120겹 파이 가맹제안서</span>
            <div className="flex items-center gap-3">
              <div className="w-px h-3 bg-white/20"></div>
              <span className="font-outfit text-sm font-bold">{String(currentSlide + 1).padStart(2, "0")}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}