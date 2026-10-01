"use client";

import Link from "next/link";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { formatNaira } from "@/lib/utils";

export default function WishlistPage() {
  const { items, toggle } = useWishlist();
  const { addItem } = useCart();

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h1 className="text-3xl">Your wishlist is empty</h1>
        <p className="mt-3 text-inkInverseSoft">Save items you love while you browse.</p>
        <Link href="/shop" className="mt-7 inline-block rounded-full bg-goldSoft px-7 py-3.5 text-xs font-bold uppercase tracking-wide text-[#241305]">Shop Now</Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-4xl px-6 py-12 lg:py-16">
      <h1 className="text-3xl">Wishlist</h1>
      <div className="mt-8 divide-y divide-white/10 rounded-lg border border-white/10 bg-panel">
        {items.map((i) => (
          <div key={i.productId} className="flex items-center gap-4 p-5">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md" style={{ background: i.image ? undefined : "linear-gradient(150deg,#6E1E3D,#2A0E1C)" }}>
              {i.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={i.image} alt={i.name} className="h-full w-full object-cover" />
              ) : <span className="font-display text-lg italic text-white">{i.name.charAt(0)}</span>}
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold">{i.name}</div>
              <div className="mt-0.5 text-xs text-inkInverseSoft">{formatNaira(i.price)}</div>
              <div className="mt-2 flex gap-2">
                <button onClick={() => { addItem({ productId: i.productId, name: i.name, price: i.price, image: i.image }); toggle(i); }} className="rounded-full bg-ink px-4 py-1.5 text-[0.66rem] font-bold uppercase tracking-wide text-surface">Move to Bag</button>
                <button onClick={() => toggle(i)} className="text-[0.68rem] font-bold uppercase tracking-wide text-magenta">Remove</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}