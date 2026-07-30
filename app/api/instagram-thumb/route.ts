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
    // Search for img src with cdninstagram.com in HTML
    const imgMatches = html.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi);

    let thumbnailUrl = "";
    if (imgMatches) {
      for (const tag of imgMatches) {
        const srcMatch = tag.match(/src=["']([^"']+)["']/i);
        if (srcMatch && srcMatch[1]) {
          const rawUrl = srcMatch[1].replace(/&amp;/g, "&");
          // Ignore avatar profile pictures (s100x100) or icons, prefer post content (t51.82787-15 or e35 / 1500)
          if (rawUrl.includes("cdninstagram") && (rawUrl.includes("t51.82787") || rawUrl.includes("e35") || rawUrl.includes("s640x640") || rawUrl.includes("p240x240"))) {
            thumbnailUrl = rawUrl;
            break;
          }
        }
      }

      // Fallback: take any cdninstagram URL if strict filter did not match
      if (!thumbnailUrl && imgMatches.length > 1) {
        const lastTagSrc = imgMatches[imgMatches.length - 1].match(/src=["']([^"']+)["']/i);
        if (lastTagSrc && lastTagSrc[1]) {
          thumbnailUrl = lastTagSrc[1].replace(/&amp;/g, "&");
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
