"use client";

import Link from "next/link";
import { ArrowLeft, ArrowUpRight, CheckCircle2, Sparkles, Truck, Flame, Layers, Menu, X, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import FloatingAndInquiry from "@/app/components/FloatingAndInquiry";
import Footer from "@/app/components/Footer";
import RightFloatingQuickBar from "@/components/RightFloatingQuickBar";
import RightSideInquiryBanner from "@/components/RightSideInquiryBanner";
import { optimizeCloudinaryUrl } from "@/app/utils/cloudinary";

const getCloudinaryResizedUrl = (url: string, width = 300, height = 300) => {
  if (url && url.includes("cloudinary.com") && url.includes("/upload/")) {
    const prefix = url.includes("f_auto") || url.includes("q_auto") ? "" : "f_auto,q_auto,";
    return url.replace("/upload/", `/upload/${prefix}w_${width},h_${height},c_fill/`);
  }
  return url;
};

const logoUrlBlack = "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784533894/Group_1_4_jl4rlr.png";
const logoUrlPink = "https://res.cloudinary.com/dx7l09wwu/image/upload/f_auto,q_auto/v1779846449/logo_120pie_coffee3_jzgtyi.png";

// Inline Item Detail Interface with Qty
interface ItemDetail {
  title: string;
  desc: string;
  imageUrl: string;
  qty?: string; // Optional Quantity Badge
}

// Signature Packages Interface
interface PackageInfo {
  id: string;
  name: string;
  sub: string;
  price: string;
  normalPrice: string;
  desc: string;
  imageUrl?: string;
  videoUrl?: string;
  items: ItemDetail[];
}

const PACKAGES: PackageInfo[] = [
  {
    id: "120pie",
    name: "120겹파이 올인원 패키지",
    sub: "시그니처 디저트 패키지",
    price: "4,400,000원",
    normalPrice: "5,500,000원",
    desc: "120겹의 극대화된 바삭함과 풍미를 선사하는 120겹파이를 매장에 즉시 도입하는 기기 및 브랜딩 올인원 세트입니다.",
    videoUrl: "https://res.cloudinary.com/dfarfqx7e/video/upload/f_auto,q_auto/v1781183434/120%EA%B2%B9%ED%8C%8C%EC%9D%B4_%EB%A1%9C%EC%A0%9C_%EC%96%91%EC%86%A1%EC%9D%B4_%EC%88%98%EC%A0%952_gw0tvv.mp4",
    items: [
      {
        title: "자체 금형 오리지널 파이 머신",
        desc: "독자 설계 자체 금형 기술로 가장 극대화된 120겹의 파이 결을 살려내는 전용 베이킹 머신",
        imageUrl: "https://res.cloudinary.com/dfarfqx7e/image/upload/f_auto,q_auto/v1781183657/63500e43-6384-46d9-ab17-1ba241e9de4a.png",
        qty: "1ea"
      },
      {
        title: "시그니처 패스트리 생지",
        desc: "본사 콜드체인 물류망을 통해 신선하게 급송되는 120겹 레이어드 특제 생지 (완성 파이 200개 분량)",
        imageUrl: "https://res.cloudinary.com/dfarfqx7e/image/upload/f_auto,q_auto/v1781186395/4b7d41db63592_wyo4r0_m7yx1q.webp",
        qty: "1box"
      },
      {
        title: "엄선 프리미엄 필링 초도 자재 지원",
        desc: "120pie 대표 9대 맛(애플, 커스터드, 블루베리, 망고, cream치즈, 앙고구마, 불닭, 불고기, 함박) 고품질 필링팩 무상 공급",
        imageUrl: "https://res.cloudinary.com/dfarfqx7e/image/upload/f_auto,q_auto/v1781186398/120%EA%B2%B9%ED%8C%8C%EC%9D%B4_%EC%97%B0%EC%B6%9C1_ueicna_qxbo3b.jpg",
        qty: "각 1kg"
      },
      {
        title: "브랜드 공식 엑스배너 2종 세트",
        desc: "실내용 및 실외 전천후 외부용 고선명 엑스배너 거치대 포함 제공 (규격: 가로 60cm × 세로 180cm)",
        imageUrl: "https://res.cloudinary.com/dfarfqx7e/image/upload/f_auto,q_auto/v1781186400/2026-05-28_13_37_40_sbppa6_z2w4mg.png",
        qty: "각 1ea"
      },
      {
        title: "매장 전용 카운터/테이블 POP 5종",
        desc: "고객 시선을 사로잡는 입체적 메뉴 거치용 프리미엄 아크릴 POP 스탠드 (규격: 가로 22cm × 세로 30cm)",
        imageUrl: "https://res.cloudinary.com/dfarfqx7e/image/upload/f_auto,q_auto/v1781186407/2026-05-28_13_41_46_xec3ws_hrigku.png",
        qty: "각 1ea"
      },
      {
        title: "메뉴 홍보 포스터 8종 세트",
        desc: "파이 비주얼과 질감이 살아있는 내외부 유리벽 부착용 고급 홍보 포스터 (규격: 가로 48cm × 세로 69cm)",
        imageUrl: "https://res.cloudinary.com/dfarfqx7e/image/upload/f_auto,q_auto/v1781186409/2026-05-28_13_42_18_f7abqv_grhghb.png",
        qty: "각 1ea"
      },
      {
        title: "초정밀 푸드 스타일링 파이 모형 4종",
        desc: "고객의 주문 충동을 자극하는 초정밀 실물 원형 모형 1종 및 애플/블루베리/직화류 단면 모형 3종 세트",
        imageUrl: "https://res.cloudinary.com/dfarfqx7e/image/upload/f_auto,q_auto/v1781186412/KakaoTalk_20220113_105520905_01_gpdfsy_rqkk62.jpg",
        qty: "각 1ea"
      },
      {
        title: "배달 플랫폼 전용 고해상도 실사 라이센스 이미지",
        desc: "배달의민족, 쿠팡이츠 등 즉시 등록 가능한 스튜디오 촬영 전용 파이 메뉴 대표/옵션 컷 원본 제공",
        imageUrl: "https://res.cloudinary.com/dfarfqx7e/image/upload/f_auto,q_auto/v1781187164/120%EA%B2%B9%ED%8C%8C%EC%9D%B4_%EC%97%B0%EC%B6%9C4_r90tky_lqzsb6.jpg",
        qty: "지원"
      },
      {
        title: "시그니처 테이크아웃 포장 부자재 세트",
        desc: "120pie 전용 크라프트 캐리어, 특수 기능성 포장 속지 등 초도 포장 자재 세트 무상 지원",
        imageUrl: "https://res.cloudinary.com/dfarfqx7e/image/upload/f_auto,q_auto/v1781186403/IMG_8185_jpquaf_z9ikmf.jpg",
        qty: "지원"
      },
      {
        title: "프로페셔널 오븐 설치 및 1:1 조리 교육",
        desc: "본사 엔지니어 기기 셋팅 출장 지원 및 비숙련자도 3분 내 완벽 조리가 가능한 1:1 현장 교육 및 가이드",
        imageUrl: "https://res.cloudinary.com/dfarfqx7e/image/upload/f_auto,q_auto/v1781186418/ChatGPT_Image_2026%EB%85%84_5%EC%9B%94_28%EC%9D%BC_%EC%98%A4%ED%9B%84_01_47_46_fyk4ns_myousq.png",
        qty: "지원"
      }
    ]
  },
  {
    id: "egg120",
    name: "egg120 프리미엄 타르트 패키지",
    sub: "프리미엄 쌀 계란빵 패키지",
    price: "3,300,000원",
    normalPrice: "4,400,000원",
    desc: "100% 국산 쌀가루로 만들어 겉은 바삭하고 속은 부드러운 커스터드로 가득 찬 egg120을 도입하기 위한 최적의 패키지입니다.",
    videoUrl: "https://res.cloudinary.com/dfarfqx7e/video/upload/f_auto,q_auto/v1781183413/egg120_%EC%98%81%EC%83%81_1_nyph02.mp4",
    items: [
      {
        title: "에그120 계란빵 전용 머신",
        desc: "진짜 계란빵의 완벽한 형상과 결을 제대로 살려내는 독점 기기 (온도센서/타이머 탑재, 1.3kw 초절전 저전력 설계, 10구 동시 생산)",
        imageUrl: "https://res.cloudinary.com/dfarfqx7e/image/upload/f_auto,q_auto/v1781186600/10d36a7d-b8d5-4903-9d24-fbedfcbf98cd_yatwnr.png",
        qty: "1대"
      },
      {
        title: "시그니처 전용 반죽",
        desc: "겉바속촉 식감을 극대화하는 에그120 특제 반죽 (5kg 벌크 6봉 제공, 완성 계란빵 약 720개 조리 가능 대용량)",
        imageUrl: "https://res.cloudinary.com/dfarfqx7e/image/upload/f_auto,q_auto/v1781186614/2026-05-28_13_49_08_j9unkq_jxssyk.png",
        qty: "30kg"
      },
      {
        title: "프리미엄 토핑 속재료 4종",
        desc: "에그120만의 다채로운 맛을 내기 위한 핵심 속재료 초도 세트 (스팸 1kg, 커스터드 믹스 1kg, 콘버터 1kg, 베이컨 1kg)",
        imageUrl: "https://res.cloudinary.com/dfarfqx7e/image/upload/f_auto,q_auto/v1781186604/A4_08297_2_kkxovy_i7xlf1.jpg",
        qty: "각 1ea"
      },
      {
        title: "동물복지 친환경 유황란",
        desc: "건강함과 최고의 신선한 고소함을 전하는 동물복지 인증 유황 먹인 명품 유정란",
        imageUrl: "https://res.cloudinary.com/dfarfqx7e/image/upload/f_auto,q_auto/v1781186617/2026-05-28_14_00_35_wg4qfj_bxx2cc.png",
        qty: "120ea"
      },
      {
        title: "브랜드 공식 홍보용 X배너",
        desc: "실내외 공간 어디에나 배치할 수 있는 프리미엄 홍보용 X배너 (사이즈: 60cm × 180cm, 주문 제작용)",
        imageUrl: "https://res.cloudinary.com/dfarfqx7e/image/upload/f_auto,q_auto/v1781186607/ChatGPT_Image_2026%EB%85%84_5%EC%9B%94_28%EC%9D%BC_%EC%98%A4%ED%9B%84_01_51_40_ahiniz_e6b27f.png",
        qty: "1ea"
      },
      {
        title: "공식 테이블/카운터 메뉴판 POP",
        desc: "매장 내부에 깔끔하고 정갈하게 메뉴 비주얼을 노출하는 카운터 전용 아크릴 POP 메뉴판 (사이즈: 22cm × 30cm, 주문 제작용)",
        imageUrl: "https://res.cloudinary.com/dfarfqx7e/image/upload/f_auto,q_auto/v1781186619/ChatGPT_Image_2026%EB%85%84_5%EC%9B%94_28%EC%9D%BC_%EC%98%A4%ED%9B%84_01_52_47_k3qg27_ainij4.png",
        qty: "1ea"
      },
      {
        title: "에그120 공식 홍보용 포스터 3종",
        desc: "매장 내외부 유리벽 부착을 통해 시각적 식욕을 최고조로 유도하는 고선명 포스터 세트 (사이즈: 48cm × 69cm, 주문 제작용)",
        imageUrl: "https://res.cloudinary.com/dfarfqx7e/image/upload/f_auto,q_auto/v1781186622/ChatGPT_Image_2026%EB%85%84_5%EC%9B%94_28%EC%9D%BC_%EC%98%A4%ED%9B%84_01_54_44_ihkz2y_cupghd.png",
        qty: "각 1ea"
      },
      {
        title: "초정밀 푸드 디자인 계란빵 모형 4종 & 전용 미니 쇼케이스",
        desc: "실물 제품과 똑같이 제작되어 카운터 시선 중앙에서 주문율을 올리는 계란빵 원형 모형 2종 및 단면 모형 2종 세트, 그리고 모형을 먼지 없이 위생적으로 전시할 수 있는 투명 쇼케이스 일체",
        imageUrl: "https://res.cloudinary.com/dfarfqx7e/image/upload/f_auto,q_auto/v1781186611/ChatGPT_Image_2026%EB%85%84_5%EC%9B%94_28%EC%9D%BC_%EC%98%A4%ED%9B%84_02_00_48_qomspv_hcopmg.png",
        qty: "1set"
      },
      {
        title: "배달 플랫폼 프로페셔널 셋업 대행",
        desc: "배달의민족, 쿠팡이츠, 요기요 등 배달앱 즉시 등록을 위한 본사 담당자 1:1 파견 대행 셋업 및 고해상도 제품 실사 이미지 패키지 지원",
        imageUrl: "https://res.cloudinary.com/dfarfqx7e/image/upload/f_auto,q_auto/v1781186626/ChatGPT_Image_2026%EB%85%84_5%EC%9B%94_28%EC%9D%BC_%EC%98%A4%ED%9B%84_02_01_00_y1gkyp_ql9xij.png",
        qty: "지원"
      },
      {
        title: "테이크아웃 포장 및 부재료 패키지",
        desc: "에그120 시그니처 종이봉투(소), 브랜드 로고 패킹 비닐봉투(소), 배달 전용 용기 및 에그120 엠블럼 스티커 초도 제공",
        imageUrl: "https://res.cloudinary.com/dfarfqx7e/image/upload/f_auto,q_auto/v1781186628/KakaoTalk_20250819_162905131_zkmre3_x6drp8.jpg",
        qty: "지원"
      },
      {
        title: "동물복지 공식 인증 명품 매장 판넬",
        desc: "친환경 동물복지란 사용을 선명히 고지하여 고객의 안전 먹거리 신뢰감을 높이는 명품 판넬",
        imageUrl: "https://res.cloudinary.com/dfarfqx7e/image/upload/f_auto,q_auto/v1781186632/EGG120_%EB%8F%99%EB%AC%BC%EB%B3%B5%EC%A7%80_%ED%8C%9D%EC%97%85POPUP__240613_jqil66_dl8hjh.jpg",
        qty: "1ea"
      },
      {
        title: "전문 기술 엔지니어 기기 설치 & 1:1 교육",
        desc: "본사 전문 테크니컬 마스터 파견을 통한 기기 최적 정밀 설치 셋팅, 1:1 현장 교육 및 조리 운영 가이드 서비스 일체 지원",
        imageUrl: "https://res.cloudinary.com/dfarfqx7e/image/upload/f_auto,q_auto/v1781186635/ChatGPT_Image_2026%EB%85%84_5%EC%9B%94_28%EC%9D%BC_%EC%98%A4%ED%9B%84_02_07_46_evwssk_tpflrk.png",
        qty: "지원"
      }
    ]
  }
];

// 120 Friends Menu Interface
interface FriendsMenuInfo {
  name: string;
  sub: string;
  desc: string;
  highlight: string;
  imageUrl: string;
  badgeColor: string;
  supplyType: "완제품" | "원재료";
}

const FRIENDS_MENUS: FriendsMenuInfo[] = [
  {
    name: "츄러스120",
    sub: "정통 스패니시 디저트",
    desc: "겉은 바삭하고 속은 쫄깃한 정통 스패니시 스타일의 츄러스입니다. 오븐에 굽거나 가볍게 튀겨 3분 안에 간편하게 제공 가능합니다.",
    highlight: "정통 냉동 츄러스 생지 & 120 전용 시나몬 파우더 직배송",
    imageUrl: "https://res.cloudinary.com/dfarfqx7e/image/upload/f_auto,q_auto/v1781184099/IMG_0015_6_3_bxmolh.jpg",
    badgeColor: "bg-orange-500/10 text-orange-600 border border-orange-500/20",
    supplyType: "완제품"
  },
  {
    name: "떡볶이120",
    sub: "숍인숍 최고의 매출 치트키",
    desc: "남녀노소 누구나 매일 찾는 120 특제 국물 떡볶이입니다. 주방 공간 차지 없이 물만 붓고 끓이면 바로 조리가 끝납니다.",
    highlight: "중독성 넘치는 120 마약 떡볶이 소스 분말 & 쫄깃 밀떡 그대로 공급",
    imageUrl: "https://res.cloudinary.com/dfarfqx7e/image/upload/f_auto,q_auto/v1781187221/%EA%B5%AD%EB%AC%BC%EB%96%A1%EB%B3%B6%EC%9D%B4_ue9q3m_iycoo5.jpg",
    badgeColor: "bg-rose-500/10 text-rose-500 border border-rose-500/20",
    supplyType: "완제품"
  },
  {
    name: "핫도그120",
    sub: "바삭함 and 풍성한 육즙의 조화",
    desc: "카페 음료 및 가벼운 든든한 식사 대용으로 아주 훌륭한 핫도그입니다. 주문 즉시 오븐에 굽거나 데워 설탕만 솔솔 뿌려 건넵니다.",
    highlight: "육즙 팡팡 터지는 소시지가 들어간 120 전용 프리미엄 반제품 핫도그 공급",
    imageUrl: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784078299/%EC%A7%81%ED%99%94%EB%B6%88%EA%B3%A0%EA%B8%B0_1_cuyrzn.png",
    badgeColor: "bg-red-500/10 text-red-600 border border-red-500/20",
    supplyType: "완제품"
  },
  {
    name: "120커피",
    sub: "파이와 완벽한 페어링",
    desc: "120시리즈 디저트의 부드러운 맛을 가장 기품 있게 살려주는 본사 하우스 아라비카 원두입니다. 커피 매출을 비약적으로 보충합니다.",
    highlight: "프리미엄 100% 아라비카 하우스 블렌딩 고품질 원두 원자재 직배송",
    imageUrl: "https://res.cloudinary.com/dfarfqx7e/image/upload/f_auto,q_auto/v1781187208/A4_01133_lzjp9l_j4lfgk.jpg",
    badgeColor: "bg-cyan-500/10 text-cyan-600 border border-cyan-500/20",
    supplyType: "원재료"
  }
];

export default function CostsPageClient() {
  const [theme, setTheme] = useState<"pink" | "yellow">("yellow");
  const [inquiryForcedOpen, setInquiryForcedOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

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

  // Dynamic Theme Tokens
  const isPink = theme === "pink";
  const isYellow = theme === "yellow";
  const logoUrl = isPink ? logoUrlBlack : "/logo_yellow_blue.png";

  // Theme Background & Header Tokens
  const pageBg = isPink ? "bg-[#0a0a0a] text-neutral-200" : "bg-[#fffdf4] text-[#0d233a]";
  const headerBg = isPink ? "bg-neutral-950/80 border-b border-neutral-900" : "bg-[#fffdf4]/80 border-b border-[#e6dfc3]";
  
  // Theme Typography Tokens
  const textTitle = isPink ? "text-white" : "text-[#0d233a]";
  const textDesc = isPink ? "text-neutral-400" : "text-[#576575]";
  const labelAccent = isPink ? "text-amber-400 font-extrabold" : "text-[#0d233a] font-extrabold";

  // Theme Card Tokens
  const cardBg = isPink ? "bg-neutral-900 border border-neutral-850 shadow-md shadow-black/20" : "bg-white border border-[#e6dfc3] shadow-md shadow-[#0d233a]/[0.02]";
  const innerCardBg = isPink ? "bg-neutral-950 border border-neutral-850" : "bg-[#fff9e6] border border-[#ffd500]/20";
  const backBtnClass = isPink ? "bg-amber-400 text-neutral-950 hover:bg-amber-300 shadow-amber-400/10" : "bg-[#ffd500] text-[#0d233a] hover:bg-[#e6bd00] shadow-[#ffd500]/10";

  const backUrl = isPink ? "/v3" : "/";

  return (
    <div className={`min-h-screen font-sans antialiased transition-colors duration-300 ${pageBg}`}>
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

          <nav className={`hidden lg:flex items-center justify-center gap-2.5 xl:gap-4 text-[10px] xl:text-[13px] font-bold shrink-0 ${isPink ? "text-neutral-400 hover:text-rose-400" : "text-[#576575] hover:text-[#0d233a]"}`}>
            <Link href={`/menu?theme=${theme}`} className="hover:text-amber-400 transition-colors">메뉴</Link>
            <Link href={`/stores?theme=${theme}`} className="hover:text-amber-400 transition-colors">가맹점 현황</Link>
            <Link href={`/costs?theme=${theme}`} className={`hover:scale-105 transition-transform shrink-0 ${
              isPink 
                ? "text-rose-500 hover:text-rose-600 font-extrabold" 
                : "text-[#ffd500] hover:text-[#e6bd00] font-extrabold"
            }`}>
              비용 안내
            </Link>
            <Link href="/brand/franchise" className="hover:text-amber-400 transition-colors">창업 안내</Link>
            <Link href={`/faq?theme=${theme}`} className="hover:text-amber-400 transition-colors">FAQ</Link>
          </nav>

          <div className="flex items-center gap-2.5">
            <div className={`flex items-center rounded-full border p-0.5 text-[10px] font-black ${isPink ? "border-[#f2ccd7]/20 bg-neutral-900/60" : "border-[#e6dfc3] bg-neutral-900/5"}`}>
              <button
                type="button"
                onClick={() => handleThemeChange("yellow")}
                className={`rounded-full px-2.5 py-1 transition-colors cursor-pointer border-0 ${
                  isYellow 
                    ? "landing-theme-active bg-amber-400 text-neutral-950 font-extrabold shadow-sm" 
                    : isPink ? "text-neutral-400 hover:text-white" : "text-neutral-500 hover:text-[#0d233a]"
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
            <Link className={`hidden sm:inline-flex items-center justify-center px-4 py-2.5 rounded-lg border text-xs font-bold ${
              isYellow
                ? "border-[#e6dfc3] bg-white text-[#576575] hover:bg-[#fffcf0] hover:text-[#0d233a] transition-all"
                : "border-neutral-800 bg-neutral-900 text-neutral-350 hover:bg-neutral-800 hover:text-white transition-all"
            }`} href="/portal" target="_blank" rel="noopener noreferrer">
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
          <nav id="mobile-landing-nav" className={`lg:hidden border-t px-4 pb-5 pt-3.5 transition-all duration-300 ${isYellow ? "bg-[#fffdf2]/98 border-t border-[#e6dfc3]/60" : "bg-[#0f0a0c]/98 border-t border-[#f2ccd7]/15"}`}>
            <div className="grid grid-cols-2 gap-2 text-sm font-bold">
              <Link href={`/menu?theme=${theme}`} onClick={() => setMobileNavOpen(false)} className={`rounded-xl px-4 py-3 transition-colors ${isYellow ? "bg-white border border-[#e6dfc3]/60 text-[#576575]" : "bg-[#181114] border border-[#f2ccd7]/10 text-neutral-400"}`}>
                메뉴
              </Link>
              <Link href={`/stores?theme=${theme}`} onClick={() => setMobileNavOpen(false)} className={`rounded-xl px-4 py-3 transition-colors ${isYellow ? "bg-white border border-[#e6dfc3]/60 text-[#576575]" : "bg-[#181114] border border-[#f2ccd7]/10 text-neutral-400"}`}>
                가맹점 현황
              </Link>
              <Link href={`/costs?theme=${theme}`} onClick={() => setMobileNavOpen(false)} className={`rounded-xl px-4 py-3 transition-colors font-extrabold ${
                isPink 
                  ? "text-rose-500 bg-rose-500/10 border border-rose-500/20" 
                  : "text-[#ffd500] bg-[#ffd500]/10 border border-[#ffd500]/20"
              }`}>
                비용 안내
              </Link>
              <Link href="/brand/franchise" onClick={() => setMobileNavOpen(false)} className={`rounded-xl px-4 py-3 transition-colors ${isYellow ? "bg-white border border-[#e6dfc3]/60 text-[#576575]" : "bg-[#181114] border border-[#f2ccd7]/10 text-neutral-400"}`}>
                창업 안내
              </Link>
              <Link href={`/faq?theme=${theme}`} onClick={() => setMobileNavOpen(false)} className={`col-span-2 rounded-xl px-4 py-3 transition-colors text-center ${isYellow ? "bg-white border border-[#e6dfc3]/60 text-[#576575]" : "bg-[#181114] border border-[#f2ccd7]/10 text-neutral-400"}`}>
                FAQ
              </Link>
            </div>
            <div className="flex gap-2 mt-3 w-full">
              <Link
                href="/portal"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileNavOpen(false)}
                className={`flex-1 flex items-center justify-center rounded-xl px-4 py-3.5 text-xs sm:text-sm font-black border transition-all focus:outline-none focus:ring-0 outline-none ${
                  isYellow
                    ? "border-[#e6dfc3] bg-white text-[#576575] hover:bg-[#fffcf0] hover:text-[#0d233a]"
                    : "border-neutral-800 bg-neutral-900 text-neutral-350 hover:bg-neutral-800 hover:text-white"
                }`}
              >
                점주전용
              </Link>
              <button
                type="button"
                onClick={() => { setMobileNavOpen(false); setInquiryForcedOpen(true); }}
                className={`pink-primary-button flex-1 flex items-center justify-center rounded-xl px-4 py-3.5 text-xs sm:text-sm font-black border-0 cursor-pointer ${
                  isPink 
                    ? "bg-rose-500 text-white hover:bg-rose-600 shadow-[0_4px_16px_rgba(244,63,94,0.25)]" 
                    : "bg-amber-400 text-neutral-950 hover:bg-amber-300 shadow-[0_4px_16px_rgba(251,191,36,0.25)]"
                }`}
              >
                상담 신청 <ArrowRight size={14} className="ml-1.5 shrink-0" />
              </button>
            </div>
          </nav>
        )}
      </header>

      <main className="px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="max-w-7xl mx-auto">
          {/* Main Title Section */}
          <div className="max-w-3xl mb-12">
            <span className={`font-bold tracking-widest text-xs uppercase mb-3 block font-mono ${labelAccent}`}>120 SERIES - COST INFRASTRUCTURE</span>
            <h1 className={`text-4xl sm:text-5xl font-black tracking-tight leading-tight mb-4 ${textTitle}`}>
              <span className={isPink ? "text-rose-500" : "text-amber-400"}>거품 없는 투명한 시작,</span><br />120시리즈 도입 비용 안내
            </h1>
            <p className={`text-sm sm:text-base font-medium leading-relaxed ${textDesc}`}>
              120시리즈는 점주님의 매장 환경에 맞춰 합리적인 결정을 하실 수 있도록, 올인원 기기 및 초도 패키지와 무경계 재료 공급형 프랜즈 메뉴를 명확히 구분하여 제공합니다.
            </p>
          </div>

          {/* 🌟 3無 가맹비 무료 강조 배너 */}
          <section className={`rounded-3xl p-6 sm:p-10 mb-16 relative overflow-hidden border transition-all duration-300 ${
            isPink 
              ? "bg-gradient-to-br from-rose-500 to-pink-500 text-white border-rose-300 shadow-xl shadow-rose-500/10" 
              : "bg-gradient-to-br from-[#ffd500]/10 to-[#fffdf4] text-[#0d233a] border-[#ffd500]/25 shadow-lg"
          }`}>
            <div className="absolute right-0 bottom-0 w-[300px] h-[300px] bg-white/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="max-w-2xl text-center lg:text-left">
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider mb-4 ${
                  isPink ? "bg-white/20 text-white" : "bg-amber-400/20 text-amber-300 border border-amber-400/20"
                }`}>
                  <Sparkles size={11} className="animate-pulse" /> NO FRANCHISE FEE PROMISE
                </div>
                <h2 className="text-2xl sm:text-3xl font-black leading-tight tracking-tight mb-3">
                  어떤 도입 형태든 별도의 가맹비는 없습니다!
                </h2>
                <p className={`text-xs sm:text-sm font-medium leading-relaxed ${isPink ? "text-white/80" : "text-[#576575]"}`}>
                  120시리즈는 점주님의 성공적인 정착을 본사의 최우선 가치로 삼습니다. 초기 창업이나 숍인숍 도입 시 어떠한 불필요한 가맹비, 교육비, 매달 발생하는 브랜드 로열티도 청구하지 않습니다.
                </p>
              </div>

              {/* 3無 Highlights Display */}
              <div className="grid grid-cols-3 gap-3 sm:gap-5 shrink-0 w-full lg:w-auto">
                {[
                  { title: "가맹비", value: "0원", desc: "초기 가입 비용 무료" },
                  { title: "교육비", value: "0원", desc: "핵심 노하우 무료 제공" },
                  { title: "로열티", value: "0원", desc: "월 고정 비용 전면 면제" }
                ].map((item, idx) => (
                  <div key={idx} className={`rounded-2xl p-4 flex flex-col items-center justify-center text-center backdrop-blur-md ${
                    isPink ? "bg-white/10 border border-white/15" : "bg-[#fff9e6] border border-[#ffd500]/15"
                  }`}>
                    <span className={`text-[10px] font-bold tracking-wider mb-1 ${isPink ? "text-white/70" : "text-[#576575]"}`}>{item.title}</span>
                    <strong className={`text-xl sm:text-2xl font-black ${isPink ? "text-white" : "text-[#0d233a]"}`}>{item.value}</strong>
                    <span className={`text-[9px] mt-1 whitespace-nowrap leading-none ${isPink ? "text-white/60" : "text-[#576575]"}`}>{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 📦 카테고리 1: 120 시그니처 패키지 (All-in-One Package) */}
          <section className="mb-20">
            <div className="flex items-center gap-2.5 mb-8">
              <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm shrink-0 shadow-md ${
                isPink ? "bg-rose-500 text-white" : "bg-amber-400 text-neutral-950"
              }`}>
                A
              </span>
              <div>
                <span className={`text-[10px] tracking-widest font-black uppercase font-mono ${labelAccent}`}>CATEGORY 01 · ALL-IN-ONE PACKAGES</span>
                <h2 className={`text-2xl sm:text-3xl font-black tracking-tight ${textTitle}`}>120 시그니처 패키지 안내</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-12 items-stretch mb-12">
              {PACKAGES.map((pkg) => (
                <div key={pkg.id} className={`rounded-3xl p-6 sm:p-10 flex flex-col gap-10 transition-all duration-300 ${cardBg} ${
                  isPink ? "hover:border-rose-500/40" : "hover:border-[#ffd500]/60"
                }`}>
                  
                  {/* Top Section: Shopping Mall Product Detail Style (Image on Left, Product Info on Right) */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                    
                    {/* Left: Product Image / Video Visual Cover */}
                    <div className="lg:col-span-6 w-full">
                      <div className="aspect-[4/3] rounded-2xl overflow-hidden relative bg-transparent dark:bg-neutral-950 border border-neutral-200/50 dark:border-neutral-900 shadow-md">
                        {pkg.videoUrl ? (
                          <video
                            src={pkg.videoUrl}
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="w-full h-full object-cover scale-[1.05]"
                            aria-label={`${pkg.name} 미디어 프리뷰`}
                          />
                        ) : pkg.imageUrl ? (
                          <img
                            src={pkg.imageUrl}
                            alt={pkg.name}
                            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                          />
                        ) : null}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                        <span className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md border border-neutral-800 rounded-full px-3 py-1 text-[10px] font-bold text-white flex items-center gap-1.5 shadow-sm">
                          <Sparkles size={11} className={labelAccent} /> 실물 구동 예시
                        </span>
                      </div>
                    </div>

                    {/* Right: Product Info (Name, Subtitle, Description, Price) */}
                    <div className="lg:col-span-6 flex flex-col justify-between h-full py-2">
                      <div>
                        {/* Subtitle */}
                        <span className={`text-xs font-bold tracking-widest block mb-2 uppercase font-mono ${labelAccent}`}>
                          {pkg.sub}
                        </span>
                        
                        {/* Product Title */}
                        <h3 className={`text-2xl sm:text-3xl font-black tracking-tight mb-4 ${textTitle}`}>
                          {pkg.name}
                        </h3>

                        {/* Divider */}
                        <div className="h-px w-full bg-neutral-200/60 dark:bg-neutral-900 mb-5" />

                        {/* Description (구성 요약) */}
                        <div className="mb-6">
                          <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                            패키지 도입 정보
                          </span>
                          <p className={`text-xs sm:text-sm font-medium leading-relaxed ${textDesc}`}>
                            {pkg.desc}
                          </p>
                        </div>

                        {/* Quick Spec list (Shopping Mall Style) */}
                        <div className={`grid grid-cols-2 gap-4 mb-6 text-xs border rounded-2xl p-4 ${
                          isPink 
                            ? "bg-neutral-950/60 border-neutral-850 text-neutral-400" 
                            : "bg-[#fffcf0] border-[#ffd500]/20 text-[#576575]"
                        }`}>
                          <div>
                            <span className={`block text-[9px] font-bold mb-0.5 ${isPink ? "text-neutral-500" : "text-neutral-450"}`}>도입 혜택</span>
                            <span className={`font-black ${isPink ? "text-rose-400" : "text-[#0d233a]"}`}>가맹비/교육비/로열티 면제</span>
                          </div>
                          <div>
                            <span className={`block text-[9px] font-bold mb-0.5 ${isPink ? "text-neutral-500" : "text-neutral-450"}`}>조리 방식</span>
                            <span className={`font-black ${isPink ? "text-neutral-200" : "text-[#0d233a]"}`}>3분 완벽 베이킹 시스템</span>
                          </div>
                          <div>
                            <span className={`block text-[9px] font-bold mb-0.5 ${isPink ? "text-neutral-500" : "text-neutral-450"}`}>물류 시스템</span>
                            <span className={`font-black ${isPink ? "text-neutral-200" : "text-[#0d233a]"}`}>주 3회 전국 신선 콜드체인</span>
                          </div>
                          <div>
                            <span className={`block text-[9px] font-bold mb-0.5 ${isPink ? "text-neutral-500" : "text-neutral-450"}`}>지원 범위</span>
                            <span className={`font-black ${isPink ? "text-neutral-200" : "text-[#0d233a]"}`}>기기설치 및 1:1 조리 교육</span>
                          </div>
                        </div>
                      </div>

                      {/* Price Section & CTA */}
                      <div className="mt-auto pt-4 border-t border-neutral-200/60 dark:bg-transparent dark:border-neutral-900">
                        <div className="flex justify-between items-baseline gap-2 mb-4">
                          <span className="text-xs sm:text-sm font-bold text-neutral-450 dark:text-neutral-500">초기 패키지 특별 공급가</span>
                          <div className="text-right">
                            <span className="text-[10px] line-through text-neutral-400 dark:text-neutral-600 mr-2 font-mono">정상가 {pkg.normalPrice}</span>
                            <strong className={`text-2xl sm:text-3xl font-black tracking-tight ${isPink ? "text-rose-500" : "text-amber-600"}`}>
                              {pkg.price} <span className="text-[11px] sm:text-xs font-bold text-neutral-400 ml-1">(부가세 포함)</span>
                            </strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Divider between Product Header & Detailed 구성품 */}
                  <div className="h-px w-full bg-neutral-200/60 dark:bg-neutral-900" />

                  {/* Bottom Section: Detailed Components in 2 columns (2열 상세 구성) */}
                  <div className="flex flex-col gap-6">
                    <div className="flex justify-between items-center flex-wrap gap-4">
                      <h4 className={`text-sm sm:text-base font-black tracking-tight flex items-center gap-2 ${isPink ? "text-white" : "text-[#0d233a]"}`}>
                        <Layers size={16} className={labelAccent} /> 패키지 포함 구성품 상세 안내
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {pkg.items.map((item, idx) => (
                        <div key={idx} className={`flex gap-3.5 items-center sm:items-start group/item p-3 sm:p-4 rounded-2xl transition-all duration-300 ${
                          isPink 
                            ? "bg-neutral-950/45 hover:bg-neutral-950/80 border border-neutral-850 hover:border-rose-500/20 shadow-md shadow-black/10" 
                            : "bg-gradient-to-br from-[#fffdf8] to-[#fffcf0] hover:from-[#fffdf4] hover:to-[#fff9e6] border border-[#e6dfc3] hover:border-[#ffd500]/60 shadow-sm shadow-[#0d233a]/[0.01]"
                        }`}>
                          {/* Premium Compact Thumbnail (Now visible on mobile too!) */}
                          <div className={`w-16 h-16 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 border relative shadow-sm transition-transform duration-300 group-hover/item:scale-[1.03] ${
                            isPink ? "border-neutral-800 bg-neutral-950" : "border-[#e6dfc3] bg-white"
                          }`}>
                            <img 
                              src={getCloudinaryResizedUrl(item.imageUrl, 150, 150)} 
                              alt={item.title} 
                              className="w-full h-full object-cover transition-transform duration-350"
                            />
                          </div>
                          
                          <div className="min-w-0 flex-1 py-0.5">
                            <div className="flex gap-2 items-start">
                              <span className={`text-xs sm:text-sm font-black font-mono shrink-0 mt-0.5 ${labelAccent}`}>{String(idx+1).padStart(2, "0")}</span>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center flex-wrap gap-1.5 sm:gap-2">
                                  <strong className={`block text-[13px] sm:text-[15px] font-black leading-snug ${isPink ? "text-white" : "text-[#0d233a]"}`}>
                                    {item.title}
                                  </strong>
                                  {item.qty && (
                                    <span className={`px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-mono font-black tracking-wider shrink-0 shadow-sm border whitespace-nowrap ${
                                      isPink 
                                        ? "bg-rose-500/10 text-rose-400 border-rose-500/20" 
                                        : "bg-[#ffd500]/10 text-amber-600 border-[#ffd500]/25"
                                    }`}>
                                      {item.qty}
                                    </span>
                                  )}
                                </div>
                                <p className={`text-[11px] sm:text-xs font-semibold leading-relaxed mt-1 whitespace-normal break-all ${
                                  isPink ? "text-neutral-400" : "text-[#576575]"
                                }`}>
                                  {item.desc}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card Bottom / Footer Actions */}
                  <div className="pt-6 border-t border-neutral-200/40 dark:border-neutral-900/60 flex items-center justify-between flex-wrap gap-4">
                    <span className="text-[10px] font-bold text-neutral-450 dark:text-neutral-500">
                      * 기기 및 물류 세팅, 1:1 조리 아카데미 교육 및 초기 포장 패키지 지원 일체 포함
                    </span>
                    <button
                      type="button"
                      onClick={() => setInquiryForcedOpen(true)}
                      className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-xs font-black transition-all ${
                        isPink 
                          ? "bg-rose-500 hover:bg-rose-600 text-white shadow-md shadow-rose-500/10" 
                          : "bg-amber-400 hover:bg-amber-300 text-neutral-950 shadow-md shadow-amber-400/10"
                      }`}
                    >
                      상세 견적 상담 <ArrowUpRight size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Combined/Double Package Special Offer Banner - Premium Neon Infographic Card */}
            <div className={`rounded-3xl p-6 sm:p-10 border transition-all duration-500 relative overflow-hidden mb-16 ${
              isPink 
                ? "bg-gradient-to-br from-[#181519]/95 via-[#1a1215]/80 to-[#0e141a]/95 border-neutral-800 shadow-2xl" 
                : "bg-gradient-to-br from-[#fffdf4] via-[#fff9e6] to-[#fff3cc] border-[#ffd500]/40 shadow-xl"
            }`}
            style={{
              boxShadow: isPink 
                ? "0 0 30px -5px rgba(245, 158, 11, 0.35), 0 0 20px -5px rgba(244, 63, 94, 0.2)"
                : "0 0 25px -5px rgba(251, 191, 36, 0.25), 0 0 15px -3px rgba(13, 35, 58, 0.05)"
            }}>
              {/* Background decorative glows */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 dark:bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 dark:bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col items-center">
                {/* Header Tag */}
                <div className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest mb-6 ${
                  isPink 
                    ? "bg-rose-500 text-white shadow-md shadow-rose-500/20" 
                    : "bg-amber-400 text-neutral-950 shadow-md shadow-amber-400/20"
                }`}>
                  <Sparkles size={12} className="animate-pulse" /> Double Package Special Infographic
                </div>

                <h3 className={`text-2xl sm:text-3xl font-black text-center mb-2 tracking-tight ${textTitle}`}>
                  120시리즈 결합 도입 하이브리드 메가 혜택
                </h3>
                <p className={`text-xs sm:text-sm text-center mb-10 font-semibold max-w-2xl ${textDesc}`}>
                  120겹파이와 에그120을 동시에 도입하고 주방 인프라와 배달 플랫폼 시너지를 극대화하세요.
                </p>

                {/* Infographic Grid Flow */}
                <div className="w-full max-w-4xl flex flex-col md:flex-row items-center justify-between gap-6 mb-8 relative">
                  
                  {/* Left: Package 01 */}
                  <div className={`w-full md:w-[44%] rounded-2xl p-5 flex items-center gap-5 border transition-all duration-300 hover:scale-[1.02] shadow-sm ${
                    isPink ? "bg-neutral-950/90 border-neutral-900" : "bg-white border-[#ffd500]/25 shadow-sm"
                  }`}>
                    <img 
                      src="https://res.cloudinary.com/dfarfqx7e/image/upload/f_auto,q_auto/v1781187164/120%EA%B2%B9%ED%8C%8C%EC%9D%B4_%EC%97%B0%EC%B6%9C4_r90tky_lqzsb6.jpg" 
                      alt="120겹파이" 
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-neutral-200/40 dark:border-neutral-800 shrink-0 shadow-sm"
                    />
                    <div className="min-w-0">
                      <span className={`block text-[10px] font-black uppercase tracking-wider ${labelAccent}`}>Category 01</span>
                      <strong className={`block text-sm sm:text-base font-black truncate leading-snug ${isPink ? "text-white" : "text-[#0d233a]"}`}>120겹파이 올인원 패키지</strong>
                      <span className={`text-xs sm:text-sm font-mono font-black ${isPink ? "text-neutral-300" : "text-[#576575]"}`}>4,400,000 원 <span className="text-[10px] font-bold text-neutral-400 block sm:inline sm:ml-1">(부가세 포함)</span></span>
                    </div>
                  </div>

                  {/* Plus Sign */}
                  <div className="flex justify-center shrink-0">
                    <span className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xl border shadow-sm transition-all duration-300 ${
                      isPink 
                        ? "bg-neutral-950 border-neutral-800 text-rose-400 hover:border-rose-500/40" 
                        : "bg-white border-[#ffd500] text-amber-600 hover:bg-[#fffdf4]"
                    }`}>
                      +
                    </span>
                  </div>

                  {/* Right: Package 02 */}
                  <div className={`w-full md:w-[44%] rounded-2xl p-5 flex items-center gap-5 border transition-all duration-300 hover:scale-[1.02] shadow-sm ${
                    isPink ? "bg-neutral-950/90 border-neutral-900" : "bg-white border-[#ffd500]/25 shadow-sm"
                  }`}>
                    <img 
                      src="https://res.cloudinary.com/dfarfqx7e/image/upload/f_auto,q_auto/v1781187166/egg120_%EB%A9%94%EC%9D%B8_%EB%B0%B0%EB%84%88_owuycx_l2nggx.jpg" 
                      alt="egg120" 
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-neutral-200/40 dark:border-neutral-800 shrink-0 shadow-sm"
                    />
                    <div className="min-w-0">
                      <span className={`block text-[10px] font-black uppercase tracking-wider ${labelAccent}`}>Category 02</span>
                      <strong className={`block text-sm sm:text-base font-black truncate leading-snug ${isPink ? "text-white" : "text-[#0d233a]"}`}>egg120 프리미엄 패키지</strong>
                      <span className={`text-xs sm:text-sm font-mono font-black ${isPink ? "text-neutral-300" : "text-[#576575]"}`}>3,300,000 원 <span className="text-[10px] font-bold text-neutral-400 block sm:inline sm:ml-1">(부가세 포함)</span></span>
                    </div>
                  </div>
                </div>

                {/* Arrow & BIG SUM indication in flow */}
                <div className="w-full max-w-xl flex flex-col items-center mb-8">
                  <div className={`flex flex-col items-center mb-4`}>
                    <div className={`w-0.5 h-6 ${isPink ? "bg-rose-500/30" : "bg-[#ffd500]/50"}`} />
                    <div className={`w-2 h-2 rotate-45 border-b border-r -mt-1.5 ${
                      isPink ? "border-rose-500/30" : "border-[#ffd500]/50"
                    }`} />
                  </div>
                  
                  {/* Huge Sum Label */}
                  <div className={`px-10 py-3 rounded-2xl border-2 text-center transition-all duration-300 shadow-md ${
                    isPink 
                      ? "bg-[#181114] border-rose-500/30 text-rose-300 shadow-rose-950/20" 
                      : "bg-[#fff9e6] border-[#ffd500]/40 text-amber-700 shadow-sm"
                  }`}>
                    <span className="block text-[10px] uppercase font-bold tracking-widest opacity-85 mb-1">두 패키지 개별 도입 합계</span>
                    <strong className="text-2xl sm:text-3xl font-black font-mono leading-none tracking-tight">7,700,000 원 <span className="text-xs font-bold block mt-1 opacity-80">(부가세 포함)</span></strong>
                  </div>
                </div>

                {/* Final Premium Neon Glow Discount Box */}
                <div className={`w-full max-w-2xl rounded-2xl p-6 sm:p-8 border-2 text-center relative overflow-hidden transition-all duration-500 ${
                  isPink 
                    ? "bg-[#140e11]/90 border-rose-500" 
                    : "bg-white/95 border-[#ffd500]"
                }`}
                style={{
                  boxShadow: isPink
                    ? "0 0 25px rgba(244, 63, 94, 0.5), inset 0 0 10px rgba(244, 63, 94, 0.08)"
                    : "0 0 20px rgba(251, 191, 36, 0.4), inset 0 0 10px rgba(251, 191, 36, 0.05)",
                  animation: "neonPulse 3s infinite alternate"
                }}>
                  {/* CSS Pulse Keyframes injected dynamically or styled natively */}
                  <style>{`
                    @keyframes neonPulse {
                      0% {
                        box-shadow: ${isPink ? "0 0 15px rgba(244, 63, 94, 0.3)" : "0 0 15px rgba(251, 191, 36, 0.3)"};
                        border-color: ${isPink ? "#f43f5e" : "#ffd500"};
                      }
                      100% {
                        box-shadow: ${isPink ? "0 0 35px rgba(244, 63, 94, 0.7)" : "0 0 25px rgba(251, 191, 36, 0.5)"};
                        border-color: ${isPink ? "#ec4899" : "#ffb700"};
                      }
                    }
                  `}</style>
                  
                  {/* FIXED "BEST VALUE" ribbon positioning using safe margins to avoid cut-offs */}
                  <div className="absolute top-0 right-0 overflow-hidden w-28 h-28 pointer-events-none">
                    <div className={`absolute top-4 right-[-32px] transform rotate-45 text-center font-black text-[9px] py-1 w-32 shadow-sm uppercase tracking-widest ${
                      isPink ? "bg-rose-500 text-white" : "bg-amber-400 text-neutral-950"
                    }`}>
                      Best Value
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 relative z-10">
                    {/* Discount Tag Infographic */}
                    <div className={`rounded-2xl p-4 flex flex-col items-center justify-center border shrink-0 ${
                      isPink 
                        ? "bg-rose-500 border-rose-400 text-white shadow-lg shadow-rose-500/20" 
                        : "bg-rose-500 border-rose-600 text-white shadow-lg shadow-rose-950/40"
                    }`}>
                      <span className="text-[10px] font-bold uppercase tracking-wider leading-none opacity-90 mb-1.5">결합 즉시 할인 혜택</span>
                      <strong className="text-xl sm:text-2xl font-black leading-none tracking-tight font-mono">- 800,000 원</strong>
                    </div>

                    {/* Pricing Info */}
                    <div className="text-center sm:text-left flex-1">
                      <span className={`block text-[11px] font-black tracking-widest uppercase mb-1 ${
                        isPink ? "text-neutral-450" : "text-[#576575]"
                      }`}>
                        하이브리드 결합 최종 메가 특가
                      </span>
                      <div className="flex flex-wrap items-baseline justify-center sm:justify-start gap-3">
                        <span className={`text-sm line-through font-mono font-bold ${
                          isPink ? "text-neutral-500" : "text-neutral-400"
                        }`}>7,700,000 원</span>
                        <strong className={`text-3xl sm:text-4xl font-black tracking-tight ${
                          isPink ? "text-rose-500" : "text-[#0d233a]"
                        }`}>
                          6,900,000 원 <span className="text-[10px] sm:text-xs font-bold text-neutral-400 block sm:inline sm:ml-1">(부가세 포함)</span>
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* 🤝 카테고리 2: 120 프랜즈 메뉴 */}
          <section className="mb-20">
            <div className="flex items-center gap-2.5 mb-5">
              <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm shrink-0 shadow-md ${
                isPink ? "bg-rose-500 text-white" : "bg-amber-400 text-neutral-950"
              }`}>
                B
              </span>
              <div>
                <span className={`text-[10px] tracking-widest font-black uppercase font-mono ${labelAccent}`}>CATEGORY 02 · FRIENDS MENU LOGISTICS</span>
                <h2 className={`text-2xl sm:text-3xl font-black tracking-tight ${textTitle}`}>120 프랜즈 메뉴</h2>
              </div>
            </div>

            {/* Friends Menu Description Hero */}
            <div className={`rounded-3xl p-6 sm:p-8 mb-10 transition-colors duration-300 ${innerCardBg}`}>
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div className="max-w-3xl">
                  <h3 className={`text-lg font-black mb-2 ${textTitle}`}>초기 도입 고정비 0원, 오직 필요한 원자재(완제품) 지원!</h3>
                  <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                    120 프랜즈 메뉴는 별도의 브랜드 전용 기기나 리뉴얼 강제 조건이 전혀 없습니다. 매장 내 기존 조리 장비(오븐, 전자레인지, 튀김기 등)와 카운터를 활용하여 즉시 도입할 수 있으며, <strong>120본사의 신선 물류망을 통해 완벽하게 전처리된 핵심 식재료를 업계 최저 단가로 그대로 배송 및 공급해 드립니다.</strong>
                  </p>
                </div>
                <div className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-xs font-black shrink-0 ${
                  isPink ? "bg-neutral-900 border-neutral-800 text-rose-400" : "bg-white border-[#ffd500]/30 text-amber-600 shadow-sm"
                }`}>
                  <Truck size={15} /> 전국 신선 3일 콜드체인 직배송
                </div>
              </div>
            </div>
 
            {/* 🌟 Friends Menus Cards - Rendering all 4 items at once without filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
              {FRIENDS_MENUS.map((menu, idx) => (
                <div key={idx} className={`rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 ${cardBg} ${
                  isPink ? "hover:border-rose-500/40" : "hover:border-[#ffd500]/60"
                } group/card`}>
                  <div>
                    {/* Top Details & Badge */}
                    <div className="flex justify-between items-center mb-4">
                      <span className={`px-2.5 py-1 rounded text-[10px] font-black tracking-wide uppercase ${menu.badgeColor}`}>
                        {menu.name}
                      </span>
                      {/* Styled Square Box Tag for Supply Type */}
                      <span className={`px-2.5 py-1 rounded text-[10px] font-black tracking-tight border ${
                        menu.supplyType === "완제품"
                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30"
                          : "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/30"
                      }`}>
                        {menu.supplyType} 공급
                      </span>
                    </div>
 
                    {/* Premium Cover Image aspect-16/10 with strict no-distortion styling */}
                    <div className="aspect-[16/10] w-full rounded-2xl overflow-hidden relative mb-5 bg-neutral-100 dark:bg-neutral-950 border border-neutral-200/50 dark:border-neutral-900 shadow-sm flex items-center justify-center">
                      <img 
                        src={getCloudinaryResizedUrl(menu.imageUrl, 400, 250)} 
                        alt={menu.name} 
                        className="w-full h-full object-cover object-center group-hover/card:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                      <span className="absolute bottom-2.5 left-2.5 bg-black/60 backdrop-blur-md rounded-full px-2 py-0.5 text-[8px] font-bold text-white flex items-center gap-1">
                        <CheckCircle2 size={8} className="text-emerald-400" /> 본사 공급 식자재 실물
                      </span>
                    </div>
 
                    <span className={`block text-[10px] font-black uppercase tracking-wider mb-2 ${isPink ? "text-neutral-400" : "text-neutral-500"}`}>
                      {menu.sub}
                    </span>
                    <p className={`text-xs sm:text-sm font-semibold mb-4 leading-relaxed ${textDesc}`}>
                      {menu.desc}
                    </p>
                  </div>
 
                  <div className={`rounded-2xl p-4 text-[11px] font-bold leading-normal mt-4 transition-colors ${innerCardBg}`}>
                    <span className="block text-[8px] uppercase tracking-wider text-neutral-450 dark:text-neutral-500 mb-1.5">공급 인프라 핵심 조건</span>
                    <div className="flex gap-2 items-start">
                      <Truck size={13} className={`shrink-0 mt-0.5 ${labelAccent}`} />
                      <span className={isPink ? "text-neutral-800" : "text-neutral-200"}>{menu.highlight}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CTA Area */}
          <div className="mt-16 text-center">
            <h3 className={`text-xl sm:text-2xl font-black mb-4 ${textTitle}`}>우리 매장 상황에 꼭 맞는 도입 방식을 상담받아보세요</h3>
            <p className={`text-xs sm:text-sm font-medium mb-8 ${textDesc}`}>
              점주님의 보유 기기와 주방 구조에 따라 패키지 품목을 최적화해 불필요한 예산을 줄여 드립니다.
            </p>
            <button
              type="button"
              onClick={() => setInquiryForcedOpen(true)}
              className={`inline-flex items-center gap-2 px-6 py-4 rounded-full text-sm font-black transition-all ${
                isPink
                  ? "bg-rose-500 text-white hover:bg-rose-600 shadow-lg shadow-rose-500/10 hover:scale-[1.02]"
                  : "bg-amber-400 text-neutral-950 hover:bg-amber-300 shadow-lg shadow-amber-400/10 hover:scale-[1.02]"
              }`}
            >
              1:1 맞춤 도입 상담 신청하기 <ArrowUpRight size={15} />
            </button>
          </div>
          <FloatingAndInquiry
            forceOpenModal={inquiryForcedOpen}
            onModalClose={() => setInquiryForcedOpen(false)}
            isPink={isPink}
          />
        </div>
      </main>
      <Footer theme={isPink ? "black" : "yellow"} />
      <RightFloatingQuickBar />
      <RightSideInquiryBanner />
    </div>
  );
}
