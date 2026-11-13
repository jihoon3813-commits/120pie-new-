"use client";

import React, { useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import AdLandingClient from "@/app/ad/AdLandingClient";
import Link from "next/link";

class ClonedLandingErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return <AdLandingClient />;
    }
    return this.props.children;
  }
}

export default function ClonedLandingClient({ slug }: { slug: string }) {
  return (
    <ClonedLandingErrorBoundary>
      <ClonedLandingClientInner slug={slug} />
    </ClonedLandingErrorBoundary>
  );
}

function ClonedLandingClientInner({ slug }: { slug: string }) {
  const normalizedSlug = slug.trim().toLowerCase();
  const landingPage = useQuery(api.landingPages.getBySlug, { slug: normalizedSlug });

  useEffect(() => {
    if (landingPage?.customTitle) {
      document.title = landingPage.customTitle;
    }
  }, [landingPage?.customTitle]);

  if (landingPage === undefined) {
    return (
      <div className="min-h-screen bg-[#0D1117] text-white flex flex-col items-center justify-center p-6">
        <div className="w-9 h-9 border-2 border-[#FED422] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs text-slate-400 font-bold">랜딩페이지를 불러오는 중입니다...</p>
      </div>
    );
  }

  if (landingPage === null) {
    return (
      <div className="min-h-screen bg-[#0D1117] text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-[#161B22] border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-4">
          <div className="w-12 h-12 rounded-full bg-amber-500/15 text-[#FED422] flex items-center justify-center mx-auto font-black text-xl">
            !
          </div>
          <h1 className="text-lg font-black text-white">요청하신 랜딩페이지를 찾을 수 없습니다</h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            링크 주소가 변경되었거나 삭제된 페이지입니다.
            <br />
            120PIE 공식 홈페이지에서 창업 안내를 확인해 보세요.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
            <Link
              href="/landing-ad"
              className="px-4 py-2.5 rounded-lg bg-[#FED422] text-[#0F172A] text-xs font-black hover:brightness-95 transition-all"
            >
              기본 안내 페이지 보기
            </Link>
            <Link
              href="/"
              className="px-4 py-2.5 rounded-lg bg-slate-800 text-slate-200 text-xs font-bold hover:bg-slate-700 transition-all"
            >
              공식 홈페이지 이동
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!landingPage.isActive) {
    return (
      <div className="min-h-screen bg-[#0D1117] text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-[#161B22] border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center mx-auto font-black text-lg">
            ⏸
          </div>
          <h1 className="text-lg font-black text-white">현재 종료되었거나 일시 중지된 페이지입니다</h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            해당 프로모션 또는 광고 캠페인 링크가 비활성화 상태입니다.
            <br />
            120PIE 공식 안내 페이지로 이동하여 상담을 신청하실 수 있습니다.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
            <Link
              href="/landing-ad"
              className="px-4 py-2.5 rounded-lg bg-[#FED422] text-[#0F172A] text-xs font-black hover:brightness-95 transition-all"
            >
              120PIE 안내 페이지 이동
            </Link>
            <Link
              href="/"
              className="px-4 py-2.5 rounded-lg bg-slate-800 text-slate-200 text-xs font-bold hover:bg-slate-700 transition-all"
            >
              공식 홈페이지 이동
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AdLandingClient
      landingConfig={{
        _id: String(landingPage._id),
        slug: landingPage.slug,
        title: landingPage.title,
        channel: landingPage.channel,
        utmSource: landingPage.utmSource,
        utmMedium: landingPage.utmMedium,
        utmCampaign: landingPage.utmCampaign,
      }}
    />
  );
}
