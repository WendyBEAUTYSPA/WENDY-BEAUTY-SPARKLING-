import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions, isAdmin } from "@/lib/auth";

const LINKS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/reviews", label: "Reviews" },
  { href: "/admin/campaigns", label: "Campaigns" }
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) redirect("/account/login");

  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-2xl">Admin Dashboard</h1>
      <nav className="mt-5 flex gap-2 border-b border-white/10 pb-3">
        {LINKS.map((l) => <Link key={l.href} href={l.href} className="rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wide text-inkInverseSoft hover:bg-white/5 hover:text-goldSoft">{l.label}</Link>)}
      </nav>
      <div className="mt-8">{children}</div>
    </section>
  );
}