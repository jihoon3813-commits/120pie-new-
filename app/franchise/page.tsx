import type { Metadata } from "next";
import FranchisePageClient from "./FranchisePageClient";

export const metadata: Metadata = {
  title: "창업 안내 | 120pie & coffee",
  description: "40년 장인정신의 120겹 파이와 egg120 계란빵, 츄러스까지. 소자본 샵인샵부터 매장 신규 창업까지 성공적인 가맹 모델 제안서를 확인해보세요."
};

export default function FranchisePage() {
  return <FranchisePageClient />;
}
