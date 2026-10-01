import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rateLimit, getClientIp } from "@/lib/rateLimit";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2), phone: z.string().min(7), email: z.string().email().optional().or(z.literal("")),
  serviceId: z.string(), preferredDate: z.string().optional(), notes: z.string().optional()
});

export async function POST(req: Request) {
  const { allowed } = rateLimit({ key: `booking:${getClientIp(req)}`, limit: 10, windowMs: 60 * 60 * 1000 });
  if (!allowed) return NextResponse.json({ error: "Too many booking requests — please try again later." }, { status: 429 });

  const session = await getServerSession(authOptions);
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  const { name, phone, email, serviceId, preferredDate, notes } = parsed.data;

  const booking = await prisma.booking.create({
    data: { userId: session?.user?.id, name, phone, email: email || null, serviceId, preferredDate: preferredDate ? new Date(preferredDate) : null, notes }
  });
  return NextResponse.json(booking, { status: 201 });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  const bookings = await prisma.booking.findMany({ orderBy: { createdAt: "desc" }, include: { service: true, user: { select: { email: true } } } });
  return NextResponse.json(bookings);
}