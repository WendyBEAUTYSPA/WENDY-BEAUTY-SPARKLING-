"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Review = { id: string; name: string; rating: number; text: string; approved: boolean; verified: boolean; productName: string };

export default function ReviewModerationRow({ review }: { review: Review }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function setApproved(approved: boolean) {
    setBusy(true);
    await fetch(`/api/reviews/${review.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ approved }) });
    setBusy(false);
    router.refresh();
  }

  async function remove() {
    if (!confirm("Delete this review?")) return;
    setBusy(true);
    await fetch(`/api/reviews/${review.id}`, { method: "DELETE" });
    setBusy(false);
    router.refresh();
  }

  return (
    <div className="rounded-lg border border-white/10 bg-panel p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div><span className="text-sm font-semibold">{review.name}</span><span className="ml-2 text-xs text-inkInverseSoft">on {review.productName}</span></div>
        <span className="text-goldSoft">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</span>
      </div>
      <p className="mt-2 text-sm text-inkInverseSoft">&ldquo;{review.text}&rdquo;</p>
      <div className="mt-3 flex items-center gap-3">
        <span className={`text-[0.66rem] font-bold uppercase tracking-wide ${review.approved ? "text-[#7FCF9B]" : "text-goldSoft"}`}>{review.approved ? "Published" : "Pending"}</span>
        {review.verified && <span className="text-[0.66rem] font-bold uppercase tracking-wide text-inkInverseSoft">Verified Purchase</span>}
        <div className="ml-auto flex gap-3">
          {!review.approved && <button disabled={busy} onClick={() => setApproved(true)} className="text-xs font-bold uppercase tracking-wide text-[#7FCF9B]">Approve</button>}
          {review.approved && <button disabled={busy} onClick={() => setApproved(false)} className="text-xs font-bold uppercase tracking-wide text-goldSoft">Unpublish</button>}
          <button disabled={busy} onClick={remove} className="text-xs font-bold uppercase tracking-wide text-magenta">Delete</button>
        </div>
      </div>
    </div>
  );
}