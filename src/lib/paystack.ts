import crypto from "crypto";

const PAYSTACK_BASE = "https://api.paystack.co";

function secretKey(): string {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) throw new Error("PAYSTACK_SECRET_KEY is not set — add it to your environment to accept online payments.");
  return key;
}

export async function initializeTransaction(params: { email: string; amountNaira: number; reference: string; callbackUrl: string; metadata?: Record<string, unknown> }) {
  const res = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
    method: "POST",
    headers: { Authorization: `Bearer ${secretKey()}`, "Content-Type": "application/json" },
    body: JSON.stringify({ email: params.email, amount: Math.round(params.amountNaira * 100), reference: params.reference, callback_url: params.callbackUrl, metadata: params.metadata })
  });
  const data = await res.json();
  if (!res.ok || !data.status) throw new Error(data.message || "Paystack initialization failed");
  return data.data as { authorization_url: string; access_code: string; reference: string };
}

export async function verifyTransaction(reference: string) {
  const res = await fetch(`${PAYSTACK_BASE}/transaction/verify/${encodeURIComponent(reference)}`, { headers: { Authorization: `Bearer ${secretKey()}` } });
  const data = await res.json();
  if (!res.ok || !data.status) throw new Error(data.message || "Paystack verification failed");
  return data.data as { status: string; reference: string; amount: number; customer: { email: string } };
}

export async function refundTransaction(reference: string) {
  const res = await fetch(`${PAYSTACK_BASE}/refund`, {
    method: "POST",
    headers: { Authorization: `Bearer ${secretKey()}`, "Content-Type": "application/json" },
    body: JSON.stringify({ transaction: reference })
  });
  const data = await res.json();
  if (!res.ok || !data.status) throw new Error(data.message || "Paystack refund failed");
  return data.data;
}

export function verifyWebhookSignature(rawBody: string, signature: string | null, secret: string): boolean {
  if (!signature) return false;
  const expected = crypto.createHmac("sha512", secret).update(rawBody).digest("hex");
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export function amountMatchesOrder(amountKobo: number | undefined, orderTotalNaira: number): boolean {
  if (amountKobo === undefined) return true;
  return amountKobo === orderTotalNaira * 100;
}