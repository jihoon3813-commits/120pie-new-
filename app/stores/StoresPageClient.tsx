"use client";

import Link from "next/link";
import { ArrowLeft, ArrowUpRight, MapPin, Store, ExternalLink, Menu, X, ArrowRight, Search } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import FloatingAndInquiry from "@/app/components/FloatingAndInquiry";
import Footer from "@/app/components/Footer";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Script from "next/script";

const logoUrlBlack = "https://res.cloudinary.com/dfarfqx7e/image/upload/f_auto,q_auto/v1781183166/120%ED%8C%8C%EC%9D%B4_%EC%BB%A4%ED%94%BC_%EA%B8%88%EC%A0%95%EC%A0%90_%EC%B1%84%EB%84%90%EC%82%AC%EC%9D%B8_%EB%94%94%EC%9E%90%EC%9D%B8_250828_cnfrik.png";
const logoUrlPink = "https://res.cloudinary.com/dx7l09wwu/image/upload/f_auto,q_auto/v1779846449/logo_120pie_coffee3_jzgtyi.png";

interface StoreInfo {
  id: string;
  name: string;
  owner: string;
  phone: string;
  status: "승인" | "대기" | "보류" | "중지" | "취소";
  roadAddress: string;
  detailAddress: string;
  regDate: string;
  adoptionMenu: string[];
}

const DEFAULT_STORES: StoreInfo[] = [
  {
    id: "owner",
    name: "강남역삼점",
    owner: "김지훈",
    phone: "010-3813-1200",
    status: "승인",
    roadAddress: "경기 군포시 엘에스로 143 (금정동, 1층 1001호)",
    detailAddress: "1층 1001호",
    regDate: "2026-05-01",
    adoptionMenu: ["120pie", "egg120", "츄러스120", "핫도그120", "120coffee"]
  },
  {
    id: "hongdae",
    name: "홍대입구점",
    owner: "이민우",
    phone: "010-4211-5678",
    status: "승인",
    roadAddress: "서울 마포구 양화로 160 (동교동)",
    detailAddress: "2층 201호",
    regDate: "2026-04-12",
    adoptionMenu: ["120pie", "egg120", "츄러스120"]
  },
  {
    id: "seomyeon",
    name: "부산서면점",
    owner: "박수진",
    phone: "010-5182-9012",
    status: "승인",
    roadAddress: "부산 부산진구 중앙대로 730 (부전동)",
    detailAddress: "1층",
    regDate: "2026-05-20",
    adoptionMenu: ["120pie", "120coffee"]
  }
];

const MENU_MAP: Record<string, { label: string; colorClass: string }> = {
  "120pie": { label: "120겹파이", colorClass: "bg-rose-500/10 text-rose-500 border border-rose-500/20" },
  "egg120": { label: "에그120", colorClass: "bg-amber-500/10 text-amber-600 border border-amber-500/20" },
  "츄러스120": { label: "츄러스120", colorClass: "bg-orange-500/10 text-orange-600 border border-orange-500/20" },
  "핫도그120": { label: "핫도그120", colorClass: "bg-red-500/10 text-red-600 border border-red-500/20" },
  "떡볶이120": { label: "떡볶이120", colorClass: "bg-purple-500/10 text-purple-600 border border-purple-500/20" },
  "120coffee": { label: "120커피", colorClass: "bg-cyan-500/10 text-cyan-600 border border-cyan-500/20" }
};

const cleanStoreName = (name: string) => {
  return name
    .replace(/^120겹파이\s*/, "")
    .replace(/^120겹파이/, "")
    .replace(/^120pie\s*/, "")
    .replace(/^120pie/, "")
    .trim();
};

declare global {
  interface Window {
    kakao: any;
    naver: any;
  }
}

function NaverMap({
  stores,
  activeStoreId,
  onSelectStore,
  isPink,
}: {
  stores: StoreInfo[];
  activeStoreId: string;
  onSelectStore: (id: string) => void;
  isPink?: boolean;
}) {
  const [mounted, setMounted] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [submoduleReady, setSubmoduleReady] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  const [fallbackReason, setFallbackReason] = useState("");
  const [clientId, setClientId] = useState("");
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<{ [id: string]: any }>({});
  const infoWindowsRef = useRef<{ [id: string]: any }>({});
  const [resolvedCoords, setResolvedCoords] = useState<{ [id: string]: { lat: number; lng: number } }>({});

  useEffect(() => {
    setMounted(true);
    const storedKey = localStorage.getItem("120_naver_client_id") || "";
    const envKey = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID || "";
    const activeKey = storedKey.trim() || envKey.trim();
    setClientId(activeKey);

    if (activeKey) {
      if (window.naver && window.naver.maps) {
        setScriptLoaded(true);
        if (window.naver.maps.Service) {
          setSubmoduleReady(true);
        }
      }
    } else {
      setFallbackReason("CLIENT_ID_MISSING");
      setUseFallback(true);
    }
  }, []);

  useEffect(() => {
    if (!mounted || !clientId) return;

    const timer = setTimeout(() => {
      if (!mapInstanceRef.current && Object.keys(resolvedCoords).length === 0) {
        console.warn("Naver Map initialization timed out. Falling back to Google Maps.");
        setFallbackReason("TIMEOUT_8000MS");
        setUseFallback(true);
      }
    }, 8000);

    return () => clearTimeout(timer);
  }, [mounted, clientId, resolvedCoords]);

  useEffect(() => {
    if (!scriptLoaded) return;

    if (window.naver && window.naver.maps && window.naver.maps.Service) {
      setSubmoduleReady(true);
      return;
    }

    const interval = setInterval(() => {
      if (window.naver && window.naver.maps && window.naver.maps.Service) {
        setSubmoduleReady(true);
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [scriptLoaded]);

  useEffect(() => {
    if (!scriptLoaded || !submoduleReady || !window.naver || !window.naver.maps || !window.naver.maps.Service || stores.length === 0 || useFallback) return;

    const naver = window.naver;
    const newCoords: { [id: string]: { lat: number; lng: number } } = {};
    let pendingCount = stores.length;

    stores.forEach((store) => {
      const cleanAddr = store.roadAddress.split("(")[0].trim();
      naver.maps.Service.geocode(
        { query: cleanAddr },
        (status: any, response: any) => {
          if (status === naver.maps.Service.Status.OK && response.v2.addresses[0]) {
            const item = response.v2.addresses[0];
            newCoords[store.id] = { lat: parseFloat(item.y), lng: parseFloat(item.x) };
          } else {
            console.error(`Geocoding failed for ${store.name}: ${status}`);
          }
          pendingCount--;
          if (pendingCount === 0) {
            setResolvedCoords(newCoords);
          }
        }
      );
    });
  }, [scriptLoaded, submoduleReady, stores, useFallback]);

  useEffect(() => {
    if (Object.keys(resolvedCoords).length === 0 || !mapRef.current || useFallback) return;
    
    const naver = window.naver;

    if (mapInstanceRef.current) {
      Object.values(markersRef.current).forEach((m: any) => m.setMap(null));
      markersRef.current = {};
      infoWindowsRef.current = {};
      mapInstanceRef.current = null;
    }

    const firstCoord = Object.values(resolvedCoords)[0];
    const initialCenter = new naver.maps.LatLng(firstCoord.lat, firstCoord.lng);

    const mapOptions = {
      center: initialCenter,
      zoom: 12,
      zoomControl: true,
      zoomControlOptions: {
        position: naver.maps.Position.TOP_RIGHT,
      },
    };

    const map = new naver.maps.Map(mapRef.current, mapOptions);
    mapInstanceRef.current = map;

    const markers: { [id: string]: any } = {};
    const infoWindows: { [id: string]: any } = {};
    const bounds = new naver.maps.LatLngBounds();

    stores.forEach((store) => {
      const coord = resolvedCoords[store.id];
      if (!coord) return;

      const latlng = new naver.maps.LatLng(coord.lat, coord.lng);
      bounds.extend(latlng);

      const markerIcon = {
        content: `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
            <div style="
              background: ${isPink ? '#f25f8a' : '#ffd500'}; 
              border: 2px solid ${isPink ? '#f25f8a' : '#ffd500'}; 
              border-radius: 50%; 
              width: 44px; 
              height: 44px; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              box-shadow: 0 3px 8px rgba(0,0,0,0.18);
              overflow: hidden;
            ">
              <img src="${isPink ? 'https://res.cloudinary.com/dx7l09wwu/image/upload/f_auto,q_auto/v1779846449/logo_120pie_coffee3_jzgtyi.png' : 'https://res.cloudinary.com/dfarfqx7e/image/upload/f_auto,q_auto/v1781186180/logo_120pie_coffee_nu2_c7tiiy_zi1pjo.png'}" style="width: 32px; height: 32px; object-fit: contain;" />
            </div>
            <div style="
              width: 0; 
              height: 0; 
              border-left: 6px solid transparent; 
              border-right: 6px solid transparent; 
              border-top: 8px solid ${isPink ? '#f25f8a' : '#ffd500'};
              margin-top: -1px;
            "></div>
          </div>
        `,
        size: new naver.maps.Size(44, 51),
        anchor: new naver.maps.Point(22, 51),
      };

      const marker = new naver.maps.Marker({
        position: latlng,
        map: map,
        icon: markerIcon,
      });

      const infoWindow = new naver.maps.InfoWindow({
        content: `
          <div style="
            padding: 6px 10px; 
            font-size: 10px; 
            font-weight: bold; 
            color: #2d2026; 
            background: white; 
            border-radius: 6px; 
            border: 1px solid ${isPink ? '#f25f8a' : '#ffd500'};
            box-shadow: 0 2px 6px rgba(0,0,0,0.15);
          ">
            ${cleanStoreName(store.name)}
          </div>
        `,
        borderWidth: 0,
        backgroundColor: "transparent",
        disableAnchor: true,
        pixelOffset: new naver.maps.Point(0, -10),
      });

      markers[store.id] = marker;
      infoWindows[store.id] = infoWindow;

      naver.maps.Event.addListener(marker, "click", () => {
        onSelectStore(store.id);
      });
    });

    markersRef.current = markers;
    infoWindowsRef.current = infoWindows;

    if (Object.keys(resolvedCoords).length > 1) {
      map.fitBounds(bounds);
    } else {
      map.setCenter(initialCenter);
      map.setZoom(14);
    }
  }, [resolvedCoords, stores, isPink, useFallback]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || Object.keys(resolvedCoords).length === 0) return;

    const coord = resolvedCoords[activeStoreId];
    if (coord) {
      const naver = window.naver;
      const targetLatLng = new naver.maps.LatLng(coord.lat, coord.lng);
      map.morph(targetLatLng, 14);

      Object.keys(infoWindowsRef.current).forEach((id) => {
        if (id === activeStoreId) {
          infoWindowsRef.current[id].open(map, markersRef.current[id]);
        } else {
          infoWindowsRef.current[id].close();
        }
      });
    }
  }, [activeStoreId, resolvedCoords]);

  useEffect(() => {
    if (!clientId || !mounted) return;

    const scriptId = "naver-map-script";
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    const handleScriptLoad = () => {
      setScriptLoaded(true);
    };

    const handleScriptError = () => {
      setFallbackReason("SCRIPT_LOAD_ERROR");
      setUseFallback(true);
    };

    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}&submodules=geocoder`;
      script.async = true;
      script.onload = handleScriptLoad;
      script.onerror = handleScriptError;
      document.head.appendChild(script);
    } else {
      if (window.naver && window.naver.maps) {
        setScriptLoaded(true);
        if (window.naver.maps.Service) {
          setSubmoduleReady(true);
        }
      } else {
        script.addEventListener("load", handleScriptLoad);
        script.addEventListener("error", handleScriptError);
      }
    }

    return () => {
      if (script) {
        script.removeEventListener("load", handleScriptLoad);
        script.removeEventListener("error", handleScriptError);
      }
    };
  }, [clientId, mounted]);

  if (!mounted) {
    return (
      <div className="absolute inset-0 w-full h-full bg-neutral-100 flex items-center justify-center text-xs font-bold text-neutral-400">
        지도를 로드하는 중...
      </div>
    );
  }

  if (useFallback || !clientId) {
    const activeStore = stores.find((s) => s.id === activeStoreId) || stores[0];
    const cleanAddr = activeStore ? activeStore.roadAddress.split("(")[0].trim() : "서울 송파구 삼학사로 73";
    return (
      <div className="absolute inset-0 w-full h-full">
        <iframe
          src={`https://maps.google.com/maps?q=${encodeURIComponent(cleanAddr)}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
          className="w-full h-full border-0"
          allowFullScreen
          loading="lazy"
          title={`${activeStore?.name || "120겹파이"} 지도 위치`}
        />
        <div className="absolute bottom-2 left-2 right-2 bg-white/95 backdrop-blur-sm border border-[#ffd500]/30 rounded-lg p-2.5 text-[9px] text-[#0d233a] font-bold text-center z-30 shadow-md leading-normal">
          💡 네이버 지도 API 인증 대기 중이거나 등록되지 않아 안전하게 구글 지도로 로드되었습니다. (이유: {fallbackReason || "알 수 없음"}, 키: {clientId || "없음"}) (인증키 등록 및 네이버 콘솔에 웹 사이트 주소 URL 추가 시 네이버 지도로 즉시 자동 전환됩니다.)
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 w-full h-full">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
}

export default function StoresPageClient() {
  const [stores, setStores] = useState<StoreInfo[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>("전체");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [selectedStoreId, setSelectedStoreId] = useState<string>("");
  const [theme, setTheme] = useState<"pink" | "yellow">("yellow");
  const [inquiryForcedOpen, setInquiryForcedOpen] = useState(false);
  const [searchType, setSearchType] = useState<"direct" | "region">("direct");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleCurrentLocationSearch = () => {
    alert("현재 위치 정보 수집을 시작합니다... (시뮬레이션: 가장 가까운 매장인 '강남역삼점'을 탐색해 화면에 활성화했습니다.)");
    setSelectedStoreId("owner");
    setSearchQuery("");
  };

  // Fetch stores in real-time from Convex backend
  const convexStores = useQuery(api.stores.get);

  // Load theme and stores dynamically from browser environment (local cache fallback)
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const params = new URLSearchParams(window.location.search);
        const urlTheme = params.get("theme");
        if (urlTheme === "pink") {
          setTheme("pink");
        } else {
          setTheme("yellow"); // Default to yellow
        }

        const stored = localStorage.getItem("120_stores");
        if (stored) {
          const parsed = JSON.parse(stored) as StoreInfo[];
          setStores(parsed);
        } else {
          setStores(DEFAULT_STORES);
        }
      } catch (err) {
        console.error("Failed to initialize in useEffect", err);
        setStores(DEFAULT_STORES);
      }
    }
  }, []);

  // Update state and local storage when stores are loaded/updated from Convex
  useEffect(() => {
    if (convexStores) {
      setStores(convexStores as StoreInfo[]);
      localStorage.setItem("120_stores", JSON.stringify(convexStores));
    }
  }, [convexStores]);

  // Update theme state and URL parameters smoothly on toggle click
  const handleThemeChange = (newTheme: "pink" | "yellow") => {
    setTheme(newTheme);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("theme", newTheme);
      window.history.pushState(null, "", url.search);
    }
  };

  // Dynamic Theme Token Classes Mapping
  const isPink = theme === "pink";
  const isYellow = theme === "yellow";
  const logoUrl = isPink ? logoUrlBlack : "/logo_yellow_blue.png";
  
  // Theme Background & Header Tokens
  const pageBg = isPink ? "bg-[#0a0a0a] text-neutral-200" : "bg-[#fffdf4] text-[#0d233a]";
  const headerBg = isPink ? "bg-neutral-950/80 border-b border-neutral-900" : "bg-[#fffdf4]/80 border-b border-[#e6dfc3]";
  
  // Theme Typography Tokens
  const textTitle = isPink ? "text-white" : "text-[#0d233a]";
  const textDesc = isPink ? "text-neutral-400" : "text-[#576575]";
  const labelAccent = isPink ? "text-amber-400 font-extrabold" : "text-[#0d233a] font-extrabold";
  
  // Theme Section and Container Tokens
  const sectionBg = isPink ? "bg-neutral-900 border border-neutral-850 shadow-md shadow-black/20" : "bg-white border border-[#e6dfc3] shadow-md shadow-[#0d233a]/[0.02]";
  const cardBg = isPink ? "bg-neutral-900 border border-neutral-850 shadow-md shadow-black/20" : "bg-white border border-[#e6dfc3] shadow-md shadow-[#0d233a]/[0.02]";
  const innerCardBg = isPink ? "bg-neutral-950 border border-neutral-850" : "bg-[#fff9e6] border border-[#ffd500]/20";
  const borderHighlight = isPink ? "border-neutral-850" : "border-[#ffd500]/20";
  
  // Theme Tab Control Tokens
  const tabsWrapperBg = isPink ? "bg-neutral-900 border border-neutral-850" : "bg-[#fff9e6] border border-[#ffd500]/15";
  const backBtnClass = isPink ? "bg-amber-400 text-neutral-950 hover:bg-amber-300 shadow-amber-400/10" : "bg-[#ffd500] text-[#0d233a] hover:bg-[#e6bd00] shadow-[#ffd500]/10";
  
  // Theme Table Row Tokens
  const rowSelectedBgClass = isPink ? "bg-neutral-950 hover:bg-neutral-950" : "bg-[#ffd500]/5 hover:bg-[#ffd500]/10";
  const rowBorder = isPink ? "border-neutral-850" : "border-[#e6dfc3]/80";
  const textStoreName = isPink ? "text-white" : "text-[#0d233a]";
  const textStoreAddr = isPink ? "text-neutral-400" : "text-[#576575]";
  const activeDotClass = isPink ? "bg-amber-400" : "bg-[#ffd500]";
  const backUrl = isPink ? "/v3" : "/";

  // Filter approved stores
  const approvedStores = stores.filter(s => s.status === "승인");

  // Determine regional categorization
  const getStoreRegion = (roadAddress: string): string => {
    if (roadAddress.includes("서울")) return "서울";
    if (roadAddress.includes("경기") || roadAddress.includes("인천")) return "경기/인천";
    if (roadAddress.includes("부산") || roadAddress.includes("경남") || roadAddress.includes("울산") || roadAddress.includes("경북")) return "부산/경남";
    return "기타 지역";
  };

  // Filter list by selected tab or search query (matching Image 2 search logic)
  const finalFilteredStores = approvedStores.filter(store => {
    // 1. Region filter (if tab is region)
    if (searchType === "region") {
      if (selectedRegion === "전체") return true;
      return getStoreRegion(store.roadAddress) === selectedRegion;
    }
    // 2. Direct query filter (if tab is direct)
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      store.name.toLowerCase().includes(q) ||
      store.roadAddress.toLowerCase().includes(q) ||
      (store.detailAddress && store.detailAddress.toLowerCase().includes(q))
    );
  });

  // Default selection to first store of filtered list
  const activeStore = finalFilteredStores.find(s => s.id === selectedStoreId) || finalFilteredStores[0];

  useEffect(() => {
    if (activeStore && activeStore.id !== selectedStoreId) {
      setSelectedStoreId(activeStore.id);
    }
  }, [activeStore, selectedStoreId]);

  // Direct redirection links using pure road address ONLY
  const naverMapUrl = (address: string) => {
    const baseAddr = address.split("(")[0].trim();
    return `https://map.naver.com/v5/search/${encodeURIComponent(baseAddr)}`;
  };

  const kakaoMapUrl = (address: string) => {
    const baseAddr = address.split("(")[0].trim();
    return `https://map.kakao.com/?q=${encodeURIComponent(baseAddr)}`;
  };

  // Region stats counting helper
  const getRegionCount = (regionName: string) => {
    if (regionName === "전체") return approvedStores.length;
    return approvedStores.filter(s => getStoreRegion(s.roadAddress) === regionName).length;
  };

  const regions = ["전체", "서울", "경기/인천", "부산/경남", "기타 지역"];

  // Phone number format helper
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

  return (
    <div className={`min-h-screen flex flex-col font-sans antialiased transition-colors duration-300 ${pageBg}`}>
      {/* Dynamic Header */}
      <header className={`sticky top-0 z-50 backdrop-blur-md transition-all duration-300 ${headerBg}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between min-h-[60px] sm:min-h-[80px] lg:min-h-[94px] gap-2.5 sm:gap-4">
          <div className="shrink-0 py-2">
            <Link className="flex items-center group shrink-0" href={backUrl} aria-label="120pie 홈으로 이동">
              <img
                src={logoUrl}
                alt="120pie & coffee"
                className="h-5 sm:h-7 lg:h-8 w-auto object-contain group-hover:scale-102 transition-all duration-200"
              />
            </Link>
          </div>

          <nav className={`hidden lg:flex items-center justify-center gap-2.5 xl:gap-4 text-[10px] xl:text-[13px] font-bold shrink-0 ${isPink ? "text-neutral-400 hover:text-rose-400" : "text-[#576575] hover:text-[#0d233a]"}`}>
            <Link href={`/menu?theme=${theme}`} className="hover:text-amber-400 transition-colors">메뉴</Link>
            <Link href={`/stores?theme=${theme}`} className={`hover:scale-105 transition-transform shrink-0 ${
              isPink 
                ? "text-rose-500 hover:text-rose-600 font-extrabold" 
                : "text-[#ffd500] hover:text-[#e6bd00] font-extrabold"
            }`}>
              가맹점 현황
            </Link>
            <Link href={`/costs?theme=${theme}`} className="hover:text-amber-400 transition-colors">비용 안내</Link>
            <Link href={`/franchise?theme=${theme}`} className="hover:text-amber-400 transition-colors">창업 안내</Link>
            <Link href={`/faq?theme=${theme}`} className="hover:text-amber-400 transition-colors">FAQ</Link>
          </nav>

          <div className="flex items-center gap-2.5">
            <div className={`flex items-center rounded-full border p-0.5 text-[10px] font-black ${isPink ? "border-[#f2ccd7]/20 bg-neutral-900/60" : "border-[#e6dfc3] bg-neutral-900/5"}`}>
              <button
                type="button"
                onClick={() => handleThemeChange("yellow")}
                className={`rounded-full px-2.5 py-1 transition-colors cursor-pointer border-0 ${
                  isYellow 
                    ? "landing-theme-active bg-amber-400 text-neutral-950 font-extrabold shadow-sm" 
                    : isPink ? "text-neutral-400 hover:text-white" : "text-neutral-500 hover:text-[#0d233a]"
                }`}
              >
                옐로
              </button>
              <button
                type="button"
                onClick={() => handleThemeChange("pink")}
                className={`rounded-full px-2.5 py-1 transition-colors cursor-pointer border-0 ${
                  isPink 
                    ? "landing-theme-active bg-amber-400 text-neutral-950 font-extrabold shadow-sm" 
                    : "text-neutral-500 hover:text-[#0d233a]"
                }`}
              >
                블랙
              </button>
            </div>
            <Link className={`hidden sm:inline-flex items-center justify-center px-4 py-2.5 rounded-lg border text-xs font-bold ${
              isYellow
                ? "border-[#e6dfc3] bg-white text-[#576575] hover:bg-[#fffcf0] hover:text-[#0d233a] transition-all"
                : "border-neutral-800 bg-neutral-900 text-neutral-350 hover:bg-neutral-800 hover:text-white transition-all"
            }`} href="/portal" target="_blank" rel="noopener noreferrer">
              점주전용
            </Link>
            <button
              type="button"
              onClick={() => setInquiryForcedOpen(true)}
              className={`pink-primary-button hidden sm:inline-flex items-center justify-center px-5 py-2.5 rounded-lg text-xs sm:text-sm font-black hover:scale-[1.02] transition-all border-0 cursor-pointer ${
                isPink 
                  ? "bg-rose-500 hover:bg-rose-600 text-white shadow-[0_4px_16px_rgba(244,63,94,0.2)]" 
                  : "bg-amber-400 hover:bg-amber-300 text-neutral-950 shadow-[0_4px_16px_rgba(251,191,36,0.2)]"
              }`}
            >
              상담 신청 <ArrowRight size={14} className="ml-1.5 shrink-0" />
            </button>
            <button
              type="button"
              className={`pink-primary-button lg:hidden inline-flex items-center justify-center rounded-lg p-2.5 text-xs font-black border-0 cursor-pointer ${
                isPink 
                  ? "bg-rose-500 text-white hover:bg-rose-600" 
                  : "bg-amber-400 text-neutral-950 hover:bg-amber-300"
              }`}
              aria-expanded={mobileNavOpen}
              aria-controls="mobile-landing-nav"
              onClick={() => setMobileNavOpen(open => !open)}
            >
              {mobileNavOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
        {mobileNavOpen && (
          <nav id="mobile-landing-nav" className={`lg:hidden border-t px-4 pb-5 pt-3.5 transition-all duration-300 ${isYellow ? "bg-[#fffdf2]/98 border-t border-[#e6dfc3]/60" : "bg-[#0f0a0c]/98 border-t border-[#f2ccd7]/15"}`}>
            <div className="grid grid-cols-2 gap-2 text-sm font-bold">
              <Link href={`/menu?theme=${theme}`} onClick={() => setMobileNavOpen(false)} className={`rounded-xl px-4 py-3 transition-colors ${isYellow ? "bg-white border border-[#e6dfc3]/60 text-[#576575]" : "bg-[#181114] border border-[#f2ccd7]/10 text-neutral-400"}`}>
                메뉴
              </Link>
              <Link href={`/stores?theme=${theme}`} onClick={() => setMobileNavOpen(false)} className={`rounded-xl px-4 py-3 transition-colors font-extrabold ${
                isPink 
                  ? "text-rose-500 bg-rose-500/10 border border-rose-500/20" 
                  : "text-[#ffd500] bg-[#ffd500]/10 border border-[#ffd500]/20"
              }`}>
                가맹점 현황
              </Link>
              <Link href={`/costs?theme=${theme}`} onClick={() => setMobileNavOpen(false)} className={`rounded-xl px-4 py-3 transition-colors ${isYellow ? "bg-white border border-[#e6dfc3]/60 text-[#576575]" : "bg-[#181114] border border-[#f2ccd7]/10 text-neutral-400"}`}>
                비용 안내
              </Link>
              <Link href={`/franchise?theme=${theme}`} onClick={() => setMobileNavOpen(false)} className={`rounded-xl px-4 py-3 transition-colors ${isYellow ? "bg-white border border-[#e6dfc3]/60 text-[#576575]" : "bg-[#181114] border border-[#f2ccd7]/10 text-neutral-400"}`}>
                창업 안내
              </Link>
              <Link href={`/faq?theme=${theme}`} onClick={() => setMobileNavOpen(false)} className={`col-span-2 rounded-xl px-4 py-3 transition-colors text-center ${isYellow ? "bg-white border border-[#e6dfc3]/60 text-[#576575]" : "bg-[#181114] border border-[#f2ccd7]/10 text-neutral-400"}`}>
                FAQ
              </Link>
            </div>
            <div className="flex gap-2 mt-3 w-full">
              <Link
                href="/portal"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileNavOpen(false)}
                className={`flex-1 flex items-center justify-center rounded-xl px-4 py-3.5 text-xs sm:text-sm font-black border transition-all focus:outline-none focus:ring-0 outline-none ${
                  isYellow
                    ? "border-[#e6dfc3] bg-white text-[#576575] hover:bg-[#fffcf0] hover:text-[#0d233a]"
                    : "border-neutral-800 bg-neutral-900 text-neutral-350 hover:bg-neutral-800 hover:text-white"
                }`}
              >
                점주전용
              </Link>
              <button
                type="button"
                onClick={() => { setMobileNavOpen(false); setInquiryForcedOpen(true); }}
                className={`pink-primary-button flex-1 flex items-center justify-center rounded-xl px-4 py-3.5 text-xs sm:text-sm font-black border-0 cursor-pointer ${
                  isPink 
                    ? "bg-rose-500 text-white hover:bg-rose-600 shadow-[0_4px_16px_rgba(244,63,94,0.25)]" 
                    : "bg-amber-400 text-neutral-950 hover:bg-amber-300 shadow-[0_4px_16px_rgba(251,191,36,0.25)]"
                }`}
              >
                상담 신청 <ArrowRight size={14} className="ml-1.5 shrink-0" />
              </button>
            </div>
          </nav>
        )}
      </header>

      {/* Main content wrapper with margin alignment matching header & footer */}
      <main className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 flex flex-col items-center">
        <div className="w-full max-w-7xl mx-auto flex flex-col gap-6">
          {/* Main Title Section */}
          <div className="max-w-2xl">
            <span className={`font-bold tracking-widest text-xs uppercase mb-2 block font-mono ${labelAccent}`}>FRANCHISE PARTNERS</span>
            <h1 className={`text-3xl sm:text-4xl font-black tracking-tight leading-tight mb-2 ${textTitle}`}>
              120pie 매장 현황
            </h1>
            <p className={`text-xs sm:text-sm font-medium leading-relaxed ${textDesc}`}>
              지도로 확인하고 상세 위치를 실시간 지도로 조회할 수 있습니다.
            </p>
          </div>

          {/* Map & List Split Box (Explicit height and border matching the header margins) */}
          <div className={`w-full h-[550px] sm:h-[650px] lg:h-[700px] flex flex-col lg:flex-row rounded-3xl overflow-hidden shadow-xl border transition-colors duration-300 ${
            isPink ? "bg-[#140e11] border-neutral-850" : "bg-white border-[#e6dfc3]"
          }`}>
            
            {/* Left Side Panel: Search & Store List */}
            <div className={`w-full lg:w-[380px] h-[45%] lg:h-full shrink-0 flex flex-col relative lg:border-r transition-colors ${
              isPink ? "bg-[#140e11] border-neutral-850" : "bg-white border-[#e6dfc3]/80"
            }`}>
              {/* A. Search Panel Header */}
              <div className={`p-4 border-b space-y-3.5 transition-colors ${
                isPink ? "border-neutral-850" : "border-[#e6dfc3]/60 bg-[#fffdf9]/50"
              }`}>
                <div className="flex items-center gap-2">
                  <span className={`text-[9px] tracking-widest font-black uppercase font-mono ${labelAccent}`}>STORE LOCATOR</span>
                  <h2 className={`text-sm font-black ${textTitle}`}>120pie 매장 찾기</h2>
                </div>
                
                {/* Search Type Tabs */}
                <div className={`flex p-1 rounded-xl border ${
                  isPink ? "bg-neutral-950 border-neutral-850" : "bg-[#fff9e6] border-[#ffd500]/15"
                }`}>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchType("direct");
                      setSelectedRegion("전체");
                    }}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all border-0 cursor-pointer ${
                      searchType === "direct"
                        ? isPink
                          ? "bg-rose-500 text-white shadow-sm font-extrabold"
                          : "bg-[#ffd500] text-[#0d233a] shadow-sm font-extrabold"
                        : isPink ? "text-neutral-400 hover:text-white" : "text-[#735965] hover:text-[#bf3e67]"
                    }`}
                  >
                    직접 검색
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchType("region");
                      setSearchQuery("");
                    }}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all border-0 cursor-pointer ${
                      searchType === "region"
                        ? isPink
                          ? "bg-rose-500 text-white shadow-sm font-extrabold"
                          : "bg-[#ffd500] text-[#0d233a] shadow-sm font-extrabold"
                        : isPink ? "text-neutral-400 hover:text-white" : "text-[#735965] hover:text-[#bf3e67]"
                    }`}
                  >
                    지역 검색
                  </button>
                </div>

                {/* Input / Filters depending on searchType */}
                {searchType === "direct" ? (
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="매장명 또는 주소를 입력하세요"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`w-full border rounded-xl pl-3 pr-10 py-2 text-xs transition-colors ${
                        isPink
                          ? "bg-neutral-950 border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-rose-500"
                          : "bg-white border-[#e6dfc3] text-[#0d233a] placeholder-[#735965]/40 font-semibold focus:outline-none focus:border-[#ffd500]"
                      }`}
                    />
                    <Search size={14} className={`absolute right-3 top-2.5 ${isPink ? "text-neutral-500" : "text-[#735965]/50"}`} />
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-1">
                    {regions.map(region => {
                      const isActive = selectedRegion === region;
                      return (
                        <button
                          key={region}
                          type="button"
                          onClick={() => setSelectedRegion(region)}
                          className={`px-2 py-1.5 rounded-lg text-[9px] font-extrabold transition-all border cursor-pointer ${
                            isActive
                              ? isPink
                                ? "bg-rose-500 border-rose-500 text-white"
                                : "bg-[#ffd500] border-[#ffd500] text-[#0d233a]"
                              : isPink
                                ? "bg-neutral-950 border-neutral-850 text-neutral-400 hover:bg-neutral-800"
                                : "bg-white border-[#e6dfc3] text-[#735965] hover:bg-[#fff9e6]"
                          }`}
                        >
                          {region} ({getRegionCount(region)})
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* 현 위치로 매장 검색하기 Button */}
                <button
                  type="button"
                  onClick={handleCurrentLocationSearch}
                  className={`w-full py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 border-0 cursor-pointer ${
                    isPink
                      ? "bg-rose-500/10 text-rose-500 hover:bg-rose-500/20"
                      : "bg-[#ffd500]/10 text-[#0d233a] hover:bg-[#ffd500]/20"
                  }`}
                >
                  <MapPin size={12} /> 현 위치로 매장 검색하기
                </button>
              </div>

              {/* B. Scrollable Store Cards List */}
              <div className={`flex-1 overflow-y-auto divide-y transition-colors ${
                isPink ? "divide-neutral-850 bg-neutral-950" : "divide-[#e6dfc3]/40 bg-[#fffdfa]/50"
              }`}>
                {finalFilteredStores.length === 0 ? (
                  <div className={`py-12 text-center text-xs font-bold ${isPink ? "text-neutral-500" : "text-[#735965]"}`}>
                    검색 조건에 맞는 매장이 없습니다.
                  </div>
                ) : (
                  finalFilteredStores.map(store => {
                    const isSelected = activeStore && activeStore.id === store.id;
                    return (
                      <div
                        key={store.id}
                        onClick={() => setSelectedStoreId(store.id)}
                        className={`p-4 text-left cursor-pointer transition-all border-l-4 ${
                          isSelected
                            ? isPink
                              ? "border-rose-500 bg-rose-500/5"
                              : "border-[#ffd500] bg-[#fff9e6]"
                            : isPink
                              ? "border-transparent hover:bg-neutral-900/60"
                              : "border-transparent hover:bg-[#fffdf4]"
                        }`}
                      >
                        <div className="flex flex-col gap-1">
                          <span className={`text-[8px] font-black tracking-widest uppercase font-mono ${
                            isPink ? "text-rose-500/80" : "text-amber-600/80"
                          }`}>
                            120pie & coffee
                          </span>
                          <h3 className={`font-black text-xs sm:text-sm ${isPink ? "text-white" : "text-[#0d233a]"}`}>
                            {store.name}
                          </h3>
                          <p className={`text-[11px] leading-relaxed font-semibold ${isPink ? "text-neutral-400" : "text-[#576575]"}`}>
                            {store.roadAddress} {store.detailAddress}
                          </p>
                          {store.phone && (
                            <p className={`text-[10px] font-bold flex items-center gap-1 mt-0.5 ${isPink ? "text-rose-400" : "text-[#bf3e67]"}`}>
                              연락처: {formatPhoneNumber(store.phone)}
                            </p>
                          )}
                          
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {store.adoptionMenu && store.adoptionMenu.map(menu => {
                              const config = MENU_MAP[menu] || { label: menu, colorClass: isPink ? "bg-neutral-850 text-neutral-500" : "bg-neutral-100 text-neutral-600" };
                              return (
                                <span key={menu} className={`px-1.5 py-0.5 rounded text-[8px] font-black ${config.colorClass}`}>
                                  {config.label}
                                </span>
                              );
                            })}
                          </div>

                          {/* Expand to show Naver/Kakao map buttons if selected */}
                          {isSelected && (
                            <div className={`flex gap-2 mt-3 pt-3 border-t ${isPink ? "border-neutral-800" : "border-[#e6dfc3]/40"}`}>
                              <a
                                href={naverMapUrl(store.roadAddress)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 py-1.5 rounded-lg bg-[#03C75A] text-white text-[10px] font-black text-center hover:bg-[#02b350] transition-colors decoration-none"
                              >
                                네이버 지도 ↗
                              </a>
                              <a
                                href={kakaoMapUrl(store.roadAddress)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 py-1.5 rounded-lg bg-[#FEE500] text-[#191919] text-[10px] font-black text-center hover:bg-[#ebd300] transition-colors decoration-none"
                              >
                                카카오맵 ↗
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}

                {/* Embedded Footer inside Left-side scroll list so it is scrollable and accessible */}
                <div className="p-4 bg-neutral-900/5 transition-colors">
                  <p className="text-[10px] text-neutral-400 font-medium text-center leading-relaxed">
                    선택한 가맹점의 공식 도로명 주소 기준으로 위치 조회를 시작합니다.<br />
                    (주소 매칭의 무결성을 위해 가맹점명은 검색어에 가미하지 않습니다.)
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side: Map Area (Explicitly positioned relative wrapper with full dimensions) */}
            <div className="flex-1 relative h-[55%] lg:h-full w-full bg-neutral-100 z-10">
              <NaverMap
                stores={finalFilteredStores}
                activeStoreId={activeStore ? activeStore.id : ""}
                onSelectStore={setSelectedStoreId}
                isPink={isPink}
              />
            </div>
          </div>
        </div>

        <FloatingAndInquiry
          forceOpenModal={inquiryForcedOpen}
          onModalClose={() => setInquiryForcedOpen(false)}
          isPink={isPink}
        />
      </main>
      <Footer theme={isPink ? "black" : "yellow"} />
    </div>
  );
}
