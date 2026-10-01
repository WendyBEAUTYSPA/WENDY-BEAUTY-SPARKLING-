"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploadField from "@/components/ImageUploadField";

type Category = { id: string; name: string };

export default function ProductForm({ categories, initial, productId }: {
  categories: Category[];
  initial?: { name: string; description?: string | null; price: number; oldPrice?: number | null; negotiable: boolean; stock: number; status: string; tag?: string | null; sku?: string | null; categoryId: string; images?: string[] };
  productId?: string;
}) {
  const router = useRouter();
  const [name, setName] = useState(initial?.name || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [price, setPrice] = useState(initial?.price?.toString() || "");
  const [oldPrice, setOldPrice] = useState(initial?.oldPrice?.toString() || "");
  const [negotiable, setNegotiable] = useState(initial?.negotiable ?? false);
  const [stock, setStock] = useState(initial?.stock?.toString() || "0");
  const [status, setStatus] = useState(initial?.status || "ACTIVE");
  const [tag, setTag] = useState(initial?.tag || "");
  const [sku, setSku] = useState(initial?.sku || "");
  const [categoryId, setCategoryId] = useState(initial?.categoryId || categories[0]?.id || "");
  const [images, setImages] = useState<string[]>(initial?.images?.length ? initial.images : [""]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function setImageAt(index: number, url: string) { setImages((prev) => prev.map((img, i) => (i === index ? url : img))); }
  function addImageSlot() { setImages((prev) => [...prev, ""]); }
  function removeImageAt(index: number) { setImages((prev) => prev.filter((_, i) => i !== index)); }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const cleanImages = images.filter((url) => url.trim()).map((url) => ({ url }));
    const payload = { name, description, price: Number(price), oldPrice: oldPrice ? Number(oldPrice) : null, negotiable, stock: Number(stock), status, tag: tag || null, sku: sku || null, categoryId, images: cleanImages };
    const res = await fetch(productId ? `/api/products/${productId}` : "/api/admin/products", { method: productId ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    setSaving(false);
    if (!res.ok) { const data = await res.json().catch(() => ({})); setError(data.error || "Something went wrong"); return; }
    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="max-w-xl space-y-4">
      <div><label className="mb-1.5 block text-xs uppercase tracking-wide text-inkInverseSoft">Name</label><input required value={name} onChange={(e) => setName(e.target.value)} className="field-input" /></div>
      <div><label className="mb-1.5 block text-xs uppercase tracking-wide text-inkInverseSoft">Description</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} className="field-input min-h-[90px]" /></div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="mb-1.5 block text-xs uppercase tracking-wide text-inkInverseSoft">Price (₦)</label><input required type="number" min={0} value={price} onChange={(e) => setPrice(e.target.value)} className="field-input" /></div>
        <div><label className="mb-1.5 block text-xs uppercase tracking-wide text-inkInverseSoft">Old Price (₦, optional)</label><input type="number" min={0} value={oldPrice} onChange={(e) => setOldPrice(e.target.value)} className="field-input" /></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="mb-1.5 block text-xs uppercase tracking-wide text-inkInverseSoft">Stock</label><input required type="number" min={0} value={stock} onChange={(e) => setStock(e.target.value)} className="field-input" /></div>
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-wide text-inkInverseSoft">Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="field-input">
            <option value="ACTIVE">Active</option><option value="DRAFT">Draft</option><option value="OUT_OF_STOCK">Out of Stock</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-wide text-inkInverseSoft">Category</label>
          <select required value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="field-input">
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-wide text-inkInverseSoft">Tag (optional)</label>
          <select value={tag} onChange={(e) => setTag(e.target.value)} className="field-input">
            <option value="">None</option><option value="New">New</option><option value="Sale">Sale</option><option value="Trending">Trending</option>
          </select>
        </div>
      </div>
      <div><label className="mb-1.5 block text-xs uppercase tracking-wide text-inkInverseSoft">SKU (optional)</label><input value={sku} onChange={(e) => setSku(e.target.value)} className="field-input" /></div>
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <span className="block text-xs uppercase tracking-wide text-inkInverseSoft">Product Images</span>
          <button type="button" onClick={addImageSlot} className="text-[0.66rem] font-bold uppercase tracking-wide text-goldSoft">+ Add Another Image</button>
        </div>
        <div className="space-y-4">
          {images.map((url, i) => (
            <div key={i} className="flex items-start gap-3 rounded-md border border-white/10 p-3">
              <div className="flex-1"><ImageUploadField label={i === 0 ? "Primary image" : `Image ${i + 1}`} value={url} onChange={(v) => setImageAt(i, v)} /></div>
              {images.length > 1 && <button type="button" onClick={() => removeImageAt(i)} className="mt-6 text-[0.66rem] font-bold uppercase tracking-wide text-magenta">Remove</button>}
            </div>
          ))}
        </div>
        <p className="mt-1.5 text-[0.68rem] text-inkInverseSoft/70">The first image is used as the product&apos;s main photo everywhere it's listed.</p>
      </div>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={negotiable} onChange={(e) => setNegotiable(e.target.checked)} /> Price is negotiable</label>
      {error && <p className="text-xs text-magenta">{error}</p>}
      <button type="submit" disabled={saving} className="rounded-full bg-goldSoft px-7 py-3 text-xs font-bold uppercase tracking-wide text-[#241305] disabled:opacity-60">{saving ? "Saving…" : productId ? "Save Changes" : "Create Product"}</button>
    </form>
  );
}