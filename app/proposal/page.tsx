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
  Store, 
  Coffee, 
  TrendingUp, 
  Layers, 
  Clock, 
  HelpCircle,
  FileText
} from "lucide-react";
import Link from "next/link";

export default function ProposalDeck() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    storeType: "샵인샵 도입",
    existingStoreName: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const addInquiryMutation = useMutation(api.inquiries.add);

  const totalSlides = 3;

  // Autoplay function
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
      }, 5000); // Change slide every 5 seconds
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
        message: formData.message || "제안서 페이지를 통한 상담 신청",
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

  return (
    <div className="min-h-screen bg-[#0d1627] text-white flex flex-col font-sans select-none antialiased overflow-x-hidden relative">
      {/* Dynamic Background Blurs */}
      <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-[#f25f8a]/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-[#ffd500]/10 blur-[150px] pointer-events-none"></div>

      {/* Top Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-4 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-3">
          <Link 
            href="/"
            className="flex items-center gap-2 text-xs font-bold bg-white/5 border border-white/10 hover:bg-white/10 px-3 py-1.5 rounded-full transition-all text-[#73839c] hover:text-white"
          >
            <ArrowLeft size={14} />
            <span>홈으로 가기</span>
          </Link>
          <div className="h-4 w-px bg-white/10 hidden sm:block"></div>
          <span className="text-xs font-semibold tracking-wider text-[#ffd500] uppercase hidden sm:block">
            120pie & coffee B2B Proposal
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center bg-white/5 border border-white/10 rounded-full px-1 py-1">
            <button 
              onClick={handlePrev} 
              className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-[11px] font-bold px-3 text-slate-300">
              {currentSlide + 1} / {totalSlides}
            </span>
            <button 
              onClick={handleNext} 
              className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`p-2 rounded-full border transition-all flex items-center justify-center ${
              isPlaying 
                ? "bg-[#f25f8a]/20 border-[#f25f8a]/30 text-[#f25f8a]" 
                : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
            }`}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          </button>
        </div>
      </header>

      {/* Slide Deck Area (Strict 16:9 Aspect Ratio) */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8 z-10">
        <div className="w-full max-w-6xl aspect-video rounded-3xl bg-[#131d30]/80 border border-white/5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden relative flex flex-col transition-all duration-300">
          
          {/* SLIDE 1: Hero Cover */}
          {currentSlide === 0 && (
            <div className="absolute inset-0 p-8 sm:p-12 md:p-16 flex flex-col justify-between bg-gradient-to-br from-[#131d30] via-[#101a2c] to-[#162740] animate-fadeIn">
              {/* Badge & Branding */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#f25f8a]"></span>
                  <span className="text-xs sm:text-sm font-bold tracking-widest text-white">120pie & coffee</span>
                </div>
                <span className="text-[10px] sm:text-xs font-semibold px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-400">
                  샵인샵 도입 제안서
                </span>
              </div>

              {/* Main Titles */}
              <div className="space-y-4 sm:space-y-6 max-w-3xl my-auto">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-[#ffd500]">
                  커피 손님은 그대로,<br />
                  디저트 매출은 새롭게.
                </h1>
                <p className="text-xs sm:text-sm md:text-base text-slate-400 font-medium leading-relaxed">
                  간판을 바꾸지 않아도, 단 작은 공간과 5분의 조리 시간이면 충분합니다.<br />
                  전국 287개 이상 가맹점 경험으로 증명된 120겹 파이 솔루션으로 확실한 디저트 시너지를 더하세요.
                </p>
                
                {/* Hashtags */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {["#120겹파이", "#5분조리", "#냉동생지", "#홀·포장·배달"].map((tag, idx) => (
                    <span 
                      key={idx} 
                      className="text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 text-[#f25f8a]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Performance Indicator Grid */}
              <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-6 mt-auto">
                <div className="space-y-1">
                  <div className="text-[10px] sm:text-xs font-extrabold text-slate-500 uppercase tracking-wider">조리 시간</div>
                  <div className="text-lg sm:text-xl md:text-2xl font-black text-white flex items-center gap-1.5">
                    <Clock size={16} className="text-[#ffd500]" />
                    <span>5분 내외</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] sm:text-xs font-extrabold text-slate-500 uppercase tracking-wider">가맹점 노하우</div>
                  <div className="text-lg sm:text-xl md:text-2xl font-black text-white flex items-center gap-1.5">
                    <Store size={16} className="text-[#f25f8a]" />
                    <span>287개점+</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] sm:text-xs font-extrabold text-slate-500 uppercase tracking-wider">최고 매출 증대</div>
                  <div className="text-lg sm:text-xl md:text-2xl font-black text-white flex items-center gap-1.5">
                    <TrendingUp size={16} className="text-emerald-400" />
                    <span>300% 달성</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 2: Pain Points & Menu & Operation */}
          {currentSlide === 1 && (
            <div className="absolute inset-0 p-8 sm:p-12 md:p-12 flex flex-col justify-between bg-gradient-to-br from-[#111a2a] via-[#101826] to-[#142238] animate-fadeIn">
              
              {/* Header */}
              <div className="flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-[#ffd500] font-black text-sm tracking-widest">02</span>
                  <h2 className="text-base sm:text-lg font-extrabold text-white">매장에 딱 맞는 운영 방식 & 메뉴</h2>
                </div>
                <span className="text-[10px] sm:text-xs font-bold text-slate-400">조리 기술 없이 5분이면 완성</span>
              </div>

              {/* Main split grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-auto items-stretch overflow-hidden">
                {/* Left Side: Owner's pain points */}
                <div className="bg-white/5 rounded-2xl border border-white/5 p-4 sm:p-5 flex flex-col justify-between space-y-4">
                  <div className="text-xs sm:text-sm font-bold text-[#f25f8a] flex items-center gap-2 border-b border-white/5 pb-2">
                    <HelpCircle size={15} />
                    <span>음료 판매의 한계를 부수는 디저트 대안</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <span className="text-[10px] font-black text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded h-fit">01</span>
                      <p className="text-[11px] sm:text-xs text-slate-300 font-medium">
                        <strong className="text-white block mb-0.5">낮은 객단가 해소</strong>
                        커피 한 잔에 즉석 120겹 파이를 함께 제안하여 세트 주문과 객단가를 대폭 높입니다.
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-[10px] font-black text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded h-fit">02</span>
                      <p className="text-[11px] sm:text-xs text-slate-300 font-medium">
                        <strong className="text-white block mb-0.5">재고 및 폐기 제로</strong>
                        냉동 생지 보관 상태에서 주문 시 필요한 만큼만 5분 오븐 조리하므로 당일 폐기 부담이 없습니다.
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-[10px] font-black text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded h-fit">03</span>
                      <p className="text-[11px] sm:text-xs text-slate-300 font-medium">
                        <strong className="text-white block mb-0.5">검증된 대표 메뉴</strong>
                        고기파이, 계란빵(egg120), 츄러스 등 배달 앱과 매장 내에서 가장 반응이 빠른 베스트 메뉴 구성.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Side: Menu line up & 3-step operation */}
                <div className="bg-white/5 rounded-2xl border border-white/5 p-4 sm:p-5 flex flex-col justify-between space-y-4">
                  <div className="text-xs sm:text-sm font-bold text-[#ffd500] flex items-center gap-2 border-b border-white/5 pb-2">
                    <Layers size={15} />
                    <span>3단계 운영 프로세스 & 메뉴</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5 text-center">
                    <div className="bg-[#17253d] border border-white/5 p-2 rounded-xl">
                      <span className="text-[9px] font-extrabold text-[#f25f8a] block">STEP 01</span>
                      <span className="text-[10px] sm:text-[11px] font-black text-white block mt-1">생지 냉동보관</span>
                      <span className="text-[9px] text-slate-400 block mt-0.5">필요 수량만 준비</span>
                    </div>
                    <div className="bg-[#17253d] border border-white/5 p-2 rounded-xl">
                      <span className="text-[9px] font-extrabold text-[#f25f8a] block">STEP 02</span>
                      <span className="text-[10px] sm:text-[11px] font-black text-white block mt-1">즉석 오븐 조리</span>
                      <span className="text-[9px] text-slate-400 block mt-0.5">5분 타이머 작동</span>
                    </div>
                    <div className="bg-[#17253d] border border-white/5 p-2 rounded-xl">
                      <span className="text-[9px] font-extrabold text-[#f25f8a] block">STEP 03</span>
                      <span className="text-[10px] sm:text-[11px] font-black text-white block mt-1">갓 구운 파이 제공</span>
                      <span className="text-[9px] text-slate-400 block mt-0.5">커피와 꿀조합</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px] sm:text-xs">
                      <span className="font-bold text-white">🥐 시그니처 120파이</span>
                      <span className="text-slate-400">고기파이, 애플파이, 피자파이 등</span>
                    </div>
                    <div className="flex justify-between text-[11px] sm:text-xs">
                      <span className="font-bold text-white">🥚 에그120 계란빵</span>
                      <span className="text-slate-400">부드러운 계란빵과 토핑 꿀조합</span>
                    </div>
                    <div className="flex justify-between text-[11px] sm:text-xs">
                      <span className="font-bold text-white">🍡 사이드 메뉴군</span>
                      <span className="text-slate-400">츄러스, 핫도그, 사이드 떡볶이</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Feature Grid */}
              <div className="grid grid-cols-4 gap-2 border-t border-white/5 pt-4 mt-auto text-center shrink-0">
                {["공간 절약", "5분 조리", "재고 제로", "객단가 증대"].map((feat, idx) => (
                  <div key={idx} className="bg-white/5 border border-white/5 py-1.5 px-2 rounded-xl text-[10px] sm:text-xs font-bold text-slate-300">
                    ✨ {feat}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SLIDE 3: Expected Profit & Application Form */}
          {currentSlide === 2 && (
            <div className="absolute inset-0 p-8 sm:p-12 md:p-12 flex flex-col justify-between bg-gradient-to-br from-[#121c2d] via-[#0f1826] to-[#182a45] animate-fadeIn">
              
              {/* Header */}
              <div className="flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-[#ffd500] font-black text-sm tracking-widest">03</span>
                  <h2 className="text-base sm:text-lg font-extrabold text-white">기대 수익 및 무료 상담 신청</h2>
                </div>
                <span className="text-[10px] sm:text-xs font-bold text-[#f25f8a]">가장 가볍고 리스크 없는 샵인샵</span>
              </div>

              {/* Main split grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-auto items-stretch overflow-hidden">
                {/* Left Side: ROI and Steps */}
                <div className="flex flex-col justify-between space-y-4">
                  {/* ROI Widget */}
                  <div className="bg-gradient-to-tr from-[#f25f8a]/10 to-[#ffd500]/5 border border-white/5 p-4 rounded-2xl space-y-2">
                    <div className="text-[10px] sm:text-xs font-extrabold text-[#f25f8a] uppercase tracking-wider">하루 20개 판매 가정 시</div>
                    <div className="text-2xl sm:text-3xl font-black text-[#ffd500] tracking-tight">
                      월 추가 매출 +2,340,000원
                    </div>
                    <p className="text-[10px] text-slate-500 leading-relaxed">
                      ※ 20개 × 평균가 4,500원 × 월 26일 영업 기준. 장비/오븐 등 최소한의 필수 기물 세팅만으로 인테리어 전면 수정 없이 곧바로 개시할 수 있어 회수 속도가 아주 빠릅니다.
                    </p>
                  </div>

                  {/* Steps */}
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-white">4단계 도입 프로세스</div>
                    <div className="grid grid-cols-4 gap-1.5 text-center">
                      <div className="bg-white/5 py-2 px-1 rounded-xl border border-white/5">
                        <span className="text-[9px] font-extrabold text-[#ffd500] block">STEP 1</span>
                        <span className="text-[10px] font-bold text-white block mt-0.5">상담 및 설계</span>
                      </div>
                      <div className="bg-white/5 py-2 px-1 rounded-xl border border-white/5">
                        <span className="text-[9px] font-extrabold text-[#ffd500] block">STEP 2</span>
                        <span className="text-[10px] font-bold text-white block mt-0.5">장비 세팅</span>
                      </div>
                      <div className="bg-white/5 py-2 px-1 rounded-xl border border-white/5">
                        <span className="text-[9px] font-extrabold text-[#ffd500] block">STEP 3</span>
                        <span className="text-[10px] font-bold text-white block mt-0.5">시범 조리</span>
                      </div>
                      <div className="bg-white/5 py-2 px-1 rounded-xl border border-white/5">
                        <span className="text-[9px] font-extrabold text-[#ffd500] block">STEP 4</span>
                        <span className="text-[10px] font-bold text-white block mt-0.5">정식 판매</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side: Inquiry Contact Form */}
                <div className="bg-white/5 rounded-2xl border border-white/10 p-5 relative overflow-hidden flex flex-col justify-center">
                  {submitSuccess ? (
                    <div className="text-center py-6 space-y-4 animate-scaleUp">
                      <div className="inline-flex w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full items-center justify-center">
                        <CheckCircle2 size={24} />
                      </div>
                      <div className="space-y-1.5">
                        <h4 className="text-sm sm:text-base font-black text-white">무료 상담 신청 완료!</h4>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          기재해 주신 정보로 본사 샵인샵 전담 실장이<br />
                          빠른 시일 내로 연락드려 맞춤 안내해 드리겠습니다.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setSubmitSuccess(false);
                          setFormData({ name: "", phone: "", storeType: "샵인샵 도입", existingStoreName: "", message: "" });
                        }}
                        className="text-[11px] text-[#ffd500] font-bold hover:underline"
                      >
                        다른 문의 접수하기
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleFormSubmit} className="space-y-3.5">
                      <div className="text-xs sm:text-sm font-bold text-white border-b border-white/5 pb-1.5 flex items-center justify-between">
                        <span>도입 의사 타진 및 무료 상담</span>
                        <span className="text-[10px] text-[#f25f8a] font-medium">실시간 디스코드 알림 접수</span>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 block">성함 / 담당자명</label>
                          <input
                            type="text"
                            placeholder="성함 입력"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            className="w-full bg-[#182337] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#ffd500] transition-colors"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 block">연락처</label>
                          <input
                            type="text"
                            placeholder="전화번호 입력"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            required
                            className="w-full bg-[#182337] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#ffd500] transition-colors"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 block">신청 유형</label>
                          <select
                            value={formData.storeType}
                            onChange={(e) => setFormData({ ...formData, storeType: e.target.value })}
                            className="w-full bg-[#182337] border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-[#ffd500] transition-colors"
                          >
                            <option value="샵인샵 도입">기존 매장 샵인샵 도입</option>
                            <option value="신규 하이브리드 창업">신규 매장 창업</option>
                            <option value="단품 오븐기 지원">장비/생지 유통 문의</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 block">기존 매장명 (선택)</label>
                          <input
                            type="text"
                            placeholder="운영중인 매장 이름"
                            value={formData.existingStoreName}
                            onChange={(e) => setFormData({ ...formData, existingStoreName: e.target.value })}
                            className="w-full bg-[#182337] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#ffd500] transition-colors"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 block">간단 질문 / 상담 희망사항</label>
                        <input
                          type="text"
                          placeholder="예: 장비 크기, 월 예상 마진, 도입 절차 등"
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          className="w-full bg-[#182337] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#ffd500] transition-colors"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-tr from-[#ffd500] to-[#ffc400] text-[#0d1627] font-black text-xs py-2.5 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md mt-1"
                      >
                        {isSubmitting ? "신청 등록 중..." : "무료 상담 신청하기 (5초 완료)"}
                      </button>
                    </form>
                  )}
                </div>
              </div>

              {/* Footer Banner */}
              <div className="flex justify-between items-center border-t border-white/5 pt-4 mt-auto text-[10px] text-slate-500 shrink-0">
                <span>120pie&coffee 본사 전담 컨설팅 사업부</span>
                <span className="text-[#ffd500] font-bold">120pie-new.vercel.app</span>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Slide Navigation Controls */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between shrink-0 text-slate-400 z-10">
        <div className="text-[10px] sm:text-xs">
          * 키보드 방향키 <kbd className="bg-white/5 px-1 py-0.5 rounded border border-white/10 font-bold mx-0.5">←</kbd> <kbd className="bg-white/5 px-1 py-0.5 rounded border border-white/10 font-bold mx-0.5">→</kbd> 키로도 슬라이드 이동이 가능합니다.
        </div>
        
        <div className="flex items-center gap-1.5">
          {Array.from({ length: totalSlides }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentSlide(idx);
                setIsPlaying(false);
              }}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                currentSlide === idx ? "bg-[#ffd500] w-6" : "bg-white/25 hover:bg-white/40"
              }`}
            ></button>
          ))}
        </div>
      </footer>
    </div>
  );
}
