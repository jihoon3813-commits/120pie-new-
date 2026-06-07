"use client";

import React, { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  ArrowLeft, 
  CheckCircle2, 
  FileText,
  HelpCircle,
  Plus,
  Info
} from "lucide-react";
import Link from "next/link";

export default function ProposalDeck() {
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

  const totalSlides = 12;

  // Autoplay function
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
      }, 6000);
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
        message: formData.message || "B2B 제안서 페이지를 통한 상담 신청",
        regDate: new Date().toISOString().split("T")[0],
      });
      setSubmitSuccess(true);
    } catch (error) {
      console.error("Failed to submit inquiry:", error);
      alert("상담 신청 중 오류가 발생했습니다. 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const slideTitles = [
    "01. 표지 (Cover)",
    "02. 문제 공감 (Problem)",
    "03. 해결책 제시 (Solution)",
    "04. 왜 120겹 파이인가?",
    "05. 메뉴 라인업 (Menu)",
    "06. 샵인샵 도입 모델",
    "07. 6WAY 매출 시스템",
    "08. 창업 패키지 구성",
    "09. 하이브리드 창업 모델",
    "10. 창업 비용 및 수익 구조",
    "11. 본사 지원 및 절차",
    "12. 무료 상담 신청 (CTA)"
  ];

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-[#1a1a1a] flex flex-col font-sans select-none antialiased overflow-x-hidden relative">
      {/* Top Header */}
      <header className="w-full max-w-[1560px] mx-auto px-6 py-5 flex items-center justify-between z-10 border-b-2 border-[#1a1a1a] shrink-0">
        <div className="flex items-center gap-4">
          <Link 
            href="/"
            className="flex items-center gap-2 text-xs font-bold border-2 border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white px-3.5 py-1.5 rounded-none transition-all"
          >
            <ArrowLeft size={14} />
            <span>홈으로 가기</span>
          </Link>
          <div className="h-5 w-0.5 bg-[#1a1a1a] hidden sm:block"></div>
          <span className="text-xs font-black tracking-wider text-[#1a1a1a] uppercase hidden sm:block">
            120pie & coffee 가맹 제안서
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
            className="bg-white border-2 border-[#1a1a1a] text-xs font-bold px-3 py-1.5 rounded-none focus:outline-none cursor-pointer"
          >
            {slideTitles.map((title, idx) => (
              <option key={idx} value={idx}>
                {title}
              </option>
            ))}
          </select>

          <div className="flex items-center border-2 border-[#1a1a1a] bg-white rounded-none p-0.5">
            <button 
              onClick={handlePrev} 
              className="p-1.5 hover:bg-slate-100 rounded-none transition-colors text-[#1a1a1a]"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-[11px] font-black px-3.5 text-[#1a1a1a] tabular-nums">
              {String(currentSlide + 1).padStart(2, "0")} / {String(totalSlides).padStart(2, "0")}
            </span>
            <button 
              onClick={handleNext} 
              className="p-1.5 hover:bg-slate-100 rounded-none transition-colors text-[#1a1a1a]"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`p-2 border-2 border-[#1a1a1a] rounded-none transition-all flex items-center justify-center ${
              isPlaying 
                ? "bg-[#f25f8a] text-white" 
                : "bg-white text-[#1a1a1a] hover:bg-slate-50"
            }`}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          </button>
        </div>
      </header>

      {/* Main Slide Deck Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-10 z-10 max-w-[1600px] mx-auto w-full">
        <div className="w-full aspect-auto md:aspect-[16/9] bg-[#fdfdfc] border-4 border-[#1a1a1a] rounded-none shadow-[10px_10px_0px_rgba(26,26,26,1)] overflow-hidden relative flex flex-col justify-between transition-all duration-300">
          
          {/* 1PAGE. 표지 */}
          {currentSlide === 0 && (
            <div className="absolute inset-0 p-6 sm:p-12 md:p-16 lg:p-20 xl:p-24 flex flex-col justify-between bg-[#fbfaf7] animate-fadeIn">
              <div className="flex items-center justify-between border-b-2 border-[#1a1a1a] pb-4">
                <span className="text-xs font-black tracking-widest text-[#1a1a1a]">120pie & coffee</span>
                <span className="text-xs font-extrabold px-3 py-1 bg-[#ffd500] text-[#1a1a1a] border border-[#1a1a1a] rounded-none">
                  가맹 제안서
                </span>
              </div>

              <div className="my-auto py-6 space-y-6 lg:space-y-8 max-w-5xl">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-none tracking-tight text-[#1a1a1a] xl:leading-[1.1]">
                  커피만 팔던 매장에<br />
                  <span className="text-[#bf3e67]">디저트 매출</span>을 더하는 가장 빠른 방법
                </h1>
                
                <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-slate-700 font-bold leading-relaxed max-w-2xl lg:max-w-3xl border-l-4 border-[#1a1a1a] pl-4">
                  기존 카페에 바로 더할 수 있는 120겹 파이 디저트 창업 솔루션.<br />
                  새로운 매장을 열지 않아도, 지금 매장에 확실한 디저트 세트 매출을 더할 수 있습니다.
                </p>

                {/* Badge Grid */}
                <div className="flex flex-wrap gap-2.5 pt-2">
                  {[
                    "샵인샵 가능", 
                    "간편 조리 (5분 완성)", 
                    "포장·배달 가능", 
                    "세트 판매 적합", 
                    "하이브리드 창업", 
                    "창업 패키지 제공"
                  ].map((badge, idx) => (
                    <span 
                      key={idx} 
                      className="text-[10px] sm:text-xs lg:text-sm xl:text-base font-black px-3.5 py-2 lg:px-4 lg:py-2.5 xl:px-5 xl:py-3 bg-white border-2 border-[#1a1a1a] rounded-none text-[#1a1a1a]"
                    >
                      ✓ {badge}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom CTA & Decisive Metric */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-t-2 border-[#1a1a1a] pt-5 gap-3 shrink-0">
                <button
                  onClick={() => setCurrentSlide(11)}
                  className="text-xs sm:text-sm lg:text-base xl:text-lg font-black bg-[#ffd500] hover:bg-[#e6bd00] border-2 border-[#1a1a1a] px-5 py-2.5 lg:px-6 lg:py-3.5 rounded-none text-[#1a1a1a] transition-all hover:translate-x-1"
                >
                  우리 매장 맞춤 도입 상담 신청하기 →
                </button>
                <div className="text-[11px] sm:text-xs lg:text-sm xl:text-base font-bold text-slate-600">
                  우리 매장에 120겹 파이를 더하면 얼마나 매출을 만들 수 있을까요?
                </div>
              </div>
            </div>
          )}

          {/* 2PAGE. 문제 공감 */}
          {currentSlide === 1 && (
            <div className="absolute inset-0 p-6 sm:p-12 md:p-14 lg:p-18 xl:p-22 flex flex-col justify-between bg-[#fbfaf7] animate-fadeIn">
              <div className="flex items-center justify-between border-b-2 border-[#1a1a1a] pb-4">
                <span className="text-xs font-black tracking-widest text-slate-500">02 / PROBLEM</span>
                <span className="text-xs font-black text-[#bf3e67]">사장님의 현실적인 고민</span>
              </div>

              <div className="my-auto py-4 grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center">
                <div className="md:col-span-7 space-y-4 lg:space-y-6">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#1a1a1a] leading-tight">
                    커피 한 잔만으로는<br />
                    매출을 올리기 어려운 시대입니다.
                  </h2>
                  <p className="text-xs sm:text-sm lg:text-base xl:text-lg text-slate-700 font-bold leading-relaxed">
                    카페 매출이 정체되는 이유는 단순히 손님이 적어서만은 아닙니다. 문제는 고객 한 명이 결제하는 금액, 즉 <strong>객단가</strong>에 있습니다.
                  </p>
                  <p className="text-xs sm:text-sm lg:text-sm xl:text-base text-slate-600 font-medium leading-relaxed">
                    커피만 판매하면 매출 상승에는 한계가 있고, 디저트를 직접 준비하자니 제조 부담, 인력 부담, 재고 부담이 생깁니다.
                  </p>
                </div>

                <div className="md:col-span-5 border-2 border-[#1a1a1a] bg-white p-5 lg:p-7 xl:p-8 rounded-none space-y-3 shadow-[4px_4px_0px_rgba(26,26,26,1)]">
                  <div className="text-xs lg:text-sm xl:text-base font-black text-[#1a1a1a] uppercase tracking-wider border-b border-[#1a1a1a] pb-2">
                    기존 카페 고민과 한계
                  </div>
                  <div className="space-y-2.5">
                    {[
                      { q: "음료만 판매", a: "객단가 상승 한계" },
                      { q: "직접 디저트 제조", a: "인력·시간·공간 부담" },
                      { q: "단순 납품 디저트 판매", a: "경쟁 매장과의 차별화 부족" },
                      { q: "재고형 디저트 도입", a: "당일 미판매분 폐기 부담" },
                      { q: "대표 디저트 메뉴 부재", a: "고객의 재방문 명분 약함" }
                    ].map((item, idx) => (
                      <div key={idx} className="flex justify-between text-[11px] sm:text-xs lg:text-xs xl:text-sm border-b border-dashed border-slate-200 pb-1">
                        <span className="font-bold text-slate-700">{item.q}</span>
                        <span className="font-black text-rose-600">→ {item.a}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t-2 border-[#1a1a1a] pt-4 text-center shrink-0">
                <p className="text-xs sm:text-sm lg:text-sm xl:text-base font-black text-[#1a1a1a]">
                  카페 사장님에게 필요한 건 또 하나의 음료 메뉴가 아니라, <span className="text-[#bf3e67] bg-[#ffd500]/20 px-1">커피와 함께 팔리는 대표 디저트</span>입니다.
                </p>
              </div>
            </div>
          )}

          {/* 3PAGE. 해결책 제시 */}
          {currentSlide === 2 && (
            <div className="absolute inset-0 p-6 sm:p-12 md:p-14 lg:p-18 xl:p-22 flex flex-col justify-between bg-[#fbfaf7] animate-fadeIn">
              <div className="flex items-center justify-between border-b-2 border-[#1a1a1a] pb-4">
                <span className="text-xs font-black tracking-widest text-slate-500">03 / SOLUTION</span>
                <span className="text-xs font-black text-[#bf3e67]">가장 확실한 대안</span>
              </div>

              <div className="my-auto py-4 grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center">
                <div className="md:col-span-5 space-y-4 lg:space-y-6">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#1a1a1a] leading-tight">
                    120겹 파이 하나로<br />
                    홀 · 포장 · 배달 · 단체까지
                  </h2>
                  <p className="text-xs sm:text-sm lg:text-base xl:text-lg text-slate-700 font-bold leading-relaxed">
                    120pie&coffee는 기존 카페에 바로 도입할 수 있는 샵인샵형 디저트 브랜드입니다.
                  </p>
                  <p className="text-xs sm:text-sm lg:text-sm xl:text-base text-slate-600 font-medium leading-relaxed">
                    120겹 패스츄리 파이를 중심으로 커피와 함께 매장 홀에서 판매하고, 포장 및 배달, 그리고 인근 학원·기업의 단체 주문까지 막힘없이 연결할 수 있습니다.
                  </p>
                </div>

                <div className="md:col-span-7 grid grid-cols-2 gap-3.5 lg:gap-4 xl:gap-5">
                  {[
                    { t: "홀 판매", d: "매장 내 방문 고객의 디저트 세트 구매 확대" },
                    { t: "테이크아웃", d: "커피 한 잔 사며 간편하게 동반 포장 유도" },
                    { t: "배달 판매", d: "음료 외 사이드 매출로 배달앱 노출 강화" },
                    { t: "생지 기반 운영", d: "반죽할 필요 없이 즉석 오븐 조리 완료" },
                    { t: "자체 개발 메뉴", d: "계란빵, 츄러스 등 독점 메뉴 제공" },
                    { t: "단체 주문", d: "주변 기업, 학교 단체 간식 주문 대응" }
                  ].map((item, idx) => (
                    <div key={idx} className="bg-white border-2 border-[#1a1a1a] p-3 shadow-[3px_3px_0px_rgba(26,26,26,1)] rounded-none">
                      <div className="text-xs lg:text-sm xl:text-base font-black text-[#1a1a1a] mb-1 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-[#ffd500]"></span>
                        {item.t}
                      </div>
                      <p className="text-[10px] sm:text-xs lg:text-xs xl:text-sm text-slate-600 font-semibold leading-normal">{item.d}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t-2 border-[#1a1a1a] pt-4 text-center shrink-0">
                <p className="text-xs sm:text-sm lg:text-sm xl:text-base font-black text-[#1a1a1a]">
                  커피 손님을 디저트 세트 고객으로 바꾸는 것. 120pie&coffee의 핵심은 바로 여기에 있습니다.
                </p>
              </div>
            </div>
          )}

          {/* 4PAGE. 왜 120겹 파이인가? */}
          {currentSlide === 3 && (
            <div className="absolute inset-0 p-6 sm:p-12 md:p-14 lg:p-18 xl:p-22 flex flex-col justify-between bg-[#fbfaf7] animate-fadeIn">
              <div className="flex items-center justify-between border-b-2 border-[#1a1a1a] pb-4">
                <span className="text-xs font-black tracking-widest text-slate-500">04 / WHY 120PIE</span>
                <span className="text-xs font-black text-[#bf3e67]">상품 차별화</span>
              </div>

              <div className="my-auto py-4 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center">
                <div className="space-y-4 lg:space-y-6">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#1a1a1a] leading-tight">
                    흔한 디저트가 아니라<br />
                    기억되는 대표 메뉴가 필요합니다
                  </h2>
                  <p className="text-xs sm:text-sm lg:text-base xl:text-lg text-slate-700 font-bold leading-relaxed">
                    120겹 파이는 얇은 패스츄리 결과 다양한 속재료를 결합한 디저트 메뉴입니다.
                  </p>
                  <p className="text-xs sm:text-sm lg:text-sm xl:text-base text-slate-600 font-medium leading-relaxed">
                    단순히 커피 옆에 놓는 사이드 메뉴가 아니라, 고객이 사진을 찍고, 포장하고, 다시 찾을 수 있는 대표 메뉴로 활용할 수 있습니다.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 lg:gap-4 xl:gap-5">
                  {[
                    "120겹 패스츄리 식감",
                    "달콤한 디저트형 메뉴",
                    "든든한 식사형 메뉴",
                    "커피와 세트 판매 적합",
                    "포장·배달 판매 적합",
                    "SNS 콘텐츠화 가능"
                  ].map((item, idx) => (
                    <div key={idx} className="bg-white border-2 border-[#1a1a1a] p-3 lg:p-4.5 xl:p-5.5 flex items-center gap-2 rounded-none">
                      <span className="text-[11px] font-black text-[#bf3e67] bg-[#f25f8a]/10 px-1.5 py-0.5 border border-[#bf3e67]/20">POINT</span>
                      <span className="text-xs lg:text-sm xl:text-base font-black text-[#1a1a1a]">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t-2 border-[#1a1a1a] pt-4 text-center shrink-0">
                <p className="text-xs sm:text-sm lg:text-sm xl:text-base font-black text-[#1a1a1a]">
                  누구나 흉내 낼 수 있는 디저트가 아닌, <span className="text-[#bf3e67]">우리 매장만의 대표성</span>을 확보하세요.
                </p>
              </div>
            </div>
          )}

          {/* 5PAGE. 메뉴 라인업 */}
          {currentSlide === 4 && (
            <div className="absolute inset-0 p-6 sm:p-12 md:p-14 lg:p-18 xl:p-22 flex flex-col justify-between bg-[#fbfaf7] animate-fadeIn">
              <div className="flex items-center justify-between border-b-2 border-[#1a1a1a] pb-4">
                <span className="text-xs font-black tracking-widest text-slate-500">05 / MENU LINEUP</span>
                <span className="text-xs font-black text-[#bf3e67]">메뉴 확장성</span>
              </div>

              <div className="my-auto py-2 space-y-4 lg:space-y-6">
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-center text-[#1a1a1a]">
                  파이부터 에그120, 츄러스120까지 상황에 맞게 확장 가능
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 xl:gap-8">
                  {/* 파이 */}
                  <div className="bg-white border-2 border-[#1a1a1a] p-4 lg:p-6 xl:p-7 rounded-none">
                    <div className="text-xs font-black text-white bg-[#1a1a1a] py-1 px-3 w-fit mb-3">
                      🥐 120겹 파이 시리즈
                    </div>
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[#1a1a1a] text-[11px] sm:text-xs lg:text-xs xl:text-sm font-semibold">
                      <span>• 크림치즈 파이</span>
                      <span>• 커스터드 파이</span>
                      <span>• 애플 파이</span>
                      <span>• 고구마 파이</span>
                      <span>• 블루베리 파이</span>
                      <span>• 흑임자크림 파이</span>
                      <span>• 직화불고기 파이</span>
                      <span>• 직화불닭 파이</span>
                    </div>
                  </div>

                  {/* 에그 */}
                  <div className="bg-white border-2 border-[#1a1a1a] p-4 lg:p-6 xl:p-7 rounded-none">
                    <div className="text-xs font-black text-[#1a1a1a] bg-[#ffd500] py-1 px-3 w-fit mb-3 border border-[#1a1a1a]">
                      🥚 에그120 계란빵
                    </div>
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[#1a1a1a] text-[11px] sm:text-xs lg:text-xs xl:text-sm font-semibold">
                      <span>• 오리지널 계란빵</span>
                      <span>• 베이컨 계란빵</span>
                      <span>• 콘버터 계란빵</span>
                      <span>• 슈크림 계란빵</span>
                      <span className="col-span-2 text-[10px] text-slate-400 font-medium mt-1">
                        * 폭신한 식감과 다채로운 토핑 구성
                      </span>
                    </div>
                  </div>

                  {/* 츄러스 */}
                  <div className="bg-white border-2 border-[#1a1a1a] p-4 lg:p-6 xl:p-7 rounded-none">
                    <div className="text-xs font-black text-white bg-[#bf3e67] py-1 px-3 w-fit mb-3">
                      🍡 츄러스120 & 기타
                    </div>
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[#1a1a1a] text-[11px] sm:text-xs lg:text-xs xl:text-sm font-semibold">
                      <span>• 오리지널 츄러스</span>
                      <span>• 시나몬 츄러스</span>
                      <span>• 오레오 츄러스</span>
                      <span>• 녹차 츄러스</span>
                      <span>• 사이드 떡볶이</span>
                      <span>• 직화불고기 핫도그</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t-2 border-[#1a1a1a] pt-3 text-center shrink-0">
                <p className="text-xs sm:text-sm lg:text-sm xl:text-base font-black text-slate-600">
                  한 가지 메뉴만 파는 것이 아니라, <span className="text-[#1a1a1a]">상권과 매장 상황에 맞게 판매 구성을 조정</span>할 수 있습니다.
                </p>
              </div>
            </div>
          )}

          {/* 6PAGE. 기존 카페에 적합한 샵인샵 모델 */}
          {currentSlide === 5 && (
            <div className="absolute inset-0 p-6 sm:p-12 md:p-14 lg:p-18 xl:p-22 flex flex-col justify-between bg-[#fbfaf7] animate-fadeIn">
              <div className="flex items-center justify-between border-b-2 border-[#1a1a1a] pb-4">
                <span className="text-xs font-black tracking-widest text-slate-500">06 / SHOP-IN-SHOP</span>
                <span className="text-xs font-black text-[#bf3e67]">도입 대상 설득</span>
              </div>

              <div className="my-auto py-4 grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center">
                <div className="md:col-span-6 space-y-4 lg:space-y-6">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#1a1a1a] leading-tight">
                    새 매장을 여는 것보다<br />
                    지금 매장에 새 매출을 더하는 것이 빠릅니다
                  </h2>
                  <p className="text-xs sm:text-sm lg:text-base xl:text-lg text-slate-700 font-bold leading-relaxed">
                    이미 카페를 운영 중이라면, 가장 현실적인 선택은 새로운 매장을 여는 것이 아니라 현재 매장에 판매 가능한 디저트 아이템을 더하는 것입니다.
                  </p>
                </div>

                <div className="md:col-span-6 bg-white border-2 border-[#1a1a1a] p-5 lg:p-7 xl:p-8 shadow-[4px_4px_0px_rgba(26,26,26,1)] rounded-none space-y-3">
                  <div className="text-xs lg:text-sm xl:text-base font-black text-slate-800 border-b border-slate-200 pb-2">
                    이런 매장에 특히 적합합니다
                  </div>
                  <div className="space-y-2 text-xs lg:text-sm xl:text-base font-semibold text-slate-700">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#bf3e67]"></span>
                      <span>음료 외 추가 매출이 절대적으로 필요한 카페</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#bf3e67]"></span>
                      <span>배달·포장 매출 비중을 강화하고 싶은 매장</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#bf3e67]"></span>
                      <span>대표 디저트나 시그니처 빵류가 없는 개인 카페</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#bf3e67]"></span>
                      <span>큰 설비/인테리어 공사 없이 신규 메뉴를 도입하고 싶은 매장</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t-2 border-[#1a1a1a] pt-4 text-center shrink-0">
                <p className="text-xs sm:text-sm lg:text-sm xl:text-base font-black text-[#1a1a1a]">
                  120pie&coffee는 기존 카페의 구조와 동선을 그대로 활용해 디저트 매출을 더하는 <span className="text-[#bf3e67]">안전한 샵인샵 파트너십</span>입니다.
                </p>
              </div>
            </div>
          )}

          {/* 7PAGE. 6WAY 매출 시스템 */}
          {currentSlide === 6 && (
            <div className="absolute inset-0 p-6 sm:p-10 md:p-12 lg:p-16 xl:p-20 flex flex-col justify-between bg-[#fbfaf7] animate-fadeIn">
              <div className="flex items-center justify-between border-b-2 border-[#1a1a1a] pb-3">
                <span className="text-xs font-black tracking-widest text-slate-500">07 / 6WAY REVENUE</span>
                <span className="text-xs font-black text-[#bf3e67]">매출 구조 설명</span>
              </div>

              {/* 순환 구조 레이아웃 */}
              <div className="my-auto py-2">
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-center mb-6">
                  하나의 아이템을 여섯 가지 매출 채널로 판매합니다
                </h2>

                <div className="grid grid-cols-3 md:grid-cols-7 gap-3 lg:gap-4.5 xl:gap-5 items-center text-center">
                  <div className="bg-white border-2 border-[#1a1a1a] p-2.5 lg:p-3.5 xl:p-4 rounded-none h-24 lg:h-28 xl:h-32 flex flex-col justify-center shadow-[2px_2px_0px_rgba(26,26,26,1)]">
                    <span className="text-[10px] font-black text-[#bf3e67] block">01</span>
                    <span className="text-xs lg:text-sm xl:text-base font-black mt-1">홀 판매</span>
                    <span className="text-[9px] lg:text-[10px] xl:text-xs text-slate-500 mt-0.5">방객 디저트 추가</span>
                  </div>

                  <div className="hidden md:flex justify-center text-slate-400">──</div>

                  <div className="bg-white border-2 border-[#1a1a1a] p-2.5 lg:p-3.5 xl:p-4 rounded-none h-24 lg:h-28 xl:h-32 flex flex-col justify-center shadow-[2px_2px_0px_rgba(26,26,26,1)]">
                    <span className="text-[10px] font-black text-[#bf3e67] block">02</span>
                    <span className="text-xs lg:text-sm xl:text-base font-black mt-1">테이크아웃</span>
                    <span className="text-[9px] lg:text-[10px] xl:text-xs text-slate-500 mt-0.5">커피 고객 포장</span>
                  </div>

                  <div className="hidden md:flex justify-center text-slate-400">──</div>

                  <div className="bg-white border-2 border-[#1a1a1a] p-2.5 lg:p-3.5 xl:p-4 rounded-none h-24 lg:h-28 xl:h-32 flex flex-col justify-center shadow-[2px_2px_0px_rgba(26,26,26,1)]">
                    <span className="text-[10px] font-black text-[#bf3e67] block">03</span>
                    <span className="text-xs lg:text-sm xl:text-base font-black mt-1">배달 판매</span>
                    <span className="text-[9px] lg:text-[10px] xl:text-xs text-slate-500 mt-0.5">간식·야식 앱</span>
                  </div>

                  <div className="hidden md:flex justify-center text-slate-400">──</div>

                  <div className="bg-white border-2 border-[#1a1a1a] p-2.5 lg:p-3.5 xl:p-4 rounded-none h-24 lg:h-28 xl:h-32 flex flex-col justify-center shadow-[2px_2px_0px_rgba(26,26,26,1)]">
                    <span className="text-[10px] font-black text-[#bf3e67] block">04</span>
                    <span className="text-xs lg:text-sm xl:text-base font-black mt-1">생지 기반</span>
                    <span className="text-[9px] lg:text-[10px] xl:text-xs text-slate-500 mt-0.5">초간편 조리</span>
                  </div>

                  <div className="col-span-3 md:col-span-7 flex justify-center gap-4 mt-3">
                    <div className="bg-white border-2 border-[#1a1a1a] p-2.5 lg:p-3.5 xl:p-4 rounded-none w-32 lg:w-36 xl:w-40 text-center shadow-[2px_2px_0px_rgba(26,26,26,1)]">
                      <span className="text-[10px] font-black text-[#bf3e67] block">05</span>
                      <span className="text-xs lg:text-sm xl:text-base font-black mt-1">자체 개발 메뉴</span>
                    </div>
                    <div className="bg-white border-2 border-[#1a1a1a] p-2.5 lg:p-3.5 xl:p-4 rounded-none w-32 lg:w-36 xl:w-40 text-center shadow-[2px_2px_0px_rgba(26,26,26,1)]">
                      <span className="text-[10px] font-black text-[#bf3e67] block">06</span>
                      <span className="text-xs lg:text-sm xl:text-base font-black mt-1">단체 주문</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t-2 border-[#1a1a1a] pt-3 text-center shrink-0">
                <p className="text-xs sm:text-sm lg:text-sm xl:text-base font-black text-[#1a1a1a]">
                  판매 채널이 많아질수록 하나의 메뉴가 만드는 매출 기회도 더욱 다양하게 확대됩니다.
                </p>
              </div>
            </div>
          )}

          {/* 8PAGE. 창업 패키지 구성 */}
          {currentSlide === 7 && (
            <div className="absolute inset-0 p-6 sm:p-12 md:p-14 lg:p-18 xl:p-22 flex flex-col justify-between bg-[#fbfaf7] animate-fadeIn">
              <div className="flex items-center justify-between border-b-2 border-[#1a1a1a] pb-4">
                <span className="text-xs font-black tracking-widest text-slate-500">08 / SYSTEM PACKAGE</span>
                <span className="text-xs font-black text-[#bf3e67]">실행 가능성</span>
              </div>

              <div className="my-auto py-2 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center">
                <div className="space-y-4 lg:space-y-6">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#1a1a1a] leading-tight">
                    장비부터 매장 홍보물까지<br />
                    판매 시작 구성을 완벽히 함께 제공합니다
                  </h2>
                  <p className="text-xs sm:text-sm lg:text-base xl:text-lg text-slate-700 font-bold leading-relaxed">
                    무엇을 준비해야 할지 고민하는 불필요한 시간을 획기적으로 줄이고, 도입 즉시 하루 만에 판매를 개시할 수 있도록 지원합니다.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 lg:gap-3 xl:gap-4 text-xs lg:text-sm xl:text-base font-bold text-slate-700">
                  {[
                    "전용 파이 머신",
                    "계란빵 전용 머신",
                    "초도 재료 공급 물량",
                    "포장 봉투 및 부자재",
                    "홍보용 실외 배너 2종",
                    "매장 내 비치용 POP",
                    "홍보용 벽면 포스터",
                    "제품 모형 & 진열 쇼케이스",
                    "간판 및 어닝 디자인 지원",
                    "메뉴판 제작 및 교체 지원"
                  ].map((item, idx) => (
                    <div key={idx} className="bg-white border border-[#1a1a1a] p-2 lg:p-3 xl:p-3.5 flex items-center gap-1.5 rounded-none">
                      <span className="w-1.5 h-1.5 bg-[#ffd500]"></span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t-2 border-[#1a1a1a] pt-4 text-center shrink-0">
                <p className="text-xs sm:text-sm lg:text-sm xl:text-base font-black text-[#1a1a1a]">
                  본사는 신속하고 거품 없는 점주님의 매장 가동을 돕습니다.
                </p>
              </div>
            </div>
          )}

          {/* 9PAGE. 하이브리드 창업 모델 */}
          {currentSlide === 8 && (
            <div className="absolute inset-0 p-6 sm:p-12 md:p-14 lg:p-18 xl:p-22 flex flex-col justify-between bg-[#fbfaf7] animate-fadeIn">
              <div className="flex items-center justify-between border-b-2 border-[#1a1a1a] pb-4">
                <span className="text-xs font-black tracking-widest text-slate-500">09 / HYBRID CREATIVE</span>
                <span className="text-xs font-black text-[#bf3e67]">낮은 도입 장벽</span>
              </div>

              <div className="my-auto py-4 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center">
                <div className="space-y-4 lg:space-y-6">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#1a1a1a] leading-tight">
                    인테리어 부담은 획기적으로 줄이고<br />
                    메뉴와 실제 매출에만 집중합니다
                  </h2>
                  <p className="text-xs sm:text-sm lg:text-base xl:text-lg text-slate-700 font-bold leading-relaxed">
                    하이브리드 창업은 기존 매장의 인프라와 공간 배치를 최대한 유지하면서, 120pie&coffee의 차별화된 메뉴, 전문 장비, 간판, 사인물만 더해 빠르게 영업을 전개하는 실속 가성비 모델입니다.
                  </p>
                </div>

                <div className="bg-white border-2 border-[#1a1a1a] p-5 lg:p-7 xl:p-8 shadow-[4px_4px_0px_rgba(26,26,26,1)] rounded-none space-y-3">
                  <div className="text-xs lg:text-sm xl:text-base font-black text-[#1a1a1a] border-b border-slate-200 pb-1.5">
                    하이브리드 모델 가치
                  </div>
                  <div className="space-y-2 text-xs lg:text-sm xl:text-base font-semibold text-slate-700">
                    <div className="flex justify-between">
                      <span>• 기존 카페 매장 구조 100% 보존</span>
                      <span className="font-bold text-[#1a1a1a]">공사비 최소화</span>
                    </div>
                    <div className="flex justify-between">
                      <span>• 매장 전면 및 돌출 간판, 어닝 위주 디자인</span>
                      <span className="font-bold text-[#1a1a1a]">신속한 인지도 확보</span>
                    </div>
                    <div className="flex justify-between">
                      <span>• 주방 1평 및 오븐 전원 공급 공간 필요</span>
                      <span className="font-bold text-[#1a1a1a]">간편한 도입</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t-2 border-[#1a1a1a] pt-4 text-center shrink-0">
                <p className="text-xs sm:text-sm lg:text-sm xl:text-base font-black text-[#1a1a1a]">
                  대규모 철거 공사보다 우선해야 할 것은 <span className="text-[#bf3e67]">손님이 기꺼이 결제하는 디저트의 존재</span>입니다.
                </p>
              </div>
            </div>
          )}

          {/* 10PAGE. 창업 비용 및 수익 구조 */}
          {currentSlide === 9 && (
            <div className="absolute inset-0 p-6 sm:p-12 md:p-14 lg:p-18 xl:p-22 flex flex-col justify-between bg-[#fbfaf7] animate-fadeIn">
              <div className="flex items-center justify-between border-b-2 border-[#1a1a1a] pb-3">
                <span className="text-xs font-black tracking-widest text-slate-500">10 / INVESTMENT & ROI</span>
                <span className="text-xs font-black text-[#bf3e67]">숫자로 설득</span>
              </div>

              <div className="my-auto py-2 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 xl:gap-12 items-stretch">
                {/* 하이브리드 도입 비용 테이블 */}
                <div className="border-2 border-[#1a1a1a] bg-white p-4 lg:p-6 xl:p-8 rounded-none shadow-[3px_3px_0px_rgba(26,26,26,1)]">
                  <div className="text-xs lg:text-sm xl:text-base font-black text-[#1a1a1a] border-b-2 border-[#1a1a1a] pb-2 mb-2 flex justify-between">
                    <span>하이브리드 도입 총비용 (980만 원)</span>
                    <span className="text-slate-400">* VAT 별도</span>
                  </div>
                  <table className="w-full text-[11px] sm:text-xs lg:text-xs xl:text-sm font-semibold text-slate-700">
                    <tbody>
                      <tr className="border-b border-slate-100">
                        <td className="py-1.5 lg:py-2.5 xl:py-3 font-bold text-[#1a1a1a]">가맹비</td>
                        <td className="py-1.5 lg:py-2.5 xl:py-3">브랜드 권한, 레시피 교육, 개점 지원</td>
                        <td className="py-1.5 lg:py-2.5 xl:py-3 text-right font-black text-[#1a1a1a]">100만 원</td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="py-1.5 lg:py-2.5 xl:py-3 font-bold text-[#1a1a1a]">장비 비용</td>
                        <td className="py-1.5 lg:py-2.5 xl:py-3">파이 머신, 계란빵 머신 등 세팅</td>
                        <td className="py-1.5 lg:py-2.5 xl:py-3 text-right font-black text-[#1a1a1a]">150만 원</td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="py-1.5 lg:py-2.5 xl:py-3 font-bold text-[#1a1a1a]">간판/사인</td>
                        <td className="py-1.5 lg:py-2.5 xl:py-3">외부 전면, 돌출, 실사 교체, 신규 어닝</td>
                        <td className="py-1.5 lg:py-2.5 xl:py-3 text-right font-black text-[#1a1a1a]">330만 원</td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="py-1.5 lg:py-2.5 xl:py-3 font-bold text-[#1a1a1a]">초도 물품</td>
                        <td className="py-1.5 lg:py-2.5 xl:py-3">원부자재 초도, 메뉴판, 실외 배너, 홍보물</td>
                        <td className="py-1.5 lg:py-2.5 xl:py-3 text-right font-black text-[#1a1a1a]">300만 원</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 lg:py-2.5 xl:py-3 font-bold text-[#1a1a1a]">기타 비용</td>
                        <td className="py-1.5 lg:py-2.5 xl:py-3">실내 사인물, 포인트 액자, 브랜드 POP</td>
                        <td className="py-1.5 lg:py-2.5 xl:py-3 text-right font-black text-[#1a1a1a]">100만 원</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* 예시 수익 구조 */}
                <div className="border-2 border-[#1a1a1a] bg-white p-4 lg:p-6 xl:p-8 rounded-none shadow-[3px_3px_0px_rgba(26,26,26,1)] flex flex-col justify-between">
                  <div>
                    <div className="text-xs lg:text-sm xl:text-base font-black text-[#1a1a1a] border-b-2 border-[#1a1a1a] pb-2 mb-2">
                      예상 운영 손익 구조 (월 매출 3,000만 원 기준 예시)
                    </div>
                    <table className="w-full text-[11px] sm:text-xs lg:text-xs xl:text-sm font-semibold text-slate-700">
                      <tbody>
                        <tr className="border-b border-slate-100">
                          <td className="py-2 lg:py-3 text-[#bf3e67] font-black">순수익 (35%)</td>
                          <td className="py-2 lg:py-3 text-right text-[#bf3e67] font-black">1,050만 원</td>
                        </tr>
                        <tr className="border-b border-slate-100">
                          <td className="py-2 lg:py-3">원부재료 원가 (30%)</td>
                          <td className="py-2 lg:py-3 text-right">900만 원</td>
                        </tr>
                        <tr className="border-b border-slate-100">
                          <td className="py-2 lg:py-3">인건비 책정 (20%)</td>
                          <td className="py-2 lg:py-3 text-right">600만 원</td>
                        </tr>
                        <tr>
                          <td className="py-2 lg:py-3">고정 임대료/공과금/기타 (15%)</td>
                          <td className="py-2 lg:py-3 text-right">450만 원</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="text-[10px] lg:text-xs xl:text-sm text-slate-400 font-medium leading-relaxed bg-[#fbfaf7] p-2 mt-2 border border-slate-200">
                    * 개별 매장 면적, 운영 시간대, 근무 인원수에 따라 실제 마진율은 다소 변동될 수 있습니다.
                  </div>
                </div>
              </div>

              <div className="border-t-2 border-[#1a1a1a] pt-3 text-center shrink-0">
                <p className="text-xs sm:text-sm lg:text-sm xl:text-base font-black text-[#1a1a1a]">
                  상담 시 사장님의 기존 집기, 매장 상권에 따라 <span className="text-[#bf3e67]">가장 합리적인 개인 맞춤 도입 비용</span>을 재조정해 제안해 드립니다.
                </p>
              </div>
            </div>
          )}

          {/* 11PAGE. 본사 지원 및 오픈 절차 */}
          {currentSlide === 10 && (
            <div className="absolute inset-0 p-6 sm:p-12 md:p-14 lg:p-18 xl:p-22 flex flex-col justify-between bg-[#fbfaf7] animate-fadeIn">
              <div className="flex items-center justify-between border-b-2 border-[#1a1a1a] pb-4">
                <span className="text-xs font-black tracking-widest text-slate-500">11 / SYSTEM SUPPORT</span>
                <span className="text-xs font-black text-[#bf3e67]">신뢰 확보</span>
              </div>

              <div className="my-auto py-2 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center">
                <div className="space-y-4 lg:space-y-6">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#1a1a1a] leading-tight">
                    단순 원부자재 유통 공급을 넘어,<br />
                    매장 안착까지 든든하게 동행합니다
                  </h2>
                  <div className="grid grid-cols-2 gap-3.5 text-xs lg:text-sm xl:text-base text-slate-600 font-medium">
                    <div>
                      <strong className="text-[#1a1a1a] block mb-1">✓ 오픈 전 확실한 빌드업</strong>
                      상일상태 확인, 공간 도면 배치 설계, 조리 실습 밀착 교육, 메뉴 연출용 홍보자료 일체 무상 제공
                    </div>
                    <div>
                      <strong className="text-[#1a1a1a] block mb-1">✓ 오픈 후 사후 피드백</strong>
                      배달앱 포지셔닝 상담, 신메뉴 레시피 및 실사 이미지 공급, 비정기 영업 지원 순회
                    </div>
                  </div>
                </div>

                <div className="border-2 border-[#1a1a1a] bg-white p-5 lg:p-7 xl:p-8 rounded-none space-y-4 shadow-[4px_4px_0px_rgba(26,26,26,1)]">
                  <div className="text-xs lg:text-sm xl:text-base font-black border-b border-[#1a1a1a] pb-2 text-[#1a1a1a]">
                    가맹 개점 및 도입 프로세스
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs lg:text-sm xl:text-base font-semibold text-slate-700">
                    <div>
                      <span className="font-extrabold text-[#bf3e67] block text-[9px]">STEP 01</span>
                      <span>가맹 상담 신청</span>
                    </div>
                    <div>
                      <span className="font-extrabold text-[#bf3e67] block text-[9px]">STEP 02</span>
                      <span>매장 현장 조건 검토</span>
                    </div>
                    <div>
                      <span className="font-extrabold text-[#bf3e67] block text-[9px]">STEP 03</span>
                      <span>도입 모델 맞춤 선정</span>
                    </div>
                    <div>
                      <span className="font-extrabold text-[#bf3e67] block text-[9px]">STEP 04</span>
                      <span>계약 체결 및 장비 설치</span>
                    </div>
                    <div>
                      <span className="font-extrabold text-[#bf3e67] block text-[9px]">STEP 05</span>
                      <span>메뉴 실습 및 조리 교육</span>
                    </div>
                    <div>
                      <span className="font-extrabold text-[#bf3e67] block text-[9px]">STEP 06</span>
                      <span>정식 개시 및 마케팅 관리</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t-2 border-[#1a1a1a] pt-4 text-center shrink-0">
                <p className="text-xs sm:text-sm lg:text-sm xl:text-base font-black text-[#1a1a1a]">
                  누구나 3시간 실습이면 <span className="text-[#bf3e67]">파티시에 수준의 일관된 고품질 파이</span>를 즉시 공급하여 구워낼 수 있습니다.
                </p>
              </div>
            </div>
          )}

          {/* 12PAGE. 상담 전환 페이지 (CTA) */}
          {currentSlide === 11 && (
            <div className="absolute inset-0 p-6 sm:p-12 md:p-12 lg:p-16 xl:p-20 flex flex-col justify-between bg-[#fbfaf7] animate-fadeIn">
              <div className="flex items-center justify-between border-b-2 border-[#1a1a1a] pb-3 shrink-0">
                <span className="text-xs font-black tracking-widest text-[#bf3e67]">12 / CONSULTATION</span>
                <span className="text-xs font-black text-slate-500">실시간 매장 분석</span>
              </div>

              <div className="my-auto py-2 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center">
                <div className="space-y-4 lg:space-y-6">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#1a1a1a] leading-tight">
                    우리 매장에 적합한<br />
                    도입 모델을 확인해 보세요
                  </h2>
                  <p className="text-xs sm:text-sm lg:text-base xl:text-lg text-slate-700 font-bold leading-relaxed">
                    매장의 전력 동선, 기존 커피 매출 수준, 홀과 배달 비중에 따라 최적의 메뉴 레이아웃과 예상 마진을 개별 검토해 드립니다.
                  </p>
                  
                  <div className="bg-white border-2 border-[#1a1a1a] p-3.5 lg:p-5 xl:p-6 text-[11px] lg:text-xs xl:text-sm font-semibold text-slate-600 rounded-none space-y-1">
                    <div>📌 <strong>가맹 무료 상담 시 확인 가능한 사항:</strong></div>
                    <div>• 현재 운영 중인 매장의 전력/주방 레이아웃에 어울리는 추천 기물 도면 설계</div>
                    <div>• 980만 원 하이브리드 패키지의 매장 적용 가능 구역 상세 검증</div>
                    <div>• 지역 상권에 입각한 120파이와 계란빵 베스트 세트 메뉴 비율 안내</div>
                  </div>
                </div>

                {/* 상담 접수 폼 */}
                <div className="bg-white border-2 border-[#1a1a1a] p-5 lg:p-7 xl:p-8 relative rounded-none flex flex-col justify-center shadow-[6px_6px_0px_rgba(26,26,26,1)]">
                  {submitSuccess ? (
                    <div className="text-center py-6 space-y-4 animate-scaleUp">
                      <div className="inline-flex w-12 h-12 bg-emerald-50 border-2 border-emerald-500 text-emerald-600 rounded-none items-center justify-center">
                        <CheckCircle2 size={24} />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-base font-black text-[#1a1a1a]">가맹 상담 접수 완료!</h4>
                        <p className="text-xs lg:text-sm text-slate-600 leading-relaxed">
                          보내주신 매장 특성에 입각하여<br />
                          담당 전담 지점 실장이 연락드리겠습니다.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setSubmitSuccess(false);
                          setFormData({ name: "", phone: "", storeType: "기존 카페 샵인샵 도입", existingStoreName: "", message: "" });
                        }}
                        className="text-xs lg:text-sm text-[#bf3e67] font-black hover:underline"
                      >
                        [추가 신청 양식 접수하기]
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleFormSubmit} className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] lg:text-xs xl:text-sm font-bold text-slate-600 block">성함 / 담당자명</label>
                          <input
                            type="text"
                            placeholder="성함 입력"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            className="w-full bg-[#fbfaf7] border-2 border-[#1a1a1a] rounded-none px-3 py-2 lg:px-4 lg:py-2.5 text-xs lg:text-sm text-[#1a1a1a] placeholder-slate-400 focus:outline-none focus:bg-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] lg:text-xs xl:text-sm font-bold text-slate-600 block">연락처</label>
                          <input
                            type="text"
                            placeholder="전화번호 입력"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            required
                            className="w-full bg-[#fbfaf7] border-2 border-[#1a1a1a] rounded-none px-3 py-2 text-xs text-[#1a1a1a] placeholder-slate-400 focus:outline-none focus:bg-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-600 block">신청 유형</label>
                          <select
                            value={formData.storeType}
                            onChange={(e) => setFormData({ ...formData, storeType: e.target.value })}
                            className="w-full bg-[#fbfaf7] border-2 border-[#1a1a1a] rounded-none px-2.5 py-2 text-xs text-[#1a1a1a] focus:outline-none focus:bg-white cursor-pointer font-bold"
                          >
                            <option value="기존 카페 샵인샵 도입">기존 카페 샵인샵 도입</option>
                            <option value="소형 매장 창업">소형 매장 창업</option>
                            <option value="소자본 예비 창업">소자본 예비 창업</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-600 block">기존 매장명 (선택)</label>
                          <input
                            type="text"
                            placeholder="운영 매장 이름"
                            value={formData.existingStoreName}
                            onChange={(e) => setFormData({ ...formData, existingStoreName: e.target.value })}
                            className="w-full bg-[#fbfaf7] border-2 border-[#1a1a1a] rounded-none px-3 py-2 text-xs text-[#1a1a1a] placeholder-slate-400 focus:outline-none focus:bg-white"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-600 block">간단 질문 / 상담 희망사항</label>
                        <input
                          type="text"
                          placeholder="예: 현재 카페에 120겹 파이를 넣으면 어떤 메뉴 구성이 좋을까?"
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          className="w-full bg-[#fbfaf7] border-2 border-[#1a1a1a] rounded-none px-3 py-2 text-xs text-[#1a1a1a] placeholder-slate-400 focus:outline-none focus:bg-white"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#ffd500] hover:bg-[#e6bd00] text-[#1a1a1a] border-2 border-[#1a1a1a] font-black text-xs py-2.5 rounded-none hover:scale-[1.01] active:scale-[0.99] transition-all mt-1"
                      >
                        {isSubmitting ? "상담 접수 진행 중..." : "매장 맞춤 도입 모델 가맹 상담 신청하기"}
                      </button>
                    </form>
                  )}
                </div>
              </div>

              {/* Footer Banner */}
              <div className="flex justify-between items-center border-t-2 border-[#1a1a1a] pt-4 mt-auto text-[10px] text-slate-500 shrink-0 font-bold">
                <span>120pie&coffee 본사 전담 컨설팅 사업본부</span>
                <span>120pie-new.vercel.app</span>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Slide Navigation Controls */}
      <footer className="w-full max-w-[1560px] mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0 text-slate-500 z-10 border-t border-slate-200">
        <div className="text-[11px] font-bold flex items-center gap-1.5 text-slate-600">
          <Info size={14} className="text-[#bf3e67]" />
          <span>키보드 방향키 <kbd className="bg-slate-100 px-1 py-0.5 rounded-none border border-slate-300 font-bold mx-0.5">←</kbd> <kbd className="bg-slate-100 px-1 py-0.5 rounded-none border border-slate-300 font-bold mx-0.5">→</kbd> 키로도 슬라이드를 넘길 수 있습니다.</span>
        </div>
        
        <div className="flex items-center gap-1.5 flex-wrap justify-center">
          {Array.from({ length: totalSlides }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentSlide(idx);
                setIsPlaying(false);
              }}
              className={`w-3.5 h-3.5 border-2 border-[#1a1a1a] transition-all rounded-none ${
                currentSlide === idx ? "bg-[#ffd500] w-7" : "bg-white hover:bg-slate-100"
              }`}
            ></button>
          ))}
        </div>
      </footer>
    </div>
  );
}
