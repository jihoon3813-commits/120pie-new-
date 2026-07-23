"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Menu, X, Sparkles, CheckCircle2, Check, DollarSign, ChevronRight
} from "lucide-react";
import { useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { optimizeCloudinaryUrl } from "@/app/utils/cloudinary";
import { triggerConsultationSms } from "@/app/utils/sms";
import ConsultationForm from "@/components/ConsultationForm";
import Footer from "@/app/components/Footer";
import RightFloatingQuickBar from "@/components/RightFloatingQuickBar";

// Cloudinary assets with f_auto,q_auto
const LOGO_URL = optimizeCloudinaryUrl("https://res.cloudinary.com/lyjyvy54/image/upload/v1784533894/Group_1_4_jl4rlr.png");
const HERO_BG = optimizeCloudinaryUrl("https://res.cloudinary.com/lyjyvy54/image/upload/v1784555995/8ebfb55d-2779-4bba-a676-c4c7c3dbedb9.png");
const PIE_FEATURE_IMG = optimizeCloudinaryUrl("https://res.cloudinary.com/lyjyvy54/image/upload/v1784557545/%EC%A0%9C%EB%AA%A9%EC%9D%84_%EC%9E%85%EB%A0%A5%ED%95%B4%EC%A3%BC%EC%84%B8%EC%9A%94._12_1_qui5uq.png");
const EGG_FEATURE_IMG = optimizeCloudinaryUrl("https://res.cloudinary.com/lyjyvy54/image/upload/v1784594966/2_1_vrp1nm.png");
const CHURROS_FEATURE_IMG = optimizeCloudinaryUrl("https://res.cloudinary.com/lyjyvy54/image/upload/v1784595523/3_1_1_rvgru7.png");

// Franchise Models
const FRANCHISE_MODELS = [
  {
    title: "기존 카페 샵인샵 도입",
    badge: "무자본 샵인샵",
    desc: "기존 머신과 시설 그대로 120겹 파이 메뉴 라인업을 탑재하여 매출 2배 극대화",
    features: [
      "기존 커피 기기 및 동선 100% 그대로 활용",
      "복잡한 주방 설비 추가 없이 3분 오븐 조리",
      "도입 즉시 디저트 배달 랭킹 진입"
    ],
    highlight: "초기 투자 최소화"
  },
  {
    title: "1인 소자본 업종변경",
    badge: "1인 소자본 창업",
    desc: "과도한 인건비 부담 없이 점주 1인이 완벽 가동 가능한 고마진 콤팩트 매장",
    features: [
      "본사 콜드체인 완제/반완제 생지 파스 공급",
      "피크타임 3분 완성으로 회전율 최고조",
      "인건비 절감으로 순이익률 극대화"
    ],
    highlight: "빠른 회수 / high-margin"
  },
  {
    title: "배달 & 포장 특화 카페",
    badge: "실속형 독립 매장",
    desc: "소형 평수 상권 입점으로 임대료 부담을 줄이고 테이크아웃 및 배달 단체주문 장악",
    features: [
      "학원가·오피스 단체 간식 세트 주문 비중 높음",
      "선물용 고급 패키징 테이크아웃 수요 견인",
      "홀+포장+배달 3중 수익 구조"
    ],
    highlight: "안정적 다각화 수익"
  }
];

// Success Stories
const SUCCESS_STORIES = [
  {
    name: "A 매장 (대학가 샵인샵)",
    increase: "일 매출 45만 원 증가",
    quote: "음료 위주 개인 카페였으나 120겹 파이 도입 후 세트 주문이 폭발해 객단가와 마진을 동시에 잡았습니다."
  },
  {
    name: "B 매장 (1인 소자본 창업)",
    increase: "6개월 만에 창업비 회수",
    quote: "치킨집 운영 중 120PIE 콤팩트 카페로 업종 변경 후, 노동 강도는 1/3로 줄고 마진은 훨씬 높아졌습니다."
  },
  {
    name: "C 매장 (배달&포장 특화)",
    increase: "평균 주문단가 2.2만원",
    quote: "학교, 기업 단체 간식 주문이 월 15회 이상 들어옵니다. 포장 패키지가 고급스러워 선물 수요도 커요."
  }
];

// Process steps
const PROCESS_STEPS = [
  { step: "01", title: "창업 상담 접수", desc: "1:1 전문 가맹 지원팀의 상권 및 예산 무료 맞춤 상담" },
  { step: "02", title: "상권 분석 및 입지 선정", desc: "빅데이터 기반 전문 상권 분석으로 최적 입지 제안" },
  { step: "03", title: "가맹 계약 체결", desc: "투명하고 합리적인 조건의 가맹 계약 체결" },
  { step: "04", title: "인테리어 & 교육", desc: "표준 시공 및 누구나 손쉬운 3분 조리 매뉴얼 집중 교육" },
  { step: "05", title: "시운전 & 오픈 준공", desc: "본사 슈퍼바이저 현장 밀착 지원 및 오픈 테스트" },
  { step: "06", title: "그랜드 오픈 & 사후관리", desc: "오픈 마케팅 지원 및 주기적 슈퍼바이징 사후 지원" }
];

// Transparent Package Cost Data
const PACKAGE_COST_TABS = [
  {
    id: "120pie",
    label: "샵인샵 (120pie)",
    subLabel: "디저트 단일 라인업 추가 패키지",
    packageName: "120겹파이 올인원 패키지 도입 비용",
    normalPrice: "정가 5,500,000원",
    discountPrice: "440",
    unit: "만원",
    detailTitle: "120겹파이 올인원 패키지 상세 구성",
    items: [
      { cat: "전용 베이킹 인프라", content: "자체 금형 오리지널 파이 머신 1ea", note: "120겹 파이 결을 살리는 전용 베이킹 머신" },
      { cat: "초도 원재료 패키지", content: "시그니처 패스트리 생지 1box + 프리미엄 필링 9종 각 1kg", note: "파이 약 200개 분량 생지와 대표 맛 필링 초도 지원" },
      { cat: "매장 홍보물 세트", content: "공식 X배너 2종 + POP 5종 + 메뉴 홍보 포스터 8종", note: "매장 내외부 고객 시선을 끌기 위한 홍보물 구성" },
      { cat: "판매 촉진 비주얼 세트", content: "파이 모형 4종 + 배달 플랫폼용 실사 이미지", note: "오프라인 진열과 배달앱 등록에 활용 가능한 비주얼 자료" },
      { cat: "운영 정착 지원", content: "포장 부자재 세트 + 오븐 설치 및 1:1 조리 교육", note: "포장 운영, 장비 세팅, 현장 조리 교육까지 지원" }
    ]
  },
  {
    id: "egg120",
    label: "샵인샵 (egg120)",
    subLabel: "계란빵 단일 라인업 추가 패키지",
    packageName: "egg120 프리미엄 타르트 패키지 도입 비용",
    normalPrice: "정가 4,400,000원",
    discountPrice: "330",
    unit: "만원",
    detailTitle: "egg120 프리미엄 타르트 패키지 상세 구성",
    items: [
      { cat: "전용 베이킹 인프라", content: "에그120 계란빵 전용 머신 1대 (10구 동시 생산)", note: "온도센서/타이머 탑재, 1.3kw 초절전 설계" },
      { cat: "초도 원재료 패키지", content: "특제 쌀 반죽 30kg + 동물복지 유황란 120ea", note: "완성 계란빵 약 720개 조리 대용량 반죽 공급" },
      { cat: "프리미엄 토핑 패키지", content: "스팸 1kg + 커스터드 믹스 1kg + 콘버터 1kg + 베이컨 1kg", note: "에그120만의 시그니처 4대 맛 토핑 지원" },
      { cat: "매장 홍보물 & 비주얼", content: "공식 X배너 + POP 메뉴판 + 실물 파이크모형 4종 & 투명 쇼케이스", note: "카운터 배달앱 셋업 및 오프라인 전시물 일체" },
      { cat: "운영 정착 지원", content: "전용 포장 부자재 + 엔지니어 출장 설치 & 1:1 조리 교육", note: "기기 세팅부터 조리 노하우까지 밀착 지원" }
    ]
  },
  {
    id: "pie_egg",
    label: "샵인샵 (pie & egg)",
    subLabel: "파이와 계란빵 듀얼 패키지",
    packageName: "120겹파이 & egg120 듀얼 결합 패키지 도입 비용",
    normalPrice: "정가 7,700,000원",
    discountPrice: "660",
    unit: "만원",
    detailTitle: "120겹파이 & egg120 듀얼 패키지 상세 구성",
    items: [
      { cat: "전용 베이킹 인프라", content: "오리지널 파이 머신 1ea + 계란빵 전용 머신 1대", note: "파이와 계란빵 동시 베이킹 인프라 풀 세트" },
      { cat: "초도 원재료 패키지", content: "파이 생지 1box + 필링 9종 + 계란빵 반죽 30kg + 유황란 120ea", note: "두 시그니처 메뉴 라인업의 초도 원재료 일체 지원" },
      { cat: "매장 홍보물 세트", content: "통합 X배너 + 카운터 POP 10종 + 시그니처 포스터 11종", note: "디저트 듀얼 매장 특화 통합 디자인 홍보물" },
      { cat: "판매 촉진 비주얼 세트", content: "파이/계란빵 실물 모형 8종 + 배달앱 듀얼 셋업 전용 이미지", note: "배달의민족/쿠팡이츠 디저트 랭킹 1위 최적화" },
      { cat: "운영 정착 지원", content: "듀얼 포장 부자재 풀 세트 + 현장 출장 오븐 셋팅 & 1:1 집중 마스터 교육", note: "1인 운영 최적화 3분 조리 교육" }
    ]
  },
  {
    id: "hybrid",
    label: "하이브리드 창업",
    subLabel: "기존 매장 활용 업종 전환 모델",
    packageName: "기존 매장 인프라 활용 하이브리드 리모델링",
    normalPrice: "상담 문의",
    discountPrice: "맞춤형",
    unit: "견적",
    detailTitle: "하이브리드 업종 전환 창업 상세 지원",
    items: [
      { cat: "기초 설비 연용", content: "기존 머신 및 주방 기기 100% 재활용", note: "불필요한 인테리어 재시공 비용 최소화" },
      { cat: "간판 & 브랜드 교체", content: "120PIE 공식 간판 및 파사드 익스테리어 부분 리모델링", note: "최소 비용으로 신규 브랜드 전환 효과" },
      { cat: "본사 콜드체인 연동", content: "3분 간편 조리 생지 및 메뉴 레시피 전수", note: "인건비 감소 및 주방 회전율 상승" }
    ]
  },
  {
    id: "new_store",
    label: "신규 가맹 창업",
    subLabel: "15평 기준 표준 가맹 개설 모델",
    packageName: "120PIE 독점 카페형 풀 패키지 창업",
    normalPrice: "상담 문의",
    discountPrice: "표준",
    unit: "플랜",
    detailTitle: "신규 가맹 매장 표준 개설 가이드",
    items: [
      { cat: "상권 & 입지 선정", content: "빅데이터 기반 전국 1급 상권 입지 분석 및 점포 개발", note: "유동인구 및 배달 타겟밀집지역 우선 개발" },
      { cat: "인테리어 스펙", content: "15평 표준 프리미엄 테이크아웃 & 홀 인테리어 시공", note: "감성적인 감각과 트렌디한 공간 연출" },
      { cat: "본사 밀착 슈퍼바이징", content: "그랜드 오픈 현장 마케팅 및 슈퍼바이저 밀착 지원", note: "안정적인 오픈 매출 달성 관리" }
    ]
  }
];

// Shinhan Slim Installment Cards
const SHINHAN_CARD_INSTALLMENTS = [
  {
    id: "120pie",
    title: "샵인샵 (120pie)",
    subtitle: "디저트 단일 라인업 추가 패키지",
    features: [
      "120겹파이 베이커리 샵인샵 도입 최적화",
      "본사 이자 10% 다이렉트 지원 적용",
      "하루 약 3,300원으로 고효율 디저트 라인업 추가"
    ],
    normalRate: "20%",
    supportRate: "-10%",
    finalRate: "10%",
    totalPrice: "480만원",
    monthlyPrice: "100,000원"
  },
  {
    id: "egg120",
    title: "샵인샵 (egg120)",
    subtitle: "계란빵 단일 라인업 추가 패키지",
    features: [
      "egg120 프리미엄 쌀 계란빵 패키지",
      "본사 이자 10% 지원으로 이자 부담 반감",
      "월 7만 5천원으로 안정적인 시그니처 메뉴 확보"
    ],
    normalRate: "20%",
    supportRate: "-10%",
    finalRate: "10%",
    totalPrice: "360만원",
    monthlyPrice: "75,000원"
  },
  {
    id: "pie_egg",
    title: "샵인샵 (pie & egg)",
    subtitle: "파이와 계란빵 듀얼 결합 패키지",
    features: [
      "파이와 계란빵 듀얼 결합 패키지",
      "본사 이자 10% 지원 혜택",
      "듀얼 라인업으로 매장 디저트 매출 3배 상승 효과"
    ],
    normalRate: "20%",
    supportRate: "-10%",
    finalRate: "10%",
    totalPrice: "720만원",
    monthlyPrice: "150,000원"
  }
];

export default function BrandFranchisePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isConsulting, setIsConsulting] = useState(false);
  const [selectedPlanTab, setSelectedPlanTab] = useState<"8py" | "10py">("8py");
  const [activePriceTab, setActivePriceTab] = useState<string>("120pie");

  // Inquiry Form state inside page
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    storeType: "신규 소자본 창업",
    existingStoreName: "",
    message: ""
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addInquiry = useMutation(api.inquiries.add);
  const sendSmsAction = useAction(api.aligo.sendSms);

  const formatPhoneNumber = (val: string) => {
    const raw = val.replace(/[^\d]/g, "");
    if (raw.length <= 3) return raw;
    if (raw.length <= 7) return `${raw.slice(0, 3)}-${raw.slice(3)}`;
    return `${raw.slice(0, 3)}-${raw.slice(3, 7)}-${raw.slice(7, 11)}`;
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      alert("성함과 연락처를 입력해주세요.");
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

      // Send Aligo SMS alert silently
      try {
        await triggerConsultationSms(
          sendSmsAction,
          formData.name,
          formData.phone,
          formData.storeType
        );
      } catch (smsErr) {
        console.error("SMS notification failed:", smsErr);
      }

      setFormSubmitted(true);
      setFormData({
        name: "",
        phone: "",
        storeType: "신규 소자본 창업",
        existingStoreName: "",
        message: ""
      });
    } catch (err) {
      console.error("Inquiry error:", err);
      alert("문의 접수 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-neutral-900 font-sans">
      {/* 1. BRAND NAVIGATION HEADER */}
      <header className="sticky top-0 z-50 transition-all duration-300 backdrop-blur-md bg-white/95 py-3 border-b border-neutral-100 shadow-sm isolate">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
          {/* Logo */}
          <Link href="/" title="게이트 페이지로 이동" className="flex items-center gap-2 group shrink-0">
            <img
              src={LOGO_URL}
              alt="120pie 로고"
              className="h-[22px] md:h-[26px] w-auto object-contain transition-transform duration-300 group-hover:scale-102"
            />
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-10 font-medium text-[16px] text-neutral-700">
            <Link href="/brand/story" className="hover:text-amber-600 transition-colors whitespace-nowrap">
              브랜드 소개
            </Link>
            <Link href="/brand/menu" className="hover:text-amber-600 transition-colors whitespace-nowrap">
              메뉴 소개
            </Link>
            <Link href="/stores" className="hover:text-amber-600 transition-colors whitespace-nowrap">
              매장 찾기
            </Link>
            <Link href="/brand/franchise" className="hover:text-amber-600 transition-colors whitespace-nowrap">
              창업 안내
            </Link>
          </nav>

          {/* Right Header Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link
              href="/franchise"
              className="px-3 py-1.5 sm:px-4 sm:py-2 bg-neutral-950 text-[#fbc400] font-black text-xs rounded-full transition-all duration-300 shadow-xs hover:bg-black border border-neutral-800 cursor-pointer whitespace-nowrap"
            >
              창업홈페이지 바로가기 &rarr;
            </Link>
            <Link
              href="/portal"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-block px-3 py-1.5 sm:px-4 sm:py-2 bg-white text-neutral-800 hover:text-neutral-950 font-bold text-xs rounded-full transition-all border border-neutral-200 hover:border-neutral-400 cursor-pointer whitespace-nowrap"
            >
              점주 전용
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 text-neutral-700 hover:text-amber-600 transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE NAVIGATION OVERLAY */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[57px] z-[9999] bg-white text-neutral-900 flex flex-col justify-between p-6 sm:p-8 md:hidden animate-fadeIn h-[calc(100vh-57px)] overflow-y-auto shadow-2xl border-t border-neutral-100">
          <nav className="flex flex-col space-y-1 font-bold text-lg text-neutral-900 text-left">
            <Link 
              href="/brand/story" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-4 border-b border-neutral-100 hover:text-amber-600 transition-colors text-left flex items-center justify-between font-extrabold text-lg text-neutral-900"
            >
              <span>브랜드 소개</span>
              <ChevronRight size={18} className="text-neutral-400" />
            </Link>
            <Link 
              href="/brand/menu" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-4 border-b border-neutral-100 hover:text-amber-600 transition-colors text-left flex items-center justify-between font-extrabold text-lg text-neutral-900"
            >
              <span>메뉴 소개</span>
              <ChevronRight size={18} className="text-neutral-400" />
            </Link>
            <Link 
              href="/stores" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-4 border-b border-neutral-100 hover:text-amber-600 transition-colors text-left flex items-center justify-between font-extrabold text-lg text-neutral-900"
            >
              <span>매장 찾기</span>
              <ChevronRight size={18} className="text-neutral-400" />
            </Link>
            <Link
              href="/brand/franchise"
              onClick={() => setMobileMenuOpen(false)}
              className="py-4 border-b border-neutral-100 hover:text-amber-600 transition-colors text-left flex items-center justify-between font-extrabold text-lg text-neutral-900"
            >
              <span>창업 안내</span>
              <ChevronRight size={18} className="text-neutral-400" />
            </Link>
          </nav>
          <div className="pt-6 border-t border-neutral-100">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsConsulting(true);
              }}
              className="w-full py-4 bg-[#fbc400] hover:bg-[#e0a800] text-[#0D233A] font-extrabold text-center rounded-2xl text-base transition-colors shadow-md block border-0 cursor-pointer"
            >
              창업 상담 문의하기
            </button>
          </div>
        </div>
      )}

      {/* 2. HERO SECTION */}
      <section className="relative w-full bg-neutral-950 text-white py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-cover bg-center pointer-events-none" style={{ backgroundImage: `url('${HERO_BG}')` }} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#fbc400]/20 border border-[#fbc400]/40 text-[#fbc400] text-xs font-bold tracking-widest uppercase mb-6">
            <Sparkles size={14} /> 120PIE FRANCHISE GUIDE
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-6">
            소자본 & 샵인샵으로 완성하는<br />
            <span className="text-[#fbc400]">독보적 고수익 디저트 창업</span>
          </h1>
          <p className="text-neutral-300 text-base sm:text-lg max-w-2xl mx-auto font-normal leading-relaxed mb-8">
            40년 장인 노하우의 120겹 수제파이와 특허받은 리얼 계란빵.<br className="hidden sm:block" />
            초기 가맹비·교육비·로열티 0원 혜택으로 점주님의 성공 정착을 지원합니다.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="#inquiry"
              className="w-full sm:w-auto px-8 py-4 bg-[#fbc400] hover:bg-[#e0a800] text-neutral-950 font-extrabold text-base rounded-full shadow-lg transition-transform hover:scale-105 text-center decoration-none"
            >
              무료 창업 상담 신청하기
            </a>
            <a
              href="#benefits"
              className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-base rounded-full transition-colors text-center decoration-none"
            >
              창업 혜택 한눈에 보기
            </a>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 pt-10 border-t border-white/10 max-w-4xl mx-auto">
            <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <p className="text-xs text-neutral-400 font-medium">초기 가맹비 / 교육비</p>
              <p className="text-xl sm:text-2xl font-black text-[#fbc400] mt-1">0원 한정 지원</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <p className="text-xs text-neutral-400 font-medium">조리 시간</p>
              <p className="text-xl sm:text-2xl font-black text-white mt-1">단 3분 간편 조리</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <p className="text-xs text-neutral-400 font-medium">운영 인력</p>
              <p className="text-xl sm:text-2xl font-black text-[#fbc400] mt-1">1인 운영 최적화</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <p className="text-xs text-neutral-400 font-medium">월 로열티</p>
              <p className="text-xl sm:text-2xl font-black text-white mt-1">평생 0원 면제</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. BRAND ADVANTAGES SECTION */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-amber-600 tracking-widest uppercase mb-2">WHY 120PIE</h2>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 leading-tight">
              왜 120PIE가 창업 성공의<br className="sm:hidden" /> 확실한 대안일까요?
            </h3>
            <p className="text-neutral-600 text-sm sm:text-base mt-3">
              단순한 유행성 디저트가 아닙니다. 압도적 제품력과 검증된 수익 시스템이 결합되었습니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-[#faf8f5] rounded-3xl p-8 border border-neutral-200/80 hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600 mb-6 font-bold text-xl">
                  01
                </div>
                <div className="h-44 rounded-2xl overflow-hidden mb-6 bg-neutral-200">
                  <img src={PIE_FEATURE_IMG} alt="120겹 수제파이" className="w-full h-full object-cover" />
                </div>
                <h4 className="text-xl font-bold text-neutral-900 mb-3">40년 장인의 120겹 수제파이</h4>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  결 하나하나 바삭하게 살아 숨 쉬는 120겹의 페이스트리 기술로 타 브랜드가 감히 모방할 수 없는 절대적 식감과 풍미를 선사합니다.
                </p>
              </div>
              <ul className="mt-6 space-y-2 border-t border-neutral-200/80 pt-4 text-xs font-medium text-neutral-700">
                <li className="flex items-center gap-2"><Check className="text-amber-500" size={14} /> 식사 대용 미트파이부터 디저트파이까지</li>
                <li className="flex items-center gap-2"><Check className="text-amber-500" size={14} /> 사계절 기복 없는 비수기 제로 라인업</li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#faf8f5] rounded-3xl p-8 border border-neutral-200/80 hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600 mb-6 font-bold text-xl">
                  02
                </div>
                <div className="h-44 rounded-2xl overflow-hidden mb-6 bg-neutral-200">
                  <img src={EGG_FEATURE_IMG} alt="특허받은 리얼 계란빵" className="w-full h-full object-cover" />
                </div>
                <h4 className="text-xl font-bold text-neutral-900 mb-3">특허받은 리얼 계란빵</h4>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  국내 유일 독창적 제조 레시피 특허 보유! 겉은 바삭하고 속은 촉촉한 영양 간식으로 남녀노소 누구나 재구매율이 높습니다.
                </p>
              </div>
              <ul className="mt-6 space-y-2 border-t border-neutral-200/80 pt-4 text-xs font-medium text-neutral-700">
                <li className="flex items-center gap-2"><Check className="text-amber-500" size={14} /> 아침 간식 & 학원가 단체 주문 폭발</li>
                <li className="flex items-center gap-2"><Check className="text-amber-500" size={14} /> 높은 재구매율로 상시 단골고객 형성</li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#faf8f5] rounded-3xl p-8 border border-neutral-200/80 hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600 mb-6 font-bold text-xl">
                  03
                </div>
                <div className="h-44 rounded-2xl overflow-hidden mb-6 bg-neutral-200">
                  <img src={CHURROS_FEATURE_IMG} alt="스페인 정통 츄러스" className="w-full h-full object-cover" />
                </div>
                <h4 className="text-xl font-bold text-neutral-900 mb-3">초간단 3분 조리 콜드체인</h4>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  전문 파티시에가 없어도 OK! 본사에서 완벽한 콜드체인 시스템으로 생지를 공급하여 3분 오븐 구이만으로 퀄리티가 유지됩니다.
                </p>
              </div>
              <ul className="mt-6 space-y-2 border-t border-neutral-200/80 pt-4 text-xs font-medium text-neutral-700">
                <li className="flex items-center gap-2"><Check className="text-amber-500" size={14} /> 초보자도 하루 교육으로 맞춤 숙달</li>
                <li className="flex items-center gap-2"><Check className="text-amber-500" size={14} /> 피크타임 빠른 회전율로 매출 극대화</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FRANCHISE MODELS */}
      <section className="py-20 bg-[#faf8f5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-amber-600 tracking-widest uppercase mb-2">CUSTOMIZED MODELS</h2>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-neutral-900">
              상권과 예산에 맞춘<br className="sm:hidden" /> 3가지 맞춤 창업 모델
            </h3>
            <p className="text-neutral-600 text-sm sm:text-base mt-3">
              무자본 샵인샵 도입부터 소자본 1인 창업, 카페형 매장까지 점주님 상황에 가장 효율적인 구조를 제안합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FRANCHISE_MODELS.map((model, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-8 border border-neutral-200 shadow-sm hover:border-amber-400 transition-all flex flex-col justify-between">
                <div>
                  <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full mb-4">
                    {model.badge}
                  </span>
                  <h4 className="text-xl font-bold text-neutral-900 mb-2">{model.title}</h4>
                  <p className="text-xs text-neutral-500 mb-6 leading-relaxed">{model.desc}</p>
                  
                  <div className="space-y-3 mb-6">
                    {model.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5 text-xs text-neutral-700 font-medium">
                        <CheckCircle2 size={16} className="text-amber-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                  <span className="text-xs text-neutral-400">특장점</span>
                  <span className="text-xs font-bold text-amber-600">{model.highlight}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4.5. TRANSPARENT PACKAGE COSTS & DETAILS SECTION (첨부 이미지 1 연동) */}
      <section className="py-20 bg-neutral-950 text-white relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#fbc400]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header Title & Subtitle */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="px-3.5 py-1 bg-[#fbc400]/20 border border-[#fbc400]/40 text-[#fbc400] text-xs font-extrabold rounded-full inline-block mb-3 tracking-widest uppercase">
              TRANSPARENT PACKAGE COST
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-4">
              거품없는<br className="sm:hidden" /> 투명한 창업 비용
            </h2>
            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed font-normal">
              본사 노하우를 바탕으로 예비 점주님의 매장 상태와 자본금 규모에 가장 이상적인 형태의 맞춤 창업 플랜을 투명하게 제시해 드립니다.
            </p>
          </div>

          {/* 5-Tab Selector Header Bar */}
          <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-4 mb-8 no-scrollbar justify-start md:justify-center">
            {PACKAGE_COST_TABS.map((tab) => {
              const isActive = activePriceTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActivePriceTab(tab.id)}
                  className={`px-5 py-3.5 rounded-2xl text-left transition-all duration-300 shrink-0 border cursor-pointer ${
                    isActive
                      ? "bg-[#fbc400] border-[#fbc400] text-neutral-950 shadow-lg shadow-[#fbc400]/20 scale-102 font-bold"
                      : "bg-white/5 border-white/10 text-neutral-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <strong className="block text-sm font-extrabold">{tab.label}</strong>
                  <span className={`block text-[11px] font-semibold mt-0.5 ${isActive ? "text-neutral-900/80" : "text-neutral-400"}`}>
                    {tab.subLabel}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Tab Package Display Box */}
          {(() => {
            const currentTab = PACKAGE_COST_TABS.find((t) => t.id === activePriceTab) || PACKAGE_COST_TABS[0];
            return (
              <div className="space-y-8">
                {/* Highlight Cost Banner */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 text-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-neutral-950 text-[#fbc400] flex items-center justify-center shrink-0">
                      <DollarSign size={24} />
                    </div>
                    <div>
                      <span className="text-[11px] font-extrabold text-neutral-400 uppercase tracking-widest block">
                        SHOP-IN-SHOP PACKAGE
                      </span>
                      <h3 className="text-xl sm:text-2xl font-black text-neutral-900">
                        {currentTab.packageName}
                      </h3>
                    </div>
                  </div>

                  <div className="text-center sm:text-right shrink-0">
                    <span className="text-xs line-through text-neutral-400 block font-medium">
                      {currentTab.normalPrice}
                    </span>
                    <div className="flex items-baseline justify-center sm:justify-end gap-1">
                      <span className="text-xs font-extrabold text-neutral-600">도입 할인가</span>
                      <span className="text-3xl sm:text-5xl font-black text-red-600 tracking-tight">
                        {currentTab.discountPrice}
                      </span>
                      <span className="text-base font-extrabold text-neutral-900">{currentTab.unit}</span>
                      <span className="text-xs text-neutral-500 font-semibold ml-1">(VAT 포함)</span>
                    </div>
                  </div>
                </div>

                {/* Package Detail Items Table */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 text-neutral-900 shadow-xl overflow-hidden">
                  <div className="flex items-center justify-between flex-wrap gap-2 mb-6 border-b border-neutral-100 pb-4">
                    <h4 className="text-lg sm:text-xl font-extrabold text-neutral-900 flex items-center gap-2">
                      <Sparkles className="text-amber-500" size={20} />
                      {currentTab.detailTitle}
                    </h4>
                    <span className="text-xs font-bold text-neutral-500">
                      도입가 {currentTab.discountPrice}{currentTab.unit} (VAT 포함)
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                      <thead>
                        <tr className="bg-neutral-100 text-xs font-extrabold text-neutral-700 uppercase border-b border-neutral-200">
                          <th className="py-3.5 px-4 w-1/4 rounded-l-xl">구분</th>
                          <th className="py-3.5 px-4 w-1/2">세부 내용</th>
                          <th className="py-3.5 px-4 w-1/4 rounded-r-xl">비고</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100 text-xs sm:text-sm font-medium text-neutral-800">
                        {currentTab.items.map((item, iIdx) => (
                          <tr key={iIdx} className="hover:bg-amber-50/40 transition-colors">
                            <td className="py-4 px-4 font-bold text-neutral-900">{item.cat}</td>
                            <td className="py-4 px-4 text-neutral-800 font-semibold">{item.content}</td>
                            <td className="py-4 px-4 text-neutral-500 text-xs">{item.note}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* 4.6. SHINHAN CARD 48 MONTHS SLIM INSTALLMENT PROMOTION SECTION (첨부 이미지 2 연동) */}
      <section className="py-20 bg-[#faf8f5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Banner */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-16">
            <div className="max-w-2xl text-center lg:text-left">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-blue-100 text-blue-900 border border-blue-200 text-xs font-extrabold rounded-full mb-4 tracking-wider uppercase">
                SHINHAN CARD FINANCIAL SUPPORT
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-neutral-900 tracking-tight leading-tight mb-4">
                신한카드 48개월 슬림할부 프로모션
              </h2>
              <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
                신한카드로 창업 및 도입 비용 결제 시, 이자의 절반(10%)을 본사에서 지원하여<br className="hidden sm:block" />
                무이자 수준의 실질 부담으로 48개월간 가볍게 나누어 납입할 수 있는 특별 결제 지원 상품입니다.
              </p>
            </div>

            {/* Shinhan Card Graphic Item */}
            <div className="w-64 sm:w-72 h-40 bg-gradient-to-br from-blue-900 via-blue-950 to-slate-900 rounded-2xl p-5 text-white shadow-2xl relative overflow-hidden border border-blue-400/30 shrink-0 transform rotate-1 hover:rotate-0 transition-transform duration-300">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-black tracking-widest uppercase text-blue-300">SHINHAN CARD</p>
                  <p className="text-[10px] text-blue-200/80 font-semibold mt-0.5">SPECIAL FINANCIAL PROMOTION</p>
                </div>
                <div className="w-9 h-7 bg-amber-400/80 rounded-md" />
              </div>
              <div className="mt-6">
                <p className="text-lg font-black text-[#fbc400] tracking-tight">48개월 슬림할부</p>
                <p className="text-[9px] text-white/60 font-mono mt-1">120PIE PARTNERSHIP</p>
              </div>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="space-y-6 max-w-5xl mx-auto">
            {SHINHAN_CARD_INSTALLMENTS.map((card, cIdx) => (
              <div key={cIdx} className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-center justify-between gap-6">
                {/* Left side */}
                <div className="space-y-4 text-center md:text-left flex-1">
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-md border border-blue-200">
                      신한48슬림할부 적용
                    </span>
                    <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 text-xs font-bold rounded-md border border-amber-200">
                      10% 본사 지원
                    </span>
                  </div>

                  <div>
                    <h3 className="text-2xl font-black text-neutral-900">{card.title}</h3>
                    <p className="text-xs text-neutral-500 font-medium mt-0.5">{card.subtitle}</p>
                  </div>

                  <div className="space-y-2 pt-1">
                    {card.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2 text-xs text-neutral-700 font-semibold justify-center md:justify-start">
                        <CheckCircle2 size={14} className="text-blue-600 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right side calculation box */}
                <div className="w-full md:w-80 bg-neutral-50 rounded-2xl p-6 border border-neutral-200 text-right shrink-0">
                  <div className="space-y-2 text-xs border-b border-neutral-200 pb-3 mb-4">
                    <div className="flex justify-between text-neutral-500">
                      <span>정상 할부 이자율</span>
                      <span className="line-through">{card.normalRate}</span>
                    </div>
                    <div className="flex justify-between font-bold text-red-600">
                      <span>본사 이자 지원율</span>
                      <span>{card.supportRate}</span>
                    </div>
                    <div className="flex justify-between font-black text-neutral-900 pt-1 text-sm">
                      <span>% 최종 고객 부담</span>
                      <span className="text-blue-700">{card.finalRate}</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-neutral-500 mb-1">
                      <span>48개월 총 결제액</span>
                      <span className="font-bold text-neutral-800">{card.totalPrice}</span>
                    </div>
                    <div className="mt-2">
                      <span className="text-xs text-neutral-500 block font-semibold">월 납입액</span>
                      <span className="text-2xl sm:text-3xl font-black text-blue-900 tracking-tight">
                        {card.monthlyPrice}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. COST & BENEFITS SECTION */}
      <section id="benefits" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-neutral-950 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#fbc400]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-3xl mb-12 relative z-10">
              <span className="px-3 py-1 bg-[#fbc400] text-neutral-950 text-xs font-extrabold rounded-full inline-block mb-3">
                LIMITED PROMOTION
              </span>
              <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                초기 창업 비용 부담을 파격적으로 낮췄습니다
              </h3>
              <p className="text-neutral-300 text-sm sm:text-base mt-2">
                120PIE는 점주님의 성공적인 정착을 최우선으로 생각합니다. 불필요한 거품 비용을 전부 지웠습니다.
              </p>
            </div>

            {/* Benefit Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 relative z-10">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-center">
                <p className="text-xs text-neutral-400 font-medium">가맹비 (Initial Fee)</p>
                <p className="text-2xl sm:text-3xl font-black text-[#fbc400] mt-1">0원 면제</p>
                <p className="text-[11px] text-neutral-400 mt-2">선착순 한정 혜택</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-center">
                <p className="text-xs text-neutral-400 font-medium">교육비 (Training Fee)</p>
                <p className="text-2xl sm:text-3xl font-black text-[#fbc400] mt-1">0원 면제</p>
                <p className="text-[11px] text-neutral-400 mt-2">현장 맞춤 1:1 조리 교육 포함</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-center">
                <p className="text-xs text-neutral-400 font-medium">브랜드 로열티 (Royalty)</p>
                <p className="text-2xl sm:text-3xl font-black text-[#fbc400] mt-1">평생 0원</p>
                <p className="text-[11px] text-neutral-400 mt-2">매월 발생하는 브랜드 비용 없음</p>
              </div>
            </div>

            {/* Cost Tab Table */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 text-neutral-900 relative z-10">
              <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                <div>
                  <h4 className="text-lg font-bold text-neutral-900">창업 예상 비용 표준 가이드</h4>
                  <p className="text-xs text-neutral-500">매장 상권 및 현장 조건에 따라 약간의 차이가 발생할 수 있습니다.</p>
                </div>
                <div className="flex gap-2 p-1 bg-neutral-100 rounded-xl text-xs font-bold">
                  <button
                    onClick={() => setSelectedPlanTab("8py")}
                    className={`px-4 py-2 rounded-lg transition-colors border-0 cursor-pointer ${
                      selectedPlanTab === "8py" ? "bg-neutral-950 text-white" : "text-neutral-600 hover:text-neutral-900"
                    }`}
                  >
                    8평 기준 (테이크아웃형)
                  </button>
                  <button
                    onClick={() => setSelectedPlanTab("10py")}
                    className={`px-4 py-2 rounded-lg transition-colors border-0 cursor-pointer ${
                      selectedPlanTab === "10py" ? "bg-neutral-950 text-white" : "text-neutral-600 hover:text-neutral-900"
                    }`}
                  >
                    10평 기준 (카페형)
                  </button>
                </div>
              </div>

              {selectedPlanTab === "8py" ? (
                <div className="divide-y divide-neutral-100 text-xs sm:text-sm">
                  <div className="py-3 flex justify-between">
                    <span className="font-semibold text-neutral-700">가맹비 / 교육비</span>
                    <span className="font-bold text-amber-600">0원 (프로모션 지원)</span>
                  </div>
                  <div className="py-3 flex justify-between">
                    <span className="font-semibold text-neutral-700">인테리어 (8평 기준)</span>
                    <span className="font-bold text-neutral-900">약 1,400만 원</span>
                  </div>
                  <div className="py-3 flex justify-between">
                    <span className="font-semibold text-neutral-700">주방 장비 & 오븐 기기</span>
                    <span className="font-bold text-neutral-900">약 1,100만 원</span>
                  </div>
                  <div className="py-3 flex justify-between">
                    <span className="font-semibold text-neutral-700">간판 및 내/외부 홍보물</span>
                    <span className="font-bold text-neutral-900">약 350만 원</span>
                  </div>
                  <div className="py-3.5 bg-amber-50/60 px-4 rounded-xl flex justify-between items-center font-bold text-neutral-900 text-sm sm:text-base mt-3">
                    <span>합계 (보증금/별도공사 제외)</span>
                    <span className="text-amber-700 font-extrabold">약 2,850만 원</span>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-neutral-100 text-xs sm:text-sm">
                  <div className="py-3 flex justify-between">
                    <span className="font-semibold text-neutral-700">가맹비 / 교육비</span>
                    <span className="font-bold text-amber-600">0원 (프로모션 지원)</span>
                  </div>
                  <div className="py-3 flex justify-between">
                    <span className="font-semibold text-neutral-700">인테리어 (10평 기준)</span>
                    <span className="font-bold text-neutral-900">약 1,750만 원</span>
                  </div>
                  <div className="py-3 flex justify-between">
                    <span className="font-semibold text-neutral-700">주방 장비 & 오븐 기기</span>
                    <span className="font-bold text-neutral-900">약 1,250만 원</span>
                  </div>
                  <div className="py-3 flex justify-between">
                    <span className="font-semibold text-neutral-700">간판 및 내/외부 홍보물</span>
                    <span className="font-bold text-neutral-900">약 400만 원</span>
                  </div>
                  <div className="py-3.5 bg-amber-50/60 px-4 rounded-xl flex justify-between items-center font-bold text-neutral-900 text-sm sm:text-base mt-3">
                    <span>합계 (보증금/별도공사 제외)</span>
                    <span className="text-amber-700 font-extrabold">약 3,400만 원</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 6. SUCCESS STORIES */}
      <section className="py-20 bg-[#faf8f5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-amber-600 tracking-widest uppercase mb-2">SUCCESS CASES</h2>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-neutral-900">
              실제 120PIE 점주님들의<br className="sm:hidden" /> 진짜 성공 스토리
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {SUCCESS_STORIES.map((story, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-8 border border-neutral-200 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="inline-block px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-full mb-3">
                    {story.name}
                  </span>
                  <p className="text-xl font-black text-amber-600 mb-4">{story.increase}</p>
                  <p className="text-xs text-neutral-600 leading-relaxed italic">
                    "{story.quote}"
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-neutral-100 text-right">
                  <span className="text-xs text-neutral-400 font-medium">검증된 매장 사례</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FRANCHISE PROCESS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-amber-600 tracking-widest uppercase mb-2">PROCESS</h2>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-neutral-900">
              체계적이고 쉬운<br className="sm:hidden" /> 6단계 오픈 시스템
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {PROCESS_STEPS.map((p, idx) => (
              <div key={idx} className="bg-[#faf8f5] p-6 rounded-2xl border border-neutral-200/80 text-left relative flex flex-col justify-between">
                <div>
                  <span className="text-2xl font-black text-amber-500/40 block mb-2">{p.step}</span>
                  <h4 className="text-sm font-bold text-neutral-900 mb-2">{p.title}</h4>
                  <p className="text-xs text-neutral-500 leading-normal">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. INQUIRY FORM SECTION */}
      <section id="inquiry" className="py-20 bg-neutral-950 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="px-3 py-1 bg-[#fbc400] text-neutral-950 text-xs font-extrabold rounded-full inline-block mb-3">
              FAST CONSULTATION
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
              120PIE 1:1 맞춤<br className="sm:hidden" /> 창업 상담 신청
            </h2>
            <p className="text-neutral-300 text-xs sm:text-sm mt-3">
              상담 신청 시 상세 창업 브로슈어 및 상권 무료 분석 리포트를 전달해 드립니다.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-10 text-neutral-900 shadow-2xl">
            {formSubmitted ? (
              <div className="text-center py-12">
                <CheckCircle2 size={56} className="text-amber-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-neutral-900 mb-2">창업 상담 문의가 정상 접수되었습니다!</h3>
                <p className="text-sm text-neutral-600 mb-6">
                  입력해 주신 연락처로 담당 슈퍼바이저가 빠른 시간 내에 친절히 안내드리겠습니다.
                </p>
                <button
                  onClick={() => setFormSubmitted(false)}
                  className="px-6 py-2.5 bg-neutral-900 text-white font-bold text-xs rounded-full hover:bg-neutral-800 transition-colors border-0 cursor-pointer"
                >
                  추가 문의하기
                </button>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-2">
                      성함 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="홍길동"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-amber-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-2">
                      연락처 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="010-1234-5678"
                      maxLength={13}
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: formatPhoneNumber(e.target.value) })}
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-amber-500 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-2">
                    창업 관심 유형
                  </label>
                  <select
                    value={formData.storeType}
                    onChange={(e) => setFormData({ ...formData, storeType: e.target.value })}
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-amber-500 font-medium text-neutral-800"
                  >
                    <option value="신규 소자본 창업">신규 소자본 독립 매장 창업</option>
                    <option value="기존 카페 샵인샵 도입">기존 매장 샵인샵 도입</option>
                    <option value="1인 소자본 업종변경">업종 변경 창업</option>
                    <option value="기타 창업 문의">기타 창업 관련 문의</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-2">
                    희망 창업 지역 / 문의 내용 (선택)
                  </label>
                  <textarea
                    rows={4}
                    placeholder="희망 지역(예: 서울 강남구) 또는 원하시는 창업 시기/문의사항을 자유롭게 작성해 주세요."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-amber-500 font-medium"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-[#fbc400] hover:bg-[#e0a800] text-neutral-950 font-extrabold text-base rounded-2xl shadow-lg transition-transform hover:scale-[1.01] border-0 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? "제출 중..." : "무료 창업 상담 및 리포트 신청하기"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 9. FOOTER */}
      <Footer theme="yellow" />

      {/* 10. CONSULTATION MODAL OVERLAY */}
      {isConsulting && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn"
          onClick={() => setIsConsulting(false)}
        >
          <div
            className="w-full max-w-3xl bg-neutral-950 border border-[#FBC400]/30 rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] relative my-auto overflow-hidden text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Gold Gradient Accent */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-[#FBC400] to-amber-500" />

            {/* Close Button */}
            <button
              onClick={() => setIsConsulting(false)}
              className="absolute top-5 right-5 sm:top-6 sm:right-6 p-2.5 text-neutral-400 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-full cursor-pointer transition-colors z-50"
            >
              <X size={20} />
            </button>

            {/* Modal Header */}
            <div className="mb-6 select-none space-y-1.5 pr-8">
              <span className="inline-block px-3 py-1 bg-[#FBC400]/10 border border-[#FBC400]/30 text-[#FBC400] text-[11px] font-black tracking-widest rounded-full uppercase">
                120PIE FRANCHISE CONSULTING
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                창업 상담 문의
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 font-semibold">
                기본 정보를 작성해 주시면 전문 컨설턴트가 1:1 맞춤 상담을 안내해 드립니다.
              </p>
            </div>

            {/* Form Container */}
            <div className="max-h-[75vh] overflow-y-auto pr-1">
              <ConsultationForm onSuccessClose={() => setIsConsulting(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Right Floating Quick Docking Bar */}
      <RightFloatingQuickBar onOpenConsultation={() => setIsConsulting(true)} />
    </div>
  );
}
