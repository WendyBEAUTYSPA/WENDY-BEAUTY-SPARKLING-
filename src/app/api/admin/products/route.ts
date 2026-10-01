import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2), description: z.string().optional(), price: z.number().positive(),
  oldPrice: z.number().positive().optional().nullable(), negotiable: z.boolean().optional(),
  stock: z.number().int().nonnegative().default(0), categoryId: z.string(),
  tag: z.string().optional().nullable(), sku: z.string().optional().nullable(),
  images: z.array(z.object({ url: z.string().url(), alt: z.string().optional() })).optional()
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) return NextResponse.json({ error: "Admin access required" }, { status: 403 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });

  const data = parsed.data;
  const baseSlug = slugify(data.name);
  let slug = baseSlug;
  let n = 1;
  while (await prisma.product.findUnique({ where: { slug } })) { slug = `${baseSlug}-${++n}`; }

  const product = await prisma.product.create({
    data: {
      name: data.name, slug, description: data.description, price: data.price, oldPrice: data.oldPrice ?? null,
      negotiable: data.negotiable ?? false, stock: data.stock, categoryId: data.categoryId, tag: data.tag ?? null,
      sku: data.sku ?? null, status: "ACTIVE",
      images: data.images ? { create: data.images.map((img, i) => ({ url: img.url, alt: img.alt, sortOrder: i })) } : undefined
    }
  });
  return NextResponse.json(product, { status: 201 });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" }, include: { category: { select: { name: true } } } });
  return NextResponse.json(products);
}