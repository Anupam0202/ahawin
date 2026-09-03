import http from 'node:http';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { analyzePayload, DEFAULT_MODEL } from './lib/core.js';
import { analyzeRateLimit, clientKeyFromRequest } from './lib/rate-limit.js';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(ROOT, '.env');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const row = line.trim();
    if (!row || row.startsWith('#') || !row.includes('=')) continue;
    const split = row.indexOf('=');
    const key = row.slice(0, split).trim();
    const value = row.slice(split + 1).trim().replace(/^['"]|['"]$/g, '');
    if (!process.env[key]) process.env[key] = value;
  }
}

const PORT = Number(process.env.PORT || 4173);
const publicFiles = new Set(['/index.html', '/styles.css', '/app.js', '/favicon.svg', '/sample-work.svg']);
const mime = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml'
};

function securityHeaders(contentType = 'application/json; charset=utf-8') {
  return {
    'Content-Type': contentType,
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'no-referrer',
    'Permissions-Policy': 'camera=(self), microphone=(), geolocation=()',
    'Content-Security-Policy': "default-src 'self'; img-src 'self' data: blob:; connect-src 'self'; style-src 'self'; script-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'",
    'Cache-Control': 'no-store'
  };
}

function json(res, status, body) {
  res.writeHead(status, securityHeaders());
  res.end(JSON.stringify(body));
}

function readBody(req, limit = 6_000_000) {
  return new Promise((resolve, reject) => {
    let raw = '';
    let bytes = 0;
    req.on('data', chunk => {
      bytes += chunk.length;
      if (bytes > limit) {
        const error = new Error('Request too large.');
        error.status = 413;
        reject(error);
        req.destroy();
      } else raw += chunk;
    });
    req.on('end', () => {
      try { resolve(raw ? JSON.parse(raw) : {}); }
      catch { const error = new Error('Invalid JSON.'); error.status = 400; reject(error); }
    });
    req.on('error', reject);
  });
}

async function serve(pathname, res) {
  const wanted = pathname === '/' ? '/index.html' : pathname;
  if (!publicFiles.has(wanted)) return json(res, 404, { error: 'Not found.' });
  const file = path.join(ROOT, wanted.slice(1));
  const data = await fsp.readFile(file);
  res.writeHead(200, { ...securityHeaders(mime[path.extname(file)]), 'Cache-Control': wanted === '/index.html' ? 'no-cache' : 'public, max-age=300' });
  res.end(data);
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    if (req.method === 'GET' && url.pathname === '/api/health') {
      return json(res, 200, {
        ok: true,
        geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
        model: process.env.GEMINI_MODEL || DEFAULT_MODEL,
        mode: process.env.GEMINI_API_KEY ? 'live-ready' : 'transparent-demo',
        timestamp: new Date().toISOString()
      });
    }
    if (url.pathname === '/api/analyze') {
      if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed.' });
      const rate = analyzeRateLimit(clientKeyFromRequest(req));
      if (!rate.allowed) {
        res.setHeader('Retry-After', String(rate.retryAfterSeconds));
        return json(res, 429, { error: 'Too many requests. Wait a moment, then try again.' });
      }
      const result = await analyzePayload(await readBody(req), process.env);
      return json(res, 200, result);
    }
    if (req.method === 'GET' || req.method === 'HEAD') return serve(url.pathname, res);
    return json(res, 405, { error: 'Method not allowed.' });
  } catch (error) {
    const status = Number(error?.status) || (error?.code === 'ENOENT' ? 404 : 500);
    return json(res, status, { error: error?.expose || status < 500 ? error.message : 'Something went wrong safely.' });
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`AhaWin: http://127.0.0.1:${PORT}`);
  console.log(process.env.GEMINI_API_KEY ? `Gemini ${process.env.GEMINI_MODEL || DEFAULT_MODEL} configured` : 'Guided demo mode; add GEMINI_API_KEY for live analysis');
});
