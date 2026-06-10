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
  MessageCircle,
  ClipboardList,
  ExternalLink
} from "lucide-react";

import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";

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
  options?: string[]; // 추가된 제품 선택 옵션 필드
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
    desc: "달콤 상큼한 사과 과육 and 시나몬 아로마가 어우러진 스테디셀러 디저트 생지"
  },
  {
    id: "prod-3",
    name: "콘치즈파이 생지",
    category: "냉동생지/자재",
    price: 42000,
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
    price: 36000,
    packSize: "1박스 (100개입)",
    img: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779762878/%EC%98%A4%EB%A6%AC%EC%A7%80%EB%84%90_koyjlk.jpg",
    stock: "in_stock",
    desc: "기름 없이 오븐 조리가 가능한 바삭하고 쫀득한 츄러스 전용 냉동 생지"
  },
  {
    id: "prod-6",
    name: "[홍보물] 매장용 양면 포스터 및 스티커",
    category: "부자재/포장재",
    price: 5000,
    packSize: "1개 (1개입)",
    img: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779718433/120%EA%B2%B9%ED%8C%8C%EC%9D%B4_%ED%81%AC%EB%A6%BC%EC%B9%98%EC%A6%88_%EC%97%B0%EC%B6%9C_xk9fhi.jpg",
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
  // STATE MANAGEMENT (LOCAL STORAGE SYNCD)
  // ==========================================
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);
  const [loginId, setLoginId] = useState<string>("");
  const [loginPw, setLoginPw] = useState<string>("");
  const [loginError, setLoginError] = useState<string | null>(null);

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
  const [trackingModalOpen, setTrackingModalOpen] = useState<boolean>(false);
  const [trackingInfo, setTrackingInfo] = useState<{ courier: string; trackingNo: string; orderId: string; status: string; date: string } | null>(null);
  const [apiTrackingData, setApiTrackingData] = useState<any | null>(null);
  const [apiTrackingLoading, setApiTrackingLoading] = useState<boolean>(false);
  const [apiTrackingError, setApiTrackingError] = useState<boolean>(false);
  const [selectedProductDetail, setSelectedProductDetail] = useState<any | null>(null);
  const [selectedProductOption, setSelectedProductOption] = useState<string>("");
  const [localSelectedOptions, setLocalSelectedOptions] = useState<{ optionName: string; quantity: number }[]>([]);
  const [localSingleQty, setLocalSingleQty] = useState<number>(1);

  // ==========================================
  // CONVEX REAL-TIME SYNC HOOKS
  // ==========================================
  const convexPopup = useQuery(api.popups.get, { targetPage: "portal" });
  const convexFloating = useQuery(api.floatings.get);
  const convexStores = useQuery(api.stores.get);
  const convexProducts = useQuery(api.products.get);
  const convexOrders = useQuery(api.orders.list);
  const convexMaterials = useQuery(api.materials.list);
  const convexStoreInquiries = useQuery(api.storeInquiries.listByStore, { storeId: activeStoreId || "owner" });
  const convexNotices = useQuery(api.notices.list);
  const convexProductCategories = useQuery(api.categories.get);

  const saveOrderMutation = useMutation(api.orders.createOrUpdate);
  const syncProductsMutation = useMutation(api.products.syncProducts);
  const syncOrdersMutation = useMutation(api.orders.syncOrders);
  const createInquiryMutation = useMutation(api.storeInquiries.createOrUpdate);
  const incrementNoticeViewsMutation = useMutation(api.notices.incrementViews);
  const updateOrderStatusMutation = useMutation(api.orders.updateStatus);
  const verifyAndSaveOrderAction = useAction(api.payments.verifyAndSaveOrder);



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
      if (mappedNotices.length > 0) {
        setNotices(mappedNotices);
        localStorage.setItem("120_notices", JSON.stringify(mappedNotices));
      }
    }
  }, [convexNotices]);

  // Sync Convex materials to React state and localStorage (Fallback to local mock if empty)
  useEffect(() => {
    if (convexMaterials !== undefined && convexMaterials !== null) {
      const trainList = convexMaterials.filter((m: any) => m.type === "training");
      const prList = convexMaterials.filter((m: any) => m.type === "pr");
      
      if (trainList.length > 0) {
        setTrainings(trainList.map((m: any) => ({
          id: m._id,
          title: m.title,
          date: m.date,
          size: m.size,
          format: m.format,
          desc: m.desc,
          img: m.img,
          fileUrl: m.fileUrl,
          fileName: m.fileName
        })));
        localStorage.setItem("120_trainings", JSON.stringify(trainList));
      }
      
      if (prList.length > 0) {
        setPrs(prList.map((m: any) => ({
          id: m._id,
          title: m.title,
          date: m.date,
          size: m.size,
          format: m.format,
          desc: m.desc,
          img: m.img,
          fileUrl: m.fileUrl,
          fileName: m.fileName
        })));
        localStorage.setItem("120_prs", JSON.stringify(prList));
      }
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

  // Sync Convex products to React state and localStorage (Precedence over mock seed)
  useEffect(() => {
    if (convexProducts !== undefined && convexProducts !== null) {
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
        options: p.options || []
      })).sort((a: any, b: any) => a.orderIndex - b.orderIndex);
      setProducts(mapped);

      // Extract unique categories from actual active products dynamically
      const uniqueCats = Array.from(new Set(mapped.map((p: any) => p.category).filter(Boolean))) as string[];
      setCategories(uniqueCats);
      
      try {
        localStorage.setItem("120_products", JSON.stringify(convexProducts));
        localStorage.setItem("120_categories", JSON.stringify(uniqueCats));
      } catch (e) {
        console.warn(e);
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
      const myOrders = convexOrders.filter((o: any) => o.storeId === activeStoreId || o.storeId === "owner");
      const mappedOrders = myOrders.map((o: any) => ({
        id: o.id,
        date: o.date,
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

  // Shipping and Return Policy states
  const [shippingPolicy, setShippingPolicy] = useState<string>("");
  const [returnPolicy, setReturnPolicy] = useState<string>("");
  const [freeShippingThreshold, setFreeShippingThreshold] = useState<number>(100000);
  const [shippingFeeA, setShippingFeeA] = useState<number>(3000);
  const [shippingFeeB, setShippingFeeB] = useState<number>(4000);
  const [shippingFeeC, setShippingFeeC] = useState<number>(5000);

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
      if (selectedOrder || selectedProductDetail || trackingModalOpen || showInquiryModal) {
        setSelectedOrder(null);
        setSelectedProductDetail(null);
        setTrackingModalOpen(false);
        setShowInquiryModal(false);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [selectedOrder, selectedProductDetail, trackingModalOpen, showInquiryModal]);

  // 각 모달이 열리는 시점에 pushState를 호출해 줍니다!
  useEffect(() => {
    if (selectedOrder || selectedProductDetail || trackingModalOpen || showInquiryModal) {
      window.history.pushState({ modal: true }, "");
    }
  }, [selectedOrder, selectedProductDetail, trackingModalOpen, showInquiryModal]);

  // 모달 닫기 시 가상 history 스택을 동기화하기 위한 헬퍼 함수
  const closeModal = (closeFn: () => void) => {
    closeFn();
    if (typeof window !== "undefined" && window.history.state?.modal) {
      window.history.back();
    }
  };

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

      setInquiries(loadState("120_inquiries", INITIAL_INQUIRIES));
      setNotices(loadState("120_notices", INITIAL_NOTICES));
      setTrainings(loadState("120_trainings", INITIAL_TRAINING));
      setPrs(loadState("120_prs", INITIAL_PR));

      // Seeds
      setStores(loadState("120_stores", []));
      setCategories(loadState("120_categories", []));
      setBanner(loadState("120_banners", null));
      setActiveStoreId(localStorage.getItem("120_active_store_id") || "owner");

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

        setInquiries(parseSafely("120_inquiries", INITIAL_INQUIRIES));
        setNotices(parseSafely("120_notices", INITIAL_NOTICES));
        setTrainings(parseSafely("120_trainings", INITIAL_TRAINING));
        setPrs(parseSafely("120_prs", INITIAL_PR));

        setStores(parseSafely("120_stores", []));
        setCategories(parseSafely("120_categories", []));
        
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

  // Get dynamic shipping fee based on selected type: free, A, B, C (Choose maximum)
  const getAppliedShippingFee = () => {
    if (cartSubtotal >= freeShippingThreshold || cart.length === 0) return 0;
    
    let maxFee = 0;
    cart.forEach((item) => {
      const p = (products || []).find((prod) => prod.id === item.productId);
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
      const p = (products || []).find((prod) => prod.id === item.productId);
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

    const PortOne = (window as any).PortOne;
    if (!PortOne) {
      showCustomAlert("결제 오류", "결제 모듈을 로드하는 중입니다. 잠시 후 다시 시도해 주세요.");
      return;
    }

    showCustomConfirm("발주 신청", "선택한 자재의 결제 및 발주를 신청하시겠습니까?", () => {
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

      const firstItemName = (products || []).find((prod) => prod.id === cart[0].productId)?.name || "자재 주문";
      
      const storeId = process.env.NEXT_PUBLIC_PORTONE_STORE_ID || "store-1ba40e9a-5edf-4497-b8dc-ae82194fcf42";
      const channelKey = process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY || "channel-key-7712b8cf-c5f1-424b-8047-8fc35c0bd793";

      // 토스페이먼츠(UPLUS) 특수문자 제한 방지를 위해 상품명 정제
      const sanitizedOrderTitle = cart.length > 1 ? `${firstItemName} 외 ${cart.length - 1}건` : firstItemName;

      PortOne.requestPayment({
        storeId: storeId,
        channelKey: channelKey,
        paymentId: newOrderId,
        orderName: sanitizedOrderTitle.replace(/[\[\]]/g, ""), // 특수문자 대괄호 제거
        totalAmount: cartTotal,
        currency: "KRW",
        payMethod: "CARD",
        customer: {
          fullName: "가맹점주",
          phoneNumber: "010-0000-0000",
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
          })
            .then((result: any) => {
              if (result.success) {
                const newOrder: Order = {
                  id: newOrderId,
                  date: new Date().toISOString().split("T")[0],
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

    setInquiryTitle("");
    setInquiryContent("");
    setShowInquiryModal(false);
    triggerToast("1:1 문의 상담건이 정식 접수되었습니다!");
    setCurrentMenu("inquiry");
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

          <div className="border-t border-[#f2ccd7] pt-6 space-y-2">
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

              <div className="border-t border-[#f2ccd7] pt-6 space-y-2">
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
                <div className="flex sm:flex-wrap overflow-x-auto sm:overflow-x-visible flex-nowrap whitespace-nowrap gap-1.5 sm:gap-2 bg-white border border-[#f2ccd7] p-1.5 sm:p-2 rounded-xl sm:rounded-2xl shadow-sm scrollbar-none">
                  {["전체", ...categories].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl font-bold text-[11px] sm:text-xs transition-all shrink-0 ${
                        activeCategory === cat
                          ? "bg-[#f25f8a] text-white shadow-sm"
                          : "text-[#735965] hover:text-[#bf3e67] hover:bg-[#fff1f5]"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Product Box Grid (Responsive: Left thumbnail row for mobile, Grid card for desktop) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {filteredProducts.map((p) => {
                    const cartQty = cart.find((item) => item.productId === p.id)?.quantity || 0;
                    return (
                      <React.Fragment key={p.id}>
                        {/* 1. Mobile Row View (Compact Left Thumbnail Layout) */}
                        <div 
                          onClick={() => setSelectedProductDetail(p)}
                          className="sm:hidden bg-white border border-[#f2ccd7] hover:border-[#f25f8a] active:scale-[0.99] transition-all rounded-xl p-3 flex gap-3 items-center shadow-sm cursor-pointer relative"
                        >
                          {/* Left: Thumbnail & Stock State */}
                          <div className="w-16 h-16 rounded-lg bg-[#fff1f5] overflow-hidden shrink-0 border border-[#f2ccd7]/60 relative">
                            <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
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
                                <span className="text-[9px] text-[#bf3e67] font-extrabold bg-[#ffd3df] px-1.5 py-0.5 rounded-md border border-[#f2ccd7]/60">
                                  {p.category}
                                </span>
                                <span className="text-[9px] text-[#735965] font-bold">{p.packSize}</span>
                              </div>
                              <h4 className="font-extrabold text-xs text-[#2d2026] truncate leading-tight">{p.name}</h4>
                            </div>

                            <div className="flex items-center justify-between mt-1">
                              <strong className="text-xs text-[#bf3e67] font-black">{p.price.toLocaleString()}원</strong>
                              
                              <div onClick={(e) => e.stopPropagation()} className="shrink-0">
                                {p.options && p.options.length > 0 ? (
                                  <button
                                    onClick={() => setSelectedProductDetail(p)}
                                    className="px-2.5 py-1 rounded bg-[#f25f8a] text-white text-[10px] font-black shadow-sm"
                                  >
                                    옵션선택
                                  </button>
                                ) : cartQty > 0 ? (
                                  <div className="flex items-center border border-[#f2ccd7] bg-[#fff1f5] rounded-md p-0.5">
                                    <button 
                                      onClick={() => updateCartQty(p.id, undefined, cartQty - 1)}
                                      className="p-0.5 hover:text-[#bf3e67] text-[#735965]"
                                    >
                                      <Minus size={11} />
                                    </button>
                                    <span className="px-2 text-[10px] font-bold text-[#2d2026] w-4 text-center">{cartQty}</span>
                                    <button 
                                      onClick={() => updateCartQty(p.id, undefined, cartQty + 1)}
                                      className="p-0.5 hover:text-[#bf3e67] text-[#735965]"
                                    >
                                      <Plus size={11} />
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => addToCart(p.id)}
                                    className="px-2.5 py-1 rounded bg-[#fff1f5] hover:bg-[#ffd3df] border border-[#f2ccd7] text-[10px] font-black text-[#bf3e67]"
                                  >
                                    담기
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 2. Desktop Grid Card View */}
                        <div 
                          onClick={() => setSelectedProductDetail(p)}
                          className="hidden sm:flex bg-white border border-[#f2ccd7] hover:border-[#f25f8a] transition-all rounded-2xl overflow-hidden flex-col justify-between shadow-sm cursor-pointer hover:shadow-md hover:-translate-y-0.5 aspect-square w-full relative min-h-0"
                        >
                          {/* Thumbnail image & stock state badge (Strictly 52% height) */}
                          <div className="h-[52%] w-full relative bg-[#fff1f5] overflow-hidden shrink-0 border-b border-[#f2ccd7]/40">
                            <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                            <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1 max-w-[80%]">
                              {p.stock === "low_stock" && (
                                <span className="bg-orange-500 text-white font-bold text-[8px] px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap">품절임박</span>
                              )}
                              {p.stock === "out_of_stock" && (
                                <span className="bg-red-500 text-white font-bold text-[8px] px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap">일시품절</span>
                              )}
                            </div>
                            <span className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm text-[9px] text-[#bf3e67] font-extrabold px-1.5 py-0.5 rounded border border-[#f2ccd7] whitespace-nowrap">
                              {p.category}
                            </span>
                          </div>

                          {/* Product Info Block (Strictly 48% height) */}
                          <div className="h-[48%] w-full shrink-0 flex flex-col justify-between p-3.5 min-h-0 relative overflow-hidden bg-white">
                            {p.labels && p.labels.length > 0 && (
                              <div className="absolute top-3.5 right-3.5 flex flex-wrap gap-1 w-fit justify-end z-10">
                                {p.labels.map((l) => {
                                  let bgStyle = "bg-neutral-500/90 text-white";
                                  if (l === "BEST") bgStyle = "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm font-black";
                                  else if (l === "추천") bgStyle = "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-sm font-black";
                                  else if (l === "신제품") bgStyle = "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-sm font-black";
                                  return (
                                    <span key={l} className={`font-bold text-[7px] px-1.5 py-0.5 rounded shadow-sm ${bgStyle} whitespace-nowrap`}>
                                      {l}
                                    </span>
                                  );
                                })}
                              </div>
                            )}
                            
                            <div className="space-y-0.5 pr-12 min-h-0 overflow-hidden text-left">
                              <span className="text-[8px] text-[#735965] font-bold block whitespace-nowrap truncate">{p.packSize}</span>
                              <h3 className="font-extrabold text-xs text-[#2d2026] leading-tight truncate">{p.name}</h3>
                              <p className="text-[9px] text-[#735965] font-medium leading-relaxed truncate mt-0.5">{p.desc}</p>
                            </div>

                            <div className="flex items-center justify-between mt-1 border-t border-[#f2ccd7]/40 pt-2 shrink-0">
                              <strong className="text-xs text-[#2d2026] font-black whitespace-nowrap">{p.price.toLocaleString()}원</strong>
                              
                              {p.options && p.options.length > 0 ? (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedProductDetail(p);
                                  }}
                                  className="px-2.5 py-1.5 rounded-lg bg-[#f25f8a] hover:bg-[#df4977] text-white text-[9px] font-black transition-all shadow-sm shrink-0 whitespace-nowrap"
                                >
                                  옵션 선택
                                </button>
                              ) : cartQty > 0 ? (
                                <div className="flex items-center border border-[#f2ccd7] bg-[#fff1f5] rounded-lg p-0.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                                  <button 
                                    onClick={() => updateCartQty(p.id, undefined, cartQty - 1)}
                                    className="p-0.5 hover:text-[#bf3e67] text-[#735965] transition-colors"
                                  >
                                    <Minus size={10} />
                                  </button>
                                  <span className="px-1.5 text-[9px] font-bold text-[#2d2026] w-4 text-center">{cartQty}</span>
                                  <button 
                                    onClick={() => updateCartQty(p.id, undefined, cartQty + 1)}
                                    className="p-0.5 hover:text-[#bf3e67] text-[#735965] transition-colors"
                                  >
                                    <Plus size={10} />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    addToCart(p.id);
                                  }}
                                  className="px-2.5 py-1.5 rounded-lg bg-[#fff1f5] hover:bg-[#ffd3df] border border-[#f2ccd7] text-[9px] font-black text-[#bf3e67] transition-all shrink-0 whitespace-nowrap"
                                >
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

              {/* Right Side: Interactive Shopping Cart */}
              <div className="lg:col-span-4 h-fit lg:self-start lg:sticky lg:top-[96px]">
                <div className="bg-white border border-[#f2ccd7] rounded-2xl p-6 shadow-sm space-y-6">
                  <div className="flex items-center justify-between border-b border-[#f2ccd7] pb-4">
                    <div className="flex items-center gap-2">
                      <ShoppingBag size={18} className="text-[#f25f8a]" />
                      <h3 className="font-extrabold text-base text-[#2d2026]">발주 장바구니</h3>
                    </div>
                    {cart.length > 0 && (
                      <button onClick={clearCart} className="text-[10px] font-bold text-[#735965] hover:text-red-500 transition-colors flex items-center gap-1 cursor-pointer">
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
                          const p = (products || []).find((prod) => prod.id === item.productId);
                          if (!p) return null;
                          return (
                            <div key={`${item.productId}-${item.selectedOption || ""}`} className="flex gap-3 justify-between items-center bg-[#fff9fb] border border-[#f2ccd7] p-3 rounded-xl">
                              <img src={p.img} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0" />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-xs text-[#2d2026] truncate">{p.name}</h4>
                                {item.selectedOption && (
                                  <span className="text-[10px] text-[#bf3e67] font-black block mt-0.5 select-none">
                                    [선택 옵션: {item.selectedOption}]
                                  </span>
                                )}
                                <span className="text-[10px] text-[#735965] font-semibold block mt-0.5">{p.price.toLocaleString()} 원 · {p.packSize}</span>
                              </div>
                              <div className="flex flex-col items-end gap-1.5 shrink-0">
                                <button onClick={() => removeCartItem(p.id, item.selectedOption)} className="text-[#735965]/60 hover:text-red-500 transition-colors p-1 cursor-pointer" aria-label="삭제">
                                  <X size={13} />
                                </button>
                                <div className="flex items-center border border-[#f2ccd7] bg-white rounded-lg p-0.5">
                                  <button onClick={() => updateCartQty(p.id, item.selectedOption, item.quantity - 1)} className="p-0.5 hover:text-[#bf3e67] text-[#735965]/60 transition-colors cursor-pointer">
                                    <Minus size={11} />
                                  </button>
                                  <span className="px-2 text-[10px] font-bold text-[#2d2026] w-4 text-center">{item.quantity}</span>
                                  <button onClick={() => updateCartQty(p.id, item.selectedOption, item.quantity + 1)} className="p-0.5 hover:text-[#bf3e67] text-[#735965]/60 transition-colors cursor-pointer">
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
                        className="w-full py-4 bg-[#f25f8a] hover:bg-[#df4977] text-white text-sm font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer border-0"
                      >
                        <CheckCircle2 size={16} />
                        결제 진행하기
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
                        <th className="p-4 sm:p-5 whitespace-nowrap">신청 일자</th>
                        <th className="p-4 sm:p-5">주문 품목 요약</th>
                        <th className="p-4 sm:p-5 whitespace-nowrap">총 결제 대금</th>
                        <th className="p-4 sm:p-5">배송 상태</th>
                        <th className="p-4 sm:p-5 text-center">상세 정보</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f2ccd7]/60 text-xs">
                      {orders.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-[#735965]">발주 내역이 존재하지 않습니다.</td>
                        </tr>
                      ) : (
                        orders.map((order) => (
                          <tr 
                            key={order.id} 
                            onClick={() => setSelectedOrder(order)}
                            className="hover:bg-[#fff9fb] transition-colors cursor-pointer group"
                          >
                            <td className="p-4 sm:p-5 text-[#735965] font-semibold whitespace-nowrap">{order.date}</td>
                            <td className="p-4 sm:p-5">
                              <span className="font-bold text-[#2d2026]">
                                {order.items[0].productName} {order.items.length > 1 ? `외 ${order.items.length - 1}건` : ""}
                              </span>
                              <span className="text-[10px] text-[#735965] block font-semibold mt-0.5">
                                {order.items.map(item => `${item.productName} ${item.quantity}개`).join(", ")}
                              </span>
                            </td>
                            <td className="p-4 sm:p-5 font-black text-[#bf3e67] whitespace-nowrap">{order.totalPrice.toLocaleString()} 원</td>
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
                      onClick={() => handleNoticeClick(n)}
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
                            onClick={() => handleDownload(t.title, t.fileUrl, t.fileName)}
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
                            onClick={() => handleDownload(p.title, p.fileUrl, p.fileName)}
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
                  handleDownload(selectedMaterial.title, selectedMaterial.fileUrl, selectedMaterial.fileName);
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
              <button onClick={() => closeModal(() => setShowInquiryModal(false))} className="p-1.5 text-[#735965] hover:text-[#f25f8a] bg-white border border-[#f2ccd7] rounded-lg">
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
              <button onClick={() => closeModal(() => setSelectedOrder(null))} className="p-1.5 text-[#735965] hover:text-[#f25f8a] bg-white border border-[#f2ccd7] rounded-lg shrink-0 ml-4">
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
                  <strong className="text-xs text-[#2d2026] block font-bold">현금 입금 진행</strong>
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
                      <p className="text-[#2d2026]">
                        {selectedOrder.courier ? `${selectedOrder.courier} 위탁 배송` : "120 물류 전용 냉동 저온탑차 (한진택배 위탁)"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-[#735965] font-extrabold block">실시간 송장 번호</span>
                      <p className="font-mono text-[#bf3e67]">
                        {selectedOrder.trackingNo || `HNJ-120-${selectedOrder.id.replace("ORD-", "")}`}
                      </p>
                    </div>
                    <div className="sm:col-span-2 pt-2 border-t border-[#f2ccd7]/40">
                      <button 
                        type="button"
                        onClick={() => {
                          handleTrackingClick(
                            selectedOrder.courier || "한진택배",
                            selectedOrder.trackingNo || `HNJ-120-${selectedOrder.id.replace("ORD-", "")}`,
                            selectedOrder.id,
                            selectedOrder.status,
                            selectedOrder.date
                          );
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
            <div className="p-5 border-t border-[#f2ccd7]/60 bg-[#fff1f5]/30 flex justify-between items-center gap-4">
              {["주문완료", "배송준비중", "대기"].includes(selectedOrder.status) ? (
                <button 
                  type="button"
                  onClick={() => cancelOrder(selectedOrder.id)}
                  className="px-5 py-3 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-xs font-extrabold text-red-500 transition-all cursor-pointer shadow-sm flex items-center gap-1.5"
                >
                  <Trash2 size={13} />
                  주문 취소
                </button>
              ) : (
                <div />
              )}
              <button 
                type="button"
                onClick={() => closeModal(() => setSelectedOrder(null))}
                className="px-8 py-3 rounded-xl bg-white hover:bg-[#fff1f5] border border-[#f2ccd7] text-xs font-extrabold text-[#735965] transition-all cursor-pointer shadow-sm"
              >
                상세내역 창 닫기
              </button>
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
              className="w-full max-w-2xl bg-white border border-[#f2ccd7] rounded-2xl overflow-hidden shadow-2xl flex flex-col animate-scaleUp max-h-[85vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-5 border-b border-[#f2ccd7]/60 flex justify-between items-center bg-gradient-to-r from-[#fff1f5] to-white">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-[#ffd3df] rounded-xl border border-[#f2ccd7]">
                    <Truck size={18} className="text-[#bf3e67]" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-[#2d2026]">실시간 물류 배송 추적</h3>
                    <p className="text-[10px] text-[#735965] font-semibold mt-0.5">
                      콜드체인 신선 배송 시스템 연동 · {trackingInfo.courier}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    closeModal(() => {
                      setTrackingModalOpen(false);
                      setTrackingInfo(null);
                    });
                  }}
                  className="p-1.5 text-[#735965] hover:text-[#f25f8a] bg-white border border-[#f2ccd7] rounded-lg shrink-0 cursor-pointer transition-all"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto space-y-6 flex flex-col flex-1 text-xs sm:text-sm min-h-[300px]">
                {apiTrackingLoading ? (
                  <div className="flex flex-col items-center justify-center space-y-4 text-center my-auto py-12 animate-fadeIn flex-1">
                    <div className="relative">
                      {/* Loading Spinner Ring */}
                      <div className="w-16 h-16 rounded-full border-4 border-[#fff1f5] border-t-[#f25f8a] animate-spin"></div>
                      <Truck size={24} className="text-[#bf3e67] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-bounce" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-[#2d2026] text-sm">실시간 택배 전산망 연결 중</h4>
                      <p className="text-[10px] text-[#735965] font-bold mt-1.5 max-w-[320px] leading-relaxed">
                        {trackingInfo.courier} 서버에 다이렉트로 접속하여 기사님 위치 및 상세 이동 정보를 실시간으로 가져오는 중입니다. 잠시만 기다려주세요!
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Delivery Basic Specs */}
                    <div className="bg-[#fff9fb] border border-[#f2ccd7] rounded-xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-semibold">
                      <div>
                        <span className="text-[10px] text-[#735965] font-extrabold block">발주 코드</span>
                        <span className="font-mono text-[#2d2026]">{trackingInfo.orderId}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#735965] font-extrabold block">운송장 번호</span>
                        <span className="font-mono text-[#bf3e67] font-black">{trackingInfo.trackingNo}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#735965] font-extrabold block">배송 수단</span>
                        <span className="text-[#2d2026]">{trackingInfo.courier}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#735965] font-extrabold block">현재 상태</span>
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-black ${
                          trackingInfo.status === "배송완료" ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                          : trackingInfo.status === "배송중" ? "bg-blue-50 text-blue-500 border border-blue-100"
                          : "bg-orange-50 text-orange-500 border border-orange-100"
                        }`}>{apiTrackingData ? apiTrackingData.state.text : trackingInfo.status}</span>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-xs font-black text-[#2d2026]">
                        <span>배송 진행 상태</span>
                        <span className="text-[#bf3e67]">{Math.round((trackingData.currentStep / 4) * 100)}% 진행</span>
                      </div>

                      {/* Horizontal visual line */}
                      <div className="relative pt-4 pb-2">
                        <div className="absolute left-6 right-6 top-[28px] h-1 bg-[#f2ccd7]/40 rounded-full z-0">
                          <div 
                            className="h-full bg-[#f25f8a] rounded-full transition-all duration-1000"
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
                                  isCompleted ? "bg-[#f25f8a] border-[#f25f8a] text-white shadow-sm"
                                  : isCurrent ? "bg-white border-[#f25f8a] text-[#f25f8a] scale-110 ring-4 ring-[#fff1f5]"
                                  : "bg-white border-[#f2ccd7] text-[#735965]"
                                }`}>
                                  {isCompleted ? <Check size={12} className="stroke-[3]" /> : <span className="text-[10px] font-black">{idx + 1}</span>}
                                </div>
                                <span className={`text-[10px] font-black ${
                                  isCompleted || isCurrent ? "text-[#bf3e67]" : "text-[#735965]"
                                }`}>{step.title}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Friendly Notice Box */}
                    <div className="p-3.5 bg-[#fff1f5]/40 border border-[#f2ccd7]/60 rounded-xl text-[11px] font-semibold text-[#735965] leading-relaxed flex gap-2">
                      <div className="text-base shrink-0">📢</div>
                      <p>
                        본 물류 정보는 {apiTrackingData ? <strong>{trackingInfo.courier} 공식 서버망</strong> : <strong>에그120 콜드체인 실시간 관제 시스템</strong>}과 100% 연동된 신뢰할 수 있는 실시간 데이터입니다. 신선 파이 생지 및 원재료의 최상 신선도를 위해 <strong>영하 18도의 친환경 초저온 차량</strong>으로 안전하게 이송되고 있으니 편히 안심하셔도 좋습니다.
                      </p>
                    </div>

                    {/* Checkpoints */}
                    <div className="space-y-3">
                      <h4 className="font-extrabold text-[#2d2026] flex items-center gap-1.5"><ClipboardList size={14} className="text-[#f25f8a]" /> 시간대별 배송 현황</h4>
                      <div className="relative border-l border-[#f2ccd7] ml-2 pl-4 space-y-5 py-1">
                        {trackingData.checkpoints.map((cp, idx) => {
                          const isFirst = idx === 0;
                          return (
                            <div key={idx} className="relative">
                              {/* Dot on line */}
                              <div className={`absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full border-2 ${
                                isFirst ? "bg-[#f25f8a] border-white ring-4 ring-[#fff1f5]" : "bg-white border-[#f2ccd7]"
                              }`} />
                              
                              <div className="space-y-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="text-[10px] font-mono text-[#735965] font-bold">{cp.time}</span>
                                  <span className="text-[10px] text-[#bf3e67] font-black bg-[#fff1f5] border border-[#f2ccd7] px-1.5 py-0.5 rounded">
                                    {cp.location}
                                  </span>
                                  <span className={`text-[9px] font-black px-1 rounded ${
                                    cp.status === "배송완료" || cp.status === "배달완료" ? "bg-emerald-100 text-emerald-700"
                                    : cp.status === "배송출발" || cp.status === "배송출고" ? "bg-blue-100 text-blue-700"
                                    : "bg-[#f2ccd7]/40 text-[#735965]"
                                  }`}>{cp.status}</span>
                                </div>
                                <p className="text-xs font-bold text-[#2d2026] leading-relaxed pl-0.5">
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
              <div className="p-5 border-t border-[#f2ccd7]/60 bg-[#fff1f5]/30 flex gap-3">
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
                  className="flex-1 py-3 rounded-xl bg-white hover:bg-[#fff1f5] border border-[#f2ccd7] text-xs font-extrabold text-[#735965] transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
                >
                  <ExternalLink size={13} /> 공식 택배사에서 확인하기
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    closeModal(() => {
                      setTrackingModalOpen(false);
                      setTrackingInfo(null);
                    });
                  }}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#f25f8a] to-[#bf3e67] text-white text-xs font-extrabold shadow-md hover:opacity-90 transition-all cursor-pointer"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        );
      })()}

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
                onClick={() => closeModal(() => setSelectedProductDetail(null))} 
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
              {(selectedProductDetail.detailImg || selectedProductDetail.detailText) && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 border-b border-[#f2ccd7]/60 pb-2">
                    <span className="w-1.5 h-3.5 rounded-full bg-[#f25f8a]"></span>
                    <span className="font-extrabold text-[#2d2026] text-xs sm:text-sm">🔍 제품 상세 정보 안내</span>
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
                        className="border border-[#f2ccd7] rounded-xl p-5 bg-[#fff9fb]/10 shadow-sm text-xs sm:text-sm text-[#2d2026] leading-relaxed whitespace-normal break-words overflow-x-auto min-h-[80px] rich-content-view"
                        dangerouslySetInnerHTML={{ __html: selectedProductDetail.detailText }}
                      />
                    </div>
                  )}

                  {/* Detail Image */}
                  {selectedProductDetail.detailImg && (
                    <div className="border border-[#f2ccd7] rounded-xl overflow-hidden shadow-sm bg-neutral-50 flex items-center justify-center p-2 min-h-[200px]">
                      <img 
                        src={selectedProductDetail.detailImg} 
                        alt={`${selectedProductDetail.name} 상세페이지`} 
                        className="w-full h-auto object-contain rounded-lg"
                      />
                    </div>
                  )}
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
            <div className="p-5 border-t border-[#f2ccd7]/60 bg-[#fff1f5]/30 flex flex-col gap-4">
              {/* Option / Quantity Control Area */}
              <div className="flex flex-col gap-3">
                {selectedProductDetail.options && selectedProductDetail.options.length > 0 ? (
                  <div className="space-y-3">
                    {/* Option Select Dropdown & Add Button */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-[#2d2026] text-xs shrink-0">옵션 선택 *</span>
                      <select
                        value={selectedProductOption}
                        onChange={(e) => setSelectedProductOption(e.target.value)}
                        className="flex-1 max-w-xs bg-white border border-[#f2ccd7] rounded-xl px-3 py-2.5 text-xs font-bold text-[#2d2026] focus:outline-none cursor-pointer"
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
                        className="px-4 py-2.5 rounded-xl bg-[#ffd3df] hover:bg-[#ffd3df]/80 text-[#bf3e67] text-xs font-extrabold transition-all shadow-sm"
                      >
                        옵션 추가
                      </button>
                    </div>

                    {/* Selected Options List */}
                    {localSelectedOptions.length > 0 && (
                      <div className="bg-white border border-[#f2ccd7] rounded-xl p-3 space-y-2.5 max-h-[160px] overflow-y-auto shadow-inner">
                        <span className="text-[10px] text-[#bf3e67] font-black block">선택된 옵션 목록</span>
                        {localSelectedOptions.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between gap-3 bg-[#fff9fb] border border-[#f2ccd7]/60 p-2.5 rounded-lg text-xs font-bold text-[#2d2026]">
                            <span className="truncate flex-1 pr-2">{item.optionName}</span>
                            <div className="flex items-center gap-3 shrink-0">
                              {/* Option Qty Controller */}
                              <div className="flex items-center border border-[#f2ccd7] bg-white rounded-lg p-0.5">
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
                                  className="p-1 hover:text-[#bf3e67] text-[#735965]/70 transition-colors"
                                >
                                  <Minus size={12} />
                                </button>
                                <span className="px-2 text-[10px] font-bold text-[#2d2026] w-4 text-center">{item.quantity}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setLocalSelectedOptions(
                                      localSelectedOptions.map((o) =>
                                        o.optionName === item.optionName ? { ...o, quantity: o.quantity + 1 } : o
                                      )
                                    );
                                  }}
                                  className="p-1 hover:text-[#bf3e67] text-[#735965]/70 transition-colors"
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
                                className="text-[#735965]/60 hover:text-red-500 transition-colors p-1"
                              >
                                <X size={14} />
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
                    <span className="font-bold text-[#2d2026] text-xs shrink-0">발주 수량 설정</span>
                    <div className="flex items-center border border-[#f2ccd7] bg-white rounded-xl p-1">
                      <button
                        type="button"
                        onClick={() => {
                          if (localSingleQty <= 1) return;
                          setLocalSingleQty(localSingleQty - 1);
                        }}
                        className="p-1 hover:text-[#bf3e67] text-[#735965] transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="px-4 text-xs font-bold text-[#2d2026] w-8 text-center">{localSingleQty}</span>
                      <button
                        type="button"
                        onClick={() => setLocalSingleQty(localSingleQty + 1)}
                        className="p-1 hover:text-[#bf3e67] text-[#735965] transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-[#f2ccd7]/60">
                <span className="text-[11px] font-bold text-[#735965] hidden sm:inline">
                  발주 규격을 다시 한 번 정밀 확인 후 신중히 진행해 주세요.
                </span>
                <div className="flex items-center gap-2 self-end sm:self-auto w-full sm:w-auto">
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
                    className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-[#f25f8a] hover:bg-[#df4977] text-white text-xs font-extrabold transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <ShoppingBag size={14} />
                    장바구니 담기
                  </button>
                  <button 
                    type="button"
                    onClick={() => closeModal(() => setSelectedProductDetail(null))}
                    className="px-6 py-3 rounded-xl bg-white hover:bg-[#fff1f5] border border-[#f2ccd7] text-xs font-extrabold text-[#735965] transition-all cursor-pointer shadow-sm"
                  >
                    닫기
                  </button>
                </div>
              </div>
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
              <div className="bg-[#fff9fb] p-3 flex justify-between items-center px-5 text-[11px] font-bold text-[#735965] select-none">
                <button
                  onClick={() => {
                    const sevenDaysLater = Date.now() + 7 * 24 * 60 * 60 * 1000;
                    localStorage.setItem("120_popup_closed_until", sevenDaysLater.toString());
                    setShowPopup(false);
                  }}
                  className="hover:text-[#bf3e67] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Check size={13} className="text-[#f25f8a]" /> 7일 동안 보지 않기
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

      {/* MOBILE BOTTOM FLOATING CART BAR (Always visible above bottom navigation when items are added in order menu) */}
      {cart.length > 0 && currentMenu === "order" && (
        <div className="lg:hidden fixed bottom-[57px] inset-x-0 z-40 bg-white border-t border-[#f2ccd7] px-4 py-3 shadow-[0_-4px_20px_rgba(242,204,215,0.25)] flex items-center justify-between animate-slideUp select-none">
          <div className="flex flex-col text-left">
            <span className="text-[9px] font-black text-[#735965]">총 {cart.reduce((sum, item) => sum + item.quantity, 0)}개 품목 담김</span>
            <span className="text-sm font-black text-[#bf3e67]">{cartTotal.toLocaleString()}원</span>
          </div>
          <button
            onClick={() => {
              // Smooth scroll to shopping cart at the bottom
              window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
            }}
            className="px-4 py-2 bg-[#f25f8a] hover:bg-[#df4977] text-white text-[10px] font-black rounded-xl shadow-sm flex items-center gap-1 transition-all cursor-pointer border-0"
          >
            <ShoppingBag size={12} className="text-white" />
            장바구니 확인
          </button>
        </div>
      )}

      {/* Premium Custom Alert / Confirm Modal */}
      {customDialog.isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-sm animate-custom-fade select-none">
          <div className="bg-white border border-neutral-100 rounded-3xl w-full max-w-[340px] overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.12)] relative my-auto flex flex-col p-6 animate-custom-scale">
            
            {/* Top decorative color bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 to-[#f25f8a]"></div>
            
            {/* Icon / Title */}
            <div className="flex items-center gap-2.5 mb-3 mt-1 text-left">
              <div className="p-2 rounded-full bg-amber-50 text-amber-500 shrink-0">
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
                  className="px-4 py-2 bg-neutral-50 hover:bg-neutral-100 text-neutral-500 font-extrabold text-xs rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer border border-neutral-200"
                >
                  취소
                </button>
              )}
              <button
                type="button"
                onClick={customDialog.onConfirm}
                className="px-5 py-2.5 bg-amber-400 hover:bg-amber-350 text-neutral-950 font-black text-xs rounded-xl transition-all shadow-md active:scale-95 cursor-pointer border-0"
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

    </div>
  );
}
