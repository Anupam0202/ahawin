import { DEFAULT_MODEL } from '../lib/core.js';

export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.status(200).json({
    ok: true,
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    model: process.env.GEMINI_MODEL || DEFAULT_MODEL,
    mode: process.env.GEMINI_API_KEY ? 'live-ready' : 'transparent-demo',
    timestamp: new Date().toISOString()
  });
}
