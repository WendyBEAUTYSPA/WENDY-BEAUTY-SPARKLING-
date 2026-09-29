"use client";

import { useEffect, useState, useCallback } from "react";
import ProductCard, { ProductSummary } from "@/components/ProductCard";

type Category = { slug: string; name: string };

export default function ShopBrowser({ categories, initialCategory }: { categories: Category[]; initialCategory?: string }) {
  const [items, setItems] = useState<ProductSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(initialCategory || "all");
  const [sort, setSort] = useState("newest");

  const fetchProducts = useCallback(async (targetPage: number, replace: boolean) => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(targetPage), sort, ...(category !== "all" ? { category } : {}), ...(query ? { q: query } : {}) });
    const res = await fetch(`/api/products?${params.toString()}`);
    const data = await res.json();
    setItems((prev) => (replace ? data.items : [...prev, ...data.items]));
    setTotal(data.total);
    setPage(data.page);
    setLoading(false);
  }, [category, query, sort]);

  useEffect(() => {
    fetchProducts(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, query, sort]);

  const allCats = [{ slug: "all", name: "All" }, ...categories];

  return (
    <div>
      <div className="mb-7 flex flex-wrap items-center gap-3 rounded-full border border-white/10 bg-panel px-4 py-3">
        <div className="flex min-w-[200px] flex-1 items-center gap-2.5 rounded-full bg-white/5 px-4 py-2.5">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-inkInverseSoft"><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <input type="text" placeholder="Search wigs, dresses, lip gloss, heels…" value={query} onChange={(e) => setQuery(e.target.value)} className="w-full bg-transparent text-sm outline-none placeholder:text-inkInverseSoft" />
        </div>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-full border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs outline-none">
          <option value="newest">Sort: Newest</option>
          <option value="low">Price: Low to High</option>
          <option value="high">Price: High to Low</option>
          <option value="rating">Customer Rating</option>
        </select>
      </div>

      <div className="mb-7 flex flex-wrap gap-2">
        {allCats.map((c) => (
          <button key={c.slug} onClick={() => setCategory(c.slug)} className={`rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-wide transition ${category === c.slug ? "border-goldSoft bg-goldSoft text-[#241305]" : "border-white/10 text-inkInverseSoft hover:border-goldSoft"}`}>{c.name}</button>
        ))}
      </div>

      {items.length === 0 && !loading ? (
        <p className="py-10 text-inkInverseSoft">No products match your search — try another term or category.</p>
      ) : (
        <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">{items.map((p) => <ProductCard key={p.id} product={p} />)}</div>
      )}

      {items.length < total && (
        <div className="mt-10 text-center">
          <button onClick={() => fetchProducts(page + 1, false)} disabled={loading} className="rounded-full border border-white/25 px-7 py-3.5 text-xs font-bold uppercase tracking-wide disabled:opacity-50">{loading ? "Loading…" : "Load More"}</button>
        </div>
      )}
    </div>
  );
}