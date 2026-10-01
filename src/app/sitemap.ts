import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXTAUTH_URL || "https://wendybeautyspa.com";
  const [products, categories] = await Promise.all([
    prisma.product.findMany({ where: { status: "ACTIVE" }, select: { slug: true, updatedAt: true } }),
    prisma.category.findMany({ select: { slug: true } })
  ]);
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "daily", priority: 1 },
    { url: `${base}/shop`, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/services`, changeFrequency: "weekly", priority: 0.8 }
  ];
  const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({ url: `${base}/shop/${c.slug}`, changeFrequency: "daily", priority: 0.7 }));
  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({ url: `${base}/product/${p.slug}`, lastModified: p.updatedAt, changeFrequency: "weekly", priority: 0.6 }));
  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}