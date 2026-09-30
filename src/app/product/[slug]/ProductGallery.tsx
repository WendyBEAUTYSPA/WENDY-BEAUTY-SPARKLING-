"use client";

import { useState } from "react";

type Img = { url: string; alt?: string | null };

export default function ProductGallery({ images, name }: { images: Img[]; name: string }) {
  const [active, setActive] = useState(0);
  const current = images[active];

  return (
    <div>
      <div className="flex aspect-square items-center justify-center overflow-hidden rounded-lg" style={{ background: current ? undefined : "linear-gradient(150deg,#6E1E3D,#2A0E1C)" }}>
        {current ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={current.url} alt={current.alt || name} className="h-full w-full object-cover" />
        ) : (
          <span className="font-display text-6xl italic text-white/85">{name.charAt(0)}</span>
        )}
      </div>
      {images.length > 1 && (
        <div className="mt-3 flex gap-2.5">
          {images.map((img, i) => (
            <button key={img.url + i} onClick={() => setActive(i)} className={`h-16 w-16 shrink-0 overflow-hidden rounded-md border-2 transition ${i === active ? "border-goldSoft" : "border-transparent opacity-70 hover:opacity-100"}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt={img.alt || name} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}