"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RefundButton({ id }: { id: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function refund() {
    if (!confirm("Issue a full refund for this order via Paystack? This cannot be undone.")) return;
    setBusy(true);
    setError("");
    const res = await fetch(`/api/orders/${id}/refund`, { method: "POST" });
    setBusy(false);
    if (!res.ok) { const data = await res.json().catch(() => ({})); setError(data.error || "Refund failed"); return; }
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2">
      {error && <span className="text-[0.66rem] text-magenta">{error}</span>}
      <button onClick={refund} disabled={busy} className="text-[0.66rem] font-bold uppercase tracking-wide text-magenta disabled:opacity-50">{busy ? "Refunding…" : "Refund"}</button>
    </div>
  );
}