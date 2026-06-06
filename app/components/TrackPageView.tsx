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
  }, [pathname]);

  return null;
}
