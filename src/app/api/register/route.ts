import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/verification";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

const schema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().optional()
});

export async function POST(req: Request) {
  const { allowed } = rateLimit({ key: `register:${getClientIp(req)}`, limit: 5, windowMs: 15 * 60 * 1000 });
  if (!allowed) return NextResponse.json({ error: "Too many attempts — please try again later." }, { status: 429 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid input" }, { status: 400 });

  const { name, email, password, phone } = parsed.data;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { name, email, password: hashed, phone, role: "CUSTOMER" } });

  const origin = req.headers.get("origin") || process.env.NEXTAUTH_URL || "http://localhost:3000";
  await sendVerificationEmail(user.id, user.email, origin);

  return NextResponse.json({ id: user.id, email: user.email }, { status: 201 });
}