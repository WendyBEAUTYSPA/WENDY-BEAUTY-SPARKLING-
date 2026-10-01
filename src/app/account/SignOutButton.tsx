"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return <button onClick={() => signOut({ callbackUrl: "/" })} className="rounded-full border border-white/25 px-6 py-3 text-xs font-bold uppercase tracking-wide">Sign Out</button>;
}