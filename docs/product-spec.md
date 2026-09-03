# Product specification

## Product

**AhaWin — Teach your mistake until it disappears.**

## Primary persona

A middle-school or early-secondary learner who can show multi-step STEM work but does not yet understand why one step changed the meaning. The hackathon demonstration is constrained to introductory algebra; the interface also accepts geometry, physics, chemistry, and general STEM evidence for live evaluation.

## Primary learning objective

Given one possible reasoning divergence, the learner can explain the corrected principle and apply it to a fresh problem without receiving the original final answer.

## Before and after

| Before | After |
|---|---|
| A red mark says the answer is wrong | A trace identifies the earliest evidence-bearing turn |
| A solver supplies polished steps | Echo reenacts the apparent rule on a checkable case |
| The learner reads an explanation | The learner catches and teaches the contradiction |
| Completion is mistaken for mastery | A new transfer item must be answered |
| Vision output is accepted automatically | The learner confirms the transcription first |

## Happy path

1. Select a STEM subject.
2. Add the original problem and typed steps and/or a JPG, PNG, or WebP image.
3. The browser resizes the image locally and submits bounded evidence.
4. Gemini returns a structured trace, diagnosis state, counterexample, teach-back rubric, and transfer item.
5. The server enforces shape and semantic invariants.
6. The learner reviews read confidence and confirms the trace.
7. Echo applies the possible rule to an independently checkable case.
8. The learner identifies why the results conflict.
9. The learner teaches the repaired principle in their own words.
10. A rubric-aware check evaluates the explanation.
11. The learner answers a fresh transfer item and can copy a repair card.

## Central AI transformation

`messy learner evidence → bounded rule hypothesis → falsifiable learning interaction`

The output is not merely generated content. It is a personalized state machine that decides what evidence to show, what possible rule to test, what contradiction to construct, what criteria an explanation should satisfy, and what fresh item checks transfer.

## Diagnosis states

- **Possible misconception:** exactly one trace step is marked as the earliest divergence.
- **No divergence:** no step is falsely marked wrong; Echo becomes a verifier.
- **Needs more evidence:** uncertain steps remain visible and the learner is told what must be confirmed.

Contradictory state/step combinations are rejected by the server.

## Core surfaces

### 1. Landing and promise

- Product hook in one sentence
- Guided 60-second sample
- Static transformation preview
- Learning-loop overview
- Live/demo readiness indicator

### 2. Evidence workbench

- Subject selector
- Problem and typed-step fields
- Image upload, preview, removal, and drag/drop
- Privacy explanation
- Primary live action and explicit guided-demo action

### 3. Aha trace

- Live-versus-guided label
- Problem context
- Step statuses: correct, first divergence, downstream, uncertain
- Evidence-linked diagnosis and confidence
- Human confirmation checkpoint

### 4. Echo check

- Plain-language statement of the possible working rule
- Original and twin results side by side
- Learner-selected explanation
- Feedback only after the learner commits

### 5. Teach-back and transfer

- Learner explanation field
- Domain-specific rubric evaluation
- Fresh multiple-choice transfer item
- Completion status and repair card

## States

| State | Required behavior |
|---|---|
| Empty | Show one clear task and a guided alternative |
| Uploading/processing | Resize locally; reject unsupported or oversized files |
| Loading | Lock page scroll and announce three understandable phases |
| Success before confirmation | Show the trace; disable Echo choices |
| Confirmed | Unlock Echo and move focus to the first check |
| Weak teach-back | Name one missing idea and allow revision |
| Completed | Confirm transfer and update the learning record |
| No server key | Keep custom results hidden; offer a safe, explicit error and guided demo |
| Model/network failure | Return a retryable error; never silently claim the sample analyzes user work |
| Rate limit | Return 429 with a wait message |

## Accessibility behavior

- Semantic headings, labels, lists, status regions, and native controls
- Skip link and visible keyboard focus
- Minimum 44 px interaction targets
- No information communicated by color alone; icons and labels accompany status
- Responsive reading order and no horizontal page scroll at 390 px
- Light and dark themes with system preference
- Reduced-motion support
- Typed evidence as an alternative to image input
- No timer or forced pace

## Learning measurement

The prototype records no analytics. The conceptual session funnel is:

`trace confirmed → contradiction explained → teach-back passed → transfer passed`

A consented pilot could log only de-identified stage completion and latency. A learning study should use pre/post transfer plus a delayed unassisted item; product event completion is not evidence of achievement gain.

## Safety and privacy

- No login, learner name, roster, or age required
- Uploaded images are processed in memory and are not intentionally stored
- Browser resizing and server payload limits
- Server-only key
- Uploaded text/image instructions treated as untrusted evidence
- Schema plus semantic validation
- No summative grade or disability diagnosis
- Visible uncertainty and human confirmation
- Best-effort rate limiting and explicit retry errors

## Demo fixture

Problem: `Solve 3(x − 2) = 12`

Attempt:

```text
3(x − 2) = 12
3x − 2 = 12
3x = 14
x = 14/3
```

The guided fixture is deterministic and visibly labeled. It is not evidence of live-model quality.

## MVP acceptance criteria

- [x] Guided flow reaches transfer in less than 75 seconds of normal interaction.
- [x] Exactly one earliest divergence appears in the fixture.
- [x] Echo's original and inferred-rule checks visibly disagree.
- [x] Learner confirmation is required before interaction.
- [x] Weak teach-back does not unlock transfer.
- [x] Strong teach-back unlocks a fresh item.
- [x] Custom analysis without a key fails honestly.
- [x] API key is absent from browser code and examples.
- [x] Desktop and mobile critical paths complete without horizontal overflow.
- [x] Syntax, unit, deterministic evaluation, browser flow, and secret scan pass.
- [ ] Credentialed 15-case model evaluation passes release thresholds.
- [ ] Production deployment receives a complete smoke test.

## Stretch goals, ranked

1. **Editable per-step transcription** — highest reliability value; moderate effort.
2. **Symbolic algebra verifier** — high correctness value; moderate/high effort.
3. **Curated misconception retrieval** — high calibration value; needs expert labels.
4. **Delayed retrieval link without identity** — meaningful retention value; moderate privacy design.
5. **Teacher-reviewed class clustering** — high impact; high consent and interface complexity.
6. **Voice teach-back** — engaging and accessible; adds audio accuracy and privacy risk.

The hackathon build intentionally stops before these stretch goals dilute the core loop.
