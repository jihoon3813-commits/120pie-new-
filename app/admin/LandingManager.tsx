"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import {
  BarChart3,
  Calendar,
  Check,
  Copy,
  Edit,
  ExternalLink,
  Eye,
  Filter,
  Globe,
  Layers,
  MousePointerClick,
  PhoneCall,
  Plus,
  Rocket,
  Search,
  Sparkles,
  Trash2,
  TrendingUp,
  Users,
  X,
} from "lucide-react";

const BASE_ORIGIN = "https://120piecoffee.com";

export const AD_CHANNELS = [
  { value: "direct", label: "직접유입 / 기본", badgeClass: "bg-slate-100 text-slate-700 border-slate-200", barColor: "bg-slate-600" },
  { value: "naver", label: "네이버 (검색/블로그/카페)", badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200", barColor: "bg-emerald-500" },
  { value: "instagram", label: "인스타그램", badgeClass: "bg-pink-50 text-pink-700 border-pink-200", barColor: "bg-pink-500" },
  { value: "meta", label: "메타 (페북/인스타)", badgeClass: "bg-blue-50 text-blue-700 border-blue-200", barColor: "bg-blue-600" },
  { value: "daangn", label: "당근마켓", badgeClass: "bg-orange-50 text-orange-700 border-orange-200", barColor: "bg-orange-500" },
  { value: "kakao", label: "카카오톡 / 비즈보드", badgeClass: "bg-amber-50 text-amber-800 border-amber-200", barColor: "bg-amber-400" },
  { value: "youtube", label: "유튜브", badgeClass: "bg-red-50 text-red-700 border-red-200", barColor: "bg-red-500" },
  { value: "google", label: "구글 애즈", badgeClass: "bg-sky-50 text-sky-700 border-sky-200", barColor: "bg-sky-500" },
  { value: "tiktok", label: "틱톡", badgeClass: "bg-zinc-100 text-zinc-800 border-zinc-300", barColor: "bg-zinc-800" },
  { value: "sms", label: "문자 / 알림톡", badgeClass: "bg-indigo-50 text-indigo-700 border-indigo-200", barColor: "bg-indigo-500" },
  { value: "offline", label: "오프라인 / QR / 전단", badgeClass: "bg-teal-50 text-teal-700 border-teal-200", barColor: "bg-teal-500" },
  { value: "etc", label: "기타 채널", badgeClass: "bg-neutral-100 text-neutral-700 border-neutral-200", barColor: "bg-neutral-500" },
] as const;

const CHANNEL_MAP: Record<string, (typeof AD_CHANNELS)[number]> = Object.fromEntries(
  AD_CHANNELS.map((c) => [c.value, c])
);

function getChannelMeta(channel?: string) {
  return CHANNEL_MAP[channel || "direct"] || CHANNEL_MAP.etc;
}

function getKstDateString(d: Date): string {
  const kst = new Date(d.getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString().slice(0, 10);
}

function getDatesBetween(startStr: string, endStr: string): string[] {
  if (!startStr || !endStr) return [];
  const res: string[] = [];
  const cur = new Date(startStr + "T00:00:00");
  const end = new Date(endStr + "T00:00:00");
  let guard = 0;
  while (cur <= end && guard < 366) {
    const y = cur.getFullYear();
    const m = String(cur.getMonth() + 1).padStart(2, "0");
    const d = String(cur.getDate()).padStart(2, "0");
    res.push(`${y}-${m}-${d}`);
    cur.setDate(cur.getDate() + 1);
    guard++;
  }
  return res;
}

function getLandingPublicPath(slug: string): string {
  if (slug === "landing-ad") return "/landing-ad";
  return `/l/${slug}`;
}

function getLandingPublicUrl(slug: string, origin?: string): string {
  const base = origin || BASE_ORIGIN;
  return `${base}${getLandingPublicPath(slug)}`;
}

function deriveEventLandingSlug(ev: any): string | null {
  if (ev.landingSlug) return String(ev.landingSlug).toLowerCase();
  const p = String(ev.path || "");
  if (p === "/landing-ad" || p === "/ad") return "landing-ad";
  if (p.startsWith("/l/")) return p.slice(3).split("/")[0].toLowerCase() || null;
  return null;
}

function isMobileUserAgent(ua?: string): boolean {
  if (!ua) return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(ua);
}

interface LandingManagerProps {
  inquiries: any[];
  onTriggerToast: (msg: string) => void;
}

class LandingErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; errorMsg: string }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, errorMsg: "" };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, errorMsg: error?.message || "알 수 없는 오류" };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-white rounded-2xl border border-red-200 p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto font-black text-lg">
            !
          </div>
          <h3 className="text-base font-black text-slate-900">
            랜딩페이지 데이터를 불러오는 중 오류가 발생했습니다
          </h3>
          <p className="text-xs text-slate-500 max-w-lg mx-auto break-all">
            {this.state.errorMsg}
          </p>
          <p className="text-[11px] text-slate-400">
            Convex 백엔드 배포(`npx convex deploy` 또는 `npx convex dev`) 상태를 확인한 후 새로고침해 주세요.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-lg bg-[#0F172A] text-[#FED422] text-xs font-black cursor-pointer"
          >
            새로고침
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function LandingManager(props: LandingManagerProps) {
  return (
    <LandingErrorBoundary>
      <LandingManagerInner {...props} />
    </LandingErrorBoundary>
  );
}

function LandingManagerInner({ inquiries, onTriggerToast }: LandingManagerProps) {
  const rawLandingPages = useQuery(api.landingPages.list);
  const landingPages = rawLandingPages ?? [];
  const ensureDefaultBase = useMutation(api.landingPages.ensureDefaultBase);
  const createLanding = useMutation(api.landingPages.create);
  const cloneLanding = useMutation(api.landingPages.clone);
  const updateLanding = useMutation(api.landingPages.update);
  const toggleLandingActive = useMutation(api.landingPages.toggleActive);
  const removeLanding = useMutation(api.landingPages.remove);

  // Ensure default /landing-ad base record exists
  const [seeded, setSeeded] = useState(false);
  useEffect(() => {
    if (seeded) return;
    if (rawLandingPages !== undefined) {
      const hasBase = rawLandingPages.some((p: any) => p.slug === "landing-ad");
      if (!hasBase) {
        setSeeded(true);
        ensureDefaultBase().catch(() => {});
      } else {
        setSeeded(true);
      }
    }
  }, [rawLandingPages, seeded, ensureDefaultBase]);

  // Date range state
  const [datePreset, setDatePreset] = useState<string>("week");
  const [startDate, setStartDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 6);
    return getKstDateString(d);
  });
  const [endDate, setEndDate] = useState<string>(() => getKstDateString(new Date()));

  useEffect(() => {
    const now = new Date();
    if (datePreset === "today") {
      const s = getKstDateString(now);
      setStartDate(s);
      setEndDate(s);
    } else if (datePreset === "yesterday") {
      const y = new Date(now);
      y.setDate(y.getDate() - 1);
      const s = getKstDateString(y);
      setStartDate(s);
      setEndDate(s);
    } else if (datePreset === "week") {
      const w = new Date(now);
      w.setDate(w.getDate() - 6);
      setStartDate(getKstDateString(w));
      setEndDate(getKstDateString(now));
    } else if (datePreset === "month30") {
      const m = new Date(now);
      m.setDate(m.getDate() - 29);
      setStartDate(getKstDateString(m));
      setEndDate(getKstDateString(now));
    } else if (datePreset === "this_month") {
      const kstNow = new Date(now.getTime() + 9 * 60 * 60 * 1000);
      const y = kstNow.getUTCFullYear();
      const m = String(kstNow.getUTCMonth() + 1).padStart(2, "0");
      setStartDate(`${y}-${m}-01`);
      setEndDate(getKstDateString(now));
    } else if (datePreset === "prev_month") {
      const kstNow = new Date(now.getTime() + 9 * 60 * 60 * 1000);
      const firstPrev = new Date(Date.UTC(kstNow.getUTCFullYear(), kstNow.getUTCMonth() - 1, 1));
      const lastPrev = new Date(Date.UTC(kstNow.getUTCFullYear(), kstNow.getUTCMonth(), 0));
      setStartDate(firstPrev.toISOString().slice(0, 10));
      setEndDate(lastPrev.toISOString().slice(0, 10));
    } else if (datePreset === "all") {
      setStartDate("");
      setEndDate("");
    }
  }, [datePreset]);

  const analyticsEvents =
    useQuery(
      api.analytics.listEvents,
      startDate && endDate ? { startDate, endDate } : {}
    ) || [];

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [channelFilter, setChannelFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "base" | "clone">("all");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [cloneSource, setCloneSource] = useState<any | null>(null);
  const [editingLanding, setEditingLanding] = useState<any | null>(null);
  const [trackingDetailSlug, setTrackingDetailSlug] = useState<string | null>(null);

  // Form states for Create / Clone / Edit
  const [formTitle, setFormTitle] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formChannel, setFormChannel] = useState("naver");
  const [formCampaign, setFormCampaign] = useState("");
  const [formUtmSource, setFormUtmSource] = useState("");
  const [formUtmMedium, setFormUtmMedium] = useState("");
  const [formUtmCampaign, setFormUtmCampaign] = useState("");
  const [formCustomTitle, setFormCustomTitle] = useState("");
  const [formMemo, setFormMemo] = useState("");
  const [formIsActive, setFormIsActive] = useState(true);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const handleCopyLink = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedKey(key);
      onTriggerToast("추적 링크가 클립보드에 복사되었습니다.");
      setTimeout(() => setCopiedKey(null), 2000);
    });
  };

  // Compute per-landing stats within date range
  const statsBySlug = useMemo(() => {
    const map: Record<
      string,
      {
        visits: number;
        uniqueIps: Set<string>;
        conversions: number;
        phoneClicks: number;
        mobileCount: number;
        pcCount: number;
        events: any[];
        inquiries: any[];
      }
    > = {};

    const ensureEntry = (slug: string) => {
      if (!map[slug]) {
        map[slug] = {
          visits: 0,
          uniqueIps: new Set<string>(),
          conversions: 0,
          phoneClicks: 0,
          mobileCount: 0,
          pcCount: 0,
          events: [],
          inquiries: [],
        };
      }
      return map[slug];
    };

    for (const ev of analyticsEvents) {
      const slug = deriveEventLandingSlug(ev);
      if (!slug) continue;
      if (ev.visitorType === "admin") continue;
      const entry = ensureEntry(slug);
      entry.events.push(ev);

      if (ev.type === "visit") {
        entry.visits += 1;
        if (ev.ip) entry.uniqueIps.add(ev.ip);
        if (isMobileUserAgent(ev.userAgent)) entry.mobileCount += 1;
        else entry.pcCount += 1;
      } else if (ev.type === "phone_click") {
        entry.phoneClicks += 1;
      } else if (ev.type === "conversion") {
        entry.conversions += 1;
      }
    }

    // Also match inquiries by landingSlug within date range
    for (const inq of inquiries) {
      if (!inq.landingSlug) continue;
      const d = (inq.regDate || "").slice(0, 10);
      if (startDate && d && d < startDate) continue;
      if (endDate && d && d > endDate) continue;
      const slug = String(inq.landingSlug).toLowerCase();
      const entry = ensureEntry(slug);
      entry.inquiries.push(inq);
    }

    return map;
  }, [analyticsEvents, inquiries, startDate, endDate]);

  // Helper to get effective conversion count (max of inquiry docs and conversion events to avoid under/double counting)
  const getMetricsForSlug = (slug: string) => {
    const s = statsBySlug[slug];
    if (!s) {
      return {
        visits: 0,
        uv: 0,
        conversions: 0,
        phoneClicks: 0,
        cvr: 0,
        mobileCount: 0,
        pcCount: 0,
        events: [] as any[],
        inquiries: [] as any[],
      };
    }
    const conversions = Math.max(s.inquiries.length, s.conversions);
    const uv = s.uniqueIps.size;
    const cvr = s.visits > 0 ? (conversions / s.visits) * 100 : 0;
    return {
      visits: s.visits,
      uv,
      conversions,
      phoneClicks: s.phoneClicks,
      cvr,
      mobileCount: s.mobileCount,
      pcCount: s.pcCount,
      events: s.events,
      inquiries: s.inquiries,
    };
  };

  // Overall KPIs across all managed landing pages
  const overallKpi = useMemo(() => {
    let totalVisits = 0;
    const totalIps = new Set<string>();
    let totalConversions = 0;
    let totalPhoneClicks = 0;
    let bestPage: { title: string; slug: string; visits: number; conversions: number; cvr: number } | null = null;

    for (const lp of landingPages) {
      const m = getMetricsForSlug(lp.slug);
      const raw = statsBySlug[lp.slug];
      totalVisits += m.visits;
      totalConversions += m.conversions;
      totalPhoneClicks += m.phoneClicks;
      if (raw) {
        raw.uniqueIps.forEach((ip) => totalIps.add(ip));
      }
      if (
        !bestPage ||
        m.conversions > bestPage.conversions ||
        (m.conversions === bestPage.conversions && m.visits > bestPage.visits)
      ) {
        if (m.visits > 0 || m.conversions > 0) {
          bestPage = {
            title: lp.title,
            slug: lp.slug,
            visits: m.visits,
            conversions: m.conversions,
            cvr: m.cvr,
          };
        }
      }
    }

    const avgCvr = totalVisits > 0 ? (totalConversions / totalVisits) * 100 : 0;
    return {
      totalPages: landingPages.length,
      baseCount: landingPages.filter((p: any) => p.isBase).length,
      cloneCount: landingPages.filter((p: any) => !p.isBase).length,
      activeCount: landingPages.filter((p: any) => p.isActive).length,
      totalVisits,
      totalUv: totalIps.size,
      totalConversions,
      totalPhoneClicks,
      avgCvr,
      bestPage,
    };
  }, [landingPages, statsBySlug]);

  // Channel comparison aggregation
  const channelSummary = useMemo(() => {
    const byChannel: Record<
      string,
      { channel: string; pages: number; visits: number; uv: number; conversions: number; phoneClicks: number }
    > = {};

    for (const lp of landingPages) {
      const ch = lp.channel || "direct";
      const m = getMetricsForSlug(lp.slug);
      if (!byChannel[ch]) {
        byChannel[ch] = { channel: ch, pages: 0, visits: 0, uv: 0, conversions: 0, phoneClicks: 0 };
      }
      byChannel[ch].pages += 1;
      byChannel[ch].visits += m.visits;
      byChannel[ch].uv += m.uv;
      byChannel[ch].conversions += m.conversions;
      byChannel[ch].phoneClicks += m.phoneClicks;
    }

    return Object.values(byChannel).sort((a, b) => b.visits - a.visits || b.conversions - a.conversions);
  }, [landingPages, statsBySlug]);

  // Filtered landing pages
  const filteredPages = useMemo(() => {
    return landingPages
      .filter((lp: any) => {
        if (typeFilter === "base" && !lp.isBase) return false;
        if (typeFilter === "clone" && lp.isBase) return false;
        if (channelFilter !== "all" && lp.channel !== channelFilter) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.trim().toLowerCase();
          const match =
            lp.title.toLowerCase().includes(q) ||
            lp.slug.toLowerCase().includes(q) ||
            (lp.campaignName || "").toLowerCase().includes(q) ||
            (lp.memo || "").toLowerCase().includes(q);
          if (!match) return false;
        }
        return true;
      })
      .sort((a: any, b: any) => {
        // Base pages first, then newest
        if (a.isBase !== b.isBase) return a.isBase ? -1 : 1;
        return (b._creationTime || 0) - (a._creationTime || 0);
      });
  }, [landingPages, typeFilter, channelFilter, searchQuery]);

  // Map id -> title for parent lookup
  const pageById = useMemo(() => {
    const m: Record<string, any> = {};
    for (const lp of landingPages) {
      m[String(lp._id)] = lp;
    }
    return m;
  }, [landingPages]);

  const openCreateModal = () => {
    setFormTitle("");
    setFormSlug("");
    setFormChannel("direct");
    setFormCampaign("");
    setFormUtmSource("direct");
    setFormUtmMedium("landing");
    setFormUtmCampaign("");
    setFormCustomTitle("우리 동네 디저트, 내가 먼저 | 120PIE");
    setFormMemo("");
    setFormIsActive(true);
    setFormError("");
    setIsCreateModalOpen(true);
  };

  const openCloneModal = (source: any) => {
    const defaultChannel = source.channel === "direct" ? "instagram" : source.channel;
    const suffix = new Date().toISOString().slice(5, 10).replace("-", "");
    const suggestedSlug = `${source.slug === "landing-ad" ? "ad" : source.slug}-${defaultChannel}-${suffix}`;
    const chLabel = getChannelMeta(defaultChannel).label.split(" ")[0];

    setCloneSource(source);
    setFormTitle(`[${chLabel}] ${source.title.replace(/^\[.*?\]\s*/, "")}`);
    setFormSlug(suggestedSlug);
    setFormChannel(defaultChannel);
    setFormCampaign("");
    setFormUtmSource(defaultChannel);
    setFormUtmMedium("cpc");
    setFormUtmCampaign(suggestedSlug);
    setFormCustomTitle(source.customTitle || "");
    setFormMemo("");
    setFormError("");
  };

  const openEditModal = (lp: any) => {
    setEditingLanding(lp);
    setFormTitle(lp.title);
    setFormSlug(lp.slug);
    setFormChannel(lp.channel || "direct");
    setFormCampaign(lp.campaignName || "");
    setFormUtmSource(lp.utmSource || "");
    setFormUtmMedium(lp.utmMedium || "");
    setFormUtmCampaign(lp.utmCampaign || "");
    setFormCustomTitle(lp.customTitle || "");
    setFormMemo(lp.memo || "");
    setFormIsActive(lp.isActive);
    setFormError("");
  };

  const handleChannelSelectInClone = (nextChannel: string) => {
    setFormChannel(nextChannel);
    setFormUtmSource(nextChannel);
    if (cloneSource) {
      const suffix = new Date().toISOString().slice(5, 10).replace("-", "");
      const basePrefix = cloneSource.slug === "landing-ad" ? "ad" : cloneSource.slug;
      const nextSlug = `${basePrefix}-${nextChannel}-${suffix}`;
      setFormSlug(nextSlug);
      setFormUtmCampaign(nextSlug);
      const chLabel = getChannelMeta(nextChannel).label.split(" ")[0];
      setFormTitle(`[${chLabel}] ${cloneSource.title.replace(/^\[.*?\]\s*/, "")}`);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formSlug.trim()) {
      setFormError("랜딩페이지 이름과 URL 슬러그를 입력해 주세요.");
      return;
    }
    setFormSubmitting(true);
    setFormError("");
    try {
      await createLanding({
        slug: formSlug,
        title: formTitle,
        templateKey: "landing-ad",
        isBase: true,
        channel: formChannel,
        campaignName: formCampaign || undefined,
        utmSource: formUtmSource || undefined,
        utmMedium: formUtmMedium || undefined,
        utmCampaign: formUtmCampaign || undefined,
        customTitle: formCustomTitle || undefined,
        memo: formMemo || undefined,
        isActive: formIsActive,
      });
      setIsCreateModalOpen(false);
      onTriggerToast("새 기본 랜딩페이지가 생성되었습니다.");
    } catch (err: any) {
      setFormError(err?.message || "생성 중 오류가 발생했습니다.");
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleCloneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cloneSource) return;
    if (!formTitle.trim() || !formSlug.trim()) {
      setFormError("복제 랜딩페이지 이름과 URL 슬러그를 입력해 주세요.");
      return;
    }
    setFormSubmitting(true);
    setFormError("");
    try {
      await cloneLanding({
        sourceId: cloneSource._id as Id<"landingPages">,
        slug: formSlug,
        title: formTitle,
        channel: formChannel,
        campaignName: formCampaign || undefined,
        utmSource: formUtmSource || undefined,
        utmMedium: formUtmMedium || undefined,
        utmCampaign: formUtmCampaign || undefined,
        customTitle: formCustomTitle || undefined,
        memo: formMemo || undefined,
      });
      setCloneSource(null);
      onTriggerToast("광고 채널별 복제 랜딩페이지가 생성되었습니다.");
    } catch (err: any) {
      setFormError(err?.message || "복제 중 오류가 발생했습니다.");
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLanding) return;
    if (!formTitle.trim()) {
      setFormError("랜딩페이지 이름을 입력해 주세요.");
      return;
    }
    setFormSubmitting(true);
    setFormError("");
    try {
      await updateLanding({
        id: editingLanding._id as Id<"landingPages">,
        title: formTitle,
        channel: formChannel,
        campaignName: formCampaign,
        utmSource: formUtmSource,
        utmMedium: formUtmMedium,
        utmCampaign: formUtmCampaign,
        customTitle: formCustomTitle,
        memo: formMemo,
        isActive: formIsActive,
      });
      setEditingLanding(null);
      onTriggerToast("랜딩페이지 정보가 수정되었습니다.");
    } catch (err: any) {
      setFormError(err?.message || "수정 중 오류가 발생했습니다.");
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDelete = async (lp: any) => {
    if (lp.slug === "landing-ad") {
      alert("기본 광고 랜딩페이지(/landing-ad)는 삭제할 수 없습니다.");
      return;
    }
    if (!confirm(`'${lp.title}' 랜딩페이지를 삭제하시겠습니까?\n삭제 후 해당 링크(/l/${lp.slug})는 접속할 수 없게 됩니다.`)) {
      return;
    }
    try {
      await removeLanding({ id: lp._id as Id<"landingPages"> });
      onTriggerToast("랜딩페이지가 삭제되었습니다.");
    } catch (err: any) {
      alert(err?.message || "삭제 중 오류가 발생했습니다.");
    }
  };

  // Detail modal data
  const detailLanding = useMemo(() => {
    if (!trackingDetailSlug) return null;
    return landingPages.find((p: any) => p.slug === trackingDetailSlug) || null;
  }, [trackingDetailSlug, landingPages]);

  const detailDailyRows = useMemo(() => {
    if (!trackingDetailSlug) return [];
    const m = getMetricsForSlug(trackingDetailSlug);
    const dateSet = new Set<string>();
    const datesFromRange =
      startDate && endDate ? getDatesBetween(startDate, endDate) : [];
    datesFromRange.forEach((d) => dateSet.add(d));
    m.events.forEach((ev: any) => {
      if (ev.date) dateSet.add(ev.date);
    });
    m.inquiries.forEach((inq: any) => {
      if (inq.regDate) dateSet.add(inq.regDate.slice(0, 10));
    });

    const sortedDates = Array.from(dateSet).sort((a, b) => b.localeCompare(a));
    return sortedDates.map((date) => {
      const dayEvents = m.events.filter((ev: any) => ev.date === date);
      const visits = dayEvents.filter((ev: any) => ev.type === "visit").length;
      const uv = new Set(
        dayEvents.filter((ev: any) => ev.type === "visit" && ev.ip).map((ev: any) => ev.ip)
      ).size;
      const phoneClicks = dayEvents.filter((ev: any) => ev.type === "phone_click").length;
      const convEvents = dayEvents.filter((ev: any) => ev.type === "conversion").length;
      const inqCount = m.inquiries.filter((inq: any) => (inq.regDate || "").slice(0, 10) === date).length;
      const conversions = Math.max(convEvents, inqCount);
      const cvr = visits > 0 ? (conversions / visits) * 100 : 0;
      return { date, visits, uv, conversions, phoneClicks, cvr };
    });
  }, [trackingDetailSlug, statsBySlug, startDate, endDate]);

  const maxDetailVisits = useMemo(
    () => Math.max(1, ...detailDailyRows.map((r) => r.visits)),
    [detailDailyRows]
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] rounded-2xl p-6 text-white shadow-lg flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#FED422]/15 text-[#FED422] text-[11px] font-black">
            <Rocket size={13} />
            <span>AD LANDING &amp; CHANNEL TRACKER</span>
          </div>
          <h2 className="text-xl font-black tracking-tight">
            랜딩페이지 관리 및 광고채널별 성과 추적
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
            기본 랜딩페이지(<code className="text-[#FED422] font-mono">/landing-ad</code>)를 기준으로
            광고 채널(네이버, 인스타, 당근, 카카오 등)별 복제 링크를 생성하고, 기간별 방문자수·순방문·상담전환율·전화클릭을 실시간 추적합니다.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <a
            href="/landing-ad"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold inline-flex items-center gap-1.5 transition-all"
          >
            <ExternalLink size={14} />
            <span>기본 랜딩 열기</span>
          </a>
          <button
            onClick={openCreateModal}
            className="px-4 py-2.5 rounded-xl bg-[#FED422] hover:brightness-95 text-[#0F172A] text-xs font-black inline-flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
          >
            <Plus size={15} />
            <span>새 기본 랜딩 추가</span>
          </button>
        </div>
      </div>

      {/* Date Range & Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-3">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-black text-slate-500 mr-1 inline-flex items-center gap-1">
              <Calendar size={13} className="text-[#FF6B4A]" />
              추적 기간:
            </span>
            {[
              { id: "today", label: "오늘" },
              { id: "yesterday", label: "어제" },
              { id: "week", label: "최근 7일" },
              { id: "month30", label: "최근 30일" },
              { id: "this_month", label: "이번 달" },
              { id: "prev_month", label: "지난 달" },
              { id: "all", label: "전체 기간" },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setDatePreset(p.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  datePreset === p.id
                    ? "bg-[#0F172A] text-[#FED422] shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setDatePreset("custom");
                setStartDate(e.target.value);
              }}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700"
            />
            <span className="text-xs text-slate-400 font-bold">~</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setDatePreset("custom");
                setEndDate(e.target.value);
              }}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700"
            />
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-lg bg-slate-100 p-1">
              {[
                { id: "all", label: "전체" },
                { id: "base", label: "기본 랜딩" },
                { id: "clone", label: "채널 복제 랜딩" },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTypeFilter(t.id as any)}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                    typeFilter === t.id
                      ? "bg-white text-[#0F172A] shadow-xs"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="relative">
              <Filter size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <select
                value={channelFilter}
                onChange={(e) => setChannelFilter(e.target.value)}
                className="pl-8 pr-6 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-700"
              >
                <option value="all">전체 광고 채널</option>
                {AD_CHANNELS.map((ch) => (
                  <option key={ch.value} value={ch.value}>
                    {ch.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="relative w-full md:w-72">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="랜딩명, 슬러그, 캠페인명 검색..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#0F172A]"
            />
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">운영 랜딩페이지</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <Layers size={16} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#0F172A]">{overallKpi.totalPages}개</span>
            <span className="text-xs font-bold text-emerald-600">활성 {overallKpi.activeCount}개</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400 font-medium">
            기본 {overallKpi.baseCount}개 · 채널 복제 {overallKpi.cloneCount}개
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">기간 내 총 방문 (PV / UV)</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users size={16} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#0F172A]">
              {overallKpi.totalVisits.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-blue-600">
              순방문 {overallKpi.totalUv.toLocaleString()}명
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400 font-medium">
            {startDate && endDate ? `${startDate} ~ ${endDate}` : "전체 누적 기준"}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">상담 신청 전환 (CVR)</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#0F172A]">
              {overallKpi.totalConversions.toLocaleString()}건
            </span>
            <span className="text-xs font-black text-[#FF6B4A]">
              전환율 {overallKpi.avgCvr.toFixed(1)}%
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400 font-medium">
            전화 버튼 클릭 {overallKpi.totalPhoneClicks.toLocaleString()}회
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">최고 성과 랜딩</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Sparkles size={16} />
            </div>
          </div>
          {overallKpi.bestPage ? (
            <>
              <div className="mt-3 text-sm font-black text-[#0F172A] truncate">
                {overallKpi.bestPage.title}
              </div>
              <p className="mt-1 text-[11px] text-emerald-600 font-bold">
                방문 {overallKpi.bestPage.visits.toLocaleString()} · 전환{" "}
                {overallKpi.bestPage.conversions}건 ({overallKpi.bestPage.cvr.toFixed(1)}%)
              </p>
            </>
          ) : (
            <div className="mt-3 text-xs font-bold text-slate-400">
              선택 기간 내 집계 데이터 없음
            </div>
          )}
        </div>
      </div>

      {/* Channel Performance Comparison */}
      {channelSummary.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
                <BarChart3 size={16} className="text-[#FF6B4A]" />
                <span>광고 채널별 성과 비교</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                채널별 유입 방문수 및 상담 전환율을 한눈에 비교해 광고 효율이 높은 매체를 파악하세요.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {channelSummary.map((ch) => {
              const meta = getChannelMeta(ch.channel);
              const cvr = ch.visits > 0 ? (ch.conversions / ch.visits) * 100 : 0;
              const maxVisits = Math.max(1, channelSummary[0]?.visits || 1);
              const widthPct = Math.min(100, Math.round((ch.visits / maxVisits) * 100));
              return (
                <div
                  key={ch.channel}
                  className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-md border text-[11px] font-black ${meta.badgeClass}`}
                    >
                      {meta.label}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400">
                      페이지 {ch.pages}개
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${meta.barColor}`}
                      style={{ width: `${ch.visits > 0 ? Math.max(6, widthPct) : 0}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700">
                      방문 {ch.visits.toLocaleString()}{" "}
                      <span className="text-slate-400 font-medium">(UV {ch.uv})</span>
                    </span>
                    <span className="font-black text-[#0F172A]">
                      전환 {ch.conversions}건{" "}
                      <span className="text-[#FF6B4A]">({cvr.toFixed(1)}%)</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Landing Pages Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
            <Globe size={16} className="text-[#FF6B4A]" />
            <span>랜딩페이지 목록 ({filteredPages.length}건)</span>
          </h3>
          <span className="text-[11px] text-slate-400 font-medium">
            &quot;복제하기&quot;를 눌러 채널별 전용 추적 링크를 무제한 생성하세요
          </span>
        </div>

        {filteredPages.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <p className="text-sm font-bold text-slate-500">
              조건에 맞는 랜딩페이지가 없습니다.
            </p>
            <button
              onClick={openCreateModal}
              className="px-4 py-2 rounded-lg bg-[#0F172A] text-[#FED422] text-xs font-black cursor-pointer"
            >
              + 새 랜딩페이지 만들기
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-black text-slate-500 uppercase">
                  <th className="py-3 px-4">구분 / 랜딩페이지명</th>
                  <th className="py-3 px-4">광고 채널 · 캠페인</th>
                  <th className="py-3 px-4">추적 링크 (URL)</th>
                  <th className="py-3 px-4 text-right">방문(PV)</th>
                  <th className="py-3 px-4 text-right">순방문(UV)</th>
                  <th className="py-3 px-4 text-right">상담전환</th>
                  <th className="py-3 px-4 text-right">전환율</th>
                  <th className="py-3 px-4 text-right">전화클릭</th>
                  <th className="py-3 px-4 text-center">상태</th>
                  <th className="py-3 px-4 text-right">관리 / 복제</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredPages.map((lp: any) => {
                  const m = getMetricsForSlug(lp.slug);
                  const chMeta = getChannelMeta(lp.channel);
                  const parentDoc = lp.parentId ? pageById[String(lp.parentId)] : null;
                  const publicPath = getLandingPublicPath(lp.slug);
                  const publicUrl = getLandingPublicUrl(lp.slug);

                  return (
                    <tr
                      key={lp._id}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      <td className="py-3.5 px-4 max-w-[260px]">
                        <div className="flex items-center gap-1.5 mb-1">
                          {lp.isBase ? (
                            <span className="px-2 py-0.5 rounded-md bg-[#0F172A] text-[#FED422] text-[10px] font-black">
                              기본
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-black">
                              복제
                            </span>
                          )}
                          <span className="font-black text-[#0F172A] truncate">
                            {lp.title}
                          </span>
                        </div>
                        {parentDoc && (
                          <p className="text-[10px] text-slate-400 truncate">
                            원본: {parentDoc.title}
                          </p>
                        )}
                        {lp.memo && (
                          <p className="text-[10px] text-slate-400 truncate mt-0.5">
                            {lp.memo}
                          </p>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-md border text-[11px] font-bold ${chMeta.badgeClass}`}
                        >
                          {chMeta.label}
                        </span>
                        {lp.campaignName && (
                          <div className="text-[11px] text-slate-500 font-medium mt-1 truncate max-w-[160px]">
                            {lp.campaignName}
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <code className="px-2 py-1 rounded bg-slate-100 text-slate-700 font-mono text-[11px]">
                            {publicPath}
                          </code>
                          <button
                            onClick={() => handleCopyLink(publicUrl, `url-${lp._id}`)}
                            className="p-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 cursor-pointer"
                            title="전체 URL 복사"
                          >
                            {copiedKey === `url-${lp._id}` ? (
                              <Check size={12} className="text-emerald-600" />
                            ) : (
                              <Copy size={12} />
                            )}
                          </button>
                          <a
                            href={publicPath}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-600"
                            title="새 탭에서 열기"
                          >
                            <ExternalLink size={12} />
                          </a>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right font-black text-[#0F172A]">
                        {m.visits.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-slate-600">
                        {m.uv.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-right font-black text-emerald-600">
                        {m.conversions.toLocaleString()}건
                      </td>
                      <td className="py-3.5 px-4 text-right font-black text-[#FF6B4A]">
                        {m.cvr.toFixed(1)}%
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-slate-600">
                        {m.phoneClicks.toLocaleString()}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={async () => {
                            await toggleLandingActive({ id: lp._id });
                            onTriggerToast(
                              lp.isActive
                                ? "랜딩페이지가 일시 중지되었습니다."
                                : "랜딩페이지가 활성화되었습니다."
                            );
                          }}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-black cursor-pointer transition-all ${
                            lp.isActive
                              ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                              : "bg-slate-200 text-slate-500 hover:bg-slate-300"
                          }`}
                        >
                          {lp.isActive ? "운영중" : "중지됨"}
                        </button>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => openCloneModal(lp)}
                            className="px-2.5 py-1.5 rounded-lg bg-[#FED422] hover:brightness-95 text-[#0F172A] text-[11px] font-black inline-flex items-center gap-1 cursor-pointer"
                            title="이 랜딩페이지를 복제해 채널별 링크 생성"
                          >
                            <Copy size={12} />
                            <span>복제</span>
                          </button>
                          <button
                            onClick={() => setTrackingDetailSlug(lp.slug)}
                            className="px-2.5 py-1.5 rounded-lg bg-[#0F172A] hover:bg-slate-800 text-white text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer"
                            title="기간별 광고효과 추적 상세"
                          >
                            <BarChart3 size={12} />
                            <span>추적</span>
                          </button>
                          <button
                            onClick={() => openEditModal(lp)}
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 cursor-pointer"
                            title="설정 수정"
                          >
                            <Edit size={13} />
                          </button>
                          {lp.slug !== "landing-ad" && (
                            <button
                              onClick={() => handleDelete(lp)}
                              className="p-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-red-500 cursor-pointer"
                              title="삭제"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Base Landing Modal */}
      {isCreateModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsCreateModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-[#0F172A]">새 기본 랜딩페이지 만들기</h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreateSubmit} className="space-y-3.5 text-xs">
              {formError && (
                <div className="p-3 rounded-lg bg-red-50 text-red-600 font-bold">{formError}</div>
              )}
              <div>
                <label className="block font-black text-slate-700 mb-1">랜딩페이지 관리명 *</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="예: 120PIE 샵인샵 겨울 시즌 기본 랜딩"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 font-medium"
                  required
                />
              </div>
              <div>
                <label className="block font-black text-slate-700 mb-1">
                  URL 슬러그 * <span className="text-slate-400 font-normal">(영문 소문자, 숫자, 하이픈)</span>
                </label>
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400 font-mono text-[11px]">/l/</span>
                  <input
                    type="text"
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value.toLowerCase())}
                    placeholder="예: winter-base"
                    className="flex-1 px-3 py-2 rounded-lg border border-slate-200 font-mono"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-black text-slate-700 mb-1">기본 채널</label>
                  <select
                    value={formChannel}
                    onChange={(e) => setFormChannel(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 font-bold"
                  >
                    {AD_CHANNELS.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-black text-slate-700 mb-1">캠페인명</label>
                  <input
                    type="text"
                    value={formCampaign}
                    onChange={(e) => setFormCampaign(e.target.value)}
                    placeholder="예: 겨울 프로모션"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200"
                  />
                </div>
              </div>
              <div>
                <label className="block font-black text-slate-700 mb-1">메모</label>
                <textarea
                  value={formMemo}
                  onChange={(e) => setFormMemo(e.target.value)}
                  rows={2}
                  placeholder="운영 목적이나 특이사항 메모"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-600 font-bold cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-5 py-2 rounded-lg bg-[#0F172A] text-[#FED422] font-black cursor-pointer disabled:opacity-50"
                >
                  {formSubmitting ? "생성 중..." : "생성하기"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Clone Modal */}
      {cloneSource && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setCloneSource(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-[#0F172A]">광고 채널별 랜딩페이지 복제</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  원본: <strong className="text-slate-700">{cloneSource.title}</strong>
                </p>
              </div>
              <button
                onClick={() => setCloneSource(null)}
                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCloneSubmit} className="space-y-3.5 text-xs">
              {formError && (
                <div className="p-3 rounded-lg bg-red-50 text-red-600 font-bold">{formError}</div>
              )}
              <div>
                <label className="block font-black text-slate-700 mb-1">광고 채널 선택 *</label>
                <select
                  value={formChannel}
                  onChange={(e) => handleChannelSelectInClone(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 font-bold"
                >
                  {AD_CHANNELS.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-black text-slate-700 mb-1">복제 페이지 관리명 *</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="예: [인스타] 카페사장님 피드 광고 1차"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 font-medium"
                  required
                />
              </div>
              <div>
                <label className="block font-black text-slate-700 mb-1">전용 추적 URL 슬러그 *</label>
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400 font-mono text-[11px]">{BASE_ORIGIN}/l/</span>
                  <input
                    type="text"
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value.toLowerCase())}
                    className="flex-1 px-3 py-2 rounded-lg border border-slate-200 font-mono"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-slate-600 mb-1">utm_source</label>
                  <input
                    type="text"
                    value={formUtmSource}
                    onChange={(e) => setFormUtmSource(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-1">utm_medium</label>
                  <input
                    type="text"
                    value={formUtmMedium}
                    onChange={(e) => setFormUtmMedium(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-1">utm_campaign</label>
                  <input
                    type="text"
                    value={formUtmCampaign}
                    onChange={(e) => setFormUtmCampaign(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 font-mono text-[11px]"
                  />
                </div>
              </div>
              <div>
                <label className="block font-black text-slate-700 mb-1">캠페인명 / 소재 메모</label>
                <input
                  type="text"
                  value={formCampaign}
                  onChange={(e) => setFormCampaign(e.target.value)}
                  placeholder="예: 11월 서울/경기 카페 타겟 릴스 소재 A"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCloneSource(null)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-600 font-bold cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-5 py-2 rounded-lg bg-[#FED422] text-[#0F172A] font-black cursor-pointer disabled:opacity-50"
                >
                  {formSubmitting ? "복제 중..." : "채널 전용 링크 생성"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingLanding && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setEditingLanding(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-[#0F172A]">랜딩페이지 설정 수정</h3>
              <button
                onClick={() => setEditingLanding(null)}
                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-3.5 text-xs">
              {formError && (
                <div className="p-3 rounded-lg bg-red-50 text-red-600 font-bold">{formError}</div>
              )}
              <div>
                <label className="block font-black text-slate-700 mb-1">랜딩페이지 관리명 *</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 font-medium"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-black text-slate-700 mb-1">광고 채널</label>
                  <select
                    value={formChannel}
                    onChange={(e) => setFormChannel(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 font-bold"
                  >
                    {AD_CHANNELS.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-black text-slate-700 mb-1">캠페인명</label>
                  <input
                    type="text"
                    value={formCampaign}
                    onChange={(e) => setFormCampaign(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200"
                  />
                </div>
              </div>
              <div>
                <label className="block font-black text-slate-700 mb-1">브라우저 탭 제목 (커스텀)</label>
                <input
                  type="text"
                  value={formCustomTitle}
                  onChange={(e) => setFormCustomTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200"
                />
              </div>
              <div>
                <label className="block font-black text-slate-700 mb-1">메모</label>
                <textarea
                  value={formMemo}
                  onChange={(e) => setFormMemo(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200"
                />
              </div>
              <label className="inline-flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                <input
                  type="checkbox"
                  checked={formIsActive}
                  onChange={(e) => setFormIsActive(e.target.checked)}
                />
                <span>페이지 활성화 (체크 해제 시 접속 중지 안내 표시)</span>
              </label>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingLanding(null)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-600 font-bold cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-5 py-2 rounded-lg bg-[#0F172A] text-[#FED422] font-black cursor-pointer disabled:opacity-50"
                >
                  {formSubmitting ? "저장 중..." : "저장하기"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tracking Detail Modal */}
      {trackingDetailSlug && detailLanding && (
        <div
          className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setTrackingDetailSlug(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const m = getMetricsForSlug(detailLanding.slug);
              const chMeta = getChannelMeta(detailLanding.channel);
              const totalDevice = m.mobileCount + m.pcCount;
              const mobilePct = totalDevice > 0 ? Math.round((m.mobileCount / totalDevice) * 100) : 0;

              return (
                <>
                  <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`px-2 py-0.5 rounded-md border text-[11px] font-black ${chMeta.badgeClass}`}
                        >
                          {chMeta.label}
                        </span>
                        <code className="text-[11px] font-mono text-slate-500">
                          {getLandingPublicPath(detailLanding.slug)}
                        </code>
                      </div>
                      <h3 className="text-lg font-black text-[#0F172A]">{detailLanding.title}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        조회 기간: {startDate && endDate ? `${startDate} ~ ${endDate}` : "전체 누적"}
                      </p>
                    </div>
                    <button
                      onClick={() => setTrackingDetailSlug(null)}
                      className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {/* Detail KPIs */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                      <div className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                        <Eye size={12} /> 총 방문(PV)
                      </div>
                      <div className="text-xl font-black text-[#0F172A] mt-1">
                        {m.visits.toLocaleString()}
                      </div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                      <div className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                        <Users size={12} /> 순방문(UV)
                      </div>
                      <div className="text-xl font-black text-blue-600 mt-1">
                        {m.uv.toLocaleString()}
                      </div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                      <div className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                        <MousePointerClick size={12} /> 상담 전환
                      </div>
                      <div className="text-xl font-black text-emerald-600 mt-1">
                        {m.conversions.toLocaleString()}건
                      </div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                      <div className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                        <TrendingUp size={12} /> 전환율(CVR)
                      </div>
                      <div className="text-xl font-black text-[#FF6B4A] mt-1">
                        {m.cvr.toFixed(1)}%
                      </div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                      <div className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                        <PhoneCall size={12} /> 전화 클릭
                      </div>
                      <div className="text-xl font-black text-slate-700 mt-1">
                        {m.phoneClicks.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Device Ratio */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="text-xs font-black text-slate-700">
                      접속 기기 비율: 모바일 {mobilePct}% ({m.mobileCount}명) · PC{" "}
                      {totalDevice > 0 ? 100 - mobilePct : 0}% ({m.pcCount}명)
                    </div>
                    <div className="w-full sm:w-64 h-2.5 rounded-full bg-slate-200 overflow-hidden flex">
                      <div className="bg-[#0F172A] h-full" style={{ width: `${mobilePct}%` }} />
                      <div
                        className="bg-[#FED422] h-full"
                        style={{ width: `${totalDevice > 0 ? 100 - mobilePct : 0}%` }}
                      />
                    </div>
                  </div>

                  {/* Daily Breakdown Table + Bar */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 text-xs font-black text-[#0F172A]">
                      기간별 일자별 추이 ({detailDailyRows.length}일)
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      <table className="w-full text-xs text-left border-collapse">
                        <thead className="bg-white sticky top-0 border-b border-slate-100 text-[11px] text-slate-500">
                          <tr>
                            <th className="py-2.5 px-4">날짜</th>
                            <th className="py-2.5 px-4">방문 추이</th>
                            <th className="py-2.5 px-4 text-right">방문(PV)</th>
                            <th className="py-2.5 px-4 text-right">순방문(UV)</th>
                            <th className="py-2.5 px-4 text-right">상담전환</th>
                            <th className="py-2.5 px-4 text-right">전환율</th>
                            <th className="py-2.5 px-4 text-right">전화클릭</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {detailDailyRows.map((row) => (
                            <tr key={row.date} className="hover:bg-slate-50">
                              <td className="py-2 px-4 font-mono font-bold text-slate-700">
                                {row.date}
                              </td>
                              <td className="py-2 px-4 w-40">
                                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                                  <div
                                    className="h-full bg-[#FF6B4A] rounded-full"
                                    style={{
                                      width: `${
                                        row.visits > 0
                                          ? Math.max(6, Math.round((row.visits / maxDetailVisits) * 100))
                                          : 0
                                      }%`,
                                    }}
                                  />
                                </div>
                              </td>
                              <td className="py-2 px-4 text-right font-black text-[#0F172A]">
                                {row.visits}
                              </td>
                              <td className="py-2 px-4 text-right font-bold text-slate-600">
                                {row.uv}
                              </td>
                              <td className="py-2 px-4 text-right font-black text-emerald-600">
                                {row.conversions}건
                              </td>
                              <td className="py-2 px-4 text-right font-bold text-[#FF6B4A]">
                                {row.cvr.toFixed(1)}%
                              </td>
                              <td className="py-2 px-4 text-right text-slate-600">
                                {row.phoneClicks}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Inquiries captured through this landing */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 text-xs font-black text-[#0F172A]">
                      이 랜딩을 통해 접수된 상담 신청 내역 ({m.inquiries.length}건)
                    </div>
                    {m.inquiries.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-400">
                        선택한 기간 내 접수된 상담 신청이 없습니다.
                      </div>
                    ) : (
                      <div className="max-h-52 overflow-y-auto">
                        <table className="w-full text-xs text-left border-collapse">
                          <thead className="bg-white sticky top-0 border-b border-slate-100 text-[11px] text-slate-500">
                            <tr>
                              <th className="py-2 px-4">접수일</th>
                              <th className="py-2 px-4">성함</th>
                              <th className="py-2 px-4">연락처</th>
                              <th className="py-2 px-4">희망지역</th>
                              <th className="py-2 px-4">매장상황</th>
                              <th className="py-2 px-4">상태</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {m.inquiries.map((inq: any) => (
                              <tr key={inq._id} className="hover:bg-slate-50">
                                <td className="py-2 px-4 font-mono text-slate-500">{inq.regDate}</td>
                                <td className="py-2 px-4 font-bold text-[#0F172A]">{inq.name}</td>
                                <td className="py-2 px-4 font-mono text-slate-700">{inq.phone}</td>
                                <td className="py-2 px-4 text-slate-700">
                                  {inq.existingStoreName || "-"}
                                </td>
                                <td className="py-2 px-4 text-slate-600">{inq.storeType}</td>
                                <td className="py-2 px-4">
                                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold">
                                    {inq.status || "대기"}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
