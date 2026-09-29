"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/wishlist", label: "Wishlist" },
  { href: "/cart", label: "Cart" },
  { href: "/services", label: "Book" }
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-[55] flex justify-around border-t border-white/10 bg-bg/95 px-1 pb-[calc(8px+env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl lg:hidden">
      {ITEMS.map((item) => {
        const active = pathname === item.href;
        return (
          <Link key={item.href} href={item.href} className={`flex flex-col items-center gap-0.5 px-2 text-[0.6rem] ${active ? "text-goldSoft" : "text-inkInverseSoft"}`}>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}