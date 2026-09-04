# Live-analysis incident runbook — 4 September 2026

## What the production evidence proves

Deployment `dpl_EiHhiiYfLvCbvrhP8J6XKUStbJ2g` serves the static application and returns HTTP 200 from `/api/health`. The earlier `matchMedia is not defined` deployment-classification incident is fixed.

The remaining failure is isolated to `POST /api/analyze`, which returns HTTP 502. The production health response reports `geminiConfigured: true` and `model: gemini-3.7-flash`. In version 1.1.2, that flag checks only whether a non-empty environment variable exists. It does not prove that the key is valid, authorized, within quota, or able to access the selected model.

Version 1.1.2 discarded the upstream exception and wrote no diagnostic event, so the two copied Vercel rows cannot distinguish among credentials, model access, quota, timeout, request rejection, or invalid structured output. A precise root cause must not be claimed from those rows alone.

## Version 1.1.3 remediation

- Normalize surrounding whitespace and accidental matching quotes in `GEMINI_API_KEY` and `GEMINI_MODEL`.
- Keep `gemini-3.8-flash` as the stable default.
- Reduce the model timeout from 28 to 24 seconds, leaving headroom inside the 30-second Vercel function limit.
- Classify upstream failures as authentication, model, quota, timeout, request, safety, invalid-output, or provider failures.
- Return only a safe code and random reference to the browser.
- Emit one structured `analysis_failed` server event with the same reference, upstream HTTP status, and a redacted diagnostic.
- Never log the request body, image, prompt, or API key.
- Label health as `live-configured` with `credentialCheck: presence-only` instead of claiming the provider is ready.

## Required Vercel environment values

Open **Vercel → ahawin → Settings → Environment Variables** and set these for **Production**:

| Name | Value |
|---|---|
| `GEMINI_API_KEY` | A current Google AI Studio key, pasted as the raw value with no surrounding quotes |
| `GEMINI_MODEL` | `gemini-3.8-flash` |
| `ALLOW_DEMO_FALLBACK` | `false` |

After every environment change, redeploy the newest Git commit. Do not expose the key in chat, shell history, screenshots, source, or logs.

## Acceptance sequence

```bash
BASE=https://ahawin.vercel.app

curl -fsS "$BASE/api/health"

curl -fsS -H 'content-type: application/json' \
  --data '{"demo":true}' \
  "$BASE/api/analyze"

curl -sS -H 'content-type: application/json' \
  --data '{"subject":"Algebra","problem":"Solve 3(x - 2) = 12","work":"3x - 2 = 12"}' \
  "$BASE/api/analyze"
```

Expected:

1. Health returns `ok: true`, `geminiConfigured: true`, `model: gemini-3.8-flash`, and `credentialCheck: presence-only`.
2. The deterministic demo returns HTTP 200 independently of Gemini.
3. The typed live request returns HTTP 200 with `meta.mode: gemini-live`.
4. A real image request then returns a relevant trace and does not expose a key in browser assets or responses.

## If the live request still fails

Copy the single Vercel log event whose `event` is `analysis_failed`. It will contain no submitted work or key.

| Code | Meaning | Primary action |
|---|---|---|
| `GEMINI_AUTH` | Key rejected or not authorized | Replace the server-side key; verify API restrictions and project access |
| `GEMINI_MODEL` | Model unavailable to the key | Set `GEMINI_MODEL=gemini-3.8-flash`, save, and redeploy |
| `GEMINI_QUOTA` | Rate or project quota exhausted | Check Google AI Studio quota/billing and retry later |
| `GEMINI_TIMEOUT` | Provider did not finish within 24 seconds | Retry typed input or a smaller image; inspect provider status |
| `GEMINI_REQUEST_REJECTED` | Gemini returned HTTP 400 | Use the redacted diagnostic to identify the rejected field |
| `GEMINI_INVALID_OUTPUT` | Response was empty, truncated, malformed, or failed semantic invariants | Retry once; retain the diagnostic for prompt/schema tuning |
| `GEMINI_UPSTREAM` / `GEMINI_UNAVAILABLE` | Provider or network failure | Check provider status and retry later |

Do not turn on `ALLOW_DEMO_FALLBACK` to hide a broken live path. The guided demo already remains available and is labeled honestly.
