import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(2), caption: z.string().optional(), imageUrl: z.string().url().optional().or(z.literal("")),
  ctaLabel: z.string().optional(), ctaUrl: z.string().optional(), active: z.boolean().optional(),
  startDate: z.string().optional(), endDate: z.string().optional()
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  const campaigns = await prisma.campaignBanner.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(campaigns);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  const d = parsed.data;
  const campaign = await prisma.campaignBanner.create({
    data: { title: d.title, caption: d.caption || null, imageUrl: d.imageUrl || null, ctaLabel: d.ctaLabel || null, ctaUrl: d.ctaUrl || null, active: d.active ?? true, startDate: d.startDate ? new Date(d.startDate) : null, endDate: d.endDate ? new Date(d.endDate) : null }
  });
  return NextResponse.json(campaign, { status: 201 });
}