/**
 * 인스타그램 게시물 URL에서 Shortcode를 파싱하고 대표 썸네일 이미지를 자동으로 도출합니다.
 */
export function extractInstagramShortcode(url: string): string | null {
  if (!url) return null;
  const match = url.match(/(?:instagram\.com|instagr\.am)\/(?:p|reel|tv)\/([A-Za-z0-9_-]+)/);
  return match ? match[1] : null;
}

export function getInstagramThumbnailUrl(urlOrImg: string): string {
  if (!urlOrImg) return "";

  // 1. 이미 직렬 이미지 파일(Cloudinary, .jpg, .png, .webp 등)인 경우 그대로 반환
  if (
    urlOrImg.startsWith("data:") ||
    urlOrImg.includes("cloudinary.com") ||
    urlOrImg.includes("cdninstagram.com") ||
    urlOrImg.match(/\.(jpeg|jpg|gif|png|webp|avif)(\?.*)?$/i)
  ) {
    return urlOrImg;
  }

  // 2. 인스타그램 게시물/릴스 URL에서 shortcode 추출 후 공개 썸네일 media 엔드포인트 도출
  const shortcode = extractInstagramShortcode(urlOrImg);
  if (shortcode) {
    return `https://www.instagram.com/p/${shortcode}/media/?size=l`;
  }

  return urlOrImg;
}
