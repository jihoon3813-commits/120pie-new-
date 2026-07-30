/**
 * 인스타그램 게시물/릴스 URL에서 Shortcode를 파싱하고 대표 썸네일 이미지를 자동으로 도출합니다.
 */
export function extractInstagramShortcode(url: string): string | null {
  if (!url) return null;
  const cleanUrl = url.split("?")[0].split("#")[0];
  const match = cleanUrl.match(/(?:instagram\.com|instagr\.am)\/(?:p|reel|reels|tv)\/([A-Za-z0-9_-]+)/i);
  return match ? match[1] : null;
}

// 실시간 파싱 실패 시 기본 고화질 대체 이미지
export const INSTAGRAM_FALLBACK_IMAGE = "https://scontent-ssn1-1.cdninstagram.com/v/t51.82787-15/755693701_18002053679970075_4628412250315521061_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=105&ig_cache_key=Mzk1MDI3Nzc1NDgzNTYzMDcwNw%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkZFRUQueHBpZHMuMTUwMC5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=PJnV2eWygdUQ7kNvwHFNLfU&_nc_oc=AdoVEIFv2G76tsXxrvmdVfp5s_OULklOGhwuLbYh2N4huZFZrKSpzNxANXK7e8fRUjw&_nc_zt=23&_nc_ht=scontent-ssn1-1.cdninstagram.com&_nc_gid=06YLkUyP3WQ54-hGvOqT9g&_nc_ss=7f689&oh=00_AQFiwGjUPa3_UOPWNozWj3PI_-VlqG_zI8c1FMlOTROalA&oe=6A70E8E0";

// 주요 인스타그램 게시물별 1080p FULL HD 초고화질 매핑
export const INSTAGRAM_HD_MAP: Record<string, string> = {
  "DbSNLBFGvpz": "https://scontent-ssn1-1.cdninstagram.com/v/t51.82787-15/755693701_18002053679970075_4628412250315521061_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=105&ig_cache_key=Mzk1MDI3Nzc1NDgzNTYzMDcwNw%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkZFRUQueHBpZHMuMTUwMC5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=PJnV2eWygdUQ7kNvwHFNLfU&_nc_oc=AdoVEIFv2G76tsXxrvmdVfp5s_OULklOGhwuLbYh2N4huZFZrKSpzNxANXK7e8fRUjw&_nc_zt=23&_nc_ht=scontent-ssn1-1.cdninstagram.com&_nc_gid=06YLkUyP3WQ54-hGvOqT9g&_nc_ss=7f689&oh=00_AQFiwGjUPa3_UOPWNozWj3PI_-VlqG_zI8c1FMlOTROalA&oe=6A70E8E0",
  "DbSLtKLmgfS": "https://scontent-ssn1-1.cdninstagram.com/v/t51.82787-15/757345849_18002052470970075_5827364617452265554_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=111&ig_cache_key=Mzk1MDI3MTMwNDk3NzQ4MzczMA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkZFRUQueHBpZHMuMTA4Ni5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=r9bo6V2nJdMQ7kNvwGGA52d&_nc_oc=Ado-i-xFnz-L5uxIHn1UgRSJjWahL0q-HOb6FURdPNDz9gi-I0YyeYahtfF6RUrO2ZY&_nc_zt=23&_nc_ht=scontent-ssn1-1.cdninstagram.com&_nc_gid=dy_QLEOYxyX6-8ERTN_v4A&_nc_ss=7f689&oh=00_AQFoRUbL_0l1f_jMf8uPVLvhfiRClzkY8eLktwoZwAiecw&oe=6A70BFF2",
  "DZplIYUIHi8": "https://scontent-ssn1-1.cdninstagram.com/v/t51.82787-15/722469487_17996220227970075_8784301918030809357_n.jpg?stp=dst-jpg_e15_tt6&_nc_cat=111&ig_cache_key=MzkyMDgyODI1NDE4NjkyODMxNjE3OTk2MjIwMjI0OTcwMDc1.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNMSVBTLnhwaWRzLjcyMC5zZHIudmlkZW9fZGVmYXVsdF9jb3Zlcl9mcmFtZS5DMyJ9&_nc_ohc=cyYMPL2IHV4Q7kNvwH4ctqX&_nc_oc=AdpZ3Fzdg5qC6s1sKo3sdxteD4biV3T73HexdCoRLPBghKXCc5RLtBwis5nN4VsSwOE&_nc_zt=23&_nc_ht=scontent-ssn1-1.cdninstagram.com&_nc_gid=4A3UExMFdWdEOYtumeCZ0g&_nc_ss=7f689&oh=00_AQF27bqDbaQEqVNENZBu7_LI2shubM3LYbmGH1llj0jiBg&oe=6A70D1EF",
  "DZZgdfeFBQc": "https://scontent-ssn1-1.cdninstagram.com/v/t51.82787-15/721430029_17995398656970075_5216392161691113912_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=105&ig_cache_key=Mzk1MDI3Nzc1NDgzNTYzMDcwNw%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuMTI1NC5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=rsdY8FicouUQ7kNvwFoaB17&_nc_oc=Ado9nCgJUsSvg9G9DxnfwVfEDKaYa1djLIReGUtIlXhiwrtQMDrkj-Use0MO0c3wXd4&_nc_zt=23&_nc_ht=scontent-ssn1-1.cdninstagram.com&_nc_gid=9e0ih9mawZNqJmjzX6IeTg&_nc_ss=7f689&oh=00_AQH_q6_omOwySlQqMTiwAusvSZk4drF9lHwoYRHBt9tULg&oe=6A70D25F",
  "DY3zAT4FMNi": "https://scontent-ssn1-1.cdninstagram.com/v/t51.82787-15/707843563_17993658335970075_5503878348222995434_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=107&ig_cache_key=MzkwNjgxNTUyMzQ4MTI0MDQxOA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkZFRUQueHBpZHMuMTI1NC5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=3qfWx80GcEgQ7kNvwHbd2Dr&_nc_oc=Adr-fFPhVdnq_jhDC30QXg66EXT_oLQTPYxV4FDVy0Owd8iy3LRT2vWcU4W5OGZtWMY&_nc_zt=23&_nc_ht=scontent-ssn1-1.cdninstagram.com&_nc_gid=4o6WTMrCMvyQAzIC-pc7bA&_nc_ss=7f689&oh=00_AQGgJD61wLsZcLWiaBngmEtjqKybmh2CNSReNoQUuLWVEw&oe=6A70D440",
  "DY1irJBFGly": "https://scontent-ssn1-1.cdninstagram.com/v/t51.82787-15/707884969_17993540591970075_5247977965164009382_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=104&ig_cache_key=MzkwNjE4MDc1MDAxNDQ0MTg0Mg%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkZFRUQueHBpZHMuMTI1NC5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=ssL_Sez7XHoQ7kNvwEepB8n&_nc_oc=Adr29934b6OdZxIPebf_MwQBJxMXspZdclVm1d427SvHTL2RadgWGwZvuHWEj0XypyA&_nc_zt=23&_nc_ht=scontent-ssn1-1.cdninstagram.com&_nc_gid=q8GN-2u5gFK8mW1Zfafwsw&_nc_ss=7f689&oh=00_AQGUFSXJVrDdjsSPfkUOU-9-vjVYcsNT8giogJbkMKoVxA&oe=6A70E32B",
};

export function getInstagramThumbnailUrl(urlOrImg: string, fallbackLink?: string): string {
  // 1. fallbackLink(게시물 원본 주소)가 있는 경우 1080p 매핑 우선 점검
  if (fallbackLink) {
    const code = extractInstagramShortcode(fallbackLink);
    if (code && INSTAGRAM_HD_MAP[code]) {
      return INSTAGRAM_HD_MAP[code];
    }
  }

  if (!urlOrImg || !urlOrImg.trim()) {
    return INSTAGRAM_FALLBACK_IMAGE;
  }

  const trimmed = urlOrImg.trim();

  // 2. 인스타그램 게시물 주소인 경우 1080p 매핑 확인
  const code = extractInstagramShortcode(trimmed);
  if (code && INSTAGRAM_HD_MAP[code]) {
    return INSTAGRAM_HD_MAP[code];
  }

  // 3. 기존 구형 Cloudinary 캡처본이거나 weserv 주소인 경우 고화질 이미지 매핑 적용
  if (trimmed.includes("weserv.nl") || (trimmed.includes("lyjyvy54") && trimmed.includes("cloudinary.com"))) {
    return INSTAGRAM_HD_MAP["DbSNLBFGvpz"] || INSTAGRAM_FALLBACK_IMAGE;
  }

  // 4. cdninstagram 또는 직렬 이미지인 경우 그대로 사용
  if (
    trimmed.startsWith("data:") ||
    trimmed.includes("cloudinary.com") ||
    trimmed.includes("cdninstagram.com") ||
    trimmed.includes("fbcdn.net") ||
    trimmed.match(/\.(jpeg|jpg|gif|png|webp|avif)(\?.*)?$/i)
  ) {
    return trimmed;
  }

  return INSTAGRAM_FALLBACK_IMAGE;
}
