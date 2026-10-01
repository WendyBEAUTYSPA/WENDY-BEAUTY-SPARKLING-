"use client";

import { useState } from "react";
import { bookingMessage, waLink, WHATSAPP_PRIMARY } from "@/lib/whatsapp";

export default function BookingForm({ services }: { services: { id: string; name: string; priceLabel?: string | null }[] }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [serviceId, setServiceId] = useState(services[0]?.id || "");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !phone) return;
    setStatus("sending");
    const service = services.find((s) => s.id === serviceId);
    try {
      await fetch("/api/bookings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, phone, email, serviceId, preferredDate: date || undefined, notes }) });
    } catch {}
    const msg = bookingMessage({ name, phone, email: email || undefined, service: service?.name || "", date: date || undefined, notes: notes || undefined });
    window.open(waLink(WHATSAPP_PRIMARY, msg), "_blank");
    setStatus("idle");
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-white/20 bg-bg/50 p-6">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Full Name"><input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="field-input" /></Field>
        <Field label="Phone"><input required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="080…" className="field-input" /></Field>
      </div>
      <Field label="Email"><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" className="field-input" /></Field>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Service">
          <select value={serviceId} onChange={(e) => setServiceId(e.target.value)} className="field-input">
            {services.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </Field>
        <Field label="Preferred Date"><input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="field-input" /></Field>
      </div>
      <Field label="Notes"><textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Anything we should know?" className="field-input min-h-[70px]" /></Field>
      {status === "error" && <p className="mb-2 text-xs text-magenta">Something went wrong — please try again.</p>}
      <button type="submit" disabled={status === "sending"} className="w-full rounded-full bg-[#1F8A57] px-4 py-3.5 text-xs font-bold uppercase tracking-wide text-white disabled:opacity-60">{status === "sending" ? "Opening WhatsApp…" : "Send Booking Request on WhatsApp"}</button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="mb-3"><label className="mb-1.5 block text-[0.68rem] uppercase tracking-wide text-inkInverseSoft">{label}</label>{children}</div>;
}