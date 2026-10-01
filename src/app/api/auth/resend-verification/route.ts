import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/verification";
import { rateLimit } from "@/lib/rateLimit";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  const { allowed } = rateLimit({ key: `resend-verify:${session.user.id}`, limit: 3, windowMs: 15 * 60 * 1000 });
  if (!allowed) return NextResponse.json({ error: "Too many attempts — please try again later." }, { status: 429 });

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return NextResponse.json({ error: "Account not found" }, { status: 404 });
  if (user.emailVerified) return NextResponse.json({ ok: true, alreadyVerified: true });

  const origin = req.headers.get("origin") || process.env.NEXTAUTH_URL || "http://localhost:3000";
  await sendVerificationEmail(user.id, user.email, origin);
  return NextResponse.json({ ok: true });
}