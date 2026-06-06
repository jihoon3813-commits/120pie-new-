import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "https://dummy-url.convex.cloud";
const convex = new ConvexHttpClient(convexUrl);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, path, menuName, referrer: clientReferrer } = body;

    const xForwardedFor = request.headers.get("x-forwarded-for");
    const xRealIp = request.headers.get("x-real-ip");
    let ip = "127.0.0.1";
    if (xForwardedFor) {
      ip = xForwardedFor.split(",")[0].trim();
    } else if (xRealIp) {
      ip = xRealIp;
    }

    const referrer = clientReferrer || request.headers.get("referer") || "direct";
    const date = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" });

    await convex.mutation(api.analytics.trackEvent, {
      type,
      path,
      menuName,
      referrer,
      ip,
      date,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Tracking API error:", error);
    return NextResponse.json({ success: false, error: error?.message || String(error) }, { status: 500 });
  }
}
