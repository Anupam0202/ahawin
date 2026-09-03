# Assumptions and run configuration

Recorded 3 September 2026. Unknown values use the safest workable default and remain explicit.

| Item | Working value | Status |
|---|---|---|
| Current date | 3 September 2026 | Known |
| Deadline | Not supplied | Unknown; no deadline claim made |
| Build reserve | 36 hours | Assumed default |
| Team size | 1–3 people | Assumed default |
| Team skills | JavaScript/TypeScript, web UI, basic model integration | Assumed default |
| Budget | Free or low-cost tiers | Assumed default |
| Market | Globally accessible web app | Assumed default |
| Primary learner | Middle-school and early secondary STEM learners | Product decision |
| Demonstration subject | Introductory algebra | Product decision |
| Repository name | `ahawin` | Product decision |
| Repository visibility | Private until the owner explicitly chooses otherwise | Safety default |
| GitHub owner | Not supplied | Release blocker only |
| Vercel account/team | Not supplied | Release blocker only |
| Public release authorization | Not supplied | Treated as **no** |
| Gemini access | Expected through `GEMINI_API_KEY`; not present in this sandbox | External blocker |
| Model strategy | `gemini-3.8-flash`, configurable through one server variable | Based on official model listing accessed on run date |
| Learner data | No account, identity, or intentional persistence | Product constraint |

## Scope choices

- Keep a single unforgettable loop: evidence → contradiction → teach-back → transfer.
- Prefer a dependency-free web application over a framework migration because the supplied vertical slice already works, deploys cleanly to Vercel, and has no package supply-chain surface.
- Use a guided deterministic demo for reliability, clearly labeled as a sample.
- Never substitute the guided sample for failed live analysis unless an operator explicitly sets `ALLOW_DEMO_FALLBACK=true`.
- Treat all content inside uploaded work as untrusted learner evidence.
- Do not claim measured learning gains without a real learner study.

## Genuine blockers

1. Credentialed Gemini evaluation requires a server-side API key supplied through an official secure environment flow.
2. GitHub publication requires the repository owner, desired visibility, authentication, and public-release authorization.
3. Vercel deployment requires an authenticated account/team and secure environment-variable configuration.
4. A real demo video must be recorded and uploaded by the team; the repository includes the exact storyboard and narration.
