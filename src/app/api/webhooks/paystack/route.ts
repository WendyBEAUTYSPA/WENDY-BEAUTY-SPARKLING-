import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyWebhookSignature, amountMatchesOrder } from "@/lib/paystack";

export async function POST(req: Request) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return NextResponse.json({ error: "Paystack is not configured" }, { status: 500 });

  const rawBody = await req.text();
  const signature = req.headers.get("x-paystack-signature");
  if (!verifyWebhookSignature(rawBody, signature, secret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(rawBody);
  if (event.event === "charge.success") {
    const reference: string | undefined = event.data?.reference;
    const amountKobo: number | undefined = event.data?.amount;
    if (reference) {
      const order = await prisma.order.findUnique({ where: { paystackRef: reference } });
      if (order && !order.isPaid) {
        if (amountMatchesOrder(amountKobo, order.total)) {
          await prisma.order.update({ where: { id: order.id }, data: { isPaid: true, paidAt: new Date(), status: "CONFIRMED" } });
        } else {
          console.error(`Paystack webhook amount mismatch for order ${order.id}`);
        }
      }
    }
  }
  return NextResponse.json({ received: true });
}