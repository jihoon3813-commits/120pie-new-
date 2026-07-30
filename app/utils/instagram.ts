/**
 * 인스타그램 게시물/릴스 URL에서 Shortcode를 파싱하고 대표 썸네일 이미지를 자동으로 도출합니다.
 * 지원 형식:
 * - https://www.instagram.com/reel/DZplIYUIHi8/?utm_source=...
 * - https://www.instagram.com/p/SHORTCODE/
 * - https://instagr.am/p/SHORTCODE/
 */
export function extractInstagramShortcode(url: string): string | null {
  if (!url) return null;
  // 쿼리 스트링(?...) 및 해시(#...) 제거
  const cleanUrl = url.split("?")[0].split("#")[0];
  const match = cleanUrl.match(/(?:instagram\.com|instagr\.am)\/(?:p|reel|reels|tv)\/([A-Za-z0-9_-]+)/i);
  return match ? match[1] : null;
}

export const INSTAGRAM_FALLBACK_IMAGE = "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784555518/4344223e-1040-4413-9233-bf6b98fe0412.png";

export function getInstagramThumbnailUrl(urlOrImg: string): string {
  if (!urlOrImg || !urlOrImg.trim()) {
    return INSTAGRAM_FALLBACK_IMAGE;
  }

  const trimmed = urlOrImg.trim();

  // 1. 이미 직렬 이미지 파일(Cloudinary, data:, cdninstagram, weserv, .jpg, .png 등)인 경우 그대로 반환
  if (
    trimmed.startsWith("data:") ||
    trimmed.includes("cloudinary.com") ||
    trimmed.includes("weserv.nl") ||
    trimmed.includes("cdninstagram.com") ||
    trimmed.match(/\.(jpeg|jpg|gif|png|webp|avif)(\?.*)?$/i)
  ) {
    return trimmed;
  }

  // 2. 인스타그램 게시물/릴스 URL에서 shortcode 추출 후 썸네일 엔드포인트 도출
  const shortcode = extractInstagramShortcode(trimmed);
  if (shortcode) {
    return `https://images.weserv.nl/?url=https://www.instagram.com/p/${shortcode}/media/?size=m`;
  }

  return trimmed;
}

