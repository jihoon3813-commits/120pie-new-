"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { 
  Menu, X, Play, Pause, MapPin, Search, ArrowRight, Info, 
  Sparkles, Award, Globe, Heart, ChevronRight, ChevronLeft
} from "lucide-react";
import { MENU_DATA } from "@/app/constants/menu";
import { optimizeCloudinaryUrl } from "@/app/utils/cloudinary";

const SIGNATURE_MENUS = [
  {
    name: "꿀호떡파이",
    subName: "Honey Hotteok Pie",
    label: "NEW",
    img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784076391/edited-photo_-_2026-07-06T123534.491_cumykv.png",
  },
  {
    name: "함박치즈파이",
    subName: "Hambak Cheese Pie",
    label: "NEW",
    img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784076393/edited-photo_-_2026-07-06T123626.598_ksssvh.png",
  },
  {
    name: "페페로니 피자파이",
    subName: "Pepperoni Pizza Pie",
    label: "NEW",
    img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784076393/edited-photo_-_2026-07-06T123914.344_ozvcjh.png",
  },
  {
    name: "애플파이",
    subName: "Apple Pie",
    label: "인기",
    img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784076388/edited-photo_-_2026-07-06T123253.062_abg0wv.png",
  },
  {
    name: "불닭치즈파이",
    subName: "Buldak Cheese Pie",
    label: "인기",
    img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784076392/edited-photo_-_2026-07-06T123838.548_emd6h0.png",
  },
  {
    name: "포테이토베이컨 피자파이",
    subName: "Potato Bacon Pizza Pie",
    label: "인기",
    img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784076398/edited-photo_-_2026-07-06T124011.716_sueey4.png",
  },
  {
    name: "망고파이",
    subName: "Mango Pie",
    label: "",
    img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784076389/edited-photo_-_2026-07-06T123308.924_oddurc.png",
  },
  {
    name: "불고기 피자파이",
    subName: "Bulgogi Pizza Pie",
    label: "",
    img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784076394/edited-photo_-_2026-07-06T123940.202_jwmg7t.png",
  }
];

const SLIDE_BANNERS = [
  {
    id: 1,
    title: "120겹파이 스탬프 월드컵",
    desc: "100% 당첨 이벤트!",
    img: "https://res.cloudinary.com/dfkntvpmv/image/upload/f_auto,q_auto/v1783479933/ChatGPT_Image_2026%EB%85%84_7%EC%9B%94_8%EC%9D%BC_%EC%98%A4%ED%9B%84_12_05_25_blj0ay.png",
  },
  {
    id: 2,
    title: "여름 신메뉴 컵빙수 출시",
    desc: "말차 & 인절미 컵빙수 2종",
    img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784077138/%EC%9D%B8%EC%A0%88%EB%AF%B8%EC%BB%B5%ED%8C%A5%EB%B9%99%EC%88%98_w4v7n6.png",
  }
];

const VERTICAL_BANNER = {
  title: "7월 신메뉴 공식 출시",
  desc: "바삭함과 달콤함의 극치",
  img: "https://res.cloudinary.com/dfarfqx7e/image/upload/f_auto,q_auto/v1781184019/120%EA%B2%B9%ED%8C%8C%EC%9D%B4_%ED%81%AC%EB%A6%BC%EC%B9%98%EC%A6%88_%EC%97%B0%EC%B6%9C_ebuddm.jpg",
};

const HORIZONTAL_BANNER = {
  title: "120겹파이 맛의 결정체",
  desc: "120겹의 페이스트리 수제파이와 함께하는 특별한 하루",
  img: "https://res.cloudinary.com/dfkntvpmv/image/upload/f_auto,q_auto/v1783479315/ChatGPT_Image_2026%EB%85%84_7%EC%9B%94_8%EC%9D%BC_%EC%98%A4%EC%A0%84_11_55_08_qd2nni.png"
};

export default function BrandHome() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("120겹파이");
  const [searchRegion, setSearchRegion] = useState("전체");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedMenuItem, setSelectedMenuItem] = useState<any>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuIndex, setMenuIndex] = useState(8);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [moveStep, setMoveStep] = useState(33.333);
  
  // Custom Slider and Video States
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Section Refs for Smooth Scrolling
  const heroRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const storeRef = useRef<HTMLDivElement>(null);
  const newsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  // Scroll Trigger State for CTA Animations
  const [isCtaVisible, setIsCtaVisible] = useState(false);

  // Concept Slider State
  const [conceptIndex, setConceptIndex] = useState(0);

  // Intersection Observer for Franchise CTA Section
  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsCtaVisible(true);
        }
      },
      { threshold: 0.15 }
    );
    if (ctaRef.current) {
      observer.observe(ctaRef.current);
    }
    return () => {
      if (ctaRef.current) {
        observer.unobserve(ctaRef.current);
      }
    };
  }, []);

  // Responsive Carousel Width Checker
  useEffect(() => {
    const handleResize = () => {
      setMoveStep(window.innerWidth >= 768 ? 33.333 : 100);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Scroll event listener for GNB sticky background switching
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto Rolling Timer for Slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDE_BANNERS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const toggleVideoPlay = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    setMobileMenuOpen(false);
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handlePrevMenu = () => {
    setMenuIndex((prev) => prev - 1);
  };

  const handleNextMenu = () => {
    setMenuIndex((prev) => prev + 1);
  };

  const handlePrevConcept = () => {
    setConceptIndex((prev) => (prev === 0 ? 1 : 0));
  };

  const handleNextConcept = () => {
    setConceptIndex((prev) => (prev === 0 ? 1 : 0));
  };

  const extendedMenus = [
    ...SIGNATURE_MENUS,
    ...SIGNATURE_MENUS,
    ...SIGNATURE_MENUS
  ];

  // Infinite slider index resetting effect
  useEffect(() => {
    if (menuIndex < SIGNATURE_MENUS.length) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setMenuIndex(menuIndex + SIGNATURE_MENUS.length);
      }, 500);
      return () => clearTimeout(timer);
    }
    if (menuIndex >= SIGNATURE_MENUS.length * 2) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setMenuIndex(menuIndex - SIGNATURE_MENUS.length);
      }, 500);
      return () => clearTimeout(timer);
    }
    setIsTransitioning(true);
  }, [menuIndex]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`매장 찾기 시뮬레이터: [${searchRegion}] 지역에서 "${searchKeyword}" 매장을 검색합니다.`);
  };

  // Brand Story Images
  const storyImage1 = optimizeCloudinaryUrl(
    "https://res.cloudinary.com/dfarfqx7e/image/upload/f_auto,q_auto/v1781184019/120%EA%B2%B9%ED%8C%8C%EC%9D%B4_%ED%81%AC%EB%A6%BC%EC%B9%98%EC%A6%88_%EC%97%B0%EC%B6%9C_ebuddm.jpg"
  );
  const storyImage2 = optimizeCloudinaryUrl(
    "https://res.cloudinary.com/dfkntvpmv/image/upload/f_auto,q_auto/v1783478568/Gemini_Generated_Image_qqo5j2qqo5j2qqo5_n9umlz.jpg"
  );

  return (
    <div className="min-h-screen bg-white text-[#0D233A] font-sans antialiased selection:bg-[#fbc400] selection:text-white">
      
      {/* BRAND GNB HEADER */}
      <header className="sticky top-0 z-50 transition-all duration-300 backdrop-blur-md bg-white/90 py-3">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link href="/brand" className="flex items-center gap-2 group">
            <img
              src="https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784533894/Group_1_4_jl4rlr.png"
              alt="120pie 로고"
              className="h-[22px] md:h-[26px] w-auto object-contain transition-transform duration-300 group-hover:scale-102"
            />
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-10 font-medium text-[16px] text-neutral-700">
            <button onClick={() => scrollToSection(storyRef)} className="hover:text-amber-600 transition-colors">
              브랜드 소개
            </button>
            <button onClick={() => scrollToSection(menuRef)} className="hover:text-amber-600 transition-colors">
              메뉴 소개
            </button>
            <button onClick={() => scrollToSection(storeRef)} className="hover:text-amber-600 transition-colors">
              매장 찾기
            </button>
            <button onClick={() => scrollToSection(newsRef)} className="hover:text-amber-600 transition-colors">
              뉴스 & 이벤트
            </button>
            <Link href="/franchise" className="text-amber-600 hover:text-amber-700 transition-colors flex items-center gap-0.5">
              창업안내 <ChevronRight size={14} />
            </Link>
          </nav>

          {/* Quick Consultation CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/franchise"
              className="px-5 py-2.5 bg-[#fbc400] hover:bg-[#e0a800] text-[#0D233A] font-extrabold text-xs rounded-full transition-all duration-300 shadow-sm shadow-[#fbc400]/20 hover:scale-103"
            >
              창업 상담 문의
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-neutral-700 hover:text-amber-600 transition-colors"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* MOBILE NAVIGATION OVERLAY */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-20 z-40 bg-neutral-900/98 flex flex-col p-6 space-y-6 md:hidden animate-fadeIn">
          <nav className="flex flex-col space-y-4 font-medium text-lg text-neutral-200 text-left">
            <button onClick={() => scrollToSection(storyRef)} className="py-2 border-b border-neutral-800 hover:text-[#fbc400] transition-colors text-left">
              브랜드 소개
            </button>
            <button onClick={() => scrollToSection(menuRef)} className="py-2 border-b border-neutral-800 hover:text-[#fbc400] transition-colors text-left">
              메뉴 소개
            </button>
            <button onClick={() => scrollToSection(storeRef)} className="py-2 border-b border-neutral-800 hover:text-[#fbc400] transition-colors text-left">
              매장 찾기
            </button>
            <button onClick={() => scrollToSection(newsRef)} className="py-2 border-b border-neutral-800 hover:text-[#fbc400] transition-colors text-left">
              뉴스 & 이벤트
            </button>
            <Link href="/franchise" className="py-2 border-b border-neutral-800 text-amber-500 hover:text-[#fbc400] transition-colors text-left flex items-center justify-between">
              <span>창업안내</span>
              <ChevronRight size={18} />
            </Link>
          </nav>
          <Link
            href="/franchise"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full py-4 bg-[#fbc400] hover:bg-[#e0a800] text-[#0D233A] font-extrabold text-center rounded-xl text-sm transition-colors shadow-sm block"
          >
            창업 상담 문의하기
          </Link>
        </div>
      )}

      {/* 1. BRAND HERO GRID REMODEL SECTION */}
      <section ref={heroRef} className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-8 md:pt-3 md:pb-10">
        
        {/* ROW 1: 3-Column Layout Flex (영상 가로 1000px, 배너 높이 563px) */}
        <div className="flex flex-col lg:flex-row gap-6 items-stretch w-full justify-between">
          
          {/* Column 1: Video Card (Shrinks from 1000px max, 563px height on large screens) */}
          <div className="w-full lg:flex-1 lg:max-w-[1000px] h-[350px] sm:h-[450px] lg:h-[563px] rounded-2xl overflow-hidden isolate shadow-md relative bg-neutral-900 border border-neutral-100/5 group" style={{ transform: "translateZ(0)" }}>
            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src="https://image.frankburger.co.kr/frankburger_homepage/2607_YT.mp4?1" type="video/mp4" />
            </video>
            
            {/* Dark overlay & content */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/30 flex flex-col justify-between p-6 sm:p-8">
              {/* Top tag */}
              <div className="flex justify-between items-center">
                <span className="bg-[#fbc400] text-[#0D233A] font-extrabold text-[10px] tracking-wider uppercase px-3 py-1 rounded-full shadow-sm">
                  Brand Film
                </span>
                {/* Custom Play/Pause controller */}
                <button 
                  onClick={toggleVideoPlay} 
                  className="p-2.5 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full text-white cursor-pointer transition-all duration-300 active:scale-90"
                >
                  {isVideoPlaying ? <Pause size={14} /> : <Play size={14} />}
                </button>
              </div>

              {/* Bottom text overlay */}
              <div className="space-y-2 text-left">
                <p className="text-white font-black text-lg sm:text-2xl tracking-tight drop-shadow-md">
                  바삭하게 맛있는 120겹의 정직한 한결
                </p>
                <p className="text-neutral-300 font-semibold text-xs sm:text-sm leading-relaxed drop-shadow-sm max-w-lg">
                  자체 패티, 빵 물류 시스템을 통해 위생적으로 공급되어 한결같은 120겹의 결을 유지합니다.
                </p>
              </div>
            </div>
          </div>

          {/* Column 2 & 3 wrapper for flexible rest space */}
          <div className="w-full lg:w-[848px] lg:shrink-0 flex flex-col sm:flex-row gap-6 h-auto lg:h-[563px]">
            
            {/* Column 2: Auto Slide Banner */}
            <div className="flex-1 lg:w-[412px] lg:shrink-0 rounded-2xl overflow-hidden isolate shadow-md relative min-h-[350px] sm:min-h-[450px] lg:min-h-full bg-neutral-50 border border-neutral-100 flex flex-col group" style={{ transform: "translateZ(0)" }}>
              {/* Background Slides */}
              {SLIDE_BANNERS.map((slide, index) => {
                const isActive = index === currentSlide;
                return (
                  <div
                    key={slide.id}
                    className={`absolute inset-0 bg-cover bg-center transition-all duration-700 ease-in-out ${
                      isActive ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
                    }`}
                    style={{ backgroundImage: `url('${slide.img}')` }}
                  />
                );
              })}
              
              {/* Text Overlay & Pagination Controls */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex flex-col justify-end p-6">
                <div className="space-y-2 text-left">
                  <span className="text-[#fbc400] font-black text-[10px] tracking-wider uppercase block">
                    Event Slide
                  </span>
                  <h3 className="text-white font-extrabold text-base leading-snug line-clamp-1">
                    {SLIDE_BANNERS[currentSlide].title}
                  </h3>
                  <p className="text-neutral-300 font-medium text-xs">
                    {SLIDE_BANNERS[currentSlide].desc}
                  </p>
                </div>

                {/* Slider Pagination dots */}
                <div className="flex gap-1.5 justify-start items-center mt-4">
                  {SLIDE_BANNERS.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        index === currentSlide ? "w-5 bg-[#fbc400]" : "w-1.5 bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Column 3: Vertical Banner */}
            <div className="flex-1 lg:w-[412px] lg:shrink-0 rounded-2xl overflow-hidden isolate shadow-md relative min-h-[350px] sm:min-h-[450px] lg:min-h-full bg-neutral-900 border border-neutral-100 flex flex-col group" style={{ transform: "translateZ(0)" }}>
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-104"
                style={{ backgroundImage: `url('${VERTICAL_BANNER.img}')` }}
              />
              {/* Dim Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

              <div className="absolute inset-0 flex flex-col justify-end p-6 text-left">
                <div className="space-y-2">
                  <span className="bg-red-500 text-white font-extrabold text-[9px] px-2.5 py-0.5 rounded-full shadow-sm w-fit inline-block mb-1">
                    NEW ARRIVAL
                  </span>
                  <h3 className="text-white font-black text-base leading-snug">
                    {VERTICAL_BANNER.title}
                  </h3>
                  <p className="text-neutral-300 font-medium text-xs leading-relaxed">
                    {VERTICAL_BANNER.desc}
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* ROW 2: Horizontal Wide Banner */}
        <div className="w-full mt-6 rounded-2xl overflow-hidden shadow-md border border-[#e6dfc3]/30 h-[600px] relative group flex items-center">
          {/* Background image */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out scale-100 group-hover:scale-[1.01]"
            style={{ backgroundImage: `url('${HORIZONTAL_BANNER.img}')` }}
          />
          {/* Dim Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent md:bg-black/20" />

          {/* Texts overlay */}
          <div className="relative z-10 px-8 sm:px-12 md:px-16 text-left max-w-xl space-y-3 sm:space-y-4">
            <span className="text-[#fbc400] font-black text-[10px] tracking-wider uppercase block">
              Signature Collection
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-tight tracking-tight drop-shadow-md">
              {HORIZONTAL_BANNER.title}
            </h2>
            <p className="text-neutral-200 font-semibold text-xs sm:text-sm max-w-md hidden sm:block leading-relaxed drop-shadow-sm">
              {HORIZONTAL_BANNER.desc}
            </p>
            <div className="pt-2">
              <button
                onClick={() => scrollToSection(menuRef)}
                className="px-5 py-2.5 bg-[#fbc400] hover:bg-[#e0a800] text-[#0D233A] font-extrabold text-[11px] rounded-full transition-all duration-300 shadow-md group/btn flex items-center gap-1.5"
              >
                <span>신메뉴 전시장 가기</span>
                <ChevronRight size={14} className="transition-transform duration-300 group-hover/btn:translate-x-0.5" />
              </button>
            </div>
          </div>
        </div>

      </section>

      {/* REPRESENTATIVE MENU CAROUSEL SECTION */}
      <section className="py-20 bg-white">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Title */}
          <div className="text-center mb-8 space-y-2">
            <span className="text-[#fbc400] font-black text-xs sm:text-sm uppercase tracking-widest block">
              120PIE & COFFEE
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0D233A] uppercase tracking-wider">
              대표메뉴
            </h2>
          </div>

          {/* Carousel Layout */}
          <div className="relative max-w-[1500px] mx-auto flex items-center justify-between gap-4 w-full px-4 md:px-12">
            {/* Left Button */}
            <button
              onClick={handlePrevMenu}
              className="z-10 w-12 h-12 rounded-full bg-neutral-800/80 hover:bg-neutral-900 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 shrink-0 cursor-pointer"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Viewport Wrapper (Fixed height lock to prevent below section layout shift) */}
            <div className="flex-1 overflow-hidden py-10 h-[350px] sm:h-[550px] flex items-center">
              {/* Slider Track (Flex track sliding horizontally) */}
              <div
                className="flex items-center w-full"
                style={{
                  transform: `translateX(-${menuIndex * moveStep}%)`,
                  transition: isTransitioning ? "transform 700ms cubic-bezier(0.25, 1, 0.5, 1)" : "none"
                }}
              >
                {extendedMenus.map((menu, index) => {
                  const isCenter = index === menuIndex + (moveStep === 33.333 ? 1 : 0);
                  return (
                    <div key={index} className="w-full md:w-1/3 shrink-0 flex flex-col items-center justify-center group px-6 md:px-8">
                      {/* Round Background (Holds everything inside - transition-all duration-700 ease-out for smooth scaling) */}
                      <div
                        className={`rounded-full bg-[#F4F6F9] border border-neutral-200/40 flex flex-col justify-between items-center relative transition-all duration-700 cubic-bezier(0.25, 1, 0.5, 1) group-hover:bg-[#ECEFF2] group-hover:scale-102 ${
                          isCenter
                            ? "w-[270px] h-[270px] sm:w-[430px] sm:h-[430px] pt-8 pb-14 px-6"
                            : "w-[240px] h-[240px] sm:w-[380px] sm:h-[380px] pt-8 pb-12 px-4"
                        }`}
                      >
                        {/* Badge/Label (NEW / 인기) */}
                        {menu.label && (
                          <span
                            className={`absolute rounded-full flex items-center justify-center font-black shadow-md border border-white ${
                              menu.label === "NEW"
                                ? "bg-[#7CB342] text-white"
                                : "bg-[#fbc400] text-[#0D233A]"
                            } ${
                              isCenter
                                ? "top-4 right-4 w-14 h-14 sm:w-16 sm:h-16 text-xs sm:text-sm"
                                : "top-2 right-2 w-10 h-10 sm:w-12 sm:h-12 text-[9px] sm:text-xs"
                            }`}
                          >
                            {menu.label}
                          </span>
                        )}

                        {/* Spacer to push image down */}
                        <div className="flex-1 flex items-center justify-center w-full min-h-0">
                          {/* Pie PNG image (Enlarged for massive pop-out visual) */}
                          <img
                            src={optimizeCloudinaryUrl(menu.img)}
                            alt={menu.name}
                            className="w-[115%] h-auto max-h-[96%] object-contain transition-all duration-700 ease-out group-hover:rotate-6 group-hover:scale-120 scale-115 translate-y-[-2px]"
                          />
                        </div>

                        {/* Names & Subnames inside the Circle */}
                        <div className="w-full text-center shrink-0 mt-2">
                          <h4
                            className={`font-black text-[#0D233A] tracking-tight group-hover:text-[#fbc400] transition-colors ${
                              isCenter
                                ? "text-lg sm:text-2xl"
                                : "text-[12px] sm:text-[18px]"
                            }`}
                          >
                            {menu.name}
                          </h4>
                          <p
                            className={`text-neutral-400 font-bold uppercase tracking-wider ${
                              isCenter
                                ? "text-[9px] sm:text-xs mt-1"
                                : "text-[8px] sm:text-[11px] mt-0.5"
                            }`}
                          >
                            {menu.subName}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Button */}
            <button
              onClick={handleNextMenu}
              className="z-10 w-12 h-12 rounded-full bg-neutral-800/80 hover:bg-neutral-900 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 shrink-0 cursor-pointer"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </section>

      {/* 1.5. FRANCHISE CTA SECTION (NEW BG & SHADOW POSITION ADJUSTMENT) */}
      <section ref={ctaRef} className="py-24 sm:py-32 relative overflow-hidden bg-neutral-950 flex items-center justify-center">
        {/* Scoped CSS for Text Slide Up & Highlighter Drawing Motion */}
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes customSlideUp {
            0% {
              opacity: 0;
              transform: translateY(30px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes customDrawHighlight {
            0% {
              width: 0%;
            }
            100% {
              width: 100%;
            }
          }
          .animate-customSlideUp {
            animation: customSlideUp 1s cubic-bezier(0.215, 0.610, 0.355, 1) forwards;
          }
          .animate-customDrawHighlight {
            animation: customDrawHighlight 1.2s cubic-bezier(0.215, 0.610, 0.355, 1) forwards;
          }
        `}} />

        {/* Background mosaic collage image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 transition-transform duration-1000 scale-100"
          style={{
            backgroundImage: `url('https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784553887/ChatGPT_Image_2026%EB%85%84_7%EC%9B%94_20%EC%9D%BC_%EC%98%A4%ED%9B%84_10_22_33_1_qwrds2.png')`
          }}
        />
        {/* Black semi-transparent overlay (Made lighter as requested) */}
        <div className="absolute inset-0 bg-black/50 z-0" />

        {/* Inner white semi-transparent board plate (backdrop-blur) */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 w-full">
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 sm:p-14 text-center shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/20 space-y-6 sm:space-y-8 max-w-4xl mx-auto">
            {/* Headline Subtitle (Slide-up delay 0.1s) */}
            <p 
              className={`text-[#7CB342] font-black text-[11px] sm:text-xs tracking-[0.2em] uppercase block ${isCtaVisible ? 'animate-customSlideUp' : 'opacity-0'}`}
              style={{ animationDelay: '0.1s' }}
            >
              SUCCESS PARTNER
            </p>

            {/* Main Highlighted Title with Highlighter Drawing effect (Slide-up delay 0.3s) */}
            <h3 
              className={`text-2xl sm:text-4xl font-black text-[#0D233A] leading-tight tracking-tight max-w-3xl mx-auto ${isCtaVisible ? 'animate-customSlideUp' : 'opacity-0'}`}
              style={{ animationDelay: '0.3s' }}
            >
              7년간 카페 & 베이커리 페어 꾸준히 참여,<br className="hidden sm:block" />
              박람회만 나가면{" "}
              <span className="relative inline-block px-1.5 z-10 whitespace-nowrap">
                {/* Active Highlighter drawing underline from left to right */}
                <span 
                  className={`absolute inset-x-0 bottom-1 h-3 sm:h-4 bg-[#fbc400]/40 -z-10 origin-left ${isCtaVisible ? 'animate-customDrawHighlight' : 'w-0'}`} 
                  style={{ animationDelay: '1.2s' }}
                />
                줄 서서 상담받는 인기 브랜드!
              </span>
            </h3>

            {/* Core Message Paragraph (Slide-up delay 0.5s) */}
            <p 
              className={`text-neutral-500 font-bold text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto ${isCtaVisible ? 'animate-customSlideUp' : 'opacity-0'}`}
              style={{ animationDelay: '0.5s' }}
            >
              현장에서 확실하게 검증된 프리미엄 디저트 프랜차이즈 120겹파이.<br />
              독보적인 시그니처 디저트 파워와 체계적인 시스템을 토대로,<br />
              성공 가도를 함께 개척해 나갈{" "}
              <span className="relative inline-block px-1 z-10">
                {/* Secondary highlight line */}
                <span 
                  className={`absolute inset-x-0 bottom-0.5 h-2.5 bg-amber-400/40 -z-10 origin-left ${isCtaVisible ? 'animate-customDrawHighlight' : 'w-0'}`} 
                  style={{ animationDelay: '1.6s' }}
                />
                가맹점주님들을 정중히 모십니다.
              </span>
            </p>

            {/* CTA Button (Frank Green Style - Slide-up delay 0.7s) */}
            <div 
              className={`pt-2 ${isCtaVisible ? 'animate-customSlideUp' : 'opacity-0'}`}
              style={{ animationDelay: '0.7s' }}
            >
              <Link
                href="/franchise"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#7CB342] hover:bg-[#689F38] text-white font-extrabold text-xs sm:text-sm rounded-full transition-all duration-300 shadow-md hover:scale-105 active:scale-95 group/btn"
              >
                <span>빠른 창업 문의</span>
                <ArrowRight size={16} className="transition-transform duration-300 group-hover/btn:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Spacer to give visual relief between mosaic CTA and concept slider */}
      <div className="w-full h-16 sm:h-24 bg-white" />

      {/* 1.7. CONCEPT DUAL SLIDER SECTION (MODERN DUAL CONTEXT BANNER SLIDER) */}
      <section className="relative w-full overflow-hidden bg-neutral-950">
        <div 
          className="flex w-[200%] transition-transform duration-700 ease-out" 
          style={{ transform: `translateX(-${conceptIndex * 50}%)` }}
        >
          {/* SLIDE 1: BULGOGI PIZZA PIE CONCEPT */}
          <div className="w-1/2 flex flex-col md:flex-row relative h-[600px] sm:h-[800px] overflow-hidden shrink-0">
            {/* Left Side (Dark Image Bg - Pushed right for right-alignment) */}
            <div className="w-full md:w-1/2 h-1/2 md:h-full relative overflow-hidden flex items-center justify-center md:justify-end px-8 md:px-0 md:pr-16 lg:pr-24 py-10 md:py-0">
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity scale-102"
                style={{
                  backgroundImage: `url('https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784555995/8ebfb55d-2779-4bba-a676-c4c7c3dbedb9.png')`
                }}
              />
              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black/60 z-0" />
              
              {/* Embossed Watermark */}
              <div className="text-white/5 uppercase tracking-[0.2em] font-black text-6xl sm:text-[9rem] absolute right-6 md:right-16 top-6 md:top-20 select-none pointer-events-none">
                120PIE
              </div>

              {/* Title Text (3-lines, text-right) */}
              <div className="relative z-10 space-y-2 text-center md:text-right flex flex-col items-center md:items-end">
                <h4 className="text-neutral-400 font-extrabold text-xs sm:text-sm tracking-widest uppercase">
                  MASTER'S HANDS
                </h4>
                <p className="text-white font-extrabold text-3xl sm:text-5xl leading-tight tracking-tight">
                  40년 장인의<br />
                  손 끝에서 탄생한<br />
                  명품 파이
                </p>
              </div>
            </div>

            {/* Right Side (Flat Yellow Bg - Left-aligned text, pushed left to avoid 490px image overlap) */}
            <div className="w-full md:w-1/2 h-1/2 md:h-full relative overflow-hidden flex items-center justify-center md:justify-start bg-[#fbc400] px-8 md:px-0 md:pl-16 lg:pl-24 py-10 md:py-0">
              {/* Embossed Watermark */}
              <div className="text-[#0D233A]/5 uppercase tracking-[0.2em] font-black text-6xl sm:text-[9rem] absolute right-6 md:right-20 bottom-6 md:bottom-20 select-none pointer-events-none">
                CRAFT
              </div>

              {/* Copywriting Details (text-left) */}
              <div className="relative z-10 space-y-3 sm:space-y-5 text-center md:text-left flex flex-col items-center md:items-start text-[#0D233A] max-w-xs sm:max-w-md">
                <div className="space-y-1 sm:space-y-2">
                  <p className="font-bold text-xs sm:text-sm tracking-wider opacity-85">
                    봄, 여름, 가을, 겨울 사계절 인기 디저트 & 미트 파이
                  </p>
                  <h3 className="font-black text-3xl sm:text-5xl tracking-tighter">
                    120겹 파이
                  </h3>
                </div>
                
                <p className="font-black text-base sm:text-xl tracking-tight text-[#0D233A]/80">
                  #버거보다 간편하다.
                </p>

                <div className="pt-1.5">
                  <Link
                    href="/menu"
                    className="inline-flex items-center gap-1.5 px-6 py-2.5 sm:px-8 sm:py-3 border border-[#0D233A] text-[#0D233A] hover:bg-[#0D233A] hover:text-white font-extrabold text-xs sm:text-sm rounded-full transition-all duration-300 shadow-md group/btn"
                  >
                    <span>자세히 보기</span>
                    <ArrowRight size={14} className="transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Center Floating Pie 누끼 컷 (90% scaled down to 490px) */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 w-[220px] h-[220px] sm:w-[450px] sm:h-[450px] lg:w-[490px] lg:h-[490px] flex items-center justify-center pointer-events-none">
              <img
                src="https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784557545/%EC%A0%9C%EB%AA%A9%EC%9D%84_%EC%9E%85%EB%A0%A5%ED%95%B4%EC%A3%BC%EC%84%B8%EC%9A%94._12_1_qui5uq.png"
                alt="불고기 피자파이 시그니처"
                className="max-w-full max-h-full object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.18)] animate-bounceSlow"
              />
            </div>
          </div>

          {/* SLIDE 2: APPLE PIE CRUST CONCEPT */}
          <div className="w-1/2 flex flex-col md:flex-row relative h-[600px] sm:h-[800px] overflow-hidden shrink-0">
            {/* Left Side (Dark Image Bg - Pushed right for right-alignment) */}
            <div className="w-full md:w-1/2 h-1/2 md:h-full relative overflow-hidden flex items-center justify-center md:justify-end px-8 md:px-0 md:pr-16 lg:pr-24 py-10 md:py-0">
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity scale-102"
                style={{
                  backgroundImage: `url('https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784532165/ChatGPT_Image_2026%EB%85%84_7%EC%9B%94_20%EC%9D%BC_%EC%98%A4%ED%9B%84_04_22_32_hbcsfy.png')`
                }}
              />
              <div className="absolute inset-0 bg-black/60 z-0" />
              
              {/* Embossed Watermark */}
              <div className="text-white/5 uppercase tracking-[0.2em] font-black text-6xl sm:text-[9rem] absolute right-6 md:right-16 top-6 md:top-20 select-none pointer-events-none">
                PREMIUM
              </div>

              {/* Title Text (3-lines, text-right) */}
              <div className="relative z-10 space-y-2 text-center md:text-right flex flex-col items-center md:items-end">
                <h4 className="text-neutral-400 font-extrabold text-xs sm:text-sm tracking-widest uppercase">
                  DELICATE LAYERS
                </h4>
                <p className="text-white font-extrabold text-3xl sm:text-5xl leading-tight tracking-tight">
                  바삭함의 정점,<br />
                  120겹의 정성으로 구운<br />
                  수제 도우
                </p>
              </div>
            </div>

            {/* Right Side (Flat Orange/Yellow Bg - Left-aligned text, pushed left to avoid overlap) */}
            <div className="w-full md:w-1/2 h-1/2 md:h-full relative overflow-hidden flex items-center justify-center md:justify-start bg-[#E69A0B] px-8 md:px-0 md:pl-16 lg:pl-24 py-10 md:py-0">
              {/* Embossed Watermark */}
              <div className="text-white/5 uppercase tracking-[0.2em] font-black text-6xl sm:text-[9rem] absolute right-6 md:right-20 bottom-6 md:bottom-20 select-none pointer-events-none">
                SWEET
              </div>

              {/* Copywriting Details (text-left) */}
              <div className="relative z-10 space-y-3 sm:space-y-5 text-center md:text-left flex flex-col items-center md:items-start text-white max-w-xs sm:max-w-md">
                <div className="space-y-1 sm:space-y-2">
                  <p className="font-bold text-xs sm:text-sm tracking-wider opacity-85">
                    겉은 극강의 바삭함과 속은 새콤달콤한 사과 잼
                  </p>
                  <h3 className="font-black text-3xl sm:text-5xl tracking-tighter">
                    애플 파이
                  </h3>
                </div>
                
                <p className="font-black text-base sm:text-xl tracking-tight text-white/95">
                  #디저트의 격을 높이다.
                </p>

                <div className="pt-1.5">
                  <Link
                    href="/menu"
                    className="inline-flex items-center gap-1.5 px-6 py-2.5 sm:px-8 sm:py-3 border border-white text-white hover:bg-white hover:text-[#E69A0B] font-extrabold text-xs sm:text-sm rounded-full transition-all duration-300 shadow-md group/btn"
                  >
                    <span>자세히 보기</span>
                    <ArrowRight size={14} className="transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Center Floating Pie 누끼 컷 (90% scaled down to 490px) */}
            {/* Center Floating Pie 누끼 컷 (90% scaled down to 490px) */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 w-[220px] h-[220px] sm:w-[450px] sm:h-[450px] lg:w-[490px] lg:h-[490px] flex items-center justify-center pointer-events-none">
              <img
                src="https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784076388/edited-photo_-_2026-07-06T123253.062_abg0wv.png"
                alt="애플파이 시그니처"
                className="max-w-full max-h-full object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.18)] animate-bounceSlow"
              />
            </div>
          </div>
        </div>

        {/* Floating Indicator Controls (Indicators + Mouse Icon + Arrow Buttons) */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30 flex items-center gap-5 text-white/90 text-[11px] sm:text-xs font-bold tracking-widest">
          <button 
            onClick={handlePrevConcept}
            className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center transition-colors cursor-pointer"
          >
            <ChevronLeft size={16} />
          </button>
          
          <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-4 py-1.5 rounded-full select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-[#fbc400] animate-ping" />
            <span>CLICK TO SWITCH CONCEPTS</span>
          </div>

          <button 
            onClick={handleNextConcept}
            className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center transition-colors cursor-pointer"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </section>

      {/* 2. BRAND STORY SECTION */}
      <section ref={storyRef} className="py-20 sm:py-28 bg-white overflow-hidden">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16 items-center">
            
            {/* Left Texts */}
            <div className="lg:col-span-5 space-y-8 text-left">
              <div className="space-y-3">
                <span className="text-[#fbc400] font-black text-xs sm:text-sm uppercase tracking-widest block">
                  Brand Philosophy
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-[#0D233A] leading-tight tracking-tight">
                  더 풍성하게,<br />더 바삭하게 120겹
                </h2>
              </div>
              <p className="text-neutral-500 font-medium text-xs sm:text-sm leading-relaxed">
                120pie는 전통적인 베이킹 철학을 기반으로, 현대인들이 가장 사랑하는 고품격 시그니처 디저트를 가장 합리적인 가격에 선보입니다.
                우리가 도우를 밀고 또 밀어 완성한 120겹의 결은 단순한 숫자가 아닌, 타협하지 않는 품질의 약속이자 프리미엄 수제파이의 기준입니다.
              </p>

              {/* Core Features Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-amber-50/40 border border-[#e6dfc3]/40 flex gap-3 items-start">
                  <div className="p-2 bg-[#fbc400]/10 text-[#fbc400] rounded-xl shrink-0">
                    <Award size={18} />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-[#0D233A] mb-1">120겹 페이스트리</h4>
                    <p className="text-[10px] text-neutral-400 font-bold leading-normal">
                      결 하나하나가 살아있는 최상의 바삭함
                    </p>
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-amber-50/40 border border-[#e6dfc3]/40 flex gap-3 items-start">
                  <div className="p-2 bg-[#fbc400]/10 text-[#fbc400] rounded-xl shrink-0">
                    <Globe size={18} />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-[#0D233A] mb-1">자체 물류 시스템</h4>
                    <p className="text-[10px] text-neutral-400 font-bold leading-normal">
                      위생적인 전용 패키지로 신선하게 공급
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Images (Visual Showcase) */}
            <div className="lg:col-span-7 grid grid-cols-12 gap-4 relative">
              <div className="col-span-8 rounded-3xl overflow-hidden shadow-xl aspect-[4/3] group">
                <img
                  src={storyImage1}
                  alt="120pie 수제파이 연출 컷"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="col-span-4 rounded-3xl overflow-hidden shadow-xl aspect-square self-end group">
                <img
                  src={storyImage2}
                  alt="120pie 매장 분위기"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              {/* Highlight Circle element */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
            </div>

          </div>
        </div>
      </section>

      {/* 3. SIGNATURE MENU SHOWCASE SECTION */}
      <section ref={menuRef} className="py-20 sm:py-28 bg-[#fffdf5]/50 border-t border-[#e6dfc3]/30">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          
          {/* Header */}
          <div className="space-y-3 max-w-xl mx-auto">
            <span className="text-[#fbc400] font-black text-xs sm:text-sm uppercase tracking-widest block">
              120PIE Menu
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0D233A] tracking-tight">
              매일 특별해지는 120겹의 선택
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 font-bold">
              120겹파이의 풍미를 입안 가득 느껴보세요.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto border-b border-[#e6dfc3]/40 pb-4">
            {Object.keys(MENU_DATA).map((catKey) => {
              const category = MENU_DATA[catKey];
              const isActive = activeCategory === catKey;
              return (
                <button
                  key={catKey}
                  onClick={() => {
                    setActiveCategory(catKey);
                    setSelectedMenuItem(null);
                  }}
                  className={`px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#fbc400] text-[#0D233A] shadow-md shadow-[#fbc400]/25"
                      : "bg-white border border-[#e6dfc3]/60 text-neutral-500 hover:border-[#fbc400] hover:text-[#fbc400]"
                  }`}
                >
                  {category.label}
                </button>
              );
            })}
          </div>

          {/* Category Description */}
          <div className="max-w-2xl mx-auto space-y-1">
            <h3 className="font-extrabold text-sm sm:text-base text-[#0D233A]">
              {MENU_DATA[activeCategory].title}
            </h3>
            <p className="text-[11px] sm:text-xs text-neutral-400 font-bold max-w-lg mx-auto">
              {MENU_DATA[activeCategory].desc}
            </p>
          </div>

          {/* Menu Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {MENU_DATA[activeCategory].items.map((item) => (
              <div
                key={item.name}
                onClick={() => setSelectedMenuItem(item)}
                className="bg-white border border-[#e6dfc3]/30 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer hover:-translate-y-1"
              >
                {/* Image Wrap */}
                <div className="aspect-[4/3] w-full overflow-hidden bg-neutral-50 relative">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-104"
                  />
                  {item.tag && (
                    <span className="absolute top-4 left-4 bg-red-500 text-white font-extrabold text-[9px] px-2.5 py-0.5 rounded-full shadow-sm">
                      {item.tag}
                    </span>
                  )}
                  {item.badge && (
                    <span className="absolute top-4 right-4 bg-amber-400 text-stone-900 font-extrabold text-[9px] px-2.5 py-0.5 rounded-full shadow-sm">
                      {item.badge}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 space-y-2">
                  <h4 className="font-extrabold text-sm text-[#0D233A] group-hover:text-[#fbc400] transition-colors">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-neutral-400 font-bold leading-relaxed line-clamp-2">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. STORE FINDER SIMULATOR SECTION */}
      <section ref={storeRef} className="py-20 sm:py-28 bg-white border-t border-[#e6dfc3]/20">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-amber-50/30 border border-[#e6dfc3]/50 rounded-3xl p-8 sm:p-12 md:p-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Info */}
            <div className="lg:col-span-5 space-y-6 text-left">
              <span className="text-[#fbc400] font-black text-xs sm:text-sm uppercase tracking-widest block">
                Find Store
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#0D233A] leading-tight tracking-tight">
                가장 가까운 120pie<br />매장을 찾아보세요!
              </h2>
              <p className="text-neutral-500 font-medium text-xs sm:text-sm leading-relaxed">
                전국 백화점 및 로드샵에서 갓 구운 바삭한 120겹파이를 즐기실 수 있습니다.
                아래 검색 폼을 사용하여 시뮬레이션 해보세요.
              </p>
            </div>

            {/* Right Simulator Form */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-[#e6dfc3]/40 shadow-xl shadow-amber-400/5">
              <form onSubmit={handleSearchSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="flex flex-col gap-1.5 text-left">
                    <label className="text-[10px] font-black text-[#0D233A] uppercase tracking-wider">지역 선택</label>
                    <select
                      value={searchRegion}
                      onChange={(e) => setSearchRegion(e.target.value)}
                      className="w-full bg-neutral-50 border border-[#e6dfc3]/80 rounded-xl px-3 py-3 text-xs font-bold text-[#0D233A] focus:outline-none focus:border-[#fbc400]"
                    >
                      <option value="전체">전국 매장</option>
                      <option value="서울">서울특별시</option>
                      <option value="경기">경기도</option>
                      <option value="인천">인천광역시</option>
                      <option value="부산">부산광역시</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5 text-left sm:col-span-2">
                    <label className="text-[10px] font-black text-[#0D233A] uppercase tracking-wider">매장명/주소 검색</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="매장명 또는 동(읍/면) 입력"
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        className="flex-1 bg-neutral-50 border border-[#e6dfc3]/80 rounded-xl px-4 py-3 text-xs font-bold text-[#0D233A] placeholder-neutral-400 focus:outline-none focus:border-[#fbc400]"
                      />
                      <button
                        type="submit"
                        className="px-5 bg-[#fbc400] hover:bg-[#e0a800] text-[#0D233A] rounded-xl flex items-center justify-center transition-colors cursor-pointer border-0 shadow-sm"
                      >
                        <Search size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Simulated Map Container Placeholder */}
                <div className="h-44 sm:h-52 w-full rounded-2xl bg-neutral-100 border border-neutral-200 overflow-hidden relative flex flex-col justify-center items-center text-center">
                  <MapPin size={28} className="text-[#fbc400] animate-bounce mb-2" />
                  <span className="font-extrabold text-xs text-[#0D233A]">실시간 지도 API 연동 영역</span>
                  <span className="text-[10px] text-neutral-400 font-bold mt-1">네이버/카카오 지도 API 모듈이 마운트됩니다.</span>
                </div>
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* 5. NEWS & EVENT GRID SECTION */}
      <section ref={newsRef} className="py-20 sm:py-28 bg-[#fffdf5]/30 border-t border-[#e6dfc3]/20">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          
          {/* Header */}
          <div className="space-y-3 max-w-xl mx-auto">
            <span className="text-[#fbc400] font-black text-xs sm:text-sm uppercase tracking-widest block">
              120PIE NEWS
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0D233A] tracking-tight">
              120pie의 즐거운 이벤트 & 새소식
            </h2>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {[
              {
                title: "120겹파이 7월 여름 한정 신메뉴 컵빙수 2종 대공개!",
                date: "2026-07-15",
                tag: "Event",
                desc: "말차컵팥빙수 and 인절미컵팥빙수가 출시되었습니다. 전국 매장에서 만나보세요!",
              },
              {
                title: "120pie 가맹사업지원센터 본사 사옥 확장이전 안내",
                date: "2026-07-10",
                tag: "Notice",
                desc: "더 체계적이고 신속한 가맹 관리를 위해 본사 사옥을 확장 이전하여 새 출발을 시작합니다.",
              },
              {
                title: "[보도자료] 120겹파이, '2026 올해의 디저트 프랜차이즈 대상' 수상",
                date: "2026-07-01",
                tag: "PR",
                desc: "독창적인 120겹 수제 도우 패키지 공법으로 고객 만족도 극대화에 기여한 공로를 인정받았습니다.",
              },
            ].map((news, i) => (
              <div
                key={i}
                className="bg-white border border-[#e6dfc3]/40 rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                      news.tag === "Event" ? "bg-red-50 text-red-500 border border-red-100" :
                      news.tag === "Notice" ? "bg-blue-50 text-blue-500 border border-blue-100" :
                      "bg-green-50 text-green-500 border border-green-100"
                    }`}>
                      {news.tag}
                    </span>
                    <span className="text-[10px] text-neutral-400 font-bold">{news.date}</span>
                  </div>
                  <h3 className="font-extrabold text-sm sm:text-base text-[#0D233A] leading-tight line-clamp-2">
                    {news.title}
                  </h3>
                  <p className="text-xs text-neutral-400 font-medium leading-relaxed">
                    {news.desc}
                  </p>
                </div>
                <div className="pt-6 border-t border-neutral-100 flex items-center justify-between text-xs font-bold text-[#fbc400] hover:text-[#e0a800] transition-colors cursor-pointer group/btn">
                  <span>자세히 보기</span>
                  <ArrowRight size={14} className="transition-transform duration-300 group-hover/btn:translate-x-0.5" />
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-neutral-50 border-t border-[#e6dfc3]/40 py-12 sm:py-16 text-neutral-400">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-left">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-8 border-b border-neutral-200">
            <img
              src="https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784533894/Group_1_4_jl4rlr.png"
              alt="120pie 로고"
              className="h-8 w-auto object-contain brightness-75 grayscale"
            />
            <div className="flex flex-wrap gap-4 text-xs font-bold text-neutral-400">
              <a href="#" className="hover:text-neutral-600 transition-colors">회사소개</a>
              <a href="#" className="hover:text-neutral-600 transition-colors">이용약관</a>
              <a href="#" className="hover:text-neutral-600 transition-colors">개인정보처리방침</a>
              <Link href="/franchise" className="hover:text-neutral-600 transition-colors text-amber-600 font-extrabold">가맹문의</Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[11px] font-bold leading-relaxed">
            <div className="space-y-1">
              <p>주식회사 120파이 코퍼레이션 | 대표이사: 관리자</p>
              <p>본사 주소: 경기도 안양시 만안구 가맹사업지원센터 본사 120겹파이 빌딩 3층</p>
              <p>사업자등록번호: 000-00-00000 | 통신판매업신고번호: 제0000-경기안양-0000호</p>
            </div>
            <div className="md:text-right space-y-1 flex flex-col md:items-end">
              <p>가맹상담 대표번호: 1688-0000 (평일 09:00 ~ 18:00)</p>
              <p>이메일: franchise@120pie.com | 제휴문의: partner@120pie.com</p>
              <p className="text-[10px] text-neutral-400 tracking-wider mt-2">
                © 120PIE Corp. All rights reserved.
              </p>
            </div>
          </div>

        </div>
      </footer>

      {/* MENU DETAIL DIALOG MODAL (POPUP) */}
      {selectedMenuItem && (
        <div
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn"
          onClick={() => setSelectedMenuItem(null)}
        >
          <div
            className="w-full max-w-lg bg-white border border-[#e6dfc3]/40 rounded-[2rem] overflow-hidden shadow-2xl flex flex-col relative my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header close button */}
            <button
              onClick={() => setSelectedMenuItem(null)}
              className="absolute top-4 right-4 z-10 p-2 text-neutral-400 hover:text-neutral-600 bg-white border border-neutral-100 rounded-full cursor-pointer shadow-sm"
            >
              <X size={16} />
            </button>

            {/* Image */}
            <div className="aspect-[4/3] w-full bg-neutral-50 relative">
              <img
                src={selectedMenuItem.img}
                alt={selectedMenuItem.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8 space-y-4 text-left">
              <div className="flex gap-2 items-center flex-wrap">
                {selectedMenuItem.tag && (
                  <span className="bg-red-50 text-red-500 font-extrabold text-[9px] px-2.5 py-0.5 rounded-full border border-red-100">
                    {selectedMenuItem.tag}
                  </span>
                )}
                {selectedMenuItem.badge && (
                  <span className="bg-amber-50 text-amber-600 font-extrabold text-[9px] px-2.5 py-0.5 rounded-full border border-amber-100">
                    {selectedMenuItem.badge}
                  </span>
                )}
                <h3 className="text-lg sm:text-xl font-black text-[#0D233A]">
                  {selectedMenuItem.name}
                </h3>
              </div>
              
              <p className="text-xs sm:text-sm text-neutral-500 font-medium leading-relaxed">
                {selectedMenuItem.desc}
              </p>

              <div className="pt-4 border-t border-neutral-100 flex items-center gap-3">
                <div className="p-2.5 bg-neutral-50 text-[#fbc400] rounded-2xl">
                  <Info size={16} />
                </div>
                <div className="text-[10px] text-neutral-400 font-bold leading-normal">
                  <p className="text-neutral-600">추가 상세 영양 성분 고지</p>
                  <p>본 상품의 실제 조리 및 연출 방식은 매장 상황에 따라 일부 상이할 수 있습니다.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
