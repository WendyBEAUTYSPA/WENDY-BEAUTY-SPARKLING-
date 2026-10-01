"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteProductButton({ id }: { id: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handleDelete() {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    setBusy(true);
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    setBusy(false);
    router.refresh();
  }

  return <button onClick={handleDelete} disabled={busy} className="text-xs font-bold uppercase tracking-wide text-magenta disabled:opacity-50">{busy ? "…" : "Delete"}</button>;
}