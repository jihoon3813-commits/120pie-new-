import "./globals.css";
import "./v3/styles.css";
import "./landing-v4/styles.css";
import "./landing-v5/styles.css";
import "./landing-v5/portal.css";

export const metadata = {
  metadataBase: new URL("https://120piecoffee.com"),
  alternates: {
    canonical: "/"
  },
  title: "120pie&coffee | 카페 사장님을 위한 디저트 매출 솔루션",
  description:
    "120겹 파이와 에그120을 기존 카페에 샵인샵으로 도입해 객단가 상승, 디저트 매출 강화, 낮은 폐기 부담을 기대할 수 있는 프랜차이즈 상담 페이지입니다.",
  icons: {
    icon: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779713831/120%EA%B2%B9%ED%8C%8C%EC%9D%B4_%EC%9B%90%ED%98%95%EB%A1%9C%EA%B3%A02_nu_o4omab.png"
  },
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
    url: "https://120piecoffee.com/",
    type: "website",
    images: [
      {
        url: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779721204/120%EA%B2%B9%ED%8C%8C%EC%9D%B4_%EC%97%B0%EC%B6%9C4_du1czf.jpg",
        width: 1200,
        height: 630,
        alt: "120pie & coffee 디저트 솔루션 대표 이미지"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "120pie&coffee | 카페 사장님을 위한 디저트 매출 솔루션",
    description: "기존 카페에 바로 도입 가능한 120겹 파이와 에그120 샵인샵 디저트 솔루션.",
    images: ["https://res.cloudinary.com/dx7l09wwu/image/upload/v1779721204/120%EA%B2%B9%ED%8C%8C%EC%9D%B4_%EC%97%B0%EC%B6%9C4_du1czf.jpg"]
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "google-site-verification-placeholder"
  },
  other: {
    "naver-site-verification": process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION || "naver-site-verification-placeholder"
  }
};

import ConvexClientProvider from "./ConvexClientProvider";
import TrackPageView from "@/app/components/TrackPageView";

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  // JSON-LD Structured Data Schema for Search Results
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "120pie & coffee",
    "alternateName": "(주)고우웰라이프",
    "url": "https://120piecoffee.com",
    "logo": "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779713831/120%EA%B2%B9%ED%8C%8C%EC%9D%B4_%EC%9B%90%ED%98%95%EB%A1%9C%EA%B3%A02_nu_o4omab.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "1566-3594",
      "contactType": "customer service",
      "areaServed": "KR",
      "availableLanguage": "Korean"
    }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "120pie & coffee",
    "url": "https://120piecoffee.com"
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "지금 운영 중인 카페에도 도입할 수 있나요?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "네. 기존 매장을 크게 바꾸지 않고, 파이 메뉴를 준비하고 판매할 수 있는 작은 공간과 운영 환경을 확인한 뒤 시작할 수 있습니다. 매장 구조에 맞는 도입 방식은 상담을 통해 함께 정리해드립니다."
        }
      },
      {
        "@type": "Question",
        "name": "파이 조리가 어렵지는 않나요?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "복잡한 반죽이나 제빵 과정은 필요하지 않습니다. 준비된 생지를 보관해두었다가 주문이 들어오면 정해진 방식으로 구워, 커피와 함께 바로 제공할 수 있습니다."
        }
      },
      {
        "@type": "Question",
        "name": "간판이나 인테리어를 바꿔야 하나요?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "필수는 아닙니다. 기존 상호와 매장 분위기를 유지한 채 메뉴부터 시작할 수 있습니다. 외부 브랜드 표기나 매장 변화는 판매 반응을 확인한 뒤 필요에 따라 선택하시면 됩니다."
        }
      },
      {
        "@type": "Question",
        "name": "120파이만 먼저 판매해볼 수 있나요?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "가능합니다. 대표 메뉴인 파이부터 시작해 손님 반응을 살펴본 뒤, 에그120이나 츄러스, 핫도그, 떡볶이 같은 메뉴를 매장에 맞게 추가할 수 있습니다."
        }
      },
      {
        "@type": "Question",
        "name": "도입 전에 어떤 준비가 필요한가요?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "판매 공간, 냉동 보관과 조리가 가능한 환경, 예상 판매 메뉴를 먼저 확인합니다. 상담 시 현재 매장 사진이나 운영 상황을 바탕으로 필요한 준비 사항을 안내해드립니다."
        }
      },
      {
        "@type": "Question",
        "name": "나중에 120pie 매장으로 확장할 수도 있나요?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "네. 메뉴 도입 후 고객 반응과 운영 결과를 충분히 확인한 다음, 브랜드 표기 추가나 매장 전환 여부를 선택할 수 있습니다. 처음부터 큰 변화를 결정하실 필요는 없습니다."
        }
      }
    ]
  };

  return (
    <html lang="ko">
      <body>
        {/* Inject JSON-LD Schema markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <ConvexClientProvider>
          <TrackPageView />
          {children}
        </ConvexClientProvider>
      </body>
    </html>
  );
}
