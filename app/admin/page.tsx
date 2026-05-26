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
  Sparkles
} from "lucide-react";

// ==========================================
// TYPES DEFINITIONS
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
  unit: "개" | "박스" | "kg"; // 단위
  qty: number; // 수량
  supplyPrice: number; // 공급가
  price: number; // 판매가
  discountAmount: number; // 할인금액
  discountedPrice: number; // 할인판매가
  img: string; // 썸네일 이미지
  detailImg?: string; // 상세페이지 이미지
  isActive: boolean; // 판매 활성화여부
  desc: string; // 설명
  stock: "in_stock" | "low_stock" | "out_of_stock"; // 재고상태 호환용
}

interface BannerSettings {
  mainTag: string;
  mainTitle: string;
  mainDesc: string;
  sideTag: string;
  sideTitle: string;
  sideDesc: string;
  sideBtnText: string;
}

interface Order {
  id: string;
  date: string;
  items: { productName: string; quantity: number; price: number }[];
  totalPrice: number;
  status: "주문완료" | "배송준비중" | "배송중" | "배송완료";
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
  tag: "필독" | "일반" | "이벤트" | "물류";
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
// INITIAL MOCK DATA SEEDS (FALLBACKS)
// ==========================================
const DEFAULT_STORES: StoreInfo[] = [
  {
    id: "owner",
    pw: "owner",
    pwConfirm: "owner",
    name: "120겹파이 강남역삼점",
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
    name: "120겹파이 홍대입구점",
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
    name: "120겹파이 부산서면점",
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
    img: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779760050/%EB%A1%9C%EC%A0%9C%EB%AF%B8%ED%8A%B8%ED%8C%8C%EC%9D%B4_khogbn.jpg",
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
    img: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779760051/%EC%95%A0%ED%94%8C%ED%8C%8C%EC%9D%B4_yurkh5.jpg",
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
    img: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779760050/%EC%BD%98%EC%B9%98%EC%A6%88%ED%8C%8C%EC%9D%B4_qvb2u5.jpg",
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
    img: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779761729/%EC%98%A4%EB%A6%AC%EC%A7%80%EB%84%90%EA%B3%84%EB%9E%80%EB%B9%B52_kdqsqv.jpg",
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
    img: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779762878/%EC%98%A4%EB%A6%AC%EC%A7%80%EB%84%90_koyjlk.jpg",
    detailImg: "",
    isActive: true,
    desc: "기름 없이 오븐 조리가 가능한 바삭하고 쫀득한 츄러스 전용 냉동 생지",
    stock: "in_stock"
  }
];

const DEFAULT_BANNER: BannerSettings = {
  mainTag: "Seasonal Spec",
  mainTitle: "여름 대비 스페셜 신메뉴\n'망고파이' 물류 정식 공급!",
  mainDesc: "지금 바로 냉동생지를 주문하고, 홍보 자료실에서 매장 포스터 및 아크릴 테이블 텐트 시안을 무상으로 다운로드하여 매출을 강화해 보세요!",
  sideTag: "Standard Edu",
  sideTitle: "점주 전용\n하절기 식품 안전 &\n위생 자가 점검표",
  sideDesc: "하절기 위해 해충 및 냉동 식자재 보관 온도를 사전에 정밀 점검하여 위생 과태료 처분을 방지하세요.",
  sideBtnText: "교육자료 다운로드"
};

export default function AdminPage() {
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
    if (loginId === "admin" && loginPw === "120pie") {
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
  const [notices, setNotices] = useState<Notice[]>([]);
  const [trainings, setTrainings] = useState<Material[]>([]);
  const [prs, setPrs] = useState<Material[]>([]);
  const [banner, setBanner] = useState<BannerSettings>(DEFAULT_BANNER);

  // Selected Detail Modals / Control flags
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [inquiryAnswerText, setInquiryAnswerText] = useState<string>("");

  // Notice Creation Form states
  const [showNoticeModal, setShowNoticeModal] = useState<boolean>(false);
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
  const [addressSearchKeyword, setAddressSearchKeyword] = useState<string>("");
  const [addressSearchResults, setAddressSearchResults] = useState<string[]>([]);

  // 2. PRODUCT MANAGEMENT STATES
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductModal, setShowProductModal] = useState<boolean>(false);

  // Product form fields
  const [productCategory, setProductCategory] = useState<string>("");
  const [productName, setProductName] = useState<string>("");
  const [productModelName, setProductModelName] = useState<string>("");
  const [productUnit, setProductUnit] = useState<"개" | "박스" | "kg">("박스");
  const [productQty, setProductQty] = useState<number>(1);
  const [productSupplyPrice, setProductSupplyPrice] = useState<string>("0");
  const [productPrice, setProductPrice] = useState<string>("0");
  const [productDiscountAmount, setProductDiscountAmount] = useState<string>("0");
  const [productImg, setProductImg] = useState<string>("");
  const [productDetailImg, setProductDetailImg] = useState<string>("");
  const [productIsActive, setProductIsActive] = useState<boolean>(true);

  // Category list settings
  const [showCategoryPanel, setShowCategoryPanel] = useState<boolean>(false);
  const [newCategoryName, setNewCategoryName] = useState<string>("");

  // 3. BANNER CONTROL STATES
  const [bannerMainTag, setBannerMainTag] = useState<string>("");
  const [bannerMainTitle, setBannerMainTitle] = useState<string>("");
  const [bannerMainDesc, setBannerMainDesc] = useState<string>("");
  const [bannerSideTag, setBannerSideTag] = useState<string>("");
  const [bannerSideTitle, setBannerSideTitle] = useState<string>("");
  const [bannerSideDesc, setBannerSideDesc] = useState<string>("");
  const [bannerSideBtnText, setBannerSideBtnText] = useState<string>("");

  // Toast and navigation
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

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

      // Seeds
      const st = loadState("120_stores", DEFAULT_STORES);
      setStores(st);
      const pr = loadState("120_products", DEFAULT_PRODUCTS);
      setProducts(pr);
      const cat = loadState("120_categories", ["냉동생지/자재", "부자재/포장재", "소모품/집기"]);
      setCategories(cat);
      
      const bnr = loadState("120_banners", DEFAULT_BANNER);
      setBanner(bnr);
      
      // Initialize banner form states
      setBannerMainTag(bnr.mainTag);
      setBannerMainTitle(bnr.mainTitle);
      setBannerMainDesc(bnr.mainDesc);
      setBannerSideTag(bnr.sideTag);
      setBannerSideTitle(bnr.sideTitle);
      setBannerSideDesc(bnr.sideDesc);
      setBannerSideBtnText(bnr.sideBtnText);
    }
  }, []);

  // Poll LocalStorage to keep Admin & Partner Portal perfectly synchronized
  useEffect(() => {
    const syncStates = () => {
      if (typeof window !== "undefined") {
        const o = localStorage.getItem("120_orders");
        const i = localStorage.getItem("120_inquiries");
        const n = localStorage.getItem("120_notices");
        const t = localStorage.getItem("120_trainings");
        const p = localStorage.getItem("120_prs");
        
        const st = localStorage.getItem("120_stores");
        const pr = localStorage.getItem("120_products");
        const cat = localStorage.getItem("120_categories");
        const bnr = localStorage.getItem("120_banners");

        if (o) setOrders(JSON.parse(o));
        if (i) setInquiries(JSON.parse(i));
        if (n) setNotices(JSON.parse(n));
        if (t) setTrainings(JSON.parse(t));
        if (p) setPrs(JSON.parse(p));
        
        if (st) setStores(JSON.parse(st));
        if (pr) setProducts(JSON.parse(pr));
        if (cat) setCategories(JSON.parse(cat));
        if (bnr) setBanner(JSON.parse(bnr));
      }
    };

    const interval = setInterval(syncStates, 1500);
    return () => clearInterval(interval);
  }, []);

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
    triggerToast(`주문 상태가 [${nextStatus}]로 변경되었습니다.`);
  };

  // ==========================================
  // NOTICE ACTIONS: Add & Delete
  // ==========================================
  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoticeTitle || !newNoticeContent) {
      alert("제목과 내용을 채워주세요.");
      return;
    }

    const newNotice: Notice = {
      id: `NOT-${Math.floor(100 + Math.random() * 900)}`,
      tag: newNoticeTag,
      title: newNoticeTitle,
      date: new Date().toISOString().split("T")[0],
      views: 0,
      content: newNoticeContent
    };

    const updatedNotices = [newNotice, ...notices];
    setNotices(updatedNotices);
    localStorage.setItem("120_notices", JSON.stringify(updatedNotices));

    setNewNoticeTitle("");
    setNewNoticeContent("");
    setShowNoticeModal(false);
    triggerToast("신규 공지사항이 정식 배포되었습니다!");
  };

  const handleDeleteNotice = (id: string) => {
    if (confirm("정말 이 공지사항을 삭제하시겠습니까?")) {
      const updated = notices.filter((n) => n.id !== id);
      setNotices(updated);
      localStorage.setItem("120_notices", JSON.stringify(updated));
      triggerToast("공지사항이 정상적으로 삭제되었습니다.");
    }
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

    const updatedInquiries = inquiries.map((inq) => 
      inq.id === selectedInquiry.id 
        ? { ...inq, status: "답변완료" as const, answer: inquiryAnswerText } 
        : inq
    );

    setInquiries(updatedInquiries);
    localStorage.setItem("120_inquiries", JSON.stringify(updatedInquiries));
    
    setSelectedInquiry(null);
    setInquiryAnswerText("");
    triggerToast("가맹점 문의 답변 등록이 정상 완료되었습니다!");
  };

  // ==========================================
  // MATERIALS & PR ACTIONS: Add & Delete
  // ==========================================
  const handleCreateMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMaterialTitle || !newMaterialDesc) {
      alert("제목과 설명을 입력해 주세요.");
      return;
    }

    const newMat: Material = {
      id: `${materialType === "training" ? "TRN" : "PR"}-${Math.floor(100 + Math.random() * 900)}`,
      title: newMaterialTitle,
      date: new Date().toISOString().split("T")[0],
      size: newMaterialSize,
      format: newMaterialFormat,
      desc: newMaterialDesc,
      img: newMaterialImg || undefined
    };

    if (materialType === "training") {
      const updated = [newMat, ...trainings];
      setTrainings(updated);
      localStorage.setItem("120_trainings", JSON.stringify(updated));
    } else {
      const updated = [newMat, ...prs];
      setPrs(updated);
      localStorage.setItem("120_prs", JSON.stringify(updated));
    }

    setNewMaterialTitle("");
    setNewMaterialDesc("");
    setNewMaterialImg("");
    setShowMaterialModal(false);
    triggerToast(`신규 ${materialType === "training" ? "교육" : "홍보"}자료가 성공적으로 등록되었습니다!`);
  };

  const handleDeleteMaterial = (id: string, type: "training" | "pr") => {
    if (confirm("정말 이 자료를 영구 삭제하시겠습니까?")) {
      if (type === "training") {
        const updated = trainings.filter((t) => t.id !== id);
        setTrainings(updated);
        localStorage.setItem("120_trainings", JSON.stringify(updated));
      } else {
        const updated = prs.filter((p) => p.id !== id);
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

    setStores(updatedStores);
    localStorage.setItem("120_stores", JSON.stringify(updatedStores));
    setShowStoreModal(false);
  };

  // Delete a store
  const handleDeleteStore = (storeId: string) => {
    if (confirm("정말 이 가맹점 정보를 삭제하시겠습니까? 관련 데이터가 초기화됩니다.")) {
      const updated = stores.filter((s) => s.id !== storeId);
      setStores(updated);
      localStorage.setItem("120_stores", JSON.stringify(updated));
      triggerToast("가맹점 정보가 삭제되었습니다.");
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
      setProductSupplyPrice(prod.supplyPrice.toLocaleString());
      setProductPrice(prod.price.toLocaleString());
      setProductDiscountAmount(prod.discountAmount.toLocaleString());
      setProductImg(prod.img);
      setProductDetailImg(prod.detailImg || "");
      setProductIsActive(prod.isActive);
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
      setProductIsActive(true);
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
      isActive: productIsActive,
      desc: `${productModelName} - ${productCategory} 표준 규격`,
      stock: "in_stock"
    };

    let updatedProducts: Product[];
    if (selectedProduct) {
      updatedProducts = products.map((p) => (p.id === selectedProduct.id ? productData : p));
      triggerToast(`'${productName}' 제품이 정상 수정되었습니다.`);
    } else {
      updatedProducts = [...products, productData];
      triggerToast(`신규 제품 '${productName}'이 성공적으로 등록되었습니다.`);
    }

    setProducts(updatedProducts);
    localStorage.setItem("120_products", JSON.stringify(updatedProducts));
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
      triggerToast("제품이 삭제 처리되었습니다.");
    }
  };

  // Adjust product order (swap ▲ / ▼)
  const handleAdjustProductOrder = (currentIndex: number, direction: "up" | "down") => {
    const sorted = [...products].sort((a, b) => a.orderIndex - b.orderIndex);
    const targetIdx = direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (targetIdx < 0 || targetIdx >= sorted.length) return; // Out of bounds

    // Swap indexes
    const tempIndex = sorted[currentIndex].orderIndex;
    sorted[currentIndex].orderIndex = sorted[targetIdx].orderIndex;
    sorted[targetIdx].orderIndex = tempIndex;

    const updated = sorted.sort((a, b) => a.orderIndex - b.orderIndex);
    setProducts(updated);
    localStorage.setItem("120_products", JSON.stringify(updated));
    triggerToast("제품 전시 순서가 실시간으로 재정렬되었습니다.");
  };

  // ==========================================
  // 3. CATEGORY CONTROL HANDLERS
  // ==========================================
  const handleAddCategory = (e: React.FormEvent) => {
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
  };

  const handleDeleteCategory = (catName: string) => {
    if (products.some((p) => p.category === catName)) {
      alert(`이 카테고리('${catName}')에 소속된 제품이 존재하므로 삭제할 수 없습니다. 관련 제품의 카테고리를 먼저 변경해 주십시오.`);
      return;
    }
    if (confirm(`정말 '${catName}' 카테고리를 삭제하시겠습니까?`)) {
      const updated = categories.filter((c) => c !== catName);
      setCategories(updated);
      localStorage.setItem("120_categories", JSON.stringify(updated));
      triggerToast("카테고리가 삭제되었습니다.");
    }
  };

  // ==========================================
  // 4. DYNAMIC BANNER CONTROL HANDLER
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
      sideBtnText: bannerSideBtnText
    };
    
    setBanner(updatedBanner);
    localStorage.setItem("120_banners", JSON.stringify(updatedBanner));
    triggerToast("본사 대시보드 배너 설정이 실시간으로 동기화 저장되었습니다!");
  };

  // Admin stats
  const pendingInquiriesCount = inquiries.filter((i) => i.status === "답변대기").length;
  const incomingOrdersCount = orders.filter((o) => o.status === "주문완료").length;

  if (checkingAuth) {
    return (
      <div className="h-screen bg-[#fff9fb] flex items-center justify-center font-bold text-[#bf3e67]">
        인증 상태 확인 중...
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="h-screen w-screen bg-[#fff9fb] text-[#2d2026] flex flex-col font-sans select-none antialiased justify-center items-center p-4">
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
                src="https://res.cloudinary.com/dx7l09wwu/image/upload/v1779713831/120%EA%B2%B9%ED%8C%8C%EC%9D%B4_%EC%9B%90%ED%98%95%EB%A1%9C%EA%B3%A02_nu_o4omab.png"
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

          <div className="bg-[#fff1f5] border border-[#f2ccd7] rounded-xl p-4 text-center text-[10px] space-y-1">
            <span className="font-extrabold text-[#bf3e67] block">📢 임시 테스트 계정 안내</span>
            <p className="text-[#735965] font-bold">아이디: <code className="bg-white border border-[#f2ccd7] px-1.5 py-0.5 rounded font-extrabold text-[#f25f8a]">admin</code> / 비밀번호: <code className="bg-white border border-[#f2ccd7] px-1.5 py-0.5 rounded font-extrabold text-[#f25f8a]">120pie</code></p>
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
    <div className="h-screen overflow-hidden bg-[#fff9fb] text-[#2d2026] flex flex-col font-sans select-none antialiased">
      
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
            <Link href="/admin" className="flex items-center gap-2.5 font-black text-lg text-[#2d2026]">
              <img
                src="https://res.cloudinary.com/dx7l09wwu/image/upload/v1779713831/120%EA%B2%B9%ED%8C%8C%EC%9D%B4_%EC%9B%90%ED%98%95%EB%A1%9C%EA%B3%A02_nu_o4omab.png"
                alt="로고"
                className="w-8 h-8 object-contain"
              />
              <span>120pie <span className="text-[#f25f8a]">Head Office</span></span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-50 text-red-500 border border-red-200 font-bold ml-1">본사 어드민</span>
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
        <aside className="w-64 border-r border-[#f2ccd7] p-6 flex flex-col justify-between hidden lg:flex bg-[#fff1f5] shrink-0">
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
                { key: "product", label: "제품 관리", icon: Package },
                { key: "order", label: "주문/배송 관리", icon: ShoppingBag, badge: incomingOrdersCount > 0 ? incomingOrdersCount : undefined },
                { key: "notice", label: "공지사항 관리", icon: Megaphone },
                { key: "inquiry", label: "1:1 문의 관리", icon: MessageSquare, badge: pendingInquiriesCount > 0 ? pendingInquiriesCount : undefined },
                { key: "material", label: "교육/홍보물 관리", icon: BookOpen },
                { key: "banner", label: "배너 관리", icon: ImageIcon }
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
            <div className="w-72 bg-white border-r border-[#f2ccd7] h-full p-6 flex flex-col justify-between" onClick={(e) => e.stopPropagation()}>
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-[#f2ccd7] pb-4">
                  <div className="flex items-center gap-2">
                    <img
                      src="https://res.cloudinary.com/dx7l09wwu/image/upload/v1779713831/120%EA%B2%B9%ED%8C%8C%EC%9D%B4_%EC%9B%90%ED%98%95%EB%A1%9C%EA%B3%A02_nu_o4omab.png"
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
                    { key: "product", label: "제품 관리", icon: Package },
                    { key: "order", label: "주문/배송 관리", icon: ShoppingBag, badge: incomingOrdersCount > 0 ? incomingOrdersCount : undefined },
                    { key: "notice", label: "공지사항 관리", icon: Megaphone },
                    { key: "inquiry", label: "1:1 문의 관리", icon: MessageSquare, badge: pendingInquiriesCount > 0 ? pendingInquiriesCount : undefined },
                    { key: "material", label: "교육/홍보물 관리", icon: BookOpen },
                    { key: "banner", label: "배너 관리", icon: ImageIcon }
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <table className="w-full text-left border-collapse">
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
                            <td className="p-4 sm:p-5 font-bold text-[#bf3e67]">{store.id}</td>
                            <td className="p-4 sm:p-5 font-bold text-[#2d2026]">{store.name}</td>
                            <td className="p-4 sm:p-5 text-[#735965] font-semibold">{store.owner}</td>
                            <td className="p-4 sm:p-5 text-[#735965] font-semibold">{store.phone}</td>
                            <td className="p-4 sm:p-5 text-[#735965] font-semibold max-w-xs truncate" title={store.roadAddress}>
                              {store.roadAddress}
                            </td>
                            <td className="p-4 sm:p-5">
                              <div className="flex flex-wrap gap-1">
                                {store.adoptionMenu && store.adoptionMenu.map((m) => (
                                  <span key={m} className="bg-[#ffd3df] text-[#bf3e67] text-[9px] font-bold px-1.5 py-0.5 rounded border border-[#f2ccd7]">
                                    {m}
                                  </span>
                                ))}
                                {(!store.adoptionMenu || store.adoptionMenu.length === 0) && (
                                  <span className="text-[10px] text-[#735965] opacity-50">없음</span>
                                )}
                              </div>
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
                            <td className="p-4 sm:p-5 text-center">
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
                    onClick={() => setShowCategoryPanel(!showCategoryPanel)}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-3 bg-white border border-[#f2ccd7] hover:bg-[#fff9fb] text-[#bf3e67] text-xs font-bold rounded-lg transition-all shadow-sm"
                  >
                    카테고리 관리
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
                  <div className="flex flex-wrap gap-2 pt-2">
                    {categories.map((catName) => (
                      <span 
                        key={catName} 
                        className="inline-flex items-center gap-1.5 bg-[#fff1f5] border border-[#f2ccd7] text-[#bf3e67] px-3 py-1.5 rounded-lg text-xs font-bold"
                      >
                        {catName}
                        <button 
                          type="button"
                          onClick={() => handleDeleteCategory(catName)}
                          className="hover:text-red-500 text-[#735965] transition-colors font-extrabold ml-0.5"
                          title="삭제"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

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
                      {products.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="p-8 text-center text-[#735965]">등록된 자재 제품이 존재하지 않습니다.</td>
                        </tr>
                      ) : (
                        products.map((p, idx) => (
                          <tr key={p.id} className="hover:bg-[#fff9fb] transition-colors">
                            <td className="p-4 sm:p-5 text-center font-bold text-[#bf3e67]">{p.orderIndex}</td>
                            <td className="p-4 sm:p-5">
                              <img src={p.img} alt="" className="w-10 h-10 rounded-lg object-cover bg-[#fff1f5]" />
                            </td>
                            <td className="p-4 sm:p-5">
                              <span className="bg-[#ffd3df] text-[#bf3e67] font-bold px-2 py-0.5 rounded text-[10px] border border-[#f2ccd7]">
                                {p.category}
                              </span>
                            </td>
                            <td className="p-4 sm:p-5">
                              <div className="font-bold text-[#2d2026] text-xs">{p.name}</div>
                              <div className="text-[10px] text-[#735965] font-semibold mt-0.5">{p.modelName} ({p.qty}{p.unit})</div>
                            </td>
                            <td className="p-4 sm:p-5 text-[#735965] font-bold">{p.supplyPrice.toLocaleString()} 원</td>
                            <td className="p-4 sm:p-5">
                              <div className="text-[#2d2026] font-extrabold line-through text-[10px] opacity-60">{p.price.toLocaleString()} 원</div>
                              <div className="text-[#f25f8a] font-black text-xs">{p.discountedPrice.toLocaleString()} 원</div>
                            </td>
                            <td className="p-4 sm:p-5">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                p.isActive 
                                  ? "bg-emerald-50 text-emerald-600 border border-emerald-200" 
                                  : "bg-neutral-100 text-neutral-500 border border-neutral-200"
                              }`}>
                                {p.isActive ? "판매중" : "판매중지"}
                              </span>
                            </td>
                            <td className="p-4 sm:p-5 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleAdjustProductOrder(idx, "up")}
                                  disabled={idx === 0}
                                  className="p-1 rounded bg-white hover:bg-[#fff1f5] border border-[#f2ccd7] disabled:opacity-35 disabled:hover:bg-white text-[#735965] font-bold transition-all text-[9px]"
                                  title="순서 위로"
                                >
                                  ▲
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleAdjustProductOrder(idx, "down")}
                                  disabled={idx === products.length - 1}
                                  className="p-1 rounded bg-white hover:bg-[#fff1f5] border border-[#f2ccd7] disabled:opacity-35 disabled:hover:bg-white text-[#735965] font-bold transition-all text-[9px]"
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
              
              <div>
                <h2 className="text-xl font-bold text-[#2d2026]">전체 가맹점 발주 주문 관리</h2>
                <p className="text-xs text-[#735965] font-bold mt-1">가맹점들이 신청한 원자재 발주 요청을 실시간 승인하고 배송 단계를 신속히 제어합니다.</p>
              </div>

              <div className="bg-white border border-[#f2ccd7] rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#fff1f5] border-b border-[#f2ccd7] text-[11px] font-bold text-[#735965] uppercase tracking-wider">
                        <th className="p-4 sm:p-5">발주 코드</th>
                        <th className="p-4 sm:p-5">가맹점</th>
                        <th className="p-4 sm:p-5">주문 일자</th>
                        <th className="p-4 sm:p-5">요약 품목 / 수량</th>
                        <th className="p-4 sm:p-5">결제 금액</th>
                        <th className="p-4 sm:p-5">현재 상태</th>
                        <th className="p-4 sm:p-5 text-center">배송 상태 제어</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f2ccd7]/60 text-xs">
                      {orders.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-[#735965]">현재 접수된 가맹점 발주 주문이 존재하지 않습니다.</td>
                        </tr>
                      ) : (
                        orders.map((order) => (
                          <tr key={order.id} className="hover:bg-[#fff9fb] transition-colors">
                            <td className="p-4 sm:p-5 font-bold text-[#bf3e67]">{order.id}</td>
                            <td className="p-4 sm:p-5 font-bold text-[#2d2026]">강남역삼점</td>
                            <td className="p-4 sm:p-5 text-[#735965] font-semibold">{order.date}</td>
                            <td className="p-4 sm:p-5">
                              <span className="font-bold text-[#2d2026]">
                                {order.items[0].productName} {order.items.length > 1 ? `외 ${order.items.length - 1}건` : ""}
                              </span>
                              <span className="text-[10px] text-[#735965] block font-semibold mt-0.5">
                                {order.items.map(item => `${item.productName} ${item.quantity}개`).join(", ")}
                              </span>
                            </td>
                            <td className="p-4 sm:p-5 font-bold text-[#2d2026]">{order.totalPrice.toLocaleString()} 원</td>
                            <td className="p-4 sm:p-5">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold ${
                                order.status === "배송중" 
                                  ? "bg-blue-50 text-blue-500 border border-blue-200" 
                                  : order.status === "배송완료" 
                                  ? "bg-emerald-50 text-emerald-600 border border-emerald-200" 
                                  : "bg-[#ffd3df] text-[#bf3e67] border border-[#f2ccd7]"
                              }`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="p-4 sm:p-5 text-center">
                              {order.status === "배송완료" ? (
                                <span className="text-[#735965] font-semibold text-xs">배송처리완료</span>
                              ) : (
                                <button
                                  onClick={() => advanceOrderStatus(order.id, order.status)}
                                  className="px-3.5 py-1.5 rounded-lg bg-[#f25f8a] hover:bg-[#df4977] text-white font-bold text-xs transition-all shadow-sm flex items-center justify-center gap-1 mx-auto"
                                >
                                  {order.status === "주문완료" && <span>배송준비 승인 ➔</span>}
                                  {order.status === "배송준비중" && <span>배송출고 처리 ➔</span>}
                                  {order.status === "배송중" && <span>배송완료 완료 ➔</span>}
                                </button>
                              )}
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
                            <td className="p-4 sm:p-5 font-bold text-[#2d2026] max-w-xs truncate">{n.title}</td>
                            <td className="p-4 sm:p-5 text-[#735965] font-semibold">{n.date}</td>
                            <td className="p-4 sm:p-5 font-bold text-[#735965]">{n.views} 회</td>
                            <td className="p-4 sm:p-5 text-center">
                              <button
                                onClick={() => handleDeleteNotice(n.id)}
                                className="p-1.5 rounded-lg border border-[#f2ccd7] bg-white hover:bg-[#fff1f5] text-red-500 hover:border-red-300 transition-all text-xs"
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
                          <span className="text-xs font-semibold text-[#735965]">접수번호: {inq.id} · 신청점포: 강남역삼점 ({inq.date})</span>
                        </div>
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          inq.status === "답변완료" 
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-200" 
                            : "bg-[#ffd3df] text-[#bf3e67] border border-[#f2ccd7]"
                        }`}>
                          {inq.status}
                        </span>
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
            <div className="space-y-6 animate-fadeIn">
              
              <div>
                <h2 className="text-xl font-bold text-[#2d2026]">가맹점 대시보드 실시간 배너 관리</h2>
                <p className="text-xs text-[#735965] font-bold mt-1">
                  점주전용 포털의 홈 대시보드 배너(메인 가로 배너 16:8 및 우측 사각배너 1:1)의 헤드라인 및 내용을 어드민에서 실시간으로 정밀 통제합니다.
                </p>
              </div>

              <form onSubmit={handleUpdateBanners} className="bg-white border border-[#f2ccd7] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                
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
            </div>
          )}

        </main>
      </div>

      {/* ==========================================
          MODALS & FORM POPUPS
         ========================================== */}

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
          onClick={() => setShowNoticeModal(false)}
        >
          <div 
            className="w-full max-w-xl bg-white border border-[#f2ccd7] rounded-3xl overflow-hidden shadow-lg max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-[#f2ccd7]/60 flex justify-between items-center bg-[#fff1f5]/50">
              <h3 className="text-base font-bold text-[#2d2026]">신규 가맹 공지사항 정식 작성</h3>
              <button onClick={() => setShowNoticeModal(false)} className="p-1.5 text-[#735965] hover:text-[#f25f8a] bg-white border border-[#f2ccd7] rounded-lg">
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
                공지사항 공식 배포하기 📢
              </button>
            </form>
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
                    placeholder="도로명 주소 (우측 '주소 검색' 버튼을 클릭해 주세요)"
                    value={storeRoadAddress}
                    readOnly
                    required
                    className="flex-1 bg-neutral-50 border border-[#f2ccd7] rounded-xl px-4 py-3 text-xs text-[#2d2026] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setAddressSearchKeyword("");
                      setAddressSearchResults([]);
                      setShowAddressPopup(true);
                    }}
                    className="px-4 py-3 bg-[#bf3e67] hover:bg-[#a63053] text-white text-xs font-bold rounded-xl transition-all"
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
              >
                {selectedStore ? "가맹점 상세 정보 수정 저장" : "신규 가맹 계약 지점 공식 등록"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 4. Address Popup Simulator Modal */}
      {showAddressPopup && (
        <div 
          className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setShowAddressPopup(false)}
        >
          <div 
            className="w-full max-w-md bg-white border border-[#f2ccd7] rounded-3xl overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-[#f2ccd7]/60 flex justify-between items-center bg-[#fff1f5]/80">
              <h4 className="text-sm font-bold text-[#2d2026]">도로명 주소 실시간 검색 시뮬레이터</h4>
              <button onClick={() => setShowAddressPopup(false)} className="p-1.5 text-[#735965] hover:text-[#f25f8a] bg-white border border-[#f2ccd7] rounded-lg">
                <X size={13} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <p className="text-[11px] text-[#735965] font-semibold leading-relaxed">
                가맹본부 제공 정식 도로명 주소를 모의 검색해 볼 수 있습니다. (예시: '군포', '역삼', '동교', '부산' 등)
              </p>
              
              <div className="flex gap-2">
                <input 
                  type="text"
                  placeholder="도로명이나 건물명을 검색해 보세요"
                  value={addressSearchKeyword}
                  onChange={(e) => handleAddressSearch(e.target.value)}
                  className="flex-1 bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-3 py-2.5 text-xs text-[#2d2026] focus:outline-none"
                />
              </div>

              {/* Candidates list */}
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {addressSearchResults.length === 0 ? (
                  <p className="text-[11px] text-[#735965] opacity-50 py-8 text-center font-bold">검색 결과가 존재하지 않습니다.</p>
                ) : (
                  addressSearchResults.map((addr) => (
                    <button
                      key={addr}
                      type="button"
                      onClick={() => {
                        setStoreRoadAddress(addr);
                        setShowAddressPopup(false);
                        triggerToast("도로명 주소가 선택되어 자동 입력되었습니다.");
                      }}
                      className="w-full text-left p-3 rounded-xl border border-[#f2ccd7] hover:border-[#f25f8a] hover:bg-[#fff9fb] text-xs font-semibold text-[#2d2026] transition-colors leading-relaxed block"
                    >
                      {addr}
                    </button>
                  ))
                )}
              </div>
            </div>
            
            <div className="p-4 bg-neutral-50 text-center border-t border-[#f2ccd7]/60">
              <button 
                onClick={() => setShowAddressPopup(false)}
                className="px-5 py-2 rounded-lg bg-white border border-[#f2ccd7] text-[11px] font-bold text-[#735965]"
              >
                닫기
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
                <div className="flex items-center gap-2 pt-6 pl-4 select-none">
                  <input 
                    type="checkbox"
                    id="productIsActive"
                    checked={productIsActive}
                    onChange={(e) => setProductIsActive(e.target.checked)}
                    className="w-4 h-4 rounded text-[#f25f8a] border-[#f2ccd7] focus:ring-[#f25f8a]"
                  />
                  <label htmlFor="productIsActive" className="text-xs font-bold text-[#2d2026] cursor-pointer">
                    해당 품목 가맹점 즉시 주문 가능 여부 활성화
                  </label>
                </div>
              </div>

              {/* Image url links with quick presets */}
              <div className="space-y-3">
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-[#2d2026]">썸네일 대표 이미지 주소 *</label>
                  <input 
                    type="text"
                    placeholder="https://res.cloudinary.com/... 이미지 경로"
                    value={productImg}
                    onChange={(e) => setProductImg(e.target.value)}
                    required
                    className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-4 py-3 text-xs text-[#2d2026] focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-[#2d2026]">상세 상세페이지 이미지 주소 (옵션)</label>
                  <input 
                    type="text"
                    placeholder="https://res.cloudinary.com/... 이미지 상세 경로"
                    value={productDetailImg}
                    onChange={(e) => setProductDetailImg(e.target.value)}
                    className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-4 py-3 text-xs text-[#2d2026] focus:outline-none"
                  />
                </div>
                
                {/* Quick Presets */}
                <div className="space-y-1.5 bg-[#fff1f5]/50 border border-[#f2ccd7] p-4 rounded-xl">
                  <span className="text-[10px] text-[#735965] font-extrabold block">✨ 이미지 주소 퀵 프리셋 버튼 (클릭 시 자동 입력)</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {[
                      { name: "로제미트", url: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779760050/%EB%A1%9C%EC%A0%9C%EB%AF%B8%ED%8A%B8%ED%8C%8C%EC%9D%B4_khogbn.jpg" },
                      { name: "콘치즈", url: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779760050/%EC%BD%98%EC%B9%98%EC%A6%88%ED%8C%8C%EC%9D%B4_qvb2u5.jpg" },
                      { name: "계란빵믹스", url: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779761729/%EC%98%A4%EB%A6%AC%EC%A7%80%EB%84%90%EA%B3%84%EB%9E%80%EB%B9%B52_kdqsqv.jpg" },
                      { name: "츄러스생지", url: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779762878/%EC%98%A4%EB%A6%AC%EC%A7%80%EB%84%90_koyjlk.jpg" }
                    ].map((preset) => (
                      <button
                        type="button"
                        key={preset.name}
                        onClick={() => setProductImg(preset.url)}
                        className="px-2 py-1 bg-white hover:bg-[#ffd3df] border border-[#f2ccd7] rounded text-[10px] font-bold text-[#bf3e67] transition-all"
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>
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

    </div>
  );
}
