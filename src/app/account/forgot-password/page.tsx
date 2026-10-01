"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    await fetch("/api/auth/forgot-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <section className="mx-auto max-w-md px-6 py-16 text-center">
        <h1 className="text-3xl">Check your email</h1>
        <p className="mt-3 text-inkInverseSoft">If an account exists for {email}, a reset link is on its way. It expires in 1 hour.</p>
        <Link href="/account/login" className="mt-6 inline-block text-goldSoft">Back to sign in</Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-md px-6 py-16">
      <h1 className="text-3xl">Forgot Password</h1>
      <p className="mt-2 text-sm text-inkInverseSoft">Enter your email and we&apos;ll send you a link to reset your password.</p>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <div><label className="mb-1.5 block text-xs uppercase tracking-wide text-inkInverseSoft">Email</label><input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="field-input" /></div>
        <button disabled={status === "sending"} className="w-full rounded-full bg-goldSoft px-4 py-3 text-xs font-bold uppercase tracking-wide text-[#241305] disabled:opacity-60">{status === "sending" ? "Sending…" : "Send Reset Link"}</button>
      </form>
    </section>
  );
}