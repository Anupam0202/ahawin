# Security and privacy

## Reporting

Report vulnerabilities privately to the repository owner. Do not open a public issue containing an exploit, credential, private learner record, or sensitive image.

## Prototype controls

- Uploaded images are resized in the browser, processed in memory, and not intentionally persisted by the application.
- The Gemini key is read only by server-side code.
- The browser never asks for or receives an API key.
- Requests and decoded images are size-bounded; accepted image formats are restricted.
- Uploaded work is explicitly treated as untrusted evidence, not as instruction.
- Model output is schema-constrained, semantically validated, length-bounded, and rendered as text.
- Diagnosis remains a possible hypothesis linked to visible evidence.
- The learner confirms the trace before the intervention unlocks.
- Custom analysis fails honestly by default; the guided sample is always labeled.
- API responses are not cached.
- A per-instance request limit reduces casual abuse.
- Static and local responses use a restrictive Content Security Policy and standard hardening headers.

## Secret handling

Never commit, print, record, or paste:

- `GEMINI_API_KEY`,
- GitHub credentials,
- Vercel credentials,
- `.env` files,
- private student content.

Use `.env` only for local development and Vercel's encrypted environment-variable settings for deployment. Run:

```bash
npm run verify
```

The command includes a secret-pattern scan. GitHub push protection should also be enabled when available.

## Rate-limit boundary

The included limiter is in-memory and per warm server instance. It is suitable as a hackathon safeguard, not a global quota guarantee. A higher-traffic release should use a durable distributed limit and monitoring that does not log learner content.

## Before classroom production

Add:

- authenticated adult/educator administration where needed,
- explicit consent and retention controls,
- regional and vendor data-processing review,
- a deletion and incident-response process,
- distributed abuse controls,
- domain-expert output evaluation,
- independent security, privacy, and accessibility testing,
- educator escalation for uncertain or high-stakes cases.

AhaWin must remain formative. It should not make summative grading, placement, disability, disciplinary, or other high-impact decisions.
