import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import ShopBrowser from "../ShopBrowser";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: { category: string } }): Promise<Metadata> {
  const category = await prisma.category.findUnique({ where: { slug: params.category } });
  if (!category) return {};
  return { title: `${category.name} — Wendy Beauty & Spa`, description: category.description || `Shop ${category.name} at Wendy Beauty & Spa — ${category.heroLabel || "new arrivals weekly"}.` };
}

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const [category, categories] = await Promise.all([
    prisma.category.findUnique({ where: { slug: params.category } }),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" }, select: { slug: true, name: true } })
  ]);
  if (!category) notFound();
  return (
    <section className="py-12 lg:py-16">
      <div className="mx-auto max-w-6xl px-6">
        <span className="text-xs font-bold uppercase tracking-widest text-goldSoft">Category</span>
        <h1 className="mt-2 text-3xl lg:text-4xl">{category.name}</h1>
        {category.description && <p className="mt-2 max-w-[52ch] text-inkInverseSoft">{category.description}</p>}
        <div className="mt-8"><ShopBrowser categories={categories} initialCategory={category.slug} /></div>
      </div>
    </section>
  );
}