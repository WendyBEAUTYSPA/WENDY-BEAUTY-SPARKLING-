import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import SignOutButton from "./SignOutButton";
import ResendVerificationButton from "./ResendVerificationButton";

export default async function AccountPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/account/login");

  const [bookings, reviews, user] = await Promise.all([
    prisma.booking.findMany({ where: { userId: session.user.id }, include: { service: true }, orderBy: { createdAt: "desc" } }),
    prisma.review.findMany({ where: { userId: session.user.id }, include: { product: true }, orderBy: { createdAt: "desc" } }),
    prisma.user.findUnique({ where: { id: session.user.id }, select: { emailVerified: true } })
  ]);

  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl">My Account</h1>
          <p className="mt-1 text-inkInverseSoft">{session.user.email}</p>
        </div>
        {session.user.role === "ADMIN" && <Link href="/admin" className="rounded-full border border-goldSoft px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-goldSoft">Admin Dashboard</Link>}
      </div>

      {!user?.emailVerified && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-goldSoft/40 bg-goldSoft/10 p-4">
          <p className="text-sm text-inkInverseSoft">Your email address isn&apos;t verified yet.</p>
          <ResendVerificationButton />
        </div>
      )}

      <div className="mt-10">
        <h2 className="text-xl">My Bookings</h2>
        {bookings.length === 0 ? <p className="mt-2 text-sm text-inkInverseSoft">No bookings yet.</p> : (
          <div className="mt-3 space-y-2">
            {bookings.map((b) => (
              <div key={b.id} className="rounded-md border border-white/10 bg-panel p-4 text-sm">
                <div className="flex items-center justify-between"><span>{b.service.name}</span><span className="text-xs uppercase tracking-wide text-goldSoft">{b.status}</span></div>
                {b.preferredDate && <div className="mt-1 text-xs text-inkInverseSoft">{new Date(b.preferredDate).toLocaleDateString()}</div>}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-10">
        <h2 className="text-xl">My Reviews</h2>
        {reviews.length === 0 ? <p className="mt-2 text-sm text-inkInverseSoft">No reviews yet.</p> : (
          <div className="mt-3 space-y-2">
            {reviews.map((r) => (
              <div key={r.id} className="rounded-md border border-white/10 bg-panel p-4 text-sm">
                <div className="flex items-center justify-between"><span>{r.product.name}</span><span className="text-xs uppercase tracking-wide text-inkInverseSoft">{r.approved ? "Published" : "Pending approval"}</span></div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-10"><SignOutButton /></div>
    </section>
  );
}