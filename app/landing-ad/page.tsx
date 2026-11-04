import type { Metadata } from "next";
import AdLandingClient from "../ad/AdLandingClient";

export const metadata: Metadata = {
  title: "우리 동네 디저트, 내가 먼저 | 120PIE 시안",
  description: "120PIE 샵인샵 상담 랜딩페이지 — 지역 선점 콘셉트 검토용 시안",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LandingAdPage() {
  return <AdLandingClient />;
}
