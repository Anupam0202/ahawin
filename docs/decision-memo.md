# Decision memo — AhaWin

## Decision

**Strongest idea found under the stated constraints and evidence available as of 3 September 2026: AhaWin.**

**One-sentence pitch:** AhaWin turns one handwritten wrong turn into a misconception twin the learner must catch, teach, and defeat on a fresh problem.

## User and job to be done

- **Primary user:** Middle-school or early-secondary learner practicing multi-step STEM work, with algebra as the hackathon vertical slice.
- **Job:** “When my work goes wrong, help me understand the rule I applied—not just obtain the answer.”
- **Pain:** A learner can carry one conceptual error through several internally consistent steps. A red mark or solved answer does not reveal the causal rule, and instant answer delivery can remove productive effort.

## Why the problem matters

Research and current products both point to mistakes as valuable learning evidence. Strong feedback should connect the task, the learner's current reasoning, and a next action. Metacognitive strategies ask learners to monitor and evaluate their process. At the same time, handwritten diagnosis is imperfect, so a responsible tool must expose evidence and uncertainty rather than act like a mind reader.

## Learning mechanism

1. **Formative diagnosis:** locate the earliest evidence-bearing divergence.
2. **Human confirmation:** let the learner confirm the transcription before any intervention.
3. **Cognitive conflict:** apply the inferred rule to a small case where its consequence becomes visible.
4. **Teach-back:** require the learner to reconstruct the corrected principle in their own words.
5. **Transfer:** test the same principle on a structurally fresh item.
6. **Metacognition:** distinguish the causal turn from downstream arithmetic.

## Core journey

`photo or typed steps → evidence trace → human confirmation → Echo reenacts the possible rule → side-by-side contradiction → teach-back → fresh transfer → repair card`

## Why AI is indispensable

Removing Gemini collapses the general product. A template can replay the algebra sample, but it cannot interpret varied handwriting, infer a bounded rule hypothesis from the learner's actual steps, produce a tailored falsifying example, or evaluate a domain-specific paraphrase. The deterministic demo is a resilience mechanism, not the live value proposition.

## Magic moment

The screen shows that the original expression evaluates to **6** while Echo's learned rule evaluates to **10** for the same input. The learner—not the system—must explain why. This turns an invisible misconception into an inspectable object in seconds.

## Measurable outcome

Prototype session metric: percentage of sessions where the learner:

1. confirms the trace,
2. correctly explains the contradiction,
3. passes teach-back, and
4. answers one fresh transfer item.

A future study should add a delayed, unassisted retention check. No learning-gain claim is made from synthetic testing.

## Closest alternatives

| Rank | Candidate | Risk-adjusted score | Strongest case | Why it lost |
|---:|---|---:|---|---|
| 1 | **AhaWin** | **88** | Clearest evidence-to-learning loop and strongest 60-second reveal | Winner |
| 2 | SourceSense | 83 | Urgent media-literacy need with strong lateral-reading pedagogy | Search grounding, source availability, and current-event latency add demo failure points |
| 3 | AccessTwin | 83 | Highest inclusion reach and immediate accessibility value | Content transformation is crowded and comprehension gain is less visible in a two-minute demo |
| 4 | MemoryMap | 82 | Strong retention mechanism and technically conservative | Requires longitudinal history, so its best value cannot be demonstrated honestly in one session |
| 5 | DebateLab | 82 | Engaging critical-thinking practice | Multi-turn interaction is harder to explain and complete within 120 seconds |

## Defensible differentiation

AhaWin is not the first tool to read handwriting, detect a wrong step, use counterexamples, or let a learner teach AI. Its differentiation is the coherent combination:

- earliest-divergence evidence rather than generic feedback,
- a personalized novice model of the learner's apparent rule,
- a falsifiable side-by-side consequence,
- mandatory human confirmation,
- teach-back and transfer before completion,
- no direct solution to the original problem.

That is best described as a **novel combination with a strong execution path**, not a claim of category invention.

## Risks and mitigations

| Risk | Severity | Mitigation in this build | Next production step |
|---|---|---|---|
| Handwriting is misread | High | Read-confidence indicator and explicit confirmation gate | Editable per-step transcription and crop controls |
| Rule hypothesis is plausible but wrong | High | “Possible” language, evidence quote, strict state/step invariants | Curated misconception retrieval and educator review |
| Counterexample is invalid | High | Structured fields, independent side-by-side checks, schema and semantic validation | Symbolic verifier for supported algebra families |
| Model leaks the original answer | Medium | Prompt prohibition and no original-answer response field | Automated answer-leak evaluation over a larger set |
| Custom analysis silently becomes a demo | High | Default is fail-closed; guided fallback must be explicitly enabled and remains labeled | Monitor failures and keep fallback opt-in |
| Abuse or cost spike | Medium | Bounded payloads, timeouts, and best-effort per-instance rate limiting | Durable distributed limits at higher traffic |
| Student privacy | High | No account, no identity request, no intentional storage, in-memory processing | Consent, retention controls, vendor review, regional compliance |
| Overclaiming impact | Medium | Product-quality tests are separated from learning evidence | Educator-reviewed pilot and delayed transfer study |

## Hackathon scope

- One polished algebra golden path
- Image or typed evidence
- Server-only Gemini call with structured output
- Three diagnosis states: possible misconception, no divergence, or more evidence needed
- Confirmation gate
- Misconception twin and falsifying check
- Rubric-aware teach-back
- Fresh transfer item and repair card
- Guided deterministic demo
- Responsive, keyboard-accessible interface
- Tests, secret scan, security headers, and Vercel configuration

## Explicit non-goals

- Automatic grading or summative scoring
- Definitive claims about a learner's mental state
- Accounts, classroom rosters, or persistent learner profiles
- Broad curriculum coverage before the core loop is expert-evaluated
- Claims of retention or achievement improvement without a study
- Real-time video, voice, or custom model training in the hackathon build

## Decision rationale

AhaWin maximizes expected judging performance because the educational mechanism, AI role, interface, and pitch all point to the same visible transformation. It is narrower than several challengers, but that narrowness makes the vertical slice more reliable, legible, and memorable.
