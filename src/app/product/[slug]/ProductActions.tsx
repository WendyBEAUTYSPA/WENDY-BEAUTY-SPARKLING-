"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { formatNaira } from "@/lib/utils";
import { productEnquiryMessage, waLink, WHATSAPP_PRIMARY } from "@/lib/whatsapp";

export default function ProductActions({ product }: { product: { id: string; name: string; price: number; negotiable: boolean; image?: string } }) {
  const { addItem } = useCart();
  const { isWished, toggle } = useWishlist();
  const [added, setAdded] = useState(false);
  const wished = isWished(product.id);

  function handleAdd() {
    addItem({ productId: product.id, name: product.name, price: product.price, image: product.image, negotiable: product.negotiable });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }
  function handleEnquire() {
    const msg = productEnquiryMessage({ name: product.name, price: formatNaira(product.price), negotiable: product.negotiable });
    window.open(waLink(WHATSAPP_PRIMARY, msg), "_blank");
  }

  return (
    <div className="mt-7 flex flex-wrap gap-3">
      <button onClick={handleAdd} className="rounded-full bg-ink px-7 py-3.5 text-xs font-bold uppercase tracking-wide text-surface">{added ? "Added ✓" : "Add to Bag"}</button>
      <button onClick={() => toggle({ productId: product.id, name: product.name, price: product.price, image: product.image })} className={`rounded-full border px-7 py-3.5 text-xs font-bold uppercase tracking-wide ${wished ? "border-magenta text-magenta" : "border-white/25"}`}>{wished ? "Wishlisted ✓" : "Add to Wishlist"}</button>
      <button onClick={handleEnquire} className="rounded-full bg-[#1F8A57] px-7 py-3.5 text-xs font-bold uppercase tracking-wide text-white">{product.negotiable ? "Negotiate Price" : "WhatsApp Enquiry"}</button>
    </div>
  );
}