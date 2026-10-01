"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) { setError("Invalid email or password"); return; }
    router.push("/account");
    router.refresh();
  }

  return (
    <section className="mx-auto max-w-md px-6 py-16">
      <h1 className="text-3xl">Sign In</h1>
      <form onSubmit={submit} className="mt-8 space-y-4">
        <div><label className="mb-1.5 block text-xs uppercase tracking-wide text-inkInverseSoft">Email</label><input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="field-input" /></div>
        <div><label className="mb-1.5 block text-xs uppercase tracking-wide text-inkInverseSoft">Password</label><input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="field-input" /></div>
        {error && <p className="text-xs text-magenta">{error}</p>}
        <button disabled={loading} className="w-full rounded-full bg-goldSoft px-4 py-3 text-xs font-bold uppercase tracking-wide text-[#241305] disabled:opacity-60">{loading ? "Signing in…" : "Sign In"}</button>
      </form>
      <p className="mt-5 text-sm text-inkInverseSoft">No account? <Link href="/account/register" className="text-goldSoft">Create one</Link></p>
      <p className="mt-2 text-sm text-inkInverseSoft"><Link href="/account/forgot-password" className="text-goldSoft">Forgot your password?</Link></p>
    </section>
  );
}