"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { optimizeCloudinaryUrl } from "@/app/utils/cloudinary";
import { getInstagramThumbnailUrl } from "@/app/utils/instagram";
import Link from "next/link";
import { useModalBackHandler } from "@/components/MobileBackManager";
import {
  LayoutDashboard,
  ShoppingBag,
  History,
  Megaphone,
  MessageSquare,
  BookOpen,
  ImageIcon,
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
  Video,
  FileText,
  ChevronRight,
  Clock,
  CheckCircle2,
  Truck,
  Bell,
  Calendar,
  PanelLeftClose,
  PanelLeftOpen,
  Filter,
  LogOut,
  Menu,
  X,
  AlertCircle,
  Check,
  Send,
  PlusCircle,
  ArrowRightLeft,
  Store,
  UserCheck,
  Sparkles,
  Settings,
  Map,
  Copy,
  BarChart3,
  Palette,
  Upload,
  Paperclip,
  Edit,
  GripVertical,
  ArrowUp,
  ArrowDown,
  MapPin,
  ExternalLink,
  LayoutGrid,
  Grid3X3,
  List,
  Users,
  DollarSign,
  Wallet,
  Percent,
  Printer,
  Award,
  Crosshair,
  Save
} from "lucide-react";
import Footer from "@/app/components/Footer";
import RadarMap from "@/app/components/RadarMap";
import { FranchiseContractDocument } from "@/components/contract/FranchiseContractDocument";
import { DEFAULT_TERMS, DEFAULT_PRIVACY, DEFAULT_REFUND } from "@/app/constants/policies";

// ==========================================
// TYPES DEFINITIONS
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

// ==========================================
interface StoreInfo {
  id: string; // 로그인 아이디
  pw: string; // 비밀번호
  pwConfirm: string; // 비밀번호 확인
  name: string; // 가맹점명
  owner: string; // 점주명
  phone: string; // 연락처
  status: "승인" | "대기" | "보류" | "중지" | "취소"; // 가맹상태
  roadAddress: string; // 도로명주소
  detailAddress: string; // 상세주소
  lat?: number; // 위도
  lng?: number; // 경도
  regDate: string; // 가맹 등록일
  cancelDate?: string; // 가맹 해지일
  adoptionMenu: string[]; // 도입메뉴 (e.g. ["120pie", "egg120", "츄러스120"])
  monthlySales: number; // 월매출 (통계 호환용)
  partnerId?: string; // 영업 파트너 ID
}

interface Product {
  id: string;
  orderIndex: number; // 순서
  name: string; // 제품명
  category: string; // 카테고리
  modelName: string; // 모델명
  unit: "개" | "박스" | "kg" | "SET" | "EA" | "대"; // 단위
  qty: number; // 수량
  supplyPrice: number; // 공급가
  price: number; // 판매가
  discountAmount: number; // 할인금액
  discountedPrice: number; // 할인판매가
  img: string; // 썸네일 이미지
  detailImg?: string; // 상세페이지 이미지
  detailText?: string; // 상세페이지 텍스트 설명
  isActive: boolean; // 판매 활성화여부
  desc: string; // 설명
  stock: "in_stock" | "low_stock" | "out_of_stock"; // 재고상태 호환용
  status?: "판매중" | "품절" | "단종";
  labels?: string[]; // 라벨 (e.g. ["BEST", "추천", "신제품"])
  shippingType?: "free" | "A" | "B" | "C" | "BOX"; // 배송 정책 구분 (무료, A, B, C, BOX)
  options?: string[]; // 제품 선택 옵션 (홍보물 등)
}

interface BannerSettings {
  mainTag: string;
  mainTitle: string;
  mainDesc: string;
  mainBtnText?: string;
  mainLink?: string;
  sideTag: string;
  sideTitle: string;
  sideDesc: string;
  sideBtnText: string;
  mainImage?: string;
  sideImage?: string;
  sideLink?: string;
}

interface PopupSettings {
  isActive: boolean;
  title: string;
  desc: string;
  image?: string;
  link?: string;
  btnText: string;
  titleColor?: string;
  titleSize?: string;
  descColor?: string;
  descSize?: string;
  btnBgColor?: string;
  btnTextColor?: string;
  btnTextSize?: string;
}

interface FloatingSettings {
  isActive: boolean;
  instaUrl: string;
  youtubeUrl: string;
  chatUrl: string;
  phoneNo: string;
  kakaoUrl: string;
  blogUrl?: string;
}

const DEFAULT_POPUP: PopupSettings = {
  isActive: true,
  title: "여름 스페셜 '망고파이' 물류 정식 출시!",
  desc: "신메뉴 출시 기념 특전! 지금 물류 메뉴에서 망고파이 생지 3박스 이상 주문 시 캐릭터 홍보 포스터 패키지 및 아크릴 테이블 텐트 시안 무상 증정!",
  image: "",
  link: "order",
  btnText: "지금 바로 신메뉴 생지 주문하러 가기",
  titleColor: "#ffffff",
  titleSize: "18px",
  descColor: "#735965",
  descSize: "12px",
  btnBgColor: "#f25f8a",
  btnTextColor: "#ffffff",
  btnTextSize: "12px"
};

const DEFAULT_FLOATING: FloatingSettings = {
  isActive: true,
  instaUrl: "https://www.instagram.com/120pie77/",
  youtubeUrl: "https://youtube.com",
  chatUrl: "https://kakao.com",
  phoneNo: "1566-3594",
  kakaoUrl: "https://kakao.com",
  blogUrl: "https://blog.naver.com/120pie_coffee"
};

interface Order {
  _id?: any;
  id: string;
  date: string;
  items: { productName: string; quantity: number; price: number }[];
  totalPrice: number;
  status: string;
  storeId?: string;
  courier?: string;
  trackingNo?: string;
  trackingList?: { courier: string; trackingNo: string }[];
  impUid?: string;
  payMethod?: string;
}

interface Inquiry {
  _id?: any;
  id: string;
  storeId?: string;
  storeName?: string;
  category: string;
  title: string;
  date: string;
  status: "답변대기" | "답변완료";
  content: string;
  answer?: string;
}

interface Notice {
  id: string;
  tag: "필독" | "일반" | "이벤트" | "물류";
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
// INITIAL MOCK DATA SEEDS (FALLBACKS)
// ==========================================
const DEFAULT_STORES: StoreInfo[] = [
  {
    id: "woong777",
    pw: "woong777",
    pwConfirm: "woong777",
    name: "120겹파이 DESSERT",
    owner: "한정웅",
    phone: "010-5354-1534",
    status: "승인",
    roadAddress: "서울 성북구 돌곶이로14길 35 (석관동)",
    detailAddress: "1층",
    regDate: "2026-07-28",
    cancelDate: "",
    adoptionMenu: ["120pie", "egg120", "츄러스120", "120coffee", "핫도그120", "떡볶이120"],
    monthlySales: 12000000,
  },
  {
    id: "w01011208",
    pw: "w01011208",
    pwConfirm: "w01011208",
    name: "카페101",
    owner: "김귀순",
    phone: "010-2323-8002",
    status: "승인",
    roadAddress: "인천 서구 담지로104번길 22 (청라동)",
    detailAddress: "1층",
    regDate: "2026-07-21",
    cancelDate: "",
    adoptionMenu: ["120pie"],
    monthlySales: 8500000,
  },
  {
    id: "tjsdud7275",
    pw: "tjsdud7275",
    pwConfirm: "tjsdud7275",
    name: "120겹 파이 파주운정점",
    owner: "우선영",
    phone: "010-3847-1928",
    status: "승인",
    roadAddress: "경기 파주시 가람로21번길 15-28 (와동동)",
    detailAddress: "",
    regDate: "2026-07-03",
    cancelDate: "",
    adoptionMenu: ["120pie"],
    monthlySales: 9200000,
  },
  {
    id: "su3164",
    pw: "su3164",
    pwConfirm: "su3164",
    name: "120겹 파이 원주혁신도시점",
    owner: "박초현",
    phone: "010-7238-3164",
    status: "승인",
    roadAddress: "강원특별자치도 원주시 웅비1길 11 (반곡동)",
    detailAddress: "",
    regDate: "2026-06-28",
    cancelDate: "",
    adoptionMenu: ["120pie"],
    monthlySales: 11000000,
  },
  {
    id: "alla32",
    pw: "alla32",
    pwConfirm: "alla32",
    name: "120겹 파이 영종하늘도시점",
    owner: "임세희",
    phone: "010-7463-8040",
    status: "승인",
    roadAddress: "인천 중구 하늘달빛로 139 (중산동, e편한세상 영종국제도시센텀베뉴)",
    detailAddress: "777동",
    regDate: "2026-06-26",
    cancelDate: "",
    adoptionMenu: ["120pie", "egg120", "츄러스120"],
    monthlySales: 13500000,
  },
  {
    id: "sodam28",
    pw: "sodam28",
    pwConfirm: "sodam28",
    name: "120겹파이 안암점(카페데일리)",
    owner: "한수연",
    phone: "010-5678-1234",
    status: "승인",
    roadAddress: "서울 성북구 고려대로27길 9 (안암동5가)",
    detailAddress: "",
    regDate: "2026-06-22",
    cancelDate: "",
    adoptionMenu: ["120pie"],
    monthlySales: 10500000,
  },
  {
    id: "lovely3381",
    pw: "lovely3381",
    pwConfirm: "lovely3381",
    name: "120겹 파이 잠실점",
    owner: "박다솔",
    phone: "010-3381-4423",
    status: "승인",
    roadAddress: "서울 송파구 삼학사로 73 (삼전동, 은일빌딩)",
    detailAddress: "",
    regDate: "2026-06-18",
    cancelDate: "",
    adoptionMenu: ["120pie", "egg120", "츄러스120", "떡볶이120", "핫도그120", "120coffee"],
    monthlySales: 16800000,
  },
  {
    id: "ktt1222",
    pw: "ktt1222",
    pwConfirm: "ktt1222",
    name: "120겹파이 향동점(다색냥)",
    owner: "김서윤",
    phone: "010-9110-5404",
    status: "승인",
    roadAddress: "경기 고양시 덕양구 꽃내음1길 (향동동)",
    detailAddress: "",
    regDate: "2026-03-10",
    cancelDate: "",
    adoptionMenu: ["120pie"],
    monthlySales: 7800000,
  },
  {
    id: "120ak",
    pw: "120ak",
    pwConfirm: "120ak",
    name: "120겹 파이 AK플라자 금정점",
    owner: "이사근",
    phone: "010-3813-1200",
    status: "승인",
    roadAddress: "경기 군포시 엘에스로 143 (금정동, 힐스테이트 금정역)",
    detailAddress: "",
    regDate: "2025-02-24",
    cancelDate: "",
    adoptionMenu: ["120pie", "egg120", "떡볶이120", "핫도그120", "츄러스120"],
    monthlySales: 18500000,
  },
  {
    id: "west0220",
    pw: "west0220",
    pwConfirm: "west0220",
    name: "120겹파이 잼인브라운점",
    owner: "서진우",
    phone: "010-4491-8822",
    status: "승인",
    roadAddress: "서울 서초구 남부순환로325길 17 (서초동, 신빌딩)",
    detailAddress: "",
    regDate: "2026-05-15",
    cancelDate: "",
    adoptionMenu: ["120pie"],
    monthlySales: 14200000,
  },
  {
    id: "song4276",
    pw: "song4276",
    pwConfirm: "song4276",
    name: "120겹파이 카페멈점",
    owner: "송지은",
    phone: "010-6721-9933",
    status: "승인",
    roadAddress: "경기 수원시 권선구 호매실로166번길 10 (호매실동, 호매실능실마을22단지)",
    detailAddress: "",
    regDate: "2026-05-10",
    cancelDate: "",
    adoptionMenu: ["120pie"],
    monthlySales: 9800000,
  },
  {
    id: "mm6861",
    pw: "mm6861",
    pwConfirm: "mm6861",
    name: "120겹파이 더네이버커피점",
    owner: "문미숙",
    phone: "010-8833-2211",
    status: "승인",
    roadAddress: "서울 영등포구 버드나루로 13 (영등포동2가, 굿네이버스회관)",
    detailAddress: "",
    regDate: "2026-04-25",
    cancelDate: "",
    adoptionMenu: ["120pie"],
    monthlySales: 11500000,
  },
  {
    id: "hongdae",
    pw: "hongdae",
    pwConfirm: "hongdae",
    name: "120겹파이 홍대입구점",
    owner: "이민우",
    phone: "010-4211-5678",
    status: "승인",
    roadAddress: "서울 마포구 양화로 160 (동교동)",
    detailAddress: "2층 201호",
    regDate: "2026-04-12",
    cancelDate: "",
    adoptionMenu: ["120pie", "egg120", "츄러스120"],
    monthlySales: 15400000,
  },
  {
    id: "owner",
    pw: "owner",
    pwConfirm: "owner",
    name: "120겹파이 강남역삼점",
    owner: "김지훈",
    phone: "010-3813-1200",
    status: "승인",
    roadAddress: "서울 강남구 테헤란로 152 (역삼동, 강남파이낸스센터)",
    detailAddress: "1층",
    regDate: "2026-05-01",
    cancelDate: "",
    adoptionMenu: ["120pie", "egg120", "츄러스120", "핫도그120", "120coffee"],
    monthlySales: 12800000,
  },
  {
    id: "seomyeon",
    pw: "seomyeon",
    pwConfirm: "seomyeon",
    name: "120겹파이 부산서면점",
    owner: "박수진",
    phone: "010-5182-9012",
    status: "승인",
    roadAddress: "부산 부산진구 중앙대로 730 (부전동)",
    detailAddress: "1층",
    regDate: "2026-05-20",
    cancelDate: "",
    adoptionMenu: ["120pie", "120coffee"],
    monthlySales: 9600000,
  },
];

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    orderIndex: 1,
    name: "로제미트파이 생지",
    category: "냉동생지/자재",
    modelName: "RP-DOUGH-01",
    unit: "박스",
    qty: 60,
    supplyPrice: 35000,
    price: 45000,
    discountAmount: 3000,
    discountedPrice: 42000,
    img: "https://res.cloudinary.com/dx7l09wwu/image/upload/f_auto,q_auto/v1779760050/%EB%A1%9C%EC%A0%9C%EB%AF%B8%ED%8A%B8%ED%8C%8C%EC%9D%B4_khogbn.jpg",
    detailImg: "",
    isActive: true,
    desc: "육즙 가득 미트소스와 로제 크림이 가미된 시그니처 대표 생지",
    stock: "in_stock"
  },
  {
    id: "prod-2",
    orderIndex: 2,
    name: "애플시나몬파이 생지",
    category: "냉동생지/자재",
    modelName: "RP-DOUGH-02",
    unit: "박스",
    qty: 60,
    supplyPrice: 32000,
    price: 42000,
    discountAmount: 0,
    discountedPrice: 42000,
    img: "https://res.cloudinary.com/dx7l09wwu/image/upload/f_auto,q_auto/v1779760051/%EC%95%A0%ED%94%8C%ED%8C%8C%EC%9D%B4_yurkh5.jpg",
    detailImg: "",
    isActive: true,
    desc: "달콤 상큼한 사과 과육과 시나몬 아로마가 어우러진 스테디셀러 디저트 생지",
    stock: "in_stock"
  },
  {
    id: "prod-3",
    orderIndex: 3,
    name: "콘치즈파이 생지",
    category: "냉동생지/자재",
    modelName: "RP-DOUGH-03",
    unit: "박스",
    qty: 60,
    supplyPrice: 33000,
    price: 43000,
    discountAmount: 1000,
    discountedPrice: 42000,
    img: "https://res.cloudinary.com/dx7l09wwu/image/upload/f_auto,q_auto/v1779760050/%EC%BD%98%EC%B9%98%EC%A6%88%ED%8C%8C%EC%9D%B4_qvb2u5.jpg",
    detailImg: "",
    isActive: true,
    desc: "고소한 스위트콘 and 부드러운 치즈가 조합된 남녀노소 취향저격 생지",
    stock: "low_stock"
  },
  {
    id: "prod-4",
    orderIndex: 4,
    name: "쌀계란빵 오리지널 믹스",
    category: "냉동생지/자재",
    modelName: "EG-MIX-01",
    unit: "kg",
    qty: 5,
    supplyPrice: 16000,
    price: 21000,
    discountAmount: 0,
    discountedPrice: 21000,
    img: "https://res.cloudinary.com/dx7l09wwu/image/upload/f_auto,q_auto/v1779761729/%EC%98%A4%EB%A6%AC%EC%A7%80%EB%84%90%EA%B3%84%EB%9E%80%EB%B9%B52_kdqsqv.jpg",
    detailImg: "",
    isActive: true,
    desc: "에그120 전용 100% 국산 쌀가루 계란빵 전용 반죽 파우더 믹스",
    stock: "in_stock"
  },
  {
    id: "prod-5",
    orderIndex: 5,
    name: "츄러스 전용 냉동생지",
    category: "냉동생지/자재",
    modelName: "CH-DOUGH-01",
    unit: "박스",
    qty: 100,
    supplyPrice: 29000,
    price: 38000,
    discountAmount: 2000,
    discountedPrice: 36000,
    img: "https://res.cloudinary.com/dx7l09wwu/image/upload/f_auto,q_auto/v1779762878/%EC%98%A4%EB%A6%AC%EC%A7%80%EB%84%90_koyjlk.jpg",
    detailImg: "",
    isActive: true,
    desc: "기름 없이 오븐 조리가 가능한 바삭하고 쫀득한 츄러스 전용 냉동 생지",
    stock: "in_stock"
  },
  {
    id: "prod-6",
    orderIndex: 6,
    name: "[홍보물] 매장용 양면 포스터 및 스티커",
    category: "부자재/포장재",
    modelName: "PR-POSTER-01",
    unit: "개",
    qty: 1,
    supplyPrice: 4000,
    price: 5000,
    discountAmount: 0,
    discountedPrice: 5000,
    img: "https://res.cloudinary.com/dfarfqx7e/image/upload/f_auto,q_auto/v1781184019/120%EA%B2%B9%ED%8C%8C%EC%9D%B4_%ED%81%AC%EB%A6%BC%EC%B9%98%EC%A6%88_%EC%97%B0%EC%B6%9C_ebuddm.jpg",
    detailImg: "",
    isActive: true,
    desc: "120pie 브랜드 컬러의 매장 유리창 부착용 홍보 포스터 세트",
    stock: "in_stock",
    options: ["A4 사이즈 포스터", "A3 사이즈 포스터", "카운터용 미니 스티커 5매"]
  }
];

const DEFAULT_PRS: Material[] = [
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

const DEFAULT_BANNER: BannerSettings = {
  mainTag: "Seasonal Spec",
  mainTitle: "여름 대비 스페셜 신메뉴\n'망고파이' 물류 정식 공급!",
  mainDesc: "지금 바로 냉동생지를 주문하고, 홍보 자료실에서 매장 포스터 및 아크릴 테이블 텐트 시안을 무상으로 다운로드하여 매출을 강화해 보세요!",
  sideTag: "Standard Edu",
  sideTitle: "점주 전용\n하절기 식품 안전 &\n위생 자가 점검표",
  sideDesc: "하절기 위해 해충 및 냉동 식자재 보관 온도를 사전에 정밀 점검하여 위생 과태료 처분을 방지하세요.",
  sideBtnText: "교육자료 다운로드",
  mainImage: "",
  sideImage: "",
  sideLink: "training"
};

interface GalleryItem {
  id: string;
  _id?: any;
  name: string;
  category: string;
  url: string;
  regDate: string;
  isFeatured?: boolean;
}

const DEFAULT_GALLERY: GalleryItem[] = [];

const parseReferrer = (ref: string) => {
  if (!ref || ref.toLowerCase() === "direct" || ref === "") return "Direct (직접입력/즐겨찾기)";
  
  const lowerRef = ref.toLowerCase();
  
  if (typeof window !== "undefined" && lowerRef.includes(window.location.host)) {
    return "Direct (직접입력/즐겨찾기)";
  }
  if (lowerRef.includes("120pie") || lowerRef.includes("localhost")) {
    return "Direct (직접입력/즐겨찾기)";
  }

  if (lowerRef.includes("naver.com")) return "네이버 (Naver)";
  if (lowerRef.includes("google.")) return "구글 (Google)";
  if (lowerRef.includes("daum.net") || lowerRef.includes("kakao.com")) return "다음/카카오 (Daum/Kakao)";
  if (lowerRef.includes("instagram.com")) return "인스타그램 (Instagram)";
  if (lowerRef.includes("youtube.com") || lowerRef.includes("youtu.be")) return "유튜브 (YouTube)";
  if (lowerRef.includes("facebook.com")) return "페이스북 (Facebook)";
  
  try {
    const url = new URL(ref);
    return url.hostname;
  } catch (e) {
    return ref;
  }
};

const getDatesInRange = (startStr: string, endStr: string) => {
  const dates: string[] = [];
  if (!startStr || !endStr) return dates;
  let current = new Date(startStr + "T00:00:00");
  const end = new Date(endStr + "T23:59:59");
  while (current <= end) {
    const yyyy = current.getFullYear();
    const mm = String(current.getMonth() + 1).padStart(2, '0');
    const dd = String(current.getDate()).padStart(2, '0');
    dates.push(`${yyyy}-${mm}-${dd}`);
    current.setDate(current.getDate() + 1);
  }
  return dates.reverse();
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

export default function AdminPage() {
  // Analytics State
  const [analyticsDateFilter, setAnalyticsDateFilter] = useState<string>("week");
  const [analyticsStartDate, setAnalyticsStartDate] = useState<string>("");
  const [analyticsEndDate, setAnalyticsEndDate] = useState<string>("");
  const [ipSearchQuery, setIpSearchQuery] = useState<string>("");
  const [ipListPage, setIpListPage] = useState<number>(1);

  // Rich Text Editor Selection Preservation & Command Execution
  const savedRangeRef = React.useRef<Range | null>(null);

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      const editor = document.getElementById("product-detail-rich-editor");
      if (editor && editor.contains(range.commonAncestorContainer)) {
        savedRangeRef.current = range;
      }
    }
  };

  const restoreSelection = () => {
    if (savedRangeRef.current) {
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(savedRangeRef.current);
      }
    }
  };

  const executeEditorCommand = (command: string, value: string = "") => {
    const editor = document.getElementById("product-detail-rich-editor");
    if (!editor) return;

    editor.focus();
    restoreSelection();

    if (command.startsWith("justify")) {
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0) {
        const range = sel.getRangeAt(0);
        let align = "left";
        if (command === "justifyCenter") align = "center";
        else if (command === "justifyRight") align = "right";

        let node = range.commonAncestorContainer;
        if (node.nodeType === Node.TEXT_NODE) {
          node = node.parentNode || node;
        }

        // Find the closest block level container inside the editor
        let closestBlock: HTMLElement | null = null;
        let temp = node as HTMLElement;
        while (temp && temp !== editor) {
          const display = window.getComputedStyle(temp).display;
          if (
            display === "block" ||
            display === "flex" ||
            display === "grid" ||
            temp.tagName === "DIV" ||
            temp.tagName === "P" ||
            temp.tagName === "CENTER"
          ) {
            closestBlock = temp;
            break;
          }
          temp = temp.parentNode as HTMLElement;
        }

        if (closestBlock) {
          // If we found a block wrapper (like an existing div or p), apply text-align directly
          closestBlock.style.textAlign = align;
        } else {
          // If there is no block wrapper, manually wrap in a div and apply text-align
          const div = document.createElement("div");
          div.style.textAlign = align;
          try {
            range.surroundContents(div);
            
            // Re-select the wrapped contents to preserve selection
            sel.removeAllRanges();
            const newRange = document.createRange();
            newRange.selectNodeContents(div);
            sel.addRange(newRange);
            savedRangeRef.current = newRange;
          } catch (e) {
            // Fallback: extract and insert if range splits elements
            try {
              const fragment = range.extractContents();
              div.appendChild(fragment);
              range.insertNode(div);
              
              sel.removeAllRanges();
              const newRange = document.createRange();
              newRange.selectNodeContents(div);
              sel.addRange(newRange);
              savedRangeRef.current = newRange;
            } catch (err) {
              console.error("Failed to apply custom align wrapping:", err);
              document.execCommand("formatBlock", false, "div");
              document.execCommand(command, false, value);
            }
          }
        }
      }
    } else {
      document.execCommand(command, false, value);
    }

    setProductDetailText(editor.innerHTML);

    // Save selection again after command execution
    setTimeout(saveSelection, 10);
  };

  // Convex Hooks
  const convexBanners = useQuery(api.banners.get);
  const updateBannersMutation = useMutation(api.banners.update);
  const sendSmsAction = useAction(api.aligo.sendSms);
  const convexPopup = useQuery(api.popups.get);
  const convexFloating = useQuery(api.floatings.get);
  const convexInquiries = useQuery(api.inquiries.list);
  const convexGallery = useQuery(api.gallery.list);
  const convexProducts = useQuery(api.products.get);
  const convexOrders = useQuery(api.orders.list);

  const saveProductMutation = useMutation(api.products.createOrUpdate);
  const deleteProductMutation = useMutation(api.products.deleteProduct);
  const syncProductsMutation = useMutation(api.products.syncProducts);
  const updateProductOrderMutation = useMutation(api.products.updateOrder);

  const saveOrderMutation = useMutation(api.orders.createOrUpdate);
  const syncOrdersMutation = useMutation(api.orders.syncOrders);
  const updateOrderStatusMutation = useMutation(api.orders.updateStatus);
  const updateTrackingMutation = useMutation(api.orders.updateTracking);
  const deleteOrderMutation = useMutation(api.orders.deleteOrder);

  const convexMaterials = useQuery(api.materials.list);
  const saveMaterialMutation = useMutation(api.materials.createOrUpdate);
  const deleteMaterialMutation = useMutation(api.materials.deleteMaterial);
  const generateMaterialUploadUrlMutation = useMutation(api.materials.generateUploadUrl);

  const convexStoreInquiries = useQuery(api.storeInquiries.list);
  const answerInquiryMutation = useMutation(api.storeInquiries.answerInquiry);
  const deleteInquiryMutation = useMutation(api.storeInquiries.deleteInquiry);
  const deleteConsultationMutation = useMutation(api.inquiries.deleteInquiry);

  const convexNotices = useQuery(api.notices.list);
  const saveNoticeMutation = useMutation(api.notices.createOrUpdate);
  const deleteNoticeMutation = useMutation(api.notices.deleteNotice);

  const convexPopupsList = useQuery(api.popups.list);
  const createOrUpdatePopupMutation = useMutation(api.popups.createOrUpdate);
  const deletePopupMutation = useMutation(api.popups.deletePopup);
  const convexProductCategories = useQuery(api.categories.get);
  const updateProductCategoriesMutation = useMutation(api.categories.update);
  const togglePopupActiveMutation = useMutation(api.popups.toggleActive);
  const updateFloatingMutation = useMutation(api.floatings.update);
  const addGalleryItemMutation = useMutation(api.gallery.add);
  const removeGalleryItemMutation = useMutation(api.gallery.remove);
  const updateOrderMutation = useMutation(api.gallery.updateOrder);
  const toggleFeaturedMutation = useMutation(api.gallery.toggleFeatured);
  const convexGalleryCategories = useQuery(api.gallery.getCategories);
  const updateCategoriesMutation = useMutation(api.gallery.updateCategories);
  const syncGalleryMutation = useMutation(api.gallery.syncGallery);
  const seedGalleryMutation = useMutation(api.gallery.seedGallery);

  // Stores Convex Hooks
  const convexStores = useQuery(api.stores.get);
  const saveStoreMutation = useMutation(api.stores.createOrUpdate);
  const deleteStoreMutation = useMutation(api.stores.deleteStore);
  const seedStoresMutation = useMutation(api.stores.seedStores);

  // Instagram Convex Hooks
  const convexInstagram = useQuery(api.instagram.list);
  const saveInstagramMutation = useMutation(api.instagram.createOrUpdate);
  const deleteInstagramMutation = useMutation(api.instagram.deleteInstagram);
  const seedInstagramMutation = useMutation(api.instagram.seedInstagram);
  const reorderInstagramMutation = useMutation(api.instagram.reorder);

  useEffect(() => {
    if (convexInstagram && convexInstagram.length === 0) {
      seedInstagramMutation().then(() => {
        console.log("[Convex] Seed instagram completed.");
      });
    }
  }, [convexInstagram, seedInstagramMutation]);

  const syncStoresBatchMutation = useMutation(api.stores.syncStoresBatch);

  // Sync any stores in localStorage that aren't yet on Convex Cloud
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("120_stores");
        if (raw) {
          const localStores = JSON.parse(raw);
          if (Array.isArray(localStores) && localStores.length > 0) {
            syncStoresBatchMutation({ stores: localStores }).catch(() => {});
          }
        }
      } catch (e) {}
    }
  }, [syncStoresBatchMutation]);

  useEffect(() => {
    if (convexStores) {
      if (convexStores.length === 0) {
        seedStoresMutation().then(() => {
          console.log("[Convex] Seed stores completed.");
        });
      } else {
        let merged = [...convexStores];
        try {
          const raw = localStorage.getItem("120_stores");
          if (raw) {
            const local = JSON.parse(raw);
            if (Array.isArray(local)) {
              const existingIds = new Set(convexStores.map((s: any) => s.id));
              local.forEach((s: any) => {
                if (s && s.id && !existingIds.has(s.id)) {
                  merged.push(s);
                }
              });
            }
          }
        } catch (e) {}
        setStores(merged as any[]);
        localStorage.setItem("120_stores", JSON.stringify(merged));
      }
    }
  }, [convexStores, seedStoresMutation]);

  useEffect(() => {
    if (convexPopup) {
      setPopupActive(convexPopup.isActive);
      setPopupTitle(convexPopup.title);
      setPopupDesc(convexPopup.desc);
      setPopupImage(convexPopup.image || "");
      setPopupLink(convexPopup.link || "");
      setPopupBtnText(convexPopup.btnText || "");
      setPopupTitleColor(convexPopup.titleColor || "#ffffff");
      setPopupTitleSize(convexPopup.titleSize || "18px");
      setPopupDescColor(convexPopup.descColor || "#735965");
      setPopupDescSize(convexPopup.descSize || "12px");
      setPopupBtnBgColor(convexPopup.btnBgColor || "#f25f8a");
      setPopupBtnTextColor(convexPopup.btnTextColor || "#ffffff");
      setPopupBtnTextSize(convexPopup.btnTextSize || "12px");
    }
  }, [convexPopup]);

  useEffect(() => {
    if (convexProductCategories) {
      setCategories(convexProductCategories);
      localStorage.setItem("120_categories", JSON.stringify(convexProductCategories));
    }
  }, [convexProductCategories]);

  useEffect(() => {
    if (convexFloating) {
      setFloatingActive(convexFloating.isActive);
      setFloatingInsta(convexFloating.instaUrl || "");
      setFloatingYoutube(convexFloating.youtubeUrl || "");
      setFloatingChat(convexFloating.chatUrl || "");
      setFloatingPhone(convexFloating.phoneNo || "");
      setFloatingKakao(convexFloating.kakaoUrl || "");
      setFloatingBlog(convexFloating.blogUrl || "");
    }
  }, [convexFloating]);

  useEffect(() => {
    if (convexStoreInquiries) {
      setInquiries(convexStoreInquiries as any);
      localStorage.setItem("120_inquiries", JSON.stringify(convexStoreInquiries));
    }
  }, [convexStoreInquiries]);

  useEffect(() => {
    if (convexInquiries) {
      setConsultations(convexInquiries as any[]);
    }
  }, [convexInquiries]);

  useEffect(() => {
    if (convexGallery) {
      const mapped = convexGallery.map((item: any) => ({
        ...item,
        id: item._id || item.id
      }));
      setGalleryItems(mapped);
    }
  }, [convexGallery]);

  useEffect(() => {
    if (convexGalleryCategories) {
      const activeCats = (convexGallery || []).map((item: any) => item.category).filter(Boolean);
      const merged = Array.from(new Set([...convexGalleryCategories, ...activeCats])) as string[];
      setGalleryCategories(merged);
      if (!galleryItemCategory && merged.length > 0) {
        setGalleryItemCategory(merged[0]);
      }
    }
  }, [convexGalleryCategories, convexGallery]);

  useEffect(() => {
    if (convexMaterials) {
      const trs = convexMaterials.filter((m: any) => m.type === "training");
      const pr = convexMaterials.filter((m: any) => m.type === "pr");
      setTrainings(trs as any);
      setPrs(pr as any);
      localStorage.setItem("120_trainings", JSON.stringify(trs));
      localStorage.setItem("120_prs", JSON.stringify(pr));
    }
  }, [convexMaterials]);

  useEffect(() => {
    if (convexNotices) {
      const mapped = convexNotices.map((n: any) => ({
        id: n.id,
        _id: n._id,
        tag: n.tag as "필독" | "일반" | "이벤트" | "물류",
        title: n.title,
        date: n.date,
        views: n.views,
        content: n.content
      }));
      setNotices(mapped);
      localStorage.setItem("120_notices", JSON.stringify(mapped));
    }
  }, [convexNotices]);

  // Analytics Date Range Calculation useEffect
  useEffect(() => {
    const getFormattedDate = (date: Date) => {
      return date.toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" });
    };
    const today = new Date();
    if (analyticsDateFilter === "today") {
      const dStr = getFormattedDate(today);
      setAnalyticsStartDate(dStr);
      setAnalyticsEndDate(dStr);
    } else if (analyticsDateFilter === "yesterday") {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const dStr = getFormattedDate(yesterday);
      setAnalyticsStartDate(dStr);
      setAnalyticsEndDate(dStr);
    } else if (analyticsDateFilter === "week") {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 6);
      setAnalyticsStartDate(getFormattedDate(weekAgo));
      setAnalyticsEndDate(getFormattedDate(today));
    } else if (analyticsDateFilter === "month") {
      const firstDay = new Date();
      firstDay.setDate(1);
      setAnalyticsStartDate(getFormattedDate(firstDay));
      setAnalyticsEndDate(getFormattedDate(today));
    } else if (analyticsDateFilter === "prev_month") {
      const firstDayPrev = new Date();
      firstDayPrev.setMonth(firstDayPrev.getMonth() - 1);
      firstDayPrev.setDate(1);
      const lastDayPrev = new Date();
      lastDayPrev.setDate(0);
      setAnalyticsStartDate(getFormattedDate(firstDayPrev));
      setAnalyticsEndDate(getFormattedDate(lastDayPrev));
    }
  }, [analyticsDateFilter]);

  const convexAnalytics = useQuery(
    api.analytics.listEvents,
    analyticsStartDate && analyticsEndDate ? { startDate: analyticsStartDate, endDate: analyticsEndDate } : {}
  );
  const analyticsEvents = convexAnalytics || [];

  // ==========================================
  // HQ ADMIN AUTHENTICATION STATE & LOGIC
  // ==========================================
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);
  const [loginId, setLoginId] = useState<string>("");
  const [loginPw, setLoginPw] = useState<string>("");
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const logged = localStorage.getItem("120_admin_logged_in");
      if (logged === "true") {
        setIsLoggedIn(true);
      }
      setCheckingAuth(false);
    }
  }, []);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    const storedAdminId = localStorage.getItem("120_admin_id") || "admin";
    const storedAdminPw = localStorage.getItem("120_admin_pw") || "120pie";
    if (loginId === storedAdminId && loginPw === storedAdminPw) {
      localStorage.setItem("120_admin_logged_in", "true");
      setIsLoggedIn(true);
      triggerToast("최고 관리자 인증 성공. 환영합니다!");
    } else {
      setLoginError("아이디 또는 비밀번호가 잘못되었습니다.");
    }
  };

  const handleLogout = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    localStorage.removeItem("120_admin_logged_in");
    setIsLoggedIn(false);
    triggerToast("어드민 세션이 안전하게 종료되었습니다.");
  };

  const [currentMenu, setCurrentMenu] = useState<string>("dashboard");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
  
  // Dynamic collections synced via localStorage
  const [stores, setStores] = useState<StoreInfo[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [consultations, setConsultations] = useState<any[]>([]);
  const [selectedConsultation, setSelectedConsultation] = useState<any | null>(null);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [trainings, setTrainings] = useState<Material[]>([]);
  const [prs, setPrs] = useState<Material[]>([]);
  const [banner, setBanner] = useState<BannerSettings>(DEFAULT_BANNER);

  // Contracts Query & Mutations
  const convexContracts = useQuery(api.contracts.get) || [];
  const saveContractMutation = useMutation(api.contracts.createOrUpdate);
  const deleteContractMutation = useMutation(api.contracts.deleteContract);
  const updateContractStatusMutation = useMutation(api.contracts.updateStatus);
  const markContractSentMutation = useMutation(api.contracts.markSent);

  // Contract SMS modal states
  const [isContractSmsModalOpen, setIsContractSmsModalOpen] = useState<boolean>(false);
  const [contractSmsMsg, setContractSmsMsg] = useState<string>("");
  const [contractSmsSender, setContractSmsSender] = useState<string>("");
  const [isSendingContractSms, setIsSendingContractSms] = useState<boolean>(false);

  // Partners Query & Mutations
  const convexPartners = useQuery(api.partners.get) || [];
  const savePartnerMutation = useMutation(api.partners.createOrUpdate);
  const deletePartnerMutation = useMutation(api.partners.deletePartner);
  const assignStoreToPartnerMutation = useMutation(api.partners.assignStoreToPartner);
  const allSettlements = useQuery(api.partners.getSettlements, {}) || [];
  const updateSettlementStatusMutation = useMutation(api.partners.updateSettlementStatus);

  // Partner Management States
  const [partnerSubTab, setPartnerSubTab] = useState<"list" | "settlement">("list");
  const [partnerSearchQuery, setPartnerSearchQuery] = useState<string>("");
  const [isPartnerFormOpen, setIsPartnerFormOpen] = useState<boolean>(false);
  const [isPartnerEditMode, setIsPartnerEditMode] = useState<boolean>(false);
  const [selectedPartner, setSelectedPartner] = useState<any | null>(null);
  const [partnerFormId, setPartnerFormId] = useState<string>("");
  const [partnerFormPw, setPartnerFormPw] = useState<string>("");
  const [partnerFormName, setPartnerFormName] = useState<string>("");
  const [partnerFormPhone, setPartnerFormPhone] = useState<string>("");
  const [partnerFormEmail, setPartnerFormEmail] = useState<string>("");
  const [partnerFormCompanyName, setPartnerFormCompanyName] = useState<string>("");
  const [partnerFormBankName, setPartnerFormBankName] = useState<string>("");
  const [partnerFormAccountNumber, setPartnerFormAccountNumber] = useState<string>("");
  const [partnerFormAccountHolder, setPartnerFormAccountHolder] = useState<string>("");
  const [partnerFormCommission, setPartnerFormCommission] = useState<number>(8000);
  const [partnerFormStatus, setPartnerFormStatus] = useState<string>("활동중");
  const [partnerFormRegDate, setPartnerFormRegDate] = useState<string>("");
  const [partnerFormMemo, setPartnerFormMemo] = useState<string>("");

  // Settlement Management States (HQ Admin)
  const [settlementFilterYearMonth, setSettlementFilterYearMonth] = useState<string>("전체");
  const [selectedSettlementForModal, setSelectedSettlementForModal] = useState<any | null>(null);
  const [settlementStatusEditTarget, setSettlementStatusEditTarget] = useState<any | null>(null);
  const [settlementNewStatus, setSettlementNewStatus] = useState<string>("정산대기");
  const [settlementPaidDate, setSettlementPaidDate] = useState<string>("");
  const [settlementNote, setSettlementNote] = useState<string>("");

  // 가맹점 관리에서 선택할 파트너 ID 상태
  const [storePartnerId, setStorePartnerId] = useState<string>("");

  interface ContractFormType {
    ownerName: string;
    ownerBirth: string;
    ownerPhone: string;
    storeAddress: string;
    storeName: string;
    storeSize: number | string;
    businessArea: string;
    contractStart: string;
    contractEnd: string;
    supervisionFee: number | string;
    initialFranchiseFee: number | string;
    depositMembershipFee: number | string;
    depositEduFee: number | string;
    depositSupportFee: number | string;
    depositGuaranteeFee: number | string;
    depositTotalFee: number | string;
    royaltyFee: number | string;
    guaranteeFee: number | string;
    eduOpenFee: number | string;
    eduNewFee: number | string;
    initialSupplyFee: number | string;
    reFranchiseFee: number | string;
    penaltyFee: number | string;
    status: string;
    fileUrl: string;
    fileName: string;
    contractType: string;
  }

  // Contracts Management States
  const [contracts, setContracts] = useState<any[]>([]);
  const [selectedContract, setSelectedContract] = useState<any | null>(null);
  const [isContractFormOpen, setIsContractFormOpen] = useState<boolean>(false);
  const [isContractEditMode, setIsContractEditMode] = useState<boolean>(false);
  
  const [addressTarget, setAddressTarget] = useState<"store" | "contract">("store");
  const [contractRoadAddress, setContractRoadAddress] = useState<string>("");
  const [contractDetailAddress, setContractDetailAddress] = useState<string>("");
  
  const getInitialContractForm = (): ContractFormType => {
    const now = new Date();
    const startStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const endYear = now.getFullYear() + 2;
    const endStr = `${endYear}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    return {
      ownerName: "",
      ownerBirth: "",
      ownerPhone: "",
      storeAddress: "",
      storeName: "",
      storeSize: "33",
      businessArea: "가맹점 반경 500m 내",
      contractStart: startStr,
      contractEnd: endStr,
      supervisionFee: 0,
      initialFranchiseFee: 2200000,
      depositMembershipFee: 550000,
      depositEduFee: 1100000,
      depositSupportFee: 550000,
      depositGuaranteeFee: 0,
      depositTotalFee: 2200000,
      royaltyFee: 0,
      guaranteeFee: 0,
      eduOpenFee: 1100000,
      eduNewFee: 0,
      initialSupplyFee: 1100000,
      reFranchiseFee: 0,
      penaltyFee: 0,
      status: "기본정보 등록",
      fileUrl: "",
      fileName: "",
      contractType: "신규",
    };
  };
  const [contractForm, setContractForm] = useState<ContractFormType>(getInitialContractForm());

  // Contract Search State & Derived List
  const [contractSearchQuery, setContractSearchQuery] = useState<string>(" ");
  const filteredContracts = contracts.filter((c) =>
    (c.ownerName || "").toLowerCase().includes(contractSearchQuery.trim().toLowerCase()) ||
    (c.storeName || "").toLowerCase().includes(contractSearchQuery.trim().toLowerCase())
  );

  useEffect(() => {
    if (convexContracts) {
      setContracts(convexContracts);
    }
  }, [convexContracts]);

  useEffect(() => {
    if (selectedContract && contracts.length > 0) {
      const updated = contracts.find((c) => c._id === selectedContract._id);
      if (updated && JSON.stringify(updated) !== JSON.stringify(selectedContract)) {
        setSelectedContract(updated);
      }
    }
  }, [contracts, selectedContract]);

  // Formatting and Change handlers for Contract Form
  const formatAutoPhone = (val: string): string => {
    const raw = (val || "").replace(/[^0-9]/g, "");
    if (raw.length <= 3) return raw;
    if (raw.length <= 7) return `${raw.slice(0, 3)}-${raw.slice(3)}`;
    return `${raw.slice(0, 3)}-${raw.slice(3, 7)}-${raw.slice(7, 11)}`;
  };

  const formatAutoBirth = (val: string): string => {
    const raw = (val || "").replace(/[^0-9]/g, "");
    if (raw.length <= 4) return raw;
    if (raw.length <= 6) return `${raw.slice(0, 4)}-${raw.slice(4)}`;
    return `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`;
  };

  const formatPriceInput = (val: any) => {
    if (val === "" || val === undefined || val === null) return "";
    const num = Number(val);
    if (isNaN(num)) return "";
    if (num === 0) return "0";
    return num.toLocaleString();
  };

  const handlePriceChange = (field: string, valueStr: string) => {
    const cleanValue = valueStr.replace(/[^0-9]/g, "");
    const valueToSave = cleanValue === "" ? "" : parseInt(cleanValue);
    
    setContractForm((prev) => {
      const updated = { ...prev, [field]: valueToSave };
      if (field.startsWith("deposit") && field !== "depositTotalFee") {
        const m = updated.depositMembershipFee === "" ? 0 : Number(updated.depositMembershipFee);
        const e = updated.depositEduFee === "" ? 0 : Number(updated.depositEduFee);
        const s = updated.depositSupportFee === "" ? 0 : Number(updated.depositSupportFee);
        const g = updated.depositGuaranteeFee === "" ? 0 : Number(updated.depositGuaranteeFee);
        updated.depositTotalFee = m + e + s + g;
        // Keep initialFranchiseFee in sync with deposit fees
        updated.initialFranchiseFee = m + e + s;
      }
      return updated;
    });
  };

  // Resizable Splitter State for Contract Editor (Default: 60% Preview, 40% Input)
  const [contractSplitRatio, setContractSplitRatio] = useState(60);
  const [isDraggingSplitter, setIsDraggingSplitter] = useState(false);
  const splitContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isDraggingSplitter) return;
    const handleMouseMove = (e: MouseEvent) => {
      if (!splitContainerRef.current) return;
      const rect = splitContainerRef.current.getBoundingClientRect();
      const newRatio = ((e.clientX - rect.left) / rect.width) * 100;
      if (newRatio >= 35 && newRatio <= 68) {
        setContractSplitRatio(Math.round(newRatio * 10) / 10);
      }
    };
    const handleMouseUp = () => {
      setIsDraggingSplitter(false);
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDraggingSplitter]);

  const handleApplyAllDefaults = () => {
    setContractForm((prev) => ({
      ...prev,
      supervisionFee: 0,
      initialFranchiseFee: 2200000,
      depositMembershipFee: 550000,
      depositEduFee: 1100000,
      depositSupportFee: 550000,
      depositGuaranteeFee: 0,
      depositTotalFee: 2200000,
      royaltyFee: 0,
      guaranteeFee: 0,
      eduOpenFee: 1100000,
      eduNewFee: 0,
      initialSupplyFee: 1100000,
      reFranchiseFee: 0,
      penaltyFee: 0,
    }));
    triggerToast("표준 계약 금액(가입비 55만, 교육비 110만, 지원비 55만, 초도물품 110만)이 적용되었습니다.");
  };

  const handleApplyIndividualDefault = (field: string, val: number) => {
    setContractForm((prev) => {
      const updated = { ...prev, [field]: val };
      if (field.startsWith("deposit") && field !== "depositTotalFee") {
        const m = field === "depositMembershipFee" ? val : (prev.depositMembershipFee === "" ? 0 : Number(prev.depositMembershipFee));
        const e = field === "depositEduFee" ? val : (prev.depositEduFee === "" ? 0 : Number(prev.depositEduFee));
        const s = field === "depositSupportFee" ? val : (prev.depositSupportFee === "" ? 0 : Number(prev.depositSupportFee));
        const g = field === "depositGuaranteeFee" ? val : (prev.depositGuaranteeFee === "" ? 0 : Number(prev.depositGuaranteeFee));
        updated.depositTotalFee = m + e + s + g;
        updated.initialFranchiseFee = m + e + s;
      }
      return updated;
    });
  };

  const handleStartEditContract = () => {
    if (!selectedContract) return;

    // Parse combined storeAddress into roadAddress and detailAddress
    const addr = selectedContract.storeAddress || "";
    const match = addr.match(/^([^(]+\([^)]+\))\s*(.*)$/);
    let road = addr;
    let detail = "";
    if (match) {
      road = match[1].trim();
      detail = match[2].trim();
    } else {
      road = addr;
      detail = "";
    }
    setContractRoadAddress(road);
    setContractDetailAddress(detail);

    setContractForm({
      ownerName: selectedContract.ownerName,
      ownerBirth: selectedContract.ownerBirth,
      ownerPhone: selectedContract.ownerPhone,
      storeAddress: selectedContract.storeAddress,
      storeName: selectedContract.storeName,
      storeSize: selectedContract.storeSize,
      businessArea: selectedContract.businessArea,
      contractStart: selectedContract.contractStart,
      contractEnd: selectedContract.contractEnd,
      supervisionFee: selectedContract.supervisionFee,
      initialFranchiseFee: selectedContract.initialFranchiseFee,
      depositMembershipFee: selectedContract.depositMembershipFee,
      depositEduFee: selectedContract.depositEduFee,
      depositSupportFee: selectedContract.depositSupportFee,
      depositGuaranteeFee: selectedContract.depositGuaranteeFee,
      depositTotalFee: selectedContract.depositTotalFee,
      royaltyFee: selectedContract.royaltyFee,
      guaranteeFee: selectedContract.guaranteeFee,
      eduOpenFee: selectedContract.eduOpenFee,
      eduNewFee: selectedContract.eduNewFee,
      initialSupplyFee: selectedContract.initialSupplyFee,
      reFranchiseFee: selectedContract.reFranchiseFee,
      penaltyFee: selectedContract.penaltyFee,
      status: selectedContract.status,
      fileUrl: selectedContract.fileUrl || "",
      fileName: selectedContract.fileName || "",
      contractType: selectedContract.contractType || "신규",
    });
    setIsContractEditMode(true);
    setIsContractFormOpen(true);
  };

  const handleDeleteContractConfirm = () => {
    if (!selectedContract) return;
    if (confirm(`${selectedContract.ownerName} 계약 정보를 정말 삭제하시겠습니까?`)) {
      deleteContractMutation({ id: selectedContract._id })
        .then(() => {
          triggerToast("계약 정보가 삭제되었습니다.");
          setSelectedContract(null);
        })
        .catch((err) => {
          console.error("삭제 실패:", err);
          triggerToast("삭제에 실패했습니다.");
        });
    }
  };

  const handleUpdateContractStatus = (status: string) => {
    if (!selectedContract) return;
    updateContractStatusMutation({ id: selectedContract._id, status })
      .then(() => {
        triggerToast(`계약 상태가 [${status}](으)로 업데이트되었습니다.`);
      })
      .catch((err) => {
        console.error("상태 업데이트 실패:", err);
        triggerToast("상태 업데이트에 실패했습니다.");
      });
  };

  const handleOpenContractSmsModal = (targetContract?: any) => {
    const target = targetContract || selectedContract;
    if (!target) return;
    
    const rawOrigin = typeof window !== "undefined" ? window.location.origin : "https://120pie.com";
    const baseUrl = (rawOrigin && !rawOrigin.includes("localhost") && !rawOrigin.includes("127.0.0.1")) ? rawOrigin : "https://120pie.com";
    const signUrl = `${baseUrl}/contract/${target._id}`;
    
    const defaultMsg = `[120겹파이] 가맹계약서 전자서명 안내\n\n${target.ownerName} 가맹사업자님, 120겹파이(${target.storeName || "가맹점"}) 공식 가맹계약서가 발행되었습니다.\n\n아래 링크를 통해 계약서 전문을 확인하시고 전자서명을 완료해 주시기 바랍니다.\n\n▶ 계약서 확인 및 전자서명:\n${signUrl}\n\n문의사항: 1566-3594`;
    
    const senderPhone = testSenderPhone || (smsSettings?.consultation?.admin?.sender) || "1566-3594";
    
    setContractSmsMsg(defaultMsg);
    setContractSmsSender(senderPhone);
    setIsContractSmsModalOpen(true);
  };

  const handleSendContractSms = async () => {
    if (!selectedContract) return;
    if (!smsSettings || !smsSettings.aligoKey || !smsSettings.aligoUserId) {
      alert("알리고 API Key와 User ID가 설정되어 있지 않습니다. [SMS 설정] 탭에서 알리고 정보를 먼저 등록해 주세요.");
      return;
    }
    if (!selectedContract.ownerPhone) {
      alert("가맹사업자 연락처가 등록되어 있지 않습니다.");
      return;
    }
    if (!contractSmsSender) {
      alert("발신 번호를 입력해 주세요.");
      return;
    }

    try {
      setIsSendingContractSms(true);
      const formattedSender = contractSmsSender.replace(/[^0-9]/g, "");
      const formattedReceiver = selectedContract.ownerPhone.replace(/[^0-9]/g, "");

      const response = await sendSmsAction({
        key: smsSettings.aligoKey,
        userId: smsSettings.aligoUserId,
        sender: formattedSender,
        receiver: formattedReceiver,
        msg: contractSmsMsg,
        isTest: smsSettings.aligoTestMode !== false,
      });

      if (response.success) {
        const now = new Date();
        const sentTimeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
        
        await markContractSentMutation({
          id: selectedContract._id,
          sentAt: sentTimeStr,
        });

        setSelectedContract((prev: any) => prev ? { ...prev, status: "계약서 발송완료", sentAt: sentTimeStr } : prev);
        setIsContractSmsModalOpen(false);
        triggerToast("가맹계약서 안내 문자가 성공적으로 발송되었습니다.");
        
        if (smsSettings.aligoTestMode !== false) {
          alert("전자계약서 안내 문자 발송 성공! (테스트 모드 활성화 상태)");
        } else {
          alert("가맹사업자 휴대폰으로 전자계약서 서명 링크 문자가 성공적으로 발송되었습니다!");
        }
      } else {
        alert(`문자 발송 실패: ${response.message || response.error || "알 수 없는 오류"}`);
      }
    } catch (err: any) {
      console.error("SMS send error:", err);
      alert(`발송 오류: ${err.message || err}`);
    } finally {
      setIsSendingContractSms(false);
    }
  };

  const handleContractSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Format creation time
    const getFormattedDateTime = () => {
      const now = new Date();
      const yyyy = now.getFullYear();
      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const dd = String(now.getDate()).padStart(2, '0');
      const hh = String(now.getHours()).padStart(2, '0');
      const min = String(now.getMinutes()).padStart(2, '0');
      const ss = String(now.getSeconds()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
    };
    
    // Combine road address and detail address
    const combinedAddress = `${contractRoadAddress} ${contractDetailAddress}`.trim();
    if (!combinedAddress) {
      alert("가맹점 주소를 입력하거나 주소 검색 버튼을 눌러주세요.");
      return;
    }

    if (!contractForm.ownerName.trim()) {
      alert("가맹사업자명을 입력해 주세요.");
      return;
    }
    if (!contractForm.ownerPhone.trim()) {
      alert("가맹사업자 연락처를 입력해 주세요.");
      return;
    }
    if (!contractForm.storeName.trim()) {
      alert("가맹점 명칭을 입력해 주세요.");
      return;
    }
    
    const sanitizeNumber = (val: any) => {
      if (val === "" || val === undefined || val === null) return 0;
      const parsed = Number(val);
      return isNaN(parsed) ? 0 : parsed;
    };

    const submitData: any = {
      ownerName: contractForm.ownerName.trim(),
      ownerBirth: contractForm.ownerBirth.trim() || "-",
      ownerPhone: contractForm.ownerPhone.trim(),
      storeAddress: combinedAddress,
      storeName: contractForm.storeName.trim(),
      storeSize: sanitizeNumber(contractForm.storeSize),
      businessArea: contractForm.businessArea.trim() || "가맹점 반경 500m 내",
      contractStart: contractForm.contractStart || getFormattedDateTime().split(" ")[0],
      contractEnd: contractForm.contractEnd || "",
      supervisionFee: sanitizeNumber(contractForm.supervisionFee),
      initialFranchiseFee: sanitizeNumber(contractForm.initialFranchiseFee),
      depositMembershipFee: sanitizeNumber(contractForm.depositMembershipFee),
      depositEduFee: sanitizeNumber(contractForm.depositEduFee),
      depositSupportFee: sanitizeNumber(contractForm.depositSupportFee),
      depositGuaranteeFee: sanitizeNumber(contractForm.depositGuaranteeFee),
      depositTotalFee: sanitizeNumber(contractForm.depositTotalFee) || (
        sanitizeNumber(contractForm.depositMembershipFee) +
        sanitizeNumber(contractForm.depositEduFee) +
        sanitizeNumber(contractForm.depositSupportFee) +
        sanitizeNumber(contractForm.depositGuaranteeFee)
      ),
      royaltyFee: sanitizeNumber(contractForm.royaltyFee),
      guaranteeFee: sanitizeNumber(contractForm.guaranteeFee),
      eduOpenFee: sanitizeNumber(contractForm.eduOpenFee),
      eduNewFee: sanitizeNumber(contractForm.eduNewFee),
      initialSupplyFee: sanitizeNumber(contractForm.initialSupplyFee),
      reFranchiseFee: sanitizeNumber(contractForm.reFranchiseFee),
      penaltyFee: sanitizeNumber(contractForm.penaltyFee),
      status: contractForm.status || "기본정보 등록",
      contractType: contractForm.contractType || "신규",
      createdAt: isContractEditMode && selectedContract ? selectedContract.createdAt : getFormattedDateTime(),
    };

    if (contractForm.fileUrl) submitData.fileUrl = contractForm.fileUrl;
    if (contractForm.fileName) submitData.fileName = contractForm.fileName;

    if (isContractEditMode && selectedContract) {
      submitData.id = selectedContract._id;
      if (selectedContract.signatureImage) submitData.signatureImage = selectedContract.signatureImage;
      if (selectedContract.signedAt) submitData.signedAt = selectedContract.signedAt;
      if (selectedContract.sentAt) submitData.sentAt = selectedContract.sentAt;
      if (selectedContract.signerIp) submitData.signerIp = selectedContract.signerIp;
      if (selectedContract.agreeTerms !== undefined) submitData.agreeTerms = selectedContract.agreeTerms;
      if (selectedContract.agreePrivacy !== undefined) submitData.agreePrivacy = selectedContract.agreePrivacy;
      if (selectedContract.agreeSupplies !== undefined) submitData.agreeSupplies = selectedContract.agreeSupplies;
    }
    
    saveContractMutation(submitData)
      .then((res) => {
        triggerToast(isContractEditMode ? "계약 정보가 수정되었습니다." : "신규 계약 정보가 등록되었습니다.");
        setIsContractFormOpen(false);
        if (res && res.contractId) {
          const newOrUpdated = { ...submitData, _id: res.contractId };
          setSelectedContract(newOrUpdated as any);
        }
      })
      .catch((err) => {
        console.error("계약 정보 저장 실패:", err);
        alert(`계약 정보 저장 중 오류가 발생했습니다: ${err.message || err}`);
      });
  };

  const numberToKorean = (num: number): string => {
    const units = ["", "십", "백", "천"];
    const gUnits = ["", "만", "억", "조"];
    const numChars = ["", "일", "이", "삼", "사", "오", "육", "칠", "팔", "구"];
    
    if (num === 0) return "영";
    
    let result = "";
    let part = num;
    let gIndex = 0;
    while (part > 0) {
      const chunk = part % 10000;
      part = Math.floor(part / 10000);
      
      if (chunk === 0) {
        gIndex++;
        continue;
      }
      
      let chunkResult = "";
      let chunkPart = chunk;
      for (let i = 0; i < 4; i++) {
        const digit = chunkPart % 10;
        chunkPart = Math.floor(chunkPart / 10);
        
        if (digit > 0) {
          let digitStr = numChars[digit];
          if (digit === 1 && i > 0) {
            digitStr = ""; // Omit "일" for 10, 100, 1000
          }
          chunkResult = digitStr + units[i] + chunkResult;
        }
      }
      
      result = chunkResult + gUnits[gIndex] + result;
      gIndex++;
    }
    
    return result;
  };

  const getFormattedKoreanAmount = (num: any, defaultText: string) => {
    if (num === "" || num === undefined || num === null) return defaultText;
    const n = Number(num);
    if (isNaN(n)) return defaultText;
    if (n === 0) return `일금영원(￦0)`;
    const kor = numberToKorean(n);
    return `일금${kor}원(￦${n.toLocaleString()})`;
  };

  const handleCopyText = (text: string, label: string) => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        triggerToast(`${label}이(가) 복사되었습니다.`);
      }).catch(err => {
        console.error("복사 실패:", err);
      });
    }
  };

  const renderAmountInput = (field: string, label: string, defaultVal: number, placeholderStr: string) => {
    const value = (contractForm as any)[field];
    const hasValue = value !== "" && value !== undefined && value !== null;
    return (
      <div key={field} className="space-y-1.5 min-w-0 w-full">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-black text-[#0F172A] border-l-2 border-slate-400 pl-1.5 mb-0.5">{label}</label>
          <button
            type="button"
            onClick={() => handleApplyIndividualDefault(field, defaultVal)}
            className="text-[10px] text-slate-700 font-bold border-0 bg-slate-100 hover:bg-slate-200 px-2.5 py-0.5 rounded-lg transition-all cursor-pointer shadow-2xs"
          >
            기본적용
          </button>
        </div>
        <div className="relative">
          <input
            type="text"
            value={formatPriceInput(value)}
            onChange={(e) => handlePriceChange(field, e.target.value)}
            className="w-full px-3.5 py-2.5 pr-8 border-0 rounded-md text-xs focus:outline-none font-bold text-[#0F172A] bg-[#F8F9FA] shadow-2xs placeholder-slate-400"
            placeholder={formatPriceInput(defaultVal)}
          />
          <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 font-bold">원</span>
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-[11px] text-[#0F172A] font-semibold bg-[#F8F9FA] border-0 rounded-md p-2.5 mt-0.5 shadow-2xs">
            {getFormattedKoreanAmount(value, placeholderStr)}
          </div>
          {!hasValue && (
            <span className="text-[10px] text-amber-600 font-bold flex items-center gap-1 pl-1">
              ⚠️ 기본적용을 원하시면 우측의 '기본적용' 버튼을 누르거나 직접 숫자를 기입해주세요.
            </span>
          )}
        </div>
      </div>
    );
  };

  const renderTableAmountInput = (field: string, label: string, defaultVal: number) => {
    const value = (contractForm as any)[field];
    const hasValue = value !== "" && value !== undefined && value !== null;
    return (
      <div key={field} className="space-y-1 min-w-0 w-full">
        <div className="flex items-center justify-between">
        </div>
        {!hasValue && (
          <span className="text-[9px] text-rose-500 font-bold block pl-1">
            ⚠️ 미입력 상태 (기본값: {formatPriceInput(defaultVal)}원)
          </span>
        )}
      </div>
    );
  };

  const renderDetailRow = (label: string, val: string) => {
    return (
      <div className="flex items-center justify-between py-2 border-b border-slate-100 last:border-b-0 min-w-0 w-full gap-2">
        <span className="font-bold text-slate-500 w-32 sm:w-40 lg:w-48 shrink-0 text-left truncate" title={label}>{label}</span>
        <span className="font-extrabold text-[#0F172A] text-right flex-1 break-all min-w-0 mr-1 sm:mr-3">{val}</span>
        <button
          type="button"
          onClick={() => handleCopyText(val, label)}
          className="text-[10px] text-slate-700 font-extrabold border-0 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-md transition-all shrink-0 cursor-pointer shadow-2xs"
        >
          복사
        </button>
      </div>
    );
  };

  const renderTableDetailRow = (label: string, val: number) => {
    const formattedVal = val.toLocaleString();
    return (
      <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors text-xs">
        <td className="p-2 border-r border-slate-100 font-bold text-slate-600">{label}</td>
        <td className="p-2 font-extrabold text-[#0F172A]">
          <div className="flex items-center justify-between gap-2">
            <span>{formattedVal}</span>
            <button
              type="button"
              onClick={() => handleCopyText(formattedVal, label)}
              className="text-[10px] text-slate-700 font-extrabold border-0 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded-md transition-all cursor-pointer shrink-0 shadow-2xs"
            >
              복사
            </button>
          </div>
        </td>
      </tr>
    );
  };

  // Gallery Management States
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [galleryCategories, setGalleryCategories] = useState<string[]>([]);
  const [selectedGalleryCategory, setSelectedGalleryCategory] = useState<string>("전체");
  
  // Gallery Form / modal states
  const [showGalleryModal, setShowGalleryModal] = useState<boolean>(false);
  const [keepGalleryModalOpen, setKeepGalleryModalOpen] = useState<boolean>(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [selectedGalleryItem, setSelectedGalleryItem] = useState<GalleryItem | null>(null);
  
  const [galleryItemName, setGalleryItemName] = useState<string>("");
  const [galleryItemCategory, setGalleryItemCategory] = useState<string>("");
  const [galleryItemUrl, setGalleryItemUrl] = useState<string>("");
  const [galleryUploadMethod, setGalleryUploadMethod] = useState<"url" | "file">("url");
  const [newGalleryCategoryName, setNewGalleryCategoryName] = useState<string>("");

  // Helper to safely write to localStorage without throwing QuotaExceededError
  const safeSaveGalleryItems = (items: GalleryItem[]) => {
    try {
      localStorage.setItem("120_gallery_items", JSON.stringify(items));
    } catch (e) {
      console.warn("[LocalStorage] Quota exceeded for gallery items backup, but successfully synced to Convex cloud database:", e);
    }
  };

  // Selected Detail Modals / Control flags
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [inquiryAnswerText, setInquiryAnswerText] = useState<string>("");

  // Notice Creation Form states
  const [showNoticeModal, setShowNoticeModal] = useState<boolean>(false);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const submittedCredentials = useQuery(api.deliveryCredentials.getByNotice, {
    noticeId: selectedNotice?.id || "",
  });
  const [newNoticeTag, setNewNoticeTag] = useState<"필독" | "일반" | "이벤트" | "물류">("일반");
  const [newNoticeTitle, setNewNoticeTitle] = useState<string>("");
  const [newNoticeContent, setNewNoticeContent] = useState<string>("");

  // Material Creation Form states
  const [showMaterialModal, setShowMaterialModal] = useState<boolean>(false);
  const [materialType, setMaterialType] = useState<"training" | "pr">("training");
  const [newMaterialTitle, setNewMaterialTitle] = useState<string>("");
  const [newMaterialFormat, setNewMaterialFormat] = useState<string>("PDF");
  const [newMaterialSize, setNewMaterialSize] = useState<string>("15.5 MB");
  const [newMaterialDesc, setNewMaterialDesc] = useState<string>("");
  const [newMaterialImg, setNewMaterialImg] = useState<string>("");
  const [newMaterialFileUrl, setNewMaterialFileUrl] = useState<string>("");
  const [newMaterialFileName, setNewMaterialFileName] = useState<string>("");
  const [newMaterialStorageId, setNewMaterialStorageId] = useState<string>("");
  const [isUploadingMaterialFile, setIsUploadingMaterialFile] = useState<boolean>(false);

  // 1. STORE MANAGEMENT STATES
  const [selectedStore, setSelectedStore] = useState<StoreInfo | null>(null);
  const [showStoreModal, setShowStoreModal] = useState<boolean>(false);
  
  // Store form fields
  const [storeLoginId, setStoreLoginId] = useState<string>("");
  const [storePw, setStorePw] = useState<string>("");
  const [storePwConfirm, setStorePwConfirm] = useState<string>("");
  const [storeName, setStoreName] = useState<string>("");
  const [storeOwner, setStoreOwner] = useState<string>("");
  const [storePhone, setStorePhone] = useState<string>("");
  const [storeStatus, setStoreStatus] = useState<"승인" | "대기" | "보류" | "중지" | "취소">("대기");
  const [storeRoadAddress, setStoreRoadAddress] = useState<string>("");
  const [storeDetailAddress, setStoreDetailAddress] = useState<string>("");
  const [storeRegDate, setStoreRegDate] = useState<string>("");
  const [storeCancelDate, setStoreCancelDate] = useState<string>("");
  const [storeAdoptionMenu, setStoreAdoptionMenu] = useState<string[]>([]);

  // Store management filter, sort and view mode states
  const [storeSearchQuery, setStoreSearchQuery] = useState<string>("");
  const [storeStatusFilter, setStoreStatusFilter] = useState<string>("전체");
  const [storeSortOrder, setStoreSortOrder] = useState<"latest" | "oldest">("latest");
  const [storeViewMode, setStoreViewMode] = useState<"1col" | "2col" | "3col">("3col");

  // Computed filtered and sorted stores (Default: Latest registration date on top)
  const filteredAndSortedStores = useMemo(() => {
    return stores
      .filter((store) => {
        // Status filter
        if (storeStatusFilter !== "전체" && store.status !== storeStatusFilter) {
          return false;
        }
        // Search query filter
        if (storeSearchQuery.trim()) {
          const q = storeSearchQuery.trim().toLowerCase();
          const matchName = store.name?.toLowerCase().includes(q);
          const matchId = store.id?.toLowerCase().includes(q);
          const matchOwner = store.owner?.toLowerCase().includes(q);
          const matchPhone = store.phone?.toLowerCase().includes(q);
          const matchAddress = `${store.roadAddress || ""} ${store.detailAddress || ""}`.toLowerCase().includes(q);
          if (!matchName && !matchId && !matchOwner && !matchPhone && !matchAddress) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        const dateA = a.regDate || "0000-00-00";
        const dateB = b.regDate || "0000-00-00";
        if (storeSortOrder === "latest") {
          return dateB.localeCompare(dateA);
        } else {
          return dateA.localeCompare(dateB);
        }
      });
  }, [stores, storeStatusFilter, storeSearchQuery, storeSortOrder]);

  // Road Address Search Simulation
  const [showAddressPopup, setShowAddressPopup] = useState<boolean>(false);
  const [addressTab, setAddressTab] = useState<"kakao" | "simulated">("kakao");
  const [addressSearchKeyword, setAddressSearchKeyword] = useState<string>("");
  const [addressSearchResults, setAddressSearchResults] = useState<string[]>([]);

  // 2. PRODUCT MANAGEMENT STATES
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductModal, setShowProductModal] = useState<boolean>(false);
  const [isProductSaving, setIsProductSaving] = useState<boolean>(false);
  const [productOptions, setProductOptions] = useState<string[]>([]);
  const [newProductOption, setNewProductOption] = useState<string>("");

  // Product form fields
  const [productCategory, setProductCategory] = useState<string>("");
  const [productName, setProductName] = useState<string>("");
  const [productModelName, setProductModelName] = useState<string>("");
  const [productUnit, setProductUnit] = useState<"개" | "박스" | "kg" | "SET" | "EA" | "대">("박스");
  const [productQty, setProductQty] = useState<number>(1);
  const [productSupplyPrice, setProductSupplyPrice] = useState<string>("0");
  const [productPrice, setProductPrice] = useState<string>("0");
  const [productDiscountAmount, setProductDiscountAmount] = useState<string>("0");
  const [productImg, setProductImg] = useState<string>("");
  const [productDetailImg, setProductDetailImg] = useState<string>("");
  const [productDetailText, setProductDetailText] = useState<string>("");
  const [productIsActive, setProductIsActive] = useState<boolean>(true);
  const [productStatus, setProductStatus] = useState<"판매중" | "품절" | "단종">("판매중");
  const [productShippingType, setProductShippingType] = useState<"free" | "A" | "B" | "C" | "BOX">("A");

  // Product Search & Filter States
  const [adminProductSearch, setAdminProductSearch] = useState<string>("");
  const [adminProductCategoryFilter, setAdminProductCategoryFilter] = useState<string>("전체");

  // Product Drag & Drop States
  const [draggedProductId, setDraggedProductId] = useState<string | null>(null);
  const [dragOverProductId, setDragOverProductId] = useState<string | null>(null);
  const draggedProductRef = useRef<string | null>(null);

  // Category list settings
  const [showCategoryPanel, setShowCategoryPanel] = useState<boolean>(false);
  const [newCategoryName, setNewCategoryName] = useState<string>("");

  // Label management states
  const [labels, setLabels] = useState<string[]>([]);
  const [newLabelName, setNewLabelName] = useState<string>("");
  const [showLabelPanel, setShowLabelPanel] = useState<boolean>(false);
  const [productLabels, setProductLabels] = useState<string[]>([]);

  // Shipping and Return Policy states
  const [shippingPolicy, setShippingPolicy] = useState<string>("");
  const [returnPolicy, setReturnPolicy] = useState<string>("");
  const [shippingFeeA, setShippingFeeA] = useState<string>("3,000");
  const [shippingFeeB, setShippingFeeB] = useState<string>("4,000");
  const [shippingFeeC, setShippingFeeC] = useState<string>("5,000");
  const [shippingFeeBox, setShippingFeeBox] = useState<string>("6,000");
  const [showPolicyPanel, setShowPolicyPanel] = useState<boolean>(false);

  // 3. BANNER CONTROL STATES
  const [bannerMainTag, setBannerMainTag] = useState<string>("");
  const [bannerMainTitle, setBannerMainTitle] = useState<string>("");
  const [bannerMainDesc, setBannerMainDesc] = useState<string>("");
  const [bannerMainBtnText, setBannerMainBtnText] = useState<string>("신메뉴 자재 발주하러 가기");
  const [bannerMainLink, setBannerMainLink] = useState<string>("order");
  const [bannerSideTag, setBannerSideTag] = useState<string>("");
  const [bannerSideTitle, setBannerSideTitle] = useState<string>("");
  const [bannerSideDesc, setBannerSideDesc] = useState<string>("");
  const [bannerSideBtnText, setBannerSideBtnText] = useState<string>("");
  const [bannerMainImage, setBannerMainImage] = useState<string>("");
  const [bannerSideImage, setBannerSideImage] = useState<string>("");
  const [bannerSideLink, setBannerSideLink] = useState<string>("training");

  // SUB MENU & REAL-TIME POPUP & FLOATING STATES
  const [bannerSubMenu, setBannerSubMenu] = useState<"banner" | "popup" | "floating" | "instagram">("banner");

  // Instagram Management States
  const [instaId, setInstaId] = useState<string | null>(null);
  const [instaImg, setInstaImg] = useState("");
  const [instaText, setInstaText] = useState("");
  const [instaLink, setInstaLink] = useState("");
  const [instaDate, setInstaDate] = useState("");
  const [instaOrder, setInstaOrder] = useState(1);
  const [instaIsMain, setInstaIsMain] = useState(false);
  const [isInstaModalOpen, setIsInstaModalOpen] = useState(false);
  const [isRefreshingInstaHd, setIsRefreshingInstaHd] = useState(false);
  
  // Instagram Drag & Drop Reorder States
  const [draggedInstaIndex, setDraggedInstaIndex] = useState<number | null>(null);
  const [dragOverInstaIndex, setDragOverInstaIndex] = useState<number | null>(null);
  const [localInstaList, setLocalInstaList] = useState<any[]>([]);

  useEffect(() => {
    if (convexInstagram) {
      const sorted = [...convexInstagram].sort((a, b) => a.orderIndex - b.orderIndex);
      setLocalInstaList(sorted);
    }
  }, [convexInstagram]);
  
  // Popup States
  const [showPopupModal, setShowPopupModal] = useState<boolean>(false);
  const [selectedPopupForEdit, setSelectedPopupForEdit] = useState<any | null>(null);
  const [popupStartDate, setPopupStartDate] = useState<string>("");
  const [popupEndDate, setPopupEndDate] = useState<string>("");
  const [popupTargetPage, setPopupTargetPage] = useState<string>("all");

  const [popupActive, setPopupActive] = useState<boolean>(true);
  const [popupTitle, setPopupTitle] = useState<string>("");
  const [popupDesc, setPopupDesc] = useState<string>("");
  const [popupImage, setPopupImage] = useState<string>("");
  const [popupLink, setPopupLink] = useState<string>("");
  const [popupBtnText, setPopupBtnText] = useState<string>("");
  const [popupTitleColor, setPopupTitleColor] = useState<string>("#ffffff");
  const [popupTitleSize, setPopupTitleSize] = useState<string>("18px");
  const [popupDescColor, setPopupDescColor] = useState<string>("#735965");
  const [popupDescSize, setPopupDescSize] = useState<string>("12px");
  const [popupBtnBgColor, setPopupBtnBgColor] = useState<string>("#f25f8a");
  const [popupBtnTextColor, setPopupBtnTextColor] = useState<string>("#ffffff");
  const [popupBtnTextSize, setPopupBtnTextSize] = useState<string>("12px");

  // Floating button States
  const [floatingActive, setFloatingActive] = useState<boolean>(true);
  const [floatingInsta, setFloatingInsta] = useState<string>("");
  const [floatingYoutube, setFloatingYoutube] = useState<string>("");
  const [floatingChat, setFloatingChat] = useState<string>("");
  const [floatingPhone, setFloatingPhone] = useState<string>("");
  const [floatingKakao, setFloatingKakao] = useState<string>("");
  const [floatingBlog, setFloatingBlog] = useState<string>("");

  // 4. ORDER DETAILS POPUP & SETTING STATES
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderModal, setShowOrderModal] = useState<boolean>(false);
  const [selectedCourier, setSelectedCourier] = useState<string>("CJ대한통운");
  const [inputTrackingNo, setInputTrackingNo] = useState<string>("");
  const [modalTrackingList, setModalTrackingList] = useState<{ courier: string; trackingNo: string }[]>([]);

  // Admin back navigation handling (Modals -> close modal; Back button anywhere in admin -> ask Exit/Gate modal)
  useModalBackHandler("admin-order-modal", showOrderModal, () => setShowOrderModal(false));
  useModalBackHandler("admin-product-modal", showProductModal, () => setShowProductModal(false));
  useModalBackHandler("admin-notice-modal", showNoticeModal, () => setShowNoticeModal(false));
  useModalBackHandler("admin-store-modal", showStoreModal, () => setShowStoreModal(false));
  useModalBackHandler("admin-material-modal", showMaterialModal, () => setShowMaterialModal(false));
  useModalBackHandler("admin-gallery-modal", showGalleryModal, () => setShowGalleryModal(false));
  useModalBackHandler("admin-popup-modal", showPopupModal, () => setShowPopupModal(false));
  useModalBackHandler("admin-insta-modal", isInstaModalOpen, () => setIsInstaModalOpen(false));
  useModalBackHandler("admin-inquiry-modal", !!selectedInquiry, () => setSelectedInquiry(null));
  useModalBackHandler("admin-consultation-modal", !!selectedConsultation, () => setSelectedConsultation(null));
  useModalBackHandler("admin-contract-modal", !!selectedContract, () => setSelectedContract(null));


  // 발주 필터링 및 통합검색, 엑셀 내보내기 헬퍼 상태
  const [orderSearchKeyword, setOrderSearchKeyword] = useState<string>("");
  const [orderDateFilterType, setOrderDateFilterType] = useState<string>("all"); // all, today, yesterday, week, month, prev_month, custom
  const [orderStartDate, setOrderStartDate] = useState<string>("");
  const [orderEndDate, setOrderEndDate] = useState<string>("");

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

  // 발주 필터링 연산
  const getFilteredOrders = () => {
    const list = orders.filter((order: Order) => {
      const storeInfo = stores.find(s => s.id === order.storeId) || {
        name: order.storeId === "owner" ? "본사 테스트" : "강남역삼점",
        owner: "홍길동",
        phone: "010-1234-5678",
        roadAddress: "서울시 강남구 테헤란로 123",
        detailAddress: "1층",
      };
      const storeAddress = `${storeInfo.roadAddress} ${storeInfo.detailAddress}`;

      // 1. 통합검색 (주문번호, 가맹점명, 점주명, 연락처, 주소, 주문 품목)
      if (orderSearchKeyword.trim() !== "") {
        const query = orderSearchKeyword.toLowerCase();
        const matchesId = order.id.toLowerCase().includes(query);
        const matchesStoreName = storeInfo.name.toLowerCase().includes(query);
        const matchesOwner = storeInfo.owner.toLowerCase().includes(query);
        const matchesPhone = storeInfo.phone.toLowerCase().includes(query);
        const matchesAddress = storeAddress.toLowerCase().includes(query);
        const matchesItems = order.items.some(it => it.productName.toLowerCase().includes(query));
        
        if (!matchesId && !matchesStoreName && !matchesOwner && !matchesPhone && !matchesAddress && !matchesItems) {
          return false;
        }
      }

      // 2. 기간선택 필터
      if (orderDateFilterType !== "all") {
        const today = new Date();
        const getFormattedDate = (d: Date) => d.toISOString().split("T")[0];
        const orderDateOnly = order.date ? order.date.split(" ")[0].split("T")[0] : "";
        
        let start = "";
        let end = "";
        
        if (orderDateFilterType === "today") {
          start = getFormattedDate(today);
          end = getFormattedDate(today);
        } else if (orderDateFilterType === "yesterday") {
          const yesterday = new Date();
          yesterday.setDate(today.getDate() - 1);
          start = getFormattedDate(yesterday);
          end = getFormattedDate(yesterday);
        } else if (orderDateFilterType === "week") {
          const weekAgo = new Date();
          weekAgo.setDate(today.getDate() - 7);
          start = getFormattedDate(weekAgo);
          end = getFormattedDate(today);
        } else if (orderDateFilterType === "month") {
          const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
          start = getFormattedDate(firstDayOfMonth);
          end = getFormattedDate(today);
        } else if (orderDateFilterType === "prev_month") {
          const firstDayOfPrevMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
          const lastDayOfPrevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
          start = getFormattedDate(firstDayOfPrevMonth);
          end = getFormattedDate(lastDayOfPrevMonth);
        } else if (orderDateFilterType === "custom") {
          start = orderStartDate;
          end = orderEndDate;
        }

        if (start && orderDateOnly < start) return false;
        if (end && orderDateOnly > end) return false;
      }

      return true;
    });

    // 최신 신청일자/시간순 내림차순 정렬
    return list.sort((a: Order, b: Order) => {
      const dateA = a.date || "";
      const dateB = b.date || "";
      if (dateA !== dateB) {
        return dateB.localeCompare(dateA);
      }
      return (b.id || "").localeCompare(a.id || "");
    });
  };

  const filteredOrders = getFilteredOrders();

  // 엑셀(CSV) 다운로드 헬퍼
  const handleExcelDownload = () => {
    if (filteredOrders.length === 0) {
      alert("다운로드할 발주 내역이 존재하지 않습니다.");
      return;
    }

    const headers = ["신청일자", "주문번호", "가맹점명", "점주명", "연락처", "주소", "주문품목", "결제대금", "결제방식", "진행상태"];
    const rows = filteredOrders.map((order) => {
      const storeInfo = stores.find(s => s.id === order.storeId) || {
        name: order.storeId === "owner" ? "본사 테스트" : "강남역삼점",
        owner: "홍길동",
        phone: "010-1234-5678",
        roadAddress: "서울시 강남구 테헤란로 123",
        detailAddress: "1층",
      };
      const storeAddress = `${storeInfo.roadAddress} ${storeInfo.detailAddress}`;
      const itemDetails = order.items.map(it => `${it.productName}(${it.quantity}개)`).join(" / ");
      const payMethodStr = order.payMethod === "card" || order.payMethod === "CARD" ? "카드" : "현금";
      
      return [
        formatOrderDate(order.date, (order as any)._creationTime),
        order.id,
        storeInfo.name,
        storeInfo.owner,
        storeInfo.phone,
        `"${storeAddress.replace(/"/g, '""')}"`,
        `"${itemDetails.replace(/"/g, '""')}"`,
        order.totalPrice,
        payMethodStr,
        order.status
      ];
    });

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    
    const todayStr = new Date().toISOString().split("T")[0];
    link.setAttribute("download", `120겹파이_발주내역_${todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast("발주 내역 엑셀 다운로드가 완료되었습니다!");
  };
  
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

  // Settings & Status Management States
  const [deliveryStatuses, setDeliveryStatuses] = useState<string[]>(["주문완료", "배송준비중", "배송중", "배송완료"]);
  const [newStatusName, setNewStatusName] = useState<string>("");
  const [adminIdSetting, setAdminIdSetting] = useState<string>("admin");
  const [adminPwSetting, setAdminPwSetting] = useState<string>("");
  const [adminPwSettingConfirm, setAdminPwSettingConfirm] = useState<string>("");
  const [naverClientIdSetting, setNaverClientIdSetting] = useState<string>("");
  const [termsOfUseSetting, setTermsOfUseSetting] = useState<string>("");
  const [privacyPolicySetting, setPrivacyPolicySetting] = useState<string>("");
  const [refundPolicySetting, setRefundPolicySetting] = useState<string>("");
  const [statusColors, setStatusColors] = useState<Record<string, string>>(DEFAULT_STATUS_COLORS);
  const [smsSettings, setSmsSettings] = useState<any>(null);
  const [newAdminPhoneInputs, setNewAdminPhoneInputs] = useState<Record<string, string>>({});
  const [testReceiverPhone, setTestReceiverPhone] = useState<string>("");
  const [testSenderPhone, setTestSenderPhone] = useState<string>("");
  const [isTestingSms, setIsTestingSms] = useState<boolean>(false);

  // Toast and navigation
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // ==========================================
  // INITIALIZATION & DYNAMIC STORAGE PULLING
  // ==========================================
  // ==========================================
  // INITIALIZATION & DYNAMIC STORAGE PULLING
  // ==========================================
  useEffect(() => {
    if (typeof window !== "undefined") {
      const loadState = (key: string, defaultData: any) => {
        const stored = localStorage.getItem(key);
        if (stored) {
          try {
            return JSON.parse(stored);
          } catch (e) {
            console.error(e);
          }
        }
        localStorage.setItem(key, JSON.stringify(defaultData));
        return defaultData;
      };

      setOrders(loadState("120_orders", []));
      setInquiries(loadState("120_inquiries", []));
      setNotices(loadState("120_notices", []));
      setTrainings(loadState("120_trainings", []));
      setPrs(loadState("120_prs", DEFAULT_PRS));

      // Settings and Status Load
      const ds = loadState("120_delivery_statuses", ["주문완료", "배송준비중", "배송중", "배송완료"]);
      setDeliveryStatuses(ds);
      const storedAdminId = localStorage.getItem("120_admin_id") || "admin";
      setAdminIdSetting(storedAdminId);
      const storedNaverKey = localStorage.getItem("120_naver_client_id") || "";
      setNaverClientIdSetting(storedNaverKey);
      const storedTerms = localStorage.getItem("120_terms_of_use") || DEFAULT_TERMS;
      setTermsOfUseSetting(storedTerms);
      const storedPrivacy = localStorage.getItem("120_privacy_policy") || DEFAULT_PRIVACY;
      setPrivacyPolicySetting(storedPrivacy);
      const storedRefund = localStorage.getItem("120_refund_policy") || DEFAULT_REFUND;
      setRefundPolicySetting(storedRefund);
      const storedColors = loadState("120_status_colors", DEFAULT_STATUS_COLORS);
      setStatusColors(storedColors);

      const DEFAULT_SMS_SETTINGS = {
        aligoKey: "",
        aligoUserId: "",
        aligoTestMode: true,
        store_reg: {
          customer: {
            isActive: true,
            sender: "02-120-1200",
            template: "[120겹파이] 가맹점 등록 신청이 완료되었습니다. 본사 검토 후 연락드리겠습니다. ID: {storeId}, 가맹점명: {storeName}."
          },
          admin: {
            isActive: true,
            sender: "02-120-1200",
            receivers: ["010-3813-1200"],
            template: "[120겹파이] 신규 가맹점 등록 신청이 접수되었습니다. ID: {storeId}, 가맹점명: {storeName}, 점주명: {owner}, 연락처: {phone}."
          }
        },
        order_card: {
          customer: {
            isActive: true,
            sender: "02-120-1200",
            template: "[120겹파이] 카드 결제 자재 주문이 정상 완료되었습니다. 주문ID: {orderId}, 결제금액: {amount}원. 신속하게 배송해 드리겠습니다."
          },
          admin: {
            isActive: true,
            sender: "02-120-1200",
            receivers: ["010-3813-1200"],
            template: "[120겹파이] {storeName} 가맹점의 카드 결제 자재 발주가 완료되었습니다. 주문ID: {orderId}, 금액: {amount}원."
          }
        },
        order_cash: {
          customer: {
            isActive: true,
            sender: "02-120-1200",
            template: "[120겹파이] 무통장입금 자재 주문이 접수되었습니다. 주문ID: {orderId}, 입금예정금액: {amount}원. K뱅크 700-120-270001 (주)고우웰라이프. 입금 확인 시 배송이 개시됩니다."
          },
          admin: {
            isActive: true,
            sender: "02-120-1200",
            receivers: ["010-3813-1200"],
            template: "[120겹파이] {storeName} 가맹점의 무통장입금 자재 발주가 신청되었습니다. 주문ID: {orderId}, 금액: {amount}원. 입금 확인이 필요합니다."
          }
        },
        consultation: {
          customer: {
            isActive: true,
            sender: "02-120-1200",
            template: "[120겹파이] 무료 가맹 상담 신청이 정상 접수되었습니다. 빠른 시간 내에 전문 컨설턴트가 연락드리겠습니다. 신청자: {name}님."
          },
          admin: {
            isActive: true,
            sender: "02-120-1200",
            receivers: ["010-3813-1200"],
            template: "[120겹파이] 홈페이지에 새로운 상담문의가 접수되었습니다. 이름: {name}, 연락처: {phone}, 점포유형: {storeType}."
          }
        },
        inquiry_1to1: {
          customer: {
            isActive: true,
            sender: "02-120-1200",
            template: "[120겹파이] 1:1 문의가 성공적으로 접수되었습니다. 담당 부서 확인 후 빠르게 답변드리겠습니다. 문의유형: {category}, 제목: {title}."
          },
          admin: {
            isActive: true,
            sender: "02-120-1200",
            receivers: ["010-3813-1200"],
            template: "[120겹파이] {storeName} 가맹점에서 새로운 1:1 문의를 등록했습니다. 제목: {title}, 유형: {category}."
          }
        }
      };

      const sms = loadState("120_sms_settings", DEFAULT_SMS_SETTINGS);
      const healedSms = { ...DEFAULT_SMS_SETTINGS, ...sms };
      ["store_reg", "order_card", "order_cash", "consultation", "inquiry_1to1"].forEach((key) => {
        if (!healedSms[key] || !healedSms[key].customer || !healedSms[key].admin) {
          healedSms[key] = DEFAULT_SMS_SETTINGS[key as keyof typeof DEFAULT_SMS_SETTINGS];
        }
      });
      setSmsSettings(healedSms);
      setTestSenderPhone(healedSms.store_reg?.admin?.sender || "02-120-1200");

      // Seeds
      const st = loadState("120_stores", DEFAULT_STORES);
      setStores(st);
      
      let pr = loadState("120_products", []);
      // Filter out legacy mock seed products (prod-1 to prod-6) to ensure they are completely deleted
      pr = pr.filter((p: any) => p && !["prod-1", "prod-2", "prod-3", "prod-4", "prod-5", "prod-6"].includes(p.id));

      const healedPr = pr.map((p: any) => ({
        id: p.id || `prod-${Math.floor(100 + Math.random() * 900)}`,
        orderIndex: typeof p.orderIndex === "number" ? p.orderIndex : 99,
        name: p.name || "이름 없는 상품",
        category: p.category || "냉동생지/자재",
        modelName: p.modelName || `MODEL-${p.id || "GENERIC"}`,
        unit: p.unit || "박스",
        qty: typeof p.qty === "number" ? p.qty : 1,
        supplyPrice: typeof p.supplyPrice === "number" ? p.supplyPrice : 0,
        price: typeof p.price === "number" ? p.price : 0,
        discountAmount: typeof p.discountAmount === "number" ? p.discountAmount : 0,
        discountedPrice: typeof p.discountedPrice === "number" ? p.discountedPrice : (typeof p.price === "number" ? p.price : 0),
        img: p.img || "",
        detailImg: p.detailImg || "",
        detailText: p.detailText || "",
        isActive: typeof p.isActive === "boolean" ? p.isActive : true,
        desc: p.desc || "",
        stock: p.stock || "in_stock",
        status: p.status || (p.isActive !== false ? (p.stock === "out_of_stock" ? "품절" : "판매중") : "단종"),
        labels: Array.isArray(p.labels) ? p.labels : [],
        shippingType: p.shippingType || "A",
        options: p.options || undefined
      }));

      const sortedPr = [...healedPr].sort((a: any, b: any) => a.orderIndex - b.orderIndex);
      setProducts(sortedPr);
      localStorage.setItem("120_products", JSON.stringify(healedPr));
      const cat = loadState("120_categories", ["냉동생지/자재", "부자재/포장재", "소모품/집기"]);
      setCategories(cat);
      const lab = loadState("120_labels", ["BEST", "추천", "신제품"]);
      setLabels(lab);
      
      const bnr = loadState("120_banners", DEFAULT_BANNER) || DEFAULT_BANNER;
      setBanner(bnr);

      const pop = loadState("120_popups", DEFAULT_POPUP) || DEFAULT_POPUP;
      setPopupActive(pop.isActive);
      setPopupTitle(pop.title);
      setPopupDesc(pop.desc);
      setPopupImage(pop.image || "");
      setPopupLink(pop.link || "");
      setPopupBtnText(pop.btnText || "");
      setPopupTitleColor(pop.titleColor || "#ffffff");
      setPopupTitleSize(pop.titleSize || "18px");
      setPopupDescColor(pop.descColor || "#735965");
      setPopupDescSize(pop.descSize || "12px");
      setPopupBtnBgColor(pop.btnBgColor || "#f25f8a");
      setPopupBtnTextColor(pop.btnTextColor || "#ffffff");
      setPopupBtnTextSize(pop.btnTextSize || "12px");

      const flt = loadState("120_floatings", DEFAULT_FLOATING) || DEFAULT_FLOATING;
      setFloatingActive(flt.isActive);
      setFloatingInsta(flt.instaUrl || "");
      setFloatingYoutube(flt.youtubeUrl || "");
      setFloatingChat(flt.chatUrl || "");
      setFloatingPhone(flt.phoneNo || "");
      setFloatingKakao(flt.kakaoUrl || "");
      setFloatingBlog(flt.blogUrl || "");

      const galItems = loadState("120_gallery_items", DEFAULT_GALLERY);
      setGalleryItems(galItems);
      const galCats = loadState("120_gallery_categories", ["신메뉴", "홍보연출", "메뉴판", "매장"]);
      const activeCats = (galItems || []).map((item: any) => item.category).filter(Boolean);
      const mergedCats = Array.from(new Set([...galCats, ...activeCats])) as string[];
      setGalleryCategories(mergedCats);
      
      // Initialize banner form states
      setBannerMainTag(bnr.mainTag);
      setBannerMainTitle(bnr.mainTitle);
      setBannerMainDesc(bnr.mainDesc);
      setBannerSideTag(bnr.sideTag);
      setBannerSideTitle(bnr.sideTitle);
      setBannerSideDesc(bnr.sideDesc);
      setBannerSideBtnText(bnr.sideBtnText);
      setBannerMainImage(bnr.mainImage || "");
      setBannerSideImage(bnr.sideImage || "");
      setBannerSideLink(bnr.sideLink || "training");

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
      setShippingFeeA(policySettings.shippingFeeA || "3,000");
      setShippingFeeB(policySettings.shippingFeeB || "4,000");
      setShippingFeeC(policySettings.shippingFeeC || "5,000");
      setShippingFeeBox(policySettings.shippingFeeBox || "6,000");
    }
  }, []);

  // Sync Convex banners to React state
  useEffect(() => {
    if (convexBanners) {
      setBanner(convexBanners);
      setBannerMainTag(convexBanners.mainTag);
      setBannerMainTitle(convexBanners.mainTitle);
      setBannerMainDesc(convexBanners.mainDesc);
      setBannerMainBtnText(convexBanners.mainBtnText || "신메뉴 자재 발주하러 가기");
      setBannerMainLink(convexBanners.mainLink || "order");
      setBannerSideTag(convexBanners.sideTag);
      setBannerSideTitle(convexBanners.sideTitle);
      setBannerSideDesc(convexBanners.sideDesc);
      setBannerSideBtnText(convexBanners.sideBtnText);
      setBannerMainImage(convexBanners.mainImage || "");
      setBannerSideImage(convexBanners.sideImage || "");
      setBannerSideLink(convexBanners.sideLink || "training");
    }
  }, [convexBanners]);

  // [Migration] Automatic migration of banner from LocalStorage to Convex Cloud DB
  useEffect(() => {
    if (convexBanners === null) {
      const storedBannerRaw = localStorage.getItem("120_banners");
      if (storedBannerRaw) {
        try {
          const parsedBanner = JSON.parse(storedBannerRaw);
          if (parsedBanner) {
            console.log("[Migration] Moving local banner to Convex cloud DB...");
            updateBannersMutation({
              mainTag: parsedBanner.mainTag || DEFAULT_BANNER.mainTag,
              mainTitle: parsedBanner.mainTitle || DEFAULT_BANNER.mainTitle,
              mainDesc: parsedBanner.mainDesc || DEFAULT_BANNER.mainDesc,
              sideTag: parsedBanner.sideTag || DEFAULT_BANNER.sideTag,
              sideTitle: parsedBanner.sideTitle || DEFAULT_BANNER.sideTitle,
              sideDesc: parsedBanner.sideDesc || DEFAULT_BANNER.sideDesc,
              sideBtnText: parsedBanner.sideBtnText || DEFAULT_BANNER.sideBtnText,
              mainImage: parsedBanner.mainImage || undefined,
              sideImage: parsedBanner.sideImage || undefined,
              sideLink: parsedBanner.sideLink || undefined
            }).catch((err) => {
              console.warn("[Migration] Failed to migrate banner with images, trying without images:", err);
              // Fallback: migrate without images to avoid Convex 1MB document size limit crash
              updateBannersMutation({
                mainTag: parsedBanner.mainTag || DEFAULT_BANNER.mainTag,
                mainTitle: parsedBanner.mainTitle || DEFAULT_BANNER.mainTitle,
                mainDesc: parsedBanner.mainDesc || DEFAULT_BANNER.mainDesc,
                sideTag: parsedBanner.sideTag || DEFAULT_BANNER.sideTag,
                sideTitle: parsedBanner.sideTitle || DEFAULT_BANNER.sideTitle,
                sideDesc: parsedBanner.sideDesc || DEFAULT_BANNER.sideDesc,
                sideBtnText: parsedBanner.sideBtnText || DEFAULT_BANNER.sideBtnText,
                mainImage: undefined,
                sideImage: undefined,
                sideLink: parsedBanner.sideLink || undefined
              }).catch((fallbackErr) => {
                console.error("[Migration] Failed even without images:", fallbackErr);
              });
            });
          }
        } catch (e) {
          console.error("[Migration] Failed to migrate banner:", e);
        }
      }
    }
  }, [convexBanners, updateBannersMutation]);

  // [Migration] Automatic migration from LocalStorage to Convex Cloud DB
  useEffect(() => {
    if (convexProducts !== undefined && convexProducts.length === 0) {
      const storedPrRaw = localStorage.getItem("120_products");
      if (storedPrRaw) {
        try {
          const parsedPr = JSON.parse(storedPrRaw);
          const filteredMigration = parsedPr.filter((p: any) => p && !["prod-1", "prod-2", "prod-3", "prod-4", "prod-5", "prod-6"].includes(p.id));
          if (filteredMigration && filteredMigration.length > 0) {
            console.log("[Migration] Moving local products to Convex cloud DB...");
            syncProductsMutation({ products: filteredMigration }).then(() => {
              console.log("[Migration] Products migration completed!");
            });
          }
        } catch (e) {
          console.error("[Migration] Failed to migrate products:", e);
        }
      }
    }
  }, [convexProducts, syncProductsMutation]);

  useEffect(() => {
    if (convexOrders !== undefined && convexOrders.length === 0) {
      const storedOrdRaw = localStorage.getItem("120_orders");
      if (storedOrdRaw) {
        try {
          const parsedOrd = JSON.parse(storedOrdRaw);
          if (parsedOrd && parsedOrd.length > 0) {
            console.log("[Migration] Moving local orders to Convex cloud DB...");
            syncOrdersMutation({ orders: parsedOrd }).then(() => {
              console.log("[Migration] Orders migration completed!");
            });
          }
        } catch (e) {
          console.error("[Migration] Failed to migrate orders:", e);
        }
      }
    }
  }, [convexOrders, syncOrdersMutation]);

  useEffect(() => {
    if (convexGallery !== undefined && convexGallery.length === 0) {
      const storedGalRaw = localStorage.getItem("120_gallery_items");
      let migrated = false;
      if (storedGalRaw) {
        try {
          const parsedGal = JSON.parse(storedGalRaw);
          if (parsedGal && parsedGal.length > 0) {
            console.log("[Migration] Moving local gallery items to Convex cloud DB...");
            const itemsToSync = parsedGal.map((item: any) => ({
              name: item.name,
              category: item.category,
              url: item.url,
              regDate: item.regDate || new Date().toISOString().split("T")[0],
              orderIndex: item.orderIndex,
              isFeatured: item.isFeatured
            }));
            syncGalleryMutation({ items: itemsToSync }).then(() => {
              console.log("[Migration] Gallery migration completed!");
            });
            migrated = true;
          }
        } catch (e) {
          console.error("[Migration] Failed to migrate gallery items:", e);
        }
      }

      if (!migrated) {
        console.log("[Migration] Seeding default gallery items...");
        seedGalleryMutation().then(() => {
          console.log("[Migration] Default gallery seeding completed!");
        });
      }
    }
  }, [convexGallery, syncGalleryMutation, seedGalleryMutation]);

  // Sync real-time Convex products and backup to localStorage
  useEffect(() => {
    if (convexProducts !== undefined && convexProducts !== null) {
      if (convexProducts.length > 0) {
        const sorted = [...convexProducts].sort((a, b) => a.orderIndex - b.orderIndex);
        setProducts(sorted as any);
        localStorage.setItem("120_products", JSON.stringify(sorted));
      } else {
        const stored = localStorage.getItem("120_products");
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setProducts(parsed);
            }
          } catch (e) {}
        }
      }
    }
  }, [convexProducts]);

  // Sync real-time Convex orders and backup to localStorage
  useEffect(() => {
    if (convexOrders !== undefined) {
      setOrders(convexOrders as any);
      localStorage.setItem("120_orders", JSON.stringify(convexOrders));
    }
  }, [convexOrders]);

  // Poll LocalStorage to keep Admin & Partner Portal perfectly synchronized
  useEffect(() => {
    const syncStates = () => {
      if (typeof window !== "undefined") {
        const i = localStorage.getItem("120_inquiries");
        const n = localStorage.getItem("120_notices");
        const t = localStorage.getItem("120_trainings");
        const p = localStorage.getItem("120_prs");
        
        const st = localStorage.getItem("120_stores");
        const cat = localStorage.getItem("120_categories");
        const bnr = localStorage.getItem("120_banners");

        if (i) setInquiries(JSON.parse(i));
        if (n) setNotices(JSON.parse(n));
        if (t) setTrainings(JSON.parse(t));
        if (p) setPrs(JSON.parse(p));
        
        if (st) setStores(JSON.parse(st));
        if (cat) setCategories(JSON.parse(cat));
        if (bnr) setBanner(JSON.parse(bnr));

        const lab = localStorage.getItem("120_labels");
        if (lab) setLabels(JSON.parse(lab));

        const ds = localStorage.getItem("120_delivery_statuses");
        if (ds) setDeliveryStatuses(JSON.parse(ds));

        const ps = localStorage.getItem("120_shipping_settings");
        if (ps && !showPolicyPanel) {
          try {
            const parsed = JSON.parse(ps);
            setShippingPolicy(parsed.shippingPolicy || "");
            setReturnPolicy(parsed.returnPolicy || "");
            setShippingFeeA(parsed.shippingFeeA || "3,000");
            setShippingFeeB(parsed.shippingFeeB || "4,000");
            setShippingFeeC(parsed.shippingFeeC || "5,000");
            setShippingFeeBox(parsed.shippingFeeBox || "6,000");
          } catch (e) {
            console.error(e);
          }
        }
      }
    };

    const interval = setInterval(syncStates, 1500);
    return () => clearInterval(interval);
  }, [showPolicyPanel]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // ==========================================
  // ORDER ACTIONS: Change Shipping Status
  // ==========================================
  const advanceOrderStatus = (orderId: string, currentStatus: string) => {
    let nextStatus: "주문완료" | "배송준비중" | "배송중" | "배송완료";
    
    if (currentStatus === "주문완료") nextStatus = "배송준비중";
    else if (currentStatus === "배송준비중") nextStatus = "배송중";
    else if (currentStatus === "배송중") nextStatus = "배송완료";
    else return; // Already completed

    const updatedOrders = orders.map((o) => 
      o.id === orderId ? { ...o, status: nextStatus } : o
    );

    setOrders(updatedOrders);
    localStorage.setItem("120_orders", JSON.stringify(updatedOrders));

    // Save to Convex Cloud DB
    updateOrderStatusMutation({ id: orderId, status: nextStatus }).then(() => {
      console.log("[Convex] Order status advanced successfully.");
    }).catch(err => {
      console.error("[Convex] Failed to advance order status:", err);
    });

    triggerToast(`주문 상태가 [${nextStatus}]로 변경되었습니다.`);
  };

  // ==========================================
  // NOTICE ACTIONS: Add, Edit, Delete
  // ==========================================
  const handleOpenEditNoticeModal = (notice: Notice) => {
    setSelectedNotice(notice);
    setNewNoticeTag(notice.tag);
    setNewNoticeTitle(notice.title);
    setNewNoticeContent(notice.content);
    setShowNoticeModal(true);
  };

  const handleCloseNoticeModal = () => {
    setShowNoticeModal(false);
    setSelectedNotice(null);
    setNewNoticeTag("일반");
    setNewNoticeTitle("");
    setNewNoticeContent("");
  };

  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoticeTitle || !newNoticeContent) {
      alert("제목과 내용을 채워주세요.");
      return;
    }

    if (selectedNotice) {
      // Update existing notice
      const updatedNotice: Notice = {
        ...selectedNotice,
        tag: newNoticeTag,
        title: newNoticeTitle,
        content: newNoticeContent,
      };

      const updatedNotices = notices.map((n) => (n.id === selectedNotice.id ? updatedNotice : n));
      setNotices(updatedNotices);
      localStorage.setItem("120_notices", JSON.stringify(updatedNotices));

      // Save to Convex Cloud DB (Updating)
      saveNoticeMutation({
        _id: selectedNotice._id,
        id: selectedNotice.id,
        tag: newNoticeTag,
        title: newNoticeTitle,
        content: newNoticeContent,
        date: selectedNotice.date,
        views: selectedNotice.views
      }).then(() => {
        console.log("[Convex] Notice updated successfully.");
      }).catch(err => {
        console.error("[Convex] Failed to update notice:", err);
      });

      triggerToast("공지사항이 정상적으로 수정되었습니다.");
    } else {
      // Create new notice
      const newNoticeId = `NOT-${Math.floor(100 + Math.random() * 900)}`;
      const newNotice: Notice = {
        id: newNoticeId,
        tag: newNoticeTag,
        title: newNoticeTitle,
        date: new Date().toISOString().split("T")[0],
        views: 0,
        content: newNoticeContent
      };

      const updatedNotices = [newNotice, ...notices];
      setNotices(updatedNotices);
      localStorage.setItem("120_notices", JSON.stringify(updatedNotices));

      // Save to Convex Cloud DB
      saveNoticeMutation({
        id: newNoticeId,
        tag: newNoticeTag,
        title: newNoticeTitle,
        content: newNoticeContent,
        date: newNotice.date,
        views: 0
      }).then(() => {
        console.log("[Convex] Notice created successfully.");
      }).catch(err => {
        console.error("[Convex] Failed to create notice:", err);
      });

      triggerToast("신규 공지사항이 정식 배포되었습니다!");
    }

    handleCloseNoticeModal();
  };

  const handleDeleteNotice = (id: string, _id?: any) => {
    if (confirm("정말 이 공지사항을 삭제하시겠습니까?")) {
      const updated = notices.filter((n) => n.id !== id);
      setNotices(updated);
      localStorage.setItem("120_notices", JSON.stringify(updated));

      // Delete from Convex Cloud DB
      if (_id) {
        deleteNoticeMutation({ _id }).then(() => {
          console.log("[Convex] Notice deleted successfully.");
        }).catch(err => {
          console.error("[Convex] Failed to delete notice from cloud DB:", err);
        });
      }

      triggerToast("공지사항이 정상적으로 삭제되었습니다.");
    }
  };

  const handleDeleteConsultation = (_id: any) => {
    if (confirm("정말 이 창업 상담문의 내역을 삭제하시겠습니까?")) {
      deleteConsultationMutation({ _id }).then(() => {
        triggerToast("상담문의 내역이 정상적으로 삭제되었습니다.");
      }).catch(err => {
        console.error("Failed to delete consultation:", err);
        alert("상담문의 삭제 중 오류가 발생했습니다.");
      });
    }
  };

  const handleDeleteOrder = (_id: any) => {
    if (confirm("정말로 이 가맹점 발주 주문 내역을 삭제하시겠습니까?")) {
      deleteOrderMutation({ _id })
        .then(() => {
          triggerToast("발주 주문 내역이 삭제되었습니다.");
        })
        .catch((err) => {
          console.error("Failed to delete order:", err);
          alert("주문 삭제 중 오류가 발생했습니다.");
        });
    }
  };

  const handleDeleteStoreInquiry = (_id: any) => {
    if (confirm("정말로 이 1:1 AS 문의 내역을 삭제하시겠습니까?")) {
      deleteInquiryMutation({ _id })
        .then(() => {
          triggerToast("1:1 문의 내역이 삭제되었습니다.");
        })
        .catch((err) => {
          console.error("Failed to delete inquiry:", err);
          alert("문의 삭제 중 오류가 발생했습니다.");
        });
    }
  };

  const handleSaveShippingSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const settings = {
      shippingPolicy,
      returnPolicy,
      shippingFeeA,
      shippingFeeB,
      shippingFeeC,
      shippingFeeBox
    };
    localStorage.setItem("120_shipping_settings", JSON.stringify(settings));
    triggerToast("배송 및 반품 정책 설정이 저장되었습니다.");
    setShowPolicyPanel(false);
  };

  // ==========================================
  // INQUIRY ACTIONS: Write Response
  // ==========================================
  const handleSubmitAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInquiry || !inquiryAnswerText) {
      alert("답변 내용을 입력해 주세요.");
      return;
    }

    const todayStr = new Date().toISOString().split("T")[0];

    // Convex Cloud DB 업데이트
    if (selectedInquiry._id) {
      answerInquiryMutation({
        _id: selectedInquiry._id,
        answer: inquiryAnswerText,
        answerDate: todayStr
      }).then(() => {
        console.log("[Convex] Inquiry answer saved successfully.");
      }).catch((err) => {
        console.error("[Convex] Failed to answer inquiry:", err);
      });
    }

    const updatedInquiries = inquiries.map((inq) => 
      inq.id === selectedInquiry.id 
        ? { ...inq, status: "답변완료" as const, answer: inquiryAnswerText, answerDate: todayStr } 
        : inq
    );

    setInquiries(updatedInquiries as any);
    localStorage.setItem("120_inquiries", JSON.stringify(updatedInquiries));
    
    setSelectedInquiry(null);
    setInquiryAnswerText("");
    triggerToast("가맹점 문의 답변 등록이 정상 완료되었습니다!");
  };

  // ==========================================
  // MATERIALS & PR ACTIONS: Add & Delete (File Upload & Convex Integration)
  // ==========================================
  const handleMaterialFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 40 * 1024 * 1024) {
      alert("파일 크기는 최대 40MB 이하여야 합니다.");
      return;
    }

    // 포맷 자동 검출
    const ext = file.name.split(".").pop()?.toUpperCase() || "PDF";
    setNewMaterialFormat(ext);

    // 크기 자동 감지 (MB/KB 포맷 변환)
    const sizeInMB = file.size / (1024 * 1024);
    if (sizeInMB >= 1) {
      setNewMaterialSize(`${sizeInMB.toFixed(1)} MB`);
    } else {
      const sizeInKB = file.size / 1024;
      setNewMaterialSize(`${sizeInKB.toFixed(0)} KB`);
    }

    setNewMaterialFileName(file.name);
    setIsUploadingMaterialFile(true);

    try {
      // 1. Convex 파일 업로드용 Upload URL 생성
      const postUrl = await generateMaterialUploadUrlMutation();

      // 2. Convex File Storage에 파일 직접 POST 업로드
      const res = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type || "application/octet-stream" },
        body: file,
      });

      if (!res.ok) {
        throw new Error(`Convex storage upload failed with status ${res.status}`);
      }

      const { storageId } = await res.json();
      setNewMaterialStorageId(storageId);
      setNewMaterialFileUrl(`convex:${storageId}`);
    } catch (err) {
      console.error("Convex Material Storage Upload Exception:", err);
      alert("Convex 파일 저장소 업로드 중 오류가 발생했습니다.");
    } finally {
      setIsUploadingMaterialFile(false);
    }
  };

  const handleCreateMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMaterialTitle) {
      alert("자료 제목을 입력해 주세요.");
      return;
    }
    if (isUploadingMaterialFile) {
      alert("파일이 Convex 서버로 업로드 중입니다. 업로드가 완료된 후 등록해 주세요.");
      return;
    }
    if (!newMaterialFileUrl) {
      alert("실제 자료 파일을 첨부해 주세요.");
      return;
    }

    const todayStr = new Date().toISOString().split("T")[0];

    const payload: any = {
      title: newMaterialTitle,
      date: todayStr,
      size: newMaterialSize || "미정",
      format: newMaterialFormat || "PDF",
      desc: newMaterialDesc || newMaterialTitle,
      img: newMaterialImg || undefined,
      fileUrl: newMaterialFileUrl || undefined,
      storageId: newMaterialStorageId || undefined,
      fileName: newMaterialFileName || undefined,
      type: materialType,
    };

    // Convex Cloud DB 등록
    saveMaterialMutation(payload).then(() => {
      console.log("[Convex] Material registered.");
    }).catch((err) => {
      console.error("[Convex] Failed to save material:", err);
    });

    // 로컬 상태 즉각 동기화 (레이턴시 보완)
    const newMat = {
      ...payload,
      id: `${materialType === "training" ? "TRN" : "PR"}-${Math.floor(100 + Math.random() * 900)}`
    };

    if (materialType === "training") {
      const updated = [newMat, ...trainings];
      setTrainings(updated as any);
      try {
        localStorage.setItem("120_trainings", JSON.stringify(updated));
      } catch (e) {
        console.warn("LocalStorage quota alert suppressed:", e);
      }
    } else {
      const updated = [newMat, ...prs];
      setPrs(updated as any);
      try {
        localStorage.setItem("120_prs", JSON.stringify(updated));
      } catch (e) {
        console.warn("LocalStorage quota alert suppressed:", e);
      }
    }

    // 폼 초기화
    setNewMaterialTitle("");
    setNewMaterialDesc("");
    setNewMaterialImg("");
    setNewMaterialFileUrl("");
    setNewMaterialStorageId("");
    setNewMaterialFileName("");
    setShowMaterialModal(false);
    triggerToast(`신규 ${materialType === "training" ? "교육" : "홍보"}자료가 성공적으로 등록되었습니다!`);
  };

  const handleDownload = (title: string, fileUrl?: string, fileName?: string) => {
    if (fileUrl) {
      triggerToast(`'${fileName || title}' 다운로드를 시작합니다.`);
      try {
        const link = document.createElement("a");
        link.href = fileUrl;
        link.target = "_blank";
        link.download = fileName || title;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (err) {
        console.error("Download failed:", err);
        window.open(fileUrl, "_blank");
      }
    } else {
      triggerToast(`'${title}' 등록된 첨부파일이 없습니다.`);
    }
  };

  const renderMaterialThumbnail = (item: any) => {
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
        <div className="w-14 h-14 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200/80 relative shadow-2xs">
          <img src={optimizeCloudinaryUrl(item.img)} alt="" className="w-full h-full object-cover" />
        </div>
      );
    }

    if (hasFileUrl && isImg(item.fileUrl, item.format)) {
      return (
        <div className="w-14 h-14 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200/80 relative shadow-2xs">
          <img src={optimizeCloudinaryUrl(item.fileUrl)} alt="" className="w-full h-full object-cover" />
        </div>
      );
    }

    if (isVideo(item.fileUrl, item.format)) {
      return (
        <div className="w-14 h-14 rounded-lg bg-amber-50 text-amber-600 flex flex-col items-center justify-center shrink-0 border border-amber-200/80 shadow-2xs gap-0.5">
          <Video size={20} className="text-amber-500" />
          <span className="text-[8px] font-black text-amber-700 uppercase">영상</span>
        </div>
      );
    }

    return (
      <div className="w-14 h-14 rounded-lg bg-blue-50 text-blue-600 flex flex-col items-center justify-center shrink-0 border border-blue-200/80 shadow-2xs gap-0.5">
        <FileText size={20} className="text-blue-500" />
        <span className="text-[8px] font-black text-blue-700 uppercase">{item.format || "FILE"}</span>
      </div>
    );
  };

  const handleDeleteMaterial = (id: string, type: "training" | "pr") => {
    if (confirm("정말 이 자료를 영구 삭제하시겠습니까? 관련 다운로드 파일도 서버에서 완전히 삭제됩니다.")) {
      // Convex _id를 가지고 있는지 확인하여 DB 삭제
      const match = (type === "training" ? trainings : prs).find((item: any) => item.id === id || item._id === id);
      if (match && (match as any)._id) {
        deleteMaterialMutation({ _id: (match as any)._id }).then(() => {
          console.log("[Convex] Material deleted successfully.");
        }).catch((err) => {
          console.error("[Convex] Failed to delete material:", err);
        });
      }

      if (type === "training") {
        const updated = trainings.filter((t: any) => t.id !== id && t._id !== id);
        setTrainings(updated);
        localStorage.setItem("120_trainings", JSON.stringify(updated));
      } else {
        const updated = prs.filter((p: any) => p.id !== id && p._id !== id);
        setPrs(updated);
        localStorage.setItem("120_prs", JSON.stringify(updated));
      }
      triggerToast("자료가 삭제 처리되었습니다.");
    }
  };

  // ==========================================
  // 1. STORE MANAGEMENT HANDLERS
  // ==========================================
  
  // Format phone number to automatically include hyphens: 010-XXXX-XXXX
  const handlePhoneInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9]/g, ""); // Remove non-digits
    if (value.length > 3 && value.length <= 7) {
      value = `${value.slice(0, 3)}-${value.slice(3)}`;
    } else if (value.length > 7) {
      value = `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7, 11)}`;
    }
    setStorePhone(value);
  };

  // Helper to open the store modal
  const handleOpenStoreModal = (store?: StoreInfo) => {
    if (store) {
      setSelectedStore(store);
      setStoreLoginId(store.id);
      setStorePw(store.pw);
      setStorePwConfirm(store.pwConfirm);
      setStoreName(store.name);
      setStoreOwner(store.owner);
      setStorePhone(store.phone);
      setStoreStatus(store.status);
      setStoreRoadAddress(store.roadAddress);
      setStoreDetailAddress(store.detailAddress);
      setStoreRegDate(store.regDate);
      setStoreCancelDate(store.cancelDate || "");
      setStoreAdoptionMenu(store.adoptionMenu);
      setStorePartnerId(store.partnerId || "");
    } else {
      setSelectedStore(null);
      setStoreLoginId("");
      setStorePw("");
      setStorePwConfirm("");
      setStoreName("");
      setStoreOwner("");
      setStorePhone("");
      setStoreStatus("대기");
      setStoreRoadAddress("");
      setStoreDetailAddress("");
      setStoreRegDate(new Date().toISOString().split("T")[0]);
      setStoreCancelDate("");
      setStoreAdoptionMenu([]);
      setStorePartnerId("");
    }
    setShowStoreModal(true);
  };

  // Add or edit a store
  const handleCreateOrUpdateStore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeLoginId || !storePw || !storeName || !storeOwner || !storePhone || !storeRoadAddress) {
      alert("필수 입력값을 입력해 주세요.");
      return;
    }
    if (storePw !== storePwConfirm) {
      alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    const storeData: StoreInfo = {
      id: storeLoginId,
      pw: storePw,
      pwConfirm: storePwConfirm,
      name: storeName,
      owner: storeOwner,
      phone: storePhone,
      status: storeStatus,
      roadAddress: storeRoadAddress,
      detailAddress: storeDetailAddress,
      regDate: storeRegDate || new Date().toISOString().split("T")[0],
      cancelDate: storeCancelDate || undefined,
      adoptionMenu: storeAdoptionMenu,
      monthlySales: selectedStore ? selectedStore.monthlySales : 0,
      partnerId: storePartnerId || undefined,
    };

    let updatedStores: StoreInfo[];
    if (selectedStore) {
      // Editing
      updatedStores = stores.map((s) => (s.id === selectedStore.id ? storeData : s));
      triggerToast(`'${storeName}' 정보가 성공적으로 수정되었습니다.`);
    } else {
      // New registration
      if (stores.some((s) => s.id === storeLoginId)) {
        alert("이미 존재하는 아이디입니다. 다른 아이디를 사용해 주세요.");
        return;
      }
      updatedStores = [...stores, storeData];
      triggerToast(`신규 가맹점 '${storeName}'이 성공적으로 등록되었습니다.`);
    }

    // Save to Convex Cloud DB with geocoding
    const saveToConvex = (lat?: number, lng?: number) => {
      saveStoreMutation({
        id: storeLoginId,
        pw: storePw,
        pwConfirm: storePwConfirm,
        name: storeName,
        owner: storeOwner,
        phone: storePhone,
        status: storeStatus,
        roadAddress: storeRoadAddress,
        detailAddress: storeDetailAddress,
        lat: lat ?? selectedStore?.lat,
        lng: lng ?? selectedStore?.lng,
        regDate: storeRegDate || new Date().toISOString().split("T")[0],
        cancelDate: storeCancelDate || undefined,
        adoptionMenu: storeAdoptionMenu,
        monthlySales: selectedStore ? selectedStore.monthlySales : 0,
        partnerId: storePartnerId || undefined,
      }).then(() => {
        console.log("[Convex] Store created/updated successfully.");
      }).catch((err) => {
        console.error("[Convex] Failed to save store:", err);
      });
    };

    if (typeof window !== "undefined" && window.naver && window.naver.maps && window.naver.maps.Service && storeRoadAddress) {
      const cleanAddr = storeRoadAddress.split("(")[0].trim();
      window.naver.maps.Service.geocode({ query: cleanAddr }, (status: any, response: any) => {
        if (status === window.naver.maps.Service.Status.OK && response.v2?.addresses?.[0]) {
          const item = response.v2.addresses[0];
          saveToConvex(parseFloat(item.y), parseFloat(item.x));
        } else {
          saveToConvex();
        }
      });
    } else {
      saveToConvex();
    }

    setStores(updatedStores);
    localStorage.setItem("120_stores", JSON.stringify(updatedStores));
    setShowStoreModal(false);
  };

  // ==========================================
  // Partner Management Handlers (HQ Admin)
  // ==========================================
  const handleOpenPartnerModal = (partner?: any) => {
    if (partner) {
      setIsPartnerEditMode(true);
      setSelectedPartner(partner);
      setPartnerFormId(partner.id);
      setPartnerFormPw(partner.pw || "");
      setPartnerFormName(partner.name || "");
      setPartnerFormPhone(partner.phone || "");
      setPartnerFormEmail(partner.email || "");
      setPartnerFormCompanyName(partner.companyName || "");
      setPartnerFormBankName(partner.bankName || "");
      setPartnerFormAccountNumber(partner.accountNumber || "");
      setPartnerFormAccountHolder(partner.accountHolder || "");
      setPartnerFormCommission(partner.commissionPerBox || 8000);
      setPartnerFormStatus(partner.status || "활동중");
      setPartnerFormRegDate(partner.regDate || new Date().toISOString().split("T")[0]);
      setPartnerFormMemo(partner.memo || "");
    } else {
      setIsPartnerEditMode(false);
      setSelectedPartner(null);
      setPartnerFormId(`partner_${Date.now().toString().slice(-4)}`);
      setPartnerFormPw("partner1234");
      setPartnerFormName("");
      setPartnerFormPhone("");
      setPartnerFormEmail("");
      setPartnerFormCompanyName("");
      setPartnerFormBankName("");
      setPartnerFormAccountNumber("");
      setPartnerFormAccountHolder("");
      setPartnerFormCommission(8000);
      setPartnerFormStatus("활동중");
      setPartnerFormRegDate(new Date().toISOString().split("T")[0]);
      setPartnerFormMemo("");
    }
    setIsPartnerFormOpen(true);
  };

  const handleSavePartner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerFormId || !partnerFormPw || !partnerFormName || !partnerFormPhone) {
      alert("아이디, 비밀번호, 파트너명, 연락처는 필수 입력 항목입니다.");
      return;
    }

    try {
      await savePartnerMutation({
        id: partnerFormId,
        pw: partnerFormPw,
        name: partnerFormName,
        phone: partnerFormPhone,
        email: partnerFormEmail || undefined,
        companyName: partnerFormCompanyName || undefined,
        bankName: partnerFormBankName || undefined,
        accountNumber: partnerFormAccountNumber || undefined,
        accountHolder: partnerFormAccountHolder || undefined,
        commissionPerBox: partnerFormCommission || 8000,
        status: partnerFormStatus,
        regDate: partnerFormRegDate || new Date().toISOString().split("T")[0],
        memo: partnerFormMemo || undefined,
      });

      triggerToast(isPartnerEditMode ? "파트너 정보가 수정되었습니다." : "새 파트너가 성공적으로 등록되었습니다.");
      setIsPartnerFormOpen(false);
    } catch (err) {
      console.error(err);
      alert("파트너 저장 중 오류가 발생했습니다.");
    }
  };

  const handleDeletePartner = async (id: string, name: string) => {
    if (!confirm(`정말로 '${name}' 파트너를 삭제하시겠습니까? 연결된 가맹점의 파트너 지정이 해제됩니다.`)) {
      return;
    }

    try {
      await deletePartnerMutation({ id });
      triggerToast(`'${name}' 파트너가 삭제되었습니다.`);
    } catch (err) {
      console.error(err);
      alert("파트너 삭제 중 오류가 발생했습니다.");
    }
  };

  const handleOpenSettlementStatusModal = (settlement: any) => {
    setSettlementStatusEditTarget(settlement);
    setSettlementNewStatus(settlement.status || "정산대기");
    setSettlementPaidDate(settlement.paidDate || new Date().toISOString().split("T")[0]);
    setSettlementNote(settlement.note || "");
  };

  const handleSaveSettlementStatus = async () => {
    if (!settlementStatusEditTarget) return;

    try {
      await updateSettlementStatusMutation({
        partnerId: settlementStatusEditTarget.partnerId,
        yearMonth: settlementStatusEditTarget.yearMonth,
        boxCount: settlementStatusEditTarget.boxCount || 0,
        commissionAmount: settlementStatusEditTarget.commissionAmount || 0,
        status: settlementNewStatus,
        paidDate: settlementNewStatus === "지급완료" ? settlementPaidDate : undefined,
        note: settlementNote || undefined,
      });

      triggerToast("정산 상태 및 지급 정보가 업데이트되었습니다.");
      setSettlementStatusEditTarget(null);
    } catch (err) {
      console.error(err);
      alert("정산 상태 업데이트 중 오류가 발생했습니다.");
    }
  };

  // Delete a store
  const handleDeleteStore = (storeId: string) => {
    if (confirm("정말 이 가맹점 정보를 삭제하시겠습니까? 관련 데이터가 초기화됩니다.")) {
      const updated = stores.filter((s) => s.id !== storeId);
      
      // Delete from Convex Cloud DB
      deleteStoreMutation({ id: storeId }).then(() => {
        console.log("[Convex] Store deleted successfully.");
      }).catch((err) => {
        console.error("[Convex] Failed to delete store:", err);
      });

      setStores(updated);
      localStorage.setItem("120_stores", JSON.stringify(updated));
      triggerToast("가맹점 정보가 삭제되었습니다.");
    }
  };

  // Real Road Address Search using Daum/Kakao Postcode API (Iframe Embedded Layer Style)
  const openDaumPostcode = (target: "store" | "contract" = "store") => {
    setAddressTarget(target);
    setShowAddressPopup(true);
    setAddressTab("kakao");
    setAddressSearchKeyword("");
    
    if (typeof window !== "undefined") {
      const scriptId = "daum-postcode-script";
      let script = document.getElementById(scriptId) as HTMLScriptElement | null;
      
      const embedPostcode = () => {
        let attempts = 0;
        
        // Double-safety polling: wait for window.daum.Postcode to be fully loaded and container to be rendered
        const tryEmbed = () => {
          const container = document.getElementById("daum-postcode-container");
          const daumNamespace = (window as any).daum;
          
          if (daumNamespace && daumNamespace.Postcode && container) {
            new daumNamespace.Postcode({
              oncomplete: (data: any) => {
                let fullRoadAddr = data.roadAddress; // 도로명 주소 변수
                let extraRoadAddr = ''; // 참고항목 변수

                // 법정동명이 있을 경우 추가한다. (법정리는 제외)
                // 법정동의 경우 마지막 문자가 "동/로/가"로 끝납니다.
                if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
                  extraRoadAddr += data.bname;
                }
                // 건물명이 있고, 공동주택일 경우 추가한다.
                if (data.buildingName !== '') {
                  extraRoadAddr += (extraRoadAddr !== '' ? ', ' + data.buildingName : data.buildingName);
                }
                // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
                if (extraRoadAddr !== '') {
                  extraRoadAddr = ' (' + extraRoadAddr + ')';
                }

                // 도로명 주소 뒤에 참고항목(괄호)까지 통째로 붙여서 세팅
                const finalAddress = fullRoadAddr + extraRoadAddr;
                
                if (target === "contract") {
                  setContractRoadAddress(finalAddress);
                } else {
                  setStoreRoadAddress(finalAddress);
                }
                
                setShowAddressPopup(false);
                triggerToast("실제 도로명 주소(상사/괄호 주소 포함)가 성공적으로 자동 입력되었습니다.");
              },
              width: "100%",
              height: "100%"
            }).embed(container);
          } else {
            if (attempts < 30) { // 3 seconds timeout (100ms * 30)
              attempts++;
              setTimeout(tryEmbed, 100);
            } else {
              console.error("[Kakao API] Failed to load Kakao Postcode library safely.");
              triggerToast("주소 검색 라이브러리를 로드하는 데 일시적인 실패가 발생했습니다. 다시 시도해 주세요.");
            }
          }
        };

        setTimeout(tryEmbed, 100);
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
    }
  };

  // Simulated Road Address Search
  const handleAddressSearch = (keyword: string) => {
    setAddressSearchKeyword(keyword);
    if (!keyword.trim()) {
      setAddressSearchResults([]);
      return;
    }
    
    // Core Mock address candidates showing street name and full parenthesis details
    const candidates = [
      "경기 군포시 엘에스로 143 (금정동, 1층 1001호)",
      "경기 군포시 군포로 510 (당동, 주공아파트 상가)",
      "서울 강남구 역삼로 112 (역삼동, 120빌딩 1층)",
      "서울 강남구 테헤란로 312 (역삼동, 비전타워 지하1층)",
      "서울 마포구 양화로 160 (동교동, 홍대스타피아 2층)",
      "서울 마포구 서강로 78 (신수동, 1층)",
      "부산 부산진구 중앙대로 730 (부전동, 서면센트럴 1층)",
      "대구 중구 동성로 12 (동성로2가, 로데오몰)",
      "광주 서구 상무평화로 89 (치평동, 무등빌딩 1층)"
    ];

    const results = candidates.filter((addr) => addr.includes(keyword));
    setAddressSearchResults(results);
  };

  // ==========================================
  // 2. PRODUCT MANAGEMENT HANDLERS
  // ==========================================

  // Auto thousand comma helper
  const formatNumberWithCommas = (val: string): string => {
    const num = val.replace(/[^0-9]/g, "");
    if (!num) return "0";
    return parseInt(num, 10).toLocaleString();
  };

  const parseNumberFromCommas = (val: string): number => {
    return parseInt(val.replace(/[^0-9]/g, "") || "0", 10);
  };

  // Calculate real-time discounted price
  const getCalculatedDiscountedPrice = () => {
    const priceNum = parseNumberFromCommas(productPrice);
    const discNum = parseNumberFromCommas(productDiscountAmount);
    const finalPrice = priceNum - discNum;
    return finalPrice < 0 ? 0 : finalPrice;
  };

  // Handler for price input change (formats commas dynamically)
  const handlePriceInput = (val: string, setter: (v: string) => void) => {
    setter(formatNumberWithCommas(val));
  };

  // Open product modal
  const handleOpenProductModal = (prod?: Product) => {
    if (prod) {
      setSelectedProduct(prod);
      setProductCategory(prod.category);
      setProductName(prod.name);
      setProductModelName(prod.modelName);
      setProductUnit(prod.unit);
      setProductQty(prod.qty);
      setProductSupplyPrice((prod.supplyPrice || 0).toLocaleString());
      setProductPrice((prod.price || 0).toLocaleString());
      setProductDiscountAmount((prod.discountAmount || 0).toLocaleString());
      setProductImg(prod.img);
      setProductDetailImg(prod.detailImg || "");
      setProductDetailText(prod.detailText || "");
      setProductIsActive(prod.isActive);
      setProductStatus(prod.status || (prod.isActive ? (prod.stock === "out_of_stock" ? "품절" : "판매중") : "단종"));
      setProductLabels(prod.labels || []);
      setProductShippingType(prod.shippingType || "A");
      setProductOptions(prod.options || []);
      setNewProductOption("");

      // Load rich editor content on microtask
      setTimeout(() => {
        const editorDiv = document.getElementById("product-detail-rich-editor");
        if (editorDiv) {
          editorDiv.innerHTML = prod.detailText || "";
        }
      }, 50);
    } else {
      setSelectedProduct(null);
      setProductCategory(categories[0] || "냉동생지/자재");
      setProductName("");
      setProductModelName("");
      setProductUnit("박스");
      setProductQty(1);
      setProductSupplyPrice("0");
      setProductPrice("0");
      setProductDiscountAmount("0");
      setProductImg("");
      setProductDetailImg("");
      setProductDetailText("");
      setProductIsActive(true);
      setProductStatus("판매중");
      setProductLabels([]);
      setProductShippingType("A");
      setProductOptions([]);
      setNewProductOption("");

      // Reset rich editor content on microtask
      setTimeout(() => {
        const editorDiv = document.getElementById("product-detail-rich-editor");
        if (editorDiv) {
          editorDiv.innerHTML = "";
        }
      }, 50);
    }
    setShowProductModal(true);
  };

  // Save product details
  const handleCreateOrUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productCategory || !productName || !productModelName) {
      alert("필수 입력값을 입력해 주세요. (카테고리, 제품명, 모델 코드는 필수입니다.)");
      return;
    }

    setIsProductSaving(true);
    try {
      // Default image fallback if none provided
      let finalImg = productImg.trim() || "https://res.cloudinary.com/dx7l09wwu/image/upload/f_auto,q_auto/v1779760050/%EB%A1%9C%EC%A0%9C%EB%AF%B8%ED%8A%B8%ED%8C%8C%EC%9D%B4_khogbn.jpg";
      if (finalImg.startsWith("data:image")) {
        try {
          finalImg = await compressImageAsPng(finalImg, 400, 400);
        } catch (e) {}
      }

      let finalDetailImg = productDetailImg ? productDetailImg.trim() : undefined;
      if (finalDetailImg && finalDetailImg.startsWith("data:image")) {
        try {
          finalDetailImg = await compressImage(finalDetailImg, 800, 1200, 0.75);
        } catch (e) {}
      }

      const priceVal = parseNumberFromCommas(productPrice);
      const discVal = parseNumberFromCommas(productDiscountAmount);
      const supplyVal = parseNumberFromCommas(productSupplyPrice);
      const discountedPriceVal = priceVal - discVal;

      const productData: Product = {
        id: selectedProduct ? selectedProduct.id : `prod-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
        orderIndex: selectedProduct ? selectedProduct.orderIndex : products.length + 1,
        name: productName.trim(),
        category: productCategory.trim(),
        modelName: productModelName.trim(),
        unit: productUnit,
        qty: typeof productQty === "number" && !isNaN(productQty) ? productQty : 1,
        supplyPrice: typeof supplyVal === "number" && !isNaN(supplyVal) ? supplyVal : 0,
        price: typeof priceVal === "number" && !isNaN(priceVal) ? priceVal : 0,
        discountAmount: typeof discVal === "number" && !isNaN(discVal) ? discVal : 0,
        discountedPrice: typeof discountedPriceVal === "number" && !isNaN(discountedPriceVal) && discountedPriceVal >= 0 ? discountedPriceVal : 0,
        img: finalImg,
        detailImg: finalDetailImg,
        detailText: productDetailText ? productDetailText.trim() : undefined,
        isActive: productStatus !== "단종",
        desc: `${productModelName.trim()} - ${productCategory.trim()} 표준 규격`,
        stock: productStatus === "품절" ? "out_of_stock" : "in_stock",
        status: productStatus,
        labels: productLabels || [],
        shippingType: productShippingType || "A",
        options: productOptions && productOptions.length > 0 ? productOptions : undefined
      };

      // Save to Convex Cloud DB (Primary Source of Truth)
      await saveProductMutation({
        id: productData.id,
        orderIndex: productData.orderIndex,
        name: productData.name,
        category: productData.category,
        modelName: productData.modelName,
        unit: productData.unit,
        qty: productData.qty,
        supplyPrice: productData.supplyPrice,
        price: productData.price,
        discountAmount: productData.discountAmount,
        discountedPrice: productData.discountedPrice,
        img: productData.img,
        detailImg: productData.detailImg,
        detailText: productData.detailText,
        isActive: productData.isActive,
        desc: productData.desc,
        stock: productData.stock,
        status: productData.status,
        labels: productData.labels,
        shippingType: productData.shippingType,
        options: productData.options
      });

      let updatedProducts: Product[];
      if (selectedProduct) {
        updatedProducts = products.map((p) => (p.id === selectedProduct.id ? productData : p));
      } else {
        updatedProducts = [...products, productData];
      }

      const sortedProducts = [...updatedProducts].sort((a, b) => a.orderIndex - b.orderIndex);
      setProducts(sortedProducts);
      localStorage.setItem("120_products", JSON.stringify(sortedProducts));

      const currentCats = Array.from(new Set([...categories, productData.category].filter(Boolean)));
      setCategories(currentCats);
      localStorage.setItem("120_categories", JSON.stringify(currentCats));

      triggerToast(selectedProduct ? `'${productName}' 제품이 정상 수정되었습니다.` : `신규 제품 '${productName}'이 성공적으로 등록되었습니다.`);
      setShowProductModal(false);
    } catch (err: any) {
      console.error("[Convex] Failed to save product:", err);
      alert(`제품 저장 중 오류가 발생했습니다:\n${err?.message || err}`);
    } finally {
      setIsProductSaving(false);
    }
  };

  // Delete product
  const handleDeleteProduct = (id: string) => {
    if (confirm("정말 이 제품을 삭제하시겠습니까?")) {
      const updated = products.filter((p) => p.id !== id);
      // Re-assign order index for consistency
      const reindexed = updated.map((p, idx) => ({ ...p, orderIndex: idx + 1 }));
      setProducts(reindexed);
      localStorage.setItem("120_products", JSON.stringify(reindexed));

      // Delete from Convex Cloud DB
      deleteProductMutation({ id }).then(() => {
        console.log("[Convex] Product deleted successfully.");
      }).catch(err => {
        console.error("[Convex] Failed to delete product from cloud DB:", err);
      });

      triggerToast("제품이 삭제 처리되었습니다.");
    }
  };

  // Adjust product order (swap ▲ / ▼)
  const handleAdjustProductOrder = async (productId: string, direction: "up" | "down") => {
    // We compute the current filtered products to find the target to swap with
    const currentList = products.filter((p) => {
      const matchesCategory =
        adminProductCategoryFilter === "전체" || p.category === adminProductCategoryFilter;

      const searchKeyword = adminProductSearch.trim().toLowerCase();
      const matchesSearch =
        searchKeyword === "" ||
        p.name.toLowerCase().includes(searchKeyword) ||
        p.modelName.toLowerCase().includes(searchKeyword);

      return matchesCategory && matchesSearch;
    }).sort((a, b) => a.orderIndex - b.orderIndex);

    const currentIndex = currentList.findIndex((op) => op.id === productId);
    if (currentIndex === -1) return;

    const targetIdx = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIdx < 0 || targetIdx >= currentList.length) return; // Out of bounds

    const currentProduct = currentList[currentIndex];
    const targetProduct = currentList[targetIdx];

    // Find their indices in the original products array
    const originalCurrentIdx = products.findIndex((op) => op.id === currentProduct.id);
    const originalTargetIdx = products.findIndex((op) => op.id === targetProduct.id);

    if (originalCurrentIdx === -1 || originalTargetIdx === -1) return;

    // Swap indexes in products array
    const updated = [...products];
    const tempIndex = updated[originalCurrentIdx].orderIndex;
    updated[originalCurrentIdx].orderIndex = updated[originalTargetIdx].orderIndex;
    updated[originalTargetIdx].orderIndex = tempIndex;

    const sortedUpdated = updated
      .sort((a, b) => a.orderIndex - b.orderIndex)
      .map((p, idx) => ({ ...p, orderIndex: idx + 1 }));
    setProducts(sortedUpdated);
    localStorage.setItem("120_products", JSON.stringify(sortedUpdated));
    triggerToast("제품 전시 순서가 실시간으로 재정렬되었습니다.");

    try {
      await updateProductOrderMutation({ orderedIds: sortedUpdated.map((p) => p.id) });
    } catch (err) {
      console.error("[Convex] Failed to sync product order:", err);
    }
  };

  // Drag & Drop handlers for Product Reordering
  const handleProductDragStart = (e: React.DragEvent, id: string) => {
    setDraggedProductId(id);
    draggedProductRef.current = id;
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id);
  };

  const handleProductDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverProductId !== id) {
      setDragOverProductId(id);
    }
  };

  const handleProductDragLeave = (e: React.DragEvent) => {
    // Only clear if needed
  };

  const handleProductDrop = async (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    e.stopPropagation();

    const sourceId = draggedProductRef.current || draggedProductId || e.dataTransfer.getData("text/plain");
    setDraggedProductId(null);
    setDragOverProductId(null);
    draggedProductRef.current = null;

    if (!sourceId || sourceId === targetId) return;

    const sourceIdx = products.findIndex((p) => p.id === sourceId);
    const targetIdx = products.findIndex((p) => p.id === targetId);
    if (sourceIdx === -1 || targetIdx === -1) return;

    const updated = [...products];
    const [draggedItem] = updated.splice(sourceIdx, 1);
    updated.splice(targetIdx, 0, draggedItem);

    // Re-assign orderIndex 1..N
    const reindexed = updated.map((p, idx) => ({ ...p, orderIndex: idx + 1 }));
    setProducts(reindexed);
    localStorage.setItem("120_products", JSON.stringify(reindexed));

    triggerToast(`'${draggedItem.name}' 제품 순서가 변경되었습니다.`);

    try {
      await updateProductOrderMutation({ orderedIds: reindexed.map((p) => p.id) });
    } catch (err) {
      console.error("[Convex] Failed to sync product order:", err);
    }
  };

  const handleProductDragEnd = () => {
    setDraggedProductId(null);
    setDragOverProductId(null);
    draggedProductRef.current = null;
  };

  // ==========================================
  // 3. CATEGORY CONTROL HANDLERS
  // ==========================================
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    if (categories.includes(newCategoryName.trim())) {
      alert("이미 존재하는 카테고리입니다.");
      return;
    }
    const updated = [...categories, newCategoryName.trim()];
    setCategories(updated);
    localStorage.setItem("120_categories", JSON.stringify(updated));
    setNewCategoryName("");
    triggerToast("신규 카테고리가 등록되었습니다.");

    // Sync to Convex
    try {
      await updateProductCategoriesMutation({ categories: updated });
    } catch (err) {
      console.error("Failed to sync category add to Convex", err);
    }
  };

  const handleDeleteCategory = async (catName: string) => {
    if (products.some((p) => p.category === catName)) {
      alert(`이 카테고리('${catName}')에 소속된 제품이 존재하므로 삭제할 수 없습니다. 관련 제품의 카테고리를 먼저 변경해 주십시오.`);
      return;
    }
    if (confirm(`정말 '${catName}' 카테고리를 삭제하시겠습니까?`)) {
      const updated = categories.filter((c) => c !== catName);
      setCategories(updated);
      localStorage.setItem("120_categories", JSON.stringify(updated));
      triggerToast("카테고리가 삭제되었습니다.");

      // Sync to Convex
      try {
        await updateProductCategoriesMutation({ categories: updated });
      } catch (err) {
        console.error("Failed to sync category delete to Convex", err);
      }
    }
  };

  const handleAdjustCategoryOrder = async (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === categories.length - 1) return;

    const newCategories = [...categories];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    
    // Swap
    const temp = newCategories[index];
    newCategories[index] = newCategories[targetIdx];
    newCategories[targetIdx] = temp;

    setCategories(newCategories);
    localStorage.setItem("120_categories", JSON.stringify(newCategories));
    triggerToast("카테고리 노출 순서가 변경되었습니다.");

    // Sync to Convex
    try {
      await updateProductCategoriesMutation({ categories: newCategories });
    } catch (err) {
      console.error("Failed to sync category move to Convex", err);
    }
  };

  const handleAddLabel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabelName.trim()) return;
    if (labels.includes(newLabelName.trim())) {
      alert("이미 존재하는 라벨입니다.");
      return;
    }
    const updated = [...labels, newLabelName.trim()];
    setLabels(updated);
    localStorage.setItem("120_labels", JSON.stringify(updated));
    setNewLabelName("");
    triggerToast("신규 라벨이 등록되었습니다.");
  };

  const handleDeleteLabel = (labelName: string) => {
    if (confirm(`정말 '${labelName}' 라벨을 삭제하시겠습니까?`)) {
      const updated = labels.filter((l) => l !== labelName);
      setLabels(updated);
      localStorage.setItem("120_labels", JSON.stringify(updated));
      triggerToast("라벨이 삭제되었습니다.");
    }
  };

  const handleAdjustLabelOrder = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === labels.length - 1) return;

    const newLabels = [...labels];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    
    // Swap
    const temp = newLabels[index];
    newLabels[index] = newLabels[targetIdx];
    newLabels[targetIdx] = temp;

    setLabels(newLabels);
    localStorage.setItem("120_labels", JSON.stringify(newLabels));
    triggerToast("라벨 노출 순서가 변경되었습니다.");
  };

  // Browser-side image compression helper to avoid LocalStorage quota errors
  const compressImage = (base64Str: string, maxWidth = 800, maxHeight = 800, quality = 0.7): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        let ratio = 1;
        if (width > maxWidth) {
          ratio = maxWidth / width;
        }
        if (height * ratio > maxHeight) {
          ratio = maxHeight / height;
        }
        if (ratio < 1) {
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          // Fill pure white background first so transparent PNGs (누끼) never turn black when converted
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", quality));
        } else {
          resolve(base64Str);
        }
      };
      img.onerror = () => {
        resolve(base64Str);
      };
      img.src = base64Str;
    });
  };

  // Compress image with alpha transparency (WebP / PNG fallback) for product thumbnails (누끼)
  const compressImageAsPng = (base64Str: string, maxWidth = 400, maxHeight = 400): Promise<string> => {
    return new Promise((resolve) => {
      if (base64Str.startsWith("http://") || base64Str.startsWith("https://")) {
        resolve(base64Str);
        return;
      }
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        let ratio = 1;
        if (width > maxWidth) ratio = maxWidth / width;
        if (height * ratio > maxHeight) ratio = maxHeight / height;
        if (ratio < 1) {
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);
          try {
            const webp = canvas.toDataURL("image/webp", 0.8);
            if (webp && webp.startsWith("data:image/webp")) {
              resolve(webp);
              return;
            }
          } catch (e) {}
          resolve(canvas.toDataURL("image/jpeg", 0.8));
        } else {
          resolve(base64Str);
        }
      };
      img.onerror = () => {
        resolve(base64Str);
      };
      img.src = base64Str;
    });
  };

  // Image local file reader helper
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, target: "main" | "side") => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 10 * 1024 * 1024) {
      alert("이미지 크기는 10MB 이하여야 합니다.");
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = async () => {
      if (typeof reader.result === "string") {
        try {
          const compressed = await compressImage(reader.result, 800, 800, 0.7);
          if (target === "main") {
            setBannerMainImage(compressed);
          } else {
            setBannerSideImage(compressed);
          }
        } catch (err) {
          console.error("Image compression error:", err);
          if (target === "main") {
            setBannerMainImage(reader.result);
          } else {
            setBannerSideImage(reader.result);
          }
        }
      }
    };
    reader.readAsDataURL(file);
  };

  // ==========================================
  // 4. DYNAMIC BANNER, POPUP & FLOATING CONTROL HANDLERS
  // ==========================================
  const handleUpdateBanners = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedBanner: BannerSettings = {
      mainTag: bannerMainTag,
      mainTitle: bannerMainTitle,
      mainDesc: bannerMainDesc,
      mainBtnText: bannerMainBtnText,
      mainLink: bannerMainLink,
      sideTag: bannerSideTag,
      sideTitle: bannerSideTitle,
      sideDesc: bannerSideDesc,
      sideBtnText: bannerSideBtnText,
      mainImage: bannerMainImage || undefined,
      sideImage: bannerSideImage || undefined,
      sideLink: bannerSideLink || undefined
    };
    
    updateBannersMutation({
      mainTag: updatedBanner.mainTag,
      mainTitle: updatedBanner.mainTitle,
      mainDesc: updatedBanner.mainDesc,
      mainBtnText: updatedBanner.mainBtnText,
      mainLink: updatedBanner.mainLink,
      sideTag: updatedBanner.sideTag,
      sideTitle: updatedBanner.sideTitle,
      sideDesc: updatedBanner.sideDesc,
      sideBtnText: updatedBanner.sideBtnText,
      mainImage: updatedBanner.mainImage,
      sideImage: updatedBanner.sideImage,
      sideLink: updatedBanner.sideLink
    })
      .then(() => {
        setBanner(updatedBanner);
        try {
          localStorage.setItem("120_banners", JSON.stringify(updatedBanner));
          triggerToast("본사 대시보드 배너 설정이 실시간으로 동기화 저장되었습니다!");
        } catch (err) {
          console.error(err);
        }
      })
      .catch((err) => {
        console.error(err);
        alert("배너 설정 저장 중 오류가 발생했습니다. 이미지 용량을 줄이거나 다른 이미지를 사용해 주세요.");
      });
  };

  const handlePopupImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert("이미지 크기는 10MB 이하여야 합니다.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = async () => {
      if (typeof reader.result === "string") {
        try {
          const compressed = await compressImage(reader.result, 800, 800, 0.7);
          setPopupImage(compressed);
        } catch (err) {
          console.error("Popup image compression error:", err);
          setPopupImage(reader.result);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  // ==========================================
  // POPUP HISTORY CRUD & MODAL HANDLERS
  // ==========================================
  const handleOpenPopupModal = (pop?: any) => {
    if (pop) {
      setSelectedPopupForEdit(pop);
      setPopupActive(pop.isActive);
      setPopupTitle(pop.title);
      setPopupDesc(pop.desc);
      setPopupImage(pop.image || "");
      setPopupLink(pop.link || "");
      setPopupBtnText(pop.btnText || "");
      setPopupTitleColor(pop.titleColor || "#ffffff");
      setPopupTitleSize(pop.titleSize || "18px");
      setPopupDescColor(pop.descColor || "#735965");
      setPopupDescSize(pop.descSize || "12px");
      setPopupBtnBgColor(pop.btnBgColor || "#f25f8a");
      setPopupBtnTextColor(pop.btnTextColor || "#ffffff");
      setPopupBtnTextSize(pop.btnTextSize || "12px");
      setPopupStartDate(pop.startDate || "");
      setPopupEndDate(pop.endDate || "");
      setPopupTargetPage(pop.targetPage || "all");
    } else {
      setSelectedPopupForEdit(null);
      setPopupActive(true);
      setPopupTitle("");
      setPopupDesc("");
      setPopupImage("");
      setPopupLink("order");
      setPopupBtnText("자재 주문하러 가기");
      setPopupTitleColor("#ffffff");
      setPopupTitleSize("18px");
      setPopupDescColor("#735965");
      setPopupDescSize("12px");
      setPopupBtnBgColor("#f25f8a");
      setPopupBtnTextColor("#ffffff");
      setPopupBtnTextSize("12px");
      setPopupStartDate(new Date().toISOString().split("T")[0]);
      setPopupEndDate("");
      setPopupTargetPage("all");
    }
    setShowPopupModal(true);
  };

  const handleSaveInstagram = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!instaText || !instaLink || !instaDate) {
      alert("필수 항목(게시물 링크, 내용, 날짜)을 모두 기입해주세요.");
      return;
    }

    // 게시물 링크만 입력된 경우 썸네일 이미지 자동 추출
    const finalImg = instaImg.trim() || getInstagramThumbnailUrl(instaLink.trim());
    if (!finalImg) {
      alert("올바른 인스타그램 게시물 링크를 입력해 주세요.");
      return;
    }
    
    // Validate maximum feed counts (10 feeds total)
    if (!instaId) {
      if (convexInstagram && convexInstagram.length >= 10) {
        alert("인스타그램 게시물은 최대 10개까지만 등록할 수 있습니다. 기존 게시물을 삭제한 뒤 추가해 주세요.");
        return;
      }
    }

    // Validate maximum main feed designations (4 feeds max)
    if (instaIsMain) {
      const activeMains = convexInstagram?.filter(item => item.isMain && item._id !== instaId) || [];
      if (activeMains.length >= 4) {
        alert("메인 노출은 최대 4개까지만 지정할 수 있습니다. 기존에 지정된 다른 메인 포스트의 노출 체크를 해제해 주세요.");
        return;
      }
    }

    try {
      await saveInstagramMutation({
        id: instaId ? (instaId as any) : undefined,
        img: finalImg,
        text: instaText,
        link: instaLink,
        date: instaDate,
        orderIndex: Number(instaOrder),
        isMain: instaIsMain,
      });
      alert("인스타그램 게시물이 성공적으로 저장되었습니다.");
      setIsInstaModalOpen(false);
      setInstaId(null);
      setInstaImg("");
      setInstaText("");
      setInstaLink("");
      setInstaDate("");
      setInstaOrder(1);
      setInstaIsMain(false);
    } catch (err) {
      console.error(err);
      alert("저장 중 에러가 발생했습니다.");
    }
  };

  const handleDeleteInstagram = async (id: any) => {
    if (!confirm("정말 이 게시물을 삭제하시겠습니까?")) return;
    try {
      await deleteInstagramMutation({ id });
      alert("성공적으로 삭제되었습니다.");
    } catch (err) {
      console.error(err);
      alert("삭제 중 에러가 발생했습니다.");
    }
  };

  const handleInstaDragStart = (e: React.DragEvent, index: number) => {
    setDraggedInstaIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleInstaDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedInstaIndex === null || draggedInstaIndex === index) return;
    setDragOverInstaIndex(index);
  };

  const handleInstaDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedInstaIndex === null || draggedInstaIndex === dropIndex) {
      setDraggedInstaIndex(null);
      setDragOverInstaIndex(null);
      return;
    }

    const updatedList = [...localInstaList];
    const [movedItem] = updatedList.splice(draggedInstaIndex, 1);
    updatedList.splice(dropIndex, 0, movedItem);

    const reorderedItems = updatedList.map((item, idx) => ({
      ...item,
      orderIndex: idx + 1,
    }));

    setLocalInstaList(reorderedItems);
    setDraggedInstaIndex(null);
    setDragOverInstaIndex(null);

    try {
      await reorderInstagramMutation({
        items: reorderedItems.map((item) => ({
          id: item._id,
          orderIndex: item.orderIndex,
        })),
      });
    } catch (err) {
      console.error("인스타 피드 순서 변경 실패:", err);
    }
  };

  const handleInstaMove = async (currentIndex: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= localInstaList.length) return;

    const updatedList = [...localInstaList];
    const [movedItem] = updatedList.splice(currentIndex, 1);
    updatedList.splice(targetIndex, 0, movedItem);

    const reorderedItems = updatedList.map((item, idx) => ({
      ...item,
      orderIndex: idx + 1,
    }));

    setLocalInstaList(reorderedItems);

    try {
      await reorderInstagramMutation({
        items: reorderedItems.map((item) => ({
          id: item._id,
          orderIndex: item.orderIndex,
        })),
      });
    } catch (err) {
      console.error("인스타 피드 순서 변경 실패:", err);
    }
  };

  const handleToggleInstaMain = async (item: any) => {
    const nextIsMain = !item.isMain;
    if (nextIsMain) {
      const activeMains = convexInstagram?.filter((i) => i.isMain && i._id !== item._id) || [];
      if (activeMains.length >= 4) {
        alert("메인 노출은 최대 4개까지만 지정할 수 있습니다. 기존에 지정된 다른 메인 포스트의 노출 체크를 해제해 주세요.");
        return;
      }
    }

    try {
      await saveInstagramMutation({
        id: item._id,
        img: item.img,
        text: item.text,
        link: item.link,
        date: item.date,
        orderIndex: item.orderIndex,
        isMain: nextIsMain,
      });
    } catch (err) {
      console.error(err);
      alert("메인 노출 상태 변경 중 에러가 발생했습니다.");
    }
  };

  const handleOpenInstaEdit = async (item: any) => {
    setInstaId(item._id);
    setInstaText(item.text);
    setInstaLink(item.link);
    setInstaDate(item.date);
    setInstaOrder(item.orderIndex);
    setInstaIsMain(item.isMain ?? false);
    setIsInstaModalOpen(true);

    if (!item.img || item.img.includes("weserv.nl")) {
      setInstaImg("");
      if (item.link) {
        try {
          const res = await fetch(`/api/instagram-thumb?url=${encodeURIComponent(item.link)}`);
          const data = await res.json();
          if (data.success && data.thumbnailUrl) {
            setInstaImg(data.thumbnailUrl);
          }
        } catch (err) {
          console.error("Failed to auto-refresh thumbnail on edit:", err);
        }
      }
    } else {
      setInstaImg(item.img);
    }
  };

  const handleRefreshAllInstaHd = async () => {
    if (!convexInstagram || convexInstagram.length === 0) return;
    setIsRefreshingInstaHd(true);
    try {
      let updatedCount = 0;
      for (const item of convexInstagram) {
        if (item.link) {
          const res = await fetch(`/api/instagram-thumb?url=${encodeURIComponent(item.link)}`);
          const data = await res.json();
          if (data.success && data.thumbnailUrl) {
            await saveInstagramMutation({
              id: item._id,
              img: data.thumbnailUrl,
              text: item.text,
              link: item.link,
              date: item.date,
              orderIndex: item.orderIndex,
              isMain: item.isMain,
            });
            updatedCount++;
          }
        }
      }
      alert(`총 ${updatedCount}개의 인스타그램 피드 썸네일이 FULL HD 초고화질로 성공적으로 갱신되었습니다!`);
    } catch (err) {
      console.error("HD Refresh Error:", err);
      alert("HD 썸네일 갱신 중 에러가 발생했습니다.");
    } finally {
      setIsRefreshingInstaHd(false);
    }
  };

  const handleSavePopup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!popupTitle || !popupDesc) {
      alert("팝업 제목과 상세 본문을 모두 입력해 주세요.");
      return;
    }

    try {
      const payload: any = {
        isActive: popupActive,
        title: popupTitle,
        desc: popupDesc,
        image: popupImage || undefined,
        link: popupLink || undefined,
        btnText: popupBtnText || undefined,
        titleColor: popupTitleColor || undefined,
        titleSize: popupTitleSize || undefined,
        descColor: popupDescColor || undefined,
        descSize: popupDescSize || undefined,
        btnBgColor: popupBtnBgColor || undefined,
        btnTextColor: popupBtnTextColor || undefined,
        btnTextSize: popupBtnTextSize || undefined,
        startDate: popupStartDate || undefined,
        endDate: popupEndDate || undefined,
        targetPage: popupTargetPage,
      };

      if (selectedPopupForEdit) {
        payload._id = selectedPopupForEdit._id;
      }

      await createOrUpdatePopupMutation(payload);
      
      // Clear tab-specific local flags to force fresh loading on user-side
      if (typeof window !== "undefined") {
        localStorage.removeItem("120_popup_closed_date");
        localStorage.removeItem("120_popup_closed_title");
        sessionStorage.removeItem("120_popup_closed_session");
      }

      setShowPopupModal(false);
      triggerToast(
        selectedPopupForEdit
          ? "공지 팝업 수정이 성공적으로 완료되었습니다!"
          : "신규 공지 팝업이 성공적으로 등록 및 배포되었습니다!"
      );
    } catch (err) {
      console.error("Popup save error:", err);
      alert("팝업 저장 중 오류가 발생했습니다. 이미지 파일 용량을 줄이거나 다시 시도해 주세요.");
    }
  };

  const handleDeletePopup = async (popId: any) => {
    if (confirm("정말 이 팝업 데이터를 영구 삭제하시겠습니까? 삭제된 팝업은 더 이상 점주 포털 및 랜딩 페이지에 노출되지 않습니다.")) {
      try {
        await deletePopupMutation({ _id: popId });
        triggerToast("선택하신 공지 팝업이 성공적으로 삭제되었습니다.");
      } catch (err) {
        console.error("Popup delete error:", err);
        alert("팝업 삭제에 실패했습니다.");
      }
    }
  };

  const handleTogglePopupActive = async (popId: any, currentActive: boolean) => {
    try {
      await togglePopupActiveMutation({ _id: popId, isActive: !currentActive });
      triggerToast(!currentActive ? "팝업이 활성화되어 실시간 노출 대상에 편입되었습니다." : "팝업이 비활성화(숨김) 처리되었습니다.");
    } catch (err) {
      console.error("Popup toggle active error:", err);
      alert("팝업 상태 변경에 실패했습니다.");
    }
  };

  const handleUpdateFloating = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedFloating: FloatingSettings = {
      isActive: floatingActive,
      instaUrl: floatingInsta,
      youtubeUrl: floatingYoutube,
      chatUrl: floatingChat,
      phoneNo: floatingPhone,
      kakaoUrl: floatingKakao,
      blogUrl: floatingBlog
    };
    try {
      localStorage.setItem("120_floatings", JSON.stringify(updatedFloating));
      await updateFloatingMutation(updatedFloating);
      triggerToast("홈페이지 플로팅 채널 연동 정보가 실시간으로 저장 및 갱신되었습니다!");
    } catch (err) {
      console.error(err);
      alert("플로팅 설정 저장 중 오류가 발생했습니다.");
    }
  };

  // ==========================================
  const handleUpdateAdminAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminIdSetting) {
      alert("관리자 ID를 입력해 주세요.");
      return;
    }
    if (adminPwSetting) {
      if (adminPwSetting !== adminPwSettingConfirm) {
        alert("새 비밀번호와 비밀번호 확인이 일치하지 않습니다.");
        return;
      }
      localStorage.setItem("120_admin_pw", adminPwSetting);
    }
    localStorage.setItem("120_admin_id", adminIdSetting);
    setAdminPwSetting("");
    setAdminPwSettingConfirm("");
    triggerToast("본사 최고 관리자 계정 정보가 성공적으로 변경되었습니다.");
  };

  const handleUpdateNaverClientId = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("120_naver_client_id", naverClientIdSetting.trim());
    triggerToast("네이버 지도 API 설정이 성공적으로 저장되었습니다!");
  };

  const handleSavePolicies = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("120_terms_of_use", termsOfUseSetting);
    localStorage.setItem("120_privacy_policy", privacyPolicySetting);
    localStorage.setItem("120_refund_policy", refundPolicySetting);
    triggerToast("이용약관, 개인정보처리방침 및 환불정책이 성공적으로 저장되었습니다!");
  };

  const handleUpdateSmsSettings = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("120_sms_settings", JSON.stringify(smsSettings));
    triggerToast("실시간 SMS 알림 연동 및 문구 설정이 저장되었습니다.");
  };

  const handleTestSendSms = async () => {
    if (!smsSettings || !smsSettings.aligoKey || !smsSettings.aligoUserId) {
      alert("알리고 API Key와 User ID를 먼저 입력하고 저장해 주세요.");
      return;
    }
    if (!testSenderPhone.trim()) {
      alert("알리고에 가입/등록된 발신 번호를 입력해 주세요.");
      return;
    }
    if (!testReceiverPhone.trim()) {
      alert("테스트 수신 번호를 입력해 주세요.");
      return;
    }
    
    setIsTestingSms(true);
    try {
      const formattedSender = testSenderPhone.replace(/[^0-9]/g, "");
      const formattedReceiver = testReceiverPhone.replace(/[^0-9]/g, "");
      
      const response = await sendSmsAction({
        key: smsSettings.aligoKey,
        userId: smsSettings.aligoUserId,
        sender: formattedSender,
        receiver: formattedReceiver,
        msg: "[120겹파이] 알리고 SMS API 연동 테스트가 성공했습니다.",
        isTest: smsSettings.aligoTestMode !== false
      });
      
      if (response.success) {
        if (smsSettings.aligoTestMode !== false) {
          alert("테스트 발송 요청 성공! (현재 테스트 모드가 켜져 있으므로 전송 로그만 정상 반환되었으며, 실제 문자는 전송되지 않았습니다.)");
        } else {
          alert("테스트 문자가 실제로 성공적으로 발송되었습니다!");
        }
      } else {
        alert(`발송 실패: ${response.message || response.error || "알 수 없는 오류"}`);
      }
    } catch (e: any) {
      console.error(e);
      alert(`발송 오류: ${e.message || e}`);
    } finally {
      setIsTestingSms(false);
    }
  };

  const addAdminReceiver = (eventKey: string) => {
    const number = newAdminPhoneInputs[eventKey] || "";
    if (!number.trim()) return;
    
    // Auto format hyphens if not present
    let formatted = number.replace(/[^0-9]/g, "");
    if (formatted.length === 11) {
      formatted = `${formatted.slice(0, 3)}-${formatted.slice(3, 7)}-${formatted.slice(7)}`;
    } else if (formatted.length === 10) {
      formatted = `${formatted.slice(0, 3)}-${formatted.slice(3, 6)}-${formatted.slice(6)}`;
    } else {
      formatted = number.trim();
    }

    const currentEvent = smsSettings[eventKey];
    const currentReceivers = currentEvent?.admin?.receivers || [];
    
    if (currentReceivers.includes(formatted)) {
      triggerToast("이미 등록된 번호입니다.");
      return;
    }

    setSmsSettings({
      ...smsSettings,
      [eventKey]: {
        ...currentEvent,
        admin: {
          ...currentEvent.admin,
          receivers: [...currentReceivers, formatted]
        }
      }
    });

    setNewAdminPhoneInputs({
      ...newAdminPhoneInputs,
      [eventKey]: ""
    });
    triggerToast("관리자 수신 번호가 목록에 추가되었습니다. (저장 버튼을 눌러야 반영됩니다.)");
  };

  const removeAdminReceiver = (eventKey: string, number: string) => {
    const currentEvent = smsSettings[eventKey];
    const currentReceivers = currentEvent?.admin?.receivers || [];

    setSmsSettings({
      ...smsSettings,
      [eventKey]: {
        ...currentEvent,
        admin: {
          ...currentEvent.admin,
          receivers: currentReceivers.filter((num: string) => num !== number)
        }
      }
    });
    triggerToast("수신 번호가 제거되었습니다. (저장 버튼을 눌러야 반영됩니다.)");
  };

  // ==========================================
  // GALLERY MANAGEMENT HANDLERS
  // ==========================================
  const handleOpenAddGalleryModal = () => {
    setSelectedGalleryItem(null);
    setGalleryItemName("");
    setGalleryItemCategory(galleryCategories[0] || "신메뉴");
    setGalleryItemUrl("");
    setGalleryUploadMethod("url");
    setShowGalleryModal(true);
  };

  const handleOpenEditGalleryModal = (item: GalleryItem) => {
    setSelectedGalleryItem(item);
    setGalleryItemName(item.name);
    setGalleryItemCategory(item.category);
    setGalleryItemUrl(item.url);
    setGalleryUploadMethod("url");
    setShowGalleryModal(true);
  };

  const handleGallerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = galleryItemName.trim();
    const trimmedUrl = galleryItemUrl.trim();
    if (!trimmedName || !trimmedUrl) {
      alert("이미지명과 이미지 경로(URL/파일)는 필수 항목입니다.");
      return;
    }

    let updatedList: GalleryItem[];
    if (selectedGalleryItem) {
      // Edit existing
      updatedList = galleryItems.map(item => 
        item.id === selectedGalleryItem.id
          ? { ...item, name: trimmedName, category: galleryItemCategory, url: trimmedUrl }
          : item
      );
      
      // Convex Sync
      if (selectedGalleryItem._id) {
        try {
          await removeGalleryItemMutation({ id: selectedGalleryItem._id as any });
          await addGalleryItemMutation({
            name: trimmedName,
            category: galleryItemCategory,
            url: trimmedUrl,
            regDate: selectedGalleryItem.regDate,
            isFeatured: selectedGalleryItem.isFeatured,
            orderIndex: (selectedGalleryItem as any).orderIndex
          });
        } catch (e) {
          console.error(e);
        }
      }
      triggerToast(`이미지 [${trimmedName}] 정보가 수정되었습니다.`);
    } else {
      // Add new
      const newItem: GalleryItem = {
        id: `gal-${Date.now()}`,
        name: trimmedName,
        category: galleryItemCategory,
        url: trimmedUrl,
        regDate: new Date().toISOString().split("T")[0]
      };
      updatedList = [newItem, ...galleryItems];
      try {
        await addGalleryItemMutation({
          name: trimmedName,
          category: galleryItemCategory,
          url: trimmedUrl,
          regDate: newItem.regDate
        });
      } catch (e) {
        console.error("Failed to add gallery item to Convex", e);
      }
      triggerToast(`새로운 이미지 [${trimmedName}]가 등록되었습니다.`);
    }

    setGalleryItems(updatedList);
    safeSaveGalleryItems(updatedList);

    if (!selectedGalleryItem && keepGalleryModalOpen) {
      setGalleryItemName("");
      setGalleryItemUrl("");
      const fileInput = document.getElementById("gallery-file-input") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } else {
      setShowGalleryModal(false);
    }
  };

  const handleDeleteGalleryItem = async (id: string, name: string) => {
    if (confirm(`이미지 [${name}]을 갤러리에서 삭제하시겠습니까?`)) {
      const updatedList = galleryItems.filter(item => item.id !== id);
      setGalleryItems(updatedList);
      safeSaveGalleryItems(updatedList);
      
      const itemToDelete = galleryItems.find(item => item.id === id);
      if (itemToDelete && itemToDelete._id) {
        try {
          await removeGalleryItemMutation({ id: itemToDelete._id as any });
        } catch (e) {
          console.error("Failed to delete gallery item from Convex", e);
        }
      }
      triggerToast(`이미지 [${name}]이 삭제되었습니다.`);
    }
  };

  const handleAddGalleryCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newGalleryCategoryName.trim();
    if (!trimmed) return;
    if (galleryCategories.includes(trimmed)) {
      alert("이미 존재하는 카테고리입니다.");
      return;
    }
    const updated = [...galleryCategories, trimmed];
    setGalleryCategories(updated);
    localStorage.setItem("120_gallery_categories", JSON.stringify(updated));
    try {
      await updateCategoriesMutation({ categories: updated });
    } catch (e) {
      console.error("Failed to sync gallery categories in Convex", e);
    }
    setNewGalleryCategoryName("");
    setGalleryItemCategory(trimmed);
    triggerToast(`카테고리 [${trimmed}]이 추가되었습니다.`);
  };

  const handleDeleteGalleryCategory = async (catToDelete: string) => {
    if (galleryCategories.length <= 1) {
      alert("최소 1개 이상의 카테고리는 유지되어야 합니다.");
      return;
    }
    if (confirm(`카테고리 [${catToDelete}]을 삭제하시겠습니까?\n해당 카테고리로 지정되어 있는 이미지들은 '기타' 카테고리로 변경됩니다.`)) {
      let updatedCats = galleryCategories.filter(c => c !== catToDelete);

      // Relabel affected items to '기타'
      const updatedItems = galleryItems.map(item => 
        item.category === catToDelete ? { ...item, category: "기타" } : item
      );
      setGalleryItems(updatedItems);
      localStorage.setItem("120_gallery_items", JSON.stringify(updatedItems));

      // If '기타' doesn't exist in updatedCats, add it
      if (!updatedCats.includes("기타")) {
        updatedCats = [...updatedCats, "기타"];
      }

      setGalleryCategories(updatedCats);
      localStorage.setItem("120_gallery_categories", JSON.stringify(updatedCats));

      try {
        await updateCategoriesMutation({ categories: updatedCats });
      } catch (e) {
        console.error("Failed to sync gallery categories in Convex", e);
      }
    }
  };

  const handleAdjustGalleryCategoryOrder = async (currentIndex: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIdx < 0 || targetIdx >= galleryCategories.length) return;

    const updated = [...galleryCategories];
    const temp = updated[currentIndex];
    updated[currentIndex] = updated[targetIdx];
    updated[targetIdx] = temp;

    setGalleryCategories(updated);
    localStorage.setItem("120_gallery_categories", JSON.stringify(updated));
    try {
      await updateCategoriesMutation({ categories: updated });
    } catch (e) {
      console.error("Failed to sync gallery categories in Convex", e);
    }
    triggerToast("갤러리 카테고리 순서가 실시간으로 재정렬되었습니다.");
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedId || draggedId === targetId) return;

    const draggedIdx = galleryItems.findIndex(item => item.id === draggedId);
    const targetIdx = galleryItems.findIndex(item => item.id === targetId);
    if (draggedIdx === -1 || targetIdx === -1) return;

    const updated = [...galleryItems];
    const [draggedItem] = updated.splice(draggedIdx, 1);
    updated.splice(targetIdx, 0, draggedItem);

    setGalleryItems(updated);
    safeSaveGalleryItems(updated);

    const orderedIds = updated.filter(item => item._id).map(item => item._id);
    if (orderedIds.length > 0) {
      try {
        await updateOrderMutation({ orderedIds: orderedIds as any });
      } catch (e) {
        console.error("Failed to update gallery order in Convex", e);
      }
    }

    setDraggedId(null);
    triggerToast("갤러리 이미지 전시 순서가 실시간으로 재정렬 및 배포되었습니다!");
  };

  const handleDragEnd = () => {
    setDraggedId(null);
  };

  const handleToggleFeatured = async (item: GalleryItem) => {
    const currentFeaturedCount = galleryItems.filter(i => i.isFeatured).length;
    const willBeFeatured = !item.isFeatured;

    if (willBeFeatured && currentFeaturedCount >= 9) {
      alert("대표 이미지는 최대 9개까지만 지정할 수 있습니다!");
      return;
    }

    const updated = galleryItems.map(i => 
      i.id === item.id ? { ...i, isFeatured: willBeFeatured } : i
    );
    setGalleryItems(updated);
    safeSaveGalleryItems(updated);

    if (item._id) {
      try {
        await toggleFeaturedMutation({ id: item._id as any, isFeatured: willBeFeatured });
        triggerToast(`이미지 [${item.name}]이 대표 이미지로 ${willBeFeatured ? '지정' : '해제'}되었습니다.`);
      } catch (e) {
        console.error("Failed to toggle featured status in Convex", e);
      }
    }
  };

  const handleGalleryImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 10 * 1024 * 1024) {
      alert("이미지 크기는 10MB 이하여야 합니다.");
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = async () => {
      if (typeof reader.result === "string") {
        try {
          const compressed = await compressImage(reader.result, 800, 800, 0.7);
          setGalleryItemUrl(compressed);
        } catch (err) {
          console.error("Gallery image compression error:", err);
          setGalleryItemUrl(reader.result);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleProductImgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 10 * 1024 * 1024) {
      alert("이미지 크기는 10MB 이하여야 합니다.");
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = async () => {
      if (typeof reader.result === "string") {
        try {
          const compressed = await compressImageAsPng(reader.result, 400, 400);
          setProductImg(compressed);
        } catch (err) {
          console.error("Product image compression error:", err);
          setProductImg(reader.result);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleProductDetailImgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 10 * 1024 * 1024) {
      alert("이미지 크기는 10MB 이하여야 합니다.");
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = async () => {
      if (typeof reader.result === "string") {
        try {
          const compressed = await compressImage(reader.result, 800, 1200, 0.75);
          setProductDetailImg(compressed);
        } catch (err) {
          console.error("Product detail image compression error:", err);
          setProductDetailImg(reader.result);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddDeliveryStatus = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newStatusName.trim();
    if (!trimmed) return;
    if (deliveryStatuses.includes(trimmed)) {
      alert("이미 존재하는 배송 상태값입니다.");
      return;
    }
    const updated = [...deliveryStatuses, trimmed];
    setDeliveryStatuses(updated);
    localStorage.setItem("120_delivery_statuses", JSON.stringify(updated));
    setNewStatusName("");
    triggerToast(`신규 배송 상태값 [${trimmed}]이 등록되었습니다.`);
  };

  const handleDeleteDeliveryStatus = (statusToDelete: string) => {
    if (["주문완료", "배송완료"].includes(statusToDelete)) {
      alert("[주문완료] 및 [배송완료]는 코어 시스템 상태값으로 삭제할 수 없습니다.");
      return;
    }
    if (confirm(`배송 상태값 [${statusToDelete}]을 삭제하시겠습니까?`)) {
      const updated = deliveryStatuses.filter((s) => s !== statusToDelete);
      setDeliveryStatuses(updated);
      localStorage.setItem("120_delivery_statuses", JSON.stringify(updated));
      triggerToast(`배송 상태값 [${statusToDelete}]이 삭제되었습니다.`);
    }
  };

  const handleResetDeliveryStatuses = () => {
    if (confirm("배송 상태값을 시스템 초기 상태로 리셋하시겠습니까?")) {
      const defaults = ["주문완료", "배송준비중", "배송중", "배송완료"];
      setDeliveryStatuses(defaults);
      localStorage.setItem("120_delivery_statuses", JSON.stringify(defaults));
      triggerToast("배송 상태값이 초기값으로 리셋되었습니다.");
    }
  };

  const handleOpenOrderModal = (order: Order) => {
    setSelectedOrder(order);
    setSelectedCourier((order as any).courier || "CJ대한통운");
    setInputTrackingNo("");
    
    // Initialize tracking list
    if (order.trackingList && order.trackingList.length > 0) {
      setModalTrackingList(order.trackingList);
    } else if (order.courier && order.trackingNo) {
      setModalTrackingList([{ courier: order.courier, trackingNo: order.trackingNo }]);
    } else {
      setModalTrackingList([]);
    }

    setShowOrderModal(true);
  };

  const handleUpdateOrderTracking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    
    if (modalTrackingList.length === 0) {
      alert("송장번호를 최소 하나 이상 등록해 주세요.");
      return;
    }

    try {
      // 1. Convex Cloud DB에 송장 정보 업데이트
      await updateTrackingMutation({
        id: selectedOrder.id,
        trackingList: modalTrackingList,
        status: "배송중", // 송장 등록 시 자동으로 배송중으로 상태 전이
      });

      // 2. React State 동기화 및 LocalStorage 갱신
      const firstCourier = modalTrackingList[0]?.courier || "";
      const firstTrackingNo = modalTrackingList[0]?.trackingNo || "";
      const updated = orders.map((o) => 
        o.id === selectedOrder.id 
          ? { 
              ...o, 
              courier: firstCourier, 
              trackingNo: firstTrackingNo, 
              trackingList: modalTrackingList, 
              status: "배송중" 
            } 
          : o
      );
      setOrders(updated as any);
      localStorage.setItem("120_orders", JSON.stringify(updated));

      // 3. 현재 열려있는 모달 주문서 상태 동시 업데이트
      setSelectedOrder({
        ...selectedOrder,
        courier: firstCourier,
        trackingNo: firstTrackingNo,
        trackingList: modalTrackingList,
        status: "배송중"
      } as any);

      triggerToast("송장 번호 등록 및 배송중 처리가 실시간 반영되었습니다!");
    } catch (err) {
      console.error("Failed to update tracking info:", err);
      alert("송장 정보 갱신 중 오류가 발생했습니다.");
    }
  };

  const handleToAddTracking = () => {
    if (!inputTrackingNo.trim()) {
      alert("송장번호를 입력해 주세요.");
      return;
    }
    if (modalTrackingList.some(item => item.trackingNo === inputTrackingNo.trim())) {
      alert("이미 추가된 송장번호입니다.");
      return;
    }
    setModalTrackingList([...modalTrackingList, { courier: selectedCourier, trackingNo: inputTrackingNo.trim() }]);
    setInputTrackingNo("");
  };

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    const updatedOrders = orders.map((o) => 
      o.id === orderId ? { ...o, status: newStatus as any } : o
    );

    setOrders(updatedOrders);
    localStorage.setItem("120_orders", JSON.stringify(updatedOrders));

    // Save to Convex Cloud DB
    updateOrderStatusMutation({ id: orderId, status: newStatus }).then(() => {
      console.log("[Convex] Order status updated successfully.");
    }).catch(err => {
      console.error("[Convex] Failed to update order status:", err);
    });

    triggerToast(`주문 상태가 [${newStatus}]로 변경되었습니다.`);
    
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus as any });
    }
  };

  // Admin stats
  const pendingInquiriesCount = inquiries.filter((i) => i.status === "답변대기").length;
  const incomingOrdersCount = orders.filter((o) => o.status === "주문완료").length;

  if (checkingAuth) {
    return (
      <div id="admin-portal" className="h-screen bg-[#0B0F17] flex flex-col items-center justify-center font-bold text-white gap-4">
        <div className="w-10 h-10 border-3 border-[#FF6B4A] border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs font-black tracking-widest text-slate-300">인증 상태 확인 중...</span>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div id="admin-portal" className="min-h-screen w-screen bg-[#0B0F17] text-white flex flex-col font-sans select-none antialiased justify-center items-center p-4 relative overflow-hidden">
        {/* Soft Warm Ambient Yellow Glow */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(circle at 50% 30%, rgba(254, 212, 34, 0.12) 0%, rgba(11, 15, 23, 0) 70%)"
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
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">120PIE HEAD OFFICE</h2>
              <span className="inline-block text-xs font-black text-[#0F172A] bg-[#FED422] px-4 py-1 rounded-md shadow-2xs">
                통합 본사 어드민 포털
              </span>
            </div>
            
            <p className="text-xs text-slate-400 font-semibold leading-relaxed max-w-xs mx-auto">
              본 시스템은 120겹파이 가맹본부 관리자용 전용 제어 시스템입니다. 인가된 본사 계정으로 로그인해 주세요.
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
              <label className="text-xs font-black text-slate-200 block">본사 관리자 ID</label>
              <input
                type="text"
                placeholder="관리자 ID를 입력하세요"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                required
                className="w-full bg-slate-800/60 border border-slate-700/80 rounded-lg px-4 py-3.5 text-xs sm:text-sm text-white placeholder-slate-500 font-extrabold focus:outline-none focus:border-[#FED422] focus:ring-2 focus:ring-[#FED422]/30 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-200 block">보안 비밀번호</label>
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

  // Product Real-time Filtered List Calculation
  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      adminProductCategoryFilter === "전체" || p.category === adminProductCategoryFilter;

    const searchKeyword = adminProductSearch.trim().toLowerCase();
    const matchesSearch =
      searchKeyword === "" ||
      p.name.toLowerCase().includes(searchKeyword) ||
      p.modelName.toLowerCase().includes(searchKeyword);

    return matchesCategory && matchesSearch;
  });

  const isProductFiltering = adminProductSearch.trim() !== "" || adminProductCategoryFilter !== "전체";

  // ==========================================
  // ANALYTICS DATA PROCESSING & COMPUTATION
  // ==========================================
  // 1. Filter consultations (inquiries) for the selected period
  const filteredConsultations = consultations.filter((inq) => {
    if (!inq.regDate) return false;
    let ok = true;
    if (analyticsStartDate) ok = ok && inq.regDate >= analyticsStartDate;
    if (analyticsEndDate) ok = ok && inq.regDate <= analyticsEndDate;
    return ok;
  });

  // 2. Count metrics
  const totalVisits = analyticsEvents.filter(e => e.type === "visit").length;
  const totalInquiries = filteredConsultations.length;
  const totalMenuViews = analyticsEvents.filter(e => e.type === "menu_view").length;

  // 3. Generate daily trend data
  const dateList = getDatesInRange(analyticsStartDate, analyticsEndDate);
  const dailyData = dateList.map(date => {
    const visits = analyticsEvents.filter(e => e.type === "visit" && e.date === date).length;
    const inquiries = filteredConsultations.filter(inq => inq.regDate === date).length;
    const menuViews = analyticsEvents.filter(e => e.type === "menu_view" && e.date === date).length;
    return { date, visits, inquiries, menuViews };
  });

  // 4. Referrer Ranking
  const referrerCounts: Record<string, number> = {};
  analyticsEvents.forEach(e => {
    const category = parseReferrer(e.referrer || "direct");
    referrerCounts[category] = (referrerCounts[category] || 0) + 1;
  });
  const sortedReferrers = Object.entries(referrerCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
  const totalReferrerCount = sortedReferrers.reduce((acc, curr) => acc + curr.count, 0) || 1;

  // 5. Menu View Ranking
  const menuCounts: Record<string, number> = {};
  analyticsEvents.filter(e => e.type === "menu_view" && e.menuName).forEach(e => {
    const name = e.menuName!;
    menuCounts[name] = (menuCounts[name] || 0) + 1;
  });
  const sortedMenus = Object.entries(menuCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
  const totalMenuViewCount = sortedMenus.reduce((acc, curr) => acc + curr.count, 0) || 1;

  // 6. IP Analytics
  const ipMap: Record<string, {
    ip: string;
    visitCount: number;
    menuViewCount: number;
    referrers: Set<string>;
    paths: Set<string>;
    lastTime: number;
  }> = {};
  analyticsEvents.forEach(e => {
    const ip = e.ip || "127.0.0.1";
    if (!ipMap[ip]) {
      ipMap[ip] = {
        ip,
        visitCount: 0,
        menuViewCount: 0,
        referrers: new Set<string>(),
        paths: new Set<string>(),
        lastTime: 0,
      };
    }
    const item = ipMap[ip];
    if (e.type === "visit") item.visitCount += 1;
    if (e.type === "menu_view") item.menuViewCount += 1;
    if (e.referrer) item.referrers.add(parseReferrer(e.referrer));
    if (e.path) item.paths.add(e.path);
    if (e._creationTime && e._creationTime > item.lastTime) {
      item.lastTime = e._creationTime;
    }
  });

  const rawIpsList = Object.values(ipMap);
  const filteredIpsList = rawIpsList.filter(item => {
    if (!ipSearchQuery) return true;
    return item.ip.toLowerCase().includes(ipSearchQuery.toLowerCase());
  }).sort((a, b) => b.lastTime - a.lastTime);

  const ipItemsPerPage = 10;
  const totalIpPages = Math.ceil(filteredIpsList.length / ipItemsPerPage) || 1;
  const paginatedIps = filteredIpsList.slice((ipListPage - 1) * ipItemsPerPage, ipListPage * ipItemsPerPage);

  return (
    <div id="admin-portal" className="h-screen w-full overflow-hidden text-[#0F172A] flex flex-col font-sans select-none antialiased bg-white">
      
      {/* TOAST SYSTEM */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[150] bg-[#0B0F17] text-white px-5 py-3.5 rounded-lg font-bold text-sm shadow-[0_12px_35px_rgba(11,15,23,0.4)] flex items-center gap-2.5 animate-bounce">
          <CheckCircle2 size={16} className="text-[#FF6B4A]" />
          {toastMessage}
        </div>
      )}

      {/* HEADER BAR PANEL (Clean Light Gray Header) */}
      {/* HEADER BAR PANEL (Clean Light Gray Header - 64px Height) */}
      <header className="bg-[#F4F6F8] border-b border-slate-200/50 sticky top-0 z-40 shrink-0 h-[64px] px-3 sm:px-6 lg:px-8 flex items-center justify-between overflow-hidden">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 text-slate-600 hover:text-[#FF6B4A] hover:bg-orange-50 rounded-md transition-colors cursor-pointer shrink-0"
            aria-label="메뉴 열기"
          >
            <Menu size={20} />
          </button>

          {/* Sidebar Collapse Toggle Button (Desktop) */}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="hidden lg:flex p-1.5 text-slate-500 hover:text-[#0F141C] hover:bg-slate-50 rounded-md transition-colors cursor-pointer border border-slate-200/80 bg-white"
            title={isSidebarCollapsed ? "사이드바 펼치기" : "사이드바 접기"}
          >
            {isSidebarCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
          </button>

          <button
            onClick={() => setCurrentMenu("dashboard")}
            className="flex items-center gap-1.5 sm:gap-2 group shrink-0 min-w-0 bg-transparent border-0 cursor-pointer p-0 text-left"
          >
            <img
              src="https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784533894/Group_1_4_jl4rlr.png"
              alt="120pie & coffee"
              className="h-5 sm:h-7 w-auto object-contain group-hover:scale-102 transition-transform shrink-0"
            />
            <span className="hidden sm:inline-block text-[11px] px-3.5 py-0.5 rounded-md bg-[#FED422] text-[#0F172A] font-black shadow-2xs shrink-0 whitespace-nowrap border-0">
              본사 어드민
            </span>
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <div className="hidden md:flex flex-col items-end text-right">
            <span className="font-black text-xs text-[#0F172A]">본사 가맹사업지원센터</span>
            <span className="text-[10px] text-slate-400 font-bold">마스터 최고 관리자 (HQ-ADMIN)</span>
          </div>
          
          <div className="h-6 w-px bg-slate-200 hidden md:block"></div>

          <Link
            href="/"
            className="hidden sm:inline-flex px-3.5 py-1.5 rounded-md border border-slate-200/80 bg-white hover:bg-slate-50 text-xs font-black text-slate-700 transition-all items-center gap-1.5 shrink-0 whitespace-nowrap"
          >
            <ArrowLeft size={13} className="text-[#FF6B4A] shrink-0" />
            <span>메인 사이트</span>
          </Link>
        </div>
      </header>

      {/* CORE WORKSPACE (Full Width Flex Container - Soft Light Gray Canvas #F4F6F8) */}
      <div className="flex-1 flex w-full relative items-stretch min-h-0 overflow-hidden bg-[#F4F6F8]">
        
        {/* SIDEBAR NAVIGATION (점주 포털과 동일한 1:1 정사각형 프로필 배경 적용) */}
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

          <div className="space-y-6 overflow-y-auto overflow-x-hidden no-scrollbar relative z-10 w-full">
            
            {/* Header Brand Logo (지정 로고 아이콘 적용 - 클릭 시 대시보드 이동) */}
            <button
              onClick={() => setCurrentMenu("dashboard")}
              className="flex items-center gap-3 px-5 pt-1 w-full text-left bg-transparent border-0 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 shadow-md border border-slate-700 bg-black group-hover:scale-105 transition-transform">
                <img
                  src="https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784730823/120%ED%8C%8C%EC%9D%B4_%EC%BB%A4%ED%94%BC_%EA%B8%88%EC%A0%95%EC%A0%90_%EC%B1%84%EB%84%90%EC%82%AC%EC%9D%B8_%EB%94%94%EC%9E%90%EC%9D%B8_250828_5_eadptv.png"
                  alt="120HQ Logo Icon"
                  className="w-full h-full object-cover"
                />
              </div>
              {!isSidebarCollapsed && (
                <div className="min-w-0">
                  <h3 className="font-black text-sm text-white tracking-tight truncate group-hover:text-[#FED422] transition-colors">120HQ Master</h3>
                  <p className="text-[10px] text-slate-400 font-bold truncate">본사 마스터 어드민</p>
                </div>
              )}
            </button>

            {/* J.Health 1:1 Authentic HQ Profile Section (점주 포털과 동일한 1:1 정사각형 풀 배경 적용) */}
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

                {/* 어드민 정보 텍스트 & 노란색 #HQ-MASTER 뱃지 */}
                <div className="relative z-10 flex flex-col items-center text-center gap-2 p-5 pb-6">
                  <div className="w-full truncate space-y-0.5 drop-shadow-md">
                    <h4 className="font-black text-xl text-white truncate tracking-tight">가맹지원본부</h4>
                    <p className="text-xs text-amber-300 font-bold truncate drop-shadow-xs">HQ-ADMIN</p>
                  </div>
                  <span className="mt-1 bg-[#FED422] text-[#0F172A] text-[11px] font-black px-4 py-1 rounded-md shadow-lg tracking-wider font-mono border-0">
                    #HQ-MASTER
                  </span>
                </div>
              </div>
            ) : (
              <div className="w-12 h-12 mx-auto rounded-none border-0 overflow-hidden shadow-md bg-slate-900">
                <img
                  src="https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784705760/ChatGPT_Image_2026%EB%85%84_7%EC%9B%94_22%EC%9D%BC_%EC%98%A4%ED%9B%84_04_35_22_2_mpdbps.png"
                  alt="어드민 프로필 썸네일"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Navigation Menu Links (좌우 px-5 패딩 부여) */}
            <nav className="flex flex-col gap-2 px-5">
              {[
                { key: "dashboard", label: "대시보드", icon: LayoutDashboard },
                { key: "store", label: "가맹점 관리", icon: Store },
                { key: "partner", label: "파트너/정산 관리", icon: Users },
                { key: "radar", label: "상권보호/영업타겟", icon: Crosshair },
                { key: "contract", label: "가맹계약 관리", icon: FileText },
                { key: "product", label: "제품 관리", icon: Package },
                { key: "order", label: "주문/배송 관리", icon: ShoppingBag, badge: incomingOrdersCount > 0 ? incomingOrdersCount : undefined },
                { key: "notice", label: "공지사항 관리", icon: Megaphone },
                { key: "inquiry", label: "1:1 AS 문의 관리", icon: MessageSquare, badge: pendingInquiriesCount > 0 ? pendingInquiriesCount : undefined },
                { key: "consultation", label: "창업 상담문의 관리", icon: Headphones },
                { key: "analytics", label: "통계관리", icon: BarChart3 },
                { key: "material", label: "교육/홍보물 관리", icon: BookOpen },
                { key: "banner", label: "팝업/배너/버튼 관리", icon: Monitor },
                { key: "gallery", label: "갤러리 관리", icon: ImageIcon },
                { key: "setting", label: "설정 메뉴", icon: Settings }
              ].map(({ key, label, icon: Icon, badge }) => {
                const isActive = currentMenu === key;
                return (
                  <div key={key} className="relative group">
                    <button
                      onClick={() => {
                        setCurrentMenu(key);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full ${isSidebarCollapsed ? "px-2.5 py-3.5 justify-center" : "px-4 py-3.5 justify-between"} rounded-lg flex items-center text-xs font-bold transition-all cursor-pointer border-0 outline-none focus:outline-none focus:ring-0 ${
                        isActive
                          ? "bg-[#FED422] text-[#0F172A] shadow-md font-black"
                          : "text-[#94A3B8] hover:text-white hover:bg-white/5 bg-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <Icon size={18} className={isActive ? "text-[#FF6B4A]" : "text-[#94A3B8] shrink-0"} />
                        {!isSidebarCollapsed && <span className="truncate">{label}</span>}
                      </div>
                      
                      {!isSidebarCollapsed && badge !== undefined && (
                        <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full shrink-0 ${
                          isActive ? "bg-[#FF6B4A] text-white" : "bg-[#232B3B] text-[#94A3B8]"
                        }`}>
                          {badge}
                        </span>
                      )}

                      {/* Collapsed Mode Notification Dot */}
                      {isSidebarCollapsed && badge !== undefined && (
                        <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-[#FF6B4A]"></span>
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

          <div className="border-t border-slate-800/80 pt-4 space-y-1 relative z-10">
            <button
              onClick={handleLogout}
              className={`w-full ${isSidebarCollapsed ? "px-2 py-2.5 justify-center" : "px-4 py-2.5 justify-start"} rounded-lg flex items-center gap-3 text-xs font-bold text-[#94A3B8] hover:text-white hover:bg-red-500/20 transition-colors text-left cursor-pointer`}
              title={isSidebarCollapsed ? "로그아웃" : undefined}
            >
              <LogOut size={17} className="shrink-0" />
              {!isSidebarCollapsed && <span>Log out</span>}
            </button>
          </div>
        </aside>

        {/* MOBILE SIDEBAR DRAWER (Accessible Modal Overlay) */}
        {mobileMenuOpen && (
          <div 
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs lg:hidden flex transition-opacity" 
            onClick={() => setMobileMenuOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label="본사 어드민 메뉴"
          >
            <div 
              className="w-72 bg-[#0F141C] text-white h-full p-6 flex flex-col justify-between shadow-2xl animate-in slide-in-from-left duration-200 border-r border-slate-800" 
              onClick={(e) => e.stopPropagation()} 
            >
              <div className="space-y-6 overflow-y-auto overflow-x-hidden no-scrollbar">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <button
                    onClick={() => {
                      setCurrentMenu("dashboard");
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 bg-transparent border-0 cursor-pointer p-0 text-left hover:opacity-80 transition-opacity"
                  >
                    <div className="w-7 h-7 rounded-full bg-[#FF6B4A] text-white flex items-center justify-center font-black text-xs">
                      ✱
                    </div>
                    <span className="font-black text-xs text-white">120HQ Master</span>
                  </button>
                  <button 
                    onClick={() => setMobileMenuOpen(false)} 
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors cursor-pointer border-0"
                    aria-label="닫기"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="bg-white border border-[#E2E8F0] rounded-md p-4 flex gap-3 items-center shadow-xs">
                  <div className="w-10 h-10 rounded-lg bg-[#0D233A] text-white flex items-center justify-center font-black text-xs shrink-0">
                    HQ
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-extrabold text-xs text-[#1E1B18] truncate">가맹지원본부</h4>
                    <p className="text-[10px] text-neutral-500 font-bold truncate mt-0.5">HQ-ADMIN 마스터</p>
                  </div>
                </div>

                <nav className="flex flex-col gap-1.5">
                  {[
                    { key: "dashboard", label: "대시보드", icon: LayoutDashboard },
                    { key: "store", label: "가맹점 관리", icon: Store },
                    { key: "partner", label: "파트너/정산 관리", icon: Users },
                    { key: "radar", label: "상권보호/영업타겟", icon: Crosshair },
                    { key: "contract", label: "가맹계약 관리", icon: FileText },
                    { key: "product", label: "제품 관리", icon: Package },
                    { key: "order", label: "주문/배송 관리", icon: ShoppingBag, badge: incomingOrdersCount > 0 ? incomingOrdersCount : undefined },
                    { key: "notice", label: "공지사항 관리", icon: Megaphone },
                    { key: "inquiry", label: "1:1 AS 문의 관리", icon: MessageSquare, badge: pendingInquiriesCount > 0 ? pendingInquiriesCount : undefined },
                    { key: "consultation", label: "창업 상담문의 관리", icon: Headphones },
                    { key: "analytics", label: "통계관리", icon: BarChart3 },
                    { key: "material", label: "교육/홍보물 관리", icon: BookOpen },
                    { key: "banner", label: "팝업/배너/버튼 관리", icon: Monitor },
                    { key: "gallery", label: "갤러리 관리", icon: ImageIcon },
                    { key: "setting", label: "설정 메뉴", icon: Settings }
                  ].map(({ key, label, icon: Icon, badge }) => {
                    const isActive = currentMenu === key;
                    return (
                      <button
                        key={key}
                        onClick={() => {
                          setCurrentMenu(key);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full px-4 py-3 rounded-md flex items-center justify-between text-xs font-extrabold transition-all border-0 outline-none focus:outline-none focus:ring-0 ${
                          isActive
                            ? "bg-[#FED422] text-[#0F172A] shadow-md font-black"
                            : "text-slate-300 hover:bg-white/10 bg-transparent"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon size={18} className={isActive ? "text-[#F5AC00]" : "text-[#3D2E0A]"} />
                          <span>{label}</span>
                        </div>
                        {badge !== undefined && (
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                            isActive ? "bg-[#F5AC00] text-[#0D233A]" : "bg-[#0D233A] text-white"
                          }`}>
                            {badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="border-t border-slate-800 pt-4 space-y-2">
                <Link
                  href="/"
                  className="w-full px-4 py-3 rounded-md flex items-center justify-between text-xs font-black bg-slate-800/90 text-white hover:bg-slate-700 transition-colors border-0"
                >
                  <div className="flex items-center gap-2.5">
                    <ArrowLeft size={15} className="text-[#FF6B4A]" />
                    <span>메인 사이트 바로가기</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold">OUTLINK →</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-3 rounded-md flex items-center gap-3 text-xs font-extrabold text-slate-400 hover:text-red-400 hover:bg-slate-800/60 transition-colors text-left border-0 cursor-pointer"
                >
                  <LogOut size={16} />
                  <span>로그아웃</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MAIN CONTENT AREA (100% Full Width Screen Layout) */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto w-full max-w-full">
          <div className="w-full max-w-full space-y-6">
          
          {/* ==========================================
              MENU: 1. DASHBOARD (Edu-Center SaaS Dashboard Inspired)
             ========================================== */}
          {currentMenu === "dashboard" && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* 1. 상단 파트너십/어드민 환영 배너 (점주 포털과 100% 동일한 배경 이미지) */}
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
                    HQ MASTER PORTAL
                  </span>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight leading-snug text-white drop-shadow-md">
                    120PIE 가맹지원본부 | 마스터 어드민 모니터링
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed drop-shadow-xs">
                    안녕하세요, 최고 관리자님! 전국 가맹점 현황 및 물류 자재 발주 시스템이 실시간으로 본사 어드민과 연동되고 있습니다.
                  </p>
                </div>

                {/* 우측 시네마틱 글래스모피즘 토글 박스 2개 (점주 메뉴와 100% 동일) */}
                <div className="flex items-center gap-3 shrink-0 relative z-10">
                  <div className="bg-black/60 backdrop-blur-md border border-white/15 px-5 py-3 rounded-lg text-center min-w-[120px] shadow-xl">
                    <span className="text-[10px] text-slate-400 font-extrabold block mb-0.5">HQ 권한 랭크</span>
                    <strong className="text-xs font-mono font-black text-[#F5A623] tracking-wider">#MASTER</strong>
                  </div>
                  <div className="bg-black/60 backdrop-blur-md border border-white/15 px-5 py-3 rounded-lg text-center min-w-[120px] shadow-xl">
                    <span className="text-[10px] text-slate-400 font-extrabold block mb-0.5">실시간 어드민 상태</span>
                    <strong className="text-xs font-black text-emerald-400">정상 작동 중</strong>
                  </div>
                </div>
              </div>

              {/* 4 SUMMARY STAT CARDS GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* Card 1: Total Stores */}
                <button 
                  onClick={() => setCurrentMenu("store")}
                  className="bg-white border border-[#EEF0F5] hover:border-[#F5AC00] transition-all rounded-lg p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] text-left group cursor-pointer relative overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-extrabold text-neutral-500 tracking-tight">전체 매장 현황</span>
                    <div className="w-12 h-12 rounded-lg bg-amber-50 text-[#F5AC00] group-hover:bg-[#F5AC00] group-hover:text-white flex items-center justify-center transition-all shadow-sm">
                      <Store size={22} />
                    </div>
                  </div>
                  <strong className="text-3xl font-black text-[#1E1B18] block mb-1">
                    {stores.length.toLocaleString()} <span className="text-sm font-bold text-neutral-400">개 매장</span>
                  </strong>
                  <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-emerald-600">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-100">+12.5%</span>
                    <span className="text-neutral-400 font-semibold">전월 대비</span>
                  </div>
                </button>

                {/* Card 2: Today Orders */}
                <button 
                  onClick={() => setCurrentMenu("order")}
                  className="bg-white border border-[#EEF0F5] hover:border-[#F5AC00] transition-all rounded-lg p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] text-left group cursor-pointer relative overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-extrabold text-neutral-500 tracking-tight">오늘 발주 건수</span>
                    <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-all shadow-sm">
                      <ShoppingBag size={22} />
                    </div>
                  </div>
                  <strong className="text-3xl font-black text-[#1E1B18] block mb-1">
                    {orders.filter(o => o.date === new Date().toISOString().split("T")[0]).length.toLocaleString()} <span className="text-sm font-bold text-neutral-400">건</span>
                  </strong>
                  <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-emerald-600">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-100">+8.3%</span>
                    <span className="text-neutral-400 font-semibold">전월 대비</span>
                  </div>
                </button>

                {/* Card 3: Pending Inquiries */}
                <button 
                  onClick={() => setCurrentMenu("inquiry")}
                  className="bg-white border border-[#EEF0F5] hover:border-[#F5AC00] transition-all rounded-lg p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] text-left group cursor-pointer relative overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-extrabold text-neutral-500 tracking-tight">미처리 AS / 문의</span>
                    <div className="w-12 h-12 rounded-lg bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white flex items-center justify-center transition-all shadow-sm">
                      <MessageSquare size={22} />
                    </div>
                  </div>
                  <strong className="text-3xl font-black text-[#1E1B18] block mb-1">
                    {pendingInquiriesCount} <span className="text-sm font-bold text-neutral-400">건</span>
                  </strong>
                  <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-rose-500">
                    <span className="px-2 py-0.5 rounded-md bg-rose-50 border border-rose-100">-3%</span>
                    <span className="text-neutral-400 font-semibold">전월 대비</span>
                  </div>
                </button>

                {/* Card 4: Consultations */}
                <button 
                  onClick={() => setCurrentMenu("consultation")}
                  className="bg-white border border-[#EEF0F5] hover:border-[#F5AC00] transition-all rounded-lg p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] text-left group cursor-pointer relative overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-extrabold text-neutral-500 tracking-tight">가맹 창업 상담 문의</span>
                    <div className="w-12 h-12 rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center transition-all shadow-sm">
                      <Headphones size={22} />
                    </div>
                  </div>
                  <strong className="text-3xl font-black text-[#1E1B18] block mb-1">
                    {consultations.length.toLocaleString()} <span className="text-sm font-bold text-neutral-400">건</span>
                  </strong>
                  <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-emerald-600">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-100">+15.2%</span>
                    <span className="text-neutral-400 font-semibold">전월 대비</span>
                  </div>
                </button>
              </div>

              {/* 2. 전국 가동 중인 120 패키지 브랜드 모듈 (점주 포털과 100% 동일한 6개 3D 지정 아이콘 동기화) */}
              <div className="bg-white rounded-lg p-6 sm:p-7 shadow-[0_4px_25px_rgba(0,0,0,0.03)] border-0 space-y-5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div>
                    <h2 className="text-lg font-black text-[#0F172A] tracking-tight">전국 가동 중인 120 패키지 운영 모듈</h2>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">전국 가맹점에서 라이선스를 취득해 작동 중인 브랜드 패키지 총 현황입니다.</p>
                  </div>
                  <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-md border border-emerald-100 shrink-0">
                    전국 모듈 가동중 (HQ MASTER)
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
                  {/* Helper for module active count calculation */}
                  {(() => {
                    const activeStores = stores.filter(s => s.status === "승인");
                    const getCount = (key: string) => {
                      if (key === "120pie") {
                        return activeStores.filter(s => !s.adoptionMenu || s.adoptionMenu.length === 0 || s.adoptionMenu.includes("120pie")).length;
                      }
                      return activeStores.filter(s => s.adoptionMenu?.includes(key)).length;
                    };

                    const pieCount = getCount("120pie");
                    const eggCount = getCount("egg120");
                    const churrosCount = getCount("츄러스120");
                    const ddeokCount = getCount("떡볶이120");
                    const hotdogCount = getCount("핫도그120");
                    const coffeeCount = getCount("120coffee");

                    return (
                      <>
                        {/* Module 1: 120pie */}
                        <div className="bg-[#F8FAFC] hover:bg-emerald-50/50 rounded-lg p-3.5 text-center border border-slate-100 hover:border-emerald-200 space-y-2.5 flex flex-col items-center justify-between transition-all group cursor-pointer">
                          <div className="w-10 h-10 rounded-md overflow-hidden flex items-center justify-center group-hover:scale-110 transition-transform">
                            <img
                              src="https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1785158864/Group_4_1_zptjbn.png"
                              alt="120pie"
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="space-y-1 w-full">
                            <strong className="text-xs font-black text-[#0F172A] block">120pie</strong>
                            <span className="text-[10px] font-black text-emerald-700 bg-emerald-100/90 px-2 py-0.5 rounded-md block w-full truncate shadow-2xs">
                              {pieCount}개 매장 가동중
                            </span>
                          </div>
                        </div>

                        {/* Module 2: egg120 */}
                        <div className="bg-[#F8FAFC] hover:bg-amber-50/50 rounded-lg p-3.5 text-center border border-slate-100 hover:border-amber-200 space-y-2.5 flex flex-col items-center justify-between transition-all group cursor-pointer">
                          <div className="w-10 h-10 rounded-md overflow-hidden flex items-center justify-center group-hover:scale-110 transition-transform">
                            <img
                              src="https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1785158865/Group_5_1_cdwr4y.png"
                              alt="egg120"
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="space-y-1 w-full">
                            <strong className="text-xs font-black text-slate-700 block">egg120</strong>
                            {eggCount > 0 ? (
                              <span className="text-[10px] font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md block w-full truncate shadow-2xs">
                                {eggCount}개 매장 가동중
                              </span>
                            ) : (
                              <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded block w-full truncate">
                                0개 매장 (대기)
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Module 3: 츄러스120 */}
                        <div className="bg-[#F8FAFC] hover:bg-orange-50/50 rounded-lg p-3.5 text-center border border-slate-100 hover:border-orange-200 space-y-2.5 flex flex-col items-center justify-between transition-all group cursor-pointer">
                          <div className="w-10 h-10 rounded-md overflow-hidden flex items-center justify-center group-hover:scale-110 transition-transform">
                            <img
                              src="https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1785158864/Group_7_iowfzq.png"
                              alt="츄러스120"
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="space-y-1 w-full">
                            <strong className="text-xs font-black text-slate-700 block">츄러스120</strong>
                            {churrosCount > 0 ? (
                              <span className="text-[10px] font-black text-orange-700 bg-orange-100 px-2 py-0.5 rounded-md block w-full truncate shadow-2xs">
                                {churrosCount}개 매장 가동중
                              </span>
                            ) : (
                              <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded block w-full truncate">
                                0개 매장 (대기)
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Module 4: 떡볶이120 */}
                        <div className="bg-[#F8FAFC] hover:bg-rose-50/50 rounded-lg p-3.5 text-center border border-slate-100 hover:border-rose-200 space-y-2.5 flex flex-col items-center justify-between transition-all group cursor-pointer">
                          <div className="w-10 h-10 rounded-md overflow-hidden flex items-center justify-center group-hover:scale-110 transition-transform">
                            <img
                              src="https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1785158864/Group_6_io2ejc.png"
                              alt="떡볶이120"
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="space-y-1 w-full">
                            <strong className="text-xs font-black text-slate-700 block">떡볶이120</strong>
                            {ddeokCount > 0 ? (
                              <span className="text-[10px] font-black text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md block w-full truncate shadow-2xs">
                                {ddeokCount}개 매장 가동중
                              </span>
                            ) : (
                              <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded block w-full truncate">
                                0개 매장 (대기)
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Module 5: 핫도그120 */}
                        <div className="bg-[#F8FAFC] hover:bg-yellow-50/50 rounded-lg p-3.5 text-center border border-slate-100 hover:border-yellow-200 space-y-2.5 flex flex-col items-center justify-between transition-all group cursor-pointer">
                          <div className="w-10 h-10 rounded-md overflow-hidden flex items-center justify-center group-hover:scale-110 transition-transform">
                            <img
                              src="https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1785158864/Group_8_d8kfzr.png"
                              alt="핫도그120"
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="space-y-1 w-full">
                            <strong className="text-xs font-black text-slate-700 block">핫도그120</strong>
                            {hotdogCount > 0 ? (
                              <span className="text-[10px] font-black text-yellow-800 bg-yellow-100 px-2 py-0.5 rounded-md block w-full truncate shadow-2xs">
                                {hotdogCount}개 매장 가동중
                              </span>
                            ) : (
                              <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded block w-full truncate">
                                0개 매장 (대기)
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Module 6: 120coffee */}
                        <div className="bg-[#F8FAFC] hover:bg-amber-100/40 rounded-lg p-3.5 text-center border border-slate-100 hover:border-amber-300 space-y-2.5 flex flex-col items-center justify-between transition-all group cursor-pointer">
                          <div className="w-10 h-10 rounded-md overflow-hidden flex items-center justify-center group-hover:scale-110 transition-transform">
                            <img
                              src="https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1785158864/Group_9_iskk3b.png"
                              alt="120coffee"
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="space-y-1 w-full">
                            <strong className="text-xs font-black text-slate-700 block">120coffee</strong>
                            {coffeeCount > 0 ? (
                              <span className="text-[10px] font-black text-amber-800 bg-amber-200/70 px-2 py-0.5 rounded-md block w-full truncate shadow-2xs">
                                {coffeeCount}개 매장 가동중
                              </span>
                            ) : (
                              <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded block w-full truncate">
                                0개 매장 (대기)
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Module 7: 추가 패키지 */}
                        <div className="bg-[#F8FAFC] hover:bg-indigo-50/50 rounded-lg p-3.5 text-center border border-slate-100 hover:border-indigo-200 space-y-2.5 flex flex-col items-center justify-between transition-all group cursor-pointer">
                          <div className="w-9 h-9 rounded-md bg-indigo-50 text-indigo-500 flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                            <PlusCircle size={18} />
                          </div>
                          <div className="space-y-1 w-full">
                            <strong className="text-xs font-black text-slate-500 block">추가 모듈</strong>
                            <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded block w-full truncate">
                              준비중
                            </span>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* MIDDLE SECTION: PERFORMANCE CHART & UPCOMING EVENTS */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left (2 Cols): Smooth Performance Chart */}
                <div className="lg:col-span-2 bg-white border border-[#EEF0F5] rounded-lg p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <h3 className="text-lg font-black text-[#1E1B18]">가맹본부 성과 모니터링</h3>
                      <p className="text-xs text-neutral-400 font-semibold mt-0.5">실시간 전국 매출액 및 자재 주문 트렌드 모니터링</p>
                    </div>

                    {/* Chart Legend Controls */}
                    <div className="flex items-center gap-4 text-xs font-extrabold select-none">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-[#F5AC00]"></span>
                        <span className="text-neutral-600">가맹점 주문량</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                        <span className="text-neutral-600">매출 성장률</span>
                      </div>
                    </div>
                  </div>

                  {/* SVG Smooth Curve Line Chart */}
                  <div className="relative w-full h-56 my-2">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 500 180" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="chartGrad1" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#F5AC00" stopOpacity="0.35" />
                          <stop offset="100%" stopColor="#F5AC00" stopOpacity="0.0" />
                        </linearGradient>
                        <linearGradient id="chartGrad2" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#34D399" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#34D399" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Grid Lines */}
                      <line x1="0" y1="30" x2="500" y2="30" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4 4" />
                      <line x1="0" y1="80" x2="500" y2="80" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4 4" />
                      <line x1="0" y1="130" x2="500" y2="130" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4 4" />

                      {/* Area Fill 1 */}
                      <path
                        d="M0,130 Q70,40 140,110 T280,50 T420,90 T500,30 L500,180 L0,180 Z"
                        fill="url(#chartGrad1)"
                      />
                      {/* Line 1 */}
                      <path
                        d="M0,130 Q70,40 140,110 T280,50 T420,90 T500,30"
                        fill="none"
                        stroke="#F5AC00"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />

                      {/* Area Fill 2 */}
                      <path
                        d="M0,150 Q70,90 140,130 T280,100 T420,130 T500,80 L500,180 L0,180 Z"
                        fill="url(#chartGrad2)"
                      />
                      {/* Line 2 */}
                      <path
                        d="M0,150 Q70,90 140,130 T280,100 T420,130 T500,80"
                        fill="none"
                        stroke="#34D399"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />

                      {/* Interactive Data Point Highlight */}
                      <circle cx="280" cy="50" r="6" fill="#F5AC00" stroke="#ffffff" strokeWidth="3" className="shadow-md" />
                      <circle cx="280" cy="100" r="5" fill="#34D399" stroke="#ffffff" strokeWidth="2" />
                    </svg>

                    {/* Chart Tooltip Overlay */}
                    <div className="absolute top-[22%] left-[52%] -translate-x-1/2 bg-[#1E1B18] text-white px-3 py-1.5 rounded-md text-[10px] font-bold shadow-lg flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#F5AC00]"></span>
                      <span>7월 3주차: <strong>370건</strong></span>
                    </div>
                  </div>

                  {/* X Axis Labels */}
                  <div className="flex justify-between text-[11px] font-extrabold text-neutral-400 pt-2 border-t border-[#F1F5F9]">
                    <span>1주차</span>
                    <span>2주차</span>
                    <span>3주차</span>
                    <span>4주차</span>
                    <span>5주차</span>
                    <span>6주차</span>
                  </div>
                </div>

                {/* Right (1 Col): 최신 공지사항(3개) & 최신 교육/홍보물(3개) */}
                <div className="space-y-6 flex flex-col justify-between">
                  {/* 1. 최신 공지사항 (3개) */}
                  <div className="bg-white border border-[#EEF0F5] rounded-lg p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#F5AC00]"></div>
                          <h4 className="text-base font-black text-[#1E1B18]">최신 공지사항</h4>
                          <span className="text-[10px] font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">최신 3건</span>
                        </div>
                        <button 
                          onClick={() => setCurrentMenu("notice")}
                          className="text-[11px] text-[#F5AC00] font-extrabold cursor-pointer hover:underline border-0 bg-transparent"
                        >
                          전체보기 →
                        </button>
                      </div>

                      <div className="space-y-2.5">
                        {(() => {
                          const list = (notices && notices.length > 0) 
                            ? notices.slice(0, 3) 
                            : [
                                { id: "n1", title: "3분기 가맹점 정기 신메뉴 레시피 교육 안내", date: "2026.07.27", isImportant: true },
                                { id: "n2", title: "여름 시즌 프로모션 홍보물 가맹점 배송 일정", date: "2026.07.20", isImportant: false },
                                { id: "n3", title: "물류 시스템 정기 점검 및 서버 점검 안내", date: "2026.07.15", isImportant: false },
                              ];
                          
                          return list.map((notice: any, idx: number) => (
                            <div 
                              key={notice.id || idx} 
                              onClick={() => setCurrentMenu("notice")}
                              className="flex items-center justify-between p-3 rounded-lg bg-[#F8F9FD] hover:bg-amber-50/60 border border-[#EEF0F5] transition-all cursor-pointer group"
                            >
                              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                                <span className={`text-[10px] font-black px-2 py-0.5 rounded-md shrink-0 ${notice.isImportant ? 'bg-rose-100 text-rose-600' : 'bg-slate-200 text-slate-600'}`}>
                                  {notice.isImportant ? '중요' : '공지'}
                                </span>
                                <h5 className="text-xs font-bold text-[#1E1B18] group-hover:text-[#F5AC00] truncate transition-colors">
                                  {notice.title}
                                </h5>
                              </div>
                              <span className="text-[10px] font-medium text-neutral-400 shrink-0 font-mono">
                                {notice.date || notice.regDate || "2026.07.27"}
                              </span>
                            </div>
                          ));
                        })()}
                      </div>
                    </div>
                  </div>

                  {/* 2. 최신 교육 & 홍보물 (3개) */}
                  <div className="bg-white border border-[#EEF0F5] rounded-lg p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                          <h4 className="text-base font-black text-[#1E1B18]">최신 교육 & 홍보물</h4>
                          <span className="text-[10px] font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">최신 3건</span>
                        </div>
                        <button 
                          onClick={() => setCurrentMenu("material")}
                          className="text-[11px] text-[#F5AC00] font-extrabold cursor-pointer hover:underline border-0 bg-transparent"
                        >
                          전체보기 →
                        </button>
                      </div>

                      <div className="space-y-2.5">
                        {(() => {
                          const combined = [...(trainings || []), ...(prs || [])];
                          const list = (combined && combined.length > 0)
                            ? combined.slice(0, 3)
                            : [
                                { id: "m1", title: "120PIE 시그니처 파이 매뉴얼 가이드 V2", category: "교육자료", date: "2026.07.25" },
                                { id: "m2", title: "2026 여름 시즌 매장 연출 X배너 포스터 POP", category: "홍보물", date: "2026.07.18" },
                                { id: "m3", title: "가맹점 위생 점검 및 기기 유지보수 매뉴얼", category: "교육자료", date: "2026.07.10" },
                              ];

                          return list.map((mat: any, idx: number) => (
                            <div 
                              key={mat.id || idx} 
                              onClick={() => setCurrentMenu("material")}
                              className="flex items-center justify-between p-3 rounded-lg bg-[#F8F9FD] hover:bg-blue-50/60 border border-[#EEF0F5] transition-all cursor-pointer group"
                            >
                              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                                <span className={`text-[10px] font-black px-2 py-0.5 rounded-md shrink-0 ${mat.category === '홍보물' ? 'bg-indigo-100 text-indigo-600' : 'bg-blue-100 text-blue-600'}`}>
                                  {mat.category || (idx % 2 === 0 ? "교육자료" : "홍보물")}
                                </span>
                                <h5 className="text-xs font-bold text-[#1E1B18] group-hover:text-blue-600 truncate transition-colors">
                                  {mat.title}
                                </h5>
                              </div>
                              <span className="text-[10px] font-medium text-neutral-400 shrink-0 font-mono">
                                {mat.date || mat.regDate || "2026.07.25"}
                              </span>
                            </div>
                          ));
                        })()}
                      </div>
                    </div>
                  </div>
                </div>

              </div>



              {/* Store Management Table Summary */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-black text-[#1E1B18]">전국 가맹점 마스터 대장</h3>
                    <p className="text-xs text-neutral-400 font-semibold mt-0.5">정식 계약 체결 후 운영 중인 브랜드 매장 리스트와 월 누적 매출 요약입니다.</p>
                  </div>
                  <button 
                    onClick={() => setCurrentMenu("store")}
                    className="text-xs font-extrabold text-[#F5AC00] hover:underline"
                  >
                    전체 가맹점 관리 →
                  </button>
                </div>

                <div className="bg-white border border-[#EEF0F5] rounded-lg overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#F8F9FD] border-b border-[#EEF0F5] text-[11px] font-extrabold text-neutral-400 uppercase tracking-wider">
                          <th className="p-4 sm:p-5">점포 코드</th>
                          <th className="p-4 sm:p-5">가맹점명</th>
                          <th className="p-4 sm:p-5">점주명</th>
                          <th className="p-4 sm:p-5">도입 메뉴 수</th>
                          <th className="p-4 sm:p-5">월 매출 요약</th>
                          <th className="p-4 sm:p-5">상태</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#EEF0F5] text-xs font-bold text-[#1E1B18]">
                        {stores.map((store) => (
                          <tr key={store.id} className="hover:bg-[#F8F9FD] transition-colors">
                            <td className="p-4 sm:p-5 font-black text-[#F5AC00]">{store.id}</td>
                            <td className="p-4 sm:p-5 font-black text-[#1E1B18]">{store.name}</td>
                            <td className="p-4 sm:p-5 text-neutral-600">
                              <span>{store.owner}</span>
                              <span className="text-[10px] block text-neutral-400 font-semibold mt-0.5">{store.phone}</span>
                            </td>
                            <td className="p-4 sm:p-5">
                              <span className="bg-amber-50 text-[#3D2E0A] font-extrabold px-3 py-1 rounded-md text-[10px] border border-amber-200">
                                {store.adoptionMenu ? store.adoptionMenu.length : 0}개 모듈 가동중
                              </span>
                            </td>
                            <td className="p-4 sm:p-5 font-black text-[#1E1B18]">
                              {store.monthlySales > 0 ? `${store.monthlySales.toLocaleString()} 원` : "정산 대기"}
                            </td>
                            <td className="p-4 sm:p-5">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                                store.status === "승인" 
                                  ? "bg-emerald-50 text-emerald-600 border border-emerald-200" 
                                  : store.status === "대기"
                                  ? "bg-orange-50 text-orange-500 border border-orange-200"
                                  : "bg-neutral-100 text-neutral-500 border border-neutral-200"
                              }`}>
                                {store.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

            </div>
          )}

          {currentMenu === "contract" && (
            <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 h-[calc(100vh-120px)] max-h-[calc(100vh-120px)] overflow-hidden animate-fadeIn w-full min-w-0">
              {/* LEFT SIDEBAR: CONTRACTOR LIST (Hidden in Edit/Create Mode to maximize workspace) */}
              {!isContractFormOpen && (
                <div className="w-full lg:w-80 h-full bg-white border border-[#f2ccd7] rounded-xl p-4 flex flex-col shadow-sm shrink-0 overflow-hidden animate-fadeIn">
                  <div className="mb-3 shrink-0">
                    <h3 className="text-lg font-extrabold text-[#2d2026] mb-1">가맹계약 관리</h3>
                    <p className="text-xs text-[#735965] font-bold">계약자 목록을 조회하고 새 계약 정보를 등록할 수 있습니다.</p>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => {
                      setContractForm(getInitialContractForm());
                      setContractRoadAddress("");
                      setContractDetailAddress("");
                      setIsContractEditMode(false);
                      setIsContractFormOpen(true);
                      setSelectedContract(null);
                    }}
                    className="w-full py-2.5 mb-3 rounded-lg bg-[#bf3e67] hover:bg-[#a03153] text-white font-extrabold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer shrink-0"
                  >
                    <Plus size={16} />
                    <span>계약정보 신규 등록</span>
                  </button>
                  
                  {/* Search Contractor */}
                  <div className="relative mb-3 shrink-0">
                    <input
                      type="text"
                      placeholder="계약자명 검색..."
                      value={contractSearchQuery.trim() === "" ? "" : contractSearchQuery}
                      onChange={(e) => {
                        setContractSearchQuery(e.target.value);
                      }}
                      className="w-full pl-9 pr-4 py-2 border-0 rounded-lg text-xs focus:outline-none bg-[#F8F9FA] text-[#0F172A] font-bold shadow-2xs placeholder-slate-400"
                    />
                    <Search size={14} className="absolute left-3 top-3 text-slate-400" />
                  </div>
                  
                  {/* Contractor List Scroll */}
                  <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-0">
                    {filteredContracts.length === 0 ? (
                      <div className="text-center py-8 text-xs text-slate-400 font-bold">
                        등록된 계약자가 없습니다.
                      </div>
                    ) : (
                      filteredContracts.map((c) => {
                        let statusBg = "bg-blue-50 text-blue-600 border-0";
                        if (c.status === "계약서 발송완료") statusBg = "bg-amber-50 text-amber-600 border-0";
                        else if (c.status === "계약서 서명완료") statusBg = "bg-emerald-50 text-emerald-600 border-0";
                        else if (c.status === "계약서 진행취소") statusBg = "bg-neutral-100 text-neutral-500 border-0";
                        
                        const isSelected = selectedContract?._id === c._id;
                        return (
                          <button
                            key={c._id}
                            type="button"
                            onClick={() => {
                              setSelectedContract(c);
                              setIsContractFormOpen(false);
                            }}
                            className={`w-full text-left p-3.5 rounded-md border-0 transition-all flex flex-col gap-1.5 ${
                              isSelected
                                ? "bg-slate-200/90 text-[#0F172A] shadow-xs font-black"
                                : "bg-[#F8F9FA] text-slate-700 hover:bg-slate-100"
                            }`}
                          >
                            <div className="flex items-center justify-between w-full">
                              <span className="font-extrabold text-sm text-[#0F172A]">{c.ownerName}</span>
                              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${statusBg}`}>
                                {c.status}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold">
                              <span>{c.storeName || "가맹점명 미정"}</span>
                              <span>{c.createdAt.split(" ")[0]}</span>
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
              
              {/* RIGHT CONTENT: DETAIL VIEW OR FORM */}
              <div className="flex-1 h-full bg-white border-0 rounded-xl p-4 sm:p-6 flex flex-col shadow-xs min-w-0 w-full overflow-hidden">
                {isContractFormOpen ? (
                  /* LIVE CONTRACT DOCUMENT EDITOR (DIRECT COMPARISON & RIGHT INPUT PANEL) */
                  <form onSubmit={handleContractSubmit} className="space-y-4 animate-fadeIn h-full flex flex-col overflow-hidden">
                    {/* Top Static Action Header - No sticky bar covering document */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 bg-white shrink-0">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base font-black text-[#0F172A]">
                            {isContractEditMode ? "120겹파이 가맹계약서 수정" : "120겹파이 가맹계약서 신규 작성"}
                          </h3>
                          <span className="text-[11px] font-black text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                            실시간 계약서 원문 대조 & 우측 입력 패널
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-bold mt-0.5">
                          우측 입력란에 입력하시면, 좌측 공식 계약서 원문에 실시간으로 반영됩니다.
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setIsContractFormOpen(false);
                            if (contracts.length > 0 && !selectedContract) {
                              setSelectedContract(contracts[0]);
                            }
                          }}
                          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black rounded-lg transition-all cursor-pointer border-0 shadow-2xs"
                        >
                          취소 / 목록으로
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 bg-[#FED422] hover:bg-[#e5be1f] text-[#0F172A] text-xs font-black rounded-lg transition-all cursor-pointer border-0 shadow-xs flex items-center gap-1.5"
                        >
                          <Save size={14} />
                          <span>{isContractEditMode ? "수정 완료" : "가맹계약서 저장하기"}</span>
                        </button>
                      </div>
                    </div>

                    {/* Resizable 2-Column Split Layout: Left = Live Document (Default: wider 62%), Right = Connected Inputs (Default: 38%) */}
                    <div 
                      ref={splitContainerRef}
                      className={`flex flex-col lg:flex-row items-stretch flex-1 min-h-0 overflow-hidden w-full relative ${
                        isDraggingSplitter ? "select-none cursor-col-resize" : ""
                      }`}
                    >
                      {/* Left: Contract Document Viewer (Wider by default, resizable) */}
                      <div 
                        style={{ width: `${contractSplitRatio}%` }}
                        className="flex flex-col h-full bg-slate-100/70 p-2 sm:p-3 rounded-xl sm:rounded-2xl border border-slate-200/80 shadow-inner overflow-hidden min-w-[320px] shrink-0"
                      >
                        {/* Static Header Bar - OUTSIDE scroll area */}
                        <div className="flex items-center justify-between mb-2 px-2 py-1 shrink-0 bg-slate-200/70 rounded-lg sm:rounded-xl border border-slate-300/60">
                          <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                            <FileText size={14} className="text-amber-600 shrink-0" />
                            <span className="truncate">120겹파이 공식 가맹계약서 실시간 원문</span>
                          </span>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="text-[10px] sm:text-[11px] font-bold text-amber-900 bg-amber-100/90 px-1.5 py-0.5 rounded border border-amber-300 shadow-2xs">
                              미리보기 {Math.round(contractSplitRatio)}%
                            </span>
                          </div>
                        </div>

                        {/* Pure Scroll Container for Document */}
                        <div 
                          id="contract-document-scroll-container" 
                          className="flex-1 overflow-y-auto overflow-x-hidden pr-0.5 sm:pr-1 scroll-smooth rounded-lg sm:rounded-xl"
                        >
                          <FranchiseContractDocument
                            contract={contractForm as any}
                            highlightInputs={true}
                          />
                        </div>
                      </div>

                      {/* Resizable Splitter Divider (Drag left/right to resize) */}
                      <div
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setIsDraggingSplitter(true);
                        }}
                        onDoubleClick={() => setContractSplitRatio(60)}
                        title="좌우로 드래그하여 영역 크기를 조절하세요 (더블클릭 시 기본 60:40 복원)"
                        className="hidden lg:flex flex-col items-center justify-center w-3.5 hover:w-3.5 group cursor-col-resize z-20 shrink-0 select-none py-4 mx-0.5"
                      >
                        <div 
                          className={`w-1.5 h-full rounded-full transition-all flex items-center justify-center ${
                            isDraggingSplitter 
                              ? "bg-amber-500 ring-4 ring-amber-300/60 shadow-md" 
                              : "bg-slate-300/80 group-hover:bg-amber-500 group-hover:ring-2 group-hover:ring-amber-200"
                          }`}
                        >
                          <div className="w-1 h-7 bg-slate-400 group-hover:bg-white rounded-full flex flex-col justify-around items-center py-1">
                            <span className="w-0.5 h-0.5 bg-slate-600 group-hover:bg-amber-950 rounded-full"></span>
                            <span className="w-0.5 h-0.5 bg-slate-600 group-hover:bg-amber-950 rounded-full"></span>
                            <span className="w-0.5 h-0.5 bg-slate-600 group-hover:bg-amber-950 rounded-full"></span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Input Panel (Takes 100% of remaining width flexibly with its own scrollbar) */}
                      <div 
                        className="flex-1 min-w-[260px] shrink space-y-3.5 h-full overflow-y-auto overflow-x-hidden pl-1.5 sm:pl-2.5 pr-2 sm:pr-3.5 pb-36"
                      >
                        {/* Help & Fast Action Banner */}
                        <div className="p-3.5 bg-gradient-to-r from-amber-400 to-amber-300 rounded-xl text-slate-900 shadow-2xs flex items-center justify-between">
                          <div>
                            <h4 className="font-black text-xs">계약 정보 실시간 입력 패널</h4>
                            <p className="text-[10px] font-bold text-amber-950 mt-0.5">입력하신 정보는 좌측 공식 계약서에 실시간으로 즉시 반영됩니다.</p>
                          </div>
                          <button
                            type="button"
                            onClick={handleApplyAllDefaults}
                            className="px-2.5 py-1.5 bg-slate-900 hover:bg-black text-amber-400 text-[11px] font-black rounded-lg transition-all border-0 cursor-pointer shrink-0 shadow-2xs"
                          >
                            기본금액 초기화
                          </button>
                        </div>

                        {/* 1. 계약 구분 */}
                        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
                          <span className="text-xs font-black text-slate-900 block">
                            1. 계약 구분
                          </span>
                          <div className="grid grid-cols-3 gap-2">
                            {["신규", "갱신", "양수"].map((type) => (
                              <label
                                key={type}
                                className={`flex items-center justify-center gap-1.5 p-2 rounded-lg border text-xs font-extrabold cursor-pointer transition-all ${
                                  contractForm.contractType === type
                                    ? "bg-amber-50 border-amber-400 text-amber-950 font-black"
                                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="sideContractType"
                                  value={type}
                                  checked={contractForm.contractType === type}
                                  onChange={(e) => setContractForm(prev => ({ ...prev, contractType: e.target.value }))}
                                  className="hidden"
                                />
                                <span>{type} 계약</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* 2. 가맹점 정보 (성명 / 매장명 / 생년월일 / 핸드폰) */}
                        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2.5">
                          <span className="text-xs font-black text-slate-900 block">
                            2. 가맹점 정보 (점주 및 매장)
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <div>
                              <label className="text-[11px] font-bold text-slate-600 block mb-1">성명 (점주명)</label>
                              <input
                                type="text"
                                value={contractForm.ownerName}
                                onChange={(e) => setContractForm(prev => ({ ...prev, ownerName: e.target.value }))}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800 outline-none focus:border-amber-500 focus:bg-white"
                                placeholder="홍길동"
                              />
                            </div>
                            <div>
                              <label className="text-[11px] font-bold text-slate-600 block mb-1">가맹점 상호 (매장명)</label>
                              <input
                                type="text"
                                value={contractForm.storeName}
                                onChange={(e) => setContractForm(prev => ({ ...prev, storeName: e.target.value }))}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800 outline-none focus:border-amber-500 focus:bg-white"
                                placeholder="강남본점"
                              />
                            </div>
                            <div>
                              <label className="text-[11px] font-bold text-slate-600 block mb-1">생년월일 (6자리 또는 8자리)</label>
                              <input
                                type="text"
                                value={contractForm.ownerBirth}
                                onChange={(e) => setContractForm(prev => ({ ...prev, ownerBirth: formatAutoBirth(e.target.value) }))}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800 outline-none focus:border-amber-500 focus:bg-white"
                                placeholder="1990-01-01"
                                maxLength={10}
                              />
                            </div>
                            <div>
                              <label className="text-[11px] font-bold text-slate-600 block mb-1">휴대폰 번호</label>
                              <input
                                type="text"
                                value={contractForm.ownerPhone}
                                onChange={(e) => setContractForm(prev => ({ ...prev, ownerPhone: formatAutoPhone(e.target.value) }))}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800 outline-none focus:border-amber-500 focus:bg-white"
                                placeholder="010-1234-5678"
                                maxLength={13}
                              />
                            </div>
                          </div>
                        </div>

                        {/* 3. 계약 기간 (자동 계산) */}
                        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-slate-900">
                              3. 계약 기간 (기본 2년 자동세팅)
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const today = new Date();
                                const startStr = today.toISOString().split("T")[0];
                                const endYear = today.getFullYear() + 2;
                                const endStr = `${endYear}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
                                setContractForm(prev => ({ ...prev, contractStart: startStr, contractEnd: endStr }));
                              }}
                              className="text-[10px] text-amber-700 bg-amber-50 hover:bg-amber-100 font-bold px-2 py-0.5 rounded border border-amber-200"
                            >
                              오늘부터 2년
                            </button>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <div>
                              <label className="text-[11px] font-bold text-slate-600 block mb-1">계약 개시일</label>
                              <input
                                type="date"
                                value={contractForm.contractStart}
                                onChange={(e) => {
                                  const start = e.target.value;
                                  let end = contractForm.contractEnd;
                                  if (start) {
                                    const d = new Date(start);
                                    if (!isNaN(d.getTime())) {
                                      d.setFullYear(d.getFullYear() + 2);
                                      d.setDate(d.getDate() - 1);
                                      end = d.toISOString().split("T")[0];
                                    }
                                  }
                                  setContractForm(prev => ({ ...prev, contractStart: start, contractEnd: end }));
                                }}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800 outline-none focus:border-amber-500 focus:bg-white"
                              />
                            </div>
                            <div>
                              <label className="text-[11px] font-bold text-slate-600 block mb-1">계약 만료일 (종료일)</label>
                              <input
                                type="date"
                                value={contractForm.contractEnd}
                                onChange={(e) => setContractForm(prev => ({ ...prev, contractEnd: e.target.value }))}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800 outline-none focus:border-amber-500 focus:bg-white"
                              />
                            </div>
                          </div>
                        </div>

                        {/* 4. 사업장 주소 / 규모 / 영업지역 */}
                        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2.5">
                          <span className="text-xs font-black text-slate-900 block">
                            4. 사업장 소재지 및 영업지역
                          </span>
                          <div className="space-y-2">
                            <div>
                              <label className="text-[11px] font-bold text-slate-600 block mb-1">기본 도로명 주소 (다음 우편번호 검색)</label>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  readOnly
                                  value={contractRoadAddress}
                                  placeholder="우편번호 검색 버튼을 클릭하세요"
                                  className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800 outline-none cursor-pointer"
                                  onClick={() => openDaumPostcode("contract")}
                                />
                                <button
                                  type="button"
                                  onClick={() => openDaumPostcode("contract")}
                                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg shrink-0 transition-all"
                                >
                                  주소 검색
                                </button>
                              </div>
                            </div>
                            <div>
                              <label className="text-[11px] font-bold text-slate-600 block mb-1">상세 주소 (층/호수 등 직접 입력)</label>
                              <input
                                type="text"
                                value={contractDetailAddress}
                                onChange={(e) => setContractDetailAddress(e.target.value)}
                                placeholder="예: 101동 102호 (상세주소)"
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800 outline-none focus:border-amber-500 focus:bg-white"
                              />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                              <div>
                                <label className="text-[11px] font-bold text-slate-600 block mb-1">점포 전용면적 (㎡ 또는 평수)</label>
                                <input
                                  type="text"
                                  value={contractForm.storeSize}
                                  onChange={(e) => setContractForm(prev => ({ ...prev, storeSize: e.target.value }))}
                                  placeholder="예: 33㎡ (약 10평)"
                                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800 outline-none focus:border-amber-500 focus:bg-white"
                                />
                              </div>
                              <div>
                                <label className="text-[11px] font-bold text-slate-600 block mb-1">독점 영업보장 지역</label>
                                <input
                                  type="text"
                                  value={contractForm.businessArea}
                                  onChange={(e) => setContractForm(prev => ({ ...prev, businessArea: e.target.value }))}
                                  placeholder="예: 서울 강남구 역삼동 반경 500m"
                                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800 outline-none focus:border-amber-500 focus:bg-white"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 5. 납부 비용 총괄표 (직접 입력형 테이블) */}
                        <div className="p-3.5 bg-white rounded-xl border-2 border-amber-300 shadow-2xs space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-slate-900">
                              5. 가맹점사업자 납부 비용 총괄표 (직접 입력)
                            </span>
                            <span className="text-[10px] font-black text-amber-950 bg-amber-200/80 px-2 py-0.5 rounded-full border border-amber-300">
                              실시간 연동
                            </span>
                          </div>

                          {/* Live Initial Total Payment Calculator Banner */}
                          <div className="p-2.5 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/5 rounded-lg border border-amber-300 flex items-center justify-between">
                            <div>
                              <span className="text-[11px] font-bold text-slate-700 block">초기 총 개설 납부액</span>
                              <span className="text-[10px] text-slate-500">예치금 4종 + 감리비 + 초도물품비</span>
                            </div>
                            <span className="text-base font-black text-amber-950">
                              {(
                                (Number(contractForm.depositMembershipFee) || 0) +
                                (Number(contractForm.depositEduFee) || 0) +
                                (Number(contractForm.depositSupportFee) || 0) +
                                (Number(contractForm.depositGuaranteeFee) || 0) +
                                (Number(contractForm.supervisionFee) || 0) +
                                (Number(contractForm.initialSupplyFee) || 0)
                              ).toLocaleString()} 원
                            </span>
                          </div>

                          {/* Editable Cost Summary Responsive List (100% Flexible & Never Cut Off) */}
                          <div className="rounded-lg sm:rounded-xl border border-slate-200 divide-y divide-slate-100 bg-white overflow-hidden w-full text-xs">
                            {/* Header */}
                            <div className="flex items-center justify-between bg-slate-100 px-3 py-1.5 font-bold text-slate-700 text-[10px] sm:text-[11px]">
                              <span>비용 항목</span>
                              <span className="text-right">납부 금액</span>
                            </div>

                            {/* 1. 초기 개설 비용 (일시납) Group Header */}
                            <div className="bg-amber-50/70 px-3 py-1.5 font-black text-amber-950 text-[10.5px] sm:text-[11px]">
                              ■ 1. 초기 개설 비용 (계약/오픈 시 일시납)
                            </div>

                            {/* 가입비 */}
                            <div className="flex items-center justify-between gap-2 px-3 py-1.5 hover:bg-slate-50/50">
                              <span className="font-semibold text-slate-700 text-[11px] sm:text-xs shrink-0">
                                가입비 (가맹비)
                              </span>
                              <div className="relative flex-1 min-w-0 max-w-[200px]">
                                <input
                                  type="text"
                                  value={formatPriceInput(contractForm.depositMembershipFee)}
                                  onChange={(e) => handlePriceChange("depositMembershipFee", e.target.value)}
                                  className="w-full min-w-0 bg-white border border-slate-300 rounded px-2 py-1 text-xs font-black text-right text-slate-900 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 shadow-2xs pr-7"
                                  placeholder="0"
                                />
                                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-400 pointer-events-none">원</span>
                              </div>
                            </div>

                            {/* 오픈교육비 */}
                            <div className="flex items-center justify-between gap-2 px-3 py-1.5 hover:bg-slate-50/50">
                              <span className="font-semibold text-slate-700 text-[11px] sm:text-xs shrink-0">
                                오픈교육비
                              </span>
                              <div className="relative flex-1 min-w-0 max-w-[200px]">
                                <input
                                  type="text"
                                  value={formatPriceInput(contractForm.depositEduFee)}
                                  onChange={(e) => handlePriceChange("depositEduFee", e.target.value)}
                                  className="w-full min-w-0 bg-white border border-slate-300 rounded px-2 py-1 text-xs font-black text-right text-slate-900 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 shadow-2xs pr-7"
                                  placeholder="0"
                                />
                                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-400 pointer-events-none">원</span>
                              </div>
                            </div>

                            {/* 오픈지원비 */}
                            <div className="flex items-center justify-between gap-2 px-3 py-1.5 hover:bg-slate-50/50">
                              <span className="font-semibold text-slate-700 text-[11px] sm:text-xs shrink-0">
                                오픈지원비
                              </span>
                              <div className="relative flex-1 min-w-0 max-w-[200px]">
                                <input
                                  type="text"
                                  value={formatPriceInput(contractForm.depositSupportFee)}
                                  onChange={(e) => handlePriceChange("depositSupportFee", e.target.value)}
                                  className="w-full min-w-0 bg-white border border-slate-300 rounded px-2 py-1 text-xs font-black text-right text-slate-900 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 shadow-2xs pr-7"
                                  placeholder="0"
                                />
                                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-400 pointer-events-none">원</span>
                              </div>
                            </div>

                            {/* 계약이행보증금 */}
                            <div className="flex items-center justify-between gap-2 px-3 py-1.5 bg-blue-50/20">
                              <div className="flex items-center gap-1 shrink-0">
                                <span className="font-semibold text-blue-950 text-[11px] sm:text-xs">계약이행보증금</span>
                                <span className="text-[8.5px] bg-blue-100 text-blue-800 px-1 rounded font-bold">환급형</span>
                              </div>
                              <div className="relative flex-1 min-w-0 max-w-[200px]">
                                <input
                                  type="text"
                                  value={formatPriceInput(contractForm.depositGuaranteeFee)}
                                  onChange={(e) => {
                                    handlePriceChange("depositGuaranteeFee", e.target.value);
                                    handlePriceChange("guaranteeFee", e.target.value);
                                  }}
                                  className="w-full min-w-0 bg-blue-50/30 border border-blue-200 rounded px-2 py-1 text-xs font-black text-right text-blue-950 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-2xs pr-7"
                                  placeholder="0"
                                />
                                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] font-bold text-blue-500 pointer-events-none">원</span>
                              </div>
                            </div>

                            {/* 공사감리비 */}
                            <div className="flex items-center justify-between gap-2 px-3 py-1.5 hover:bg-slate-50/50">
                              <span className="font-semibold text-slate-700 text-[11px] sm:text-xs shrink-0">
                                공사감리비
                              </span>
                              <div className="relative flex-1 min-w-0 max-w-[200px]">
                                <input
                                  type="text"
                                  value={formatPriceInput(contractForm.supervisionFee)}
                                  onChange={(e) => handlePriceChange("supervisionFee", e.target.value)}
                                  className="w-full min-w-0 bg-white border border-slate-300 rounded px-2 py-1 text-xs font-black text-right text-slate-900 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 shadow-2xs pr-7"
                                  placeholder="0"
                                />
                                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-400 pointer-events-none">원</span>
                              </div>
                            </div>

                            {/* 초도물품비 */}
                            <div className="flex items-center justify-between gap-2 px-3 py-1.5 hover:bg-slate-50/50">
                              <span className="font-semibold text-slate-700 text-[11px] sm:text-xs shrink-0">
                                초도물품비
                              </span>
                              <div className="relative flex-1 min-w-0 max-w-[200px]">
                                <input
                                  type="text"
                                  value={formatPriceInput(contractForm.initialSupplyFee)}
                                  onChange={(e) => handlePriceChange("initialSupplyFee", e.target.value)}
                                  className="w-full min-w-0 bg-white border border-slate-300 rounded px-2 py-1 text-xs font-black text-right text-slate-900 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 shadow-2xs pr-7"
                                  placeholder="0"
                                />
                                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-400 pointer-events-none">원</span>
                              </div>
                            </div>

                            {/* 2. 운영 중 정기 납부 비용 Group Header */}
                            <div className="bg-slate-50 px-3 py-1.5 font-black text-slate-800 text-[10.5px] sm:text-[11px]">
                              ■ 2. 운영 중 정기 납부 비용 (월납 / 수시)
                            </div>

                            {/* 로열티 */}
                            <div className="flex items-center justify-between gap-2 px-3 py-1.5 hover:bg-slate-50/50">
                              <span className="font-semibold text-slate-700 text-[11px] sm:text-xs shrink-0">
                                월 계속가맹금 (로열티)
                              </span>
                              <div className="relative flex-1 min-w-0 max-w-[200px]">
                                <input
                                  type="text"
                                  value={formatPriceInput(contractForm.royaltyFee)}
                                  onChange={(e) => handlePriceChange("royaltyFee", e.target.value)}
                                  className="w-full min-w-0 bg-white border border-slate-300 rounded px-2 py-1 text-xs font-black text-right text-slate-900 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 shadow-2xs pr-7"
                                  placeholder="0"
                                />
                                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-400 pointer-events-none">원</span>
                              </div>
                            </div>

                            {/* 신입교육비 */}
                            <div className="flex items-center justify-between gap-2 px-3 py-1.5 hover:bg-slate-50/50">
                              <span className="font-semibold text-slate-700 text-[11px] sm:text-xs shrink-0">
                                신입교육비 (1인당)
                              </span>
                              <div className="relative flex-1 min-w-0 max-w-[200px]">
                                <input
                                  type="text"
                                  value={formatPriceInput(contractForm.eduNewFee)}
                                  onChange={(e) => handlePriceChange("eduNewFee", e.target.value)}
                                  className="w-full min-w-0 bg-white border border-slate-300 rounded px-2 py-1 text-xs font-black text-right text-slate-900 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 shadow-2xs pr-7"
                                  placeholder="0"
                                />
                                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-400 pointer-events-none">원</span>
                              </div>
                            </div>

                            {/* 3. 갱신 및 해지 조건부 비용 Group Header */}
                            <div className="bg-slate-50 px-3 py-1.5 font-black text-slate-800 text-[10.5px] sm:text-[11px]">
                              ■ 3. 갱신 및 해지 조건부 비용
                            </div>

                            {/* 재가맹비 */}
                            <div className="flex items-center justify-between gap-2 px-3 py-1.5 hover:bg-slate-50/50">
                              <span className="font-semibold text-slate-700 text-[11px] sm:text-xs shrink-0">
                                재가맹비 (2년 갱신)
                              </span>
                              <div className="relative flex-1 min-w-0 max-w-[200px]">
                                <input
                                  type="text"
                                  value={formatPriceInput(contractForm.reFranchiseFee)}
                                  onChange={(e) => handlePriceChange("reFranchiseFee", e.target.value)}
                                  className="w-full min-w-0 bg-white border border-slate-300 rounded px-2 py-1 text-xs font-black text-right text-slate-900 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 shadow-2xs pr-7"
                                  placeholder="0"
                                />
                                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-400 pointer-events-none">원</span>
                              </div>
                            </div>

                            {/* 위약금 */}
                            <div className="flex items-center justify-between gap-2 px-3 py-1.5 hover:bg-rose-50/30">
                              <span className="font-semibold text-rose-600 text-[11px] sm:text-xs shrink-0">
                                계약해지 위약금
                              </span>
                              <div className="relative flex-1 min-w-0 max-w-[200px]">
                                <input
                                  type="text"
                                  value={formatPriceInput(contractForm.penaltyFee)}
                                  onChange={(e) => handlePriceChange("penaltyFee", e.target.value)}
                                  className="w-full min-w-0 bg-white border border-rose-300 rounded px-2 py-1 text-xs font-black text-right text-rose-700 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 shadow-2xs pr-7"
                                  placeholder="0"
                                />
                                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] font-bold text-rose-500 pointer-events-none">원</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action Button at bottom of right panel */}
                        <div className="pt-2 pb-6">
                          <button
                            type="submit"
                            className="w-full py-3.5 bg-[#FED422] hover:bg-[#e5be1f] text-[#0F172A] text-sm font-black rounded-xl transition-all cursor-pointer border-0 shadow-md flex items-center justify-center gap-2 active:scale-[0.98]"
                          >
                            <Save size={16} />
                            <span>{isContractEditMode ? "계약서 수정 완료하기" : "가맹계약서 최종 저장하기"}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                ) : selectedContract ? (
                  /* LIVE CONTRACT DOCUMENT VIEWER (FIXED TOP ACTION BAR + SCROLLABLE DOCUMENT BODY) */
                  <div className="flex flex-col h-full overflow-hidden space-y-3.5 animate-fadeIn min-h-0">
                    {/* Header Action Bar (Clean STATIC top bar, NEVER scrolls away) */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-200 bg-white shrink-0">
                      <div>
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <h3 className="text-lg font-black text-[#0F172A]">{selectedContract.ownerName} 가맹사업자</h3>
                          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                            {selectedContract.storeName || "가맹점명 미정"}
                          </span>
                          <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-full ${
                            selectedContract.status === "계약서 서명완료"
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                              : selectedContract.status === "계약서 발송완료"
                              ? "bg-amber-100 text-amber-800 border border-amber-300"
                              : "bg-blue-100 text-blue-800 border border-blue-200"
                          }`}>
                            {selectedContract.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-bold mt-0.5">등록일시: {selectedContract.createdAt}</p>
                      </div>
                      
                      {/* Action buttons */}
                      <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleOpenContractSmsModal(selectedContract)}
                          className="px-3.5 py-2 bg-[#FED422] hover:bg-[#e5be1f] text-[#0F172A] text-xs font-black rounded-lg transition-all cursor-pointer border-0 shadow-2xs flex items-center gap-1.5"
                          title="가맹사업자에게 전자계약서 서명 링크 SMS 발송"
                        >
                          <Send size={13} />
                          <span>전자계약서 문자 발송</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => window.open(`/contract/${selectedContract._id}`, '_blank')}
                          className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-extrabold rounded-lg transition-all cursor-pointer border-0 shadow-2xs flex items-center gap-1.5"
                          title="전자계약서 전문 열기"
                        >
                          <ExternalLink size={13} className="text-amber-400" />
                          <span>계약서 열기</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const rawOrigin = typeof window !== "undefined" ? window.location.origin : "https://120pie.com";
                            const baseUrl = (rawOrigin && !rawOrigin.includes("localhost") && !rawOrigin.includes("127.0.0.1")) ? rawOrigin : "https://120pie.com";
                            handleCopyText(`${baseUrl}/contract/${selectedContract._id}`, "전자계약서 서명 링크");
                          }}
                          className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold rounded-lg transition-all cursor-pointer border-0 shadow-2xs flex items-center gap-1.5"
                          title="서명 링크 복사"
                        >
                          <Copy size={13} />
                          <span>링크 복사</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => window.open(`/contract/${selectedContract._id}`, '_blank')}
                          className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold rounded-lg transition-all cursor-pointer border-0 shadow-2xs flex items-center gap-1.5"
                          title="계약서 인쇄 및 PDF 출력"
                        >
                          <Printer size={13} />
                          <span>인쇄/PDF</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleStartEditContract}
                          className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold rounded-lg transition-all cursor-pointer border-0 shadow-2xs flex items-center gap-1"
                        >
                          <Edit size={13} />
                          <span>수정</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleDeleteContractConfirm}
                          className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-extrabold rounded-lg transition-all cursor-pointer border-0 shadow-2xs flex items-center gap-1"
                        >
                          <Trash2 size={13} />
                          <span>삭제</span>
                        </button>
                      </div>
                    </div>

                    {/* SCROLLABLE DOCUMENT BODY (Document Viewer + File Management) */}
                    <div className="flex-1 overflow-y-auto overflow-x-hidden pr-1 sm:pr-2 space-y-6 scroll-smooth pb-12 rounded-xl min-h-0">
                      {/* Official Document Viewer */}
                      <div className="bg-slate-100/70 p-3 sm:p-6 rounded-2xl border border-slate-200/80 shadow-inner">
                        <FranchiseContractDocument
                          contract={selectedContract}
                          isEditable={false}
                        />
                      </div>

                      {/* Bottom Status & File Management Widget */}
                      <div className="p-4 sm:p-5 bg-white border border-slate-200 rounded-xl space-y-4 shadow-xs text-xs">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                          <span className="font-black text-[#0F172A] text-sm">계약 서명 및 첨부파일 관리</span>
                          <span className="text-[11px] font-bold text-slate-500">
                            {selectedContract.signatureImage ? "전자서명 체결 완료" : "전자서명 대기 중"}
                          </span>
                        </div>

                        {selectedContract.signatureImage ? (
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-emerald-50 border border-emerald-200 p-4 rounded-xl">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
                                <CheckCircle2 size={22} />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-black text-emerald-950 text-xs">전자서명 체결 완료</span>
                                  <span className="text-[10px] bg-emerald-200 text-emerald-900 font-extrabold px-2 py-0.5 rounded-full">법적 효력 발생</span>
                                </div>
                                <p className="text-[11px] text-emerald-800 font-bold mt-0.5">
                                  서명 체결일시 : {selectedContract.signedAt || "완료"}
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => window.open(`/contract/${selectedContract._id}`, '_blank')}
                              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer border-0"
                            >
                              <Printer size={14} />
                              공식 계약서 인쇄 / PDF 출력
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                            <div className="flex items-center gap-2.5">
                              <AlertCircle size={18} className="text-amber-600 shrink-0" />
                              <span className="text-xs text-amber-900 font-bold">
                                가맹사업자의 전자서명이 대기 중입니다. [전자계약서 문자 발송]을 눌러 링크를 전송하세요.
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleOpenContractSmsModal(selectedContract)}
                              className="px-3.5 py-2 bg-[#FED422] hover:bg-[#e5be1f] text-[#0F172A] text-xs font-black rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer shrink-0 border-0"
                            >
                              <Send size={13} />
                              전자계약서 문자 발송
                            </button>
                          </div>
                        )}

                        {/* PDF Upload / Replace Option */}
                        <div className="pt-2 flex items-center justify-between gap-3 text-slate-600">
                          <span className="text-[11px] font-bold text-slate-500">외부 서명본 PDF 파일 업로드:</span>
                          <div>
                            <input
                              type="file"
                              accept=".pdf"
                              id="admin-pdf-upload"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                if (file.type !== "application/pdf") {
                                  alert("PDF 파일만 업로드할 수 있습니다.");
                                  return;
                                }
                                if (file.size > 20 * 1024 * 1024) {
                                  alert("파일 크기는 최대 20MB 이하여야 합니다.");
                                  return;
                                }
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  const result = reader.result;
                                  if (typeof result === "string") {
                                    updateContractStatusMutation({
                                      id: selectedContract._id,
                                      status: "계약서 서명완료",
                                      fileUrl: result,
                                      fileName: file.name
                                    }).then(() => {
                                      triggerToast("계약서 PDF가 업로드되었습니다.");
                                    }).catch((err) => {
                                      console.error(err);
                                      alert("업로드 중 오류가 발생했습니다.");
                                    });
                                  }
                                };
                                reader.readAsDataURL(file);
                              }}
                            />
                            <label
                              htmlFor="admin-pdf-upload"
                              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold rounded-lg transition-all cursor-pointer border-0 inline-flex items-center gap-1.5 shadow-2xs"
                            >
                              <Upload size={13} />
                              <span>{selectedContract.fileName ? "계약서 파일 재등록" : "PDF 계약서 수동 등록"}</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* EMPTY STATE */
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                    <FileText size={48} className="text-slate-300 mb-3" />
                    <h4 className="font-extrabold text-base text-slate-700">선택된 계약 정보가 없습니다</h4>
                    <p className="text-xs text-slate-400 font-bold mt-1.5 max-w-sm leading-relaxed">
                      좌측 목록에서 계약자를 선택하시거나, 상단의 <strong>[+ 계약정보 신규 등록]</strong> 버튼을 눌러 계약서를 작성해 주세요.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ==========================================
              MENU: 2. STORE MANAGEMENT
             ========================================== */}
          {currentMenu === "store" && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Header and Controls bar */}
              <div className="flex flex-col gap-4 bg-white/90 backdrop-blur-md p-5 sm:p-6 rounded-lg border-0 shadow-md space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-black text-[#0F172A] tracking-tight flex items-center gap-2 flex-wrap">
                      <span>가맹점 관리 및 상세 설정</span>
                      <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-black rounded-full border border-emerald-300 shadow-2xs">
                        총 {stores.length}개소 등록
                      </span>
                    </h2>
                    <p className="text-xs text-slate-400 font-bold mt-1">
                      신규 가맹 매장을 등록하고 계정, 연락처, 도로명 주소, 도입 패키지 모듈을 통합 관제합니다.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleOpenStoreModal()}
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#FED422] hover:bg-[#e5be1f] text-[#0F172A] text-xs font-black rounded-lg transition-all shadow-2xs cursor-pointer border-0 active:scale-95 shrink-0"
                    >
                      <Plus size={15} />
                      + 가맹점 신규 등록
                    </button>
                  </div>
                </div>

                {/* Search, Filter & Sort Bar */}
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-3 border-t border-slate-100">
                  {/* Search input box */}
                  <div className="relative flex-1 max-w-md">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="가맹점명, ID, 점주명, 연락처, 주소 검색..."
                      value={storeSearchQuery}
                      onChange={(e) => setStoreSearchQuery(e.target.value)}
                      className="w-full bg-[#F1F4F8] border-0 rounded-lg pl-10 pr-4 py-2.5 text-xs font-extrabold text-[#0F172A] placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-amber-500/20 transition-all outline-none shadow-2xs"
                    />
                    {storeSearchQuery && (
                      <button
                        onClick={() => setStoreSearchQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold border-0 bg-transparent cursor-pointer"
                      >
                        &times;
                      </button>
                    )}
                  </div>

                  {/* Status Filter Tabs, View Mode Toggle & Sort Dropdown */}
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Status Tabs */}
                    <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg shadow-2xs border-0">
                      {["전체", "승인", "대기", "보류", "중지"].map((st) => {
                        const count = st === "전체" ? stores.length : stores.filter((s) => s.status === st).length;
                        return (
                          <button
                            key={st}
                            onClick={() => setStoreStatusFilter(st)}
                            className={`px-3 py-1.5 rounded-md text-xs font-extrabold transition-all border-0 cursor-pointer ${
                              storeStatusFilter === st
                                ? "bg-[#FED422] text-[#0F172A] shadow-2xs font-black"
                                : "text-slate-600 hover:text-[#0F172A]"
                            }`}
                          >
                            {st} ({count})
                          </button>
                        );
                      })}
                    </div>

                    {/* View Mode Toggle (1열 보기 / 2열 보기 / 3열 보기, 기본: 3열 보기) */}
                    <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg shadow-2xs border-0">
                      <button
                        onClick={() => setStoreViewMode("1col")}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-extrabold transition-all border-0 cursor-pointer ${
                          storeViewMode === "1col"
                            ? "bg-[#FED422] text-[#0F172A] shadow-2xs font-black"
                            : "text-slate-500 hover:text-[#0F172A]"
                        }`}
                        title="1열 보기 (목록 리스트)"
                      >
                        <List size={14} />
                        <span>1열 보기</span>
                      </button>
                      <button
                        onClick={() => setStoreViewMode("2col")}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-extrabold transition-all border-0 cursor-pointer ${
                          storeViewMode === "2col"
                            ? "bg-[#FED422] text-[#0F172A] shadow-2xs font-black"
                            : "text-slate-500 hover:text-[#0F172A]"
                        }`}
                        title="2열 보기 (2컬럼 그리드)"
                      >
                        <LayoutGrid size={14} />
                        <span>2열 보기</span>
                      </button>
                      <button
                        onClick={() => setStoreViewMode("3col")}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-extrabold transition-all border-0 cursor-pointer ${
                          storeViewMode === "3col"
                            ? "bg-[#FED422] text-[#0F172A] shadow-2xs font-black"
                            : "text-slate-500 hover:text-[#0F172A]"
                        }`}
                        title="3열 보기 (3컬럼 그리드)"
                      >
                        <Grid3X3 size={14} />
                        <span>3열 보기</span>
                      </button>
                    </div>

                    {/* Sort Order Dropdown (Default: Latest) */}
                    <select
                      value={storeSortOrder}
                      onChange={(e) => setStoreSortOrder(e.target.value as "latest" | "oldest")}
                      className="bg-[#F1F4F8] border-0 rounded-lg px-3.5 py-2 text-xs font-extrabold text-[#0F172A] focus:bg-white focus:ring-2 focus:ring-amber-500/20 cursor-pointer outline-none shadow-2xs transition-all"
                    >
                      <option value="latest">최신 등록순 (기본)</option>
                      <option value="oldest">오래된 등록순</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Stores List / Grid Container */}
              {storeViewMode === "1col" ? (
                /* 1열 보기 (List Mode) */
                <div className="space-y-3">
                  {/* Column Table Header */}
                  <div className="hidden lg:grid grid-cols-12 gap-3 px-6 py-2 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider items-center">
                    <div className="col-span-2">등록일</div>
                    <div className="col-span-4">가맹점명 / ID / 주소</div>
                    <div className="col-span-1.5">점주명</div>
                    <div className="col-span-1.5">연락처</div>
                    <div className="col-span-1.5">도입 메뉴</div>
                    <div className="col-span-0.5 text-center">상태</div>
                    <div className="col-span-1 text-right">관리</div>
                  </div>

                  {filteredAndSortedStores.length === 0 ? (
                    <div className="bg-white rounded-lg border-0 p-16 text-center text-slate-400 font-extrabold shadow-md flex flex-col items-center justify-center space-y-2">
                      <Search size={36} className="text-slate-300 animate-pulse" />
                      <p className="text-xs">조건에 해당하는 가맹점 데이터가 없습니다.</p>
                    </div>
                  ) : (
                    filteredAndSortedStores.map((store) => (
                      <div 
                        key={store.id} 
                        className="bg-white rounded-lg p-4 sm:p-5 border-0 shadow-md hover:shadow-lg transition-all flex flex-col lg:grid lg:grid-cols-12 gap-3 lg:gap-3 items-start lg:items-center"
                      >
                        {/* Registration Date */}
                        <div className="col-span-2 flex items-center gap-2">
                          <span className="lg:hidden text-xs text-slate-400 font-semibold">등록일:</span>
                          <span className="text-xs font-extrabold text-slate-600 bg-[#F1F4F8] rounded-md px-3 py-1.5 shadow-2xs border-0">
                            {store.regDate || "2026-07-28"}
                          </span>
                        </div>

                        {/* Store Name, ID & Address */}
                        <div className="col-span-4 min-w-0 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-black text-sm text-[#0F172A] truncate">{store.name}</h4>
                            <span className="text-[11px] font-mono text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                              ID: {store.id}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 font-extrabold flex items-center gap-1.5 truncate">
                            <MapPin size={13} className="text-amber-500 shrink-0" />
                            <span className="truncate">
                              {store.roadAddress ? `${store.roadAddress} ${store.detailAddress || ""}`.trim() : "주소 정보 미등록"}
                            </span>
                          </p>
                        </div>

                        {/* Owner */}
                        <div className="col-span-1.5 text-xs font-extrabold text-[#0F172A]">
                          <span className="lg:hidden text-slate-400 font-semibold mr-2">점주:</span>
                          {store.owner}
                        </div>

                        {/* Phone */}
                        <div className="col-span-1.5 text-xs font-extrabold text-slate-600 font-mono">
                          <span className="lg:hidden text-slate-400 font-semibold mr-2">연락처:</span>
                          {store.phone}
                        </div>

                        {/* Adoption Menu Badges */}
                        <div className="col-span-1.5 flex flex-wrap gap-1">
                          {store.adoptionMenu && store.adoptionMenu.map((m) => {
                            const isPie = m === "120pie";
                            const isEgg = m === "egg120";
                            const isChurros = m === "츄러스120";
                            const isCoffee = m === "120coffee";
                            return (
                              <span 
                                key={m} 
                                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-lg border-0 shadow-2xs ${
                                  isPie 
                                    ? "bg-amber-100 text-amber-800" 
                                    : isEgg 
                                    ? "bg-orange-100 text-orange-800" 
                                    : isChurros 
                                    ? "bg-yellow-100 text-yellow-800" 
                                    : isCoffee 
                                    ? "bg-slate-100 text-slate-700" 
                                    : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {m}
                              </span>
                            );
                          })}
                        </div>

                        {/* Status Badge */}
                        <div className="col-span-0.5 lg:text-center">
                          <span className={`px-3 py-1 rounded-md text-[11px] font-extrabold border-0 shadow-2xs inline-block ${
                            store.status === "승인" 
                              ? "bg-emerald-100 text-emerald-700" 
                              : store.status === "대기"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-rose-100 text-rose-700"
                          }`}>
                            {store.status}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="col-span-1 flex items-center lg:justify-end gap-1.5 w-full lg:w-auto pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                          <button
                            onClick={() => {
                              if (typeof window !== "undefined") {
                                localStorage.setItem("120_owner_logged_in", "true");
                                localStorage.setItem("120_active_store_id", store.id);
                                window.open("/portal", "_blank");
                              }
                            }}
                            className="px-2.5 py-1.5 rounded-md bg-[#FED422] hover:bg-[#e5be1f] text-[#0F172A] transition-all cursor-pointer border-0 shadow-2xs flex items-center gap-1 font-black text-xs shrink-0"
                            title={`${store.name} 점주포털 자동로그인 이동 (새 탭)`}
                          >
                            <ExternalLink size={13} />
                            <span>점주포털</span>
                          </button>
                          <button
                            onClick={() => handleOpenStoreModal(store)}
                            className="p-2 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer border-0 shadow-2xs shrink-0"
                            title="상세 수정"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteStore(store.id)}
                            className="p-2 rounded-md bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all cursor-pointer border-0 shadow-2xs shrink-0"
                            title="삭제"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                /* 2열 보기 / 3열 보기 (Grid Mode) - DEFAULT: 3col */
                filteredAndSortedStores.length === 0 ? (
                  <div className="bg-white rounded-lg border-0 p-16 text-center text-slate-400 font-extrabold shadow-md flex flex-col items-center justify-center space-y-2">
                    <Search size={36} className="text-slate-300 animate-pulse" />
                    <p className="text-xs">조건에 해당하는 가맹점 데이터가 없습니다.</p>
                  </div>
                ) : (
                  <div className={storeViewMode === "3col" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" : "grid grid-cols-1 md:grid-cols-2 gap-4"}>
                    {filteredAndSortedStores.map((store) => (
                      <div 
                        key={store.id}
                        className="bg-white rounded-lg p-5 border-0 shadow-md hover:shadow-lg transition-all flex flex-col justify-between space-y-4"
                      >
                        {/* Card Top: Store Header & Status */}
                        <div className="space-y-2.5">
                          <div className="flex items-start justify-between gap-2">
                            <div className="space-y-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="font-black text-base text-[#0F172A] truncate">{store.name}</h4>
                                <span className="text-[11px] font-mono text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                                  ID: {store.id}
                                </span>
                              </div>
                              <p className="text-xs text-slate-400 font-extrabold flex items-center gap-1.5 truncate">
                                <MapPin size={13} className="text-amber-500 shrink-0" />
                                <span className="truncate">
                                  {store.roadAddress ? `${store.roadAddress} ${store.detailAddress || ""}`.trim() : "주소 정보 미등록"}
                                </span>
                              </p>
                            </div>

                            {/* Status Badge */}
                            <span className={`px-3 py-1 rounded-md text-[11px] font-extrabold border-0 shadow-2xs shrink-0 ${
                              store.status === "승인" 
                                ? "bg-emerald-100 text-emerald-700" 
                                : store.status === "대기"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-rose-100 text-rose-700"
                            }`}>
                              {store.status}
                            </span>
                          </div>

                          {/* Info Grid: RegDate, Owner, Phone */}
                          <div className="grid grid-cols-3 gap-2 p-3 bg-[#F8FAFC] rounded-lg text-xs mt-3 border border-slate-100">
                            <div>
                              <span className="block text-[10px] font-bold text-slate-400 mb-0.5">등록일</span>
                              <span className="font-extrabold text-slate-700">{store.regDate || "2026-07-28"}</span>
                            </div>
                            <div>
                              <span className="block text-[10px] font-bold text-slate-400 mb-0.5">점주명</span>
                              <span className="font-extrabold text-[#0F172A]">{store.owner}</span>
                            </div>
                            <div>
                              <span className="block text-[10px] font-bold text-slate-400 mb-0.5">연락처</span>
                              <span className="font-extrabold text-slate-600 font-mono">{store.phone}</span>
                            </div>
                          </div>

                          {/* Adoption Menu Badges */}
                          {store.adoptionMenu && store.adoptionMenu.length > 0 && (
                            <div className="flex items-center gap-1.5 flex-wrap pt-1">
                              <span className="text-[10px] font-bold text-slate-400 mr-1">도입 메뉴:</span>
                              {store.adoptionMenu.map((m) => {
                                const isPie = m === "120pie";
                                const isEgg = m === "egg120";
                                const isChurros = m === "츄러스120";
                                const isCoffee = m === "120coffee";
                                return (
                                  <span 
                                    key={m} 
                                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-lg border-0 shadow-2xs ${
                                      isPie 
                                        ? "bg-amber-100 text-amber-800" 
                                        : isEgg 
                                        ? "bg-orange-100 text-orange-800" 
                                        : isChurros 
                                        ? "bg-yellow-100 text-yellow-800" 
                                        : isCoffee 
                                        ? "bg-slate-100 text-slate-700" 
                                        : "bg-blue-100 text-blue-800"
                                    }`}
                                  >
                                    {m}
                                  </span>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {/* Card Bottom: Actions */}
                        <div className="flex items-center justify-between pt-3 border-t border-slate-100 gap-2">
                          <button
                            onClick={() => {
                              if (typeof window !== "undefined") {
                                localStorage.setItem("120_owner_logged_in", "true");
                                localStorage.setItem("120_active_store_id", store.id);
                                window.open("/portal", "_blank");
                              }
                            }}
                            className="px-3.5 py-2 rounded-md bg-[#FED422] hover:bg-[#e5be1f] text-[#0F172A] transition-all cursor-pointer border-0 shadow-2xs flex items-center gap-1.5 font-black text-xs"
                            title={`${store.name} 점주포털 자동로그인 이동 (새 탭)`}
                          >
                            <ExternalLink size={13} />
                            <span>점주포털</span>
                          </button>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleOpenStoreModal(store)}
                              className="px-3 py-2 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer border-0 shadow-2xs flex items-center gap-1 text-xs font-extrabold"
                              title="상세 수정"
                            >
                              <Edit size={13} />
                              <span>수정</span>
                            </button>
                            <button
                              onClick={() => handleDeleteStore(store.id)}
                              className="p-2 rounded-md bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all cursor-pointer border-0 shadow-2xs"
                              title="삭제"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
          )}

          {/* ==========================================
              MENU: PARTNER & SETTLEMENT MANAGEMENT
             ========================================== */}
          {currentMenu === "partner" && (
            <div className="space-y-6 animate-fadeIn">
              {/* Header and Controls bar */}
              <div className="flex flex-col gap-4 bg-white/90 backdrop-blur-md p-5 sm:p-6 rounded-lg border-0 shadow-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-black text-[#0F172A] tracking-tight flex items-center gap-2">
                      <Users size={24} className="text-[#FED422]" />
                      영업 파트너 및 수수료 정산 관리
                    </h2>
                    <p className="text-xs text-slate-400 font-bold mt-1">
                      가맹점을 모집하는 영업 파트너를 직접 등록·관리하고, 패스트리 생지 주문 실적에 따른 월별 수수료(1박스당 8,000원)를 정산·지급합니다.
                    </p>
                  </div>

                  <div className="flex items-center gap-3 flex-wrap">
                    <Link
                      href="/partner"
                      target="_blank"
                      className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shadow-2xs"
                    >
                      <ExternalLink size={14} />
                      <span>파트너 포털 바로가기</span>
                    </Link>
                    <button
                      onClick={() => handleOpenPartnerModal()}
                      className="px-4 py-2.5 bg-[#FED422] hover:bg-amber-400 text-[#0F172A] text-xs font-black rounded-lg transition-all flex items-center gap-1.5 shadow-md cursor-pointer border-0"
                    >
                      <Plus size={16} />
                      <span>신규 파트너 등록</span>
                    </button>
                  </div>
                </div>

                {/* Sub Tab Switcher */}
                <div className="flex items-center gap-2 border-t border-neutral-100 pt-4">
                  <button
                    onClick={() => setPartnerSubTab("list")}
                    className={`px-4 py-2 rounded-lg text-xs font-black transition-all cursor-pointer border-0 ${
                      partnerSubTab === "list"
                        ? "bg-[#FED422] text-[#0F172A] shadow-xs"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                    }`}
                  >
                    1. 파트너 목록 및 계정 관리 ({convexPartners.length}명)
                  </button>
                  <button
                    onClick={() => setPartnerSubTab("settlement")}
                    className={`px-4 py-2 rounded-lg text-xs font-black transition-all cursor-pointer border-0 ${
                      partnerSubTab === "settlement"
                        ? "bg-[#FED422] text-[#0F172A] shadow-xs"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                    }`}
                  >
                    2. 파트너 수수료 정산 및 지급 관리
                  </button>
                </div>
              </div>

              {/* TAB 1: 파트너 목록 및 계정 관리 */}
              {partnerSubTab === "list" && (
                <div className="space-y-6">
                  {/* KPI Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white rounded-lg p-5 border-0 shadow-md space-y-1">
                      <span className="text-xs font-bold text-slate-400">총 등록 파트너</span>
                      <div className="text-2xl font-black text-[#0F172A]">{convexPartners.length} 명</div>
                      <span className="text-[11px] text-emerald-600 font-bold">
                        활동중 {convexPartners.filter((p: any) => p.status === "활동중").length}명
                      </span>
                    </div>

                    <div className="bg-white rounded-lg p-5 border-0 shadow-md space-y-1">
                      <span className="text-xs font-bold text-slate-400">유치 가맹점 총합</span>
                      <div className="text-2xl font-black text-[#0F172A]">
                        {convexPartners.reduce((sum: number, p: any) => sum + (p.storesCount || 0), 0)} 개점
                      </div>
                      <span className="text-[11px] text-blue-600 font-bold">파트너십 연계 매장</span>
                    </div>

                    <div className="bg-white rounded-lg p-5 border-0 shadow-md space-y-1">
                      <span className="text-xs font-bold text-slate-400">당월 패스트리 생지 주문</span>
                      <div className="text-2xl font-black text-[#0F172A]">
                        {convexPartners.reduce((sum: number, p: any) => sum + (p.currentMonthBoxes || 0), 0)} 박스
                      </div>
                      <span className="text-[11px] text-amber-600 font-bold">1박스당 8,000원 수수료</span>
                    </div>

                    <div className="bg-white rounded-lg p-5 border-0 shadow-md space-y-1">
                      <span className="text-xs font-bold text-slate-400">당월 총 발생 수수료</span>
                      <div className="text-2xl font-black text-rose-600 font-mono">
                        {convexPartners.reduce((sum: number, p: any) => sum + (p.currentMonthCommission || 0), 0).toLocaleString()} 원
                      </div>
                      <span className="text-[11px] text-slate-400 font-bold">익월 정산 대상</span>
                    </div>
                  </div>

                  {/* Partner List Table */}
                  <div className="bg-white rounded-lg border-0 shadow-md overflow-hidden">
                    <div className="p-5 border-b border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <h3 className="text-sm font-black text-[#0F172A]">등록된 영업 파트너 명단</h3>
                      <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          value={partnerSearchQuery}
                          onChange={(e) => setPartnerSearchQuery(e.target.value)}
                          placeholder="파트너명 / 아이디 / 상호 검색"
                          className="pl-8 pr-3 py-1.5 bg-[#F1F4F8] border-0 rounded-lg text-xs font-medium text-[#0F172A] w-52 focus:bg-white focus:ring-2 focus:ring-amber-500/20 outline-none"
                        />
                      </div>
                    </div>

                    {convexPartners.length === 0 ? (
                      <div className="p-16 text-center text-slate-400 text-xs font-bold">
                        등록된 영업 파트너가 없습니다. 상단의 '신규 파트너 등록' 버튼을 눌러 파트너를 추가하세요.
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="bg-[#F8FAFC] border-b border-neutral-200/80 text-slate-500 font-bold">
                              <th className="py-3 px-4">파트너 정보</th>
                              <th className="py-3 px-3">연락처 / 이메일</th>
                              <th className="py-3 px-3">정산 입금 계좌</th>
                              <th className="py-3 px-3 text-center">유치 가맹점</th>
                              <th className="py-3 px-3 text-right">당월 생지 주문</th>
                              <th className="py-3 px-3 text-right">당월 예상 수수료</th>
                              <th className="py-3 px-3 text-center">상태</th>
                              <th className="py-3 px-3">등록일</th>
                              <th className="py-3 px-4 text-center">관리</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-neutral-100">
                            {convexPartners
                              .filter((p: any) => {
                                const q = partnerSearchQuery.toLowerCase();
                                return (
                                  p.name.toLowerCase().includes(q) ||
                                  p.id.toLowerCase().includes(q) ||
                                  (p.companyName || "").toLowerCase().includes(q) ||
                                  (p.phone || "").includes(q)
                                );
                              })
                              .map((partner: any) => (
                                <tr key={partner.id} className="hover:bg-slate-50/80 transition-colors">
                                  <td className="py-3.5 px-4">
                                    <div className="font-black text-[#0F172A] text-sm flex items-center gap-1.5">
                                      <span>{partner.name}</span>
                                      {partner.companyName && (
                                        <span className="text-xs text-slate-400 font-normal">({partner.companyName})</span>
                                      )}
                                    </div>
                                    <div className="text-[11px] font-mono text-blue-600 font-bold">
                                      ID: {partner.id} (PW: {partner.pw})
                                    </div>
                                  </td>
                                  <td className="py-3.5 px-3">
                                    <div className="font-mono text-slate-700 font-bold">{partner.phone}</div>
                                    <div className="text-[11px] text-slate-400">{partner.email || "-"}</div>
                                  </td>
                                  <td className="py-3.5 px-3">
                                    <div className="font-bold text-slate-800">
                                      {partner.bankName || "은행미등록"}{" "}
                                      <span className="font-mono font-normal">{partner.accountNumber || "-"}</span>
                                    </div>
                                    <div className="text-[11px] text-slate-400">
                                      예금주: {partner.accountHolder || partner.name}
                                    </div>
                                  </td>
                                  <td className="py-3.5 px-3 text-center">
                                    <span className="inline-block px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-black text-xs border border-blue-100">
                                      {partner.storesCount || 0} 개점
                                    </span>
                                  </td>
                                  <td className="py-3.5 px-3 text-right font-black text-amber-600 font-mono">
                                    {partner.currentMonthBoxes || 0} 박스
                                  </td>
                                  <td className="py-3.5 px-3 text-right font-black text-[#0F172A] font-mono text-sm">
                                    {(partner.currentMonthCommission || 0).toLocaleString()} 원
                                  </td>
                                  <td className="py-3.5 px-3 text-center">
                                    <span
                                      className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-extrabold ${
                                        partner.status === "활동중"
                                          ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                                          : partner.status === "대기"
                                          ? "bg-amber-50 text-amber-600 border border-amber-200"
                                          : "bg-slate-100 text-slate-500 border border-slate-200"
                                      }`}
                                    >
                                      {partner.status}
                                    </span>
                                  </td>
                                  <td className="py-3.5 px-3 text-slate-400 font-mono">{partner.regDate}</td>
                                  <td className="py-3.5 px-4 text-center">
                                    <div className="flex items-center justify-center gap-1.5">
                                      <button
                                        onClick={() => window.open(`/partner?partnerId=${partner.id}`, '_blank')}
                                        className="px-2.5 py-1 bg-amber-50 hover:bg-[#FED422] text-[#0F172A] rounded text-xs font-black transition-all border border-amber-200 cursor-pointer flex items-center gap-1"
                                        title="해당 파트너 계정으로 로그인된 어드민 포털 열기"
                                      >
                                        <ExternalLink size={12} />
                                        <span>어드민</span>
                                      </button>
                                      <button
                                        onClick={() => handleOpenPartnerModal(partner)}
                                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-bold transition-all border-0 cursor-pointer"
                                      >
                                        수정
                                      </button>
                                      <button
                                        onClick={() => handleDeletePartner(partner.id, partner.name)}
                                        className="p-1 bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded transition-all border-0 cursor-pointer"
                                        title="삭제"
                                      >
                                        <Trash2 size={14} />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: 파트너 수수료 정산 및 지급 관리 */}
              {partnerSubTab === "settlement" && (
                <div className="space-y-6">
                  {/* Settlement Header Policy Banner */}
                  <div className="p-5 rounded-lg bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <Award size={22} className="text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs font-black text-amber-900">영업 파트너 수수료 정산 정책 가이드</h4>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          • 유치 가맹점이 발주한 <strong>패스트리 생지 1박스 당 8,000원(부가세포함)</strong>을 월 단위로 합산하여 정산합니다.<br />
                          • 상태 흐름: <strong>[정산대기]</strong> → 실적 검토 후 <strong>[정산확정]</strong> → 실제 계좌 입금 후 <strong>[지급완료]</strong> 처리
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Settlements Table */}
                  <div className="bg-white rounded-lg border-0 shadow-md overflow-hidden space-y-4 p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-100">
                      <h3 className="text-sm font-black text-[#0F172A]">월별 파트너 수수료 정산 대장</h3>
                    </div>

                    {allSettlements.length === 0 ? (
                      <div className="py-16 text-center text-slate-400 text-xs font-bold">
                        정산 내역이 없습니다.
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="bg-[#F8FAFC] border-b border-neutral-200/80 text-slate-500 font-bold">
                              <th className="py-3 px-3">정산 년월</th>
                              <th className="py-3 px-3">파트너 정보</th>
                              <th className="py-3 px-3">정산 입금 계좌</th>
                              <th className="py-3 px-3 text-center">유치 가맹점</th>
                              <th className="py-3 px-3 text-right">생지 주문 박스 수</th>
                              <th className="py-3 px-3 text-right">수수료 단가</th>
                              <th className="py-3 px-3 text-right">총 정산 금액</th>
                              <th className="py-3 px-3 text-center">정산 상태</th>
                              <th className="py-3 px-3 text-center">지급일자</th>
                              <th className="py-3 px-4 text-center">관리 / 명세서</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-neutral-100">
                            {allSettlements.map((st: any, idx: number) => (
                              <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                                <td className="py-3.5 px-3 font-mono font-black text-[#0F172A]">{st.yearMonth}</td>
                                <td className="py-3.5 px-3">
                                  <div className="font-bold text-[#0F172A]">
                                    {st.partnerName}{" "}
                                    {st.companyName && <span className="text-slate-400 font-normal">({st.companyName})</span>}
                                  </div>
                                  <div className="text-[11px] text-slate-400 font-mono">{st.phone}</div>
                                </td>
                                <td className="py-3.5 px-3">
                                  <div className="font-medium text-slate-800">
                                    {st.bankName || "-"} {st.accountNumber || "-"}
                                  </div>
                                  <div className="text-[11px] text-slate-400">
                                    예금주: {st.accountHolder || st.partnerName}
                                  </div>
                                </td>
                                <td className="py-3.5 px-3 text-center font-bold text-slate-700">
                                  {st.storeCount} 개점
                                </td>
                                <td className="py-3.5 px-3 text-right font-black text-amber-600 font-mono">
                                  {st.boxCount} 박스
                                </td>
                                <td className="py-3.5 px-3 text-right text-slate-500 font-mono">
                                  {(st.commissionUnit || 8000).toLocaleString()}원
                                </td>
                                <td className="py-3.5 px-3 text-right font-black text-rose-600 font-mono text-sm">
                                  {(st.commissionAmount || 0).toLocaleString()} 원
                                </td>
                                <td className="py-3.5 px-3 text-center">
                                  <span
                                    className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-extrabold ${
                                      st.status === "지급완료"
                                        ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                                        : st.status === "정산확정"
                                        ? "bg-blue-50 text-blue-600 border border-blue-200"
                                        : "bg-amber-50 text-amber-600 border border-amber-200"
                                    }`}
                                  >
                                    {st.status}
                                  </span>
                                </td>
                                <td className="py-3.5 px-3 text-center font-mono text-slate-400">
                                  {st.paidDate || "-"}
                                </td>
                                <td className="py-3.5 px-4 text-center">
                                  <div className="flex items-center justify-center gap-1.5">
                                    <button
                                      onClick={() => handleOpenSettlementStatusModal(st)}
                                      className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded text-xs font-bold transition-all border border-amber-200 cursor-pointer"
                                    >
                                      상태 변경
                                    </button>
                                    <button
                                      onClick={() => setSelectedSettlementForModal(st)}
                                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-bold transition-all border-0 cursor-pointer flex items-center gap-1"
                                    >
                                      <FileText size={12} />
                                      <span>명세서</span>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==========================================
              MENU: RADAR MAP & TARGET MANAGEMENT (500m 상권보호)
             ========================================== */}
          {currentMenu === "radar" && (
            <div className="space-y-6 animate-fadeIn">
              <RadarMap mode="admin" />
            </div>
          )}

          {/* ==========================================
              MENU: 3. PRODUCT MANAGEMENT
             ========================================== */}
          {currentMenu === "product" && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Product and Category header block */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-[#0F172A] tracking-tight">식자재 및 부자재 카탈로그 관리</h2>
                  <p className="text-xs text-slate-400 font-semibold mt-1">
                    점주전용 발주몰에 노출할 제품 목록을 수정/삭제하고, 카테고리를 편집하며, ▲/▼ 노출 순서를 정교하게 변경합니다.
                  </p>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-center flex-wrap">
                  <button
                    onClick={() => {
                      setShowCategoryPanel(!showCategoryPanel);
                      setShowLabelPanel(false);
                      setShowPolicyPanel(false);
                    }}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold rounded-lg transition-all border-0 cursor-pointer shadow-2xs"
                  >
                    카테고리 관리
                  </button>
                  <button
                    onClick={() => {
                      setShowLabelPanel(!showLabelPanel);
                      setShowCategoryPanel(false);
                      setShowPolicyPanel(false);
                    }}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold rounded-lg transition-all border-0 cursor-pointer shadow-2xs"
                  >
                    라벨 관리
                  </button>
                  <button
                    onClick={() => {
                      setShowPolicyPanel(!showPolicyPanel);
                      setShowCategoryPanel(false);
                      setShowLabelPanel(false);
                    }}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold rounded-lg transition-all border-0 cursor-pointer shadow-2xs"
                  >
                    <Truck size={14} className="text-slate-600" />
                    배송/반품 설정
                  </button>
                  <button
                    onClick={() => handleOpenProductModal()}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#FED422] hover:bg-[#e5be1f] text-[#0F172A] text-xs font-black rounded-lg transition-all shadow-2xs cursor-pointer border-0"
                  >
                    <Plus size={16} />
                    + 제품 신규 등록
                  </button>
                </div>
              </div>

              {/* Shipping and Return Policy Panel */}
              {showPolicyPanel && (
                <div className="bg-white border-0 rounded-lg p-6 shadow-md space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="font-black text-sm text-[#0F172A] flex items-center gap-2">
                      <Truck size={17} className="text-slate-700" />
                      <span>🚚 배송비 정책 및 반품안내 설정</span>
                    </h3>
                    <button 
                      onClick={() => setShowPolicyPanel(false)}
                      className="text-xs text-slate-400 hover:text-slate-700 font-bold cursor-pointer"
                    >
                      닫기
                    </button>
                  </div>
                  <form onSubmit={handleSaveShippingSettings} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-extrabold text-[#0F172A] block">A타입 기본 배송비 (원)</label>
                        <input 
                          type="text"
                          placeholder="e.g. 3,000"
                          value={shippingFeeA}
                          onChange={(e) => {
                            let val = e.target.value.replace(/[^0-9]/g, "");
                            if (val) {
                              val = Number(val).toLocaleString();
                            } else {
                              val = "";
                            }
                            setShippingFeeA(val);
                          }}
                          required
                          className="w-full bg-[#F1F4F8] border-0 rounded-lg px-4 py-3 text-xs font-extrabold text-[#0F172A] placeholder-slate-400 focus:outline-none shadow-2xs"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-extrabold text-[#0F172A] block">B타입 기본 배송비 (원)</label>
                        <input 
                          type="text"
                          placeholder="e.g. 4,000"
                          value={shippingFeeB}
                          onChange={(e) => {
                            let val = e.target.value.replace(/[^0-9]/g, "");
                            if (val) {
                              val = Number(val).toLocaleString();
                            } else {
                              val = "";
                            }
                            setShippingFeeB(val);
                          }}
                          required
                          className="w-full bg-[#F1F4F8] border-0 rounded-lg px-4 py-3 text-xs font-extrabold text-[#0F172A] placeholder-slate-400 focus:outline-none shadow-2xs"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-extrabold text-[#0F172A] block">C타입 기본 배송비 (원)</label>
                        <input 
                          type="text"
                          placeholder="e.g. 5,000"
                          value={shippingFeeC}
                          onChange={(e) => {
                            let val = e.target.value.replace(/[^0-9]/g, "");
                            if (val) {
                              val = Number(val).toLocaleString();
                            } else {
                              val = "";
                            }
                            setShippingFeeC(val);
                          }}
                          required
                          className="w-full bg-[#F1F4F8] border-0 rounded-lg px-4 py-3 text-xs font-extrabold text-[#0F172A] placeholder-slate-400 focus:outline-none shadow-2xs"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-extrabold text-[#0F172A] block">BOX타입 기본 배송비 (10개당) (원)</label>
                        <input 
                          type="text"
                          placeholder="e.g. 6,000"
                          value={shippingFeeBox}
                          onChange={(e) => {
                            let val = e.target.value.replace(/[^0-9]/g, "");
                            if (val) {
                              val = Number(val).toLocaleString();
                            } else {
                              val = "";
                            }
                            setShippingFeeBox(val);
                          }}
                          required
                          className="w-full bg-[#F1F4F8] border-0 rounded-lg px-4 py-3 text-xs font-extrabold text-[#0F172A] placeholder-slate-400 focus:outline-none shadow-2xs"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-xs font-extrabold text-[#0F172A] block">배송비 정책 안내 설명 문구</label>
                      <textarea
                        rows={3}
                        placeholder="가맹 발주몰에 노출될 배송비 정책을 친절하게 입력해 주세요."
                        value={shippingPolicy}
                        onChange={(e) => setShippingPolicy(e.target.value)}
                        required
                        className="w-full bg-[#F1F4F8] border-0 rounded-lg p-4 text-xs font-extrabold text-[#0F172A] placeholder-slate-400 focus:outline-none resize-none shadow-2xs"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-extrabold text-[#0F172A] block">반품 및 교환 안내 설명 문구</label>
                      <textarea
                        rows={3}
                        placeholder="반품 접수 기한, 파손 보상 등 반품 및 교환 규정을 자세히 명시해 주세요."
                        value={returnPolicy}
                        onChange={(e) => setReturnPolicy(e.target.value)}
                        required
                        className="w-full bg-[#F1F4F8] border-0 rounded-lg p-4 text-xs font-extrabold text-[#0F172A] placeholder-slate-400 focus:outline-none resize-none shadow-2xs"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setShowPolicyPanel(false)}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-md transition-all cursor-pointer border-0 shadow-2xs"
                      >
                        취소
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-[#FED422] hover:bg-[#e5be1f] text-[#0F172A] font-black text-xs rounded-md transition-all shadow-2xs cursor-pointer border-0"
                      >
                        설정 저장하기
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Real-time Label Panel */}
              {showLabelPanel && (
                <div className="bg-white border-0 rounded-lg p-6 shadow-md space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="font-black text-sm text-[#0F172A] flex items-center gap-1.5">
                      <span>🏷 라벨 실시간 관리 대장</span>
                    </h3>
                    <button 
                      onClick={() => setShowLabelPanel(false)}
                      className="text-xs text-slate-400 hover:text-slate-700 font-bold cursor-pointer"
                    >
                      닫기
                    </button>
                  </div>
                  <form onSubmit={handleAddLabel} className="flex gap-2">
                    <input 
                      type="text"
                      placeholder="신규 라벨 입력 (e.g. BEST, 추천, 신제품 등)"
                      value={newLabelName}
                      onChange={(e) => setNewLabelName(e.target.value)}
                      required
                      className="flex-1 bg-[#F8F9FA] border-0 rounded-lg px-4 py-3 text-xs font-bold text-[#0F172A] placeholder-slate-400 focus:outline-none shadow-2xs"
                    />
                    <button 
                      type="submit"
                      className="px-5 py-3 bg-[#FED422] hover:bg-[#e5be1f] text-[#0F172A] font-black text-xs rounded-lg transition-all shadow-2xs cursor-pointer border-0"
                    >
                      추가
                    </button>
                  </form>
                  <div className="space-y-2.5 max-w-md pt-2">
                    <label className="text-[11px] font-extrabold text-[#0F172A] block">등록된 라벨 목록 (순서 조정 및 삭제)</label>
                    <div className="space-y-2 p-3.5 bg-[#F8F9FA] border-0 rounded-lg max-h-[300px] overflow-y-auto shadow-2xs">
                      {labels.map((labName, idx) => (
                        <div
                          key={labName}
                          className="flex items-center justify-between px-4 py-2.5 rounded-md text-xs font-bold bg-white text-[#0F172A] border-0 shadow-2xs group"
                        >
                          <span>{labName}</span>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleAdjustLabelOrder(idx, "up")}
                              disabled={idx === 0}
                              className="w-6 h-6 flex items-center justify-center rounded-lg bg-[#F8F9FA] hover:bg-slate-100 border-0 text-[#0F172A] disabled:opacity-30 text-[9px] transition-colors cursor-pointer"
                              title="위로 이동"
                            >
                              ▲
                            </button>
                            <button
                              type="button"
                              onClick={() => handleAdjustLabelOrder(idx, "down")}
                              disabled={idx === labels.length - 1}
                              className="w-6 h-6 flex items-center justify-center rounded-lg bg-[#F8F9FA] hover:bg-slate-100 border-0 text-[#0F172A] disabled:opacity-30 text-[9px] transition-colors cursor-pointer"
                              title="아래로 이동"
                            >
                              ▼
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteLabel(labName)}
                              className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-red-50 text-red-500 hover:text-red-700 ml-1 font-bold text-sm leading-none transition-colors cursor-pointer border-0"
                              title="라벨 삭제"
                            >
                              &times;
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Real-time Category Panel */}
              {showCategoryPanel && (
                <div className="bg-white border-0 rounded-lg p-6 shadow-md space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="font-black text-sm text-[#0F172A] flex items-center gap-1.5">
                      <span>🏷 카테고리 실시간 관리 대장</span>
                    </h3>
                    <button 
                      onClick={() => setShowCategoryPanel(false)}
                      className="text-xs text-slate-400 hover:text-slate-700 font-bold cursor-pointer"
                    >
                      닫기
                    </button>
                  </div>
                  <form onSubmit={handleAddCategory} className="flex gap-2">
                    <input 
                      type="text"
                      placeholder="신규 카테고리 입력 (e.g. 신선식품/냉동)"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      required
                      className="flex-1 bg-[#F8F9FA] border-0 rounded-lg px-4 py-3 text-xs font-bold text-[#0F172A] placeholder-slate-400 focus:outline-none shadow-2xs"
                    />
                    <button 
                      type="submit"
                      className="px-5 py-3 bg-[#FED422] hover:bg-[#e5be1f] text-[#0F172A] font-black text-xs rounded-lg transition-all shadow-2xs cursor-pointer border-0"
                    >
                      추가
                    </button>
                  </form>
                  <div className="space-y-2.5 max-w-md pt-2">
                    <label className="text-[11px] font-extrabold text-[#0F172A] block">등록된 카테고리 목록 (순서 조정 및 삭제)</label>
                    <div className="space-y-2 p-3.5 bg-[#F8F9FA] border-0 rounded-lg max-h-[300px] overflow-y-auto shadow-2xs">
                      {categories.map((catName, idx) => (
                        <div
                          key={catName}
                          className="flex items-center justify-between px-4 py-2.5 rounded-md text-xs font-bold bg-white text-[#0F172A] border-0 shadow-2xs group"
                        >
                          <span>{catName}</span>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleAdjustCategoryOrder(idx, "up")}
                              disabled={idx === 0}
                              className="w-6 h-6 flex items-center justify-center rounded-lg bg-[#F8F9FA] hover:bg-slate-100 border-0 text-[#0F172A] disabled:opacity-30 text-[9px] transition-colors cursor-pointer"
                              title="위로 이동"
                            >
                              ▲
                            </button>
                            <button
                              type="button"
                              onClick={() => handleAdjustCategoryOrder(idx, "down")}
                              disabled={idx === categories.length - 1}
                              className="w-6 h-6 flex items-center justify-center rounded-lg bg-[#F8F9FA] hover:bg-slate-100 border-0 text-[#0F172A] disabled:opacity-30 text-[9px] transition-colors cursor-pointer"
                              title="아래로 이동"
                            >
                              ▼
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteCategory(catName)}
                              className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-red-50 text-red-500 hover:text-red-700 ml-1 font-bold text-sm leading-none transition-colors cursor-pointer border-0"
                              title="카테고리 삭제"
                            >
                              &times;
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Products Search & Category Filter Controls */}
              <div className="bg-[#F8F9FA] border-0 rounded-lg p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xs">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                  <span>
                    총{" "}
                    <strong className="text-[#0F172A] font-black">
                      {filteredProducts.length}
                    </strong>
                    개의 제품이 검색되었습니다.
                  </span>
                  {isProductFiltering && (
                    <button
                      onClick={() => {
                        setAdminProductSearch("");
                        setAdminProductCategoryFilter("전체");
                      }}
                      className="text-[10px] px-2.5 py-0.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 border-0 transition-all font-extrabold cursor-pointer"
                    >
                      필터 초기화
                    </button>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto shrink-0">
                  {/* Category Filter Select */}
                  <div className="relative min-w-[140px]">
                    <select
                      value={adminProductCategoryFilter}
                      onChange={(e) => setAdminProductCategoryFilter(e.target.value)}
                      className="w-full bg-white border-0 rounded-md px-3.5 py-2.5 text-xs font-bold text-slate-700 focus:outline-none appearance-none pr-8 cursor-pointer shadow-2xs"
                    >
                      <option value="전체">카테고리 전체</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">
                      ▼
                    </div>
                  </div>

                  {/* Text Search Input */}
                  <div className="relative flex-1 sm:w-64">
                    <input
                      type="text"
                      placeholder="제품명 또는 모델명 검색"
                      value={adminProductSearch}
                      onChange={(e) => setAdminProductSearch(e.target.value)}
                      className="w-full bg-white border-0 rounded-md pl-9 pr-8 py-2.5 text-xs text-[#0F172A] placeholder-slate-400 focus:outline-none shadow-2xs font-semibold"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <Search size={14} />
                    </div>
                    {adminProductSearch && (
                      <button
                        onClick={() => setAdminProductSearch("")}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-sm text-slate-400 hover:text-red-500 font-extrabold w-5 h-5 flex items-center justify-center rounded-full hover:bg-neutral-100 transition-colors"
                      >
                        &times;
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Products Table */}
              <div className="bg-white border-0 rounded-lg overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#F8F9FA] border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        <th className="p-4 sm:p-5 text-center">순서</th>
                        <th className="p-4 sm:p-5">이미지</th>
                        <th className="p-4 sm:p-5">카테고리</th>
                        <th className="p-4 sm:p-5">제품명 / 모델명</th>
                        <th className="p-4 sm:p-5">공급가</th>
                        <th className="p-4 sm:p-5">판매가 (할인적용가)</th>
                        <th className="p-4 sm:p-5">상태</th>
                        <th className="p-4 sm:p-5 text-center">순서 조정</th>
                        <th className="p-4 sm:p-5 text-center">관리</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {filteredProducts.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="p-8 text-center text-slate-400 font-bold">
                            {isProductFiltering
                              ? "검색 및 필터 조건에 부합하는 제품이 없습니다."
                              : "등록된 자재 제품이 존재하지 않습니다."}
                          </td>
                        </tr>
                      ) : (
                        filteredProducts.map((p) => {
                          const isDragged = draggedProductId === p.id;
                          const isDragOver = dragOverProductId === p.id;
                          return (
                            <tr 
                              key={p.id} 
                              draggable
                              onDragStart={(e) => handleProductDragStart(e, p.id)}
                              onDragOver={(e) => handleProductDragOver(e, p.id)}
                              onDragLeave={handleProductDragLeave}
                              onDrop={(e) => handleProductDrop(e, p.id)}
                              onDragEnd={handleProductDragEnd}
                              className={`transition-all select-none ${
                                isDragged 
                                  ? "opacity-30 bg-amber-100/60 scale-[0.99] border-y-2 border-dashed border-amber-300" 
                                  : isDragOver 
                                    ? "bg-amber-100/80 border-t-2 border-b-2 border-amber-500 shadow-md" 
                                    : "hover:bg-[#F8F9FA]"
                              }`}
                            >
                              <td className="p-4 sm:p-5 text-center font-bold text-[#0F172A] cursor-grab active:cursor-grabbing" title="드래그하여 순서 변경">
                                <div className="flex items-center justify-center gap-1.5 text-slate-400 group-hover:text-[#0F172A]">
                                  <GripVertical size={16} className="text-slate-400 hover:text-amber-600 transition-colors shrink-0" />
                                  <span className="w-5 text-center font-black text-xs text-slate-700">{p.orderIndex}</span>
                                </div>
                              </td>
                              <td className="p-4 sm:p-5">
                                {(() => {
                                  const status = p.status || (p.isActive ? (p.stock === "out_of_stock" ? "품절" : "판매중") : "단종");
                                  const isUnavailable = status === "품절" || status === "단종";
                                  return (
                                    <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-[#EEF0F5] shadow-2xs shrink-0 bg-white">
                                      <img 
                                        src={optimizeCloudinaryUrl(p.img)} 
                                        alt="" 
                                        draggable={false}
                                        className={`w-full h-full object-contain p-0.5 transition-all duration-300 ${
                                          isUnavailable ? "brightness-50 grayscale" : ""
                                        }`} 
                                      />
                                      {isUnavailable && (
                                        <div className={`absolute inset-0 flex items-center justify-center text-[9px] font-black tracking-wider text-white select-none ${
                                          status === "품절" ? "bg-orange-950/40" : "bg-neutral-950/50"
                                        }`}>
                                          {status}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })()}
                              </td>
                              <td className="p-4 sm:p-5">
                                <span className="bg-slate-100 text-slate-700 font-bold px-2.5 py-1 rounded-lg text-[10px] border-0">
                                  {p.category}
                                </span>
                              </td>
                              <td className="p-4 sm:p-5">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="font-bold text-[#0F172A] text-xs">{p.name}</span>
                                  {p.labels && p.labels.map((l) => {
                                    let bgClass = "";
                                    if (l === "BEST") bgClass = "bg-amber-50 text-amber-600 border border-amber-200";
                                    else if (l === "추천") bgClass = "bg-indigo-50 text-indigo-600 border border-indigo-200";
                                    else if (l === "신제품") bgClass = "bg-emerald-50 text-emerald-600 border border-emerald-200";
                                    else bgClass = "bg-neutral-50 text-neutral-600 border border-neutral-200";
                                    return (
                                      <span key={l} className={`text-[9px] font-black px-1.5 py-0.5 rounded border ${bgClass}`}>
                                        {l}
                                      </span>
                                    );
                                  })}
                                </div>
                                <div className="text-[10px] text-slate-400 font-semibold mt-0.5">{p.modelName} ({p.qty}{p.unit})</div>
                              </td>
                              <td className="p-4 sm:p-5 text-slate-600 font-bold">{(p.supplyPrice || 0).toLocaleString()} 원</td>
                              <td className="p-4 sm:p-5">
                                <div className="text-slate-400 font-bold line-through text-[10px]">{(p.price || 0).toLocaleString()} 원</div>
                                <div className="text-[#0F172A] font-black text-xs">{(p.discountedPrice || 0).toLocaleString()} 원</div>
                              </td>
                              <td className="p-4 sm:p-5">
                                {(() => {
                                  const status = p.status || (p.isActive ? (p.stock === "out_of_stock" ? "품절" : "판매중") : "단종");
                                  let badgeClass = "bg-emerald-50 text-emerald-600 border-0";
                                  if (status === "품절") {
                                    badgeClass = "bg-orange-50 text-orange-500 border-0";
                                  } else if (status === "단종") {
                                    badgeClass = "bg-neutral-100 text-neutral-500 border-0";
                                  }
                                  return (
                                    <span className={`px-2.5 py-1 rounded text-[10px] font-bold ${badgeClass}`}>
                                      {status}
                                    </span>
                                  );
                                })()}
                              </td>
                              <td className="p-4 sm:p-5 text-center">
                                <div className="flex items-center justify-center gap-1" onDragStart={(e) => e.stopPropagation()}>
                                  <button
                                    type="button"
                                    onClick={() => handleAdjustProductOrder(p.id, "up")}
                                    disabled={filteredProducts.findIndex((op) => op.id === p.id) === 0}
                                    className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border-0 disabled:opacity-30 text-slate-600 font-bold transition-all text-[9px] cursor-pointer"
                                    title="순서 위로"
                                  >
                                    ▲
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleAdjustProductOrder(p.id, "down")}
                                    disabled={filteredProducts.findIndex((op) => op.id === p.id) === filteredProducts.length - 1}
                                    className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border-0 disabled:opacity-30 text-slate-600 font-bold transition-all text-[9px] cursor-pointer"
                                    title="순서 아래로"
                                  >
                                    ▼
                                  </button>
                                </div>
                              </td>
                              <td className="p-4 sm:p-5 text-center">
                                <div className="flex items-center justify-center gap-1.5" onDragStart={(e) => e.stopPropagation()}>
                                  <button
                                    onClick={() => handleOpenProductModal(p)}
                                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border-0 text-[10px] font-extrabold transition-all cursor-pointer shadow-2xs"
                                  >
                                    수정
                                  </button>
                                  <button
                                    onClick={() => handleDeleteProduct(p.id)}
                                    className="p-1.5 rounded-lg bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 border-0 transition-all cursor-pointer"
                                    title="삭제"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              MENU: 4. ORDER MANAGEMENT
             ========================================== */}
          {currentMenu === "order" && (
            <div className="space-y-6 animate-fadeIn">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-[#0F172A] tracking-tight">전체 가맹점 발주 주문 관리</h2>
                  <p className="text-xs text-slate-400 font-semibold mt-1">가맹점들이 신청한 원자재 발주 요청을 실시간 승인하고 배송 단계를 신속히 제어합니다.</p>
                </div>
                <button
                  type="button"
                  onClick={handleExcelDownload}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#FED422] hover:bg-[#e5be1f] text-[#0F172A] text-xs font-black rounded-lg transition-all shadow-2xs shrink-0 self-start sm:self-center cursor-pointer border-0"
                >
                  <Download size={15} />
                  발주내역 엑셀 다운로드
                </button>
              </div>

              {/* 검색 및 기간 필터 영역 */}
              <div className="bg-white border border-[#EEF0F5] rounded-lg p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* 통합 검색 */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold text-[#0F172A] block">통합 검색</label>
                    <input
                      type="text"
                      placeholder="가맹점명, 점주명, 연락처, 품목명, 주소, 주문번호"
                      value={orderSearchKeyword}
                      onChange={(e) => setOrderSearchKeyword(e.target.value)}
                      className="w-full bg-[#F8F9FD] border border-[#E2E8F0] rounded-lg px-4 py-3 text-xs text-[#0F172A] placeholder-slate-400 font-bold focus:outline-none focus:border-[#F5AC00]"
                    />
                  </div>

                  {/* 기간선택 셀렉트 */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold text-[#0F172A] block">발주 기간 필터</label>
                    <select
                      value={orderDateFilterType}
                      onChange={(e) => setOrderDateFilterType(e.target.value)}
                      className="w-full bg-[#F8F9FD] border border-[#E2E8F0] rounded-lg px-4 py-3 text-xs text-[#0F172A] font-bold focus:outline-none focus:border-[#F5AC00] cursor-pointer"
                    >
                      <option value="all">전체 기간</option>
                      <option value="today">당일 (오늘)</option>
                      <option value="yesterday">전일 (어제)</option>
                      <option value="week">최근 일주일</option>
                      <option value="month">당월 (이번달)</option>
                      <option value="prev_month">전월 (지난달)</option>
                      <option value="custom">직접 지정</option>
                    </select>
                  </div>

                  {/* 직접 지정 달력 폼 (custom일 때만 노출) */}
                  {orderDateFilterType === "custom" && (
                    <div className="space-y-1.5 animate-fadeIn">
                      <label className="text-[11px] font-extrabold text-[#0F172A] block">직접 기간 선택</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="date"
                          value={orderStartDate}
                          onChange={(e) => setOrderStartDate(e.target.value)}
                          className="flex-1 bg-[#F8F9FD] border border-[#E2E8F0] rounded-lg px-3 py-2.5 text-xs font-bold text-[#0F172A] focus:outline-none"
                        />
                        <span className="text-slate-400 font-bold text-xs">~</span>
                        <input
                          type="date"
                          value={orderEndDate}
                          onChange={(e) => setOrderEndDate(e.target.value)}
                          className="flex-1 bg-[#F8F9FD] border border-[#E2E8F0] rounded-lg px-3 py-2.5 text-xs font-bold text-[#0F172A] focus:outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 발주 목록 테이블 */}
              <div className="bg-white border border-[#EEF0F5] rounded-lg overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[1000px]">
                    <thead>
                      <tr className="bg-[#F8F9FD] border-b border-[#EEF0F5] text-[11px] font-extrabold text-neutral-400 uppercase tracking-wider">
                        <th className="p-4 sm:p-5 text-center" style={{ width: '60px' }}>순서</th>
                        <th className="p-4 sm:p-5" style={{ width: '140px' }}>신청일자</th>
                        <th className="p-4 sm:p-5" style={{ width: '130px' }}>가맹점명</th>
                        <th className="p-4 sm:p-5" style={{ width: '90px' }}>점주명</th>
                        <th className="p-4 sm:p-5" style={{ width: '120px' }}>연락처</th>
                        <th className="p-4 sm:p-5" style={{ width: '220px' }}>주소</th>
                        <th className="p-4 sm:p-5" style={{ width: '180px' }}>주문 품목</th>
                        <th className="p-4 sm:p-5 text-right" style={{ width: '110px' }}>결제대금</th>
                        <th className="p-4 sm:p-5 text-center" style={{ width: '90px' }}>결제방식</th>
                        <th className="p-4 sm:p-5 text-center" style={{ width: '100px' }}>진행상태</th>
                        <th className="p-4 sm:p-5 text-center" style={{ width: '90px' }}>상세정보</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EEF0F5] text-xs">
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan={11} className="p-10 text-center text-slate-400 font-bold">검색 조건에 맞는 가맹점 발주 주문이 존재하지 않습니다.</td>
                        </tr>
                      ) : (
                        filteredOrders.map((order, idx) => {
                          const storeInfo = stores.find(s => s.id === order.storeId) || {
                            name: order.storeId === "owner" ? "본사 테스트" : "강남역삼점",
                            owner: "김지훈",
                            phone: "010-3813-1200",
                            roadAddress: "경기 군포시 엘에스로 143 (금정동, 1층 1001호)",
                            detailAddress: "",
                          };
                          const storeAddress = `${storeInfo.roadAddress} ${storeInfo.detailAddress}`.trim();
                          
                          return (
                            <tr key={order.id} className="hover:bg-[#fff9fb] transition-colors">
                              <td className="p-4 sm:p-5 text-center font-bold text-[#bf3e67]">{filteredOrders.length - idx}</td>
                              <td className="p-4 sm:p-5 text-[#735965] font-semibold whitespace-nowrap">{formatOrderDate(order.date, (order as any)._creationTime)}</td>
                              <td className="p-4 sm:p-5 font-black text-[#2d2026] whitespace-nowrap">{storeInfo.name}</td>
                              <td className="p-4 sm:p-5 font-semibold text-[#735965] whitespace-nowrap">{storeInfo.owner}</td>
                              <td className="p-4 sm:p-5 font-semibold text-[#735965] whitespace-nowrap">{storeInfo.phone}</td>
                              <td className="p-4 sm:p-5 font-semibold text-[#735965] max-w-[220px] truncate" title={storeAddress}>{storeAddress}</td>
                              <td className="p-4 sm:p-5">
                                <span className="font-bold text-[#2d2026] block leading-tight">
                                  {order.items[0]?.productName || "기본 품목"} {order.items.length > 1 ? `외 ${order.items.length - 1}건` : ""}
                                </span>
                                <span className="text-[10px] text-[#735965] block font-semibold mt-0.5 max-w-[175px] truncate" title={order.items.map(item => `${item.productName} ${item.quantity}개`).join(", ")}>
                                  {order.items.map(item => `${item.productName} ${item.quantity}개`).join(", ")}
                                </span>
                              </td>
                              <td className="p-4 sm:p-5 font-bold text-[#2d2026] text-right whitespace-nowrap">{order.totalPrice.toLocaleString()} 원</td>
                              <td className="p-4 sm:p-5 text-center whitespace-nowrap">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold ${
                                  order.payMethod === "card" || order.payMethod === "CARD"
                                    ? "bg-purple-50 text-purple-600 border border-purple-200"
                                    : "bg-orange-50 text-orange-600 border border-orange-200"
                                }`}>
                                  {order.payMethod === "card" || order.payMethod === "CARD" ? "카드" : "현금"}
                                </span>
                              </td>
                              <td className="p-4 sm:p-5 text-center whitespace-nowrap">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold ${
                                  (() => {
                                    const colorKey = statusColors[order.status] || DEFAULT_STATUS_COLORS[order.status] || "pink";
                                    const preset = COLOR_PRESETS[colorKey as keyof typeof COLOR_PRESETS] || COLOR_PRESETS.pink;
                                    return `${preset.bg} ${preset.text} ${preset.border}`;
                                  })()
                                }`}>
                                  {order.status}
                                </span>
                              </td>
                              <td className="p-4 sm:p-5 text-center whitespace-nowrap">
                                <div className="flex items-center justify-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => handleOpenOrderModal(order)}
                                    className="px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-extrabold transition-all border-0 shadow-2xs cursor-pointer"
                                  >
                                    상세보기
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteOrder(order._id)}
                                    className="p-1.5 rounded-md bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all border-0 shadow-2xs cursor-pointer"
                                    title="삭제"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ==========================================
              MENU: 5. NOTICE MANAGEMENT
             ========================================== */}
          {currentMenu === "notice" && (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-[#2d2026]">가맹점 공지사항 통합 관리</h2>
                  <p className="text-xs text-[#735965] font-bold mt-1">공지사항을 작성, 수정하고 배포하여 전국의 점주들에게 긴급 소식을 공유합니다.</p>
                </div>
                <button
                  onClick={() => setShowNoticeModal(true)}
                  className="inline-flex items-center justify-center gap-1.5 px-5 py-3 bg-[#FED422] hover:bg-[#e5be1f] text-[#0F172A] text-xs font-black rounded-lg transition-all shadow-2xs shrink-0 self-start sm:self-center cursor-pointer border-0"
                >
                  <Plus size={15} />
                  신규 공지 작성
                </button>
              </div>

              {/* Notices List */}
              <div className="bg-white border-0 rounded-lg overflow-hidden shadow-md">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#F8F9FD] border-b border-[#EEF0F5] text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                        <th className="p-4 sm:p-5">태그 구분</th>
                        <th className="p-4 sm:p-5">공지 제목</th>
                        <th className="p-4 sm:p-5">등록 일자</th>
                        <th className="p-4 sm:p-5">조회수</th>
                        <th className="p-4 sm:p-5 text-center">액션</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EEF0F5] text-xs">
                      {notices.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-slate-400 font-bold">등록된 공지사항이 존재하지 않습니다.</td>
                        </tr>
                      ) : (
                        notices.map((n) => (
                          <tr key={n.id} className="hover:bg-[#fff9fb] transition-colors">
                            <td className="p-4 sm:p-5">
                              <span className={`text-[10px] font-extrabold px-3 py-1 rounded-lg border-0 shadow-2xs ${
                                n.tag === "필독" 
                                  ? "bg-red-100 text-red-600" 
                                  : "bg-slate-100 text-slate-700"
                              }`}>
                                {n.tag}
                              </span>
                            </td>
                            <td 
                              className="p-4 sm:p-5 font-bold text-[#0F172A] max-w-xs truncate hover:text-[#F5AC00] hover:underline cursor-pointer"
                              onClick={() => handleOpenEditNoticeModal(n)}
                            >
                              {n.title}
                            </td>
                            <td className="p-4 sm:p-5 text-slate-500 font-semibold">{n.date}</td>
                            <td className="p-4 sm:p-5 font-bold text-slate-600">{n.views} 회</td>
                            <td className="p-4 sm:p-5 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  onClick={() => handleOpenEditNoticeModal(n)}
                                  className="p-1.5 rounded-md border-0 bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all text-xs cursor-pointer shadow-2xs"
                                  title="수정"
                                >
                                  <Edit size={14} />
                                </button>
                                <button
                                  onClick={() => handleDeleteNotice(n.id, n._id)}
                                  className="p-1.5 rounded-md border-0 bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all text-xs cursor-pointer shadow-2xs"
                                  title="삭제"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
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
              MENU: 6. 1:1 INQUIRY ANSWER SUPPORT
             ========================================== */}
          {currentMenu === "inquiry" && (
            <div className="space-y-6">
              
              <div>
                <h2 className="text-xl font-bold text-[#2d2026]">가맹점 1:1 AS 문의 답변 관리</h2>
                <p className="text-xs text-[#735965] font-bold mt-1">전국의 점주들이 신청한 기기 AS, 물류 파손 등의 건에 신속하고 친절한 조치 답변을 등록합니다.</p>
              </div>

              {/* Inquiries list */}
              <div className="grid grid-cols-1 gap-4">
                {inquiries.length === 0 ? (
                  <div className="bg-white border border-[#f2ccd7] rounded-lg p-8 text-center text-[#735965]">등록된 1:1 가맹점 문의 사항이 없습니다.</div>
                ) : (
                  inquiries.map((inq) => (
                    <div 
                      key={inq.id}
                      className="bg-white border border-[#f2ccd7] rounded-lg p-5 flex flex-col justify-between gap-4 shadow-sm"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-[#bf3e67] tracking-wider uppercase bg-[#ffd3df] px-2 py-0.5 rounded border border-[#f2ccd7]">
                            {inq.category}
                          </span>
                          <span className="text-xs font-semibold text-[#735965]">접수번호: {inq.id} · 신청점포: {inq.storeName || "강남역삼점"} ({inq.date})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                            inq.status === "답변완료" 
                              ? "bg-emerald-50 text-emerald-600 border border-emerald-200" 
                              : "bg-[#ffd3df] text-[#bf3e67] border border-[#f2ccd7]"
                          }`}>
                            {inq.status}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDeleteStoreInquiry(inq._id)}
                            className="p-1.5 rounded-lg bg-white hover:bg-red-50 text-red-500 border border-[#f2ccd7] hover:border-red-200 transition-all cursor-pointer"
                            title="삭제"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-bold text-base text-[#2d2026] leading-tight">{inq.title}</h4>
                        <div className="bg-[#fff1f5] border border-[#f2ccd7]/60 p-4 rounded-md">
                          <p className="text-xs sm:text-sm text-[#2d2026] leading-relaxed whitespace-pre-wrap font-semibold">{inq.content}</p>
                        </div>
                      </div>

                      {inq.status === "답변완료" && inq.answer ? (
                        <div className="border-t border-[#f2ccd7]/60 pt-4 space-y-2">
                          <span className="text-[10px] font-bold text-emerald-600 tracking-wider uppercase bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 w-fit block">
                            작성된 본사 답변
                          </span>
                          <div className="bg-[#fff9fb] border border-[#f2ccd7] p-4 rounded-md">
                            <p className="text-xs sm:text-sm text-[#2d2026] leading-relaxed whitespace-pre-wrap font-medium">{inq.answer}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="border-t border-[#f2ccd7]/60 pt-4 space-y-3">
                          <button
                            onClick={() => {
                              setSelectedInquiry(inq);
                              setInquiryAnswerText("");
                            }}
                            className="px-4 py-2.5 rounded-lg bg-[#f25f8a] hover:bg-[#df4977] text-white text-xs font-bold transition-all shadow-sm w-fit"
                          >
                            AS 및 문의 공식 답변 달기 ✍
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

            </div>
          )}

          {/* ==========================================
              MENU: 6.5. CONSULTATION INQUIRIES MANAGEMENT
             ========================================== */}
          {currentMenu === "consultation" && (
            <div className="space-y-6">
              
              <div>
                <h2 className="text-xl font-bold text-[#2d2026]">홈페이지 창업 상담문의 관리</h2>
                <p className="text-xs text-[#735965] font-bold mt-1">홈페이지 랜딩페이지를 통해 접수된 예비 창업자들의 상담 신청 내역을 조회하고 관리합니다.</p>
              </div>

              {/* Consultation Inquiries list */}
              <div className="bg-white border-0 rounded-lg overflow-hidden shadow-md">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#F8F9FD] border-b border-[#EEF0F5] text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                        <th className="p-4 sm:p-5 w-24">신청일</th>
                        <th className="p-4 sm:p-5 w-24">고객명</th>
                        <th className="p-4 sm:p-5 w-44">연락처</th>
                        <th className="p-4 sm:p-5 w-40">도입 희망 유형</th>
                        <th className="p-4 sm:p-5">상세 문의 내용</th>
                        <th className="p-4 sm:p-5 w-28 text-center">액션</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EEF0F5] text-xs">
                      {consultations.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-slate-400 font-bold">접수된 창업 상담문의가 존재하지 않습니다.</td>
                        </tr>
                      ) : (
                        [...consultations]
                          .sort((a, b) => b.regDate.localeCompare(a.regDate) || (b._creationTime || 0) - (a._creationTime || 0))
                          .map((inq) => (
                            <tr key={inq._id} className="hover:bg-[#fff9fb] transition-colors">
                              <td className="p-4 sm:p-5 text-slate-500 font-semibold whitespace-nowrap">{inq.regDate}</td>
                              <td className="p-4 sm:p-5 font-bold text-[#0F172A] whitespace-nowrap">{inq.name}</td>
                              <td className="p-4 sm:p-5 text-slate-600 font-semibold whitespace-nowrap">
                                <div className="flex items-center gap-1.5">
                                  <span>{inq.phone}</span>
                                  <button
                                    type="button"
                                    onClick={() => handleCopyToClipboard(inq.phone, "연락처")}
                                    className="p-1.5 hover:bg-slate-200 text-slate-600 bg-slate-100 border-0 rounded-lg cursor-pointer transition-all shadow-2xs"
                                    title="복사하기"
                                  >
                                    <Copy size={12} />
                                  </button>
                                </div>
                              </td>
                              <td className="p-4 sm:p-5">
                                <span className="bg-slate-100 text-slate-700 font-extrabold px-2.5 py-1 rounded-lg text-[11px] border-0 shadow-2xs whitespace-nowrap">
                                  {inq.storeType}
                                </span>
                              </td>
                              <td className="p-4 sm:p-5 text-[#0F172A] max-w-xs sm:max-w-sm truncate" title={inq.message}>
                                <div className="flex items-center gap-2">
                                  <span className="truncate">{inq.message || "-"}</span>
                                  {inq.message && inq.message.length > 20 && (
                                    <button
                                      type="button"
                                      onClick={() => setSelectedConsultation(inq)}
                                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border-0 text-[11px] font-extrabold transition-all shadow-2xs whitespace-nowrap cursor-pointer"
                                    >
                                      더보기
                                    </button>
                                  )}
                                </div>
                              </td>
                              <td className="p-4 sm:p-5 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleDeleteConsultation(inq._id)}
                                  className="p-1.5 rounded-md border-0 bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all text-xs cursor-pointer shadow-2xs"
                                  title="삭제"
                                >
                                  <Trash2 size={14} />
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
              MENU: 6.8. HOMEPAGE ANALYTICS MANAGEMENT
             ========================================== */}
          {currentMenu === "analytics" && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-[#2d2026]">홈페이지 방문 및 통계 관리</h2>
                  <p className="text-xs text-[#735965] font-bold mt-1">
                    인입 건수, 창업 상담문의 접수, 브랜드 메뉴 조회수 통계를 분석하고 유입 경로와 방문자 IP를 확인합니다.
                  </p>
                </div>

                {/* Period selection */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="bg-slate-100 rounded-lg p-1 flex gap-1 shadow-2xs border-0">
                    {[
                      { key: "today", label: "당일" },
                      { key: "yesterday", label: "전일" },
                      { key: "week", label: "일주일" },
                      { key: "month", label: "당월" },
                      { key: "prev_month", label: "전월" },
                      { key: "custom", label: "기간선택" }
                    ].map((item) => (
                      <button
                        key={item.key}
                        onClick={() => {
                          setAnalyticsDateFilter(item.key);
                          setIpListPage(1);
                        }}
                        className={`px-3.5 py-1.5 rounded-md text-xs font-extrabold transition-all cursor-pointer border-0 ${
                          analyticsDateFilter === item.key
                            ? "bg-[#FED422] text-[#0F172A] shadow-2xs font-black"
                            : "text-slate-600 hover:text-[#0F172A]"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>

                  {analyticsDateFilter === "custom" && (
                    <div className="flex items-center gap-1.5 bg-slate-100 rounded-lg p-1.5 shadow-2xs border-0">
                      <input
                        type="date"
                        value={analyticsStartDate}
                        onChange={(e) => {
                          setAnalyticsStartDate(e.target.value);
                          setIpListPage(1);
                        }}
                        className="bg-transparent border-0 text-xs font-extrabold text-[#0F172A] focus:ring-0 p-1"
                      />
                      <span className="text-xs text-slate-400 font-bold">~</span>
                      <input
                        type="date"
                        value={analyticsEndDate}
                        onChange={(e) => {
                          setAnalyticsEndDate(e.target.value);
                          setIpListPage(1);
                        }}
                        className="bg-transparent border-0 text-xs font-extrabold text-[#0F172A] focus:ring-0 p-1"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Date display helper */}
              <div className="bg-[#F8F9FA] border-0 rounded-lg px-5 py-3 text-xs text-[#0F172A] font-extrabold flex items-center gap-2 shadow-2xs">
                <span className="inline-block w-2 h-2 rounded-full bg-[#FED422]"></span>
                <span>분석 대상 기간: <strong>{analyticsStartDate || "-"} ~ {analyticsEndDate || "-"}</strong> (총 {dateList.length}일)</span>
              </div>

              {/* Metric cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white border-0 rounded-lg p-6 flex items-center justify-between shadow-md">
                  <div>
                    <span className="text-xs text-slate-500 font-extrabold block mb-1">방문자수 (인입건수)</span>
                    <strong className="text-2xl font-black text-[#0F172A]">
                      {totalVisits.toLocaleString()} <span className="text-xs text-slate-400 font-normal">회</span>
                    </strong>
                  </div>
                  <div className="bg-slate-100 text-[#0F172A] p-3.5 rounded-lg shadow-2xs">
                    <Monitor size={22} />
                  </div>
                </div>

                <div className="bg-white border-0 rounded-lg p-6 flex items-center justify-between shadow-md">
                  <div>
                    <span className="text-xs text-slate-500 font-extrabold block mb-1">창업 상담문의</span>
                    <strong className="text-2xl font-black text-[#0F172A]">
                      {totalInquiries.toLocaleString()} <span className="text-xs text-slate-400 font-normal">건</span>
                    </strong>
                  </div>
                  <div className="bg-slate-100 text-[#0F172A] p-3.5 rounded-lg shadow-2xs">
                    <Headphones size={22} />
                  </div>
                </div>

                <div className="bg-white border-0 rounded-lg p-6 flex items-center justify-between shadow-md">
                  <div>
                    <span className="text-xs text-slate-500 font-extrabold block mb-1">메뉴 상세 뷰수</span>
                    <strong className="text-2xl font-black text-[#0F172A]">
                      {totalMenuViews.toLocaleString()} <span className="text-xs text-slate-400 font-normal">회</span>
                    </strong>
                  </div>
                  <div className="bg-slate-100 text-[#0F172A] p-3.5 rounded-lg shadow-2xs">
                    <BarChart3 size={22} />
                  </div>
                </div>
              </div>

              {/* Daily trend and referrer */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Daily Table (7 columns) */}
                <div className="lg:col-span-7 bg-white border-0 rounded-lg shadow-md flex flex-col overflow-hidden">
                  <div className="p-5 border-b border-slate-100 bg-[#F8F9FD]">
                    <h3 className="text-sm font-black text-[#0F172A]">일자별 상세 지표</h3>
                  </div>
                  <div className="overflow-x-auto flex-1 max-h-[350px]">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#F8F9FD] border-b border-slate-100 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider sticky top-0 z-10">
                          <th className="p-3.5">일자</th>
                          <th className="p-3.5 text-right">방문자수 (인입)</th>
                          <th className="p-3.5 text-right">창업 상담문의</th>
                          <th className="p-3.5 text-right">메뉴 상세 뷰수</th>
                          <th className="p-3.5 text-right">합계</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs">
                        {dailyData.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="p-8 text-center text-slate-400 font-bold">기간 내 조회된 통계가 없습니다.</td>
                          </tr>
                        ) : (
                          dailyData.map((row) => (
                            <tr key={row.date} className="hover:bg-slate-50 transition-colors">
                              <td className="p-3.5 text-[#0F172A] font-extrabold">{row.date}</td>
                              <td className="p-3.5 text-right text-slate-600 font-semibold">{row.visits.toLocaleString()}</td>
                              <td className="p-3.5 text-right text-[#0F172A] font-black">{row.inquiries.toLocaleString()}</td>
                              <td className="p-3.5 text-right text-slate-600 font-semibold">{row.menuViews.toLocaleString()}</td>
                              <td className="p-3.5 text-right text-[#0F172A] font-black bg-slate-50">
                                {(row.visits + row.inquiries + row.menuViews).toLocaleString()}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Referrers Rank (5 columns) */}
                <div className="lg:col-span-5 bg-white border-0 rounded-lg shadow-md flex flex-col overflow-hidden">
                  <div className="p-5 border-b border-slate-100 bg-[#F8F9FD]">
                    <h3 className="text-sm font-black text-[#0F172A]">유입경로(Referrer) 분석</h3>
                  </div>
                  <div className="p-5 overflow-y-auto max-h-[350px] flex-1 space-y-4">
                    {sortedReferrers.length === 0 ? (
                      <div className="text-center text-slate-400 font-bold py-12">조회된 유입경로 데이터가 없습니다.</div>
                    ) : (
                      sortedReferrers.map((ref, idx) => {
                        const percent = Math.round((ref.count / totalReferrerCount) * 100);
                        return (
                          <div key={ref.name} className="space-y-1.5">
                            <div className="flex justify-between items-center text-xs">
                              <span className="font-extrabold text-[#0F172A] flex items-center gap-2">
                                <span className="inline-block w-5 h-5 rounded-full bg-slate-100 text-[#0F172A] text-[10px] font-black flex items-center justify-center shadow-2xs">
                                  {idx + 1}
                                </span>
                                {ref.name}
                              </span>
                              <span className="font-bold text-slate-600">
                                {ref.count.toLocaleString()}건 ({percent}%)
                              </span>
                            </div>
                            <div className="w-full bg-slate-100 h-2.5 rounded-md overflow-hidden">
                              <div
                                  className="bg-[#FED422] h-full rounded-md transition-all"
                                  style={{ width: `${percent}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>

              {/* Brand Menu View Ranking */}
              <div className="bg-white border-0 rounded-lg shadow-md overflow-hidden">
                <div className="p-5 border-b border-slate-100 bg-[#F8F9FD] flex justify-between items-center">
                  <h3 className="text-sm font-black text-[#0F172A]">브랜드 / 메뉴별 상세 조회수 순위</h3>
                  <span className="text-[10px] bg-slate-100 text-[#0F172A] px-3 py-1 rounded-md font-extrabold shadow-2xs">
                    총 뷰수: {totalMenuViews.toLocaleString()}회
                  </span>
                </div>
                <div className="p-5 space-y-4 max-h-[300px] overflow-y-auto">
                  {sortedMenus.length === 0 ? (
                    <div className="text-center text-slate-400 font-bold py-8">조회된 메뉴 상세 뷰 데이터가 없습니다.</div>
                  ) : (
                    sortedMenus.map((menu, idx) => {
                      const percent = Math.round((menu.count / totalMenuViewCount) * 100);
                      return (
                        <div key={menu.name} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-6">
                          <span className="font-extrabold text-[#0F172A] text-xs sm:w-1/4 flex items-center gap-2">
                            <span className="inline-block w-5 h-5 rounded-lg bg-slate-100 text-[#0F172A] text-[10px] font-black flex items-center justify-center shrink-0 shadow-2xs">
                              {idx + 1}
                            </span>
                            {menu.name}
                          </span>
                          <div className="flex-1 flex items-center gap-3">
                            <div className="flex-1 bg-slate-100 h-2.5 rounded-md overflow-hidden">
                              <div
                                className="bg-[#FED422] h-full rounded-md transition-all"
                                style={{ width: `${percent}%` }}
                              ></div>
                            </div>
                            <span className="font-bold text-slate-600 text-xs w-20 text-right shrink-0">
                              {menu.count.toLocaleString()}회 ({percent}%)
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* IP Access Logs */}
              <div className="bg-white border-0 rounded-lg shadow-md overflow-hidden">
                <div className="p-5 border-b border-slate-100 bg-[#F8F9FD] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-black text-[#0F172A]">유입 IP 주소별 방문 분석 로그</h3>
                    <p className="text-[10px] text-slate-400 font-bold mt-0.5">접속 IP별 누적 방문 횟수 및 유입 경로, 최근 방문한 페이지를 요약 조회합니다.</p>
                  </div>

                  {/* Search */}
                  <div className="relative w-full sm:w-64">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Search size={14} />
                    </span>
                    <input
                      type="text"
                      placeholder="IP 주소 검색..."
                      value={ipSearchQuery}
                      onChange={(e) => {
                        setIpSearchQuery(e.target.value);
                        setIpListPage(1);
                      }}
                      className="pl-9 pr-4 py-2 w-full bg-[#F1F4F8] border-0 rounded-lg text-xs font-bold text-[#0F172A] placeholder-slate-400 shadow-2xs focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#F8F9FD] border-b border-slate-100 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                        <th className="p-4 w-44">IP 주소</th>
                        <th className="p-4 text-center w-24">누적 방문수</th>
                        <th className="p-4 text-center w-24">메뉴 상세뷰</th>
                        <th className="p-4">유입 경로 (Referrer)</th>
                        <th className="p-4 w-44">최종 방문 경로</th>
                        <th className="p-4 w-44">최종 접속 일시</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {paginatedIps.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-slate-400 font-bold">검색 필터에 부합하는 IP 기록이 없습니다.</td>
                        </tr>
                      ) : (
                        paginatedIps.map((row) => (
                          <tr key={row.ip} className="hover:bg-slate-50 transition-colors">
                            <td className="p-4 font-extrabold text-[#0F172A]">{row.ip}</td>
                            <td className="p-4 text-center font-bold text-slate-600">{row.visitCount.toLocaleString()}회</td>
                            <td className="p-4 text-center font-black text-[#0F172A]">{row.menuViewCount.toLocaleString()}회</td>
                            <td className="p-4 text-slate-600 font-semibold max-w-xs truncate">
                              <div className="flex flex-wrap gap-1">
                                {Array.from(row.referrers).map((ref, idx) => (
                                  <span
                                    key={idx}
                                    className="bg-slate-100 text-slate-700 text-[10px] font-extrabold px-2.5 py-1 rounded-lg border-0 shadow-2xs"
                                  >
                                    {ref}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="p-4 text-slate-600 font-semibold max-w-xs truncate" title={Array.from(row.paths).join(", ")}>
                              <span className="bg-slate-100 text-slate-700 text-[10px] font-extrabold px-2.5 py-1 rounded-lg border-0 shadow-2xs">
                                {Array.from(row.paths).pop() || "/"}
                              </span>
                            </td>
                            <td className="p-4 text-slate-600 font-bold whitespace-nowrap">
                              {new Date(row.lastTime).toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Footer */}
                {totalIpPages > 1 && (
                  <div className="p-4 sm:p-5 border-t border-slate-100 bg-[#F8F9FD] flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 font-bold">
                      총 {filteredIpsList.length}개 IP 중 {(ipListPage - 1) * ipItemsPerPage + 1}~{Math.min(ipListPage * ipItemsPerPage, filteredIpsList.length)} 표시
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        disabled={ipListPage === 1}
                        onClick={() => setIpListPage(p => Math.max(p - 1, 1))}
                        className="px-3 py-1.5 text-xs font-bold border-0 rounded-md bg-slate-100 text-slate-700 disabled:opacity-30 hover:bg-slate-200 transition-all cursor-pointer shadow-2xs"
                      >
                        이전
                      </button>
                      <span className="text-xs text-[#0F172A] font-bold px-3">
                        {ipListPage} / {totalIpPages}
                      </span>
                      <button
                        disabled={ipListPage === totalIpPages}
                        onClick={() => setIpListPage(p => Math.min(p + 1, totalIpPages))}
                        className="px-3 py-1.5 text-xs font-bold border-0 rounded-md bg-slate-100 text-slate-700 disabled:opacity-30 hover:bg-slate-200 transition-all cursor-pointer shadow-2xs"
                      >
                        다음
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ==========================================
              MENU: 7. MATERIALS & PR MANAGEMENT
             ========================================== */}
          {currentMenu === "material" && (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-[#2d2026]">가맹점 교육/홍보자료 통합 관리</h2>
                  <p className="text-xs text-[#735965] font-bold mt-1">조리 가이드라인 책자, 홍보 포스터 등 점주들이 다운로드받을 그래픽 자원을 등록 관리합니다.</p>
                </div>
                <button
                  onClick={() => {
                    setMaterialType("training");
                    setShowMaterialModal(true);
                  }}
                  className="inline-flex items-center justify-center gap-1.5 px-5 py-3 bg-[#FED422] hover:bg-[#e5be1f] text-[#0F172A] text-xs font-black rounded-lg transition-all shadow-2xs shrink-0 self-start sm:self-center cursor-pointer border-0"
                >
                  <Plus size={15} />
                  신규 자료 등록
                </button>
              </div>

              {/* Trainings & PR lists */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* 1. Trainings Block */}
                <div className="bg-white border-0 rounded-lg p-6 shadow-md space-y-4">
                  <h3 className="font-black text-base text-[#0F172A] border-b border-slate-100 pb-3.5 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <BookOpen size={18} className="text-[#0F172A]" />
                      점주 조리/AS 교육자료실 ({trainings.length})
                    </span>
                    <span className="text-[10px] font-black bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-md">
                      가맹 교육
                    </span>
                  </h3>
                  <div className="space-y-3.5 max-h-[520px] overflow-y-auto pr-1">
                    {trainings.length === 0 ? (
                      <p className="text-xs text-slate-400 font-bold text-center py-8">등록된 교육자료가 없습니다.</p>
                    ) : (
                      trainings.map((t) => (
                        <div key={t.id} className="bg-[#F8F9FA] border border-slate-100 rounded-lg p-4 flex items-center justify-between gap-3 shadow-2xs hover:border-[#FED422] transition-all group">
                          <div className="flex items-center gap-3.5 min-w-0 flex-1">
                            {renderMaterialThumbnail(t)}
                            <div className="space-y-1 min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-[9px] text-slate-700 bg-slate-200/80 px-2 py-0.5 rounded font-extrabold">{t.format}</span>
                                <span className="text-[10px] text-slate-400 font-bold">{t.date} · {t.size}</span>
                              </div>
                              <h4 className="text-xs font-black text-[#0F172A] leading-tight truncate group-hover:text-amber-600 transition-colors">{t.title}</h4>
                              <p className="text-[10px] text-slate-500 line-clamp-1 leading-relaxed">{t.desc}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleDownload(t.title, t.fileUrl, t.fileName)}
                              className="px-3 py-1.5 rounded-md bg-[#FED422] hover:bg-[#e5be1f] text-[#0F172A] font-extrabold text-[11px] transition-all border-0 cursor-pointer shadow-2xs flex items-center gap-1"
                              title="다운로드 및 자료 확인"
                            >
                              <Download size={12} />
                              <span>다운로드</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteMaterial(t.id, "training")}
                              className="p-1.5 rounded-md bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-all border border-slate-200/60 shadow-2xs shrink-0 cursor-pointer"
                              title="자료 삭제"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* 2. PR/Marketing Assets Block */}
                <div className="bg-white border-0 rounded-lg p-6 shadow-md space-y-4">
                  <h3 className="font-black text-base text-[#0F172A] border-b border-slate-100 pb-3.5 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <ImageIcon size={18} className="text-[#0F172A]" />
                      점주 홍보/마케팅 자료실 ({prs.length})
                    </span>
                    <span className="text-[10px] font-black bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-md">
                      홍보 자재
                    </span>
                  </h3>
                  <div className="space-y-3.5 max-h-[520px] overflow-y-auto pr-1">
                    {prs.length === 0 ? (
                      <p className="text-xs text-slate-400 font-bold text-center py-8">등록된 홍보자료가 없습니다.</p>
                    ) : (
                      prs.map((p) => (
                        <div key={p.id} className="bg-[#F8F9FA] border border-slate-100 rounded-lg p-4 flex items-center justify-between gap-3 shadow-2xs hover:border-[#FED422] transition-all group">
                          <div className="flex items-center gap-3.5 min-w-0 flex-1">
                            {renderMaterialThumbnail(p)}
                            <div className="space-y-1 min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-[9px] text-slate-700 bg-slate-200/80 px-2 py-0.5 rounded font-extrabold">{p.format}</span>
                                <span className="text-[10px] text-slate-400 font-bold">{p.date} · {p.size}</span>
                              </div>
                              <h4 className="text-xs font-black text-[#0F172A] leading-tight truncate group-hover:text-amber-600 transition-colors">{p.title}</h4>
                              <p className="text-[10px] text-slate-500 line-clamp-1 leading-relaxed">{p.desc}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleDownload(p.title, p.fileUrl, p.fileName)}
                              className="px-3 py-1.5 rounded-md bg-[#FED422] hover:bg-[#e5be1f] text-[#0F172A] font-extrabold text-[11px] transition-all border-0 cursor-pointer shadow-2xs flex items-center gap-1"
                              title="다운로드 및 자료 확인"
                            >
                              <Download size={12} />
                              <span>다운로드</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteMaterial(p.id, "pr")}
                              className="p-1.5 rounded-md bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-all border border-slate-200/60 shadow-2xs shrink-0 cursor-pointer"
                              title="자료 삭제"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ==========================================
              MENU: 8. BANNER MANAGEMENT
             ========================================== */}
          {currentMenu === "banner" && (
            <div className="space-y-6 animate-fadeIn text-xs sm:text-sm">
              
              <div>
                <h2 className="text-xl font-bold text-[#2d2026]">팝업 / 배너 / 플로팅 관리 센터</h2>
                <p className="text-xs text-[#735965] font-bold mt-1">
                  메인 웹 및 점주 포털에 표출될 핵심 팝업 메시지, 대시보드 메인 광고 배너 및 우측 간편 소셜 플로팅 단추의 연동 정보를 제어합니다.
                </p>
              </div>

              {/* Sub tabs navigation */}
              <div className="flex bg-slate-100 p-1.5 rounded-lg shadow-2xs border-0 w-fit gap-1.5">
                {[
                  { id: "popup", label: "📢 실시간 점주 팝업" },
                  { id: "banner", label: "🖼️ 홈 대시보드 배너" },
                  { id: "floating", label: "📱 우측 플로팅 연동" },
                  { id: "instagram", label: "📸 인스타 피드 연동" }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setBannerSubMenu(tab.id as any)}
                    className={`px-4 py-2.5 rounded-md text-xs font-extrabold transition-all cursor-pointer border-0 ${
                      bannerSubMenu === tab.id
                        ? "bg-[#FED422] text-[#0F172A] shadow-2xs font-black"
                        : "text-slate-600 hover:text-[#0F172A]"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* 1. REAL-TIME POPUP MANAGEMENT (HISTORY LIST & MODAL CONTROL) */}
              {bannerSubMenu === "popup" && (
                <div className="space-y-6 animate-fadeIn">
                  {/* Header & New Button */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border-0 rounded-lg p-6 shadow-md">
                    <div className="space-y-1">
                      <h3 className="font-black text-sm text-[#0F172A] flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#FED422] animate-pulse"></span>
                        실시간 팝업 히스토리 & 노출 제어
                      </h3>
                      <p className="text-[10px] text-slate-400 font-bold">
                        랜딩 페이지와 점주 포털 홈에 노출되는 모든 팝업을 등록하고, 게시 기간 및 대상 페이지별로 스마트하게 이력을 관리합니다.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleOpenPopupModal()}
                      className="px-5 py-3 bg-[#FED422] hover:bg-[#e5be1f] text-[#0F172A] text-xs font-black rounded-lg transition-all shadow-2xs flex items-center justify-center gap-1.5 self-start sm:self-center cursor-pointer border-0"
                    >
                      <Plus size={14} />
                      신규 팝업 등록
                    </button>
                  </div>

                  {/* Popups History List Table */}
                  <div className="bg-white border-0 rounded-lg overflow-hidden shadow-md">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-[#F8F9FD] border-b border-[#EEF0F5]">
                            <th className="p-4 text-[11px] font-extrabold text-slate-500 w-20 text-center">노출 여부</th>
                            <th className="p-4 text-[11px] font-extrabold text-slate-500">팝업 제목 및 본문 요약</th>
                            <th className="p-4 text-[11px] font-extrabold text-slate-500 w-32">게시 대상 페이지</th>
                            <th className="p-4 text-[11px] font-extrabold text-slate-500 w-48">게시 기간 (기간 필터)</th>
                            <th className="p-4 text-[11px] font-extrabold text-slate-500 w-28">등록 일자</th>
                            <th className="p-4 text-[11px] font-extrabold text-slate-500 w-24 text-center">관리</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs">
                          {convexPopupsList === undefined ? (
                            <tr>
                              <td colSpan={6} className="p-8 text-center text-slate-400 font-bold">
                                팝업 히스토리 데이터를 실시간 조회하는 중입니다...
                              </td>
                            </tr>
                          ) : convexPopupsList.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="p-8 text-center text-slate-400 font-bold">
                                등록된 팝업 히스토리가 없습니다. 우측 상단의 [신규 팝업 등록] 버튼을 눌러 첫 팝업을 발행해 보세요!
                              </td>
                            </tr>
                          ) : (
                            convexPopupsList.map((pop: any) => {
                              const today = new Date().toISOString().split("T")[0];
                              const isStarted = !pop.startDate || pop.startDate <= today;
                              const isEnded = pop.endDate && pop.endDate < today;
                              const isPeriodActive = isStarted && !isEnded;
                              
                              let pageBadge = "bg-slate-100 text-slate-700";
                              let pageText = "전체 페이지";
                              if (pop.targetPage === "landing") {
                                pageBadge = "bg-slate-100 text-slate-700";
                                pageText = "💻 랜딩 페이지";
                              } else if (pop.targetPage === "portal") {
                                pageBadge = "bg-slate-100 text-slate-700";
                                pageText = "📢 점주 포털";
                              }

                              return (
                                <tr key={pop._id} className="hover:bg-slate-50 transition-colors">
                                  <td className="p-4 text-center">
                                    <button
                                      type="button"
                                      onClick={() => handleTogglePopupActive(pop._id, pop.isActive)}
                                      className={`w-10 h-5 rounded-full p-0.5 mx-auto transition-all duration-300 flex border-0 cursor-pointer ${
                                        pop.isActive ? "bg-[#FED422] justify-end" : "bg-slate-200 justify-start"
                                      }`}
                                    >
                                      <span className="w-4 h-4 rounded-full bg-white shadow-2xs block"></span>
                                    </button>
                                  </td>
                                  <td className="p-4 space-y-1">
                                    <div className="font-extrabold text-[#0F172A] flex items-center gap-1.5">
                                      {pop.title}
                                      {pop.isActive && isPeriodActive && (
                                        <span className="px-2.5 py-1 rounded-lg bg-emerald-500 text-white text-[9px] font-black animate-pulse whitespace-nowrap shrink-0 inline-block shadow-2xs">
                                          현재 게시중
                                        </span>
                                      )}
                                      {pop.isActive && !isPeriodActive && !isEnded && (
                                        <span className="px-2.5 py-1 rounded-lg bg-amber-500 text-white text-[9px] font-black whitespace-nowrap shrink-0 inline-block shadow-2xs">
                                          대기중
                                        </span>
                                      )}
                                      {isEnded && (
                                        <span className="px-2.5 py-1 rounded-lg bg-slate-400 text-white text-[9px] font-black whitespace-nowrap shrink-0 inline-block shadow-2xs">
                                          기간 종료
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-[10px] text-slate-500 line-clamp-1 font-medium">{pop.desc}</div>
                                  </td>
                                  <td className="p-4">
                                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold border-0 shadow-2xs ${pageBadge}`}>
                                      {pageText}
                                    </span>
                                  </td>
                                  <td className="p-4 font-mono text-[10px] text-slate-500 font-bold">
                                    {pop.startDate || "무제한"} ~ {pop.endDate || "무제한"}
                                  </td>
                                  <td className="p-4 text-[10px] text-slate-500 font-bold">
                                    {pop.createdAt ? pop.createdAt.substring(0, 10) : "-"}
                                  </td>
                                  <td className="p-4">
                                    <div className="flex items-center justify-center gap-2">
                                      <button
                                        type="button"
                                        onClick={() => handleOpenPopupModal(pop)}
                                        className="p-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 border-0 transition-all cursor-pointer shadow-2xs"
                                        title="편집"
                                      >
                                        <Settings size={13} />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleDeletePopup(pop._id)}
                                        className="p-1.5 rounded-md bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-500 border-0 transition-all cursor-pointer shadow-2xs"
                                        title="삭제"
                                      >
                                        <Trash2 size={13} />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* 팝업 등록 및 수정 모달 */}
                  {showPopupModal && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-md animate-fadeIn overflow-x-hidden">
                      <div className="bg-white border-0 rounded-lg sm:rounded-lg w-full max-w-5xl max-w-[calc(100vw-24px)] max-h-[90vh] overflow-hidden shadow-2xl flex flex-col font-sans">
                        <div className="px-7 py-5 bg-[#FED422] text-[#0F172A] flex justify-between items-center shrink-0 shadow-2xs">
                          <div>
                            <h3 className="font-black text-base sm:text-lg text-[#0F172A] flex items-center gap-2">
                              <span>📢 {selectedPopupForEdit ? "공지 팝업 설정 수정" : "신규 공지 팝업 등록 및 발행"}</span>
                            </h3>
                            <p className="text-xs text-[#0F172A]/80 font-bold mt-0.5">홈페이지 및 점주 포털에 팝업을 게시합니다.</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="hidden sm:inline-block text-[10px] font-black tracking-wider text-[#0F172A] uppercase px-3 py-1 rounded-md bg-black/5">
                              팝업 설정
                            </span>
                            <button
                              type="button"
                              onClick={() => setShowPopupModal(false)}
                              className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 text-[#0F172A] transition-all flex items-center justify-center border-0 cursor-pointer"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-col md:flex-row flex-1 overflow-y-auto bg-[#f9fafb]">
                          {/* Left: Input Form (60%) */}
                          <form onSubmit={handleSavePopup} className="p-6 sm:p-7 space-y-4 flex-1 border-r border-slate-100 overflow-y-auto">
                            {/* Card 1: Target & Status (Amber Accent) */}
                            <div className="bg-white rounded-lg p-5 border border-neutral-200/90 shadow-2xs border-l-[5px] border-l-amber-500 space-y-4">
                              <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs">
                                    🎯
                                  </div>
                                  <span className="text-xs font-black text-[#0F172A] tracking-tight">게시 대상 및 활성화</span>
                                </div>
                                <span className="bg-amber-50 text-amber-700 border border-amber-200/80 text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-0.5 rounded-md">
                                  게시 대상
                                </span>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                  <label className="text-xs font-extrabold text-[#0F172A] block">게시 대상 페이지 (필수)</label>
                                  <select
                                    value={popupTargetPage}
                                    onChange={(e) => setPopupTargetPage(e.target.value)}
                                    className="w-full bg-[#F1F4F8] border-0 rounded-lg px-4 py-3 text-xs font-medium text-[#0F172A] focus:bg-white focus:ring-2 focus:ring-amber-500/20 cursor-pointer outline-none transition-all shadow-2xs"
                                  >
                                    <option value="all">전체 페이지 노출 (landing + portal)</option>
                                    <option value="landing">💻 홈페이지 메인 랜딩 (landing)</option>
                                    <option value="portal">📢 가맹점 점주 포털 홈 (portal)</option>
                                  </select>
                                </div>
                                <div className="space-y-1.5">
                                  <label className="text-xs font-extrabold text-[#0F172A] block">즉시 활성화 설정</label>
                                  <div className="flex items-center gap-3 bg-[#F1F4F8] border-0 rounded-lg px-4 py-2.5 shadow-2xs">
                                    <button
                                      type="button"
                                      onClick={() => setPopupActive(!popupActive)}
                                      className={`w-10 h-5 rounded-full p-0.5 transition-all duration-300 flex border-0 cursor-pointer ${
                                        popupActive ? "bg-[#FED422] justify-end" : "bg-slate-300 justify-start"
                                      }`}
                                    >
                                      <span className="w-4 h-4 rounded-full bg-white shadow-2xs block"></span>
                                    </button>
                                    <span className="text-xs font-extrabold text-[#0F172A]">
                                      {popupActive ? "활성화 (노출 대상 편입)" : "비활성화 (임시 저장)"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Card 2: Period & Title (Blue Accent) */}
                            <div className="bg-white rounded-lg p-5 border border-neutral-200/90 shadow-2xs border-l-[5px] border-l-blue-500 space-y-4">
                              <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                                    📅
                                  </div>
                                  <span className="text-xs font-black text-[#0F172A] tracking-tight">게시 기간 및 제목</span>
                                </div>
                                <span className="bg-blue-50 text-blue-700 border border-blue-200/80 text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-0.5 rounded-md">
                                  기본 정보
                                </span>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                  <label className="text-xs font-extrabold text-[#0F172A] block">게시 시작 날짜 (미설정 시 즉시게시)</label>
                                  <input
                                    type="date"
                                    value={popupStartDate}
                                    onChange={(e) => setPopupStartDate(e.target.value)}
                                    className="w-full bg-[#F1F4F8] border-0 rounded-lg px-4 py-3 text-xs font-medium text-[#0F172A] focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all shadow-2xs"
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <label className="text-xs font-extrabold text-[#0F172A] block">게시 종료 날짜 (미설정 시 상시게시)</label>
                                  <input
                                    type="date"
                                    value={popupEndDate}
                                    onChange={(e) => setPopupEndDate(e.target.value)}
                                    className="w-full bg-[#F1F4F8] border-0 rounded-lg px-4 py-3 text-xs font-medium text-[#0F172A] focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all shadow-2xs"
                                  />
                                </div>
                              </div>

                              <div className="space-y-1.5">
                                <label className="text-xs font-extrabold text-[#0F172A] block">팝업 제목 (필수)</label>
                                <input
                                  type="text"
                                  placeholder="예시) 2026 하절기 신메뉴 런칭 및 프로모션 안내"
                                  value={popupTitle}
                                  onChange={(e) => setPopupTitle(e.target.value)}
                                  required
                                  className="w-full bg-[#F1F4F8] border-0 rounded-lg px-4 py-3 text-xs font-medium text-[#0F172A] placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all shadow-2xs"
                                />
                              </div>
                            </div>

                            {/* Card 3: Image & Link (Emerald Accent) */}
                            <div className="bg-white rounded-lg p-5 border border-neutral-200/90 shadow-2xs border-l-[5px] border-l-emerald-500 space-y-4">
                              <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
                                    🖼️
                                  </div>
                                  <span className="text-xs font-black text-[#0F172A] tracking-tight">팝업 이미지 및 연결 링크</span>
                                </div>
                                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-0.5 rounded-md">
                                  미디어 및 링크
                                </span>
                              </div>

                              <div className="space-y-1.5">
                                <label className="text-xs font-extrabold text-[#0F172A] block">팝업 이미지 파일 직접 업로드 *</label>
                                <div className="flex items-center gap-3 bg-[#F1F4F8] border-0 rounded-lg p-3 shadow-2xs">
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePopupImageUpload}
                                    className="text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-[10px] file:font-extrabold file:bg-slate-200 file:text-slate-700 cursor-pointer flex-1"
                                  />
                                </div>
                                <input
                                  type="text"
                                  placeholder="https://res.cloudinary.com/... 이미지 경로"
                                  value={popupImage}
                                  onChange={(e) => setPopupImage(e.target.value)}
                                  required
                                  className="w-full bg-[#F1F4F8] border-0 rounded-lg px-4 py-3 text-xs font-medium text-[#0F172A] placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 mt-2 outline-none transition-all shadow-2xs"
                                />
                              </div>

                              <div className="space-y-1.5">
                                <label className="text-xs font-extrabold text-[#0F172A] block">클릭 시 이동할 링크 URL (선택사항)</label>
                                <input
                                  type="text"
                                  placeholder="예시) /portal/notice 또는 외부 URL"
                                  value={popupLink}
                                  onChange={(e) => setPopupLink(e.target.value)}
                                  className="w-full bg-[#F1F4F8] border-0 rounded-lg px-4 py-3 text-xs font-medium text-[#0F172A] placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all shadow-2xs"
                                />
                              </div>
                            </div>

                            {/* Stage Flow Footer Bar */}
                            <div className="px-1 py-2 flex items-center justify-between border-t border-neutral-200/60 pt-4">
                              <div className="flex items-center gap-2 text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                <span>팝업 발행 준비</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <button
                                  type="button"
                                  onClick={() => setShowPopupModal(false)}
                                  className="px-5 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 font-extrabold text-xs rounded-md transition-all cursor-pointer border-0"
                                >
                                  취소
                                </button>
                                <button
                                  type="submit"
                                  className="px-7 py-2.5 bg-[#FED422] hover:bg-[#e5be1f] text-[#0F172A] font-black text-xs rounded-md transition-all shadow-md active:scale-95 cursor-pointer border-0 flex items-center gap-2"
                                >
                                  <span>{selectedPopupForEdit ? "팝업 수정 저장" : "신규 팝업 발행"}</span>
                                  <ArrowRight size={14} />
                                </button>
                              </div>
                            </div>
                          </form>

                          {/* Right: Live Preview Panel */}
                          <div className="w-full md:w-[380px] bg-[#F8FAFC] p-6 space-y-4 flex flex-col justify-center items-center border-t md:border-t-0 md:border-l border-slate-100">
                            <span className="text-xs font-extrabold text-[#0F172A] self-start flex items-center gap-1.5">
                              <Sparkles size={14} className="text-[#F5AC00]" />
                              실시간 팝업 미리보기
                            </span>

                            <div className="w-full max-w-[300px] bg-white rounded-lg overflow-hidden shadow-md border border-slate-200/60 p-4 space-y-3">
                              {popupImage ? (
                                <img src={popupImage} alt="미리보기" className="w-full h-48 object-cover rounded-lg" />
                              ) : (
                                <div className="w-full h-48 bg-slate-100 rounded-lg flex flex-col items-center justify-center text-slate-400 gap-2">
                                  <Upload size={24} />
                                  <span className="text-xs font-bold">이미지를 등록해 주세요</span>
                                </div>
                              )}
                              <h5 className="font-black text-sm text-[#0F172A] truncate">{popupTitle || "팝업 제목이 표시됩니다"}</h5>
                              <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold pt-2 border-t border-slate-100">
                                <span>오늘 하루 보지 않기</span>
                                <span className="text-[#0F172A] font-black">닫기 ✕</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* 2. REAL-TIME BANNER MANAGEMENT WITH LIVE VISUAL PREVIEW */}
              {bannerSubMenu === "banner" && (
                <form onSubmit={handleUpdateBanners} className="space-y-6 animate-fadeIn">
                  
                  {/* Top Bar: Section Title & Save Button */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/90 rounded-lg p-6 shadow-md">
                    <div>
                      <h3 className="font-black text-base text-[#0F172A] tracking-tight flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-[#FED422] animate-pulse"></span>
                        홈 대시보드 배너 실시간 제어 센터
                      </h3>
                      <p className="text-xs text-slate-500 font-medium mt-1">
                        점주 포털 홈 대시보드의 메인 16:8 와이드 배너 및 우측 1:1 사각 배너의 문구, 이미지, 연결 링크를 실시간으로 제어합니다.
                      </p>
                    </div>
                    <button
                      type="submit"
                      className="px-6 py-3.5 bg-[#FED422] hover:bg-[#f5c800] text-[#0F172A] text-xs sm:text-sm font-black rounded-lg transition-all shadow-xs hover:shadow-md shrink-0 flex items-center justify-center gap-2 cursor-pointer border-0 hover:-translate-y-0.5 active:translate-y-0"
                    >
                      <Sparkles size={16} />
                      배너 설정 즉시 적용하기
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* Left 7 Columns: Form Controls */}
                    <div className="lg:col-span-7 space-y-6">
                      
                      {/* 1. Main Banner Panel (16:8 Wide) */}
                      <div className="bg-white border border-slate-200/90 rounded-lg p-6 shadow-md space-y-5">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#FED422]"></span>
                            <h3 className="font-black text-sm text-[#0F172A]">대시보드 메인 16:8 배너 설정</h3>
                          </div>
                          <span className="bg-amber-50 text-amber-800 border border-amber-200/80 text-[10px] font-black px-2.5 py-0.5 rounded-md">
                            메인 배너
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-xs font-extrabold text-[#0F172A] block">메인 배너 태그 라벨</label>
                            <input 
                              type="text"
                              value={bannerMainTag}
                              onChange={(e) => setBannerMainTag(e.target.value)}
                              required
                              placeholder="예: Seasonal Spec"
                              className="w-full bg-[#F1F4F8] border-0 rounded-lg px-4 py-3 text-xs font-extrabold text-[#0F172A] focus:bg-white focus:ring-2 focus:ring-amber-500/20 transition-all outline-none shadow-2xs"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-extrabold text-[#0F172A] block">메인 배너 타이틀 헤드라인</label>
                            <input 
                              type="text"
                              value={bannerMainTitle}
                              onChange={(e) => setBannerMainTitle(e.target.value)}
                              required
                              placeholder="예: 여름 대비 스페셜 신메뉴 런칭!"
                              className="w-full bg-[#F1F4F8] border-0 rounded-lg px-4 py-3 text-xs font-extrabold text-[#0F172A] focus:bg-white focus:ring-2 focus:ring-amber-500/20 transition-all outline-none shadow-2xs"
                            />
                          </div>
                        </div>

                        {/* Image Input & Dropzone */}
                        <div className="space-y-2">
                          <label className="text-xs font-extrabold text-[#0F172A] block">메인 배너 이미지 설정</label>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {/* Option A: Image URL */}
                            <input 
                              type="text"
                              value={bannerMainImage}
                              onChange={(e) => setBannerMainImage(e.target.value)}
                              placeholder="https://res.cloudinary.com/... 이미지 URL"
                              className="w-full bg-[#F1F4F8] border-0 rounded-lg px-4 py-3 text-xs font-medium text-[#0F172A] placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-amber-500/20 transition-all outline-none shadow-2xs"
                            />

                            {/* Option B: Dropzone File Upload */}
                            <label className="relative border-2 border-dashed border-slate-200 hover:border-[#FED422] rounded-lg bg-slate-50/70 hover:bg-amber-50/20 p-2.5 flex items-center justify-center cursor-pointer transition-all gap-2 group shadow-2xs">
                              <Upload size={16} className="text-slate-400 group-hover:text-amber-600 transition-colors" />
                              <span className="text-xs font-extrabold text-slate-600 group-hover:text-[#0F172A]">로컬 파일 선택 업로드</span>
                              <input 
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, "main")}
                                className="hidden"
                              />
                            </label>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-extrabold text-[#0F172A] block">메인 배너 세부 설명</label>
                          <textarea 
                            rows={3}
                            value={bannerMainDesc}
                            onChange={(e) => setBannerMainDesc(e.target.value)}
                            required
                            placeholder="점주 포털 메인 대시보드 배너에 노출될 부가 설명 문구"
                            className="w-full bg-[#F1F4F8] border-0 rounded-lg px-4 py-3 text-xs font-medium text-[#0F172A] focus:bg-white focus:ring-2 focus:ring-amber-500/20 transition-all outline-none resize-none shadow-2xs leading-relaxed"
                          />
                        </div>

                        {/* Button Text & Target Link */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                          <div className="space-y-1.5">
                            <label className="text-xs font-extrabold text-[#0F172A] block">메인 배너 클릭 유도 버튼 텍스트 (버튼명) *</label>
                            <input 
                              type="text"
                              value={bannerMainBtnText}
                              onChange={(e) => setBannerMainBtnText(e.target.value)}
                              required
                              placeholder="예: 신메뉴 자재 발주하러 가기"
                              className="w-full bg-[#F1F4F8] border-0 rounded-lg px-4 py-3 text-xs font-extrabold text-[#0F172A] focus:bg-white focus:ring-2 focus:ring-amber-500/20 transition-all outline-none shadow-2xs"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-extrabold text-[#0F172A] block">메인 배너 클릭 시 이동 대상 설정</label>
                            <select 
                              value={bannerMainLink.startsWith("http") ? "custom" : bannerMainLink}
                              onChange={(e) => {
                                const val = e.target.value;
                                if (val !== "custom") setBannerMainLink(val);
                                else setBannerMainLink("https://");
                              }}
                              className="w-full bg-[#F1F4F8] border-0 rounded-lg px-4 py-3 text-xs font-extrabold text-[#0F172A] focus:bg-white focus:ring-2 focus:ring-amber-500/20 cursor-pointer outline-none transition-all shadow-2xs"
                            >
                              <option value="order">자재발주 / 주문하기 (내부 메뉴 연결)</option>
                              <option value="training">교육자료실 (내부 메뉴 연결)</option>
                              <option value="pr">홍보자료실 (내부 메뉴 연결)</option>
                              <option value="inquiry">1:1 문의하기 (내부 메뉴 연결)</option>
                              <option value="notice">공지사항 (내부 메뉴 연결)</option>
                              <option value="custom">직접 URL 웹 주소 입력 연결</option>
                            </select>
                          </div>
                        </div>

                        {bannerMainLink.startsWith("http") && (
                          <div className="space-y-1.5">
                            <label className="text-xs font-extrabold text-[#0F172A] block">메인 배너 직접 입력 연결 URL</label>
                            <input 
                              type="text"
                              value={bannerMainLink}
                              onChange={(e) => setBannerMainLink(e.target.value)}
                              placeholder="https://example.com"
                              required
                              className="w-full bg-[#F1F4F8] border-0 rounded-lg px-4 py-3 text-xs font-extrabold text-[#0F172A] placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-amber-500/20 transition-all outline-none shadow-2xs"
                            />
                          </div>
                        )}
                      </div>

                      {/* 2. Square Banner Panel (1:1 Aspect Ratio) */}
                      <div className="bg-white border border-slate-200/90 rounded-lg p-6 shadow-md space-y-5">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                            <h3 className="font-black text-sm text-[#0F172A]">대시보드 우측 1:1 사각 배너 설정</h3>
                          </div>
                          <span className="bg-blue-50 text-blue-800 border border-blue-200/80 text-[10px] font-black px-2.5 py-0.5 rounded-md">
                            사각 배너
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-xs font-extrabold text-[#0F172A] block">사각 배너 태그 라벨</label>
                            <input 
                              type="text"
                              value={bannerSideTag}
                              onChange={(e) => setBannerSideTag(e.target.value)}
                              required
                              placeholder="예: Standard Edu"
                              className="w-full bg-[#F1F4F8] border-0 rounded-lg px-4 py-3 text-xs font-extrabold text-[#0F172A] focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none shadow-2xs"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-extrabold text-[#0F172A] block">사각 배너 타이틀 헤드라인</label>
                            <input 
                              type="text"
                              value={bannerSideTitle}
                              onChange={(e) => setBannerSideTitle(e.target.value)}
                              required
                              placeholder="예: 하절기 식품 안전 점검"
                              className="w-full bg-[#F1F4F8] border-0 rounded-lg px-4 py-3 text-xs font-extrabold text-[#0F172A] focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none shadow-2xs"
                            />
                          </div>
                        </div>

                        {/* Image Input & Dropzone */}
                        <div className="space-y-2">
                          <label className="text-xs font-extrabold text-[#0F172A] block">사각 배너 이미지 설정</label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <input 
                              type="text"
                              value={bannerSideImage}
                              onChange={(e) => setBannerSideImage(e.target.value)}
                              placeholder="https://example.com/square.jpg"
                              className="w-full bg-[#F1F4F8] border-0 rounded-lg px-4 py-3 text-xs font-medium text-[#0F172A] placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none shadow-2xs"
                            />
                            <label className="relative border-2 border-dashed border-slate-200 hover:border-blue-500 rounded-lg bg-slate-50/70 hover:bg-blue-50/20 p-2.5 flex items-center justify-center cursor-pointer transition-all gap-2 group shadow-2xs">
                              <Upload size={16} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
                              <span className="text-xs font-extrabold text-slate-600 group-hover:text-[#0F172A]">로컬 파일 선택 업로드</span>
                              <input 
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, "side")}
                                className="hidden"
                              />
                            </label>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-xs font-extrabold text-[#0F172A] block">사각 배너 상세 설명</label>
                            <textarea 
                              rows={2}
                              value={bannerSideDesc}
                              onChange={(e) => setBannerSideDesc(e.target.value)}
                              required
                              placeholder="사각 배너 상세 안내 문구"
                              className="w-full bg-[#F1F4F8] border-0 rounded-lg px-4 py-3 text-xs font-medium text-[#0F172A] focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none resize-none shadow-2xs leading-relaxed"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-extrabold text-[#0F172A] block">클릭 유도 버튼 텍스트</label>
                            <input 
                              type="text"
                              value={bannerSideBtnText}
                              onChange={(e) => setBannerSideBtnText(e.target.value)}
                              required
                              placeholder="예: 교육자료 다운로드"
                              className="w-full bg-[#F1F4F8] border-0 rounded-lg px-4 py-3 text-xs font-extrabold text-[#0F172A] focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none shadow-2xs"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-extrabold text-[#0F172A] block">사각 배너 클릭 시 이동 대상</label>
                          <select 
                            value={bannerSideLink.startsWith("http") ? "custom" : bannerSideLink}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val !== "custom") setBannerSideLink(val);
                              else setBannerSideLink("https://");
                            }}
                            className="w-full bg-[#F1F4F8] border-0 rounded-lg px-4 py-3 text-xs font-extrabold text-[#0F172A] focus:bg-white focus:ring-2 focus:ring-blue-500/20 cursor-pointer outline-none transition-all shadow-2xs"
                          >
                            <option value="training">교육자료실 (내부 메뉴 연결)</option>
                            <option value="material">홍보자료실 (내부 메뉴 연결)</option>
                            <option value="order">자재발주 / 주문하기 (내부 메뉴 연결)</option>
                            <option value="inquiry">1:1 문의하기 (내부 메뉴 연결)</option>
                            <option value="custom">직접 URL 웹 주소 입력 연결</option>
                          </select>
                        </div>
                      </div>

                    </div>

                    {/* Right 5 Columns: Live Visual Preview Cards */}
                    <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24 h-fit">
                      <div className="bg-white border border-slate-200/90 rounded-lg p-6 shadow-md space-y-5">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                          <h4 className="font-black text-sm text-[#0F172A] flex items-center gap-2">
                            <Sparkles size={16} className="text-[#FED422]" />
                            실시간 대시보드 노출 미리보기
                          </h4>
                          <span className="text-[10px] text-slate-400 font-bold bg-slate-100 px-2 py-0.5 rounded-md">
                            LIVE PREVIEW
                          </span>
                        </div>

                        {/* 1. Main Banner Preview Component */}
                        <div className="space-y-2">
                          <span className="text-[11px] font-black text-slate-600 block">① 메인 와이드 배너 (점주 포털 상단)</span>
                          <div className="relative rounded-lg overflow-hidden bg-slate-900 text-white p-5 min-h-[160px] flex flex-col justify-between shadow-xs border border-slate-200/40">
                            {bannerMainImage ? (
                              <img 
                                src={optimizeCloudinaryUrl(bannerMainImage)} 
                                alt="" 
                                className="absolute inset-0 w-full h-full object-cover opacity-40" 
                              />
                            ) : (
                              <div className="absolute inset-0 bg-gradient-to-r from-amber-950 via-slate-900 to-slate-950 opacity-90"></div>
                            )}

                            <div className="relative z-10 space-y-1">
                              <span className="bg-[#FED422] text-[#0F172A] font-black text-[9px] px-2 py-0.5 rounded-md inline-block">
                                {bannerMainTag || "Seasonal Spec"}
                              </span>
                              <h5 className="font-black text-sm text-white leading-tight">
                                {bannerMainTitle || "메인 배너 타이틀 헤드라인"}
                              </h5>
                              <p className="text-[10px] text-slate-300 font-medium line-clamp-2 leading-tight mt-1">
                                {bannerMainDesc || "메인 배너 세부 설명 문구 영역입니다."}
                              </p>
                            </div>

                            <div className="relative z-10 pt-2">
                              <span className="px-3 py-1.5 rounded-lg bg-[#FED422] text-[#0F172A] text-[10px] font-black inline-flex items-center gap-1 shadow-2xs">
                                <span>{bannerMainBtnText || "신메뉴 자재 발주하러 가기"}</span>
                                <span>→</span>
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* 2. Square Side Banner Preview Component */}
                        <div className="space-y-2 pt-2 border-t border-slate-100">
                          <span className="text-[11px] font-black text-slate-600 block">② 사각 1:1 배너 (대시보드 우측)</span>
                          <div className="bg-white border border-slate-200/90 rounded-lg p-4 shadow-2xs space-y-3">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-md bg-slate-100 overflow-hidden shrink-0 border border-slate-200/60 flex items-center justify-center">
                                {bannerSideImage ? (
                                  <img src={optimizeCloudinaryUrl(bannerSideImage)} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  <ImageIcon size={20} className="text-slate-300" />
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md inline-block mb-0.5">
                                  {bannerSideTag || "Standard Edu"}
                                </span>
                                <h5 className="font-black text-xs text-[#0F172A] truncate">
                                  {bannerSideTitle || "사각 배너 타이틀"}
                                </h5>
                              </div>
                            </div>
                            <p className="text-[10px] text-slate-500 font-medium line-clamp-2 leading-relaxed">
                              {bannerSideDesc || "사각 배너 상세 설명 안내 문구입니다."}
                            </p>
                            <button
                              type="button"
                              className="w-full py-2 bg-[#FED422] text-[#0F172A] text-[10px] font-black rounded-md border-0 shadow-2xs cursor-default text-center"
                            >
                              {bannerSideBtnText || "버튼 텍스트"} →
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>

                  </div>

                  {/* Bottom Save CTA Bar */}
                  <div className="bg-white border border-slate-200/90 rounded-lg p-5 shadow-md flex items-center justify-between gap-4">
                    <div className="text-xs text-slate-500 font-bold hidden sm:block">
                      * [배너 설정 즉시 적용하기] 버튼을 누르시면 점주 포털에 실시간 반영됩니다.
                    </div>
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-8 py-4 bg-[#FED422] hover:bg-[#f5c800] text-[#0F172A] font-black text-sm sm:text-base rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer border-0 hover:-translate-y-0.5 active:translate-y-0 ml-auto"
                    >
                      <Sparkles size={18} />
                      본사 대시보드 배너 설정 일괄 실시간 저장
                    </button>
                  </div>

                </form>
              )}

              {/* 3. REAL-TIME FLOATING BUTTON CHANNELS */}
              {bannerSubMenu === "floating" && (
                <form onSubmit={handleUpdateFloating} className="bg-white border border-slate-200/90 rounded-lg p-6 sm:p-8 shadow-md space-y-6 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div className="space-y-1">
                      <h3 className="font-black text-base text-[#0F172A] flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-[#FED422] animate-pulse"></span>
                        홈페이지 우측 핵심 플로팅 버튼 연동 제어
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">사용자 페이지 우측 하단에 고정 표시될 소셜 연동(인스타, 유튜브, 카카오톡 채널, 전화, 카톡 상담) 트레이 연동 설정입니다.</p>
                    </div>
                    {/* Switch Toggle */}
                    <button
                      type="button"
                      onClick={() => setFloatingActive(!floatingActive)}
                      className={`w-12 h-6 rounded-full p-1 transition-all duration-300 border-0 cursor-pointer ${
                        floatingActive ? "bg-[#FED422] flex justify-end" : "bg-slate-200 flex justify-start"
                      }`}
                    >
                      <span className="w-4 h-4 rounded-full bg-white shadow-2xs block transition-all"></span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-extrabold text-[#0F172A]">공식 인스타그램 주소 (Instagram)</label>
                      <input
                        type="text"
                        value={floatingInsta}
                        onChange={(e) => setFloatingInsta(e.target.value)}
                        placeholder="https://instagram.com/account"
                        className="w-full bg-[#F1F4F8] border-0 rounded-lg px-4 py-3 text-xs font-extrabold text-[#0F172A] placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-amber-500/20 transition-all outline-none shadow-2xs"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-extrabold text-[#0F172A]">공식 유튜브 채널 주소 (YouTube)</label>
                      <input
                        type="text"
                        value={floatingYoutube}
                        onChange={(e) => setFloatingYoutube(e.target.value)}
                        placeholder="https://youtube.com/c/channel"
                        className="w-full bg-[#F1F4F8] border-0 rounded-lg px-4 py-3 text-xs font-extrabold text-[#0F172A] placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-amber-500/20 transition-all outline-none shadow-2xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-extrabold text-[#0F172A]">빠른상담 연결 주소 (예: 카카오 상담페이지)</label>
                      <input
                        type="text"
                        value={floatingChat}
                        onChange={(e) => setFloatingChat(e.target.value)}
                        placeholder="https://pf.kakao.com/_xxxx"
                        className="w-full bg-[#F1F4F8] border-0 rounded-lg px-4 py-3 text-xs font-extrabold text-[#0F172A] placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-amber-500/20 transition-all outline-none shadow-2xs"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-extrabold text-[#0F172A]">다이렉트 전화문의 유도 번호 (전화 연결)</label>
                      <input
                        type="text"
                        value={floatingPhone}
                        onChange={(e) => setFloatingPhone(e.target.value)}
                        placeholder="예: 1566-3594"
                        className="w-full bg-[#F1F4F8] border-0 rounded-lg px-4 py-3 text-xs font-extrabold text-[#0F172A] placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-amber-500/20 transition-all outline-none shadow-2xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-extrabold text-[#0F172A]">실시간 카카오톡 채팅방/오픈채팅 연결 주소 (카톡상담)</label>
                      <input
                        type="text"
                        value={floatingKakao}
                        onChange={(e) => setFloatingKakao(e.target.value)}
                        placeholder="https://open.kakao.com/o/sxxxx"
                        className="w-full bg-[#F1F4F8] border-0 rounded-lg px-4 py-3 text-xs font-extrabold text-[#0F172A] placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-amber-500/20 transition-all outline-none shadow-2xs"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-extrabold text-[#0F172A]">공식 네이버 블로그 주소 (Blog)</label>
                      <input
                        type="text"
                        value={floatingBlog}
                        onChange={(e) => setFloatingBlog(e.target.value)}
                        placeholder="https://blog.naver.com/xxxx"
                        className="w-full bg-[#F1F4F8] border-0 rounded-lg px-4 py-3 text-xs font-extrabold text-[#0F172A] placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-amber-500/20 transition-all outline-none shadow-2xs"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-[#FED422] hover:bg-[#f5c800] text-[#0F172A] font-black text-sm rounded-lg transition-all shadow-xs hover:shadow-md flex items-center justify-center gap-2 active:scale-98 cursor-pointer border-0"
                  >
                    <Sparkles size={16} />
                    홈페이지 플로팅 채널 연동 정보 반영 및 저장
                  </button>
                </form>
              )}

              {/* 4. INSTAGRAM FEED MANAGEMENT */}
              {bannerSubMenu === "instagram" && (
                <div className="space-y-6 animate-fadeIn">
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/90 rounded-lg p-6 shadow-md">
                    <div className="space-y-1">
                      <h3 className="font-black text-base text-[#0F172A] flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-[#FED422] animate-pulse"></span>
                        인스타그램 연동 피드 리스트
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        브랜드 홈페이지 하단 인스타그램 섹션에 노출될 게시물 데이터 목록입니다. 클릭 시 상세 팝업 및 인스타 아웃링크가 연동됩니다.
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={handleRefreshAllInstaHd}
                        disabled={isRefreshingInstaHd}
                        className="px-4 py-3 bg-neutral-900 hover:bg-black text-[#FED422] text-xs font-black rounded-lg transition-all shadow-xs hover:shadow-md flex items-center justify-center gap-1.5 cursor-pointer border-0 disabled:opacity-50"
                        title="모든 인스타 게시물의 썸네일을 FULL HD 1080p 고화질로 자동 갱신합니다."
                      >
                        {isRefreshingInstaHd ? "⚡ 고화질 HD 갱신 중..." : "⚡ 전체 피드 HD 고화질 갱신"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setInstaId(null);
                          setInstaImg("");
                          setInstaText("");
                          setInstaLink("");
                          setInstaDate(new Date().toISOString().split("T")[0]);
                          setInstaOrder((convexInstagram?.length || 0) + 1);
                          setInstaIsMain(false);
                          setIsInstaModalOpen(true);
                        }}
                        className="px-5 py-3 bg-[#FED422] hover:bg-[#f5c800] text-[#0F172A] text-xs font-black rounded-lg transition-all shadow-xs hover:shadow-md flex items-center justify-center gap-1.5 cursor-pointer border-0 hover:-translate-y-0.5 active:translate-y-0"
                      >
                        + 신규 인스타 게시물 연동
                      </button>
                    </div>
                  </div>

                  {/* List Table */}
                  <div className="bg-white border-0 rounded-lg overflow-hidden shadow-md">
                    <div className="bg-[#F8F9FD] px-6 py-3 border-b border-[#EEF0F5] flex items-center justify-between text-xs font-bold text-slate-600">
                      <span className="flex items-center gap-1.5">
                        🖐️ <strong>순서 변경 팁:</strong> 마우스로 ☰ 핸들을 잡고 위아래로 끌어다 놓거나(Drag & Drop), ▲/▼ 버튼을 눌러 인스타 피드 순서를 자유롭게 조절할 수 있습니다.
                      </span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse min-w-[750px]">
                        <thead>
                          <tr className="bg-[#F8F9FD] border-b border-[#EEF0F5] text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                            <th className="py-4 px-4 w-12 text-center">드래그</th>
                            <th className="py-4 px-4 w-24 text-center">순서</th>
                            <th className="py-4 px-6 w-24">이미지</th>
                            <th className="py-4 px-6">게시글 본문 요약</th>
                            <th className="py-4 px-6 w-28 text-center">메인 노출</th>
                            <th className="py-4 px-6 w-44">링크 주소</th>
                            <th className="py-4 px-6 w-28">게시일</th>
                            <th className="py-4 px-6 w-28 text-center">관리</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs">
                          {localInstaList.length === 0 ? (
                            <tr>
                              <td colSpan={8} className="py-12 text-center font-bold text-slate-400">
                                등록된 인스타그램 게시물이 없습니다.
                              </td>
                            </tr>
                          ) : (
                            localInstaList.map((item, index) => {
                              const isDragging = draggedInstaIndex === index;
                              const isDragOver = dragOverInstaIndex === index;
                              return (
                                <tr
                                  key={item._id}
                                  draggable
                                  onDragStart={(e) => handleInstaDragStart(e, index)}
                                  onDragOver={(e) => handleInstaDragOver(e, index)}
                                  onDrop={(e) => handleInstaDrop(e, index)}
                                  onDragEnd={() => {
                                    setDraggedInstaIndex(null);
                                    setDragOverInstaIndex(null);
                                  }}
                                  className={`transition-all select-none ${
                                    isDragging
                                      ? "opacity-30 bg-amber-100/80 border-y-2 border-dashed border-[#FED422]"
                                      : isDragOver
                                      ? "bg-amber-50 border-y-2 border-[#FED422]"
                                      : "hover:bg-slate-50"
                                  }`}
                                >
                                  {/* Drag Handle */}
                                  <td className="py-4 px-4 text-center">
                                    <div className="inline-flex items-center justify-center p-1.5 text-slate-400 hover:text-[#0F172A] hover:bg-slate-200/50 rounded-lg cursor-grab active:cursor-grabbing transition-colors" title="드래그하여 순서 변경">
                                      <GripVertical size={18} />
                                    </div>
                                  </td>

                                  {/* Order with Move Buttons */}
                                  <td className="py-4 px-4 text-center">
                                    <div className="flex items-center justify-center gap-1">
                                      <span className="font-extrabold text-[#0F172A] text-xs min-w-[1.25rem]">
                                        {item.orderIndex || index + 1}
                                      </span>
                                      <div className="flex flex-col gap-0.5">
                                        <button
                                          type="button"
                                          disabled={index === 0}
                                          onClick={() => handleInstaMove(index, "up")}
                                          className="p-0.5 text-slate-400 hover:text-[#0F172A] disabled:opacity-20 disabled:hover:text-slate-400 cursor-pointer border-0"
                                          title="위로 이동"
                                        >
                                          <ArrowUp size={11} />
                                        </button>
                                        <button
                                          type="button"
                                          disabled={index === localInstaList.length - 1}
                                          onClick={() => handleInstaMove(index, "down")}
                                          className="p-0.5 text-slate-400 hover:text-[#0F172A] disabled:opacity-20 disabled:hover:text-slate-400 cursor-pointer border-0"
                                          title="아래로 이동"
                                        >
                                          <ArrowDown size={11} />
                                        </button>
                                      </div>
                                    </div>
                                  </td>

                                  {/* Image */}
                                  <td className="py-4 px-6">
                                    <div className="w-14 h-14 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center shadow-2xs">
                                      <img 
                                        src={optimizeCloudinaryUrl(getInstagramThumbnailUrl(item.img, item.link))} 
                                        alt="Insta 썸네일" 
                                        className="w-full h-full object-cover" 
                                        onError={(e) => {
                                          (e.currentTarget as HTMLImageElement).src = "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784555518/4344223e-1040-4413-9233-bf6b98fe0412.png";
                                        }}
                                      />
                                    </div>
                                  </td>

                                  {/* Text Summary */}
                                  <td className="py-4 px-6">
                                    <p className="font-bold text-[#0F172A] line-clamp-2 leading-relaxed max-w-md">
                                      {item.text}
                                    </p>
                                  </td>

                                  {/* Main Flag Toggle */}
                                  <td className="py-4 px-6 text-center">
                                    <button
                                      type="button"
                                      onClick={() => handleToggleInstaMain(item)}
                                      className={`px-3 py-1.5 rounded-md font-extrabold text-[10px] transition-all cursor-pointer border-0 shadow-2xs inline-flex items-center justify-center gap-1 ${
                                        item.isMain
                                          ? "bg-[#FED422] text-[#0F172A] font-black"
                                          : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                                      }`}
                                      title={item.isMain ? "클릭 시 메인 노출 해제" : "클릭 시 메인 노출로 지정 (최대 4개)"}
                                    >
                                      {item.isMain ? "★ 메인 노출" : "☆ 미노출"}
                                    </button>
                                  </td>

                                  {/* Link */}
                                  <td className="py-4 px-6">
                                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-[#0F172A] hover:underline font-medium break-all">
                                      {item.link}
                                    </a>
                                  </td>

                                  {/* Date */}
                                  <td className="py-4 px-6 text-slate-500 font-bold">{item.date}</td>

                                  {/* Actions */}
                                  <td className="py-4 px-6 text-center">
                                    <div className="flex items-center justify-center gap-1.5">
                                      <button
                                        type="button"
                                        onClick={() => handleOpenInstaEdit(item)}
                                        className="p-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 border-0 transition-all font-bold text-[10px] cursor-pointer shadow-2xs"
                                        title="수정"
                                      >
                                        수정
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteInstagram(item._id)}
                                        className="p-1.5 rounded-md bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-500 border-0 transition-all font-bold text-[10px] cursor-pointer shadow-2xs"
                                        title="삭제"
                                      >
                                        삭제
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Form Modal for Creating/Editing Instagram Feed */}
                  {isInstaModalOpen && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-fadeIn">
                      <div className="w-full max-w-xl bg-white border-0 rounded-lg overflow-hidden shadow-2xl max-h-[90vh] flex flex-col font-sans">
                        <div className="px-7 py-5 bg-[#FED422] text-[#0F172A] flex justify-between items-center shrink-0 shadow-2xs">
                          <div>
                            <h3 className="font-black text-base sm:text-lg text-[#0F172A]">
                              {instaId ? "📸 인스타 연동 피드 수정" : "📸 신규 인스타 피드 등록"}
                            </h3>
                            <p className="text-xs text-[#0F172A]/80 font-bold mt-0.5">브랜드 페이지에 연동할 인스타그램 게시물을 관리합니다.</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="hidden sm:inline-block text-[10px] font-black tracking-wider text-[#0F172A] uppercase px-3 py-1 rounded-md bg-black/5">
                              인스타그램 피드
                            </span>
                            <button
                              type="button"
                              onClick={() => setIsInstaModalOpen(false)}
                              className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 text-[#0F172A] transition-all flex items-center justify-center border-0 cursor-pointer"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        </div>

                        <form onSubmit={handleSaveInstagram} className="p-6 sm:p-7 overflow-y-auto space-y-4 text-left text-xs sm:text-sm flex-1 bg-[#f9fafb]">
                          {/* Card 1: Feed Link & Image */}
                          <div className="bg-white rounded-lg p-5 border border-neutral-200/90 shadow-2xs border-l-[5px] border-l-amber-500 space-y-4">
                            <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5">
                              <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs">
                                  🔗
                                </div>
                                <span className="text-xs font-black text-[#0F172A] tracking-tight">게시물 링크 및 미디어</span>
                              </div>
                              <span className="bg-amber-50 text-amber-700 border border-amber-200/80 text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-0.5 rounded-md">
                                링크 및 썸네일
                              </span>
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-xs font-extrabold text-[#0F172A]">게시물 실제 링크 URL <span className="text-red-500">*</span></label>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  required
                                  value={instaLink}
                                  onChange={async (e) => {
                                    const url = e.target.value;
                                    setInstaLink(url);
                                    if (url.includes("instagram.com") || url.includes("instagr.am")) {
                                      try {
                                        const res = await fetch(`/api/instagram-thumb?url=${encodeURIComponent(url)}`);
                                        const data = await res.json();
                                        if (data.success && data.thumbnailUrl) {
                                          setInstaImg(data.thumbnailUrl);
                                        } else {
                                          setInstaImg(getInstagramThumbnailUrl(url));
                                        }
                                      } catch {
                                        setInstaImg(getInstagramThumbnailUrl(url));
                                      }
                                    }
                                  }}
                                  placeholder="https://www.instagram.com/p/xxxx 또는 reels/xxxx"
                                  className="w-full bg-[#F1F4F8] border-0 rounded-lg px-4 py-3 text-xs font-extrabold text-[#0F172A] placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-amber-500/20 transition-all outline-none shadow-2xs"
                                />
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-xs font-extrabold text-[#0F172A]">썸네일 이미지 URL (또는 로컬 업로드) <span className="text-red-500">*</span></label>
                              <div className="flex gap-2 items-center">
                                <input
                                  type="text"
                                  required
                                  value={instaImg}
                                  onChange={(e) => setInstaImg(e.target.value)}
                                  placeholder="https://res.cloudinary.com/... 이미지 주소"
                                  className="flex-1 bg-[#F1F4F8] border-0 rounded-lg px-4 py-3 text-xs font-extrabold text-[#0F172A] placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-amber-500/20 transition-all outline-none shadow-2xs"
                                />
                                <div className="relative shrink-0">
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={async (e) => {
                                      const file = e.target.files?.[0];
                                      if (!file) return;
                                      try {
                                        const formData = new FormData();
                                        formData.append("file", file);
                                        formData.append("upload_preset", "120pie_preset");
                                        const res = await fetch("https://api.cloudinary.com/v1_1/lyjyvy54/image/upload", {
                                          method: "POST",
                                          body: formData
                                        });
                                        const data = await res.json();
                                        if (data.secure_url) {
                                          setInstaImg(data.secure_url);
                                        }
                                      } catch (err) {
                                        console.error("Cloudinary Upload Error:", err);
                                      }
                                    }}
                                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                                  />
                                  <button
                                    type="button"
                                    className="px-3.5 py-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-all border-0 cursor-pointer shadow-2xs"
                                  >
                                    파일 업로드
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Card 2: Feed Content & Date */}
                          <div className="bg-white rounded-lg p-5 border border-neutral-200/90 shadow-2xs border-l-[5px] border-l-blue-500 space-y-4">
                            <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5">
                              <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                                  📝
                                </div>
                                <span className="text-xs font-black text-[#0F172A] tracking-tight">게시글 본문 및 게시일자</span>
                              </div>
                              <span className="bg-blue-50 text-blue-700 border border-blue-200/80 text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-0.5 rounded-md">
                                상세 본문
                              </span>
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-xs font-extrabold text-[#0F172A]">게시글 본문 요약 (노출 텍스트)</label>
                              <textarea
                                rows={3}
                                value={instaText}
                                onChange={(e) => setInstaText(e.target.value)}
                                placeholder="인스타그램에 등록된 게시글 본문 일부를 입력하세요."
                                className="w-full bg-[#F1F4F8] border-0 rounded-lg px-4 py-3 text-xs font-extrabold text-[#0F172A] placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none resize-none shadow-2xs"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                <label className="text-xs font-extrabold text-[#0F172A]">게시 일자</label>
                                <input
                                  type="date"
                                  value={instaDate}
                                  onChange={(e) => setInstaDate(e.target.value)}
                                  className="w-full bg-[#F1F4F8] border-0 rounded-lg px-4 py-3 text-xs font-extrabold text-[#0F172A] focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none shadow-2xs"
                                />
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-xs font-extrabold text-[#0F172A]">노출 순서 (작을수록 앞순위)</label>
                                <input
                                  type="number"
                                  value={instaOrder}
                                  onChange={(e) => setInstaOrder(parseInt(e.target.value) || 1)}
                                  className="w-full bg-[#F1F4F8] border-0 rounded-lg px-4 py-3 text-xs font-extrabold text-[#0F172A] focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none shadow-2xs"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Submit Footer */}
                          <div className="px-1 py-2 flex items-center justify-between border-t border-slate-100 pt-4">
                            <button
                              type="button"
                              onClick={() => setIsInstaModalOpen(false)}
                              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-extrabold text-xs rounded-lg transition-all cursor-pointer border-0 shadow-2xs"
                            >
                              취소
                            </button>
                            <button
                              type="submit"
                              className="px-7 py-2.5 bg-[#FED422] hover:bg-[#e5be1f] text-[#0F172A] font-black text-xs rounded-lg transition-all shadow-2xs active:scale-95 cursor-pointer border-0 flex items-center gap-2"
                            >
                              <span>{instaId ? "인스타 피드 정보 수정" : "신규 인스타 피드 등록"}</span>
                              <ArrowRight size={14} />
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}

                </div>
              )}

            </div>
          )}

          {/* ==========================================
              MENU: 9. SETTINGS MENU
             ========================================== */}
          {currentMenu === "setting" && (
            <div className="space-y-6 animate-fadeIn">
              
              <div>
                <h2 className="text-xl font-black text-[#0F172A]">본사 시스템 통합 설정</h2>
                <p className="text-xs text-slate-400 font-bold mt-1">
                  본사 어드민 최고 관리자 로그인 계정 및 점주 발주 주문의 배송 상태값 목록을 유연하게 제어합니다.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                
                {/* 1. Account Management (계정관리) */}
                <div className="bg-white border-0 rounded-lg p-6 sm:p-8 shadow-md space-y-5">
                  <h3 className="font-black text-sm text-[#0F172A] border-b border-slate-100 pb-3 flex items-center gap-2">
                    <UserCheck size={18} className="text-[#FED422]" />
                    본사 최고 관리자 계정 변경 관리
                  </h3>
                  
                  <form onSubmit={handleUpdateAdminAccount} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-extrabold text-[#0F172A]">관리자 ID *</label>
                      <input 
                        type="text"
                        value={adminIdSetting}
                        onChange={(e) => setAdminIdSetting(e.target.value)}
                        required
                        className="w-full bg-[#F1F4F8] border-0 rounded-lg px-4 py-3 text-xs font-extrabold text-[#0F172A] focus:bg-white focus:ring-2 focus:ring-amber-500/20 transition-all outline-none shadow-2xs"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-xs font-extrabold text-[#0F172A]">새 비밀번호 (미입력 시 기존 비밀번호 유지)</label>
                      <input 
                        type="password"
                        placeholder="새 비밀번호 입력"
                        value={adminPwSetting}
                        onChange={(e) => setAdminPwSetting(e.target.value)}
                        className="w-full bg-[#F1F4F8] border-0 rounded-lg px-4 py-3 text-xs font-extrabold text-[#0F172A] placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-amber-500/20 transition-all outline-none shadow-2xs"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-extrabold text-[#0F172A]">새 비밀번호 확인</label>
                      <input 
                        type="password"
                        placeholder="새 비밀번호 동일 입력"
                        value={adminPwSettingConfirm}
                        onChange={(e) => setAdminPwSettingConfirm(e.target.value)}
                        className="w-full bg-[#F1F4F8] border-0 rounded-lg px-4 py-3 text-xs font-extrabold text-[#0F172A] placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-amber-500/20 transition-all outline-none shadow-2xs"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 bg-[#FED422] hover:bg-[#e5be1f] text-[#0F172A] font-black text-xs rounded-lg transition-all shadow-2xs flex items-center justify-center gap-1.5 border-0 active:scale-95 cursor-pointer"
                    >
                      <Check size={14} />
                      관리자 계정 정보 적용
                    </button>
                  </form>
                </div>

                {/* 2. Delivery Status Values Management (배송상태값 관리) */}
                <div className="bg-white border-0 rounded-lg p-6 sm:p-8 shadow-md space-y-5">
                  <h3 className="font-black text-sm text-[#0F172A] border-b border-slate-100 pb-3 flex items-center gap-2">
                    <Truck size={18} className="text-[#FED422]" />
                    주문 배송 상태값(태그) 관리
                  </h3>
                  
                  <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
                    가맹점 발주 현황판 및 어드민에서 사용될 배송 상태의 명칭들을 자유롭게 추가 및 수정할 수 있습니다.<br />
                    <span className="text-[#0F172A] font-extrabold">* 단, [주문완료] 및 [배송완료]는 코어 시스템 상태값으로 유지되므로 삭제할 수 없습니다.</span>
                  </p>

                  <form onSubmit={handleAddDeliveryStatus} className="flex gap-2">
                    <input 
                      type="text"
                      placeholder="신규 배송 상태값 입력 (e.g. 세관통과중, 배송대기 등)"
                      value={newStatusName}
                      onChange={(e) => setNewStatusName(e.target.value)}
                      required
                      className="flex-1 bg-[#F1F4F8] border-0 rounded-lg px-4 py-3 text-xs font-extrabold text-[#0F172A] placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-amber-500/20 outline-none transition-all shadow-2xs"
                    />
                    <button 
                      type="submit"
                      className="px-5 py-3 bg-[#FED422] hover:bg-[#e5be1f] text-[#0F172A] font-black text-xs rounded-lg transition-all whitespace-nowrap border-0 shadow-2xs active:scale-95 cursor-pointer"
                    >
                      추가
                    </button>
                  </form>

                  <div className="space-y-3 pt-2">
                    <label className="text-[11px] font-extrabold text-slate-500 block">현재 활성화된 배송 상태값 리스트</label>
                    <div className="flex flex-wrap gap-2 bg-[#F8F9FD] border border-[#EEF0F5] p-4 rounded-lg">
                      {deliveryStatuses.map((st) => {
                        const isCore = ["주문완료", "배송완료"].includes(st);
                        return (
                          <span 
                            key={st}
                            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-extrabold whitespace-nowrap border-0 shadow-2xs ${
                              isCore 
                                ? "bg-[#FED422] text-[#0F172A] font-black" 
                                : "bg-white text-slate-700"
                            }`}
                          >
                            {st}
                            {!isCore && (
                              <button
                                type="button"
                                onClick={() => handleDeleteDeliveryStatus(st)}
                                className="hover:text-red-500 text-slate-400 font-extrabold ml-1 cursor-pointer border-0"
                                title="삭제"
                              >
                                &times;
                              </button>
                            )}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex justify-end pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={handleResetDeliveryStatuses}
                      className="px-4 py-2 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold border-0 transition-colors cursor-pointer shadow-2xs"
                    >
                      상태값 기본값으로 리셋
                    </button>
                  </div>
                </div>

                {/* 3. Status Colors Settings (진행상태 버튼 색상 설정) */}
                <div className="bg-white border-0 rounded-lg p-6 sm:p-8 shadow-md space-y-5">
                  <h3 className="font-black text-sm text-[#0F172A] border-b border-slate-100 pb-3 flex items-center gap-2">
                    <Palette size={18} className="text-[#FED422]" />
                    진행상태 버튼 색상 설정
                  </h3>
                  
                  <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
                    주문 현황판 및 각 가맹점 포털 페이지에서 사용될 진행상태 버튼(태그)의 색상을 개별로 설정할 수 있습니다.
                  </p>

                  <div className="space-y-3 pt-2 max-h-[300px] overflow-y-auto pr-1">
                    {Array.from(new Set([
                      "주문완료",
                      "입금대기",
                      "결제완료",
                      "배송준비중",
                      "배송중",
                      "배송완료",
                      "주문취소",
                      ...deliveryStatuses
                    ])).map((status) => {
                      const currentColor = statusColors[status] || "pink";
                      return (
                        <div key={status} className="flex items-center justify-between gap-4 bg-[#F8F9FD] p-3.5 rounded-lg border border-[#EEF0F5]">
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-extrabold text-[#0F172A]">{status}</span>
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-extrabold shadow-2xs ${
                              (() => {
                                const preset = COLOR_PRESETS[currentColor as keyof typeof COLOR_PRESETS] || COLOR_PRESETS.pink;
                                return `${preset.bg} ${preset.text} ${preset.border}`;
                              })()
                            }`}>
                              표시
                            </span>
                          </div>
                          
                          <select
                            value={currentColor}
                            onChange={(e) => {
                              const newColors = { ...statusColors, [status]: e.target.value };
                              setStatusColors(newColors);
                            }}
                            className="bg-[#F1F4F8] border-0 rounded-md px-3 py-2 text-xs font-extrabold text-[#0F172A] focus:bg-white focus:ring-2 focus:ring-amber-500/20 cursor-pointer outline-none shadow-2xs transition-all"
                          >
                            {Object.entries(COLOR_PRESETS).map(([key, value]) => (
                              <option key={key} value={key}>
                                {value.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      localStorage.setItem("120_status_colors", JSON.stringify(statusColors));
                      window.dispatchEvent(new Event("storage"));
                      triggerToast("진행상태 버튼 색상 설정이 성공적으로 저장되었습니다!");
                    }}
                    className="w-full py-3.5 bg-[#FED422] hover:bg-[#e5be1f] text-[#0F172A] font-black text-xs rounded-lg transition-all shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer border-0 active:scale-95"
                  >
                    <Check size={14} />
                    색상 설정 저장하기
                  </button>
                </div>

                {/* 4. Naver Map API Key Integration (외부 지도 API 연동) */}
                <div className="bg-white border-0 rounded-lg p-6 sm:p-8 shadow-md space-y-5 lg:col-span-2">
                  <h3 className="font-black text-sm text-[#0F172A] border-b border-slate-100 pb-3 flex items-center gap-2">
                    <Map size={18} className="text-[#FED422]" />
                    가맹점 현황 지도 연동 설정 (네이버 지도 API)
                  </h3>
                  
                  <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
                    공식 가맹점 안내 페이지의 지도를 구글 맵 대신 국내 환경에 친화적인 <strong>네이버 지도(Naver Maps)</strong>로 직접 연동할 수 있습니다.<br />
                    네이버 클라우드 플랫폼에서 발급받은 Client ID를 등록하면 실시간 지점 좌표 변환 및 120겹파이 로고 이미지 마커 핀 표시 기능이 활성화됩니다.<br />
                    <span className="text-[#0F172A] font-extrabold">* 미등록 상태인 경우, 가맹점 안내 페이지는 구글 지도를 통해 안전하게 자동 대체 작동합니다.</span>
                  </p>

                  <form onSubmit={handleUpdateNaverClientId} className="space-y-4 max-w-xl">
                    <div className="space-y-2">
                      <label className="text-xs font-extrabold text-[#0F172A]">네이버 클라우드 플랫폼 Client ID</label>
                      <input 
                        type="text"
                        placeholder="네이버 클라우드 플랫폼에서 발급받은 Client ID를 입력하세요"
                        value={naverClientIdSetting}
                        onChange={(e) => setNaverClientIdSetting(e.target.value)}
                        className="w-full bg-[#F1F4F8] border-0 rounded-lg px-4 py-3 text-xs font-extrabold text-[#0F172A] placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-amber-500/20 transition-all outline-none shadow-2xs"
                      />
                      <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                        발급처: <a href="https://console.ncloud.com" target="_blank" rel="noopener noreferrer" className="text-amber-600 underline font-bold">Naver Cloud Platform Console</a><br />
                        ⚙️ <strong>플랫폼 설정 방법</strong>: AI·NAVER API &gt; Application 등록 &gt; <strong>Web 서비스 URL</strong>에 아래 도메인을 등록해주세요.<br />
                        👉 등록할 사이트 도메인: <code className="bg-slate-100 text-[#0F172A] px-1.5 py-0.5 rounded font-mono font-bold text-[11px]">{typeof window !== "undefined" ? window.location.origin : "https://120pie-new.vercel.app"}</code>
                      </p>
                    </div>

                    <button
                      type="submit"
                      className="py-3.5 px-6 bg-[#FED422] hover:bg-[#e5be1f] text-[#0F172A] font-black text-xs rounded-lg transition-all shadow-2xs flex items-center gap-1.5 border-0 active:scale-95 cursor-pointer"
                    >
                      <Check size={14} />
                      네이버 지도 API 설정 저장
                    </button>
                  </form>
                </div>

                {/* 4. 약관 및 정책 설정 */}
                <div className="bg-white border-0 rounded-lg p-6 sm:p-8 shadow-md space-y-5 lg:col-span-2">
                  <h3 className="font-black text-sm text-[#0F172A] border-b border-slate-100 pb-3 flex items-center gap-2">
                    <FileText size={18} className="text-[#FED422]" />
                    이용약관, 개인정보처리방침 및 환불정책 설정
                  </h3>
                  
                  <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
                    홈페이지 하단 푸터 및 주요 안내에 사용되는 서비스 이용약관, 개인정보처리방침, 환불정책 내용을 관리합니다.<br />
                    작성된 내용은 사이트 전반의 푸터 메뉴를 통해 연동되어 노출됩니다.
                  </p>

                  <form onSubmit={handleSavePolicies} className="space-y-5">
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-extrabold text-[#0F172A] block">이용약관</label>
                        <textarea 
                          value={termsOfUseSetting}
                          onChange={(e) => setTermsOfUseSetting(e.target.value)}
                          rows={12}
                          required
                          className="w-full bg-[#F1F4F8] border-0 rounded-lg px-4 py-3 text-xs font-extrabold text-[#0F172A] focus:bg-white focus:ring-2 focus:ring-amber-500/20 font-mono leading-relaxed resize-y shadow-2xs outline-none"
                          placeholder="이용약관 내용을 입력해 주세요"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-extrabold text-[#0F172A] block">개인정보처리방침</label>
                        <textarea 
                          value={privacyPolicySetting}
                          onChange={(e) => setPrivacyPolicySetting(e.target.value)}
                          rows={12}
                          required
                          className="w-full bg-[#F1F4F8] border-0 rounded-lg px-4 py-3 text-xs font-extrabold text-[#0F172A] focus:bg-white focus:ring-2 focus:ring-amber-500/20 font-mono leading-relaxed resize-y shadow-2xs outline-none"
                          placeholder="개인정보처리방침 내용을 입력해 주세요"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-extrabold text-[#0F172A] block">환불정책</label>
                        <textarea 
                          value={refundPolicySetting}
                          onChange={(e) => setRefundPolicySetting(e.target.value)}
                          rows={12}
                          required
                          className="w-full bg-[#F1F4F8] border-0 rounded-lg px-4 py-3 text-xs font-extrabold text-[#0F172A] focus:bg-white focus:ring-2 focus:ring-amber-500/20 font-mono leading-relaxed resize-y shadow-2xs outline-none"
                          placeholder="환불정책 내용을 입력해 주세요"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="py-3.5 px-6 bg-[#FED422] hover:bg-[#e5be1f] text-[#0F172A] font-black text-xs rounded-lg transition-all shadow-2xs flex items-center gap-1.5 border-0 active:scale-95 cursor-pointer"
                    >
                      <Check size={14} />
                      약관 및 정책 설정 저장
                    </button>
                  </form>
                </div>

                {/* 5. 실시간 SMS 발송 자동 연동 및 문구 설정 */}
                {smsSettings && (
                  <div className="bg-white border-0 rounded-lg p-6 sm:p-8 shadow-md space-y-6 lg:col-span-2">
                    <h3 className="font-black text-sm text-[#0F172A] border-b border-slate-100 pb-3 flex items-center gap-2">
                      <MessageSquare size={18} className="text-[#FED422]" />
                      5. 실시간 SMS 발송 자동 연동 및 문구 설정 (알리고 API 연동)
                    </h3>
                    
                    <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
                      가맹점 신청, 자재 주문, 1:1 문의 등 주요 이벤트 발생 시 지정된 고객 및 본사 담당자에게 실시간 문자(SMS/LMS)를 자동 전송합니다.<br />
                      국내 최고 SMS 대행사인 <strong>알리고(Aligo)</strong> 서비스 API를 공식 지원하며, 각 구분별로 고객용/관리자용 템플릿과 활성화 여부를 따로 설정할 수 있습니다.
                    </p>

                    <form onSubmit={handleUpdateSmsSettings} className="space-y-6">
                      
                      {/* A. 알리고 API 연동 Key 관리 */}
                      <div className="bg-[#F8F9FD] border border-[#EEF0F5] rounded-lg p-5 space-y-4">
                        <h4 className="text-xs font-black text-[#0F172A] border-b border-slate-100 pb-2">
                          🔌 알리고 SMS API 연동 자격증명 설정
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-extrabold text-[#0F172A]">
                          <div className="space-y-1.5">
                            <span>알리고 API Key (발송용 비밀키) *</span>
                            <input 
                              type="password"
                              placeholder="알리고에서 발급받은 API Key를 입력하세요"
                              value={smsSettings.aligoKey || ""}
                              onChange={(e) => setSmsSettings({
                                ...smsSettings,
                                aligoKey: e.target.value
                              })}
                              className="w-full bg-[#F1F4F8] border-0 rounded-lg px-4 py-3 text-xs font-extrabold text-[#0F172A] placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-amber-500/20 transition-all outline-none shadow-2xs"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <span>알리고 User ID (계정 아이디) *</span>
                            <input 
                              type="text"
                              placeholder="알리고 아이디를 입력하세요"
                              value={smsSettings.aligoUserId || ""}
                              onChange={(e) => setSmsSettings({
                                ...smsSettings,
                                aligoUserId: e.target.value
                              })}
                              className="w-full bg-[#F1F4F8] border-0 rounded-lg px-4 py-3 text-xs font-extrabold text-[#0F172A] placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-amber-500/20 transition-all outline-none shadow-2xs"
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                          <label className="flex items-center gap-1.5 cursor-pointer text-xs font-extrabold text-[#0F172A] select-none">
                            <input 
                              type="checkbox"
                              checked={smsSettings.aligoTestMode !== false}
                              onChange={(e) => setSmsSettings({
                                ...smsSettings,
                                aligoTestMode: e.target.checked
                              })}
                              className="w-4 h-4 text-amber-500 rounded cursor-pointer"
                            />
                            테스트 모드 활성화 (체크 시 충전 포인트 미차감, 실제 문자는 전송되지 않음)
                          </label>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-relaxed font-semibold">
                          * 알리고 API Key와 User ID를 올바르게 설정하면 실제 가맹점 신청 및 발주 시 알리고 서버를 경유하여 자동 전송됩니다.<br />
                          * 테스트 모드가 체크되어 있으면 실제 과금이 발생하지 않고 전송 성공 로그만 반환됩니다. 실무에 적용하실 때는 해제해 주세요.
                        </p>
                      </div>

                      {/* C. 알리고 API 연동 테스트 발송 (신설) */}
                      <div className="bg-[#F8F9FD] border border-[#EEF0F5] rounded-lg p-5 space-y-4">
                        <h4 className="text-xs font-black text-[#0F172A] border-b border-slate-100 pb-2 flex items-center gap-1.5">
                          🧪 알리고 API 실시간 발송 테스트
                        </h4>
                        <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                          입력된 알리고 API Key와 User ID가 올바른지 실제 문자를 발송하여 테스트합니다.<br />
                          * 테스트 모드가 <strong>활성화</strong>된 상태이면 실제 문자가 가지 않고 로그만 반환되므로, 실제 전송을 확인하려면 위 테스트 모드를 <strong>해제</strong>하고 진행해 주세요.
                        </p>
                        <div className="flex flex-wrap items-end gap-3 text-xs font-extrabold text-[#0F172A]">
                          <div className="space-y-1.5 flex-1 min-w-[150px]">
                            <span>발신 번호 (알리고에 등록된 번호)</span>
                            <input 
                              type="text"
                              placeholder="알리고에 등록된 발신 번호를 적어주세요"
                              value={testSenderPhone}
                              onChange={(e) => setTestSenderPhone(formatPhoneNumber(e.target.value))}
                              className="w-full bg-[#F1F4F8] border-0 rounded-lg px-4 py-3 text-xs font-extrabold text-[#0F172A] placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-amber-500/20 transition-all outline-none shadow-2xs"
                            />
                          </div>
                          <div className="space-y-1.5 flex-1 min-w-[150px]">
                            <span>테스트 수신 번호</span>
                            <input 
                              type="text"
                              placeholder="010-0000-0000"
                              value={testReceiverPhone}
                              onChange={(e) => setTestReceiverPhone(formatPhoneNumber(e.target.value))}
                              className="w-full bg-[#F1F4F8] border-0 rounded-lg px-4 py-3 text-xs font-extrabold text-[#0F172A] placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-amber-500/20 transition-all outline-none shadow-2xs"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={handleTestSendSms}
                            disabled={isTestingSms}
                            className="px-5 py-3 bg-[#FED422] hover:bg-[#e5be1f] text-[#0F172A] text-xs font-black rounded-lg transition-all shadow-2xs flex items-center gap-1.5 h-[42px] disabled:opacity-50 cursor-pointer border-0 shrink-0"
                          >
                            {isTestingSms ? "전송 중..." : "테스트 문자 발송"}
                          </button>
                        </div>
                      </div>

                      {/* B. 각 5대 구분별 설정 리스트 */}
                      <div className="grid grid-cols-1 gap-6">
                        {[
                          { key: "store_reg", label: "🏢 가맹점 등록 신청", vars: "{storeId}, {storeName}, {owner}, {phone}", custLabel: "신청 점주 수신" },
                          { key: "order_card", label: "💳 주문완료 (신용카드)", vars: "{storeName}, {orderId}, {amount}", custLabel: "발주 점주 수신" },
                          { key: "order_cash", label: "🏦 주문완료 (무통장입금)", vars: "{storeName}, {orderId}, {amount}", custLabel: "발주 점주 수신" },
                          { key: "consultation", label: "📞 홈페이지 무료 가맹상담문의", vars: "{name}, {phone}, {storeType}", custLabel: "상담 신청 고객 수신" },
                          { key: "inquiry_1to1", label: "💬 가맹점 전용 1:1 상담문의 접수", vars: "{storeName}, {title}, {category}", custLabel: "접수 점주 수신" }
                        ].map((evt) => {
                          const config = smsSettings[evt.key];
                          if (!config) return null;
                          return (
                            <div key={evt.key} className="border border-[#EEF0F5] rounded-lg p-6 bg-[#F8F9FD] shadow-2xs space-y-4">
                              <h4 className="text-xs font-black text-[#0F172A] border-b border-slate-200/60 pb-2 flex items-center gap-1.5 justify-between">
                                <span className="flex items-center gap-1.5">{evt.label}</span>
                                <span className="text-[10px] text-slate-400 font-medium">변수: {evt.vars}</span>
                              </h4>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* 고객용 */}
                                <div className="space-y-3.5 bg-white border border-[#EEF0F5] p-4 rounded-lg relative shadow-2xs">
                                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                                    <span className="text-xs font-extrabold text-[#0F172A]">고객용 ({evt.custLabel})</span>
                                    <label className="flex items-center gap-1.5 cursor-pointer text-xs font-extrabold text-[#0F172A] select-none">
                                      <input 
                                        type="checkbox"
                                        checked={config.customer.isActive}
                                        onChange={(e) => setSmsSettings({
                                          ...smsSettings,
                                          [evt.key]: {
                                            ...config,
                                            customer: { ...config.customer, isActive: e.target.checked }
                                          }
                                        })}
                                        className="w-4 h-4 text-amber-500 rounded cursor-pointer"
                                      />
                                      활성화
                                    </label>
                                  </div>
                                  <div className="grid grid-cols-2 gap-3 text-xs font-extrabold text-[#0F172A]">
                                    <div className="space-y-1">
                                      <span>발신 번호</span>
                                      <input 
                                        type="text"
                                        value={config.customer.sender}
                                        onChange={(e) => setSmsSettings({
                                          ...smsSettings,
                                          [evt.key]: {
                                            ...config,
                                            customer: { ...config.customer, sender: formatPhoneNumber(e.target.value) }
                                          }
                                        })}
                                        className="w-full bg-[#F1F4F8] border-0 rounded-md px-3 py-2 text-xs font-extrabold text-[#0F172A] shadow-2xs outline-none"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <span>수신 번호</span>
                                      <input 
                                        type="text"
                                        disabled
                                        value="해당 수신자 (자동)"
                                        className="w-full bg-slate-100 border-0 text-slate-400 rounded-md px-3 py-2 text-xs font-extrabold cursor-not-allowed"
                                      />
                                    </div>
                                  </div>
                                  <div className="space-y-1">
                                    <span className="text-xs font-extrabold text-[#0F172A]">메시지 템플릿</span>
                                    <textarea 
                                      value={config.customer.template}
                                      onChange={(e) => setSmsSettings({
                                        ...smsSettings,
                                        [evt.key]: {
                                          ...config,
                                          customer: { ...config.customer, template: e.target.value }
                                        }
                                      })}
                                      rows={3}
                                      className="w-full bg-[#F1F4F8] border-0 rounded-md px-3 py-2.5 text-xs font-extrabold text-[#0F172A] leading-relaxed resize-none shadow-2xs outline-none"
                                    />
                                  </div>
                                </div>

                                {/* 관리자용 */}
                                <div className="space-y-3.5 bg-white border border-[#EEF0F5] p-4 rounded-lg relative shadow-2xs">
                                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                                    <span className="text-xs font-extrabold text-[#0F172A]">관리자용 (본사 알림 수신)</span>
                                    <label className="flex items-center gap-1.5 cursor-pointer text-xs font-extrabold text-[#0F172A] select-none">
                                      <input 
                                        type="checkbox"
                                        checked={config.admin.isActive}
                                        onChange={(e) => setSmsSettings({
                                          ...smsSettings,
                                          [evt.key]: {
                                            ...config,
                                            admin: { ...config.admin, isActive: e.target.checked }
                                          }
                                        })}
                                        className="w-4 h-4 text-amber-500 rounded cursor-pointer"
                                      />
                                      활성화
                                    </label>
                                  </div>
                                  <div className="space-y-2.5">
                                    <div className="grid grid-cols-2 gap-3 text-xs font-extrabold text-[#0F172A]">
                                      <div className="space-y-1">
                                        <span>발신 번호</span>
                                        <input 
                                          type="text"
                                          value={config.admin.sender}
                                          onChange={(e) => setSmsSettings({
                                            ...smsSettings,
                                            [evt.key]: {
                                              ...config,
                                              admin: { ...config.admin, sender: formatPhoneNumber(e.target.value) }
                                            }
                                          })}
                                          className="w-full bg-[#F1F4F8] border-0 rounded-md px-3 py-2 text-xs font-extrabold text-[#0F172A] shadow-2xs outline-none"
                                        />
                                      </div>
                                      <div className="space-y-1">
                                        <span>수신 번호 추가</span>
                                        <div className="flex gap-1.5">
                                          <input 
                                            type="text"
                                            placeholder="010-0000-0000"
                                            value={newAdminPhoneInputs[evt.key] || ""}
                                            onChange={(e) => setNewAdminPhoneInputs({
                                              ...newAdminPhoneInputs,
                                              [evt.key]: formatPhoneNumber(e.target.value)
                                            })}
                                            className="min-w-0 flex-1 bg-[#F1F4F8] border-0 rounded-md px-3 py-2 text-xs font-extrabold text-[#0F172A] placeholder-slate-400 shadow-2xs outline-none"
                                          />
                                          <button 
                                            type="button"
                                            onClick={() => addAdminReceiver(evt.key)}
                                            className="px-3 py-2 bg-[#FED422] hover:bg-[#e5be1f] text-[#0F172A] text-xs font-black rounded-md shrink-0 cursor-pointer border-0 shadow-2xs"
                                          >
                                            추가
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    {/* 수신자 번호 리스트 태그 */}
                                    <div className="space-y-1">
                                      <span className="text-xs font-extrabold text-[#0F172A]">수신 번호 리스트 ({(config.admin.receivers || []).length}개)</span>
                                      <div className="flex flex-wrap gap-1.5 bg-[#F8F9FD] border border-[#EEF0F5] p-2.5 rounded-md min-h-[42px] max-h-[100px] overflow-y-auto">
                                        {(config.admin.receivers || []).map((num: string) => (
                                          <span key={num} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border-0 shadow-2xs rounded-lg text-xs font-extrabold text-[#0F172A]">
                                            {num}
                                            <button 
                                              type="button" 
                                              onClick={() => removeAdminReceiver(evt.key, num)}
                                              className="text-slate-400 hover:text-red-500 font-extrabold shrink-0 border-0 bg-transparent cursor-pointer"
                                            >
                                              &times;
                                            </button>
                                          </span>
                                        ))}
                                        {(config.admin.receivers || []).length === 0 && (
                                          <span className="text-xs text-slate-400 font-bold m-auto">등록된 수신자가 없습니다.</span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="space-y-1">
                                    <span className="text-xs font-extrabold text-[#0F172A]">메시지 템플릿</span>
                                    <textarea 
                                      value={config.admin.template}
                                      onChange={(e) => setSmsSettings({
                                        ...smsSettings,
                                        [evt.key]: {
                                          ...config,
                                          admin: { ...config.admin, template: e.target.value }
                                        }
                                      })}
                                      rows={3}
                                      className="w-full bg-[#F1F4F8] border-0 rounded-md px-3 py-2.5 text-xs font-extrabold text-[#0F172A] leading-relaxed resize-none shadow-2xs outline-none"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* 저장 버튼 */}
                      <div className="flex justify-end border-t border-slate-100 pt-4">
                        <button
                          type="submit"
                          className="py-3.5 px-6 bg-[#FED422] hover:bg-[#e5be1f] text-[#0F172A] font-black text-xs rounded-lg transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer border-0 active:scale-95"
                        >
                          <Check size={14} />
                          SMS 알림 및 템플릿 설정 일괄 저장
                        </button>
                      </div>
                    </form>
                  </div>
                )}

              </div>

            </div>
          )}

          {/* ==========================================
              MENU: GALLERY MANAGEMENT MENU
             ========================================== */}
          {currentMenu === "gallery" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-xl font-black text-[#0F172A]">본사 공식 갤러리 관리</h2>
                  <p className="text-xs text-slate-400 font-bold mt-1">
                    점주 전용 홍보자료, 신메뉴 연출컷 및 가맹점 인테리어 공식 이미지 데이터를 관리합니다.
                  </p>
                </div>
                <button
                  onClick={handleOpenAddGalleryModal}
                  className="px-5 py-3 bg-[#FED422] hover:bg-[#e5be1f] text-[#0F172A] font-black text-xs rounded-lg shadow-2xs hover:scale-[1.02] transition-all flex items-center gap-1.5 shrink-0 cursor-pointer border-0"
                >
                  <Plus size={14} />
                  신규 이미지 등록
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left: Category Management Panel (4 cols) */}
                <div className="lg:col-span-4 bg-white border-0 rounded-lg p-6 shadow-md space-y-6">
                  <h3 className="font-black text-sm text-[#0F172A] border-b border-slate-100 pb-3 flex items-center gap-2">
                    <BookOpen size={16} className="text-[#FED422]" />
                    카테고리 관리
                  </h3>

                  <form onSubmit={handleAddGalleryCategory} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="신규 카테고리 입력"
                      value={newGalleryCategoryName}
                      onChange={(e) => setNewGalleryCategoryName(e.target.value)}
                      required
                      className="flex-1 bg-[#F1F4F8] border-0 rounded-lg px-4 py-3 text-xs font-extrabold text-[#0F172A] placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-amber-500/20 outline-none transition-all shadow-2xs"
                    />
                    <button
                      type="submit"
                      className="px-5 py-3 bg-[#FED422] hover:bg-[#e5be1f] text-[#0F172A] font-black text-xs rounded-lg transition-all whitespace-nowrap border-0 shadow-2xs active:scale-95 cursor-pointer"
                    >
                      추가
                    </button>
                  </form>

                  <div className="space-y-3">
                    <label className="text-[11px] font-extrabold text-slate-500 block">등록된 카테고리 리스트 ({galleryCategories.length}개)</label>
                    <div className="space-y-2 p-3 bg-[#F8F9FD] border border-[#EEF0F5] rounded-lg min-h-[120px] max-h-[300px] overflow-y-auto">
                      {galleryCategories.map((cat, idx) => (
                        <div
                          key={cat}
                          className="flex items-center justify-between px-4 py-2.5 rounded-md text-xs font-extrabold bg-white text-[#0F172A] border-0 shadow-2xs group"
                        >
                          <span>{cat}</span>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleAdjustGalleryCategoryOrder(idx, "up")}
                              disabled={idx === 0}
                              className="w-6 h-6 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-30 text-[9px] transition-colors cursor-pointer border-0"
                              title="위로 이동"
                            >
                              ▲
                            </button>
                            <button
                              type="button"
                              onClick={() => handleAdjustGalleryCategoryOrder(idx, "down")}
                              disabled={idx === galleryCategories.length - 1}
                              className="w-6 h-6 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-30 text-[9px] transition-colors cursor-pointer border-0"
                              title="아래로 이동"
                            >
                              ▼
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteGalleryCategory(cat)}
                              className="w-6 h-6 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-500 ml-1 font-bold text-sm leading-none transition-colors cursor-pointer border-0"
                              title="카테고리 삭제"
                            >
                              &times;
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold leading-relaxed">
                      * 카테고리를 삭제하면, 해당 분류로 지정되었던 이미지들은 자동으로 '기타' 분류로 강제 이동 배정됩니다.
                    </p>
                  </div>
                </div>

                {/* Right: Images Grid List (8 cols) */}
                <div className="lg:col-span-8 space-y-6">
                  {/* Category Selection Tabs Bar */}
                  <div className="flex flex-wrap gap-1.5 p-1.5 bg-slate-100 rounded-lg shadow-2xs border-0">
                    <button
                      onClick={() => setSelectedGalleryCategory("전체")}
                      className={`px-4 py-2.5 rounded-md text-xs font-extrabold transition-all border-0 cursor-pointer ${
                        selectedGalleryCategory === "전체"
                          ? "bg-[#FED422] text-[#0F172A] shadow-2xs font-black"
                          : "text-slate-600 hover:text-[#0F172A]"
                      }`}
                    >
                      전체 ({galleryItems.length})
                    </button>
                    {galleryCategories.map((cat) => {
                      const count = galleryItems.filter((item) => item.category === cat).length;
                      return (
                        <button
                          key={cat}
                          onClick={() => setSelectedGalleryCategory(cat)}
                          className={`px-4 py-2.5 rounded-md text-xs font-extrabold transition-all border-0 cursor-pointer ${
                            selectedGalleryCategory === cat
                              ? "bg-[#FED422] text-[#0F172A] shadow-2xs font-black"
                              : "text-slate-600 hover:text-[#0F172A]"
                          }`}
                        >
                          {cat} ({count})
                        </button>
                      );
                    })}
                  </div>

                  {/* Grid layout */}
                  {galleryItems.filter(item => selectedGalleryCategory === "전체" || item.category === selectedGalleryCategory).length === 0 ? (
                    <div className="bg-white border-0 rounded-lg p-16 text-center flex flex-col items-center justify-center shadow-md">
                      <ImageIcon size={40} className="text-slate-300 mb-3 animate-pulse" />
                      <p className="text-xs font-bold text-slate-400">해당 카테고리에 등록된 갤러리 이미지가 없습니다.</p>
                      <button
                        onClick={handleOpenAddGalleryModal}
                        className="mt-4 px-5 py-2.5 bg-[#FED422] hover:bg-[#e5be1f] text-[#0F172A] font-black text-xs rounded-lg transition-all shadow-2xs border-0 cursor-pointer"
                      >
                        신규 이미지 추가하기
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                      {galleryItems
                        .filter(item => selectedGalleryCategory === "전체" || item.category === selectedGalleryCategory)
                        .map((item) => (
                          <div
                            key={item.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, item.id)}
                            onDragOver={(e) => handleDragOver(e, item.id)}
                            onDragEnd={handleDragEnd}
                            onDrop={(e) => handleDrop(e, item.id)}
                            className={`bg-white border-0 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 flex flex-col group cursor-move select-none p-4 space-y-3 ${
                              draggedId === item.id
                                ? "opacity-40 scale-95 ring-2 ring-[#FED422]"
                                : ""
                            }`}
                          >
                            {/* Image Container */}
                            <div className="relative aspect-video w-full overflow-hidden bg-slate-100 rounded-lg border-0">
                              <img
                                src={item.url}
                                alt={item.name}
                                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                              />
                              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-extrabold bg-slate-100 text-slate-700 shadow-2xs border-0">
                                {item.category}
                              </span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleFeatured(item);
                                }}
                                className={`absolute top-3 right-3 px-2.5 py-1 rounded-md text-[10px] font-extrabold flex items-center gap-1 shadow-2xs transition-all duration-200 cursor-pointer border-0 ${
                                  item.isFeatured
                                    ? "bg-[#FED422] text-[#0F172A] font-black"
                                    : "bg-slate-100/90 text-slate-600 hover:bg-white hover:text-[#0F172A]"
                                }`}
                                title={item.isFeatured ? "대표 이미지 해제" : "대표 이미지 지정 (최대 9개)"}
                              >
                                {item.isFeatured ? "★ 대표 이미지" : "☆ 대표 지정"}
                              </button>
                            </div>

                            {/* Details body */}
                            <div className="flex-1 flex flex-col justify-between space-y-3 pt-1">
                              <div className="space-y-1">
                                <h4 className="font-extrabold text-xs text-[#0F172A] line-clamp-2 leading-relaxed" title={item.name}>
                                  {item.name}
                                </h4>
                                <span className="text-[10px] text-slate-400 font-bold block">
                                  등록일: {item.regDate}
                                </span>
                              </div>

                              <div className="flex gap-2 pt-2 border-t border-slate-100">
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditGalleryModal(item)}
                                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold rounded-md transition-all border-0 shadow-2xs cursor-pointer"
                                >
                                  수정
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteGalleryItem(item.id, item.name)}
                                  className="px-3 py-2 bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-md transition-all flex items-center justify-center border-0 shadow-2xs cursor-pointer"
                                  title="이미지 삭제"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          </div>
        </main>
      </div>

      {/* ==========================================
          MODALS & FORM POPUPS
         ========================================== */}

      {/* 0. Register/Edit Gallery Item Modal (Stage Flow Tech Card Style) */}
      {showGalleryModal && (
        <div
          className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setShowGalleryModal(false)}
        >
          <div
            className="w-full max-w-lg bg-white border border-neutral-200/80 rounded-lg overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] flex flex-col max-h-[90vh] font-sans"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Stage Flow Yellow Header */}
            <div className="px-7 py-5 bg-[#FED422] text-[#0F172A] flex justify-between items-center shrink-0 shadow-2xs">
              <div>
                <h3 className="text-base sm:text-lg font-black text-[#0F172A] tracking-tight">
                  {selectedGalleryItem ? "갤러리 이미지 정보 수정" : "본사 공식 이미지 신규 등록"}
                </h3>
                <p className="text-xs text-[#0F172A]/80 font-bold mt-0.5">가맹 매장에 공유할 갤러리 이미지를 등록합니다.</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline-block text-[10px] font-black tracking-wider text-[#0F172A] uppercase px-3 py-1 rounded-md bg-black/5">
                  갤러리 설정
                </span>
                <button
                  type="button"
                  onClick={() => setShowGalleryModal(false)}
                  className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 text-[#0F172A] transition-all flex items-center justify-center border-0 cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <form onSubmit={handleGallerySubmit} className="p-6 sm:p-7 overflow-y-auto space-y-4 text-xs sm:text-sm flex-1 bg-[#f9fafb]">
              {/* Card 1: Name & Category (Amber Accent) */}
              <div className="bg-white rounded-lg p-5 border border-neutral-200/90 shadow-2xs border-l-[5px] border-l-amber-500 space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs">
                      🖼️
                    </div>
                    <span className="text-xs font-black text-[#0F172A] tracking-tight">이미지 명칭 및 분류</span>
                  </div>
                  <span className="bg-amber-50 text-amber-700 border border-amber-200/80 text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-0.5 rounded-md">
                    기본 정보
                  </span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-[#0F172A]">이미지명 *</label>
                  <input
                    type="text"
                    placeholder="이미지를 구별할 이름을 입력해 주세요 (e.g. 로제미트파이 연출컷)"
                    value={galleryItemName}
                    onChange={(e) => setGalleryItemName(e.target.value)}
                    required
                    className="w-full bg-[#F1F4F8] border-0 rounded-lg px-4 py-3 text-xs font-medium text-[#0F172A] placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-amber-500/20 transition-all outline-none shadow-2xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-[#0F172A]">카테고리 분류 *</label>
                  <select
                    value={galleryItemCategory}
                    onChange={(e) => setGalleryItemCategory(e.target.value)}
                    required
                    className="w-full bg-[#F1F4F8] border-0 rounded-lg px-4 py-3 text-xs font-medium text-[#0F172A] focus:bg-white focus:ring-2 focus:ring-amber-500/20 cursor-pointer outline-none transition-all shadow-2xs"
                  >
                    {galleryCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Card 2: Upload File (Blue Accent) */}
              <div className="bg-white rounded-lg p-5 border border-neutral-200/90 shadow-2xs border-l-[5px] border-l-blue-500 space-y-3">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                      📁
                    </div>
                    <span className="text-xs font-black text-[#0F172A] tracking-tight">이미지 파일 업로드</span>
                  </div>
                  <span className="bg-blue-50 text-blue-700 border border-blue-200/80 text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-0.5 rounded-md">
                    파일 등록
                  </span>
                </div>

                <div className="flex items-center gap-3 bg-[#F1F4F8] border-0 rounded-lg p-3 shadow-2xs">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleGalleryImageUpload}
                    className="text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-[10px] file:font-extrabold file:bg-slate-200 file:text-slate-700 cursor-pointer flex-1"
                  />
                </div>
                {galleryItemUrl && (
                  <div className="p-3 bg-[#f8f9fa] border border-neutral-200/80 rounded-md flex items-center gap-3">
                    <img src={galleryItemUrl} alt="미리보기" className="w-12 h-12 rounded-lg object-cover" />
                    <span className="text-[10px] text-neutral-400 font-mono truncate flex-1">{galleryItemUrl}</span>
                  </div>
                )}
              </div>

              {/* Stage Flow Footer Bar */}
              <div className="px-1 py-2 flex items-center justify-between border-t border-neutral-200/60 pt-4">
                <div className="flex items-center gap-2 text-[10px] font-mono font-extrabold text-neutral-400 uppercase tracking-widest">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>GALLERY READY</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowGalleryModal(false)}
                    className="px-5 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 font-extrabold text-xs rounded-md transition-all cursor-pointer border-0"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="px-7 py-2.5 bg-[#FED422] hover:bg-[#e5be1f] text-[#0F172A] font-black text-xs rounded-md transition-all shadow-md active:scale-95 cursor-pointer border-0 flex items-center gap-2"
                  >
                    <span>{selectedGalleryItem ? "수정사항 저장" : "갤러리 이미지 추가"}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* 1.5. Consultation Inquiry Detail Modal */}
      {selectedConsultation && (
        <div 
          className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSelectedConsultation(null)}
        >
          <div 
            className="w-full max-w-xl bg-white border border-neutral-200/80 rounded-lg overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] max-h-[90vh] flex flex-col font-sans"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Stage Flow Yellow Header */}
            <div className="px-7 py-5 bg-[#FED422] text-[#0F172A] flex justify-between items-center shrink-0 shadow-2xs">
              <div>
                <h3 className="text-base sm:text-lg font-black text-[#0F172A] tracking-tight">📞 창업 상담문의 상세 내역</h3>
                <p className="text-xs text-[#0F172A]/80 font-bold mt-0.5">신청자가 제출한 창업 상담 문의 정보를 확인합니다.</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline-block text-[10px] font-mono font-bold tracking-widest text-[#0F172A] uppercase px-2.5 py-1 rounded-md bg-black/5">
                  CONSULTATION
                </span>
                <button 
                  type="button"
                  onClick={() => setSelectedConsultation(null)} 
                  className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 text-[#0F172A] transition-all flex items-center justify-center border-0 cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="p-6 sm:p-7 overflow-y-auto space-y-4 text-xs sm:text-sm bg-[#f9fafb]">
              {/* Card 1: Applicant Details (Amber Accent) */}
              <div className="bg-white rounded-lg p-5 border border-neutral-200/90 shadow-2xs border-l-[5px] border-l-amber-500 space-y-3 font-semibold text-slate-600">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5">
                  <span className="text-xs font-black text-[#0F172A] tracking-tight">신청인 및 연락처 정보</span>
                  <span className="bg-amber-50 text-amber-700 border border-amber-200/80 text-[10px] font-mono font-black tracking-wider uppercase px-2.5 py-0.5 rounded-md">
                    APPLICANT
                  </span>
                </div>
                <div className="flex justify-between border-b border-neutral-100 pb-2">
                  <span>신청인</span>
                  <span className="text-[#0F172A] font-black">{selectedConsultation.name}</span>
                </div>
                <div className="flex justify-between border-b border-neutral-100 pb-2">
                  <span>연락처</span>
                  <span className="text-[#0F172A] font-black flex items-center gap-1.5">
                    {selectedConsultation.phone}
                    <button
                      type="button"
                      onClick={() => handleCopyToClipboard(selectedConsultation.phone, "연락처")}
                      className="p-1 hover:text-[#0F172A] text-slate-400 bg-neutral-100 rounded cursor-pointer transition-colors border-0"
                      title="복사하기"
                    >
                      <Copy size={11} />
                    </button>
                  </span>
                </div>
                <div className="flex justify-between border-b border-neutral-100 pb-2">
                  <span>도입 희망 유형</span>
                  <span className="bg-blue-50 text-blue-700 border border-blue-200/80 font-black px-2.5 py-0.5 rounded-md text-[10px]">
                    {selectedConsultation.storeType}
                  </span>
                </div>
                {selectedConsultation.existingStoreName && (
                  <div className="flex justify-between border-b border-neutral-100 pb-2">
                    <span>기존 매장명</span>
                    <span className="text-[#0F172A] font-black">{selectedConsultation.existingStoreName}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>신청일</span>
                  <span className="text-[#0F172A] font-black">{selectedConsultation.regDate}</span>
                </div>
              </div>

              {/* Card 2: Message Content (Blue Accent) */}
              <div className="bg-white rounded-lg p-5 border border-neutral-200/90 shadow-2xs border-l-[5px] border-l-blue-500 space-y-3">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5">
                  <span className="text-xs font-black text-[#0F172A] tracking-tight">상세 문의 내용</span>
                  <span className="bg-blue-50 text-blue-700 border border-blue-200/80 text-[10px] font-mono font-black tracking-wider uppercase px-2.5 py-0.5 rounded-md">
                    MESSAGE
                  </span>
                </div>
                <div className="bg-[#e2e8f0] p-4 rounded-md min-h-[120px] max-h-[240px] overflow-y-auto border border-neutral-200/80">
                  <p className="text-xs sm:text-sm text-[#0F172A] leading-relaxed whitespace-pre-wrap font-semibold">
                    {selectedConsultation.message || "입력된 문의 내용이 없습니다."}
                  </p>
                </div>
              </div>

              {/* Stage Flow Footer */}
              <div className="px-1 py-2 flex items-center justify-between border-t border-neutral-200/60 pt-3">
                <div className="flex items-center gap-2 text-[10px] font-mono font-extrabold text-neutral-400 uppercase tracking-widest">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>RECORD ACTIVE</span>
                </div>
                <button 
                  type="button"
                  onClick={() => setSelectedConsultation(null)}
                  className="px-6 py-2.5 rounded-md bg-[#0F172A] hover:bg-slate-800 text-xs font-black text-white transition-colors border-0 cursor-pointer shadow-xs"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 1. Inquiry Reply Writer Modal (Stage Flow Tech Card Style) */}
      {selectedInquiry && (
        <div 
          className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSelectedInquiry(null)}
        >
          <div 
            className="w-full max-w-xl bg-white border border-neutral-200/80 rounded-lg overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] max-h-[90vh] flex flex-col font-sans"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Stage Flow Yellow Header */}
            <div className="px-7 py-5 bg-[#FED422] text-[#0F172A] flex justify-between items-center shrink-0 shadow-2xs">
              <div>
                <h3 className="text-base sm:text-lg font-black tracking-tight text-[#0F172A]">💬 가맹점 1:1 문의 답변 작성</h3>
                <p className="text-xs text-[#0F172A]/80 font-bold mt-0.5">가맹점주 문의건에 대해 본사 공식 답변을 작성합니다.</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline-block text-[10px] font-mono font-bold tracking-widest text-[#0F172A] uppercase px-2.5 py-1 rounded-md bg-black/5">
                  INQUIRY REPLY
                </span>
                <button 
                  type="button"
                  onClick={() => setSelectedInquiry(null)} 
                  className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 text-[#0F172A] transition-all flex items-center justify-center border-0 cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmitAnswer} className="p-6 sm:p-7 overflow-y-auto space-y-4 flex-1 text-xs sm:text-sm bg-[#f9fafb]">
              {/* Card 1: Original Inquiry (Blue Accent) */}
              <div className="bg-white rounded-lg p-5 border border-neutral-200/90 shadow-2xs border-l-[5px] border-l-blue-500 space-y-2">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                  <span className="bg-blue-50 text-blue-700 border border-blue-200/80 text-[10px] font-mono font-black tracking-wider uppercase px-2.5 py-0.5 rounded-md">
                    {selectedInquiry.category}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-neutral-400">접수일자: {selectedInquiry.date}</span>
                </div>
                <h4 className="font-black text-xs text-[#0F172A] leading-tight pt-1">{selectedInquiry.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap font-medium">{selectedInquiry.content}</p>
              </div>

              {/* Card 2: Answer Input (Emerald Accent) */}
              <div className="bg-white rounded-lg p-5 border border-neutral-200/90 shadow-2xs border-l-[5px] border-l-emerald-500 space-y-3">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                  <span className="text-xs font-black text-[#0F172A]">본사 공식 답변 내용 기입</span>
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[10px] font-mono font-black tracking-wider uppercase px-2.5 py-0.5 rounded-md">
                    OFFICIAL ANSWER
                  </span>
                </div>
                <textarea 
                  rows={5}
                  placeholder="가맹점주님이 현장에서 직면한 상황에 대해 구체적인 조치 결과(AS 일정 예약, 오배송 무료 재출고 완료 등)를 친절하고 명확하게 입력해 주시기 바랍니다."
                  value={inquiryAnswerText}
                  onChange={(e) => setInquiryAnswerText(e.target.value)}
                  required
                  className="w-full bg-[#F1F4F8] border-0 rounded-lg px-4 py-3 text-xs font-medium text-[#0F172A] placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 resize-none transition-all outline-none shadow-2xs"
                />
              </div>

              {/* Stage Flow Footer Bar */}
              <div className="px-1 py-2 flex items-center justify-between border-t border-neutral-200/60 pt-4">
                <div className="flex items-center gap-2 text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>HQ RESPONSE READY</span>
                </div>
                <button 
                  type="submit"
                  className="px-7 py-2.5 bg-[#FED422] hover:bg-[#e5be1f] text-[#0F172A] font-black text-xs rounded-md transition-all shadow-2xs cursor-pointer border-0 flex items-center gap-2"
                >
                  <span>가맹 지원 답변 공식 등록</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Notice Creation Modal (Stage Flow Tech Card Style) */}
      {showNoticeModal && (
        <div 
          className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={handleCloseNoticeModal}
        >
          <div 
            className="w-full max-w-xl bg-white border border-neutral-200/80 rounded-lg overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] max-h-[90vh] flex flex-col font-sans"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Stage Flow Yellow Header */}
            <div className="px-7 py-5 bg-[#FED422] text-[#0F172A] flex justify-between items-center shrink-0 shadow-2xs">
              <div>
                <h3 className="text-base sm:text-lg font-black tracking-tight text-[#0F172A]">
                  {selectedNotice ? "가맹 공지사항 상세조회 및 수정" : "신규 가맹 공지사항 정식 작성"}
                </h3>
                <p className="text-xs text-[#0F172A]/80 font-bold mt-0.5">전체 가맹점에 공지할 주요 가이드라인을 작성합니다.</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline-block text-[10px] font-black tracking-wider text-[#0F172A] uppercase px-3 py-1 rounded-md bg-black/5">
                  공지사항 작성 양식
                </span>
                <button 
                  type="button"
                  onClick={handleCloseNoticeModal} 
                  className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 text-[#0F172A] transition-all flex items-center justify-center border-0 cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <form onSubmit={handleCreateNotice} className="p-6 sm:p-7 overflow-y-auto space-y-4 flex-1 text-xs sm:text-sm bg-[#f9fafb]">
              {/* Card 1: Notice Tag & Title (Amber Accent) */}
              <div className="bg-white rounded-lg p-5 border border-neutral-200/90 shadow-2xs border-l-[5px] border-l-amber-500 space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs">
                      📢
                    </div>
                    <span className="text-xs font-black text-[#0F172A] tracking-tight">공지 구분 및 제목</span>
                  </div>
                  <span className="bg-amber-50 text-amber-700 border border-amber-200/80 text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-0.5 rounded-md">
                    기본 설정
                  </span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-extrabold text-[#0F172A]">공지 태그 선택</label>
                  <select 
                    value={newNoticeTag}
                    onChange={(e) => setNewNoticeTag(e.target.value as any)}
                    className="w-full bg-[#F1F4F8] border-0 rounded-lg px-4 py-3 text-xs font-medium text-[#0F172A] focus:bg-white focus:ring-2 focus:ring-amber-500/20 cursor-pointer outline-none transition-all shadow-2xs"
                  >
                    <option value="필독">필독 (긴급 법정 안전 위생 점검 등)</option>
                    <option value="일반">일반 안내 사항</option>
                    <option value="이벤트">마케팅 / 런칭 이벤트 공지</option>
                    <option value="물류">물류 배송 / 공휴일 정기 일정 조정</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-extrabold text-[#0F172A]">공지 제목</label>
                  <input 
                    type="text"
                    placeholder="예시) 하절기 위생 합동 검열 대비 본부 가이드라인 수칙"
                    value={newNoticeTitle}
                    onChange={(e) => setNewNoticeTitle(e.target.value)}
                    required
                    className="w-full bg-[#F1F4F8] border-0 rounded-lg px-4 py-3 text-xs font-medium text-[#0F172A] placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-amber-500/20 outline-none transition-all shadow-2xs"
                  />
                </div>
              </div>

              {/* Card 2: Notice Body Content (Blue Accent) */}
              <div className="bg-white rounded-lg p-5 border border-neutral-200/90 shadow-2xs border-l-[5px] border-l-blue-500 space-y-3">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                      📜
                    </div>
                    <span className="text-xs font-black text-[#0F172A] tracking-tight">상세 공지 본문 내용</span>
                  </div>
                  <span className="bg-blue-50 text-blue-700 border border-blue-200/80 text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-0.5 rounded-md">
                    본문 내용
                  </span>
                </div>

                <textarea 
                  rows={5}
                  placeholder="가맹점 전체에 전달할 상세 수칙 및 안내 내용을 명확히 적어주세요. 점주전용 포털 공지사항실에 실시간 동기화되어 배포됩니다."
                  value={newNoticeContent}
                  onChange={(e) => setNewNoticeContent(e.target.value)}
                  required
                  className="w-full bg-[#F1F4F8] border-0 rounded-lg px-4 py-3 text-xs font-medium text-[#0F172A] placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-500/20 resize-none transition-all outline-none shadow-2xs"
                />
              </div>

              {/* Stage Flow Footer Bar */}
              <div className="px-1 py-2 flex items-center justify-between border-t border-neutral-200/60 pt-4">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>전체 가맹점 공지 준비 완료</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleCloseNoticeModal}
                    className="px-5 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 font-extrabold text-xs rounded-md transition-all cursor-pointer border-0 shadow-2xs"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="px-7 py-2.5 bg-[#FED422] hover:bg-[#e5be1f] text-[#0F172A] font-black text-xs rounded-md transition-all shadow-2xs active:scale-95 cursor-pointer border-0 flex items-center gap-2"
                  >
                    <span>{selectedNotice ? "공지사항 수정 저장" : "공지사항 공식 배포"}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </form>

            {selectedNotice && selectedNotice.title.includes("배달앱 메뉴 리뉴얼") && (
              <div className="p-6 border-t border-slate-100 bg-[#F8FAFC] space-y-3 shrink-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-sm text-[#0F172A]">가맹점별 배달앱 계정 제출 현황</h4>
                  <span className="text-xs font-bold text-[#0F172A] bg-amber-100 border-0 px-3 py-1 rounded-md">
                    총 {submittedCredentials?.length || 0}건 접수
                  </span>
                </div>
                
                <div className="border border-slate-200/60 rounded-lg overflow-hidden bg-white max-h-[220px] overflow-y-auto shadow-2xs">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#F8FAFC] border-b border-slate-200/60 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                        <th className="p-3">가맹점명</th>
                        <th className="p-3">배달의민족 계정</th>
                        <th className="p-3">쿠팡이츠 계정</th>
                        <th className="p-3">제출 일시</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {!submittedCredentials || submittedCredentials.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="p-5 text-center text-slate-400 font-bold">아직 제출된 가맹점 계정 정보가 없습니다.</td>
                        </tr>
                      ) : (
                        submittedCredentials.map((cred: any) => (
                          <tr key={cred._id} className="hover:bg-[#fff9fb] transition-colors">
                            <td className="p-3 font-extrabold text-[#2d2026]">{cred.storeName}</td>
                            <td className="p-3 text-[#735965] font-semibold">
                              <div>ID: <span className="text-[#2d2026] font-bold">{cred.baeminId}</span></div>
                              <div className="text-[11px] mt-0.5">PW: <span className="text-[#bf3e67] font-bold">{cred.baeminPw}</span></div>
                            </td>
                            <td className="p-3 text-[#735965] font-semibold">
                              <div>ID: <span className="text-[#2d2026] font-bold">{cred.coupangId}</span></div>
                              <div className="text-[11px] mt-0.5">PW: <span className="text-[#bf3e67] font-bold">{cred.coupangPw}</span></div>
                            </td>
                            <td className="p-3 text-[#735965] font-bold whitespace-nowrap">{cred.submittedAt}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. Store Registration / Detailed Modal (Stage Flow Tech Card Style) */}
      {showStoreModal && (
        <div 
          className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setShowStoreModal(false)}
        >
          <div 
            className="w-full max-w-2xl bg-white border border-neutral-200/80 rounded-lg overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] max-h-[90vh] flex flex-col font-sans"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Stage Flow Yellow Header */}
            <div className="px-7 py-5 bg-[#FED422] text-[#0F172A] flex justify-between items-center shrink-0 shadow-2xs">
              <div>
                <h3 className="text-base sm:text-lg font-black text-[#0F172A] tracking-tight flex items-center gap-2">
                  <span>🏢 {selectedStore ? `가맹점 상세 정보 및 편집 [${selectedStore.name}]` : "가맹점 신규 등록 대장 작성"}</span>
                </h3>
                <p className="text-xs text-[#0F172A]/80 font-bold mt-0.5">
                  가맹점 기본 계정 및 가동 모듈을 관리합니다.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline-block text-[10px] font-black tracking-widest text-[#0F172A] uppercase px-2.5 py-1 rounded-md bg-black/5">
                  가맹점 관리
                </span>
                <button 
                  type="button"
                  onClick={() => setShowStoreModal(false)} 
                  className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-500 hover:text-neutral-900 transition-all flex items-center justify-center border-0 cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <form onSubmit={handleCreateOrUpdateStore} className="p-6 sm:p-7 overflow-y-auto space-y-4 flex-1 text-xs sm:text-sm bg-[#f9fafb]">
              {/* Card 1: Account Info (Amber Accent) */}
              <div className="bg-white rounded-lg p-5 border border-neutral-200/90 shadow-2xs border-l-[5px] border-l-amber-500 space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs">
                      🔑
                    </div>
                    <span className="text-xs font-black text-[#0F172A] tracking-tight">로그인 계정 및 보안</span>
                  </div>
                  <span className="bg-amber-50 text-amber-700 border border-amber-200/80 text-[10px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-md">
                    필수 입력
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-extrabold text-[#0F172A]">로그인 계정 ID *</label>
                    <input 
                      type="text"
                      placeholder="계정 아이디를 입력해 주세요 (영문/숫자)"
                      value={storeLoginId}
                      onChange={(e) => setStoreLoginId(e.target.value)}
                      required
                      disabled={!!selectedStore}
                      className="w-full bg-[#F1F4F8] disabled:bg-[#F1F4F8] disabled:opacity-75 border-0 rounded-lg px-4 py-3 text-xs font-medium text-[#0F172A] placeholder-slate-400 focus:outline-none transition-all shadow-2xs"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-extrabold text-[#0F172A]">가맹점명 *</label>
                    <input 
                      type="text"
                      placeholder="예시) 120겹파이 강남역삼점"
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      required
                      className="w-full bg-[#F1F4F8] border-0 rounded-lg px-4 py-3 text-xs font-medium text-[#0F172A] placeholder-slate-400 focus:outline-none transition-all shadow-2xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-extrabold text-[#0F172A]">비밀번호 *</label>
                    <input 
                      type="text"
                      placeholder="비밀번호 설정"
                      value={storePw}
                      onChange={(e) => setStorePw(e.target.value)}
                      required
                      className="w-full bg-[#F1F4F8] border-0 rounded-lg px-4 py-3 text-xs font-medium text-[#0F172A] placeholder-slate-400 focus:outline-none transition-all shadow-2xs"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-extrabold text-[#0F172A]">비밀번호 확인 *</label>
                    <input 
                      type="text"
                      placeholder="동일 비밀번호 재입력"
                      value={storePwConfirm}
                      onChange={(e) => setStorePwConfirm(e.target.value)}
                      required
                      className="w-full bg-[#F1F4F8] border-0 rounded-lg px-4 py-3 text-xs font-medium text-[#0F172A] placeholder-slate-400 focus:outline-none transition-all shadow-2xs"
                    />
                  </div>
                </div>
              </div>

              {/* Card 2: Owner Info (Blue Accent) */}
              <div className="bg-white rounded-lg p-5 border border-neutral-200/90 shadow-2xs border-l-[5px] border-l-blue-500 space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                      👤
                    </div>
                    <span className="text-xs font-black text-[#0F172A] tracking-tight">점주 정보 및 연락처</span>
                  </div>
                  <span className="bg-blue-50 text-blue-700 border border-blue-200/80 text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-0.5 rounded-md">
                    점주 정보
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-extrabold text-[#0F172A]">점주 실명 *</label>
                    <input 
                      type="text"
                      placeholder="점주 대표자 성함"
                      value={storeOwner}
                      onChange={(e) => setStoreOwner(e.target.value)}
                      required
                      className="w-full bg-[#F1F4F8] border-0 rounded-lg px-4 py-3 text-xs font-medium text-[#0F172A] placeholder-slate-400 focus:outline-none transition-all shadow-2xs"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-extrabold text-[#0F172A]">연락처 (하이픈 자동입력) *</label>
                    <input 
                      type="text"
                      placeholder="휴대폰 혹은 대표번호"
                      value={storePhone}
                      onChange={handlePhoneInputChange}
                      required
                      className="w-full bg-[#F1F4F8] border-0 rounded-lg px-4 py-3 text-xs font-medium text-[#0F172A] placeholder-slate-400 focus:outline-none transition-all shadow-2xs"
                    />
                  </div>
                </div>
              </div>

              {/* Card 3: Location & Status (Emerald Accent) */}
              <div className="bg-white rounded-lg p-5 border border-neutral-200/90 shadow-2xs border-l-[5px] border-l-emerald-500 space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
                      📍
                    </div>
                    <span className="text-xs font-black text-[#0F172A] tracking-tight">거래 상태 및 매장 주소</span>
                  </div>
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-0.5 rounded-md">
                    위치 및 상태
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-extrabold text-[#0F172A]">가맹 거래 상태 구분 *</label>
                    <select 
                      value={storeStatus}
                      onChange={(e) => setStoreStatus(e.target.value as any)}
                      className="w-full bg-[#F1F4F8] border-0 rounded-lg px-4 py-3 text-xs font-medium text-[#0F172A] focus:outline-none cursor-pointer transition-all shadow-2xs"
                    >
                      <option value="승인">승인 (정상 오퍼레이션 가동)</option>
                      <option value="대기">대기 (서류 검토 / 가맹 보류)</option>
                      <option value="보류">보류 (일시적 거래 홀딩)</option>
                      <option value="중지">중지 (본부 차단 / 경고 누적)</option>
                      <option value="취소">취소 (정식 폐점 계약 해지)</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-extrabold text-[#0F172A]">유치 영업 파트너</label>
                    <select 
                      value={storePartnerId}
                      onChange={(e) => setStorePartnerId(e.target.value)}
                      className="w-full bg-[#F1F4F8] border-0 rounded-lg px-4 py-3 text-xs font-medium text-[#0F172A] focus:outline-none cursor-pointer transition-all shadow-2xs"
                    >
                      <option value="">-- 본사 직영 / 파트너 없음 --</option>
                      {convexPartners.map((p: any) => (
                        <option key={p.id} value={p.id}>
                          {p.name} {p.companyName ? `(${p.companyName})` : ""} - {p.id}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-2 md:col-span-2">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-extrabold text-[#0F172A]">가맹 등록일</label>
                      <input 
                        type="date"
                        value={storeRegDate}
                        onChange={(e) => setStoreRegDate(e.target.value)}
                        className="w-full bg-[#F1F4F8] border-0 rounded-lg px-3 py-3 text-xs font-medium text-[#0F172A] focus:outline-none transition-all shadow-2xs"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-extrabold text-[#0F172A]">가맹 해지일</label>
                      <input 
                        type="date"
                        value={storeCancelDate}
                        onChange={(e) => setStoreCancelDate(e.target.value)}
                        className="w-full bg-[#F1F4F8] border-0 rounded-lg px-3 py-3 text-xs font-medium text-[#0F172A] focus:outline-none transition-all shadow-2xs"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="font-extrabold text-[#0F172A] block">가맹 매장 도로명 주소 *</label>
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      placeholder="도로명 주소 검색"
                      value={storeRoadAddress}
                      onChange={(e) => setStoreRoadAddress(e.target.value)}
                      required
                      className="flex-1 bg-[#F1F4F8] border-0 rounded-lg px-4 py-3 text-xs font-medium text-[#0F172A] placeholder-slate-400 focus:outline-none transition-all shadow-2xs"
                    />
                    <button
                      type="button"
                      onClick={() => openDaumPostcode("store")}
                      className="px-5 py-3 bg-[#FED422] hover:bg-[#e5be1f] text-[#0F172A] text-xs font-black rounded-lg transition-all cursor-pointer border-0 shrink-0 shadow-2xs"
                    >
                      주소 검색
                    </button>
                  </div>
                  <input 
                    type="text"
                    placeholder="매장 상세 주소 (e.g. 1층 101호)"
                    value={storeDetailAddress}
                    onChange={(e) => setStoreDetailAddress(e.target.value)}
                    className="w-full bg-[#F1F4F8] border-0 rounded-lg px-4 py-3 text-xs font-medium text-[#0F172A] placeholder-slate-400 focus:outline-none transition-all shadow-2xs"
                  />
                </div>
              </div>

              {/* Card 4: Packages (Neutral Accent) */}
              <div className="bg-white rounded-lg p-5 border border-neutral-200/90 shadow-2xs border-l-[5px] border-l-slate-400 space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs">
                      📦
                    </div>
                    <span className="text-xs font-black text-[#0F172A] tracking-tight">도입 적용 패키지 브랜드 선택</span>
                  </div>
                  <span className="bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-md">
                    적용 패키지
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-[#f8f9fa] border border-neutral-200/80 rounded-md p-4">
                  {["120pie", "egg120", "츄러스120", "떡볶이120", "핫도그120", "120coffee"].map((menuKey) => {
                    const isChecked = storeAdoptionMenu.includes(menuKey);
                    return (
                      <label key={menuKey} className="flex items-center gap-2 cursor-pointer select-none">
                        <input 
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setStoreAdoptionMenu([...storeAdoptionMenu, menuKey]);
                            } else {
                              setStoreAdoptionMenu(storeAdoptionMenu.filter((m) => m !== menuKey));
                            }
                          }}
                          className="w-4 h-4 rounded text-amber-500 border-neutral-300 focus:ring-amber-500"
                        />
                        <span className="text-xs font-bold text-[#0F172A]">{menuKey}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Stage Flow Footer Bar */}
              <div className="px-1 py-2 flex items-center justify-between border-t border-neutral-200/60 pt-4">
                <div className="flex items-center gap-2 text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>시스템 정상 작동 · 본사 가맹점 관리</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowStoreModal(false)}
                    className="px-5 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 font-extrabold text-xs rounded-md transition-all cursor-pointer border-0"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="px-7 py-2.5 bg-[#FED422] hover:bg-[#e5be1f] text-[#0F172A] font-black text-xs rounded-md transition-all shadow-md active:scale-95 cursor-pointer border-0 flex items-center gap-2"
                  >
                    <span>가맹점 정보 저장</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Address Popup Simulator Modal with Real Kakao API Embed (Yellow Header, border-0) */}
      {showAddressPopup && (
        <div 
          className="fixed inset-0 z-[120] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setShowAddressPopup(false)}
        >
          <div 
            className="w-full max-w-lg bg-white border-0 rounded-lg overflow-hidden shadow-2xl flex flex-col h-[600px] max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Yellow Header */}
            <div className="p-6 bg-[#FED422] text-[#0F172A] flex flex-col gap-3 shadow-xs">
              <div className="flex justify-between items-center">
                <h4 className="text-sm sm:text-base font-black text-[#0F172A]">📍 도로명 주소 실시간 검색</h4>
                <button 
                  type="button"
                  onClick={() => setShowAddressPopup(false)} 
                  className="p-2 text-[#0F172A]/80 hover:text-[#0F172A] bg-black/5 hover:bg-black/10 rounded-md transition-all border-0 cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
              
              {/* Dual-Mode Tabs */}
              <div className="flex bg-black/10 p-1 rounded-lg border-0">
                <button
                  type="button"
                  onClick={() => setAddressTab("kakao")}
                  className={`flex-1 py-2 text-xs font-black rounded-md transition-all border-0 cursor-pointer ${
                    addressTab === "kakao" 
                      ? "bg-[#0F172A] text-white shadow-xs" 
                      : "text-[#0F172A]/70 hover:text-[#0F172A]"
                  }`}
                >
                  카카오 우편번호 API
                </button>
                <button
                  type="button"
                  onClick={() => setAddressTab("simulated")}
                  className={`flex-1 py-2 text-xs font-black rounded-md transition-all border-0 cursor-pointer ${
                    addressTab === "simulated" 
                      ? "bg-[#0F172A] text-white shadow-xs" 
                      : "text-[#0F172A]/70 hover:text-[#0F172A]"
                  }`}
                >
                  모의 간편 검색 (대안)
                </button>
              </div>
            </div>

            {/* Content Body based on active tab */}
            {addressTab === "kakao" ? (
              <div className="flex-1 w-full bg-[#F8FAFC] overflow-hidden relative">
                <div 
                  id="daum-postcode-container" 
                  className="w-full h-full"
                ></div>
              </div>
            ) : (
              <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-[#F8FAFC]">
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-[#0F172A] block">지번/도로명 검색어 입력</label>
                  <input
                    type="text"
                    placeholder="예: 테헤란로, 엘에스로, 당동"
                    value={addressSearchKeyword}
                    onChange={(e) => handleAddressSearch(e.target.value)}
                    className="w-full bg-[#F1F5F9] border-0 rounded-lg px-4 py-3 text-xs font-bold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#F5AC00]/50 placeholder-slate-400"
                  />
                </div>
                
                <div className="space-y-2">
                  <span className="text-xs font-extrabold text-[#0F172A] block">검색 결과 목록 ({addressSearchResults.length}건)</span>
                  {addressSearchResults.length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-400 bg-white border border-slate-200/60 rounded-lg font-bold">
                      {addressSearchKeyword.trim() ? "일치하는 주소 후보가 없습니다." : "검색어를 입력하시면 모의 주소 리스트가 노출됩니다."}
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                      {addressSearchResults.map((addr, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            if (addressTarget === "contract") {
                              setContractRoadAddress(addr);
                            } else {
                              setStoreRoadAddress(addr);
                            }
                            setShowAddressPopup(false);
                            triggerToast("모의 주소가 성공적으로 자동 선택 및 입력되었습니다!");
                          }}
                          className="w-full text-left p-3.5 bg-white hover:bg-amber-50 border border-slate-200/80 hover:border-amber-400 rounded-lg text-xs font-bold text-[#0F172A] transition-all cursor-pointer block hover:shadow-2xs"
                        >
                          {addr}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <div className="p-4 bg-neutral-50 text-center border-t border-[#f2ccd7]/60">
              <button 
                type="button"
                onClick={() => setShowAddressPopup(false)}
                className="px-5 py-2.5 rounded-md bg-white border border-[#f2ccd7] text-[11px] font-bold text-[#735965] hover:bg-[#fff1f5] cursor-pointer transition-colors"
              >
                검색 창 닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Product Registration / Edit Modal */}
      {/* 4. Product Registration / Detailed Modal (Stage Flow Tech Card Style) */}
      {showProductModal && (
        <div 
          className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setShowProductModal(false)}
        >
          <div 
            className="w-full max-w-2xl bg-white border border-neutral-200/80 rounded-lg overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] max-h-[90vh] flex flex-col font-sans"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Stage Flow Yellow Header */}
            <div className="px-7 py-5 bg-[#FED422] text-[#0F172A] flex justify-between items-center shrink-0 shadow-2xs">
              <div>
                <h3 className="text-base sm:text-lg font-black text-[#0F172A] tracking-tight flex items-center gap-2">
                  <span>📦 {selectedProduct ? `원/부자재 품목 명세 수정 [${selectedProduct.name}]` : "신규 식재료/부자재 물류 품목 추가"}</span>
                </h3>
                <p className="text-xs text-[#0F172A]/80 font-bold mt-0.5">
                  점주 발주몰에 노출할 제품 정보 및 가격을 설정합니다.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline-block text-[10px] font-black tracking-wider text-[#0F172A] uppercase px-3 py-1 rounded-md bg-black/5">
                  제품 등록 양식
                </span>
                <button 
                  type="button"
                  onClick={() => setShowProductModal(false)} 
                  className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 text-[#0F172A] transition-all flex items-center justify-center border-0 cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <form onSubmit={handleCreateOrUpdateProduct} className="p-6 sm:p-7 overflow-y-auto space-y-4 flex-1 text-xs sm:text-sm bg-[#f9fafb]">
              {/* Card 1: Product Basic (Amber Accent) */}
              <div className="bg-white rounded-lg p-5 border border-neutral-200/90 shadow-2xs border-l-[5px] border-l-amber-500 space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs">
                      🏷️
                    </div>
                    <span className="text-xs font-black text-[#0F172A] tracking-tight">품목 분류 및 제품명</span>
                  </div>
                  <span className="bg-amber-50 text-amber-700 border border-amber-200/80 text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-0.5 rounded-md">
                    필수 입력
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-extrabold text-[#0F172A]">카테고리 분류 선택 *</label>
                    <select 
                      value={productCategory}
                      onChange={(e) => setProductCategory(e.target.value)}
                      required
                      className="w-full bg-[#F1F4F8] border-0 rounded-lg px-4 py-3 text-xs font-medium text-[#0F172A] focus:bg-white focus:ring-2 focus:ring-amber-500/20 outline-none transition-all cursor-pointer shadow-2xs"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-extrabold text-[#0F172A]">품목 제품명 *</label>
                    <input 
                      type="text"
                      placeholder="예시) 로제미트파이 생지"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      required
                      className="w-full bg-[#F1F4F8] border-0 rounded-lg px-4 py-3 text-xs font-medium text-[#0F172A] placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-amber-500/20 transition-all outline-none shadow-2xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-extrabold text-[#0F172A]">모델 고유 코드/모델명 *</label>
                    <input 
                      type="text"
                      placeholder="예시) RP-DOUGH-01"
                      value={productModelName}
                      onChange={(e) => setProductModelName(e.target.value)}
                      required
                      className="w-full bg-[#F1F4F8] border-0 rounded-lg px-4 py-3 text-xs font-medium text-[#0F172A] placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-amber-500/20 transition-all outline-none shadow-2xs"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-extrabold text-[#0F172A]">포장 단위 *</label>
                      <select 
                        value={productUnit}
                        onChange={(e) => setProductUnit(e.target.value as any)}
                        required
                        className="w-full bg-[#F1F4F8] border-0 rounded-lg px-3 py-3 text-xs font-medium text-[#0F172A] focus:bg-white focus:ring-2 focus:ring-amber-500/20 outline-none transition-all cursor-pointer shadow-2xs"
                      >
                        <option value="개">개</option>
                        <option value="박스">박스</option>
                        <option value="kg">kg</option>
                        <option value="SET">SET</option>
                        <option value="EA">EA</option>
                        <option value="대">대</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-extrabold text-[#0F172A]">단위 수량/중량 *</label>
                      <input 
                        type="number"
                        min={1}
                        value={productQty}
                        onChange={(e) => setProductQty(parseInt(e.target.value, 10) || 1)}
                        required
                        className="w-full bg-[#F1F4F8] border-0 rounded-lg px-3 py-3 text-xs font-medium text-[#0F172A] focus:bg-white focus:ring-2 focus:ring-amber-500/20 transition-all outline-none shadow-2xs"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Pricing & Status (Blue Accent) */}
              <div className="bg-white rounded-lg p-5 border border-neutral-200/90 shadow-2xs border-l-[5px] border-l-blue-500 space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                      💰
                    </div>
                    <span className="text-xs font-black text-[#0F172A] tracking-tight">가격 및 판매 상태</span>
                  </div>
                  <span className="bg-blue-50 text-blue-700 border border-blue-200/80 text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-0.5 rounded-md">
                    가격 정보
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-extrabold text-[#0F172A]">공급가 (원) *</label>
                    <input 
                      type="text"
                      value={productSupplyPrice}
                      onChange={(e) => handlePriceInput(e.target.value, setProductSupplyPrice)}
                      required
                      className="w-full bg-[#F1F4F8] border-0 rounded-lg px-4 py-3 text-xs text-[#0F172A] text-right font-medium focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none shadow-2xs"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-extrabold text-[#0F172A]">판매가 (원) *</label>
                    <input 
                      type="text"
                      value={productPrice}
                      onChange={(e) => handlePriceInput(e.target.value, setProductPrice)}
                      required
                      className="w-full bg-[#F1F4F8] border-0 rounded-lg px-4 py-3 text-xs text-[#0F172A] text-right font-medium focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none shadow-2xs"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-extrabold text-[#0F172A]">특별 할인액 (원)</label>
                    <input 
                      type="text"
                      value={productDiscountAmount}
                      onChange={(e) => handlePriceInput(e.target.value, setProductDiscountAmount)}
                      className="w-full bg-[#F1F4F8] border-0 rounded-lg px-4 py-3 text-xs text-[#0F172A] text-right font-medium focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none shadow-2xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-extrabold text-neutral-400">실시간 할인 적용 공급가 (자동 계산)</label>
                    <input 
                      type="text"
                      value={`${getCalculatedDiscountedPrice().toLocaleString()} 원`}
                      readOnly
                      className="w-full bg-amber-50 border border-amber-200/80 rounded-lg px-4 py-3 text-xs text-amber-700 font-bold text-right outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-extrabold text-[#0F172A]">제품 상태 *</label>
                    <select
                      value={productStatus}
                      onChange={(e) => setProductStatus(e.target.value as "판매중" | "품절" | "단종")}
                      className="w-full bg-[#F1F4F8] border-0 rounded-lg px-4 py-3 text-xs text-[#0F172A] font-medium focus:bg-white focus:ring-2 focus:ring-blue-500/20 cursor-pointer transition-all outline-none shadow-2xs"
                    >
                      <option value="판매중">판매중</option>
                      <option value="품절">품절 (가맹점 주문불가)</option>
                      <option value="단종">단종 (가맹점 노출안됨)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Card 3: Images & Description (Emerald Accent) */}
              <div className="bg-white rounded-lg p-5 border border-neutral-200/90 shadow-2xs border-l-[5px] border-l-emerald-500 space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
                      🖼️
                    </div>
                    <span className="text-xs font-black text-[#0F172A] tracking-tight">이미지 및 상세 설명</span>
                  </div>
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-0.5 rounded-md">
                    이미지 및 콘텐츠
                  </span>
                </div>

                <div className="flex flex-col gap-1.5 bg-[#f8f9fa] p-4 rounded-md border-0 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-extrabold text-[#0F172A]">썸네일 대표 이미지 (웹 URL 또는 직접 파일 업로드)</label>
                    <span className="text-[10px] text-slate-400 font-medium">미입력 시 기본 대표 이미지 자동 적용</span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input 
                      type="text"
                      placeholder="https://res.cloudinary.com/... 이미지 웹 경로 (선택)"
                      value={productImg}
                      onChange={(e) => setProductImg(e.target.value)}
                      className="flex-1 bg-[#F1F4F8] border-0 rounded-lg px-4 py-3 text-xs font-medium text-[#0F172A] focus:bg-white focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none shadow-2xs"
                    />
                    <div className="flex items-center bg-[#F1F4F8] rounded-lg px-3 py-2 shrink-0 border-0 shadow-2xs">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProductImgUpload}
                        className="text-xs text-slate-600 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[10px] file:font-extrabold file:bg-slate-200 file:hover:bg-slate-300 file:text-slate-700 cursor-pointer w-full max-w-[180px]"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 bg-[#f8f9fa] p-4 rounded-md border-0 space-y-2">
                  <label className="font-extrabold text-[#0F172A]">상세 상세페이지 이미지 (옵션)</label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input 
                      type="text"
                      placeholder="https://res.cloudinary.com/... 이미지 상세 웹 경로"
                      value={productDetailImg}
                      onChange={(e) => setProductDetailImg(e.target.value)}
                      className="flex-1 bg-[#F1F4F8] border-0 rounded-lg px-4 py-3 text-xs font-medium text-[#0F172A] focus:bg-white focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none shadow-2xs"
                    />
                    <div className="flex items-center bg-[#F1F4F8] rounded-lg px-3 py-2 shrink-0 border-0 shadow-2xs">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProductDetailImgUpload}
                        className="text-xs text-slate-600 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[10px] file:font-extrabold file:bg-slate-200 file:hover:bg-slate-300 file:text-slate-700 cursor-pointer w-full max-w-[180px]"
                      />
                    </div>
                  </div>
                </div>

                {/* Rich Text Editor */}
                <div className="flex flex-col gap-1.5 bg-[#f8f9fa] p-4 rounded-md border-0 space-y-2">
                  <label className="font-extrabold text-[#0F172A]">상세페이지 텍스트 편집 (크기, 색상, 정렬 등)</label>
                  <div className="border-0 rounded-lg overflow-hidden bg-white shadow-2xs">
                    <div className="flex flex-wrap items-center gap-1 p-2 bg-[#F1F4F8] border-b border-slate-100 text-xs">
                      <button
                        type="button"
                        onClick={() => executeEditorCommand('bold')}
                        className="px-2.5 py-1 bg-white hover:bg-slate-200 rounded-lg text-slate-700 font-bold border-0 cursor-pointer shadow-2xs"
                        title="굵게"
                      >
                        가
                      </button>
                      <button
                        type="button"
                        onClick={() => executeEditorCommand('italic')}
                        className="px-2.5 py-1 bg-white hover:bg-slate-200 rounded-lg text-slate-700 italic font-bold border-0 cursor-pointer shadow-2xs"
                        title="기울임"
                      >
                        가
                      </button>
                      <button
                        type="button"
                        onClick={() => executeEditorCommand('underline')}
                        className="px-2.5 py-1 bg-white hover:bg-slate-200 rounded-lg text-slate-700 underline font-bold border-0 cursor-pointer shadow-2xs"
                        title="밑줄"
                      >
                        가
                      </button>
                      <span className="w-px h-4 bg-slate-300 mx-1"></span>
                      <button
                        type="button"
                        onClick={() => executeEditorCommand('justifyLeft')}
                        className="px-2.5 py-1 bg-white hover:bg-slate-200 rounded-lg text-slate-700 text-[11px] font-bold border-0 cursor-pointer shadow-2xs"
                      >
                        왼쪽
                      </button>
                      <button
                        type="button"
                        onClick={() => executeEditorCommand('justifyCenter')}
                        className="px-2.5 py-1 bg-white hover:bg-slate-200 rounded-lg text-slate-700 text-[11px] font-bold border-0 cursor-pointer shadow-2xs"
                      >
                        가운데
                      </button>
                      <button
                        type="button"
                        onClick={() => executeEditorCommand('justifyRight')}
                        className="px-2.5 py-1 bg-white hover:bg-slate-200 rounded-lg text-slate-700 text-[11px] font-bold border-0 cursor-pointer shadow-2xs"
                      >
                        오른쪽
                      </button>
                      <span className="w-px h-4 bg-slate-300 mx-1"></span>
                      <select
                        onChange={(e) => {
                          if (e.target.value) executeEditorCommand('fontSize', e.target.value);
                        }}
                        className="px-2 py-1 bg-white rounded-lg text-slate-700 text-[11px] font-bold border-0 focus:outline-none cursor-pointer shadow-2xs"
                      >
                        <option value="">글자 크기</option>
                        <option value="2">작게 (12px)</option>
                        <option value="3">보통 (14px)</option>
                        <option value="4">크게 (16px)</option>
                        <option value="5">매우크게 (18px)</option>
                        <option value="6">제목급 (24px)</option>
                      </select>
                      <select
                        onChange={(e) => {
                          if (e.target.value) executeEditorCommand('foreColor', e.target.value);
                        }}
                        className="px-2 py-1 bg-white rounded-lg text-slate-700 text-[11px] font-bold border-0 focus:outline-none cursor-pointer shadow-2xs"
                      >
                        <option value="">글자 색상</option>
                        <option value="#0F172A">기본 검정계열</option>
                        <option value="#2563EB">시원한 파랑</option>
                        <option value="#DC2626">선명한 빨강</option>
                        <option value="#D97706">골드 오렌지</option>
                        <option value="#059669">에메랄드 그린</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => executeEditorCommand('insertUnorderedList')}
                        className="px-2.5 py-1 bg-white hover:bg-slate-200 rounded-lg text-slate-700 text-[11px] font-bold border-0 cursor-pointer shadow-2xs"
                      >
                        • 리스트
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setProductDetailText("");
                          const ed = document.getElementById("product-detail-rich-editor");
                          if (ed) ed.innerHTML = "";
                        }}
                        className="px-2.5 py-1 bg-white hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-bold border-0 ml-auto cursor-pointer shadow-2xs"
                      >
                        비우기
                      </button>
                    </div>

                    <div 
                      id="product-detail-rich-editor"
                      contentEditable
                      suppressContentEditableWarning
                      onInput={(e: React.FormEvent<HTMLDivElement>) => setProductDetailText(e.currentTarget.innerHTML)}
                      data-placeholder="이곳에 제품 상세 안내 텍스트를 자유롭게 입력하고 편집하세요..."
                      className="w-full min-h-[160px] p-4 text-xs font-semibold text-[#0F172A] focus:outline-none rich-content-view overflow-y-auto max-h-[300px]"
                    />
                  </div>
                </div>
              </div>

              {/* Stage Flow Footer Bar */}
              <div className="px-1 py-2 flex items-center justify-between border-t border-neutral-200/60 pt-4">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>시스템 정상 작동 · 본사 제품 관리</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={isProductSaving}
                    onClick={() => setShowProductModal(false)}
                    className="px-5 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 font-extrabold text-xs rounded-md transition-all cursor-pointer border-0 shadow-2xs disabled:opacity-50"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    disabled={isProductSaving}
                    className="px-7 py-2.5 bg-[#FED422] hover:bg-[#e5be1f] text-[#0F172A] font-black text-xs rounded-md transition-all shadow-2xs active:scale-95 cursor-pointer border-0 flex items-center gap-2 disabled:opacity-70"
                  >
                    <span>{isProductSaving ? "저장 처리 중..." : (selectedProduct ? "수정 완료" : "등록 하기")}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* 6. Material Creation Modal (Stage Flow Tech Card Style) */}
      {showMaterialModal && (
        <div 
          className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setShowMaterialModal(false)}
        >
          <div 
            className="w-full max-w-xl bg-white border border-neutral-200/80 rounded-lg overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] max-h-[90vh] flex flex-col font-sans"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Stage Flow Yellow Header */}
            <div className="px-7 py-5 bg-[#FED422] text-[#0F172A] flex justify-between items-center shrink-0 shadow-2xs">
              <div>
                <h3 className="text-base sm:text-lg font-black tracking-tight text-[#0F172A]">신규 가맹 지원 자료 등록</h3>
                <p className="text-xs text-[#0F172A]/80 font-bold mt-0.5">점주 포털에 등록할 교육 및 홍보 자료를 추가합니다.</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline-block text-[10px] font-black tracking-wider text-[#0F172A] uppercase px-3 py-1 rounded-md bg-black/5">
                  자료 등록 양식
                </span>
                <button 
                  type="button"
                  onClick={() => setShowMaterialModal(false)} 
                  className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 text-[#0F172A] transition-all flex items-center justify-center border-0 cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <form onSubmit={handleCreateMaterial} className="p-6 sm:p-7 overflow-y-auto space-y-4 flex-1 text-xs sm:text-sm bg-[#f9fafb]">
              {/* Card 1: Type Selection (Amber Accent) */}
              <div className="bg-white rounded-lg p-5 border border-neutral-200/90 shadow-2xs border-l-[5px] border-l-amber-500 space-y-3">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs">
                      📁
                    </div>
                    <span className="text-xs font-black text-[#0F172A] tracking-tight">자료 유형 구분</span>
                  </div>
                  <span className="bg-amber-50 text-amber-700 border border-amber-200/80 text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-0.5 rounded-md">
                    유형 선택
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setMaterialType("training")}
                    className={`py-3 rounded-lg border-0 text-xs font-black transition-all cursor-pointer ${
                      materialType === "training"
                        ? "bg-[#FED422] text-[#0F172A] shadow-2xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    📖 교육자료실 등록
                  </button>
                  <button
                    type="button"
                    onClick={() => setMaterialType("pr")}
                    className={`py-3 rounded-lg border-0 text-xs font-black transition-all cursor-pointer ${
                      materialType === "pr"
                        ? "bg-[#FED422] text-[#0F172A] shadow-2xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    🖼 홍보자료실 등록
                  </button>
                </div>
              </div>

              {/* Card 2: Title & Specifications (Blue Accent) */}
              <div className="bg-white rounded-lg p-5 border border-neutral-200/90 shadow-2xs border-l-[5px] border-l-blue-500 space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                      📜
                    </div>
                    <span className="text-xs font-black text-[#0F172A] tracking-tight">제목 및 포맷 상세</span>
                  </div>
                  <span className="bg-blue-50 text-blue-700 border border-blue-200/80 text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-0.5 rounded-md">
                    상세 정보
                  </span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-extrabold text-[#0F172A]">자료(파일명) 제목 *</label>
                  <input 
                    type="text"
                    placeholder="예시) 하절기 위생 종합 자가점검 진단서 엑셀 양식"
                    value={newMaterialTitle}
                    onChange={(e) => setNewMaterialTitle(e.target.value)}
                    required
                    className="w-full bg-[#F1F4F8] border-0 rounded-lg px-4 py-3 text-xs font-medium text-[#0F172A] placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none shadow-2xs"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-extrabold text-[#0F172A]">자료 상세 설명 (옵션)</label>
                  <input 
                    type="text"
                    placeholder="예시) 매장 위생점검 수칙 및 필수 준수 사항 가이드라인"
                    value={newMaterialDesc}
                    onChange={(e) => setNewMaterialDesc(e.target.value)}
                    className="w-full bg-[#F1F4F8] border-0 rounded-lg px-4 py-3 text-xs font-medium text-[#0F172A] placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none shadow-2xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-extrabold text-[#0F172A]">파일 포맷 확장자 *</label>
                    <input 
                      type="text"
                      placeholder="PDF, MP4, AI 등"
                      value={newMaterialFormat}
                      onChange={(e) => setNewMaterialFormat(e.target.value)}
                      required
                      className="w-full bg-[#F1F4F8] border-0 rounded-lg px-4 py-3 text-xs font-medium text-[#0F172A] focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none shadow-2xs"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-extrabold text-[#0F172A]">권장 크기 용량 *</label>
                    <input 
                      type="text"
                      placeholder="예시) 4.5 MB"
                      value={newMaterialSize}
                      onChange={(e) => setNewMaterialSize(e.target.value)}
                      required
                      className="w-full bg-[#F1F4F8] border-0 rounded-lg px-4 py-3 text-xs font-medium text-[#0F172A] focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none shadow-2xs"
                    />
                  </div>
                </div>
              </div>

              {/* Card 3: Files & Preview Image (Emerald Accent) */}
              <div className="bg-white rounded-lg p-5 border border-neutral-200/90 shadow-2xs border-l-[5px] border-l-emerald-500 space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
                      📥
                    </div>
                    <span className="text-xs font-black text-[#0F172A] tracking-tight">파일 및 대표 썸네일</span>
                  </div>
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-0.5 rounded-md">
                    파일 첨부
                  </span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-extrabold text-[#0F172A]">자료 대표 이미지 주소 (옵션)</label>
                  <input 
                    type="text"
                    placeholder="https://res.cloudinary.com/... 이미지 경로"
                    value={newMaterialImg}
                    onChange={(e) => setNewMaterialImg(e.target.value)}
                    className="w-full bg-[#F1F4F8] border-0 rounded-lg px-4 py-3 text-xs font-medium text-[#0F172A] placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none shadow-2xs"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-extrabold text-[#0F172A] flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      📂 실제 자료 파일 직접 업로드
                      <span className="text-[10px] text-amber-600 font-extrabold">(필수)</span>
                    </span>
                    {isUploadingMaterialFile && (
                      <span className="text-[10px] text-amber-600 font-bold animate-pulse flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-spin"></span>
                        서버 업로드 중... ⏳
                      </span>
                    )}
                    {!isUploadingMaterialFile && newMaterialFileUrl && (
                      <span className="text-[10px] text-emerald-600 font-extrabold flex items-center gap-1">
                        ✓ 서버 업로드 완료
                      </span>
                    )}
                  </label>
                  <div className="flex items-center gap-3 bg-[#F1F4F8] border-0 rounded-lg p-3 shadow-2xs">
                    <input
                      type="file"
                      disabled={isUploadingMaterialFile}
                      onChange={handleMaterialFileUpload}
                      className="text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-[10px] file:font-extrabold file:bg-slate-200 file:text-slate-700 cursor-pointer flex-1 disabled:opacity-50"
                    />
                    {newMaterialFileName && (
                      <div className="text-[10px] font-extrabold text-[#0F172A] bg-amber-100 px-2.5 py-1 rounded-md max-w-[150px] truncate" title={newMaterialFileName}>
                        {newMaterialFileName}
                      </div>
                    )}
                    {newMaterialFileUrl && !isUploadingMaterialFile && (
                      <button
                        type="button"
                        onClick={() => {
                          setNewMaterialFileUrl("");
                          setNewMaterialStorageId("");
                          setNewMaterialFileName("");
                        }}
                        className="px-3 py-1 rounded-lg bg-white hover:bg-slate-200 text-slate-700 text-[10px] font-bold border-0 cursor-pointer shadow-2xs"
                      >
                        지우기
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Stage Flow Footer Bar */}
              <div className="px-1 py-2 flex items-center justify-between border-t border-neutral-200/60 pt-4">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <span className={`w-2 h-2 rounded-full ${isUploadingMaterialFile ? "bg-amber-500 animate-ping" : newMaterialFileUrl ? "bg-emerald-500 animate-pulse" : "bg-slate-300"}`}></span>
                  <span>{isUploadingMaterialFile ? "대용량 파일 서버 업로드 중..." : newMaterialFileUrl ? "자료 업로드 준비 완료" : "자료 파일 선택 대기"}</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowMaterialModal(false)}
                    className="px-5 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 font-extrabold text-xs rounded-md transition-all cursor-pointer border-0 shadow-2xs"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    disabled={isUploadingMaterialFile}
                    className="px-7 py-2.5 bg-[#FED422] hover:bg-[#e5be1f] disabled:bg-slate-300 disabled:text-slate-500 text-[#0F172A] font-black text-xs rounded-md transition-all shadow-2xs active:scale-95 cursor-pointer disabled:cursor-not-allowed border-0 flex items-center gap-2"
                  >
                    <span>{isUploadingMaterialFile ? "업로드 중..." : "지원 자료 추가"}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. Order Detail Popup Modal (Stage Flow Tech Card Style) */}
      {showOrderModal && selectedOrder && (
        <div 
          className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setShowOrderModal(false)}
        >
          <div 
            className="w-full max-w-3xl bg-white border border-neutral-200/80 rounded-lg overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] max-h-[90vh] flex flex-col font-sans"
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
                    <span>발주 주문 상세 내역</span>
                    <span className="text-[11px] px-2.5 py-0.5 rounded-md bg-black/10 text-[#0F172A] font-mono font-bold">
                      {selectedOrder.id}
                    </span>
                  </h3>
                  <p className="text-xs text-[#0F172A]/80 font-bold mt-0.5">가맹점 발주 품목 및 물류 배송 송장을 관리합니다.</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline-block text-[10px] font-black tracking-widest text-[#0F172A] uppercase px-2.5 py-1 rounded-md bg-black/5">
                  발주 상세
                </span>
                <button 
                  type="button"
                  onClick={() => setShowOrderModal(false)} 
                  className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-500 hover:text-neutral-900 transition-all flex items-center justify-center border-0 cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 sm:p-7 overflow-y-auto space-y-4 flex-1 text-xs sm:text-sm bg-[#f9fafb]">
              
              {/* Delivery Recipient Info Card (Amber Accent) */}
              {(() => {
                const storeInfo = stores.find(s => s.id === selectedOrder.storeId) || {
                  name: selectedOrder.storeId === "owner" ? "본사 테스트" : "강남역삼점",
                  owner: "김지훈",
                  phone: "010-3813-1200",
                  roadAddress: "경기 군포시 엘에스로 143 (금정동, 1층 1001호)",
                  detailAddress: "",
                };
                const storeAddress = `${storeInfo.roadAddress} ${storeInfo.detailAddress}`.trim();
                
                return (
                  <div className="bg-white rounded-lg p-5 border border-neutral-200/90 shadow-2xs border-l-[5px] border-l-amber-500 space-y-4">
                    <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5">
                      <div className="flex items-center gap-2">
                        <Store size={16} className="text-amber-500" />
                        <span className="text-xs font-black text-[#0F172A] tracking-tight">수령인 & 배송지 정보 (가맹점 정보)</span>
                      </div>
                      <span className="bg-amber-50 text-amber-700 border border-amber-200/80 text-[10px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-md">
                        가맹점 정보
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold text-slate-600">
                      <div className="bg-[#f8f9fa] p-3.5 rounded-md border border-neutral-200/80 flex justify-between items-center">
                        <div>
                          <span className="block text-[10px] text-neutral-400 mb-0.5 font-bold">가맹점명</span>
                          <strong className="text-[#0F172A] text-xs font-black">{storeInfo.name}</strong>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopyToClipboard(storeInfo.name, "가맹점명")}
                          className="p-1.5 hover:text-[#0F172A] text-slate-400 bg-neutral-200/60 hover:bg-neutral-200 rounded-lg shrink-0 cursor-pointer border-0 transition-colors"
                          title="복사하기"
                        >
                          <Copy size={12} />
                        </button>
                      </div>

                      <div className="bg-[#f8f9fa] p-3.5 rounded-md border border-neutral-200/80 flex justify-between items-center">
                        <div>
                          <span className="block text-[10px] text-neutral-400 mb-0.5 font-bold">점주 대표자</span>
                          <strong className="text-[#0F172A] text-xs font-black">{storeInfo.owner}</strong>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopyToClipboard(storeInfo.owner, "대표자명")}
                          className="p-1.5 hover:text-[#0F172A] text-slate-400 bg-neutral-200/60 hover:bg-neutral-200 rounded-lg shrink-0 cursor-pointer border-0 transition-colors"
                          title="복사하기"
                        >
                          <Copy size={12} />
                        </button>
                      </div>

                      <div className="bg-[#f8f9fa] p-3.5 rounded-md border border-neutral-200/80 flex justify-between items-center">
                        <div>
                          <span className="block text-[10px] text-neutral-400 mb-0.5 font-bold">연락처</span>
                          <strong className="text-[#0F172A] text-xs font-black">{storeInfo.phone}</strong>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopyToClipboard(storeInfo.phone, "연락처")}
                          className="p-1.5 hover:text-[#0F172A] text-slate-400 bg-neutral-200/60 hover:bg-neutral-200 rounded-lg shrink-0 cursor-pointer border-0 transition-colors"
                          title="복사하기"
                        >
                          <Copy size={12} />
                        </button>
                      </div>

                      <div className="bg-[#f8f9fa] p-3.5 rounded-md border border-neutral-200/80 flex justify-between items-center">
                        <div>
                          <span className="block text-[10px] text-neutral-400 mb-0.5 font-bold">주문 신청일</span>
                          <strong className="text-[#0F172A] text-xs font-black">{formatOrderDate(selectedOrder.date, (selectedOrder as any)._creationTime)}</strong>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopyToClipboard(formatOrderDate(selectedOrder.date, (selectedOrder as any)._creationTime), "신청일")}
                          className="p-1.5 hover:text-[#0F172A] text-slate-400 bg-neutral-200/60 hover:bg-neutral-200 rounded-lg shrink-0 cursor-pointer border-0 transition-colors"
                          title="복사하기"
                        >
                          <Copy size={12} />
                        </button>
                      </div>
                    </div>
                    <div className="bg-[#f8f9fa] p-3.5 rounded-md border border-neutral-200/80 flex justify-between items-center gap-4">
                      <div className="flex-1">
                        <span className="block text-[10px] text-neutral-400 mb-0.5 font-bold">배송지 주소</span>
                        <strong className="text-[#0F172A] text-xs font-black break-words leading-tight">{storeAddress}</strong>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopyToClipboard(storeAddress, "배송지 주소")}
                        className="p-2 hover:bg-neutral-200 text-slate-600 bg-neutral-200/60 rounded-md shrink-0 cursor-pointer transition-all border-0 self-center"
                        title="주소 복사"
                      >
                        <Copy size={14} />
                      </button>
                    </div>
                  </div>
                );
              })()}

              {/* Order Item List Card (Blue Accent) */}
              <div className="bg-white rounded-lg p-5 border border-neutral-200/90 shadow-2xs border-l-[5px] border-l-blue-500 space-y-3">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Package size={16} className="text-blue-500" />
                    <span className="text-xs font-black text-[#0F172A] tracking-tight">발주 신청 품목 및 정산 내역 ({selectedOrder.items.length})</span>
                  </div>
                  <span className="bg-blue-50 text-blue-700 border border-blue-200/80 text-[10px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-md">
                    품목 목록
                  </span>
                </div>

                <div className="border border-neutral-200/90 rounded-md overflow-hidden bg-white shadow-2xs">
                  <div className="overflow-x-auto w-full">
                    <table className="w-full text-left border-collapse text-[11px] min-w-[480px] sm:min-w-0" style={{ tableLayout: 'fixed' }}>
                      <thead>
                        <tr className="bg-[#f8f9fa] border-b border-neutral-200/80 text-[10px] font-extrabold text-neutral-400 uppercase">
                          <th className="px-4 py-3" style={{ width: '40%' }}>품목명</th>
                          <th className="px-3 py-3 text-right" style={{ width: '20%' }}>단가</th>
                          <th className="px-3 py-3 text-center" style={{ width: '15%' }}>수량</th>
                          <th className="px-4 py-3 text-right" style={{ width: '25%' }}>금액</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100">
                        {selectedOrder.items.map((item, idx) => (
                          <tr key={idx} className="hover:bg-neutral-50 font-medium">
                            <td className="px-4 py-3 font-black text-[#0F172A] leading-tight break-words text-[11px] sm:text-xs" style={{ wordBreak: 'break-word' }}>
                              {item.productName}
                            </td>
                            <td className="px-3 py-3 text-right text-slate-500 text-[11px] font-bold">{item.price.toLocaleString()}</td>
                            <td className="px-3 py-3 text-center font-black text-[#0F172A] text-[11px]">{item.quantity}</td>
                            <td className="px-4 py-3 text-right font-black text-[#0F172A] text-[11px]">{(item.price * item.quantity).toLocaleString()} 원</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Status control and Total price summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  <div className="space-y-1.5 bg-[#f8f9fa] p-3.5 rounded-md border border-neutral-200/80">
                    <label className="text-xs font-black text-[#0F172A] block">상태값 변경 선택</label>
                    <select
                      value={selectedOrder.status}
                      onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)}
                      className="w-full bg-[#e2e8f0] border-0 rounded-md px-4 py-2.5 text-xs text-[#0F172A] font-bold focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 cursor-pointer outline-none transition-all"
                    >
                      {deliveryStatuses.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>

                  <div className="bg-[#f8f9fa] p-3.5 rounded-md border border-neutral-200/80 flex flex-col justify-center items-end text-right">
                    <span className="text-[10px] text-neutral-400 font-bold block mb-0.5">결제 수단 정보: <strong className="text-[#0F172A] font-black">{selectedOrder.payMethod === "card" || selectedOrder.payMethod === "CARD" ? "카드결제" : "현금 입금 진행"}</strong></span>
                    <span className="text-[10px] text-neutral-400 font-bold block mb-0.5">총 결제 합계액 (부가세 포함)</span>
                    <strong className="text-lg font-black text-amber-500">
                      {selectedOrder.totalPrice.toLocaleString()} 원
                    </strong>
                  </div>
                </div>
              </div>

              {/* Delivery & Tracking Info Card (Emerald Accent) */}
              <form onSubmit={handleUpdateOrderTracking} className="bg-white rounded-lg p-5 border border-neutral-200/90 shadow-2xs border-l-[5px] border-l-emerald-500 space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Truck size={16} className="text-emerald-500" />
                    <span className="text-xs font-black text-[#0F172A] tracking-tight">배송 물류 송장 정보 (다중 송장 지원)</span>
                  </div>
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[10px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-md">
                    송장 관리
                  </span>
                </div>
                
                {/* Registered Tracking List */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-neutral-400 block">등록된 송장 목록 ({modalTrackingList.length})</label>
                  {modalTrackingList.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {modalTrackingList.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-[#f8f9fa] border border-neutral-200/80 px-3.5 py-2.5 rounded-md text-xs font-semibold text-[#0F172A]">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-md bg-amber-100 text-[10px] font-black text-amber-900">
                              {item.courier}
                            </span>
                            <span className="font-mono text-[#0F172A] font-black text-xs">{item.trackingNo}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setModalTrackingList(modalTrackingList.filter((_, i) => i !== idx));
                            }}
                            className="p-1 hover:bg-neutral-200 rounded-md text-slate-400 hover:text-rose-600 transition-colors cursor-pointer border-0"
                            title="삭제"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-3 bg-[#f8f9fa] border border-neutral-200/80 rounded-md text-[11px] font-bold text-neutral-400">
                      등록된 송장 번호가 없습니다. 아래에서 송장을 등록해 주세요.
                    </div>
                  )}
                </div>

                {/* Add Tracking Form */}
                <div className="bg-[#f8f9fa] p-3.5 rounded-md border border-neutral-200/80 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                    <div className="sm:col-span-4 space-y-1">
                      <label className="text-[10px] font-extrabold text-[#0F172A] block">택배사 선택</label>
                      <select
                        value={selectedCourier}
                        onChange={(e) => setSelectedCourier(e.target.value)}
                        className="w-full bg-[#e2e8f0] border-0 rounded-md px-3 py-2.5 text-xs text-[#0F172A] font-bold focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 cursor-pointer outline-none transition-all"
                      >
                        <option value="CJ대한통운">CJ대한통운</option>
                        <option value="한진택배">한진택배</option>
                        <option value="롯데택배">롯데택배</option>
                        <option value="로젠택배">로젠택배</option>
                        <option value="우체국택배">우체국택배</option>
                        <option value="본사 직배송 차량">본사 직배송 차량</option>
                      </select>
                    </div>

                    <div className="sm:col-span-6 space-y-1">
                      <label className="text-[10px] font-extrabold text-[#0F172A] block">송장번호 입력</label>
                      <input
                        type="text"
                        placeholder="하이픈(-) 없이 입력"
                        value={inputTrackingNo}
                        onChange={(e) => setInputTrackingNo(e.target.value)}
                        className="w-full bg-[#e2e8f0] border-0 rounded-md px-3 py-2.5 text-xs text-[#0F172A] font-bold placeholder-neutral-400 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <button
                        type="button"
                        onClick={handleToAddTracking}
                        className="w-full py-2.5 bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-black rounded-md transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1 border-0"
                      >
                        <Plus size={14} />
                        추가
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-md transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer border-0 active:scale-95"
                  >
                    <Truck size={15} />
                    송장 등록 및 배송중 상태 변경
                  </button>
                </div>
              </form>

              {/* Stage Flow Footer Bar */}
              <div className="px-1 py-2 flex items-center justify-between border-t border-neutral-200/60 pt-4">
                <div className="flex items-center gap-2 text-[10px] font-mono font-extrabold text-neutral-400 uppercase tracking-widest">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>ORDER SYSTEM ACTIVE</span>
                </div>
                <button 
                  type="button"
                  onClick={() => setShowOrderModal(false)}
                  className="px-6 py-2.5 rounded-md bg-[#0F172A] hover:bg-slate-800 text-xs font-black text-white transition-colors border-0 cursor-pointer shadow-xs"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL: PARTNER CREATE / EDIT
      ========================================== */}
      {isPartnerFormOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setIsPartnerFormOpen(false)}
        >
          <div 
            className="w-full max-w-2xl bg-white border border-neutral-200/80 rounded-xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col font-sans"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 bg-[#FED422] text-[#0F172A] flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <Users size={20} className="text-[#0F172A]" />
                <h3 className="text-base font-black text-[#0F172A]">
                  {isPartnerEditMode ? `영업 파트너 정보 수정 [${partnerFormName}]` : "영업 파트너 신규 등록"}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                {isPartnerEditMode && (
                  <button 
                    type="button"
                    onClick={() => window.open(`/partner?partnerId=${partnerFormId}`, '_blank')}
                    className="px-3 py-1.5 bg-[#0F172A] hover:bg-slate-800 text-white rounded-lg text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-xs border-0"
                    title="해당 파트너 계정으로 로그인된 어드민 포털 새 창 열기"
                  >
                    <ExternalLink size={13} className="text-[#FED422]" />
                    <span>파트너 어드민 접속 (자동 로그인)</span>
                  </button>
                )}
                <button 
                  type="button"
                  onClick={() => setIsPartnerFormOpen(false)} 
                  className="w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 text-[#0F172A] transition-all flex items-center justify-center border-0 cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <form onSubmit={handleSavePartner} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs bg-[#f9fafb]">
              {/* 계정 정보 */}
              <div className="bg-white rounded-lg p-4 border border-neutral-200 shadow-2xs space-y-3">
                <h4 className="font-black text-slate-800 border-b border-neutral-100 pb-2 flex items-center gap-1.5">
                  <span>🔑 파트너 로그인 계정 정보</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="font-extrabold text-slate-700 block mb-1">파트너 로그인 ID *</label>
                    <input 
                      type="text"
                      value={partnerFormId}
                      onChange={(e) => setPartnerFormId(e.target.value)}
                      disabled={isPartnerEditMode}
                      placeholder="예: partner1"
                      required
                      className="w-full bg-[#F1F4F8] disabled:opacity-70 border-0 rounded-lg px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-extrabold text-slate-700 block mb-1">비밀번호 *</label>
                    <input 
                      type="text"
                      value={partnerFormPw}
                      onChange={(e) => setPartnerFormPw(e.target.value)}
                      placeholder="접속 비밀번호"
                      required
                      className="w-full bg-[#F1F4F8] border-0 rounded-lg px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* 기본 정보 */}
              <div className="bg-white rounded-lg p-4 border border-neutral-200 shadow-2xs space-y-3">
                <h4 className="font-black text-slate-800 border-b border-neutral-100 pb-2 flex items-center gap-1.5">
                  <span>👤 파트너 기본 인적 / 영업 정보</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="font-extrabold text-slate-700 block mb-1">파트너명 (대표자) *</label>
                    <input 
                      type="text"
                      value={partnerFormName}
                      onChange={(e) => setPartnerFormName(e.target.value)}
                      placeholder="예: 홍길동"
                      required
                      className="w-full bg-[#F1F4F8] border-0 rounded-lg px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-extrabold text-slate-700 block mb-1">연락처 *</label>
                    <input 
                      type="text"
                      value={partnerFormPhone}
                      onChange={(e) => setPartnerFormPhone(e.target.value)}
                      placeholder="010-0000-0000"
                      required
                      className="w-full bg-[#F1F4F8] border-0 rounded-lg px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-extrabold text-slate-700 block mb-1">소속 / 상호명 (선택)</label>
                    <input 
                      type="text"
                      value={partnerFormCompanyName}
                      onChange={(e) => setPartnerFormCompanyName(e.target.value)}
                      placeholder="예: 제이에이전시"
                      className="w-full bg-[#F1F4F8] border-0 rounded-lg px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-extrabold text-slate-700 block mb-1">이메일 (선택)</label>
                    <input 
                      type="email"
                      value={partnerFormEmail}
                      onChange={(e) => setPartnerFormEmail(e.target.value)}
                      placeholder="partner@example.com"
                      className="w-full bg-[#F1F4F8] border-0 rounded-lg px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* 정산 계좌 및 수수료 설정 */}
              <div className="bg-white rounded-lg p-4 border border-neutral-200 shadow-2xs space-y-3">
                <h4 className="font-black text-slate-800 border-b border-neutral-100 pb-2 flex items-center gap-1.5">
                  <span>💳 정산 계좌 및 수수료 단가 설정</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="font-extrabold text-slate-700 block mb-1">은행명</label>
                    <input 
                      type="text"
                      value={partnerFormBankName}
                      onChange={(e) => setPartnerFormBankName(e.target.value)}
                      placeholder="예: 국민은행"
                      className="w-full bg-[#F1F4F8] border-0 rounded-lg px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-extrabold text-slate-700 block mb-1">계좌번호</label>
                    <input 
                      type="text"
                      value={partnerFormAccountNumber}
                      onChange={(e) => setPartnerFormAccountNumber(e.target.value)}
                      placeholder="'-' 포함 입력"
                      className="w-full bg-[#F1F4F8] border-0 rounded-lg px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-extrabold text-slate-700 block mb-1">예금주</label>
                    <input 
                      type="text"
                      value={partnerFormAccountHolder}
                      onChange={(e) => setPartnerFormAccountHolder(e.target.value)}
                      placeholder="예금주 성명"
                      className="w-full bg-[#F1F4F8] border-0 rounded-lg px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-extrabold text-slate-700 block mb-1">생지 1박스당 수수료 (원, 부가세포함)</label>
                    <input 
                      type="number"
                      value={partnerFormCommission}
                      onChange={(e) => setPartnerFormCommission(Number(e.target.value))}
                      placeholder="8000"
                      className="w-full bg-[#F1F4F8] border-0 rounded-lg px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-extrabold text-slate-700 block mb-1">파트너 상태</label>
                    <select
                      value={partnerFormStatus}
                      onChange={(e) => setPartnerFormStatus(e.target.value)}
                      className="w-full bg-[#F1F4F8] border-0 rounded-lg px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
                    >
                      <option value="활동중">활동중</option>
                      <option value="대기">대기</option>
                      <option value="정지">정지</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-extrabold text-slate-700 block mb-1">등록일자</label>
                    <input 
                      type="date"
                      value={partnerFormRegDate}
                      onChange={(e) => setPartnerFormRegDate(e.target.value)}
                      className="w-full bg-[#F1F4F8] border-0 rounded-lg px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-extrabold text-slate-700 block mb-1">본사 관리 메모 (파트너에게 노출되지 않음)</label>
                  <textarea
                    rows={2}
                    value={partnerFormMemo}
                    onChange={(e) => setPartnerFormMemo(e.target.value)}
                    placeholder="특이사항 및 담당 구역 등 메모"
                    className="w-full bg-[#F1F4F8] border-0 rounded-lg px-3.5 py-2.5 text-xs font-medium text-slate-800 focus:outline-none resize-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-[#FED422] hover:bg-amber-400 text-[#0F172A] text-xs font-black rounded-lg transition-all shadow-md cursor-pointer border-0 flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 size={16} />
                  <span>{isPartnerEditMode ? "파트너 정보 수정 완료" : "신규 파트너 등록 완료"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL: SETTLEMENT STATUS EDIT (HQ ADMIN)
      ========================================== */}
      {settlementStatusEditTarget && (
        <div 
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSettlementStatusEditTarget(null)}
        >
          <div 
            className="w-full max-w-md bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-2xl p-6 space-y-4 font-sans"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="text-sm font-black text-[#0F172A] flex items-center gap-1.5">
                <DollarSign size={18} className="text-amber-500" />
                <span>정산 및 지급 상태 변경</span>
              </h3>
              <button 
                onClick={() => setSettlementStatusEditTarget(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X size={16} />
              </button>
            </div>

            <div className="bg-[#F8FAFC] p-3.5 rounded-lg border border-neutral-200 text-xs space-y-1">
              <div><strong>파트너:</strong> {settlementStatusEditTarget.partnerName} ({settlementStatusEditTarget.phone})</div>
              <div><strong>정산 년월:</strong> {settlementStatusEditTarget.yearMonth}</div>
              <div><strong>생지 수량 / 금액:</strong> {settlementStatusEditTarget.boxCount}박스 / {(settlementStatusEditTarget.commissionAmount || 0).toLocaleString()}원</div>
              <div><strong>입금 계좌:</strong> {settlementStatusEditTarget.bankName} {settlementStatusEditTarget.accountNumber} ({settlementStatusEditTarget.accountHolder})</div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-black text-slate-700 block mb-1">정산 상태 선택</label>
                <select
                  value={settlementNewStatus}
                  onChange={(e) => setSettlementNewStatus(e.target.value)}
                  className="w-full bg-[#F1F4F8] border-0 rounded-lg px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value="정산대기">정산대기 (실시간 합산 중)</option>
                  <option value="정산확정">정산확정 (월마감 검토 완료)</option>
                  <option value="지급완료">지급완료 (계좌 입금 처리 완료)</option>
                </select>
              </div>

              {settlementNewStatus === "지급완료" && (
                <div>
                  <label className="font-black text-slate-700 block mb-1">실제 지급일자</label>
                  <input
                    type="date"
                    value={settlementPaidDate}
                    onChange={(e) => setSettlementPaidDate(e.target.value)}
                    className="w-full bg-[#F1F4F8] border-0 rounded-lg px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="font-black text-slate-700 block mb-1">정산 메모</label>
                <input
                  type="text"
                  value={settlementNote}
                  onChange={(e) => setSettlementNote(e.target.value)}
                  placeholder="예: 5월 10일 국민은행 이체완료"
                  className="w-full bg-[#F1F4F8] border-0 rounded-lg px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setSettlementStatusEditTarget(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold transition-all border-0"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleSaveSettlementStatus}
                className="px-5 py-2 bg-[#FED422] hover:bg-amber-400 text-[#0F172A] rounded-lg text-xs font-black transition-all border-0 shadow-xs cursor-pointer"
              >
                저장하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL: SETTLEMENT INVOICE PRINT (HQ ADMIN)
      ========================================== */}
      {selectedSettlementForModal && (
        <div 
          className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSelectedSettlementForModal(null)}
        >
          <div 
            className="w-full max-w-2xl bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col font-sans text-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600">본사 가맹지원본부 파트너 정산 명세서</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Printer size={14} />
                  <span>인쇄 / PDF 출력</span>
                </button>
                <button
                  onClick={() => setSelectedSettlementForModal(null)}
                  className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="p-8 overflow-y-auto space-y-6 text-xs">
              <div className="text-center border-b-2 border-slate-900 pb-4 space-y-1">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">영업 파트너 수수료 정산 명세서</h1>
                <p className="text-slate-500 font-mono font-bold">정산 대상 월: {selectedSettlementForModal.yearMonth}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 border border-slate-200 p-4 rounded-xl bg-slate-50">
                <div className="space-y-1">
                  <div><strong>파트너명:</strong> {selectedSettlementForModal.partnerName}</div>
                  <div><strong>상호/소속:</strong> {selectedSettlementForModal.companyName || "-"}</div>
                  <div><strong>연락처:</strong> {selectedSettlementForModal.phone}</div>
                </div>
                <div className="space-y-1">
                  <div><strong>지급 은행:</strong> {selectedSettlementForModal.bankName || "-"}</div>
                  <div><strong>계좌번호:</strong> {selectedSettlementForModal.accountNumber || "-"}</div>
                  <div><strong>예금주:</strong> {selectedSettlementForModal.accountHolder || selectedSettlementForModal.partnerName}</div>
                </div>
              </div>

              <table className="w-full text-left border-collapse border border-slate-300">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300 font-bold">
                    <th className="p-2.5 border-r border-slate-300">정산 항목</th>
                    <th className="p-2.5 border-r border-slate-300 text-right">수량 (박스)</th>
                    <th className="p-2.5 border-r border-slate-300 text-right">지급 단가</th>
                    <th className="p-2.5 text-right">정산 금액 (VAT포함)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-200">
                    <td className="p-2.5 border-r border-slate-300 font-bold">
                      유치 가맹점 패스트리 생지 주문 수수료
                    </td>
                    <td className="p-2.5 border-r border-slate-300 text-right font-mono font-bold">
                      {selectedSettlementForModal.boxCount} 박스
                    </td>
                    <td className="p-2.5 border-r border-slate-300 text-right font-mono">
                      {(selectedSettlementForModal.commissionUnit || 8000).toLocaleString()}원
                    </td>
                    <td className="p-2.5 text-right font-black font-mono text-sm">
                      {(selectedSettlementForModal.commissionAmount || 0).toLocaleString()}원
                    </td>
                  </tr>
                  <tr className="bg-slate-50 font-bold">
                    <td colSpan={3} className="p-2.5 border-r border-slate-300 text-right">
                      최종 정산 합계액
                    </td>
                    <td className="p-2.5 text-right font-black text-rose-600 text-base font-mono">
                      {(selectedSettlementForModal.commissionAmount || 0).toLocaleString()}원
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="space-y-1 text-slate-500 text-[11px] leading-relaxed pt-2">
                <p>• 정산 상태: <strong>{selectedSettlementForModal.status}</strong> {selectedSettlementForModal.paidDate ? `(지급완료일: ${selectedSettlementForModal.paidDate})` : ""}</p>
                <p>• 발행처: 주식회사 120겹파이 가맹지원본부</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL: CONTRACT SMS SEND
      ========================================== */}
      {isContractSmsModalOpen && selectedContract && (
        <div 
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => !isSendingContractSms && setIsContractSmsModalOpen(false)}
        >
          <div 
            className="w-full max-w-lg bg-white border border-neutral-200/80 rounded-2xl overflow-hidden shadow-2xl flex flex-col font-sans"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 bg-[#FED422] text-[#0F172A] flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <Send size={18} className="text-[#0F172A]" />
                <h3 className="text-base font-black text-[#0F172A]">
                  가맹계약서 전자서명 링크 문자 발송
                </h3>
              </div>
              <button 
                type="button"
                onClick={() => !isSendingContractSms && setIsContractSmsModalOpen(false)} 
                className="w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 text-[#0F172A] transition-all flex items-center justify-center border-0 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs bg-[#f9fafb]">
              {/* Receiver Info */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span className="font-bold text-slate-500">수신자 (가맹사업자)</span>
                  <span className="font-black text-[#0F172A]">{selectedContract.ownerName}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span className="font-bold text-slate-500">가맹점명</span>
                  <span className="font-extrabold text-[#0F172A]">{selectedContract.storeName}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="font-bold text-slate-500">수신 휴대폰 번호</span>
                  <span className="font-mono font-black text-amber-700 text-sm">{selectedContract.ownerPhone}</span>
                </div>
              </div>

              {/* Sender Info */}
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">
                  발신 번호 (알리고에 등록된 대표번호)
                </label>
                <input
                  type="text"
                  value={contractSmsSender}
                  onChange={(e) => setContractSmsSender(e.target.value)}
                  placeholder="1566-3594"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Message Content */}
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">
                  발송 메시지 내용 미리보기
                </label>
                <textarea
                  rows={8}
                  value={contractSmsMsg}
                  onChange={(e) => setContractSmsMsg(e.target.value)}
                  className="w-full p-3.5 bg-white border border-slate-300 rounded-lg text-xs font-mono font-medium text-slate-800 focus:outline-none focus:border-amber-500 resize-none leading-relaxed"
                />
                <span className="text-[11px] text-slate-400 block mt-1">
                  * 80자 이상 시 장문(LMS)으로 자동 전환되어 알리고를 통해 발송됩니다.
                </span>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  disabled={isSendingContractSms}
                  onClick={() => setIsContractSmsModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold rounded-xl transition-all cursor-pointer border-0"
                >
                  취소
                </button>
                <button
                  type="button"
                  disabled={isSendingContractSms}
                  onClick={handleSendContractSms}
                  className="px-5 py-2.5 bg-[#FED422] hover:bg-[#e5be1f] text-[#0F172A] font-black rounded-xl transition-all flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isSendingContractSms ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-[#0F172A] border-t-transparent rounded-full animate-spin" />
                      <span>문자 전송 중...</span>
                    </>
                  ) : (
                    <>
                      <Send size={14} />
                      <span>전자계약서 문자 발송</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
