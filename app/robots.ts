import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://120piecoffee.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/"]
    },
    sitemap: `${baseUrl}/sitemap.xml`
  };
}
