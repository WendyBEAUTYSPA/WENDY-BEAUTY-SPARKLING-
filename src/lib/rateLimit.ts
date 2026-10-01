type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of buckets) { if (bucket.resetAt < now) buckets.delete(key); }
}, 5 * 60 * 1000).unref?.();

export function rateLimit(params: { key: string; limit: number; windowMs: number }): { allowed: boolean; remaining: number } {
  const { key, limit, windowMs } = params;
  const now = Date.now();
  const existing = buckets.get(key);
  if (!existing || existing.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }
  if (existing.count >= limit) return { allowed: false, remaining: 0 };
  existing.count += 1;
  return { allowed: true, remaining: limit - existing.count };
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}