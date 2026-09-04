import { resolveGeminiConfig } from '../lib/core.js';

export default function handler(req, res) {
  const config = resolveGeminiConfig(process.env);
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.status(200).json({
    ok: true,
    geminiConfigured: config.geminiConfigured,
    model: config.model,
    fallbackModel: config.fallbackModel || null,
    thinkingLevel: 'low',
    failover: config.fallbackModel ? 'staggered' : 'disabled',
    mode: config.geminiConfigured ? 'live-configured' : 'transparent-demo',
    credentialCheck: 'presence-only',
    timestamp: new Date().toISOString()
  });
}
