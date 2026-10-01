"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function OrderStatusSelect({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const [value, setValue] = useState(status);
  const [busy, setBusy] = useState(false);

  async function update(newStatus: string) {
    setValue(newStatus);
    setBusy(true);
    await fetch(`/api/orders/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: newStatus }) });
    setBusy(false);
    router.refresh();
  }

  return (
    <select value={value} disabled={busy} onChange={(e) => update(e.target.value)} className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs uppercase tracking-wide">
      <option value="PENDING">Pending</option><option value="CONFIRMED">Confirmed</option><option value="FULFILLED">Fulfilled</option><option value="CANCELLED">Cancelled</option>
    </select>
  );
}