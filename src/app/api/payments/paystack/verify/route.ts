import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyTransaction } from "@/lib/paystack";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("orderId");
  if (!orderId) return NextResponse.json({ error: "orderId is required" }, { status: 400 });

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  if (order.isPaid) return NextResponse.json({ paid: true, order });
  if (!order.paystackRef) return NextResponse.json({ paid: false, error: "No payment was started for this order" });

  try {
    const tx = await verifyTransaction(order.paystackRef);
    const paid = tx.status === "success" && tx.amount === order.total * 100;
    if (paid) {
      const updated = await prisma.order.update({ where: { id: order.id }, data: { isPaid: true, paidAt: new Date(), status: "CONFIRMED" } });
      return NextResponse.json({ paid: true, order: updated });
    }
    return NextResponse.json({ paid: false, error: "Payment was not successful" });
  } catch (err: any) {
    return NextResponse.json({ paid: false, error: err.message || "Verification failed" }, { status: 500 });
  }
}