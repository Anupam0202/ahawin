# Final judge simulation

Internal adversarial estimates, not official scores.

## Round 1 weaknesses and implemented changes

| Lens | Before | Largest weakness | Implemented change |
|---|---:|---|---|
| Educational impact | 86 | AI transcription controlled the intervention | Mandatory human confirmation |
| AI/ML | 91 | JSON shape without enough semantic checks | Three states and strict state/step/choice/index invariants |
| Technical | 84 | No abuse control; unclear no-key behavior | Rate limit, fail-closed errors, headers, expanded tests |
| Pitch | 89 | Judge-facing/technical copy | Learner-first 60-second story |
| Skeptical general | 82 | Could look like a scripted algebra trick | Visible guided label and explicit live-evaluation gap |

## Current release candidate

| Lens | Score /100 | Strongest aspect | Largest weakness | One highest-value change | Confidence |
|---|---:|---|---|---|---|
| Educational impact | 90 | Learner catches, explains, and transfers the rule | No learner study or delayed retention | Consented pre/post and delayed-transfer pilot | Medium |
| AI/ML | 94 | Evidence becomes a falsifiable misconception twin | No credentialed model set or symbolic check | Run live set, then verify supported algebra | Medium-low |
| Technical | 89 | Responsive product, strict contracts, honest errors, tests, privacy | Per-instance limit and hand-written validator | Distributed limit and maintained validator | High |
| Pitch | 93 | Learner-turns-tutor reversal and 6-versus-10 moment | Guided fixture can look cherry-picked | Keep badge visible; add verified live insert after QA | High |
| Skeptical general | 86 | Disciplined scope and explicit limits | Broad STEM language exceeds measured domain quality | Present algebra as demo domain | Medium-high |

## Official-criteria projection

| Criterion | Estimate | Main deduction |
|---|---:|---|
| Educational Impact | 23/25 | No learning-outcome study |
| Creative AI/ML | 24/25 | Live model set pending |
| Technical Execution | 22/25 | No production smoke; non-distributed limit |
| Pitch and Demo | 23/25 | Video not recorded or timed independently |
| **Raw** | **92/100** | Internal estimate only |

Demo-risk penalty 2 plus feasibility-uncertainty penalty 2 gives **88/100 risk-adjusted**.

## Skeptical questions

- **Photomath with branding?** No: no original final answer, Echo externalizes the apparent rule, the learner falsifies it, teaches it, and transfers it.
- **Did it find the learner’s real misconception?** It does not claim that; it offers an evidence-linked hypothesis with confidence and confirmation.
- **Proven learning gains?** No. Automated checks establish product contracts, not educational impact.
- **Why Gemini?** Custom work requires varied image/text interpretation plus a coherent rule, falsifier, rubric, and transfer item.
- **Stage failure?** Use the prominently labeled deterministic path; custom failures never receive unrelated sample content.

## Recommendation

Do not add another feature before submission. Run credentialed evaluation, deploy, smoke-test, record the script, and verify every link signed out.
