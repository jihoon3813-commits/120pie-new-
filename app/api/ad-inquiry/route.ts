import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "";

// In-memory deduplication cache (key -> timestamp ms)
const recentSubmissions = new Map<string, number>();
const DEDUP_WINDOW_MS = 60 * 1000;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

function formatKoreanMobile(rawDigits: string): string {
  if (rawDigits.length === 10) {
    return `${rawDigits.slice(0, 3)}-${rawDigits.slice(3, 6)}-${rawDigits.slice(6, 10)}`;
  }
  return `${rawDigits.slice(0, 3)}-${rawDigits.slice(3, 7)}-${rawDigits.slice(7, 11)}`;
}

export async function POST(request: NextRequest) {
  try {
    if (!convexUrl) {
      return NextResponse.json(
        {
          success: false,
          code: "SERVER_CONFIG_ERROR",
          message: "상담 접수 서버 설정을 확인할 수 없습니다. 고객센터(1566-3594)로 문의해 주세요.",
        },
        { status: 500, headers: corsHeaders }
      );
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        {
          success: false,
          code: "INVALID_BODY",
          message: "요청 형식이 올바르지 않습니다.",
        },
        { status: 400, headers: corsHeaders }
      );
    }

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const rawPhoneInput = typeof body.phone === "string" ? body.phone.trim() : "";
    const region = typeof body.region === "string" ? body.region.trim() : "";
    const type = typeof body.type === "string" ? body.type.trim() : "";
    const consent = Boolean(body.consent);

    const partnerId = typeof body.partnerId === "string" && body.partnerId.trim() ? body.partnerId.trim() : undefined;
    const partnerName = typeof body.partnerName === "string" && body.partnerName.trim() ? body.partnerName.trim() : undefined;
    const partnerCompany =
      typeof body.partnerCompany === "string" && body.partnerCompany.trim() ? body.partnerCompany.trim() : undefined;

    const fieldErrors: Record<string, string> = {};
    if (!name) fieldErrors.owner = "성함을 입력해 주세요.";
    const cleanPhone = rawPhoneInput.replace(/[\s-]/g, "");
    if (!cleanPhone) {
      fieldErrors.phone = "연락처를 입력해 주세요.";
    } else if (!/^01[016789]\d{7,8}$/.test(cleanPhone)) {
      fieldErrors.phone = "휴대전화 번호를 다시 확인해 주세요.";
    }
    if (!region) fieldErrors.region = "희망 도입 지역을 입력해 주세요.";
    if (!type) fieldErrors.type = "현재 매장 상황을 선택해 주세요.";
    if (!consent) fieldErrors.consent = "개인정보 수집·이용 안내를 확인하고 동의해 주세요.";

    if (Object.keys(fieldErrors).length > 0) {
      return NextResponse.json(
        {
          success: false,
          code: "VALIDATION_ERROR",
          fieldErrors,
          message: "입력 항목을 다시 확인해 주세요.",
        },
        { status: 400, headers: corsHeaders }
      );
    }

    // Prune expired deduplication keys
    const now = Date.now();
    recentSubmissions.forEach((timestamp, key) => {
      if (now - timestamp > DEDUP_WINDOW_MS) {
        recentSubmissions.delete(key);
      }
    });

    const dedupKey = `${cleanPhone}:${region}:${type}`;
    const lastSubmittedAt = recentSubmissions.get(dedupKey);
    if (lastSubmittedAt && now - lastSubmittedAt < DEDUP_WINDOW_MS) {
      return NextResponse.json(
        {
          success: false,
          code: "DUPLICATE_SUBMISSION",
          message: "이미 동일한 내용으로 상담 신청이 접수되었습니다. 담당자가 확인 후 연락드리겠습니다.",
        },
        { status: 409, headers: corsHeaders }
      );
    }

    const formattedPhone = formatKoreanMobile(cleanPhone);
    const regDate = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" });
    const convex = new ConvexHttpClient(convexUrl);

    const inquiryId = await convex.mutation(api.inquiries.add, {
      name,
      phone: formattedPhone,
      storeType: type,
      existingStoreName: region,
      message: `[광고 랜딩 상담] 희망 도입 지역: ${region} / 현재 매장 상황: ${type}`,
      regDate,
      partnerId,
      partnerName,
      partnerCompany,
    });

    recentSubmissions.set(dedupKey, now);

    // Trigger Aligo SMS notification (non-blocking for user success once DB saved)
    try {
      await convex.action(api.aligo.sendEventSms, {
        eventKey: "consultation",
        variables: {
          name,
          phone: formattedPhone,
          storeType: `${type} (${region})`,
        },
        customerPhone: formattedPhone,
      });
    } catch (smsErr) {
      console.warn("[ad-inquiry] SMS notification warning:", smsErr);
    }

    // Track analytics conversion event
    try {
      const xForwardedFor = request.headers.get("x-forwarded-for");
      const xRealIp = request.headers.get("x-real-ip");
      const ip = xForwardedFor ? xForwardedFor.split(",")[0].trim() : xRealIp || "127.0.0.1";
      const userAgent = (request.headers.get("user-agent") || "").slice(0, 300);
      const referrer =
        (typeof body.referrer === "string" && body.referrer) || request.headers.get("referer") || "direct";
      const path = (typeof body.path === "string" && body.path) || "/ad";

      await convex.mutation(api.analytics.trackEvent, {
        type: "inquiry_submit",
        path,
        referrer,
        ip,
        date: regDate,
        visitorType: "customer",
        partnerId,
        userAgent,
      });
    } catch (trackErr) {
      console.warn("[ad-inquiry] Analytics track warning:", trackErr);
    }

    return NextResponse.json(
      {
        success: true,
        inquiryId: String(inquiryId),
        message: "상담 신청이 정상적으로 접수되었습니다. 담당자가 확인 후 빠르게 연락드리겠습니다.",
      },
      { status: 200, headers: corsHeaders }
    );
  } catch (error: any) {
    console.error("[ad-inquiry] Failed to save inquiry:", error);
    return NextResponse.json(
      {
        success: false,
        code: "SERVER_ERROR",
        message: "일시적인 오류로 상담 신청이 저장되지 않았습니다. 잠시 후 다시 시도하거나 1566-3594로 문의해 주세요.",
      },
      { status: 500, headers: corsHeaders }
    );
  }
}
