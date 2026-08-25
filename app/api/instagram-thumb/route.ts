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

  // Return the robust image proxy endpoint that streams the image server-side
  return NextResponse.json({
    success: true,
    thumbnailUrl: `/api/instagram-image?shortcode=${shortcode}`,
  });
}
