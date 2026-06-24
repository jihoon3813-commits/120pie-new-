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

    // We can track all routes. When displaying analytics, we can filter out admin routes if desired.
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
      }
    };

    document.addEventListener("click", handleGlobalClick);
    return () => {
      document.removeEventListener("click", handleGlobalClick);
    };
  }, []);

  return null;
}
