"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { 
  Menu, X, Play, Pause, MapPin, Search, ArrowRight, Info, 
  Sparkles, Award, Globe, Heart, ChevronRight, ChevronLeft,
  MoveLeft, MoveRight, Plus
} from "lucide-react";
import { MENU_DATA } from "@/app/constants/menu";
import { optimizeCloudinaryUrl } from "@/app/utils/cloudinary";
import { getInstagramThumbnailUrl, INSTAGRAM_FALLBACK_IMAGE } from "@/app/utils/instagram";
import QuickInquiryBar from "@/components/landing-v6/QuickInquiryBar";
import InteriorConcept from "@/components/landing-v6/InteriorConcept";
import ConsultationForm from "@/components/ConsultationForm";
import RightFloatingQuickBar from "@/components/RightFloatingQuickBar";
import RightSideInquiryBanner from "@/components/RightSideInquiryBanner";
import BrandHeader from "@/components/BrandHeader";
import Footer from "@/app/components/Footer";

const SIGNATURE_MENUS = [
  {
    name: "꿀호떡파이",
    subName: "Honey Hotteok Pie",
    label: "NEW",
    img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784076391/edited-photo_-_2026-07-06T123534.491_cumykv.png",
  },
  {
    name: "카야치즈파이",
    subName: "Kaya Cheese Pie",
    label: "NEW",
    img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1785389819/edited-photo_-_2026-07-30T122142.921_k6tlef.png",
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
    img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784618343/ChatGPT_Image_2026%EB%85%84_6%EC%9B%94_30%EC%9D%BC_%EC%98%A4%ED%9B%84_05_58_55_lgju9e.png",
  },
  {
    id: 2,
    title: "여름 신메뉴 컵빙수 출시",
    desc: "말차 & 인절미 컵빙수 2종",
    img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1785389750/ChatGPT_Image_2026%EB%85%84_7%EC%9B%94_30%EC%9D%BC_%EC%98%A4%ED%9B%84_02_35_35_pdjpit.png",
  }
];

const VERTICAL_BANNER = {
  title: "7월 신메뉴 공식 출시",
  desc: "바삭함과 달콤함의 극치",
  img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784618964/ChatGPT_Image_2026%EB%85%84_7%EC%9B%94_12%EC%9D%BC_%EC%98%A4%ED%9B%84_03_57_46_zhjse3.png",
};

const HORIZONTAL_BANNER = {
  title: "120겹파이 맛의 결정체",
  desc: "120겹의 페이스트리 수제파이와 함께하는 특별한 하루",
  img: "https://res.cloudinary.com/dfkntvpmv/image/upload/f_auto,q_auto/v1783479315/ChatGPT_Image_2026%EB%85%84_7%EC%9B%94_8%EC%9D%BC_%EC%98%A4%EC%A0%84_11_55_08_qd2nni.png"
};

const CONCEPT_SLIDES = [
  {
    id: 1,
    leftBg: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784555995/8ebfb55d-2779-4bba-a676-c4c7c3dbedb9.png",
    leftWatermark: "120PIE",
    leftSubtitle: "MASTER'S HANDS",
    leftTitle: <>40년 장인의<br />손 끝에서 탄생한<br />명품 파이</>,
    rightBgColor: "#fbc400",
    rightWatermark: "CRAFT",
    rightDesc: "봄, 여름, 가을, 겨울 사계절 인기 디저트 & 미트 파이",
    rightTitle: "120겹 파이",
    rightHash: "#버거보다 간편하다.",
    categoryUrl: "/brand/menu?category=120겹파이",
    centerImg: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784557545/%EC%A0%9C%EB%AA%A9%EC%9D%84_%EC%9E%85%EB%A0%A5%ED%95%B4%EC%A3%BC%EC%84%B8%EC%9A%94._12_1_qui5uq.png",
    centerAlt: "불고기 피자파이 시그니처",
    textColorClass: "text-[#0D233A]",
    watermarkColorClass: "text-[#0D233A]/5",
    hashColorClass: "text-[#0D233A]/80",
    buttonBorderClass: "border-[#0D233A]",
    buttonTextClass: "text-[#0D233A]",
    buttonHoverClass: "hover:bg-[#0D233A] hover:text-white"
  },
  {
    id: 2,
    leftBg: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784555518/4344223e-1040-4413-9233-bf6b98fe0412.png",
    leftWatermark: "PATENT",
    leftSubtitle: "PATENTED RECIPE",
    leftTitle: <>독창적인 기술로 완성한<br />특허받은 영양 간식<br />리얼 계란빵</>,
    rightBgColor: "#D97706",
    rightWatermark: "REAL",
    rightDesc: "아침 식사 대용으로도 든든한 고소함",
    rightTitle: "리얼 계란빵",
    rightHash: "#특허 기술로 겉바속촉 완성.",
    categoryUrl: "/brand/menu?category=에그120",
    centerImg: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784594966/2_1_vrp1nm.png",
    centerAlt: "특허받은 리얼 계란빵",
    textColorClass: "text-white",
    watermarkColorClass: "text-white/5",
    hashColorClass: "text-white/95",
    buttonBorderClass: "border-white",
    buttonTextClass: "text-white",
    buttonHoverClass: "hover:bg-white hover:text-[#D97706]"
  },
  {
    id: 3,
    leftBg: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784555544/441a0be2-7572-4744-b260-ce701e3d84aa.png",
    leftWatermark: "SPAIN",
    leftSubtitle: "TRADITIONAL STYLE",
    leftTitle: <>스페인 정통 레시피로<br />바삭하게 튀겨낸<br />오리지널 츄러스</>,
    rightBgColor: "#78350F",
    rightWatermark: "SWEET",
    rightDesc: "시나몬 슈가의 깊은 풍미와 쫄깃한 식감",
    rightTitle: "정통 츄러스",
    rightHash: "#바삭하고 깃털처럼 가벼운 달콤함.",
    categoryUrl: "/brand/menu?category=기타",
    centerImg: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784595523/3_1_1_rvgru7.png",
    centerAlt: "스페인 정통 츄러스",
    textColorClass: "text-white",
    watermarkColorClass: "text-white/5",
    hashColorClass: "text-white/95",
    buttonBorderClass: "border-white",
    buttonTextClass: "text-white",
    buttonHoverClass: "hover:bg-white hover:text-[#78350F]"
  },
  {
    id: 4,
    leftBg: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784555781/30929f3b-eb6f-4527-bde6-d70c23dd44e9.png",
    leftWatermark: "HOTDOG",
    leftSubtitle: "SMOKY FLAVOR",
    leftTitle: <>리얼 직화 불고기와<br />육즙 가득 소시지의<br />환상적인 조화</>,
    rightBgColor: "#991B1B",
    rightWatermark: "GRILL",
    rightDesc: "풍성한 소스와 직화 불고기 토핑",
    rightTitle: "불고기 핫도그",
    rightHash: "#소시지와 직화 불고기의 강력한 한 방.",
    categoryUrl: "/brand/menu?category=기타",
    centerImg: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784594967/4_1_zdxbzj.png",
    centerAlt: "직화로 맛을 낸 불고기 핫도그",
    textColorClass: "text-white",
    watermarkColorClass: "text-white/5",
    hashColorClass: "text-white/95",
    buttonBorderClass: "border-white",
    buttonTextClass: "text-white",
    buttonHoverClass: "hover:bg-white hover:text-[#991B1B]"
  },
  {
    id: 5,
    leftBg: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784555770/ChatGPT_Image_2026%EB%85%84_7%EC%9B%94_14%EC%9D%BC_%EC%98%A4%ED%9B%84_09_44_28_futlho.png",
    leftWatermark: "COFFEE",
    leftSubtitle: "SINGLE ORIGIN SPECIALTY",
    leftTitle: <>해발 2,000m의 축복,<br />바링고 화산 지대의<br />아프리카 야생미</>,
    rightBgColor: "#0F172A",
    rightWatermark: "KENYA",
    rightDesc: "풍부한 바디감과 화사한 산미의 예술",
    rightTitle: "케냐 바링고 커피",
    rightHash: "#마지막 한 모금까지 선명한 아로마.",
    categoryUrl: "/brand/menu?category=coffee120",
    centerImg: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784594967/5_1_pvj7nw.png",
    centerAlt: "향이 끝까지 살아있는 케냐 바링고 커피",
    textColorClass: "text-white",
    watermarkColorClass: "text-white/5",
    hashColorClass: "text-white/95",
    buttonBorderClass: "border-white",
    buttonTextClass: "text-white",
    buttonHoverClass: "hover:bg-white hover:text-[#0F172A]"
  }
];

const VIRAL_CARDS = [
  {
    id: 1,
    img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784860823/image_1_1_rnmure.png",
    title: "가수 강*경(브이로그 방송분)",
  },
  {
    id: 2,
    img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784601503/Group_1_5_aychtd.png",
    title: "가수 송*호 (나혼자산다 방송분)",
  },
  {
    id: 3,
    img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784601504/Group_3_1_ndlggk.png",
    title: "유튜버 [입*은*님] 구독자 165만명",
  },
  {
    id: 4,
    img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784601504/Group_2_1_wppg4d.png",
    title: "유튜버 [코*트] 구독자 55만명",
  },
  {
    id: 5,
    img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784601504/Group_4_j8jvr2.png",
    title: "유튜버 [효*] 구독자 44만명",
  },
  {
    id: 6,
    img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784601504/Group_5_zzmzbr.png",
    title: "유튜버 [주*커플] 구독자 16만명",
  }
];

import { useModalBackHandler } from "@/components/MobileBackManager";

export default function BrandHome() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isConsulting, setIsConsulting] = useState(false);

  useModalBackHandler("brand-consulting-modal", isConsulting, () => setIsConsulting(false));
  const [activeCategory, setActiveCategory] = useState("120겹파이");
  const [searchRegion, setSearchRegion] = useState("전체");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedMenuItem, setSelectedMenuItem] = useState<any>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuIndex, setMenuIndex] = useState(9);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [moveStep, setMoveStep] = useState(33.333);
  
  // Custom Slider and Video States
  const [currentSlide, setCurrentSlide] = useState(2);
  const [isSlidePlaying, setIsSlidePlaying] = useState(true);
  const [isSlideTransitioning, setIsSlideTransitioning] = useState(true);
  const [bannerDragStart, setBannerDragStart] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [isBannerDragging, setIsBannerDragging] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isIntroActive, setIsIntroActive] = useState(true);
  const [isIntroFadeOut, setIsIntroFadeOut] = useState(false);
  const [introProgress, setIntroProgress] = useState(0);
  const [isLogoZoomed, setIsLogoZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [trailPos, setTrailPos] = useState({ x: -100, y: -100 });
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
  const [conceptIndex, setConceptIndex] = useState(5);
  const [isConceptTransitioning, setIsConceptTransitioning] = useState(true);

  // Concept Slider Drag & Swipe State
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Instagram States
  const convexInstagram = useQuery(api.instagram.list);
  const [selectedInsta, setSelectedInsta] = useState<any | null>(null);
  const [instaSliderIndex, setInstaSliderIndex] = useState(0);
  const [instaVisibleCount, setInstaVisibleCount] = useState(4);

  // Celeb Viral Slider State
  const [viralIndex, setViralIndex] = useState(0);
  const [viralVisibleCount, setViralVisibleCount] = useState(4);

  // Celeb Viral Slider Responsive Effect
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setViralVisibleCount(4);
      } else if (window.innerWidth >= 768) {
        setViralVisibleCount(2);
      } else {
        setViralVisibleCount(1);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handlePrevViral = () => {
    setViralIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNextViral = () => {
    setViralIndex((prev) => Math.min(prev + 1, VIRAL_CARDS.length - viralVisibleCount));
  };

  // Instagram Slider Responsive Effect
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setInstaVisibleCount(4);
      } else if (window.innerWidth >= 768) {
        setInstaVisibleCount(3);
      } else {
        setInstaVisibleCount(2); // 모바일 화면에서 2개씩 보이도록 수정
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handlePrevInsta = () => {
    setInstaSliderIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNextInsta = () => {
    if (sortedInstagram.length === 0) return;
    setInstaSliderIndex((prev) => Math.min(prev + 1, sortedInstagram.length - instaVisibleCount));
  };

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
  // Welcome Splash Screen timers (Zoom, Progress, Fadeout, Removal)
  useEffect(() => {
    const zoomTimer = setTimeout(() => {
      setIsLogoZoomed(true);
    }, 100);
    const progressTimer = setTimeout(() => {
      setIntroProgress(100);
    }, 150);
    const fadeTimer = setTimeout(() => {
      setIsIntroFadeOut(true);
    }, 1800);
    const removeTimer = setTimeout(() => {
      setIsIntroActive(false);
    }, 2300);
    return () => {
      clearTimeout(zoomTimer);
      clearTimeout(progressTimer);
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  // Force HTML5 video muted autoplay bypassing browser security rules
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch((err) => {
        console.log("Video play failed:", err);
      });
    }
  }, []);  // Real-time Mousemove Listener (Desktop only)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Lerp (Linear Interpolation) Loop for Spring Easing Cursor Follower
  useEffect(() => {
    let active = true;
    const lerpLoop = () => {
      setTrailPos((prev) => {
        const dx = mousePos.x - prev.x;
        const dy = mousePos.y - prev.y;
        // 0.35 속도로 빠르게 추적하면서도 부드러움 유지
        return {
          x: prev.x + dx * 0.35,
          y: prev.y + dy * 0.35
        };
      });
      if (active) {
        requestAnimationFrame(lerpLoop);
      }
    };
    requestAnimationFrame(lerpLoop);
    return () => {
      active = false;
    };
  }, [mousePos]);

  // Restore transition state for slider loops
  useEffect(() => {
    if (!isSlideTransitioning) {
      const raf = requestAnimationFrame(() => {
        setIsSlideTransitioning(true);
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [isSlideTransitioning]);

  const handleTransitionEnd = () => {
    if (currentSlide === 0) {
      setIsSlideTransitioning(false);
      setCurrentSlide(2);
    } else if (currentSlide === 4) {
      setIsSlideTransitioning(false);
      setCurrentSlide(2);
    }
  };

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

  const handleBannerDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    setBannerDragStart(clientX);
    setIsBannerDragging(true);
  };

  const handleBannerDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isBannerDragging || bannerDragStart === null) return;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const deltaX = clientX - bannerDragStart;
    setDragOffset(deltaX);
  };

  const handleBannerDragEnd = () => {
    if (!isBannerDragging) return;
    
    let nextSlide = currentSlide;
    // Swipe check (80px threshold)
    if (dragOffset < -80) {
      setIsSlideTransitioning(true);
      nextSlide = currentSlide + 1;
      setCurrentSlide(nextSlide);
    } else if (dragOffset > 80) {
      setIsSlideTransitioning(true);
      nextSlide = currentSlide - 1;
      setCurrentSlide(nextSlide);
    } else {
      setDragOffset(0);
      setIsBannerDragging(false);
      setBannerDragStart(null);
      return;
    }
    
    setIsBannerDragging(false);
    setBannerDragStart(null);
    setDragOffset(0);

    // 500ms(transition) 후에 리셋 fallback 실행
    setTimeout(() => {
      if (nextSlide === 0 || nextSlide === 4) {
         setIsSlideTransitioning(false);
         setCurrentSlide(2);
      }
    }, 500);
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

  // 대표메뉴 자동 슬라이드 & 마우스/터치 드래그 상태
  const [isMenuHovered, setIsMenuHovered] = useState(false);
  const [menuDragStartX, setMenuDragStartX] = useState<number | null>(null);
  const [menuDragOffset, setMenuDragOffset] = useState(0);
  const [isMenuDragging, setIsMenuDragging] = useState(false);

  // 대표메뉴 자동 슬라이드 (1.75초마다 2배 빠르게 자연스럽게 왼쪽 방향으로 이동)
  useEffect(() => {
    if (isMenuHovered || isMenuDragging) return;
    const timer = setInterval(() => {
      setMenuIndex((prev) => prev + 1);
    }, 1750);
    return () => clearInterval(timer);
  }, [isMenuHovered, isMenuDragging]);

  const handleMenuDragStart = (clientX: number) => {
    setMenuDragStartX(clientX);
    setIsMenuDragging(true);
    setMenuDragOffset(0);
  };

  const handleMenuDragMove = (clientX: number) => {
    if (!isMenuDragging || menuDragStartX === null) return;
    setMenuDragOffset(menuDragStartX - clientX);
  };

  const handleMenuDragEnd = () => {
    if (!isMenuDragging) return;
    const threshold = 40;
    if (menuDragOffset > threshold) {
      setMenuIndex((prev) => prev + 1);
    } else if (menuDragOffset < -threshold) {
      setMenuIndex((prev) => prev - 1);
    }
    setMenuDragStartX(null);
    setMenuDragOffset(0);
    setIsMenuDragging(false);
  };

  const handlePrevConcept = () => {
    setConceptIndex((prev) => prev - 1);
  };

  const handleNextConcept = () => {
    setConceptIndex((prev) => prev + 1);
  };

  const handleDragStart = (clientX: number) => {
    setDragStartX(clientX);
    setIsDragging(true);
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging || dragStartX === null) return;
  };

  const handleDragEnd = (clientX: number) => {
    if (!isDragging || dragStartX === null) return;
    const diffX = dragStartX - clientX;
    const swipeThreshold = 50; // 50px

    if (diffX > swipeThreshold) {
      handleNextConcept();
    } else if (diffX < -swipeThreshold) {
      handlePrevConcept();
    }

    setDragStartX(null);
    setIsDragging(false);
  };

  const extendedMenus = [
    ...SIGNATURE_MENUS,
    ...SIGNATURE_MENUS,
    ...SIGNATURE_MENUS
  ];

  const extendedConceptSlides = [
    ...CONCEPT_SLIDES,
    ...CONCEPT_SLIDES,
    ...CONCEPT_SLIDES
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

  // Concept Slider Infinite Loop resetting effect
  useEffect(() => {
    if (conceptIndex < CONCEPT_SLIDES.length) {
      const timer = setTimeout(() => {
        setIsConceptTransitioning(false);
        setConceptIndex(conceptIndex + CONCEPT_SLIDES.length);
      }, 700); // 700ms transition time
      return () => clearTimeout(timer);
    }
    if (conceptIndex >= CONCEPT_SLIDES.length * 2) {
      const timer = setTimeout(() => {
        setIsConceptTransitioning(false);
        setConceptIndex(conceptIndex - CONCEPT_SLIDES.length);
      }, 700);
      return () => clearTimeout(timer);
    }
    setIsConceptTransitioning(true);
  }, [conceptIndex]);

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

  // Sort Instagram feeds: isMain === true comes first, then orderIndex ascending
  const sortedInstagram = convexInstagram 
    ? [...convexInstagram].sort((a, b) => (b.isMain ? 1 : 0) - (a.isMain ? 1 : 0) || a.orderIndex - b.orderIndex)
    : [];

  return (
    <div className="min-h-screen bg-white text-[#0D233A] font-sans antialiased selection:bg-[#fbc400] selection:text-white">
      
      {/* 120PIE Welcome Splash Intro Loader Screen */}
      {isIntroActive && (
        <div 
          className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#070b11] transition-all duration-[700ms] ease-in-out ${
            isIntroFadeOut ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100"
          }`}
        >
          <div className="flex flex-col items-center gap-8 max-w-[280px] sm:max-w-[340px] text-center px-4">
            {/* Emblem Gold Logo */}
            <div 
              className={`w-[160px] h-[160px] sm:w-[200px] sm:h-[200px] relative flex items-center justify-center transition-all duration-[1500ms] ease-out ${
                isLogoZoomed ? "scale-100 opacity-100 blur-0" : "scale-90 opacity-0 blur-md"
              }`}
            >
              <img
                src={optimizeCloudinaryUrl("https://res.cloudinary.com/lyjyvy54/image/upload/v1784642722/120%ED%8C%8C%EC%9D%B4_%EC%BB%A4%ED%94%BC_%EA%B8%88%EC%A0%95%EC%A0%90_%EC%B1%84%EB%84%90%EC%82%AC%EC%9D%B8_%EB%94%94%EC%9E%90%EC%9D%B8_250828_j3kejm.png")}
                alt="120겹파이 골드 로고"
                className="w-full h-full object-contain"
              />
            </div>
            
            {/* Luxury text */}
            <div 
              className={`flex flex-col gap-1.5 transition-all duration-[1200ms] delay-[200ms] ease-out ${
                isLogoZoomed ? "scale-100 opacity-100 blur-0" : "scale-95 opacity-0 blur-sm"
              }`}
            >
              <span className="text-[22px] sm:text-[26px] font-bold tracking-[0.25em] text-[#FBC400] font-sans">120PIE</span>
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.4em] text-neutral-400 font-medium">Premium Hand Pie & Coffee</span>
            </div>

            {/* Premium Gold Progress Bar */}
            <div className="w-full h-[2px] bg-neutral-800/80 rounded-full overflow-hidden relative mt-2">
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 rounded-full transition-all duration-[1850ms] ease-out" 
                style={{ width: `${introProgress}%` }}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* BRAND GNB HEADER */}
      <BrandHeader onConsultClick={() => setIsConsulting(true)} />

      {/* 1. BRAND HERO GRID REMODEL SECTION */}
      <section ref={heroRef} className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-8 md:pt-3 md:pb-10">
        
        {/* ROW 1: 3-Column Layout Flex (영상 가로 1000px, 배너 높이 563px) */}
        <div className="flex flex-col lg:flex-row gap-6 items-stretch w-full justify-between">
          
          {/* Column 1: Video Card (Shrinks from 1000px max, 563px height on large screens) */}
          <div className="w-full lg:flex-1 lg:max-w-[1000px] h-[350px] sm:h-[450px] lg:h-[563px] rounded-2xl overflow-hidden isolate shadow-md relative bg-neutral-900 border-0 group" style={{ transform: "translateZ(0)" }}>
            <video
              ref={videoRef}
              src="https://github.com/jihoon3813-commits/imgs_cafe120/raw/refs/heads/main/120%EA%B2%B9%ED%8C%8C%EC%9D%B4_%EB%A1%9C%EC%A0%9C,%EC%96%91%EC%86%A1%EC%9D%B4%20%EC%88%98%EC%A0%952.mp4"
              className="w-full h-full object-cover pointer-events-none"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
            />
          </div>

          {/* Column 2 & 3 wrapper for flexible rest space */}
          <div className="w-full lg:w-[848px] lg:shrink-0 flex flex-col sm:flex-row gap-6 h-auto lg:h-[563px]">
            
            {/* Column 2: Auto Slide Banner */}
            <div 
              onMouseDown={handleBannerDragStart}
              onMouseMove={handleBannerDragMove}
              onMouseUp={handleBannerDragEnd}
              onMouseLeave={handleBannerDragEnd}
              onTouchStart={handleBannerDragStart}
              onTouchMove={handleBannerDragMove}
              onTouchEnd={handleBannerDragEnd}
              className="flex-1 lg:w-[412px] lg:shrink-0 rounded-2xl overflow-hidden isolate shadow-md relative min-h-[350px] sm:min-h-[450px] lg:min-h-full bg-neutral-50 border border-neutral-100 flex flex-col group cursor-grab active:cursor-grabbing select-none"
              style={{ transform: "translateZ(0)" }}
            >
              {/* Background Slides Track (Slides horizontally in real-time on dragging, looping infinitely with 5 symmetric slides) */}
              <div 
                onTransitionEnd={handleTransitionEnd}
                className="absolute inset-0 flex"
                style={{
                  width: "500%",
                  transform: `translateX(calc(-${currentSlide * 20}% + ${dragOffset}px))`,
                  transition: isBannerDragging ? "none" : isSlideTransitioning ? "transform 500ms cubic-bezier(0.25, 1, 0.5, 1)" : "none"
                }}
              >
                {[SLIDE_BANNERS[1], SLIDE_BANNERS[0], SLIDE_BANNERS[1], SLIDE_BANNERS[0], SLIDE_BANNERS[1]].map((slide, index) => (
                  <div
                    key={index}
                    className="h-full bg-cover bg-center shrink-0 flex-none"
                    style={{ 
                      width: "20%",
                      backgroundImage: `url('${slide.img}')` 
                    }}
                  />
                ))}
              </div>

              {/* Slider Capsule Control (Bottom-Right corner control bar) */}
              <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md rounded-full px-4 py-1.5 flex items-center gap-3 text-white text-xs select-none z-30 font-semibold shadow-md">
                {/* Prev Button */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsSlideTransitioning(true);
                    setCurrentSlide((prev) => prev - 1);
                  }}
                  className="hover:text-[#fbc400] transition-colors border-0 bg-transparent cursor-pointer p-0 text-white flex items-center justify-center"
                >
                  <ChevronLeft size={14} className="stroke-[2.5]" />
                </button>

                {/* Page Indicator */}
                <span className="tracking-widest tabular-nums text-[11px] font-bold">
                  {((currentSlide - 2 + SLIDE_BANNERS.length) % SLIDE_BANNERS.length) + 1} | {SLIDE_BANNERS.length}
                </span>

                {/* Next Button */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsSlideTransitioning(true);
                    setCurrentSlide((prev) => prev + 1);
                  }}
                  className="hover:text-[#fbc400] transition-colors border-0 bg-transparent cursor-pointer p-0 text-white flex items-center justify-center"
                >
                  <ChevronRight size={14} className="stroke-[2.5]" />
                </button>

                {/* Play/Pause Toggle */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsSlidePlaying(!isSlidePlaying);
                  }}
                  className="hover:text-[#fbc400] transition-colors border-0 bg-transparent cursor-pointer p-0 text-white flex items-center justify-center ml-1"
                >
                  {isSlidePlaying ? <Pause size={12} className="fill-white" /> : <Play size={12} className="fill-white" />}
                </button>
              </div>
            </div>

            {/* Column 3: Vertical Banner */}
            <div className="flex-1 lg:w-[412px] lg:shrink-0 rounded-2xl overflow-hidden isolate shadow-md relative min-h-[350px] sm:min-h-[450px] lg:min-h-full bg-neutral-900 border border-neutral-100 flex flex-col group" style={{ transform: "translateZ(0)" }}>
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-104"
                style={{ backgroundImage: `url('${VERTICAL_BANNER.img}')` }}
              />
            </div>

          </div>

        </div>

        {/* ROW 2: Horizontal Wide Banner (PC 전용, 모바일에서는 숨김 처리) */}
        <div className="hidden md:flex w-full mt-6 rounded-2xl overflow-hidden shadow-md border border-[#e6dfc3]/30 h-[400px] lg:h-[600px] relative group items-center">
          {/* Background image */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out scale-100 group-hover:scale-[1.01]"
            style={{ backgroundImage: `url('${optimizeCloudinaryUrl("https://res.cloudinary.com/lyjyvy54/image/upload/v1784639975/ChatGPT_Image_2026%EB%85%84_7%EC%9B%94_21%EC%9D%BC_%EC%98%A4%ED%9B%84_10_06_10_x0zh7m.png")}')` }}
          />
        </div>

      </section>

      {/* 1.5 DUAL CONCEPT MENU TAB SLIDER SECTION */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Title */}
          <div className="text-center mb-8 space-y-2">
            <span className="text-[#fbc400] font-black text-xs sm:text-sm uppercase tracking-widest block">
              120PIE & COFFEE
            </span>
            <h2 className="text-3xl sm:text-6xl font-extrabold text-neutral-950 uppercase tracking-wider">
              대표메뉴
            </h2>
          </div>

          {/* MOBILE ONLY MENU CAROUSEL (FRANK BURGER STYLE) */}
          <div className="md:hidden w-full space-y-4">
            {/* Scrollable Track */}
            <div className="flex gap-5 overflow-x-auto snap-x snap-mandatory px-4 py-4 no-scrollbar">
              {SIGNATURE_MENUS.map((menu, idx) => (
                <div
                  key={idx}
                  className="w-[270px] shrink-0 snap-center bg-[#F4F6F9] rounded-3xl p-6 flex flex-col items-center justify-between border border-neutral-200/50 shadow-sm relative min-h-[380px]"
                >
                  {/* Top Titles */}
                  <div className="text-center space-y-1 w-full z-10 pt-2">
                    <h3 className="text-xl font-extrabold text-amber-600">
                      {menu.name}
                    </h3>
                    <div className="w-6 h-[2px] bg-neutral-300 mx-auto my-1.5" />
                    <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                      {menu.subName}
                    </p>
                  </div>

                  {/* Badge */}
                  {menu.label && (
                    <span className={`absolute top-16 right-5 w-12 h-12 rounded-full flex items-center justify-center font-black text-xs shadow-md border-2 border-white z-20 ${
                      menu.label === "NEW" ? "bg-red-600 text-white" : "bg-[#fbc400] text-neutral-950"
                    }`}>
                      {menu.label}
                    </span>
                  )}

                  {/* Center Image */}
                  <div className="my-4 flex-1 flex items-center justify-center w-full relative">
                    <img
                      src={optimizeCloudinaryUrl(menu.img)}
                      alt={menu.name}
                      className="w-[190px] h-[190px] object-contain drop-shadow-md"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Drag & Drop Guide Indicator (Frank Burger Style) */}
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-neutral-400 pt-2">
              <span>←</span>
              <div className="w-5 h-8 rounded-full border-2 border-neutral-300 flex items-start justify-center p-1">
                <div className="w-1 h-2 bg-neutral-400 rounded-full animate-bounce" />
              </div>
              <span className="uppercase tracking-widest text-[10px] font-extrabold">DRAG & DROP</span>
              <span>→</span>
            </div>
          </div>

          {/* DESKTOP ONLY Carousel Layout */}
          <div className="hidden md:flex relative max-w-[1500px] mx-auto items-center justify-between gap-4 w-full px-4 md:px-12">
            {/* Left Button */}
            <button
              onClick={handlePrevMenu}
              className="z-10 w-12 h-12 rounded-full bg-neutral-800/80 hover:bg-neutral-900 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 shrink-0 cursor-pointer"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Viewport Wrapper */}
            <div 
              className="flex-1 overflow-hidden py-10 h-[350px] sm:h-[550px] flex items-center cursor-grab active:cursor-grabbing select-none"
              onMouseEnter={() => setIsMenuHovered(true)}
              onMouseLeave={() => {
                setIsMenuHovered(false);
                handleMenuDragEnd();
              }}
              onMouseDown={(e) => handleMenuDragStart(e.clientX)}
              onMouseMove={(e) => handleMenuDragMove(e.clientX)}
              onMouseUp={handleMenuDragEnd}
              onTouchStart={(e) => {
                setIsMenuHovered(true);
                handleMenuDragStart(e.touches[0].clientX);
              }}
              onTouchMove={(e) => handleMenuDragMove(e.touches[0].clientX)}
              onTouchEnd={() => {
                setIsMenuHovered(false);
                handleMenuDragEnd();
              }}
            >
              {/* Slider Track */}
              <div
                className="flex items-center w-full"
                style={{
                  transform: `translateX(calc(-${menuIndex * moveStep}% - ${menuDragOffset}px))`,
                  transition: isMenuDragging ? "none" : (isTransitioning ? "transform 450ms cubic-bezier(0.25, 1, 0.5, 1)" : "none")
                }}
              >
                {extendedMenus.map((menu, index) => {
                  const isCenter = index === menuIndex + (moveStep === 33.333 ? 1 : 0);
                  return (
                    <div key={index} className="w-full md:w-1/3 shrink-0 flex flex-col items-center justify-center group px-6 md:px-8">
                      {/* Round Background */}
                      <div
                        className={`rounded-full bg-[#F4F6F9] border border-neutral-200/40 flex flex-col justify-between items-center relative transition-all duration-700 cubic-bezier(0.25, 1, 0.5, 1) group-hover:bg-[#ECEFF2] group-hover:scale-102 ${
                          isCenter
                            ? "w-[270px] h-[270px] sm:w-[430px] sm:h-[430px] pt-8 pb-14 px-6"
                            : "w-[240px] h-[240px] sm:w-[380px] sm:h-[380px] pt-8 pb-12 px-4"
                        }`}
                      >
                        {/* Badge/Label */}
                        {menu.label && (
                          <span
                            className={`absolute rounded-full flex items-center justify-center font-black shadow-md border border-white group-hover:opacity-0 transition-opacity duration-300 z-20 ${
                              menu.label === "NEW"
                                ? "bg-red-600 text-white"
                                : "bg-[#fbc400] text-[#0D233A]"
                            } ${
                              isCenter
                                ? "top-0 right-0 translate-x-[20%] -translate-y-[20%] w-16 h-16 sm:w-24 sm:h-24 text-[11px] sm:text-base"
                                : "top-0 right-0 translate-x-[20%] -translate-y-[20%] w-12 h-12 sm:w-20 sm:h-20 text-[9px] sm:text-xs"
                            }`}
                          >
                            {menu.label}
                          </span>
                        )}

                        {/* Spacer */}
                        <div className="flex-1 flex items-center justify-center w-full min-h-0">
                          <img
                            src={optimizeCloudinaryUrl(menu.img)}
                            alt={menu.name}
                            className="w-[115%] h-auto max-h-[96%] object-contain transition-all duration-700 ease-out group-hover:rotate-6 group-hover:scale-120 scale-[1.28] translate-y-[8px] sm:translate-y-[14px]"
                          />
                        </div>

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-[#fbc400]/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 sm:p-8 text-white z-10 select-none rounded-full">
                          <div className="text-center space-y-1.5 sm:space-y-3">
                            <h4 className="font-black text-white leading-tight tracking-tight text-xl sm:text-[34px]">
                              {menu.name}
                            </h4>
                            <div className="w-8 h-[2px] bg-white mx-auto opacity-70" />
                            <p className="text-white/80 font-bold uppercase tracking-wider text-[11px] sm:text-[16px]">
                              {menu.subName}
                            </p>
                          </div>
                        </div>

                        {/* Names & Subnames */}
                        <div className="w-full text-center shrink-0 mt-1 pb-2 sm:pb-4 group-hover:opacity-0 transition-opacity duration-300">
                          <h4
                            className={`font-extrabold text-[#0D233A] tracking-tight transition-colors ${
                              isCenter
                                ? "text-sm sm:text-lg"
                                : "text-xs sm:text-base"
                            }`}
                          >
                            {menu.name}
                          </h4>
                          <p
                            className={`text-neutral-400 font-bold uppercase tracking-wider ${
                              isCenter
                                ? "text-[9px] sm:text-[11px] mt-0.5"
                                : "text-[8px] sm:text-[9px] mt-0.5"
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
              className={`text-amber-600 font-black text-[11px] sm:text-xs tracking-[0.2em] uppercase block ${isCtaVisible ? 'animate-customSlideUp' : 'opacity-0'}`}
              style={{ animationDelay: '0.1s' }}
            >
              SUCCESS PARTNER
            </p>

            {/* Main Highlighted Title with Highlighter Drawing effect (Slide-up delay 0.3s) */}
            <h3 
              className={`text-xl sm:text-3xl md:text-4xl font-black text-neutral-950 leading-snug tracking-tight max-w-3xl mx-auto ${isCtaVisible ? 'animate-customSlideUp' : 'opacity-0'}`}
              style={{ animationDelay: '0.3s' }}
            >
              7년간 카페 & 베이커리 페어<br className="sm:hidden" /> 꾸준히 참여,<br />
              박람회만 나가면{" "}
              <span className="bg-gradient-to-t from-[#fbc400]/60 via-[#fbc400]/60 to-transparent bg-[length:100%_45%] bg-no-repeat bg-bottom pb-1 px-1 rounded-xs inline">
                줄 서서 상담받는 인기 브랜드!
              </span>
            </h3>

            {/* Core Message Paragraph (Slide-up delay 0.5s) */}
            <p 
              className={`text-neutral-600 font-bold text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto break-keep ${isCtaVisible ? 'animate-customSlideUp' : 'opacity-0'}`}
              style={{ animationDelay: '0.5s' }}
            >
              현장에서 확실하게 검증된 프리미엄 디저트 프랜차이즈 120겹파이.<br />
              독보적인 시그니처 디저트 파워와 체계적인 시스템을 토대로,<br />
              성공 가도를 함께 개척해 나갈{" "}
              <span className="relative inline-block px-1 z-10">
                {/* Secondary highlight line */}
                <span 
                  className={`absolute inset-x-0 bottom-0.5 h-2.5 bg-[#fbc400]/40 -z-10 origin-left ${isCtaVisible ? 'animate-customDrawHighlight' : 'w-0'}`} 
                  style={{ animationDelay: '1.6s' }}
                />
                가맹점주님들을 정중히 모십니다.
              </span>
            </p>

            {/* CTA Button (Yellow Color for both Mobile & PC - Slide-up delay 0.7s) */}
            <div 
              className={`pt-2 ${isCtaVisible ? 'animate-customSlideUp' : 'opacity-0'}`}
              style={{ animationDelay: '0.7s' }}
            >
              <button
                onClick={() => setIsConsulting(true)}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#fbc400] hover:bg-[#e0a800] text-neutral-950 font-extrabold text-xs sm:text-sm rounded-full transition-all duration-300 shadow-md hover:scale-105 active:scale-95 group/btn border-0 cursor-pointer"
              >
                <span>빠른 창업 문의</span>
                <ArrowRight size={16} className="transition-transform duration-300 group-hover/btn:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Spacer to give visual relief between mosaic CTA and concept slider */}
      <div className="w-full h-16 sm:h-24 bg-white" />

      {/* 1.7. CONCEPT DUAL SLIDER SECTION (MODERN DUAL CONTEXT BANNER SLIDER) */}
      <section 
        className="relative w-full overflow-hidden bg-neutral-950 select-none cursor-grab active:cursor-grabbing isolate z-0"
        onMouseDown={(e) => handleDragStart(e.clientX)}
        onMouseMove={(e) => handleDragMove(e.clientX)}
        onMouseUp={(e) => handleDragEnd(e.clientX)}
        onMouseLeave={() => {
          setDragStartX(null);
          setIsDragging(false);
        }}
        onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (e.changedTouches && e.changedTouches.length > 0) {
            handleDragEnd(e.changedTouches[0].clientX);
          } else {
            setDragStartX(null);
            setIsDragging(false);
          }
        }}
      >
        <div 
          className="flex" 
          style={{ 
            width: `${extendedConceptSlides.length * 100}%`,
            transform: `translateX(-${conceptIndex * (100 / extendedConceptSlides.length)}%)`,
            transition: isConceptTransitioning ? "transform 700ms ease-out" : "none"
          }}
        >
          {extendedConceptSlides.map((slide, idx) => (
            <div 
              key={`${slide.id}-${idx}`} 
              className="flex flex-col md:flex-row relative h-[720px] sm:h-[800px] overflow-hidden shrink-0"
              style={{ width: `${100 / extendedConceptSlides.length}%` }}
            >
              {/* Left Side (Dark Image Bg - Top half on mobile) */}
              <div className="w-full md:w-1/2 h-[45%] md:h-full relative overflow-hidden flex items-center justify-center md:justify-end px-8 md:px-0 md:pr-16 lg:pr-[300px] pt-8 pb-14 md:py-0">
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity scale-102"
                  style={{
                    backgroundImage: `url('${slide.leftBg}')`
                  }}
                />
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/60 z-0" />
                
                {/* Embossed Watermark */}
                <div className="text-white/5 uppercase tracking-[0.2em] font-black text-6xl sm:text-[9rem] absolute right-6 md:right-16 top-6 md:top-20 select-none pointer-events-none">
                  {slide.leftWatermark}
                </div>

                {/* Title Text (3-lines, text-right) */}
                <div className="relative z-10 space-y-2 text-center md:text-right flex flex-col items-center md:items-end mb-8 md:mb-0">
                  <h4 className="text-neutral-400 font-extrabold text-xs sm:text-sm tracking-widest uppercase">
                    {slide.leftSubtitle}
                  </h4>
                  <p className="text-white font-black text-[28px] sm:text-4xl md:text-5xl leading-tight tracking-tight">
                    {slide.leftTitle}
                  </p>
                </div>
              </div>

              {/* Right Side (Flat Bg Color - Bottom half on mobile, pt-28 pushes text below center image) */}
              <div 
                className="w-full md:w-1/2 h-[55%] md:h-full relative overflow-hidden flex items-start md:items-center justify-center md:justify-start px-8 md:px-0 md:pl-16 lg:pl-[300px] pt-24 sm:pt-28 pb-20 md:py-0"
                style={{ backgroundColor: slide.rightBgColor }}
              >
                {/* Embossed Watermark */}
                <div className={`${slide.watermarkColorClass} uppercase tracking-[0.2em] font-black text-6xl sm:text-[9rem] absolute right-6 md:right-20 bottom-6 md:bottom-20 select-none pointer-events-none`}>
                  {slide.rightWatermark}
                </div>

                {/* Copywriting Details (text-left) */}
                <div className={`relative z-10 space-y-2 sm:space-y-5 text-center md:text-left flex flex-col items-center md:items-start ${slide.textColorClass} max-w-xs sm:max-w-md`}>
                  <div className="space-y-1 sm:space-y-2">
                    <p className="font-bold text-xs sm:text-sm tracking-wider opacity-85">
                      {slide.rightDesc}
                    </p>
                    <h3 className="font-black text-3xl sm:text-5xl tracking-tighter">
                      {slide.rightTitle}
                    </h3>
                  </div>
                  
                  <p className={`font-black text-sm sm:text-xl tracking-tight ${slide.hashColorClass}`}>
                    {slide.rightHash}
                  </p>

                  <div className="pt-1.5">
                    <Link
                      href={slide.categoryUrl || "/brand/menu"}
                      className={`inline-flex items-center gap-1.5 px-6 py-2 sm:px-8 sm:py-3 border ${slide.buttonBorderClass} ${slide.buttonTextClass} ${slide.buttonHoverClass} font-extrabold text-xs sm:text-sm rounded-full transition-all duration-300 shadow-md group/btn`}
                    >
                      <span>자세히 보기</span>
                      <ArrowRight size={14} className="transition-transform duration-300 group-hover/btn:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Center Floating Pie 누끼 컷 (Keep image size exactly as is: w-[220px] h-[220px]) */}
              <div className="absolute top-[42%] md:top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 w-[220px] h-[220px] sm:w-[450px] sm:h-[450px] lg:w-[490px] lg:h-[490px] flex items-center justify-center pointer-events-none">
                <img
                  src={slide.centerImg}
                  alt={slide.centerAlt}
                  className="max-w-full max-h-full object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.18)] animate-bounceSlow"
                  onDragStart={(e) => e.preventDefault()}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Floating Indicator Controls (Indicators + Mouse Icon + Arrow Buttons) */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-30 flex items-center gap-6 bg-black/45 backdrop-blur-md px-6 py-2.5 rounded-full select-none text-white border border-white/10 shadow-lg">
          <button 
            onClick={handlePrevConcept}
            className="text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            <MoveLeft size={20} />
          </button>
          
          <div className="flex items-center gap-3">
            {/* SVG Mouse Icon */}
            <svg className="w-5 h-7 text-white/90" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 36">
              <rect x="2" y="2" width="20" height="32" rx="10" />
              <line x1="12" y1="8" x2="12" y2="16" />
            </svg>
            <span className="text-xs sm:text-sm font-extrabold tracking-wider whitespace-nowrap">DRAG & DROP</span>
          </div>

          <button 
            onClick={handleNextConcept}
            className="text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            <MoveRight size={20} />
          </button>
        </div>

        {/* Progress Bar Gauge at the bottom */}
        <div className="absolute bottom-0 left-0 w-full h-[4px] bg-white/10 z-30">
          <div 
            className="h-full bg-[#fbc400] transition-all duration-500 ease-out"
            style={{
              width: `${(((conceptIndex % CONCEPT_SLIDES.length) + 1) / CONCEPT_SLIDES.length) * 100}%`
            }}
          />
        </div>
      </section>

      {/* 1.8. CELEB VIRAL SLIDER SECTION */}
      <section className="py-20 sm:py-24 bg-[#F9F9F9] border-t border-b border-neutral-100 overflow-hidden">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          
          {/* Header */}
          <div className="space-y-4 max-w-3xl mx-auto animate-fadeIn">
            <span className="text-[#fbc400] font-black text-xs sm:text-sm uppercase tracking-widest block">
              Celeb Love 120pie
            </span>
            <h2 className="text-3xl sm:text-[40px] font-black text-[#0D233A] tracking-tight leading-tight">
              셀럽도 반해버린 120겹 파이
            </h2>
            <div className="space-y-1">
              <p className="text-xs sm:text-[15px] text-neutral-600 font-bold leading-relaxed">
                협찬 광고 없이 자발적인 노출로 바이럴이 극대화 되고 있습니다.
              </p>
              <p className="text-[10px] sm:text-[11px] text-neutral-400 font-bold">
                *본 영상들은 유료 광고가 아니므로 초상권 보호를 위해 모자이크 처리된 점 양해 부탁드립니다.
              </p>
            </div>
          </div>

          {/* Slider Carousel Container */}
          <div className="relative max-w-7xl mx-auto px-4 sm:px-8">
            {/* Carousel Window */}
            <div className="overflow-hidden mx-[-10px] px-[10px]">
              <div 
                className="flex transition-transform duration-500 ease-out"
                style={{
                  transform: `translateX(-${viralIndex * (100 / viralVisibleCount)}%)`
                }}
              >
                {VIRAL_CARDS.map((card) => (
                  <div 
                    key={card.id}
                    className="shrink-0 px-2.5"
                    style={{
                      width: `${100 / viralVisibleCount}%`
                    }}
                  >
                    <div className="flex flex-col bg-white border border-neutral-200/60 rounded-3xl overflow-hidden shadow-md group transition-all duration-300 hover:shadow-lg">
                      {/* Thumbnail Image Container */}
                      <div className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-100 flex items-center justify-center">
                        <img 
                          src={card.img}
                          alt={card.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                        />
                      </div>
                      {/* Bottom Title Area */}
                      <div className="py-4 px-5 bg-white border-t border-neutral-100 flex items-center justify-center min-h-[56px]">
                        <p className="text-xs sm:text-[13px] font-extrabold text-[#0D233A] tracking-tight text-center leading-snug">
                          {card.title}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Left & Right Floating Control Buttons */}
            {viralIndex > 0 && (
              <button 
                onClick={handlePrevViral}
                className="absolute left-[-15px] sm:left-[-25px] top-[calc(50%-28px)] transform -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white text-neutral-700 hover:text-black border border-neutral-200/80 shadow-md flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-20"
              >
                <ChevronLeft size={20} />
              </button>
            )}

            {viralIndex < VIRAL_CARDS.length - viralVisibleCount && (
              <button 
                onClick={handleNextViral}
                className="absolute right-[-15px] sm:right-[-25px] top-[calc(50%-28px)] transform -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white text-neutral-700 hover:text-black border border-neutral-200/80 shadow-md flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-20"
              >
                <ChevronRight size={20} />
              </button>
            )}
          </div>

        </div>
      </section>

      {/* 1.9. COFFEE PARALLAX SPECIALTY SECTION (FIXED BACKGROUND SHOWCASE) */}
      <section 
        className="relative w-full h-[480px] sm:h-[580px] overflow-hidden bg-cover bg-center bg-no-repeat bg-fixed flex items-center justify-center"
        style={{
          backgroundImage: `url('https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784603743/ChatGPT_Image_2026%EB%85%84_7%EC%9B%94_21%EC%9D%BC_%EC%98%A4%ED%9B%84_12_15_07_snjwtb.png')`
        }}
      >
        {/* Dim Overlay mask */}
        <div className="absolute inset-0 bg-black/65 z-0" />

        {/* Foreground Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white space-y-6 sm:space-y-8 select-none">
          <div className="space-y-2 sm:space-y-3">
            <span className="text-[#fbc400] font-black text-xs sm:text-sm uppercase tracking-widest block animate-pulse">
              120PIE Specialty Coffee
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight drop-shadow-md">
              파이만큼 독보적인,<br />스페셜티 커피의 깊은 향미
            </h2>
          </div>

          <div className="space-y-4 text-xs sm:text-base text-neutral-200 leading-relaxed font-semibold drop-shadow-sm">
            <p>
              120pie&coffee는 120겹 수제 파이는 물론이고, 특허받은 계란빵과 스페인 정통 츄러스 등 
              다채로운 시그니처 디저트가 저마다 독보적인 매력을 자랑합니다. 하지만 무엇보다 
              저희 브랜드를 믿고 찾아주시는 가장 큰 비결은 다름 아닌 <strong className="text-white font-extrabold">‘진짜 맛있는 커피’</strong>에 있습니다.
            </p>
            <p>
              오직 아프리카 고원의 비옥한 토양이 키워낸 <strong className="text-[#fbc400] font-extrabold">케냐 바링고 AA 스페셜티 등급 원두</strong>만을 100% 사용하여, 
              값비싼 커피 전문점과 비교해도 결코 밀리지 않는 중후한 바디감과 매혹적인 향, 풍부한 산미를 선사합니다.
            </p>
            <p>
              이토록 귀한 프리미엄 커피를 <strong className="text-[#fbc400] font-extrabold">저가 커피 수준의 놀라운 가격</strong>에 만나보실 수 있기에, 
              갓 구운 파이와 함께 즐기셔도 가격 부담이 전혀 없어 매일 아침 수많은 고객님들께 행복한 루틴이 되어 드리고 있습니다.
            </p>
          </div>
        </div>
      </section>

      {/* 1.10. INSTAGRAM SECTION */}
      <section className="py-20 bg-[#fafafa] dark:bg-neutral-900 overflow-hidden border-t border-neutral-100">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          {/* Section Header */}
          <div className="flex flex-col items-center justify-center space-y-3 select-none">
            {/* Instagram Colorful Gradient Logo SVG */}
            <div className="p-0.5 rounded-3xl bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] p-[2px] shadow-md hover:scale-105 transition-transform duration-300">
              <div className="bg-white p-2.5 rounded-[22px]">
                <svg className="w-9 h-9 sm:w-11 sm:h-11" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" fill="url(#ig-grad-brand)"/>
                  <defs>
                    <radialGradient id="ig-grad-brand" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(3.75 20.25) rotate(-45) scale(23.3346)">
                      <stop offset="0" stopColor="#FED53A"/>
                      <stop offset="0.26" stopColor="#F783AC"/>
                      <stop offset="0.6" stopColor="#DA2C7D"/>
                      <stop offset="1" stopColor="#6C28D9"/>
                    </radialGradient>
                  </defs>
                </svg>
              </div>
            </div>
            <h2 className="text-[#0D233A] font-black text-2xl sm:text-4xl tracking-tight leading-none">
              INSTAGRAM
            </h2>
            <p className="text-neutral-400 font-bold text-xs sm:text-sm tracking-widest">
              @120piecoffee
            </p>
          </div>

          {/* Carousel Slider */}
          <div className="relative max-w-[1400px] mx-auto px-4 sm:px-12 md:px-16">
            <div className="overflow-hidden mx-[-10px] px-[10px]">
              <div 
                className="flex transition-transform duration-500 ease-out"
                style={{
                  transform: `translateX(-${instaSliderIndex * (100 / instaVisibleCount)}%)`
                }}
              >
                {sortedInstagram.length === 0 ? (
                  <div className="w-full py-20 text-center font-bold text-neutral-400">
                    등록된 인스타그램 게시물이 없습니다.
                  </div>
                ) : (
                  sortedInstagram.map((item) => (
                    <div 
                      key={item._id}
                      className="shrink-0 px-1.5 sm:px-2.5"
                      style={{
                        width: `${100 / instaVisibleCount}%`
                      }}
                    >
                      <div 
                        onClick={() => setSelectedInsta(item)}
                        className="flex flex-col bg-white border border-neutral-200/50 rounded-2xl sm:rounded-[28px] overflow-hidden shadow-sm group transition-all duration-300 hover:shadow-md hover:scale-[1.01] cursor-pointer"
                      >
                        {/* Feed Image Container (Aspect 4:5) */}
                        <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-100 flex items-center justify-center">
                          <img 
                            src={optimizeCloudinaryUrl(getInstagramThumbnailUrl(item.img, item.link))}
                            alt="Instagram Post"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = INSTAGRAM_FALLBACK_IMAGE;
                            }}
                          />
                          {/* Hover overlay icon */}
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <svg className="w-8 h-8 text-white drop-shadow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Left & Right floating buttons */}
            {sortedInstagram.length > instaVisibleCount && (
              <>
                <button 
                  onClick={handlePrevInsta}
                  disabled={instaSliderIndex === 0}
                  className={`absolute left-1 sm:left-2 md:left-[-24px] top-[calc(50%)] transform -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full border shadow-[0_4px_16px_rgba(0,0,0,0.08)] flex items-center justify-center transition-all z-20 ${
                    instaSliderIndex === 0 
                      ? "bg-neutral-50 text-neutral-300 border-neutral-100 cursor-not-allowed opacity-40 pointer-events-none" 
                      : "bg-white hover:bg-[#FBC400] text-[#0D233A] hover:text-white border-neutral-200 hover:scale-105 active:scale-95 cursor-pointer"
                  }`}
                >
                  <ChevronLeft size={22} strokeWidth={3} />
                </button>
                <button 
                  onClick={handleNextInsta}
                  disabled={instaSliderIndex >= sortedInstagram.length - instaVisibleCount}
                  className={`absolute right-1 sm:right-2 md:right-[-24px] top-[calc(50%)] transform -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full border shadow-[0_4px_16px_rgba(0,0,0,0.08)] flex items-center justify-center transition-all z-20 ${
                    instaSliderIndex >= sortedInstagram.length - instaVisibleCount
                      ? "bg-neutral-50 text-neutral-300 border-neutral-100 cursor-not-allowed opacity-40 pointer-events-none" 
                      : "bg-white hover:bg-[#FBC400] text-[#0D233A] hover:text-white border-neutral-200 hover:scale-105 active:scale-95 cursor-pointer"
                  }`}
                >
                  <ChevronRight size={22} strokeWidth={3} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Instagram Popup Modal (게시물 상세) */}
        {selectedInsta && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center backdrop-blur-sm">
            {/* Backdrop click close */}
            <div className="absolute inset-0 cursor-pointer" onClick={() => setSelectedInsta(null)} />
            
            {/* Modal Body: 화면 꽉 채우되 하단 상담바(64px) 윗선인 bottom-[80px]에 맞닿도록 함 */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-2xl w-[95%] max-w-7xl fixed top-6 bottom-4 md:bottom-[80px] left-1/2 transform -translate-x-1/2 flex flex-col md:flex-row z-50 animate-scaleUp h-auto">
              
              {/* Close Button */}
              <button 
                onClick={() => setSelectedInsta(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center z-30 transition-colors cursor-pointer text-xs font-bold"
              >
                ✕
              </button>

              {/* Left Column: Big Image (Strict 4:5 Aspect Ratio) */}
              <div className="w-full md:w-auto md:h-full aspect-[4/5] bg-neutral-100 flex items-center justify-center overflow-hidden shrink-0 relative">
                <img 
                  src={optimizeCloudinaryUrl(getInstagramThumbnailUrl(selectedInsta.img, selectedInsta.link))} 
                  alt="Post Detail" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = INSTAGRAM_FALLBACK_IMAGE;
                  }}
                />
              </div>

              {/* Right Column: Descriptions & Action (Dynamic Fill) */}
              <div className="flex-1 h-full flex flex-col p-6 sm:p-8 bg-white justify-between relative overflow-y-auto">
                <div className="space-y-5 text-left">
                  {/* Top user profile header */}
                  <div className="flex items-center gap-3 border-b border-neutral-100 pb-4 select-none">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] p-[2px] shadow-sm">
                      <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                          <rect width="24" height="24" rx="5" fill="url(#ig-grad-brand)"/>
                          <rect x="5" y="5" width="14" height="14" rx="4" stroke="white" strokeWidth="2"/>
                          <circle cx="12" cy="12" r="3" stroke="white" strokeWidth="2"/>
                          <circle cx="16.5" cy="7.5" r="1" fill="white"/>
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-[#0D233A]">@120piecoffee</h4>
                      <p className="text-[10px] text-neutral-400 font-bold">{selectedInsta.date}</p>
                    </div>
                  </div>

                  {/* Feed post body text */}
                  <p className="text-xs sm:text-[13px] text-neutral-600 leading-relaxed font-semibold whitespace-pre-line overflow-y-auto pr-1">
                    {selectedInsta.text}
                  </p>
                </div>

                {/* Bottom button links */}
                <div className="pt-6 border-t border-neutral-100 mt-6 select-none">
                  <a 
                    href={selectedInsta.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full py-4 bg-[#0095f6] hover:bg-[#1877f2] text-white font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-[0_4px_12px_rgba(0,149,246,0.3)] flex items-center justify-center gap-2 hover:scale-[1.01]"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                    </svg>
                    Instagram에서 이 게시물 보기
                  </a>
                </div>

              </div>
            </div>
          </div>
        )}
      </section>

      {/* 1.11. INTERIOR CONCEPT SECTION */}
      <InteriorConcept />

      {/* 1.12. 120PIE COFFEE BRAND OVERVIEW SECTION */}
      <section className="relative w-full bg-[#ffd500] overflow-hidden select-none pt-16 pb-24 sm:pt-24 sm:pb-32 md:pt-28 md:pb-40 flex flex-col items-center justify-center text-center">
        {/* Texts */}
        <div className="space-y-4 flex flex-col items-center justify-center z-20">
          <h2 className="text-[#0D233A] text-4xl sm:text-5xl font-black tracking-tight leading-none uppercase">
            120PIE&COFFEE IS
          </h2>
          <p className="text-[#0D233A]/85 font-extrabold text-sm sm:text-base tracking-wide">
            something beyond coffee
          </p>
          <div className="pt-2">
            <Link href="/franchise" className="border border-black/60 text-black rounded-full px-6 py-2 text-xs font-bold hover:bg-black hover:text-[#ffd500] transition-all">
              더 알아보기 →
            </Link>
          </div>
        </div>

        {/* Large Centered Image (4x * 1.5x size, static margin block below text with downward translation) */}
        <div className="mt-16 md:mt-20 z-10 w-[450px] sm:w-[750px] md:w-[1140px] translate-y-4 md:translate-y-8 pointer-events-none drop-shadow-[0_20px_40px_rgba(0,0,0,0.15)] animate-float flex justify-center">
          <img
            src={optimizeCloudinaryUrl("https://res.cloudinary.com/lyjyvy54/image/upload/v1784615116/ChatGPT_Image_2026%EB%85%84_7%EC%9B%94_21%EC%9D%BC_%EC%98%A4%ED%9B%84_03_12_26_1_prg0iy.png")}
            alt="120pie 신규 아메리카노 컵"
            className="w-full h-auto object-contain"
          />
        </div>
      </section>

      {/* 창업문의 팝업 모달 */}
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

      {/* Sticky Bottom Inquiry Bar (Fixed on scroll, Stopper threshold above Footer) */}
      <QuickInquiryBar isFixed={true} />

      {/* FOOTER */}
      <Footer theme="yellow" />

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

      {/* Dynamic Cursor Follower (Desktop only, spring-lerp easing) */}
      <div 
        className="hidden md:block fixed z-[9999] pointer-events-none"
        style={{
          left: trailPos.x,
          top: trailPos.y,
          transform: "translate(14px, 14px)",
        }}
      >
        <img
          src={optimizeCloudinaryUrl("https://res.cloudinary.com/lyjyvy54/image/upload/v1784644440/%EA%B0%9C%EC%B2%B4_amuurg.png")}
          alt="Cursor Follower"
          className="w-12 h-12 object-contain drop-shadow-[0_3px_6px_rgba(0,0,0,0.18)] animate-bounce"
          style={{ animationDuration: "2s" }}
        />
      </div>

      {/* Right Floating Quick Docking Bar */}
      <RightFloatingQuickBar onOpenConsultation={() => setIsConsulting(true)} />

      {/* Right Side Inquiry Banner (300px width) */}
      <RightSideInquiryBanner />
    </div>
  );
}
