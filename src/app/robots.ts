import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXTAUTH_URL || "https://wendybeautyspa.com";
  return { rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/account", "/cart", "/wishlist", "/api", "/checkout"] }, sitemap: `${base}/sitemap.xml` };
}