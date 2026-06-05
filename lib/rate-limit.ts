// In-memory rate limiter. State is per-serverless-instance; resets on cold starts.
// Sufficient for protecting a portfolio site's API endpoints from casual abuse.

const store = new Map<string, { count: number; reset: number }>();

export function getIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

export function isRateLimited(
  ip: string,
  opts: { windowMs: number; max: number }
): boolean {
  const now = Date.now();
  const entry = store.get(ip);
  if (!entry || now > entry.reset) {
    store.set(ip, { count: 1, reset: now + opts.windowMs });
    return false;
  }
  if (entry.count >= opts.max) return true;
  entry.count++;
  return false;
}
