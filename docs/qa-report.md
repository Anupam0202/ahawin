# QA report

Run date: **4 September 2026**.

## Measured results

| Gate | Command / method | Result |
|---|---|---|
| JavaScript syntax | `npm run check` | Pass |
| Unit tests | `npm test` | **22/22 pass** |
| Deterministic evaluation | `npm run eval` | **17/17 pass; 0 live calls** |
| Secret patterns | `scripts/secret-scan.sh` | `SECRET-SCAN-PASS` |
| HTTP/security | local Node server + scripted requests | **11/11 pass** |
| Desktop flow | Chromium/Playwright | Pass |
| Mobile 390×844 flow | Chromium/Playwright | Pass; no horizontal overflow |
| Keyboard activation | Focus + Enter through complete loop | Pass |
| Reduced motion | Emulated `prefers-reduced-motion` | Pass |
| No-key error | Custom request without key | Persistent honest error; no result shown |
| Browser diagnostics | Console, page errors, failed requests | 0 unexpected errors in tested flows |
| Static HTML/docs | IDs, labels, assets, anchors, relative links | Pass |
| Vercel layout regression | `npm run verify:deployment` | Pass; `public/` output and Node-safe browser import |
| Visual states | Home, locked, complete, mobile, dark, error | Inspected; no clipping/overlap in final captures |

## HTTP cases

Health/no-store; static page and security headers; bodyless HEAD; CSS MIME; API method restriction; malformed JSON; empty evidence; honest 503; labeled guided response; encoded traversal; rate limit with `Retry-After`.

## Semantic unit coverage

Guided invariant; criteria/transfer; input bounds; subject/media allowlists; weak/strong/domain-neutral teach-back; honest no-key; no-divergence and needs-evidence states; contradictory state; duplicate choices; invalid index; injection/data-channel separation; explicit fallback; teach-back no-key; limiter reset.

## Failures found and fixed

1. Browser runner used a nonexistent Chromium path; resolved through `command -v chromium`.
2. Known 503 errors were over-sanitized; safe application errors now carry an explicit exposure marker.
3. The no-key error was transient; added a persistent, focusable inline alert.
4. Echo initially unlocked before transcription review; added mandatory confirmation and disabled choices.
5. Output indices were clamped; malformed indices now fail closed.
6. Local GET `/api/analyze` returned static 404; routing now matches Vercel’s 405 behavior.
7. Guided API required irrelevant evidence; `{demo:true}` now works independently.
8. File input lacked an explicit label in static analysis; added a screen-reader label.
9. Screenshot-only fixed overlays were hidden in the capture harness; product skip-link behavior remains tested.
10. Vercel production returned 500 because root `app.js` was auto-detected and executed as Node, where `matchMedia` does not exist. Static assets now live under `public/`, the browser entrypoint is `ui.js`, Vercel explicitly uses `outputDirectory: "public"`, the local server moved under `scripts/`, browser initialization is environment-guarded, and a deployment-layout regression check imports the browser module under Node.
11. The corrected deployment served the app and health endpoint but live analysis returned 502 with empty Vercel messages. Provider exceptions were being discarded. Version 1.1.3 adds environment-value normalization, safe provider error classification, redacted structured logging, response references, and four regression tests.

## Visual review

- Desktop hero has a single dominant promise and visible 6-versus-10 preview.
- Locked state clearly dims Echo and names the confirmation action.
- Complete state preserves a readable two-column hierarchy.
- Mobile stacks in trace → Echo → teach-back → transfer order.
- Dark theme maintains semantic colors and legible surfaces.
- Error text is persistent and points to the guided alternative.

## Security and dependency status

No runtime package dependencies. API key remains server-side. Inputs are bounded; outputs are text-rendered and semantically validated; requests are not cached; CSP and hardening headers are set. The in-memory limiter is not distributed.

## Not run / blocked

- Real Gemini 15-case evaluation and latency/cost measurement: no key.
- Safari/Firefox/device-matrix testing.
- Slow live-model network simulation.
- Credentialed live Gemini request: production now serves the static app and health endpoint, but the current key/model path returned 502. Version 1.1.3 must be deployed and the resulting safe diagnostic or successful response verified.
- Classroom accessibility audit and learner-outcome study.

No blocked result is reported as passed.
