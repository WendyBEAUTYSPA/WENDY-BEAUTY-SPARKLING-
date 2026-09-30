"use client";

import { useState } from "react";

export default function ReviewForm({ productId }: { productId: string }) {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    const res = await fetch("/api/reviews", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productId, name, rating, text }) });
    if (res.ok) { setStatus("sent"); setName(""); setText(""); setRating(5); } else { setStatus("error"); }
  }

  if (status === "sent") {
    return <div className="h-fit rounded-lg border border-white/10 bg-panel p-6"><p className="text-sm text-inkInverseSoft">Thanks — your review has been submitted and will appear once approved.</p></div>;
  }

  return (
    <form onSubmit={submit} className="h-fit rounded-lg border border-white/10 bg-panel p-6">
      <h3 className="text-lg">Write a review</h3>
      <div className="mt-4 space-y-3">
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-wide text-inkInverseSoft">Your name</label>
          <input required value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-md border border-white/15 bg-white/5 px-3 py-2.5 text-sm outline-none focus:border-goldSoft" />
        </div>
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-wide text-inkInverseSoft">Rating</label>
          <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="w-full rounded-md border border-white/15 bg-white/5 px-3 py-2.5 text-sm outline-none focus:border-goldSoft">
            {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{"★".repeat(n)}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-wide text-inkInverseSoft">Review</label>
          <textarea required minLength={5} value={text} onChange={(e) => setText(e.target.value)} className="min-h-[90px] w-full rounded-md border border-white/15 bg-white/5 px-3 py-2.5 text-sm outline-none focus:border-goldSoft" />
        </div>
        {status === "error" && <p className="text-xs text-magenta">Something went wrong — please try again.</p>}
        <button type="submit" disabled={status === "sending"} className="w-full rounded-full bg-goldSoft px-4 py-3 text-xs font-bold uppercase tracking-wide text-[#241305] disabled:opacity-60">{status === "sending" ? "Submitting…" : "Submit Review"}</button>
      </div>
    </form>
  );
}