import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

export async function sendVerificationEmail(userId: string, email: string, origin: string) {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24);
  await prisma.emailVerificationToken.create({ data: { token, userId, expiresAt } });
  const verifyUrl = `${origin}/account/verify-email?token=${token}`;
  await sendEmail({
    to: email,
    subject: "Verify your email — Wendy Beauty & Spa",
    html: `<p>Welcome to Wendy Beauty &amp; Spa!</p><p><a href="${verifyUrl}">Click here to verify your email address</a> — this link expires in 24 hours.</p><p>If you didn't create this account, you can ignore this email.</p>`
  }).catch((err) => console.error("Failed to send verification email:", err));
}