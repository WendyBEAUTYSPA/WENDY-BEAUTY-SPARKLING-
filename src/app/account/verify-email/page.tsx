"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function VerifyEmailPage() {
  const token = useSearchParams().get("token") || "";
  const [status, setStatus] = useState<"checking" | "done" | "error">("checking");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) { setStatus("error"); setError("This verification link is missing its token."); return; }
    fetch("/api/auth/verify-email", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token }) })
      .then(async (res) => {
        if (!res.ok) { const data = await res.json().catch(() => ({})); throw new Error(data.error || "Verification failed"); }
        setStatus("done");
      })
      .catch((err) => { setStatus("error"); setError(err.message); });
  }, [token]);

  return (
    <section className="mx-auto max-w-md px-6 py-20 text-center">
      {status === "checking" && <p className="text-inkInverseSoft">Verifying your email…</p>}
      {status === "done" && <><h1 className="text-3xl">Email Verified</h1><p className="mt-3 text-inkInverseSoft">Thanks — your email address is now confirmed.</p></>}
      {status === "error" && <><h1 className="text-3xl">Verification Failed</h1><p className="mt-3 text-inkInverseSoft">{error}</p></>}
      <Link href="/account" className="mt-7 inline-block rounded-full bg-goldSoft px-7 py-3.5 text-xs font-bold uppercase tracking-wide text-[#241305]">Go to My Account</Link>
    </section>
  );
}