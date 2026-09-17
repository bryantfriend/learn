# Mission: Learn How We Learn

Lesson ID: `system-practice-01` · Grades 7–8 · approximately 35–40 minutes.

This is a practice lesson for the Learn classroom system, not an academic unit or behaviour lecture. Students respond from their seats; only the teacher uses the smart board.

## Open it

On home, tap **Choose lesson → Mission: Learn How We Learn → Start new lesson**. The existing observation/inference lesson remains available. Selecting a lesson does not overwrite progress; starting a new session requires confirmation when one is saved. **Resume lesson** always restores the saved lesson, even if a different lesson is currently selected on home.

## The nine stages

| Time | Stage | Practice |
|---|---|---|
| 0–4 | Welcome mission | Read the board, choose one of six skills silently |
| 4–7 | First system test | LISTEN, then 45-second partner talk and real Attention |
| 7–12 | Would you rather? | Three cycles of think → fingers A/B → partner reasons → Attention |
| 12–17 | Follow the sequence | Four seated movement rounds, one instruction per teacher tap |
| 17–23 | Odd one out | Four rounds; suggested answers and defensible alternatives |
| 23–28 | Memory challenge | Nine-item grid; manual Hide, quiet recall, partner talk, manual Reveal |
| 28–34 | Quick class quiz | Six simple A/B questions, highlighted responses and explicit reveals |
| 34–37 | System challenge | Think at voice 0, partners at voice 2, Attention, share at voice 3 |
| 37–40 | Exit reflection | Three prompts, two suggested responses, teacher-controlled finish |

All 47 teaching steps and 13 answer reveals are in lesson data. The memory grid uses labeled system emoji, with no outside image requests. Emoji appearance can vary with the smart board’s operating system.

## Using the controls

- **Voice levels** are shown inside the existing working-mode button: 0 for quiet thinking/listening, 2 for partners or short discussion, 3 for sharing with the class. The mode button can override the current mode; the next step restores its suggested mode and voice level.
- **Attention/Pause** use the original overlays and timer behavior. The First System Test adds its requested “Nice…” acknowledgement when the teacher taps Resume after Attention, on the same teaching step. Other Attention returns preserve the prompt. Previously running timers resume; paused ones stay paused.
- **Memory:** optionally start the 12-second timer. At zero, items remain visible. Tap **Hide items**, then **Tell your partner**, then **Reveal all nine items** yourself. The saved step determines whether items are hidden or shown after a refresh.
- **Questions:** highlight any offered response without exposing correctness. Tap Reveal when ready. Opinion questions never show a correct answer. Odd-one-out answers are explicitly suggestions; encourage reasonable alternatives.
- **Teacher scripts:** open Teacher tools → Read this stage’s teacher notes. The first stage includes the full requested opening script. These notes are visible to the class.
- **Stars:** optional and manual, as before. “Smooth transitions” is a suggested reason, not an automatic scoring rule.

## An honest completion summary

The final dismissal screen has **View lesson summary**:

- **Stages completed X / 9:** only stages for which every teaching step was shown and every required answer was revealed. Jumping to a stage or directly to the end does not complete skipped material.
- **Questions discussed:** the number of distinct prompts the teacher marked using **Mark discussed**. Opening, selecting or revealing an answer never increases this automatically. Tap **✓ Discussed** again to undo a mistaken confirmation. There are 20 countable discussion prompts if all are used.
- **Class stars:** included only while stars are enabled.
- **Session duration:** approximate wall-clock elapsed time from starting the lesson until first opening the summary, including pauses and time away. Revisiting teaching steps reopens the session duration. This is not a measure of active learning time.

None of these numbers is a student score, behaviour judgement or evidence of mastery. No student names are stored.

## Implementation

The shell and existing timer module are retained. Small shared extensions:

- `src/lessons/system-practice.js`: complete practice content.
- `src/lessons.js`: lesson registry, shared option lookup, voice defaults.
- `src/app.js`: picker in the current home card, configurable question choices, opinion/open-response rendering, memory grid, optional Attention acknowledgement, notes and summary.
- `src/progress.js`: shared response keys and summary calculations.
- `src/storage.js`: lesson-aware validation and schema 2 migration. The old storage key stays in use so schema 1 saved lessons migrate without losing stage, reveal, timer, label or stars.
- `styles.css`: content-only additions for choices, memory, voice labels and summary; the shell is unchanged.
- `package.json`: version 1.1.0 and test commands.
- `tests/practice.test.js`, `tests/practice-browser.cjs`: new coverage.
- README, TESTING, DEPLOYMENT and this guide: updated handoff.

## Testing and remaining classroom checks

Automated: 12 unit tests, the 12 original browser acceptance groups, and seven practice-lesson browser acceptance groups. The practice run covers every step, Attention with a running timer, paused timer recovery, every answer reveal, memory visibility through timer expiry and refresh, both lesson selections, honest summary counts, optional stars, and no console errors. Every practice frame is checked before/after reveals at 1920 × 1080, 1366 × 768 and 1280 × 720 with the timer visible.

On the actual smart board, check touch and fullscreen once, whether the system emoji are distinct, whether students at the back can read the choices, and whether 12 seconds for memory and 30–45 seconds for partner talk feel appropriate. Those classroom judgements cannot be established by browser automation.
