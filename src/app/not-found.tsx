import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-6 text-center">
      <span className="font-display text-6xl italic text-goldSoft">404</span>
      <h1 className="mt-4 text-3xl">We couldn&apos;t find that page</h1>
      <p className="mt-3 text-inkInverseSoft">The link may be outdated, or the item may no longer be available.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/shop" className="rounded-full bg-goldSoft px-7 py-3.5 text-xs font-bold uppercase tracking-wide text-[#241305]">Continue Shopping</Link>
        <Link href="/" className="rounded-full border border-white/25 px-7 py-3.5 text-xs font-bold uppercase tracking-wide">Back to Home</Link>
      </div>
    </section>
  );
}