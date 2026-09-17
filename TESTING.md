# Learn testing

Test date: 17 September 2026.

## Executed locally

- `npm test`: **6 passed, 0 failed**.
- `npm run test:browser`: **12 acceptance groups passed**. Chromium tests against the real app at `http://127.0.0.1:4173/learn/`.
- Screenshots inspected: home and question screens at 1280 × 720; automated screenshots also captured at 1366 × 768 and 1920 × 1080.
- Every lesson frame checked at all three board sizes, with the timer shown, for content outside the viewport, overlap with the step controls, page scrolling, and main-control height below 56px.
- No production framework, runtime package downloads, API calls or remote fonts/images.

The browser suite checks:
1. Fresh state, no class label, all eight stages, all six explanations, final dismissal screen and zero stars.
2. Selected A/B responses do not expose correctness until Reveal explanation.
3. Back navigation preserves reveals; restart cancellation preserves state; starting a new session requires confirmation.
4. Attention counts down and pauses a running timer without changing the stage or step; Resume restores it.
5. Pause/Attention leave a previously paused timer paused; repeated timer taps, Reset and +30 work.
6. Refresh recovery of stage/reveal and an expired timer; the recovered timer is paused at zero.
7. Optional stars, exactly one award per action, undo, and disabling undo at zero.
8. Fullscreen rejection keeps the app usable; keyboard focus reaches controls.
9. Every frame fits all three requested board sizes, including visible timer and explanations.
10. Corrupt JSON, outdated/unknown sessions and denied localStorage allow new lessons.
11. Confirmed clear removes saved progress.
12. Relative /learn/ paths, no external requests, no additional lesson-content requests while navigating, and no console errors.
13. Touch operation and live timer expiry leave stage/reveals unchanged; one scheduler exists.

Results and screenshots are generated in `output/playwright/`, intentionally excluded from Git.

## One-time physical board check

Automated Chromium checks do not certify a particular classroom smart board.

1. At 100% zoom, open the published URL and start without typing.
2. Confirm the entire content and bottom toolbar are visible.
3. Tap Fullscreen. If the browser declines, teach in its ordinary window.
4. In stage 3, open Timer → Start timer → Attention. Wait for 3–2–1; tap Resume. The same prompt should return and time should resume.
5. Pause the timer first, then open Pause and Resume. Time must remain paused.
6. In stage 6, select B on question 1. Nothing should indicate correctness until Reveal explanation shows A and the evidence.
7. Reload midway and Resume lesson. The same reveal should remain and the timer should be paused.
8. Open teacher notes only when comfortable sharing them with the class. Clear saved session when done if appropriate for the shared board.

## Reproduction

See README for running the local server, six Node tests and browser suite. Tests start/stop their own local server on port 4173. Stop a separately running preview first if that port is already occupied.

## Hosted smoke test

GitHub Pages deployment succeeded. The actual published application returned HTTP 200 and passed a Chromium touch smoke test: start, all six explanation reveals, Attention, recovery after reload, relative local assets, and no console errors. See DEPLOYMENT.md for the verified URL and deployment run.
