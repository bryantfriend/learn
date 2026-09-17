# Learn

**Clear routines. Active learning.**

[Open the published classroom app](https://bryantfriend.github.io/learn/).

A teacher-operated, whole-class lesson player for **Mr. Friend · Oxford International School**. Grades 7–8; no student devices, accounts, worksheets, or external videos.

## Teach the first lesson

**Ready to Learn: Notice, Think, Explain** — 40 minutes.

1. Open the published site on the smart board. The initial page load needs an internet connection.
2. Tap **Start new lesson**. The class label is optional. Starting over asks for confirmation if progress exists.
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
- **Clear saved session:** confirmed removal of the class label and all progress, then home.

**Progress is saved only in this browser. It does not sync between your laptop and the classroom board.**

Only non-sensitive lesson state goes into localStorage: schema/lesson identifiers, optional class label, stage/steps, revealed answers and selected discussion response, timer checkpoint, stars and display preferences. Do not enter student names. There is no backend, login, monitoring, attendance, recording, or student profile.

On refresh, open **Resume lesson**. The timer accounts for elapsed time but is always restored **paused**, even if it had been running. A timer paused by an overlay remains paused after recovery. Invalid or outdated progress is ignored with a message. Storage failures leave the lesson usable in memory. If clearing storage is denied, browser settings may be needed to remove older saved data.

All first-lesson text and the local SVG load at startup. Navigating a loaded lesson makes no new content requests. **There is no service worker. A first visit or page reload is not guaranteed offline.**

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

Runs six dependency-free Node tests for lesson structure, deadline timers, recovery and storage validation.

Browser acceptance tests use the Playwright library and Chromium only as development tools. Reuse an existing installation by setting `PLAYWRIGHT_MODULE` to its absolute module directory, then:

```sh
npm run test:browser
```

If none is installed:

```sh
npm install --no-save --package-lock=false playwright
npx playwright install chromium
npm run test:browser
```

No browser-testing package is loaded by the published application. Screenshots and test reports are written to ignored `output/playwright/`. See [TESTING.md](./TESTING.md) for actual results and smart-board checks.

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
- `src/lessons.js`: complete eight-stage lesson, modes, prompts, explanations and notes.
- `src/timer.js`: deadline-based pure timer operations.
- `src/storage.js`: safe versioned persistence and recovery.
- `assets/schoolyard.svg`: original imaginary schoolyard; no outside imagery.
- `scripts/serve.cjs`: optional dependency-free local preview server.
- `tests/core.test.js`, `tests/browser.cjs`: automated checks.

## Adding a future lesson

The first version deliberately exposes one complete lesson, not placeholder cards or an authoring interface.

To adapt a lesson, edit the data in `src/lessons.js`: give it a new stable ID, title, duration and stages. Each stage supplies its duration, notes and frames. A frame contains a title, working mode, optional instructions/quote/choices, optional visual, suggested timer seconds, and next-action label. Question frames add an answer and explanation.

For a second selectable lesson, export a small lesson collection and add selection on home; resolve the saved lesson ID against that collection in storage. Generalize response-key validation (currently the six questions in stage 6) and the eight-stage display count. Reuse the existing player and timer rather than copying the app. Bump the storage schema if the saved shape changes. Add a rendering type only for a genuinely new activity.

## Limits

- This is not a behaviour record or a replacement for school policy.
- Modern Chromium is automated-tested. Verify fullscreen and touch on the actual board once; older board browsers may need an update.
- The three requested desktop board sizes are tested at 100% browser zoom. Narrow phones/tablets reflow and may scroll; the classroom board is the primary surface.
- No first-load/reload offline guarantee, multi-device sync, student login, or authoring interface.
