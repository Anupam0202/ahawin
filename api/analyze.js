import crypto from 'node:crypto';
import { analyzePayload } from '../lib/core.js';
import { analyzeRateLimit, clientKeyFromRequest } from '../lib/rate-limit.js';

function errorReference() {
  return `AHA-ERR-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });
  const rate = analyzeRateLimit(clientKeyFromRequest(req));
  res.setHeader('RateLimit-Limit', String(rate.limit));
  res.setHeader('RateLimit-Remaining', String(rate.remaining));
  if (!rate.allowed) {
    res.setHeader('Retry-After', String(rate.retryAfterSeconds));
    return res.status(429).json({ error: 'Too many requests. Wait a moment, then try again.' });
  }
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const result = await analyzePayload(body, process.env);
    return res.status(200).json(result);
  } catch (error) {
    const status = Number(error?.status) || 500;
    const message = error?.expose || status < 500 ? error.message : 'Analysis failed safely. Please try again.';
    if (status >= 500) {
      const reference = errorReference();
      const code = error?.code || 'ANALYSIS_FAILED';
      console.error(JSON.stringify({
        event: 'analysis_failed',
        reference,
        code,
        status,
        upstreamStatus: error?.upstreamStatus || null,
        attempts: error?.attempts || null,
        diagnostic: error?.diagnostic || error?.name || 'Error'
      }));
      return res.status(status).json({ error: message, code, reference });
    }
    return res.status(status).json({ error: message });
  }
}
