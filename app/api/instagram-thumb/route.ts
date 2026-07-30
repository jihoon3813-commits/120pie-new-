import { NextRequest, NextResponse } from "next/server";
import { extractInstagramShortcode, INSTAGRAM_FALLBACK_IMAGE } from "@/app/utils/instagram";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return NextResponse.json({ success: false, thumbnailUrl: INSTAGRAM_FALLBACK_IMAGE });
  }

  const shortcode = extractInstagramShortcode(targetUrl);
  if (!shortcode) {
    return NextResponse.json({ success: false, thumbnailUrl: INSTAGRAM_FALLBACK_IMAGE });
  }

  try {
    const embedUrl = `https://www.instagram.com/p/${shortcode}/embed/captioned/`;
    const res = await fetch(embedUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
        "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return NextResponse.json({ success: false, thumbnailUrl: INSTAGRAM_FALLBACK_IMAGE });
    }

    const html = await res.text();
    const rawMatches = html.match(/https:\/\/[^"'\s\\]*(?:cdninstagram|fbcdn)[^"'\s\\]*/g);

    let thumbnailUrl = "";
    if (rawMatches) {
      const candidates = Array.from(new Set(rawMatches.map(u => u.replace(/&amp;/g, "&"))))
        .filter(u => !u.includes("profile_pic") && !u.includes("s100x100") && !u.includes("rsrc.php"));

      // Priority 1: Full HD Original Uncompressed Image (contains dst-jpg_e35_tt6 or e35 without downscales)
      const fullRes = candidates.find(u => 
        u.includes("dst-jpg_e35_tt6") || 
        (u.includes("e35") && !u.includes("p240x240") && !u.includes("s150x150") && !u.includes("s320x320") && !u.includes("s480x480") && !u.includes("s640x640"))
      );

      if (fullRes) {
        thumbnailUrl = fullRes;
      } else {
        // Priority 2: Standard resolution candidate from post body
        const nonSmall = candidates.find(u => !u.includes("p240x240") && !u.includes("s150x150") && !u.includes("s240x240"));
        thumbnailUrl = nonSmall || candidates[0] || "";
      }
    }

    if (thumbnailUrl) {
      return NextResponse.json({ success: true, thumbnailUrl });
    }
  } catch (error) {
    console.error("Failed to fetch Instagram thumbnail:", error);
  }

  return NextResponse.json({ success: false, thumbnailUrl: INSTAGRAM_FALLBACK_IMAGE });
}
