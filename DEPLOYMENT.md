# Learn deployment

Verified 17 September 2026.

- Repository: https://github.com/bryantfriend/learn
- Published site: https://bryantfriend.github.io/learn/
- Hosting: GitHub Pages, branch-based, main, / (root).
- Initial application commit: 0669c1c.
- Successful initial deployment: https://github.com/bryantfriend/learn/actions/runs/35170344861
- HTTP 200 verified on the published page.
- Live Chromium touch smoke test passed: start without typing, all six answers, Attention countdown/resume, refresh recovery, relative local assets, no console errors.
- Local checks passed: 6 unit tests and 12 browser acceptance groups. Every lesson frame was checked at 1920 × 1080, 1366 × 768 and 1280 × 720, with the timer shown.

No publishing steps remain. Open the published site on the classroom smart board, tap Start new lesson, and use Fullscreen if supported. Verify touch and fullscreen once on the actual board; desktop Chromium tests do not certify that specific hardware.

Progress belongs to that browser only. An initial visit or reload needs a connection; the loaded lesson needs no further content requests.

For future changes, commit reviewed files and push origin main, wait for the Pages workflow to succeed, then refresh the published site and repeat the smoke test. No production build step is required.

## Version 1.1.0 — classroom system practice

Adds Mission: Learn How We Learn to the existing home picker. The same main-branch Pages deployment publishes both lessons. See docs/system-practice.md for the complete lesson, compatibility details and classroom checklist.

## Version 1.2.0 — classroom shell

Adds the class/subject/lesson modal for 7A, 7B and 8th Grade; Geography and Global Perspectives; independent saved checkpoints; and migration of earlier sessions. Keeps both existing lessons as shared starters. Verified locally with 17 unit tests and all three browser suites. Publish from main using the existing Pages workflow.


## Version 1.3.0

Imports the Grade 8 GP year plan and relevant calendar windows, adds editable weekly pacing, and limits Geography to Grade 7. Publishing uses the existing main/root GitHub Pages workflow.
