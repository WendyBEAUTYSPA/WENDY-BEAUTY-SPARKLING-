"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error("Unhandled error:", error); }, [error]);

  return (
    <section className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-6 text-center">
      <h1 className="text-3xl">Something went wrong</h1>
      <p className="mt-3 text-inkInverseSoft">We&apos;ve logged the issue. Please try again, or reach us on WhatsApp if it keeps happening.</p>
      <button onClick={reset} className="mt-8 rounded-full bg-goldSoft px-7 py-3.5 text-xs font-bold uppercase tracking-wide text-[#241305]">Try Again</button>
    </section>
  );
}