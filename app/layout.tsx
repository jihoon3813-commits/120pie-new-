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
  title: "120겹파이 & 에그120 | 카페 디저트 샵인샵 창업 솔루션",
  description:
    "기존 카페에 바로 도입 가능한 120겹 파이와 에그120 샵인샵 디저트 솔루션. 소자본 샵인샵 도입으로 객단가 상승 및 디저트 매출 극대화!",
  icons: {
    icon: "https://res.cloudinary.com/dfarfqx7e/image/upload/f_auto,q_auto/v1781186180/logo_120pie_coffee_nu2_c7tiiy_zi1pjo.png"
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
        url: "https://res.cloudinary.com/dfkntvpmv/image/upload/f_auto,q_auto/v1783488020/%EC%A0%9C%EB%AA%A9%EC%9D%84_%EC%9E%85%EB%A0%A5%ED%95%B4%EC%A3%BC%EC%84%B8%EC%9A%94._10_bbqpma.png",
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
    images: ["https://res.cloudinary.com/dfkntvpmv/image/upload/f_auto,q_auto/v1783488020/%EC%A0%9C%EB%AA%A9%EC%9D%84_%EC%9E%85%EB%A0%A5%ED%95%B4%EC%A3%BC%EC%84%B8%EC%9A%94._10_bbqpma.png"]
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
import Script from "next/script";

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
    "logo": "https://res.cloudinary.com/dfarfqx7e/image/upload/f_auto,q_auto/v1781186180/logo_120pie_coffee_nu2_c7tiiy_zi1pjo.png",
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

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "120pie & coffee",
    "image": "https://res.cloudinary.com/dfarfqx7e/image/upload/f_auto,q_auto/v1781186180/logo_120pie_coffee_nu2_c7tiiy_zi1pjo.png",
    "telephone": "1566-3594",
    "email": "120piecoffee@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "엘에스로 143 1층 1001호",
      "addressLocality": "군포시",
      "addressRegion": "경기도",
      "postalCode": "15807",
      "addressCountry": "KR"
    },
    "url": "https://120piecoffee.com",
    "priceRange": "$$"
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <ConvexClientProvider>
          <Script src="https://cdn.portone.io/v2/browser-sdk.js" strategy="lazyOnload" />
          <Script src="//wcs.naver.net/wcslog.js" strategy="afterInteractive" />
          <TrackPageView />
          {children}
        </ConvexClientProvider>
      </body>
    </html>
  );
}
