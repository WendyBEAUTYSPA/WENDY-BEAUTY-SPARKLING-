import { prisma } from "@/lib/prisma";

export default async function AdminOverview() {
  const [products, pendingReviews, pendingBookings, orders] = await Promise.all([
    prisma.product.count(),
    prisma.review.count({ where: { approved: false } }),
    prisma.booking.count({ where: { status: "PENDING" } }),
    prisma.order.count()
  ]);
  const cards = [
    { label: "Total Products", value: products },
    { label: "Reviews Awaiting Approval", value: pendingReviews },
    { label: "Pending Bookings", value: pendingBookings },
    { label: "Total Orders", value: orders }
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c) => (
        <div key={c.label} className="rounded-lg border border-white/10 bg-panel p-6">
          <div className="font-display text-3xl text-goldSoft">{c.value}</div>
          <div className="mt-1 text-xs uppercase tracking-wide text-inkInverseSoft">{c.label}</div>
        </div>
      ))}
    </div>
  );
}