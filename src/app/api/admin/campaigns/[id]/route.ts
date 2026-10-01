import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  const body = await req.json();
  const campaign = await prisma.campaignBanner.update({
    where: { id: params.id },
    data: { title: body.title, caption: body.caption || null, imageUrl: body.imageUrl || null, ctaLabel: body.ctaLabel || null, ctaUrl: body.ctaUrl || null, active: body.active, startDate: body.startDate ? new Date(body.startDate) : null, endDate: body.endDate ? new Date(body.endDate) : null }
  });
  return NextResponse.json(campaign);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  await prisma.campaignBanner.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}