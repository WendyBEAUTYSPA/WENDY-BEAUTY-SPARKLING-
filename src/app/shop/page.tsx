import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import ShopBrowser from "./ShopBrowser";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Shop All — Wendy Beauty & Spa",
  description: "Browse the full Wendy Beauty & Spa catalogue — hair & wigs, fashion, jewelry, shoes, makeup, lip products, handbags and more."
};

export default async function ShopPage() {
  const categories = await prisma.category.findMany({ orderBy: { sortOrder: "asc" }, select: { slug: true, name: true } });
  return (
    <section className="py-12 lg:py-16">
      <div className="mx-auto max-w-6xl px-6">
        <span className="text-xs font-bold uppercase tracking-widest text-goldSoft">The shop</span>
        <h1 className="mt-2 text-3xl lg:text-4xl">Browse the collection</h1>
        <p className="mt-2 max-w-[52ch] text-inkInverseSoft">Search, filter and add to your bag — prices marked negotiable can be discussed directly on WhatsApp.</p>
        <div className="mt-8"><ShopBrowser categories={categories} /></div>
      </div>
    </section>
  );
}