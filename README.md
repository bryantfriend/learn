# Learn

**Clear routines. Active learning.**

[Open the published classroom app](https://bryantfriend.github.io/learn/).

A teacher-operated, whole-class lesson player for **Mr. Friend · Oxford International School**. Grades 7–8; no student devices, accounts, worksheets, or external videos.

## Available lessons

Use **Choose class & lesson**: select **7A**, **7B**, or **8th Grade**, then **Geography** or **Global Perspectives**, then a lesson. Tap **Start lesson** or **Resume lesson**.

- **Ready to Learn: Notice, Think, Explain** — the original 40-minute lesson, eight stages.
- **Mission: Learn How We Learn** — a 35–40-minute system practice lesson, nine stages. [Practice lesson guide](./docs/system-practice.md).

The two existing lessons are shared starters available in every class and subject. Grade 8 Global Perspectives includes 38 teaching lessons and five printable assessments; 7A includes 33 Geography sessions and 62 GP sessions, including five assessments per subject. 7B includes 63 Geography and 93 Stage 6 GP sessions, including five printable assessments per subject. Each class/subject/lesson keeps its own progress. Starting again requires confirmation only for that same saved lesson. The home card offers **Resume last class**; the class chip in the player opens the picker.

## Teach the first lesson

**Ready to Learn: Notice, Think, Explain** — 40 minutes.

1. Open the published site on the smart board. The initial page load needs an internet connection.
2. Tap **Choose class & lesson**, choose your class and subject, select **Ready to Learn**, and tap **Start lesson**.
3. Tap **Fullscreen** if the board supports it. The normal browser window works too.
4. Use **Next step** for the current stage's reveals and **Next stage** for the next section. **Back** and the stage-title menu preserve earlier reveal steps.
5. Use **Attention** during partner talk; wait for 3, 2, 1, then allow processing time. Tap **Resume lesson** yourself.
6. Open **Timer** and explicitly start it when needed. At zero, it says **Time to regroup** and does nothing else.
7. The final screen says **Listen for dismissal**. Dismiss the class yourself.

All content is available with zero stars. Teacher notes are in **Teacher tools → Read this stage’s teacher notes** and are visible to students when opened. They are not a private or authenticated area.

### Lesson sequence

| Stage | Planned minutes | Main learning |
|---|---:|---|
| Arrive and begin | 4 | Entry routine; what helps us learn |
| Our three routines | 3 | Instructions, agreed places, starting/help |
| Practise the attention signal | 3 | Actual Attention button, practised twice |
| Notice or think? | 5 | Observations, inferences, alternative explanations |
| Think, pair, share | 7 | Quiet thinking, partner talk, shared evidence |
| See it or think it? | 8 | Six A/B cards with teacher-controlled explanations |
| Spot my mistake | 5 | Challenge “definitely”; improve the explanation |
| Exit and finish | 5 | Reflect, tidy, listen for dismissal |

The lesson is a general introduction, not a claim of alignment with an unseen curriculum.

## Controls and recovery

- **Attention:** pauses a running timer, covers the lesson, counts down 3–2–1, then gives calm instructions. Resume returns to the exact previous stage and reveal; only a previously running timer resumes.
- **Pause:** a neutral pause screen with the same timer behavior, without a countdown.
- **Restart lesson:** inside Teacher tools, with confirmation. Clears progress, reveals, timer and stars; keeps the class label.
- **Timer:** Start/Pause/Resume, Reset and +30 seconds. Changing a stage or reveal step prepares its suggested timer paused. Timing uses deadlines, not interval counts. One page-level scheduler updates the display.
- **A/B:** select a response to discuss. It does not mark correctness or count votes. **Reveal explanation** shows the answer only on a teacher tap.
- **Working mode:** tap the labeled mode chip to set Listen, Think quietly, Talk with your partner, or Share with the class.
- **Class stars:** hidden by default. Teacher tools can show them, add one, or undo the most recent award. They are optional acknowledgements, not grades, punishments, or a gate.
- **Escape:** closes a dialog; on Attention/Pause it restores the lesson. Browser fullscreen Escape behavior is not intercepted.
- **Clear saved session:** confirmed removal of only the current class/subject/lesson checkpoint, then home. Other lessons are kept.

**Progress is saved only in this browser. It does not sync between your laptop and the classroom board.**

Only non-sensitive lesson state goes into localStorage: schema/lesson identifiers, class and subject, stage/steps, revealed answers and selected discussion response, timer checkpoint, stars and display preferences. Do not enter student names. There is no backend, login, monitoring, attendance, recording, or student profile.

On refresh, open **Resume last class**, or use the picker to resume another saved lesson. The timer accounts for elapsed time but is always restored **paused**, even if it had been running. A timer paused by an overlay remains paused after recovery. Invalid or outdated progress is ignored with a message. Storage failures leave the lesson usable in memory. If clearing storage is denied, browser settings may be needed to remove older saved data.

Lesson text loads at startup. Geography diagrams load from local site assets when first shown. **There is no service worker. A first visit or page reload is not guaranteed offline.**

## Adding your plans

Classes and subjects live in `src/catalog.js`. Register complete lessons in `src/lessons.js` and add `catalog: { subjectId: 'geography', grades: [7], unit: 'Unit title', order: 1 }` to subject lessons. Use `global-perspectives` for the second subject. Grades `[7]` share content between 7A and 7B with separate progress; add `classes: ['7a']` to restrict a course to 7A; `[8]` targets 8th Grade. Keep lesson IDs stable. Lessons without catalog metadata remain shared starters. See [the classroom shell guide](./docs/classroom-shell.md).

## Local preview

Requirements: a modern browser; Node.js 18+ only for the optional local server/tests. There is no production build or install step.

```sh
npm start
```

Open **http://127.0.0.1:4173/learn/**. This intentionally tests the GitHub Pages project path.

Alternatively, run `python -m http.server 4173` from the repository and open `http://localhost:4173/`. Use an HTTP server, not a `file://` URL, for JavaScript modules.

## Tests

```sh
npm test
```

Runs 31 dependency-free Node tests for lesson structure, deadline timers, recovery and storage validation.

Browser acceptance tests use the Playwright library and Chromium only as development tools. Reuse an existing installation by setting `PLAYWRIGHT_MODULE` to its absolute module directory, then:

```sh
npm run test:browser
npm run test:practice
npm run test:classroom
```

If none is installed:

```sh
npm install --no-save --package-lock=false playwright
npx playwright install chromium
npm run test:browser
```

No browser-testing package is loaded by the published application. Screenshots and test reports are written to ignored `output/playwright/`. The second browser suite covers the practice lesson end to end. See [TESTING.md](./TESTING.md) for actual results and smart-board checks.

## Publishing with GitHub Pages

The verified Git remote is **https://github.com/bryantfriend/learn.git**. Use the existing `origin`; do not replace it.

For this static project:
1. Commit reviewed application files to `main` and push `origin main`.
2. A repository owner/administrator selects **Settings → Pages → Build and deployment → Deploy from a branch**.
3. Select **main**, folder **/ (root)**, then Save.
4. Wait for the Pages deployment to succeed.
5. Open the URL reported by GitHub Pages. Check that Start new lesson, Attention and question explanations work there before class.

No secrets or environment variables are required. `.nojekyll` keeps this a plain static site. All asset URLs are relative and work under `/learn/`. Repository ownership/Pages administration is needed only for GitHub publishing, not classroom use. See [DEPLOYMENT.md](./DEPLOYMENT.md) for the verified deployment result.

## Important files

- `index.html`: static entry point and accessible dialog container.
- `styles.css`: calm board layout, touch controls, responsive and reduced-motion rules.
- `src/app.js`: rendering, teacher actions and a single timer scheduler.
- `src/lessons.js`: original lesson, registry, modes and shared question options.
- `src/lessons/system-practice.js`: complete nine-stage practice lesson and teacher scripts.
- `src/progress.js`: response keys and honest completion-summary counts.
- `src/timer.js`: deadline-based pure timer operations.
- `src/storage.js`: safe versioned persistence and recovery.
- `assets/schoolyard.svg`: original imaginary schoolyard; no outside imagery.
- `scripts/serve.cjs`: optional dependency-free local preview server.
- `tests/core.test.js`, `tests/practice.test.js`, `tests/browser.cjs`, `tests/practice-browser.cjs`: automated checks.

## Adding a future lesson

Add a lesson data module under `src/lessons/` and register it in the `lessons` array exported by `src/lessons.js`. The picker, stage count and saved-state validation use the selected lesson. Give each lesson and discussion prompt a stable ID.

Reuse frames with instructions, quotes, choices, memory items or configurable questions. Questions can define options, an answer/explanation, a suggested-answer label, or an open response. Opinion frames have no correctness reveal. Per-frame mode, voiceLevel, timerSeconds, nextLabel and teacher-controlled transitions use the same player. Numeric response IDs and shared responseIndex values are validated against the lesson data.

Keep storage schema compatibility when changing existing lesson IDs or frame order. Schema 1 sessions from the first release migrate to schema 2 under the same localStorage key. Summary counts are presentation records and explicit discussion confirmations, not student assessments. See the practice guide for the exact definition.

## Limits

- This is not a behaviour record or a replacement for school policy.
- Modern Chromium is automated-tested. Verify fullscreen and touch on the actual board once; older board browsers may need an update.
- The three requested desktop board sizes are tested at 100% browser zoom. Narrow phones/tablets reflow and may scroll; the classroom board is the primary surface.
- No first-load/reload offline guarantee, multi-device sync, student login, or authoring interface.

## Grade 8 plan (v1.3.0)

Grade 8 now offers Global Perspectives only; Geography remains for 7A and 7B. Open Year plan & calendar from the Grade 8 picker to browse 43 imported topics by quarter, including objectives and resources. Weekly pacing usually starts at three lessons and can be adjusted to two, one or zero without fixed weekdays. All topics are now playable; assessment sessions include printable four-option tests and separate answer keys. See [plan source and calendar notes](./docs/grade8-gp-plan.md).

## Playable Grade 8 course (v1.4.0)

All 43 plan entries are now playable: 38 teaching lessons and five assessment sessions. Use quarter filters in the Grade 8 picker. Each assessment has a self-contained 16-question, four-option student paper and separate explained teacher key. Open [printable assessments](./exams/) and use Print / Save as PDF. See [teaching and printing guide](./docs/playable-gp-lessons.md).

## Grade 7A courses (v1.5.0)

Geography combines each teaching week's activities into one lesson, with optional extensions. GP adapts its weekly plan to two lessons. Use the 7A weekly plan or quarter filters to launch 95 sessions. Ten printable assessments have 12 questions each, four choices per question, and separate explained keys. See [coverage and source notes](./docs/grade7a-course.md).

## 7B younger-group courses (v1.6.0)

Use the existing 7B class for the supplied Stage 6 GP and chapters 3–5 Geography plans. The schedule is three GP and two Geography sessions per regular teaching week. All 156 sessions are playable, with guided examples and weekly tasks; ten assessment points include printable four-choice papers and separate keys. See [7B coverage and teaching notes](./docs/grade7b-course.md).

## Visual lessons (v1.7.0)

The 269 curriculum teaching sessions now open with visual challenges. Explore animated processes, diagrams, lesson-data charts, runoff experiments and budget choices. Play starts motion; Next focus reveals a teaching prompt; Enlarge opens a board-sized view. See [visual lesson controls and coverage](./docs/visual-lessons.md).


## 7B GP Lesson 2 (v1.7.2)

“What is an Issue and a Perspective?” is a bespoke 40-minute lesson: observe a shared playground, distinguish an issue from a perspective and a fact, explain two pupils’ reasons, consider missing voices, answer three four-option checks, then transfer the skill to a library case. Six inline SVG illustrations use teacher-controlled focus steps and enlarged views. All scenarios are fictional. The rewritten lesson resets only its obsolete checkpoint while retaining class preferences; other lessons keep their saved progress.

Validation: `npm test`; `node tests/issue-perspective-browser.cjs` (set `PLAYWRIGHT_MODULE` if Playwright is outside the project). Browser checks cover every lesson frame, answer reveals, diagram focus/enlargement, summary, reload, and responsive layout. The existing visual-controls and 7B workflow checks also pass.
