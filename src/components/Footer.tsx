import Link from "next/link";
import { SUPPORT_EMAIL, WHATSAPP_PRIMARY, waLink } from "@/lib/whatsapp";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0D0509] pb-24 pt-14 lg:pb-14">
      <div className="mx-auto grid max-w-6xl gap-9 px-6 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <span className="font-display text-xl">Wendy <em className="not-italic italic text-goldSoft">Beauty</em> &amp; Spa</span>
          <p className="mt-3 max-w-[34ch] text-sm text-inkInverseSoft">Your beauty. Your style. Your signature. Beauty, fashion and personal care, curated for you.</p>
        </div>
        <div>
          <h4 className="mb-3 text-xs uppercase tracking-widest text-inkInverseSoft">Shop</h4>
          <ul className="space-y-2 text-sm text-inkInverseSoft">
            <li><Link href="/shop/hair" className="hover:text-goldSoft">Hair &amp; Wigs</Link></li>
            <li><Link href="/shop/fashion" className="hover:text-goldSoft">Fashion</Link></li>
            <li><Link href="/shop" className="hover:text-goldSoft">All Categories</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-xs uppercase tracking-widest text-inkInverseSoft">Customer Care</h4>
          <ul className="space-y-2 text-sm text-inkInverseSoft">
            <li><Link href="/services" className="hover:text-goldSoft">Book a Service</Link></li>
            <li><a href={waLink(WHATSAPP_PRIMARY, "Hello Wendy Beauty & Spa, I'd like to know more about your products and services.")} target="_blank" rel="noreferrer" className="hover:text-goldSoft">WhatsApp Us</a></li>
            <li><a href={`mailto:${SUPPORT_EMAIL}`} className="hover:text-goldSoft">Email Support</a></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-xs uppercase tracking-widest text-inkInverseSoft">Contact</h4>
          <ul className="space-y-2 text-sm text-inkInverseSoft">
            <li>+234 813 760 9506</li>
            <li>+234 901 231 4878</li>
            <li>{SUPPORT_EMAIL}</li>
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-11 flex max-w-6xl flex-wrap justify-between gap-2 border-t border-white/10 px-6 pt-6 text-xs text-inkInverseSoft">
        <span>© {new Date().getFullYear()} Wendy Beauty &amp; Spa.</span>
        <span>Quality · Care · Customer First</span>
      </div>
    </footer>
  );
}