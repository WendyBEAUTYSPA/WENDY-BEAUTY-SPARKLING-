import { prisma } from "@/lib/prisma";
import { formatNaira } from "@/lib/utils";
import OrderStatusSelect from "./OrderStatusSelect";
import RefundButton from "./RefundButton";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({ orderBy: { createdAt: "desc" }, include: { items: { include: { product: { select: { name: true } } } } } });
  return (
    <div>
      <h2 className="text-xl">Orders ({orders.length})</h2>
      <div className="mt-6 space-y-3">
        {orders.map((o) => (
          <div key={o.id} className="rounded-lg border border-white/10 bg-panel p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-sm font-semibold">{o.customerName}</span>
                <span className="ml-2 text-xs text-inkInverseSoft">{o.customerPhone}</span>
                {o.isPaid && <span className="ml-2 rounded-full bg-[#7FCF9B]/15 px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wide text-[#7FCF9B]">Paid Online</span>}
                {o.refunded && <span className="ml-2 rounded-full bg-magenta/15 px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wide text-magenta">Refunded</span>}
              </div>
              <div className="flex items-center gap-3">
                <span className="font-display text-lg text-goldSoft">{formatNaira(o.total)}</span>
                <OrderStatusSelect id={o.id} status={o.status} />
              </div>
            </div>
            <ul className="mt-3 space-y-1 text-sm text-inkInverseSoft">
              {o.items.map((it) => <li key={it.id}>{it.product.name} × {it.quantity} — {formatNaira(it.price * it.quantity)}</li>)}
            </ul>
            {o.notes && <p className="mt-2 text-xs text-inkInverseSoft">Note: {o.notes}</p>}
            <div className="mt-3 flex items-center justify-between">
              <p className="text-[0.68rem] text-inkInverseSoft/70">{new Date(o.createdAt).toLocaleString()}</p>
              {o.isPaid && !o.refunded && <RefundButton id={o.id} />}
            </div>
          </div>
        ))}
        {orders.length === 0 && <p className="text-inkInverseSoft">No orders yet.</p>}
      </div>
    </div>
  );
}