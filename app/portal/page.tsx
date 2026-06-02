"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  ShoppingBag,
  History,
  Megaphone,
  MessageSquare,
  BookOpen,
  Image as ImageIcon,
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
  Camera,
  Video,
  Phone,
  MessageCircle
} from "lucide-react";

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
  shippingType?: "free" | "A" | "B" | "C";
}

interface CartItem {
  productId: string;
  quantity: number;
}

interface Order {
  id: string;
  date: string;
  items: { productName: string; quantity: number; price: number }[];
  totalPrice: number;
  status: string;
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
// INITIAL SEED MOCK DATA
// ==========================================
const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "로제미트파이 생지",
    category: "냉동생지/자재",
    price: 45000,
    packSize: "1박스 (60개입)",
    img: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779760050/%EB%A1%9C%EC%A0%9C%EB%AF%B8%ED%8A%B8%ED%8C%8C%EC%9D%B4_khogbn.jpg",
    stock: "in_stock",
    desc: "육즙 가득 미트소스와 로제 크림이 가미된 시그니처 대표 생지"
  },
  {
    id: "prod-2",
    name: "애플시나몬파이 생지",
    category: "냉동생지/자재",
    price: 42000,
    packSize: "1박스 (60개입)",
    img: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779760051/%EC%95%A0%ED%94%8C%ED%8C%8C%EC%9D%B4_yurkh5.jpg",
    stock: "in_stock",
    desc: "달콤 상큼한 사과 과육과 시나몬 아로마가 어우러진 스테디셀러 디저트 생지"
  },
  {
    id: "prod-3",
    name: "콘치즈파이 생지",
    category: "냉동생지/자재",
    price: 43000,
    packSize: "1박스 (60개입)",
    img: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779760050/%EC%BD%98%EC%B9%98%EC%A6%88%ED%8C%8C%EC%9D%B4_qvb2u5.jpg",
    stock: "low_stock",
    desc: "고소한 스위트콘 and 부드러운 치즈가 조합된 남녀노소 취향저격 생지"
  },
  {
    id: "prod-4",
    name: "쌀계란빵 오리지널 믹스",
    category: "냉동생지/자재",
    price: 21000,
    packSize: "1팩 (5kg)",
    img: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779761729/%EC%98%A4%EB%A6%AC%EC%A7%80%EB%84%90%EA%B3%84%EB%9E%80%EB%B9%B52_kdqsqv.jpg",
    stock: "in_stock",
    desc: "에그120 전용 100% 국산 쌀가루 계란빵 전용 반죽 파우더 믹스"
  },
  {
    id: "prod-5",
    name: "츄러스 전용 냉동생지",
    category: "냉동생지/자재",
    price: 38000,
    packSize: "1박스 (100개입)",
    img: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779762878/%EC%98%A4%EB%A6%AC%EC%A7%80%EB%84%90_koyjlk.jpg",
    stock: "in_stock",
    desc: "기름 없이 오븐 조리가 가능한 바삭하고 쫀득한 츄러스 전용 냉동 생지"
  },
  {
    id: "prod-6",
    name: "시그니처 테이크아웃 컵 16oz",
    category: "부자재/포장재",
    price: 28000,
    packSize: "1박스 (500개입)",
    img: "/logo_yellow_blue.png",
    stock: "in_stock",
    desc: "120pie & coffee 브랜드 전용 친환경 로고 인쇄 테이크아웃 컵"
  },
  {
    id: "prod-7",
    name: "에그120 캐릭터 포장 박스",
    category: "부자재/포장재",
    price: 18000,
    packSize: "1박스 (200개입)",
    img: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779761728/%EC%8A%88%ED%81%AC%EB%A6%BC_gbhnz2.jpg",
    stock: "in_stock",
    desc: "귀여운 에그군 캐릭터 일러스트가 프린팅된 고품격 시각 보강 포장 패키지"
  },
  {
    id: "prod-8",
    name: "에그군 캐릭터 자석 스티커",
    category: "부자재/포장재",
    price: 9000,
    packSize: "1팩 (500매)",
    img: "/logo_yellow_blue.png",
    stock: "low_stock",
    desc: "음료 및 파이 포장 봉투 부착용 원형 에그군 밀봉 스티커"
  },
  {
    id: "prod-9",
    name: "전용 타이머 영수 가열지",
    category: "소모품/집기",
    price: 12000,
    packSize: "1팩 (10롤)",
    img: "/logo_yellow_blue.png",
    stock: "in_stock",
    desc: "본사 제공 전용 가열 타이머 기기에 매칭되는 표준 감열 롤 용지"
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
    img: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779718433/120%EA%B2%B9%ED%8C%8C%EC%9D%B4_%ED%81%AC%EB%A6%BC%EC%B9%98%EC%A6%88_%EC%95%A4_%EC%BD%98%EC%B9%98%EC%A6%88_t7mopc.jpg"
  },
  {
    id: "TRN-02",
    title: "에그120 계란빵 쌀믹스 배합 및 기기 조리 영상 가이드 (MP4)",
    date: "2026-05-15",
    size: "85.6 MB",
    format: "MP4",
    desc: "반죽 성형의 미세 오차를 방지하고 폭신한 볼륨감을 살리기 위해 100% 쌀믹스 파우더와 물, 토핑의 정량 황금 비율 배합법 및 기기 청소 요령을 담은 비디오 교육 강좌입니다.",
    img: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779761729/%EC%98%A4%EB%A6%AC%EC%A7%80%EB%84%90%EA%B3%84%EB%9E%80%EB%B9%B52_kdqsqv.jpg"
  }
];

const INITIAL_PR: Material[] = [
  {
    id: "PR-01",
    title: "2026 여름 시즌 한정 '망고파이' 포스터 & 테이블텐트 패키지 (AI/JPG)",
    date: "2026-05-18",
    size: "45.2 MB",
    format: "AI/PSD/JPG",
    desc: "여름 신메뉴 출시를 알리는 고화질 매장 부착용 포스터 2종 및 각 좌석 배치용 삼각 테이블텐트 시안 파일 세트입니다.",
    img: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779718433/120%EA%B2%B9%ED%8C%8C%EC%9D%B4_%ED%81%AC%EB%A6%BC%EC%B9%98%EC%A6%88_%EC%97%B0%EC%B6%9C_xk9fhi.jpg"
  }
];

export default function PortalPage() {
  // ==========================================
  // AUTHENTICATION STATE & LOGIC
  // ==========================================
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);
  const [loginId, setLoginId] = useState<string>("");
  const [loginPw, setLoginPw] = useState<string>("");
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const logged = localStorage.getItem("120_owner_logged_in");
      if (logged === "true") {
        setIsLoggedIn(true);
      }
      setCheckingAuth(false);
    }
  }, []);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    // Read from localStorage to support dynamic stores
    const storedStoresRaw = localStorage.getItem("120_stores");
    let storedStores = [];
    if (storedStoresRaw) {
      try {
        storedStores = JSON.parse(storedStoresRaw);
      } catch (err) {
        console.error(err);
      }
    }

    const isHardcodedOwner = loginId === "owner" && loginPw === "owner";
    const matchedStore = storedStores.find(
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
  // STATE MANAGEMENT (LOCAL STORAGE SYNCD)
  // ==========================================
  const [currentMenu, setCurrentMenu] = useState<string>("dashboard");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  
  // Dynamic collections synced via localStorage
  const [products, setProducts] = useState<Product[]>([]);
  const [stores, setStores] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [banner, setBanner] = useState<any>(null);
  const [activeStoreId, setActiveStoreId] = useState<string>("owner");

  const [notices, setNotices] = useState<Notice[]>([]);
  const [trainings, setTrainings] = useState<Material[]>([]);
  const [prs, setPrs] = useState<Material[]>([]);

  // Selected Detail Modals
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedProductDetail, setSelectedProductDetail] = useState<any | null>(null);

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

  // Shipping and Return Policy states
  const [shippingPolicy, setShippingPolicy] = useState<string>("");
  const [returnPolicy, setReturnPolicy] = useState<string>("");
  const [freeShippingThreshold, setFreeShippingThreshold] = useState<number>(100000);
  const [shippingFeeA, setShippingFeeA] = useState<number>(3000);
  const [shippingFeeB, setShippingFeeB] = useState<number>(4000);
  const [shippingFeeC, setShippingFeeC] = useState<number>(5000);

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

      setOrders(loadState("120_orders", INITIAL_ORDERS));
      setInquiries(loadState("120_inquiries", INITIAL_INQUIRIES));
      setNotices(loadState("120_notices", INITIAL_NOTICES));
      setTrainings(loadState("120_trainings", INITIAL_TRAINING));
      setPrs(loadState("120_prs", INITIAL_PR));

      // Seeds
      setStores(loadState("120_stores", []));
      setCategories(loadState("120_categories", ["냉동생지/자재", "부자재/포장재", "소모품/집기"]));
      setBanner(loadState("120_banners", null));
      setActiveStoreId(localStorage.getItem("120_active_store_id") || "owner");

      // Load Popup & Floating values
      const loadedPop = loadState("120_popups", {
        isActive: true,
        title: "여름 스페셜 '망고파이' 물류 정식 출시!",
        desc: "신메뉴 출시 기념 특전! 지금 물류 메뉴에서 망고파이 생지 3박스 이상 주문 시 캐릭터 홍보 포스터 패키지 및 아크릴 테이블 텐트 시안 무상 증정!",
        image: "",
        link: "order",
        btnText: "지금 바로 신메뉴 생지 주문하러 가기"
      });
      setPopupSettings(loadedPop);

      const loadedFloat = loadState("120_floatings", {
        isActive: true,
        instaUrl: "https://www.instagram.com/120pie77/",
        youtubeUrl: "https://youtube.com",
        chatUrl: "https://kakao.com",
        phoneNo: "1566-3594",
        kakaoUrl: "https://kakao.com"
      });
      setFloatingSettings(loadedFloat);

      // Check if popup should be shown today
      if (loadedPop?.isActive) {
        const closedDate = localStorage.getItem("120_popup_closed_date");
        const todayStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
        if (closedDate !== todayStr) {
          setShowPopup(true);
        }
      }

      const pr = loadState("120_products", INITIAL_PRODUCTS);
      const mapped = pr.map((p: any) => ({
        id: p.id,
        name: p.name,
        category: p.category,
        price: p.discountedPrice !== undefined ? p.discountedPrice : p.price,
        packSize: p.packSize || `${p.unit || '박스'} (${p.qty || 1}개입)`,
        img: p.img,
        detailImg: p.detailImg,
        stock: p.stock || "in_stock",
        desc: p.desc || "",
        orderIndex: p.orderIndex || 99,
        labels: p.labels || [],
        shippingType: p.shippingType || "A"
      })).sort((a: any, b: any) => a.orderIndex - b.orderIndex);
      setProducts(mapped);

      const policySettings = loadState("120_shipping_settings", {
        shippingPolicy: "본사 물류 전용 저온 냉동 탑차로 안전하게 직배송됩니다.",
        returnPolicy: "식재료 특성상 단순 변심으로 인한 반품은 불가하며, 오배송 건은 수령 즉시 본사 접수 바랍니다.",
        freeShippingThreshold: "100,000",
        shippingFeeA: "3,000",
        shippingFeeB: "4,000",
        shippingFeeC: "5,000"
      });
      setShippingPolicy(policySettings.shippingPolicy);
      setReturnPolicy(policySettings.returnPolicy);
      const parsedThreshold = parseInt(policySettings.freeShippingThreshold.replace(/,/g, "")) || 100000;
      setFreeShippingThreshold(parsedThreshold);
      setShippingFeeA(parseInt((policySettings.shippingFeeA || "3,000").replace(/,/g, "")) || 3000);
      setShippingFeeB(parseInt((policySettings.shippingFeeB || "4,000").replace(/,/g, "")) || 4000);
      setShippingFeeC(parseInt((policySettings.shippingFeeC || "5,000").replace(/,/g, "")) || 5000);
    }
  }, []);

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

        setOrders(parseSafely("120_orders", INITIAL_ORDERS));
        setInquiries(parseSafely("120_inquiries", INITIAL_INQUIRIES));
        setNotices(parseSafely("120_notices", INITIAL_NOTICES));
        setTrainings(parseSafely("120_trainings", INITIAL_TRAINING));
        setPrs(parseSafely("120_prs", INITIAL_PR));

        setStores(parseSafely("120_stores", []));
        setCategories(parseSafely("120_categories", ["냉동생지/자재", "부자재/포장재", "소모품/집기"]));
        
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

        const pr = localStorage.getItem("120_products");
        if (pr) {
          try {
            const parsedProducts = JSON.parse(pr);
            const mapped = parsedProducts.map((p: any) => ({
              id: p.id,
              name: p.name,
              category: p.category,
              price: p.discountedPrice !== undefined ? p.discountedPrice : p.price,
              packSize: p.packSize || `${p.unit || '박스'} (${p.qty || 1}개입)`,
              img: p.img,
              detailImg: p.detailImg,
              stock: p.stock || "in_stock",
              desc: p.desc || "",
              orderIndex: p.orderIndex || 99,
              labels: p.labels || [],
              shippingType: p.shippingType || "A"
            })).sort((a: any, b: any) => a.orderIndex - b.orderIndex);
            setProducts(mapped);
          } catch (e) {
            console.warn(e);
          }
        }

        const ps = localStorage.getItem("120_shipping_settings");
        if (ps) {
          try {
            const parsed = JSON.parse(ps);
            setShippingPolicy(parsed.shippingPolicy || "");
            setReturnPolicy(parsed.returnPolicy || "");
            const parsedThreshold = parseInt((parsed.freeShippingThreshold || "100000").toString().replace(/,/g, "")) || 100000;
            setFreeShippingThreshold(parsedThreshold);
            setShippingFeeA(parseInt((parsed.shippingFeeA || "3,000").toString().replace(/,/g, "")) || 3000);
            setShippingFeeB(parseInt((parsed.shippingFeeB || "4,000").toString().replace(/,/g, "")) || 4000);
            setShippingFeeC(parseInt((parsed.shippingFeeC || "5,000").toString().replace(/,/g, "")) || 5000);
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

  // ==========================================
  // CART ACTIONS
  // ==========================================
  const addToCart = (productId: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === productId);
      if (existing) {
        triggerToast("장바구니 품목 수량을 1개 추가했습니다.");
        return prev.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      triggerToast("상품을 장바구니에 담았습니다.");
      return [...prev, { productId, quantity: 1 }];
    });
  };

  const updateCartQty = (productId: string, qty: number) => {
    if (qty <= 0) {
      setCart((prev) => prev.filter((item) => item.productId !== productId));
      triggerToast("품목을 장바구니에서 삭제했습니다.");
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity: qty } : item
      )
    );
  };

  const removeCartItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
    triggerToast("품목을 장바구니에서 삭제했습니다.");
  };

  const clearCart = () => {
    setCart([]);
  };

  // Cart math
  const cartSubtotal = cart.reduce((acc, item) => {
    const p = products.find((prod) => prod.id === item.productId);
    return acc + (p ? p.price * item.quantity : 0);
  }, 0);

  // Get dynamic shipping fee based on selected type: free, A, B, C (Choose maximum)
  const getAppliedShippingFee = () => {
    if (cartSubtotal >= freeShippingThreshold || cart.length === 0) return 0;
    
    let maxFee = 0;
    cart.forEach((item) => {
      const p = products.find((prod) => prod.id === item.productId);
      const type = p?.shippingType || "A";
      let fee = 0;
      if (type === "A") fee = shippingFeeA;
      else if (type === "B") fee = shippingFeeB;
      else if (type === "C") fee = shippingFeeC;
      else if (type === "free") fee = 0;
      
      if (fee > maxFee) {
        maxFee = fee;
      }
    });
    return maxFee;
  };

  const getAppliedShippingType = () => {
    if (cartSubtotal >= freeShippingThreshold || cart.length === 0) return "무료배송";
    
    let maxFee = -1;
    let maxType = "free";
    cart.forEach((item) => {
      const p = products.find((prod) => prod.id === item.productId);
      const type = p?.shippingType || "A";
      let fee = 0;
      if (type === "A") fee = shippingFeeA;
      else if (type === "B") fee = shippingFeeB;
      else if (type === "C") fee = shippingFeeC;
      else if (type === "free") fee = 0;
      
      if (fee > maxFee) {
        maxFee = fee;
        maxType = type;
      }
    });
    
    if (maxType === "free") return "무료배송";
    return `${maxType}타입`;
  };

  const shippingFee = getAppliedShippingFee();
  const shippingTypeLabel = getAppliedShippingType();
  const cartTotal = cartSubtotal + shippingFee;

  // ==========================================
  // PLACE ORDER
  // ==========================================
  const placeOrder = () => {
    if (cart.length === 0) return;

    const newOrderItems = cart.map((item) => {
      const p = products.find((prod) => prod.id === item.productId);
      return {
        productName: p ? p.name : "미지 상품",
        quantity: item.quantity,
        price: p ? p.price : 0
      };
    });

    const newOrderId = `ORD-${new Date().getFullYear()}${String(
      new Date().getMonth() + 1
    ).padStart(2, "0")}${String(new Date().getDate()).padStart(2, "0")}-${String(
      Math.floor(100 + Math.random() * 900)
    )}`;

    const newOrder: Order = {
      id: newOrderId,
      date: new Date().toISOString().split("T")[0],
      items: newOrderItems,
      totalPrice: cartTotal,
      status: "주문완료"
    };

    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    localStorage.setItem("120_orders", JSON.stringify(updatedOrders));

    clearCart();
    triggerToast("발주 주문이 정상적으로 완료되었습니다!");
    setCurrentMenu("history");
  };

  // ==========================================
  // SUBMIT INQUIRY
  // ==========================================
  const submitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryTitle || !inquiryContent) {
      alert("제목과 내용을 입력해 주세요.");
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

    setInquiryTitle("");
    setInquiryContent("");
    setShowInquiryModal(false);
    triggerToast("1:1 문의 상담건이 정식 접수되었습니다!");
    setCurrentMenu("inquiry");
  };

  // ==========================================
  // SIMULATE DOWNLOAD
  // ==========================================
  const simulateDownload = (title: string) => {
    triggerToast(`'${title}' 파일 다운로드를 준비하는 중...`);
    setTimeout(() => {
      triggerToast(`다운로드가 완료되었습니다.`);
    }, 1200);
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

  const adoptionMenu = activeStore?.adoptionMenu || ["120pie", "egg120", "츄러스120", "핫도그120", "120coffee"];

  const PACKAGES = [
    { name: "120pie", active: adoptionMenu.includes("120pie"), desc: adoptionMenu.includes("120pie") ? "시그니처 파이 가동중" : "가맹점 도입 대기" },
    { name: "egg120", active: adoptionMenu.includes("egg120"), desc: adoptionMenu.includes("egg120") ? "프리미엄 쌀 계란빵 가동중" : "가맹점 도입 대기" },
    { name: "츄러스120", active: adoptionMenu.includes("츄러스120"), desc: adoptionMenu.includes("츄러스120") ? "스페인 정통 스낵 가동중" : "가맹점 도입 대기" },
    { name: "떡볶이120", active: adoptionMenu.includes("떡볶이120"), desc: adoptionMenu.includes("떡볶이120") ? "쫀득한 국물 떡볶이 가동중" : "가맹점 도입 대기" },
    { name: "핫도그120", active: adoptionMenu.includes("핫도그120"), desc: adoptionMenu.includes("핫도그120") ? "직화 수제 핫도그 가동중" : "가맹점 도입 대기" },
    { name: "120coffee", active: adoptionMenu.includes("120coffee"), desc: adoptionMenu.includes("120coffee") ? "스페셜티 가성비 음료 가동중" : "가맹점 도입 대기" },
    { name: "추가 패키지", active: false, desc: "신규 모듈 준비중" }
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
      <div id="owner-portal" className="h-screen w-screen bg-[#fff9fb] text-[#2d2026] flex flex-col font-sans select-none antialiased justify-center items-center p-4">
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
              <h2 className="text-xl sm:text-2xl font-black text-[#2d2026] tracking-tight">120pie &amp; coffee</h2>
              <p className="text-xs font-bold text-[#bf3e67] bg-[#ffd3df] px-3 py-1 rounded-full w-fit mx-auto border border-[#f2ccd7]">
                점주전용 가맹 관리 포털
              </p>
            </div>
            <p className="text-[11px] text-[#735965] font-semibold leading-relaxed">
              본 시스템은 120겹파이 공식 가맹점 점주님들을 위한 공간입니다. 등록된 파트너 계정으로 로그인해 주세요.
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
              <label className="text-xs font-bold text-[#735965] block">점주 아이디</label>
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
              <label className="text-xs font-bold text-[#735965] block">비밀번호</label>
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

          <div className="bg-[#fff1f5] border border-[#f2ccd7] rounded-xl p-4 text-center text-[10px] space-y-1">
            <span className="font-extrabold text-[#bf3e67] block">📢 임시 테스트 계정 안내</span>
            <p className="text-[#735965] font-bold">아이디: <code className="bg-white border border-[#f2ccd7] px-1.5 py-0.5 rounded font-extrabold text-[#f25f8a]">owner</code> / 비밀번호: <code className="bg-white border border-[#f2ccd7] px-1.5 py-0.5 rounded font-extrabold text-[#f25f8a]">owner</code></p>
          </div>
          
          <div className="text-center pt-2">
            <Link href="/" className="text-xs text-[#735965] hover:text-[#bf3e67] hover:underline font-bold transition-all flex items-center justify-center gap-1">
              ← 메인 랜딩 페이지로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="owner-portal" className="h-screen overflow-hidden bg-[#fff9fb] text-[#2d2026] flex flex-col font-sans select-none antialiased">
      
      {/* TOAST SYSTEM */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[150] bg-[#f25f8a] text-white px-5 py-3.5 rounded-xl font-bold text-sm shadow-[0_8px_30px_rgba(242,95,138,0.25)] flex items-center gap-2.5 animate-bounce">
          <CheckCircle2 size={16} />
          {toastMessage}
        </div>
      )}

      {/* HEADER BANNER PANEL */}
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
            <Link href="/" className="flex items-center gap-2 group shrink-0">
              <img
                src="/logo_yellow_blue.png"
                alt="120pie & coffee"
                className="h-6 w-auto object-contain group-hover:scale-102 transition-transform"
              />
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#ffd3df] text-[#bf3e67] border border-[#f2ccd7] font-bold ml-1">점주전용</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end text-right">
              <span className="font-extrabold text-sm text-[#2d2026]">{activeStore.name}</span>
              <span className="text-[10px] text-[#735965] font-bold">{activeStore.owner} 사장님 (정상 파트너)</span>
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
        <aside className="w-64 border-r border-[#f2ccd7] p-6 flex flex-col justify-between hidden lg:flex bg-[#fff1f5] shrink-0">
          <div className="space-y-8">
            <div className="bg-white border border-[#f2ccd7] rounded-xl p-4 flex gap-3 items-center shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-[#f25f8a] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
                가맹
              </div>
              <div className="overflow-hidden">
                <h4 className="font-extrabold text-xs text-[#2d2026] truncate">{activeStore.name}</h4>
                <p className="text-[10px] text-[#735965] font-semibold truncate mt-0.5">점주 코드: {activeStore.id}</p>
              </div>
            </div>

            <nav className="flex flex-col gap-1.5">
              {[
                { key: "dashboard", label: "대시보드", icon: LayoutDashboard },
                { key: "order", label: "자재 주문", icon: ShoppingBag, badge: cart.length > 0 ? cart.length : undefined },
                { key: "history", label: "주문 내역", icon: History },
                { key: "notice", label: "공지사항", icon: Megaphone, badge: newNoticesCount },
                { key: "inquiry", label: "1:1 문의", icon: MessageSquare },
                { key: "training", label: "교육 자료", icon: BookOpen },
                { key: "pr", label: "홍보 자재", icon: ImageIcon }
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
              <span>시스템 로그아웃</span>
            </button>
          </div>
        </aside>

        {/* MOBILE SIDEBAR */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:hidden flex" onClick={() => setMobileMenuOpen(false)}>
            <div className="w-72 bg-white border-r border-[#f2ccd7] h-full p-6 flex flex-col justify-between" onClick={(e) => e.stopPropagation()}>
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-[#f2ccd7] pb-4">
                  <div className="flex items-center gap-2">
                    <img
                      src="https://res.cloudinary.com/dx7l09wwu/image/upload/v1780326442/logo_120pie_coffee_nu2_c7tiiy.png"
                      alt="로고"
                      className="w-7 h-7"
                    />
                    <span className="font-extrabold text-sm text-[#2d2026]">점주전용 포털</span>
                  </div>
                  <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-[#735965] hover:text-[#f25f8a] bg-[#fff1f5] border border-[#f2ccd7] rounded-lg">
                    <X size={16} />
                  </button>
                </div>

                <div className="bg-[#fff1f5] border border-[#f2ccd7] rounded-xl p-4 flex gap-3 items-center">
                  <div className="w-10 h-10 rounded-lg bg-[#f25f8a] text-white flex items-center justify-center font-bold text-sm shrink-0">
                    가맹
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-[#2d2026]">{activeStore.name}</h4>
                    <p className="text-[9px] text-[#735965] font-semibold mt-0.5">{activeStore.id} / {activeStore.owner} 점주님</p>
                  </div>
                </div>

                <nav className="flex flex-col gap-1">
                  {[
                    { key: "dashboard", label: "대시보드", icon: LayoutDashboard },
                    { key: "order", label: "자재 주문", icon: ShoppingBag, badge: cart.length > 0 ? cart.length : undefined },
                    { key: "history", label: "주문 내역", icon: History },
                    { key: "notice", label: "공지사항", icon: Megaphone, badge: newNoticesCount },
                    { key: "inquiry", label: "1:1 문의", icon: MessageSquare },
                    { key: "training", label: "교육 자료", icon: BookOpen },
                    { key: "pr", label: "홍보 자재", icon: ImageIcon }
                  ].map(({ key, label, icon: Icon, badge }) => (
                    <button
                      key={key}
                      onClick={() => {
                        setCurrentMenu(key);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full px-4 py-3 rounded-xl flex items-center justify-between text-sm font-bold transition-all ${
                        currentMenu === key
                          ? "bg-[#f25f8a] text-white shadow-sm"
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
                  <span>시스템 로그아웃</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-full">
          
          {/* MENU CONTENT: 1. DASHBOARD */}
          {currentMenu === "dashboard" && (
            <div className="space-y-6">
              
              {/* Top Summary Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button 
                  onClick={() => document.getElementById("packages-section")?.scrollIntoView({ behavior: "smooth" })}
                  className="bg-white border border-[#f2ccd7] hover:border-[#f25f8a] hover:bg-[#fff9fb] transition-all rounded-2xl p-4 sm:p-5 flex items-center gap-4 shadow-sm text-left group cursor-pointer"
                >
                  <div className="bg-[#ffd3df] text-[#bf3e67] group-hover:bg-[#f25f8a] group-hover:text-white p-3 rounded-xl shrink-0 hidden sm:block transition-all">
                    <LayoutDashboard size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] sm:text-xs text-[#735965] font-bold block mb-1">운영 중 패키지</span>
                    <strong className="text-xl sm:text-2xl font-black text-[#2d2026]">{activePackageCount} <span className="text-xs text-[#735965] font-normal">/ 7개</span></strong>
                  </div>
                </button>

                <button 
                  onClick={() => setCurrentMenu("notice")}
                  className="bg-white border border-[#f2ccd7] hover:border-[#f25f8a] hover:bg-[#fff9fb] transition-all rounded-2xl p-4 sm:p-5 flex items-center gap-4 shadow-sm text-left group cursor-pointer"
                >
                  <div className="bg-[#ffd3df] text-[#bf3e67] group-hover:bg-[#f25f8a] group-hover:text-white p-3 rounded-xl shrink-0 hidden sm:block transition-all">
                    <Megaphone size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] sm:text-xs text-[#735965] font-bold block mb-1">신규 공지사항</span>
                    <strong className="text-xl sm:text-2xl font-black text-[#f25f8a]">{newNoticesCount} <span className="text-xs text-[#735965] font-normal">건</span></strong>
                  </div>
                </button>

                <button 
                  onClick={() => setCurrentMenu("history")}
                  className="bg-white border border-[#f2ccd7] hover:border-[#f25f8a] hover:bg-[#fff9fb] transition-all rounded-2xl p-4 sm:p-5 flex items-center gap-4 shadow-sm text-left group cursor-pointer"
                >
                  <div className="bg-[#ffd3df] text-[#bf3e67] group-hover:bg-[#f25f8a] group-hover:text-white p-3 rounded-xl shrink-0 hidden sm:block transition-all">
                    <Truck size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] sm:text-xs text-[#735965] font-bold block mb-1">배송 중인 자재</span>
                    <strong className="text-xl sm:text-2xl font-black text-[#2d2026]">{shippingCount} <span className="text-xs text-[#735965] font-normal">건</span></strong>
                  </div>
                </button>

                <button 
                  onClick={() => setCurrentMenu("inquiry")}
                  className="bg-white border border-[#f2ccd7] hover:border-[#f25f8a] hover:bg-[#fff9fb] transition-all rounded-2xl p-4 sm:p-5 flex items-center gap-4 shadow-sm text-left group cursor-pointer"
                >
                  <div className="bg-[#ffd3df] text-[#bf3e67] group-hover:bg-[#f25f8a] group-hover:text-white p-3 rounded-xl shrink-0 hidden sm:block transition-all">
                    <MessageSquare size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] sm:text-xs text-[#735965] font-bold block mb-1">답변 완료 문의</span>
                    <strong className="text-xl sm:text-2xl font-black text-[#2d2026]">{answeredInqCount} <span className="text-xs text-[#735965] font-normal">건</span></strong>
                  </div>
                </button>
              </div>

              {/* Banners Block */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div 
                  className={`lg:col-span-8 border border-[#f2ccd7] rounded-2xl relative overflow-hidden flex flex-col justify-end p-6 min-h-[220px] sm:min-h-[260px] lg:h-[300px] shadow-sm w-full ${
                    banner?.mainImage ? "" : "bg-[#ffd3df]/60"
                  }`}
                  style={{
                    backgroundImage: banner?.mainImage ? `url(${banner.mainImage})` : undefined,
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                  }}
                >
                  <div className={`absolute inset-0 z-0 ${banner?.mainImage ? "bg-black/50" : "bg-gradient-to-r from-transparent to-[#fff1f5]/25"}`}></div>
                  <div className="relative z-10 space-y-3 max-w-md">
                    <span className="bg-[#f25f8a] text-white text-[10px] font-black uppercase px-2.5 py-1 rounded tracking-wider w-fit">
                      {banner?.mainTag || "Seasonal Spec"}
                    </span>
                    <h2 className={`text-2xl sm:text-3xl font-black tracking-tight leading-tight whitespace-pre-line ${
                      banner?.mainImage ? "text-white" : "text-[#bf3e67]"
                    }`}>
                      {banner?.mainTitle || "여름 대비 스페셜 신메뉴\n'망고파이' 물류 정식 공급!"}
                    </h2>
                    <p className={`text-xs font-bold leading-relaxed whitespace-pre-line ${
                      banner?.mainImage ? "text-neutral-200" : "text-[#735965]"
                    }`}>
                      {banner?.mainDesc || "지금 바로 냉동생지를 주문하고, 홍보 자료실에서 매장 포스터 및 아크릴 테이블 텐트 시안을 무상으로 다운로드하여 매출을 강화해 보세요!"}
                    </p>
                  </div>
                </div>

                <div 
                  className={`lg:col-span-4 border border-[#f2ccd7] hover:border-[#f25f8a] transition-all rounded-2xl p-6 flex flex-col justify-between min-h-[220px] sm:min-h-[260px] lg:h-[300px] shadow-sm group relative overflow-hidden w-full ${
                    banner?.sideImage ? "" : "bg-white"
                  }`}
                  style={{
                    backgroundImage: banner?.sideImage ? `url(${banner.sideImage})` : undefined,
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                  }}
                >
                  {banner?.sideImage && <div className="absolute inset-0 bg-black/55 z-0"></div>}
                  <div className="relative z-10">
                    <span className={`text-[10px] font-extrabold tracking-widest uppercase block mb-1 ${
                      banner?.sideImage ? "text-[#ffd3df]" : "text-[#f25f8a]"
                    }`}>
                      {banner?.sideTag || "Standard Edu"}
                    </span>
                    <h3 className={`text-lg sm:text-xl font-bold tracking-tight leading-tight whitespace-pre-line ${
                      banner?.sideImage ? "text-white" : "text-[#2d2026]"
                    }`}>
                      {banner?.sideTitle || "점주 전용\n하절기 식품 안전 &\n위생 자가 점검표"}
                    </h3>
                  </div>
                  <div className="space-y-4 relative z-10">
                    <p className={`text-xs font-medium leading-relaxed whitespace-pre-line ${
                      banner?.sideImage ? "text-neutral-200" : "text-[#735965]"
                    }`}>
                      {banner?.sideDesc || "하절기 위해 해충 및 냉동 식자재 보관 온도를 사전에 정밀 점검하여 위생 과태료 처분을 방지하세요."}
                    </p>
                    <button 
                      onClick={() => {
                        const link = banner?.sideLink || "training";
                        if (link.startsWith("http")) {
                          window.open(link, "_blank");
                        } else {
                          const menuMapping: Record<string, string> = {
                            training: "교육자료실로 이동했습니다.",
                            material: "홍보자료실로 이동했습니다.",
                            order: "발주 및 주문 메뉴로 이동했습니다.",
                            inquiry: "1:1 문의게시판으로 이동했습니다."
                          };
                          if (link === "order") {
                            setCurrentMenu("orders");
                          } else {
                            setCurrentMenu(link);
                          }
                          triggerToast(menuMapping[link] || "해당 메뉴로 이동했습니다.");
                        }
                      }}
                      className="px-4 py-2.5 rounded-lg bg-[#fff1f5] border border-[#f2ccd7] hover:bg-[#ffd3df] text-xs font-bold text-[#bf3e67] transition-all w-fit flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      {banner?.sideBtnText || "교육자료 다운로드"} <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Operating Packages Visual System */}
              <div id="packages-section" className="bg-white border border-[#f2ccd7] rounded-2xl p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-[#f2ccd7] pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-[#2d2026]">운영 중인 120 패키지 모듈</h3>
                    <p className="text-xs text-[#735965] font-semibold mt-1">우리 매장에서 작동하고 있는 브랜드 오퍼레이션 엔진을 한눈에 식별하세요.</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-bold shrink-0">
                    <span className="flex items-center gap-1.5 text-emerald-500">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> 운영중 ({activePackageCount})
                    </span>
                    <span className="flex items-center gap-1.5 text-[#735965]/60">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#fff1f5] border border-[#f2ccd7]"></span> 미운영 (2)
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                  {PACKAGES.map((pkg) => (
                    <div 
                      key={pkg.name}
                      className={`border rounded-xl p-4 flex flex-col justify-between min-h-[96px] transition-all ${
                        pkg.active 
                          ? "bg-[#fff9fb] border-[#f2ccd7] hover:border-[#f25f8a]" 
                          : "bg-white border-[#f2ccd7]/40 opacity-40"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-extrabold ${pkg.active ? "text-[#2d2026]" : "text-[#735965]"}`}>
                          {pkg.name}
                        </span>
                        {pkg.active ? (
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                        ) : (
                          <span className="w-2.5 h-2.5 rounded-full bg-neutral-200 border border-neutral-300"></span>
                        )}
                      </div>
                      <span className={`text-[10px] font-bold ${pkg.active ? "text-[#bf3e67]" : "text-[#735965]/60"}`}>
                        {pkg.desc}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Grid: Recent Lists & Menu Shortcuts */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                <div className="lg:col-span-8 space-y-6">
                  
                  {/* Recent Notices */}
                  <div className="bg-white border border-[#f2ccd7] rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4 border-b border-[#f2ccd7] pb-4">
                      <h4 className="font-extrabold text-base text-[#2d2026]">최근 본사 공지사항</h4>
                      <button onClick={() => setCurrentMenu("notice")} className="text-xs font-bold text-[#735965] hover:text-[#f25f8a] transition-colors">전체보기</button>
                    </div>
                    <div className="divide-y divide-[#f2ccd7]/60">
                      {notices.slice(0, 3).map((notice) => (
                        <button
                          key={notice.id}
                          onClick={() => setSelectedNotice(notice)}
                          className="w-full py-3.5 text-left flex items-center justify-between gap-4 group hover:bg-[#fff9fb] px-2 rounded-lg transition-colors"
                        >
                          <div className="min-w-0 flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                                notice.tag === "필독" ? "bg-red-50 text-red-500 border border-red-200" : "bg-[#fff1f5] text-[#735965] border border-[#f2ccd7]"
                              }`}>
                                {notice.tag}
                              </span>
                              <span className="text-xs font-bold text-[#2d2026] group-hover:text-[#f25f8a] truncate block">{notice.title}</span>
                            </div>
                            <span className="text-[10px] text-[#735965] font-semibold block">{notice.date} · 조회수 {notice.views}</span>
                          </div>
                          <ChevronRight size={14} className="text-[#735965]/40 group-hover:text-[#f25f8a] shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Menu Shortcuts */}
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { key: "order", label: "자재 주문", icon: ShoppingBag, desc: "원자재 발주", color: "bg-[#f25f8a] text-white hover:bg-[#df4977]" },
                      { key: "inquiry", label: "1:1 문의", icon: MessageSquare, desc: "신속한 가맹 소통", color: "bg-white text-[#bf3e67] border border-[#f2ccd7] hover:bg-[#fff1f5]" },
                      { key: "pr", label: "홍보 자재", icon: ImageIcon, desc: "시즌 디자인 다운", color: "bg-white text-[#bf3e67] border border-[#f2ccd7] hover:bg-[#fff1f5]" }
                    ].map((btn) => (
                      <button
                        key={btn.key}
                        onClick={() => setCurrentMenu(btn.key)}
                        className={`rounded-2xl p-4 flex flex-col justify-between min-h-[120px] text-left transition-all shadow-sm ${btn.color}`}
                      >
                        <btn.icon size={20} />
                        <div>
                          <strong className="text-sm font-bold block">{btn.label}</strong>
                          <span className="text-[9px] font-semibold block opacity-80 mt-1">{btn.desc}</span>
                        </div>
                      </button>
                    ))}
                  </div>

                </div>

                <div className="lg:col-span-4 space-y-6">
                  
                  {/* Recent Orders */}
                  <div className="bg-white border border-[#f2ccd7] rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4 border-b border-[#f2ccd7] pb-4">
                      <h4 className="font-extrabold text-base text-[#2d2026]">최근 발주 내역</h4>
                      <button onClick={() => setCurrentMenu("history")} className="text-xs font-bold text-[#735965] hover:text-[#f25f8a] transition-colors">전체보기</button>
                    </div>
                    <div className="space-y-3">
                      {orders.length === 0 ? (
                        <p className="text-xs text-[#735965] text-center py-6">주문 내역이 없습니다.</p>
                      ) : (
                        orders.slice(0, 2).map((order) => (
                          <div 
                            key={order.id} 
                            onClick={() => setSelectedOrder(order)}
                            className="bg-[#fff1f5]/50 border border-[#f2ccd7] hover:border-[#f25f8a] p-4 rounded-xl space-y-2 cursor-pointer transition-all hover:bg-[#fff9fb] group"
                          >
                            <div className="flex justify-between items-center text-[10px]">
                              <span className="text-[#735965] font-bold">{order.date}</span>
                              <span className={`px-2 py-0.5 rounded font-bold ${
                                order.status === "배송중" 
                                  ? "bg-blue-50 text-blue-500 border border-blue-200 animate-pulse" 
                                  : order.status === "배송완료" 
                                  ? "bg-emerald-50 text-emerald-600 border border-emerald-200" 
                                  : order.status === "배송준비중"
                                  ? "bg-orange-50 text-orange-500 border border-orange-200"
                                  : "bg-[#ffd3df] text-[#bf3e67] border border-[#f2ccd7]"
                              }`}>
                                {order.status}
                              </span>
                            </div>
                            <div>
                              <span className="font-bold text-xs text-[#2d2026] group-hover:text-[#f25f8a] transition-colors truncate block">
                                {order.items[0].productName} {order.items.length > 1 ? `외 ${order.items.length - 1}건` : ""}
                              </span>
                              <div className="flex justify-between items-center mt-1">
                                <strong className="text-xs text-[#bf3e67] font-black">{order.totalPrice.toLocaleString()} 원</strong>
                                <span className="text-[9px] text-[#bf3e67] font-bold opacity-0 group-hover:opacity-100 transition-opacity">상세보기 &gt;</span>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Recent Inquiries */}
                  <div className="bg-white border border-[#f2ccd7] rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4 border-b border-[#f2ccd7] pb-4">
                      <h4 className="font-extrabold text-base text-[#2d2026]">최근 1:1 문의</h4>
                      <button onClick={() => setCurrentMenu("inquiry")} className="text-xs font-bold text-[#735965] hover:text-[#f25f8a] transition-colors">전체보기</button>
                    </div>
                    <div className="space-y-3">
                      {inquiries.length === 0 ? (
                        <p className="text-xs text-[#735965] text-center py-6">접수된 문의가 없습니다.</p>
                      ) : (
                        inquiries.slice(0, 2).map((inq) => (
                          <button
                            key={inq.id}
                            onClick={() => setSelectedInquiry(inq)}
                            className="w-full text-left bg-[#fff1f5]/50 border border-[#f2ccd7] p-4 rounded-xl hover:border-[#f25f8a] transition-colors space-y-2 block"
                          >
                            <div className="flex justify-between items-center text-[10px]">
                              <span className="text-[#735965] font-bold">{inq.category} · {inq.date}</span>
                              <span className={`px-2 py-0.5 rounded font-bold ${
                                inq.status === "답변완료" ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-[#ffd3df] text-[#bf3e67] border border-[#f2ccd7]"
                              }`}>
                                {inq.status}
                              </span>
                            </div>
                            <span className="font-bold text-xs text-[#2d2026] block truncate">{inq.title}</span>
                          </button>
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
              
              {/* Left Side: Category tabs & Product Box grid */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Category selector */}
                <div className="flex flex-wrap gap-2 bg-white border border-[#f2ccd7] p-2 rounded-2xl shadow-sm">
                  {["전체", ...categories].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-4 py-2 rounded-xl font-bold text-xs transition-colors ${
                        activeCategory === cat
                          ? "bg-[#f25f8a] text-white"
                          : "text-[#735965] hover:text-[#bf3e67] hover:bg-[#fff1f5]"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Product Box Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredProducts.map((p) => {
                    const cartQty = cart.find((item) => item.productId === p.id)?.quantity || 0;
                    return (
                      <div 
                        key={p.id}
                        onClick={() => setSelectedProductDetail(p)}
                        className="bg-white border border-[#f2ccd7] hover:border-[#f25f8a] transition-all rounded-2xl overflow-hidden flex flex-col justify-between shadow-sm cursor-pointer hover:shadow-md hover:-translate-y-0.5"
                      >
                        {/* Thumbnail image & stock state badge */}
                        <div className="h-44 relative bg-[#fff1f5] overflow-hidden shrink-0">
                          <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 max-w-[80%]">
                            {p.stock === "low_stock" && (
                              <span className="bg-orange-500 text-white font-bold text-[9px] px-2 py-0.5 rounded shadow-sm">품절임박</span>
                            )}
                            {p.stock === "out_of_stock" && (
                              <span className="bg-red-500 text-white font-bold text-[9px] px-2 py-0.5 rounded shadow-sm">일시품절</span>
                            )}
                          </div>
                          <span className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm text-[10px] text-[#bf3e67] font-extrabold px-2 py-1 rounded border border-[#f2ccd7]">
                            {p.category}
                          </span>
                        </div>

                        {/* Product Info Block */}
                        <div className="p-5 flex-1 flex flex-col justify-between relative">
                          {p.labels && p.labels.length > 0 && (
                            <div className="absolute top-5 right-5 flex flex-wrap gap-1 w-fit justify-end">
                              {p.labels.map((l) => {
                                let bgStyle = "bg-neutral-500/90 text-white";
                                if (l === "BEST") bgStyle = "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm font-black";
                                else if (l === "추천") bgStyle = "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-sm font-black";
                                else if (l === "신제품") bgStyle = "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-sm font-black";
                                return (
                                  <span key={l} className={`font-bold text-[9px] px-2 py-0.5 rounded shadow-sm ${bgStyle}`}>
                                    {l}
                                  </span>
                                );
                              })}
                            </div>
                          )}
                          <div className="space-y-1 pr-14">
                            <span className="text-[10px] text-[#735965] font-bold block">{p.packSize}</span>
                            <h3 className="font-bold text-base text-[#2d2026] leading-tight">{p.name}</h3>
                            <p className="text-[11px] text-[#735965] font-medium leading-relaxed mt-1.5">{p.desc}</p>
                          </div>

                          <div className="flex items-center justify-between mt-5 border-t border-[#f2ccd7]/60 pt-4">
                            <strong className="text-base text-[#2d2026] font-black">{p.price.toLocaleString()} 원</strong>
                            
                            {cartQty > 0 ? (
                              <div className="flex items-center border border-[#f2ccd7] bg-[#fff1f5] rounded-lg p-0.5" onClick={(e) => e.stopPropagation()}>
                                <button 
                                  onClick={() => updateCartQty(p.id, cartQty - 1)}
                                  className="p-1 hover:text-[#bf3e67] text-[#735965] transition-colors"
                                >
                                  <Minus size={14} />
                                </button>
                                <span className="px-3 text-xs font-bold text-[#2d2026] w-6 text-center">{cartQty}</span>
                                <button 
                                  onClick={() => updateCartQty(p.id, cartQty + 1)}
                                  className="p-1 hover:text-[#bf3e67] text-[#735965] transition-colors"
                                >
                                  <Plus size={14} />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  addToCart(p.id);
                                }}
                                className="px-4 py-2 rounded-lg bg-[#fff1f5] hover:bg-[#ffd3df] border border-[#f2ccd7] text-xs font-bold text-[#bf3e67] transition-all"
                              >
                                담기
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>

              {/* Right Side: Interactive Shopping Cart */}
              <div className="lg:col-span-4 h-fit lg:self-start lg:sticky lg:top-[96px]">
                <div className="bg-white border border-[#f2ccd7] rounded-2xl p-6 shadow-sm space-y-6">
                  <div className="flex items-center justify-between border-b border-[#f2ccd7] pb-4">
                    <div className="flex items-center gap-2">
                      <ShoppingBag size={18} className="text-[#f25f8a]" />
                      <h3 className="font-extrabold text-base text-[#2d2026]">발주 장바구니</h3>
                    </div>
                    {cart.length > 0 && (
                      <button onClick={clearCart} className="text-[10px] font-bold text-[#735965] hover:text-red-500 transition-colors flex items-center gap-1">
                        <Trash2 size={12} /> 비우기
                      </button>
                    )}
                  </div>

                  {cart.length === 0 ? (
                    <div className="py-16 text-center space-y-3">
                      <ShoppingBag size={36} className="text-[#f2ccd7] mx-auto" />
                      <p className="text-xs text-[#735965] font-bold leading-relaxed max-w-[180px] mx-auto">
                        발주할 물품의 '담기' 버튼을 클릭해 장바구니를 채워주세요.
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Cart Items list */}
                      <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                        {cart.map((item) => {
                          const p = products.find((prod) => prod.id === item.productId);
                          if (!p) return null;
                          return (
                            <div key={item.productId} className="flex gap-3 justify-between items-center bg-[#fff9fb] border border-[#f2ccd7] p-3 rounded-xl">
                              <img src={p.img} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0" />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-xs text-[#2d2026] truncate">{p.name}</h4>
                                <span className="text-[10px] text-[#735965] font-semibold block">{p.price.toLocaleString()} 원 · {p.packSize}</span>
                              </div>
                              <div className="flex flex-col items-end gap-1.5 shrink-0">
                                <button onClick={() => removeCartItem(p.id)} className="text-[#735965]/60 hover:text-red-500 transition-colors p-1" aria-label="삭제">
                                  <X size={13} />
                                </button>
                                <div className="flex items-center border border-[#f2ccd7] bg-white rounded-lg p-0.5">
                                  <button onClick={() => updateCartQty(p.id, item.quantity - 1)} className="p-0.5 hover:text-[#bf3e67] text-[#735965]/60 transition-colors">
                                    <Minus size={11} />
                                  </button>
                                  <span className="px-2 text-[10px] font-bold text-[#2d2026] w-4 text-center">{item.quantity}</span>
                                  <button onClick={() => updateCartQty(p.id, item.quantity + 1)} className="p-0.5 hover:text-[#bf3e67] text-[#735965]/60 transition-colors">
                                    <Plus size={11} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Cart Bill Details */}
                      <div className="border-t border-[#f2ccd7] pt-4 space-y-2.5 text-xs">
                        <div className="flex justify-between text-[#735965] font-bold">
                          <span>상품 합계</span>
                          <span>{cartSubtotal.toLocaleString()} 원</span>
                        </div>
                        <div className="flex justify-between text-[#735965] font-bold">
                          <div className="flex flex-col">
                            <span>배송비 ({freeShippingThreshold.toLocaleString()}원 이상 무료)</span>
                            {shippingFee > 0 && (
                              <span className="text-[10px] text-[#bf3e67] font-bold">({shippingTypeLabel} 적용)</span>
                            )}
                          </div>
                          <span>{shippingFee === 0 ? "무료" : `${shippingFee.toLocaleString()} 원`}</span>
                        </div>
                        <div className="flex justify-between text-[#2d2026] font-black text-sm border-t border-[#f2ccd7] pt-3">
                          <span>최종 발주 금액</span>
                          <span className="text-[#f25f8a]">{cartTotal.toLocaleString()} 원</span>
                        </div>
                      </div>

                      {/* Order action button */}
                      <button 
                        onClick={placeOrder}
                        className="w-full py-4 bg-[#f25f8a] hover:bg-[#df4977] text-white text-sm font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 size={16} />
                        자재 발주 신청하기
                      </button>
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
              
              <div>
                <h2 className="text-xl font-bold text-[#2d2026]">정기 자재 발주 내역</h2>
                <p className="text-xs text-[#735965] font-bold mt-1">강남역삼점에서 신청한 역대 자재 발주 히스토리와 배송 현황입니다.</p>
              </div>

              {/* Order List Table */}
              <div className="bg-white border border-[#f2ccd7] rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#fff1f5] border-b border-[#f2ccd7] text-[11px] font-bold text-[#735965] uppercase tracking-wider">
                        <th className="p-4 sm:p-5">발주 코드</th>
                        <th className="p-4 sm:p-5">신청 일자</th>
                        <th className="p-4 sm:p-5">주문 품목 요약</th>
                        <th className="p-4 sm:p-5">총 결제 대금</th>
                        <th className="p-4 sm:p-5">배송 상태</th>
                        <th className="p-4 sm:p-5 text-center">상세 정보</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f2ccd7]/60 text-xs">
                      {orders.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-[#735965]">발주 내역이 존재하지 않습니다.</td>
                        </tr>
                      ) : (
                        orders.map((order) => (
                          <tr 
                            key={order.id} 
                            onClick={() => setSelectedOrder(order)}
                            className="hover:bg-[#fff9fb] transition-colors cursor-pointer group"
                          >
                            <td className="p-4 sm:p-5 font-bold text-[#2d2026] group-hover:text-[#f25f8a] transition-colors">{order.id}</td>
                            <td className="p-4 sm:p-5 text-[#735965] font-semibold">{order.date}</td>
                            <td className="p-4 sm:p-5">
                              <span className="font-bold text-[#2d2026]">
                                {order.items[0].productName} {order.items.length > 1 ? `외 ${order.items.length - 1}건` : ""}
                              </span>
                              <span className="text-[10px] text-[#735965] block font-semibold mt-0.5">
                                {order.items.map(item => `${item.productName} ${item.quantity}개`).join(", ")}
                              </span>
                            </td>
                            <td className="p-4 sm:p-5 font-black text-[#bf3e67]">{order.totalPrice.toLocaleString()} 원</td>
                            <td className="p-4 sm:p-5">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold ${
                                order.status === "배송중" 
                                  ? "bg-blue-50 text-blue-500 border border-blue-200 animate-pulse" 
                                  : order.status === "배송완료" 
                                  ? "bg-emerald-50 text-emerald-600 border border-emerald-200" 
                                  : order.status === "배송준비중"
                                  ? "bg-orange-50 text-orange-500 border border-orange-200"
                                  : "bg-[#ffd3df] text-[#bf3e67] border border-[#f2ccd7]"
                              }`}>
                                {order.status === "배송중" && <Truck size={12} />}
                                {order.status === "배송완료" && <Check size={12} />}
                                {order.status === "배송준비중" && <Clock size={12} />}
                                {order.status === "주문완료" && <Clock size={12} />}
                                {!["배송중", "배송완료", "배송준비중", "주문완료"].includes(order.status) && <Clock size={12} />}
                                {order.status}
                              </span>
                            </td>
                            <td className="p-4 sm:p-5 text-center" onClick={(e) => e.stopPropagation()}>
                              <button 
                                onClick={() => setSelectedOrder(order)}
                                className="px-2.5 py-1.5 rounded-lg bg-[#fff1f5] border border-[#f2ccd7] group-hover:bg-[#f25f8a] group-hover:border-[#f25f8a] group-hover:text-white text-[10px] font-bold text-[#bf3e67] transition-all cursor-pointer shadow-sm"
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
              
              <div>
                <h2 className="text-xl font-bold text-[#2d2026]">가맹점 공지사항</h2>
                <p className="text-xs text-[#735965] font-bold mt-1">본사 가맹지원본부에서 사장님들께 드리는 정기 물류, 조리 가이드, 마케팅 공지입니다.</p>
              </div>

              {/* Notice List Cards */}
              <div className="grid grid-cols-1 gap-4">
                {notices.length === 0 ? (
                  <div className="bg-white border border-[#f2ccd7] rounded-2xl p-8 text-center text-[#735965]">등록된 공지사항이 없습니다.</div>
                ) : (
                  notices.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => setSelectedNotice(n)}
                      className="w-full text-left bg-white border border-[#f2ccd7] hover:border-[#f25f8a] transition-all rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm group"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] font-black px-2 py-0.5 rounded ${
                            n.tag === "필독" 
                              ? "bg-red-50 text-red-500 border border-red-200" 
                              : n.tag === "신메뉴"
                              ? "bg-[#ffd3df] text-[#bf3e67] border border-[#f2ccd7]"
                              : "bg-[#fff1f5] text-[#735965] border border-[#f2ccd7]"
                          }`}>
                            {n.tag}
                          </span>
                          <h3 className="font-bold text-base text-[#2d2026] group-hover:text-[#f25f8a] leading-tight">
                            {n.title}
                          </h3>
                        </div>
                        <p className="text-xs text-[#735965] font-semibold">
                          {n.date} · 본사 가맹사업지원팀 · 조회수 {n.views}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-[#735965] group-hover:text-[#f25f8a] transition-colors shrink-0 flex items-center gap-1.5 self-end sm:self-center">
                        상세 읽기 <ChevronRight size={14} />
                      </span>
                    </button>
                  ))
                )}
              </div>

            </div>
          )}

          {/* ==========================================
              MENU CONTENT: 5. 1:1 INQUIRY
             ========================================== */}
          {currentMenu === "inquiry" && (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-[#2d2026]">가맹점 1:1 전용 문의</h2>
                  <p className="text-xs text-[#735965] font-bold mt-1">물류 파손 오배송, 장비 고장 AS 접수, 매장 홍보 추가 지원 신청 등 빠른 해결을 돕습니다.</p>
                </div>
                <button
                  onClick={() => setShowInquiryModal(true)}
                  className="inline-flex items-center justify-center gap-1.5 px-5 py-3 bg-[#f25f8a] hover:bg-[#df4977] text-white text-xs font-bold rounded-lg transition-all shadow-sm shrink-0 self-start sm:self-center"
                >
                  <Send size={13} />
                  신규 1:1 문의 접수
                </button>
              </div>

              {/* Inquiry List Cards */}
              <div className="grid grid-cols-1 gap-4">
                {inquiries.length === 0 ? (
                  <div className="bg-white border border-[#f2ccd7] rounded-2xl p-8 text-center text-[#735965]">등록된 문의 내역이 없습니다.</div>
                ) : (
                  inquiries.map((inq) => (
                    <button
                      key={inq.id}
                      onClick={() => setSelectedInquiry(inq)}
                      className="w-full text-left bg-white border border-[#f2ccd7] hover:border-[#f25f8a] transition-all rounded-2xl p-5 flex flex-col justify-between gap-3 group shadow-sm"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-[#bf3e67] tracking-wider uppercase bg-[#ffd3df] px-2 py-0.5 rounded border border-[#f2ccd7]">
                            {inq.category}
                          </span>
                          <h3 className="font-bold text-base text-[#2d2026] group-hover:text-[#f25f8a] leading-tight">
                            {inq.title}
                          </h3>
                        </div>
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full shrink-0 ${
                          inq.status === "답변완료" 
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-200" 
                            : "bg-[#ffd3df] text-[#bf3e67] border border-[#f2ccd7]"
                        }`}>
                          {inq.status}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-[11px] text-[#735965] font-semibold border-t border-[#f2ccd7]/60 pt-3 mt-1 w-full">
                        <span>접수번호: {inq.id} · 접수일자: {inq.date}</span>
                        <span className="text-[#735965] group-hover:text-[#f25f8a] transition-colors flex items-center gap-1">상세 대화 보기 <ChevronRight size={13} /></span>
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
              
              <div>
                <h2 className="text-xl font-bold text-[#2d2026]">가맹점 교육/매뉴얼 자료실</h2>
                <p className="text-xs text-[#735965] font-bold mt-1">안정적이고 표준화된 파이 및 에그빵 제조 오퍼레이션을 돕기 위한 필수 지침서 및 교안 영상입니다.</p>
              </div>

              {/* Materials Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {trainings.length === 0 ? (
                  <div className="col-span-2 bg-white border border-[#f2ccd7] rounded-2xl p-8 text-center text-[#735965]">등록된 교육 자료가 없습니다.</div>
                ) : (
                  trainings.map((t) => (
                    <div 
                      key={t.id}
                      className="bg-white border border-[#f2ccd7] rounded-2xl overflow-hidden flex flex-col justify-between shadow-sm"
                    >
                      {t.img ? (
                        <div className="h-44 bg-[#fff1f5] overflow-hidden relative shrink-0">
                          <img src={t.img} alt="" className="w-full h-full object-cover" />
                          <span className="absolute bottom-3 right-3 bg-white/95 text-[10px] text-[#bf3e67] font-bold px-2.5 py-1 rounded border border-[#f2ccd7]">
                            {t.format}
                          </span>
                        </div>
                      ) : (
                        <div className="h-44 bg-[#fff1f5] flex items-center justify-center shrink-0 border-b border-[#f2ccd7] relative">
                          <BookOpen size={48} className="text-[#f2ccd7]" />
                          <span className="absolute bottom-3 right-3 bg-white/95 text-[10px] text-[#bf3e67] font-bold px-2.5 py-1 rounded border border-[#f2ccd7]">
                            {t.format}
                          </span>
                        </div>
                      )}

                      <div className="p-5 flex-1 flex flex-col justify-between gap-5">
                        <div className="space-y-2">
                          <span className="text-[10px] text-[#735965] font-bold block">{t.date} · 크기 {t.size}</span>
                          <h3 className="font-bold text-base text-[#2d2026] leading-tight">{t.title}</h3>
                          <p className="text-xs text-[#735965] font-medium leading-relaxed">{t.desc}</p>
                        </div>

                        <div className="flex items-center gap-2 mt-2 w-full">
                          <button
                            onClick={() => setSelectedMaterial(t)}
                            className="flex-1 px-4 py-2.5 rounded-lg bg-[#fff1f5] hover:bg-[#ffd3df] border border-[#f2ccd7] text-xs font-bold text-[#bf3e67] transition-all"
                          >
                            상세보기
                          </button>
                          <button
                            onClick={() => simulateDownload(t.title)}
                            className="px-4 py-2.5 rounded-lg bg-[#f25f8a] hover:bg-[#df4977] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0"
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
              
              <div>
                <h2 className="text-xl font-bold text-[#2d2026]">가맹점 홍보/마케팅 자재실</h2>
                <p className="text-xs text-[#735965] font-bold mt-1">매장 윈도우 스티커, 테이블용 배너, 배달 플랫폼 등록용 캐릭터 썸네일 고화질 원본 그래픽 패키지입니다.</p>
              </div>

              {/* PR Materials Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {prs.length === 0 ? (
                  <div className="col-span-2 bg-white border border-[#f2ccd7] rounded-2xl p-8 text-center text-[#735965]">등록된 홍보 자료가 없습니다.</div>
                ) : (
                  prs.map((p) => (
                    <div 
                      key={p.id}
                      className="bg-white border border-[#f2ccd7] rounded-2xl overflow-hidden flex flex-col justify-between shadow-sm"
                    >
                      {p.img ? (
                        <div className="h-44 bg-[#fff1f5] overflow-hidden relative shrink-0">
                          <img src={p.img} alt="" className="w-full h-full object-cover" />
                          <span className="absolute bottom-3 right-3 bg-white/95 text-[10px] text-[#bf3e67] font-bold px-2.5 py-1 rounded border border-[#f2ccd7]">
                            {p.format}
                          </span>
                        </div>
                      ) : (
                        <div className="h-44 bg-[#fff1f5] flex items-center justify-center shrink-0 border-b border-[#f2ccd7] relative">
                          <ImageIcon size={48} className="text-[#f2ccd7]" />
                          <span className="absolute bottom-3 right-3 bg-white/95 text-[10px] text-[#bf3e67] font-bold px-2.5 py-1 rounded border border-[#f2ccd7]">
                            {p.format}
                          </span>
                        </div>
                      )}

                      <div className="p-5 flex-1 flex flex-col justify-between gap-5">
                        <div className="space-y-2">
                          <span className="text-[10px] text-[#735965] font-bold block">{p.date} · 크기 {p.size}</span>
                          <h3 className="font-bold text-base text-[#2d2026] leading-tight">{p.title}</h3>
                          <p className="text-xs text-[#735965] font-medium leading-relaxed">{p.desc}</p>
                        </div>

                        <div className="flex items-center gap-2 mt-2 w-full">
                          <button
                            onClick={() => setSelectedMaterial(p)}
                            className="flex-1 px-4 py-2.5 rounded-lg bg-[#fff1f5] hover:bg-[#ffd3df] border border-[#f2ccd7] text-xs font-bold text-[#bf3e67] transition-all"
                          >
                            상세보기
                          </button>
                          <button
                            onClick={() => simulateDownload(p.title)}
                            className="px-4 py-2.5 rounded-lg bg-[#f25f8a] hover:bg-[#df4977] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0"
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

        </main>
      </div>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="lg:hidden shrink-0 bg-white border-t border-[#f2ccd7] grid grid-cols-5 p-1 relative z-30 shadow-md">
        {[
          { key: "dashboard", label: "홈", icon: LayoutDashboard },
          { key: "order", label: "발주", icon: ShoppingBag },
          { key: "history", label: "내역", icon: History },
          { key: "notice", label: "공지", icon: Megaphone },
          { key: "inquiry", label: "AS문의", icon: MessageSquare }
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => setCurrentMenu(item.key)}
            className={`flex flex-col items-center justify-center py-2.5 transition-colors ${
              currentMenu === item.key ? "text-[#f25f8a] font-extrabold" : "text-[#735965] font-bold"
            }`}
          >
            <item.icon size={18} />
            <span className="text-[9px] mt-1">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* MODALS */}
      
      {/* 1. Notice Reading Modal */}
      {selectedNotice && (
        <div 
          className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedNotice(null)}
        >
          <div 
            className="w-full max-w-2xl bg-white border border-[#f2ccd7] rounded-xl overflow-hidden shadow-lg max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-[#f2ccd7]/60 flex justify-between items-center bg-[#fff1f5]/50">
              <div className="flex items-center gap-2">
                <span className="bg-red-50 text-red-500 text-[10px] font-black px-2 py-0.5 rounded border border-red-200">
                  {selectedNotice.tag}
                </span>
                <span className="text-xs text-[#735965] font-bold">{selectedNotice.date} · 조회수 {selectedNotice.views}</span>
              </div>
              <button onClick={() => setSelectedNotice(null)} className="p-1.5 text-[#735965] hover:text-[#f25f8a] bg-white border border-[#f2ccd7] rounded-lg">
                <X size={15} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              <h3 className="text-xl font-bold text-[#2d2026] leading-tight">{selectedNotice.title}</h3>
              <div className="h-px bg-[#f2ccd7]/50 w-full my-4"></div>
              <p className="text-xs sm:text-sm text-[#2d2026] leading-relaxed font-medium whitespace-pre-wrap">
                {selectedNotice.content}
              </p>
            </div>

            <div className="p-5 border-t border-[#f2ccd7]/60 bg-[#fff1f5]/30 text-center">
              <button 
                onClick={() => setSelectedNotice(null)}
                className="px-6 py-2.5 rounded-lg bg-white hover:bg-[#fff1f5] border border-[#f2ccd7] text-xs font-bold text-[#735965] transition-all"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Inquiry Reading Modal */}
      {selectedInquiry && (
        <div 
          className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedInquiry(null)}
        >
          <div 
            className="w-full max-w-2xl bg-white border border-[#f2ccd7] rounded-xl overflow-hidden shadow-lg max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-[#f2ccd7]/60 flex justify-between items-center bg-[#fff1f5]/50">
              <span className="bg-[#ffd3df] text-[#bf3e67] text-[10px] font-bold px-2 py-0.5 rounded border border-[#f2ccd7]">
                {selectedInquiry.category}
              </span>
              <button onClick={() => setSelectedInquiry(null)} className="p-1.5 text-[#735965] hover:text-[#f25f8a] bg-white border border-[#f2ccd7] rounded-lg">
                <X size={15} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 flex-1">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] text-[#735965] font-bold">
                  <span>접수 일자: {selectedInquiry.date}</span>
                  <span>상태: {selectedInquiry.status}</span>
                </div>
                <h3 className="text-base font-bold text-[#2d2026] leading-tight">{selectedInquiry.title}</h3>
                <div className="bg-[#fff1f5] border border-[#f2ccd7]/60 p-4 rounded-xl">
                  <p className="text-xs sm:text-sm text-[#2d2026] leading-relaxed font-semibold whitespace-pre-wrap">{selectedInquiry.content}</p>
                </div>
              </div>

              {selectedInquiry.status === "답변완료" && selectedInquiry.answer ? (
                <div className="space-y-2 border-t border-[#f2ccd7]/60 pt-5">
                  <span className="text-[10px] font-bold text-[#bf3e67] tracking-wider uppercase bg-[#ffd3df] px-2 py-0.5 rounded border border-[#f2ccd7] w-fit block">
                    본사 가맹사업관리팀 공식 답변
                  </span>
                  <div className="bg-[#fff9fb] border border-[#f2ccd7] p-4 rounded-xl">
                    <p className="text-xs sm:text-sm text-[#2d2026] leading-relaxed font-medium whitespace-pre-wrap">
                      {selectedInquiry.answer}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 border-t border-[#f2ccd7]/60 pt-6">
                  <h4 className="text-sm font-bold text-[#bf3e67] flex items-center gap-1.5">
                    <Clock size={16} /> 본사 답변 대기중
                  </h4>
                  <div className="bg-[#fff1f5] border border-[#f2ccd7]/60 p-4 rounded-2xl">
                    <p className="text-xs sm:text-sm text-[#735965] leading-relaxed font-medium">
                      점주님께서 올려주신 소중한 문의 사항이 본사 고객케어팀 및 기술 오퍼레이션 본부로 긴급 전달되었습니다. 최대한 상세하게 검토 후 12시간 이내에 정확하게 피드백 및 기기 AS 상담을 지원하겠습니다.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-5 border-t border-[#f2ccd7]/60 bg-[#fff1f5]/30 text-center">
              <button 
                onClick={() => setSelectedInquiry(null)}
                className="px-6 py-2.5 rounded-lg bg-white hover:bg-[#fff1f5] border border-[#f2ccd7] text-xs font-bold text-[#735965] transition-all"
              >
                확인 완료
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Training & PR Material Reading Modal */}
      {selectedMaterial && (
        <div 
          className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedMaterial(null)}
        >
          <div 
            className="w-full max-w-2xl bg-white border border-[#f2ccd7] rounded-xl overflow-hidden shadow-lg max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-[#f2ccd7]/60 flex justify-between items-center bg-[#fff1f5]/50">
              <div className="flex items-center gap-2">
                <span className="bg-[#ffd3df] text-[#bf3e67] text-[10px] font-bold px-2 py-0.5 rounded border border-[#f2ccd7]">
                  {selectedMaterial.format}
                </span>
                <span className="text-xs text-[#735965] font-bold">{selectedMaterial.date} · 크기 {selectedMaterial.size}</span>
              </div>
              <button onClick={() => setSelectedMaterial(null)} className="p-1.5 text-[#735965] hover:text-[#f25f8a] bg-white border border-[#f2ccd7] rounded-lg">
                <X size={15} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 flex-1">
              {selectedMaterial.img && (
                <div className="w-full h-48 rounded-xl overflow-hidden bg-[#fff1f5]">
                  <img src={selectedMaterial.img} alt="" className="w-full h-full object-cover" />
                </div>
              )}
              <h3 className="text-lg font-bold text-[#2d2026] leading-tight">{selectedMaterial.title}</h3>
              <div className="bg-[#fff1f5] border border-[#f2ccd7]/60 p-4 rounded-2xl">
                <span className="text-[10px] text-[#735965] font-bold block mb-1">자료 세부 요약 설명:</span>
                <p className="text-xs sm:text-sm text-[#2d2026] leading-relaxed font-semibold">
                  {selectedMaterial.desc}
                </p>
              </div>
            </div>

            <div className="p-5 border-t border-[#f2ccd7]/60 bg-[#fff1f5]/30 flex items-center justify-center gap-2.5">
              <button 
                onClick={() => setSelectedMaterial(null)}
                className="px-6 py-2.5 rounded-lg bg-white hover:bg-[#fff1f5] border border-[#f2ccd7] text-xs font-bold text-[#735965] transition-all"
              >
                닫기
              </button>
              <button 
                onClick={() => {
                  setSelectedMaterial(null);
                  simulateDownload(selectedMaterial.title);
                }}
                className="px-6 py-2.5 rounded-lg bg-[#f25f8a] hover:bg-[#df4977] text-white text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <Download size={13} /> 다운로드
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Write New 1:1 Inquiry Modal */}
      {showInquiryModal && (
        <div 
          className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowInquiryModal(false)}
        >
          <div 
            className="w-full max-w-xl bg-white border border-[#f2ccd7] rounded-xl overflow-hidden shadow-lg max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-[#f2ccd7]/60 flex justify-between items-center bg-[#fff1f5]/50">
              <h3 className="text-base font-bold text-[#2d2026]">신규 1:1 가맹상담 문의 접수</h3>
              <button onClick={() => setShowInquiryModal(false)} className="p-1.5 text-[#735965] hover:text-[#f25f8a] bg-white border border-[#f2ccd7] rounded-lg">
                <X size={15} />
              </button>
            </div>

            <form onSubmit={submitInquiry} className="p-6 overflow-y-auto space-y-5 flex-1 text-xs sm:text-sm">
              <div className="flex flex-col gap-2">
                <label className="font-bold text-[#2d2026]">문의 유형 선택</label>
                <select 
                  value={inquiryCategory}
                  onChange={(e) => setInquiryCategory(e.target.value)}
                  className="w-full bg-[#fff1f5] border border-[#f2ccd7] rounded-xl px-4 py-3 text-sm text-[#2d2026] focus:outline-none focus:border-[#f25f8a] cursor-pointer"
                >
                  <option value="물류">물류 배송 / 자재 훼손 오배송 건</option>
                  <option value="기술/AS">조리 타이머 및 집기 AS 수리 접수</option>
                  <option value="마케팅">매장 POP / 캐릭터 시각 홍보 추가 지원</option>
                  <option value="대금/정산">물류 대금 결제 / 가맹 정산 문의</option>
                  <option value="기타">기타 매장 운영 애로사항 접수</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-bold text-[#2d2026]">문의 제목</label>
                <input 
                  type="text"
                  placeholder="예시) 로제 생지 오배송 건 확인 요청"
                  value={inquiryTitle}
                  onChange={(e) => setInquiryTitle(e.target.value)}
                  required
                  className="w-full bg-[#fff1f5] border border-[#f2ccd7] rounded-xl px-4 py-3 text-sm text-[#2d2026] placeholder-[#735965]/50 focus:outline-none focus:border-[#f25f8a]"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-bold text-[#2d2026]">문의 세부 내용</label>
                <textarea 
                  rows={5}
                  placeholder="발생 일시, 품목명, 상황 등을 최대한 상세히 기입해주시면 한층 정밀하고 신속한 AS 및 지원 처리가 가능합니다."
                  value={inquiryContent}
                  onChange={(e) => setInquiryContent(e.target.value)}
                  required
                  className="w-full bg-[#fff1f5] border border-[#f2ccd7] rounded-xl px-4 py-3 text-sm text-[#2d2026] placeholder-[#735965]/50 focus:outline-none focus:border-[#f25f8a] resize-none"
                />
              </div>

              <button 
                type="submit"
                className="w-full py-4 bg-[#f25f8a] hover:bg-[#df4977] text-white font-bold text-sm rounded-xl transition-all shadow-sm mt-2"
              >
                본사 AS 문의 접수하기
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 5. Order Details Modal */}
      {selectedOrder && (
        <div 
          className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedOrder(null)}
        >
          <div 
            className="w-full max-w-2xl bg-white border border-[#f2ccd7] rounded-xl overflow-hidden shadow-lg max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-[#f2ccd7]/60 flex justify-between items-center bg-[#fff1f5]/50">
              <div className="flex-1">
                <h3 className="text-sm sm:text-base font-black text-[#2d2026] flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span>발주 상세 내역</span>
                  <span className="text-[10px] sm:text-xs text-[#735965] font-bold block">강남역삼점 · 발주 코드: <span className="font-mono text-[#bf3e67] font-black">{selectedOrder.id}</span></span>
                </h3>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-1.5 text-[#735965] hover:text-[#f25f8a] bg-white border border-[#f2ccd7] rounded-lg shrink-0 ml-4">
                <X size={15} />
              </button>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              
              {/* Status Timeline */}
              <div className="bg-[#fffdf9] border border-[#f2ccd7] p-5 rounded-2xl">
                <span className="text-[10px] text-[#735965] font-extrabold block mb-3 uppercase tracking-wider">물류 배송 진행 현황</span>
                
                <div className="relative flex items-center justify-between mt-6 px-4">
                  {/* Progress Line */}
                  <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-[3px] bg-[#f2ccd7]/40 z-0"></div>
                  <div 
                    className="absolute left-6 top-1/2 -translate-y-1/2 h-[3px] bg-[#f25f8a] transition-all duration-500 z-0"
                    style={{
                      width: selectedOrder.status === "주문완료" ? "0%" 
                           : selectedOrder.status === "배송준비중" ? "33%" 
                           : selectedOrder.status === "배송중" ? "66%" 
                           : "100%"
                    }}
                  ></div>

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
                            ? "bg-[#f25f8a] border-[#f25f8a] text-white scale-110 shadow-sm"
                            : isPassed 
                            ? "bg-[#ffd3df] border-[#f25f8a] text-[#bf3e67]"
                            : "bg-white border-[#f2ccd7] text-[#735965]"
                        }`}>
                          {isPassed && !isCurrent ? <Check size={10} /> : <span className="text-[9px] font-bold">{idx + 1}</span>}
                        </div>
                        <span className={`text-[10px] font-black mt-2 ${isCurrent ? "text-[#f25f8a]" : "text-[#2d2026]"}`}>{stage.label}</span>
                        <span className="text-[8px] text-[#735965] font-semibold mt-0.5">{stage.desc}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Items Table */}
              <div className="bg-white border border-[#f2ccd7]/70 rounded-2xl overflow-hidden shadow-sm">
                <div className="px-4 py-3 bg-[#fff1f5]/30 border-b border-[#f2ccd7]/50 flex justify-between items-center">
                  <span className="font-extrabold text-[#2d2026]">발주 자재 명세표</span>
                  <span className="text-[10px] text-[#735965] font-bold">신청 일자: {selectedOrder.date}</span>
                </div>
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left border-collapse min-w-[480px] sm:min-w-0" style={{ tableLayout: 'fixed' }}>
                    <colgroup>
                      <col style={{ width: 'auto' }} />
                      <col style={{ width: '50px' }} />
                      <col style={{ width: '72px' }} />
                      <col style={{ width: '82px' }} />
                    </colgroup>
                    <thead>
                      <tr className="bg-[#fff9fb]/60 border-b border-[#f2ccd7]/50 text-[10px] font-bold text-[#735965]">
                        <th className="px-3 py-2.5">품목명</th>
                        <th className="px-2 py-2.5 text-center whitespace-nowrap">수량</th>
                        <th className="px-2 py-2.5 text-right whitespace-nowrap">단가</th>
                        <th className="px-3 py-2.5 text-right whitespace-nowrap">금액</th>
                      </tr>
                    </thead>
                  <tbody className="divide-y divide-[#f2ccd7]/40 text-[11px] font-medium text-[#2d2026]">
                    {selectedOrder.items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-[#fffdf9]/50 transition-colors">
                        <td className="px-3 py-2.5 font-bold text-neutral-800 leading-tight break-words text-[11px] sm:text-xs" style={{ wordBreak: 'break-word' }}>
                          {item.productName}
                        </td>
                        <td className="px-2 py-2.5 text-center font-semibold text-[#2d2026] text-[11px]">{item.quantity}</td>
                        <td className="px-2 py-2.5 text-right font-semibold text-[#735965] text-[11px]">{(item.price).toLocaleString()}</td>
                        <td className="px-3 py-2.5 text-right font-black text-[#bf3e67] text-[11px]">{(item.price * item.quantity).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                  </div>
              </div>

              {/* Payment Summary */}
              <div className="bg-[#fff1f5]/20 border border-[#f2ccd7] rounded-2xl p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] text-[#735965] font-extrabold block">결제 수단 정보</span>
                  <strong className="text-xs text-[#2d2026] block font-bold">본사 가상계좌 예치금 차감 (실시간 정산 완료)</strong>
                </div>
                <div className="text-left sm:text-right border-t sm:border-t-0 border-[#f2ccd7]/60 pt-3 sm:pt-0">
                  <span className="text-[10px] text-[#735965] font-bold block">총 결제 금액 (VAT 포함)</span>
                  <strong className="text-base font-black text-[#bf3e67]">{selectedOrder.totalPrice.toLocaleString()} 원</strong>
                </div>
              </div>

              {/* Delivery Carrier Info */}
              <div className="bg-white border border-[#f2ccd7] rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-[#f2ccd7]/50 pb-3">
                  <span className="font-extrabold text-[#2d2026] flex items-center gap-1.5"><Truck size={14} className="text-[#f25f8a]" /> 배송 및 송장 정보</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    selectedOrder.status === "배송완료" ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                    : selectedOrder.status === "배송중" ? "bg-blue-50 text-blue-500 border border-blue-100"
                    : "bg-orange-50 text-orange-500 border border-orange-100"
                  }`}>{selectedOrder.status}</span>
                </div>

                {["배송중", "배송완료"].includes(selectedOrder.status) ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                    <div className="space-y-1">
                      <span className="text-[10px] text-[#735965] font-extrabold block">배송 수단 / 물류 방식</span>
                      <p className="text-[#2d2026]">120 물류 전용 냉동 저온탑차 (한진택배 위탁)</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-[#735965] font-extrabold block">실시간 송장 번호</span>
                      <p className="font-mono text-[#bf3e67]">HNJ-120-{selectedOrder.id.replace("ORD-", "")}</p>
                    </div>
                    <div className="sm:col-span-2 pt-2 border-t border-[#f2ccd7]/40">
                      <button 
                        type="button"
                        onClick={() => {
                          if (selectedOrder.status === "배송중") {
                            triggerToast("실시간 차량 관제: [경기 광주 저온허브] -> [서울 강남권 지사] 이동 중 (오전 배송 예정)");
                          } else {
                            triggerToast("물류 배송이 정상 완료되었습니다. (인수처: 점주 본인 직접 서명 수령 완료)");
                          }
                        }}
                        className="w-full py-2.5 rounded-xl bg-[#fff1f5] border border-[#f2ccd7] hover:bg-[#ffd3df] hover:border-[#f25f8a] text-xs font-bold text-[#bf3e67] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        배송 위치 실시간 조회하기 <ChevronRight size={13} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs font-bold text-[#735965] leading-relaxed">
                    본사 발주 접수가 정상 처리되었습니다. 현재 물류 창고에서 파이 생지 신선도 보존용 드라이아이스 및 패키징 포장 작업 중입니다. 24시간 이내 저온 정기 배송 차량으로 안전하게 출고 및 발송 조치 예정입니다.
                  </p>
                )}
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-[#f2ccd7]/60 bg-[#fff1f5]/30 text-center">
              <button 
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-8 py-3 rounded-xl bg-white hover:bg-[#fff1f5] border border-[#f2ccd7] text-xs font-extrabold text-[#735965] transition-all cursor-pointer shadow-sm"
              >
                상세내역 창 닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Product Details Modal */}
      {selectedProductDetail && (
        <div 
          className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSelectedProductDetail(null)}
        >
          <div 
            className="w-full max-w-3xl bg-white border border-[#f2ccd7] rounded-xl overflow-hidden shadow-lg max-h-[85vh] flex flex-col animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-[#f2ccd7]/60 flex justify-between items-center bg-[#fff1f5]/50">
              <div className="flex-1">
                <h3 className="text-sm sm:text-base font-black text-[#2d2026] flex items-center gap-2">
                  <span className="bg-[#ffd3df] text-[#bf3e67] text-[10px] font-black px-2 py-0.5 rounded border border-[#f2ccd7]">
                    {selectedProductDetail.category}
                  </span>
                  <span>{selectedProductDetail.name} 상세 정보</span>
                </h3>
              </div>
              <button 
                onClick={() => setSelectedProductDetail(null)} 
                className="p-1.5 text-[#735965] hover:text-[#f25f8a] bg-white border border-[#f2ccd7] rounded-lg shrink-0"
              >
                <X size={15} />
              </button>
            </div>

            <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
              
              {/* Product Core Info: Thumbnail & Spec Table */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                {/* 1. Thumbnail Image */}
                <div className="md:col-span-5 border border-[#f2ccd7] rounded-xl overflow-hidden shadow-sm bg-[#fff1f5]/30 aspect-square flex items-center justify-center relative w-full">
                  <img 
                    src={selectedProductDetail.img} 
                    alt={selectedProductDetail.name} 
                    className="w-full h-full object-cover"
                  />
                  {selectedProductDetail.labels && selectedProductDetail.labels.length > 0 && (
                    <div className="absolute top-4 right-4 flex flex-wrap gap-1 w-fit justify-end">
                      {selectedProductDetail.labels.map((l: string) => {
                        let bgStyle = "bg-neutral-500/90 text-white";
                        if (l === "BEST") bgStyle = "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm font-black";
                        else if (l === "추천") bgStyle = "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-sm font-black";
                        else if (l === "신제품") bgStyle = "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-sm font-black";
                        return (
                          <span key={l} className={`font-bold text-[9px] px-2 py-0.5 rounded shadow-sm ${bgStyle}`}>
                            {l}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 2. Spec Table */}
                <div className="md:col-span-7 bg-white border border-[#f2ccd7] rounded-xl overflow-hidden shadow-sm flex flex-col w-full">
                  <div className="px-4 py-2.5 bg-[#fff1f5]/30 border-b border-[#f2ccd7]/50 shrink-0">
                    <span className="font-extrabold text-[#2d2026]">품목 기본 명세 규격표</span>
                  </div>
                  <table className="w-full text-left border-collapse table-fixed">
                    <tbody className="divide-y divide-[#f2ccd7]/40 text-xs text-[#2d2026]">
                      <tr className="hover:bg-[#fff9fb]/40 transition-colors">
                        <td className="px-4 py-2 bg-[#fff1f5]/20 font-bold text-[#735965] w-[100px]">제품명</td>
                        <td className="px-4 py-2 font-bold text-neutral-800 break-all">{selectedProductDetail.name}</td>
                      </tr>
                      <tr className="hover:bg-[#fff9fb]/40 transition-colors">
                        <td className="px-4 py-2 bg-[#fff1f5]/20 font-bold text-[#735965]">카테고리</td>
                        <td className="px-4 py-2">
                          <span className="bg-[#fff1f5] text-[#bf3e67] text-[10px] font-bold px-2 py-0.5 rounded border border-[#f2ccd7]">
                            {selectedProductDetail.category}
                          </span>
                        </td>
                      </tr>
                      <tr className="hover:bg-[#fff9fb]/40 transition-colors">
                        <td className="px-4 py-2 bg-[#fff1f5]/20 font-bold text-[#735965]">발주 규격</td>
                        <td className="px-4 py-2 font-semibold text-[#f25f8a]">{selectedProductDetail.packSize}</td>
                      </tr>
                      <tr className="hover:bg-[#fff9fb]/40 transition-colors">
                        <td className="px-4 py-2 bg-[#fff1f5]/20 font-bold text-[#735965]">제품 식별코드</td>
                        <td className="px-4 py-2 font-mono font-bold text-[#735965]">{selectedProductDetail.id}</td>
                      </tr>
                      <tr className="hover:bg-[#fff9fb]/40 transition-colors">
                        <td className="px-4 py-2 bg-[#fff1f5]/20 font-bold text-[#735965]">공급 단가</td>
                        <td className="px-4 py-2 font-black text-[#bf3e67]">{selectedProductDetail.price.toLocaleString()} 원</td>
                      </tr>
                      <tr className="hover:bg-[#fff9fb]/40 transition-colors">
                        <td className="px-4 py-2 bg-[#fff1f5]/20 font-bold text-[#735965]">배송 정책</td>
                        <td className="px-4 py-2">
                          {(() => {
                            const type = selectedProductDetail.shippingType || "A";
                            if (type === "free") {
                              return (
                                <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-2.5 py-1 rounded-full border border-emerald-200">
                                  무료 배송
                                </span>
                              );
                            }
                            const feeMap: Record<string, number> = { A: shippingFeeA, B: shippingFeeB, C: shippingFeeC };
                            return (
                              <span className="bg-[#fff1f5] text-[#bf3e67] text-[10px] font-black px-2.5 py-1 rounded-full border border-[#f2ccd7]">
                                {feeMap[type]?.toLocaleString()}원
                              </span>
                            );
                          })()}
                        </td>
                      </tr>
                      <tr className="hover:bg-[#fff9fb]/40 transition-colors">
                        <td className="px-4 py-2 bg-[#fff1f5]/20 font-bold text-[#735965]">품목 정보 설명</td>
                        <td className="px-4 py-2 font-medium text-[#735965] leading-relaxed break-words">{selectedProductDetail.desc || "등록된 상세 설명이 없습니다."}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 3. Detailed Page (If available) */}
              {selectedProductDetail.detailImg && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 border-b border-[#f2ccd7]/60 pb-2">
                    <span className="w-1.5 h-3.5 rounded-full bg-[#f25f8a]"></span>
                    <span className="font-extrabold text-[#2d2026] text-xs sm:text-sm">🔍 제품 상세 정보 안내</span>
                  </div>
                  <div className="border border-[#f2ccd7] rounded-xl overflow-hidden shadow-sm bg-neutral-50 flex items-center justify-center p-2 min-h-[200px]">
                    <img 
                      src={selectedProductDetail.detailImg} 
                      alt={`${selectedProductDetail.name} 상세페이지`} 
                      className="w-full h-auto object-contain rounded-lg"
                    />
                  </div>
                </div>
              )}

              {/* Delivery and Return Policy Pastels Cards */}
              <div className="flex flex-col gap-5">
                
                {/* Delivery policy card */}
                <div className="bg-[#fff9fb] border border-[#f2ccd7] rounded-xl p-6 sm:p-7 space-y-3.5 shadow-sm">
                  <div className="flex items-center gap-2 border-b border-[#f2ccd7]/60 pb-2.5">
                    <Truck size={16} className="text-[#f25f8a]" />
                    <span className="font-extrabold text-[#2d2026] text-sm">🚚 본사 물류 배송 정책</span>
                  </div>
                  <div className="text-xs text-[#735965] font-semibold leading-relaxed space-y-3">
                    <p className="whitespace-pre-line">{shippingPolicy || "본사 물류 전용 저온 냉동 탑차로 안전하게 직배송됩니다."}</p>
                    
                    <div className="pt-3 border-t border-[#f2ccd7]/40">
                      <div className="text-[11px] text-[#bf3e67] font-black flex items-center gap-1.5">
                        <span>💡</span>
                        <span>무료배송 기준: {freeShippingThreshold.toLocaleString()}원 이상 발주 시 전액 무료 (미만 시 본사 규정 배송비 적용)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Return policy card */}
                <div className="bg-[#fffdf9] border border-amber-200 rounded-xl p-6 sm:p-7 space-y-3.5 shadow-sm">
                  <div className="flex items-center gap-2 border-b border-amber-200/60 pb-2.5">
                    <ArrowRightLeft size={16} className="text-amber-500" />
                    <span className="font-extrabold text-[#2d2026] text-sm">🔄 교환 및 반품 규정 안내</span>
                  </div>
                  <div className="text-xs text-[#735965] font-semibold leading-relaxed whitespace-pre-line">
                    {returnPolicy || "식재료 특성상 단순 변심으로 인한 반품은 불가하며, 오배송 건은 수령 즉시 본사 접수 바랍니다."}
                  </div>
                </div>

              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-[#f2ccd7]/60 bg-[#fff1f5]/30 flex justify-between items-center gap-3">
              <span className="text-[11px] font-bold text-[#735965]">
                발주몰 규격을 정밀 점검 후 발주를 신중하게 진행해 주세요.
              </span>
              <button 
                type="button"
                onClick={() => setSelectedProductDetail(null)}
                className="px-6 py-2.5 rounded-xl bg-white hover:bg-[#fff1f5] border border-[#f2ccd7] text-xs font-extrabold text-[#735965] transition-all cursor-pointer shadow-sm"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          REAL-TIME POPUP MODAL (ON-ENTRY)
         ========================================== */}
      {showPopup && popupSettings && (
        <div className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div 
            className="w-full max-w-md bg-white border border-[#f2ccd7] rounded-xl overflow-hidden shadow-2xl flex flex-col relative max-h-[85vh] animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header / Background visual */}
            <div 
              className={`w-full relative flex flex-col justify-end p-6 text-white ${
                popupSettings.image ? "aspect-[4/3]" : "min-h-[160px]"
              } ${
                popupSettings.image ? "" : "bg-gradient-to-tr from-[#bf3e67] to-[#f25f8a]"
              }`}
              style={popupSettings.image ? {
                backgroundImage: `url(${popupSettings.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center"
              } : undefined}
            >
              {popupSettings.image && <div className="absolute inset-x-0 bottom-0 h-[80%] bg-gradient-to-t from-black/95 via-black/60 to-transparent"></div>}
              <div className="relative z-10 space-y-1">
                <h4 
                  className="font-black leading-snug whitespace-pre-line"
                  style={{
                    color: popupSettings.titleColor || "#ffffff",
                    fontSize: popupSettings.titleSize || "18px"
                  }}
                >
                  {popupSettings.title}
                </h4>
              </div>
            </div>

            {/* Body Description */}
            <div 
              className="p-6 overflow-y-auto font-semibold leading-relaxed whitespace-pre-line"
              style={{
                color: popupSettings.descColor || "#735965",
                fontSize: popupSettings.descSize || "12px"
              }}
            >
              {popupSettings.desc}
            </div>

            {/* Action buttons & 'Today close' bar */}
            <div className="border-t border-[#f2ccd7]/60">
              {popupSettings.link && (
                <div className="p-4 border-b border-[#f2ccd7]/40 bg-[#fff1f5]/20 text-center">
                  <button
                    onClick={() => {
                      const link = popupSettings.link;
                      if (link.startsWith("http")) {
                        window.open(link, "_blank");
                      } else {
                        const menuMapping: Record<string, string> = {
                          order: "orders",
                          training: "training",
                          material: "material",
                          inquiry: "inquiry"
                        };
                        setCurrentMenu(menuMapping[link] || "dashboard");
                        setShowPopup(false);
                      }
                    }}
                    className="w-full py-3 font-extrabold rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer"
                    style={{
                      backgroundColor: popupSettings.btnBgColor || "#f25f8a",
                      color: popupSettings.btnTextColor || "#ffffff",
                      fontSize: popupSettings.btnTextSize || "12px"
                    }}
                  >
                    {popupSettings.btnText || "자세히 보기"}
                  </button>
                </div>
              )}

              {/* Close Footer bar */}
              <div className="bg-[#fff9fb] p-3 flex justify-between items-center px-5 text-[11px] font-bold text-[#735965]">
                <button
                  onClick={() => {
                    const todayStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
                    localStorage.setItem("120_popup_closed_date", todayStr);
                    setShowPopup(false);
                  }}
                  className="hover:text-[#bf3e67] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Check size={13} className="text-[#f25f8a]" /> 오늘 하루 안보기
                </button>
                <button
                  onClick={() => setShowPopup(false)}
                  className="hover:text-red-500 font-extrabold transition-colors cursor-pointer"
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
        <div className="fixed right-6 bottom-6 z-[90] flex flex-col items-end gap-3 font-bold text-xs select-none text-white animate-fadeIn">
          {/* Expanded Menu Actions Tray */}
          {floatingOpen && (
            <div className="flex flex-col items-end gap-2.5 mb-1.5 animate-slideUp">
              {/* Instagram */}
              {floatingSettings.instaUrl && (
                <a
                  href={floatingSettings.instaUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[#cf2a7a] hover:bg-[#b01e63] p-2.5 rounded-full flex items-center justify-center text-white shadow-md transition-all scale-100 hover:scale-110 active:scale-95 cursor-pointer relative group border-0"
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
                  className="bg-[#03C75A] hover:bg-[#02b350] p-2.5 rounded-full flex items-center justify-center text-white shadow-md transition-all scale-100 hover:scale-110 active:scale-95 cursor-pointer relative group border-0"
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
                  className="bg-[#ff0000] hover:bg-[#cc0000] p-2.5 rounded-full flex items-center justify-center text-white shadow-md transition-all scale-100 hover:scale-110 active:scale-95 cursor-pointer relative group border-0"
                >
                  <Video size={17} className="!text-white" style={{ color: "#ffffff" }} />
                  <span className="absolute right-12 bg-[#2d2026] text-white text-[9px] font-extrabold px-2 py-1 rounded shadow-sm opacity-0 group-hover:opacity-100 whitespace-nowrap transition-all duration-200">유튜브 채널</span>
                </a>
              )}

              {/* Phone Direct Inquiry */}
              {floatingSettings.phoneNo && (
                <a
                  href={`tel:${floatingSettings.phoneNo}`}
                  className="bg-[#007aff] hover:bg-[#0062cc] p-2.5 rounded-full flex items-center justify-center text-white shadow-md transition-all scale-100 hover:scale-110 active:scale-95 cursor-pointer relative group border-0"
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
                  className="bg-[#fae100] hover:bg-[#e6cf00] p-2.5 rounded-full flex items-center justify-center text-white shadow-md transition-all scale-100 hover:scale-110 active:scale-95 cursor-pointer relative group border border-yellow-400"
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
                  className="bg-[#f25f8a] hover:bg-[#df4977] p-2.5 rounded-full flex items-center justify-center text-white shadow-md transition-all scale-100 hover:scale-110 active:scale-95 cursor-pointer relative group border-0"
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

    </div>
  );
}
