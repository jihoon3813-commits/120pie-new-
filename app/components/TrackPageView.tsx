"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function TrackPageView() {
  const pathname = usePathname();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    // Prevent double-tracking on strict mode mounts
    if (lastTrackedPath.current === pathname) return;
    lastTrackedPath.current = pathname;

    // 1. 방문자 유형 (Role) 및 식별자 판별
    let visitorType = "customer";
    let visitorId = "";

    try {
      if (typeof window !== "undefined") {
        const isOwner = localStorage.getItem("120_owner_logged_in") === "true";
        const isPartner = localStorage.getItem("120_partner_logged_in") === "true";
        const isAdmin = localStorage.getItem("120_admin_logged_in") === "true";

        if (isAdmin || pathname.startsWith("/admin")) {
          visitorType = "admin";
          visitorId = "admin";
        } else if (isOwner || pathname.startsWith("/portal")) {
          visitorType = "store";
          visitorId = localStorage.getItem("120_active_store_id") || "store";
        } else if (isPartner || (pathname.startsWith("/partner") && !pathname.includes("["))) {
          visitorType = "partner";
          visitorId = localStorage.getItem("120_partner_id") || "partner";
        } else {
          visitorType = "customer";
        }
      }
    } catch (e) {
      // localStorage 접근 오류 방지
    }

    // 2. URL 파라미터 및 파트너 분양페이지 / 유입 채널 분석
    let channel = "direct";
    let source = "";
    let partnerId = "";

    if (typeof window !== "undefined") {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        source = (urlParams.get("source") || urlParams.get("utm_source") || urlParams.get("ref") || "").toLowerCase();
        const queryPartnerId = urlParams.get("partnerId") || urlParams.get("partner_id") || "";

        // 경로 기반 파트너 분양페이지 감지 (예: /partner1)
        const pathSegments = pathname.split("/").filter(Boolean);
        const RESERVED = new Set([
          "admin", "api", "brand", "contract", "costs", "faq", "franchise",
          "gateway", "login", "menu", "partner", "portal", "proposal",
          "proposal2", "stores", "v3", "pink", "landing-v2", "landing-v4", "landing-v6"
        ]);

        if (pathSegments.length === 1 && !RESERVED.has(pathSegments[0].toLowerCase())) {
          partnerId = pathSegments[0];
        } else if (queryPartnerId) {
          partnerId = queryPartnerId;
        } else {
          partnerId = localStorage.getItem("120_referral_partner_id") || "";
        }

        const ua = navigator.userAgent || "";
        const ref = document.referrer || "";

        if (source === "sms" || source === "text" || source === "message") {
          channel = "sms";
        } else if (source === "kakao" || source === "kakaotalk" || /kakaotalk/i.test(ua) || ref.includes("talk.kakao.com")) {
          channel = "kakao";
          if (!source) source = "kakao";
        } else if (ref.includes("naver.com")) {
          channel = "naver";
        } else if (ref.includes("google.com")) {
          channel = "google";
        } else if (ref.includes("instagram.com")) {
          channel = "instagram";
        } else if (ref.includes("youtube.com")) {
          channel = "youtube";
        } else if (ref.includes("daangn.com")) {
          channel = "daangn";
        } else if (ref) {
          channel = "referral";
        } else {
          channel = "direct";
        }
      } catch (e) {
        // query parsing error fallback
      }
    }

    const referrer = typeof document !== "undefined" ? document.referrer : "";

    fetch("/api/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "visit",
        path: pathname,
        referrer: referrer || "direct",
        visitorType,
        visitorId,
        partnerId,
        channel,
        source,
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
      }),
    }).catch((err) => console.error("PageView tracking failed:", err));

    // Naver Analytics / Premium Log Analysis tracking
    if (typeof window !== "undefined" && (window as any).wcs) {
      try {
        if (!(window as any).wcs_add) (window as any).wcs_add = {};
        (window as any).wcs_add["wa"] = process.env.NEXT_PUBLIC_NAVER_AD_ACCOUNT_ID || "s_15663594120p";
        (window as any).wcs_do();
      } catch (err) {
        console.error("Naver pageview tracking failed:", err);
      }
    }

    // Karrot Pixel tracking (handles both initial page load and route transitions)
    if (typeof window !== "undefined") {
      const runKarrot = () => {
        const pixel = (window as any).karrotPixel;
        if (pixel) {
          if (!(window as any).karrotPixelInitialized) {
            pixel.init('1783905652701768001');
            (window as any).karrotPixelInitialized = true;
          }
          pixel.track('ViewPage');
        }
      };

      if ((window as any).karrotPixel) {
        runKarrot();
      } else {
        const script = document.querySelector('script[src*="karrot-pixel.js"]');
        if (script) {
          const onLoadHandler = () => {
            runKarrot();
            script.removeEventListener('load', onLoadHandler);
          };
          script.addEventListener('load', onLoadHandler);
        }
      }
    }
  }, [pathname]);

  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      if (anchor && anchor.href && anchor.href.startsWith("tel:")) {
        fetch("/api/track", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "phone_click",
            path: window.location.pathname,
            referrer: document.referrer || "direct"
          })
        }).catch(err => console.error("Phone click tracking failed:", err));

        if (typeof window !== "undefined" && (window as any).wcs) {
          try {
            if (!(window as any).wcs_add) (window as any).wcs_add = {};
            (window as any).wcs_add["wa"] = process.env.NEXT_PUBLIC_NAVER_AD_ACCOUNT_ID || "s_15663594120p";
            const _nasa = {} as any;
            _nasa["cnv"] = (window as any).wcs.cnv("5", "10"); // conversion type 5 (Other) for call click
            (window as any).wcs_do(_nasa);
          } catch (err) {
            console.error("Naver call conversion tracking failed:", err);
          }
        }

        // Karrot Pixel conversion tracking for call click
        if (typeof window !== "undefined" && (window as any).karrotPixel) {
          try {
            (window as any).karrotPixel.track('Lead');
          } catch (err) {
            console.error("Karrot call conversion tracking failed:", err);
          }
        }
      }
    };

    document.addEventListener("click", handleGlobalClick);
    return () => {
      document.removeEventListener("click", handleGlobalClick);
    };
  }, []);

  return null;
}
