import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rateLimit, getClientIp } from "@/lib/rateLimit";
import { z } from "zod";

const schema = z.object({
  productId: z.string(), name: z.string().min(2), rating: z.number().int().min(1).max(5),
  text: z.string().min(5), imageUrl: z.string().url().optional()
});

export async function POST(req: Request) {
  const { allowed } = rateLimit({ key: `review:${getClientIp(req)}`, limit: 10, windowMs: 60 * 60 * 1000 });
  if (!allowed) return NextResponse.json({ error: "Too many reviews submitted — please try again later." }, { status: 429 });

  const session = await getServerSession(authOptions);
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  const { productId, name, rating, text, imageUrl } = parsed.data;

  let verified = false;
  if (session?.user?.id) {
    const priorOrder = await prisma.orderItem.findFirst({ where: { productId, order: { userId: session.user.id, status: { in: ["CONFIRMED", "FULFILLED"] } } } });
    verified = Boolean(priorOrder);
  }

  const review = await prisma.review.create({ data: { productId, userId: session?.user?.id, name, rating, text, imageUrl, verified, approved: false } });
  return NextResponse.json(review, { status: 201 });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  const reviews = await prisma.review.findMany({ orderBy: { createdAt: "desc" }, include: { product: { select: { name: true, slug: true } } } });
  return NextResponse.json(reviews);
}