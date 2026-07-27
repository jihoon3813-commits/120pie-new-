"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { optimizeCloudinaryUrl } from "@/app/utils/cloudinary";
import { getInstagramThumbnailUrl } from "@/app/utils/instagram";
import Link from "next/link";
import {
  LayoutDashboard,
  ShoppingBag,
  History,
  Megaphone,
  MessageSquare,
  BookOpen,
  ImageIcon,
  ArrowLeft,
  Package,
  Headphones,
  Monitor,
  Search,
  Plus,
  Minus,
  Trash2,
  Download,
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
  Store,
  FileText,
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
  ArrowDown
} from "lucide-react";
import Footer from "@/app/components/Footer";
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
  regDate: string; // 가맹 등록일
  cancelDate?: string; // 가맹 해지일
  adoptionMenu: string[]; // 도입메뉴 (e.g. ["120pie", "egg120", "츄러스120"])
  monthlySales: number; // 월매출 (통계 호환용)
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
}

// ==========================================
// INITIAL MOCK DATA SEEDS (FALLBACKS)
// ==========================================
const DEFAULT_STORES: StoreInfo[] = [
  {
    id: "owner",
    pw: "owner",
    pwConfirm: "owner",
    name: "강남역삼점",
    owner: "김지훈",
    phone: "010-3813-1200",
    status: "승인",
    roadAddress: "경기 군포시 엘에스로 143 (금정동, 1층 1001호)",
    detailAddress: "1층 1001호",
    regDate: "2026-05-01",
    cancelDate: "",
    adoptionMenu: ["120pie", "egg120", "츄러스120", "핫도그120", "120coffee"],
    monthlySales: 12800000
  },
  {
    id: "hongdae",
    pw: "owner123",
    pwConfirm: "owner123",
    name: "홍대입구점",
    owner: "이민우",
    phone: "010-4211-5678",
    status: "승인",
    roadAddress: "서울 마포구 양화로 160 (동교동)",
    detailAddress: "2층 201호",
    regDate: "2026-04-12",
    cancelDate: "",
    adoptionMenu: ["120pie", "egg120", "츄러스120"],
    monthlySales: 15400000
  },
  {
    id: "seomyeon",
    pw: "owner456",
    pwConfirm: "owner456",
    name: "부산서면점",
    owner: "박수진",
    phone: "010-5182-9012",
    status: "대기",
    roadAddress: "부산 부산진구 중앙대로 730 (부전동)",
    detailAddress: "1층",
    regDate: "2026-05-20",
    cancelDate: "",
    adoptionMenu: ["120pie", "120coffee"],
    monthlySales: 9600000
  }
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

  const saveOrderMutation = useMutation(api.orders.createOrUpdate);
  const syncOrdersMutation = useMutation(api.orders.syncOrders);
  const updateOrderStatusMutation = useMutation(api.orders.updateStatus);
  const updateTrackingMutation = useMutation(api.orders.updateTracking);
  const deleteOrderMutation = useMutation(api.orders.deleteOrder);

  const convexMaterials = useQuery(api.materials.list);
  const saveMaterialMutation = useMutation(api.materials.createOrUpdate);
  const deleteMaterialMutation = useMutation(api.materials.deleteMaterial);

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

  useEffect(() => {
    if (convexStores) {
      if (convexStores.length === 0) {
        seedStoresMutation().then(() => {
          console.log("[Convex] Seed stores completed.");
        });
      } else {
        setStores(convexStores as any[]);
        localStorage.setItem("120_stores", JSON.stringify(convexStores));
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
  
  const initialContractForm: ContractFormType = {
    ownerName: "",
    ownerBirth: "",
    ownerPhone: "",
    storeAddress: "",
    storeName: "",
    storeSize: "",
    businessArea: "",
    contractStart: "",
    contractEnd: "",
    supervisionFee: "",
    initialFranchiseFee: "",
    depositMembershipFee: "",
    depositEduFee: "",
    depositSupportFee: "",
    depositGuaranteeFee: "",
    depositTotalFee: "",
    royaltyFee: "",
    guaranteeFee: "",
    eduOpenFee: "",
    eduNewFee: "",
    initialSupplyFee: "",
    reFranchiseFee: "",
    penaltyFee: "",
    status: "기본정보 등록",
    fileUrl: "",
    fileName: "",
    contractType: "신규",
  };
  const [contractForm, setContractForm] = useState<ContractFormType>(initialContractForm);

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
      if (updated) {
        setSelectedContract(updated);
      }
    }
  }, [contracts, selectedContract]);

  // Formatting and Change handlers for Contract Form
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
      }
      return updated;
    });
  };

  const handleApplyAllDefaults = () => {
    setContractForm((prev) => ({
      ...prev,
      supervisionFee: 3300000,
      initialFranchiseFee: 5000000,
      depositMembershipFee: 1100000,
      depositEduFee: 2200000,
      depositSupportFee: 1700000,
      depositGuaranteeFee: 1000000,
      depositTotalFee: 6000000,
      royaltyFee: 150000,
      guaranteeFee: 1000000,
      eduOpenFee: 2200000,
      eduNewFee: 220000,
      initialSupplyFee: 4400000,
      reFranchiseFee: 1100000,
      penaltyFee: 1000000,
    }));
    triggerToast("기본 계약 금액들이 일괄 적용되었습니다.");
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
      alert("가맹점 주소를 검색하여 입력해 주세요.");
      return;
    }
    
    const sanitizeNumber = (val: any) => {
      if (val === "" || val === undefined || val === null) return 0;
      return Number(val);
    };

    const submitData = {
      ownerName: contractForm.ownerName,
      ownerBirth: contractForm.ownerBirth,
      ownerPhone: contractForm.ownerPhone,
      storeAddress: combinedAddress,
      storeName: contractForm.storeName,
      storeSize: sanitizeNumber(contractForm.storeSize),
      businessArea: contractForm.businessArea,
      contractStart: contractForm.contractStart,
      contractEnd: contractForm.contractEnd,
      supervisionFee: sanitizeNumber(contractForm.supervisionFee),
      initialFranchiseFee: sanitizeNumber(contractForm.initialFranchiseFee),
      depositMembershipFee: sanitizeNumber(contractForm.depositMembershipFee),
      depositEduFee: sanitizeNumber(contractForm.depositEduFee),
      depositSupportFee: sanitizeNumber(contractForm.depositSupportFee),
      depositGuaranteeFee: sanitizeNumber(contractForm.depositGuaranteeFee),
      depositTotalFee: sanitizeNumber(contractForm.depositTotalFee),
      royaltyFee: sanitizeNumber(contractForm.royaltyFee),
      guaranteeFee: sanitizeNumber(contractForm.guaranteeFee),
      eduOpenFee: sanitizeNumber(contractForm.eduOpenFee),
      eduNewFee: sanitizeNumber(contractForm.eduNewFee),
      initialSupplyFee: sanitizeNumber(contractForm.initialSupplyFee),
      reFranchiseFee: sanitizeNumber(contractForm.reFranchiseFee),
      penaltyFee: sanitizeNumber(contractForm.penaltyFee),
      status: contractForm.status || "기본정보 등록",
      fileUrl: contractForm.fileUrl || "",
      fileName: contractForm.fileName || "",
      contractType: contractForm.contractType || "신규",
      id: isContractEditMode && selectedContract ? selectedContract._id : undefined,
      createdAt: isContractEditMode && selectedContract ? selectedContract.createdAt : getFormattedDateTime(),
    };
    
    saveContractMutation(submitData as any)
      .then((res) => {
        triggerToast(isContractEditMode ? "계약 정보가 수정되었습니다." : "신규 계약 정보가 등록되었습니다.");
        setIsContractFormOpen(false);
        if (res && res.contractId) {
          const newOrUpdated = { ...submitData, _id: res.contractId };
          setSelectedContract(newOrUpdated as any);
        }
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
          <label className="block text-xs font-black text-[#bf3e67] border-l-2 border-[#bf3e67] pl-1.5 mb-0.5">{label}</label>
          <button
            type="button"
            onClick={() => handleApplyIndividualDefault(field, defaultVal)}
            className="text-[10px] text-[#bf3e67] font-black border border-[#f2ccd7] bg-[#fff9fb]/40 hover:bg-[#ffd3df]/30 px-2 py-0.5 rounded transition-all cursor-pointer"
          >
            기본적용
          </button>
        </div>
        <div className="relative">
          <input
            type="text"
            value={formatPriceInput(value)}
            onChange={(e) => handlePriceChange(field, e.target.value)}
            className={`w-full px-3.5 py-2 pr-8 border rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#bf3e67] font-bold text-[#2d2026] ${
              !hasValue ? "border-rose-400 bg-rose-50/10" : "border-[#f2ccd7]"
            }`}
            placeholder={formatPriceInput(defaultVal)}
          />
          <span className="absolute right-3.5 top-2.5 text-xs text-[#735965] font-bold">원</span>
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-[11px] text-[#bf3e67] font-semibold bg-[#fff9fb] border border-[#f2ccd7]/60 rounded-lg p-2 mt-0.5">
            {getFormattedKoreanAmount(value, placeholderStr)}
          </div>
          {!hasValue && (
            <span className="text-[10px] text-rose-500 font-bold flex items-center gap-1 pl-1">
              ⚠️ 기본적용을 원하시면 우측의 '기본적용' 버튼을 누르거나 직접 숫자를 기입해주세요. (미입력시 저장시 기본값 적용)
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
          <span className="font-bold text-[#735965] border-l border-[#bf3e67] pl-1">{label}</span>
          <button
            type="button"
            onClick={() => handleApplyIndividualDefault(field, defaultVal)}
            className="text-[9px] text-[#bf3e67] font-black border border-[#f2ccd7] bg-white hover:bg-[#ffd3df]/20 px-1.5 py-0.5 rounded transition-all cursor-pointer"
          >
            기본적용
          </button>
        </div>
        <div className="relative">
          <input
            type="text"
            value={formatPriceInput(value)}
            onChange={(e) => handlePriceChange(field, e.target.value)}
            className={`w-full px-3 py-1.5 pr-8 border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#bf3e67] font-bold text-[#2d2026] ${
              !hasValue ? "border-rose-400 bg-rose-50/10" : "border-[#f2ccd7]"
            }`}
            placeholder={formatPriceInput(defaultVal)}
          />
          <span className="absolute right-3 top-2 text-[10px] text-[#735965] font-bold">원</span>
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
      <div className="flex items-center justify-between py-2 border-b border-[#ffd3df]/20 last:border-b-0 min-w-0 w-full gap-2">
        <span className="font-bold text-[#735965] w-32 sm:w-40 lg:w-48 shrink-0 text-left truncate" title={label}>{label}</span>
        <span className="font-extrabold text-[#2d2026] text-right flex-1 break-all min-w-0 mr-1 sm:mr-3">{val}</span>
        <button
          type="button"
          onClick={() => handleCopyText(val, label)}
          className="text-[10px] text-[#bf3e67] font-black border border-[#f2ccd7] bg-[#fff9fb] hover:bg-[#ffd3df]/20 px-2 py-0.5 rounded transition-all shrink-0 cursor-pointer"
        >
          복사
        </button>
      </div>
    );
  };

  const renderTableDetailRow = (label: string, val: number) => {
    const formattedVal = val.toLocaleString();
    return (
      <tr className="border-b border-[#f2ccd7] hover:bg-[#fff9fb]/45 transition-colors text-xs">
        <td className="p-2 border-r border-[#f2ccd7] font-bold text-[#735965]">{label}</td>
        <td className="p-2 font-extrabold text-[#2d2026]">
          <div className="flex items-center justify-between gap-2">
            <span>{formattedVal}</span>
            <button
              type="button"
              onClick={() => handleCopyText(formattedVal, label)}
              className="text-[10px] text-[#bf3e67] border border-[#f2ccd7] bg-white hover:bg-[#ffd3df]/20 px-1.5 py-0.5 rounded transition-all cursor-pointer font-bold shrink-0"
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

  // Road Address Search Simulation
  const [showAddressPopup, setShowAddressPopup] = useState<boolean>(false);
  const [addressTab, setAddressTab] = useState<"kakao" | "simulated">("kakao");
  const [addressSearchKeyword, setAddressSearchKeyword] = useState<string>("");
  const [addressSearchResults, setAddressSearchResults] = useState<string[]>([]);

  // 2. PRODUCT MANAGEMENT STATES
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductModal, setShowProductModal] = useState<boolean>(false);
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
    return orders.filter((order) => {
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
        const orderDateStr = order.date;
        
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

        if (start && orderDateStr < start) return false;
        if (end && orderDateStr > end) return false;
      }

      return true;
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
        order.date,
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
      setPrs(loadState("120_prs", []));

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
    if (convexProducts !== undefined) {
      const sorted = [...convexProducts].sort((a, b) => a.orderIndex - b.orderIndex);
      setProducts(sorted as any);
      localStorage.setItem("120_products", JSON.stringify(sorted));
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
  const handleMaterialFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setNewMaterialFileUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCreateMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMaterialTitle || !newMaterialDesc) {
      alert("제목과 설명을 입력해 주세요.");
      return;
    }

    const todayStr = new Date().toISOString().split("T")[0];

    const payload: any = {
      title: newMaterialTitle,
      date: todayStr,
      size: newMaterialSize,
      format: newMaterialFormat,
      desc: newMaterialDesc,
      img: newMaterialImg || undefined,
      fileUrl: newMaterialFileUrl || undefined,
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
      localStorage.setItem("120_trainings", JSON.stringify(updated));
    } else {
      const updated = [newMat, ...prs];
      setPrs(updated as any);
      localStorage.setItem("120_prs", JSON.stringify(updated));
    }

    // 폼 초기화
    setNewMaterialTitle("");
    setNewMaterialDesc("");
    setNewMaterialImg("");
    setNewMaterialFileUrl("");
    setNewMaterialFileName("");
    setShowMaterialModal(false);
    triggerToast(`신규 ${materialType === "training" ? "교육" : "홍보"}자료가 성공적으로 등록되었습니다!`);
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
      monthlySales: selectedStore ? selectedStore.monthlySales : 0
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

    // Save to Convex Cloud DB
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
      regDate: storeRegDate || new Date().toISOString().split("T")[0],
      cancelDate: storeCancelDate || undefined,
      adoptionMenu: storeAdoptionMenu,
      monthlySales: selectedStore ? selectedStore.monthlySales : 0
    }).then(() => {
      console.log("[Convex] Store created/updated successfully.");
    }).catch((err) => {
      console.error("[Convex] Failed to save store:", err);
    });

    setStores(updatedStores);
    localStorage.setItem("120_stores", JSON.stringify(updatedStores));
    setShowStoreModal(false);
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
  const handleCreateOrUpdateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productCategory || !productName || !productModelName || !productImg) {
      alert("필수 입력값을 입력해 주세요.");
      return;
    }

    const priceVal = parseNumberFromCommas(productPrice);
    const discVal = parseNumberFromCommas(productDiscountAmount);
    const supplyVal = parseNumberFromCommas(productSupplyPrice);
    const discountedPriceVal = priceVal - discVal;

    const productData: Product = {
      id: selectedProduct ? selectedProduct.id : `prod-${Math.floor(100 + Math.random() * 900)}`,
      orderIndex: selectedProduct ? selectedProduct.orderIndex : products.length + 1,
      name: productName,
      category: productCategory,
      modelName: productModelName,
      unit: productUnit,
      qty: productQty,
      supplyPrice: supplyVal,
      price: priceVal,
      discountAmount: discVal,
      discountedPrice: discountedPriceVal < 0 ? 0 : discountedPriceVal,
      img: productImg,
      detailImg: productDetailImg || undefined,
      detailText: productDetailText || undefined,
      isActive: productStatus !== "단종",
      desc: `${productModelName} - ${productCategory} 표준 규격`,
      stock: productStatus === "품절" ? "out_of_stock" : "in_stock",
      status: productStatus,
      labels: productLabels,
      shippingType: productShippingType,
      options: productOptions.length > 0 ? productOptions : undefined
    };

    let updatedProducts: Product[];
    if (selectedProduct) {
      updatedProducts = products.map((p) => (p.id === selectedProduct.id ? productData : p));
      triggerToast(`'${productName}' 제품이 정상 수정되었습니다.`);
    } else {
      updatedProducts = [...products, productData];
      triggerToast(`신규 제품 '${productName}'이 성공적으로 등록되었습니다.`);
    }

    const sortedProducts = [...updatedProducts].sort((a, b) => a.orderIndex - b.orderIndex);
    setProducts(sortedProducts);
    localStorage.setItem("120_products", JSON.stringify(sortedProducts));

    // Save to Convex Cloud DB
    saveProductMutation({
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
    }).then(() => {
      console.log("[Convex] Product saved successfully.");
    }).catch(err => {
      console.error("[Convex] Failed to save product to cloud DB:", err);
    });

    setShowProductModal(false);
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
  const handleAdjustProductOrder = (productId: string, direction: "up" | "down") => {
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

    const sortedUpdated = updated.sort((a, b) => a.orderIndex - b.orderIndex);
    setProducts(sortedUpdated);
    localStorage.setItem("120_products", JSON.stringify(sortedUpdated));
    triggerToast("제품 전시 순서가 실시간으로 재정렬되었습니다.");
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
      img.src = base64Str;
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
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", quality));
        } else {
          resolve(base64Str);
        }
      };
      img.onerror = () => {
        resolve(base64Str);
      };
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

  const handleOpenInstaEdit = (item: any) => {
    setInstaId(item._id);
    setInstaImg(item.img);
    setInstaText(item.text);
    setInstaLink(item.link);
    setInstaDate(item.date);
    setInstaOrder(item.orderIndex);
    setInstaIsMain(item.isMain ?? false);
    setIsInstaModalOpen(true);
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
          const compressed = await compressImage(reader.result, 800, 800, 0.7);
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
          const compressed = await compressImage(reader.result, 1200, 8000, 0.85);
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
      <div id="admin-portal" className="h-screen bg-[#fff9fb] flex items-center justify-center font-bold text-[#bf3e67]">
        인증 상태 확인 중...
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div id="admin-portal" className="h-screen w-screen text-[#0D233A] flex flex-col font-sans antialiased justify-center items-center p-4" style={{ backgroundColor: '#ffffff' }}>
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-[150] bg-[#f25f8a] text-white px-5 py-3.5 rounded-xl font-bold text-sm shadow-[0_8px_30px_rgba(242,95,138,0.25)] flex items-center gap-2.5 animate-bounce">
            <CheckCircle2 size={16} />
            {toastMessage}
          </div>
        )}
        
        <div className="max-w-md w-full bg-white border border-[#f2ccd7] rounded-3xl p-8 sm:p-10 shadow-[0_12px_40px_rgba(242,204,215,0.25)] space-y-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#ffd3df] via-[#f25f8a] to-[#bf3e67]"></div>
          
          <div className="text-center space-y-4">
            <div className="inline-flex w-16 h-16 rounded-2xl bg-[#fff1f5] border border-[#f2ccd7] p-2 items-center justify-center shadow-sm">
              <img
                src="/logo_yellow_blue.png"
                alt="120pie 로고"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-xl sm:text-2xl font-black text-[#2d2026] tracking-tight">120pie Head Office</h2>
              <p className="text-xs font-bold text-[#bf3e67] bg-[#ffd3df] px-3 py-1 rounded-full w-fit mx-auto border border-[#f2ccd7]">
                통합 본사 어드민 포털
              </p>
            </div>
            <p className="text-[11px] text-[#735965] font-semibold leading-relaxed">
              본 시스템은 120겹파이 가맹본부 관리자용 관리 화면입니다. 인가된 본사 ID로 로그인해 주세요.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-5">
            {loginError && (
              <div className="bg-red-50 border border-red-200 text-red-500 rounded-xl p-3.5 text-xs font-bold flex items-center gap-2">
                <AlertCircle size={15} />
                <span>{loginError}</span>
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#735965] block">본사 관리자 ID</label>
              <input
                type="text"
                placeholder="ID를 입력하세요"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                required
                className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-4 py-3 text-xs sm:text-sm text-[#2d2026] placeholder-[#735965]/40 focus:outline-none focus:border-[#f25f8a] transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#735965] block">보안 비밀번호</label>
              <input
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={loginPw}
                onChange={(e) => setLoginPw(e.target.value)}
                required
                className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-4 py-3 text-xs sm:text-sm text-[#2d2026] placeholder-[#735965]/40 focus:outline-none focus:border-[#f25f8a] transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#f25f8a] hover:bg-[#df4977] text-white text-sm font-bold rounded-xl transition-all shadow-[0_4px_16px_rgba(242,95,138,0.2)] flex items-center justify-center gap-2 hover:scale-[1.01]"
            >
              로그인 완료
            </button>
          </form>


          
          <div className="text-center pt-2">
            <Link href="/" className="text-xs text-[#735965] hover:text-[#bf3e67] hover:underline font-bold transition-all flex items-center justify-center gap-1">
              ← 메인 랜딩 페이지로 돌아가기
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
    <div id="admin-portal" className="h-screen overflow-hidden text-[#0D233A] flex flex-col font-sans antialiased" style={{ backgroundColor: '#ffffff' }}>
      
      {/* TOAST SYSTEM */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[150] bg-[#f25f8a] text-white px-5 py-3.5 rounded-xl font-bold text-sm shadow-[0_8px_30px_rgba(242,95,138,0.25)] flex items-center gap-2.5 animate-bounce">
          <CheckCircle2 size={16} />
          {toastMessage}
        </div>
      )}

      {/* HEADER BAR */}
      <header className="bg-white border-b border-[#f2ccd7] sticky top-0 z-40 shrink-0 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[76px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#735965] hover:text-[#f25f8a] transition-colors"
              aria-label="메뉴 열기"
            >
              <Menu size={22} />
            </button>
            <Link href="/admin" className="flex items-center gap-2 group shrink-0">
              <img
                src="/logo_yellow_blue.png"
                alt="120pie & coffee"
                className="h-6 w-auto object-contain group-hover:scale-102 transition-transform"
              />
              <span className="font-extrabold text-xs text-[#735965] ml-1.5 hidden sm:inline uppercase tracking-wider">Head Office</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200 font-bold ml-1">본사 어드민</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end text-right">
              <span className="font-extrabold text-sm text-[#2d2026]">가맹사업지원센터 본사</span>
              <span className="text-[10px] text-[#735965] font-bold">마스터 최고 관리자</span>
            </div>
            
            <div className="h-8 w-px bg-[#f2ccd7] hidden md:block"></div>

            <Link
              href="/"
              className="px-3.5 py-2.5 rounded-lg border border-[#f2ccd7] bg-[#fff1f5] hover:bg-[#ffd3df] text-xs font-bold text-[#735965] hover:text-[#bf3e67] transition-colors inline-flex items-center gap-1.5"
            >
              <ArrowLeft size={13} />
              <span className="hidden sm:inline">메인 사이트</span>
            </Link>
          </div>
        </div>
      </header>

      {/* CORE WORKSPACE */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto relative items-stretch min-h-0">
        
        {/* SIDEBAR NAVIGATION (DESKTOP) */}
        <aside className="w-64 border-r border-[#D0CBB5] p-6 flex flex-col justify-between hidden lg:flex shrink-0" style={{ backgroundColor: '#F5AC00' }}>
          <div className="space-y-8">
            <div className="bg-white border border-[#f2ccd7] rounded-xl p-4 flex gap-3 items-center shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-[#bf3e67] text-white flex items-center justify-center font-bold text-sm shrink-0">
                HQ
              </div>
              <div className="overflow-hidden">
                <h4 className="font-extrabold text-xs text-[#2d2026] truncate">120 가맹지원본부</h4>
                <p className="text-[10px] text-[#735965] font-semibold truncate mt-0.5">Admin ID: HQ-ADMIN</p>
              </div>
            </div>

            <nav className="flex flex-col gap-1.5">
              {[
                { key: "dashboard", label: "대시보드", icon: LayoutDashboard },
                { key: "store", label: "가맹점 관리", icon: Store },
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
              ].map(({ key, label, icon: Icon, badge }) => (
                <button
                  key={key}
                  onClick={() => {
                    setCurrentMenu(key);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full px-4 py-3 rounded-xl flex items-center justify-between text-sm font-bold transition-all ${
                    currentMenu === key
                      ? "bg-[#f25f8a] text-white shadow-sm font-extrabold"
                      : "text-[#735965] hover:text-[#bf3e67] hover:bg-[#ffd3df]/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} className={currentMenu === key ? "text-white" : "text-[#735965]"} />
                    <span>{label}</span>
                  </div>
                  {badge && (
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      currentMenu === key ? "bg-white text-[#bf3e67]" : "bg-[#f25f8a] text-white"
                    }`}>
                      {badge}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          <div className="border-t border-[#f2ccd7] pt-6">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-bold text-[#735965] hover:text-red-500 hover:bg-red-50 transition-colors text-left"
            >
              <LogOut size={17} />
              <span>로그아웃</span>
            </button>
          </div>
        </aside>

        {/* MOBILE SIDEBAR */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:hidden flex" onClick={() => setMobileMenuOpen(false)}>
            <div className="w-72 border-r border-[#D0CBB5] h-full p-6 flex flex-col justify-between" onClick={(e) => e.stopPropagation()} style={{ backgroundColor: '#F5AC00' }}>
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-[#f2ccd7] pb-4">
                  <div className="flex items-center gap-2">
                    <img
                      src="https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784533894/Group_1_4_jl4rlr.png"
                      alt="로고"
                      className="w-7 h-7"
                    />
                    <span className="font-extrabold text-sm text-[#2d2026]">본사 어드민</span>
                  </div>
                  <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-[#735965] hover:text-[#f25f8a] bg-[#fff1f5] border border-[#f2ccd7] rounded-lg">
                    <X size={16} />
                  </button>
                </div>

                <div className="bg-[#fff1f5] border border-[#f2ccd7] rounded-xl p-4 flex gap-3 items-center">
                  <div className="w-10 h-10 rounded-lg bg-[#bf3e67] text-white flex items-center justify-center font-bold text-sm shrink-0">
                    HQ
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-[#2d2026]">120 가맹지원본부</h4>
                    <p className="text-[10px] text-[#735965] font-semibold mt-0.5">Admin ID: HQ-ADMIN</p>
                  </div>
                </div>

                <nav className="flex flex-col gap-1">
                  {[
                    { key: "dashboard", label: "대시보드", icon: LayoutDashboard },
                    { key: "store", label: "가맹점 관리", icon: Store },
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
                  ].map(({ key, label, icon: Icon, badge }) => (
                    <button
                      key={key}
                      onClick={() => {
                        setCurrentMenu(key);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full px-4 py-3 rounded-xl flex items-center justify-between text-sm font-bold transition-all ${
                        currentMenu === key
                          ? "bg-[#f25f8a] text-white shadow-sm font-extrabold"
                          : "text-[#735965] hover:text-[#bf3e67] hover:bg-[#ffd3df]/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={18} className={currentMenu === key ? "text-white" : "text-[#735965]"} />
                        <span>{label}</span>
                      </div>
                      {badge && (
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                          currentMenu === key ? "bg-white text-[#bf3e67]" : "bg-[#f25f8a] text-white"
                        }`}>
                          {badge}
                        </span>
                      )}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="border-t border-[#f2ccd7] pt-6">
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-bold text-[#735965] hover:text-red-500 hover:bg-red-50 transition-colors text-left"
                >
                  <LogOut size={17} />
                  <span>로그아웃</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-full">
          
          {/* ==========================================
              MENU: 1. DASHBOARD
             ========================================== */}
          {currentMenu === "dashboard" && (
            <div className="space-y-6">
              
              {/* Summary Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <button 
                  onClick={() => setCurrentMenu("store")}
                  className="bg-white border border-[#f2ccd7] hover:border-[#f25f8a] hover:bg-[#fff9fb] transition-all rounded-2xl p-5 flex items-center justify-between shadow-sm text-left group cursor-pointer"
                >
                  <div>
                    <span className="text-xs text-[#735965] font-bold block mb-1">총 등록 가맹점</span>
                    <strong className="text-2xl font-black text-[#2d2026]">{stores.length} <span className="text-xs text-[#735965] font-normal">개 매장</span></strong>
                  </div>
                  <div className="bg-[#ffd3df] text-[#bf3e67] group-hover:bg-[#f25f8a] group-hover:text-white p-3 rounded-xl transition-all">
                    <Store size={22} />
                  </div>
                </button>

                <button 
                  onClick={() => setCurrentMenu("order")}
                  className="bg-white border border-[#f2ccd7] hover:border-[#f25f8a] hover:bg-[#fff9fb] transition-all rounded-2xl p-5 flex items-center justify-between shadow-sm text-left group cursor-pointer"
                >
                  <div>
                    <span className="text-xs text-[#735965] font-bold block mb-1">오늘 접수된 주문</span>
                    <strong className="text-2xl font-black text-[#f25f8a]">{orders.length} <span className="text-xs text-[#735965] font-normal">건</span></strong>
                  </div>
                  <div className="bg-[#ffd3df] text-[#bf3e67] group-hover:bg-[#f25f8a] group-hover:text-white p-3 rounded-xl transition-all">
                    <ShoppingBag size={22} />
                  </div>
                </button>

                <button 
                  onClick={() => setCurrentMenu("inquiry")}
                  className="bg-white border border-[#f2ccd7] hover:border-[#f25f8a] hover:bg-[#fff9fb] transition-all rounded-2xl p-5 flex items-center justify-between shadow-sm text-left group cursor-pointer"
                >
                  <div>
                    <span className="text-xs text-[#735965] font-bold block mb-1">답변대기 1:1 문의</span>
                    <strong className="text-2xl font-black text-[#2d2026]">{pendingInquiriesCount} <span className="text-xs text-[#735965] font-normal">건</span></strong>
                  </div>
                  <div className="bg-[#ffd3df] text-[#bf3e67] group-hover:bg-[#f25f8a] group-hover:text-white p-3 rounded-xl transition-all">
                    <MessageSquare size={22} />
                  </div>
                </button>

                <button 
                  onClick={() => setCurrentMenu("consultation")}
                  className="bg-white border border-[#f2ccd7] hover:border-[#f25f8a] hover:bg-[#fff9fb] transition-all rounded-2xl p-5 flex items-center justify-between shadow-sm text-left group cursor-pointer"
                >
                  <div>
                    <span className="text-xs text-[#735965] font-bold block mb-1">창업 상담문의</span>
                    <strong className="text-2xl font-black text-[#2d2026]">{consultations.length} <span className="text-xs text-[#735965] font-normal">건</span></strong>
                  </div>
                  <div className="bg-[#ffd3df] text-[#bf3e67] group-hover:bg-[#f25f8a] group-hover:text-white p-3 rounded-xl transition-all">
                    <Headphones size={22} />
                  </div>
                </button>
              </div>

              {/* Store Management Table Summary */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-[#2d2026]">전국 가맹점 마스터 대장</h3>
                  <p className="text-xs text-[#735965] font-bold mt-1">현재 정식 계약 체결 후 운영 중인 브랜드 매장 리스트와 월 예상 누적 매출입니다.</p>
                </div>

                <div className="bg-white border border-[#f2ccd7] rounded-2xl overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#fff1f5] border-b border-[#f2ccd7] text-[11px] font-bold text-[#735965] uppercase tracking-wider">
                          <th className="p-4 sm:p-5">점포 코드</th>
                          <th className="p-4 sm:p-5">가맹점명</th>
                          <th className="p-4 sm:p-5">점주명</th>
                          <th className="p-4 sm:p-5">도입 메뉴 수</th>
                          <th className="p-4 sm:p-5">월 매출 요약</th>
                          <th className="p-4 sm:p-5">상태</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#f2ccd7]/60 text-xs">
                        {stores.map((store) => (
                          <tr key={store.id} className="hover:bg-[#fff9fb] transition-colors">
                            <td className="p-4 sm:p-5 font-bold text-[#bf3e67]">{store.id}</td>
                            <td className="p-4 sm:p-5 text-[#2d2026] font-bold">{store.name}</td>
                            <td className="p-4 sm:p-5 text-[#735965] font-semibold">
                              <span>{store.owner}</span>
                              <span className="text-[10px] block mt-0.5 opacity-60">{store.phone}</span>
                            </td>
                            <td className="p-4 sm:p-5">
                              <span className="bg-[#ffd3df] text-[#bf3e67] font-bold px-2.5 py-0.5 rounded-full text-[10px] border border-[#f2ccd7]">
                                {store.adoptionMenu ? store.adoptionMenu.length : 0}개 모듈 가동중
                              </span>
                            </td>
                            <td className="p-4 sm:p-5 font-bold text-[#2d2026]">
                              {store.monthlySales > 0 ? `${store.monthlySales.toLocaleString()} 원` : "정산 대기"}
                            </td>
                            <td className="p-4 sm:p-5">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
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
            <div className="flex flex-col lg:flex-row gap-6 h-auto min-h-[calc(100vh-140px)] animate-fadeIn w-full min-w-0">
              {/* LEFT SIDEBAR: CONTRACTOR LIST */}
              <div className="w-full lg:w-80 bg-white border border-[#f2ccd7] rounded-2xl p-4 flex flex-col shadow-sm shrink-0">
                <div className="mb-4">
                  <h3 className="text-lg font-extrabold text-[#2d2026] mb-1">가맹계약 관리</h3>
                  <p className="text-xs text-[#735965] font-bold">계약자 목록을 조회하고 새 계약 정보를 등록할 수 있습니다.</p>
                </div>
                
                <button
                  type="button"
                  onClick={() => {
                    setContractForm(initialContractForm);
                    setContractRoadAddress("");
                    setContractDetailAddress("");
                    setIsContractEditMode(false);
                    setIsContractFormOpen(true);
                    setSelectedContract(null);
                  }}
                  className="w-full py-2.5 mb-4 rounded-xl bg-[#bf3e67] hover:bg-[#a03153] text-white font-extrabold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <Plus size={16} />
                  <span>계약정보 신규 등록</span>
                </button>
                
                {/* Search Contractor */}
                <div className="relative mb-4">
                  <input
                    type="text"
                    placeholder="계약자명 검색..."
                    value={contractSearchQuery.trim() === "" ? "" : contractSearchQuery}
                    onChange={(e) => {
                      setContractSearchQuery(e.target.value);
                    }}
                    className="w-full pl-9 pr-4 py-2 border border-[#f2ccd7] rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#bf3e67] bg-[#fff9fb] text-[#2d2026] font-bold"
                  />
                  <Search size={14} className="absolute left-3 top-3 text-[#735965]" />
                </div>
                
                {/* Contractor List Scroll */}
                <div className="flex-1 overflow-y-auto pr-1 space-y-2 max-h-[400px] lg:max-h-[600px]">
                  {filteredContracts.length === 0 ? (
                    <div className="text-center py-8 text-xs text-[#735965] font-bold">
                      등록된 계약자가 없습니다.
                    </div>
                  ) : (
                    filteredContracts.map((c) => {
                      let statusBg = "bg-blue-50 text-blue-600 border border-blue-100";
                      if (c.status === "계약서 발송완료") statusBg = "bg-amber-50 text-amber-600 border border-amber-100";
                      else if (c.status === "계약서 서명완료") statusBg = "bg-emerald-50 text-emerald-600 border border-emerald-100";
                      else if (c.status === "계약서 진행취소") statusBg = "bg-neutral-50 text-neutral-500 border border-neutral-200";
                      
                      return (
                        <button
                          key={c._id}
                          type="button"
                          onClick={() => {
                            setSelectedContract(c);
                            setIsContractFormOpen(false);
                          }}
                          className={`w-full text-left p-3.5 rounded-xl border transition-all flex flex-col gap-1.5 ${
                            selectedContract?._id === c._id
                              ? "bg-[#ffd3df]/35 border-[#bf3e67] shadow-sm ring-1 ring-[#bf3e67]/30"
                              : "bg-[#fff9fb]/40 border-[#f2ccd7] hover:border-[#f25f8a] hover:bg-[#ffd3df]/10"
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="font-extrabold text-sm text-[#2d2026]">{c.ownerName}</span>
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${statusBg}`}>
                              {c.status}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-[#735965] font-semibold">
                            <span>{c.storeName || "가맹점명 미정"}</span>
                            <span>{c.createdAt.split(" ")[0]}</span>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
              
              {/* RIGHT CONTENT: DETAIL VIEW OR FORM */}
              <div className="flex-1 bg-white border border-[#f2ccd7] rounded-2xl p-6 flex flex-col shadow-sm min-w-0 w-full">
                {isContractFormOpen ? (
                  /* REGISTRATION / EDIT FORM */
                  <form onSubmit={handleContractSubmit} className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#f2ccd7]">
                      <div>
                        <h3 className="text-lg font-black text-[#2d2026]">
                          {isContractEditMode ? "계약 정보 수정" : "계약 정보 등록"}
                        </h3>
                        <p className="text-xs text-[#735965] font-bold mt-0.5">가맹계약서 작성을 위한 기본 금액 및 계약자 인적 정보를 입력합니다.</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleApplyAllDefaults}
                        className="px-4 py-2 bg-[#ffd3df] hover:bg-[#f2ccd7] text-[#bf3e67] text-xs font-bold rounded-lg transition-colors border border-[#f2ccd7] shrink-0 cursor-pointer"
                      >
                        기본금액 일괄적용
                      </button>
                    </div>
                    
                    {/* FORM FIELDS */}
                    <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
                      {/* Section 1: 인적 정보 */}
                      <div>
                        <h4 className="text-xs font-black text-[#bf3e67] uppercase tracking-wider mb-3 pb-1 border-b border-[#ffd3df]/20">1. 계약자 및 가맹점 인적 정보</h4>
                        
                        {/* 계약 구분 선택 */}
                        <div className="mb-4 bg-[#fff9fb]/40 border border-[#f2ccd7] p-3 rounded-xl flex flex-col gap-2">
                          <span className="text-xs font-black text-[#bf3e67]">계약 구분 <span className="text-red-500">*</span></span>
                          <div className="flex items-center gap-6">
                            {["신규", "갱신", "양수"].map((type) => (
                              <label key={type} className="flex items-center gap-2 cursor-pointer font-bold text-xs text-[#2d2026] select-none">
                                <input
                                  type="radio"
                                  name="contractType"
                                  value={type}
                                  checked={contractForm.contractType === type}
                                  onChange={(e) => setContractForm(prev => ({ ...prev, contractType: e.target.value }))}
                                  className="w-4 h-4 accent-[#bf3e67] cursor-pointer"
                                />
                                {type}
                              </label>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-[#735965] mb-1">가맹사업자명 <span className="text-red-500">*</span></label>
                            <input
                              type="text"
                              required
                              value={contractForm.ownerName}
                              onChange={(e) => setContractForm({ ...contractForm, ownerName: e.target.value })}
                              className="w-full px-3.5 py-2 border border-[#f2ccd7] rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#bf3e67] text-[#2d2026] font-bold"
                              placeholder="홍길동"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-[#735965] mb-1">가맹사업자 생년월일 <span className="text-red-500">*</span></label>
                            <input
                              type="text"
                              required
                              value={contractForm.ownerBirth}
                              onChange={(e) => setContractForm({ ...contractForm, ownerBirth: e.target.value })}
                              className="w-full px-3.5 py-2 border border-[#f2ccd7] rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#bf3e67] text-[#2d2026] font-bold"
                              placeholder="YYYY-MM-DD 또는 900101"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-[#735965] mb-1">가맹사업자 연락처 <span className="text-red-500">*</span></label>
                            <input
                              type="text"
                              required
                              value={contractForm.ownerPhone}
                              onChange={(e) => setContractForm({ ...contractForm, ownerPhone: e.target.value })}
                              className="w-full px-3.5 py-2 border border-[#f2ccd7] rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#bf3e67] text-[#2d2026] font-bold"
                              placeholder="010-1234-5678"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-[#735965] mb-1">가맹점 명칭 <span className="text-red-500">*</span></label>
                            <input
                              type="text"
                              required
                              value={contractForm.storeName}
                              onChange={(e) => setContractForm({ ...contractForm, storeName: e.target.value })}
                              className="w-full px-3.5 py-2 border border-[#f2ccd7] rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#bf3e67] text-[#2d2026] font-bold"
                              placeholder="120겹파이 역삼역점"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-[#735965] mb-1">가맹점 주소 <span className="text-red-500">*</span></label>
                            <div className="flex gap-2 mb-2">
                              <input
                                type="text"
                                required
                                readOnly
                                value={contractRoadAddress}
                                className="flex-1 px-3.5 py-2 border border-[#f2ccd7] rounded-xl text-xs bg-gray-50 text-[#2d2026] font-bold"
                                placeholder="주소 검색 버튼을 눌러 도로명 주소를 입력하세요."
                              />
                              <button
                                type="button"
                                onClick={() => openDaumPostcode("contract")}
                                className="px-4 py-2 bg-[#bf3e67] hover:bg-[#a63053] text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                              >
                                주소 검색
                              </button>
                            </div>
                            <input
                              type="text"
                              value={contractDetailAddress}
                              onChange={(e) => setContractDetailAddress(e.target.value)}
                              className="w-full px-3.5 py-2 border border-[#f2ccd7] rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#bf3e67] text-[#2d2026] font-bold"
                              placeholder="가맹점 상세 주소 (e.g. 2층 202호)"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-[#735965] mb-1">가맹점 규모 (㎡) <span className="text-red-500">*</span></label>
                            <div className="relative">
                              <input
                                type="number"
                                required
                                value={contractForm.storeSize || ""}
                                onChange={(e) => setContractForm({ ...contractForm, storeSize: parseFloat(e.target.value) || 0 })}
                                className="w-full px-3.5 py-2 pr-8 border border-[#f2ccd7] rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#bf3e67] text-[#2d2026] font-bold"
                                placeholder="33"
                              />
                              <span className="absolute right-3.5 top-2 text-xs text-[#735965] font-bold">㎡</span>
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-[#735965] mb-1">영업 지역 <span className="text-red-500">*</span></label>
                            <input
                              type="text"
                              required
                              value={contractForm.businessArea}
                              onChange={(e) => setContractForm({ ...contractForm, businessArea: e.target.value })}
                              className="w-full px-3.5 py-2 border border-[#f2ccd7] rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#bf3e67] text-[#2d2026] font-bold"
                              placeholder="가맹점 반경 500m 내"
                            />
                          </div>
                        </div>
                      </div>
                      
                      {/* Section 2: 계약 기간 */}
                      <div>
                        <h4 className="text-xs font-black text-[#bf3e67] uppercase tracking-wider mb-3 pb-1 border-b border-[#ffd3df]/20">2. 계약 기간</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-[#735965] mb-1">계약 시작일 <span className="text-red-500">*</span></label>
                            <input
                              type="date"
                              required
                              value={contractForm.contractStart}
                              onChange={(e) => setContractForm({ ...contractForm, contractStart: e.target.value })}
                              className="w-full px-3.5 py-2 border border-[#f2ccd7] rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#bf3e67] text-[#2d2026] font-bold"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-[#735965] mb-1">계약 종료일 <span className="text-red-500">*</span></label>
                            <input
                              type="date"
                              required
                              value={contractForm.contractEnd}
                              onChange={(e) => setContractForm({ ...contractForm, contractEnd: e.target.value })}
                              className="w-full px-3.5 py-2 border border-[#f2ccd7] rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#bf3e67] text-[#2d2026] font-bold"
                            />
                          </div>
                        </div>
                      </div>
                      
                      {/* Section 3: 금액 정보 */}
                      <div className="space-y-5">
                        <h4 className="text-xs font-black text-[#bf3e67] uppercase tracking-wider mb-1 pb-1 border-b border-[#ffd3df]/20">3. 금액 정보 설정</h4>
                        
                        {/* 3.1 가맹 및 감리 비용 */}
                        <div className="border border-[#f2ccd7] rounded-xl p-4 bg-[#fff9fb]/10 space-y-4 shadow-sm">
                          <div className="border-b border-[#f2ccd7]/60 pb-2">
                            <span className="block text-xs font-black text-[#bf3e67] uppercase tracking-wider">3-1. 가맹 및 감리 비용</span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {renderAmountInput("supervisionFee", "공사감리비 (부가세 포함)", 3300000, "일금삼백삼십만원(￦3,300,000)")}
                            {renderAmountInput("initialFranchiseFee", "최초가맹금 (부가세 포함)", 5000000, "일금오백만원(￦5,000,000)")}
                          </div>
                        </div>

                        {/* 3.2 예치가맹금 설정 */}
                        <div className="border border-[#f2ccd7] rounded-xl p-4 bg-[#fff9fb]/10 space-y-4 shadow-sm">
                          <div className="flex items-center justify-between border-b border-[#f2ccd7]/60 pb-2">
                            <span className="block text-xs font-black text-[#bf3e67] uppercase tracking-wider">3-2. 예치가맹금 설정</span>
                            <button
                              type="button"
                              onClick={() => {
                                setContractForm((prev) => ({
                                  ...prev,
                                  depositMembershipFee: 1100000,
                                  depositEduFee: 2200000,
                                  depositSupportFee: 1700000,
                                  depositGuaranteeFee: 1000000,
                                  depositTotalFee: 6000000,
                                }));
                                triggerToast("예치가맹금 기본값들이 적용되었습니다.");
                              }}
                              className="text-[9px] text-[#bf3e67] font-black border border-[#f2ccd7] bg-white hover:bg-[#ffd3df]/20 px-2 py-0.5 rounded transition-all cursor-pointer"
                            >
                              예치금 전체 기본적용
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                            {renderTableAmountInput("depositMembershipFee", "가입비", 1100000)}
                            {renderTableAmountInput("depositEduFee", "오픈교육비", 2200000)}
                            {renderTableAmountInput("depositSupportFee", "오픈지원비", 1700000)}
                            {renderTableAmountInput("depositGuaranteeFee", "계약이행보증금", 1000000)}
                            
                            <div className="md:col-span-2 flex items-center justify-between border-t border-[#f2ccd7] pt-3 mt-1">
                              <span className="font-extrabold text-[#bf3e67]">예치가맹금 합계</span>
                              <span className="font-black text-[#bf3e67] text-sm">
                                {contractForm.depositTotalFee ? Number(contractForm.depositTotalFee).toLocaleString() : 0} 원
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* 3.3 로열티 및 보증 비용 */}
                        <div className="border border-[#f2ccd7] rounded-xl p-4 bg-[#fff9fb]/10 space-y-4 shadow-sm">
                          <div className="border-b border-[#f2ccd7]/60 pb-2">
                            <span className="block text-xs font-black text-[#bf3e67] uppercase tracking-wider">3-3. 로열티 및 보증 비용</span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {renderAmountInput("royaltyFee", "로열티 (부가세 포함)", 150000, "일금일십오만원(￦150,000)")}
                            {renderAmountInput("guaranteeFee", "계약이행보증금 (부가세 없음)", 1000000, "일금일백만원(￦1,000,000)")}
                          </div>
                        </div>

                        {/* 3.4 교육비 설정 */}
                        <div className="border border-[#f2ccd7] rounded-xl p-4 bg-[#fff9fb]/10 space-y-4 shadow-sm">
                          <div className="flex items-center justify-between border-b border-[#f2ccd7]/60 pb-2">
                            <span className="block text-xs font-black text-[#bf3e67] uppercase tracking-wider">3-4. 교육비 설정</span>
                            <button
                              type="button"
                              onClick={() => {
                                setContractForm((prev) => ({
                                  ...prev,
                                  eduOpenFee: 2200000,
                                  eduNewFee: 220000,
                                }));
                                triggerToast("교육비 기본값들이 적용되었습니다.");
                              }}
                              className="text-[9px] text-[#bf3e67] font-black border border-[#f2ccd7] bg-white hover:bg-[#ffd3df]/20 px-2 py-0.5 rounded transition-all cursor-pointer"
                            >
                              교육비 전체 기본적용
                            </button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                            {renderTableAmountInput("eduOpenFee", "오픈교육 (최초가맹금에 포함)", 2200000)}
                            {renderTableAmountInput("eduNewFee", "신입교육 (1인 기준)", 220000)}
                          </div>
                        </div>

                        {/* 3.5 초도 및 위약 비용 */}
                        <div className="border border-[#f2ccd7] rounded-xl p-4 bg-[#fff9fb]/10 space-y-4 shadow-sm">
                          <div className="border-b border-[#f2ccd7]/60 pb-2">
                            <span className="block text-xs font-black text-[#bf3e67] uppercase tracking-wider">3-5. 초도 및 위약 비용</span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {renderAmountInput("initialSupplyFee", "초도물품 (부가세 포함)", 4400000, "일금사백사십만원(￦4,400,000)")}
                            {renderAmountInput("reFranchiseFee", "재가맹비 (부가세 포함)", 1100000, "일금일백일십만원(￦1,100,000)")}
                            {renderAmountInput("penaltyFee", "위약금", 1000000, "일금일백만원(￦1,000,000)")}
                          </div>
                        </div>
                      </div>

                      {/* Section 4: 최종 서명 계약서 첨부 */}
                      <div className="mt-6">
                        <h4 className="text-xs font-black text-[#bf3e67] uppercase tracking-wider mb-3 pb-1 border-b border-[#ffd3df]/20">4. 최종 서명 계약서 첨부 (선택사항)</h4>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <input
                              type="file"
                              accept=".pdf"
                              id="contract-pdf-upload"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                if (file.type !== "application/pdf") {
                                  alert("PDF 파일만 업로드 가능합니다.");
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
                                    setContractForm((prev) => ({
                                      ...prev,
                                      fileUrl: result,
                                      fileName: file.name,
                                      status: "계약서 서명완료"
                                    }));
                                    triggerToast("최종 계약서가 업로드되었습니다. 저장 시 적용됩니다.");
                                  }
                                };
                                reader.readAsDataURL(file);
                              }}
                            />
                            <label
                              htmlFor="contract-pdf-upload"
                              className="px-4 py-2.5 bg-white border border-[#f2ccd7] hover:border-[#bf3e67] hover:text-[#bf3e67] text-[#735965] text-xs font-bold rounded-xl transition-colors cursor-pointer inline-flex items-center gap-2"
                            >
                              <Upload size={14} />
                              {contractForm.fileName ? "최종 계약서 재등록" : "최종 계약서 등록"}
                            </label>
                            {contractForm.fileName && (
                              <div className="flex items-center gap-2 text-xs text-[#2d2026] bg-[#fff9fb] border border-[#f2ccd7] px-3 py-2 rounded-xl">
                                <FileText size={16} className="text-[#bf3e67]" />
                                <span className="font-bold truncate max-w-[200px]">{contractForm.fileName}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setContractForm((prev) => ({
                                      ...prev,
                                      fileUrl: "",
                                      fileName: "",
                                      status: "기본정보 등록"
                                    }));
                                  }}
                                  className="text-red-500 hover:text-red-700 font-extrabold ml-1 cursor-pointer"
                                >
                                  삭제
                                </button>
                              </div>
                            )}
                          </div>
                          <p className="text-[10px] text-[#735965] font-bold">
                            * 최종 서명된 계약서 PDF를 등록하면 계약서 상태가 '계약서 서명완료'로 자동 변경됩니다.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Save / Cancel buttons */}
                    <div className="flex items-center gap-3 pt-6 border-t border-[#f2ccd7] shrink-0">
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-[#bf3e67] hover:bg-[#a03153] text-white text-xs font-extrabold rounded-xl transition-colors shadow-sm cursor-pointer"
                      >
                        {isContractEditMode ? "수정 완료" : "등록 하기"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsContractFormOpen(false);
                          if (contracts.length > 0 && !selectedContract) {
                            setSelectedContract(contracts[0]);
                          }
                        }}
                        className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-[#735965] text-xs font-bold rounded-xl transition-colors border border-gray-200 cursor-pointer"
                      >
                        취소
                      </button>
                    </div>
                  </form>
                ) : selectedContract ? (
                  /* DETAIL VIEW */
                  <div className="space-y-6 animate-fadeIn">
                    {/* Status selection and action header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#f2ccd7]">
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-black text-[#2d2026]">{selectedContract.ownerName} 계약자</h3>
                          <span className="text-xs text-[#735965] font-semibold">{selectedContract.storeName}</span>
                        </div>
                        <p className="text-[11px] text-[#735965] font-bold mt-1">등록일시: {selectedContract.createdAt}</p>
                      </div>
                      
                      {/* Action buttons */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={handleStartEditContract}
                          className="px-3.5 py-1.5 bg-white border border-[#f2ccd7] hover:border-[#bf3e67] hover:text-[#bf3e67] text-[#735965] text-xs font-bold rounded-lg transition-colors cursor-pointer"
                        >
                          수정
                        </button>
                        <button
                          type="button"
                          onClick={handleDeleteContractConfirm}
                          className="px-3.5 py-1.5 bg-white border border-red-200 hover:border-red-500 hover:text-red-500 text-[#735965] text-xs font-bold rounded-lg transition-colors cursor-pointer"
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                    
                    {/* CONTRACT STATUS BAR */}
                    <div className="bg-[#fff9fb]/40 border border-[#f2ccd7] rounded-xl p-4 space-y-2.5">
                      <span className="block text-xs font-black text-[#2d2026]">가맹계약 상태값 수정</span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                        {[
                          { status: "기본정보 등록", activeClass: "bg-blue-500 text-white font-extrabold border-blue-500", inactiveClass: "bg-white text-blue-600 border border-blue-200 hover:bg-blue-50/50" },
                          { status: "계약서 발송완료", activeClass: "bg-amber-500 text-white font-extrabold border-amber-500", inactiveClass: "bg-white text-amber-600 border border-amber-200 hover:bg-amber-50/50" },
                          { status: "계약서 서명완료", activeClass: "bg-emerald-500 text-white font-extrabold border-emerald-500", inactiveClass: "bg-white text-emerald-600 border border-emerald-200 hover:bg-emerald-50/50" },
                          { status: "계약서 진행취소", activeClass: "bg-neutral-500 text-white font-extrabold border-neutral-500", inactiveClass: "bg-white text-neutral-600 border border-neutral-300 hover:bg-neutral-50" }
                        ].map((item) => {
                          const isActive = selectedContract.status === item.status;
                          return (
                            <button
                              key={item.status}
                              type="button"
                              onClick={() => handleUpdateContractStatus(item.status)}
                              className={`py-2 rounded-lg text-center transition-all cursor-pointer ${
                                isActive ? item.activeClass : item.inactiveClass
                              }`}
                            >
                              {item.status}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    
                    {/* DETAILS GRID */}
                    <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
                      {/* Section 1: 인적 정보 */}
                      <div className="bg-white border border-[#f2ccd7] rounded-xl overflow-hidden shadow-sm">
                        <div className="bg-[#fff1f5] border-b border-[#f2ccd7] px-4 py-3 flex items-center justify-between">
                          <span className="text-xs font-black text-[#2d2026]">1. 계약자 및 가맹점 인적 정보</span>
                          <button
                            type="button"
                            onClick={() => {
                              const summaryText = `계약구분: ${selectedContract.contractType || "신규"}\n가맹사업자명: ${selectedContract.ownerName}\n생년월일: ${selectedContract.ownerBirth}\n연락처: ${selectedContract.ownerPhone}\n가맹점명: ${selectedContract.storeName}\n주소: ${selectedContract.storeAddress}\n규모: ${selectedContract.storeSize}㎡\n영업지역: ${selectedContract.businessArea}`;
                              handleCopyText(summaryText, "인적 정보 일괄");
                            }}
                            className="text-[10px] text-[#bf3e67] font-black border border-[#f2ccd7] bg-white hover:bg-[#ffd3df]/20 px-2 py-0.5 rounded transition-all cursor-pointer"
                          >
                            일괄 복사
                          </button>
                        </div>
                        <div className="p-4 space-y-2 text-xs text-[#2d2026]">
                          {renderDetailRow("계약 구분", selectedContract.contractType || "신규")}
                          {renderDetailRow("계약 상태", selectedContract.status)}
                          {renderDetailRow("가맹사업자명", selectedContract.ownerName)}
                          {renderDetailRow("가맹사업자 생년월일", selectedContract.ownerBirth)}
                          {renderDetailRow("가맹사업자 연락처", selectedContract.ownerPhone)}
                          {renderDetailRow("가맹점 명칭", selectedContract.storeName)}
                          {renderDetailRow("가맹점 주소", selectedContract.storeAddress)}
                          {renderDetailRow("가맹점 규모", `${selectedContract.storeSize} ㎡`)}
                          {renderDetailRow("영업 지역", selectedContract.businessArea)}
                        </div>
                      </div>
                      
                      {/* Section 2: 계약 기간 */}
                      <div className="bg-white border border-[#f2ccd7] rounded-xl overflow-hidden shadow-sm">
                        <div className="bg-[#fff1f5] border-b border-[#f2ccd7] px-4 py-3">
                          <span className="text-xs font-black text-[#2d2026]">2. 계약 기간</span>
                        </div>
                        <div className="p-4 space-y-2 text-xs text-[#2d2026]">
                          {renderDetailRow(
                            "계약 기간 전체", 
                            `${selectedContract.contractStart} 부터 ${selectedContract.contractEnd} 까지`
                          )}
                          {renderDetailRow("계약 시작일", selectedContract.contractStart)}
                          {renderDetailRow("계약 종료일", selectedContract.contractEnd)}
                        </div>
                      </div>
                      
                      {/* Section 3: 금액 정보 */}
                      <div className="bg-white border border-[#f2ccd7] rounded-xl overflow-hidden shadow-sm">
                        <div className="bg-[#fff1f5] border-b border-[#f2ccd7] px-4 py-3">
                          <span className="text-xs font-black text-[#2d2026]">3. 계약 금액 상세 정보</span>
                        </div>
                        <div className="p-4 space-y-3.5 text-xs text-[#2d2026]">
                          {renderDetailRow(
                            "공사감리비 (부가세 포함)", 
                            getFormattedKoreanAmount(selectedContract.supervisionFee, "일금삼백삼십만원(￦3,300,000)")
                          )}
                          {renderDetailRow(
                            "최초가맹금 (부가세 포함)", 
                            getFormattedKoreanAmount(selectedContract.initialFranchiseFee, "일금오백만원(￦5,000,000)")
                          )}
                          
                          {/* 예치가맹금(표) */}
                          <div className="border border-[#f2ccd7] rounded-lg overflow-hidden my-3">
                            <table className="w-full text-left border-collapse text-xs table-fixed">
                              <thead>
                                <tr className="bg-[#fff9fb] border-b border-[#f2ccd7] font-extrabold text-[#735965] text-[10px]">
                                  <th className="p-2 border-r border-[#f2ccd7] w-[60%]">예치가맹금 항목</th>
                                  <th className="p-2 w-[40%]">금액(원)</th>
                                </tr>
                              </thead>
                              <tbody>
                                {renderTableDetailRow("가입비", selectedContract.depositMembershipFee)}
                                {renderTableDetailRow("오픈교육비", selectedContract.depositEduFee)}
                                {renderTableDetailRow("오픈지원비", selectedContract.depositSupportFee)}
                                {renderTableDetailRow("계약이행보증금", selectedContract.depositGuaranteeFee)}
                                <tr className="font-extrabold bg-[#ffd3df]/20 text-xs">
                                  <td className="p-2 border-t border-r border-[#f2ccd7] text-[#bf3e67]">합계</td>
                                  <td className="p-2 border-t border-[#f2ccd7] text-[#bf3e67] font-black">
                                    <div className="flex items-center justify-between gap-2">
                                      <span>{selectedContract.depositTotalFee.toLocaleString()}</span>
                                      <button
                                        type="button"
                                        onClick={() => handleCopyText(selectedContract.depositTotalFee.toLocaleString(), "예치가맹금 합계")}
                                        className="text-[10px] text-[#bf3e67] border border-[#f2ccd7] bg-white hover:bg-[#ffd3df]/20 px-1.5 py-0.5 rounded transition-all cursor-pointer font-black shrink-0"
                                      >
                                        복사
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          
                          {renderDetailRow(
                            "로열티 (부가세 포함)", 
                            getFormattedKoreanAmount(selectedContract.royaltyFee, "일금일십오만원(￦150,000)")
                          )}
                          {renderDetailRow(
                            "계약이행보증금 (부가세 없음)", 
                            getFormattedKoreanAmount(selectedContract.guaranteeFee, "일금일백만원(￦1,000,000)")
                          )}
                          
                          {/* 교육비(표) */}
                          <div className="border border-[#f2ccd7] rounded-lg overflow-hidden my-3">
                            <table className="w-full text-left border-collapse text-xs table-fixed">
                              <thead>
                                <tr className="bg-[#fff9fb] border-b border-[#f2ccd7] font-extrabold text-[#735965] text-[10px]">
                                  <th className="p-2 border-r border-[#f2ccd7] w-[60%]">교육비 구분</th>
                                  <th className="p-2 w-[40%]">금액(원)</th>
                                </tr>
                              </thead>
                              <tbody>
                                {renderTableDetailRow("오픈교육 (최초가맹금에 포함)", selectedContract.eduOpenFee)}
                                {renderTableDetailRow("신입교육 (1인 기준)", selectedContract.eduNewFee)}
                              </tbody>
                            </table>
                          </div>
                          
                          {renderDetailRow(
                            "초도물품 (부가세 포함)", 
                            getFormattedKoreanAmount(selectedContract.initialSupplyFee, "일금사백사십만원(￦4,400,000)")
                          )}
                          {renderDetailRow(
                            "재가맹비 (부가세 포함)", 
                            getFormattedKoreanAmount(selectedContract.reFranchiseFee, "일금일백일십만원(￦1,100,000)")
                          )}
                          {renderDetailRow(
                            "위약금", 
                            getFormattedKoreanAmount(selectedContract.penaltyFee, "일금일백만원(￦1,000,000)")
                          )}
                        </div>
                      </div>

                      {/* Section 4: 최종 서명 계약서 첨부 */}
                      <div className="bg-white border border-[#f2ccd7] rounded-xl overflow-hidden shadow-sm">
                        <div className="bg-[#fff1f5] border-b border-[#f2ccd7] px-4 py-3">
                          <span className="text-xs font-black text-[#2d2026]">4. 계약 서명 완료 파일</span>
                        </div>
                        <div className="p-4 space-y-3.5 text-xs text-[#2d2026]">
                          {selectedContract.fileName ? (
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#fff9fb]/40 border border-[#f2ccd7] p-3 rounded-lg">
                              <div className="flex items-center gap-2">
                                <FileText size={20} className="text-[#bf3e67]" />
                                <div className="flex flex-col">
                                  <span className="font-extrabold text-[#2d2026] text-xs max-w-[200px] sm:max-w-[350px] truncate">
                                    {selectedContract.fileName}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <a
                                  href={selectedContract.fileUrl}
                                  download={selectedContract.fileName}
                                  className="px-3.5 py-2 bg-[#bf3e67] hover:bg-[#a03153] text-white text-xs font-extrabold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                                >
                                  <Download size={14} />
                                  다운로드
                                </a>
                                <button
                                  type="button"
                                  onClick={() => handleCopyText(selectedContract.fileUrl, "최종 서명 계약서 링크")}
                                  className="px-3.5 py-2 bg-white border border-[#f2ccd7] hover:border-[#bf3e67] hover:text-[#bf3e67] text-[#735965] text-xs font-bold rounded-lg transition-colors cursor-pointer"
                                >
                                  링크 복사
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-4 bg-gray-50 rounded-lg text-gray-500 font-bold border border-dashed border-gray-200">
                              등록된 최종 서명 계약서가 없습니다.
                            </div>
                          )}
                          
                          {/* Allow uploading file directly */}
                          <div className="mt-2 pt-2 border-t border-[#ffd3df]/20 flex flex-col gap-2">
                            <span className="text-[11px] text-[#735965] font-black">계약 서명 파일 업로드/교체</span>
                            <div className="flex items-center gap-3">
                              <input
                                type="file"
                                accept=".pdf"
                                id="direct-pdf-upload"
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
                                      // Directly update Convex
                                      updateContractStatusMutation({
                                        id: selectedContract._id,
                                        status: "계약서 서명완료",
                                        fileUrl: result,
                                        fileName: file.name
                                      }).then(() => {
                                        triggerToast("계약서가 업로드되었으며 상태가 '계약서 서명완료'로 변경되었습니다.");
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
                                htmlFor="direct-pdf-upload"
                                className="px-3.5 py-1.5 bg-white border border-[#f2ccd7] hover:border-[#bf3e67] hover:text-[#bf3e67] text-[#735965] text-xs font-bold rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5"
                              >
                                <Upload size={14} />
                                {selectedContract.fileName ? "계약서 재등록" : "최종 계약서 등록"}
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* EMPTY STATE */
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border border-dashed border-[#f2ccd7] rounded-2xl bg-[#fff9fb]/10">
                    <FileText size={48} className="text-[#f2ccd7] mb-3 animate-pulse" />
                    <h4 className="font-extrabold text-sm text-[#2d2026]">선택된 계약정보 없음</h4>
                    <p className="text-xs text-[#735965] font-bold mt-1 max-w-xs leading-relaxed">
                      좌측의 계약자 리스트에서 계약자를 선택하시거나, "계약정보 신규 등록" 버튼을 눌러 새로운 계약 내역을 작성해 주세요.
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-[#2d2026]">가맹점 관리 및 상세 설정</h2>
                  <p className="text-xs text-[#735965] font-bold mt-1">
                    신규 가맹 계약 체결 매장을 시스템에 등록하고, 로그인 비밀번호, 연락처, 도입 패키지 모듈을 정밀 제어합니다.
                  </p>
                </div>
                <button
                  onClick={() => handleOpenStoreModal()}
                  className="inline-flex items-center justify-center gap-1.5 px-5 py-3 bg-[#f25f8a] hover:bg-[#df4977] text-white text-xs font-bold rounded-lg transition-all shadow-sm shrink-0 self-start sm:self-center"
                >
                  <Plus size={15} />
                  가맹점 신규 등록
                </button>
              </div>

              {/* Stores Table */}
              <div className="bg-white border border-[#f2ccd7] rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1050px] text-left border-collapse">
                    <thead>
                      <tr className="bg-[#fff1f5] border-b border-[#f2ccd7] text-[11px] font-bold text-[#735965] uppercase tracking-wider">
                        <th className="p-4 sm:p-5">로그인 ID</th>
                        <th className="p-4 sm:p-5">가맹점명</th>
                        <th className="p-4 sm:p-5">점주명</th>
                        <th className="p-4 sm:p-5">연락처</th>
                        <th className="p-4 sm:p-5">도로명 주소</th>
                        <th className="p-4 sm:p-5">도입 메뉴</th>
                        <th className="p-4 sm:p-5">상태</th>
                        <th className="p-4 sm:p-5 text-center">관리</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f2ccd7]/60 text-xs">
                      {stores.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="p-8 text-center text-[#735965]">등록된 가맹점이 존재하지 않습니다.</td>
                        </tr>
                      ) : (
                        stores.map((store) => (
                          <tr key={store.id} className="hover:bg-[#fff9fb] transition-colors">
                            <td className="p-4 sm:p-5 font-bold text-[#bf3e67] whitespace-nowrap">{store.id}</td>
                            <td className="p-4 sm:p-5 font-bold text-[#2d2026] whitespace-nowrap">
                              {store.name}
                            </td>
                            <td className="p-4 sm:p-5 text-[#735965] font-semibold whitespace-nowrap">{store.owner}</td>
                            <td className="p-4 sm:p-5 text-[#735965] font-semibold whitespace-nowrap">{store.phone}</td>
                            <td className="p-4 sm:p-5 text-[#735965] font-semibold max-w-[320px]" title={store.roadAddress}>
                              <div className="line-clamp-2 whitespace-normal break-all">
                                {store.roadAddress}
                              </div>
                            </td>
                            <td className="p-4 sm:p-5">
                              <div className="grid grid-cols-3 gap-1 w-[190px]">
                                {store.adoptionMenu && store.adoptionMenu.map((m) => (
                                  <span key={m} className="bg-[#ffd3df] text-[#bf3e67] text-[9px] font-bold px-1 py-0.5 rounded border border-[#f2ccd7] text-center truncate" title={m}>
                                    {m}
                                  </span>
                                ))}
                                {(!store.adoptionMenu || store.adoptionMenu.length === 0) && (
                                  <span className="text-[10px] text-[#735965] opacity-50 col-span-3">없음</span>
                                )}
                              </div>
                            </td>
                            <td className="p-4 sm:p-5 whitespace-nowrap">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                store.status === "승인" 
                                  ? "bg-emerald-50 text-emerald-600 border border-emerald-200" 
                                  : store.status === "대기"
                                  ? "bg-orange-50 text-orange-500 border border-orange-200"
                                  : "bg-neutral-100 text-neutral-500 border border-neutral-200"
                              }`}>
                                {store.status}
                              </span>
                            </td>
                            <td className="p-4 sm:p-5 text-center whitespace-nowrap">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  onClick={() => handleOpenStoreModal(store)}
                                  className="px-2.5 py-1 rounded bg-[#fff1f5] hover:bg-[#ffd3df] text-[#bf3e67] border border-[#f2ccd7] text-[10px] font-bold transition-all"
                                >
                                  상세보기
                                </button>
                                <button
                                  onClick={() => handleDeleteStore(store.id)}
                                  className="p-1 rounded bg-white text-red-500 hover:bg-red-50 border border-[#f2ccd7] transition-all"
                                  title="삭제"
                                >
                                  <Trash2 size={13} />
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
              MENU: 3. PRODUCT MANAGEMENT
             ========================================== */}
          {currentMenu === "product" && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Product and Category header block */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-[#2d2026]">식자재 및 부자재 카탈로그 관리</h2>
                  <p className="text-xs text-[#735965] font-bold mt-1">
                    점주전용 발주몰에 노출할 제품 목록을 수정/삭제하고, 카테고리를 편집하며, ▲/▼ 노출 순서를 정교하게 변경합니다.
                  </p>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-center">
                  <button
                    onClick={() => {
                      setShowCategoryPanel(!showCategoryPanel);
                      setShowLabelPanel(false);
                      setShowPolicyPanel(false);
                    }}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-3 bg-white border border-[#f2ccd7] hover:bg-[#fff9fb] text-[#bf3e67] text-xs font-bold rounded-lg transition-all shadow-sm"
                  >
                    카테고리 관리
                  </button>
                  <button
                    onClick={() => {
                      setShowLabelPanel(!showLabelPanel);
                      setShowCategoryPanel(false);
                      setShowPolicyPanel(false);
                    }}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-3 bg-white border border-[#f2ccd7] hover:bg-[#fff9fb] text-[#bf3e67] text-xs font-bold rounded-lg transition-all shadow-sm"
                  >
                    라벨 관리
                  </button>
                  <button
                    onClick={() => {
                      setShowPolicyPanel(!showPolicyPanel);
                      setShowCategoryPanel(false);
                      setShowLabelPanel(false);
                    }}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-3 bg-white border border-[#f2ccd7] hover:bg-[#fff9fb] text-[#bf3e67] text-xs font-bold rounded-lg transition-all shadow-sm"
                  >
                    <Truck size={14} />
                    배송/반품 설정
                  </button>
                  <button
                    onClick={() => handleOpenProductModal()}
                    className="inline-flex items-center justify-center gap-1.5 px-5 py-3 bg-[#f25f8a] hover:bg-[#df4977] text-white text-xs font-bold rounded-lg transition-all shadow-sm"
                  >
                    <Plus size={15} />
                    제품 신규 등록
                  </button>
                </div>
              </div>

              {/* Shipping and Return Policy Panel */}
              {showPolicyPanel && (
                <div className="bg-white border border-[#f2ccd7] rounded-2xl p-5 shadow-sm space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-[#f2ccd7] pb-3">
                    <h3 className="font-extrabold text-sm text-[#2d2026] flex items-center gap-1.5">
                      <Truck size={16} className="text-[#f25f8a]" />
                      <span>🚚 배송비 정책 및 반품안내 설정</span>
                    </h3>
                    <button 
                      onClick={() => setShowPolicyPanel(false)}
                      className="text-xs text-[#735965] hover:text-[#f25f8a] font-bold"
                    >
                      닫기
                    </button>
                  </div>
                  <form onSubmit={handleSaveShippingSettings} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-[#735965] block">A타입 기본 배송비 (원)</label>
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
                          className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-4 py-2.5 text-xs text-[#2d2026] placeholder-[#735965]/40 focus:outline-none focus:border-[#f25f8a]"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-[#735965] block">B타입 기본 배송비 (원)</label>
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
                          className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-4 py-2.5 text-xs text-[#2d2026] placeholder-[#735965]/40 focus:outline-none focus:border-[#f25f8a]"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-[#735965] block">C타입 기본 배송비 (원)</label>
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
                          className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-4 py-2.5 text-xs text-[#2d2026] placeholder-[#735965]/40 focus:outline-none focus:border-[#f25f8a]"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-[#735965] block">BOX타입 기본 배송비 (10개당) (원)</label>
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
                          className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-4 py-2.5 text-xs text-[#2d2026] placeholder-[#735965]/40 focus:outline-none focus:border-[#f25f8a]"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#735965] block">배송비 정책 안내 설명 문구</label>
                      <textarea
                        rows={3}
                        placeholder="가맹 발주몰에 노출될 배송비 정책을 친절하게 입력해 주세요."
                        value={shippingPolicy}
                        onChange={(e) => setShippingPolicy(e.target.value)}
                        required
                        className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-4 py-2.5 text-xs text-[#2d2026] placeholder-[#735965]/40 focus:outline-none focus:border-[#f25f8a] resize-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#735965] block">반품 및 교환 안내 설명 문구</label>
                      <textarea
                        rows={3}
                        placeholder="반품 접수 기한, 파손 보상 등 반품 및 교환 규정을 자세히 명시해 주세요."
                        value={returnPolicy}
                        onChange={(e) => setReturnPolicy(e.target.value)}
                        required
                        className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-4 py-2.5 text-xs text-[#2d2026] placeholder-[#735965]/40 focus:outline-none focus:border-[#f25f8a] resize-none"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-[#f2ccd7]/30">
                      <button
                        type="button"
                        onClick={() => setShowPolicyPanel(false)}
                        className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-[#735965] font-bold text-xs rounded-xl transition-all"
                      >
                        취소
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-[#f25f8a] hover:bg-[#df4977] text-white font-bold text-xs rounded-xl transition-all shadow-sm"
                      >
                        설정 저장하기
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Real-time Label Panel */}
              {showLabelPanel && (
                <div className="bg-white border border-[#f2ccd7] rounded-2xl p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-[#f2ccd7] pb-3">
                    <h3 className="font-extrabold text-sm text-[#2d2026] flex items-center gap-1.5">
                      <span>🏷 라벨 실시간 관리 대장</span>
                    </h3>
                    <button 
                      onClick={() => setShowLabelPanel(false)}
                      className="text-xs text-[#735965] hover:text-[#f25f8a] font-bold"
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
                      className="flex-1 bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-4 py-2.5 text-xs text-[#2d2026] placeholder-[#735965]/40 focus:outline-none focus:border-[#f25f8a]"
                    />
                    <button 
                      type="submit"
                      className="px-4 py-2.5 bg-[#f25f8a] hover:bg-[#df4977] text-white font-bold text-xs rounded-xl transition-all"
                    >
                      추가
                    </button>
                  </form>
                  <div className="space-y-2.5 max-w-md pt-2">
                    <label className="text-[11px] font-bold text-[#735965] block">등록된 라벨 목록 (순서 조정 및 삭제)</label>
                    <div className="space-y-2 p-3.5 bg-[#fff9fb] border border-[#f2ccd7]/60 rounded-2xl max-h-[300px] overflow-y-auto">
                      {labels.map((labName, idx) => (
                        <div
                          key={labName}
                          className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold bg-[#fff9fb] text-[#bf3e67] border border-[#f2ccd7] group"
                        >
                          <span>{labName}</span>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleAdjustLabelOrder(idx, "up")}
                              disabled={idx === 0}
                              className="w-6 h-6 flex items-center justify-center rounded-lg bg-white hover:bg-neutral-50 border border-[#f2ccd7] text-[#bf3e67] disabled:opacity-30 disabled:hover:bg-white text-[9px] transition-colors cursor-pointer"
                              title="위로 이동"
                            >
                              ▲
                            </button>
                            <button
                              type="button"
                              onClick={() => handleAdjustLabelOrder(idx, "down")}
                              disabled={idx === labels.length - 1}
                              className="w-6 h-6 flex items-center justify-center rounded-lg bg-white hover:bg-neutral-50 border border-[#f2ccd7] text-[#bf3e67] disabled:opacity-30 disabled:hover:bg-white text-[9px] transition-colors cursor-pointer"
                              title="아래로 이동"
                            >
                              ▼
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteLabel(labName)}
                              className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-red-50 text-red-500 hover:text-red-700 ml-1 font-bold text-sm leading-none transition-colors cursor-pointer"
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
                <div className="bg-white border border-[#f2ccd7] rounded-2xl p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-[#f2ccd7] pb-3">
                    <h3 className="font-extrabold text-sm text-[#2d2026] flex items-center gap-1.5">
                      <span>🏷 카테고리 실시간 관리 대장</span>
                    </h3>
                    <button 
                      onClick={() => setShowCategoryPanel(false)}
                      className="text-xs text-[#735965] hover:text-[#f25f8a] font-bold"
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
                      className="flex-1 bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-4 py-2.5 text-xs text-[#2d2026] placeholder-[#735965]/40 focus:outline-none focus:border-[#f25f8a]"
                    />
                    <button 
                      type="submit"
                      className="px-4 py-2.5 bg-[#f25f8a] hover:bg-[#df4977] text-white font-bold text-xs rounded-xl transition-all"
                    >
                      추가
                    </button>
                  </form>
                  <div className="space-y-2.5 max-w-md pt-2">
                    <label className="text-[11px] font-bold text-[#735965] block">등록된 카테고리 목록 (순서 조정 및 삭제)</label>
                    <div className="space-y-2 p-3.5 bg-[#fff9fb] border border-[#f2ccd7]/60 rounded-2xl max-h-[300px] overflow-y-auto">
                      {categories.map((catName, idx) => (
                        <div
                          key={catName}
                          className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold bg-[#fff1f5] text-[#bf3e67] border border-[#f2ccd7] group"
                        >
                          <span>{catName}</span>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleAdjustCategoryOrder(idx, "up")}
                              disabled={idx === 0}
                              className="w-6 h-6 flex items-center justify-center rounded-lg bg-white hover:bg-neutral-50 border border-[#f2ccd7] text-[#bf3e67] disabled:opacity-30 disabled:hover:bg-white text-[9px] transition-colors cursor-pointer"
                              title="위로 이동"
                            >
                              ▲
                            </button>
                            <button
                              type="button"
                              onClick={() => handleAdjustCategoryOrder(idx, "down")}
                              disabled={idx === categories.length - 1}
                              className="w-6 h-6 flex items-center justify-center rounded-lg bg-white hover:bg-neutral-50 border border-[#f2ccd7] text-[#bf3e67] disabled:opacity-30 disabled:hover:bg-white text-[9px] transition-colors cursor-pointer"
                              title="아래로 이동"
                            >
                              ▼
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteCategory(catName)}
                              className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-red-50 text-red-500 hover:text-red-700 ml-1 font-bold text-sm leading-none transition-colors cursor-pointer"
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
              <div className="bg-[#fff1f5]/40 border border-[#f2ccd7] rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs font-bold text-[#735965]">
                  <span>
                    총{" "}
                    <strong className="text-[#bf3e67] font-black">
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
                      className="text-[10px] px-2.5 py-0.5 rounded-lg bg-[#ffd3df] hover:bg-[#f25f8a] hover:text-white text-[#bf3e67] border border-[#f2ccd7] transition-all font-extrabold"
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
                      className="w-full bg-white border border-[#f2ccd7] rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#735965] focus:outline-none focus:border-[#f25f8a] appearance-none pr-8 cursor-pointer shadow-sm"
                    >
                      <option value="전체">카테고리 전체</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#735965]/60 text-[10px]">
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
                      className="w-full bg-white border border-[#f2ccd7] rounded-xl pl-9 pr-8 py-2.5 text-xs text-[#2d2026] placeholder-[#735965]/40 focus:outline-none focus:border-[#f25f8a] shadow-sm font-semibold"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#735965]/50">
                      <Search size={14} />
                    </div>
                    {adminProductSearch && (
                      <button
                        onClick={() => setAdminProductSearch("")}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-sm text-[#735965]/40 hover:text-red-500 font-extrabold w-5 h-5 flex items-center justify-center rounded-full hover:bg-neutral-100 transition-colors"
                      >
                        &times;
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Products Table */}
              <div className="bg-white border border-[#f2ccd7] rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#fff1f5] border-b border-[#f2ccd7] text-[11px] font-bold text-[#735965] uppercase tracking-wider">
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
                    <tbody className="divide-y divide-[#f2ccd7]/60 text-xs">
                      {filteredProducts.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="p-8 text-center text-[#735965] font-bold">
                            {isProductFiltering
                              ? "검색 및 필터 조건에 부합하는 제품이 없습니다."
                              : "등록된 자재 제품이 존재하지 않습니다."}
                          </td>
                        </tr>
                      ) : (
                        filteredProducts.map((p) => (
                          <tr key={p.id} className="hover:bg-[#fff9fb] transition-colors">
                            <td className="p-4 sm:p-5 text-center font-bold text-[#bf3e67]">{p.orderIndex}</td>
                            <td className="p-4 sm:p-5">
                              {(() => {
                                const status = p.status || (p.isActive ? (p.stock === "out_of_stock" ? "품절" : "판매중") : "단종");
                                const isUnavailable = status === "품절" || status === "단종";
                                return (
                                  <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-[#f2ccd7]/60 shadow-sm shrink-0">
                                    <img 
                                      src={p.img} 
                                      alt="" 
                                      className={`w-full h-full object-cover bg-[#fff1f5] transition-all duration-300 ${
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
                              <span className="bg-[#ffd3df] text-[#bf3e67] font-bold px-2 py-0.5 rounded text-[10px] border border-[#f2ccd7]">
                                {p.category}
                              </span>
                            </td>
                            <td className="p-4 sm:p-5">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-bold text-[#2d2026] text-xs">{p.name}</span>
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
                              <div className="text-[10px] text-[#735965] font-semibold mt-0.5">{p.modelName} ({p.qty}{p.unit})</div>
                            </td>
                            <td className="p-4 sm:p-5 text-[#735965] font-bold">{(p.supplyPrice || 0).toLocaleString()} 원</td>
                            <td className="p-4 sm:p-5">
                              <div className="text-[#2d2026] font-extrabold line-through text-[10px] opacity-60">{(p.price || 0).toLocaleString()} 원</div>
                              <div className="text-[#f25f8a] font-black text-xs">{(p.discountedPrice || 0).toLocaleString()} 원</div>
                            </td>
                            <td className="p-4 sm:p-5">
                              {(() => {
                                const status = p.status || (p.isActive ? (p.stock === "out_of_stock" ? "품절" : "판매중") : "단종");
                                let badgeClass = "bg-emerald-50 text-emerald-600 border border-emerald-200";
                                if (status === "품절") {
                                  badgeClass = "bg-orange-50 text-orange-500 border border-orange-200";
                                } else if (status === "단종") {
                                  badgeClass = "bg-neutral-100 text-neutral-500 border border-neutral-200";
                                }
                                return (
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${badgeClass}`}>
                                    {status}
                                  </span>
                                );
                              })()}
                            </td>
                            <td className="p-4 sm:p-5 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleAdjustProductOrder(p.id, "up")}
                                  disabled={filteredProducts.findIndex((op) => op.id === p.id) === 0}
                                  className="p-1 rounded bg-white hover:bg-[#fff1f5] border border-[#f2ccd7] disabled:opacity-35 disabled:hover:bg-white text-[#735965] font-bold transition-all text-[9px] cursor-pointer"
                                  title="순서 위로"
                                >
                                  ▲
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleAdjustProductOrder(p.id, "down")}
                                  disabled={filteredProducts.findIndex((op) => op.id === p.id) === filteredProducts.length - 1}
                                  className="p-1 rounded bg-white hover:bg-[#fff1f5] border border-[#f2ccd7] disabled:opacity-35 disabled:hover:bg-white text-[#735965] font-bold transition-all text-[9px] cursor-pointer"
                                  title="순서 아래로"
                                >
                                  ▼
                                </button>
                              </div>
                            </td>
                            <td className="p-4 sm:p-5 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  onClick={() => handleOpenProductModal(p)}
                                  className="px-2.5 py-1 rounded bg-[#fff1f5] hover:bg-[#ffd3df] text-[#bf3e67] border border-[#f2ccd7] text-[10px] font-bold transition-all"
                                >
                                  수정
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(p.id)}
                                  className="p-1 rounded bg-white text-red-500 hover:bg-red-50 border border-[#f2ccd7] transition-all"
                                  title="삭제"
                                >
                                  <Trash2 size={13} />
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
              MENU: 4. ORDER MANAGEMENT
             ========================================== */}
          {currentMenu === "order" && (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-[#2d2026]">전체 가맹점 발주 주문 관리</h2>
                  <p className="text-xs text-[#735965] font-bold mt-1">가맹점들이 신청한 원자재 발주 요청을 실시간 승인하고 배송 단계를 신속히 제어합니다.</p>
                </div>
                <button
                  type="button"
                  onClick={handleExcelDownload}
                  className="inline-flex items-center justify-center gap-1.5 px-4.5 py-3 bg-[#03C75A] hover:bg-[#02b350] text-white text-xs font-bold rounded-xl transition-all shadow-sm shrink-0 self-start sm:self-center cursor-pointer"
                >
                  <Download size={14} />
                  발주내역 엑셀 다운로드
                </button>
              </div>

              {/* 검색 및 기간 필터 영역 */}
              <div className="bg-white border border-[#f2ccd7] rounded-2xl p-5 shadow-sm space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* 통합 검색 */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[#735965] block">통합 검색</label>
                    <input
                      type="text"
                      placeholder="가맹점명, 점주명, 연락처, 품목명, 주소, 주문번호"
                      value={orderSearchKeyword}
                      onChange={(e) => setOrderSearchKeyword(e.target.value)}
                      className="w-full bg-[#fff9fb]/10 border border-[#f2ccd7] rounded-xl px-3.5 py-2.5 text-xs text-[#2d2026] placeholder-[#735965]/40 font-semibold focus:outline-none focus:border-[#f25f8a]"
                    />
                  </div>

                  {/* 기간선택 셀렉트 */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[#735965] block">발주 기간 필터</label>
                    <select
                      value={orderDateFilterType}
                      onChange={(e) => setOrderDateFilterType(e.target.value)}
                      className="w-full bg-white border border-[#f2ccd7] rounded-xl px-3 py-2.5 text-xs text-[#2d2026] font-bold focus:outline-none focus:border-[#f25f8a] cursor-pointer"
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
                      <label className="text-[10px] font-bold text-[#735965] block">직접 기간 선택</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="date"
                          value={orderStartDate}
                          onChange={(e) => setOrderStartDate(e.target.value)}
                          className="flex-1 bg-white border border-[#f2ccd7] rounded-xl px-2 py-2 text-xs font-semibold focus:outline-none"
                        />
                        <span className="text-[#735965] font-bold text-xs">~</span>
                        <input
                          type="date"
                          value={orderEndDate}
                          onChange={(e) => setOrderEndDate(e.target.value)}
                          className="flex-1 bg-white border border-[#f2ccd7] rounded-xl px-2 py-2 text-xs font-semibold focus:outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 발주 목록 테이블 */}
              <div className="bg-white border border-[#f2ccd7] rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[1000px]">
                    <thead>
                      <tr className="bg-[#fff1f5] border-b border-[#f2ccd7] text-[11px] font-bold text-[#735965] uppercase tracking-wider">
                        <th className="p-4 sm:p-5 text-center" style={{ width: '60px' }}>순서</th>
                        <th className="p-4 sm:p-5" style={{ width: '100px' }}>신청일자</th>
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
                    <tbody className="divide-y divide-[#f2ccd7]/60 text-xs">
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan={11} className="p-8 text-center text-[#735965] font-bold">검색 조건에 맞는 가맹점 발주 주문이 존재하지 않습니다.</td>
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
                              <td className="p-4 sm:p-5 text-center font-bold text-[#bf3e67]">{idx + 1}</td>
                              <td className="p-4 sm:p-5 text-[#735965] font-semibold whitespace-nowrap">{order.date}</td>
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
                                    className="px-3.5 py-1.5 rounded-lg bg-[#fff1f5] hover:bg-[#ffd3df] text-[#bf3e67] border border-[#f2ccd7] text-[10px] font-bold transition-all shadow-sm cursor-pointer"
                                  >
                                    상세보기
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteOrder(order._id)}
                                    className="p-1.5 rounded-lg bg-white hover:bg-red-50 text-red-500 border border-[#f2ccd7] hover:border-red-200 transition-all cursor-pointer"
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
                  className="inline-flex items-center justify-center gap-1.5 px-5 py-3 bg-[#f25f8a] hover:bg-[#df4977] text-white text-xs font-bold rounded-lg transition-all shadow-sm shrink-0 self-start sm:self-center"
                >
                  <Plus size={15} />
                  신규 공지 작성
                </button>
              </div>

              {/* Notices List */}
              <div className="bg-white border border-[#f2ccd7] rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#fff1f5] border-b border-[#f2ccd7] text-[11px] font-bold text-[#735965] uppercase tracking-wider">
                        <th className="p-4 sm:p-5">태그 구분</th>
                        <th className="p-4 sm:p-5">공지 제목</th>
                        <th className="p-4 sm:p-5">등록 일자</th>
                        <th className="p-4 sm:p-5">조회수</th>
                        <th className="p-4 sm:p-5 text-center">액션</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f2ccd7]/60 text-xs">
                      {notices.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-[#735965]">등록된 공지사항이 존재하지 않습니다.</td>
                        </tr>
                      ) : (
                        notices.map((n) => (
                          <tr key={n.id} className="hover:bg-[#fff9fb] transition-colors">
                            <td className="p-4 sm:p-5">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                n.tag === "필독" 
                                  ? "bg-red-50 text-red-500 border border-red-200" 
                                  : "bg-[#fff1f5] text-[#735965] border border-[#f2ccd7]"
                              }`}>
                                {n.tag}
                              </span>
                            </td>
                            <td 
                              className="p-4 sm:p-5 font-bold text-[#2d2026] max-w-xs truncate hover:text-[#f25f8a] hover:underline cursor-pointer"
                              onClick={() => handleOpenEditNoticeModal(n)}
                            >
                              {n.title}
                            </td>
                            <td className="p-4 sm:p-5 text-[#735965] font-semibold">{n.date}</td>
                            <td className="p-4 sm:p-5 font-bold text-[#735965]">{n.views} 회</td>
                            <td className="p-4 sm:p-5 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  onClick={() => handleOpenEditNoticeModal(n)}
                                  className="p-1.5 rounded-lg border border-[#f2ccd7] bg-white hover:bg-[#fff1f5] text-[#bf3e67] hover:border-[#ffd3df] transition-all text-xs cursor-pointer"
                                  title="수정"
                                >
                                  <Edit size={14} />
                                </button>
                                <button
                                  onClick={() => handleDeleteNotice(n.id, n._id)}
                                  className="p-1.5 rounded-lg border border-[#f2ccd7] bg-white hover:bg-red-50 text-red-500 hover:border-red-300 transition-all text-xs cursor-pointer"
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
                  <div className="bg-white border border-[#f2ccd7] rounded-2xl p-8 text-center text-[#735965]">등록된 1:1 가맹점 문의 사항이 없습니다.</div>
                ) : (
                  inquiries.map((inq) => (
                    <div 
                      key={inq.id}
                      className="bg-white border border-[#f2ccd7] rounded-2xl p-5 flex flex-col justify-between gap-4 shadow-sm"
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
                        <div className="bg-[#fff1f5] border border-[#f2ccd7]/60 p-4 rounded-xl">
                          <p className="text-xs sm:text-sm text-[#2d2026] leading-relaxed whitespace-pre-wrap font-semibold">{inq.content}</p>
                        </div>
                      </div>

                      {inq.status === "답변완료" && inq.answer ? (
                        <div className="border-t border-[#f2ccd7]/60 pt-4 space-y-2">
                          <span className="text-[10px] font-bold text-emerald-600 tracking-wider uppercase bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 w-fit block">
                            작성된 본사 답변
                          </span>
                          <div className="bg-[#fff9fb] border border-[#f2ccd7] p-4 rounded-xl">
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
              <div className="bg-white border border-[#f2ccd7] rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#fff1f5] border-b border-[#f2ccd7] text-[11px] font-bold text-[#735965] uppercase tracking-wider">
                        <th className="p-4 sm:p-5 w-24">신청일</th>
                        <th className="p-4 sm:p-5 w-24">고객명</th>
                        <th className="p-4 sm:p-5 w-44">연락처</th>
                        <th className="p-4 sm:p-5 w-40">도입 희망 유형</th>
                        <th className="p-4 sm:p-5">상세 문의 내용</th>
                        <th className="p-4 sm:p-5 w-28 text-center">액션</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f2ccd7]/60 text-xs">
                      {consultations.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-[#735965]">접수된 창업 상담문의가 존재하지 않습니다.</td>
                        </tr>
                      ) : (
                        [...consultations]
                          .sort((a, b) => b.regDate.localeCompare(a.regDate) || (b._creationTime || 0) - (a._creationTime || 0))
                          .map((inq) => (
                            <tr key={inq._id} className="hover:bg-[#fff9fb] transition-colors">
                              <td className="p-4 sm:p-5 text-[#735965] font-semibold whitespace-nowrap">{inq.regDate}</td>
                              <td className="p-4 sm:p-5 font-bold text-[#2d2026] whitespace-nowrap">{inq.name}</td>
                              <td className="p-4 sm:p-5 text-[#735965] font-semibold whitespace-nowrap">
                                <div className="flex items-center gap-1.5">
                                  <span>{inq.phone}</span>
                                  <button
                                    type="button"
                                    onClick={() => handleCopyToClipboard(inq.phone, "연락처")}
                                    className="p-1 hover:text-[#f25f8a] text-[#735965] bg-[#fff9fb] border border-[#f2ccd7] rounded cursor-pointer transition-colors"
                                    title="복사하기"
                                  >
                                    <Copy size={11} />
                                  </button>
                                </div>
                              </td>
                              <td className="p-4 sm:p-5">
                                <span className="bg-[#ffd3df] text-[#bf3e67] font-bold px-2 py-0.5 rounded text-[10px] border border-[#f2ccd7] whitespace-nowrap">
                                  {inq.storeType}
                                </span>
                              </td>
                              <td className="p-4 sm:p-5 text-[#2d2026] max-w-xs sm:max-w-sm truncate" title={inq.message}>
                                <div className="flex items-center gap-2">
                                  <span className="truncate">{inq.message || "-"}</span>
                                  {inq.message && inq.message.length > 20 && (
                                    <button
                                      type="button"
                                      onClick={() => setSelectedConsultation(inq)}
                                      className="px-2 py-0.5 rounded bg-[#fff1f5] hover:bg-[#ffd3df] text-[#bf3e67] border border-[#f2ccd7] text-[10px] font-bold transition-all whitespace-nowrap"
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
                                  className="p-1.5 rounded-lg border border-[#f2ccd7] bg-white hover:bg-[#fff1f5] text-red-500 hover:border-red-300 transition-all text-xs cursor-pointer"
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
                  <div className="bg-[#fff1f5] border border-[#f2ccd7] rounded-xl p-1 flex gap-1">
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
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          analyticsDateFilter === item.key
                            ? "bg-[#f25f8a] text-white shadow-sm font-black"
                            : "text-[#735965] hover:text-[#bf3e67]"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>

                  {analyticsDateFilter === "custom" && (
                    <div className="flex items-center gap-1.5 bg-white border border-[#f2ccd7] rounded-xl p-1">
                      <input
                        type="date"
                        value={analyticsStartDate}
                        onChange={(e) => {
                          setAnalyticsStartDate(e.target.value);
                          setIpListPage(1);
                        }}
                        className="bg-transparent border-0 text-xs font-bold text-[#2d2026] focus:ring-0 p-1"
                      />
                      <span className="text-xs text-[#735965] font-bold">~</span>
                      <input
                        type="date"
                        value={analyticsEndDate}
                        onChange={(e) => {
                          setAnalyticsEndDate(e.target.value);
                          setIpListPage(1);
                        }}
                        className="bg-transparent border-0 text-xs font-bold text-[#2d2026] focus:ring-0 p-1"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Date display helper */}
              <div className="bg-[#fff9fb] border border-[#f2ccd7]/60 rounded-xl px-4 py-2 text-xs text-[#bf3e67] font-extrabold flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#f25f8a]"></span>
                분석 대상 기간: {analyticsStartDate || "-"} ~ {analyticsEndDate || "-"} (총 {dateList.length}일)
              </div>

              {/* Metric cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white border border-[#f2ccd7] rounded-2xl p-5 flex items-center justify-between shadow-sm">
                  <div>
                    <span className="text-xs text-[#735965] font-bold block mb-1">방문자수 (인입건수)</span>
                    <strong className="text-2xl font-black text-[#2d2026]">
                      {totalVisits.toLocaleString()} <span className="text-xs text-[#735965] font-normal">회</span>
                    </strong>
                  </div>
                  <div className="bg-[#fff1f5] text-[#f25f8a] p-3 rounded-xl border border-[#f2ccd7]/40">
                    <Monitor size={22} />
                  </div>
                </div>

                <div className="bg-white border border-[#f2ccd7] rounded-2xl p-5 flex items-center justify-between shadow-sm">
                  <div>
                    <span className="text-xs text-[#735965] font-bold block mb-1">창업 상담문의</span>
                    <strong className="text-2xl font-black text-[#f25f8a]">
                      {totalInquiries.toLocaleString()} <span className="text-xs text-[#735965] font-normal">건</span>
                    </strong>
                  </div>
                  <div className="bg-[#fff1f5] text-[#f25f8a] p-3 rounded-xl border border-[#f2ccd7]/40">
                    <Headphones size={22} />
                  </div>
                </div>

                <div className="bg-white border border-[#f2ccd7] rounded-2xl p-5 flex items-center justify-between shadow-sm">
                  <div>
                    <span className="text-xs text-[#735965] font-bold block mb-1">메뉴 상세 뷰수</span>
                    <strong className="text-2xl font-black text-[#2d2026]">
                      {totalMenuViews.toLocaleString()} <span className="text-xs text-[#735965] font-normal">회</span>
                    </strong>
                  </div>
                  <div className="bg-[#fff1f5] text-[#f25f8a] p-3 rounded-xl border border-[#f2ccd7]/40">
                    <BarChart3 size={22} />
                  </div>
                </div>
              </div>

              {/* Daily trend and referrer */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Daily Table (7 columns) */}
                <div className="lg:col-span-7 bg-white border border-[#f2ccd7] rounded-2xl shadow-sm flex flex-col overflow-hidden">
                  <div className="p-4 sm:p-5 border-b border-[#f2ccd7] bg-[#fff9fb]">
                    <h3 className="text-sm font-bold text-[#2d2026]">일자별 상세 지표</h3>
                  </div>
                  <div className="overflow-x-auto flex-1 max-h-[350px]">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#fff1f5] border-b border-[#f2ccd7] text-[10px] font-bold text-[#735965] uppercase tracking-wider sticky top-0 z-10">
                          <th className="p-3">일자</th>
                          <th className="p-3 text-right">방문자수 (인입)</th>
                          <th className="p-3 text-right">창업 상담문의</th>
                          <th className="p-3 text-right">메뉴 상세 뷰수</th>
                          <th className="p-3 text-right">합계</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#f2ccd7]/60 text-xs">
                        {dailyData.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="p-8 text-center text-[#735965] font-bold">기간 내 조회된 통계가 없습니다.</td>
                          </tr>
                        ) : (
                          dailyData.map((row) => (
                            <tr key={row.date} className="hover:bg-[#fff9fb] transition-colors">
                              <td className="p-3 text-[#2d2026] font-extrabold">{row.date}</td>
                              <td className="p-3 text-right text-[#735965] font-semibold">{row.visits.toLocaleString()}</td>
                              <td className="p-3 text-right text-[#f25f8a] font-bold">{row.inquiries.toLocaleString()}</td>
                              <td className="p-3 text-right text-[#735965] font-semibold">{row.menuViews.toLocaleString()}</td>
                              <td className="p-3 text-right text-[#bf3e67] font-extrabold bg-[#fff9fb]/40">
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
                <div className="lg:col-span-5 bg-white border border-[#f2ccd7] rounded-2xl shadow-sm flex flex-col overflow-hidden">
                  <div className="p-4 sm:p-5 border-b border-[#f2ccd7] bg-[#fff9fb]">
                    <h3 className="text-sm font-bold text-[#2d2026]">유입경로(Referrer) 분석</h3>
                  </div>
                  <div className="p-5 overflow-y-auto max-h-[350px] flex-1 space-y-4">
                    {sortedReferrers.length === 0 ? (
                      <div className="text-center text-[#735965] font-bold py-12">조회된 유입경로 데이터가 없습니다.</div>
                    ) : (
                      sortedReferrers.map((ref, idx) => {
                        const percent = Math.round((ref.count / totalReferrerCount) * 100);
                        return (
                          <div key={ref.name} className="space-y-1">
                            <div className="flex justify-between items-center text-xs">
                              <span className="font-extrabold text-[#2d2026] flex items-center gap-1.5">
                                <span className="inline-block w-4 h-4 rounded-full bg-[#ffd3df] text-[#bf3e67] text-[10px] font-black flex items-center justify-center">
                                  {idx + 1}
                                </span>
                                {ref.name}
                              </span>
                              <span className="font-bold text-[#735965]">
                                {ref.count.toLocaleString()}건 ({percent}%)
                              </span>
                            </div>
                            <div className="w-full bg-[#f2ccd7]/30 h-2 rounded-full overflow-hidden">
                              <div
                                  className="bg-[#f25f8a] h-full rounded-full transition-all"
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
              <div className="bg-white border border-[#f2ccd7] rounded-2xl shadow-sm overflow-hidden">
                <div className="p-4 sm:p-5 border-b border-[#f2ccd7] bg-[#fff9fb] flex justify-between items-center">
                  <h3 className="text-sm font-bold text-[#2d2026]">브랜드 / 메뉴별 상세 조회수 순위</h3>
                  <span className="text-[10px] bg-[#ffd3df] text-[#bf3e67] px-2.5 py-0.5 rounded-full font-bold border border-[#f2ccd7]">
                    총 뷰수: {totalMenuViews.toLocaleString()}회
                  </span>
                </div>
                <div className="p-5 space-y-4 max-h-[300px] overflow-y-auto">
                  {sortedMenus.length === 0 ? (
                    <div className="text-center text-[#735965] font-bold py-8">조회된 메뉴 상세 뷰 데이터가 없습니다.</div>
                  ) : (
                    sortedMenus.map((menu, idx) => {
                      const percent = Math.round((menu.count / totalMenuViewCount) * 100);
                      return (
                        <div key={menu.name} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-6">
                          <span className="font-extrabold text-[#2d2026] text-xs sm:w-1/4 flex items-center gap-2">
                            <span className="inline-block w-5 h-5 rounded-lg bg-[#fff1f5] border border-[#f2ccd7] text-[#bf3e67] text-[10px] font-black flex items-center justify-center shrink-0">
                              {idx + 1}
                            </span>
                            {menu.name}
                          </span>
                          <div className="flex-1 flex items-center gap-3">
                            <div className="flex-1 bg-[#f2ccd7]/20 h-2.5 rounded-full overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-[#f25f8a] to-[#bf3e67] h-full rounded-full transition-all"
                                style={{ width: `${percent}%` }}
                              ></div>
                            </div>
                            <span className="font-bold text-[#735965] text-xs w-20 text-right shrink-0">
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
              <div className="bg-white border border-[#f2ccd7] rounded-2xl shadow-sm overflow-hidden">
                <div className="p-4 sm:p-5 border-b border-[#f2ccd7] bg-[#fff9fb] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-bold text-[#2d2026]">유입 IP 주소별 방문 분석 로그</h3>
                    <p className="text-[10px] text-[#735965] font-bold mt-0.5">접속 IP별 누적 방문 횟수 및 유입 경로, 최근 방문한 페이지를 요약 조회합니다.</p>
                  </div>

                  {/* Search */}
                  <div className="relative w-full sm:w-64">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#735965]">
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
                      className="pl-9 pr-4 py-1.5 w-full bg-white border border-[#f2ccd7] rounded-xl text-xs font-bold text-[#2d2026] placeholder-[#735965]/50 focus:border-[#f25f8a] focus:ring-1 focus:ring-[#f25f8a] transition-all"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#fff1f5] border-b border-[#f2ccd7] text-[10px] font-bold text-[#735965] uppercase tracking-wider">
                        <th className="p-4 w-44">IP 주소</th>
                        <th className="p-4 text-center w-24">누적 방문수</th>
                        <th className="p-4 text-center w-24">메뉴 상세뷰</th>
                        <th className="p-4">유입 경로 (Referrer)</th>
                        <th className="p-4 w-44">최종 방문 경로</th>
                        <th className="p-4 w-44">최종 접속 일시</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f2ccd7]/60 text-xs">
                      {paginatedIps.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-[#735965]">검색 필터에 부합하는 IP 기록이 없습니다.</td>
                        </tr>
                      ) : (
                        paginatedIps.map((row) => (
                          <tr key={row.ip} className="hover:bg-[#fff9fb] transition-colors">
                            <td className="p-4 font-extrabold text-[#2d2026]">{row.ip}</td>
                            <td className="p-4 text-center font-bold text-[#735965]">{row.visitCount.toLocaleString()}회</td>
                            <td className="p-4 text-center font-bold text-[#bf3e67]">{row.menuViewCount.toLocaleString()}회</td>
                            <td className="p-4 text-[#735965] font-semibold max-w-xs truncate">
                              <div className="flex flex-wrap gap-1">
                                {Array.from(row.referrers).map((ref, idx) => (
                                  <span
                                    key={idx}
                                    className="bg-[#fff1f5] border border-[#f2ccd7]/60 text-[#bf3e67] text-[9px] font-black px-1.5 py-0.5 rounded"
                                  >
                                    {ref}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="p-4 text-[#735965] font-semibold max-w-xs truncate" title={Array.from(row.paths).join(", ")}>
                              <span className="bg-[#fff9fb] border border-[#f2ccd7]/40 text-[#735965] text-[10px] px-2 py-0.5 rounded">
                                {Array.from(row.paths).pop() || "/"}
                              </span>
                            </td>
                            <td className="p-4 text-[#735965] font-bold whitespace-nowrap">
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
                  <div className="p-4 sm:p-5 border-t border-[#f2ccd7] bg-[#fff9fb] flex items-center justify-between">
                    <span className="text-[10px] text-[#735965] font-bold">
                      총 {filteredIpsList.length}개 IP 중 {(ipListPage - 1) * ipItemsPerPage + 1}~{Math.min(ipListPage * ipItemsPerPage, filteredIpsList.length)} 표시
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        disabled={ipListPage === 1}
                        onClick={() => setIpListPage(p => Math.max(p - 1, 1))}
                        className="px-2.5 py-1 text-xs font-bold border border-[#f2ccd7] rounded-lg bg-white text-[#735965] disabled:opacity-50 hover:bg-[#fff9fb] transition-all cursor-pointer"
                      >
                        이전
                      </button>
                      <span className="text-xs text-[#2d2026] font-bold px-3">
                        {ipListPage} / {totalIpPages}
                      </span>
                      <button
                        disabled={ipListPage === totalIpPages}
                        onClick={() => setIpListPage(p => Math.min(p + 1, totalIpPages))}
                        className="px-2.5 py-1 text-xs font-bold border border-[#f2ccd7] rounded-lg bg-white text-[#735965] disabled:opacity-50 hover:bg-[#fff9fb] transition-all cursor-pointer"
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
                  className="inline-flex items-center justify-center gap-1.5 px-5 py-3 bg-[#f25f8a] hover:bg-[#df4977] text-white text-xs font-bold rounded-lg transition-all shadow-sm shrink-0 self-start sm:self-center"
                >
                  <Plus size={15} />
                  신규 자료 등록
                </button>
              </div>

              {/* Trainings & PR lists */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* 1. Trainings Block */}
                <div className="bg-white border border-[#f2ccd7] rounded-2xl p-6 shadow-sm space-y-4">
                  <h3 className="font-extrabold text-base text-[#2d2026] border-b border-[#f2ccd7] pb-3 flex items-center gap-2">
                    <BookOpen size={18} className="text-[#f25f8a]" />
                    점주 조리/AS 교육자료실 ({trainings.length})
                  </h3>
                  <div className="space-y-3.5 max-h-[400px] overflow-y-auto pr-1">
                    {trainings.length === 0 ? (
                      <p className="text-xs text-[#735965] text-center py-8">교육자료가 비어 있습니다.</p>
                    ) : (
                      trainings.map((t) => (
                        <div key={t.id} className="bg-[#fff1f5]/50 border border-[#f2ccd7] rounded-xl p-4 flex justify-between items-start gap-4">
                          <div className="space-y-1">
                            <span className="text-[9px] text-[#bf3e67] bg-[#ffd3df] border border-[#f2ccd7] px-2 py-0.5 rounded font-bold">{t.format}</span>
                            <h4 className="text-xs font-bold text-[#2d2026] leading-tight mt-1">{t.title}</h4>
                            <p className="text-[10px] text-[#735965] line-clamp-2 leading-relaxed">{t.desc}</p>
                          </div>
                          <button
                            onClick={() => handleDeleteMaterial(t.id, "training")}
                            className="p-1 rounded bg-white text-red-500 hover:text-red-600 transition-colors border border-[#f2ccd7] shrink-0"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* 2. PR/Marketing Assets Block */}
                <div className="bg-white border border-[#f2ccd7] rounded-2xl p-6 shadow-sm space-y-4">
                  <h3 className="font-extrabold text-base text-[#2d2026] border-b border-[#f2ccd7] pb-3 flex items-center gap-2">
                    <ImageIcon size={18} className="text-[#f25f8a]" />
                    점주 홍보/마케팅 자료실 ({prs.length})
                  </h3>
                  <div className="space-y-3.5 max-h-[400px] overflow-y-auto pr-1">
                    {prs.length === 0 ? (
                      <p className="text-xs text-[#735965] text-center py-8">홍보자료가 비어 있습니다.</p>
                    ) : (
                      prs.map((p) => (
                        <div key={p.id} className="bg-[#fff1f5]/50 border border-[#f2ccd7] rounded-xl p-4 flex justify-between items-start gap-4">
                          <div className="space-y-1">
                            <span className="text-[9px] text-[#bf3e67] bg-[#ffd3df] border border-[#f2ccd7] px-2 py-0.5 rounded font-bold">{p.format}</span>
                            <h4 className="text-xs font-bold text-[#2d2026] leading-tight mt-1">{p.title}</h4>
                            <p className="text-[10px] text-[#735965] line-clamp-2 leading-relaxed">{p.desc}</p>
                          </div>
                          <button
                            onClick={() => handleDeleteMaterial(p.id, "pr")}
                            className="p-1 rounded bg-white text-red-500 hover:text-red-600 transition-colors border border-[#f2ccd7] shrink-0"
                          >
                            <Trash2 size={13} />
                          </button>
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
              <div className="flex border-b border-[#f2ccd7] gap-2 p-1 bg-[#fff1f5]/60 rounded-xl w-fit">
                {[
                  { id: "popup", label: "📢 실시간 점주 팝업", color: "bg-[#f25f8a]" },
                  { id: "banner", label: "🖼️ 홈 대시보드 배너", color: "bg-[#bf3e67]" },
                  { id: "floating", label: "📱 우측 플로팅 연동", color: "bg-[#735965]" },
                  { id: "instagram", label: "📸 인스타 피드 연동", color: "bg-[#7c3aed]" }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setBannerSubMenu(tab.id as any)}
                    className={`px-4 py-2.5 rounded-lg text-xs font-black transition-all ${
                      bannerSubMenu === tab.id
                        ? `${tab.color} text-white shadow-sm scale-105`
                        : "text-[#735965] hover:bg-[#ffd3df]/50"
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
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-[#f2ccd7] rounded-3xl p-6 shadow-sm">
                    <div className="space-y-1">
                      <h3 className="font-extrabold text-sm text-[#2d2026] flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#f25f8a] animate-pulse"></span>
                        실시간 팝업 히스토리 & 노출 제어
                      </h3>
                      <p className="text-[10px] text-[#735965] font-bold">
                        랜딩 페이지와 점주 포털 홈에 노출되는 모든 팝업을 등록하고, 게시 기간 및 대상 페이지별로 스마트하게 이력을 관리합니다.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleOpenPopupModal()}
                      className="px-4 py-2.5 bg-[#f25f8a] hover:bg-[#df4977] text-white text-xs font-black rounded-xl transition-all shadow-[0_4px_12px_rgba(242,95,138,0.2)] flex items-center justify-center gap-1.5 self-start sm:self-center hover:scale-[1.03]"
                    >
                      <Plus size={14} />
                      신규 팝업 등록
                    </button>
                  </div>

                  {/* Popups History List Table */}
                  <div className="bg-white border border-[#f2ccd7] rounded-3xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-[#fff1f5]/60 border-b border-[#f2ccd7]/60">
                            <th className="p-4 text-[11px] font-black text-[#735965] w-20 text-center">노출 여부</th>
                            <th className="p-4 text-[11px] font-black text-[#735965]">팝업 제목 및 본문 요약</th>
                            <th className="p-4 text-[11px] font-black text-[#735965] w-32">게시 대상 페이지</th>
                            <th className="p-4 text-[11px] font-black text-[#735965] w-48">게시 기간 (기간 필터)</th>
                            <th className="p-4 text-[11px] font-black text-[#735965] w-28">등록 일자</th>
                            <th className="p-4 text-[11px] font-black text-[#735965] w-24 text-center">관리</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#f2ccd7]/30 text-xs">
                          {convexPopupsList === undefined ? (
                            <tr>
                              <td colSpan={6} className="p-8 text-center text-[#735965] font-bold">
                                팝업 히스토리 데이터를 실시간 조회하는 중입니다...
                              </td>
                            </tr>
                          ) : convexPopupsList.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="p-8 text-center text-[#735965] font-bold">
                                등록된 팝업 히스토리가 없습니다. 우측 상단의 [신규 팝업 등록] 버튼을 눌러 첫 팝업을 발행해 보세요!
                              </td>
                            </tr>
                          ) : (
                            convexPopupsList.map((pop: any) => {
                              const today = new Date().toISOString().split("T")[0];
                              const isStarted = !pop.startDate || pop.startDate <= today;
                              const isEnded = pop.endDate && pop.endDate < today;
                              const isPeriodActive = isStarted && !isEnded;
                              
                              let pageBadge = "bg-gray-100 text-gray-700";
                              let pageText = "전체 페이지";
                              if (pop.targetPage === "landing") {
                                pageBadge = "bg-[#bf3e67]/10 text-[#bf3e67]";
                                pageText = "💻 랜딩 페이지";
                              } else if (pop.targetPage === "portal") {
                                pageBadge = "bg-[#f25f8a]/10 text-[#f25f8a]";
                                pageText = "📢 점주 포털";
                              }

                              return (
                                <tr key={pop._id} className="hover:bg-[#fff9fb]/40 transition-colors">
                                  <td className="p-4 text-center">
                                    <button
                                      type="button"
                                      onClick={() => handleTogglePopupActive(pop._id, pop.isActive)}
                                      className={`w-10 h-5 rounded-full p-0.5 mx-auto transition-all duration-300 flex ${
                                        pop.isActive ? "bg-[#f25f8a] justify-end" : "bg-[#735965]/20 justify-start"
                                      }`}
                                    >
                                      <span className="w-4 h-4 rounded-full bg-white shadow-sm block"></span>
                                    </button>
                                  </td>
                                  <td className="p-4 space-y-1">
                                    <div className="font-extrabold text-[#2d2026] flex items-center gap-1.5">
                                      {pop.title}
                                      {pop.isActive && isPeriodActive && (
                                        <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-white text-[9px] font-black animate-pulse whitespace-nowrap shrink-0 inline-block">
                                          현재 게시중
                                        </span>
                                      )}
                                      {pop.isActive && !isPeriodActive && !isEnded && (
                                        <span className="px-2.5 py-1 rounded-full bg-amber-500 text-white text-[9px] font-black whitespace-nowrap shrink-0 inline-block">
                                          대기중
                                        </span>
                                      )}
                                      {isEnded && (
                                        <span className="px-2.5 py-1 rounded-full bg-gray-400 text-white text-[9px] font-black whitespace-nowrap shrink-0 inline-block">
                                          기간 종료
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-[10px] text-[#735965] line-clamp-1 font-medium">{pop.desc}</div>
                                  </td>
                                  <td className="p-4">
                                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${pageBadge}`}>
                                      {pageText}
                                    </span>
                                  </td>
                                  <td className="p-4 font-mono text-[10px] text-[#735965]">
                                    {pop.startDate || "무제한"} ~ {pop.endDate || "무제한"}
                                  </td>
                                  <td className="p-4 text-[10px] text-[#735965] font-bold">
                                    {pop.createdAt ? pop.createdAt.substring(0, 10) : "-"}
                                  </td>
                                  <td className="p-4">
                                    <div className="flex items-center justify-center gap-2">
                                      <button
                                        type="button"
                                        onClick={() => handleOpenPopupModal(pop)}
                                        className="p-1.5 rounded-lg bg-[#fff1f5] hover:bg-[#ffd3df] text-[#bf3e67] border border-[#f2ccd7]/60 transition-all"
                                        title="편집"
                                      >
                                        <Settings size={13} />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleDeletePopup(pop._id)}
                                        className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 border border-red-100 transition-all"
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
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
                      <div className="bg-white border border-[#f2ccd7] rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col md:flex-row overflow-hidden animate-scaleUp">
                        {/* Left: Input Form (60%) */}
                        <form onSubmit={handleSavePopup} className="p-6 md:p-8 space-y-5 flex-1 border-r border-[#f2ccd7]/40 overflow-y-auto">
                          <div className="flex items-center justify-between border-b border-[#f2ccd7]/60 pb-3">
                            <h3 className="font-extrabold text-sm text-[#2d2026] flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full bg-[#f25f8a]"></span>
                              {selectedPopupForEdit ? "공지 팝업 설정 수정" : "신규 공지 팝업 등록 및 발행"}
                            </h3>
                            <button
                              type="button"
                              onClick={() => setShowPopupModal(false)}
                              className="p-1.5 rounded-xl hover:bg-[#ffd3df]/50 text-[#735965] transition-colors"
                            >
                              <X size={18} />
                            </button>
                          </div>

                          {/* Target Page & Active State */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-[11px] font-black text-[#735965] block">게시 대상 페이지 (필수)</label>
                              <select
                                value={popupTargetPage}
                                onChange={(e) => setPopupTargetPage(e.target.value)}
                                className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-3 py-2.5 text-xs text-[#2d2026] font-bold focus:outline-none focus:border-[#f25f8a]"
                              >
                                <option value="all">전체 페이지 노출 (landing + portal)</option>
                                <option value="landing">💻 홈페이지 메인 랜딩 (landing)</option>
                                <option value="portal">📢 가맹점 점주 포털 홈 (portal)</option>
                              </select>
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[11px] font-black text-[#735965] block">즉시 활성화 설정</label>
                              <div className="flex items-center gap-3 bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-3 py-2.5">
                                <button
                                  type="button"
                                  onClick={() => setPopupActive(!popupActive)}
                                  className={`w-10 h-5 rounded-full p-0.5 transition-all duration-300 flex ${
                                    popupActive ? "bg-[#f25f8a] justify-end" : "bg-[#735965]/20 justify-start"
                                  }`}
                                >
                                  <span className="w-4 h-4 rounded-full bg-white shadow-sm block"></span>
                                </button>
                                <span className="text-[11px] font-black text-[#735965]">
                                  {popupActive ? "활성화 (노출 대상 편입)" : "비활성화 (임시 저장)"}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Display Period Dates */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-[#f2ccd7]/30 pb-4">
                            <div className="space-y-1.5">
                              <label className="text-[11px] font-black text-[#735965] block">게시 시작 날짜 (미설정 시 즉시게시)</label>
                              <input
                                type="date"
                                value={popupStartDate}
                                onChange={(e) => setPopupStartDate(e.target.value)}
                                className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-3 py-2 text-xs text-[#2d2026] focus:outline-none focus:border-[#f25f8a]"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[11px] font-black text-[#735965] block">게시 종료 날짜 (미설정 시 무기한)</label>
                              <input
                                type="date"
                                value={popupEndDate}
                                onChange={(e) => setPopupEndDate(e.target.value)}
                                className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-3 py-2 text-xs text-[#2d2026] focus:outline-none focus:border-[#f25f8a]"
                              />
                            </div>
                          </div>

                          {/* Core Text Inputs */}
                          <div className="space-y-3">
                            <div className="space-y-1.5">
                              <label className="text-[11px] font-black text-[#735965] block">팝업 메인 헤드라인 타이틀</label>
                              <input
                                type="text"
                                value={popupTitle}
                                onChange={(e) => setPopupTitle(e.target.value)}
                                placeholder="예: 여름 스페셜 '망고파이' 정식 출시!"
                                required
                                className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-3 py-2 text-xs text-[#2d2026] focus:outline-none focus:border-[#f25f8a]"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[11px] font-black text-[#735965] block">팝업 상세 공지 본문 내용</label>
                              <textarea
                                rows={3}
                                value={popupDesc}
                                onChange={(e) => setPopupDesc(e.target.value)}
                                placeholder="팝업 중앙에 표출될 상세 혜택이나 공지 내용을 입력하세요."
                                required
                                className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-3 py-2 text-xs text-[#2d2026] focus:outline-none focus:border-[#f25f8a] resize-none"
                              />
                            </div>
                          </div>

                          {/* Image & URL Config */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-[11px] font-black text-[#735965] block">팝업 배경 이미지 파일 (URL)</label>
                              <input
                                type="text"
                                value={popupImage}
                                onChange={(e) => setPopupImage(e.target.value)}
                                placeholder="https://example.com/popup.jpg (미지정 시 기본 핑크 그라데이션)"
                                className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-3 py-2 text-xs text-[#2d2026] focus:outline-none focus:border-[#f25f8a]"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[11px] font-black text-[#735965] block">이미지 직접 업로드</label>
                              <div className="flex items-center gap-2 bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-3 py-1.5">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handlePopupImageUpload}
                                  className="text-[10px] text-[#735965] file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[9px] file:font-black file:bg-[#ffd3df] file:text-[#bf3e67] cursor-pointer flex-1"
                                />
                                {popupImage && (
                                  <button
                                    type="button"
                                    onClick={() => setPopupImage("")}
                                    className="px-1.5 py-0.5 rounded bg-red-50 hover:bg-red-100 text-red-500 text-[9px] font-bold border border-red-200"
                                  >
                                    지우기
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Link Menu Trigger */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-[11px] font-black text-[#735965] block">클릭 시 이동 버튼 문구</label>
                              <input
                                type="text"
                                value={popupBtnText}
                                onChange={(e) => setPopupBtnText(e.target.value)}
                                placeholder="예: 지금 주문하러 가기"
                                className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-3 py-2 text-xs text-[#2d2026] focus:outline-none focus:border-[#f25f8a]"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[11px] font-black text-[#735965] block">클릭 시 이동할 메뉴/외부주소</label>
                              <select
                                value={popupLink.startsWith("http") ? "custom" : popupLink}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  if (val !== "custom") {
                                    setPopupLink(val);
                                  } else {
                                    setPopupLink("https://");
                                  }
                                }}
                                className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-3 py-2 text-xs text-[#2d2026] focus:outline-none focus:border-[#f25f8a]"
                              >
                                <option value="order">자재 발주하기 (내부 메뉴 연동)</option>
                                <option value="training">교육자료실 (내부 메뉴 연동)</option>
                                <option value="material">홍보자료실 (내부 메뉴 연동)</option>
                                <option value="inquiry">1:1 문의게시판 (내부 메뉴 연동)</option>
                                <option value="notice">공지사항 페이지 (내부 메뉴 연동)</option>
                                <option value="custom">외부 웹주소 URL 직접 지정</option>
                              </select>
                              {popupLink.startsWith("http") && (
                                <div className="pt-1.5">
                                  <input
                                    type="text"
                                    value={popupLink}
                                    onChange={(e) => setPopupLink(e.target.value)}
                                    placeholder="https://example.com"
                                    className="w-full bg-white border border-[#f2ccd7] rounded-xl px-3 py-2 text-xs text-[#2d2026] focus:outline-none focus:border-[#f25f8a]"
                                  />
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Styling Accordion Detail settings */}
                          <div className="border-t border-[#f2ccd7]/60 pt-4 space-y-3">
                            <h4 className="font-extrabold text-[11px] text-[#bf3e67] flex items-center gap-1.5">
                              🎨 팝업 스타일 및 색상 상세 커스터마이징
                            </h4>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-[#735965]">제목 글자색</label>
                                <div className="flex gap-1.5">
                                  <input
                                    type="color"
                                    value={popupTitleColor}
                                    onChange={(e) => setPopupTitleColor(e.target.value)}
                                    className="w-8 h-8 border border-[#f2ccd7] rounded-lg cursor-pointer"
                                  />
                                  <input
                                    type="text"
                                    value={popupTitleColor}
                                    onChange={(e) => setPopupTitleColor(e.target.value)}
                                    className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-lg px-2 py-1 text-[10px] font-mono"
                                  />
                                </div>
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-[#735965]">제목 글자크기</label>
                                <select
                                  value={popupTitleSize}
                                  onChange={(e) => setPopupTitleSize(e.target.value)}
                                  className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-lg px-2 py-1.5 text-[10px]"
                                >
                                  <option value="16px">작게 (16px)</option>
                                  <option value="18px">보통 (18px)</option>
                                  <option value="20px">크게 (20px)</option>
                                  <option value="24px">매우 크게 (24px)</option>
                                </select>
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-[#735965]">본문 글자색</label>
                                <div className="flex gap-1.5">
                                  <input
                                    type="color"
                                    value={popupDescColor}
                                    onChange={(e) => setPopupDescColor(e.target.value)}
                                    className="w-8 h-8 border border-[#f2ccd7] rounded-lg cursor-pointer"
                                  />
                                  <input
                                    type="text"
                                    value={popupDescColor}
                                    onChange={(e) => setPopupDescColor(e.target.value)}
                                    className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-lg px-2 py-1 text-[10px] font-mono"
                                  />
                                </div>
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-[#735965]">본문 글자크기</label>
                                <select
                                  value={popupDescSize}
                                  onChange={(e) => setPopupDescSize(e.target.value)}
                                  className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-lg px-2 py-1.5 text-[10px]"
                                >
                                  <option value="11px">작게 (11px)</option>
                                  <option value="12px">보통 (12px)</option>
                                  <option value="14px">크게 (14px)</option>
                                </select>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-[#735965]">이동버튼 배경색</label>
                                <div className="flex gap-1.5">
                                  <input
                                    type="color"
                                    value={popupBtnBgColor}
                                    onChange={(e) => setPopupBtnBgColor(e.target.value)}
                                    className="w-8 h-8 border border-[#f2ccd7] rounded-lg cursor-pointer"
                                  />
                                  <input
                                    type="text"
                                    value={popupBtnBgColor}
                                    onChange={(e) => setPopupBtnBgColor(e.target.value)}
                                    className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-lg px-2 py-1 text-[10px] font-mono"
                                  />
                                </div>
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-[#735965]">이동버튼 글씨색</label>
                                <div className="flex gap-1.5">
                                  <input
                                    type="color"
                                    value={popupBtnTextColor}
                                    onChange={(e) => setPopupBtnTextColor(e.target.value)}
                                    className="w-8 h-8 border border-[#f2ccd7] rounded-lg cursor-pointer"
                                  />
                                  <input
                                    type="text"
                                    value={popupBtnTextColor}
                                    onChange={(e) => setPopupBtnTextColor(e.target.value)}
                                    className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-lg px-2 py-1 text-[10px] font-mono"
                                  />
                                </div>
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-[#735965]">이동버튼 글씨크기</label>
                                <select
                                  value={popupBtnTextSize}
                                  onChange={(e) => setPopupBtnTextSize(e.target.value)}
                                  className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-lg px-2 py-1.5 text-[10px]"
                                >
                                  <option value="11px">작게 (11px)</option>
                                  <option value="12px">보통 (12px)</option>
                                  <option value="14px">크게 (14px)</option>
                                </select>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-3 border-t border-[#f2ccd7]/60 pt-4">
                            <button
                              type="button"
                              onClick={() => setShowPopupModal(false)}
                              className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-all"
                            >
                              취소
                            </button>
                            <button
                              type="submit"
                              className="flex-2 py-3 bg-[#f25f8a] hover:bg-[#df4977] text-white font-bold text-xs rounded-xl transition-all shadow-[0_4px_12px_rgba(242,95,138,0.2)] flex items-center justify-center gap-1.5"
                            >
                              <Sparkles size={13} />
                              {selectedPopupForEdit ? "수정사항 저장" : "새 팝업 게시 발행"}
                            </button>
                          </div>
                        </form>

                        {/* Right: Live Preview Panel (40%) */}
                        <div className="p-6 md:p-8 bg-[#fff9fb]/80 border-t md:border-t-0 md:border-l border-[#f2ccd7]/40 w-full md:w-80 flex flex-col items-center justify-center min-h-[350px] md:min-h-0">
                          <h4 className="font-extrabold text-xs text-[#735965] border-b border-[#f2ccd7] pb-2.5 mb-6 w-full text-center">
                            📱 실시간 레이아웃 모바일 미리보기
                          </h4>

                          {/* Preview Popup Modal Card */}
                          <div className="w-[260px] rounded-3xl overflow-hidden shadow-2xl border border-[#f2ccd7] bg-white relative animate-scaleUp">
                            {/* Card Background (Image or Fallback Gradient) */}
                            <div 
                              className="p-5 min-h-[220px] flex flex-col justify-between relative bg-cover bg-center"
                              style={{ 
                                backgroundImage: popupImage ? `url(${popupImage})` : "none",
                                backgroundBlendMode: "overlay",
                                backgroundColor: popupImage ? "rgba(0,0,0,0.25)" : "transparent",
                                ...(popupImage ? {} : {
                                  background: "linear-gradient(135deg, #ffe1ea 0%, #ffd3df 100%)"
                                })
                              }}
                            >
                              {/* Close Mock Button */}
                              <div className="absolute top-3 right-3 text-[#735965] opacity-60">
                                <X size={14} />
                              </div>

                              <div className="space-y-2 pt-2">
                                <h5 
                                  className="font-black leading-tight break-all" 
                                  style={{ color: popupTitleColor, fontSize: popupTitleSize }}
                                >
                                  {popupTitle || "망고파이 컵 16oz 한정 출시!"}
                                </h5>
                                <p 
                                  className="leading-relaxed font-bold break-all whitespace-pre-line"
                                  style={{ color: popupDescColor, fontSize: popupDescSize }}
                                >
                                  {popupDesc || "여름 신상 120pie 망고 컬렉션! 지금 포털에서 주문 시 전용 컵홀더 1박스 무상 증정!"}
                                </p>
                              </div>

                              {/* Button Area */}
                              <div className="mt-4 pt-2">
                                <div 
                                  className="w-full py-2.5 rounded-xl font-black text-center shadow-md cursor-pointer text-xs"
                                  style={{ 
                                    backgroundColor: popupBtnBgColor, 
                                    color: popupBtnTextColor,
                                    fontSize: popupBtnTextSize
                                  }}
                                >
                                  {popupBtnText || "자재 주문하러 가기"}
                                </div>
                              </div>
                            </div>
                            
                            {/* Bottom Close bar */}
                            <div className="bg-[#2d2026] text-white/80 py-2.5 px-4 text-[10px] font-black flex justify-between items-center border-t border-white/10">
                              <span className="cursor-pointer hover:underline opacity-80">오늘 하루 보지 않기</span>
                              <span className="cursor-pointer hover:underline">닫기</span>
                            </div>
                          </div>

                          <p className="text-[10px] text-[#735965] font-black text-center mt-6 leading-relaxed max-w-[200px]">
                            * 실제 노출 시에는 지정된 게시 기간({popupStartDate || "오늘"}~{popupEndDate || "무한"}) 동안 {popupTargetPage === "landing" ? "랜딩 페이지" : popupTargetPage === "portal" ? "점주 포털" : "모든 페이지"}에 활성화 노출됩니다.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 2. REAL-TIME BANNER MANAGEMENT */}
              {bannerSubMenu === "banner" && (
                <form onSubmit={handleUpdateBanners} className="bg-white border border-[#f2ccd7] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 animate-fadeIn">
                  
                  {/* 1. Main Banner Panel */}
                  <div className="space-y-4">
                    <h3 className="font-extrabold text-sm text-[#2d2026] border-b border-[#f2ccd7] pb-2.5 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#f25f8a]"></span>
                      대시보드 메인 16:8 배너 영역 제어
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-[#735965]">메인 배너 태그 라벨</label>
                        <input 
                          type="text"
                          value={bannerMainTag}
                          onChange={(e) => setBannerMainTag(e.target.value)}
                          required
                          className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-4 py-3 text-xs text-[#2d2026] focus:outline-none focus:border-[#f25f8a]"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-[#735965]">메인 배너 타이틀 헤드라인</label>
                        <textarea 
                          rows={2}
                          value={bannerMainTitle}
                          onChange={(e) => setBannerMainTitle(e.target.value)}
                          required
                          className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-4 py-3 text-xs text-[#2d2026] focus:outline-none focus:border-[#f25f8a] resize-none"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-[#735965]">메인 배너 이미지 등록 (URL)</label>
                        <input 
                          type="text"
                          value={bannerMainImage}
                          onChange={(e) => setBannerMainImage(e.target.value)}
                          placeholder="https://example.com/banner.jpg"
                          className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-4 py-3 text-xs text-[#2d2026] focus:outline-none focus:border-[#f25f8a]"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-[#735965]">메인 배너 이미지 업로드 (로컬 파일)</label>
                        <div className="flex items-center gap-3 bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-4 py-2.5">
                          <input 
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, "main")}
                            className="text-xs text-[#735965] file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-[10px] file:font-black file:bg-[#ffd3df] file:text-[#bf3e67] file:hover:bg-[#ffd3df]/80 cursor-pointer flex-1"
                          />
                          {bannerMainImage && (
                            <button
                              type="button"
                              onClick={() => setBannerMainImage("")}
                              className="px-2 py-1 rounded bg-red-50 hover:bg-red-100 text-red-500 text-[10px] font-bold border border-red-200 transition-colors"
                            >
                              지우기
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#735965]">메인 배너 세부 상세 설명</label>
                      <textarea 
                        rows={3}
                        value={bannerMainDesc}
                        onChange={(e) => setBannerMainDesc(e.target.value)}
                        required
                        className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-4 py-3 text-xs text-[#2d2026] focus:outline-none focus:border-[#f25f8a] resize-none"
                      />
                    </div>
                  </div>

                  {/* 2. Square Banner Panel */}
                  <div className="space-y-4 pt-4 border-t border-[#f2ccd7]/60">
                    <h3 className="font-extrabold text-sm text-[#2d2026] border-b border-[#f2ccd7] pb-2.5 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#bf3e67]"></span>
                      대시보드 우측 사각 1:1 배너 영역 제어
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-[#735965]">사각 배너 태그 라벨</label>
                        <input 
                          type="text"
                          value={bannerSideTag}
                          onChange={(e) => setBannerSideTag(e.target.value)}
                          required
                          className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-4 py-3 text-xs text-[#2d2026] focus:outline-none focus:border-[#f25f8a]"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-[#735965]">사각 배너 타이틀 헤드라인</label>
                        <textarea 
                          rows={2}
                          value={bannerSideTitle}
                          onChange={(e) => setBannerSideTitle(e.target.value)}
                          required
                          className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-4 py-3 text-xs text-[#2d2026] focus:outline-none focus:border-[#f25f8a] resize-none"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-[#735965]">사각 배너 이미지 등록 (URL)</label>
                        <input 
                          type="text"
                          value={bannerSideImage}
                          onChange={(e) => setBannerSideImage(e.target.value)}
                          placeholder="https://example.com/square.jpg"
                          className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-4 py-3 text-xs text-[#2d2026] focus:outline-none focus:border-[#f25f8a]"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-[#735965]">사각 배너 이미지 업로드 (로컬 파일)</label>
                        <div className="flex items-center gap-3 bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-4 py-2.5">
                          <input 
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, "side")}
                            className="text-xs text-[#735965] file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-[10px] file:font-black file:bg-[#ffd3df] file:text-[#bf3e67] file:hover:bg-[#ffd3df]/80 cursor-pointer flex-1"
                          />
                          {bannerSideImage && (
                            <button
                              type="button"
                              onClick={() => setBannerSideImage("")}
                              className="px-2 py-1 rounded bg-red-50 hover:bg-red-100 text-red-500 text-[10px] font-bold border border-red-200 transition-colors"
                            >
                              지우기
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-[#735965]">사각 배너 상세 세부 설명</label>
                        <textarea 
                          rows={3}
                          value={bannerSideDesc}
                          onChange={(e) => setBannerSideDesc(e.target.value)}
                          required
                          className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-4 py-3 text-xs text-[#2d2026] focus:outline-none focus:border-[#f25f8a] resize-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-[#735965]">사각 배너 클릭 유도 버튼 텍스트</label>
                        <input 
                          type="text"
                          value={bannerSideBtnText}
                          onChange={(e) => setBannerSideBtnText(e.target.value)}
                          required
                          className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-4 py-3 text-xs text-[#2d2026] focus:outline-none focus:border-[#f25f8a]"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-[#735965]">사각 배너 연결 대상 설정</label>
                        <select 
                          value={bannerSideLink.startsWith("http") ? "custom" : bannerSideLink}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val !== "custom") {
                              setBannerSideLink(val);
                            } else {
                              setBannerSideLink("https://");
                            }
                          }}
                          className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-4 py-3 text-xs text-[#2d2026] focus:outline-none focus:border-[#f25f8a]"
                        >
                          <option value="training">교육자료실 (내부 메뉴 연결)</option>
                          <option value="material">홍보자료실 (내부 메뉴 연결)</option>
                          <option value="order">자재발주 / 주문하기 (내부 메뉴 연결)</option>
                          <option value="inquiry">1:1 문의하기 (내부 메뉴 연결)</option>
                          <option value="custom">직접 URL 웹 주소 입력 연결</option>
                        </select>
                      </div>
                      {bannerSideLink.startsWith("http") && (
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-[#735965]">직접 입력한 연결 URL 주소</label>
                          <input 
                            type="text"
                            value={bannerSideLink}
                            onChange={(e) => setBannerSideLink(e.target.value)}
                            placeholder="https://example.com"
                            required
                            className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-4 py-3 text-xs text-[#2d2026] focus:outline-none focus:border-[#f25f8a]"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Save Trigger */}
                  <button
                    type="submit"
                    className="w-full py-4 bg-[#f25f8a] hover:bg-[#df4977] text-white font-bold text-sm rounded-xl transition-all shadow-[0_4px_16px_rgba(242,95,138,0.25)] flex items-center justify-center gap-2 hover:scale-[1.01]"
                  >
                    <Sparkles size={16} />
                    본사 대시보드 배너 설정 일괄 실시간 저장
                  </button>
                </form>
              )}

              {/* 3. REAL-TIME FLOATING BUTTON CHANNELS */}
              {bannerSubMenu === "floating" && (
                <form onSubmit={handleUpdateFloating} className="bg-white border border-[#f2ccd7] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-[#f2ccd7]/60 pb-4">
                    <div className="space-y-1">
                      <h3 className="font-extrabold text-sm text-[#2d2026] flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#735965]"></span>
                        홈페이지 우측 핵심 플로팅 버튼 연동 제어
                      </h3>
                      <p className="text-[10px] text-[#735965] font-bold">사용자 페이지 우측 하단에 고정 표시될 소셜 연동(인스타, 유튜브, 카카오톡 채널, 전화, 카톡 상담) 트레이 연동 설정입니다.</p>
                    </div>
                    {/* Switch Toggle */}
                    <button
                      type="button"
                      onClick={() => setFloatingActive(!floatingActive)}
                      className={`w-12 h-6 rounded-full p-1 transition-all duration-300 ${
                        floatingActive ? "bg-[#f25f8a] flex justify-end" : "bg-[#735965]/20 flex justify-start"
                      }`}
                    >
                      <span className="w-4 h-4 rounded-full bg-white shadow-sm block transition-all"></span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#735965]">공식 인스타그램 주소 (Instagram)</label>
                      <input
                        type="text"
                        value={floatingInsta}
                        onChange={(e) => setFloatingInsta(e.target.value)}
                        placeholder="https://instagram.com/account"
                        className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-4 py-3 text-xs text-[#2d2026] focus:outline-none focus:border-[#f25f8a]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#735965]">공식 유튜브 채널 주소 (YouTube)</label>
                      <input
                        type="text"
                        value={floatingYoutube}
                        onChange={(e) => setFloatingYoutube(e.target.value)}
                        placeholder="https://youtube.com/c/channel"
                        className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-4 py-3 text-xs text-[#2d2026] focus:outline-none focus:border-[#f25f8a]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#735965]">빠른상담 연결 주소 (예: 카카오 상담페이지)</label>
                      <input
                        type="text"
                        value={floatingChat}
                        onChange={(e) => setFloatingChat(e.target.value)}
                        placeholder="https://pf.kakao.com/_xxxx"
                        className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-4 py-3 text-xs text-[#2d2026] focus:outline-none focus:border-[#f25f8a]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#735965]">다이렉트 전화문의 유도 번호 (전화 연결)</label>
                      <input
                        type="text"
                        value={floatingPhone}
                        onChange={(e) => setFloatingPhone(e.target.value)}
                        placeholder="예: 1566-3594"
                        className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-4 py-3 text-xs text-[#2d2026] focus:outline-none focus:border-[#f25f8a]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#735965]">실시간 카카오톡 채팅방/오픈채팅 연결 주소 (카톡상담)</label>
                      <input
                        type="text"
                        value={floatingKakao}
                        onChange={(e) => setFloatingKakao(e.target.value)}
                        placeholder="https://open.kakao.com/o/sxxxx"
                        className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-4 py-3 text-xs text-[#2d2026] focus:outline-none focus:border-[#f25f8a]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#735965]">공식 네이버 블로그 주소 (Blog)</label>
                      <input
                        type="text"
                        value={floatingBlog}
                        onChange={(e) => setFloatingBlog(e.target.value)}
                        placeholder="https://blog.naver.com/xxxx"
                        className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-4 py-3 text-xs text-[#2d2026] focus:outline-none focus:border-[#f25f8a]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-[#735965] hover:bg-[#5d4752] text-white font-bold text-sm rounded-xl transition-all shadow-[0_4px_16px_rgba(115,89,101,0.25)] flex items-center justify-center gap-2 hover:scale-[1.01]"
                  >
                    <Sparkles size={16} />
                    홈페이지 플로팅 채널 연동 정보 반영 및 저장
                  </button>
                </form>
              )}

              {/* 4. INSTAGRAM FEED MANAGEMENT */}
              {bannerSubMenu === "instagram" && (
                <div className="space-y-6 animate-fadeIn">
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-[#f2ccd7] rounded-3xl p-6 shadow-sm">
                    <div className="space-y-1">
                      <h3 className="font-extrabold text-sm text-[#2d2026] flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#7c3aed] animate-pulse"></span>
                        인스타그램 연동 피드 리스트
                      </h3>
                      <p className="text-[10px] text-[#735965]">
                        브랜드 홈페이지 하단 인스타그램 섹션에 노출될 게시물 데이터 목록입니다. 클릭 시 상세 팝업 및 인스타 아웃링크가 연동됩니다.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setInstaId(null);
                        setInstaImg("");
                        setInstaText("");
                        setInstaLink("");
                        setInstaDate(new Date().toISOString().split("T")[0]);
                        setInstaOrder((convexInstagram?.length || 0) + 1);
                        setIsInstaModalOpen(true);
                      }}
                      className="px-4 py-2 bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-[11px] font-black rounded-xl transition-all shadow-[0_4px_12px_rgba(124,58,237,0.2)] hover:scale-[1.02] cursor-pointer"
                    >
                      + 신규 인스타 게시물 연동
                    </button>
                  </div>

                  {/* List Table */}
                  <div className="bg-white border border-[#f2ccd7] rounded-3xl overflow-hidden shadow-sm">
                    <div className="bg-[#fff9fb] px-6 py-3 border-b border-[#f2ccd7]/60 flex items-center justify-between text-[11px] font-bold text-[#735965]">
                      <span className="flex items-center gap-1.5">
                        🖐️ <strong>순서 변경 팁:</strong> 마우스로 ☰ 핸들을 잡고 위아래로 끌어다 놓거나(Drag & Drop), ▲/▼ 버튼을 눌러 인스타 피드 순서를 자유롭게 조절할 수 있습니다.
                      </span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse min-w-[750px]">
                        <thead>
                          <tr className="bg-[#fff1f5]/70 border-b border-[#f2ccd7] text-[10px] font-black text-[#735965] uppercase tracking-wider">
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
                        <tbody className="divide-y divide-[#f2ccd7]/40 text-xs">
                          {localInstaList.length === 0 ? (
                            <tr>
                              <td colSpan={8} className="py-12 text-center font-bold text-neutral-400">
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
                                      ? "opacity-30 bg-purple-100/80 border-y-2 border-dashed border-[#7c3aed]"
                                      : isDragOver
                                      ? "bg-purple-50 border-y-2 border-[#7c3aed]"
                                      : "hover:bg-[#fff9fb]/60"
                                  }`}
                                >
                                  {/* Drag Handle */}
                                  <td className="py-4 px-4 text-center">
                                    <div className="inline-flex items-center justify-center p-1.5 text-neutral-400 hover:text-[#7c3aed] hover:bg-purple-100/50 rounded-lg cursor-grab active:cursor-grabbing transition-colors" title="드래그하여 순서 변경">
                                      <GripVertical size={18} />
                                    </div>
                                  </td>

                                  {/* Order with Move Buttons */}
                                  <td className="py-4 px-4 text-center">
                                    <div className="flex items-center justify-center gap-1">
                                      <span className="font-extrabold text-[#7c3aed] text-xs min-w-[1.25rem]">
                                        {item.orderIndex || index + 1}
                                      </span>
                                      <div className="flex flex-col gap-0.5">
                                        <button
                                          type="button"
                                          disabled={index === 0}
                                          onClick={() => handleInstaMove(index, "up")}
                                          className="p-0.5 text-neutral-400 hover:text-[#7c3aed] disabled:opacity-20 disabled:hover:text-neutral-400 cursor-pointer"
                                          title="위로 이동"
                                        >
                                          <ArrowUp size={11} />
                                        </button>
                                        <button
                                          type="button"
                                          disabled={index === localInstaList.length - 1}
                                          onClick={() => handleInstaMove(index, "down")}
                                          className="p-0.5 text-neutral-400 hover:text-[#7c3aed] disabled:opacity-20 disabled:hover:text-neutral-400 cursor-pointer"
                                          title="아래로 이동"
                                        >
                                          <ArrowDown size={11} />
                                        </button>
                                      </div>
                                    </div>
                                  </td>

                                  {/* Image */}
                                  <td className="py-4 px-6">
                                    <div className="w-14 h-14 rounded-lg overflow-hidden border border-[#f2ccd7]/60 bg-neutral-50 flex items-center justify-center">
                                      <img src={optimizeCloudinaryUrl(item.img)} alt="Insta" className="w-full h-full object-cover" />
                                    </div>
                                  </td>

                                  {/* Text Summary */}
                                  <td className="py-4 px-6">
                                    <p className="font-semibold text-[#2d2026] line-clamp-2 leading-relaxed max-w-md">
                                      {item.text}
                                    </p>
                                  </td>

                                  {/* Main Flag Toggle */}
                                  <td className="py-4 px-6 text-center">
                                    <button
                                      type="button"
                                      onClick={() => handleToggleInstaMain(item)}
                                      className={`px-3 py-1.5 rounded-full font-extrabold text-[10px] transition-all cursor-pointer shadow-sm hover:scale-105 inline-flex items-center justify-center gap-1 ${
                                        item.isMain
                                          ? "bg-amber-400 text-neutral-950 border border-amber-500 hover:bg-amber-300"
                                          : "bg-neutral-100 text-neutral-400 border border-neutral-200 hover:bg-neutral-200 hover:text-neutral-700"
                                      }`}
                                      title={item.isMain ? "클릭 시 메인 노출 해제" : "클릭 시 메인 노출로 지정 (최대 4개)"}
                                    >
                                      {item.isMain ? "★ 메인 노출" : "☆ 미노출"}
                                    </button>
                                  </td>

                                  {/* Link */}
                                  <td className="py-4 px-6">
                                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-[#7c3aed] hover:underline font-semibold break-all">
                                      {item.link}
                                    </a>
                                  </td>

                                  {/* Date */}
                                  <td className="py-4 px-6 text-[#735965] font-bold">{item.date}</td>

                                  {/* Actions */}
                                  <td className="py-4 px-6 text-center">
                                    <div className="flex items-center justify-center gap-1.5">
                                      <button
                                        type="button"
                                        onClick={() => handleOpenInstaEdit(item)}
                                        className="px-2.5 py-1 bg-white border border-[#f2ccd7] text-[#735965] hover:bg-[#fff1f5] rounded-lg transition-all font-bold text-[10px] cursor-pointer"
                                      >
                                        수정
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteInstagram(item._id)}
                                        className="px-2.5 py-1 bg-white border border-red-200 text-red-500 hover:bg-red-50 rounded-lg transition-all font-bold text-[10px] cursor-pointer"
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
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                      <div className="bg-white border border-[#f2ccd7] rounded-3xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-5 animate-fadeIn">
                        <div className="flex items-center justify-between border-b border-[#f2ccd7] pb-3">
                          <h3 className="font-extrabold text-base text-[#2d2026]">
                            {instaId ? "📸 인스타 연동 피드 수정" : "📸 신규 인스타 피드 등록"}
                          </h3>
                          <button
                            type="button"
                            onClick={() => setIsInstaModalOpen(false)}
                            className="text-neutral-400 hover:text-black font-extrabold text-sm"
                          >
                            ✕
                          </button>
                        </div>

                        <form onSubmit={handleSaveInstagram} className="space-y-4 text-left">
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-[#735965]">게시물 실제 링크 URL <span className="text-red-500">*</span></label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                required
                                value={instaLink}
                                onChange={(e) => {
                                  const url = e.target.value;
                                  setInstaLink(url);
                                  const autoThumb = getInstagramThumbnailUrl(url);
                                  if (autoThumb && autoThumb !== url) {
                                    setInstaImg(autoThumb);
                                  }
                                }}
                                placeholder="https://www.instagram.com/p/..."
                                className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-4 py-3 text-xs text-[#2d2026] focus:outline-none focus:border-[#7c3aed]"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const autoThumb = getInstagramThumbnailUrl(instaLink);
                                  if (autoThumb && autoThumb !== instaLink) {
                                    setInstaImg(autoThumb);
                                    alert("인스타그램 대표 썸네일 이미지가 자동으로 추출되어 설정되었습니다!");
                                  } else {
                                    alert("올바른 인스타그램 게시물 링크(https://www.instagram.com/p/...)를 입력해 주세요.");
                                  }
                                }}
                                className="shrink-0 px-3.5 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 font-extrabold text-[11px] rounded-xl transition-all whitespace-nowrap cursor-pointer border border-purple-200"
                              >
                                ✨ 썸네일 자동 추출
                              </button>
                            </div>
                            <p className="text-[10px] text-purple-600 font-bold">
                              * 인스타그램 게시물 링크만 입력하시면 대표 썸네일 이미지를 자동으로 추출하여 표출합니다.
                            </p>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-[#735965]">이미지 URL <span className="text-neutral-400 font-normal">(선택사항 - 비워둘 경우 게시물 링크에서 자동 추출)</span></label>
                            <input
                              type="text"
                              value={instaImg}
                              onChange={(e) => setInstaImg(e.target.value)}
                              placeholder="비워두시면 게시물 링크에서 대표 썸네일을 자동으로 도출합니다."
                              className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-4 py-3 text-xs text-[#2d2026] focus:outline-none focus:border-[#7c3aed]"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-xs font-bold text-[#735965]">게시 일자 <span className="text-red-500">*</span></label>
                              <input
                                type="date"
                                required
                                value={instaDate}
                                onChange={(e) => setInstaDate(e.target.value)}
                                className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-4 py-3 text-xs text-[#2d2026] focus:outline-none focus:border-[#7c3aed]"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-xs font-bold text-[#735965]">노출 순서 <span className="text-red-500">*</span></label>
                              <input
                                type="number"
                                required
                                min={1}
                                value={instaOrder}
                                onChange={(e) => setInstaOrder(Number(e.target.value))}
                                className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-4 py-3 text-xs text-[#2d2026] focus:outline-none focus:border-[#7c3aed]"
                              />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-[#735965]">게시물 설명/본문 내용 <span className="text-red-500">*</span></label>
                            <textarea
                              required
                              rows={5}
                              value={instaText}
                              onChange={(e) => setInstaText(e.target.value)}
                              placeholder="상세 팝업에 표출될 피드 상세 내용을 입력하세요."
                              className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-4 py-3 text-xs text-[#2d2026] focus:outline-none focus:border-[#7c3aed] resize-none leading-relaxed"
                            />
                          </div>

                          <div className="space-y-1.5 bg-amber-50/40 border border-amber-200/50 rounded-xl p-4 flex items-center justify-between">
                            <div className="space-y-0.5">
                              <label className="text-xs font-black text-[#735965] flex items-center gap-1.5">
                                ★ 처음 보이는 4개 피드 지정
                              </label>
                              <p className="text-[10px] text-neutral-400 font-bold">체크 시, 브랜드 소개 페이지 최상단 슬라이드 첫 화면(1~4번 칸)에 우선 고정 노출됩니다. (최대 4개)</p>
                            </div>
                            <input
                              type="checkbox"
                              checked={instaIsMain}
                              onChange={(e) => setInstaIsMain(e.target.checked)}
                              className="w-5 h-5 accent-amber-500 cursor-pointer rounded focus:ring-amber-500"
                            />
                          </div>

                          <div className="pt-2 flex gap-2">
                            <button
                              type="button"
                              onClick={() => setIsInstaModalOpen(false)}
                              className="flex-1 py-3 border border-neutral-200 hover:bg-neutral-50 font-bold text-xs rounded-xl text-neutral-500 transition-all cursor-pointer"
                            >
                              취소
                            </button>
                            <button
                              type="submit"
                              className="flex-1 py-3 bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
                            >
                              저장하기
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
                <h2 className="text-xl font-bold text-[#2d2026]">본사 시스템 통합 설정</h2>
                <p className="text-xs text-[#735965] font-bold mt-1">
                  본사 어드민 최고 관리자 로그인 계정 및 점주 발주 주문의 배송 상태값 목록을 유연하게 제어합니다.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                
                {/* 1. Account Management (계정관리) */}
                <div className="bg-white border border-[#f2ccd7] rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
                  <h3 className="font-extrabold text-sm text-[#2d2026] border-b border-[#f2ccd7] pb-3 flex items-center gap-2">
                    <UserCheck size={18} className="text-[#f25f8a]" />
                    본사 최고 관리자 계정 변경 관리
                  </h3>
                  
                  <form onSubmit={handleUpdateAdminAccount} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#735965]">관리자 ID *</label>
                      <input 
                        type="text"
                        value={adminIdSetting}
                        onChange={(e) => setAdminIdSetting(e.target.value)}
                        required
                        className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-4 py-3 text-xs text-[#2d2026] focus:outline-none focus:border-[#f25f8a]"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#735965]">새 비밀번호 (미입력 시 기존 비밀번호 유지)</label>
                      <input 
                        type="password"
                        placeholder="새 비밀번호 입력"
                        value={adminPwSetting}
                        onChange={(e) => setAdminPwSetting(e.target.value)}
                        className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-4 py-3 text-xs text-[#2d2026] placeholder-[#735965]/40 focus:outline-none focus:border-[#f25f8a]"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#735965]">새 비밀번호 확인</label>
                      <input 
                        type="password"
                        placeholder="새 비밀번호 동일 입력"
                        value={adminPwSettingConfirm}
                        onChange={(e) => setAdminPwSettingConfirm(e.target.value)}
                        className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-4 py-3 text-xs text-[#2d2026] placeholder-[#735965]/40 focus:outline-none focus:border-[#f25f8a]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 bg-[#f25f8a] hover:bg-[#df4977] text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <Check size={14} />
                      관리자 계정 정보 적용
                    </button>
                  </form>
                </div>

                {/* 2. Delivery Status Values Management (배송상태값 관리) */}
                <div className="bg-white border border-[#f2ccd7] rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
                  <h3 className="font-extrabold text-sm text-[#2d2026] border-b border-[#f2ccd7] pb-3 flex items-center gap-2">
                    <Truck size={18} className="text-[#bf3e67]" />
                    주문 배송 상태값(태그) 관리
                  </h3>
                  
                  <p className="text-[11px] text-[#735965] font-semibold leading-relaxed">
                    가맹점 발주 현황판 및 어드민에서 사용될 배송 상태의 명칭들을 자유롭게 추가 및 수정할 수 있습니다.<br />
                    <span className="text-[#bf3e67] font-extrabold">* 단, [주문완료] 및 [배송완료]는 코어 시스템 상태값으로 유지되어야 하므로 임의로 삭제할 수 없습니다.</span>
                  </p>

                  <form onSubmit={handleAddDeliveryStatus} className="flex gap-2">
                    <input 
                      type="text"
                      placeholder="신규 배송 상태값 입력 (e.g. 세관통과중, 배송대기 등)"
                      value={newStatusName}
                      onChange={(e) => setNewStatusName(e.target.value)}
                      required
                      className="flex-1 bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-4 py-2.5 text-xs text-[#2d2026] placeholder-[#735965]/40 focus:outline-none focus:border-[#f25f8a]"
                    />
                    <button 
                      type="submit"
                      className="px-4 py-2.5 bg-[#f25f8a] hover:bg-[#df4977] text-white font-bold text-xs rounded-xl transition-all whitespace-nowrap"
                    >
                      추가
                    </button>
                  </form>

                  <div className="space-y-3 pt-2">
                    <label className="text-[11px] font-bold text-[#735965] block">현재 활성화된 배송 상태값 리스트</label>
                    <div className="flex flex-wrap gap-2 bg-[#fff9fb] border border-[#f2ccd7]/60 p-4 rounded-xl">
                      {deliveryStatuses.map((st) => {
                        const isCore = ["주문완료", "배송완료"].includes(st);
                        return (
                          <span 
                            key={st}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${
                              isCore 
                                ? "bg-[#fff1f5] text-[#bf3e67] border border-[#f2ccd7]" 
                                : "bg-neutral-100 text-neutral-600 border border-neutral-200"
                            }`}
                          >
                            {st}
                            {!isCore && (
                              <button
                                type="button"
                                onClick={() => handleDeleteDeliveryStatus(st)}
                                className="hover:text-red-500 text-neutral-400 font-extrabold ml-1"
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

                  <div className="flex justify-end pt-2 border-t border-[#f2ccd7]/40">
                    <button
                      type="button"
                      onClick={handleResetDeliveryStatuses}
                      className="px-3.5 py-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-600 text-[10px] font-bold border border-neutral-300 transition-colors"
                    >
                      상태값 기본값으로 리셋
                    </button>
                  </div>
                </div>

                {/* 3. Status Colors Settings (진행상태 버튼 색상 설정) */}
                <div className="bg-white border border-[#f2ccd7] rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
                  <h3 className="font-extrabold text-sm text-[#2d2026] border-b border-[#f2ccd7] pb-3 flex items-center gap-2">
                    <Palette size={18} className="text-[#f25f8a]" />
                    진행상태 버튼 색상 설정
                  </h3>
                  
                  <p className="text-[11px] text-[#735965] font-semibold leading-relaxed">
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
                        <div key={status} className="flex items-center justify-between gap-4 bg-[#fff9fb] p-3 rounded-xl border border-[#f2ccd7]/40">
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-[#2d2026]">{status}</span>
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold ${
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
                            className="bg-white border border-[#f2ccd7] rounded-lg px-2.5 py-1 text-xs text-[#2d2026] focus:outline-none focus:border-[#f25f8a] cursor-pointer"
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
                      // Dispatch a storage event so portal tab can sync in real-time if open in another tab
                      window.dispatchEvent(new Event("storage"));
                      triggerToast("진행상태 버튼 색상 설정이 성공적으로 저장되었습니다!");
                    }}
                    className="w-full py-3 bg-[#f25f8a] hover:bg-[#df4977] text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer border-0"
                  >
                    <Check size={14} />
                    색상 설정 저장하기
                  </button>
                </div>

                {/* 4. Naver Map API Key Integration (외부 지도 API 연동) */}
                <div className="bg-white border border-[#f2ccd7] rounded-3xl p-6 sm:p-8 shadow-sm space-y-5 lg:col-span-2">
                  <h3 className="font-extrabold text-sm text-[#2d2026] border-b border-[#f2ccd7] pb-3 flex items-center gap-2">
                    <Map size={18} className="text-[#f25f8a]" />
                    가맹점 현황 지도 연동 설정 (네이버 지도 API)
                  </h3>
                  
                  <p className="text-[11px] text-[#735965] font-semibold leading-relaxed">
                    공식 가맹점 안내 페이지의 지도를 구글 맵 대신 국내 환경에 친화적인 <strong>네이버 지도(Naver Maps)</strong>로 직접 연동할 수 있습니다.<br />
                    네이버 클라우드 플랫폼에서 발급받은 Client ID를 등록하면 실시간 지점 좌표 변환 및 120겹파이 로고 이미지 마커 핀 표시 기능이 활성화됩니다.<br />
                    <span className="text-[#bf3e67] font-extrabold">* 미등록 상태인 경우, 가맹점 안내 페이지는 구글 지도를 통해 안전하게 자동 대체 작동합니다.</span>
                  </p>

                  <form onSubmit={handleUpdateNaverClientId} className="space-y-4 max-w-xl">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#735965]">네이버 클라우드 플랫폼 Client ID</label>
                      <input 
                        type="text"
                        placeholder="네이버 클라우드 플랫폼에서 발급받은 Client ID를 입력하세요"
                        value={naverClientIdSetting}
                        onChange={(e) => setNaverClientIdSetting(e.target.value)}
                        className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-4 py-3 text-xs text-[#2d2026] placeholder-[#735965]/40 focus:outline-none focus:border-[#f25f8a]"
                      />
                      <p className="text-[10px] text-neutral-400 font-medium leading-relaxed">
                        발급처: <a href="https://console.ncloud.com" target="_blank" rel="noopener noreferrer" className="text-[#f25f8a] underline hover:text-[#df4977]">Naver Cloud Platform Console</a><br />
                        ⚙️ <strong>플랫폼 설정 방법</strong>: AI·NAVER API &gt; Application 등록 &gt; <strong>Web 서비스 URL</strong>에 아래 도메인을 등록해주세요.<br />
                        👉 등록할 사이트 도메인: <code className="bg-neutral-100 text-[#bf3e67] px-1.5 py-0.5 rounded font-mono font-bold text-[11px]">{typeof window !== "undefined" ? window.location.origin : "https://120pie-new.vercel.app"}</code>
                      </p>
                    </div>

                    <button
                      type="submit"
                      className="py-3 px-6 bg-[#f25f8a] hover:bg-[#df4977] text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                    >
                      <Check size={14} />
                      네이버 지도 API 설정 저장
                    </button>
                  </form>
                </div>

                {/* 4. 약관 및 정책 설정 */}
                <div className="bg-white border border-[#f2ccd7] rounded-3xl p-6 sm:p-8 shadow-sm space-y-5 lg:col-span-2">
                  <h3 className="font-extrabold text-sm text-[#2d2026] border-b border-[#f2ccd7] pb-3 flex items-center gap-2">
                    <FileText size={18} className="text-[#f25f8a]" />
                    이용약관, 개인정보처리방침 및 환불정책 설정
                  </h3>
                  
                  <p className="text-[11px] text-[#735965] font-semibold leading-relaxed">
                    홈페이지 하단 푸터 및 주요 안내에 사용되는 서비스 이용약관, 개인정보처리방침, 환불정책 내용을 관리합니다.<br />
                    작성된 내용은 사이트 전반의 푸터 메뉴를 통해 연동되어 노출됩니다.
                  </p>

                  <form onSubmit={handleSavePolicies} className="space-y-5">
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-[#735965] block">이용약관</label>
                        <textarea 
                          value={termsOfUseSetting}
                          onChange={(e) => setTermsOfUseSetting(e.target.value)}
                          rows={12}
                          required
                          className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-4 py-3 text-xs text-[#2d2026] focus:outline-none focus:border-[#f25f8a] font-mono leading-relaxed resize-y"
                          placeholder="이용약관 내용을 입력해 주세요"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-[#735965] block">개인정보처리방침</label>
                        <textarea 
                          value={privacyPolicySetting}
                          onChange={(e) => setPrivacyPolicySetting(e.target.value)}
                          rows={12}
                          required
                          className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-4 py-3 text-xs text-[#2d2026] focus:outline-none focus:border-[#f25f8a] font-mono leading-relaxed resize-y"
                          placeholder="개인정보처리방침 내용을 입력해 주세요"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-[#735965] block">환불정책</label>
                        <textarea 
                          value={refundPolicySetting}
                          onChange={(e) => setRefundPolicySetting(e.target.value)}
                          rows={12}
                          required
                          className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-4 py-3 text-xs text-[#2d2026] focus:outline-none focus:border-[#f25f8a] font-mono leading-relaxed resize-y"
                          placeholder="환불정책 내용을 입력해 주세요"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="py-3 px-6 bg-[#f25f8a] hover:bg-[#df4977] text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                    >
                      <Check size={14} />
                      약관 및 정책 설정 저장
                    </button>
                  </form>
                </div>

                {/* 5. 실시간 SMS 발송 자동 연동 및 문구 설정 */}
                {smsSettings && (
                  <div className="bg-white border border-[#f2ccd7] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 lg:col-span-2">
                    <h3 className="font-extrabold text-sm text-[#2d2026] border-b border-[#f2ccd7] pb-3 flex items-center gap-2">
                      <MessageSquare size={18} className="text-[#f25f8a]" />
                      5. 실시간 SMS 발송 자동 연동 및 문구 설정 (알리고 API 연동)
                    </h3>
                    
                    <p className="text-[11px] text-[#735965] font-semibold leading-relaxed">
                      가맹점 신청, 자재 주문, 1:1 문의 등 주요 이벤트 발생 시 지정된 고객 및 본사 담당자에게 실시간 문자(SMS/LMS)를 자동 전송합니다.<br />
                      국내 최고 SMS 대행사인 <strong>알리고(Aligo)</strong> 서비스 API를 공식 지원하며, 각 구분별로 고객용/관리자용 템플릿과 활성화 여부를 따로 설정할 수 있습니다.
                    </p>

                    <form onSubmit={handleUpdateSmsSettings} className="space-y-6">
                      
                      {/* A. 알리고 API 연동 Key 관리 */}
                      <div className="bg-[#fff9fb]/40 border border-[#f2ccd7]/60 rounded-2xl p-5 space-y-4">
                        <h4 className="text-xs font-black text-[#bf3e67] border-b border-[#f2ccd7]/30 pb-2">
                          🔌 알리고 SMS API 연동 자격증명 설정
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold text-[#735965]">
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
                              className="w-full bg-white border border-[#f2ccd7] rounded-xl px-3 py-2 text-xs text-[#2d2026] placeholder-[#735965]/40 focus:outline-none focus:border-[#f25f8a]"
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
                              className="w-full bg-white border border-[#f2ccd7] rounded-xl px-3 py-2 text-xs text-[#2d2026] placeholder-[#735965]/40 focus:outline-none focus:border-[#f25f8a]"
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-2 pt-1 border-t border-[#f2ccd7]/20">
                          <label className="flex items-center gap-1.5 cursor-pointer text-[10px] font-extrabold text-[#735965] select-none">
                            <input 
                              type="checkbox"
                              checked={smsSettings.aligoTestMode !== false}
                              onChange={(e) => setSmsSettings({
                                ...smsSettings,
                                aligoTestMode: e.target.checked
                              })}
                              className="w-3.5 h-3.5 accent-[#f25f8a] rounded cursor-pointer"
                            />
                            테스트 모드 활성화 (체크 시 충전 포인트 미차감, 실제 문자는 전송되지 않음)
                          </label>
                        </div>
                        <p className="text-[9px] text-[#735965] leading-relaxed font-semibold">
                          * 알리고 API Key와 User ID를 올바르게 설정하면 실제 가맹점 신청 및 발주 시 알리고 서버를 경유하여 자동 전송됩니다.<br />
                          * 테스트 모드가 체크되어 있으면 실제 과금이 발생하지 않고 전송 성공 로그만 반환됩니다. 실무에 적용하실 때는 해제해 주세요.
                        </p>
                      </div>

                      {/* C. 알리고 API 연동 테스트 발송 (신설) */}
                      <div className="bg-[#fff9fb]/40 border border-[#f2ccd7]/60 rounded-2xl p-5 space-y-4">
                        <h4 className="text-xs font-black text-[#bf3e67] border-b border-[#f2ccd7]/30 pb-2 flex items-center gap-1.5">
                          🧪 알리고 API 실시간 발송 테스트
                        </h4>
                        <p className="text-[10px] text-[#735965] font-semibold leading-relaxed">
                          입력된 알리고 API Key와 User ID가 올바른지 실제 문자를 발송하여 테스트합니다.<br />
                          * 테스트 모드가 <strong>활성화</strong>된 상태이면 실제 문자가 가지 않고 로그만 반환되므로, 실제 전송을 확인하려면 위 테스트 모드를 <strong>해제</strong>하고 진행해 주세요.
                        </p>
                        <div className="flex flex-wrap items-end gap-3 text-xs font-semibold text-[#735965]">
                          <div className="space-y-1.5 flex-1 min-w-[150px]">
                            <span>발신 번호 (알리고에 등록된 번호)</span>
                            <input 
                              type="text"
                              placeholder="알리고에 등록된 발신 번호를 적어주세요"
                              value={testSenderPhone}
                              onChange={(e) => setTestSenderPhone(formatPhoneNumber(e.target.value))}
                              className="w-full bg-white border border-[#f2ccd7] rounded-xl px-3 py-2 text-xs text-[#2d2026] placeholder-[#735965]/40 focus:outline-none focus:border-[#f25f8a]"
                            />
                          </div>
                          <div className="space-y-1.5 flex-1 min-w-[150px]">
                            <span>테스트 수신 번호</span>
                            <input 
                              type="text"
                              placeholder="010-0000-0000"
                              value={testReceiverPhone}
                              onChange={(e) => setTestReceiverPhone(formatPhoneNumber(e.target.value))}
                              className="w-full bg-white border border-[#f2ccd7] rounded-xl px-3 py-2 text-xs text-[#2d2026] placeholder-[#735965]/40 focus:outline-none focus:border-[#f25f8a]"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={handleTestSendSms}
                            disabled={isTestingSms}
                            className="px-5 py-2 bg-[#f25f8a] hover:bg-[#df4977] text-white text-xs font-black rounded-xl transition-all shadow-sm flex items-center gap-1.5 h-[38px] disabled:opacity-50 cursor-pointer border-0 shrink-0"
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
                            <div key={evt.key} className="border border-[#f2ccd7]/60 rounded-3xl p-6 bg-[#fff9fb]/10 shadow-sm space-y-4">
                              <h4 className="text-xs font-black text-[#bf3e67] border-b border-[#f2ccd7]/60 pb-2 flex items-center gap-1.5 justify-between">
                                <span className="flex items-center gap-1.5">{evt.label}</span>
                                <span className="text-[10px] text-neutral-400 font-medium">변수: {evt.vars}</span>
                              </h4>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* 고객용 */}
                                <div className="space-y-3.5 bg-white border border-[#f2ccd7]/40 p-4 rounded-2xl relative">
                                  <div className="flex justify-between items-center border-b border-[#f2ccd7]/20 pb-1.5">
                                    <span className="text-[11px] font-bold text-[#2d2026]">고객용 ({evt.custLabel})</span>
                                    <label className="flex items-center gap-1.5 cursor-pointer text-[10px] font-bold text-[#735965] select-none">
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
                                        className="w-3.5 h-3.5 accent-[#f25f8a] rounded cursor-pointer"
                                      />
                                      활성화
                                    </label>
                                  </div>
                                  <div className="grid grid-cols-2 gap-3 text-[10px] font-semibold text-[#735965]">
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
                                        className="w-full bg-[#fff9fb] border border-[#f2ccd7]/60 rounded-lg px-2.5 py-1.5 text-xs text-[#2d2026]"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <span>수신 번호</span>
                                      <input 
                                        type="text"
                                        disabled
                                        value="해당 수신자 (자동)"
                                        className="w-full bg-stone-50 border border-stone-200 text-stone-400 rounded-lg px-2.5 py-1.5 text-xs font-bold cursor-not-allowed"
                                      />
                                    </div>
                                  </div>
                                  <div className="space-y-1">
                                    <span className="text-[10px] text-[#735965] font-bold">메시지 템플릿</span>
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
                                      className="w-full bg-[#fff9fb] border border-[#f2ccd7]/60 rounded-lg px-3 py-2 text-xs text-[#2d2026] leading-relaxed resize-none font-sans font-semibold"
                                    />
                                  </div>
                                </div>

                                {/* 관리자용 */}
                                <div className="space-y-3.5 bg-white border border-[#f2ccd7]/40 p-4 rounded-2xl relative">
                                  <div className="flex justify-between items-center border-b border-[#f2ccd7]/20 pb-1.5">
                                    <span className="text-[11px] font-bold text-[#2d2026]">관리자용 (본사 알림 수신)</span>
                                    <label className="flex items-center gap-1.5 cursor-pointer text-[10px] font-bold text-[#735965] select-none">
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
                                        className="w-3.5 h-3.5 accent-[#f25f8a] rounded cursor-pointer"
                                      />
                                      활성화
                                    </label>
                                  </div>
                                  <div className="space-y-2.5">
                                    <div className="grid grid-cols-2 gap-3 text-[10px] font-semibold text-[#735965]">
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
                                          className="w-full bg-[#fff9fb] border border-[#f2ccd7]/60 rounded-lg px-2.5 py-1.5 text-xs text-[#2d2026]"
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
                                            className="min-w-0 flex-1 bg-[#fff9fb] border border-[#f2ccd7]/60 rounded-lg px-2 py-1.5 text-xs text-[#2d2026] placeholder-[#c4a0ae]"
                                          />
                                          <button 
                                            type="button"
                                            onClick={() => addAdminReceiver(evt.key)}
                                            className="px-2.5 py-1.5 bg-[#f25f8a] hover:bg-[#df4977] text-white text-[10px] font-extrabold rounded-lg shrink-0 cursor-pointer border-0"
                                          >
                                            추가
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    {/* 수신자 번호 리스트 태그 */}
                                    <div className="space-y-1">
                                      <span className="text-[10px] text-[#735965] font-bold">수신 번호 리스트 ({(config.admin.receivers || []).length}개)</span>
                                      <div className="flex flex-wrap gap-1.5 bg-[#fff9fb] border border-[#f2ccd7]/30 p-2 rounded-xl min-h-[42px] max-h-[100px] overflow-y-auto">
                                        {(config.admin.receivers || []).map((num: string) => (
                                          <span key={num} className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-white border border-[#f2ccd7]/60 rounded-lg text-[10px] text-[#2d2026] font-bold">
                                            {num}
                                            <button 
                                              type="button" 
                                              onClick={() => removeAdminReceiver(evt.key, num)}
                                              className="text-red-400 hover:text-red-600 font-extrabold shrink-0 border-0 bg-transparent cursor-pointer"
                                            >
                                              &times;
                                            </button>
                                          </span>
                                        ))}
                                        {(config.admin.receivers || []).length === 0 && (
                                          <span className="text-[9px] text-[#735965]/50 font-bold m-auto">등록된 수신자가 없습니다.</span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="space-y-1">
                                    <span className="text-[10px] text-[#735965] font-bold">메시지 템플릿</span>
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
                                      className="w-full bg-[#fff9fb] border border-[#f2ccd7]/60 rounded-lg px-3 py-2 text-xs text-[#2d2026] leading-relaxed resize-none font-sans font-semibold"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* 저장 버튼 */}
                      <div className="flex justify-end border-t border-[#f2ccd7]/40 pt-4">
                        <button
                          type="submit"
                          className="py-3 px-6 bg-[#f25f8a] hover:bg-[#df4977] text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer border-0"
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
                  <h2 className="text-xl font-bold text-[#2d2026]">본사 공식 갤러리 관리</h2>
                  <p className="text-xs text-[#735965] font-bold mt-1">
                    점주 전용 홍보자료, 신메뉴 연출컷 및 가맹점 인테리어 공식 이미지 데이터를 관리합니다.
                  </p>
                </div>
                <button
                  onClick={handleOpenAddGalleryModal}
                  className="px-5 py-3 bg-[#f25f8a] hover:bg-[#df4977] text-white font-extrabold text-xs rounded-xl shadow-md shadow-[#f25f8a]/10 hover:scale-[1.02] transition-all flex items-center gap-1.5 shrink-0"
                >
                  <Plus size={14} />
                  신규 이미지 등록
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left: Category Management Panel (4 cols) */}
                <div className="lg:col-span-4 bg-white border border-[#f2ccd7] rounded-3xl p-6 shadow-sm space-y-6">
                  <h3 className="font-extrabold text-sm text-[#2d2026] border-b border-[#f2ccd7] pb-3 flex items-center gap-2">
                    <BookOpen size={16} className="text-[#f25f8a]" />
                    카테고리 관리
                  </h3>

                  <form onSubmit={handleAddGalleryCategory} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="신규 카테고리 입력"
                      value={newGalleryCategoryName}
                      onChange={(e) => setNewGalleryCategoryName(e.target.value)}
                      required
                      className="flex-1 bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-3 py-2 text-xs text-[#2d2026] placeholder-[#735965]/40 focus:outline-none focus:border-[#f25f8a]"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#f25f8a] hover:bg-[#df4977] text-white font-bold text-xs rounded-xl transition-all whitespace-nowrap"
                    >
                      추가
                    </button>
                  </form>

                  <div className="space-y-3">
                    <label className="text-[11px] font-bold text-[#735965] block">등록된 카테고리 리스트 ({galleryCategories.length}개)</label>
                    <div className="space-y-2 p-3 bg-[#fff9fb] border border-[#f2ccd7]/60 rounded-2xl min-h-[120px] max-h-[300px] overflow-y-auto">
                      {galleryCategories.map((cat, idx) => (
                        <div
                          key={cat}
                          className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold bg-[#fff1f5] text-[#bf3e67] border border-[#f2ccd7] group"
                        >
                          <span>{cat}</span>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleAdjustGalleryCategoryOrder(idx, "up")}
                              disabled={idx === 0}
                              className="w-6 h-6 flex items-center justify-center rounded-lg bg-white hover:bg-neutral-50 border border-[#f2ccd7] text-[#bf3e67] disabled:opacity-30 disabled:hover:bg-white text-[9px] transition-colors cursor-pointer"
                              title="위로 이동"
                            >
                              ▲
                            </button>
                            <button
                              type="button"
                              onClick={() => handleAdjustGalleryCategoryOrder(idx, "down")}
                              disabled={idx === galleryCategories.length - 1}
                              className="w-6 h-6 flex items-center justify-center rounded-lg bg-white hover:bg-neutral-50 border border-[#f2ccd7] text-[#bf3e67] disabled:opacity-30 disabled:hover:bg-white text-[9px] transition-colors cursor-pointer"
                              title="아래로 이동"
                            >
                              ▼
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteGalleryCategory(cat)}
                              className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-red-50 text-red-500 hover:text-red-700 ml-1 font-bold text-sm leading-none transition-colors cursor-pointer"
                              title="카테고리 삭제"
                            >
                              &times;
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] text-neutral-450 leading-relaxed">
                      * 카테고리를 삭제하면, 해당 분류로 지정되었던 이미지들은 자동으로 '기타' 분류로 강제 이동 배정됩니다.
                    </p>
                  </div>
                </div>

                {/* Right: Images Grid List (8 cols) */}
                <div className="lg:col-span-8 space-y-6">
                  {/* Category Selection Tabs Bar */}
                  <div className="flex flex-wrap gap-1.5 p-1 bg-[#fff1f5] border border-[#f2ccd7] rounded-2xl">
                    <button
                      onClick={() => setSelectedGalleryCategory("전체")}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        selectedGalleryCategory === "전체"
                          ? "bg-[#f25f8a] text-white shadow-sm font-extrabold"
                          : "text-[#735965] hover:text-[#bf3e67]"
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
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                            selectedGalleryCategory === cat
                              ? "bg-[#f25f8a] text-white shadow-sm font-extrabold"
                              : "text-[#735965] hover:text-[#bf3e67]"
                          }`}
                        >
                          {cat} ({count})
                        </button>
                      );
                    })}
                  </div>

                  {/* Grid layout */}
                  {galleryItems.filter(item => selectedGalleryCategory === "전체" || item.category === selectedGalleryCategory).length === 0 ? (
                    <div className="bg-white border border-[#f2ccd7] border-dashed rounded-3xl p-16 text-center flex flex-col items-center justify-center">
                      <ImageIcon size={40} className="text-[#f2ccd7] mb-3 animate-pulse" />
                      <p className="text-sm font-bold text-neutral-450">해당 카테고리에 등록된 갤러리 이미지가 없습니다.</p>
                      <button
                        onClick={handleOpenAddGalleryModal}
                        className="mt-4 px-4 py-2.5 bg-[#f25f8a] hover:bg-[#df4977] text-white font-extrabold text-[11px] rounded-xl transition-all"
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
                            className={`bg-white border rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group cursor-move select-none ${
                              draggedId === item.id
                                ? "border-[#f25f8a] opacity-40 scale-95 border-dashed"
                                : "border-[#f2ccd7]"
                            }`}
                          >
                            {/* Image Container */}
                            <div className="relative aspect-video w-full overflow-hidden bg-neutral-100 border-b border-[#f2ccd7]/60">
                              <img
                                src={item.url}
                                alt={item.name}
                                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                              />
                              <span className="absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-black bg-[#bf3e67] text-white shadow-sm">
                                {item.category}
                              </span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleFeatured(item);
                                }}
                                className={`absolute top-3 right-3 px-2.5 py-1 rounded-xl text-[10px] font-black flex items-center gap-1 shadow-sm transition-all duration-200 cursor-pointer backdrop-blur-sm z-10 ${
                                  item.isFeatured
                                    ? "bg-amber-400 text-neutral-950 border border-amber-300 hover:bg-amber-500 hover:scale-105 animate-pulse-subtle"
                                    : "bg-black/50 text-white/90 border border-white/10 opacity-60 group-hover:opacity-100 hover:bg-[#f25f8a] hover:text-white hover:border-[#f2ccd7] hover:scale-105 hover:opacity-100"
                                }`}
                                title={item.isFeatured ? "대표 이미지 해제" : "대표 이미지 지정 (최대 9개)"}
                              >
                                {item.isFeatured ? "★ 대표 이미지" : "☆ 대표 지정"}
                              </button>
                            </div>

                            {/* Details body */}
                            <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                              <div className="space-y-1">
                                <h4 className="font-extrabold text-xs text-[#2d2026] line-clamp-2 leading-relaxed" title={item.name}>
                                  {item.name}
                                </h4>
                                <span className="text-[9px] text-[#735965]/70 font-semibold block">
                                  등록일: {item.regDate}
                                </span>
                              </div>

                              <div className="flex gap-1.5 pt-2 border-t border-neutral-100">
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditGalleryModal(item)}
                                  className="flex-1 py-2 border border-[#f2ccd7] bg-[#fff9fb] hover:bg-[#ffd3df]/40 text-[#735965] hover:text-[#bf3e67] text-[10px] font-bold rounded-xl transition-all"
                                >
                                  수정
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteGalleryItem(item.id, item.name)}
                                  className="px-2.5 py-2 border border-red-200 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl transition-all flex items-center justify-center"
                                  title="이미지 삭제"
                                >
                                  <Trash2 size={13} />
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
        </main>
      </div>

      {/* ==========================================
          MODALS & FORM POPUPS
         ========================================== */}

      {/* 0. Register/Edit Gallery Item Modal */}
      {showGalleryModal && (
        <div
          className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowGalleryModal(false)}
        >
          <div
            className="w-full max-w-lg bg-white border border-[#f2ccd7] rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-[#f2ccd7]/60 flex justify-between items-center bg-[#fff1f5]/50">
              <h3 className="text-base font-extrabold text-[#2d2026]">
                {selectedGalleryItem ? "갤러리 이미지 정보 수정" : "본사 공식 이미지 신규 등록"}
              </h3>
              <button
                type="button"
                onClick={() => setShowGalleryModal(false)}
                className="p-1.5 text-[#735965] hover:text-[#f25f8a] bg-white border border-[#f2ccd7] rounded-lg"
              >
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleGallerySubmit} className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm flex-1">
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#735965]">이미지명 *</label>
                <input
                  type="text"
                  placeholder="이미지를 구별할 이름을 입력해 주세요 (e.g. 로제미트파이 연출컷)"
                  value={galleryItemName}
                  onChange={(e) => setGalleryItemName(e.target.value)}
                  required
                  className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-4 py-3 text-xs text-[#2d2026] placeholder-[#735965]/40 focus:outline-none focus:border-[#f25f8a]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-[#735965]">카테고리 분류 *</label>
                <select
                  value={galleryItemCategory}
                  onChange={(e) => setGalleryItemCategory(e.target.value)}
                  required
                  className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-4 py-3 text-xs text-[#2d2026] focus:outline-none focus:border-[#f25f8a] font-bold"
                >
                  {galleryCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-[#735965] block">이미지 등록 방식 *</label>
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#fff1f5] border border-[#f2ccd7] rounded-xl">
                  <button
                    type="button"
                    onClick={() => setGalleryUploadMethod("url")}
                    className={`py-2 rounded-lg text-xs font-bold transition-all ${
                      galleryUploadMethod === "url"
                        ? "bg-[#f25f8a] text-white shadow-sm"
                        : "text-[#735965] hover:text-[#bf3e67]"
                    }`}
                  >
                    이미지 URL 입력
                  </button>
                  <button
                    type="button"
                    onClick={() => setGalleryUploadMethod("file")}
                    className={`py-2 rounded-lg text-xs font-bold transition-all ${
                      galleryUploadMethod === "file"
                        ? "bg-[#f25f8a] text-white shadow-sm"
                        : "text-[#735965] hover:text-[#bf3e67]"
                    }`}
                  >
                    로컬 이미지 업로드
                  </button>
                </div>
              </div>

              {galleryUploadMethod === "url" ? (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#735965]">이미지 웹 URL *</label>
                  <input
                    type="url"
                    placeholder="https://example.com/image.jpg 형태로 외부 웹 이미지 경로를 입력해 주세요"
                    value={galleryItemUrl}
                    onChange={(e) => setGalleryItemUrl(e.target.value)}
                    required={galleryUploadMethod === "url"}
                    className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-4 py-3 text-xs text-[#2d2026] placeholder-[#735965]/40 focus:outline-none focus:border-[#f25f8a]"
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#735965]">로컬 이미지 파일 업로드 *</label>
                  <div className="flex items-center gap-3 bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-4 py-2.5">
                    <input
                      id="gallery-file-input"
                      type="file"
                      accept="image/*"
                      onChange={handleGalleryImageUpload}
                      required={galleryUploadMethod === "file" && !galleryItemUrl}
                      className="text-xs text-[#735965] file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-[10px] file:font-black file:bg-[#ffd3df] file:text-[#bf3e67] file:hover:bg-[#ffd3df]/80 cursor-pointer flex-1"
                    />
                    {galleryItemUrl && (
                      <button
                        type="button"
                        onClick={() => setGalleryItemUrl("")}
                        className="px-2.5 py-1 rounded bg-red-50 hover:bg-red-100 text-red-500 text-[10px] font-bold border border-red-200 transition-colors"
                      >
                        지우기
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Real-time Image Preview Area */}
              {galleryItemUrl && (
                <div className="space-y-2 pt-2">
                  <span className="text-[10px] font-bold text-[#735965] block">이미지 미리보기</span>
                  <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-[#f2ccd7] bg-neutral-50 shadow-inner">
                    <img
                      src={galleryItemUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={() => {}}
                    />
                    <div className="absolute bottom-2 right-2 bg-emerald-500/90 text-white text-[9px] font-extrabold px-2 py-0.5 rounded shadow flex items-center gap-1">
                      <Check size={10} />
                      유효한 경로 확인
                    </div>
                  </div>
                </div>
              )}

              {!selectedGalleryItem && (
                <label className="flex items-center gap-2 text-xs font-bold text-[#735965] py-2 px-1 select-none cursor-pointer">
                  <input
                    type="checkbox"
                    checked={keepGalleryModalOpen}
                    onChange={(e) => setKeepGalleryModalOpen(e.target.checked)}
                    className="w-4 h-4 rounded border-[#f2ccd7] text-[#f25f8a] focus:ring-[#f25f8a] accent-[#f25f8a] cursor-pointer"
                  />
                  등록 완료 후 창을 닫지 않고 계속 추가 등록하기
                </label>
              )}

              <div className="flex gap-3 pt-4 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setShowGalleryModal(false)}
                  className="flex-1 py-3 border border-[#f2ccd7] hover:bg-[#fff1f5] text-[#735965] font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  취소 / 닫기
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#f25f8a] hover:bg-[#df4977] text-white font-extrabold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
                >
                  {selectedGalleryItem ? "수정 내용 적용" : "갤러리 등록 완료"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 1.5. Consultation Inquiry Detail Modal */}
      {selectedConsultation && (
        <div 
          className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedConsultation(null)}
        >
          <div 
            className="w-full max-w-xl bg-white border border-[#f2ccd7] rounded-3xl overflow-hidden shadow-lg max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-[#f2ccd7]/60 flex justify-between items-center bg-[#fff1f5]/50">
              <h3 className="text-base font-bold text-[#2d2026]">창업 상담문의 상세 내역</h3>
              <button onClick={() => setSelectedConsultation(null)} className="p-1.5 text-[#735965] hover:text-[#f25f8a] bg-white border border-[#f2ccd7] rounded-lg">
                <X size={15} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
              <div className="bg-[#fff1f5] border border-[#f2ccd7]/60 p-5 rounded-2xl space-y-3 font-semibold text-[#735965]">
                <div className="flex justify-between border-b border-[#f2ccd7]/40 pb-2">
                  <span>신청인</span>
                  <span className="text-[#2d2026] font-bold">{selectedConsultation.name}</span>
                </div>
                <div className="flex justify-between border-b border-[#f2ccd7]/40 pb-2">
                  <span>연락처</span>
                  <span className="text-[#2d2026] font-bold flex items-center gap-1.5">
                    {selectedConsultation.phone}
                    <button
                      type="button"
                      onClick={() => handleCopyToClipboard(selectedConsultation.phone, "연락처")}
                      className="p-1 hover:text-[#f25f8a] text-[#735965] bg-white border border-[#f2ccd7] rounded cursor-pointer transition-colors"
                      title="복사하기"
                    >
                      <Copy size={11} />
                    </button>
                  </span>
                </div>
                <div className="flex justify-between border-b border-[#f2ccd7]/40 pb-2">
                  <span>도입 희망 유형</span>
                  <span className="bg-[#ffd3df] text-[#bf3e67] font-bold px-2 py-0.5 rounded text-[10px] border border-[#f2ccd7]">
                    {selectedConsultation.storeType}
                  </span>
                </div>
                {selectedConsultation.existingStoreName && (
                  <div className="flex justify-between border-b border-[#f2ccd7]/40 pb-2">
                    <span>기존 매장명</span>
                    <span className="text-[#2d2026] font-bold">{selectedConsultation.existingStoreName}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>신청일</span>
                  <span className="text-[#2d2026] font-bold">{selectedConsultation.regDate}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-bold text-[#2d2026]">상세 문의 내용</label>
                <div className="bg-[#fff9fb] border border-[#f2ccd7] p-4 rounded-xl min-h-[120px] max-h-[240px] overflow-y-auto">
                  <p className="text-xs sm:text-sm text-[#2d2026] leading-relaxed whitespace-pre-wrap font-medium">
                    {selectedConsultation.message || "입력된 문의 내용이 없습니다."}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 bg-neutral-50 text-right border-t border-[#f2ccd7]/60">
              <button 
                onClick={() => setSelectedConsultation(null)}
                className="px-6 py-2.5 rounded-xl bg-white border border-[#f2ccd7] hover:bg-[#fff9fb] text-xs font-bold text-[#735965] transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 1. Inquiry Reply Writer Modal */}
      {selectedInquiry && (
        <div 
          className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedInquiry(null)}
        >
          <div 
            className="w-full max-w-xl bg-white border border-[#f2ccd7] rounded-3xl overflow-hidden shadow-lg max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-[#f2ccd7]/60 flex justify-between items-center bg-[#fff1f5]/50">
              <h3 className="text-base font-bold text-[#2d2026]">가맹점 1:1 문의 답변 작성</h3>
              <button onClick={() => setSelectedInquiry(null)} className="p-1.5 text-[#735965] hover:text-[#f25f8a] bg-white border border-[#f2ccd7] rounded-lg">
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleSubmitAnswer} className="p-6 overflow-y-auto space-y-5 flex-1 text-xs sm:text-sm">
              <div className="bg-[#fff1f5] border border-[#f2ccd7]/60 p-4 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-[10px] text-[#735965] font-bold">
                  <span>유형: {selectedInquiry.category}</span>
                  <span>접수일자: {selectedInquiry.date}</span>
                </div>
                <h4 className="font-bold text-xs text-[#2d2026] leading-tight">{selectedInquiry.title}</h4>
                <p className="text-xs text-[#735965] leading-relaxed whitespace-pre-wrap mt-2">{selectedInquiry.content}</p>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-bold text-[#2d2026]">본사 공식 답변 내용 기입</label>
                <textarea 
                  rows={6}
                  placeholder="가맹점주님이 현장에서 직면한 상황에 대해 구체적인 조치 결과(AS 일정 예약, 오배송 무료 재출고 완료 등)를 친절하고 명확하게 입력해 주시기 바랍니다."
                  value={inquiryAnswerText}
                  onChange={(e) => setInquiryAnswerText(e.target.value)}
                  required
                  className="w-full bg-[#fff1f5] border border-[#f2ccd7] rounded-xl px-4 py-3 text-sm text-[#2d2026] placeholder-[#735965]/50 focus:outline-none focus:border-[#f25f8a] resize-none"
                />
              </div>

              <button 
                type="submit"
                className="w-full py-4 bg-[#f25f8a] hover:bg-[#df4977] text-white font-bold text-sm rounded-xl transition-all shadow-sm mt-2"
              >
                가맹 지원 답변 공식 등록하기
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. Notice Creation Modal */}
      {showNoticeModal && (
        <div 
          className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={handleCloseNoticeModal}
        >
          <div 
            className="w-full max-w-xl bg-white border border-[#f2ccd7] rounded-3xl overflow-hidden shadow-lg max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-[#f2ccd7]/60 flex justify-between items-center bg-[#fff1f5]/50">
              <h3 className="text-base font-bold text-[#2d2026]">
                {selectedNotice ? "가맹 공지사항 상세조회 및 수정" : "신규 가맹 공지사항 정식 작성"}
              </h3>
              <button onClick={handleCloseNoticeModal} className="p-1.5 text-[#735965] hover:text-[#f25f8a] bg-white border border-[#f2ccd7] rounded-lg">
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleCreateNotice} className="p-6 overflow-y-auto space-y-5 flex-1 text-xs sm:text-sm">
              <div className="flex flex-col gap-2">
                <label className="font-bold text-[#2d2026]">공지 태그 선택</label>
                <select 
                  value={newNoticeTag}
                  onChange={(e) => setNewNoticeTag(e.target.value as any)}
                  className="w-full bg-[#fff1f5] border border-[#f2ccd7] rounded-xl px-4 py-3 text-sm text-[#2d2026] focus:outline-none focus:border-[#f25f8a] cursor-pointer"
                >
                  <option value="필독">필독 (긴급 법정 안전 위생 점검 등)</option>
                  <option value="일반">일반 안내 사항</option>
                  <option value="이벤트">마케팅 / 런칭 이벤트 공지</option>
                  <option value="물류">물류 배송 / 공휴일 정기 일정 조정</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-bold text-[#2d2026]">공지 제목</label>
                <input 
                  type="text"
                  placeholder="예시) 하절기 위생 합동 검열 대비 본부 가이드라인 수칙"
                  value={newNoticeTitle}
                  onChange={(e) => setNewNoticeTitle(e.target.value)}
                  required
                  className="w-full bg-[#fff1f5] border border-[#f2ccd7] rounded-xl px-4 py-3 text-sm text-[#2d2026] placeholder-[#735965]/50 focus:outline-none focus:border-[#f25f8a]"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-bold text-[#2d2026]">상세 공지 본문 내용</label>
                <textarea 
                  rows={6}
                  placeholder="가맹점 전체에 전달할 상세 수칙 및 안내 내용을 명확히 적어주세요. 점주전용 포털 공지사항실에 실시간 동기화되어 배포됩니다."
                  value={newNoticeContent}
                  onChange={(e) => setNewNoticeContent(e.target.value)}
                  required
                  className="w-full bg-[#fff1f5] border border-[#f2ccd7] rounded-xl px-4 py-3 text-sm text-[#2d2026] placeholder-[#735965]/50 focus:outline-none focus:border-[#f25f8a] resize-none"
                />
              </div>

              <button 
                type="submit"
                className="w-full py-4 bg-[#f25f8a] hover:bg-[#df4977] text-white font-bold text-sm rounded-xl transition-all shadow-sm mt-2"
              >
                {selectedNotice ? "공지사항 수정 및 저장하기 💾" : "공지사항 공식 배포하기 📢"}
              </button>
            </form>

            {selectedNotice && selectedNotice.title.includes("배달앱 메뉴 리뉴얼") && (
              <div className="p-6 border-t border-[#f2ccd7]/60 bg-[#fff1f5]/30 space-y-3 shrink-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-[#2d2026]">가맹점별 배달앱 계정 제출 현황</h4>
                  <span className="text-xs font-bold text-[#bf3e67] bg-[#ffd3df] border border-[#f2ccd7] px-2.5 py-0.5 rounded-full">
                    총 {submittedCredentials?.length || 0}건 접수
                  </span>
                </div>
                
                <div className="border border-[#f2ccd7] rounded-2xl overflow-hidden bg-white max-h-[220px] overflow-y-auto shadow-sm">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#fff1f5] border-b border-[#f2ccd7] text-[10px] font-bold text-[#735965] uppercase tracking-wider">
                        <th className="p-3">가맹점명</th>
                        <th className="p-3">배달의민족 계정</th>
                        <th className="p-3">쿠팡이츠 계정</th>
                        <th className="p-3">제출 일시</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f2ccd7]/60">
                      {!submittedCredentials || submittedCredentials.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="p-5 text-center text-[#735965] font-bold">아직 제출된 가맹점 계정 정보가 없습니다.</td>
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

      {/* 3. Store Registration / Detailed Modal */}
      {showStoreModal && (
        <div 
          className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setShowStoreModal(false)}
        >
          <div 
            className="w-full max-w-2xl bg-white border border-[#f2ccd7] rounded-3xl overflow-hidden shadow-lg max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-[#f2ccd7]/60 flex justify-between items-center bg-[#fff1f5]/50">
              <h3 className="text-base font-bold text-[#2d2026]">
                {selectedStore ? `가맹점 상세 정보 및 편집 [${selectedStore.name}]` : "가맹점 신규 등록 대장 작성"}
              </h3>
              <button onClick={() => setShowStoreModal(false)} className="p-1.5 text-[#735965] hover:text-[#f25f8a] bg-white border border-[#f2ccd7] rounded-lg">
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleCreateOrUpdateStore} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs sm:text-sm">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-[#2d2026]">로그인 계정 ID *</label>
                  <input 
                    type="text"
                    placeholder="계정 아이디를 입력해 주세요 (영문/숫자)"
                    value={storeLoginId}
                    onChange={(e) => setStoreLoginId(e.target.value)}
                    required
                    disabled={!!selectedStore}
                    className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-4 py-3 text-xs text-[#2d2026] placeholder-[#735965]/40 focus:outline-none focus:border-[#f25f8a] disabled:bg-neutral-100 disabled:opacity-60"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-[#2d2026]">가맹점명 *</label>
                  <input 
                    type="text"
                    placeholder="예시) 120겹파이 강남역삼점"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    required
                    className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-4 py-3 text-xs text-[#2d2026] focus:outline-none focus:border-[#f25f8a]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5 relative">
                  <label className="font-bold text-[#2d2026]">비밀번호 *</label>
                  <input 
                    type="text"
                    placeholder="비밀번호 설정"
                    value={storePw}
                    onChange={(e) => setStorePw(e.target.value)}
                    required
                    className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-4 py-3 text-xs text-[#2d2026] focus:outline-none focus:border-[#f25f8a]"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-[#2d2026]">비밀번호 확인 *</label>
                  <input 
                    type="text"
                    placeholder="동일 비밀번호 재입력"
                    value={storePwConfirm}
                    onChange={(e) => setStorePwConfirm(e.target.value)}
                    required
                    className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-4 py-3 text-xs text-[#2d2026] focus:outline-none focus:border-[#f25f8a]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-[#2d2026]">점주 실명 *</label>
                  <input 
                    type="text"
                    placeholder="점주 대표자 성함"
                    value={storeOwner}
                    onChange={(e) => setStoreOwner(e.target.value)}
                    required
                    className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-4 py-3 text-xs text-[#2d2026] focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-[#2d2026]">연락처 (하이픈 자동입력) *</label>
                  <input 
                    type="text"
                    placeholder="휴대폰 혹은 대표번호"
                    value={storePhone}
                    onChange={handlePhoneInputChange}
                    required
                    className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-4 py-3 text-xs text-[#2d2026] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-[#2d2026]">가맹 거래 상태 구분 *</label>
                  <select 
                    value={storeStatus}
                    onChange={(e) => setStoreStatus(e.target.value as any)}
                    className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-4 py-3 text-xs text-[#2d2026] focus:outline-none"
                  >
                    <option value="승인">승인 (정상 오퍼레이션 가동)</option>
                    <option value="대기">대기 (서류 검토 / 가맹 보류)</option>
                    <option value="보류">보류 (일시적 거래 홀딩)</option>
                    <option value="중지">중지 (본부 차단 / 경고 누적)</option>
                    <option value="취소">취소 (정식 폐점 계약 해지)</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-[#2d2026]">가맹 등록일</label>
                    <input 
                      type="date"
                      value={storeRegDate}
                      onChange={(e) => setStoreRegDate(e.target.value)}
                      className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-3 py-3 text-xs text-[#2d2026]"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-[#2d2026]">가맹 해지일</label>
                    <input 
                      type="date"
                      value={storeCancelDate}
                      onChange={(e) => setStoreCancelDate(e.target.value)}
                      className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-3 py-3 text-xs text-[#2d2026]"
                    />
                  </div>
                </div>
              </div>

              {/* Road address and detailed address */}
              <div className="space-y-2">
                <label className="font-bold text-[#2d2026] block">가맹 매장 도로명 주소 *</label>
                <div className="flex gap-2">
                  <input 
                    type="text"
                    placeholder="도로명 주소 (우측 '주소 검색' 버튼을 사용하거나 직접 입력하세요)"
                    value={storeRoadAddress}
                    onChange={(e) => setStoreRoadAddress(e.target.value)}
                    required
                    className="flex-1 bg-white border border-[#f2ccd7] rounded-xl px-4 py-3 text-xs text-[#2d2026] focus:outline-none focus:border-[#f25f8a]"
                  />
                  <button
                    type="button"
                    onClick={() => openDaumPostcode("store")}
                    className="px-4 py-3 bg-[#bf3e67] hover:bg-[#a63053] text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                  >
                    주소 검색
                  </button>
                </div>
                <input 
                  type="text"
                  placeholder="매장 상세 주소 (e.g. 1층 101호, 2층 전부)"
                  value={storeDetailAddress}
                  onChange={(e) => setStoreDetailAddress(e.target.value)}
                  className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-4 py-3 text-xs text-[#2d2026] focus:outline-none"
                />
              </div>

              {/* Adoption Package Checklist */}
              <div className="space-y-2">
                <label className="font-bold text-[#2d2026] block">도입 적용 패키지 브랜드 선택 (중복 체크 가능)</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-[#fff1f5]/50 border border-[#f2ccd7] p-4 rounded-xl">
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
                          className="w-4 h-4 rounded text-[#f25f8a] border-[#f2ccd7] focus:ring-[#f25f8a]"
                        />
                        <span className="text-xs font-bold text-[#2d2026]">{menuKey}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-4 bg-[#f25f8a] hover:bg-[#df4977] text-white font-bold text-sm rounded-xl transition-all shadow-sm mt-3"
                style={{ color: '#ffffff' }}
              >
                {selectedStore ? "가맹점 상세 정보 수정 저장" : "신규 가맹 계약 지점 공식 등록"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 4. Address Popup Simulator Modal with Real Kakao API Embed */}
      {showAddressPopup && (
        <div 
          className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setShowAddressPopup(false)}
        >
          <div 
            className="w-full max-w-lg bg-white border border-[#f2ccd7] rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[600px] max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-[#f2ccd7]/60 flex flex-col gap-3 bg-[#fff1f5]/80">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-bold text-[#2d2026]">도로명 주소 실시간 검색</h4>
                <button onClick={() => setShowAddressPopup(false)} className="p-1.5 text-[#735965] hover:text-[#f25f8a] bg-white border border-[#f2ccd7] rounded-lg cursor-pointer">
                  <X size={13} />
                </button>
              </div>
              
              {/* Dual-Mode Tabs */}
              <div className="flex bg-[#ffd3df]/50 p-1 rounded-xl border border-[#f2ccd7]/60">
                <button
                  type="button"
                  onClick={() => setAddressTab("kakao")}
                  className={`flex-1 py-1.5 text-[11px] font-extrabold rounded-lg transition-all ${
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
                  className={`flex-1 py-1.5 text-[11px] font-extrabold rounded-lg transition-all ${
                    addressTab === "simulated" 
                      ? "bg-white text-[#bf3e67] shadow-sm border border-[#f2ccd7]/40" 
                      : "text-[#735965] hover:text-[#bf3e67]"
                  }`}
                >
                  모의 간편 검색 (대안)
                </button>
              </div>
            </div>

            {/* Content Body based on active tab */}
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
                    onChange={(e) => handleAddressSearch(e.target.value)}
                    className="w-full bg-white border border-[#f2ccd7] rounded-xl px-3 py-2.5 text-xs text-[#2d2026] focus:outline-none focus:border-[#f25f8a] placeholder-[#735965]/40 font-semibold"
                  />
                </div>
                
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-[#735965] block">검색 결과 목록 ({addressSearchResults.length}건)</span>
                  {addressSearchResults.length === 0 ? (
                    <div className="p-8 text-center text-[11px] text-[#735965] bg-white border border-[#f2ccd7]/40 rounded-xl font-bold">
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
                          className="w-full text-left p-3.5 bg-white hover:bg-[#fff1f5] border border-[#f2ccd7]/50 hover:border-[#f25f8a]/50 rounded-xl text-xs font-semibold text-[#2d2026] transition-all cursor-pointer block hover:shadow-sm"
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
                className="px-5 py-2.5 rounded-xl bg-white border border-[#f2ccd7] text-[11px] font-bold text-[#735965] hover:bg-[#fff1f5] cursor-pointer transition-colors"
              >
                검색 창 닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Product Registration / Edit Modal */}
      {showProductModal && (
        <div 
          className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setShowProductModal(false)}
        >
          <div 
            className="w-full max-w-2xl bg-white border border-[#f2ccd7] rounded-3xl overflow-hidden shadow-lg max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-[#f2ccd7]/60 flex justify-between items-center bg-[#fff1f5]/50">
              <h3 className="text-base font-bold text-[#2d2026]">
                {selectedProduct ? `원/부자재 품목 명세 수정 [${selectedProduct.name}]` : "신규 식재료/부자재 물류 품목 추가"}
              </h3>
              <button onClick={() => setShowProductModal(false)} className="p-1.5 text-[#735965] hover:text-[#f25f8a] bg-white border border-[#f2ccd7] rounded-lg">
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleCreateOrUpdateProduct} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs sm:text-sm">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-[#2d2026]">카테고리 분류 선택 *</label>
                  <select 
                    value={productCategory}
                    onChange={(e) => setProductCategory(e.target.value)}
                    required
                    className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-4 py-3 text-xs text-[#2d2026] focus:outline-none"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-[#2d2026]">품목 제품명 *</label>
                  <input 
                    type="text"
                    placeholder="예시) 로제미트파이 생지"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    required
                    className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-4 py-3 text-xs text-[#2d2026] focus:outline-none focus:border-[#f25f8a]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-[#2d2026]">모델 고유 코드/모델명 *</label>
                  <input 
                    type="text"
                    placeholder="예시) RP-DOUGH-01"
                    value={productModelName}
                    onChange={(e) => setProductModelName(e.target.value)}
                    required
                    className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-4 py-3 text-xs text-[#2d2026] focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-[#2d2026]">포장 단위 *</label>
                    <select 
                      value={productUnit}
                      onChange={(e) => setProductUnit(e.target.value as any)}
                      required
                      className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-3 py-3 text-xs text-[#2d2026] focus:outline-none"
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
                    <label className="font-bold text-[#2d2026]">단위 수량/중량 *</label>
                    <input 
                      type="number"
                      min={1}
                      value={productQty}
                      onChange={(e) => setProductQty(parseInt(e.target.value, 10) || 1)}
                      required
                      className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-3 py-3 text-xs text-[#2d2026] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-[#2d2026]">공급가 (원) *</label>
                  <input 
                    type="text"
                    value={productSupplyPrice}
                    onChange={(e) => handlePriceInput(e.target.value, setProductSupplyPrice)}
                    required
                    className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-4 py-3 text-xs text-[#2d2026] text-right font-bold focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-[#2d2026]">판매가 (원) *</label>
                  <input 
                    type="text"
                    value={productPrice}
                    onChange={(e) => handlePriceInput(e.target.value, setProductPrice)}
                    required
                    className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-4 py-3 text-xs text-[#2d2026] text-right font-bold focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-[#2d2026]">특별 할인액 (원)</label>
                  <input 
                    type="text"
                    value={productDiscountAmount}
                    onChange={(e) => handlePriceInput(e.target.value, setProductDiscountAmount)}
                    className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-4 py-3 text-xs text-[#2d2026] text-right font-bold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-[#735965]">실시간 자동 계산 할인 적용 공급가 (리드온리)</label>
                  <input 
                    type="text"
                    value={`${getCalculatedDiscountedPrice().toLocaleString()} 원`}
                    readOnly
                    className="w-full bg-neutral-100 border border-[#f2ccd7] rounded-xl px-4 py-3 text-xs text-[#bf3e67] font-black text-right"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-[#2d2026]">제품 상태 *</label>
                  <select
                    value={productStatus}
                    onChange={(e) => setProductStatus(e.target.value as "판매중" | "품절" | "단종")}
                    className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-4 py-3 text-xs text-[#2d2026] font-bold focus:outline-none cursor-pointer"
                  >
                    <option value="판매중">판매중</option>
                    <option value="품절">품절 (가맹점 주문불가)</option>
                    <option value="단종">단종 (가맹점 노출안됨)</option>
                  </select>
                </div>
              </div>

              {/* Image url links with file upload option */}
              <div className="space-y-4">
                <div className="flex flex-col gap-1.5 bg-[#fff9fb] border border-[#f2ccd7] p-4 rounded-xl space-y-2">
                  <label className="font-bold text-[#2d2026]">썸네일 대표 이미지 *</label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input 
                      type="text"
                      placeholder="https://res.cloudinary.com/... 이미지 웹 경로"
                      value={productImg}
                      onChange={(e) => setProductImg(e.target.value)}
                      required
                      className="flex-1 bg-white border border-[#f2ccd7]/60 rounded-xl px-4 py-2.5 text-xs text-[#2d2026] focus:outline-none"
                    />
                    <div className="flex items-center bg-white border border-[#f2ccd7]/60 rounded-xl px-3 py-2 shrink-0">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProductImgUpload}
                        className="text-xs text-[#735965] file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-[10px] file:font-black file:bg-[#ffd3df] file:text-[#bf3e67] file:hover:bg-[#ffd3df]/80 cursor-pointer w-full max-w-[180px]"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 bg-[#fff9fb] border border-[#f2ccd7] p-4 rounded-xl space-y-2">
                  <label className="font-bold text-[#2d2026]">상세 상세페이지 이미지 (옵션)</label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input 
                      type="text"
                      placeholder="https://res.cloudinary.com/... 이미지 상세 웹 경로"
                      value={productDetailImg}
                      onChange={(e) => setProductDetailImg(e.target.value)}
                      className="flex-1 bg-white border border-[#f2ccd7]/60 rounded-xl px-4 py-2.5 text-xs text-[#2d2026] focus:outline-none"
                    />
                    <div className="flex items-center bg-white border border-[#f2ccd7]/60 rounded-xl px-3 py-2 shrink-0">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProductDetailImgUpload}
                        className="text-xs text-[#735965] file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-[10px] file:font-black file:bg-[#ffd3df] file:text-[#bf3e67] file:hover:bg-[#ffd3df]/80 cursor-pointer w-full max-w-[180px]"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Rich Text Editor for Detailed Page Content */}
                <div className="flex flex-col gap-1.5 bg-[#fff9fb] border border-[#f2ccd7] p-4 rounded-xl space-y-2">
                  <label className="font-bold text-[#2d2026]">상세페이지 텍스트 편집 (크기, 색상, 정렬 등)</label>
                  <style>{`
                    #product-detail-rich-editor:empty:before {
                      content: attr(data-placeholder);
                      color: #735965;
                      opacity: 0.4;
                      font-style: italic;
                      display: block;
                    }
                    .rich-content-view font[size="1"] { font-size: 10px !important; }
                    .rich-content-view font[size="2"] { font-size: 12px !important; }
                    .rich-content-view font[size="3"] { font-size: 14px !important; }
                    .rich-content-view font[size="4"] { font-size: 16px !important; }
                    .rich-content-view font[size="5"] { font-size: 18px !important; }
                    .rich-content-view font[size="6"] { font-size: 24px !important; }
                  `}</style>
                  <div className="border border-[#f2ccd7] rounded-xl overflow-hidden bg-white shadow-sm">
                    {/* Editor Toolbar */}
                    <div className="bg-[#fff1f5] border-b border-[#f2ccd7] p-2 flex flex-wrap items-center gap-1.5 text-[10px] sm:text-xs">
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => executeEditorCommand("bold")}
                        className="px-2.5 py-1 rounded bg-white border border-[#f2ccd7] font-bold hover:bg-[#ffd3df] transition-colors cursor-pointer"
                        title="굵게"
                      >
                        가
                      </button>
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => executeEditorCommand("italic")}
                        className="px-2.5 py-1 rounded bg-white border border-[#f2ccd7] italic hover:bg-[#ffd3df] transition-colors cursor-pointer"
                        title="기울임"
                      >
                        가
                      </button>
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => executeEditorCommand("underline")}
                        className="px-2.5 py-1 rounded bg-white border border-[#f2ccd7] underline hover:bg-[#ffd3df] transition-colors cursor-pointer"
                        title="밑줄"
                      >
                        가
                      </button>
                      
                      <div className="h-4 w-px bg-[#f2ccd7] mx-1"></div>

                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => executeEditorCommand("justifyLeft")}
                        className="px-2 py-1 rounded bg-white border border-[#f2ccd7] hover:bg-[#ffd3df] cursor-pointer"
                        title="왼쪽 정렬"
                      >
                        왼쪽
                      </button>
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => executeEditorCommand("justifyCenter")}
                        className="px-2 py-1 rounded bg-white border border-[#f2ccd7] hover:bg-[#ffd3df] cursor-pointer"
                        title="가운데 정렬"
                      >
                        가운데
                      </button>
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => executeEditorCommand("justifyRight")}
                        className="px-2 py-1 rounded bg-white border border-[#f2ccd7] hover:bg-[#ffd3df] cursor-pointer"
                        title="오른쪽 정렬"
                      >
                        오른쪽
                      </button>

                      <div className="h-4 w-px bg-[#f2ccd7] mx-1"></div>

                      <select
                        onChange={(e) => {
                          if (!e.target.value) return;
                          executeEditorCommand("fontSize", e.target.value);
                          e.target.value = ""; // Reset to placeholder
                        }}
                        className="bg-white border border-[#f2ccd7] rounded px-1 py-1 text-[10px] sm:text-xs focus:outline-none cursor-pointer"
                        title="글자 크기"
                        defaultValue=""
                      >
                        <option value="">글자 크기</option>
                        <option value="1">매우 작게</option>
                        <option value="2">작게</option>
                        <option value="3">보통</option>
                        <option value="4">크게</option>
                        <option value="5">매우 크게</option>
                        <option value="6">최대 크게</option>
                      </select>

                      <select
                        onChange={(e) => {
                          if (!e.target.value) return;
                          executeEditorCommand("foreColor", e.target.value);
                          e.target.value = ""; // Reset to placeholder
                        }}
                        className="bg-white border border-[#f2ccd7] rounded px-1 py-1 text-[10px] sm:text-xs focus:outline-none font-bold cursor-pointer"
                        title="글자 색상"
                        defaultValue=""
                      >
                        <option value="">글자 색상</option>
                        <option value="#2d2026" style={{ color: "#2d2026" }}>기본색상</option>
                        <option value="#f25f8a" style={{ color: "#f25f8a" }}>핑크</option>
                        <option value="#bf3e67" style={{ color: "#bf3e67" }}>로즈</option>
                        <option value="#3b82f6" style={{ color: "#3b82f6" }}>블루</option>
                        <option value="#10b981" style={{ color: "#10b981" }}>그린</option>
                        <option value="#f59e0b" style={{ color: "#f59e0b" }}>골드/옐로우</option>
                        <option value="#ef4444" style={{ color: "#ef4444" }}>레드</option>
                      </select>

                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => executeEditorCommand("insertUnorderedList")}
                        className="px-2 py-1 rounded bg-white border border-[#f2ccd7] hover:bg-[#ffd3df] cursor-pointer"
                        title="글머리 기호"
                      >
                        • 리스트
                      </button>

                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          if (confirm("상세페이지 텍스트 내용을 초기화하시겠습니까?")) {
                            setProductDetailText("");
                            const editorDiv = document.getElementById("product-detail-rich-editor");
                            if (editorDiv) editorDiv.innerHTML = "";
                          }
                        }}
                        className="px-2 py-1 rounded bg-white border border-red-200 text-red-500 hover:bg-red-50 ml-auto font-bold cursor-pointer"
                        title="초기화"
                      >
                        비우기
                      </button>
                    </div>

                    {/* ContentEditable Editor Area */}
                    <div
                      id="product-detail-rich-editor"
                      contentEditable
                      suppressContentEditableWarning
                      onInput={(e: React.FormEvent<HTMLDivElement>) => {
                        setProductDetailText(e.currentTarget.innerHTML);
                        saveSelection();
                      }}
                      onBlur={(e: React.FocusEvent<HTMLDivElement>) => {
                        setProductDetailText(e.currentTarget.innerHTML);
                      }}
                      onMouseUp={saveSelection}
                      onKeyUp={saveSelection}
                      onSelect={saveSelection}
                      onFocus={() => {
                        document.execCommand("defaultParagraphSeparator", false, "div");
                      }}
                      className="p-4 min-h-[140px] max-h-[260px] overflow-y-auto focus:outline-none bg-white text-xs sm:text-sm text-[#2d2026] leading-relaxed rich-content-view"
                      data-placeholder="이곳에 제품 상세 안내 텍스트를 자유롭게 입력하고 편집하세요..."
                      style={{ minHeight: "140px" }}
                    />
                  </div>
                </div>
              </div>

              {/* Product Label Selection */}
              <div className="space-y-2 bg-[#fff9fb] border border-[#f2ccd7] p-4 rounded-xl">
                <label className="font-bold text-[#2d2026] block">자재 적용 라벨 선택 (중복 체크 가능)</label>
                {labels.length === 0 ? (
                  <p className="text-[10px] text-[#735965] opacity-50">등록된 라벨이 없습니다. 라벨 관리에서 먼저 추가해 주세요.</p>
                ) : (
                  <div className="flex flex-wrap gap-4 pt-1">
                    {labels.map((labelName) => {
                      const isChecked = productLabels.includes(labelName);
                      return (
                        <label key={labelName} className="flex items-center gap-2 cursor-pointer select-none text-xs font-bold text-[#2d2026]">
                          <input 
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setProductLabels([...productLabels, labelName]);
                              } else {
                                setProductLabels(productLabels.filter((l) => l !== labelName));
                              }
                            }}
                            className="w-4 h-4 rounded text-[#f25f8a] border-[#f2ccd7] focus:ring-[#f25f8a] accent-[#f25f8a] cursor-pointer"
                          />
                          <span>{labelName}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Product Options Management */}
              <div className="space-y-2 bg-[#fff9fb] border border-[#f2ccd7] p-4 rounded-xl">
                <label className="font-bold text-[#2d2026] block">제품 옵션 설정 (홍보물 등 옵션 선택이 필요한 품목)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="예시) A4 사이즈, A3 사이즈, 블랙, 화이트 등"
                    value={newProductOption}
                    onChange={(e) => setNewProductOption(e.target.value)}
                    className="flex-1 bg-white border border-[#f2ccd7]/60 rounded-xl px-4 py-2.5 text-xs text-[#2d2026] focus:outline-none"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (newProductOption.trim()) {
                          if (productOptions.includes(newProductOption.trim())) {
                            alert("이미 추가된 옵션입니다.");
                            return;
                          }
                          setProductOptions([...productOptions, newProductOption.trim()]);
                          setNewProductOption("");
                        }
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newProductOption.trim()) {
                        if (productOptions.includes(newProductOption.trim())) {
                          alert("이미 추가된 옵션입니다.");
                          return;
                        }
                        setProductOptions([...productOptions, newProductOption.trim()]);
                        setNewProductOption("");
                      }
                    }}
                    className="px-4 py-2.5 bg-[#ffd3df] hover:bg-[#ffd3df]/80 text-[#bf3e67] font-bold text-xs rounded-xl transition-all"
                  >
                    추가
                  </button>
                </div>
                
                {productOptions.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {productOptions.map((opt, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#fff1f5] border border-[#f2ccd7] text-[10px] sm:text-xs font-bold text-[#bf3e67]"
                      >
                        {opt}
                        <button
                          type="button"
                          onClick={() => setProductOptions(productOptions.filter((_, i) => i !== idx))}
                          className="hover:text-red-500 font-bold focus:outline-none ml-1 text-[10px] w-3 h-3 flex items-center justify-center rounded-full bg-[#ffd3df]/50"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-[10px] text-[#735965]/60 mt-1">
                    * 등록된 옵션이 없습니다. 옵션이 필요 없는 제품은 비워두세요.
                  </p>
                )}
              </div>

              {/* Shipping Type Selection */}
              <div className="space-y-2 bg-[#fff9fb] border border-[#f2ccd7] p-4 rounded-xl">
                <label className="font-bold text-[#2d2026] block">배송비 정책 구분 *</label>
                <div className="relative">
                  <select
                    value={productShippingType}
                    onChange={(e) => setProductShippingType(e.target.value as any)}
                    required
                    className="w-full bg-white border border-[#f2ccd7]/60 rounded-xl px-4 py-2.5 text-xs text-[#2d2026] focus:outline-none focus:border-[#f25f8a] appearance-none cursor-pointer font-medium"
                  >
                    <option value="free">무료 배송 (0원)</option>
                    <option value="A">A타입 배송비 ({shippingFeeA}원)</option>
                    <option value="B">B타입 배송비 ({shippingFeeB}원)</option>
                    <option value="C">C타입 배송비 ({shippingFeeC}원)</option>
                    <option value="BOX">BOX타입 배송비 (10개당 {shippingFeeBox}원)</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#735965]">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
                <p className="text-[10px] text-[#735965]/80 mt-1">
                  * 일반 품목(A/B/C)은 장바구니 중 가장 높은 배송비 1회만 청구되며, BOX 품목은 10개당 설정된 요금이 합산 부과됩니다.
                </p>
              </div>

              <button 
                type="submit"
                className="w-full py-4 bg-[#f25f8a] hover:bg-[#df4977] text-white font-bold text-sm rounded-xl transition-all shadow-sm mt-3"
              >
                {selectedProduct ? "수정 명세서 공식 저장" : "새로운 물류 유통 품목 공식 등록"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 6. Material Creation Modal */}
      {showMaterialModal && (
        <div 
          className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setShowMaterialModal(false)}
        >
          <div 
            className="w-full max-w-xl bg-white border border-[#f2ccd7] rounded-3xl overflow-hidden shadow-lg max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-[#f2ccd7]/60 flex justify-between items-center bg-[#fff1f5]/50">
              <h3 className="text-base font-bold text-[#2d2026]">신규 가맹 지원 자료 등록</h3>
              <button onClick={() => setShowMaterialModal(false)} className="p-1.5 text-[#735965] hover:text-[#f25f8a] bg-white border border-[#f2ccd7] rounded-lg">
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleCreateMaterial} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs sm:text-sm">
              <div className="flex flex-col gap-2">
                <label className="font-bold text-[#2d2026]">자료 유형 구분</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setMaterialType("training")}
                    className={`py-3 rounded-xl border text-xs font-bold transition-all ${
                      materialType === "training"
                        ? "bg-[#f25f8a] text-white border-transparent"
                        : "bg-white text-[#735965] border-[#f2ccd7] hover:bg-[#fff1f5]"
                    }`}
                  >
                    📖 교육자료실 등록
                  </button>
                  <button
                    type="button"
                    onClick={() => setMaterialType("pr")}
                    className={`py-3 rounded-xl border text-xs font-bold transition-all ${
                      materialType === "pr"
                        ? "bg-[#f25f8a] text-white border-transparent"
                        : "bg-white text-[#735965] border-[#f2ccd7] hover:bg-[#fff1f5]"
                    }`}
                  >
                    🖼 홍보자료실 등록
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-bold text-[#2d2026]">자료(파일명) 제목</label>
                <input 
                  type="text"
                  placeholder="예시) 하절기 위생 종합 자가점검 진단서 엑셀 양식"
                  value={newMaterialTitle}
                  onChange={(e) => setNewMaterialTitle(e.target.value)}
                  required
                  className="w-full bg-[#fff1f5] border border-[#f2ccd7] rounded-xl px-4 py-3 text-sm text-[#2d2026] placeholder-[#735965]/50 focus:outline-none focus:border-[#f25f8a]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="font-bold text-[#2d2026]">파일 포맷 확장자</label>
                  <input 
                    type="text"
                    placeholder="PDF, MP4, AI 등"
                    value={newMaterialFormat}
                    onChange={(e) => setNewMaterialFormat(e.target.value)}
                    required
                    className="w-full bg-[#fff1f5] border border-[#f2ccd7] rounded-xl px-4 py-3 text-sm text-[#2d2026] focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-bold text-[#2d2026]">권장 크기 용량</label>
                  <input 
                    type="text"
                    placeholder="예시) 4.5 MB"
                    value={newMaterialSize}
                    onChange={(e) => setNewMaterialSize(e.target.value)}
                    required
                    className="w-full bg-[#fff1f5] border border-[#f2ccd7] rounded-xl px-4 py-3 text-sm text-[#2d2026] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-bold text-[#2d2026]">자료 대표 이미지 주소 (옵션)</label>
                <input 
                  type="text"
                  placeholder="https://res.cloudinary.com/... 이미지 경로"
                  value={newMaterialImg}
                  onChange={(e) => setNewMaterialImg(e.target.value)}
                  className="w-full bg-[#fff1f5] border border-[#f2ccd7] rounded-xl px-4 py-3 text-sm text-[#2d2026] focus:outline-none"
                />
              </div>

              {/* 실제 가맹지원 파일 직접 업로드 필드 (추가) */}
              <div className="flex flex-col gap-2">
                <label className="font-bold text-[#2d2026] flex items-center gap-1">
                  📂 실제 자료 파일 직접 업로드
                  <span className="text-[10px] text-[#f25f8a] font-extrabold">(필수)</span>
                </label>
                <div className="flex items-center gap-3 bg-[#fff1f5] border border-[#f2ccd7] rounded-xl px-4 py-2.5">
                  <input
                    type="file"
                    onChange={handleMaterialFileUpload}
                    className="text-xs text-[#735965] file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-black file:bg-[#ffd3df] file:text-[#bf3e67] cursor-pointer flex-1"
                  />
                  {newMaterialFileName && (
                    <div className="text-[10px] font-bold text-[#bf3e67] bg-[#ffd3df] px-2 py-1 rounded max-w-[150px] truncate" title={newMaterialFileName}>
                      {newMaterialFileName}
                    </div>
                  )}
                  {newMaterialFileUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        setNewMaterialFileUrl("");
                        setNewMaterialFileName("");
                      }}
                      className="px-2 py-1 rounded bg-red-50 hover:bg-red-100 text-red-500 text-[10px] font-bold border border-red-200"
                    >
                      지우기
                    </button>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-bold text-[#2d2026]">자료 세부 설명 요약</label>
                <textarea 
                  rows={4}
                  placeholder="점주들이 자료를 내려받기 전 어떤 내용을 담고 있는지 충분히 인지할 수 있도록 명료하게 작성해 주세요."
                  value={newMaterialDesc}
                  onChange={(e) => setNewMaterialDesc(e.target.value)}
                  required
                  className="w-full bg-[#fff1f5] border border-[#f2ccd7] rounded-xl px-4 py-3 text-sm text-[#2d2026] placeholder-[#735965]/50 focus:outline-none focus:border-[#f25f8a] resize-none"
                />
              </div>

              <button 
                type="submit"
                className="w-full py-4 bg-[#f25f8a] hover:bg-[#df4977] text-white font-bold text-sm rounded-xl transition-all shadow-sm mt-2"
              >
                신규 지원 자료 공식 배포 등록
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 7. Order Detail Popup Modal */}
      {showOrderModal && selectedOrder && (
        <div 
          className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setShowOrderModal(false)}
        >
          <div 
            className="w-full max-w-3xl bg-white border border-[#f2ccd7] rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-5 sm:p-6 border-b border-[#f2ccd7]/60 flex justify-between items-center bg-[#fff1f5]/50">
              <div className="flex-1">
                <h3 className="text-sm sm:text-base font-black text-[#2d2026] flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2">
                  <span>📦 발주 주문 상세 내역</span>
                  <span className="text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full bg-red-50 text-red-500 border border-red-200 font-bold w-fit">
                    {selectedOrder.id}
                  </span>
                </h3>
              </div>
              <button 
                type="button"
                onClick={() => setShowOrderModal(false)} 
                className="p-1.5 text-[#735965] hover:text-[#f25f8a] bg-white border border-[#f2ccd7] rounded-lg shrink-0 ml-4 cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            {/* Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
              
              {/* Delivery Recipient Info (Dynamic Store Join with Clip Board Copy) */}
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
                  <div className="space-y-4 bg-gradient-to-br from-[#fff1f5]/70 to-white border border-[#f2ccd7]/80 p-6 rounded-2xl shadow-sm">
                    <h4 className="font-extrabold text-sm text-[#bf3e67] border-b border-[#f2ccd7]/60 pb-2.5 flex items-center gap-1.5">
                      <Store size={15} />
                      수령인 & 배송지 정보 (가맹점 정보)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-[#735965]">
                      <div className="bg-white/60 p-3 rounded-xl border border-[#f2ccd7]/30 flex justify-between items-center">
                        <div>
                          <span className="block text-[9px] text-[#735965]/60 mb-0.5 font-bold">가맹점명</span>
                          <strong className="text-[#2d2026] text-xs">{storeInfo.name}</strong>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopyToClipboard(storeInfo.name, "가맹점명")}
                          className="p-1.5 hover:text-[#f25f8a] text-[#735965] bg-white border border-[#f2ccd7]/40 rounded-lg shrink-0 cursor-pointer hover:shadow-sm"
                          title="복사하기"
                        >
                          <Copy size={11} />
                        </button>
                      </div>

                      <div className="bg-white/60 p-3 rounded-xl border border-[#f2ccd7]/30 flex justify-between items-center">
                        <div>
                          <span className="block text-[9px] text-[#735965]/60 mb-0.5 font-bold">점주 대표자</span>
                          <strong className="text-[#2d2026] text-xs">{storeInfo.owner}</strong>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopyToClipboard(storeInfo.owner, "대표자명")}
                          className="p-1.5 hover:text-[#f25f8a] text-[#735965] bg-white border border-[#f2ccd7]/40 rounded-lg shrink-0 cursor-pointer hover:shadow-sm"
                          title="복사하기"
                        >
                          <Copy size={11} />
                        </button>
                      </div>

                      <div className="bg-white/60 p-3 rounded-xl border border-[#f2ccd7]/30 flex justify-between items-center">
                        <div>
                          <span className="block text-[9px] text-[#735965]/60 mb-0.5 font-bold">연락처</span>
                          <strong className="text-[#2d2026] text-xs">{storeInfo.phone}</strong>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopyToClipboard(storeInfo.phone, "연락처")}
                          className="p-1.5 hover:text-[#f25f8a] text-[#735965] bg-white border border-[#f2ccd7]/40 rounded-lg shrink-0 cursor-pointer hover:shadow-sm"
                          title="복사하기"
                        >
                          <Copy size={11} />
                        </button>
                      </div>

                      <div className="bg-white/60 p-3 rounded-xl border border-[#f2ccd7]/30 flex justify-between items-center">
                        <div>
                          <span className="block text-[9px] text-[#735965]/60 mb-0.5 font-bold">주문 신청일</span>
                          <strong className="text-[#2d2026] text-xs">{selectedOrder.date}</strong>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopyToClipboard(selectedOrder.date, "신청일")}
                          className="p-1.5 hover:text-[#f25f8a] text-[#735965] bg-white border border-[#f2ccd7]/40 rounded-lg shrink-0 cursor-pointer hover:shadow-sm"
                          title="복사하기"
                        >
                          <Copy size={11} />
                        </button>
                      </div>
                    </div>
                    <div className="pt-3.5 text-xs font-semibold text-[#735965] border-t border-[#f2ccd7]/40 bg-white/60 p-4 rounded-xl border border-[#f2ccd7]/30 flex justify-between items-center gap-4">
                      <div className="flex-1">
                        <span className="block text-[9px] text-[#735965]/60 mb-0.5 font-bold">배송지 주소</span>
                        <strong className="text-[#2d2026] text-xs break-words leading-tight">{storeAddress}</strong>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopyToClipboard(storeAddress, "배송지 주소")}
                        className="p-2 hover:text-[#f25f8a] text-[#735965] bg-white border border-[#f2ccd7] rounded-xl shrink-0 cursor-pointer hover:shadow-md transition-all self-center"
                        title="주소 복사"
                      >
                        <Copy size={13} />
                      </button>
                    </div>
                  </div>
                );
              })()}

              {/* Order Item List */}
              <div className="space-y-3">
                <h4 className="font-extrabold text-sm text-[#bf3e67] flex items-center gap-1.5">
                  <Package size={15} />
                  발주 신청 품목 및 정산 내역 ({selectedOrder.items.length})
                </h4>
                <div className="border border-[#f2ccd7]/60 rounded-2xl overflow-hidden bg-white">
                  <div className="overflow-x-auto w-full">
                    <table className="w-full text-left border-collapse text-[11px] min-w-[480px] sm:min-w-0" style={{ tableLayout: 'fixed' }}>
                      <thead>
                        <tr className="bg-[#fff1f5] border-b border-[#f2ccd7] text-[10px] font-bold text-[#735965] uppercase">
                          <th className="px-3 py-2.5" style={{ width: '40%' }}>품목명</th>
                          <th className="px-2 py-2.5 text-right" style={{ width: '20%' }}>단가</th>
                          <th className="px-2 py-2.5 text-center" style={{ width: '15%' }}>수량</th>
                          <th className="px-3 py-2.5 text-right" style={{ width: '25%' }}>금액</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#f2ccd7]/40">
                        {selectedOrder.items.map((item, idx) => (
                          <tr key={idx} className="hover:bg-[#fff9fb]/40 font-medium">
                            <td className="px-3 py-2.5 font-bold text-[#2d2026] leading-tight break-words text-[11px] sm:text-xs" style={{ wordBreak: 'break-word' }}>
                              {item.productName}
                            </td>
                            <td className="px-2 py-2.5 text-right text-[#735965] text-[11px]">{item.price.toLocaleString()}</td>
                            <td className="px-2 py-2.5 text-center font-bold text-[#2d2026] text-[11px]">{item.quantity}</td>
                            <td className="px-3 py-2.5 text-right font-bold text-[#f25f8a] text-[11px]">{(item.price * item.quantity).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Status control and Total price summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[#f2ccd7]/60">
                <div className="space-y-2 bg-[#fff1f5]/50 border border-[#f2ccd7]/60 p-4 rounded-xl">
                  <label className="text-xs font-bold text-[#bf3e67] block">상태값 변경 선택</label>
                  <select
                     value={selectedOrder.status}
                     onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)}
                     className="w-full bg-white border border-[#f2ccd7] rounded-xl px-3 py-2.5 text-xs text-[#2d2026] font-bold focus:outline-none focus:border-[#f25f8a] cursor-pointer"
                  >
                    {deliveryStatuses.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                <div className="bg-[#fff1f5]/80 border border-[#f2ccd7]/60 p-4 rounded-xl flex flex-col justify-center items-end text-right">
                  <span className="text-[10px] text-[#735965] font-bold block mb-1">결제 수단 정보</span>
                  <span className="text-xs text-[#bf3e67] font-black block mb-2">
                    {selectedOrder.payMethod === "card" || selectedOrder.payMethod === "CARD" ? "카드결제" : "현금 입금 진행"}
                  </span>
                  <span className="text-[10px] text-[#735965]/80 font-bold block mb-1">총 결제 합계액 (부가세 포함)</span>
                  <strong className="text-xl font-black text-[#bf3e67]">
                    {selectedOrder.totalPrice.toLocaleString()} 원
                  </strong>
                </div>
              </div>

              {/* 배송 및 송장 정보 관리 (신설) */}
              <form onSubmit={handleUpdateOrderTracking} className="space-y-4 bg-[#fff1f5]/50 border border-[#f2ccd7]/60 p-5 rounded-2xl shadow-sm">
                <h4 className="font-extrabold text-xs text-[#bf3e67] flex items-center gap-1.5 border-b border-[#f2ccd7]/40 pb-2">
                  🚚 배송 물류 송장 정보 등록/수정 (다중 송장 지원)
                </h4>
                
                {/* 등록된 송장 리스트 */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#735965] block">등록된 송장 목록 ({modalTrackingList.length})</label>
                  {modalTrackingList.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {modalTrackingList.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-white border border-[#f2ccd7]/40 px-3 py-2 rounded-xl text-xs font-semibold text-[#2d2026] shadow-sm hover:border-[#f25f8a] transition-all">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-lg bg-[#fff1f5] text-[9px] font-black text-[#bf3e67] border border-[#f2ccd7]/60">
                              {item.courier}
                            </span>
                            <span className="font-mono text-[#bf3e67] font-bold text-xs">{item.trackingNo}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setModalTrackingList(modalTrackingList.filter((_, i) => i !== idx));
                            }}
                            className="p-1 hover:bg-[#fff1f5] rounded-full text-red-400 hover:text-red-600 transition-colors cursor-pointer"
                            title="삭제"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 bg-white border border-dashed border-[#f2ccd7]/60 rounded-xl text-[11px] font-bold text-[#735965]/50 shadow-inner">
                      등록된 송장 번호가 없습니다. 아래에서 송장을 등록해 주세요.
                    </div>
                  )}
                </div>

                {/* 송장 추가 입력 폼 */}
                <div className="bg-white/80 border border-[#f2ccd7]/30 p-3 rounded-xl space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                    <div className="sm:col-span-4 space-y-1">
                      <label className="text-[10px] font-bold text-[#735965] block">택배사 선택</label>
                      <select
                        value={selectedCourier}
                        onChange={(e) => setSelectedCourier(e.target.value)}
                        className="w-full bg-white border border-[#f2ccd7] rounded-lg px-2.5 py-2 text-xs text-[#2d2026] font-bold focus:outline-none cursor-pointer"
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
                      <label className="text-[10px] font-bold text-[#735965] block">송장번호 입력</label>
                      <input
                        type="text"
                        placeholder="하이픈(-) 없이 입력"
                        value={inputTrackingNo}
                        onChange={(e) => setInputTrackingNo(e.target.value)}
                        className="w-full bg-white border border-[#f2ccd7] rounded-lg px-2.5 py-2 text-xs text-[#2d2026] focus:outline-none font-medium"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <button
                        type="button"
                        onClick={handleToAddTracking}
                        className="w-full py-2 bg-[#fff1f5] hover:bg-[#ffd3df] text-[#bf3e67] border border-[#f2ccd7] text-xs font-black rounded-lg transition-all shadow-sm cursor-pointer flex items-center justify-center gap-1"
                      >
                        <Plus size={14} />
                        추가
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#f2ccd7]/30">
                  <style dangerouslySetInnerHTML={{ __html: `
                    #admin-portal #admin-submit-tracking-btn,
                    #admin-portal #admin-submit-tracking-btn *,
                    #admin-portal .admin-submit-tracking-btn,
                    #admin-portal .admin-submit-tracking-btn * {
                      color: #ffffff !important;
                      fill: #ffffff !important;
                    }
                  ` }} />
                  <button
                    id="admin-submit-tracking-btn"
                    type="submit"
                    className="admin-submit-tracking-btn w-full py-3 bg-[#bf3e67] hover:bg-[#a02c52] text-white !text-white text-xs font-black rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                    style={{ color: '#ffffff' }}
                  >
                    <span className="text-white !text-white flex items-center justify-center gap-1.5" style={{ color: '#ffffff' }}>
                      <Truck size={14} className="text-white !text-white" style={{ color: '#ffffff' }} />
                      송장 등록 및 배송중 변경
                    </span>
                  </button>
                </div>
              </form>

            </div>

            {/* Footer */}
            <div className="p-5 bg-neutral-50 text-right border-t border-[#f2ccd7]/60">
              <button 
                onClick={() => setShowOrderModal(false)}
                className="px-6 py-2.5 rounded-xl bg-white border border-[#f2ccd7] hover:bg-[#fff9fb] text-xs font-bold text-[#735965] transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
