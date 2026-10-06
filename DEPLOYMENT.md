# Learn deployment

## Version 2.6.3 — Coastal Connections rounds and economy

Adds growing passenger waves, new towns, trains, paid routes, vehicle and terminal upgrades, delivery income, route selling, round deadlines and ten-second stop alarms to the 7B Geography Lesson 2 transport game. Includes illustrated coastal scenery, detailed vehicles, animated water and passenger feedback, and a dismissible rounded completion panel with golden stars and confetti. Starts with 20 credits for a bus; local deliveries fund the first boat.

Validation: 91 unit tests, focused browser checks through three rounds including purchases, upgrades, selling/rebuilding, completion dismissal, loss/retry, mobile and lesson reopening, plus the bundled gameplay client completing round 1. Stage 5 review is deferred. Publishes through the existing main/root GitHub Pages deployment.

## Version 2.6.2 — 7B Lesson 2 classroom prototype

Publishes the current section-by-section review of 7B Geography Lesson 2. Includes the approved map starter with an animated border reveal, the UK/Great Britain explanation, English vocabulary with Chinese and Russian support and enlarged card modals, the Coastal Connections transport game, and generated weather/climate and rain-shadow illustrations.

Sections 1–3 are approved. Part 4 now includes the transport game and artwork; remaining lesson sections await classroom review. This prototype has not been applied to other lessons. Teacher-guide and independent-study exports remain at their previous revision while this lesson is being reviewed. Validation: 85 unit tests and focused game browser checks covering passenger transfers, route restrictions, the ferry challenge, mobile layout and lesson launch/resume. Publish through the existing main/root GitHub Pages deployment.

## Version 2.6.1 — Geography concept-art redesign

Updates all 96 Geography lessons for 7A and 7B to the approved ivory, navy and teal design. The 86 teaching and review lessons follow eight sections over 40 minutes, with vocabulary cards, worked examples, supported practice, concealed check answers and exit tickets. The 10 assessments use matching styling. Includes seven generated illustrations and refreshed teacher guides, student notes and translations.

Validation: 82 unit tests passed, 4,362 classroom screen checks across two resolutions, all eight section previews, mobile layout, teacher notes, printable guides and independent-study browser checks. Release metadata is synchronized in `package.json` and `src/version.js`. Publish through the existing main/root GitHub Pages deployment.

## Version 2.5.2 — remove temporary online collection

Removes the four online read-aloud lessons, the temporary Online category, their reading guide and its generator at the teacher's request on 6 October 2026. The usual curriculum and workbook trial categories remain available. Publish through the existing main/root GitHub Pages deployment.

## Version 2.5.1 — temporary online read-aloud lessons

Adds four lessons for 5 October 2026 in **Online · Temporary**, filtered by class: Geography 7A, GP 8, Geography 7B and GP 7B. Six screens per lesson have substantial original spoken scripts, with a continuous HTML reading guide. The early Geography course topics and reviewed GP Skills Books 9 and 7 supply the curriculum starting point. Plan about 30 minutes with slow delivery and pauses, plus an optional 10-minute recap. No student responses, worksheets or breakout rooms are required. These teacher-led lessons are excluded from the independent-study export using the existing `classroomOnly` flag.

Publish through the existing main/root GitHub Pages deployment. Run `node scripts/build-online-guide.mjs` after editing scripts; `node tests/online-browser.cjs` verifies the picker, all scripts, progress recovery and responsive reading guide.

## Version 2.5.0 — teacher-led Geography curriculum

Rebuilds all 86 Geography teaching and review lessons for a 40-minute ESL class: substantial teacher explanations, visual demonstrations, occasional spoken opinions and volunteer board activities. Adds per-slide teaching notes, concealed understanding-check answers and a printable guide for every lesson. Assessments and other subjects retain their existing curriculum.

Validation: 80 unit tests, 3,718 rebuilt lesson screen checks across two classroom resolutions, and focused checks for the journey planner, teaching notes, mobile layout and printable guide. The 40-minute pacing is planned and still needs classroom validation. Publish through the existing main/root GitHub Pages deployment.

## Version 2.4.3 — illustrated Irish Sea journey

Adds generated coach, check-in, ferry and flight illustrations throughout the section 3.1 application lesson. The interactive planner lets pupils calculate journey totals, choose a route, cancel the ferry, change the budget and check feasibility. Includes an enlarged classroom view and a visual spoken exit task.

Validation: 77 unit tests and the journey browser check covering all images, totals, cancellation, budget changes and reset. Publish through the existing main/root GitHub Pages deployment.

## Version 2.4.2 — map workshops and complete question banks

Includes all pending Geography smart-board updates: interactive SVG maps, UK/Great Britain comparison, country labelling, two postcard missions, illustrated challenges, progressive demonstrations, shared task/review workspaces and spoken exits. Global Perspectives workbook activities now expose their complete question banks. Includes pending worksheets, map provenance, audit scripts and curriculum documentation.

Release metadata is synchronized in `package.json` and `src/version.js`. Deploy by pushing `main` to the existing root GitHub Pages site; no production build is required. Independent-study exports remain separate.

Validation includes 77 unit tests, 1,254 Geography screens, 142 board views, and touch, keyboard, drawing and postcard checks.

## Version 2.4.0 — classroom activities, worksheets and English

Adds the visible version beside the top-left Learn logo on the home screen and lesson player. Release metadata is in `package.json` and `src/version.js`; update both together.

Includes revised Geography teaching and review sessions, smart-board activities, optional extra-time practice, printable lesson/homework worksheets, and two introductory 7B conversational English lessons with Chinese vocabulary help. See `docs/geography-audit.md`, `docs/worksheets.md` and `docs/english-7b.md`. Existing multilingual independent-study exports remain separate from these teacher-led additions.

Uses the existing main/root GitHub Pages deployment without a build step.

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

## Version 2.3.0 — workbook trial lessons

Adds a separate Global Perspectives workbook trial category with two page-aligned lessons each for 7B (Book 7), 7A (Book 8), and 8th Grade (Book 9). Each lesson includes a 40-minute core, ten optional practice minutes, examples and teacher notes. Existing curriculum lessons and student study guides are preserved. The 7A starter activity includes a fullscreen question bank with all five choices.

Validation: 50 automated tests and browser checks for all six lessons, plus question-bank display, dismissal, focus restoration and mobile layout.

## Version 2.2.0 — interactive perspectives and simpler English

Rebuilds Grade 8 Global Perspectives Lesson 3 with voting, role cards, a guessing game and a group decision with a surprise choice. Simplifies learner-facing English across lessons and regenerates student study pages and translations. Validation: 48 unit tests and 86 browser screens, including answer reveals, saved progress and classroom layout. Publishes through the existing main/root GitHub Pages deployment.
