import "./globals.css";
import "./landing-v3/styles.css";
import "./landing-v4/styles.css";

export const metadata = {
  title: "120pie&coffee | 카페 사장님을 위한 디저트 매출 솔루션",
  description:
    "120겹 파이와 에그120을 기존 카페에 샵인샵으로 도입해 객단가 상승, 디저트 매출 강화, 낮은 폐기 부담을 기대할 수 있는 프랜차이즈 상담 페이지입니다.",
  keywords: [
    "120pie",
    "120겹파이",
    "에그120",
    "카페 샵인샵",
    "디저트 창업",
    "카페 창업",
    "저가커피 디저트",
    "프랜차이즈 가맹",
    "카페 매출 상승"
  ],
  openGraph: {
    title: "120pie&coffee | 카페 사장님을 위한 디저트 매출 솔루션",
    description:
      "기존 카페에 바로 도입 가능한 120겹 파이와 에그120 샵인샵 디저트 솔루션.",
    type: "website"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
