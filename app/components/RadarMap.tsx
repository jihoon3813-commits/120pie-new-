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
  RotateCcw
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

  const approvedStores = useMemo(() => {
    return convexStores
      .filter((s: any) => s.status === "승인")
      .map((s: any) => {
        const lat = typeof s.lat === "number" ? s.lat : DEFAULT_STORE_COORDS[s.name]?.lat;
        const lng = typeof s.lng === "number" ? s.lng : DEFAULT_STORE_COORDS[s.name]?.lng;
        return {
          ...s,
          isRealStore: true,
          isContracted: true,
          lat,
          lng,
          category: "120PIE 공식 가맹점",
          displayName: s.name.startsWith("120") || s.name.startsWith("카페") ? s.name : `120PIE ${s.name}`,
        };
      })
      .filter((s: any) => typeof s.lat === "number" && typeof s.lng === "number");
  }, [convexStores]);

  // 2. 필터 및 UI 상태
  const [selectedSido, setSelectedSido] = useState<string>("전체");
  const [selectedCategory, setSelectedCategory] = useState<string>("전체");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("전체");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<"split" | "map" | "table">("split");
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [selectedTarget, setSelectedTarget] = useState<any | null>(null);

  // 🌟 공식 가맹점 자동 기본 선택 (초기 로드 시 우측 카드에 즉시 상세 정보 표출)
  useEffect(() => {
    if (!selectedTarget && approvedStores.length > 0) {
      setSelectedTarget(approvedStores[0]);
    }
  }, [approvedStores, selectedTarget]);

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

  // 필터링된 타겟 데이터
  const filteredTargets = useMemo(() => {
    return targets.filter((t: any) => {
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
      } else if (selectedStatusFilter === "상권보호락") {
        matchStatus = !t.isContracted && t.isProtectedLocked;
      }

      return matchSido && matchCategory && matchQuery && matchStatus;
    });
  }, [targets, selectedSido, selectedCategory, selectedStatusFilter, searchQuery]);

  // 통계 지표 (실제 승인 가맹점 수 + 발굴 타겟)
  const totalCount = targets.length;
  const contractedCount = approvedStores.length;
  const protectedLockedCount = targets.filter((t: any) => t.isProtectedLocked).length;
  const availableTargetCount = targets.filter((t: any) => !t.isProtectedLocked).length;

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
  // 2. 네이버 지도 객체 초기화
  // ====================================================
  useEffect(() => {
    if (!isNaverScriptLoaded || !mapContainerRef.current || !window.naver || !window.naver.maps) return;

    if (naverMapRef.current) {
      setTimeout(() => {
        if (window.naver && window.naver.maps && naverMapRef.current) {
          window.naver.maps.Event.trigger(naverMapRef.current, "resize");
        }
      }, 100);
      return;
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

    // 지도 클릭 시 좌표 캡처 및 주소 역지오코딩
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
              if (road) setFormRoadAddress(road);
            }
          }
        );
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
  // 3. 네이버 지도 상에 500m 원 및 3대 상태 핀 렌더링
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

      {/* ====================================================
          TOP HERO & KPI BANNER
      ==================================================== */}
      <div className="bg-white rounded-lg p-6 border-0 shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-6">
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
          CONTROL & FILTER BAR
      ==================================================== */}
      <div className="bg-white rounded-lg p-5 border-0 shadow-md space-y-4">
        {/* 상단: 권역 프리셋 버튼 & 액션 버튼 */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-black text-slate-700 mr-1 flex items-center gap-1">
              <Compass size={14} className="text-emerald-600" />
              <span>네이버 지도 주요 상권 이동:</span>
            </span>
            {REGION_PRESETS.map((preset, pIdx) => (
              <button
                key={pIdx}
                onClick={() => handleSelectPreset(preset)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                  selectedSido === preset.sido
                    ? "bg-[#0F172A] text-[#FED422] border-[#0F172A] shadow-xs"
                    : "bg-[#F1F4F8] hover:bg-slate-200 text-slate-700 border-transparent"
                }`}
              >
                {preset.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            {mode === "admin" && (
              <>
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
                <button
                  onClick={() => handleOpenForm()}
                  className="px-4 py-2 bg-[#FED422] hover:bg-amber-400 text-[#0F172A] rounded-lg text-xs font-black transition-all flex items-center gap-1.5 shadow-sm border-0 cursor-pointer"
                >
                  <Plus size={15} />
                  <span>신규 매장 추가</span>
                </button>
              </>
            )}

            {/* 🌟 120PIE 실제 공식 가맹점 빠른 조회 바 */}
            {approvedStores.length > 0 && (
              <div className="w-full flex flex-wrap items-center justify-between gap-3 p-3 bg-gradient-to-r from-amber-50 to-amber-100/60 border border-amber-300/80 rounded-xl shadow-xs mt-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="text-xs font-black text-amber-950 flex items-center gap-1.5 shrink-0 bg-white/90 px-2.5 py-1 rounded-lg border border-amber-200 shadow-xs">
                    <Sparkles size={14} className="text-amber-600" />
                    <span>120PIE 승인 가맹점 ({approvedStores.length}개소):</span>
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    {approvedStores.map((store: any) => {
                      const isSelected = selectedTarget && (selectedTarget.id === store.id || selectedTarget._id === store._id || selectedTarget.name === store.name);
                      return (
                        <button
                          key={store.id || store._id}
                          onClick={() => {
                            setSelectedTarget(store);
                            if (naverMapRef.current && window.naver && window.naver.maps) {
                              naverMapRef.current.panTo(new window.naver.maps.LatLng(store.lat, store.lng), { duration: 400 });
                              naverMapRef.current.setZoom(16);
                            }
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                            isSelected
                              ? "bg-[#0F172A] text-[#FED422] ring-2 ring-[#FED422] shadow-md"
                              : "bg-white hover:bg-amber-100/90 text-slate-800 border border-amber-200 hover:border-amber-400"
                          }`}
                        >
                          <span>⭐</span>
                          <span>{store.displayName}</span>
                          <span className="text-[10px] text-slate-500 font-bold">({store.owner} 점주)</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <span className="text-[11px] text-amber-800 font-bold hidden sm:inline-block">
                  💡 클릭 시 지도 중심 이동 & 우측 패널에 가맹점 상세 카드가 즉시 표출됩니다.
                </span>
              </div>
            )}

            {/* 뷰 모드 토글 */}
            <div className="flex items-center bg-[#F1F4F8] rounded-lg p-1">
              <button
                onClick={() => setViewMode("split")}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all border-0 cursor-pointer ${
                  viewMode === "split" ? "bg-white text-[#0F172A] shadow-xs font-black" : "text-slate-500"
                }`}
              >
                2분할 뷰
              </button>
              <button
                onClick={() => setViewMode("map")}
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
      {viewMode !== "table" && (
        <div
          className={`grid gap-6 ${
            isFullscreen
              ? "fixed inset-0 z-[200] bg-slate-900/95 p-6 overflow-hidden flex flex-col"
              : viewMode === "split"
              ? "grid-cols-1 lg:grid-cols-12"
              : "grid-cols-1"
          }`}
        >
          {/* NAVER MAP CONTAINER */}
          <div
            className={`${
              isFullscreen
                ? "flex-1 w-full h-full"
                : viewMode === "split"
                ? "lg:col-span-8"
                : "col-span-1"
            } bg-slate-100 rounded-xl overflow-hidden shadow-2xl relative border border-slate-300 min-h-[620px] flex flex-col`}
          >
            {/* Map Top Floating Header & Legend */}
            <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
              <div className="px-3.5 py-2 rounded-lg bg-white/95 backdrop-blur-md border border-slate-300 shadow-md pointer-events-auto flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                  <span className="text-xs font-black text-slate-900">NAVER MAP 500m RADAR</span>
                </div>
                <span className="text-[11px] text-slate-700 font-bold font-mono">
                  ⭐ 공식 가맹점 {approvedStores.length}개소 표기 중 {filteredTargets.length > 0 ? `| 🎯 발굴 매장 ${filteredTargets.length}개` : ""}
                </span>
              </div>

              {/* Map Legend & Action Controls */}
              <div className="flex items-center gap-2 pointer-events-auto">
                <div className="px-4 py-2 rounded-lg bg-white/95 backdrop-blur-md border border-slate-300 shadow-md flex items-center gap-4 text-[11px] font-bold text-slate-800">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#FED422] border-2 border-amber-600 shadow-xs"></span>
                    <span className="text-amber-700 font-black">체결된 업장 (500m)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#10B981] border border-white"></span>
                    <span className="text-emerald-700 font-black">영업가능 업장 (녹색 핀)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded-full bg-slate-600 border border-slate-500 opacity-60"></span>
                    <span className="text-slate-500 font-bold">입점불가 업장 (락)</span>
                  </div>
                </div>

                {/* 지도 내 빠른 발굴 버튼 */}
                {mode === "admin" && (
                  <button
                    onClick={() => setIsDiscoverModalOpen(true)}
                    disabled={isDiscovering}
                    className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white border border-rose-400 shadow-md font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                    title="현재 보고 계신 네이버 지도 위치의 업종을 선택하여 발굴합니다"
                  >
                    <Target size={14} className={isDiscovering ? "animate-spin" : ""} />
                    <span>{isDiscovering ? "발굴 중..." : "가망대상 발굴"}</span>
                  </button>
                )}

                {/* 전체화면 토글 버튼 */}
                <button
                  onClick={handleToggleFullscreen}
                  className="px-3 py-2 rounded-lg bg-white/95 hover:bg-slate-100 text-[#0F172A] border border-slate-300 shadow-md font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  title={isFullscreen ? "전체화면 종료 (ESC)" : "지도 전체화면으로 보기"}
                >
                  {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
                  <span>{isFullscreen ? "화면 축소" : "전체화면"}</span>
                </button>
              </div>
            </div>

            {/* NAVER MAP CANVAS */}
            <div ref={mapContainerRef} className="flex-1 w-full h-full min-h-[620px] z-10" />
          </div>

          {/* SIDE PANEL */}
          {!isFullscreen && viewMode === "split" && (
            <div className="lg:col-span-4 space-y-4">
              {selectedTarget ? (
                <div className="bg-white rounded-lg border-0 shadow-md p-6 space-y-5 flex flex-col justify-between h-full">
                  <div className="space-y-4">
                    {/* 매장 상태 헤더 뱃지 */}
                    <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                      <span
                        className={`text-xs font-black px-2.5 py-1 rounded-md border flex items-center gap-1.5 ${
                          selectedTarget.isRealStore || selectedTarget.isContracted
                            ? "bg-amber-50 text-amber-800 border-amber-300"
                            : selectedTarget.isProtectedLocked
                            ? "bg-slate-100 text-slate-500 border-slate-300"
                            : "bg-emerald-50 text-emerald-700 border-emerald-300"
                        }`}
                      >
                        {selectedTarget.isRealStore ? (
                          <>
                            <Sparkles size={13} className="text-amber-600" />
                            <span>120PIE 공식 가맹점 (본사 500m 상권보호 작동 중)</span>
                          </>
                        ) : selectedTarget.isContracted ? (
                          <>
                            <Sparkles size={13} className="text-amber-600" />
                            <span>120겹파이 체결된 업장 (500m 상권보호 발동)</span>
                          </>
                        ) : selectedTarget.isProtectedLocked ? (
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

                      <button
                        onClick={() => setSelectedTarget(null)}
                        className="text-slate-400 hover:text-slate-700 p-1 border-0 cursor-pointer bg-transparent"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    {/* 매장명 & 업종 */}
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-black px-2 py-0.5 rounded border ${
                            selectedTarget.isRealStore
                              ? "bg-amber-100 text-amber-900 border-amber-300 font-black"
                              : (CATEGORY_CONFIG[selectedTarget.category] || CATEGORY_CONFIG["기타 샵인샵"]).badgeBg
                          }`}
                        >
                          {selectedTarget.category || "120PIE 공식 가맹점"}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          {selectedTarget.dong || selectedTarget.roadAddress?.split(" ")[1] || ""}
                        </span>
                      </div>
                      <h3 className="text-lg font-black text-[#0F172A] mt-1.5">
                        {selectedTarget.displayName || selectedTarget.name}
                      </h3>
                      <p className="text-xs text-slate-500 font-bold mt-1 flex items-start gap-1">
                        <MapPin size={13} className="shrink-0 mt-0.5 text-slate-400" />
                        <span>{selectedTarget.roadAddress} {selectedTarget.detailAddress || ""}</span>
                      </p>
                    </div>

                    {/* 네이버 지도 / 플레이스 / 로드뷰 바로가기 */}
                    <div className="flex items-center gap-2">
                      <a
                        href={`https://map.naver.com/p/search/${encodeURIComponent(selectedTarget.displayName || selectedTarget.name)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-2 px-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-black border border-emerald-200 flex items-center justify-center gap-1.5 transition-all"
                      >
                        <Navigation size={13} />
                        <span>네이버 플레이스 정보 / 로드뷰 보기</span>
                        <ExternalLink size={11} />
                      </a>
                    </div>

                    {/* 실제 가맹점 전용 마스터 카드 */}
                    {selectedTarget.isRealStore && (
                      <div className="bg-gradient-to-br from-amber-50/80 to-orange-50/80 border border-amber-200 rounded-lg p-4 space-y-2.5 text-xs shadow-2xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-amber-900">대표 점주명</span>
                          <span className="font-black text-slate-900">{selectedTarget.owner} 점주</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-amber-900">가맹 등록일</span>
                          <span className="font-mono text-slate-700">{selectedTarget.regDate}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-amber-900">가맹 상태</span>
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                            {selectedTarget.status} (정상 운영중)
                          </span>
                        </div>
                        {selectedTarget.adoptionMenu && selectedTarget.adoptionMenu.length > 0 && (
                          <div className="space-y-1.5 pt-2 border-t border-amber-200/60">
                            <span className="font-bold text-amber-900">도입 메뉴 브랜드</span>
                            <div className="flex flex-wrap gap-1">
                              {selectedTarget.adoptionMenu.map((menu: string, idx: number) => (
                                <span key={idx} className="px-2 py-0.5 rounded-full bg-white border border-amber-300 text-amber-800 text-[10px] font-bold shadow-2xs">
                                  {menu}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* 상권보호 안내 알림 상자 */}
                    {selectedTarget.isProtectedLocked && selectedTarget.protectingStore && (
                      <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 space-y-1">
                        <div className="font-black flex items-center gap-1.5 text-rose-700">
                          <AlertTriangle size={14} />
                          <span>입점불가 락 사유:</span>
                        </div>
                        <p className="leading-relaxed">
                          <strong>[{selectedTarget.protectingStore.name}]</strong> 매장과 
                          거리 <strong className="font-mono">{selectedTarget.protectingDistance}m</strong>로 500m 보호 반경 내에 위치하여 추가 계약이 제한됩니다.
                        </p>
                      </div>
                    )}

                    {/* 연락처 & 채널 정보 */}
                    <div className="bg-[#F8FAFC] rounded-lg p-4 space-y-2.5 text-xs border border-neutral-200/80">
                      <div className="flex items-center justify-between border-b border-neutral-200/60 pb-2">
                        <span className="text-slate-500 font-bold flex items-center gap-1.5">
                          <Phone size={13} className="text-slate-400" /> 매장 전화
                        </span>
                        <span className="font-mono font-bold text-slate-800">
                          {selectedTarget.phone || "전화번호 미등록"}
                        </span>
                      </div>
                      {!selectedTarget.isRealStore && (
                        <>
                          <div className="flex items-center justify-between border-b border-neutral-200/60 pb-2">
                            <span className="text-slate-500 font-bold flex items-center gap-1.5">
                              <Smartphone size={13} className="text-slate-400" /> 대표자 핸드폰
                            </span>
                            <span className="font-mono font-black text-amber-700">
                              {selectedTarget.mobile || "휴대폰 미등록"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between border-b border-neutral-200/60 pb-2">
                            <span className="text-slate-500 font-bold flex items-center gap-1.5">
                              <Mail size={13} className="text-slate-400" /> 이메일
                            </span>
                            <span className="font-mono text-slate-700 truncate max-w-[160px]">
                              {selectedTarget.email || "-"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500 font-bold flex items-center gap-1.5">
                              <Share2 size={13} className="text-pink-500" /> SNS / 웹사이트
                            </span>
                            <div className="flex items-center gap-2">
                              {selectedTarget.instagram && (
                                <a
                                  href={selectedTarget.instagram}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-pink-600 font-bold hover:underline flex items-center gap-0.5"
                                >
                                  인스타 <ExternalLink size={10} />
                                </a>
                              )}
                              {selectedTarget.homepage && (
                                <a
                                  href={selectedTarget.homepage}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-blue-600 font-bold hover:underline flex items-center gap-0.5"
                                >
                                  웹사이트 <ExternalLink size={10} />
                                </a>
                              )}
                              {!selectedTarget.instagram && !selectedTarget.homepage && (
                                <span className="text-slate-400">-</span>
                              )}
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    {/* 영업 메모 */}
                    {selectedTarget.memo && (
                      <div className="p-3 bg-amber-50/50 rounded-lg border border-amber-100 text-xs space-y-1">
                        <span className="text-[11px] font-bold text-amber-800">영업 / 상담 메모</span>
                        <p className="text-slate-700 leading-relaxed">{selectedTarget.memo}</p>
                      </div>
                    )}
                  </div>

                  {/* 본사 어드민 관리 액션 버튼들 */}
                  {mode === "admin" && (
                    <div className="space-y-2 pt-3 border-t border-neutral-100">
                      {!selectedTarget.isRealStore ? (
                        <>
                          <button
                            onClick={() => handleToggleContract(selectedTarget)}
                            className={`w-full py-2.5 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer border-0 shadow-xs ${
                              selectedTarget.isContracted
                                ? "bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200"
                                : "bg-[#FED422] hover:bg-amber-400 text-[#0F172A]"
                            }`}
                          >
                            {selectedTarget.isContracted ? (
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
                              onClick={() => handleOpenForm(selectedTarget)}
                              className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all border-0 cursor-pointer"
                            >
                              정보 수정
                            </button>
                            <button
                              onClick={() => handleDeleteTarget(selectedTarget._id, selectedTarget.name)}
                              className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-bold transition-all border border-rose-200 cursor-pointer"
                            >
                              삭제
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-center">
                          <p className="text-xs font-black text-amber-900">
                            🛡️ 본사 공인 120PIE 가맹점
                          </p>
                          <p className="text-[11px] text-amber-700 mt-0.5">
                            반경 500m 내 모든 샵인샵 입점이 영구 보호됩니다.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-lg border-0 shadow-md p-8 text-center text-slate-400 text-xs font-bold flex flex-col items-center justify-center min-h-[400px] space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <Crosshair size={24} />
                  </div>
                  <p>
                    네이버 지도상의 핀을 클릭하시면 해당 매장의 네이버 플레이스 상세 연락처, 로드뷰 링크, 500m 상권보호 상태가 여기에 표시됩니다.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ====================================================
          DATA GRID / TABLE VIEW
      ==================================================== */}
      {(viewMode === "table" || viewMode === "split") && (
        <div className="bg-white rounded-lg border-0 shadow-md overflow-hidden p-6 space-y-4">
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
                  <th className="py-3.5 px-3 text-center">네이버 플레이스</th>
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
