import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const product = await prisma.product.findFirst({
    where: { OR: [{ id: params.id }, { slug: params.id }] },
    include: { category: true, images: { orderBy: { sortOrder: "asc" } }, reviews: { where: { approved: true }, orderBy: { createdAt: "desc" } } }
  });
  if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });
  return NextResponse.json(product);
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) return NextResponse.json({ error: "Admin access required" }, { status: 403 });

  const body = await req.json();
  const updated = await prisma.product.update({
    where: { id: params.id },
    data: {
      name: body.name, description: body.description, price: body.price, oldPrice: body.oldPrice ?? null,
      negotiable: body.negotiable ?? false, stock: body.stock, status: body.status, tag: body.tag ?? null,
      categoryId: body.categoryId, sku: body.sku ?? null,
      ...(Array.isArray(body.images) ? { images: { deleteMany: {}, create: body.images.map((img: { url: string; alt?: string }, i: number) => ({ url: img.url, alt: img.alt, sortOrder: i })) } } : {})
    }
  });
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  await prisma.product.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}