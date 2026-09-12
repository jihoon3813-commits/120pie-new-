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
  Crosshair,
  MessageSquare,
  Copy,
  Lock,
  Users,
  GitBranch,
  Layers,
  Activity
} from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import Footer from "@/app/components/Footer";
import RadarMap from "@/app/components/RadarMap";
import { getPartnerGradeName, PARTNER_GRADES } from "@/app/constants/partnerGrades";

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

function formatPhoneNumber(val: string): string {
  if (!val) return "";
  const clean = val.replace(/[^0-9]/g, "");
  if (clean.length <= 3) return clean;
  if (clean.startsWith("02")) {
    if (clean.length <= 5) return `${clean.slice(0, 2)}-${clean.slice(2)}`;
    if (clean.length <= 9) return `${clean.slice(0, 2)}-${clean.slice(2, 5)}-${clean.slice(5)}`;
    return `${clean.slice(0, 2)}-${clean.slice(2, 6)}-${clean.slice(6, 10)}`;
  }
  if (clean.length <= 7) return `${clean.slice(0, 3)}-${clean.slice(3)}`;
  if (clean.length <= 10) return `${clean.slice(0, 3)}-${clean.slice(3, 6)}-${clean.slice(6)}`;
  return `${clean.slice(0, 3)}-${clean.slice(3, 7)}-${clean.slice(7, 11)}`;
}

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
  const partnerConsultations = useQuery(
    api.inquiries.listByPartner,
    partnerId ? { partnerId } : "skip"
  ) || [];
  // 상위 파트너 전용: 하위 파트너 조직 및 활동 모니터링 쿼리
  const subPartnerActivities = useQuery(
    api.partners.getSubPartnerActivities,
    partnerId ? { partnerId } : "skip"
  );
  const [subpartnerSubTab, setSubpartnerSubTab] = useState<"overview" | "stores" | "orders" | "inquiries">("overview");
  const [subpartnerSearchQuery, setSubpartnerSearchQuery] = useState<string>("");

  const updateProfileMutation = useMutation(api.partners.updatePartnerProfile);
  const seedPartnersMutation = useMutation(api.partners.seedPartners);
  const updateConsultationStatusMutation = useMutation(api.inquiries.updateStatus);

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

  // 상담문의 관리 상태 및 핸들러
  const [consultationSearch, setConsultationSearch] = useState<string>("");
  const [consultationStatusFilter, setConsultationStatusFilter] = useState<string>("전체");
  const [editingMemoId, setEditingMemoId] = useState<string | null>(null);
  const [editingMemoText, setEditingMemoText] = useState<string>("");

  const filteredConsultations = useMemo(() => {
    return partnerConsultations.filter((inq: any) => {
      const q = consultationSearch.toLowerCase();
      const matchQuery =
        !q ||
        (inq.name && inq.name.toLowerCase().includes(q)) ||
        (inq.phone && inq.phone.includes(q)) ||
        (inq.storeType && inq.storeType.toLowerCase().includes(q)) ||
        (inq.existingStoreName && inq.existingStoreName.toLowerCase().includes(q)) ||
        (inq.message && inq.message.toLowerCase().includes(q));
      const matchStatus =
        consultationStatusFilter === "전체" ||
        (inq.status || "대기") === consultationStatusFilter;
      return matchQuery && matchStatus;
    });
  }, [partnerConsultations, consultationSearch, consultationStatusFilter]);

  const handleCopyBranchLink = () => {
    const url = typeof window !== "undefined" ? `${window.location.origin}/${partnerId}` : `https://120pie.com/${partnerId}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      triggerToast("내 전용 분양 링크가 복사되었습니다!");
    } else {
      triggerToast(url);
    }
  };

  const handleGoToStorePortal = (store: any) => {
    if (!store || !store.id) {
      alert("가맹점 식별 정보(ID)를 찾을 수 없습니다.");
      return;
    }
    if (typeof window !== "undefined") {
      localStorage.setItem("120_owner_logged_in", "true");
      localStorage.setItem("120_active_store_id", store.id);
      const targetPartnerId = partnerId || store.partnerId || "";
      const targetGrade = currentPartner?.grade || 2;
      let url = `/portal?storeId=${encodeURIComponent(store.id)}`;
      if (targetPartnerId) url += `&partnerId=${encodeURIComponent(targetPartnerId)}`;
      if (targetGrade) url += `&partnerGrade=${encodeURIComponent(String(targetGrade))}`;
      window.open(url, "_blank");
      triggerToast(`[${store.name || store.id}] 점주 포털로 바로 이동합니다.`);
    }
  };

  const handleConsultationStatusChange = async (id: any, newStatus: string) => {
    try {
      await updateConsultationStatusMutation({ _id: id, status: newStatus });
      triggerToast(`상담 상태가 '${newStatus}'(으)로 변경되었습니다.`);
    } catch (e) {
      alert("상태 변경 중 오류가 발생했습니다.");
    }
  };

  const handleSaveConsultationMemo = async (id: any) => {
    try {
      await updateConsultationStatusMutation({ _id: id, partnerMemo: editingMemoText });
      setEditingMemoId(null);
      triggerToast("상담 메모가 저장되었습니다.");
    } catch (e) {
      alert("메모 저장 중 오류가 발생했습니다.");
    }
  };

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
            <div className="text-[11px] text-amber-300/80">
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
  const subPartnerCount = subPartnerActivities?.summary?.subPartnerCount || 0;

  const menuItems = [
    { key: "dashboard", label: "대시보드", icon: LayoutDashboard },
    { key: "stores", label: "가맹점 관리", icon: Store, badge: myStores.length },
    { key: "subpartners", label: "하위 파트너 활동", icon: Users, badge: subPartnerCount },
    { key: "consultation", label: "상담문의 관리", icon: MessageSquare, badge: partnerConsultations.length },
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
      <header className="h-16 bg-white border-b border-neutral-200/90 px-4 sm:px-8 flex items-center justify-between z-40 sticky top-0 shadow-2xs">
        {/* 좌측: 타이틀 텍스트 (모바일에서는 동그란 아이콘 숨김) */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:flex w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 items-center justify-center text-white shadow-xs">
            <Building2 size={16} />
          </div>
          <div>
            <h1 className="font-black text-base sm:text-base text-[#0F172A] tracking-tight flex items-center gap-2">
              120겹파이 <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md">PARTNER</span>
            </h1>
          </div>
        </div>

        {/* 우측: 데스크탑 정보 + 데스크탑 전용 로그아웃 + 모바일 더보기(햄버거) 아이콘 */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden sm:flex flex-col text-right">
            <div className="text-xs font-black text-[#0F172A] flex items-center justify-end gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{currentPartner?.name || "영업 파트너"}</span>
              <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-1.5 py-0.2 rounded border border-purple-200">
                Lv.{currentPartner?.level || 1} {currentPartner?.tierName || "총판"}
              </span>
              <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-1.5 py-0.2 rounded">
                {getPartnerGradeName(currentPartner?.grade)}
              </span>
              {currentPartner?.companyName && (
                <span className="text-slate-400 font-medium">({currentPartner.companyName})</span>
              )}
            </div>
            <span className="text-[11px] text-purple-700 font-bold">
              패스트리 생지 {(currentPartner?.commissionPerBox || 8000).toLocaleString()}원 / 박스
            </span>
          </div>

          {/* 데스크탑 로그아웃 버튼 (모바일에서는 더보기 드로어 안으로 이동) */}
          <button
            onClick={handleLogout}
            className="hidden sm:flex px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-xs font-bold transition-all border border-slate-200 hover:border-rose-200 items-center gap-1.5 cursor-pointer"
          >
            <LogOut size={14} />
            <span>로그아웃</span>
          </button>

          {/* 📱 모바일 우측 더보기 아이콘 (햄버거 메뉴) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 hover:text-[#0F172A] rounded-xl hover:bg-slate-100 border border-slate-200/80 bg-slate-50 flex items-center justify-center cursor-pointer transition-colors"
            title="더보기 메뉴 열기"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* CORE WORKSPACE (Full Width Flex Container) */}
      <div className="flex-1 flex w-full relative items-stretch min-h-0 overflow-hidden bg-[#F4F6F8]">
        
        {/* SIDEBAR NAVIGATION (본사 어드민 / 점주 메뉴와 동일한 1:1 정사각형 매장 파사드 배경 적용, 파트너 전용 퍼플/인디고 테마) */}
        <aside className="bg-[#0B0F17] py-5 px-0 flex flex-col justify-between hidden lg:flex shrink-0 w-[260px] shadow-2xl rounded-tr-[40px] relative z-30 overflow-hidden">
          {/* Authentic Bottom Aurora Gradient Panel (파트너 전용 로열 퍼플/인디고 오로라) */}
          <div 
            className="absolute bottom-[-5%] left-[-15%] right-[-15%] h-[260px] pointer-events-none rounded-t-[50%]"
            style={{
              background: 'radial-gradient(circle at 30% 80%, rgba(168, 85, 247, 0.4) 0%, rgba(99, 102, 241, 0.28) 50%, rgba(139, 92, 246, 0.15) 80%, transparent 100%)',
              filter: 'blur(30px)'
            }}
          ></div>

          <div className="space-y-5 overflow-y-auto overflow-x-hidden no-scrollbar relative z-10 w-full">
            
            {/* Header Brand Logo (지정 로고 아이콘 적용 - 클릭 시 대시보드 이동) */}
            <button
              type="button"
              onClick={() => setCurrentMenu("dashboard")}
              className="flex items-center gap-3 px-5 pt-1 w-full text-left bg-transparent border-0 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 shadow-md border border-slate-700 bg-black group-hover:scale-105 transition-transform">
                <img
                  src="https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784730823/120%ED%8C%8C%EC%9D%B4_%EC%BB%A4%ED%94%BC_%EA%B8%88%EC%A0%95%EC%A0%90_%EC%B1%84%EB%84%90%EC%82%AC%EC%9D%B8_%EB%94%94%EC%9E%90%EC%9D%B8_250828_5_eadptv.png"
                  alt="120PIE Partner Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <h3 className="font-black text-sm text-white tracking-tight truncate group-hover:text-purple-300 transition-colors">120PIE Partner</h3>
                <p className="text-[10px] text-purple-300 font-bold truncate">영업 파트너십 포털</p>
              </div>
            </button>

            {/* 1:1 Authentic Square Facade Profile Section (본사/점주 메뉴와 100% 동일한 매장 연출컷 배경 + 파트너 전용 퍼플 테마) */}
            <div className="relative w-full aspect-square my-2 border-0 rounded-none overflow-hidden group bg-[#0B0F17] flex flex-col justify-end">
              {/* 전체 프로필 정사각형 배경 이미지 (어드민 / 점주 메뉴와 동일) */}
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-85 group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                style={{
                  backgroundImage: `url('https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784705760/ChatGPT_Image_2026%EB%85%84_7%EC%9B%94_22%EC%9D%BC_%EC%98%A4%ED%9B%84_04_35_22_2_mpdbps.png')`
                }}
              ></div>
              
              {/* 시네마틱 그라데이션 페이드 오버레이 */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17] via-[#0B0F17]/55 to-[#0B0F17]/10 pointer-events-none"></div>

              {/* 파트너 정보 텍스트 & 퍼플 #PARTNER-ID 뱃지 */}
              <div className="relative z-10 flex flex-col items-center text-center gap-1.5 p-5 pb-6">
                <div className="w-full truncate space-y-0.5 drop-shadow-md">
                  <h4 className="font-black text-lg text-white truncate tracking-tight">
                    {currentPartner?.companyName || (currentPartner?.name ? `${currentPartner.name} 파트너` : "120겹파이 파트너")}
                  </h4>
                  <p className="text-xs text-purple-300 font-bold truncate drop-shadow-xs">
                    {currentPartner?.name ? `${currentPartner.name} 파트너님` : "공식 영업 파트너"}
                  </p>
                </div>

                {/* 계층 레벨 & 단가 등급 뱃지 */}
                <div className="flex items-center gap-1.5 flex-wrap justify-center mt-0.5">
                  <span className="bg-purple-950/80 text-purple-200 border border-purple-500/40 text-[10px] font-black px-2 py-0.5 rounded shadow-xs">
                    Lv.{currentPartner?.level || 1} {currentPartner?.tierName || "총판"}
                  </span>
                  <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded shadow-xs">
                    {getPartnerGradeName(currentPartner?.grade)}
                  </span>
                </div>

                {/* 파트너 ID 뱃지 (점주 #owner, 본사 #HQ-MASTER 와 차별화된 로열 퍼플 뱃지) */}
                <span className="mt-1 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 text-white text-[11px] font-black px-4 py-1 rounded-md shadow-lg tracking-wider font-mono border border-purple-400/40">
                  #{currentPartner?.id || "partner"}
                </span>
              </div>
            </div>

            {/* Navigation Menu Links (파트너 전용 퍼플 테마 액티브 스타일) */}
            <nav className="flex flex-col gap-1.5 px-4">
              {menuItems.map(({ key, label, icon: Icon, badge }) => {
                const isActive = currentMenu === key;
                return (
                  <button
                    key={key}
                    onClick={() => setCurrentMenu(key)}
                    className={`w-full px-4 py-3 rounded-lg flex items-center justify-between text-xs font-bold transition-all cursor-pointer border-0 outline-none ${
                      isActive
                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-950/50 font-black"
                        : "text-[#94A3B8] hover:text-white hover:bg-white/5 bg-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={17} className={isActive ? "text-white" : "text-[#94A3B8]"} />
                      <span>{label}</span>
                    </div>
                    {badge !== undefined && badge > 0 && (
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        isActive ? "bg-white text-purple-700 font-black shadow-xs" : "bg-[#1E293B] text-[#94A3B8]"
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
              className="w-72 bg-[#0B0F17] text-white h-full p-0 flex flex-col justify-between shadow-2xl border-r border-slate-800 animate-in slide-in-from-left duration-200 overflow-hidden relative" 
              onClick={(e) => e.stopPropagation()} 
            >
              {/* Bottom Aurora Gradient Panel */}
              <div 
                className="absolute bottom-[-5%] left-[-15%] right-[-15%] h-[240px] pointer-events-none rounded-t-[50%]"
                style={{
                  background: 'radial-gradient(circle at 30% 80%, rgba(168, 85, 247, 0.35) 0%, rgba(99, 102, 241, 0.25) 50%, transparent 100%)',
                  filter: 'blur(30px)'
                }}
              ></div>

              <div className="space-y-4 overflow-y-auto no-scrollbar relative z-10">
                {/* Mobile Drawer Header with Store Facade */}
                <div className="relative w-full aspect-[16/10] overflow-hidden bg-[#0B0F17] flex flex-col justify-between p-4">
                  <div 
                    className="absolute inset-0 bg-cover bg-center opacity-85 pointer-events-none"
                    style={{
                      backgroundImage: `url('https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784705760/ChatGPT_Image_2026%EB%85%84_7%EC%9B%94_22%EC%9D%BC_%EC%98%A4%ED%9B%84_04_35_22_2_mpdbps.png')`
                    }}
                  ></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17] via-[#0B0F17]/60 to-black/30 pointer-events-none"></div>

                  <div className="relative z-10 flex items-center justify-between">
                    <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[10px] font-black px-2 py-0.5 rounded shadow-xs">
                      PARTNER
                    </span>
                    <button onClick={() => setMobileMenuOpen(false)} className="p-1.5 text-white/80 hover:text-white border-0 bg-black/40 rounded-full cursor-pointer">
                      <X size={16} />
                    </button>
                  </div>

                  <div className="relative z-10 text-center space-y-1">
                    <h4 className="font-black text-base text-white truncate drop-shadow-md">
                      {currentPartner?.companyName || currentPartner?.name || "120겹파이 파트너"}
                    </h4>
                    <p className="text-xs text-purple-300 font-bold truncate drop-shadow-xs">
                      {currentPartner?.name ? `${currentPartner.name} 파트너님` : "공식 영업 파트너"}
                    </p>
                    <div className="flex items-center justify-center gap-1.5 pt-0.5 flex-wrap">
                      <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[10px] font-black px-3 py-0.5 rounded shadow-xs font-mono">
                        #{currentPartner?.id || "partner"}
                      </span>
                      <span className="bg-purple-900/80 text-purple-200 text-[9px] font-bold px-1.5 py-0.5 rounded border border-purple-500/30">
                        Lv.{currentPartner?.level || 1}
                      </span>
                      <span className="bg-amber-400 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded">
                        {getPartnerGradeName(currentPartner?.grade)}
                      </span>
                    </div>
                  </div>
                </div>

                <nav className="flex flex-col gap-1.5 px-4 pb-4">
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
                            ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md font-black"
                            : "text-[#94A3B8] hover:bg-white/5"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon size={18} className={isActive ? "text-white" : "text-[#94A3B8]"} />
                          <span>{label}</span>
                        </div>
                        {badge !== undefined && (
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                            isActive ? "bg-white text-purple-700" : "bg-[#1E293B] text-[#94A3B8]"
                          }`}>
                            {badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* 📱 더보기 메뉴 안의 로그아웃 버튼 */}
              <div className="border-t border-slate-800 pt-4 p-4 relative z-10">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full px-4 py-3 rounded-xl flex items-center gap-3 text-xs font-black text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-500/20 transition-all border border-rose-500/20 cursor-pointer"
                >
                  <LogOut size={16} />
                  <span>로그아웃</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MAIN WORKSPACE CONTENT CANVAS (Full Width Responsive like HQ Admin) */}
        <main className={`flex-1 min-w-0 pb-24 lg:pb-8 overflow-y-auto w-full max-w-full bg-[#F4F6F8] ${currentMenu === "radar" ? "p-1.5 sm:p-6 lg:p-8" : "p-3.5 sm:p-6 lg:p-8"}`}>
          <div className="space-y-4 sm:space-y-6 w-full max-w-full">

            {/* ==========================================
                1) 대시보드 뷰
            ========================================== */}
            {currentMenu === "dashboard" && (
              <div className="space-y-4 sm:space-y-6">
                {/* 웰컴 화이트 카드 배너 (모바일 최적화) */}
                <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/80 shadow-xs sm:shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                  <div className="space-y-1 sm:space-y-1.5">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-black">
                      <Sparkles size={13} className="text-amber-500" />
                      <span>영업 파트너 전용 대시보드</span>
                    </div>
                    <h2 className="text-lg sm:text-2xl font-black text-[#0F172A] tracking-tight">
                      {currentPartner?.name} 파트너님, 환영합니다!
                    </h2>
                    <p className="text-xs text-slate-400 font-bold leading-relaxed">
                      유치 가맹점 실시간 발주 실적과 이번 달 예상 정산 수수료를 한눈에 확인하세요.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-3 shrink-0 pt-1 sm:pt-0">
                    <button
                      onClick={() => setCurrentMenu("stores")}
                      className="px-2.5 sm:px-4 py-2.5 bg-[#FED422] hover:bg-amber-400 text-[#0F172A] font-black text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer border-0 active:scale-95 whitespace-nowrap"
                    >
                      <Store size={14} className="shrink-0" />
                      <span className="whitespace-nowrap tracking-tight">유치가맹점</span>
                    </button>
                    <button
                      onClick={() => setCurrentMenu("settlement")}
                      className="px-2.5 sm:px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 whitespace-nowrap"
                    >
                      <CreditCard size={14} className="shrink-0" />
                      <span className="whitespace-nowrap tracking-tight">정산관리</span>
                    </button>
                  </div>
                </div>

                {/* 🌟 내 전용 분양 사이트 카드 (심플 & 고급 쇼케이스) */}
                <div className="bg-gradient-to-br from-[#0B101D] via-[#111827] to-[#0A0E1A] rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-amber-500/30 shadow-xl relative overflow-hidden text-white">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
                    {/* 좌측: 타이틀, URL, 액션 버튼 (쓸데없는 문구 없이 심플하고 명확한 구성) */}
                    <div className="flex-1 min-w-0 space-y-3.5">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <span className="bg-[#FED422] text-[#0F172A] text-[10px] font-black px-2.5 py-0.5 rounded uppercase tracking-wider shadow-2xs">
                            MY BRANCH SITE
                          </span>
                          <span className="text-xs text-slate-400 font-medium">
                            (이 링크로 접수된 상담은 내 실적으로 자동 귀속)
                          </span>
                        </div>
                        <h3 className="text-lg sm:text-2xl font-black text-white tracking-tight">
                          내 전용 분양 사이트
                        </h3>
                      </div>

                      {/* URL 복사 바 */}
                      <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 flex items-center gap-2">
                        <span className="text-slate-400 font-mono text-xs font-bold shrink-0">URL:</span>
                        <span className="font-mono font-bold text-xs sm:text-sm text-amber-300 select-all truncate flex-1">
                          {typeof window !== "undefined" ? `${window.location.origin}/${partnerId}` : `https://120pie.com/${partnerId}`}
                        </span>
                      </div>

                      {/* 액션 버튼 */}
                      <div className="flex flex-wrap items-center gap-2.5 pt-0.5">
                        <button
                          type="button"
                          onClick={handleCopyBranchLink}
                          className="px-4 py-2.5 bg-[#FED422] hover:bg-amber-400 active:scale-95 text-[#0F172A] rounded-xl text-xs font-black flex items-center gap-1.5 shadow-sm cursor-pointer border-0 transition-all"
                        >
                          <Copy size={14} />
                          <span>분양 링크 복사</span>
                        </button>
                        <a
                          href={`/${partnerId}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-white rounded-xl text-xs font-black flex items-center gap-1.5 border border-slate-700 no-underline transition-all shadow-sm"
                        >
                          <ExternalLink size={14} />
                          <span>사이트 열기</span>
                        </a>
                        <button
                          type="button"
                          onClick={() => setCurrentMenu("consultation")}
                          className="px-3 py-2 text-xs text-slate-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer bg-transparent border-0 underline ml-auto sm:ml-0"
                        >
                          <span>상담문의 내역 ({partnerConsultations.length}건)</span>
                          <ChevronRight size={13} />
                        </button>
                      </div>
                    </div>

                    {/* 우측: 첨부2번 메인 사이트 이미지 브라우저 목업 (모바일에서는 미리보기 창 완전 숨김: hidden lg:block) */}
                    <div className="hidden lg:block shrink-0">
                      <a
                        href={`/${partnerId}`}
                        target="_blank"
                        rel="noreferrer"
                        className="block w-[380px] bg-slate-950 rounded-2xl border-2 border-slate-700 shadow-2xl overflow-hidden cursor-pointer group transition-all transform hover:-translate-y-1 hover:border-amber-400 no-underline"
                        title="클릭 시 내 전용 분양 사이트가 열립니다"
                      >
                        {/* 브라우저 크롬 상단 탭 바 */}
                        <div className="bg-slate-900 px-3.5 py-2 border-b border-slate-800 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/90" />
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/90" />
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/90" />
                          </div>

                          {/* 미니 주소창 */}
                          <div className="flex-1 max-w-[220px] bg-slate-950 border border-slate-800 rounded px-2.5 py-0.5 text-[10px] font-mono text-slate-400 flex items-center gap-1 truncate">
                            <Lock size={9} className="text-emerald-400 shrink-0" />
                            <span className="truncate">120pie.com/{partnerId}</span>
                          </div>

                          <div className="flex items-center gap-1 text-[10px] font-black text-amber-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                            <span>PREVIEW</span>
                          </div>
                        </div>

                        {/* 첨부2번 메인 사이트 이미지 분할 뷰포트 (Left: Brand / Right: Franchise) */}
                        <div className="relative w-full h-[185px] flex overflow-hidden">
                          {/* Left Panel: Brand */}
                          <div
                            className="flex-1 relative bg-cover bg-center"
                            style={{
                              backgroundImage: `url('https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784705753/ChatGPT_Image_2026%EB%85%84_7%EC%9B%94_22%EC%9D%BC_%EC%98%A4%ED%9B%84_04_35_21_1_vvaugb.png')`
                            }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/25 p-3 flex flex-col justify-between">
                              <div>
                                <span className="text-[8px] font-extrabold text-white tracking-wider uppercase block">BRAND</span>
                                <p className="text-xs font-black text-[#FFCC00] leading-tight mt-0.5 tracking-tight">120PIE & COFFEE</p>
                                <p className="text-[9px] text-neutral-200 font-medium leading-tight mt-0.5 line-clamp-1">120겹의 맛, 일상에 특별함을 더하다</p>
                              </div>
                              <div>
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#FFCC00] text-black text-[9px] font-black rounded-full shadow-sm">
                                  <span>브랜드 홈페이지</span>
                                  <span>→</span>
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Right Panel: Franchise */}
                          <div
                            className="flex-1 relative bg-cover bg-center border-l border-white/20"
                            style={{
                              backgroundImage: `url('https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784705760/ChatGPT_Image_2026%EB%85%84_7%EC%9B%94_22%EC%9D%BC_%EC%98%A4%ED%9B%84_04_35_22_2_mpdbps.png')`
                            }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/25 p-3 flex flex-col justify-between">
                              <div>
                                <span className="text-[8px] font-extrabold text-white tracking-wider uppercase block">FRANCHISE</span>
                                <p className="text-xs font-black text-[#FFCC00] leading-tight mt-0.5 tracking-tight">120PIE & COFFEE</p>
                                <p className="text-[9px] text-neutral-200 font-medium leading-tight mt-0.5 line-clamp-1">작은 공간에서 시작하는 달콤한 성공</p>
                              </div>
                              <div>
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#FFCC00] text-black text-[9px] font-black rounded-full shadow-sm">
                                  <span>창업 홈페이지</span>
                                  <span>→</span>
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Hover Overlay */}
                          <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-1.5 backdrop-blur-[2px]">
                            <span className="px-3.5 py-1.5 bg-[#FED422] text-[#0F172A] rounded-xl text-xs font-black shadow-xl flex items-center gap-1.5">
                              <ExternalLink size={13} />
                              <span>내 전용 사이트 열기</span>
                            </span>
                            <span className="text-[10px] text-slate-300 font-bold">
                              새 창으로 실제 화면 확인
                            </span>
                          </div>
                        </div>

                        {/* 목업 하단 정보 바 */}
                        <div className="bg-slate-900/90 px-3 py-1.5 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-bold">
                          <span className="flex items-center gap-1 text-slate-400">
                            <Sparkles size={11} className="text-amber-400" />
                            <span>120겹파이 공식 사이트</span>
                          </span>
                          <span className="text-amber-300 group-hover:underline flex items-center gap-0.5">
                            새 창으로 열기 <ExternalLink size={10} />
                          </span>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>

                {/* 4대 주요 지표 카드 (모바일 2x2 격자 그리드 배치) */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
                  {/* 카드 1: 당월 예상 수수료 */}
                  <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-slate-200/80 shadow-xs sm:shadow-md flex flex-col justify-between space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[11px] sm:text-xs font-bold text-slate-400 truncate">이번 달 예상 수수료</span>
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold shrink-0">
                        <DollarSign size={16} />
                      </div>
                    </div>
                    <div className="text-base sm:text-2xl font-black text-rose-600 tracking-tight my-0.5">
                      {currentMonthEstimatedCommission.toLocaleString()} <span className="text-[11px] sm:text-sm font-bold text-slate-600 font-sans">원</span>
                    </div>
                    <span className="text-[10px] sm:text-[11px] text-amber-600 font-bold truncate">
                      생지 {currentMonthDoughBoxes}박스 × 8,000원
                    </span>
                  </div>

                  {/* 카드 2: 유치 가맹점 수 */}
                  <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-slate-200/80 shadow-xs sm:shadow-md flex flex-col justify-between space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[11px] sm:text-xs font-bold text-slate-400 truncate">내가 유치한 가맹점</span>
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
                        <Store size={16} />
                      </div>
                    </div>
                    <div className="text-base sm:text-2xl font-black text-[#0F172A] tracking-tight my-0.5">
                      {myStores.length} <span className="text-[11px] sm:text-sm font-bold text-slate-400 font-sans">개점</span>
                    </div>
                    <span className="text-[10px] sm:text-[11px] text-emerald-600 font-bold truncate">
                      승인 {myStores.filter((s: any) => s.status === "승인").length}개소
                    </span>
                  </div>

                  {/* 카드 3: 당월 생지 주문 박스 수 */}
                  <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-slate-200/80 shadow-xs sm:shadow-md flex flex-col justify-between space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[11px] sm:text-xs font-bold text-slate-400 truncate">당월 생지 주문</span>
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0">
                        <Package size={16} />
                      </div>
                    </div>
                    <div className="text-base sm:text-2xl font-black text-[#0F172A] tracking-tight my-0.5">
                      {currentMonthDoughBoxes} <span className="text-[11px] sm:text-sm font-bold text-slate-400 font-sans">박스</span>
                    </div>
                    <span className="text-[10px] sm:text-[11px] text-blue-600 font-bold truncate">
                      총 {currentMonthOrders.length}건 발주
                    </span>
                  </div>

                  {/* 카드 4: 누적 수수료 합계 */}
                  <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-slate-200/80 shadow-xs sm:shadow-md flex flex-col justify-between space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[11px] sm:text-xs font-bold text-slate-400 truncate">누적 수수료 총액</span>
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold shrink-0">
                        <TrendingUp size={16} />
                      </div>
                    </div>
                    <div className="text-base sm:text-2xl font-black text-[#0F172A] tracking-tight my-0.5 truncate">
                      {totalCumulativeCommission.toLocaleString()} <span className="text-[11px] sm:text-sm font-bold text-slate-400 font-sans">원</span>
                    </div>
                    <span className="text-[10px] sm:text-[11px] text-purple-600 font-bold truncate">
                      누적 {totalDoughBoxes}박스
                    </span>
                  </div>
                </div>

                {/* 최근 주문 내역 & 공지사항 2분할 */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                  {/* 최근 가맹점 재료 주문 내역 (2칸) */}
                  <div className="lg:col-span-2 bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200/80 shadow-xs sm:shadow-md space-y-3 sm:space-y-4">
                    <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                      <h3 className="text-xs sm:text-sm font-black text-[#0F172A] flex items-center gap-2">
                        <Package size={16} className="text-amber-500" />
                        <span>최근 가맹점 재료 발주 내역</span>
                      </h3>
                      <button
                        onClick={() => setCurrentMenu("stores")}
                        className="text-[11px] sm:text-xs text-slate-500 hover:text-[#0F172A] font-bold flex items-center gap-1 cursor-pointer border-0 bg-transparent"
                      >
                        전체 보기 <ChevronRight size={13} />
                      </button>
                    </div>

                    {myOrders.length === 0 ? (
                      <div className="py-12 text-center text-slate-400 text-xs font-bold">
                        유치 가맹점의 재료 주문 내역이 없습니다.
                      </div>
                    ) : (
                      <>
                        {/* 📱 모바일 전용 카드형 리스트 (sm:hidden) */}
                        <div className="sm:hidden space-y-2">
                          {myOrders.slice(0, 5).map((ord: any) => (
                            <div key={ord.id} className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/70 space-y-1.5">
                              <div className="flex items-center justify-between">
                                <span className="font-black text-xs text-[#0F172A]">{ord.storeName}</span>
                                <span
                                  className={`inline-block px-2 py-0.2 rounded text-[9px] font-bold border ${
                                    (STATUS_BADGES[ord.status] || STATUS_BADGES["대기"]).bg
                                  } ${(STATUS_BADGES[ord.status] || STATUS_BADGES["대기"]).text} ${
                                    (STATUS_BADGES[ord.status] || STATUS_BADGES["대기"]).border
                                  }`}
                                >
                                  {ord.status}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-[11px] text-slate-500">
                                <span className="text-slate-400 text-[10px]">{ord.date}</span>
                                <span className="truncate max-w-[140px] text-right">
                                  {ord.items && ord.items.length > 0 ? ord.items[0].productName : "자재 주문"}
                                </span>
                              </div>
                              <div className="flex items-center justify-between pt-1.5 border-t border-slate-200/60 text-xs">
                                <span className="font-bold text-amber-700 text-[11px]">{ord.pastryDoughBoxes} 박스</span>
                                <span className="font-black text-rose-600 text-[11px]">
                                  +{(ord.commission || 0).toLocaleString()}원
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* 💻 태블릿/데스크탑 전용 정밀 테이블 (hidden sm:block) */}
                        <div className="hidden sm:block overflow-x-auto">
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
                                  <td className="py-3.5 px-3 text-slate-500 tabular-nums">{ord.date}</td>
                                  <td className="py-3.5 px-3 font-black text-[#0F172A]">
                                    <div className="flex items-center gap-1.5">
                                      <span>{ord.storeName}</span>
                                      {ord.storeId && (
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleGoToStorePortal({ id: ord.storeId, name: ord.storeName });
                                          }}
                                          className="p-1 text-purple-600 hover:text-purple-800 hover:bg-purple-100/60 rounded transition-colors cursor-pointer border-0 bg-transparent inline-flex items-center"
                                          title={`${ord.storeName} 점주포털 바로가기 (새 탭)`}
                                        >
                                          <ExternalLink size={12} />
                                        </button>
                                      )}
                                    </div>
                                  </td>
                                  <td className="py-3.5 px-3 text-slate-600 max-w-[180px] truncate">
                                    {ord.items && ord.items.length > 0
                                      ? `${ord.items[0].productName} ${ord.items.length > 1 ? `외 ${ord.items.length - 1}건` : ""}`
                                      : "자재 주문"}
                                  </td>
                                  <td className="py-3.5 px-3 text-right font-black text-amber-600 tabular-nums">
                                    {ord.pastryDoughBoxes} 박스
                                  </td>
                                  <td className="py-3.5 px-3 text-right font-black text-rose-600 tabular-nums">
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
                      </>
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
                            <span className="text-[10px] text-slate-400">{n.date}</span>
                          </div>
                          <h4 className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-amber-600 transition-colors">
                            {n.title}
                          </h4>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 하위 파트너 조직 실적 요약 위젯 (하위 파트너가 있을 때 노출) */}
                {(subPartnerActivities?.summary?.subPartnerCount || 0) > 0 && (
                  <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-2xl p-5 sm:p-6 border border-purple-500/30 text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="bg-purple-500/30 border border-purple-400/40 text-purple-200 text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <Users size={12} />
                          <span>내 하위 파트너 조직 네트워크</span>
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-black text-white">
                        소속 하위 파트너 {subPartnerActivities?.summary?.subPartnerCount}명이 활동 중입니다.
                      </h3>
                      <p className="text-xs text-purple-200/80 font-medium">
                        하위 파트너 유치 매장: <span className="text-amber-300 font-bold">{subPartnerActivities?.summary?.totalStoresCount}개점</span> | 
                        당월 하위 조직 생지 발주: <span className="text-amber-300 font-bold">{subPartnerActivities?.summary?.currentMonthBoxes}박스</span>
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentMenu("subpartners")}
                      className="px-4 py-2.5 bg-[#FED422] hover:bg-amber-400 text-slate-900 text-xs font-black rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 shrink-0 border-0 cursor-pointer active:scale-95"
                    >
                      <Users size={14} />
                      <span>하위 파트너 활동 모니터링</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ==========================================
                2) 가맹점 관리 뷰
            ========================================== */}
            {currentMenu === "stores" && (
              <div className="space-y-4 sm:space-y-6">
                <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200/80 shadow-xs sm:shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                  <div>
                    <h2 className="text-lg sm:text-xl font-black text-[#0F172A] tracking-tight flex items-center gap-2">
                      <Store size={20} className="text-amber-500" />
                      유치 가맹점 관리
                    </h2>
                    <p className="text-xs text-slate-400 font-bold mt-1">
                      {currentPartner?.name} 파트너님이 직접 유치한 가맹점 목록 및 재료 발주 내역입니다.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-initial">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={storeSearchQuery}
                        onChange={(e) => setStoreSearchQuery(e.target.value)}
                        placeholder="가맹점/점주명 검색"
                        className="w-full sm:w-52 pl-8 pr-3 py-2 bg-[#F1F4F8] border-0 rounded-xl text-xs font-medium text-[#0F172A] focus:bg-white focus:ring-2 focus:ring-amber-500/20 outline-none"
                      />
                    </div>
                    <select
                      value={storeStatusFilter}
                      onChange={(e) => setStoreStatusFilter(e.target.value)}
                      className="px-3 py-2 bg-[#F1F4F8] border-0 rounded-xl text-xs font-bold text-[#0F172A] focus:bg-white focus:ring-2 focus:ring-amber-500/20 outline-none cursor-pointer shrink-0"
                    >
                      <option value="전체">전체 상태</option>
                      <option value="승인">승인 (영업중)</option>
                      <option value="대기">대기</option>
                      <option value="보류">보류</option>
                      <option value="중지">중지</option>
                    </select>
                  </div>
                </div>

                {/* 가맹점 테이블 & 모바일 카드 */}
                <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200/80 shadow-xs sm:shadow-md overflow-hidden">
                  {filteredStores.length === 0 ? (
                    <div className="py-20 text-center text-slate-400 text-xs font-bold">
                      유치한 가맹점 정보가 없습니다. 본사에서 가맹점 파트너 매핑을 확인해 주세요.
                    </div>
                  ) : (
                    <>
                      {/* 📱 모바일 가맹점 카드 리스트 (sm:hidden) */}
                      <div className="sm:hidden p-3 space-y-2.5">
                        {filteredStores.map((store: any) => (
                          <div key={store.id} className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/70 space-y-2.5">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0 flex-1">
                                <div className="font-black text-sm text-[#0F172A] truncate">{store.name}</div>
                                <div className="text-[11px] text-slate-400 truncate mt-0.5">{store.roadAddress || "주소 미등록"}</div>
                              </div>
                              <span
                                className={`inline-block px-2 py-0.5 rounded text-[9px] font-extrabold border shrink-0 ${
                                  (STATUS_BADGES[store.status] || STATUS_BADGES["대기"]).bg
                                } ${(STATUS_BADGES[store.status] || STATUS_BADGES["대기"]).text} ${
                                  (STATUS_BADGES[store.status] || STATUS_BADGES["대기"]).border
                                }`}
                              >
                                {store.status}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-xs bg-white p-2.5 rounded-lg border border-slate-200/60">
                              <div>
                                <span className="text-[10px] text-slate-400 block font-medium">점주명 / 연락처</span>
                                <span className="font-bold text-slate-800 text-[11px]">{store.owner}</span>
                                <span className="text-[10px] text-slate-500 block">{store.phone}</span>
                              </div>
                              <div className="text-right">
                                <span className="text-[10px] text-slate-400 block font-medium">당월 생지 주문</span>
                                <span className="font-black text-amber-600 text-xs">{store.monthDoughBoxes || 0} 박스</span>
                                <span className="text-[10px] text-slate-400 block">
                                  누적 {store.totalDoughBoxes || 0}박스
                                </span>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 pt-1">
                              <button
                                onClick={() => handleGoToStorePortal(store)}
                                className="w-full py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg text-xs font-black transition-all cursor-pointer border-0 shadow-xs flex items-center justify-center gap-1.5 active:scale-95"
                                title={`${store.name} 점주포털 바로가기 (새 탭)`}
                              >
                                <ExternalLink size={13} />
                                <span>점주포털 바로가기</span>
                              </button>
                              <button
                                onClick={() => setSelectedStoreForOrders(store)}
                                className="w-full py-2 bg-[#FED422] hover:bg-amber-400 text-[#0F172A] rounded-lg text-xs font-black transition-all cursor-pointer border-0 shadow-2xs flex items-center justify-center gap-1.5 active:scale-95"
                                title="재료 발주 내역 보기"
                              >
                                <FileText size={13} />
                                <span>발주 내역</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* 💻 데스크탑 가맹점 테이블 (hidden sm:block) */}
                      <div className="hidden sm:block overflow-x-auto">
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
                              <th className="py-3.5 px-4 text-center">점주포털 / 발주내역</th>
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
                                <td className="py-4 px-3 text-slate-500">{store.phone}</td>
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
                                <td className="py-4 px-3 text-slate-400">{store.regDate}</td>
                                <td className="py-4 px-3 text-right font-black text-amber-600 tabular-nums">
                                  {store.monthDoughBoxes || 0} 박스
                                  <div className="text-[10px] text-slate-400 font-normal">
                                    (+{((store.monthDoughBoxes || 0) * 8000).toLocaleString()}원)
                                  </div>
                                </td>
                                <td className="py-4 px-3 text-right font-black text-[#0F172A] text-sm tabular-nums">
                                  {store.totalDoughBoxes || 0} 박스
                                </td>
                                <td className="py-4 px-4 text-center">
                                  <div className="flex items-center justify-center gap-1.5">
                                    <button
                                      onClick={() => handleGoToStorePortal(store)}
                                      className="px-2.5 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg text-xs font-black transition-all cursor-pointer border-0 shadow-xs inline-flex items-center gap-1 shrink-0 active:scale-95"
                                      title={`${store.name} 점주포털 바로가기 (새 탭)`}
                                    >
                                      <ExternalLink size={12} />
                                      <span>점주포털</span>
                                    </button>
                                    <button
                                      onClick={() => setSelectedStoreForOrders(store)}
                                      className="px-2.5 py-1.5 bg-[#FED422] hover:bg-amber-400 text-[#0F172A] rounded-lg text-xs font-black transition-all cursor-pointer border-0 shadow-2xs inline-flex items-center gap-1 shrink-0 active:scale-95"
                                      title="재료 발주 내역 보기"
                                    >
                                      <FileText size={12} />
                                      <span>발주내역</span>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* ==========================================
                2-1) 하위 파트너 활동 모니터링 뷰 (상위 파트너 전용)
            ========================================== */}
            {currentMenu === "subpartners" && (
              <div className="space-y-4 sm:space-y-6">
                {/* 상단 헤더 */}
                <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200/80 shadow-xs sm:shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                  <div>
                    <h2 className="text-lg sm:text-xl font-black text-[#0F172A] tracking-tight flex items-center gap-2">
                      <Users size={20} className="text-purple-600" />
                      <span>하위 파트너 활동 모니터링</span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 border border-purple-300 font-mono">
                        총 {subPartnerActivities?.summary?.subPartnerCount || 0}명
                      </span>
                    </h2>
                    <p className="text-xs text-slate-400 font-bold mt-1">
                      {currentPartner?.name} 파트너님 산하의 하위 파트너 조직 현황, 유치 가맹점 및 실시간 발주 활동을 모니터링합니다.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <span className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1.5">
                      <GitBranch size={13} />
                      <span>내 직급: Lv.{currentPartner?.level || 1} {currentPartner?.tierName || "총판"}</span>
                    </span>
                  </div>
                </div>

                {/* 4대 주요 지표 카드 */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
                  <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-slate-200/80 shadow-xs sm:shadow-md flex flex-col justify-between space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[11px] sm:text-xs font-bold text-slate-400 truncate">소속 하위 파트너</span>
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold shrink-0">
                        <Users size={16} />
                      </div>
                    </div>
                    <div className="text-base sm:text-2xl font-black text-purple-700 tracking-tight my-0.5">
                      {subPartnerActivities?.summary?.subPartnerCount || 0} <span className="text-[11px] sm:text-sm font-bold text-slate-400 font-sans">명</span>
                    </div>
                    <span className="text-[10px] sm:text-[11px] text-purple-600 font-bold truncate">
                      직속 및 하위 조직
                    </span>
                  </div>

                  <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-slate-200/80 shadow-xs sm:shadow-md flex flex-col justify-between space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[11px] sm:text-xs font-bold text-slate-400 truncate">하위 유치 가맹점</span>
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
                        <Store size={16} />
                      </div>
                    </div>
                    <div className="text-base sm:text-2xl font-black text-[#0F172A] tracking-tight my-0.5">
                      {subPartnerActivities?.summary?.totalStoresCount || 0} <span className="text-[11px] sm:text-sm font-bold text-slate-400 font-sans">개점</span>
                    </div>
                    <span className="text-[10px] sm:text-[11px] text-blue-600 font-bold truncate">
                      하위 파트너 연계 매장
                    </span>
                  </div>

                  <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-slate-200/80 shadow-xs sm:shadow-md flex flex-col justify-between space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[11px] sm:text-xs font-bold text-slate-400 truncate">당월 하위 생지 발주</span>
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold shrink-0">
                        <Package size={16} />
                      </div>
                    </div>
                    <div className="text-base sm:text-2xl font-black text-amber-600 tracking-tight my-0.5">
                      {(subPartnerActivities?.summary?.currentMonthBoxes || 0).toLocaleString()} <span className="text-[11px] sm:text-sm font-bold text-slate-400 font-sans">박스</span>
                    </div>
                    <span className="text-[10px] sm:text-[11px] text-slate-400 font-bold truncate">
                      누적 {(subPartnerActivities?.summary?.totalBoxes || 0).toLocaleString()}박스
                    </span>
                  </div>

                  <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-slate-200/80 shadow-xs sm:shadow-md flex flex-col justify-between space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[11px] sm:text-xs font-bold text-slate-400 truncate">하위 가맹 상담 건수</span>
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0">
                        <MessageSquare size={16} />
                      </div>
                    </div>
                    <div className="text-base sm:text-2xl font-black text-emerald-600 tracking-tight my-0.5">
                      {subPartnerActivities?.summary?.inquiryCount || 0} <span className="text-[11px] sm:text-sm font-bold text-slate-400 font-sans">건</span>
                    </div>
                    <span className="text-[10px] sm:text-[11px] text-emerald-600 font-bold truncate">
                      하위 파트너 상담 활동
                    </span>
                  </div>
                </div>

                {/* 하위 파트너 활동 컨텐츠 탭 & 검색 */}
                <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200/80 shadow-xs sm:shadow-md overflow-hidden">
                  <div className="p-4 sm:p-5 border-b border-neutral-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
                    {/* 서브 탭 버튼군 */}
                    <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                      <button
                        type="button"
                        onClick={() => setSubpartnerSubTab("overview")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border-0 ${
                          subpartnerSubTab === "overview"
                            ? "bg-white text-purple-700 shadow-2xs font-black"
                            : "text-slate-500 hover:text-slate-800 bg-transparent"
                        }`}
                      >
                        조직 현황 ({subPartnerActivities?.subPartners?.length || 0})
                      </button>
                      <button
                        type="button"
                        onClick={() => setSubpartnerSubTab("stores")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border-0 ${
                          subpartnerSubTab === "stores"
                            ? "bg-white text-purple-700 shadow-2xs font-black"
                            : "text-slate-500 hover:text-slate-800 bg-transparent"
                        }`}
                      >
                        유치 가맹점 ({subPartnerActivities?.stores?.length || 0})
                      </button>
                      <button
                        type="button"
                        onClick={() => setSubpartnerSubTab("orders")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border-0 ${
                          subpartnerSubTab === "orders"
                            ? "bg-white text-purple-700 shadow-2xs font-black"
                            : "text-slate-500 hover:text-slate-800 bg-transparent"
                        }`}
                      >
                        가맹점 발주 내역 ({subPartnerActivities?.orders?.length || 0})
                      </button>
                      <button
                        type="button"
                        onClick={() => setSubpartnerSubTab("inquiries")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border-0 ${
                          subpartnerSubTab === "inquiries"
                            ? "bg-white text-purple-700 shadow-2xs font-black"
                            : "text-slate-500 hover:text-slate-800 bg-transparent"
                        }`}
                      >
                        가맹 상담 활동 ({subPartnerActivities?.inquiries?.length || 0})
                      </button>
                    </div>

                    {/* 실시간 검색창 */}
                    <div className="relative">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={subpartnerSearchQuery}
                        onChange={(e) => setSubpartnerSearchQuery(e.target.value)}
                        placeholder="파트너명 / 매장명 / 검색..."
                        className="pl-8 pr-3 py-1.5 bg-[#F1F4F8] border-0 rounded-lg text-xs font-medium text-[#0F172A] w-full sm:w-56 focus:bg-white focus:ring-2 focus:ring-purple-500/20 outline-none"
                      />
                    </div>
                  </div>

                  {/* 하위 파트너가 없는 경우 */}
                  {(!subPartnerActivities?.subPartners || subPartnerActivities.subPartners.length === 0) ? (
                    <div className="p-16 text-center text-slate-400 space-y-3">
                      <div className="w-14 h-14 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                        <Users size={28} />
                      </div>
                      <div className="text-sm font-bold text-slate-700">등록된 하위 파트너가 없습니다.</div>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                        본사 관리자에게 하위 파트너 등록 또는 상위 파트너 지정을 요청하시면, 하위 파트너의 가맹점 유치 및 발주 활동을 이곳에서 실시간으로 모니터링하실 수 있습니다.
                      </p>
                    </div>
                  ) : (
                    <div>
                      {/* 서브탭 1: 하위 조직 목록 (총판/지사 계층) */}
                      {subpartnerSubTab === "overview" && (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs">
                            <thead>
                              <tr className="bg-[#F8FAFC] border-b border-neutral-200/80 text-slate-500 font-bold">
                                <th className="py-3.5 px-4">하위 파트너</th>
                                <th className="py-3.5 px-3">직급 / 레벨</th>
                                <th className="py-3.5 px-3">연락처 / 이메일</th>
                                <th className="py-3.5 px-3 text-center">직속 상위</th>
                                <th className="py-3.5 px-3 text-center">유치 가맹점</th>
                                <th className="py-3.5 px-3 text-right">당월 생지 발주</th>
                                <th className="py-3.5 px-3 text-right">누적 생지 발주</th>
                                <th className="py-3.5 px-3 text-center">상태</th>
                                <th className="py-3.5 px-4 text-center">가맹점 관리</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100">
                              {subPartnerActivities.subPartners
                                .filter((p: any) => {
                                  if (!subpartnerSearchQuery.trim()) return true;
                                  const q = subpartnerSearchQuery.trim().toLowerCase();
                                  return (
                                    (p.name || "").toLowerCase().includes(q) ||
                                    (p.id || "").toLowerCase().includes(q) ||
                                    (p.companyName || "").toLowerCase().includes(q) ||
                                    (p.phone || "").includes(q)
                                  );
                                })
                                .map((partner: any) => (
                                  <tr key={partner.id} className="hover:bg-purple-50/30 transition-colors">
                                    <td className="py-3.5 px-4">
                                      <div className="font-black text-[#0F172A] text-sm flex items-center gap-1.5">
                                        <span>{partner.name}</span>
                                        {partner.companyName && (
                                          <span className="text-xs text-slate-400 font-normal">({partner.companyName})</span>
                                        )}
                                      </div>
                                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                                        ID: <span className="font-bold text-slate-700">{partner.id}</span>
                                      </div>
                                    </td>
                                    <td className="py-3.5 px-3">
                                      <span className="inline-block px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 font-extrabold text-[10px] border border-purple-200">
                                        Lv.{partner.level} {partner.tierName}
                                      </span>
                                    </td>
                                    <td className="py-3.5 px-3">
                                      <div className="text-slate-800 font-bold">{partner.phone}</div>
                                      <div className="text-[11px] text-slate-400">{partner.email || "-"}</div>
                                    </td>
                                    <td className="py-3.5 px-3 text-center">
                                      <span className="text-slate-600 font-medium">
                                        {partner.isDirectChild ? (
                                          <span className="text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded text-[10px]">
                                            나의 직속
                                          </span>
                                        ) : (
                                          <span className="text-slate-500 text-[10px]">
                                            {partner.parentName} 산하
                                          </span>
                                        )}
                                      </span>
                                    </td>
                                    <td className="py-3.5 px-3 text-center">
                                      <span className="inline-block px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-black text-xs border border-blue-100">
                                        {partner.storesCount || 0} 개점
                                      </span>
                                    </td>
                                    <td className="py-3.5 px-3 text-right font-black text-amber-600 text-sm tabular-nums">
                                      {(partner.currentMonthBoxes || 0).toLocaleString()} 박스
                                    </td>
                                    <td className="py-3.5 px-3 text-right font-black text-slate-800 text-sm tabular-nums">
                                      {(partner.totalBoxes || 0).toLocaleString()} 박스
                                    </td>
                                    <td className="py-3.5 px-3 text-center">
                                      <span
                                        className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-extrabold ${
                                          partner.status === "활동중"
                                            ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                                             : "bg-slate-100 text-slate-500 border border-slate-200"
                                        }`}
                                      >
                                        {partner.status}
                                      </span>
                                    </td>
                                    <td className="py-3.5 px-4 text-center">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setSubpartnerSearchQuery(partner.name);
                                          setSubpartnerSubTab("stores");
                                        }}
                                        className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 font-black text-xs border border-purple-200 transition-all cursor-pointer inline-flex items-center gap-1 shadow-2xs"
                                        title={`${partner.name} 유치 매장 및 구매 이력 보기`}
                                      >
                                        <Store size={12} />
                                        <span>유치매장 보기</span>
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {/* 서브탭 2: 하위 유치 가맹점 목록 & 구매/발주 실적 */}
                      {subpartnerSubTab === "stores" && (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs">
                            <thead>
                              <tr className="bg-[#F8FAFC] border-b border-neutral-200/80 text-slate-500 font-bold">
                                <th className="py-3.5 px-4">가맹점명</th>
                                <th className="py-3.5 px-3">담당 하위 파트너</th>
                                <th className="py-3.5 px-3">점주 / 연락처</th>
                                <th className="py-3.5 px-3 text-center">가맹 상태</th>
                                <th className="py-3.5 px-3 text-right">당월 생지 발주</th>
                                <th className="py-3.5 px-3 text-right">누적 생지 발주</th>
                                <th className="py-3.5 px-3 text-right">총 발주액 (건수)</th>
                                <th className="py-3.5 px-4 text-center">점주포털 / 구매이력</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100">
                              {subPartnerActivities.stores
                                .filter((s: any) => {
                                  if (!subpartnerSearchQuery.trim()) return true;
                                  const q = subpartnerSearchQuery.trim().toLowerCase();
                                  return (
                                    (s.name || "").toLowerCase().includes(q) ||
                                    (s.owner || "").toLowerCase().includes(q) ||
                                    (s.partnerName || "").toLowerCase().includes(q) ||
                                    (s.roadAddress || "").toLowerCase().includes(q)
                                  );
                                })
                                .map((store: any) => (
                                  <tr key={store.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="py-3.5 px-4">
                                      <div className="font-black text-[#0F172A] text-sm">{store.name}</div>
                                      <div className="text-[11px] text-slate-400 truncate max-w-xs">{store.roadAddress} {store.detailAddress}</div>
                                    </td>
                                    <td className="py-3.5 px-3">
                                      <div className="font-bold text-purple-700 flex items-center gap-1.5">
                                        <span>{store.partnerName}</span>
                                        <span className="text-[10px] bg-purple-50 px-1.5 py-0.2 rounded border border-purple-200 font-extrabold">
                                          {store.partnerTierName}
                                        </span>
                                      </div>
                                      <div className="text-[10px] text-slate-400">연락처: {store.partnerPhone || "-"}</div>
                                    </td>
                                    <td className="py-3.5 px-3">
                                      <div className="text-slate-800 font-bold">{store.owner}</div>
                                      <div className="text-[11px] text-slate-400">{store.phone}</div>
                                    </td>
                                    <td className="py-3.5 px-3 text-center">
                                      <span
                                        className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-extrabold ${
                                          store.status === "승인"
                                            ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                                            : "bg-amber-50 text-amber-600 border border-amber-200"
                                        }`}
                                      >
                                        {store.status}
                                      </span>
                                    </td>
                                    <td className="py-3.5 px-3 text-right font-black text-amber-600 text-sm tabular-nums">
                                      {store.monthDoughBoxes || 0} 박스
                                    </td>
                                    <td className="py-3.5 px-3 text-right font-black text-slate-800 text-sm tabular-nums">
                                      {store.totalDoughBoxes || 0} 박스
                                    </td>
                                    <td className="py-3.5 px-3 text-right tabular-nums">
                                      <div className="font-black text-slate-900 text-xs">
                                        {(store.totalOrderAmount || 0).toLocaleString()}원
                                      </div>
                                      <div className="text-[10px] text-slate-400">
                                        총 {store.totalOrdersCount || 0}건 주문
                                      </div>
                                    </td>
                                    <td className="py-3.5 px-4 text-center">
                                      <div className="flex items-center justify-center gap-1.5">
                                        <button
                                          type="button"
                                          onClick={() => handleGoToStorePortal(store)}
                                          className="px-2.5 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg text-xs font-black transition-all cursor-pointer border-0 shadow-xs inline-flex items-center gap-1 shrink-0 active:scale-95"
                                          title={`${store.name} 점주포털 바로가기 (새 탭)`}
                                        >
                                          <ExternalLink size={12} />
                                          <span>점주포털</span>
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => setSelectedStoreForOrders(store)}
                                          className="px-2.5 py-1.5 bg-[#FED422] hover:bg-amber-400 text-[#0F172A] rounded-lg text-xs font-black transition-all cursor-pointer border-0 shadow-2xs inline-flex items-center gap-1 shrink-0 active:scale-95"
                                          title="상세 구매 이력 보기"
                                        >
                                          <FileText size={12} />
                                          <span>구매이력</span>
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {/* 서브탭 3: 가맹점 발주 내역 */}
                      {subpartnerSubTab === "orders" && (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs">
                            <thead>
                              <tr className="bg-[#F8FAFC] border-b border-neutral-200/80 text-slate-500 font-bold">
                                <th className="py-3.5 px-4">주문일자 / ID</th>
                                <th className="py-3.5 px-3">발주 가맹점</th>
                                <th className="py-3.5 px-3">담당 하위 파트너</th>
                                <th className="py-3.5 px-3 text-right">생지 발주량</th>
                                <th className="py-3.5 px-3 text-right">주문 총액</th>
                                <th className="py-3.5 px-3 text-center">주문 상태</th>
                                <th className="py-3.5 px-4 text-center">가맹점 이력</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100">
                              {subPartnerActivities.orders
                                .filter((o: any) => {
                                  if (!subpartnerSearchQuery.trim()) return true;
                                  const q = subpartnerSearchQuery.trim().toLowerCase();
                                  return (
                                    (o.storeName || "").toLowerCase().includes(q) ||
                                    (o.partnerName || "").toLowerCase().includes(q) ||
                                    (o.id || "").toLowerCase().includes(q)
                                  );
                                })
                                .map((ord: any) => {
                                  const matchingStore = subPartnerActivities?.stores?.find((s: any) => s.id === ord.storeId);
                                  return (
                                    <tr key={ord.id} className="hover:bg-slate-50 transition-colors">
                                      <td className="py-3.5 px-4">
                                        <div className="font-bold text-slate-900">{ord.date}</div>
                                        <div className="text-[10px] text-slate-400 font-mono">{ord.id}</div>
                                      </td>
                                      <td className="py-3.5 px-3">
                                        <div className="font-bold text-slate-800">{ord.storeName}</div>
                                        <div className="text-[10px] text-slate-400">점주: {ord.storeOwner}</div>
                                      </td>
                                      <td className="py-3.5 px-3">
                                        <span className="font-bold text-purple-700">{ord.partnerName}</span>
                                        <span className="text-[10px] text-slate-400 ml-1">({ord.partnerTierName})</span>
                                      </td>
                                      <td className="py-3.5 px-3 text-right font-black text-amber-600 text-sm tabular-nums">
                                        {ord.doughBoxes} 박스
                                      </td>
                                      <td className="py-3.5 px-3 text-right font-black text-slate-900 tabular-nums">
                                        {(ord.totalPrice || 0).toLocaleString()} 원
                                      </td>
                                      <td className="py-3.5 px-3 text-center">
                                        <span
                                          className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-extrabold ${
                                            STATUS_BADGES[ord.status]?.bg || "bg-slate-100"
                                          } ${STATUS_BADGES[ord.status]?.text || "text-slate-600"} border ${
                                            STATUS_BADGES[ord.status]?.border || "border-slate-200"
                                          }`}
                                        >
                                          {ord.status}
                                        </span>
                                      </td>
                                      <td className="py-3.5 px-4 text-center">
                                        {matchingStore && (
                                          <button
                                            type="button"
                                            onClick={() => setSelectedStoreForOrders(matchingStore)}
                                            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-amber-100 hover:text-amber-900 text-slate-700 font-black text-xs border border-slate-200 transition-all cursor-pointer inline-flex items-center gap-1 shadow-2xs"
                                            title="해당 가맹점 전체 발주 내역 열기"
                                          >
                                            <FileText size={12} />
                                            <span>전체 발주</span>
                                          </button>
                                        )}
                                      </td>
                                    </tr>
                                  );
                                })}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {/* 서브탭 4: 가맹 상담/문의 활동 */}
                      {subpartnerSubTab === "inquiries" && (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs">
                            <thead>
                              <tr className="bg-[#F8FAFC] border-b border-neutral-200/80 text-slate-500 font-bold">
                                <th className="py-3.5 px-4">접수일시</th>
                                <th className="py-3.5 px-3">고객명 / 연락처</th>
                                <th className="py-3.5 px-3">점포 유형 / 매장명</th>
                                <th className="py-3.5 px-3">담당 하위 파트너</th>
                                <th className="py-3.5 px-3 text-center">진행 상태</th>
                                <th className="py-3.5 px-4">상담 메모</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100">
                              {subPartnerActivities.inquiries
                                .filter((inq: any) => {
                                  if (!subpartnerSearchQuery.trim()) return true;
                                  const q = subpartnerSearchQuery.trim().toLowerCase();
                                  return (
                                    (inq.name || "").toLowerCase().includes(q) ||
                                    (inq.phone || "").includes(q) ||
                                    (inq.partnerName || "").toLowerCase().includes(q)
                                  );
                                })
                                .map((inq: any) => (
                                  <tr key={inq._id} className="hover:bg-slate-50 transition-colors">
                                    <td className="py-3.5 px-4 text-slate-500 font-medium">
                                      {inq.regDate}
                                    </td>
                                    <td className="py-3.5 px-3">
                                      <div className="font-bold text-slate-900">{inq.name}</div>
                                      <div className="text-[11px] text-slate-400">{inq.phone}</div>
                                    </td>
                                    <td className="py-3.5 px-3">
                                      <span className="font-bold text-slate-800">{inq.storeType}</span>
                                      {inq.existingStoreName && (
                                        <div className="text-[10px] text-slate-400">({inq.existingStoreName})</div>
                                      )}
                                    </td>
                                    <td className="py-3.5 px-3">
                                      <span className="font-bold text-purple-700">{inq.partnerName}</span>
                                      <span className="text-[10px] text-slate-400 ml-1">({inq.partnerTierName})</span>
                                    </td>
                                    <td className="py-3.5 px-3 text-center">
                                      <span
                                        className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-extrabold ${
                                          STATUS_BADGES[inq.status || "대기"]?.bg || "bg-amber-50"
                                        } ${STATUS_BADGES[inq.status || "대기"]?.text || "text-amber-600"} border ${
                                          STATUS_BADGES[inq.status || "대기"]?.border || "border-amber-200"
                                        }`}
                                      >
                                        {inq.status || "대기"}
                                      </span>
                                    </td>
                                    <td className="py-3.5 px-4 text-slate-500 text-[11px] max-w-[240px] truncate">
                                      {inq.partnerMemo || inq.message || "-"}
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ==========================================
                2-2) 유치 상담문의 관리 뷰 (내 전용 분양 사이트 유입 상담)
            ========================================== */}
            {currentMenu === "consultation" && (
              <div className="space-y-4 sm:space-y-6">
                {/* 상담 목록 상단 검색 & 필터 헤더 */}
                <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200/80 shadow-xs sm:shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                  <div>
                    <h2 className="text-lg sm:text-xl font-black text-[#0F172A] tracking-tight flex items-center gap-2">
                      <MessageSquare size={20} className="text-amber-500" />
                      <span>유치 상담문의 관리</span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-mono">
                        총 {partnerConsultations.length}건
                      </span>
                    </h2>
                    <p className="text-xs text-slate-400 font-bold mt-1">
                      내 전용 분양 페이지(/{partnerId})를 통해 접수된 예비 창업자 및 점주들의 실시간 상담 신청 목록입니다.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
                    <button
                      type="button"
                      onClick={handleCopyBranchLink}
                      className="px-3 py-2 bg-amber-50 hover:bg-amber-100 active:scale-95 text-amber-900 border border-amber-300 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer transition-all shrink-0"
                      title="내 전용 분양 링크 복사"
                    >
                      <Copy size={13} />
                      <span>분양 링크 복사</span>
                    </button>
                    <div className="relative flex-1 sm:flex-initial">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={consultationSearch}
                        onChange={(e) => setConsultationSearch(e.target.value)}
                        placeholder="신청자명/연락처 검색"
                        className="w-full sm:w-52 pl-8 pr-3 py-2 bg-[#F1F4F8] border-0 rounded-xl text-xs font-medium text-[#0F172A] focus:bg-white focus:ring-2 focus:ring-amber-500/20 outline-none"
                      />
                    </div>
                    <select
                      value={consultationStatusFilter}
                      onChange={(e) => setConsultationStatusFilter(e.target.value)}
                      className="px-3 py-2 bg-[#F1F4F8] border-0 rounded-xl text-xs font-bold text-[#0F172A] focus:bg-white focus:ring-2 focus:ring-amber-500/20 outline-none cursor-pointer shrink-0"
                    >
                      <option value="전체">전체 상태</option>
                      <option value="대기">대기</option>
                      <option value="상담중">상담중</option>
                      <option value="계약완료">계약완료</option>
                      <option value="보류">보류</option>
                    </select>
                  </div>
                </div>

                {/* 상담 목록 테이블 (데스크톱) & 모바일 카드 뷰 */}
                <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200/80 shadow-xs sm:shadow-md overflow-hidden">
                  {filteredConsultations.length === 0 ? (
                    <div className="py-20 text-center text-slate-400 text-xs font-bold space-y-2">
                      <MessageSquare size={32} className="mx-auto text-slate-300" />
                      <p>접수된 분양 상담 내역이 없습니다.</p>
                      <p className="text-[11px] text-slate-400">내 전용 분양 링크를 홍보하여 첫 번째 상담을 유치해 보세요!</p>
                    </div>
                  ) : (
                    <>
                      {/* 📱 모바일 전용 상담 카드 리스트 (sm:hidden) */}
                      <div className="sm:hidden p-3 space-y-3">
                        {filteredConsultations.map((inq: any) => (
                          <div key={inq._id} className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/70 space-y-2.5">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <span className="text-[10px] text-slate-400 font-mono block mb-0.5">{inq.regDate}</span>
                                <h4 className="font-black text-sm text-[#0F172A]">{inq.name}</h4>
                              </div>
                              <select
                                value={inq.status || "대기"}
                                onChange={(e) => handleConsultationStatusChange(inq._id, e.target.value)}
                                className={`text-[11px] font-black px-2.5 py-1 rounded-lg border cursor-pointer ${
                                  inq.status === "계약완료"
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                                    : inq.status === "상담중"
                                    ? "bg-blue-50 text-blue-700 border-blue-300"
                                    : inq.status === "보류"
                                    ? "bg-slate-100 text-slate-500 border-slate-300"
                                    : "bg-amber-50 text-amber-800 border-amber-300"
                                }`}
                              >
                                <option value="대기">대기</option>
                                <option value="상담중">상담중</option>
                                <option value="계약완료">계약완료</option>
                                <option value="보류">보류</option>
                              </select>
                            </div>

                            <div className="text-xs space-y-1 bg-white p-2.5 rounded-lg border border-slate-200/60">
                              <div className="flex items-center justify-between">
                                <span className="text-slate-400 font-medium">연락처:</span>
                                <div className="flex items-center gap-1.5 font-mono font-bold text-slate-800">
                                  <span>{inq.phone}</span>
                                  <a
                                    href={`tel:${inq.phone.replace(/[^0-9]/g, "")}`}
                                    className="px-2 py-0.5 bg-emerald-600 text-white rounded text-[10px] font-bold no-underline"
                                  >
                                    전화
                                  </a>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-slate-400 font-medium">도입유형:</span>
                                <span className="font-bold text-slate-700">{inq.storeType}</span>
                              </div>
                              {inq.existingStoreName && (
                                <div className="flex items-center justify-between">
                                  <span className="text-slate-400 font-medium">기존매장명:</span>
                                  <span className="font-bold text-slate-700">{inq.existingStoreName}</span>
                                </div>
                              )}
                            </div>

                            {inq.message && (
                              <div className="text-[11px] text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200/60">
                                <span className="font-bold text-slate-400 block mb-0.5">상담 문의내용:</span>
                                <p className="whitespace-pre-line leading-relaxed">{inq.message}</p>
                              </div>
                            )}

                            {/* 파트너 메모 영역 */}
                            <div className="pt-1 flex items-center justify-between gap-2">
                              <div className="text-[11px] text-slate-500 truncate flex-1">
                                {inq.partnerMemo ? (
                                  <span>📝 {inq.partnerMemo}</span>
                                ) : (
                                  <span className="text-slate-400 italic">등록된 상담 메모가 없습니다.</span>
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingMemoId(inq._id);
                                  setEditingMemoText(inq.partnerMemo || "");
                                }}
                                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-bold border-0 cursor-pointer shrink-0"
                              >
                                {inq.partnerMemo ? "메모 수정" : "+ 메모"}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* 💻 데스크톱 테이블 뷰 (hidden sm:block) */}
                      <div className="hidden sm:block overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-[#F8F9FD] border-b border-[#EEF0F5] text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                              <th className="p-4 w-24">신청일</th>
                              <th className="p-4 w-28">고객명</th>
                              <th className="p-4 w-40">연락처</th>
                              <th className="p-4 w-36">도입 희망유형</th>
                              <th className="p-4">문의내용 및 파트너 메모</th>
                              <th className="p-4 w-28 text-center">진행상태</th>
                              <th className="p-4 w-20 text-center">관리</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#EEF0F5] text-xs">
                            {filteredConsultations.map((inq: any) => (
                              <tr key={inq._id} className="hover:bg-[#FFFDF5] transition-colors">
                                <td className="p-4 text-slate-500 font-mono font-medium whitespace-nowrap">{inq.regDate}</td>
                                <td className="p-4 font-black text-[#0F172A] whitespace-nowrap">{inq.name}</td>
                                <td className="p-4 font-mono font-bold text-slate-700 whitespace-nowrap">
                                  <div className="flex items-center gap-1.5">
                                    <span>{inq.phone}</span>
                                    <a
                                      href={`tel:${inq.phone.replace(/[^0-9]/g, "")}`}
                                      className="p-1 text-emerald-600 hover:bg-emerald-50 rounded no-underline"
                                      title="전화 걸기"
                                    >
                                      <Phone size={12} />
                                    </a>
                                  </div>
                                </td>
                                <td className="p-4 whitespace-nowrap">
                                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold text-[11px]">
                                    {inq.storeType}
                                  </span>
                                  {inq.existingStoreName && (
                                    <span className="block text-[10px] text-slate-400 mt-0.5 truncate max-w-[130px]">
                                      {inq.existingStoreName}
                                    </span>
                                  )}
                                </td>
                                <td className="p-4 max-w-sm">
                                  <div className="space-y-1">
                                    <p className="text-slate-800 font-medium line-clamp-2" title={inq.message}>
                                      {inq.message || "-"}
                                    </p>
                                    {inq.partnerMemo && (
                                      <p className="text-[11px] text-indigo-700 bg-indigo-50/70 px-2 py-0.5 rounded border border-indigo-100 line-clamp-1">
                                        📝 {inq.partnerMemo}
                                      </p>
                                    )}
                                  </div>
                                </td>
                                <td className="p-4 text-center whitespace-nowrap">
                                  <select
                                    value={inq.status || "대기"}
                                    onChange={(e) => handleConsultationStatusChange(inq._id, e.target.value)}
                                    className={`text-[11px] font-black px-2.5 py-1 rounded-lg border cursor-pointer outline-none ${
                                      inq.status === "계약완료"
                                        ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                                        : inq.status === "상담중"
                                        ? "bg-blue-50 text-blue-700 border-blue-300"
                                        : inq.status === "보류"
                                        ? "bg-slate-100 text-slate-500 border-slate-300"
                                        : "bg-amber-50 text-amber-800 border-amber-300"
                                    }`}
                                  >
                                    <option value="대기">대기</option>
                                    <option value="상담중">상담중</option>
                                    <option value="계약완료">계약완료</option>
                                    <option value="보류">보류</option>
                                  </select>
                                </td>
                                <td className="p-4 text-center whitespace-nowrap">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingMemoId(inq._id);
                                      setEditingMemoText(inq.partnerMemo || "");
                                    }}
                                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold border-0 cursor-pointer transition-all"
                                  >
                                    메모
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
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
              <div className="space-y-4 sm:space-y-6">
                <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200/80 shadow-xs sm:shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                  <div>
                    <h2 className="text-lg sm:text-xl font-black text-[#0F172A] tracking-tight flex items-center gap-2">
                      <CreditCard size={20} className="text-amber-500" />
                      월별 수수료 정산 관리
                    </h2>
                    <p className="text-xs text-slate-400 font-bold mt-1">
                      유치 가맹점의 패스트리 생지 발주 실적에 따른 월 단위 수수료 명세서를 확인합니다.
                    </p>
                  </div>

                  <div className="px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 font-bold flex items-center gap-2 self-start sm:self-auto">
                    <Award size={15} className="text-amber-600 shrink-0" />
                    <span className="text-[11px] sm:text-xs">패스트리 생지 1박스 당 8,000원 (VAT포함)</span>
                  </div>
                </div>

                {/* 등록된 정산 계좌 카드 */}
                <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs sm:shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold shrink-0">
                      <Wallet size={20} />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] sm:text-[11px] text-slate-400 font-bold block">수수료 입금 등록 계좌</span>
                      <div className="text-xs sm:text-sm font-black text-[#0F172A] truncate">
                        {currentPartner?.bankName || "은행 미등록"}{" "}
                        <span className="text-amber-600 font-bold">{currentPartner?.accountNumber || "-"}</span>{" "}
                        <span className="text-slate-500 font-normal">({currentPartner?.accountHolder || currentPartner?.name || "-"})</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setCurrentMenu("settings")}
                    className="w-full sm:w-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-all cursor-pointer text-center"
                  >
                    계좌정보 변경
                  </button>
                </div>

                {/* 월별 정산 내역 테이블 & 모바일 카드 */}
                <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200/80 shadow-xs sm:shadow-md overflow-hidden p-4 sm:p-6 space-y-3 sm:space-y-4">
                  <h3 className="text-xs sm:text-sm font-black text-[#0F172A]">월별 정산 명세 내역</h3>

                  {settlements.length === 0 ? (
                    <div className="py-16 text-center text-slate-400 text-xs font-bold">
                      정산 내역이 없습니다.
                    </div>
                  ) : (
                    <>
                      {/* 📱 모바일 정산 카드 리스트 (sm:hidden) */}
                      <div className="sm:hidden space-y-2.5">
                        {settlements.map((st: any, idx: number) => (
                          <div key={idx} className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/70 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-black text-sm text-[#0F172A]">{st.yearMonth}</span>
                              <span
                                className={`inline-block px-2 py-0.5 rounded text-[9px] font-extrabold border ${
                                  (STATUS_BADGES[st.status] || STATUS_BADGES["대기"]).bg
                                } ${(STATUS_BADGES[st.status] || STATUS_BADGES["대기"]).text} ${
                                  (STATUS_BADGES[st.status] || STATUS_BADGES["대기"]).border
                                }`}
                              >
                                {st.status}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-xs bg-white p-2.5 rounded-lg border border-slate-200/60">
                              <div>
                                <span className="text-[10px] text-slate-400 block font-medium">유치 가맹점</span>
                                <span className="font-bold text-slate-800">{st.storeCount} 개점</span>
                              </div>
                              <div className="text-right">
                                <span className="text-[10px] text-slate-400 block font-medium">생지 주문 박스</span>
                                <span className="font-black text-amber-600">{st.boxCount} 박스</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-1 text-xs">
                              <div>
                                <span className="text-[10px] text-slate-400 block">총 정산 수수료</span>
                                <span className="font-black text-rose-600 text-sm">
                                  {(st.commissionAmount || 0).toLocaleString()}원
                                </span>
                              </div>
                              <button
                                onClick={() => setSelectedSettlement(st)}
                                className="px-3 py-1.5 bg-[#FED422] hover:bg-amber-400 text-[#0F172A] rounded-lg text-xs font-black transition-all cursor-pointer border-0 shadow-2xs inline-flex items-center gap-1 active:scale-95"
                              >
                                <FileText size={12} />
                                <span>명세서 보기</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* 💻 데스크탑 정산 테이블 (hidden sm:block) */}
                      <div className="hidden sm:block overflow-x-auto">
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
                                <td className="py-4 px-3 font-black text-[#0F172A] tabular-nums">{st.yearMonth}</td>
                                <td className="py-4 px-3 font-bold text-slate-700">{st.storeCount} 개점</td>
                                <td className="py-4 px-3 text-right font-black text-amber-600 tabular-nums">
                                  {st.boxCount} 박스
                                </td>
                                <td className="py-4 px-3 text-right text-slate-500 tabular-nums">
                                  {(st.commissionUnit || 8000).toLocaleString()}원
                                </td>
                                <td className="py-4 px-3 text-right font-black text-rose-600 text-sm tabular-nums">
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
                                <td className="py-4 px-3 text-center text-slate-400 tabular-nums">
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
                    </>
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
                      <div className="flex items-center gap-4 text-[11px] text-slate-400 shrink-0">
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
                          <span className="text-[10px] text-slate-500 font-bold truncate w-full text-center">
                            {st.yearMonth.slice(5)}월
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {monthlyStats.map((st: any, idx: number) => (
                      <div key={idx} className="p-4 rounded-lg bg-[#F8FAFC] border border-neutral-200/80 space-y-1">
                        <div className="text-[11px] font-bold text-slate-400">{st.yearMonth}</div>
                        <div className="text-sm font-black text-[#0F172A]">{st.boxCount} 박스</div>
                        <div className="text-xs font-black text-rose-600">
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
                          <span className="text-[10px] text-slate-400">{m.format} · {m.size}</span>
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
                          onChange={(e) => setSettingPhone(formatPhoneNumber(e.target.value))}
                          placeholder="010-0000-0000"
                          maxLength={13}
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
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-[#0F172A]">
                      {selectedStoreForOrders.name} - 재료 발주 내역
                    </h3>
                    {selectedStoreForOrders.partnerName && selectedStoreForOrders.partnerId !== currentPartner?.id && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-900 text-purple-100 text-[10px] font-extrabold shadow-2xs">
                        <Users size={10} />
                        담당: {selectedStoreForOrders.partnerName} ({selectedStoreForOrders.partnerTierName || "하위 파트너"})
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#0F172A]/80 font-bold">
                    점주: {selectedStoreForOrders.owner} ({selectedStoreForOrders.phone})
                    {selectedStoreForOrders.roadAddress && (
                      <span className="ml-2 text-slate-700 font-medium">| {selectedStoreForOrders.roadAddress}</span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleGoToStorePortal(selectedStoreForOrders)}
                  className="px-3 py-1.5 rounded-lg bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-black flex items-center gap-1.5 border-0 cursor-pointer shadow-xs transition-all active:scale-95"
                  title={`${selectedStoreForOrders.name} 점주포털 바로가기 (새 탭)`}
                >
                  <ExternalLink size={13} className="text-amber-400" />
                  <span className="hidden sm:inline">점주포털 바로가기</span>
                  <span className="sm:hidden">점주포털</span>
                </button>
                <button
                  onClick={() => setSelectedStoreForOrders(null)}
                  className="w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 text-[#0F172A] transition-all flex items-center justify-center border-0 cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#F8FAFC]">
              {(() => {
                // 내 직속 가맹점 또는 하위 파트너 가맹점 발주 내역을 모두 지원
                const storeSpecificOrders = (selectedStoreForOrders.orders && selectedStoreForOrders.orders.length > 0)
                  ? selectedStoreForOrders.orders
                  : [
                      ...(myOrders || []),
                      ...((subPartnerActivities?.orders as any[]) || []),
                    ].filter((o: any) => o.storeId === selectedStoreForOrders.id);

                if (storeSpecificOrders.length === 0) {
                  return (
                    <div className="py-16 text-center text-slate-400 text-xs font-bold">
                      해당 가맹점의 재료 주문 내역이 없습니다.
                    </div>
                  );
                }

                return (
                  <div className="space-y-3">
                    {storeSpecificOrders.map((ord: any) => {
                      const displayDoughBoxes = ord.doughBoxes ?? ord.pastryDoughBoxes ?? 0;
                      return (
                        <div
                          key={ord.id}
                          className="p-4 rounded-lg bg-white border border-neutral-200/90 shadow-2xs space-y-3"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 pb-2.5">
                            <div className="flex items-center gap-2.5">
                              <span className="text-xs font-black text-[#0F172A]">{ord.id}</span>
                              <span className="text-xs text-slate-400">{ord.date}</span>
                              {ord.partnerName && ord.partnerId !== currentPartner?.id && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 font-bold border border-purple-200">
                                  관리: {ord.partnerName}
                                </span>
                              )}
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
                              <span className="text-xs font-black text-[#0F172A] tabular-nums">
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
                                  <div className="text-slate-500 font-bold tabular-nums">
                                    {item.quantity}개 / 박스 · {(item.price * item.quantity).toLocaleString()}원
                                  </div>
                                </div>
                              ))}
                          </div>

                          {/* 합계 */}
                          <div className="flex items-center justify-between pt-1 text-xs font-bold text-slate-700 bg-amber-50/60 p-2.5 rounded-md border border-amber-100">
                            <span>패스트리 생지 합계: <strong className="text-amber-700 font-bold">{displayDoughBoxes}박스</strong></span>
                            <span>발생 파트너 수수료: <strong className="text-rose-600 font-bold text-sm tabular-nums">+{((ord.commission || displayDoughBoxes * 8000)).toLocaleString()}원</strong></span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-neutral-200 bg-white flex items-center justify-between gap-3">
              <button
                onClick={() => handleGoToStorePortal(selectedStoreForOrders)}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-xs rounded-lg transition-all border-0 cursor-pointer shadow-xs flex items-center gap-1.5 active:scale-95"
                title={`${selectedStoreForOrders.name} 점주포털 바로가기 (새 탭)`}
              >
                <ExternalLink size={14} />
                <span>[{selectedStoreForOrders.name}] 점주 포털 바로가기</span>
              </button>
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
                <p className="text-slate-500 font-bold">대상 년월: {selectedSettlement.yearMonth}</p>
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
                    <td className="p-2.5 border-r border-slate-300 text-right font-bold tabular-nums">
                      {selectedSettlement.boxCount} 박스
                    </td>
                    <td className="p-2.5 border-r border-slate-300 text-right tabular-nums">
                      {(selectedSettlement.commissionUnit || 8000).toLocaleString()}원
                    </td>
                    <td className="p-2.5 text-right font-black text-sm tabular-nums">
                      {(selectedSettlement.commissionAmount || 0).toLocaleString()}원
                    </td>
                  </tr>
                  <tr className="bg-slate-50 font-bold">
                    <td colSpan={3} className="p-2.5 border-r border-slate-300 text-right">
                      최종 실지급액
                    </td>
                    <td className="p-2.5 text-right font-black text-rose-600 text-base tabular-nums">
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
                <span className="text-[10px] text-slate-400">{selectedNotice.date}</span>
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

      {/* ==========================================
          MODAL 4: 상담 관리 메모 수정 모달
      ========================================== */}
      {editingMemoId && (
        <div 
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setEditingMemoId(null)}
        >
          <div 
            className="w-full max-w-lg bg-white border border-neutral-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-neutral-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700">
                  <MessageSquare size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">상담 내역 메모 작성</h3>
                  <p className="text-[11px] text-slate-500">고객과의 상담 진행 상황 및 특이사항을 기록하세요.</p>
                </div>
              </div>
              <button
                onClick={() => setEditingMemoId(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 border-0 cursor-pointer bg-transparent rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-3 bg-white">
              <textarea
                value={editingMemoText}
                onChange={(e) => setEditingMemoText(e.target.value)}
                placeholder="예: 3/7 1차 유선 상담 완료. 매장 평수 15평 샵인샵 희망. 익월 2차 미팅 예정."
                rows={5}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 leading-relaxed resize-none"
              />
              <p className="text-[11px] text-slate-400">
                * 작성된 메모는 파트너 관리자 화면에서만 확인 가능하며 안전하게 저장됩니다.
              </p>
            </div>

            <div className="p-4 border-t border-neutral-200 bg-slate-50 flex justify-end gap-2">
              <button
                onClick={() => setEditingMemoId(null)}
                className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                취소
              </button>
              <button
                onClick={handleSaveConsultationMemo}
                className="px-5 py-2 bg-[#FED422] hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl border-0 cursor-pointer shadow-xs"
              >
                메모 저장
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 📱 모바일 전용 하단 고정 네비게이션 바 */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200/90 px-1 py-1.5 flex items-center justify-around shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        {[
          { key: "dashboard", label: "대시보드", icon: LayoutDashboard },
          { key: "consultation", label: "상담관리", icon: MessageSquare, badge: partnerConsultations.length },
          { key: "stores", label: "가맹점", icon: Store, badge: myStores.length },
          { key: "radar", label: "상권레이더", icon: Crosshair },
          { key: "settlement", label: "정산", icon: CreditCard },
        ].map(({ key, label, icon: Icon, badge }) => {
          const isActive = currentMenu === key;
          return (
            <button
              key={key}
              onClick={() => setCurrentMenu(key)}
              className={`flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all relative border-0 bg-transparent cursor-pointer ${
                isActive ? "text-purple-700 font-black" : "text-slate-400 font-bold hover:text-slate-600"
              }`}
            >
              <div className="relative">
                <div
                  className={`w-9 h-7 rounded-lg flex items-center justify-center transition-all ${
                    isActive ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-950/20 scale-105" : ""
                  }`}
                >
                  <Icon size={18} />
                </div>
                {badge !== undefined && badge > 0 && (
                  <span className="absolute -top-1 -right-1.5 bg-rose-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                    {badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{label}</span>
            </button>
          );
        })}

        {/* 전체 메뉴 토글 버튼 */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="flex-1 flex flex-col items-center justify-center py-1 text-slate-400 font-bold hover:text-slate-600 rounded-xl transition-all border-0 bg-transparent cursor-pointer"
        >
          <div className="w-9 h-7 flex items-center justify-center">
            <Menu size={18} />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">전체메뉴</span>
        </button>
      </nav>
    </div>
  );
}
