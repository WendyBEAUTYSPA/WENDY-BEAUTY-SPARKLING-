"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email, password }) });
    if (!res.ok) { const data = await res.json(); setError(data.error || "Something went wrong"); setLoading(false); return; }
    await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    router.push("/account");
    router.refresh();
  }

  return (
    <section className="mx-auto max-w-md px-6 py-16">
      <h1 className="text-3xl">Create Account</h1>
      <form onSubmit={submit} className="mt-8 space-y-4">
        <div><label className="mb-1.5 block text-xs uppercase tracking-wide text-inkInverseSoft">Name</label><input required value={name} onChange={(e) => setName(e.target.value)} className="field-input" /></div>
        <div><label className="mb-1.5 block text-xs uppercase tracking-wide text-inkInverseSoft">Email</label><input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="field-input" /></div>
        <div><label className="mb-1.5 block text-xs uppercase tracking-wide text-inkInverseSoft">Password</label><input required minLength={6} type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="field-input" /></div>
        {error && <p className="text-xs text-magenta">{error}</p>}
        <button disabled={loading} className="w-full rounded-full bg-goldSoft px-4 py-3 text-xs font-bold uppercase tracking-wide text-[#241305] disabled:opacity-60">{loading ? "Creating account…" : "Create Account"}</button>
      </form>
      <p className="mt-5 text-sm text-inkInverseSoft">Already have an account? <Link href="/account/login" className="text-goldSoft">Sign in</Link></p>
    </section>
  );
}