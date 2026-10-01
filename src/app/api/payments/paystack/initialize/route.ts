import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { initializeTransaction } from "@/lib/paystack";
import { z } from "zod";

const schema = z.object({ orderId: z.string(), email: z.string().email() });

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  const { orderId, email } = parsed.data;

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  if (order.isPaid) return NextResponse.json({ error: "This order has already been paid for" }, { status: 400 });

  const origin = req.headers.get("origin") || process.env.NEXTAUTH_URL || "http://localhost:3000";
  const reference = `wbs_${order.id}_${Date.now()}`;

  try {
    const tx = await initializeTransaction({ email, amountNaira: order.total, reference, callbackUrl: `${origin}/checkout/success?orderId=${order.id}`, metadata: { orderId: order.id } });
    await prisma.order.update({ where: { id: order.id }, data: { paystackRef: reference } });
    return NextResponse.json({ authorizationUrl: tx.authorization_url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Payment could not be started" }, { status: 500 });
  }
}