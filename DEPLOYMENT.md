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

Progress belongs to that browser only. An initial visit or reload needs a connection; lesson text is loaded with the app, while Geography diagrams load from local site assets when first shown.

For future changes, commit reviewed files and push origin main, wait for the Pages workflow to succeed, then refresh the published site and repeat the smoke test. No production build step is required.

## Version 1.1.0 — classroom system practice

Adds Mission: Learn How We Learn to the existing home picker. The same main-branch Pages deployment publishes both lessons. See docs/system-practice.md for the complete lesson, compatibility details and classroom checklist.

## Version 1.2.0 — classroom shell

Adds the class/subject/lesson modal for 7A, 7B and 8th Grade; Geography and Global Perspectives; independent saved checkpoints; and migration of earlier sessions. Keeps both existing lessons as shared starters. Verified locally with 17 unit tests and all three browser suites. Publish from main using the existing Pages workflow.


## Version 1.3.0

Imports the Grade 8 GP year plan and relevant calendar windows, adds editable weekly pacing, and limits Geography to Grade 7. Publishing uses the existing main/root GitHub Pages workflow.

## Version 1.4.0

Publishes the 38 teaching lessons, five assessment sessions and separate printable papers/keys. Existing main/root Pages deployment; no build or new runtime dependencies.

## Version 1.5.0

Adds 7A Geography at one session per teaching week and GP at two: 95 playable sessions including ten printable assessments with separate keys. Version incremented to 1.5.0. Publication uses the existing main/root GitHub Pages workflow with no build or new runtime dependencies. See docs/grade7a-course.md and TESTING.md for adaptation and validation.

## Version 1.6.0

Adds the confirmed 7B younger-group courses: 93 GP sessions at three per week, 63 Geography sessions at two per week, and ten printable assessment papers with separate keys. Uses the existing main/root GitHub Pages deployment. Source plans, adaptation and references are documented in docs/grade7b-course.md.

## Version 1.7.0

Adds illustrated teaching frames and teacher-controlled animation across all three classes, with enlarged views, interactive runoff and budgets, and reduced-motion support. Uses the existing main/root Pages deployment; no runtime dependencies or build step.

## Version 1.9.0 — whole-lesson text editor

Adds the teacher text editor on Learn (18 September 2026). Main/root GitHub Pages deployment remains unchanged. Local browser lesson overrides preserve diagrams and routines; no server or runtime dependency was added. The mistakenly added Oxford Games editor was separately reverted in bryantfriend/ois commit 0287204.

## Version 2.0.0 — student study space

Adds `/students/` under the existing main/root GitHub Pages deployment. The student portal ships its own generated safe lesson catalog and static translations, so it needs no backend or runtime translation service. Teacher playback remains at the site root. Student progress and notes stay in their own browser storage key.

## Version 2.1.0 — exam library and single-page baselines

Adds the home-screen Exams button and navigation by assessment period, grade, and subject. All five baseline student papers contain 20 questions on one A4 page, with separate teacher keys. The 20 term papers retain their existing content. Validation: 46 unit tests and the exams browser suite, including all 25 paper links, baseline PDF page counts, print actions, answer keys, and mobile layouts. Publishes through the existing main/root GitHub Pages deployment.

## Version 2.2.0 — interactive perspectives and simpler English

Rebuilds Grade 8 Global Perspectives Lesson 3 with voting, role cards, a guessing game and a group decision with a surprise choice. Simplifies learner-facing English across lessons and regenerates student study pages and translations. Validation: 48 unit tests and 86 browser screens, including answer reveals, saved progress and classroom layout. Publishes through the existing main/root GitHub Pages deployment.
