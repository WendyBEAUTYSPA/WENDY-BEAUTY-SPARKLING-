import { notFound } from "next/navigation";
import { cache } from "react";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import ProductActions from "./ProductActions";
import ReviewForm from "./ReviewForm";
import ProductGallery from "./ProductGallery";
import { formatNaira } from "@/lib/utils";

export const revalidate = 30;

const getProduct = cache(async (slug: string) => {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
      reviews: { where: { approved: true }, orderBy: { createdAt: "desc" } }
    }
  });
});

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getProduct(params.slug);
  if (!product) return {};
  const description = product.description || `${product.name} — ${formatNaira(product.price)}${product.negotiable ? " (negotiable)" : ""}. ${product.category.name} at Wendy Beauty & Spa.`;
  const image = product.images[0]?.url;
  return { title: `${product.name} — Wendy Beauty & Spa`, description, openGraph: { title: product.name, description, images: image ? [{ url: image }] : undefined } };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);
  if (!product) notFound();
  const image = product.images[0]?.url;

  return (
    <section className="mx-auto max-w-6xl px-6 py-12 lg:py-16">
      <div className="grid gap-12 lg:grid-cols-2">
        <ProductGallery images={product.images} name={product.name} />
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-goldSoft">{product.category.name}</span>
          <h1 className="mt-2 text-3xl lg:text-4xl">{product.name}</h1>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-2xl font-extrabold">{formatNaira(product.price)}</span>
            {product.oldPrice && <span className="text-lg text-inkInverseSoft line-through">{formatNaira(product.oldPrice)}</span>}
          </div>
          {product.negotiable && <span className="mt-2 inline-block text-xs font-extrabold uppercase tracking-wide text-rose">Price Negotiable</span>}
          {product.description && <p className="mt-5 text-inkInverseSoft">{product.description}</p>}
          <p className="mt-4 text-sm text-inkInverseSoft">
            {product.stock > 0 ? `${product.stock} in stock` : "Currently unavailable"}
            {product.ratingCount > 0 && <> · ★ {product.rating.toFixed(1)} ({product.ratingCount} reviews)</>}
          </p>
          <ProductActions product={{ id: product.id, name: product.name, price: product.price, negotiable: product.negotiable, image }} />
        </div>
      </div>

      <div className="mt-20 grid gap-10 lg:grid-cols-[1fr_360px]">
        <div>
          <h2 className="text-2xl">Customer Reviews</h2>
          {product.reviews.length === 0 ? (
            <p className="mt-3 text-inkInverseSoft">No reviews yet — be the first to share your experience.</p>
          ) : (
            <div className="mt-5 space-y-4">
              {product.reviews.map((r) => (
                <div key={r.id} className="rounded-lg border border-white/10 bg-panel p-5">
                  <div className="text-goldSoft">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</div>
                  <p className="mt-2 text-sm text-inkInverseSoft">&ldquo;{r.text}&rdquo;</p>
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span>{r.name}</span>
                    {r.verified && <span className="font-bold uppercase tracking-wide text-[#7FCF9B]">Verified Purchase</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <ReviewForm productId={product.id} />
      </div>
    </section>
  );
}