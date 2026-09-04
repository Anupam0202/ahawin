# Live-analysis incident runbook — 4 September 2026

## Measured production evidence

The deployment at `https://ahawin.vercel.app` now serves the static application and returns HTTP 200 from `/api/health`. The deterministic guided request also returns HTTP 200, proving that Vercel routing, the serverless handler, JSON parsing, and the application core are operational.

Three typed live requests against `gemini-3.8-flash` failed as follows:

- one upstream HTTP 503: `This model is currently experiencing high demand. Spikes in demand are usually temporary. Please try again later.`
- two request timeouts after the version 1.1.3 24-second limit.

This is no longer an authentication, deployment-classification, browser-runtime, or malformed-client-request incident. The measured failure is provider capacity and latency on the selected model. Google documents 503 `UNAVAILABLE` and timeouts as transient failures for which backoff/retry is appropriate.

## Version 1.1.4 remediation

Version 1.1.4 applies three bounded reliability controls:

1. **Lower reasoning latency.** Gemini 3 requests use `thinkingConfig.thinkingLevel: low`. The earlier explicit `temperature: 0.2` is removed because Gemini 3 guidance recommends its default temperature and warns that low values can contribute to looping or degraded performance.
2. **Staggered model failover.** The primary remains `gemini-3.8-flash`. If it returns a retryable error immediately, or is still pending after four seconds, `gemini-3.5-flash-lite` starts as a stable multimodal structured-output fallback. The first response that passes all semantic invariants wins; the other request is cancelled.
3. **One shared deadline.** Both attempts share a 25-second wall-clock deadline, leaving five seconds of headroom inside the 30-second Vercel function limit. There is no chain of full-length retries that can overrun the function.

The successful response reports the model actually used and `fallbackUsed`. If the fallback wins, the UI receives an explicit warning. A custom submission never silently becomes the unrelated guided sample.

## Reliability and cost tradeoff

A normal fast primary response makes one Gemini call. When the primary is slow or returns a retryable failure, failover can make a second call to the same Gemini API using the same bounded learner evidence. This can increase provider usage for affected requests, but it materially improves demo reliability. The losing in-flight request is cancelled. Set `GEMINI_FALLBACK_MODEL=none` to disable this behavior.

## Required production variables

| Name | Recommended value |
|---|---|
| `GEMINI_API_KEY` | Current server-side Google AI Studio key, without quotes |
| `GEMINI_MODEL` | `gemini-3.8-flash` |
| `GEMINI_FALLBACK_MODEL` | `gemini-3.5-flash-lite` |
| `GEMINI_DEADLINE_MS` | `25000` |
| `GEMINI_HEDGE_DELAY_MS` | `4000` |
| `ALLOW_DEMO_FALLBACK` | `false` |

The code supplies all non-secret defaults, so only `GEMINI_API_KEY` is strictly required. Environment changes require a new deployment.

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

Expected health fields include:

```json
{
  "ok": true,
  "geminiConfigured": true,
  "model": "gemini-3.8-flash",
  "fallbackModel": "gemini-3.5-flash-lite",
  "thinkingLevel": "low",
  "failover": "staggered",
  "credentialCheck": "presence-only"
}
```

A successful live response has HTTP 200, `meta.mode: gemini-live`, the actual `meta.model`, and a boolean `meta.fallbackUsed`. After the typed request passes, test one resized handwritten image.

## If both models fail

Copy only the matching Vercel `analysis_failed` event. Version 1.1.4 records a redacted `attempts` array showing each model, safe error code, and upstream status. It never logs the request body, image, prompt, or API key.

Provider capacity cannot be guaranteed in application code. For a time-critical public demo, Google AI Studio's billed traffic tier can reduce exposure to sheddable free-tier capacity; the guided demo remains the honest offline backup.

## Official references

- https://ai.google.dev/gemini-api/docs/troubleshooting
- https://ai.google.dev/gemini-api/docs/generate-content/thinking
- https://ai.google.dev/gemini-api/docs/models/gemini-3.5-flash-lite
- https://aistudio.google.com/status
