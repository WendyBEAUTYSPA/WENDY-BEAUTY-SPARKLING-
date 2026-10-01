import { prisma } from "@/lib/prisma";
import BookingStatusSelect from "./BookingStatusSelect";

export default async function AdminBookingsPage() {
  const bookings = await prisma.booking.findMany({ orderBy: { createdAt: "desc" }, include: { service: true } });
  return (
    <div>
      <h2 className="text-xl">Bookings ({bookings.length})</h2>
      <div className="mt-6 overflow-x-auto rounded-lg border border-white/10">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-panel text-xs uppercase tracking-wide text-inkInverseSoft">
            <tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">Phone</th><th className="px-4 py-3">Service</th><th className="px-4 py-3">Preferred Date</th><th className="px-4 py-3">Status</th></tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {bookings.map((b) => (
              <tr key={b.id}>
                <td className="px-4 py-3">{b.name}</td>
                <td className="px-4 py-3 text-inkInverseSoft">{b.phone}</td>
                <td className="px-4 py-3">{b.service.name}</td>
                <td className="px-4 py-3 text-inkInverseSoft">{b.preferredDate ? new Date(b.preferredDate).toLocaleDateString() : "—"}</td>
                <td className="px-4 py-3"><BookingStatusSelect id={b.id} status={b.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {bookings.length === 0 && <p className="mt-6 text-inkInverseSoft">No bookings yet.</p>}
    </div>
  );
}