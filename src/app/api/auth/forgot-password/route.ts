import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { rateLimit, getClientIp } from "@/lib/rateLimit";
import { z } from "zod";

const schema = z.object({ email: z.string().email() });

export async function POST(req: Request) {
  const { allowed } = rateLimit({ key: `forgot-password:${getClientIp(req)}`, limit: 5, windowMs: 15 * 60 * 1000 });
  if (!allowed) return NextResponse.json({ error: "Too many attempts — please try again later." }, { status: 429 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Enter a valid email" }, { status: 400 });
  const { email } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (user) {
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60);
    await prisma.passwordResetToken.create({ data: { token, userId: user.id, expiresAt } });
    const origin = req.headers.get("origin") || process.env.NEXTAUTH_URL || "http://localhost:3000";
    const resetUrl = `${origin}/account/reset-password?token=${token}`;
    await sendEmail({
      to: email,
      subject: "Reset your Wendy Beauty & Spa password",
      html: `<p>Someone requested a password reset for this account.</p><p><a href="${resetUrl}">Click here to reset your password</a> — this link expires in 1 hour.</p><p>If you didn't request this, you can safely ignore this email.</p>`
    }).catch((err) => console.error("Failed to send reset email:", err));
  }
  return NextResponse.json({ ok: true });
}