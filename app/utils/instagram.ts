/**
 * 인스타그램 게시물/릴스 URL에서 Shortcode를 파싱하고 대표 썸네일 이미지를 도출합니다.
 */
export function extractInstagramShortcode(url: string): string | null {
  if (!url) return null;
  const cleanUrl = url.split("?")[0].split("#")[0];
  const match = cleanUrl.match(/(?:instagram\.com|instagr\.am)\/(?:p|reel|reels|tv)\/([A-Za-z0-9_.-]+)/i);
  return match ? match[1] : null;
}

// 실시간 로드 실패 시 영구 보존 기본 120파이 대체 이미지
export const INSTAGRAM_FALLBACK_IMAGE = "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784555518/4344223e-1040-4413-9233-bf6b98fe0412.png";

export function getInstagramThumbnailUrl(urlOrImg?: string | null, fallbackLink?: string): string {
  const target = (urlOrImg || "").trim();
  const fallback = (fallbackLink || "").trim();

  // 1. 유효한 Cloudinary 또는 로컬/데이터 URL인 경우 그대로 사용
  if (
    target.startsWith("data:") ||
    target.startsWith("/") ||
    (target.includes("cloudinary.com") && !target.includes("weserv.nl"))
  ) {
    return target;
  }

  // 2. 인스타그램 게시물 링크인 경우 프록시 라우트로 라우팅
  const shortcodeFromImg = extractInstagramShortcode(target);
  if (shortcodeFromImg) {
    return `/api/instagram-image?shortcode=${shortcodeFromImg}`;
  }

  // 3. 인스타그램 임시 CDN 이미지(scontent/fbcdn)인 경우
  if (target.includes("cdninstagram.com") || target.includes("fbcdn.net")) {
    const shortcodeFromFallback = extractInstagramShortcode(fallback);
    if (shortcodeFromFallback) {
      return `/api/instagram-image?shortcode=${shortcodeFromFallback}`;
    }
    return `/api/instagram-image?img=${encodeURIComponent(target)}`;
  }

  // 4. target이 비어있거나 기타인 경우 fallbackLink 확인
  if (fallback) {
    const shortcodeFromFallback = extractInstagramShortcode(fallback);
    if (shortcodeFromFallback) {
      return `/api/instagram-image?shortcode=${shortcodeFromFallback}`;
    }
  }

  // 5. 일반 외부 이미지 URL (jpg, png, webp 등)
  if (target.match(/\.(jpeg|jpg|gif|png|webp|avif)(\?.*)?$/i)) {
    return target;
  }

  return INSTAGRAM_FALLBACK_IMAGE;
}
