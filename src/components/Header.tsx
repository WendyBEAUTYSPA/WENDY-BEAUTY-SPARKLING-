"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/shop/hair", label: "Hair & Wigs" },
  { href: "/shop/fashion", label: "Fashion" },
  { href: "/services", label: "Beauty & Spa" }
];

export default function Header() {
  const { count } = useCart();
  const { items } = useWishlist();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-bg/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] max-w-6xl items-center justify-between gap-5 px-6">
        <button className="flex h-10 w-10 items-center justify-center rounded-full text-inkInverse lg:hidden" onClick={() => setMobileOpen((v) => !v)} aria-label="Menu">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <Link href="/" className="flex flex-col leading-none">
          <span className="font-display text-2xl">Wendy <em className="text-goldSoft not-italic italic">Beauty</em> &amp; Spa</span>
          <span className="mt-0.5 text-[0.58rem] uppercase tracking-[0.22em] text-inkInverseSoft">Beauty · Fashion · Hair · Cosmetics</span>
        </Link>

        <nav className="hidden gap-7 lg:flex">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="text-xs font-semibold uppercase tracking-wide text-inkInverseSoft transition hover:text-goldSoft">{l.label}</Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Link href="/wishlist" className="relative flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-white/5" aria-label="Wishlist">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
            </svg>
            {items.length > 0 && <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-magenta px-1 text-[0.62rem] font-extrabold text-white">{items.length}</span>}
          </Link>
          <Link href="/cart" className="relative flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-white/5" aria-label="Cart">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6h15l-1.5 9h-12z" /><path d="M6 6 5 2H2" /><circle cx="9" cy="20" r="1.4" /><circle cx="17" cy="20" r="1.4" />
            </svg>
            {count > 0 && <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-magenta px-1 text-[0.62rem] font-extrabold text-white">{count}</span>}
          </Link>
          <Link href={session ? "/account" : "/account/login"} className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-white/5" aria-label="Account">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="8" r="4" /><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
            </svg>
          </Link>
        </div>
      </div>

      {mobileOpen && (
        <nav className="flex flex-col gap-1 border-t border-white/10 px-6 py-3 lg:hidden">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="py-2 text-sm uppercase tracking-wide text-inkInverseSoft" onClick={() => setMobileOpen(false)}>{l.label}</Link>
          ))}
        </nav>
      )}
    </header>
  );
}