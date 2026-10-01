"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { formatNaira } from "@/lib/utils";
import { cartCheckoutMessage, waLink, WHATSAPP_PRIMARY } from "@/lib/whatsapp";

export default function CartPage() {
  const { lines, changeQty, removeItem, clear, total } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "paying" | "error">("idle");
  const [error, setError] = useState("");

  async function createOrder() {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customerName: name, customerPhone: phone, customerEmail: email || undefined, notes, items: lines.map((l) => ({ productId: l.productId, quantity: l.qty })) })
    });
    if (!res.ok) throw new Error("Could not save order");
    return res.json();
  }

  async function checkoutWhatsApp(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !phone) return;
    setStatus("sending");
    setError("");
    try { await createOrder(); } catch {}
    const msg = cartCheckoutMessage({ lines: lines.map((l) => ({ name: l.name, qty: l.qty, price: formatNaira(l.price) })), total: formatNaira(total) });
    window.open(waLink(WHATSAPP_PRIMARY, msg), "_blank");
    setStatus("idle");
    clear();
  }

  async function payNow() {
    if (!name || !phone || !email) { setError("Name, phone and email are required to pay online."); return; }
    setStatus("paying");
    setError("");
    try {
      const order = await createOrder();
      const res = await fetch("/api/payments/paystack/initialize", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orderId: order.id, email }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not start payment");
      window.location.href = data.authorizationUrl;
    } catch (err: any) {
      setStatus("error");
      setError(err.message || "Something went wrong starting payment");
    }
  }

  if (lines.length === 0) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h1 className="text-3xl">Your bag is empty</h1>
        <p className="mt-3 text-inkInverseSoft">Browse the shop and add something you love.</p>
        <Link href="/shop" className="mt-7 inline-block rounded-full bg-goldSoft px-7 py-3.5 text-xs font-bold uppercase tracking-wide text-[#241305]">Shop Now</Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-4xl px-6 py-12 lg:py-16">
      <h1 className="text-3xl">Your Bag</h1>
      <div className="mt-8 divide-y divide-white/10 rounded-lg border border-white/10 bg-panel">
        {lines.map((l) => (
          <div key={l.productId} className="flex items-center gap-4 p-5">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md" style={{ background: l.image ? undefined : "linear-gradient(150deg,#6E1E3D,#2A0E1C)" }}>
              {l.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={l.image} alt={l.name} className="h-full w-full object-cover" />
              ) : <span className="font-display text-lg italic text-white">{l.name.charAt(0)}</span>}
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold">{l.name}</div>
              <div className="mt-0.5 text-xs text-inkInverseSoft">{formatNaira(l.price)}{l.negotiable ? " · Negotiable" : ""}</div>
              <div className="mt-2 flex items-center gap-2">
                <button onClick={() => changeQty(l.productId, -1)} className="flex h-6 w-6 items-center justify-center rounded border border-white/25 text-sm">−</button>
                <span className="text-sm">{l.qty}</span>
                <button onClick={() => changeQty(l.productId, 1)} className="flex h-6 w-6 items-center justify-center rounded border border-white/25 text-sm">+</button>
                <button onClick={() => removeItem(l.productId)} className="ml-auto text-[0.68rem] font-bold uppercase tracking-wide text-magenta">Remove</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-7 flex items-center justify-between text-lg">
        <span>Estimated Total</span>
        <span className="font-display text-2xl text-goldSoft">{formatNaira(total)}</span>
      </div>

      <form onSubmit={checkoutWhatsApp} className="mt-6 rounded-lg border border-white/10 bg-panel p-6">
        <h2 className="text-lg">Your details</h2>
        <p className="mt-1 text-xs text-inkInverseSoft">Needed so we can log your order and reach you to confirm it.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div><label className="mb-1.5 block text-[0.68rem] uppercase tracking-wide text-inkInverseSoft">Full Name</label><input required value={name} onChange={(e) => setName(e.target.value)} className="field-input" /></div>
          <div><label className="mb-1.5 block text-[0.68rem] uppercase tracking-wide text-inkInverseSoft">Phone</label><input required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="080…" className="field-input" /></div>
        </div>
        <div className="mt-3">
          <label className="mb-1.5 block text-[0.68rem] uppercase tracking-wide text-inkInverseSoft">Email <span className="normal-case text-inkInverseSoft/70">(required only if paying online)</span></label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="field-input" />
        </div>
        <div className="mt-3"><label className="mb-1.5 block text-[0.68rem] uppercase tracking-wide text-inkInverseSoft">Notes (optional)</label><textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="field-input min-h-[60px]" /></div>
        {error && <p className="mt-3 text-xs text-magenta">{error}</p>}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button type="submit" disabled={status === "sending" || status === "paying"} className="flex-1 rounded-full bg-[#1F8A57] px-6 py-3.5 text-xs font-bold uppercase tracking-wide text-white disabled:opacity-60">{status === "sending" ? "Opening WhatsApp…" : "Checkout via WhatsApp"}</button>
          <button type="button" onClick={payNow} disabled={status === "sending" || status === "paying"} className="flex-1 rounded-full bg-gradient-to-br from-goldSoft to-gold px-6 py-3.5 text-xs font-bold uppercase tracking-wide text-[#241305] disabled:opacity-60">{status === "paying" ? "Redirecting to Paystack…" : "Pay Online Now"}</button>
        </div>
        <button type="button" onClick={clear} className="mt-3 w-full rounded-full border border-white/25 px-6 py-3 text-xs font-bold uppercase tracking-wide">Clear Bag</button>
        <p className="mt-3 text-[0.68rem] text-inkInverseSoft/70">Negotiable items are charged at the listed price if paid online — use WhatsApp checkout to discuss pricing first.</p>
      </form>
    </section>
  );
}