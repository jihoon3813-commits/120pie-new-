import type { Metadata } from "next";
import CostsPageClient from "./CostsPageClient";

export const metadata: Metadata = {
  title: "비용 안내 | 120pie & coffee",
  description: "120 시그니처 패키지(120pie, egg120) 구성 및 금액 정보와, 재료 공급이 지원되는 120프랜즈 메뉴 정보를 확인하세요."
};

export default function CostsPage() {
  return <CostsPageClient />;
}
