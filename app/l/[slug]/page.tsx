import type { Metadata } from "next";
import ClonedLandingClient from "./ClonedLandingClient";

export const metadata: Metadata = {
  title: "우리 동네 디저트, 내가 먼저 | 120PIE",
  description: "120PIE 샵인샵 창업 상담 랜딩페이지",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ClonedLandingPage({
  params,
}: {
  params: { slug: string };
}) {
  return <ClonedLandingClient slug={params.slug} />;
}
