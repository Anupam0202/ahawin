# Candidate scoring, novelty checks, and tournament

Scores are internal decision estimates, not official judging results. Evidence tags: **S** sourced, **M** measured in this repository, **A** assumption, **X** speculation. Confidence applies to the estimate, not to a claim of future judging outcome.

## Hard gates

- 60 raw concepts were generated across all 12 arenas.
- 24 survived specificity, AI-indispensability, measurable-outcome, safety, feasibility, and 75-second-demo gates.
- Generic chat tutors, summarizers, camera solvers, quiz generators, and unreviewed graders were rejected or redesigned.
- Concepts requiring unavailable proprietary data, custom hardware, institutional adoption, or a high-stakes automated decision were rejected.

## Blind category scoring

Names were restored after category scoring. Each category is out of 25.

| ID | Candidate | Impact | AI use | Technical | Pitch | Raw | Demo penalty | Feasibility penalty | Adjusted | Confidence |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---|
| C01 | AhaWin | 23 | 24 | 22 | 23 | **92** | 2 | 2 | **88** | Medium-high |
| C02 | SourceSense | 23 | 23 | 20 | 22 | 88 | 3 | 2 | 83 | Medium |
| C03 | AccessTwin | 24 | 21 | 22 | 22 | 89 | 3 | 3 | 83 | Medium |
| C04 | ClassMirror | 24 | 22 | 19 | 22 | 87 | 4 | 3 | 80 | Medium |
| C05 | DebateLab | 21 | 23 | 22 | 22 | 88 | 4 | 2 | 82 | Medium |
| C06 | ProcedureCoach | 24 | 24 | 17 | 23 | 88 | 5 | 4 | 79 | Medium-low |
| C07 | SignBridge | 25 | 22 | 16 | 22 | 85 | 6 | 4 | 75 | Medium-low |
| C08 | OralProof | 23 | 24 | 19 | 23 | 89 | 5 | 3 | 81 | Medium |
| C09 | MemoryMap | 22 | 21 | 23 | 20 | 86 | 2 | 2 | 82 | Medium-high |
| C10 | TeacherLens | 23 | 21 | 21 | 21 | 86 | 3 | 2 | 81 | Medium |
| C11 | EchoLab | 22 | 24 | 16 | 24 | 86 | 6 | 4 | 76 | Medium-low |
| C12 | LabStory | 21 | 22 | 20 | 21 | 84 | 4 | 3 | 77 | Medium |

## Category justifications

| Candidate | Educational impact | Creative AI use | Technical execution | Pitch and demo |
|---|---|---|---|---|
| AhaWin | **23 — S/M:** strong formative, metacognitive, teach-back, and transfer loop; algebra scope is narrow | **24 — S/M:** handwriting-to-rule-to-counterexample personalization collapses without multimodal AI | **22 — M:** working responsive slice, strict validation, tests; live evaluation still blocked | **23 — M/A:** contradiction is immediate and visual; one confirmation click adds honest friction |
| SourceSense | **23 — S:** urgent verification skills and measurable lateral-reading behavior | **23 — S/A:** evidence retrieval and graphing are central | **20 — A:** search quality, citations, and latency add dependencies | **22 — A:** strong reveal, but less personal than a learner's own mistake |
| AccessTwin | **24 — S:** broad inclusion benefit with comprehension checks | **21 — S/A:** multimodal adaptation is useful but commercially common | **22 — A:** conservative implementation; quality across accessibility modes needs expert review | **22 — A:** before/after access is visible; learning gain is harder to prove quickly |
| ClassMirror | **24 — S:** teacher time and next-day intervention are consequential | **22 — S/A:** clustering reasoning patterns is AI-core | **19 — A:** batch uploads, consent, and dashboard complexity | **22 — A:** class map is legible but requires believable volume |
| DebateLab | **21 — S:** argumentation and evidence evaluation matter | **23 — S/A:** constrained counterpositions and critique are central | **22 — A:** text flow is feasible but needs grounding | **22 — A:** engaging, though several turns consume the demo |
| ProcedureCoach | **24 — S:** procedural errors can be consequential | **24 — S/A:** multimodal temporal interpretation is indispensable | **17 — A:** video, domain validation, and liability are high risk | **23 — A:** first unsafe step is visually dramatic |
| SignBridge | **25 — S:** major access and language-equity need | **22 — S/A:** visual language recognition is indispensable | **16 — S/A:** data, community co-design, and translation accuracy exceed the timebox | **22 — A:** compelling, but a weak prototype would be harmful |
| OralProof | **23 — S:** explanation reveals reasoning beyond final answers | **24 — S/A:** speech and mathematical reasoning integration are central | **19 — A:** audio ambiguity and evaluation reliability | **23 — A:** strong voice moment, but live audio is fragile |
| MemoryMap | **22 — S:** retrieval and spacing have strong evidence | **21 — S/A:** sequencing benefits from AI, though simpler algorithms can cover much of it | **23 — A:** technically conservative | **20 — A:** longitudinal value is difficult to show honestly in one session |
| TeacherLens | **23 — S:** turns responses into actionable intervention | **21 — S/A:** useful analysis, but close to existing dashboards | **21 — A:** feasible with human review | **21 — A:** informative rather than unforgettable |
| EchoLab | **22 — S:** simulations can support conceptual exploration | **24 — S/A:** dynamic model generation is AI-core | **16 — A:** generated physics must be verified | **24 — A:** spectacular when it works, costly when it fails |
| LabStory | **21 — S:** causal scientific reasoning is important | **22 — S/A:** multimodal lab evidence can support feedback | **20 — A:** domain breadth and report evaluation remain difficult | **21 — A:** credible but visually less immediate |

## Novelty check

Each concept was searched with three formulations; the compact query log below preserves the independent formulations. “Closest examples” are illustrative, not an exhaustive market census.

| Candidate | Three query formulations | Closest examples found | Classification |
|---|---|---|---|
| AhaWin | “misconception twin handwritten math”; “learner teaches AI role reversal”; “counterexample from student mistake” | EdLight, Fermi, Goodnotes Math Assistance, MathSense, Eedi | **Novel combination**; individual components exist |
| SourceSense | “AI media literacy evidence graph”; “claim source tracing tutor”; “verification challenge learning tool” | CACIT, Google Fact Check Explorer, ClaimVer, MEVER, Common Sense Education | Stronger educational execution of an active category |
| AccessTwin | “AI lesson accessibility transform”; “multimodal accessible learning adaptation”; “inclusive lesson converter comprehension” | Immersive Reader, SchoolAI, Signlingo, AccessiLearnAI, Flint | Crowded transformation category; outcome loop is the differentiator |
| ClassMirror | “cluster student work misconceptions”; “exit ticket misconception dashboard”; “handwritten work small groups AI” | SchoolAI Mission Control, LearnLens, Formative, CK-12, EdLight | Stronger execution; limited novelty |
| DebateLab | “evidence constrained AI debate”; “multi-agent debate tutor”; “argument feedback simulator” | Symbai, AI Debate Bot research, debate generators, SchoolAI, Kialo | Crowded; grounding discipline would differentiate |
| ProcedureCoach | “video procedural training first error”; “computer vision skill coaching”; “multimodal safety training feedback” | Aimbient, inviol, surgical coaching systems, VR training platforms, generic pose coaches | Novel educational slice but high domain risk |
| SignBridge | “AI sign language education”; “sign feedback computer vision”; “sign translation learning platform” | NVIDIA Signs, SignAll, Signapse, SignSense, Signvrse | Too derivative without Deaf-led co-design and unique data |
| OralProof | “oral proof AI tutor”; “spoken math reasoning assessment”; “voice reasoning formative feedback” | Skye, Explain It, Spoken-MQA, oral-assessment research, math voice tutors | Active emerging category; defensible only with verified reasoning |
| MemoryMap | “AI concept map spaced retrieval”; “knowledge graph memory learning”; “learner explanation retrieval plan” | Anki/FSRS, LECTOR, RemNote, Eedi, Learning Commons graphs | Useful fusion, weak short-demo proof |
| TeacherLens | “teacher AI misconception intervention”; “student understanding dashboard”; “AI learning-gap teacher assistant” | CK-12 Teacher Assistant, ASSISTments AIDA, Kira, SchoolAI, Formative | Crowded dashboard category |
| EchoLab | “AI generated science simulation”; “adaptive virtual lab AI”; “misconception simulation tutor” | PhET plus tutors, Labster, XReady Lab, Inq-ITS, Wharton simulations | High spectacle, substantial verification burden |
| LabStory | “AI lab reasoning coach”; “science lab report feedback”; “multimodal experiment evidence tutor” | Inq-ITS, LabGen, Labster, report graders, multimodal lab-agent research | Existing category; causal-evidence focus is narrower |

## Tournament

### Round 1 — 12 to 6

- AhaWin over SignBridge: less total social reach, but dramatically safer and more feasible in the timebox.
- SourceSense over TeacherLens: more urgent public-facing skill and stronger learner agency.
- AccessTwin over LabStory: broader inclusion value and lower domain-specific correctness risk.
- MemoryMap over EchoLab: less spectacular, far more reliable.
- DebateLab over SignBridge variant: clearer evidence loop without a community-data dependency.
- ProcedureCoach over OralProof: stronger visual consequence, despite higher technical risk.

### Round 2 — 6 to 3

- AhaWin over MemoryMap: the learner's own mistake creates a better immediate hook; MemoryMap needs weeks of history.
- SourceSense over DebateLab: measurable verification behavior beats open-ended conversational quality.
- AccessTwin over ProcedureCoach: lower liability and a more realistic implementation reserve.

### Final three

| Question | AhaWin | SourceSense | AccessTwin |
|---|---|---|---|
| Important problem | Frequent conceptual errors | Urgent misinformation risk | High access inequity |
| Learning value | Diagnosis + explanation + transfer | Lateral reading + evidence judgment | Access + comprehension |
| AI indispensability | High | High | Moderate-high |
| Magic moment | Rule produces a visible contradiction | Claim collapses into evidence map | Dense lesson becomes synchronized modes |
| Reliability | High for one constrained demo | Medium; external search chain | High for text transformation, medium for fidelity |
| Two-minute story | Excellent | Strong | Strong but less outcome-visible |
| Largest failure mode | Wrong diagnosis | Bad or missing sources | “Format conversion” without learning proof |

## Feasibility checks

Credentialed model calls were unavailable, so no live-model latency or quality result is claimed.

| Finalist | Riskiest assumption | Check performed | Observed result | Cost / latency evidence | Decision |
|---|---|---|---|---|---|
| AhaWin | A safe, understandable loop can be built around uncertain diagnosis | Full schema, semantic invariants, guided fixture, browser flow, and automated tests implemented | Complete vertical slice works; live multimodal quality remains pending | Deterministic route completes locally; live cost/latency not measured | Proceed |
| SourceSense | Reliable sources can be retrieved and attributed inside demo time | Architecture dependency spike against current web-search behavior and competitor scan | Requires search, retrieval, attribution, and failure handling beyond the existing stack | No production latency claim; at least one extra network chain | Hold |
| AccessTwin | Accessibility transformation can show learning—not only reformatting | Interaction spike on synchronized mode + comprehension-check concept and competitor review | Technically feasible, but a credible evaluation requires affected-user review across modes | No live cost/latency claim | Runner-up |

## Adversarial ceiling loop

1. **Round 1 — defeat the leader on inclusion:** generated SignBridge, AccessTwin variants, low-bandwidth packet tools, and shared-phone flows. None beat AhaWin by 2 adjusted points because co-design/data needs or weak demo measurement reduced feasibility.
2. **Round 2 — defeat the leader on spectacle:** generated simulation, oral, and procedural-video challengers plus an interactive AhaWin variant. Spectacle rose, but verification and live-demo risk erased the gain.
3. **Round 3 — defeat the leader on rigor:** generated source-grounded, symbolic-verifier, teacher-cluster, and delayed-retrieval challengers. The best improvement was not a pivot but two AhaWin upgrades: a human transcription checkpoint and stricter semantic validation.

No challenger improved the leader by at least 2 adjusted points in three consecutive rounds. AhaWin leads the nearest alternatives by 5 adjusted points, with no unmitigated critical risk inside the hackathon scope.
