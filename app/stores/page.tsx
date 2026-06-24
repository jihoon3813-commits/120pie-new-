import type { Metadata } from "next";
import StoresPageClient from "./StoresPageClient";

export const metadata: Metadata = {
  title: "가맹점 현황 | 120pie & coffee",
  description: "가까운 120pie & coffee 매장을 찾고 네이버지도에서 위치를 확인하세요.",
  alternates: {
    canonical: "/stores"
  }
};

export default function StoresPage() {
  return <StoresPageClient />;
}
