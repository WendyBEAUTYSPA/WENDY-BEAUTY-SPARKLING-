import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const q = searchParams.get("q")?.trim();
  const sort = searchParams.get("sort") || "newest";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(60, Math.max(1, parseInt(searchParams.get("limit") || "24", 10)));

  const where: Prisma.ProductWhereInput = {
    status: "ACTIVE",
    ...(category && category !== "all" ? { category: { slug: category } } : {}),
    ...(q ? { name: { contains: q, mode: "insensitive" } } : {})
  };

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sort === "low" ? { price: "asc" } :
    sort === "high" ? { price: "desc" } :
    sort === "rating" ? { rating: "desc" } :
    { createdAt: "desc" };

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where, orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: { category: { select: { slug: true, name: true } }, images: { take: 1 } }
    }),
    prisma.product.count({ where })
  ]);

  return NextResponse.json({ items, page, limit, total, totalPages: Math.ceil(total / limit) });
}