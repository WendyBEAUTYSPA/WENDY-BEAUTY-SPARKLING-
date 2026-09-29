"use client";

import Link from "next/link";
import { formatNaira } from "@/lib/utils";
import { productEnquiryMessage, waLink, WHATSAPP_PRIMARY } from "@/lib/whatsapp";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

export type ProductSummary = {
  id: string; slug: string; name: string; price: number; oldPrice?: number | null;
  negotiable: boolean; tag?: string | null;
  category: { slug: string; name: string };
  images: { url: string; alt?: string | null }[];
};

export default function ProductCard({ product }: { product: ProductSummary }) {
  const { addItem } = useCart();
  const { isWished, toggle } = useWishlist();
  const wished = isWished(product.id);
  const image = product.images[0]?.url;

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    addItem({ productId: product.id, name: product.name, price: product.price, image, negotiable: product.negotiable });
  }
  function handleWish(e: React.MouseEvent) {
    e.preventDefault();
    toggle({ productId: product.id, name: product.name, price: product.price, image });
  }
  function handleEnquire(e: React.MouseEvent) {
    e.preventDefault();
    const msg = productEnquiryMessage({ name: product.name, price: formatNaira(product.price), negotiable: product.negotiable });
    window.open(waLink(WHATSAPP_PRIMARY, msg), "_blank");
  }

  return (
    <Link href={`/product/${product.slug}`} className="group flex flex-col overflow-hidden rounded-lg bg-surface text-ink transition hover:-translate-y-1">
      <div className="relative flex aspect-square items-center justify-center overflow-hidden" style={{ background: image ? undefined : "linear-gradient(150deg,#6E1E3D,#2A0E1C)" }}>
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={product.images[0]?.alt || product.name} className="h-full w-full object-cover" />
        ) : (
          <span className="font-display text-4xl italic text-white/85">{product.name.charAt(0)}</span>
        )}
        {product.tag && (
          <span className={`absolute left-2.5 top-2.5 rounded-full px-2.5 py-1 text-[0.6rem] font-extrabold uppercase tracking-wide text-white ${product.tag === "Sale" ? "bg-magenta" : "bg-bg/70"}`}>{product.tag}</span>
        )}
        <button onClick={handleWish} aria-label="Toggle wishlist" className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/85 transition hover:scale-105">
          <svg width="15" height="15" viewBox="0 0 24 24" fill={wished ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" className={wished ? "text-magenta" : "text-wine"}>
            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
          </svg>
        </button>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="text-[0.62rem] font-bold uppercase tracking-wide text-inkSoft">{product.category.name}</span>
        <span className="font-display text-base leading-tight">{product.name}</span>
        <div className="flex items-baseline gap-2">
          <span className="text-base font-extrabold">{formatNaira(product.price)}</span>
          {product.oldPrice && <span className="text-sm text-inkSoft line-through">{formatNaira(product.oldPrice)}</span>}
        </div>
        {product.negotiable && <span className="text-[0.66rem] font-extrabold uppercase tracking-wide text-wine">Price Negotiable</span>}
        <div className="mt-auto flex gap-2 pt-2">
          <button onClick={handleAdd} className="flex-1 rounded-full bg-ink px-3 py-2.5 text-[0.66rem] font-bold uppercase tracking-wide text-surface">Add to Bag</button>
          <button onClick={handleEnquire} className="flex-1 rounded-full bg-[#1F8A57] px-3 py-2.5 text-[0.66rem] font-bold uppercase tracking-wide text-white">WhatsApp</button>
        </div>
      </div>
    </Link>
  );
}