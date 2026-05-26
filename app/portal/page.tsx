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
  Image,
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
  Send
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
// MOCK DATA
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
    desc: "고소한 스위트콘과 부드러운 치즈가 조합된 남녀노소 취향저격 생지"
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
    img: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779713831/120%EA%B2%B9%ED%8C%8C%EC%9D%B4_%EC%9B%90%ED%98%95%EB%A1%9C%EA%B3%A02_nu_o4omab.png",
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
    img: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779713831/120%EA%B2%B9%ED%8C%8C%EC%9D%B4_%EC%9B%90%ED%98%95%EB%A1%9C%EA%B3%A02_nu_o4omab.png",
    stock: "low_stock",
    desc: "음료 및 파이 포장 봉투 부착용 원형 에그군 밀봉 스티커"
  },
  {
    id: "prod-9",
    name: "전용 타이머 영수 가열지",
    category: "소모품/집기",
    price: 12000,
    packSize: "1팩 (10롤)",
    img: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779713831/120%EA%B2%B9%ED%8C%8C%EC%9D%B4_%EC%9B%90%ED%98%95%EB%A1%9C%EA%B3%A02_nu_o4omab.png",
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
  },
  {
    id: "ORD-20260510-02",
    date: "2026-05-10",
    items: [
      { productName: "로제미트파이 생지", quantity: 2, price: 45000 },
      { productName: "츄러스 전용 냉동생지", quantity: 2, price: 38000 },
      { productName: "전용 타이머 영수 가열지", quantity: 1, price: 12000 }
    ],
    totalPrice: 178000,
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
    content: "안녕하세요 강남역삼점입니다. 어제 입고된 냉동 탑차 배송 물품 중 로제미트파이 생지 1박스의 모서리 부분이 찌그러져 있고 내부 실링 필름이 뜯어져 냉기가 다 빠진 채 배송되었습니다. 1박스 교환 또는 대금 감면 처리 부탁드립니다. 사진은 카톡 고객센터로도 발송해 드렸습니다.",
    answer: "안녕하십니까 강남역삼점 사장님, 120pie 본사 물류 지원팀입니다. 배송 과정 중 온도 관리 및 적재 부주의로 큰 불편을 끼쳐드려 진심으로 사과드립니다. 본사 전산상으로 즉각 1박스 대체 무료 배송 승인을 완료하였으며, 익일(26일) 정기 물류 편에 로제미트파이 생지 정품 1박스를 무상으로 교환 재출고해 드리겠습니다. 앞으로도 물류 기사님 위생 및 적재 교육을 한층 강화하겠습니다. 감사합니다."
  },
  {
    id: "INQ-882",
    category: "마케팅",
    title: "매장 전면 에그군 입체 입간판 추가 주문 단가 및 절차 문의",
    date: "2026-05-20",
    status: "답변완료",
    content: "신규 캐릭터 매뉴얼을 보니 노란색 에그군 입간판이 정말 귀엽게 잘 나왔네요. 현재 샵인샵 매장 입구 전면에 시각 효과용으로 하나 세워놓고 싶은데, 개별 추가 발주 가능한 단가와 신청 방법이 궁금합니다.",
    answer: "안녕하세요 사장님! 홍보물 담당 마케팅부입니다. 에그군 입체 입간판에 관심을 가져주셔서 감사합니다. 점주님들을 위한 특별 상생 단가 85,000원(부가세 및 배송비 포함 완제품)으로 공급 중입니다. 신청은 마케팅/홍보물 카테고리 내 혹은 마케팅 유선 회선을 통해 신청 가능하며, 대금 입금 즉시 매장 전용 배송으로 안전하게 발송됩니다. 도입 시 매장 외부의 SNS 사진 활성화에 대단히 유리하므로 강력히 권장해 드립니다."
  },
  {
    id: "INQ-915",
    category: "기술/AS",
    title: "전용 가열 타이머 기기 액정 백라이트 일시적 오작동",
    date: "2026-05-26",
    status: "답변대기",
    content: "오늘 오전 영업 개시 전 전용 가열 타이머 기기의 전원을 켰는데, 액정 백라이트 불빛이 미세하게 깜빡이며 타이머 수치 가독성이 일시적으로 떨어지는 현상이 있었습니다. 일단 코드를 재연결해 정상화는 시켰는데, 노후화나 전원 고장이 염려되어 사전 사후 AS 신청을 문의합니다."
  }
];

const INITIAL_NOTICES: Notice[] = [
  {
    id: "NOT-01",
    tag: "필독",
    title: "2026년 하반기 전국 가맹점 위생 점검 가이드 및 법정 안전 의무 이수 공지",
    date: "2026-05-20",
    views: 184,
    content: "전국 120pie & coffee 사장님들께 알립니다. 식약처 하절기 위해 위생 특별 합동 점검 대비 및 안전한 조리 환경 구축을 위한 가맹본부 종합 자가 위생 점검 매뉴얼이 업로드되었습니다. 모든 매장에서는 교육자료실에 배포된 하절기 자가진단표를 출력하시어 조리대 온도, 냉동고 보관선도, 소독 상태를 주기적으로 체크하여 기록해 주시기 바랍니다. 또한 연간 법정 위생 교육 이수 확인증을 본사 대표 메일로 6월 15일까지 제출해 주셔야 행정 조치 불이익을 피하실 수 있습니다."
  },
  {
    id: "NOT-02",
    tag: "신메뉴",
    title: "여름 한정 신메뉴 '망고파이' 물류 정식 개시 및 레시피 영상 배포",
    date: "2026-05-18",
    views: 245,
    content: "기다려 주시던 여름 시즌 킬러 디저트, '망고파이(생지)' 발주가 금일부로 공식 오픈되었습니다! 상큼하고 향긋한 망고의 진한 필링을 120겹 파이 사이에 가득 채워, 시원한 아메리카노 및 브랜드 스페셜 쉐이크 계열과 최상의 마리아주를 형성합니다. 조리 매뉴얼은 냉동 상태에서 타이머 세팅 5분 30초로 동일하며, 자세한 동영상 레시피 및 매장용 POP 홍보물 디자인 시안은 각각 교육자료 및 홍보물실에서 무상 배포 중이오니 즉시 활용하시어 신메뉴 매출 시너지를 이끌어 보시기 바랍니다."
  },
  {
    id: "NOT-03",
    tag: "물류",
    title: "현충일 공휴일 주간 전국 콜드체인 물류 정기 배송 일정 변경 안내",
    date: "2026-05-15",
    views: 112,
    content: "전국 택배 및 콜드체인 운송 연대 휴무와 법정 공휴일 지정에 따라, 현충일 주간(6월 첫째 주) 정기 자재 배송 일정에 일시적 변동이 발생합니다. 목요일(6/4) 정기 입고 예정이던 매장들은 수요일(6/3) 야간에 조기 배송되며, 금요일(6/5) 입고 매장들은 토요일(6/6) 오전 중 긴급 배송으로 순차 진행됩니다. 매장 조리 및 생지 재고가 품절되지 않도록 사전에 3~4일 여유 분량을 가감하여 미리 주문 조치해 주시기 바랍니다."
  },
  {
    id: "NOT-04",
    tag: "이벤트",
    title: "에그120 '에그군' 인스타그램 캐릭터 카메라 필터 런칭 이벤트 가이드",
    date: "2026-05-10",
    views: 156,
    content: "MZ 세대 고객들의 활발한 바이럴을 견인하기 위해 에그120의 브랜드 캐릭터 '에그군'을 주인공으로 한 증강현실(AR) 카메라 인스타 필터가 공식 정식 런칭되었습니다. 고객이 매장에서 계란빵 봉투를 필터로 촬영하면 캐릭터가 춤추며 다양한 시각 이펙트를 주는 힙한 기능입니다. 본사 마케팅 지원실에서 고객용 테이블 스티커 및 포스터 홍보 자재를 정기 택배 상자 안에 무료로 동봉하여 배포 완료했으니, 매장 테이블에 꼭 부착하시고 이벤트에 동참하도록 안내해 주시기 바랍니다."
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
    format: "MP4 / VIDEO",
    desc: "반죽 성형의 미세 오차를 방지하고 폭신한 볼륨감을 살리기 위해 100% 쌀믹스 파우더와 물, 토핑의 정량 황금 비율 배합법 및 기기 청소 요령을 담은 비디오 교육 강좌입니다.",
    img: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779761729/%EC%98%A4%EB%A6%AC%EC%A7%80%EB%84%90%EA%B3%84%EB%9E%80%EB%B9%B52_kdqsqv.jpg"
  },
  {
    id: "TRN-03",
    title: "하절기 가맹점 매장 위생 자체 점검표 및 식품 안전 점검 대장 (XLSX)",
    date: "2026-05-10",
    size: "1.8 MB",
    format: "XLSX / SHEET",
    desc: "가열 식자재 보관고, 해충 예방 체크 리스트, 매장 환기 및 보관 필름 손상 여부 등 자가 진단 및 본사 및 행정 검열 대응용 위생 관리 표준 템플릿입니다."
  }
];

const INITIAL_PR: Material[] = [
  {
    id: "PR-01",
    title: "2026 여름 시즌 한정 '망고파이' 포스터 & 테이블텐트 패키지 (AI/JPG)",
    date: "2026-05-18",
    size: "45.2 MB",
    format: "PSD / AI / JPG",
    desc: "여름 신메뉴 출시를 알리는 고화질 매장 부착용 포스터 2종 및 각 좌석 배치용 삼각 테이블텐트 시안 파일 세트입니다. 레이어 분리가 되어 가격 수정 및 개별 수정 가능합니다.",
    img: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779718433/120%EA%B2%B9%ED%8C%8C%EC%9D%B4_%ED%81%AC%EB%A6%BC%EC%B9%98%EC%A6%88_%EC%97%B0%EC%B6%9C_xk9fhi.jpg"
  },
  {
    id: "PR-02",
    title: "에그120 캐릭터 썸네일 & 배달 플랫폼 배너 모음집 (PNG/PSD)",
    date: "2026-05-12",
    size: "28.6 MB",
    format: "PNG / PSD",
    desc: "배달의민족, 요기요, 쿠팡이츠 배달 플랫폼 대표 썸네일 및 카테고리 광고에 즉각 활용 가능한 에그군 캐릭터 결합 고품격 배달 배너 모음집입니다.",
    img: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779761728/%EC%8A%88%ED%81%AC%EB%A6%BC_gbhnz2.jpg"
  },
  {
    id: "PR-03",
    title: "120pie & coffee 브랜드 통합 CI, BI 로고 벡터 파일 가이드라인 (AI/PDF)",
    date: "2026-05-05",
    size: "8.4 MB",
    format: "AI / PDF",
    desc: "전단지, 매장 자체 간판, 입체 몰딩, 유니폼 제작 등에 오차 없이 사용 가능한 시그니처 옐로우 및 리치 블랙 정식 엠블럼과 워드마크 오리지널 일러스트 벡터 자원 파일입니다."
  }
];

export default function PortalPage() {
  // ==========================================
  // STATE MANAGEMENT
  // ==========================================
  const [currentMenu, setCurrentMenu] = useState<string>("dashboard");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [inquiries, setInquiries] = useState<Inquiry[]>(INITIAL_INQUIRIES);
  const [products] = useState<Product[]>(INITIAL_PRODUCTS);
  const [notices] = useState<Notice[]>(INITIAL_NOTICES);
  const [trainings] = useState<Material[]>(INITIAL_TRAINING);
  const [prs] = useState<Material[]>(INITIAL_PR);

  // Selected Detail Modals
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);

  // Order page category tab
  const [activeCategory, setActiveCategory] = useState<string>("전체");

  // New 1:1 Inquiry Form states
  const [showInquiryModal, setShowInquiryModal] = useState<boolean>(false);
  const [inquiryCategory, setInquiryCategory] = useState<string>("물류");
  const [inquiryTitle, setInquiryTitle] = useState<string>("");
  const [inquiryContent, setInquiryContent] = useState<string>("");

  // Toast status simulation
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Mobile menu control
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

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

  const shippingFee = cartSubtotal >= 50000 || cartSubtotal === 0 ? 0 : 3000;
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
      Math.floor(10 + Math.random() * 90)
    )}`;

    const newOrder: Order = {
      id: newOrderId,
      date: new Date().toISOString().split("T")[0],
      items: newOrderItems,
      totalPrice: cartTotal,
      status: "배송준비중"
    };

    setOrders((prev) => [newOrder, ...prev]);
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

    setInquiries((prev) => [newInquiry, ...prev]);
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
    }, 1500);
  };

  // ==========================================
  // PACKAGE DATA
  // ==========================================
  const PACKAGES = [
    { name: "120pie", active: true, desc: "시그니처 파이" },
    { name: "egg120", active: true, desc: "프리미엄 쌀 계란빵" },
    { name: "츄러스120", active: true, desc: "스페인 정통 스낵" },
    { name: "떡볶이120", active: false, desc: "가맹점 도입 대기" },
    { name: "핫도그120", active: true, desc: "직화 수제 핫도그" },
    { name: "120coffee", active: true, desc: "스페셜티 가성비 음료" },
    { name: "추가 패키지", active: false, desc: "신규 모듈 준비중" }
  ];

  // Filtering Products for 자재주문
  const filteredProducts =
    activeCategory === "전체"
      ? products
      : products.filter((p) => p.category === activeCategory);

  // Statistics for Dashboard
  const activePackageCount = PACKAGES.filter((p) => p.active).length;
  const newNoticesCount = 2; // Simulated new
  const shippingCount = orders.filter((o) => o.status === "배송중").length;
  const answeredInqCount = inquiries.filter((i) => i.status === "답변완료").length;

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 flex flex-col font-sans select-none antialiased">
      
      {/* TOAST SYSTEM */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[150] bg-amber-400 text-neutral-950 px-5 py-3.5 rounded-xl font-black text-sm shadow-2xl flex items-center gap-2.5 border border-amber-300 animate-bounce">
          <CheckCircle2 size={16} />
          {toastMessage}
        </div>
      )}

      {/* HEADER BANNER PANEL FOR STORE BRANDING */}
      <header className="bg-neutral-950 border-b border-neutral-800/80 sticky top-0 z-40 shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[76px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-neutral-400 hover:text-white"
              aria-label="메뉴 열기"
            >
              <Menu size={22} />
            </button>
            <Link href="/" className="flex items-center gap-2.5 font-black text-lg text-white">
              <img
                src="https://res.cloudinary.com/dx7l09wwu/image/upload/v1779713831/120%EA%B2%B9%ED%8C%8C%EC%9D%B4_%EC%9B%90%ED%98%95%EB%A1%9C%EA%B3%A02_nu_o4omab.png"
                alt="120pie 로고"
                className="w-8 h-8 object-contain"
              />
              <span className="hidden sm:inline">120pie &amp; <span className="text-amber-400">coffee</span></span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-neutral-800 text-neutral-400 border border-neutral-750 font-bold ml-1">점주전용</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end text-right">
              <span className="font-extrabold text-sm text-white">120겹파이 강남역삼점</span>
              <span className="text-[10px] text-neutral-500 font-bold">김지훈 사장님 (정상 파트너)</span>
            </div>
            
            <div className="h-8 w-px bg-neutral-800 hidden md:block"></div>

            <div className="relative">
              <button className="p-2.5 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-400 hover:text-white relative">
                <Bell size={16} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-neutral-900"></span>
              </button>
            </div>

            <Link
              href="/"
              className="px-3.5 py-2.5 rounded-lg border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 text-xs font-bold text-neutral-400 hover:text-white transition-colors inline-flex items-center gap-1.5"
            >
              <ArrowLeft size={13} />
              <span className="hidden sm:inline">메인 사이트</span>
            </Link>
          </div>
        </div>
      </header>

      {/* CORE WORKSPACE: SIDEBAR + CONTENT GRID */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto relative items-stretch">
        
        {/* ==========================================
            SIDEBAR NAVIGATION (DESKTOP)
           ========================================== */}
        <aside className="w-64 border-r border-neutral-800/80 p-6 flex-col justify-between hidden lg:flex bg-neutral-950/40 shrink-0">
          <div className="space-y-8">
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4 flex gap-3 items-center">
              <div className="w-10 h-10 rounded-lg bg-amber-400 text-neutral-950 flex items-center justify-center font-black text-sm shrink-0">
                가맹
              </div>
              <div className="overflow-hidden">
                <h4 className="font-extrabold text-xs text-white truncate">강남역삼점</h4>
                <p className="text-[10px] text-neutral-500 font-semibold truncate mt-0.5">점주 고유 코드: GP-3813</p>
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
                { key: "pr", label: "홍보 자재", icon: Image }
              ].map(({ key, label, icon: Icon, badge }) => (
                <button
                  key={key}
                  onClick={() => {
                    setCurrentMenu(key);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full px-4 py-3 rounded-xl flex items-center justify-between text-sm font-black transition-all ${
                    currentMenu === key
                      ? "bg-amber-400 text-neutral-950 shadow-[0_4px_16px_rgba(251,191,36,0.15)]"
                      : "text-neutral-400 hover:text-white hover:bg-neutral-850"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} className={currentMenu === key ? "text-neutral-950" : "text-neutral-400 group-hover:text-white"} />
                    <span>{label}</span>
                  </div>
                  {badge && (
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      currentMenu === key ? "bg-neutral-950 text-amber-400" : "bg-amber-400 text-neutral-950"
                    }`}>
                      {badge}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          <div className="border-t border-neutral-800 pt-6">
            <Link
              href="/"
              className="w-full px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-black text-neutral-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut size={17} />
              <span>시스템 로그아웃</span>
            </Link>
          </div>
        </aside>

        {/* ==========================================
            MOBILE SIDEBAR (DRAWER OVERLAY)
           ========================================== */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm lg:hidden flex" onClick={() => setMobileMenuOpen(false)}>
            <div className="w-72 bg-neutral-950 border-r border-neutral-800 h-full p-6 flex flex-col justify-between" onClick={(e) => e.stopPropagation()}>
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-neutral-850 pb-4">
                  <div className="flex items-center gap-2">
                    <img
                      src="https://res.cloudinary.com/dx7l09wwu/image/upload/v1779713831/120%EA%B2%B9%ED%8C%8C%EC%9D%B4_%EC%9B%90%ED%98%95%EB%A1%9C%EA%B3%A02_nu_o4omab.png"
                      alt="로고"
                      className="w-7 h-7"
                    />
                    <span className="font-extrabold text-sm text-white">점주전용 포털</span>
                  </div>
                  <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800 rounded-lg">
                    <X size={16} />
                  </button>
                </div>

                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex gap-3 items-center">
                  <div className="w-10 h-10 rounded-lg bg-amber-400 text-neutral-950 flex items-center justify-center font-black text-sm shrink-0">
                    가맹
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-white">120겹파이 강남역삼점</h4>
                    <p className="text-[9px] text-neutral-500 font-semibold mt-0.5">GP-3813 / 김지훈 점주님</p>
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
                    { key: "pr", label: "홍보 자재", icon: Image }
                  ].map(({ key, label, icon: Icon, badge }) => (
                    <button
                      key={key}
                      onClick={() => {
                        setCurrentMenu(key);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full px-4 py-3 rounded-xl flex items-center justify-between text-sm font-black transition-all ${
                        currentMenu === key
                          ? "bg-amber-400 text-neutral-950 shadow-md"
                          : "text-neutral-400 hover:text-white hover:bg-neutral-850"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={18} className={currentMenu === key ? "text-neutral-950" : "text-neutral-400"} />
                        <span>{label}</span>
                      </div>
                      {badge && (
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                          currentMenu === key ? "bg-neutral-950 text-amber-400" : "bg-amber-400 text-neutral-950"
                        }`}>
                          {badge}
                        </span>
                      )}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="border-t border-neutral-800 pt-6">
                <Link
                  href="/"
                  className="w-full px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-black text-neutral-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut size={17} />
                  <span>시스템 로그아웃</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================
            MAIN CONTENT AREA
           ========================================== */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-full">
          
          {/* ==========================================
              MENU CONTENT: 1. DASHBOARD
             ========================================== */}
          {currentMenu === "dashboard" && (
            <div className="space-y-6">
              
              {/* Top Summary Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 sm:p-5 flex items-center gap-4">
                  <div className="bg-amber-400/10 text-amber-400 p-3 rounded-xl shrink-0 hidden sm:block">
                    <LayoutDashboard size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] sm:text-xs text-neutral-500 font-bold block mb-1">운영 중 패키지</span>
                    <strong className="text-xl sm:text-2xl font-black text-white">{activePackageCount} <span className="text-xs text-neutral-500 font-normal">/ 7개</span></strong>
                  </div>
                </div>

                <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 sm:p-5 flex items-center gap-4">
                  <div className="bg-amber-400/10 text-amber-400 p-3 rounded-xl shrink-0 hidden sm:block">
                    <Megaphone size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] sm:text-xs text-neutral-500 font-bold block mb-1">신규 공지사항</span>
                    <strong className="text-xl sm:text-2xl font-black text-amber-400">{newNoticesCount} <span className="text-xs text-neutral-500 font-normal">건</span></strong>
                  </div>
                </div>

                <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 sm:p-5 flex items-center gap-4">
                  <div className="bg-amber-400/10 text-amber-400 p-3 rounded-xl shrink-0 hidden sm:block">
                    <Truck size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] sm:text-xs text-neutral-500 font-bold block mb-1">배송 중인 자재</span>
                    <strong className="text-xl sm:text-2xl font-black text-white">{shippingCount} <span className="text-xs text-neutral-500 font-normal">건</span></strong>
                  </div>
                </div>

                <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 sm:p-5 flex items-center gap-4">
                  <div className="bg-amber-400/10 text-amber-400 p-3 rounded-xl shrink-0 hidden sm:block">
                    <MessageSquare size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] sm:text-xs text-neutral-500 font-bold block mb-1">답변 완료 문의</span>
                    <strong className="text-xl sm:text-2xl font-black text-white">{answeredInqCount} <span className="text-xs text-neutral-500 font-normal">건</span></strong>
                  </div>
                </div>
              </div>

              {/* Banners Block: Main 16:8 + Square 1:1 */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Main Wide Banner (16:8 aspect ratio) */}
                <div className="lg:col-span-8 bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl relative overflow-hidden flex flex-col justify-end p-6 min-h-[220px] sm:min-h-[260px] aspect-[16/8] shadow-lg">
                  <div className="absolute inset-0 bg-neutral-950/20 z-0"></div>
                  {/* Decorative Circle Grid */}
                  <div className="absolute right-0 top-0 w-48 h-48 rounded-full border-4 border-white/10 -mr-16 -mt-16 pointer-events-none"></div>
                  
                  <div className="relative z-10 space-y-3 max-w-md">
                    <span className="bg-neutral-950 text-amber-400 text-[10px] font-black uppercase px-2.5 py-1 rounded tracking-wider w-fit">Seasonal Spec</span>
                    <h2 className="text-2xl sm:text-3xl font-black text-neutral-950 tracking-tight leading-tight">
                      여름 대비 스페셜 신메뉴<br />'망고파이' 물류 정식 공급!
                    </h2>
                    <p className="text-xs text-neutral-950/80 font-extrabold leading-relaxed">
                      지금 바로 냉동생지를 주문하고, 홍보 자료실에서 매장 포스터 및 아크릴 테이블 텐트 시안을 무상으로 다운로드하여 매출을 강화해 보세요!
                    </p>
                  </div>
                </div>

                {/* Right Square Banner (1:1 aspect ratio) */}
                <div className="lg:col-span-4 bg-neutral-950 border border-neutral-800 hover:border-neutral-700 transition-colors rounded-2xl p-6 flex flex-col justify-between aspect-square min-h-[220px] sm:min-h-[260px] shadow-lg relative overflow-hidden group">
                  <div className="absolute right-[-40px] bottom-[-40px] w-32 h-32 rounded-xl bg-amber-400/5 rotate-12 pointer-events-none group-hover:scale-110 transition-transform"></div>
                  <div>
                    <span className="text-[10px] font-bold text-amber-400 tracking-widest uppercase block mb-1">Standard Edu</span>
                    <h3 className="text-lg sm:text-xl font-black text-white tracking-tight leading-tight">
                      점주 전용<br />하절기 식품 안전 &amp;<br />위생 자가 점검표
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <p className="text-xs text-neutral-500 font-medium">하절기 해충 및 냉동 식품 보관 온도를 사전 점검하여 위생 과태료를 방지하세요.</p>
                    <button 
                      onClick={() => {
                        setCurrentMenu("training");
                        triggerToast("교육자료실로 이동했습니다.");
                      }}
                      className="px-4 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-xs font-bold text-neutral-350 hover:text-white transition-colors w-fit flex items-center gap-1.5"
                    >
                      교육자료 다운로드 <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Operating Packages Visual System */}
              <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-neutral-850 pb-4">
                  <div>
                    <h3 className="text-lg font-black text-white">운영 중인 120 패키지 모듈</h3>
                    <p className="text-xs text-neutral-500 font-bold mt-1">우리 매장에 어떤 120 브랜드 엔진이 작동 중인지 한눈에 확인하세요.</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-bold shrink-0">
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> 운영중 ({activePackageCount})
                    </span>
                    <span className="flex items-center gap-1.5 text-neutral-600">
                      <span className="w-2.5 h-2.5 rounded-full bg-neutral-800 border border-neutral-700"></span> 미운영 (2)
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                  {PACKAGES.map((pkg) => (
                    <div 
                      key={pkg.name}
                      className={`border rounded-xl p-4 flex flex-col justify-between min-h-[96px] transition-all ${
                        pkg.active 
                          ? "bg-neutral-900/60 border-amber-400/20 hover:border-amber-400/40 shadow-inner" 
                          : "bg-neutral-950/20 border-neutral-850 opacity-40"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-black ${pkg.active ? "text-white" : "text-neutral-600"}`}>
                          {pkg.name}
                        </span>
                        {pkg.active ? (
                          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]"></span>
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-neutral-800 border border-neutral-700"></span>
                        )}
                      </div>
                      <span className={`text-[10px] font-bold ${pkg.active ? "text-amber-400" : "text-neutral-600"}`}>
                        {pkg.desc}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Grid: Recent Lists & Menu Shortcuts */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left Side: Recent Notice & Menu Shortcuts */}
                <div className="lg:col-span-8 space-y-6">
                  
                  {/* Recent Notices */}
                  <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4 border-b border-neutral-850 pb-4">
                      <h4 className="font-extrabold text-base text-white">최근 본사 공지사항</h4>
                      <button onClick={() => setCurrentMenu("notice")} className="text-xs font-bold text-neutral-500 hover:text-amber-400 transition-colors">전체보기</button>
                    </div>
                    <div className="divide-y divide-neutral-850">
                      {notices.slice(0, 3).map((notice) => (
                        <button
                          key={notice.id}
                          onClick={() => setSelectedNotice(notice)}
                          className="w-full py-3.5 text-left flex items-center justify-between gap-4 group hover:bg-neutral-900/20 px-1 rounded-lg transition-colors"
                        >
                          <div className="min-w-0 flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                                notice.tag === "필독" ? "bg-red-500/10 text-red-400" : "bg-neutral-850 text-neutral-400"
                              }`}>
                                {notice.tag}
                              </span>
                              <span className="text-xs font-extrabold text-neutral-200 group-hover:text-white truncate block">{notice.title}</span>
                            </div>
                            <span className="text-[10px] text-neutral-500 font-bold block">{notice.date} · 조회수 {notice.views}</span>
                          </div>
                          <ChevronRight size={14} className="text-neutral-600 group-hover:text-neutral-400 shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Menu Shortcuts */}
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { key: "order", label: "자재 주문", icon: ShoppingBag, desc: "신선 재료 발주", color: "bg-amber-400 text-neutral-950" },
                      { key: "inquiry", label: "1:1 문의", icon: MessageSquare, desc: "실시간 기술/물류 AS", color: "bg-neutral-900 text-neutral-350 border border-neutral-800 hover:bg-neutral-800 hover:text-white" },
                      { key: "pr", label: "홍보 자재", icon: Image, desc: "시즌 디자인 다운로드", color: "bg-neutral-900 text-neutral-350 border border-neutral-800 hover:bg-neutral-800 hover:text-white" }
                    ].map((btn) => (
                      <button
                        key={btn.key}
                        onClick={() => setCurrentMenu(btn.key)}
                        className={`rounded-2xl p-4 flex flex-col justify-between min-h-[120px] text-left transition-all ${btn.color}`}
                      >
                        <btn.icon size={20} />
                        <div>
                          <strong className="text-sm font-black block">{btn.label}</strong>
                          <span className="text-[9px] font-bold block opacity-60 mt-1">{btn.desc}</span>
                        </div>
                      </button>
                    ))}
                  </div>

                </div>

                {/* Right Side: Recent Orders, Inquiries, Materials */}
                <div className="lg:col-span-4 space-y-6">
                  
                  {/* Recent Orders */}
                  <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4 border-b border-neutral-850 pb-4">
                      <h4 className="font-extrabold text-base text-white">최근 발주 내역</h4>
                      <button onClick={() => setCurrentMenu("history")} className="text-xs font-bold text-neutral-500 hover:text-amber-400 transition-colors">전체보기</button>
                    </div>
                    <div className="space-y-3">
                      {orders.slice(0, 2).map((order) => (
                        <div key={order.id} className="bg-neutral-900/40 border border-neutral-850 p-4 rounded-xl space-y-2">
                          <div className="flex justify-between items-center text-[10px]">
                            <span className="text-neutral-500 font-bold">{order.date}</span>
                            <span className={`px-2 py-0.5 rounded font-black ${
                              order.status === "배송중" ? "bg-blue-500/10 text-blue-400" : "bg-neutral-800 text-neutral-400"
                            }`}>
                              {order.status}
                            </span>
                          </div>
                          <div>
                            <span className="font-extrabold text-xs text-white truncate block">
                              {order.items[0].productName} {order.items.length > 1 ? `외 ${order.items.length - 1}건` : ""}
                            </span>
                            <strong className="text-xs text-amber-400 font-black mt-1 block">{order.totalPrice.toLocaleString()} 원</strong>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Inquiries */}
                  <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4 border-b border-neutral-850 pb-4">
                      <h4 className="font-extrabold text-base text-white">최근 1:1 문의</h4>
                      <button onClick={() => setCurrentMenu("inquiry")} className="text-xs font-bold text-neutral-500 hover:text-amber-400 transition-colors">전체보기</button>
                    </div>
                    <div className="space-y-3">
                      {inquiries.slice(0, 2).map((inq) => (
                        <button
                          key={inq.id}
                          onClick={() => setSelectedInquiry(inq)}
                          className="w-full text-left bg-neutral-900/40 border border-neutral-850 p-4 rounded-xl hover:border-neutral-700 transition-colors space-y-2 block"
                        >
                          <div className="flex justify-between items-center text-[10px]">
                            <span className="text-neutral-500 font-bold">{inq.category} · {inq.date}</span>
                            <span className={`px-2 py-0.5 rounded font-black ${
                              inq.status === "답변완료" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-400/10 text-amber-400"
                            }`}>
                              {inq.status}
                            </span>
                          </div>
                          <span className="font-extrabold text-xs text-neutral-200 block truncate group-hover:text-white">{inq.title}</span>
                        </button>
                      ))}
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
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Side: Category tabs & Product Box grid */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Category selector */}
                <div className="flex flex-wrap gap-2 bg-neutral-950 border border-neutral-800 p-2 rounded-2xl">
                  {["전체", "냉동생지/자재", "부자재/포장재", "소모품/집기"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-4 py-2.5 rounded-xl font-black text-xs transition-colors ${
                        activeCategory === cat
                          ? "bg-amber-400 text-neutral-950"
                          : "text-neutral-400 hover:text-white"
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
                        className="bg-neutral-950 border border-neutral-800 hover:border-neutral-700 transition-colors rounded-2xl overflow-hidden flex flex-col justify-between shadow-lg"
                      >
                        {/* Thumbnail image & stock state badge */}
                        <div className="h-44 relative bg-neutral-900 overflow-hidden shrink-0">
                          <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                          <div className="absolute top-3 left-3 flex gap-1.5">
                            {p.stock === "low_stock" && (
                              <span className="bg-orange-500 text-white font-black text-[9px] px-2 py-0.5 rounded shadow-md">품절임박</span>
                            )}
                            {p.stock === "out_of_stock" && (
                              <span className="bg-red-500 text-white font-black text-[9px] px-2 py-0.5 rounded shadow-md">일시품절</span>
                            )}
                          </div>
                          <span className="absolute bottom-3 right-3 bg-neutral-950/80 backdrop-blur-sm text-[10px] text-amber-400 font-black px-2 py-1 rounded">
                            {p.category}
                          </span>
                        </div>

                        {/* Product Info Block */}
                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <div className="space-y-1">
                            <span className="text-[10px] text-neutral-500 font-bold block">{p.packSize}</span>
                            <h3 className="font-extrabold text-base text-white leading-tight">{p.name}</h3>
                            <p className="text-[11px] text-neutral-400 font-medium leading-relaxed mt-1.5">{p.desc}</p>
                          </div>

                          <div className="flex items-center justify-between mt-5 border-t border-neutral-900 pt-4">
                            <strong className="text-base text-white font-black">{p.price.toLocaleString()} 원</strong>
                            
                            {cartQty > 0 ? (
                              <div className="flex items-center border border-neutral-800 bg-neutral-900 rounded-lg p-0.5">
                                <button 
                                  onClick={() => updateCartQty(p.id, cartQty - 1)}
                                  className="p-1 hover:text-white text-neutral-400 transition-colors"
                                >
                                  <Minus size={14} />
                                </button>
                                <span className="px-3 text-xs font-black text-white w-6 text-center">{cartQty}</span>
                                <button 
                                  onClick={() => updateCartQty(p.id, cartQty + 1)}
                                  className="p-1 hover:text-white text-neutral-400 transition-colors"
                                >
                                  <Plus size={14} />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => addToCart(p.id)}
                                className="px-4 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-xs font-bold text-amber-400 hover:text-amber-300 transition-all shadow-sm"
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
              <div className="lg:col-span-4 bg-neutral-950 border border-neutral-800 rounded-2xl p-6 sticky top-[96px] shadow-2xl space-y-6">
                <div className="flex items-center justify-between border-b border-neutral-850 pb-4">
                  <div className="flex items-center gap-2">
                    <ShoppingBag size={18} className="text-amber-400" />
                    <h3 className="font-extrabold text-base text-white">발주 장바구니</h3>
                  </div>
                  {cart.length > 0 && (
                    <button onClick={clearCart} className="text-[10px] font-bold text-neutral-500 hover:text-red-400 transition-colors flex items-center gap-1">
                      <Trash2 size={12} /> 비우기
                    </button>
                  )}
                </div>

                {cart.length === 0 ? (
                  <div className="py-16 text-center space-y-3">
                    <ShoppingBag size={36} className="text-neutral-800 mx-auto" />
                    <p className="text-xs text-neutral-500 font-bold leading-relaxed max-w-[180px] mx-auto">
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
                          <div key={item.productId} className="flex gap-3 justify-between items-center bg-neutral-900/30 border border-neutral-900 p-3 rounded-xl">
                            <img src={p.img} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0" />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-extrabold text-xs text-white truncate">{p.name}</h4>
                              <span className="text-[10px] text-neutral-500 font-semibold block">{p.price.toLocaleString()} 원 · {p.packSize}</span>
                            </div>
                            <div className="flex flex-col items-end gap-1.5 shrink-0">
                              <button onClick={() => removeCartItem(p.id)} className="text-neutral-600 hover:text-red-400 transition-colors p-1" aria-label="삭제">
                                <X size={13} />
                              </button>
                              <div className="flex items-center border border-neutral-800 bg-neutral-950 rounded-lg p-0.5">
                                <button onClick={() => updateCartQty(p.id, item.quantity - 1)} className="p-0.5 hover:text-white text-neutral-500 transition-colors">
                                  <Minus size={11} />
                                </button>
                                <span className="px-2 text-[10px] font-black text-white w-4 text-center">{item.quantity}</span>
                                <button onClick={() => updateCartQty(p.id, item.quantity + 1)} className="p-0.5 hover:text-white text-neutral-500 transition-colors">
                                  <Plus size={11} />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Cart Bill Details */}
                    <div className="border-t border-neutral-850 pt-4 space-y-2.5 text-xs">
                      <div className="flex justify-between text-neutral-400 font-bold">
                        <span>상품 합계</span>
                        <span>{cartSubtotal.toLocaleString()} 원</span>
                      </div>
                      <div className="flex justify-between text-neutral-400 font-bold">
                        <span>배송비 (5만원 이상 무료)</span>
                        <span>{shippingFee === 0 ? "무료" : "3,000 원"}</span>
                      </div>
                      <div className="flex justify-between text-white font-black text-sm border-t border-neutral-900 pt-3">
                        <span>최종 발주 금액</span>
                        <span className="text-amber-400">{cartTotal.toLocaleString()} 원</span>
                      </div>
                    </div>

                    {/* Order action button */}
                    <button 
                      onClick={placeOrder}
                      className="pink-primary-button w-full py-4 bg-amber-400 hover:bg-amber-300 text-neutral-950 text-sm font-black rounded-xl transition-all shadow-[0_4px_20px_rgba(251,191,36,0.25)] flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 size={16} />
                      자재 발주 신청하기
                    </button>
                  </>
                )}

              </div>
            </div>
          )}

          {/* ==========================================
              MENU CONTENT: 3. ORDER HISTORY
             ========================================== */}
          {currentMenu === "history" && (
            <div className="space-y-6">
              
              {/* Title Section */}
              <div>
                <h2 className="text-xl font-black text-white">정기 자재 발주 내역</h2>
                <p className="text-xs text-neutral-500 font-bold mt-1">강남역삼점에서 신청한 역대 자재 발주 히스토리와 배송 현황입니다.</p>
              </div>

              {/* Order List Table */}
              <div className="bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-neutral-900 border-b border-neutral-800 text-[11px] font-black text-neutral-400 uppercase tracking-wider">
                        <th className="p-4 sm:p-5">발주 코드</th>
                        <th className="p-4 sm:p-5">신청 일자</th>
                        <th className="p-4 sm:p-5">주문 품목 요약</th>
                        <th className="p-4 sm:p-5">총 결제 대금</th>
                        <th className="p-4 sm:p-5">배송 상태</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-850 text-xs">
                      {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-neutral-900/10 transition-colors">
                          <td className="p-4 sm:p-5 font-extrabold text-neutral-300">{order.id}</td>
                          <td className="p-4 sm:p-5 text-neutral-500 font-bold">{order.date}</td>
                          <td className="p-4 sm:p-5">
                            <span className="font-extrabold text-white">
                              {order.items[0].productName} {order.items.length > 1 ? `외 ${order.items.length - 1}건` : ""}
                            </span>
                            <span className="text-[10px] text-neutral-500 block font-bold mt-0.5">
                              {order.items.map(item => `${item.productName} ${item.quantity}개`).join(", ")}
                            </span>
                          </td>
                          <td className="p-4 sm:p-5 font-black text-amber-400">{order.totalPrice.toLocaleString()} 원</td>
                          <td className="p-4 sm:p-5">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                              order.status === "배송중" 
                                ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" 
                                : order.status === "배송완료" 
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                                : "bg-amber-400/10 text-amber-400 border border-amber-400/20"
                            }`}>
                              {order.status === "배송중" && <Truck size={12} className="animate-pulse" />}
                              {order.status === "배송완료" && <Check size={12} />}
                              {order.status === "주문완료" && <Clock size={12} />}
                              {order.status === "배송준비중" && <Clock size={12} />}
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
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
              
              {/* Title Section */}
              <div>
                <h2 className="text-xl font-black text-white">가맹점 공지사항</h2>
                <p className="text-xs text-neutral-500 font-bold mt-1">본사 가맹지원본부에서 사장님들께 드리는 정기 물류, 조리 가이드, 마케팅 공지입니다.</p>
              </div>

              {/* Notice List Cards */}
              <div className="grid grid-cols-1 gap-4">
                {notices.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => setSelectedNotice(n)}
                    className="w-full text-left bg-neutral-950 border border-neutral-800 hover:border-neutral-700 transition-all rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group shadow-md"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded ${
                          n.tag === "필독" 
                            ? "bg-red-500/10 text-red-400 border border-red-500/20" 
                            : n.tag === "신메뉴"
                            ? "bg-amber-400/15 text-amber-400 border border-amber-400/20"
                            : "bg-neutral-800 text-neutral-400"
                        }`}>
                          {n.tag}
                        </span>
                        <h3 className="font-extrabold text-base text-neutral-200 group-hover:text-white leading-tight">
                          {n.title}
                        </h3>
                      </div>
                      <p className="text-xs text-neutral-500 font-bold">
                        {n.date} · 본사 가맹사업지원팀 · 조회수 {n.views}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-neutral-600 group-hover:text-amber-400 transition-colors shrink-0 flex items-center gap-1.5 self-end sm:self-center">
                      상세 읽기 <ChevronRight size={14} />
                    </span>
                  </button>
                ))}
              </div>

            </div>
          )}

          {/* ==========================================
              MENU CONTENT: 5. 1:1 INQUIRY
             ========================================== */}
          {currentMenu === "inquiry" && (
            <div className="space-y-6">
              
              {/* Title Section & write button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-white">가맹점 1:1 전용 문의</h2>
                  <p className="text-xs text-neutral-500 font-bold mt-1">물류 파손 오배송, 장비 고장 AS 접수, 매장 홍보 추가 지원 신청 등 빠른 해결을 돕습니다.</p>
                </div>
                <button
                  onClick={() => setShowInquiryModal(true)}
                  className="pink-primary-button inline-flex items-center justify-center gap-1.5 px-5 py-3 bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-black rounded-lg transition-all shadow-[0_4px_16px_rgba(251,191,36,0.2)] shrink-0 self-start sm:self-center"
                >
                  <Send size={13} />
                  신규 1:1 문의 접수
                </button>
              </div>

              {/* Inquiry List Cards */}
              <div className="grid grid-cols-1 gap-4">
                {inquiries.map((inq) => (
                  <button
                    key={inq.id}
                    onClick={() => setSelectedInquiry(inq)}
                    className="w-full text-left bg-neutral-950 border border-neutral-800 hover:border-neutral-700 transition-all rounded-2xl p-5 flex flex-col justify-between gap-3 group shadow-md"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-amber-500 tracking-wider uppercase bg-amber-400/5 px-2 py-0.5 rounded border border-amber-400/10">
                          {inq.category}
                        </span>
                        <h3 className="font-extrabold text-base text-neutral-200 group-hover:text-white leading-tight">
                          {inq.title}
                        </h3>
                      </div>
                      <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full shrink-0 ${
                        inq.status === "답변완료" 
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                          : "bg-amber-400/10 text-amber-400 border border-amber-400/20"
                      }`}>
                        {inq.status}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-[11px] text-neutral-500 font-bold border-t border-neutral-900 pt-3 mt-1 w-full">
                      <span>접수번호: {inq.id} · 접수일자: {inq.date}</span>
                      <span className="text-neutral-600 group-hover:text-amber-400 transition-colors flex items-center gap-1">상세 대화 보기 <ChevronRight size={13} /></span>
                    </div>
                  </button>
                ))}
              </div>

            </div>
          )}

          {/* ==========================================
              MENU CONTENT: 6. TRAINING MATERIALS
             ========================================== */}
          {currentMenu === "training" && (
            <div className="space-y-6">
              
              {/* Title Section */}
              <div>
                <h2 className="text-xl font-black text-white">가맹점 교육/매뉴얼 자료실</h2>
                <p className="text-xs text-neutral-500 font-bold mt-1">안정적이고 표준화된 파이 및 에그빵 제조 오퍼레이션을 돕기 위한 필수 지침서 및 교안 영상입니다.</p>
              </div>

              {/* Materials Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {trainings.map((t) => (
                  <div 
                    key={t.id}
                    className="bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden flex flex-col justify-between shadow-lg"
                  >
                    {t.img ? (
                      <div className="h-44 bg-neutral-900 overflow-hidden relative shrink-0">
                        <img src={t.img} alt="" className="w-full h-full object-cover" />
                        <span className="absolute bottom-3 right-3 bg-neutral-950/80 backdrop-blur-sm text-[10px] text-amber-400 font-black px-2.5 py-1 rounded">
                          {t.format}
                        </span>
                      </div>
                    ) : (
                      <div className="h-44 bg-neutral-900 flex items-center justify-center shrink-0 border-b border-neutral-850 relative">
                        <BookOpen size={48} className="text-neutral-800" />
                        <span className="absolute bottom-3 right-3 bg-neutral-950/80 backdrop-blur-sm text-[10px] text-amber-400 font-black px-2.5 py-1 rounded">
                          {t.format}
                        </span>
                      </div>
                    )}

                    <div className="p-5 flex-1 flex flex-col justify-between gap-5">
                      <div className="space-y-2">
                        <span className="text-[10px] text-neutral-500 font-bold block">{t.date} · 크기 {t.size}</span>
                        <h3 className="font-extrabold text-base text-white leading-tight">{t.title}</h3>
                        <p className="text-xs text-neutral-400 font-medium leading-relaxed">{t.desc}</p>
                      </div>

                      <div className="flex items-center gap-2 mt-2 w-full">
                        <button
                          onClick={() => setSelectedMaterial(t)}
                          className="flex-1 px-4 py-2.5 rounded-lg bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-xs font-bold text-neutral-350 hover:text-white transition-colors"
                        >
                          상세보기
                        </button>
                        <button
                          onClick={() => simulateDownload(t.title)}
                          className="px-4 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-black transition-colors flex items-center justify-center gap-1.5 shrink-0"
                        >
                          <Download size={13} /> 다운로드
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* ==========================================
              MENU CONTENT: 7. PR/MARKETING MATERIALS
             ========================================== */}
          {currentMenu === "pr" && (
            <div className="space-y-6">
              
              {/* Title Section */}
              <div>
                <h2 className="text-xl font-black text-white">가맹점 홍보/마케팅 자재실</h2>
                <p className="text-xs text-neutral-500 font-bold mt-1">매장 윈도우 스티커, 테이블용 배너, 배달 플랫폼 등록용 캐릭터 썸네일 고화질 원본 그래픽 패키지입니다.</p>
              </div>

              {/* PR Materials Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {prs.map((p) => (
                  <div 
                    key={p.id}
                    className="bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden flex flex-col justify-between shadow-lg"
                  >
                    {p.img ? (
                      <div className="h-44 bg-neutral-900 overflow-hidden relative shrink-0">
                        <img src={p.img} alt="" className="w-full h-full object-cover" />
                        <span className="absolute bottom-3 right-3 bg-neutral-950/80 backdrop-blur-sm text-[10px] text-amber-400 font-black px-2.5 py-1 rounded">
                          {p.format}
                        </span>
                      </div>
                    ) : (
                      <div className="h-44 bg-neutral-900 flex items-center justify-center shrink-0 border-b border-neutral-850 relative">
                        <Image size={48} className="text-neutral-800" />
                        <span className="absolute bottom-3 right-3 bg-neutral-950/80 backdrop-blur-sm text-[10px] text-amber-400 font-black px-2.5 py-1 rounded">
                          {p.format}
                        </span>
                      </div>
                    )}

                    <div className="p-5 flex-1 flex flex-col justify-between gap-5">
                      <div className="space-y-2">
                        <span className="text-[10px] text-neutral-500 font-bold block">{p.date} · 크기 {p.size}</span>
                        <h3 className="font-extrabold text-base text-white leading-tight">{p.title}</h3>
                        <p className="text-xs text-neutral-400 font-medium leading-relaxed">{p.desc}</p>
                      </div>

                      <div className="flex items-center gap-2 mt-2 w-full">
                        <button
                          onClick={() => setSelectedMaterial(p)}
                          className="flex-1 px-4 py-2.5 rounded-lg bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-xs font-bold text-neutral-350 hover:text-white transition-colors"
                        >
                          상세보기
                        </button>
                        <button
                          onClick={() => simulateDownload(p.title)}
                          className="px-4 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-black transition-colors flex items-center justify-center gap-1.5 shrink-0"
                        >
                          <Download size={13} /> 다운로드
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

        </main>
      </div>

      {/* MOBILE BOTTOM NAVIGATION BAR FOR NATIVE APP UX */}
      <nav className="lg:hidden shrink-0 bg-neutral-950 border-t border-neutral-800 grid grid-cols-5 p-1 relative z-30 shadow-[0_-8px_30px_rgba(0,0,0,0.5)]">
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
              currentMenu === item.key ? "text-amber-400 font-black" : "text-neutral-500 font-bold"
            }`}
          >
            <item.icon size={18} />
            <span className="text-[9px] mt-1">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* ==========================================
          MODALS & DIALOGS SECTION
         ========================================== */}
      
      {/* 1. Notice Reading Modal */}
      {selectedNotice && (
        <div 
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedNotice(null)}
        >
          <div 
            className="w-full max-w-2xl bg-neutral-950 border border-neutral-800 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-neutral-850 flex justify-between items-center bg-neutral-900/50">
              <div className="flex items-center gap-2">
                <span className="bg-red-500/10 text-red-400 text-[10px] font-black px-2 py-0.5 rounded border border-red-500/20">
                  {selectedNotice.tag}
                </span>
                <span className="text-xs text-neutral-500 font-bold">{selectedNotice.date} · 조회수 {selectedNotice.views}</span>
              </div>
              <button onClick={() => setSelectedNotice(null)} className="p-1.5 text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800 rounded-lg">
                <X size={15} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              <h3 className="text-xl font-black text-white leading-tight">{selectedNotice.title}</h3>
              <div className="h-px bg-neutral-850 w-full my-4"></div>
              <p className="text-xs sm:text-sm text-neutral-350 leading-relaxed font-medium whitespace-pre-wrap">
                {selectedNotice.content}
              </p>
            </div>

            <div className="p-5 border-t border-neutral-850 bg-neutral-900/30 text-center">
              <button 
                onClick={() => setSelectedNotice(null)}
                className="px-6 py-2.5 rounded-lg bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-xs font-bold text-neutral-300 hover:text-white transition-colors"
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
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedInquiry(null)}
        >
          <div 
            className="w-full max-w-2xl bg-neutral-950 border border-neutral-800 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-neutral-850 flex justify-between items-center bg-neutral-900/50">
              <div className="flex items-center gap-2">
                <span className="bg-amber-400/10 text-amber-400 text-[10px] font-black px-2.5 py-0.5 rounded border border-amber-400/20">
                  {selectedInquiry.category}
                </span>
                <span className="text-xs text-neutral-500 font-bold">접수번호: {selectedInquiry.id} · {selectedInquiry.date}</span>
              </div>
              <button onClick={() => setSelectedInquiry(null)} className="p-1.5 text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800 rounded-lg">
                <X size={15} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              <div className="space-y-3">
                <h3 className="text-lg font-black text-white leading-tight">{selectedInquiry.title}</h3>
                <div className="bg-neutral-900/50 border border-neutral-850 p-4 rounded-2xl">
                  <span className="text-[10px] text-neutral-500 font-bold block mb-2">사장님 문의 내용:</span>
                  <p className="text-xs sm:text-sm text-neutral-350 leading-relaxed font-medium whitespace-pre-wrap">
                    {selectedInquiry.content}
                  </p>
                </div>
              </div>

              {selectedInquiry.answer ? (
                <div className="space-y-3 border-t border-neutral-850 pt-6">
                  <h4 className="text-sm font-black text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 size={16} /> 본사 전문 답변완료
                  </h4>
                  <div className="bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-2xl">
                    <span className="text-[10px] text-emerald-500/70 font-bold block mb-2">가맹본사 답변부서 피드백:</span>
                    <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-medium whitespace-pre-wrap">
                      {selectedInquiry.answer}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 border-t border-neutral-850 pt-6">
                  <h4 className="text-sm font-black text-amber-400 flex items-center gap-1.5">
                    <Clock size={16} /> 본사 답변 대기중
                  </h4>
                  <div className="bg-amber-400/5 border border-amber-400/10 p-4 rounded-2xl">
                    <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-medium">
                      점주님께서 올려주신 소중한 문의 사항이 본사 고객케어팀 및 기술 오퍼레이션 본부로 긴급 전달되었습니다. 최대한 상세하게 검토 후 12시간 이내에 친절하고 정확하게 피드백 및 기기 AS 상담을 지원하겠습니다. 조금만 기다려 주시기 바랍니다.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-5 border-t border-neutral-850 bg-neutral-900/30 text-center">
              <button 
                onClick={() => setSelectedInquiry(null)}
                className="px-6 py-2.5 rounded-lg bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-xs font-bold text-neutral-300 hover:text-white transition-colors"
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
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedMaterial(null)}
        >
          <div 
            className="w-full max-w-2xl bg-neutral-950 border border-neutral-800 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-neutral-850 flex justify-between items-center bg-neutral-900/50">
              <div className="flex items-center gap-2">
                <span className="bg-amber-400/15 text-amber-400 text-[10px] font-black px-2 py-0.5 rounded border border-amber-400/20">
                  {selectedMaterial.format}
                </span>
                <span className="text-xs text-neutral-500 font-bold">{selectedMaterial.date} · 크기 {selectedMaterial.size}</span>
              </div>
              <button onClick={() => setSelectedMaterial(null)} className="p-1.5 text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800 rounded-lg">
                <X size={15} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 flex-1">
              {selectedMaterial.img && (
                <div className="w-full h-48 rounded-xl overflow-hidden bg-neutral-900">
                  <img src={selectedMaterial.img} alt="" className="w-full h-full object-cover" />
                </div>
              )}
              <h3 className="text-lg font-black text-white leading-tight">{selectedMaterial.title}</h3>
              <div className="bg-neutral-900/50 border border-neutral-850 p-4 rounded-2xl">
                <span className="text-[10px] text-neutral-500 font-bold block mb-1">자료 세부 요약 설명:</span>
                <p className="text-xs sm:text-sm text-neutral-350 leading-relaxed font-medium">
                  {selectedMaterial.desc}
                </p>
              </div>
            </div>

            <div className="p-5 border-t border-neutral-850 bg-neutral-900/30 flex items-center justify-center gap-2.5">
              <button 
                onClick={() => setSelectedMaterial(null)}
                className="px-6 py-2.5 rounded-lg bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-xs font-bold text-neutral-300 hover:text-white transition-colors"
              >
                닫기
              </button>
              <button 
                onClick={() => {
                  setSelectedMaterial(null);
                  simulateDownload(selectedMaterial.title);
                }}
                className="px-6 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-black transition-colors flex items-center gap-1.5"
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
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setShowInquiryModal(false)}
        >
          <div 
            className="w-full max-w-xl bg-neutral-950 border border-neutral-800 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-neutral-850 flex justify-between items-center bg-neutral-900/50">
              <h3 className="text-base font-black text-white">신규 1:1 가맹상담 문의 접수</h3>
              <button onClick={() => setShowInquiryModal(false)} className="p-1.5 text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800 rounded-lg">
                <X size={15} />
              </button>
            </div>

            <form onSubmit={submitInquiry} className="p-6 overflow-y-auto space-y-5 flex-1 text-xs sm:text-sm">
              <div className="flex flex-col gap-2">
                <label className="font-extrabold text-neutral-300">문의 유형 선택</label>
                <select 
                  value={inquiryCategory}
                  onChange={(e) => setInquiryCategory(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400 appearance-none cursor-pointer"
                >
                  <option value="물류">물류 배송 / 자재 훼손 오배송 건</option>
                  <option value="기술/AS">조리 타이머 및 집기 AS 수리 접수</option>
                  <option value="마케팅">매장 POP / 캐릭터 시각 홍보 추가 지원</option>
                  <option value="대금/정산">물류 대금 결제 / 가맹 정산 문의</option>
                  <option value="기타">기타 매장 운영 애로사항 접수</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-extrabold text-neutral-300">문의 제목</label>
                <input 
                  type="text"
                  placeholder="예시) 로제 생지 오배송 건 확인 요청"
                  value={inquiryTitle}
                  onChange={(e) => setInquiryTitle(e.target.value)}
                  required
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-extrabold text-neutral-300">문의 세부 내용</label>
                <textarea 
                  rows={5}
                  placeholder="발생 일시, 품목명, 상황 등을 최대한 상세히 기입해주시면 한층 정밀하고 신속한 AS 및 지원 처리가 가능합니다."
                  value={inquiryContent}
                  onChange={(e) => setInquiryContent(e.target.value)}
                  required
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              <button 
                type="submit"
                className="pink-primary-button w-full py-4 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-black text-sm rounded-xl transition-all shadow-[0_4px_24px_rgba(251,191,36,0.3)] mt-2"
              >
                본사 AS 문의 접수하기
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
