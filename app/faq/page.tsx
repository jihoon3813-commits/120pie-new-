import type { Metadata } from "next";
import FaqPageClient from "./FaqPageClient";

export const metadata: Metadata = {
  title: "자주 묻는 질문(FAQ) | 120pie & coffee",
  description: "120겹 파이 & 에그120 디저트 도입 및 창업 시 많은 분들이 자주 묻는 질문과 답변을 확인해 보세요. 샵인샵 도입, 조리 교육, 점포 운영 관련 답변 제공.",
  alternates: {
    canonical: "/faq"
  }
};

export default function FaqPage() {
  return <FaqPageClient />;
}
