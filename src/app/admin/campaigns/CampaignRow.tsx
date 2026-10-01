"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Campaign = { id: string; title: string; caption: string | null; active: boolean; startDate: string; endDate: string };

export default function CampaignRow({ campaign }: { campaign: Campaign }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function toggleActive() {
    setBusy(true);
    await fetch(`/api/admin/campaigns/${campaign.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: campaign.title, caption: campaign.caption, active: !campaign.active, startDate: campaign.startDate || undefined, endDate: campaign.endDate || undefined }) });
    setBusy(false);
    router.refresh();
  }

  async function remove() {
    if (!confirm("Delete this campaign?")) return;
    setBusy(true);
    await fetch(`/api/admin/campaigns/${campaign.id}`, { method: "DELETE" });
    setBusy(false);
    router.refresh();
  }

  return (
    <div className="rounded-lg border border-white/10 bg-panel p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-display text-lg">{campaign.title}</span>
        <span className={`text-[0.66rem] font-bold uppercase tracking-wide ${campaign.active ? "text-[#7FCF9B]" : "text-inkInverseSoft"}`}>{campaign.active ? "Active" : "Inactive"}</span>
      </div>
      {campaign.caption && <p className="mt-2 text-sm text-inkInverseSoft">{campaign.caption}</p>}
      {(campaign.startDate || campaign.endDate) && <p className="mt-2 text-xs text-inkInverseSoft">{campaign.startDate || "Any time"} → {campaign.endDate || "No end date"}</p>}
      <div className="mt-3 flex gap-3">
        <button disabled={busy} onClick={toggleActive} className="text-xs font-bold uppercase tracking-wide text-goldSoft">{campaign.active ? "Deactivate" : "Activate"}</button>
        <button disabled={busy} onClick={remove} className="text-xs font-bold uppercase tracking-wide text-magenta">Delete</button>
      </div>
    </div>
  );
}