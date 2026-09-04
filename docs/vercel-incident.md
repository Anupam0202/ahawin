# Vercel production incident — 3 September 2026

## Symptom

Production returned HTTP 500 for `/`, `/favicon.ico`, and `/favicon.png`. Runtime logs showed:

```text
ReferenceError: matchMedia is not defined
at init (file:///var/task/app.mjs:486:15)
```

## Root cause

The browser-only root file `app.js` used a conventional server entrypoint name. Vercel packaged and executed it as a Node function, so browser globals such as `matchMedia`, `document`, and `location` were unavailable. The failure was deployment classification, not a Gemini failure.

## Fix in version 1.1.2

- Moved all browser assets to `public/`.
- Renamed `app.js` to `public/ui.js`.
- Moved the local-only server to `scripts/local-server.mjs`.
- Set `framework` to `null` in `vercel.json`, which officially selects **Other** and overrides a persisted project preset.
- Set `outputDirectory` to `public` in `vercel.json`.
- Removed the production `start` script; local serving uses `npm run local`.
- Kept `api/` as the only Vercel function directory.
- Guarded browser initialization with `typeof window` and `typeof document`.
- Guarded `window.matchMedia` itself.
- Added `npm run verify:deployment`, which checks the layout and imports `public/ui.js` under Node to prevent regression.

## Measured after the fix

- Full `npm run verify`: pass.
- Deployment-layout regression: pass, including `framework: null` and absence of a production `start` script.
- Unit tests: 18/18 pass.
- Deterministic checks: 17/17 pass.
- HTTP/security checks: 11/11 pass.
- Desktop, mobile, keyboard, reduced-motion, and error browser flows: pass.
- Unexpected console errors and tested horizontal overflow: zero.

Production deployment `dpl_EiHhiiYfLvCbvrhP8J6XKUStbJ2g` subsequently served the static application and returned HTTP 200 from `/api/health`, confirming that the deployment-classification failure is fixed.

The same deployment returned HTTP 502 from `POST /api/analyze`. That is a separate Gemini integration incident, not a recurrence of `matchMedia`. Version 1.1.2 suppressed the upstream exception, so its empty runtime-log message cannot identify the exact provider cause. Version 1.1.3 adds safe diagnostics, environment normalization, and a 24-second timeout. See `live-analysis-runbook.md`.

## Redeploy

```bash
git add -A
git diff --cached --check
npm run verify
git commit -m "fix: isolate browser assets from Vercel runtime"
git push origin main
```

In **Vercel → ahawin → Settings → Build and Deployment**, confirm:

- Framework Preset: **Other**
- Root Directory: `.`
- Build Command: empty
- Output Directory: `public`

Then redeploy the newest commit. Do not redeploy the old failing deployment.

## Production acceptance checks

```bash
curl -fsSI https://ahawin.vercel.app/
curl -fsS https://ahawin.vercel.app/api/health
curl -fsSI https://ahawin.vercel.app/ui.js
curl -fsSI https://ahawin.vercel.app/favicon.svg
```

Expected: HTTP 200 for the page and assets; JSON with `ok: true` for health; no `matchMedia` error in runtime logs. Then complete the guided flow and one credentialed live flow in a browser.
