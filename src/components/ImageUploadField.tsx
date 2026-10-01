"use client";

import { useState } from "react";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export default function ImageUploadField({ label, value, onChange }: { label: string; value: string; onChange: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const configured = Boolean(CLOUD_NAME && UPLOAD_PRESET);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !configured) return;
    setUploading(true);
    setError("");
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("upload_preset", UPLOAD_PRESET as string);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "Upload failed");
      onChange(data.secure_url);
    } catch (err: any) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="mb-1.5 block text-xs uppercase tracking-wide text-inkInverseSoft">{label}</label>
      {value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="Preview" className="mb-2 h-28 w-28 rounded-md object-cover" />
      )}
      {configured ? (
        <>
          <input type="file" accept="image/*" onChange={handleFile} disabled={uploading} className="field-input" />
          {uploading && <p className="mt-1 text-xs text-inkInverseSoft">Uploading…</p>}
          <input value={value} onChange={(e) => onChange(e.target.value)} placeholder="…or paste an image URL directly" className="field-input mt-1.5" />
        </>
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} placeholder="https://… (paste an image URL — Cloudinary upload isn't configured)" className="field-input" />
      )}
      {error && <p className="mt-1 text-xs text-magenta">{error}</p>}
    </div>
  );
}