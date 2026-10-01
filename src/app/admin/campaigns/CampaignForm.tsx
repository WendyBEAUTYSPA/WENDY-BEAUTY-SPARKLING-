"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploadField from "@/components/ImageUploadField";

export default function CampaignForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [ctaLabel, setCtaLabel] = useState("Shop the Edit");
  const [ctaUrl, setCtaUrl] = useState("/shop");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await fetch("/api/admin/campaigns", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title, caption, imageUrl: imageUrl || undefined, ctaLabel, ctaUrl, active: true, startDate: startDate || undefined, endDate: endDate || undefined }) });
    setSaving(false);
    if (!res.ok) { const data = await res.json().catch(() => ({})); setError(data.error || "Something went wrong"); return; }
    setTitle(""); setCaption(""); setImageUrl(""); setStartDate(""); setEndDate("");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="h-fit space-y-3 rounded-lg border border-white/10 bg-panel p-6">
      <h3 className="text-lg">New Campaign</h3>
      <div><label className="mb-1.5 block text-xs uppercase tracking-wide text-inkInverseSoft">Headline</label><input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Weekend Glam Edit" className="field-input" /></div>
      <div><label className="mb-1.5 block text-xs uppercase tracking-wide text-inkInverseSoft">Caption</label><textarea value={caption} onChange={(e) => setCaption(e.target.value)} className="field-input min-h-[70px]" /></div>
      <ImageUploadField label="Campaign Image (optional)" value={imageUrl} onChange={setImageUrl} />
      <div className="grid grid-cols-2 gap-3">
        <div><label className="mb-1.5 block text-xs uppercase tracking-wide text-inkInverseSoft">CTA Label</label><input value={ctaLabel} onChange={(e) => setCtaLabel(e.target.value)} className="field-input" /></div>
        <div><label className="mb-1.5 block text-xs uppercase tracking-wide text-inkInverseSoft">CTA Link</label><input value={ctaUrl} onChange={(e) => setCtaUrl(e.target.value)} className="field-input" /></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="mb-1.5 block text-xs uppercase tracking-wide text-inkInverseSoft">Start (optional)</label><input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="field-input" /></div>
        <div><label className="mb-1.5 block text-xs uppercase tracking-wide text-inkInverseSoft">End (optional)</label><input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="field-input" /></div>
      </div>
      {error && <p className="text-xs text-magenta">{error}</p>}
      <button disabled={saving} className="w-full rounded-full bg-goldSoft px-4 py-3 text-xs font-bold uppercase tracking-wide text-[#241305] disabled:opacity-60">{saving ? "Saving…" : "Create Campaign"}</button>
    </form>
  );
}