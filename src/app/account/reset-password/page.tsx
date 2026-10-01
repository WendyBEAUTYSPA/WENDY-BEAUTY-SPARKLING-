"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function ResetPasswordPage() {
  const router = useRouter();
  const token = useSearchParams().get("token") || "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) { setError("Passwords don't match"); return; }
    setStatus("saving");
    setError("");
    const res = await fetch("/api/auth/reset-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token, password }) });
    if (!res.ok) { const data = await res.json().catch(() => ({})); setError(data.error || "Something went wrong"); setStatus("error"); return; }
    setStatus("done");
    setTimeout(() => router.push("/account/login"), 2000);
  }

  if (!token) {
    return (
      <section className="mx-auto max-w-md px-6 py-16 text-center">
        <h1 className="text-3xl">Invalid Link</h1>
        <p className="mt-3 text-inkInverseSoft">This password reset link is missing its token.</p>
        <Link href="/account/forgot-password" className="mt-6 inline-block text-goldSoft">Request a new link</Link>
      </section>
    );
  }
  if (status === "done") {
    return <section className="mx-auto max-w-md px-6 py-16 text-center"><h1 className="text-3xl">Password Updated</h1><p className="mt-3 text-inkInverseSoft">Redirecting you to sign in…</p></section>;
  }

  return (
    <section className="mx-auto max-w-md px-6 py-16">
      <h1 className="text-3xl">Reset Password</h1>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <div><label className="mb-1.5 block text-xs uppercase tracking-wide text-inkInverseSoft">New Password</label><input required minLength={6} type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="field-input" /></div>
        <div><label className="mb-1.5 block text-xs uppercase tracking-wide text-inkInverseSoft">Confirm Password</label><input required minLength={6} type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="field-input" /></div>
        {error && <p className="text-xs text-magenta">{error}</p>}
        <button disabled={status === "saving"} className="w-full rounded-full bg-goldSoft px-4 py-3 text-xs font-bold uppercase tracking-wide text-[#241305] disabled:opacity-60">{status === "saving" ? "Saving…" : "Reset Password"}</button>
      </form>
    </section>
  );
}