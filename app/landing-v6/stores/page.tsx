"use client";

import { useState, useEffect, useRef } from "react";
import { Search, MapPin, Store, Phone, Calendar } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Header from "../../../components/landing-v6/Header";
import Footer from "../../../components/landing-v6/Footer";
import ContactForm from "../../../components/landing-v6/ContactForm";

interface StoreInfo {
  id: string;
  name: string;
  owner: string;
  phone: string;
  status: string;
  roadAddress: string;
  detailAddress: string;
  regDate: string;
  adoptionMenu: string[];
}

const DEFAULT_STORES: StoreInfo[] = [
  {
    id: "default-1",
    name: "120겹파이 금정점",
    owner: "김점주",
    phone: "010-1234-5678",
    status: "승인",
    roadAddress: "부산 금정구 금강로 271. 1층",
    detailAddress: "",
    regDate: "2026-06-01",
    adoptionMenu: ["120pie", "egg120", "120coffee"]
  },
  {
    id: "default-2",
    name: "120겹파이 시청점",
    owner: "이점주",
    phone: "010-9876-5432",
    status: "승인",
    roadAddress: "서울 중구 세종대로 110",
    detailAddress: "지하 1층",
    regDate: "2026-05-20",
    adoptionMenu: ["120pie", "120coffee"]
  }
];

const cleanStoreName = (name: string) => {
  return name
    .replace(/^120겹파이\s*/, "")
    .replace(/^120겹파이/, "")
    .replace(/^120pie\s*/, "")
    .replace(/^120pie/, "")
    .trim();
};

export default function StoresSubpage() {
  const convexStores = useQuery(api.stores.get);
  const [stores, setStores] = useState<StoreInfo[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStore, setSelectedStore] = useState<StoreInfo | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [submoduleReady, setSubmoduleReady] = useState(false);
  const [resolvedCoords, setResolvedCoords] = useState<{ [id: string]: { lat: number; lng: number } }>({});

  const openContactModal = () => setIsContactModalOpen(true);
  const closeContactModal = () => setIsContactModalOpen(false);

  // Sync convex data
  useEffect(() => {
    if (convexStores) {
      const mapped: StoreInfo[] = (convexStores as any[]).map((s: any) => ({
        id: s.id,
        name: s.name,
        owner: s.owner,
        phone: s.phone,
        status: s.status,
        roadAddress: s.roadAddress,
        detailAddress: s.detailAddress || "",
        regDate: s.regDate || "",
        adoptionMenu: s.adoptionMenu || []
      }));
      setStores(mapped);
    }
  }, [convexStores]);

  // Load Naver Map Script dynamically
  useEffect(() => {
    if (typeof window === "undefined") return;
    const clientId = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID || "";
    const storedKey = localStorage.getItem("120_naver_client_id") || "";
    const activeKey = storedKey.trim() || clientId.trim() || "dfarfqx7e"; // fallback default key

    const scriptId = "naver-map-script";
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    const handleScriptLoad = () => {
      setScriptLoaded(true);
    };

    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${activeKey}&submodules=geocoder`;
      script.async = true;
      script.onload = handleScriptLoad;
      document.head.appendChild(script);
    } else {
      if (window.naver && window.naver.maps) {
        setScriptLoaded(true);
        if (window.naver.maps.Service) {
          setSubmoduleReady(true);
        }
      } else {
        script.addEventListener("load", handleScriptLoad);
      }
    }

    return () => {
      if (script) {
        script.removeEventListener("load", handleScriptLoad);
      }
    };
  }, [scriptLoaded]);

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

  const approvedStores = stores.filter(s => s.status === "승인" || s.status === "완료");

  const filteredStores = approvedStores.filter(
    (s) =>
      s.name.includes(searchQuery) ||
      s.roadAddress.includes(searchQuery) ||
      (s.detailAddress && s.detailAddress.includes(searchQuery))
  );

  // Geocoding addresses to coords
  useEffect(() => {
    if (!scriptLoaded || !submoduleReady || !window.naver || !window.naver.maps || !window.naver.maps.Service || filteredStores.length === 0) return;

    const naver = window.naver;
    const newCoords: { [id: string]: { lat: number; lng: number } } = {};
    let pendingCount = filteredStores.length;

    filteredStores.forEach((store) => {
      const cleanAddr = store.roadAddress.split("(")[0].trim();
      naver.maps.Service.geocode(
        { query: cleanAddr },
        (status: any, response: any) => {
          if (status === naver.maps.Service.Status.OK && response.v2.addresses[0]) {
            const item = response.v2.addresses[0];
            newCoords[store.id] = { lat: parseFloat(item.y), lng: parseFloat(item.x) };
          }
          pendingCount--;
          if (pendingCount === 0) {
            setResolvedCoords(newCoords);
          }
        }
      );
    });
  }, [scriptLoaded, submoduleReady, stores, searchQuery]);

  // Render/Update Naver Map and custom markers
  useEffect(() => {
    if (Object.keys(resolvedCoords).length === 0 || !mapContainer.current || !window.naver || !window.naver.maps) return;

    const naver = window.naver;

    if (mapRef.current) {
      markersRef.current.forEach((m: any) => m.setMap(null));
      markersRef.current = [];
      mapRef.current = null;
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

    const map = new naver.maps.Map(mapContainer.current, mapOptions);
    mapRef.current = map;

    const markers: any[] = [];
    const bounds = new naver.maps.LatLngBounds();

    filteredStores.forEach((store) => {
      const coord = resolvedCoords[store.id];
      if (!coord) return;

      const latlng = new naver.maps.LatLng(coord.lat, coord.lng);
      bounds.extend(latlng);

      // 위치 아이콘 (커스텀 원형 마커)
      const markerIcon = {
        content: `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
            <div style="
              background: #FBC400; 
              border: 2px solid #0D233A; 
              border-radius: 50%; 
              width: 48px; 
              height: 48px; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              box-shadow: 0 4px 12px rgba(0,0,0,0.3);
              overflow: hidden;
              padding: 2px;
            ">
              <img src="https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784730823/120%ED%8C%8C%EC%9D%B4_%EC%BB%A4%ED%94%BC_%EA%B8%88%EC%A0%95%EC%A0%90_%EC%B1%84%EB%84%90%EC%82%AC%EC%9D%B8_%EB%94%94%EC%9E%90%EC%9D%B8_250828_5_eadptv.png" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;" />
            </div>
            <div style="
              width: 0; 
              height: 0; 
              border-left: 6px solid transparent; 
              border-right: 6px solid transparent; 
              border-top: 8px solid #0D233A;
              margin-top: -1px;
            "></div>
          </div>
        `,
        size: new naver.maps.Size(48, 55),
        anchor: new naver.maps.Point(24, 55),
      };

      const marker = new naver.maps.Marker({
        position: latlng,
        map: map,
        icon: markerIcon,
      });

      naver.maps.Event.addListener(marker, "click", () => {
        setSelectedStore(store);
      });

      markers.push(marker);
    });

    markersRef.current = markers;

    if (filteredStores.length > 1) {
      map.fitBounds(bounds);
    } else {
      map.setCenter(initialCenter);
      map.setZoom(14);
    }
  }, [resolvedCoords]);

  const focusStore = (store: StoreInfo) => {
    setSelectedStore(store);
    const coord = resolvedCoords[store.id];
    if (!coord || !mapRef.current || !window.naver || !window.naver.maps) return;

    const naver = window.naver;
    const targetLatLng = new naver.maps.LatLng(coord.lat, coord.lng);
    mapRef.current.morph(targetLatLng, 15);
  };

  return (
    <div className="min-h-screen bg-[#FFFDF4] dark:bg-[#0A0A0A] text-[#0D233A] dark:text-neutral-200 transition-colors duration-300 font-sans antialiased">
      <Header onContactClick={openContactModal} />

      {/* Hero Section */}
      <section className="pt-32 pb-12 bg-[#FFF5D1] dark:bg-[#15130F] text-center transition-colors">
        <div className="max-w-4xl mx-auto px-4">
          <span className="text-xs sm:text-sm font-extrabold text-amber-500 uppercase tracking-widest block mb-3">
            Find stores
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-neutral-900 dark:text-amber-50 tracking-tight leading-none mb-4">
            가맹점 현황
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 font-medium leading-relaxed max-w-xl mx-auto">
            120pie의 바삭한 매력을 전국 가맹점에서 지금 바로 경험해보세요.
          </p>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left panel: Search & List */}
          <div className="lg:col-span-4 space-y-6 flex flex-col h-[650px]">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="지점명 또는 주소 검색"
                className="w-full bg-white dark:bg-neutral-900 border border-[#e6dfc3] dark:border-neutral-850 focus:border-amber-500 focus:outline-none rounded-2xl pl-10 pr-4 py-3 text-sm transition-all"
              />
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-400" />
            </div>

            {/* List Container */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-amber-500/20">
              {filteredStores.length > 0 ? (
                filteredStores.map((store) => (
                  <div
                    key={store.id}
                    onClick={() => focusStore(store)}
                    className={`p-5 rounded-2xl border transition-all duration-300 text-left cursor-pointer ${
                      selectedStore?.id === store.id
                        ? "bg-amber-400/5 border-amber-400 shadow-sm"
                        : "bg-white dark:bg-neutral-900 border-neutral-250/30 dark:border-neutral-900 hover:border-amber-500/40"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-base font-black text-neutral-900 dark:text-white flex items-center gap-1.5">
                        <Store className="w-4 h-4 text-amber-500" />
                        {cleanStoreName(store.name)}
                      </h3>
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 px-2 py-0.5 rounded font-bold">
                        영업중
                      </span>
                    </div>
                    
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium mb-3.5 flex items-start gap-1.5 break-all">
                      <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                      {store.roadAddress} {store.detailAddress}
                    </p>

                    <div className="pt-3 border-t border-neutral-100 dark:border-neutral-850 flex flex-wrap gap-1">
                      {store.adoptionMenu.map((menu) => (
                        <span key={menu} className="text-[9px] font-bold text-neutral-450 dark:text-neutral-500 bg-neutral-100 dark:bg-neutral-950 px-1.5 py-0.5 rounded">
                          #{menu}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-24 text-neutral-400 text-sm">
                  검색된 가맹점이 존재하지 않습니다.
                </div>
              )}
            </div>
          </div>

          {/* Right panel: Map */}
          <div className="lg:col-span-8 bg-white dark:bg-neutral-900 rounded-[2.5rem] border border-[#e6dfc3]/40 dark:border-neutral-900/60 p-4 shadow-[0_4px_25px_rgba(0,0,0,0.03)] h-[650px] relative">
            <div
              ref={mapContainer}
              className="w-full h-full rounded-[2rem] overflow-hidden"
              style={{ minHeight: "350px" }}
            />
            
            {/* Selected Store Detail Float Card */}
            {selectedStore && (
              <div className="absolute bottom-8 left-8 right-8 md:left-auto md:right-8 md:w-96 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-5 shadow-2xl z-20 text-left animate-slide-up">
                <h4 className="text-lg font-black text-neutral-900 dark:text-white mb-1">
                  {selectedStore.name}
                </h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  {selectedStore.roadAddress} {selectedStore.detailAddress}
                </p>
                <div className="space-y-2 text-xs font-semibold text-neutral-600 dark:text-neutral-355">
                  <p className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-neutral-400" />
                    연락처: {selectedStore.phone}
                  </p>
                  <p className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                    오픈일자: {selectedStore.regDate}
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>
      </section>

      <Footer />
      <ContactForm isModal isOpen={isContactModalOpen} onClose={closeContactModal} />
    </div>
  );
}
