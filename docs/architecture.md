# Architecture and model strategy

## System overview

```text
Browser
  ├─ typed problem / steps
  ├─ optional image resized to ≤1600 px
  ├─ guided deterministic sample
  └─ accessible learning state machine
            │ HTTPS JSON (bounded)
            ▼
/api/analyze (Node serverless function)
  ├─ method and payload validation
  ├─ best-effort per-instance rate limit
  ├─ Gemini adapter with timeout
  ├─ response JSON schema
  ├─ semantic state/step validation
  └─ safe error contract
            │
            ▼
Gemini Developer API
  ├─ multimodal evidence interpretation
  ├─ possible-rule hypothesis
  ├─ falsifying check
  ├─ teach-back criteria
  └─ fresh transfer item
```

No database, authentication system, analytics service, or persistent learner profile is required for the hackathon vertical slice.

## Runtime surfaces

| Surface | Files | Responsibility |
|---|---|---|
| Static interface | `public/index.html`, `public/styles.css`, `public/ui.js` | Vercel static output, local image resizing, guided flow, keyboard behavior, safe text rendering |
| Shared core | `lib/core.js` | Input normalization, prompt, schemas, Gemini calls, semantic validation, fixture, teach-back evaluation |
| Rate limit | `lib/rate-limit.js` | Hashed ephemeral client key and per-instance request window |
| Vercel endpoints | `api/analyze.js`, `api/health.js` | Serverless analysis and configuration health |
| Local parity server | `scripts/local-server.mjs` | Serves `public/` and matching API behavior for local development; its non-root name avoids platform server auto-detection |
| Validation | `tests/`, `scripts/evaluate.mjs`, `scripts/verify-deployment-layout.mjs`, `scripts/secret-scan.sh` | Unit, safety-contract, deployment-layout, and secret checks |
| Deployment | `vercel.json`, `.github/workflows/ci.yml` | Headers, route behavior, and CI verification |

## Why a dependency-free web stack

The supplied repository already had a functioning zero-build vertical slice. Migrating to a framework would consume implementation reserve without improving the magic moment. The current stack provides:

- no runtime package dependencies,
- no client bundle step,
- identical core logic locally and on Vercel,
- a small attack and failure surface,
- fast cold starts and easy judging setup.

The application uses Google's official HTTPS API contract directly through one adapter. The adapter is isolated so it can move to the maintained Google GenAI SDK later without changing the browser or learning flow.

## Model strategy

- Default: `gemini-3.8-flash`, selected from the official stable model catalog available on 3 September 2026.
- Stable fallback: `gemini-3.5-flash-lite`, used only after a retryable primary failure or a four-second slow-primary hedge.
- Override only through server-side `GEMINI_MODEL` and `GEMINI_FALLBACK_MODEL`.
- Use image + text in one request when an image is present.
- Use structured JSON output with a schema, Gemini 3 `thinkingLevel: low`, and the recommended default temperature.
- Validate semantics after parsing; schema compliance alone is insufficient.
- Race the staggered primary/fallback attempts under one 25-second wall-clock deadline, cancel the loser, and leave five seconds of Vercel headroom.
- Trim surrounding whitespace and accidental matching quotes from server environment values before use.
- Classify provider failures and emit only redacted, structured diagnostics with a random reference; never log learner evidence or credentials.
- Use a shorter model-backed teach-back rubric check when credentials exist.
- Fall back from the rubric check to a transparent local criterion matcher if that secondary call fails.
- Do **not** fall back from custom analysis to unrelated sample content by default.

## Structured output invariants

The server rejects output when any of these conditions fail:

- all six top-level sections exist,
- one to eight non-empty trace steps exist,
- diagnosis state is one of three allowed states,
- `possible_misconception` has exactly one `first_wrong` step,
- other diagnosis states have no `first_wrong` step,
- check and transfer have three or four unique choices,
- correct indices are within range,
- teach-back has two to four criteria,
- required educational text is non-empty after sanitization.

Every model-originated string is inserted with `textContent`, never as HTML.

## Request boundaries

- Subject allowlist with a safe general fallback
- Problem and typed work: 1,800 characters each
- Browser file input: JPG, PNG, WebP; source file up to 12 MB
- Browser output: JPEG, maximum dimension 1,600 px
- Server image payload: maximum decoded size 4.5 MB
- Local/serverless body budget: approximately 6 MB
- Analysis rate: 12 requests per minute per ephemeral hashed client key per instance

The in-memory limiter is a cost-abuse safeguard, not a distributed production control. A higher-traffic release should use a durable edge store.

## Privacy and threat model

| Threat | Control |
|---|---|
| Key exposure | Key exists only in server environment; no browser-prefixed secret |
| Prompt injection inside work | System instruction classifies all uploaded content as untrusted evidence |
| Personal data repetition | Prompt prohibits unnecessary names, emails, or identifiers; UI asks for no identity |
| Stored student work | No application persistence; images are held only for request processing |
| Script injection from model | Text-only DOM insertion and restrictive Content Security Policy |
| Oversized request | Client resize and server decoded-byte check |
| Cost abuse | Shared deadline, payload bounds, warm-instance rate limit; fallback starts only on error or slow primary |
| Hallucinated certainty | Three diagnosis states, confidence, uncertainty, evidence quote, human confirmation |
| Silent fallback deception | Guided sample is explicit; custom failure is an error by default |

## Security headers

Local server and Vercel configuration include:

- `Content-Security-Policy`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: no-referrer`
- `Permissions-Policy`
- `Cross-Origin-Opener-Policy: same-origin` on Vercel
- `Cache-Control: no-store` on API responses

## Deployment

Vercel serves only `public/` as static output through `outputDirectory: "public"`; files under `api/` are the only Node serverless functions. `framework: null` explicitly overrides any persisted Node.js project preset with **Other**, and `package.json` has no production `start` script. The browser entrypoint is deliberately named `ui.js`, and its initialization is guarded against non-browser imports. Together these controls prevent Vercel from auto-detecting a Node server entrypoint. There is no build command. Required production secret: `GEMINI_API_KEY`. Optional reliability configuration: `GEMINI_MODEL`, `GEMINI_FALLBACK_MODEL`, `GEMINI_DEADLINE_MS`, `GEMINI_HEDGE_DELAY_MS`, and `ALLOW_DEMO_FALLBACK` (recommended `false`).

## Reliability limitations

- The current response validation is hand-written rather than backed by a schema library.
- The first release does not symbolically verify generated algebra checks.
- The local criterion matcher is less semantically flexible than the model-backed rubric check.
- Warm-instance rate limiting is not globally consistent.
- A slow primary can overlap one fallback call, increasing provider usage for that request; the losing call is cancelled.
- No live Gemini result is claimed until credentialed evaluation runs.
