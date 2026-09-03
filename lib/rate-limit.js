import crypto from 'node:crypto';

export function createRateLimiter({ limit = 12, windowMs = 60_000, maxEntries = 2_000 } = {}) {
  const buckets = new Map();
  let checks = 0;

  return function check(key, now = Date.now()) {
    checks += 1;
    if (checks % 100 === 0 || buckets.size > maxEntries) {
      for (const [bucketKey, bucket] of buckets) {
        if (bucket.resetAt <= now) buckets.delete(bucketKey);
      }
    }

    const current = buckets.get(key);
    if (!current || current.resetAt <= now) {
      const bucket = { count: 1, resetAt: now + windowMs };
      buckets.set(key, bucket);
      return { allowed: true, limit, remaining: limit - 1, retryAfterSeconds: 0 };
    }

    current.count += 1;
    const remaining = Math.max(0, limit - current.count);
    const retryAfterSeconds = Math.max(1, Math.ceil((current.resetAt - now) / 1000));
    return { allowed: current.count <= limit, limit, remaining, retryAfterSeconds };
  };
}

export function clientKeyFromRequest(req) {
  const forwarded = String(req.headers?.['x-forwarded-for'] || '').split(',')[0].trim();
  const remote = req.socket?.remoteAddress || 'unknown';
  const source = forwarded || remote;
  return crypto.createHash('sha256').update(source).digest('hex').slice(0, 20);
}

export const analyzeRateLimit = createRateLimiter({ limit: 12, windowMs: 60_000 });
