"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import LandingV6Client from "@/components/landing-v6/LandingV6Client";
import { Phone, CheckCircle2, ShieldCheck, Sparkles, Building2 } from "lucide-react";

const RESERVED_PATHS = new Set([
  "admin",
  "api",
  "brand",
  "contract",
  "costs",
  "faq",
  "franchise",
  "gateway",
  "login",
  "menu",
  "partner",
  "portal",
  "proposal",
  "proposal2",
  "stores",
  "v3",
  "favicon.ico",
  "robots.txt",
]);

export default function PartnerBranchLandingPage() {
  const params = useParams();
  const router = useRouter();
  const partnerId = (params?.partnerId as string)?.trim();

  const isReserved = partnerId ? RESERVED_PATHS.has(partnerId.toLowerCase()) : false;

  const partner = useQuery(
    api.partners.getById,
    partnerId && !isReserved ? { id: partnerId } : "skip"
  );

  // 파트너 정보가 확인되면 localStorage에 추천 파트너 세션 저장
  useEffect(() => {
    if (partner) {
      if (typeof window !== "undefined") {
        localStorage.setItem("120_referral_partner_id", partner.id);
        localStorage.setItem("120_referral_partner_name", partner.name);
        localStorage.setItem("120_referral_partner_company", partner.companyName || "");
      }
    }
  }, [partner]);

  if (isReserved) {
    return null;
  }

  // 로딩 중
  if (partner === undefined) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-white font-sans">
        <div className="w-10 h-10 border-3 border-[#FED422] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs font-bold text-neutral-400 tracking-wider">
          파트너 전담 분양 센터 연결 중...
        </p>
      </div>
    );
  }

  // 파트너를 찾을 수 없는 경우 (유효하지 않은 파트너 ID)
  if (!partner) {
    return (
      <div className="min-h-screen bg-[#0B0F17] flex flex-col items-center justify-center text-white p-6 text-center font-sans">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-[#FED422] mb-4">
          <Building2 size={28} />
        </div>
        <h2 className="text-xl font-black text-white mb-2">
          파트너 분양 센터를 찾을 수 없습니다
        </h2>
        <p className="text-xs text-slate-400 max-w-sm mb-6 leading-relaxed">
          요청하신 파트너 링크(<strong className="text-amber-300 font-mono">/{partnerId}</strong>)가 존재하지 않거나 만료되었습니다.
          120겹파이 공식 홈페이지로 이동합니다.
        </p>
        <button
          type="button"
          onClick={() => router.push("/franchise")}
          className="px-6 py-3 bg-[#FED422] hover:bg-amber-400 text-[#0F172A] rounded-xl font-black text-xs shadow-lg transition-all cursor-pointer border-0"
        >
          공식 가맹 홈페이지 바로가기
        </button>
      </div>
    );
  }

  const partnerDisplayName = partner.companyName
    ? `${partner.companyName} (${partner.name} 파트너)`
    : `${partner.name} 공식 파트너`;

  return (
    <div className="relative">
      {/* 🌟 상단 고정 파트너 전담 분양 안심 웰컴 바 */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-amber-500 via-[#FED422] to-amber-400 text-[#0F172A] shadow-md border-b border-amber-400/50">
        <div className="max-w-7xl mx-auto px-3.5 py-2.5 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#0F172A] text-[#FED422] text-[10px] font-black shrink-0 shadow-2xs">
              <Sparkles size={11} className="text-amber-400" />
              <span>공식 분양 채널</span>
            </span>
            <div className="flex items-center gap-1.5 truncate">
              <ShieldCheck size={15} className="text-[#0F172A] shrink-0" />
              <span className="truncate font-black text-xs sm:text-[13px] text-[#0F172A]">
                <strong>{partnerDisplayName}</strong> 전담 상담 채널
              </span>
              <span className="hidden md:inline text-[11px] font-bold text-amber-950">
                · 본 파트너를 통한 1:1 맞춤 창업 지원 및 특별 혜택 제공
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {partner.phone && (
              <a
                href={`tel:${partner.phone.replace(/[^0-9]/g, "")}`}
                className="inline-flex items-center gap-1 px-3 py-1 bg-[#0F172A] hover:bg-slate-800 active:scale-95 text-white font-black text-xs rounded-lg shadow-sm transition-all no-underline shrink-0"
                title="담당 파트너 직통 전화 연결"
              >
                <Phone size={12} className="text-amber-300" />
                <span>파트너 직통전화</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* 120겹파이 메인 가맹 랜딩페이지 */}
      <LandingV6Client />
    </div>
  );
}
