"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import GatePageClient from "@/components/GatePageClient";
import { Building2 } from "lucide-react";

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
        localStorage.setItem("120_referral_partner_phone", partner.consultationPhone || partner.phone || "");
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

  return <GatePageClient />;
}
