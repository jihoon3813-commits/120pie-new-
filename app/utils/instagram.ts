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

export function getInstagramThumbnailUrl(urlOrImg: string): string {
  if (!urlOrImg) return "";

  // 1. 이미 직렬 이미지 파일(Cloudinary, weserv.nl, data:, .jpg 등)인 경우 그대로 반환
  if (
    urlOrImg.startsWith("data:") ||
    urlOrImg.includes("cloudinary.com") ||
    urlOrImg.includes("weserv.nl") ||
    urlOrImg.includes("cdninstagram.com") ||
    urlOrImg.match(/\.(jpeg|jpg|gif|png|webp|avif)(\?.*)?$/i)
  ) {
    return urlOrImg;
  }

  // 2. 인스타그램 게시물/릴스 URL에서 shortcode 추출 후 weserv.nl CDN 프록시 엔드포인트 도출
  const shortcode = extractInstagramShortcode(urlOrImg);
  if (shortcode) {
    // weserv.nl 프록시를 사용하여 Instagram CORS/Referer 차단을 우회하고 고화질 썸네일 반환
    return `https://images.weserv.nl/?url=https://www.instagram.com/p/${shortcode}/media/?size=l`;
  }

  return urlOrImg;
}

