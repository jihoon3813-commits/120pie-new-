/**
 * Cloudinary URL Optimization Utility
 * 
 * Automatically appends 'f_auto,q_auto' to Cloudinary image and video URLs
 * to optimize delivery format and quality based on the client browser.
 */
export function optimizeCloudinaryUrl(
  url: string | undefined | null,
  options?: { whiteBg?: boolean }
): string {
  if (!url) return "";
  if (typeof url !== "string") return url;
  
  // Only process Cloudinary URLs
  if (!url.includes("res.cloudinary.com")) return url;
  
  const bgParam = options?.whiteBg ? "b_white," : "";
  
  if (url.includes("/upload/")) {
    // If url already has b_white but whiteBg is false, remove b_white
    if (!options?.whiteBg && url.includes("b_white,")) {
      url = url.replace("b_white,", "");
    }
    
    // Add f_auto,q_auto if missing
    if (!url.includes("f_auto") && !url.includes("q_auto")) {
      return url.replace("/upload/", `/upload/${bgParam}f_auto,q_auto/`);
    }
    
    if (options?.whiteBg && !url.includes("b_white")) {
      return url.replace("/upload/", "/upload/b_white,");
    }
  }
  
  return url;
}
