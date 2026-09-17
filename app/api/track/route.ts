import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "https://dummy-url.convex.cloud";
const convex = new ConvexHttpClient(convexUrl);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      type,
      path,
      menuName,
      referrer: clientReferrer,
      visitorType = "customer",
      visitorId,
      partnerId,
      channel: clientChannel,
      source: clientSource,
      userAgent: clientUserAgent,
    } = body;

    const xForwardedFor = request.headers.get("x-forwarded-for");
    const xRealIp = request.headers.get("x-real-ip");
    let ip = "127.0.0.1";
    if (xForwardedFor) {
      ip = xForwardedFor.split(",")[0].trim();
    } else if (xRealIp) {
      ip = xRealIp;
    }

    const headerUserAgent = request.headers.get("user-agent") || "";
    const userAgent = clientUserAgent || headerUserAgent;

    const referrer = clientReferrer || request.headers.get("referer") || "direct";
    const date = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" });

    // 채널 및 소스 보정 (카카오톡 인앱 브라우저 또는 SMS 파라미터 감지)
    let channel = clientChannel;
    let source = clientSource;
    const uaUpper = userAgent.toUpperCase();

    if (!channel) {
      if (source === "sms" || source === "text") {
        channel = "sms";
      } else if (source === "kakao" || source === "kakaotalk" || uaUpper.includes("KAKAOTALK")) {
        channel = "kakao";
        if (!source) source = "kakao";
      } else if (referrer.includes("naver.com")) {
        channel = "naver";
      } else if (referrer.includes("google.com")) {
        channel = "google";
      } else if (referrer.includes("instagram.com")) {
        channel = "instagram";
      } else if (referrer.includes("youtube.com")) {
        channel = "youtube";
      } else if (referrer.includes("daangn.com")) {
        channel = "daangn";
      } else if (referrer === "direct" || !referrer) {
        channel = "direct";
      } else {
        channel = "etc";
      }
    }

    await convex.mutation(api.analytics.trackEvent, {
      type,
      path,
      menuName,
      referrer,
      ip,
      date,
      visitorType,
      visitorId,
      partnerId,
      channel,
      source,
      userAgent: userAgent.slice(0, 300), // 길이 제한
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Tracking API error:", error);
    return NextResponse.json({ success: false, error: error?.message || String(error) }, { status: 500 });
  }
}
