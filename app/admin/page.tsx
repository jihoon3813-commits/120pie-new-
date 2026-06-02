"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
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
  Map
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
  labels?: string[]; // 라벨 (e.g. ["BEST", "추천", "신제품"])
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

export default function AdminPage() {
  // Convex Hooks
  const convexPopup = useQuery(api.popups.get);
  const convexFloating = useQuery(api.floatings.get);
  const convexInquiries = useQuery(api.inquiries.list);
  const convexGallery = useQuery(api.gallery.list);

  const updatePopupMutation = useMutation(api.popups.update);
  const updateFloatingMutation = useMutation(api.floatings.update);
  const addGalleryItemMutation = useMutation(api.gallery.add);
  const removeGalleryItemMutation = useMutation(api.gallery.remove);
  const updateOrderMutation = useMutation(api.gallery.updateOrder);
  const toggleFeaturedMutation = useMutation(api.gallery.toggleFeatured);
  const convexGalleryCategories = useQuery(api.gallery.getCategories);
  const updateCategoriesMutation = useMutation(api.gallery.updateCategories);

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
    if (convexInquiries) {
      setInquiries(convexInquiries);
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
  const [notices, setNotices] = useState<Notice[]>([]);
  const [trainings, setTrainings] = useState<Material[]>([]);
  const [prs, setPrs] = useState<Material[]>([]);
  const [banner, setBanner] = useState<BannerSettings>(DEFAULT_BANNER);

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

  // Label management states
  const [labels, setLabels] = useState<string[]>([]);
  const [newLabelName, setNewLabelName] = useState<string>("");
  const [showLabelPanel, setShowLabelPanel] = useState<boolean>(false);
  const [productLabels, setProductLabels] = useState<string[]>([]);

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
  const [bannerSubMenu, setBannerSubMenu] = useState<"banner" | "popup" | "floating">("banner");
  
  // Popup States
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
  
  // Settings & Status Management States
  const [deliveryStatuses, setDeliveryStatuses] = useState<string[]>(["주문완료", "배송준비중", "배송중", "배송완료"]);
  const [newStatusName, setNewStatusName] = useState<string>("");
  const [adminIdSetting, setAdminIdSetting] = useState<string>("admin");
  const [adminPwSetting, setAdminPwSetting] = useState<string>("");
  const [adminPwSettingConfirm, setAdminPwSettingConfirm] = useState<string>("");
  const [kakaoMapKeySetting, setKakaoMapKeySetting] = useState<string>("");

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

      // Settings and Status Load
      const ds = loadState("120_delivery_statuses", ["주문완료", "배송준비중", "배송중", "배송완료"]);
      setDeliveryStatuses(ds);
      const storedAdminId = localStorage.getItem("120_admin_id") || "admin";
      setAdminIdSetting(storedAdminId);
      const storedKakaoKey = localStorage.getItem("120_kakao_api_key") || "";
      setKakaoMapKeySetting(storedKakaoKey);

      // Seeds
      const st = loadState("120_stores", DEFAULT_STORES);
      setStores(st);
      const pr = loadState("120_products", DEFAULT_PRODUCTS);
      setProducts(pr);
      const cat = loadState("120_categories", ["냉동생지/자재", "부자재/포장재", "소모품/집기"]);
      setCategories(cat);
      const lab = loadState("120_labels", ["BEST", "추천", "신제품"]);
      setLabels(lab);
      
      const bnr = loadState("120_banners", DEFAULT_BANNER);
      setBanner(bnr);

      const pop = loadState("120_popups", DEFAULT_POPUP);
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

      const flt = loadState("120_floatings", DEFAULT_FLOATING);
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

        const lab = localStorage.getItem("120_labels");
        if (lab) setLabels(JSON.parse(lab));

        const ds = localStorage.getItem("120_delivery_statuses");
        if (ds) setDeliveryStatuses(JSON.parse(ds));
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
      setProductLabels(prod.labels || []);
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
      setProductLabels([]);
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
      stock: "in_stock",
      labels: productLabels
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

  const handleAdjustCategoryOrder = (index: number, direction: "up" | "down") => {
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

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
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
      mainImage: bannerMainImage,
      sideImage: bannerSideImage,
      sideLink: bannerSideLink
    };
    
    setBanner(updatedBanner);
    try {
      localStorage.setItem("120_banners", JSON.stringify(updatedBanner));
      triggerToast("본사 대시보드 배너 설정이 실시간으로 동기화 저장되었습니다!");
    } catch (err) {
      console.error(err);
      alert("배너 설정 저장 중 오류가 발생했습니다. 이미지 용량을 줄이거나 다른 이미지를 사용해 주세요.");
    }
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

  const handleUpdatePopup = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedPopup: PopupSettings = {
      isActive: popupActive,
      title: popupTitle,
      desc: popupDesc,
      image: popupImage,
      link: popupLink,
      btnText: popupBtnText,
      titleColor: popupTitleColor,
      titleSize: popupTitleSize,
      descColor: popupDescColor,
      descSize: popupDescSize,
      btnBgColor: popupBtnBgColor,
      btnTextColor: popupBtnTextColor,
      btnTextSize: popupBtnTextSize
    };
    try {
      localStorage.setItem("120_popups", JSON.stringify(updatedPopup));
      await updatePopupMutation(updatedPopup);
      if (popupActive) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("120_popup_closed_date");
          localStorage.removeItem("120_popup_closed_title");
          sessionStorage.removeItem("120_popup_closed_session");
        }
      }
      triggerToast("실시간 점주 공지 팝업 설정이 성공적으로 저장 및 배포되었습니다!");
    } catch (err) {
      console.error(err);
      alert("팝업 저장 오류: 브라우저 용량 제한을 초과했습니다. 이미지 파일 크기를 줄이거나 URL 방식 또는 다른 이미지를 지정해 주세요.");
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

  const handleUpdateKakaoMapKey = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("120_kakao_api_key", kakaoMapKeySetting.trim());
    triggerToast("카카오맵 API 설정이 성공적으로 저장되었습니다!");
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
          const compressed = await compressImage(reader.result, 1200, 1200, 0.7);
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
    setShowOrderModal(true);
  };

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    const updatedOrders = orders.map((o) => 
      o.id === orderId ? { ...o, status: newStatus as any } : o
    );

    setOrders(updatedOrders);
    localStorage.setItem("120_orders", JSON.stringify(updatedOrders));
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
      <div id="admin-portal" className="h-screen w-screen bg-[#fff9fb] text-[#2d2026] flex flex-col font-sans select-none antialiased justify-center items-center p-4">
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
    <div id="admin-portal" className="h-screen overflow-hidden bg-[#fff9fb] text-[#2d2026] flex flex-col font-sans select-none antialiased">
      
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
            <div className="w-72 bg-white border-r border-[#f2ccd7] h-full p-6 flex flex-col justify-between" onClick={(e) => e.stopPropagation()}>
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-[#f2ccd7] pb-4">
                  <div className="flex items-center gap-2">
                    <img
                      src="https://res.cloudinary.com/dx7l09wwu/image/upload/v1780326442/logo_120pie_coffee_nu2_c7tiiy.png"
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
                              {store.name.replace("120겹파이 ", "").replace("120겹 파이 ", "")}
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
                    }}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-3 bg-white border border-[#f2ccd7] hover:bg-[#fff9fb] text-[#bf3e67] text-xs font-bold rounded-lg transition-all shadow-sm"
                  >
                    카테고리 관리
                  </button>
                  <button
                    onClick={() => {
                      setShowLabelPanel(!showLabelPanel);
                      setShowCategoryPanel(false);
                    }}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-3 bg-white border border-[#f2ccd7] hover:bg-[#fff9fb] text-[#bf3e67] text-xs font-bold rounded-lg transition-all shadow-sm"
                  >
                    라벨 관리
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
                        <th className="p-4 sm:p-5 text-center">순서</th>
                        <th className="p-4 sm:p-5">주문 일자</th>
                        <th className="p-4 sm:p-5">가맹점</th>
                        <th className="p-4 sm:p-5">품목</th>
                        <th className="p-4 sm:p-5">결제 금액</th>
                        <th className="p-4 sm:p-5">현재 상태</th>
                        <th className="p-4 sm:p-5 text-center">상세보기</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f2ccd7]/60 text-xs">
                      {orders.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-[#735965]">현재 접수된 가맹점 발주 주문이 존재하지 않습니다.</td>
                        </tr>
                      ) : (
                        orders.map((order, idx) => (
                          <tr key={order.id} className="hover:bg-[#fff9fb] transition-colors">
                            <td className="p-4 sm:p-5 text-center font-bold text-[#bf3e67]">{idx + 1}</td>
                            <td className="p-4 sm:p-5 text-[#735965] font-semibold whitespace-nowrap">{order.date}</td>
                            <td className="p-4 sm:p-5 font-bold text-[#2d2026] whitespace-nowrap">강남역삼점</td>
                            <td className="p-4 sm:p-5">
                              <span className="font-bold text-[#2d2026] block">
                                {order.items[0].productName} {order.items.length > 1 ? `외 ${order.items.length - 1}건` : ""}
                              </span>
                              <span className="text-[10px] text-[#735965] block font-semibold mt-0.5 max-w-[320px] truncate" title={order.items.map(item => `${item.productName} ${item.quantity}개`).join(", ")}>
                                {order.items.map(item => `${item.productName} ${item.quantity}개`).join(", ")}
                              </span>
                            </td>
                            <td className="p-4 sm:p-5 font-bold text-[#2d2026] whitespace-nowrap">{order.totalPrice.toLocaleString()} 원</td>
                            <td className="p-4 sm:p-5 whitespace-nowrap">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold ${
                                order.status === "배송중" 
                                  ? "bg-blue-50 text-blue-500 border border-blue-200" 
                                  : order.status === "배송완료" 
                                  ? "bg-emerald-50 text-emerald-600 border border-emerald-200" 
                                  : order.status === "배송준비중"
                                  ? "bg-orange-50 text-orange-500 border border-orange-200"
                                  : "bg-[#ffd3df] text-[#bf3e67] border border-[#f2ccd7]"
                              }`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="p-4 sm:p-5 text-center whitespace-nowrap">
                              <button
                                onClick={() => handleOpenOrderModal(order)}
                                className="px-3.5 py-1.5 rounded-lg bg-[#fff1f5] hover:bg-[#ffd3df] text-[#bf3e67] border border-[#f2ccd7] text-[10px] font-bold transition-all shadow-sm"
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
                  { id: "floating", label: "📱 우측 플로팅 연동", color: "bg-[#735965]" }
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

              {/* 1. REAL-TIME POPUP MANAGEMENT */}
              {bannerSubMenu === "popup" && (
                <form onSubmit={handleUpdatePopup} className="bg-white border border-[#f2ccd7] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-[#f2ccd7]/60 pb-4">
                    <div className="space-y-1">
                      <h3 className="font-extrabold text-sm text-[#2d2026] flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#f25f8a]"></span>
                        실시간 점주 공지 팝업 관리
                      </h3>
                      <p className="text-[10px] text-[#735965] font-bold">점주 포털 홈 접속 시 화면 최상단에 모달 팝업으로 표출될 긴급 혜택 공지입니다.</p>
                    </div>
                    {/* Switch Toggle */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setPopupActive(!popupActive);
                      }}
                      className={`w-12 h-6 rounded-full p-1 transition-all duration-300 ${
                        popupActive ? "bg-[#f25f8a] flex justify-end" : "bg-[#735965]/20 flex justify-start"
                      }`}
                    >
                      <span className="w-4 h-4 rounded-full bg-white shadow-sm block transition-all"></span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#735965]">팝업 메인 타이틀</label>
                      <input
                        type="text"
                        value={popupTitle}
                        onChange={(e) => setPopupTitle(e.target.value)}
                        placeholder="이벤트 헤드라인 문구를 입력하세요"
                        className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-4 py-3 text-xs text-[#2d2026] focus:outline-none focus:border-[#f25f8a]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#735965]">하단 연결 유도 버튼 텍스트</label>
                      <input
                        type="text"
                        value={popupBtnText}
                        onChange={(e) => setPopupBtnText(e.target.value)}
                        placeholder="예: 지금 바로 신메뉴 생지 주문하기"
                        className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-4 py-3 text-xs text-[#2d2026] focus:outline-none focus:border-[#f25f8a]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#735965]">배경 이미지 파일 (URL)</label>
                      <input
                        type="text"
                        value={popupImage}
                        onChange={(e) => setPopupImage(e.target.value)}
                        placeholder="https://example.com/popup.jpg (미지정 시 핑크 그라데이션 자동 적용)"
                        className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-4 py-3 text-xs text-[#2d2026] focus:outline-none focus:border-[#f25f8a]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#735965]">로컬 이미지 직접 업로드</label>
                      <div className="flex items-center gap-3 bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-4 py-2.5">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePopupImageUpload}
                          className="text-xs text-[#735965] file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-[10px] file:font-black file:bg-[#ffd3df] file:text-[#bf3e67] file:hover:bg-[#ffd3df]/80 cursor-pointer flex-1"
                        />
                        {popupImage && (
                          <button
                            type="button"
                            onClick={() => setPopupImage("")}
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
                      <label className="text-xs font-bold text-[#735965]">팝업 상세 본문 및 긴급 특전 사항</label>
                      <textarea
                        rows={4}
                        value={popupDesc}
                        onChange={(e) => setPopupDesc(e.target.value)}
                        placeholder="팝업 내에 표시될 상세 공지 본문을 넉눌하게 기술해 주세요."
                        className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-4 py-3 text-xs text-[#2d2026] focus:outline-none focus:border-[#f25f8a] resize-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#735965]">버튼 클릭 시 이동 메뉴 설정</label>
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
                        className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-4 py-3 text-xs text-[#2d2026] focus:outline-none focus:border-[#f25f8a]"
                      >
                        <option value="order">자재 발주하기 (내부 메뉴 연동)</option>
                        <option value="training">교육자료실 (내부 메뉴 연동)</option>
                        <option value="material">홍보자료실 (내부 메뉴 연동)</option>
                        <option value="inquiry">1:1 문의게시판 (내부 메뉴 연동)</option>
                        <option value="custom">외부 웹주소 URL 직접 지정</option>
                      </select>
                      {popupLink.startsWith("http") && (
                        <div className="pt-2">
                          <input
                            type="text"
                            value={popupLink}
                            onChange={(e) => setPopupLink(e.target.value)}
                            placeholder="https://example.com"
                            className="w-full bg-white border border-[#f2ccd7] rounded-xl px-4 py-3 text-xs text-[#2d2026] focus:outline-none focus:border-[#f25f8a]"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Styling Customization Section */}
                  <div className="border-t border-[#f2ccd7]/60 pt-6 space-y-4">
                    <h4 className="font-extrabold text-xs text-[#bf3e67] flex items-center gap-1.5">
                      🎨 팝업 디자인 & 데코 스타일 상세 설정
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* Title Styles */}
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-[#735965] block">메인 타이틀 글자 색상</label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={popupTitleColor}
                            onChange={(e) => setPopupTitleColor(e.target.value)}
                            className="w-10 h-10 border border-[#f2ccd7] rounded-xl cursor-pointer"
                          />
                          <input
                            type="text"
                            value={popupTitleColor}
                            onChange={(e) => setPopupTitleColor(e.target.value)}
                            className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-3 py-2 text-xs font-mono text-[#2d2026]"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-[#735965] block">메인 타이틀 글자 크기</label>
                        <select
                          value={popupTitleSize}
                          onChange={(e) => setPopupTitleSize(e.target.value)}
                          className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-3 py-2.5 text-xs text-[#2d2026] focus:outline-none"
                        >
                          <option value="14px">매우 작게 (14px)</option>
                          <option value="16px">작게 (16px)</option>
                          <option value="18px">보통 (18px - 기본)</option>
                          <option value="20px">크게 (20px)</option>
                          <option value="24px">매우 크게 (24px)</option>
                          <option value="28px">대형 (28px)</option>
                        </select>
                      </div>

                      {/* Desc Styles */}
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-[#735965] block">상세 설명 글자 색상</label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={popupDescColor}
                            onChange={(e) => setPopupDescColor(e.target.value)}
                            className="w-10 h-10 border border-[#f2ccd7] rounded-xl cursor-pointer"
                          />
                          <input
                            type="text"
                            value={popupDescColor}
                            onChange={(e) => setPopupDescColor(e.target.value)}
                            className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-3 py-2 text-xs font-mono text-[#2d2026]"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-[#735965] block">상세 설명 글자 크기</label>
                        <select
                          value={popupDescSize}
                          onChange={(e) => setPopupDescSize(e.target.value)}
                          className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-3 py-2.5 text-xs text-[#2d2026] focus:outline-none"
                        >
                          <option value="11px">작게 (11px)</option>
                          <option value="12px">보통 (12px - 기본)</option>
                          <option value="13px">약간 크게 (13px)</option>
                          <option value="14px">크게 (14px)</option>
                          <option value="16px">매우 크게 (16px)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Button/Box Styles */}
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-[#735965] block">하단 버튼(박스) 배경 색상</label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={popupBtnBgColor}
                            onChange={(e) => setPopupBtnBgColor(e.target.value)}
                            className="w-10 h-10 border border-[#f2ccd7] rounded-xl cursor-pointer"
                          />
                          <input
                            type="text"
                            value={popupBtnBgColor}
                            onChange={(e) => setPopupBtnBgColor(e.target.value)}
                            className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-3 py-2 text-xs font-mono text-[#2d2026]"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-[#735965] block">버튼 글씨 색상</label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={popupBtnTextColor}
                            onChange={(e) => setPopupBtnTextColor(e.target.value)}
                            className="w-10 h-10 border border-[#f2ccd7] rounded-xl cursor-pointer"
                          />
                          <input
                            type="text"
                            value={popupBtnTextColor}
                            onChange={(e) => setPopupBtnTextColor(e.target.value)}
                            className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-3 py-2 text-xs font-mono text-[#2d2026]"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-[#735965] block">버튼 글씨 크기</label>
                        <select
                          value={popupBtnTextSize}
                          onChange={(e) => setPopupBtnTextSize(e.target.value)}
                          className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-3 py-2.5 text-xs text-[#2d2026] focus:outline-none"
                        >
                          <option value="11px">작게 (11px)</option>
                          <option value="12px">보통 (12px - 기본)</option>
                          <option value="13px">약간 크게 (13px)</option>
                          <option value="14px">크게 (14px)</option>
                          <option value="16px">매우 크게 (16px)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-[#f25f8a] hover:bg-[#df4977] text-white font-bold text-sm rounded-xl transition-all shadow-[0_4px_16px_rgba(242,95,138,0.25)] flex items-center justify-center gap-2 hover:scale-[1.01]"
                  >
                    <Sparkles size={16} />
                    실시간 점주 공지 팝업 설정 동기화 배포
                  </button>
                </form>
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

                {/* 3. Kakao Map API Key Integration (외부 지도 API 연동) */}
                <div className="bg-white border border-[#f2ccd7] rounded-3xl p-6 sm:p-8 shadow-sm space-y-5 lg:col-span-2">
                  <h3 className="font-extrabold text-sm text-[#2d2026] border-b border-[#f2ccd7] pb-3 flex items-center gap-2">
                    <Map size={18} className="text-[#f25f8a]" />
                    가맹점 현황 지도 연동 설정 (다음/카카오맵 API)
                  </h3>
                  
                  <p className="text-[11px] text-[#735965] font-semibold leading-relaxed">
                    공식 가맹점 안내 페이지의 지도를 구글 맵 대신 국내 환경에 친화적인 <strong>카카오맵(다음지도)</strong>으로 직접 연동할 수 있습니다.<br />
                    카카오맵 JavaScript API Key를 등록하면 실시간 지점 좌표 변환 및 위치 핀 표시 기능이 활성화됩니다.<br />
                    <span className="text-[#bf3e67] font-extrabold">* 미등록 상태인 경우, 가맹점 안내 페이지는 구글 지도를 통해 안전하게 자동 대체 작동합니다.</span>
                  </p>

                  <form onSubmit={handleUpdateKakaoMapKey} className="space-y-4 max-w-xl">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#735965]">카카오 개발자 JavaScript 앱 키 (App Key)</label>
                      <input 
                        type="text"
                        placeholder="카카오디벨로퍼스에서 발급받은 JavaScript 키를 입력하세요"
                        value={kakaoMapKeySetting}
                        onChange={(e) => setKakaoMapKeySetting(e.target.value)}
                        className="w-full bg-[#fff9fb] border border-[#f2ccd7] rounded-xl px-4 py-3 text-xs text-[#2d2026] placeholder-[#735965]/40 focus:outline-none focus:border-[#f25f8a]"
                      />
                      <p className="text-[10px] text-neutral-400 font-medium leading-relaxed">
                        발급처: <a href="https://developers.kakao.com" target="_blank" rel="noopener noreferrer" className="text-[#f25f8a] underline hover:text-[#df4977]">Kakao Developers Console</a><br />
                        ⚙️ <strong>플랫폼 설정 방법</strong>: 내 애플리케이션 &gt; 앱 설정 &gt; 플랫폼 &gt; <strong>Web 플랫폼</strong>에 아래 도메인을 등록해주세요.<br />
                        👉 등록할 사이트 도메인: <code className="bg-neutral-100 text-[#bf3e67] px-1.5 py-0.5 rounded font-mono font-bold text-[11px]">{typeof window !== "undefined" ? window.location.origin : "https://120pie-new.vercel.app"}</code>
                      </p>
                    </div>

                    <button
                      type="submit"
                      className="py-3 px-6 bg-[#f25f8a] hover:bg-[#df4977] text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                    >
                      <Check size={14} />
                      카카오맵 API 설정 저장
                    </button>
                  </form>
                </div>

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
                onClick={() => setShowOrderModal(false)} 
                className="p-1.5 text-[#735965] hover:text-[#f25f8a] bg-white border border-[#f2ccd7] rounded-lg shrink-0 ml-4"
              >
                <X size={15} />
              </button>
            </div>

            {/* Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
              
              {/* Delivery Recipient Info */}
              <div className="space-y-3 bg-[#fff1f5]/50 border border-[#f2ccd7]/60 p-5 rounded-2xl">
                <h4 className="font-extrabold text-sm text-[#bf3e67] border-b border-[#f2ccd7] pb-2 flex items-center gap-1.5">
                  <Store size={15} />
                  수령인 & 배송지 정보 (가맹점 정보)
                </h4>
                <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-[#735965]">
                  <div>
                    <span className="block text-[10px] text-[#735965]/60 mb-0.5">가맹점명</span>
                    <strong className="text-[#2d2026]">강남역삼점</strong>
                  </div>
                  <div>
                    <span className="block text-[10px] text-[#735965]/60 mb-0.5">점주 대표자</span>
                    <strong className="text-[#2d2026]">김지훈</strong>
                  </div>
                  <div>
                    <span className="block text-[10px] text-[#735965]/60 mb-0.5">연락처</span>
                    <strong className="text-[#2d2026]">010-3813-1200</strong>
                  </div>
                  <div>
                    <span className="block text-[10px] text-[#735965]/60 mb-0.5">주문 신청일</span>
                    <strong className="text-[#2d2026]">{selectedOrder.date}</strong>
                  </div>
                </div>
                <div className="pt-2 text-xs font-semibold text-[#735965] border-t border-[#f2ccd7]/40">
                  <span className="block text-[10px] text-[#735965]/60 mb-0.5">배송지 주소</span>
                  <strong className="text-[#2d2026]">경기 군포시 엘에스로 143 (금정동, 1층 1001호)</strong>
                </div>
              </div>

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
                  <span className="text-[10px] text-[#735965] font-bold block mb-1">총 결제 합계액 (부가세 포함)</span>
                  <strong className="text-xl font-black text-[#bf3e67]">
                    {selectedOrder.totalPrice.toLocaleString()} 원
                  </strong>
                </div>
              </div>

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
