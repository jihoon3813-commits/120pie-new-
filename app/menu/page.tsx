import type { Metadata } from "next";
import MenuPageClient from "./MenuPageClient";

export const metadata: Metadata = {
  title: "메뉴 소개 | 120pie & coffee",
  description: "120겹파이, 에그120 계란빵, 사이드 메뉴 등 120pie & coffee의 모든 대표 메뉴를 확인해보세요.",
  alternates: {
    canonical: "/menu"
  }
};

export default function MenuPage() {
  return <MenuPageClient />;
}
