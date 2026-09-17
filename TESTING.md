# Learn testing

Test date: 17 September 2026.

## Original release checks

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

See README for running the local server, the current unit tests and browser suites. Tests start/stop their own local servers on ports 4173 and 4174. Stop a separately running preview first if that port is already occupied.

## Hosted smoke test

GitHub Pages deployment succeeded. The actual published application returned HTTP 200 and passed a Chromium touch smoke test: start, all six explanation reveals, Attention, recovery after reload, relative local assets, and no console errors. See DEPLOYMENT.md for the verified URL and deployment run.

## Practice lesson — version 1.1.0

- `npm test`: 12 unit tests passed, including schema 1 migration, multi-lesson validation, exact practice content, and completion counts.
- `npm run test:browser`: all 12 original browser acceptance groups passed.
- `npm run test:practice`: seven acceptance groups passed, including the full nine-stage practice lesson and all 47 frames at all three board sizes.
- Real Attention during partner talk pauses and resumes running timers; the First System Test acknowledgement appears only after Attention + Resume.
- All 13 required answers are revealed only by the teacher. Opinion choices have no correctness reveal.
- The memory grid remains visible at timer expiry, hides only on a teacher tap, recovers hidden after refresh, and reveals all nine original items.
- Summary checks cover 9/9 after all steps and answers, 0/9 with skipped material, 20 distinct manual discussion confirmations, zero automatic discussion credit, star visibility, and elapsed-time persistence.
- Switching selected lessons and cancelling replacement preserves the correct saved session.
- Screenshots were visually inspected for home, memory, quiz and summary. No console errors were found.

Practice-browser tests use port 4174; the original suite uses 4173. The remaining physical-board checks are touch/fullscreen support, emoji rendering, back-row legibility and real-class transition timing.


## Version 1.2.0 — classroom shell

17 unit tests; both existing lesson browser suites; and npm run test:classroom cover independent class/subject checkpoints, migration, restart/clear isolation, touch selection and responsive picker geometry. See docs/classroom-shell.md.

## Version 1.3.0

20 unit tests and the classroom and plan browser suites pass. Grade 8 Geography is excluded from new sessions; its earlier progress remains recoverable. The plan suite checks all 43 entries, quarter selection, flexible weekly edits and reload, board/mobile layout, and starter launch.

## Version 1.4.0

22 unit tests pass. The GP browser suite traverses all 43 new sessions with visible timers, checks reveals and recovery, and verifies the 40 student/key pages fit A4 without footer overlap. Student print views render no answers. Plan and classroom browser suites also pass.

## Version 1.5.0 — 7A courses

25 unit tests pass, including coverage of all 63 Geography and 93 GP source rows, weekly limits, class isolation and ten balanced four-option papers. `npm run test:grade7` traversed all 95 sessions at 1280 × 720 with visible timers and all checkpoint reveals. All ten student papers and ten explained keys fit four A4 pages each without footer overlap. Student views contain no answer-key elements. Printed source cards were reviewed to remove definition hints.

`node tests/grade7-workflow.cjs` verifies weekly-plan launch, mobile/board modal geometry, decoded diagram display, student paper, Print command, separate key and 7B isolation. Classroom and Grade 8 plan/workflow regression suites pass. Weekly-plan, diagram, student-paper and key screenshots were inspected. Browser checks use development-only Playwright; no new production dependencies.

Ports: 4179 for 7A traversal/printing, 4180 for 7A workflow. Set `PRINT_ONLY=1` to check just papers after assessment edits. Set `LEARN_URL` to verify the hosted workflow.
