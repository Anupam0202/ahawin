# Two-minute demo script

Target duration: **116–119 seconds**. Show the product immediately. Record the guided sample path so the video remains honest and repeatable; state clearly that it is deterministic.

## Timed storyboard and narration

| Time | Screen / action | Word-for-word narration | On-screen caption |
|---|---|---|---|
| 0–7s | Hero already open; cursor rests on the handwritten attempt | “One wrong step can hide inside four lines of perfectly consistent work.” | One wrong step. Four convincing lines. |
| 7–17s | Point to `3x − 2 = 12`, then the Echo preview | “Most homework cameras race to the answer. AhaWin does the opposite: it turns the learner’s mistake into a tutor.” | Don’t solve it. Surface the rule. |
| 17–27s | Click **Try the 60-second demo**; loader phases appear | “This guided sample is deterministic for demo reliability. A live submission uses Gemini on the server to read typed or handwritten reasoning.” | Guided sample · clearly labeled |
| 27–40s | Result opens; trace the four steps and first red divergence | “AhaWin separates the earliest defensible divergence from everything that follows. It calls this a possible rule—not a diagnosis of the learner’s mind.” | Evidence before diagnosis |
| 40–48s | Point to 99% read confidence; click **Yes, continue** | “Before the AI acts, the learner confirms what it read. Human evidence stays in the loop.” | Human confirmation required |
| 48–65s | Show Echo’s rule and the 6-versus-10 comparison; choose A | “Now Echo repeats that rule on a value we can check. The original gives six. Echo gives ten. The learner has to catch why.” | 6 ≠ 10 · the rule breaks visibly |
| 65–82s | Type the prepared teach-back sentence and submit | “Instead of receiving a polished solution, the learner teaches Echo: the outside factor multiplies every term, including its sign.” | Teach it back in your own words |
| 82–93s | Select `4y + 12`; show green transfer state | “A fresh problem checks transfer. Only then does the repair loop finish.” | Transfer confirmed |
| 93–106s | Slowly pan across live/demo banner, confidence, and learning record | “Gemini is essential: it converts messy evidence into a structured rule hypothesis, a falsifiable counterexample, teach-back criteria, and a new transfer item.” | Multimodal reasoning → testable learning loop |
| 106–114s | Return to hero or learning-loop strip | “The prototype stores no learner identity, never puts the key in the browser, and does not claim learning gains we have not measured.” | Private by design · honest by default |
| 114–119s | End on logo and the 6-versus-10 visual | “AhaWin: teach your mistake until it disappears.” | AhaWin |

Estimated narration: approximately 216 words.

## Prepared inputs

The button fills these automatically:

```text
Problem: Solve 3(x − 2) = 12
Work:
3(x − 2) = 12
3x − 2 = 12
3x = 14
x = 14/3
```

Prepared teach-back sentence:

```text
The outside factor multiplies every term inside the parentheses, while preserving each sign.
```

Transfer selection: `4y + 12`.

## Shot list

1. 1440×900 browser, 110–125% zoom depending on recorder.
2. Hide bookmarks, notifications, developer tools, API keys, account names, and unrelated tabs.
3. Begin on the loaded hero; do not show setup or typing the original problem.
4. Keep the cursor still while narrating; move only before a click.
5. Let each loader phase register, but do not wait on live inference.
6. Pause briefly on the red first-divergence step.
7. Frame the 6-versus-10 comparison for at least three seconds.
8. Paste or use a text expander for the teach-back sentence; do not type slowly.
9. Hold the completed transfer state for two seconds.
10. End on the product name and tagline.

## Caption rules

- Burn in concise captions from the final column.
- Use high-contrast white text on a dark translucent background.
- Keep captions below the interaction, never over buttons or equations.
- Review mathematical symbols after automatic transcription.
- Include an uploaded transcript alongside the video when the platform supports it.

## Recording checklist

- [ ] Production or local URL loaded before recording
- [ ] Guided-demo badge visible whenever the deterministic path is shown
- [ ] No secret, environment file, terminal history, or private account shown
- [ ] Browser zoom makes 12–14 px interface text readable in the video
- [ ] Cursor movement is deliberate
- [ ] Narration is 119 seconds or shorter
- [ ] Captions are accurate and synchronized
- [ ] Audio peak is below clipping and background noise is low
- [ ] Final video is 1080p or higher
- [ ] Link permissions tested in a signed-out window
- [ ] GitHub and deployment links match the submitted build

## Backup plan

- Primary recording: deployed live app using the guided sample path.
- Backup recording: the same guided path on `http://127.0.0.1:4173/?demo=1`.
- If live Gemini is demonstrated separately, pre-record one successful live request and label it “Live Gemini”; never relabel the guided sample.
- Keep a clean screenshot of the completed state in `docs/screenshot-complete.png`.

## Suggested filename

`AhaWin-2min-demo.mp4`

## Final closing sentence

**“AhaWin: teach your mistake until it disappears.”**
