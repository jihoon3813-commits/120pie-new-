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
    const imgMatches = html.match(/<img[^>]+>/gi);

    let thumbnailUrl = "";
    if (imgMatches) {
      for (const tag of imgMatches) {
        // Skip profile avatars (100x100 profile_pic)
        if (tag.includes("profile_pic") || tag.includes("s100x100")) continue;

        // 1. Check srcset attribute for higher resolution candidate
        const srcsetMatch = tag.match(/srcset=["']([^"']+)["']/i);
        if (srcsetMatch && srcsetMatch[1]) {
          const sources = srcsetMatch[1].split(",");
          const lastSource = sources[sources.length - 1].trim().split(" ")[0];
          if (lastSource && (lastSource.includes("cdninstagram") || lastSource.includes("fbcdn"))) {
            thumbnailUrl = lastSource.replace(/&amp;/g, "&");
            break;
          }
        }

        // 2. Fallback to src attribute
        const srcMatch = tag.match(/src=["']([^"']+)["']/i);
        if (srcMatch && srcMatch[1]) {
          const rawUrl = srcMatch[1].replace(/&amp;/g, "&");
          if (rawUrl.includes("cdninstagram") || rawUrl.includes("fbcdn")) {
            thumbnailUrl = rawUrl;
            break;
          }
        }
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
