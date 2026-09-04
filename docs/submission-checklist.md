# Submission checklist

Status date: **4 September 2026**.

## Deliverables

| Deliverable | Status | Evidence / next action |
|---|---|---|
| Functional project | Done locally and guided production | Guided desktop/mobile/keyboard flows pass |
| Source code | Done locally | Clean version 1.1.4 delivery ZIP |
| GitHub repository | Connected | `main` reached commit `e59fa1d`; push version 1.1.4 resilience next |
| Vercel production app | Partial | Static app and health pass; live Gemini analysis still needs repair verification |
| Two-minute script | Done | `demo-script.md` |
| Recorded/uploaded video | Blocked | Record after deployment; `AhaWin-2min-demo.mp4` |

## Judging evidence

### Educational Impact

- [x] Specific learner and hidden-wrong-rule problem.
- [x] Formative feedback, cognitive conflict, metacognition, teach-back, transfer.
- [x] No original-answer field; confirmation protects agency.
- [ ] Do not claim learning gains; no study ran.

### Creative AI/ML

- [x] Custom path passes the AI counterfactual test.
- [x] Combined image/text evidence drives a multi-stage interaction.
- [x] Three states, schema, and semantic invariants.
- [x] Uploaded commands treated as evidence.
- [x] Guided result labeled deterministic.
- [ ] Credentialed set must pass before live-quality claims.

### Technical Execution

- [x] Node local server and Vercel functions.
- [x] Central model, timeout, input/media bounds.
- [x] Safe text rendering, rate limit, CSP, privacy controls.
- [x] Responsive UI, dark theme, visible focus, reduced motion.
- [x] 25/25 unit tests; 17/17 deterministic cases.
- [x] 11/11 HTTP/security checks.
- [x] Desktop, mobile, keyboard, no-key, and reduced-motion browser paths.
- [x] Secret scan and static link/accessibility checks.
- [ ] Live-model and deployed-production smoke tests.

### Pitch and Demo

- [x] Product in opening frame; magic moment before 75 seconds.
- [x] Exact ≤119-second narration, clicks, captions, and backup.
- [x] Guided honesty and consistent closing line.
- [ ] Record, time, caption-check, upload, and test permissions.

## Repository gate

- [x] Placeholder-only `.env.example`; environment files ignored.
- [x] No runtime dependencies or temp/build folders in the repository.
- [x] No stale portfolio, personal-handle, authorship-tool, or internal-score marketing copy.
- [x] Current screenshots and complete README.
- [ ] Add final team credits and confirm public release authorization.
- [ ] Inspect staged diff, run verify, and confirm GitHub CI.

## Vercel gate

- [x] Import GitHub repository.
- [x] Configure `GEMINI_API_KEY`; provider reachability is confirmed by the measured Gemini 503 response.
- [ ] Confirm `ALLOW_DEMO_FALLBACK=false`; redeploy after environment changes.
- [x] Health endpoint returns 200 and says configured without disclosing key.
- [ ] Deploy version 1.1.4 with `gemini-3.8-flash` primary and `gemini-3.5-flash-lite` fallback, then complete one typed and one image request.
- [ ] Guided/live/error/mobile/keyboard paths pass on production.
- [ ] Real URL added to README and submission form.

## Final 15 minutes

1. Complete guided and one verified live path in a private window.
2. Confirm GitHub visibility and latest commit.
3. Open video signed out and scrub start/middle/end.
4. Paste the three real links into the form, proofread, submit, and save the receipt.

Remaining blockers are account- or provider-bound: pushing version 1.1.4, measuring a successful live result despite provider demand, video recording/upload, and final team credits.
