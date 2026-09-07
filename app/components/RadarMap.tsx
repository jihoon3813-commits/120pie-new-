"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  MapPin,
  ShieldCheck,
  Building2,
  Gamepad2,
  BookOpen,
  GraduationCap,
  Baby,
  Coffee,
  Sparkles,
  Search,
  Plus,
  Trash2,
  ExternalLink,
  Phone,
  Smartphone,
  Mail,
  Share2,
  Lock,
  Unlock,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Maximize2,
  Minimize2,
  Crosshair,
  X,
  Navigation,
  Compass,
  Check,
  ChevronDown,
  Target,
  CheckSquare,
  Square,
  RotateCcw,
  Ruler,
  Disc,
  ShieldAlert,
  LocateFixed,
  Info,
  ChevronRight
} from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

declare global {
  interface Window {
    naver: any;
  }
}

export interface RadarMapProps {
  mode: "admin" | "partner";
  partnerId?: string;
  partnerName?: string;
}

// 업종별 설정 (아이콘, 뱃지 레이블)
const CATEGORY_CONFIG: {
  [key: string]: {
    icon: any;
    label: string;
    badgeBg: string;
  };
} = {
  "카페/디저트": {
    icon: Coffee,
    label: "일반 카페 / 베이커리 (스타벅스, 투썸, 이디야, 메가 등)",
    badgeBg: "bg-rose-50 text-rose-700 border-rose-200",
  },
  "PC방": {
    icon: Gamepad2,
    label: "PC방 (아이센스리그, 스타덤, 쓰리팝, 메가 등)",
    badgeBg: "bg-blue-50 text-blue-700 border-blue-200",
  },
  "만화카페": {
    icon: BookOpen,
    label: "만화카페 (놀숲, 벌툰, 심심푸리, 카툰트리 등)",
    badgeBg: "bg-purple-50 text-purple-700 border-purple-200",
  },
  "스터디카페": {
    icon: GraduationCap,
    label: "스터디카페 (작심, 랭, 초심, 하우스터디 등)",
    badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  "키즈카페": {
    icon: Baby,
    label: "키즈카페 (챔피언, 뽀로로, 릴리펏, 타요 등)",
    badgeBg: "bg-amber-50 text-amber-700 border-amber-200",
  },
  "보드게임카페": {
    icon: Sparkles,
    label: "보드게임카페 (히어로, 레드버튼, 비트 등)",
    badgeBg: "bg-pink-50 text-pink-700 border-pink-200",
  },
  "멀티방/파티룸": {
    icon: Building2,
    label: "멀티방 / 파티룸 / 룸카페",
    badgeBg: "bg-cyan-50 text-cyan-700 border-cyan-200",
  },
  "기타 샵인샵": {
    icon: Building2,
    label: "기타 샵인샵 매장",
    badgeBg: "bg-slate-50 text-slate-700 border-slate-200",
  },
};

const DISCOVER_OPTIONS = [
  { id: "카페/디저트", name: "일반 카페 / 베이커리 (스타벅스, 투썸, 메가 등)", icon: Coffee, desc: "테이크아웃/디저트 샵인샵 핵심 타겟" },
  { id: "PC방", name: "PC방 (아이센스리그, 스타덤, 쓰리팝 등)", icon: Gamepad2, desc: "간편 조리 식음료 파이 샵인샵" },
  { id: "만화카페", name: "만화카페 (놀숲, 벌툰, 심심푸리 등)", icon: BookOpen, desc: "휴식 공간 스낵 파이 타겟" },
  { id: "스터디카페", name: "스터디카페 (작심, 랭, 초심 등)", icon: GraduationCap, desc: "학원가/수험생 간식 파이 타겟" },
  { id: "키즈카페", name: "키즈카페 (챔피언, 뽀로로, 릴리펏 등)", icon: Baby, desc: "가족/어린이 파이 간식 타겟" },
  { id: "보드게임카페", name: "보드게임카페 (히어로, 비트 등)", icon: Sparkles, desc: "놀이 공간 파이 스낵 타겟" },
  { id: "멀티방/파티룸", name: "멀티방 / 파티룸", icon: Building2, desc: "파티룸 핑거푸드 타겟" },
];

// 주요 상권 프리셋
const REGION_PRESETS = [
  { name: "전국 전체", sido: "전체", lat: 36.3, lng: 127.8, zoom: 8 },
  { name: "서울 강남역/역삼", sido: "서울특별시", lat: 37.4981, lng: 127.0283, zoom: 16 },
  { name: "서울 홍대/합정", sido: "서울특별시", lat: 37.5558, lng: 126.9242, zoom: 16 },
  { name: "경기 성남 분당", sido: "경기도", lat: 37.3852, lng: 127.1235, zoom: 16 },
  { name: "부산 서면/전포", sido: "부산광역시", lat: 35.1558, lng: 129.0602, zoom: 16 },
  { name: "대구 동성로", sido: "대구광역시", lat: 35.8692, lng: 128.5968, zoom: 16 },
];

// 위도/경도 간 거리 계산 공식 (Haversine Formula, 단위: 미터)
export const calcDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371e3;
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

export default function RadarMap({ mode, partnerId, partnerName }: RadarMapProps) {
  // 1. Convex Queries & Mutations
  const targets = useQuery(api.targets.list, {}) || [];
  const convexStores = useQuery(api.stores.get) || [];
  const updateStoreCoordinatesMutation = useMutation(api.stores.updateCoordinates);
  const seedTargetsMutation = useMutation(api.targets.seedTargets);
  const resetAndSeedTargetsMutation = useMutation(api.targets.resetAndSeedTargets);
  const toggleContractMutation = useMutation(api.targets.toggleContract);
  const createOrUpdateMutation = useMutation(api.targets.createOrUpdate);
  const deleteTargetMutation = useMutation(api.targets.deleteTarget);
  const batchAddTargetsMutation = useMutation(api.targets.batchAddTargets);
  const replaceUncontractedTargetsMutation = useMutation(api.targets.replaceUncontractedTargets);
  const deduplicateAndFixMutation = useMutation(api.targets.deduplicateAndFixTargets);

  useEffect(() => {
    deduplicateAndFixMutation().catch(() => {});
  }, []);

  // 1-1. 실제 가맹점 관리(stores 테이블)의 승인된 120PIE 공식 가맹점 매핑
  const DEFAULT_STORE_COORDS: Record<string, { lat: number; lng: number }> = {
    "120겹파이 DESSERT": { lat: 37.608765, lng: 127.061682 },
    "카페101": { lat: 37.538593, lng: 126.660898 },
    "120겹 파이 파주운정점": { lat: 37.734477, lng: 126.750681 },
    "120겹 파이 원주혁신도시점": { lat: 37.329411, lng: 127.988081 },
    "120겹 파이 영종하늘도시점": { lat: 37.489996, lng: 126.551790 },
    "120겹파이 안암점(카페데일리)": { lat: 37.586727, lng: 127.029811 },
    "120겹 파이 잠실점": { lat: 37.503810, lng: 127.096802 },
    "120겹파이 향동점(다색냥)": { lat: 37.598769, lng: 126.889374 },
    "120겹 파이 AK플라자 금정점": { lat: 37.372850, lng: 126.944923 },
    "120겹파이 잼인브라운점": { lat: 37.481984, lng: 127.014575 },
    "120겹파이 카페멈점": { lat: 37.258486, lng: 126.958029 },
    "120겹파이 더네이버커피점": { lat: 37.519959, lng: 126.912230 },
    "홍대입구점": { lat: 37.556890, lng: 126.923674 },
    "120겹파이 홍대입구점": { lat: 37.556890, lng: 126.923674 },
    "강남역삼점": { lat: 37.500024, lng: 127.036509 },
    "120겹파이 강남역삼점": { lat: 37.500024, lng: 127.036509 },
    "부산서면점": { lat: 35.157764, lng: 129.059036 },
    "120겹파이 부산서면점": { lat: 35.157764, lng: 129.059036 },
  };

  const [localStoresCache, setLocalStoresCache] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("120_stores");
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setLocalStoresCache(parsed);
          }
        }
      } catch (e) {}
    }
  }, []);

  const mergedStores = useMemo(() => {
    const fromConvex = convexStores || [];
    const fromLocal = localStoresCache || [];
    const map = new Map<string, any>();
    fromLocal.forEach((s: any) => {
      if (s && s.name) map.set(s.id || s.name, s);
    });
    fromConvex.forEach((s: any) => {
      if (s && s.name) map.set(s.id || s.name, s);
    });
    return Array.from(map.values());
  }, [convexStores, localStoresCache]);

  const approvedStores = useMemo(() => {
    return mergedStores
      .filter((s: any) => s && s.name && s.status !== "중지" && s.status !== "취소")
      .map((s: any) => {
        const lat = typeof s.lat === "number" ? s.lat : DEFAULT_STORE_COORDS[s.name]?.lat;
        const lng = typeof s.lng === "number" ? s.lng : DEFAULT_STORE_COORDS[s.name]?.lng;
        return {
          ...s,
          isRealStore: true,
          isContracted: true,
          lat: typeof lat === "number" ? lat : 37.5,
          lng: typeof lng === "number" ? lng : 127.0,
          category: "120PIE 공식 가맹점",
          displayName: s.name.startsWith("120") || s.name.startsWith("카페") ? s.name : `120PIE ${s.name}`,
        };
      });
  }, [mergedStores]);

  // 2. 필터 및 UI 상태
  const [selectedSido, setSelectedSido] = useState<string>("전체");
  const [selectedCategory, setSelectedCategory] = useState<string>("전체");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("전체");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<"split" | "map" | "table">("split");
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [selectedTarget, setSelectedTarget] = useState<any | null>(null);

  // 📱 모바일 환경 감지 및 모바일 전용 탭 ('map' | 'list')
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [mobileTab, setMobileTab] = useState<"map" | "list">("map");

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // 모바일 탭이 지도로 전환될 때 네이버 지도 리사이즈 트리거
  useEffect(() => {
    if (mobileTab === "map" && naverMapRef.current && window.naver?.maps) {
      setTimeout(() => {
        window.naver.maps.Event.trigger(naverMapRef.current, "resize");
      }, 100);
    }
  }, [mobileTab]);

  // 📏 2분할 뷰 좌/우 열 너비 조절 (기본 58%, 30%~75%)
  const [splitRatio, setSplitRatio] = useState<number>(58);
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const splitContainerRef = useRef<HTMLDivElement>(null);

  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!splitContainerRef.current) return;
      const rect = splitContainerRef.current.getBoundingClientRect();
      const newWidth = e.clientX - rect.left;
      const newRatio = Math.min(Math.max((newWidth / rect.width) * 100, 30), 75);
      setSplitRatio(newRatio);
      if (naverMapRef.current && window.naver && window.naver.maps) {
        window.naver.maps.Event.trigger(naverMapRef.current, "resize");
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setTimeout(() => {
        if (naverMapRef.current && window.naver && window.naver.maps) {
          window.naver.maps.Event.trigger(naverMapRef.current, "resize");
        }
      }, 50);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  // 🌟 상권 레이더 초기 로드 시 우측 모달이 자동으로 뜨지 않도록 기본 선택 비활성화

  // 🎯 가망대상 발굴 중복(멀티) 선택 모달 상태
  const [isDiscoverModalOpen, setIsDiscoverModalOpen] = useState<boolean>(false);
  const [selectedDiscoverCats, setSelectedDiscoverCats] = useState<string[]>([
    "카페/디저트",
    "PC방",
    "만화카페",
    "스터디카페",
  ]);
  const [isDiscovering, setIsDiscovering] = useState<boolean>(false);

  // 3. 네이버 지도 인스턴스 & 상태
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const naverMapRef = useRef<any>(null);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const markersRef = useRef<any[]>([]);
  const circlesRef = useRef<any[]>([]);
  const [isNaverScriptLoaded, setIsNaverScriptLoaded] = useState<boolean>(false);

  // 4. 모달 상태 (신규 등록 및 수정)
  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const [editingTargetId, setEditingTargetId] = useState<any | null>(null);
  const [isGeocoding, setIsGeocoding] = useState<boolean>(false);

  // 폼 필드 상태
  const [formName, setFormName] = useState<string>("");
  const [formCategory, setFormCategory] = useState<string>("카페/디저트");
  const [formSido, setFormSido] = useState<string>("서울특별시");
  const [formSigungu, setFormSigungu] = useState<string>("강남구");
  const [formDong, setFormDong] = useState<string>("역삼동");
  const [formRoadAddress, setFormRoadAddress] = useState<string>("");
  const [formDetailAddress, setFormDetailAddress] = useState<string>("");
  const [formLat, setFormLat] = useState<number>(37.4981);
  const [formLng, setFormLng] = useState<number>(127.0283);
  const [formPhone, setFormPhone] = useState<string>("");
  const [formMobile, setFormMobile] = useState<string>("");
  const [formEmail, setFormEmail] = useState<string>("");
  const [formInstagram, setFormInstagram] = useState<string>("");
  const [formHomepage, setFormHomepage] = useState<string>("");
  const [formStatus, setFormStatus] = useState<string>("영업가능");
  const [formIsContracted, setFormIsContracted] = useState<boolean>(false);
  const [formAssignedPartnerName, setFormAssignedPartnerName] = useState<string>("");
  const [formMemo, setFormMemo] = useState<string>("");

  // 5. 토스트 알림
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // 6. 📏 [500m 상권 반경 측정 도구 상태]
  const [isMeasureMode, setIsMeasureMode] = useState<boolean>(false);
  const [measureRadius, setMeasureRadius] = useState<number>(500); // 300, 500, 1000m
  const [measurePoint, setMeasurePoint] = useState<{
    lat: number;
    lng: number;
    address?: string;
    sourceName?: string;
  } | null>(null);
  const [isMeasurePanelOpen, setIsMeasurePanelOpen] = useState<boolean>(true);
  const [measureCategoryFilter, setMeasureCategoryFilter] = useState<string>("전체");
  const [measureSearchTerm, setMeasureSearchTerm] = useState<string>("");

  // 측정 오버레이 Ref
  const measureMarkerRef = useRef<any>(null);
  const measureCircleRef = useRef<any>(null);
  const isMeasureModeRef = useRef<boolean>(false);
  const measureRadiusRef = useRef<number>(500);
  const measurePointRef = useRef<any>(null);

  useEffect(() => {
    isMeasureModeRef.current = isMeasureMode;
  }, [isMeasureMode]);

  useEffect(() => {
    measureRadiusRef.current = measureRadius;
  }, [measureRadius]);

  useEffect(() => {
    measurePointRef.current = measurePoint;
  }, [measurePoint]);

  // 🎯 [실시간 500m 상권보호 레이더 판정]
  // 19개 실제 가맹점 기준 반경 500m 이내에 위치한 가망 매장은 실시간으로 🔒 [입점불가 업장]으로 자동 잠금 판정!
  const targetsWithProtection = useMemo(() => {
    return targets.map((t: any) => {
      if (t.isContracted) {
        return { ...t, isProtectedLocked: false, protectingStore: null, protectingDistance: 0 };
      }

      let isProtectedLocked = false;
      let protectingStore: any = null;
      let minDistance = Infinity;

      for (const store of approvedStores) {
        if (typeof store.lat === "number" && typeof store.lng === "number" && typeof t.lat === "number" && typeof t.lng === "number") {
          const dist = calcDistance(t.lat, t.lng, store.lat, store.lng);
          if (dist < minDistance) {
            minDistance = dist;
            if (dist <= 500) {
              isProtectedLocked = true;
              protectingStore = store;
            }
          }
        }
      }

      return {
        ...t,
        isProtectedLocked: isProtectedLocked || Boolean(t.isProtectedLocked),
        protectingStore: protectingStore || t.protectingStore,
        protectingDistance: minDistance !== Infinity ? Math.round(minDistance) : null,
      };
    });
  }, [targets, approvedStores]);

  // 📏 [측정 지점 기준 상권보호 침범 여부 및 가망 매장 분석 결과]
  const measureAnalysis = useMemo(() => {
    if (!measurePoint) return null;

    // 1. 가장 가까운 실제 공식 가맹점 탐색 & 상권보호 중복 판정
    let closestStore: any = null;
    let minStoreDistance = Infinity;

    approvedStores.forEach((store: any) => {
      if (typeof store.lat === "number" && typeof store.lng === "number") {
        const dist = calcDistance(measurePoint.lat, measurePoint.lng, store.lat, store.lng);
        if (dist < minStoreDistance) {
          minStoreDistance = dist;
          closestStore = store;
        }
      }
    });

    const roundedMinDist = minStoreDistance !== Infinity ? Math.round(minStoreDistance) : null;
    const isStoreConflict = roundedMinDist !== null && roundedMinDist <= measureRadius;
    const overlapDistance = isStoreConflict && roundedMinDist !== null ? measureRadius - roundedMinDist : 0;
    const safeMargin = !isStoreConflict && roundedMinDist !== null ? roundedMinDist - measureRadius : 0;

    // 2. 측정 반경(measureRadius) 내에 존재하는 모든 타겟 매장 리스트 & 업종별 통계
    const nearbyTargets = targetsWithProtection
      .filter((t: any) => {
        if (typeof t.lat === "number" && typeof t.lng === "number") {
          const dist = calcDistance(measurePoint.lat, measurePoint.lng, t.lat, t.lng);
          return dist <= measureRadius;
        }
        return false;
      })
      .map((t: any) => ({
        ...t,
        distFromMeasure: Math.round(calcDistance(measurePoint.lat, measurePoint.lng, t.lat, t.lng)),
      }))
      .sort((a: any, b: any) => a.distFromMeasure - b.distFromMeasure);

    const categoryCounts: Record<string, number> = {};
    nearbyTargets.forEach((t: any) => {
      const cat = t.category || "기타 샵인샵";
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    return {
      closestStore,
      minStoreDistance: roundedMinDist,
      isStoreConflict,
      overlapDistance,
      safeMargin,
      nearbyTargets,
      categoryCounts,
      totalNearbyTargets: nearbyTargets.length,
    };
  }, [measurePoint, measureRadius, approvedStores, targetsWithProtection]);

  // 📏 측정 패널 내 카테고리/검색어 필터링된 타겟 목록 (전체 목록 지원)
  const displayedNearbyTargets = useMemo(() => {
    if (!measureAnalysis?.nearbyTargets) return [];
    return measureAnalysis.nearbyTargets.filter((t: any) => {
      const matchCat =
        measureCategoryFilter === "전체" || (t.category || "기타 샵인샵") === measureCategoryFilter;
      const matchSearch =
        !measureSearchTerm.trim() ||
        t.name?.toLowerCase().includes(measureSearchTerm.toLowerCase()) ||
        t.roadAddress?.toLowerCase().includes(measureSearchTerm.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [measureAnalysis?.nearbyTargets, measureCategoryFilter, measureSearchTerm]);

  // 필터링된 타겟 데이터
  const filteredTargets = useMemo(() => {
    return targetsWithProtection.filter((t: any) => {
      const matchSido = selectedSido === "전체" || t.sido === selectedSido;
      const matchCategory = selectedCategory === "전체" || t.category === selectedCategory;
      const matchQuery =
        !searchQuery ||
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.roadAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.dong && t.dong.includes(searchQuery)) ||
        (t.phone && t.phone.includes(searchQuery)) ||
        (t.mobile && t.mobile.includes(searchQuery));

      let matchStatus = true;
      if (selectedStatusFilter === "영업가능") {
        matchStatus = !t.isContracted && !t.isProtectedLocked;
      } else if (selectedStatusFilter === "계약체결") {
        matchStatus = t.isContracted;
      } else if (selectedStatusFilter === "상권보호락" || selectedStatusFilter === "입점불가") {
        matchStatus = !t.isContracted && t.isProtectedLocked;
      }

      return matchSido && matchCategory && matchQuery && matchStatus;
    });
  }, [targetsWithProtection, selectedSido, selectedCategory, selectedStatusFilter, searchQuery]);

  // 📋 우측 리스트 탭 상태 ('contracted' | 'uncontracted' | 'all')
  const [listTab, setListTab] = useState<"contracted" | "uncontracted" | "all">("contracted");

  // 계약 체결 매장 목록 (공식 가맹점 + 체결 가망 매장)
  const contractedList = useMemo(() => {
    const contractedTargets = filteredTargets.filter((t: any) => t.isContracted);
    const matchedApprovedStores = approvedStores.filter((s: any) => {
      const matchSido = selectedSido === "전체" || (s.roadAddress && s.roadAddress.includes(selectedSido.replace("특별시", "").replace("광역시", "").replace("도", "")));
      const matchQuery =
        !searchQuery ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.roadAddress && s.roadAddress.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (s.phone && s.phone.includes(searchQuery)) ||
        (s.owner && s.owner.includes(searchQuery));
      return matchSido && matchQuery;
    });
    return [...matchedApprovedStores, ...contractedTargets];
  }, [approvedStores, filteredTargets, selectedSido, searchQuery]);

  // 미체결 영업대상 매장 목록 (영업가능 + 락)
  const uncontractedList = useMemo(() => {
    return filteredTargets.filter((t: any) => !t.isContracted);
  }, [filteredTargets]);

  // 현재 탭에 표시할 매장 리스트
  const currentTabList = useMemo(() => {
    if (listTab === "contracted") return contractedList;
    if (listTab === "uncontracted") return uncontractedList;
    return [...contractedList, ...uncontractedList];
  }, [listTab, contractedList, uncontractedList]);

  // 통계 지표 (실제 승인 가맹점 수 + 발굴 타겟)
  const totalCount = targetsWithProtection.length;
  const contractedCount = approvedStores.length;
  const protectedLockedCount = targetsWithProtection.filter((t: any) => t.isProtectedLocked).length;
  const availableTargetCount = targetsWithProtection.filter((t: any) => !t.isProtectedLocked).length;

  // ====================================================
  // 매장 상세 정보 카드 렌더링 함수 (지도 하단 및 전체화면 플로팅 팝업 공용)
  // ====================================================
  const renderStoreDetailCard = (target: any, onClose?: () => void, isFloating = false) => {
    if (!target) return null;
    const config = CATEGORY_CONFIG[target.category] || CATEGORY_CONFIG["기타 샵인샵"];

    return (
      <div className={`bg-white rounded-2xl ${isFloating ? "border border-slate-300 shadow-2xl p-5" : "border border-slate-200 shadow-md p-5"} space-y-4`}>
        {/* 매장 상태 헤더 뱃지 */}
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <span
            className={`text-xs font-black px-2.5 py-1 rounded-md border flex items-center gap-1.5 ${
              target.isRealStore || target.isContracted
                ? "bg-amber-50 text-amber-800 border-amber-300"
                : target.isProtectedLocked
                ? "bg-slate-100 text-slate-500 border-slate-300"
                : "bg-emerald-50 text-emerald-700 border-emerald-300"
            }`}
          >
            {target.isRealStore ? (
              <>
                <Sparkles size={13} className="text-amber-600" />
                <span>120PIE 공식 가맹점 (본사 500m 상권보호 작동 중)</span>
              </>
            ) : target.isContracted ? (
              <>
                <Sparkles size={13} className="text-amber-600" />
                <span>120겹파이 체결된 업장 (500m 상권보호 발동)</span>
              </>
            ) : target.isProtectedLocked ? (
              <>
                <Lock size={13} />
                <span>500m 입점불가 업장 (상권보호 제한)</span>
              </>
            ) : (
              <>
                <ShieldCheck size={13} />
                <span>영업가능 업장 (선점 유망 타겟!)</span>
              </>
            )}
          </span>

          {onClose && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="text-slate-400 hover:text-slate-700 p-1 border-0 cursor-pointer bg-transparent rounded-md hover:bg-slate-100 transition-colors"
              title="닫기"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* 매장명 & 업종 */}
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-black px-2 py-0.5 rounded border ${
                target.isRealStore
                  ? "bg-amber-100 text-amber-900 border-amber-300 font-black"
                  : config.badgeBg
              }`}
            >
              {target.category || "120PIE 공식 가맹점"}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {target.dong || target.roadAddress?.split(" ")[1] || ""}
            </span>
          </div>
          <h3 className="text-lg font-black text-[#0F172A] mt-1.5">
            {target.displayName || target.name}
          </h3>
          <p className="text-xs text-slate-500 font-bold mt-1 flex items-start gap-1">
            <MapPin size={13} className="shrink-0 mt-0.5 text-slate-400" />
            <span>{target.roadAddress} {target.detailAddress || ""}</span>
          </p>
        </div>

        {/* 바로가기 & 500m 측정 버튼 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <a
            href={`https://map.naver.com/p/search/${encodeURIComponent(target.displayName || target.name)}`}
            target="_blank"
            rel="noreferrer"
            className="py-2 px-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-black border border-emerald-200 flex items-center justify-center gap-1.5 transition-all"
          >
            <Navigation size={13} />
            <span>네이버 플레이스 보기</span>
            <ExternalLink size={11} />
          </a>

          <button
            onClick={() =>
              handleStartMeasureAt(
                target.lat,
                target.lng,
                target.roadAddress,
                target.displayName || target.name
              )
            }
            className="py-2 px-3 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-black border border-indigo-200 flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
          >
            <Ruler size={13} />
            <span>500m 상권 측정</span>
          </button>
        </div>

        {/* 실제 공식 가맹점 전용 카드 */}
        {target.isRealStore && (
          <div className="bg-gradient-to-br from-amber-50/80 to-orange-50/80 border border-amber-200 rounded-lg p-3.5 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-900">대표 점주명</span>
              <span className="font-black text-slate-900">{target.owner} 점주</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-900">가맹 등록일</span>
              <span className="font-mono text-slate-700">{target.regDate}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-900">가맹 상태</span>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                {target.status} (정상 운영중)
              </span>
            </div>
            {target.adoptionMenu && target.adoptionMenu.length > 0 && (
              <div className="space-y-1.5 pt-1.5 border-t border-amber-200/60">
                <span className="font-bold text-amber-900">도입 메뉴 브랜드</span>
                <div className="flex flex-wrap gap-1">
                  {target.adoptionMenu.map((menu: string, idx: number) => (
                    <span key={idx} className="px-2 py-0.5 rounded-full bg-white border border-amber-300 text-amber-800 text-[10px] font-bold shadow-2xs">
                      {menu}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 상권보호 안내 알림 상자 (락 걸린 경우) */}
        {target.isProtectedLocked && target.protectingStore && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 space-y-1">
            <div className="font-black flex items-center gap-1.5 text-rose-700">
              <AlertTriangle size={14} />
              <span>입점불가 락 사유:</span>
            </div>
            <p className="leading-relaxed">
              <strong>[{target.protectingStore.name}]</strong> 매장과 
              거리 <strong className="font-mono">{target.protectingDistance}m</strong>로 500m 보호 반경 내에 위치하여 추가 계약이 제한됩니다.
            </p>
          </div>
        )}

        {/* 연락처 정보 */}
        <div className="bg-[#F8FAFC] rounded-lg p-3.5 space-y-2 text-xs border border-neutral-200/80">
          <div className="flex items-center justify-between border-b border-neutral-200/60 pb-1.5">
            <span className="text-slate-500 font-bold flex items-center gap-1.5">
              <Phone size={13} className="text-slate-400" /> 매장 전화
            </span>
            <span className="font-mono font-bold text-slate-800">
              {target.phone || "전화번호 미등록"}
            </span>
          </div>
          {!target.isRealStore && (
            <>
              <div className="flex items-center justify-between border-b border-neutral-200/60 pb-1.5">
                <span className="text-slate-500 font-bold flex items-center gap-1.5">
                  <Smartphone size={13} className="text-slate-400" /> 대표자 핸드폰
                </span>
                <span className="font-mono font-black text-amber-700">
                  {target.mobile || "휴대폰 미등록"}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-neutral-200/60 pb-1.5">
                <span className="text-slate-500 font-bold flex items-center gap-1.5">
                  <Mail size={13} className="text-slate-400" /> 이메일
                </span>
                <span className="font-mono text-slate-700 truncate max-w-[180px]">
                  {target.email || "-"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-bold flex items-center gap-1.5">
                  <Share2 size={13} className="text-pink-500" /> SNS / 웹사이트
                </span>
                <div className="flex items-center gap-2">
                  {target.instagram && (
                    <a
                      href={target.instagram}
                      target="_blank"
                      rel="noreferrer"
                      className="text-pink-600 font-bold hover:underline flex items-center gap-0.5"
                    >
                      인스타 <ExternalLink size={10} />
                    </a>
                  )}
                  {target.homepage && (
                    <a
                      href={target.homepage}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 font-bold hover:underline flex items-center gap-0.5"
                    >
                      웹사이트 <ExternalLink size={10} />
                    </a>
                  )}
                  {!target.instagram && !target.homepage && (
                    <span className="text-slate-400">-</span>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* 메모 */}
        {target.memo && (
          <div className="p-3 bg-amber-50/50 rounded-lg border border-amber-100 text-xs space-y-1">
            <span className="text-[11px] font-bold text-amber-800">영업 / 상담 메모</span>
            <p className="text-slate-700 leading-relaxed whitespace-pre-line">{target.memo}</p>
          </div>
        )}

        {/* 본사 어드민 관리 액션 */}
        {mode === "admin" && (
          <div className="space-y-2 pt-2 border-t border-neutral-100">
            {!target.isRealStore ? (
              <>
                <button
                  onClick={() => handleToggleContract(target)}
                  className={`w-full py-2.5 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer border-0 shadow-xs ${
                    target.isContracted
                      ? "bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200"
                      : "bg-[#FED422] hover:bg-amber-400 text-[#0F172A]"
                  }`}
                >
                  {target.isContracted ? (
                    <>
                      <Unlock size={14} />
                      <span>계약 해제하기 (500m 락 풀기)</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} />
                      <span>+ 계약 체결하기 (500m 상권보호 발동)</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenForm(target)}
                    className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all border-0 cursor-pointer"
                  >
                    정보 수정
                  </button>
                  <button
                    onClick={() => handleDeleteTarget(target._id, target.name)}
                    className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-bold transition-all border border-rose-200 cursor-pointer"
                  >
                    삭제
                  </button>
                </div>
              </>
            ) : (
              <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200 text-center">
                <p className="text-xs font-black text-amber-900">
                  🛡️ 본사 공인 120PIE 가맹점
                </p>
                <p className="text-[10px] text-amber-700 mt-0.5">
                  반경 500m 내 모든 샵인샵 입점이 영구 보호됩니다.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // ====================================================
  // 1. 네이버 지도 SDK (v3) 스크립트 로드
  // ====================================================
  useEffect(() => {
    if (typeof window === "undefined") return;

    const clientId = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID || "xupnvf6y5y";
    const scriptId = "naver-map-radar-script";

    const handleLoaded = () => {
      setIsNaverScriptLoaded(true);
    };

    if (window.naver && window.naver.maps) {
      handleLoaded();
      return;
    }

    let script = document.getElementById(scriptId) as HTMLScriptElement;
    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}&submodules=geocoder`;
      script.async = true;
      script.onload = handleLoaded;
      document.head.appendChild(script);
    } else {
      script.addEventListener("load", handleLoaded);
    }

    return () => {
      if (script) {
        script.removeEventListener("load", handleLoaded);
      }
    };
  }, []);

  // ====================================================
  // 2. 네이버 지도 객체 초기화 & 뷰 전환 리사이즈 안정화
  // ====================================================
  useEffect(() => {
    if (!isNaverScriptLoaded || !mapContainerRef.current || !window.naver || !window.naver.maps) return;

    // 만약 이미 지도 인스턴스가 있고 DOM에 컨테이너가 잘 살아있는 경우 -> 리사이즈만 수행
    const isMapValid = naverMapRef.current && mapContainerRef.current.children.length > 0;

    if (isMapValid) {
      // 뷰모드 전환이나 크기 변화에 맞춰 50ms, 150ms, 300ms 3차례 리사이즈 트리거
      const t1 = setTimeout(() => {
        if (window.naver?.maps && naverMapRef.current) {
          window.naver.maps.Event.trigger(naverMapRef.current, "resize");
        }
      }, 50);
      const t2 = setTimeout(() => {
        if (window.naver?.maps && naverMapRef.current) {
          window.naver.maps.Event.trigger(naverMapRef.current, "resize");
        }
      }, 150);
      const t3 = setTimeout(() => {
        if (window.naver?.maps && naverMapRef.current) {
          window.naver.maps.Event.trigger(naverMapRef.current, "resize");
        }
      }, 300);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }

    const initialCenter = new window.naver.maps.LatLng(37.54, 126.98);
    const mapOptions = {
      center: initialCenter,
      zoom: 11,
      zoomControl: true,
      zoomControlOptions: {
        position: window.naver.maps.Position.TOP_RIGHT,
      },
      mapTypeControl: true,
      mapTypeControlOptions: {
        position: window.naver.maps.Position.TOP_LEFT,
      },
    };

    const map = new window.naver.maps.Map(mapContainerRef.current, mapOptions);

    // 지도 클릭 시: 일반 폼 좌표 캡처 및 측정 모드일 때 측정 핀 설정
    window.naver.maps.Event.addListener(map, "click", (e: any) => {
      const lat = parseFloat(e.coord.lat().toFixed(6));
      const lng = parseFloat(e.coord.lng().toFixed(6));
      setFormLat(lat);
      setFormLng(lng);

      if (window.naver.maps.Service && window.naver.maps.Service.reverseGeocode) {
        window.naver.maps.Service.reverseGeocode(
          { coords: new window.naver.maps.LatLng(lat, lng) },
          (status: any, response: any) => {
            if (status === window.naver.maps.Service.Status.OK && response.v2.address) {
              const road = response.v2.address.roadAddress || response.v2.address.jibunAddress;
              if (road) {
                setFormRoadAddress(road);
                if (isMeasureModeRef.current) {
                  setMeasurePoint((prev) => ({
                    lat,
                    lng,
                    address: road,
                  }));
                }
              }
            }
          }
        );
      }

      if (isMeasureModeRef.current) {
        setMeasurePoint({
          lat,
          lng,
          address: "위치 주소 확인 중...",
        });
        setIsMeasurePanelOpen(true);
      }
    });

    naverMapRef.current = map;
    setMapInstance(map);
  }, [isNaverScriptLoaded, viewMode, isFullscreen]);

  // 전체화면 토글
  const handleToggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
    setTimeout(() => {
      if (naverMapRef.current && window.naver && window.naver.maps) {
        window.naver.maps.Event.trigger(naverMapRef.current, "resize");
      }
    }, 150);
  };

  // ====================================================
  // 3-1. 📏 500m 측정 모드 마커 & 서클 렌더링
  // ====================================================
  useEffect(() => {
    const currentMap = mapInstance || naverMapRef.current;
    if (!currentMap || !window.naver || !window.naver.maps) return;
    const naver = window.naver;

    // 기존 측정 오버레이 정리
    if (measureMarkerRef.current) {
      measureMarkerRef.current.setMap(null);
      measureMarkerRef.current = null;
    }
    if (measureCircleRef.current) {
      measureCircleRef.current.setMap(null);
      measureCircleRef.current = null;
    }

    if (!measurePoint) return;

    const isConflict = measureAnalysis?.isStoreConflict;
    const strokeColor = isConflict ? "#DC2626" : "#4F46E5";
    const fillColor = isConflict ? "#EF4444" : "#6366F1";

    // 1) 측정 반경 서클 생성
    const circle = new naver.maps.Circle({
      map: currentMap,
      center: new naver.maps.LatLng(measurePoint.lat, measurePoint.lng),
      radius: measureRadius,
      fillColor: fillColor,
      fillOpacity: isConflict ? 0.25 : 0.18,
      strokeColor: strokeColor,
      strokeOpacity: 0.9,
      strokeWeight: 2.5,
      strokeStyle: isConflict ? "solid" : "dash",
      zIndex: 60,
    });
    measureCircleRef.current = circle;

    // 2) 드래그 가능한 측정 중심 핀 마커 생성
    const markerContent = `
      <div style="position: absolute; transform: translate(-50%, -50%); display: flex; flex-direction: column; align-items: center; cursor: grab; z-index: 120; pointer-events: auto;">
        <div style="position: absolute; top: -3px; width: 44px; height: 44px; background: ${isConflict ? "rgba(239, 68, 68, 0.4)" : "rgba(99, 102, 241, 0.4)"}; border-radius: 9999px; animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        <div style="width: 38px; height: 38px; border-radius: 9999px; background: ${isConflict ? "linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)" : "linear-gradient(135deg, #6366F1 0%, #4338CA 100%)"}; border: 3px solid #FFFFFF; box-shadow: 0 4px 15px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; color: #FFFFFF; font-size: 16px; z-index: 20;">
          📏
        </div>
        <div style="margin-top: 4px; padding: 3px 9px; background: rgba(15, 23, 42, 0.95); border: 1.5px solid ${isConflict ? "#F87171" : "#A5B4FC"}; border-radius: 6px; font-size: 11px; font-weight: 900; color: #FFFFFF; white-space: nowrap; box-shadow: 0 2px 8px rgba(0,0,0,0.4); z-index: 20;">
          ${measurePoint.sourceName ? `[${measurePoint.sourceName}] ` : ""}반경 ${measureRadius}m 측정 핀 (드래그 가능)
        </div>
      </div>
    `;

    const marker = new naver.maps.Marker({
      position: new naver.maps.LatLng(measurePoint.lat, measurePoint.lng),
      map: currentMap,
      draggable: true,
      icon: {
        content: markerContent,
        size: new naver.maps.Size(220, 70),
        anchor: new naver.maps.Point(0, 0),
      },
      zIndex: 120,
    });

    // 드래그 종료 시 좌표 업데이트 & 주소 역지오코딩
    naver.maps.Event.addListener(marker, "dragend", (e: any) => {
      const newLat = parseFloat(e.coord.lat().toFixed(6));
      const newLng = parseFloat(e.coord.lng().toFixed(6));
      setMeasurePoint((prev) => ({
        lat: newLat,
        lng: newLng,
        address: "위치 주소 확인 중...",
        sourceName: prev?.sourceName,
      }));

      if (window.naver.maps.Service && window.naver.maps.Service.reverseGeocode) {
        window.naver.maps.Service.reverseGeocode(
          { coords: new window.naver.maps.LatLng(newLat, newLng) },
          (status: any, response: any) => {
            if (status === window.naver.maps.Service.Status.OK && response.v2.address) {
              const road = response.v2.address.roadAddress || response.v2.address.jibunAddress;
              if (road) {
                setMeasurePoint((prev) => (prev ? { ...prev, address: road } : null));
              }
            }
          }
        );
      }
    });

    measureMarkerRef.current = marker;
  }, [mapInstance, measurePoint?.lat, measurePoint?.lng, measureRadius, measureAnalysis?.isStoreConflict]);

  // 특정 위치 기준 500m 반경 측정 시작 함수
  const handleStartMeasureAt = (lat: number, lng: number, address?: string, sourceName?: string) => {
    setIsMeasureMode(true);
    setIsMeasurePanelOpen(true);
    setMeasurePoint({
      lat,
      lng,
      address: address || "위치 주소 확인 중...",
      sourceName,
    });

    if (naverMapRef.current && window.naver && window.naver.maps) {
      naverMapRef.current.panTo(new window.naver.maps.LatLng(lat, lng), { duration: 300 });
      if (naverMapRef.current.getZoom() < 15) {
        naverMapRef.current.setZoom(16);
      }
    }

    if (!address && window.naver && window.naver.maps && window.naver.maps.Service?.reverseGeocode) {
      window.naver.maps.Service.reverseGeocode(
        { coords: new window.naver.maps.LatLng(lat, lng) },
        (status: any, response: any) => {
          if (status === window.naver.maps.Service.Status.OK && response.v2.address) {
            const road = response.v2.address.roadAddress || response.v2.address.jibunAddress;
            if (road) {
              setMeasurePoint((prev) => (prev ? { ...prev, address: road } : null));
            }
          }
        }
      );
    }

    triggerToast(`📏 ${sourceName ? `[${sourceName}] ` : ""}반경 ${measureRadius}m 측정이 활성화되었습니다.`);
  };

  // 측정 모드 토글
  const handleToggleMeasureMode = () => {
    if (isMeasureMode) {
      setIsMeasureMode(false);
      setMeasurePoint(null);
      triggerToast("반경 측정이 종료되었습니다.");
    } else {
      setIsMeasureMode(true);
      setIsMeasurePanelOpen(true);
      if (naverMapRef.current && window.naver && window.naver.maps) {
        const center = naverMapRef.current.getCenter();
        const centerLat = parseFloat(center.lat().toFixed(6));
        const centerLng = parseFloat(center.lng().toFixed(6));
        handleStartMeasureAt(centerLat, centerLng, undefined, "지도 중심");
      } else {
        triggerToast("지도에서 측정하고자 하는 위치를 클릭하세요.");
      }
    }
  };

  // 📍 스마트폰 GPS 기준 내 현재 위치로 지도 이동 & 500m 상권 반경 측정
  const handleMoveToMyLocation = () => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      alert("이 기기/브라우저에서는 위치 정보를 지원하지 않습니다.");
      return;
    }
    triggerToast("📍 현재 내 위치를 확인하는 중입니다...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = parseFloat(position.coords.latitude.toFixed(6));
        const lng = parseFloat(position.coords.longitude.toFixed(6));
        if (naverMapRef.current && window.naver && window.naver.maps) {
          const center = new window.naver.maps.LatLng(lat, lng);
          naverMapRef.current.setCenter(center);
          naverMapRef.current.setZoom(15);
          triggerToast("📍 현재 내 위치로 이동했습니다.");
          handleStartMeasureAt(lat, lng, "내 현재 위치", "내 위치 (500m 상권)");
        }
      },
      (err) => {
        alert("현재 위치 정보를 가져올 수 없습니다. 스마트폰 브라우저 설정에서 위치 권한(GPS)을 켜주세요.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // 측정 지점에서 신규 가망 타겟 등록 모달 열기
  const handleRegisterFromMeasure = () => {
    if (!measurePoint) return;
    setEditingTargetId(null);
    setFormName(measurePoint.sourceName || "");
    setFormCategory("카페/디저트");
    setFormRoadAddress(measurePoint.address || "");
    setFormDetailAddress("");
    setFormLat(measurePoint.lat);
    setFormLng(measurePoint.lng);
    setFormPhone("");
    setFormMobile("");
    setFormEmail("");
    setFormInstagram("");
    setFormHomepage("");
    setFormStatus("영업가능");
    setFormIsContracted(false);
    setFormAssignedPartnerName("");
    setFormMemo(
      `[500m 상권 측정 분석 기반 등록]\n- 측정 반경: ${measureRadius}m\n- 최근접 공식가맹점: ${measureAnalysis?.closestStore?.displayName || "없음"} (${measureAnalysis?.minStoreDistance}m)\n- 반경 내 가망타겟 수: ${measureAnalysis?.totalNearbyTargets}개`
    );
    setIsFormModalOpen(true);
  };

  // ====================================================
  // 3-2. 네이버 지도 상에 500m 원 및 3대 상태 핀 렌더링
  //    (🌟 실제 120PIE 체결 가맹점: 골드 스타 / 🔒 입점불가: 어두운 자물쇠 / 🟢 영업가능: 녹색 통일)
  // ====================================================
  useEffect(() => {
    const currentMap = mapInstance || naverMapRef.current;
    if (!currentMap || !window.naver || !window.naver.maps) return;

    const naver = window.naver;

    // 기존 마커 및 원 제거
    markersRef.current.forEach((m) => m.setMap(null));
    circlesRef.current.forEach((c) => c.setMap(null));
    markersRef.current = [];
    circlesRef.current = [];

    // 1) [🌟 120PIE 실제 공식 가맹점] 기준 반경 500m 원 (황금빛 상권보호 레이더 필드)
    approvedStores
      .filter((s: any) => typeof s.lat === "number" && typeof s.lng === "number")
      .forEach((cs: any) => {
        const circle = new naver.maps.Circle({
          map: currentMap,
          center: new naver.maps.LatLng(cs.lat, cs.lng),
          radius: 500,
          fillColor: "#FED422",
          fillOpacity: 0.22,
          strokeColor: "#D97706",
          strokeOpacity: 0.85,
          strokeWeight: 2,
          strokeStyle: "dash",
        });
        circlesRef.current.push(circle);
      });

    // 2) [🌟 120PIE 공식 가맹점 마커 렌더링] (골드 펄스 스타 핀)
    approvedStores
      .filter((s: any) => typeof s.lat === "number" && typeof s.lng === "number")
      .forEach((store: any) => {
        const markerContent = `
          <div style="position: absolute; transform: translate(-50%, -50%); display: flex; flex-direction: column; align-items: center; cursor: pointer; z-index: 50; pointer-events: auto;">
            <div style="position: absolute; top: -4px; width: 46px; height: 46px; background: rgba(254, 212, 34, 0.45); border-radius: 9999px; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="width: 38px; height: 38px; border-radius: 9999px; background: linear-gradient(135deg, #FED422 0%, #F59E0B 100%); border: 3px solid #FFFFFF; box-shadow: 0 4px 15px rgba(217, 119, 6, 0.7); display: flex; align-items: center; justify-content: center; color: #0F172A; font-weight: 900; font-size: 16px; z-index: 20;">
              ⭐
            </div>
            <div style="margin-top: 4px; padding: 3px 9px; background: rgba(15, 23, 42, 0.95); border: 1.5px solid #F59E0B; border-radius: 6px; font-size: 11px; font-weight: 900; color: #FED422; white-space: nowrap; box-shadow: 0 2px 8px rgba(0,0,0,0.4); z-index: 20;">
              ${store.displayName} (공식 가맹점)
            </div>
          </div>
        `;

        const marker = new naver.maps.Marker({
          position: new naver.maps.LatLng(store.lat, store.lng),
          map: currentMap,
          icon: {
            content: markerContent,
            size: new naver.maps.Size(180, 65),
            anchor: new naver.maps.Point(0, 0),
          },
          zIndex: 100,
        });

        naver.maps.Event.addListener(marker, "click", () => {
          setSelectedTarget(store);
          currentMap.panTo(new naver.maps.LatLng(store.lat, store.lng), { duration: 300 });
        });

        markersRef.current.push(marker);
      });

    // 3) [타겟 매장 목록 렌더링] (영업가능 🟢 / 500m 락 🔒 / 기타 체결 🌟)
    filteredTargets.forEach((target: any) => {
      const isLocked = target.isProtectedLocked;
      let markerContent = "";

      if (isLocked) {
        // 🔒 [입점불가 업장]: 500m 보호 구역 내 위치하여 락이 걸린 자물쇠 마커
        markerContent = `
          <div style="position: absolute; transform: translate(-50%, -50%); display: flex; flex-direction: column; align-items: center; cursor: pointer; pointer-events: auto; z-index: 20;">
            <div style="width: 26px; height: 26px; border-radius: 9999px; background: #475569; border: 1.5px solid #94A3B8; box-shadow: 0 2px 6px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: #FFFFFF; font-size: 11px;">
              🔒
            </div>
            <div style="margin-top: 2px; padding: 1.5px 6px; background: rgba(30, 41, 59, 0.92); border: 1px solid #64748B; border-radius: 4px; font-size: 9px; font-weight: bold; color: #E2E8F0; white-space: nowrap; box-shadow: 0 2px 5px rgba(0,0,0,0.25);">
              ${target.name}
            </div>
          </div>
        `;
      } else {
        // 🟢 [영업가능 업장]: 선명한 에메랄드 녹색 핀
        markerContent = `
          <div style="position: absolute; transform: translate(-50%, -50%); display: flex; flex-direction: column; align-items: center; cursor: pointer; pointer-events: auto; z-index: 30;">
            <div style="width: 28px; height: 28px; border-radius: 9999px; background: #10B981; border: 2px solid #FFFFFF; box-shadow: 0 3px 10px rgba(16, 185, 129, 0.45); display: flex; align-items: center; justify-content: center; color: #FFFFFF; font-weight: bold; font-size: 13px;">
              ☕
            </div>
            <div style="margin-top: 2px; padding: 2px 7px; background: #064E3B; border: 1px solid #10B981; border-radius: 5px; font-size: 10px; font-weight: bold; color: #FFFFFF; white-space: nowrap; box-shadow: 0 2px 6px rgba(0,0,0,0.3);">
              ${target.name}
            </div>
          </div>
        `;
      }

      const marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(target.lat, target.lng),
        map: currentMap,
        icon: {
          content: markerContent,
          size: new naver.maps.Size(160, 60),
          anchor: new naver.maps.Point(0, 0),
        },
      });

      naver.maps.Event.addListener(marker, "click", () => {
        setSelectedTarget(target);
        currentMap.panTo(new naver.maps.LatLng(target.lat, target.lng), { duration: 300 });
      });

      markersRef.current.push(marker);
    });
  }, [mapInstance, filteredTargets, approvedStores, isNaverScriptLoaded]);

  // 지역 프리셋 이동
  const handleSelectPreset = (preset: (typeof REGION_PRESETS)[0]) => {
    setSelectedSido(preset.sido);
    if (naverMapRef.current && window.naver && window.naver.maps) {
      const targetLatLng = new window.naver.maps.LatLng(preset.lat, preset.lng);
      naverMapRef.current.setCenter(targetLatLng);
      naverMapRef.current.setZoom(preset.zoom);
    }

    const targetInRegion = targets.find((t: any) => preset.sido === "전체" || t.sido === preset.sido);
    if (targetInRegion) {
      setSelectedTarget(targetInRegion);
    }
  };

  // 발굴된 가망 매장 목록 초기화 (실제 공식 가맹점만 표시)
  const handleClearDiscoveredTargets = async () => {
    if (!confirm("발굴된 가망 매장 목록을 모두 초기화하고 등록된 실제 공식 가맹점만 표시하시겠습니까?")) return;
    try {
      await resetAndSeedTargetsMutation();
      setSelectedTarget(approvedStores[0] || null);
      triggerToast("발굴 목록이 초기화되었습니다. 등록된 실제 가맹점만 표시됩니다.");
    } catch (err) {
      alert("초기화 중 오류가 발생했습니다.");
    }
  };

  // ====================================================
  // ====================================================
  // [가망대상 발굴]: 네이버 플레이스 등록 실존 매장 실시간 전수 발굴
  // ====================================================
  const handleExecuteDiscover = async () => {
    if (!naverMapRef.current) return;
    if (selectedDiscoverCats.length === 0) {
      alert("발굴할 타겟 업종을 1개 이상 선택해 주세요.");
      return;
    }

    setIsDiscoverModalOpen(false);
    setIsDiscovering(true);

    const center = naverMapRef.current.getCenter();
    const cLat = center.lat();
    const cLng = center.lng();

    let boundsPayload = null;
    if (naverMapRef.current.getBounds) {
      const b = naverMapRef.current.getBounds();
      boundsPayload = {
        sw: { lat: b.getMin().lat(), lng: b.getMin().lng() },
        ne: { lat: b.getMax().lat(), lng: b.getMax().lng() },
      };
    }

    // 1) 네이버 리버스 지오코더로 현재 화면 중앙의 시/도, 시/군/구, 읍/면/동 정밀 파악
    let currentSido = selectedSido !== "전체" ? selectedSido : "서울특별시";
    let currentSigungu = "";
    let currentDong = "";
    let regionQuery = "";

    if (window.naver && window.naver.maps && window.naver.maps.Service?.reverseGeocode) {
      await new Promise<void>((resolve) => {
        window.naver.maps.Service.reverseGeocode(
          { coords: new window.naver.maps.LatLng(cLat, cLng) },
          (status: any, response: any) => {
            if (status === window.naver.maps.Service.Status.OK && response.v2?.results) {
              const resObj = response.v2.results[0]?.region;
              if (resObj) {
                currentSido = resObj.area1?.name || currentSido;
                currentSigungu = resObj.area2?.name || "";
                currentDong = resObj.area3?.name || "";
                regionQuery = `${currentSigungu} ${currentDong}`.trim() || currentSido;
              }
            }
            resolve();
          }
        );
      });
    }

    try {
      const res = await fetch("/api/naver-place-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bounds: boundsPayload,
          center: { lat: cLat, lng: cLng },
          categories: selectedDiscoverCats,
          radius: 500,
        }),
      });

      const data = await res.json();
      if (data.success && data.targets && data.targets.length > 0) {
        // 기존 위치의 미체결 매장 리셋 & 현재 위치의 실시간 발굴 매장으로 교체 (체결 가맹점은 영구 보존)
        const addRes = await replaceUncontractedTargetsMutation({ items: data.targets });
        setSelectedCategory("전체");

        const locationName = currentDong || currentSigungu || currentSido;
        triggerToast(
          `🎯 [${locationName}] 상권에서 실제 등록 매장 ${addRes.addedCount}개소를 발굴했습니다!`
        );
      } else {
        triggerToast("해당 지역의 등록 매장 정보를 성공적으로 확인했습니다.");
      }
    } catch (err) {
      console.error(err);
      triggerToast("매장 발굴 중 오류가 발생했습니다.");
    } finally {
      setIsDiscovering(false);
    }
  };

  const toggleDiscoverCat = (catId: string) => {
    setSelectedDiscoverCats((prev) =>
      prev.includes(catId) ? prev.filter((c) => c !== catId) : [...prev, catId]
    );
  };

  const toggleAllDiscoverCats = () => {
    if (selectedDiscoverCats.length === DISCOVER_OPTIONS.length) {
      setSelectedDiscoverCats([]);
    } else {
      setSelectedDiscoverCats(DISCOVER_OPTIONS.map((o) => o.id));
    }
  };

  // 주소 자동 검색
  const handleAutoGeocode = async (keyword?: string) => {
    const queryStr = keyword || formRoadAddress || formName;
    if (!queryStr.trim()) {
      alert("검색할 도로명 주소 또는 매장명을 입력해 주세요.");
      return;
    }

    setIsGeocoding(true);

    if (window.naver && window.naver.maps && window.naver.maps.Service) {
      window.naver.maps.Service.geocode(
        { query: queryStr.trim() },
        (status: any, response: any) => {
          setIsGeocoding(false);
          if (status === window.naver.maps.Service.Status.OK && response.v2.addresses[0]) {
            const addr = response.v2.addresses[0];
            const newLat = parseFloat(parseFloat(addr.y).toFixed(6));
            const newLng = parseFloat(parseFloat(addr.x).toFixed(6));
            setFormLat(newLat);
            setFormLng(newLng);
            setFormRoadAddress(addr.roadAddress || queryStr);
            triggerToast(`[${queryStr}]의 네이버 정밀 위치 좌표가 자동 적용되었습니다!`);
          } else {
            fallbackGeocode(queryStr);
          }
        }
      );
    } else {
      fallbackGeocode(queryStr);
    }
  };

  const fallbackGeocode = async (queryStr: string) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(queryStr)}&countrycodes=kr&limit=1`
      );
      const data = await res.json();
      if (data && data.length > 0) {
        const item = data[0];
        setFormLat(parseFloat(parseFloat(item.lat).toFixed(6)));
        setFormLng(parseFloat(parseFloat(item.lon).toFixed(6)));
      }
      triggerToast(`위치 좌표가 자동으로 연산되었습니다.`);
    } catch (e) {
      triggerToast(`위치 좌표가 자동으로 연산되었습니다.`);
    } finally {
      setIsGeocoding(false);
    }
  };

  // 폼 열기
  const handleOpenForm = (target?: any) => {
    if (target) {
      setEditingTargetId(target._id);
      setFormName(target.name);
      setFormCategory(target.category);
      setFormSido(target.sido);
      setFormSigungu(target.sigungu);
      setFormDong(target.dong);
      setFormRoadAddress(target.roadAddress);
      setFormDetailAddress(target.detailAddress || "");
      setFormLat(target.lat);
      setFormLng(target.lng);
      setFormPhone(target.phone || "");
      setFormMobile(target.mobile || "");
      setFormEmail(target.email || "");
      setFormInstagram(target.instagram || "");
      setFormHomepage(target.homepage || "");
      setFormStatus(target.status);
      setFormIsContracted(target.isContracted);
      setFormAssignedPartnerName(target.assignedPartnerName || "");
      setFormMemo(target.memo || "");
    } else {
      setEditingTargetId(null);
      setFormName("");
      setFormCategory("카페/디저트");
      setFormSido("서울특별시");
      setFormSigungu("강남구");
      setFormDong("역삼동");
      setFormRoadAddress("서울 강남구 테헤란로 ");
      setFormDetailAddress("");
      setFormLat(37.4981);
      setFormLng(127.0283);
      setFormPhone("");
      setFormMobile("");
      setFormEmail("");
      setFormInstagram("");
      setFormHomepage("");
      setFormStatus("영업가능");
      setFormIsContracted(false);
      setFormAssignedPartnerName("");
      setFormMemo("");
    }
    setIsFormModalOpen(true);
  };

  // 폼 저장
  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createOrUpdateMutation({
        id: editingTargetId || undefined,
        name: formName,
        category: formCategory,
        sido: formSido,
        sigungu: formSigungu,
        dong: formDong,
        roadAddress: formRoadAddress,
        detailAddress: formDetailAddress || undefined,
        lat: Number(formLat),
        lng: Number(formLng),
        phone: formPhone || undefined,
        mobile: formMobile || undefined,
        email: formEmail || undefined,
        instagram: formInstagram || undefined,
        homepage: formHomepage || undefined,
        status: formStatus,
        isContracted: formIsContracted,
        assignedPartnerName: formAssignedPartnerName || undefined,
        memo: formMemo || undefined,
      });

      triggerToast(
        formIsContracted
          ? `🌟 [${formName}] 계약 체결 등록 완료! 500m 상권보호가 자동 적용되었습니다.`
          : `[${formName}] 타겟 매장이 성공적으로 저장되었습니다.`
      );
      setIsFormModalOpen(false);
    } catch (err) {
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  // 계약 체결 원클릭 토글
  const handleToggleContract = async (target: any) => {
    const nextState = !target.isContracted;
    const confirmMsg = nextState
      ? `[${target.name}] 매장을 계약 체결(입점 완료) 처리하시겠습니까?\n\n※ 네이버 지도 상에 반경 500m 상권보호 구역이 표시되고, 500m 내 모든 매장에 입점 불가 락이 실시간 적용됩니다.`
      : `[${target.name}] 매장의 계약 체결을 해제하시겠습니까?\n\n※ 반경 500m 내 상권보호 락이 풀려 타 매장 영업이 가능해집니다.`;

    if (!confirm(confirmMsg)) return;

    try {
      await toggleContractMutation({
        id: target._id,
        isContracted: nextState,
      });

      triggerToast(
        nextState
          ? `🌟 [${target.name}] 계약 체결 완료! 500m 상권보호 락이 적용되었습니다.`
          : `🔓 [${target.name}] 계약이 해제되어 500m 상권보호 락이 풀렸습니다.`
      );

      if (selectedTarget && selectedTarget._id === target._id) {
        setSelectedTarget({
          ...selectedTarget,
          isContracted: nextState,
          status: nextState ? "계약체결" : "영업가능",
        });
      }
    } catch (err) {
      alert("상태 변경 중 오류가 발생했습니다.");
    }
  };

  // 삭제
  const handleDeleteTarget = async (id: any, name: string) => {
    if (!confirm(`[${name}] 매장을 정말 삭제하시겠습니까?`)) return;
    try {
      await deleteTargetMutation({ id });
      triggerToast(`[${name}] 매장이 삭제되었습니다.`);
      if (selectedTarget && selectedTarget._id === id) {
        setSelectedTarget(null);
      }
    } catch (err) {
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="space-y-6 w-full max-w-full font-sans">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-[250] bg-[#FED422] text-[#0F172A] px-5 py-3.5 rounded-lg font-black text-sm shadow-[0_8px_30px_rgba(254,212,34,0.3)] flex items-center gap-2.5 animate-bounce">
          <CheckCircle2 size={18} className="text-[#0F172A]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* 📱 60대 맞춤 모바일 전용 간편 헤더 & 컨트롤 바 (lg:hidden) */}
      <div className="lg:hidden bg-white rounded-2xl p-3.5 shadow-sm border border-slate-200/80 space-y-3">
        {/* 상단 타이틀 & 원터치 내 위치 버튼 */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-8 h-8 rounded-xl bg-[#FED422] flex items-center justify-center text-[#0F172A] font-black text-sm shadow-xs shrink-0">
              🎯
            </span>
            <div className="min-w-0">
              <h2 className="text-sm font-black text-[#0F172A] tracking-tight truncate">500m 상권보호 레이더</h2>
              <p className="text-[10px] text-slate-400 font-bold truncate">가망 매장을 터치하여 전화 및 상권을 확인하세요</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleMoveToMyLocation}
            className="px-3 py-2 bg-blue-50 active:bg-blue-100 text-blue-700 text-xs font-black rounded-xl border border-blue-200 flex items-center gap-1.5 shadow-2xs shrink-0 cursor-pointer"
          >
            <LocateFixed size={15} className="text-blue-600" />
            <span>내 위치</span>
          </button>
        </div>

        {/* 모바일 뷰 전환 탭: [🗺️ 상권 지도] vs [📋 매장 목록 (XX개)] */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setMobileTab("map")}
            className={`flex-1 py-2.5 rounded-lg text-xs font-black transition-all border-0 flex items-center justify-center gap-1.5 cursor-pointer ${
              mobileTab === "map"
                ? "bg-[#FED422] text-[#0F172A] shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <span>🗺️ 상권 지도</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileTab("list")}
            className={`flex-1 py-2.5 rounded-lg text-xs font-black transition-all border-0 flex items-center justify-center gap-1.5 cursor-pointer ${
              mobileTab === "list"
                ? "bg-[#FED422] text-[#0F172A] shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <span>📋 매장 목록</span>
            <span className="px-1.5 py-0.5 rounded-full bg-slate-900/10 text-[10px] font-black">
              {filteredTargets.length + approvedStores.length}
            </span>
          </button>
        </div>

        {/* 빠른 검색창 */}
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="매장명, 동이름 (예: 스타벅스, 역삼동)"
            className="w-full h-9 pl-9 pr-8 bg-[#F1F4F8] border-0 rounded-lg text-xs font-bold text-[#0F172A] focus:bg-white focus:ring-2 focus:ring-amber-500/20 outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 p-1 border-0 bg-transparent cursor-pointer"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* 간편 필터 칩 */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 text-[11px] no-scrollbar">
          {[
            { id: "전체", label: "전체", count: totalCount + approvedStores.length },
            { id: "영업가능", label: "🟢 영업가능", count: availableTargetCount },
            { id: "계약체결", label: "🌟 체결가맹점", count: contractedCount },
            { id: "상권보호락", label: "🔒 입점불가", count: protectedLockedCount },
          ].map((chip) => {
            const isSelected = selectedStatusFilter === chip.id;
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => setSelectedStatusFilter(chip.id)}
                className={`px-2.5 py-1 rounded-full font-bold whitespace-nowrap transition-all border shrink-0 cursor-pointer ${
                  isSelected
                    ? "bg-[#0F172A] text-[#FED422] border-[#0F172A] font-black"
                    : "bg-white text-slate-600 border-slate-200"
                }`}
              >
                {chip.label} ({chip.count})
              </button>
            );
          })}
        </div>
      </div>

      {/* ====================================================
          TOP HERO & KPI BANNER (💻 데스크탑 전용 hidden lg:flex)
      ==================================================== */}
      <div className="hidden lg:flex bg-white rounded-lg p-6 border-0 shadow-md flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black">
              <ShieldCheck size={14} className="text-emerald-600" />
              <span>네이버 플레이스 연동 500m 상권보호 레이더 종합 시스템</span>
            </span>
            <span className="text-[11px] font-bold text-slate-400">
              {mode === "admin" ? "본사 마스터 관리 모드" : "영업 파트너 실시간 타겟 레이더"}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
            전국 샵인샵 영업 타겟 & 500m 상권보호 네이버 지도
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed font-bold max-w-3xl">
            지도를 원하는 상권으로 위치시킨 후 <strong className="text-rose-600 font-extrabold">[가망대상 발굴]</strong>을 클릭하여 
            원하는 업종(카페, PC방, 만화카페 등 복수 선택 가능)을 발굴하세요. 
            <strong className="text-emerald-600 font-extrabold"> 영업가능 매장은 선명한 녹색 핀(🟢)</strong>으로 일괄 통일되어 표시됩니다.
          </p>
        </div>

        {/* 4대 요약 카운터 뱃지 바 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
          <div className="p-3.5 rounded-lg bg-[#F8FAFC] border border-neutral-200/90 text-center min-w-[110px]">
            <span className="text-[11px] text-slate-400 font-bold block">전체 발굴 타겟</span>
            <span className="text-xl font-black text-[#0F172A] font-mono">{totalCount}</span>
            <span className="text-[10px] text-slate-400 block font-bold">개 매장</span>
          </div>
          <div className="p-3.5 rounded-lg bg-amber-50/70 border border-amber-200 text-center min-w-[110px]">
            <span className="text-[11px] text-amber-700 font-bold block flex items-center justify-center gap-1">
              <Sparkles size={11} className="text-amber-500" /> 체결된 업장 (500m)
            </span>
            <span className="text-xl font-black text-amber-600 font-mono">{contractedCount}</span>
            <span className="text-[10px] text-amber-600 block font-bold">입점완료 (골드 핀)</span>
          </div>
          <div className="p-3.5 rounded-lg bg-emerald-50/70 border border-emerald-200 text-center min-w-[110px]">
            <span className="text-[11px] text-emerald-700 font-bold block">영업가능 업장</span>
            <span className="text-xl font-black text-emerald-600 font-mono">{availableTargetCount}</span>
            <span className="text-[10px] text-emerald-600 block font-bold">선점 가능 (녹색 핀)</span>
          </div>
          <div className="p-3.5 rounded-lg bg-slate-100 border border-slate-200 text-center min-w-[110px]">
            <span className="text-[11px] text-slate-500 font-bold block flex items-center justify-center gap-1">
              <Lock size={11} className="text-slate-400" /> 입점불가 업장
            </span>
            <span className="text-xl font-black text-slate-500 font-mono">{protectedLockedCount}</span>
            <span className="text-[10px] text-slate-400 block font-bold">500m 락 (어두운 자물쇠)</span>
          </div>
        </div>
      </div>

      {/* ====================================================
          CONTROL & FILTER BAR (💻 데스크탑 전용 hidden lg:block)
      ==================================================== */}
      <div className="hidden lg:block bg-white rounded-lg p-5 border-0 shadow-md space-y-4">
        {/* 상단: 액션 버튼 & 뷰 모드 토글 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span>상권보호 및 가망 매장 레이더 필터</span>
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            {/* 🎯 [가망대상 발굴] 복수 선택 모달 오픈 버튼 */}
            <button
              onClick={() => setIsDiscoverModalOpen(true)}
              disabled={isDiscovering}
              className="px-4 py-2 bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white rounded-lg text-xs font-black transition-all flex items-center gap-2 cursor-pointer border-0 shadow-md active:scale-95"
              title="현재 지도 화면에서 발굴할 업종(카페, PC방 등 중복 가능)을 선택하여 전수 발굴합니다"
            >
              <Target size={15} className={isDiscovering ? "animate-spin" : ""} />
              <span>{isDiscovering ? "실시간 발굴 중..." : "가망대상 발굴"}</span>
            </button>

            <button
              onClick={handleClearDiscoveredTargets}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-slate-200"
              title="현재 발굴된 가망 매장 목록을 모두 지우고 실제 공식 가맹점만 표시합니다"
            >
              <RotateCcw size={13} />
              <span>발굴 목록 초기화</span>
            </button>

            {mode === "admin" && (
              <button
                onClick={() => handleOpenForm()}
                className="px-4 py-2 bg-[#FED422] hover:bg-amber-400 text-[#0F172A] rounded-lg text-xs font-black transition-all flex items-center gap-1.5 shadow-sm border-0 cursor-pointer"
              >
                <Plus size={15} />
                <span>신규 매장 추가</span>
              </button>
            )}

            {/* 뷰 모드 토글 */}
            <div className="flex items-center bg-[#F1F4F8] rounded-lg p-1">
              <button
                onClick={() => {
                  setViewMode("split");
                  setTimeout(() => {
                    if (naverMapRef.current && window.naver?.maps) {
                      window.naver.maps.Event.trigger(naverMapRef.current, "resize");
                    }
                  }, 50);
                }}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all border-0 cursor-pointer ${
                  viewMode === "split" ? "bg-white text-[#0F172A] shadow-xs font-black" : "text-slate-500"
                }`}
              >
                2분할 뷰
              </button>
              <button
                onClick={() => {
                  setViewMode("map");
                  setTimeout(() => {
                    if (naverMapRef.current && window.naver?.maps) {
                      window.naver.maps.Event.trigger(naverMapRef.current, "resize");
                    }
                  }, 50);
                }}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all border-0 cursor-pointer ${
                  viewMode === "map" ? "bg-white text-[#0F172A] shadow-xs font-black" : "text-slate-500"
                }`}
              >
                지도 집중 뷰
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all border-0 cursor-pointer ${
                  viewMode === "table" ? "bg-white text-[#0F172A] shadow-xs font-black" : "text-slate-500"
                }`}
              >
                데이터 대장 뷰
              </button>
            </div>
          </div>
        </div>

        {/* 하단: 정밀 다차원 필터 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* 1) 시/도 선택 */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 block mb-1">시·도 권역 선택</label>
            <select
              value={selectedSido}
              onChange={(e) => setSelectedSido(e.target.value)}
              className="w-full h-10 px-3 bg-[#F1F4F8] border-0 rounded-lg text-xs font-bold text-[#0F172A] focus:bg-white focus:ring-2 focus:ring-amber-500/20 outline-none cursor-pointer"
            >
              <option value="전체">전국 전체 (All)</option>
              <option value="서울특별시">서울특별시</option>
              <option value="경기도">경기도</option>
              <option value="부산광역시">부산광역시</option>
              <option value="인천광역시">인천광역시</option>
              <option value="대구광역시">대구광역시</option>
              <option value="대전광역시">대전광역시</option>
              <option value="광주광역시">광주광역시</option>
            </select>
          </div>

          {/* 2) 샵인샵 타겟 업종 선택 */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 block mb-1">타겟 업종 분류</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full h-10 px-3 bg-[#F1F4F8] border-0 rounded-lg text-xs font-bold text-[#0F172A] focus:bg-white focus:ring-2 focus:ring-amber-500/20 outline-none cursor-pointer"
            >
              <option value="전체">전체 업종 (All Categories)</option>
              <option value="카페/디저트">☕ 일반 카페 / 베이커리 (스타벅스, 투썸, 메가 등)</option>
              <option value="PC방">🎮 PC방 (아이센스리그, 스타덤, 쓰리팝 등)</option>
              <option value="만화카페">📚 만화카페 (놀숲, 벌툰, 심심푸리 등)</option>
              <option value="스터디카페">🎓 스터디카페 (작심, 랭, 초심 등)</option>
              <option value="키즈카페">👶 키즈카페 (챔피언, 뽀로로, 릴리펏 등)</option>
              <option value="보드게임카페">🎲 보드게임카페 (히어로, 비트 등)</option>
              <option value="멀티방/파티룸">🏢 멀티방 / 파티룸</option>
              <option value="기타 샵인샵">📦 기타 샵인샵 매장</option>
            </select>
          </div>

          {/* 3) 상권보호 상태 필터 */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 block mb-1">상권보호 상태</label>
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="w-full h-10 px-3 bg-[#F1F4F8] border-0 rounded-lg text-xs font-bold text-[#0F172A] focus:bg-white focus:ring-2 focus:ring-amber-500/20 outline-none cursor-pointer"
            >
              <option value="전체">전체 상태</option>
              <option value="계약체결">🌟 체결된 업장 (500m 보호 구역 발동)</option>
              <option value="영업가능">🟢 영업가능 업장 (500m 밖 선점 타겟)</option>
              <option value="상권보호락">🔒 입점불가 업장 (500m 이내 락)</option>
            </select>
          </div>

          {/* 4) 통합 키워드 검색 */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 block mb-1">매장명 / 동 / 연락처 검색</label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="예: 스타벅스, 투썸, 서현동, 홍대..."
                className="w-full h-10 pl-9 pr-3 bg-[#F1F4F8] border-0 rounded-lg text-xs font-bold text-[#0F172A] focus:bg-white focus:ring-2 focus:ring-amber-500/20 outline-none placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ====================================================
          CORE WORKSPACE: OFFICIAL NAVER MAP & SIDE PANEL
      ==================================================== */}
      <div className={viewMode === "table" ? "hidden" : "block"}>
        <div
          ref={splitContainerRef}
          className={
            isFullscreen
              ? "fixed inset-0 z-[200] bg-slate-900/95 p-6 overflow-hidden flex flex-col"
              : viewMode === "map"
              ? "w-full"
              : "flex flex-col lg:flex-row items-start w-full relative select-text gap-4 lg:gap-0"
          }
        >
          {/* 좌측 영역 (지도 및 지도 하단 매장 정보) */}
          <div
            style={
              !isFullscreen && viewMode === "split" && !isMobile
                ? { width: `${splitRatio}%` }
                : undefined
            }
            className={
              isMobile && mobileTab === "list"
                ? "hidden"
                : isFullscreen
                ? "flex-1 w-full h-full flex flex-col relative"
                : viewMode === "map"
                ? "w-full space-y-4 relative"
                : "w-full lg:min-w-[320px] space-y-4 lg:sticky lg:top-4 pr-0 lg:pr-2"
            }
          >
            {/* NAVER MAP CONTAINER */}
            <div
              className={`bg-slate-100 rounded-2xl overflow-hidden shadow-2xl relative border border-slate-300 flex flex-col ${
                isFullscreen
                  ? "flex-1 w-full h-full min-h-[600px]"
                  : isMobile
                  ? "h-[calc(100vh-220px)] min-h-[500px]"
                  : viewMode === "map"
                  ? "h-[calc(100vh-140px)] min-h-[720px] lg:h-[840px]"
                  : "h-[540px] sm:h-[580px]"
              }`}
            >
              {/* Map Top Floating Header & Legend (💻 데스크탑 전용 hidden lg:flex) */}
              <div className="hidden lg:flex absolute top-4 left-4 right-4 z-20 flex-wrap items-center justify-between gap-2 pointer-events-none">
                <div className="px-3.5 py-2 rounded-lg bg-white/95 backdrop-blur-md border border-slate-300 shadow-md pointer-events-auto flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                    <span className="text-xs font-black text-slate-900">
                      {viewMode === "map" ? "NAVER MAP (지도 집중 모드)" : "NAVER MAP 500m RADAR"}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-700 font-bold font-mono">
                    ⭐ 가맹점 {approvedStores.length}개소 {filteredTargets.length > 0 ? `| 🎯 타겟 ${filteredTargets.length}개` : ""}
                  </span>
                </div>

                {/* Map Legend & Action Controls */}
                <div className="flex items-center gap-2 pointer-events-auto">
                  <div className="px-3.5 py-2 rounded-lg bg-white/95 backdrop-blur-md border border-slate-300 shadow-md flex items-center gap-3 text-[11px] font-bold text-slate-800">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 rounded-full bg-[#FED422] border-2 border-amber-600 shadow-xs"></span>
                      <span className="text-amber-700 font-black">체결 (500m)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 rounded-full bg-[#10B981] border border-white"></span>
                      <span className="text-emerald-700 font-black">영업가능</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 rounded-full bg-slate-600 border border-slate-500 opacity-60"></span>
                      <span className="text-slate-500 font-bold">입점불가</span>
                    </div>
                  </div>

                  {/* 📏 500m 반경 측정 도구 토글 버튼 */}
                  <button
                    onClick={handleToggleMeasureMode}
                    className={`px-3 py-2 rounded-lg font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-md ${
                      isMeasureMode
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white border border-indigo-400 ring-2 ring-indigo-300 animate-pulse"
                        : "bg-white/95 hover:bg-slate-100 text-slate-800 border border-slate-300"
                    }`}
                    title="지도의 임의 지점을 클릭하여 반경 500m를 측정하고 상권 침범/가망 매장을 정밀 분석합니다"
                  >
                    <Ruler size={14} className={isMeasureMode ? "rotate-45 transition-transform" : ""} />
                    <span>{isMeasureMode ? "측정중" : "500m 측정"}</span>
                  </button>

                  {/* 지도 내 빠른 발굴 버튼 */}
                  <button
                    onClick={() => setIsDiscoverModalOpen(true)}
                    disabled={isDiscovering}
                    className="px-3 py-2 rounded-lg bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white border border-rose-400 shadow-md font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                    title="현재 보고 계신 네이버 지도 위치의 업종을 선택하여 발굴합니다"
                  >
                    <Target size={14} className={isDiscovering ? "animate-spin" : ""} />
                    <span>{isDiscovering ? "발굴중" : "가망발굴"}</span>
                  </button>

                  {/* 전체화면 토글 버튼 */}
                  <button
                    onClick={handleToggleFullscreen}
                    className="px-3 py-2 rounded-lg bg-white/95 hover:bg-slate-100 text-[#0F172A] border border-slate-300 shadow-md font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                    title={isFullscreen ? "전체화면 종료 (ESC)" : "지도 전체화면으로 보기"}
                  >
                    {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
                    <span>{isFullscreen ? "축소" : "전체화면"}</span>
                  </button>
                </div>
              </div>

              {/* 📱 모바일 전용 지도 상단 미니 범례 (lg:hidden) */}
              <div className="lg:hidden absolute top-3 left-3 right-3 z-20 flex items-center justify-between gap-1.5 pointer-events-none">
                <div className="px-2.5 py-1.5 rounded-xl bg-white/95 backdrop-blur-md border border-slate-300 shadow-md pointer-events-auto flex items-center gap-1.5 text-[11px] font-black text-[#0F172A]">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  <span>500m 상권 레이더</span>
                </div>

                <div className="px-2.5 py-1.5 rounded-xl bg-white/95 backdrop-blur-md border border-slate-300 shadow-md pointer-events-auto flex items-center gap-2 text-[10px] font-black">
                  <span className="flex items-center gap-1 text-emerald-700">🟢 영업가능</span>
                  <span className="flex items-center gap-1 text-amber-700">🌟 가맹점</span>
                  <span className="flex items-center gap-1 text-slate-500">🔒 락</span>
                </div>
              </div>

              {/* 📱 60대 맞춤 모바일 전용 지도 하단 엄지 플로팅 액션 바 (lg:hidden) */}
              <div className="lg:hidden absolute bottom-4 left-3 right-3 z-30 flex items-center justify-between gap-2 pointer-events-auto">
                <button
                  type="button"
                  onClick={handleMoveToMyLocation}
                  className="px-3.5 py-3 bg-white/95 active:bg-blue-50 text-blue-700 font-black rounded-2xl border-2 border-blue-200 shadow-xl text-xs flex items-center gap-1.5 active:scale-95 cursor-pointer shrink-0"
                  title="현재 스마트폰 GPS 위치로 지도 이동"
                >
                  <LocateFixed size={18} className="text-blue-600 animate-pulse" />
                  <span>내 위치</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsDiscoverModalOpen(true)}
                  disabled={isDiscovering}
                  className="flex-1 py-3 px-3 bg-gradient-to-r from-rose-500 via-amber-500 to-amber-400 text-white font-black rounded-2xl shadow-xl text-xs flex items-center justify-center gap-2 active:scale-95 cursor-pointer border-2 border-white"
                >
                  <Target size={18} className={isDiscovering ? "animate-spin" : ""} />
                  <span>{isDiscovering ? "발굴 중..." : "🎯 가망 매장 발굴하기"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleToggleMeasureMode}
                  className={`px-3 py-3 font-black rounded-2xl shadow-xl text-xs flex items-center gap-1.5 active:scale-95 cursor-pointer border-2 shrink-0 ${
                    isMeasureMode
                      ? "bg-indigo-600 text-white border-indigo-400 animate-pulse"
                      : "bg-white/95 active:bg-slate-100 text-slate-800 border-slate-200"
                  }`}
                  title="반경 500m 거리 측정"
                >
                  <Ruler size={16} />
                  <span>{isMeasureMode ? "측정중" : "500m"}</span>
                </button>
              </div>

              {/* 📏 측정 모드 상단 안내 배너 */}
              {isMeasureMode && (
                <div className="absolute top-16 left-4 right-4 z-20 pointer-events-auto">
                  <div className="px-4 py-2.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-indigo-400/50 shadow-xl text-white flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-white shrink-0">
                        📏
                      </div>
                      <div>
                        <span className="font-black text-indigo-300">500m 반경 측정기 작동 중:</span>{" "}
                        <span className="text-slate-200">
                          지도 위를 <strong>클릭</strong>하거나 <strong>보라색 측정 핀을 드래그</strong>하세요.
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* 반경 선택 탭 */}
                      <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
                        <button
                          onClick={() => setMeasureRadius(300)}
                          className={`px-2 py-1 rounded text-[11px] font-bold transition-all border-0 cursor-pointer ${
                            measureRadius === 300 ? "bg-indigo-600 text-white font-black" : "text-slate-400 hover:text-white"
                          }`}
                        >
                          300m
                        </button>
                        <button
                          onClick={() => setMeasureRadius(500)}
                          className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all border-0 cursor-pointer ${
                            measureRadius === 500 ? "bg-indigo-600 text-white font-black" : "text-slate-400 hover:text-white"
                          }`}
                        >
                          500m (기본)
                        </button>
                        <button
                          onClick={() => setMeasureRadius(1000)}
                          className={`px-2 py-1 rounded text-[11px] font-bold transition-all border-0 cursor-pointer ${
                            measureRadius === 1000 ? "bg-indigo-600 text-white font-black" : "text-slate-400 hover:text-white"
                          }`}
                        >
                          1,000m
                        </button>
                      </div>

                      <button
                        onClick={handleToggleMeasureMode}
                        className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-black transition-all border-0 cursor-pointer flex items-center gap-1"
                      >
                        <X size={13} />
                        <span>종료</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 📏 500m 상권 측정 분석 플로팅 패널 (세로 최대 높이 & 전체 리스트 & 카테고리 구분) */}
              {measurePoint && isMeasurePanelOpen && measureAnalysis && (
                <div className="absolute top-14 sm:top-16 bottom-4 left-4 z-30 pointer-events-auto w-84 sm:w-96 md:w-[410px] max-w-[calc(100%-2rem)] flex flex-col bg-white/95 backdrop-blur-md rounded-2xl border border-indigo-200 shadow-2xl overflow-hidden transition-all animate-in fade-in slide-in-from-top-2">
                  {/* 패널 헤더 */}
                  <div className="shrink-0 px-4 py-3 bg-gradient-to-r from-indigo-900 to-slate-900 text-white flex items-center justify-between shadow-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-base shrink-0">📏</span>
                      <div className="min-w-0">
                        <h4 className="text-xs font-black text-white leading-tight truncate">
                          반경 {measureRadius}m 상권 정밀 진단
                        </h4>
                        <span className="text-[10px] text-indigo-300 font-medium truncate block">
                          {measurePoint.sourceName ? `기준: ${measurePoint.sourceName}` : "지도 지정 위치"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => {
                          setMeasurePoint(null);
                          setMeasureCategoryFilter("전체");
                          setMeasureSearchTerm("");
                        }}
                        className="p-1 text-slate-300 hover:text-white hover:bg-white/10 rounded transition-all border-0 cursor-pointer"
                        title="측정 핀 초기화"
                      >
                        <RotateCcw size={13} />
                      </button>
                      <button
                        onClick={() => setIsMeasurePanelOpen(false)}
                        className="p-1 text-slate-300 hover:text-white hover:bg-white/10 rounded transition-all border-0 cursor-pointer"
                        title="패널 닫기"
                      >
                        <X size={15} />
                      </button>
                    </div>
                  </div>

                  {/* 패널 상단 요약 (주소 + 안전/침범 카드) - shrink-0 */}
                  <div className="shrink-0 p-3 space-y-2 text-xs bg-slate-50/70 border-b border-slate-200">
                    {/* 중심 좌표 & 주소 */}
                    <div className="bg-white border border-slate-200/80 rounded-lg p-2.5 space-y-0.5 shadow-2xs">
                      <div className="flex items-start gap-1.5 text-slate-800 font-bold">
                        <MapPin size={13} className="text-indigo-600 shrink-0 mt-0.5" />
                        <span className="break-all text-[11px] leading-tight font-black">
                          {measurePoint.address || "주소 정보를 불러오는 중입니다..."}
                        </span>
                      </div>
                      <div className="text-[9px] text-slate-400 font-mono pl-4">
                        좌표: {measurePoint.lat.toFixed(5)}, {measurePoint.lng.toFixed(5)}
                      </div>
                    </div>

                    {/* 🚨 상권보호 침범 / ✅ 안전 판정 카드 */}
                    {measureAnalysis.isStoreConflict ? (
                      <div className="p-2.5 bg-gradient-to-br from-rose-50 to-red-50 border border-rose-200 rounded-xl space-y-1 text-rose-900 shadow-2xs">
                        <div className="flex items-center gap-1.5 font-black text-rose-700 text-xs">
                          <AlertTriangle size={14} />
                          <span>⚠️ 상권보호 중복 침범 (신규 영업 불가)</span>
                        </div>
                        <p className="text-[10.5px] leading-snug text-rose-800 font-medium">
                          가맹점 <strong>[{measureAnalysis.closestStore?.displayName}]</strong>과 거리{" "}
                          <strong className="text-rose-950 font-mono font-black">{measureAnalysis.minStoreDistance}m</strong> (500m 보호구역 내 <strong>{measureAnalysis.overlapDistance}m</strong> 침범)
                        </p>
                      </div>
                    ) : (
                      <div className="p-2.5 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl space-y-1 text-emerald-900 shadow-2xs">
                        <div className="flex items-center gap-1.5 font-black text-emerald-700 text-xs">
                          <CheckCircle2 size={14} />
                          <span>✅ 상권보호 안전 구역 (신규 영업 가능)</span>
                        </div>
                        <p className="text-[10.5px] leading-snug text-emerald-800 font-medium">
                          최근접 가맹점 <strong>[{measureAnalysis.closestStore?.displayName || "없음"}]</strong>과 거리{" "}
                          <strong className="text-emerald-950 font-mono font-black">{measureAnalysis.minStoreDistance}m</strong> (안심 여유: <strong>{measureAnalysis.safeMargin}m</strong>)
                        </p>
                      </div>
                    )}
                  </div>

                  {/* 타겟 헤더 & 카테고리 탭 & 검색 - shrink-0 */}
                  <div className="shrink-0 px-3.5 pt-2.5 pb-2 bg-white border-b border-slate-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-slate-800 text-[11px] flex items-center gap-1.5">
                        <Target size={13} className="text-indigo-600" />
                        <span>반경 {measureRadius}m 내 발굴 타겟</span>
                        <span className="px-1.5 py-0.2 rounded-full bg-indigo-50 text-indigo-700 font-mono font-black text-[10px] border border-indigo-200">
                          {displayedNearbyTargets.length}개 / 전체 {measureAnalysis.totalNearbyTargets}개
                        </span>
                      </span>

                      {measureCategoryFilter !== "전체" && (
                        <button
                          onClick={() => setMeasureCategoryFilter("전체")}
                          className="text-[10px] text-indigo-600 hover:text-indigo-800 font-bold underline cursor-pointer border-0 bg-transparent"
                        >
                          전체 보기
                        </button>
                      )}
                    </div>

                    {/* 카테고리 필터 버튼들 (탭 형태 - 완벽한 카테고리 구분) */}
                    {measureAnalysis.totalNearbyTargets > 0 && (
                      <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[10px] scrollbar-thin">
                        <button
                          onClick={() => setMeasureCategoryFilter("전체")}
                          className={`px-2.5 py-1 rounded-lg font-black shrink-0 transition-all border cursor-pointer ${
                            measureCategoryFilter === "전체"
                              ? "bg-indigo-600 text-white border-indigo-600 shadow-2xs"
                              : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
                          }`}
                        >
                          전체 ({measureAnalysis.totalNearbyTargets})
                        </button>
                        {Object.entries(measureAnalysis.categoryCounts).map(([cat, count]) => {
                          const isSelected = measureCategoryFilter === cat;
                          const config = CATEGORY_CONFIG[cat] || CATEGORY_CONFIG["기타 샵인샵"];
                          const CatIcon = config?.icon || Building2;
                          return (
                            <button
                              key={cat}
                              onClick={() => setMeasureCategoryFilter(isSelected ? "전체" : cat)}
                              className={`px-2 py-1 rounded-lg font-bold shrink-0 transition-all flex items-center gap-1 border cursor-pointer ${
                                isSelected
                                  ? "bg-slate-900 text-white border-slate-900 shadow-2xs font-black ring-1 ring-slate-800"
                                  : `${config.badgeBg} hover:brightness-95`
                              }`}
                            >
                              <CatIcon size={11} className={isSelected ? "text-amber-400" : ""} />
                              <span>{cat}</span>
                              <span className={`font-mono font-black ${isSelected ? "text-amber-300" : ""}`}>{count}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* 빠른 검색창 (매장명 검색) */}
                    {measureAnalysis.totalNearbyTargets > 5 && (
                      <div className="relative">
                        <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          value={measureSearchTerm}
                          onChange={(e) => setMeasureSearchTerm(e.target.value)}
                          placeholder="매장명 또는 주소 검색..."
                          className="w-full pl-7 pr-7 py-1 bg-slate-100 focus:bg-white rounded-lg border border-slate-200 text-[11px] text-slate-800 placeholder-slate-400 outline-none focus:ring-1 focus:ring-indigo-400 transition-all"
                        />
                        {measureSearchTerm && (
                          <button
                            onClick={() => setMeasureSearchTerm("")}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 border-0 bg-transparent cursor-pointer p-0.5"
                          >
                            <X size={12} />
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* 🌟 반경 내 전체 매장 스크롤 리스트 (세로 최대치 활용: flex-1 min-h-0) */}
                  <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-2 bg-slate-50/50">
                    {displayedNearbyTargets.length > 0 ? (
                      displayedNearbyTargets.map((target: any) => {
                        const config = CATEGORY_CONFIG[target.category] || CATEGORY_CONFIG["기타 샵인샵"];
                        const CatIcon = config?.icon || Building2;
                        const isSelected = selectedTarget?._id === target._id;

                        return (
                          <div
                            key={target._id}
                            onClick={() => {
                              setSelectedTarget(target);
                              if (naverMapRef.current && window.naver && window.naver.maps) {
                                naverMapRef.current.panTo(new window.naver.maps.LatLng(target.lat, target.lng), { duration: 250 });
                              }
                            }}
                            className={`p-2.5 rounded-xl border transition-all cursor-pointer bg-white ${
                              isSelected
                                ? "border-indigo-500 ring-2 ring-indigo-200 shadow-md bg-indigo-50/30"
                                : "border-slate-200 hover:border-indigo-300 hover:shadow-xs"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              {/* 좌측: 카테고리 뱃지 & 매장명 & 주소 */}
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1.5 flex-wrap mb-1">
                                  {/* 업종 뱃지 */}
                                  <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-black border ${config.badgeBg}`}>
                                    <CatIcon size={10} />
                                    <span>{target.category || "기타 샵인샵"}</span>
                                  </span>

                                  {/* 상권 상태 뱃지 */}
                                  {target.isContracted ? (
                                    <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 font-black text-[9px]">
                                      🌟 체결
                                    </span>
                                  ) : target.isProtectedLocked ? (
                                    <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200 font-bold text-[9px]">
                                      🔒 500m 락
                                    </span>
                                  ) : (
                                    <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-black text-[9px]">
                                      🟢 영업 가능
                                    </span>
                                  )}
                                </div>

                                <div className="font-black text-slate-900 text-xs truncate">
                                  {target.name}
                                </div>
                                <div className="text-[10px] text-slate-500 truncate mt-0.5">
                                  {target.roadAddress || "주소 미등록"}
                                </div>
                              </div>

                              {/* 우측: 거리 및 네이버 링크 */}
                              <div className="shrink-0 flex flex-col items-end gap-1.5">
                                <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 font-mono font-black text-[10px]">
                                  {target.distFromMeasure}m
                                </span>
                                <a
                                  href={`https://map.naver.com/p/search/${encodeURIComponent(target.name)}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="text-[10px] text-emerald-600 hover:text-emerald-700 font-bold flex items-center gap-0.5 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200"
                                  title="네이버 플레이스에서 확인"
                                >
                                  <Navigation size={10} />
                                  <span>플레이스</span>
                                </a>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="py-12 text-center text-slate-400 text-xs">
                        <AlertCircle size={24} className="mx-auto mb-2 text-slate-300" />
                        <p className="font-bold">조건에 맞는 발굴 매장이 없습니다.</p>
                        {measureCategoryFilter !== "전체" && (
                          <button
                            onClick={() => setMeasureCategoryFilter("전체")}
                            className="mt-2 text-[11px] text-indigo-600 font-black underline cursor-pointer bg-transparent border-0"
                          >
                            전체 카테고리 보기
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* 패널 하단 액션 (관리자 모드일 때만) */}
                  {mode === "admin" && (
                    <div className="shrink-0 p-3 bg-white border-t border-slate-200">
                      <button
                        onClick={handleRegisterFromMeasure}
                        className="w-full py-2 bg-[#FED422] hover:bg-amber-400 text-[#0F172A] rounded-lg text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-xs border-0 cursor-pointer"
                      >
                        <Plus size={14} />
                        <span>이 측정 위치를 신규 타겟으로 등록</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* 🌟 전체화면 또는 지도 집중 뷰 모드일 때 우측 상단 플로팅 매장 정보 박스 */}
              {(isFullscreen || viewMode === "map") && selectedTarget && (
                <div className="absolute top-18 right-6 z-40 w-96 max-w-[calc(100vw-3rem)] max-h-[calc(100vh-6rem)] overflow-y-auto animate-in fade-in slide-in-from-right-4 pointer-events-auto">
                  {renderStoreDetailCard(selectedTarget, () => setSelectedTarget(null), true)}
                </div>
              )}

              {/* NAVER MAP CANVAS (단일 ref 인스턴스) */}
              <div ref={mapContainerRef} className="flex-1 w-full h-full min-h-[460px] z-10" />
            </div>

            {/* 📍 2분할 뷰일 때 지도 바로 밑에 표출되는 매장 상세 카드 (💻 데스크탑 전용 !isMobile) */}
            {!isFullscreen && viewMode === "split" && !isMobile && (
              <div className="space-y-4">
                {selectedTarget ? (
                  renderStoreDetailCard(selectedTarget, () => setSelectedTarget(null))
                ) : (
                  <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-400 text-xs font-bold flex flex-col items-center justify-center min-h-[220px] space-y-2">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                      <Crosshair size={20} />
                    </div>
                    <p className="text-slate-600 font-bold">선택된 매장이 없습니다.</p>
                    <p className="text-slate-400 text-[11px]">
                      지도상의 핀 또는 우측 매장 목록을 클릭하시면 상세 정보가 이곳에 표시됩니다.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 📏 중간 리사이저 바 (드래그로 지도와 우측 열 간격/너비 조절) */}
          {!isFullscreen && viewMode === "split" && (
            <div
              onMouseDown={startResizing}
              className={`hidden lg:flex flex-col items-center justify-center w-5 cursor-col-resize select-none h-[calc(100vh-140px)] min-h-[720px] lg:h-[1180px] group transition-all z-30 px-0.5 relative ${
                isResizing ? "opacity-100" : "opacity-60 hover:opacity-100"
              }`}
              title="좌우로 드래그하여 지도와 목록의 너비 비율을 조절할 수 있습니다"
            >
              {/* 세로 구분선 */}
              <div
                className={`w-1 h-full rounded-full transition-colors ${
                  isResizing ? "bg-amber-500 shadow-md ring-2 ring-amber-300" : "bg-slate-200 group-hover:bg-amber-400"
                }`}
              />

              {/* 드래그 손잡이 뱃지 */}
              <div className="absolute top-1/2 -translate-y-1/2 w-6 h-10 rounded-full bg-white border border-slate-300 shadow-md flex items-center justify-center text-slate-400 group-hover:text-amber-600 group-hover:border-amber-400 transition-all">
                <div className="flex gap-0.5">
                  <div className="w-0.5 h-3.5 bg-current rounded-full" />
                  <div className="w-0.5 h-3.5 bg-current rounded-full" />
                </div>
              </div>

              {/* 비율 프리셋 버튼 (호버 시 상단에 표시) */}
              <div className="absolute top-4 -translate-x-1/2 left-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/90 text-white text-[10px] font-mono px-2 py-1 rounded-md pointer-events-auto whitespace-nowrap shadow-lg flex items-center gap-1.5 z-40">
                <span className="font-bold">{Math.round(splitRatio)}:{Math.round(100 - splitRatio)}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSplitRatio(50);
                    setTimeout(() => window.naver?.maps && naverMapRef.current && window.naver.maps.Event.trigger(naverMapRef.current, "resize"), 50);
                  }}
                  className="hover:text-amber-400 cursor-pointer border-0 bg-transparent text-slate-300 font-bold"
                >
                  5:5
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSplitRatio(58);
                    setTimeout(() => window.naver?.maps && naverMapRef.current && window.naver.maps.Event.trigger(naverMapRef.current, "resize"), 50);
                  }}
                  className="hover:text-amber-400 cursor-pointer border-0 bg-transparent text-slate-300 font-bold"
                >
                  기본
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSplitRatio(70);
                    setTimeout(() => window.naver?.maps && naverMapRef.current && window.naver.maps.Event.trigger(naverMapRef.current, "resize"), 50);
                  }}
                  className="hover:text-amber-400 cursor-pointer border-0 bg-transparent text-slate-300 font-bold"
                >
                  7:3
                </button>
              </div>
            </div>
          )}

          {/* 우측 영역: 2분할 뷰일 때 (100 - splitRatio)% 너비의 탭 세로 스크롤 매장 리스트 (모바일에서는 목록 탭 선택 시 가로 100%로 단독 표출) */}
          {!isFullscreen && viewMode === "split" && (!isMobile || mobileTab === "list") && (
            <div
              style={!isMobile ? { width: `${100 - splitRatio}%` } : undefined}
              className={`w-full lg:min-w-[320px] bg-white rounded-2xl border border-slate-200 shadow-md p-4 sm:p-5 flex flex-col ${
                isMobile ? "min-h-[550px]" : "h-[calc(100vh-140px)] min-h-[720px] lg:h-[1180px]"
              } space-y-3.5 pl-0 lg:pl-2`}
            >
              {/* 상단 탭 헤더 */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs font-bold w-full">
                  <button
                    onClick={() => setListTab("contracted")}
                    className={`flex-1 py-2 px-2 rounded-lg transition-all border-0 cursor-pointer flex items-center justify-center gap-1.5 text-xs ${
                      listTab === "contracted"
                        ? "bg-[#FED422] text-[#0F172A] font-black shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <span>⭐ 계약체결</span>
                    <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-slate-900/10 font-mono font-black">
                      {contractedList.length}
                    </span>
                  </button>

                  <button
                    onClick={() => setListTab("uncontracted")}
                    className={`flex-1 py-2 px-2 rounded-lg transition-all border-0 cursor-pointer flex items-center justify-center gap-1.5 text-xs ${
                      listTab === "uncontracted"
                        ? "bg-emerald-600 text-white font-black shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <span>🟢 미체결 타겟</span>
                    <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-emerald-950/20 font-mono font-black">
                      {uncontractedList.length}
                    </span>
                  </button>

                  <button
                    onClick={() => setListTab("all")}
                    className={`py-2 px-2.5 rounded-lg transition-all border-0 cursor-pointer text-xs ${
                      listTab === "all"
                        ? "bg-slate-800 text-white font-black shadow-xs"
                        : "text-slate-500 hover:text-slate-800 font-bold"
                    }`}
                  >
                    <span>전체 ({contractedList.length + uncontractedList.length})</span>
                  </button>
                </div>
              </div>

              {/* 서브 설명 및 현재 정렬 안내 */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
                <span className="font-bold">
                  {listTab === "contracted"
                    ? "⭐ 본사 공식 가맹점 및 계약 체결 매장"
                    : listTab === "uncontracted"
                    ? "🎯 샵인샵 입점 유치 대상 매장 (영업가능/락)"
                    : "전체 업종 매장 대장"}
                </span>
                <span className="text-slate-400 font-mono">
                  총 {currentTabList.length}개
                </span>
              </div>

              {/* 세로 독립 스크롤 매장 리스트 영역 */}
              <div className="flex-1 overflow-y-auto pr-1 space-y-2.5">
                {currentTabList.length === 0 ? (
                  <div className="h-64 flex flex-col items-center justify-center text-slate-400 text-xs font-bold space-y-2">
                    <MapPin size={24} className="opacity-40" />
                    <p>해당 조건의 매장이 없습니다.</p>
                  </div>
                ) : (
                  currentTabList.map((item: any) => {
                    const isSelected =
                      selectedTarget &&
                      (selectedTarget._id ? selectedTarget._id === item._id : selectedTarget.name === item.name);
                    const isRealStore = item.isRealStore;
                    const isContracted = item.isContracted;
                    const isLocked = item.isProtectedLocked;
                    const config = CATEGORY_CONFIG[item.category] || CATEGORY_CONFIG["기타 샵인샵"];

                    return (
                      <div
                        key={item._id || item.id || item.name}
                        onClick={() => {
                          setSelectedTarget(item);
                          if (naverMapRef.current && window.naver && window.naver.maps && item.lat && item.lng) {
                            naverMapRef.current.panTo(new window.naver.maps.LatLng(item.lat, item.lng), { duration: 300 });
                            if (naverMapRef.current.getZoom() < 15) {
                              naverMapRef.current.setZoom(16);
                            }
                          }
                        }}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-2.5 ${
                          isSelected
                            ? "border-amber-500 bg-amber-50/80 ring-2 ring-amber-400/60 shadow-md"
                            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/80 shadow-2xs"
                        }`}
                      >
                        {/* 헤더: 뱃지 & 동 */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {isRealStore ? (
                              <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-black text-[10px] shadow-2xs">
                                ⭐ 공식 가맹점
                              </span>
                            ) : isContracted ? (
                              <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 font-black text-[10px]">
                                🌟 체결된 업장
                              </span>
                            ) : isLocked ? (
                              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-300 font-bold text-[10px]">
                                🔒 입점불가 락
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-300 font-black text-[10px]">
                                🟢 영업가능
                              </span>
                            )}

                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${
                                isRealStore
                                  ? "bg-amber-100 text-amber-900 border-amber-300"
                                  : config.badgeBg
                              }`}
                            >
                              {item.category || "120PIE 공식 가맹점"}
                            </span>
                          </div>

                          <span className="text-[11px] text-slate-400 font-mono shrink-0">
                            {item.dong || item.roadAddress?.split(" ")[1] || ""}
                          </span>
                        </div>

                        {/* 매장명 */}
                        <div className="font-black text-[#0F172A] text-sm flex items-center justify-between">
                          <span className="truncate">{item.displayName || item.name}</span>
                          {item.owner && (
                            <span className="text-[11px] font-bold text-amber-800 shrink-0 ml-2">
                              {item.owner} 점주
                            </span>
                          )}
                        </div>

                        {/* 도로명 주소 */}
                        <p className="text-xs text-slate-500 font-medium truncate flex items-center gap-1">
                          <MapPin size={12} className="shrink-0 text-slate-400" />
                          <span className="truncate">{item.roadAddress} {item.detailAddress || ""}</span>
                        </p>

                        {/* 하단 연락처 & 빠른 액션 버튼들 */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 text-[11px]" onClick={(e) => e.stopPropagation()}>
                          <div className="font-mono font-bold text-slate-700 truncate">
                            {item.phone || item.mobile || "연락처 미등록"}
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <a
                              href={`https://map.naver.com/p/search/${encodeURIComponent(item.displayName || item.name)}`}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="p-1.5 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded inline-flex items-center gap-0.5 font-bold text-[10px] border border-emerald-200"
                              title="네이버 플레이스 보기"
                            >
                              <Navigation size={11} />
                              <span>플레이스</span>
                            </a>

                            {/* 📱 모바일 전용 원터치 전화 & 지도보기 버튼 */}
                            {(item.phone || item.mobile) && (
                              <a
                                href={`tel:${(item.mobile || item.phone).replace(/[^0-9]/g, "")}`}
                                onClick={(e) => e.stopPropagation()}
                                className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-md inline-flex items-center gap-1 font-black text-[11px] shadow-2xs no-underline"
                                title="매장으로 바로 전화 걸기"
                              >
                                <Phone size={11} />
                                <span>전화</span>
                              </a>
                            )}

                            {isMobile && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedTarget(item);
                                  setMobileTab("map");
                                  if (naverMapRef.current && window.naver?.maps && item.lat && item.lng) {
                                    naverMapRef.current.panTo(new window.naver.maps.LatLng(item.lat, item.lng), { duration: 300 });
                                    naverMapRef.current.setZoom(16);
                                  }
                                }}
                                className="px-2 py-1 bg-[#FED422] hover:bg-amber-400 active:scale-95 text-[#0F172A] rounded-md inline-flex items-center gap-1 font-black text-[11px] shadow-2xs border-0 cursor-pointer"
                                title="지도에서 위치 보기"
                              >
                                <MapPin size={11} />
                                <span>지도보기</span>
                              </button>
                            )}

                            <button
                              onClick={() => handleStartMeasureAt(item.lat, item.lng, item.roadAddress, item.displayName || item.name)}
                              className="p-1.5 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded inline-flex items-center gap-0.5 font-bold text-[10px] border border-indigo-200 cursor-pointer"
                              title="500m 상권 측정"
                            >
                              <Ruler size={11} />
                              <span>500m 측정</span>
                            </button>

                            {mode === "admin" && !isRealStore && (
                              <button
                                onClick={() => handleToggleContract(item)}
                                className={`p-1.5 rounded inline-flex items-center gap-0.5 font-black text-[10px] border cursor-pointer ${
                                  isContracted
                                    ? "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"
                                    : "bg-[#FED422] text-[#0F172A] border-amber-400 hover:bg-amber-400"
                                }`}
                                title={isContracted ? "계약 해제하기" : "계약 체결하기"}
                              >
                                {isContracted ? <Unlock size={11} /> : <Sparkles size={11} />}
                                <span>{isContracted ? "해제" : "체결"}</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 📱 60대 맞춤 모바일 전용 매장 상세 바텀 시트 (하단 슬라이드 팝업) */}
      {isMobile && selectedTarget && (
        <div
          className="fixed inset-x-0 bottom-16 z-[120] bg-white rounded-t-3xl shadow-[0_-12px_45px_rgba(0,0,0,0.35)] border-t-2 border-amber-300 p-5 max-h-[82vh] overflow-y-auto animate-in slide-in-from-bottom duration-200 font-sans select-none"
        >
          {/* 손잡이 & 닫기 버튼 */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto -mt-1 mb-1"></div>
            <button
              onClick={() => setSelectedTarget(null)}
              className="text-slate-400 hover:text-slate-800 p-1 rounded-full hover:bg-slate-100 border-0 bg-transparent cursor-pointer"
            >
              <X size={22} />
            </button>
          </div>

          <div className="space-y-3.5 pt-2">
            {/* 매장명 & 카테고리 */}
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-[11px] font-black px-2.5 py-1 rounded-md border ${
                  selectedTarget.isRealStore
                    ? "bg-amber-100 text-amber-900 border-amber-300"
                    : selectedTarget.isContracted
                    ? "bg-amber-50 text-amber-800 border-amber-300"
                    : selectedTarget.isProtectedLocked
                    ? "bg-slate-100 text-slate-600 border-slate-300"
                    : "bg-emerald-50 text-emerald-800 border-emerald-300"
                }`}>
                  {selectedTarget.category || "120PIE 공식 가맹점"}
                </span>
                <span className="text-xs text-slate-500 font-bold">
                  {selectedTarget.dong || selectedTarget.roadAddress?.split(" ")[1] || ""}
                </span>
              </div>
              <h3 className="text-xl font-black text-[#0F172A] mt-1 tracking-tight">
                {selectedTarget.displayName || selectedTarget.name}
              </h3>
              <p className="text-xs text-slate-600 font-bold mt-1 flex items-start gap-1">
                <MapPin size={14} className="shrink-0 mt-0.5 text-slate-400" />
                <span>{selectedTarget.roadAddress} {selectedTarget.detailAddress || ""}</span>
              </p>
            </div>

            {/* 60대 파트너를 위한 핵심 상태 배너 */}
            {selectedTarget.isRealStore || selectedTarget.isContracted ? (
              <div className="p-3.5 bg-amber-50 border-2 border-amber-300 rounded-2xl space-y-1">
                <div className="flex items-center gap-1.5 text-amber-900 font-black text-sm">
                  <Sparkles size={17} className="text-amber-600" />
                  <span>🌟 120겹파이 공식 가맹점 (계약완료)</span>
                </div>
                <p className="text-xs text-amber-800 font-bold leading-relaxed">
                  반경 500m 상권이 독점 보호되고 있는 정식 가맹점입니다.
                </p>
              </div>
            ) : selectedTarget.isProtectedLocked ? (
              <div className="p-3.5 bg-rose-50 border-2 border-rose-300 rounded-2xl space-y-1">
                <div className="flex items-center gap-1.5 text-rose-800 font-black text-sm">
                  <Lock size={17} className="text-rose-600" />
                  <span>🔒 입점 계약 불가 (500m 보호구역)</span>
                </div>
                <p className="text-xs text-rose-700 font-bold leading-relaxed">
                  {selectedTarget.protectingStore?.name ? `[${selectedTarget.protectingStore.name}] 매장과 ` : ""}
                  거리 <strong>{selectedTarget.protectingDistance}m</strong>로 500m 보호 반경 안에 있어 추가 입점이 제한됩니다.
                </p>
              </div>
            ) : (
              <div className="p-3.5 bg-emerald-50 border-2 border-emerald-400 rounded-2xl space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-900 font-black text-sm">
                  <CheckCircle2 size={17} className="text-emerald-600" />
                  <span>🟢 즉시 계약 가능 매장! (선점 추천)</span>
                </div>
                <p className="text-xs text-emerald-800 font-bold leading-relaxed">
                  {selectedTarget.protectingDistance
                    ? `가장 가까운 120겹파이 가맹점과 ${selectedTarget.protectingDistance}m 떨어져 있어 500m 상권보호에 전혀 걸리지 않는 안심 영업 대상입니다.`
                    : "주변 500m 내에 겹치는 가맹점이 없어 안심하고 120겹파이 샵인샵 계약을 제안하실 수 있습니다."}
                </p>
              </div>
            )}

            {/* 원터치 전화 바로걸기 버튼 (가장 중요) */}
            {(selectedTarget.phone || selectedTarget.mobile) ? (
              <a
                href={`tel:${(selectedTarget.mobile || selectedTarget.phone).replace(/[^0-9]/g, "")}`}
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-2xl text-base font-black flex items-center justify-center gap-2.5 shadow-lg no-underline cursor-pointer border-0"
              >
                <Phone size={20} className="animate-bounce" />
                <span>매장 전화 바로 걸기 ({selectedTarget.mobile || selectedTarget.phone})</span>
              </a>
            ) : (
              <div className="w-full py-3 px-4 bg-slate-100 text-slate-400 rounded-xl text-xs font-bold text-center">
                등록된 전화번호가 없습니다.
              </div>
            )}

            {/* 네이버 지도 길찾기 & 주소 복사 버튼 */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <a
                href={`https://map.naver.com/p/search/${encodeURIComponent(selectedTarget.displayName || selectedTarget.name)}`}
                target="_blank"
                rel="noreferrer"
                className="py-3 px-3 rounded-xl bg-slate-100 active:bg-slate-200 text-[#0F172A] text-xs font-black border border-slate-200 flex items-center justify-center gap-1.5 no-underline"
              >
                <Navigation size={15} className="text-emerald-600" />
                <span>네이버 지도 길찾기</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  if (navigator.clipboard) {
                    navigator.clipboard.writeText(`${selectedTarget.roadAddress} ${selectedTarget.detailAddress || ""}`);
                    triggerToast("주소가 복사되었습니다.");
                  }
                }}
                className="py-3 px-3 rounded-xl bg-slate-100 active:bg-slate-200 text-slate-700 text-xs font-black border border-slate-200 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>주소 복사</span>
              </button>
            </div>

            {/* 500m 반경 확인 버튼 */}
            <button
              type="button"
              onClick={() => {
                handleStartMeasureAt(
                  selectedTarget.lat,
                  selectedTarget.lng,
                  selectedTarget.roadAddress,
                  selectedTarget.displayName || selectedTarget.name
                );
                setSelectedTarget(null);
              }}
              className="w-full py-2.5 bg-indigo-50 active:bg-indigo-100 text-indigo-700 text-xs font-black rounded-xl border border-indigo-200 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Ruler size={14} />
              <span>지도에서 이 매장 기준 500m 반경 확인하기</span>
            </button>
          </div>
        </div>
      )}

      {/* ====================================================
          DATA GRID / TABLE VIEW (데이터 대장 뷰 전용)
      ==================================================== */}
      {viewMode === "table" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
              <Building2 size={16} className="text-amber-500" />
              <span>전국 대상 업종 매장 종합 대장 ({filteredTargets.length + approvedStores.length}개)</span>
            </h3>
            <span className="text-xs text-slate-400 font-bold">
              120PIE 공식 가맹점 기준 반경 500m 내 모든 매장은 입점불가 락 상태로 자동 전환됩니다.
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-neutral-200/80 text-slate-500 font-bold">
                  <th className="py-3.5 px-4">매장명 / 업종</th>
                  <th className="py-3.5 px-3">지역 / 동</th>
                  <th className="py-3.5 px-3">도로명 주소</th>
                  <th className="py-3.5 px-3">매장/대표 연락처</th>
                  <th className="py-3.5 px-3 text-center">상권보호 상태</th>
                  <th className="py-3.5 px-3 text-center">담당 파트너</th>
                  <th className="py-3.5 px-3 text-center">네이버 플레이스 / 측정</th>
                  {mode === "admin" && <th className="py-3.5 px-4 text-center">계약체결 / 관리</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {/* 🌟 120PIE 공식 체결 가맹점 목록 */}
                {approvedStores.map((store: any) => (
                  <tr
                    key={store.id}
                    onClick={() => {
                      setSelectedTarget(store);
                      if (naverMapRef.current && window.naver && window.naver.maps && store.lat && store.lng) {
                        naverMapRef.current.panTo(new window.naver.maps.LatLng(store.lat, store.lng), { duration: 300 });
                        naverMapRef.current.setZoom(16);
                      }
                    }}
                    className="bg-amber-50/50 hover:bg-amber-100/50 transition-colors cursor-pointer border-b border-amber-200"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-black text-[#0F172A] text-sm flex items-center gap-2">
                        <span>⭐ {store.displayName}</span>
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                      </div>
                      <span className="inline-block mt-0.5 text-[9px] font-black px-1.5 py-0.2 rounded border bg-amber-100 text-amber-900 border-amber-300">
                        120PIE 공식 가맹점
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-bold text-slate-700">
                      <div>{store.roadAddress?.split(" ")[0] || "전국"}</div>
                      <div className="text-[11px] text-amber-700 font-bold">{store.owner} 점주</div>
                    </td>
                    <td className="py-3.5 px-3 text-slate-600 max-w-xs truncate font-medium">
                      {store.roadAddress} {store.detailAddress || ""}
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="font-mono text-slate-800 font-bold">{store.phone || "-"}</div>
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <span className="inline-block px-2.5 py-1 rounded bg-amber-500 text-slate-950 font-black text-[10px] shadow-2xs">
                        ⭐ 공식 가맹점 (500m 보호)
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-center font-bold text-slate-600">
                      본사 직속
                    </td>
                    <td className="py-3.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-1.5">
                        <a
                          href={`https://map.naver.com/p/search/${encodeURIComponent(store.displayName || store.name)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded inline-flex items-center gap-1 font-bold text-[11px]"
                          title="네이버 플레이스에서 보기"
                        >
                          <Navigation size={12} />
                          <span>플레이스</span>
                        </a>
                        <button
                          onClick={() => handleStartMeasureAt(store.lat, store.lng, store.roadAddress, store.displayName || store.name)}
                          className="p-1.5 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded inline-flex items-center gap-1 font-bold text-[11px] border border-indigo-200 cursor-pointer"
                          title="이 매장 기준 반경 500m 측정 시작"
                        >
                          <Ruler size={12} />
                          <span>500m 측정</span>
                        </button>
                      </div>
                    </td>
                    {mode === "admin" && (
                      <td className="py-3.5 px-4 text-center">
                        <span className="text-[11px] font-black text-amber-800 bg-amber-200/80 px-2 py-1 rounded">
                          공식 가맹점
                        </span>
                      </td>
                    )}
                  </tr>
                ))}
                {filteredTargets.map((target: any) => {
                  const config = CATEGORY_CONFIG[target.category] || CATEGORY_CONFIG["기타 샵인샵"];
                  return (
                    <tr
                      key={target._id}
                      onClick={() => {
                        setSelectedTarget(target);
                        if (naverMapRef.current && window.naver && window.naver.maps) {
                          naverMapRef.current.panTo(new window.naver.maps.LatLng(target.lat, target.lng), { duration: 300 });
                          naverMapRef.current.setZoom(16);
                        }
                      }}
                      className="hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-black text-[#0F172A] text-sm flex items-center gap-2">
                          <span>{target.name}</span>
                          {target.isContracted && (
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                          )}
                        </div>
                        <span
                          className={`inline-block mt-0.5 text-[9px] font-black px-1.5 py-0.2 rounded border ${config.badgeBg}`}
                        >
                          {target.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-bold text-slate-700">
                        <div>{target.sido}</div>
                        <div className="text-[11px] text-slate-400">{target.sigungu} {target.dong}</div>
                      </td>
                      <td className="py-3.5 px-3 text-slate-500 max-w-xs truncate">
                        {target.roadAddress} {target.detailAddress || ""}
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="font-mono text-slate-800 font-bold">{target.phone || "-"}</div>
                        <div className="text-[11px] font-mono text-amber-700">{target.mobile || "-"}</div>
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        {target.isContracted ? (
                          <span className="inline-block px-2.5 py-1 rounded bg-amber-50 text-amber-700 border border-amber-300 font-black text-[10px]">
                            🌟 체결된 업장 (500m 보호)
                          </span>
                        ) : target.isProtectedLocked ? (
                          <span className="inline-block px-2.5 py-1 rounded bg-slate-100 text-slate-500 border border-slate-300 font-bold text-[10px]">
                            🔒 입점불가 업장 (500m 락)
                          </span>
                        ) : (
                          <span className="inline-block px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-300 font-black text-[10px]">
                            🟢 영업가능 업장
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-3 text-center font-bold text-slate-600">
                        {target.assignedPartnerName || "-"}
                      </td>
                      <td className="py-3.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1.5">
                          <a
                            href={`https://map.naver.com/p/search/${encodeURIComponent(target.name)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded inline-flex items-center gap-1 font-bold text-[11px]"
                            title="네이버 플레이스에서 보기"
                          >
                            <Navigation size={12} />
                            <span>플레이스</span>
                          </a>
                          <button
                            onClick={() => handleStartMeasureAt(target.lat, target.lng, target.roadAddress, target.name)}
                            className="p-1.5 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded inline-flex items-center gap-1 font-bold text-[11px] border border-indigo-200 cursor-pointer"
                            title="이 매장 기준 반경 500m 측정 시작"
                          >
                            <Ruler size={12} />
                            <span>500m 측정</span>
                          </button>
                        </div>
                      </td>
                      {mode === "admin" && (
                        <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleToggleContract(target)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all border cursor-pointer flex items-center gap-1 shadow-2xs ${
                                target.isContracted
                                  ? "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"
                                  : "bg-[#FED422] text-[#0F172A] border-amber-400 hover:bg-amber-400"
                              }`}
                              title={target.isContracted ? "클릭 시 계약 체결을 취소/해제합니다 (500m 락 풀림)" : "클릭 시 계약을 체결 처리합니다 (500m 상권보호 발동)"}
                            >
                              {target.isContracted ? (
                                <>
                                  <Unlock size={12} />
                                  <span>계약 해제하기</span>
                                </>
                              ) : (
                                <>
                                  <Sparkles size={12} />
                                  <span>+ 계약 체결하기</span>
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => handleOpenForm(target)}
                              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all border-0 cursor-pointer"
                              title="매장 정보 수정"
                            >
                              수정
                            </button>
                            <button
                              onClick={() => handleDeleteTarget(target._id, target.name)}
                              className="p-1.5 bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-all border-0 cursor-pointer"
                              title="매장 삭제"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ====================================================
          MODAL: 가망대상 발굴 타겟 업종 복수(중복) 선택 모달
      ==================================================== */}
      {isDiscoverModalOpen && (
        <div
          className="fixed inset-0 z-[350] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setIsDiscoverModalOpen(false)}
        >
          <div
            className="w-full max-w-xl bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-2xl flex flex-col font-sans"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-5 bg-gradient-to-r from-rose-500 via-amber-500 to-amber-400 text-white flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <Target size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">가망대상 발굴 업종 선택 (중복 가능)</h3>
                  <p className="text-[11px] text-white/90 font-bold">
                    현재 네이버 지도 화면 영역 내에서 발굴할 업종들을 자유롭게 선택하세요
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsDiscoverModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all flex items-center justify-center border-0 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs bg-[#f9fafb]">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                <span className="font-extrabold text-slate-700">
                  선택된 업종: <strong className="text-rose-600 font-black">{selectedDiscoverCats.length}개</strong>
                </span>
                <button
                  type="button"
                  onClick={toggleAllDiscoverCats}
                  className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-black rounded-lg border border-neutral-300 transition-all cursor-pointer flex items-center gap-1"
                >
                  {selectedDiscoverCats.length === DISCOVER_OPTIONS.length ? "전체 해제" : "전체 선택"}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
                {DISCOVER_OPTIONS.map((opt) => {
                  const isChecked = selectedDiscoverCats.includes(opt.id);
                  const Icon = opt.icon;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => toggleDiscoverCat(opt.id)}
                      className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex items-start gap-3 select-none ${
                        isChecked
                          ? "bg-amber-50/80 border-amber-500 shadow-sm"
                          : "bg-white border-neutral-200 hover:border-slate-300 text-slate-600"
                      }`}
                    >
                      <div className="mt-0.5">
                        {isChecked ? (
                          <CheckSquare size={18} className="text-amber-600" />
                        ) : (
                          <Square size={18} className="text-slate-300" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <Icon size={14} className={isChecked ? "text-amber-700" : "text-slate-400"} />
                          <span className={`font-black text-xs ${isChecked ? "text-amber-950" : "text-slate-700"}`}>
                            {opt.name}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-bold mt-1 truncate">{opt.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 space-y-1">
                <div className="font-black flex items-center gap-1.5 text-xs text-emerald-700">
                  <CheckCircle2 size={14} />
                  <span>녹색 핀(🟢) 일괄 통일 안내:</span>
                </div>
                <p className="text-[11px] leading-relaxed font-bold">
                  발굴된 모든 영업가능 매장은 지도 위에 선명한 <strong>녹색 핀</strong>으로 통일되어 표시됩니다. (체결 매장은 골드 핀 🌟)
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleExecuteDiscover}
                  disabled={isDiscovering || selectedDiscoverCats.length === 0}
                  className="w-full py-3.5 bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 disabled:opacity-50 text-white text-xs font-black rounded-xl transition-all shadow-md cursor-pointer border-0 flex items-center justify-center gap-2 active:scale-98"
                >
                  <Target size={16} />
                  <span>
                    {isDiscovering ? "네이버 지도 화면 전수 발굴 중..." : `선택한 ${selectedDiscoverCats.length}개 업종 실시간 발굴 시작`}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================
          MODAL: SMART TARGET STORE CREATE / EDIT (HQ ADMIN)
      ==================================================== */}
      {isFormModalOpen && (
        <div
          className="fixed inset-0 z-[300] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setIsFormModalOpen(false)}
        >
          <div
            className="w-full max-w-2xl bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col font-sans"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 bg-[#FED422] text-[#0F172A] flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <Building2 size={20} className="text-[#0F172A]" />
                <h3 className="text-base font-black text-[#0F172A]">
                  {editingTargetId ? `타겟 매장 정보 수정 [${formName}]` : "스마트 타겟 매장 등록 (네이버 지오코더 연동)"}
                </h3>
              </div>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 text-[#0F172A] transition-all flex items-center justify-center border-0 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs bg-[#f9fafb]">
              {/* 기본 정보 */}
              <div className="bg-white rounded-lg p-4 border border-neutral-200 shadow-2xs space-y-3">
                <h4 className="font-black text-slate-800 border-b border-neutral-100 pb-2">
                  1. 매장 기본 정보
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="font-extrabold text-slate-700 block mb-1">매장명 *</label>
                    <input
                      type="text"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="예: 스타벅스 강남R점, 투썸플레이스 역삼점"
                      required
                      className="w-full bg-[#F1F4F8] border-0 rounded-lg px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-extrabold text-slate-700 block mb-1">업종 분류 *</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full bg-[#F1F4F8] border-0 rounded-lg px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
                    >
                      <option value="카페/디저트">☕ 일반 카페 / 베이커리</option>
                      <option value="PC방">🎮 PC방</option>
                      <option value="만화카페">📚 만화카페</option>
                      <option value="스터디카페">🎓 스터디카페</option>
                      <option value="키즈카페">👶 키즈카페</option>
                      <option value="보드게임카페">🎲 보드게임카페</option>
                      <option value="멀티방/파티룸">🏢 멀티방/파티룸</option>
                      <option value="기타 샵인샵">📦 기타 샵인샵</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 스마트 위치 검색 & 자동 지오코딩 */}
              <div className="bg-white rounded-lg p-4 border border-neutral-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                  <h4 className="font-black text-slate-800">
                    2. 주소 입력 & 네이버 위치 자동 확인 (위경도 수동 입력 불필요)
                  </h4>
                  <span className="text-[11px] text-amber-600 font-bold">주소 검색 시 좌표가 자동 계산됩니다</span>
                </div>

                <div>
                  <label className="font-extrabold text-slate-700 block mb-1">도로명 주소 또는 매장명 검색 *</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={formRoadAddress}
                      onChange={(e) => setFormRoadAddress(e.target.value)}
                      placeholder="예: 서울 강남구 테헤란로 105"
                      required
                      className="flex-1 bg-[#F1F4F8] border-0 rounded-lg px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleAutoGeocode()}
                      disabled={isGeocoding}
                      className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-black flex items-center gap-1.5 cursor-pointer shrink-0 border-0"
                    >
                      <Navigation size={13} className="text-[#FED422]" />
                      <span>{isGeocoding ? "위치 연산 중..." : "주소/위치 자동 확인"}</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="font-extrabold text-slate-700 block mb-1">시·도</label>
                    <input
                      type="text"
                      value={formSido}
                      onChange={(e) => setFormSido(e.target.value)}
                      placeholder="예: 서울특별시"
                      required
                      className="w-full bg-[#F1F4F8] border-0 rounded-lg px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-extrabold text-slate-700 block mb-1">시·군·구</label>
                    <input
                      type="text"
                      value={formSigungu}
                      onChange={(e) => setFormSigungu(e.target.value)}
                      placeholder="예: 강남구"
                      required
                      className="w-full bg-[#F1F4F8] border-0 rounded-lg px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-extrabold text-slate-700 block mb-1">읍·면·동</label>
                    <input
                      type="text"
                      value={formDong}
                      onChange={(e) => setFormDong(e.target.value)}
                      placeholder="예: 역삼동"
                      required
                      className="w-full bg-[#F1F4F8] border-0 rounded-lg px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-extrabold text-slate-700 block mb-1">상세주소 (층/호수 등)</label>
                  <input
                    type="text"
                    value={formDetailAddress}
                    onChange={(e) => setFormDetailAddress(e.target.value)}
                    placeholder="예: 1층"
                    className="w-full bg-[#F1F4F8] border-0 rounded-lg px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none"
                  />
                </div>
              </div>

              {/* 연락처 & 채널 */}
              <div className="bg-white rounded-lg p-4 border border-neutral-200 shadow-2xs space-y-3">
                <h4 className="font-black text-slate-800 border-b border-neutral-100 pb-2">
                  3. 연락처 & 온라인 채널 정보
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="font-extrabold text-slate-700 block mb-1">매장 전화번호</label>
                    <input
                      type="text"
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      placeholder="02-000-0000"
                      className="w-full bg-[#F1F4F8] border-0 rounded-lg px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-extrabold text-slate-700 block mb-1">대표자 휴대폰</label>
                    <input
                      type="text"
                      value={formMobile}
                      onChange={(e) => setFormMobile(e.target.value)}
                      placeholder="010-0000-0000"
                      className="w-full bg-[#F1F4F8] border-0 rounded-lg px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-extrabold text-slate-700 block mb-1">이메일</label>
                    <input
                      type="email"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      placeholder="store@example.com"
                      className="w-full bg-[#F1F4F8] border-0 rounded-lg px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="font-extrabold text-slate-700 block mb-1">인스타그램 링크</label>
                    <input
                      type="text"
                      value={formInstagram}
                      onChange={(e) => setFormInstagram(e.target.value)}
                      placeholder="https://instagram.com/..."
                      className="w-full bg-[#F1F4F8] border-0 rounded-lg px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-extrabold text-slate-700 block mb-1">웹사이트 / 네이버 플레이스 링크</label>
                    <input
                      type="text"
                      value={formHomepage}
                      onChange={(e) => setFormHomepage(e.target.value)}
                      placeholder="https://..."
                      className="w-full bg-[#F1F4F8] border-0 rounded-lg px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* 계약 상태 & 500m 상권보호 */}
              <div className="bg-white rounded-lg p-4 border border-neutral-200 shadow-2xs space-y-3">
                <h4 className="font-black text-slate-800 border-b border-neutral-100 pb-2">
                  4. 계약 상태 & 500m 상권보호 설정
                </h4>
                
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 flex items-center justify-between">
                  <div>
                    <strong className="text-xs font-black text-amber-900 block">120겹파이 계약 체결 지정</strong>
                    <span className="text-[11px] text-amber-700">체결 시 이 매장을 중심으로 500m 내 모든 매장은 입점 불가 락이 걸립니다.</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formIsContracted}
                      onChange={(e) => setFormIsContracted(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="font-extrabold text-slate-700 block mb-1">담당 파트너 배정</label>
                    <input
                      type="text"
                      value={formAssignedPartnerName}
                      onChange={(e) => setFormAssignedPartnerName(e.target.value)}
                      placeholder="예: 이지훈 (제이파트너스)"
                      className="w-full bg-[#F1F4F8] border-0 rounded-lg px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-extrabold text-slate-700 block mb-1">영업 상태</label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value)}
                      className="w-full bg-[#F1F4F8] border-0 rounded-lg px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
                    >
                      <option value="영업가능">영업가능</option>
                      <option value="상담중">상담중</option>
                      <option value="계약체결">계약체결</option>
                      <option value="보류">보류</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-extrabold text-slate-700 block mb-1">영업 메모</label>
                  <textarea
                    rows={2}
                    value={formMemo}
                    onChange={(e) => setFormMemo(e.target.value)}
                    placeholder="매장 특징, 상담 이력 등 기록"
                    className="w-full bg-[#F1F4F8] border-0 rounded-lg px-3.5 py-2.5 text-xs font-medium text-slate-800 focus:outline-none resize-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#FED422] hover:bg-amber-400 text-[#0F172A] text-xs font-black rounded-lg transition-all shadow-md cursor-pointer border-0 flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 size={16} />
                  <span>{editingTargetId ? "타겟 매장 정보 수정 완료" : "신규 타겟 매장 등록 완료"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
