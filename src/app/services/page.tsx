import { prisma } from "@/lib/prisma";
import BookingForm from "./BookingForm";

export const revalidate = 60;

export default async function ServicesPage() {
  const services = await prisma.service.findMany({ where: { active: true }, orderBy: { name: "asc" } });
  return (
    <section className="py-12 lg:py-16">
      <div className="mx-auto max-w-6xl px-6">
        <span className="text-xs font-bold uppercase tracking-widest text-goldSoft">Beauty &amp; spa services</span>
        <h1 className="mt-2 text-3xl lg:text-4xl">Book your next appointment</h1>
        <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <div key={s.id} className="flex flex-col gap-2.5 rounded-lg border border-white/10 bg-panel p-6">
              <div className="flex items-start justify-between gap-3">
                <span className="font-display text-lg">{s.name}</span>
                {s.priceLabel && <span className="shrink-0 text-xs font-bold text-goldSoft">{s.priceLabel}</span>}
              </div>
              {s.description && <p className="text-sm text-inkInverseSoft">{s.description}</p>}
              {s.duration && <span className="text-[0.7rem] uppercase tracking-wide text-inkInverseSoft">Duration: {s.duration}</span>}
            </div>
          ))}
        </div>
        <div className="mt-14 grid gap-11 overflow-hidden rounded-lg border border-white/20 p-7 lg:grid-cols-[.9fr_1.1fr] lg:p-11" style={{ background: "linear-gradient(155deg,#6E1E3D,#220C18)" }}>
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-rose">Reserve your slot</span>
            <h2 className="mt-2 text-2xl text-white lg:text-3xl">Tell us what you need — we&apos;ll confirm on WhatsApp</h2>
            <p className="mt-3.5 max-w-[40ch] text-white/80">Fill in a few details and we&apos;ll open a pre-filled WhatsApp message to confirm your date and time with the team.</p>
          </div>
          <BookingForm services={services.map((s) => ({ id: s.id, name: s.name, priceLabel: s.priceLabel }))} />
        </div>
      </div>
    </section>
  );
}