"use client";

import { useState } from "react";

export default function ResendVerificationButton() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  async function resend() {
    setStatus("sending");
    await fetch("/api/auth/resend-verification", { method: "POST" });
    setStatus("sent");
  }

  if (status === "sent") return <span className="text-xs text-inkInverseSoft">Verification email sent.</span>;

  return <button onClick={resend} disabled={status === "sending"} className="rounded-full bg-goldSoft px-4 py-2 text-[0.66rem] font-bold uppercase tracking-wide text-[#241305] disabled:opacity-60">{status === "sending" ? "Sending…" : "Resend Verification Email"}</button>;
}