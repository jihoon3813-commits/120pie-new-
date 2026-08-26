"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useModalBackHandler } from "@/components/MobileBackManager";
import {
  LayoutDashboard,
  ShoppingBag,
  History,
  Megaphone,
  MessageSquare,
  BookOpen,
  Image as ImageIcon,
  ArrowLeft,
  ArrowRight,
  Package,
  Headphones,
  Monitor,
  Search,
  Plus,
  Minus,
  Trash2,
  Download,
  FileText,
  ChevronRight,
  Clock,
  CheckCircle2,
  Truck,
  Bell,
  LogOut,
  Menu,
  X,
  AlertCircle,
  Check,
  Send,
  ArrowRightLeft,
  Camera,
  Video,
  Phone,
  MessageCircle,
  ClipboardList,
  ExternalLink,
  MapPin,
  Copy,
  CreditCard,
  Landmark,
  User,
  PanelLeftOpen,
  PanelLeftClose
} from "lucide-react";

import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import Footer from "@/app/components/Footer";
import { optimizeCloudinaryUrl } from "@/app/utils/cloudinary";

const COLOR_PRESETS = {
  blue: { label: "블루", bg: "bg-blue-50", text: "text-blue-500", border: "border-blue-200", hexBg: "#eff6ff", hexText: "#3b82f6", hexBorder: "#bfdbfe" },
  emerald: { label: "초록", bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200", hexBg: "#ecfdf5", hexText: "#059669", hexBorder: "#a7f3d0" },
  orange: { label: "오렌지", bg: "bg-orange-50", text: "text-orange-500", border: "border-orange-200", hexBg: "#fff7ed", hexText: "#f97316", hexBorder: "#ffedd5" },
  pink: { label: "핑크", bg: "bg-[#ffd3df]", text: "text-[#bf3e67]", border: "border-[#f2ccd7]", hexBg: "#ffd3df", hexText: "#bf3e67", hexBorder: "#f2ccd7" },
  yellow: { label: "옐로", bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-200", hexBg: "#fef3c7", hexText: "#d97706", hexBorder: "#fde68a" },
  purple: { label: "보라", bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-200", hexBg: "#f5f3ff", hexText: "#7c3aed", hexBorder: "#ddd6fe" },
  gray: { label: "회색", bg: "bg-neutral-50", text: "text-neutral-600", border: "border-neutral-200", hexBg: "#f5f5f5", hexText: "#525252", hexBorder: "#e5e5e5" }
};

const DEFAULT_STATUS_COLORS: { [status: string]: string } = {
  "주문완료": "pink",
  "입금대기": "yellow",
  "결제완료": "emerald",
  "배송준비중": "orange",
  "배송중": "blue",
  "배송완료": "emerald",
  "주문취소": "gray"
};

const formatOrderDate = (dateStr: string, creationTime?: number) => {
  if (!dateStr && !creationTime) return "";
  const trimmed = (dateStr || "").trim();

  if (/^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}$/.test(trimmed)) {
    if (!trimmed.endsWith(" 00:00") || !creationTime) {
      return trimmed;
    }
  } else if (trimmed.includes(" ") || trimmed.includes("T")) {
    const clean = trimmed.replace("T", " ");
    const parts = clean.split(" ");
    const ymd = parts[0];
    const timeParts = parts[1] ? parts[1].split(":") : ["00", "00"];
    const hh = (timeParts[0] || "00").padStart(2, "0");
    const mm = (timeParts[1] || "00").padStart(2, "0");
    const formatted = `${ymd} ${hh}:${mm}`;
    if (!formatted.endsWith(" 00:00") || !creationTime) {
      return formatted;
    }
  }

  if (creationTime) {
    const kst = new Date(creationTime + 9 * 60 * 60 * 1000);
    const y = kst.getUTCFullYear();
    const m = String(kst.getUTCMonth() + 1).padStart(2, "0");
    const d = String(kst.getUTCDate()).padStart(2, "0");
    const hh = String(kst.getUTCHours()).padStart(2, "0");
    const mm = String(kst.getUTCMinutes()).padStart(2, "0");
    return `${y}-${m}-${d} ${hh}:${mm}`;
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return `${trimmed} 00:00`;
  }
  return trimmed;
};

const getFormattedCurrentDateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

// ==========================================
// TYPES DEFINITIONS
// ==========================================
interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  packSize: string;
  img: string;
  stock: "in_stock" | "low_stock" | "out_of_stock";
  desc: string;
  labels?: string[];
  shippingType?: "free" | "A" | "B" | "C" | "BOX";
  options?: string[]; // 추가된 제품 선택 옵션 필드
  status?: string;
  isActive?: boolean;
}

interface CartItem {
  productId: string;
  selectedOption?: string; // 선택된 옵션 필드 추가
  quantity: number;
}

interface Order {
  id: string;
  date: string;
  items: { productName: string; quantity: number; price: number }[];
  totalPrice: number;
  status: string;
  courier?: string;
  trackingNo?: string;
  trackingList?: { courier: string; trackingNo: string }[];
}

interface Inquiry {
  id: string;
  category: string;
  title: string;
  date: string;
  status: "답변대기" | "답변완료";
  content: string;
  answer?: string;
}

interface Notice {
  id: string;
  tag: "필독" | "일반" | "신메뉴" | "물류";
  title: string;
  date: string;
  views: number;
  content: string;
  _id?: any;
}

interface Material {
  id: string;
  title: string;
  date: string;
  size: string;
  format: string;
  desc: string;
  img?: string;
  fileUrl?: string;
  fileName?: string;
}

// ==========================================
// INITIAL SEED MOCK DATA
// ==========================================
const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "로제미트파이 생지",
    category: "냉동생지/자재",
    price: 42000,
    packSize: "1박스 (60개입)",
    img: "https://res.cloudinary.com/dx7l09wwu/image/upload/f_auto,q_auto/v1779760050/%EB%A1%9C%EC%A0%9C%EB%AF%B8%ED%8A%B8%ED%8C%8C%EC%9D%B4_khogbn.jpg",
    stock: "in_stock",
    desc: "육즙 가득 미트소스와 로제 크림이 가미된 시그니처 대표 생지"
  },
  {
    id: "prod-2",
    name: "애플시나몬파이 생지",
    category: "냉동생지/자재",
    price: 42000,
    packSize: "1박스 (60개입)",
    img: "https://res.cloudinary.com/dx7l09wwu/image/upload/f_auto,q_auto/v1779760051/%EC%95%A0%ED%94%8C%ED%8C%8C%EC%9D%B4_yurkh5.jpg",
    stock: "in_stock",
    desc: "달콤 상큼한 사과 과육 and 시나몬 아로마가 어우러진 스테디셀러 디저트 생지"
  },
  {
    id: "prod-3",
    name: "콘치즈파이 생지",
    category: "냉동생지/자재",
    price: 42000,
    packSize: "1박스 (60개입)",
    img: "https://res.cloudinary.com/dx7l09wwu/image/upload/f_auto,q_auto/v1779760050/%EC%BD%98%EC%B9%98%EC%A6%88%ED%8C%8C%EC%9D%B4_qvb2u5.jpg",
    stock: "low_stock",
    desc: "고소한 스위트콘 and 부드러운 치즈가 조합된 남녀노소 취향저격 생지"
  },
  {
    id: "prod-4",
    name: "쌀계란빵 오리지널 믹스",
    category: "냉동생지/자재",
    price: 21000,
    packSize: "1팩 (5kg)",
    img: "https://res.cloudinary.com/dx7l09wwu/image/upload/f_auto,q_auto/v1779761729/%EC%98%A4%EB%A6%AC%EC%A7%80%EB%84%90%EA%B3%84%EB%9E%80%EB%B9%B52_kdqsqv.jpg",
    stock: "in_stock",
    desc: "에그120 전용 100% 국산 쌀가루 계란빵 전용 반죽 파우더 믹스"
  },
  {
    id: "prod-5",
    name: "츄러스 전용 냉동생지",
    category: "냉동생지/자재",
    price: 36000,
    packSize: "1박스 (100개입)",
    img: "https://res.cloudinary.com/dx7l09wwu/image/upload/f_auto,q_auto/v1779762878/%EC%98%A4%EB%A6%AC%EC%A7%80%EB%84%90_koyjlk.jpg",
    stock: "in_stock",
    desc: "기름 없이 오븐 조리가 가능한 바삭하고 쫀득한 츄러스 전용 냉동 생지"
  },
  {
    id: "prod-6",
    name: "[홍보물] 매장용 양면 포스터 및 스티커",
    category: "부자재/포장재",
    price: 5000,
    packSize: "1개 (1개입)",
    img: "https://res.cloudinary.com/dfarfqx7e/image/upload/f_auto,q_auto/v1781184019/120%EA%B2%B9%ED%8C%8C%EC%9D%B4_%ED%81%AC%EB%A6%BC%EC%B9%98%EC%A6%88_%EC%97%B0%EC%B6%9C_ebuddm.jpg",
    stock: "in_stock",
    desc: "120pie 브랜드 컬러의 매장 유리창 부착용 홍보 포스터 세트",
    options: ["A4 사이즈 포스터", "A3 사이즈 포스터", "카운터용 미니 스티커 5매"]
  }
];

const INITIAL_ORDERS: Order[] = [
  {
    id: "ORD-20260525-01",
    date: "2026-05-25",
    items: [
      { productName: "로제미트파이 생지", quantity: 2, price: 45000 },
      { productName: "에그120 캐릭터 포장 박스", quantity: 1, price: 18000 }
    ],
    totalPrice: 108000,
    status: "배송중"
  },
  {
    id: "ORD-20260518-03",
    date: "2026-05-18",
    items: [
      { productName: "애플시나몬파이 생지", quantity: 1, price: 42000 },
      { productName: "에그군 캐릭터 자석 스티커", quantity: 1, price: 9000 }
    ],
    totalPrice: 51000,
    status: "배송완료"
  }
];

const INITIAL_INQUIRIES: Inquiry[] = [
  {
    id: "INQ-901",
    category: "물류",
    title: "로제미트파이 생지 1박스 오배송 및 박스 훼손 건 접수",
    date: "2026-05-24",
    status: "답변완료",
    content: "안녕하세요 강남역삼점입니다. 어제 입고된 냉동 탑차 배송 물품 중 로제미트파이 생지 1박스의 모서리 부분이 찌그러져 있고 내부 실링 필름이 뜯어져 냉기가 다 빠진 채 배송되었습니다. 1박스 교환 또는 대금 감면 처리 부탁드립니다.",
    answer: "안녕하십니까 강남역삼점 사장님, 본사 물류 지원팀입니다. 불편을 끼쳐드려 대단히 송구합니다. 익일 정기 물류 배송 편에 로제미트파이 생지 정품 1박스를 새 물품으로 교환 출고해 드리겠습니다. 대단히 감사합니다."
  },
  {
    id: "INQ-915",
    category: "기술/AS",
    title: "전용 가열 타이머 기기 액정 백라이트 일시적 오작동",
    date: "2026-05-26",
    status: "답변대기",
    content: "오늘 오전 영업 개시 전 전용 가열 타이머 기기의 전원을 켰는데, 액정 백라이트 불빛이 미세하게 깜빡이며 타이머 수치 가독성이 일시적으로 떨어지는 현상이 있었습니다. 작동은 하나 사전 점검 혹은 교체 AS를 신청합니다."
  }
];

const INITIAL_NOTICES: Notice[] = [
  {
    id: "NOT-01",
    tag: "필독",
    title: "2026년 하반기 전국 가맹점 위생 점검 가이드 및 법정 안전 의무 이수 공지",
    date: "2026-05-20",
    views: 184,
    content: "식약처 하절기 위해 위생 특별 합동 점검 대비 및 안전한 조리 환경 구축을 위한 가맹본부 종합 자가 위생 점검 매뉴얼이 업로드되었습니다. 모든 매장에서는 교육자료실에 배포된 하절기 자가진단표를 출력하시어 기록해 주시기 바랍니다."
  },
  {
    id: "NOT-02",
    tag: "신메뉴",
    title: "여름 한정 신메뉴 '망고파이' 물류 정식 개시 및 레시피 영상 배포",
    date: "2026-05-18",
    views: 245,
    content: "기다려 주시던 여름 시즌 킬러 디저트, '망고파이(생지)' 발주가 금일부로 공식 오픈되었습니다! 상큼하고 향긋한 망고의 진한 필링을 120겹 파이 사이에 가득 채워 최고의 만족감을 제공합니다."
  }
];

const INITIAL_TRAINING: Material[] = [
  {
    id: "TRN-01",
    title: "120겹파이 조리 및 보관 표준 오퍼레이션 매뉴얼 V3.2 (PDF)",
    date: "2026-05-22",
    size: "12.4 MB",
    format: "PDF",
    desc: "120겹 파이 냉동 생지의 완벽한 보관법, 해동 및 미해동 조리 시 타이머 세팅 가이드, 계절별 조리 온도 보정 기준이 집약된 표준 교육 책자 파일입니다.",
    img: "https://res.cloudinary.com/dx7l09wwu/image/upload/f_auto,q_auto/v1779718433/120%EA%B2%B9%ED%8C%8C%EC%9D%B4_%ED%81%AC%EB%A6%BC%EC%B9%98%EC%A6%88_%EC%95%A4_%EC%BD%98%EC%B9%98%EC%A6%88_t7mopc.jpg"
  },
  {
    id: "TRN-02",
    title: "에그120 계란빵 쌀믹스 배합 및 기기 조리 영상 가이드 (MP4)",
    date: "2026-05-15",
    size: "85.6 MB",
    format: "MP4",
    desc: "반죽 성형의 미세 오차를 방지하고 폭신한 볼륨감을 살리기 위해 100% 쌀믹스 파우더와 물, 토핑의 정량 황금 비율 배합법 및 기기 청소 요령을 담은 비디오 교육 강좌입니다.",
    img: "https://res.cloudinary.com/dx7l09wwu/image/upload/f_auto,q_auto/v1779761729/%EC%98%A4%EB%A6%AC%EC%A7%80%EB%84%90%EA%B3%84%EB%9E%80%EB%B9%B52_kdqsqv.jpg"
  }
];

const INITIAL_PR: Material[] = [
  {
    id: "PR-01",
    title: "120파이 커스터드파이 공식 홍보 포스터 (JPG)",
    date: "2026-05-18",
    size: "12.4 MB",
    format: "JPG",
    desc: "부드럽고 달콤한 120겹 커스터드파이 매장 연출컷 및 고화질 원본 홍보 포스터 파일입니다.",
    img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1785471150/120%ED%8C%8C%EC%9D%B4-%EC%BB%A4%EC%8A%A4%ED%84%B0%EB%93%9C-%ED%8F%AC%EC%8A%A4%ED%84%B0__231003_kxtdte.jpg",
    fileUrl: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1785471150/120%ED%8C%8C%EC%9D%B4-%EC%BB%A4%EC%8A%A4%ED%84%B0%EB%93%9C-%ED%8F%AC%EC%8A%A4%ED%84%B0__231003_kxtdte.jpg",
    fileName: "120파이_커스터드파이_포스터.jpg"
  },
  {
    id: "PR-02",
    title: "120파이 카카오톡 채널 전용 홍보 포스터 (PNG)",
    date: "2026-05-19",
    size: "8.7 MB",
    format: "PNG",
    desc: "카카오톡 플러스친구 및 소셜 미디어 배포 전용 120파이 브랜드 홍보 이미지입니다.",
    img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1785471118/KakaoTalk_20260209_200759426_p6hfm2.png",
    fileUrl: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1785471118/KakaoTalk_20260209_200759426_p6hfm2.png",
    fileName: "120파이_카카오톡_홍보.png"
  },
  {
    id: "PR-03",
    title: "120파이 고구마파이 공식 홍보 포스터 (JPG)",
    date: "2026-05-20",
    size: "14.1 MB",
    format: "JPG",
    desc: "달콤하고 고소한 고구마 무스가 가득 들어간 고구마파이 매장 유리창용 고화질 포스터입니다.",
    img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1785471119/120%ED%8C%8C%EC%9D%B4-%EA%B3%A0%EA%B5%AC%EB%A7%88-%ED%8F%AC%EC%8A%A4%ED%84%B0__230917_t4wokx.jpg",
    fileUrl: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1785471119/120%ED%8C%8C%EC%9D%B4-%EA%B3%A0%EA%B5%AC%EB%A7%88-%ED%8F%AC%EC%8A%A4%ED%84%B0__230917_t4wokx.jpg",
    fileName: "120파이_고구마파이_포스터.jpg"
  },
  {
    id: "PR-04",
    title: "120파이 블루베리파이 공식 홍보 포스터 (JPG)",
    date: "2026-05-21",
    size: "15.3 MB",
    format: "JPG",
    desc: "상큼한 블루베리 과육이 씹히는 프리미엄 블루베리파이 매장 부착용 원본 그래픽 시안입니다.",
    img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1785471119/120%ED%8C%8C%EC%9D%B4-%EB%B8%94%EB%A3%A8%EB%B2%A0%EB%A6%AC-%ED%8F%AC%EC%8A%A4%ED%84%B0__230917_mkxnex.jpg",
    fileUrl: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1785471119/120%ED%8C%8C%EC%9D%B4-%EB%B8%94%EB%A3%A8%EB%B2%A0%EB%A6%AC-%ED%8F%AC%EC%8A%A4%ED%84%B0__230917_mkxnex.jpg",
    fileName: "120파이_블루베리파이_포스터.jpg"
  },
  {
    id: "PR-05",
    title: "120파이 망고파이 스페셜 시즌 홍보 포스터 (JPG)",
    date: "2026-05-22",
    size: "13.8 MB",
    format: "JPG",
    desc: "여름 대비 스페셜 신메뉴 망고파이 매장 윈도우용 시네마틱 고화질 원본 포스터입니다.",
    img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1785471119/120%ED%8C%8C%EC%9D%B4-%EB%A7%9D%EA%B3%A0-%ED%8F%AC%EC%8A%A4%ED%84%B0__230917_axo5ms.jpg",
    fileUrl: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1785471119/120%ED%8C%8C%EC%9D%B4-%EB%A7%9D%EA%B3%A0-%ED%8F%AC%EC%8A%A4%ED%84%B0__230917_axo5ms.jpg",
    fileName: "120파이_망고파이_포스터.jpg"
  }
];

export default function PortalPage() {
  // ==========================================
  // STATE MANAGEMENT (LOCAL STORAGE SYNCD)
  // ==========================================
  const formatPhoneNumber = (value: string) => {
    if (!value) return "";
    const clean = value.replace(/[^\d]/g, "");
    
    // 1. 전국 대표번호 (15xx, 16xx, 18xx 등 8자리 번호)
    if (/^(15|16|18|17)\d+/.test(clean) && !clean.startsWith("0")) {
      if (clean.length <= 4) return clean;
      return `${clean.slice(0, 4)}-${clean.slice(4, 8)}`;
    }

    // 2. 서울 지역번호 (02)
    if (clean.startsWith("02")) {
      if (clean.length <= 2) return clean;
      if (clean.length <= 5) return `${clean.slice(0, 2)}-${clean.slice(2)}`;
      if (clean.length <= 9) return `${clean.slice(0, 2)}-${clean.slice(2, 5)}-${clean.slice(5, 9)}`;
      return `${clean.slice(0, 2)}-${clean.slice(2, 6)}-${clean.slice(6, 10)}`;
    }

    // 3. 050 안심번호 (12자리: 0504-xxxx-xxxx 등)
    if (clean.startsWith("050") && clean.length > 11) {
      return `${clean.slice(0, 4)}-${clean.slice(4, 8)}-${clean.slice(8, 12)}`;
    }

    // 4. 일반 이동전화 및 지역번호 (010, 031, 042, 070 등)
    if (clean.length <= 3) return clean;
    if (clean.length <= 6) return `${clean.slice(0, 3)}-${clean.slice(3)}`;
    if (clean.length <= 10) {
      return `${clean.slice(0, 3)}-${clean.slice(3, 6)}-${clean.slice(6, 10)}`;
    }
    return `${clean.slice(0, 3)}-${clean.slice(3, 7)}-${clean.slice(7, 11)}`;
  };

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);
  const [loginId, setLoginId] = useState<string>("");
  const [loginPw, setLoginPw] = useState<string>("");
  const [loginError, setLoginError] = useState<string | null>(null);

  const [currentMenu, setCurrentMenu] = useState<string>("dashboard");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [statusColors, setStatusColors] = useState<Record<string, string>>(DEFAULT_STATUS_COLORS);

  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem("120_status_colors");
      if (stored) {
        try {
          setStatusColors(JSON.parse(stored));
        } catch (e) {
          console.error("Failed to parse status colors:", e);
        }
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Dynamic collections synced via localStorage
  const [products, setProducts] = useState<Product[]>([]);
  const [stores, setStores] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [banner, setBanner] = useState<any>(null);
  const [activeStoreId, setActiveStoreId] = useState<string>("owner");

  const [notices, setNotices] = useState<Notice[]>([]);
  const [trainings, setTrainings] = useState<Material[]>([]);
  const [prs, setPrs] = useState<Material[]>([]);

  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [selectedNoticeCategory, setSelectedNoticeCategory] = useState<string>("");
  const [showCredentialModal, setShowCredentialModal] = useState<boolean>(false);
  const [baeminId, setBaeminId] = useState<string>("");
  const [baeminPw, setBaeminPw] = useState<string>("");
  const [coupangId, setCoupangId] = useState<string>("");
  const [coupangPw, setCoupangPw] = useState<string>("");

  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [trackingModalOpen, setTrackingModalOpen] = useState<boolean>(false);
  const [trackingInfo, setTrackingInfo] = useState<{ courier: string; trackingNo: string; orderId: string; status: string; date: string } | null>(null);
  const [apiTrackingData, setApiTrackingData] = useState<any | null>(null);
  const [apiTrackingLoading, setApiTrackingLoading] = useState<boolean>(false);
  const [apiTrackingError, setApiTrackingError] = useState<boolean>(false);
  const [selectedProductDetail, setSelectedProductDetail] = useState<any | null>(null);
  const [selectedProductOption, setSelectedProductOption] = useState<string>("");
  const [localSelectedOptions, setLocalSelectedOptions] = useState<{ optionName: string; quantity: number }[]>([]);
  const [localSingleQty, setLocalSingleQty] = useState<number>(1);

  // 배송지 정보 상태 (가맹점 기본정보 프리필)
  const [deliveryAddress, setDeliveryAddress] = useState<string>("");
  const [deliveryDetailAddress, setDeliveryDetailAddress] = useState<string>("");
  const [recipientName, setRecipientName] = useState<string>("");
  const [recipientPhone, setRecipientPhone] = useState<string>("");
  const [deliveryInfoLoaded, setDeliveryInfoLoaded] = useState<boolean>(false);
  const [orderPayMethod, setOrderPayMethod] = useState<"card" | "bank">("card");

  // 가맹점 등록 신청 관련 상태
  const [showRegisterModal, setShowRegisterModal] = useState<boolean>(false);
  const [regId, setRegId] = useState<string>("");
  const [regPw, setRegPw] = useState<string>("");
  const [regPwConfirm, setRegPwConfirm] = useState<string>("");
  const [regName, setRegName] = useState<string>("");
  const [regOwner, setRegOwner] = useState<string>("");
  const [regPhone, setRegPhone] = useState<string>("");
  const [regRoadAddress, setRegRoadAddress] = useState<string>("");
  const [regDetailAddress, setRegDetailAddress] = useState<string>("");
  const [regDate, setRegDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [regAdoptionMenu, setRegAdoptionMenu] = useState<string[]>([]);

  // 주소 검색 팝업 관련 상태
  const [showCheckoutModal, setShowCheckoutModal] = useState<boolean>(false);
  const [showAddressPopup, setShowAddressPopup] = useState<boolean>(false);
  const [addressTab, setAddressTab] = useState<"kakao" | "simulated">("kakao");
  const [addressSearchKeyword, setAddressSearchKeyword] = useState<string>("");
  const [addressSearchResults, setAddressSearchResults] = useState<string[]>([]);

  // Profile Update States
  const [profilePw, setProfilePw] = useState<string>("");
  const [profilePwConfirm, setProfilePwConfirm] = useState<string>("");
  const [profileOwner, setProfileOwner] = useState<string>("");
  const [profilePhone, setProfilePhone] = useState<string>("");
  const [profileRoadAddress, setProfileRoadAddress] = useState<string>("");
  const [profileDetailAddress, setProfileDetailAddress] = useState<string>("");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState<boolean>(false);
  const [addressSearchTarget, setAddressSearchTarget] = useState<"register" | "profile" | "delivery">("register");
  const addressSearchTargetRef = useRef<"register" | "profile" | "delivery">("register");

  // ==========================================
  // CONVEX REAL-TIME SYNC HOOKS
  // ==========================================
  const convexBanners = useQuery(api.banners.get);
  const convexPopup = useQuery(api.popups.get, { targetPage: "portal" });
  const convexFloating = useQuery(api.floatings.get);
  const convexStores = useQuery(api.stores.get);
  const convexProducts = useQuery(api.products.get);
  const convexOrders = useQuery(api.orders.list);
  const convexMaterials = useQuery(api.materials.list);
  const convexStoreInquiries = useQuery(api.storeInquiries.listByStore, { storeId: activeStoreId || "owner" });
  const convexNotices = useQuery(api.notices.list);
  const convexProductCategories = useQuery(api.categories.get);
  const savedCredentials = useQuery(api.deliveryCredentials.getByStoreAndNotice, {
    noticeId: selectedNotice?.id || "",
    storeId: activeStoreId || "owner",
  });

  const createStoreMutation = useMutation(api.stores.createOrUpdate);

  const saveOrderMutation = useMutation(api.orders.createOrUpdate);
  const syncProductsMutation = useMutation(api.products.syncProducts);
  const syncOrdersMutation = useMutation(api.orders.syncOrders);
  const createInquiryMutation = useMutation(api.storeInquiries.createOrUpdate);
  const incrementNoticeViewsMutation = useMutation(api.notices.incrementViews);
  const submitDeliveryCredentials = useMutation(api.deliveryCredentials.submit);
  const updateOrderStatusMutation = useMutation(api.orders.updateStatus);
  const verifyAndSaveOrderAction = useAction(api.payments.verifyAndSaveOrder);
  const sendSmsAction = useAction(api.aligo.sendSms);



  useEffect(() => {
    if (typeof window !== "undefined") {
      const logged = localStorage.getItem("120_owner_logged_in");
      if (logged === "true") {
        setIsLoggedIn(true);
      }
      setCheckingAuth(false);
    }
  }, []);

  // Sync Convex stores to React state and localStorage
  useEffect(() => {
    if (convexStores) {
      setStores(convexStores as any[]);
      localStorage.setItem("120_stores", JSON.stringify(convexStores));
    }
  }, [convexStores]);

  // 배송지 기본정보 프리필 (가맹점 정보 기반)
  useEffect(() => {
    if (deliveryInfoLoaded) return;
    const storeData = (stores || []).find((s: any) => s.id === (activeStoreId || "owner"));
    if (storeData) {
      setDeliveryAddress(storeData.roadAddress || "");
      setDeliveryDetailAddress(storeData.detailAddress || "");
      setRecipientName(storeData.owner || "");
      setRecipientPhone(formatPhoneNumber(storeData.phone || ""));
      setDeliveryInfoLoaded(true);
    }
  }, [stores, activeStoreId, deliveryInfoLoaded]);

  // 점주 정보 변경 입력 필드 동기화
  useEffect(() => {
    const storeData = (stores || []).find((s: any) => s.id === (activeStoreId || "owner"));
    if (storeData) {
      setProfileOwner(storeData.owner || "");
      setProfilePhone(storeData.phone || "");
      setProfileRoadAddress(storeData.roadAddress || "");
      setProfileDetailAddress(storeData.detailAddress || "");
      setProfilePw(storeData.pw || "");
      setProfilePwConfirm(storeData.pwConfirm || "");
    }
  }, [stores, activeStoreId]);

  // Sync Convex notices to React state and localStorage (Fallback to local mock if empty)
  useEffect(() => {
    if (convexNotices !== undefined && convexNotices !== null) {
      const mappedNotices = convexNotices.map((n: any) => ({
        id: n.id,
        _id: n._id,
        tag: n.tag as "필독" | "일반" | "신메뉴" | "물류",
        title: n.title,
        date: n.date,
        views: n.views,
        content: n.content
      }));
      setNotices(mappedNotices);
      localStorage.setItem("120_notices", JSON.stringify(mappedNotices));
    }
  }, [convexNotices]);

  // Sync saved delivery credentials for the current store and notice
  useEffect(() => {
    if (savedCredentials) {
      setBaeminId(savedCredentials.baeminId || "");
      setBaeminPw(savedCredentials.baeminPw || "");
      setCoupangId(savedCredentials.coupangId || "");
      setCoupangPw(savedCredentials.coupangPw || "");
    } else {
      setBaeminId("");
      setBaeminPw("");
      setCoupangId("");
      setCoupangPw("");
    }
  }, [savedCredentials]);

  // Sync Convex materials to React state and localStorage (Fallback to local mock if empty)
  useEffect(() => {
    if (convexMaterials !== undefined && convexMaterials !== null) {
      const trainList = convexMaterials.filter((m: any) => m.type === "training");
      const prList = convexMaterials.filter((m: any) => m.type === "pr");
      
      const mappedTrainings = trainList.map((m: any) => ({
        id: m._id,
        title: m.title,
        date: m.date,
        size: m.size,
        format: m.format,
        desc: m.desc,
        img: m.img,
        fileUrl: m.fileUrl,
        fileName: m.fileName
      }));
      setTrainings(mappedTrainings);
      localStorage.setItem("120_trainings", JSON.stringify(trainList));
      
      const mappedPrs = prList.map((m: any) => ({
        id: m._id,
        title: m.title,
        date: m.date,
        size: m.size,
        format: m.format,
        desc: m.desc,
        img: m.img,
        fileUrl: m.fileUrl,
        fileName: m.fileName
      }));
      setPrs(mappedPrs);
      localStorage.setItem("120_prs", JSON.stringify(prList));
    }
  }, [convexMaterials]);

  // Sync Convex store inquiries to React state and localStorage
  useEffect(() => {
    if (convexStoreInquiries !== undefined && convexStoreInquiries !== null) {
      const mappedInquiries = convexStoreInquiries.map((inq: any) => ({
        id: inq.id,
        category: inq.category,
        title: inq.title,
        date: inq.date,
        status: inq.status as "답변대기" | "답변완료",
        content: inq.content,
        answer: inq.answer
      }));
      setInquiries(mappedInquiries);
      localStorage.setItem("120_inquiries", JSON.stringify(mappedInquiries));
    }
  }, [convexStoreInquiries]);

  // Sync Convex categories
  useEffect(() => {
    if (Array.isArray(convexProductCategories) && convexProductCategories.length > 0) {
      setCategories((prev) => Array.from(new Set([...prev, ...convexProductCategories])));
      try {
        localStorage.setItem("120_categories", JSON.stringify(convexProductCategories));
      } catch (e) {
        console.warn(e);
      }
    }
  }, [convexProductCategories]);

  // Sync Convex products to React state and localStorage (Precedence over mock seed)
  useEffect(() => {
    if (convexProducts !== undefined && convexProducts !== null) {
      if (convexProducts.length > 0) {
        const mapped = convexProducts.map((p: any) => ({
          id: p.id,
          name: p.name,
          category: p.category,
          price: p.discountedPrice !== undefined ? p.discountedPrice : p.price,
          packSize: p.packSize || `${p.unit || '박스'} (${p.qty || 1}개입)`,
          img: p.img,
          detailImg: p.detailImg,
          detailText: p.detailText,
          stock: p.stock || "in_stock",
          desc: p.desc || "",
          orderIndex: p.orderIndex || 99,
          labels: p.labels || [],
          shippingType: p.shippingType || "A",
          options: p.options || [],
          isActive: p.isActive !== false,
          status: p.status || (p.isActive !== false ? (p.stock === "out_of_stock" ? "품절" : "판매중") : "단종")
        }))
        .filter((p: any) => p.status !== "단종" && p.isActive !== false)
        .sort((a: any, b: any) => a.orderIndex - b.orderIndex);

        setProducts(mapped);

        // Extract unique categories from actual active products dynamically
        const uniqueCats = Array.from(new Set(mapped.map((p: any) => p.category).filter(Boolean))) as string[];
        if (uniqueCats.length > 0) {
          setCategories((prev) => Array.from(new Set([...prev, ...uniqueCats])));
        }
        
        try {
          localStorage.setItem("120_products", JSON.stringify(convexProducts));
          if (uniqueCats.length > 0) {
            localStorage.setItem("120_categories", JSON.stringify(uniqueCats));
          }
        } catch (e) {
          console.warn(e);
        }
      } else {
        // If Convex products is empty, fallback to local storage
        const stored = localStorage.getItem("120_products");
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {
              const mapped = parsed.map((p: any) => ({
                id: p.id,
                name: p.name,
                category: p.category,
                price: p.discountedPrice !== undefined ? p.discountedPrice : (p.price || 0),
                packSize: p.packSize || `${p.unit || '박스'} (${p.qty || 1}개입)`,
                img: p.img || "",
                detailImg: p.detailImg || "",
                detailText: p.detailText || "",
                stock: p.stock || "in_stock",
                desc: p.desc || "",
                orderIndex: p.orderIndex || 99,
                labels: p.labels || [],
                shippingType: p.shippingType || "A",
                options: p.options || [],
                isActive: p.isActive !== false,
                status: p.status || (p.isActive !== false ? (p.stock === "out_of_stock" ? "품절" : "판매중") : "단종")
              }))
              .filter((p: any) => p.status !== "단종" && p.isActive !== false)
              .sort((a: any, b: any) => a.orderIndex - b.orderIndex);

              setProducts(mapped);

              const uniqueCats = Array.from(new Set(mapped.map((p: any) => p.category).filter(Boolean))) as string[];
              if (uniqueCats.length > 0) {
                setCategories((prev) => Array.from(new Set([...prev, ...uniqueCats])));
              }
            }
          } catch (e) {}
        }
      }
    }
  }, [convexProducts]);

  // Query actual Korean courier tracking API network in real-time
  useEffect(() => {
    if (!trackingInfo || !trackingModalOpen) {
      setApiTrackingData(null);
      setApiTrackingError(false);
      return;
    }

    const fetchRealTracking = async () => {
      setApiTrackingLoading(true);
      setApiTrackingError(false);
      setApiTrackingData(null);

      const carrierMap: Record<string, string> = {
        "CJ대한통운": "kr.cjlogistics",
        "우체국택배": "kr.epost",
        "한진택배": "kr.hanjin",
        "롯데택배": "kr.lotte",
        "로젠택배": "kr.logen",
      };

      const carrierCode = carrierMap[trackingInfo.courier];
      // If courier is not supported, or it is a simulated mock invoice, trigger fallback immediately
      if (!carrierCode || trackingInfo.trackingNo.startsWith("HNJ-120-") || trackingInfo.trackingNo.includes("TEMP") || trackingInfo.trackingNo.startsWith("kr.")) {
        setApiTrackingLoading(false);
        return; // Fallback to cold chain simulation data
      }

      try {
        const res = await fetch(`https://tracker.delivery/v1/tracks/${carrierCode}/${trackingInfo.trackingNo}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.progresses && data.progresses.length > 0) {
            setApiTrackingData(data);
          } else {
            setApiTrackingError(true);
          }
        } else {
          setApiTrackingError(true);
        }
      } catch (err) {
        console.error("Failed to fetch real-time tracking from courier:", err);
        setApiTrackingError(true);
      } finally {
        setApiTrackingLoading(false);
      }
    };

    fetchRealTracking();
  }, [trackingInfo, trackingModalOpen]);

  // Sync Convex orders to React state and localStorage (Filter by storeId)
  useEffect(() => {
    if (convexOrders !== undefined && convexOrders !== null) {
      const myOrders = convexOrders.filter((o: any) => o.storeId === activeStoreId);
      const mappedOrders = myOrders.map((o: any) => ({
        id: o.id,
        date: o.date,
        _creationTime: o._creationTime,
        items: o.items.map((it: any) => ({
          productName: it.productName,
          quantity: it.quantity,
          price: it.price
        })),
        totalPrice: o.totalPrice,
        status: o.status,
        courier: o.courier,
        trackingNo: o.trackingNo
      }));
      setOrders(mappedOrders);
      localStorage.setItem("120_orders", JSON.stringify(mappedOrders));
    }
  }, [convexOrders, activeStoreId]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    // Dynamic store lookup prioritizing real-time Convex DB data
    const activeStoresList = convexStores || stores || [];

    const isHardcodedOwner = loginId === "owner" && loginPw === "owner";
    const matchedStore = activeStoresList.find(
      (s: any) => s.id === loginId && s.pw === loginPw
    );

    if (isHardcodedOwner) {
      localStorage.setItem("120_owner_logged_in", "true");
      localStorage.setItem("120_active_store_id", "owner");
      setIsLoggedIn(true);
      triggerToast("강남역삼점 파트너님, 환영합니다!");
    } else if (matchedStore) {
      if (matchedStore.status !== "승인") {
        setLoginError(`해당 가맹점은 현재 [${matchedStore.status}] 상태이므로 로그인할 수 없습니다. 본사에 문의하세요.`);
        return;
      }
      localStorage.setItem("120_owner_logged_in", "true");
      localStorage.setItem("120_active_store_id", matchedStore.id);
      setIsLoggedIn(true);
      triggerToast(`${matchedStore.name} 파트너님, 환영합니다!`);
    } else {
      setLoginError("아이디 또는 비밀번호가 잘못되었습니다.");
    }
  };

  const handleLogout = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    localStorage.removeItem("120_owner_logged_in");
    localStorage.removeItem("120_active_store_id");
    setIsLoggedIn(false);
    triggerToast("안전하게 로그아웃되었습니다.");
  };

  // ==========================================
  // CONVEX REAL-TIME POPUP & FLOATING SYNC
  // ==========================================
  useEffect(() => {
    if (convexPopup !== undefined) {
      setPopupSettings(convexPopup);
      try {
        localStorage.setItem("120_popups", JSON.stringify(convexPopup));
      } catch (e) {
        console.warn(e);
      }

      if (convexPopup && convexPopup.isActive) {
        // Query string bypass parameter for testing (?test_popup=true)
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get("test_popup") === "true") {
          setShowPopup(true);
        } else {
          const closedUntil = localStorage.getItem("120_popup_closed_until");
          const isExpired = !closedUntil || Date.now() > parseInt(closedUntil, 10);
          if (isExpired) {
            setShowPopup(true);
          } else {
            setShowPopup(false);
          }
        }
      } else {
        setShowPopup(false);
      }
    }
  }, [convexPopup]);

  useEffect(() => {
    if (convexFloating !== undefined) {
      setFloatingSettings(convexFloating);
      try {
        localStorage.setItem("120_floatings", JSON.stringify(convexFloating));
      } catch (e) {
        console.warn(e);
      }
    }
  }, [convexFloating]);

  // Sync Convex banners to React state
  useEffect(() => {
    if (convexBanners !== undefined) {
      if (convexBanners === null) {
        // Fallback to localStorage if DB has no banners
        const localBnr = localStorage.getItem("120_banners");
        if (localBnr) {
          try {
            setBanner(JSON.parse(localBnr));
          } catch (e) {
            setBanner(null);
          }
        }
      } else {
        setBanner(convexBanners);
        try {
          localStorage.setItem("120_banners", JSON.stringify(convexBanners));
        } catch (e) {
          console.warn(e);
        }
      }
    }
  }, [convexBanners]);

  // ==========================================
  // SYSTEM DATA RESET SYNC
  // ==========================================




  useEffect(() => {
    setSelectedProductOption("");
    setLocalSelectedOptions([]);
    setLocalSingleQty(1);
  }, [selectedProductDetail]);

  // Order page category tab
  const [activeCategory, setActiveCategory] = useState<string>("전체");

  // New 1:1 Inquiry Form states
  const [showInquiryModal, setShowInquiryModal] = useState<boolean>(false);
  const [inquiryCategory, setInquiryCategory] = useState<string>("물류");
  const [inquiryTitle, setInquiryTitle] = useState<string>("");
  const [inquiryContent, setInquiryContent] = useState<string>("");

  // Toast status simulation
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Popup & Floating Action states
  const [popupSettings, setPopupSettings] = useState<any>(null);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [floatingSettings, setFloatingSettings] = useState<any>(null);
  const [floatingOpen, setFloatingOpen] = useState<boolean>(false);

  // Mobile menu control
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [mobileCartOpen, setMobileCartOpen] = useState<boolean>(false);

  // Shipping and Return Policy states
  const [shippingPolicy, setShippingPolicy] = useState<string>("");
  const [returnPolicy, setReturnPolicy] = useState<string>("");
  const [shippingFeeA, setShippingFeeA] = useState<number>(3000);
  const [shippingFeeB, setShippingFeeB] = useState<number>(4000);
  const [shippingFeeC, setShippingFeeC] = useState<number>(5000);
  const [shippingFeeBox, setShippingFeeBox] = useState<number>(6000);

  // 커스텀 알럿/컨펌 모달 상태
  const [customDialog, setCustomDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: "alert" | "confirm";
    onConfirm?: () => void;
    onCancel?: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    type: "alert"
  });

  // Admin back navigation handling (Modals -> close modal; Back button anywhere in admin -> ask Exit/Gate Choice)
  useModalBackHandler("portal-dialog", customDialog.isOpen, () => setCustomDialog(prev => ({ ...prev, isOpen: false })));
  useModalBackHandler("portal-notice-modal", !!selectedNotice, () => setSelectedNotice(null));
  useModalBackHandler("portal-order-modal", !!selectedOrder, () => setSelectedOrder(null));
  useModalBackHandler("portal-product-modal", !!selectedProductDetail, () => setSelectedProductDetail(null));
  useModalBackHandler("portal-cart-modal", mobileCartOpen, () => setMobileCartOpen(false));
  useModalBackHandler("portal-inquiry-modal", showInquiryModal, () => setShowInquiryModal(false));

  const showCustomAlert = (title: string, message: string, onConfirm?: () => void) => {
    setCustomDialog({
      isOpen: true,
      title,
      message,
      type: "alert",
      onConfirm: () => {
        setCustomDialog(prev => ({ ...prev, isOpen: false }));
        if (onConfirm) onConfirm();
      }
    });
  };

  const showCustomConfirm = (title: string, message: string, onConfirm: () => void, onCancel?: () => void) => {
    setCustomDialog({
      isOpen: true,
      title,
      message,
      type: "confirm",
      onConfirm: () => {
        setCustomDialog(prev => ({ ...prev, isOpen: false }));
        onConfirm();
      },
      onCancel: () => {
        setCustomDialog(prev => ({ ...prev, isOpen: false }));
        if (onCancel) onCancel();
      }
    });
  };

  // Mobile popstate / back button handling for modals
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      // 모달이 하나라도 열려있는 상황이라면 닫고 뒤로가기 기본 동작 방지
      if (selectedOrder || selectedProductDetail || trackingModalOpen || showInquiryModal || mobileCartOpen) {
        setSelectedOrder(null);
        setSelectedProductDetail(null);
        setTrackingModalOpen(false);
        setShowInquiryModal(false);
        setMobileCartOpen(false);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [selectedOrder, selectedProductDetail, trackingModalOpen, showInquiryModal, mobileCartOpen]);

  // 각 모달이 열리는 시점에 pushState를 호출해 줍니다!
  useEffect(() => {
    if (selectedOrder || selectedProductDetail || trackingModalOpen || showInquiryModal || mobileCartOpen) {
      window.history.pushState({ modal: true }, "");
    }
  }, [selectedOrder, selectedProductDetail, trackingModalOpen, showInquiryModal, mobileCartOpen]);

  // 모달 닫기 시 가상 history 스택을 동기화하기 위한 헬퍼 함수
  const closeModal = (closeFn: () => void) => {
    closeFn();
    if (typeof window !== "undefined" && window.history.state?.modal) {
      window.history.back();
    }
  };

  // ==========================================
  // MOBILE REDIRECT PAYMENT VERIFICATION
  // ==========================================
  useEffect(() => {
    if (typeof window === "undefined") return;

    const urlParams = new URLSearchParams(window.location.search);
    const paymentId = urlParams.get("paymentId") || urlParams.get("payment_id");
    const code = urlParams.get("code");
    const message = urlParams.get("message");

    if (paymentId) {
      // 1. Check if we have a pending order matching this paymentId
      const pendingOrderId = localStorage.getItem("120_pending_order_id");
      
      if (pendingOrderId && pendingOrderId === paymentId) {
        // Clear pending ID immediately to prevent duplicate runs
        localStorage.removeItem("120_pending_order_id");

        if (code) {
          // Failure case (if code parameter is present in redirect URL)
          showCustomAlert("결제 실패", `결제에 실패하였습니다. 사유: ${message || "알 수 없는 에러"}`);
          // Clear other pending order data
          localStorage.removeItem("120_pending_order_items");
          localStorage.removeItem("120_pending_order_amount");
          localStorage.removeItem("120_pending_order_store_id");
          
          // Remove query params from URL
          const newUrl = window.location.pathname;
          window.history.replaceState({}, document.title, newUrl);
          return;
        }

        // Success case (verify and save)
        const pendingItemsRaw = localStorage.getItem("120_pending_order_items");
        const pendingAmountRaw = localStorage.getItem("120_pending_order_amount");
        const pendingStoreId = localStorage.getItem("120_pending_order_store_id") || "owner";

        if (pendingItemsRaw && pendingAmountRaw) {
          try {
            const pendingItems = JSON.parse(pendingItemsRaw);
            const pendingAmount = Number(pendingAmountRaw);

            // Trigger verification action
            verifyAndSaveOrderAction({
              impUid: paymentId, // V2 uses paymentId as impUid
              merchantUid: paymentId,
              amount: pendingAmount,
              storeId: pendingStoreId,
              items: pendingItems,
              deliveryAddress: localStorage.getItem("120_pending_delivery_address") || undefined,
              deliveryDetailAddress: localStorage.getItem("120_pending_delivery_detail") || undefined,
              recipientName: localStorage.getItem("120_pending_recipient_name") || undefined,
              recipientPhone: localStorage.getItem("120_pending_recipient_phone") || undefined,
            })
              .then((result: any) => {
                if (result.success) {
                  const newOrder: Order = {
                    id: paymentId,
                    date: getFormattedCurrentDateTime(),
                    items: pendingItems,
                    totalPrice: pendingAmount,
                    status: "결제완료",
                    courier: "",
                    trackingNo: "",
                  };

                  // Retrieve existing orders from localStorage
                  let existingOrders: Order[] = [];
                  const storedOrders = localStorage.getItem("120_orders");
                  if (storedOrders) {
                    try {
                      existingOrders = JSON.parse(storedOrders);
                    } catch (e) {
                      console.error("Failed to parse stored orders:", e);
                    }
                  }

                  const updatedOrders = [newOrder, ...existingOrders];
                  setOrders(updatedOrders);
                  localStorage.setItem("120_orders", JSON.stringify(updatedOrders));

                  // Clear cart and triggers
                  clearCart();
                  triggerToast("발주 주문 및 결제가 완료되었습니다!");

                  // SMS 발송 연동 (모바일 리디렉션 결제완료)
                  const targetRecipientPhone = localStorage.getItem("120_pending_recipient_phone") || recipientPhone || "";
                  const activeStore = (stores || []).find((s: any) => s.id === pendingStoreId);
                  const storeName = activeStore?.name || "가맹점";
                  triggerSmsSend("order_card", {
                    storeName: storeName,
                    orderId: paymentId,
                    amount: pendingAmount.toLocaleString(),
                    phone: targetRecipientPhone || activeStore?.phone || "",
                  });

                  setCurrentMenu("history");
                } else {
                  showCustomAlert("결제 검증 오류", `결제 검증 실패: ${result.message}`);
                }
              })
              .catch((err) => {
                console.error("결제 검증 중 오류 발생:", err);
                showCustomAlert("주문 등록 오류", "결제는 승인되었으나 주문 등록 중 오류가 발생했습니다. 고객센터에 문의바랍니다.");
              })
              .finally(() => {
                // Clear remaining pending order data
                localStorage.removeItem("120_pending_order_items");
                localStorage.removeItem("120_pending_order_amount");
                localStorage.removeItem("120_pending_order_store_id");
                localStorage.removeItem("120_pending_delivery_address");
                localStorage.removeItem("120_pending_delivery_detail");
                localStorage.removeItem("120_pending_recipient_name");
                localStorage.removeItem("120_pending_recipient_phone");
                
                // Clean URL query parameters
                const newUrl = window.location.pathname;
                window.history.replaceState({}, document.title, newUrl);
              });
          } catch (e) {
            console.error("Failed to process pending order data:", e);
          }
        }
      } else {
        // If there's no matching pending order ID, just clean URL
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
      }
    }
  }, []);

  // ==========================================
  // INITIALIZATION WITH LOCAL STORAGE
  // ==========================================
  useEffect(() => {
    if (typeof window !== "undefined") {
      const loadState = (key: string, initialData: any) => {
        const stored = localStorage.getItem(key);
        if (stored) {
          try {
            return JSON.parse(stored);
          } catch (err) {
            console.error(`Failed to parse key ${key}:`, err);
            return initialData;
          }
        }
        try {
          localStorage.setItem(key, JSON.stringify(initialData));
        } catch (e) {
          console.warn(e);
        }
        return initialData;
      };

      setCart(loadState("120_cart", []));
      setInquiries(loadState("120_inquiries", INITIAL_INQUIRIES));
      setNotices(loadState("120_notices", []));
      setTrainings(loadState("120_trainings", []));
      setPrs(loadState("120_prs", []));

      // Seeds
      setStores(loadState("120_stores", []));
      setCategories(loadState("120_categories", []));
      setBanner(loadState("120_banners", null));
      setActiveStoreId(localStorage.getItem("120_active_store_id") || "owner");
      const storedColors = loadState("120_status_colors", DEFAULT_STATUS_COLORS);
      setStatusColors(storedColors);

      let pr = loadState("120_products", []);
      // Filter out legacy mock seed products (prod-1 to prod-6) to ensure they are completely deleted
      pr = pr.filter((p: any) => p && !["prod-1", "prod-2", "prod-3", "prod-4", "prod-5", "prod-6"].includes(p.id));

      // [Migration] Automatic migration from LocalStorage to Convex Cloud DB in portal page
      if (convexProducts !== undefined && convexProducts.length === 0) {
        const storedPrRaw = localStorage.getItem("120_products");
        if (storedPrRaw) {
          try {
            const parsedPr = JSON.parse(storedPrRaw);
            const filteredMigration = parsedPr.filter((p: any) => p && !["prod-1", "prod-2", "prod-3", "prod-4", "prod-5", "prod-6"].includes(p.id));
            if (filteredMigration && filteredMigration.length > 0) {
              console.log("[Migration] Moving local products to Convex cloud DB from portal...");
              syncProductsMutation({ products: filteredMigration }).then(() => {
                console.log("[Migration] Products migration completed in portal!");
              });
            }
          } catch (e) {
            console.error("[Migration] Failed to migrate products in portal:", e);
          }
        }
      }

      if (convexOrders !== undefined && convexOrders.length === 0) {
        const storedOrdRaw = localStorage.getItem("120_orders");
        if (storedOrdRaw) {
          try {
            const parsedOrd = JSON.parse(storedOrdRaw);
            if (parsedOrd && parsedOrd.length > 0) {
              console.log("[Migration] Moving local orders to Convex cloud DB from portal...");
              syncOrdersMutation({ orders: parsedOrd }).then(() => {
                console.log("[Migration] Orders migration completed in portal!");
              });
            }
          } catch (e) {
            console.error("[Migration] Failed to migrate orders in portal:", e);
          }
        }
      }

      const mapped = pr.map((p: any) => ({
        id: p.id || `prod-${Math.floor(100 + Math.random() * 900)}`,
        name: p.name || "이름 없는 상품",
        category: p.category || "냉동생지/자재",
        price: p.discountedPrice !== undefined ? p.discountedPrice : (p.price || 0),
        packSize: p.packSize || `${p.unit || '박스'} (${p.qty || 1}개입)`,
        img: p.img || "",
        detailImg: p.detailImg || "",
        detailText: p.detailText || "",
        stock: p.stock || "in_stock",
        desc: p.desc || "",
        orderIndex: p.orderIndex || 99,
        labels: p.labels || [],
        shippingType: p.shippingType || "A",
        options: p.options || []
      })).sort((a: any, b: any) => a.orderIndex - b.orderIndex);
      
      setProducts(mapped);
      localStorage.setItem("120_products", JSON.stringify(pr));

      const policySettings = loadState("120_shipping_settings", {
        shippingPolicy: "본사 물류 전용 저온 냉동 탑차로 안전하게 직배송됩니다.",
        returnPolicy: "식재료 특성상 단순 변심으로 인한 반품은 불가하며, 오배송 건은 수령 즉시 본사 접수 바랍니다.",
        shippingFeeA: "3,000",
        shippingFeeB: "4,000",
        shippingFeeC: "5,000",
        shippingFeeBox: "6,000"
      });
      setShippingPolicy(policySettings.shippingPolicy);
      setReturnPolicy(policySettings.returnPolicy);
      setShippingFeeA(parseInt((policySettings.shippingFeeA || "3,000").replace(/,/g, "")) || 3000);
      setShippingFeeB(parseInt((policySettings.shippingFeeB || "4,000").replace(/,/g, "")) || 4000);
      setShippingFeeC(parseInt((policySettings.shippingFeeC || "5,000").replace(/,/g, "")) || 5000);
      setShippingFeeBox(parseInt((policySettings.shippingFeeBox || "6,000").replace(/,/g, "")) || 6000);
    }
  }, []);

  // Persist cart to LocalStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("120_cart", JSON.stringify(cart));
    }
  }, [cart]);

  // Poll LocalStorage to simulate real-time updates when switching tabs or active
  useEffect(() => {
    const handleStorageChange = () => {
      if (typeof window !== "undefined") {
        const parseSafely = (key: string, fallback: any) => {
          const val = localStorage.getItem(key);
          if (!val) return fallback;
          try {
            return JSON.parse(val);
          } catch (e) {
            console.warn(`[LocalStorage] Failed to parse key "${key}":`, e);
            return fallback;
          }
        };

        setInquiries(parseSafely("120_inquiries", INITIAL_INQUIRIES));
        setNotices(parseSafely("120_notices", INITIAL_NOTICES));
        setTrainings(parseSafely("120_trainings", INITIAL_TRAINING));
        setPrs(parseSafely("120_prs", INITIAL_PR));

        setStores(parseSafely("120_stores", []));
        const storedCats = parseSafely("120_categories", []);
        if (storedCats && storedCats.length > 0) {
          setCategories((prev) => Array.from(new Set([...prev, ...storedCats])));
        }

        const storedPrRaw = localStorage.getItem("120_products");
        if (storedPrRaw) {
          try {
            const parsed = JSON.parse(storedPrRaw);
            if (Array.isArray(parsed) && parsed.length > 0) {
              const mapped = parsed.map((p: any) => ({
                id: p.id,
                name: p.name,
                category: p.category,
                price: p.discountedPrice !== undefined ? p.discountedPrice : (p.price || 0),
                packSize: p.packSize || `${p.unit || '박스'} (${p.qty || 1}개입)`,
                img: p.img || "",
                detailImg: p.detailImg || "",
                detailText: p.detailText || "",
                stock: p.stock || "in_stock",
                desc: p.desc || "",
                orderIndex: p.orderIndex || 99,
                labels: p.labels || [],
                shippingType: p.shippingType || "A",
                options: p.options || [],
                isActive: p.isActive !== false,
                status: p.status || (p.isActive !== false ? (p.stock === "out_of_stock" ? "품절" : "판매중") : "단종")
              }))
              .filter((p: any) => p.status !== "단종" && p.isActive !== false)
              .sort((a: any, b: any) => a.orderIndex - b.orderIndex);

              setProducts(mapped);
            }
          } catch (e) {}
        }
        
        const bnr = localStorage.getItem("120_banners");
        if (bnr) {
          try {
            setBanner(JSON.parse(bnr));
          } catch (e) {
            console.warn(e);
          }
        }
        
        const activeId = localStorage.getItem("120_active_store_id") || "owner";
        setActiveStoreId(activeId);

        const ps = localStorage.getItem("120_shipping_settings");
        if (ps) {
          try {
            const parsed = JSON.parse(ps);
            setShippingPolicy(parsed.shippingPolicy || "");
            setReturnPolicy(parsed.returnPolicy || "");
            setShippingFeeA(parseInt((parsed.shippingFeeA || "3,000").toString().replace(/,/g, "")) || 3000);
            setShippingFeeB(parseInt((parsed.shippingFeeB || "4,000").toString().replace(/,/g, "")) || 4000);
            setShippingFeeC(parseInt((parsed.shippingFeeC || "5,000").toString().replace(/,/g, "")) || 5000);
            setShippingFeeBox(parseInt((parsed.shippingFeeBox || "6,000").toString().replace(/,/g, "")) || 6000);
          } catch (e) {
            console.error(e);
          }
        }
      }
    };

    window.addEventListener("focus", handleStorageChange);
    const interval = setInterval(handleStorageChange, 1500);

    return () => {
      window.removeEventListener("focus", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // ==========================================
  // TOAST TRIGGER
  // ==========================================
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 클립보드 복사 헬퍼 함수
  const handleCopyToClipboard = (text: string, label: string) => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        triggerToast(`${label} 복사되었습니다!`);
      }).catch(err => {
        console.error("복사 실패:", err);
      });
    }
  };

  // Unified Aligo SMS sending function supporting customer/admin separation
  const triggerSmsSend = async (category: string, variables: Record<string, string>) => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("120_sms_settings");
    if (!stored) return;
    
    try {
      const smsSettings = JSON.parse(stored);
      const eventConfig = smsSettings[category];
      if (!eventConfig) {
        console.log(`[SMS Send Skip] Category '${category}' not found.`);
        return;
      }

      // Check if Aligo settings exist
      const hasAligoCreds = smsSettings.aligoKey && smsSettings.aligoUserId;

      // 1. 고객용 발송 (Customer-facing)
      if (eventConfig.customer && eventConfig.customer.isActive) {
        let customerPhone = variables.phone || recipientPhone || profilePhone || "";
        if (!customerPhone) {
          const activeStore = (stores || []).find((s: any) => s.id === (activeStoreId || "owner"));
          customerPhone = activeStore?.phone || "";
        }
        
        let msg = eventConfig.customer.template;
        Object.entries(variables).forEach(([key, val]) => {
          msg = msg.replace(new RegExp(`{${key}}`, "g"), val);
        });

        const formattedSender = eventConfig.customer.sender.replace(/[^0-9]/g, "");
        const formattedReceiver = customerPhone.replace(/[^0-9]/g, "");

        if (!formattedReceiver || formattedReceiver.length < 8) {
          console.warn(`[SMS Skip] 신청자(고객) 연락처가 누락되었거나 유효하지 않습니다: ${customerPhone}`);
        } else {
          console.log(`[SMS Customer Trigger] Category: ${category} | From: ${eventConfig.customer.sender} | To: ${customerPhone}`);
          console.log(`[SMS Customer Content]:\n${msg}`);

          if (hasAligoCreds) {
            const response = await sendSmsAction({
              key: smsSettings.aligoKey,
              userId: smsSettings.aligoUserId,
              sender: formattedSender,
              receiver: formattedReceiver,
              msg: msg,
              isTest: smsSettings.aligoTestMode !== false
            });
            console.log("[Aligo Customer Response]:", response);
            if (response.success) {
              triggerToast("신청자(점주) 주문 알림 SMS 발송 완료");
            } else {
              console.error("[Aligo Customer API Failure]:", response.error || response.message);
            }
          } else {
            // Simulation fallback
            alert(`[고객용 SMS 발송 - 시뮬레이션]\n\n보낸사람: ${eventConfig.customer.sender}\n받는사람(고객): ${customerPhone}\n\n내용:\n${msg}`);
          }
        }
      }

      // 2. 관리자용 발송 (Admin-facing)
      if (eventConfig.admin && eventConfig.admin.isActive) {
        const adminReceivers = eventConfig.admin.receivers || [];
        if (adminReceivers.length > 0) {
          let msg = eventConfig.admin.template;
          Object.entries(variables).forEach(([key, val]) => {
            msg = msg.replace(new RegExp(`{${key}}`, "g"), val);
          });

          const formattedSender = eventConfig.admin.sender.replace(/[^0-9]/g, "");
          const formattedReceiver = adminReceivers.map((num: string) => num.replace(/[^0-9]/g, "")).join(",");

          console.log(`[SMS Admin Trigger] Category: ${category} | From: ${eventConfig.admin.sender} | To: ${adminReceivers.join(", ")}`);
          console.log(`[SMS Admin Content]:\n${msg}`);

          if (hasAligoCreds) {
            const response = await sendSmsAction({
              key: smsSettings.aligoKey,
              userId: smsSettings.aligoUserId,
              sender: formattedSender,
              receiver: formattedReceiver,
              msg: msg,
              isTest: smsSettings.aligoTestMode !== false
            });
            console.log("[Aligo Admin Response]:", response);
            if (response.success) {
              triggerToast("관리자용 SMS 발송 완료");
            } else {
              console.error("[Aligo Admin API Failure]:", response.error || response.message);
            }
          } else {
            // Simulation fallback
            alert(`[관리자용 SMS 발송 - 시뮬레이션]\n\n보낸사람: ${eventConfig.admin.sender}\n받는사람(관리자): ${adminReceivers.join(", ")}\n\n내용:\n${msg}`);
          }
        }
      }
    } catch (e) {
      console.error("SMS 전송 로직 에러:", e);
    }
  };

  // Format phone number to automatically include hyphens: 010-XXXX-XXXX
  const handleRegPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9]/g, ""); // Remove non-digits
    if (value.length > 3 && value.length <= 7) {
      value = `${value.slice(0, 3)}-${value.slice(3)}`;
    } else if (value.length > 7) {
      value = `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7, 11)}`;
    }
    setRegPhone(value);
  };

  // Real Road Address Search using Daum/Kakao Postcode API (Iframe Embedded Layer Style)
  const openDaumPostcode = (target: "register" | "profile" | "delivery") => {
    setAddressSearchTarget(target);
    addressSearchTargetRef.current = target;
    setShowAddressPopup(true);
    setAddressTab("kakao");
    setAddressSearchKeyword("");
  };

  // Embed Daum Postcode whenever the popup is open and tab is "kakao"
  useEffect(() => {
    if (!showAddressPopup || addressTab !== "kakao" || typeof window === "undefined") return;

    const scriptId = "daum-postcode-script";
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    let attempts = 0;

    const embedPostcode = () => {
      const container = document.getElementById("daum-postcode-container");
      const daumNamespace = (window as any).daum;
      
      if (daumNamespace && daumNamespace.Postcode && container) {
        new daumNamespace.Postcode({
          oncomplete: (data: any) => {
            let fullRoadAddr = data.roadAddress;
            let extraRoadAddr = '';

            if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
              extraRoadAddr += data.bname;
            }
            if (data.buildingName !== '') {
              extraRoadAddr += (extraRoadAddr !== '' ? ', ' + data.buildingName : data.buildingName);
            }
            if (extraRoadAddr !== '') {
              extraRoadAddr = ' (' + extraRoadAddr + ')';
            }

            const finalAddress = fullRoadAddr + extraRoadAddr;
            if (addressSearchTargetRef.current === "profile") {
              setProfileRoadAddress(finalAddress);
            } else if (addressSearchTargetRef.current === "delivery") {
              setDeliveryAddress(finalAddress);
            } else {
              setRegRoadAddress(finalAddress);
            }
            
            setShowAddressPopup(false);
            triggerToast("도로명 주소가 자동 입력되었습니다.");
          },
          width: "100%",
          height: "100%"
        }).embed(container);
      } else {
        if (attempts < 40) {
          attempts++;
          setTimeout(embedPostcode, 100);
        } else {
          console.error("[Kakao API] Failed to load Kakao Postcode library safely.");
          triggerToast("주소 검색 라이브러리를 로드하는 데 실패했습니다.");
        }
      }
    };

    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
      script.async = true;
      script.onload = () => {
        embedPostcode();
      };
      document.head.appendChild(script);
    } else {
      embedPostcode();
    }
  }, [showAddressPopup, addressTab]);

  // Simulated Road Address Search
  const handleRegAddressSearch = (keyword: string) => {
    setAddressSearchKeyword(keyword);
    if (!keyword.trim()) {
      setAddressSearchResults([]);
      return;
    }
    const mockDb = [
      "서울 강남구 테헤란로 123 (역삼동, 강남빌딩)",
      "서울 강남구 테헤란로 152 (역삼동, 강남파이낸스센터)",
      "서울 강남구 역삼로 101 (역삼동)",
      "경기 군포시 엘에스로 143 (금정동, 1층 1001호)",
      "서울 마포구 양화로 160 (동교동, 홍대입구역)",
      "부산 부산진구 중앙대로 730 (부전동, 서면역)"
    ];
    const filtered = mockDb.filter(addr => addr.toLowerCase().includes(keyword.toLowerCase()));
    setAddressSearchResults(filtered);
  };

  const handleUpdateProfile = async () => {
    if (!profileOwner.trim()) {
      showCustomAlert("입력 확인", "점주명(대표자)을 입력해 주세요.");
      return;
    }
    if (!profilePhone.trim()) {
      showCustomAlert("입력 확인", "연락처를 입력해 주세요.");
      return;
    }
    if (!profileRoadAddress.trim()) {
      showCustomAlert("입력 확인", "매장 주소(도로명 주소)를 입력해 주세요.");
      return;
    }
    if (profilePw !== profilePwConfirm) {
      showCustomAlert("비밀번호 불일치", "비밀번호와 비밀번호 확인이 서로 일치하지 않습니다.");
      return;
    }

    setIsUpdatingProfile(true);
    try {
      const response = await createStoreMutation({
        id: activeStore.id,
        pw: profilePw || activeStore.pw || "owner",
        pwConfirm: profilePwConfirm || activeStore.pwConfirm || "owner",
        name: activeStore.name,
        owner: profileOwner,
        phone: profilePhone,
        status: activeStore.status,
        roadAddress: profileRoadAddress,
        detailAddress: profileDetailAddress,
        regDate: activeStore.regDate || new Date().toISOString().split("T")[0],
        cancelDate: activeStore.cancelDate || "",
        adoptionMenu: activeStore.adoptionMenu || [],
        monthlySales: activeStore.monthlySales || 0,
      });

      if (response.success) {
        triggerToast("점주 정보가 성공적으로 변경되었습니다.");
        setProfilePw("");
        setProfilePwConfirm("");
      } else {
        showCustomAlert("정보 변경 실패", "정보 변경에 실패했습니다. 다시 시도해 주세요.");
      }
    } catch (e: any) {
      console.error(e);
      showCustomAlert("오류 발생", `서버 통신 오류가 발생했습니다: ${e.message || e}`);
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleRegisterStoreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regId || !regPw || !regPwConfirm || !regName || !regOwner || !regPhone || !regRoadAddress) {
      showCustomAlert("입력 확인", "필수 항목(*)을 모두 입력해 주세요.");
      return;
    }
    if (regPw !== regPwConfirm) {
      showCustomAlert("비밀번호 불일치", "비밀번호와 비밀번호 확인이 서로 일치하지 않습니다.");
      return;
    }

    createStoreMutation({
      id: regId,
      pw: regPw,
      pwConfirm: regPwConfirm,
      name: regName,
      owner: regOwner,
      phone: regPhone,
      status: "대기",
      roadAddress: regRoadAddress,
      detailAddress: regDetailAddress,
      regDate: regDate,
      cancelDate: "",
      adoptionMenu: regAdoptionMenu,
      monthlySales: 0,
    })
      .then((res: any) => {
        if (res.success) {
          showCustomAlert(
            "등록 신청 완료",
            "가맹점 신규 등록 신청이 성공적으로 접수되었습니다. 본사 관리자의 승인 처리 완료 후 로그인이 가능합니다."
          );

          // SMS 발송 연동 (가맹점 등록 신청)
          triggerSmsSend("store_reg", {
            storeId: regId,
            storeName: regName,
            owner: regOwner,
            phone: regPhone
          });

          setRegId("");
          setRegPw("");
          setRegPwConfirm("");
          setRegName("");
          setRegOwner("");
          setRegPhone("");
          setRegRoadAddress("");
          setRegDetailAddress("");
          setRegAdoptionMenu([]);
          setRegDate(new Date().toISOString().split("T")[0]);
          setShowRegisterModal(false);
        } else {
          showCustomAlert("등록 실패", res.error || "가맹점 등록 중 오류가 발생했습니다.");
        }
      })
      .catch((err) => {
        console.error("가맹점 등록 오류:", err);
        showCustomAlert("서버 오류", "서버 통신 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
      });
  };

  // ==========================================
  // CART ACTIONS
  // ==========================================
  const addToCart = (productId: string, selectedOption?: string, quantity: number = 1) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.productId === productId && item.selectedOption === selectedOption
      );
      if (existing) {
        triggerToast(`장바구니 품목 수량을 ${quantity}개 추가했습니다.`);
        return prev.map((item) =>
          item.productId === productId && item.selectedOption === selectedOption
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      triggerToast("상품을 장바구니에 담았습니다.");
      return [...prev, { productId, selectedOption, quantity }];
    });
  };

  const updateCartQty = (productId: string, selectedOption: string | undefined, qty: number) => {
    if (qty <= 0) {
      setCart((prev) =>
        prev.filter((item) => !(item.productId === productId && item.selectedOption === selectedOption))
      );
      triggerToast("품목을 장바구니에서 삭제했습니다.");
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId && item.selectedOption === selectedOption
          ? { ...item, quantity: qty }
          : item
      )
    );
  };

  const removeCartItem = (productId: string, selectedOption?: string) => {
    setCart((prev) =>
      prev.filter((item) => !(item.productId === productId && item.selectedOption === selectedOption))
    );
    triggerToast("품목을 장바구니에서 삭제했습니다.");
  };

  const clearCart = () => {
    setCart([]);
  };

  // Cart math
  const cartSubtotal = cart.reduce((acc, item) => {
    const p = (products || []).find((prod) => prod.id === item.productId);
    return acc + (p ? p.price * item.quantity : 0);
  }, 0);

  // Get dynamic shipping fee based on selected type: A, B, C (Choose maximum) + BOX (combined quantity based)
  const getAppliedShippingFee = () => {
    if (cart.length === 0) return 0;
    
    let maxStandardFee = 0;
    let totalBoxQty = 0;
    
    cart.forEach((item) => {
      const p = (products || []).find((prod) => prod.id === item.productId);
      const type = p?.shippingType || "A";
      
      if (type === "BOX") {
        totalBoxQty += item.quantity;
      } else {
        let fee = 0;
        if (type === "A") fee = shippingFeeA;
        else if (type === "B") fee = shippingFeeB;
        else if (type === "C") fee = shippingFeeC;
        else if (type === "free") fee = 0;
        
        if (fee > maxStandardFee) {
          maxStandardFee = fee;
        }
      }
    });
    
    const boxFee = totalBoxQty > 0 ? (Math.floor(totalBoxQty / 10) + 1) * shippingFeeBox : 0;
    
    return maxStandardFee + boxFee;
  };

  const getAppliedShippingType = () => {
    if (cart.length === 0) return "무료배송";
    
    let maxStandardFee = -1;
    let maxStandardType = "";
    let hasBox = false;
    
    cart.forEach((item) => {
      const p = (products || []).find((prod) => prod.id === item.productId);
      const type = p?.shippingType || "A";
      
      if (type === "BOX") {
        hasBox = true;
      } else {
        let fee = 0;
        if (type === "A") fee = shippingFeeA;
        else if (type === "B") fee = shippingFeeB;
        else if (type === "C") fee = shippingFeeC;
        else if (type === "free") fee = 0;
        
        if (fee > maxStandardFee) {
          maxStandardFee = fee;
          maxStandardType = type;
        }
      }
    });
    
    if (hasBox) {
      if (maxStandardType && maxStandardType !== "free") {
        return `BOX+${maxStandardType}타입`;
      }
      return "BOX타입";
    }
    
    if (maxStandardType === "free" || !maxStandardType) return "무료배송";
    return `${maxStandardType}타입`;
  };

  const shippingFee = getAppliedShippingFee();
  const shippingTypeLabel = getAppliedShippingType();
  const cartTotal = cartSubtotal + shippingFee;

  const groupedCartItems = (() => {
    const groups: Record<string, { items: typeof cart; title: string; feeLabel: string }> = {
      BOX: { items: [], title: "BOX타입 배송 품목", feeLabel: "" },
      A: { items: [], title: "A타입 배송 품목", feeLabel: "" },
      B: { items: [], title: "B타입 배송 품목", feeLabel: "" },
      C: { items: [], title: "C타입 배송 품목", feeLabel: "" },
      free: { items: [], title: "무료 배송 품목", feeLabel: "무료" }
    };
    
    cart.forEach((item) => {
      const p = (products || []).find((prod) => prod.id === item.productId);
      const type = p?.shippingType || "A";
      if (groups[type]) {
        groups[type].items.push(item);
      } else {
        groups["A"].items.push(item);
      }
    });

    const boxQty = groups["BOX"].items.reduce((sum, item) => sum + item.quantity, 0);
    const calculatedBoxFee = boxQty > 0 ? (Math.floor(boxQty / 10) + 1) * shippingFeeBox : 0;
    groups["BOX"].feeLabel = boxQty > 0 ? `${calculatedBoxFee.toLocaleString()}원` : "";

    let maxStandardType = "";
    let maxStandardFee = -1;
    ["A", "B", "C"].forEach((type) => {
      if (groups[type].items.length > 0) {
        let fee = 0;
        if (type === "A") fee = shippingFeeA;
        else if (type === "B") fee = shippingFeeB;
        else if (type === "C") fee = shippingFeeC;
        
        if (fee > maxStandardFee) {
          maxStandardFee = fee;
          maxStandardType = type;
        }
      }
    });
    
    ["A", "B", "C"].forEach((type) => {
      if (groups[type].items.length > 0) {
        let baseFee = 0;
        if (type === "A") baseFee = shippingFeeA;
        else if (type === "B") baseFee = shippingFeeB;
        else if (type === "C") baseFee = shippingFeeC;

        if (type === maxStandardType) {
          groups[type].feeLabel = `${baseFee.toLocaleString()}원`;
        } else {
          groups[type].feeLabel = `0원 (상위 배송비 적용)`;
        }
      }
    });

    return Object.entries(groups).filter(([key, group]) => group.items.length > 0);
  })();

  // ==========================================
  // PLACE ORDER
  // ==========================================
  const placeOrder = () => {
    if (cart.length === 0) return;

    const newOrderItems = cart.map((item) => {
      const p = (products || []).find((prod) => prod.id === item.productId);
      return {
        productName: p 
          ? (item.selectedOption ? `${p.name} [옵션: ${item.selectedOption}]` : p.name) 
          : "미지 상품",
        quantity: item.quantity,
        price: p ? p.price : 0,
        selectedOption: item.selectedOption,
      };
    });

    const newOrderId = `ORD${new Date().getFullYear()}${String(
      new Date().getMonth() + 1
    ).padStart(2, "0")}${String(new Date().getDate()).padStart(2, "0")}${String(
      Math.floor(100 + Math.random() * 900)
    )}`;

    if (orderPayMethod === "bank") {
      showCustomConfirm("발주 신청", "무통장입금으로 발주를 신청하시겠습니까?", () => {
        saveOrderMutation({
          id: newOrderId,
          date: getFormattedCurrentDateTime(),
          items: newOrderItems,
          totalPrice: cartTotal,
          status: "입금대기",
          storeId: activeStoreId || "owner",
          payMethod: "bank",
          deliveryAddress: deliveryAddress || undefined,
          deliveryDetailAddress: deliveryDetailAddress || undefined,
          recipientName: recipientName || undefined,
          recipientPhone: recipientPhone || undefined,
        })
          .then(() => {
            const newOrder: Order = {
              id: newOrderId,
              date: getFormattedCurrentDateTime(),
              items: newOrderItems,
              totalPrice: cartTotal,
              status: "입금대기",
              courier: "",
              trackingNo: "",
            };

            const updatedOrders = [newOrder, ...orders];
            setOrders(updatedOrders);
            localStorage.setItem("120_orders", JSON.stringify(updatedOrders));

            clearCart();
            showCustomAlert(
              "발주 신청 완료", 
              `무통장입금 발주 신청이 완료되었습니다.\n\n[입금 계좌]\nK뱅크 700-120-270001\n예금주: (주)고우웰라이프\n입금액: ${cartTotal.toLocaleString()}원\n\n입금 확인 후 배송이 시작됩니다.`
            );

            // SMS 발송 연동 (주문완료 - 무통장입금)
            const activeStore = (stores || []).find((s: any) => s.id === (activeStoreId || "owner"));
            const storeName = activeStore?.name || "가맹점";
            const targetPhone = recipientPhone || profilePhone || activeStore?.phone || "";
            triggerSmsSend("order_cash", {
              storeName: storeName,
              orderId: newOrderId,
              amount: cartTotal.toLocaleString(),
              phone: targetPhone
            });

            setCurrentMenu("history");
          })
          .catch((err) => {
            console.error("무통장 주문 등록 오류:", err);
            showCustomAlert("주문 등록 오류", "주문 등록 중 오류가 발생했습니다. 고객센터에 문의바랍니다.");
          });
      });
      return;
    }

    const PortOne = (window as any).PortOne;
    if (!PortOne) {
      showCustomAlert("결제 오류", "결제 모듈을 로드하는 중입니다. 잠시 후 다시 시도해 주세요.");
      return;
    }

    showCustomConfirm("발주 신청", "선택한 자재의 결제 및 발주를 신청하시겠습니까?", () => {
      const firstItemName = (products || []).find((prod) => prod.id === cart[0].productId)?.name || "자재 주문";
      
      const storeId = process.env.NEXT_PUBLIC_PORTONE_STORE_ID || "store-1ba40e9a-5edf-4497-b8dc-ae82194fcf42";
      // KG이니시스 채널 키 로드 (포트원 V2 연동용 채널 키)
      const channelKey = process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY;

      if (!channelKey) {
        showCustomAlert("결제 설정 오류", "KG이니시스 결제 채널 키(NEXT_PUBLIC_PORTONE_CHANNEL_KEY) 환경변수가 누락되었습니다. 포트원 콘솔에서 발급받은 채널 키를 환경변수에 등록해 주세요.");
        return;
      }

      // 토스페이먼츠(UPLUS) 특수문자 제한 방지를 위해 상품명 정제
      const sanitizedOrderTitle = cart.length > 1 ? `${firstItemName} 외 ${cart.length - 1}건` : firstItemName;

      const activeStore = (stores || []).find((s: any) => s.id === (activeStoreId || "owner"));

      // Save pending order details to LocalStorage for mobile redirection support
      localStorage.setItem("120_pending_order_id", newOrderId);
      localStorage.setItem("120_pending_order_items", JSON.stringify(newOrderItems));
      localStorage.setItem("120_pending_order_amount", String(cartTotal));
      localStorage.setItem("120_pending_order_store_id", activeStoreId || "owner");
      localStorage.setItem("120_pending_delivery_address", deliveryAddress);
      localStorage.setItem("120_pending_delivery_detail", deliveryDetailAddress);
      localStorage.setItem("120_pending_recipient_name", recipientName);
      localStorage.setItem("120_pending_recipient_phone", recipientPhone || activeStore?.phone || "");
      // 1. 사전 주문 DB 등록 (결제대기 상태로 미리 저장하여 결제 중 브라우저가 닫혀도 웹훅에서 수신 및 완결 가능하도록 원천 보장)
      saveOrderMutation({
        id: newOrderId,
        date: getFormattedCurrentDateTime(),
        items: newOrderItems,
        totalPrice: cartTotal,
        status: "결제대기",
        storeId: activeStoreId || "owner",
        payMethod: "card",
        deliveryAddress: deliveryAddress || undefined,
        deliveryDetailAddress: deliveryDetailAddress || undefined,
        recipientName: recipientName || undefined,
        recipientPhone: recipientPhone || undefined,
      }).catch((e) => console.error("사전 주문 등록 오류:", e));

      PortOne.requestPayment({
        storeId: storeId,
        channelKey: channelKey,
        paymentId: newOrderId,
        orderName: sanitizedOrderTitle.replace(/[\[\]]/g, ""), // 특수문자 대괄호 제거
        totalAmount: cartTotal,
        currency: "KRW",
        payMethod: "CARD",
        redirectUrl: `${window.location.origin}/portal`,
        customer: {
          fullName: activeStore?.owner || "가맹점주",
          phoneNumber: activeStore?.phone || "010-0000-0000",
          email: "120piecoffee@gmail.com", // KG이니시스 필수 입력값 설정
        },
      }).then((response: any) => {
        if (response.code === undefined) {
          // 결제 성공 시 (code 필드가 없는 경우 성공)
          verifyAndSaveOrderAction({
            impUid: response.paymentId,
            merchantUid: newOrderId,
            amount: cartTotal,
            storeId: activeStoreId || "owner",
            items: newOrderItems,
            deliveryAddress: deliveryAddress || undefined,
            deliveryDetailAddress: deliveryDetailAddress || undefined,
            recipientName: recipientName || undefined,
            recipientPhone: recipientPhone || undefined,
          })
            .then((result: any) => {
              if (result.success) {
                const newOrder: Order = {
                  id: newOrderId,
                  date: getFormattedCurrentDateTime(),
                  items: newOrderItems,
                  totalPrice: cartTotal,
                  status: "결제완료",
                  courier: "",
                  trackingNo: "",
                };

                const updatedOrders = [newOrder, ...orders];
                setOrders(updatedOrders);
                localStorage.setItem("120_orders", JSON.stringify(updatedOrders));

                clearCart();
                triggerToast("발주 주문 및 결제가 완료되었습니다!");

                // SMS 발송 연동 (주문완료 - 신용카드)
                const activeStore = (stores || []).find((s: any) => s.id === (activeStoreId || "owner"));
                const storeName = activeStore?.name || "가맹점";
                const targetPhone = recipientPhone || profilePhone || activeStore?.phone || "";
                triggerSmsSend("order_card", {
                  storeName: storeName,
                  orderId: newOrderId,
                  amount: cartTotal.toLocaleString(),
                  phone: targetPhone
                });

                setCurrentMenu("history");
              } else {
                showCustomAlert("결제 검증 오류", `결제 검증 실패: ${result.message}`);
              }
            })
            .catch((err) => {
              console.error("결제 검증 중 오류 발생:", err);
              showCustomAlert("주문 등록 오류", "결제는 승인되었으나 주문 등록 중 오류가 발생했습니다. 고객센터에 문의바랍니다.");
            });
        } else {
          // 결제 실패 (code 필드가 있는 경우 에러)
          showCustomAlert("결제 실패", `결제에 실패하였습니다. 사유: ${response.message || "알 수 없는 에러"}`);
        }
      }).catch((err: any) => {
        console.error("결제 요청 중 오류 발생:", err);
        showCustomAlert("결제 오류", `결제창을 여는 중 에러가 발생했습니다: ${err.message || err}`);
      });
    });
  };

  // ==========================================
  // CANCEL ORDER
  // ==========================================
  const cancelOrder = (orderId: string) => {
    showCustomConfirm("주문 취소", "정말로 이 주문을 취소하시겠습니까?", () => {
      // Update locally first for optimistic response
      const updatedOrders = orders.map((o) =>
        o.id === orderId ? { ...o, status: "주문취소" } : o
      );
      setOrders(updatedOrders);
      localStorage.setItem("120_orders", JSON.stringify(updatedOrders));

      // Update in Convex Cloud DB
      updateOrderStatusMutation({ id: orderId, status: "주문취소" })
        .then(() => {
          triggerToast("주문이 취소되었습니다.");
          setSelectedOrder(null);
        })
        .catch((err) => {
          console.error("[Convex] Failed to cancel order:", err);
          triggerToast("주문 취소 처리에 실패했습니다.");
        });
    });
  };

  // ==========================================
  // SUBMIT INQUIRY
  // ==========================================
  const submitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryTitle || !inquiryContent) {
      showCustomAlert("입력 오류", "제목과 내용을 입력해 주세요.");
      return;
    }

    const newInquiryId = `INQ-${Math.floor(100 + Math.random() * 900)}`;
    const newInquiry: Inquiry = {
      id: newInquiryId,
      category: inquiryCategory,
      title: inquiryTitle,
      date: new Date().toISOString().split("T")[0],
      status: "답변대기",
      content: inquiryContent
    };

    const updatedInquiries = [newInquiry, ...inquiries];
    setInquiries(updatedInquiries);
    localStorage.setItem("120_inquiries", JSON.stringify(updatedInquiries));

    // Save to Convex Cloud DB
    createInquiryMutation({
      id: newInquiryId,
      storeId: activeStoreId || "owner",
      storeName: activeStore?.name || "강남역삼점",
      category: inquiryCategory,
      title: inquiryTitle,
      content: inquiryContent,
      date: newInquiry.date,
      status: "답변대기"
    }).then(() => {
      console.log("[Convex] Inquiry submitted successfully.");
    }).catch(err => {
      console.error("[Convex] Failed to submit inquiry to cloud DB:", err);
    });

    // SMS 발송 연동 (1:1 문의)
    const storeName = activeStore?.name || "강남역삼점";
    triggerSmsSend("inquiry_1to1", {
      storeName: storeName,
      title: inquiryTitle,
      category: inquiryCategory
    });

    setInquiryTitle("");
    setInquiryContent("");
    setShowInquiryModal(false);
    triggerToast("1:1 문의 상담건이 정식 접수되었습니다!");
    setCurrentMenu("inquiry");
  };

  const handleSubmitCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNotice) return;
    const storeData = (stores || []).find((s: any) => s.id === (activeStoreId || "owner"));
    const storeName = storeData?.name || "강남역삼점";

    try {
      await submitDeliveryCredentials({
        noticeId: selectedNotice.id,
        storeId: activeStoreId || "owner",
        storeName,
        baeminId,
        baeminPw,
        coupangId,
        coupangPw,
        submittedAt: new Date().toISOString().replace("T", " ").substring(0, 19),
      });
      triggerToast("배민/쿠팡이츠 계정 정보가 성공적으로 제출되었습니다!");
      setShowCredentialModal(false);
    } catch (err) {
      console.error("Failed to submit credentials:", err);
      alert("계정 정보 제출 중 오류가 발생했습니다.");
    }
  };

  // ==========================================
  // NOTICE SELECTION & VIEW INCREMENT
  // ==========================================
  const handleNoticeClick = (notice: Notice) => {
    setSelectedNotice(notice);
    if (notice._id) {
      incrementNoticeViewsMutation({ _id: notice._id }).then(() => {
        console.log("[Convex] Notice view count advanced.");
      }).catch(err => {
        console.error("[Convex] Failed to increment notice views:", err);
      });
    }
  };

  // ==========================================
  // FILE DOWNLOAD ENGINE (Data URL base64)
  // ==========================================
  const handleDownload = (title: string, fileUrl?: string, fileName?: string) => {
    if (fileUrl) {
      triggerToast(`'${fileName || title}' 다운로드를 시작합니다.`);
      try {
        const link = document.createElement("a");
        link.href = fileUrl;
        link.download = fileName || title;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        triggerToast("다운로드가 완료되었습니다.");
      } catch (err) {
        console.error("Download failed:", err);
        triggerToast("다운로드 중 오류가 발생했습니다.");
      }
    } else {
      triggerToast(`'${title}' 파일 다운로드를 준비하는 중...`);
      setTimeout(() => {
        triggerToast(`다운로드가 완료되었습니다.`);
      }, 1000);
    }
  };

  const renderPortalMaterialThumbnail = (item: any) => {
    const isImg = (url?: string, fmt?: string) => {
      const ext = (fmt || "").toUpperCase();
      if (["JPG", "JPEG", "PNG", "GIF", "WEBP"].includes(ext)) return true;
      if (url && (url.startsWith("data:image/") || url.includes("cloudinary.com") || url.match(/\.(jpg|jpeg|png|gif|webp)$/i))) return true;
      return false;
    };

    const isVideo = (url?: string, fmt?: string) => {
      const ext = (fmt || "").toUpperCase();
      if (["MP4", "MOV", "AVI", "MKV", "WEBM"].includes(ext)) return true;
      if (url && (url.startsWith("data:video/") || url.match(/\.(mp4|mov|avi|mkv|webm)$/i))) return true;
      return false;
    };

    const hasImg = item.img && item.img.trim() !== "";
    const hasFileUrl = item.fileUrl && item.fileUrl.trim() !== "";

    if (hasImg) {
      return (
        <div className="h-44 bg-slate-100 overflow-hidden relative shrink-0">
          <img src={optimizeCloudinaryUrl(item.img)} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          <span className="absolute bottom-3 right-3 bg-[#0F172A]/90 text-white backdrop-blur-xs text-[10px] font-black px-3 py-1 rounded-md shadow-xs">
            {item.format}
          </span>
        </div>
      );
    }

    if (hasFileUrl && isImg(item.fileUrl, item.format)) {
      return (
        <div className="h-44 bg-slate-100 overflow-hidden relative shrink-0">
          <img src={optimizeCloudinaryUrl(item.fileUrl)} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          <span className="absolute bottom-3 right-3 bg-[#0F172A]/90 text-white backdrop-blur-xs text-[10px] font-black px-3 py-1 rounded-md shadow-xs">
            {item.format}
          </span>
        </div>
      );
    }

    if (isVideo(item.fileUrl, item.format)) {
      return (
        <div className="h-44 bg-gradient-to-br from-amber-500 to-amber-600 flex flex-col items-center justify-center shrink-0 border-b border-amber-400 relative text-white group-hover:from-amber-600 group-hover:to-amber-700 transition-all">
          <Video size={48} className="text-white drop-shadow-md group-hover:scale-110 transition-transform" />
          <span className="text-xs font-black mt-2 tracking-wider uppercase drop-shadow-xs">동영상 강좌 / 가이드</span>
          <span className="absolute bottom-3 right-3 bg-[#0F172A]/90 text-white backdrop-blur-xs text-[10px] font-black px-3 py-1 rounded-md shadow-xs">
            {item.format}
          </span>
        </div>
      );
    }

    return (
      <div className="h-44 bg-slate-100 flex flex-col items-center justify-center shrink-0 border-b border-slate-200/60 relative text-slate-400 group-hover:bg-slate-200/60 transition-all">
        <FileText size={48} className="text-slate-400 group-hover:scale-110 transition-transform" />
        <span className="text-xs font-black mt-2 text-slate-600 uppercase">{item.format || "DOCUMENT"}</span>
        <span className="absolute bottom-3 right-3 bg-[#0F172A]/90 text-white backdrop-blur-xs text-[10px] font-black px-3 py-1 rounded-md shadow-xs">
          {item.format}
        </span>
      </div>
    );
  };

  // ==========================================
  // REAL-TIME COURIER TRACKING ROUTER
  // ==========================================
  // ==========================================
  // REAL-TIME COURIER TRACKING GENERATOR
  // ==========================================
  const getTrackingSteps = (info: { courier: string; trackingNo: string; orderId: string; status: string; date: string }) => {
    const { date, status } = info;
    
    // Helper to add days to date string
    const addDays = (dateStr: string, days: number) => {
      try {
        const d = new Date(dateStr);
        d.setDate(d.getDate() + days);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
      } catch (e) {
        return dateStr;
      }
    };

    const nextDay = addDays(date, 1);

    if (status === "배송완료") {
      return {
        currentStep: 4,
        steps: [
          { title: "접수완료", desc: "본사 발주 승인 및 패키징", status: "completed" },
          { title: "터미널입고", desc: "광주 HUB 저온분류", status: "completed" },
          { title: "대리점도착", desc: "강남 지사 도착 완료", status: "completed" },
          { title: "배송출발", desc: "탑차 배송출발", status: "completed" },
          { title: "배송완료", desc: "매장 냉동고 입고완료", status: "completed" },
        ],
        checkpoints: [
          { time: `${nextDay} 13:45`, location: "서울 강남지사", status: "배송완료", desc: "매장 후문 저온 보관 냉동고 내 안전 입고 완료 (수령 방식: 무인 비대면 보관 / 완료 사진 전송 완료)" },
          { time: `${nextDay} 09:10`, location: "서울 강남지사", status: "배송출발", desc: "에그120 전용 냉동탑차 배송 출발 - 담당 배송원 홍길동 기사님 (연락처: 010-1234-5678)" },
          { time: `${nextDay} 06:40`, location: "서울 강남지사", status: "대리점 도착", desc: "지역 서브 대리점 도착 및 저온 분류 하차 완료" },
          { time: `${date} 22:50`, location: "경기 광주 HUB", status: "간선상차", desc: "분류 완료 후 서울 강남지사 서브 터미널로 이동 출발 (저온탑차 수송)" },
          { time: `${date} 14:15`, location: "경기 광주 HUB", status: "터미널입고", desc: "식자재 전문 저온 물류 터미널 정기 입고 및 간선하차 분류 완료" },
          { time: `${date} 09:30`, location: "본사물류창고", status: "발송완료", desc: "에그120 식자재 콜드체인 선별 검수 및 드라이아이스 패키징 송장 등록 완료" }
        ]
      };
    } else if (status === "배송중") {
      return {
        currentStep: 3,
        steps: [
          { title: "접수완료", desc: "본사 발주 승인 및 패키징", status: "completed" },
          { title: "터미널입고", desc: "광주 HUB 저온분류", status: "completed" },
          { title: "대리점도착", desc: "강남 지사 도착 완료", status: "completed" },
          { title: "배송출발", desc: "탑차 배송출발", status: "current" },
          { title: "배송완료", desc: "매장 냉동고 입고예정", status: "pending" },
        ],
        checkpoints: [
          { time: `${nextDay} 11:20`, location: "서울 강남지사", status: "배송출발", desc: "에그120 전용 냉동탑차 배송 출발 - 담당 배송원 홍길동 기사님 (연락처: 010-1234-5678) / 15:00 이전 도착 예정" },
          { time: `${nextDay} 06:40`, location: "서울 강남지사", status: "대리점 도착", desc: "지역 서브 대리점 도착 및 저온 분류 하차 완료" },
          { time: `${date} 22:50`, location: "경기 광주 HUB", status: "간선상차", desc: "분류 완료 후 서울 강남지사 서브 터미널로 이동 출발 (저온탑차 수송)" },
          { time: `${date} 14:15`, location: "경기 광주 HUB", status: "터미널입고", desc: "식자재 전문 저온 물류 터미널 정기 입고 및 간선하차 분류 완료" },
          { time: `${date} 09:30`, location: "본사물류창고", status: "발송완료", desc: "에그120 식자재 콜드체인 선별 검수 및 드라이아이스 패키징 송장 등록 완료" }
        ]
      };
    } else {
      // 결제완료, 배송준비중
      return {
        currentStep: 0,
        steps: [
          { title: "접수완료", desc: "본사 발주 승인 및 패키징", status: "current" },
          { title: "터미널입고", desc: "광주 HUB 저온분류", status: "pending" },
          { title: "대리점도착", desc: "강남 지사 도착 예정", status: "pending" },
          { title: "배송출발", desc: "탑차 배송출발 예정", status: "pending" },
          { title: "배송완료", desc: "매장 냉동고 입고예정", status: "pending" },
        ],
        checkpoints: [
          { time: `${date} 14:00`, location: "본사물류창고", status: "발주접수", desc: "본사 발주 승인 완료. 콜드체인 가이드라인에 따른 냉동 포장 및 정기 수송 차량 배차 작업 진행 중" }
        ]
      };
    }
  };

  const handleTrackingClick = (courier?: string, trackingNo?: string, orderId?: string, status?: string, date?: string) => {
    const finalCourier = courier?.trim() || "한진택배";
    const finalTrackingNo = trackingNo?.trim() || (orderId ? `HNJ-120-${orderId.replace("ORD-", "")}` : "HNJ-120-TEMP");
    
    setTrackingInfo({
      courier: finalCourier,
      trackingNo: finalTrackingNo,
      orderId: orderId || "ORD-UNKNOWN",
      status: status || "배송중",
      date: date || new Date().toISOString().split('T')[0]
    });
    setTrackingModalOpen(true);
  };

  // ==========================================
  // PACKAGE DATA
  // ==========================================
  const activeStore = stores.find((s) => s.id === activeStoreId) || {
    id: "owner",
    name: "120겹파이 강남역삼점",
    owner: "김지훈",
    phone: "010-3813-1200",
    status: "승인",
    adoptionMenu: ["120pie", "egg120", "츄러스120", "핫도그120", "120coffee"]
  };

  const adoptionMenu = activeStore?.adoptionMenu || ["120pie"];

  const PACKAGES = [
    { name: "120pie", label: "120pie", img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1785158864/Group_4_1_zptjbn.png", active: adoptionMenu.includes("120pie"), desc: adoptionMenu.includes("120pie") ? "시그니처 파이 가동중" : "가맹 도입 대기" },
    { name: "egg120", label: "egg120", img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1785158865/Group_5_1_cdwr4y.png", active: adoptionMenu.includes("egg120"), desc: adoptionMenu.includes("egg120") ? "프리미엄 쌀 계란빵 가동중" : "가맹 도입 대기" },
    { name: "츄러스120", label: "츄러스120", img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1785158864/Group_7_iowfzq.png", active: adoptionMenu.includes("츄러스120"), desc: adoptionMenu.includes("츄러스120") ? "스페인 정통 스낵 가동중" : "가맹 도입 대기" },
    { name: "떡볶이120", label: "떡볶이120", img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1785158864/Group_6_io2ejc.png", active: adoptionMenu.includes("떡볶이120"), desc: adoptionMenu.includes("떡볶이120") ? "쫀득한 국물 떡볶이 가동중" : "가맹 도입 대기" },
    { name: "핫도그120", label: "핫도그120", img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1785158864/Group_8_d8kfzr.png", active: adoptionMenu.includes("핫도그120"), desc: adoptionMenu.includes("핫도그120") ? "직화 수제 핫도그 가동중" : "가맹 도입 대기" },
    { name: "120coffee", label: "120coffee", img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1785158864/Group_9_iskk3b.png", active: adoptionMenu.includes("120coffee"), desc: adoptionMenu.includes("120coffee") ? "스페셜티 가성비 음료 가동중" : "가맹 도입 대기" },
  ];

  // Filtering Products
  const filteredProducts =
    activeCategory === "전체"
      ? products
      : products.filter((p) => p.category === activeCategory);

  const activePackageCount = PACKAGES.filter((p) => p.active).length;
  const newNoticesCount = notices.length;
  const shippingCount = orders.filter((o) => o.status === "배송중" || o.status === "배송준비중").length;
  const answeredInqCount = inquiries.filter((i) => i.status === "답변완료").length;

  if (checkingAuth) {
    return (
      <div id="owner-portal" className="h-screen bg-[#fff9fb] flex items-center justify-center font-bold text-[#bf3e67]">
        인증 상태 확인 중...
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div id="owner-portal" className="min-h-screen w-screen bg-[#0B0F17] text-white flex flex-col font-sans select-none antialiased justify-center items-center p-4 relative overflow-hidden">
        {/* Soft Warm Ambient Radial Glow */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(circle at 50% 25%, rgba(254, 212, 34, 0.15) 0%, rgba(11, 15, 23, 0) 70%)"
          }}
        />

        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-[150] bg-[#FED422] text-[#0F172A] px-5 py-3.5 rounded-lg font-black text-sm shadow-[0_8px_30px_rgba(254,212,34,0.3)] flex items-center gap-2.5 animate-bounce">
            <CheckCircle2 size={18} className="text-[#0F172A]" />
            {toastMessage}
          </div>
        )}
        
        <div className="max-w-md w-full bg-slate-900/80 backdrop-blur-xl border border-slate-700/60 rounded-lg p-8 sm:p-10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] space-y-7 relative overflow-hidden text-left z-10">
          {/* Top Yellow Brand Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-[#FED422]" />
          
          <div className="text-center space-y-3.5 pt-2">
            {/* Prominent Large Brand Logo */}
            <div className="flex justify-center mb-1">
              <img
                src="https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784533894/Group_1_4_jl4rlr.png"
                alt="120PIE 로고"
                className="h-10 sm:h-12 w-auto object-contain drop-shadow-md"
              />
            </div>
            
            <div className="space-y-1.5">
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">점주 전용 포털</h2>
              <span className="inline-block text-xs font-black text-[#0F172A] bg-[#FED422] px-4 py-1 rounded-md shadow-2xs">
                가맹점 파트너 관리 시스템
              </span>
            </div>
            
            <p className="text-xs text-slate-400 font-semibold leading-relaxed max-w-xs mx-auto">
              본 시스템은 120겹파이 공식 가맹점 점주님들을 위한 전용 포털입니다. 발급받은 파트너 계정으로 로그인해 주세요.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4 pt-1">
            {loginError && (
              <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-lg p-3.5 text-xs font-bold flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0 text-rose-400" />
                <span>{loginError}</span>
              </div>
            )}
            
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-200 block">점주 아이디</label>
              <input
                type="text"
                placeholder="점주 아이디를 입력하세요"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                required
                className="w-full bg-slate-800/60 border border-slate-700/80 rounded-lg px-4 py-3.5 text-xs sm:text-sm text-white placeholder-slate-500 font-extrabold focus:outline-none focus:border-[#FED422] focus:ring-2 focus:ring-[#FED422]/30 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-200 block">비밀번호</label>
              <input
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={loginPw}
                onChange={(e) => setLoginPw(e.target.value)}
                required
                className="w-full bg-slate-800/60 border border-slate-700/80 rounded-lg px-4 py-3.5 text-xs sm:text-sm text-white placeholder-slate-500 font-extrabold focus:outline-none focus:border-[#FED422] focus:ring-2 focus:ring-[#FED422]/30 transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#FED422] hover:bg-[#e6be1f] text-[#0F172A] text-sm sm:text-base font-black rounded-lg transition-all shadow-lg shadow-[#FED422]/20 flex items-center justify-center gap-2 cursor-pointer border-0 active:scale-[0.99] mt-2"
            >
              <span>로그인 완료</span>
              <ArrowRight size={18} className="text-[#0F172A]" />
            </button>

            <button
              type="button"
              onClick={() => setShowRegisterModal(true)}
              className="w-full py-3.5 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-xs sm:text-sm font-extrabold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
            >
              🏢 가맹점 등록 신청
            </button>
          </form>

          <div className="text-center pt-2">
            <Link href="/" className="text-xs text-slate-400 hover:text-white font-bold transition-colors inline-flex items-center gap-1.5">
              <ArrowLeft size={13} />
              <span>메인 랜딩 페이지로 돌아가기</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="owner-portal" className="h-screen overflow-hidden text-[#0F172A] flex flex-col font-sans select-none antialiased bg-[#F8FAFC]">
      
      {/* TOAST SYSTEM */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[150] bg-[#FED422] text-[#0F172A] px-6 py-4 rounded-md font-black text-sm shadow-xl flex items-center gap-2.5 animate-bounce border-0">
          <CheckCircle2 size={18} />
          {toastMessage}
        </div>
      )}

      {/* HEADER BAR PANEL (Clean Light Gray Header - Admin 100% Identical 64px Height) */}
      <header className="bg-[#F4F6F8] border-b border-slate-200/50 sticky top-0 z-40 shrink-0 h-[64px] px-3 sm:px-6 lg:px-8 flex items-center justify-between overflow-hidden">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 text-slate-600 hover:text-[#0F172A] transition-colors border-0 bg-transparent cursor-pointer shrink-0"
            aria-label="메뉴 열기"
          >
            <Menu size={20} />
          </button>

          {/* Sidebar Collapse Toggle Button (Desktop - Admin 100% Identical) */}
          <button
            type="button"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="hidden lg:flex p-1.5 text-slate-500 hover:text-[#0F141C] hover:bg-white rounded-md transition-colors cursor-pointer border border-slate-200/80 bg-white shadow-2xs"
            title={isSidebarCollapsed ? "사이드바 펼치기" : "사이드바 접기"}
          >
            {isSidebarCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
          </button>

          <button 
            type="button"
            onClick={() => setCurrentMenu("dashboard")}
            className="flex items-center gap-1.5 sm:gap-2 group shrink-0 min-w-0 bg-transparent border-0 cursor-pointer p-0 text-left"
          >
            <img
              src="https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784533894/Group_1_4_jl4rlr.png"
              alt="120pie & coffee"
              className="h-5 sm:h-7 w-auto object-contain group-hover:scale-102 transition-transform shrink-0"
            />
            <span className="hidden sm:inline-block text-[11px] px-3 py-0.5 rounded-md bg-[#FED422] text-[#0F172A] font-black shadow-2xs whitespace-nowrap shrink-0">
              점주포털
            </span>
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <div className="hidden md:flex flex-col items-end text-right">
            <span className="font-black text-xs text-[#0F172A]">{activeStore.name}</span>
            <span className="text-[10px] text-slate-400 font-bold">{activeStore.owner} 사장님 (정상 파트너)</span>
          </div>
          
          <div className="h-6 w-px bg-slate-200 hidden md:block"></div>

          {/* 자재주문 바로가기 버튼 */}
          <button
            type="button"
            onClick={() => setCurrentMenu("order")}
            className="px-3 py-1.5 rounded-md bg-[#FED422] hover:bg-[#e6be1f] text-[#0F172A] text-xs font-black transition-all flex items-center gap-1.5 shadow-sm shrink-0 whitespace-nowrap border-0 cursor-pointer active:scale-95"
          >
            <ShoppingBag size={14} className="text-[#0F172A] shrink-0" />
            <span>자재주문 바로가기</span>
          </button>

          <Link
            href="/"
            className="hidden sm:inline-flex px-3.5 py-1.5 rounded-md border border-slate-200/80 bg-white hover:bg-slate-50 text-xs font-black text-slate-700 transition-all items-center gap-1.5 shadow-2xs shrink-0 whitespace-nowrap"
          >
            <ArrowLeft size={13} className="text-[#FED422] shrink-0" />
            <span>메인 사이트</span>
          </Link>
        </div>
      </header>

      {/* CORE WORKSPACE (Full Width 100% - Soft Light Gray Canvas #F4F6F8) */}
      <div className="flex-1 flex w-full max-w-full relative items-stretch min-h-0 overflow-hidden bg-[#F4F6F8]">
        
        {/* SIDEBAR NAVIGATION (DESKTOP - Admin 100% Identical rounded-tr-[40px] Style) */}
        <aside 
          className={`bg-[#0B0F17] py-5 px-0 flex flex-col justify-between hidden lg:flex shrink-0 transition-all duration-300 relative z-30 shadow-2xl rounded-tr-[40px] overflow-hidden ${
            isSidebarCollapsed ? "w-[80px]" : "w-[260px]"
          }`}
        >
          {/* Authentic Bottom Deep Blue Aurora Gradient Panel */}
          <div 
            className="absolute bottom-[-5%] left-[-15%] right-[-15%] h-[260px] pointer-events-none rounded-t-[50%]"
            style={{
              background: 'radial-gradient(circle at 30% 80%, rgba(56, 189, 248, 0.35) 0%, rgba(99, 102, 241, 0.25) 50%, rgba(139, 92, 246, 0.15) 80%, transparent 100%)',
              filter: 'blur(30px)'
            }}
          ></div>

          <div className="space-y-5 overflow-y-auto overflow-x-hidden no-scrollbar relative z-10 w-full">
            
            {/* Header Brand Logo (지정 로고 아이콘 적용 - 클릭 시 대시보드 이동) */}
            <button
              type="button"
              onClick={() => setCurrentMenu("dashboard")}
              className="flex items-center gap-3 px-5 pt-1 w-full text-left bg-transparent border-0 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 shadow-md border border-slate-700 bg-black group-hover:scale-105 transition-transform">
                <img
                  src="https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784730823/120%ED%8C%8C%EC%9D%B4_%EC%BB%A4%ED%94%BC_%EA%B8%88%EC%A0%95%EC%A0%90_%EC%B1%84%EB%84%90%EC%82%AC%EC%9D%B8_%EB%94%94%EC%9E%90%EC%9D%B8_250828_5_eadptv.png"
                  alt="120PIE Logo Icon"
                  className="w-full h-full object-cover"
                />
              </div>
              {!isSidebarCollapsed && (
                <div className="min-w-0">
                  <h3 className="font-black text-sm text-white tracking-tight truncate group-hover:text-[#FED422] transition-colors">120PIE Partner</h3>
                  <p className="text-[10px] text-slate-400 font-bold truncate">점주 전용 파트너십</p>
                </div>
              )}
            </button>

            {/* 1:1 Authentic HQ Profile Section (어드민 100% 동일 1:1 정사각형 풀 배경 적용) */}
            {!isSidebarCollapsed ? (
              <div className="relative w-full aspect-square my-2 border-0 rounded-none overflow-hidden group bg-[#0B0F17] flex flex-col justify-end">
                {/* 전체 프로필 정사각형 배경 이미지 */}
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-85 group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                  style={{
                    backgroundImage: `url('https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784705760/ChatGPT_Image_2026%EB%85%84_7%EC%9B%94_22%EC%9D%BC_%EC%98%A4%ED%9B%84_04_35_22_2_mpdbps.png')`
                  }}
                ></div>
                
                {/* 시네마틱 그라데이션 페이드 오버레이 */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17] via-[#0B0F17]/50 to-[#0B0F17]/10 pointer-events-none"></div>

                {/* 매장 및 점주 정보 텍스트 & 노란색 #STORE-ID 뱃지 */}
                <div className="relative z-10 flex flex-col items-center text-center gap-2 p-5 pb-6">
                  <div className="w-full truncate space-y-0.5 drop-shadow-md">
                    <h4 className="font-black text-xl text-white truncate tracking-tight">{activeStore.name}</h4>
                    <p className="text-xs text-[#FED422] font-bold truncate drop-shadow-xs">{activeStore.owner} 사장님</p>
                  </div>
                  <span className="mt-1 bg-[#FED422] text-[#0F172A] text-[11px] font-black px-4 py-1 rounded-md shadow-lg tracking-wider font-mono">
                    #{activeStore.id}
                  </span>
                </div>
              </div>
            ) : (
              <div className="w-12 h-12 mx-auto my-3 rounded-lg border border-slate-700/80 overflow-hidden shadow-md bg-slate-900 flex items-center justify-center text-[#F5AC00] font-black text-xs">
                가맹
              </div>
            )}

            {/* Navigation Menu Links (Admin 100% Identical py-3.5 행 높이, 18px 아이콘, px-5 패딩) */}
            <nav className="flex flex-col gap-2 px-5">
              {[
                { key: "dashboard", label: "대시보드", icon: LayoutDashboard },
                { key: "order", label: "자재 주문", icon: ShoppingBag, badge: cart.length > 0 ? cart.length : undefined },
                { key: "history", label: "주문 내역", icon: History, badge: orders.length > 0 ? orders.length : undefined },
                { key: "notice", label: "공지사항", icon: Megaphone, badge: notices.length > 0 ? notices.length : undefined },
                { key: "inquiry", label: "1:1 문의", icon: MessageSquare, badge: inquiries.length > 0 ? inquiries.length : undefined },
                { key: "training", label: "교육 자료", icon: BookOpen, badge: trainings.length > 0 ? trainings.length : undefined },
                { key: "pr", label: "홍보 자재", icon: ImageIcon, badge: prs.length > 0 ? prs.length : undefined },
                { key: "profile", label: "정보변경", icon: User }
              ].map(({ key, label, icon: Icon, badge }) => {
                const isActive = currentMenu === key;
                return (
                  <div key={key} className="relative group">
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentMenu(key);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full ${
                        isSidebarCollapsed ? "px-2.5 py-3.5 justify-center" : "px-4 py-3.5 justify-between"
                      } rounded-lg flex items-center text-xs font-bold transition-all border-0 outline-none focus:outline-none focus:ring-0 cursor-pointer ${
                        isActive
                          ? "bg-[#FED422] text-[#0F172A] shadow-md font-black"
                          : "text-[#94A3B8] hover:text-white hover:bg-white/5 bg-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <Icon size={18} className={isActive ? "text-[#0F172A]" : "text-[#94A3B8] shrink-0"} />
                        {!isSidebarCollapsed && <span className="truncate">{label}</span>}
                      </div>

                      {!isSidebarCollapsed && badge !== undefined && (
                        <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full shrink-0 shadow-2xs ${
                          isActive ? "bg-[#0F172A] text-[#FED422]" : "bg-[#FED422] text-[#0F172A]"
                        }`}>
                          {badge}
                        </span>
                      )}

                      {/* Collapsed Mode Notification Dot */}
                      {isSidebarCollapsed && badge !== undefined && (
                        <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-[#FED422] animate-pulse"></span>
                      )}
                    </button>

                    {/* Tooltip for Collapsed Sidebar */}
                    {isSidebarCollapsed && (
                      <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3.5 py-2 bg-[#0F141C] text-white text-xs font-bold rounded-md shadow-2xl whitespace-nowrap z-50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-slate-700">
                        {label} {badge !== undefined ? `(${badge})` : ""}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>

          <div className="border-t border-slate-800/80 pt-4 pb-2 px-5 space-y-2 relative z-10">
            <button
              type="button"
              onClick={handleLogout}
              className={`w-full ${isSidebarCollapsed ? "px-2 py-2.5 justify-center" : "px-4 py-2.5 justify-start"} rounded-lg flex items-center gap-3.5 text-xs font-bold text-[#94A3B8] hover:text-rose-400 hover:bg-rose-500/10 transition-colors text-left border-0 cursor-pointer`}
              title={isSidebarCollapsed ? "시스템 로그아웃" : undefined}
            >
              <LogOut size={18} className="shrink-0" />
              {!isSidebarCollapsed && <span>시스템 로그아웃</span>}
            </button>
          </div>
        </aside>

        {/* MOBILE SIDEBAR */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden flex animate-fadeIn" onClick={() => setMobileMenuOpen(false)}>
            <div className="w-72 bg-[#0F172A] text-white h-full p-6 flex flex-col justify-between shadow-2xl border-r border-slate-800" onClick={(e) => e.stopPropagation()}>
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentMenu("dashboard");
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 bg-transparent border-0 cursor-pointer p-0 text-left"
                  >
                    <img
                      src="https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784533894/Group_1_4_jl4rlr.png"
                      alt="120pie & coffee"
                      className="h-5 w-auto object-contain hover:opacity-80 transition-opacity"
                    />
                  </button>
                  <button 
                    type="button"
                    onClick={() => setMobileMenuOpen(false)} 
                    className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-md border-0 cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="bg-slate-800/80 border-0 rounded-lg p-4 flex gap-3 items-center">
                  <div className="w-10 h-10 rounded-md bg-[#F5AC00] text-[#0F172A] flex items-center justify-center font-black text-sm shrink-0">
                    가맹
                  </div>
                  <div>
                    <h4 className="font-black text-xs text-white">{activeStore.name}</h4>
                    <p className="text-[10px] text-slate-400 font-bold mt-0.5">{activeStore.id} / {activeStore.owner} 점주님</p>
                  </div>
                </div>

                <nav className="flex flex-col gap-1.5">
                  {[
                    { key: "dashboard", label: "대시보드", icon: LayoutDashboard },
                    { key: "order", label: "자재 주문", icon: ShoppingBag, badge: cart.length > 0 ? cart.length : undefined },
                    { key: "history", label: "주문 내역", icon: History, badge: orders.length > 0 ? orders.length : undefined },
                    { key: "notice", label: "공지사항", icon: Megaphone, badge: notices.length > 0 ? notices.length : undefined },
                    { key: "inquiry", label: "1:1 문의", icon: MessageSquare, badge: inquiries.length > 0 ? inquiries.length : undefined },
                    { key: "training", label: "교육 자료", icon: BookOpen, badge: trainings.length > 0 ? trainings.length : undefined },
                    { key: "pr", label: "홍보 자재", icon: ImageIcon, badge: prs.length > 0 ? prs.length : undefined },
                    { key: "profile", label: "정보변경", icon: User }
                  ].map(({ key, label, icon: Icon, badge }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        setCurrentMenu(key);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full px-4 py-3 rounded-lg flex items-center justify-between text-sm font-black transition-all border-0 cursor-pointer ${
                        currentMenu === key
                          ? "bg-[#FED422] text-[#0F172A] shadow-md"
                          : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={18} className={currentMenu === key ? "text-[#0F172A]" : "text-slate-400"} />
                        <span>{label}</span>
                      </div>
                      {badge !== undefined && (
                        <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                          currentMenu === key ? "bg-[#0F172A] text-[#FED422]" : "bg-[#FED422] text-[#0F172A]"
                        }`}>
                          {badge}
                        </span>
                      )}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="border-t border-slate-800 pt-5 space-y-2">
                <Link
                  href="/"
                  className="w-full px-4 py-3 rounded-lg flex items-center justify-between text-xs font-black bg-slate-800/90 text-white hover:bg-slate-700 transition-colors border-0"
                >
                  <div className="flex items-center gap-2.5">
                    <ArrowLeft size={15} className="text-[#FED422]" />
                    <span>메인 사이트 바로가기</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold">OUTLINK →</span>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full px-4 py-3 rounded-lg flex items-center gap-3 text-xs font-bold text-slate-400 hover:text-rose-400 hover:bg-slate-800/60 transition-colors text-left border-0 cursor-pointer"
                >
                  <LogOut size={16} />
                  <span>시스템 로그아웃</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MAIN CONTENT AREA (100% Full Width Screen Layout like Admin) */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 overflow-y-auto w-full max-w-full">
          <div className="w-full max-w-full space-y-6">
          
          {/* MENU CONTENT: 1. DASHBOARD */}
          {currentMenu === "dashboard" && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* 1. 상단 파트너십/어드민 환영 배너 (본사 어드민과 100% 동일한 매장 배경 이미지) */}
              <div className="w-full bg-[#0B0F17] text-white rounded-lg p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 group border-0">
                {/* 배경 이미지 커버 */}
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-75 group-hover:scale-103 transition-transform duration-700 pointer-events-none"
                  style={{
                    backgroundImage: `url('https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784732847/ChatGPT_Image_2026%EB%85%84_6%EC%9B%94_9%EC%9D%BC_%EC%98%A4%ED%9B%84_09_02_58_1_qvxy5y.png')`
                  }}
                ></div>

                {/* 가독성 100% 확보를 위한 어두운 시네마틱 그라데이션 오버레이 */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40 pointer-events-none"></div>

                <div className="space-y-2.5 max-w-3xl relative z-10">
                  <span className="bg-[#F5A623] text-slate-950 text-[10px] font-black px-3.5 py-1 rounded-md uppercase tracking-wider shadow-md">
                    PARTNERSHIP PORTAL
                  </span>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight leading-snug text-white drop-shadow-md">
                    {activeStore.name} | {activeStore.owner} 사장님 환영합니다!
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed drop-shadow-xs">
                    안녕하세요, 사장님! 120겹 파이&커피 가맹 지원 전산 서비스입니다. 본사 물류 및 공지 사항이 실시간으로 본사 어드민과 연동되고 있습니다.
                  </p>
                </div>

                {/* 우측 시네마틱 글래스모피즘 토글 박스 2개 */}
                <div className="flex items-center gap-3 shrink-0 relative z-10">
                  <div className="bg-black/60 backdrop-blur-md border border-white/15 px-5 py-3 rounded-lg text-center min-w-[120px] shadow-xl">
                    <span className="text-[10px] text-slate-400 font-extrabold block mb-0.5">매장 고유 코드</span>
                    <strong className="text-xs font-mono font-black text-[#F5A623] tracking-wider">#{activeStore.id}</strong>
                  </div>
                  <div className="bg-black/60 backdrop-blur-md border border-white/15 px-5 py-3 rounded-lg text-center min-w-[120px] shadow-xl">
                    <span className="text-[10px] text-slate-400 font-extrabold block mb-0.5">실시간 물류 상태</span>
                    <strong className="text-xs font-black text-emerald-400 animate-pulse">정상 작동 중</strong>
                  </div>
                </div>
              </div>

              {/* 4 SUMMARY STAT CARDS GRID (Admin Standard Style) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* Card 1: Operating Packages */}
                <button 
                  type="button"
                  onClick={() => document.getElementById("packages-section")?.scrollIntoView({ behavior: "smooth" })}
                  className="bg-white border border-[#EEF0F5] hover:border-[#F5AC00] transition-all rounded-lg p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] text-left group cursor-pointer relative overflow-hidden border-0"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-extrabold text-neutral-500 tracking-tight">운영 중 패키지 모듈</span>
                    <div className="w-12 h-12 rounded-lg bg-amber-50 text-[#F5AC00] group-hover:bg-[#F5AC00] group-hover:text-white flex items-center justify-center transition-all shadow-sm">
                      <LayoutDashboard size={22} />
                    </div>
                  </div>
                  <strong className="text-3xl font-black text-[#1E1B18] block mb-1">
                    {activePackageCount} <span className="text-sm font-bold text-neutral-400">/ 6개 가동</span>
                  </strong>
                  <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-emerald-600">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-100">+12.5%</span>
                    <span className="text-neutral-400 font-semibold">정상 라이선스 가동</span>
                  </div>
                </button>

                {/* Card 2: Shipping Orders */}
                <button 
                  type="button"
                  onClick={() => setCurrentMenu("history")}
                  className="bg-white border border-[#EEF0F5] hover:border-[#F5AC00] transition-all rounded-lg p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] text-left group cursor-pointer relative overflow-hidden border-0"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-extrabold text-neutral-500 tracking-tight">진행 중 배송/발주</span>
                    <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-all shadow-sm">
                      <Truck size={22} />
                    </div>
                  </div>
                  <strong className="text-3xl font-black text-[#1E1B18] block mb-1">
                    {shippingCount} <span className="text-sm font-bold text-neutral-400">건 배송중</span>
                  </strong>
                  <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-emerald-600">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-100">+8.3%</span>
                    <span className="text-neutral-400 font-semibold">전월 대비</span>
                  </div>
                </button>

                {/* Card 3: Educational & PR Materials */}
                <button 
                  type="button"
                  onClick={() => setCurrentMenu("training")}
                  className="bg-white border border-[#EEF0F5] hover:border-[#FED422] transition-all rounded-lg p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] text-left group cursor-pointer relative overflow-hidden border-0"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-extrabold text-neutral-500 tracking-tight">가맹점 교육/홍보자료</span>
                    <div className="w-12 h-12 rounded-lg bg-amber-50 text-amber-600 group-hover:bg-[#FED422] group-hover:text-[#0F172A] flex items-center justify-center transition-all shadow-sm">
                      <BookOpen size={22} />
                    </div>
                  </div>
                  <strong className="text-3xl font-black text-[#1E1B18] block mb-1">
                    {trainings.length + prs.length} <span className="text-sm font-bold text-neutral-400">개 등록</span>
                  </strong>
                  <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-[#0F172A]">
                    <span className="px-2.5 py-0.5 rounded-md bg-[#FED422] text-[#0F172A] font-black shadow-2xs">
                      {trainings.length + prs.length}개 최신업데이트
                    </span>
                  </div>
                </button>

                {/* Card 4: New Notices */}
                <button 
                  type="button"
                  onClick={() => setCurrentMenu("notice")}
                  className="bg-white border border-[#EEF0F5] hover:border-[#FED422] transition-all rounded-lg p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] text-left group cursor-pointer relative overflow-hidden border-0"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-extrabold text-neutral-500 tracking-tight">본사 공지사항</span>
                    <div className="w-12 h-12 rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center transition-all shadow-sm">
                      <Megaphone size={22} />
                    </div>
                  </div>
                  <strong className="text-3xl font-black text-[#1E1B18] block mb-1">
                    {notices.length} <span className="text-sm font-bold text-neutral-400">건 등록</span>
                  </strong>
                  <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-[#0F172A]">
                    <span className="px-2.5 py-0.5 rounded-md bg-[#FED422] text-[#0F172A] font-black shadow-2xs">
                      {notices.length}건 배포완료
                    </span>
                  </div>
                </button>
              </div>

              {/* 2. 가동 중인 120 패키지 운영 모듈 (본사 어드민과 100% 동일한 3D 아이콘 7종 동기화) */}
              <div id="packages-section" className="bg-white rounded-lg p-6 sm:p-7 shadow-[0_4px_25px_rgba(0,0,0,0.03)] border-0 space-y-5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div>
                    <h2 className="text-lg font-black text-[#0F172A] tracking-tight">전국 가동 중인 120 패키지 운영 모듈</h2>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">점포에서 라이선스를 취득해 작동 중인 브랜드 패키지 총 현황입니다.</p>
                  </div>
                  <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-md border border-emerald-100 shrink-0">
                    가동 라이선스 승인 완료
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
                  {PACKAGES.map((pkg) => (
                    <div 
                      key={pkg.name}
                      className={`rounded-lg p-3.5 text-center border space-y-2.5 flex flex-col items-center justify-between transition-all group cursor-pointer ${
                        pkg.active 
                          ? "bg-[#F8FAFC] hover:bg-emerald-50/50 border-slate-100 hover:border-emerald-200" 
                          : "bg-[#F8FAFC] border-slate-100 opacity-50"
                      }`}
                    >
                      <div className="w-10 h-10 rounded-md overflow-hidden flex items-center justify-center group-hover:scale-110 transition-transform">
                        <img
                          src={pkg.img}
                          alt={pkg.label}
                          className={`w-full h-full object-contain ${pkg.active ? "" : "grayscale-[40%]"}`}
                        />
                      </div>
                      <div className="space-y-1 w-full">
                        <strong className={`text-xs font-black block ${pkg.active ? "text-[#0F172A]" : "text-slate-500"}`}>
                          {pkg.label}
                        </strong>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded block w-full truncate ${
                          pkg.active 
                            ? "text-emerald-700 bg-emerald-100/90 font-black shadow-2xs" 
                            : "text-slate-400 bg-slate-100"
                        }`}>
                          {pkg.desc}
                        </span>
                      </div>
                    </div>
                  ))}

                  {/* Module 7: Add Module */}
                  <div className="bg-[#F8FAFC] rounded-lg p-3.5 text-center border border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 opacity-60">
                    <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-black text-sm">
                      +
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">신규 모듈 준비중</span>
                  </div>
                </div>
              </div>

              {/* 5. Grid: Recent Lists & Menu Shortcuts (Admin Layout Widgets) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                <div className="lg:col-span-8 space-y-6">
                  
                  {/* 120PIE 시즌 스페셜 메인 가로 배너 (본사 어드민 연동 배너) */}
                  <div className="w-full bg-[#0F172A] text-white rounded-lg p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col justify-between gap-6 group border-0 min-h-[220px]">
                    {/* 배경 시네마틱 이미지 커버 (본사 어드민 설정 이미지 최우선 연동) */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center opacity-65 group-hover:scale-103 transition-transform duration-700 pointer-events-none"
                      style={{
                        backgroundImage: `url('${
                          banner?.mainImage 
                            ? optimizeCloudinaryUrl(banner.mainImage) 
                            : 'https://res.cloudinary.com/dfarfqx7e/image/upload/f_auto,q_auto/v1781184019/120%EA%B2%B9%ED%8C%8C%EC%9D%B4_%ED%81%AC%EB%A6%BC%EC%B9%98%EC%A6%88_%EC%97%B0%EC%B6%9C_ebuddm.jpg'
                        }')`
                      }}
                    ></div>

                    {/* 가독성 시네마틱 오버레이 */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A] via-[#0F172A]/85 to-transparent pointer-events-none"></div>

                    <div className="space-y-3 max-w-2xl relative z-10">
                      <span className="bg-[#F5AC00] text-[#0F172A] text-[10px] font-black px-3.5 py-1 rounded-md uppercase tracking-wider shadow-md inline-block">
                        {banner?.mainTag || "Seasonal Spec"}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-snug text-white drop-shadow-md whitespace-pre-line">
                        {banner?.mainTitle || "여름 대비 스페셜 신메뉴\n'망고파이' 물류 정식 공급!"}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed drop-shadow-xs max-w-xl">
                        {banner?.mainDesc || "지금 바로 냉동생지를 주문하고, 홍보 자료실에서 매장 포스터 및 아크릴 테이블 텐트 시안을 무상으로 다운로드하여 매출을 강화해 보세요!"}
                      </p>
                    </div>

                    <div className="relative z-10 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          const target = banner?.mainLink || "order";
                          if (target.startsWith("http")) {
                            window.open(target, "_blank");
                          } else {
                            setCurrentMenu(target);
                          }
                        }}
                        className="px-5 py-2.5 rounded-md bg-[#F5AC00] hover:bg-[#e09d00] text-[#0F172A] text-xs font-black transition-all inline-flex items-center gap-2 shadow-lg cursor-pointer border-0 active:scale-98"
                      >
                        <span>{banner?.mainBtnText || "신메뉴 자재 발주하러 가기"}</span>
                        <ChevronRight size={15} />
                      </button>
                    </div>
                  </div>

                  {/* Menu Shortcuts */}
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { key: "order", label: "자재 주문", icon: ShoppingBag, desc: "원자재 발주", color: "bg-[#FED422] text-[#0F172A] hover:bg-[#e5be1f]" },
                      { key: "training", label: "교육 자료", icon: BookOpen, desc: "조리/운영 매뉴얼", color: "bg-white text-[#0F172A] border border-slate-100 hover:bg-[#F8FAFC]", badge: trainings.length },
                      { key: "pr", label: "홍보 자재", icon: ImageIcon, desc: "시즌 디자인 다운", color: "bg-white text-[#0F172A] border border-slate-100 hover:bg-[#F8FAFC]", badge: prs.length }
                    ].map((btn) => (
                      <button
                        key={btn.key}
                        type="button"
                        onClick={() => setCurrentMenu(btn.key)}
                        className={`p-5 flex flex-col justify-between min-h-[120px] text-left transition-all shadow-2xs rounded-lg border-0 cursor-pointer relative overflow-hidden group ${btn.color}`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <btn.icon size={22} className="text-[#0F172A]" />
                          {btn.badge !== undefined && (
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-[#FED422] text-[#0F172A] shadow-2xs">
                              {btn.badge}개
                            </span>
                          )}
                        </div>
                        <div>
                          <strong className="text-sm font-black block group-hover:text-amber-600 transition-colors">{btn.label}</strong>
                          <span className={`text-[10px] font-bold block opacity-80 mt-1 ${btn.key === "order" ? "text-[#0F172A]" : "text-slate-500"}`}>{btn.desc}</span>
                        </div>
                      </button>
                    ))}
                  </div>

                </div>

                <div className="lg:col-span-4 space-y-6">
                  
                  {/* Recent Notices Widget */}
                  <div className="bg-white rounded-lg p-6 sm:p-8 shadow-[0_4px_25px_rgba(0,0,0,0.03)] border-0">
                    <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-4">
                      <h4 className="font-black text-base text-[#0F172A]">최근 본사 공지사항</h4>
                      <button 
                        type="button"
                        onClick={() => setCurrentMenu("notice")} 
                        className="text-xs font-bold text-slate-400 hover:text-[#0F172A] transition-colors border-0 bg-transparent cursor-pointer"
                      >
                        전체보기
                      </button>
                    </div>
                    <div className="space-y-2">
                      {notices.slice(0, 3).map((notice) => (
                        <button
                          key={notice.id}
                          type="button"
                          onClick={() => setSelectedNotice(notice)}
                          className="w-full py-3 text-left flex items-center justify-between gap-3 group hover:bg-[#F8FAFC] px-3 rounded-md transition-colors border-0 cursor-pointer"
                        >
                          <div className="min-w-0 flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                                notice.tag === "필독" ? "bg-rose-100 text-rose-600" : "bg-slate-100 text-slate-600"
                              }`}>
                                {notice.tag}
                              </span>
                              <span className="text-xs font-black text-[#0F172A] group-hover:text-amber-600 truncate block">{notice.title}</span>
                            </div>
                          </div>
                          <ChevronRight size={14} className="text-slate-300 group-hover:text-[#0F172A] shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Recent Orders Widget */}
                  <div className="bg-white rounded-lg p-6 sm:p-8 shadow-[0_4px_25px_rgba(0,0,0,0.03)] border-0">
                    <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-4">
                      <h4 className="font-black text-base text-[#0F172A]">최근 발주 내역</h4>
                      <button 
                        type="button"
                        onClick={() => setCurrentMenu("history")} 
                        className="text-xs font-bold text-slate-400 hover:text-[#0F172A] transition-colors border-0 bg-transparent cursor-pointer"
                      >
                        전체보기
                      </button>
                    </div>
                    <div className="space-y-3">
                      {orders.length === 0 ? (
                        <p className="text-xs text-slate-400 text-center py-6 font-bold">주문 내역이 없습니다.</p>
                      ) : (
                        orders.slice(0, 2).map((order) => (
                          <div 
                            key={order.id} 
                            onClick={() => setSelectedOrder(order)}
                            className="bg-[#F8FAFC] border-0 hover:bg-slate-100/80 p-4 rounded-lg cursor-pointer transition-all group"
                          >
                            <div className="flex justify-between items-center text-[10px] mb-2">
                              <span className="text-slate-400 font-extrabold">{formatOrderDate(order.date, (order as any)._creationTime)}</span>
                              <span className={`px-2.5 py-0.5 rounded-full font-black ${
                                (() => {
                                  const colorKey = statusColors[order.status] || DEFAULT_STATUS_COLORS[order.status] || "pink";
                                  const preset = COLOR_PRESETS[colorKey as keyof typeof COLOR_PRESETS] || COLOR_PRESETS.pink;
                                  const pulse = order.status === "배송중" ? " animate-pulse" : "";
                                  return `${preset.bg} ${preset.text} ${preset.border}${pulse}`;
                                })()
                              }`}>
                                {order.status}
                              </span>
                            </div>
                            <div>
                              <span className="font-black text-xs text-[#0F172A] group-hover:text-amber-600 transition-colors truncate block">
                                {order.items[0].productName} {order.items.length > 1 ? `외 ${order.items.length - 1}건` : ""}
                              </span>
                              <div className="flex justify-between items-center mt-2.5">
                                <strong className="text-xs text-[#0F172A] font-black">{order.totalPrice.toLocaleString()} 원</strong>
                                <span className="text-[10px] text-slate-400 font-black opacity-0 group-hover:opacity-100 transition-opacity">상세보기 &gt;</span>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* ==========================================
              MENU CONTENT: 2. ORDER MATERIALS
             ========================================== */}
          {currentMenu === "order" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Side: Category tabs & Product Box grid (3 Columns) */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Category selector (Stage Flow Card Style) */}
                <div className="flex sm:flex-wrap overflow-x-auto sm:overflow-x-visible flex-nowrap whitespace-nowrap gap-1.5 sm:gap-2 bg-white border border-neutral-200/80 p-2 sm:p-2.5 rounded-lg shadow-2xs scrollbar-none">
                  {["전체", ...categories].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setActiveCategory(cat)}
                      className={`px-3.5 sm:px-4 py-2 rounded-md font-extrabold text-[11px] sm:text-xs transition-all shrink-0 cursor-pointer border-0 ${
                        activeCategory === cat
                          ? "bg-[#FED422] text-[#0F172A] shadow-2xs"
                          : "text-slate-500 hover:text-[#0F172A] hover:bg-slate-100"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Product Box Grid (3 Columns on Desktop: grid-cols-1 sm:grid-cols-2 lg:grid-cols-3) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProducts.map((p) => {
                    const cartQty = cart.find((item) => item.productId === p.id)?.quantity || 0;
                    return (
                      <React.Fragment key={p.id}>
                        {/* 1. Mobile Row View (Compact Left Thumbnail Layout) */}
                        <div 
                          onClick={() => setSelectedProductDetail(p)}
                          className="sm:hidden bg-white border border-neutral-200/80 hover:border-[#FED422] active:scale-[0.99] transition-all rounded-lg p-3 flex gap-3 items-center shadow-2xs cursor-pointer relative"
                        >
                          {/* Left: Thumbnail & Stock State */}
                          <div className="w-16 h-16 rounded-md bg-white overflow-hidden shrink-0 border border-neutral-200/60 relative">
                            <img src={optimizeCloudinaryUrl(p.img)} alt={p.name} className="w-full h-full object-contain p-1" />
                            {p.stock === "out_of_stock" && (
                              <div className="absolute inset-0 bg-black/45 flex items-center justify-center">
                                <span className="text-white font-black text-[9px] px-1 py-0.5 rounded bg-red-500 shadow-sm">품절</span>
                              </div>
                            )}
                          </div>

                          {/* Right: Info & Cart Actions */}
                          <div className="flex-1 min-w-0 flex flex-col justify-between h-16">
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[9px] text-[#0F172A] font-extrabold bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-200/80">
                                  {p.category}
                                </span>
                                <span className="text-[9px] text-slate-400 font-bold">{p.packSize}</span>
                              </div>
                              <h4 className="font-extrabold text-xs text-[#0F172A] truncate leading-tight">{p.name}</h4>
                            </div>

                            <div className="flex items-center justify-between mt-1">
                              <strong className="text-xs text-[#0F172A] font-black">{p.price.toLocaleString()}원</strong>
                              
                              <div onClick={(e) => e.stopPropagation()} className="shrink-0">
                                {p.stock === "out_of_stock" ? (
                                  <span className="bg-red-50 text-red-500 font-extrabold text-[10px] px-2.5 py-1 rounded-md border border-red-200 shadow-2xs whitespace-nowrap">일시품절</span>
                                ) : p.options && p.options.length > 0 ? (
                                  <button
                                    type="button"
                                    onClick={() => setSelectedProductDetail(p)}
                                    className="px-2.5 py-1 rounded-md bg-[#FED422] text-[#0F172A] text-[10px] font-black shadow-2xs border-0 cursor-pointer"
                                  >
                                    옵션선택
                                  </button>
                                ) : cartQty > 0 ? (
                                  <div className="flex items-center border border-slate-200 bg-slate-50 rounded-lg p-0.5">
                                    <button 
                                      type="button"
                                      onClick={() => updateCartQty(p.id, undefined, cartQty - 1)}
                                      className="p-0.5 hover:text-[#0F172A] text-slate-500 border-0 cursor-pointer"
                                    >
                                      <Minus size={11} />
                                    </button>
                                    <span className="px-2 text-[10px] font-bold text-[#0F172A] w-4 text-center">{cartQty}</span>
                                    <button 
                                      type="button"
                                      onClick={() => updateCartQty(p.id, undefined, cartQty + 1)}
                                      className="p-0.5 hover:text-[#0F172A] text-slate-500 border-0 cursor-pointer"
                                    >
                                      <Plus size={11} />
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => addToCart(p.id)}
                                    className="px-2.5 py-1 rounded-md bg-[#FED422] hover:bg-[#e5be1f] border-0 text-[10px] font-black text-[#0F172A] transition-all cursor-pointer shadow-2xs"
                                  >
                                    담기
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 2. Desktop 3-Column Grid Card View */}
                        <div 
                          onClick={() => setSelectedProductDetail(p)}
                          className="hidden sm:flex bg-white border border-neutral-200/90 hover:border-[#FED422] transition-all rounded-lg overflow-hidden flex-col justify-between shadow-2xs cursor-pointer hover:shadow-md hover:-translate-y-0.5 aspect-[4/5] w-full relative min-h-0"
                        >
                          {/* Thumbnail image & stock state badge (Generous 64% height for clean white backdrop) */}
                          <div className="h-[64%] w-full relative bg-white overflow-hidden shrink-0 border-b border-neutral-100 flex items-center justify-center p-3">
                            <img 
                              src={optimizeCloudinaryUrl(p.img)} 
                              alt={p.name} 
                              className={`w-full h-full object-contain transition-all duration-300 ${
                                p.stock === "out_of_stock" ? "brightness-50 grayscale" : ""
                              }`} 
                            />
                            {p.stock === "out_of_stock" && (
                              <div className="absolute inset-0 bg-red-950/40 flex items-center justify-center backdrop-blur-[1px]">
                                <span className="text-white font-black text-xs px-2.5 py-1.5 rounded-lg bg-red-600/90 shadow-md tracking-wider">
                                  일시품절
                                </span>
                              </div>
                            )}
                            <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1 max-w-[80%] z-10">
                              {p.stock === "low_stock" && (
                                <span className="bg-orange-500 text-white font-bold text-[8px] px-1.5 py-0.5 rounded shadow-2xs whitespace-nowrap">품절임박</span>
                              )}
                            </div>
                            <span className="absolute bottom-2 right-2 bg-white/95 backdrop-blur-sm text-[9px] text-slate-700 font-extrabold px-2 py-0.5 rounded-md border border-slate-200/80 whitespace-nowrap shadow-2xs">
                              {p.category}
                            </span>
                          </div>

                          {/* Compact Product Info Block */}
                          <div className="h-[36%] w-full shrink-0 flex flex-col justify-between p-3.5 min-h-0 relative overflow-hidden bg-white">
                            {p.labels && p.labels.length > 0 && (
                              <div className="absolute top-2.5 right-2.5 flex flex-wrap gap-1 w-fit justify-end z-10">
                                {p.labels.map((l) => {
                                  let bgStyle = "bg-slate-700 text-white";
                                  if (l === "BEST") bgStyle = "bg-[#FED422] text-[#0F172A] font-black";
                                  else if (l === "추천") bgStyle = "bg-indigo-600 text-white font-black";
                                  else if (l === "신제품") bgStyle = "bg-emerald-600 text-white font-black";
                                  return (
                                    <span key={l} className={`font-bold text-[8px] px-2 py-0.5 rounded-full shadow-2xs ${bgStyle} whitespace-nowrap`}>
                                      {l}
                                    </span>
                                  );
                                })}
                              </div>
                            )}
                            
                            {/* Product Info Area */}
                            <div className="space-y-0.5 pr-8 min-h-0 overflow-hidden text-left">
                              <span className="text-[9px] text-slate-400 font-bold block whitespace-nowrap truncate">{p.packSize}</span>
                              <h3 className="font-extrabold text-xs sm:text-sm text-[#0F172A] leading-snug truncate">{p.name}</h3>
                              <p className="text-[10px] text-slate-500 font-medium leading-tight truncate mt-0.5">{p.desc}</p>
                            </div>

                            {/* Price & Action Area - NO horizontal border line, clean gap layout */}
                            <div className="flex items-center justify-between mt-2 pt-1 shrink-0">
                              <div className="flex flex-col">
                                <span className="text-[9px] text-slate-400 font-bold -mb-0.5">공급가</span>
                                <strong className="text-sm sm:text-base text-[#0F172A] font-black whitespace-nowrap">{p.price.toLocaleString()}<span className="text-xs font-bold ml-0.5">원</span></strong>
                              </div>
                              
                              {p.stock === "out_of_stock" ? (
                                <span className="bg-slate-100 text-slate-400 font-extrabold text-xs px-3 py-1.5 rounded-md whitespace-nowrap shrink-0">일시품절</span>
                              ) : p.options && p.options.length > 0 ? (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedProductDetail(p);
                                  }}
                                  className="px-4 py-2 rounded-md bg-[#FED422] hover:bg-[#f5c800] text-[#0F172A] text-xs font-black transition-all shadow-xs hover:shadow-md shrink-0 whitespace-nowrap border-0 cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
                                >
                                  옵션 선택
                                </button>
                              ) : cartQty > 0 ? (
                                <div className="flex items-center border border-slate-200 bg-slate-50 rounded-md p-1 shrink-0 shadow-2xs" onClick={(e) => e.stopPropagation()}>
                                  <button 
                                    type="button"
                                    onClick={() => updateCartQty(p.id, undefined, cartQty - 1)}
                                    className="w-6 h-6 rounded-lg bg-white hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center transition-colors border-0 cursor-pointer shadow-2xs"
                                  >
                                    <Minus size={12} />
                                  </button>
                                  <span className="px-2.5 text-xs font-black text-[#0F172A] min-w-[20px] text-center">{cartQty}</span>
                                  <button 
                                    type="button"
                                    onClick={() => updateCartQty(p.id, undefined, cartQty + 1)}
                                    className="w-6 h-6 rounded-lg bg-[#FED422] hover:bg-[#f5c800] text-[#0F172A] font-bold flex items-center justify-center transition-colors border-0 cursor-pointer shadow-2xs"
                                  >
                                    <Plus size={12} />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    addToCart(p.id);
                                  }}
                                  className="px-4 py-2 rounded-md bg-[#FED422] hover:bg-[#f5c800] border-0 text-xs font-black text-[#0F172A] transition-all shrink-0 whitespace-nowrap cursor-pointer shadow-xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-1.5"
                                >
                                  <ShoppingBag size={13} />
                                  담기
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })}
                </div>

              </div>

              {/* Right Side: High-End Interactive Franchisee Shopping Cart */}
              <div className="lg:col-span-4 h-fit lg:self-start lg:sticky lg:top-[96px]">
                <div className="bg-white border border-slate-200/90 rounded-lg p-5 sm:p-6 shadow-md space-y-5">
                  
                  {/* Cart Header */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-[#FED422] flex items-center justify-center text-[#0F172A] shadow-xs">
                        <ShoppingBag size={18} />
                      </div>
                      <div>
                        <h3 className="font-black text-base text-[#0F172A] tracking-tight">발주 장바구니</h3>
                        <span className="text-[10px] text-slate-400 font-bold block -mt-0.5">실시간 물품 주문 수량 확인</span>
                      </div>
                    </div>
                    
                    {cart.length > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="bg-[#FED422] text-[#0F172A] text-[10px] font-black px-2.5 py-1 rounded-md shadow-2xs">
                          총 {cart.reduce((acc, item) => acc + item.quantity, 0)}개
                        </span>
                        <button 
                          type="button" 
                          onClick={clearCart} 
                          className="text-[10px] font-extrabold text-slate-400 hover:text-red-500 transition-colors flex items-center gap-0.5 cursor-pointer border-0 bg-transparent p-1"
                          title="장바구니 비우기"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    )}
                  </div>

                  {cart.length === 0 ? (
                    <div className="py-14 text-center space-y-3 bg-slate-50/60 rounded-lg border border-dashed border-slate-200">
                      <div className="w-12 h-12 rounded-lg bg-white text-slate-300 flex items-center justify-center mx-auto shadow-2xs">
                        <ShoppingBag size={24} />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-black text-slate-700">장바구니가 비어 있습니다.</p>
                        <p className="text-[11px] text-slate-400 font-medium leading-relaxed max-w-[200px] mx-auto">
                          원하시는 상품의 <strong className="text-[#0F172A] font-extrabold">[담기]</strong> 버튼을 누르면 이 곳에 바로 추가됩니다.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Cart Items list (Grouped by Shipping Type) */}
                      <div className="space-y-4 max-h-[340px] overflow-y-auto pr-1">
                        {groupedCartItems.map(([typeKey, group]) => (
                          <div key={typeKey} className="space-y-2">
                            <div className="flex justify-between items-center bg-slate-50 px-3 py-1.5 rounded-md border border-slate-100 select-none">
                              <span className="font-extrabold text-[11px] text-[#0F172A] flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-md bg-[#FED422]"></span>
                                {group.title}
                              </span>
                              {group.feeLabel && (
                                <span className="text-[10px] text-slate-600 font-extrabold bg-white border border-slate-200/80 px-2 py-0.5 rounded-md shadow-2xs">
                                  배송비 {group.feeLabel}
                                </span>
                              )}
                            </div>
                            
                            <div className="space-y-2">
                              {group.items.map((item) => {
                                const p = (products || []).find((prod) => prod.id === item.productId);
                                if (!p) return null;
                                return (
                                  <div key={`${item.productId}-${item.selectedOption || ""}`} className="flex gap-3 justify-between items-center bg-white border border-slate-200/80 hover:border-slate-300 p-3 rounded-lg shadow-2xs transition-all">
                                    <div className="w-11 h-11 rounded-md bg-slate-50 border border-slate-200/60 p-1 shrink-0 flex items-center justify-center overflow-hidden">
                                      <img src={optimizeCloudinaryUrl(p.img)} alt="" className="w-full h-full object-contain" />
                                    </div>
                                    
                                    <div className="flex-1 min-w-0 text-left">
                                      <h4 className="font-extrabold text-xs text-[#0F172A] truncate">{p.name}</h4>
                                      {item.selectedOption && (
                                        <span className="text-[10px] text-amber-700 font-black block mt-0.5 bg-amber-50 px-1.5 py-0.5 rounded w-fit select-none">
                                          옵션: {item.selectedOption}
                                        </span>
                                      )}
                                      <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400 font-bold">
                                        <strong className="text-slate-800 font-black text-xs">{(p.price * item.quantity).toLocaleString()}원</strong>
                                        <span>·</span>
                                        <span>{p.packSize}</span>
                                      </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-2 shrink-0">
                                      <button type="button" onClick={() => removeCartItem(p.id, item.selectedOption)} className="text-slate-300 hover:text-red-500 transition-colors p-0.5 cursor-pointer border-0 bg-transparent" aria-label="삭제">
                                        <X size={14} />
                                      </button>
                                      <div className="flex items-center border border-slate-200 bg-slate-50 rounded-lg p-0.5 shadow-2xs">
                                        <button type="button" onClick={() => updateCartQty(p.id, item.selectedOption, item.quantity - 1)} className="w-5 h-5 rounded bg-white text-slate-600 hover:text-[#0F172A] hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer border-0 shadow-2xs">
                                          <Minus size={10} />
                                        </button>
                                        <span className="px-2 text-xs font-black text-[#0F172A] min-w-[18px] text-center">{item.quantity}</span>
                                        <button type="button" onClick={() => updateCartQty(p.id, item.selectedOption, item.quantity + 1)} className="w-5 h-5 rounded bg-[#FED422] text-[#0F172A] font-bold flex items-center justify-center transition-colors cursor-pointer border-0 shadow-2xs">
                                          <Plus size={10} />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Cart Bill Details Panel */}
                      <div className="bg-[#0F172A] text-white rounded-lg p-4 space-y-3 shadow-sm text-xs">
                        <div className="flex justify-between text-slate-300 font-bold">
                          <span>상품 합계</span>
                          <span className="font-extrabold text-white">{cartSubtotal.toLocaleString()} 원</span>
                        </div>
                        <div className="flex justify-between text-slate-300 font-bold items-center">
                          <div className="flex items-center gap-1.5">
                            <span>배송비</span>
                            {shippingFee > 0 && (
                              <span className="text-[9px] bg-slate-800 text-amber-300 font-bold px-1.5 py-0.5 rounded">
                                {shippingTypeLabel}
                              </span>
                            )}
                          </div>
                          <span className="font-extrabold text-white">{shippingFee === 0 ? "무료배송" : `+ ${shippingFee.toLocaleString()} 원`}</span>
                        </div>
                        <div className="border-t border-slate-700/80 pt-3 flex justify-between items-center">
                          <span className="font-extrabold text-sm text-slate-200">최종 결제 금액</span>
                          <span className="font-black text-lg text-[#FED422]">{cartTotal.toLocaleString()}<span className="text-xs font-bold text-white ml-0.5">원</span></span>
                        </div>
                      </div>

                      {/* Order action button */}
                      <div>
                        <button 
                          type="button"
                          onClick={() => {
                            if (!recipientName) {
                              const activeStore = (stores || []).find((s: any) => s.id === (activeStoreId || "owner"));
                              setRecipientName(activeStore?.owner || "");
                            }
                            if (!recipientPhone) {
                              const activeStore = (stores || []).find((s: any) => s.id === (activeStoreId || "owner"));
                              setRecipientPhone(activeStore?.phone || "");
                            }
                            setShowCheckoutModal(true);
                          }}
                          className="w-full py-4 bg-[#FED422] hover:bg-[#f5c800] text-[#0F172A] text-sm font-black rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer border-0 active:scale-[0.98] hover:-translate-y-0.5"
                        >
                          <CheckCircle2 size={18} />
                          발주 결제 진행하기
                        </button>

                        {/* 이달의 카드 무이자 혜택 안내 */}
                        <div className="mt-3 bg-slate-50 border border-slate-200/80 rounded-lg p-3.5 shadow-2xs text-left">
                          <div className="flex items-center gap-1.5 text-[#0F172A] font-extrabold text-xs mb-2">
                            <CreditCard size={14} className="shrink-0 text-[#0F172A]" />
                            <span>7월 카드사 무이자 혜택 (5만원 이상)</span>
                          </div>
                          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[10px] font-semibold text-slate-500 border-b border-neutral-200/60 pb-2 mb-2">
                            <div className="flex justify-between items-center">
                              <span>• 현대 / 신한</span>
                              <span className="font-extrabold text-[#bf3e67]">2~3개월</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>• 삼성 / 국민</span>
                              <span className="font-extrabold text-[#bf3e67]">2~3개월</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>• 롯데 / 전북</span>
                              <span className="font-extrabold text-[#bf3e67]">2~3개월</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>• BC / 우리</span>
                              <span className="font-extrabold text-[#bf3e67]">2~5개월</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>• 하나 / 광주</span>
                              <span className="font-extrabold text-[#bf3e67]">2~5개월</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>• NH농협</span>
                              <span className="font-extrabold text-[#bf3e67]">2~6개월</span>
                            </div>
                          </div>
                          <div className="text-[8px] text-[#735965]/70 font-medium leading-normal">
                            * 법인/체크/선불/기프트/하이브리드 카드는 제외됩니다.<br />
                            * 자세한 사항은 PG사(KG이니시스) 결제창에서 확인 가능합니다.
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* ==========================================
              MENU CONTENT: 3. ORDER HISTORY
             ========================================== */}
          {currentMenu === "history" && (
            <div className="space-y-6">
              
              {/* Header & Description */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-xl font-black text-[#0F172A] tracking-tight flex items-center gap-2">
                    <span>정기 자재 발주 내역</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-md bg-[#FED422] text-[#0F172A] font-black shadow-2xs">
                      {orders.length}건
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-1">{activeStore?.name || "가맹점"}에서 신청한 역대 자재 발주 히스토리와 배송 현황입니다.</p>
                </div>
              </div>

              {/* Order Status Summary Counter Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white border border-slate-200/90 rounded-lg p-4 shadow-2xs space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold block">전체 발주</span>
                  <strong className="text-lg font-black text-[#0F172A]">{orders.length}건</strong>
                </div>
                <div className="bg-white border border-slate-200/90 rounded-lg p-4 shadow-2xs space-y-1">
                  <span className="text-[10px] text-amber-600 font-bold block">주문완료 / 접수</span>
                  <strong className="text-lg font-black text-amber-600">
                    {orders.filter(o => o.status === "주문완료" || o.status === "배송준비중" || o.status === "입금대기").length}건
                  </strong>
                </div>
                <div className="bg-white border border-slate-200/90 rounded-lg p-4 shadow-2xs space-y-1">
                  <span className="text-[10px] text-blue-600 font-bold block">배송 진행중</span>
                  <strong className="text-lg font-black text-blue-600">
                    {orders.filter(o => o.status === "배송중").length}건
                  </strong>
                </div>
                <div className="bg-white border border-slate-200/90 rounded-lg p-4 shadow-2xs space-y-1">
                  <span className="text-[10px] text-emerald-600 font-bold block">배송 완료</span>
                  <strong className="text-lg font-black text-emerald-600">
                    {orders.filter(o => o.status === "배송완료").length}건
                  </strong>
                </div>
              </div>

              {/* Order List Table Card (Stage Flow Premium Style) */}
              <div className="bg-white border border-slate-200/90 rounded-lg overflow-hidden shadow-sm">
                <div className="overflow-x-auto [::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-black text-[#0F172A] uppercase tracking-wider">
                        <th className="p-4 sm:p-5 whitespace-nowrap">신청 일자</th>
                        <th className="p-4 sm:p-5">주문 품목 요약</th>
                        <th className="p-4 sm:p-5 whitespace-nowrap">총 결제 대금</th>
                        <th className="p-4 sm:p-5">배송 상태</th>
                        <th className="p-4 sm:p-5 text-center">상세 정보</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {orders.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-12 text-center text-slate-400 font-bold">
                            발주 내역이 존재하지 않습니다.
                          </td>
                        </tr>
                      ) : (
                        orders.map((order) => (
                          <tr 
                            key={order.id} 
                            onClick={() => setSelectedOrder(order)}
                            className="hover:bg-amber-50/40 transition-colors cursor-pointer group"
                          >
                            <td className="p-4 sm:p-5 text-slate-600 font-bold whitespace-nowrap">{formatOrderDate(order.date, (order as any)._creationTime)}</td>
                            <td className="p-4 sm:p-5">
                              <span className="font-extrabold text-[#0F172A] block text-xs sm:text-sm">
                                {order.items[0].productName} {order.items.length > 1 ? `외 ${order.items.length - 1}건` : ""}
                              </span>
                              <span className="text-[10px] text-slate-400 font-medium block truncate mt-0.5 max-w-[280px]">
                                {order.items.map(item => `${item.productName} ${item.quantity}개`).join(", ")}
                              </span>
                            </td>
                            <td className="p-4 sm:p-5 font-black text-[#0F172A] text-sm whitespace-nowrap">
                              {order.totalPrice.toLocaleString()} 원
                            </td>
                            <td className="p-4 sm:p-5">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black border shadow-2xs ${
                                (() => {
                                  if (order.status === "배송완료") return "bg-emerald-50 text-emerald-700 border-emerald-200";
                                  if (order.status === "배송중") return "bg-blue-50 text-blue-700 border-blue-200 animate-pulse";
                                  if (order.status === "배송준비중") return "bg-amber-50 text-amber-800 border-amber-200";
                                  return "bg-slate-100 text-slate-700 border-slate-200";
                                })()
                              }`}>
                                {order.status === "배송중" && <Truck size={13} />}
                                {order.status === "배송완료" && <Check size={13} />}
                                {order.status === "배송준비중" && <Clock size={13} />}
                                {order.status === "주문완료" && <Clock size={13} />}
                                {!["배송중", "배송완료", "배송준비중", "주문완료"].includes(order.status) && <Clock size={13} />}
                                {order.status}
                              </span>
                            </td>
                            <td className="p-4 sm:p-5 text-center" onClick={(e) => e.stopPropagation()}>
                              <button 
                                onClick={() => setSelectedOrder(order)}
                                className="px-3 py-1.5 rounded-md bg-[#FED422] hover:bg-[#f5c800] text-[#0F172A] text-xs font-black transition-all cursor-pointer shadow-2xs hover:shadow-xs border-0"
                              >
                                상세보기
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ==========================================
              MENU CONTENT: 4. NOTICES
             ========================================== */}
          {currentMenu === "notice" && (
            <div className="space-y-6">
              
              {/* Header & Category Filter Tabs */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-xl font-black text-[#0F172A] tracking-tight flex items-center gap-2">
                    <span>가맹점 공지사항</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-md bg-[#FED422] text-[#0F172A] font-black shadow-2xs">
                      총 {notices.length}개
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-1">본사 가맹지원본부에서 사장님들께 드리는 정기 물류, 조리 가이드, 마케팅 공지입니다.</p>
                </div>

                {/* Tag Filter Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto [::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-1 sm:pb-0 shrink-0">
                  {["전체", "필독", "신메뉴", "일반"].map((filterTag) => {
                    const isActive = selectedNoticeCategory === filterTag || (!selectedNoticeCategory && filterTag === "전체");
                    return (
                      <button
                        key={filterTag}
                        type="button"
                        onClick={() => setSelectedNoticeCategory(filterTag === "전체" ? "" : filterTag)}
                        className={`px-3 py-1.5 rounded-md text-xs font-black transition-all cursor-pointer border-0 whitespace-nowrap shadow-2xs ${
                          isActive 
                            ? "bg-[#FED422] text-[#0F172A] shadow-xs" 
                            : "bg-white text-slate-500 hover:bg-slate-100 border border-slate-200/80"
                        }`}
                      >
                        {filterTag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Notice List Cards */}
              <div className="grid grid-cols-1 gap-3.5">
                {(() => {
                  const filteredNotices = selectedNoticeCategory 
                    ? notices.filter(n => (n.tag as string) === selectedNoticeCategory) 
                    : notices;

                  if (filteredNotices.length === 0) {
                    return (
                      <div className="bg-white border border-slate-200/90 rounded-lg p-12 text-center text-slate-400 font-bold space-y-2">
                        <p className="text-sm font-black text-slate-600">등록된 공지사항이 없습니다.</p>
                        <p className="text-xs text-slate-400 font-medium">선택하신 카테고리의 공지 내역이 존재하지 않습니다.</p>
                      </div>
                    );
                  }

                  return filteredNotices.map((n) => (
                    <button
                      key={n.id}
                      type="button"
                      onClick={() => handleNoticeClick(n)}
                      className="w-full text-left bg-white border border-slate-200/90 hover:border-[#FED422] transition-all duration-200 rounded-lg p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs hover:shadow-md cursor-pointer hover:-translate-y-0.5 group"
                    >
                      <div className="space-y-2 flex-1 min-w-0">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-2xs border ${
                            (n.tag as string) === "필독" 
                              ? "bg-rose-50 text-rose-600 border-rose-200/80" 
                              : (n.tag as string) === "신메뉴" || (n.tag as string) === "이벤트" || (n.tag as string) === "프로모션"
                              ? "bg-[#FED422] text-[#0F172A] border-amber-300"
                              : "bg-slate-100 text-slate-700 border-slate-200/80"
                          }`}>
                            {n.tag}
                          </span>
                          <h3 className="font-extrabold text-sm sm:text-base text-[#0F172A] group-hover:text-amber-600 transition-colors leading-snug truncate">
                            {n.title}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                          <span>{n.date}</span>
                          <span>·</span>
                          <span>본사 가맹사업지원팀</span>
                          <span>·</span>
                          <span>조회수 {n.views}회</span>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-2 self-end sm:self-center">
                        <span className="px-3 py-1.5 rounded-md bg-slate-50 group-hover:bg-[#FED422] text-[#0F172A] text-xs font-black transition-all border border-slate-200/60 group-hover:border-amber-300 shadow-2xs flex items-center gap-1">
                          상세 읽기 <ChevronRight size={14} />
                        </span>
                      </div>
                    </button>
                  ));
                })()}
              </div>

            </div>
          )}

          {/* ==========================================
              MENU CONTENT: 5. 1:1 INQUIRY
             ========================================== */}
          {currentMenu === "inquiry" && (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-xl font-black text-[#0F172A] tracking-tight flex items-center gap-2">
                    <span>가맹점 1:1 전용 문의</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-md bg-[#FED422] text-[#0F172A] font-black shadow-2xs">
                      {inquiries.length}건
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-1">물류 파손 오배송, 장비 고장 AS 접수, 매장 홍보 추가 지원 신청 등 빠른 해결을 돕습니다.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowInquiryModal(true)}
                  className="inline-flex items-center justify-center gap-1.5 px-5 py-3 bg-[#FED422] hover:bg-[#f5c800] text-[#0F172A] text-xs font-black rounded-md transition-all shadow-xs hover:shadow-md shrink-0 self-start sm:self-center cursor-pointer border-0 hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Send size={14} />
                  신규 1:1 문의 접수
                </button>
              </div>

              {/* Inquiry List Cards */}
              <div className="grid grid-cols-1 gap-3.5">
                {inquiries.length === 0 ? (
                  <div className="bg-white border border-slate-200/90 rounded-lg p-12 text-center text-slate-400 font-bold space-y-2">
                    <p className="text-sm font-black text-slate-600">등록된 문의 내역이 없습니다.</p>
                    <p className="text-xs text-slate-400 font-medium">상단의 [신규 1:1 문의 접수] 버튼을 눌러 본사 지원팀에 문의를 남겨주세요.</p>
                  </div>
                ) : (
                  inquiries.map((inq) => (
                    <button
                      key={inq.id}
                      type="button"
                      onClick={() => setSelectedInquiry(inq)}
                      className="w-full text-left bg-white border border-slate-200/90 hover:border-[#FED422] transition-all duration-200 rounded-lg p-5 sm:p-6 flex flex-col justify-between gap-3 group shadow-2xs hover:shadow-md cursor-pointer hover:-translate-y-0.5"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="text-[10px] font-black text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200/80">
                            {inq.category}
                          </span>
                          <h3 className="font-extrabold text-sm sm:text-base text-[#0F172A] group-hover:text-amber-600 transition-colors leading-snug truncate">
                            {inq.title}
                          </h3>
                        </div>
                        <span className={`text-[10px] font-black px-3 py-1 rounded-full shrink-0 border shadow-2xs ${
                          inq.status === "답변완료" 
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                            : "bg-amber-50 text-amber-800 border-amber-200"
                        }`}>
                          {inq.status}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-slate-400 font-medium border-t border-slate-100 pt-3 mt-1 w-full">
                        <span>접수번호: <strong className="font-mono text-slate-600">{inq.id}</strong> · 접수일자: {inq.date}</span>
                        <span className="px-3 py-1 rounded-md bg-slate-50 group-hover:bg-[#FED422] text-[#0F172A] font-black transition-all border border-slate-200/60 group-hover:border-amber-300 shadow-2xs flex items-center gap-1 text-xs">
                          상세 대화 보기 <ChevronRight size={13} />
                        </span>
                      </div>
                    </button>
                  ))
                )}
              </div>

            </div>
          )}

          {/* ==========================================
              MENU CONTENT: 6. TRAINING MATERIALS
             ========================================== */}
          {currentMenu === "training" && (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-xl font-black text-[#0F172A] tracking-tight flex items-center gap-2">
                    <span>가맹점 교육/매뉴얼 자료실</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-md bg-[#FED422] text-[#0F172A] font-black shadow-2xs">
                      {trainings.length}개 자료
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-1">안정적이고 표준화된 파이 및 에그빵 제조 오퍼레이션을 돕기 위한 필수 지침서 및 교안 영상입니다.</p>
                </div>
              </div>

              {/* Materials Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {trainings.length === 0 ? (
                  <div className="col-span-2 bg-white border border-slate-200/90 rounded-lg p-12 text-center text-slate-400 font-bold space-y-2">
                    <p className="text-sm font-black text-slate-600">등록된 교육 자료가 없습니다.</p>
                  </div>
                ) : (
                  trainings.map((t) => (
                    <div 
                      key={t.id}
                      className="bg-white border border-slate-200/90 hover:border-[#FED422] rounded-lg overflow-hidden flex flex-col justify-between shadow-2xs hover:shadow-md transition-all duration-200 group"
                    >
                      {renderPortalMaterialThumbnail(t)}

                      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                        <div className="space-y-2">
                          <span className="text-[10px] text-slate-400 font-bold block">{t.date} · 파일 크기 {t.size}</span>
                          <h3 className="font-extrabold text-base text-[#0F172A] leading-snug group-hover:text-amber-600 transition-colors">{t.title}</h3>
                          <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2">{t.desc}</p>
                        </div>

                        <div className="flex items-center gap-2 mt-2 w-full">
                          <button
                            type="button"
                            onClick={() => setSelectedMaterial(t)}
                            className="flex-1 px-4 py-2.5 rounded-md bg-slate-100 hover:bg-slate-200 border border-slate-200/60 text-xs font-extrabold text-[#0F172A] transition-all cursor-pointer"
                          >
                            상세보기
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDownload(t.title, t.fileUrl, t.fileName)}
                            className="px-4 py-2.5 rounded-md bg-[#FED422] hover:bg-[#f5c800] text-[#0F172A] text-xs font-black transition-all flex items-center justify-center gap-1.5 shrink-0 shadow-2xs border-0 cursor-pointer hover:shadow-xs"
                          >
                            <Download size={13} /> 다운로드
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

            </div>
          )}

          {/* ==========================================
              MENU CONTENT: 7. PR/MARKETING MATERIALS
             ========================================== */}
          {currentMenu === "pr" && (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-xl font-black text-[#0F172A] tracking-tight flex items-center gap-2">
                    <span>가맹점 홍보/마케팅 자재실</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-md bg-[#FED422] text-[#0F172A] font-black shadow-2xs">
                      {prs.length}개 자재
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-1">매장 윈도우 스티커, 테이블용 배너, 배달 플랫폼 등록용 캐릭터 썸네일 고화질 원본 그래픽 패키지입니다.</p>
                </div>
              </div>

              {/* PR Materials Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {prs.length === 0 ? (
                  <div className="col-span-2 bg-white border border-slate-200/90 rounded-lg p-12 text-center text-slate-400 font-bold space-y-2">
                    <p className="text-sm font-black text-slate-600">등록된 홍보 자료가 없습니다.</p>
                  </div>
                ) : (
                  prs.map((p) => (
                    <div 
                      key={p.id}
                      className="bg-white border border-slate-200/90 hover:border-[#FED422] rounded-lg overflow-hidden flex flex-col justify-between shadow-2xs hover:shadow-md transition-all duration-200 group"
                    >
                      {renderPortalMaterialThumbnail(p)}

                      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                        <div className="space-y-2">
                          <span className="text-[10px] text-slate-400 font-bold block">{p.date} · 파일 크기 {p.size}</span>
                          <h3 className="font-extrabold text-base text-[#0F172A] leading-snug group-hover:text-amber-600 transition-colors">{p.title}</h3>
                          <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2">{p.desc}</p>
                        </div>

                        <div className="flex items-center gap-2 mt-2 w-full">
                          <button
                            type="button"
                            onClick={() => setSelectedMaterial(p)}
                            className="flex-1 px-4 py-2.5 rounded-md bg-slate-100 hover:bg-slate-200 border border-slate-200/60 text-xs font-extrabold text-[#0F172A] transition-all cursor-pointer"
                          >
                            상세보기
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDownload(p.title, p.fileUrl, p.fileName)}
                            className="px-4 py-2.5 rounded-md bg-[#FED422] hover:bg-[#f5c800] text-[#0F172A] text-xs font-black transition-all flex items-center justify-center gap-1.5 shrink-0 shadow-2xs border-0 cursor-pointer hover:shadow-xs"
                          >
                            <Download size={13} /> 다운로드
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

            </div>
          )}

          {/* ==========================================
              MENU CONTENT: 8. 정보변경 (Profile Update)
             ========================================== */}
          {currentMenu === "profile" && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h2 className="text-xl font-bold text-[#2d2026]">점주 정보 변경</h2>
                <p className="text-xs text-[#735965] font-bold mt-1">로그인 비밀번호, 점주명, 연락처 및 배송 주소 등 가맹점 정보를 수정할 수 있습니다.</p>
              </div>

              <div className="bg-white border border-[#f2ccd7] rounded-lg p-6 shadow-sm space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs font-semibold text-[#735965]">
                  {/* 로그인 ID (읽기전용) */}
                  <div className="space-y-1.5">
                    <span>로그인 ID (변경 불가)</span>
                    <input 
                      type="text"
                      disabled
                      value={activeStore.id}
                      className="w-full bg-[#fcf8fa] border border-[#f2ccd7]/60 rounded-md px-3.5 py-2.5 text-xs text-[#735965] font-bold cursor-not-allowed"
                    />
                  </div>

                  {/* 가맹점명 (읽기전용) */}
                  <div className="space-y-1.5">
                    <span>가맹점명 (변경 불가)</span>
                    <input 
                      type="text"
                      disabled
                      value={activeStore.name}
                      className="w-full bg-[#fcf8fa] border border-[#f2ccd7]/60 rounded-md px-3.5 py-2.5 text-xs text-[#735965] font-bold cursor-not-allowed"
                    />
                  </div>

                  {/* 비밀번호 */}
                  <div className="space-y-1.5">
                    <span>새 비밀번호</span>
                    <input 
                      type="password"
                      placeholder="변경할 비밀번호 입력 (기존 유지 시 그대로 두세요)"
                      value={profilePw}
                      onChange={(e) => setProfilePw(e.target.value)}
                      className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-md px-3.5 py-2.5 text-xs text-[#2d2026] placeholder-[#735965]/40 focus:outline-none focus:border-[#f25f8a]"
                    />
                  </div>

                  {/* 비밀번호 확인 */}
                  <div className="space-y-1.5">
                    <span>새 비밀번호 확인</span>
                    <input 
                      type="password"
                      placeholder="변경할 비밀번호 다시 입력"
                      value={profilePwConfirm}
                      onChange={(e) => setProfilePwConfirm(e.target.value)}
                      className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-md px-3.5 py-2.5 text-xs text-[#2d2026] placeholder-[#735965]/40 focus:outline-none focus:border-[#f25f8a]"
                    />
                  </div>

                  {/* 점주명 */}
                  <div className="space-y-1.5">
                    <span>점주명 (대표자) *</span>
                    <input 
                      type="text"
                      placeholder="점주명을 입력하세요"
                      value={profileOwner}
                      onChange={(e) => setProfileOwner(e.target.value)}
                      className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-md px-3.5 py-2.5 text-xs text-[#2d2026] placeholder-[#735965]/40 focus:outline-none focus:border-[#f25f8a]"
                    />
                  </div>

                  {/* 전화번호 */}
                  <div className="space-y-1.5">
                    <span>연락처 (휴대폰 번호) *</span>
                    <input 
                      type="text"
                      placeholder="010-0000-0000"
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(formatPhoneNumber(e.target.value))}
                      className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-md px-3.5 py-2.5 text-xs text-[#2d2026] placeholder-[#735965]/40 focus:outline-none focus:border-[#f25f8a]"
                    />
                  </div>

                  {/* 도로명 주소 */}
                  <div className="col-span-1 md:col-span-2 space-y-1.5">
                    <span>매장 주소 (배송 기본 주소) *</span>
                    <div className="flex gap-2">
                      <input 
                        type="text"
                        placeholder="우편물 배송용 도로명 주소를 검색 또는 입력해 주세요"
                        value={profileRoadAddress}
                        onChange={(e) => setProfileRoadAddress(e.target.value)}
                        className="flex-1 bg-[#fff9fb] border border-[#f2ccd7] rounded-md px-3.5 py-2.5 text-xs text-[#2d2026] placeholder-[#735965]/40 focus:outline-none focus:border-[#f25f8a]"
                      />
                      <button
                        type="button"
                        onClick={() => openDaumPostcode("profile")}
                        className="px-4 py-2.5 bg-[#735965] hover:bg-[#5a444f] text-white text-xs font-bold rounded-md transition-all cursor-pointer border-0 shrink-0"
                      >
                        주소 검색
                      </button>
                    </div>
                  </div>

                  {/* 상세 주소 */}
                  <div className="col-span-1 md:col-span-2 space-y-1.5">
                    <span>상세 주소</span>
                    <input 
                      type="text"
                      placeholder="동, 호수, 층 등 상세 주소를 입력하세요"
                      value={profileDetailAddress}
                      onChange={(e) => setProfileDetailAddress(e.target.value)}
                      className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-md px-3.5 py-2.5 text-xs text-[#2d2026] placeholder-[#735965]/40 focus:outline-none focus:border-[#f25f8a]"
                    />
                  </div>
                </div>

                <div className="border-t border-[#f2ccd7]/40 pt-5 flex justify-end">
                  <button
                    type="button"
                    onClick={handleUpdateProfile}
                    disabled={isUpdatingProfile}
                    className="px-6 py-3 bg-[#FED422] hover:bg-[#e5be1f] text-[#0F172A] text-xs font-black rounded-md transition-all shadow-md flex items-center gap-1.5 disabled:opacity-50 cursor-pointer border-0"
                  >
                    {isUpdatingProfile ? "저장 중..." : "정보 변경 내용 저장"}
                  </button>
                </div>
              </div>
            </div>
          )}
          </div>
        </main>
      </div>

      {/* MODALS */}
      
      {/* 1. Notice Reading Modal (Stage Flow Tech Card Style) */}
      {selectedNotice && (
        <div 
          className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSelectedNotice(null)}
        >
          <div 
            className="w-full max-w-2xl bg-white border border-neutral-200/80 rounded-lg overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] max-h-[85vh] flex flex-col font-sans"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Stage Flow Yellow Header */}
            <div className="px-7 py-5 bg-[#FED422] text-[#0F172A] flex justify-between items-center shrink-0 shadow-2xs">
              <div className="flex items-center gap-2.5">
                <span className="bg-[#0F172A] text-white text-[10px] font-mono font-black tracking-wider uppercase px-2.5 py-1 rounded-md">
                  {selectedNotice.tag}
                </span>
                <span className="text-xs text-[#0F172A]/80 font-bold">{selectedNotice.date} · 조회수 {selectedNotice.views}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline-block text-[10px] font-black tracking-widest text-[#0F172A] uppercase px-2.5 py-1 rounded-md bg-black/5">
                  공지사항
                </span>
                <button 
                  type="button"
                  onClick={() => setSelectedNotice(null)} 
                  className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 text-[#0F172A] transition-all flex items-center justify-center border-0 cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="p-6 sm:p-7 overflow-y-auto space-y-4 flex-1 bg-[#f9fafb]">
              <div className="bg-white rounded-lg p-5 border border-neutral-200/90 shadow-2xs border-l-[5px] border-l-amber-500 space-y-4">
                <h3 className="text-lg sm:text-xl font-black text-[#0F172A] leading-tight">{selectedNotice.title}</h3>
                <div className="h-px bg-neutral-100 w-full my-3"></div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-semibold whitespace-pre-wrap">
                  {selectedNotice.content}
                </p>
              </div>
              
              {selectedNotice.title.includes("배달앱 메뉴 리뉴얼") && (
                <div className="bg-white rounded-lg p-5 border border-neutral-200/90 shadow-2xs border-l-[5px] border-l-blue-500 space-y-3 relative">
                  <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                    <span className="text-xs font-black text-[#0F172A] tracking-tight">배달앱 메뉴 리뉴얼 신청</span>
                    {savedCredentials ? (
                      <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-md text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                        ● 제출 완료
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-md text-[10px] font-black bg-rose-50 text-rose-700 border border-rose-200">
                        ● 제출 전
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 font-bold leading-relaxed">
                    📢 배달앱 메뉴 리뉴얼 무료 작업을 위한 배민/쿠팡이츠 계정을 입력해 주세요.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowCredentialModal(true)}
                    className={`w-full py-3 text-xs sm:text-sm font-black rounded-md transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer border-0 ${
                      savedCredentials 
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white" 
                        : "bg-[#FED422] hover:bg-[#e5be1f] text-[#0F172A]"
                    }`}
                  >
                    <span>
                      {savedCredentials 
                        ? "배민/쿠팡이츠 정보 확인 및 수정 ✍" 
                        : "배민/쿠팡이츠 정보 입력 바로가기 ✍"}
                    </span>
                  </button>
                </div>
              )}

              {/* Stage Flow Footer */}
              <div className="px-1 py-2 flex items-center justify-between border-t border-neutral-200/60 pt-3">
                <div className="flex items-center gap-2 text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>공지사항 정상 조회 중</span>
                </div>
                <button 
                  type="button"
                  onClick={() => setSelectedNotice(null)}
                  className="px-6 py-2.5 rounded-md bg-[#FED422] hover:bg-[#e5be1f] text-xs font-black text-[#0F172A] transition-colors border-0 cursor-pointer shadow-xs"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 1.5. Delivery App Credentials Popup Modal (Stage Flow Tech Card Style) */}
      {showCredentialModal && (
        <div 
          className="fixed inset-0 z-[110] bg-black/50 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setShowCredentialModal(false)}
        >
          <div 
            className="w-full max-w-lg bg-white border border-neutral-200/80 rounded-lg overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] max-h-[90vh] flex flex-col font-sans"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Stage Flow Yellow Header */}
            <div className="px-7 py-5 bg-[#FED422] text-[#0F172A] flex justify-between items-center shrink-0 shadow-2xs">
              <div>
                <h3 className="text-base font-black text-[#0F172A] tracking-tight">배민/쿠팡이츠 정보 입력</h3>
                <p className="text-xs text-[#0F172A]/80 font-bold mt-0.5">배달앱 메뉴 리뉴얼 작업을 위한 사장님 계정을 제출합니다.</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline-block text-[10px] font-black tracking-widest text-[#0F172A] uppercase px-2.5 py-1 rounded-md bg-black/5">
                  연동 계정
                </span>
                <button 
                  type="button"
                  onClick={() => setShowCredentialModal(false)} 
                  className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 text-[#0F172A] transition-all flex items-center justify-center border-0 cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmitCredentials} className="p-6 sm:p-7 overflow-y-auto space-y-4 flex-1 text-xs sm:text-sm bg-[#f9fafb]">
              <div className="bg-white rounded-lg p-5 border border-neutral-200/90 shadow-2xs border-l-[5px] border-l-amber-500 space-y-3">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                  <span className="text-xs font-black text-[#0F172A]">가맹점 정보</span>
                  <span className="bg-amber-50 text-amber-700 border border-amber-200/80 text-[10px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-md">
                    가맹점
                  </span>
                </div>
                <input 
                  type="text"
                  value={(() => {
                    const storeData = (stores || []).find((s: any) => s.id === (activeStoreId || "owner"));
                    return storeData?.name || "강남역삼점";
                  })()}
                  disabled
                  style={{ backgroundColor: '#e2e8f0' }}
                  className="w-full disabled:opacity-80 border-0 rounded-md px-4 py-3 text-xs text-[#0F172A] font-bold outline-none"
                />
              </div>

              {/* 배민 정보 (Blue Accent) */}
              <div className="bg-white rounded-lg p-5 border border-neutral-200/90 shadow-2xs border-l-[5px] border-l-blue-500 space-y-3">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                  <h4 className="font-black text-xs text-[#0F172A]">배달의민족 사장님 계정</h4>
                  <span className="bg-blue-50 text-blue-700 border border-blue-200/80 text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-0.5 rounded-md">
                    배달의민족
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-extrabold text-neutral-400">아이디(ID)</span>
                    <input 
                      type="text"
                      placeholder="배민 사장님 ID"
                      value={baeminId}
                      onChange={(e) => setBaeminId(e.target.value)}
                      required
                      className="w-full bg-[#F1F4F8] border-0 rounded-lg px-4 py-3 text-xs font-medium text-[#0F172A] placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all shadow-2xs"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-extrabold text-neutral-400">비밀번호(PW)</span>
                    <input 
                      type="password"
                      placeholder="배민 사장님 PW"
                      value={baeminPw}
                      onChange={(e) => setBaeminPw(e.target.value)}
                      required
                      className="w-full bg-[#F1F4F8] border-0 rounded-lg px-4 py-3 text-xs font-medium text-[#0F172A] placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all shadow-2xs"
                    />
                  </div>
                </div>
              </div>

              {/* 쿠팡 정보 (Emerald Accent) */}
              <div className="bg-white rounded-lg p-5 border border-neutral-200/90 shadow-2xs border-l-[5px] border-l-emerald-500 space-y-3">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                  <h4 className="font-black text-xs text-[#0F172A]">쿠팡이츠 사장님 계정</h4>
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-0.5 rounded-md">
                    쿠팡이츠
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-extrabold text-neutral-400">아이디(ID)</span>
                    <input 
                      type="text"
                      placeholder="쿠팡 사장님 ID"
                      value={coupangId}
                      onChange={(e) => setCoupangId(e.target.value)}
                      required
                      className="w-full bg-[#F1F4F8] border-0 rounded-lg px-4 py-3 text-xs font-medium text-[#0F172A] placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all shadow-2xs"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-extrabold text-neutral-400">비밀번호(PW)</span>
                    <input 
                      type="password"
                      placeholder="쿠팡 사장님 PW"
                      value={coupangPw}
                      onChange={(e) => setCoupangPw(e.target.value)}
                      required
                      className="w-full bg-[#F1F4F8] border-0 rounded-lg px-4 py-3 text-xs font-medium text-[#0F172A] placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all shadow-2xs"
                    />
                  </div>
                </div>
              </div>

              {/* 안내 문구 */}
              <div className="bg-white rounded-lg p-4 border border-neutral-200/90 text-xs text-neutral-500 font-bold space-y-1.5 leading-relaxed">
                <p className="text-[#0F172A] font-black">* 전달해주신 계정 정보는 메뉴 리뉴얼 작업 목적으로만 사용되며, 작업 완료 후 즉시 폐기하거나 사장님께서 비밀번호를 변경하셔도 무방합니다.</p>
                <p>※ 계정 정보는 외부에 공유되지 않으며 안전하게 관리됩니다.</p>
              </div>

              {/* Stage Flow Footer Bar */}
              <div className="px-1 py-2 flex items-center justify-between border-t border-neutral-200/60 pt-4">
                <div className="flex items-center gap-2 text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>안전 보안 전송</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCredentialModal(false)}
                    className="px-5 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 font-extrabold text-xs rounded-md transition-all cursor-pointer border-0"
                  >
                    취소
                  </button>
                  <button 
                    type="submit"
                    className="px-7 py-2.5 bg-[#0F172A] hover:bg-slate-800 text-white font-black text-xs rounded-md transition-all shadow-md active:scale-95 cursor-pointer border-0 flex items-center gap-2"
                  >
                    <span>정보 제출하기</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Inquiry Reading Modal (Stage Flow Tech Card Style) */}
      {selectedInquiry && (
        <div 
          className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn overflow-x-hidden"
          onClick={() => setSelectedInquiry(null)}
        >
          <div 
            className="w-full max-w-2xl max-w-[calc(100vw-24px)] bg-white border border-neutral-200/80 rounded-lg sm:rounded-lg overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] max-h-[85vh] flex flex-col font-sans"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Stage Flow White Header */}
            <div className="px-5 sm:px-7 py-4 sm:py-5 bg-white border-b border-neutral-200/80 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="bg-blue-50 text-blue-700 border border-blue-200/80 text-[10px] font-mono font-black tracking-wider uppercase px-2.5 py-1 rounded-md shrink-0">
                  {selectedInquiry.category}
                </span>
                <span className="text-xs text-neutral-400 font-medium truncate">접수일: {selectedInquiry.date}</span>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="hidden sm:inline-block text-[10px] font-bold tracking-widest text-neutral-500 uppercase px-2.5 py-1 rounded-md bg-neutral-100 border border-neutral-200/60">
                  문의 내역
                </span>
                <button 
                  type="button"
                  onClick={() => setSelectedInquiry(null)} 
                  className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-500 hover:text-neutral-900 transition-all flex items-center justify-center border-0 cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="p-5 sm:p-7 overflow-y-auto space-y-4 flex-1 bg-[#f9fafb] [::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <div className="bg-white rounded-lg p-5 border border-neutral-200/90 shadow-2xs border-l-[5px] border-l-blue-500 space-y-3">
                <div className="flex justify-between items-center border-b border-neutral-100 pb-2">
                  <span className="text-xs font-black text-[#0F172A]">문의 내역</span>
                  <span className="bg-blue-50 text-blue-700 border border-blue-200/80 text-[10px] font-black px-2.5 py-0.5 rounded-md">
                    {selectedInquiry.status}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-[#0F172A] leading-tight">{selectedInquiry.title}</h3>
                <div className="bg-[#F8F9FA] border-0 p-4 rounded-md">
                  <p className="text-xs sm:text-sm text-[#0F172A] leading-relaxed font-semibold whitespace-pre-wrap">{selectedInquiry.content}</p>
                </div>
              </div>

              {selectedInquiry.status === "답변완료" && selectedInquiry.answer ? (
                <div className="bg-white rounded-lg p-5 border border-neutral-200/90 shadow-2xs border-l-[5px] border-l-emerald-500 space-y-3">
                  <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                    <span className="text-xs font-black text-[#0F172A]">본사 가맹사업관리팀 공식 답변</span>
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[10px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-md">
                      답변 완료
                    </span>
                  </div>
                  <div className="bg-[#F8F9FA] border-0 p-4 rounded-md">
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-semibold whitespace-pre-wrap">
                      {selectedInquiry.answer}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg p-5 border border-neutral-200/90 shadow-2xs border-l-[5px] border-l-amber-500 space-y-3">
                  <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                    <h4 className="text-xs font-black text-[#0F172A] flex items-center gap-1.5">
                      <Clock size={14} className="text-amber-500" /> 본사 답변 대기중
                    </h4>
                    <span className="bg-amber-50 text-amber-700 border border-amber-200/80 text-[10px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-md">
                      답변 대기중
                    </span>
                  </div>
                  <div className="bg-[#F8F9FA] border-0 p-4 rounded-md">
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-semibold">
                      점주님께서 올려주신 소중한 문의 사항이 본사 고객케어팀 및 기술 오퍼레이션 본부로 긴급 전달되었습니다. 최대한 상세하게 검토 후 12시간 이내에 정확하게 피드백 및 기기 AS 상담을 지원하겠습니다.
                    </p>
                  </div>
                </div>
              )}

              {/* Stage Flow Footer */}
              <div className="px-1 py-2 flex items-center justify-between border-t border-neutral-200/60 pt-3">
                <div className="flex items-center gap-2 text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>기록 정상 상태</span>
                </div>
                <button 
                  type="button"
                  onClick={() => setSelectedInquiry(null)}
                  className="px-6 py-2.5 rounded-md bg-[#0F172A] hover:bg-slate-800 text-xs font-black text-white transition-colors border-0 cursor-pointer shadow-xs"
                >
                  확인 완료
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Training & PR Material Reading Modal (Stage Flow Tech Card Style) */}
      {selectedMaterial && (
        <div 
          className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn overflow-x-hidden"
          onClick={() => setSelectedMaterial(null)}
        >
          <div 
            className="w-full max-w-2xl max-w-[calc(100vw-24px)] bg-white border border-neutral-200/80 rounded-lg sm:rounded-lg overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] max-h-[85vh] flex flex-col font-sans"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Stage Flow Yellow Header */}
            <div className="px-7 py-5 bg-[#FED422] text-[#0F172A] flex justify-between items-center shrink-0 shadow-2xs">
              <div className="flex items-center gap-2.5">
                <span className="bg-[#0F172A] text-white text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-md">
                  {selectedMaterial.format}
                </span>
                <span className="text-xs text-[#0F172A]/80 font-bold">{selectedMaterial.date} · 크기 {selectedMaterial.size}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline-block text-[10px] font-black tracking-widest text-[#0F172A] uppercase px-2.5 py-1 rounded-md bg-black/5">
                  교육/홍보 자료
                </span>
                <button 
                  type="button"
                  onClick={() => setSelectedMaterial(null)} 
                  className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 text-[#0F172A] transition-all flex items-center justify-center border-0 cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="p-6 sm:p-7 overflow-y-auto space-y-4 flex-1 bg-[#f9fafb] [::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {/* Material Detail Card */}
              <div className="bg-white rounded-lg p-5 border border-neutral-200/90 shadow-2xs border-l-[5px] border-l-amber-500 space-y-4">
                {selectedMaterial.img && (
                  <div className="w-full h-48 rounded-md overflow-hidden bg-neutral-100 border border-neutral-200/80">
                    <img src={optimizeCloudinaryUrl(selectedMaterial.img)} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
                <h3 className="text-base sm:text-lg font-black text-[#0F172A] leading-tight">{selectedMaterial.title}</h3>
                <div className="bg-[#F8F9FA] border-0 p-4 rounded-md">
                  <span className="text-[10px] text-neutral-400 font-black uppercase tracking-wider block mb-1">상세 설명</span>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-semibold">
                    {selectedMaterial.desc}
                  </p>
                </div>
              </div>

              {/* Stage Flow Footer Bar */}
              <div className="px-1 py-2 flex items-center justify-between border-t border-neutral-200/60 pt-3">
                <div className="flex items-center gap-2 text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>다운로드 준비 완료</span>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    type="button"
                    onClick={() => setSelectedMaterial(null)}
                    className="px-5 py-2.5 rounded-md bg-neutral-100 hover:bg-neutral-200 text-xs font-bold text-slate-700 transition-all border-0 cursor-pointer"
                  >
                    닫기
                  </button>
                  <button 
                    type="button"
                    onClick={() => {
                      setSelectedMaterial(null);
                      handleDownload(selectedMaterial.title, selectedMaterial.fileUrl, selectedMaterial.fileName);
                    }}
                    className="px-7 py-2.5 rounded-md bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-black transition-all flex items-center gap-2 border-0 shadow-md active:scale-95 cursor-pointer"
                  >
                    <Download size={14} />
                    <span>다운로드</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Write New 1:1 Inquiry Modal (Stage Flow Tech Card Style) */}
      {showInquiryModal && (
        <div 
          className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn overflow-x-hidden"
          onClick={() => setShowInquiryModal(false)}
        >
          <div 
            className="w-full max-w-xl max-w-[calc(100vw-24px)] bg-white border border-neutral-200/80 rounded-lg sm:rounded-lg overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] max-h-[90vh] flex flex-col font-sans"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Stage Flow Yellow Header */}
            <div className="px-7 py-5 bg-[#FED422] text-[#0F172A] flex justify-between items-center shrink-0 shadow-2xs">
              <div>
                <h3 className="text-base font-black text-[#0F172A] tracking-tight">신규 1:1 가맹상담 문의 접수</h3>
                <p className="text-xs text-[#0F172A]/80 font-bold mt-0.5">매장 운영 중 발생하는 물류, 기기 AS, 정산 문의를 접수합니다.</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline-block text-[10px] font-black tracking-widest text-[#0F172A] uppercase px-2.5 py-1 rounded-md bg-black/5">
                  문의 서식
                </span>
                <button 
                  type="button"
                  onClick={() => closeModal(() => setShowInquiryModal(false))} 
                  className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 text-[#0F172A] transition-all flex items-center justify-center border-0 cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <form onSubmit={submitInquiry} className="p-6 sm:p-7 overflow-y-auto space-y-4 flex-1 text-xs sm:text-sm bg-[#f9fafb] [::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {/* Card 1: Category & Title (Amber Accent) */}
              <div className="bg-white rounded-lg p-5 border border-neutral-200/90 shadow-2xs border-l-[5px] border-l-amber-500 space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs">
                      💬
                    </div>
                    <span className="text-xs font-black text-[#0F172A] tracking-tight">문의 유형 및 제목</span>
                  </div>
                  <span className="bg-amber-50 text-amber-700 border border-amber-200/80 text-[10px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-md">
                    문의 유형
                  </span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-extrabold text-[#0F172A]">문의 유형 선택 *</label>
                  <select 
                    value={inquiryCategory}
                    onChange={(e) => setInquiryCategory(e.target.value)}
                    className="w-full bg-[#F1F4F8] border-0 rounded-lg px-4 py-3 text-xs sm:text-sm font-medium text-[#0F172A] focus:bg-white focus:ring-2 focus:ring-amber-500/20 cursor-pointer outline-none transition-all shadow-2xs"
                  >
                    <option value="물류">물류 배송 / 자재 훼손 오배송 건</option>
                    <option value="기술/AS">조리 타이머 및 집기 AS 수리 접수</option>
                    <option value="마케팅">매장 POP / 캐릭터 시각 홍보 추가 지원</option>
                    <option value="대금/정산">물류 대금 결제 / 가맹 정산 문의</option>
                    <option value="기타">기타 매장 운영 애로사항 접수</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-extrabold text-[#0F172A]">문의 제목 *</label>
                  <input 
                    type="text"
                    placeholder="예시) 로제 생지 오배송 건 확인 요청"
                    value={inquiryTitle}
                    onChange={(e) => setInquiryTitle(e.target.value)}
                    required
                    className="w-full bg-[#F1F4F8] border-0 rounded-lg px-4 py-3 text-xs sm:text-sm font-medium text-[#0F172A] placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-amber-500/20 outline-none transition-all shadow-2xs"
                  />
                </div>
              </div>

              {/* Card 2: Details Content (Blue Accent) */}
              <div className="bg-white rounded-lg p-5 border border-neutral-200/90 shadow-2xs border-l-[5px] border-l-blue-500 space-y-3">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                      📜
                    </div>
                    <span className="text-xs font-black text-[#0F172A] tracking-tight">문의 세부 내용</span>
                  </div>
                  <span className="bg-blue-50 text-blue-700 border border-blue-200/80 text-[10px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-md">
                    문의 내용
                  </span>
                </div>

                <textarea 
                  rows={5}
                  placeholder="발생 일시, 품목명, 상황 등을 최대한 상세히 기입해주시면 한층 정밀하고 신속한 AS 및 지원 처리가 가능합니다."
                  value={inquiryContent}
                  onChange={(e) => setInquiryContent(e.target.value)}
                  required
                  className="w-full bg-[#F1F4F8] border-0 rounded-lg px-4 py-3 text-xs sm:text-sm font-medium text-[#0F172A] placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-500/20 resize-none outline-none transition-all shadow-2xs"
                />
              </div>

              {/* Stage Flow Footer Bar */}
              <div className="px-1 py-2 flex items-center justify-between border-t border-neutral-200/60 pt-4">
                <div className="flex items-center gap-2 text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>지원 접수 준비 완료</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => closeModal(() => setShowInquiryModal(false))}
                    className="px-5 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 font-extrabold text-xs rounded-md transition-all cursor-pointer border-0"
                  >
                    취소
                  </button>
                  <button 
                    type="submit"
                    className="px-7 py-2.5 bg-[#FED422] hover:bg-[#e5be1f] text-[#0F172A] font-black text-xs rounded-md transition-all shadow-md active:scale-95 cursor-pointer border-0 flex items-center gap-2"
                  >
                    <span>AS 문의 접수</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}



      {/* 5. Order Details Modal (Stage Flow Tech Card Style) */}
      {selectedOrder && (
        <div 
          className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSelectedOrder(null)}
        >
          <div 
            className="w-full max-w-2xl bg-white border border-neutral-200/80 rounded-lg overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] max-h-[85vh] flex flex-col font-sans"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Stage Flow Yellow Header */}
            <div className="px-7 py-5 bg-[#FED422] text-[#0F172A] flex justify-between items-center shrink-0 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-md bg-black/10 text-[#0F172A] flex items-center justify-center font-bold">
                  <Package size={20} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-[#0F172A] tracking-tight flex items-center gap-2">
                    <span>발주 상세 내역</span>
                    <span className="text-[11px] px-2.5 py-0.5 rounded-md bg-black/10 text-[#0F172A] font-mono font-bold">
                      {selectedOrder.id}
                    </span>
                  </h3>
                  <p className="text-xs text-[#0F172A]/80 font-bold mt-0.5">{activeStore?.name || "가맹점"} 발주 품목 및 물류 현황</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline-block text-[10px] font-mono font-bold tracking-widest text-[#0F172A] uppercase px-2.5 py-1 rounded-md bg-black/5">
                  ORDER DETAILS
                </span>
                <button 
                  type="button"
                  onClick={() => closeModal(() => setSelectedOrder(null))} 
                  className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 text-[#0F172A] transition-all flex items-center justify-center border-0 cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="p-6 sm:p-7 overflow-y-auto space-y-4 flex-1 text-xs bg-[#f9fafb] [::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              
              {/* Status Timeline Card (Amber Accent) */}
              <div className="bg-white rounded-lg p-5 border border-neutral-200/90 shadow-2xs border-l-[5px] border-l-amber-500 space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5">
                  <span className="text-xs font-black text-[#0F172A] tracking-tight">물류 배송 진행 현황</span>
                  <span className="bg-amber-50 text-amber-700 border border-amber-200/80 text-[10px] font-mono font-black tracking-wider uppercase px-2.5 py-0.5 rounded-md">
                    TIMELINE
                  </span>
                </div>
                
                <div className="relative flex items-center justify-between mt-6 px-4">
                  {/* Bounded Progress Line Track (Prevents right-side line overflow) */}
                  <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-[3px] bg-neutral-200 z-0 overflow-hidden rounded-md">
                    <div 
                      className="h-full bg-amber-500 transition-all duration-500 rounded-md"
                      style={{
                        width: selectedOrder.status === "주문완료" ? "0%" 
                             : selectedOrder.status === "배송준비중" ? "33%" 
                             : selectedOrder.status === "배송중" ? "66%" 
                             : "100%"
                      }}
                    ></div>
                  </div>

                  {/* Stage Dots */}
                  {[
                    { label: "주문완료", desc: "본사 접수" },
                    { label: "배송준비중", desc: "상품 적재" },
                    { label: "배송중", desc: "저온 운송" },
                    { label: "배송완료", desc: "지점 수령" }
                  ].map((stage, idx) => {
                    const isPassed = 
                      selectedOrder.status === "배송완료" ||
                      (selectedOrder.status === "배송중" && idx <= 2) ||
                      (selectedOrder.status === "배송준비중" && idx <= 1) ||
                      (selectedOrder.status === "주문완료" && idx === 0);
                    const isCurrent = 
                      (selectedOrder.status === "주문완료" && idx === 0) ||
                      (selectedOrder.status === "배송준비중" && idx === 1) ||
                      (selectedOrder.status === "배송중" && idx === 2) ||
                      (selectedOrder.status === "배송완료" && idx === 3);

                    return (
                      <div key={stage.label} className="relative z-10 flex flex-col items-center">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                          isCurrent 
                            ? "bg-[#FED422] border-[#FED422] text-[#0F172A] scale-110 shadow-xs font-black"
                            : isPassed 
                            ? "bg-amber-100 border-amber-500 text-amber-900"
                            : "bg-white border-neutral-300 text-neutral-400"
                        }`}>
                          {isPassed && !isCurrent ? <Check size={12} /> : <span className="text-[10px] font-black">{idx + 1}</span>}
                        </div>
                        <span className={`text-[10px] font-black mt-2 ${isCurrent ? "text-[#0F172A]" : "text-neutral-500"}`}>{stage.label}</span>
                        <span className="text-[8px] text-neutral-400 font-bold mt-0.5">{stage.desc}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Items Table Card (Blue Accent) */}
              <div className="bg-white rounded-lg p-5 border border-neutral-200/90 shadow-2xs border-l-[5px] border-l-blue-500 space-y-3">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5">
                  <span className="text-xs font-black text-[#0F172A]">발주 자재 명세표</span>
                  <span className="text-[10px] font-mono font-bold text-neutral-400">신청 일자: {formatOrderDate(selectedOrder.date, (selectedOrder as any)._creationTime)}</span>
                </div>
                <div className="border border-neutral-200/90 rounded-md overflow-hidden bg-white shadow-2xs">
                  <div className="overflow-x-auto w-full [::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <table className="w-full text-left border-collapse min-w-[480px] sm:min-w-0" style={{ tableLayout: 'fixed' }}>
                      <colgroup>
                        <col style={{ width: 'auto' }} />
                        <col style={{ width: '50px' }} />
                        <col style={{ width: '72px' }} />
                        <col style={{ width: '82px' }} />
                      </colgroup>
                      <thead>
                        <tr className="bg-[#f8f9fa] border-b border-neutral-200/80 text-[10px] font-black text-neutral-400">
                          <th className="px-4 py-3">품목명</th>
                          <th className="px-2 py-3 text-center whitespace-nowrap">수량</th>
                          <th className="px-2 py-3 text-right whitespace-nowrap">단가</th>
                          <th className="px-4 py-3 text-right whitespace-nowrap">금액</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100 text-xs font-bold text-[#0F172A]">
                        {selectedOrder.items.map((item, idx) => (
                          <tr key={idx} className="hover:bg-neutral-50 transition-colors">
                            <td className="px-4 py-3 font-extrabold text-[#0F172A] leading-tight break-words text-xs" style={{ wordBreak: 'break-word' }}>
                              {item.productName}
                            </td>
                            <td className="px-2 py-3 text-center font-bold text-slate-600 text-xs">{item.quantity}</td>
                            <td className="px-2 py-3 text-right font-bold text-slate-400 text-xs">{(item.price).toLocaleString()}</td>
                            <td className="px-4 py-3 text-right font-black text-[#0F172A] text-xs">{(item.price * item.quantity).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Payment Summary Card (Emerald Accent) */}
              <div className="bg-white rounded-lg p-5 border border-neutral-200/90 shadow-2xs border-l-[5px] border-l-emerald-500 space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5">
                  <span className="text-xs font-black text-[#0F172A]">결제 및 정산 요약</span>
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[10px] font-mono font-black tracking-wider uppercase px-2.5 py-0.5 rounded-md">
                    PAYMENT
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-[#f8f9fa] p-4 rounded-md border border-neutral-200/80">
                  <div className="space-y-1">
                    <span className="text-xs text-neutral-400 font-extrabold block">결제 수단 정보</span>
                    <strong className="text-xs text-[#0F172A] block font-black">
                      {(selectedOrder as any).payMethod === "bank" ? "무통장입금" : "신용카드 결제"}
                    </strong>
                  </div>
                  <div className="text-left sm:text-right border-t sm:border-t-0 border-neutral-200 pt-3 sm:pt-0">
                    <span className="text-xs text-neutral-400 font-bold block">총 결제 금액 (VAT 포함)</span>
                    <strong className="text-lg font-black text-amber-500">{selectedOrder.totalPrice.toLocaleString()} 원</strong>
                  </div>
                </div>

                {/* 무통장입금 선택 시 계좌 입금 안내 추가 */}
                {((selectedOrder as any).payMethod === "bank" || selectedOrder.status === "입금대기") && (
                  <div className="bg-[#f8f9fa] border border-neutral-200/80 p-4 rounded-md space-y-2.5 text-xs">
                    <div className="flex justify-between items-center border-b border-neutral-200/80 pb-2">
                      <span className="font-black text-[#0F172A] flex items-center gap-1.5">
                        <Landmark size={14} className="text-amber-500" /> 무통장 입금 안내
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyToClipboard(`K뱅크 700-120-270001 (주)고우웰라이프 ${selectedOrder.totalPrice.toLocaleString()}원`, "전체 계좌 정보")}
                        className="text-[10px] text-[#0F172A] hover:bg-neutral-200 font-black flex items-center gap-1 cursor-pointer bg-white px-3 py-1 rounded-md transition-all border border-neutral-200"
                      >
                        <Copy size={10} /> 전체 복사
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600 font-bold text-xs">
                      <div className="flex justify-between items-center bg-white px-3 py-2 rounded-lg border border-neutral-200/60">
                        <span>은행 / 예금주</span>
                        <strong className="text-[#0F172A]">K뱅크 / (주)고우웰라이프</strong>
                      </div>
                      <div className="flex justify-between items-center bg-white px-3 py-2 rounded-lg border border-neutral-200/60">
                        <span>계좌번호</span>
                        <div className="flex items-center gap-1.5">
                          <strong className="text-[#0F172A] font-mono">700-120-270001</strong>
                          <button
                            type="button"
                            onClick={() => handleCopyToClipboard("700-120-270001", "계좌번호")}
                            className="p-1 hover:text-[#0F172A] text-slate-400 bg-neutral-100 rounded cursor-pointer border-0"
                            title="계좌 복사"
                          >
                            <Copy size={11} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Delivery Carrier Info Card (Slate Accent) */}
              <div className="bg-white rounded-lg p-5 border border-neutral-200/90 shadow-2xs border-l-[5px] border-l-slate-400 space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5">
                  <span className="font-black text-[#0F172A] flex items-center gap-1.5"><Truck size={16} className="text-slate-600" /> 배송 및 송장 정보</span>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-mono font-black ${
                    selectedOrder.status === "배송완료" ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : selectedOrder.status === "배송중" ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "bg-amber-50 text-amber-700 border border-amber-200"
                  }`}>{selectedOrder.status}</span>
                </div>

                {["배송중", "배송완료"].includes(selectedOrder.status) ? (
                  <div className="space-y-4 text-xs font-bold">
                    {/* 다중 송장 출력 */}
                    {(() => {
                      const trackingItems = selectedOrder.trackingList && selectedOrder.trackingList.length > 0
                        ? selectedOrder.trackingList
                        : (selectedOrder.courier && selectedOrder.trackingNo
                          ? [{ courier: selectedOrder.courier, trackingNo: selectedOrder.trackingNo }]
                          : []);

                      if (trackingItems.length === 0) {
                        return (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <span className="text-[10px] text-neutral-400 font-extrabold block">배송 수단 / 물류 방식</span>
                              <p className="text-[#0F172A] font-bold">
                                120 물류 전용 냉동 저온탑차 (한진택배 위탁)
                              </p>
                            </div>
                            <div className="space-y-1">
                              <span className="text-[10px] text-neutral-400 font-extrabold block">실시간 송장 번호</span>
                              <p className="font-mono text-[#0F172A] font-black">
                                {`HNJ-120-${selectedOrder.id.replace("ORD-", "")}`}
                              </p>
                            </div>
                            <div className="sm:col-span-2 pt-2 border-t border-neutral-100">
                              <button 
                                type="button"
                                onClick={() => {
                                  handleTrackingClick(
                                    "한진택배",
                                    `HNJ-120-${selectedOrder.id.replace("ORD-", "")}`,
                                    selectedOrder.id,
                                    selectedOrder.status,
                                    selectedOrder.date
                                  );
                                }}
                                className="w-full py-3 rounded-md bg-[#FED422] hover:bg-[#e5be1f] text-[#0F172A] text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer border-0 shadow-md active:scale-95"
                              >
                                배송 위치 실시간 조회하기 <ChevronRight size={14} />
                              </button>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div className="space-y-3">
                          <span className="text-xs text-neutral-400 font-black block mb-1">등록된 배송 송장 ({trackingItems.length}개)</span>
                          <div className="grid grid-cols-1 gap-3">
                            {trackingItems.map((item, idx) => (
                              <div key={idx} className="bg-[#f8f9fa] border border-neutral-200/80 rounded-md p-4 space-y-3 shadow-2xs">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <span className="px-2.5 py-0.5 rounded-md bg-[#0F172A] text-[9px] font-black text-white">
                                      {item.courier}
                                    </span>
                                    <span className="font-mono text-[#0F172A] font-black text-xs">{item.trackingNo}</span>
                                  </div>
                                </div>
                                <button 
                                  type="button"
                                  onClick={() => {
                                    handleTrackingClick(
                                      item.courier,
                                      item.trackingNo,
                                      selectedOrder.id,
                                      selectedOrder.status,
                                      selectedOrder.date
                                    );
                                  }}
                                  className="w-full py-2.5 rounded-md bg-[#FED422] hover:bg-[#e5be1f] text-[#0F172A] text-xs font-black transition-all flex items-center justify-center gap-1 cursor-pointer border-0 shadow-xs active:scale-95"
                                >
                                  배송 위치 실시간 조회하기 <ChevronRight size={14} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                ) : (
                  <p className="text-xs font-bold text-slate-500 leading-relaxed">
                    본사 발주 접수가 정상 처리되었습니다. 현재 물류 창고에서 파이 생지 신선도 보존용 드라이아이스 및 패키징 포장 작업 중입니다. 24시간 이내 저온 정기 배송 차량으로 안전하게 출고 및 발송 조치 예정입니다.
                  </p>
                )}
              </div>

              {/* Stage Flow Footer Bar */}
              <div className="px-1 py-2 flex items-center justify-between border-t border-neutral-200/60 pt-4">
                <div className="flex items-center gap-2 text-[10px] font-mono font-extrabold text-neutral-400 uppercase tracking-widest">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>ORDER RECORD</span>
                </div>
                <div className="flex items-center gap-3">
                  {["주문완료", "배송준비중", "대기"].includes(selectedOrder.status) && (
                    <button 
                      type="button"
                      onClick={() => cancelOrder(selectedOrder.id)}
                      className="px-5 py-2.5 rounded-md bg-rose-50 hover:bg-rose-100 text-xs font-black text-rose-600 transition-all cursor-pointer border border-rose-200 flex items-center gap-1.5"
                    >
                      <Trash2 size={14} />
                      주문 취소
                    </button>
                  )}
                  <button 
                    type="button"
                    onClick={() => closeModal(() => setSelectedOrder(null))}
                    className="px-6 py-2.5 rounded-md bg-[#FED422] hover:bg-[#e5be1f] text-xs font-black text-[#0F172A] transition-all cursor-pointer border-0 shadow-xs"
                  >
                    상세내역 창 닫기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5-2. Delivery Tracking Modal */}
      {trackingModalOpen && trackingInfo && (() => {
        let trackingData = getTrackingSteps(trackingInfo);
        
        // Dynamic integration with Dolly real-time carrier API if data is loaded
        if (apiTrackingData) {
          const stateMap: Record<string, { step: number; text: string }> = {
            "at_carrier": { step: 1, text: "터미널입고" },
            "in_transit": { step: 2, text: "대리점이동" },
            "out_for_delivery": { step: 3, text: "배송출발" },
            "delivered": { step: 4, text: "배송완료" }
          };
          
          const currentState = stateMap[apiTrackingData.state.id] || { step: 2, text: "배송중" };
          
          const rawSteps = [
            { title: "접수완료", desc: "본사 발주 승인 및 패키징", status: "completed" as const },
            { title: "터미널입고", desc: apiTrackingData.carrier.name + " 상품인수", status: (currentState.step >= 1 ? "completed" : "pending") as "completed" | "pending" | "current" },
            { title: "대리점도착", desc: "지역 터미널 도착", status: (currentState.step >= 2 ? "completed" : "pending") as "completed" | "pending" | "current" },
            { title: "배송출발", desc: "담당 기사님 배송 출발", status: (currentState.step >= 3 ? (currentState.step === 3 ? "current" : "completed") : "pending") as "completed" | "pending" | "current" },
            { title: "배송완료", desc: "고객 인도 완료", status: (currentState.step >= 4 ? "completed" : "pending") as "completed" | "pending" | "current" },
          ];

          const mappedCheckpoints = apiTrackingData.progresses.map((p: any) => {
            const dateObj = new Date(p.time);
            const timeStr = dateObj.toLocaleString('ko-KR', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            });
            return {
              time: timeStr,
              location: p.location.name || apiTrackingData.carrier.name,
              status: p.status.text,
              desc: p.description
            };
          });

          // Sort checkpoints in descending order (newest first)
          mappedCheckpoints.sort((a: any, b: any) => new Date(b.time).getTime() - new Date(a.time).getTime());

          trackingData = {
            currentStep: currentState.step,
            steps: rawSteps,
            checkpoints: mappedCheckpoints
          };
        }

        return (
          <div 
            className="fixed inset-0 z-[120] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
            onClick={() => {
              setTrackingModalOpen(false);
              setTrackingInfo(null);
            }}
          >
            <div 
              className="w-full max-w-2xl bg-white border-0 rounded-lg overflow-hidden shadow-2xl flex flex-col animate-scaleUp max-h-[85vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Yellow Header */}
              <div className="p-6 bg-[#F5AC00] text-[#0F172A] flex justify-between items-center shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#0F172A] rounded-md text-white">
                    <Truck size={20} />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-[#0F172A]">실시간 물류 배송 추적</h3>
                    <p className="text-xs text-[#0F172A]/70 font-bold mt-0.5">
                      콜드체인 신선 배송 시스템 연동 · {trackingInfo.courier}
                    </p>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={() => {
                    closeModal(() => {
                      setTrackingModalOpen(false);
                      setTrackingInfo(null);
                    });
                  }}
                  className="p-2 text-[#0F172A]/80 hover:text-[#0F172A] bg-black/5 hover:bg-black/10 rounded-md transition-all border-0 cursor-pointer shrink-0"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex flex-col flex-1 text-xs sm:text-sm min-h-[300px]">
                {apiTrackingLoading ? (
                  <div className="flex flex-col items-center justify-center space-y-4 text-center my-auto py-12 animate-fadeIn flex-1">
                    <div className="relative">
                      {/* Loading Spinner Ring */}
                      <div className="w-16 h-16 rounded-full border-4 border-slate-100 border-t-[#F5AC00] animate-spin"></div>
                      <Truck size={24} className="text-[#0F172A] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-bounce" />
                    </div>
                    <div>
                      <h4 className="font-black text-[#0F172A] text-sm">실시간 택배 전산망 연결 중</h4>
                      <p className="text-xs text-slate-500 font-bold mt-1.5 max-w-[320px] leading-relaxed">
                        {trackingInfo.courier} 서버에 다이렉트로 접속하여 기사님 위치 및 상세 이동 정보를 실시간으로 가져오는 중입니다. 잠시만 기다려주세요!
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Delivery Basic Specs */}
                    <div className="bg-[#F8FAFC] border-0 rounded-lg p-5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-bold">
                      <div>
                        <span className="text-[10px] text-slate-400 font-extrabold block">발주 코드</span>
                        <span className="font-mono text-[#0F172A] font-bold">{trackingInfo.orderId}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-extrabold block">운송장 번호</span>
                        <span className="font-mono text-[#0F172A] font-black">{trackingInfo.trackingNo}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-extrabold block">배송 수단</span>
                        <span className="text-[#0F172A]">{trackingInfo.courier}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-extrabold block">현재 상태</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                          trackingInfo.status === "배송완료" ? "bg-emerald-100 text-emerald-700"
                          : trackingInfo.status === "배송중" ? "bg-blue-100 text-blue-700"
                          : "bg-amber-100 text-amber-700"
                        }`}>{apiTrackingData ? apiTrackingData.state.text : trackingInfo.status}</span>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-xs font-black text-[#0F172A]">
                        <span>배송 진행 상태</span>
                        <span className="text-[#0F172A]">{Math.round((trackingData.currentStep / 4) * 100)}% 진행</span>
                      </div>

                      {/* Horizontal visual line */}
                      <div className="relative pt-4 pb-2">
                        <div className="absolute left-6 right-6 top-[28px] h-1.5 bg-slate-200 rounded-md z-0">
                          <div 
                            className="h-full bg-[#F5AC00] rounded-md transition-all duration-1000"
                            style={{ width: `${(trackingData.currentStep / 4) * 100}%` }}
                          ></div>
                        </div>

                        <div className="relative z-10 flex justify-between">
                          {trackingData.steps.map((step, idx) => {
                            const isCompleted = idx < trackingData.currentStep;
                            const isCurrent = idx === trackingData.currentStep;
                            return (
                              <div key={idx} className="flex flex-col items-center text-center space-y-1.5 flex-1">
                                <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                                  isCompleted ? "bg-[#F5AC00] border-[#F5AC00] text-[#0F172A] font-black shadow-xs"
                                  : isCurrent ? "bg-white border-[#F5AC00] text-[#0F172A] scale-110 ring-4 ring-amber-100 font-black"
                                  : "bg-white border-slate-300 text-slate-400"
                                }`}>
                                  {isCompleted ? <Check size={12} className="stroke-[3]" /> : <span className="text-[10px] font-black">{idx + 1}</span>}
                                </div>
                                <span className={`text-[10px] font-black ${
                                  isCompleted || isCurrent ? "text-[#0F172A]" : "text-slate-400"
                                }`}>{step.title}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Friendly Notice Box */}
                    <div className="p-4 bg-[#F8FAFC] border-0 rounded-lg text-xs font-bold text-slate-600 leading-relaxed flex gap-2.5">
                      <div className="text-base shrink-0">📢</div>
                      <p>
                        본 물류 정보는 {apiTrackingData ? <strong>{trackingInfo.courier} 공식 서버망</strong> : <strong>120콜드체인 실시간 관제 시스템</strong>}과 100% 연동된 신뢰할 수 있는 실시간 데이터입니다. 신선 파이 생지 및 원재료의 최상 신선도를 위해 <strong>영하 18도의 친환경 초저온 차량</strong>으로 안전하게 이송되고 있으니 편히 안심하셔도 좋습니다.
                      </p>
                    </div>

                    {/* Checkpoints */}
                    <div className="space-y-3">
                      <h4 className="font-black text-[#0F172A] flex items-center gap-1.5"><ClipboardList size={16} className="text-[#F5AC00]" /> 시간대별 배송 현황</h4>
                      <div className="relative border-l-2 border-slate-200 ml-2.5 pl-4 space-y-5 py-1">
                        {trackingData.checkpoints.map((cp, idx) => {
                          const isFirst = idx === 0;
                          return (
                            <div key={idx} className="relative">
                              {/* Dot on line */}
                              <div className={`absolute -left-[21px] top-1.5 w-3 h-3 rounded-full border-2 ${
                                isFirst ? "bg-[#F5AC00] border-white ring-4 ring-amber-100" : "bg-white border-slate-300"
                              }`} />
                              
                              <div className="space-y-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="text-[10px] font-mono text-slate-400 font-bold">{cp.time}</span>
                                  <span className="text-[10px] text-[#0F172A] font-black bg-[#F8FAFC] px-2 py-0.5 rounded-md">
                                    {cp.location}
                                  </span>
                                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                                    cp.status === "배송완료" || cp.status === "배달완료" ? "bg-emerald-100 text-emerald-700"
                                    : cp.status === "배송출발" || cp.status === "배송출고" ? "bg-blue-100 text-blue-700"
                                    : "bg-slate-100 text-slate-600"
                                  }`}>{cp.status}</span>
                                </div>
                                <p className="text-xs font-bold text-[#0F172A] leading-relaxed pl-0.5">
                                  {cp.desc}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-slate-100 bg-[#F8FAFC] flex gap-3">
                <button 
                  type="button"
                  onClick={() => {
                    const urlMap: Record<string, string> = {
                      "CJ대한통운": `https://www.doortodoor.co.kr/tracking/jsp/cmn/Tracking_auto.jsp?QueryNum=${trackingInfo.trackingNo}`,
                      "우체국택배": `https://service.epost.go.kr/trace.RetrieveDomconsortObscl.postal?sid1=${trackingInfo.trackingNo}`,
                      "한진택배": `https://www.hanjin.com/ko/delivery/delivery/tracking.do?wblnum=${trackingInfo.trackingNo}`,
                      "롯데택배": `https://www.lotteglogis.com/home/reservation/tracking/linkTracking?InvNo=${trackingInfo.trackingNo}`,
                      "로젠택배": `https://www.ilogen.com/web/personal/trace/${trackingInfo.trackingNo}`,
                    };
                    const url = urlMap[trackingInfo.courier] || `https://www.hanjin.com/ko/delivery/delivery/tracking.do?wblnum=${trackingInfo.trackingNo}`;
                    window.open(url, "_blank");
                  }}
                  className="flex-1 py-2.5 rounded-md bg-white hover:bg-slate-100 text-xs font-bold text-slate-700 transition-all cursor-pointer border-0 flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <ExternalLink size={14} /> 공식 택배사에서 확인하기
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    closeModal(() => {
                      setTrackingModalOpen(false);
                      setTrackingInfo(null);
                    });
                  }}
                  className="px-8 py-2.5 rounded-md bg-[#FED422] hover:bg-[#e6be1f] text-[#0F172A] text-xs font-black shadow-md transition-all cursor-pointer border-0"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* 6. Product Details Modal (Yellow Header, border-0, Clean Style) */}
      {selectedProductDetail && (
        <div 
          className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSelectedProductDetail(null)}
        >
          <div 
            className="w-full max-w-3xl bg-white border-0 rounded-lg overflow-hidden shadow-2xl max-h-[85vh] flex flex-col animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Yellow Header */}
            <div className="p-6 bg-[#FED422] text-[#0F172A] flex justify-between items-center shadow-xs">
              <div className="flex-1">
                <h3 className="text-base sm:text-lg font-black text-[#0F172A] flex items-center gap-2">
                  <span className="bg-[#0F172A] text-white text-[10px] font-black px-2.5 py-0.5 rounded-md">
                    {selectedProductDetail.category}
                  </span>
                  <span>{selectedProductDetail.name} 상세 정보</span>
                </h3>
              </div>
              <button 
                type="button"
                onClick={() => closeModal(() => setSelectedProductDetail(null))} 
                className="p-2 text-[#0F172A]/80 hover:text-[#0F172A] bg-black/5 hover:bg-black/10 rounded-md transition-all border-0 cursor-pointer shrink-0 ml-4"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
              
              {/* Product Core Info: Thumbnail & Spec Table */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                {/* 1. Thumbnail Image */}
                <div className="md:col-span-5 border border-[#EEF0F5] rounded-lg overflow-hidden shadow-2xs bg-white aspect-square flex items-center justify-center relative w-full">
                  <img 
                    src={optimizeCloudinaryUrl(selectedProductDetail.img)} 
                    alt={selectedProductDetail.name} 
                    className="w-full h-full object-contain p-4"
                  />
                  {selectedProductDetail.labels && selectedProductDetail.labels.length > 0 && (
                    <div className="absolute top-4 right-4 flex flex-wrap gap-1 w-fit justify-end">
                      {selectedProductDetail.labels.map((l: string) => {
                        let bgStyle = "bg-slate-700 text-white";
                        if (l === "BEST") bgStyle = "bg-[#F5AC00] text-[#0F172A] font-black";
                        else if (l === "추천") bgStyle = "bg-indigo-600 text-white font-black";
                        else if (l === "신제품") bgStyle = "bg-emerald-600 text-white font-black";
                        return (
                          <span key={l} className={`font-bold text-[9px] px-2.5 py-0.5 rounded-full shadow-2xs ${bgStyle}`}>
                            {l}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 2. Spec Table */}
                <div className="md:col-span-7 bg-white border-0 rounded-lg overflow-hidden shadow-2xs flex flex-col w-full">
                  <div className="px-5 py-3.5 bg-[#F8FAFC] border-b border-slate-100 shrink-0">
                    <span className="font-black text-[#0F172A] text-xs">품목 기본 명세 규격표</span>
                  </div>
                  <table className="w-full text-left border-collapse table-fixed">
                    <tbody className="divide-y divide-slate-100 text-xs text-[#0F172A] font-bold">
                      <tr className="hover:bg-[#F8FAFC]/50 transition-colors">
                        <td className="px-4 py-3 bg-[#F8FAFC] font-extrabold text-slate-400 w-[100px]">제품명</td>
                        <td className="px-4 py-3 font-extrabold text-[#0F172A] break-all">{selectedProductDetail.name}</td>
                      </tr>
                      <tr className="hover:bg-[#F8FAFC]/50 transition-colors">
                        <td className="px-4 py-3 bg-[#F8FAFC] font-extrabold text-slate-400">카테고리</td>
                        <td className="px-4 py-3">
                          <span className="bg-[#0F172A] text-white text-[10px] font-black px-2.5 py-0.5 rounded-md">
                            {selectedProductDetail.category}
                          </span>
                        </td>
                      </tr>
                      <tr className="hover:bg-[#F8FAFC]/50 transition-colors">
                        <td className="px-4 py-3 bg-[#F8FAFC] font-extrabold text-slate-400">발주 규격</td>
                        <td className="px-4 py-3 font-black text-[#0F172A]">{selectedProductDetail.packSize}</td>
                      </tr>
                      <tr className="hover:bg-[#F8FAFC]/50 transition-colors">
                        <td className="px-4 py-3 bg-[#F8FAFC] font-extrabold text-slate-400">제품 식별코드</td>
                        <td className="px-4 py-3 font-mono font-bold text-slate-500">{selectedProductDetail.id}</td>
                      </tr>
                      <tr className="hover:bg-[#F8FAFC]/50 transition-colors">
                        <td className="px-4 py-3 bg-[#F8FAFC] font-extrabold text-slate-400">공급 단가</td>
                        <td className="px-4 py-3 font-black text-[#0F172A]">{selectedProductDetail.price.toLocaleString()} 원</td>
                      </tr>
                      <tr className="hover:bg-[#F8FAFC]/50 transition-colors">
                        <td className="px-4 py-3 bg-[#F8FAFC] font-extrabold text-slate-400">배송 정책</td>
                        <td className="px-4 py-3">
                          {(() => {
                            const type = selectedProductDetail.shippingType || "A";
                            if (type === "free") {
                              return (
                                <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black px-2.5 py-0.5 rounded-md">
                                  무료 배송
                                </span>
                              );
                            }
                            if (type === "BOX") {
                              return (
                                <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-2.5 py-0.5 rounded-md">
                                  BOX타입 (10개당 {shippingFeeBox?.toLocaleString()}원)
                                </span>
                              );
                            }
                            const feeMap: Record<string, number> = { A: shippingFeeA, B: shippingFeeB, C: shippingFeeC };
                            return (
                              <span className="bg-slate-100 text-slate-700 text-[10px] font-black px-2.5 py-0.5 rounded-md">
                                {type}타입 ({feeMap[type]?.toLocaleString()}원)
                              </span>
                            );
                          })()}
                        </td>
                      </tr>
                      <tr className="hover:bg-[#F8FAFC]/50 transition-colors">
                        <td className="px-4 py-3 bg-[#F8FAFC] font-extrabold text-slate-400">품목 정보 설명</td>
                        <td className="px-4 py-3 font-bold text-slate-600 leading-relaxed break-words">{selectedProductDetail.desc || "등록된 상세 설명이 없습니다."}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 3. Detailed Page (If available) */}
              {(selectedProductDetail.detailImg || selectedProductDetail.detailText) && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                    <span className="w-2 h-4 rounded-md bg-[#F5AC00]"></span>
                    <span className="font-black text-[#0F172A] text-xs sm:text-sm">🔍 제품 상세 정보 안내</span>
                  </div>
                  
                  {/* Rich Text / HTML Description */}
                  {selectedProductDetail.detailText && (
                    <div className="space-y-1">
                      <style>{`
                        .rich-content-view ul {
                          list-style-type: disc !important;
                          padding-left: 1.5rem !important;
                          margin: 0.5rem 0 !important;
                        }
                        .rich-content-view ol {
                          list-style-type: decimal !important;
                          padding-left: 1.5rem !important;
                          margin: 0.5rem 0 !important;
                        }
                        .rich-content-view font[size="1"] { font-size: 10px !important; }
                        .rich-content-view font[size="2"] { font-size: 12px !important; }
                        .rich-content-view font[size="3"] { font-size: 14px !important; }
                        .rich-content-view font[size="4"] { font-size: 16px !important; }
                        .rich-content-view font[size="5"] { font-size: 18px !important; }
                        .rich-content-view font[size="6"] { font-size: 24px !important; }
                      `}</style>
                      <div 
                        className="border-0 rounded-lg p-6 bg-[#F8FAFC] shadow-2xs text-xs sm:text-sm text-[#0F172A] leading-relaxed whitespace-normal break-words overflow-x-auto min-h-[80px] rich-content-view"
                        dangerouslySetInnerHTML={{ __html: selectedProductDetail.detailText }}
                      />
                    </div>
                  )}

                  {/* Detail Image */}
                  {selectedProductDetail.detailImg && (
                    <div className="border-0 rounded-lg overflow-hidden shadow-2xs bg-[#F8FAFC] flex items-center justify-center p-3 min-h-[200px]">
                      <img 
                        src={optimizeCloudinaryUrl(selectedProductDetail.detailImg)} 
                        alt={`${selectedProductDetail.name} 상세페이지`} 
                        className="w-full h-auto object-contain rounded-md"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Delivery and Return Policy Pastels Cards */}
              <div className="flex flex-col gap-4">
                
                {/* Delivery policy card */}
                <div className="bg-[#F8FAFC] border-0 rounded-lg p-6 space-y-3.5 shadow-2xs">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                    <Truck size={18} className="text-[#F5AC00]" />
                    <span className="font-black text-[#0F172A] text-sm">🚚 본사 물류 배송 정책</span>
                  </div>
                  <div className="text-xs text-slate-600 font-bold leading-relaxed space-y-3">
                    <p className="whitespace-pre-line">{shippingPolicy || "본사 물류 전용 저온 냉동 탑차로 안전하게 직배송됩니다."}</p>
                    
                    <div className="pt-3 border-t border-slate-200">
                      <div className="text-xs text-[#0F172A] font-black flex items-center gap-1.5">
                        <span>💡</span>
                        <span>배송비 안내: 일반 품목(A/B/C)은 품목별 최고가가 1회 부과되며, BOX 품목은 10개당 설정된 요금이 합산 부과됩니다.</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Return policy card */}
                <div className="bg-[#F8FAFC] border-0 rounded-lg p-6 space-y-3.5 shadow-2xs">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                    <ArrowRightLeft size={18} className="text-[#F5AC00]" />
                    <span className="font-black text-[#0F172A] text-sm">🔄 교환 및 반품 규정 안내</span>
                  </div>
                  <div className="text-xs text-slate-600 font-bold leading-relaxed whitespace-pre-line">
                    {returnPolicy || "식재료 특성상 단순 변심으로 인한 반품은 불가하며, 오배송 건은 수령 즉시 본사 접수 바랍니다."}
                  </div>
                </div>

              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-100 bg-[#F8FAFC] flex flex-col gap-4">
              {/* Option / Quantity Control Area */}
              <div className="flex flex-col gap-3">
                {selectedProductDetail.options && selectedProductDetail.options.length > 0 ? (
                  <div className="space-y-3">
                    {/* Option Select Dropdown & Add Button */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-[#0F172A] text-xs shrink-0">옵션 선택 *</span>
                      <select
                        value={selectedProductOption}
                        onChange={(e) => setSelectedProductOption(e.target.value)}
                        className="flex-1 max-w-xs bg-[#F1F5F9] border-0 rounded-lg px-4 py-2.5 text-xs font-bold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#F5AC00]/50 cursor-pointer"
                      >
                        <option value="">-- 필수 옵션을 선택하세요 --</option>
                        {selectedProductDetail.options.map((opt: string) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => {
                          if (!selectedProductOption) {
                            showCustomAlert("옵션 선택", "옵션을 먼저 선택해 주세요.");
                            return;
                          }
                          const exists = localSelectedOptions.find((o) => o.optionName === selectedProductOption);
                          if (exists) {
                            setLocalSelectedOptions(
                              localSelectedOptions.map((o) =>
                                o.optionName === selectedProductOption ? { ...o, quantity: o.quantity + 1 } : o
                              )
                            );
                            triggerToast(`'${selectedProductOption}' 옵션의 수량을 1개 추가했습니다.`);
                          } else {
                            setLocalSelectedOptions([...localSelectedOptions, { optionName: selectedProductOption, quantity: 1 }]);
                            triggerToast(`'${selectedProductOption}' 옵션을 추가했습니다.`);
                          }
                          setSelectedProductOption(""); // Reset select choice
                        }}
                        className="px-5 py-2.5 rounded-md bg-[#F5AC00] hover:bg-[#E69D00] text-[#0F172A] text-xs font-black transition-all shadow-md border-0 cursor-pointer"
                      >
                        옵션 추가
                      </button>
                    </div>

                    {/* Selected Options List */}
                    {localSelectedOptions.length > 0 && (
                      <div className="bg-white border-0 rounded-lg p-4 space-y-2.5 max-h-[160px] overflow-y-auto shadow-2xs">
                        <span className="text-[10px] text-slate-400 font-black block uppercase tracking-wider">선택된 옵션 목록</span>
                        {localSelectedOptions.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between gap-3 bg-[#F8FAFC] border-0 p-3 rounded-md text-xs font-bold text-[#0F172A]">
                            <span className="truncate flex-1 pr-2">{item.optionName}</span>
                            <div className="flex items-center gap-3 shrink-0">
                              {/* Option Qty Controller */}
                              <div className="flex items-center bg-white rounded-md p-1 border-0 shadow-2xs">
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (item.quantity <= 1) return;
                                    setLocalSelectedOptions(
                                      localSelectedOptions.map((o) =>
                                        o.optionName === item.optionName ? { ...o, quantity: o.quantity - 1 } : o
                                      )
                                    );
                                  }}
                                  className="p-1 hover:text-[#0F172A] text-slate-400 transition-colors border-0"
                                >
                                  <Minus size={12} />
                                </button>
                                <span className="px-2 text-xs font-black text-[#0F172A] w-5 text-center">{item.quantity}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setLocalSelectedOptions(
                                      localSelectedOptions.map((o) =>
                                        o.optionName === item.optionName ? { ...o, quantity: o.quantity + 1 } : o
                                      )
                                    );
                                  }}
                                  className="p-1 hover:text-[#0F172A] text-slate-400 transition-colors border-0"
                                >
                                  <Plus size={12} />
                                </button>
                              </div>
                              {/* Remove Option Button */}
                              <button
                                type="button"
                                onClick={() => {
                                  setLocalSelectedOptions(localSelectedOptions.filter((o) => o.optionName !== item.optionName));
                                  triggerToast(`'${item.optionName}' 옵션을 목록에서 제거했습니다.`);
                                }}
                                className="text-slate-400 hover:text-rose-600 transition-colors p-1 border-0"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  /* Optionless Qty Controller */
                  <div className="flex items-center gap-3">
                    <span className="font-extrabold text-[#0F172A] text-xs shrink-0">발주 수량 설정</span>
                    <div className="flex items-center bg-white rounded-md p-1.5 border-0 shadow-2xs">
                      <button
                        type="button"
                        onClick={() => {
                          if (localSingleQty <= 1) return;
                          setLocalSingleQty(localSingleQty - 1);
                        }}
                        className="p-1 hover:text-[#0F172A] text-slate-400 transition-colors border-0"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="px-4 text-xs font-black text-[#0F172A] w-8 text-center">{localSingleQty}</span>
                      <button
                        type="button"
                        onClick={() => setLocalSingleQty(localSingleQty + 1)}
                        className="p-1 hover:text-[#0F172A] text-slate-400 transition-colors border-0"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-slate-200">
                <span className="text-xs font-bold text-slate-400 hidden sm:inline">
                  발주 규격을 다시 한 번 정밀 확인 후 신중히 진행해 주세요.
                </span>
                <div className="flex items-center gap-2 self-end sm:self-auto w-full sm:w-auto">
                  {selectedProductDetail.stock === "out_of_stock" ? (
                    <button
                      type="button"
                      disabled
                      className="flex-1 sm:flex-none px-7 py-3 rounded-md bg-slate-200 text-slate-400 text-xs font-black transition-all cursor-not-allowed flex items-center justify-center gap-1.5 border-0"
                    >
                      일시품절 (주문 불가)
                    </button>
                  ) : (
                    <button 
                      type="button"
                      onClick={() => {
                        const hasOpts = selectedProductDetail.options && selectedProductDetail.options.length > 0;
                        if (hasOpts) {
                          if (localSelectedOptions.length === 0) {
                            showCustomAlert("옵션 선택", "옵션을 최소 하나 이상 목록에 추가해 주세요.");
                            return;
                          }
                          localSelectedOptions.forEach((item) => {
                            addToCart(selectedProductDetail.id, item.optionName, item.quantity);
                          });
                        } else {
                          addToCart(selectedProductDetail.id, undefined, localSingleQty);
                        }
                        closeModal(() => setSelectedProductDetail(null));
                      }}
                      className="flex-1 sm:flex-none px-8 py-3 rounded-md bg-[#FED422] hover:bg-[#e5be1f] text-[#0F172A] text-xs font-black transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5 border-0"
                    >
                      <ShoppingBag size={16} />
                      장바구니 담기
                    </button>
                  )}
                  <button 
                    type="button"
                    onClick={() => closeModal(() => setSelectedProductDetail(null))}
                    className="px-7 py-3 rounded-md bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-all cursor-pointer border-0"
                  >
                    닫기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 발주 장바구니 상세 및 결제 모달 (Yellow Header, border-0, Clean Style) */}
      {showCheckoutModal && (
        <div 
          className="fixed inset-0 z-[110] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setShowCheckoutModal(false)}
        >
          <div 
            className="w-full max-w-4xl bg-white border-0 rounded-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Yellow Header */}
            <div className="p-6 bg-[#FED422] text-[#0F172A] flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2.5">
                <ShoppingBag size={20} className="text-[#0F172A]" />
                <h4 className="text-base sm:text-lg font-black text-[#0F172A]">
                  발주 장바구니 및 결제 ({cart.reduce((sum, item) => sum + item.quantity, 0)}개)
                </h4>
              </div>
              <div className="flex items-center gap-2">
                {cart.length > 0 && (
                  <button 
                    type="button"
                    onClick={() => {
                      clearCart();
                      setShowCheckoutModal(false);
                    }} 
                    className="text-xs font-black text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-1 cursor-pointer bg-white px-3 py-1.5 rounded-md border-0 shadow-2xs"
                  >
                    <Trash2 size={13} /> 비우기
                  </button>
                )}
                <button 
                  type="button"
                  onClick={() => setShowCheckoutModal(false)} 
                  className="p-2 text-[#0F172A]/80 hover:text-[#0F172A] bg-black/5 hover:bg-black/10 rounded-md transition-all border-0 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8">
              {cart.length === 0 ? (
                <div className="py-20 text-center space-y-3">
                  <ShoppingBag size={48} className="text-slate-300 mx-auto" />
                  <p className="text-sm text-slate-500 font-black">
                    장바구니가 비어 있습니다.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left Column: Items List & Address & Payment */}
                  <div className="lg:col-span-7 space-y-6">
                    
                    {/* 1. 발주 품목 확인 */}
                    <div className="space-y-3">
                      <span className="font-black text-xs text-[#0F172A] flex items-center gap-1.5 border-b border-slate-100 pb-2">
                        <CheckCircle2 size={16} className="text-[#FED422]" /> 발주 품목 확인
                      </span>
                      
                      <div className="space-y-3 pr-1">
                        {groupedCartItems.map(([typeKey, group]) => (
                          <div key={typeKey} className="space-y-2">
                            <div className="flex justify-between items-center bg-[#F8FAFC] px-3 py-1.5 rounded-md border-0 select-none">
                              <span className="font-black text-xs text-[#0F172A]">{group.title}</span>
                              {group.feeLabel && (
                                <span className="text-[10px] text-slate-500 font-bold">
                                  배송비: {group.feeLabel}
                                </span>
                              )}
                            </div>
                            
                            <div className="space-y-2">
                              {group.items.map((item) => {
                                const p = (products || []).find((prod) => prod.id === item.productId);
                                if (!p) return null;
                                return (
                                  <div key={`${item.productId}-${item.selectedOption || ""}`} className="flex gap-3 justify-between items-center bg-white border-0 shadow-2xs p-3 rounded-lg">
                                    <img src={optimizeCloudinaryUrl(p.img)} alt="" className="w-12 h-12 rounded-md object-cover shrink-0" />
                                    <div className="flex-1 min-w-0">
                                      <h4 className="font-black text-xs text-[#0F172A] truncate">{p.name}</h4>
                                      {item.selectedOption && (
                                        <span className="text-[10px] text-slate-500 font-bold block mt-0.5 select-none">
                                          [옵션: {item.selectedOption}]
                                        </span>
                                      )}
                                      <span className="text-[10px] text-slate-400 font-bold block mt-0.5">{p.price.toLocaleString()} 원 · {p.packSize}</span>
                                    </div>
                                    <div className="flex flex-col items-end gap-2 shrink-0">
                                      <button 
                                        type="button"
                                        onClick={() => removeCartItem(p.id, item.selectedOption)} 
                                        className="text-slate-400 hover:text-rose-600 transition-colors p-0.5 cursor-pointer border-0" 
                                        aria-label="삭제"
                                      >
                                        <X size={14} />
                                      </button>
                                      <div className="flex items-center bg-[#F8FAFC] rounded-md p-1 border-0">
                                        <button 
                                          type="button"
                                          onClick={() => updateCartQty(p.id, item.selectedOption, item.quantity - 1)} 
                                          className="p-1 hover:text-[#0F172A] text-slate-400 transition-colors cursor-pointer border-0"
                                        >
                                          <Minus size={10} />
                                        </button>
                                        <span className="px-2 text-xs font-black text-[#0F172A] w-5 text-center">{item.quantity}</span>
                                        <button 
                                          type="button"
                                          onClick={() => updateCartQty(p.id, item.selectedOption, item.quantity + 1)} 
                                          className="p-1 hover:text-[#0F172A] text-slate-400 transition-colors cursor-pointer border-0"
                                        >
                                          <Plus size={10} />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 2. 배송지 정보 입력 */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2">
                        <MapPin size={16} className="text-[#FED422] shrink-0" />
                        <span className="font-black text-xs text-[#0F172A]">배송지 정보 입력</span>
                        <span className="text-[10px] text-slate-400 font-bold ml-auto bg-[#F8FAFC] px-2.5 py-0.5 rounded-md select-none">
                          기본 주소지 정보 자동 입력됨
                        </span>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs font-extrabold text-[#0F172A] block mb-1">배송지 주소 (도로명)</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={deliveryAddress}
                              onChange={(e) => setDeliveryAddress(e.target.value)}
                              placeholder="도로명 주소를 검색 또는 직접 입력하세요"
                              className="flex-1 px-4 py-3 text-xs font-bold border-0 rounded-lg bg-[#F1F5F9] text-[#0F172A] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FED422]/50"
                            />
                            <button
                              type="button"
                              onClick={() => openDaumPostcode("delivery")}
                              className="px-5 py-3 bg-[#FED422] hover:bg-[#e5be1f] text-[#0F172A] text-xs font-black rounded-md transition-all cursor-pointer border-0 shrink-0 shadow-md"
                            >
                              주소 검색
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-extrabold text-[#0F172A] block mb-1">상세 주소</label>
                          <input
                            type="text"
                            value={deliveryDetailAddress}
                            onChange={(e) => setDeliveryDetailAddress(e.target.value)}
                            placeholder="상세 주소 (동/호수/층 등)"
                            className="w-full px-4 py-3 text-xs font-bold border-0 rounded-lg bg-[#F1F5F9] text-[#0F172A] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FED422]/50"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-extrabold text-[#0F172A] block mb-1">받는 사람</label>
                            <input
                              type="text"
                              value={recipientName}
                              onChange={(e) => setRecipientName(e.target.value)}
                              placeholder="수령인 이름"
                              className="w-full px-4 py-3 text-xs font-bold border-0 rounded-lg bg-[#F1F5F9] text-[#0F172A] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FED422]/50"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-extrabold text-[#0F172A] block mb-1">연락처</label>
                            <input
                              type="tel"
                              value={recipientPhone}
                              onChange={(e) => setRecipientPhone(formatPhoneNumber(e.target.value))}
                              placeholder="010-0000-0000"
                              className="w-full px-4 py-3 text-xs font-bold border-0 rounded-lg bg-[#F1F5F9] text-[#0F172A] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FED422]/50"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Right Column: Payment Method & Totals & Action */}
                  <div className="lg:col-span-5 space-y-6">
                    
                    {/* 3. 결제 수단 선택 */}
                    <div className="space-y-3">
                      <span className="font-black text-xs text-[#0F172A] flex items-center gap-1.5 border-b border-slate-100 pb-2">
                        <CreditCard size={16} className="text-[#FED422]" /> 결제 수단 선택
                      </span>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setOrderPayMethod("card")}
                          className={`flex items-center justify-center gap-2 py-3.5 rounded-lg border-0 text-xs font-black transition-all cursor-pointer ${
                            orderPayMethod === "card"
                              ? "bg-[#FED422] text-[#0F172A] shadow-md"
                              : "bg-[#F8FAFC] text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          <CreditCard size={16} />
                          신용카드
                        </button>
                        <button
                          type="button"
                          onClick={() => setOrderPayMethod("bank")}
                          className={`flex items-center justify-center gap-2 py-3.5 rounded-lg border-0 text-xs font-black transition-all cursor-pointer ${
                            orderPayMethod === "bank"
                              ? "bg-[#FED422] text-[#0F172A] shadow-md"
                              : "bg-[#F8FAFC] text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          <Landmark size={16} />
                          무통장입금
                        </button>
                      </div>

                      {/* 무통장입금 정보 박스 */}
                      {orderPayMethod === "bank" && (
                        <div className="bg-[#F8FAFC] border-0 p-5 rounded-lg space-y-3 animate-fadeIn text-xs">
                          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                            <span className="font-black text-[#0F172A] flex items-center gap-1">
                              <Landmark size={14} className="text-[#FED422]" /> 입금 계좌 정보
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopyToClipboard(`K뱅크 700-120-270001 (주)고우웰라이프 ${cartTotal.toLocaleString()}원`, "전체 계좌 정보")}
                              className="text-[10px] text-[#0F172A] font-black flex items-center gap-1 cursor-pointer bg-white px-2.5 py-1 rounded-md border-0 shadow-2xs hover:bg-[#FED422]"
                            >
                              <Copy size={11} /> 전체 복사
                            </button>
                          </div>
                          <div className="space-y-2 text-slate-600 font-bold">
                            <div className="flex justify-between items-center bg-white px-3.5 py-2.5 rounded-md border-0 shadow-2xs">
                              <div>
                                <span className="block text-[9px] text-slate-400 font-extrabold">은행 / 예금주</span>
                                <span className="text-xs font-black text-[#0F172A]">K뱅크 / (주)고우웰라이프</span>
                              </div>
                            </div>
                            <div className="flex justify-between items-center bg-white px-3.5 py-2.5 rounded-md border-0 shadow-2xs">
                              <div>
                                <span className="block text-[9px] text-slate-400 font-extrabold">계좌번호</span>
                                <span className="text-xs font-mono font-black text-[#0F172A]">700-120-270001</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleCopyToClipboard("700-120-270001", "계좌번호")}
                                className="p-1.5 hover:text-[#0F172A] text-slate-400 bg-[#F8FAFC] rounded-lg shrink-0 cursor-pointer transition-all border-0"
                                title="계좌번호 복사"
                              >
                                <Copy size={12} />
                              </button>
                            </div>
                            <div className="flex justify-between items-center bg-white px-3.5 py-2.5 rounded-md border-0 shadow-2xs">
                              <div>
                                <span className="block text-[9px] text-slate-400 font-extrabold">입금 금액</span>
                                <span className="text-xs font-black text-[#0F172A]">{cartTotal.toLocaleString()} 원</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleCopyToClipboard(String(cartTotal), "입금 금액")}
                                className="p-1.5 hover:text-[#0F172A] text-slate-400 bg-[#F8FAFC] rounded-lg shrink-0 cursor-pointer transition-all border-0"
                                title="금액 복사"
                              >
                                <Copy size={12} />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 4. 최종 결제 내역 확인 */}
                    <div className="bg-[#F8FAFC] border-0 rounded-lg p-6 space-y-5">
                      <span className="font-black text-xs text-[#0F172A] flex items-center gap-1.5 border-b border-slate-200 pb-2 select-none">
                        <CheckCircle2 size={16} className="text-[#FED422]" /> 최종 금액 확인
                      </span>
                      
                      <div className="space-y-3 text-xs">
                        <div className="flex justify-between text-slate-600 font-bold">
                          <span>상품 합계</span>
                          <span>{cartSubtotal.toLocaleString()} 원</span>
                        </div>
                        <div className="flex justify-between text-slate-600 font-bold">
                          <div className="flex flex-col">
                            <span>배송비</span>
                            {shippingFee > 0 && (
                              <span className="text-[10px] text-slate-400 font-bold">({shippingTypeLabel} 적용)</span>
                            )}
                          </div>
                          <span>{shippingFee === 0 ? "무료" : `${shippingFee.toLocaleString()} 원`}</span>
                        </div>
                        <div className="flex justify-between text-[#0F172A] font-black text-base border-t border-slate-200 pt-3">
                          <span>최종 발주 금액</span>
                          <span>{cartTotal.toLocaleString()} 원</span>
                        </div>
                      </div>

                      {/* Pay Button */}
                      <button 
                        type="button"
                        onClick={() => {
                          if (!deliveryAddress.trim()) {
                            showCustomAlert("발주 불가", "배송지 주소(도로명)를 입력해 주세요.");
                            return;
                          }
                          if (!recipientName.trim()) {
                            showCustomAlert("발주 불가", "받는 사람 이름을 입력해 주세요.");
                            return;
                          }
                          if (!recipientPhone.trim()) {
                            showCustomAlert("발주 불가", "받는 사람 연락처를 입력해 주세요.");
                            return;
                          }
                          
                          placeOrder();
                          setShowCheckoutModal(false);
                        }}
                        className="w-full py-4 bg-[#FED422] hover:bg-[#e5be1f] text-[#0F172A] text-sm font-black rounded-md transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer border-0 mt-2"
                      >
                        <CheckCircle2 size={18} />
                        {orderPayMethod === "card" ? "최종 결제 진행" : "발주 신청 완료 (무통장입금)"}
                      </button>
                    </div>

                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          REAL-TIME POPUP MODAL (ON-ENTRY)
         ========================================== */}
      {/* 실시간 팝업 모달 (Yellow Header, border-0, Clean Style) */}
      {showPopup && popupSettings && (
        <div className="fixed inset-0 z-[120] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div 
            className="w-full max-w-md bg-white border-0 rounded-lg overflow-hidden shadow-2xl flex flex-col relative max-h-[85vh] animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header / Background visual */}
            <div 
              className={`w-full relative flex flex-col justify-end p-6 text-white ${
                popupSettings.image ? "aspect-[4/3]" : "min-h-[160px]"
              } ${
                popupSettings.image ? "" : "bg-[#F5AC00]"
              }`}
              style={popupSettings.image ? {
                backgroundImage: `url(${optimizeCloudinaryUrl(popupSettings.image)})`,
                backgroundSize: "cover",
                backgroundPosition: "center"
              } : undefined}
            >
              {popupSettings.image && <div className="absolute inset-x-0 bottom-0 h-[80%] bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>}
              <div className="relative z-10 space-y-1">
                <h4 
                  className="font-black leading-snug whitespace-pre-line"
                  style={{
                    color: popupSettings.image ? (popupSettings.titleColor || "#ffffff") : "#0F172A",
                    fontSize: popupSettings.titleSize || "18px"
                  }}
                >
                  {popupSettings.title}
                </h4>
              </div>
            </div>

            {/* Body Description */}
            <div 
              className="p-6 overflow-y-auto font-bold leading-relaxed whitespace-pre-line text-slate-700"
              style={{
                color: popupSettings.descColor || "#334155",
                fontSize: popupSettings.descSize || "13px"
              }}
            >
              {popupSettings.desc}
            </div>

            {/* Action buttons & 'Today close' bar */}
            <div className="border-t border-slate-100">
              {popupSettings.link && (
                <div className="p-4 border-b border-slate-100 bg-[#F8FAFC] text-center">
                  <button
                    type="button"
                    onClick={() => {
                      const link = popupSettings.link;
                      if (link.startsWith("http")) {
                        window.open(link, "_blank");
                      } else {
                        const menuMapping: Record<string, string> = {
                          order: "orders",
                          training: "training",
                          material: "material",
                          inquiry: "inquiry",
                          notice: "notice"
                        };
                        setCurrentMenu(menuMapping[link] || "dashboard");
                        setShowPopup(false);
                      }
                    }}
                    className="w-full py-3.5 font-black rounded-md shadow-md transition-all cursor-pointer border-0"
                    style={{
                      backgroundColor: popupSettings.btnBgColor || "#F5AC00",
                      color: popupSettings.btnTextColor || "#0F172A",
                      fontSize: popupSettings.btnTextSize || "13px"
                    }}
                  >
                    {popupSettings.btnText || "자세히 보기"}
                  </button>
                </div>
              )}

              {/* Close Footer bar */}
              <div className="bg-[#F8FAFC] p-4 flex justify-between items-center px-6 text-xs font-bold text-slate-600 select-none">
                <button
                  type="button"
                  onClick={() => {
                    const sevenDaysLater = Date.now() + 7 * 24 * 60 * 60 * 1000;
                    localStorage.setItem("120_popup_closed_until", sevenDaysLater.toString());
                    setShowPopup(false);
                  }}
                  className="hover:text-[#0F172A] transition-colors flex items-center gap-1 cursor-pointer border-0 bg-transparent font-bold"
                >
                  <Check size={14} className="text-[#F5AC00]" /> 7일 동안 보지 않기
                </button>
                <button
                  type="button"
                  onClick={() => setShowPopup(false)}
                  className="hover:text-rose-600 font-black transition-colors cursor-pointer border-0 bg-transparent"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          INTERACTIVE MULTI FLOATING BUTTONS
         ========================================== */}
      {floatingSettings?.isActive && (
        <div className="hidden lg:flex fixed right-6 bottom-6 z-[90] flex-col items-end gap-3 font-bold text-xs select-none text-white animate-fadeIn">
          {/* Expanded Menu Actions Tray */}
          {floatingOpen && (
            <div className="flex flex-col items-end gap-2.5 mb-1.5 animate-slideUp">
              {/* Instagram */}
              {floatingSettings.instaUrl && (
                <a
                  href={floatingSettings.instaUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[#cf2a7a] hover:bg-[#b01e63] p-2.5 rounded-md flex items-center justify-center text-white shadow-md transition-all scale-100 hover:scale-110 active:scale-95 cursor-pointer relative group border-0"
                >
                  <Camera size={17} className="!text-white" style={{ color: "#ffffff" }} />
                  <span className="absolute right-12 bg-[#2d2026] text-white text-[9px] font-extrabold px-2 py-1 rounded shadow-sm opacity-0 group-hover:opacity-100 whitespace-nowrap transition-all duration-200">공식 인스타</span>
                </a>
              )}

              {/* Naver Blog */}
              {floatingSettings.blogUrl && (
                <a
                  href={floatingSettings.blogUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[#03C75A] hover:bg-[#02b350] p-2.5 rounded-md flex items-center justify-center text-white shadow-md transition-all scale-100 hover:scale-110 active:scale-95 cursor-pointer relative group border-0"
                >
                  <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" className="!text-white" style={{ color: "#ffffff" }}>
                    <path d="M16.273 19.143L8.538 9.385V19.143H4.425V4.857h4.088l7.653 9.637V4.857h4.088v14.286h-3.981z" />
                  </svg>
                  <span className="absolute right-12 bg-[#2d2026] text-white text-[9px] font-extrabold px-2 py-1 rounded shadow-sm opacity-0 group-hover:opacity-100 whitespace-nowrap transition-all duration-200">네이버 블로그</span>
                </a>
              )}

              {/* Youtube */}
              {floatingSettings.youtubeUrl && (
                <a
                  href={floatingSettings.youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[#ff0000] hover:bg-[#cc0000] p-2.5 rounded-md flex items-center justify-center text-white shadow-md transition-all scale-100 hover:scale-110 active:scale-95 cursor-pointer relative group border-0"
                >
                  <Video size={17} className="!text-white" style={{ color: "#ffffff" }} />
                  <span className="absolute right-12 bg-[#2d2026] text-white text-[9px] font-extrabold px-2 py-1 rounded shadow-sm opacity-0 group-hover:opacity-100 whitespace-nowrap transition-all duration-200">유튜브 채널</span>
                </a>
              )}

              {/* Phone Direct Inquiry */}
              {floatingSettings.phoneNo && (
                <a
                  href={`tel:${floatingSettings.phoneNo}`}
                  className="bg-[#007aff] hover:bg-[#0062cc] p-2.5 rounded-md flex items-center justify-center text-white shadow-md transition-all scale-100 hover:scale-110 active:scale-95 cursor-pointer relative group border-0"
                >
                  <Phone size={17} className="text-white" />
                  <span className="absolute right-12 bg-[#2d2026] text-white text-[9px] font-extrabold px-2 py-1 rounded shadow-sm opacity-0 group-hover:opacity-100 whitespace-nowrap transition-all duration-200">본사 전화문의</span>
                </a>
              )}

              {/* Kakao talk Channel / Custom Chat link */}
              {floatingSettings.kakaoUrl && (
                <a
                  href={floatingSettings.kakaoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[#fae100] hover:bg-[#e6cf00] p-2.5 rounded-md flex items-center justify-center text-white shadow-md transition-all scale-100 hover:scale-110 active:scale-95 cursor-pointer relative group border border-yellow-400"
                >
                  <MessageCircle size={17} className="text-white" />
                  <span className="absolute right-12 bg-[#2d2026] text-white text-[9px] font-extrabold px-2 py-1 rounded shadow-sm opacity-0 group-hover:opacity-100 whitespace-nowrap transition-all duration-200">1:1 카톡문의</span>
                </a>
              )}

              {/* Fast Chat Consultation - triggers internal 1:1 Inquiry Board */}
              {floatingSettings.chatUrl && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentMenu("inquiry");
                    setShowInquiryModal(true);
                    setFloatingOpen(false);
                  }}
                  className="bg-[#f25f8a] hover:bg-[#df4977] p-2.5 rounded-md flex items-center justify-center text-white shadow-md transition-all scale-100 hover:scale-110 active:scale-95 cursor-pointer relative group border-0"
                >
                  <MessageSquare size={17} className="text-white" />
                  <span className="absolute right-12 bg-[#2d2026] text-white text-[9px] font-extrabold px-2 py-1 rounded shadow-sm opacity-0 group-hover:opacity-100 whitespace-nowrap transition-all duration-200">1:1 빠른 문의접수</span>
                </button>
              )}
            </div>
          )}

          {/* Trigger Controller (Main Toggle button) */}
          <button
            onClick={() => setFloatingOpen(!floatingOpen)}
            className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-all shadow-[0_6px_20px_rgba(242,95,138,0.4)] hover:scale-105 active:scale-95 cursor-pointer border-0 ${
              floatingOpen 
                ? "bg-[#735965] hover:bg-[#5d4752] rotate-45" 
                : "bg-gradient-to-tr from-[#bf3e67] to-[#f25f8a] hover:from-[#df4977] hover:to-[#ff7b9f]"
            }`}
          >
            {floatingOpen ? <X size={20} className="text-white" /> : <Plus size={20} className="text-white animate-pulse" />}
          </button>
        </div>
      )}

      {/* MOBILE BOTTOM FLOATING CART BAR (Always visible above bottom navigation when items are added in order menu) */}
      {cart.length > 0 && currentMenu === "order" && (
        <div className="lg:hidden fixed bottom-4 inset-x-4 z-40 bg-white border border-[#FED422]/60 px-4 py-3 rounded-lg shadow-[0_8px_25px_rgba(0,0,0,0.15)] flex items-center justify-between animate-slideUp select-none">
          <div className="flex flex-col text-left">
            <span className="text-[9px] font-black text-[#735965]">총 {cart.reduce((sum, item) => sum + item.quantity, 0)}개 품목 담김</span>
            <span className="text-sm font-black text-[#0F172A]">{cartTotal.toLocaleString()}원</span>
          </div>
          <button
            onClick={() => {
              setMobileCartOpen(true);
            }}
            className="px-4 py-2 bg-[#FED422] hover:bg-[#e6be1f] text-[#0F172A] text-[10px] font-black rounded-md shadow-sm flex items-center gap-1 transition-all cursor-pointer border-0"
          >
            <ShoppingBag size={12} className="text-[#2d2026]" />
            장바구니 확인
          </button>
        </div>
      )}

      {/* 7. Mobile Cart Modal (Yellow Header with Left Back Arrow, Clean Rounded Top, Full Items List) */}
      {mobileCartOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 select-none animate-custom-fade font-sans pt-10 sm:pt-0"
          style={{ overscrollBehaviorY: "contain", touchAction: "pan-y" }}
          onClick={() => closeModal(() => setMobileCartOpen(false))}
        >
          <div 
            className="w-full sm:max-w-lg bg-white border-0 rounded-t-[28px] sm:rounded-lg overflow-hidden shadow-2xl max-h-[84vh] sm:max-h-[85vh] flex flex-col animate-slideUp sm:animate-custom-scale"
            style={{ overscrollBehaviorY: "contain" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Fixed Yellow Header */}
            <div className="p-4 sm:p-5 bg-[#FED422] text-[#0F172A] flex justify-between items-center shrink-0 shadow-md rounded-t-[28px] relative z-20">
              <div className="flex items-center gap-2">
                {/* Left Back Arrow Button for Mobile */}
                <button
                  type="button"
                  onClick={() => closeModal(() => setMobileCartOpen(false))}
                  className="p-1.5 text-[#0F172A] hover:bg-black/10 rounded-md transition-all border-0 cursor-pointer flex items-center justify-center shrink-0"
                  aria-label="뒤로가기 닫기"
                  title="뒤로가기"
                >
                  <ArrowLeft size={20} className="text-[#0F172A]" />
                </button>
                <div className="flex items-center gap-2 min-w-0">
                  <ShoppingBag size={20} className="text-[#0F172A] shrink-0" />
                  <h3 className="font-black text-sm sm:text-lg text-[#0F172A] tracking-tight truncate">
                    발주 장바구니 ({cart.reduce((sum, item) => sum + item.quantity, 0)}개)
                  </h3>
                </div>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                {cart.length > 0 && (
                  <button 
                    type="button"
                    onClick={() => {
                      showCustomConfirm("장바구니 비우기", "장바구니의 모든 품목을 삭제하시겠습니까?", () => {
                        clearCart();
                        setMobileCartOpen(false);
                      });
                    }} 
                    className="text-[11px] sm:text-xs font-black text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-1 cursor-pointer border-0 bg-white px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-md shadow-2xs"
                  >
                    <Trash2 size={12} /> 비우기
                  </button>
                )}
                <button 
                  type="button"
                  onClick={() => closeModal(() => setMobileCartOpen(false))} 
                  className="p-1.5 text-[#0F172A]/80 hover:text-[#0F172A] bg-black/5 hover:bg-black/10 rounded-md transition-all border-0 cursor-pointer shrink-0"
                  aria-label="창 닫기"
                  title="닫기"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Main Scrollable Body: Full Vertical Items List */}
            <div 
              className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-left"
              style={{ overscrollBehaviorY: "contain", touchAction: "pan-y" }}
            >
              {cart.length === 0 ? (
                <div className="py-20 text-center space-y-3">
                  <ShoppingBag size={48} className="text-slate-300 mx-auto" />
                  <p className="text-sm text-slate-500 font-bold leading-relaxed max-w-[200px] mx-auto">
                    발주할 물품의 '담기' 버튼을 클릭해 장바구니를 채워주세요.
                  </p>
                </div>
              ) : (
                <>
                  {/* Cart Items list (Full Continuous List) */}
                  <div className="space-y-4">
                    <span className="text-xs font-black text-slate-700 block pb-1 border-b border-slate-100">
                      선택한 발주 자재 목록 ({cart.reduce((sum, item) => sum + item.quantity, 0)}개)
                    </span>
                    {groupedCartItems.map(([typeKey, group]) => (
                      <div key={typeKey} className="space-y-2.5">
                        <div className="flex justify-between items-center bg-[#F8FAFC] px-3.5 py-2 rounded-md border border-slate-100 select-none">
                          <span className="font-black text-xs text-[#0F172A]">{group.title}</span>
                          {group.feeLabel && (
                            <span className="text-[10px] text-slate-500 font-bold">
                              배송비: {group.feeLabel}
                            </span>
                          )}
                        </div>
                        
                        <div className="space-y-2.5">
                          {group.items.map((item) => {
                            const p = (products || []).find((prod) => prod.id === item.productId);
                            if (!p) return null;
                            return (
                              <div key={`${item.productId}-${item.selectedOption || ""}`} className="flex gap-3 justify-between items-center bg-white border border-slate-200/80 p-3.5 rounded-lg shadow-xs">
                                <img src={optimizeCloudinaryUrl(p.img)} alt="" className="w-12 h-12 rounded-md object-cover shrink-0 border border-slate-100" />
                                <div className="flex-1 min-w-0 text-left">
                                  <h4 className="font-black text-xs sm:text-sm text-[#0F172A] leading-tight">{p.name}</h4>
                                  {item.selectedOption && (
                                    <span className="text-[10px] text-amber-700 font-extrabold block mt-0.5 select-none">
                                      [옵션: {item.selectedOption}]
                                    </span>
                                  )}
                                  <span className="text-[11px] text-slate-500 font-bold block mt-1">{p.price.toLocaleString()} 원 · {p.packSize}</span>
                                </div>
                                <div className="flex flex-col items-end gap-1.5 shrink-0">
                                  <button 
                                    type="button"
                                    onClick={() => {
                                      removeCartItem(p.id, item.selectedOption);
                                      if (cart.length <= 1) {
                                        setMobileCartOpen(false);
                                      }
                                    }} 
                                    className="text-slate-400 hover:text-rose-600 transition-colors p-1 cursor-pointer bg-transparent border-0" 
                                    aria-label="삭제"
                                  >
                                    <X size={15} />
                                  </button>
                                  <div className="flex items-center bg-[#F8FAFC] rounded-md p-1 border border-slate-200 shadow-2xs">
                                    <button 
                                      type="button"
                                      onClick={() => {
                                        updateCartQty(p.id, item.selectedOption, item.quantity - 1);
                                        if (item.quantity === 1 && cart.length <= 1) {
                                          setMobileCartOpen(false);
                                        }
                                      }} 
                                      className="p-1 hover:text-[#0F172A] text-slate-500 transition-colors cursor-pointer bg-transparent border-0"
                                    >
                                      <Minus size={11} />
                                    </button>
                                    <span className="px-2 text-xs font-black text-[#0F172A] w-5 text-center">{item.quantity}</span>
                                    <button 
                                      type="button"
                                      onClick={() => updateCartQty(p.id, item.selectedOption, item.quantity + 1)} 
                                      className="p-1 hover:text-[#0F172A] text-slate-500 transition-colors cursor-pointer bg-transparent border-0"
                                    >
                                      <Plus size={11} />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Bill Summary Section (Inside Scrollable Area below full items list) */}
                  <div className="pt-4 border-t border-slate-200 space-y-3 bg-[#F8FAFC] p-4 rounded-lg border border-slate-100">
                    <h5 className="font-black text-xs text-[#0F172A]">결제 예상 금액</h5>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between text-slate-600 font-bold">
                        <span>상품 합계</span>
                        <span>{cartSubtotal.toLocaleString()} 원</span>
                      </div>
                      <div className="flex justify-between text-slate-600 font-bold">
                        <div className="flex flex-col text-left">
                          <span>배송비</span>
                          {shippingFee > 0 && (
                            <span className="text-[10px] text-slate-400 font-bold">({shippingTypeLabel} 적용)</span>
                          )}
                        </div>
                        <span>{shippingFee === 0 ? "무료" : `${shippingFee.toLocaleString()} 원`}</span>
                      </div>
                      <div className="flex justify-between text-[#0F172A] font-black text-sm border-t border-slate-200 pt-2.5">
                        <span>최종 결제 금액</span>
                        <span className="text-amber-600">{cartTotal.toLocaleString()} 원</span>
                      </div>
                    </div>
                  </div>

                  {/* 이달의 카드 무이자 혜택 안내 */}
                  <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs text-left">
                    <div className="flex items-center gap-1.5 text-[#0F172A] font-black text-xs mb-2">
                      <CreditCard size={16} className="shrink-0 text-[#F5AC00]" />
                      <span>7월 카드사 무이자 혜택 (5만원 이상)</span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[10px] font-semibold text-[#735965]/90 border-b border-slate-100 pb-2 mb-2">
                      <div className="flex justify-between items-center">
                        <span>• 현대 / 신한</span>
                        <span className="font-extrabold text-[#bf3e67]">2~3개월</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>• 삼성 / 국민</span>
                        <span className="font-extrabold text-[#bf3e67]">2~3개월</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>• 롯데 / 전북</span>
                        <span className="font-extrabold text-[#bf3e67]">2~3개월</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>• BC / 우리</span>
                        <span className="font-extrabold text-[#bf3e67]">2~5개월</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>• 하나 / 광주</span>
                        <span className="font-extrabold text-[#bf3e67]">2~5개월</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>• NH농협</span>
                        <span className="font-extrabold text-[#bf3e67]">2~6개월</span>
                      </div>
                    </div>
                    <div className="text-[8px] text-[#735965]/70 font-medium leading-normal">
                      * 법인/체크/선불/기프트/하이버리드 카드는 제외됩니다.<br />
                      * 자세한 사항은 PG사(KG이니시스) 결제창에서 확인 가능합니다.
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Sticky Bottom Action Bar */}
            {cart.length > 0 && (
              <div className="p-4 border-t border-slate-200 bg-white shrink-0 shadow-[0_-4px_15px_rgba(0,0,0,0.05)]">
                <button 
                  type="button"
                  onClick={() => {
                    closeModal(() => setMobileCartOpen(false));
                    placeOrder();
                  }}
                  className="w-full py-3.5 bg-[#F5AC00] hover:bg-[#E69D00] text-[#0F172A] text-sm font-black rounded-md transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer border-0 active:scale-98"
                >
                  <CheckCircle2 size={18} />
                  <span>{cartTotal.toLocaleString()}원 결제 진행하기</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Premium Custom Alert / Confirm Modal */}
      {customDialog.isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-sm animate-custom-fade select-none">
          <div className="bg-white border border-neutral-100 rounded-lg w-full max-w-[340px] overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.12)] relative my-auto flex flex-col p-6 animate-custom-scale">
            
            {/* Top decorative color bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 to-[#f25f8a]"></div>
            
            {/* Icon / Title */}
            <div className="flex items-center gap-2.5 mb-3 mt-1 text-left">
              <div className="p-2 rounded-md bg-amber-50 text-amber-500 shrink-0">
                <AlertCircle size={18} />
              </div>
              <h3 className="text-sm sm:text-base font-black text-neutral-800 leading-snug">
                {customDialog.title || "알림"}
              </h3>
            </div>
            
            {/* Message */}
            <p className="text-xs sm:text-sm font-bold text-neutral-500 leading-relaxed mb-6 text-left whitespace-pre-line">
              {customDialog.message}
            </p>
            
            {/* Buttons */}
            <div className="flex items-center justify-end gap-2">
              {customDialog.type === "confirm" && (
                <button
                  type="button"
                  onClick={customDialog.onCancel}
                  className="px-4 py-2 bg-neutral-50 hover:bg-neutral-100 text-neutral-500 font-extrabold text-xs rounded-md transition-all shadow-sm active:scale-95 cursor-pointer border border-neutral-200"
                >
                  취소
                </button>
              )}
              <button
                type="button"
                onClick={customDialog.onConfirm}
                className="px-5 py-2.5 bg-amber-400 hover:bg-amber-350 text-neutral-950 font-black text-xs rounded-md transition-all shadow-md active:scale-95 cursor-pointer border-0"
              >
                확인
              </button>
            </div>
          </div>
          
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes customFadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes customScaleUp {
              from { transform: scale(0.95); opacity: 0; }
              to { transform: scale(1); opacity: 1; }
            }
            .animate-custom-fade {
              animation: customFadeIn 0.2s ease-out forwards;
            }
            .animate-custom-scale {
              animation: customScaleUp 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
            }
          `}} />
        </div>
      )}

      {/* 도로명 주소 실시간 검색 모달 */}
      {showAddressPopup && (
        <div 
          className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setShowAddressPopup(false)}
        >
          <div 
            className="w-full max-w-lg bg-white border border-[#f2ccd7] rounded-lg overflow-hidden shadow-2xl flex flex-col h-[600px] max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-[#f2ccd7]/60 flex flex-col gap-3 bg-[#fff1f5]/80">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-bold text-[#2d2026]">도로명 주소 실시간 검색</h4>
                <button onClick={() => setShowAddressPopup(false)} className="p-1.5 text-[#735965] hover:text-[#f25f8a] bg-white border border-[#f2ccd7] rounded-lg cursor-pointer">
                  <X size={13} />
                </button>
              </div>
              
              {/* Tabs */}
              <div className="flex bg-[#ffd3df]/50 p-1 rounded-md border border-[#f2ccd7]/60">
                <button
                  type="button"
                  onClick={() => setAddressTab("kakao")}
                  className={`flex-1 py-1.5 text-[11px] font-extrabold rounded-lg transition-all cursor-pointer ${
                    addressTab === "kakao" 
                      ? "bg-white text-[#bf3e67] shadow-sm border border-[#f2ccd7]/40" 
                      : "text-[#735965] hover:text-[#bf3e67]"
                  }`}
                >
                  카카오 우편번호 API
                </button>
                <button
                  type="button"
                  onClick={() => setAddressTab("simulated")}
                  className={`flex-1 py-1.5 text-[11px] font-extrabold rounded-lg transition-all cursor-pointer ${
                    addressTab === "simulated" 
                      ? "bg-white text-[#bf3e67] shadow-sm border border-[#f2ccd7]/40" 
                      : "text-[#735965] hover:text-[#bf3e67]"
                  }`}
                >
                  모의 간편 검색 (대안)
                </button>
              </div>
            </div>

            {/* Content Body */}
            {addressTab === "kakao" ? (
              <div className="flex-1 w-full bg-[#fff9fb] overflow-hidden relative">
                <div 
                  id="daum-postcode-container" 
                  className="w-full h-full"
                ></div>
              </div>
            ) : (
              <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-[#fff9fb]">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#735965] block">지번/도로명 검색어 입력</label>
                  <input
                    type="text"
                    placeholder="예: 테헤란로, 엘에스로, 당동"
                    value={addressSearchKeyword}
                    onChange={(e) => handleRegAddressSearch(e.target.value)}
                    className="w-full bg-white border border-[#f2ccd7] rounded-md px-3.5 py-2.5 text-xs text-[#2d2026] placeholder-[#735965]/40 font-semibold focus:outline-none focus:border-[#f25f8a]"
                  />
                </div>
                
                {addressSearchResults.length > 0 ? (
                  <div className="border border-[#f2ccd7]/60 rounded-md overflow-hidden divide-y divide-[#f2ccd7]/40 bg-white">
                    {addressSearchResults.map((addr, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          if (addressSearchTarget === "profile") {
                            setProfileRoadAddress(addr);
                          } else if (addressSearchTarget === "delivery") {
                            setDeliveryAddress(addr);
                          } else {
                            setRegRoadAddress(addr);
                          }
                          setShowAddressPopup(false);
                          triggerToast("도로명 주소가 자동 선택되었습니다.");
                        }}
                        className="w-full px-4 py-3 text-left text-xs font-semibold text-[#735965] hover:bg-[#fff1f5] hover:text-[#bf3e67] transition-all block cursor-pointer border-0 bg-transparent"
                      >
                        {addr}
                      </button>
                    ))}
                  </div>
                ) : (
                  addressSearchKeyword.trim() !== "" && (
                    <p className="text-center text-xs text-[#735965] font-bold py-6">검색 결과가 존재하지 않습니다.</p>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
