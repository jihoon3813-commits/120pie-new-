import { NextRequest, NextResponse } from "next/server";
import { extractInstagramShortcode, INSTAGRAM_FALLBACK_IMAGE } from "@/app/utils/instagram";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get("url") || searchParams.get("link") || "";
  const shortcodeParam = searchParams.get("shortcode") || "";
  const directImg = searchParams.get("img") || "";

  const shortcode = shortcodeParam || extractInstagramShortcode(targetUrl) || extractInstagramShortcode(directImg);

  // 1. Try to fetch high-res image via Instagram Embed API if shortcode is available
  if (shortcode) {
    try {
      const embedUrl = `https://www.instagram.com/p/${shortcode}/embed/captioned/`;
      const res = await fetch(embedUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
          "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
        },
        next: { revalidate: 86400 },
      });

      if (res.ok) {
        const html = await res.text();
        const rawMatches = html.match(/https:\/\/[^"'\s\\]*(?:cdninstagram|fbcdn)[^"'\s\\]*/g) || [];

        const candidates = Array.from(new Set(rawMatches.map((u) => u.replace(/&amp;/g, "&"))))
          .filter(
            (u) =>
              !u.includes("profile_pic") &&
              !u.includes("s100x100") &&
              !u.includes("rsrc.php") &&
              !u.includes("static.cdninstagram.com")
          );

        // Find best resolution candidate
        const fullRes = candidates.find(
          (u) =>
            u.includes("dst-jpg_e35_tt6") ||
            u.includes("s1080x1080") ||
            (u.includes("e35") &&
              !u.includes("p240x240") &&
              !u.includes("s150x150") &&
              !u.includes("s320x320") &&
              !u.includes("s480x480") &&
              !u.includes("s640x640"))
        );
        const bestUrl = fullRes || candidates[0];

        if (bestUrl) {
          const imgRes = await fetch(bestUrl, {
            headers: {
              "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
            },
          });

          if (imgRes.ok) {
            const buffer = await imgRes.arrayBuffer();
            const contentType = imgRes.headers.get("content-type") || "image/jpeg";
            return new NextResponse(buffer, {
              headers: {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000",
              },
            });
          }
        }
      }
    } catch (e) {
      console.error("[Instagram Image Proxy] Error fetching embed for shortcode:", shortcode, e);
    }
  }

  // 2. If a direct image URL was provided (and wasn't resolved by shortcode)
  if (directImg && (directImg.includes("cdninstagram") || directImg.includes("fbcdn"))) {
    try {
      const imgRes = await fetch(directImg, {
        headers: {
          "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
        },
      });

      if (imgRes.ok) {
        const buffer = await imgRes.arrayBuffer();
        const contentType = imgRes.headers.get("content-type") || "image/jpeg";
        return new NextResponse(buffer, {
          headers: {
            "Content-Type": contentType,
            "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000",
          },
        });
      }
    } catch (e) {
      console.error("[Instagram Image Proxy] Direct image fetch failed:", e);
    }
  }

  // 3. Fallback redirect to permanent image
  return NextResponse.redirect(INSTAGRAM_FALLBACK_IMAGE, 302);
}
