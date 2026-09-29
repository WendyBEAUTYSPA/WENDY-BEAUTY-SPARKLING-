"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

export type WishLine = { productId: string; name: string; price: number; image?: string | null };

type WishlistContextType = { items: WishLine[]; isWished: (productId: string) => boolean; toggle: (item: WishLine) => void };

const WishlistContext = createContext<WishlistContextType | null>(null);
const STORAGE_KEY = "wbs_wishlist_v1";

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch {}
  }, [items, hydrated]);

  const isWished = useCallback((productId: string) => items.some((i) => i.productId === productId), [items]);

  const toggle = useCallback((item: WishLine) => {
    setItems((prev) => {
      const exists = prev.some((i) => i.productId === item.productId);
      if (exists) return prev.filter((i) => i.productId !== item.productId);
      return [...prev, item];
    });
    fetch("/api/wishlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: item.productId })
    }).catch(() => {});
  }, []);

  return <WishlistContext.Provider value={{ items, isWished, toggle }}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}