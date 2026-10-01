import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  const { approved } = await req.json();
  const review = await prisma.review.update({ where: { id: params.id }, data: { approved: Boolean(approved) } });

  if (approved) {
    const agg = await prisma.review.aggregate({ where: { productId: review.productId, approved: true }, _avg: { rating: true }, _count: true });
    await prisma.product.update({ where: { id: review.productId }, data: { rating: agg._avg.rating ?? 0, ratingCount: agg._count } });
  }
  return NextResponse.json(review);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  await prisma.review.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}