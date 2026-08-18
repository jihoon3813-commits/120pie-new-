"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Store,
  CreditCard,
  Megaphone,
  BarChart3,
  BookOpen,
  Settings,
  LogOut,
  Menu,
  X,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  Truck,
  Download,
  FileText,
  ChevronRight,
  TrendingUp,
  Package,
  DollarSign,
  User,
  Building2,
  Calendar,
  Eye,
  Printer,
  Sparkles,
  Phone,
  MapPin,
  HelpCircle,
  ExternalLink,
  ChevronDown,
  RefreshCw,
  Award,
  Wallet,
  ShieldCheck,
  Check,
  Crosshair
} from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import Footer from "@/app/components/Footer";
import RadarMap from "@/app/components/RadarMap";

const STATUS_BADGES: { [key: string]: { bg: string; text: string; border: string } } = {
  "정산대기": { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-200" },
  "정산확정": { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200" },
  "지급완료": { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200" },
  "승인": { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200" },
  "대기": { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-200" },
  "보류": { bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-200" },
  "중지": { bg: "bg-slate-100", text: "text-slate-500", border: "border-slate-200" },
  "활동중": { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200" },
  "정지": { bg: "bg-slate-100", text: "text-slate-500", border: "border-slate-200" },
  "결제완료": { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200" },
  "배송중": { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200" },
  "배송완료": { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200" },
  "주문완료": { bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-200" },
  "입금대기": { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-200" },
  "주문취소": { bg: "bg-slate-100", text: "text-slate-400", border: "border-slate-200" },
};

export default function PartnerPortalPage() {
  // 1. 세션 및 인증 상태
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [partnerId, setPartnerId] = useState<string>("");
  const [loginInputId, setLoginInputId] = useState<string>("");
  const [loginInputPw, setLoginInputPw] = useState<string>("");
  const [loginError, setLoginError] = useState<string>("");
  const [isInitializing, setIsInitializing] = useState<boolean>(true);

  // 2. 네비게이션 상태
  const [currentMenu, setCurrentMenu] = useState<string>("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // 3. 토스트 알림
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // 4. Convex Queries & Mutations
  const partners = useQuery(api.partners.get) || [];
  const currentPartner = useQuery(
    api.partners.getById,
    partnerId ? { id: partnerId } : "skip"
  );
  const myStores = useQuery(
    api.partners.getPartnerStores,
    partnerId ? { partnerId } : "skip"
  ) || [];
  const myOrders = useQuery(
    api.partners.getPartnerOrders,
    partnerId ? { partnerId } : "skip"
  ) || [];
  const monthlyStats = useQuery(
    api.partners.getPartnerStats,
    partnerId ? { partnerId } : "skip"
  ) || [];
  const settlements = useQuery(
    api.partners.getSettlements,
    partnerId ? { partnerId } : "skip"
  ) || [];
  const notices = useQuery(api.notices.list) || [];
  const materials = useQuery(api.materials.list, {}) || [];

  const updateProfileMutation = useMutation(api.partners.updatePartnerProfile);
  const seedPartnersMutation = useMutation(api.partners.seedPartners);

  // 5. 초기 로그인 세션 복구 및 URL 파라미터 자동 로그인 검사
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const targetPartnerId = urlParams.get("partnerId") || urlParams.get("partner_id") || urlParams.get("id");

      if (targetPartnerId) {
        localStorage.setItem("120_partner_logged_in", "true");
        localStorage.setItem("120_partner_id", targetPartnerId);
        setIsLoggedIn(true);
        setPartnerId(targetPartnerId);
        setIsInitializing(false);
        return;
      }
    }

    const savedLoggedIn = localStorage.getItem("120_partner_logged_in");
    const savedPartnerId = localStorage.getItem("120_partner_id");

    if (savedLoggedIn === "true" && savedPartnerId) {
      setIsLoggedIn(true);
      setPartnerId(savedPartnerId);
    }
    setIsInitializing(false);

    seedPartnersMutation().catch(() => {});
  }, []);

  // 로그인 핸들러
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    const found = partners.find(
      (p: any) => p.id === loginInputId && p.pw === loginInputPw
    );

    if (found) {
      if (found.status === "정지") {
        setLoginError("활동이 정지된 파트너 계정입니다. 본사에 문의해주세요.");
        return;
      }
      localStorage.setItem("120_partner_logged_in", "true");
      localStorage.setItem("120_partner_id", found.id);
      setIsLoggedIn(true);
      setPartnerId(found.id);
      triggerToast(`${found.name} 파트너님, 환영합니다!`);
    } else {
      setLoginError("아이디 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  // 로그아웃 핸들러
  const handleLogout = () => {
    localStorage.removeItem("120_partner_logged_in");
    localStorage.removeItem("120_partner_id");
    setIsLoggedIn(false);
    setPartnerId("");
    triggerToast("파트너 세션이 안전하게 종료되었습니다.");
  };

  // ==========================================
  // 모달 및 서브 상태들
  // ==========================================
  const [selectedStoreForOrders, setSelectedStoreForOrders] = useState<any | null>(null);
  const [selectedSettlement, setSelectedSettlement] = useState<any | null>(null);
  const [selectedNotice, setSelectedNotice] = useState<any | null>(null);

  const [storeSearchQuery, setStoreSearchQuery] = useState<string>("");
  const [storeStatusFilter, setStoreStatusFilter] = useState<string>("전체");
  const [settlementYearMonth, setSettlementYearMonth] = useState<string>("전체");

  const [settingPhone, setSettingPhone] = useState<string>("");
  const [settingEmail, setSettingEmail] = useState<string>("");
  const [settingBankName, setSettingBankName] = useState<string>("");
  const [settingAccountNumber, setSettingAccountNumber] = useState<string>("");
  const [settingAccountHolder, setSettingAccountHolder] = useState<string>("");
  const [settingNewPw, setSettingNewPw] = useState<string>("");
  const [settingNewPwConfirm, setSettingNewPwConfirm] = useState<string>("");

  useEffect(() => {
    if (currentPartner) {
      setSettingPhone(currentPartner.phone || "");
      setSettingEmail(currentPartner.email || "");
      setSettingBankName(currentPartner.bankName || "");
      setSettingAccountNumber(currentPartner.accountNumber || "");
      setSettingAccountHolder(currentPartner.accountHolder || "");
    }
  }, [currentPartner]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (settingNewPw && settingNewPw !== settingNewPwConfirm) {
      alert("새 비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    try {
      await updateProfileMutation({
        id: partnerId,
        pw: settingNewPw ? settingNewPw : undefined,
        phone: settingPhone,
        email: settingEmail,
        bankName: settingBankName,
        accountNumber: settingAccountNumber,
        accountHolder: settingAccountHolder,
      });
      triggerToast("파트너 정보 및 정산 계좌가 성공적으로 수정되었습니다.");
      setSettingNewPw("");
      setSettingNewPwConfirm("");
    } catch (err) {
      alert("정보 수정 중 오류가 발생했습니다.");
    }
  };

  // ==========================================
  // 계산된 지표 (KPIs)
  // ==========================================
  const now = new Date();
  const currentYearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const currentMonthOrders = useMemo(() => {
    return myOrders.filter((o: any) => o.date && o.date.startsWith(currentYearMonth));
  }, [myOrders, currentYearMonth]);

  const currentMonthDoughBoxes = useMemo(() => {
    return currentMonthOrders.reduce((sum: number, o: any) => sum + (o.pastryDoughBoxes || 0), 0);
  }, [currentMonthOrders]);

  const commissionPerBox = currentPartner?.commissionPerBox || 8000;
  const currentMonthEstimatedCommission = currentMonthDoughBoxes * commissionPerBox;

  const totalDoughBoxes = useMemo(() => {
    return myOrders.reduce((sum: number, o: any) => sum + (o.pastryDoughBoxes || 0), 0);
  }, [myOrders]);

  const totalCumulativeCommission = totalDoughBoxes * commissionPerBox;

  const filteredStores = useMemo(() => {
    return myStores.filter((s: any) => {
      const matchQuery =
        s.name.toLowerCase().includes(storeSearchQuery.toLowerCase()) ||
        s.owner.toLowerCase().includes(storeSearchQuery.toLowerCase()) ||
        s.phone.includes(storeSearchQuery) ||
        s.roadAddress.toLowerCase().includes(storeSearchQuery.toLowerCase());
      const matchStatus = storeStatusFilter === "전체" || s.status === storeStatusFilter;
      return matchQuery && matchStatus;
    });
  }, [myStores, storeSearchQuery, storeStatusFilter]);

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-[#F4F6F8] flex items-center justify-center text-[#0F172A]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-3 border-[#FED422] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-black tracking-widest text-slate-500">파트너 포털 인증 확인 중...</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // 1. 로그인 뷰 (비로그인 상태 - 본사 어드민 스타일)
  // ==========================================
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen w-screen bg-[#0B0F17] text-white flex flex-col font-sans select-none antialiased justify-center items-center p-4 relative overflow-hidden">
        {/* Soft Warm Ambient Yellow Glow */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(circle at 50% 30%, rgba(254, 212, 34, 0.12) 0%, rgba(11, 15, 23, 0) 70%)"
          }}
        />

        {toastMsg && (
          <div className="fixed bottom-6 right-6 z-[150] bg-[#FED422] text-[#0F172A] px-5 py-3.5 rounded-lg font-black text-sm shadow-[0_8px_30px_rgba(254,212,34,0.3)] flex items-center gap-2.5 animate-bounce">
            <CheckCircle2 size={18} className="text-[#0F172A]" />
            {toastMsg}
          </div>
        )}

        <div className="max-w-md w-full bg-slate-900/80 backdrop-blur-xl border border-slate-700/60 rounded-xl p-8 sm:p-10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] space-y-7 relative overflow-hidden text-left z-10">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FED422] to-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/20 text-[#0F172A]">
                <Building2 size={22} className="text-[#0F172A]" />
              </div>
              <div>
                <span className="text-[10px] font-black tracking-widest text-[#FED422] uppercase px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">
                  PARTNER ADMIN
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
                  120겹파이 파트너 포털
                </h2>
              </div>
            </div>
            <p className="text-xs text-slate-400 font-bold leading-relaxed">
              가맹점 유치 현황 및 수수료 정산 관리 시스템에 오신 것을 환영합니다.
            </p>
          </div>

          {loginError && (
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-lg flex items-center gap-2.5 text-xs font-bold text-rose-400">
              <AlertCircle size={16} className="shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-300 block">
                파트너 아이디
              </label>
              <input
                type="text"
                value={loginInputId}
                onChange={(e) => setLoginInputId(e.target.value)}
                placeholder="아이디를 입력해 주세요 (예: partner1)"
                required
                className="w-full bg-[#151B28] border border-slate-700/80 rounded-lg px-4 py-3 text-xs font-bold text-white placeholder-slate-500 focus:outline-none focus:border-[#FED422] transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-300 block">
                비밀번호
              </label>
              <input
                type="password"
                value={loginInputPw}
                onChange={(e) => setLoginInputPw(e.target.value)}
                placeholder="비밀번호를 입력해 주세요"
                required
                className="w-full bg-[#151B28] border border-slate-700/80 rounded-lg px-4 py-3 text-xs font-bold text-white placeholder-slate-500 focus:outline-none focus:border-[#FED422] transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#FED422] hover:bg-amber-400 text-[#0F172A] font-black rounded-lg text-xs transition-all shadow-md shadow-amber-500/20 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 border-0 mt-2"
            >
              <span>파트너 포털 로그인</span>
              <ChevronRight size={16} />
            </button>
          </form>

          <div className="pt-4 border-t border-slate-800 text-center space-y-1.5">
            <p className="text-[11px] text-slate-500">
              파트너 신규 등록 및 계정 발급은 <strong>본사 가맹지원본부</strong>를 통해 진행됩니다.
            </p>
            <div className="text-[11px] text-amber-300/80 font-mono">
              테스트 계정: partner1 / partner1234
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // 2. 파트너 포털 메인 뷰 (본사 어드민과 동일한 밝고 정돈된 라이트 테마)
  // ==========================================
  const menuItems = [
    { key: "dashboard", label: "대시보드", icon: LayoutDashboard },
    { key: "stores", label: "가맹점 관리", icon: Store, badge: myStores.length },
    { key: "radar", label: "상권보호 레이더", icon: Crosshair },
    { key: "settlement", label: "정산 관리", icon: CreditCard },
    { key: "notice", label: "공지사항", icon: Megaphone, badge: notices.length },
    { key: "analytics", label: "통계", icon: BarChart3 },
    { key: "materials", label: "교육/홍보물", icon: BookOpen, badge: materials.length },
    { key: "settings", label: "설정", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F4F6F8] text-[#0F172A] flex flex-col font-sans select-none antialiased">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-[150] bg-[#FED422] text-[#0F172A] px-5 py-3.5 rounded-lg font-black text-sm shadow-[0_8px_30px_rgba(254,212,34,0.3)] flex items-center gap-2.5 animate-bounce">
          <CheckCircle2 size={18} className="text-[#0F172A]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* TOP GLOBAL HEADER (본사 어드민과 동일한 화이트 헤더) */}
      <header className="h-16 bg-white border-b border-neutral-200/90 px-5 sm:px-8 flex items-center justify-between z-40 sticky top-0 shadow-2xs">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-500 hover:text-[#0F172A] rounded-lg hover:bg-slate-100 border-0 cursor-pointer"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FED422] to-amber-500 flex items-center justify-center text-[#0F172A] shadow-xs">
              <Building2 size={16} />
            </div>
            <div>
              <h1 className="font-black text-sm sm:text-base text-[#0F172A] tracking-tight flex items-center gap-2">
                120겹파이 <span className="bg-[#FED422] text-[#0F172A] text-[10px] font-black px-2 py-0.5 rounded-md font-mono">PARTNER</span>
              </h1>
            </div>
          </div>
        </div>

        {/* Header Right Status & Logout */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col text-right">
            <div className="text-xs font-black text-[#0F172A] flex items-center justify-end gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{currentPartner?.name || "영업 파트너"}</span>
              {currentPartner?.companyName && (
                <span className="text-slate-400 font-medium">({currentPartner.companyName})</span>
              )}
            </div>
            <span className="text-[11px] text-amber-600 font-bold font-mono">
              패스트리 생지 8,000원 / 박스
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-xs font-bold transition-all border border-slate-200 hover:border-rose-200 flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">로그아웃</span>
          </button>
        </div>
      </header>

      {/* CORE WORKSPACE (Full Width Flex Container) */}
      <div className="flex-1 flex w-full relative items-stretch min-h-0 overflow-hidden bg-[#F4F6F8]">
        
        {/* SIDEBAR NAVIGATION (본사 어드민과 동일한 다크 사이드바) */}
        <aside className="bg-[#0B0F17] py-5 px-0 flex flex-col justify-between hidden lg:flex shrink-0 w-[240px] shadow-2xl relative z-30 overflow-hidden">
          <div className="space-y-5 overflow-y-auto overflow-x-hidden no-scrollbar relative z-10 w-full">
            
            {/* Header Brand Logo */}
            <div className="flex items-center gap-3 px-5 pt-1">
              <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 shadow-md border border-slate-700 bg-black">
                <img
                  src="https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784730823/120%ED%8C%8C%EC%9D%B4_%EC%BB%A4%ED%94%BC_%EA%B8%88%EC%A0%95%EC%A0%90_%EC%B1%84%EB%84%90%EC%82%AC%EC%9D%B8_%EB%94%94%EC%9E%90%EC%9D%B8_250828_5_eadptv.png"
                  alt="120 Logo Icon"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <h3 className="font-black text-sm text-white tracking-tight truncate">120Partner</h3>
                <p className="text-[10px] text-slate-400 font-bold truncate">영업 파트너 포털</p>
              </div>
            </div>

            {/* Profile Section with Badge */}
            <div className="relative w-full aspect-[4/3] my-1 overflow-hidden bg-[#121824] border-y border-slate-800 flex flex-col justify-center items-center text-center p-4">
              <div className="w-12 h-12 rounded-full bg-[#FED422]/20 border border-[#FED422]/40 flex items-center justify-center text-[#FED422] font-black text-base shadow-lg mb-2">
                {currentPartner?.name ? currentPartner.name.slice(0, 1) : "P"}
              </div>
              <h4 className="font-black text-sm text-white truncate w-full">{currentPartner?.name}</h4>
              <p className="text-[11px] text-slate-400 truncate w-full mt-0.5">{currentPartner?.companyName || "공식 영업 파트너"}</p>
              <span className="mt-2 bg-[#FED422] text-[#0F172A] text-[10px] font-black px-3 py-0.5 rounded-md shadow-xs font-mono">
                #PARTNER-PRO
              </span>
            </div>

            {/* Navigation Menu Links */}
            <nav className="flex flex-col gap-1.5 px-4">
              {menuItems.map(({ key, label, icon: Icon, badge }) => {
                const isActive = currentMenu === key;
                return (
                  <button
                    key={key}
                    onClick={() => setCurrentMenu(key)}
                    className={`w-full px-4 py-3 rounded-lg flex items-center justify-between text-xs font-bold transition-all cursor-pointer border-0 outline-none ${
                      isActive
                        ? "bg-[#FED422] text-[#0F172A] shadow-md font-black"
                        : "text-[#94A3B8] hover:text-white hover:bg-white/5 bg-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={17} className={isActive ? "text-[#0F172A]" : "text-[#94A3B8]"} />
                      <span>{label}</span>
                    </div>
                    {badge !== undefined && badge > 0 && (
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        isActive ? "bg-[#0F172A] text-[#FED422]" : "bg-[#1E293B] text-[#94A3B8]"
                      }`}>
                        {badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="border-t border-slate-800/80 pt-4 px-4 relative z-10">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2.5 rounded-lg flex items-center gap-3 text-xs font-bold text-[#94A3B8] hover:text-white hover:bg-red-500/20 transition-colors text-left cursor-pointer border-0"
            >
              <LogOut size={16} />
              <span>로그아웃</span>
            </button>
          </div>
        </aside>

        {/* MOBILE DRAWER */}
        {mobileMenuOpen && (
          <div 
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs lg:hidden flex" 
            onClick={() => setMobileMenuOpen(false)}
          >
            <div 
              className="w-72 bg-[#0B0F17] text-white h-full p-6 flex flex-col justify-between shadow-2xl border-r border-slate-800 animate-in slide-in-from-left duration-200" 
              onClick={(e) => e.stopPropagation()} 
            >
              <div className="space-y-6 overflow-y-auto no-scrollbar">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <span className="font-black text-sm text-white">파트너 메뉴 바로가기</span>
                  <button onClick={() => setMobileMenuOpen(false)} className="p-1.5 text-slate-400 hover:text-white">
                    <X size={20} />
                  </button>
                </div>

                <nav className="flex flex-col gap-1.5">
                  {menuItems.map(({ key, label, icon: Icon, badge }) => {
                    const isActive = currentMenu === key;
                    return (
                      <button
                        key={key}
                        onClick={() => {
                          setCurrentMenu(key);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full px-4 py-3 rounded-lg flex items-center justify-between text-xs font-bold transition-all border-0 ${
                          isActive
                            ? "bg-[#FED422] text-[#0F172A] shadow-md font-black"
                            : "text-[#94A3B8] hover:bg-white/5"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon size={18} className={isActive ? "text-[#0F172A]" : "text-[#94A3B8]"} />
                          <span>{label}</span>
                        </div>
                        {badge !== undefined && (
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                            isActive ? "bg-[#0F172A] text-[#FED422]" : "bg-[#1E293B] text-[#94A3B8]"
                          }`}>
                            {badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>
          </div>
        )}

        {/* MAIN WORKSPACE CONTENT CANVAS (Full Width Responsive like HQ Admin) */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto w-full max-w-full bg-[#F4F6F8]">
          <div className="space-y-6 w-full max-w-full">

            {/* ==========================================
                1) 대시보드 뷰
            ========================================== */}
            {currentMenu === "dashboard" && (
              <div className="space-y-6">
                {/* 웰컴 화이트 카드 배너 */}
                <div className="bg-white rounded-lg p-6 sm:p-8 border-0 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-700 text-xs font-black">
                      <Sparkles size={14} className="text-amber-500" />
                      <span>영업 파트너 전용 대시보드</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
                      {currentPartner?.name} 파트너님, 환영합니다!
                    </h2>
                    <p className="text-xs text-slate-400 font-bold">
                      유치 가맹점의 실시간 재료 발주 실적과 이번 달 예상 정산 수수료를 한눈에 확인하세요.
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={() => setCurrentMenu("stores")}
                      className="px-4 py-2.5 bg-[#FED422] hover:bg-amber-400 text-[#0F172A] font-black text-xs rounded-lg shadow-sm transition-all flex items-center gap-2 cursor-pointer border-0"
                    >
                      <Store size={15} />
                      <span>유치 가맹점 보기</span>
                    </button>
                    <button
                      onClick={() => setCurrentMenu("settlement")}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg border border-slate-200 transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <CreditCard size={15} />
                      <span>정산 관리</span>
                    </button>
                  </div>
                </div>

                {/* 4대 주요 지표 카드 (본사 어드민 스타일 화이트 카드) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* 카드 1: 당월 예상 수수료 */}
                  <div className="bg-white rounded-lg p-5 border-0 shadow-md space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400">이번 달 예상 수수료</span>
                      <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                        <DollarSign size={18} />
                      </div>
                    </div>
                    <div className="text-2xl font-black text-rose-600 font-mono tracking-tight">
                      {currentMonthEstimatedCommission.toLocaleString()} <span className="text-sm font-bold text-slate-600 font-sans">원</span>
                    </div>
                    <span className="text-[11px] text-amber-600 font-bold">
                      생지 {currentMonthDoughBoxes}박스 × 8,000원
                    </span>
                  </div>

                  {/* 카드 2: 유치 가맹점 수 */}
                  <div className="bg-white rounded-lg p-5 border-0 shadow-md space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400">내가 유치한 가맹점</span>
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                        <Store size={18} />
                      </div>
                    </div>
                    <div className="text-2xl font-black text-[#0F172A] tracking-tight">
                      {myStores.length} <span className="text-sm font-bold text-slate-400 font-sans">개점</span>
                    </div>
                    <span className="text-[11px] text-emerald-600 font-bold">
                      승인 영업점 {myStores.filter((s: any) => s.status === "승인").length}개소
                    </span>
                  </div>

                  {/* 카드 3: 당월 생지 주문 박스 수 */}
                  <div className="bg-white rounded-lg p-5 border-0 shadow-md space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400">당월 패스트리 생지 주문</span>
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                        <Package size={18} />
                      </div>
                    </div>
                    <div className="text-2xl font-black text-[#0F172A] font-mono tracking-tight">
                      {currentMonthDoughBoxes} <span className="text-sm font-bold text-slate-400 font-sans">박스</span>
                    </div>
                    <span className="text-[11px] text-blue-600 font-bold">
                      총 {currentMonthOrders.length}건 발주 발생
                    </span>
                  </div>

                  {/* 카드 4: 누적 수수료 합계 */}
                  <div className="bg-white rounded-lg p-5 border-0 shadow-md space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400">누적 수수료 총액</span>
                      <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                        <TrendingUp size={18} />
                      </div>
                    </div>
                    <div className="text-2xl font-black text-[#0F172A] font-mono tracking-tight">
                      {totalCumulativeCommission.toLocaleString()} <span className="text-sm font-bold text-slate-400 font-sans">원</span>
                    </div>
                    <span className="text-[11px] text-purple-600 font-bold">
                      누적 생지 {totalDoughBoxes}박스 달성
                    </span>
                  </div>
                </div>

                {/* 최근 주문 내역 & 공지사항 2분할 */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* 최근 가맹점 재료 주문 내역 (2칸) */}
                  <div className="lg:col-span-2 bg-white rounded-lg p-6 border-0 shadow-md space-y-4">
                    <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                      <h3 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
                        <Package size={17} className="text-amber-500" />
                        <span>최근 유치 가맹점 재료 발주 내역</span>
                      </h3>
                      <button
                        onClick={() => setCurrentMenu("stores")}
                        className="text-xs text-slate-500 hover:text-[#0F172A] font-bold flex items-center gap-1 cursor-pointer border-0 bg-transparent"
                      >
                        전체 보기 <ChevronRight size={14} />
                      </button>
                    </div>

                    {myOrders.length === 0 ? (
                      <div className="py-12 text-center text-slate-400 text-xs font-bold">
                        유치 가맹점의 재료 주문 내역이 없습니다.
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="bg-[#F8FAFC] border-b border-neutral-200/80 text-slate-500 font-bold">
                              <th className="py-3 px-3">주문일시</th>
                              <th className="py-3 px-3">가맹점명</th>
                              <th className="py-3 px-3">주문 품목</th>
                              <th className="py-3 px-3 text-right">생지 박스수</th>
                              <th className="py-3 px-3 text-right">발생 수수료</th>
                              <th className="py-3 px-3 text-center">상태</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-neutral-100">
                            {myOrders.slice(0, 5).map((ord: any) => (
                              <tr key={ord.id} className="hover:bg-slate-50 transition-colors">
                                <td className="py-3.5 px-3 font-mono text-slate-500">{ord.date}</td>
                                <td className="py-3.5 px-3 font-black text-[#0F172A]">{ord.storeName}</td>
                                <td className="py-3.5 px-3 text-slate-600 max-w-[180px] truncate">
                                  {ord.items && ord.items.length > 0
                                    ? `${ord.items[0].productName} ${ord.items.length > 1 ? `외 ${ord.items.length - 1}건` : ""}`
                                    : "자재 주문"}
                                </td>
                                <td className="py-3.5 px-3 text-right font-black text-amber-600 font-mono">
                                  {ord.pastryDoughBoxes} 박스
                                </td>
                                <td className="py-3.5 px-3 text-right font-black text-rose-600 font-mono">
                                  +{(ord.commission || 0).toLocaleString()}원
                                </td>
                                <td className="py-3.5 px-3 text-center">
                                  <span
                                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${
                                      (STATUS_BADGES[ord.status] || STATUS_BADGES["대기"]).bg
                                    } ${(STATUS_BADGES[ord.status] || STATUS_BADGES["대기"]).text} ${
                                      (STATUS_BADGES[ord.status] || STATUS_BADGES["대기"]).border
                                    }`}
                                  >
                                    {ord.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* 본사 공지사항 (1칸) */}
                  <div className="bg-white rounded-lg p-6 border-0 shadow-md space-y-4">
                    <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                      <h3 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
                        <Megaphone size={17} className="text-amber-500" />
                        <span>본사 공지사항</span>
                      </h3>
                      <button
                        onClick={() => setCurrentMenu("notice")}
                        className="text-xs text-slate-500 hover:text-[#0F172A] font-bold flex items-center gap-1 cursor-pointer border-0 bg-transparent"
                      >
                        전체 보기 <ChevronRight size={14} />
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {notices.slice(0, 4).map((n: any) => (
                        <div
                          key={n.id}
                          onClick={() => setSelectedNotice(n)}
                          className="p-3 rounded-lg bg-[#F8FAFC] hover:bg-slate-100 border border-neutral-200/80 transition-all cursor-pointer space-y-1 group"
                        >
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${
                                n.tag === "필독" ? "bg-rose-50 text-rose-600 border-rose-200" : "bg-slate-200 text-slate-600 border-slate-300"
                              }`}
                            >
                              {n.tag}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">{n.date}</span>
                          </div>
                          <h4 className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-amber-600 transition-colors">
                            {n.title}
                          </h4>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ==========================================
                2) 가맹점 관리 뷰
            ========================================== */}
            {currentMenu === "stores" && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg p-6 border-0 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-black text-[#0F172A] tracking-tight flex items-center gap-2">
                      <Store size={22} className="text-amber-500" />
                      유치 가맹점 관리
                    </h2>
                    <p className="text-xs text-slate-400 font-bold mt-1">
                      {currentPartner?.name} 파트너님이 직접 유치한 가맹점 목록 및 가맹점별 재료 주문 내역을 확인합니다.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={storeSearchQuery}
                        onChange={(e) => setStoreSearchQuery(e.target.value)}
                        placeholder="가맹점명 / 점주명 검색"
                        className="pl-8 pr-3 py-2 bg-[#F1F4F8] border-0 rounded-lg text-xs font-medium text-[#0F172A] focus:bg-white focus:ring-2 focus:ring-amber-500/20 w-44 sm:w-56 outline-none"
                      />
                    </div>
                    <select
                      value={storeStatusFilter}
                      onChange={(e) => setStoreStatusFilter(e.target.value)}
                      className="px-3 py-2 bg-[#F1F4F8] border-0 rounded-lg text-xs font-bold text-[#0F172A] focus:bg-white focus:ring-2 focus:ring-amber-500/20 outline-none cursor-pointer"
                    >
                      <option value="전체">전체 상태</option>
                      <option value="승인">승인 (영업중)</option>
                      <option value="대기">대기</option>
                      <option value="보류">보류</option>
                      <option value="중지">중지</option>
                    </select>
                  </div>
                </div>

                {/* 가맹점 테이블 */}
                <div className="bg-white rounded-lg border-0 shadow-md overflow-hidden">
                  {filteredStores.length === 0 ? (
                    <div className="py-20 text-center text-slate-400 text-xs font-bold">
                      유치한 가맹점 정보가 없습니다. 본사에서 가맹점 파트너 매핑을 확인해 주세요.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="bg-[#F8FAFC] border-b border-neutral-200/80 text-slate-500 font-bold">
                            <th className="py-3.5 px-4">가맹점명 / 주소</th>
                            <th className="py-3.5 px-3">점주명</th>
                            <th className="py-3.5 px-3">연락처</th>
                            <th className="py-3.5 px-3 text-center">가맹상태</th>
                            <th className="py-3.5 px-3">등록일자</th>
                            <th className="py-3.5 px-3 text-right">당월 생지 주문</th>
                            <th className="py-3.5 px-3 text-right">누적 생지 주문</th>
                            <th className="py-3.5 px-4 text-center">재료 주문내역</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                          {filteredStores.map((store: any) => (
                            <tr key={store.id} className="hover:bg-slate-50 transition-colors">
                              <td className="py-4 px-4">
                                <div className="font-black text-[#0F172A] text-sm">{store.name}</div>
                                <div className="text-[11px] text-slate-400 truncate max-w-xs">{store.roadAddress}</div>
                              </td>
                              <td className="py-4 px-3 text-slate-800 font-bold">{store.owner}</td>
                              <td className="py-4 px-3 text-slate-500 font-mono">{store.phone}</td>
                              <td className="py-4 px-3 text-center">
                                <span
                                  className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-extrabold border ${
                                    (STATUS_BADGES[store.status] || STATUS_BADGES["대기"]).bg
                                  } ${(STATUS_BADGES[store.status] || STATUS_BADGES["대기"]).text} ${
                                    (STATUS_BADGES[store.status] || STATUS_BADGES["대기"]).border
                                  }`}
                                >
                                  {store.status}
                                </span>
                              </td>
                              <td className="py-4 px-3 text-slate-400 font-mono">{store.regDate}</td>
                              <td className="py-4 px-3 text-right font-black text-amber-600 font-mono">
                                {store.monthDoughBoxes || 0} 박스
                                <div className="text-[10px] text-slate-400 font-normal">
                                  (+{((store.monthDoughBoxes || 0) * 8000).toLocaleString()}원)
                                </div>
                              </td>
                              <td className="py-4 px-3 text-right font-black text-[#0F172A] font-mono text-sm">
                                {store.totalDoughBoxes || 0} 박스
                              </td>
                              <td className="py-4 px-4 text-center">
                                <button
                                  onClick={() => setSelectedStoreForOrders(store)}
                                  className="px-3 py-1.5 bg-[#FED422] hover:bg-amber-400 text-[#0F172A] rounded-lg text-xs font-black transition-all cursor-pointer border-0 shadow-2xs inline-flex items-center gap-1.5"
                                >
                                  <FileText size={13} />
                                  <span>주문 내역 보기</span>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ==========================================
                2-1) 상권보호 레이더 지도 뷰 (파트너 모드)
            ========================================== */}
            {currentMenu === "radar" && (
              <div className="space-y-6">
                <RadarMap mode="partner" partnerId={partnerId} partnerName={currentPartner?.name} />
              </div>
            )}

            {/* ==========================================
                3) 정산 관리 뷰
            ========================================== */}
            {currentMenu === "settlement" && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg p-6 border-0 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-black text-[#0F172A] tracking-tight flex items-center gap-2">
                      <CreditCard size={22} className="text-amber-500" />
                      월별 수수료 정산 관리
                    </h2>
                    <p className="text-xs text-slate-400 font-bold mt-1">
                      유치 가맹점의 패스트리 생지 발주 실적에 따른 월 단위 수수료 명세서를 확인합니다.
                    </p>
                  </div>

                  <div className="px-4 py-2 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800 font-bold flex items-center gap-2">
                    <Award size={16} className="text-amber-600" />
                    <span>패스트리 생지 1박스 당 8,000원 (VAT포함) 정산</span>
                  </div>
                </div>

                {/* 등록된 정산 계좌 카드 */}
                <div className="bg-white rounded-lg p-5 border-0 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                      <Wallet size={22} />
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 font-bold">수수료 입금 등록 계좌</span>
                      <div className="text-sm font-black text-[#0F172A]">
                        {currentPartner?.bankName || "은행 미등록"}{" "}
                        <span className="font-mono text-amber-600">{currentPartner?.accountNumber || "-"}</span>{" "}
                        (예금주: {currentPartner?.accountHolder || currentPartner?.name || "-"})
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setCurrentMenu("settings")}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 transition-all cursor-pointer self-start md:self-auto"
                  >
                    계좌정보 변경
                  </button>
                </div>

                {/* 월별 정산 내역 테이블 */}
                <div className="bg-white rounded-lg border-0 shadow-md overflow-hidden p-6 space-y-4">
                  <h3 className="text-sm font-black text-[#0F172A]">월별 정산 명세 내역</h3>

                  {settlements.length === 0 ? (
                    <div className="py-16 text-center text-slate-400 text-xs font-bold">
                      정산 내역이 없습니다.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="bg-[#F8FAFC] border-b border-neutral-200/80 text-slate-500 font-bold">
                            <th className="py-3.5 px-3">정산 년월</th>
                            <th className="py-3.5 px-3">유치 가맹점 수</th>
                            <th className="py-3.5 px-3 text-right">생지 주문 박스 수</th>
                            <th className="py-3.5 px-3 text-right">수수료 단가</th>
                            <th className="py-3.5 px-3 text-right">총 정산 수수료</th>
                            <th className="py-3.5 px-3 text-center">정산 상태</th>
                            <th className="py-3.5 px-3 text-center">지급일자</th>
                            <th className="py-3.5 px-4 text-center">명세서</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                          {settlements.map((st: any, idx: number) => (
                            <tr key={idx} className="hover:bg-slate-50 transition-colors">
                              <td className="py-4 px-3 font-mono font-black text-[#0F172A]">{st.yearMonth}</td>
                              <td className="py-4 px-3 font-bold text-slate-700">{st.storeCount} 개점</td>
                              <td className="py-4 px-3 text-right font-black text-amber-600 font-mono">
                                {st.boxCount} 박스
                              </td>
                              <td className="py-4 px-3 text-right text-slate-500 font-mono">
                                {(st.commissionUnit || 8000).toLocaleString()}원
                              </td>
                              <td className="py-4 px-3 text-right font-black text-rose-600 font-mono text-sm">
                                {(st.commissionAmount || 0).toLocaleString()} 원
                              </td>
                              <td className="py-4 px-3 text-center">
                                <span
                                  className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-extrabold border ${
                                    (STATUS_BADGES[st.status] || STATUS_BADGES["대기"]).bg
                                  } ${(STATUS_BADGES[st.status] || STATUS_BADGES["대기"]).text} ${
                                    (STATUS_BADGES[st.status] || STATUS_BADGES["대기"]).border
                                  }`}
                                >
                                  {st.status}
                                </span>
                              </td>
                              <td className="py-4 px-3 text-center text-slate-400 font-mono">
                                {st.paidDate || "-"}
                              </td>
                              <td className="py-4 px-4 text-center">
                                <button
                                  onClick={() => setSelectedSettlement(st)}
                                  className="px-3 py-1 bg-slate-100 hover:bg-[#FED422] text-slate-700 hover:text-[#0F172A] rounded-md text-xs font-black border border-slate-200 transition-all cursor-pointer inline-flex items-center gap-1"
                                >
                                  <FileText size={12} />
                                  <span>명세서 보기</span>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ==========================================
                4) 공지사항 뷰
            ========================================== */}
            {currentMenu === "notice" && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg p-6 border-0 shadow-md">
                  <h2 className="text-xl font-black text-[#0F172A] tracking-tight flex items-center gap-2">
                    <Megaphone size={22} className="text-amber-500" />
                    본사 공지사항
                  </h2>
                  <p className="text-xs text-slate-400 font-bold mt-1">
                    본사의 주요 운영 정책, 신메뉴 출시, 물류 및 가맹 사업 안내 공지를 확인하세요.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-6 border-0 shadow-md space-y-3">
                  {notices.map((n: any) => (
                    <div
                      key={n.id}
                      onClick={() => setSelectedNotice(n)}
                      className="p-4 rounded-lg bg-[#F8FAFC] hover:bg-slate-100 border border-neutral-200/80 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                            n.tag === "필독" ? "bg-rose-50 text-rose-600 border-rose-200" : "bg-slate-200 text-slate-600 border-slate-300"
                          }`}
                        >
                          {n.tag}
                        </span>
                        <h3 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-amber-600 transition-colors">
                          {n.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-4 text-[11px] text-slate-400 font-mono shrink-0">
                        <span>{n.date}</span>
                        <span>조회 {n.views || 0}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ==========================================
                5) 통계 뷰
            ========================================== */}
            {currentMenu === "analytics" && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg p-6 border-0 shadow-md">
                  <h2 className="text-xl font-black text-[#0F172A] tracking-tight flex items-center gap-2">
                    <BarChart3 size={22} className="text-amber-500" />
                    영업 실적 및 수수료 통계
                  </h2>
                  <p className="text-xs text-slate-400 font-bold mt-1">
                    월별 유치 가맹점의 패스트리 생지 주문량 및 수수료 추이를 시각화하여 제공합니다.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-6 sm:p-8 border-0 shadow-md space-y-6">
                  <h3 className="text-sm font-black text-[#0F172A]">최근 6개월 생지 주문량 & 수수료 추이</h3>

                  <div className="grid grid-cols-6 gap-2 sm:gap-4 items-end h-64 pt-8 border-b border-neutral-200 pb-4 bg-[#F8FAFC] rounded-lg p-4">
                    {monthlyStats.map((st: any, idx: number) => {
                      const maxBoxes = Math.max(...monthlyStats.map((s: any) => s.boxCount || 0), 10);
                      const heightPercent = Math.min(100, Math.round(((st.boxCount || 0) / maxBoxes) * 100));

                      return (
                        <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end group">
                          <div className="text-[10px] font-bold text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity">
                            {st.boxCount}박스
                          </div>
                          <div className="w-full max-w-[48px] bg-slate-200 rounded-t-lg relative overflow-hidden flex flex-col justify-end h-full">
                            <div
                              style={{ height: `${Math.max(10, heightPercent)}%` }}
                              className="w-full bg-gradient-to-t from-amber-500 to-[#FED422] rounded-t-lg transition-all duration-500 group-hover:brightness-105 shadow-xs"
                            ></div>
                          </div>
                          <span className="text-[10px] text-slate-500 font-bold font-mono truncate w-full text-center">
                            {st.yearMonth.slice(5)}월
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {monthlyStats.map((st: any, idx: number) => (
                      <div key={idx} className="p-4 rounded-lg bg-[#F8FAFC] border border-neutral-200/80 space-y-1">
                        <div className="text-[11px] font-mono font-bold text-slate-400">{st.yearMonth}</div>
                        <div className="text-sm font-black text-[#0F172A]">{st.boxCount} 박스</div>
                        <div className="text-xs font-black text-rose-600 font-mono">
                          +{st.commission.toLocaleString()}원
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ==========================================
                6) 교육 / 홍보물 뷰
            ========================================== */}
            {currentMenu === "materials" && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg p-6 border-0 shadow-md">
                  <h2 className="text-xl font-black text-[#0F172A] tracking-tight flex items-center gap-2">
                    <BookOpen size={22} className="text-amber-500" />
                    가맹 모집 교육 / 홍보 자료실
                  </h2>
                  <p className="text-xs text-slate-400 font-bold mt-1">
                    신규 가맹점 모집 및 영업 시 활용할 수 있는 브랜드 소개서, 브로셔, 카탈로그, 교육 자료를 다운로드하세요.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {materials.map((m: any) => (
                    <div
                      key={m._id}
                      className="bg-white rounded-lg p-5 border-0 shadow-md hover:shadow-lg transition-all flex flex-col justify-between gap-4 group"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                            {m.type === "training" ? "교육자료" : "홍보자료"}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">{m.format} · {m.size}</span>
                        </div>
                        <h3 className="text-sm font-black text-[#0F172A] line-clamp-1 group-hover:text-amber-600 transition-colors">
                          {m.title}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {m.desc}
                        </p>
                      </div>

                      {m.fileUrl ? (
                        <a
                          href={m.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          download={m.fileName || m.title}
                          className="w-full py-2.5 bg-[#F1F4F8] hover:bg-[#FED422] text-[#0F172A] font-black text-xs rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                        >
                          <Download size={14} />
                          <span>자료 다운로드</span>
                        </a>
                      ) : (
                        <button
                          disabled
                          className="w-full py-2.5 bg-slate-100 text-slate-400 font-bold text-xs rounded-lg flex items-center justify-center gap-2 cursor-not-allowed border-0"
                        >
                          <span>파일 준비중</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ==========================================
                7) 설정 뷰
            ========================================== */}
            {currentMenu === "settings" && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg p-6 border-0 shadow-md">
                  <h2 className="text-xl font-black text-[#0F172A] tracking-tight flex items-center gap-2">
                    <Settings size={22} className="text-amber-500" />
                    파트너 정보 및 정산 계좌 설정
                  </h2>
                  <p className="text-xs text-slate-400 font-bold mt-1">
                    파트너 기본 정보, 수수료를 입금받을 정산 계좌번호 및 접속 비밀번호를 관리합니다.
                  </p>
                </div>

                <form onSubmit={handleSaveSettings} className="bg-white rounded-lg p-6 sm:p-8 border-0 shadow-md space-y-6 max-w-2xl">
                  {/* 계정 기본 정보 */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-black text-[#0F172A] border-b border-neutral-100 pb-2">
                      파트너 기본 계정 정보
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">파트너 아이디</label>
                        <input
                          type="text"
                          value={currentPartner?.id || ""}
                          disabled
                          className="w-full h-10 px-3.5 bg-slate-100 border-0 rounded-lg text-xs font-bold text-slate-500 cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">파트너명 (대표자)</label>
                        <input
                          type="text"
                          value={currentPartner?.name || ""}
                          disabled
                          className="w-full h-10 px-3.5 bg-slate-100 border-0 rounded-lg text-xs font-bold text-slate-500 cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 연락처 */}
                  <div className="space-y-4 pt-2">
                    <h3 className="text-xs font-black text-[#0F172A] border-b border-neutral-100 pb-2">
                      연락처 정보
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">휴대폰 번호</label>
                        <input
                          type="text"
                          value={settingPhone}
                          onChange={(e) => setSettingPhone(e.target.value)}
                          placeholder="010-0000-0000"
                          className="w-full h-10 px-3.5 bg-[#F1F4F8] border-0 rounded-lg text-xs font-bold text-[#0F172A] focus:bg-white focus:ring-2 focus:ring-amber-500/20 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">이메일 주소</label>
                        <input
                          type="email"
                          value={settingEmail}
                          onChange={(e) => setSettingEmail(e.target.value)}
                          placeholder="partner@example.com"
                          className="w-full h-10 px-3.5 bg-[#F1F4F8] border-0 rounded-lg text-xs font-bold text-[#0F172A] focus:bg-white focus:ring-2 focus:ring-amber-500/20 outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 정산 입금 계좌 (핵심!) */}
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                      <h3 className="text-xs font-black text-[#0F172A] flex items-center gap-1.5">
                        <Wallet size={15} className="text-amber-500" />
                        <span>수수료 입금 정산 계좌 정보</span>
                      </h3>
                      <span className="text-[11px] text-amber-600 font-bold">매월 수수료가 이 계좌로 지급됩니다</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">은행명</label>
                        <input
                          type="text"
                          value={settingBankName}
                          onChange={(e) => setSettingBankName(e.target.value)}
                          placeholder="예: 국민은행"
                          className="w-full h-10 px-3.5 bg-[#F1F4F8] border-0 rounded-lg text-xs font-bold text-[#0F172A] focus:bg-white focus:ring-2 focus:ring-amber-500/20 outline-none"
                          required
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 mb-1">계좌번호</label>
                        <input
                          type="text"
                          value={settingAccountNumber}
                          onChange={(e) => setSettingAccountNumber(e.target.value)}
                          placeholder="'-' 포함 계좌번호 입력"
                          className="w-full h-10 px-3.5 bg-[#F1F4F8] border-0 rounded-lg text-xs font-bold text-[#0F172A] focus:bg-white focus:ring-2 focus:ring-amber-500/20 outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">예금주명</label>
                        <input
                          type="text"
                          value={settingAccountHolder}
                          onChange={(e) => setSettingAccountHolder(e.target.value)}
                          placeholder="예금주명"
                          className="w-full h-10 px-3.5 bg-[#F1F4F8] border-0 rounded-lg text-xs font-bold text-[#0F172A] focus:bg-white focus:ring-2 focus:ring-amber-500/20 outline-none"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* 비밀번호 변경 */}
                  <div className="space-y-4 pt-2">
                    <h3 className="text-xs font-black text-[#0F172A] border-b border-neutral-100 pb-2">
                      비밀번호 변경 (선택)
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">새 비밀번호</label>
                        <input
                          type="password"
                          value={settingNewPw}
                          onChange={(e) => setSettingNewPw(e.target.value)}
                          placeholder="변경 시에만 입력"
                          className="w-full h-10 px-3.5 bg-[#F1F4F8] border-0 rounded-lg text-xs font-bold text-[#0F172A] focus:bg-white focus:ring-2 focus:ring-amber-500/20 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">비밀번호 확인</label>
                        <input
                          type="password"
                          value={settingNewPwConfirm}
                          onChange={(e) => setSettingNewPwConfirm(e.target.value)}
                          placeholder="새 비밀번호 다시 입력"
                          className="w-full h-10 px-3.5 bg-[#F1F4F8] border-0 rounded-lg text-xs font-bold text-[#0F172A] focus:bg-white focus:ring-2 focus:ring-amber-500/20 outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-3">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-[#FED422] hover:bg-amber-400 text-[#0F172A] font-black text-xs rounded-lg shadow-sm transition-all cursor-pointer flex items-center gap-2 border-0"
                    >
                      <CheckCircle2 size={16} />
                      <span>설정 내용 저장하기</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

          </div>
        </main>
      </div>

      {/* ==========================================
          MODAL 1: 가맹점별 재료 발주 상세 내역 모달 (본사 어드민 스타일)
      ========================================== */}
      {selectedStoreForOrders && (
        <div 
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSelectedStoreForOrders(null)}
        >
          <div 
            className="w-full max-w-3xl bg-white border border-neutral-200 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 bg-[#FED422] text-[#0F172A] flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2.5">
                <Store size={20} className="text-[#0F172A]" />
                <div>
                  <h3 className="text-base font-black text-[#0F172A]">
                    {selectedStoreForOrders.name} - 재료 발주 내역
                  </h3>
                  <p className="text-xs text-[#0F172A]/80 font-bold">
                    점주: {selectedStoreForOrders.owner} ({selectedStoreForOrders.phone})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStoreForOrders(null)}
                className="w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 text-[#0F172A] transition-all flex items-center justify-center border-0 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#F8FAFC]">
              {(() => {
                const storeSpecificOrders = myOrders.filter(
                  (o: any) => o.storeId === selectedStoreForOrders.id
                );

                if (storeSpecificOrders.length === 0) {
                  return (
                    <div className="py-16 text-center text-slate-400 text-xs font-bold">
                      해당 가맹점의 재료 주문 내역이 없습니다.
                    </div>
                  );
                }

                return (
                  <div className="space-y-3">
                    {storeSpecificOrders.map((ord: any) => (
                      <div
                        key={ord.id}
                        className="p-4 rounded-lg bg-white border border-neutral-200/90 shadow-2xs space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 pb-2.5">
                          <div className="flex items-center gap-2.5">
                            <span className="font-mono text-xs font-black text-[#0F172A]">{ord.id}</span>
                            <span className="text-xs text-slate-400 font-mono">{ord.date}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-extrabold border ${
                                (STATUS_BADGES[ord.status] || STATUS_BADGES["대기"]).bg
                              } ${(STATUS_BADGES[ord.status] || STATUS_BADGES["대기"]).text} ${
                                (STATUS_BADGES[ord.status] || STATUS_BADGES["대기"]).border
                              }`}
                            >
                              {ord.status}
                            </span>
                            <span className="text-xs font-black text-[#0F172A]">
                              주문총액 {(ord.totalPrice || 0).toLocaleString()}원
                            </span>
                          </div>
                        </div>

                        {/* 아이템 목록 */}
                        <div className="space-y-1.5">
                          {ord.items &&
                            ord.items.map((item: any, iIdx: number) => (
                              <div
                                key={iIdx}
                                className="flex items-center justify-between text-xs py-1.5 px-3 rounded bg-[#F8FAFC] border border-neutral-100"
                              >
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-slate-800">{item.productName}</span>
                                  {item.isPastryDough && (
                                    <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-300">
                                      패스트리 생지 수수료 대상 (+8,000원/박스)
                                    </span>
                                  )}
                                </div>
                                <div className="text-slate-500 font-mono font-bold">
                                  {item.quantity}개 / 박스 · {(item.price * item.quantity).toLocaleString()}원
                                </div>
                              </div>
                            ))}
                        </div>

                        {/* 합계 */}
                        <div className="flex items-center justify-between pt-1 text-xs font-bold text-slate-700 bg-amber-50/60 p-2.5 rounded-md border border-amber-100">
                          <span>패스트리 생지 합계: <strong className="text-amber-700 font-mono">{ord.pastryDoughBoxes}박스</strong></span>
                          <span>발생 파트너 수수료: <strong className="text-rose-600 font-mono text-sm">+{((ord.commission || 0)).toLocaleString()}원</strong></span>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-neutral-200 bg-white flex justify-end">
              <button
                onClick={() => setSelectedStoreForOrders(null)}
                className="px-5 py-2 bg-[#0F172A] hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition-all border-0 cursor-pointer shadow-xs"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL 2: 정산 명세서 모달 (인쇄 지원)
      ========================================== */}
      {selectedSettlement && (
        <div 
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSelectedSettlement(null)}
        >
          <div 
            className="w-full max-w-2xl bg-white border border-neutral-200 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600">가맹점 모집 파트너 정산 명세서</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs border-0"
                >
                  <Printer size={14} />
                  <span>인쇄 / PDF 저장</span>
                </button>
                <button
                  onClick={() => setSelectedSettlement(null)}
                  className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg border-0 cursor-pointer bg-transparent"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="p-8 overflow-y-auto space-y-6 text-xs bg-white">
              <div className="text-center border-b-2 border-slate-900 pb-4 space-y-1">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">파트너 수수료 정산 명세서</h1>
                <p className="text-slate-500 font-mono font-bold">대상 년월: {selectedSettlement.yearMonth}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 border border-slate-200 p-4 rounded-xl bg-slate-50">
                <div className="space-y-1">
                  <div><strong>파트너명:</strong> {selectedSettlement.partnerName}</div>
                  <div><strong>소속/상호:</strong> {selectedSettlement.companyName || "-"}</div>
                  <div><strong>연락처:</strong> {selectedSettlement.phone}</div>
                </div>
                <div className="space-y-1">
                  <div><strong>정산 은행:</strong> {selectedSettlement.bankName || "-"}</div>
                  <div><strong>계좌번호:</strong> {selectedSettlement.accountNumber || "-"}</div>
                  <div><strong>예금주명:</strong> {selectedSettlement.accountHolder || selectedSettlement.partnerName}</div>
                </div>
              </div>

              <table className="w-full text-left border-collapse border border-slate-300">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300 font-bold">
                    <th className="p-2.5 border-r border-slate-300">정산 항목</th>
                    <th className="p-2.5 border-r border-slate-300 text-right">수량 (박스)</th>
                    <th className="p-2.5 border-r border-slate-300 text-right">지급 단가</th>
                    <th className="p-2.5 text-right">정산 금액 (VAT포함)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-200">
                    <td className="p-2.5 border-r border-slate-300 font-bold">
                      유치 가맹점 패스트리 생지 주문 수수료
                    </td>
                    <td className="p-2.5 border-r border-slate-300 text-right font-mono font-bold">
                      {selectedSettlement.boxCount} 박스
                    </td>
                    <td className="p-2.5 border-r border-slate-300 text-right font-mono">
                      {(selectedSettlement.commissionUnit || 8000).toLocaleString()}원
                    </td>
                    <td className="p-2.5 text-right font-black font-mono text-sm">
                      {(selectedSettlement.commissionAmount || 0).toLocaleString()}원
                    </td>
                  </tr>
                  <tr className="bg-slate-50 font-bold">
                    <td colSpan={3} className="p-2.5 border-r border-slate-300 text-right">
                      최종 실지급액
                    </td>
                    <td className="p-2.5 text-right font-black text-rose-600 text-base font-mono">
                      {(selectedSettlement.commissionAmount || 0).toLocaleString()}원
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="space-y-1 text-slate-500 text-[11px] leading-relaxed pt-2">
                <p>• 본 정산 명세서는 유치 가맹점의 실시간 자재 발주 시스템 기록을 근거로 작성되었습니다.</p>
                <p>• 정산 상태: <strong>{selectedSettlement.status}</strong> {selectedSettlement.paidDate ? `(지급완료일: ${selectedSettlement.paidDate})` : ""}</p>
                <p>• 문의 사항: 주식회사 120겹파이 가맹지원본부 (1566-3594)</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL 3: 공지사항 상세 모달
      ========================================== */}
      {selectedNotice && (
        <div 
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSelectedNotice(null)}
        >
          <div 
            className="w-full max-w-2xl bg-white border border-neutral-200 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-neutral-200 flex items-center justify-between bg-[#F8FAFC]">
              <div className="space-y-1">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                  {selectedNotice.tag}
                </span>
                <h3 className="text-base font-black text-[#0F172A]">{selectedNotice.title}</h3>
                <span className="text-[10px] text-slate-400 font-mono">{selectedNotice.date}</span>
              </div>
              <button
                onClick={() => setSelectedNotice(null)}
                className="p-2 text-slate-400 hover:text-slate-700 border-0 cursor-pointer bg-transparent"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto text-xs text-slate-700 leading-relaxed whitespace-pre-wrap bg-white">
              {selectedNotice.content}
            </div>

            <div className="p-4 border-t border-neutral-200 bg-white flex justify-end">
              <button
                onClick={() => setSelectedNotice(null)}
                className="px-5 py-2 bg-[#0F172A] hover:bg-slate-800 text-white font-bold text-xs rounded-lg border-0 cursor-pointer shadow-xs"
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
