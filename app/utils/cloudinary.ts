/**
 * Cloudinary URL Optimization Utility
 * 
 * Automatically appends 'f_auto,q_auto' to Cloudinary image and video URLs
 * to optimize delivery format and quality based on the client browser.
 */
export function optimizeCloudinaryUrl(url: string | undefined | null): string {
  if (!url) return "";
  if (typeof url !== "string") return url;
  
  // Only process Cloudinary URLs
  if (!url.includes("res.cloudinary.com")) return url;
  
  // Ensure b_white is always present for transparent/dark background images (누끼)
  if (url.includes("/upload/")) {
    // If already has optimization params but missing b_white, inject b_white
    if ((url.includes("f_auto") || url.includes("q_auto")) && !url.includes("b_white")) {
      return url.replace("/upload/", "/upload/b_white,");
    }
    // If no optimization params at all, add all three
    if (!url.includes("f_auto") && !url.includes("q_auto")) {
      return url.replace("/upload/", "/upload/b_white,f_auto,q_auto/");
    }
  }
  
  return url;
}
