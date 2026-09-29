import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import { getActiveCampaign } from "@/lib/campaign";

export const revalidate = 60;

export default async function HomePage() {
  const [categories, featured, productCount, serviceCount, campaign] = await Promise.all([
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.product.findMany({
      where: { status: "ACTIVE" },
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { category: { select: { slug: true, name: true } }, images: { take: 1 } }
    }),
    prisma.product.count({ where: { status: "ACTIVE" } }),
    prisma.service.count({ where: { active: true } }),
    getActiveCampaign()
  ]);

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-bg to-bgAlt py-16 lg:py-24">
        <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(60% 60% at 82% 12%, rgba(226,62,124,.20), transparent 60%), radial-gradient(50% 50% at 8% 90%, rgba(201,164,103,.16), transparent 60%)" }} />
        <div className="relative mx-auto grid max-w-6xl gap-14 px-6 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
          <div>
            <div className="mb-5 flex flex-wrap gap-2.5">
              <span className="rounded-full border border-magenta/40 bg-magenta/15 px-3 py-1.5 text-[0.66rem] font-extrabold uppercase tracking-wide text-[#f4a9c5]">{campaign ? "Live Campaign" : "New Arrivals"}</span>
              <span className="rounded-full border border-white/25 px-3 py-1.5 text-[0.66rem] font-extrabold uppercase tracking-wide text-inkInverseSoft">Trending Now</span>
              <span className="rounded-full border border-white/25 px-3 py-1.5 text-[0.66rem] font-extrabold uppercase tracking-wide text-inkInverseSoft">Negotiable Pricing</span>
            </div>
            {campaign ? (
              <>
                <h1 className="text-[clamp(2.6rem,5.4vw,4.4rem)] leading-[1.05]">{campaign.title}</h1>
                {campaign.caption && <p className="mt-5 max-w-[46ch] text-inkInverseSoft">{campaign.caption}</p>}
              </>
            ) : (
              <>
                <h1 className="text-[clamp(2.6rem,5.4vw,4.4rem)] leading-[1.05]">Your beauty.<br />Your style.<br /><em className="not-italic italic text-goldSoft">Your signature.</em></h1>
                <p className="mt-5 max-w-[46ch] text-inkInverseSoft">Hair, fashion, cosmetics, footwear, jewelry, handbags, skincare and beauty services — one premium shopping destination, styled around you.</p>
              </>
            )}
            <div className="mt-8 flex flex-wrap gap-3.5">
              <Link href={campaign?.ctaUrl || "/shop"} className="rounded-full bg-gradient-to-br from-goldSoft to-gold px-7 py-3.5 text-xs font-bold uppercase tracking-wide text-[#241305] shadow-[0_10px_30px_-10px_rgba(201,164,103,0.6)]">{campaign?.ctaLabel || "Shop Now"}</Link>
              <Link href="/services" className="rounded-full border border-white/25 px-7 py-3.5 text-xs font-bold uppercase tracking-wide">Book a Beauty Service</Link>
            </div>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] border border-white/20" style={{ background: campaign?.imageUrl ? undefined : "linear-gradient(155deg,#6E1E3D 0%,#2A0E1C 46%,#120810 100%)" }}>
            {campaign?.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={campaign.imageUrl} alt={campaign.title} className="h-full w-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center font-display text-[8rem] italic text-white/10">W</div>
            )}
            <div className="absolute left-6 top-6 rounded-2xl border border-white/20 bg-bg/70 px-4.5 py-4 backdrop-blur">
              <div className="font-display text-2xl text-goldSoft">{categories.length}+</div>
              <div className="mt-0.5 text-[0.66rem] uppercase tracking-wide text-inkInverseSoft">Categories</div>
            </div>
            <div className="absolute bottom-6 right-6 rounded-2xl border border-white/20 bg-bg/70 px-4.5 py-4 text-right backdrop-blur">
              <div className="font-display text-2xl text-goldSoft">★ 4.8</div>
              <div className="mt-0.5 text-[0.66rem] uppercase tracking-wide text-inkInverseSoft">Customer Rated</div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-bgAlt">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-6 py-8 lg:grid-cols-4">
          {[{ n: productCount, l: "Products Listed" }, { n: categories.length, l: "Categories" }, { n: serviceCount, l: "Beauty Services" }, { n: 2, l: "WhatsApp Lines" }].map((s) => (
            <div key={s.l} className="text-center">
              <div className="font-display text-3xl text-goldSoft">{s.n}</div>
              <div className="mt-1 text-[0.68rem] uppercase tracking-wide text-inkInverseSoft">{s.l}</div>
            </div>
          ))}
        </div>
        <p className="pb-3 text-center text-[0.68rem] text-inkInverseSoft/70">Figures reflect live catalogue data.</p>
      </section>

      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <span className="text-xs font-bold uppercase tracking-widest text-goldSoft">Shop by category</span>
          <h2 className="mt-2 text-3xl lg:text-4xl">A world of beauty, in one place</h2>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {categories.map((c) => (
              <Link key={c.id} href={`/shop/${c.slug}`} className="relative flex min-h-[150px] flex-col justify-end overflow-hidden rounded-lg border border-white/10 p-5 transition hover:-translate-y-1" style={{ background: c.gradient || "linear-gradient(145deg,#6E1E3D,#2A0E1C)" }}>
                <span className="font-display text-base text-white">{c.name}</span>
                <span className="mt-1 text-[0.66rem] uppercase tracking-wide text-white/70">{c.heroLabel}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-goldSoft">New arrivals</span>
              <h2 className="mt-2 text-3xl lg:text-4xl">Fresh in this week</h2>
            </div>
            <Link href="/shop" className="rounded-full border border-white/25 px-6 py-3 text-xs font-bold uppercase tracking-wide">View All Products</Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-5 lg:grid-cols-4">
            {featured.map((p) => <ProductCard key={p.id} product={p as any} />)}
          </div>
          {featured.length === 0 && <p className="mt-6 text-inkInverseSoft">No products yet — run <code>npm run db:seed</code> to load the catalogue.</p>}
        </div>
      </section>
    </>
  );
}