// src/lib/rateLimit.ts
// Simple in-memory rate limiter for Next.js API routes

const requests = new Map<string, { count: number; lastReset: number }>();

/**
 * @param ip - IP address
 * @param limit - allowed requests
 * @param windowSeconds - time window in seconds
 */
export default async function rateLimit(ip: string, limit: number, windowSeconds: number) {
  const now = Date.now();
  const entry = requests.get(ip);

  if (!entry) {
    requests.set(ip, { count: 1, lastReset: now });
    return true;
  }

  if (now - entry.lastReset > windowSeconds * 1000) {
    requests.set(ip, { count: 1, lastReset: now });
    return true;
  }

  if (entry.count >= limit) return false;

  entry.count += 1;
  return true;
}
