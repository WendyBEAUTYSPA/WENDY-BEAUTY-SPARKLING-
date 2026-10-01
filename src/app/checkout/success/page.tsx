"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { formatNaira } from "@/lib/utils";

export default function CheckoutSuccessPage() {
  const params = useSearchParams();
  const orderId = params.get("orderId");
  const [status, setStatus] = useState<"checking" | "paid" | "failed">("checking");
  const [total, setTotal] = useState<number | null>(null);

  useEffect(() => {
    if (!orderId) { setStatus("failed"); return; }
    fetch(`/api/payments/paystack/verify?orderId=${orderId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.paid) { setStatus("paid"); setTotal(data.order?.total ?? null); }
        else setStatus("failed");
      })
      .catch(() => setStatus("failed"));
  }, [orderId]);

  return (
    <section className="mx-auto max-w-lg px-6 py-24 text-center">
      {status === "checking" && <p className="text-inkInverseSoft">Confirming your payment…</p>}
      {status === "paid" && (
        <>
          <h1 className="text-3xl">Payment Confirmed</h1>
          <p className="mt-3 text-inkInverseSoft">Thank you — your order{total !== null ? ` of ${formatNaira(total)}` : ""} has been confirmed. We&apos;ll be in touch shortly to arrange delivery.</p>
        </>
      )}
      {status === "failed" && (
        <>
          <h1 className="text-3xl">We couldn&apos;t confirm this payment</h1>
          <p className="mt-3 text-inkInverseSoft">If an amount was deducted, please contact us on WhatsApp with your order details and we&apos;ll sort it out right away.</p>
        </>
      )}
      <Link href="/shop" className="mt-8 inline-block rounded-full bg-goldSoft px-7 py-3.5 text-xs font-bold uppercase tracking-wide text-[#241305]">Continue Shopping</Link>
    </section>
  );
}