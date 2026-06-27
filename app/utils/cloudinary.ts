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
  
  // If it already has f_auto or q_auto, don't add it again
  if (url.includes("f_auto") || url.includes("q_auto")) return url;
  
  // Insert f_auto,q_auto after /upload/
  if (url.includes("/upload/")) {
    return url.replace("/upload/", "/upload/f_auto,q_auto/");
  }
  
  return url;
}
